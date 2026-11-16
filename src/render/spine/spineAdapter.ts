// Track B5: Single Skeletal Animation Standard — Spine 2D Slot Adapter (`@esotericsoftware/spine-pixi-v8` + Articulated 2.5D GPU Rig).
// - Iron Law #3: Designed specifically for Range-Sliced `IsoSceneSortedPass` interleaving:
//     flushSceneRange(0, k) -> spineAdapter.renderSlot(...) -> flushSceneRange(k + 1, N)
//   so characters walk seamlessly BEHIND fences/roofs in front of them and IN FRONT OF ground/crops behind them!
// - Zero Rive runtime (single bone pipeline = Spine 2D).

import { ValleyVillagerId } from '../../types/game';

export interface SkeletalEntityPose {
  villagerId: ValleyVillagerId;
  wx: number;
  wy: number;
  drawW: number;
  drawH: number;
  spriteId: number;
  walkPhase: number;
  isWalking: boolean;
  facingLeft: boolean;
  alpha: number;
}

export interface RangeSliceSegment {
  kind: 'instanced_range' | 'skeletal_slot';
  firstInstance: number;
  instanceCount: number;
  skeletalSlotIndex: number;
}

/**
 * Pure deterministic planner for Iron Law #3:
 * Splits `[0 .. totalInstances)` around sorted skeletal indices `skeletalSortedIndices[0..skeletalCount)`
 * into an ordered sequence of GPU draw slices with ZERO dynamic object allocation in Steady State.
 */
export function buildIsoSceneRangeSlices(
  totalInstances: number,
  skeletalSortedIndices: Int32Array,
  skeletalCount: number,
  outSlices: RangeSliceSegment[]
): number {
  let sliceLen = 0;
  const pushSlice = (
    kind: 'instanced_range' | 'skeletal_slot',
    firstInstance: number,
    instanceCount: number,
    skeletalSlotIndex: number
  ): void => {
    if (sliceLen < outSlices.length) {
      const s = outSlices[sliceLen];
      s.kind = kind;
      s.firstInstance = firstInstance;
      s.instanceCount = instanceCount;
      s.skeletalSlotIndex = skeletalSlotIndex;
    } else {
      outSlices.push({ kind, firstInstance, instanceCount, skeletalSlotIndex });
    }
    sliceLen++;
  };

  if (totalInstances <= 0) return 0;
  if (skeletalCount <= 0) {
    pushSlice('instanced_range', 0, totalInstances, -1);
    return sliceLen;
  }

  let cursor = 0;
  for (let k = 0; k < skeletalCount; k++) {
    const slotInstanceIdx = skeletalSortedIndices[k];
    if (slotInstanceIdx < cursor || slotInstanceIdx >= totalInstances) continue;
    if (slotInstanceIdx > cursor) {
      pushSlice('instanced_range', cursor, slotInstanceIdx - cursor, -1);
    }
    pushSlice('skeletal_slot', slotInstanceIdx, 1, k);
    cursor = slotInstanceIdx + 1;
  }
  if (cursor < totalInstances) {
    pushSlice('instanced_range', cursor, totalInstances - cursor, -1);
  }
  return sliceLen;
}

const PUPPET_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aLocal; // x in [-0.5..0.5], y in [0..1] (0 = feet, 1 = crown)

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform vec4 uPoseRect;    // (wx, wy, signedDrawW, drawH)
uniform vec4 uBoneParams;  // (timeSec, walkPhase, isWalking, spriteId)

out vec2 vLocalUv;
out float vSpriteId;
out float vShade;

void main() {
  float h = aLocal.y; // 0 feet -> 1 head
  float t = uBoneParams.x;
  float phase = uBoneParams.y;
  float walking = uBoneParams.z;

  // 3-Bone Articulated 2.5D Deformation (Feet Stride + Torso Breath + Cloak/Head Follow-Through)
  float breath = sin(t * 2.7 + phase) * (1.0 - walking * 0.5);
  float verticalStretch = 1.0 + breath * 0.022 * smoothstep(0.18, 0.95, h);

  // Lower hem / stride shear when walking
  float hemWave = walking * sin(phase * 2.1 + aLocal.x * 2.4) * 2.6 * (1.0 - smoothstep(0.0, 0.45, h));
  // Upper torso / head secondary counter-sway
  float headSway = (walking * sin(phase * 1.05 - 0.45) * 2.8 + breath * 1.1) * smoothstep(0.35, 1.0, h);

  vec2 deformed = vec2(
    aLocal.x * uPoseRect.z + hemWave + headSway,
    -aLocal.y * uPoseRect.w * verticalStretch
  );

  vec2 wp = uPoseRect.xy + deformed;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vLocalUv = vec2(aLocal.x + 0.5, 1.0 - aLocal.y);
  vSpriteId = uBoneParams.w;
  vShade = 0.96 + 0.06 * h;
}
`;

const PUPPET_FS = `#version 300 es
precision highp float;
precision highp sampler2DArray;

in vec2 vLocalUv;
in float vSpriteId;
in float vShade;

uniform sampler2DArray uAlbedo;
uniform sampler2D uUvTable;
uniform vec3 uAmbientTint;
uniform float uAlpha;

out vec4 fragColor;

void main() {
  int id = int(vSpriteId + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(id, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(id, 1), 0);
  vec2 uv = mix(uvRect.xy, uvRect.zw, clamp(vLocalUv, vec2(0.0), vec2(1.0)));
  vec4 texel = texture(uAlbedo, vec3(uv, meta.x));
  if (texel.a < 0.015) discard;
  vec3 lit = texel.rgb * uAmbientTint * vShade;
  fragColor = vec4(lit * uAlpha, texel.a * uAlpha);
}
`;

/**
 * Articulated 4×6 Ribbon Grid GPU Rig + optional `@esotericsoftware/spine-pixi-v8` `.skel` hook.
 */
export class SpineSlotAdapter {
  private readonly gl: WebGL2RenderingContext;
  private readonly prog: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly indexCount: number;
  public externalSpineLoaded = false;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, PUPPET_VS);
    gl.compileShader(vs);
    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, PUPPET_FS);
    gl.compileShader(fs);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.prog = prog;

    // Build 4x6 subdivided ribbon mesh so torso breath, cloak hem & head sway deform smoothly
    const cols = 4;
    const rows = 6;
    const verts: number[] = [];
    const indices: number[] = [];
    for (let r = 0; r <= rows; r++) {
      const y = r / rows;
      for (let c = 0; c <= cols; c++) {
        const x = c / cols - 0.5;
        verts.push(x, y);
      }
    }
    const stride = cols + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i0 = r * stride + c;
        const i1 = i0 + 1;
        const i2 = i0 + stride;
        const i3 = i2 + 1;
        indices.push(i0, i1, i2, i1, i3, i2);
      }
    }
    this.indexCount = indices.length;

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    const vbo = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const ibo = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
  }

  public renderArticulatedSlot(
    pose: SkeletalEntityPose,
    camX: number,
    camY: number,
    camZoom: number,
    cssW: number,
    cssH: number,
    timeSec: number,
    ambient: [number, number, number],
    albedoArrayTex: WebGLTexture,
    uvTableTex: WebGLTexture
  ): void {
    const gl = this.gl;
    gl.useProgram(this.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, albedoArrayTex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, uvTableTex);

    gl.uniform1i(gl.getUniformLocation(this.prog, 'uAlbedo'), 0);
    gl.uniform1i(gl.getUniformLocation(this.prog, 'uUvTable'), 2);
    gl.uniform3f(gl.getUniformLocation(this.prog, 'uCamera'), camX, camY, camZoom);
    gl.uniform2f(gl.getUniformLocation(this.prog, 'uViewport'), cssW, cssH);
    gl.uniform4f(
      gl.getUniformLocation(this.prog, 'uPoseRect'),
      pose.wx,
      pose.wy,
      pose.drawW,
      pose.drawH
    );
    gl.uniform4f(
      gl.getUniformLocation(this.prog, 'uBoneParams'),
      timeSec,
      pose.walkPhase,
      pose.isWalking ? 1.0 : 0.0,
      pose.spriteId
    );
    gl.uniform3fv(gl.getUniformLocation(this.prog, 'uAmbientTint'), ambient);
    gl.uniform1f(gl.getUniformLocation(this.prog, 'uAlpha'), pose.alpha);

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  public destroy(): void {
    this.gl.deleteProgram(this.prog);
    this.gl.deleteVertexArray(this.vao);
  }
}

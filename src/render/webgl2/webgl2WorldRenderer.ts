// Mốc 1–5 Vertical Slice: True Multi-Pass WebGL2 2.5D GPU World Renderer.
// - Dùng `TEXTURE_2D_ARRAY` (`sampler2DArray`) gộp toàn bộ thung lũng đã sort tô-pô (`IsoSceneSortedPass`) chỉ trong ~8–10 GPU Draw Calls.
// - Tự động bake 2.5D Bevel Normal Map + Mặt nạ cửa sổ phát sáng (Emissive Window Mask) ngay trên GPU khi nạp sprite (0ms vòng lặp pixel CPU).
// - Bao gồm: Sông Ottery khúc xạ caustics + bọt bờ SDF + sóng gợn tương tác, Thảm cỏ GPU Instancing rẽ theo trỏ chuột & bước chân NPC,
//   Forward 2.5D Normal Lighting + Đũa phép Lumos động + Dual-Pass Kawase HDR Bloom.

import { getCatalogItem } from '../../data/catalog';
import { ZONES } from '../../data/zones';
import { shouldGroundBlend } from '../../engine/groundBlend';
import {
  Camera,
  ELEV_PX,
  gridToScreen,
  rotateGridRect,
  TILE_H,
  TILE_W,
  worldIso,
} from '../../engine/isometric';
import {
  resolveBuildingInWorldTimerInfo,
  ScreenHotspot,
} from '../../engine/rendererShared';
import {
  resolveCatalogPropSpriteKey,
  SpriteRegistry,
  SpriteSource,
} from '../../engine/spriteLoader';
import type { ParkSimulation } from '../../sim/simulation';
import {
  GPU_QUALITY_PROFILES,
  GpuFrameStats,
  GpuMockSettings,
} from '../core/renderDevice';
import { PixiGpuDevice } from '../pixi/pixiGpuDevice';
import { getSpriteLightingProfile } from '../spriteLightingProfile';
import {
  buildIsoSceneRangeSlices,
  RangeSliceSegment,
  SpineSlotAdapter,
} from '../spine/spineAdapter';
import {
  GameplayRenderOverlay,
  GRASS_STRIDE,
  INTERACTOR_STRIDE,
  LIGHT_STRIDE,
  PARTICLE_STRIDE,
  SCENE_STRIDE,
  SpriteAtlasHandle,
  SpriteIdResolver,
  TERRAIN_STRIDE,
  WATER_STRIDE,
  WorldRenderSnapshotCollector,
} from '../worldSnapshot';

const ATLAS_SIZE = 2048;

const YULE_BAKED_HALO_CLEANSE_KEYS: ReadonlySet<string> = new Set([
  'yule_floating_candelabra',
  'yule_goblet_blue_brazier',
  'yule_hogwarts_boathouse_ice',
  'yule_snowdrop_moss_log',
  'yule_hermione_bluebell_jars',
  'yule_glowing_puffapod_bush',
]);

/**
 * Xác định các công trình & cây cối gốc của Hang Sóc – Hogsmeade được phủ tuyết tự động bằng GPU shader
 * vào mùa Đông / lễ hội Noel (loại trừ toàn bộ `yule_*` và `snowy_pines` vốn đã vẽ sẵn tuyết, cũng như ô đất phẳng & UI).
 */
export function canSpriteReceiveWinterSnowCap(key: string): boolean {
  if (
    key.startsWith('conn:') ||
    key.startsWith('yule_') ||
    key.startsWith('ui_icon_') ||
    key.startsWith('m3_') ||
    key.startsWith('beast_') ||
    key.startsWith('vehicle_') ||
    key.startsWith('staff_') ||
    key.startsWith('guest_') ||
    key.startsWith('prop_') ||
    key.startsWith('crop_plot_') ||
    key === 'snowy_pines' ||
    key === 'env_pine_snow' ||
    key === 'catalog_floating_candles_post' ||
    key === 'catalog_patronus_ward_lantern'
  ) {
    return false;
  }
  return shouldGroundBlend(key);
}

/**
 * Xác định nhóm sprite Noel có quầng mờ bán trong suốt vẽ sẵn cho Canvas 2D cũ,
 * để GPU gọt sạch sương đục ngoài rìa và nhường cho HDR Dual-Kawase Bloom toả sáng trong trẻo.
 */
export function shouldCleanseSpriteBakedHalo(key: string): boolean {
  return YULE_BAKED_HALO_CLEANSE_KEYS.has(key);
}
const ATLAS_LAYERS = 8;
const MAX_PACKED_SPRITES = 512;
const ATLAS_PAD = 2;

function compileShader(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || 'Unknown shader compile error';
    gl.deleteShader(sh);
    throw new Error(`[WebGL2 Shader] ${info}`);
  }
  return sh;
}

function createProgram(gl: WebGL2RenderingContext, vsSrc: string, fsSrc: string): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(prog) || 'Unknown program link error';
    gl.deleteProgram(prog);
    throw new Error(`[WebGL2 Link] ${info}`);
  }
  return prog;
}

const FULLSCREEN_VS = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 pos = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = pos;
  gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}
`;

// GPU Bake Pass: computes 2.5D rounded silhouette bevel normals + dome foliage relief + smart local-contrast window emissive!
const BAKE_NORMAL_FS = `#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
uniform sampler2DArray uAlbedo;
uniform float uLayer;
uniform vec2 uTexel;
uniform int uLightingProfile; // 0 = non-emissive organic/dome, 1 = framed architectural windows, 2 = magic/lantern glow
uniform vec4 uSpriteBounds;   // (x0, y0, w, h) in normalized atlas space
out vec4 fragColor;

float luma(vec3 c) {
  return dot(c, vec3(0.299, 0.587, 0.114));
}

vec4 samplePremulUnpacked(vec2 uv) {
  vec4 s = texture(uAlbedo, vec3(clamp(uv, vec2(0.0), vec2(1.0)), uLayer));
  if (s.a > 0.004) {
    s.rgb /= s.a;
  }
  return s;
}

void main() {
  vec4 c = samplePremulUnpacked(vUv);
  if (c.a < 0.02) {
    fragColor = vec4(0.5, 0.5, 1.0, 0.0);
    return;
  }

  // Multi-scale silhouette bevel + interior painterly relief
  vec2 r1 = uTexel * 2.0;
  vec2 r2 = uTexel * 6.5;

  float aL1 = texture(uAlbedo, vec3(vUv - vec2(r1.x, 0.0), uLayer)).a;
  float aR1 = texture(uAlbedo, vec3(vUv + vec2(r1.x, 0.0), uLayer)).a;
  float aU1 = texture(uAlbedo, vec3(vUv - vec2(0.0, r1.y), uLayer)).a;
  float aD1 = texture(uAlbedo, vec3(vUv + vec2(0.0, r1.y), uLayer)).a;

  float aL2 = texture(uAlbedo, vec3(vUv - vec2(r2.x, 0.0), uLayer)).a;
  float aR2 = texture(uAlbedo, vec3(vUv + vec2(r2.x, 0.0), uLayer)).a;
  float aU2 = texture(uAlbedo, vec3(vUv - vec2(0.0, r2.y), uLayer)).a;
  float aD2 = texture(uAlbedo, vec3(vUv + vec2(0.0, r2.y), uLayer)).a;

  float lL = luma(samplePremulUnpacked(vUv - vec2(r1.x, 0.0)).rgb);
  float lR = luma(samplePremulUnpacked(vUv + vec2(r1.x, 0.0)).rgb);
  float lU = luma(samplePremulUnpacked(vUv - vec2(0.0, r1.y)).rgb);
  float lD = luma(samplePremulUnpacked(vUv + vec2(0.0, r1.y)).rgb);

  // Screen Y points downward: silhouette empty above -> normal points UP (negative screen Y)
  float nx = (aL1 - aR1) * 0.85 + (aL2 - aR2) * 1.15 + (lL - lR) * 0.45;
  float ny = (aU1 - aD1) * 0.85 + (aU2 - aD2) * 1.15 + (lU - lD) * 0.45;
  if (uLightingProfile == 0) {
    vec2 localUv = clamp((vUv - uSpriteBounds.xy) / max(uSpriteBounds.zw, vec2(0.0001)), vec2(0.0), vec2(1.0));
    vec2 dome = vec2(localUv.x - 0.5, localUv.y - 0.45) * 0.85;
    nx = mix(nx, nx + dome.x, 0.35);
    ny = mix(ny, ny + dome.y, 0.35);
  }
  vec3 n = normalize(vec3(nx, ny, 1.0));

  // Detect warm lit cottage windows & magical cores with lighting-profile discipline
  float lum = luma(c.rgb);
  float warmth = c.r * 0.58 + c.g * 0.42 - c.b * 0.72;
  float emissive = 0.0;
  if (uLightingProfile == 2) {
    float warmGlow = smoothstep(0.20, 0.46, warmth) * smoothstep(0.54, 0.82, lum);
    float magicCore = smoothstep(0.18, 0.46, max(c.g, c.b) - c.r * 0.78) * smoothstep(0.52, 0.85, lum);
    emissive = clamp(max(warmGlow, magicCore * 0.96), 0.0, 1.0);
  } else if (uLightingProfile == 1) {
    float minNeighborLum = min(min(lL, lR), min(lU, lD));
    float localContrast = clamp((lum - minNeighborLum - 0.08) / 0.24, 0.0, 1.0);
    float warmWindow = smoothstep(0.24, 0.50, warmth) * smoothstep(0.64, 0.90, lum);
    float magicPane = smoothstep(0.20, 0.48, max(c.g, c.b) - c.r * 0.78) * smoothstep(0.60, 0.88, lum);
    emissive = clamp(max(warmWindow, magicPane * 0.92) * mix(0.14, 1.0, localContrast), 0.0, 1.0);
  }

  fragColor = vec4(n * 0.5 + 0.5, emissive);
}
`;

const SKY_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform float uTime;
uniform int uPeriod; // 0 dawn, 1 day, 2 dusk, 3 night
uniform int uWeather; // 0 clear, 1 rain/storm, 2 snow
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  float y = 1.0 - vUv.y; // 0 top -> 1 bottom
  vec3 topCol;
  vec3 botCol;
  if (uPeriod == 0) {
    topCol = vec3(0.36, 0.64, 0.94);
    botCol = vec3(0.99, 0.88, 0.72);
  } else if (uPeriod == 2) {
    topCol = vec3(0.32, 0.34, 0.64);
    botCol = vec3(0.98, 0.68, 0.48);
  } else if (uPeriod == 3) {
    topCol = vec3(0.11, 0.19, 0.40);
    botCol = vec3(0.24, 0.38, 0.64);
  } else {
    topCol = vec3(0.36, 0.68, 0.96);
    botCol = vec3(0.90, 0.96, 1.0);
  }

  if (uWeather == 1) {
    topCol = mix(topCol, vec3(0.38, 0.48, 0.60), 0.42);
    botCol = mix(botCol, vec3(0.62, 0.70, 0.80), 0.42);
  }

  vec3 col = mix(topCol, botCol, smoothstep(0.0, 1.0, y));

  // Twinkling pinpoint night/dusk stars & subtle emerald-violet aurora ribbon
  if (uPeriod == 3 || uPeriod == 2) {
    float starStrength = uPeriod == 3 ? 1.0 : 0.35;
    vec2 starUv = vUv * vec2(140.0, 82.0);
    vec2 grid = floor(starUv);
    vec2 f = fract(starUv);
    float h = hash(grid);
    if (h > 0.945 && y < 0.68) {
      vec2 starCenter = vec2(hash(grid + vec2(13.7, 5.3)), hash(grid + vec2(29.1, 41.9))) * 0.56 + 0.22;
      float d = length(f - starCenter);
      float pinpoint = smoothstep(0.14, 0.015, d);
      float tw = 0.45 + 0.55 * sin(uTime * (2.2 + h * 4.5) + h * 40.0);
      col += vec3(0.95, 0.98, 1.25) * pinpoint * tw * starStrength;
    }
    if (uPeriod == 3) {
      float auroraWave = sin(vUv.x * 5.5 + uTime * 0.28) * 0.05 + sin(vUv.x * 11.0 - uTime * 0.19) * 0.025;
      float band = exp(-pow((y - (0.24 + auroraWave)) * 9.5, 2.0));
      float yuleBoost = uWeather == 2 ? 1.85 : 1.0;
      col += mix(vec3(0.06, 0.52, 0.38), vec3(0.28, 0.18, 0.58), vUv.x) * band * 0.28 * yuleBoost;
      if (uWeather == 2) {
        float highCurtain = exp(-pow((y - (0.14 - auroraWave * 0.7)) * 11.0, 2.0));
        col += mix(vec3(0.14, 0.58, 0.82), vec3(0.56, 0.24, 0.72), 1.0 - vUv.x) * highCurtain * 0.30;
      }
    }
  }

  fragColor = vec4(col, 1.0);
}
`;

const TERRAIN_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner; // [-1..1] diamond corner
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec3 iBaseColor;
layout(location = 3) in vec3 iMeta; // [pathCode, elevAndUnlock, terrainKindCode]

uniform vec3 uCamera; // (camX, camY, zoom)
uniform vec2 uViewport;

out vec2 vLocal;
out vec2 vWorldPos;
out vec3 vColor;
out vec3 vMeta;

void main() {
  // Expand diamond by 1.036 so adjacent tiles fuse seamlessly without hairline gaps or grid lines
  vec2 offset = vec2(aCorner.x * ${TILE_W * 0.5 * 1.036}, aCorner.y * ${TILE_H * 0.5 * 1.036});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vColor = iBaseColor;
  vMeta = iMeta;
}
`;

const TERRAIN_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in vec2 vWorldPos;
in vec3 vColor;
in vec3 vMeta;

uniform float uTime;
uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform int uLightCount;
uniform vec4 uLightPosRad[16]; // (wx, wy, z, radius)
uniform vec4 uLightColInt[16]; // (r, g, b, intensity)

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm3(vec2 p) {
  float v = 0.0;
  v += 0.55 * vnoise(p);
  v += 0.30 * vnoise(p * 2.07 + vec2(19.3, 7.1));
  v += 0.15 * vnoise(p * 4.13 + vec2(43.7, 29.5));
  return v;
}

void main() {
  float manhattan = abs(vLocal.x) + abs(vLocal.y);
  if (manhattan > 1.038) discard;

  // Isometric ground-plane projection (2:1 foreshortening correction) so meadow patches look round in 2.5D
  vec2 isoPos = vec2(vWorldPos.x, vWorldPos.y * 1.92);
  float terrainKind = vMeta.z; // 0 = meadow, 1 = forest, 2 = stone, 3 = snow
  vec3 col = vColor;

  if (terrainKind < 1.5) {
    // 1. Continuous Zero-Seam Rolling Meadow Glades (Playrix Township / Hay Day Cozy 2.5D)
    float hill = fbm3(isoPos * 0.0052);
    float glade = fbm3(isoPos * 0.0145 + vec2(31.4, 12.8));

    // Vibrant emerald valley hollows -> rich meadow lawn -> warm sun-kissed golden-chartreuse hilltops
    vec3 deepHollow = vColor * vec3(0.76, 0.88, 0.78);
    vec3 sunlitCrest = min(vec3(1.0), vColor * vec3(1.42, 1.24, 1.06) + vec3(0.06, 0.05, 0.0));
    col = mix(deepHollow, vColor, smoothstep(0.22, 0.50, hill));
    col = mix(col, sunlitCrest, smoothstep(0.46, 0.78, hill * 0.68 + glade * 0.32) * 0.85);

    // 2. Soft Organic Clover Cushions with subtle top-left sunlit 2.5D rim
    float clover = vnoise(isoPos * 0.026 + vec2(11.0, 27.0)) * 0.65 + vnoise(isoPos * 0.058) * 0.35;
    float cloverNeighbor = vnoise((isoPos + vec2(3.5, 3.5)) * 0.026 + vec2(11.0, 27.0)) * 0.65
                         + vnoise((isoPos + vec2(3.5, 3.5)) * 0.058) * 0.35;
    float cloverMask = smoothstep(0.56, 0.73, clover);
    float cloverRim = clamp((clover - cloverNeighbor) * 2.2, -0.12, 0.22) * cloverMask;
    vec3 cloverHue = col * vec3(0.86, 1.05, 0.84) + vec3(0.02, 0.05, 0.01) + cloverRim * vec3(0.24, 0.28, 0.05);
    col = mix(col, cloverHue, cloverMask * 0.50);

    // 3. Velvety Gouache Directional Brushstroke Micro-Fiber (replaces flat plastic fill up close)
    float brushBroad = vnoise(vec2(vWorldPos.x * 0.19, vWorldPos.y * 0.46));
    float brushFine = vnoise(vec2(vWorldPos.x * 0.46 + 9.2, vWorldPos.y * 1.08));
    float stroke = (brushBroad - 0.5) * 0.07 + (brushFine - 0.5) * 0.04;
    col += stroke * vec3(0.10, 0.12, 0.02);

    // 4. Crisp Bright Winter Snow Blanket across the entire meadow (zero muddy/green blotches!)
    if (uWinterSnow > 0.01) {
      float snowField = fbm3(isoPos * 0.0095 + vec2(71.2, 19.6));
      float snowCover = mix(0.95, 1.0, smoothstep(0.12, 0.48, snowField));
      float snowDriftCrest = smoothstep(0.42, 0.78, snowField);
      vec3 snowBase = vec3(0.92, 0.96, 1.0);
      vec3 snowCrest = vec3(0.99, 0.995, 1.0) + (brushBroad - 0.5) * 0.015;
      vec3 crispSnow = mix(snowBase, snowCrest, snowDriftCrest);
      col = mix(col, crispSnow, snowCover * uWinterSnow * 0.99);
    }
  } else {
    float macro = vnoise(isoPos * 0.018);
    float detail = vnoise(isoPos * 0.095);
    col = vColor * (0.94 + macro * 0.11 + (detail - 0.5) * 0.05);
  }

  // Sculpted 2.5D Voronoi Cobblestone / Timber / Flagstone Paths — 100% Seamless Across Connected Tiles!
  int rawPath = int(vMeta.x + 0.5);
  int basePathKind = rawPath & 3;
  int curbMask = rawPath >> 2;
  if (basePathKind > 0) {
    // u in [-1..1] along rx, v in [-1..1] along ry; fade ONLY on outer curb edges where neighbor is grass!
    float u = vLocal.x + vLocal.y;
    float v = vLocal.y - vLocal.x;
    float curbDist = 2.0;
    if ((curbMask & 1) != 0) curbDist = min(curbDist, 1.0 + v); // ry - 1 grass bank
    if ((curbMask & 4) != 0) curbDist = min(curbDist, 1.0 - v); // ry + 1 grass bank
    if ((curbMask & 8) != 0) curbDist = min(curbDist, 1.0 + u); // rx - 1 grass bank
    if ((curbMask & 2) != 0) curbDist = min(curbDist, 1.0 - u); // rx + 1 grass bank

    float edgeWave = (vnoise(isoPos * 0.15) - 0.5) * 0.18;
    float warpedCurb = curbDist + edgeWave;
    float earthVerge = smoothstep(0.02, 0.34, warpedCurb);
    float roadMask = smoothstep(0.12, 0.38, warpedCurb);

    vec2 cellUv = vec2(vWorldPos.x * 0.125, vWorldPos.y * 0.235);
    vec2 baseCell = floor(cellUv);
    vec2 fracCell = fract(cellUv);
    float minDist = 8.0;
    float secondDist = 8.0;
    vec2 bestVec = vec2(0.0);
    float stoneHue = 0.5;
    for (int oy = -1; oy <= 1; oy++) {
      for (int ox = -1; ox <= 1; ox++) {
        vec2 neighbor = vec2(float(ox), float(oy));
        vec2 cid = baseCell + neighbor;
        vec2 jitter = vec2(hash(cid), hash(cid + vec2(37.0, 19.0))) * 0.72 + 0.14;
        vec2 diff = neighbor + jitter - fracCell;
        float d = length(diff);
        if (d < minDist) {
          secondDist = minDist;
          minDist = d;
          bestVec = diff;
          stoneHue = hash(cid + vec2(91.0, 13.0));
        } else if (d < secondDist) {
          secondDist = d;
        }
      }
    }
    float edgeGap = secondDist - minDist;
    float stoneMask = smoothstep(0.055, 0.14, edgeGap);
    float bevel = clamp(0.88 + (-bestVec.x * 0.55 - bestVec.y * 0.75) * 0.60, 0.68, 1.18);
    vec3 mortarCol = vec3(0.28, 0.21, 0.14);
    vec3 baseStone = basePathKind == 1
      ? mix(vec3(0.62, 0.49, 0.34), vec3(0.79, 0.65, 0.47), stoneHue)
      : basePathKind == 2
        ? mix(vec3(0.52, 0.36, 0.20), vec3(0.66, 0.47, 0.28), stoneHue)
        : mix(vec3(0.72, 0.69, 0.63), vec3(0.85, 0.82, 0.76), stoneHue);
    vec3 roadCol = mix(mortarCol, baseStone * bevel, stoneMask);
    vec3 vergeCol = mix(vec3(0.50, 0.40, 0.26), vec3(0.88, 0.93, 0.99), uWinterSnow * 0.92);
    col = mix(col, mix(col * 0.90, vergeCol, 0.58), earthVerge * (1.0 - roadMask) * 0.80);
    col = mix(col, roadCol, roadMask * 0.98);
  } else if (terrainKind > 1.5 && terrainKind < 2.5) {
    // Subtle plaza slab bevel ONLY on stone terrain — NEVER draw diamond grid seams on grass/snow!
    float edge = smoothstep(0.88, 1.0, manhattan);
    col *= 1.0 - edge * 0.045;
  }

  // Whisper-soft drifting cloud breeze (never darkens white winter snow!)
  float cloud = vnoise(isoPos * 0.0022 + vec2(uTime * 0.028, -uTime * 0.016));
  float cloudShadow = smoothstep(0.58, 0.84, cloud) * 0.04;
  col *= 1.0 - cloudShadow;

  // Apply time-of-day ambient & soft-compressed dynamic 2.5D ground light spill (prevents multi-lamp blowout on snow!)
  vec3 lit = col * uAmbientTint;
  vec3 pointSum = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec2 d = (vWorldPos - lp.xy) * vec2(1.0, 1.65); // Isometric ground ellipse correction
    float dist = length(d);
    float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.15);
    pointSum += lc.rgb * (att * lc.w * 0.52);
  }
  pointSum = pointSum / (vec3(1.0) + pointSum * 1.15);
  lit += col * pointSum * 0.55 + pointSum * 0.08;

  // Bright pastel frost glaze over locked outer zones (never dark!)
  if (vMeta.y >= 9.5) {
    lit = mix(lit, uAmbientTint * vec3(0.94, 0.97, 1.0), 0.14);
  }

  fragColor = vec4(lit, 1.0);
}
`;

const WATER_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec4 iWaterMeta; // [shoreMask, depthFactor, unlocked, seed]

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vLocal;
out vec2 vWorldPos;
out vec4 vWaterMeta;

void main() {
  vec2 offset = vec2(aCorner.x * ${TILE_W * 0.5 * 1.045}, aCorner.y * ${TILE_H * 0.5 * 1.045});
  vec2 wp = iWorldPos + offset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aCorner;
  vWorldPos = wp;
  vWaterMeta = iWaterMeta;
}
`;

const WATER_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in vec2 vWorldPos;
in vec4 vWaterMeta;

uniform float uTime;
uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform vec3 uSkyReflectColor;
uniform vec3 uSunColor;
uniform int uInteractorCount;
uniform vec4 uInteractors[16]; // (wx, wy, radius, strength)
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float causticPattern(vec2 uv, float t) {
  vec2 p1 = uv * 0.075 + vec2(t * 0.35, t * 0.22);
  vec2 p2 = uv * 0.092 - vec2(t * 0.28, -t * 0.31);
  float w1 = sin(p1.x * 6.283 + sin(p1.y * 6.283));
  float w2 = cos(p2.y * 6.283 + cos(p2.x * 6.283));
  return pow(clamp((w1 * w2) * 0.5 + 0.5, 0.0, 1.0), 3.2);
}

void main() {
  float manhattan = abs(vLocal.x) + abs(vLocal.y);
  if (manhattan > 1.04) discard;

  // Dual-octave flow-mapped water normal
  vec2 flowUv = vec2(vWorldPos.x * 0.038, vWorldPos.y * 0.068);
  float n1 = vnoise(flowUv + vec2(uTime * 0.55, uTime * 0.85));
  float n2 = vnoise(flowUv * 2.1 - vec2(uTime * 0.42, -uTime * 0.62));
  vec2 waveGrad = vec2(n1 - n2, (n1 + n2) - 1.0) * 0.55;

  // Interactive concentric ripples around cursor & riverside villagers!
  float interactiveRing = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= uInteractorCount) break;
    vec4 intr = uInteractors[i];
    float d = length((vWorldPos - intr.xy) * vec2(1.0, 1.7));
    if (d < intr.z * 1.35) {
      float falloff = smoothstep(intr.z * 1.35, 0.0, d);
      float ring = sin(d * 0.36 - uTime * 6.8) * falloff * intr.w;
      interactiveRing += ring;
      waveGrad += normalize(vWorldPos - intr.xy + vec2(0.001)) * ring * 0.35;
    }
  }

  vec3 waterDeep = mix(vec3(0.06, 0.44, 0.64), vec3(0.05, 0.34, 0.56), uWinterSnow);
  vec3 waterShallow = mix(vec3(0.16, 0.72, 0.80), vec3(0.32, 0.76, 0.92), uWinterSnow);
  vec3 baseWater = mix(waterShallow, waterDeep, vWaterMeta.y);

  // Refractive sunlit caustics dancing on shallow pebbles
  float caus = causticPattern(vWorldPos + waveGrad * 22.0, uTime);
  baseWater += uSunColor * caus * (1.25 - vWaterMeta.y * 0.55) * 0.42;

  // Sky reflection + sparkling sun/moon specular glints
  vec3 normal = normalize(vec3(waveGrad.x, waveGrad.y, 1.0));
  vec3 sunDir = normalize(vec3(-0.45, -0.55, 0.70));
  float spec = pow(max(dot(normal, sunDir), 0.0), 22.0);
  vec3 col = mix(baseWater * uAmbientTint, uSkyReflectColor, 0.12);
  col += uSunColor * spec * 0.95;
  col += vec3(0.75, 0.96, 1.0) * max(0.0, interactiveRing) * 0.28;

  // Subtle crystalline glacier ice floes drifting along River Ottery in Winter Christmas mode!
  if (uWinterSnow > 0.01) {
    vec2 floeUv = vec2(vWorldPos.x * 0.052, vWorldPos.y * 0.088 + uTime * 0.05);
    float floeField = vnoise(floeUv) * 0.72 + vnoise(floeUv * 2.4 + vec2(7.3, 19.1)) * 0.28;
    float floeRim = smoothstep(0.74, 0.78, floeField);
    float floeCore = smoothstep(0.78, 0.84, floeField);
    vec3 iceRimCol = vec3(0.56, 0.86, 0.99) * max(uAmbientTint, vec3(0.45));
    vec3 iceTopCol = vec3(0.95, 0.985, 1.0) * max(uAmbientTint, vec3(0.52));
    col = mix(col, iceRimCol, floeRim * uWinterSnow * 0.85);
    col = mix(col, iceTopCol, floeCore * uWinterSnow * 0.92);
  }

  // Organic SDF shoreline foam / crystalline snowy frost shelf where water meets riverbanks
  int mask = int(vWaterMeta.x + 0.5);
  if (mask > 0) {
    // vLocal.x = drx - dry, vLocal.y = drx + dry  =>  u = 2*drx [-1..1], v = 2*dry [-1..1]
    float u = (vLocal.x + vLocal.y); // [-1..1] along rx
    float v = (vLocal.y - vLocal.x); // [-1..1] along ry
    float shoreDist = 2.0;
    if ((mask & 1) != 0) shoreDist = min(shoreDist, 1.0 + v); // ry - 1 bank
    if ((mask & 4) != 0) shoreDist = min(shoreDist, 1.0 - v); // ry + 1 bank
    if ((mask & 8) != 0) shoreDist = min(shoreDist, 1.0 + u); // rx - 1 bank
    if ((mask & 2) != 0) shoreDist = min(shoreDist, 1.0 - u); // rx + 1 bank
    float waveNoise = vnoise(vWorldPos * 0.09 + vec2(uTime * 0.9, -uTime * 0.6)) * 0.14;
    float lap = sin(uTime * 2.6 + (vWorldPos.x + vWorldPos.y) * 0.065) * 0.06 + waveNoise;
    float foamWidth = mix(0.28, 0.42, uWinterSnow);
    float foam = smoothstep(foamWidth + lap * (1.0 - uWinterSnow * 0.55), 0.04, shoreDist);
    vec3 shoreCol = mix(vec3(0.90, 0.98, 1.0), vec3(0.95, 0.985, 1.0), uWinterSnow);
    col = mix(col, shoreCol * max(uAmbientTint, vec3(0.48)), foam * mix(0.72, 0.92, uWinterSnow));
  }

  // Shimmering reflections of nearby 2.5D lanterns, Floo fire & Lumos wand on water!
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec2 d = (vWorldPos - lp.xy) * vec2(1.0, 1.55);
    float dist = length(d);
    if (dist < lp.w * 1.15) {
      float att = pow(clamp(1.0 - dist / (lp.w * 1.15), 0.0, 1.0), 1.8);
      float shimmer = 0.65 + 0.35 * sin(waveGrad.x * 9.0 + uTime * 5.0);
      col += lc.rgb * att * lc.w * shimmer * 0.72;
    }
  }

  fragColor = vec4(col, 0.96);
}
`;

// Pass 3: GPU Instanced Multi-Blade Fanned Painterly Grass Tufts + 5-Petal Cozy Cottage Wildflowers!
const GRASS_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuadVert; // x in [-0.5..0.5], y in [0..1] (0 = root, 1 = crown)
layout(location = 1) in vec2 iWorldPos;
layout(location = 2) in vec4 iGrassMeta; // [height, hueVar, phase, isFlower]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform float uTime;
uniform float uWindStrength;
uniform int uInteractorCount;
uniform vec4 uInteractors[16];

out vec2 vTuftUv;
out float vHueVar;
out float vFlower;
out vec2 vWorldPos;

void main() {
  float t = aQuadVert.y;
  float bendWeight = t * t;

  // Gentle rolling meadow wind gusts sweeping across the valley
  float gust = sin(iWorldPos.x * 0.015 + iWorldPos.y * 0.012 - uTime * 2.15 + iGrassMeta.z)
             + 0.42 * sin(iWorldPos.x * 0.038 - uTime * 3.6 + iGrassMeta.z * 1.7);
  vec2 bendOffset = vec2(gust * 3.1 * uWindStrength, abs(gust) * 0.65 * uWindStrength) * bendWeight;

  // Interactive proximity bending away from cursor & walking villagers!
  for (int i = 0; i < 16; i++) {
    if (i >= uInteractorCount) break;
    vec4 intr = uInteractors[i];
    vec2 diff = iWorldPos - intr.xy;
    vec2 isoDiff = diff * vec2(1.0, 1.65);
    float dist = length(isoDiff);
    if (dist < intr.z && dist > 0.001) {
      float push = smoothstep(intr.z, 0.0, dist) * intr.w;
      vec2 dir = normalize(diff);
      bendOffset += vec2(dir.x * 10.5, dir.y * 5.0 + 2.6) * push * bendWeight;
    }
  }

  float quadWidth = iGrassMeta.w > 0.5 ? 11.5 : (11.5 + iGrassMeta.y * 3.5);
  float quadHeight = iGrassMeta.x;
  vec2 localOffset = vec2(aQuadVert.x * quadWidth, -t * quadHeight) + bendOffset;
  vec2 wp = iWorldPos + localOffset;

  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  vTuftUv = aQuadVert; // x in [-0.5..0.5], y in [0..1]
  vHueVar = iGrassMeta.y;
  vFlower = iGrassMeta.w;
  vWorldPos = iWorldPos;
}
`;

const GRASS_FS = `#version 300 es
precision highp float;
in vec2 vTuftUv;
in float vHueVar;
in float vFlower;
in vec2 vWorldPos;

uniform float uWinterSnow;
uniform vec3 uAmbientTint;
uniform vec3 uSunColor;
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

float bladeShape(vec2 uv, float baseX, float lean, float h, float wBase) {
  if (uv.y > h || uv.y < 0.0) return 0.0;
  float yn = uv.y / h;
  float center = baseX + lean * yn * yn;
  // Soft rounded painterly blade (tapers gently with rounded tip, never needle-sharp)
  float halfW = wBase * (1.0 - 0.72 * yn * yn) * smoothstep(1.0, 0.84, yn);
  float d = abs(uv.x - center);
  return smoothstep(halfW + 0.032, max(0.0, halfW - 0.025), d);
}

void main() {
  vec2 uv = vTuftUv;
  float alpha = 0.0;
  vec3 col = vec3(0.0);
  float shadeGrad = clamp(uv.y, 0.0, 1.0);

  if (vFlower < 0.5) {
    // Unified Plump 3-Leaf Fanned Meadow Cushion (overlapping leaves = zero comb-teeth, warmer/brighter than turf!)
    float flip = vHueVar > 0.5 ? -1.0 : 1.0;
    float leafL = bladeShape(uv, -0.11 * flip, -0.19 * flip, 0.78, 0.185);
    float leafC = bladeShape(uv,  0.00,         0.02 * flip, 0.96, 0.205);
    float leafR = bladeShape(uv,  0.11 * flip,  0.19 * flip, 0.74, 0.180);
    float mask = max(leafC, max(leafL, leafR));
    float rootFade = smoothstep(0.04, 0.34, uv.y);
    alpha = mask * rootFade * 0.88;
    if (alpha < 0.02) discard;

    vec3 baseCol = mix(vec3(0.36, 0.66, 0.17), vec3(0.42, 0.71, 0.19), vHueVar);
    vec3 tipCol = mix(vec3(0.56, 0.83, 0.24), vec3(0.68, 0.88, 0.28), vHueVar);
    col = mix(baseCol, tipCol, smoothstep(0.18, 0.90, uv.y));

    if (uWinterSnow > 0.01) {
      vec3 frostBase = vec3(0.74, 0.84, 0.92);
      vec3 frostTip = vec3(0.96, 0.985, 1.0);
      vec3 winterTuft = mix(frostBase, frostTip, smoothstep(0.22, 0.84, uv.y));
      col = mix(col, winterTuft, uWinterSnow * 0.94);
      alpha *= mix(1.0, 0.68, uWinterSnow);
    }
  } else {
    // Cozy 5-Petal Cottage Wildflower (Cream Daisy / Golden Buttercup / Lavender / Blush Rose)
    float stem = bladeShape(uv, 0.0, (vHueVar - 0.5) * 0.10, 0.68, 0.068);
    float leafL = bladeShape(uv, -0.08, -0.18, 0.44, 0.075);
    float leafR = bladeShape(uv,  0.08,  0.18, 0.42, 0.075);
    float foliageMask = max(stem, max(leafL, leafR)) * smoothstep(0.02, 0.22, uv.y);

    vec2 bp = vec2(uv.x - (vHueVar - 0.5) * 0.04, (uv.y - 0.70) * 1.12);
    float r = length(bp);
    float ang = atan(bp.y, bp.x) + vHueVar * 6.283;
    float petalRadius = 0.205 + 0.055 * cos(ang * 5.0);
    float petalMask = smoothstep(petalRadius + 0.032, petalRadius - 0.025, r);
    float centerMask = smoothstep(0.095, 0.055, r);

    alpha = max(foliageMask * 0.85, petalMask * 0.96);
    if (alpha < 0.02) discard;

    vec3 stemCol = mix(vec3(0.30, 0.58, 0.16), vec3(0.09, 0.44, 0.20), uWinterSnow * 0.92);
    vec3 summerPetalCol = vHueVar < 0.38
      ? vec3(0.99, 0.98, 0.92) // Cream cottage daisy
      : vHueVar < 0.68
        ? vec3(0.99, 0.84, 0.22) // Golden buttercup
        : vHueVar < 0.85
          ? vec3(0.84, 0.70, 0.99) // Soft lavender
          : vec3(0.99, 0.74, 0.85); // Blush rose
    vec3 winterHollyCol = vHueVar < 0.72
      ? vec3(0.86, 0.14, 0.16) // Glossy crimson Christmas holly berry
      : vec3(0.98, 0.99, 1.0); // Snowdrop white winter bloom
    vec3 petalCol = mix(summerPetalCol, winterHollyCol, uWinterSnow);
    vec3 summerHeartCol = vHueVar < 0.38 ? vec3(0.96, 0.65, 0.12) : vec3(0.99, 0.93, 0.58);
    vec3 winterHeartCol = vec3(1.0, 0.98, 0.96); // Crisp snow glint on holly berry
    vec3 heartCol = mix(summerHeartCol, winterHeartCol, uWinterSnow);
    vec3 bloomCol = mix(petalCol, heartCol, centerMask);
    col = mix(stemCol, bloomCol, petalMask);
    shadeGrad = mix(uv.y, 0.95, petalMask);
  }

  // Translucent sunlit tip rim + dynamic 2.5D point lights
  vec3 lit = col * uAmbientTint + uSunColor * (shadeGrad * shadeGrad * 0.10);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    float dist = length((vWorldPos - lp.xy) * vec2(1.0, 1.65));
    float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.0);
    lit += col * lc.rgb * (att * lc.w * 1.05);
  }

  fragColor = vec4(lit, alpha);
}
`;

// Pass 4a: Directional Projected Ground Shadows for IsoSceneSortedPass
const SHADOW_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // x in [-0.5..0.5], y in [0..1] (0 = bottom, 1 = top)
layout(location = 1) in vec4 iRect; // [wx, wy, drawW, drawH]
layout(location = 2) in vec4 iAnim; // [spriteId, swayAmp, rotRad, pivotY]
layout(location = 3) in vec4 iShade; // [alpha, shadowScale, emissiveBoost, phaseSeed]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform sampler2D uUvTable;
uniform vec2 uShadowSkew; // directional sun shadow offset per unit height
uniform float uTime;
uniform float uWindStrength;

out vec2 vUv;
flat out float vLayer;
out float vShadowAlpha;

void main() {
  if (iShade.y <= 0.01 || iShade.x <= 0.35) {
    gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
    vUv = vec2(0.0);
    vLayer = 0.0;
    vShadowAlpha = 0.0;
    return;
  }

  int sid = int(iAnim.x + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(sid, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(sid, 1), 0);

  float flipSign = iRect.z < 0.0 ? -1.0 : 1.0;
  float absW = abs(iRect.z);
  float h = iRect.w;
  float yNorm = aQuad.y;

  float sway = sin(uTime * 1.9 + iShade.w) * iAnim.y * uWindStrength * (yNorm * yNorm);
  // Project upright silhouette onto the isometric ground plane with sun skew
  vec2 groundOffset = vec2(
    aQuad.x * absW * 0.92 + uShadowSkew.x * yNorm * (h * 0.018) + sway * 0.6,
    -yNorm * h * 0.28 + uShadowSkew.y * yNorm * (h * 0.018)
  );

  vec2 wp = iRect.xy + groundOffset;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  float uCoord = flipSign < 0.0 ? (0.5 - aQuad.x) : (aQuad.x + 0.5);
  vUv = mix(uvRect.xy, uvRect.zw, vec2(uCoord, 1.0 - yNorm));
  vLayer = meta.x;
  vShadowAlpha = 0.38 * iShade.y * (1.0 - yNorm * 0.48);
}
`;

const SHADOW_FS = `#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
flat in float vLayer;
in float vShadowAlpha;

uniform sampler2DArray uAlbedo;
uniform vec3 uShadowTint;
out vec4 fragColor;

void main() {
  float a = texture(uAlbedo, vec3(vUv, vLayer)).a;
  if (a < 0.08) discard;
  float sa = a * vShadowAlpha;
  fragColor = vec4(uShadowTint * sa, sa);
}
`;

// Pass 4b: Unified IsoSceneSortedPass with 2.5D Normal-Mapped Sun & Point Lights + Warm Emissive Windows!
const SCENE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // x in [-0.5..0.5], y in [0..1] (0 = bottom, 1 = top)
layout(location = 1) in vec4 iRect; // [wx, wy, drawW, drawH]
layout(location = 2) in vec4 iAnim; // [spriteId, swayAmp, rotRad, pivotY]
layout(location = 3) in vec4 iShade; // [alpha, shadowScale, emissiveBoost, phaseSeed]

uniform vec3 uCamera;
uniform vec2 uViewport;
uniform sampler2D uUvTable;
uniform float uTime;
uniform float uWindStrength;

out vec2 vUv;
flat out float vLayer;
flat out float vFlipSign;
flat out float vTintFlag;
flat out float vSnowCapEligible;
flat out float vHaloCleanse;
out vec2 vWorldPos;
out float vHeightPx;
out float vYNorm;
out float vAlpha;
out float vEmissiveBoost;

void main() {
  int sid = int(iAnim.x + 0.5);
  vec4 uvRect = texelFetch(uUvTable, ivec2(sid, 0), 0);
  vec4 meta = texelFetch(uUvTable, ivec2(sid, 1), 0);

  float flipSign = iRect.z < 0.0 ? -1.0 : 1.0;
  float absW = abs(iRect.z);
  float h = iRect.w;
  float yNorm = aQuad.y;

  // Local sprite coordinates anchored at (0, pivotY)
  vec2 local = vec2(aQuad.x * absW, -(yNorm - iAnim.w) * h);
  if (abs(iAnim.z) > 0.0001) {
    float c = cos(iAnim.z);
    float s = sin(iAnim.z);
    local = vec2(local.x * c - local.y * s, local.x * s + local.y * c);
  }

  // Base-pinned organic wind sway on trees, bushes & mature crops!
  float sway = (sin(uTime * 2.05 + iShade.w) + 0.4 * sin(uTime * 3.7 + iShade.w * 1.9))
             * iAnim.y * uWindStrength * (yNorm * yNorm);
  local.x += sway;

  vec2 wp = iRect.xy + local;
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);

  float uCoord = flipSign < 0.0 ? (0.5 - aQuad.x) : (aQuad.x + 0.5);
  vUv = mix(uvRect.xy, uvRect.zw, vec2(uCoord, 1.0 - yNorm));
  vLayer = meta.x;
  vSnowCapEligible = meta.z;
  vHaloCleanse = meta.w;
  vFlipSign = flipSign;
  float decodedTint = floor(iShade.x * 0.5);
  vTintFlag = decodedTint;
  // Ground-projected world coordinate + vertical pixel elevation for accurate 2.5D 3D light vectors!
  vWorldPos = vec2(iRect.x + local.x, iRect.y);
  vHeightPx = yNorm * h * 0.72;
  vYNorm = yNorm;
  vAlpha = clamp(iShade.x - decodedTint * 2.0, 0.0, 1.0);
  vEmissiveBoost = iShade.z;
}
`;

const SCENE_FS = `#version 300 es
precision highp float;
precision highp sampler2DArray;
in vec2 vUv;
flat in float vLayer;
flat in float vFlipSign;
flat in float vTintFlag;
flat in float vSnowCapEligible;
flat in float vHaloCleanse;
in vec2 vWorldPos;
in float vHeightPx;
in float vYNorm;
in float vAlpha;
in float vEmissiveBoost;

uniform sampler2DArray uAlbedo;
uniform sampler2DArray uNormalEmissive;
uniform vec3 uAmbientTint;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uNormalStrength;
uniform float uWindowGlowStrength;
uniform float uWinterSnow;
uniform int uLightCount;
uniform vec4 uLightPosRad[16];
uniform vec4 uLightColInt[16];

out vec4 fragColor;

void main() {
  vec4 tex = texture(uAlbedo, vec3(vUv, vLayer));
  if (tex.a < 0.012) discard;

  // Un-premultiply BEFORE optional outer halo refinement so edge colors stay pure
  vec3 albedo = tex.rgb / max(tex.a, 0.004);
  if (vHaloCleanse > 0.5 && tex.a < 0.85) {
    tex.a = mix(tex.a, smoothstep(0.24, 0.80, tex.a), 0.76);
    if (tex.a < 0.015) discard;
  }

  vec4 ne = texture(uNormalEmissive, vec3(vUv, vLayer));
  float rawNy = ne.g * 2.0 - 1.0;

  // Procedural 2.5D Winter Roof & Bough Snow Cap on canon Hang Sóc structures (0 extra PNGs!)
  if (uWinterSnow > 0.01 && vSnowCapEligible > 0.5) {
    float drift = sin(vWorldPos.x * 0.19) * 0.5 + sin(vWorldPos.x * 0.47 + vHeightPx * 0.09) * 0.5;
    float upwardMask = smoothstep(-0.10 + drift * 0.08, -0.44 + drift * 0.06, rawNy);
    float heightGate = smoothstep(0.22, 0.44, vYNorm);
    float lumBase = dot(albedo, vec3(0.299, 0.587, 0.114));
    // Preserve dark painted outlines & warm glowing cottage windows
    float inkProtect = smoothstep(0.16, 0.34, lumBase);
    float windowProtect = 1.0 - smoothstep(0.16, 0.42, ne.a);
    float snowAmt = clamp(upwardMask * heightGate * inkProtect * windowProtect * uWinterSnow * 0.88, 0.0, 0.90);
    albedo = mix(albedo, vec3(0.94, 0.97, 1.0), snowAmt);
  }

  vec3 normal = normalize(vec3(
    (ne.r * 2.0 - 1.0) * vFlipSign * uNormalStrength,
    rawNy * uNormalStrength,
    1.0
  ));

  // 1. Energy-Conserving 2.5D Directional Shading (bright, clean Playrix storybook interior)
  float nDotSun = max(dot(normal, uSunDir), 0.0);
  float baseAo = mix(0.96, 1.0, clamp(vHeightPx / 26.0, 0.0, 1.0));
  vec3 totalLight = (uAmbientTint + uSunColor * (nDotSun * 0.56)) * baseAo;

  // 2. Dynamic 2.5D Point Lights (Floo Emerald Hearth, Yule Ice/Patronus, Warm Windows, Lumos Wand Cursor!)
  vec3 pointLightAccum = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    if (i >= uLightCount) break;
    vec4 lp = uLightPosRad[i];
    vec4 lc = uLightColInt[i];
    vec3 delta = vec3(
      lp.x - vWorldPos.x,
      (lp.y - vWorldPos.y) * 1.45,
      lp.z - vHeightPx
    );
    float dist = length(delta);
    if (dist < lp.w) {
      vec3 lDir = delta / max(dist, 0.001);
      float att = pow(clamp(1.0 - dist / lp.w, 0.0, 1.0), 2.05);
      float nDotL = mix(0.35, max(dot(normal, lDir), 0.0), clamp(uNormalStrength * 0.7, 0.0, 1.0));
      pointLightAccum += lc.rgb * (att * lc.w * nDotL * 1.18);
    }
  }
  totalLight += pointLightAccum / (vec3(1.0) + pointLightAccum * 0.72);

  vec3 lit = albedo * totalLight;

  // 3. Self-Illuminated Warm Cottage Windows & Cool Magical Emissive Cores (preserves sapphire/emerald flames!)
  float winMask = ne.a * vEmissiveBoost * uWindowGlowStrength;
  if (winMask > 0.01) {
    float coolMagic = clamp(max(albedo.b, albedo.g) - albedo.r * 0.82, 0.0, 1.0);
    vec3 coolHue = albedo * 1.18 + vec3(0.06, 0.16, 0.24);
    vec3 targetHue = mix(vec3(1.0, 0.78, 0.34), coolHue, smoothstep(0.04, 0.24, coolMagic));
    vec3 glowHue = mix(albedo, targetHue, 0.50);
    lit += glowHue * (winMask * 1.75);
  }

  // 4. Gameplay Build-Mode Ghost / Selection / Bulldoze Tinting (Track B3 Parity)
  if (vTintFlag > 0.5) {
    if (vTintFlag < 1.5) {
      // Valid placement: crisp emerald aura
      lit = mix(lit, vec3(0.32, 1.18, 0.62), 0.42);
    } else if (vTintFlag < 2.5) {
      // Blocked placement: warm crimson warning
      lit = mix(lit, vec3(1.25, 0.26, 0.24), 0.52);
    } else if (vTintFlag < 3.5) {
      // Selected building: golden highlight rim
      lit = lit * 1.12 + vec3(0.16, 0.12, 0.02);
    } else {
      // Bulldoze hover: warning amber-crimson pulse
      lit = mix(lit, vec3(1.30, 0.36, 0.18), 0.48);
    }
  }

  float outA = tex.a * vAlpha;
  fragColor = vec4(lit * outA, outA);
}
`;

// Pass 5: GPU Atmospheric Fireflies / Floo Sparks / Snow
const PARTICLE_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad; // [-0.5..0.5] x [-0.5..0.5]
layout(location = 1) in vec3 iPosSize; // [wx, wy, radius]
layout(location = 2) in vec3 iColor;

uniform vec3 uCamera;
uniform vec2 uViewport;

out vec2 vLocal;
out vec3 vColor;

void main() {
  vec2 wp = iPosSize.xy + aQuad * (iPosSize.z * 2.4);
  vec2 sp = uViewport * 0.5 + (wp - uCamera.xy) * uCamera.z;
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aQuad * 2.0;
  vColor = iColor;
}
`;

const PARTICLE_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in vec3 vColor;
uniform float uIsSnow;
out vec4 fragColor;

void main() {
  float d = length(vLocal);
  if (d > 1.0) discard;
  if (vColor.x < -0.5) {
    // Cozy rising chimney smoke / potion steam puff (vColor = [-1.0, alpha, warmth])
    vec3 smokeCol = mix(vec3(0.92, 0.90, 0.88), vec3(1.0, 0.89, 0.74), vColor.z);
    float puff = pow(1.0 - d, 1.85) * vColor.y;
    vec3 outSmoke = uIsSnow > 0.5 ? smokeCol : smokeCol * 0.30;
    fragColor = vec4(outSmoke, puff);
    return;
  }
  if (uIsSnow > 0.5) {
    // vColor = [spinPhase, styleSeed, alpha]
    // Directional 3D drop-shadow (never a concentric ring!) so pure white flakes stand out naturally on white snow
    float style = vColor.y;
    vec2 pBody = vLocal + vec2(0.06, 0.08);
    vec2 pShadow = vLocal - vec2(0.14, 0.18);
    if (style < 0.36) {
      float angB = atan(pBody.y, pBody.x) + vColor.x * 6.2831853;
      float starRB = mix(0.22, 0.86, pow(0.5 + 0.5 * cos(angB * 6.0), 2.6));
      float body = 1.0 - smoothstep(starRB * 0.45, starRB, length(pBody));

      float angS = atan(pShadow.y, pShadow.x) + vColor.x * 6.2831853;
      float starRS = mix(0.24, 0.88, pow(0.5 + 0.5 * cos(angS * 6.0), 2.6));
      float sh = (1.0 - smoothstep(starRS * 0.40, starRS, length(pShadow))) * 0.34;

      float alpha = clamp(body * 0.96 + sh * (1.0 - body), 0.0, 1.0) * vColor.z;
      vec3 col = mix(vec3(0.45, 0.66, 0.88), vec3(1.0, 1.0, 1.0), clamp(body * 1.15, 0.0, 1.0));
      fragColor = vec4(col, alpha);
    } else {
      float body = 1.0 - smoothstep(0.22, 0.62, length(pBody));
      float sh = (1.0 - smoothstep(0.20, 0.66, length(pShadow))) * 0.30;
      float alpha = clamp(body * 0.94 + sh * (1.0 - body), 0.0, 1.0) * vColor.z;
      vec3 col = mix(vec3(0.48, 0.69, 0.90), vec3(1.0, 1.0, 1.0), clamp(body * 1.15, 0.0, 1.0));
      fragColor = vec4(col, alpha);
    }
  } else {
    float glow = pow(1.0 - d, 2.4);
    fragColor = vec4(vColor * glow, glow);
  }
}
`;

// Pass 6: Dual-Kawase HDR Bloom Extract (Strictly > 1.12 HDR Sources Only!) & sRGB-Preserving Rich Composite
const BLOOM_EXTRACT_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
out vec4 fragColor;

void main() {
  vec3 c = texture(uScene, vUv).rgb;
  float brightness = max(max(c.r, c.g), c.b);
  // Threshold > 1.12 ensures white painted walls in daylight NEVER bleed milky haze; only true HDR lights bloom!
  float soft = clamp((brightness - 1.12) / 0.85, 0.0, 1.9);
  fragColor = vec4(c * soft * 0.62, 1.0);
}
`;

const BLOOM_BLUR_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uOffset;
out vec4 fragColor;

void main() {
  vec3 sum = texture(uTex, vUv).rgb * 0.28;
  sum += texture(uTex, vUv + vec2(uOffset.x, uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(-uOffset.x, uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(uOffset.x, -uOffset.y)).rgb * 0.18;
  sum += texture(uTex, vUv + vec2(-uOffset.x, -uOffset.y)).rgb * 0.18;
  fragColor = vec4(sum, 1.0);
}
`;

const COMPOSITE_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomIntensity;
out vec4 fragColor;

// Preserves 1:1 sRGB blacks & midtones in [0..0.86] so hand-painted outlines never look washed out,
// while smoothly rolling off HDR highlights (> 0.86) without harsh clipping!
vec3 srgbHdrShoulder(vec3 x) {
  const float k = 0.94;
  vec3 over = max(x - k, vec3(0.0));
  vec3 compressed = k + (1.0 - k) * (1.0 - exp(-over / (1.0 - k)));
  return clamp(mix(x, compressed, step(vec3(k), x)), 0.0, 1.0);
}

void main() {
  vec3 hdr = texture(uScene, vUv).rgb;
  vec3 bloom = texture(uBloom, vUv).rgb * uBloomIntensity;
  vec3 combined = hdr + bloom;

  // Bright, unvignetted Playrix-style composite (zero corner darkening or shadow crush!)
  vec3 col = srgbHdrShoulder(combined);
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(lum), col, 1.06), 0.0, 1.0);

  fragColor = vec4(col, 1.0);
}
`;

interface ShelfState {
  layer: number;
  curX: number;
  curY: number;
  rowH: number;
}

export class WebGL2WorldRenderer implements SpriteIdResolver {
  public readonly canvas: HTMLCanvasElement;
  public readonly gpuDevice: PixiGpuDevice;
  private readonly gl: WebGL2RenderingContext;
  private readonly sprites: SpriteRegistry;
  private readonly snapshot = new WorldRenderSnapshotCollector();
  private readonly spineAdapter: SpineSlotAdapter;
  private readonly rangeSlices: RangeSliceSegment[] = [];

  // Programs
  private readonly bakeNormalProg: WebGLProgram;
  private readonly skyProg: WebGLProgram;
  private readonly terrainProg: WebGLProgram;
  private readonly waterProg: WebGLProgram;
  private readonly grassProg: WebGLProgram;
  private readonly shadowProg: WebGLProgram;
  private readonly sceneProg: WebGLProgram;
  private readonly particleProg: WebGLProgram;
  private readonly bloomExtractProg: WebGLProgram;
  private readonly bloomBlurProg: WebGLProgram;
  private readonly compositeProg: WebGLProgram;

  // VAOs & Buffers
  private readonly emptyVao: WebGLVertexArrayObject;
  private readonly terrainVao: WebGLVertexArrayObject;
  private readonly terrainInstanceBuf: WebGLBuffer;
  private readonly waterVao: WebGLVertexArrayObject;
  private readonly waterInstanceBuf: WebGLBuffer;
  private readonly grassVao: WebGLVertexArrayObject;
  private readonly grassInstanceBuf: WebGLBuffer;
  private readonly sceneVao: WebGLVertexArrayObject;
  private readonly sceneInstanceBuf: WebGLBuffer;
  private readonly particleVao: WebGLVertexArrayObject;
  private readonly particleInstanceBuf: WebGLBuffer;

  // Texture2DArray & UV Lookup Table
  private readonly albedoArrayTex: WebGLTexture;
  private readonly normalEmissiveArrayTex: WebGLTexture;
  private readonly bakeFbo: WebGLFramebuffer;
  private readonly uvTableTex: WebGLTexture;
  private readonly uvTableData = new Float32Array(MAX_PACKED_SPRITES * 2 * 4);
  private uvTableDirty = false;
  private readonly spriteHandles = new Map<string, SpriteAtlasHandle>();
  private readonly shelf: ShelfState = { layer: 0, curX: ATLAS_PAD, curY: ATLAS_PAD, rowH: 0 };
  private readonly uploadScratchCanvas: HTMLCanvasElement;
  private readonly uploadScratchCtx: CanvasRenderingContext2D;
  private nextSpriteId = 0;

  // Offscreen Scene & Bloom FBOs
  private readonly useHalfFloatFbo: boolean;
  private fboW = 0;
  private fboH = 0;
  private sceneFbo: WebGLFramebuffer | null = null;
  private sceneColorTex: WebGLTexture | null = null;
  private bloomFboA: WebGLFramebuffer | null = null;
  private bloomTexA: WebGLTexture | null = null;
  private bloomFboB: WebGLFramebuffer | null = null;
  private bloomTexB: WebGLTexture | null = null;

  private uploadedStaticGen = -1;
  private uniformLocs = new WeakMap<WebGLProgram, Map<string, WebGLUniformLocation | null>>();
  private readonly lightPosUniform = new Float32Array(16 * 4);
  private readonly lightColUniform = new Float32Array(16 * 4);

  // Rolling FPS tracker
  private fpsAccumMs = 0;
  private fpsFrames = 0;
  private currentFps = 60;
  private lastFrameTs = 0;

  public stats: GpuFrameStats = {
    backend: 'webgl2',
    fps: 60,
    cpuCollectMs: 0,
    drawCalls: 0,
    terrainTiles: 0,
    waterTiles: 0,
    grassInstances: 0,
    sortedSprites: 0,
    particleInstances: 0,
    activeLights: 0,
    atlasLayers: 1,
    atlasSpritesPacked: 0,
    vramEstimateMb: 0,
  };

  constructor(canvas: HTMLCanvasElement, sprites: SpriteRegistry) {
    this.canvas = canvas;
    this.sprites = sprites;
    this.gpuDevice = new PixiGpuDevice({
      canvas,
      preserveDrawingBuffer: true,
      onContextRestored: () => {
        this.uploadedStaticGen = -1;
        this.uvTableDirty = true;
        this.uniformLocs = new WeakMap();
      },
    });
    const gl = this.gpuDevice.gl;
    this.gl = gl;
    this.useHalfFloatFbo = this.gpuDevice.supportsHalfFloatHdr;
    this.spineAdapter = new SpineSlotAdapter(gl);

    this.bakeNormalProg = createProgram(gl, FULLSCREEN_VS, BAKE_NORMAL_FS);
    this.skyProg = createProgram(gl, FULLSCREEN_VS, SKY_FS);
    this.terrainProg = createProgram(gl, TERRAIN_VS, TERRAIN_FS);
    this.waterProg = createProgram(gl, WATER_VS, WATER_FS);
    this.grassProg = createProgram(gl, GRASS_VS, GRASS_FS);
    this.shadowProg = createProgram(gl, SHADOW_VS, SHADOW_FS);
    this.sceneProg = createProgram(gl, SCENE_VS, SCENE_FS);
    this.particleProg = createProgram(gl, PARTICLE_VS, PARTICLE_FS);
    this.bloomExtractProg = createProgram(gl, FULLSCREEN_VS, BLOOM_EXTRACT_FS);
    this.bloomBlurProg = createProgram(gl, FULLSCREEN_VS, BLOOM_BLUR_FS);
    this.compositeProg = createProgram(gl, FULLSCREEN_VS, COMPOSITE_FS);

    this.emptyVao = gl.createVertexArray()!;

    // 1. Isometric Diamond Quad Geometry ([-1,0], [0,-1], [0,1], [1,0])
    const diamondVerts = new Float32Array([-1, 0, 0, -1, 0, 1, 1, 0]);
    const diamondBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuf);
    gl.bufferData(gl.ARRAY_BUFFER, diamondVerts, gl.STATIC_DRAW);

    this.terrainVao = gl.createVertexArray()!;
    this.terrainInstanceBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.terrainVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.terrainInstanceBuf);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, TERRAIN_STRIDE * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, TERRAIN_STRIDE * 4, 2 * 4);
    gl.vertexAttribDivisor(2, 1);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 3, gl.FLOAT, false, TERRAIN_STRIDE * 4, 5 * 4);
    gl.vertexAttribDivisor(3, 1);

    this.waterVao = gl.createVertexArray()!;
    this.waterInstanceBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.waterVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.waterInstanceBuf);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, WATER_STRIDE * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, WATER_STRIDE * 4, 2 * 4);
    gl.vertexAttribDivisor(2, 1);

    // 2. Upright Sprite & Painterly Grass Tuft Quad (x in [-0.5..0.5], y in [0..1])
    const uprightQuad = new Float32Array([
      -0.5, 0.0,
       0.5, 0.0,
      -0.5, 1.0,
       0.5, 1.0,
    ]);
    const uprightBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, uprightBuf);
    gl.bufferData(gl.ARRAY_BUFFER, uprightQuad, gl.STATIC_DRAW);

    this.grassVao = gl.createVertexArray()!;
    this.grassInstanceBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.grassVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, uprightBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.grassInstanceBuf);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, GRASS_STRIDE * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, GRASS_STRIDE * 4, 2 * 4);
    gl.vertexAttribDivisor(2, 1);

    this.sceneVao = gl.createVertexArray()!;
    this.sceneInstanceBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.sceneVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, uprightBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sceneInstanceBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.snapshot.sceneData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, SCENE_STRIDE * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, SCENE_STRIDE * 4, 4 * 4);
    gl.vertexAttribDivisor(2, 1);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, SCENE_STRIDE * 4, 8 * 4);
    gl.vertexAttribDivisor(3, 1);

    // 4. Centered Particle Quad ([-0.5..0.5] x [-0.5..0.5])
    const centeredQuad = new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
      -0.5,  0.5,
       0.5,  0.5,
    ]);
    const centeredBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, centeredBuf);
    gl.bufferData(gl.ARRAY_BUFFER, centeredQuad, gl.STATIC_DRAW);

    this.particleVao = gl.createVertexArray()!;
    this.particleInstanceBuf = gl.createBuffer()!;
    gl.bindVertexArray(this.particleVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, centeredBuf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleInstanceBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.snapshot.particleData.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, PARTICLE_STRIDE * 4, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, false, PARTICLE_STRIDE * 4, 3 * 4);
    gl.vertexAttribDivisor(2, 1);

    gl.bindVertexArray(null);

    // 5. Allocate TEXTURE_2D_ARRAY for Albedo & GPU-Baked Normal+Emissive
    this.albedoArrayTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.albedoArrayTex);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, ATLAS_SIZE, ATLAS_SIZE, ATLAS_LAYERS);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.normalEmissiveArrayTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.normalEmissiveArrayTex);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, ATLAS_SIZE, ATLAS_SIZE, ATLAS_LAYERS);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.bakeFbo = gl.createFramebuffer()!;

    this.uvTableTex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.uvTableTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      MAX_PACKED_SPRITES,
      2,
      0,
      gl.RGBA,
      gl.FLOAT,
      this.uvTableData
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.uploadScratchCanvas = document.createElement('canvas');
    this.uploadScratchCanvas.width = 1024;
    this.uploadScratchCanvas.height = 1024;
    this.uploadScratchCtx = this.uploadScratchCanvas.getContext('2d')!;
  }

  private uLoc(prog: WebGLProgram, name: string): WebGLUniformLocation | null {
    let byName = this.uniformLocs.get(prog);
    if (!byName) {
      byName = new Map();
      this.uniformLocs.set(prog, byName);
    }
    let loc = byName.get(name);
    if (loc === undefined) {
      loc = this.gl.getUniformLocation(prog, name);
      byName.set(name, loc);
    }
    return loc;
  }

  public invalidateSpriteAtlas(): void {
    this.spriteHandles.clear();
    this.shelf.layer = 0;
    this.shelf.curX = ATLAS_PAD;
    this.shelf.curY = ATLAS_PAD;
    this.shelf.rowH = 0;
    this.nextSpriteId = 0;
    this.uvTableDirty = true;
  }

  public resolve(key: string): SpriteAtlasHandle | undefined {
    const existing = this.spriteHandles.get(key);
    if (existing) return existing;
    if (this.nextSpriteId >= MAX_PACKED_SPRITES) return undefined;

    if (key.startsWith('conn:')) {
      const parts = key.split(':');
      const stageKey = parts[1] as
        | 'crop_plot_tilled'
        | 'crop_plot_sprouts'
        | 'burrow_pumpkin_gnomes'
        | 'burrow_chicken_coop'
        | 'burrow_flower_garden'
        | 'burrow_animal_pasture';
      const mask = Number(parts[2] ?? 0);
      if (stageKey && Number.isFinite(mask) && mask > 0) {
        const connSrc = this.sprites.getConnectedFarmlandSprite(stageKey, mask, 372);
        if (connSrc) {
          return this.packSpriteIntoArray(key, connSrc);
        }
      }
      return undefined;
    }

    const src = this.sprites.get(key);
    if (!src) return undefined;
    return this.packSpriteIntoArray(key, src);
  }

  private packSpriteIntoArray(key: string, src: SpriteSource): SpriteAtlasHandle | undefined {
    const rawW = src.width;
    const rawH = src.height;
    if (!rawW || !rawH) return undefined;

    const maxDim = 1024;
    const scale = Math.min(1, maxDim / Math.max(rawW, rawH));
    const pw = Math.max(4, Math.round(rawW * scale));
    const ph = Math.max(4, Math.round(rawH * scale));

    if (this.shelf.curX + pw + ATLAS_PAD > ATLAS_SIZE) {
      this.shelf.curX = ATLAS_PAD;
      this.shelf.curY += this.shelf.rowH + ATLAS_PAD;
      this.shelf.rowH = 0;
    }
    if (this.shelf.curY + ph + ATLAS_PAD > ATLAS_SIZE) {
      if (this.shelf.layer + 1 >= ATLAS_LAYERS) return undefined;
      this.shelf.layer += 1;
      this.shelf.curX = ATLAS_PAD;
      this.shelf.curY = ATLAS_PAD;
      this.shelf.rowH = 0;
    }

    const x = this.shelf.curX;
    const y = this.shelf.curY;
    const layer = this.shelf.layer;
    this.shelf.curX += pw + ATLAS_PAD;
    this.shelf.rowH = Math.max(this.shelf.rowH, ph);

    const gl = this.gl;
    let uploadSrc: TexImageSource = src;
    if (scale < 1) {
      if (this.uploadScratchCanvas.width < pw || this.uploadScratchCanvas.height < ph) {
        this.uploadScratchCanvas.width = Math.max(pw, 1024);
        this.uploadScratchCanvas.height = Math.max(ph, 1024);
      }
      this.uploadScratchCtx.clearRect(0, 0, pw, ph);
      this.uploadScratchCtx.drawImage(src, 0, 0, pw, ph);
      const subCanvas = document.createElement('canvas');
      subCanvas.width = pw;
      subCanvas.height = ph;
      subCanvas.getContext('2d')!.drawImage(this.uploadScratchCanvas, 0, 0, pw, ph, 0, 0, pw, ph);
      uploadSrc = subCanvas;
    }

    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.albedoArrayTex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
    gl.texSubImage3D(
      gl.TEXTURE_2D_ARRAY,
      0,
      x,
      y,
      layer,
      pw,
      ph,
      1,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      uploadSrc
    );
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);

    // GPU-bake 2.5D Normal + Window Emissive strictly inside the newly uploaded rect [x, y, pw, ph]!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bakeFbo);
    gl.framebufferTextureLayer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      this.normalEmissiveArrayTex,
      0,
      layer
    );
    gl.enable(gl.SCISSOR_TEST);
    gl.viewport(x, y, pw, ph);
    gl.scissor(x, y, pw, ph);
    gl.disable(gl.BLEND);
    gl.useProgram(this.bakeNormalProg);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.albedoArrayTex);
    gl.uniform1i(this.uLoc(this.bakeNormalProg, 'uAlbedo'), 0);
    gl.uniform1f(this.uLoc(this.bakeNormalProg, 'uLayer'), layer);
    gl.uniform2f(this.uLoc(this.bakeNormalProg, 'uTexel'), 1 / ATLAS_SIZE, 1 / ATLAS_SIZE);
    gl.uniform1i(this.uLoc(this.bakeNormalProg, 'uLightingProfile'), getSpriteLightingProfile(key));
    gl.uniform4f(
      this.uLoc(this.bakeNormalProg, 'uSpriteBounds'),
      x / ATLAS_SIZE,
      y / ATLAS_SIZE,
      pw / ATLAS_SIZE,
      ph / ATLAS_SIZE
    );
    // Map vUv [0..1] inside viewport(x,y,pw,ph)? No: vUv of fullscreen triangle inside viewport(x,y,pw,ph) spans [0..1],
    // so we set viewport to (0, 0, ATLAS_SIZE, ATLAS_SIZE) and scissor(x, y, pw, ph)!
    gl.viewport(0, 0, ATLAS_SIZE, ATLAS_SIZE);
    gl.bindVertexArray(this.emptyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const id = this.nextSpriteId++;
    const r0 = id * 4;
    this.uvTableData[r0] = (x + 0.5) / ATLAS_SIZE;
    this.uvTableData[r0 + 1] = (y + 0.5) / ATLAS_SIZE;
    this.uvTableData[r0 + 2] = (x + pw - 0.5) / ATLAS_SIZE;
    this.uvTableData[r0 + 3] = (y + ph - 0.5) / ATLAS_SIZE;

    const r1 = (MAX_PACKED_SPRITES + id) * 4;
    this.uvTableData[r1] = layer;
    this.uvTableData[r1 + 1] = rawW / rawH;
    this.uvTableData[r1 + 2] = canSpriteReceiveWinterSnowCap(key) ? 1.0 : 0.0;
    this.uvTableData[r1 + 3] = shouldCleanseSpriteBakedHalo(key) ? 1.0 : 0.0;
    this.uvTableDirty = true;

    const handle: SpriteAtlasHandle = { id, width: rawW, height: rawH };
    this.spriteHandles.set(key, handle);
    return handle;
  }

  private ensureRenderTargets(pixelW: number, pixelH: number): void {
    if (this.fboW === pixelW && this.fboH === pixelH && this.sceneFbo) return;
    const gl = this.gl;
    this.fboW = pixelW;
    this.fboH = pixelH;

    const cleanPair = (fbo: WebGLFramebuffer | null, tex: WebGLTexture | null) => {
      if (fbo) gl.deleteFramebuffer(fbo);
      if (tex) gl.deleteTexture(tex);
    };
    cleanPair(this.sceneFbo, this.sceneColorTex);
    cleanPair(this.bloomFboA, this.bloomTexA);
    cleanPair(this.bloomFboB, this.bloomTexB);

    const makeTarget = (w: number, h: number): { fbo: WebGLFramebuffer; tex: WebGLTexture } => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (this.useHalfFloatFbo) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { fbo, tex };
    };

    const bw = Math.max(2, pixelW >> 1);
    const bh = Math.max(2, pixelH >> 1);
    const s = makeTarget(pixelW, pixelH);
    this.sceneFbo = s.fbo;
    this.sceneColorTex = s.tex;

    const a = makeTarget(bw, bh);
    this.bloomFboA = a.fbo;
    this.bloomTexA = a.tex;

    const b = makeTarget(bw, bh);
    this.bloomFboB = b.fbo;
    this.bloomTexB = b.tex;

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  private drawInstancedSceneRange(firstInstance: number, count: number): void {
    if (count <= 0) return;
    const gl = this.gl;
    const baseBytes = firstInstance * SCENE_STRIDE * 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sceneInstanceBuf);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, SCENE_STRIDE * 4, baseBytes);
    gl.vertexAttribPointer(2, 4, gl.FLOAT, false, SCENE_STRIDE * 4, baseBytes + 16);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, SCENE_STRIDE * 4, baseBytes + 32);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
  }

  public syncInteractiveHotspots(
    sim: ParkSimulation,
    cam: Camera,
    cssW: number,
    cssH: number,
    nowMs: number,
    selectedBuildingUid: string | null,
    out: ScreenHotspot[]
  ): void {
    out.length = 0;
    const viewRot = cam.viewRot ?? 0;
    const zoom = Math.max(0.25, cam.zoom);
    const activeFestival = sim.getActiveFestival();
    const unlockedSet = new Set<string>(sim.state.unlockedZones);

    // 1. Locked Zone Plaques
    if (!sim.state.sandboxMode && !sim.isVisitingNeighbor) {
      for (const z of ZONES) {
        if (unlockedSet.has(z.id)) continue;
        const cx = (z.x1 + z.x2 + 1) * 0.5;
        const cy = (z.y1 + z.y2 + 1) * 0.5;
        const pt = gridToScreen(cx, cy, cam, cssW, cssH, 0);
        if (pt.sx >= -120 && pt.sx <= cssW + 120 && pt.sy >= -120 && pt.sy <= cssH + 120) {
          out.push({
            kind: 'zone_plaque',
            id: z.id,
            sx: pt.sx,
            sy: pt.sy,
            radius: Math.max(28, 42 * zoom),
          });
        }
      }
    }

    // 2. Buildings, Unveil Ribbons, Water/Feed Actions, Bubbles & Home Lanterns
    const lanternMarks = !sim.isVisitingNeighbor
      ? sim.ensureNeighborSocial().homeLanternMarks
      : [];

    for (const b of sim.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = sim.getBuildingFootprint(item, b.rotation);
      const { rx0, ry0, rbw, rbh } = rotateGridRect(b.gx, b.gy, bw, bh, viewRot);
      const elev = sim.grid[b.gy]?.[b.gx]?.elevation ?? 0;
      const worldCx = ((rx0 - ry0) + (rbw - rbh) * 0.5) * (TILE_W * 0.5);
      const worldBottomY = (rx0 + rbw + ry0 + rbh) * (TILE_H * 0.5) - elev * ELEV_PX;
      const sx = cssW * 0.5 + (worldCx - cam.x) * zoom;
      const syBottom = cssH * 0.5 + (worldBottomY - cam.y) * zoom;
      if (sx < -220 || sx > cssW + 220 || syBottom < -60 || syBottom > cssH + 280) continue;

      const footprintPx = (bw + bh) * (TILE_W * 0.5) * zoom;
      const scaleMult = item.spriteScale ?? (item.width !== item.height ? 1.0 : 1.05);
      const activeKey =
        nowMs < b.constructEndsAt
          ? 'prop_construction_site'
          : item.isFarmlandPlot
            ? 'crop_plot_tilled'
            : resolveCatalogPropSpriteKey(item.id, item.spriteKey);
      const rawSp = activeKey ? this.sprites.get(activeKey) : undefined;
      const boxW = Math.max(28, footprintPx * scaleMult);
      const boxH = rawSp
        ? boxW * (rawSp.height / rawSp.width)
        : Math.max(26, (item.connectableGroup ? 0.55 : 1.05) * footprintPx);
      const centerSy = syBottom - boxH * 0.45;
      const rotTotal = (b.rotation + viewRot) % 4;
      const flipX = Boolean(item.connectableGroup)
        ? false
        : item.width !== item.height
          ? (rotTotal & 1) === 1
          : rotTotal === 1 || rotTotal === 2;

      out.push({
        kind: 'building',
        id: b.uid,
        sx,
        sy: centerSy,
        radius: Math.max(26, Math.max(boxW, boxH) * 0.52),
        spriteKey: activeKey,
        flipX,
        boxLeft: sx - boxW * 0.5,
        boxTop: syBottom - boxH + 4 * zoom,
        boxW,
        boxH,
      });

      if (sim.isVisitingNeighbor) {
        const helpSt = sim.getVisitedBuildingHelpStatus(b);
        if (helpSt.canHelp) {
          out.push({
            kind: 'neighbor_help',
            id: b.uid,
            sx,
            sy: syBottom - boxH * 0.85,
            radius: Math.max(22, 28 * zoom),
          });
        }
        continue;
      }

      const timerInfo = resolveBuildingInWorldTimerInfo(
        b,
        item,
        nowMs,
        activeFestival,
        selectedBuildingUid === b.uid
      );
      if (timerInfo?.interactiveHotspotKind) {
        out.push({
          kind: timerInfo.interactiveHotspotKind,
          id: b.uid,
          sx,
          sy: syBottom - boxH * 0.82,
          radius: Math.max(22, 28 * zoom),
        });
      }

      if ((b.readyBubbles ?? 0) > 0 || (b.readyFarmGoods?.length ?? 0) > 0) {
        out.push({
          kind: 'bubble',
          id: b.uid,
          sx,
          sy: syBottom - boxH * 0.88,
          radius: Math.max(24, 30 * zoom),
        });
      }

      const mark = lanternMarks.find((m) => m.buildingUid === b.uid);
      if (mark) {
        out.push({
          kind: 'home_lantern',
          id: mark.id,
          sx,
          sy: syBottom - boxH * 0.92,
          radius: Math.max(22, 28 * zoom),
        });
      }
    }

    // 3. Walking Villagers
    for (const v of sim.villagers) {
      const iso = worldIso(v.gx, v.gy, viewRot);
      const vGx = Math.max(0, Math.min(71, Math.floor(v.gx)));
      const vGy = Math.max(0, Math.min(71, Math.floor(v.gy)));
      const elev = sim.grid[vGy]?.[vGx]?.elevation ?? 0;
      const sx = cssW * 0.5 + (iso.wx - cam.x) * zoom;
      const sy = cssH * 0.5 + (iso.wy - elev * ELEV_PX - 24 - cam.y) * zoom;
      if (sx >= -60 && sx <= cssW + 60 && sy >= -60 && sy <= cssH + 60) {
        out.push({
          kind: 'villager',
          id: v.id,
          sx,
          sy,
          radius: Math.max(20, 26 * zoom),
        });
      }
    }

    // 4. Escaped Creatures
    for (const esc of sim.escapedCreatures) {
      const iso = worldIso(esc.gx, esc.gy, viewRot);
      const sx = cssW * 0.5 + (iso.wx - cam.x) * zoom;
      const sy = cssH * 0.5 + (iso.wy - 18 - cam.y) * zoom;
      out.push({
        kind: 'escaped',
        id: esc.id,
        sx,
        sy,
        radius: Math.max(22, 28 * zoom),
      });
    }
  }

  public renderFrame(
    sim: ParkSimulation,
    cam: Camera,
    settings: GpuMockSettings,
    pointerWorld: { wx: number; wy: number; active: boolean },
    nowMs: number,
    overlay?: GameplayRenderOverlay
  ): void {
    if (this.gpuDevice.contextLost) return;
    const gl = this.gl;
    const profile = GPU_QUALITY_PROFILES[settings.qualityTier];
    const cssW = Math.max(1, this.canvas.parentElement?.clientWidth || window.innerWidth);
    const cssH = Math.max(1, this.canvas.parentElement?.clientHeight || window.innerHeight);
    const dpr = Math.min(profile.dprCap, window.devicePixelRatio || 1);
    const pixelW = Math.max(2, Math.round(cssW * dpr));
    const pixelH = Math.max(2, Math.round(cssH * dpr));

    if (this.canvas.width !== pixelW || this.canvas.height !== pixelH) {
      this.canvas.width = pixelW;
      this.canvas.height = pixelH;
    }

    if (this.lastFrameTs > 0) {
      const dt = nowMs - this.lastFrameTs;
      if (dt > 0 && dt < 250) {
        this.fpsAccumMs += dt;
        this.fpsFrames += 1;
        if (this.fpsAccumMs >= 350) {
          this.currentFps = Math.round((this.fpsFrames * 1000) / this.fpsAccumMs);
          this.fpsAccumMs = 0;
          this.fpsFrames = 0;
        }
      }
    }
    this.lastFrameTs = nowMs;

    const t0 = performance.now();
    this.snapshot.collect(
      sim,
      cam,
      cssW,
      cssH,
      nowMs,
      this,
      profile.maxGrassInstances,
      profile.maxPointLights,
      pointerWorld,
      settings.lumosWandEnabled,
      overlay
    );
    if (overlay?.hotspotsOut) {
      this.syncInteractiveHotspots(
        sim,
        cam,
        cssW,
        cssH,
        nowMs,
        overlay.selectedBuildingUid ?? null,
        overlay.hotspotsOut
      );
    }
    const cpuCollectMs = performance.now() - t0;

    if (this.uvTableDirty) {
      gl.bindTexture(gl.TEXTURE_2D, this.uvTableTex);
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        MAX_PACKED_SPRITES,
        2,
        gl.RGBA,
        gl.FLOAT,
        this.uvTableData
      );
      this.uvTableDirty = false;
    }

    if (this.uploadedStaticGen !== this.snapshot.staticDirtyGeneration) {
      this.uploadedStaticGen = this.snapshot.staticDirtyGeneration;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.terrainInstanceBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.snapshot.terrainData.subarray(0, this.snapshot.terrainCount * TERRAIN_STRIDE),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.waterInstanceBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.snapshot.waterData.subarray(0, this.snapshot.waterCount * WATER_STRIDE),
        gl.STATIC_DRAW
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, this.grassInstanceBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        this.snapshot.grassData.subarray(0, this.snapshot.grassCount * GRASS_STRIDE),
        gl.STATIC_DRAW
      );
    }

    // Upload dynamic sorted scene & particles
    if (this.snapshot.sceneCount > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.sceneInstanceBuf);
      gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        this.snapshot.sceneData.subarray(0, this.snapshot.sceneCount * SCENE_STRIDE)
      );
    }
    if (this.snapshot.particleCount > 0) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.particleInstanceBuf);
      gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        this.snapshot.particleData.subarray(0, this.snapshot.particleCount * PARTICLE_STRIDE)
      );
    }

    // Pack light uniform arrays
    const lc = this.snapshot.lightCount;
    for (let i = 0; i < lc; i++) {
      const srcBase = i * LIGHT_STRIDE;
      const dstBase = i * 4;
      this.lightPosUniform[dstBase] = this.snapshot.lightData[srcBase];
      this.lightPosUniform[dstBase + 1] = this.snapshot.lightData[srcBase + 1];
      this.lightPosUniform[dstBase + 2] = this.snapshot.lightData[srcBase + 2];
      this.lightPosUniform[dstBase + 3] = this.snapshot.lightData[srcBase + 3];

      this.lightColUniform[dstBase] = this.snapshot.lightData[srcBase + 4];
      this.lightColUniform[dstBase + 1] = this.snapshot.lightData[srcBase + 5];
      this.lightColUniform[dstBase + 2] = this.snapshot.lightData[srcBase + 6];
      this.lightColUniform[dstBase + 3] = this.snapshot.lightData[srcBase + 7];
    }

    // Resolve lighting mood vectors by Time of Day & Weather
    const p = this.snapshot.period;
    const w = this.snapshot.weatherKind;
    const isRain = w === 'rain' || w === 'storm';
    const isSnow = w === 'snow';
    const winterSnowAmount = isSnow || (this.snapshot.seasonId === 'winter' && !isRain) ? 1.0 : 0.0;
    const periodIdx = p === 'dawn' ? 0 : p === 'dusk' ? 2 : p === 'night' ? 3 : 1;
    const weatherIdx = isRain ? 1 : (isSnow || this.snapshot.seasonId === 'winter') ? 2 : 0;

    let ambient: [number, number, number] = [1.03, 1.03, 1.01];
    let sunDir: [number, number, number] = [-0.42, -0.52, 0.74];
    let sunCol: [number, number, number] = [0.22, 0.20, 0.14];
    let skyRefl: [number, number, number] = [0.38, 0.76, 0.98];
    let shadowTint: [number, number, number] = [0.06, 0.12, 0.18];
    let winGlow = 0.20;

    if (p === 'dawn') {
      ambient = [1.00, 0.97, 0.92];
      sunDir = [0.68, -0.38, 0.62];
      sunCol = [0.30, 0.24, 0.15];
      skyRefl = [0.46, 0.76, 0.95];
      shadowTint = [0.06, 0.11, 0.16];
      winGlow = 0.30;
    } else if (p === 'dusk') {
      ambient = [0.92, 0.85, 0.89];
      sunDir = [-0.74, -0.35, 0.57];
      sunCol = [0.40, 0.26, 0.16];
      skyRefl = [0.84, 0.58, 0.52];
      shadowTint = [0.07, 0.06, 0.16];
      winGlow = 0.68;
    } else if (p === 'night') {
      // Bright, crystal-clear silver-blue moonlit evening (100% readable across the entire map!)
      ambient = winterSnowAmount > 0.5 ? [0.80, 0.87, 0.99] : [0.74, 0.81, 0.95];
      sunDir = [0.35, -0.55, 0.75];
      sunCol = [0.16, 0.22, 0.36];
      skyRefl = [0.28, 0.48, 0.74];
      shadowTint = [0.04, 0.06, 0.14];
      winGlow = 0.82;
    }

    if (isRain) {
      ambient = [ambient[0] * 0.92, ambient[1] * 0.94, ambient[2] * 0.97];
      sunCol = [sunCol[0] * 0.65, sunCol[1] * 0.68, sunCol[2] * 0.75];
      winGlow = Math.max(winGlow, 0.55);
    }

    const timeSec = nowMs * 0.001;
    let drawCalls = 0;

    const useBloom = profile.bloomEnabled && settings.bloomIntensity > 0.02;
    if (useBloom) {
      this.ensureRenderTargets(pixelW, pixelH);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneFbo);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.viewport(0, 0, pixelW, pixelH);
    gl.disable(gl.BLEND);

    // PASS 1: Atmospheric Sky Backdrop
    gl.useProgram(this.skyProg);
    gl.uniform1f(this.uLoc(this.skyProg, 'uTime'), timeSec);
    gl.uniform1i(this.uLoc(this.skyProg, 'uPeriod'), periodIdx);
    gl.uniform1i(this.uLoc(this.skyProg, 'uWeather'), weatherIdx);
    gl.bindVertexArray(this.emptyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    drawCalls++;

    // PASS 2: Isometric Terrain + Cobblestone Paths + Cloud Shadows + Ground Light Pools
    if (this.snapshot.terrainCount > 0) {
      gl.useProgram(this.terrainProg);
      gl.uniform3f(this.uLoc(this.terrainProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.terrainProg, 'uViewport'), cssW, cssH);
      gl.uniform1f(this.uLoc(this.terrainProg, 'uTime'), timeSec);
      gl.uniform1f(this.uLoc(this.terrainProg, 'uWinterSnow'), winterSnowAmount);
      gl.uniform3fv(this.uLoc(this.terrainProg, 'uAmbientTint'), ambient);
      gl.uniform1i(this.uLoc(this.terrainProg, 'uLightCount'), lc);
      if (lc > 0) {
        gl.uniform4fv(this.uLoc(this.terrainProg, 'uLightPosRad'), this.lightPosUniform);
        gl.uniform4fv(this.uLoc(this.terrainProg, 'uLightColInt'), this.lightColUniform);
      }
      gl.bindVertexArray(this.terrainVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.snapshot.terrainCount);
      drawCalls++;
    }

    // PASS 3: Refractive River Ottery Water + Caustics + SDF Foam + Interactive Ripples
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    if (this.snapshot.waterCount > 0) {
      gl.useProgram(this.waterProg);
      gl.uniform3f(this.uLoc(this.waterProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.waterProg, 'uViewport'), cssW, cssH);
      gl.uniform1f(this.uLoc(this.waterProg, 'uTime'), timeSec);
      gl.uniform1f(this.uLoc(this.waterProg, 'uWinterSnow'), winterSnowAmount);
      gl.uniform3fv(this.uLoc(this.waterProg, 'uAmbientTint'), ambient);
      gl.uniform3fv(this.uLoc(this.waterProg, 'uSkyReflectColor'), skyRefl);
      gl.uniform3fv(this.uLoc(this.waterProg, 'uSunColor'), sunCol);
      gl.uniform1i(
        this.uLoc(this.waterProg, 'uInteractorCount'),
        this.snapshot.interactorCount
      );
      if (this.snapshot.interactorCount > 0) {
        gl.uniform4fv(
          this.uLoc(this.waterProg, 'uInteractors'),
          this.snapshot.interactorData
        );
      }
      gl.uniform1i(this.uLoc(this.waterProg, 'uLightCount'), lc);
      if (lc > 0) {
        gl.uniform4fv(this.uLoc(this.waterProg, 'uLightPosRad'), this.lightPosUniform);
        gl.uniform4fv(this.uLoc(this.waterProg, 'uLightColInt'), this.lightColUniform);
      }
      gl.bindVertexArray(this.waterVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.snapshot.waterCount);
      drawCalls++;
    }

    // PASS 4: GPU Instanced Wind-Swaying & Proximity-Bending Meadow Grass + Wildflowers
    if (this.snapshot.grassCount > 0) {
      gl.useProgram(this.grassProg);
      gl.uniform3f(this.uLoc(this.grassProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.grassProg, 'uViewport'), cssW, cssH);
      gl.uniform1f(this.uLoc(this.grassProg, 'uTime'), timeSec);
      gl.uniform1f(this.uLoc(this.grassProg, 'uWindStrength'), settings.windStrength);
      gl.uniform1f(this.uLoc(this.grassProg, 'uWinterSnow'), winterSnowAmount);
      gl.uniform3fv(this.uLoc(this.grassProg, 'uAmbientTint'), ambient);
      gl.uniform3fv(this.uLoc(this.grassProg, 'uSunColor'), sunCol);
      gl.uniform1i(
        this.uLoc(this.grassProg, 'uInteractorCount'),
        this.snapshot.interactorCount
      );
      if (this.snapshot.interactorCount > 0) {
        gl.uniform4fv(
          this.uLoc(this.grassProg, 'uInteractors'),
          this.snapshot.interactorData
        );
      }
      gl.uniform1i(this.uLoc(this.grassProg, 'uLightCount'), lc);
      if (lc > 0) {
        gl.uniform4fv(this.uLoc(this.grassProg, 'uLightPosRad'), this.lightPosUniform);
        gl.uniform4fv(this.uLoc(this.grassProg, 'uLightColInt'), this.lightColUniform);
      }
      gl.bindVertexArray(this.grassVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.snapshot.grassCount);
      drawCalls++;
    }

    // PASS 5: Unified IsoSceneSortedPass (Projected Shadows + 2.5D Normal-Lit Sprites via TEXTURE_2D_ARRAY)
    if (this.snapshot.sceneCount > 0) {
      // Premultiplied alpha blending eliminates dark bilinear fringes around roofs & trees!
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.albedoArrayTex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.normalEmissiveArrayTex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.uvTableTex);

      gl.bindVertexArray(this.sceneVao);

      // 5a. Directional Sun/Moon Ground Shadows (reset attribute offsets to 0 first)
      gl.useProgram(this.shadowProg);
      gl.uniform3f(this.uLoc(this.shadowProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.shadowProg, 'uViewport'), cssW, cssH);
      gl.uniform1i(this.uLoc(this.shadowProg, 'uAlbedo'), 0);
      gl.uniform1i(this.uLoc(this.shadowProg, 'uUvTable'), 2);
      gl.uniform2f(
        this.uLoc(this.shadowProg, 'uShadowSkew'),
        this.snapshot.sunShadowDx,
        this.snapshot.sunShadowDy
      );
      gl.uniform1f(this.uLoc(this.shadowProg, 'uTime'), timeSec);
      gl.uniform1f(this.uLoc(this.shadowProg, 'uWindStrength'), settings.windStrength);
      gl.uniform3fv(this.uLoc(this.shadowProg, 'uShadowTint'), shadowTint);
      this.drawInstancedSceneRange(0, this.snapshot.sceneCount);
      drawCalls++;

      // 5b. Range-Sliced IsoSceneSortedPass with Interleaved Articulated Spine 2D Slots
      // Uniforms live per-program in WebGL2: upload frame-invariant scene uniforms ONCE, then rebind VAO/program only on slice switches!
      gl.useProgram(this.sceneProg);
      gl.uniform3f(this.uLoc(this.sceneProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.sceneProg, 'uViewport'), cssW, cssH);
      gl.uniform1i(this.uLoc(this.sceneProg, 'uAlbedo'), 0);
      gl.uniform1i(this.uLoc(this.sceneProg, 'uNormalEmissive'), 1);
      gl.uniform1i(this.uLoc(this.sceneProg, 'uUvTable'), 2);
      gl.uniform1f(this.uLoc(this.sceneProg, 'uTime'), timeSec);
      gl.uniform1f(this.uLoc(this.sceneProg, 'uWindStrength'), settings.windStrength);
      gl.uniform3fv(this.uLoc(this.sceneProg, 'uAmbientTint'), ambient);
      gl.uniform3fv(this.uLoc(this.sceneProg, 'uSunDir'), sunDir);
      gl.uniform3fv(this.uLoc(this.sceneProg, 'uSunColor'), sunCol);
      gl.uniform1f(this.uLoc(this.sceneProg, 'uNormalStrength'), settings.normalStrength);
      gl.uniform1f(this.uLoc(this.sceneProg, 'uWindowGlowStrength'), winGlow);
      gl.uniform1f(this.uLoc(this.sceneProg, 'uWinterSnow'), winterSnowAmount);
      gl.uniform1i(this.uLoc(this.sceneProg, 'uLightCount'), lc);
      if (lc > 0) {
        gl.uniform4fv(this.uLoc(this.sceneProg, 'uLightPosRad'), this.lightPosUniform);
        gl.uniform4fv(this.uLoc(this.sceneProg, 'uLightColInt'), this.lightColUniform);
      }

      const sliceCount = buildIsoSceneRangeSlices(
        this.snapshot.sceneCount,
        this.snapshot.skeletalSortedIndices,
        this.snapshot.skeletalCount,
        this.rangeSlices
      );
      let sceneStateBound = true;
      for (let sIdx = 0; sIdx < sliceCount; sIdx++) {
        const seg = this.rangeSlices[sIdx];
        if (seg.kind === 'instanced_range') {
          if (!sceneStateBound) {
            gl.useProgram(this.sceneProg);
            gl.bindVertexArray(this.sceneVao);
            sceneStateBound = true;
          }
          this.drawInstancedSceneRange(seg.firstInstance, seg.instanceCount);
          drawCalls++;
        } else {
          const pose = this.snapshot.skeletalPoses[seg.skeletalSlotIndex];
          if (pose) {
            this.spineAdapter.renderArticulatedSlot(
              pose,
              cam.x,
              cam.y,
              cam.zoom,
              cssW,
              cssH,
              timeSec,
              ambient,
              this.albedoArrayTex,
              this.uvTableTex
            );
            sceneStateBound = false;
            drawCalls++;
          }
        }
      }
    }

    // PASS 6: World-Space Snowflakes (Alpha-Blended Frost Rim + Crystal Core) or Additive HDR Fireflies
    if (this.snapshot.particleCount > 0) {
      const snowParticles = winterSnowAmount > 0.5 || isSnow;
      if (snowParticles) {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      }
      gl.useProgram(this.particleProg);
      gl.uniform3f(this.uLoc(this.particleProg, 'uCamera'), cam.x, cam.y, cam.zoom);
      gl.uniform2f(this.uLoc(this.particleProg, 'uViewport'), cssW, cssH);
      gl.uniform1f(this.uLoc(this.particleProg, 'uIsSnow'), snowParticles ? 1.0 : 0.0);
      gl.bindVertexArray(this.particleVao);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.snapshot.particleCount);
      drawCalls++;
    }

    // PASS 7: Dual-Pass Kawase HDR Bloom + ACES Filmic Tonemapping
    if (useBloom && this.sceneColorTex && this.bloomFboA && this.bloomFboB && this.bloomTexA && this.bloomTexB) {
      gl.disable(gl.BLEND);
      const bw = Math.max(2, pixelW >> 1);
      const bh = Math.max(2, pixelH >> 1);
      gl.bindVertexArray(this.emptyVao);

      // 7a. Extract HDR highlights
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFboA);
      gl.viewport(0, 0, bw, bh);
      gl.useProgram(this.bloomExtractProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.sceneColorTex);
      gl.uniform1i(this.uLoc(this.bloomExtractProg, 'uScene'), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawCalls++;

      // 7b. Kawase Ping-Pong Blur (2 wide passes)
      gl.useProgram(this.bloomBlurProg);
      gl.uniform1i(this.uLoc(this.bloomBlurProg, 'uTex'), 0);

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFboB);
      gl.bindTexture(gl.TEXTURE_2D, this.bloomTexA);
      gl.uniform2f(this.uLoc(this.bloomBlurProg, 'uOffset'), 1.5 / bw, 1.5 / bh);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawCalls++;

      gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomFboA);
      gl.bindTexture(gl.TEXTURE_2D, this.bloomTexB);
      gl.uniform2f(this.uLoc(this.bloomBlurProg, 'uOffset'), 3.2 / bw, 3.2 / bh);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawCalls++;

      // 7c. Composite Scene + HDR Bloom -> Screen with ACES Filmic Curve
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, pixelW, pixelH);
      gl.useProgram(this.compositeProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.sceneColorTex);
      gl.uniform1i(this.uLoc(this.compositeProg, 'uScene'), 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.bloomTexA);
      gl.uniform1i(this.uLoc(this.compositeProg, 'uBloom'), 1);
      gl.uniform1f(
        this.uLoc(this.compositeProg, 'uBloomIntensity'),
        settings.bloomIntensity
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      drawCalls++;
    }

    gl.bindVertexArray(null);

    const activeLayers = this.shelf.layer + 1;
    // Estimate actual GPU VRAM: active albedo + normal layers + FBOs
    const atlasMb = activeLayers * 2 * ((ATLAS_SIZE * ATLAS_SIZE * 4) / (1024 * 1024));
    const fboBytesPerPx = this.useHalfFloatFbo ? 8 : 4;
    const fboMb = useBloom
      ? ((pixelW * pixelH * 1.5 * fboBytesPerPx) / (1024 * 1024))
      : 0;

    this.stats = {
      backend: 'webgl2',
      fps: this.currentFps,
      cpuCollectMs: Number(cpuCollectMs.toFixed(2)),
      drawCalls,
      terrainTiles: this.snapshot.terrainCount,
      waterTiles: this.snapshot.waterCount,
      grassInstances: this.snapshot.grassCount,
      sortedSprites: this.snapshot.sceneCount,
      particleInstances: this.snapshot.particleCount,
      activeLights: lc,
      atlasLayers: activeLayers,
      atlasSpritesPacked: this.nextSpriteId,
      vramEstimateMb: Number((atlasMb + fboMb).toFixed(1)),
    };
  }

  public destroy(): void {
    const gl = this.gl;
    this.spineAdapter.destroy();
    gl.deleteTexture(this.albedoArrayTex);
    gl.deleteTexture(this.normalEmissiveArrayTex);
    gl.deleteTexture(this.uvTableTex);
    if (this.sceneColorTex) gl.deleteTexture(this.sceneColorTex);
    if (this.bloomTexA) gl.deleteTexture(this.bloomTexA);
    if (this.bloomTexB) gl.deleteTexture(this.bloomTexB);
    gl.deleteFramebuffer(this.bakeFbo);
    if (this.sceneFbo) gl.deleteFramebuffer(this.sceneFbo);
    if (this.bloomFboA) gl.deleteFramebuffer(this.bloomFboA);
    if (this.bloomFboB) gl.deleteFramebuffer(this.bloomFboB);
    this.gpuDevice.destroy();
  }
}

// Track B6b: Shared Instanced WebGL2 Additive FX Batcher (`MinigameGpuFxBatcher`)
// Dùng chung cho:
//   1. Gác Xép Bùa Gặt Honeydukes (Match-3 special combo blasts & cascade starbursts)
//   2. Khôi Phục Kiệt Tác Ghép Tranh (Jigsaw piece-snap golden stardust bursts, lên tới 2.000 mảnh)
// (KHÔNG port Caro / Sudoku sang GPU theo kiến trúc hội tụ #6.)
// 100% SoA TypedArray pre-allocated, tự ngủ `rAF` khi hết hạt, fallback an toàn trên môi trường test/headless.

const MAX_FX_SPARKS = 512;
const SPARK_STRIDE = 8; // [x, y, vx, vy, life, maxLife, size, colorIdx]
const GPU_INSTANCE_STRIDE = 7; // [x, y, size, r, g, b, alpha]

const FX_PALETTES: ReadonlyArray<[number, number, number]> = [
  [1.45, 1.12, 0.32], // 0: Hogwarts Gold
  [0.25, 1.38, 0.76], // 1: Emerald Floo
  [1.42, 0.42, 0.62], // 2: Honeydukes Berry
  [0.42, 1.05, 1.48], // 3: Lumos Cyan
  [1.12, 0.58, 1.45], // 4: Arcane Amethyst
];

const FX_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aQuad;
layout(location = 1) in vec3 iPosSize; // (sx, sy, size)
layout(location = 2) in vec4 iColAlpha; // (r, g, b, alpha)
uniform vec2 uViewport;
out vec2 vLocal;
out vec4 vColAlpha;

void main() {
  vec2 sp = iPosSize.xy + aQuad * (iPosSize.z * 2.5);
  vec2 clip = vec2((sp.x / uViewport.x) * 2.0 - 1.0, 1.0 - (sp.y / uViewport.y) * 2.0);
  gl_Position = vec4(clip, 0.0, 1.0);
  vLocal = aQuad * 2.0;
  vColAlpha = iColAlpha;
}
`;

const FX_FS = `#version 300 es
precision highp float;
in vec2 vLocal;
in vec4 vColAlpha;
out vec4 fragColor;

void main() {
  float d = length(vLocal);
  if (d > 1.0) discard;
  float core = pow(1.0 - d, 2.35);
  float crossFlare = max(
    exp(-abs(vLocal.x) * 9.0) * (1.0 - d),
    exp(-abs(vLocal.y) * 9.0) * (1.0 - d)
  ) * 0.55;
  float glow = clamp(core + crossFlare, 0.0, 1.4) * vColAlpha.a;
  fragColor = vec4(vColAlpha.rgb * glow, glow);
}
`;

export class MinigameGpuFxBatcher {
  private readonly hostEl: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGL2RenderingContext | null = null;
  private prog: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private instanceBuf: WebGLBuffer | null = null;

  private readonly sparkPool = new Float32Array(MAX_FX_SPARKS * SPARK_STRIDE);
  private readonly sparkActive = new Uint8Array(MAX_FX_SPARKS);
  private readonly gpuData = new Float32Array(MAX_FX_SPARKS * GPU_INSTANCE_STRIDE);
  private activeCount = 0;
  private rafId = 0;
  private lastTs = 0;

  constructor(hostEl: HTMLElement) {
    this.hostEl = hostEl;
  }

  private ensureInitialized(): boolean {
    if (this.gl) return true;
    if (typeof document === 'undefined') return false;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.className = 'minigame-gpu-fx-overlay';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText =
        'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483645;display:none;';
      this.hostEl.appendChild(canvas);

      const gl = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
      });
      if (!gl) {
        canvas.remove();
        return false;
      }

      const vs = gl.createShader(gl.VERTEX_SHADER)!;
      gl.shaderSource(vs, FX_VS);
      gl.compileShader(vs);
      const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(fs, FX_FS);
      gl.compileShader(fs);
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        gl.deleteProgram(prog);
        canvas.remove();
        return false;
      }

      const quad = new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]);
      const quadBuf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

      const vao = gl.createVertexArray()!;
      const instBuf = gl.createBuffer()!;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.gpuData.byteLength, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, GPU_INSTANCE_STRIDE * 4, 0);
      gl.vertexAttribDivisor(1, 1);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 4, gl.FLOAT, false, GPU_INSTANCE_STRIDE * 4, 3 * 4);
      gl.vertexAttribDivisor(2, 1);
      gl.bindVertexArray(null);

      this.canvas = canvas;
      this.gl = gl;
      this.prog = prog;
      this.vao = vao;
      this.instanceBuf = instBuf;
      return true;
    } catch {
      return false;
    }
  }

  public spawnStarburst(
    clientX: number,
    clientY: number,
    count = 26,
    paletteIdx = 0,
    speedScale = 1.0
  ): void {
    if (!this.ensureInitialized()) return;
    const safePalette = Math.abs(paletteIdx) % FX_PALETTES.length;
    const n = Math.min(72, Math.max(6, Math.round(count)));

    for (let k = 0; k < n; k++) {
      let slot = -1;
      for (let i = 0; i < MAX_FX_SPARKS; i++) {
        if (this.sparkActive[i] === 0) {
          slot = i;
          break;
        }
      }
      if (slot < 0) break;
      this.sparkActive[slot] = 1;
      this.activeCount++;
      const angle = (Math.PI * 2 * k) / n + (Math.random() - 0.5) * 0.35;
      const spd = (95 + Math.random() * 210) * speedScale;
      const b = slot * SPARK_STRIDE;
      this.sparkPool[b] = clientX;
      this.sparkPool[b + 1] = clientY;
      this.sparkPool[b + 2] = Math.cos(angle) * spd;
      this.sparkPool[b + 3] = Math.sin(angle) * spd - 35;
      this.sparkPool[b + 4] = 0;
      this.sparkPool[b + 5] = 0.34 + Math.random() * 0.32;
      this.sparkPool[b + 6] = 4.5 + Math.random() * 6.5;
      this.sparkPool[b + 7] = (safePalette + (k % 2 === 0 ? 0 : 1)) % FX_PALETTES.length;
    }

    if (this.canvas) {
      this.canvas.style.display = 'block';
    }
    if (!this.rafId) {
      this.lastTs = performance.now();
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  private readonly tick = (now: number): void => {
    this.rafId = 0;
    if (!this.gl || !this.canvas || !this.prog || !this.vao || !this.instanceBuf) return;

    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTs) / 1000));
    this.lastTs = now;

    const vw = Math.max(1, window.innerWidth || 1280);
    const vh = Math.max(1, window.innerHeight || 720);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.round(vw * dpr);
    const ph = Math.round(vh * dpr);
    if (this.canvas.width !== pw || this.canvas.height !== ph) {
      this.canvas.width = pw;
      this.canvas.height = ph;
    }

    let out = 0;
    for (let i = 0; i < MAX_FX_SPARKS; i++) {
      if (this.sparkActive[i] === 0) continue;
      const b = i * SPARK_STRIDE;
      const life = this.sparkPool[b + 4] + dt;
      const maxLife = this.sparkPool[b + 5];
      if (life >= maxLife) {
        this.sparkActive[i] = 0;
        this.activeCount = Math.max(0, this.activeCount - 1);
        continue;
      }
      this.sparkPool[b + 4] = life;
      // Air drag + gentle gravity
      this.sparkPool[b + 2] *= Math.pow(0.08, dt);
      this.sparkPool[b + 3] = this.sparkPool[b + 3] * Math.pow(0.12, dt) + 190 * dt;
      this.sparkPool[b] += this.sparkPool[b + 2] * dt;
      this.sparkPool[b + 1] += this.sparkPool[b + 3] * dt;

      const u = life / maxLife;
      const alpha = Math.max(0, 1 - u * u);
      const pal = FX_PALETTES[Math.round(this.sparkPool[b + 7]) % FX_PALETTES.length];
      const g = out * GPU_INSTANCE_STRIDE;
      this.gpuData[g] = this.sparkPool[b];
      this.gpuData[g + 1] = this.sparkPool[b + 1];
      this.gpuData[g + 2] = this.sparkPool[b + 6] * (1.0 - u * 0.45);
      this.gpuData[g + 3] = pal[0];
      this.gpuData[g + 4] = pal[1];
      this.gpuData[g + 5] = pal[2];
      this.gpuData[g + 6] = alpha;
      out++;
    }

    const gl = this.gl;
    gl.viewport(0, 0, pw, ph);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (out > 0) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(this.prog);
      gl.uniform2f(gl.getUniformLocation(this.prog, 'uViewport'), vw, vh);
      gl.bindVertexArray(this.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.gpuData.subarray(0, out * GPU_INSTANCE_STRIDE));
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, out);
      gl.bindVertexArray(null);
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      this.canvas.style.display = 'none';
    }
  };

  public destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
    if (this.gl) {
      if (this.prog) this.gl.deleteProgram(this.prog);
      if (this.vao) this.gl.deleteVertexArray(this.vao);
      if (this.instanceBuf) this.gl.deleteBuffer(this.instanceBuf);
      this.gl = null;
    }
    this.canvas?.remove();
    this.canvas = null;
  }
}

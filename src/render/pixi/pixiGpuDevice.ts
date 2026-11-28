// Track B1: PixiJS v8 Low-Level GPU Backbone (Locked strictly to WebGL2 per Iron Law #2).
// - Iron Law #1: ZERO `PIXI.Sprite` / `PIXI.Container` scene graph for valley tiles, grass, or buildings.
//   Only low-level `WebGLRenderer`, `Buffer`, `BufferUsage`, `Geometry`, `GlProgram`, and `RenderTarget` are exposed.
// - Iron Law #2: Locked to `preference: 'webgl'` (WebGL2) across B1–B6 so custom `TEXTURE_2D_ARRAY` shaders
//   and Spine 2D share one deterministic context without dual-backend fragmentation.

// HPVN: the renderer only uses the raw WebGL2 context below; the PixiJS helpers it never called are gone,
// so the 360 KB vendor-pixi chunk no longer loads with every farm.

export interface PixiGpuDeviceOptions {
  canvas: HTMLCanvasElement;
  dprCap?: number;
  preserveDrawingBuffer?: boolean;
  onContextLost?: () => void;
  onContextRestored?: () => void;
}

export class PixiGpuDevice {
  public readonly preference = 'webgl' as const;
  public readonly canvas: HTMLCanvasElement;
  public readonly gl: WebGL2RenderingContext;
  public readonly supportsHalfFloatHdr: boolean;
  public contextLost = false;

  private readonly handleLost: (ev: Event) => void;
  private readonly handleRestored: () => void;

  constructor(options: PixiGpuDeviceOptions) {
    this.canvas = options.canvas;
    const gl = options.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? false,
    });
    if (!gl) {
      throw new Error('[PixiGpuDevice] Thiết bị không hỗ trợ WebGL2.');
    }
    this.gl = gl;

    const floatExt = gl.getExtension('EXT_color_buffer_float');
    const floatLinearExt = gl.getExtension('OES_texture_float_linear');
    this.supportsHalfFloatHdr = Boolean(floatExt && floatLinearExt);

    this.handleLost = (ev: Event) => {
      ev.preventDefault();
      this.contextLost = true;
      options.onContextLost?.();
    };
    this.handleRestored = () => {
      this.contextLost = false;
      options.onContextRestored?.();
    };
    this.canvas.addEventListener('webglcontextlost', this.handleLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.handleRestored, false);
  }

  public resetSharedGlState(): void {
    this.gl.bindVertexArray(null);
  }

  public destroy(): void {
    this.canvas.removeEventListener('webglcontextlost', this.handleLost, false);
    this.canvas.removeEventListener('webglcontextrestored', this.handleRestored, false);
  }
}

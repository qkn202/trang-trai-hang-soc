// Track B1: PixiJS v8 Low-Level GPU Backbone (Locked strictly to WebGL2 per Iron Law #2).
// - Iron Law #1: ZERO `PIXI.Sprite` / `PIXI.Container` scene graph for valley tiles, grass, or buildings.
//   Only low-level `WebGLRenderer`, `Buffer`, `BufferUsage`, `Geometry`, `GlProgram`, and `RenderTarget` are exposed.
// - Iron Law #2: Locked to `preference: 'webgl'` (WebGL2) across B1–B6 so custom `TEXTURE_2D_ARRAY` shaders
//   and Spine 2D share one deterministic context without dual-backend fragmentation.

import {
  Buffer,
  BufferUsage,
  Geometry,
  GlProgram,
  RenderTarget,
  WebGLRenderer,
} from 'pixi.js';

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
  public pixiRenderer: WebGLRenderer | null = null;
  public readonly supportsHalfFloatHdr: boolean;
  public contextLost = false;

  private readonly handleLost: (ev: Event) => void;
  private readonly handleRestored: () => void;
  private readonly managedBuffers: Buffer[] = [];
  private readonly managedTargets: RenderTarget[] = [];

  constructor(options: PixiGpuDeviceOptions) {
    this.canvas = options.canvas;
    const gl = options.canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: options.preserveDrawingBuffer ?? true,
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

  /**
   * Lazily initializes PixiJS v8 `WebGLRenderer` attached to the exact same WebGL2 context
   * when Spine 2D or KTX2 subsystems request Pixi's low-level pipeline.
   */
  public async ensurePixiWebGLRenderer(width: number, height: number): Promise<WebGLRenderer> {
    if (this.pixiRenderer) {
      if (this.pixiRenderer.width !== width || this.pixiRenderer.height !== height) {
        this.pixiRenderer.resize(width, height, 1);
      }
      return this.pixiRenderer;
    }
    const renderer = new WebGLRenderer();
    await renderer.init({
      canvas: this.canvas,
      context: this.gl,
      width: Math.max(2, width),
      height: Math.max(2, height),
      resolution: 1,
      antialias: false,
      clearBeforeRender: false,
      powerPreference: 'high-performance',
      preferWebGLVersion: 2,
    });
    this.pixiRenderer = renderer;
    return renderer;
  }

  /**
   * Allocates a low-level Pixi v8 instanced vertex `Buffer` backed by a pre-allocated TypedArray
   * (0 `PIXI.Sprite` allocation — Iron Law #1).
   */
  public createInstancedSoABuffer(data: Float32Array | Uint16Array, dynamic = true): Buffer {
    const buf = new Buffer({
      data,
      usage: BufferUsage.VERTEX | (dynamic ? BufferUsage.COPY_DST : BufferUsage.STATIC),
    });
    this.managedBuffers.push(buf);
    return buf;
  }

  public createHdrRenderTarget(width: number, height: number): RenderTarget {
    const rt = new RenderTarget({
      width: Math.max(2, width),
      height: Math.max(2, height),
      colorTextures: 1,
    });
    this.managedTargets.push(rt);
    return rt;
  }

  public createLowLevelGlProgram(vertex: string, fragment: string, name: string): GlProgram {
    return GlProgram.from({ vertex, fragment, name });
  }

  public createInstancedQuadGeometry(instanceBuffer: Buffer, strideBytes: number): Geometry {
    const quadVerts = new Float32Array([-0.5, 0.0, 0.5, 0.0, -0.5, 1.0, 0.5, 1.0]);
    return new Geometry({
      attributes: {
        aQuad: {
          buffer: quadVerts,
          format: 'float32x2',
          stride: 8,
          offset: 0,
          instance: false,
        },
        iSlotA: {
          buffer: instanceBuffer,
          format: 'float32x4',
          stride: strideBytes,
          offset: 0,
          instance: true,
        },
      },
      topology: 'triangle-strip',
    });
  }

  /**
   * Resets Pixi's cached WebGL state after custom raw `TEXTURE_2D_ARRAY` instanced passes
   * or after an interleaved Spine 2D draw so neither pipeline corrupts the other's VAO/blend state.
   */
  public resetSharedGlState(): void {
    if (this.pixiRenderer?.state) {
      this.pixiRenderer.state.resetState();
    }
    this.gl.bindVertexArray(null);
  }

  public destroy(): void {
    this.canvas.removeEventListener('webglcontextlost', this.handleLost, false);
    this.canvas.removeEventListener('webglcontextrestored', this.handleRestored, false);
    for (const b of this.managedBuffers) {
      b.destroy();
    }
    this.managedBuffers.length = 0;
    for (const rt of this.managedTargets) {
      rt.destroy();
    }
    this.managedTargets.length = 0;
    if (this.pixiRenderer) {
      this.pixiRenderer.destroy();
      this.pixiRenderer = null;
    }
  }
}

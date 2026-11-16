// Track B2 & B7: Hardware GPU Compressed Texture Capability Detection (ASTC / BC7 / ETC2)
// & KTX2 Container Parser / `TEXTURE_2D_ARRAY` Uploader (with PixiJS v8 KTX2 hook).

export type GpuCompressedFormatFamily = 'astc' | 'bc7' | 's3tc' | 'etc2' | 'rgba8-fallback';

export interface GpuCompressedSupport {
  preferredFamily: GpuCompressedFormatFamily;
  astc4x4Srgb: number | null;
  bc7Srgb: number | null;
  etc2Rgba8Srgb: number | null;
  s3tcDxt5Srgb: number | null;
}

const KTX2_MAGIC = new Uint8Array([
  0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a,
]);

export interface ParsedKtx2Header {
  vkFormat: number;
  pixelWidth: number;
  pixelHeight: number;
  layerCount: number;
  levelCount: number;
  supercompressionScheme: number;
  level0ByteOffset: number;
  level0ByteLength: number;
}

export function detectGpuCompressedSupport(
  gl: WebGL2RenderingContext | null
): GpuCompressedSupport {
  if (!gl) {
    return {
      preferredFamily: 'rgba8-fallback',
      astc4x4Srgb: null,
      bc7Srgb: null,
      etc2Rgba8Srgb: null,
      s3tcDxt5Srgb: null,
    };
  }

  const astc = gl.getExtension('WEBGL_compressed_texture_astc');
  const bptc = gl.getExtension('EXT_texture_compression_bptc');
  const etc = gl.getExtension('WEBGL_compressed_texture_etc');
  const s3tcSrgb = gl.getExtension('WEBGL_compressed_texture_s3tc_srgb');

  const astc4x4Srgb = astc ? astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : null;
  const bc7Srgb = bptc ? bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : null;
  const etc2Rgba8Srgb = etc ? etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : null;
  const s3tcDxt5Srgb = s3tcSrgb ? s3tcSrgb.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT : null;

  const preferredFamily: GpuCompressedFormatFamily = astc4x4Srgb
    ? 'astc'
    : bc7Srgb
      ? 'bc7'
      : etc2Rgba8Srgb
        ? 'etc2'
        : s3tcDxt5Srgb
          ? 's3tc'
          : 'rgba8-fallback';

  return {
    preferredFamily,
    astc4x4Srgb,
    bc7Srgb,
    etc2Rgba8Srgb,
    s3tcDxt5Srgb,
  };
}

export function parseKtx2ContainerHeader(buffer: ArrayBuffer): ParsedKtx2Header | null {
  if (buffer.byteLength < 80) return null;
  const bytes = new Uint8Array(buffer, 0, 12);
  for (let i = 0; i < 12; i++) {
    if (bytes[i] !== KTX2_MAGIC[i]) return null;
  }
  const view = new DataView(buffer);
  const vkFormat = view.getUint32(12, true);
  const pixelWidth = view.getUint32(20, true);
  const pixelHeight = view.getUint32(24, true);
  const layerCount = Math.max(1, view.getUint32(32, true));
  const levelCount = Math.max(1, view.getUint32(40, true));
  const supercompressionScheme = view.getUint32(44, true);

  // Level index starts at byte 80; each level entry is 24 bytes (3 × uint64 little-endian)
  if (buffer.byteLength < 80 + 24) return null;
  const level0ByteOffset = Number(view.getBigUint64(80, true));
  const level0ByteLength = Number(view.getBigUint64(88, true));
  if (level0ByteOffset + level0ByteLength > buffer.byteLength) return null;

  return {
    vkFormat,
    pixelWidth,
    pixelHeight,
    layerCount,
    levelCount,
    supercompressionScheme,
    level0ByteOffset,
    level0ByteLength,
  };
}

export function uploadPretranscodedKtx2Layer(
  gl: WebGL2RenderingContext,
  targetArrayTex: WebGLTexture,
  layerIndex: number,
  internalFormat: number,
  buffer: ArrayBuffer
): boolean {
  const header = parseKtx2ContainerHeader(buffer);
  if (!header || header.supercompressionScheme !== 0) return false;
  const payload = new Uint8Array(buffer, header.level0ByteOffset, header.level0ByteLength);
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, targetArrayTex);
  gl.compressedTexSubImage3D(
    gl.TEXTURE_2D_ARRAY,
    0,
    0,
    0,
    layerIndex,
    header.pixelWidth,
    header.pixelHeight,
    1,
    internalFormat,
    payload
  );
  return true;
}

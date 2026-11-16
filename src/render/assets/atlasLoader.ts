// Track B2: Offline-Baked Atlas Manifest, 1-Bit Alpha Hitmask Binary Codec (`hitmasks.bin`),
// and GPU `mask12` Seamless Fence Sub-Tile UV Lookup Table.

export const HITMASK_MAGIC = 0x4d544948; // 'HITM' little-endian
export const HITMASK_VERSION = 1;
export const HITMASK_DOWNSAMPLE = 4;

export interface OfflineSpriteAtlasEntry {
  id: number;
  key: string;
  layer: number;
  x: number;
  y: number;
  w: number;
  h: number;
  origW: number;
  origH: number;
  groundBlended: boolean;
  hitmaskByteOffset: number;
  hitmaskCols: number;
  hitmaskRows: number;
}

export interface OfflineAtlasManifest {
  version: number;
  atlasSize: number;
  layers: number;
  pad: number;
  entries: OfflineSpriteAtlasEntry[];
}

export interface DecodedHitmaskRecord {
  key: string;
  cols: number;
  rows: number;
  origW: number;
  origH: number;
  bits: Uint8Array;
}

/**
 * Packs RGBA8 pixel data (width × height) into a 1/4-resolution 1-bit alpha bitmask
 * matching `SpriteRegistry.hitTestAlpha` (`alpha >= alphaThreshold`).
 */
export function packRgbaTo1BitHitmask(
  rgba: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold = 28
): { cols: number; rows: number; bits: Uint8Array } {
  const cols = Math.max(1, Math.ceil(width / HITMASK_DOWNSAMPLE));
  const rows = Math.max(1, Math.ceil(height / HITMASK_DOWNSAMPLE));
  const totalBits = cols * rows;
  const bits = new Uint8Array(Math.ceil(totalBits / 8));

  for (let my = 0; my < rows; my++) {
    const py = Math.min(height - 1, my * HITMASK_DOWNSAMPLE + (HITMASK_DOWNSAMPLE >> 1));
    for (let mx = 0; mx < cols; mx++) {
      const px = Math.min(width - 1, mx * HITMASK_DOWNSAMPLE + (HITMASK_DOWNSAMPLE >> 1));
      const a = rgba[(py * width + px) * 4 + 3] ?? 0;
      if (a >= alphaThreshold) {
        const bitIdx = my * cols + mx;
        bits[bitIdx >> 3] |= 1 << (bitIdx & 7);
      }
    }
  }
  return { cols, rows, bits };
}

/**
 * Tests normalized sprite UV `(u, v)` in `[0..1]` against a packed 1-bit hitmask in O(1).
 */
export function hitTestPacked1BitMask(
  record: { cols: number; rows: number; bits: Uint8Array },
  u: number,
  v: number,
  flipX = false
): boolean {
  if (u < 0 || u > 1 || v < 0 || v > 1) return false;
  const effU = flipX ? 1 - u : u;
  const mx = Math.min(record.cols - 1, Math.max(0, Math.floor(effU * record.cols)));
  const my = Math.min(record.rows - 1, Math.max(0, Math.floor(v * record.rows)));
  const bitIdx = my * record.cols + mx;
  return (record.bits[bitIdx >> 3] & (1 << (bitIdx & 7))) !== 0;
}

/**
 * Encodes multiple 1-bit hitmask records into a single binary `hitmasks.bin` buffer:
 * Header (12 bytes): [MAGIC u32, VERSION u16, COUNT u16, RESERVED u32]
 * Per Entry: [id u16, cols u16, rows u16, origW u16, origH u16, byteLen u16] + [bits...]
 */
export function encodeHitmasksBinary(
  items: ReadonlyArray<{
    id: number;
    cols: number;
    rows: number;
    origW: number;
    origH: number;
    bits: Uint8Array;
  }>
): ArrayBuffer {
  let totalBytes = 12;
  for (const it of items) {
    totalBytes += 12 + it.bits.byteLength;
  }
  const buf = new ArrayBuffer(totalBytes);
  const view = new DataView(buf);
  const u8 = new Uint8Array(buf);

  view.setUint32(0, HITMASK_MAGIC, true);
  view.setUint16(4, HITMASK_VERSION, true);
  view.setUint16(6, items.length, true);
  view.setUint32(8, 0, true);

  let offset = 12;
  for (const it of items) {
    view.setUint16(offset, it.id, true);
    view.setUint16(offset + 2, it.cols, true);
    view.setUint16(offset + 4, it.rows, true);
    view.setUint16(offset + 6, it.origW, true);
    view.setUint16(offset + 8, it.origH, true);
    view.setUint16(offset + 10, it.bits.byteLength, true);
    offset += 12;
    u8.set(it.bits, offset);
    offset += it.bits.byteLength;
  }
  return buf;
}

export function decodeHitmasksBinary(
  buf: ArrayBuffer
): Map<number, { cols: number; rows: number; origW: number; origH: number; bits: Uint8Array }> {
  const out = new Map<
    number,
    { cols: number; rows: number; origW: number; origH: number; bits: Uint8Array }
  >();
  if (buf.byteLength < 12) return out;
  const view = new DataView(buf);
  const magic = view.getUint32(0, true);
  const version = view.getUint16(4, true);
  if (magic !== HITMASK_MAGIC || version !== HITMASK_VERSION) {
    return out;
  }
  const count = view.getUint16(6, true);
  let offset = 12;
  for (let i = 0; i < count && offset + 12 <= buf.byteLength; i++) {
    const id = view.getUint16(offset, true);
    const cols = view.getUint16(offset + 2, true);
    const rows = view.getUint16(offset + 4, true);
    const origW = view.getUint16(offset + 6, true);
    const origH = view.getUint16(offset + 8, true);
    const byteLen = view.getUint16(offset + 10, true);
    offset += 12;
    if (offset + byteLen > buf.byteLength) break;
    const bits = new Uint8Array(buf.slice(offset, offset + byteLen));
    offset += byteLen;
    out.set(id, { cols, rows, origW, origH, bits });
  }
  return out;
}

export interface Mask12SubTileSegment {
  /** Normalized sub-rect inside the connectable plot sprite `[u0, v0, u1, v1]`. */
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  /** Offset multiplier relative to tile center `[-0.5..0.5]`. */
  ox: number;
  oy: number;
}

/**
 * GPU Sub-Tile UV Lookup for `mask12` seamless perimeter fences (`connectableGroup`).
 * Bits:
 * - `1` (N / top-right edge open), `2` (E / bottom-right edge open),
 *   `4` (S / bottom-left edge open), `8` (W / top-left edge open)
 * - Upper bits `16..2048`: diagonal inner-corner post flags.
 * Returns active perimeter fence sub-segments (0 when surrounded on all 4 cardinal sides!).
 */
const MASK12_SEGMENT_CACHE: Array<ReadonlyArray<Mask12SubTileSegment>> = [];

export function getMask12FenceSubTileSegments(mask12: number): ReadonlyArray<Mask12SubTileSegment> {
  const key = mask12 & 0xfff;
  const cached = MASK12_SEGMENT_CACHE[key];
  if (cached) return cached;

  const segs: Mask12SubTileSegment[] = [];
  // Cardinal perimeter rails (drawn ONLY when neighbor in that direction is NOT connected!)
  if ((key & 1) === 0) {
    // North-East rail
    segs.push({ u0: 0.48, v0: 0.02, u1: 0.98, v1: 0.52, ox: 0.24, oy: -0.24 });
  }
  if ((key & 2) === 0) {
    // South-East rail
    segs.push({ u0: 0.48, v0: 0.48, u1: 0.98, v1: 0.98, ox: 0.24, oy: 0.24 });
  }
  if ((key & 4) === 0) {
    // South-West rail
    segs.push({ u0: 0.02, v0: 0.48, u1: 0.52, v1: 0.98, ox: -0.24, oy: 0.24 });
  }
  if ((key & 8) === 0) {
    // North-West rail
    segs.push({ u0: 0.02, v0: 0.02, u1: 0.52, v1: 0.52, ox: -0.24, oy: -0.24 });
  }
  MASK12_SEGMENT_CACHE[key] = segs;
  return segs;
}

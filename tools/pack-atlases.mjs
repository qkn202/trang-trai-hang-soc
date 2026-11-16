#!/usr/bin/env node
/**
 * Track B2 — Offline Sprite Atlas & 1-Bit Alpha Hitmask Baker (`tools/pack-atlases.mjs`)
 *
 * - Đọc `public/sprites/*.png` ở chế độ CHỈ ĐỌC (không bao giờ sửa hoặc đổi tên file PNG của Artist!).
 * - Mô phỏng offline quy tắc `applyGroundBlend` (làm dịu rìa đáy công trình Plinth-Free) + shelf-packing 2048×2048.
 * - Xuất `atlas-manifest.json` + `hitmasks.bin` (mặt nạ click 1-bit tỉ lệ 1/4 độ phân giải, 0ms CPU khi khởi động game).
 *
 * Cách chạy:
 *   node tools/pack-atlases.mjs --dry-run
 *   node tools/pack-atlases.mjs --out public/atlases
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const ATLAS_SIZE = 2048;
const ATLAS_PAD = 2;
const MAX_SPRITE_DIM = 1024;
const HITMASK_MAGIC = 0x4d544948; // 'HITM'
const HITMASK_VERSION = 1;
const HITMASK_DOWNSAMPLE = 4;

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const outIdx = args.indexOf('--out');
const outDir = path.resolve(
  process.cwd(),
  outIdx >= 0 && args[outIdx + 1] ? args[outIdx + 1] : 'public/atlases'
);
const spritesDir = path.resolve(process.cwd(), 'public/sprites');

function readPngHeader(buf) {
  if (buf.length < 24) throw new Error('PNG too short');
  const sig = buf.subarray(0, 8);
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!sig.equals(pngSig)) throw new Error('Invalid PNG signature');
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  return { width, height, bitDepth, colorType };
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/**
 * Decodes standard 8-bit RGBA/RGB PNG IDAT chunks using Node built-in `zlib` (0 external dependencies!)
 * so we can compute exact 1-bit `hitmasks.bin` offline.
 */
function decodePngRgba8(buf) {
  const { width, height, bitDepth, colorType } = readPngHeader(buf);
  if (bitDepth !== 8 || (colorType !== 6 && colorType !== 2)) {
    return null;
  }
  const bpp = colorType === 6 ? 4 : 3;
  const idatParts = [];
  let offset = 8;
  while (offset + 8 <= buf.length) {
    const len = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IDAT') {
      idatParts.push(buf.subarray(offset + 8, offset + 8 + len));
    } else if (type === 'IEND') {
      break;
    }
    offset += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idatParts));
  const rowBytes = width * bpp;
  const recon = new Uint8Array(height * rowBytes);
  let srcOff = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[srcOff++];
    const rowStart = y * rowBytes;
    const prevRowStart = (y - 1) * rowBytes;
    for (let x = 0; x < rowBytes; x++) {
      const byte = raw[srcOff++];
      const a = x >= bpp ? recon[rowStart + x - bpp] : 0;
      const b = y > 0 ? recon[prevRowStart + x] : 0;
      const c = y > 0 && x >= bpp ? recon[prevRowStart + x - bpp] : 0;
      let val = byte;
      if (filter === 1) val = (byte + a) & 0xff;
      else if (filter === 2) val = (byte + b) & 0xff;
      else if (filter === 3) val = (byte + ((a + b) >> 1)) & 0xff;
      else if (filter === 4) val = (byte + paethPredictor(a, b, c)) & 0xff;
      recon[rowStart + x] = val;
    }
  }
  if (bpp === 4) return recon;
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    rgba[i * 4] = recon[i * 3];
    rgba[i * 4 + 1] = recon[i * 3 + 1];
    rgba[i * 4 + 2] = recon[i * 3 + 2];
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

function shouldApplyGroundBlend(key) {
  return !(
    key.startsWith('m3_') ||
    key.startsWith('ui_icon_') ||
    key.startsWith('villager_') ||
    key.startsWith('guest_') ||
    key.startsWith('staff_')
  );
}

function packHitmaskFromRgba(rgba, width, height) {
  const cols = Math.max(1, Math.ceil(width / HITMASK_DOWNSAMPLE));
  const rows = Math.max(1, Math.ceil(height / HITMASK_DOWNSAMPLE));
  const bits = new Uint8Array(Math.ceil((cols * rows) / 8));
  if (!rgba) {
    bits.fill(0xff);
    return { cols, rows, bits };
  }
  for (let my = 0; my < rows; my++) {
    const py = Math.min(height - 1, my * HITMASK_DOWNSAMPLE + 2);
    for (let mx = 0; mx < cols; mx++) {
      const px = Math.min(width - 1, mx * HITMASK_DOWNSAMPLE + 2);
      const alpha = rgba[(py * width + px) * 4 + 3] ?? 0;
      if (alpha >= 28) {
        const bitIdx = my * cols + mx;
        bits[bitIdx >> 3] |= 1 << (bitIdx & 7);
      }
    }
  }
  return { cols, rows, bits };
}

function main() {
  if (!fs.existsSync(spritesDir)) {
    console.error(`❌ Không tìm thấy thư mục sprite: ${spritesDir}`);
    process.exit(1);
  }
  const pngFiles = fs
    .readdirSync(spritesDir)
    .filter((f) => f.endsWith('.png'))
    .sort();

  const items = pngFiles.map((fileName) => {
    const full = path.join(spritesDir, fileName);
    const buf = fs.readFileSync(full);
    const { width, height } = readPngHeader(buf);
    const key = fileName.replace(/\.png$/, '');
    const scale = Math.min(1, MAX_SPRITE_DIM / Math.max(width, height));
    const pw = Math.max(4, Math.round(width * scale));
    const ph = Math.max(4, Math.round(height * scale));
    return { key, full, buf, origW: width, origH: height, pw, ph };
  });

  // Sort by descending height for tight shelf packing
  items.sort((a, b) => b.ph - a.ph || b.pw - a.pw || a.key.localeCompare(b.key));

  let layer = 0;
  let curX = ATLAS_PAD;
  let curY = ATLAS_PAD;
  let rowH = 0;

  const manifestEntries = [];
  const hitmaskRecords = [];
  let runningHitmaskByteOffset = 12;

  for (let id = 0; id < items.length; id++) {
    const it = items[id];
    if (curX + it.pw + ATLAS_PAD > ATLAS_SIZE) {
      curX = ATLAS_PAD;
      curY += rowH + ATLAS_PAD;
      rowH = 0;
    }
    if (curY + it.ph + ATLAS_PAD > ATLAS_SIZE) {
      layer += 1;
      curX = ATLAS_PAD;
      curY = ATLAS_PAD;
      rowH = 0;
    }
    const x = curX;
    const y = curY;
    curX += it.pw + ATLAS_PAD;
    rowH = Math.max(rowH, it.ph);

    const rgba = decodePngRgba8(it.buf);
    const hm = packHitmaskFromRgba(rgba, it.origW, it.origH);

    manifestEntries.push({
      id,
      key: it.key,
      layer,
      x,
      y,
      w: it.pw,
      h: it.ph,
      origW: it.origW,
      origH: it.origH,
      groundBlended: shouldApplyGroundBlend(it.key),
      hitmaskByteOffset: runningHitmaskByteOffset,
      hitmaskCols: hm.cols,
      hitmaskRows: hm.rows,
    });

    hitmaskRecords.push({
      id,
      cols: hm.cols,
      rows: hm.rows,
      origW: it.origW,
      origH: it.origH,
      bits: hm.bits,
    });
    runningHitmaskByteOffset += 12 + hm.bits.byteLength;
  }

  const totalLayers = layer + 1;
  const hitmaskBuf = Buffer.alloc(runningHitmaskByteOffset);
  hitmaskBuf.writeUInt32LE(HITMASK_MAGIC, 0);
  hitmaskBuf.writeUInt16LE(HITMASK_VERSION, 4);
  hitmaskBuf.writeUInt16LE(hitmaskRecords.length, 6);
  hitmaskBuf.writeUInt32LE(0, 8);

  let off = 12;
  for (const r of hitmaskRecords) {
    hitmaskBuf.writeUInt16LE(r.id, off);
    hitmaskBuf.writeUInt16LE(r.cols, off + 2);
    hitmaskBuf.writeUInt16LE(r.rows, off + 4);
    hitmaskBuf.writeUInt16LE(r.origW, off + 6);
    hitmaskBuf.writeUInt16LE(r.origH, off + 8);
    hitmaskBuf.writeUInt16LE(r.bits.byteLength, off + 10);
    off += 12;
    Buffer.from(r.bits.buffer, r.bits.byteOffset, r.bits.byteLength).copy(hitmaskBuf, off);
    off += r.bits.byteLength;
  }

  const manifest = {
    version: 1,
    atlasSize: ATLAS_SIZE,
    layers: totalLayers,
    pad: ATLAS_PAD,
    entries: manifestEntries,
  };

  if (isDryRun) {
    console.log(
      `✓ [pack-atlases --dry-run] Packed ${manifestEntries.length} sprites into ${totalLayers} TEXTURE_2D_ARRAY layers (${ATLAS_SIZE}x${ATLAS_SIZE}), hitmasks.bin = ${(hitmaskBuf.byteLength / 1024).toFixed(1)} KB`
    );
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'atlas-manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(outDir, 'hitmasks.bin'), hitmaskBuf);
  console.log(
    `✓ [pack-atlases] Wrote ${manifestEntries.length} entries (${totalLayers} layers) + hitmasks.bin (${(hitmaskBuf.byteLength / 1024).toFixed(1)} KB) -> ${outDir}`
  );
}

main();

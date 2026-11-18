#!/usr/bin/env node
/**
 * Sprite pipeline validator.
 *
 * Checks every file in public/sprites against the art-direction rules so a
 * freshly drawn batch can be dropped in without breaking the render loop.
 *
 *   node tools/validate-sprites.mjs
 *
 * Exit code 0 = all good, 1 = at least one hard failure.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SPRITES_DIR = join(ROOT, 'public', 'sprites');
const LOADER_PATH = join(ROOT, 'src', 'engine', 'spriteLoader.ts');
const MAX_WEBP_BYTES = 150 * 1024;

/** Read SPRITE_KEYS directly from src/engine/spriteLoader.ts so they stay 100% synced. */
function loadRequiredKeys() {
  const src = readFileSync(LOADER_PATH, 'utf8');
  const m = src.match(/export const SPRITE_KEYS = \[([\s\S]*?)\] as const;/);
  if (!m) {
    throw new Error('Could not parse SPRITE_KEYS from src/engine/spriteLoader.ts');
  }
  return [...m[1].matchAll(/'([^']+)'/g)].map((hit) => hit[1]);
}

const REQUIRED = loadRequiredKeys();
const DOM_ONLY_PREFIXES = ['crest-', 'res_', 'ui_', 'item_'];

/**
 * Per-key rules.
 *  - maxW/maxH: the current file's canvas budget. New art may be larger but
 *    must keep the same aspect ratio family so nothing gets distorted.
 *  - ratio: (w/h) the renderer assumes. Used to flag a badly reshaped sprite.
 */
const RULES = {
  m3: { square: true, maxW: 192, maxH: 192 },
  ui_crop: { maxW: 256, maxH: 256, minRatio: 0.55, maxRatio: 1.85 },
  char: { maxH: 260, minRatio: 0.35, maxRatio: 1.25 },
  beast: { maxH: 280, minRatio: 0.5, maxRatio: 1.6 },
  vehicle: { maxH: 280, maxRatio: 2.3 },
  building: { maxW: 512, maxH: 512, minRatio: 0.5, maxRatio: 2.1 },
};

const RULE_OVERRIDES = {};

function ruleFor(key) {
  const override = RULE_OVERRIDES[key];
  if (override) return RULES[override];
  if (key.startsWith('ui_icon_crop_')) return RULES.ui_crop;
  if (key.startsWith('m3_') || key.startsWith('ui_icon_') || key.startsWith('ui_') || key.startsWith('res_') || key.startsWith('crest-')) {
    return RULES.m3;
  }
  if (key.startsWith('beast_')) return RULES.beast;
  if (key.startsWith('guest_') || key.startsWith('staff_') || key.startsWith('villager_')) return RULES.char;
  if (key.startsWith('vehicle_')) return RULES.vehicle;
  return RULES.building;
}

function readWebpSize(filePath) {
  const buf = readFileSync(filePath);
  if (buf.length < 30) return null;
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    return null;
  }
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8X') {
    // Extended WebP header: 24-bit width - 1 at bytes 24..26, height - 1 at 27..29
    const wMinus1 = buf[24] | (buf[25] << 8) | (buf[26] << 16);
    const hMinus1 = buf[27] | (buf[28] << 8) | (buf[29] << 16);
    return { width: wMinus1 + 1, height: hMinus1 + 1 };
  }
  if (chunk === 'VP8 ') {
    // Lossy VP8 bitstream: frame tag (3 bytes) + start code 9d 01 2a at offset 23
    if (buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }
  }
  if (chunk === 'VP8L') {
    // Lossless VP8L bitstream: signature 0x2f at byte 20, followed by 32-bit packed w-1/h-1
    if (buf[20] === 0x2f) {
      const b0 = buf[21];
      const b1 = buf[22];
      const b2 = buf[23];
      const b3 = buf[24];
      const width = 1 + (b0 | ((b1 & 0x3f) << 8));
      const height = 1 + (((b1 & 0xc0) >> 6) | (b2 << 2) | ((b3 & 0x0f) << 10));
      return { width, height };
    }
  }
  return null;
}

const errors = [];
const warnings = [];
const info = [];

const allFiles = readdirSync(SPRITES_DIR);
for (const f of allFiles) {
  const ext = extname(f).toLowerCase();
  if (ext !== '.webp') {
    errors.push(`${f}: bắt buộc định dạng .webp (phát hiện ${ext || 'không đuôi'})`);
  }
}

const present = new Set(
  allFiles
    .filter((f) => extname(f).toLowerCase() === '.webp')
    .map((f) => f.replace(/\.webp$/i, ''))
);

for (const key of REQUIRED) {
  if (!present.has(key)) {
    errors.push(`${key}: thiếu file (public/sprites/${key}.webp)`);
  }
}

for (const key of present) {
  const filePath = join(SPRITES_DIR, `${key}.webp`);
  const size = readWebpSize(filePath);
  if (!size) {
    errors.push(`${key}: không đọc được header WebP (file hỏng?)`);
    continue;
  }

  const rule = ruleFor(key);
  const bytes = statSync(filePath).size;
  const ratio = size.width / size.height;

  if (bytes > MAX_WEBP_BYTES) {
    errors.push(`${key}: ${Math.round(bytes / 1024)}KB > giới hạn 150KB HPVN`);
  }
  if (rule.square && size.width !== size.height && !key.startsWith('ui_icon_') && !key.startsWith('crest-')) {
    warnings.push(`${key}: nên là ô vuông (${size.width}×${size.height})`);
  }
  if (rule.minRatio && ratio < rule.minRatio) {
    warnings.push(`${key}: tỉ lệ ${ratio.toFixed(2)} quá hẹp so với dự kiến`);
  }
  if (rule.maxRatio && ratio > rule.maxRatio) {
    warnings.push(`${key}: tỉ lệ ${ratio.toFixed(2)} quá rộng so với dự kiến`);
  }

  info.push(`${key}: ${size.width}×${size.height} (${ratio.toFixed(2)}), ${(bytes / 1024).toFixed(1)}KB`);
}

const requiredSet = new Set(REQUIRED);
const extra = [...present].filter(
  (k) => !requiredSet.has(k) && !DOM_ONLY_PREFIXES.some((p) => k.startsWith(p))
);
for (const k of extra) {
  warnings.push(`${k}: có trong thư mục nhưng không nằm trong danh sách loader — sẽ không được tải`);
}

console.log(`\n🖼  Kiểm tra ${present.size} sprite .webp trong public/sprites (${REQUIRED.length} loader + ${present.size - REQUIRED.length} HUD/DOM)\n`);
console.log(info.slice(0, 12).join('\n') + `\n... (${info.length} tệp tổng cộng)`);

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} cảnh báo:`);
  console.log(warnings.map((w) => `   • ${w}`).join('\n'));
}

if (errors.length) {
  console.log(`\n❌ ${errors.length} lỗi:`);
  console.log(errors.map((e) => `   • ${e}`).join('\n'));
  process.exit(1);
}

console.log('\n✅ Không có lỗi. Toàn bộ sprite .webp sẵn sàng.\n');

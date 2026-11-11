#!/usr/bin/env node
/**
 * Non-Destructive Texture Atlas Bin-Packer & Manifest Generator (AAA Build Tool)
 *
 * Scans `public/sprites/*.png` READ-ONLY (strictly preserving Artist ownership of
 * individual PNG assets per AGENTS.md §0), computes optimal 2048x2048 shelf-packed
 * UV coordinates with 2px bleed padding across 3 logical GPU pages, and writes
 * `dist/atlases/atlas-manifest.json`.
 *
 * Usage:
 *   node tools/pack-atlases.mjs
 */

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SPRITES_DIR = join(ROOT, 'public', 'sprites');
const OUT_DIR = join(ROOT, 'dist', 'atlases');
const OUT_FILE = join(OUT_DIR, 'atlas-manifest.json');

const PAGE_SIZE = 2048;
const PADDING = 2;

function readPngHeader(filePath) {
  const buf = readFileSync(filePath);
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) {
    throw new Error(`Invalid PNG header: ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bytes: statSync(filePath).size,
  };
}

function classifyCategory(key) {
  if (key.startsWith('m3_') || key.startsWith('ui_icon_')) return 'ui_match3_icons';
  if (
    key.startsWith('beast_') ||
    key.startsWith('villager_') ||
    key.startsWith('staff_') ||
    key.startsWith('guest_') ||
    key.startsWith('npc_') ||
    key.startsWith('vehicle_')
  ) {
    return 'characters_beasts';
  }
  return 'buildings_nature';
}

function shelfPackCategory(category, items) {
  const sorted = [...items].sort((a, b) => b.height - a.height || b.width - a.width || a.key.localeCompare(b.key));
  const pages = [];

  let currentPage = {
    pageId: `${category}_0`,
    category,
    width: PAGE_SIZE,
    height: PAGE_SIZE,
    usedAreaPx: 0,
    frames: {},
  };
  let cursorX = PADDING;
  let cursorY = PADDING;
  let shelfH = 0;
  let pageIndex = 0;

  for (const item of sorted) {
    const paddedW = item.width + PADDING * 2;
    const paddedH = item.height + PADDING * 2;

    if (cursorX + paddedW > PAGE_SIZE) {
      cursorX = PADDING;
      cursorY += shelfH;
      shelfH = 0;
    }

    if (cursorY + paddedH > PAGE_SIZE) {
      pages.push(currentPage);
      pageIndex += 1;
      currentPage = {
        pageId: `${category}_${pageIndex}`,
        category,
        width: PAGE_SIZE,
        height: PAGE_SIZE,
        usedAreaPx: 0,
        frames: {},
      };
      cursorX = PADDING;
      cursorY = PADDING;
      shelfH = 0;
    }

    currentPage.frames[item.key] = {
      x: cursorX,
      y: cursorY,
      w: item.width,
      h: item.height,
      u0: Number((cursorX / PAGE_SIZE).toFixed(6)),
      v0: Number((cursorY / PAGE_SIZE).toFixed(6)),
      u1: Number(((cursorX + item.width) / PAGE_SIZE).toFixed(6)),
      v1: Number(((cursorY + item.height) / PAGE_SIZE).toFixed(6)),
    };
    currentPage.usedAreaPx += item.width * item.height;
    cursorX += paddedW;
    shelfH = Math.max(shelfH, paddedH);
  }

  if (Object.keys(currentPage.frames).length > 0) {
    pages.push(currentPage);
  }

  return pages.map((p) => ({
    ...p,
    occupancyPct: Number(((p.usedAreaPx / (PAGE_SIZE * PAGE_SIZE)) * 100).toFixed(2)),
  }));
}

const files = readdirSync(SPRITES_DIR)
  .filter((f) => extname(f).toLowerCase() === '.png')
  .sort();

const buckets = {
  buildings_nature: [],
  characters_beasts: [],
  ui_match3_icons: [],
};

let totalBytes = 0;
for (const file of files) {
  const key = file.replace(/\.png$/i, '');
  const meta = readPngHeader(join(SPRITES_DIR, file));
  totalBytes += meta.bytes;
  const category = classifyCategory(key);
  buckets[category].push({ key, ...meta });
}

const allPages = [
  ...shelfPackCategory('buildings_nature', buckets.buildings_nature),
  ...shelfPackCategory('characters_beasts', buckets.characters_beasts),
  ...shelfPackCategory('ui_match3_icons', buckets.ui_match3_icons),
];

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  pageSize: PAGE_SIZE,
  extrudePaddingPx: PADDING,
  totalSprites: files.length,
  totalRawKB: Math.round(totalBytes / 1024),
  pageCount: allPages.length,
  pages: allPages,
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(
  `✅ Packed ${manifest.totalSprites} sprites (${manifest.totalRawKB} KB read-only) into ${manifest.pageCount} atlas pages -> dist/atlases/atlas-manifest.json`
);
for (const page of allPages) {
  console.log(
    `   • ${page.pageId}: ${Object.keys(page.frames).length} frames (${page.occupancyPct}% UV occupancy)`
  );
}

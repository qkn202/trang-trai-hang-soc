#!/usr/bin/env node
/**
 * Kiểm định tự động bundle `dist-offline` (CI Gate theo OFFLINE_MINIGAME_HANDOFF.md §8 & §9):
 * 1. Đảm bảo đầy đủ file PWA độc lập (index.html, offline.html, manifest.webmanifest, sw.js, assets/, fonts/, icons/, paintings/, sprites/).
 * 2. Cấm tuyệt đối mọi dấu vết code mạng / backend / Firebase / cloudSave / save key game chính trong app bundle.
 * 3. Đảm bảo Service Worker đã được đóng dấu hash build và điền danh sách precache đầy đủ.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '..', 'dist-offline');

const REQUIRED_PATHS = [
  'index.html',
  'offline.html',
  'manifest.webmanifest',
  'sw.js',
  'assets',
  'fonts/fonts.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'paintings',
  'sprites',
];

const FORBIDDEN_APP_PATTERNS = [
  { label: 'fetch(', regex: /\bfetch\s*\(/ },
  { label: 'sendBeacon', regex: /\bsendBeacon\b/ },
  { label: 'XMLHttpRequest', regex: /\bXMLHttpRequest\b/ },
  { label: 'WebSocket', regex: /\bWebSocket\b/ },
  { label: 'EventSource', regex: /\bEventSource\b/ },
  { label: 'firebase', regex: /\bfirebase\b/i },
  { label: 'cloudfunctions', regex: /\bcloudfunctions\b/i },
  { label: 'authoritative', regex: /\bauthoritative\b/i },
  { label: 'onlineBootstrap', regex: /\bonlineBootstrap\b/ },
  { label: 'cloudSave', regex: /\bcloudSave\b/ },
  { label: 'hpvnBridge', regex: /\bhpvnBridge\b/ },
  { label: 'main farm save key (burrow_hogsmeade_777_v3)', regex: /burrow_hogsmeade_777_v3/ },
  { label: '/api/ endpoint', regex: /['"`]\/api\// },
];

const FORBIDDEN_SW_PATTERNS = [
  { label: 'sendBeacon', regex: /\bsendBeacon\b/ },
  { label: 'firebase', regex: /\bfirebase\b/i },
  { label: 'cloudfunctions', regex: /\bcloudfunctions\b/i },
  { label: 'authoritative', regex: /\bauthoritative\b/i },
  { label: 'onlineBootstrap', regex: /\bonlineBootstrap\b/ },
  { label: 'main farm save key', regex: /burrow_hogsmeade_777_v3/ },
];

const errors = [];

if (!fs.existsSync(DIST_DIR)) {
  console.error(`❌ Không tìm thấy thư mục build: ${DIST_DIR}`);
  process.exit(1);
}

for (const rel of REQUIRED_PATHS) {
  if (!fs.existsSync(path.join(DIST_DIR, rel))) {
    errors.push(`Thiếu đường dẫn bắt buộc trong dist-offline: ${rel}`);
  }
}

const filesToScanApp = [
  path.join(DIST_DIR, 'index.html'),
  path.join(DIST_DIR, 'offline.html'),
  path.join(DIST_DIR, 'manifest.webmanifest'),
];

const assetsDir = path.join(DIST_DIR, 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  const jsFiles = assetFiles.filter((f) => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    errors.push('Không có file JS nào trong dist-offline/assets/');
  }
  if (assetFiles.some((f) => f.includes('vendor-pixi'))) {
    errors.push('dist-offline kéo nhầm gói PixiJS của renderer thế giới 2.5D!');
  }
  for (const f of assetFiles) {
    if (f.endsWith('.js') || f.endsWith('.css')) {
      filesToScanApp.push(path.join(assetsDir, f));
    }
  }
}

for (const filePath of filesToScanApp) {
  if (!fs.existsSync(filePath)) continue;
  const content = fs.readFileSync(filePath, 'utf8');
  const relName = path.relative(DIST_DIR, filePath);
  for (const rule of FORBIDDEN_APP_PATTERNS) {
    if (rule.regex.test(content)) {
      errors.push(`Phát hiện mẫu cấm "${rule.label}" trong ${relName}`);
    }
  }
}

const indexHtmlPath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  if (indexHtml.includes('./assets/manifest-')) {
    errors.push('index.html trỏ nhầm manifest vào ./assets/ làm hỏng scope start_url của PWA!');
  }
}

const swPath = path.join(DIST_DIR, 'sw.js');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  if (!/CACHE_VERSION = 'offline-v1-[0-9a-f]{8}'/.test(swContent)) {
    errors.push('dist-offline/sw.js chưa được đóng dấu CACHE_VERSION hash!');
  }
  if (swContent.includes('__OFFLINE_PRECACHE_MANIFEST__')) {
    errors.push('dist-offline/sw.js chưa được điền PRECACHE_MANIFEST!');
  }
  if (!swContent.includes('./assets/')) {
    errors.push('dist-offline/sw.js không chứa danh sách chunk ./assets/ trong PRECACHE_MANIFEST!');
  }
  for (const rule of FORBIDDEN_SW_PATTERNS) {
    if (rule.regex.test(swContent)) {
      errors.push(`Phát hiện mẫu cấm "${rule.label}" trong sw.js`);
    }
  }
}

if (errors.length > 0) {
  console.error('❌ Kiểm định dist-offline THẤT BẠI:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log('✅ Kiểm định dist-offline THÀNH CÔNG: 0 backend/network import, đầy đủ PWA precache.');

#!/usr/bin/env node
/**
 * Đóng gói Gzip cho bản build sản xuất (`dist/`) của Trang Trại Hang Sóc & Thung Lũng Hogsmeade:
 * 1. Đảm bảo toàn bộ file văn bản / vector / biểu tượng trong `dist/` đều có bản nén tĩnh `.gz`
 *    (gzip level 9) với `mtime` đồng bộ tuyệt đối với file gốc (tương thích `gzip_static on;` của Nginx).
 * 2. Đóng gói trọn bộ `dist/` thành gói triển khai `release/hangsoc-webapp.tar.gz` sạch metadata macOS
 *    (`COPYFILE_DISABLE=1`, không `.DS_Store` hay `._*`).
 * 3. Xuất bảng kê kiểm định `release/build-manifest.json` (SHA-256, dung lượng gốc / gzip / tar.gz).
 */

import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import zlib from 'node:zlib';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const RELEASE_DIR = path.join(ROOT_DIR, 'release');
const ARCHIVE_NAME = 'hangsoc-webapp.tar.gz';
const ARCHIVE_PATH = path.join(RELEASE_DIR, ARCHIVE_NAME);
const MANIFEST_PATH = path.join(RELEASE_DIR, 'build-manifest.json');

const COMPRESSIBLE_EXTS = new Set([
  '.js',
  '.mjs',
  '.css',
  '.html',
  '.json',
  '.webmanifest',
  '.svg',
  '.ico',
  '.xml',
  '.txt',
]);
const MIN_GZIP_BYTES = 256;

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store' || entry.name.startsWith('._')) {
      fs.rmSync(path.join(dir, entry.name), { force: true });
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Chưa tìm thấy thư mục dist/. Hãy chạy `npm run build` trước.');
    process.exit(1);
  }

  const allFiles = walkFiles(DIST_DIR);
  const sourceFiles = allFiles.filter(
    (f) => !f.endsWith('.gz') && !f.endsWith('.br')
  );

  let compressibleCount = 0;
  let compressibleRawBytes = 0;
  let compressibleGzBytes = 0;
  let totalDistRawBytes = 0;

  for (const file of sourceFiles) {
    const stat = fs.statSync(file);
    totalDistRawBytes += stat.size;
    const ext = path.extname(file).toLowerCase();
    if (!COMPRESSIBLE_EXTS.has(ext) || stat.size < MIN_GZIP_BYTES) {
      continue;
    }

    const raw = fs.readFileSync(file);
    const gzPath = `${file}.gz`;
    const gz = zlib.gzipSync(raw, { level: zlib.constants.Z_BEST_COMPRESSION });
    fs.writeFileSync(gzPath, gz);
    // Đồng bộ atime/mtime giữa file gốc và file .gz để Nginx `gzip_static on;` phục vụ trực tiếp
    fs.utimesSync(gzPath, stat.atime, stat.mtime);

    compressibleCount += 1;
    compressibleRawBytes += raw.byteLength;
    compressibleGzBytes += gz.byteLength;
  }

  fs.mkdirSync(RELEASE_DIR, { recursive: true });
  if (fs.existsSync(ARCHIVE_PATH)) {
    fs.rmSync(ARCHIVE_PATH, { force: true });
  }

  // Đóng gói tar.gz chuẩn POSIX (loại bỏ tạm file .br khỏi gói tar.gz để gọn nhẹ cho VPS/Nginx)
  const tarArgs = [
    '--exclude=.DS_Store',
    '--exclude=._*',
    '--exclude=*.br',
    '-czf',
    ARCHIVE_PATH,
    '-C',
    DIST_DIR,
    '.',
  ];

  try {
    execFileSync('tar', ['--no-xattrs', ...tarArgs], {
      env: { ...process.env, COPYFILE_DISABLE: '1', GZIP: '-9' },
      stdio: 'pipe',
    });
  } catch {
    execFileSync('tar', tarArgs, {
      env: { ...process.env, COPYFILE_DISABLE: '1', GZIP: '-9' },
      stdio: 'pipe',
    });
  }

  const archiveBuf = fs.readFileSync(ARCHIVE_PATH);
  const sha256 = crypto.createHash('sha256').update(archiveBuf).digest('hex');

  const swPath = path.join(DIST_DIR, 'sw.js');
  let swVersion = 'unknown';
  if (fs.existsSync(swPath)) {
    const m = fs.readFileSync(swPath, 'utf8').match(/CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/);
    if (m) swVersion = m[1];
  }

  const savedRatio =
    compressibleRawBytes > 0
      ? Number(((1 - compressibleGzBytes / compressibleRawBytes) * 100).toFixed(1))
      : 0;

  const manifest = {
    app: 'Trang Trại Hang Sóc & Thung Lũng Hogsmeade',
    builtAt: new Date().toISOString(),
    serviceWorkerCacheVersion: swVersion,
    archive: {
      file: `release/${ARCHIVE_NAME}`,
      bytes: archiveBuf.byteLength,
      sizeHuman: formatMB(archiveBuf.byteLength),
      sha256,
    },
    distSummary: {
      sourceFileCount: sourceFiles.length,
      totalSourceBytes: totalDistRawBytes,
      totalSourceHuman: formatMB(totalDistRawBytes),
      gzipSidecarCount: compressibleCount,
      compressibleRawBytes,
      compressibleRawHuman: formatKB(compressibleRawBytes),
      compressibleGzipBytes: compressibleGzBytes,
      compressibleGzipHuman: formatKB(compressibleGzBytes),
      gzipSavingsPercent: savedRatio,
    },
  };

  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📦 ĐÓNG GÓI GZIP WEBAPP HOÀN TẤT');
  console.log(`  • Nén tĩnh .gz (level 9): ${compressibleCount} file (${formatKB(compressibleRawBytes)} -> ${formatKB(compressibleGzBytes)}, giảm ${savedRatio}%)`);
  console.log(`  • Tổng tài nguyên dist/ : ${sourceFiles.length} file gốc (${formatMB(totalDistRawBytes)})`);
  console.log(`  • Gói triển khai tar.gz : release/${ARCHIVE_NAME} (${formatMB(archiveBuf.byteLength)})`);
  console.log(`  • SHA-256               : ${sha256}`);
  console.log(`  • Manifest kiểm định    : release/build-manifest.json (SW ${swVersion})`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main();

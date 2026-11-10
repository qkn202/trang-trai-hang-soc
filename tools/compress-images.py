#!/usr/bin/env python3
"""
Nén tối ưu toàn bộ ảnh PNG/JPG trong public/ cho Trang Trại Hang Sóc:
- PNG RGBA (public/sprites, public/paintings/{chess,sudoku,caro}, public/icons):
  8-bit RGBA palette (PNG-8 + tRNS) với khoá cứng alpha=0 (0% lem nền),
  Median-Cut + K-Means (kmeans=4) cho vùng đục và K-Means premultiplied cho rìa bán trong suốt.
- JPEG (public/paintings/*.jpg):
  Progressive JPEG quality=82, optimize=True.
- Chỉ ghi đè khi dung lượng mới giảm ít nhất 5% (không bao giờ làm phình file đã tối ưu).
"""

from __future__ import annotations

import io
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / 'public'


def quantize_rgba_clean(im: Image.Image) -> Image.Image:
    im = im.convert('RGBA')
    arr = np.asarray(im, dtype=np.uint8)
    alpha = arr[:, :, 3]

    transparent_mask = alpha == 0
    opaque_mask = alpha >= 248
    semi_mask = (~transparent_mask) & (~opaque_mask)

    has_trans = bool(np.any(transparent_mask))
    semi_count = int(np.sum(semi_mask))

    n_trans = 1 if has_trans else 0
    n_semi = 0
    if semi_count > 0:
        n_semi = min(40, semi_count) if semi_count >= 400 else min(20, semi_count)
    n_opaque = max(16, 256 - n_trans - n_semi)

    palette_rgba: list[tuple[int, int, int, int]] = []
    if has_trans:
        palette_rgba.append((0, 0, 0, 0))

    rgb_clean = arr[:, :, :3].copy()
    if np.any(opaque_mask):
        fill_rgb = np.median(rgb_clean[opaque_mask], axis=0).astype(np.uint8)
    else:
        fill_rgb = np.array([128, 128, 128], dtype=np.uint8)
    rgb_clean[transparent_mask] = fill_rgb

    q_opaque = Image.fromarray(rgb_clean, mode='RGB').quantize(
        colors=n_opaque,
        method=Image.Quantize.MEDIANCUT,
        kmeans=4,
        dither=Image.Dither.FLOYDSTEINBERG,
    )
    raw_pal = q_opaque.getpalette()[: n_opaque * 3]
    actual_opaque = len(raw_pal) // 3
    for i in range(actual_opaque):
        palette_rgba.append((raw_pal[3 * i], raw_pal[3 * i + 1], raw_pal[3 * i + 2], 255))

    out_idx = np.asarray(q_opaque, dtype=np.uint8).copy() + n_trans
    if has_trans:
        out_idx[transparent_mask] = 0

    if n_semi > 0 and semi_count > 0:
        semi_px = arr[semi_mask].astype(np.float32)
        a_norm = semi_px[:, 3:4] / 255.0
        feats = np.hstack([semi_px[:, :3] * a_norm, semi_px[:, 3:4] * 1.6])
        rng = np.random.default_rng(42)
        k = min(n_semi, len(feats))
        sample_idx = rng.choice(len(feats), size=min(len(feats), 5000), replace=False)
        sample = feats[sample_idx]
        order = np.argsort(sample[:, 3])
        init_idx = np.linspace(0, len(sample) - 1, k, dtype=int)
        centers = sample[order[init_idx]].copy()
        for _ in range(12):
            dists = ((sample[:, None, :] - centers[None, :, :]) ** 2).sum(axis=2)
            labels = dists.argmin(axis=1)
            for ci in range(k):
                m = labels == ci
                if np.any(m):
                    centers[ci] = sample[m].mean(axis=0)
        dists_all = ((feats[:, None, :] - centers[None, :, :]) ** 2).sum(axis=2)
        semi_labels = dists_all.argmin(axis=1)
        base_slot = len(palette_rgba)
        for ci in range(k):
            m = semi_labels == ci
            if np.any(m):
                rgba_mean = np.clip(np.round(semi_px[m].mean(axis=0)), 0, 255).astype(int)
                rgba_mean[3] = max(1, min(247, int(rgba_mean[3])))
                palette_rgba.append(
                    (int(rgba_mean[0]), int(rgba_mean[1]), int(rgba_mean[2]), int(rgba_mean[3]))
                )
            else:
                palette_rgba.append((0, 0, 0, 128))
        out_idx[semi_mask] = (base_slot + semi_labels).astype(np.uint8)

    while len(palette_rgba) < 256:
        palette_rgba.append((0, 0, 0, 255))

    out_im = Image.fromarray(out_idx, mode='P')
    flat_rgb: list[int] = []
    alpha_bytes = bytearray()
    for r, g, b, a in palette_rgba[:256]:
        flat_rgb.extend([int(r), int(g), int(b)])
        alpha_bytes.append(int(a))
    out_im.putpalette(flat_rgb)
    out_im.info['transparency'] = bytes(alpha_bytes)
    return out_im


def compress_png(path: Path) -> tuple[int, int, bool]:
    orig = path.read_bytes()
    orig_len = len(orig)
    with Image.open(io.BytesIO(orig)) as im:
        if im.mode == 'P':
            buf = io.BytesIO()
            im.save(buf, format='PNG', optimize=True, compress_level=9)
            cand = buf.getvalue()
        else:
            q = quantize_rgba_clean(im)
            buf = io.BytesIO()
            q.save(buf, format='PNG', optimize=True, compress_level=9)
            cand = buf.getvalue()

    if len(cand) < int(orig_len * 0.95):
        path.write_bytes(cand)
        return orig_len, len(cand), True
    return orig_len, orig_len, False


def compress_jpg(path: Path) -> tuple[int, int, bool]:
    orig = path.read_bytes()
    orig_len = len(orig)
    with Image.open(io.BytesIO(orig)) as im:
        rgb = im.convert('RGB')
        buf = io.BytesIO()
        rgb.save(buf, format='JPEG', quality=82, optimize=True, progressive=True)
        cand = buf.getvalue()

    if len(cand) < int(orig_len * 0.95):
        path.write_bytes(cand)
        return orig_len, len(cand), True
    return orig_len, orig_len, False


def main() -> None:
    total_before = 0
    total_after = 0
    changed_count = 0
    total_count = 0

    for sub in ['sprites', 'paintings', 'icons']:
        folder = PUBLIC_DIR / sub
        sub_before = 0
        sub_after = 0
        sub_changed = 0
        files = sorted(
            f
            for f in folder.rglob('*')
            if f.is_file() and f.suffix.lower() in ('.png', '.jpg', '.jpeg')
        )
        for f in files:
            total_count += 1
            if f.suffix.lower() == '.png':
                b0, b1, ok = compress_png(f)
            else:
                b0, b1, ok = compress_jpg(f)
            sub_before += b0
            sub_after += b1
            if ok:
                sub_changed += 1
                changed_count += 1
        total_before += sub_before
        total_after += sub_after
        saved_pct = 100.0 * (1.0 - sub_after / max(1, sub_before))
        print(
            f"[{sub}] {sub_changed}/{len(files)} optimized: "
            f"{sub_before / 1024 / 1024:.2f} MB -> {sub_after / 1024 / 1024:.2f} MB "
            f"(-{saved_pct:.1f}%)"
        )

    overall_pct = 100.0 * (1.0 - total_after / max(1, total_before))
    print(
        f"\nTOTAL: {changed_count}/{total_count} images optimized | "
        f"{total_before / 1024 / 1024:.2f} MB -> {total_after / 1024 / 1024:.2f} MB "
        f"(saved {(total_before - total_after) / 1024 / 1024:.2f} MB / -{overall_pct:.1f}%)"
    )


if __name__ == '__main__':
    main()

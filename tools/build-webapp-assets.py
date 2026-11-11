#!/usr/bin/env python3
"""
Sinh trọn bộ tài nguyên hình ảnh WebApp / PWA / Open Graph cho
Trang Trại Hang Sóc & Thung Lũng Hogsmeade:
  - public/icons/icon-512.png          (512x512 RGBA squircle + viền vàng cổ điển, purpose="any")
  - public/icons/icon-192.png          (192x192 RGBA squircle + viền vàng cổ điển, purpose="any")
  - public/icons/icon-maskable-512.png (512x512 RGB tràn viền chuẩn safe-zone 80%, purpose="maskable")
  - public/icons/icon-maskable-192.png (192x192 RGB tràn viền chuẩn safe-zone 80%, purpose="maskable")
  - public/icons/apple-touch-icon.png  (180x180 RGB tràn viền cho iOS Home Screen, không kênh alpha)
  - public/icons/favicon-32.png        (32x32 RGBA sắc nét cho tab trình duyệt)
  - public/favicon.ico                 (16x16, 32x32, 48x48 multi-size ICO)
  - public/icons/og-banner.jpg         (1200x630 Progressive JPEG cho Open Graph / Twitter / Diễn đàn HPVN)
  - public/icons/screenshot-wide.jpg   (1280x720 Progressive JPEG cho Richer PWA Install Desktop/Tablet)
  - public/icons/screenshot-narrow.jpg (720x1280 Progressive JPEG cho Richer PWA Install Mobile)

Lưu ý: TUYỆT ĐỐI KHÔNG đụng vào public/sprites/*.png (tuân thủ AGENTS.md).
"""

from __future__ import annotations

import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / 'public' / 'icons'
FAVICON_ICO_PATH = ROOT / 'public' / 'favicon.ico'


def make_squircle_mask(size: int, radius_ratio: float = 0.225, supersample: int = 4) -> Image.Image:
    ss = size * supersample
    r = int(round(ss * radius_ratio))
    mask = Image.new('L', (ss, ss), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, ss - 1, ss - 1), radius=r, fill=255)
    return mask.resize((size, size), Image.Resampling.LANCZOS)


def make_badged_any_icon(master_rgb: Image.Image, size: int) -> Image.Image:
    """Tạo biểu tượng `purpose: any` dạng huy hiệu bo góc kèm viền vàng đồng ấm áp."""
    ss = size * 4
    art = master_rgb.resize((ss, ss), Image.Resampling.LANCZOS).convert('RGBA')
    art = ImageEnhance.Color(art).enhance(1.05)

    pad = max(4, int(round(ss * 0.02)))
    radius = int(round((ss - 2 * pad) * 0.225))
    border_w = max(6, int(round(ss * 0.022)))

    # Mặt nạ thân biểu tượng
    body_mask = Image.new('L', (ss, ss), 0)
    d_mask = ImageDraw.Draw(body_mask)
    d_mask.rounded_rectangle((pad, pad, ss - 1 - pad, ss - 1 - pad), radius=radius, fill=255)

    out = Image.new('RGBA', (ss, ss), (0, 0, 0, 0))
    out.paste(art, (0, 0), body_mask)

    # Lớp viền vàng đồng chuyển sắc nhẹ từ đỉnh sáng (#f6cf7a) sang chân trầm (#8f561e)
    y_grad = np.linspace(0.0, 1.0, ss, dtype=np.float32)[:, None]
    top_col = np.array([246, 207, 122], dtype=np.float32)
    bot_col = np.array([143, 86, 30], dtype=np.float32)
    grad_rgb = np.clip(top_col * (1.0 - y_grad) + bot_col * y_grad, 0, 255).astype(np.uint8)
    grad_rgb_2d = np.broadcast_to(grad_rgb[:, None, :], (ss, ss, 3)).copy()

    rim_outer = Image.new('L', (ss, ss), 0)
    ImageDraw.Draw(rim_outer).rounded_rectangle(
        (pad, pad, ss - 1 - pad, ss - 1 - pad), radius=radius, fill=255
    )
    rim_inner = Image.new('L', (ss, ss), 0)
    in_pad = pad + border_w
    in_rad = max(4, radius - border_w)
    ImageDraw.Draw(rim_inner).rounded_rectangle(
        (in_pad, in_pad, ss - 1 - in_pad, ss - 1 - in_pad), radius=in_rad, fill=255
    )
    rim_alpha = np.clip(
        np.asarray(rim_outer, dtype=np.int16) - np.asarray(rim_inner, dtype=np.int16), 0, 255
    ).astype(np.uint8)

    rim_rgba = np.dstack([grad_rgb_2d, rim_alpha])
    rim_img = Image.fromarray(rim_rgba, mode='RGBA')
    out = Image.alpha_composite(out, rim_img)

    res = out.resize((size, size), Image.Resampling.LANCZOS)
    if size <= 192:
        res = res.filter(ImageFilter.UnsharpMask(radius=0.8, percent=90, threshold=2))
    return res


def make_maskable_icon(master_rgb: Image.Image, size: int) -> Image.Image:
    """
    Tạo biểu tượng `purpose: maskable` tràn viền 100% (không alpha), thu nhẹ chủ thể vào vòng
    an toàn 80% ở tâm trên nền mở rộng đối xứng liền mạch để Android cắt tròn/giọt nước không mất chóp mái.
    """
    inner_size = int(round(size * 0.88))
    pad_tl = (size - inner_size) // 2
    pad_br = size - inner_size - pad_tl

    fg = master_rgb.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
    fg_arr = np.asarray(fg, dtype=np.uint8)
    padded_arr = np.pad(
        fg_arr,
        ((pad_tl, pad_br), (pad_tl, pad_br), (0, 0)),
        mode='reflect',
    )
    bg = Image.fromarray(padded_arr, mode='RGB').filter(
        ImageFilter.GaussianBlur(radius=max(4, size // 48))
    )

    # Hoà biên mềm quanh khung trong để không lộ đường chuyển tiếp
    feather = max(8, int(round(inner_size * 0.08)))
    alpha = np.ones((inner_size, inner_size), dtype=np.float32)
    ramp = np.linspace(0.0, 1.0, feather, dtype=np.float32)
    alpha[:feather, :] *= ramp[:, None]
    alpha[-feather:, :] *= ramp[::-1, None]
    alpha[:, :feather] *= ramp[None, :]
    alpha[:, -feather:] *= ramp[None, ::-1]
    mask = Image.fromarray(np.clip(alpha * 255.0, 0, 255).astype(np.uint8), mode='L')

    canvas = bg.copy()
    canvas.paste(fg, (pad_tl, pad_tl), mask)
    if size <= 192:
        canvas = canvas.filter(ImageFilter.UnsharpMask(radius=0.8, percent=85, threshold=2))
    return canvas.convert('RGB')


def make_favicon_crop(master_rgb: Image.Image) -> Image.Image:
    """Crop cận cảnh cú tuyết cầm thư + mái nhà Hang Sóc để sắc nét ở cỡ nhỏ 16px-48px."""
    w, h = master_rgb.size
    margin = int(round(w * 0.10))
    cropped = master_rgb.crop((margin, margin, w - margin, h - margin))
    return ImageEnhance.Contrast(ImageEnhance.Color(cropped).enhance(1.12)).enhance(1.08)


def crop_fill(im: Image.Image, target_w: int, target_h: int, anchor_y: float = 0.5) -> Image.Image:
    src_w, src_h = im.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h
    if src_ratio > target_ratio:
        new_w = int(round(src_h * target_ratio))
        left = (src_w - new_w) // 2
        box = (left, 0, left + new_w, src_h)
    else:
        new_h = int(round(src_w / target_ratio))
        top = int(round((src_h - new_h) * anchor_y))
        top = max(0, min(src_h - new_h, top))
        box = (0, top, src_w, top + new_h)
    return im.crop(box).resize((target_w, target_h), Image.Resampling.LANCZOS)


def style_og_banner(wide_im: Image.Image) -> Image.Image:
    """Tạo ảnh Open Graph 1200x630 với viền chỉ vàng tinh tế chuẩn thiệp mời phép thuật."""
    banner = crop_fill(wide_im, 1200, 630, anchor_y=0.46).convert('RGBA')
    banner = ImageEnhance.Color(banner).enhance(1.04)

    overlay = Image.new('RGBA', (1200, 630), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    # Viền khung mảnh đôi vàng kim cổ điển
    draw.rounded_rectangle(
        (14, 14, 1200 - 15, 630 - 15),
        radius=16,
        outline=(244, 203, 120, 185),
        width=2,
    )
    draw.rounded_rectangle(
        (20, 20, 1200 - 21, 630 - 21),
        radius=12,
        outline=(79, 40, 19, 140),
        width=1,
    )
    merged = Image.alpha_composite(banner, overlay).convert('RGB')
    return merged.filter(ImageFilter.UnsharpMask(radius=0.8, percent=65, threshold=3))


def save_png_optimized(im: Image.Image, out_path: Path, quantize_colors: int | None = 256) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if quantize_colors and im.mode == 'RGB':
        q = im.quantize(
            colors=quantize_colors,
            method=Image.Quantize.MEDIANCUT,
            kmeans=4,
            dither=Image.Dither.FLOYDSTEINBERG,
        )
        q.save(out_path, format='PNG', optimize=True, compress_level=9)
        return
    im.save(out_path, format='PNG', optimize=True, compress_level=9)


def save_jpg_optimized(im: Image.Image, out_path: Path, quality: int = 84) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    im.convert('RGB').save(
        out_path,
        format='JPEG',
        quality=quality,
        optimize=True,
        progressive=True,
    )


def main() -> None:
    if len(sys.argv) < 4:
        print(
            'Usage: python3 tools/build-webapp-assets.py <icon_master> <wide_master> <narrow_master>',
            file=sys.stderr,
        )
        sys.exit(1)

    icon_master_path = Path(sys.argv[1]).resolve()
    wide_master_path = Path(sys.argv[2]).resolve()
    narrow_master_path = Path(sys.argv[3]).resolve()

    icon_master = Image.open(icon_master_path).convert('RGB')
    wide_master = Image.open(wide_master_path).convert('RGB')
    narrow_master = Image.open(narrow_master_path).convert('RGB')

    ICONS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Biểu tượng chuẩn `any` (có bo góc & viền vàng ấm)
    icon_512 = make_badged_any_icon(icon_master, 512)
    icon_192 = make_badged_any_icon(icon_master, 192)
    save_png_optimized(icon_512, ICONS_DIR / 'icon-512.png', quantize_colors=None)
    save_png_optimized(icon_192, ICONS_DIR / 'icon-192.png', quantize_colors=None)

    # 2. Biểu tượng `maskable` tràn viền chuẩn safe-zone 80%
    maskable_512 = make_maskable_icon(icon_master, 512)
    maskable_192 = make_maskable_icon(icon_master, 192)
    save_png_optimized(maskable_512, ICONS_DIR / 'icon-maskable-512.png', quantize_colors=256)
    save_png_optimized(maskable_192, ICONS_DIR / 'icon-maskable-192.png', quantize_colors=256)

    # 3. Apple Touch Icon 180x180 (tràn viền RGB không alpha cho iOS Safari)
    apple_180 = icon_master.resize((180, 180), Image.Resampling.LANCZOS)
    apple_180 = apple_180.filter(ImageFilter.UnsharpMask(radius=0.7, percent=80, threshold=2))
    save_png_optimized(apple_180, ICONS_DIR / 'apple-touch-icon.png', quantize_colors=256)

    # 4. Favicon 32x32 PNG & multi-size favicon.ico (16, 32, 48)
    fav_src = make_favicon_crop(icon_master)
    fav_48 = make_badged_any_icon(fav_src, 48).filter(
        ImageFilter.UnsharpMask(radius=0.6, percent=110, threshold=2)
    )
    fav_32 = make_badged_any_icon(fav_src, 32).filter(
        ImageFilter.UnsharpMask(radius=0.5, percent=120, threshold=2)
    )
    save_png_optimized(fav_32, ICONS_DIR / 'favicon-32.png', quantize_colors=None)
    fav_48.save(
        FAVICON_ICO_PATH,
        format='ICO',
        sizes=[(16, 16), (32, 32), (48, 48)],
    )

    # 5. Open Graph Banner (1200x630) & PWA Rich Install Screenshots (1280x720 wide, 720x1280 narrow)
    og_banner = style_og_banner(wide_master)
    save_jpg_optimized(og_banner, ICONS_DIR / 'og-banner.jpg', quality=84)

    wide_shot = crop_fill(wide_master, 1280, 720, anchor_y=0.5).filter(
        ImageFilter.UnsharpMask(radius=0.7, percent=60, threshold=3)
    )
    save_jpg_optimized(wide_shot, ICONS_DIR / 'screenshot-wide.jpg', quality=83)

    narrow_shot = crop_fill(narrow_master, 720, 1280, anchor_y=0.5).filter(
        ImageFilter.UnsharpMask(radius=0.7, percent=60, threshold=3)
    )
    save_jpg_optimized(narrow_shot, ICONS_DIR / 'screenshot-narrow.jpg', quality=83)

    # Nén PNG RGBA 8-bit sạch cho icon-512/192/favicon-32 từ compress-images.py
    from importlib.util import module_from_spec, spec_from_file_location

    comp_spec = spec_from_file_location('compress_images', ROOT / 'tools' / 'compress-images.py')
    if comp_spec and comp_spec.loader:
        comp_mod = module_from_spec(comp_spec)
        comp_spec.loader.exec_module(comp_mod)
        for png_name in ('icon-512.png', 'icon-192.png', 'favicon-32.png'):
            comp_mod.compress_png(ICONS_DIR / png_name)

    generated = [
        FAVICON_ICO_PATH,
        ICONS_DIR / 'favicon-32.png',
        ICONS_DIR / 'apple-touch-icon.png',
        ICONS_DIR / 'icon-192.png',
        ICONS_DIR / 'icon-512.png',
        ICONS_DIR / 'icon-maskable-192.png',
        ICONS_DIR / 'icon-maskable-512.png',
        ICONS_DIR / 'og-banner.jpg',
        ICONS_DIR / 'screenshot-wide.jpg',
        ICONS_DIR / 'screenshot-narrow.jpg',
    ]
    print('✓ Đã sinh trọn bộ ảnh WebApp:')
    for p in generated:
        with Image.open(p) as check_im:
            w, h = check_im.size
            mode = check_im.mode
        kb = p.stat().st_size / 1024.0
        print(f'  • {p.relative_to(ROOT)} ({w}x{h}, {mode}, {kb:.1f} kB)')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Sinh bộ tài nguyên đồ họa 1x/2x WebP + PNG dự phòng cho khung bong bóng Mạng Floo
độc quyền của username `kimchi` (Vàng Hổ Phách & Kẹo Vàng Đơn — `burrow-candy-amber`).

Đầu ra: public/paintings/floo-items/burrow-candy/
  - candy-charm-gold.webp (56x56), candy-charm-gold-2x.webp (112x112), candy-charm-gold.png (56x56)
  - corner-tl.webp (22x22), corner-tl-2x.webp (44x44), corner-tl.png (22x22)
"""

import math
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT_DIR, 'public', 'paintings', 'candy-hogwarts')
OUT_DIR = os.path.join(ROOT_DIR, 'public', 'paintings', 'floo-items', 'burrow-candy')


def trim_alpha(im: Image.Image) -> Image.Image:
  im = im.convert('RGBA')
  bbox = im.getbbox()
  return im.crop(bbox) if bbox else im


def fit_square(
  im: Image.Image,
  size: int,
  pad: int = 6,
  flip_x: bool = False,
  angle: float = 0.0,
) -> Image.Image:
  im = trim_alpha(im)
  if flip_x:
    im = im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
  if angle != 0.0:
    im = im.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    im = trim_alpha(im)
  target = size - pad * 2
  scale = min(target / im.width, target / im.height)
  nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
  resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
  canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))

  alpha = resized.split()[3]
  shadow = Image.new('RGBA', (nw, nh), (58, 26, 4, 130))
  shadow.putalpha(alpha.point(lambda a: int(a * 0.42)))
  shadow_canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
  ox, oy = (size - nw) // 2, (size - nh) // 2
  shadow_canvas.paste(shadow, (ox, min(size - nh, oy + max(1, size // 36))))
  shadow_canvas = shadow_canvas.filter(ImageFilter.GaussianBlur(radius=max(1.0, size / 42)))
  canvas = Image.alpha_composite(canvas, shadow_canvas)
  canvas.paste(resized, (ox, oy), resized)
  return canvas


def draw_sparkle(
  draw: ImageDraw.ImageDraw,
  cx: int,
  cy: int,
  r: int,
  fill=(255, 250, 210, 255),
  outline=(140, 74, 8, 220),
) -> None:
  pts = []
  for i in range(8):
    ang = i * math.pi / 4
    rad = r if i % 2 == 0 else r * 0.32
    pts.append((cx + math.cos(ang) * rad, cy + math.sin(ang) * rad))
  draw.polygon(pts, fill=fill, outline=outline)


def make_corner_master(swirl_candy: Image.Image) -> Image.Image:
  sz = 176
  im = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
  dr = ImageDraw.Draw(im)
  dr.rounded_rectangle(
    (10, 10, 148, 30), radius=10, fill=(255, 219, 98, 245), outline=(138, 72, 8, 255), width=5
  )
  dr.rounded_rectangle(
    (10, 10, 30, 148), radius=10, fill=(255, 219, 98, 245), outline=(138, 72, 8, 255), width=5
  )
  dr.line([(20, 18), (136, 18)], fill=(255, 248, 210, 230), width=4)
  dr.line([(18, 20), (18, 136)], fill=(255, 248, 210, 230), width=4)
  mini = fit_square(swirl_candy, 84, pad=2)
  im.alpha_composite(mini, (2, 2))
  draw_sparkle(dr, 106, 48, 14)
  return im


def save_pair(base_name: str, master_im: Image.Image, w2x: int, h2x: int, webp_q: int = 84) -> None:
  w1x, h1x = max(1, w2x // 2), max(1, h2x // 2)
  im2x = master_im.resize((w2x, h2x), Image.Resampling.LANCZOS)
  im1x = master_im.resize((w1x, h1x), Image.Resampling.LANCZOS)
  p2_webp = os.path.join(OUT_DIR, f'{base_name}-2x.webp')
  p1_webp = os.path.join(OUT_DIR, f'{base_name}.webp')
  p1_png = os.path.join(OUT_DIR, f'{base_name}.png')
  im2x.save(p2_webp, 'WEBP', quality=webp_q, method=6)
  im1x.save(p1_webp, 'WEBP', quality=webp_q, method=6)
  im1x.save(p1_png, 'PNG', optimize=True)
  print(
    f'{base_name}: 2x({w2x}x{h2x})={os.path.getsize(p2_webp)}B, '
    f'1x({w1x}x{h1x})={os.path.getsize(p1_webp)}B, png={os.path.getsize(p1_png)}B'
  )


def main() -> None:
  os.makedirs(OUT_DIR, exist_ok=True)
  gold_candy = Image.open(os.path.join(SRC_DIR, 'candy-5-wrapped.png'))
  swirl_candy = Image.open(os.path.join(SRC_DIR, 'candy-swirl.png'))

  charm_gold = fit_square(gold_candy, 224, pad=10, flip_x=True, angle=6)
  save_pair('candy-charm-gold', charm_gold, 112, 112, webp_q=80)

  corner_tl = make_corner_master(swirl_candy)
  save_pair('corner-tl', corner_tl, 44, 44, webp_q=86)


if __name__ == '__main__':
  main()

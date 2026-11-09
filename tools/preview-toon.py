#!/usr/bin/env python3
"""
Preview the engine's Sunlit Storybook toon treatment on a sprite, so an artist
can check how their art will look in-game BEFORE handing it off.

    python3 tools/preview-toon.py public/sprites/honeydukes.png out.png

This mirrors src/engine/toon.ts. If you change the grading or outline
constants there, update DEFAULT_TOON below to match — the engine is the
source of truth, this is only a preview aid.
"""

import math
import os
import sys
from PIL import Image, ImageChops

# Mirrors DEFAULT_TOON in src/engine/toon.ts
OUTLINE_COLOR = (74, 44, 22)   # #4a2c16 warm espresso ink
OUTLINE_WIDTH = 1
POSTERISE = 0.12
SATURATION = 1.10
BRIGHTNESS = 1.04
WARMTH = 0.14


def is_glossy_untooned(key: str) -> bool:
    return key.startswith("m3_") or key.startswith("ui_icon_")


def grade(img: Image.Image) -> Image.Image:
    px = img.load()
    ink_r, ink_g, ink_b = OUTLINE_COLOR
    bands = 6
    step = 255.0 / (bands - 1)

    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue

            # Chromatic Espresso Ink Softener: lift harsh pure-black ink toward #4a2c16
            lum0 = 0.2126 * r + 0.7152 * g + 0.0722 * b
            if lum0 < 62:
                ink_blend = ((62.0 - lum0) / 62.0) * 0.68
                r = r + (ink_r - r) * ink_blend
                g = g + (ink_g - g) * ink_blend
                b = b + (ink_b - b) * ink_blend

            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            r = lum + (r - lum) * SATURATION
            g = lum + (g - lum) * SATURATION
            b = lum + (b - lum) * SATURATION

            # Warm sunlit highlights, creamy midtones
            l2 = 0.2126 * r + 0.7152 * g + 0.0722 * b
            hi = max(0.0, (l2 - 135.0) / 120.0)
            lo = max(0.0, (85.0 - l2) / 85.0)
            r += hi * 24.0 * WARMTH + lo * 4.0 * WARMTH
            g += hi * 14.0 * WARMTH + lo * 1.5 * WARMTH
            b += hi * 2.0 * WARMTH - lo * 5.0 * WARMTH

            r *= BRIGHTNESS
            g *= BRIGHTNESS
            b *= BRIGHTNESS

            if POSTERISE > 0:
                # Gentle 6-band cel-paint smoothing
                l3 = 0.2126 * r + 0.7152 * g + 0.0722 * b
                q = round(l3 / step) * step
                safe = max(1.0, l3)
                r = r + (q * (r / safe) - r) * POSTERISE
                g = g + (q * (g / safe) - g) * POSTERISE
                b = b + (q * (b / safe) - b) * POSTERISE

            px[x, y] = (
                int(min(255, max(0, round(r)))),
                int(min(255, max(0, round(g)))),
                int(min(255, max(0, round(b)))),
                a,
            )
    return img


def build_outline(img: Image.Image, radius: int, color) -> Image.Image:
    """Dilate the alpha silhouette and tint it, mirroring buildOutline()."""
    alpha = img.getchannel("A")
    grown = alpha
    for d in range(1, radius + 1):
        layer = Image.new("L", img.size, 0)
        for angle in range(0, 360, 4):
            dx = int(round(math.cos(math.radians(angle)) * d))
            dy = int(round(math.sin(math.radians(angle)) * d))
            shifted = Image.new("L", img.size, 0)
            shifted.paste(alpha, (dx, dy))
            layer = ImageChops.lighter(layer, shifted)
        grown = ImageChops.lighter(grown, layer)

    solid = Image.new("RGBA", img.size, color + (0,))
    solid.putalpha(grown)
    return solid


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2

    src_path = sys.argv[1]
    out_path = sys.argv[2] if len(sys.argv) > 2 else "toon_preview.png"
    key = os.path.splitext(os.path.basename(src_path))[0]

    img = Image.open(src_path).convert("RGBA")
    if is_glossy_untooned(key):
        img.save(out_path)
        print(f"→ {out_path} ({img.width}×{img.height}, bypassed toon for {key})")
        return 0

    graded = grade(img.copy())
    if OUTLINE_WIDTH <= 0:
        graded.save(out_path)
        print(f"→ {out_path} ({graded.width}×{graded.height})")
        return 0

    outline = build_outline(graded, OUTLINE_WIDTH, OUTLINE_COLOR)
    out = Image.alpha_composite(outline, graded)
    out.save(out_path)
    print(f"→ {out_path} ({out.width}×{out.height})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""
tools/build-villager-spine.py
Builds multi-part Spine 2D skeleton assets from the existing artist villager sprites (read-only):
  - public/paintings/spine/villagers_atlas.webp (<= 150 KB RGBA WebP)
  - public/paintings/spine/villagers.atlas        (Spine/libGDX TextureAtlas)
  - public/paintings/spine/villagers.skel.json    (Spine 4.1-compatible skeleton, skins, & 4 animations)

Also writes a visual multi-pose inspection grid to:
  /Users/khang/.gemini/antigravity/brain/5e0a2950-f062-4ee1-bc26-9ce392e5bd26/scratch/spine_poses_preview.png
"""

from __future__ import annotations

import json
import math
import os
from collections import deque
from typing import Any

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPRITES_DIR = os.path.join(ROOT, "public", "sprites")
OUT_DIR = os.path.join(ROOT, "public", "paintings", "spine")
PREVIEW_PATH = (
    "/Users/khang/.gemini/antigravity/brain/5e0a2950-f062-4ee1-bc26-9ce392e5bd26/scratch/spine_poses_preview.png"
)

# Slot draw order (back-to-front)
SLOT_ORDER = [
    "back_accent",
    "leg_l",
    "arm_back",
    "prop_sub",
    "leg_r",
    "torso",
    "head",
    "arm_front",
    "prop_main",
]


def _poly_mask(H: int, W: int, pts: list[tuple[float, float]]) -> np.ndarray:
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).polygon(pts, fill=255)
    return np.array(im) > 127


def _ellipse_mask(H: int, W: int, x0: float, y0: float, x1: float, y1: float) -> np.ndarray:
    im = Image.new("L", (W, H), 0)
    ImageDraw.Draw(im).ellipse([x0, y0, x1, y1], fill=255)
    return np.array(im) > 127


def _rect_mask(H: int, W: int, x0: int, y0: int, x1: int, y1: int) -> np.ndarray:
    m = np.zeros((H, W), dtype=bool)
    m[max(0, y0):min(H, y1), max(0, x0):min(W, x1)] = True
    return m


def _dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    if radius <= 0:
        return mask
    im = Image.fromarray((mask.astype(np.uint8)) * 255, mode="L")
    im = im.filter(ImageFilter.MaxFilter(radius * 2 + 1))
    return np.array(im) > 127


def _keep_largest_component(mask: np.ndarray, min_keep_ratio: float = 0.0) -> np.ndarray:
    """Removes detached crumbs sliced across partition borders."""
    H, W = mask.shape
    visited = np.zeros((H, W), dtype=bool)
    comps: list[list[tuple[int, int]]] = []
    ys, xs = np.where(mask)
    if len(ys) == 0:
        return mask
    for sy, sx in zip(ys.tolist(), xs.tolist()):
        if visited[sy, sx]:
            continue
        q = deque([(sy, sx)])
        visited[sy, sx] = True
        comp: list[tuple[int, int]] = []
        while q:
            cy, cx = q.popleft()
            comp.append((cy, cx))
            for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                if 0 <= ny < H and 0 <= nx < W and mask[ny, nx] and not visited[ny, nx]:
                    visited[ny, nx] = True
                    q.append((ny, nx))
        comps.append(comp)
    comps.sort(key=len, reverse=True)
    out = np.zeros((H, W), dtype=bool)
    largest = len(comps[0])
    for idx, c in enumerate(comps):
        if idx == 0 or (min_keep_ratio > 0 and len(c) >= largest * min_keep_ratio and len(c) >= 45):
            for py, px in c:
                out[py, px] = True
    return out


def _add_rounded_cap(
    part_rgba: np.ndarray,
    cx: float,
    cy: float,
    rx: float,
    ry: float,
    sample_rgba: np.ndarray,
    fill_empty_only: bool = True,
) -> np.ndarray:
    """Extends a snug rounded joint cap underneath overlapping seams without jutting sideways."""
    H, W = part_rgba.shape[:2]
    out = part_rgba.copy()
    cap_mask = _ellipse_mask(H, W, cx - rx, cy - ry, cx + rx, cy + ry)
    empty = out[:, :, 3] < 24
    fill_mask = (cap_mask & empty) if fill_empty_only else cap_mask
    if not np.any(fill_mask):
        return out

    y_lo = max(0, int(cy - ry * 0.2))
    y_hi = min(H, int(cy + ry * 1.4))
    x_lo = max(0, int(cx - rx * 1.1))
    x_hi = min(W, int(cx + rx * 1.1))
    patch = sample_rgba[y_lo:y_hi, x_lo:x_hi]
    valid = patch[patch[:, :, 3] > 210]
    if len(valid) == 0:
        valid = sample_rgba[sample_rgba[:, :, 3] > 210]
    if len(valid) == 0:
        return out
    # Filter out very dark outline strokes so cap takes clean fabric tone
    lum = valid[:, 0].astype(np.float32) * 0.3 + valid[:, 1] * 0.59 + valid[:, 2] * 0.11
    non_outline = valid[lum > np.percentile(lum, 25)]
    if len(non_outline) > 0:
        valid = non_outline
    med_rgb = np.median(valid[:, :3], axis=0).astype(np.uint8)
    out[fill_mask, 0] = med_rgb[0]
    out[fill_mask, 1] = med_rgb[1]
    out[fill_mask, 2] = med_rgb[2]
    out[fill_mask, 3] = 248
    return out


def _inpaint_torso_clean(
    full_rgba: np.ndarray,
    torso_bounds_mask: np.ndarray,
    occluder_mask: np.ndarray,
) -> np.ndarray:
    """
    Crops torso cleanly to `torso_bounds_mask` (strictly inside body contour!) and reconstructs
    any occluded patches row-by-row from clean interior fabric pixels with gentle shading match.
    """
    H, W = full_rgba.shape[:2]
    out = np.zeros_like(full_rgba)

    hole = torso_bounds_mask & _dilate(occluder_mask, 2)
    clean = torso_bounds_mask & (~_dilate(occluder_mask, 3)) & (full_rgba[:, :, 3] > 80)

    # Filter out outer dark outline pixels of the sprite from being chosen as fill donors
    clean_interior = clean & (~_dilate(~torso_bounds_mask, 2))
    if np.sum(clean_interior) < 40:
        clean_interior = clean

    keep = torso_bounds_mask & (~hole) & (full_rgba[:, :, 3] > 5)
    out[keep] = full_rgba[keep]

    ys_hole, xs_hole = np.where(hole)
    ys_clean, xs_clean = np.where(clean_interior)
    if len(ys_hole) == 0 or len(ys_clean) == 0:
        return out

    # Prefer horizontal same-row fabric matching so pleated skirts/aprons/sweaters remain banded horizontally
    clean_coords = np.stack([ys_clean.astype(np.float32) * 3.0, xs_clean.astype(np.float32)], axis=1)
    hole_coords = np.stack([ys_hole.astype(np.float32) * 3.0, xs_hole.astype(np.float32)], axis=1)
    for start in range(0, len(hole_coords), 512):
        chunk = hole_coords[start:start + 512]
        diff = chunk[:, None, :] - clean_coords[None, :, :]
        dist2 = (diff[:, :, 0] ** 2) + (diff[:, :, 1] ** 2)
        nearest_idx = np.argmin(dist2, axis=1)
        hy = ys_hole[start:start + 512]
        hx = xs_hole[start:start + 512]
        out[hy, hx] = full_rgba[ys_clean[nearest_idx], xs_clean[nearest_idx]]
        out[hy, hx, 3] = 250

    return out


# Anatomical specs measured directly against villagers_grid.png
CHAR_SPECS: dict[str, dict[str, Any]] = {
    "molly": {
        "body_cx": 46.0,
        "bones": {
            "hip": (0.0, 48.0, 0.0),
            "leg_l": (12.0, -4.0, -90.0, 40.0),
            "leg_r": (-8.0, -4.0, -90.0, 40.0),
            "torso": (0.0, 2.0, 90.0, 76.0),
            "back_accent": (36.0, 22.0, 82.0, 28.0),
            "head": (78.0, 3.0, 0.0, 56.0),
            "arm_back": (58.0, -34.0, -165.0, 24.0),
            "prop_sub": (20.0, 0.0, 0.0, 14.0),
            "arm_front": (58.0, 20.0, -155.0, 32.0),
            "prop_main": (12.0, -44.0, -115.0, 28.0),
        },
        "prop_stabilize": 0.72,
        "greet_scale": 0.25,  # Keep held tray away from face during greet cheer
        "emissive_main": 0.0,
    },
    "arthur": {
        "body_cx": 43.0,
        "bones": {
            "hip": (0.0, 54.0, 0.0),
            "leg_l": (12.0, -2.0, -90.0, 48.0),
            "leg_r": (-10.0, -2.0, -90.0, 48.0),
            "torso": (0.0, 2.0, 90.0, 70.0),
            "back_accent": (36.0, 18.0, 86.0, 20.0),
            "head": (70.0, 1.0, 0.0, 56.0),
            "arm_back": (52.0, -16.0, -172.0, 30.0),
            "prop_sub": (24.0, -14.0, 82.0, 18.0),
            "arm_front": (52.0, 18.0, -152.0, 32.0),
            "prop_main": (28.0, 8.0, 62.0, 22.0),
        },
        "prop_stabilize": 0.50,
        "greet_scale": 0.45,
        "emissive_main": 0.0,
    },
    "ginny": {
        "body_cx": 50.0,
        "bones": {
            "hip": (0.0, 50.0, 0.0),
            "leg_l": (10.0, -4.0, -90.0, 44.0),
            "leg_r": (-10.0, -4.0, -90.0, 44.0),
            "torso": (0.0, 2.0, 90.0, 74.0),
            "back_accent": (46.0, 22.0, 165.0, 52.0),
            "head": (74.0, 2.0, 0.0, 54.0),
            "arm_back": (54.0, -18.0, -170.0, 24.0),
            "prop_sub": (18.0, 0.0, 0.0, 12.0),
            "arm_front": (56.0, 14.0, -145.0, 32.0),
            "prop_main": (20.0, -18.0, -55.0, 34.0),
        },
        "prop_stabilize": 0.65,
        "greet_scale": 0.28,  # Keep sunflower bouquet below chin during greet
        "emissive_main": 0.0,
    },
    "ron": {
        "body_cx": 62.0,
        "bones": {
            "hip": (0.0, 54.0, 0.0),
            "leg_l": (10.0, -2.0, -90.0, 48.0),
            "leg_r": (-12.0, -2.0, -90.0, 48.0),
            "torso": (0.0, 2.0, 90.0, 70.0),
            "back_accent": (42.0, 12.0, 90.0, 16.0),
            "head": (70.0, 2.0, 0.0, 56.0),
            "arm_back": (54.0, -18.0, -180.0, 36.0),
            "prop_sub": (26.0, 0.0, 0.0, 14.0),
            "arm_front": (54.0, 18.0, -175.0, 34.0),
            "prop_main": (28.0, 6.0, 0.0, 32.0),
        },
        "prop_stabilize": 0.30,
        "greet_scale": 0.55,
        "emissive_main": 0.0,
    },
    "hermione": {
        "body_cx": 52.0,
        "bones": {
            "hip": (0.0, 52.0, 0.0),
            "leg_l": (10.0, -2.0, -90.0, 46.0),
            "leg_r": (-11.0, -2.0, -90.0, 46.0),
            "torso": (0.0, 2.0, 90.0, 72.0),
            "back_accent": (54.0, 16.0, 125.0, 34.0),
            "head": (72.0, 2.0, 0.0, 54.0),
            "arm_back": (46.0, -30.0, -180.0, 26.0),
            "prop_sub": (24.0, -2.0, 0.0, 22.0),
            "arm_front": (52.0, 18.0, -148.0, 32.0),
            "prop_main": (12.0, -26.0, -110.0, 26.0),
        },
        "prop_stabilize": 0.65,
        "greet_scale": 0.35,
        "emissive_main": 0.0,
    },
    "hagrid": {
        "body_cx": 84.0,
        "bones": {
            "hip": (0.0, 50.0, 0.0),
            "leg_l": (16.0, -2.0, -90.0, 44.0),
            "leg_r": (-18.0, -2.0, -90.0, 44.0),
            "torso": (0.0, 2.0, 90.0, 74.0),
            "back_accent": (36.0, 28.0, 155.0, 40.0),
            "head": (74.0, 0.0, 0.0, 62.0),
            "arm_back": (52.0, -34.0, -172.0, 36.0),
            "prop_sub": (26.0, 10.0, -55.0, 28.0),
            "arm_front": (58.0, 38.0, -162.0, 34.0),
            "prop_main": (16.0, 22.0, -18.0, 42.0),
        },
        "prop_stabilize": 0.25,
        "greet_scale": 0.35,
        "emissive_main": 0.95,
    },
}


def _clean_leg_pair(
    idle: np.ndarray,
    leg_l_m: np.ndarray,
    leg_r_m: np.ndarray,
    cap_rx_scale: float = 0.36,
) -> tuple[np.ndarray, np.ndarray]:
    H, W = idle.shape[:2]
    clean_l = _keep_largest_component(leg_l_m)
    clean_r = _keep_largest_component(leg_r_m)

    def make_leg(mask: np.ndarray, darken: float) -> np.ndarray:
        raw = np.where(mask[:, :, None], idle, 0)
        ys, xs = np.where(mask)
        if len(xs):
            top_y = int(ys.min())
            top_xs = xs[ys <= top_y + 8]
            cx = float(top_xs.mean()) if len(top_xs) else float(xs.mean())
            span = max(8.0, float(top_xs.max() - top_xs.min()) if len(top_xs) else 16.0)
            rx = max(5.0, span * cap_rx_scale)
            raw = _add_rounded_cap(raw, cx, top_y + 2, rx, 9.0, idle, fill_empty_only=True)
        if darken < 0.99:
            arr = raw.astype(np.float32)
            arr[:, :, :3] *= darken
            return arr.astype(np.uint8)
        return raw

    return make_leg(clean_l, 0.88), make_leg(clean_r, 1.0)


def segment_character_parts(char_id: str) -> tuple[dict[str, np.ndarray], tuple[int, int]]:
    """Segments a villager sprite into clean overlapping RGBA body/prop layers with zero strays."""
    idle_im = Image.open(os.path.join(SPRITES_DIR, f"villager_{char_id}_idle.webp")).convert("RGBA")
    idle = np.array(idle_im)
    H, W = idle.shape[:2]
    opaque = idle[:, :, 3] > 10

    parts: dict[str, np.ndarray] = {}

    if char_id == "molly":
        head_m = opaque & _rect_mask(H, W, 0, 0, W, 67)
        prop_main_m = opaque & _poly_mask(H, W, [(51, 74), (99, 74), (100, 114), (49, 114)])
        arm_front_m = opaque & _poly_mask(H, W, [(10, 68), (44, 68), (54, 96), (52, 114), (10, 110)])
        arm_back_m = opaque & _poly_mask(H, W, [(76, 68), (94, 68), (94, 92), (76, 92)])
        # Torso strictly clipped inside apron/skirt width [12..82] so protruding pie tray isn't smeared
        torso_bounds = opaque & _poly_mask(H, W, [(12, 56), (78, 56), (82, 154), (6, 154)])
        occl = arm_front_m | prop_main_m | arm_back_m

        leg_sep_x = 49
        leg_y = 152
        leg_l_m = opaque & _rect_mask(H, W, leg_sep_x, leg_y, W, H) & (~occl)
        leg_r_m = opaque & _rect_mask(H, W, 0, leg_y, leg_sep_x, H) & (~occl)

        # Flutter apron bow from walk pose
        walk_arr = np.array(Image.open(os.path.join(SPRITES_DIR, "villager_molly_walk.webp")).convert("RGBA"))
        wh, ww = walk_arr.shape[:2]
        sash_mask = _keep_largest_component(
            (walk_arr[:, :, 3] > 12) & _poly_mask(wh, ww, [(0, 88), (28, 88), (28, 125), (0, 125)])
        )
        back_canvas = np.zeros((H, W, 4), dtype=np.uint8)
        sx0, sy0, sx1, sy1 = 3, 88, 28, 125
        dst_x0, dst_y0 = 4, 88
        for yy in range(sy1 - sy0):
            for xx in range(sx1 - sx0):
                if sash_mask[sy0 + yy, sx0 + xx]:
                    back_canvas[dst_y0 + yy, dst_x0 + xx] = walk_arr[sy0 + yy, sx0 + xx]

        parts["back_accent"] = back_canvas
        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 26, 76, 10, 9, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    elif char_id == "arthur":
        head_m = opaque & _rect_mask(H, W, 0, 0, W, 67)
        prop_sub_m = opaque & _poly_mask(H, W, [(82, 68), (108, 68), (108, 102), (82, 102)])
        arm_back_m = opaque & _poly_mask(H, W, [(61, 70), (86, 70), (85, 105), (61, 105)])
        prop_main_m = opaque & _poly_mask(H, W, [(35, 76), (52, 76), (52, 112), (35, 112)])
        arm_front_m = opaque & _poly_mask(H, W, [(4, 72), (38, 72), (46, 98), (44, 122), (4, 116)])
        torso_bounds = opaque & _poly_mask(H, W, [(19, 58), (54, 58), (62, 92), (62, 138), (20, 138)])
        occl = arm_front_m | prop_main_m | arm_back_m | prop_sub_m

        leg_sep_x = 44
        leg_y = 136
        leg_l_m = opaque & _rect_mask(H, W, leg_sep_x, leg_y, W, H) & (~occl)
        leg_r_m = opaque & _rect_mask(H, W, 0, leg_y, leg_sep_x, H) & (~occl)

        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 24, 80, 9, 8, idle)
        parts["arm_back"] = _add_rounded_cap(np.where(arm_back_m[:, :, None], idle, 0), 60, 78, 9, 8, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["prop_sub"] = np.where(prop_sub_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    elif char_id == "ginny":
        head_m = opaque & _rect_mask(H, W, 0, 0, W, 65) & (~_rect_mask(H, W, 70, 40, W, 65))
        back_accent_m = opaque & _poly_mask(H, W, [(3, 46), (32, 54), (32, 128), (3, 128)])
        prop_main_m = opaque & _poly_mask(H, W, [(66, 41), (114, 41), (114, 112), (65, 112)])
        arm_front_m = opaque & _poly_mask(H, W, [(28, 66), (68, 66), (70, 110), (28, 110)])
        torso_bounds = opaque & _poly_mask(H, W, [(29, 55), (72, 55), (77, 143), (26, 143)])
        occl = arm_front_m | prop_main_m | back_accent_m

        # Diagonal split between right boot (viewer-left) & left boot (viewer-right) avoids slicing boot toe tip
        leg_r_m = opaque & _poly_mask(H, W, [(0, 142), (51, 142), (55, H), (0, H)]) & (~occl)
        leg_l_m = opaque & _poly_mask(H, W, [(51, 142), (W, 142), (W, H), (55, H)]) & (~occl)

        parts["back_accent"] = _add_rounded_cap(np.where(back_accent_m[:, :, None], idle, 0), 26, 62, 8, 8, idle)
        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 38, 74, 8, 8, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    elif char_id == "ron":
        head_m = opaque & _rect_mask(H, W, 0, 0, W, 66)
        prop_main_m = opaque & _poly_mask(H, W, [(8, 102), (50, 102), (50, 158), (8, 158)])
        arm_front_m = opaque & _poly_mask(H, W, [(26, 68), (50, 68), (50, 112), (26, 112)])
        arm_back_m = opaque & _poly_mask(H, W, [(74, 68), (96, 68), (96, 118), (74, 118)])
        torso_bounds = opaque & _poly_mask(H, W, [(38, 56), (82, 56), (83, 136), (37, 136)])
        occl = arm_front_m | arm_back_m | prop_main_m

        leg_sep_x = 61
        leg_y = 136
        leg_l_m = opaque & _rect_mask(H, W, leg_sep_x, leg_y, W, H) & (~occl)
        leg_r_m = opaque & _rect_mask(H, W, 0, leg_y, leg_sep_x, H) & (~occl)

        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 42, 74, 8, 8, idle)
        parts["arm_back"] = _add_rounded_cap(np.where(arm_back_m[:, :, None], idle, 0), 78, 74, 8, 8, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    elif char_id == "hermione":
        head_m = opaque & _rect_mask(H, W, 0, 0, W, 63)
        walk_arr = np.array(Image.open(os.path.join(SPRITES_DIR, "villager_hermione_walk.webp")).convert("RGBA"))
        wh, ww = walk_arr.shape[:2]
        scarf_m = _keep_largest_component(
            (walk_arr[:, :, 3] > 12) & _poly_mask(wh, ww, [(4, 72), (38, 72), (38, 104), (4, 104)])
        )
        back_canvas = np.zeros((H, W, 4), dtype=np.uint8)
        sx0, sy0, sx1, sy1 = 4, 72, 38, 104
        dst_x0, dst_y0 = 4, 74
        for yy in range(sy1 - sy0):
            for xx in range(sx1 - sx0):
                if scarf_m[sy0 + yy, sx0 + xx]:
                    back_canvas[dst_y0 + yy, dst_x0 + xx] = walk_arr[sy0 + yy, sx0 + xx]

        prop_sub_m = opaque & _poly_mask(H, W, [(78, 96), (102, 96), (102, 136), (78, 136)])
        prop_main_m = opaque & _poly_mask(H, W, [(54, 70), (94, 70), (94, 114), (54, 114)])
        arm_front_m = opaque & _poly_mask(H, W, [(22, 70), (62, 70), (62, 114), (22, 114)])
        torso_bounds = opaque & _poly_mask(H, W, [(22, 55), (78, 55), (78, 136), (22, 136)])
        occl = arm_front_m | prop_main_m | prop_sub_m

        leg_r_m = opaque & _poly_mask(H, W, [(0, 135), (51, 135), (56, H), (0, H)]) & (~occl)
        leg_l_m = opaque & _poly_mask(H, W, [(51, 135), (W, 135), (W, H), (56, H)]) & (~occl)

        parts["back_accent"] = _add_rounded_cap(back_canvas, 33, 80, 6, 6, back_canvas)
        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 34, 76, 8, 8, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["prop_sub"] = np.where(prop_sub_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    elif char_id == "hagrid":
        head_m = opaque & (_rect_mask(H, W, 40, 0, 130, 68) | _poly_mask(H, W, [(52, 66), (118, 66), (108, 84), (62, 84)]))
        prop_main_m = opaque & _poly_mask(H, W, [(0, 78), (38, 78), (38, 138), (0, 138)])
        arm_front_m = opaque & _poly_mask(H, W, [(10, 66), (52, 66), (52, 102), (10, 102)])
        # Start cradling arm+pumpkin at x=88 so zero orange edge enters torso clean donors, while coat hem stays intact!
        arm_back_m = opaque & _poly_mask(H, W, [(114, 68), (151, 68), (151, 134), (91, 134), (91, 86), (114, 86)])
        torso_bounds = opaque & _poly_mask(H, W, [(44, 58), (114, 58), (93, 86), (93, 134), (122, 135), (122, 148), (42, 148)])
        occl = arm_front_m | prop_main_m | arm_back_m

        leg_sep_x = 83
        leg_y = 146
        leg_l_m = opaque & _rect_mask(H, W, leg_sep_x, leg_y, W, H) & (~occl)
        leg_r_m = opaque & _rect_mask(H, W, 38, leg_y, leg_sep_x, H) & (~occl)

        parts["head"] = np.where(head_m[:, :, None], idle, 0)
        parts["arm_front"] = _add_rounded_cap(np.where(arm_front_m[:, :, None], idle, 0), 46, 78, 10, 9, idle)
        parts["arm_back"] = _add_rounded_cap(np.where(arm_back_m[:, :, None], idle, 0), 118, 84, 10, 10, idle)
        parts["prop_main"] = np.where(prop_main_m[:, :, None], idle, 0)
        parts["torso"] = _inpaint_torso_clean(idle, torso_bounds, occl)

    else:
        raise ValueError(f"Unknown villager: {char_id}")

    # Common subtle neck cap behind head so head tilts never show throat gap
    parts["torso"] = _add_rounded_cap(parts["torso"], CHAR_SPECS[char_id]["body_cx"], 61, 12, 10, idle)

    leg_l_rgba, leg_r_rgba = _clean_leg_pair(idle, leg_l_m, leg_r_m)
    parts["leg_l"] = leg_l_rgba
    parts["leg_r"] = leg_r_rgba

    return parts, (W, H)


def bone_world_matrix(
    x: float,
    y: float,
    rot_deg: float,
    sx: float,
    sy: float,
    parent: tuple[float, float, float, float, float, float],
) -> tuple[float, float, float, float, float, float]:
    """2D affine matrix (a, b, c, d, wx, wy) matching Spine coordinate convention."""
    pa, pb, pc, pd, px, py = parent
    r = math.radians(rot_deg)
    c_r = math.cos(r)
    s_r = math.sin(r)
    la = c_r * sx
    lb = -s_r * sy
    lc = s_r * sx
    ld = c_r * sy
    wx = pa * x + pb * y + px
    wy = pc * x + pd * y + py
    return (
        pa * la + pb * lc,
        pa * lb + pb * ld,
        pc * la + pd * lc,
        pc * lb + pd * ld,
        wx,
        wy,
    )


def compute_setup_worlds(bones_cfg: dict[str, tuple[float, ...]]) -> dict[str, tuple[float, float, float, float, float, float]]:
    ident = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
    worlds: dict[str, tuple[float, float, float, float, float, float]] = {"root": ident}
    hierarchy = [
        ("hip", "root"),
        ("leg_l", "hip"),
        ("leg_r", "hip"),
        ("torso", "hip"),
        ("back_accent", "torso"),
        ("head", "torso"),
        ("arm_back", "torso"),
        ("prop_sub", "arm_back"),
        ("arm_front", "torso"),
        ("prop_main", "arm_front"),
    ]
    for bname, pname in hierarchy:
        cfg = bones_cfg[bname]
        worlds[bname] = bone_world_matrix(cfg[0], cfg[1], cfg[2], 1.0, 1.0, worlds[pname])
    return worlds


def invert_to_bone_local(
    m_world: tuple[float, float, float, float, float, float],
    cx_w: float,
    cy_w: float,
) -> tuple[float, float, float]:
    wa, wb, wc, wd, wx, wy = m_world
    det = wa * wd - wb * wc
    if abs(det) < 1e-8:
        det = 1e-8
    inv_a = wd / det
    inv_b = -wb / det
    inv_c = -wc / det
    inv_d = wa / det
    dx = cx_w - wx
    dy = cy_w - wy
    lx = inv_a * dx + inv_b * dy
    ly = inv_c * dx + inv_d * dy
    rot_deg = math.degrees(math.atan2(inv_c, inv_a))
    return round(lx, 3), round(ly, 3), round(rot_deg, 3)


def build_animations() -> dict[str, Any]:
    """Shared 4 balanced multi-bone animations (safe face clearance + cozy spring hops)."""
    return {
        "idle": {
            "bones": {
                "hip": {
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.0},
                        {"time": 0.6, "x": 0.5, "y": 0.9},
                        {"time": 1.2, "x": 0.0, "y": 0.0},
                        {"time": 1.8, "x": -0.5, "y": 0.8},
                        {"time": 2.4, "x": 0.0, "y": 0.0},
                    ]
                },
                "torso": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.8, "value": 1.2},
                        {"time": 1.6, "value": -1.0},
                        {"time": 2.4, "value": 0.0},
                    ],
                    "scale": [
                        {"time": 0.0, "x": 1.0, "y": 1.0},
                        {"time": 1.2, "x": 1.020, "y": 0.992},
                        {"time": 2.4, "x": 1.0, "y": 1.0},
                    ],
                },
                "head": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.7, "value": -2.0},
                        {"time": 1.6, "value": 1.6},
                        {"time": 2.4, "value": 0.0},
                    ]
                },
                "back_accent": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.6, "value": 5.0},
                        {"time": 1.2, "value": -2.5},
                        {"time": 1.8, "value": 4.0},
                        {"time": 2.4, "value": 0.0},
                    ]
                },
                "arm_front": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 1.2, "value": -2.2},
                        {"time": 2.4, "value": 0.0},
                    ]
                },
                "arm_back": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 1.2, "value": 2.4},
                        {"time": 2.4, "value": 0.0},
                    ]
                },
                "prop_main": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.8, "value": 2.0},
                        {"time": 1.6, "value": -2.0},
                        {"time": 2.4, "value": 0.0},
                    ]
                },
            }
        },
        "walk": {
            "bones": {
                "hip": {
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.0},
                        {"time": 0.25, "x": 0.0, "y": 3.2},
                        {"time": 0.5, "x": 0.0, "y": 0.0},
                        {"time": 0.75, "x": 0.0, "y": 3.2},
                        {"time": 1.0, "x": 0.0, "y": 0.0},
                    ]
                },
                "torso": {
                    "rotate": [
                        {"time": 0.0, "value": -1.8},
                        {"time": 0.25, "value": -3.4},
                        {"time": 0.5, "value": -1.8},
                        {"time": 0.75, "value": -3.4},
                        {"time": 1.0, "value": -1.8},
                    ],
                    "scale": [
                        {"time": 0.0, "x": 1.0, "y": 1.0},
                        {"time": 0.25, "x": 1.02, "y": 0.988},
                        {"time": 0.5, "x": 0.994, "y": 1.008},
                        {"time": 0.75, "x": 1.02, "y": 0.988},
                        {"time": 1.0, "x": 1.0, "y": 1.0},
                    ],
                },
                "leg_l": {
                    "rotate": [
                        {"time": 0.0, "value": 20.0},
                        {"time": 0.25, "value": 0.0},
                        {"time": 0.5, "value": -20.0},
                        {"time": 0.75, "value": 0.0},
                        {"time": 1.0, "value": 20.0},
                    ],
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.4},
                        {"time": 0.25, "x": 0.0, "y": 3.8},
                        {"time": 0.5, "x": 0.0, "y": 0.4},
                        {"time": 0.75, "x": 0.0, "y": -0.4},
                        {"time": 1.0, "x": 0.0, "y": 0.4},
                    ],
                },
                "leg_r": {
                    "rotate": [
                        {"time": 0.0, "value": -20.0},
                        {"time": 0.25, "value": 0.0},
                        {"time": 0.5, "value": 20.0},
                        {"time": 0.75, "value": 0.0},
                        {"time": 1.0, "value": -20.0},
                    ],
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.4},
                        {"time": 0.25, "x": 0.0, "y": -0.4},
                        {"time": 0.5, "x": 0.0, "y": 0.4},
                        {"time": 0.75, "x": 0.0, "y": 3.8},
                        {"time": 1.0, "x": 0.0, "y": 0.4},
                    ],
                },
                "arm_back": {
                    "rotate": [
                        {"time": 0.0, "value": -12.0},
                        {"time": 0.5, "value": 12.0},
                        {"time": 1.0, "value": -12.0},
                    ]
                },
                "arm_front": {
                    "rotate": [
                        {"time": 0.0, "value": 5.5},
                        {"time": 0.5, "value": -6.5},
                        {"time": 1.0, "value": 5.5},
                    ]
                },
                "prop_main": {
                    "rotate": [
                        {"time": 0.0, "value": -5.0},
                        {"time": 0.25, "value": 5.5},
                        {"time": 0.5, "value": 5.0},
                        {"time": 0.75, "value": -5.5},
                        {"time": 1.0, "value": -5.0},
                    ],
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": -0.9},
                        {"time": 0.25, "x": 0.0, "y": 1.1},
                        {"time": 0.5, "x": 0.0, "y": -0.9},
                        {"time": 0.75, "x": 0.0, "y": 1.1},
                        {"time": 1.0, "x": 0.0, "y": -0.9},
                    ],
                },
                "head": {
                    "rotate": [
                        {"time": 0.0, "value": 1.8},
                        {"time": 0.25, "value": 3.6},
                        {"time": 0.5, "value": 1.8},
                        {"time": 0.75, "value": 3.6},
                        {"time": 1.0, "value": 1.8},
                    ]
                },
                "back_accent": {
                    "rotate": [
                        {"time": 0.0, "value": 7.0},
                        {"time": 0.25, "value": 16.0},
                        {"time": 0.5, "value": 9.0},
                        {"time": 0.75, "value": 15.0},
                        {"time": 1.0, "value": 7.0},
                    ]
                },
            }
        },
        "greet": {
            "bones": {
                "hip": {
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.0},
                        {"time": 0.22, "x": 0.0, "y": 7.2},
                        {"time": 0.45, "x": 0.0, "y": 1.2},
                        {"time": 0.68, "x": 0.0, "y": 5.8},
                        {"time": 0.9, "x": 0.0, "y": 0.0},
                    ]
                },
                "torso": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.22, "value": 3.5},
                        {"time": 0.68, "value": -2.2},
                        {"time": 0.9, "value": 0.0},
                    ],
                    "scale": [
                        {"time": 0.0, "x": 1.0, "y": 1.0},
                        {"time": 0.22, "x": 1.036, "y": 0.98},
                        {"time": 0.9, "x": 1.0, "y": 1.0},
                    ],
                },
                "head": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.25, "value": -7.0},
                        {"time": 0.65, "value": 5.5},
                        {"time": 0.9, "value": 0.0},
                    ]
                },
                "arm_front": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.22, "value": -8.0},
                        {"time": 0.45, "value": 5.0},
                        {"time": 0.68, "value": -9.0},
                        {"time": 0.9, "value": 0.0},
                    ],
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.0},
                        {"time": 0.45, "x": 0.0, "y": 2.4},
                        {"time": 0.9, "x": 0.0, "y": 0.0},
                    ],
                },
                "arm_back": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.22, "value": 16.0},
                        {"time": 0.45, "value": 6.0},
                        {"time": 0.68, "value": 18.0},
                        {"time": 0.9, "value": 0.0},
                    ]
                },
                "prop_main": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.22, "value": 7.0},
                        {"time": 0.45, "value": -4.0},
                        {"time": 0.68, "value": 7.5},
                        {"time": 0.9, "value": 0.0},
                    ]
                },
            }
        },
        "tend": {
            "bones": {
                "hip": {
                    "translate": [
                        {"time": 0.0, "x": 0.0, "y": 0.0},
                        {"time": 0.9, "x": 0.0, "y": -1.4},
                        {"time": 1.8, "x": 0.0, "y": 0.0},
                    ]
                },
                "torso": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.6, "value": -6.5},
                        {"time": 1.2, "value": -4.5},
                        {"time": 1.8, "value": 0.0},
                    ]
                },
                "head": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.6, "value": -5.5},
                        {"time": 1.2, "value": -2.0},
                        {"time": 1.8, "value": 0.0},
                    ]
                },
                "arm_front": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.6, "value": 8.0},
                        {"time": 1.2, "value": 3.5},
                        {"time": 1.8, "value": 0.0},
                    ]
                },
                "prop_main": {
                    "rotate": [
                        {"time": 0.0, "value": 0.0},
                        {"time": 0.9, "value": -3.5},
                        {"time": 1.8, "value": 0.0},
                    ]
                },
            }
        },
    }


def _sample_curve(frames: list[dict[str, Any]] | None, time_s: float, dur_s: float, keys: tuple[str, ...], default: float) -> dict[str, float]:
    out = {k: default for k in keys}
    if not frames:
        return out
    t = time_s % dur_s if dur_s > 0 else 0.0
    if t <= frames[0]["time"] or len(frames) == 1:
        return {k: float(frames[0].get(k, default)) for k in keys}
    for i in range(len(frames) - 1):
        a = frames[i]
        b = frames[i + 1]
        if a["time"] <= t <= b["time"]:
            span = max(1e-6, b["time"] - a["time"])
            alpha = (t - a["time"]) / span
            return {
                k: float(a.get(k, default)) + (float(b.get(k, default)) - float(a.get(k, default))) * alpha
                for k in keys
            }
    return {k: float(frames[-1].get(k, default)) for k in keys}


def render_preview(skel: dict[str, Any], atlas_im: Image.Image) -> None:
    anims = skel["animations"]
    bg = Image.new("RGBA", (1020, 960), (96, 150, 82, 255))
    draw = ImageDraw.Draw(bg)

    poses = [
        ("idle", 0.0, "Setup / Idle"),
        ("walk", 0.0, "Walk Stride A"),
        ("walk", 0.5, "Walk Stride B"),
        ("greet", 0.22, "Greet Cheer"),
    ]
    chars = list(CHAR_SPECS.keys())

    region_crops: dict[str, Image.Image] = {}
    atlas_txt = open(os.path.join(OUT_DIR, "villagers.atlas"), "r", encoding="utf-8").read().splitlines()
    cur_name = None
    cur_xy = (0, 0)
    cur_wh = (0, 0)
    for line in atlas_txt:
        s = line.strip()
        if not s or s.endswith(".webp"):
            continue
        if ":" not in line:
            cur_name = s
        elif cur_name and s.startswith("xy:"):
            parts = s.split(":")[1].split(",")
            cur_xy = (int(parts[0]), int(parts[1]))
        elif cur_name and s.startswith("size:"):
            parts = s.split(":")[1].split(",")
            cur_wh = (int(parts[0]), int(parts[1]))
            region_crops[cur_name] = atlas_im.crop((cur_xy[0], cur_xy[1], cur_xy[0] + cur_wh[0], cur_xy[1] + cur_wh[1]))
            cur_name = None

    hierarchy = [
        ("hip", "root"),
        ("leg_l", "hip"),
        ("leg_r", "hip"),
        ("torso", "hip"),
        ("back_accent", "torso"),
        ("head", "torso"),
        ("arm_back", "torso"),
        ("prop_sub", "arm_back"),
        ("arm_front", "torso"),
        ("prop_main", "arm_front"),
    ]

    for row, (anim_name, anim_t, label) in enumerate(poses):
        dur = 1.0 if anim_name == "walk" else (0.9 if anim_name == "greet" else 2.4)
        anim_bones = anims[anim_name]["bones"]
        base_y = 225 + row * 235
        draw.text((12, base_y - 205), label, fill=(255, 255, 210, 255))
        draw.line([(0, base_y), (1020, base_y)], fill=(60, 100, 50, 180), width=1)

        for col, cid in enumerate(chars):
            base_x = 92 + col * 165
            if row == 0:
                draw.text((base_x - 24, 6), cid.upper(), fill=(255, 255, 255, 255))
            bones_cfg = skel["skinBones"][cid]
            stabilize = CHAR_SPECS[cid]["prop_stabilize"]
            worlds: dict[str, tuple[float, float, float, float, float, float]] = {"root": (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)}
            parent_drot = {"root": 0.0}
            for bname, pname in hierarchy:
                cfg = bones_cfg[bname]
                tr = anim_bones.get(bname, {})
                d_tr = _sample_curve(tr.get("translate"), anim_t, dur, ("x", "y"), 0.0)
                d_rot = _sample_curve(tr.get("rotate"), anim_t, dur, ("value",), 0.0)["value"]
                d_sc = _sample_curve(tr.get("scale"), anim_t, dur, ("x", "y"), 1.0)
                if bname == "arm_front" and anim_name == "greet":
                    d_rot *= CHAR_SPECS[cid]["greet_scale"]
                cum_rot = parent_drot[pname] + d_rot
                if bname == "prop_main":
                    # Stabilize upright held items cleanly against parent arm swing
                    d_rot = -parent_drot[pname] * stabilize + d_rot * (1.0 - stabilize * 0.5)
                    cum_rot = parent_drot[pname] + d_rot
                parent_drot[bname] = cum_rot
                worlds[bname] = bone_world_matrix(
                    cfg[0] + d_tr["x"],
                    cfg[1] + d_tr["y"],
                    cfg[2] + d_rot,
                    d_sc["x"],
                    d_sc["y"],
                    worlds[pname],
                )

            skin = next(sk for sk in skel["skins"] if sk["name"] == cid)["attachments"]
            for slot_name in SLOT_ORDER:
                att_map = skin.get(slot_name)
                if not att_map:
                    continue
                att_key, att = next(iter(att_map.items()))
                crop = region_crops.get(att_key)
                if crop is None:
                    continue
                m = worlds[slot_name]
                ar = math.radians(att["rotation"])
                ca, sa = math.cos(ar), math.sin(ar)
                aw, ah = att["width"], att["height"]
                ax, ay = att["x"], att["y"]

                def to_preview(lx_att: float, ly_att: float) -> tuple[float, float]:
                    lx_bone = ax + ca * lx_att - sa * ly_att
                    ly_bone = ay + sa * lx_att + ca * ly_att
                    wx = m[0] * lx_bone + m[1] * ly_bone + m[4]
                    wy = m[2] * lx_bone + m[3] * ly_bone + m[5]
                    return base_x + wx, base_y - wy

                pts_dst = [
                    to_preview(-aw * 0.5, ah * 0.5),
                    to_preview(aw * 0.5, ah * 0.5),
                    to_preview(aw * 0.5, -ah * 0.5),
                    to_preview(-aw * 0.5, -ah * 0.5),
                ]
                pts_src = [(0.0, 0.0), (float(aw), 0.0), (float(aw), float(ah)), (0.0, float(ah))]
                A = []
                B = []
                for (dx, dy), (sx, sy) in zip(pts_dst, pts_src):
                    A.append([dx, dy, 1, 0, 0, 0])
                    B.append(sx)
                    A.append([0, 0, 0, dx, dy, 1])
                    B.append(sy)
                coeffs, *_ = np.linalg.lstsq(np.array(A), np.array(B), rcond=None)
                warped = crop.transform(bg.size, Image.Transform.AFFINE, tuple(coeffs), resample=Image.Resampling.BILINEAR)
                bg = Image.alpha_composite(bg, warped)

    bg.save(PREVIEW_PATH)
    print(f"Preview sheet saved: {PREVIEW_PATH}")


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(PREVIEW_PATH), exist_ok=True)

    regions: list[dict[str, Any]] = []
    skin_attachments: dict[str, dict[str, Any]] = {}
    skin_bones: dict[str, dict[str, Any]] = {}
    char_sizes: dict[str, list[int]] = {}
    skin_physics: dict[str, dict[str, float]] = {}

    for cid, spec in CHAR_SPECS.items():
        parts_rgba, (W, H) = segment_character_parts(cid)
        char_sizes[cid] = [W, H]
        bones_cfg = spec["bones"]
        skin_bones[cid] = {
            k: [round(float(v[0]), 2), round(float(v[1]), 2), round(float(v[2]), 2)]
            for k, v in bones_cfg.items()
        }
        skin_physics[cid] = {
            "propStabilize": float(spec["prop_stabilize"]),
            "greetScale": float(spec["greet_scale"]),
        }
        worlds = compute_setup_worlds(bones_cfg)
        body_cx = spec["body_cx"]

        s_att: dict[str, Any] = {}
        for slot_name in SLOT_ORDER:
            rgba = parts_rgba.get(slot_name)
            if rgba is None:
                continue
            alpha = rgba[:, :, 3] > 6
            ys, xs = np.where(alpha)
            if len(xs) == 0:
                continue
            x0, x1 = int(xs.min()), int(xs.max()) + 1
            y0, y1 = int(ys.min()), int(ys.max()) + 1
            aw, ah = x1 - x0, y1 - y0
            crop_im = Image.fromarray(rgba[y0:y1, x0:x1], mode="RGBA")
            att_name = f"{cid}/{slot_name}"
            regions.append({"name": att_name, "image": crop_im, "w": aw, "h": ah})

            cx_w = (x0 + aw * 0.5) - body_cx
            cy_w = H - (y0 + ah * 0.5)
            lx, ly, lrot = invert_to_bone_local(worlds[slot_name], cx_w, cy_w)
            entry: dict[str, Any] = {
                "x": lx,
                "y": ly,
                "rotation": lrot,
                "width": aw,
                "height": ah,
            }
            if slot_name == "prop_main" and spec["emissive_main"] > 0:
                entry["emissive"] = spec["emissive_main"]
            s_att[slot_name] = {att_name: entry}
        skin_attachments[cid] = s_att

    regions.sort(key=lambda r: (-r["h"], -r["w"]))
    atlas_w = 1024
    pad = 3
    cur_x = pad
    cur_y = pad
    row_h = 0
    for r in regions:
        if cur_x + r["w"] + pad > atlas_w:
            cur_x = pad
            cur_y += row_h + pad
            row_h = 0
        r["ax"] = cur_x
        r["ay"] = cur_y
        cur_x += r["w"] + pad
        row_h = max(row_h, r["h"])
    atlas_h = ((cur_y + row_h + pad + 3) // 4) * 4

    atlas_im = Image.new("RGBA", (atlas_w, atlas_h), (0, 0, 0, 0))
    for r in regions:
        atlas_im.paste(r["image"], (r["ax"], r["ay"]))

    atlas_webp_path = os.path.join(OUT_DIR, "villagers_atlas.webp")
    atlas_im.save(atlas_webp_path, format="WEBP", quality=90, method=6)
    size_bytes = os.path.getsize(atlas_webp_path)
    print(f"Packed {len(regions)} multi-part attachments -> {atlas_webp_path} ({atlas_w}x{atlas_h}, {size_bytes / 1024:.1f} KB)")
    assert size_bytes <= 145 * 1024, f"villagers_atlas.webp exceeds 145 KB: {size_bytes}"

    atlas_lines = [
        "villagers_atlas.webp",
        f"size: {atlas_w}, {atlas_h}",
        "format: RGBA8888",
        "filter: Linear, Linear",
        "repeat: none",
    ]
    for r in regions:
        atlas_lines.extend([
            r["name"],
            "  rotate: false",
            f"  xy: {r['ax']}, {r['ay']}",
            f"  size: {r['w']}, {r['h']}",
            f"  orig: {r['w']}, {r['h']}",
            "  offset: 0, 0",
            "  index: -1",
        ])
    atlas_txt_path = os.path.join(OUT_DIR, "villagers.atlas")
    with open(atlas_txt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(atlas_lines) + "\n")

    molly_b = CHAR_SPECS["molly"]["bones"]
    bones_json = [
        {"name": "root", "x": 0.0, "y": 0.0},
        {"name": "hip", "parent": "root", "x": molly_b["hip"][0], "y": molly_b["hip"][1]},
        {"name": "leg_l", "parent": "hip", "length": molly_b["leg_l"][3], "x": molly_b["leg_l"][0], "y": molly_b["leg_l"][1], "rotation": molly_b["leg_l"][2]},
        {"name": "leg_r", "parent": "hip", "length": molly_b["leg_r"][3], "x": molly_b["leg_r"][0], "y": molly_b["leg_r"][1], "rotation": molly_b["leg_r"][2]},
        {"name": "torso", "parent": "hip", "length": molly_b["torso"][3], "x": molly_b["torso"][0], "y": molly_b["torso"][1], "rotation": molly_b["torso"][2]},
        {"name": "back_accent", "parent": "torso", "length": molly_b["back_accent"][3], "x": molly_b["back_accent"][0], "y": molly_b["back_accent"][1], "rotation": molly_b["back_accent"][2]},
        {"name": "head", "parent": "torso", "length": molly_b["head"][3], "x": molly_b["head"][0], "y": molly_b["head"][1], "rotation": molly_b["head"][2]},
        {"name": "arm_back", "parent": "torso", "length": molly_b["arm_back"][3], "x": molly_b["arm_back"][0], "y": molly_b["arm_back"][1], "rotation": molly_b["arm_back"][2]},
        {"name": "prop_sub", "parent": "arm_back", "length": molly_b["prop_sub"][3], "x": molly_b["prop_sub"][0], "y": molly_b["prop_sub"][1], "rotation": molly_b["prop_sub"][2]},
        {"name": "arm_front", "parent": "torso", "length": molly_b["arm_front"][3], "x": molly_b["arm_front"][0], "y": molly_b["arm_front"][1], "rotation": molly_b["arm_front"][2]},
        {"name": "prop_main", "parent": "arm_front", "length": molly_b["prop_main"][3], "x": molly_b["prop_main"][0], "y": molly_b["prop_main"][1], "rotation": molly_b["prop_main"][2]},
    ]
    slots_json = [{"name": s, "bone": s, "attachment": s} for s in SLOT_ORDER]
    skins_json = [
        {"name": cid, "attachments": skin_attachments[cid]}
        for cid in CHAR_SPECS
    ]

    skel_json = {
        "skeleton": {
            "hash": "hangsoc_villagers_spine_v2",
            "spine": "4.1.24",
            "x": -78.0,
            "y": 0.0,
            "width": 156.0,
            "height": 192.0,
            "images": "./",
        },
        "bones": bones_json,
        "slots": slots_json,
        "skins": skins_json,
        "skinBones": skin_bones,
        "skinSizes": char_sizes,
        "skinPhysics": skin_physics,
        "animations": build_animations(),
    }

    skel_path = os.path.join(OUT_DIR, "villagers.skel.json")
    with open(skel_path, "w", encoding="utf-8") as f:
        json.dump(skel_json, f, separators=(",", ":"))
    print(f"Wrote {skel_path} ({os.path.getsize(skel_path) / 1024:.1f} KB)")

    render_preview(skel_json, atlas_im)


if __name__ == "__main__":
    main()

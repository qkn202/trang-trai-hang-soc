/**
 * Toon / Storybook post-processing for sprite art.
 *
 * Technique borrowed from hand-drawn cozy mobile games (thick warm outline +
 * flat 2-tone shading), applied on top of the hand-painted Harry Potter
 * art so the whole park reads as one consistent illustrated style.
 *
 * Everything happens once per sprite at load time and the result is cached,
 * so the render loop only ever does a single drawImage as before.
 */

export interface ToonOptions {
  /** Outline colour — warm chocolate brown, matches the illustrated look. */
  outlineColor: string;
  /** Outline thickness in source pixels (0 disables the outline pass). */
  outlineWidth: number;
  /** 0 = leave colours untouched, 1 = full flat two-tone posterise. */
  posterise: number;
  /** Saturation multiplier applied before posterising. */
  saturation: number;
  /** Brightness multiplier, >1 lifts the art into daylight range. */
  brightness: number;
  /** Warm highlight tint amount, 0 = neutral. */
  warmth: number;
}

export const DEFAULT_TOON: ToonOptions = {
  outlineColor: '#4a2c16',
  outlineWidth: 1,
  posterise: 0.12,
  saturation: 1.1,
  brightness: 1.04,
  warmth: 0.14,
};

/**
 * Sprites that already carry their own heavy stylisation (glossy match-3
 * gems, 3D HUD badges, painted plates) look wrong with an added outline, so
 * they are excluded from the outline pass.
 */
const NO_OUTLINE_KEYS = new Set([
  'm3_gem_ruby',
  'm3_gem_sapphire',
  'm3_gem_emerald',
  'm3_gem_topaz',
  'm3_gem_amethyst',
  'm3_gem_candy_pink',
  'm3_sp_rocket_h',
  'm3_sp_bomb',
  'm3_sp_snitch',
  'm3_piece_scroll',
  'm3_icon_star',
  'm3_icon_heart',
  'm3_obs_box_1',
  'm3_obs_box_2',
  'm3_obs_ice',
  'm3_boost_hammer',
  'm3_boost_cannon',
  'm3_boost_shuffle',
  // V5 Playrix Township 2.5D Canon Burrow & Hogsmeade Sprites (already carry crisp 2.5D volume & #3a2212 ink)
  'burrow_house_canon',
  'arthur_ford_shed',
  'molly_apple_bakery',
  'burrow_owl_post',
  'burrow_pumpkin_gnomes',
  'burrow_reed_pond_mill',
  'burrow_apple_orchard',
  'burrow_greenhouse_canon',
  'burrow_honeydukes_canon',
  'burrow_broomsticks_canon',
  'burrow_feast_marquee',
  'staff_molly_weasley',
  'staff_arthur_weasley',
  'guest_ron_gnome',
  'staff_hagrid_farm',
  // V6 Phase 3 Full Canon Workshops, Pastures, Unified Farmland Plot, Villagers & Props
  'burrow_self_knitting_loom',
  'burrow_cider_apiary',
  'burrow_windmill_canon',
  'hagrid_pumpkin_hut',
  'burrow_chicken_coop',
  'burrow_puffskein_pasture',
  'hogsmeade_stone_bridge',
  'hogsmeade_harvest_fountain',
  'crop_plot_tilled',
  'crop_plot_sprouts',
  'burrow_flower_garden',
  'burrow_animal_pasture',
  'beast_hen',
  'beast_hen_peck',
  'beast_sheep',
  'beast_sheep_graze',
  'beast_cow',
  'beast_cow_graze',
  'beast_puffskein',
  'beast_puffskein_bounce',
  // V7 Living Valley 2.5D Remastered Nature, Kinetic Props & Walking Villagers
  'whomping_willow',
  'unicorn_glade',
  'env_tree_oak',
  'env_tree_pine',
  'env_pine_snow',
  'env_tree_magic',
  'env_bush_flowers',
  'env_mossy_rock',
  'env_flower_patch',
  'prop_windmill_sails',
  'prop_waterwheel_rotor',
  'prop_construction_site',
  'prop_ribbon_unveil',
]);

export function shouldOutline(key: string): boolean {
  return (
    !key.startsWith('m3_') &&
    !key.startsWith('ui_icon_') &&
    !key.startsWith('npc_') &&
    !key.startsWith('villager_') &&
    !NO_OUTLINE_KEYS.has(key)
  );
}

export function isGlossyUntoonedSprite(key: string): boolean {
  return (
    key.startsWith('m3_') ||
    key.startsWith('ui_icon_') ||
    key.startsWith('npc_') ||
    key.startsWith('villager_') ||
    NO_OUTLINE_KEYS.has(key)
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * Saturation + brightness + warm highlights + optional posterise, applied
 * per pixel. Alpha is preserved untouched so sprite edges stay crisp.
 */
function gradePixels(
  data: Uint8ClampedArray,
  opts: ToonOptions
): void {
  const { saturation, brightness, warmth, posterise } = opts;
  const hasPosterise = posterise > 0;
  const [inkR, inkG, inkB] = hexToRgb(opts.outlineColor);

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a === 0) continue;

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Chromatic Espresso Ink Softener: lift harsh pure-black ink (#000) toward warm #4a2c16
    const lum0 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (lum0 < 62) {
      const inkBlend = ((62 - lum0) / 62) * 0.68;
      r = r + (inkR - r) * inkBlend;
      g = g + (inkG - g) * inkBlend;
      b = b + (inkB - b) * inkBlend;
    }

    // Saturation around luminance
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + (r - lum) * saturation;
    g = lum + (g - lum) * saturation;
    b = lum + (b - lum) * saturation;

    // Warm the highlights (storybook sunlight), keep midtones creamy
    const l2 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const hi = Math.max(0, (l2 - 135) / 120);
    const lo = Math.max(0, (85 - l2) / 85);
    r += hi * 24 * warmth + lo * 4 * warmth;
    g += hi * 14 * warmth + lo * 1.5 * warmth;
    b += hi * 2 * warmth - lo * 5 * warmth;

    r *= brightness;
    g *= brightness;
    b *= brightness;

    if (hasPosterise) {
      // Gentle 6-band cel-paint smoothing without crushing roof detail
      const l3 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const bands = 6;
      const step = 255 / (bands - 1);
      const q = Math.round(l3 / step) * step;
      const blend = posterise;
      r = r + (q * (r / Math.max(1, l3)) - r) * blend;
      g = g + (q * (g / Math.max(1, l3)) - g) * blend;
      b = b + (q * (b / Math.max(1, l3)) - b) * blend;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }
}

/**
 * Builds the outline silhouette: the source alpha dilated by `radius` pixels
 * and tinted with a single warm colour. Implemented by stamping the source
 * image at eight compass offsets, then tinting the union.
 */
function buildOutline(
  source: CanvasImageSource,
  w: number,
  h: number,
  radius: number,
  color: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const steps = Math.max(1, Math.round(radius));
  for (let d = 1; d <= steps; d++) {
    const alpha = 1 - (d - 1) / Math.max(1, steps);
    ctx.globalAlpha = alpha;
    for (let dy = -steps; dy <= steps; dy++) {
      for (let dx = -steps; dx <= steps; dx++) {
        if (dx === 0 && dy === 0) continue;
        if (dx * dx + dy * dy > steps * steps + steps) continue;
        ctx.drawImage(source, dx, dy);
      }
    }
  }
  ctx.globalAlpha = 1;

  // Tint the dilated silhouette with the outline colour.
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';

  return canvas;
}

/**
 * Produces the final toon canvas for a sprite, or null when the source
 * could not be read.
 */
export function toonSprite(
  img: HTMLImageElement | HTMLCanvasElement,
  opts: ToonOptions = DEFAULT_TOON,
  withOutline = true
): HTMLCanvasElement | null {
  const w = 'naturalWidth' in img ? img.naturalWidth || img.width : img.width;
  const h = 'naturalHeight' in img ? img.naturalHeight || img.height : img.height;
  if (!w || !h) return null;

  const source = document.createElement('canvas');
  source.width = w;
  source.height = h;
  const sctx = source.getContext('2d', { willReadFrequently: true })!;
  sctx.drawImage(img, 0, 0, w, h);

  // Colour grade the artwork itself.
  let graded = source;
  try {
    const imageData = sctx.getImageData(0, 0, w, h);
    gradePixels(imageData.data, opts);
    sctx.putImageData(imageData, 0, 0);
    graded = source;
  } catch {
    // Tainted canvas (should not happen for same-origin PNGs) — keep original.
  }

  if (!withOutline || opts.outlineWidth <= 0) {
    return source;
  }

  const outline = buildOutline(graded, w, h, opts.outlineWidth, opts.outlineColor);
  const out = document.createElement('canvas');
  out.width = w;
  out.height = h;
  const octx = out.getContext('2d')!;
  octx.drawImage(outline, 0, 0);
  octx.drawImage(graded, 0, 0);
  return out;
}

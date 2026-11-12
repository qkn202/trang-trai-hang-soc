/**
 * "De-plinth" pass.
 *
 * Buildings are drawn as cut-out isometric sprites: their bottom silhouette
 * ends in a hard cut where the artwork meets the grass, so at a glance every
 * structure looks like it is standing on a flat cut-out pedestal rather than
 * growing out of the ground.
 *
 * This pass softens that contact. For each structure sprite we find the
 * rows near the bottom that carry the silhouette, and fade the outermost
 * opaque pixels out with a short vertical gradient — so the last few pixels
 * of the base melt into the terrain instead of stopping dead.
 *
 * The effect is deliberately subtle: it removes the "sticker" read without
 * eating the artwork (a building must not look like it is dissolving).
 */

/** Structure sprites whose base should melt into the ground. */
const GROUND_BLEND_KEYS = new Set([
  // Magical Creature Sanctuaries, Owlery & Rural Scenery
  'niffler_den',
  'hippogriff_glade',
  'phoenix_perch',
  'dragon_lair',
  'hagrid_bowtruckle',
  'owlery_elf_hut',
  'butterbeer_cart',
  'halloween_arch',
  'snowy_pines',
  'creature_feeder_toy',
  'floo_fireplace_gate',
  'eeylops_owl_emporium',
  'thestral_grove',
  'unicorn_glade',
  'whomping_willow',
  // Canon Hang Sóc structures & 4-stage farm plots
  'burrow_house_canon',
  'arthur_ford_shed',
  'molly_apple_bakery',
  'burrow_owl_post',
  'burrow_self_knitting_loom',
  'burrow_cider_apiary',
  'burrow_windmill_canon',
  'burrow_reed_pond_mill',
  'burrow_apple_orchard',
  'burrow_chicken_coop',
  'burrow_puffskein_pasture',
  'burrow_greenhouse_canon',
  'hagrid_pumpkin_hut',
  'hogsmeade_stone_bridge',
  'burrow_honeydukes_canon',
  'burrow_broomsticks_canon',
  'hogsmeade_harvest_fountain',
  'burrow_feast_marquee',
  'burrow_pumpkin_gnomes',
  'burrow_flower_garden',
  'burrow_animal_pasture',
  // Unified farmland plot lies flat on the terrain, so its base melts into the field.
  'crop_plot_tilled',
  'crop_plot_sprouts',
  // Enchanted-forest scenery: hard cut where it meets the grass, so it needs
  // the same contact softening as the buildings.
  'env_tree_oak',
  'env_tree_pine',
  'env_tree_magic',
  'env_bush_flowers',
  'env_flower_patch',
  'env_mossy_rock',
  'env_pine_snow',
  'prop_construction_site',
]);

/**
 * Fraction of the sprite height (measured from the bottom) that the
 * dissolve occupies. Small enough to keep the artwork intact.
 */
const BLEND_DEPTH = 0.055;

/**
 * Fraction of the height that may be dissolved when the sprite carries a
 * baked-in grass plate (a wide green base patch). That plate is itself a
 * hard "pedestal" and needs a much deeper cut than an ordinary base.
 */
const PLINTH_DEPTH = 0.18;

/**
 * Sprites whose artwork ships with a baked-in grass plate.
 * All 172 sprites in public/sprites/ are now Plinth-Free (whomping_willow and
 * unicorn_glade were remastered without plinths), so this set is empty.
 */
const PLINTH_KEYS = new Set<string>([]);

export function shouldGroundBlend(key: string): boolean {
  return GROUND_BLEND_KEYS.has(key);
}

let sharedBlendReadCanvas: HTMLCanvasElement | null = null;
let sharedBlendReadCtx: CanvasRenderingContext2D | null = null;

function getSharedBlendReadCtx(w: number, h: number): CanvasRenderingContext2D | null {
  if (typeof document === 'undefined') return null;
  if (!sharedBlendReadCanvas) {
    sharedBlendReadCanvas = document.createElement('canvas');
    sharedBlendReadCtx = sharedBlendReadCanvas.getContext('2d', { willReadFrequently: true });
  }
  if (!sharedBlendReadCanvas || !sharedBlendReadCtx) return null;
  if (sharedBlendReadCanvas.width < w) sharedBlendReadCanvas.width = w;
  if (sharedBlendReadCanvas.height < h) sharedBlendReadCanvas.height = h;
  sharedBlendReadCtx.clearRect(0, 0, w, h);
  return sharedBlendReadCtx;
}

/**
 * Releases the temporary CPU readback scratch buffer after bulk sprite loading
 * so mobile/iOS WebKit recovers software canvas memory immediately.
 */
export function releaseGroundBlendScratch(): void {
  if (sharedBlendReadCanvas) {
    sharedBlendReadCanvas.width = 1;
    sharedBlendReadCanvas.height = 1;
  }
}

/**
 * Fades the bottom edge of a sprite image or already-tooned sprite canvas so it
 * blends into the terrain instead of sitting on a hard cut-out line.
 *
 * Uses a single shared `willReadFrequently` scratch canvas for pixel readback and
 * writes the final pixels onto a standard GPU-accelerated `<canvas>` so 60fps
 * `drawImage()` calls on iOS Safari / mobile browsers stay on the GPU fast path.
 */
export function applyGroundBlend(
  source: HTMLCanvasElement | HTMLImageElement,
  key: string
): HTMLCanvasElement | HTMLImageElement {
  const w =
    source instanceof HTMLCanvasElement
      ? source.width
      : source.naturalWidth || source.width;
  const h =
    source instanceof HTMLCanvasElement
      ? source.height
      : source.naturalHeight || source.height;
  if (!w || !h) return source;

  const readCtx = getSharedBlendReadCtx(w, h);
  if (!readCtx) return source;

  let data: ImageData;
  try {
    readCtx.drawImage(source, 0, 0, w, h);
    data = readCtx.getImageData(0, 0, w, h);
  } catch {
    return source; // tainted canvas — leave the artwork alone
  }
  const px = data.data;

  // Find the lowest row that still has any opaque pixel: that is the true
  // bottom of the silhouette, and where the "pedestal" cut happens.
  const alphaAt = (x: number, y: number) => px[(y * w + x) * 4 + 3];
  let lowest = -1;
  for (let y = h - 1; y >= 0; y--) {
    let any = false;
    for (let x = 0; x < w; x++) {
      if (alphaAt(x, y) > 8) {
        any = true;
        break;
      }
    }
    if (any) {
      lowest = y;
      break;
    }
  }
  if (lowest < 0) return source;

  const depth = PLINTH_KEYS.has(key)
    ? Math.max(6, Math.round(h * PLINTH_DEPTH))
    : Math.max(4, Math.round(h * BLEND_DEPTH));
  const top = Math.max(0, lowest - depth);

  for (let y = top; y <= lowest; y++) {
    // 0 at the top of the dissolve band, 1 at the very bottom.
    const t = (y - top) / Math.max(1, lowest - top);
    // Ease so most of the band stays solid and only the last slice fades.
    const fade = Math.max(0, Math.min(1, (t - 0.35) / 0.65));
    const mul = 1 - fade * fade;
    if (mul >= 1) continue;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4 + 3;
      const a = px[i];
      if (a === 0) continue;
      px[i] = Math.round(a * mul);
    }
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = w;
  outCanvas.height = h;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) return source;

  try {
    outCtx.putImageData(data, 0, 0);
  } catch {
    return source;
  }
  return outCanvas;
}

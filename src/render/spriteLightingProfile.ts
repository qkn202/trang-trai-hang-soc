import type { CatalogItem } from '../types/game';

/**
 * 0 = Non-emissive organic foliage/crops/beasts/plots (zero false night glow + rounded dome normal)
 * 1 = Architectural buildings with framed lit windows (local contrast gated in BAKE_NORMAL_FS)
 * 2 = Magical flames, lanterns, floating candles, and glowing Yule ornaments
 */
export type SpriteLightingProfile = 0 | 1 | 2;

const ORGANIC_EXACT_KEYS = new Set([
  'farmland_plot',
  'burrow_pumpkin_gnomes',
  'burrow_chicken_coop',
  'burrow_flower_garden',
  'burrow_animal_pasture',
  'burrow_puffskein_pasture',
  'burrow_apple_orchard',
  'whomping_willow',
  'yule_poinsettia_pot',
  'yule_battrang_pots',
  'yule_vn_battrang_pots',
  'yule_snow_hedge',
  'yule_ice_brick_wall',
  'yule_snowman_wizard',
  'yule_yule_log_bench',
  'yule_holly_hedgerow',
  'yule_snowdrop_moss_log',
  'yule_edelweiss_alpine_rockery',
  'yule_puffskein_snowballs',
  'prop_windmill_sails',
  'prop_waterwheel_rotor',
  'prop_construction_site',
]);

const MAGICAL_GLOW_RE =
  /lantern|candle|lamp|hearth|floo|fire|star_arch|fir_tree|snitch_sweater_tree|grotto|hourglasses|ice_arch|patronus|fountain/;

/** Classify a sprite key for smart normal-map baking and nocturnal emissive gating. */
export function getSpriteLightingProfile(key: string): SpriteLightingProfile {
  if (
    key.startsWith('beast_') ||
    key.startsWith('crop_') ||
    key.startsWith('ui_icon_') ||
    key.startsWith('m3_')
  ) {
    return 0;
  }

  if (
    key === 'env_tree_magic' ||
    key === 'unicorn_glade' ||
    key === 'prop_ribbon_unveil' ||
    MAGICAL_GLOW_RE.test(key)
  ) {
    return 2;
  }

  if (key.startsWith('env_') || ORGANIC_EXACT_KEYS.has(key)) {
    return 0;
  }

  return 1;
}

const GRAND_LANDMARK_RE =
  /burrow_house|feast_marquee|hogwarts|cathedral|Conservatory|conservatory/;

/**
 * Harmonize visual silhouette weight across 1x1 props, mid buildings, and 3x3 landmarks
 * while strictly honoring explicit catalog `spriteScale` overrides (including 1.0 on connectable plots).
 */
export function getHarmonizedSpriteScale(item: CatalogItem): number {
  if (typeof item.spriteScale === 'number') {
    return item.spriteScale;
  }
  if (item.connectableGroup) {
    return item.width !== item.height ? 1.0 : 1.05;
  }
  if (item.width !== item.height) {
    return 1.0;
  }
  if (item.width >= 3 && item.height >= 3) {
    return GRAND_LANDMARK_RE.test(item.id) || item.category !== 'decor' ? 1.1 : 1.08;
  }
  if (item.width === 1 && item.height === 1 && item.category === 'decor') {
    const keepFullScale =
      item.isCreatureHabitat ||
      item.isFlooPortal ||
      item.id.includes('tree') ||
      item.id.includes('arch') ||
      item.id.includes('pine') ||
      item.id.includes('willow');
    if (!keepFullScale) {
      return 0.92;
    }
  }
  return 1.05;
}

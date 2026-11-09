#!/usr/bin/env node
/**
 * Sprite pipeline validator.
 *
 * Checks every file in public/sprites against the art-direction rules so a
 * freshly drawn batch can be dropped in without breaking the render loop.
 *
 *   node tools/validate-sprites.mjs
 *
 * Exit code 0 = all good, 1 = at least one hard failure.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SPRITES_DIR = join(ROOT, 'public', 'sprites');

/** Every key the loader asks for. Keep in sync with src/engine/spriteLoader.ts (172 total). */
const REQUIRED = [
  'niffler_den', 'hippogriff_glade', 'phoenix_perch', 'dragon_lair',
  'black_lake_boats', 'hagrid_bowtruckle', 'owlery_elf_hut', 'butterbeer_cart',
  'whomping_willow', 'halloween_arch', 'snowy_pines', 'creature_feeder_toy',
  'floo_fireplace_gate', 'eeylops_owl_emporium', 'thestral_grove', 'unicorn_glade',
  'beast_niffler', 'beast_hippogriff', 'beast_phoenix', 'beast_dragon',
  'beast_unicorn', 'beast_thestral', 'vehicle_lake_boat',
  'staff_wizard',
  'm3_gem_ruby', 'm3_gem_sapphire', 'm3_gem_emerald', 'm3_gem_topaz',
  'm3_gem_amethyst', 'm3_gem_candy_pink', 'm3_sp_rocket_h', 'm3_sp_bomb',
  'm3_sp_snitch', 'm3_piece_scroll', 'm3_icon_star', 'm3_icon_heart',
  'm3_obs_box_1', 'm3_obs_box_2', 'm3_obs_ice', 'm3_boost_hammer',
  'm3_boost_cannon', 'm3_boost_shuffle',
  'env_tree_oak', 'env_tree_pine', 'env_pine_snow', 'env_tree_magic',
  'env_bush_flowers', 'env_mossy_rock', 'env_flower_patch',
  'beast_niffler_play', 'beast_hippogriff_bow',
  'beast_phoenix_soar', 'beast_dragon_roar', 'beast_unicorn_prance',
  'beast_thestral_wings', 'ui_icon_jigsaw', 'ui_icon_accio', 'ui_icon_suitcase',
  'ui_icon_path', 'ui_icon_terrain', 'ui_icon_shop', 'ui_icon_creature',
  'ui_icon_decor', 'ui_icon_staff',
  // Canon Trang Trại Hang Sóc & Hogsmeade Playrix Township 2.5D Core (22)
  'burrow_house_canon', 'arthur_ford_shed', 'molly_apple_bakery', 'burrow_owl_post',
  'burrow_pumpkin_gnomes', 'burrow_reed_pond_mill',
  'burrow_apple_orchard', 'burrow_greenhouse_canon', 'burrow_honeydukes_canon',
  'burrow_broomsticks_canon', 'burrow_feast_marquee', 'staff_molly_weasley',
  'staff_arthur_weasley', 'guest_ron_gnome', 'staff_hagrid_farm',
  'ui_icon_pie_ready', 'ui_icon_owl_orders', 'ui_icon_seed_sack',
  'ui_icon_hammer_wand', 'ui_icon_world_map', 'ui_icon_sweater_ready',
  'ui_icon_watering_can',
  // Full Canon Farmstead Expansion (29 -> 115 Total)
  'burrow_self_knitting_loom', 'burrow_cider_apiary', 'burrow_windmill_canon',
  'hagrid_pumpkin_hut', 'burrow_chicken_coop', 'burrow_puffskein_pasture',
  'hogsmeade_stone_bridge', 'hogsmeade_harvest_fountain', 'crop_plot_tilled',
  'crop_plot_sprouts',
  'ui_icon_golden_sickle', 'ui_icon_cider',
  'ui_icon_honey_jar', 'ui_icon_flour_sack', 'ui_icon_butterbeer',
  'ui_icon_frog_choc', 'ui_icon_herb_elixir', 'ui_icon_mushroom_soup',
  'ui_icon_egg_basket', 'ui_icon_muggle_plug', 'm3_farm_strawberry',
  'm3_farm_pumpkin', 'm3_farm_blueberry', 'm3_farm_pear', 'm3_farm_plum',
  'm3_farm_honey', 'm3_farm_pinwheel', 'm3_farm_crate', 'm3_farm_jam_bomb',
  // Flower Gardens, Flower Seeds & Connectable Animal Pastures Expansion (16 -> 131 Total)
  'burrow_flower_garden', 'burrow_animal_pasture',
  'beast_hen', 'beast_hen_peck', 'beast_sheep', 'beast_sheep_graze',
  'beast_cow', 'beast_cow_graze', 'beast_puffskein', 'beast_puffskein_bounce',
  'ui_icon_flower_seeds', 'ui_icon_rose_bouquet', 'ui_icon_tulip_bluebell',
  'ui_icon_magic_blossom', 'ui_icon_pasture_bell', 'ui_icon_milk_wool',
  // Molly Weasley 2.5D Tutorial Coach Portraits (3 -> 134 Total)
  'npc_molly_welcome', 'npc_molly_guide', 'npc_molly_cheer',
  // Bespoke 2.5D Painted Harvest Crop, Fruit & Flower Bushes (22 -> 156 Total)
  'ui_icon_crop_ottery_wheat', 'ui_icon_crop_honey_carrot', 'ui_icon_crop_garden_pumpkin',
  'ui_icon_crop_golden_corn', 'ui_icon_crop_crisp_cabbage', 'ui_icon_crop_burrow_potato',
  'ui_icon_crop_ruby_strawberry', 'ui_icon_crop_burrow_apple', 'ui_icon_crop_ruby_tomato',
  'ui_icon_crop_dew_blueberry', 'ui_icon_crop_baby_mandrake', 'ui_icon_crop_glow_mushroom',
  'ui_icon_crop_meadow_daisy', 'ui_icon_crop_english_rose', 'ui_icon_crop_golden_daffodil',
  'ui_icon_crop_rainbow_tulip', 'ui_icon_crop_dried_lavender', 'ui_icon_crop_hedge_sunflower',
  'ui_icon_crop_forest_bluebell', 'ui_icon_crop_blush_peony', 'ui_icon_crop_moonlight_flower',
  'ui_icon_crop_phoenix_fireflower',
  // Kinetic Mill Rotors, 2.5D Construction & Ribbon Unveiling Props (4 -> 160 Total)
  'prop_windmill_sails', 'prop_waterwheel_rotor', 'prop_construction_site', 'prop_ribbon_unveil',
  // Walking Weasley Family & Hogsmeade Villagers 2-Pose Chibi 2.5D Set (12 -> 172 Total)
  'villager_molly_idle', 'villager_molly_walk',
  'villager_arthur_idle', 'villager_arthur_walk',
  'villager_ron_idle', 'villager_ron_walk',
  'villager_ginny_idle', 'villager_ginny_walk',
  'villager_hagrid_idle', 'villager_hagrid_walk',
  'villager_hermione_idle', 'villager_hermione_walk',
];

/**
 * Per-key rules.
 *  - maxW/maxH: the current file's canvas budget. New art may be larger but
 *    must keep the same aspect ratio family so nothing gets distorted.
 *  - ratio: (w/h) the renderer assumes. Used to flag a badly reshaped sprite.
 *  - transparent: background must be fully transparent (no baked sky/ground).
 */
const RULES = {
  // match-3 icons are a strict square grid — the board slices them by pixel.
  m3: { square: true, maxW: 160, maxH: 160 },
  // characters keep a tall silhouette; the board anchors them at the feet.
  char: { maxH: 200, minRatio: 0.4, maxRatio: 1.1 },
  // beasts are drawn around 240px tall in the canvas.
  beast: { maxH: 240, minRatio: 0.55, maxRatio: 1.5 },
  // vehicles ride the water/paths, so they stay wide-ish and short.
  vehicle: { maxH: 250, maxRatio: 2.2 },
  // buildings sit on a plot; generous canvas, roughly square.
  building: { maxW: 380, maxH: 380, minRatio: 0.55, maxRatio: 2.0 },
};

/** Names that break the prefix convention and need an explicit rule. */
const RULE_OVERRIDES = {};

function ruleFor(key) {
  const override = RULE_OVERRIDES[key];
  if (override) return RULES[override];
  if (key.startsWith('m3_') || key.startsWith('ui_icon_')) return RULES.m3;
  if (key.startsWith('beast_')) return RULES.beast;
  if (key.startsWith('guest_') || key.startsWith('staff_') || key.startsWith('villager_')) return RULES.char;
  if (key.startsWith('vehicle_')) return RULES.vehicle;
  return RULES.building;
}

function readPngSize(path) {
  const buf = readFileSync(path);
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

const errors = [];
const warnings = [];
const info = [];

const present = new Set(
  readdirSync(SPRITES_DIR)
    .filter((f) => extname(f).toLowerCase() === '.png')
    .map((f) => f.replace(/\.png$/i, ''))
);

for (const key of REQUIRED) {
  if (!present.has(key)) {
    errors.push(`${key}: thiếu file (public/sprites/${key}.png)`);
  }
}

for (const key of present) {
  const path = join(SPRITES_DIR, `${key}.png`);
  const size = readPngSize(path);
  if (!size) {
    errors.push(`${key}: không đọc được kích thước PNG (file hỏng?)`);
    continue;
  }

  const rule = ruleFor(key);
  const bytes = statSync(path).size;
  const ratio = size.width / size.height;

  if (rule.square && size.width !== size.height) {
    errors.push(`${key}: phải là ô vuông (${size.width}×${size.height})`);
  }
  if (rule.maxW && size.width > rule.maxW) {
    warnings.push(`${key}: rộng ${size.width}px > gợi ý ${rule.maxW}px — sẽ tốn bộ nhớ`);
  }
  if (rule.maxH && size.height > rule.maxH) {
    warnings.push(`${key}: cao ${size.height}px > gợi ý ${rule.maxH}px`);
  }
  if (rule.minRatio && ratio < rule.minRatio) {
    warnings.push(`${key}: tỉ lệ ${ratio.toFixed(2)} quá hẹp so với dự kiến`);
  }
  if (rule.maxRatio && ratio > rule.maxRatio) {
    warnings.push(`${key}: tỉ lệ ${ratio.toFixed(2)} quá rộng so với dự kiến`);
  }
  if (bytes > 320 * 1024) {
    warnings.push(`${key}: ${Math.round(bytes / 1024)}KB — nên nén lại (pngquant)`);
  }

  info.push(`${key}: ${size.width}×${size.height} (${ratio.toFixed(2)}), ${Math.round(bytes / 1024)}KB`);
}

const extra = [...present].filter((k) => !REQUIRED.includes(k));
for (const k of extra) {
  warnings.push(`${k}: có trong thư mục nhưng không nằm trong danh sách loader — sẽ không được tải`);
}

console.log(`\n🖼  Kiểm tra ${present.size} sprite trong public/sprites\n`);
console.log(info.join('\n'));

if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} cảnh báo:`);
  console.log(warnings.map((w) => `   • ${w}`).join('\n'));
}

if (errors.length) {
  console.log(`\n❌ ${errors.length} lỗi:`);
  console.log(errors.map((e) => `   • ${e}`).join('\n'));
  process.exit(1);
}

console.log('\n✅ Không có lỗi. Toàn bộ sprite sẵn sàng.\n');

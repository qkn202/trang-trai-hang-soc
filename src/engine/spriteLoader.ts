import { DEFAULT_TOON, isGlossyUntoonedSprite, shouldOutline, toonSprite } from './toon';
import { applyGroundBlend, releaseGroundBlendScratch, shouldGroundBlend } from './groundBlend';

const MAX_CONNECTED_FARMLAND_CACHE = 96;

async function yieldToMainThread(): Promise<void> {
  const g = globalThis as unknown as {
    scheduler?: { yield?: () => Promise<void> };
  };
  if (g.scheduler && typeof g.scheduler.yield === 'function') {
    await g.scheduler.yield();
    return;
  }
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

export const SPRITE_KEYS = [
  // Magical Creature Sanctuaries, Rural Lake, Owlery & Scenery (15)
  'niffler_den',
  'hippogriff_glade',
  'phoenix_perch',
  'dragon_lair',
  'black_lake_boats',
  'hagrid_bowtruckle',
  'owlery_elf_hut',
  'butterbeer_cart',
  'whomping_willow',
  'halloween_arch',
  'snowy_pines',
  'creature_feeder_toy',
  'floo_fireplace_gate',
  'eeylops_owl_emporium',
  'thestral_grove',
  'unicorn_glade',
  // Roaming Magical Beasts & Lake Boat (7)
  'beast_niffler',
  'beast_hippogriff',
  'beast_phoenix',
  'beast_dragon',
  'beast_unicorn',
  'beast_thestral',
  'vehicle_lake_boat',
  // Portrait Sprite for Sảnh Caro Opponent (1)
  'staff_wizard',
  // Puzzle Arcade & Match-3 Shared Pieces/Boosters (18)
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
  // Sunlit Enchanted Forest Scenery Props (7)
  'env_tree_oak',
  'env_tree_pine',
  'env_pine_snow',
  'env_tree_magic',
  'env_bush_flowers',
  'env_mossy_rock',
  'env_flower_patch',
  // Beast Action Poses (6)
  'beast_niffler_play',
  'beast_hippogriff_bow',
  'beast_phoenix_soar',
  'beast_dragon_roar',
  'beast_unicorn_prance',
  'beast_thestral_wings',
  // 3D Illustrated HUD & Build Dock Icons (9)
  'ui_icon_jigsaw',
  'ui_icon_accio',
  'ui_icon_suitcase',
  'ui_icon_path',
  'ui_icon_terrain',
  'ui_icon_shop',
  'ui_icon_creature',
  'ui_icon_decor',
  'ui_icon_staff',
  // Canon Trang Trại Hang Sóc & Hogsmeade Playrix Township 2.5D Core (22)
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
  'ui_icon_pie_ready',
  'ui_icon_owl_orders',
  'ui_icon_seed_sack',
  'ui_icon_hammer_wand',
  'ui_icon_world_map',
  'ui_icon_sweater_ready',
  'ui_icon_watering_can',
  // Full Canon Farmstead Expansion: Workshops, Pastures, Unified Farmland Plot & Attic Match-3 (29 -> 115 Total!)
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
  'ui_icon_golden_sickle',
  'ui_icon_cider',
  'ui_icon_honey_jar',
  'ui_icon_flour_sack',
  'ui_icon_butterbeer',
  'ui_icon_frog_choc',
  'ui_icon_herb_elixir',
  'ui_icon_mushroom_soup',
  'ui_icon_egg_basket',
  'ui_icon_muggle_plug',
  'm3_farm_strawberry',
  'm3_farm_pumpkin',
  'm3_farm_blueberry',
  'm3_farm_pear',
  'm3_farm_plum',
  'm3_farm_honey',
  'm3_farm_pinwheel',
  'm3_farm_crate',
  'm3_farm_jam_bomb',
  // Flower Gardens, Flower Seeds & Connectable Animal Pastures Expansion (16 -> 131 Total!)
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
  'ui_icon_flower_seeds',
  'ui_icon_rose_bouquet',
  'ui_icon_tulip_bluebell',
  'ui_icon_magic_blossom',
  'ui_icon_pasture_bell',
  'ui_icon_milk_wool',
  // Molly Weasley 2.5D Tutorial Coach Portraits (3 -> 134 Total!)
  'npc_molly_welcome',
  'npc_molly_guide',
  'npc_molly_cheer',
  // Bespoke 2.5D Painted Harvest Crop, Fruit & Flower Bushes (22 -> 156 Total!)
  'ui_icon_crop_ottery_wheat',
  'ui_icon_crop_honey_carrot',
  'ui_icon_crop_garden_pumpkin',
  'ui_icon_crop_golden_corn',
  'ui_icon_crop_crisp_cabbage',
  'ui_icon_crop_burrow_potato',
  'ui_icon_crop_ruby_strawberry',
  'ui_icon_crop_burrow_apple',
  'ui_icon_crop_ruby_tomato',
  'ui_icon_crop_dew_blueberry',
  'ui_icon_crop_baby_mandrake',
  'ui_icon_crop_glow_mushroom',
  'ui_icon_crop_meadow_daisy',
  'ui_icon_crop_english_rose',
  'ui_icon_crop_golden_daffodil',
  'ui_icon_crop_rainbow_tulip',
  'ui_icon_crop_dried_lavender',
  'ui_icon_crop_hedge_sunflower',
  'ui_icon_crop_forest_bluebell',
  'ui_icon_crop_blush_peony',
  'ui_icon_crop_moonlight_flower',
  'ui_icon_crop_phoenix_fireflower',
  // Kinetic Mill Rotors, 2.5D Construction & Ribbon Unveiling Props (4 -> 160 Total!)
  'prop_windmill_sails',
  'prop_waterwheel_rotor',
  'prop_construction_site',
  'prop_ribbon_unveil',
  // Walking Weasley Family & Hogsmeade Villagers 2-Pose Chibi 2.5D Set (12 -> 172 Total!)
  'villager_molly_idle',
  'villager_molly_walk',
  'villager_arthur_idle',
  'villager_arthur_walk',
  'villager_ron_idle',
  'villager_ron_walk',
  'villager_ginny_idle',
  'villager_ginny_walk',
  'villager_hagrid_idle',
  'villager_hagrid_walk',
  'villager_hermione_idle',
  'villager_hermione_walk',
] as const;

export type SpriteSource = HTMLImageElement | HTMLCanvasElement;

interface AlphaBitmask {
  mw: number;
  mh: number;
  bits: Uint8Array;
}

export class SpriteRegistry {
  private images = new Map<string, SpriteSource>();
  /** 0.5x high-quality downsampled mipmaps for crisp zoomed-out rendering. */
  private mips = new Map<string, HTMLCanvasElement>();
  /** 1/4-res packed 1-bit alpha masks (~1-4KB each) for O(1) pixel-accurate hit-testing. */
  private alphaMasks = new Map<string, AlphaBitmask>();
  /** Raw, untonised artwork — used where the painterly look is wanted. */
  private raw = new Map<string, HTMLImageElement>();
  /** Cached auto-tiled farmland plot variants keyed by `${stageKey}:${mask12}`. */
  private connectedFarmlandCache = new Map<string, SpriteSource>();
  private connectedFarmlandMips = new Map<string, HTMLCanvasElement>();
  private farmlandRawPixels = new Map<string, { w: number; h: number; data: Uint8ClampedArray }>();
  private readScratchCanvas: HTMLCanvasElement | null = null;
  private readScratchCtx: CanvasRenderingContext2D | null = null;
  private toonEnabled = false;

  private getReadScratchCtx(w: number, h: number): CanvasRenderingContext2D | null {
    if (typeof document === 'undefined') return null;
    if (!this.readScratchCanvas) {
      this.readScratchCanvas = document.createElement('canvas');
      this.readScratchCtx = this.readScratchCanvas.getContext('2d', { willReadFrequently: true });
    }
    if (!this.readScratchCanvas || !this.readScratchCtx) return null;
    if (this.readScratchCanvas.width < w) this.readScratchCanvas.width = w;
    if (this.readScratchCanvas.height < h) this.readScratchCanvas.height = h;
    this.readScratchCtx.clearRect(0, 0, w, h);
    return this.readScratchCtx;
  }

  private releaseReadScratch(): void {
    if (this.readScratchCanvas) {
      this.readScratchCanvas.width = 1;
      this.readScratchCanvas.height = 1;
    }
    releaseGroundBlendScratch();
  }

  /**
   * When false the raw painterly art is served untouched (photo mode,
   * or a quick A/B of the illustrated look).
   */
  public setToonEnabled(enabled: boolean): void {
    if (this.toonEnabled === enabled) return;
    this.toonEnabled = enabled;
    this.connectedFarmlandCache.clear();
    this.connectedFarmlandMips.clear();
    for (const [key, img] of this.raw) {
      const built = this.buildSprite(key, img);
      this.images.set(key, built);
      this.rebuildMip(key, built);
    }
    this.releaseReadScratch();
  }

  public isToonEnabled(): boolean {
    return this.toonEnabled;
  }

  private buildSprite(key: string, img: HTMLImageElement): SpriteSource {
    // The de-plinth pass is a rendering rule (ASSETS.md §1 "Plinth-Free"), not a
    // toon-look option: it must apply in the default painterly mode too. Only the
    // cel-shading is optional.
    const wantsBlend = shouldGroundBlend(key);
    if (!this.toonEnabled || isGlossyUntoonedSprite(key)) {
      if (!wantsBlend) return img;
      return applyGroundBlend(img, key);
    }
    try {
      const out = toonSprite(img, DEFAULT_TOON, shouldOutline(key));
      if (!out) return wantsBlend ? applyGroundBlend(img, key) : img;
      // Melt the hard bottom cut so the structure sits in the ground
      // instead of reading as a sticker on a pedestal.
      return wantsBlend ? applyGroundBlend(out, key) : out;
    } catch {
      return wantsBlend ? applyGroundBlend(img, key) : img;
    }
  }

  private rebuildMip(key: string, src: SpriteSource): void {
    if (key.startsWith('m3_') || key.startsWith('ui_icon_')) return;
    const sw = src.width;
    const sh = src.height;
    if (sw < 200 || sh < 200) {
      this.mips.delete(key);
      return;
    }
    const mw = Math.max(64, Math.round(sw * 0.5));
    const mh = Math.max(64, Math.round(sh * 0.5));
    const canvas = document.createElement('canvas');
    canvas.width = mw;
    canvas.height = mh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(src, 0, 0, mw, mh);
    this.mips.set(key, canvas);
  }

  private buildAlphaMask(key: string, img: HTMLImageElement): void {
    if (key.startsWith('m3_') || key.startsWith('ui_icon_')) return;
    const sw = img.naturalWidth || img.width;
    const sh = img.naturalHeight || img.height;
    if (!sw || !sh) return;
    const mw = Math.max(8, Math.round(sw * 0.25));
    const mh = Math.max(8, Math.round(sh * 0.25));
    try {
      const ctx = this.getReadScratchCtx(mw, mh);
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, mw, mh);
      const data = ctx.getImageData(0, 0, mw, mh).data;
      const total = mw * mh;
      const bits = new Uint8Array(Math.ceil(total / 8));
      for (let i = 0; i < total; i++) {
        if (data[i * 4 + 3] >= 28) {
          bits[i >> 3] |= 1 << (i & 7);
        }
      }
      this.alphaMasks.set(key, { mw, mh, bits });
    } catch {
      // Ignore if canvas read fails
    }
  }

  async loadAll(): Promise<void> {
    const decoded: Array<{ key: string; img: HTMLImageElement }> = [];
    await Promise.all(
      SPRITE_KEYS.map(
        (key) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => {
              this.raw.set(key, img);
              decoded.push({ key, img });
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
            img.src = `/sprites/${key}.png`;
          })
      )
    );

    const nowFn = () =>
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    let deadline = nowFn() + 36;

    for (let i = 0; i < decoded.length; i++) {
      const { key, img } = decoded[i];
      const built = this.buildSprite(key, img);
      this.images.set(key, built);
      this.rebuildMip(key, built);
      this.buildAlphaMask(key, img);

      if (nowFn() >= deadline && i + 1 < decoded.length) {
        await yieldToMainThread();
        deadline = nowFn() + 36;
      }
    }

    this.releaseReadScratch();
  }

  get(key?: string): SpriteSource | undefined {
    if (!key) return undefined;
    return this.images.get(key);
  }

  /**
   * Returns a pre-downsampled 0.5x mipmap when drawing zoomed out so thin warm
   * outlines stay velvety and never shimmer on Retina/mobile screens.
   */
  getMip(key?: string, targetWidthPx?: number): SpriteSource | undefined {
    if (!key) return undefined;
    if (typeof targetWidthPx === 'number') {
      const mip = this.mips.get(key);
      if (mip && targetWidthPx <= mip.width * 1.15) {
        return mip;
      }
    }
    return this.images.get(key);
  }

  /**
   * O(1) pixel-accurate hit test against the sprite's 1/4-res alpha bitmask.
   * Normalized (u, v) in [0, 1]. Returns true if opaque (or if no mask exists).
   */
  hitTestAlpha(key: string | undefined, u: number, v: number, flipX = false): boolean {
    if (!key) return true;
    if (u < 0 || u > 1 || v < 0 || v > 1) return false;
    const mask = this.alphaMasks.get(key);
    if (!mask) return true;
    const nu = flipX ? 1 - u : u;
    const cx = Math.min(mask.mw - 1, Math.max(0, Math.floor(nu * mask.mw)));
    const cy = Math.min(mask.mh - 1, Math.max(0, Math.floor(v * mask.mh)));
    const checkBit = (x: number, y: number): boolean => {
      if (x < 0 || y < 0 || x >= mask.mw || y >= mask.mh) return false;
      const idx = y * mask.mw + x;
      return (mask.bits[idx >> 3] & (1 << (idx & 7))) !== 0;
    };
    return (
      checkBit(cx, cy) ||
      checkBit(cx - 1, cy) ||
      checkBit(cx + 1, cy) ||
      checkBit(cx, cy - 1) ||
      checkBit(cx, cy + 1)
    );
  }

  /** Untouched source artwork, bypassing the toon treatment. */
  getRaw(key?: string): HTMLImageElement | undefined {
    if (!key) return undefined;
    return this.raw.get(key);
  }

  private getFarmlandPixels(
    key:
      | 'crop_plot_tilled'
      | 'crop_plot_sprouts'
      | 'burrow_pumpkin_gnomes'
      | 'burrow_flower_garden'
      | 'burrow_chicken_coop'
      | 'burrow_animal_pasture'
  ): {
    w: number;
    h: number;
    data: Uint8ClampedArray;
  } | null {
    const cached = this.farmlandRawPixels.get(key);
    if (cached) return cached;
    const img = this.raw.get(key);
    if (!img) return null;
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h) return null;
    try {
      const ctx = this.getReadScratchCtx(w, h);
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0, w, h);
      const data = new Uint8ClampedArray(ctx.getImageData(0, 0, w, h).data);
      this.releaseReadScratch();
      const rec = { w, h, data };
      this.farmlandRawPixels.set(key, rec);
      return rec;
    } catch {
      return null;
    }
  }

  /**
   * Returns a seamless 2.5D connected-border variant of a 2x2 connectable plot
   * (`crop_plot_tilled`, `crop_plot_sprouts`, `burrow_pumpkin_gnomes`, `burrow_flower_garden`,
   * `burrow_chicken_coop`, or `burrow_animal_pasture`)
   * where wooden frame planks / ranch rails along shared edges (`nw0..sw1`) disappear so adjacent
   * same-group plots merge into one continuous field, flower bed, pumpkin garden, or animal pasture.
   *
   * `mask12` layout:
   *  0: nw0, 1: nw1, 2: ne0, 3: ne1, 4: se0, 5: se1, 6: sw0, 7: sw1,
   *  8: diagN, 9: diagE, 10: diagS, 11: diagW
   */
  getConnectedFarmlandSprite(
    stageKey:
      | 'crop_plot_tilled'
      | 'crop_plot_sprouts'
      | 'burrow_pumpkin_gnomes'
      | 'burrow_flower_garden'
      | 'burrow_chicken_coop'
      | 'burrow_animal_pasture',
    mask12: number,
    targetWidthPx?: number
  ): SpriteSource | undefined {
    if ((mask12 & 0xff) === 0) {
      return this.getMip(stageKey, targetWidthPx) ?? this.get(stageKey);
    }

    const cacheKey = `${stageKey}:${mask12}`;
    let built = this.connectedFarmlandCache.get(cacheKey);
    if (!built) {
      const tilledRec = this.getFarmlandPixels('crop_plot_tilled');
      const srcRec = stageKey === 'crop_plot_tilled' ? tilledRec : this.getFarmlandPixels(stageKey);
      if (!tilledRec || !srcRec || tilledRec.w !== srcRec.w || tilledRec.h !== srcRec.h) {
        return this.getMip(stageKey, targetWidthPx) ?? this.get(stageKey);
      }

      const w = tilledRec.w;
      const h = tilledRec.h;
      const tilled = tilledRec.data;
      const src = srcRec.data;
      const hasSprouts = stageKey === 'crop_plot_sprouts';
      const isPlanterGarden = stageKey === 'burrow_pumpkin_gnomes' || stageKey === 'burrow_flower_garden';
      const isFlowerGarden = stageKey === 'burrow_flower_garden';
      const isRanchFence = stageKey === 'burrow_chicken_coop' || stageKey === 'burrow_animal_pasture';
      const isPasture = stageKey === 'burrow_animal_pasture';
      const frameData = isRanchFence ? src : tilled;

      const nw0 = (mask12 & (1 << 0)) !== 0;
      const nw1 = (mask12 & (1 << 1)) !== 0;
      const ne0 = (mask12 & (1 << 2)) !== 0;
      const ne1 = (mask12 & (1 << 3)) !== 0;
      const se0 = (mask12 & (1 << 4)) !== 0;
      const se1 = (mask12 & (1 << 5)) !== 0;
      const sw0 = (mask12 & (1 << 6)) !== 0;
      const sw1 = (mask12 & (1 << 7)) !== 0;
      const diagN = (mask12 & (1 << 8)) !== 0;
      const diagE = (mask12 & (1 << 9)) !== 0;
      const diagS = (mask12 & (1 << 10)) !== 0;
      const diagW = (mask12 & (1 << 11)) !== 0;

      const showN = (!nw0 && !ne0) || (nw0 && ne0 && !diagN);
      const showE = (!ne1 && !se0) || (ne1 && se0 && !diagE);
      const showS = (!se1 && !sw1) || (se1 && sw1 && !diagS);
      const showW = (!sw0 && !nw1) || (sw0 && nw1 && !diagW);
      const midNW = nw0 !== nw1;
      const midNE = ne0 !== ne1;
      const midSE = se0 !== se1;
      const midSW = sw0 !== sw1;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = w;
      outCanvas.height = h;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) {
        return this.getMip(stageKey, targetWidthPx) ?? this.get(stageKey);
      }
      const outImg = outCtx.createImageData(w, h);
      const dst = outImg.data;

      const sxNorm = 372 / w;
      const syNorm = 223 / h;
      const invSxNorm = w / 372;
      const invSyNorm = h / 223;

      const clamp01 = (v: number): number => (v <= 0 ? 0 : v >= 1 ? 1 : v);
      const posMod = (a: number, m: number): number => {
        const r = a % m;
        return r < 0 ? r + m : r;
      };

      let sR = 0;
      let sG = 0;
      let sB = 0;
      let sA = 0;
      const sampleFrom = (buf: Uint8ClampedArray, x372: number, y223: number): void => {
        let fx = x372 * invSxNorm;
        let fy = y223 * invSyNorm;
        if (fx < 0) fx = 0;
        else if (fx > w - 1.001) fx = w - 1.001;
        if (fy < 0) fy = 0;
        else if (fy > h - 1.001) fy = h - 1.001;
        const x0 = fx | 0;
        const y0 = fy | 0;
        const x1 = x0 + 1 < w ? x0 + 1 : w - 1;
        const y1 = y0 + 1 < h ? y0 + 1 : h - 1;
        const tx = fx - x0;
        const ty = fy - y0;
        const omt = 1 - tx;
        const omy = 1 - ty;
        const i00 = (y0 * w + x0) * 4;
        const i10 = (y0 * w + x1) * 4;
        const i01 = (y1 * w + x0) * 4;
        const i11 = (y1 * w + x1) * 4;
        sR = (buf[i00] * omt + buf[i10] * tx) * omy + (buf[i01] * omt + buf[i11] * tx) * ty;
        sG = (buf[i00 + 1] * omt + buf[i10 + 1] * tx) * omy + (buf[i01 + 1] * omt + buf[i11 + 1] * tx) * ty;
        sB = (buf[i00 + 2] * omt + buf[i10 + 2] * tx) * omy + (buf[i01 + 2] * omt + buf[i11 + 2] * tx) * ty;
        sA = (buf[i00 + 3] * omt + buf[i10 + 3] * tx) * omy + (buf[i01 + 3] * omt + buf[i11 + 3] * tx) * ty;
      };

      const mirrorMid = (t: number, ext0: boolean, ext1: boolean): number => {
        if (ext0 && t < 0.3) return 0.3 + posMod(0.3 - t, 0.4);
        if (ext1 && t > 0.7) return 0.7 - posMod(t - 0.7, 0.4);
        return t;
      };

      const halfSpanMask = (
        t: number,
        c0: boolean,
        c1: boolean,
        extStart: boolean,
        extEnd: boolean
      ): number => {
        const lo0 = extStart ? -0.005 : -0.08;
        const hi1 = extEnd ? 1.005 : 1.08;
        if (!c0 && !c1) {
          return clamp01((t - lo0) / 0.006) * clamp01((hi1 - t) / 0.006);
        }
        if (!c0 && c1) {
          return clamp01((t - lo0) / 0.006) * clamp01((0.505 - t) / 0.006);
        }
        if (c0 && !c1) {
          return clamp01((t - 0.495) / 0.006) * clamp01((hi1 - t) / 0.006);
        }
        return 0;
      };

      const yCenter = isRanchFence ? 125.5 : 114;
      const padClosed = isRanchFence ? 0.022 : 0.032;
      const padOpen = isRanchFence ? -0.018 : -0.016;
      const nwNeInnerBase = isRanchFence ? 37 : 35.5;
      const seSwTopBase = isRanchFence ? 87 : 99.5;

      for (let py = 0; py < h; py++) {
        const yy = py * syNorm;
        const d2 = (yy - yCenter) / 93;
        for (let px = 0; px < w; px++) {
          const xx = px * sxNorm;
          const d1 = (xx - 186) / 186;
          const u = 0.5 * (d1 + d2 + 1);
          const v = 0.5 * (d2 + 1 - d1);

          const uLo = v < 0.5 ? (nw0 ? padOpen : padClosed) : nw1 ? padOpen : padClosed;
          const uHi = v < 0.5 ? (se0 ? 1 - padOpen : 1 - padClosed) : se1 ? 1 - padOpen : 1 - padClosed;
          const vLo = u < 0.5 ? (ne0 ? padOpen : padClosed) : ne1 ? padOpen : padClosed;
          const vHi = u < 0.5 ? (sw0 ? 1 - padOpen : 1 - padClosed) : sw1 ? 1 - padOpen : 1 - padClosed;

          let oR = 0;
          let oG = 0;
          let oB = 0;
          let oA =
            clamp01((u - uLo) / 0.008) *
            clamp01((uHi - u) / 0.008) *
            clamp01((v - vLo) / 0.008) *
            clamp01((vHi - v) / 0.008);

          if (oA > 0) {
            if (isRanchFence) {
              const n1 = Math.sin(u * 12.566 + v * 6.283) * 0.5 + Math.cos((u - v) * 18.85) * 0.5;
              const n2 = Math.sin(u * 31.416 - v * 25.132) * 0.5;
              if (isPasture) {
                // Seamless sunlit emerald-clover pasture ground (#72bc43) + water trough & clover tufts
                const sunGrad = (1 - 0.5 * (u + v)) * 6;
                oR = 114 + n1 * 5 + n2 * 2.5 + sunGrad;
                oG = 188 + n1 * 6.5 + n2 * 3 + sunGrad * 0.9;
                oB = 67 + n1 * 4 + n2 * 2 + sunGrad * 0.3;
              } else {
                // Seamless sunlit golden-sandy chicken yard ground (#f6c773) + crisp interior art
                oR = 246 + n1 * 4.5 + n2 * 2;
                oG = 199 + n1 * 5.5 + n2 * 2;
                oB = 115 + n1 * 5 + n2 * 2;
              }

              const tNw = (186 - xx) / 186;
              const tNe = (xx - 186) / 186;
              const tSe = (372 - xx) / 186;
              const tSw = xx / 186;
              const yBackRailBot = xx >= 186 ? 39.5 + tNe * 93 : 39.5 + tNw * 93;
              const yFrontRailTop = xx >= 186 ? 86.5 + tSe * 93 : 86.5 + tSw * 93;
              const backClear = clamp01((yy - yBackRailBot) / 6.5);
              const frontClear = clamp01((yFrontRailTop - yy) / 3);

              const inNPost = 1 - clamp01(Math.max(Math.abs(xx - 186) - 13, yy - 45) / 2.5);
              const inSPost = 1 - clamp01(Math.max(Math.abs(xx - 186) - 13, 167 - yy) / 2.5);
              const inWPost = 1 - clamp01((xx - 22) / 2.5);
              const inEPost = 1 - clamp01((350 - xx) / 2.5);
              const postClear = (1 - inNPost) * (1 - inSPost) * (1 - inWPost) * (1 - inEPost);

              const mInt = backClear * frontClear * postClear;
              if (mInt > 0) {
                const pIdx = (py * w + px) * 4;
                const spA = (src[pIdx + 3] / 255) * mInt;
                oR = oR * (1 - spA) + src[pIdx] * spA;
                oG = oG * (1 - spA) + src[pIdx + 1] * spA;
                oB = oB * (1 - spA) + src[pIdx + 2] * spA;
              }
            } else if (isPlanterGarden) {
              // Seamless crumbly dark garden humus across shared borders + crisp flowers / pumpkins & cabbages
              const tv = Math.abs(posMod(v * 2, 2) - 1);
              const vSoil = 0.29 + tv * 0.42;
              const uw = posMod(u, 1);
              const uA = 0.155 + uw * 0.7;
              sampleFrom(tilled, 186 + (uA - vSoil) * 186, 114 + (uA + vSoil - 1) * 93);
              oR = 95 + (sR - 100) * 0.35;
              oG = 56 + (sG - 55) * 0.35;
              oB = 31 + (sB - 30) * 0.35;

              const inset = isFlowerGarden ? 0.072 : 0.088;
              const mu = Math.min(u - inset, 1 - inset - u);
              const mv = Math.min(v - inset, 1 - inset - v);
              const mInt = clamp01(Math.min(mu, mv) / (isFlowerGarden ? 0.032 : 0.045));
              if (mInt > 0) {
                const pIdx = (py * w + px) * 4;
                const spA = (src[pIdx + 3] / 255) * mInt;
                oR = oR * (1 - spA) + src[pIdx] * spA;
                oG = oG * (1 - spA) + src[pIdx + 1] * spA;
                oB = oB * (1 - spA) + src[pIdx + 2] * spA;
              }
            } else {
              const tv = Math.abs(posMod(v * 2, 2) - 1);
              const vSoil = 0.29 + tv * 0.42;
              const uw = posMod(u, 1);
              const uA = 0.155 + uw * 0.7;
              sampleFrom(tilled, 186 + (uA - vSoil) * 186, 114 + (uA + vSoil - 1) * 93);
              oR = sR;
              oG = sG;
              oB = sB;

              const distSeam = uw < 1 - uw ? uw : 1 - uw;
              if (distSeam < 0.07) {
                const sw = 1 - distSeam / 0.07;
                const seamW = sw * sw;
                sampleFrom(tilled, 186 + (0.155 - vSoil) * 186, 114 + (0.155 + vSoil - 1) * 93);
                const loR = sR;
                const loG = sG;
                const loB = sB;
                sampleFrom(tilled, 186 + (0.855 - vSoil) * 186, 114 + (0.855 + vSoil - 1) * 93);
                oR = oR * (1 - seamW) + 0.5 * (loR + sR) * seamW;
                oG = oG * (1 - seamW) + 0.5 * (loG + sG) * seamW;
                oB = oB * (1 - seamW) + 0.5 * (loB + sB) * seamW;
              }

              if (hasSprouts && u > 0.12 && u < 0.9 && v > 0.12 && v < 0.9) {
                const pIdx = (py * w + px) * 4;
                const dR = Math.abs(src[pIdx] - tilled[pIdx]);
                const dG = Math.abs(src[pIdx + 1] - tilled[pIdx + 1]);
                const dB = Math.abs(src[pIdx + 2] - tilled[pIdx + 2]);
                const maxDiff = dR > dG ? (dR > dB ? dR : dB) : dG > dB ? dG : dB;
                if (maxDiff > 4) {
                  const spM = clamp01((maxDiff - 4) / 10);
                  oR = oR * (1 - spM) + src[pIdx] * spM;
                  oG = oG * (1 - spM) + src[pIdx + 1] * spM;
                  oB = oB * (1 - spM) + src[pIdx + 2] * spM;
                }
              }
            }
          }

          const blendOver = (mask: number): void => {
            if (mask <= 0) return;
            const la = (sA / 255) * mask;
            if (la <= 0) return;
            const oa = la + oA * (1 - la);
            if (oa > 1e-5) {
              const invOa = 1 / oa;
              oR = (sR * la + oR * oA * (1 - la)) * invOa;
              oG = (sG * la + oG * oA * (1 - la)) * invOa;
              oB = (sB * la + oB * oA * (1 - la)) * invOa;
            }
            oA = oa;
          };

          // 2. NW plank / double-rail
          if (!(nw0 && nw1) && xx <= 202) {
            const t = (186 - xx) / 186;
            const yInner = nwNeInnerBase + t * 93;
            if (yy < yInner + 2) {
              const m = clamp01((yInner - yy) * 0.5) * halfSpanMask(t, nw0, nw1, ne0, sw0);
              if (m > 0) {
                const dt = mirrorMid(t, ne0 || nw0, sw0 || nw1) - t;
                sampleFrom(frameData, xx - dt * 186, yy + dt * 93);
                blendOver(m);
              }
            }
          }

          // 3. NE plank / double-rail
          if (!(ne0 && ne1) && xx >= 170) {
            const t = (xx - 186) / 186;
            const yInner = nwNeInnerBase + t * 93;
            if (yy < yInner + 2) {
              const m = clamp01((yInner - yy) * 0.5) * halfSpanMask(t, ne0, ne1, nw0, se0);
              if (m > 0) {
                const dt = mirrorMid(t, nw0 || ne0, se0 || ne1) - t;
                sampleFrom(frameData, xx + dt * 186, yy + dt * 93);
                blendOver(m);
              }
            }
          }

          // 4. SE plank / double-rail
          if (!(se0 && se1) && xx >= 170) {
            const t = (372 - xx) / 186;
            const yTop = seSwTopBase + t * 93;
            if (yy > yTop - 2) {
              const m = clamp01((yy - yTop) * 0.5) * halfSpanMask(t, se0, se1, ne1, sw1);
              if (m > 0) {
                const dt = mirrorMid(t, ne1 || se0, sw1 || se1) - t;
                sampleFrom(frameData, xx - dt * 186, yy + dt * 93);
                blendOver(m);
              }
            }
          }

          // 5. SW plank / double-rail
          if (!(sw0 && sw1) && xx <= 202) {
            const t = xx / 186;
            const yTop = seSwTopBase + t * 93;
            if (yy > yTop - 2) {
              const m = clamp01((yy - yTop) * 0.5) * halfSpanMask(t, sw0, sw1, nw1, se1);
              if (m > 0) {
                const dt = mirrorMid(t, nw1 || sw0, se1 || sw1) - t;
                sampleFrom(frameData, xx + dt * 186, yy + dt * 93);
                blendOver(m);
              }
            }
          }

          // 6. Corner & T-junction oak stakes
          const stampStake = (
            srcCx: number,
            srcCy: number,
            dstCx: number,
            dstCy: number,
            rx: number,
            ry: number
          ): void => {
            const dx = Math.abs(xx - dstCx) / rx;
            const dy = Math.abs(yy - dstCy) / ry;
            const mx = dx > dy ? dx : dy;
            if (mx >= 1) return;
            const m = clamp01((1 - mx) * 5);
            sampleFrom(frameData, xx - (dstCx - srcCx), yy - (dstCy - srcCy));
            blendOver(m);
          };

          if (isRanchFence) {
            if (showN) stampStake(186, 22, 186, 22, 14, 23);
            if (midNW) stampStake(11, 106, 93, 65, 12, 23);
            if (midNE) stampStake(361, 106, 279, 65, 12, 23);
            if (showW) stampStake(11, 106, 11, 106, 13, 24);
            if (showE) stampStake(361, 106, 361, 106, 13, 24);
            if (midSE) stampStake(186, 195, 279, 148.5, 13, 27);
            if (midSW) stampStake(186, 195, 93, 148.5, 13, 27);
            if (showS) stampStake(186, 195, 186, 195, 14, 27);
          } else {
            if (showN) stampStake(186, 20, 186, 20, 24, 22);
            if (midNW) stampStake(17, 111, 93, 66, 18, 21);
            if (midNE) stampStake(355, 111, 279, 66, 18, 21);
            if (showW) stampStake(17, 111, 17, 111, 20, 23);
            if (showE) stampStake(355, 111, 355, 111, 20, 23);
            if (midSE) stampStake(186, 202, 279, 156, 20, 22);
            if (midSW) stampStake(186, 202, 93, 156, 20, 22);
            if (showS) stampStake(186, 202, 186, 202, 24, 23);
          }

          const outIdx = (py * w + px) * 4;
          dst[outIdx] = Math.round(oR);
          dst[outIdx + 1] = Math.round(oG);
          dst[outIdx + 2] = Math.round(oB);
          dst[outIdx + 3] = Math.round(oA * 255);
        }
      }

      outCtx.putImageData(outImg, 0, 0);

      let finalBuilt: SpriteSource = outCanvas;
      if (this.toonEnabled) {
        try {
          const tooned = toonSprite(outCanvas, DEFAULT_TOON, false);
          if (tooned) finalBuilt = tooned;
        } catch {
          // Keep untooned canvas on fallback
        }
      }

      if (this.connectedFarmlandCache.size >= MAX_CONNECTED_FARMLAND_CACHE) {
        const oldestKey = this.connectedFarmlandCache.keys().next().value;
        if (oldestKey !== undefined) {
          const evicted = this.connectedFarmlandCache.get(oldestKey);
          if (evicted instanceof HTMLCanvasElement) {
            evicted.width = 1;
            evicted.height = 1;
          }
          const evictedMip = this.connectedFarmlandMips.get(oldestKey);
          if (evictedMip) {
            evictedMip.width = 1;
            evictedMip.height = 1;
          }
          this.connectedFarmlandCache.delete(oldestKey);
          this.connectedFarmlandMips.delete(oldestKey);
        }
      }
      this.connectedFarmlandCache.set(cacheKey, finalBuilt);
      built = finalBuilt;

      if (w >= 200 && h >= 200) {
        const mw = Math.max(64, Math.round(w * 0.5));
        const mh = Math.max(64, Math.round(h * 0.5));
        const mip = document.createElement('canvas');
        mip.width = mw;
        mip.height = mh;
        const mctx = mip.getContext('2d');
        if (mctx) {
          mctx.imageSmoothingEnabled = true;
          mctx.imageSmoothingQuality = 'high';
          mctx.drawImage(finalBuilt, 0, 0, mw, mh);
          this.connectedFarmlandMips.set(cacheKey, mip);
        }
      }
    }

    if (typeof targetWidthPx === 'number') {
      const mip = this.connectedFarmlandMips.get(cacheKey);
      if (mip && targetWidthPx <= mip.width * 1.15) {
        return mip;
      }
    }
    return built;
  }
}

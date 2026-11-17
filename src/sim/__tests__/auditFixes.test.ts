import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CATALOG, getCatalogItem } from '../../data/catalog';
import { GRID_SIZE } from '../../data/zones';
import { MagicalAudio } from '../../engine/audio';
import { shouldGroundBlend } from '../../engine/groundBlend';
import {
  CATALOG_PROP_SPRITE_PATHS,
  resolveCatalogPropSpriteKey,
  SPRITE_KEYS,
} from '../../engine/spriteLoader';
import { ParkSimulation } from '../simulation';
import { worldGetStashedDecorCount } from '../simulationWorld';
import { yuleAssetPrice, yuleCollectionProgress } from '../yuleEvent';

type MinimalNodeFs = {
  readFileSync: {
    (p: string, enc: string): string;
    (p: string): Uint8Array;
  };
  existsSync: (p: string) => boolean;
  readdirSync: (p: string) => string[];
  statSync: (p: string) => { size: number };
};

async function loadNodeFsAndPath(): Promise<{
  fs: MinimalNodeFs;
  path: { join: (...parts: string[]) => string; resolve: (...parts: string[]) => string };
  rootDir: string;
}> {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as unknown as MinimalNodeFs;
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    join: (...parts: string[]) => string;
    resolve: (...parts: string[]) => string;
  };
  const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
  return { fs, path, rootDir: path.resolve(proc.cwd()) };
}

const storageMap = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
});

function createMockAudio(): MagicalAudio {
  return {
    enabled: true,
    bgmEnabled: true,
    playTone: vi.fn(),
    playSfx: vi.fn(),
    playClick: vi.fn(),
    playSpell: vi.fn(),
    playPlace: vi.fn(),
    playHarvestBubble: vi.fn(),
    playBuildComplete: vi.fn(),
    playLevelUp: vi.fn(),
    playCheekyAlert: vi.fn(),
    playOwlHoot: vi.fn(),
    playCardFound: vi.fn(),
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

function findFreeSpot(
  sim: ParkSimulation,
  itemId: string,
  rot: 0 | 1 | 2 | 3 = 0
): { gx: number; gy: number } {
  const item = getCatalogItem(itemId)!;
  const { bw, bh } = sim.getBuildingFootprint(item, rot);
  for (let gy = 0; gy <= GRID_SIZE - bh; gy++) {
    for (let gx = 0; gx <= GRID_SIZE - bw; gx++) {
      if (sim.canPlaceItem(item, gx, gy, rot).ok) {
        return { gx, gy };
      }
    }
  }
  throw new Error(`No free spot found for ${itemId}`);
}

describe('Audit Fixes — Hosting CSP, SW Dev Port, 2.5D Props, Stashed Decor 0G & Yule', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  // HPVN: no hosting CSP files, service worker or dev cache-bypass script ship here (the HPVN server sets the CSP
  // and serves /game/trang-trai-hang-soc/), so upstream's two hosting checks are left out; the sprite count stays.
  it('giữ nguyên 288 SPRITE_KEYS', () => {
    expect(SPRITE_KEYS.length).toBe(288);
  });

  it('resolveCatalogPropSpriteKey ánh xạ đủ 3 prop không có spriteKey tới ảnh tồn tại trên đĩa và bật groundBlend', async () => {
    const { fs, path, rootDir } = await loadNodeFsAndPath();
    expect(resolveCatalogPropSpriteKey('marble_bench', undefined)).toBe('catalog_marble_bench');
    expect(resolveCatalogPropSpriteKey('floating_candles_post', undefined)).toBe(
      'catalog_floating_candles_post'
    );
    expect(resolveCatalogPropSpriteKey('patronus_ward_lantern', undefined)).toBe(
      'catalog_patronus_ward_lantern'
    );
    expect(resolveCatalogPropSpriteKey('burrow_house_canon', 'burrow_house_canon')).toBe(
      'burrow_house_canon'
    );

    for (const [key, relPath] of Object.entries(CATALOG_PROP_SPRITE_PATHS)) {
      expect(shouldGroundBlend(key)).toBe(true);
      const absAsset = path.join(rootDir, 'public', relPath.replace(/^\/game\/trang-trai-hang-soc\//, '')); // HPVN base path, .webp
      expect(fs.existsSync(absAsset)).toBe(true);
    }
  });

  it('cất trang trí đặt lại miễn phí ở 0G, giữ nguyên cấp sao và đồng bộ Undo/Redo + restoreAllStashedDecor', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.sandboxMode = false;
    sim.state.level = 15;
    sim.state.galleons = 2500;

    const bench = getCatalogItem('marble_bench')!;
    const spot1 = findFreeSpot(sim, 'marble_bench');
    expect(sim.placeItem(bench, spot1.gx, spot1.gy, 0)).toBe(true);
    const placed1 = sim.state.buildings.at(-1)!;
    placed1.stars = 3;
    placed1.constructEndsAt = Date.now() - 1000;

    const spot2 = findFreeSpot(sim, 'marble_bench');
    expect(sim.placeItem(bench, spot2.gx, spot2.gy, 0)).toBe(true);
    const placed2 = sim.state.buildings.at(-1)!;
    placed2.stars = 2;
    placed2.constructEndsAt = Date.now() - 1000;

    const stashRes = sim.stashAllDecorItems();
    expect(stashRes.ok).toBe(true);
    expect(stashRes.count).toBeGreaterThanOrEqual(2);
    expect(worldGetStashedDecorCount(sim, bench)).toBe(2);

    // Kéo tiền & cấp xuống tối thiểu vẫn phải đặt lại được 0G từ kho cất!
    sim.state.galleons = 0;
    sim.state.level = 1;
    expect(sim.isCatalogItemUnlocked(bench)).toBe(true);

    const freeSpot = findFreeSpot(sim, 'marble_bench');
    expect(sim.canPlaceItem(bench, freeSpot.gx, freeSpot.gy, 0).ok).toBe(true);

    sim.beginBuildStroke();
    expect(sim.placeItem(bench, freeSpot.gx, freeSpot.gy, 0)).toBe(true);
    sim.commitBuildStroke();

    expect(sim.state.galleons).toBe(0);
    expect(worldGetStashedDecorCount(sim, bench)).toBe(1);
    const placedFromStash = sim.state.buildings.find(
      (b) => b.itemId === 'marble_bench' && b.gx === freeSpot.gx && b.gy === freeSpot.gy
    )!;
    expect(placedFromStash).toBeDefined();
    expect(placedFromStash.stars).toBe(2);
    expect(placedFromStash.constructEndsAt).toBeLessThanOrEqual(placedFromStash.placedAt + 10);

    // Undo phải hoàn trả lại đúng số lượng & sao trong kho cất
    expect(sim.undoBuild()).toBe(true);
    expect(worldGetStashedDecorCount(sim, bench)).toBe(2);
    expect(
      sim.state.buildings.find((b) => b.gx === freeSpot.gx && b.gy === freeSpot.gy)
    ).toBeUndefined();

    // Redo phải tiêu thụ lại đúng chuẩn
    expect(sim.redoBuild()).toBe(true);
    expect(worldGetStashedDecorCount(sim, bench)).toBe(1);

    // Bày lại toàn bộ phần còn lại cũng phải thành công khi galleons === 0 và level === 1
    const restoreRes = sim.restoreAllStashedDecor();
    expect(restoreRes.ok).toBe(true);
    expect(restoreRes.placed).toBeGreaterThanOrEqual(1);
    expect(worldGetStashedDecorCount(sim, bench)).toBe(0);
    expect(sim.state.galleons).toBe(0);
  });

  it('purchaseYuleAsset an toàn khi yuleEvent undefined, yuleCollectionProgress đếm distinct IDs và toggleYuleVisualTheme đảo ở lần bấm đầu', () => {
    const sim = new ParkSimulation(createMockAudio());
    const yuleItems = CATALOG.filter((it) => it.id.startsWith('yule_') && it.yuleCollection);
    expect(yuleItems.length).toBeGreaterThanOrEqual(3);

    const sampleCol = yuleItems[0].yuleCollection!;
    const sameColItems = yuleItems.filter((it) => it.yuleCollection === sampleCol);
    expect(sameColItems.length).toBeGreaterThanOrEqual(3);

    // 1. Safe-guard khi state.yuleEvent bị thiếu trên save cũ
    (sim.state as { yuleEvent?: unknown }).yuleEvent = undefined;
    sim.state.sandboxMode = false;
    const price = yuleAssetPrice(sameColItems[0].id);
    sim.state.galleons = price + 50;
    const buyRes = sim.purchaseYuleAsset(sameColItems[0].id);
    expect(buyRes.ok).toBe(true);
    expect(sim.state.yuleEvent?.purchasedAssetIds).toContain(sameColItems[0].id);
    expect(sim.state.galleons).toBe(50);

    // 2. Đếm distinct IDs qua unlocked, stash (nhiều bản sao vẫn tính 1) và placed buildings
    sim.state.stashedDecorInventory = {
      [sameColItems[1].id]: 4,
    };
    const spot = findFreeSpot(sim, 'marble_bench');
    sim.state.buildings.push({
      uid: 'yule_test_placed',
      itemId: sameColItems[2].id,
      gx: spot.gx,
      gy: spot.gy,
      rotation: 0,
      stars: 1,
      placedAt: Date.now(),
      constructEndsAt: Date.now(),
      lastTickAt: Date.now(),
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    });
    const progress = yuleCollectionProgress(sim.state, sampleCol);
    expect(progress.total).toBe(sameColItems.length);
    expect(progress.owned).toBe(3);

    // 3. toggleYuleVisualTheme từ trạng thái 'auto' đang bật mùa đông -> tắt ngay cú click 1
    sim.state.settings.yuleThemeMode = 'auto';
    sim.state.settings.activeFestival = 'auto';
    expect(sim.isWinterMainMapActive()).toBe(true);
    expect(sim.toggleYuleVisualTheme(new Date(2026, 6, 15))).toBe(false);
    expect(sim.state.settings.yuleThemeMode).toBe('off');
    expect(sim.toggleYuleVisualTheme(new Date(2026, 6, 15))).toBe(true);
    expect(sim.state.settings.yuleThemeMode).toBe('on');
  });

  it('không còn CSS var(--muted) chưa khai báo và đã có rule ẩn YouTube BGM ở Photo Mode', async () => {
    const { fs, path, rootDir } = await loadNodeFsAndPath();
    const css = fs.readFileSync(path.join(rootDir, 'src/styles/main.css'), 'utf8');
    const questsUi = fs.readFileSync(
      path.join(rootDir, 'src/ui/hudQuestsAndSettings.ts'),
      'utf8'
    );
    expect(questsUi).not.toContain('var(--muted)');
    expect(css).toContain("body[data-photo-mode='true'] .yt-bgm-mini-dock");
  });

  it('nén ảnh WebApp: catalog props WebP (HPVN) và bảo vệ public/sprites theo AGENTS.md', async () => {
    const { fs, path, rootDir } = await loadNodeFsAndPath();
    const catalogDir = path.join(rootDir, 'public/paintings/catalog');
    // HPVN: the lock's removePaths drops upstream PNG/JPG (and public/icons); catalog props ship as WebP ≤ 150 KB.
    const catalogWebps = fs
      .readdirSync(catalogDir)
      .filter((name: string) => name.endsWith('.webp'))
      .sort();
    expect(catalogWebps.length).toBe(6);

    for (const name of catalogWebps) {
      const buf = fs.readFileSync(path.join(catalogDir, name));
      expect(String.fromCharCode(...buf.subarray(0, 4))).toBe('RIFF');
      expect(String.fromCharCode(...buf.subarray(8, 12))).toBe('WEBP');
      expect(buf.byteLength).toBeLessThan(150 * 1024);
    }

    const compressPy = fs.readFileSync(path.join(rootDir, 'tools/compress-images.py'), 'utf8');
    expect(compressPy).toContain("target_subs = ['paintings', 'icons']");
    expect(compressPy).toContain("if include_sprites:");
  });
});

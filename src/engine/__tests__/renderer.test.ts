import { describe, expect, it, vi } from 'vitest';
import { FARM_CROPS, getCatalogItem, getFarmItemIconSrc } from '../../data/catalog';
import { GRID_SIZE } from '../../data/zones';
import { PlacedBuilding } from '../../types/game';
import { auditIos16SourceCompatibility } from '../../ui/hpvnBridge';
import { Camera, rotateGridRect, worldIso } from '../isometric';
import {
  computeVisibleRotatedTileWindow,
  ensureCanvasRoundRectPolyfill,
} from '../rendererShared';
import { SPRITE_KEYS } from '../spriteLoader';
import {
  computeWeatherParticleBudget,
  IsometricRenderer,
  JuiceFX,
  MAX_WEATHER_PARTICLES,
  resolveBuildingInWorldTimerInfo,
} from '../renderer';

describe('renderer.ts - On-Device Performance & Weather Particles Budget', () => {
  it('Hằng số MAX_WEATHER_PARTICLES bằng 400', () => {
    expect(MAX_WEATHER_PARTICLES).toBe(400);
  });

  it('Màn hình tiêu chuẩn (DPR <= 1.5, width <= 1500) dùng đủ 100% ngân sách 400 hạt', () => {
    const budget = computeWeatherParticleBudget(1.0, 1280);
    expect(budget).toBe(400);

    const budgetLowDpr = computeWeatherParticleBudget(1.25, 1024);
    expect(budgetLowDpr).toBe(400);
  });

  it('Màn hình Retina / High-DPR (> 1.5) tự động giảm mật độ ~35%', () => {
    const budgetRetina = computeWeatherParticleBudget(2.0, 1200);
    expect(budgetRetina).toBe(Math.round(400 * 0.65)); // 260
  });

  it('Màn hình khổ lớn (> 1500px) tự động giảm mật độ ~30%', () => {
    const budgetWide = computeWeatherParticleBudget(1.0, 1920);
    expect(budgetWide).toBe(Math.round(400 * 0.7)); // 280
  });

  it('Màn hình vừa Retina vừa khổ lớn (4K/Retina) kết hợp giảm mật độ để giữ 60fps', () => {
    const budget4k = computeWeatherParticleBudget(2.0, 2560);
    // 400 * 0.65 * 0.7 = 182
    expect(budget4k).toBe(Math.round(400 * 0.65 * 0.7));
    expect(budget4k).toBeGreaterThanOrEqual(30);
    expect(budget4k).toBeLessThanOrEqual(MAX_WEATHER_PARTICLES);
  });

  it('IsometricRenderer tích hợp JuiceFX và hỗ trợ notifyJuice (harvest, levelup, victory)', () => {
    expect(JuiceFX).toBeDefined();

    const mockCtx = {
      canvas: { width: 1200, height: 800 },
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    };
    const mockCanvas = {
      getContext: vi.fn(() => mockCtx),
      clientWidth: 1200,
      clientHeight: 800,
    } as unknown as HTMLCanvasElement;
    const mockSprites = {
      get: vi.fn(),
      getMip: vi.fn(),
      getRaw: vi.fn(),
    } as any;

    const renderer = new IsometricRenderer(mockCanvas, mockSprites);
    const juice = renderer.getJuiceFX();
    expect(juice).toBeInstanceOf(JuiceFX);

    // Kiểm tra gọi notifyJuice('harvest') KHÔNG rung màn hình (intensity === 0)
    renderer.notifyJuice('harvest', 200, 300);
    expect(juice.screenShake.intensity).toBe(0);
    expect(juice.getShakeOffset()).toEqual({ x: 0, y: 0 });

    renderer.triggerSquash('plot_test_1');
    expect(juice.screenShake.intensity).toBe(0);

    renderer.notifyJuice('levelup');
    expect(juice.flash.alpha).toBeGreaterThan(0);

    renderer.notifyJuice('victory');
    expect(juice.flash.alpha).toBeGreaterThan(0);
  });

  it('Toàn bộ 22 loại cây trồng & hoa sử dụng sprite 2.5D riêng biệt ui_icon_crop_* (không còn SVG phẳng)', () => {
    const spriteKeySet = new Set<string>(SPRITE_KEYS);
    const cropEntries = Object.values(FARM_CROPS);
    expect(cropEntries).toHaveLength(22);

    const uniqueIconKeys = new Set<string>();
    for (const crop of cropEntries) {
      expect(crop.iconKey).toBe(`ui_icon_crop_${crop.id}`);
      expect(spriteKeySet.has(crop.iconKey)).toBe(true);
      uniqueIconKeys.add(crop.iconKey);

      const src = getFarmItemIconSrc(crop.id);
      expect(src).toBe(`/sprites/ui_icon_crop_${crop.id}.png`);
      expect(src.startsWith('data:')).toBe(false);
    }
    expect(uniqueIconKeys.size).toBe(22);
  });

  it('resolveBuildingInWorldTimerInfo hiển thị đúng đồng hồ đếm ngược xây dựng, tưới cây, chăn thả, lò bánh & chu kỳ sản xuất', () => {
    const now = 1_700_000_000_000;
    const mkBase = (itemId: string): PlacedBuilding => ({
      uid: `test_${itemId}`,
      itemId,
      gx: 10,
      gy: 10,
      rotation: 0,
      stars: 1,
      placedAt: now - 10_000,
      constructEndsAt: now - 5_000,
      lastTickAt: now - 8_000,
      storedGalleons: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    });

    // 1. Đang xây dựng thực tế (bao gồm công trình dài nhiều ngày & tiến độ nhảy vọt sau khi giảm giờ xây)
    const bakeryItem = getCatalogItem('molly_apple_bakery')!;
    const buildingBakery: PlacedBuilding = {
      ...mkBase('molly_apple_bakery'),
      placedAt: now - 4_000,
      constructEndsAt: now + 8_000,
    };
    const buildInfo = resolveBuildingInWorldTimerInfo(buildingBakery, bakeryItem, now);
    expect(buildInfo?.kind).toBe('construction');
    expect(buildInfo?.remainSec).toBe(8);
    expect(buildInfo?.label).toContain('8s');

    const dragonLairItem = getCatalogItem('dragon_lair')!;
    const buildingDragonLair: PlacedBuilding = {
      ...mkBase('dragon_lair'),
      placedAt: now,
      constructEndsAt: now + 259_200_000, // 3 ngày tối đa
    };
    const multiDayInfo = resolveBuildingInWorldTimerInfo(buildingDragonLair, dragonLairItem, now);
    expect(multiDayInfo?.kind).toBe('construction');
    expect(multiDayInfo?.fallbackEmoji).toBe('🥚');
    expect(multiDayInfo?.label).toBe('3ng 00g 00p (3%)');

    const shavedDragonLair: PlacedBuilding = {
      ...buildingDragonLair,
      constructEndsAt: now + 129_600_000, // Còn 1.5 ngày sau khi chơi Minigame giảm 1.5 ngày
      buildReducedSec: 129_600,
    };
    const shavedInfo = resolveBuildingInWorldTimerInfo(shavedDragonLair, dragonLairItem, now);
    expect(shavedInfo?.label).toBe('1ng 12g 00p (50%)');
    expect(shavedInfo?.progress).toBeCloseTo(0.5, 2);

    // 2. Thửa ruộng mới gieo chưa tưới -> nút 1 chạm water_crop + đếm ngược
    const plotItem = getCatalogItem('farmland_plot')!;
    const unwateredPlot: PlacedBuilding = {
      ...mkBase('farmland_plot'),
      cropId: 'english_rose',
      cropPlantedAt: now - 10_000,
      cropReadyAt: now + 32_000,
      cropWateredBoost: false,
    };
    const waterInfo = resolveBuildingInWorldTimerInfo(unwateredPlot, plotItem, now);
    expect(waterInfo?.kind).toBe('water_crop');
    expect(waterInfo?.interactiveHotspotKind).toBe('water_crop');
    expect(waterInfo?.label).toBe('Tưới • 32s');

    // Sau khi tưới -> chuyển sang growing_crop đếm ngược tới lúc chín
    const wateredPlot: PlacedBuilding = { ...unwateredPlot, cropWateredBoost: true, cropReadyAt: now + 22_000 };
    const growInfo = resolveBuildingInWorldTimerInfo(wateredPlot, plotItem, now);
    expect(growInfo?.kind).toBe('growing_crop');
    expect(growInfo?.interactiveHotspotKind).toBeUndefined();
    expect(growInfo?.label).toBe('22s');
    expect(growInfo?.spriteKey).toBe('ui_icon_crop_english_rose');

    // Khi đã chín -> nhường chỗ cho bong bóng Liềm Vàng thu hoạch
    expect(
      resolveBuildingInWorldTimerInfo({ ...wateredPlot, cropReadyAt: now - 100 }, plotItem, now)
    ).toBeNull();

    // 3. Đồng cỏ chăn thả chưa cho ăn -> nút 1 chạm feed_pasture + đếm ngược
    const pastureItem = getCatalogItem('burrow_animal_pasture')!;
    const unfedPasture: PlacedBuilding = {
      ...mkBase('burrow_animal_pasture'),
      pastureAnimalId: 'daisy_cow',
      pastureStockedAt: now - 5_000,
      pastureReadyAt: now + 35_000,
      pastureFedBoost: false,
    };
    const feedInfo = resolveBuildingInWorldTimerInfo(unfedPasture, pastureItem, now);
    expect(feedInfo?.kind).toBe('feed_pasture');
    expect(feedInfo?.interactiveHotspotKind).toBe('feed_pasture');
    expect(feedInfo?.label).toBe('Cho ăn • 35s');

    // 4. Lò bánh đang chế biến hàng đợi 2 món -> hiện đếm ngược + ×2
    const bakingBakery: PlacedBuilding = {
      ...mkBase('molly_apple_bakery'),
      workshopQueue: [
        { goodId: 'cinnamon_apple_pie', startedAt: now - 6_000, endsAt: now + 14_000 },
        { goodId: 'cinnamon_apple_pie', startedAt: now + 14_000, endsAt: now + 34_000 },
      ],
    };
    const craftInfo = resolveBuildingInWorldTimerInfo(bakingBakery, bakeryItem, now);
    expect(craftInfo?.kind).toBe('workshop_craft');
    expect(craftInfo?.remainSec).toBe(14);
    expect(craftInfo?.label).toBe('14s ×2');

    // 5. Công trình sản xuất định kỳ đang chờ ra bong bóng thu hoạch
    const coopItem = getCatalogItem('burrow_chicken_coop')!;
    const waitingCoop = mkBase('burrow_chicken_coop'); // cycleSec = 26, elapsed = 8s -> còn 18s
    const passiveInfo = resolveBuildingInWorldTimerInfo(waitingCoop, coopItem, now);
    expect(passiveInfo?.kind).toBe('passive_cycle');
    expect(passiveInfo?.remainSec).toBe(coopItem.cycleSec - 8);

    // Khi đã có bong bóng thu hoạch và chưa chọn -> ẩn timer chu kỳ phụ để nhường bong bóng
    const readyCoop: PlacedBuilding = { ...waitingCoop, storedGalleons: 42, readyBubbles: 1 };
    expect(resolveBuildingInWorldTimerInfo(readyCoop, coopItem, now, 'none', false)).toBeNull();
    expect(resolveBuildingInWorldTimerInfo(readyCoop, coopItem, now, 'none', true)?.kind).toBe(
      'passive_cycle'
    );
  });

  it('computeVisibleRotatedTileWindow cắt tỉa lưới 72x72 (5.184 ô) xuống vùng nhìn thấy thực tế ở cả 4 góc xoay camera', () => {
    const fullGridTiles = GRID_SIZE * GRID_SIZE; // 5184
    for (const viewRot of [0, 1, 2, 3] as const) {
      const { wx, wy } = worldIso(36, 36, viewRot);
      const camMobile: Camera = { x: wx, y: wy, zoom: 0.82, viewRot };
      const winMobile = computeVisibleRotatedTileWindow(camMobile, 390, 844, 48);
      const centerRot = rotateGridRect(36, 36, 1, 1, viewRot);
      const centerSum = centerRot.rx0 + centerRot.ry0;
      const centerDiff = centerRot.rx0 - centerRot.ry0;

      expect(centerSum).toBeGreaterThanOrEqual(winMobile.sumMin);
      expect(centerSum).toBeLessThanOrEqual(winMobile.sumMax);
      expect(centerDiff).toBeGreaterThanOrEqual(winMobile.diffMin);
      expect(centerDiff).toBeLessThanOrEqual(winMobile.diffMax);

      let visitedMobile = 0;
      for (let sum = winMobile.sumMin; sum <= winMobile.sumMax; sum++) {
        const rxLo = Math.max(0, Math.ceil((sum + winMobile.diffMin) * 0.5));
        const rxHi = Math.min(GRID_SIZE - 1, Math.floor((sum + winMobile.diffMax) * 0.5));
        for (let rx = rxLo; rx <= rxHi; rx++) {
          const ry = sum - rx;
          if (ry >= 0 && ry < GRID_SIZE) visitedMobile++;
        }
      }
      expect(visitedMobile).toBeGreaterThan(20);
      expect(visitedMobile).toBeLessThan(700); // ~13% so với 5.184 ô

      const camDesktop: Camera = { x: wx, y: wy, zoom: 0.82, viewRot };
      const winDesktop = computeVisibleRotatedTileWindow(camDesktop, 1280, 800, 120);
      let visitedDesktop = 0;
      for (let sum = winDesktop.sumMin; sum <= winDesktop.sumMax; sum++) {
        const rxLo = Math.max(0, Math.ceil((sum + winDesktop.diffMin) * 0.5));
        const rxHi = Math.min(GRID_SIZE - 1, Math.floor((sum + winDesktop.diffMax) * 0.5));
        for (let rx = rxLo; rx <= rxHi; rx++) {
          const ry = sum - rx;
          if (ry >= 0 && ry < GRID_SIZE) visitedDesktop++;
        }
      }
      expect(visitedDesktop).toBeLessThan(fullGridTiles * 0.45);
    }
  });

  it('ensureCanvasRoundRectPolyfill cung cấp fallback an toàn cho WebView thiếu CanvasRenderingContext2D.roundRect', () => {
    class MockLegacy2DContext {
      public calls: string[] = [];
      moveTo() {
        this.calls.push('moveTo');
      }
      arcTo() {
        this.calls.push('arcTo');
      }
      closePath() {
        this.calls.push('closePath');
      }
      rect() {
        this.calls.push('rect');
      }
    }
    const prevDesc = Object.getOwnPropertyDescriptor(globalThis, 'CanvasRenderingContext2D');
    try {
      Object.defineProperty(globalThis, 'CanvasRenderingContext2D', {
        value: MockLegacy2DContext,
        configurable: true,
        writable: true,
      });
      ensureCanvasRoundRectPolyfill();
      const inst = new MockLegacy2DContext() as unknown as CanvasRenderingContext2D & {
        calls: string[];
      };
      expect(typeof inst.roundRect).toBe('function');
      inst.roundRect(10, 20, 120, 60, [8]);
      expect(inst.calls).toEqual(['moveTo', 'arcTo', 'arcTo', 'arcTo', 'arcTo', 'closePath']);
    } finally {
      if (prevDesc) {
        Object.defineProperty(globalThis, 'CanvasRenderingContext2D', prevDesc);
      } else {
        delete (globalThis as Record<string, unknown>).CanvasRenderingContext2D;
      }
    }
  });

  it('Toàn bộ mã nguồn TS và main.css tuân thủ nghiêm ngặt tương thích iOS Safari 16.0+', async () => {
    const fsMod = (await import(/* @vite-ignore */ 'node:' + 'fs')) as {
      readdirSync: (
        p: string,
        o: { withFileTypes: true }
      ) => Array<{ name: string; isDirectory: () => boolean; isFile: () => boolean }>;
      readFileSync: (p: string, enc: string) => string;
    };
    const pathMod = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
      join: (...parts: string[]) => string;
      relative: (from: string, to: string) => string;
      resolve: (...parts: string[]) => string;
    };
    const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
    const srcDir = pathMod.resolve(proc.cwd(), 'src');

    const collectTs = (dir: string, acc: string[] = []): string[] => {
      for (const ent of fsMod.readdirSync(dir, { withFileTypes: true })) {
        if (ent.name === '__tests__') continue;
        const full = pathMod.join(dir, ent.name);
        if (ent.isDirectory()) collectTs(full, acc);
        else if (ent.isFile() && ent.name.endsWith('.ts')) acc.push(full);
      }
      return acc;
    };

    const tsFiles = collectTs(srcDir);
    expect(tsFiles.length).toBeGreaterThan(20);

    for (const file of tsFiles) {
      if (file.endsWith('hpvnBridge.ts')) continue;
      const code = fsMod.readFileSync(file, 'utf8');
      const res = auditIos16SourceCompatibility(code);
      expect(res.issues, `Lỗi tương thích iOS 16 trong ${pathMod.relative(srcDir, file)}`).toEqual(
        []
      );
    }

    const cssRaw = fsMod.readFileSync(pathMod.join(srcDir, 'styles/main.css'), 'utf8');
    const cssLines: string[] = cssRaw.split(/\r?\n/);

    // 1. Không còn nested @media bên trong selector rule (Safari 16.0–16.4 không hỗ trợ CSS Nesting)
    const nestedMediaLines = cssLines
      .map((line: string, idx: number) => ({ line, num: idx + 1 }))
      .filter((item: { line: string; num: number }) => /^  +@media\b/.test(item.line));
    expect(nestedMediaLines).toEqual([]);

    // 2. Mọi khai báo `safe center` (Safari 17.2+) đều phải có dòng fallback `center` đứng ngay trước cho iOS 16
    for (let i = 0; i < cssLines.length; i++) {
      const m = cssLines[i].match(/^\s*(align-items|align-content|justify-content):\s*safe center;/);
      if (m) {
        const prop = m[1];
        const prevLine = cssLines[i - 1] ?? '';
        expect(
          new RegExp(`^\\s*${prop}:\\s*center;`).test(prevLine),
          `Thiếu fallback '${prop}: center;' trước dòng ${i + 1} trong main.css`
        ).toBe(true);
      }
    }

    // 3. `.tutorial-coach-card.is-legacy-open` đứng độc lập, không bị gộp trực tiếp với `:popover-open` ngoài `:is()`
    const fullCss = cssLines.join('\n');
    expect(fullCss).toContain('.tutorial-coach-card.is-legacy-open {\n  display: flex;\n}');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { getCatalogItem, PASTURE_ANIMALS } from '../../data/catalog';
import { CameraDirector } from '../../engine/cameraDirector';
import { Camera, worldIso } from '../../engine/isometric';
import { SPRITE_KEYS } from '../../engine/spriteLoader';
import {
  getHarmonizedSpriteScale,
  getSpriteLightingProfile,
} from '../../render/spriteLightingProfile';
import { computeWorkshopKineticState } from '../../render/workshopKinetics';
import { ParkSimulation, setFarmStore } from '../simulation';
import { inspectorRenderInspector } from '../../ui/hudInspector';
import type { PlacedBuilding } from '../../types/game';

const mockAudio = new Proxy(
  {},
  { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }
) as never;

describe('Giai đoạn 1 — Chuẩn Hóa Casual 8.2+ & Embedded Web 9.5', () => {
  it('tất cả 15/15 thú đồng cỏ đều sở hữu 2 frame idle/action tách biệt nằm trong SPRITE_KEYS', () => {
    const spriteSet = new Set<string>(SPRITE_KEYS);
    const animals = Object.values(PASTURE_ANIMALS);
    expect(animals.length).toBe(15);
    for (const a of animals) {
      expect(spriteSet.has(a.spritePair[0])).toBe(true);
      expect(spriteSet.has(a.spritePair[1])).toBe(true);
      expect(a.spritePair[0]).not.toBe(a.spritePair[1]);
    }
  });

  it('computeWorkshopKineticState xuất nhịp nhào bột bảo toàn diện tích và gia tốc cánh quạt liên tục không nhảy góc', () => {
    const bakeryItem = getCatalogItem('molly_apple_bakery')!;
    const b: PlacedBuilding = {
      uid: 'b_ws_kin',
      itemId: 'molly_apple_bakery',
      gx: 14,
      gy: 18,
      rotation: 0,
      stars: 2,
      placedAt: 1000,
      constructEndsAt: 2000,
      lastTickAt: 2000,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    };

    const idle = computeWorkshopKineticState(bakeryItem, b, 5000, false);
    expect(idle.isActive).toBe(false);
    expect(idle.scaleX).toBe(1);
    expect(idle.scaleY).toBe(1);
    expect(idle.extraRotorRad).toBe(0);
    expect(idle.activeGoodIconKey).toBeNull();

    b.workshopQueue = [
      {
        goodId: 'cinnamon_apple_pie',
        startedAt: 10_000,
        endsAt: 40_000,
      },
    ];

    const atStart = computeWorkshopKineticState(bakeryItem, b, 10_000, false);
    expect(atStart.isActive).toBe(true);
    expect(atStart.extraRotorRad).toBe(0);
    expect(atStart.activeGoodIconKey).toBe('ui_icon_pie_ready');

    const mid = computeWorkshopKineticState(bakeryItem, b, 15_000, false);
    const later = computeWorkshopKineticState(bakeryItem, b, 20_000, false);
    expect(mid.extraRotorRad).toBeGreaterThan(0);
    expect(later.extraRotorRad).toBeCloseTo(mid.extraRotorRad * 2, 6);
    expect(mid.scaleX * mid.scaleY).toBeGreaterThan(0.99);
    expect(mid.scaleX * mid.scaleY).toBeLessThan(1.01);

    const reduced = computeWorkshopKineticState(bakeryItem, b, 15_000, true);
    expect(reduced.isActive).toBe(true);
    expect(reduced.scaleX).toBe(1);
    expect(reduced.scaleY).toBe(1);
    expect(reduced.extraRotorRad).toBe(0);
  });

  it('hồ sơ ánh sáng tách bạch cây/thú/nền (0), cửa sổ kiến trúc (1), phép thuật (2) và giữ cứng 1.05 cho ô connectable', () => {
    expect(getSpriteLightingProfile('crop_plot_tilled')).toBe(0);
    expect(getSpriteLightingProfile('beast_yule_unicorn_prance')).toBe(0);
    expect(getSpriteLightingProfile('env_tree_oak')).toBe(0);
    expect(getSpriteLightingProfile('burrow_house_canon')).toBe(1);
    expect(getSpriteLightingProfile('molly_apple_bakery')).toBe(1);
    expect(getSpriteLightingProfile('yule_vn_hoian_lantern_stand')).toBe(2);
    expect(getSpriteLightingProfile('yule_floo_emerald_hearth')).toBe(2);
    expect(getSpriteLightingProfile('env_tree_magic')).toBe(2);

    expect(getHarmonizedSpriteScale(getCatalogItem('farmland_plot')!)).toBe(1.0);
    expect(getHarmonizedSpriteScale(getCatalogItem('burrow_animal_pasture')!)).toBe(1.0);
    expect(getHarmonizedSpriteScale(getCatalogItem('burrow_flower_garden')!)).toBe(1.0);
    expect(getHarmonizedSpriteScale(getCatalogItem('burrow_house_canon')!)).toBe(1.12);
    expect(getHarmonizedSpriteScale(getCatalogItem('dragon_lair')!)).toBe(1.1);
    expect(getHarmonizedSpriteScale(getCatalogItem('marble_bench')!)).toBe(0.92);
  });

  it('CameraDirector nội suy cubic ease-out, hỗ trợ reducedMotion và hủy tức thì khi cancel()', () => {
    const dir = new CameraDirector();
    const cam: Camera = { x: 0, y: 0, zoom: 0.8, viewRot: 0 };
    const dest = worldIso(24, 24, 0);

    dir.panToGrid(cam, 24, 24, { targetZoom: 1.0, durationMs: 500 });
    expect(dir.isActive).toBe(true);

    for (let i = 0; i < 5; i++) dir.update(cam, 0.05);
    // Cubic ease-out at t=0.5 reaches 1 - 0.5^3 = 0.875 of travel distance
    expect(cam.x).toBeCloseTo(dest.wx * 0.875, 2);
    expect(cam.y).toBeCloseTo(dest.wy * 0.875, 2);
    expect(cam.zoom).toBeCloseTo(0.8 + 0.2 * 0.875, 4);

    for (let i = 0; i < 5; i++) dir.update(cam, 0.05);
    expect(cam.x).toBeCloseTo(dest.wx, 3);
    expect(cam.y).toBeCloseTo(dest.wy, 3);
    expect(dir.isActive).toBe(false);

    const cam2: Camera = { x: 10, y: 20, zoom: 0.7, viewRot: 0 };
    dir.panToGrid(cam2, 30, 30, { targetZoom: 0.95, durationMs: 500 });
    dir.update(cam2, 0.05);
    dir.cancel();
    expect(dir.isActive).toBe(false);
    const frozenX = cam2.x;
    expect(dir.update(cam2, 0.2)).toBe(false);
    expect(cam2.x).toBe(frozenX);

    dir.panToGrid(cam2, 18, 22, { targetZoom: 0.9, durationMs: 500, reducedMotion: true });
    const snapDest = worldIso(18, 22, 0);
    expect(dir.isActive).toBe(false);
    expect(cam2.x).toBeCloseTo(snapDest.wx, 3);
    expect(cam2.y).toBeCloseTo(snapDest.wy, 3);
    expect(cam2.zoom).toBe(0.9);
  });

  it('inspectorRenderInspector cập nhật [data-insp-live] tại chỗ không rebuild innerHTML mỗi giây', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(mockAudio);
    const nowSpy = vi.spyOn(Date, 'now');
    let fakeNow = 1_700_000_000_000;
    nowSpy.mockImplementation(() => fakeNow);

    const plot: PlacedBuilding = {
      uid: 'b_insp_live_test',
      itemId: 'farmland_plot',
      gx: 18,
      gy: 24,
      rotation: 0,
      stars: 1,
      placedAt: fakeNow - 50_000,
      constructEndsAt: fakeNow - 40_000,
      lastTickAt: fakeNow,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      cropId: 'ottery_wheat',
      cropPlantedAt: fakeNow - 5_000,
      cropReadyAt: fakeNow + 40_000,
    };
    sim.state.buildings.push(plot);

    let htmlAssignCount = 0;
    let storedHtml = '';
    const timerNode = { textContent: '' };
    const barNode = { style: { width: '' } };
    const liveMap: Record<string, unknown> = {
      '[data-insp-live="crop-timer"]': timerNode,
      '[data-insp-live="crop-bar"]': barNode,
    };
    const classSet = new Set<string>(['hidden']);
    const panelMock = {
      dataset: {} as Record<string, string>,
      classList: {
        add: (c: string) => classSet.add(c),
        remove: (c: string) => classSet.delete(c),
        toggle: (c: string, force?: boolean) => (force ? classSet.add(c) : classSet.delete(c)),
        contains: (c: string) => classSet.has(c),
      },
      querySelector: (sel: string) => liveMap[sel] ?? null,
      querySelectorAll: () => [],
      get innerHTML() {
        return storedHtml;
      },
      set innerHTML(val: string) {
        storedHtml = val;
        htmlAssignCount++;
      },
    };

    const hudMock = {
      sim,
      root: {
        querySelector: (sel: string) => (sel === '#inspectorPanel' ? panelMock : null),
      },
      inspectSelection: { kind: 'building', uid: plot.uid } as const,
      lastInspectedKey: '',
      inspectorCollapsed: false,
      seedFilterMode: 'all' as const,
      activeSeedCropId: null,
      activePastureAnimalId: null,
      syncContextualMapToolsBar: vi.fn(),
      syncHudFocusVisibility: vi.fn(),
      wireRangeProgressFallback: vi.fn(),
    } as never;

    try {
      inspectorRenderInspector(hudMock);
      expect(htmlAssignCount).toBe(1);
      expect(panelMock.classList.contains('hidden')).toBe(false);

      fakeNow += 5_000;
      inspectorRenderInspector(hudMock);
      expect(htmlAssignCount).toBe(1);
      expect(timerNode.textContent).toBe('35s');
      expect(barNode.style.width).not.toBe('');

      // Ripening changes structural state -> triggers full re-render with harvest button
      fakeNow += 40_000;
      inspectorRenderInspector(hudMock);
      expect(htmlAssignCount).toBe(2);
    } finally {
      nowSpy.mockRestore();
    }
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { Camera, centerCameraOnGrid } from '../../engine/isometric';
import {
  buildLockedSceneryCatalog,
  resolveWinterScenerySpriteKey,
  WINTER_VALLEY_CHRISTMAS_SPOTS,
} from '../../engine/rendererShared';
import { IsometricRenderer } from '../../engine/renderer';
import { drawWinterAssetLiveEffects } from '../../engine/renderBuildings';
import { SPRITE_KEYS, SpriteRegistry } from '../../engine/spriteLoader';
import { canSpriteReceiveWinterSnowCap } from '../../render/webgl2/webgl2WorldRenderer';
import { WorldRenderSnapshotCollector } from '../../render/worldSnapshot';
import { parseYouTubeBgmSource, YouTubeBgmController } from '../../ui/youtubeBgmPlayer';
import { ParkSimulation } from '../simulation';
import { evaluateHabitatBiome } from '../zooAndBackstage';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

function createMockAudio(): MagicalAudio {
  return {
    enabled: true,
    bgmEnabled: true,
    playTone: vi.fn(),
    playSfx: vi.fn(),
    playClick: vi.fn(),
    playSpell: vi.fn(),
    playPlace: vi.fn(),
    playDemolish: vi.fn(),
    playCoin: vi.fn(),
    playFlyTick: vi.fn(),
    playError: vi.fn(),
    playCheer: vi.fn(),
    playRoar: vi.fn(),
    playCoaster: vi.fn(),
    playWater: vi.fn(),
    playThunder: vi.fn(),
    playLevelUp: vi.fn(),
    playRibbonCut: vi.fn(),
    updateBgmContext: vi.fn(),
    resumeIfNeeded: vi.fn(),
    setEnabled: vi.fn(),
    setBgmEnabled: vi.fn(),
  } as unknown as MagicalAudio;
}

function createMock2dCtx(w = 1280, h = 800): CanvasRenderingContext2D {
  return {
    canvas: { width: w, height: h },
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    transform: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    setLineDash: vi.fn(),
    measureText: (txt: string) => ({ width: txt.length * 7 }),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    createLinearGradient: () => ({ addColorStop: vi.fn() }),
    createRadialGradient: () => ({ addColorStop: vi.fn() }),
  } as unknown as CanvasRenderingContext2D;
}

describe('Winter Christmas Main Map (Mùa Đông Chào Mừng Giáng Sinh)', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('bật mặc định Bản Đồ Chính Mùa Đông Giáng Sinh kèm tuyết rơi Hogsmeade, giữ nguyên địa hình logic cho Đồng Cỏ Thú', () => {
    const sim = new ParkSimulation(createMockAudio());
    expect(sim.state.settings.yuleThemeMode).toBe('auto');
    expect(sim.state.settings.weatherOverride).toBe('auto');
    expect(sim.isWinterMainMapActive()).toBe(true);
    expect(sim.getCurrentWeather().kind).toBe('snow');
    expect(sim.state.lastProphetHeadline?.title).toContain('GIÁNG SINH');

    // Đồng cỏ thú chăn thả vẫn giữ nguyên 100% nền 'grass' logic để không bị trừ điểm sinh thái
    const pasture = sim.state.buildings.find((b) => b.uid === 'burrow_pasture_hen')!;
    const pastureItem = getCatalogItem(pasture.itemId)!;
    const biome = evaluateHabitatBiome(sim.grid, sim.state.buildings, pasture, pastureItem);
    expect(biome.matchingTiles).toBeGreaterThanOrEqual(6);

    // Tắt chủ đề Giáng Sinh ('off') chuyển ngay về chế độ mùa nắng Hang Sóc
    sim.state.settings.yuleThemeMode = 'off';
    expect(sim.isWinterMainMapActive()).toBe(false);
    expect(sim.getCurrentWeather().kind).toBe('sunny');
  });

  it('toàn bộ sprite cảnh trí Giáng Sinh & rừng thông ngoại vi đều hợp lệ trong SPRITE_KEYS và không chặn đặt nhà', () => {
    const validKeys = new Set<string>(SPRITE_KEYS);
    for (const [gx, gy, spriteKey] of WINTER_VALLEY_CHRISTMAS_SPOTS) {
      expect(validKeys.has(spriteKey)).toBe(true);
      expect(gx).toBeGreaterThanOrEqual(0);
      expect(gy).toBeGreaterThanOrEqual(0);
    }

    const lockedCatalog = buildLockedSceneryCatalog();
    expect(lockedCatalog.length).toBeGreaterThan(20);
    for (const prop of lockedCatalog) {
      const winterKey = resolveWinterScenerySpriteKey(prop);
      expect(validKeys.has(winterKey)).toBe(true);
    }

    // Kiểm tra người chơi vẫn đặt được công trình ngay tại toạ độ cảnh trí Giáng Sinh [16, 19] & [7, 21]
    const sim = new ParkSimulation(createMockAudio());
    const plotItem = getCatalogItem('farmland_plot')!;
    expect(sim.canPlaceItem(plotItem, 16, 18, 0).ok).toBe(true);
    expect(sim.canPlaceItem(plotItem, 7, 20, 0).ok).toBe(true);
  });

  it('render mượt Bản Đồ Chính Mùa Đông (ban ngày & ban đêm), tự làm mới bộ đệm mặt đất và minimap khi bật/tắt Giáng Sinh', () => {
    const sim = new ParkSimulation(createMockAudio());
    const fakeCanvas = {
      width: 1280,
      height: 800,
      clientWidth: 1280,
      clientHeight: 800,
      getContext: () => createMock2dCtx(1280, 800),
    } as unknown as HTMLCanvasElement;
    const minimapFills: string[] = [];
    const minimapCtx = createMock2dCtx(180, 120);
    Object.defineProperty(minimapCtx, 'fillStyle', {
      get: () => '',
      set: (v: string) => {
        minimapFills.push(String(v));
      },
    });
    const fakeMinimap = {
      width: 180,
      height: 120,
      getContext: () => minimapCtx,
    } as unknown as HTMLCanvasElement;

    const renderer = new IsometricRenderer(fakeCanvas, new SpriteRegistry());
    const cam: Camera = { x: 0, y: 0, zoom: 0.82, viewRot: 0 };
    centerCameraOnGrid(cam, 18.0, 24.5);

    // Render mùa đông ban ngày & ban đêm không lỗi, minimap phủ tuyết trắng (#e6f0fa)
    expect(() => renderer.render(sim, cam, null, null, 0, false, null)).not.toThrow();
    renderer.renderMinimap(fakeMinimap, sim, cam);
    expect(minimapFills).toContain('#e6f0fa');
    expect(minimapFills).not.toContain('#4ade80');

    sim.state.settings.timeOverride = 'night';
    expect(() => renderer.render(sim, cam, null, null, 0, false, null)).not.toThrow();

    // Tắt Giáng Sinh -> minimap chuyển ngay về thảm cỏ xanh (#4ade80) & WorldRenderSnapshot đổi mùa
    minimapFills.length = 0;
    sim.state.settings.yuleThemeMode = 'off';
    renderer.renderMinimap(fakeMinimap, sim, cam);
    expect(minimapFills).toContain('#4ade80');

    const collector = new WorldRenderSnapshotCollector();
    const spriteResolver = {
      resolve: () => ({ id: 1, width: 256, height: 256 }),
    };
    sim.state.settings.yuleThemeMode = 'on';
    collector.collect(sim, cam, 1280, 800, 1000, spriteResolver, 2000, 8, { wx: 0, wy: 0, active: false }, false);
    expect(collector.seasonId).toBe('winter');

    sim.state.settings.yuleThemeMode = 'off';
    sim.state.settings.activeFestival = 'none';
    collector.collect(sim, cam, 1280, 800, 1100, spriteResolver, 2000, 8, { wx: 0, wy: 0, active: false }, false);
    expect(collector.seasonId).not.toBe('winter');
  });

  it('hiệu ứng động cho các asset tab Giáng Sinh và trình phát nhạc nền YouTube 0 băng thông hoạt động chuẩn xác', () => {
    const fakeCanvas = {
      width: 1280,
      height: 800,
      clientWidth: 1280,
      clientHeight: 800,
      getContext: () => createMock2dCtx(1280, 800),
    } as unknown as HTMLCanvasElement;
    const renderer = new IsometricRenderer(fakeCanvas, new SpriteRegistry());
    renderer.reducedMotion = false;
    renderer.tick = 42;

    for (const id of [
      'snowy_pines',
      'yule_great_hall_tree',
      'yule_hogwarts_snow_loco',
      'yule_castle_snowglobe',
      'yule_snowball_fort',
      'yule_gramophone_harp',
      'yule_goblet_blue_brazier',
      'yule_wizard_cracker_cart',
      'yule_poinsettia_tiered_stand',
    ]) {
      const it = getCatalogItem(id)!;
      expect(() =>
        drawWinterAssetLiveEffects(
          renderer,
          id,
          it.yuleCollection,
          320,
          280,
          96,
          110,
          1,
          true,
          14,
          18
        )
      ).not.toThrow();
    }

    // Kiểm tra tách link YouTube đủ mọi định dạng phổ biến
    expect(parseYouTubeBgmSource('https://www.youtube.com/watch?v=jfKfPfyJRdk')).toEqual({
      kind: 'video',
      videoId: 'jfKfPfyJRdk',
    });
    expect(parseYouTubeBgmSource('https://youtu.be/4xDzrJKXOOY?si=abc')).toEqual({
      kind: 'video',
      videoId: '4xDzrJKXOOY',
    });
    expect(parseYouTubeBgmSource('https://www.youtube.com/live/DWcJFNfaw9c')).toEqual({
      kind: 'video',
      videoId: 'DWcJFNfaw9c',
    });
    expect(
      parseYouTubeBgmSource('https://www.youtube.com/playlist?list=PL1234567890ABCDEF')
    ).toEqual({
      kind: 'playlist',
      playlistId: 'PL1234567890ABCDEF',
    });
    expect(parseYouTubeBgmSource('https://evil.example.com/watch?v=jfKfPfyJRdk')).toBeNull();

    // Khi bật YouTube BGM, MagicalAudio tự ngắt nhạc nền nội bộ để không chồng 2 bài nhạc
    const mockAudio = createMockAudio();
    mockAudio.externalBgmActive = false;
    const ytCtrl = new YouTubeBgmController(mockAudio);
    ytCtrl.sync({
      youtubeEnabled: true,
      bgmEnabled: true,
      rawUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      volume0to1: 0.7,
    });
    expect(mockAudio.externalBgmActive).toBe(true);

    ytCtrl.sync({
      youtubeEnabled: false,
      bgmEnabled: true,
      rawUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      volume0to1: 0.7,
    });
    expect(mockAudio.externalBgmActive).toBe(false);
  });

  it('mặc định bật Engine Đồ Hoạ Mới (WebGL2 2.5D HDR), ghép liền mạch rào mask12 trên GPU và vẽ chuẩn khung xoay khi đặt công trình', () => {
    const sim = new ParkSimulation(createMockAudio());
    expect(sim.state.settings.rendererMode).toBe('webgl2');

    sim.state.settings.rendererMode = 'canvas';
    const saved = sim.exportSaveJson();
    const restored = new ParkSimulation(createMockAudio());
    expect(restored.importSaveJson(saved)).toBe(true);
    expect(restored.state.settings.rendererMode).toBe('canvas');

    const pasturePlot = sim.state.buildings.find((b) => b.itemId === 'burrow_animal_pasture');
    expect(pasturePlot).toBeDefined();
    if (pasturePlot) {
      pasturePlot.pastureAnimalId = 'burrow_hen';
      pasturePlot.pastureReadyAt = Date.now() + 60_000;
    }

    const resolvedKeys: string[] = [];
    const collector = new WorldRenderSnapshotCollector();
    const cam: Camera = { x: 0, y: 0, zoom: 0.82, viewRot: 0 };
    centerCameraOnGrid(cam, 18.0, 24.5);
    collector.collect(
      sim,
      cam,
      1280,
      800,
      Date.now() + 1000,
      {
        resolve: (k: string) => {
          resolvedKeys.push(k);
          return { id: 1, width: 372, height: 223 };
        },
      },
      2000,
      8,
      { wx: 0, wy: 0, active: false },
      false,
      { skipReadyBubbleSprites: true }
    );
    expect(resolvedKeys.some((k) => k.startsWith('conn:crop_plot_tilled:'))).toBe(true);
    expect(resolvedKeys.some((k) => k.startsWith('conn:burrow_animal_pasture:'))).toBe(true);
    expect(resolvedKeys.some((k) => k === 'beast_hen' || k === 'beast_hen_peck')).toBe(true);
    expect(resolvedKeys.includes('ui_icon_egg_basket')).toBe(false);
    expect(canSpriteReceiveWinterSnowCap('conn:crop_plot_tilled:16')).toBe(false);
    expect(canSpriteReceiveWinterSnowCap('beast_hen')).toBe(false);

    const fakeCanvas = {
      width: 1280,
      height: 800,
      clientWidth: 1280,
      clientHeight: 800,
      getContext: () => createMock2dCtx(1280, 800),
    } as unknown as HTMLCanvasElement;
    const renderer = new IsometricRenderer(fakeCanvas, new SpriteRegistry());
    const fort = getCatalogItem('yule_snowball_fort')!;
    expect(() =>
      renderer.renderWorldUiOverlays(
        sim,
        cam,
        null,
        null,
        true,
        false,
        { gx: 18, gy: 21 },
        fort,
        1,
        false,
        null
      )
    ).not.toThrow();
  });
});

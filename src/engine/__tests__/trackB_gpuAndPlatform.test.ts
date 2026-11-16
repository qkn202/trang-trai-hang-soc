import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { isPlinthSpriteKey } from '../../engine/groundBlend';
import { Camera } from '../../engine/isometric';
import { IsometricRenderer } from '../../engine/renderer';
import { SpriteRegistry } from '../../engine/spriteLoader';
import {
  createPlatformAdapterForWindow,
  detectPlatformRuntime,
} from '../../platform/nativeAdapter';
import {
  decodeHitmasksBinary,
  encodeHitmasksBinary,
  getMask12FenceSubTileSegments,
  hitTestPacked1BitMask,
  packRgbaTo1BitHitmask,
} from '../../render/assets/atlasLoader';
import {
  detectGpuCompressedSupport,
  parseKtx2ContainerHeader,
} from '../../render/assets/ktx2Loader';
import {
  buildIsoSceneRangeSlices,
  RangeSliceSegment,
} from '../../render/spine/spineAdapter';
import {
  canSpriteReceiveWinterSnowCap,
  shouldCleanseSpriteBakedHalo,
} from '../../render/webgl2/webgl2WorldRenderer';
import {
  resolveYuleMagicalLightProfile,
  SpriteIdResolver,
  WorldRenderSnapshotCollector,
} from '../../render/worldSnapshot';
import { ParkSimulation } from '../../sim/simulation';

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
    playLevelUp: vi.fn(),
    playRibbonCut: vi.fn(),
    updateBgmContext: vi.fn(),
    resumeIfNeeded: vi.fn(),
    setEnabled: vi.fn(),
    setBgmEnabled: vi.fn(),
  } as unknown as MagicalAudio;
}

function createMockSpriteResolver(): SpriteIdResolver {
  const map = new Map<string, number>();
  let nextId = 1;
  return {
    resolve(key: string) {
      let id = map.get(key);
      if (id === undefined) {
        id = nextId++;
        map.set(key, id);
      }
      return { id, width: 320, height: 280 };
    },
  };
}

describe('Track B — SoA WorldRenderSnapshot, Offline Hitmasks, Spine Range Slicing & Native Shell', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  describe('B2 — Zero-GC SoA Snapshot, Dirty Terrain Revision & Build Ghost Tints', () => {
    it('giữ nguyên terrainRevision khi pan camera / tick dân làng, chỉ tăng khi đột biến lưới (placeItem) và xuất đúng cờ bóng ma xây dựng', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.match3.stars = 500;
      sim.state.galleons = 5000;
      const collector = new WorldRenderSnapshotCollector();
      const sprites = createMockSpriteResolver();
      const cam: Camera = { x: 0, y: 0, zoom: 1.0, viewRot: 0 };

      collector.collect(
        sim,
        cam,
        1280,
        800,
        1000,
        sprites,
        4000,
        8,
        { wx: 0, wy: 0, active: false },
        true
      );
      const revInitial = collector.terrainRevision;
      expect(revInitial).toBeGreaterThan(0);
      expect(collector.terrainCount + collector.waterCount).toBe(72 * 72);
      expect(collector.waterCount).toBeGreaterThan(0);
      expect(collector.sceneCount).toBeGreaterThan(0);
      expect(collector.sceneSpriteIds).toBeInstanceOf(Uint16Array);
      expect(collector.sceneTintFlags).toBeInstanceOf(Uint8Array);

      // Kéo camera sang vị trí mới + chạy update dân làng: KHÔNG được rebuild VBO địa hình tĩnh!
      cam.x += 240;
      cam.y -= 120;
      sim.update(0.5);
      collector.collect(
        sim,
        cam,
        1280,
        800,
        1500,
        sprites,
        4000,
        8,
        { wx: 80, wy: 120, active: true },
        true
      );
      expect(collector.terrainRevision).toBe(revInitial);

      // Kiểm tra bóng ma xây dựng (tintFlag = 1 khi ô trống hợp lệ, tintFlag = 2 khi ô bị chặn ở vùng khoá)
      const plotCatalog = getCatalogItem('farmland_plot')!;
      collector.collect(
        sim,
        cam,
        1280,
        800,
        1600,
        sprites,
        4000,
        8,
        { wx: 0, wy: 0, active: false },
        true,
        {
          hoverTile: { gx: 22, gy: 22 },
          selectedCatalogItem: plotCatalog,
          rotation: 0,
        }
      );
      let foundValidGhost = false;
      for (let i = 0; i < collector.sceneCount; i++) {
        if (collector.sceneTintFlags[i] === 1) foundValidGhost = true;
      }
      expect(foundValidGhost).toBe(true);

      collector.collect(
        sim,
        cam,
        1280,
        800,
        1650,
        sprites,
        4000,
        8,
        { wx: 0, wy: 0, active: false },
        true,
        {
          hoverTile: { gx: 68, gy: 68 }, // Ô thuộc vùng khoá
          selectedCatalogItem: plotCatalog,
          rotation: 0,
        }
      );
      let foundBlockedGhost = false;
      for (let i = 0; i < collector.sceneCount; i++) {
        if (collector.sceneTintFlags[i] === 2) foundBlockedGhost = true;
      }
      expect(foundBlockedGhost).toBe(true);

      // Đặt công trình thật sự làm thay đổi lưới -> terrainRevision phải tăng đúng 1 nhịp!
      const placed = sim.placeItem(plotCatalog, 22, 22, 0);
      expect(placed).not.toBeNull();
      collector.collect(
        sim,
        cam,
        1280,
        800,
        1700,
        sprites,
        4000,
        8,
        { wx: 0, wy: 0, active: false },
        true
      );
      expect(collector.terrainRevision).toBe(revInitial + 1);
    });

    it('nén chính xác RGBA -> 1-Bit Alpha Hitmask nhị phân (hitmasks.bin) và giải mã sub-tile rào mask12', () => {
      // Ảnh giả lập 16x16: nửa trên trong suốt (alpha = 0), nửa dưới đục (alpha = 255)
      const w = 16;
      const h = 16;
      const rgba = new Uint8Array(w * h * 4);
      for (let y = 8; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          rgba[idx] = 220;
          rgba[idx + 1] = 160;
          rgba[idx + 2] = 90;
          rgba[idx + 3] = 255;
        }
      }

      const packed = packRgbaTo1BitHitmask(rgba, w, h);
      expect(packed.cols).toBe(4);
      expect(packed.rows).toBe(4);
      expect(hitTestPacked1BitMask(packed, 0.5, 0.15)).toBe(false);
      expect(hitTestPacked1BitMask(packed, 0.5, 0.85)).toBe(true);

      // Encode -> Decode nhị phân `hitmasks.bin`
      const bin = encodeHitmasksBinary([
        {
          id: 42,
          cols: packed.cols,
          rows: packed.rows,
          origW: w,
          origH: h,
          bits: packed.bits,
        },
      ]);
      const decoded = decodeHitmasksBinary(bin);
      const rec = decoded.get(42);
      expect(rec).toBeDefined();
      expect(hitTestPacked1BitMask(rec!, 0.5, 0.2)).toBe(false);
      expect(hitTestPacked1BitMask(rec!, 0.5, 0.8)).toBe(true);

      // Bảng tra UV sub-tile rào ghép liền mạch mask12
      const fullFenceSegs = getMask12FenceSubTileSegments(0); // Không nối ô nào -> đủ 4 cạnh rào
      const mergedInteriorSegs = getMask12FenceSubTileSegments(1 | 2 | 4 | 8); // Nằm giữa cụm -> xoá cả 4 cạnh rào trong
      expect(fullFenceSegs.length).toBe(4);
      expect(mergedInteriorSegs.length).toBe(0);
    });
  });

  describe('B5 — Iron Law #3: Range-Sliced IsoSceneSortedPass + Spine Interleaving', () => {
    it('chia dải instanced draw xen kẽ chính xác với các khe xương Spine 2D theo đúng thứ tự tô-pô Kahn', () => {
      const outSlices: RangeSliceSegment[] = [];
      const skeletalIndices = new Int32Array([3, 8]); // Tổng 12 vật thể (0..11), dân làng Spine ở vị trí 3 và 8

      const count = buildIsoSceneRangeSlices(12, skeletalIndices, 2, outSlices);
      expect(count).toBe(5);
      expect(outSlices.slice(0, count)).toEqual([
        { kind: 'instanced_range', firstInstance: 0, instanceCount: 3, skeletalSlotIndex: -1 },
        { kind: 'skeletal_slot', firstInstance: 3, instanceCount: 1, skeletalSlotIndex: 0 },
        { kind: 'instanced_range', firstInstance: 4, instanceCount: 4, skeletalSlotIndex: -1 },
        { kind: 'skeletal_slot', firstInstance: 8, instanceCount: 1, skeletalSlotIndex: 1 },
        { kind: 'instanced_range', firstInstance: 9, instanceCount: 3, skeletalSlotIndex: -1 },
      ]);
    });
  });

  describe('B7 — Native Platform Shell (Tauri v2 + Capacitor CoreHaptics) & KTX2 Container Parser', () => {
    it('tự động nhận diện Web / Tauri Desktop / Capacitor iOS và điều phối đúng CoreHaptics & LocalNotifications', async () => {
      expect(detectPlatformRuntime({})).toBe('web');

      const invokeSpy = vi.fn().mockResolvedValue(null);
      const tauriWin = { __TAURI_INTERNALS__: { invoke: invokeSpy } };
      expect(detectPlatformRuntime(tauriWin)).toBe('tauri-desktop');
      const tauriAdapter = createPlatformAdapterForWindow(tauriWin);
      expect(tauriAdapter.isNativeShell).toBe(true);
      await tauriAdapter.saveLocalBackup('slot_main', '{"level":50}');
      expect(invokeSpy).toHaveBeenCalledWith('plugin:fs|write_text_file', {
        path: 'hangsoc_slot_main.json',
        contents: '{"level":50}',
      });

      const impactSpy = vi.fn().mockResolvedValue(undefined);
      const notificationSpy = vi.fn().mockResolvedValue(undefined);
      const capIosWin = {
        Capacitor: {
          isNativePlatform: () => true,
          getPlatform: () => 'ios',
          Plugins: {
            Haptics: {
              impact: impactSpy,
              notification: notificationSpy,
            },
          },
        },
      };
      expect(detectPlatformRuntime(capIosWin)).toBe('capacitor-ios');
      const iosAdapter = createPlatformAdapterForWindow(capIosWin);
      await iosAdapter.triggerHaptic('medium');
      expect(impactSpy).toHaveBeenCalledWith({ style: 'MEDIUM' });
      await iosAdapter.triggerHaptic('levelup');
      expect(notificationSpy).toHaveBeenCalledWith({ type: 'SUCCESS' });
    });

    it('đọc chuẩn container KTX2 (ASTC/BC7/ETC2) và chọn ưu tiên định dạng nén phần cứng GPU', () => {
      const buf = new ArrayBuffer(128);
      const u8 = new Uint8Array(buf);
      u8.set([0xab, 0x4b, 0x54, 0x58, 0x20, 0x32, 0x30, 0xbb, 0x0d, 0x0a, 0x1a, 0x0a], 0);
      const view = new DataView(buf);
      view.setUint32(12, 158, true); // VK_FORMAT_ASTC_4x4_SRGB_BLOCK
      view.setUint32(20, 2048, true);
      view.setUint32(24, 2048, true);
      view.setUint32(32, 6, true); // 6 layers in TEXTURE_2D_ARRAY
      view.setUint32(40, 1, true);
      view.setBigUint64(80, 104n, true);
      view.setBigUint64(88, 24n, true);

      const parsed = parseKtx2ContainerHeader(buf);
      expect(parsed).toEqual({
        vkFormat: 158,
        pixelWidth: 2048,
        pixelHeight: 2048,
        layerCount: 6,
        levelCount: 1,
        supercompressionScheme: 0,
        level0ByteOffset: 104,
        level0ByteLength: 24,
      });

      const mockAstcGl = {
        getExtension: (name: string) =>
          name === 'WEBGL_compressed_texture_astc'
            ? { COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR: 0x93d0 }
            : null,
      } as unknown as WebGL2RenderingContext;
      const support = detectGpuCompressedSupport(mockAstcGl);
      expect(support.preferredFamily).toBe('astc');
      expect(support.astc4x4Srgb).toBe(0x93d0);
    });
  });

  describe('Yule / Winter AAA Polish — Procedural Roof Snow Cap, De-Plinth, Halo Cleanse & Magical Light Palette', () => {
    it('phủ tuyết tự động cho 33 nhà gốc Hang Sóc nhưng loại trừ yule_*/snowy_pines, de-plinth lâu đài thu nhỏ và gán đúng bảng đèn lam băng/Patronus', () => {
      // 1. De-plinth cho mô hình lâu đài băng hình thoi mà không sửa PNG gốc
      expect(isPlinthSpriteKey('yule_mini_hogwarts_castle')).toBe(true);
      expect(isPlinthSpriteKey('yule_hogwarts_boathouse_ice')).toBe(true);
      expect(isPlinthSpriteKey('burrow_house_canon')).toBe(false);

      // 2. Chỉ phủ tuyết procedural lên nhà & cây gốc, không phủ đè lên yule_* đã vẽ tuyết hay ô đất phẳng
      expect(canSpriteReceiveWinterSnowCap('burrow_house_canon')).toBe(true);
      expect(canSpriteReceiveWinterSnowCap('molly_apple_bakery')).toBe(true);
      expect(canSpriteReceiveWinterSnowCap('env_tree_oak')).toBe(true);
      expect(canSpriteReceiveWinterSnowCap('yule_ollivanders_shop')).toBe(false);
      expect(canSpriteReceiveWinterSnowCap('snowy_pines')).toBe(false);
      expect(canSpriteReceiveWinterSnowCap('crop_plot_tilled')).toBe(false);

      // 3. Làm sạch quầng sương alpha vẽ sẵn quanh ngọn lửa Noel
      expect(shouldCleanseSpriteBakedHalo('yule_goblet_blue_brazier')).toBe(true);
      expect(shouldCleanseSpriteBakedHalo('yule_floating_candelabra')).toBe(true);
      expect(shouldCleanseSpriteBakedHalo('yule_ollivanders_shop')).toBe(false);

      // 4. Bảng phân màu đèn GPU chuyên biệt cho mùa Noel
      const goblet = resolveYuleMagicalLightProfile('yule_goblet_blue_brazier');
      expect(goblet?.family).toBe('ice-patronus');
      expect(goblet?.rgb).toEqual([0.28, 0.80, 1.0]);
      expect(goblet?.activeInDaySnow).toBe(true);

      const patronus = resolveYuleMagicalLightProfile('yule_stag_patronus_topiary');
      expect(patronus?.family).toBe('ice-patronus');

      const wheezes = resolveYuleMagicalLightProfile('yule_weasley_wheezes_facade');
      expect(wheezes?.family).toBe('fairy-violet');

      const slytherin = resolveYuleMagicalLightProfile('yule_slytherin_serpent_mascot');
      expect(slytherin?.family).toBe('slytherin-emerald');

      const miniCastle = resolveYuleMagicalLightProfile('yule_mini_hogwarts_castle');
      expect(miniCastle?.family).toBe('festive-gold');
      expect(miniCastle?.secondaryLakePool).toBe(true);

      expect(resolveYuleMagicalLightProfile('burrow_house_canon')).toBeNull();
    });

    it('renderWorldUiOverlays vẽ sắc nét đồng hồ đếm ngược thời gian xây dựng trên lớp trong suốt phía trên #gpuWorldCanvas', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.match3.stars = 500;
      sim.state.galleons = 5000;
      const bakery = getCatalogItem('molly_apple_bakery')!;
      const placed = sim.placeItem(bakery, 18, 20, 0);
      expect(placed).toBe(true);
      const b = sim.state.buildings[sim.state.buildings.length - 1]!;
      b.constructEndsAt = Date.now() + 360_000; // Đang xây còn 6 phút

      const drawnTexts: string[] = [];
      const mockCtx = {
        canvas: { width: 1280, height: 800 },
        clearRect: vi.fn(),
        setTransform: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        beginPath: vi.fn(),
        closePath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        quadraticCurveTo: vi.fn(),
        arc: vi.fn(),
        ellipse: vi.fn(),
        roundRect: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        clip: vi.fn(),
        fillRect: vi.fn(),
        strokeRect: vi.fn(),
        drawImage: vi.fn(),
        measureText: (txt: string) => ({ width: txt.length * 7 }),
        fillText: (txt: string) => {
          drawnTexts.push(txt);
        },
        strokeText: vi.fn(),
        createLinearGradient: () => ({ addColorStop: vi.fn() }),
        createRadialGradient: () => ({ addColorStop: vi.fn() }),
      };
      const fakeCanvas = {
        width: 1280,
        height: 800,
        clientWidth: 1280,
        clientHeight: 800,
        getContext: () => mockCtx,
      } as unknown as HTMLCanvasElement;

      const isoRenderer = new IsometricRenderer(fakeCanvas, new SpriteRegistry());
      const cam: Camera = { x: 0, y: 650, zoom: 1.0, viewRot: 0 };
      isoRenderer.renderWorldUiOverlays(sim, cam, null, null, false, false);

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 1280, 800);
      // Phải vẽ nhãn thời gian đếm ngược (ví dụ "6p (3%)" hoặc "5p 59s...") trên giàn giáo!
      expect(drawnTexts.some((t) => /\d+[psg]/.test(t))).toBe(true);
    });
  });
});

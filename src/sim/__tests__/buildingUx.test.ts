import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import { GRID_SIZE } from '../../data/zones';
import { MagicalAudio } from '../../engine/audio';
import { clearBuildToolModes, pushRecentDecorId, loadRecentDecorIds } from '../../ui/hudShared';
import {
  isDragPaintableCatalogItem,
  isRepeatableCatalogItem,
  ParkSimulation,
} from '../simulation';

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

describe('Mobile Building UX & Safe Placement/Inspector Operations', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('canPlaceItem chặn vị trí sai (ngoài biên, vùng sương mù, đè công trình, thiếu vàng/sao, khóa cấp)', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 5000;
    const bench = getCatalogItem('marble_bench')!;

    // Ngoài ranh giới bản đồ
    expect(sim.canPlaceItem(bench, -1, 10, 0).ok).toBe(false);
    expect(sim.canPlaceItem(bench, GRID_SIZE, 10, 0).ok).toBe(false);

    // Đè lên công trình hiện có
    const existing = sim.state.buildings[0]!;
    const blockedRes = sim.canPlaceItem(bench, existing.gx, existing.gy, 0);
    expect(blockedRes.ok).toBe(false);
    expect(blockedRes.reason).toBeTruthy();

    // Vùng chưa mở khóa
    const lockedRes = sim.canPlaceItem(bench, 2, 2, 0);
    expect(lockedRes.ok).toBe(false);

    // Thiếu vàng
    const spot = findFreeSpot(sim, 'marble_bench');
    sim.state.galleons = 0;
    const noGold = sim.canPlaceItem(bench, spot.gx, spot.gy, 0);
    expect(noGold.ok).toBe(false);
    expect(noGold.reason).toContain('Vàng');

    // Khóa cấp độ
    sim.state.galleons = 50_000;
    sim.state.level = 1;
    sim.state.match3.stars = 0;
    const willow = getCatalogItem('whomping_willow')!;
    const lockedLv = sim.canPlaceItem(willow, spot.gx, spot.gy, 0);
    expect(lockedLv.ok).toBe(false);
  });

  it('placeItem chỉ thay đổi state khi vị trí hợp lệ', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 1000;
    const bench = getCatalogItem('marble_bench')!;
    const existing = sim.state.buildings[0]!;
    const beforeCount = sim.state.buildings.length;
    const beforeGold = sim.state.galleons;

    // Đặt vào ô bị chắn -> không thay đổi state, không tạo bước undo
    sim.beginBuildStroke();
    expect(sim.placeItem(bench, existing.gx, existing.gy, 0)).toBe(false);
    sim.commitBuildStroke();
    expect(sim.state.buildings.length).toBe(beforeCount);
    expect(sim.state.galleons).toBe(beforeGold);
    expect(sim.canUndoBuild()).toBe(false);

    // Đặt vào ô hợp lệ -> trừ đúng giá và thêm công trình
    const spot = findFreeSpot(sim, 'marble_bench');
    sim.beginBuildStroke();
    expect(sim.placeItem(bench, spot.gx, spot.gy, 0)).toBe(true);
    sim.commitBuildStroke();
    expect(sim.state.buildings.length).toBe(beforeCount + 1);
    expect(sim.state.galleons).toBe(beforeGold - bench.cost);
    expect(sim.canUndoBuild()).toBe(true);
  });

  it('phân loại đúng item không lặp (tự bỏ chọn sau 1 chạm) vs item lặp và drag brush', () => {
    const loom = getCatalogItem('burrow_self_knitting_loom')!;
    const niffler = getCatalogItem('niffler_den')!;
    const cobble = getCatalogItem('path_cobble')!;
    const fence = getCatalogItem('yule_holly_hedgerow')!;
    const bench = getCatalogItem('marble_bench')!;
    const plot = getCatalogItem('farmland_plot')!;

    // Công trình sản xuất / chuồng thú riêng lẻ -> không lặp (tự bỏ chọn sau khi đặt)
    expect(isRepeatableCatalogItem(loom)).toBe(false);
    expect(isRepeatableCatalogItem(niffler)).toBe(false);
    expect(isDragPaintableCatalogItem(loom)).toBe(false);

    // Đường và hàng rào 1x1 -> vừa lặp vừa hỗ trợ kéo brush liên tục
    expect(isDragPaintableCatalogItem(cobble)).toBe(true);
    expect(isRepeatableCatalogItem(cobble)).toBe(true);
    expect(isDragPaintableCatalogItem(fence)).toBe(true);
    expect(isRepeatableCatalogItem(fence)).toBe(true);

    // Trang trí & thửa đất 2x2 -> giữ lựa chọn lặp để chạm đặt tiếp, nhưng không làm hỏng thao tác kéo camera
    expect(isRepeatableCatalogItem(bench)).toBe(true);
    expect(isDragPaintableCatalogItem(bench)).toBe(false);
    expect(isRepeatableCatalogItem(plot)).toBe(true);
    expect(isDragPaintableCatalogItem(plot)).toBe(false);
  });

  it('Undo hoàn tác đúng một lần đặt và Redo khôi phục đúng một lần đặt', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 2000;
    const bench = getCatalogItem('marble_bench')!;
    const spot1 = findFreeSpot(sim, 'marble_bench');

    sim.beginBuildStroke();
    expect(sim.placeItem(bench, spot1.gx, spot1.gy, 0)).toBe(true);
    sim.commitBuildStroke();

    const spot2 = findFreeSpot(sim, 'marble_bench');
    sim.beginBuildStroke();
    expect(sim.placeItem(bench, spot2.gx, spot2.gy, 0)).toBe(true);
    sim.commitBuildStroke();

    const countAfterTwo = sim.state.buildings.length;
    const goldAfterTwo = sim.state.galleons;

    // Undo hoàn tác đúng lần đặt thứ 2, giữ nguyên lần đặt thứ 1
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.buildings.length).toBe(countAfterTwo - 1);
    expect(sim.state.galleons).toBe(goldAfterTwo + bench.cost);
    expect(sim.grid[spot1.gy][spot1.gx].buildingUid).toBeTruthy();
    expect(sim.grid[spot2.gy][spot2.gx].buildingUid).toBeNull();

    // Redo khôi phục đúng lần đặt thứ 2
    expect(sim.redoBuild()).toBe(true);
    expect(sim.state.buildings.length).toBe(countAfterTwo);
    expect(sim.state.galleons).toBe(goldAfterTwo);
    expect(sim.grid[spot2.gy][spot2.gx].buildingUid).toBeTruthy();
  });

  it('Move công trình không đổi giá tiền (0G), chặn collision và chặn công trình bất biến', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 3000;
    const bench = getCatalogItem('marble_bench')!;
    const spotA = findFreeSpot(sim, 'marble_bench');
    sim.placeItem(bench, spotA.gx, spotA.gy, 0);
    const placed = sim.state.buildings.at(-1)!;
    const goldBeforeMove = sim.state.galleons;
    const starsBeforeMove = sim.state.match3.stars;

    // Không thể dời đè lên công trình khác
    const other = sim.state.buildings[0]!;
    expect(sim.moveBuilding(placed.uid, other.gx, other.gy, 0).ok).toBe(false);
    expect(placed.gx).toBe(spotA.gx);
    expect(placed.gy).toBe(spotA.gy);

    // Dời sang ô trống hợp lệ tốn 0G và hỗ trợ Undo/Redo
    const spotB = findFreeSpot(sim, 'marble_bench');
    sim.beginBuildStroke();
    expect(sim.moveBuilding(placed.uid, spotB.gx, spotB.gy, 0).ok).toBe(true);
    sim.commitBuildStroke();

    expect(sim.state.galleons).toBe(goldBeforeMove);
    expect(sim.state.match3.stars).toBe(starsBeforeMove);
    expect(sim.grid[spotA.gy][spotA.gx].buildingUid).toBeNull();
    expect(sim.grid[spotB.gy][spotB.gx].buildingUid).toBe(placed.uid);

    // Chặn dời công trình indestructible
    placed.isIndestructible = true;
    const freeSpot = findFreeSpot(sim, 'marble_bench');
    expect(sim.moveBuilding(placed.uid, freeSpot.gx, freeSpot.gy, 0).ok).toBe(false);
    expect(sim.rotatePlacedBuilding(placed.uid).ok).toBe(false);
  });

  it('rotatePlacedBuilding cập nhật footprint trên grid an toàn, hỗ trợ Undo/Redo và chặn collision sau xoay', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.level = 20;
    sim.state.galleons = 20_000;
    sim.state.yuleEvent = {
      schemaVersion: 1,
      claimedMainDays: [],
      claimedSideTaskIds: [],
      unlockedAssetIds: ['yule_snowball_fort'],
      purchasedAssetIds: ['yule_snowball_fort'],
    };

    // yule_snowball_fort có kích thước 2x1 (không vuông -> xoay 90° đổi thành 1x2)
    const fortItem = getCatalogItem('yule_snowball_fort')!;
    expect(fortItem.width).toBe(2);
    expect(fortItem.height).toBe(1);

    // Tìm cụm 2x2 hoàn toàn trống để kiểm thử xoay 2x1 <-> 1x2
    const twoByTwo = getCatalogItem('farmland_plot')!;
    const anchor = findFreeSpot(sim, twoByTwo.id, 0);
    expect(sim.placeItem(fortItem, anchor.gx, anchor.gy, 0)).toBe(true);
    const fort = sim.state.buildings.at(-1)!;
    expect(sim.grid[anchor.gy][anchor.gx].buildingUid).toBe(fort.uid);
    expect(sim.grid[anchor.gy][anchor.gx + 1].buildingUid).toBe(fort.uid);
    expect(sim.grid[anchor.gy + 1][anchor.gx].buildingUid).toBeNull();

    // Xoay hợp lệ 0 -> 1 (footprint đổi thành 1x2)
    const rotOk = sim.rotatePlacedBuilding(fort.uid);
    expect(rotOk.ok).toBe(true);
    expect(rotOk.newRotation).toBe(1);
    expect(sim.grid[anchor.gy][anchor.gx].buildingUid).toBe(fort.uid);
    expect(sim.grid[anchor.gy][anchor.gx + 1].buildingUid).toBeNull();
    expect(sim.grid[anchor.gy + 1][anchor.gx].buildingUid).toBe(fort.uid);

    // Undo xoay -> trả lại rotation 0 và footprint 2x1
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.buildings.find((b) => b.uid === fort.uid)?.rotation).toBe(0);
    expect(sim.grid[anchor.gy][anchor.gx + 1].buildingUid).toBe(fort.uid);
    expect(sim.grid[anchor.gy + 1][anchor.gx].buildingUid).toBeNull();

    // Đặt vật cản tại (anchor.gx, anchor.gy + 1) -> xoay sang 1x2 phải bị chặn do collision!
    const bench = getCatalogItem('marble_bench')!;
    expect(sim.placeItem(bench, anchor.gx, anchor.gy + 1, 0)).toBe(true);
    const blockedRot = sim.rotatePlacedBuilding(fort.uid);
    expect(blockedRot.ok).toBe(false);
    expect(sim.state.buildings.find((b) => b.uid === fort.uid)?.rotation).toBe(0);
    expect(sim.grid[anchor.gy][anchor.gx + 1].buildingUid).toBe(fort.uid);
  });

  it('Xóa công trình indestructible bị chặn; xóa công trình có hazard vẫn mở confirm dialog', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 5000;

    // 1. Chặn xóa công trình bất biến (isIndestructible = true)
    const burrow = sim.state.buildings[0]!;
    burrow.isIndestructible = true;
    expect(sim.removeAtTile(burrow.gx, burrow.gy, true)).toBe(false);
    expect(sim.state.buildings.some((b) => b.uid === burrow.uid)).toBe(true);

    // 2. Xóa ruộng đang có cây trồng -> kích hoạt onRequestBulldozeConfirm và chưa xóa ngay
    const plotItem = getCatalogItem('farmland_plot')!;
    const spot = findFreeSpot(sim, 'farmland_plot');
    expect(sim.placeItem(plotItem, spot.gx, spot.gy, 0)).toBe(true);
    const plot = sim.state.buildings.at(-1)!;
    plot.cropId = 'ottery_wheat';
    plot.cropPlantedAt = Date.now() - 5000;
    plot.cropReadyAt = Date.now() + 60_000;

    let capturedHazardUid: string | null = null;
    sim.onRequestBulldozeConfirm = (warning) => {
      capturedHazardUid = warning.uid;
    };

    expect(sim.removeAtTile(spot.gx, spot.gy, false)).toBe(false);
    expect(capturedHazardUid).toBe(plot.uid);
    expect(sim.state.buildings.some((b) => b.uid === plot.uid)).toBe(true);

    // Sau khi người chơi xác nhận (force = true) -> xóa thành công và hoàn tác được
    sim.beginBuildStroke();
    expect(sim.removeAtTile(spot.gx, spot.gy, true)).toBe(true);
    sim.commitBuildStroke();
    expect(sim.state.buildings.some((b) => b.uid === plot.uid)).toBe(false);
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.buildings.some((b) => b.uid === plot.uid)).toBe(true);
  });

  it('clearBuildToolModes ngăn mọi trạng thái tool mâu thuẫn và lưu danh sách decor gần đây', () => {
    let resetCalls = 0;
    const host = {
      selectedCatalogItem: getCatalogItem('marble_bench') ?? null,
      moveModeActive: true,
      movingBuildingUid: 'b_123',
      bulldozerActive: true,
      pincerActive: true,
      pincerPicked: { kind: 'staff' as const, id: 'st_1', label: 'Gia Tinh' },
      pendingTouchTile: { gx: 12, gy: 14, label: 'Ghế Đá' },
      onBuildStateReset: () => {
        resetCalls++;
      },
    };

    clearBuildToolModes(host);
    expect(host.selectedCatalogItem).toBeNull();
    expect(host.moveModeActive).toBe(false);
    expect(host.movingBuildingUid).toBeNull();
    expect(host.bulldozerActive).toBe(false);
    expect(host.pincerActive).toBe(false);
    expect(host.pincerPicked).toBeNull();
    expect(host.pendingTouchTile).toBeNull();
    expect(resetCalls).toBe(1);

    const updated = pushRecentDecorId(
      pushRecentDecorId([], 'marble_bench'),
      'snowy_pines'
    );
    expect(updated).toEqual(['snowy_pines', 'marble_bench']);
    expect(loadRecentDecorIds()).toEqual(['snowy_pines', 'marble_bench']);
  });
});

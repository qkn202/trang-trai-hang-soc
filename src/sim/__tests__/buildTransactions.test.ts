import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CATALOG, getCatalogItem } from '../../data/catalog';
import { MagicalAudio } from '../../engine/audio';
import { ParkSimulation } from '../simulation';

const storageMap = new Map<string, string>();
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
});

function createMockAudio(): MagicalAudio {
  return {
    enabled: true, bgmEnabled: true, playTone: vi.fn(), playSfx: vi.fn(), playClick: vi.fn(),
    playSpell: vi.fn(), playPlace: vi.fn(), playHarvestBubble: vi.fn(), playBuildComplete: vi.fn(),
    playLevelUp: vi.fn(), playCheekyAlert: vi.fn(), playOwlHoot: vi.fn(), playCardFound: vi.fn(),
    updateSoundscape: vi.fn(), pause: vi.fn(), resume: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('Build Mode Transactions (P0.3)', () => {
  beforeEach(() => storageMap.clear());

  it('gộp N lần save/UI trong một stroke', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 10_000;
    const plot = CATALOG.find((c) => c.id === 'farmland_plot')!;
    const saveSpy = vi.spyOn(sim, 'saveToStorage');
    const uiSpy = vi.fn();
    sim.onUiChange = uiSpy;
    sim.beginBuildStroke();
    expect(sim.placeItem(plot, 8, 12, 0)).toBe(true);
    expect(sim.placeItem(plot, 10, 12, 0)).toBe(true);
    expect(sim.placeItem(plot, 12, 12, 0)).toBe(true);
    expect(saveSpy).not.toHaveBeenCalled();
    expect(uiSpy).not.toHaveBeenCalled();
    sim.commitBuildStroke();
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(uiSpy).toHaveBeenCalledTimes(1);
  });

  it('undo hoàn tác một stroke và redo khôi phục lại', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 5_000;
    const plot = CATALOG.find((c) => c.id === 'farmland_plot')!;
    const before = sim.state.buildings.length;
    const gold = sim.state.galleons;
    sim.beginBuildStroke();
    expect(sim.placeItem(plot, 8, 13, 0)).toBe(true);
    sim.commitBuildStroke();
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.buildings.length).toBe(before);
    expect(sim.state.galleons).toBe(gold);
    expect(sim.canRedoBuild()).toBe(true);
    expect(sim.redoBuild()).toBe(true);
    expect(sim.state.buildings.length).toBe(before + 1);
  });

  it('cancel hoàn tác stroke đang mở mà không tạo undo step', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 5_000;
    const plot = CATALOG.find((c) => c.id === 'farmland_plot')!;
    const before = sim.state.buildings.length;
    sim.beginBuildStroke();
    expect(sim.placeItem(plot, 8, 14, 0)).toBe(true);
    sim.cancelBuildStroke();
    expect(sim.state.buildings.length).toBe(before);
    expect(sim.canUndoBuild()).toBe(false);
    expect(sim.suppressPerActionSave).toBe(false);
    expect(sim.pendingBuildStroke).toBeNull();
  });

  it('stroke không mutation không ghi undo', () => {
    const sim = new ParkSimulation(createMockAudio());
    const saveSpy = vi.spyOn(sim, 'saveToStorage');
    sim.beginBuildStroke();
    sim.commitBuildStroke();
    expect(saveSpy).not.toHaveBeenCalled();
    expect(sim.canUndoBuild()).toBe(false);
  });

  it('visitor mode không mở transaction', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.activeVisitNeighborId = 'npc_friend_1';
    sim.homeStateWhileVisiting = { ...sim.state };
    expect(sim.isVisitingNeighbor).toBe(true);
    sim.beginBuildStroke();
    expect(sim.pendingBuildStroke).toBeNull();
    sim.commitBuildStroke();
    expect(sim.undoBuild()).toBe(false);
    expect(sim.redoBuild()).toBe(false);
  });

  it('undo sau remove khôi phục công trình và tài nguyên', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 8_000;
    const plot = getCatalogItem('farmland_plot')!;
    sim.beginBuildStroke();
    expect(sim.placeItem(plot, 12, 16, 0)).toBe(true);
    sim.commitBuildStroke();
    const uid = sim.state.buildings.at(-1)!.uid;
    sim.beginBuildStroke();
    expect(sim.removeAtTile(12, 16)).toBe(true);
    sim.commitBuildStroke();
    expect(sim.state.buildings.some((b) => b.uid === uid)).toBe(false);
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.buildings.some((b) => b.uid === uid)).toBe(true);
  });

  it('undo dùng delta nên giữ nguyên Sickle/Sao kiếm được giữa lúc xây và lúc hoàn tác, đồng thời chặn hoàn tác ô đã gieo hạt', () => {
    const sim = new ParkSimulation(createMockAudio());
    sim.state.galleons = 10_000;
    sim.state.match3.stars = 20;
    const plot = getCatalogItem('farmland_plot')!;

    sim.beginBuildStroke();
    expect(sim.placeItem(plot, 14, 16, 0)).toBe(true);
    sim.commitBuildStroke();
    const placed = sim.state.buildings.at(-1)!;
    placed.constructEndsAt = Date.now() - 1000;

    // Người chơi thắng minigame nhận thêm +500 Sickle và +3 Sao sau khi đặt ô
    sim.state.galleons += 500;
    sim.state.match3.stars += 3;
    expect(sim.undoBuild()).toBe(true);
    expect(sim.state.galleons).toBe(10_500);
    expect(sim.state.match3.stars).toBe(23);

    // Redo lại rồi gieo hạt vào ô đó -> không cho phép undo xoá mất cây trồng đang lớn
    expect(sim.redoBuild()).toBe(true);
    const redone = sim.state.buildings.find((b) => b.uid === placed.uid)!;
    redone.constructEndsAt = Date.now() - 1000;
    redone.cropId = 'ottery_wheat';
    redone.cropReadyAt = Date.now() + 60_000;
    expect(sim.undoBuild()).toBe(false);
    expect(sim.state.buildings.some((b) => b.uid === placed.uid)).toBe(true);
  });
});

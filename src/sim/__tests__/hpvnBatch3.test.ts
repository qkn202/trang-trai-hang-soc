// HPVN: batch 3 of the QA fixes (wage toast, texts, persisted settings, quest title, recipe names, postcard text).
import { describe, expect, it, vi } from 'vitest';
import { FARM_WORKSHOP_RECIPES, FARM_GOODS } from '../../data/catalog';
import { MORPH_INFO } from '../../data/suitcase';
import { formatFlooShareMessage } from '../../hpvn/postcard';
import { secondsToVietnamMidnight } from '../neighborSocial';
import { sanitizeQuestList } from '../simulationData';
import { setFarmStore, ParkSimulation } from '../simulation';

const audio = new Proxy({}, { get: (_t, k) => (k === 'enabled' || k === 'bgmEnabled' ? true : vi.fn()) }) as never;

describe('HPVN batch 3', () => {
  it('20: the first wage charge toasts once and is remembered in the save', () => {
    setFarmStore({ read: () => null, write: () => {} });
    const sim = new ParkSimulation(audio);
    const toasts: string[] = [];
    sim.onToast = (msg) => toasts.push(msg);
    for (let i = 0; i < 1000; i++) sim.update(0.1); // two wage ticks
    expect(toasts.filter((t) => t.startsWith('Lương phụ tá'))).toHaveLength(1);
    expect(sim.state.wageToastShown).toBe(true);
  });

  it('23/24: text fixes in data', () => {
    expect(MORPH_INFO.mystic.badge).not.toMatch(/%G/);
    expect(MORPH_INFO.radiant.badge).toContain('Sickle');
  });

  it('25: the Floo caption has one pair of brackets', () => {
    const msg = formatFlooShareMessage({ parkName: 'Trang Trại Hang Sóc', keeperTitle: 'Người Khai Hoang', level: 1 });
    expect(msg.match(/\[/g)).toHaveLength(1);
    expect(msg.match(/\]/g)).toHaveLength(1);
  });

  it('26: no two bakery recipes show the same name', () => {
    const kitchen = FARM_WORKSHOP_RECIPES.filter((r) => r.workshopGroupId === 'molly_kitchen');
    const names = kitchen.map((r) => r.name ?? FARM_GOODS[r.goodId].name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('27: countdown to VN midnight, and a 130-char quest title survives a reload', () => {
    const noon = Date.UTC(2026, 10, 12, 5, 0, 0); // 12:00 in Vietnam
    expect(secondsToVietnamMidnight(noon)).toBe(12 * 3600);
    const title = 'Thắng 2 màn Khảo Thí Pháp Thuật (Bùa Gặt Honeydukes, Ngũ Ấn Đạo Tặc, Số Học Huyền Bí, Cờ Phù Thủy hoặc Sinh Vật Huyền Bí)';
    const q = { id: 'q1', objectiveType: 'minigame_win', title, targetAmount: 2, progress: 0, rewardSickle: 1, rewardXp: 1 };
    expect(sanitizeQuestList([q] as never, [])[0]?.title).toBe(title);
  });

  it('28: the grid and the brown outline survive a save and a reload', () => {
    let saved: string | null = null;
    setFarmStore({ read: () => saved, write: (j) => { saved = j; } });
    const sim = new ParkSimulation(audio);
    sim.state.settings.showGrid = true;
    sim.state.settings.toonEnabled = true;
    sim.saveToStorage();
    const reloaded = new ParkSimulation(audio);
    expect(reloaded.state.settings.showGrid).toBe(true);
    expect(reloaded.state.settings.toonEnabled).toBe(true);
  });
});

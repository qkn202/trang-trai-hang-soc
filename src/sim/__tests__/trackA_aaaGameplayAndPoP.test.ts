import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BurrowAuthoritativeBackend,
  BurrowServerError,
  MemoryBackendKVStore,
} from '../../../server/burrowBackendCore';
import { getCatalogItem } from '../../data/catalog';
import { generateCandyHogwartsLevel } from '../../data/candyHogwartsLevels';
import { MagicalAudio } from '../../engine/audio';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';
import {
  clampUnverifiedLeaderboardStats,
  ProofOfPlayRecorder,
  verifyProofOfPlayEnvelope,
} from '../proofOfPlay';
import {
  ACHIEVEMENT_REGISTRY,
  evaluateAchievements,
  ParkSimulation,
} from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

function createMockAudio(): MagicalAudio {
  return new MagicalAudio();
}

describe('Track A — Native-Grade Gameplay Feel, Proof-of-Play Anti-Cheat & 52 Achievements', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('A1 — Async Cascade Match-3 (Per-Column Busy Locks)', () => {
    it('chỉ khoá các cột tham gia hoán đổi, cho phép hoán đổi song song ở cột xa ngay giữa lúc thác kẹo đang rơi', async () => {
      vi.useFakeTimers();
      const engine = new CandyHogwartsEngine(null, {});
      const baseLevel = generateCandyHogwartsLevel(1);
      engine.loadLevel(baseLevel, { instantAnimations: false });

      // Thiết lập bàn cờ tất định không tự khớp ban đầu nhưng có 2 nước hoán đổi hợp lệ ở 2 đầu bàn cờ:
      // Cặp 1 ở cột 0..1 (hàng 2): hoán đổi (2,0) <-> (2,1) tạo cột 3 viên màu 0 tại cột 0
      // Cặp 2 ở cột 6..7 (hàng 2): hoán đổi (2,6) <-> (2,7) tạo cột 3 viên màu 1 tại cột 7
      const g = (engine as unknown as {
        grid: Array<Array<{ id: number; color: number; special: null; isIngredient: boolean; blocker: null }>>;
      }).grid;
      const size = engine.size;
      let idSeq = 5000;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          // Bàn cờ xen kẽ màu 2, 3, 4, 5 không có bất kỳ bộ 3 nào
          const safeColor = 2 + ((r * 2 + c) % 4);
          g[r]![c] = {
            id: idSeq++,
            color: safeColor,
            special: null,
            isIngredient: false,
            blocker: null,
          };
        }
      }
      // Chuẩn bị bộ 3 dọc màu 0 tại cột 0 khi hoán đổi (2,0) <-> (2,1)
      g[0]![0]!.color = 0;
      g[1]![0]!.color = 0;
      g[2]![1]!.color = 0;
      g[2]![0]!.color = 3;

      // Chuẩn bị bộ 3 dọc màu 1 tại cột 7 khi hoán đổi (2,6) <-> (2,7)
      const rightCol = size - 1;
      const adjCol = size - 2;
      g[0]![rightCol]!.color = 1;
      g[1]![rightCol]!.color = 1;
      g[2]![adjCol]!.color = 1;
      g[2]![rightCol]!.color = 4;

      expect(engine.hasAnyAsyncActivity()).toBe(false);
      expect(engine.isColumnBusy(0)).toBe(false);
      expect(engine.isColumnBusy(rightCol)).toBe(false);

      // Kích hoạt nước đi 1 ở cột 0..1 (không await ngay để kiểm tra trạng thái song song giữa cascade!)
      const swapLeftPromise = engine.trySwap({ r: 2, c: 0 }, { r: 2, c: 1 });

      // Tiến 40ms: đang ở giữa hoạt ảnh hoán đổi / nổ của cột 0..1
      await vi.advanceTimersByTimeAsync(40);

      expect(engine.busy).toBe(false); // Toàn bàn KHÔNG bị khoá cứng!
      expect(engine.hasAnyAsyncActivity()).toBe(true);
      expect(engine.isColumnBusy(0)).toBe(true);
      expect(engine.isColumnBusy(1)).toBe(true);
      expect(engine.isColumnBusy(adjCol)).toBe(false);
      expect(engine.isColumnBusy(rightCol)).toBe(false);
      // Cột 0..1 đang hoán đổi + biên lân cận cột 2 được khoá bảo vệ, toàn bộ cột 3..7 mở hoàn toàn!
      expect(engine.getLockedColumnsSnapshot()).toEqual([0, 1, 2]);

      // Bấm tiếp nước đi 2 ở cột bên phải ngay trong lúc cột trái đang xử lý cascade!
      const swapRightPromise = engine.trySwap({ r: 2, c: adjCol }, { r: 2, c: rightCol });
      await vi.advanceTimersByTimeAsync(20);
      expect(engine.isColumnBusy(adjCol)).toBe(true);
      expect(engine.isColumnBusy(rightCol)).toBe(true);

      // Giải phóng toàn bộ timer cho cả hai luồng async hoàn tất êm ái
      await vi.runAllTimersAsync();
      const [resLeft, resRight] = await Promise.all([swapLeftPromise, swapRightPromise]);
      expect(resLeft).toBe(true);
      expect(resRight).toBe(true);
      expect(engine.hasAnyAsyncActivity()).toBe(false);
      expect(engine.getLockedColumnsSnapshot()).toEqual([]);
      engine.destroy();
    });
  });

  describe('A2 — 1-Stroke Tactile Farm Care Brush (Batched Plot Sweep)', () => {
    it('gộp nhiều ô ruộng trong 1 nét lướt với batchOperationActive để không spam UI/save giữa chừng', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.match3.stars = 500;
      sim.state.galleons = 5000;
      sim.buyCropSeedWithGold('ottery_wheat', 5);
      const plotCatalog = getCatalogItem('farmland_plot')!;
      const plotUids: string[] = [];

      // Đặt 3 ô ruộng 2x2 liền kề tại vùng trung tâm mở sẵn (18, 20), (20, 20), (22, 20)
      for (let dx = 0; dx < 3; dx++) {
        const placed = sim.placeItem(plotCatalog, 18 + dx * 2, 20, 0);
        expect(placed).toBe(true);
        plotUids.push(sim.state.buildings[sim.state.buildings.length - 1]!.uid);
      }
      // Hoàn tất xây dựng và gieo Lúa Mì Vàng Ottery để sẵn sàng tưới nước Aguamenti 1 nét
      for (const uid of plotUids) {
        const b = sim.state.buildings.find((it) => it.uid === uid)!;
        b.constructEndsAt = 0;
        const planted = sim.plantCropOnPlot(uid, 'ottery_wheat');
        expect(planted.ok).toBe(true);
      }

      let uiFlushCount = 0;
      sim.onUiChange = () => {
        uiFlushCount++;
      };

      // Bắt đầu nét lướt liềm/bình tưới qua 3 ô ruộng liên tiếp
      sim.batchOperationActive = true;
      let wateredCount = 0;
      try {
        for (const uid of plotUids) {
          if (sim.waterCropPlot(uid).ok) wateredCount++;
        }
      } finally {
        sim.batchOperationActive = false;
      }

      expect(wateredCount).toBe(3);
      // Trong suốt lúc batchOperationActive = true, không bị flush DOM trung gian!
      expect(uiFlushCount).toBe(0);
      for (const uid of plotUids) {
        const b = sim.state.buildings.find((it) => it.uid === uid)!;
        expect(b.cropWateredBoost).toBe(true);
      }
    });
  });

  describe('A3 — Deterministic Proof-of-Play (PoP) Anti-Cheat & Server Enforcement', () => {
    it('niêm phong gói PoP < 1.2KB hợp lệ, xác thực chuỗi băm 64-bit trên BurrowAuthoritativeBackend và chặn giả mạo / phát lại', async () => {
      const startEpoch = 1_760_000_000_000;
      let perfCursor = 1000;
      const recorder = new ProofOfPlayRecorder('match3', 12, 0x9e3779b9, startEpoch, perfCursor);

      // Giả lập 9 nước đi của người chơi thật (nhịp 380ms - 620ms mỗi nước)
      for (let i = 0; i < 9; i++) {
        perfCursor += 420 + (i % 3) * 95;
        recorder.recordMove(((i & 7) << 8) | ((i + 1) & 7), perfCursor);
      }

      const envelope = recorder.seal(18_450, startEpoch + 5200, perfCursor + 350);
      const serializedBytes = JSON.stringify(envelope).length;
      expect(serializedBytes).toBeLessThan(1200);

      const pureCheck = verifyProofOfPlayEnvelope(envelope, {
        expectedGameId: 'match3',
        claimedPrimaryStage: 12,
        claimedRatingScore: 12 * 150 + 12 * 25 + 3 * 40,
      });
      expect(pureCheck.ok).toBe(true);

      // Kiểm tra trực tiếp trên BurrowAuthoritativeBackend
      const backend = new BurrowAuthoritativeBackend({ store: new MemoryBackendKVStore() });
      const submitOk = await backend.submitLeaderboardScore({
        uid: 'wizard_harry_01',
        gameId: 'match3',
        entry: {
          name: 'Harry Potter',
          parkName: 'Thung Lũng Hang Sóc',
          house: 'Gryffindor',
          primaryValue: 12,
          ratingScore: 2220,
          totalWins: 12,
          bestStreak: 4,
          proofOfPlay: envelope,
        },
      });
      const savedRow = submitOk.entries.find((e) => e.userId === 'wizard_harry_01');
      expect(savedRow).toBeDefined();
      expect(savedRow?.primaryValue).toBe(12);
      expect(savedRow?.popVerified).toBe(true);

      // 1. Chặn phát lại (Replay Attack) cùng một nonce PoP
      await expect(
        backend.submitLeaderboardScore({
          uid: 'wizard_harry_01',
          gameId: 'match3',
          entry: {
            primaryValue: 12,
            ratingScore: 2300,
            totalWins: 13,
            bestStreak: 5,
            proofOfPlay: envelope,
          },
        })
      ).rejects.toMatchObject({
        reason: 'invalid-proof-of-play',
        httpStatus: 422,
      } satisfies Partial<BurrowServerError>);

      // 2. Chặn gói tin bơm điểm giả mạo (sửa sessionScore hoặc chainHi trong DevTools)
      const tamperedEnvelope = {
        ...envelope,
        nonce: 'tampered-fresh-nonce',
        sessionScore: 999_999,
      };
      await expect(
        backend.submitLeaderboardScore({
          uid: 'wizard_cheater_99',
          gameId: 'match3',
          entry: {
            primaryValue: 12,
            ratingScore: 999_999,
            totalWins: 12,
            bestStreak: 12,
            proofOfPlay: tamperedEnvelope,
          },
        })
      ).rejects.toMatchObject({
        reason: 'invalid-proof-of-play',
        httpStatus: 422,
      } satisfies Partial<BurrowServerError>);

      // 3. Kẹp trần an toàn cho bản lưu cũ không kèm PoP (chống bơm ratingScore: 9_999_999)
      const clamped = clampUnverifiedLeaderboardStats({
        gameId: 'sudoku',
        primaryValue: 5,
        ratingScore: 9_999_999,
        totalWins: 500_000,
        bestStreak: 99_999,
      });
      expect(clamped.primaryValue).toBe(5);
      expect(clamped.ratingScore).toBeLessThan(120_000);
    });
  });

  describe('A4 — 52 Achievements & Batch Claim Surface', () => {
    it('tính chính xác số huy hiệu chờ nhận (getClaimableRetentionCount) và nhận gộp 1 chạm (claimAllAchievements)', () => {
      expect(ACHIEVEMENT_REGISTRY.length).toBe(52);
      const sim = new ParkSimulation(createMockAudio());
      sim.state.stats.totalGalleonsHarvested = 800;
      sim.state.stats.minigamesWon = 25;

      const unlocked = evaluateAchievements(sim.state, 1000);
      expect(unlocked.length).toBeGreaterThanOrEqual(4);

      const countsBefore = sim.getClaimableRetentionCount();
      expect(countsBefore.claimableAchievements).toBe(unlocked.length);
      expect(countsBefore.total).toBeGreaterThanOrEqual(unlocked.length);

      const galleonsBefore = sim.state.galleons;
      const starsBefore = sim.state.match3.stars;
      const batchRes = sim.claimAllAchievements();

      expect(batchRes.ok).toBe(true);
      expect(batchRes.claimedCount).toBe(unlocked.length);
      expect(batchRes.rewardGalleons).toBeGreaterThan(0);
      expect(sim.state.galleons).toBe(galleonsBefore + batchRes.rewardGalleons);
      expect(sim.state.match3.stars).toBe(starsBefore + batchRes.rewardStars);
      expect(sim.getClaimableRetentionCount().claimableAchievements).toBe(0);
    });
  });
});

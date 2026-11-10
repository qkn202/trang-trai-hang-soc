import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCatalogItem } from '../../data/catalog';
import {
  CURATED_QUIZ_BANK,
  QUIZ_LEXICON_BANK,
  getLanguagePoolStats,
  loadLanguageQuizPack,
} from '../../data/languageQuizBank';
import {
  MILESTONE_BOSS_STAGES,
  getMatch3LevelDef,
  getMilestoneBossMeta,
  isMilestoneBossStage,
} from '../../data/match3Levels';
import { HARVEST_FEAST_TIERS, STORY_CHAPTER_TITLES_VI, STORY_QUESTS } from '../../data/quests';
import { ZONES } from '../../data/zones';
import { MagicalAudio } from '../../engine/audio';
import { SPRITE_KEYS } from '../../engine/spriteLoader';
import { QuizLanguageId } from '../../types/game';
import {
  CaroGameEngine,
  RunicBlockPuzzleEngine,
  SudokuPuzzleEngine,
  WizardChessEngine,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';

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
    playHarvestBubble: vi.fn(),
    playBuildComplete: vi.fn(),
    playLevelUp: vi.fn(),
    playCheekyAlert: vi.fn(),
    playOwlHoot: vi.fn(),
    playMatchPop: vi.fn(),
    playPowerupBlast: vi.fn(),
    playThunder: vi.fn(),
    playCardFound: vi.fn(),
    playWaterSplash: vi.fn(),
    playChessClack: vi.fn(),
    playCrateCrack: vi.fn(),
    playRibbonCut: vi.fn(),
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('Master Upgrade 10/10 Suite (Đợt 1, Đợt 2 & Đợt 3)', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('Đợt 1 — 172 Sprite Plinth-Free & Thung Lũng Sống Động (Dân Làng Đi Dạo)', () => {
    it('đăng ký đúng 172 sprite duy nhất bao gồm rotor động, công trường, khánh thành & 12 sprite cư dân', () => {
      expect(SPRITE_KEYS.length).toBe(172);
      const unique = new Set(SPRITE_KEYS);
      expect(unique.size).toBe(172);

      for (const requiredKey of [
        'prop_windmill_sails',
        'prop_waterwheel_rotor',
        'prop_construction_site',
        'prop_ribbon_unveil',
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
      ]) {
        expect(unique.has(requiredKey as (typeof SPRITE_KEYS)[number])).toBe(true);
      }
    });

    it('mở khoá lũy tiến từ 3 cư dân khởi đầu lên đủ 6 cư dân đi dạo & hỗ trợ vẫy chào kèm cooldown', () => {
      const sim = new ParkSimulation(createMockAudio());
      expect(sim.villagers.length).toBe(3);

      sim.state.level = 30;
      sim.syncValleyVillagers();
      expect(sim.villagers.length).toBe(6);

      sim.update(2.0);
      expect(sim.villagers.every((v) => Number.isFinite(v.gx) && Number.isFinite(v.gy))).toBe(true);

      const gBefore = sim.state.galleons;
      const firstGreet = sim.greetVillager('molly');
      expect(firstGreet.ok).toBe(true);
      expect(firstGreet.bonusGalleons).toBeGreaterThan(0);
      expect(sim.state.galleons).toBe(gBefore + firstGreet.bonusGalleons);

      const secondGreet = sim.greetVillager('molly');
      expect(secondGreet.ok).toBe(true);
      expect(secondGreet.bonusGalleons).toBe(0);
    });
  });

  describe('Đợt 2 — Đại Trùm Mốc, Web Worker Cờ Phù Thủy, Gương Chiếu Hậu Pháp Thuật & 5 Gói Ngữ Liệu', () => {
    it('kích hoạt chính xác 11 Màn Đại Trùm Mốc (25..777) trên cả 5 môn khảo thí', () => {
      expect(MILESTONE_BOSS_STAGES).toEqual([25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 777]);
      expect(isMilestoneBossStage(24)).toBe(false);
      expect(getMilestoneBossMeta(24)).toBeNull();

      for (const stage of MILESTONE_BOSS_STAGES) {
        expect(isMilestoneBossStage(stage)).toBe(true);
        const bossMeta = getMilestoneBossMeta(stage);
        expect(bossMeta?.stage).toBe(stage);
        const m3Def = getMatch3LevelDef(stage);
        expect(m3Def.difficulty).toBe('boss');
        expect(m3Def.title).toContain('👑');
      }

      expect(new CaroGameEngine(100).milestoneBoss?.stage).toBe(100);
      expect(new SudokuPuzzleEngine(200).milestoneBoss?.stage).toBe(200);
      expect(new WizardChessEngine(300).milestoneBoss?.stage).toBe(300);
      expect(new RunicBlockPuzzleEngine(500).milestoneBoss?.stage).toBe(500);
      expect(new CaroGameEngine(42).milestoneBoss).toBeNull();
    });

    it('chạy tính toán nước AI Cờ Phù Thủy độc lập qua exportWorkerPayload + WizardChessEngine.computeAiMoveFromPayload', () => {
      const chess = new WizardChessEngine(2);
      expect(chess.subMode).toBe('match');

      let moved = false;
      for (let r = 0; r < 8 && !moved; r++) {
        for (let c = 0; c < 8 && !moved; c++) {
          const p = chess.board[r][c];
          if (p && p.color === 'w') {
            const legals = chess.getLegalMovesFrom(r, c);
            if (legals.length > 0) {
              chess.clickSquare(r, c);
              const step = chess.clickSquare(legals[0].toR, legals[0].toC);
              expect(step.moved).toBe(true);
              moved = true;
            }
          }
        }
      }
      expect(moved).toBe(true);
      expect(chess.turn).toBe('b');

      const payload = chess.exportWorkerPayload();
      const chosen = WizardChessEngine.computeAiMoveFromPayload(payload);
      expect(chosen).not.toBeNull();

      const applied = chess.applyChosenAiMove(chosen);
      expect(applied?.move).not.toBeNull();
      expect(chess.turn).toBe('w');
    });

    it('sinh dữ liệu Gương Chiếu Hậu Pháp Thuật (getTurningPointReview) sau ván Ngũ Ấn Đạo Tặc & Cờ Phù Thủy', () => {
      const caro = new CaroGameEngine(1);
      // Đặt sẵn 4 ấn trên hàng 6 rồi đi nước thứ 5 quyết định để kết thúc ván và kích hoạt Gương Chiếu Hậu
      caro.grid[6][3] = 1;
      caro.grid[6][4] = 1;
      caro.grid[6][5] = 1;
      caro.grid[6][6] = 1;
      const winStep = caro.playHumanMove(6, 7);
      expect(winStep.ok).toBe(true);
      expect(winStep.won).toBe(true);

      const caroRev = caro.getTurningPointReview();
      expect(caroRev).not.toBeNull();
      expect(caroRev?.mode).toBe('caro');
      expect(caroRev?.highlightCells.length).toBeGreaterThan(0);

      // Cờ Phù Thủy thế cờ chiến thuật (màn 1): dùng trợ giúp đi nước chuẩn hoặc kết thúc ván để kiểm tra Gương Chiếu Hậu
      const tactics = new WizardChessEngine(1);
      expect(tactics.subMode).toBe('tactics');
      for (let guard = 0; guard < 6 && tactics.status === 'playing'; guard++) {
        const assist = tactics.useBestMoveAssist();
        if (!assist.ok) break;
        if (tactics.status === 'playing' && tactics.turn === 'b') {
          tactics.stepAiMove();
        }
      }
      expect(tactics.status === 'won' || tactics.status === 'lost').toBe(true);

      const chessRev = tactics.getTurningPointReview();
      expect(chessRev).not.toBeNull();
      expect(chessRev?.mode).toBe('chess');
      expect(chessRev?.playedCoordVi.length).toBeGreaterThan(0);
      expect(chessRev?.recommendedCoordVi.length).toBeGreaterThan(0);
    });

    it('tải trọn 5 gói ngữ liệu mở rộng (EN/KO/ZH/ES/JA) đạt 549 mục gốc & 1.500+ biến thể câu hỏi', async () => {
      const langs: QuizLanguageId[] = ['en', 'ko', 'zh', 'es', 'ja'];
      for (const lid of langs) {
        const ok = await loadLanguageQuizPack(lid);
        expect(ok).toBe(true);
        const stats = getLanguagePoolStats(lid);
        expect(stats.lexiconCount).toBeGreaterThanOrEqual(79);
        expect(stats.curatedCount).toBeGreaterThanOrEqual(10);
      }

      const totalBase = QUIZ_LEXICON_BANK.length + CURATED_QUIZ_BANK.length;
      expect(totalBase).toBe(549);
      const totalEstimated = langs.reduce(
        (sum, lid) => sum + getLanguagePoolStats(lid).totalQuestionsEstimate,
        0
      );
      expect(totalEstimated).toBeGreaterThanOrEqual(1500);
    });
  });

  describe('Đợt 3 — Lễ Cắt Băng Khánh Thành (🎀), 60 Nhiệm Vụ 10 Chương & Đại Tiệc Mùa Gặt 30 Bậc', () => {
    it('chuyển công trình hết giờ thi công sang trạng thái chờ cắt băng (awaitingUnveil) và thưởng lễ khánh thành không lạm phát Sao', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.level = 30;
      sim.state.unlockedZones = ZONES.map((z) => z.id);
      sim.state.match3.stars = 1000;
      sim.state.galleons = 50_000;

      const item = getCatalogItem('burrow_cider_apiary')!;
      expect(sim.placeItem(item, 22, 20, 0)).toBe(true);
      const b = sim.state.buildings.find((x) => x.itemId === 'burrow_cider_apiary')!;
      expect(b.constructEndsAt).toBeGreaterThan(Date.now());

      // Mô phỏng công trình đã khởi công trước đó và vừa hoàn tất đồng hồ thi công
      const nowMs = Date.now();
      b.placedAt = nowMs - 12_000;
      b.constructEndsAt = nowMs - 1_000;
      sim.update(0.5);

      expect(b.awaitingUnveil).toBe(true);

      const starsBefore = sim.state.match3.stars;
      const goldBefore = sim.state.galleons;
      const celebration = sim.unveilBuilding(b.uid);

      expect(celebration).not.toBeNull();
      expect(b.awaitingUnveil).toBeUndefined();
      expect(sim.state.galleons).toBeGreaterThan(goldBefore);
      // Không cộng thêm 🌟 Sao Phép Thuật để giữ cân bằng tuyệt đối kho 7.150 🌟
      expect(sim.state.match3.stars).toBe(starsBefore);
      expect(celebration?.feastPoints).toBe(25);
    });

    it('cấu trúc đủ 60 Nhiệm Vụ Cốt Truyện trải đều qua 10 Chương (Chương 1 -> Chương 10)', () => {
      expect(STORY_QUESTS.length).toBe(60);
      const ids = new Set(STORY_QUESTS.map((q) => q.id));
      expect(ids.size).toBe(60);

      for (let ch = 1; ch <= 10; ch++) {
        expect(STORY_CHAPTER_TITLES_VI[ch]).toBeTruthy();
        const inChapter = STORY_QUESTS.filter((q) => q.chapter === ch);
        expect(inChapter.length).toBe(6);
      }
    });

    it('vận hành Đại Tiệc Mùa Gặt 30 Bậc thuần hành động (0% lệ thuộc đồng hồ, 0 🌟 Sao lạm phát, xoay vòng mùa mới)', () => {
      expect(HARVEST_FEAST_TIERS.length).toBe(30);
      for (let i = 1; i < HARVEST_FEAST_TIERS.length; i++) {
        expect(HARVEST_FEAST_TIERS[i].pointsRequired).toBeGreaterThan(
          HARVEST_FEAST_TIERS[i - 1].pointsRequired
        );
      }

      const sim = new ParkSimulation(createMockAudio());
      const starsBefore = sim.state.match3.stars;

      expect(sim.claimHarvestFeastTier(1).ok).toBe(false);

      const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1].pointsRequired;
      sim.addHarvestFeastPoints(maxPts);
      expect(sim.getClaimableHarvestFeastCount()).toBe(30);

      const firstClaim = sim.claimHarvestFeastTier(1);
      expect(firstClaim.ok).toBe(true);
      expect(sim.getClaimableHarvestFeastCount()).toBe(29);

      const restClaim = sim.claimAllHarvestFeastTiers();
      expect(restClaim.ok).toBe(true);
      expect(restClaim.claimedCount).toBe(29);
      expect(sim.getClaimableHarvestFeastCount()).toBe(0);

      expect(sim.state.match3.stars).toBe(starsBefore);

      const nextCycle = sim.startNextHarvestFeastCycle();
      expect(nextCycle.ok).toBe(true);
      expect(sim.ensureHarvestFeast().seasonCycle).toBe(2);
      expect(sim.ensureHarvestFeast().points).toBe(0);
    });
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCandyLevelById } from '../../data/candyHogwartsLevels';
import { FARM_CROPS } from '../../data/catalog';
import {
  getLanguagePoolStats,
  isLanguageQuizPackLoaded,
  loadLanguageQuizPack,
} from '../../data/languageQuizBank';
import { getMatch3LevelDef, MATCH3_BOARD_SIZE } from '../../data/match3Levels';
import { MagicalAudio } from '../../engine/audio';
import { FarmCropId, QuizLanguageId } from '../../types/game';
import { CloudSave } from '../../ui/cloudSave';
import { CandyHogwartsEngine } from '../candyHogwartsEngine';
import {
  createInitialLanguageQuizState,
  generateNextQuizChallenge,
  getProfileSrsSummary,
  recordQuizAttempt,
} from '../languageQuizEngine';
import { Match3BoardEngine } from '../match3Engine';
import {
  CaroGameEngine,
  CreatureOnetEngine,
  RunicBlockPuzzleEngine,
  SudokuPuzzleEngine,
  WizardChessEngine,
} from '../puzzleArcadeEngine';
import {
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
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
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('Commercial Upgrades Suite (Items 1, 2 & 3)', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('Mục 1 — Bùa Trợ Chiến Phượng Hoàng (Chống Reverse-Boosting & Giới hạn 1 lần/lượt thử)', () => {
    it('chỉ trao Bùa qua lao động thật (8 câu Ngoại Ngữ đúng, Đơn Cú & Lò Rèn Kho Đỏ), 0% lỗ hổng cố tình thua', () => {
      const sim = new ParkSimulation(createMockAudio());
      const startTalismans = sim.getPhoenixTalismanCount();
      expect(startTalismans).toBe(1); // 1 Bùa khởi đầu tân thủ

      const cropId = Object.keys(FARM_CROPS)[0] as FarmCropId;
      const chStub = generateNextQuizChallenge(createInitialLanguageQuizState(), 1);

      // 20 lần trả lời SAI liên tiếp -> 0 tiến độ Bùa, 0 Bùa cộng thêm (không thể cố tình thua để nhận trợ giúp)
      for (let i = 0; i < 20; i++) {
        const res = sim.completeSeedLanguageQuizAttempt(cropId, { ...chStub, qId: `wrong_${i}` }, false);
        expect(res.phoenixTalismanAwarded).toBe(0);
        expect(res.talismanProgress).toBe(0);
      }
      expect(sim.getPhoenixTalismanCount()).toBe(startTalismans);

      // 7 câu ĐÚNG đầu tiên -> tiến độ 7/8, chưa trao Bùa
      for (let i = 1; i <= 7; i++) {
        const res = sim.completeSeedLanguageQuizAttempt(cropId, { ...chStub, qId: `ok_${i}` }, true);
        expect(res.phoenixTalismanAwarded).toBe(0);
        expect(res.talismanProgress).toBe(i);
      }
      expect(sim.getPhoenixTalismanCount()).toBe(startTalismans);

      // Câu ĐÚNG thứ 8 -> trao đúng +1 Bùa và reset tiến độ về 0
      const eighth = sim.completeSeedLanguageQuizAttempt(cropId, { ...chStub, qId: 'ok_8' }, true);
      expect(eighth.phoenixTalismanAwarded).toBe(1);
      expect(eighth.talismanProgress).toBe(0);
      expect(sim.getPhoenixTalismanCount()).toBe(startTalismans + 1);

      // Rèn Bùa tại Kho Đỏ từ 1 thành phẩm xưởng + 180G
      const barn = sim.ensureFarmBarn();
      barn.goods.cinnamon_apple_pie = 2;
      sim.state.galleons = 500;
      const forged = sim.craftPhoenixTalismanFromBarn();
      expect(forged.ok).toBe(true);
      expect(sim.getPhoenixTalismanCount()).toBe(startTalismans + 2);
      expect(barn.goods.cinnamon_apple_pie).toBe(1);
      expect(sim.state.galleons).toBe(500 - PHOENIX_FORGE_GOLD_COST);

      // Giao Đơn Hàng Cú: Đơn Đại Tiệc hoặc mỗi đơn thứ 3 trao +1 Bùa
      barn.ordersDelivered = 2; // đơn kế tiếp là đơn thứ 3
      const order = barn.owlOrders[0];
      expect(order).toBeDefined();
      for (const req of order.requirements) {
        if (req.itemId in barn.crops) {
          barn.crops[req.itemId as keyof typeof barn.crops] = req.qty + 2;
        } else {
          barn.goods[req.itemId as keyof typeof barn.goods] = req.qty + 2;
        }
      }
      const owlRes = sim.fulfillFarmOwlOrder(order.id);
      expect(owlRes.ok).toBe(true);
      expect(sim.getPhoenixTalismanCount()).toBe(startTalismans + 3);

      // Trần cứng MAX_PHOENIX_TALISMANS = 12
      sim.grantPhoenixTalisman(50);
      expect(sim.getPhoenixTalismanCount()).toBe(MAX_PHOENIX_TALISMANS);
      const overCap = sim.craftPhoenixTalismanFromBarn();
      expect(overCap.ok).toBe(false);
    });

    it('khóa cứng tối đa 1 lần dùng Bùa Phượng Hoàng trên mỗi lượt thử ở cả 5 môn giải đố', () => {
      // 1. Match-3
      const m3 = new Match3BoardEngine(getMatch3LevelDef(25));
      m3.movesLeft = 0;
      m3.status = 'out_of_moves';
      const m3First = m3.applyPhoenixTalisman();
      expect(m3First.ok).toBe(true);
      expect(m3.talismanUsed).toBe(true);
      expect(m3.movesLeft).toBeGreaterThanOrEqual(5);
      expect(m3.applyPhoenixTalisman().ok).toBe(false);

      // 2. Sudoku
      const sudoku = new SudokuPuzzleEngine(120);
      sudoku.mistakesCount = sudoku.maxMistakes;
      sudoku.status = 'lost';
      const prevFilled = sudoku.filledCount;
      const suFirst = sudoku.applyPhoenixTalisman();
      expect(suFirst.ok).toBe(true);
      expect(sudoku.talismanUsed).toBe(true);
      expect(['playing', 'won']).toContain(sudoku.status);
      expect(sudoku.filledCount).toBeGreaterThan(prevFilled);
      expect(sudoku.applyPhoenixTalisman().ok).toBe(false);

      // 3. Caro
      const caro = new CaroGameEngine(150);
      caro.grid[6][6] = 2;
      const caFirst = caro.applyPhoenixTalisman();
      expect(caFirst.ok).toBe(true);
      expect(caro.talismanUsed).toBe(true);
      expect(caro.hintCell).not.toBeNull();
      expect(caro.applyPhoenixTalisman().ok).toBe(false);

      // 4. Wizard's Chess
      const chess = new WizardChessEngine(45, 'tactics');
      const chFirst = chess.applyPhoenixTalisman();
      expect(chFirst.ok).toBe(true);
      expect(chess.talismanUsed).toBe(true);
      expect(chess.applyPhoenixTalisman().ok).toBe(false);

      // 5. Runic Blocks (Blast & Tangram)
      const blast = new RunicBlockPuzzleEngine(140, 'blast');
      blast.status = 'stuck';
      const blFirst = blast.applyPhoenixTalisman();
      expect(blFirst.ok).toBe(true);
      expect(blast.talismanUsed).toBe(true);
      expect(blast.status).toBe('playing');
      expect(blast.applyPhoenixTalisman().ok).toBe(false);

      const tangram = new RunicBlockPuzzleEngine(30, 'tangram');
      const tgFirst = tangram.applyPhoenixTalisman();
      expect(tgFirst.ok).toBe(true);
      expect(tangram.talismanUsed).toBe(true);
      expect(tangram.applyPhoenixTalisman().ok).toBe(false);
    });

    it('giới hạn Bùa Phượng Hoàng tối đa 1 lần/môn/ngày (tổng 5 lần/ngày trên 5 game), không reset khi chơi lại/qua màn cho tới hết ngày', () => {
      mockLocalStorage.clear();
      const sim = new ParkSimulation(createMockAudio());
      sim.grantPhoenixTalisman(12);
      expect(sim.getPhoenixTalismanCount()).toBe(12);

      const day1Noon = new Date(2026, 10, 11, 12, 0, 0).getTime();
      const day1LateNight = new Date(2026, 10, 11, 23, 59, 0).getTime();
      const day2Morning = new Date(2026, 10, 12, 0, 5, 0).getTime();

      // 1. Dùng lần đầu ở Cờ Phù Thủy trong ngày 1 -> thành công (1/5 môn)
      const chessUse1 = sim.consumePhoenixTalisman('chess', day1Noon);
      expect(chessUse1.ok).toBe(true);
      expect(sim.isPhoenixTalismanUsedToday('chess', day1Noon)).toBe(true);
      expect(sim.getPhoenixTalismanDailyStatus(day1Noon)).toMatchObject({
        usedCount: 1,
        maxDaily: 5,
        remainingToday: 4,
      });

      // 2. Chơi lại / sang màn khác của Cờ Phù Thủy hoặc F5 tải lại trang trong cùng ngày -> VẪN KHÓA!
      const chessRetrySameDay = sim.consumePhoenixTalisman('chess', day1LateNight);
      expect(chessRetrySameDay.ok).toBe(false);
      expect(sim.getPhoenixTalismanCount()).toBe(11);

      sim.saveToStorage();
      const reloadedSim = new ParkSimulation(createMockAudio());
      expect(reloadedSim.isPhoenixTalismanUsedToday('chess', day1LateNight)).toBe(true);
      expect(reloadedSim.consumePhoenixTalisman('chess', day1LateNight).ok).toBe(false);

      // 3. 4 môn còn lại mỗi môn vẫn dùng được đúng 1 lần trong ngày (tổng cộng đủ 5/5 lần/ngày)
      for (const otherKind of ['match3', 'sudoku', 'caro', 'blocks'] as const) {
        expect(reloadedSim.consumePhoenixTalisman(otherKind, day1Noon).ok).toBe(true);
        expect(reloadedSim.consumePhoenixTalisman(otherKind, day1LateNight).ok).toBe(false);
      }

      const fullDayStatus = reloadedSim.getPhoenixTalismanDailyStatus(day1LateNight);
      expect(fullDayStatus.usedCount).toBe(5);
      expect(fullDayStatus.remainingToday).toBe(0);
      expect(reloadedSim.getPhoenixTalismanCount()).toBe(7);

      // 4. Qua 00:00 sang ngày mới -> tự động mở lại 0/5 môn
      const nextDayStatus = reloadedSim.getPhoenixTalismanDailyStatus(day2Morning);
      expect(nextDayStatus.usedCount).toBe(0);
      expect(nextDayStatus.remainingToday).toBe(5);
      expect(reloadedSim.isPhoenixTalismanUsedToday('chess', day2Morning)).toBe(false);
      expect(reloadedSim.consumePhoenixTalisman('chess', day2Morning).ok).toBe(true);
    });
  });

  describe('Mục 2 — Lazy-Loaded 5-Language Packs (EN/KO/ZH/ES/JA) & Leitner 5-Box SRS', () => {
    it('nạp động đủ 5 gói ngôn ngữ (490+ mục gốc / 1.300+ biến thể câu hỏi) và sinh bài tập sạch cho cả 5 thể thức', async () => {
      const langs: QuizLanguageId[] = ['en', 'ko', 'zh', 'es', 'ja'];
      let totalRootItems = 0;
      let totalEstQuestions = 0;

      for (const lang of langs) {
        await loadLanguageQuizPack(lang);
        expect(isLanguageQuizPackLoaded(lang)).toBe(true);
        const stats = getLanguagePoolStats(lang);
        expect(stats.packLoaded).toBe(true);
        expect(stats.lexiconCount + stats.curatedCount).toBeGreaterThanOrEqual(80);
        totalRootItems += stats.lexiconCount + stats.curatedCount;
        totalEstQuestions += stats.totalQuestionsEstimate;

        const qState = createInitialLanguageQuizState();
        qState.activeLang = lang;
        for (const fmt of [
          'grammar_cloze',
          'sentence_builder',
          'vocab_context',
          'dialogue_reply',
          'match_pairs',
        ] as const) {
          qState.preferredFormat = fmt;
          const ch = generateNextQuizChallenge(qState, 55);
          expect(ch.lang).toBe(lang);
          expect(ch.format).toBe(fmt);
          expect(ch.promptVi.length).toBeGreaterThan(3);
          expect(ch.heroSpriteSrc).toMatch(/^\/sprites\/.+\.png$/);
          expect(ch.visualGameKind).toBeDefined();
          if (fmt === 'sentence_builder') {
            expect(ch.visualGameKind).toBe('word_tiles');
            expect(ch.shuffledTokens?.length).toBeGreaterThanOrEqual(2);
            expect(ch.expectedSentenceTokens?.length).toBeGreaterThanOrEqual(2);
          } else if (fmt === 'match_pairs') {
            expect(ch.visualGameKind).toBe('pic_pairs');
            expect(ch.leftCards?.length).toBeGreaterThanOrEqual(3);
            expect(ch.rightCards?.length).toBeGreaterThanOrEqual(3);
            expect(ch.leftCards?.[0]?.spriteSrc).toMatch(/^\/sprites\/.+\.png$/);
            expect(ch.rightCards?.[0]?.spriteSrc).toMatch(/^\/sprites\/.+\.png$/);
          } else {
            expect(['pic_flashcard', 'word_flashcard', 'bubble_pop']).toContain(ch.visualGameKind);
            expect(ch.choices?.length).toBe(4);
            expect(ch.choiceSprites?.length).toBe(4);
            expect(new Set(ch.choiceSprites).size).toBe(4);
            expect(ch.correctIndex).toBeGreaterThanOrEqual(0);
            expect(ch.correctIndex).toBeLessThan(4);
          }
        }
      }

      expect(totalRootItems).toBeGreaterThanOrEqual(480);
      expect(totalEstQuestions).toBeGreaterThanOrEqual(1250);
    });

    it('vận hành chuẩn Leitner 5-Box SRS: thăng Hộp 2 -> 3 -> 4 -> 5 khi đúng và hạ về Hộp 1 ôn gấp khi sai', async () => {
      await loadLanguageQuizPack('en');
      const qState = createInitialLanguageQuizState();
      qState.activeLang = 'en';
      const ch = generateNextQuizChallenge(qState, 25);
      const qId = ch.qId;

      // Đúng lần 1 -> vào Hộp 2
      recordQuizAttempt(qState, ch, true);
      expect(qState.profiles.en.srsBoxes?.[qId]?.box).toBe(2);

      // Đúng liên tiếp -> Hộp 3 -> Hộp 4 -> Hộp 5 (Mastered!)
      recordQuizAttempt(qState, ch, true);
      expect(qState.profiles.en.srsBoxes?.[qId]?.box).toBe(3);
      recordQuizAttempt(qState, ch, true);
      expect(qState.profiles.en.srsBoxes?.[qId]?.box).toBe(4);
      recordQuizAttempt(qState, ch, true);
      expect(qState.profiles.en.srsBoxes?.[qId]?.box).toBe(5);

      const summaryMastered = getProfileSrsSummary(qState.profiles.en);
      expect(summaryMastered.masteredCount).toBe(1);

      // Trả lời SAI -> rớt về Hộp 1 (lapses = 1), hẹn ôn lại sau đúng 2 lượt trả lời
      recordQuizAttempt(qState, ch, false);
      const entryAfterLapse = qState.profiles.en.srsBoxes?.[qId];
      expect(entryAfterLapse?.box).toBe(1);
      expect(entryAfterLapse?.lapses).toBe(1);

      // Sau 2 câu trả lời khác -> mục này trở thành Due (cần ôn ngay)
      recordQuizAttempt(qState, { ...ch, qId: 'other_q_1' }, true);
      recordQuizAttempt(qState, { ...ch, qId: 'other_q_2' }, true);
      const summaryDue = getProfileSrsSummary(qState.profiles.en);
      expect(summaryDue.dueCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Mục 3 — Biến Thể Luật Sạch Màn 120 → 777 Cho Cả 5 Mini-Game', () => {
    it('Sudoku Cổ Điển 9×9 thuần bản gốc (màn 1 → 777): hàng/cột/khối 3×3 chuẩn nghiệm, xung đột trùng số, ghi chú & Hoàn Tác đa bước', () => {
      for (const stage of [1, 25, 120, 244, 500, 777]) {
        const sc = new SudokuPuzzleEngine(stage);
        expect(sc.diagonalRule).toBe(false);
        expect(sc.parityRule).toBe(false);
        expect(sc.maxMistakes).toBe(3);

        for (let i = 0; i < 9; i++) {
          const rowSet = new Set<number>();
          const colSet = new Set<number>();
          for (let j = 0; j < 9; j++) {
            rowSet.add(sc.solution[i][j]);
            colSet.add(sc.solution[j][i]);
            expect(sc.parityMask[i][j]).toBe(0);
            if (sc.initialGiven[i][j]) {
              expect(sc.grid[i][j]).toBe(sc.solution[i][j]);
            }
          }
          expect(rowSet.size).toBe(9);
          expect(colSet.size).toBe(9);
        }

        for (let br = 0; br < 3; br++) {
          for (let bc = 0; bc < 3; bc++) {
            const boxSet = new Set<number>();
            for (let dr = 0; dr < 3; dr++) {
              for (let dc = 0; dc < 3; dc++) {
                boxSet.add(sc.solution[br * 3 + dr][bc * 3 + dc]);
              }
            }
            expect(boxSet.size).toBe(9);
          }
        }
      }

      // Kiểm tra xung đột trùng số hàng ngang, tỉa ghi chú tự động & Hoàn Tác khôi phục cả ghi chú
      const s = new SudokuPuzzleEngine(12);
      const blank = s.selected!;
      expect(blank).toBeTruthy();
      const ans = s.solution[blank.r][blank.c];

      let peerBlank: { r: number; c: number } | null = null;
      let rowGivenCol = -1;
      for (let c = 0; c < 9; c++) {
        if (c !== blank.c && !s.given[blank.r][c] && !peerBlank) {
          peerBlank = { r: blank.r, c };
        }
        if (c !== blank.c && s.given[blank.r][c] && rowGivenCol === -1) {
          rowGivenCol = c;
        }
      }

      if (peerBlank) {
        s.selectCell(peerBlank.r, peerBlank.c);
        s.pencilMode = true;
        s.inputDigit(ans);
        expect((s.notes[peerBlank.r][peerBlank.c] & (1 << ans)) !== 0).toBe(true);
        s.pencilMode = false;
      }

      s.selectCell(blank.r, blank.c);
      const okMove = s.inputDigit(ans);
      expect(okMove.changed).toBe(true);
      expect(okMove.conflict).toBe(false);
      if (peerBlank) {
        // Ghi chú cùng hàng tự xoá như Sudoku gốc
        expect((s.notes[peerBlank.r][peerBlank.c] & (1 << ans)) === 0).toBe(true);
      }

      // Hoàn Tác (Undo) trả lại ô trống VÀ khôi phục ghi chú ở ô peer
      expect(s.canUndo).toBe(true);
      expect(s.undo()).toBe(true);
      expect(s.grid[blank.r][blank.c]).toBe(0);
      if (peerBlank) {
        expect((s.notes[peerBlank.r][peerBlank.c] & (1 << ans)) !== 0).toBe(true);
      }

      // Nhập trùng số đề bài cùng hàng → cả ô nhập lẫn ô đề bài cùng báo xung đột đỏ nhạt
      if (rowGivenCol >= 0) {
        const dupDigit = s.grid[blank.r][rowGivenCol];
        s.selectCell(blank.r, blank.c);
        const dupRes = s.inputDigit(dupDigit);
        expect(dupRes.conflict).toBe(true);
        expect(s.hasConflict(blank.r, blank.c)).toBe(true);
        expect(s.hasConflict(blank.r, rowGivenCol)).toBe(true);
      }

      // Bộ đếm thời gian mm:ss
      expect(s.formatElapsedTime()).toBe('00:00');
      expect(s.tickTimer(65.4)).toBe(true);
      expect(s.formatElapsedTime()).toBe('01:05');
    });

    it('Sudoku Xoá Ô (Del) hoạt động khi đang chọn ô điền, khi lỡ bấm sang ô đề bài/ô trống hoặc khi vừa chạm ngưỡng sai', () => {
      const se = new SudokuPuzzleEngine(20);
      const blank = se.selected!;
      expect(blank).toBeTruthy();
      const correctDigit = se.solution[blank.r][blank.c];
      const wrongDigit = (correctDigit % 9) + 1;

      // 1. Điền số rồi bấm Xoá ngay tại ô đó
      se.inputDigit(correctDigit);
      expect(se.grid[blank.r][blank.c]).toBe(correctDigit);
      expect(se.clearSelectedCell()).toBe(true);
      expect(se.grid[blank.r][blank.c]).toBe(0);

      // 2. Điền sai rồi bấm sang một ô gốc đề bài (given), bấm Xoá vẫn tự tìm và xoá ô sai vừa nhập
      se.selected = { ...blank };
      se.inputDigit(wrongDigit);
      expect(se.grid[blank.r][blank.c]).toBe(wrongDigit);
      outerGiven: for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (se.given[r][c]) {
            se.selected = { r, c };
            break outerGiven;
          }
        }
      }
      expect(se.clearSelectedCell()).toBe(true);
      expect(se.grid[blank.r][blank.c]).toBe(0);
      expect(se.selected).toEqual(blank);

      // 3. Khi chạm ngưỡng sai (status === 'lost'), nút Xoá Ô vẫn xoá được ô sai và mở khoá tiếp tục chơi
      se.mistakesCount = se.maxMistakes - 1;
      se.selected = { ...blank };
      const lostRes = se.inputDigit(wrongDigit);
      expect(lostRes.lost).toBe(true);
      expect(se.status).toBe('lost');
      expect(se.clearSelectedCell()).toBe(true);
      expect(se.grid[blank.r][blank.c]).toBe(0);
      expect(se.status).toBe('playing');
    });

    it('Match-3 Tổ Sáp Mật Ong (level >= 160): sinh sáp đối xứng, 0% soft-lock khi dọn sạch sáp trên bàn', () => {
      let honeyLevel = 160;
      for (let lv = 160; lv <= 175; lv++) {
        const def = getMatch3LevelDef(lv);
        if (def.goals.some((g) => g.kind === 'honey')) {
          honeyLevel = lv;
          break;
        }
      }
      const def = getMatch3LevelDef(honeyLevel);
      expect(def.goals.some((g) => g.kind === 'honey')).toBe(true);
      expect(def.goals.length).toBeLessThanOrEqual(3);

      const eng = new Match3BoardEngine(def);
      const initialHoney = eng.countHoneyOnBoard();
      expect(initialHoney).toBeGreaterThan(0);

      // Xoá toàn bộ sáp trừ 1 ô rồi dùng búa đập ô sáp cuối -> mục tiêu honey hoàn thành ngay lập tức (0% soft-lock!)
      let lastHoneyR = -1;
      let lastHoneyC = -1;
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          if (eng.grid[r][c].honey) {
            if (lastHoneyR === -1) {
              lastHoneyR = r;
              lastHoneyC = c;
            } else {
              eng.grid[r][c].honey = false;
            }
          }
        }
      }
      expect(eng.countHoneyOnBoard()).toBe(1);
      eng.grid[lastHoneyR][lastHoneyC].box = 0;
      const used = eng.useBooster('reparo_hammer', lastHoneyR, lastHoneyC);
      expect(used.ok).toBe(true);
      const honeyGoal = eng.goals.find((g) => g.kind === 'honey')!;
      expect(eng.countHoneyOnBoard()).toBe(0);
      expect(honeyGoal.current).toBe(honeyGoal.target);
    });

    it('Runic Blocks Đá Phong Ấn Hắc Diện 2 Lớp (stage >= 140, blast): nứt lớp 2 -> 1 ở lần nổ đầu, vỡ hoàn toàn ở lần nổ thứ 2', () => {
      const eng = new RunicBlockPuzzleEngine(200, 'blast');
      expect(eng.obsidianRunesCount).toBeGreaterThan(0);

      let obsR = -1;
      let obsC = -1;
      for (let r = 0; r < 8 && obsR === -1; r++) {
        for (let c = 0; c < 8; c++) {
          if (eng.runeLayers[r][c] === 2) {
            obsR = r;
            obsC = c;
            break;
          }
        }
      }
      expect(obsR).toBeGreaterThanOrEqual(0);

      eng.pieces = [
        { uid: 901, cells: [[0, 0]], color: 'topaz', used: false, placedAt: null },
        { uid: 902, cells: [[0, 0]], color: 'emerald', used: false, placedAt: null },
      ];
      const targetCol = obsC === 0 ? 1 : 0;
      for (let c = 0; c < 8; c++) {
        if (c === targetCol) {
          eng.grid[obsR][c] = null;
          eng.runeMask[obsR][c] = false;
          eng.runeLayers[obsR][c] = 0;
        } else if (eng.grid[obsR][c] === null) {
          eng.grid[obsR][c] = 'ruby';
        }
      }

      const runesBefore = eng.runesCleared;
      const blast1 = eng.placePiece(901, obsR, targetCol);
      expect(blast1.ok).toBe(true);
      expect(blast1.linesBlasted).toBeGreaterThanOrEqual(1);
      // Sau lần nổ 1: ô Hắc Diện giảm từ 2 -> 1 lớp và vẫn giữ khối tinh thể trên bàn để nổ lần 2!
      expect(eng.runeLayers[obsR][obsC]).toBe(1);
      expect(eng.runeMask[obsR][obsC]).toBe(true);
      expect(eng.grid[obsR][obsC]).not.toBeNull();

      for (let c = 0; c < 8; c++) {
        if (c !== obsC && c !== targetCol) {
          eng.grid[obsR][c] = 'sapphire';
        }
      }
      eng.grid[obsR][targetCol] = null;
      const blast2 = eng.placePiece(902, obsR, targetCol);
      expect(blast2.ok).toBe(true);
      expect(eng.runeLayers[obsR][obsC]).toBe(0);
      expect(eng.runeMask[obsR][obsC]).toBe(false);
      expect(eng.grid[obsR][obsC]).toBeNull();
      expect(eng.runesCleared).toBeGreaterThan(runesBefore);
    });

    it('Cờ Phù Thủy Hogwarts 1 → 777: 0% trùng lặp FEN xuyên suốt toàn bộ 260 màn Giải Thế Cờ mặc định & thế cờ hợp lệ 100%', () => {
      const seenFens = new Set<string>();
      let tacticalStagesCount = 0;
      const matchStartingFens = new Set<string>();

      for (let stage = 1; stage <= 777; stage++) {
        const we = new WizardChessEngine(stage);
        if (we.subMode === 'tactics') {
          tacticalStagesCount++;
          expect(seenFens.has(we.loadedFen)).toBe(false);
          seenFens.add(we.loadedFen);

          expect(we.findKing('w')).not.toBeNull();
          expect(we.findKing('b')).not.toBeNull();
          expect(we.isInCheck('b')).toBe(false);

          let legalMovesCount = 0;
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              if (we.board[r][c]?.color === 'w') {
                legalMovesCount += we.getLegalMovesFrom(r, c).length;
              }
            }
          }
          expect(legalMovesCount).toBeGreaterThan(0);
        } else if (stage >= 25 && stage <= 180) {
          matchStartingFens.add(we.loadedFen);
        }
      }

      expect(tacticalStagesCount).toBeGreaterThanOrEqual(255);
      expect(seenFens.size).toBe(tacticalStagesCount);
      expect(matchStartingFens.size).toBeGreaterThanOrEqual(12);
    });

    it('Match-3 chuẩn Candy Crush Saga: khóa chạm nổ tại chỗ, kẹo bọc nổ 3×3 hai lần (Double Blast) & Sugar Crush cuối màn', () => {
      const def = getMatch3LevelDef(1);
      const eng = new Match3BoardEngine(def);

      // 1. Không cho phép chạm kích nổ tại chỗ (tryTapCellSpecial luôn trả về acted = false)
      const startMoves = eng.movesLeft;
      eng.grid[3][3].piece = {
        id: 9991,
        kind: 'gem',
        color: 'ruby',
        special: 'rocket_h',
        visR: 3,
        visC: 3,
        scale: 1,
      };
      const tapRes = eng.tryTapCellSpecial(3, 3);
      expect(tapRes.acted).toBe(false);
      expect(eng.movesLeft).toBe(startMoves);

      // 2. Kẹo Bọc (bomb) nổ 3×3 hai lần liên tiếp: phá được lớp băng 2 tầng xung quanh chỉ trong 1 lượt ghép cùng màu!
      for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
        for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
          eng.grid[r][c].hole = false;
          eng.grid[r][c].box = 0;
          eng.grid[r][c].web = false;
          eng.grid[r][c].honey = false;
          eng.grid[r][c].ice = 0;
          eng.grid[r][c].piece = {
            id: 1000 + r * 8 + c,
            kind: 'gem',
            color: (r + c) % 2 === 0 ? 'sapphire' : 'emerald',
            special: 'none',
            visR: r,
            visC: c,
            scale: 1,
          };
        }
      }
      // Ngăn Sugar Crush kích hoạt ngẫu nhiên do cascade trong bước kiểm tra Double Blast
      for (const g of eng.goals) {
        g.target = 9999;
      }
      // Đặt Kẹo Bọc màu ruby ở (4, 2), ghép với 2 viên ruby ở (4, 0) và (4, 1) thông qua tráo (4, 2) <-> (4, 3)
      eng.grid[4][0].piece!.color = 'ruby';
      eng.grid[4][1].piece!.color = 'ruby';
      eng.grid[4][2].piece!.color = 'topaz';
      eng.grid[4][3].piece!.color = 'ruby';
      eng.grid[4][3].piece!.special = 'bomb';
      // Đặt băng 2 lớp ở ô (5, 2) ngay dưới vị trí nổ (4, 2) -> nổ lần 1 giảm ice 2->1, nổ lần 2 giảm ice 1->0!
      eng.grid[5][2].ice = 2;

      const swapBomb = eng.trySwap(4, 2, 4, 3);
      expect(swapBomb.valid).toBe(true);
      expect(eng.grid[5][2].ice).toBe(0);

      // 3. Sugar Crush cuối màn: chuyển toàn bộ lượt dư thành Kẹo Sọc & cộng thưởng
      const sugarEng = new Match3BoardEngine(def);
      sugarEng.movesLeft = 6;
      for (const g of sugarEng.goals) {
        g.current = g.target;
      }
      const hammerSugar = sugarEng.useBooster('reparo_hammer', 2, 2);
      expect(hammerSugar.ok).toBe(true);
      expect(sugarEng.status).toBe('won');
      expect(sugarEng.leftoverMovesConverted).toBe(6);
      expect(sugarEng.movesLeft).toBe(0);
      expect(sugarEng.bonusCoinsFromLeftoverMoves).toBe(60);
    });
  });

  describe('9. Lưu & khôi phục ván Số Học Huyền Bí (Sudoku) khi tắt/bật màn hình', () => {
    it('bảo toàn trọn vẹn bàn cờ, ghi chú nháp, đồng hồ, lỗi sai và lịch sử hoàn tác qua reload localStorage', () => {
      const sim1 = new ParkSimulation(createMockAudio());
      sim1.state.puzzleArcade.sudokuStage = 7;

      const eng1 = new SudokuPuzzleEngine(7);
      const blankCells: Array<{ r: number; c: number }> = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!eng1.given[r][c]) blankCells.push({ r, c });
        }
      }
      expect(blankCells.length).toBeGreaterThanOrEqual(4);

      // 1. Điền đúng ô trống đầu tiên
      const c0 = blankCells[0];
      eng1.selectCell(c0.r, c0.c);
      const resOk = eng1.inputDigit(eng1.solution[c0.r][c0.c]);
      expect(resOk.changed).toBe(true);
      expect(resOk.conflict).toBe(false);

      // 2. Bật chế độ Nháp và ghi chú 2 số vào ô trống thứ hai
      const c1 = blankCells[1];
      eng1.pencilMode = true;
      eng1.selectCell(c1.r, c1.c);
      eng1.inputDigit(2);
      eng1.inputDigit(7);
      const expectedNoteMask = eng1.notes[c1.r][c1.c];
      expect(expectedNoteMask & ((1 << 2) | (1 << 7))).toBe((1 << 2) | (1 << 7));

      // 3. Tắt Nháp, điền sai 1 lần ở ô trống thứ ba để tăng bộ đếm lỗi
      const c2 = blankCells[2];
      eng1.pencilMode = false;
      eng1.selectCell(c2.r, c2.c);
      const wrongDigit = (eng1.solution[c2.r][c2.c] % 9) + 1;
      const resErr = eng1.inputDigit(wrongDigit);
      expect(resErr.conflict).toBe(true);
      expect(eng1.mistakesCount).toBe(1);

      // 4. Dùng 1 Gợi Ý ở ô trống thứ tư và chạy đồng hồ 137.4 giây
      const c3 = blankCells[3];
      eng1.selectCell(c3.r, c3.c);
      eng1.freeHintsLeft = Math.max(0, eng1.freeHintsLeft - 1);
      const hintRes = eng1.useMagicHint();
      expect(hintRes.ok).toBe(true);
      eng1.tickTimer(137.4);

      const savedUndoDepth = eng1.undoStack.length;
      expect(savedUndoDepth).toBeGreaterThanOrEqual(3);

      // Xuất phiên đang chơi dở vào sim1 & lưu xuống localStorage (mô phỏng sự kiện tắt màn hình)
      sim1.state.puzzleArcade.sudokuSession = eng1.exportSession({
        companionCharge: 3,
        snackPieUsed: true,
      });
      sim1.saveToStorage();

      // Mô phỏng trình duyệt di động giải phóng RAM tab khi tắt màn hình và khởi tạo lại từ đầu khi bật màn hình
      const sim2 = new ParkSimulation(createMockAudio());
      const loadedSnap = sim2.state.puzzleArcade.sudokuSession;
      expect(loadedSnap).toBeTruthy();
      expect(loadedSnap?.stage).toBe(7);
      expect(loadedSnap?.companionCharge).toBe(3);
      expect(loadedSnap?.snackPieUsed).toBe(true);

      const eng2 = new SudokuPuzzleEngine(7);
      expect(eng2.restoreSession(loadedSnap)).toBe(true);

      expect(eng2.grid).toEqual(eng1.grid);
      expect(eng2.notes).toEqual(eng1.notes);
      expect(eng2.given).toEqual(eng1.given);
      expect(eng2.initialGiven).toEqual(eng1.initialGiven);
      expect(eng2.mistakesCount).toBe(1);
      expect(eng2.freeHintsLeft).toBe(eng1.freeHintsLeft);
      expect(eng2.elapsedSec).toBeCloseTo(137.4, 2);
      expect(eng2.undoStack.length).toBe(savedUndoDepth);

      // Người chơi bật màn hình lên vẫn có thể bấm Hoàn Tác nước đi sai trước lúc tắt màn hình!
      expect(eng2.undo()).toBe(true);
      expect(eng2.grid[c2.r][c2.c]).toBe(0);

      // Khi thắng màn, phiên lưu dở tự động được dọn sạch để màn kế tiếp mở bàn mới
      sim2.completePuzzleArcadeVictory('sudoku', eng2.reward, {
        sessionScore: 2400,
        efficiency: 1,
      });
      expect(sim2.state.puzzleArcade.sudokuStage).toBe(8);
      expect(sim2.state.puzzleArcade.sudokuSession).toBeNull();

      const engStage8 = new SudokuPuzzleEngine(8);
      expect(engStage8.restoreSession(loadedSnap)).toBe(false);
    });
  });

  describe('10. Lưu & khôi phục ván chơi dở cho 4 game còn lại & CloudSave HPVN (keepalive)', () => {
    it('bảo toàn ván Ngũ Ấn Đạo Tặc (Caro) và cho phép Hoàn Tác sau khi bật lại màn hình', () => {
      const sim1 = new ParkSimulation(createMockAudio());
      sim1.state.puzzleArcade.caroStage = 95;

      const caro1 = new CaroGameEngine(95);
      // Tìm 1 ô trống gần trung tâm để người chơi đi nước đầu
      let targetCell: { r: number; c: number } | null = null;
      for (let r = 4; r <= 8 && !targetCell; r++) {
        for (let c = 4; c <= 8 && !targetCell; c++) {
          if (caro1.grid[r][c] === 0) targetCell = { r, c };
        }
      }
      expect(targetCell).toBeTruthy();

      const hm = caro1.playHumanMove(targetCell!.r, targetCell!.c);
      expect(hm.ok).toBe(true);
      expect(caro1.status).toBe('ai_thinking');

      const ai = caro1.stepAiMove();
      expect(ai).toBeTruthy();
      expect(caro1.status).toBe('playing');

      caro1.freeHintsLeft = Math.max(0, caro1.freeHintsLeft - 1);
      const hint = caro1.useBestMoveHint();
      expect(hint).toBeTruthy();

      sim1.state.puzzleArcade.caroSession = caro1.exportSession({
        companionCharge: 2,
        snackPieUsed: true,
      });
      sim1.saveToStorage();

      const sim2 = new ParkSimulation(createMockAudio());
      const loaded = sim2.state.puzzleArcade.caroSession;
      expect(loaded).toBeTruthy();
      expect(loaded?.stage).toBe(95);
      expect(loaded?.companionCharge).toBe(2);
      expect(loaded?.snackPieUsed).toBe(true);

      const caro2 = new CaroGameEngine(95);
      expect(caro2.restoreSession(loaded)).toBe(true);
      expect(caro2.grid).toEqual(caro1.grid);
      expect(caro2.moveHistory).toEqual(caro1.moveHistory);
      expect(caro2.hintCell).toEqual(hint);
      expect(caro2.freeHintsLeft).toBe(caro1.freeHintsLeft);

      // Vẫn hoàn tác được cặp nước đi trước lúc khóa màn hình
      expect(caro2.undoTurnPair()).toBe(true);
      expect(caro2.grid[targetCell!.r][targetCell!.c]).toBe(0);

      sim2.completePuzzleArcadeVictory('caro', caro2.reward, { sessionScore: 1800 });
      expect(sim2.state.puzzleArcade.caroSession).toBeNull();
    });

    it('bảo toàn thế cờ Cờ Phù Thủy (Wizard Chess), lịch sử Hoàn Tác và quyền nhập thành qua reload', () => {
      const sim1 = new ParkSimulation(createMockAudio());
      sim1.state.puzzleArcade.chessStage = 12;

      const chess1 = new WizardChessEngine(12, 'match');
      // Tìm nước đi hợp lệ đầu tiên của quân Trắng
      let fromSq: { r: number; c: number } | null = null;
      let toSq: { r: number; c: number } | null = null;
      for (let r = 0; r < 8 && !toSq; r++) {
        for (let c = 0; c < 8 && !toSq; c++) {
          const p = chess1.board[r][c];
          if (p && p.color === 'w') {
            const moves = chess1.getLegalMovesFrom(r, c);
            if (moves.length > 0) {
              fromSq = { r, c };
              toSq = { r: moves[0].toR, c: moves[0].toC };
            }
          }
        }
      }
      expect(fromSq).toBeTruthy();
      expect(toSq).toBeTruthy();

      chess1.clickSquare(fromSq!.r, fromSq!.c);
      const resMove = chess1.clickSquare(toSq!.r, toSq!.c);
      expect(resMove.moved).toBe(true);
      if (chess1.status === 'ai_thinking') {
        const aiRes = chess1.stepAiMove();
        expect(aiRes?.move).toBeTruthy();
      }
      const exportedChess1 = chess1.exportSession({
        companionCharge: 4,
        snackPieUsed: false,
      });
      const savedHistoryLen = exportedChess1?.history.length ?? 0;
      expect(savedHistoryLen).toBeGreaterThanOrEqual(2);

      sim1.state.puzzleArcade.chessSession = exportedChess1;
      sim1.saveToStorage();

      const sim2 = new ParkSimulation(createMockAudio());
      const loaded = sim2.state.puzzleArcade.chessSession;
      expect(loaded).toBeTruthy();
      expect(loaded?.stage).toBe(12);
      expect(loaded?.companionCharge).toBe(4);

      const chess2 = new WizardChessEngine(12, 'tactics');
      expect(chess2.restoreSession(loaded)).toBe(true);
      expect(chess2.subMode).toBe('match');
      expect(chess2.board).toEqual(chess1.board);
      expect(chess2.turn).toBe(chess1.turn);
      expect(chess2.castling).toEqual(chess1.castling);
      expect(chess2.exportSession()?.history.length).toBe(savedHistoryLen);

      expect(chess2.undoTurnPair()).toBe(true);
      expect(chess2.board[fromSq!.r][fromSq!.c]?.color).toBe('w');

      sim2.completePuzzleArcadeVictory('chess', chess2.reward, { sessionScore: 2600 });
      expect(sim2.state.puzzleArcade.chessSession).toBeNull();
    });

    it('bảo toàn bàn ghép Sinh Vật Huyền Bí (Onet), số cặp đã ăn, tim đổi bàn và điểm số qua reload', () => {
      const sim1 = new ParkSimulation(createMockAudio());
      sim1.state.puzzleArcade.blockStage = 9;

      const onet1 = new CreatureOnetEngine(9);
      const hintRes = onet1.useHint();
      expect(hintRes.ok).toBe(true);
      expect(hintRes.pair).toBeTruthy();

      const [pA, pB] = hintRes.pair!;
      // Đã auto-select pA khi gọi useHint(), chạm pB để ăn cặp đầu tiên
      const tapRes = onet1.tapCell(pB.r, pB.c);
      expect(tapRes.action).toBe('matched');
      expect(onet1.matchedPairs).toBe(1);
      expect(onet1.score).toBeGreaterThan(0);
      onet1.useManualShuffle(false); // tiêu 1 tim đổi bàn

      sim1.state.puzzleArcade.onetSession = onet1.exportSession({
        companionCharge: 1,
        snackPieUsed: true,
      });
      sim1.saveToStorage();

      const sim2 = new ParkSimulation(createMockAudio());
      const loaded = sim2.state.puzzleArcade.onetSession;
      expect(loaded).toBeTruthy();
      expect(loaded?.stage).toBe(9);

      const onet2 = new CreatureOnetEngine(9);
      expect(onet2.restoreSession(loaded)).toBe(true);
      expect(onet2.grid).toEqual(onet1.grid);
      expect(onet2.matchedPairs).toBe(1);
      expect(onet2.score).toBe(onet1.score);
      expect(onet2.lives).toBe(onet1.lives);

      sim2.completePuzzleArcadeVictory('blocks', onet2.reward, { sessionScore: onet2.score });
      expect(sim2.state.puzzleArcade.onetSession).toBeNull();
    });

    it('bảo toàn màn Bùa Gặt Honeydukes (Match-3), HP Đại Trùm, kẹo phép trên bàn và đẩy ngay lên CloudSave HPVN với keepalive', async () => {
      const sim1 = new ParkSimulation(createMockAudio());
      sim1.state.match3.currentLevel = 20;

      let settledCount = 0;
      const m3Eng1 = new CandyHogwartsEngine(null, {
        onSettled: () => {
          settledCount += 1;
        },
      });
      m3Eng1.loadLevel(getCandyLevelById(20), {
        house: 'gryffindor',
        winStreak: 2,
        instantAnimations: true,
      });

      const initialBossHp = m3Eng1.bossHp;
      m3Eng1.triggerFarmCompanion(3);
      const talismanRes = await m3Eng1.applyPhoenixTalisman();
      expect(talismanRes.ok).toBe(true);
      expect(settledCount).toBeGreaterThanOrEqual(2);
      expect(m3Eng1.bossHp).toBeLessThan(initialBossHp);
      expect(m3Eng1.talismanUsed).toBe(true);

      sim1.state.match3.activeSession = m3Eng1.exportSession({
        movesMadeThisAttempt: 4,
        companionCharge: 2,
        snackPieUsed: true,
      });
      sim1.saveToStorage();

      // Kiểm chứng CloudSave đẩy ngay POST /api/save với keepalive=true trước khi trình duyệt đóng băng JS
      const fetchCalls: Array<{ url: string; init?: RequestInit }> = [];
      vi.stubGlobal('window', {
        dispatchEvent: vi.fn(),
        addEventListener: vi.fn(),
        setInterval: setInterval,
      });
      vi.stubGlobal('navigator', { onLine: true });
      vi.stubGlobal(
        'fetch',
        vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
          fetchCalls.push({ url: String(input), init });
          return {
            ok: true,
            status: 200,
            json: async () => ({ ok: true }),
          } as Response;
        })
      );

      try {
        const cloud = new CloudSave({ endpoint: 'https://hpvn.example/api/save' });
        const uploaded = await cloud.uploadNow({ keepalive: true });
        expect(uploaded).toBe(true);
        expect(fetchCalls.length).toBe(1);
        expect(fetchCalls[0].url).toContain('https://hpvn.example/api/save?userId=');
        expect(fetchCalls[0].init?.method).toBe('POST');
        expect(fetchCalls[0].init?.keepalive).toBe(true);

        const uploadedBody = JSON.parse(String(fetchCalls[0].init?.body ?? '{}'));
        expect(uploadedBody.match3?.activeSession?.levelId).toBe(20);
        expect(uploadedBody.match3?.activeSession?.talismanUsed).toBe(true);
        expect(uploadedBody.match3?.activeSession?.movesMadeThisAttempt).toBe(4);
      } finally {
        vi.unstubAllGlobals();
        vi.stubGlobal('localStorage', mockLocalStorage);
      }

      // Khôi phục lại từ localStorage / CloudSave trên phiên mới
      const sim2 = new ParkSimulation(createMockAudio());
      const loadedM3 = sim2.state.match3.activeSession;
      expect(loadedM3).toBeTruthy();
      expect(loadedM3?.levelId).toBe(20);
      expect(loadedM3?.movesMadeThisAttempt).toBe(4);
      expect(loadedM3?.companionCharge).toBe(2);
      expect(loadedM3?.snackPieUsed).toBe(true);

      const m3Eng2 = new CandyHogwartsEngine(null, {});
      m3Eng2.loadLevel(getCandyLevelById(20), {
        house: 'hufflepuff',
        instantAnimations: true,
      });
      expect(m3Eng2.restoreSession(loadedM3)).toBe(true);
      expect(m3Eng2.house).toBe('gryffindor');
      expect(m3Eng2.movesLeft).toBe(m3Eng1.movesLeft);
      expect(m3Eng2.bossHp).toBe(m3Eng1.bossHp);
      expect(m3Eng2.talismanUsed).toBe(true);
      expect(m3Eng2.exportSession()?.grid).toEqual(m3Eng1.exportSession()?.grid);

      sim2.completeMatch3LevelVictory(15, { sessionScore: 8500 });
      expect(sim2.state.match3.activeSession).toBeNull();

      m3Eng1.destroy();
      m3Eng2.destroy();
    });
  });
});

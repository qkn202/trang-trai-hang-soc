import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FARM_CROPS } from '../../data/catalog';
import {
  getLanguagePoolStats,
  isLanguageQuizPackLoaded,
  loadLanguageQuizPack,
} from '../../data/languageQuizBank';
import { getMatch3LevelDef, MATCH3_BOARD_SIZE } from '../../data/match3Levels';
import { MagicalAudio } from '../../engine/audio';
import { FarmCropId, QuizLanguageId } from '../../types/game';
import {
  createInitialLanguageQuizState,
  generateNextQuizChallenge,
  getProfileSrsSummary,
  recordQuizAttempt,
} from '../languageQuizEngine';
import { Match3BoardEngine } from '../match3Engine';
import {
  CaroGameEngine,
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
    it('Sudoku-X (Đường Chéo Vàng, stage >= 120 chẵn) & Ấn Chẵn/Lẻ (stage >= 240, stage % 3 === 1) chuẩn nghiệm 100%', () => {
      for (const stage of [120, 240, 500, 776]) {
        const sx = new SudokuPuzzleEngine(stage);
        expect(sx.diagonalRule).toBe(true);
        const mainSet = new Set<number>();
        const antiSet = new Set<number>();
        for (let i = 0; i < 9; i++) {
          mainSet.add(sx.solution[i][i]);
          antiSet.add(sx.solution[i][8 - i]);
        }
        expect(mainSet.size).toBe(9);
        expect(antiSet.size).toBe(9);
      }

      // Kiểm tra phát hiện xung đột trên đường chéo chính
      const sx120 = new SudokuPuzzleEngine(120);
      let emptyDiagR = -1;
      for (let i = 0; i < 9; i++) {
        if (!sx120.given[i][i] && emptyDiagR === -1) {
          emptyDiagR = i;
        }
      }
      if (emptyDiagR >= 0) {
        const otherIdx = (emptyDiagR + 4) % 9;
        sx120.grid[otherIdx][otherIdx] = sx120.solution[otherIdx][otherIdx];
        sx120.grid[emptyDiagR][emptyDiagR] = sx120.grid[otherIdx][otherIdx];
        expect(sx120.hasConflict(emptyDiagR, emptyDiagR)).toBe(true);
      }

      // Kiểm tra Ấn Chẵn/Lẻ (stage 244: vừa Đường Chéo Vàng vừa Ấn Chẵn/Lẻ!)
      const sp244 = new SudokuPuzzleEngine(244);
      expect(sp244.diagonalRule).toBe(true);
      expect(sp244.parityRule).toBe(true);

      let parityCells = 0;
      let testedParityConflict = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          const pm = sp244.parityMask[r][c];
          if (pm !== 0) {
            parityCells++;
            const solParity = sp244.solution[r][c] % 2 === 1 ? 1 : 2;
            expect(pm).toBe(solParity);
            if (!testedParityConflict && !sp244.given[r][c]) {
              sp244.grid[r][c] = pm === 1 ? 2 : 1;
              expect(sp244.hasConflict(r, c)).toBe(true);
              sp244.grid[r][c] = 0;
              testedParityConflict = true;
            }
          }
        }
      }
      expect(parityCells).toBeGreaterThanOrEqual(8);
      expect(testedParityConflict).toBe(true);
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
      eng.movesLeft = 6;
      for (const g of eng.goals) {
        g.current = g.target;
      }
      const hammerSugar = eng.useBooster('reparo_hammer', 2, 2);
      expect(hammerSugar.ok).toBe(true);
      expect(eng.status).toBe('won');
      expect(eng.leftoverMovesConverted).toBe(6);
      expect(eng.movesLeft).toBe(0);
      expect(eng.bonusCoinsFromLeftoverMoves).toBe(60);
    });
  });
});

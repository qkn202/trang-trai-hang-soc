import { MAX_MINIGAME_STAGE } from '../data/match3Levels';
import type {
  OfflineGameId,
  OfflineLocalRecordRow,
  OfflineMiniGameState,
  OfflineUiLanguage,
} from './offlineTypes';

export interface OfflineGameCatalogItem {
  id: OfflineGameId;
  icon: string;
  accentHex: string;
  artworkPath: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  badgeVi: string;
  badgeEn: string;
  totalStages: number | null;
}

export const OFFLINE_GAME_CATALOG: ReadonlyArray<OfflineGameCatalogItem> = [
  {
    id: 'match3',
    icon: '🍬',
    accentHex: '#f59e0b',
    artworkPath: './paintings/burrow_attic_bg.jpg',
    titleVi: 'Bùa Gặt Honeydukes',
    titleEn: 'Honeydukes Harvest Match-3',
    subtitleVi: 'Ghép kẹo phép 777 màn • Combo Pháo Hoa, Cầu Vồng & Thần Hộ Mệnh',
    subtitleEn: '777 magical match-3 stages • Explosives, Rainbow & Patronus',
    badgeVi: 'Match-3',
    badgeEn: 'Match-3',
    totalStages: MAX_MINIGAME_STAGE,
  },
  {
    id: 'jigsaw',
    icon: '🖼️',
    accentHex: '#38bdf8',
    artworkPath: './paintings/p1_hogwarts_express.jpg',
    titleVi: 'Tranh Ghép Phép Thuật',
    titleEn: 'Magical Jigsaw Paintings',
    subtitleVi: 'Khôi phục 777 bức họa thế giới phù thủy với mảnh khớp cổ điển',
    subtitleEn: 'Restore 777 wizarding paintings with interlocking pieces',
    badgeVi: 'Jigsaw',
    badgeEn: 'Jigsaw',
    totalStages: MAX_MINIGAME_STAGE,
  },
  {
    id: 'sudoku',
    icon: '🔢',
    accentHex: '#a78bfa',
    artworkPath: './paintings/potions_runes_sudoku_bg.jpg',
    titleVi: 'Số Học Huyền Bí 9×9',
    titleEn: 'Arithmancy Sudoku 9×9',
    subtitleVi: '777 bảng câu đố nghiệm duy nhất • Ghi chú chì & Hoàn tác đa bước',
    subtitleEn: '777 unique-solution boards • Pencil notes & multi-step undo',
    badgeVi: 'Sudoku',
    badgeEn: 'Sudoku',
    totalStages: MAX_MINIGAME_STAGE,
  },
  {
    id: 'blocks',
    icon: '🐾',
    accentHex: '#34d399',
    artworkPath: './paintings/burrow_parlor_bg.jpg',
    titleVi: 'Sinh Vật Huyền Bí',
    titleEn: 'Magical Creatures Connect',
    subtitleVi: 'Nối cặp sinh vật tối đa 3 đoạn gấp khúc qua 777 màn biến hóa',
    subtitleEn: 'Connect matching creatures within 3 segments across 777 stages',
    badgeVi: 'Blocks / Onet',
    badgeEn: 'Blocks / Onet',
    totalStages: MAX_MINIGAME_STAGE,
  },
  {
    id: 'seedQuiz',
    icon: '📚',
    accentHex: '#f472b6',
    artworkPath: './paintings/great_hall_chess_bg.jpg',
    titleVi: 'Học Viện Thần Chú Đa Ngữ',
    titleEn: 'Polyglot Spell Academy',
    subtitleVi: '5 ngôn ngữ Anh • Hàn • Trung • Tây Ban Nha • Nhật & Hộp nhớ SRS',
    subtitleEn: '5 languages EN • KO • ZH • ES • JA with Leitner 5-Box SRS',
    badgeVi: 'Seed Quiz',
    badgeEn: 'Seed Quiz',
    totalStages: null,
  },
];

export function getOfflineCatalogItem(id: OfflineGameId): OfflineGameCatalogItem {
  return OFFLINE_GAME_CATALOG.find((item) => item.id === id) ?? OFFLINE_GAME_CATALOG[0];
}

export function buildLocalRecordRows(
  state: OfflineMiniGameState,
  lang: OfflineUiLanguage = state.settings.language
): OfflineLocalRecordRow[] {
  const isEn = lang === 'en';
  return OFFLINE_GAME_CATALOG.map((item) => {
    switch (item.id) {
      case 'match3': {
        const p = state.match3Progress;
        return {
          gameId: 'match3',
          title: isEn ? item.titleEn : item.titleVi,
          icon: item.icon,
          stageLabel: isEn
            ? `Stage ${p.currentLevel}/${MAX_MINIGAME_STAGE} (${p.maxClearedLevel} cleared)`
            : `Màn ${p.currentLevel}/${MAX_MINIGAME_STAGE} (đã qua ${p.maxClearedLevel})`,
          highScoreLabel: `${p.highScore.toLocaleString('vi-VN')} đ`,
          winsLabel: isEn
            ? `${p.totalWins} wins • Best streak ×${p.bestStreak}`
            : `${p.totalWins} trận thắng • Chuỗi ×${p.bestStreak}`,
          hasActiveSession: Boolean(state.match3 && state.match3.levelId === p.currentLevel),
        };
      }
      case 'jigsaw': {
        const p = state.puzzleArcade.jigsaw;
        return {
          gameId: 'jigsaw',
          title: isEn ? item.titleEn : item.titleVi,
          icon: item.icon,
          stageLabel: isEn
            ? `Stage ${p.currentStage}/${MAX_MINIGAME_STAGE} (${p.restoredPaintings.length} paintings)`
            : `Màn ${p.currentStage}/${MAX_MINIGAME_STAGE} (${p.restoredPaintings.length} tranh)`,
          highScoreLabel: `${p.highScore.toLocaleString('vi-VN')} đ`,
          winsLabel: isEn
            ? `${p.totalWins} wins • Best streak ×${p.bestStreak}`
            : `${p.totalWins} bức hoàn thành • Chuỗi ×${p.bestStreak}`,
          hasActiveSession: Boolean(p.activeSession && p.activeSession.stage === p.currentStage),
        };
      }
      case 'sudoku': {
        const p = state.puzzleArcade.sudoku;
        return {
          gameId: 'sudoku',
          title: isEn ? item.titleEn : item.titleVi,
          icon: item.icon,
          stageLabel: isEn
            ? `Stage ${p.currentStage}/${MAX_MINIGAME_STAGE} (${p.maxClearedStage} cleared)`
            : `Màn ${p.currentStage}/${MAX_MINIGAME_STAGE} (đã qua ${p.maxClearedStage})`,
          highScoreLabel: `${p.highScore.toLocaleString('vi-VN')} đ`,
          winsLabel: isEn
            ? `${p.totalWins} wins • Best streak ×${p.bestStreak}`
            : `${p.totalWins} ván giải • Chuỗi ×${p.bestStreak}`,
          hasActiveSession: Boolean(p.activeSession && p.activeSession.stage === p.currentStage),
        };
      }
      case 'blocks': {
        const p = state.puzzleArcade.blocks;
        return {
          gameId: 'blocks',
          title: isEn ? item.titleEn : item.titleVi,
          icon: item.icon,
          stageLabel: isEn
            ? `Stage ${p.currentStage}/${MAX_MINIGAME_STAGE} (${p.maxClearedStage} cleared)`
            : `Màn ${p.currentStage}/${MAX_MINIGAME_STAGE} (đã qua ${p.maxClearedStage})`,
          highScoreLabel: `${p.highScore.toLocaleString('vi-VN')} đ`,
          winsLabel: isEn
            ? `${p.totalWins} wins • Best streak ×${p.bestStreak}`
            : `${p.totalWins} ván thắng • Chuỗi ×${p.bestStreak}`,
          hasActiveSession: Boolean(p.activeSession && p.activeSession.stage === p.currentStage),
        };
      }
      case 'seedQuiz': {
        const p = state.seedQuiz;
        const accuracy =
          p.totalAnswered > 0 ? Math.round((p.totalCorrect / p.totalAnswered) * 100) : 0;
        return {
          gameId: 'seedQuiz',
          title: isEn ? item.titleEn : item.titleVi,
          icon: item.icon,
          stageLabel: isEn
            ? `${p.totalCorrect} correct (${accuracy}% accuracy)`
            : `${p.totalCorrect} câu đúng (${accuracy}% chính xác)`,
          highScoreLabel: `${p.highScore.toLocaleString('vi-VN')} đ`,
          winsLabel: isEn
            ? `Current ×${p.currentStreak} • Best ×${p.bestStreak}`
            : `Chuỗi hiện tại ×${p.currentStreak} • Kỷ lục ×${p.bestStreak}`,
          hasActiveSession: false,
        };
      }
    }
  });
}

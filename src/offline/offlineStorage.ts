import { MAX_MINIGAME_STAGE } from '../data/match3Levels';
import {
  createInitialLanguageQuizState,
  sanitizeLanguageQuizState,
} from '../sim/languageQuizEngine';
import type {
  CandyHouseId,
  OfflineJigsawProgress,
  OfflineMatch3Progress,
  OfflineMiniGameState,
  OfflinePuzzleDisciplineRecord,
  OfflineSeedQuizProgress,
  OfflineSettingsState,
  OfflineUiLanguage,
  SavedJigsawSession,
  SavedMatch3Session,
  SavedOnetSession,
  SavedSudokuSession,
} from './offlineTypes';

export const OFFLINE_STORAGE_KEY = 'hangsoc-offline-minigames-v1';
export const OFFLINE_IDB_NAME = 'hangsoc-offline-minigames-db';
export const OFFLINE_IDB_STORE = 'kv';
export const OFFLINE_SCHEMA_VERSION = 1 as const;

const VALID_HOUSES: ReadonlySet<CandyHouseId> = new Set([
  'gryffindor',
  'slytherin',
  'ravenclaw',
  'hufflepuff',
]);

function clampInt(val: unknown, min: number, max: number, fallback: number): number {
  const n = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export function createDefaultOfflineState(now = Date.now()): OfflineMiniGameState {
  const quizState = createInitialLanguageQuizState();
  return {
    version: OFFLINE_SCHEMA_VERSION,
    coins: 450,
    xp: 0,
    match3: null,
    match3Progress: {
      currentLevel: 1,
      maxClearedLevel: 0,
      highScore: 0,
      totalWins: 0,
      winStreak: 0,
      bestStreak: 0,
      house: 'gryffindor',
      boosters: {
        reparo_hammer: 3,
        row_col_cannon: 2,
        alohomora_shuffle: 2,
      },
      phoenixTalismans: 3,
    },
    puzzleArcade: {
      jigsaw: {
        currentStage: 1,
        maxClearedStage: 0,
        highScore: 0,
        totalWins: 0,
        bestStreak: 0,
        currentStreak: 0,
        activeSession: null,
        restoredPaintings: [],
      },
      sudoku: {
        currentStage: 1,
        maxClearedStage: 0,
        highScore: 0,
        totalWins: 0,
        bestStreak: 0,
        currentStreak: 0,
        activeSession: null,
      },
      blocks: {
        currentStage: 1,
        maxClearedStage: 0,
        highScore: 0,
        totalWins: 0,
        bestStreak: 0,
        currentStreak: 0,
        activeSession: null,
      },
      phoenixTalismans: 3,
    },
    seedQuiz: {
      quizState,
      highScore: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      currentStreak: 0,
      bestStreak: 0,
    },
    settings: {
      sound: true,
      haptics: true,
      language: 'vi',
    },
    lastActiveGame: null,
    updatedAt: now,
  };
}

function sanitizeDisciplineRecord<TSession>(
  raw: unknown,
  validateSession: (s: unknown) => TSession | null
): OfflinePuzzleDisciplineRecord<TSession> {
  const obj = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const maxClearedStage = clampInt(obj.maxClearedStage, 0, MAX_MINIGAME_STAGE, 0);
  const currentStage = clampInt(
    obj.currentStage,
    1,
    MAX_MINIGAME_STAGE,
    Math.min(MAX_MINIGAME_STAGE, maxClearedStage + 1)
  );
  return {
    currentStage,
    maxClearedStage,
    highScore: clampInt(obj.highScore, 0, 99_999_999, 0),
    totalWins: clampInt(obj.totalWins, 0, 999_999, 0),
    bestStreak: clampInt(obj.bestStreak, 0, 999_999, 0),
    currentStreak: clampInt(obj.currentStreak, 0, 999_999, 0),
    activeSession: validateSession(obj.activeSession),
  };
}

function sanitizeSavedMatch3Session(raw: unknown): SavedMatch3Session | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.levelId !== 'number' || !Array.isArray(obj.grid)) return null;
  return obj as unknown as SavedMatch3Session;
}

function sanitizeSavedJigsawSession(raw: unknown): SavedJigsawSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.stage !== 'number' || typeof obj.placedBitsetB64 !== 'string') return null;
  return obj as unknown as SavedJigsawSession;
}

function sanitizeSavedSudokuSession(raw: unknown): SavedSudokuSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.stage !== 'number' || !Array.isArray(obj.grid) || obj.grid.length !== 9) {
    return null;
  }
  return obj as unknown as SavedSudokuSession;
}

function sanitizeSavedOnetSession(raw: unknown): SavedOnetSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (typeof obj.stage !== 'number' || !Array.isArray(obj.grid)) return null;
  return obj as unknown as SavedOnetSession;
}

/**
 * Migration & sanitization cho mọi phiên bản save (kể cả v0/partial/corrupted object).
 * Không bao giờ ném lỗi để tránh màn hình trắng khi save hỏng.
 */
export function migrateOfflineState(raw: unknown, now = Date.now()): OfflineMiniGameState {
  const defaults = createDefaultOfflineState(now);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return defaults;
  }

  const obj = raw as Record<string, unknown>;

  const rawM3Prog =
    obj.match3Progress && typeof obj.match3Progress === 'object'
      ? (obj.match3Progress as Record<string, unknown>)
      : {};
  const rawBoosters =
    rawM3Prog.boosters && typeof rawM3Prog.boosters === 'object'
      ? (rawM3Prog.boosters as Record<string, unknown>)
      : {};
  const m3MaxCleared = clampInt(rawM3Prog.maxClearedLevel, 0, MAX_MINIGAME_STAGE, 0);
  const rawHouse = String(rawM3Prog.house || 'gryffindor') as CandyHouseId;

  const match3Progress: OfflineMatch3Progress = {
    currentLevel: clampInt(
      rawM3Prog.currentLevel,
      1,
      MAX_MINIGAME_STAGE,
      Math.min(MAX_MINIGAME_STAGE, m3MaxCleared + 1)
    ),
    maxClearedLevel: m3MaxCleared,
    highScore: clampInt(rawM3Prog.highScore, 0, 99_999_999, 0),
    totalWins: clampInt(rawM3Prog.totalWins, 0, 999_999, 0),
    winStreak: clampInt(rawM3Prog.winStreak, 0, 999_999, 0),
    bestStreak: clampInt(rawM3Prog.bestStreak, 0, 999_999, 0),
    house: VALID_HOUSES.has(rawHouse) ? rawHouse : 'gryffindor',
    boosters: {
      reparo_hammer: clampInt(
        rawBoosters.reparo_hammer,
        0,
        999,
        defaults.match3Progress.boosters.reparo_hammer
      ),
      row_col_cannon: clampInt(
        rawBoosters.row_col_cannon,
        0,
        999,
        defaults.match3Progress.boosters.row_col_cannon
      ),
      alohomora_shuffle: clampInt(
        rawBoosters.alohomora_shuffle,
        0,
        999,
        defaults.match3Progress.boosters.alohomora_shuffle
      ),
    },
    phoenixTalismans: clampInt(
      rawM3Prog.phoenixTalismans,
      0,
      99,
      defaults.match3Progress.phoenixTalismans
    ),
  };

  const rawPa =
    obj.puzzleArcade && typeof obj.puzzleArcade === 'object'
      ? (obj.puzzleArcade as Record<string, unknown>)
      : {};
  const baseJigsaw = sanitizeDisciplineRecord(rawPa.jigsaw, sanitizeSavedJigsawSession);
  const rawJigsawObj =
    rawPa.jigsaw && typeof rawPa.jigsaw === 'object'
      ? (rawPa.jigsaw as Record<string, unknown>)
      : {};
  const restoredPaintings = Array.isArray(rawJigsawObj.restoredPaintings)
    ? Array.from(
        new Set(
          rawJigsawObj.restoredPaintings.filter(
            (id): id is string => typeof id === 'string' && id.trim().length > 0
          )
        )
      )
    : [];
  const jigsaw: OfflineJigsawProgress & Record<string, unknown> = {
    ...baseJigsaw,
    restoredPaintings,
  };

  const sudoku = {
    ...sanitizeDisciplineRecord(rawPa.sudoku, sanitizeSavedSudokuSession),
  };
  const blocks = {
    ...sanitizeDisciplineRecord(rawPa.blocks, sanitizeSavedOnetSession),
  };

  const rawSq =
    obj.seedQuiz && typeof obj.seedQuiz === 'object'
      ? (obj.seedQuiz as Record<string, unknown>)
      : {};
  const seedQuiz: OfflineSeedQuizProgress & Record<string, unknown> = {
    quizState: sanitizeLanguageQuizState(
      rawSq.quizState && typeof rawSq.quizState === 'object'
        ? (rawSq.quizState as Partial<import('../types/game').LanguageQuizState>)
        : undefined
    ),
    highScore: clampInt(rawSq.highScore, 0, 99_999_999, 0),
    totalCorrect: clampInt(rawSq.totalCorrect, 0, 999_999, 0),
    totalAnswered: clampInt(rawSq.totalAnswered, 0, 999_999, 0),
    currentStreak: clampInt(rawSq.currentStreak, 0, 999_999, 0),
    bestStreak: clampInt(rawSq.bestStreak, 0, 999_999, 0),
  };

  const rawSettings =
    obj.settings && typeof obj.settings === 'object'
      ? (obj.settings as Record<string, unknown>)
      : {};
  const lang: OfflineUiLanguage = rawSettings.language === 'en' ? 'en' : 'vi';
  const settings: OfflineSettingsState = {
    sound: typeof rawSettings.sound === 'boolean' ? rawSettings.sound : true,
    haptics: typeof rawSettings.haptics === 'boolean' ? rawSettings.haptics : true,
    language: lang,
  };

  const rawLast = obj.lastActiveGame;
  const lastActiveGame =
    rawLast === 'match3' ||
    rawLast === 'jigsaw' ||
    rawLast === 'sudoku' ||
    rawLast === 'blocks' ||
    rawLast === 'seedQuiz'
      ? rawLast
      : null;

  return {
    version: OFFLINE_SCHEMA_VERSION,
    coins: clampInt(obj.coins, 0, 99_999_999, defaults.coins),
    xp: clampInt(obj.xp, 0, 99_999_999, defaults.xp),
    match3: sanitizeSavedMatch3Session(obj.match3),
    match3Progress,
    puzzleArcade: {
      jigsaw,
      sudoku,
      blocks,
      phoenixTalismans: clampInt(
        rawPa.phoenixTalismans,
        0,
        99,
        defaults.puzzleArcade.phoenixTalismans
      ),
    },
    seedQuiz,
    settings,
    lastActiveGame,
    updatedAt: clampInt(obj.updatedAt, 0, Number.MAX_SAFE_INTEGER, now),
  };
}

function getSafeLocalStorage(custom?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>): Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
> | null {
  if (custom) return custom;
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return localStorage;
    }
  } catch {
    // Storage disabled / private mode SecurityError
  }
  return null;
}

function openOfflineIndexedDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined' || !indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(OFFLINE_IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(OFFLINE_IDB_STORE)) {
          db.createObjectStore(OFFLINE_IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function readIndexedDbPayload(key: string): Promise<string | null> {
  const db = await openOfflineIndexedDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(OFFLINE_IDB_STORE, 'readonly');
      const store = tx.objectStore(OFFLINE_IDB_STORE);
      const req = store.get(key);
      req.onsuccess = () => {
        db.close();
        resolve(typeof req.result === 'string' ? req.result : null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

async function writeIndexedDbPayload(key: string, serialized: string): Promise<boolean> {
  const db = await openOfflineIndexedDb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(OFFLINE_IDB_STORE, 'readwrite');
      const store = tx.objectStore(OFFLINE_IDB_STORE);
      store.put(serialized, key);
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => {
        db.close();
        resolve(false);
      };
      tx.onabort = () => {
        db.close();
        resolve(false);
      };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

async function deleteIndexedDbPayload(key: string): Promise<void> {
  const db = await openOfflineIndexedDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(OFFLINE_IDB_STORE, 'readwrite');
      tx.objectStore(OFFLINE_IDB_STORE).delete(key);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      db.close();
      resolve();
    }
  });
}

/**
 * Đọc đồng bộ từ `localStorage` để render tức thì màn hình đầu tiên 0ms chờ.
 * Tự động tạo state mặc định nếu rỗng hoặc JSON hỏng.
 */
export function loadOfflineStateSync(
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
): { state: OfflineMiniGameState; recoveredFromCorruption: boolean } {
  const store = getSafeLocalStorage(storage);
  if (!store) {
    return { state: createDefaultOfflineState(), recoveredFromCorruption: false };
  }
  let rawText: string | null = null;
  try {
    rawText = store.getItem(OFFLINE_STORAGE_KEY);
  } catch {
    return { state: createDefaultOfflineState(), recoveredFromCorruption: false };
  }
  if (!rawText || !rawText.trim()) {
    return { state: createDefaultOfflineState(), recoveredFromCorruption: false };
  }
  try {
    const parsed: unknown = JSON.parse(rawText);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { state: createDefaultOfflineState(), recoveredFromCorruption: true };
    }
    return {
      state: migrateOfflineState(parsed),
      recoveredFromCorruption: false,
    };
  } catch {
    return { state: createDefaultOfflineState(), recoveredFromCorruption: true };
  }
}

/**
 * Đọc bất đồng bộ kết hợp IndexedDB (primary chống dọn dẹp trên iOS) + localStorage (fallback).
 * Chọn bản có `updatedAt` mới hơn nếu cả hai cùng hợp lệ.
 */
export async function loadOfflineStateAsync(
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
): Promise<{ state: OfflineMiniGameState; recoveredFromCorruption: boolean }> {
  const syncRes = loadOfflineStateSync(storage);
  const idbRaw = await readIndexedDbPayload(OFFLINE_STORAGE_KEY);
  if (!idbRaw) {
    return syncRes;
  }
  try {
    const idbParsed: unknown = JSON.parse(idbRaw);
    const idbState = migrateOfflineState(idbParsed);
    const store = getSafeLocalStorage(storage);
    const hasLocal = Boolean(store?.getItem(OFFLINE_STORAGE_KEY));
    if (!hasLocal || syncRes.recoveredFromCorruption || idbState.updatedAt > syncRes.state.updatedAt) {
      try {
        store?.setItem(OFFLINE_STORAGE_KEY, idbRaw);
      } catch {
        // Ignore quota errors on mirror write
      }
      return { state: idbState, recoveredFromCorruption: false };
    }
  } catch {
    // Fall back to syncRes
  }
  return syncRes;
}

/**
 * Ghi nguyên tử (atomic): serialize toàn bộ sang chuỗi JSON trước,
 * chỉ ghi xuống `localStorage` + `IndexedDB` sau khi `JSON.stringify` thành công.
 */
export function saveOfflineState(
  state: OfflineMiniGameState,
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
): boolean {
  let serialized: string;
  try {
    const next: OfflineMiniGameState = {
      ...state,
      version: OFFLINE_SCHEMA_VERSION,
      updatedAt: Date.now(),
    };
    state.updatedAt = next.updatedAt;
    serialized = JSON.stringify(next);
  } catch {
    return false;
  }

  let wroteLocal = false;
  const store = getSafeLocalStorage(storage);
  if (store) {
    try {
      store.setItem(OFFLINE_STORAGE_KEY, serialized);
      wroteLocal = true;
    } catch {
      // QuotaExceededError / SecurityError guard
      wroteLocal = false;
    }
  }

  void writeIndexedDbPayload(OFFLINE_STORAGE_KEY, serialized);
  return wroteLocal;
}

/**
 * Xoá sạch tiến trình local của riêng bản Mini-game Offline (tuyệt đối không đụng key game chính).
 */
export function resetOfflineProgress(
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
): OfflineMiniGameState {
  const fresh = createDefaultOfflineState();
  const store = getSafeLocalStorage(storage);
  if (store) {
    try {
      store.removeItem(OFFLINE_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }
  void deleteIndexedDbPayload(OFFLINE_STORAGE_KEY);
  saveOfflineState(fresh, storage);
  return fresh;
}

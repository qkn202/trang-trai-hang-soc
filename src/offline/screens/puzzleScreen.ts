import { MAX_MINIGAME_STAGE } from '../../data/match3Levels';
import {
  createJigsawAtlasBakeCache,
  JIGSAW_PIECE_BOARD,
  JIGSAW_PIECE_LOCKED,
  MasterJigsawEngine,
  resolveJigsawBoardAspect,
  stepJigsawAtlasBake,
  syncLockedPiecesToLayer,
  type JigsawAtlasBakeCache,
} from '../../sim/jigsawEngine';
import {
  CreatureOnetEngine,
  type OnetPoint,
} from '../../sim/onetEngine';
import { SudokuPuzzleEngine } from '../../sim/sudokuEngine';
import type { JigsawTrayFilter } from '../../types/game';
import { sharedOfflineAssets } from '../offlineAssets';
import {
  escapeHtml,
  type OfflineScreenController,
  type OfflineScreenHost,
} from './screenContext';

export type OfflinePuzzleMode = 'jigsaw' | 'sudoku' | 'blocks';

const HINT_COIN_COST = 35;
const SHUFFLE_COIN_COST = 30;
const EXTRA_TIME_COIN_COST = 50;

export class PuzzleOfflineScreen implements OfflineScreenController {
  private readonly host: OfflineScreenHost;
  private mode: OfflinePuzzleMode;
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;

  private jigsawEngine: MasterJigsawEngine | null = null;
  private jigsawBake: JigsawAtlasBakeCache | null = null;
  private draggingBoardPieceIdx: number | null = null;
  private dragOffsetNormX = 0;
  private dragOffsetNormY = 0;

  private sudokuEngine: SudokuPuzzleEngine | null = null;

  private onetEngine: CreatureOnetEngine | null = null;
  private activeConnectPath: { points: OnetPoint[]; expiresAt: number } | null = null;

  private rafId: number | null = null;
  private lastTickMs = 0;
  private resizeObserver: ResizeObserver | null = null;
  private unsubscribeAssetLoad: (() => void) | null = null;
  private victoryHandledForStage: number | null = null;

  constructor(host: OfflineScreenHost, mode: OfflinePuzzleMode) {
    this.host = host;
    this.mode = mode;
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    this.unsubscribeAssetLoad = sharedOfflineAssets.onAssetLoaded(() => {
      if (this.mode === 'jigsaw' && this.jigsawEngine && this.jigsawBake?.waitingOnExternalImage) {
        this.rebuildJigsawBakeCache();
      }
      this.renderCanvasScene();
    });

    this.renderShell();
    this.startOrRestoreCurrentStage(false);
    this.startLoop();

    const stageArea = container.querySelector<HTMLElement>('#offPuzzleStageArea');
    if (typeof ResizeObserver !== 'undefined' && stageArea) {
      this.resizeObserver = new ResizeObserver(() => {
        this.syncCanvasDimensions();
        this.renderCanvasScene();
      });
      this.resizeObserver.observe(stageArea);
    }
  }

  public flushCheckpoint(): void {
    this.persistActiveSession();
  }

  public destroy(): void {
    this.persistActiveSession();
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.unsubscribeAssetLoad?.();
    this.unsubscribeAssetLoad = null;
    this.jigsawEngine = null;
    this.jigsawBake = null;
    this.sudokuEngine = null;
    this.onetEngine = null;
    this.canvas = null;
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  private getModeProgress() {
    return this.host.state.puzzleArcade[this.mode];
  }

  private persistActiveSession(): void {
    const pa = this.host.state.puzzleArcade;
    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      pa.jigsaw.activeSession =
        this.jigsawEngine.status === 'playing' ? this.jigsawEngine.exportSession() : null;
    } else if (this.mode === 'sudoku' && this.sudokuEngine) {
      pa.sudoku.activeSession =
        this.sudokuEngine.status === 'playing' ? this.sudokuEngine.exportSession() : null;
    } else if (this.mode === 'blocks' && this.onetEngine) {
      pa.blocks.activeSession =
        this.onetEngine.status === 'playing' ? this.onetEngine.exportSession() : null;
    }
    this.host.saveCheckpoint();
  }

  private startLoop(): void {
    this.stopLoop();
    if (typeof requestAnimationFrame === 'undefined') return;
    this.lastTickMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const step = (now: number) => {
      const dtSec = Math.max(0, Math.min(0.2, (now - this.lastTickMs) / 1000));
      this.lastTickMs = now;
      this.tick(dtSec);
      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  private stopLoop(): void {
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private tick(dtSec: number): void {
    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      if (this.jigsawBake && this.jigsawBake.bakedPiecesCount < this.jigsawEngine.totalPieces) {
        const done = stepJigsawAtlasBake(this.jigsawBake, this.jigsawEngine, 220);
        if (done) {
          syncLockedPiecesToLayer(this.jigsawBake, this.jigsawEngine);
          this.renderJigsawTray();
        }
      }
      const tRes = this.jigsawEngine.tickTimer(dtSec);
      if (tRes.wholeSecondChanged) {
        this.refreshStatusHeader();
      }
      if (tRes.timedOut) {
        this.host.feedback.error();
        this.renderEndOverlay('lost');
      }
      this.renderCanvasScene();
    } else if (this.mode === 'sudoku' && this.sudokuEngine) {
      if (this.sudokuEngine.status === 'playing') {
        const prevWhole = Math.floor(this.sudokuEngine.elapsedSec);
        this.sudokuEngine.elapsedSec += dtSec;
        if (Math.floor(this.sudokuEngine.elapsedSec) !== prevWhole) {
          this.refreshStatusHeader();
        }
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const tRes = this.onetEngine.tickTimer(dtSec);
      if (tRes.wholeSecondChanged) {
        this.refreshStatusHeader();
      }
      if (tRes.timedOut) {
        this.host.feedback.error();
        this.renderEndOverlay('lost');
      }
      if (this.activeConnectPath && Date.now() >= this.activeConnectPath.expiresAt) {
        this.activeConnectPath = null;
      }
      this.renderCanvasScene();
    }
  }

  private startOrRestoreCurrentStage(forceFresh: boolean): void {
    this.victoryHandledForStage = null;
    this.hideEndOverlay();
    const prog = this.getModeProgress();
    const stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, prog.currentStage));
    prog.currentStage = stage;

    this.jigsawEngine = null;
    this.jigsawBake = null;
    this.sudokuEngine = null;
    this.onetEngine = null;
    this.activeConnectPath = null;

    if (this.mode === 'jigsaw') {
      const eng = new MasterJigsawEngine(stage);
      const saved = this.host.state.puzzleArcade.jigsaw.activeSession;
      if (!forceFresh && saved && saved.stage === stage) {
        eng.restoreSession(saved);
      } else {
        this.host.state.puzzleArcade.jigsaw.activeSession = null;
      }
      this.jigsawEngine = eng;
      this.rebuildJigsawBakeCache();
      this.renderJigsawTray();
    } else if (this.mode === 'sudoku') {
      const eng = new SudokuPuzzleEngine(stage);
      const saved = this.host.state.puzzleArcade.sudoku.activeSession;
      if (!forceFresh && saved && saved.stage === stage) {
        eng.restoreSession(saved);
      } else {
        this.host.state.puzzleArcade.sudoku.activeSession = null;
      }
      this.sudokuEngine = eng;
      this.renderSudokuDomBoard();
    } else {
      const eng = new CreatureOnetEngine(stage);
      const saved = this.host.state.puzzleArcade.blocks.activeSession;
      if (!forceFresh && saved && saved.stage === stage) {
        eng.restoreSession(saved);
      } else {
        this.host.state.puzzleArcade.blocks.activeSession = null;
      }
      this.onetEngine = eng;
    }

    this.syncCanvasDimensions();
    this.refreshStatusHeader();
    this.renderCanvasScene();
    this.host.saveCheckpoint();
  }

  private rebuildJigsawBakeCache(): void {
    if (!this.jigsawEngine) return;
    const area = this.container?.querySelector<HTMLElement>('#offPuzzleCanvasWrap');
    const aw = Math.max(280, area?.clientWidth || 360);
    const ah = Math.max(220, area?.clientHeight || 300);
    const aspect = resolveJigsawBoardAspect(this.jigsawEngine.rows, this.jigsawEngine.cols, aw, ah);
    this.jigsawBake = createJigsawAtlasBakeCache(this.jigsawEngine, sharedOfflineAssets, aspect);
    if (this.jigsawBake) {
      stepJigsawAtlasBake(this.jigsawBake, this.jigsawEngine, 360);
      syncLockedPiecesToLayer(this.jigsawBake, this.jigsawEngine);
    }
  }

  private syncCanvasDimensions(): void {
    if (!this.canvas) return;
    const wrap = this.container?.querySelector<HTMLElement>('#offPuzzleCanvasWrap');
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const cssW = Math.max(260, Math.floor(rect.width || 340));
    const cssH = Math.max(210, Math.floor(rect.height || 280));
    const dpr = typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio || 1) : 1;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }
  }

  private handleVictory(stage: number, rawScore: number, extraPaintingId?: string): void {
    if (this.victoryHandledForStage === stage) return;
    this.victoryHandledForStage = stage;
    this.host.feedback.winFanfare();

    const pa = this.host.state.puzzleArcade;
    const prog = pa[this.mode];
    prog.activeSession = null;
    if (rawScore > prog.highScore) {
      prog.highScore = rawScore;
    }
    prog.totalWins += 1;
    prog.currentStreak += 1;
    if (prog.currentStreak > prog.bestStreak) {
      prog.bestStreak = prog.currentStreak;
    }
    if (prog.currentStreak % 3 === 0) {
      pa.phoenixTalismans = Math.min(99, pa.phoenixTalismans + 1);
    }
    if (stage > prog.maxClearedStage) {
      prog.maxClearedStage = Math.min(MAX_MINIGAME_STAGE, stage);
    }
    if (this.mode === 'jigsaw' && extraPaintingId) {
      if (!pa.jigsaw.restoredPaintings.includes(extraPaintingId)) {
        pa.jigsaw.restoredPaintings.push(extraPaintingId);
      }
    }

    const earnedCoins = 45 + Math.min(80, Math.floor(stage * 2));
    const earnedXp = 35;
    this.host.state.coins += earnedCoins;
    this.host.state.xp += earnedXp;

    prog.currentStage = Math.min(MAX_MINIGAME_STAGE, Math.max(prog.maxClearedStage + 1, stage + 1));
    this.host.saveCheckpoint();
    this.refreshStatusHeader();
    this.renderEndOverlay('won', rawScore);
  }

  // =========================================================================
  // SUDOKU 9x9 DOM BOARD + TOUCH KEYPAD
  // =========================================================================

  private formatElapsed(sec: number): string {
    const s = Math.max(0, Math.floor(sec));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  private renderSudokuDomBoard(): void {
    const hostEl = this.container?.querySelector<HTMLElement>('#offSudokuBoardMount');
    if (!hostEl || !this.sudokuEngine) return;
    const eng = this.sudokuEngine;
    const sel = eng.selected;
    const selDigit =
      sel && eng.grid[sel.r]?.[sel.c] ? eng.grid[sel.r][sel.c] : eng.highlightDigit;

    const cells: string[] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = eng.grid[r][c];
        const given = eng.given[r][c];
        const isSel = sel?.r === r && sel?.c === c;
        const isPeer =
          Boolean(sel) &&
          !isSel &&
          (sel!.r === r ||
            sel!.c === c ||
            (Math.floor(sel!.r / 3) === Math.floor(r / 3) &&
              Math.floor(sel!.c / 3) === Math.floor(c / 3)));
        const isSameDigit = val > 0 && selDigit === val && !isSel;
        const isWrong = eng.isWrongCell(r, c);
        const boxRight = c === 2 || c === 5 ? 'box-r' : '';
        const boxBottom = r === 2 || r === 5 ? 'box-b' : '';

        let inner = '';
        if (val > 0) {
          inner = `<span>${val}</span>`;
        } else if (eng.notes[r][c] !== 0) {
          const mask = eng.notes[r][c];
          const noteSpans: string[] = [];
          for (let d = 1; d <= 9; d++) {
            noteSpans.push(`<i>${(mask & (1 << d)) !== 0 ? d : ''}</i>`);
          }
          inner = `<div class="off-sdk-notes">${noteSpans.join('')}</div>`;
        }

        cells.push(`
          <button
            type="button"
            class="off-sdk-cell ${given ? 'given' : 'editable'} ${isSel ? 'selected' : ''} ${isPeer ? 'peer' : ''} ${isSameDigit ? 'same' : ''} ${isWrong ? 'wrong' : ''} ${boxRight} ${boxBottom}"
            data-sdk-r="${r}"
            data-sdk-c="${c}"
            aria-label="R${r + 1}C${c + 1} ${val > 0 ? val : 'empty'}"
          >${inner}</button>
        `);
      }
    }

    const remCounts = eng.getRemainingDigitCounts();
    const digitsHtml: string[] = [];
    for (let d = 1; d <= 9; d++) {
      const rem = remCounts[d] ?? 0;
      digitsHtml.push(`
        <button
          type="button"
          class="off-sdk-digit-btn ${eng.highlightDigit === d ? 'active' : ''} ${rem === 0 ? 'completed' : ''}"
          data-sdk-digit="${d}"
        >
          <strong>${d}</strong>
          <small>${rem}</small>
        </button>
      `);
    }

    hostEl.innerHTML = `
      <div class="off-sdk-grid" role="grid">${cells.join('')}</div>
      <div class="off-sdk-numpad" role="group" aria-label="1-9 keypad">${digitsHtml.join('')}</div>
    `;

    hostEl.querySelectorAll<HTMLButtonElement>('[data-sdk-r]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.sudokuEngine) return;
        const r = Number(btn.dataset.sdkR);
        const c = Number(btn.dataset.sdkC);
        this.host.feedback.tap();
        this.sudokuEngine.selectCell(r, c);
        this.renderSudokuDomBoard();
        this.persistActiveSession();
      });
    });

    hostEl.querySelectorAll<HTMLButtonElement>('[data-sdk-digit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.sudokuEngine) return;
        const d = Number(btn.dataset.sdkDigit);
        const res = this.sudokuEngine.inputDigit(d);
        if (res.conflict) {
          this.host.feedback.error();
        } else {
          this.host.feedback.tap();
        }
        this.renderSudokuDomBoard();
        this.refreshStatusHeader();
        if (res.won) {
          const score = Math.max(
            600,
            2400 +
              this.sudokuEngine.stage * 35 -
              this.sudokuEngine.mistakesCount * 220 -
              Math.floor(this.sudokuEngine.elapsedSec * 1.5)
          );
          this.handleVictory(this.sudokuEngine.stage, score);
        } else if (res.lost) {
          this.host.state.puzzleArcade.sudoku.currentStreak = 0;
          this.persistActiveSession();
          this.renderEndOverlay('lost');
        } else {
          this.persistActiveSession();
        }
      });
    });
  }

  // =========================================================================
  // JIGSAW TRAY & CANVAS BOARD INTERACTION
  // =========================================================================

  private renderJigsawTray(): void {
    const trayEl = this.container?.querySelector<HTMLElement>('#offJigsawTray');
    if (!trayEl || !this.jigsawEngine) return;
    const eng = this.jigsawEngine;
    const pieces = eng.getFilteredTrayPieces();
    const isEn = this.host.state.settings.language === 'en';

    if (pieces.length === 0) {
      trayEl.innerHTML = `<div class="off-tray-empty">${
        isEn ? 'All filtered pieces are on the board!' : 'Tất cả mảnh trong bộ lọc đã đưa lên bàn!'
      }</div>`;
      return;
    }

    // Render up to 36 visible tray thumbnails at a time for instant mobile scrolling
    const visible = pieces.slice(0, 36);
    trayEl.innerHTML = visible
      .map((pIdx) => {
        const isSel = eng.selectedTrayPieceIdx === pIdx;
        const cornerBadge = eng.isCornerPiece(pIdx)
          ? '⌜'
          : eng.isEdgePiece(pIdx)
            ? '▭'
            : '🧩';
        return `
          <button
            type="button"
            class="off-tray-piece ${isSel ? 'selected' : ''}"
            data-piece-idx="${pIdx}"
            aria-label="Piece ${pIdx + 1}"
          >
            <canvas width="56" height="56" data-thumb-idx="${pIdx}"></canvas>
            <small>${cornerBadge}</small>
          </button>
        `;
      })
      .join('');

    if (this.jigsawBake && this.jigsawBake.bakedPiecesCount > 0) {
      const { strideW, strideH } = this.jigsawBake.metrics;
      trayEl.querySelectorAll<HTMLCanvasElement>('canvas[data-thumb-idx]').forEach((cEl) => {
        const idx = Number(cEl.dataset.thumbIdx);
        if (idx >= (this.jigsawBake?.bakedPiecesCount ?? 0)) return;
        const tCtx = cEl.getContext('2d');
        if (!tCtx || !this.jigsawBake || !this.jigsawEngine) return;
        const r = Math.floor(idx / this.jigsawEngine.cols);
        const c = idx % this.jigsawEngine.cols;
        tCtx.clearRect(0, 0, cEl.width, cEl.height);
        tCtx.drawImage(
          this.jigsawBake.atlasCanvas,
          c * strideW,
          r * strideH,
          strideW,
          strideH,
          2,
          2,
          cEl.width - 4,
          cEl.height - 4
        );
      });
    }

    trayEl.querySelectorAll<HTMLButtonElement>('.off-tray-piece').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.jigsawEngine) return;
        const idx = Number(btn.dataset.pieceIdx);
        this.host.feedback.tap();
        this.jigsawEngine.selectedTrayPieceIdx =
          this.jigsawEngine.selectedTrayPieceIdx === idx ? null : idx;
        this.renderJigsawTray();
        this.renderCanvasScene();
      });
    });
  }

  private getJigsawBoardRect(cw: number, ch: number): { x: number; y: number; w: number; h: number } {
    const aspect = this.jigsawBake?.boardAspect ?? 1.25;
    const pad = Math.min(cw, ch) * 0.05;
    const availW = Math.max(120, cw - pad * 2);
    const availH = Math.max(120, ch - pad * 2);
    let w = availW;
    let h = w / aspect;
    if (h > availH) {
      h = availH;
      w = h * aspect;
    }
    return {
      x: (cw - w) * 0.5,
      y: (ch - h) * 0.5,
      w,
      h,
    };
  }

  private getOnetBoardLayout(cw: number, ch: number, rows: number, cols: number) {
    const pad = Math.min(cw, ch) * 0.06;
    const availW = Math.max(140, cw - pad * 2);
    const availH = Math.max(140, ch - pad * 2);
    const cell = Math.max(18, Math.floor(Math.min(availW / cols, availH / rows)));
    const bw = cell * cols;
    const bh = cell * rows;
    return {
      x: Math.floor((cw - bw) * 0.5),
      y: Math.floor((ch - bh) * 0.5),
      cell,
      bw,
      bh,
    };
  }

  private bindCanvasPointerEvents(): void {
    if (!this.canvas) return;
    const canvas = this.canvas;

    const toCanvasPx = (ev: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / Math.max(1, rect.width);
      const sy = canvas.height / Math.max(1, rect.height);
      return {
        x: (ev.clientX - rect.left) * sx,
        y: (ev.clientY - rect.top) * sy,
      };
    };

    canvas.addEventListener('pointerdown', (ev) => {
      const pt = toCanvasPx(ev);

      if (this.mode === 'jigsaw' && this.jigsawEngine && this.jigsawEngine.status === 'playing') {
        const br = this.getJigsawBoardRect(canvas.width, canvas.height);
        const nx = Math.max(0.02, Math.min(0.98, (pt.x - br.x) / Math.max(1, br.w)));
        const ny = Math.max(0.02, Math.min(0.98, (pt.y - br.y) / Math.max(1, br.h)));

        // If user tapped a piece in the tray, tapping on the board spawns & snaps/drops it right there!
        if (this.jigsawEngine.selectedTrayPieceIdx !== null) {
          const spawnIdx = this.jigsawEngine.selectedTrayPieceIdx;
          this.jigsawEngine.selectedTrayPieceIdx = null;
          if (this.jigsawEngine.spawnTrayPieceOntoBoard(spawnIdx, nx, ny)) {
            this.draggingBoardPieceIdx = spawnIdx;
            this.dragOffsetNormX = 0;
            this.dragOffsetNormY = 0;
            try {
              canvas.setPointerCapture(ev.pointerId);
            } catch {
              // Ignore in synthetic test events
            }
            this.renderJigsawTray();
            this.renderCanvasScene();
            return;
          }
        }

        const hitIdx = this.jigsawEngine.pickBoardPieceAtNorm(nx, ny, 0.045, 0.045);
        if (hitIdx !== null) {
          this.jigsawEngine.elevateCluster(hitIdx);
          const center = this.jigsawEngine.getBoardPieceNormCenter(hitIdx);
          this.draggingBoardPieceIdx = hitIdx;
          this.dragOffsetNormX = center.nx - nx;
          this.dragOffsetNormY = center.ny - ny;
          this.host.feedback.tap();
          try {
            canvas.setPointerCapture(ev.pointerId);
          } catch {
            // Ignore in synthetic test events
          }
          this.renderCanvasScene();
        }
      } else if (this.mode === 'blocks' && this.onetEngine && this.onetEngine.status === 'playing') {
        const lay = this.getOnetBoardLayout(
          canvas.width,
          canvas.height,
          this.onetEngine.rows,
          this.onetEngine.cols
        );
        const c = Math.floor((pt.x - lay.x) / lay.cell);
        const r = Math.floor((pt.y - lay.y) / lay.cell);
        if (r < 0 || r >= this.onetEngine.rows || c < 0 || c >= this.onetEngine.cols) return;

        const res = this.onetEngine.tapCell(r, c);
        if (res.action === 'matched') {
          this.host.feedback.success();
          if (res.waypoints) {
            this.activeConnectPath = {
              points: res.waypoints,
              expiresAt: Date.now() + 280,
            };
          }
          if (res.won) {
            this.handleVictory(this.onetEngine.stage, this.onetEngine.score);
          } else {
            this.persistActiveSession();
          }
        } else if (res.action === 'blocked') {
          this.host.feedback.error();
        } else if (res.action === 'selected' || res.action === 'switched') {
          this.host.feedback.tap();
        }
        if (res.lost) {
          this.host.state.puzzleArcade.blocks.currentStreak = 0;
          this.persistActiveSession();
          this.renderEndOverlay('lost');
        }
        this.refreshStatusHeader();
        this.renderCanvasScene();
      }
    });

    canvas.addEventListener('pointermove', (ev) => {
      if (this.mode !== 'jigsaw' || !this.jigsawEngine || this.draggingBoardPieceIdx === null) {
        return;
      }
      const pt = toCanvasPx(ev);
      const br = this.getJigsawBoardRect(canvas.width, canvas.height);
      const nx = Math.max(0.02, Math.min(0.98, (pt.x - br.x) / Math.max(1, br.w) + this.dragOffsetNormX));
      const ny = Math.max(0.02, Math.min(0.98, (pt.y - br.y) / Math.max(1, br.h) + this.dragOffsetNormY));
      this.jigsawEngine.movePieceClusterToNorm(this.draggingBoardPieceIdx, nx, ny);
      this.renderCanvasScene();
    });

    const finishDrag = () => {
      if (this.mode !== 'jigsaw' || !this.jigsawEngine || this.draggingBoardPieceIdx === null) {
        return;
      }
      const droppedIdx = this.draggingBoardPieceIdx;
      this.draggingBoardPieceIdx = null;
      const br = this.getJigsawBoardRect(canvas.width, canvas.height);
      const res = this.jigsawEngine.dropClusterAndResolve(droppedIdx, br.w, br.h);
      if (res.lockedPieces.length > 0) {
        if (this.jigsawBake) {
          syncLockedPiecesToLayer(this.jigsawBake, this.jigsawEngine);
        }
        this.host.feedback.success();
      } else if (res.mergedWithNeighbor) {
        this.host.feedback.tap();
      }
      this.renderJigsawTray();
      this.refreshStatusHeader();
      this.renderCanvasScene();

      if (res.won) {
        this.handleVictory(
          this.jigsawEngine.stage,
          this.jigsawEngine.score,
          this.jigsawEngine.artwork.paintingId
        );
      } else {
        this.persistActiveSession();
      }
    };

    canvas.addEventListener('pointerup', finishDrag);
    canvas.addEventListener('pointercancel', finishDrag);
  }

  private renderCanvasScene(): void {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    ctx.clearRect(0, 0, cw, ch);

    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      this.drawJigsawCanvas(ctx, cw, ch, this.jigsawEngine);
    } else if (this.mode === 'blocks' && this.onetEngine) {
      this.drawOnetCanvas(ctx, cw, ch, this.onetEngine);
    }
  }

  private drawJigsawCanvas(
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    eng: MasterJigsawEngine
  ): void {
    const br = this.getJigsawBoardRect(cw, ch);

    // Warm parchment frame
    ctx.fillStyle = '#2d1e15';
    ctx.fillRect(br.x - 6, br.y - 6, br.w + 12, br.h + 12);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(br.x - 6, br.y - 6, br.w + 12, br.h + 12);

    ctx.fillStyle = '#1b120d';
    ctx.fillRect(br.x, br.y, br.w, br.h);

    if (this.jigsawBake) {
      if (eng.showGhostPreview) {
        ctx.save();
        ctx.globalAlpha = 0.28;
        ctx.drawImage(this.jigsawBake.sourceCanvas, br.x, br.y, br.w, br.h);
        ctx.restore();
      }

      // Faint grid guide
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 237, 213, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 1; r < eng.rows; r++) {
        const gy = br.y + (br.h * r) / eng.rows;
        ctx.beginPath();
        ctx.moveTo(br.x, gy);
        ctx.lineTo(br.x + br.w, gy);
        ctx.stroke();
      }
      for (let c = 1; c < eng.cols; c++) {
        const gx = br.x + (br.w * c) / eng.cols;
        ctx.beginPath();
        ctx.moveTo(gx, br.y);
        ctx.lineTo(gx, br.y + br.h);
        ctx.stroke();
      }
      ctx.restore();

      // Locked pieces static layer
      ctx.drawImage(this.jigsawBake.lockedCanvas, br.x, br.y, br.w, br.h);

      // Loose board clusters sorted by Z
      const { strideW, strideH, cellW, cellH, padX, padY } = this.jigsawBake.metrics;
      const dstCellW = br.w / eng.cols;
      const dstCellH = br.h / eng.rows;
      const dstPadX = (padX / cellW) * dstCellW;
      const dstPadY = (padY / cellH) * dstCellH;

      const clusters = eng.getBoardClustersSortedByZ(true);
      for (const cl of clusters) {
        for (const idx of cl.members) {
          if (eng.pieceState[idx] !== JIGSAW_PIECE_BOARD) continue;
          if (idx >= this.jigsawBake.bakedPiecesCount) continue;
          const center = eng.getBoardPieceNormCenter(idx);
          const r = Math.floor(idx / eng.cols);
          const c = idx % eng.cols;
          const px = br.x + center.nx * br.w - dstCellW * 0.5 - dstPadX;
          const py = br.y + center.ny * br.h - dstCellH * 0.5 - dstPadY;
          ctx.drawImage(
            this.jigsawBake.atlasCanvas,
            c * strideW,
            r * strideH,
            strideW,
            strideH,
            px,
            py,
            dstCellW + dstPadX * 2,
            dstCellH + dstPadY * 2
          );
        }
      }
    }

    if (eng.selectedTrayPieceIdx !== null) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(br.x + 2, br.y + 2, br.w - 4, br.h - 4);
      ctx.restore();
    }
  }

  private drawOnetCanvas(
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    eng: CreatureOnetEngine
  ): void {
    const lay = this.getOnetBoardLayout(cw, ch, eng.rows, eng.cols);

    for (let r = 0; r < eng.rows; r++) {
      for (let c = 0; c < eng.cols; c++) {
        const spId = eng.grid[r]?.[c];
        if (!spId) continue;
        const sp = CreatureOnetEngine.getSpeciesDef(spId);
        const x = lay.x + c * lay.cell;
        const y = lay.y + r * lay.cell;
        const inset = Math.max(1.5, lay.cell * 0.05);
        const w = lay.cell - inset * 2;
        const h = lay.cell - inset * 2;

        const isSel = eng.selected?.r === r && eng.selected?.c === c;
        const isHint =
          Boolean(eng.hintPair) &&
          ((eng.hintPair![0].r === r && eng.hintPair![0].c === c) ||
            (eng.hintPair![1].r === r && eng.hintPair![1].c === c));

        ctx.fillStyle = isSel ? '#fef08a' : isHint ? '#bae6fd' : '#f5ebd6';
        ctx.fillRect(x + inset, y + inset, w, h);

        ctx.strokeStyle = isSel ? '#ea580c' : isHint ? '#0284c7' : sp.accent || '#92400e';
        ctx.lineWidth = isSel || isHint ? 3 : 1.5;
        ctx.strokeRect(x + inset, y + inset, w, h);

        const img = sharedOfflineAssets.getSpriteImage(sp.spriteKey);
        if (img) {
          const padImg = w * 0.1;
          ctx.drawImage(img, x + inset + padImg, y + inset + padImg, w - padImg * 2, h - padImg * 2);
        } else {
          ctx.fillStyle = '#241912';
          ctx.font = `700 ${Math.max(11, Math.floor(w * 0.34))}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sp.nameVi.slice(0, 2).toUpperCase(), x + lay.cell * 0.5, y + lay.cell * 0.54);
        }
      }
    }

    const pathPoints = this.activeConnectPath?.points ?? eng.hintPath;
    if (pathPoints && pathPoints.length >= 2) {
      ctx.save();
      ctx.strokeStyle = this.activeConnectPath ? '#fde047' : '#38bdf8';
      ctx.lineWidth = Math.max(3, lay.cell * 0.1);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      pathPoints.forEach((pt, idx) => {
        const px = lay.x + (pt.c + 0.5) * lay.cell;
        const py = lay.y + (pt.r + 0.5) * lay.cell;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.restore();
    }
  }

  private refreshStatusHeader(): void {
    if (!this.container) return;
    const isEn = this.host.state.settings.language === 'en';
    const prog = this.getModeProgress();
    const pa = this.host.state.puzzleArcade;

    const coinsEl = this.container.querySelector('#offPaCoins');
    if (coinsEl) coinsEl.textContent = this.host.state.coins.toLocaleString('vi-VN');

    const stageTitle = this.container.querySelector('#offPaStageTitle');
    if (stageTitle) {
      stageTitle.textContent = `${isEn ? 'Stage' : 'Màn'} ${prog.currentStage}`;
    }

    const prevBtn = this.container.querySelector<HTMLButtonElement>('#btnOffPaPrevStage');
    const nextBtn = this.container.querySelector<HTMLButtonElement>('#btnOffPaNextStage');
    const maxUnlocked = Math.min(MAX_MINIGAME_STAGE, prog.maxClearedStage + 1);
    if (prevBtn) prevBtn.disabled = prog.currentStage <= 1;
    if (nextBtn) nextBtn.disabled = prog.currentStage >= maxUnlocked;

    const talEl = this.container.querySelector('#offPaCntTalisman');
    if (talEl) talEl.textContent = `×${pa.phoenixTalismans}`;

    const infoBar = this.container.querySelector('#offPaSubStats');
    if (!infoBar) return;

    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      const e = this.jigsawEngine;
      infoBar.innerHTML = `
        <span>🧩 <b>${e.lockedCount}/${e.totalPieces}</b> (${e.rows}×${e.cols})</span>
        <span>⏱️ <b>${e.formatRemainingTime()}</b></span>
        <span>🏆 <b>${Math.max(prog.highScore, e.score).toLocaleString('vi-VN')}</b></span>
      `;
    } else if (this.mode === 'sudoku' && this.sudokuEngine) {
      const e = this.sudokuEngine;
      infoBar.innerHTML = `
        <span>❌ ${isEn ? 'Mistakes' : 'Lỗi'}: <b>${e.mistakesCount}/${e.maxMistakes}</b></span>
        <span>⏱️ <b>${this.formatElapsed(e.elapsedSec)}</b></span>
        <span>🏆 <b>${prog.highScore.toLocaleString('vi-VN')}</b></span>
      `;
      const pencilBtn = this.container.querySelector('#btnOffSdkPencil');
      pencilBtn?.classList.toggle('active', e.pencilMode);
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const e = this.onetEngine;
      infoBar.innerHTML = `
        <span>🐾 ${isEn ? 'Pairs left' : 'Cặp còn'}: <b>${e.remainingPairs}</b></span>
        <span>⏱️ <b>${e.formatRemainingTime()}</b></span>
        <span>🏆 <b>${Math.max(prog.highScore, e.score).toLocaleString('vi-VN')}</b></span>
      `;
    }
  }

  private renderEndOverlay(outcome: 'won' | 'lost', score = 0): void {
    const overlay = this.container?.querySelector<HTMLElement>('#offPaEndOverlay');
    if (!overlay) return;
    const isEn = this.host.state.settings.language === 'en';
    const prog = this.getModeProgress();

    if (outcome === 'won') {
      overlay.innerHTML = `
        <div class="off-result-card won">
          <div class="off-result-badge">🌟🌟🌟</div>
          <h3>${isEn ? 'Stage Complete!' : 'Phá Đảo Màn Thành Công!'}</h3>
          <p>${isEn ? 'Score' : 'Điểm đạt được'}: <strong>${score.toLocaleString('vi-VN')}</strong></p>
          <div class="off-result-actions">
            <button type="button" class="off-ctrl-btn off-ctrl-primary" id="btnOffPaNextWin">
              ${isEn ? 'Next Stage →' : 'Màn tiếp theo →'}
            </button>
          </div>
        </div>
      `;
    } else {
      const canRescue = this.host.state.coins >= EXTRA_TIME_COIN_COST;
      overlay.innerHTML = `
        <div class="off-result-card lost">
          <div class="off-result-badge">⏳</div>
          <h3>${
            this.mode === 'sudoku'
              ? isEn
                ? 'Too Many Mistakes!'
                : 'Đã Chạm Giới Hạn Lỗi!'
              : isEn
                ? 'Time Up!'
                : 'Hết Thời Gian!'
          }</h3>
          <div class="off-result-actions">
            <button type="button" class="off-ctrl-btn off-ctrl-primary" id="btnOffPaRescue" ${canRescue ? '' : 'disabled'}>
              ${
                this.mode === 'sudoku'
                  ? `➕ +2 ${isEn ? 'Lives' : 'Lượt sai'} (${EXTRA_TIME_COIN_COST} 🪙)`
                  : `⏱️ +90s (${EXTRA_TIME_COIN_COST} 🪙)`
              }
            </button>
            <button type="button" class="off-ctrl-btn" id="btnOffPaRetry">
              🔄 ${isEn ? 'Retry Stage' : 'Chơi lại màn ' + prog.currentStage}
            </button>
          </div>
        </div>
      `;
    }
    overlay.hidden = false;

    overlay.querySelector('#btnOffPaNextWin')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentStage(true);
    });
    overlay.querySelector('#btnOffPaRetry')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentStage(true);
    });
    overlay.querySelector('#btnOffPaRescue')?.addEventListener('click', () => {
      if (this.host.state.coins < EXTRA_TIME_COIN_COST) return;
      this.host.state.coins -= EXTRA_TIME_COIN_COST;
      this.host.feedback.success();
      this.hideEndOverlay();
      if (this.mode === 'jigsaw' && this.jigsawEngine) {
        this.jigsawEngine.addBonusTime(90);
      } else if (this.mode === 'sudoku' && this.sudokuEngine) {
        this.sudokuEngine.maxMistakes += 2;
        this.sudokuEngine.status = 'playing';
      } else if (this.mode === 'blocks' && this.onetEngine) {
        this.onetEngine.reviveWithExtraLives(2, 90);
      }
      this.persistActiveSession();
      this.refreshStatusHeader();
      this.renderCanvasScene();
    });
  }

  private hideEndOverlay(): void {
    const overlay = this.container?.querySelector<HTMLElement>('#offPaEndOverlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.innerHTML = '';
    }
  }

  private renderShell(): void {
    if (!this.container) return;
    const isEn = this.host.state.settings.language === 'en';
    const pa = this.host.state.puzzleArcade;
    const prog = this.getModeProgress();

    const modeTabs: Array<{ id: OfflinePuzzleMode; label: string }> = [
      { id: 'jigsaw', label: isEn ? '🖼️ Jigsaw' : '🖼️ Ghép Tranh' },
      { id: 'sudoku', label: isEn ? '🔢 Sudoku' : '🔢 Số Học' },
      { id: 'blocks', label: isEn ? '🐾 Creatures' : '🐾 Nối Cặp' },
    ];

    const footerToolsHtml =
      this.mode === 'jigsaw'
        ? `
          <button type="button" class="off-booster-btn" data-jfilter="all">🧩 ${isEn ? 'All' : 'Tất cả'}</button>
          <button type="button" class="off-booster-btn" data-jfilter="edges">▭ ${isEn ? 'Edges' : 'Viền'}</button>
          <button type="button" class="off-booster-btn" id="btnOffJigGhost">👁️ ${isEn ? 'Preview' : 'Mẫu'}</button>
          <button type="button" class="off-booster-btn" id="btnOffJigTidy">🧹 ${isEn ? 'Tidy' : 'Gọn bàn'}</button>
          <button type="button" class="off-booster-btn" id="btnOffPaHint">💡 ${isEn ? 'Hint' : 'Gợi ý'}</button>
          <button type="button" class="off-booster-btn off-talisman-btn" id="btnOffPaTalisman">🔥 <small id="offPaCntTalisman">×${pa.phoenixTalismans}</small></button>
        `
        : this.mode === 'sudoku'
          ? `
            <button type="button" class="off-booster-btn" id="btnOffSdkPencil">✏️ ${isEn ? 'Notes' : 'Ghi chú'}</button>
            <button type="button" class="off-booster-btn" id="btnOffSdkErase">⌫ ${isEn ? 'Erase' : 'Xóa ô'}</button>
            <button type="button" class="off-booster-btn" id="btnOffSdkUndo">↩️ ${isEn ? 'Undo' : 'Hoàn tác'}</button>
            <button type="button" class="off-booster-btn" id="btnOffPaHint">💡 ${isEn ? 'Hint' : 'Gợi ý'}</button>
            <button type="button" class="off-booster-btn off-talisman-btn" id="btnOffPaTalisman">🔥 <small id="offPaCntTalisman">×${pa.phoenixTalismans}</small></button>
            <button type="button" class="off-booster-btn" id="btnOffPaRestart">↺ ${isEn ? 'New' : 'Ván mới'}</button>
          `
          : `
            <button type="button" class="off-booster-btn" id="btnOffPaHint">💡 ${isEn ? 'Hint' : 'Gợi ý'}</button>
            <button type="button" class="off-booster-btn" id="btnOffOnetShuffle">🔀 ${isEn ? 'Shuffle' : 'Xáo bài'}</button>
            <button type="button" class="off-booster-btn off-talisman-btn" id="btnOffPaTalisman">🔥 <small id="offPaCntTalisman">×${pa.phoenixTalismans}</small></button>
            <button type="button" class="off-booster-btn" id="btnOffPaRestart">↺ ${isEn ? 'New' : 'Ván mới'}</button>
          `;

    this.container.innerHTML = `
      <section class="off-screen off-puzzle-screen" aria-label="Puzzle Arcade Offline">
        <header class="off-game-topbar">
          <button type="button" class="off-back-btn" id="btnOffPaBack">
            ← ${isEn ? 'Games' : 'Menu'}
          </button>
          <div class="off-stage-nav">
            <button type="button" class="off-icon-btn" id="btnOffPaPrevStage" aria-label="Previous">◀</button>
            <strong id="offPaStageTitle">${isEn ? 'Stage' : 'Màn'} ${prog.currentStage}</strong>
            <button type="button" class="off-icon-btn" id="btnOffPaNextStage" aria-label="Next">▶</button>
          </div>
          <div class="off-topbar-right">
            <span class="off-coin-pill">🪙 <b id="offPaCoins">${this.host.state.coins.toLocaleString('vi-VN')}</b></span>
            <button type="button" class="off-icon-btn" id="btnOffPaRecords" aria-label="Records">🏆</button>
          </div>
        </header>

        <div class="off-mode-tabs toolbar" role="tablist">
          ${modeTabs
            .map(
              (t) => `
              <button
                type="button"
                role="tab"
                aria-selected="${this.mode === t.id ? 'true' : 'false'}"
                class="off-tab-btn ${this.mode === t.id ? 'active' : ''}"
                data-switch-mode="${escapeHtml(t.id)}"
              >${escapeHtml(t.label)}</button>
            `
            )
            .join('')}
        </div>

        <div class="off-pa-substats" id="offPaSubStats"></div>

        <div class="off-pa-stage-area" id="offPuzzleStageArea">
          ${
            this.mode === 'sudoku'
              ? `<div class="off-sdk-mount" id="offSudokuBoardMount"></div>`
              : `<div class="off-canvas-wrap" id="offPuzzleCanvasWrap"><canvas id="offPuzzleCanvas"></canvas></div>`
          }
          ${
            this.mode === 'jigsaw'
              ? `<div class="off-jigsaw-tray" id="offJigsawTray" aria-label="${isEn ? 'Piece tray' : 'Khay mảnh ghép'}"></div>`
              : ''
          }
          <div class="off-result-overlay" id="offPaEndOverlay" hidden></div>
        </div>

        <footer class="off-m3-boosters toolbar">
          ${footerToolsHtml}
        </footer>
      </section>
    `;

    this.canvas = this.container.querySelector<HTMLCanvasElement>('#offPuzzleCanvas');
    if (this.canvas) {
      this.bindCanvasPointerEvents();
    }

    this.container.querySelector('#btnOffPaBack')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.navigateTo('home');
    });
    this.container.querySelector('#btnOffPaRecords')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openRecordsModal(this.mode);
    });
    this.container.querySelectorAll<HTMLButtonElement>('[data-switch-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextMode = btn.dataset.switchMode as OfflinePuzzleMode | undefined;
        if (!nextMode || nextMode === this.mode) return;
        this.host.feedback.tap();
        this.persistActiveSession();
        this.host.navigateTo(nextMode);
      });
    });

    this.container.querySelector('#btnOffPaPrevStage')?.addEventListener('click', () => {
      const p = this.getModeProgress();
      if (p.currentStage <= 1) return;
      this.host.feedback.tap();
      p.currentStage -= 1;
      this.startOrRestoreCurrentStage(true);
    });
    this.container.querySelector('#btnOffPaNextStage')?.addEventListener('click', () => {
      const p = this.getModeProgress();
      const maxUnlocked = Math.min(MAX_MINIGAME_STAGE, p.maxClearedStage + 1);
      if (p.currentStage >= maxUnlocked) return;
      this.host.feedback.tap();
      p.currentStage += 1;
      this.startOrRestoreCurrentStage(true);
    });

    // Jigsaw specific actions
    this.container.querySelectorAll<HTMLButtonElement>('[data-jfilter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.jigsawEngine) return;
        this.host.feedback.tap();
        this.jigsawEngine.trayFilter = (btn.dataset.jfilter as JigsawTrayFilter) || 'all';
        this.renderJigsawTray();
      });
    });
    this.container.querySelector('#btnOffJigGhost')?.addEventListener('click', () => {
      if (!this.jigsawEngine) return;
      this.host.feedback.tap();
      this.jigsawEngine.showGhostPreview = !this.jigsawEngine.showGhostPreview;
      this.renderCanvasScene();
    });
    this.container.querySelector('#btnOffJigTidy')?.addEventListener('click', () => {
      if (!this.jigsawEngine) return;
      this.host.feedback.tap();
      this.jigsawEngine.tidyLooseSinglePieces();
      this.renderJigsawTray();
      this.renderCanvasScene();
    });

    // Sudoku specific actions
    this.container.querySelector('#btnOffSdkPencil')?.addEventListener('click', () => {
      if (!this.sudokuEngine) return;
      this.host.feedback.tap();
      this.sudokuEngine.pencilMode = !this.sudokuEngine.pencilMode;
      this.refreshStatusHeader();
    });
    this.container.querySelector('#btnOffSdkErase')?.addEventListener('click', () => {
      if (!this.sudokuEngine) return;
      this.host.feedback.tap();
      this.sudokuEngine.clearSelectedCell();
      this.renderSudokuDomBoard();
      this.persistActiveSession();
    });
    this.container.querySelector('#btnOffSdkUndo')?.addEventListener('click', () => {
      if (!this.sudokuEngine) return;
      this.host.feedback.tap();
      this.sudokuEngine.undo();
      this.renderSudokuDomBoard();
      this.persistActiveSession();
    });

    // Blocks / Onet shuffle
    this.container.querySelector('#btnOffOnetShuffle')?.addEventListener('click', () => {
      if (!this.onetEngine) return;
      if (this.onetEngine.freeShufflesLeft <= 0 && this.host.state.coins < SHUFFLE_COIN_COST) {
        this.host.feedback.error();
        this.host.showToast(
          isEn ? `Need ${SHUFFLE_COIN_COST} coins!` : `Cần ${SHUFFLE_COIN_COST} 🪙 để xáo bài!`,
          '🪙'
        );
        return;
      }
      const useFree = this.onetEngine.freeShufflesLeft > 0;
      if (!useFree) {
        this.host.state.coins -= SHUFFLE_COIN_COST;
      }
      const res = this.onetEngine.useManualShuffle(useFree);
      this.host.feedback.tap();
      this.host.showToast(res.msg, '🔀');
      this.refreshStatusHeader();
      this.renderCanvasScene();
      this.persistActiveSession();
    });

    // Shared Hint button
    this.container.querySelector('#btnOffPaHint')?.addEventListener('click', () => {
      this.handleUseHint();
    });

    // Shared Phoenix Talisman button
    this.container.querySelector('#btnOffPaTalisman')?.addEventListener('click', () => {
      this.handleUseTalisman();
    });

    this.container.querySelector('#btnOffPaRestart')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentStage(true);
    });
  }

  private handleUseHint(): void {
    const isEn = this.host.state.settings.language === 'en';
    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      if (this.jigsawEngine.freeHintsLeft <= 0 && this.host.state.coins < HINT_COIN_COST) {
        this.host.feedback.error();
        this.host.showToast(
          isEn ? `Need ${HINT_COIN_COST} coins for Hint!` : `Cần ${HINT_COIN_COST} 🪙 để dùng Gợi ý!`,
          '💡'
        );
        return;
      }
      if (this.jigsawEngine.freeHintsLeft > 0) this.jigsawEngine.freeHintsLeft -= 1;
      else this.host.state.coins -= HINT_COIN_COST;

      const res = this.jigsawEngine.useMagicHint();
      if (res.ok) {
        if (this.jigsawBake) syncLockedPiecesToLayer(this.jigsawBake, this.jigsawEngine);
        this.host.feedback.success();
        this.renderJigsawTray();
        this.refreshStatusHeader();
        this.renderCanvasScene();
        if (res.won) {
          this.handleVictory(
            this.jigsawEngine.stage,
            this.jigsawEngine.score,
            this.jigsawEngine.artwork.paintingId
          );
        } else {
          this.persistActiveSession();
        }
      }
    } else if (this.mode === 'sudoku' && this.sudokuEngine) {
      if (this.sudokuEngine.freeHintsLeft <= 0 && this.host.state.coins < HINT_COIN_COST) {
        this.host.feedback.error();
        this.host.showToast(
          isEn ? `Need ${HINT_COIN_COST} coins for Hint!` : `Cần ${HINT_COIN_COST} 🪙 để dùng Gợi ý!`,
          '💡'
        );
        return;
      }
      if (this.sudokuEngine.freeHintsLeft > 0) this.sudokuEngine.freeHintsLeft -= 1;
      else this.host.state.coins -= HINT_COIN_COST;

      const res = this.sudokuEngine.useMagicHint();
      if (res.ok) {
        this.host.feedback.success();
        this.renderSudokuDomBoard();
        this.refreshStatusHeader();
        if (res.won) {
          const score = Math.max(800, 2200 + this.sudokuEngine.stage * 30);
          this.handleVictory(this.sudokuEngine.stage, score);
        } else {
          this.persistActiveSession();
        }
      }
    } else if (this.mode === 'blocks' && this.onetEngine) {
      if (this.onetEngine.freeHintsLeft <= 0 && this.host.state.coins < HINT_COIN_COST) {
        this.host.feedback.error();
        this.host.showToast(
          isEn ? `Need ${HINT_COIN_COST} coins for Hint!` : `Cần ${HINT_COIN_COST} 🪙 để dùng Gợi ý!`,
          '💡'
        );
        return;
      }
      if (this.onetEngine.freeHintsLeft > 0) this.onetEngine.freeHintsLeft -= 1;
      else this.host.state.coins -= HINT_COIN_COST;

      const res = this.onetEngine.useHint();
      if (res.ok) {
        this.host.feedback.tap();
        this.refreshStatusHeader();
        this.renderCanvasScene();
      }
    }
  }

  private handleUseTalisman(): void {
    const pa = this.host.state.puzzleArcade;
    const isEn = this.host.state.settings.language === 'en';
    if (pa.phoenixTalismans <= 0) {
      this.host.feedback.error();
      this.host.showToast(
        isEn
          ? 'Win 3 stages in a row to earn +1 Phoenix Talisman!'
          : 'Thắng chuỗi 3 màn để nhận thêm +1 🔥 Bùa Phượng Hoàng!',
        '🔥'
      );
      return;
    }

    if (this.mode === 'jigsaw' && this.jigsawEngine) {
      const res = this.jigsawEngine.applyPhoenixTalisman();
      if (res.ok) {
        pa.phoenixTalismans = Math.max(0, pa.phoenixTalismans - 1);
        if (this.jigsawBake) syncLockedPiecesToLayer(this.jigsawBake, this.jigsawEngine);
        this.host.feedback.winFanfare();
        this.renderJigsawTray();
        this.refreshStatusHeader();
        this.renderCanvasScene();
        if (res.won) {
          this.handleVictory(
            this.jigsawEngine.stage,
            this.jigsawEngine.score,
            this.jigsawEngine.artwork.paintingId
          );
        } else {
          this.persistActiveSession();
        }
      }
      this.host.showToast(res.msg, res.ok ? '🔥' : '⚠️');
    } else if (this.mode === 'sudoku' && this.sudokuEngine) {
      const res = this.sudokuEngine.applyPhoenixTalisman();
      if (res.ok) {
        pa.phoenixTalismans = Math.max(0, pa.phoenixTalismans - 1);
        this.host.feedback.winFanfare();
        this.hideEndOverlay();
        this.renderSudokuDomBoard();
        this.refreshStatusHeader();
        if (res.won) {
          this.handleVictory(this.sudokuEngine.stage, 2200 + this.sudokuEngine.stage * 30);
        } else {
          this.persistActiveSession();
        }
      }
      this.host.showToast(res.msg, res.ok ? '🔥' : '⚠️');
    } else if (this.mode === 'blocks' && this.onetEngine) {
      const res = this.onetEngine.applyPhoenixTalisman();
      if (res.ok) {
        pa.phoenixTalismans = Math.max(0, pa.phoenixTalismans - 1);
        this.host.feedback.winFanfare();
        this.hideEndOverlay();
        this.refreshStatusHeader();
        this.renderCanvasScene();
        if (this.onetEngine.status === 'won') {
          this.handleVictory(this.onetEngine.stage, this.onetEngine.score);
        } else {
          this.persistActiveSession();
        }
      }
      this.host.showToast(res.msg, res.ok ? '🔥' : '⚠️');
    }
  }
}

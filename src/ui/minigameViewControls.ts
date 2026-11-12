/**
 * Bộ điều khiển Phóng to / Thu nhỏ / Kéo trượt & Xoay Dọc – Ngang dùng chung
 * cho toàn bộ 6 mini game:
 *   - match3   (Gác Xép Bùa Gặt Honeydukes)
 *   - caro     (Ngũ Ấn Đạo Tặc)
 *   - sudoku   (Số Học Huyền Bí)
 *   - chess    (Cờ Phù Thủy)
 *   - blocks   (Sinh Vật Huyền Bí — Pikachu)
 *   - seedquiz (Học Viện Thần Chú Đa Ngữ)
 *
 * Hỗ trợ đầy đủ trên cả Desktop & Di động (kể cả iOS Safari 16+ khoá xoay màn hình):
 *   1. Phóng to / Thu nhỏ (65% – 220%) qua nút +/- , bánh xe chuột, chụm 2 ngón (pinch-to-zoom).
 *   2. Kéo trượt (Pan) khi đang phóng to qua 2 ngón tay, chuột phải/giữa, Alt/Space + kéo, hoặc nút ✋.
 *   3. Chuyển chế độ Dọc ↔ Ngang (tự thử Screen Orientation API nếu có + xoay khung 90° trên điện thoại
 *      đang khoá hướng màn hình + chuyển bố cục Dọc/Ngang & đảo chiều lưới Pikachu/Sudoku/Quiz).
 *   4. Xoay góc bàn chơi 90° (0° → 90° → 180° → 270°) kèm ánh xạ ngược toạ độ chạm/vuốt chính xác 100%.
 */

export type MinigameViewId = 'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'seedquiz';

export type MinigameOrientationPref = 'auto' | 'landscape' | 'portrait';

export type QuarterTurn = 0 | 1 | 2 | 3;

export interface MinigameViewState {
  zoom: number;
  panX: number;
  panY: number;
  boardQuarterTurns: QuarterTurn;
  panMode: boolean;
}

export const MINIGAME_ZOOM_MIN = 0.65;
export const MINIGAME_ZOOM_MAX = 2.2;
export const MINIGAME_ZOOM_STEP = 0.15;

const ORIENT_STORAGE_KEY = 'hangsoc_minigame_orient_v1';

export function clampMinigameZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) return 1;
  const clamped = Math.min(MINIGAME_ZOOM_MAX, Math.max(MINIGAME_ZOOM_MIN, zoom));
  return Math.round(clamped * 100) / 100;
}

export function combineQuarterTurns(a: number, b: number): QuarterTurn {
  return ((((Math.round(a) + Math.round(b)) % 4) + 4) % 4) as QuarterTurn;
}

export function resolveMinigameOrientation(
  pref: MinigameOrientationPref,
  winW: number,
  winH: number,
  dialogFlip180 = false,
  isSeedQuiz = false
): {
  effectiveLayout: 'landscape' | 'portrait';
  dialogQuarterTurn: QuarterTurn;
} {
  const safeW = Math.max(1, winW || 1024);
  const safeH = Math.max(1, winH || 768);
  const naturalLandscape = isSeedQuiz
    ? safeW >= 881 || (safeW > safeH && safeW >= 640)
    : safeW >= 980 || (safeW > safeH && safeH <= 620);

  if (pref === 'auto') {
    return {
      effectiveLayout: naturalLandscape ? 'landscape' : 'portrait',
      dialogQuarterTurn: 0,
    };
  }

  if (pref === 'landscape') {
    // Nếu cửa sổ vật lý đang dọc (như điện thoại khoá xoay dọc), xoay khung modal 90° để mở rộng toàn màn hình ngang
    if (safeW < safeH) {
      return {
        effectiveLayout: 'landscape',
        dialogQuarterTurn: dialogFlip180 ? 3 : 1,
      };
    }
    return {
      effectiveLayout: 'landscape',
      dialogQuarterTurn: 0,
    };
  }

  // pref === 'portrait'
  // Nếu điện thoại đang nằm ngang thấp (safeH <= 640 và safeW > safeH), xoay khung modal -90° sang dọc
  if (safeW > safeH && safeH <= 640) {
    return {
      effectiveLayout: 'portrait',
      dialogQuarterTurn: dialogFlip180 ? 1 : 3,
    };
  }
  return {
    effectiveLayout: 'portrait',
    dialogQuarterTurn: 0,
  };
}

/**
 * Ánh xạ toạ độ màn hình `(clientX, clientY)` về toạ độ chuẩn hoá cục bộ `(lu, lv) ∈ [0..1]`
 * bất chấp phần tử đang bị phóng to/thu nhỏ, kéo lệch hay xoay vuông góc `0° / 90° / 180° / 270°`.
 */
export function clientToLocalNormalized(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  netQuarterTurns: QuarterTurn
): { lu: number; lv: number } {
  const u = (clientX - rect.left) / Math.max(1, rect.width);
  const v = (clientY - rect.top) / Math.max(1, rect.height);
  switch (netQuarterTurns) {
    case 1: // 90° CW
      return { lu: v, lv: 1 - u };
    case 2: // 180°
      return { lu: 1 - u, lv: 1 - v };
    case 3: // 270° CW (-90°)
      return { lu: 1 - v, lv: u };
    default:
      return { lu: u, lv: v };
  }
}

/**
 * Đổi vector dịch chuyển trên màn hình `(dx, dy)` sang hệ trục của `.mg-stage-pan-area`
 * (khi bản thân hộp thoại có thể đã xoay `dialogQuarterTurn`).
 */
export function screenDeltaToViewportDelta(
  dx: number,
  dy: number,
  dialogQuarterTurn: QuarterTurn
): { vx: number; vy: number } {
  switch (dialogQuarterTurn) {
    case 1:
      return { vx: dy, vy: -dx };
    case 2:
      return { vx: -dx, vy: -dy };
    case 3:
      return { vx: -dy, vy: dx };
    default:
      return { vx: dx, vy: dy };
  }
}

export function computeBoardFitScale(
  vpW: number,
  vpH: number,
  itemW: number,
  itemH: number,
  boardQuarterTurns: QuarterTurn
): number {
  if (boardQuarterTurns % 2 === 0) return 1;
  if (vpW <= 10 || vpH <= 10 || itemW <= 10 || itemH <= 10) return 1;
  const scaleW = vpW / itemH;
  const scaleH = vpH / itemW;
  return Math.min(1, Math.max(0.45, Math.min(scaleW, scaleH)));
}

export function clampMinigamePan(
  panX: number,
  panY: number,
  vpW: number,
  vpH: number,
  itemW: number,
  itemH: number,
  effectiveScale: number,
  boardQuarterTurns: QuarterTurn
): { panX: number; panY: number } {
  if (vpW <= 0 || vpH <= 0 || itemW <= 0 || itemH <= 0) {
    return { panX: 0, panY: 0 };
  }
  const baseW = boardQuarterTurns % 2 === 1 ? itemH : itemW;
  const baseH = boardQuarterTurns % 2 === 1 ? itemW : itemH;
  const visW = baseW * effectiveScale;
  const visH = baseH * effectiveScale;
  const slackX = effectiveScale > 1.01 ? 44 : 0;
  const slackY = effectiveScale > 1.01 ? 44 : 0;
  const maxX = Math.max(0, (visW - vpW) * 0.5 + slackX);
  const maxY = Math.max(0, (visH - vpH) * 0.5 + slackY);
  const cx = Math.min(maxX, Math.max(-maxX, Number.isFinite(panX) ? panX : 0));
  const cy = Math.min(maxY, Math.max(-maxY, Number.isFinite(panY) ? panY : 0));
  return {
    panX: Math.abs(cx) < 0.5 ? 0 : Math.round(cx * 10) / 10,
    panY: Math.abs(cy) < 0.5 ? 0 : Math.round(cy * 10) / 10,
  };
}

function tryLockScreenOrientation(target: 'landscape' | 'portrait' | 'unlock'): void {
  if (typeof screen === 'undefined') return;
  const scrOrient = (
    screen as Screen & {
      orientation?: {
        lock?: (mode: string) => Promise<void>;
        unlock?: () => void;
      };
    }
  ).orientation;
  if (!scrOrient) return;
  try {
    if (target === 'unlock') {
      scrOrient.unlock?.();
    } else if (typeof scrOrient.lock === 'function') {
      void scrOrient.lock(target).catch(() => {
        // iOS Safari / desktop browser tabs không cho phép lock phần cứng: đã có CSS fallback xoay khung 90°
      });
    }
  } catch {
    // Bỏ qua an toàn trên trình duyệt không hỗ trợ
  }
}

export class MinigameViewportManager {
  private states = new Map<MinigameViewId, MinigameViewState>();
  private orientationPref: MinigameOrientationPref = 'auto';
  private dialogFlip180 = false;
  private spacePressed = false;

  constructor() {
    this.loadPersistedOrientation();
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (ev) => {
        if (ev.code === 'Space') {
          const tag = (ev.target as HTMLElement | null)?.tagName;
          if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'BUTTON') {
            this.spacePressed = true;
          }
        }
      });
      window.addEventListener('keyup', (ev) => {
        if (ev.code === 'Space') {
          this.spacePressed = false;
        }
      });
      window.addEventListener('blur', () => {
        this.spacePressed = false;
      });
    }
  }

  private loadPersistedOrientation(): void {
    try {
      if (typeof sessionStorage === 'undefined') return;
      const raw = sessionStorage.getItem(ORIENT_STORAGE_KEY);
      if (raw === 'landscape' || raw === 'portrait' || raw === 'auto') {
        this.orientationPref = raw;
      }
    } catch {
      // Ignore storage access errors
    }
  }

  private savePersistedOrientation(): void {
    try {
      if (typeof sessionStorage === 'undefined') return;
      sessionStorage.setItem(ORIENT_STORAGE_KEY, this.orientationPref);
    } catch {
      // Ignore storage access errors
    }
  }

  public getState(gameId: MinigameViewId): MinigameViewState {
    let st = this.states.get(gameId);
    if (!st) {
      st = {
        zoom: 1,
        panX: 0,
        panY: 0,
        boardQuarterTurns: 0,
        panMode: false,
      };
      this.states.set(gameId, st);
    }
    return st;
  }

  public getOrientationPref(): MinigameOrientationPref {
    return this.orientationPref;
  }

  public setOrientationPref(pref: MinigameOrientationPref): void {
    this.orientationPref = pref;
    this.dialogFlip180 = false;
    this.savePersistedOrientation();
    if (pref === 'auto') {
      tryLockScreenOrientation('unlock');
    } else {
      tryLockScreenOrientation(pref);
    }
  }

  public getViewportResolution(isSeedQuiz = false): {
    effectiveLayout: 'landscape' | 'portrait';
    dialogQuarterTurn: QuarterTurn;
  } {
    const winW = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const winH = typeof window !== 'undefined' ? window.innerHeight : 800;
    return resolveMinigameOrientation(
      this.orientationPref,
      winW,
      winH,
      this.dialogFlip180,
      isSeedQuiz
    );
  }

  public getEffectiveLayout(isSeedQuiz = false): 'landscape' | 'portrait' {
    return this.getViewportResolution(isSeedQuiz).effectiveLayout;
  }

  public getNetQuarterTurns(gameId: MinigameViewId): QuarterTurn {
    const st = this.getState(gameId);
    const { dialogQuarterTurn } = this.getViewportResolution(gameId === 'seedquiz');
    return combineQuarterTurns(dialogQuarterTurn, st.boardQuarterTurns);
  }

  public toggleOrientation(isSeedQuiz = false): 'landscape' | 'portrait' {
    const cur = this.getEffectiveLayout(isSeedQuiz);
    const next: 'landscape' | 'portrait' = cur === 'landscape' ? 'portrait' : 'landscape';
    this.setOrientationPref(next);
    // Khi đổi hướng màn hình, đặt lại lệch pan để bàn chơi luôn nằm ngay tâm khung mới
    for (const st of this.states.values()) {
      st.panX = 0;
      st.panY = 0;
    }
    return next;
  }

  public stepZoom(gameId: MinigameViewId, delta: number): number {
    const st = this.getState(gameId);
    st.zoom = clampMinigameZoom(st.zoom + delta);
    if (st.zoom <= 1.01) {
      st.panX = 0;
      st.panY = 0;
      st.panMode = false;
    }
    return st.zoom;
  }

  public setZoom(gameId: MinigameViewId, targetZoom: number): number {
    const st = this.getState(gameId);
    st.zoom = clampMinigameZoom(targetZoom);
    if (st.zoom <= 1.01) {
      st.panX = 0;
      st.panY = 0;
      st.panMode = false;
    }
    return st.zoom;
  }

  public resetView(gameId: MinigameViewId): void {
    const st = this.getState(gameId);
    st.zoom = 1;
    st.panX = 0;
    st.panY = 0;
    st.boardQuarterTurns = 0;
    st.panMode = false;
  }

  public rotate90(gameId: MinigameViewId): QuarterTurn {
    const st = this.getState(gameId);
    const { dialogQuarterTurn } = this.getViewportResolution(gameId === 'seedquiz');
    // Nếu là Học Viện Thần Chú đang xoay khung trên di động, nút ↪️ đảo chiều cầm máy (+90° ↔ -90°) hoặc xoay tiếp 90°
    if (gameId === 'seedquiz' && dialogQuarterTurn !== 0 && st.boardQuarterTurns === 0) {
      this.dialogFlip180 = !this.dialogFlip180;
      return this.getNetQuarterTurns(gameId);
    }
    st.boardQuarterTurns = combineQuarterTurns(st.boardQuarterTurns, 1);
    st.panX = 0;
    st.panY = 0;
    return st.boardQuarterTurns;
  }

  public togglePanMode(gameId: MinigameViewId): boolean {
    const st = this.getState(gameId);
    st.panMode = !st.panMode;
    return st.panMode;
  }

  public renderToolbarHtml(
    gameId: MinigameViewId,
    opts?: { showPanToggle?: boolean; extraClass?: string }
  ): string {
    const st = this.getState(gameId);
    const isSeedQuiz = gameId === 'seedquiz';
    const showPan = opts?.showPanToggle ?? !isSeedQuiz;
    const eff = this.getEffectiveLayout(isSeedQuiz);
    const pct = Math.round(st.zoom * 100);
    const orientBtnLabel = eff === 'landscape' ? '↕️ Dọc' : '↔️ Ngang';
    const orientTitle =
      eff === 'landscape'
        ? 'Đang ở chế độ Ngang — bấm để xoay sang chế độ Dọc'
        : 'Đang ở chế độ Dọc — bấm để xoay sang chế độ Ngang';
    const rotDeg = st.boardQuarterTurns * 90;
    const extraCls = opts?.extraClass ? ` ${opts.extraClass}` : '';

    return `
      <div class="mg-view-toolbar${extraCls}" data-mg-toolbar="${gameId}" role="toolbar" aria-label="Phóng to, thu nhỏ và xoay màn hình game">
        <button type="button" class="mg-view-btn" data-mg-act="zoom-out" title="Thu nhỏ (-)" aria-label="Thu nhỏ" ${st.zoom <= MINIGAME_ZOOM_MIN + 0.005 ? 'disabled' : ''}>➖</button>
        <button type="button" class="mg-view-btn mg-view-pct ${pct !== 100 || st.boardQuarterTurns !== 0 ? 'is-modified' : ''}" data-mg-act="zoom-reset" title="Đặt lại góc nhìn 100%" aria-label="Đặt lại phóng to 100 phần trăm">${pct}%</button>
        <button type="button" class="mg-view-btn" data-mg-act="zoom-in" title="Phóng to (+)" aria-label="Phóng to" ${st.zoom >= MINIGAME_ZOOM_MAX - 0.005 ? 'disabled' : ''}>➕</button>
        ${
          showPan
            ? `<button type="button" class="mg-view-btn mg-view-pan ${st.panMode ? 'active' : ''}" data-mg-act="toggle-pan" aria-pressed="${st.panMode}" title="Bật/tắt chế độ kéo trượt bàn chơi bằng 1 ngón hoặc chuột trái">✋</button>`
            : ''
        }
        <span class="mg-view-sep" aria-hidden="true"></span>
        <button type="button" class="mg-view-btn mg-view-orient ${this.orientationPref !== 'auto' ? 'active' : ''}" data-mg-act="toggle-orient" title="${orientTitle}">${orientBtnLabel}</button>
        <button type="button" class="mg-view-btn ${st.boardQuarterTurns !== 0 ? 'active' : ''}" data-mg-act="rotate-90" title="Xoay bàn chơi 90° (hiện tại ${rotDeg}°)" aria-label="Xoay bàn chơi 90 độ">↪️${rotDeg > 0 ? `<small>${rotDeg}°</small>` : ''}</button>
      </div>
    `;
  }

  public syncToolbarDOM(scope: ParentNode | null, gameId: MinigameViewId): void {
    if (!scope || typeof scope.querySelector !== 'function') return;
    const bar = scope.querySelector<HTMLElement>(`[data-mg-toolbar="${gameId}"]`);
    if (!bar || typeof bar.querySelector !== 'function') return;
    const st = this.getState(gameId);
    const isSeedQuiz = gameId === 'seedquiz';
    const eff = this.getEffectiveLayout(isSeedQuiz);
    const pct = Math.round(st.zoom * 100);
    const rotDeg = st.boardQuarterTurns * 90;

    const btnOut = bar.querySelector<HTMLButtonElement>('[data-mg-act="zoom-out"]');
    if (btnOut) btnOut.disabled = st.zoom <= MINIGAME_ZOOM_MIN + 0.005;

    const btnIn = bar.querySelector<HTMLButtonElement>('[data-mg-act="zoom-in"]');
    if (btnIn) btnIn.disabled = st.zoom >= MINIGAME_ZOOM_MAX - 0.005;

    const btnPct = bar.querySelector<HTMLButtonElement>('[data-mg-act="zoom-reset"]');
    if (btnPct) {
      btnPct.textContent = `${pct}%`;
      btnPct.classList.toggle('is-modified', pct !== 100 || st.boardQuarterTurns !== 0);
    }

    const btnPan = bar.querySelector<HTMLButtonElement>('[data-mg-act="toggle-pan"]');
    if (btnPan) {
      btnPan.classList.toggle('active', st.panMode);
      btnPan.setAttribute('aria-pressed', String(st.panMode));
    }

    const btnOrient = bar.querySelector<HTMLButtonElement>('[data-mg-act="toggle-orient"]');
    if (btnOrient) {
      btnOrient.textContent = eff === 'landscape' ? '↕️ Dọc' : '↔️ Ngang';
      btnOrient.classList.toggle('active', this.orientationPref !== 'auto');
    }

    const btnRot = bar.querySelector<HTMLButtonElement>('[data-mg-act="rotate-90"]');
    if (btnRot) {
      btnRot.innerHTML = `↪️${rotDeg > 0 ? `<small>${rotDeg}°</small>` : ''}`;
      btnRot.classList.toggle('active', st.boardQuarterTurns !== 0);
      btnRot.title = `Xoay bàn chơi 90° (hiện tại ${rotDeg}°)`;
    }
  }

  public applyDialogOrientation(
    dialogEl: HTMLDialogElement | null,
    modalInnerEl: HTMLElement | null,
    isSeedQuiz = false
  ): {
    effectiveLayout: 'landscape' | 'portrait';
    dialogQuarterTurn: QuarterTurn;
  } {
    const res = this.getViewportResolution(isSeedQuiz);
    const rotAttr = String(res.dialogQuarterTurn * 90);
    if (dialogEl?.dataset) {
      dialogEl.dataset.mgLayout = res.effectiveLayout;
      dialogEl.dataset.mgRotate = rotAttr;
    }
    if (modalInnerEl?.dataset) {
      modalInnerEl.dataset.mgLayout = res.effectiveLayout;
      modalInnerEl.dataset.mgRotate = rotAttr;
    }
    return res;
  }

  public clearDialogOrientation(
    dialogEl: HTMLDialogElement | null,
    modalInnerEl: HTMLElement | null
  ): void {
    if (dialogEl?.dataset) {
      delete dialogEl.dataset.mgLayout;
      delete dialogEl.dataset.mgRotate;
    }
    if (modalInnerEl?.dataset) {
      delete modalInnerEl.dataset.mgLayout;
      delete modalInnerEl.dataset.mgRotate;
    }
  }

  public applyCanvasStageTransform(
    gameId: MinigameViewId,
    panAreaEl: HTMLElement | null,
    canvasShellEl: HTMLElement | null
  ): { effectiveScale: number; netQuarterTurns: QuarterTurn } {
    const st = this.getState(gameId);
    const { dialogQuarterTurn } = this.getViewportResolution(false);
    const netQuarterTurns = combineQuarterTurns(dialogQuarterTurn, st.boardQuarterTurns);
    if (!panAreaEl || !canvasShellEl) {
      return { effectiveScale: st.zoom, netQuarterTurns };
    }

    const vpW = panAreaEl.clientWidth;
    const vpH = panAreaEl.clientHeight;
    const itemW = canvasShellEl.offsetWidth;
    const itemH = canvasShellEl.offsetHeight;
    const fitScale = computeBoardFitScale(vpW, vpH, itemW, itemH, st.boardQuarterTurns);
    const effectiveScale = st.zoom * fitScale;
    const clamped = clampMinigamePan(
      st.panX,
      st.panY,
      vpW,
      vpH,
      itemW,
      itemH,
      effectiveScale,
      st.boardQuarterTurns
    );
    st.panX = clamped.panX;
    st.panY = clamped.panY;

    panAreaEl.dataset.mgPanMode = String(st.panMode);
    if (
      st.panX === 0 &&
      st.panY === 0 &&
      Math.abs(effectiveScale - 1) < 0.002 &&
      st.boardQuarterTurns === 0
    ) {
      canvasShellEl.style.transform = '';
      canvasShellEl.style.transformOrigin = '';
    } else {
      canvasShellEl.style.transformOrigin = 'center center';
      canvasShellEl.style.transform = `translate3d(${st.panX}px, ${st.panY}px, 0) scale(${effectiveScale.toFixed(4)}) rotate(${st.boardQuarterTurns * 90}deg)`;
    }

    return { effectiveScale, netQuarterTurns };
  }

  public applyDomScrollStageTransform(
    scrollViewportEl: HTMLElement | null,
    sizerEl: HTMLElement | null,
    contentStageEl: HTMLElement | null
  ): void {
    const st = this.getState('seedquiz');
    if (!scrollViewportEl || !sizerEl || !contentStageEl) return;

    const z = st.zoom;
    const rot = st.boardQuarterTurns;
    if (Math.abs(z - 1) < 0.002 && rot === 0) {
      contentStageEl.style.transform = '';
      contentStageEl.style.transformOrigin = '';
      contentStageEl.style.width = '';
      sizerEl.style.width = '';
      sizerEl.style.height = '';
      return;
    }

    // Đặt lại để đo kích thước tự nhiên trước khi scale
    contentStageEl.style.width = z < 1 ? `${(100 / z).toFixed(2)}%` : '100%';
    contentStageEl.style.transform = '';
    const baseW = contentStageEl.offsetWidth || scrollViewportEl.clientWidth || 640;
    const baseH = contentStageEl.offsetHeight || 480;

    if (rot === 0) {
      contentStageEl.style.transformOrigin = '0 0';
      contentStageEl.style.transform = `scale(${z.toFixed(4)})`;
      sizerEl.style.width = `${Math.ceil(baseW * z)}px`;
      sizerEl.style.height = `${Math.ceil(baseH * z)}px`;
    } else {
      const rotDeg = rot * 90;
      const outW = (rot % 2 === 1 ? baseH : baseW) * z;
      const outH = (rot % 2 === 1 ? baseW : baseH) * z;
      sizerEl.style.width = `${Math.ceil(outW)}px`;
      sizerEl.style.height = `${Math.ceil(outH)}px`;
      contentStageEl.style.transformOrigin = 'center center';
      const dx = (outW - baseW) * 0.5;
      const dy = (outH - baseH) * 0.5;
      contentStageEl.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${z.toFixed(4)}) rotate(${rotDeg}deg)`;
    }
  }

  public bindCanvasStageInteractions(params: {
    gameId: MinigameViewId;
    rootScope: HTMLElement;
    panAreaEl: HTMLElement | null;
    canvasShellEl: HTMLElement | null;
    canvasEl: HTMLCanvasElement | null;
    onTransformUpdated: () => void;
    onOrientationToggled: () => void;
    onPlayClick?: () => void;
  }): void {
    const {
      gameId,
      rootScope,
      panAreaEl,
      canvasShellEl,
      canvasEl,
      onTransformUpdated,
      onOrientationToggled,
      onPlayClick,
    } = params;

    const refreshTransform = () => {
      this.applyCanvasStageTransform(gameId, panAreaEl, canvasShellEl);
      this.syncToolbarDOM(rootScope, gameId);
      onTransformUpdated();
    };

    const bar =
      typeof rootScope?.querySelector === 'function'
        ? rootScope.querySelector<HTMLElement>(`[data-mg-toolbar="${gameId}"]`)
        : null;
    if (bar && typeof bar.querySelectorAll === 'function') {
      bar.querySelectorAll<HTMLButtonElement>('[data-mg-act]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          onPlayClick?.();
          const act = btn.dataset.mgAct;
          if (act === 'zoom-in') {
            this.stepZoom(gameId, MINIGAME_ZOOM_STEP);
            refreshTransform();
          } else if (act === 'zoom-out') {
            this.stepZoom(gameId, -MINIGAME_ZOOM_STEP);
            refreshTransform();
          } else if (act === 'zoom-reset') {
            this.resetView(gameId);
            refreshTransform();
          } else if (act === 'toggle-pan') {
            this.togglePanMode(gameId);
            refreshTransform();
          } else if (act === 'toggle-orient') {
            this.toggleOrientation(false);
            onOrientationToggled();
          } else if (act === 'rotate-90') {
            this.rotate90(gameId);
            refreshTransform();
          }
        });
      });
    }

    if (!panAreaEl || !canvasShellEl) {
      this.syncToolbarDOM(rootScope, gameId);
      return;
    }

    // 1. Bánh xe chuột & Trackpad pinch trên vùng bàn chơi
    panAreaEl.addEventListener(
      'wheel',
      (ev) => {
        ev.preventDefault();
        const st = this.getState(gameId);
        const factor = ev.ctrlKey ? 0.0085 : 0.0018;
        const nextZoom = clampMinigameZoom(st.zoom * Math.exp(-ev.deltaY * factor));
        if (nextZoom === st.zoom) return;

        // Phóng to hướng về vị trí con trỏ trong vùng panArea
        const vpRect = panAreaEl.getBoundingClientRect();
        const { dialogQuarterTurn } = this.getViewportResolution(false);
        const { lu, lv } = clientToLocalNormalized(
          ev.clientX,
          ev.clientY,
          vpRect,
          dialogQuarterTurn
        );
        const cursorOffsetX = (lu - 0.5) * panAreaEl.clientWidth;
        const cursorOffsetY = (lv - 0.5) * panAreaEl.clientHeight;
        const ratio = nextZoom / Math.max(0.2, st.zoom);
        st.panX = cursorOffsetX - (cursorOffsetX - st.panX) * ratio;
        st.panY = cursorOffsetY - (cursorOffsetY - st.panY) * ratio;
        st.zoom = nextZoom;
        if (st.zoom <= 1.01) {
          st.panX = 0;
          st.panY = 0;
          st.panMode = false;
        }
        refreshTransform();
      },
      { passive: false }
    );

    // Chặn menu chuột phải khi đang phóng to để kéo bàn mượt bằng chuột phải
    panAreaEl.addEventListener('contextmenu', (ev) => {
      if (this.getState(gameId).zoom > 1.01 || this.getState(gameId).panMode) {
        ev.preventDefault();
      }
    });

    // 2. Chụm 2 ngón (Pinch-to-Zoom + 2-finger Pan) & Kéo bàn 1 ngón/chuột (Pan Mode / Right / Middle / Space / Alt)
    const activeTouches = new Map<number, { x: number; y: number }>();
    let pinchActive = false;
    let pinchPrevDist = 0;
    let pinchPrevMidX = 0;
    let pinchPrevMidY = 0;

    let dragPanPointerId: number | null = null;
    let dragPanLastX = 0;
    let dragPanLastY = 0;

    const cancelCanvasActivePointer = (pointerId: number) => {
      if (!canvasEl || typeof PointerEvent === 'undefined') return;
      try {
        canvasEl.dispatchEvent(
          new PointerEvent('pointercancel', {
            pointerId,
            bubbles: true,
          })
        );
      } catch {
        // Ignore environments without PointerEvent constructor
      }
    };

    panAreaEl.addEventListener(
      'pointerdown',
      (ev) => {
        if (ev.pointerType === 'touch') {
          activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (activeTouches.size >= 2) {
            const pts = Array.from(activeTouches.values());
            pinchPrevDist = Math.max(12, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            pinchPrevMidX = (pts[0].x + pts[1].x) * 0.5;
            pinchPrevMidY = (pts[0].y + pts[1].y) * 0.5;
            if (!pinchActive) {
              pinchActive = true;
              for (const pid of activeTouches.keys()) {
                cancelCanvasActivePointer(pid);
              }
            }
            ev.stopPropagation();
            ev.preventDefault();
            return;
          }
        }

        const st = this.getState(gameId);
        const isAuxPanButton =
          ev.button === 1 ||
          (ev.button === 2 && st.zoom > 1.01) ||
          (ev.button === 0 && (st.panMode || ev.altKey || this.spacePressed));

        if (isAuxPanButton) {
          dragPanPointerId = ev.pointerId;
          dragPanLastX = ev.clientX;
          dragPanLastY = ev.clientY;
          panAreaEl.dataset.mgDragging = 'true';
          try {
            panAreaEl.setPointerCapture?.(ev.pointerId);
          } catch {
            // Ignore synthetic events
          }
          ev.stopPropagation();
          ev.preventDefault();
        }
      },
      { capture: true }
    );

    panAreaEl.addEventListener(
      'pointermove',
      (ev) => {
        if (ev.pointerType === 'touch' && activeTouches.has(ev.pointerId)) {
          activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (pinchActive && activeTouches.size >= 2) {
            const pts = Array.from(activeTouches.values());
            const dist = Math.max(12, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            const midX = (pts[0].x + pts[1].x) * 0.5;
            const midY = (pts[0].y + pts[1].y) * 0.5;
            const st = this.getState(gameId);
            const scaleDelta = dist / Math.max(12, pinchPrevDist);
            st.zoom = clampMinigameZoom(st.zoom * scaleDelta);

            const { dialogQuarterTurn } = this.getViewportResolution(false);
            const dLocal = screenDeltaToViewportDelta(
              midX - pinchPrevMidX,
              midY - pinchPrevMidY,
              dialogQuarterTurn
            );
            st.panX += dLocal.vx;
            st.panY += dLocal.vy;

            pinchPrevDist = dist;
            pinchPrevMidX = midX;
            pinchPrevMidY = midY;
            refreshTransform();
            ev.stopPropagation();
            ev.preventDefault();
            return;
          }
          if (pinchActive) {
            ev.stopPropagation();
            ev.preventDefault();
            return;
          }
        }

        if (dragPanPointerId === ev.pointerId) {
          const st = this.getState(gameId);
          const { dialogQuarterTurn } = this.getViewportResolution(false);
          const dLocal = screenDeltaToViewportDelta(
            ev.clientX - dragPanLastX,
            ev.clientY - dragPanLastY,
            dialogQuarterTurn
          );
          st.panX += dLocal.vx;
          st.panY += dLocal.vy;
          dragPanLastX = ev.clientX;
          dragPanLastY = ev.clientY;
          refreshTransform();
          ev.stopPropagation();
          ev.preventDefault();
        }
      },
      { capture: true }
    );

    const endGesture = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch' && activeTouches.has(ev.pointerId)) {
        activeTouches.delete(ev.pointerId);
        if (pinchActive) {
          if (activeTouches.size === 0) {
            pinchActive = false;
          } else if (activeTouches.size >= 2) {
            const pts = Array.from(activeTouches.values());
            pinchPrevDist = Math.max(12, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            pinchPrevMidX = (pts[0].x + pts[1].x) * 0.5;
            pinchPrevMidY = (pts[0].y + pts[1].y) * 0.5;
          }
          ev.stopPropagation();
          ev.preventDefault();
          return;
        }
      }

      if (dragPanPointerId === ev.pointerId) {
        dragPanPointerId = null;
        delete panAreaEl.dataset.mgDragging;
        try {
          panAreaEl.releasePointerCapture?.(ev.pointerId);
        } catch {
          // Ignore
        }
        ev.stopPropagation();
        ev.preventDefault();
      }
    };

    panAreaEl.addEventListener('pointerup', endGesture, { capture: true });
    panAreaEl.addEventListener('pointercancel', endGesture, { capture: true });

    this.applyCanvasStageTransform(gameId, panAreaEl, canvasShellEl);
    this.syncToolbarDOM(rootScope, gameId);
  }

  public bindDomScrollStageInteractions(params: {
    rootScope: HTMLElement;
    scrollViewportEl: HTMLElement | null;
    sizerEl: HTMLElement | null;
    contentStageEl: HTMLElement | null;
    onOrientationToggled: () => void;
    onPlayClick?: () => void;
  }): void {
    const {
      rootScope,
      scrollViewportEl,
      sizerEl,
      contentStageEl,
      onOrientationToggled,
      onPlayClick,
    } = params;
    const gameId: MinigameViewId = 'seedquiz';

    const refresh = () => {
      this.applyDomScrollStageTransform(scrollViewportEl, sizerEl, contentStageEl);
      this.syncToolbarDOM(rootScope, gameId);
    };

    const bar =
      typeof rootScope?.querySelector === 'function'
        ? rootScope.querySelector<HTMLElement>(`[data-mg-toolbar="${gameId}"]`)
        : null;
    if (bar && typeof bar.querySelectorAll === 'function') {
      bar.querySelectorAll<HTMLButtonElement>('[data-mg-act]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          onPlayClick?.();
          const act = btn.dataset.mgAct;
          if (act === 'zoom-in') {
            this.stepZoom(gameId, MINIGAME_ZOOM_STEP);
            refresh();
          } else if (act === 'zoom-out') {
            this.stepZoom(gameId, -MINIGAME_ZOOM_STEP);
            refresh();
          } else if (act === 'zoom-reset') {
            this.resetView(gameId);
            refresh();
          } else if (act === 'toggle-orient') {
            this.toggleOrientation(true);
            onOrientationToggled();
          } else if (act === 'rotate-90') {
            this.rotate90(gameId);
            onOrientationToggled();
          }
        });
      });
    }

    if (scrollViewportEl) {
      scrollViewportEl.addEventListener(
        'wheel',
        (ev) => {
          if (!ev.ctrlKey && !ev.metaKey) return;
          ev.preventDefault();
          const st = this.getState(gameId);
          st.zoom = clampMinigameZoom(st.zoom * Math.exp(-ev.deltaY * 0.006));
          refresh();
        },
        { passive: false }
      );

      const activeTouches = new Map<number, { x: number; y: number }>();
      let pinchPrevDist = 0;
      scrollViewportEl.addEventListener(
        'pointerdown',
        (ev) => {
          if (ev.pointerType !== 'touch') return;
          activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (activeTouches.size >= 2) {
            const pts = Array.from(activeTouches.values());
            pinchPrevDist = Math.max(12, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
          }
        },
        { passive: true }
      );
      scrollViewportEl.addEventListener(
        'pointermove',
        (ev) => {
          if (ev.pointerType !== 'touch' || !activeTouches.has(ev.pointerId)) return;
          activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          if (activeTouches.size >= 2 && pinchPrevDist > 0) {
            const pts = Array.from(activeTouches.values());
            const dist = Math.max(12, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            const st = this.getState(gameId);
            st.zoom = clampMinigameZoom(st.zoom * (dist / pinchPrevDist));
            pinchPrevDist = dist;
            refresh();
            ev.preventDefault();
          }
        },
        { passive: false }
      );
      const endTouch = (ev: PointerEvent) => {
        activeTouches.delete(ev.pointerId);
        if (activeTouches.size < 2) pinchPrevDist = 0;
      };
      scrollViewportEl.addEventListener('pointerup', endTouch, { passive: true });
      scrollViewportEl.addEventListener('pointercancel', endTouch, { passive: true });
    }

    refresh();
  }
}

export const sharedMinigameViewport = new MinigameViewportManager();

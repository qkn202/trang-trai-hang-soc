/**
 * Bộ điều khiển Phóng to / Thu nhỏ bằng ngón tay (Pinch-to-Zoom) & Kéo trượt (Pan)
 * tự nhiên trên màn hình cảm ứng di động (iOS Safari 16+ / Android) dùng chung
 * cho toàn bộ 6 mini game — KHÔNG dùng nút bấm phóng to/thu nhỏ trên giao diện:
 *   - match3   (Gác Xép Bùa Gặt Honeydukes)
 *   - caro     (Ngũ Ấn Đạo Tặc)
 *   - sudoku   (Số Học Huyền Bí)
 *   - chess    (Cờ Phù Thủy)
 *   - blocks   (Sinh Vật Huyền Bí — Pikachu)
 *   - seedquiz (Học Viện Thần Chú Đa Ngữ)
 *
 * Cơ chế cử chỉ cảm ứng chuẩn ứng dụng di động:
 *   1. Chụm / tách 2 ngón tay (Pinch-to-Zoom 100% – 300%) neo đúng tâm điểm giữa 2 ngón tay,
 *      kết hợp trượt 2 ngón đồng thời mượt mà 60 FPS; khép tay về gần 100% tự căn giữa lại bàn cờ.
 *   2. Khi đang phóng to (> 102%), kéo 1 ngón tay để dịch chuyển bàn cờ mượt trên Ngũ Ấn, Số Học,
 *      Pikachu, và trên ô trống/quân đối phương của Cờ Phù Thủy mà không cần nút chuyển chế độ.
 *   3. Tự động huỷ thao tác chạm nhầm của ngón thứ nhất ngay khi ngón thứ hai chạm xuống bàn cờ.
 */

export type MinigameViewId =
  | 'match3'
  | 'caro'
  | 'sudoku'
  | 'chess'
  | 'blocks'
  | 'jigsaw'
  | 'seedquiz';

export type MinigameOrientationPref = 'auto' | 'landscape' | 'portrait';

export type QuarterTurn = 0 | 1 | 2 | 3;

export interface MinigameViewState {
  zoom: number;
  panX: number;
  panY: number;
  boardQuarterTurns: QuarterTurn;
  panMode: boolean;
}

export const MINIGAME_ZOOM_MIN = 1;
export const MINIGAME_ZOOM_MAX = 3;
export const MINIGAME_JIGSAW_ZOOM_MAX = 6;
export const MINIGAME_ZOOM_STEP = 0.15;

const ORIENT_STORAGE_KEY = 'hangsoc_minigame_orient_v1';
const SINGLE_FINGER_PAN_THRESHOLD_PX = 8;
const POST_PINCH_TAP_GUARD_MS = 110;

export function getMaxZoomForMinigame(gameId: MinigameViewId): number {
  return gameId === 'jigsaw' ? MINIGAME_JIGSAW_ZOOM_MAX : MINIGAME_ZOOM_MAX;
}

export function clampMinigameZoom(
  zoom: number,
  maxZoomOrGameId: number | MinigameViewId = MINIGAME_ZOOM_MAX
): number {
  if (!Number.isFinite(zoom)) return 1;
  const resolvedMax =
    typeof maxZoomOrGameId === 'string'
      ? getMaxZoomForMinigame(maxZoomOrGameId)
      : maxZoomOrGameId;
  const safeMax =
    Number.isFinite(resolvedMax) && resolvedMax >= MINIGAME_ZOOM_MIN
      ? resolvedMax
      : MINIGAME_ZOOM_MAX;
  const clamped = Math.min(safeMax, Math.max(MINIGAME_ZOOM_MIN, zoom));
  return Math.round(clamped * 1000) / 1000;
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
    ? safeW >= 881 || (safeW > safeH * 1.05 && safeW >= 560)
    : safeW >= 980 || (safeW > safeH * 1.06 && safeW >= 560);

  if (pref === 'auto') {
    return {
      effectiveLayout: naturalLandscape ? 'landscape' : 'portrait',
      dialogQuarterTurn: 0,
    };
  }

  if (pref === 'landscape') {
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
 * bất chấp phần tử đang được phóng to bằng ngón tay, kéo lệch hay xoay vuông góc.
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
    case 1:
      return { lu: v, lv: 1 - u };
    case 2:
      return { lu: 1 - u, lv: 1 - v };
    case 3:
      return { lu: 1 - v, lv: u };
    default:
      return { lu: u, lv: v };
  }
}

/**
 * Đổi vector dịch chuyển trên màn hình `(dx, dy)` sang hệ trục của `.mg-stage-pan-area`.
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

/**
 * Tính vị trí `(panX, panY)` mới khi phóng to / thu nhỏ quanh tâm điểm giữa 2 ngón tay
 * đồng thời trượt theo chuyển động của tâm 2 ngón tay.
 */
export function computeFocalPinchPan(params: {
  prevZoom: number;
  nextZoom: number;
  prevPanX: number;
  prevPanY: number;
  prevMidOffsetX: number;
  prevMidOffsetY: number;
  currMidOffsetX: number;
  currMidOffsetY: number;
  maxZoom?: number;
}): { zoom: number; panX: number; panY: number } {
  const {
    prevZoom,
    nextZoom,
    prevPanX,
    prevPanY,
    prevMidOffsetX,
    prevMidOffsetY,
    currMidOffsetX,
    currMidOffsetY,
    maxZoom = MINIGAME_ZOOM_MAX,
  } = params;
  const clampedNext = nextZoom <= 1.015 ? 1 : clampMinigameZoom(nextZoom, maxZoom);
  if (clampedNext <= 1.001) {
    return { zoom: 1, panX: 0, panY: 0 };
  }
  const safePrev = Math.max(0.25, prevZoom || 1);
  const ratio = clampedNext / safePrev;
  return {
    zoom: clampedNext,
    panX: currMidOffsetX - (prevMidOffsetX - prevPanX) * ratio,
    panY: currMidOffsetY - (prevMidOffsetY - prevPanY) * ratio,
  };
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

/**
 * Tính kích thước hộp bàn cờ (CSS px) tự co giãn khít tối đa vùng sân khấu
 * theo kích thước màn hình di động hiện tại mà không tràn viền hay méo tỷ lệ.
 */
export function computeResponsiveBoardBox(
  gameId: MinigameViewId,
  availW: number,
  availH: number,
  boardAspectRatio = 1
): { width: number; height: number } {
  const safeW = Math.max(120, Math.floor(Number.isFinite(availW) ? availW : 320));
  const safeH = Math.max(120, Math.floor(Number.isFinite(availH) ? availH : 320));
  if (
    gameId === 'blocks' ||
    gameId === 'jigsaw' ||
    gameId === 'seedquiz' ||
    !Number.isFinite(boardAspectRatio) ||
    boardAspectRatio <= 0
  ) {
    return { width: safeW, height: safeH };
  }
  const clampedRatio = Math.min(3, Math.max(0.33, boardAspectRatio));
  let width = safeW;
  let height = Math.round(width / clampedRatio);
  if (height > safeH) {
    height = safeH;
    width = Math.round(height * clampedRatio);
  }
  return {
    width: Math.max(120, Math.min(safeW, width)),
    height: Math.max(120, Math.min(safeH, height)),
  };
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
  if (vpW <= 0 || vpH <= 0 || itemW <= 0 || itemH <= 0 || effectiveScale <= 1.005) {
    return { panX: 0, panY: 0 };
  }
  const baseW = boardQuarterTurns % 2 === 1 ? itemH : itemW;
  const baseH = boardQuarterTurns % 2 === 1 ? itemW : itemH;
  const visW = baseW * effectiveScale;
  const visH = baseH * effectiveScale;
  const slackX = 36;
  const slackY = 36;
  const maxX = Math.max(0, (visW - vpW) * 0.5 + slackX);
  const maxY = Math.max(0, (visH - vpH) * 0.5 + slackY);
  const cx = Math.min(maxX, Math.max(-maxX, Number.isFinite(panX) ? panX : 0));
  const cy = Math.min(maxY, Math.max(-maxY, Number.isFinite(panY) ? panY : 0));
  return {
    panX: Math.abs(cx) < 0.5 ? 0 : Math.round(cx * 10) / 10,
    panY: Math.abs(cy) < 0.5 ? 0 : Math.round(cy * 10) / 10,
  };
}

export class MinigameViewportManager {
  private states = new Map<MinigameViewId, MinigameViewState>();
  private orientationPref: MinigameOrientationPref = 'auto';
  private dialogFlip180 = false;
  private spacePressed = false;
  private lastPinchEndMs = 0;
  private activePinchCount = 0;
  private stageCleanupByHost = new Map<'arcade' | 'match3', () => void>();

  constructor() {
    // Xoá trạng thái khoá hướng cũ trong sessionStorage để bàn chơi luôn tự thích ứng tự nhiên
    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(ORIENT_STORAGE_KEY);
      }
    } catch {
      // Ignore storage access errors
    }

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

  public isPinchOrCooldownActive(): boolean {
    if (this.activePinchCount >= 2) return true;
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    return now - this.lastPinchEndMs < POST_PINCH_TAP_GUARD_MS;
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
  }

  public getViewportResolution(isSeedQuiz = false): {
    effectiveLayout: 'landscape' | 'portrait';
    dialogQuarterTurn: QuarterTurn;
  } {
    const winW =
      typeof window !== 'undefined'
        ? Math.round(window.visualViewport?.width || window.innerWidth)
        : 1280;
    const winH =
      typeof window !== 'undefined'
        ? Math.round(window.visualViewport?.height || window.innerHeight)
        : 800;
    return resolveMinigameOrientation(
      this.orientationPref,
      winW,
      winH,
      this.dialogFlip180,
      isSeedQuiz
    );
  }

  public unbindStageInteractions(hostKey: 'arcade' | 'match3'): void {
    const prevCleanup = this.stageCleanupByHost.get(hostKey);
    if (prevCleanup) {
      this.stageCleanupByHost.delete(hostKey);
      prevCleanup();
    }
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
    for (const st of this.states.values()) {
      st.panX = 0;
      st.panY = 0;
    }
    return next;
  }

  public stepZoom(gameId: MinigameViewId, delta: number): number {
    const st = this.getState(gameId);
    st.zoom = clampMinigameZoom(st.zoom + delta, getMaxZoomForMinigame(gameId));
    if (st.zoom <= 1.01) {
      st.panX = 0;
      st.panY = 0;
      st.panMode = false;
    }
    return st.zoom;
  }

  public setZoom(gameId: MinigameViewId, targetZoom: number): number {
    const st = this.getState(gameId);
    st.zoom = clampMinigameZoom(targetZoom, getMaxZoomForMinigame(gameId));
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

  /**
   * Không hiển thị thanh nút zoom trên màn hình — toàn bộ phóng to/thu nhỏ dùng ngón tay (pinch-to-zoom).
   */
  public renderToolbarHtml(
    _gameId: MinigameViewId,
    _opts?: { showPanToggle?: boolean; extraClass?: string }
  ): string {
    return '';
  }

  public syncToolbarDOM(_scope: ParentNode | null, _gameId: MinigameViewId): void {
    // Không có thanh nút DOM cần đồng bộ
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
      canvasShellEl.style.transform =
        st.boardQuarterTurns === 0
          ? `translate3d(${st.panX}px, ${st.panY}px, 0) scale(${effectiveScale.toFixed(4)})`
          : `translate3d(${st.panX}px, ${st.panY}px, 0) scale(${effectiveScale.toFixed(4)}) rotate(${st.boardQuarterTurns * 90}deg)`;
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

    contentStageEl.style.width = '100%';
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
    hostKey?: 'arcade' | 'match3';
    rootScope: HTMLElement;
    panAreaEl: HTMLElement | null;
    canvasShellEl: HTMLElement | null;
    canvasEl: HTMLCanvasElement | null;
    getBoardAspectRatio?: (availW: number, availH: number) => number;
    onStageResized?: (availW: number, availH: number, boardW: number, boardH: number) => void;
    canSingleFingerPanAt?: (clientX: number, clientY: number) => boolean;
    onTransformUpdated: () => void;
    onOrientationToggled?: () => void;
    onPlayClick?: () => void;
  }): void {
    const {
      gameId,
      hostKey,
      panAreaEl,
      canvasShellEl,
      canvasEl,
      getBoardAspectRatio,
      onStageResized,
      canSingleFingerPanAt,
      onTransformUpdated,
    } = params;

    const resolvedHostKey: 'arcade' | 'match3' =
      hostKey ?? (gameId === 'match3' ? 'match3' : 'arcade');
    this.unbindStageInteractions(resolvedHostKey);

    if (!panAreaEl || !canvasShellEl) {
      return;
    }

    const refreshTransform = () => {
      this.applyCanvasStageTransform(gameId, panAreaEl, canvasShellEl);
      onTransformUpdated();
    };

    let lastAppliedW = 0;
    let lastAppliedH = 0;
    let lastStageW = 0;
    let lastStageH = 0;
    const syncResponsiveStageSize = (forceNotify = false) => {
      if (!canvasEl || !panAreaEl.isConnected) return;
      const vpW = Math.floor(panAreaEl.clientWidth);
      const vpH = Math.floor(panAreaEl.clientHeight);
      if (vpW <= 24 || vpH <= 24) return;
      const isFluidStage = gameId === 'blocks' || gameId === 'jigsaw';
      const fitW = isFluidStage ? vpW : Math.max(120, vpW - 2);
      const fitH = isFluidStage ? vpH : Math.max(120, vpH - 4);
      const ratio = getBoardAspectRatio
        ? getBoardAspectRatio(vpW, vpH)
        : isFluidStage
          ? 0
          : 1;
      const box = computeResponsiveBoardBox(gameId, fitW, fitH, ratio);
      const changed =
        forceNotify ||
        box.width !== lastAppliedW ||
        box.height !== lastAppliedH ||
        vpW !== lastStageW ||
        vpH !== lastStageH;
      if (!changed) return;

      lastAppliedW = box.width;
      lastAppliedH = box.height;
      lastStageW = vpW;
      lastStageH = vpH;

      canvasShellEl.style.width = `${box.width}px`;
      canvasShellEl.style.height = `${box.height}px`;
      const aspectCss = isFluidStage ? 'auto' : `${box.width} / ${box.height}`;
      canvasShellEl.style.aspectRatio = aspectCss;
      canvasEl.style.aspectRatio = aspectCss;

      onStageResized?.(vpW, vpH, box.width, box.height);
      this.applyCanvasStageTransform(gameId, panAreaEl, canvasShellEl);
      onTransformUpdated();
    };

    // Chặn Safari iOS 16+ tự zoom trang web khi người chơi chụm 2 ngón tay trên bàn cờ
    const blockNativeMultiTouchZoom = (ev: TouchEvent) => {
      if (ev.touches && ev.touches.length >= 2) {
        ev.preventDefault();
      }
    };
    panAreaEl.addEventListener('touchmove', blockNativeMultiTouchZoom, { passive: false });
    const blockSafariGesture = (ev: Event) => {
      ev.preventDefault();
    };
    panAreaEl.addEventListener('gesturestart', blockSafariGesture, {
      passive: false,
    } as AddEventListenerOptions);
    panAreaEl.addEventListener('gesturechange', blockSafariGesture, {
      passive: false,
    } as AddEventListenerOptions);

    // Trackpad pinch / Ctrl+Wheel trên máy tính xách tay & desktop
    panAreaEl.addEventListener(
      'wheel',
      (ev) => {
        ev.preventDefault();
        const st = this.getState(gameId);
        const factor = ev.ctrlKey ? 0.009 : 0.0018;
        const rawNext = st.zoom * Math.exp(-ev.deltaY * factor);
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
        const next = computeFocalPinchPan({
          prevZoom: st.zoom,
          nextZoom: rawNext,
          prevPanX: st.panX,
          prevPanY: st.panY,
          prevMidOffsetX: cursorOffsetX,
          prevMidOffsetY: cursorOffsetY,
          currMidOffsetX: cursorOffsetX,
          currMidOffsetY: cursorOffsetY,
          maxZoom: getMaxZoomForMinigame(gameId),
        });
        if (next.zoom === st.zoom && next.panX === st.panX && next.panY === st.panY) return;
        st.zoom = next.zoom;
        st.panX = next.panX;
        st.panY = next.panY;
        refreshTransform();
      },
      { passive: false }
    );

    panAreaEl.addEventListener('contextmenu', (ev) => {
      if (this.getState(gameId).zoom > 1.01) {
        ev.preventDefault();
      }
    });

    const activeTouches = new Map<number, { x: number; y: number }>();
    let pinchActive = false;
    let pinchPrevDist = 0;
    let pinchPrevMidX = 0;
    let pinchPrevMidY = 0;

    // Kéo bàn 1 ngón khi đang phóng to (> 102%) trên các môn chạm điểm hoặc vùng không kéo quân
    let singleTouchCandidate: {
      pointerId: number;
      startX: number;
      startY: number;
      lastX: number;
      lastY: number;
      active: boolean;
    } | null = null;

    // Kéo bàn bằng chuột phải/giữa hoặc giữ Space/Alt trên desktop khi đã phóng to
    let dragPanPointerId: number | null = null;
    let dragPanLastX = 0;
    let dragPanLastY = 0;

    const cancelCanvasActivePointer = (pointerId: number) => {
      if (!canvasEl) return;
      try {
        canvasEl.releasePointerCapture?.(pointerId);
      } catch {
        // Ignore if not captured
      }
      if (typeof PointerEvent !== 'undefined') {
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
      }
    };

    panAreaEl.addEventListener(
      'pointerdown',
      (ev) => {
        if (ev.pointerType === 'touch') {
          activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
          this.activePinchCount = activeTouches.size;

          if (activeTouches.size >= 2) {
            singleTouchCandidate = null;
            const pts = Array.from(activeTouches.values());
            pinchPrevDist = Math.max(10, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            pinchPrevMidX = (pts[0].x + pts[1].x) * 0.5;
            pinchPrevMidY = (pts[0].y + pts[1].y) * 0.5;
            if (!pinchActive) {
              pinchActive = true;
              for (const pid of activeTouches.keys()) {
                cancelCanvasActivePointer(pid);
                try {
                  panAreaEl.setPointerCapture?.(pid);
                } catch {
                  // Ignore synthetic events
                }
              }
            } else {
              cancelCanvasActivePointer(ev.pointerId);
              try {
                panAreaEl.setPointerCapture?.(ev.pointerId);
              } catch {
                // Ignore synthetic events
              }
            }
            ev.stopPropagation();
            ev.preventDefault();
            return;
          }

          // Ngón tay đầu tiên chạm xuống: nếu bàn cờ đang phóng to và vị trí cho phép kéo 1 ngón, theo dõi ngưỡng kéo
          const st = this.getState(gameId);
          if (
            st.zoom > 1.02 &&
            canSingleFingerPanAt &&
            canSingleFingerPanAt(ev.clientX, ev.clientY)
          ) {
            singleTouchCandidate = {
              pointerId: ev.pointerId,
              startX: ev.clientX,
              startY: ev.clientY,
              lastX: ev.clientX,
              lastY: ev.clientY,
              active: false,
            };
          } else {
            singleTouchCandidate = null;
          }
          return;
        }

        const st = this.getState(gameId);
        const isAuxPanButton =
          ev.button === 1 ||
          (ev.button === 2 && st.zoom > 1.01) ||
          (ev.button === 0 && st.zoom > 1.01 && (ev.altKey || this.spacePressed));

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
            const dist = Math.max(10, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            const midX = (pts[0].x + pts[1].x) * 0.5;
            const midY = (pts[0].y + pts[1].y) * 0.5;

            const st = this.getState(gameId);
            const rawNext = st.zoom * (dist / Math.max(10, pinchPrevDist));
            const vpRect = panAreaEl.getBoundingClientRect();
            const { dialogQuarterTurn } = this.getViewportResolution(false);
            const prevLocal = clientToLocalNormalized(
              pinchPrevMidX,
              pinchPrevMidY,
              vpRect,
              dialogQuarterTurn
            );
            const currLocal = clientToLocalNormalized(midX, midY, vpRect, dialogQuarterTurn);
            const prevMidOffsetX = (prevLocal.lu - 0.5) * panAreaEl.clientWidth;
            const prevMidOffsetY = (prevLocal.lv - 0.5) * panAreaEl.clientHeight;
            const currMidOffsetX = (currLocal.lu - 0.5) * panAreaEl.clientWidth;
            const currMidOffsetY = (currLocal.lv - 0.5) * panAreaEl.clientHeight;

            const next = computeFocalPinchPan({
              prevZoom: st.zoom,
              nextZoom: rawNext,
              prevPanX: st.panX,
              prevPanY: st.panY,
              prevMidOffsetX,
              prevMidOffsetY,
              currMidOffsetX,
              currMidOffsetY,
              maxZoom: getMaxZoomForMinigame(gameId),
            });
            st.zoom = next.zoom;
            st.panX = next.panX;
            st.panY = next.panY;

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

          if (singleTouchCandidate && singleTouchCandidate.pointerId === ev.pointerId) {
            const totalMove = Math.hypot(
              ev.clientX - singleTouchCandidate.startX,
              ev.clientY - singleTouchCandidate.startY
            );
            if (!singleTouchCandidate.active && totalMove >= SINGLE_FINGER_PAN_THRESHOLD_PX) {
              singleTouchCandidate.active = true;
              singleTouchCandidate.lastX = ev.clientX;
              singleTouchCandidate.lastY = ev.clientY;
              panAreaEl.dataset.mgDragging = 'true';
              cancelCanvasActivePointer(ev.pointerId);
              try {
                panAreaEl.setPointerCapture?.(ev.pointerId);
              } catch {
                // Ignore synthetic events
              }
            }

            if (singleTouchCandidate.active) {
              const st = this.getState(gameId);
              const { dialogQuarterTurn } = this.getViewportResolution(false);
              const dLocal = screenDeltaToViewportDelta(
                ev.clientX - singleTouchCandidate.lastX,
                ev.clientY - singleTouchCandidate.lastY,
                dialogQuarterTurn
              );
              st.panX += dLocal.vx;
              st.panY += dLocal.vy;
              singleTouchCandidate.lastX = ev.clientX;
              singleTouchCandidate.lastY = ev.clientY;
              refreshTransform();
              ev.stopPropagation();
              ev.preventDefault();
              return;
            }
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
        this.activePinchCount = activeTouches.size;
        try {
          panAreaEl.releasePointerCapture?.(ev.pointerId);
        } catch {
          // Ignore
        }

        if (pinchActive) {
          this.lastPinchEndMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
          if (activeTouches.size === 0) {
            pinchActive = false;
          } else if (activeTouches.size >= 2) {
            const pts = Array.from(activeTouches.values());
            pinchPrevDist = Math.max(10, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
            pinchPrevMidX = (pts[0].x + pts[1].x) * 0.5;
            pinchPrevMidY = (pts[0].y + pts[1].y) * 0.5;
          }
          ev.stopPropagation();
          ev.preventDefault();
          return;
        }

        if (singleTouchCandidate && singleTouchCandidate.pointerId === ev.pointerId) {
          const wasPanning = singleTouchCandidate.active;
          singleTouchCandidate = null;
          delete panAreaEl.dataset.mgDragging;
          if (wasPanning) {
            ev.stopPropagation();
            ev.preventDefault();
            return;
          }
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

    let resizeRafId = 0;
    const scheduleStageResize = () => {
      if (resizeRafId) return;
      if (typeof requestAnimationFrame === 'function') {
        resizeRafId = requestAnimationFrame(() => {
          resizeRafId = 0;
          syncResponsiveStageSize(false);
        });
      } else {
        syncResponsiveStageSize(false);
      }
    };

    let stageObserver: ResizeObserver | null = null;
    if (canvasEl && typeof ResizeObserver !== 'undefined') {
      stageObserver = new ResizeObserver(() => {
        scheduleStageResize();
      });
      stageObserver.observe(panAreaEl);
    }

    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    const onVisualViewportResize = () => {
      scheduleStageResize();
    };
    if (canvasEl && vv) {
      vv.addEventListener('resize', onVisualViewportResize);
    }

    this.stageCleanupByHost.set(resolvedHostKey, () => {
      if (resizeRafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(resizeRafId);
        resizeRafId = 0;
      }
      stageObserver?.disconnect();
      stageObserver = null;
      vv?.removeEventListener('resize', onVisualViewportResize);
    });

    syncResponsiveStageSize(true);
    this.applyCanvasStageTransform(gameId, panAreaEl, canvasShellEl);
  }

  public bindDomScrollStageInteractions(params: {
    rootScope: HTMLElement;
    scrollViewportEl: HTMLElement | null;
    sizerEl: HTMLElement | null;
    contentStageEl: HTMLElement | null;
    onOrientationToggled?: () => void;
    onPlayClick?: () => void;
  }): void {
    const { scrollViewportEl, sizerEl, contentStageEl } = params;
    const gameId: MinigameViewId = 'seedquiz';

    const refresh = () => {
      this.applyDomScrollStageTransform(scrollViewportEl, sizerEl, contentStageEl);
    };

    if (!scrollViewportEl || !sizerEl || !contentStageEl) {
      return;
    }

    const blockSafariGesture = (ev: Event) => {
      ev.preventDefault();
    };
    scrollViewportEl.addEventListener('gesturestart', blockSafariGesture, {
      passive: false,
    } as AddEventListenerOptions);
    scrollViewportEl.addEventListener('gesturechange', blockSafariGesture, {
      passive: false,
    } as AddEventListenerOptions);

    scrollViewportEl.addEventListener(
      'wheel',
      (ev) => {
        if (!ev.ctrlKey && !ev.metaKey) return;
        ev.preventDefault();
        const st = this.getState(gameId);
        const prevZoom = st.zoom;
        const rawNext = prevZoom * Math.exp(-ev.deltaY * 0.007);
        const nextZoom = rawNext <= 1.015 ? 1 : clampMinigameZoom(rawNext);
        if (nextZoom === prevZoom) return;

        const vpRect = scrollViewportEl.getBoundingClientRect();
        const vx = ev.clientX - vpRect.left;
        const vy = ev.clientY - vpRect.top;
        const prevScrollLeft = scrollViewportEl.scrollLeft;
        const prevScrollTop = scrollViewportEl.scrollTop;

        st.zoom = nextZoom;
        refresh();

        const ratio = st.zoom / Math.max(0.25, prevZoom);
        scrollViewportEl.scrollLeft = Math.max(0, (prevScrollLeft + vx) * ratio - vx);
        scrollViewportEl.scrollTop = Math.max(0, (prevScrollTop + vy) * ratio - vy);
      },
      { passive: false }
    );

    // Xử lý chụm 2 ngón trực tiếp qua TouchEvent (ổn định 100% kể cả khi ngón 1 vừa cuộn dọc trên iOS Safari)
    let touchPinchPrevDist = 0;
    let touchPinchPrevVx = 0;
    let touchPinchPrevVy = 0;
    let handledViaTouchEvent = false;

    scrollViewportEl.addEventListener(
      'touchstart',
      (ev) => {
        if (ev.touches.length >= 2) {
          handledViaTouchEvent = true;
          this.activePinchCount = ev.touches.length;
          const t0 = ev.touches[0];
          const t1 = ev.touches[1];
          touchPinchPrevDist = Math.max(
            10,
            Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
          );
          const vpRect = scrollViewportEl.getBoundingClientRect();
          touchPinchPrevVx = (t0.clientX + t1.clientX) * 0.5 - vpRect.left;
          touchPinchPrevVy = (t0.clientY + t1.clientY) * 0.5 - vpRect.top;
        }
      },
      { passive: true }
    );

    scrollViewportEl.addEventListener(
      'touchmove',
      (ev) => {
        if (ev.touches.length < 2) return;
        ev.preventDefault();
        handledViaTouchEvent = true;
        const t0 = ev.touches[0];
        const t1 = ev.touches[1];
        const dist = Math.max(10, Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY));
        const vpRect = scrollViewportEl.getBoundingClientRect();
        const currVx = (t0.clientX + t1.clientX) * 0.5 - vpRect.left;
        const currVy = (t0.clientY + t1.clientY) * 0.5 - vpRect.top;

        if (touchPinchPrevDist > 0) {
          const st = this.getState(gameId);
          const prevZoom = st.zoom;
          const rawNext = prevZoom * (dist / touchPinchPrevDist);
          const nextZoom = rawNext <= 1.015 ? 1 : clampMinigameZoom(rawNext);
          const prevScrollLeft = scrollViewportEl.scrollLeft;
          const prevScrollTop = scrollViewportEl.scrollTop;

          st.zoom = nextZoom;
          refresh();

          const ratio = st.zoom / Math.max(0.25, prevZoom);
          scrollViewportEl.scrollLeft = Math.max(0, (prevScrollLeft + touchPinchPrevVx) * ratio - currVx);
          scrollViewportEl.scrollTop = Math.max(0, (prevScrollTop + touchPinchPrevVy) * ratio - currVy);
        }

        touchPinchPrevDist = dist;
        touchPinchPrevVx = currVx;
        touchPinchPrevVy = currVy;
      },
      { passive: false }
    );

    const resetTouchPinch = (ev: TouchEvent) => {
      this.activePinchCount = ev.touches.length;
      if (ev.touches.length < 2) {
        if (touchPinchPrevDist > 0) {
          this.lastPinchEndMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
        }
        touchPinchPrevDist = 0;
      } else {
        const t0 = ev.touches[0];
        const t1 = ev.touches[1];
        touchPinchPrevDist = Math.max(
          10,
          Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY)
        );
        const vpRect = scrollViewportEl.getBoundingClientRect();
        touchPinchPrevVx = (t0.clientX + t1.clientX) * 0.5 - vpRect.left;
        touchPinchPrevVy = (t0.clientY + t1.clientY) * 0.5 - vpRect.top;
      }
    };
    scrollViewportEl.addEventListener('touchend', resetTouchPinch, { passive: true });
    scrollViewportEl.addEventListener('touchcancel', resetTouchPinch, { passive: true });

    // Dự phòng PointerEvent cho thiết bị cảm ứng không phát TouchEvent
    const activePointers = new Map<number, { x: number; y: number }>();
    let ptrPinchPrevDist = 0;
    scrollViewportEl.addEventListener(
      'pointerdown',
      (ev) => {
        if (ev.pointerType !== 'touch' || handledViaTouchEvent) return;
        activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (activePointers.size >= 2) {
          const pts = Array.from(activePointers.values());
          ptrPinchPrevDist = Math.max(10, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
        }
      },
      { passive: true }
    );
    scrollViewportEl.addEventListener(
      'pointermove',
      (ev) => {
        if (ev.pointerType !== 'touch' || handledViaTouchEvent || !activePointers.has(ev.pointerId)) {
          return;
        }
        activePointers.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (activePointers.size >= 2 && ptrPinchPrevDist > 0) {
          const pts = Array.from(activePointers.values());
          const dist = Math.max(10, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y));
          const st = this.getState(gameId);
          const rawNext = st.zoom * (dist / ptrPinchPrevDist);
          st.zoom = rawNext <= 1.015 ? 1 : clampMinigameZoom(rawNext);
          ptrPinchPrevDist = dist;
          refresh();
          ev.preventDefault();
        }
      },
      { passive: false }
    );
    const endPtr = (ev: PointerEvent) => {
      activePointers.delete(ev.pointerId);
      if (activePointers.size < 2) ptrPinchPrevDist = 0;
    };
    scrollViewportEl.addEventListener('pointerup', endPtr, { passive: true });
    scrollViewportEl.addEventListener('pointercancel', endPtr, { passive: true });

    refresh();
  }
}

export const sharedMinigameViewport = new MinigameViewportManager();

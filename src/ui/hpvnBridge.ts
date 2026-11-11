/**
 * HpvnBridge — Cầu Nối Iframe & Mạng Floo Độc Lập cho 'Trang Trại Hang Sóc' (`postMessage` Host-Frame Protocol)
 * Cô lập hoàn toàn kênh sự kiện khỏi Hagrid Farm khi cả 2 game cùng mở trên diễn đàn HPVN:
 *  - Chiều Game -> Host (`source: 'hpvn-burrow-garden'`):
 *      + `hpvn:burrow:ready`
 *      + `hpvn:burrow:state`
 *      + `hpvn:burrow:share-floo`
 *      + `hpvn:burrow:snapshot`
 *  - Chiều Host -> Game (`source: 'hpvn-host-shell'`):
 *      + `hpvn:burrow:set-atmosphere` / `hpvn:host:set-atmosphere` (`dawn | day | dusk | night`)
 *      + `hpvn:burrow:set-weather` / `hpvn:host:set-weather` (`clear | cloudy | rain | storm | snow | fog | fireflies`)
 *      + `hpvn:burrow:set-event` / `hpvn:host:set-event`
 *      + `hpvn:burrow:tour-garden` / `hpvn:host:tour-garden`
 *      + `hpvn:burrow:mute` / `hpvn:host:mute`
 *      + `hpvn:burrow:request-snapshot` / `hpvn:host:request-snapshot`
 */

export const BURROW_BRIDGE_SOURCE = 'hpvn-burrow-garden';

export interface HpvnBridgeEnvelope {
  source: 'hpvn-burrow-garden' | 'hpvn-host-shell';
  version: string;
  type: string;
  payload: Record<string, unknown>;
  sentAt: number;
}

export interface FlooShareContext {
  parkName?: string;
  playerName?: string;
  tourId?: string;
  level?: number;
  magicStars?: number;
  unlockedZonesCount?: number;
  buildingsCount?: number;
  house?: string;
  atmosphereMode?: string;
  weatherMode?: string;
  eventMode?: string;
  keeperTitle?: string;
  image?: string;
  sendToFloo?: (text: string, ctx: FlooShareContext) => Promise<boolean> | boolean;
}

export interface ValleyPostcardMeta {
  parkName?: string;
  playerName?: string;
  level?: number;
  house?: string;
  keeperTitle?: string;
  magicStars?: number;
  buildingsCount?: number;
  unlockedZonesCount?: number;
  weatherMode?: string;
  atmosphereMode?: string;
}

const VALID_ATMOSPHERES = new Set(['auto', 'dawn', 'day', 'dusk', 'night']);
const VALID_WEATHERS = new Set([
  'auto',
  'clear',
  'cloudy',
  'rain',
  'storm',
  'snow',
  'fog',
  'fireflies',
]);

export const DEFAULT_ALLOWED_HPVN_ORIGINS: ReadonlyArray<string | RegExp> = [
  /^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,
  /^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,
  /^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,
  /^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];

/**
 * Kiểm tra `MessageEvent.origin` có thuộc danh sách miền tin cậy của HPVN hay không.
 */
export function isTrustedHpvnOrigin(
  origin: string | undefined | null,
  extraAllowed?: ReadonlyArray<string | RegExp>
): boolean {
  const clean = typeof origin === 'string' ? origin.trim() : '';
  if (!clean || clean === 'null') return false;
  if (typeof window !== 'undefined' && window.location?.origin && clean === window.location.origin) {
    return true;
  }
  const rules = extraAllowed && extraAllowed.length > 0
    ? [...DEFAULT_ALLOWED_HPVN_ORIGINS, ...extraAllowed]
    : DEFAULT_ALLOWED_HPVN_ORIGINS;
  for (const rule of rules) {
    if (typeof rule === 'string') {
      if (rule === clean) return true;
    } else if (rule.test(clean)) {
      return true;
    }
  }
  return false;
}

function resolveInitialTrustedParentOrigin(
  explicitTargetOrigin?: string,
  extraAllowed?: ReadonlyArray<string | RegExp>
): string | null {
  if (explicitTargetOrigin && explicitTargetOrigin !== '*') {
    return explicitTargetOrigin;
  }
  if (typeof document !== 'undefined' && document.referrer) {
    try {
      const refOrigin = new URL(document.referrer).origin;
      if (isTrustedHpvnOrigin(refOrigin, extraAllowed)) {
        return refOrigin;
      }
    } catch {
      // Ignore malformed referrer
    }
  }
  return null;
}

export function normalizeBridgeAtmosphere(raw: unknown): string {
  const s = String(raw || 'day').toLowerCase();
  return VALID_ATMOSPHERES.has(s) ? s : 'day';
}

export function normalizeBridgeWeather(raw: unknown): string {
  const s = String(raw || 'clear').toLowerCase();
  return VALID_WEATHERS.has(s) ? s : 'clear';
}

export function formatFlooShareMessage(ctx: FlooShareContext = {}): string {
  const parkName = ctx.parkName || 'Trang Trại Hang Sóc';
  const playerPart =
    ctx.playerName && ctx.playerName.trim() && ctx.playerName.trim() !== parkName
      ? ` · ${ctx.playerName.trim()}`
      : '';
  const level = Math.max(1, Math.floor(Number(ctx.level) || 1));
  const stars = Math.max(0, Math.floor(Number(ctx.magicStars) || 0));
  const zones = Math.max(1, Math.floor(Number(ctx.unlockedZonesCount) || 1));
  const buildings = Math.max(0, Math.floor(Number(ctx.buildingsCount) || 0));
  const housePart = ctx.house ? ` · Nhà ${ctx.house}` : '';
  const titlePart = ctx.keeperTitle ? ` · [${ctx.keeperTitle}]` : '';
  const weatherLabels: Record<string, string> = {
    rain: '🌧️ Mưa phùn',
    storm: '⛈️ Giông phép',
    snow: '❄️ Tuyết rơi',
    fog: '🌫️ Sương mù',
    fireflies: '✨ Đom đóm đêm',
  };
  const weatherPart =
    ctx.weatherMode && weatherLabels[ctx.weatherMode]
      ? ` (${weatherLabels[ctx.weatherMode]})`
      : '';

  return `🏰 [${parkName}${playerPart} · Cấp ${level}${housePart}${titlePart}]${weatherPart} — ${zones}/10 vùng mở khóa, ${buildings} công trình & ${stars} 🌟 Sao Phép Thuật!`;
}

export interface CreateHpvnBridgeOptions {
  onAtmosphereChange?: (mode: string) => void;
  onWeatherChange?: (mode: string) => void;
  onEventChange?: (mode: string) => void;
  onStartTour?: (tourId: string) => void;
  onStopTour?: () => void;
  onMuteChange?: (muted: boolean) => void;
  getSnapshot?: () => Record<string, unknown>;
  notify?: (msg: string) => void;
  allowedOrigins?: ReadonlyArray<string | RegExp>;
  targetOrigin?: string;
  allowAnyOrigin?: boolean;
  win?: Pick<Window, 'parent' | 'addEventListener' | 'removeEventListener'> & { parent?: unknown };
  nav?: { clipboard?: { writeText?: (text: string) => Promise<void> } };
}

export function createHpvnBridge(options: CreateHpvnBridgeOptions = {}) {
  const history: HpvnBridgeEnvelope[] = [];
  const win = options.win ?? (typeof window !== 'undefined' ? window : undefined);
  const nav = options.nav ?? (typeof navigator !== 'undefined' ? navigator : undefined);
  let trustedHostOrigin = resolveInitialTrustedParentOrigin(
    options.targetOrigin,
    options.allowedOrigins
  );

  function postToHost(type: string, payload: Record<string, unknown> = {}): HpvnBridgeEnvelope {
    const envelope: HpvnBridgeEnvelope = {
      source: BURROW_BRIDGE_SOURCE,
      version: '25.1',
      type,
      payload,
      sentAt: Date.now(),
    };
    history.push(envelope);
    if (history.length > 24) history.shift();
    try {
      const parentWin = win?.parent as Window | undefined;
      if (parentWin && parentWin !== (win as unknown as Window) && typeof parentWin.postMessage === 'function') {
        const destOrigin = options.targetOrigin || trustedHostOrigin || '*';
        parentWin.postMessage(envelope, destOrigin);
      }
    } catch {
      // Bỏ qua an toàn khi không có parent shell
    }
    return envelope;
  }

  function handleMessage(event: Event): void {
    const msgEvent = event as MessageEvent;
    if (
      msgEvent.source != null &&
      win?.parent != null &&
      msgEvent.source !== (win.parent as unknown as MessageEventSource)
    ) {
      return;
    }
    if (
      !options.allowAnyOrigin &&
      typeof msgEvent.origin === 'string' &&
      msgEvent.origin.length > 0
    ) {
      if (!isTrustedHpvnOrigin(msgEvent.origin, options.allowedOrigins)) {
        return;
      }
      trustedHostOrigin = msgEvent.origin;
    }

    const data = msgEvent?.data as Record<string, unknown> | null;
    if (!data || typeof data !== 'object') return;
    const payload =
      data.payload && typeof data.payload === 'object'
        ? (data.payload as Record<string, unknown>)
        : {};

    if (data.type === 'hpvn:burrow:set-atmosphere' || data.type === 'hpvn:host:set-atmosphere') {
      options.onAtmosphereChange?.(normalizeBridgeAtmosphere(payload.mode ?? data.mode));
    } else if (data.type === 'hpvn:burrow:set-weather' || data.type === 'hpvn:host:set-weather') {
      options.onWeatherChange?.(normalizeBridgeWeather(payload.mode ?? data.mode));
    } else if (data.type === 'hpvn:burrow:set-event' || data.type === 'hpvn:host:set-event') {
      options.onEventChange?.(String(payload.mode ?? data.mode ?? 'auto'));
    } else if (data.type === 'hpvn:burrow:tour-garden' || data.type === 'hpvn:host:tour-garden') {
      const tourId = payload.tourId ?? data.tourId ?? null;
      if (tourId) options.onStartTour?.(String(tourId));
      else options.onStopTour?.();
    } else if (data.type === 'hpvn:burrow:mute' || data.type === 'hpvn:host:mute') {
      options.onMuteChange?.(Boolean(payload.muted ?? data.muted));
    } else if (
      data.type === 'hpvn:burrow:request-snapshot' ||
      data.type === 'hpvn:host:request-snapshot'
    ) {
      const snap = options.getSnapshot ? options.getSnapshot() : {};
      postToHost('hpvn:burrow:snapshot', snap);
    }
  }

  if (win && typeof win.addEventListener === 'function') {
    win.addEventListener('message', handleMessage);
  }

  async function shareToFloo(ctx: FlooShareContext = {}) {
    const text = formatFlooShareMessage(ctx);
    const envelope = postToHost('hpvn:burrow:share-floo', {
      text,
      level: ctx.level ?? 1,
      parkName: ctx.parkName ?? 'Trang Trại Hang Sóc',
      ...(ctx.playerName ? { playerName: ctx.playerName } : {}),
      ...(ctx.tourId ? { tourId: ctx.tourId } : {}),
      ...(ctx.image ? { image: ctx.image } : {}),
      atmosphereMode: normalizeBridgeAtmosphere(ctx.atmosphereMode),
      weatherMode: normalizeBridgeWeather(ctx.weatherMode),
      eventMode: ctx.eventMode ?? 'auto',
    });

    if (typeof ctx.sendToFloo === 'function' && (await ctx.sendToFloo(text, ctx)) === true) {
      options.notify?.(
        ctx.image
          ? '✨ Bưu thiếp thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.'
          : '✨ Lời khoe thung lũng đã nằm sẵn trong Mạng Floo · xem lại rồi bấm gửi nhé.'
      );
      return { ok: true, text, copied: false, floo: true, envelope };
    }

    let copied = false;
    try {
      if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }
    options.notify?.(
      copied
        ? `✨ Đã chép thông điệp khoe thung lũng lên Mạng Floo: "${text}"`
        : `✨ Đã gửi thông điệp khoe thung lũng: "${text}"`
    );
    return { ok: true, text, copied, envelope };
  }

  return {
    notifyReady: (info: Record<string, unknown> = {}) => postToHost('hpvn:burrow:ready', info),
    syncState: (summary: Record<string, unknown> = {}) => postToHost('hpvn:burrow:state', summary),
    shareToFloo,
    shareGardenToFloo: shareToFloo,
    history: () => [...history],
    destroy: () => {
      if (win && typeof win.removeEventListener === 'function') {
        win.removeEventListener('message', handleMessage);
      }
    },
  };
}

/**
 * Adapter phía trang chủ HPVN (`/phongsinhoatchung`) để điều khiển & lắng nghe iframe game.
 */
export function createHpvnHostBridge(options: {
  iframe?: { contentWindow?: { postMessage: (msg: unknown, targetOrigin: string) => void } | null } | null;
  targetWindow?: { postMessage: (msg: unknown, targetOrigin: string) => void } | null;
  targetOrigin?: string;
  allowedOrigins?: ReadonlyArray<string | RegExp>;
  allowAnyOrigin?: boolean;
  onReady?: (payload: Record<string, unknown>, envelope: HpvnBridgeEnvelope) => void;
  onStateSync?: (payload: Record<string, unknown>, envelope: HpvnBridgeEnvelope) => void;
  onShareFloo?: (payload: Record<string, unknown>, envelope: HpvnBridgeEnvelope) => void;
  onSnapshot?: (payload: Record<string, unknown>, envelope: HpvnBridgeEnvelope) => void;
  win?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
} = {}) {
  const received: HpvnBridgeEnvelope[] = [];
  const win = options.win ?? (typeof window !== 'undefined' ? window : undefined);
  let trustedChildOrigin: string | null =
    options.targetOrigin && options.targetOrigin !== '*' ? options.targetOrigin : null;

  function resolveTarget() {
    if (options.targetWindow && typeof options.targetWindow.postMessage === 'function') {
      return options.targetWindow;
    }
    if (options.iframe?.contentWindow && typeof options.iframe.contentWindow.postMessage === 'function') {
      return options.iframe.contentWindow;
    }
    return null;
  }

  function sendToGarden(type: string, payload: Record<string, unknown> = {}): HpvnBridgeEnvelope {
    const command: HpvnBridgeEnvelope = {
      source: 'hpvn-host-shell',
      version: '23.0',
      type,
      payload,
      sentAt: Date.now(),
    };
    const target = resolveTarget();
    try {
      target?.postMessage(command, options.targetOrigin || trustedChildOrigin || '*');
    } catch {
      // Bỏ qua lỗi postMessage cross-origin nếu iframe chưa tải xong
    }
    return command;
  }

  function handleGardenMessage(event: Event): void {
    const msgEvent = event as MessageEvent;
    const expectedTarget = resolveTarget();
    if (
      msgEvent.source != null &&
      expectedTarget != null &&
      msgEvent.source !== (expectedTarget as unknown as MessageEventSource)
    ) {
      return;
    }
    if (
      !options.allowAnyOrigin &&
      typeof msgEvent.origin === 'string' &&
      msgEvent.origin.length > 0
    ) {
      if (!isTrustedHpvnOrigin(msgEvent.origin, options.allowedOrigins)) {
        return;
      }
      trustedChildOrigin = msgEvent.origin;
    }
    const data = msgEvent?.data as HpvnBridgeEnvelope | null;
    if (!data || typeof data !== 'object' || data.source !== BURROW_BRIDGE_SOURCE) return;
    received.push(data);
    if (received.length > 32) received.shift();

    if (data.type === 'hpvn:burrow:ready') options.onReady?.(data.payload, data);
    else if (data.type === 'hpvn:burrow:state') options.onStateSync?.(data.payload, data);
    else if (data.type === 'hpvn:burrow:share-floo') options.onShareFloo?.(data.payload, data);
    else if (data.type === 'hpvn:burrow:snapshot') options.onSnapshot?.(data.payload, data);
  }

  if (win && typeof win.addEventListener === 'function') {
    win.addEventListener('message', handleGardenMessage);
  }

  return {
    setAtmosphere: (mode: string) =>
      sendToGarden('hpvn:burrow:set-atmosphere', { mode: normalizeBridgeAtmosphere(mode) }),
    setWeather: (mode: string) =>
      sendToGarden('hpvn:burrow:set-weather', { mode: normalizeBridgeWeather(mode) }),
    setEvent: (mode: string) => sendToGarden('hpvn:burrow:set-event', { mode }),
    tourGarden: (tourId: string | null) =>
      sendToGarden('hpvn:burrow:tour-garden', { tourId: tourId || null }),
    setMuted: (muted: boolean) => sendToGarden('hpvn:burrow:mute', { muted: Boolean(muted) }),
    requestSnapshot: () => sendToGarden('hpvn:burrow:request-snapshot', {}),
    received: () => [...received],
    destroy: () => {
      if (win && typeof win.removeEventListener === 'function') {
        win.removeEventListener('message', handleGardenMessage);
      }
    },
  };
}

/**
 * Vẽ Bưu Thiếp Thung Lũng (`640 × 380`) đóng khung gỗ sồi & đồng thau phép thuật chuẩn `hagridfarm`,
 * chụp trực tiếp từ `#gameCanvas` kèm tên chủ vườn, Cấp độ, Nhà Hogwarts, thời tiết & huy hiệu Bay Floo.
 */
export function renderValleyPostcardCanvas(
  sourceCanvas: HTMLCanvasElement | null | undefined,
  meta: ValleyPostcardMeta = {},
  targetCanvas?: HTMLCanvasElement
): HTMLCanvasElement {
  const width = 640;
  const height = 380;
  const canvas =
    targetCanvas ??
    (typeof document !== 'undefined'
      ? document.createElement('canvas')
      : ({ width, height, getContext: () => null, toDataURL: () => '' } as unknown as HTMLCanvasElement));
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const parkName = (meta.parkName || 'Trang Trại Hang Sóc').slice(0, 38);
  const playerName = (meta.playerName || 'Phù Thủy Hang Sóc').slice(0, 32);
  const level = Math.max(1, Math.floor(Number(meta.level) || 1));
  const house = meta.house || 'Gryffindor';
  const stars = Math.max(0, Math.floor(Number(meta.magicStars) || 0));
  const buildings = Math.max(0, Math.floor(Number(meta.buildingsCount) || 0));
  const zones = Math.max(1, Math.floor(Number(meta.unlockedZonesCount) || 1));

  // Khung gỗ sồi sẫm + viền đồng thau đôi
  ctx.fillStyle = '#2b1910';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#d4a238';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, width - 12, height - 12);
  ctx.strokeStyle = 'rgba(248, 236, 200, 0.38)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  // Dải tiêu đề trên cùng
  ctx.fillStyle = '#3b2316';
  ctx.fillRect(16, 16, width - 32, 30);
  ctx.fillStyle = '#f6df9e';
  ctx.font = '700 13px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔥 MẠNG FLOO HPVN · BƯU THIẾP THUNG LŨNG', 26, 31);

  const weatherBadgeMap: Record<string, string> = {
    clear: '☀️ Nắng ấm',
    cloudy: '⛅ Mây nhẹ',
    rain: '🌧️ Mưa phùn',
    storm: '⛈️ Giông phép',
    snow: '❄️ Tuyết rơi',
    fog: '🌫️ Sương mù',
    fireflies: '✨ Đom đóm',
  };
  const weatherLabel =
    weatherBadgeMap[String(meta.weatherMode || 'clear')] || '☀️ Nắng ấm Hang Sóc';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ebd4a7';
  ctx.font = '600 12px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.fillText(weatherLabel, width - 26, 31);
  ctx.textAlign = 'left';

  // Khung ảnh chụp thung lũng (cover-crop từ #gameCanvas)
  const vx = 18;
  const vy = 50;
  const vw = width - 36;
  const vh = 248;
  ctx.save();
  ctx.beginPath();
  ctx.rect(vx, vy, vw, vh);
  ctx.clip();

  let drewScene = false;
  if (sourceCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
    try {
      const srcRatio = sourceCanvas.width / sourceCanvas.height;
      const dstRatio = vw / vh;
      let sx = 0;
      let sy = 0;
      let sw = sourceCanvas.width;
      let sh = sourceCanvas.height;
      if (srcRatio > dstRatio) {
        sw = Math.round(sourceCanvas.height * dstRatio);
        sx = Math.round((sourceCanvas.width - sw) / 2);
      } else {
        sh = Math.round(sourceCanvas.width / dstRatio);
        sy = Math.round((sourceCanvas.height - sh) / 2);
      }
      ctx.drawImage(sourceCanvas, sx, sy, sw, sh, vx, vy, vw, vh);
      drewScene = true;
    } catch {
      drewScene = false;
    }
  }

  if (!drewScene) {
    const grad = ctx.createLinearGradient(vx, vy, vx, vy + vh);
    grad.addColorStop(0, '#365843');
    grad.addColorStop(0.55, '#598249');
    grad.addColorStop(1, '#334d2c');
    ctx.fillStyle = grad;
    ctx.fillRect(vx, vy, vw, vh);
  }
  ctx.restore();

  ctx.strokeStyle = '#c89632';
  ctx.lineWidth = 2;
  ctx.strokeRect(vx, vy, vw, vh);

  // Nhãn giấy da cừu phía dưới
  const px = 18;
  const py = 304;
  const pw = width - 36;
  const ph = 58;
  ctx.fillStyle = '#f6ebd2';
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = '#b9852c';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px, py, pw, ph);

  const houseCrest: Record<string, string> = {
    Gryffindor: '🦁',
    Ravenclaw: '🦅',
    Hufflepuff: '🦡',
    Slytherin: '🐍',
  };
  const crest = houseCrest[house] || '🪄';

  ctx.fillStyle = '#2d1a0e';
  ctx.font = '700 16px "Playfair Display", Georgia, serif';
  ctx.fillText(`${crest} ${parkName} · Cấp ${level}`, px + 14, py + 21);

  ctx.fillStyle = '#5c3d24';
  ctx.font = '600 12px "Be Vietnam Pro", system-ui, sans-serif';
  const titleSuffix = meta.keeperTitle ? ` · ${meta.keeperTitle}` : '';
  ctx.fillText(
    `${playerName} · Nhà ${house}${titleSuffix} · ${zones}/10 vùng · ${buildings} công trình · ${stars} 🌟`,
    px + 14,
    py + 42
  );

  // Con dấu sáp xanh ngọc lửa Floo góc phải
  const stampW = 142;
  const stampH = 34;
  const stampX = px + pw - stampW - 12;
  const stampY = py + 12;
  ctx.fillStyle = '#1d5c4b';
  ctx.fillRect(stampX, stampY, stampW, stampH);
  ctx.strokeStyle = '#7fe5bd';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(stampX, stampY, stampW, stampH);
  ctx.fillStyle = '#f7fff9';
  ctx.font = '700 11.5px "Be Vietnam Pro", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🔥 RỦ BẠN BAY FLOO', stampX + stampW / 2, stampY + stampH / 2 + 1);
  ctx.textAlign = 'left';

  return canvas;
}

/**
 * Xuất Bưu Thiếp Thung Lũng sang ảnh nén nhẹ `image/webp` (`640px`, `q=0.55`) chuẩn `hagridfarm`
 * (tự động fallback sang `image/png` trên môi trường thiếu encoder WebP).
 */
export function valleyPostcardToWebpDataUrl(
  cardCanvas: HTMLCanvasElement,
  quality = 0.55
): string {
  try {
    const webp = cardCanvas.toDataURL('image/webp', quality);
    if (typeof webp === 'string' && webp.startsWith('data:image/webp')) {
      return webp;
    }
    const png = cardCanvas.toDataURL('image/png');
    return typeof png === 'string' ? png : '';
  } catch {
    return '';
  }
}

/**
 * Kiểm toán mã nguồn tương thích iOS Safari 16.0+ (không regex lookbehind, không ES2024+ chưa polyfill).
 */
export function auditIos16SourceCompatibility(sourceText = ''): {
  compatible: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const text = String(sourceText);
  const lbPos = '(' + '?<=';
  const lbNeg = '(' + '?<!';
  if (text.includes(lbPos) || text.includes(lbNeg)) {
    issues.push('Contains regex lookbehind unsupported on iOS Safari 16.0-16.3');
  }
  if (/\b(?:Object|Map)\.groupBy\b/.test(text)) {
    issues.push('Contains unguarded groupBy (Safari 17.4+)');
  }
  if (/\bPromise\.withResolvers\b/.test(text)) {
    issues.push('Contains unguarded withResolvers (Safari 17.4+)');
  }
  if (/\bArray\.fromAsync\b/.test(text)) {
    issues.push('Contains unguarded fromAsync (Safari 16.4+)');
  }
  return { compatible: issues.length === 0, issues };
}

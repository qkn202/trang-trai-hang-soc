// HPVN: the drawing half of upstream's src/ui/hpvnBridge.ts (postcard + Floo text); its postMessage protocol is
// replaced by src/hpvn/bridge.ts, which sends the picture to Floo (`farm-share`).
import { canvasSpritesReady, fillTextRaw, measureTextRaw } from './emoji';

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
  const titlePart = ctx.keeperTitle ? ` · ${ctx.keeperTitle}` : ''; // HPVN: no inner [ ], the caption is already in [ ]
  const weatherLabels: Record<string, string> = {
    rain: 'Mưa phùn',
    storm: 'Giông phép',
    snow: 'Tuyết rơi',
    fog: 'Sương mù',
    fireflies: 'Đom đóm đêm',
  };
  const weatherPart =
    ctx.weatherMode && weatherLabels[ctx.weatherMode]
      ? ` (${weatherLabels[ctx.weatherMode]})`
      : '';

  // HPVN: no emoji in the template; the names stay exactly as the member wrote them
  return `[${parkName}${playerPart} · Cấp ${level}${housePart}${titlePart}]${weatherPart} — ${zones}/10 vùng mở khóa, ${buildings} công trình & ${stars} Sao Phép Thuật!`;
}


const HOUSE_CREST: Record<string, string> = {
  Gryffindor: '🦁',
  Ravenclaw: '🦅',
  Hufflepuff: '🦡',
  Slytherin: '🐍',
};
/** HPVN: the postcard's sprites (4 crests, the fallback wand, the star), decoded before it is drawn; after 2 s it draws
 *  with what has loaded, so a stalled sprite never keeps the share button locked. */
export const postcardSpritesReady = (): Promise<unknown> =>
  Promise.race([
    canvasSpritesReady(['crest-gryffindor', 'crest-ravenclaw', 'crest-hufflepuff', 'crest-slytherin', 'ui_icon_hammer_wand', 'm3_icon_star']),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);

/**
 * Vẽ Bưu Thiếp Thung Lũng (`640 × 380`) đóng khung gỗ sồi & đồng thau phép thuật chuẩn `hagridfarm`,
 * chụp trực tiếp từ `#gameCanvas` (và `#gpuWorldCanvas` bên dưới khi chạy WebGL2) kèm tên chủ vườn, Cấp độ, Nhà Hogwarts, thời tiết & huy hiệu Bay Floo.
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
  // cover-crop one canvas into the photo frame
  const drawCover = (src: HTMLCanvasElement) => {
    const dstRatio = vw / vh;
    let sx = 0;
    let sy = 0;
    let sw = src.width;
    let sh = src.height;
    if (sw / sh > dstRatio) {
      sw = Math.round(src.height * dstRatio);
      sx = Math.round((src.width - sw) / 2);
    } else {
      sh = Math.round(src.width / dstRatio);
      sy = Math.round((src.height - sh) / 2);
    }
    ctx.drawImage(src, sx, sy, sw, sh, vx, vy, vw, vh);
  };
  if (sourceCanvas && sourceCanvas.width > 0 && sourceCanvas.height > 0) {
    try {
      // WebGL2 renderer: the ground lives on #gpuWorldCanvas under #gameCanvas, so draw it first
      const gpuEl =
        typeof document !== 'undefined' && sourceCanvas.id === 'gameCanvas'
          ? (document.getElementById('gpuWorldCanvas') as HTMLCanvasElement | null)
          : null;
      if (gpuEl && gpuEl.style.display !== 'none' && gpuEl.width > 0 && gpuEl.height > 0) drawCover(gpuEl);
      drawCover(sourceCanvas);
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

  const crest = HOUSE_CREST[house] || '🪄';

  // HPVN: the crest and the star are sprites (emoji filter); the park and player names are drawn unfiltered
  ctx.fillStyle = '#2d1a0e';
  ctx.font = '700 16px "Be Vietnam Pro", sans-serif';
  ctx.fillText(`${crest} `, px + 14, py + 21);
  const nameX = px + 14 + ctx.measureText(`${crest} `).width;
  fillTextRaw(ctx, parkName, nameX, py + 21);
  ctx.fillText(` · Cấp ${level}`, nameX + measureTextRaw(ctx, parkName), py + 21);

  ctx.fillStyle = '#5c3d24';
  ctx.font = '600 12px "Be Vietnam Pro", system-ui, sans-serif';
  const titleSuffix = meta.keeperTitle ? ` · ${meta.keeperTitle}` : '';
  fillTextRaw(ctx, playerName, px + 14, py + 42);
  ctx.fillText(
    ` · Nhà ${house}${titleSuffix} · ${zones}/10 vùng · ${buildings} công trình · ${stars} 🌟`,
    px + 14 + measureTextRaw(ctx, playerName),
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

import type { MagicalAudio } from '../engine/audio';

export type ParsedYouTubeSource =
  | { kind: 'video'; videoId: string; playlistId?: string }
  | { kind: 'playlist'; playlistId: string };

export interface YouTubeBgmPreset {
  id: string;
  label: string;
  url: string;
}

export const DEFAULT_YOUTUBE_BGM_URL = 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

export const YOUTUBE_BGM_PRESETS: ReadonlyArray<YouTubeBgmPreset> = [
  {
    id: 'cozy_lofi_247',
    label: '🧣 Lofi Ấm Áp 24/7',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
  },
  {
    id: 'winter_night_chill',
    label: '❄️ Đêm Đông Tuyết Rơi',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
  },
  {
    id: 'relaxing_piano',
    label: '🎹 Piano Thung Lũng',
    url: 'https://www.youtube.com/watch?v=DWcJFNfaw9c',
  },
];

const YT_VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const YT_PLAYLIST_ID_RE = /^[A-Za-z0-9_-]{10,64}$/;

/**
 * Tách an toàn Video ID hoặc Playlist ID từ mọi định dạng link YouTube phổ biến
 * (youtube.com/watch?v=..., youtu.be/..., youtube.com/live/..., embed/..., playlist?list=... hoặc mã 11 ký tự).
 */
export function parseYouTubeBgmSource(rawInput: string | undefined | null): ParsedYouTubeSource | null {
  const trimmed = String(rawInput ?? '').trim();
  if (!trimmed) return null;

  if (YT_VIDEO_ID_RE.test(trimmed)) {
    return { kind: 'video', videoId: trimmed };
  }

  let candidate = trimmed;
  if (!/^https?:\/\//i.test(candidate) && /^(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//i.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  try {
    const u = new URL(candidate);
    const host = u.hostname.replace(/^(www\.|m\.|music\.)/i, '').toLowerCase();
    if (host !== 'youtube.com' && host !== 'youtu.be' && host !== 'youtube-nocookie.com') {
      return null;
    }

    const listParam = u.searchParams.get('list')?.trim() || undefined;
    const validPlaylist = listParam && YT_PLAYLIST_ID_RE.test(listParam) ? listParam : undefined;

    if (host === 'youtu.be') {
      const seg = u.pathname.split('/').filter(Boolean)[0] ?? '';
      if (YT_VIDEO_ID_RE.test(seg)) {
        return { kind: 'video', videoId: seg, ...(validPlaylist ? { playlistId: validPlaylist } : {}) };
      }
      return null;
    }

    const vParam = u.searchParams.get('v')?.trim() ?? '';
    if (YT_VIDEO_ID_RE.test(vParam)) {
      return { kind: 'video', videoId: vParam, ...(validPlaylist ? { playlistId: validPlaylist } : {}) };
    }

    const parts = u.pathname.split('/').filter(Boolean);
    if (
      parts.length >= 2 &&
      (parts[0] === 'embed' || parts[0] === 'live' || parts[0] === 'shorts' || parts[0] === 'v') &&
      YT_VIDEO_ID_RE.test(parts[1])
    ) {
      return { kind: 'video', videoId: parts[1], ...(validPlaylist ? { playlistId: validPlaylist } : {}) };
    }

    if (validPlaylist) {
      return { kind: 'playlist', playlistId: validPlaylist };
    }
  } catch {
    return null;
  }

  return null;
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  setVolume: (vol0to100: number) => void;
  unMute: () => void;
  loadVideoById: (opts: { videoId: string } | string) => void;
  loadPlaylist: (opts: { list: string; listType: 'playlist' }) => void;
  destroy: () => void;
  getPlayerState?: () => number;
}

interface YTGlobalNamespace {
  Player?: new (
    el: HTMLElement | string,
    opts: {
      host?: string;
      width?: string | number;
      height?: string | number;
      videoId?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (ev: { target: YTPlayerInstance }) => void;
        onStateChange?: (ev: { data: number; target: YTPlayerInstance }) => void;
        onError?: (ev: { data: number }) => void;
      };
    }
  ) => YTPlayerInstance;
}

declare global {
  interface Window {
    YT?: YTGlobalNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTGlobalNamespace> | null = null;

function loadYouTubeIframeApi(): Promise<YTGlobalNamespace> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('No DOM environment'));
  }
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise<YTGlobalNamespace>((resolve, reject) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    const timeoutId = window.setTimeout(() => {
      ytApiPromise = null;
      reject(new Error('YouTube IFrame API timeout'));
    }, 12_000);

    window.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeoutId);
      prevReady?.();
      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        ytApiPromise = null;
        reject(new Error('YT.Player unavailable'));
      }
    };

    if (!document.querySelector('script[data-yt-bgm-api="1"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.dataset.ytBgmApi = '1';
      tag.onerror = () => {
        window.clearTimeout(timeoutId);
        ytApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API'));
      };
      document.head.appendChild(tag);
    }
  });

  return ytApiPromise;
}

export class YouTubeBgmController {
  private audio: MagicalAudio;
  private onToast?: (msg: string, icon?: string) => void;
  private onStatusChange?: () => void;
  private hostWrap: HTMLElement | null = null;
  private playerMount: HTMLElement | null = null;
  private player: YTPlayerInstance | null = null;
  private playerReady = false;
  private loadedKey = '';
  private desiredEnabled = false;
  private desiredBgmMasterOn = true;
  private desiredSource: ParsedYouTubeSource | null = null;
  private desiredVolume = 65;
  private statusText = 'Đang tắt (dùng nhạc nền tích hợp sẵn)';
  private gestureRetryBound = false;

  constructor(
    audio: MagicalAudio,
    callbacks?: {
      onToast?: (msg: string, icon?: string) => void;
      onStatusChange?: () => void;
    }
  ) {
    this.audio = audio;
    this.onToast = callbacks?.onToast;
    this.onStatusChange = callbacks?.onStatusChange;
  }

  public getStatusText(): string {
    return this.statusText;
  }

  public sync(opts: {
    youtubeEnabled: boolean;
    bgmEnabled: boolean;
    rawUrl: string;
    volume0to1: number;
  }): void {
    this.desiredEnabled = Boolean(opts.youtubeEnabled);
    this.desiredBgmMasterOn = Boolean(opts.bgmEnabled);
    this.desiredVolume = Math.max(0, Math.min(100, Math.round(opts.volume0to1 * 100)));
    this.desiredSource = parseYouTubeBgmSource(opts.rawUrl || DEFAULT_YOUTUBE_BGM_URL);

    if (!this.desiredEnabled || !this.desiredBgmMasterOn || !this.desiredSource) {
      this.audio.externalBgmActive = false;
      if (this.player && this.playerReady) {
        try {
          this.player.pauseVideo();
        } catch {
          // ignore
        }
      }
      if (this.hostWrap) {
        this.hostWrap.classList.add('hidden');
      }
      this.setStatus(
        !this.desiredEnabled
          ? 'Đang tắt (dùng nhạc nền tích hợp sẵn)'
          : !this.desiredBgmMasterOn
            ? 'Đang tạm dừng (công tắc Nhạc nền BGM đang tắt)'
            : 'Link YouTube chưa hợp lệ — hãy dán link watch?v=... hoặc youtu.be/...'
      );
      return;
    }

    // Mute internal MP3/oscillator BGM immediately so two tracks never overlap
    this.audio.externalBgmActive = true;
    this.audio.stopBgm?.();
    this.bindFirstGestureAutoplayUnlock();

    const nextKey =
      this.desiredSource.kind === 'video'
        ? `v:${this.desiredSource.videoId}:${this.desiredSource.playlistId ?? ''}`
        : `p:${this.desiredSource.playlistId}`;

    if (this.player && this.playerReady) {
      this.hostWrap?.classList.remove('hidden');
      try {
        this.player.unMute();
        this.player.setVolume(this.desiredVolume);
        if (this.loadedKey !== nextKey) {
          this.loadedKey = nextKey;
          this.cueCurrentSourceOnReadyPlayer();
        } else {
          this.player.playVideo();
        }
      } catch {
        // ignore transient iframe errors
      }
      return;
    }

    this.setStatus('⏳ Đang kết nối trực tiếp tới YouTube CDN (0 băng thông server)...');
    this.ensureHostMounted();
    loadYouTubeIframeApi()
      .then((YT) => {
        if (!this.desiredEnabled || !this.desiredSource || !YT.Player || !this.playerMount) return;
        if (this.player) return;
        const src = this.desiredSource;
        this.loadedKey = nextKey;
        const playerVars: Record<string, string | number> = {
          autoplay: 1,
          controls: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          loop: 1,
        };
        if (src.kind === 'video') {
          playerVars.playlist = src.playlistId ?? src.videoId;
        } else {
          playerVars.listType = 'playlist';
          playerVars.list = src.playlistId;
        }
        this.player = new YT.Player(this.playerMount, {
          host: 'https://www.youtube-nocookie.com',
          width: 200,
          height: 112,
          ...(src.kind === 'video' ? { videoId: src.videoId } : {}),
          playerVars,
          events: {
            onReady: (ev) => {
              this.playerReady = true;
              try {
                ev.target.unMute();
                ev.target.setVolume(this.desiredVolume);
                if (this.desiredEnabled && this.desiredBgmMasterOn) {
                  ev.target.playVideo();
                  this.setStatus('🎶 Sẵn sàng — Chạm nhẹ vào màn hình nếu trình duyệt chờ mở tiếng');
                }
              } catch {
                // ignore
              }
            },
            onStateChange: (ev) => {
              // 1 = PLAYING, 3 = BUFFERING, 0 = ENDED, 2 = PAUSED
              if (ev.data === 1) {
                this.audio.externalBgmActive = true;
                this.setStatus('🔊 Đang phát trực tiếp từ YouTube (0 băng thông máy chủ)');
              } else if (ev.data === 0 && this.desiredEnabled && this.desiredBgmMasterOn) {
                try {
                  ev.target.playVideo();
                } catch {
                  // ignore
                }
              } else if (ev.data === 2 && this.desiredEnabled && this.desiredBgmMasterOn) {
                this.setStatus('⏸️ Đã tạm dừng — Bấm Phát trên khung mini hoặc chạm vào game');
              }
            },
            onError: (ev) => {
              // 101 / 150 = owner disabled embed on external sites
              this.audio.externalBgmActive = false;
              const blockedEmbed = ev.data === 101 || ev.data === 150;
              const msg = blockedEmbed
                ? 'Chủ kênh YouTube này chặn nhúng ngoài trang — hãy chọn 1 kênh gợi ý hoặc dán link YouTube khác nhé!'
                : 'Không tải được link YouTube (đã tự chuyển về nhạc nền sẵn có của game).';
              this.setStatus(`⚠️ ${msg}`);
              this.onToast?.(msg, '🎵');
            },
          },
        });
      })
      .catch(() => {
        this.audio.externalBgmActive = false;
        this.setStatus('⚠️ Không kết nối được YouTube (đang phát nhạc nền sẵn có offline)');
      });
  }

  private cueCurrentSourceOnReadyPlayer(): void {
    if (!this.player || !this.playerReady || !this.desiredSource) return;
    if (this.desiredSource.kind === 'video') {
      if (this.desiredSource.playlistId) {
        this.player.loadPlaylist({ list: this.desiredSource.playlistId, listType: 'playlist' });
      } else {
        this.player.loadVideoById(this.desiredSource.videoId);
      }
    } else {
      this.player.loadPlaylist({ list: this.desiredSource.playlistId, listType: 'playlist' });
    }
  }

  private ensureHostMounted(): void {
    if (typeof document === 'undefined') return;
    if (!this.hostWrap) {
      const wrap = document.createElement('aside');
      wrap.id = 'ytBgmPersistentDock';
      wrap.className = 'yt-bgm-mini-dock';
      wrap.setAttribute('aria-label', 'Trình phát nhạc nền YouTube thu nhỏ');
      wrap.innerHTML = `
        <div class="yt-bgm-mini-head">
          <span>🎵 YouTube BGM</span>
          <button type="button" class="yt-bgm-mini-collapse" data-yt-toggle-min="1" title="Thu gọn / Mở khung hình YouTube">–</button>
        </div>
        <div class="yt-bgm-iframe-slot">
          <div id="ytBgmIframeMount"></div>
        </div>
      `;
      wrap.querySelector('[data-yt-toggle-min]')?.addEventListener('click', (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        const collapsed = wrap.classList.toggle('is-collapsed');
        btn.textContent = collapsed ? '▢' : '–';
      });
      // Default to compact collapsed audio pill so it never blocks the farm view!
      wrap.classList.add('is-collapsed');
      const initBtn = wrap.querySelector('[data-yt-toggle-min]') as HTMLButtonElement | null;
      if (initBtn) initBtn.textContent = '▢';
      document.body.appendChild(wrap);
      this.hostWrap = wrap;
      this.playerMount = wrap.querySelector('#ytBgmIframeMount') as HTMLElement | null;
    }
    this.hostWrap.classList.remove('hidden');
  }

  private bindFirstGestureAutoplayUnlock(): void {
    if (this.gestureRetryBound || typeof window === 'undefined') return;
    this.gestureRetryBound = true;
    const retry = () => {
      if (!this.desiredEnabled || !this.desiredBgmMasterOn || !this.player || !this.playerReady) {
        return;
      }
      try {
        const st = this.player.getPlayerState?.();
        if (st !== 1 && st !== 3) {
          this.player.unMute();
          this.player.setVolume(this.desiredVolume);
          this.player.playVideo();
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('pointerdown', retry, { passive: true });
    window.addEventListener('keydown', retry, { passive: true });
  }

  private setStatus(next: string): void {
    if (this.statusText === next) return;
    this.statusText = next;
    this.onStatusChange?.();
  }
}

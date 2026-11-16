import type { JigsawArtAssetProvider } from '../sim/jigsawPaintingComposer';

/**
 * Chuẩn hoá đường dẫn tài sản tĩnh để chạy đúng cả trên root subdomain (`/`)
 * lẫn hosting subpath (`/offline/`).
 */
export function resolveOfflineAssetUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  if (rawUrl.startsWith('./') || rawUrl.startsWith('data:') || rawUrl.startsWith('blob:')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('/')) {
    return `.${rawUrl}`;
  }
  return `./${rawUrl}`;
}

/**
 * Chuẩn hoá các thẻ `<img src="/paintings/...">` / `<source srcset="/paintings/...">`
 * từ hằng số dùng chung sang đường dẫn tương đối an toàn cho subpath.
 */
export function rewriteInlineAssetHtml(html: string): string {
  return html.replace(
    /((?:src|srcset)=['"])\/((?:paintings|sprites|fonts|icons)\/)/g,
    '$1./$2'
  );
}

interface CachedImageRecord {
  img: HTMLImageElement;
  loaded: boolean;
  failed: boolean;
}

/**
 * Bộ nạp ảnh nhẹ độc lập cho các màn Jigsaw, Blocks (Onet) và Seed Quiz.
 * Không kéo theo `SpriteRegistry` hay shader của thế giới 2.5D.
 */
export class OfflineImageCache implements JigsawArtAssetProvider {
  private readonly cache = new Map<string, CachedImageRecord>();
  private readonly listeners = new Set<() => void>();

  public onAssetLoaded(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners(): void {
    for (const cb of this.listeners) {
      try {
        cb();
      } catch {
        // Ignore listener error
      }
    }
  }

  public getOrLoadImage(rawUrl: string): HTMLImageElement | null {
    if (typeof Image === 'undefined') return null;
    const url = resolveOfflineAssetUrl(rawUrl);
    const existing = this.cache.get(url);
    if (existing) {
      return existing.loaded && !existing.failed ? existing.img : null;
    }

    const img = new Image();
    img.decoding = 'async';
    const rec: CachedImageRecord = { img, loaded: false, failed: false };
    this.cache.set(url, rec);

    img.onload = () => {
      rec.loaded = true;
      this.notifyListeners();
    };
    img.onerror = () => {
      rec.failed = true;
    };
    img.src = url;
    if (img.complete && img.naturalWidth > 0) {
      rec.loaded = true;
      return img;
    }
    return null;
  }

  public getPaintingImage(url: string): HTMLImageElement | null {
    return this.getOrLoadImage(url);
  }

  public getSpriteImage(spriteKey: string): HTMLImageElement | null {
    if (!spriteKey) return null;
    const path = spriteKey.endsWith('.png')
      ? `./sprites/${spriteKey}`
      : `./sprites/${spriteKey}.png`;
    return this.getOrLoadImage(path);
  }
}

export const sharedOfflineAssets = new OfflineImageCache();

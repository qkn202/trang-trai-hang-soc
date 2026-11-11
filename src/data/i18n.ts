// P5 — Internationalization (i18n):
// Từ điển song ngữ gốc Tiếng Việt (vi) + Tiếng Anh (en) và sẵn sàng mở rộng (ko / zh / es / ja).

export type SupportedLocale = 'vi' | 'en' | 'ko' | 'zh' | 'es' | 'ja';

export const I18N_DICTIONARY = {
  vi: {
    'app.title': 'Trang Trại Hang Sóc & Thung Lũng Hogsmeade',
    'hud.level': 'Cấp {level}',
    'hud.stars': '{count} Sao Phép',
    'hud.galleons': '{count} Galleon',
    'hud.seeds': 'Túi Hạt Giống',
    'hud.barn': 'Kho Nông Sản Đỏ',
    'hud.orders': 'Đơn Hàng Cú',
    'hud.feast': 'Đại Tiệc Mùa Gặt',
    'hud.neighbors': 'Sổ Hàng Xóm',
    'hud.leaderboard': 'Bảng Xếp Hạng',
    'hud.settings': 'Cài Đặt',
    'minigame.match3': 'Bùa Gặt Honeydukes',
    'minigame.caro': 'Ngũ Ấn Đạo Tặc',
    'minigame.sudoku': 'Số Học Huyền Bí',
    'minigame.chess': 'Cờ Phù Thủy',
    'minigame.blocks': 'Sinh Vật Huyền Bí',
    'minigame.arcade': 'Đại Sảnh Khảo Thí Pháp Thuật',
    'minigame.seedquiz': 'Học Viện Thần Chú',
    'cloud.sync_ok': 'Đã đồng bộ đám mây thành công',
    'cloud.conflict_resolved': 'Đã giải quyết xung đột bản lưu ({winner})',
    'cloud.offline_queued': 'Đang ngoại tuyến — đã xếp hàng chờ đồng bộ',
    'a11y.colorblind': 'Chế độ hỗ trợ sắc giác',
    'a11y.font_scale': 'Cỡ chữ giao diện ({scale}%)',
    'a11y.high_contrast': 'Tương phản cao',
    'common.close': 'Đóng',
    'common.confirm': 'Xác nhận',
    'common.cancel': 'Hủy',
  },
  en: {
    'app.title': 'The Burrow Farm & Hogsmeade Valley',
    'hud.level': 'Level {level}',
    'hud.stars': '{count} Magic Stars',
    'hud.galleons': '{count} Galleons',
    'hud.seeds': 'Seed Pouch',
    'hud.barn': 'Red Farm Barn',
    'hud.orders': 'Owl Post Orders',
    'hud.feast': 'Harvest Feast',
    'hud.neighbors': 'Neighbor Book',
    'hud.leaderboard': 'Leaderboard',
    'hud.settings': 'Settings',
    'minigame.match3': 'Honeydukes Harvest Loft',
    'minigame.caro': "Marauder's Five Seals",
    'minigame.sudoku': 'Arithmancy Grid',
    'minigame.chess': "Wizard's Chess",
    'minigame.blocks': 'Magical Creatures Connect',
    'minigame.arcade': 'Hogwarts Trial Great Hall',
    'minigame.seedquiz': 'Spell Academy',
    'cloud.sync_ok': 'Cloud save synchronized',
    'cloud.conflict_resolved': 'Save conflict resolved ({winner})',
    'cloud.offline_queued': 'Offline — queued for cloud sync',
    'a11y.colorblind': 'Colorblind Mode',
    'a11y.font_scale': 'UI Font Scale ({scale}%)',
    'a11y.high_contrast': 'High Contrast',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
  },
} as const;

export type I18nKey = keyof typeof I18N_DICTIONARY.vi;

let activeLocale: SupportedLocale = 'vi';

export function getActiveLocale(): SupportedLocale {
  return activeLocale;
}

export function setActiveLocale(locale: SupportedLocale): void {
  activeLocale = locale;
}

export function t(
  key: I18nKey | string,
  params?: Record<string, string | number>,
  locale: SupportedLocale = activeLocale
): string {
  const dict =
    locale === 'en' ? I18N_DICTIONARY.en : I18N_DICTIONARY.vi;
  const fallback = I18N_DICTIONARY.vi;
  let template =
    (dict as Record<string, string>)[key] ??
    (fallback as Record<string, string>)[key] ??
    key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return template;
}

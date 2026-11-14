import { LevelRewardInfo, LevelTrialRequirement, MinigameTrialKind } from '../types/game';
import { CATALOG } from './catalog';
import { ZONES } from './zones';

export const MAX_LEVEL = 100;

/**
 * Số màn mini-game mới cần vượt qua ở Cấp Giải Đố `level` để thăng lên `level + 1`.
 * Tổng cộng từ Cấp 1 -> Cấp 100 = 3.435 màn thắng độc nhất trên tổng 3.885 màn (5 trò × 777 màn),
 * đảm bảo hành trình ít nhất 200+ giờ chơi thực tế mà phút đầu tiên vẫn lên cấp cực mượt!
 */
export function getWinsRequiredForNextLevel(level: number): number {
  const lv = Math.max(1, Math.floor(level));
  if (lv <= 3) return 1; // Lv 1->4: 1 màn/cấp (3 màn đầu làm quen cực nhanh)
  if (lv <= 7) return 3; // Lv 4->8: 3 màn/cấp
  if (lv <= 15) return 8; // Lv 8->16: 8 màn/cấp
  if (lv <= 30) return 18; // Lv 16->31: 18 màn/cấp
  if (lv <= 50) return 32; // Lv 31->51: 32 màn/cấp
  if (lv <= 75) return 46; // Lv 51->76: 46 màn/cấp
  return 54; // Lv 76->100: 54 màn/cấp
}

export const TOTAL_WINS_FOR_MAX_LEVEL = Array.from({ length: MAX_LEVEL - 1 }, (_, i) =>
  getWinsRequiredForNextLevel(i + 1)
).reduce((acc, n) => acc + n, 0); // 3,435 màn

const FEATURED_DISCIPLINE_ROTATION: ReadonlyArray<{
  kind: MinigameTrialKind;
  icon: string;
  shortVi: string;
  descVi: string;
}> = [
  {
    kind: 'match3',
    icon: '🍬',
    shortVi: 'Bùa Gặt Honeydukes',
    descVi: 'Vượt màn mới Bùa Gặt Honeydukes (777 màn) để tích tiến độ lên cấp + nhận thưởng Sao Đề Cử, +1 ⏳ Cát & +35% Vàng!',
  },
  {
    kind: 'caro',
    icon: '🗺️',
    shortVi: 'Ngũ Ấn Đạo Tặc',
    descVi: 'Kết nối 5 Ấn Phượng Hoàng trong Ngũ Ấn Đạo Tặc (777 màn) để tích tiến độ lên cấp + thưởng Sao Đề Cử & +1 ⏳ Cát!',
  },
  {
    kind: 'sudoku',
    icon: '🔢',
    shortVi: 'Số Học Huyền Bí',
    descVi: 'Điền chuẩn xác bảng 9×9 trong Số Học Huyền Bí (777 màn) để tích tiến độ lên cấp + thưởng Sao Đề Cử & +1 ⏳ Cát!',
  },
  {
    kind: 'chess',
    icon: '🏰',
    shortVi: 'Cờ Phù Thủy',
    descVi: 'Chiếu bí đối thủ trong Cờ Phù Thủy (777 màn) để tích tiến độ lên cấp + thưởng Sao Đề Cử & +1 ⏳ Cát!',
  },
  {
    kind: 'blocks',
    icon: '🦄',
    shortVi: 'Sinh Vật Huyền Bí',
    descVi: 'Ghép đôi các loài trong Sinh Vật Huyền Bí bằng đường nối tối đa 3 đoạn thẳng (777 màn) để tích tiến độ lên cấp + thưởng Sao Đề Cử & +1 ⏳ Cát!',
  },
  {
    kind: 'jigsaw',
    icon: '🧩',
    shortVi: 'Tranh Ghép Phép Thuật',
    descVi: 'Phục chế bức tranh thế giới phù thủy trong Tranh Ghép Phép Thuật (777 màn) để tích tiến độ lên cấp + thưởng Sao Đề Cử & +1 ⏳ Cát!',
  },
];

/**
 * Môn Đề Cử Cụ Dumbledore ở mỗi Cấp Điền Trang:
 * Vượt màn mới ở BẤT KỲ mini-game nào (chưa chạm trần 777/777) đều cộng +1 tiến độ lên cấp;
 * chơi đúng Môn Đề Cử nhận thêm +1 🌟 Sao mở màn cấp (và mỗi 5 trận đề cử), +1 ⏳ Cát & +35% Vàng!
 */
export function getLevelTrialRequirement(
  level: number,
  maxedKinds?: ReadonlySet<MinigameTrialKind>
): LevelTrialRequirement {
  const safeLv = Math.max(1, Math.min(MAX_LEVEL, Math.floor(level)));
  const startIdx = (safeLv - 1) % FEATURED_DISCIPLINE_ROTATION.length;
  let entry = FEATURED_DISCIPLINE_ROTATION[startIdx];
  if (maxedKinds && maxedKinds.size > 0 && maxedKinds.size < FEATURED_DISCIPLINE_ROTATION.length) {
    for (let offset = 0; offset < FEATURED_DISCIPLINE_ROTATION.length; offset++) {
      const candidate = FEATURED_DISCIPLINE_ROTATION[(startIdx + offset) % FEATURED_DISCIPLINE_ROTATION.length];
      if (!maxedKinds.has(candidate.kind)) {
        entry = candidate;
        break;
      }
    }
  }
  const winsReq = getWinsRequiredForNextLevel(safeLv);
  return {
    kind: entry.kind,
    icon: entry.icon,
    shortVi: entry.shortVi,
    titleVi: `Đề cử Cấp ${safeLv} → ${safeLv + 1} (${winsReq} màn): ${entry.shortVi}`,
    descVi: entry.descVi,
  };
}

const TITLES_BY_MILESTONE: Record<number, string> = {
  1: 'Người Khai Hoang Đồi Hang Sóc',
  4: 'Người Gác Guồng Nước Đầm Sậy',
  8: 'Người Chăn Puffskein & Gà Nâu',
  14: 'Trưởng Ban Đại Tiệc Lều Lụa',
  21: 'Nghệ Nhân Ngõ Đá Hogsmeade',
  30: 'Bậc Thầy Nhà Kính Bà Sprout',
  42: 'Chủ Cối Xay Gió Đồi Devon',
  58: 'Tri Kỷ Rừng Bí Ngô Bác Hagrid',
  76: 'Tổng Quản Hội Mùa Màng Phù Thủy',
  96: 'Bậc Thầy Thuần Rồng Đỉnh 777',
  100: 'Huyền Thoại Kiến Tạo Điền Trang (Cấp 100)',
};

const MILESTONE_NOTES: Record<number, string> = {
  1: 'Khởi đầu từ đồi cỏ trống: Tự tay dựng Nhà Hang Sóc 6 Tầng (3 🌟) & Lò Nướng Bánh Bà Molly (5 🌟)!',
  2: 'Mở khóa bản vẽ Xe Gỗ Bán Bia Bơ Nóng + hạt Bắp Ngọt & Bò Sữa Đốm Kem!',
  3: 'Mở khóa Chuồng Gà Mái Nâu Hang Sóc — thu hoạch Giỏ Trứng Gà tươi!',
  4: 'Mở khóa Vùng Đất Ao Ếch & Đầm Lau Sậy + Khung Đan Áo Len Phép Chữ W!',
  6: 'Mở khóa Trạm Thư Cú Hang Sóc (Hedwig & Errol) nhận Đơn Hàng Cú!',
  7: 'Mở khóa Kho Tôn & Xe Bay Ford Anglia của ông Arthur Weasley!',
  8: 'Mở khóa Vùng Đất Đồng Cỏ Puffskein + Guồng Nước Gỗ Đầm Sậy!',
  11: 'Mở khóa Khu Bảo Tồn Đào Mỏ (Niffler) tinh nghịch!',
  14: 'Mở khóa Vùng Đất Rạp Lều Lụa Trắng Hội Mùa Gặt!',
  17: 'Mở khóa Tiệm Kẹo Công Tước Mật (Honeydukes) — cổng tắt vào Gác Xép Bùa Gặt Honeydukes 777 màn!',
  21: 'Mở khóa Vùng Đất Cầu Đá Rêu & Ngõ Đá Cuội Hogsmeade + Cổng Bí Ngô Mùa Thu!',
  24: 'Mở khóa Cối Xay Gió Đồi Devon nghiền Bột Mì Mịn!',
  27: 'Mở khóa Quán Ba Cây Chổi Hogsmeade ủ Bia Bơ sủi bọt kem!',
  30: 'Mở khóa Khu Nhà Kính Thảo Dược Bà Sprout!',
  31: 'Mở khóa Bản vẽ Nhà Kính Thảo Dược Học Ngọc Lục Bảo!',
  42: 'Mở khóa Vùng Đất Đồi Cối Xay Gió & Cánh Đồng Lúa Mạch!',
  48: 'Mở khóa Chòi Đá & Bí Ngô Khổng Lồ Bác Hagrid!',
  56: 'Mở khóa Tháp Cú Đưa Thư & Trạm Gia Tinh tự động gom mùa!',
  58: 'Mở khóa Vùng Đất Bìa Rừng Bác Hagrid & Suối Bằng Mã!',
  65: 'Mở khóa Trảng Cỏ Bằng Mã Buckbeak oai vệ!',
  75: 'Mở khóa Thung Lũng Vong Mã Đèn Đom Đóm!',
  76: 'Mở khóa Quảng Trường Lễ Hội Mùa Màng Hogsmeade!',
  82: 'Mở khóa Suối Nguồn Kỳ Lân Trắng Ánh Trăng!',
  89: 'Mở khóa Đài Phượng Hoàng Lửa Fawkes!',
  96: 'Mở khóa Hang Rồng Đuôi Gai Hungary Huyền Thoại (577 🌟)!',
  100: 'Đạt Cấp 100 Tối Thượng (3.435+ màn giải đố) — Hào Quang Bội Thu Toàn Điền Trang (+50% Sản Lượng)!',
};

export const LEVELS: LevelRewardInfo[] = Array.from({ length: MAX_LEVEL }, (_, idx) => {
  const level = idx + 1;
  // Smooth cozy XP curve from Lv 1 -> 100
  const xpRequired =
    level === 1
      ? 0
      : Math.round(35 + Math.pow(level - 1, 1.58) * 28);

  const rewardGalleons = Math.round(40 + level * 25 + Math.pow(level, 1.45) * 6);
  const rewardTimeSand = level % 5 === 0 ? 3 : level % 2 === 0 ? 1 : 0;

  const unlockedItemIds = CATALOG.filter(
    (c) => c.unlockLevel === level && !c.isThemeParkLegacy && c.category !== 'terrain'
  ).map((c) => c.id);
  const zone = ZONES.find((z) => z.unlockLevel === level && level > 1);

  return {
    level,
    xpRequired,
    rewardGalleons,
    rewardTimeSand,
    titleUnlock: TITLES_BY_MILESTONE[level],
    unlockedItemIds,
    unlockedZoneId: zone?.id,
    milestoneNote: MILESTONE_NOTES[level],
    trialRequirement: level < MAX_LEVEL ? getLevelTrialRequirement(level) : undefined,
  };
});

export function getLevelInfo(level: number): LevelRewardInfo {
  const clamped = Math.max(1, Math.min(MAX_LEVEL, level));
  return LEVELS[clamped - 1];
}

export function getNextLevelXp(level: number): number {
  if (level >= MAX_LEVEL) return LEVELS[MAX_LEVEL - 1].xpRequired;
  return LEVELS[level].xpRequired;
}

export function getPlayerTitle(level: number): string {
  let current = TITLES_BY_MILESTONE[1];
  for (const [lvStr, title] of Object.entries(TITLES_BY_MILESTONE)) {
    if (level >= Number(lvStr)) {
      current = title;
    }
  }
  return current;
}

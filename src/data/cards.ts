export interface WizardCardDef {
  id: string;
  name: string;
  title: string;
  rarity: 'Hiếm' | 'Sử Thi' | 'Huyền Thoại';
  emoji: string;
  frameColor: string;
  lore: string;
  buffLabel: string;
  goldBonusPct: number;
  xpBonusPct: number;
  hatchSpeedPct: number;
}

export const WIZARD_CARDS: WizardCardDef[] = [
  {
    id: 'albus_dumbledore',
    name: 'Albus Dumbledore',
    title: 'Hiệu Trưởng Vĩ Đại Hogwarts',
    rarity: 'Huyền Thoại',
    emoji: '🧙‍♂️',
    frameColor: '#d97706',
    lore: 'Được ca ngợi vì đánh bại phù thủy hắc ám Grindelwald năm 1945 và khám phá 12 công dụng của máu rồng.',
    buffLabel: '+5% Vàng Galleon & +5% Sao XP toàn công viên',
    goldBonusPct: 5,
    xpBonusPct: 5,
    hatchSpeedPct: 0,
  },
  {
    id: 'newt_scamander',
    name: 'Newt Scamander',
    title: 'Nhà Sinh Vật Huyền Bí Học Lừng Danh',
    rarity: 'Huyền Thoại',
    emoji: '🧳',
    frameColor: '#15803d',
    lore: 'Tác giả cuốn sách gối đầu giường "Sinh Vật Huyền Bí và Nơi Tìm Ra Chúng".',
    buffLabel: '+8% Tốc độ ấp trứng & chăm thú bảo tồn',
    goldBonusPct: 2,
    xpBonusPct: 2,
    hatchSpeedPct: 8,
  },
  {
    id: 'godric_gryffindor',
    name: 'Godric Gryffindor',
    title: 'Đồng Sáng Lập Hogwarts',
    rarity: 'Huyền Thoại',
    emoji: '🦁',
    frameColor: '#b91c1c',
    lore: 'Chiến binh quả cảm nhất thời đại của mình, chủ nhân chiếc Nón Phân Loại và Thanh Kiếm nạm hồng ngọc.',
    buffLabel: '+4% Doanh thu Trò Chơi & Tàu Lượn',
    goldBonusPct: 4,
    xpBonusPct: 2,
    hatchSpeedPct: 0,
  },
  {
    id: 'rowena_ravenclaw',
    name: 'Rowena Ravenclaw',
    title: 'Đồng Sáng Lập Hogwarts',
    rarity: 'Huyền Thoại',
    emoji: '🦅',
    frameColor: '#1d4ed8',
    lore: 'Phù thủy thông thái bậc nhất thời Trung Cổ, người thiết kế những cầu thang đổi hướng kỳ diệu của lâu đài.',
    buffLabel: '+6% Sao XP khi thu hoạch và làm nhiệm vụ',
    goldBonusPct: 0,
    xpBonusPct: 6,
    hatchSpeedPct: 0,
  },
  {
    id: 'helga_hufflepuff',
    name: 'Helga Hufflepuff',
    title: 'Đồng Sáng Lập Hogwarts',
    rarity: 'Huyền Thoại',
    emoji: '🦡',
    frameColor: '#ca8a04',
    lore: 'Bậc thầy bùa chú ẩm thực, người đưa các Gia Tinh về làm việc an toàn và ấm cúng tại Hogwarts.',
    buffLabel: '+5% Doanh thu Bia Bơ, Kẹo & Gia Tinh thu hộ',
    goldBonusPct: 5,
    xpBonusPct: 2,
    hatchSpeedPct: 0,
  },
  {
    id: 'salazar_slytherin',
    name: 'Salazar Slytherin',
    title: 'Đồng Sáng Lập Hogwarts',
    rarity: 'Huyền Thoại',
    emoji: '🐍',
    frameColor: '#047857',
    lore: 'Một trong những Xà Khẩu đầu tiên được ghi nhận, nổi tiếng với tham vọng và quyền năng cổ ngữ.',
    buffLabel: '+5% Vàng Galleon tích trữ Offline',
    goldBonusPct: 5,
    xpBonusPct: 1,
    hatchSpeedPct: 0,
  },
  {
    id: 'nicolas_flamel',
    name: 'Nicolas Flamel',
    title: 'Nhà Giả Kim Thuật Chế Tạo Đá Phù Thủy',
    rarity: 'Sử Thi',
    emoji: '💎',
    frameColor: '#dc2626',
    lore: 'Nhà giả kim duy nhất được biết đến từng chế tạo thành công Hòn Đá Phù Thủy đem lại Thuốc Trường Sinh.',
    buffLabel: '+4% Vàng Galleon mọi công trình',
    goldBonusPct: 4,
    xpBonusPct: 1,
    hatchSpeedPct: 0,
  },
  {
    id: 'garrick_ollivander',
    name: 'Garrick Ollivander',
    title: 'Nghệ Nhân Chế Tác Đũa Phép',
    rarity: 'Sử Thi',
    emoji: '🪄',
    frameColor: '#7c3aed',
    lore: 'Người nhớ rõ từng cây đũa phép mình từng bán ra với triết lý "Đũa phép chọn phù thủy".',
    buffLabel: '+3% Sao XP & tăng tỉ lệ khách vẫy đũa thành công',
    goldBonusPct: 2,
    xpBonusPct: 3,
    hatchSpeedPct: 0,
  },
  {
    id: 'bertie_bott',
    name: 'Bertie Bott',
    title: 'Cha Đẻ Kẹo Đủ Vị',
    rarity: 'Hiếm',
    emoji: '🍬',
    frameColor: '#db2777',
    lore: 'Vô tình phát minh ra Kẹo Đủ Vị năm 1954 khi đang cố tạo kẹo ngon từ thức ăn hàng ngày.',
    buffLabel: '+3% Vàng Galleon từ cửa tiệm',
    goldBonusPct: 3,
    xpBonusPct: 1,
    hatchSpeedPct: 0,
  },
  {
    id: 'celestina_warbeck',
    name: 'Celestina Warbeck',
    title: 'Nữ Danh Ca Phù Thủy Quyến Rũ',
    rarity: 'Hiếm',
    emoji: '🎶',
    frameColor: '#9333ea',
    lore: 'Giọng ca vàng với bản tình ca "Một Vạc Đầy Tình Yêu Nóng Bỏng" làm say mê mọi bà nội trợ phù thủy.',
    buffLabel: '+3% Sao XP lễ hội & âm nhạc',
    goldBonusPct: 1,
    xpBonusPct: 3,
    hatchSpeedPct: 0,
  },
  {
    id: 'ignatia_wildsmith',
    name: 'Ignatia Wildsmith',
    title: 'Nhà Phát Minh Bột Floo',
    rarity: 'Hiếm',
    emoji: '🔥',
    frameColor: '#059669',
    lore: 'Phát minh Bột Floo thế kỷ 13 giúp giới phù thủy dịch chuyển tức thời qua mạng lưới lò sưởi xanh.',
    buffLabel: '+4% Tốc độ xây dựng & ấp trứng',
    goldBonusPct: 1,
    xpBonusPct: 1,
    hatchSpeedPct: 4,
  },
  {
    id: 'merlin',
    name: 'Đại Phù Thủy Merlin',
    title: 'Hoàng Tử Của Giới Phép Thuật',
    rarity: 'Huyền Thoại',
    emoji: '👑',
    frameColor: '#6d28d9',
    lore: 'Phù thủy lừng lẫy nhất mọi thời đại, người sáng lập Huân Chương Merlin và từng theo học tại Hogwarts.',
    buffLabel: '+6% Vàng Galleon & +6% Sao XP tối thượng',
    goldBonusPct: 6,
    xpBonusPct: 6,
    hatchSpeedPct: 5,
  },
];

export function computeCardBuffs(collected: Record<string, number> | undefined): {
  uniqueCount: number;
  totalCount: number;
  goldMult: number;
  xpMult: number;
  hatchSpeedMult: number;
} {
  if (!collected) {
    return { uniqueCount: 0, totalCount: 0, goldMult: 1, xpMult: 1, hatchSpeedMult: 1 };
  }
  let uniqueCount = 0;
  let totalCount = 0;
  let goldPct = 0;
  let xpPct = 0;
  let hatchPct = 0;

  for (const card of WIZARD_CARDS) {
    const qty = collected[card.id] ?? 0;
    if (qty > 0) {
      uniqueCount++;
      totalCount += qty;
      const dupScale = 1 + Math.min(0.5, (qty - 1) * 0.1);
      goldPct += card.goldBonusPct * dupScale;
      xpPct += card.xpBonusPct * dupScale;
      hatchPct += card.hatchSpeedPct * dupScale;
    }
  }

  return {
    uniqueCount,
    totalCount,
    goldMult: 1 + goldPct / 100,
    xpMult: 1 + xpPct / 100,
    hatchSpeedMult: Math.max(0.5, 1 - hatchPct / 100),
  };
}

import {
  CraftedGoodId,
  ExpressCargoCrate,
  PlacedBuilding,
  RawIngredientId,
  SupplyChainState,
} from '../types/game';

export interface DistrictSynergyDef {
  id: string;
  name: string;
  emoji: string;
  requiredItems: string[]; // At least one of each item within maxRadius tiles!
  maxRadius: number;
  goldBonusPct: number;
  xpBonusPct: number;
  description: string;
}

export const DISTRICT_SYNERGIES: DistrictSynergyDef[] = [
  {
    id: 'combo_burrow_hearth',
    name: 'Tổ Ấm Hang Sóc & Lò Bánh Bà Molly',
    emoji: '🥧',
    requiredItems: ['burrow_house_canon', 'molly_apple_bakery'],
    maxRadius: 10,
    goldBonusPct: 25,
    xpBonusPct: 20,
    description: 'Hương bánh táo quế nướng từ bếp bà Molly lan tỏa khắp sân nhà Hang Sóc ấm áp.',
  },
  {
    id: 'combo_arthur_tinker',
    name: 'Góc Sáng Chế Muggle & Guồng Nước Bờ Sậy',
    emoji: '🚗',
    requiredItems: ['arthur_ford_shed', 'burrow_reed_pond_mill'],
    maxRadius: 18,
    goldBonusPct: 24,
    xpBonusPct: 20,
    description: 'Ông Arthur mượn sức nước đầm sậy để thử nghiệm bugi & bình ắc quy cho xe Ford Anglia.',
  },
  {
    id: 'combo_apple_cider_orchard',
    name: 'Vườn Táo Đỏ & Xưởng Ép Rượu Táo Mật Ong',
    emoji: '🍎',
    requiredItems: ['burrow_apple_orchard', 'burrow_cider_apiary'],
    maxRadius: 7,
    goldBonusPct: 28,
    xpBonusPct: 22,
    description: 'Táo chín từ đồi cỏ lăn thẳng vào máy ép gỗ sồi và thùng ong mật vàng óng.',
  },
  {
    id: 'combo_owl_knitting_post',
    name: 'Trạm Cú Errol & Khung Đan Áo Len Tự Động',
    emoji: '🧶',
    requiredItems: ['burrow_owl_post', 'burrow_self_knitting_loom'],
    maxRadius: 16,
    goldBonusPct: 26,
    xpBonusPct: 25,
    description: 'Áo len chữ W vừa đan xong được cú gia đình quắp bay đi gửi quà khắp thung lũng.',
  },
  {
    id: 'combo_windmill_wheat',
    name: 'Cối Xay Gió Đồi Cỏ & Thửa Đất Canh Tác',
    emoji: '🌾',
    requiredItems: ['burrow_windmill_canon', 'farmland_plot'],
    maxRadius: 18,
    goldBonusPct: 30,
    xpBonusPct: 25,
    description: 'Cánh buồm vải quay đều trong nắng gió nghiền lúa mì & bắp vàng sông Ottery thành bột thơm.',
  },
  {
    id: 'combo_winter_hogsmeade',
    name: 'Phố Chợ Ngọt Ngào Làng Hogsmeade',
    emoji: '🍺',
    requiredItems: ['burrow_broomsticks_canon', 'burrow_honeydukes_canon'],
    maxRadius: 9,
    goldBonusPct: 32,
    xpBonusPct: 28,
    description: 'Bia Bơ nóng hổi kết hợp kẹo Ếch Sô-cô-la làm rộn ràng cả nhịp cầu đá Hogsmeade.',
  },
  {
    id: 'combo_owl_express',
    name: 'Bưu Cục Cú Đưa Thư Liên Vùng',
    emoji: '🦉',
    requiredItems: ['eeylops_owl_emporium', 'owlery_elf_hut'],
    maxRadius: 8,
    goldBonusPct: 26,
    xpBonusPct: 30,
    description: 'Đàn cú tuyết phối hợp cùng Gia Tinh giúp tăng mạnh lượng Sao XP thu hoạch.',
  },
  {
    id: 'combo_herbology_conservatory',
    name: 'Nhà Kính Thảo Dược & Cổ Thụ Liễu Roi',
    emoji: '🌿',
    requiredItems: ['burrow_greenhouse_canon', 'whomping_willow'],
    maxRadius: 9,
    goldBonusPct: 30,
    xpBonusPct: 28,
    description: 'Nhà kính vòm kính trồng Mandrake đặt cạnh Cây Liễu Roi tạo vườn thực vật trứ danh.',
  },
  {
    id: 'combo_forbidden_sanctuary',
    name: 'Chòi Bí Ngô Bác Hagrid & Trảng Bằng Mã',
    emoji: '🎃',
    requiredItems: ['hippogriff_glade', 'hagrid_pumpkin_hut'],
    maxRadius: 10,
    goldBonusPct: 34,
    xpBonusPct: 28,
    description: 'Chòi đá bác Hagrid cùng luống bí ngô khổng lồ che chở cho đàn Bằng Mã Buckbeak.',
  },
  {
    id: 'combo_pasture_harmony',
    name: 'Đồng Cỏ Gà Đẻ Trứng & Đàn Bông Thoa',
    emoji: '🐣',
    requiredItems: ['burrow_chicken_coop', 'burrow_puffskein_pasture'],
    maxRadius: 15,
    goldBonusPct: 28,
    xpBonusPct: 24,
    description: 'Đàn gà nâu cục tác vui vầy bên những chú Puffskein lông kem tròn xoe tắm nắng.',
  },
  {
    id: 'combo_bridge_fountain',
    name: 'Quảng Trường Mùa Gặt Bên Cầu Đá Hogsmeade',
    emoji: '⛲',
    requiredItems: ['hogsmeade_stone_bridge', 'hogsmeade_harvest_fountain'],
    maxRadius: 10,
    goldBonusPct: 36,
    xpBonusPct: 32,
    description: 'Đài phun nước đá cổ róc rách đón dân làng băng qua cầu vòm đá vào hội mùa.',
  },
  {
    id: 'combo_feast_sanctuary',
    name: 'Rạp Tiệc Vườn Đèn Tiên & Rừng Kỳ Lân Bạc',
    emoji: '✨',
    requiredItems: ['burrow_feast_marquee', 'unicorn_glade'],
    maxRadius: 16,
    goldBonusPct: 45,
    xpBonusPct: 40,
    description: 'Ánh đèn tiên từ rạp tiệc nhà Weasley hòa quyện cùng hào quang bạc thanh khiết của Kỳ Lân.',
  },
];

export interface ActiveSynergyResult {
  activeIds: Set<string>;
  buildingGoldMult: Map<string, number>;
  buildingXpMult: Map<string, number>;
  links: Array<{ aUid: string; bUid: string; emoji: string; name: string }>;
}

export function evaluateDistrictSynergies(
  buildings: PlacedBuilding[],
  now: number
): ActiveSynergyResult {
  const activeIds = new Set<string>();
  const buildingGoldMult = new Map<string, number>();
  const buildingXpMult = new Map<string, number>();
  const links: Array<{ aUid: string; bUid: string; emoji: string; name: string }> = [];

  const ready = buildings.filter((b) => now >= b.constructEndsAt);

  for (const syn of DISTRICT_SYNERGIES) {
    const [idA, idB] = syn.requiredItems;
    const listA = ready.filter((b) => b.itemId === idA);
    const listB = ready.filter((b) => b.itemId === idB);
    if (listA.length === 0 || listB.length === 0) continue;

    let matched = false;
    for (const a of listA) {
      for (const b of listB) {
        const d = Math.hypot(a.gx - b.gx, a.gy - b.gy);
        if (d <= syn.maxRadius) {
          matched = true;
          const gAdd = syn.goldBonusPct / 100;
          const xAdd = syn.xpBonusPct / 100;
          buildingGoldMult.set(a.uid, Math.min(1.85, (buildingGoldMult.get(a.uid) ?? 1) + gAdd));
          buildingGoldMult.set(b.uid, Math.min(1.85, (buildingGoldMult.get(b.uid) ?? 1) + gAdd));
          buildingXpMult.set(a.uid, Math.min(1.85, (buildingXpMult.get(a.uid) ?? 1) + xAdd));
          buildingXpMult.set(b.uid, Math.min(1.85, (buildingXpMult.get(b.uid) ?? 1) + xAdd));
          links.push({ aUid: a.uid, bUid: b.uid, emoji: syn.emoji, name: syn.name });
        }
      }
    }
    if (matched) {
      activeIds.add(syn.id);
    }
  }

  return { activeIds, buildingGoldMult, buildingXpMult, links };
}

// ==================== HỆ THỐNG #4: CHUỖI CUNG ỨNG THẢO DƯỢC -> CHẾ BIẾN -> TÀU HÀNG ====================

export const RAW_INGREDIENTS_INFO: Record<
  RawIngredientId,
  { name: string; emoji: string; sourceHint: string }
> = {
  mandrake_leaf: {
    name: 'Lá Mandrake Non',
    emoji: '🌿',
    sourceHint: 'Thu từ Vườn Thảo Dược, Nhà Kính Mandrake hoặc Hái nhanh tại Xưởng',
  },
  sweet_pumpkin: {
    name: 'Bí Ngô Mật Hogsmeade',
    emoji: '🎃',
    sourceHint: 'Thu từ Vườn Thảo Dược, Chòi Hagrid, Cổng Bí Ngô hoặc Hái nhanh',
  },
  starlight_dust: {
    name: 'Bột Sao Cổ Ngữ',
    emoji: '✨',
    sourceHint: 'Thu từ Đài Phun Nước, Tháp Thiên Văn, Lò Sưởi Floo',
  },
  magic_cacao: {
    name: 'Hạt Ca-cao Phép',
    emoji: '🍫',
    sourceHint: 'Thu từ Xe Bia Bơ, Quán Ba Cây Chổi, Công Tước Mật',
  },
};

export interface CraftRecipeDef {
  id: CraftedGoodId;
  name: string;
  emoji: string;
  brewSec: number;
  inputs: Partial<Record<RawIngredientId, number>>;
  effectSummary: string;
  directUseLabel: string;
}

export const CRAFT_RECIPES: CraftRecipeDef[] = [
  {
    id: 'aged_butterbeer',
    name: 'Thùng Bia Bơ Ủ Tuyết',
    emoji: '🍺',
    brewSec: 18,
    inputs: { sweet_pumpkin: 2, magic_cacao: 1 },
    effectSummary:
      'Cấp cho quầy tiệm (+85% doanh thu Tiệm 4 phút & hồi đầy 5/5 ❤️ Tim Bùa Gặt Honeydukes) hoặc đóng kiện Tàu Hàng.',
    directUseLabel: '🍻 Uống & Cấp Tiệm (+85% Vàng • Đầy ❤️)',
  },
  {
    id: 'felix_potion',
    name: 'Phúc Lạc Dược (Felix Felicis)',
    emoji: '🧪',
    brewSec: 25,
    inputs: { mandrake_leaf: 2, starlight_dust: 1 },
    effectSummary: 'Tăng +35% Sao XP toàn trang trại trong 4 phút.',
    directUseLabel: '✨ Kích Hoạt Vận May (4p)',
  },
  {
    id: 'golden_choc_box',
    name: 'Hộp Quà Kẹo Hoàng Kim',
    emoji: '🎁',
    brewSec: 22,
    inputs: { magic_cacao: 2, starlight_dust: 1 },
    effectSummary: 'Bán sỉ lễ hội nhận ngay Vàng Galleon lớn & +65 Sao XP!',
    directUseLabel: '🎁 Mở Hộp Quà Hoàng Kim',
  },
  {
    id: 'dragon_firework',
    name: 'Pháo Hoa Rồng Lửa Weasley',
    emoji: '🎆',
    brewSec: 20,
    inputs: { starlight_dust: 2, sweet_pumpkin: 1 },
    effectSummary: 'Bắn màn Đại Tiệc Pháo Hoa Rồng rực sáng bầu trời (+Hạnh phúc khách & Điểm 4 Nhà)!',
    directUseLabel: '🎆 Bắn Đại Tiệc Pháo Hoa Ngay!',
  },
];

export function createCargoCrates(level: number, trainIndex: number): ExpressCargoCrate[] {
  const goodsOrder: CraftedGoodId[] = [
    'aged_butterbeer',
    'felix_potion',
    'golden_choc_box',
    'dragon_firework',
  ];
  return [0, 1, 2].map((slot) => {
    const goodId = goodsOrder[(trainIndex + slot) % goodsOrder.length];
    const qty = slot === 2 && level >= 20 ? 2 : 1;
    const baseG = Math.round((130 + level * 26 + Math.pow(level, 1.35) * 4.5) * qty);
    const baseXp = Math.round((85 + level * 19 + Math.pow(level, 1.36) * 3.8) * qty);
    return {
      id: `crate_${trainIndex}_${slot}`,
      goodId,
      qtyRequired: qty,
      fulfilled: false,
      rewardGalleons: baseG,
      rewardXp: baseXp,
      rewardTimeSand: slot === 2 ? 2 : 1,
    };
  });
}

export function createInitialSupplyState(level = 1): SupplyChainState {
  return {
    ingredients: {
      mandrake_leaf: 3,
      sweet_pumpkin: 3,
      starlight_dust: 2,
      magic_cacao: 2,
    },
    goods: {
      aged_butterbeer: 1,
      felix_potion: 0,
      golden_choc_box: 0,
      dragon_firework: 1,
    },
    activeBrew: null,
    butterbeerBoostEndsAt: 0,
    felixBoostEndsAt: 0,
    cargoTrainIndex: 1,
    cargoCrates: createCargoCrates(level, 1),
    lastHerbPlotHarvestAt: 0,
  };
}

// ==================== HỆ THỐNG #5: KHÁCH VIP & NHẬT BÁO TIÊN TRI ====================

export interface VipProfileDef {
  id: string;
  name: string;
  title: string;
  emoji: string;
  goalLabel: string;
  positiveHeadline: string;
  criticalHeadline: string;
}

export const VIP_PROFILES: VipProfileDef[] = [
  {
    id: 'vip_harry',
    name: 'Harry Potter',
    title: 'Tầm Thủ Huyền Thoại Gryffindor',
    emoji: '⚡',
    goalLabel: 'Giữ công viên có >=1 Trò chơi hoạt động tốt (không hỏng hóc) & khách vui vẻ >=75%',
    positiveHeadline: 'HARRY POTTER KHEN NGỢI ĐƯỜNG BAY & TÀU LƯỢN ĐỈNH CAO TẠI CÔNG VIÊN!',
    criticalHeadline: 'Harry Potter tiếc nuối vì một số trò chơi bay đang tạm dừng bảo trì',
  },
  {
    id: 'vip_hermione',
    name: 'Hermione Granger',
    title: 'Cố Vấn Hội Bảo Vệ Gia Tinh & Sinh Vật',
    emoji: '📚',
    goalLabel: 'Không có thú huyền bí bị bỏ đói (<40%) và đường phố sạch sẽ dưới 2 vũng rác',
    positiveHeadline: 'HERMIONE GRANGER TRAO CHỨNG NHẬN 5 SAO VỀ PHÚC LỢI SINH VẬT & GIA TINH!',
    criticalHeadline: 'Hermione nhắc nhở Ban Quản Lý cần chăm chút khẩu phần ăn cho thú huyền bí hơn',
  },
  {
    id: 'vip_dumbledore',
    name: 'Albus Dumbledore',
    title: 'Hiệu Trưởng Trường Phép Thuật Hogwarts',
    emoji: '🧙‍♂️',
    goalLabel: 'Đạt điểm Kỳ Diệu >= 4.3★ và có phục vụ kẹo ngọt / Bia Bơ ấm áp',
    positiveHeadline: 'CỤ DUMBLEDORE: "ĐÂY LÀ NƠI HẠNH PHÚC TỎA SÁNG NHẤT THẾ GIỚI PHÙ THỦY!"',
    criticalHeadline: 'Cụ Dumbledore gợi ý trồng thêm hoa cỏ và đèn nến để tăng nét nhiệm màu',
  },
  {
    id: 'vip_rita',
    name: 'Rita Skeeter & Cây Bút Tốc Ký',
    title: 'Đặc Phái Viên Nhật Báo Tiên Tri',
    emoji: '📸',
    goalLabel: 'Không để Kho Hậu Cần lộ thiên và không có bất kỳ vũng bùa lỗi nào trên đường!',
    positiveHeadline: 'RITA SKEETER CŨNG PHẢI NGẢ MŨ: CÔNG VIÊN KHÔNG MỘT GÓC CHẾT, ĐẸP MÊ HỒN!',
    criticalHeadline: 'BÚT TỐC KÝ RITA SKEETER CHỘP ĐƯỢC VŨNG BÙA LỖI TRÊN ĐƯỜNG DẠO PHỐ!',
  },
];

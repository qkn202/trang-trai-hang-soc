import { FARM_CROPS, FARM_GOODS, getCatalogItem, getFarmItemMeta } from '../data/catalog';
import { CREATURE_SPECIES_PROFILES, getSpeciesProfile } from '../data/suitcase';
import { GRID_SIZE } from '../data/zones';
import { getVietnamCalendarKey } from './neighborSocial';
import { ensureRetentionState } from './retentionAndNarrative';
import type { ParkSimulation } from './simulation';
import { VALLEY_VILLAGER_PROFILES } from './simulationData';
import { FarmCropId, FarmItemId, StrollRobeId, ValleyVillagerId } from '../types/game';

export interface StrollRobeMeta {
  id: StrollRobeId;
  labelVi: string;
  auraColor: string;
  scarfPrimary: string;
  scarfAccent: string;
  wandGlow: string;
}

export const STROLL_ROBE_WARDROBE: Record<StrollRobeId, StrollRobeMeta> = {
  burrow_classic: {
    id: 'burrow_classic',
    labelVi: 'Áo Len Hang Sóc',
    auraColor: 'rgba(254, 240, 138, 0.45)',
    scarfPrimary: '#b45309',
    scarfAccent: '#fbbf24',
    wandGlow: '#fef08a',
  },
  gryffindor_scarf: {
    id: 'gryffindor_scarf',
    labelVi: 'Khăn Gryffindor',
    auraColor: 'rgba(248, 113, 113, 0.44)',
    scarfPrimary: '#991b1b',
    scarfAccent: '#facc15',
    wandGlow: '#fde047',
  },
  ravenclaw_cloak: {
    id: 'ravenclaw_cloak',
    labelVi: 'Choàng Ravenclaw',
    auraColor: 'rgba(96, 165, 250, 0.46)',
    scarfPrimary: '#1e3a8a',
    scarfAccent: '#cbd5e1',
    wandGlow: '#bae6fd',
  },
  hufflepuff_knit: {
    id: 'hufflepuff_knit',
    labelVi: 'Len Hufflepuff',
    auraColor: 'rgba(250, 204, 21, 0.48)',
    scarfPrimary: '#ca8a04',
    scarfAccent: '#292524',
    wandGlow: '#fef08a',
  },
  slytherin_emerald: {
    id: 'slytherin_emerald',
    labelVi: 'Ngọc Slytherin',
    auraColor: 'rgba(52, 211, 153, 0.46)',
    scarfPrimary: '#065f46',
    scarfAccent: '#d1d5db',
    wandGlow: '#a7f3d0',
  },
  yule_winter_coat: {
    id: 'yule_winter_coat',
    labelVi: 'Áo Tuyết Yule',
    auraColor: 'rgba(224, 242, 254, 0.52)',
    scarfPrimary: '#dc2626',
    scarfAccent: '#f8fafc',
    wandGlow: '#e0f2fe',
  },
};

export const STROLL_ROBE_ORDER: readonly StrollRobeId[] = [
  'burrow_classic',
  'gryffindor_scarf',
  'ravenclaw_cloak',
  'hufflepuff_knit',
  'slytherin_emerald',
  'yule_winter_coat',
];

export function setPlayerStrollRobe(
  sim: ParkSimulation,
  robeId: StrollRobeId
): { ok: boolean; robe: StrollRobeMeta; msg: string } {
  const meta = STROLL_ROBE_WARDROBE[robeId] ?? STROLL_ROBE_WARDROBE.burrow_classic;
  sim.state.settings.strollRobeId = meta.id;
  if (sim.homeStateWhileVisiting) {
    sim.homeStateWhileVisiting.settings.strollRobeId = meta.id;
  }
  sim.audio.playSpell();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    robe: meta,
    msg: `✨ Đã thay trang phục đi dạo: ${meta.labelVi}!`,
  };
}

export function cyclePlayerStrollRobe(
  sim: ParkSimulation
): { ok: boolean; robe: StrollRobeMeta; msg: string } {
  const cur = sim.state.settings.strollRobeId ?? 'burrow_classic';
  const idx = STROLL_ROBE_ORDER.indexOf(cur);
  const next = STROLL_ROBE_ORDER[(idx + 1) % STROLL_ROBE_ORDER.length];
  return setPlayerStrollRobe(sim, next);
}

export interface VillagerAffectionGiftMeta {
  villagerId: ValleyVillagerId;
  favoriteGifts: [FarmItemId, FarmItemId, FarmItemId];
  keepsakeNameVi: string;
  keepsakeBonusVi: string;
  thankFavoriteVi: string;
  thankNormalVi: string;
  rewardSickle: number;
  rewardDew?: number;
  rewardCompost?: number;
  rewardTimeSand?: number;
  rewardSeedCropId?: FarmCropId;
  rewardSeedQty?: number;
  rewardPlug?: number;
  rewardTalisman?: number;
}

export const VILLAGER_AFFECTION_GIFT_META: Record<ValleyVillagerId, VillagerAffectionGiftMeta> = {
  molly: {
    villagerId: 'molly',
    favoriteGifts: ['cinnamon_apple_pie', 'burrow_apple', 'weasley_sweater_w'],
    keepsakeNameVi: 'Muôi Gỗ Bếp Lửa Bà Molly',
    keepsakeBonusVi: '+40 Sickle · +1 🌟 · +2 🧪 Bình Sương Mai',
    thankFavoriteVi: 'Ôi chao, đúng món tủ của bếp Hang Sóc rồi! Cảm ơn con nhiều lắm!',
    thankNormalVi: 'Quà nông trại tươi ngon quá, để bà cất vào chạn bếp cho cả nhà nhé!',
    rewardSickle: 40,
    rewardDew: 2,
  },
  arthur: {
    villagerId: 'arthur',
    favoriteGifts: ['muggle_plug_kit', 'fine_wheat_flour', 'honey_carrot'],
    keepsakeNameVi: 'Tuốc Nơ Vít Phép Ông Arthur',
    keepsakeBonusVi: '+40 Sickle · +1 🌟 · +1 🔌 Phích Cắm',
    thankFavoriteVi: 'Tuyệt vời! Món này giúp bác hoàn thiện bộ sưu tập cơ khí trong chòi!',
    thankNormalVi: 'Cảm ơn con nhé, bác sẽ mang vào bàn sửa chữa Ford Anglia!',
    rewardSickle: 40,
    rewardPlug: 1,
  },
  ginny: {
    villagerId: 'ginny',
    favoriteGifts: ['floral_bouquet_gift', 'english_rose', 'ruby_strawberry'],
    keepsakeNameVi: 'Trâm Hoa Đồi Gió Ginny',
    keepsakeBonusVi: '+40 Sickle · +1 🌟 · +3 hạt Tulip Cầu Vồng',
    thankFavoriteVi: 'Thơm rực rỡ luôn! Đúng loài hoa và trái ngọt mình mê nhất!',
    thankNormalVi: 'Dễ thương ghê, cảm ơn bồ đã ghé thăm đồi hoa nha!',
    rewardSickle: 40,
    rewardSeedCropId: 'rainbow_tulip',
    rewardSeedQty: 3,
  },
  ron: {
    villagerId: 'ron',
    favoriteGifts: ['pumpkin_pie', 'choc_frog_sweet', 'frothy_butterbeer'],
    keepsakeNameVi: 'Quân Mã Đá Cẩm Thạch Ron',
    keepsakeBonusVi: '+45 Sickle · +1 🌟 · +1 🔥 Bùa Phượng Hoàng',
    thankFavoriteVi: 'Đỉnh của chóp! Bụng mình đang kêu ầm ĩ thì được bồ tiếp tế đúng món ruột!',
    thankNormalVi: 'Ngon lành! Có sức làm thêm mấy ván Khảo Thí với bồ rồi!',
    rewardSickle: 45,
    rewardTalisman: 1,
  },
  hermione: {
    villagerId: 'hermione',
    favoriteGifts: ['blossom_honey_jar', 'dried_lavender', 'sprout_growth_elixir'],
    keepsakeNameVi: 'Bút Lông Ngỗng Cổ Ngữ Hermione',
    keepsakeBonusVi: '+45 Sickle · +1 🌟 · +2 ⏳ Cát Xoay',
    thankFavoriteVi: 'Chuẩn xác từng chi tiết thảo dược học! Mình quý món quà này lắm!',
    thankNormalVi: 'Cảm ơn bồ nhiều nhé, hương thơm thảo mộc giúp mình đọc sách tập trung hơn!',
    rewardSickle: 45,
    rewardTimeSand: 2,
  },
  hagrid: {
    villagerId: 'hagrid',
    favoriteGifts: ['garden_pumpkin', 'cream_mushroom_soup', 'glow_mushroom'],
    keepsakeNameVi: 'Đèn Bão Rừng Cấm Bác Hagrid',
    keepsakeBonusVi: '+50 Sickle · +1 🌟 · +3 🌿 Phân Ủ',
    thankFavoriteVi: 'Khà khà! Cả bác lẫn Buckbeak đều mê tít món quà nông trại hảo hạng này!',
    thankNormalVi: 'Quý hóa quá nghen, mời bồ ghé chòi uống tách trà nóng với bác!',
    rewardSickle: 50,
    rewardCompost: 3,
  },
};

export function giftItemToVillager(
  sim: ParkSimulation,
  villagerId: ValleyVillagerId,
  itemId: FarmItemId,
  todayKey = getVietnamCalendarKey()
): { ok: boolean; msg: string; isFavorite: boolean; newLevel: number; leveledUp: boolean } {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) {
    return {
      ok: false,
      msg: 'Hãy về Trang Trại Hang Sóc của bạn để tặng quà cho dân làng!',
      isFavorite: false,
      newLevel: 1,
      leveledUp: false,
    };
  }
  const prof = VALLEY_VILLAGER_PROFILES.find((v) => v.id === villagerId);
  const giftMeta = VILLAGER_AFFECTION_GIFT_META[villagerId];
  if (!prof || !giftMeta) {
    return { ok: false, msg: 'Không tìm thấy cư dân này!', isFavorite: false, newLevel: 1, leveledUp: false };
  }
  const ret = ensureRetentionState(sim.state);
  const entry = ret.npcFriendship[villagerId] ?? { villagerId, level: 1, xp: 0 };
  if (entry.lastGiftedDayKey === todayKey && !sim.state.sandboxMode) {
    return {
      ok: false,
      msg: `Hôm nay bạn đã gửi quà cho ${prof.nameVi} rồi — hẹn ngày mai tặng tiếp nhé!`,
      isFavorite: false,
      newLevel: entry.level,
      leveledUp: false,
    };
  }
  const have = sim.getFarmItemCount(itemId);
  const itemMeta = getFarmItemMeta(itemId);
  if (!sim.state.sandboxMode && have < 1) {
    return {
      ok: false,
      msg: `Kho Đỏ chưa có ${itemMeta.emoji} ${itemMeta.name} để tặng ${prof.nameVi}!`,
      isFavorite: false,
      newLevel: entry.level,
      leveledUp: false,
    };
  }
  if (!sim.state.sandboxMode) {
    sim.consumeFarmItemFromBarn(itemId, 1);
  }

  const isFavorite = giftMeta.favoriteGifts.includes(itemId);
  const xpGain = isFavorite ? 70 : 35;
  const sickleGain = isFavorite ? 18 : 10;
  const feastPts = isFavorite ? 8 : 4;

  entry.lastGiftedDayKey = todayKey;
  entry.xp += xpGain;
  const prevLv = entry.level;
  while (entry.level < 10 && entry.xp >= entry.level * 60) {
    entry.xp -= entry.level * 60;
    entry.level += 1;
  }
  ret.npcFriendship[villagerId] = entry;
  const leveledUp = entry.level > prevLv;

  sim.state.galleons += sickleGain;
  sim.state.finance.harvestRevenue += sickleGain;
  sim.addXp(isFavorite ? 14 : 8);
  sim.addHarvestFeastPoints(feastPts);
  if (leveledUp) {
    sim.state.match3.stars += 1;
    sim.state.match3.totalStarsEarned += 1;
    sim.audio.playLevelUp();
  } else {
    sim.audio.playHarvestBubble();
  }

  const vEntity = sim.villagers.find((v) => v.id === villagerId);
  if (vEntity) {
    vEntity.moodBubble = '💝';
    vEntity.bubbleTimer = 5.0;
    vEntity.greetReactTimer = 2.6;
    sim.spawnFloatingText(
      vEntity.gx,
      vEntity.gy,
      `💝 +${xpGain} Thân Thiết · +${sickleGain} Sickle`,
      '#f9a8d4'
    );
  }
  sim.checkAndToastAchievements();
  sim.saveToStorage();
  sim.onUiChange?.();

  const quote = isFavorite ? giftMeta.thankFavoriteVi : giftMeta.thankNormalVi;
  return {
    ok: true,
    msg: `💝 Tặng ${itemMeta.name} cho ${prof.nameVi}${isFavorite ? ' (Món yêu thích ×2!)' : ''}: "${quote}" (+${xpGain} XP Thân Thiết, +${sickleGain} Sickle${leveledUp ? `, Lên Cấp ${entry.level} +1 🌟!` : ''})`,
    isFavorite,
    newLevel: entry.level,
    leveledUp,
  };
}

export function claimVillagerKeepsake(
  sim: ParkSimulation,
  villagerId: ValleyVillagerId
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor || sim.isHeadmasterPreview) {
    return { ok: false, msg: 'Hãy về trang trại nhà để nhận Kỷ Vật Dân Làng!' };
  }
  const ret = ensureRetentionState(sim.state);
  const entry = ret.npcFriendship[villagerId] ?? { villagerId, level: 1, xp: 0 };
  const meta = VILLAGER_AFFECTION_GIFT_META[villagerId];
  const prof = VALLEY_VILLAGER_PROFILES.find((v) => v.id === villagerId);
  if (!meta || !prof) return { ok: false, msg: 'Không tìm thấy cư dân này!' };
  if (entry.level < 5 && !sim.state.sandboxMode) {
    return { ok: false, msg: `Cần đạt Thân Thiết Cấp 5 với ${prof.nameVi} để nhận "${meta.keepsakeNameVi}"!` };
  }
  const claimed = entry.claimedMilestones ?? [];
  if (claimed.includes(5)) {
    return { ok: false, msg: `Bạn đã nhận kỷ vật "${meta.keepsakeNameVi}" rồi!` };
  }
  entry.claimedMilestones = [...claimed, 5];
  ret.npcFriendship[villagerId] = entry;

  sim.state.galleons += meta.rewardSickle;
  sim.state.finance.harvestRevenue += meta.rewardSickle;
  sim.state.match3.stars += 1;
  sim.state.match3.totalStarsEarned += 1;
  if (meta.rewardDew) {
    sim.state.morningDewPhials = Math.min(99, (sim.state.morningDewPhials ?? 0) + meta.rewardDew);
  }
  if (meta.rewardCompost) {
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + meta.rewardCompost);
  }
  if (meta.rewardTimeSand) {
    sim.state.timeSand += meta.rewardTimeSand;
  }
  if (meta.rewardSeedCropId && meta.rewardSeedQty) {
    sim.addCropSeeds(meta.rewardSeedCropId, meta.rewardSeedQty);
  }
  if (meta.rewardPlug) {
    const barn = sim.ensureFarmBarn();
    barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + meta.rewardPlug;
  }
  if (meta.rewardTalisman) {
    sim.grantPhoenixTalisman(meta.rewardTalisman);
  }

  sim.addXp(30);
  sim.audio.playLevelUp();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🎁 Nhận kỷ vật "${meta.keepsakeNameVi}" từ ${prof.nameVi} (${meta.keepsakeBonusVi})!`,
  };
}

// ============================================================================
// THÚ CƯNG ĐI DẠO NGOÀI SÂN (ACTIVE ROAMING PET COMPANION)
// ============================================================================

export interface RoamingPetRuntime {
  habitatUid: string;
  nameVi: string;
  spriteKey: string;
  gx: number;
  gy: number;
  targetGx: number;
  targetGy: number;
  facingLeft: boolean;
  walkPhase: number;
}

export interface StrollAvatarRuntime {
  gx: number;
  gy: number;
  targetGx: number;
  targetGy: number;
  facingLeft: boolean;
  walkPhase: number;
  waveTimer: number;
  isMoving?: boolean;
  lastStepIndex?: number;
  lastFootstepSurface?: 'grass' | 'stone' | 'wood';
  stepDustTimer?: number;
  stepDustGx?: number;
  stepDustGy?: number;
}

export function setActiveRoamingPet(
  sim: ParkSimulation,
  habitatUid: string | null
): { ok: boolean; msg: string } {
  if (sim.isVisitingNeighbor) {
    return { ok: false, msg: 'Chỉ có thể chọn thú cưng đi dạo tại trang trại nhà!' };
  }
  if (!habitatUid) {
    sim.state.suitcase.activeRoamingPetId = null;
    sim.roamingPet = null;
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg: '🐾 Đã cho thú cưng quay về chuồng nghỉ ngơi!' };
  }
  const b = sim.state.buildings.find((x) => x.uid === habitatUid);
  const it = b ? getCatalogItem(b.itemId) : undefined;
  if (!b || !it || !it.isCreatureHabitat || Date.now() < b.constructEndsAt) {
    return { ok: false, msg: 'Chuồng thú chưa sẵn sàng để dắt đi dạo!' };
  }
  const sp = getSpeciesProfile(it.id) ?? CREATURE_SPECIES_PROFILES[0];
  const petName = b.creatureNickname || it.creatureName || it.name;
  sim.state.suitcase.activeRoamingPetId = b.uid;
  sim.roamingPet = {
    habitatUid: b.uid,
    nameVi: petName,
    spriteKey: sp?.beastSpriteKey ?? it.spriteKey ?? 'beast_unicorn',
    gx: 16.8,
    gy: 24.4,
    targetGx: 18.2,
    targetGy: 24.4,
    facingLeft: false,
    walkPhase: 0,
  };
  sim.audio.playSpell();
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    ok: true,
    msg: `🐾 ${petName} đã ra sân dạo chơi cùng gia đình Weasley — thỉnh thoảng chạm vào bé để nhận quà bất ngờ nhé!`,
  };
}

export function petRoamingCompanion(
  sim: ParkSimulation,
  nowMs = Date.now()
): { ok: boolean; msg: string; earnedSickle: number } {
  if (sim.isVisitingNeighbor || !sim.roamingPet) {
    return { ok: false, msg: 'Hiện chưa có thú cưng đi dạo ngoài sân!', earnedSickle: 0 };
  }
  const lastAt = sim.state.suitcase.lastRoamingPetGiftAt ?? 0;
  const pet = sim.roamingPet;
  if (nowMs - lastAt < 45_000 && !sim.state.sandboxMode) {
    const waitSec = Math.ceil((45_000 - (nowMs - lastAt)) / 1000);
    sim.audio.playPetChirp?.();
    sim.spawnFloatingText(pet.gx, pet.gy, `💝 ${pet.nameVi}`, '#f9a8d4');
    return {
      ok: false,
      msg: `🐾 ${pet.nameVi} dụi đầu làm nũng (còn ${waitSec}s nữa mới đào thêm kho báu nhỏ)!`,
      earnedSickle: 0,
    };
  }
  sim.state.suitcase.lastRoamingPetGiftAt = nowMs;
  const sickle = 18;
  sim.state.galleons += sickle;
  sim.state.finance.harvestRevenue += sickle;
  sim.addXp(8);
  let extra = '';
  if (Math.floor(nowMs / 1000) % 2 === 0) {
    sim.state.morningDewPhials = Math.min(99, (sim.state.morningDewPhials ?? 0) + 1);
    extra = ' & +1 🧪 Bình Sương Mai';
  } else {
    sim.state.herbalCompost = Math.min(99999, Math.max(0, Math.floor(sim.state.herbalCompost ?? 0)) + 1);
    extra = ' & +1 🌿 Phân Ủ';
  }
  sim.audio.playPetChirp?.();
  sim.audio.playHarvestBubble();
  sim.onRewardFly?.('galleons', sickle, pet.gx, pet.gy);
  sim.spawnFloatingText(pet.gx, pet.gy, `🐾 +${sickle} Sickle${extra}`, '#fde047');
  const msg = `🐾 ${pet.nameVi} vừa đánh hơi tìm được +${sickle} Sickle${extra} bên lối đá!`;
  sim.onToast?.(msg, '🐾');
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg, earnedSickle: sickle };
}

// ============================================================================
// CHẾ ĐỘ ĐI DẠO NHẬP VAI (PLAYER STROLL MODE)
// ============================================================================

export function togglePlayerStrollMode(
  sim: ParkSimulation,
  force?: boolean
): { ok: boolean; active: boolean; msg: string } {
  const next = typeof force === 'boolean' ? force : !sim.strollModeActive;
  if (!next) {
    sim.strollModeActive = false;
    sim.onUiChange?.();
    return { ok: true, active: false, msg: 'Đã rời Chế Độ Đi Dạo Nhập Vai.' };
  }
  let spawnGx = 16.5;
  let spawnGy = 24.5;
  const unlockedSet = new Set(sim.state.unlockedZones);
  for (let gy = 18; gy <= 28; gy++) {
    for (let gx = 12; gx <= 24; gx++) {
      const c = sim.grid[gy]?.[gx];
      if (c && c.path !== 'none' && unlockedSet.has(c.zoneId) && !c.buildingUid) {
        spawnGx = gx + 0.5;
        spawnGy = gy + 0.5;
        gy = 999;
        break;
      }
    }
  }
  sim.strollModeActive = true;
  sim.playerStrollAvatar = {
    gx: spawnGx,
    gy: spawnGy,
    targetGx: spawnGx,
    targetGy: spawnGy,
    facingLeft: false,
    walkPhase: 0,
    waveTimer: 0,
  };
  sim.audio.playSpell();
  sim.onUiChange?.();
  return {
    ok: true,
    active: true,
    msg: '🧙 Đã bật Chế Độ Đi Dạo Nhập Vai — chạm mặt đường hoặc nhấn WASD để dạo bước ngắm vườn & chào dân làng!',
  };
}

export function setStrollDestination(sim: ParkSimulation, gx: number, gy: number): boolean {
  if (!sim.strollModeActive || !sim.playerStrollAvatar) return false;
  const cx = Math.max(1, Math.min(GRID_SIZE - 2, Math.floor(gx)));
  const cy = Math.max(1, Math.min(GRID_SIZE - 2, Math.floor(gy)));
  const cell = sim.grid[cy]?.[cx];
  if (!cell || cell.terrain === 'water') return false;
  sim.playerStrollAvatar.targetGx = cx + 0.5;
  sim.playerStrollAvatar.targetGy = cy + 0.5;
  return true;
}

export function castStrollCareWave(sim: ParkSimulation): { tendedCount: number; msg: string } {
  if (!sim.strollModeActive || !sim.playerStrollAvatar || sim.isVisitingNeighbor) {
    return { tendedCount: 0, msg: '' };
  }
  const av = sim.playerStrollAvatar;
  av.waveTimer = 0.9;
  const now = Date.now();
  let tendedCount = 0;
  for (const b of sim.state.buildings) {
    if (now < b.constructEndsAt) continue;
    const it = getCatalogItem(b.itemId);
    if (!it) continue;
    const d = Math.hypot(b.gx + it.width * 0.5 - av.gx, b.gy + it.height * 0.5 - av.gy);
    if (d > 3.2) continue;
    if (it.isFarmlandPlot && b.cropId && b.cropReadyAt) {
      if (now >= b.cropReadyAt) {
        if (sim.harvestCropPlot(b.uid).ok) tendedCount++;
      } else if (!b.cropWateredBoost) {
        if (sim.waterCropPlot(b.uid).ok) tendedCount++;
      }
    } else if (it.isAnimalPasturePlot && b.pastureAnimalId && b.pastureReadyAt) {
      if (now >= b.pastureReadyAt) {
        if (sim.harvestAnimalPasture(b.uid).ok) tendedCount++;
      } else if (!b.pastureFedBoost) {
        if (sim.feedAnimalPasture(b.uid).ok) tendedCount++;
      }
    }
  }
  if (tendedCount > 0) {
    return { tendedCount, msg: `🪄 Vẫy đũa chăm nhanh ${tendedCount} ô quanh chân!` };
  }
  sim.audio.playSpell();
  sim.spawnFloatingText(av.gx, av.gy, '✨ Lumos!', '#fef08a');
  return { tendedCount: 0, msg: '✨ Vẫy đũa phát sáng dạo vườn!' };
}

export function updateRoamingPetAndStroll(sim: ParkSimulation, dt: number): void {
  // 1. Sync active roaming pet from state if needed
  const wantedUid = sim.state.suitcase?.activeRoamingPetId;
  if (!sim.isVisitingNeighbor && wantedUid) {
    if (!sim.roamingPet || sim.roamingPet.habitatUid !== wantedUid) {
      const b = sim.state.buildings.find((x) => x.uid === wantedUid);
      const it = b ? getCatalogItem(b.itemId) : undefined;
      if (b && it && it.isCreatureHabitat && Date.now() >= b.constructEndsAt) {
        const sp = getSpeciesProfile(it.id) ?? CREATURE_SPECIES_PROFILES[0];
        sim.roamingPet = {
          habitatUid: b.uid,
          nameVi: b.creatureNickname || it.creatureName || it.name,
          spriteKey: sp?.beastSpriteKey ?? it.spriteKey ?? 'beast_unicorn',
          gx: 16.8,
          gy: 24.4,
          targetGx: 18.2,
          targetGy: 24.4,
          facingLeft: false,
          walkPhase: 0,
        };
      } else {
        sim.roamingPet = null;
      }
    }
  } else {
    sim.roamingPet = null;
  }

  // 2. Step Player Stroll Avatar
  if (sim.strollModeActive && sim.playerStrollAvatar) {
    const av = sim.playerStrollAvatar;
    if (av.waveTimer > 0) av.waveTimer = Math.max(0, av.waveTimer - dt);
    if ((av.stepDustTimer ?? 0) > 0) av.stepDustTimer = Math.max(0, (av.stepDustTimer ?? 0) - dt);
    const dx = av.targetGx - av.gx;
    const dy = av.targetGy - av.gy;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.06) {
      const speed = 3.2;
      const step = Math.min(dist, speed * dt);
      const nx = av.gx + (dx / dist) * step;
      const ny = av.gy + (dy / dist) * step;
      const c = sim.grid[Math.floor(ny)]?.[Math.floor(nx)];
      if (c && c.terrain !== 'water') {
        av.gx = nx;
        av.gy = ny;
        av.facingLeft = dx - dy < 0;
        av.isMoving = true;
        av.walkPhase = (av.walkPhase + dt * 8.5) % (Math.PI * 20);
        const stepIdx = Math.floor(av.walkPhase / Math.PI);
        if (stepIdx !== av.lastStepIndex) {
          av.lastStepIndex = stepIdx;
          const surface: 'grass' | 'stone' | 'wood' =
            c.path === 'wood_pier'
              ? 'wood'
              : c.path === 'cobble' || c.path === 'snow_brick' || c.path === 'queue_gold'
                ? 'stone'
                : 'grass';
          av.lastFootstepSurface = surface;
          av.stepDustTimer = 0.42;
          av.stepDustGx = nx;
          av.stepDustGy = ny;
          sim.audio.playFootstep?.(surface);
        }
      } else {
        av.isMoving = false;
        av.targetGx = av.gx;
        av.targetGy = av.gy;
      }
    } else {
      av.isMoving = false;
    }
    // Auto-greet nearby villagers when strolling past them!
    if (!sim.isVisitingNeighbor) {
      for (const v of sim.villagers) {
        if (v.greetCooldownSec <= 0 && Math.hypot(v.gx - av.gx, v.gy - av.gy) <= 1.8) {
          sim.greetVillager(v.id);
          break;
        }
      }
    }
  }

  // 3. Step Roaming Pet Companion
  if (sim.roamingPet) {
    const pet = sim.roamingPet;
    if (sim.strollModeActive && sim.playerStrollAvatar) {
      const av = sim.playerStrollAvatar;
      const followGx = av.gx + (av.facingLeft ? 0.9 : -0.9);
      const followGy = av.gy + 0.6;
      pet.targetGx = followGx;
      pet.targetGy = followGy;
    } else if (Math.hypot(pet.targetGx - pet.gx, pet.targetGy - pet.gy) < 0.15) {
      const unlockedSet = new Set(sim.state.unlockedZones);
      const candidates: Array<[number, number]> = [];
      for (let oy = -4; oy <= 4; oy++) {
        for (let ox = -4; ox <= 4; ox++) {
          const tx = Math.floor(pet.gx) + ox;
          const ty = Math.floor(pet.gy) + oy;
          const c = sim.grid[ty]?.[tx];
          if (c && c.path !== 'none' && unlockedSet.has(c.zoneId) && !c.buildingUid) {
            candidates.push([tx + 0.5, ty + 0.5]);
          }
        }
      }
      if (candidates.length > 0) {
        const pick = candidates[Math.floor((Date.now() / 700) % candidates.length)];
        pet.targetGx = pick[0];
        pet.targetGy = pick[1];
      }
    }
    const pdx = pet.targetGx - pet.gx;
    const pdy = pet.targetGy - pet.gy;
    const pdist = Math.hypot(pdx, pdy);
    if (pdist > 0.08) {
      const pspeed = sim.strollModeActive ? 3.0 : 1.15;
      const step = Math.min(pdist, pspeed * dt);
      pet.gx += (pdx / pdist) * step;
      pet.gy += (pdy / pdist) * step;
      pet.facingLeft = pdx - pdy < 0;
      pet.walkPhase = (pet.walkPhase + dt * 7.2) % (Math.PI * 20);
    }
  }
}

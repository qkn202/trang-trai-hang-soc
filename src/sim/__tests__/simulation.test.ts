import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CATALOG,
  computeEconomicCycleSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FIRST_ECONOMIC_CYCLE_SEC,
  formatDurationCompactVi,
  getCatalogItem,
  MAX_WAIT_DURATION_SECONDS,
  MINIGAME_CLEAR_REDUCTION_SEC,
  MIN_LONG_BUILD_FLOOR_SECONDS,
  PASTURE_ANIMALS,
} from '../../data/catalog';
import { getItemPuzzleStarCost } from '../../data/match3Levels';
import { GRID_SIZE, ZONES } from '../../data/zones';
import {
  getLevelTrialRequirement,
  getWinsRequiredForNextLevel,
  LEVELS,
  MAX_LEVEL,
  TOTAL_WINS_FOR_MAX_LEVEL,
} from '../../data/levels';
import { STORY_QUESTS } from '../../data/quests';
import { BUILD_HUD_CATEGORIES, formatToastMessage } from '../../ui/hud';
import { MagicalAudio } from '../../engine/audio';
import {
  FRIENDSHIP_CHEST_TOKEN_COST,
  MAX_DAILY_FRIEND_HELPS,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  MAX_HOME_LANTERN_MARKS,
  syncNeighborSocialDailyReset,
} from '../neighborSocial';
import { ParkSimulation } from '../simulation';

const SAVE_KEY = 'burrow_hogsmeade_777_v3';

// Mock localStorage for node environment
const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

function createMockAudio(): MagicalAudio {
  return {
    enabled: true,
    bgmEnabled: true,
    playTone: vi.fn(),
    playSfx: vi.fn(),
    playClick: vi.fn(),
    playSpell: vi.fn(),
    playPlace: vi.fn(),
    playHarvestBubble: vi.fn(),
    playBuildComplete: vi.fn(),
    playLevelUp: vi.fn(),
    playCheekyAlert: vi.fn(),
    playOwlHoot: vi.fn(),
    playMatchPop: vi.fn(),
    playPowerupBlast: vi.fn(),
    playThunder: vi.fn(),
    playCardFound: vi.fn(),
    updateSoundscape: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
  } as unknown as MagicalAudio;
}

describe('ParkSimulation & Progression Tests', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe('(a) Thăng cấp, Môn Đề Cử & XP Curve (levels.ts)', () => {
    it('TOTAL_WINS_FOR_MAX_LEVEL phải đạt chính xác 3435 màn từ Lv 1 -> 100', () => {
      expect(TOTAL_WINS_FOR_MAX_LEVEL).toBe(3435);

      // Kiểm tra tính lũy kế từng cấp
      let sum = 0;
      for (let lv = 1; lv < MAX_LEVEL; lv++) {
        sum += getWinsRequiredForNextLevel(lv);
      }
      expect(sum).toBe(3435);
    });

    it('getWinsRequiredForNextLevel phản ánh đúng các mốc độ khó bậc thang', () => {
      expect(getWinsRequiredForNextLevel(1)).toBe(1);
      expect(getWinsRequiredForNextLevel(3)).toBe(1);
      expect(getWinsRequiredForNextLevel(4)).toBe(3);
      expect(getWinsRequiredForNextLevel(7)).toBe(3);
      expect(getWinsRequiredForNextLevel(8)).toBe(8);
      expect(getWinsRequiredForNextLevel(15)).toBe(8);
      expect(getWinsRequiredForNextLevel(16)).toBe(18);
      expect(getWinsRequiredForNextLevel(30)).toBe(18);
      expect(getWinsRequiredForNextLevel(31)).toBe(32);
      expect(getWinsRequiredForNextLevel(50)).toBe(32);
      expect(getWinsRequiredForNextLevel(51)).toBe(46);
      expect(getWinsRequiredForNextLevel(75)).toBe(46);
      expect(getWinsRequiredForNextLevel(76)).toBe(54);
      expect(getWinsRequiredForNextLevel(100)).toBe(54);
    });

    it('getLevelTrialRequirement xoay tua 5 môn giải đố mượt mà', () => {
      const t1 = getLevelTrialRequirement(1);
      const t2 = getLevelTrialRequirement(2);
      const t3 = getLevelTrialRequirement(3);
      const t4 = getLevelTrialRequirement(4);
      const t5 = getLevelTrialRequirement(5);
      const t6 = getLevelTrialRequirement(6);

      expect(t1.kind).toBe('match3');
      expect(t2.kind).toBe('caro');
      expect(t3.kind).toBe('sudoku');
      expect(t4.kind).toBe('chess');
      expect(t5.kind).toBe('blocks');
      expect(t6.kind).toBe('match3'); // Quay lại đầu chu kỳ

      expect(t1.icon).toBe('🍬');
      expect(t2.icon).toBe('🗺️');
      expect(t3.icon).toBe('🔢');
      expect(t4.icon).toBe('🏰');
      expect(t5.icon).toBe('🦄');

      expect(t1.shortVi).toBe('Bùa Gặt Honeydukes');
      expect(t2.shortVi).toBe('Ngũ Ấn Đạo Tặc');
      expect(t3.shortVi).toBe('Số Học Huyền Bí');
      expect(t4.shortVi).toBe('Cờ Phù Thủy');
      expect(t5.shortVi).toBe('Sinh Vật Huyền Bí');
    });

    it('LEVELS có đủ 100 cấp độ với XP curve tăng đơn điệu sau cấp 1', () => {
      expect(LEVELS.length).toBe(100);
      expect(LEVELS[0].level).toBe(1);
      expect(LEVELS[0].xpRequired).toBe(0);
      expect(LEVELS[99].level).toBe(100);

      for (let i = 1; i < LEVELS.length - 1; i++) {
        expect(LEVELS[i + 1].xpRequired).toBeGreaterThan(LEVELS[i].xpRequired);
      }
    });

    it('Thăng cấp trong ParkSimulation qua phần thưởng giải đố', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);
      const onLevelUpSpy = vi.fn();
      sim.onLevelUp = onLevelUpSpy;

      expect(sim.state.level).toBe(1);
      const goldBefore = sim.state.galleons;

      // Cấp 1 cần 1 trận thắng để lên cấp 2 (môn đề cử cấp 1 là match3)
      const trial = sim.getRequiredLevelTrial();
      expect(trial).not.toBeNull();

      // Giả lập vượt 1 màn giải đố đúng môn đề cử
      const rewardResult = sim.completePuzzleArcadeVictory('caro', {
        stars: 3,
        sand: 1,
        gold: 45,
        xp: 30,
      });

      expect(rewardResult.newMasterLevel).toBe(2);
      expect(sim.state.level).toBe(2);
      expect(onLevelUpSpy).toHaveBeenCalledWith(2);
      expect(sim.state.galleons).toBeGreaterThan(goldBefore);
    });

    it('addXp tích lũy vào Rương Mùa Gặt (mỗi 200 XP thưởng vàng + cát)', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);
      sim.state.xp = 0;
      const initialGold = sim.state.galleons;
      const initialSand = sim.state.timeSand;

      // Cộng 199 XP: chưa chạm mốc 200
      sim.addXp(199);
      expect(sim.state.xp).toBe(199);
      expect(sim.state.galleons).toBe(initialGold);

      // Cộng thêm 2 XP -> 201 XP: chạm mốc 200, thưởng 1 rương (+13G + 1 Cát)
      sim.addXp(2);
      expect(sim.state.xp).toBe(201);
      expect(sim.state.galleons).toBe(initialGold + 13);
      expect(sim.state.timeSand).toBe(initialSand + 1);
    });
  });

  describe('(b) Hàng đợi xưởng (enqueue/complete, output vào readyFarmGoods)', () => {
    it('Lò Bánh Bà Molly enqueue công thức, trừ nguyên liệu và ra lò readyFarmGoods', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);

      // Đặt lò bánh hoàn thiện trên bản đồ
      const bakeryUid = 'test_molly_bakery_uid';
      sim.state.buildings.push({
        uid: bakeryUid,
        itemId: 'molly_apple_bakery',
        gx: 10,
        gy: 10,
        rotation: 0,
        placedAt: Date.now(),
        constructEndsAt: 0, // Đã xây xong
        stars: 1,
        lastTickAt: Date.now(),
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        isIndestructible: true,
      });
      sim.rebuildGrid();

      const bakery = sim.state.buildings.find((b) => b.uid === bakeryUid);
      expect(bakery).toBeDefined();

      // Thêm nguyên liệu lúa mì và táo vào kho để làm bánh táo
      const wheatStart = sim.getFarmItemCount('ottery_wheat');
      sim.addFarmItemToBarn('ottery_wheat', 10);
      sim.addFarmItemToBarn('burrow_apple', 10);
      expect(sim.getFarmItemCount('ottery_wheat')).toBe(wheatStart + 10);

      const wheatBefore = sim.getFarmItemCount('ottery_wheat');
      const recipe = FARM_WORKSHOP_RECIPES.find((r) => r.id === 'rcp_apple_pie')!;
      expect(recipe).toBeDefined();

      // Enqueue bánh táo
      const res = sim.enqueueWorkshopRecipe(bakeryUid, 'rcp_apple_pie');
      expect(res.ok).toBe(true);
      expect(sim.getFarmItemCount('ottery_wheat')).toBe(wheatBefore - recipe.inputs[0].qty);
      expect(bakery!.workshopQueue?.length).toBe(1);

      // Đẩy thời gian trôi qua để hoàn thành nướng bánh
      const slot = bakery!.workshopQueue![0];
      expect(slot.goodId).toBe('cinnamon_apple_pie');

      // Giả lập thời gian trôi qua bằng sim.update
      slot.endsAt = Date.now() - 100; // Đã quá hạn
      sim.update(0.1);

      expect(bakery!.workshopQueue?.length).toBe(0);
      expect(bakery!.readyFarmGoods).toContain('cinnamon_apple_pie');
      expect(bakery!.readyBubbles).toBeGreaterThanOrEqual(1);

      // Thu hoạch bong bóng nông sản vào kho
      const harvestOk = sim.harvestBuildingBubble(bakeryUid);
      expect(harvestOk).toBe(true);
      expect(bakery!.readyFarmGoods?.length ?? 0).toBe(0);
      expect(sim.getFarmItemCount('cinnamon_apple_pie')).toBeGreaterThanOrEqual(1);
    });

    it('Từ chối enqueue khi không đủ nguyên liệu trong kho', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);

      const bakeryUid = 'test_molly_bakery_uid_2';
      sim.state.buildings.push({
        uid: bakeryUid,
        itemId: 'molly_apple_bakery',
        gx: 12,
        gy: 12,
        rotation: 0,
        placedAt: Date.now(),
        constructEndsAt: 0,
        stars: 1,
        lastTickAt: Date.now(),
        storedGalleons: 0,
        storedXp: 0,
        readyBubbles: 0,
        durability: 100,
        visitorsServed: 0,
        isIndestructible: true,
      });

      // Đảm bảo kho không có táo để làm bánh táo
      const barn = sim.ensureFarmBarn();
      barn.crops.burrow_apple = 0;

      const res = sim.enqueueWorkshopRecipe(bakeryUid, 'rcp_apple_pie');
      expect(res.ok).toBe(false);
      expect(res.msg).toContain('Thiếu');
    });
  });

  describe('(c) Đơn hàng Cú & nâng cấp Kho Nông Sản', () => {
    it('Đơn hàng Cú kiểm tra điều kiện giao hàng, thưởng Galleon/XP và sinh đơn mới', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);
      const barn = sim.ensureFarmBarn();

      expect(barn.owlOrders.length).toBeGreaterThanOrEqual(3);
      const targetOrder = barn.owlOrders[0];

      // Cung cấp đủ nông sản theo yêu cầu của đơn
      for (const req of targetOrder.requirements) {
        sim.addFarmItemToBarn(req.itemId, req.qty + 5);
      }

      expect(sim.canFulfillFarmOwlOrder(targetOrder)).toBe(true);

      const goldBefore = sim.state.galleons;
      const ordersBefore = barn.ordersDelivered ?? 0;

      const fulfillRes = sim.fulfillFarmOwlOrder(targetOrder.id);
      expect(fulfillRes.ok).toBe(true);
      expect(sim.state.galleons).toBe(goldBefore + targetOrder.rewardGalleons);
      expect(barn.ordersDelivered).toBe(ordersBefore + 1);

      // Kiểm tra vị trí đó đã được thay bằng đơn hàng mới
      expect(barn.owlOrders[0].id).not.toBe(targetOrder.id);
    });

    it('Nâng cấp Kho Nông Sản (+20 ô chứa)', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);
      const barn = sim.ensureFarmBarn();

      const initialCap = barn.capacity;
      sim.state.galleons = 5000;
      barn.goods.muggle_plug_kit = 5;

      const upRes = sim.upgradeFarmBarn();
      expect(upRes.ok).toBe(true);
      expect(barn.capacity).toBe(initialCap + 20);
      expect(barn.goods.muggle_plug_kit).toBe(4);
    });
  });

  describe('(d) Ruộng 4 giai đoạn (trống -> gieo -> tưới nước -> gặt)', () => {
    it('Vòng đời thửa đất nông sản 4 giai đoạn chuẩn xác', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);

      // Tìm thửa đất khởi đầu trống
      const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot' && !b.cropId);
      expect(plot).toBeDefined();

      // Giai đoạn 1: Đất cày bừa trống
      expect(plot!.cropId).toBeUndefined();
      expect(plot!.cropReadyAt).toBeUndefined();

      // Cho hạt giống lúa mì vào túi hạt
      const seedsStart = sim.getSeedCount('ottery_wheat');
      sim.addCropSeeds('ottery_wheat', 5);
      expect(sim.getSeedCount('ottery_wheat')).toBe(seedsStart + 5);

      // Giai đoạn 2: Gieo hạt giống (plantCropOnPlot)
      const plantRes = sim.plantCropOnPlot(plot!.uid, 'ottery_wheat');
      expect(plantRes.ok).toBe(true);
      expect(plot!.cropId).toBe('ottery_wheat');
      expect(plot!.cropReadyAt).toBeGreaterThan(Date.now());
      expect(sim.getSeedCount('ottery_wheat')).toBe(seedsStart + 4);

      // Thu hoạch ngay khi chưa chín phải thất bại
      const earlyHarvest = sim.harvestCropPlot(plot!.uid);
      expect(earlyHarvest.ok).toBe(false);

      // Giai đoạn 3: Tưới nước Aguamenti (waterCropPlot)
      const initialReadyAt = plot!.cropReadyAt!;
      const waterRes = sim.waterCropPlot(plot!.uid);
      expect(waterRes.ok).toBe(true);
      expect(plot!.cropWateredBoost).toBe(true);
      expect(plot!.cropReadyAt!).toBeLessThan(initialReadyAt);

      // Giai đoạn 4: Chín vàng và gặt hái (harvestCropPlot)
      plot!.cropReadyAt = Date.now() - 500; // Giả lập đã chín
      const wheatCountBefore = sim.getFarmItemCount('ottery_wheat');

      const harvestRes = sim.harvestCropPlot(plot!.uid);
      expect(harvestRes.ok).toBe(true);
      expect(sim.getFarmItemCount('ottery_wheat')).toBeGreaterThan(wheatCountBefore);

      // Ruộng trở về trạng thái trống sẵn sàng gieo tiếp
      expect(plot!.cropId).toBeUndefined();
      expect(plot!.cropReadyAt).toBeUndefined();
    });
  });

  describe('(e) Save/load round-trip qua localStorage', () => {
    it('Lưu game vào localStorage và khôi phục trạng thái chuẩn xác', () => {
      const audio = createMockAudio();
      const sim1 = new ParkSimulation(audio);

      // Tinh chỉnh một số dữ liệu để kiểm tra khôi phục
      const pumpkinStart = sim1.getFarmItemCount('garden_pumpkin');
      sim1.state.level = 7;
      sim1.state.galleons = 1234;
      sim1.state.timeSand = 15;
      sim1.addFarmItemToBarn('garden_pumpkin', 12);
      sim1.saveToStorage();

      // Kiểm tra localStorage có dữ liệu
      const savedRaw = mockLocalStorage.getItem(SAVE_KEY);
      expect(savedRaw).not.toBeNull();

      // Khởi tạo instance mới đọc từ localStorage
      const sim2 = new ParkSimulation(audio);
      expect(sim2.state.level).toBe(7);
      expect(sim2.state.galleons).toBe(1234);
      expect(sim2.state.timeSand).toBe(15);
      expect(sim2.getFarmItemCount('garden_pumpkin')).toBe(pumpkinStart + 12);
    });

    it('exportSaveJson và importSaveJson round-trip bảo toàn toàn bộ state', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);
      sim.state.level = 12;
      sim.state.galleons = 8888;

      const exported = sim.exportSaveJson();
      expect(typeof exported).toBe('string');

      sim.resetNewGame();
      expect(sim.state.level).toBe(1);

      const importOk = sim.importSaveJson(exported);
      expect(importOk).toBe(true);
      expect(sim.state.level).toBe(12);
      expect(sim.state.galleons).toBe(8888);
    });
  });

  describe('(f) Vườn Bí Ngô & Sân Đàn Gà Mái tách riêng và ghép liền mạch (connectableGroup)', () => {
    it('Tách thành 2 công trình 2×2 riêng biệt và hỗ trợ đặt nhiều ô bằng Galleon sau ô đầu tiên', () => {
      const audio = createMockAudio();
      const sim = new ParkSimulation(audio);

      const pumpkinItem = getCatalogItem('burrow_pumpkin_gnomes')!;
      const chickenItem = getCatalogItem('burrow_chicken_coop')!;

      expect(pumpkinItem).toBeDefined();
      expect(chickenItem).toBeDefined();
      expect(pumpkinItem.spriteKey).not.toBe(chickenItem.spriteKey);
      expect(pumpkinItem.width).toBe(2);
      expect(pumpkinItem.height).toBe(2);
      expect(chickenItem.width).toBe(2);
      expect(chickenItem.height).toBe(2);
      expect(pumpkinItem.connectableGroup).toBe('pumpkin_patch');
      expect(chickenItem.connectableGroup).toBe('chicken_yard');

      // Mở cấp độ và cấp đủ Sao + Galleon để kiểm tra đặt nhiều ô liền kề trên vùng 0 (x: 0..10, y: 12..23)
      sim.state.level = 10;
      sim.state.galleons = 2000;
      const m3 = sim.state.match3!;
      m3.stars = 100;
      m3.totalStarsEarned = 100;

      expect(sim.getEffectiveItemStarCost(chickenItem)).toBe(3);
      expect(sim.getEffectiveItemStarCost(pumpkinItem)).toBe(5);

      // Đặt Sân Đàn Gà Mái đầu tiên: trừ 3 Sao, 0 Galleon
      expect(sim.placeItem(chickenItem, 0, 12, 0)).toBe(true);
      expect(m3.stars).toBe(97);
      expect(sim.state.galleons).toBe(2000);
      expect(sim.getEffectiveItemStarCost(chickenItem)).toBe(0);

      // Đặt Sân Đàn Gà Mái thứ hai sát cạnh để ghép rào: trừ 0 Sao, 130 Galleon
      expect(sim.placeItem(chickenItem, 0, 14, 0)).toBe(true);
      expect(m3.stars).toBe(97);
      expect(sim.state.galleons).toBe(2000 - chickenItem.cost);

      // Xoá bớt ô thứ hai: hoàn Galleon (65%), không nhân bản Sao Phép Thuật
      expect(sim.removeAtTile(0, 14)).toBe(true);
      expect(m3.stars).toBe(97);

      // Đặt Vườn Bí Ngô đầu tiên & thứ hai sát cạnh
      expect(sim.placeItem(pumpkinItem, 2, 12, 0)).toBe(true);
      expect(m3.stars).toBe(92);
      expect(sim.getEffectiveItemStarCost(pumpkinItem)).toBe(0);

      const goldBeforeSecondPumpkin = sim.state.galleons;
      expect(sim.placeItem(pumpkinItem, 4, 12, 0)).toBe(true);
      expect(m3.stars).toBe(92);
      expect(sim.state.galleons).toBe(goldBeforeSecondPumpkin - pumpkinItem.cost);
    });
  });

  describe('(g) Bản đồ mở rộng 72×72 (5.184 ô) & thung lũng Level 1 rộng 36×30 (1.080 ô)', () => {
    it('Lưới 72×72 được phủ kín không chồng lấn và mở sẵn đúng 1.080 ô ở Level 1', () => {
      expect(GRID_SIZE).toBe(72);
      expect(GRID_SIZE * GRID_SIZE).toBe(5184);

      // Kiểm tra 10 vùng đất phủ kín chính xác 72×72 = 5.184 ô, không hở và không chồng lấn
      let coveredCount = 0;
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        for (let gx = 0; gx < GRID_SIZE; gx++) {
          const matches = ZONES.filter((z) => gx >= z.x1 && gx <= z.x2 && gy >= z.y1 && gy <= z.y2);
          expect(matches.length).toBe(1);
          coveredCount++;
        }
      }
      expect(coveredCount).toBe(5184);

      // Kiểm tra diện tích mở sẵn ở Level 1 = 36×30 = 1.080 ô với > 950 ô đất khô xây được
      const sim = new ParkSimulation(createMockAudio());
      const unlockedSet = new Set(sim.state.unlockedZones);
      let lv1Tiles = 0;
      let lv1DryTiles = 0;
      for (let gy = 0; gy < GRID_SIZE; gy++) {
        for (let gx = 0; gx < GRID_SIZE; gx++) {
          const cell = sim.grid[gy][gx];
          if (unlockedSet.has(cell.zoneId)) {
            lv1Tiles++;
            if (cell.terrain !== 'water') lv1DryTiles++;
          }
        }
      }
      expect(lv1Tiles).toBe(1080);
      expect(lv1DryTiles).toBeGreaterThan(950);

      // Đặt thử ruộng ở góc Đông-Nam mới mở của vùng Level 1 (gx = 32, gy = 38)
      const plotItem = getCatalogItem('farmland_plot')!;
      sim.state.galleons = 1000;
      expect(sim.placeItem(plotItem, 32, 38, 0)).toBe(true);
    });
  });

  describe('(h) Tham quan vườn bạn bè người chơi thật (0 NPC), trợ giúp vườn, Đơn Cú & Giải Cứu Minigame 1 ngày/lần', () => {
    it('Mặc định không có NPC nào trong Sổ Hàng Xóm, chặn mã NPC và bảo toàn chế độ Read-Only khi thăm người chơi thật', () => {
      const sim = new ParkSimulation(createMockAudio());
      expect(sim.ensureNeighborSocial().neighbors).toHaveLength(0);
      expect(sim.addFriendByCode('HS-HAGRID-01', 'Hagrid').ok).toBe(false);

      const added = sim.addVerifiedRealFriend({
        userId: 'real_player_01',
        friendCode: 'HS-REAL-01',
        name: 'Minh Khang',
        parkName: 'Điền Trang Minh Khang',
        level: 16,
        house: 'Ravenclaw',
      });
      expect(added.ok).toBe(true);
      const friendId = added.neighbor!.id;

      const homeBuildingUids = sim.state.buildings.map((b) => b.uid);
      const homeParkName = sim.state.parkName;

      const visitRes = sim.enterNeighborVisit(friendId);
      expect(visitRes.ok).toBe(true);
      expect(sim.isVisitingNeighbor).toBe(true);
      expect(sim.state.parkName).not.toBe(homeParkName);
      expect(sim.staff.length).toBe(0); // Không hiển thị sprite NPC khi thăm vườn

      // Chặn mọi hành vi xây mới, di dời, phá dỡ, lấy trộm nông sản tại vườn bạn bè
      const plotItem = getCatalogItem('farmland_plot')!;
      expect(sim.canPlaceItem(plotItem, 10, 14, 0).ok).toBe(false);
      expect(sim.placeItem(plotItem, 10, 14, 0)).toBe(false);
      const nbBuilding = sim.state.buildings[0];
      expect(sim.moveBuilding(nbBuilding.uid, 12, 14, 0).ok).toBe(false);
      expect(sim.removeAtTile(nbBuilding.gx, nbBuilding.gy)).toBe(false);
      expect(sim.harvestBuildingBubble(nbBuilding.uid)).toBe(false);

      // Thả tim tại vườn bạn bè -> vàng & huy hiệu tình bạn vẫn được ghi nhận về save nhà
      const goldBefore = sim.state.galleons;
      const tokensBeforeLike = sim.ensureNeighborSocial().friendshipTokens;
      const likeRes = sim.likeVisitedNeighborFarm();
      expect(likeRes.ok).toBe(true);
      expect(sim.state.galleons).toBeGreaterThan(goldBefore);
      expect(sim.ensureNeighborSocial().friendshipTokens).toBe(tokensBeforeLike + 1);

      // Lưu game khi đang ở vườn bạn bè phải giữ nguyên danh sách nhà ở vườn Hang Sóc
      sim.saveToStorage();
      const rawSaved = JSON.parse(localStorage.getItem(SAVE_KEY)!);
      expect(rawSaved.parkName).toBe(homeParkName);
      expect(rawSaved.buildings.map((b: { uid: string }) => b.uid)).toEqual(homeBuildingUids);
      expect(rawSaved.neighborSocial.friendshipTokens).toBe(tokensBeforeLike + 1);

      // Quay về vườn nhà khôi phục đầy đủ công trình
      const exitRes = sim.exitNeighborVisit(true);
      expect(exitRes.ok).toBe(true);
      expect(sim.isVisitingNeighbor).toBe(false);
      expect(sim.state.parkName).toBe(homeParkName);
      expect(sim.state.buildings.map((b) => b.uid)).toEqual(homeBuildingUids);
    });

    it('Đủ 4 hành động tương trợ vườn bạn (chăm ruộng/sân/xưởng, thả tim, quà bí ẩn, đóng hộ Đơn Cú) & nhận Đèn Lồng vườn nhà', () => {
      const sim = new ParkSimulation(createMockAudio());
      const added = sim.addVerifiedRealFriend({
        userId: 'real_player_02',
        friendCode: 'HS-REAL-02',
        name: 'Quốc Bảo',
        parkName: 'Thung Lũng Quốc Bảo',
        level: 20,
        house: 'Gryffindor',
      });
      expect(added.ok).toBe(true);
      const friend = added.neighbor!;

      sim.setNeighborPresetNote('sweet_bakery');
      expect(sim.enterNeighborVisit(friend.id).ok).toBe(true);

      // 1. Chăm công trình cần giúp (ruộng / sân gà / vườn bí / lò bánh)
      const helpable = sim.state.buildings.find((b) => sim.getVisitedBuildingHelpStatus(b).canHelp);
      expect(helpable).toBeDefined();
      const helpRes = sim.helpVisitedNeighborBuilding(helpable!.uid);
      expect(helpRes.ok).toBe(true);
      const afterHelpStatus = sim.getVisitedBuildingHelpStatus(helpable!);
      expect(afterHelpStatus.canHelp).toBe(false);
      expect(afterHelpStatus.existingMark?.noteId).toBe('sweet_bakery');

      // 2. Thả tim (1 lần/ngày/bạn)
      expect(sim.likeVisitedNeighborFarm().ok).toBe(true);
      expect(sim.likeVisitedNeighborFarm().ok).toBe(false);

      // 3. Mở Giỏ Quà Bí Ẩn (1 lần/ngày/bạn)
      expect(sim.canClaimVisitedMysteryGift()).toBe(true);
      expect(sim.claimVisitedNeighborMysteryGift().ok).toBe(true);
      expect(sim.canClaimVisitedMysteryGift()).toBe(false);
      expect(sim.claimVisitedNeighborMysteryGift().ok).toBe(false);

      // 4. Đóng hộ kiện hàng Đơn Cú của bạn bè
      const crate = friend.owlHelpCrates[0];
      sim.addFarmItemToBarn(crate.itemId, crate.qty + 2);
      const tokensBeforeCrate = sim.ensureNeighborSocial().friendshipTokens;
      const crateRes = sim.fulfillNeighborOwlCrate(friend.id, crate.id);
      expect(crateRes.ok).toBe(true);
      expect(sim.ensureNeighborSocial().friendshipTokens).toBe(
        tokensBeforeCrate + crate.rewardTokens
      );
      expect(sim.fulfillNeighborOwlCrate(friend.id, crate.id).ok).toBe(false);

      // Quay về nhà và kiểm tra nhờ bạn đóng hộ Đơn Cú của chính người chơi (<= 3/ngày)
      sim.exitNeighborVisit(true);
      const barn = sim.ensureFarmBarn();
      const order = barn.owlOrders[0];
      // Xoá sạch nông sản món 0 trong kho nhưng cung cấp đủ các món còn lại
      for (let i = 0; i < order.requirements.length; i++) {
        const req = order.requirements[i];
        if (i === 0) {
          if (req.itemId in barn.crops) {
            barn.crops[req.itemId as keyof typeof barn.crops] = 0;
          } else {
            barn.goods[req.itemId as keyof typeof barn.goods] = 0;
          }
        } else {
          sim.addFarmItemToBarn(req.itemId, req.qty + 2);
        }
      }
      expect(sim.canFulfillFarmOwlOrder(order)).toBe(false);

      const askOwl = sim.requestPlayerOwlCrateHelp(order.id, 0);
      expect(askOwl.ok).toBe(true);
      // Lùi thời gian yêu cầu 6 giây và chạy tick nền để hàng xóm phản hồi đóng hộ
      sim.ensureNeighborSocial().playerOwlHelpRequests[0].requestedAt = Date.now() - 6000;
      sim.tickNeighborSocialBackground(Date.now());
      expect(sim.getOwlRequirementHelpState(order.id, 0)?.fulfilledAt).toBeTruthy();
      expect(sim.canFulfillFarmOwlOrder(order)).toBe(true);
      expect(sim.fulfillFarmOwlOrder(order.id).ok).toBe(true);

      // Nhận Đèn Lồng Tương Trợ tại vườn nhà
      const homeBuilding = sim.state.buildings[0];
      sim.ensureNeighborSocial().homeLanternMarks.push({
        id: 'lantern_test_1',
        buildingUid: homeBuilding.uid,
        helperId: 'luna_meadow',
        helperName: 'Luna Lovegood',
        helperEmoji: '🌼',
        kind: 'tend_yard',
        noteVi: 'Chúc vườn Hang Sóc rực rỡ!',
        createdAt: Date.now(),
      });
      const tokensBeforeLantern = sim.ensureNeighborSocial().friendshipTokens;
      expect(sim.claimHomeLanternMark('lantern_test_1').ok).toBe(true);
      expect(sim.ensureNeighborSocial().friendshipTokens).toBe(tokensBeforeLantern + 1);
      expect(MAX_DAILY_OWL_HELP_REQUESTS).toBe(5);
      expect(MAX_DAILY_FRIEND_HELPS).toBe(5);
      expect(MAX_HOME_LANTERN_MARKS).toBe(5);
    });

    it('Giải cứu Minigame khóa chặt 1 lần/ngày/bạn, trần 5 lần/ngày và reset đúng 00:00 ngày mới', () => {
      const sim = new ParkSimulation(createMockAudio());
      const social = sim.ensureNeighborSocial();

      // Thêm 6 người bạn thật qua Mã Thung Lũng
      for (let idx = 1; idx <= 6; idx++) {
        const res = sim.addVerifiedRealFriend({
          userId: `real_u_${idx}`,
          friendCode: `HS-FRND-0${idx}`,
          name: `Người chơi ${idx}`,
          parkName: `Thung Lũng ${idx}`,
          level: 10 + idx * 3,
          house: 'Hufflepuff',
        });
        expect(res.ok).toBe(true);
      }
      expect(social.neighbors.length).toBe(6);

      // Giải cứu người bạn đầu tiên: lần 1 thành công, lần 2 trong cùng ngày bị chặn (1 lần/ngày/bạn)
      const n0 = social.neighbors[0];
      expect(sim.canRescueNeighborMinigame(n0.id).ok).toBe(true);
      const r0 = sim.completeNeighborMinigameRescue({
        neighborId: n0.id,
        neighborName: n0.name,
        neighborEmoji: n0.avatarEmoji,
        kind: n0.minigameSos!.kind,
        stage: n0.minigameSos!.stage,
      });
      expect(r0.ok).toBe(true);
      expect(r0.tokensEarned).toBe(3);
      expect(sim.canRescueNeighborMinigame(n0.id).ok).toBe(false);

      // Giải cứu thêm 4 người bạn tiếp theo -> chạm trần 5/5 lượt/ngày
      for (let i = 1; i < 5; i++) {
        const nb = social.neighbors[i];
        const ri = sim.completeNeighborMinigameRescue({
          neighborId: nb.id,
          neighborName: nb.name,
          neighborEmoji: nb.avatarEmoji,
          kind: nb.minigameSos!.kind,
          stage: nb.minigameSos!.stage,
        });
        expect(ri.ok).toBe(true);
      }
      expect(social.dailyRescuesGivenIds.length).toBe(MAX_DAILY_MINIGAME_RESCUES);

      // Người bạn thứ 6 bị chặn vì đã đủ 5 lượt giải cứu/ngày
      const n5 = social.neighbors[5];
      const overCap = sim.canRescueNeighborMinigame(n5.id);
      expect(overCap.ok).toBe(false);

      // Sang 00:00 ngày mới -> reset toàn bộ hạn mức hàng ngày
      social.lastSocialResetKey = '2025-01-01';
      expect(syncNeighborSocialDailyReset(social)).toBe(true);
      expect(social.dailyRescuesGivenIds.length).toBe(0);
      expect(sim.canRescueNeighborMinigame(n0.id).ok).toBe(true);
      expect(sim.canRescueNeighborMinigame(n5.id).ok).toBe(true);
    });

    it('Cầu viện bạn bè vượt hộ màn khó (SOS) & mở Rương Quà Tình Bạn (10 🍀)', () => {
      const sim = new ParkSimulation(createMockAudio());
      const social = sim.ensureNeighborSocial();
      sim.state.match3.currentLevel = 7;

      // Chưa có bạn bè thật -> không thể gửi SOS ảo
      expect(sim.requestPlayerMinigameSos('match3', 7).ok).toBe(false);

      // Kết bạn với 1 người chơi thật trước khi gửi SOS
      expect(
        sim.addVerifiedRealFriend({
          userId: 'real_helper_1',
          friendCode: 'HS-HELP-01',
          name: 'Lan Anh',
          parkName: 'Vườn Hoa Lan Anh',
          level: 25,
          house: 'Ravenclaw',
        }).ok
      ).toBe(true);

      const sosReq = sim.requestPlayerMinigameSos('match3', 7);
      expect(sosReq.ok).toBe(true);
      expect(sim.claimPlayerMinigameSosRescue().ok).toBe(false); // Chưa tới lúc bạn giải xong

      social.playerMinigameSos!.requestedAt = Date.now() - 6500;
      sim.tickNeighborSocialBackground(Date.now());
      expect(social.playerMinigameSos?.rescuedAt).toBeTruthy();

      const claimRes = sim.claimPlayerMinigameSosRescue();
      expect(claimRes.ok).toBe(true);
      expect(sim.state.match3.currentLevel).toBe(8);
      expect(social.dailyRescuesReceivedCount).toBe(1);

      // Kiểm tra Rương Quà Tình Bạn (10 🍀 -> +2 🌟 Sao + 1 🔥 Bùa + 2 🌱 Hạt + 150G)
      social.friendshipTokens = FRIENDSHIP_CHEST_TOKEN_COST;
      const starsBefore = sim.state.match3.stars;
      const talismansBefore = sim.getPhoenixTalismanCount();
      const chestRes = sim.openFriendshipChest();
      expect(chestRes.ok).toBe(true);
      expect(chestRes.starsEarned).toBe(2);
      expect(sim.state.match3.stars).toBe(starsBefore + 2);
      expect(sim.getPhoenixTalismanCount()).toBeGreaterThanOrEqual(talismansBefore);
      expect(social.friendshipTokens).toBe(0);
    });
  });

  describe('(i) 8 hạt giống hoa mới, Ô Vườn Hoa Cảnh & Đồng Cỏ Chăn Thả ghép liền rào', () => {
    it('Đủ 22 loại hạt giống (10 loài hoa có isFlowerCrop), gieo & gặt hoa vào Kho và bó hoa quà tặng', () => {
      const allCrops = Object.values(FARM_CROPS);
      const flowerCrops = allCrops.filter((c) => c.isFlowerCrop);
      expect(allCrops.length).toBe(22);
      expect(flowerCrops.length).toBe(10);
      expect(FARM_CROPS.moonlight_flower.nocturnalGlowColor).toBeTruthy();
      expect(FARM_CROPS.phoenix_fireflower.nocturnalGlowColor).toBeTruthy();

      const sim = new ParkSimulation(createMockAudio());
      sim.state.level = 20;
      sim.state.galleons = 5000;

      // Mua hạt Hoa Hồng Đỏ Anh Quốc, gieo xuống Thửa Đất trống, tưới nước & thu hoạch
      expect(sim.buyCropSeedWithGold('english_rose', 2).ok).toBe(true);
      const plotItem = getCatalogItem('farmland_plot')!;
      expect(sim.placeItem(plotItem, 24, 34, 0)).toBe(true);
      const plot = sim.state.buildings.find((b) => b.gx === 24 && b.gy === 34)!;
      expect(sim.plantCropOnPlot(plot.uid, 'english_rose').ok).toBe(true);
      expect(sim.waterCropPlot(plot.uid).ok).toBe(true);
      expect(plot.cropWateredBoost).toBe(true);

      plot.cropReadyAt = Date.now() - 1000;
      const beforeRoses = sim.getFarmItemCount('english_rose');
      const harv = sim.harvestCropPlot(plot.uid);
      expect(harv.ok).toBe(true);
      expect(sim.getFarmItemCount('english_rose')).toBe(
        beforeRoses + FARM_CROPS.english_rose.yieldQty
      );
      expect(FARM_GOODS.floral_bouquet_gift).toBeDefined();
      expect(FARM_GOODS.creamy_dairy_milk).toBeDefined();
    });

    it('Ô Vườn Hoa Cảnh & Đồng Cỏ Chăn Thả tốn 0 Sao Phép Thuật, đặt sát cạnh ghép rào & chăn thả thú tự lặp chu kỳ', () => {
      const flowerGarden = getCatalogItem('burrow_flower_garden')!;
      const animalPasture = getCatalogItem('burrow_animal_pasture')!;
      expect(flowerGarden.connectableGroup).toBe('flower_garden');
      expect(animalPasture.connectableGroup).toBe('animal_pasture');
      expect(animalPasture.isAnimalPasturePlot).toBe(true);
      expect(getItemPuzzleStarCost(flowerGarden)).toBe(0);
      expect(getItemPuzzleStarCost(animalPasture)).toBe(0);
      expect(Object.keys(PASTURE_ANIMALS).length).toBe(8);

      const sim = new ParkSimulation(createMockAudio());
      sim.state.level = 15;
      sim.state.galleons = 3000;
      const starsBefore = sim.state.match3.stars;

      // Đặt 2 Ô Vườn Hoa Cảnh sát cạnh & 2 Đồng Cỏ Chăn Thả sát cạnh -> trừ Vàng, giữ nguyên 100% Sao
      expect(sim.placeItem(flowerGarden, 26, 34, 0)).toBe(true);
      expect(sim.placeItem(flowerGarden, 28, 34, 0)).toBe(true);
      expect(sim.placeItem(animalPasture, 26, 36, 0)).toBe(true);
      expect(sim.placeItem(animalPasture, 28, 36, 0)).toBe(true);
      expect(sim.state.match3.stars).toBe(starsBefore);

      const pastureB = sim.state.buildings.find((b) => b.gx === 26 && b.gy === 36)!;

      // Thả Bò Sữa Đốm Kem -> Cho ăn Thảo Mộc (-35% giờ chờ) -> Thu hoạch Sữa Tươi & tự khởi động chu kỳ mới
      expect(sim.stockAnimalOnPasture(pastureB.uid, 'daisy_cow').ok).toBe(true);
      expect(pastureB.pastureAnimalId).toBe('daisy_cow');
      const readyBeforeFeed = pastureB.pastureReadyAt!;
      expect(sim.feedAnimalPasture(pastureB.uid).ok).toBe(true);
      expect(pastureB.pastureFedBoost).toBe(true);
      expect(pastureB.pastureReadyAt!).toBeLessThan(readyBeforeFeed);

      pastureB.pastureReadyAt = Date.now() - 1000;
      const milkBefore = sim.getFarmItemCount('creamy_dairy_milk');
      const goldBeforeHarvest = sim.state.galleons;
      const harvRes = sim.harvestAnimalPasture(pastureB.uid);
      expect(harvRes.ok).toBe(true);
      expect(sim.getFarmItemCount('creamy_dairy_milk')).toBe(
        milkBefore + PASTURE_ANIMALS.daisy_cow.yieldQty
      );
      expect(sim.state.galleons).toBeGreaterThan(goldBeforeHarvest);
      // Tự động bắt đầu chu kỳ gặm cỏ mới mà không mất thú trên đồng cỏ!
      expect(pastureB.pastureAnimalId).toBe('daisy_cow');
      expect(pastureB.pastureFedBoost).toBe(false);
      expect(pastureB.pastureReadyAt!).toBeGreaterThan(Date.now());

      // Đổi thú khác trên đồng cỏ
      expect(sim.clearAnimalFromPasture(pastureB.uid).ok).toBe(true);
      expect(pastureB.pastureAnimalId).toBeNull();
    });
  });

  describe('(j) Luồng hướng dẫn tân thủ 6 bước cùng Bà Molly Weasley', () => {
    it('khởi tạo tự động ở Bước 1, tiến qua đủ 6 bước nhận thưởng và hỗ trợ Xem Lại / Bỏ Qua an toàn', () => {
      const sim = new ParkSimulation(createMockAudio());

      expect(sim.isTutorialActive()).toBe(true);
      expect(sim.getCurrentTutorialStep()?.id).toBe('harvest_wheat');
      expect(sim.getCurrentTutorialStep()?.pose).toBe('npc_molly_welcome');

      // Bước 1: Gặt lúa mì chín trên thửa đất khởi đầu
      const step1Target = sim.getTutorialWorldTarget();
      expect(step1Target).not.toBeNull();
      const ripePlot = sim.state.buildings.find((b) => b.uid === step1Target!.uid)!;
      const roseSeedsBefore = sim.getSeedCount('english_rose');
      expect(sim.harvestCropPlot(ripePlot.uid).ok).toBe(true);
      expect(sim.getSeedCount('english_rose')).toBe(roseSeedsBefore + 2);
      expect(sim.getCurrentTutorialStep()?.id).toBe('sow_and_merge_plot');
      expect(sim.getCurrentTutorialStep()?.pose).toBe('npc_molly_guide');

      // Bước 2: Gieo hạt Hoa Hồng Anh vừa được bà Molly tặng lên ô đất trống
      const emptyPlot = sim.state.buildings.find(
        (b) => b.itemId === 'farmland_plot' && !b.cropId
      )!;
      const daisySeedsBefore = sim.getSeedCount('meadow_daisy');
      expect(sim.plantCropOnPlot(emptyPlot.uid, 'english_rose').ok).toBe(true);
      expect(sim.getSeedCount('meadow_daisy')).toBe(daisySeedsBefore + 2);
      expect(sim.getCurrentTutorialStep()?.id).toBe('pasture_harvest_and_stock');

      // Bước 3: Thu hoạch trứng ở ô Đồng Cỏ có sẵn rồi thả Cừu Lông Xù sang ô Đồng Cỏ trống kế bên
      const readyPasture = sim.state.buildings.find(
        (b) =>
          b.itemId === 'burrow_animal_pasture' &&
          Boolean(b.pastureAnimalId) &&
          Boolean(b.pastureReadyAt && Date.now() >= b.pastureReadyAt)
      )!;
      expect(sim.harvestAnimalPasture(readyPasture.uid).ok).toBe(true);
      // Chưa thả thú mới thì vẫn ở Bước 3 để người chơi hoàn tất ghép đàn
      expect(sim.getCurrentTutorialStep()?.id).toBe('pasture_harvest_and_stock');

      const emptyPasture = sim.state.buildings.find(
        (b) => b.itemId === 'burrow_animal_pasture' && !b.pastureAnimalId
      )!;
      expect(sim.stockAnimalOnPasture(emptyPasture.uid, 'ottery_sheep').ok).toBe(true);
      expect(sim.getCurrentTutorialStep()?.id).toBe('seed_quiz_or_buy');

      // Bước 4: Nhận thêm hạt giống (mua bằng Vàng hoặc thắng Học Viện Ngôn Ngữ 0G)
      const sandBefore = sim.state.timeSand;
      expect(sim.buyCropSeedWithGold('meadow_daisy', 1).ok).toBe(true);
      expect(sim.state.timeSand).toBe(sandBefore + 1);
      expect(sim.getCurrentTutorialStep()?.id).toBe('earn_magic_star');
      expect(sim.getCurrentTutorialStep()?.pose).toBe('npc_molly_cheer');

      // Bước 5: Chinh phục 1 màn Giải Đố (Match-3 hoặc 4 Môn Trí Tuệ) kiếm Sao Phép Thuật
      const starsBeforeStep5 = sim.state.match3.stars;
      sim.completeMatch3LevelVictory(10);
      expect(sim.state.match3.stars).toBeGreaterThanOrEqual(starsBeforeStep5 + 3);
      expect(sim.getCurrentTutorialStep()?.id).toBe('build_and_owl_order');

      // Bước 6: Giao chuyến Đơn Hàng Cú đầu tiên của Luna (hoặc xây xưởng 0s) nhận Quà Tốt Nghiệp
      const talismansBefore = sim.state.phoenixTalismans ?? 0;
      const owlRes = sim.fulfillFarmOwlOrder('farm_owl_init_1');
      expect(owlRes.ok).toBe(true);
      expect(sim.state.phoenixTalismans).toBeGreaterThanOrEqual(talismansBefore + 1);
      expect(sim.isTutorialActive()).toBe(false);
      expect(sim.state.tutorial?.stepId).toBe('completed');
      expect(sim.state.tutorial?.completedAt).toBeGreaterThan(0);
      expect(sim.state.tutorial?.claimedSteps).toHaveLength(6);

      // Xem lại từ Cài Đặt không nhân đôi phần thưởng đã nhận
      const goldAfterGrad = sim.state.galleons;
      sim.restartTutorial();
      expect(sim.isTutorialActive()).toBe(true);
      expect(sim.getCurrentTutorialStep()?.id).toBe('harvest_wheat');
      sim.advanceTutorialStep('harvest_wheat');
      expect(sim.state.galleons).toBe(goldAfterGrad);

      // Bỏ qua giữa chừng ẩn ngay bảng hướng dẫn
      sim.skipTutorial();
      expect(sim.isTutorialActive()).toBe(false);
      expect(sim.state.tutorial?.skipped).toBe(true);
    });
  });

  describe('(k) Tiến trình cấp số nhân ×2 (Sao mở khóa, giờ chờ xây dựng từ 1 phút, giờ hoàn thành công việc từ 30 phút tới tối đa 3 ngày)', () => {
    it('Số sao mở khóa, thời gian xây 33 công trình (từ 60s ×2) và thời gian công việc (22 hạt giống, 8 thú chăn thả, 22 công thức từ 1.800s ×2) tăng theo cấp số nhân tới trần 3 ngày (259.200s)', () => {
      const plotItem = getCatalogItem('farmland_plot')!;
      const pastureItem = getCatalogItem('burrow_animal_pasture')!;
      const flowerGardenItem = getCatalogItem('burrow_flower_garden')!;
      expect(plotItem.buildDurationSec).toBe(0);
      expect(pastureItem.buildDurationSec).toBe(0);
      expect(flowerGardenItem.buildDurationSec).toBe(0);

      // 0. Kiểm tra tổng ngân sách Sao mở khóa 33 công trình = đúng 6.400 🌟 (cộng 255 🌟 vùng đất + 495 🌟 nâng cấp 5★ = đúng 7.150 🌟 <= 7.278 🌟 cung cơ bản)
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_house_canon')!)).toBe(1);
      expect(getItemPuzzleStarCost(getCatalogItem('molly_apple_bakery')!)).toBe(2);
      expect(getItemPuzzleStarCost(getCatalogItem('butterbeer_cart')!)).toBe(2);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_chicken_coop')!)).toBe(3);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_self_knitting_loom')!)).toBe(4);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_pumpkin_gnomes')!)).toBe(5);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_owl_post')!)).toBe(6);
      expect(getItemPuzzleStarCost(getCatalogItem('arthur_ford_shed')!)).toBe(8);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_reed_pond_mill')!)).toBe(10);
      expect(getItemPuzzleStarCost(getCatalogItem('burrow_apple_orchard')!)).toBe(14);
      expect(getItemPuzzleStarCost(getCatalogItem('dragon_lair')!)).toBe(960);

      const totalStarBuildingsCost = CATALOG.reduce(
        (sum, it) => sum + getItemPuzzleStarCost(it),
        0
      );
      expect(totalStarBuildingsCost).toBe(6400);

      // 1. Kiểm tra 33 công trình có buildDurationSec > 0 theo cấp số nhân từ 60s (1 phút) ×2 tới 259.200s (3 ngày)
      const constructibleItems = CATALOG.filter((it) => it.buildDurationSec > 0).sort(
        (a, b) => a.unlockLevel - b.unlockLevel || a.buildDurationSec - b.buildDurationSec
      );
      expect(constructibleItems).toHaveLength(33);
      expect(constructibleItems[0].buildDurationSec).toBe(60);
      expect(constructibleItems[1].buildDurationSec).toBe(120);
      expect(constructibleItems[2].buildDurationSec).toBe(240);
      expect(constructibleItems[3].buildDurationSec).toBe(480);
      expect(constructibleItems[4].buildDurationSec).toBe(960);
      expect(constructibleItems[5].buildDurationSec).toBe(1920);

      for (let i = 1; i < constructibleItems.length; i++) {
        expect(constructibleItems[i].buildDurationSec).toBeGreaterThanOrEqual(
          constructibleItems[i - 1].buildDurationSec
        );
      }
      expect(constructibleItems[constructibleItems.length - 1].id).toBe('dragon_lair');
      expect(constructibleItems[constructibleItems.length - 1].buildDurationSec).toBe(
        MAX_WAIT_DURATION_SECONDS
      );
      expect(formatDurationCompactVi(MAX_WAIT_DURATION_SECONDS)).toBe('3 ngày');

      // 2. Kiểm tra hoạt động kinh tế (22 hạt giống, 8 thú chăn thả, 22 công thức xưởng) mặc định 1 tiếng (3.600s) ở lần thu hoạch đầu và nhân 2 ở các lần tiếp theo
      const cropsSorted = Object.values(FARM_CROPS);
      expect(cropsSorted).toHaveLength(22);
      for (const crop of cropsSorted) {
        expect(crop.growSec).toBe(FIRST_ECONOMIC_CYCLE_SEC);
      }
      expect(computeEconomicCycleSeconds(0)).toBe(3600);
      expect(computeEconomicCycleSeconds(1)).toBe(7200);
      expect(computeEconomicCycleSeconds(2)).toBe(14400);
      expect(computeEconomicCycleSeconds(3)).toBe(21600);
      expect(computeEconomicCycleSeconds(20)).toBe(21600);

      // 3. Kiểm tra 8 thú chăn thả mặc định 1 tiếng (3.600s) ở lần thu hoạch đầu
      const animalsSorted = Object.values(PASTURE_ANIMALS);
      expect(animalsSorted).toHaveLength(8);
      for (const animal of animalsSorted) {
        expect(animal.cycleSec).toBe(FIRST_ECONOMIC_CYCLE_SEC);
      }

      // 4. Kiểm tra 22 công thức xưởng mặc định 1 tiếng (3.600s) ở lần đầu và không mở khóa trước nguyên liệu
      for (const rcp of Object.values(FARM_WORKSHOP_RECIPES)) {
        expect(rcp.craftSec).toBe(FIRST_ECONOMIC_CYCLE_SEC);
        for (const inp of rcp.inputs) {
          const cropMeta = FARM_CROPS[inp.itemId as keyof typeof FARM_CROPS];
          if (cropMeta) {
            expect(rcp.unlockLevel).toBeGreaterThanOrEqual(cropMeta.unlockLevel);
          }
        }
      }
    });

    it('Khoá Cát Xoay Thời Gian khi chơi thường; mỗi lần qua màn Minigame & Quiz giảm 10 phút (600s) cho cả xây dựng lẫn hoạt động kinh tế', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.level = 100;
      sim.state.unlockedZones = ZONES.map((z) => z.id);
      sim.state.match3.stars = 5000;
      sim.state.galleons = 500_000;
      sim.state.timeSand = 20;

      // Đặt công trình bậc 7 (arthur_ford_shed = 7680s = 2g 8p) và công trình tiếp theo (burrow_reed_pond_mill = 15360s = 4g 16p)
      const clockTower = getCatalogItem('arthur_ford_shed')!;
      const wheezes = getCatalogItem('burrow_reed_pond_mill')!;
      expect(clockTower.buildDurationSec).toBe(7680);
      expect(wheezes.buildDurationSec).toBe(15360);

      expect(sim.placeItem(clockTower, 22, 20, 0)).toBe(true);
      expect(sim.placeItem(wheezes, 26, 20, 0)).toBe(true);

      const placedTower = sim.state.buildings.find((b) => b.itemId === 'arthur_ford_shed')!;
      const placedWheezes = sim.state.buildings.find((b) => b.itemId === 'burrow_reed_pond_mill')!;
      expect(placedTower).toBeDefined();
      expect(placedWheezes).toBeDefined();

      // Kiểm tra ruộng canh tác: lần thu hoạch đầu 1 tiếng (3.600s), lần 2 là 2 tiếng (7.200s), qua màn minigame giảm 10 phút (600s)
      const emptyPlot = sim.state.buildings.find((b) => b.uid === 'burrow_plot_empty')!;
      sim.addCropSeeds('ottery_wheat', 5);
      expect(sim.plantCropOnPlot(emptyPlot.uid, 'ottery_wheat').ok).toBe(true);
      const firstGrowSec = Math.round((emptyPlot.cropReadyAt! - emptyPlot.cropPlantedAt!) / 1000);
      expect(firstGrowSec).toBe(3600);

      // 1. Cát Xoay Thời Gian bị khóa cho xây dựng công trình ở chế độ thường (!sandboxMode)
      const endBeforeSand = placedTower.constructEndsAt;
      expect(sim.speedUpWithTimeSand(placedTower.uid, true)).toBe(false);
      expect(placedTower.constructEndsAt).toBe(endBeforeSand);

      // 2. Thắng 1 màn Match-3 -> giảm đúng 10 phút (600s) cho cả công trình đang xây và cây đang trồng!
      const cropReadyBeforeM3 = emptyPlot.cropReadyAt!;
      const m3Res = sim.completeMatch3LevelVictory(0);
      expect(m3Res.buildReduction).toBeDefined();
      expect(m3Res.buildReduction!.reducedSec).toBe(MINIGAME_CLEAR_REDUCTION_SEC);
      expect(placedTower.buildReducedSec).toBe(600);
      expect(Math.round((cropReadyBeforeM3 - emptyPlot.cropReadyAt!) / 1000)).toBe(600);

      // Thu hoạch lần 1 -> gieo lần 2 tăng theo cấp số nhân lên 2 tiếng (7.200s)
      emptyPlot.cropReadyAt = Date.now() - 1000;
      expect(sim.harvestCropPlot(emptyPlot.uid).ok).toBe(true);
      expect(emptyPlot.harvestCycleCount).toBe(1);
      expect(sim.plantCropOnPlot(emptyPlot.uid, 'ottery_wheat').ok).toBe(true);
      const secondGrowSec = Math.round((emptyPlot.cropReadyAt! - emptyPlot.cropPlantedAt!) / 1000);
      expect(secondGrowSec).toBe(7200);

      // 3. Trả lời đúng 1 câu Quiz Ngoại Ngữ -> giảm 10 phút (600s)
      const quizOut = sim.completeSeedLanguageQuizAttempt(
        'ottery_wheat',
        {
          qId: 'test_q1',
          lang: 'en',
          tier: 'advanced',
          levelBand: 8,
          chapterTitleVi: 'Chương 8',
          format: 'grammar_cloze',
          isReview: false,
          promptVi: 'Test',
          stemText: 'I ___ happy.',
          ttsPromptText: 'I am happy.',
          choices: ['am', 'is', 'are', 'be'],
          correctIndex: 0,
          fullSentence: 'I am happy.',
          fullPhonetic: '/aɪ æm ˈhæpi/',
          translationVi: 'Tôi vui.',
          grammarTitleVi: 'To be',
          grammarExplainVi: 'I + am',
          vocabNotes: [],
        },
        true
      );
      expect(quizOut.buildReduction?.reducedSec).toBe(MINIGAME_CLEAR_REDUCTION_SEC);

      // 4. Giảm liên tiếp qua thắng Giải Đố: arthur_ford_shed chạm đúng sàn 1 tiếng (3.600s) và phần dư tự động tràn sang burrow_reed_pond_mill!
      sim.applyConstructionReductionFromGameplay(3600, 'Giải Đố Test');
      const nowAfter = Date.now();
      const towerRemainSec = Math.round((placedTower.constructEndsAt - nowAfter) / 1000);
      expect(towerRemainSec).toBeGreaterThanOrEqual(MIN_LONG_BUILD_FLOOR_SECONDS - 2);
      expect(towerRemainSec).toBeLessThanOrEqual(MIN_LONG_BUILD_FLOOR_SECONDS + 2);
      // Phần dư đã tự động giảm cho công trình thứ hai (burrow_reed_pond_mill)
      expect(placedWheezes.buildReducedSec ?? 0).toBeGreaterThan(0);

      // 5. Khi tất cả công trình đang xây đều đã chạm sàn 1 tiếng và không còn hoạt động kinh tế chờ -> reducedSec = 0 & allActiveAtFloor = true
      emptyPlot.cropReadyAt = Date.now() - 1000;
      sim.harvestCropPlot(emptyPlot.uid);
      sim.applyConstructionReductionFromGameplay(50_000, 'Chạm Sàn Hết');
      const atFloorRes = sim.applyConstructionReductionFromGameplay(1800, 'Đã Chạm Sàn');
      expect(atFloorRes.reducedSec).toBe(0);
      expect(atFloorRes.allActiveAtFloor).toBe(true);
      expect(Math.round((placedWheezes.constructEndsAt - Date.now()) / 1000)).toBeGreaterThanOrEqual(
        MIN_LONG_BUILD_FLOOR_SECONDS - 2
      );

      // 6. Ở chế độ Sáng Tạo (sandboxMode = true), Cát Xoay Thời Gian vẫn cho phép hoàn tất ngay để thử nghiệm
      sim.state.sandboxMode = true;
      expect(sim.speedUpWithTimeSand(placedTower.uid, true)).toBe(true);
      expect(placedTower.constructEndsAt).toBeLessThanOrEqual(Date.now());
    });

    it('HUD Xây Dựng loại bỏ hoàn toàn danh mục Địa Hình (terrain) mà không gây khoá nhiệm vụ hay mốc cấp', () => {
      expect(BUILD_HUD_CATEGORIES).not.toContain('terrain');
      expect(BUILD_HUD_CATEGORIES).toEqual(['path', 'shop', 'creature', 'decor', 'staff']);

      for (const lv of LEVELS) {
        for (const itemId of lv.unlockedItemIds) {
          expect(getCatalogItem(itemId)?.category).not.toBe('terrain');
        }
      }

      for (const q of STORY_QUESTS) {
        if (q.targetId) {
          expect(getCatalogItem(q.targetId)?.category).not.toBe('terrain');
        }
      }
    });

    it('Bảo vệ toàn diện chống mất hàng khi Kho Đỏ đầy, chống nhảy màn 777 khi chơi lại, khóa Lịch Điểm Danh 1 lần/ngày & chặn Accio khi thăm vườn', () => {
      const sim = new ParkSimulation(createMockAudio());
      const barn = sim.ensureFarmBarn();

      // 1. Kho Đỏ đầy không bao giờ làm mất trắng readyFarmGoods khi thu hoạch bong bóng xưởng hoặc dùng Accio
      sim.state.match3.stars = 20;
      sim.state.galleons = 2000;
      expect(sim.placeItem(getCatalogItem('molly_apple_bakery')!, 0, 12, 0)).toBe(true);
      const bakery = sim.state.buildings.find((b) => b.itemId === 'molly_apple_bakery')!;
      expect(bakery).toBeDefined();
      bakery.constructEndsAt = 0;
      bakery.readyFarmGoods = ['cinnamon_apple_pie', 'pumpkin_pie'];
      barn.crops.ottery_wheat = (barn.crops.ottery_wheat ?? 0) + (barn.capacity - sim.getBarnTotalUsed());
      expect(sim.getBarnTotalUsed()).toBe(barn.capacity);

      expect(sim.harvestBuildingBubble(bakery.uid)).toBe(false);
      expect(bakery.readyFarmGoods).toEqual(['cinnamon_apple_pie', 'pumpkin_pie']);

      sim.castAccioHarvestAll();
      expect(bakery.readyFarmGoods).toEqual(['cinnamon_apple_pie', 'pumpkin_pie']);

      // Giải phóng 1 chỗ trong Kho Đỏ -> thu đúng 1 bánh, cái còn lại giữ nguyên trên khay!
      barn.crops.ottery_wheat -= 1;
      expect(sim.harvestBuildingBubble(bakery.uid)).toBe(true);
      expect(bakery.readyFarmGoods).toEqual(['pumpkin_pie']);

      // 2. Chơi lại màn cũ không bao giờ làm maxClearedLevel nhảy vọt lên 777
      sim.state.match3.maxClearedLevel = 12;
      sim.state.match3.currentLevel = 4; // Chơi lại màn 4
      sim.completeMatch3LevelVictory(10, { sessionScore: 1800 });
      expect(sim.state.match3.maxClearedLevel).toBe(12);
      expect(sim.state.match3.currentLevel).toBe(13);

      sim.state.puzzleArcade.sudokuCleared = 9;
      sim.state.puzzleArcade.sudokuStage = 3; // Chơi lại màn 3
      sim.completePuzzleArcadeVictory('sudoku', { stars: 1, sand: 0, gold: 40, xp: 15 });
      expect(sim.state.puzzleArcade.sudokuCleared).toBe(9);
      expect(sim.state.puzzleArcade.sudokuStage).toBe(10);

      // 3. Lịch Điểm Danh 7 Ngày khóa chặt tối đa 1 mốc / ngày lịch thực tế
      expect(sim.claimLoginDayReward(1).ok).toBe(true);
      expect(sim.claimLoginDayReward(2).ok).toBe(false);

      // 4. Đang thăm vườn bạn bè khóa hoàn toàn Accio và khôi phục kho trang trí
      const addFriend = sim.addFriendByCode('HS-TEST-99', 'Người Bạn Thật');
      expect(addFriend.ok).toBe(true);
      expect(sim.enterNeighborVisit(addFriend.neighbor!.id).ok).toBe(true);
      const guestPlot = sim.state.buildings.find((b) => Boolean(b.cropId));
      if (guestPlot) {
        guestPlot.cropReadyAt = Date.now() - 5000;
      }
      sim.castAccioHarvestAll();
      if (guestPlot) {
        expect(guestPlot.cropId).toBeDefined();
      }
      expect(sim.restoreAllStashedDecor().ok).toBe(false);
      sim.exitNeighborVisit();
    });
  });

  describe('(l) Kiểm chứng 5 nhóm lỗi QA Playtest (Khóa lặp thưởng cắt băng, Xác nhận xóa vụ mùa, Nhãn nâng Kho Đỏ, Tên công thức & Vạc Phép)', () => {
    it('1. Mỗi loại công trình tốn Sao chỉ thưởng XP hoàn thành & Lễ Cắt Băng Khánh Thành đúng 1 lần duy nhất (vẫn hoàn đủ Sao khi dỡ)', () => {
      const sim = new ParkSimulation(createMockAudio());
      sim.state.match3.stars = 10;
      sim.state.galleons = 500;

      const bakeryItem = getCatalogItem('molly_apple_bakery')!;
      expect(getItemPuzzleStarCost(bakeryItem)).toBe(2);

      // Vòng 1: Xây Lò Nướng (trừ 2 🌟), hết giờ xây -> nhận finishXp + chờ cắt băng -> cắt băng nhận Vàng, XP & 25🍁 Tiệc Mùa Gặt
      expect(sim.placeItem(bakeryItem, 22, 24, 0)).toBe(true);
      expect(sim.state.match3.stars).toBe(8);
      const b1 = sim.state.buildings.find((b) => b.itemId === 'molly_apple_bakery')!;
      const xpBeforeFinish1 = sim.state.xp;
      b1.constructEndsAt = Date.now() - 1000;
      sim.tickProductionToTimestamp(Date.now());
      expect(b1.awaitingUnveil).toBe(true);
      const xpAfterFinish1 = sim.state.xp;
      expect(xpAfterFinish1).toBeGreaterThan(xpBeforeFinish1);

      const goldBeforeUnveil1 = sim.state.galleons;
      const feastBefore1 = sim.ensureHarvestFeast().points;
      const unveil1 = sim.unveilBuilding(b1.uid);
      expect(unveil1).not.toBeNull();
      expect(sim.state.galleons).toBe(goldBeforeUnveil1 + unveil1!.bonusGalleons);
      expect(sim.ensureHarvestFeast().points).toBe(feastBefore1 + 25);

      // Xóa Lò Nướng: hoàn đủ 2 🌟 Sao để không bao giờ khóa tiến độ 100%
      expect(sim.removeAtTile(22, 24, true)).toBe(true);
      expect(sim.state.match3.stars).toBe(10);

      // Vòng 2: Xây lại Lò Nướng cùng loại -> KHÔNG cộng lại finishXp, KHÔNG bật awaitingUnveil, KHÔNG nhận thêm Vàng/XP/Điểm Tiệc Mùa Gặt!
      expect(sim.placeItem(bakeryItem, 22, 24, 0)).toBe(true);
      const b2 = sim.state.buildings.find((b) => b.itemId === 'molly_apple_bakery')!;
      const xpBeforeFinish2 = sim.state.xp;
      const goldBeforeFinish2 = sim.state.galleons;
      const feastBefore2 = sim.ensureHarvestFeast().points;
      b2.constructEndsAt = Date.now() - 1000;
      sim.tickProductionToTimestamp(Date.now());

      expect(b2.awaitingUnveil).toBeUndefined();
      expect(sim.state.xp).toBe(xpBeforeFinish2);
      expect(sim.unveilBuilding(b2.uid)).toBeNull();
      expect(sim.state.galleons).toBe(goldBeforeFinish2);
      expect(sim.ensureHarvestFeast().points).toBe(feastBefore2);

      // Kể cả khi lưu & F5 (loadFromStorage), cờ unveiledItemIds vẫn được bảo toàn
      sim.saveToStorage();
      const reloaded = new ParkSimulation(createMockAudio());
      expect(reloaded.state.unveiledItemIds).toContain('molly_apple_bakery');

      // Cổng Floo thứ 2 (mua bằng Vàng, không tốn Sao) khi xóa chỉ hoàn 65% Vàng, 0 Sao
      const flooItem = getCatalogItem('floo_fireplace_gate')!;
      sim.state.level = 100;
      sim.state.unlockedZones = ZONES.map((z) => z.id);
      sim.rebuildGrid();
      sim.state.galleons = 50_000;
      sim.state.match3.stars = 500;
      const findValidSpot = () => {
        for (let gy = 14; gy < 40; gy++) {
          for (let gx = 10; gx < 40; gx++) {
            if (sim.canPlaceItem(flooItem, gx, gy, 0).ok) return { gx, gy };
          }
        }
        throw new Error('No valid spot');
      };
      const spot1 = findValidSpot();
      expect(sim.placeItem(flooItem, spot1.gx, spot1.gy, 0)).toBe(true);
      const starsAfterFirstFloo = sim.state.match3.stars;
      const spot2 = findValidSpot();
      expect(sim.placeItem(flooItem, spot2.gx, spot2.gy, 0)).toBe(true);
      expect(sim.state.match3.stars).toBe(starsAfterFirstFloo);
      const goldBeforeRemove2 = sim.state.galleons;
      expect(sim.removeAtTile(spot2.gx, spot2.gy, true)).toBe(true);
      expect(sim.state.match3.stars).toBe(starsAfterFirstFloo);
      expect(sim.state.galleons).toBe(goldBeforeRemove2 + Math.round(flooItem.cost * 0.65));
    });

    it('2. Xóa ô đất đang có cây chín/đang lớn, đồng cỏ có thú hoặc xưởng đang chạy bắt buộc qua xác nhận trước khi xóa', () => {
      const sim = new ParkSimulation(createMockAudio());
      const warnings: string[] = [];
      sim.onRequestBulldozeConfirm = (w) => {
        warnings.push(w.hazardSummaryVi);
      };

      // Ô đất khởi đầu đang có Lúa Mì chín (burrow_plot_wheat tại 17,25)
      const ripePlot = sim.state.buildings.find((b) => b.uid === 'burrow_plot_wheat')!;
      expect(ripePlot.cropId).toBe('ottery_wheat');
      expect(sim.removeAtTile(ripePlot.gx, ripePlot.gy)).toBe(false);
      expect(warnings.length).toBe(1);
      expect(warnings[0]).toContain('Lúa Mì');
      expect(sim.state.buildings.some((b) => b.uid === 'burrow_plot_wheat')).toBe(true);

      // Ô đồng cỏ đang có Gà Mái Đỏ (burrow_pasture_hen tại 12,25)
      const stockedPasture = sim.state.buildings.find((b) => b.uid === 'burrow_pasture_hen')!;
      expect(sim.removeAtTile(stockedPasture.gx, stockedPasture.gy)).toBe(false);
      expect(warnings.length).toBe(2);
      expect(sim.state.buildings.some((b) => b.uid === 'burrow_pasture_hen')).toBe(true);

      // Chỉ khi người chơi bấm xác nhận (force = true) thì mới thực sự xóa
      expect(sim.removeAtTile(ripePlot.gx, ripePlot.gy, true)).toBe(true);
      expect(sim.state.buildings.some((b) => b.uid === 'burrow_plot_wheat')).toBe(false);

      // Ngược lại, ô đất trống (burrow_plot_empty tại 19,25) xóa ngay không làm phiền hỏi xác nhận
      const emptyPlot = sim.state.buildings.find((b) => b.uid === 'burrow_plot_empty')!;
      expect(sim.getBulldozeHazardWarning(emptyPlot.gx, emptyPlot.gy)).toBeNull();
      expect(sim.removeAtTile(emptyPlot.gx, emptyPlot.gy)).toBe(true);
      expect(warnings.length).toBe(2);
    });

    it('3. Thông tin chi phí nâng cấp Kho Đỏ đồng bộ 100% giữa khi có Phích Cắm (1🔌 + 250G) và khi thiếu Phích Cắm (370G bù 1🔌)', () => {
      const sim = new ParkSimulation(createMockAudio());
      const barn = sim.ensureFarmBarn();
      barn.goods.muggle_plug_kit = 0;
      sim.state.galleons = 300;

      // Chưa có 🔌 và mới có 300G (< 370G) -> canAfford = false, báo rõ cần 370G (250G + 120G bù 1🔌)
      const infoNoPlugShort = sim.getBarnUpgradeCostInfo();
      expect(infoNoPlugShort.hasPlug).toBe(false);
      expect(infoNoPlugShort.baseGoldCost).toBe(250);
      expect(infoNoPlugShort.plugShortageBuyout).toBe(120);
      expect(infoNoPlugShort.effectiveGoldCost).toBe(370);
      expect(infoNoPlugShort.canAfford).toBe(false);
      const failNoPlug = sim.upgradeFarmBarn();
      expect(failNoPlug.ok).toBe(false);
      expect(failNoPlug.msg).toContain('370');

      // Đủ 370G khi không có 🔌 -> nâng thành công, trừ đúng 370G và báo rõ bù 1🔌
      sim.state.galleons = 400;
      expect(sim.getBarnUpgradeCostInfo().canAfford).toBe(true);
      const okBuyout = sim.upgradeFarmBarn();
      expect(okBuyout.ok).toBe(true);
      expect(sim.state.galleons).toBe(30);
      expect(okBuyout.msg).toContain('370');

      // Có sẵn 1🔌 ở bậc tiếp theo (tier 2: baseGoldCost = 160 + 2*90 = 340G) -> trừ đúng 1🔌 và 340G
      barn.goods.muggle_plug_kit = 1;
      sim.state.galleons = 350;
      const infoWithPlug = sim.getBarnUpgradeCostInfo();
      expect(infoWithPlug.hasPlug).toBe(true);
      expect(infoWithPlug.baseGoldCost).toBe(340);
      expect(infoWithPlug.effectiveGoldCost).toBe(340);
      const okWithPlug = sim.upgradeFarmBarn();
      expect(okWithPlug.ok).toBe(true);
      expect(barn.goods.muggle_plug_kit).toBe(0);
      expect(sim.state.galleons).toBe(10);
    });

    it('4. Mọi công thức trong từng xưởng có tên riêng biệt, Toast không lặp đôi emoji và Vạc Phép định dạng thời gian tiếng Việt', () => {
      // 4a. Không có 2 công thức nào trong cùng workshopGroupId trùng tên hiển thị
      const namesByGroup = new Map<string, Set<string>>();
      for (const rec of FARM_WORKSHOP_RECIPES) {
        const displayTitle = rec.name ?? FARM_GOODS[rec.goodId].name;
        const set = namesByGroup.get(rec.workshopGroupId) ?? new Set<string>();
        expect(set.has(displayTitle)).toBe(false);
        set.add(displayTitle);
        namesByGroup.set(rec.workshopGroupId, set);
      }

      // 4b. formatToastMessage khử sạch lặp đôi emoji ở đầu thông báo
      expect(formatToastMessage('🎀 Đã cắt băng khánh thành!', '🎀')).toBe('🎀 Đã cắt băng khánh thành!');
      expect(formatToastMessage('🎀 🎀 Đã cắt băng khánh thành!', '🎀')).toBe('🎀 Đã cắt băng khánh thành!');
      expect(formatToastMessage('🏡 Đã nâng cấp Kho Đỏ!', '🏡')).toBe('🏡 Đã nâng cấp Kho Đỏ!');
      expect(formatToastMessage('🌸 Đã bày lại trang trí!')).toBe('🌸 Đã bày lại trang trí!');
      expect(formatToastMessage('Đã lưu ảnh công viên!', '📸')).toBe('📸 Đã lưu ảnh công viên!');

      // 4c. Vạc Phép thông báo bằng đơn vị giờ/phút dễ hiểu thay vì "3600s" thô
      const sim = new ParkSimulation(createMockAudio());
      sim.state.supply.ingredients.mandrake_leaf = 10;
      sim.state.supply.ingredients.sweet_pumpkin = 10;
      sim.state.supply.ingredients.starlight_dust = 10;
      sim.state.supply.ingredients.magic_cacao = 10;
      const brewRes = sim.startBrewing('aged_butterbeer');
      expect(brewRes.ok).toBe(true);
      expect(brewRes.msg).not.toMatch(/\b3600s\b/);
      expect(brewRes.msg).toContain('1 giờ');
    });
  });
});

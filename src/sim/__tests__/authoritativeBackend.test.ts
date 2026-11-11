import { describe, expect, it } from 'vitest';
import {
  BASE_ECONOMIC_CYCLE_MS,
  BurrowAuthoritativeBackend,
  computeAuthoritativeEconomicDurationMs,
  MemoryBackendKVStore,
  MINIGAME_WIN_REDUCTION_MS,
  vnDayKey,
  vnWeekKey,
} from '../../../server/burrowBackendCore';
import {
  createFirebaseGardenCallables,
  FirestoreBackendStore,
  type FirestoreDbLike,
  resolveBurrowFirestoreDatabaseId,
  resolveHpvnWalletFirestoreDatabaseId,
} from '../../../server/firebaseCallableAdapter';
import { handleAuthoritativeHttpRequest } from '../../../server/index';
import { OnlineBootstrap } from '../../ui/onlineBootstrap';
import {
  attachHpvnParentShellResponder,
  type AuthoritativeError,
  createAtomicGardenStorage,
  createBurrowGardenClient,
  createEmulatorFixtureToken,
  createFirebaseEmulatorClient,
  createHpvnEmbedClient,
  createHttpAuthoritativeClient,
  formatServerRefusalVi,
  getHpvnTicketFromLocation,
  isLocalDevelopmentHost,
} from '../../ui/authoritativeClient';
import {
  auditIos16SourceCompatibility,
  createHpvnBridge,
  createHpvnHostBridge,
  formatFlooShareMessage,
} from '../../ui/hpvnBridge';
import { MagicalAudio } from '../../engine/audio';
import {
  FLOO_VISIT_UNLOCK_LEVEL,
  flooVisitOrder,
  HONOR_GARDENS,
  nextFlooVisit,
  resolveHpvnAvatarSrc,
} from '../neighborSocial';
import { ParkSimulation } from '../simulation';

describe('Authoritative Backend (HPVNN / hagridfarm Architecture)', () => {
  it('computes Vietnam calendar keys (Asia/Ho_Chi_Minh, UTC+7) strictly from server time', () => {
    // 17:30 UTC ngày 18/10/2026 = 00:30 sáng ngày 19/10/2026 tại Việt Nam
    const lateUtc = Date.parse('2026-10-18T17:30:00Z');
    expect(vnDayKey(lateUtc)).toBe('2026-10-19');
    expect(vnWeekKey(lateUtc)).toMatch(/^2026-W\d{2}$/);
  });

  it('retains requestId on lost network response, blocks different mutations, and replays receipt without double-charging', async () => {
    const nowMs = Date.parse('2026-11-11T08:00:00+07:00');
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(() => nowMs),
      now: () => nowMs,
      initialGalleons: 500,
      initialBankGalleons: 300,
    });

    const sentPayloads: Array<{ name: string; data: Record<string, unknown> }> = [];
    let loseFirstBuyResponse = true;

    const client = createBurrowGardenClient(async (name, data) => {
      sentPayloads.push({ name, data: structuredClone(data) });
      const result = await backend.handleCallable(name, data, {
        uid: 'harry_uid',
        house: 'Gryffindor',
        role: 'member',
        authenticatedVia: 'hmac-jwt',
      });
      if (name === 'buyBurrowSupplies' && loseFirstBuyResponse) {
        loseFirstBuyResponse = false;
        // Mô phỏng rớt mạng sau khi server đã commit giao dịch (definitive = undefined/false)
        throw new Error('response lost after server commit');
      }
      return result;
    });

    const initial = await client.read();
    expect(initial.wallet.spendable).toBe(800);
    expect(initial.catalog && initial.catalog.length).toBeGreaterThan(0);

    // Lần 1: Server đã trừ tiền & cộng hạt nhưng rớt mạng trên đường về
    await expect(client.buy('seed_pumpkin', 2)).rejects.toThrow(/response lost/);
    expect(client.hasPendingMutation).toBe(true);

    // Chặn sang lệnh mua món khác khi giao dịch trước chưa rõ kết quả
    await expect(client.buy('water_pack', 1)).rejects.toThrow(/Giao dịch trước chưa có kết quả/);

    // Thử lại đúng lệnh mua Hạt Bí Ngô (x2 = 24 G) -> gửi lại đúng requestId cũ, không trừ tiền lần 2!
    const recovered = await client.buy('seed_pumpkin', 2);
    expect(client.hasPendingMutation).toBe(false);
    expect(recovered.wallet.spendable).toBe(800 - 24);
    expect(recovered.garden.supplies.seeds.pumpkin).toBe(
      initial.garden.supplies.seeds.pumpkin + 6
    );

    const buyCalls = sentPayloads.filter((c) => c.name === 'buyBurrowSupplies');
    expect(buyCalls).toHaveLength(2);
    expect(buyCalls[0].data.requestId).toBe(buyCalls[1].data.requestId);
    expect(buyCalls[0].data.expectedTotal).toBe(24);

    // Sau khi hoàn tất, lệnh mua kế tiếp dùng requestId hoàn toàn mới
    const afterWater = await client.buy('water_pack', 1);
    const lastCall = sentPayloads.at(-1)!;
    expect(lastCall.data.requestId).not.toBe(buyCalls[0].data.requestId);
    expect(afterWater.wallet.spendable).toBe(800 - 24 - 10);

    // Nếu cố tình gửi lại requestId cũ nhưng đổi nội dung lệnh -> bị từ chối request-id-conflict
    await expect(
      backend.handleCallable(
        'buyBurrowSupplies',
        {
          itemId: 'water_pack',
          quantity: 5,
          expectedTotal: 50,
          requestId: buyCalls[0].data.requestId,
        },
        {
          uid: 'harry_uid',
          house: 'Gryffindor',
          role: 'member',
          authenticatedVia: 'hmac-jwt',
        }
      )
    ).rejects.toMatchObject({ reason: 'request-id-conflict' });
  });

  it('omits unchanged catalog when catalogHash matches and enforces expectedRevision across concurrent tabs', async () => {
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(),
    });
    const identity = {
      uid: 'hermione_uid',
      house: 'Gryffindor' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };

    const firstRaw = await backend.handleCallable('getBurrowGarden', {}, identity);
    expect(Array.isArray(firstRaw.catalog)).toBe(true);
    expect(typeof firstRaw.catalogHash).toBe('string');

    // Khi gửi lại catalogHash trùng khớp, server lược bỏ mảng catalog để tiết kiệm băng thông
    const secondRaw = await backend.handleCallable(
      'getBurrowGarden',
      { catalogHash: firstRaw.catalogHash },
      identity
    );
    expect(secondRaw.catalog).toBeUndefined();
    expect(secondRaw.catalogHash).toBe(firstRaw.catalogHash);

    // Mở 2 tab cùng đọc revision 0
    const tabA = createBurrowGardenClient((n, d) => backend.handleCallable(n, d, identity));
    const tabB = createBurrowGardenClient((n, d) => backend.handleCallable(n, d, identity));
    await tabA.read();
    await tabB.read();

    // Tab A gieo hạt -> revision tăng lên 1
    const snapA = await tabA.act({ action: 'plant', species: 'wheat', qty: 1 });
    expect(snapA.garden.progression.revision).toBe(1);
    expect(snapA.catalog).toBeDefined(); // Client tự khôi phục catalog từ bản lưu cục bộ

    // Tab B vẫn giữ expectedRevision = 0 -> bị từ chối revision-conflict
    await expect(tabB.act({ action: 'plant', species: 'wheat', qty: 1 })).rejects.toMatchObject({
      reason: 'revision-conflict',
      definitive: true,
    });

    // Nhưng thao tác miễn phí (freeAction / setScene / guideDone) không bị khóa bởi revision!
    const freeSnap = await tabB.free('pet');
    expect(freeSnap.receipt).toMatchObject({
      freeAction: { kind: 'pet', counted: true, used: 1, cap: 3 },
    });
  });

  it('checks crops first, Magic Stars second, and debits Gringotts bankBalance before pocket balance last', async () => {
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(),
      initialGalleons: 200, // Túi
      initialBankGalleons: 300, // Két sắt Gringotts (Tổng spendable = 500 G)
    });
    const identity = {
      uid: 'ron_uid',
      house: 'Gryffindor' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };

    // 1. Tiệm Kẹo Honeydukes cần 6 Dâu Tây + 6 Bí Ngô + 3 Sao + 750 G -> báo thiếu nông sản TRƯỚC
    let err1: AuthoritativeError | null = null;
    try {
      await backend.handleCallable(
        'performBurrowAction',
        {
          action: 'build',
          blueprintId: 'honeydukes_sweetshop',
          expectedRevision: 0,
          requestId: 'req_build_missing_crops',
        },
        identity
      );
    } catch (e) {
      err1 = e as AuthoritativeError;
    }
    expect(err1?.reason).toBe('missing-crops');
    expect(formatServerRefusalVi(err1).text).toBe('Thiếu 6 Dâu Tây · 4 Bí Ngô');

    // 2. Xưởng Ủ Bia Bơ cần 6 Lúa Mì + 4 Bí Ngô (cấp thêm nông sản đủ, nhưng chỉ có 500 G < 350 G? Không, thử trường hợp nghèo 100 G!)
    const poorBackend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(),
      initialGalleons: 60,
      initialBankGalleons: 40, // spendable = 100 G < 120 G của Lò Bánh Bà Molly
    });
    let err2: AuthoritativeError | null = null;
    try {
      await poorBackend.handleCallable(
        'performBurrowAction',
        {
          action: 'build',
          blueprintId: 'molly_bakery',
          expectedRevision: 0,
          requestId: 'req_build_poor',
        },
        identity
      );
    } catch (e) {
      err2 = e as AuthoritativeError;
    }
    expect(err2?.reason).toBe('insufficient-galleons');
    expect(formatServerRefusalVi(err2).text).toBe('Thiếu 20 G');
    // Sổ cái và kho lúa mì của Ron hoàn toàn nguyên vẹn khi thiếu Galleons!
    const unchanged = await poorBackend.getOrCreateState('ron_uid');
    expect(unchanged.inventory.wheat).toBe(4);
    expect(await poorBackend.getLedger('ron_uid')).toHaveLength(0);

    // 3. Đủ lúa mì, đủ Sao, đủ tiền (200 túi + 300 két sắt = 500 G), xây Lò Bánh Bà Molly giá 120 G:
    // Phải trừ hết 120 G từ `bankBalance` (300 -> 180), túi `balance` giữ nguyên 200 G!
    const built = await backend.handleCallable(
      'performBurrowAction',
      {
        action: 'build',
        blueprintId: 'molly_bakery',
        expectedRevision: 0,
        requestId: 'req_build_ok',
      },
      identity
    );
    const walletAfter = built.wallet as { spendable: number; balance: number; bankBalance: number };
    expect(walletAfter).toEqual({
      spendable: 380,
      balance: 200,
      bankBalance: 180,
      frozen: false,
    });
    const ledger = await backend.getLedger('ron_uid');
    expect(ledger).toHaveLength(1);
    expect(ledger[0]).toMatchObject({
      requestId: 'req_build_ok',
      type: 'debit',
      amount: 120,
      fromBank: 120,
      fromPocket: 0,
      reasonCode: 'garden_build',
    });
  });

  it('enforces 1h -> 2^n economic cycle durations, -10m minigame win reductions, and blocks early clock-spoof harvests', async () => {
    let clockMs = Date.parse('2026-11-11T09:00:00+07:00');
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(() => clockMs),
      now: () => clockMs,
    });
    const identity = {
      uid: 'neville_uid',
      house: 'Hufflepuff' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };

    expect(computeAuthoritativeEconomicDurationMs(0)).toBe(3_600_000); // Lần 1: 1 tiếng
    expect(computeAuthoritativeEconomicDurationMs(1)).toBe(7_200_000); // Lần 2: 2 tiếng
    expect(computeAuthoritativeEconomicDurationMs(2)).toBe(14_400_000); // Lần 3: 4 tiếng

    const client = createBurrowGardenClient((n, d) => backend.handleCallable(n, d, identity));
    await client.read();

    // Lần thu hoạch 1: bắt đầu lúc 09:00 -> chín sau đúng 1 tiếng (10:00)
    const planted1 = await client.act({
      action: 'startEconomicCycle',
      domain: 'crop',
      targetId: 'wheat',
      qty: 2,
      timerId: 'crop_1',
    });
    expect(planted1.receipt?.durationMs).toBe(BASE_ECONOMIC_CYCLE_MS);

    // Tua máy khách gian lận thu hoạch sớm lúc 09:30 -> Server từ chối timer-not-ready!
    clockMs += 30 * 60_000;
    await expect(
      client.act({ action: 'completeEconomicCycle', timerId: 'crop_1' })
    ).rejects.toMatchObject({ reason: 'timer-not-ready' });

    // Thắng 3 màn mini game -> giảm 3 × 10 = 30 phút -> đúng 09:30 thu hoạch thành công!
    for (let s = 1; s <= 3; s++) {
      const clearSnap = await client.act({
        action: 'minigameClear',
        gameId: 'sudoku',
        stage: s,
        score: 1200 + s * 100,
      });
      expect(clearSnap.receipt?.reducedMs).toBe(MINIGAME_WIN_REDUCTION_MS);
    }

    const harvested1 = await client.act({
      action: 'completeEconomicCycle',
      timerId: 'crop_1',
    });
    expect(harvested1.receipt?.harvested).toMatchObject({
      completedCountAfter: 1,
      nextDurationMs: 2 * BASE_ECONOMIC_CYCLE_MS,
    });

    // Lần gieo thứ 2: thời gian tự động nhân đôi thành 2 tiếng (7.200.000 ms)
    const planted2 = await client.act({
      action: 'startEconomicCycle',
      domain: 'crop',
      targetId: 'wheat',
      qty: 1,
      timerId: 'crop_2',
    });
    expect(planted2.receipt?.durationMs).toBe(2 * BASE_ECONOMIC_CYCLE_MS);
  });

  it('enforces strict 5/day friend help cap until Vietnam midnight and delivers helpers notification to host', async () => {
    let clockMs = Date.parse('2026-11-11T23:40:00+07:00');
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(() => clockMs),
      now: () => clockMs,
    });

    // Khởi tạo 6 người bạn thật có cây đang lớn
    for (let i = 1; i <= 6; i++) {
      const fUid = `friend_${i}`;
      await backend.getOrCreateState(fUid, 'Ravenclaw');
      await backend.handleCallable(
        'performBurrowAction',
        {
          action: 'plant',
          species: 'wheat',
          qty: 1,
          expectedRevision: 0,
          requestId: `seed_f_${i}`,
        },
        { uid: fUid, house: 'Ravenclaw', role: 'member', authenticatedVia: 'hmac-jwt' }
      );
    }

    const visitorIdentity = {
      uid: 'molly_helper',
      house: 'Gryffindor' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };
    const visitorClient = createBurrowGardenClient((n, d) =>
      backend.handleCallable(n, d, visitorIdentity)
    );
    await visitorClient.read();

    const listing = await visitorClient.visit({});
    expect(listing.helpsLeft).toBe(5);
    expect((listing.visits as unknown[]).length).toBe(6);

    // Giúp người bạn số 1 thành công
    const help1 = await visitorClient.visit({
      hostUid: 'friend_1',
      help: true,
      kind: 'water_crop',
      noteText: 'Tưới lúa giúp bồ nhé!',
    });
    expect(help1.helpsLeft).toBe(4);

    // Giúp lại đúng người bạn số 1 trong cùng ngày -> bị chặn already-helped
    await expect(
      visitorClient.visit({ hostUid: 'friend_1', help: true })
    ).rejects.toMatchObject({ reason: 'already-helped' });

    // Giúp tiếp bạn 2, 3, 4, 5 -> hết sạch 5/5 lượt trong ngày
    for (let i = 2; i <= 5; i++) {
      const res = await visitorClient.visit({ hostUid: `friend_${i}`, help: true });
      expect(res.helpsLeft).toBe(5 - i);
    }

    // Lượt thứ 6 trong cùng ngày 11/11 -> bị chặn cứng daily-help-cap!
    await expect(
      visitorClient.visit({ hostUid: 'friend_6', help: true })
    ).rejects.toMatchObject({ reason: 'daily-help-cap' });

    // Chủ vườn `friend_1` mở game kiểm tra -> nhận được thông báo `helpers` từ `molly_helper`!
    const host1Snap = await backend.handleCallable('getBurrowGarden', {}, {
      uid: 'friend_1',
      house: 'Ravenclaw',
      role: 'member',
      authenticatedVia: 'hmac-jwt',
    });
    expect((host1Snap.helpers as Array<{ uid: string }>)[0].uid).toBe('molly_helper');

    // Bước qua 00:05 ngày mới 12/11 theo giờ Việt Nam -> tự động mở lại 5 lượt giúp mới!
    clockMs = Date.parse('2026-11-12T00:05:00+07:00');
    const helpNextDay = await visitorClient.visit({ hostUid: 'friend_6', help: true });
    expect(helpNextDay.dayKey).toBe('2026-11-12');
    expect(helpNextDay.helpsLeft).toBe(4);
  });

  it('supports HMAC-SHA256 HTTP Gateway (/api/auth/session + /api/rpc/*), Admin Sales ACP, Firestore Adapter, and HPVN Bridge', async () => {
    const kv = new MemoryBackendKVStore();
    const env = {
      SAVE_KV: kv,
      HMAC_SECRET: 'test-super-secret-hmac',
      ADMIN_TOKEN: 'hph-secret-admin',
      ENVIRONMENT: 'production',
    };

    const customFetch: typeof fetch = async (input, init) => {
      const urlStr = typeof input === 'string' ? input : input.toString();
      const fullUrl = urlStr.startsWith('http') ? urlStr : `https://hangsoc.game${urlStr}`;
      return handleAuthoritativeHttpRequest(new Request(fullUrl, init), env);
    };

    const httpClient = createHttpAuthoritativeClient({
      fetchImpl: customFetch,
      getUid: () => 'luna_lovegood',
    });

    const snap = await httpClient.read();
    expect(snap.uid).toBe('luna_lovegood');

    // Người chơi thường gọi manageBurrowSales mode 'update' -> bị chặn 403 forbidden-admin
    await expect(
      httpClient.sales({ mode: 'update', marketOff: true })
    ).rejects.toMatchObject({ reason: 'forbidden-admin' });

    // Admin có X-Admin-Token bật khóa khẩn cấp `marketOff: true`
    const adminSessionRes = await customFetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': 'albus_admin',
        'X-Admin-Token': 'hph-secret-admin',
      },
      body: JSON.stringify({ uid: 'albus_admin' }),
    });
    const adminSession = (await adminSessionRes.json()) as { token: string };
    const adminUpdateRes = await customFetch('/api/rpc/manageBurrowSales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminSession.token}`,
      },
      body: JSON.stringify({
        data: { mode: 'update', expectedRevision: 0, marketOff: true, discountPercent: 20 },
      }),
    });
    expect(adminUpdateRes.status).toBe(200);

    // Khi marketOff = true, bán nông sản lập tức trả lỗi market-closed
    await expect(httpClient.sell({ wheat: 1 }, 8)).rejects.toMatchObject({
      reason: 'market-closed',
    });

    // Kiểm tra Firestore Adapter + Firebase Callables
    const memDocs = new Map<string, Record<string, unknown>>();
    const fakeFirestore: FirestoreDbLike = {
      collection: (col) => ({
        doc: (id) => ({
          get: async () => ({
            exists: memDocs.has(`${col}/${id}`),
            data: () => memDocs.get(`${col}/${id}`),
          }),
          set: async (d) => {
            memDocs.set(`${col}/${id}`, structuredClone(d));
          },
          delete: async () => {
            memDocs.delete(`${col}/${id}`);
          },
        }),
      }),
    };
    const fbBackend = new BurrowAuthoritativeBackend({
      store: new FirestoreBackendStore(fakeFirestore),
    });
    const callables = createFirebaseGardenCallables(fbBackend);
    const fbSnap = await callables.getBurrowGarden({
      data: {},
      auth: { uid: 'ginny_fb', token: { house: 'Gryffindor' } },
    });
    expect(fbSnap.uid).toBe('ginny_fb');
    expect(memDocs.has('burrow_states/ginny_fb')).toBe(true);

    // Kiểm tra HPVN Host <-> Garden postMessage Bridge & Atomic Storage & iOS 16 Audit
    const hostListeners: Array<(ev: MessageEvent) => void> = [];
    const gardenListeners: Array<(ev: MessageEvent) => void> = [];
    const fakeHostWin = {
      addEventListener: (_t: string, fn: EventListenerOrEventListenerObject) =>
        hostListeners.push(fn as (ev: MessageEvent) => void),
      removeEventListener: () => {},
    };
    const fakeGardenWin = {
      parent: {
        postMessage: (msg: unknown) => {
          for (const fn of hostListeners) fn({ data: msg } as MessageEvent);
        },
      },
      addEventListener: (_t: string, fn: EventListenerOrEventListenerObject) =>
        gardenListeners.push(fn as (ev: MessageEvent) => void),
      removeEventListener: () => {},
    };

    let receivedWeather = '';
    let hostSawFlooText = '';
    const gardenBridge = createHpvnBridge({
      win: fakeGardenWin as unknown as Window,
      onWeatherChange: (w) => {
        receivedWeather = w;
      },
    });
    const hostBridge = createHpvnHostBridge({
      win: fakeHostWin as unknown as Window,
      targetWindow: {
        postMessage: (msg: unknown) => {
          for (const fn of gardenListeners) fn({ data: msg } as MessageEvent);
        },
      },
      onShareFloo: (payload) => {
        hostSawFlooText = String(payload.text || '');
      },
    });

    hostBridge.setWeather('snow');
    expect(receivedWeather).toBe('snow');

    await gardenBridge.shareToFloo({
      parkName: 'Thung Lũng Hang Sóc',
      level: 35,
      magicStars: 48,
      weatherMode: 'snow',
    });
    expect(hostSawFlooText).toContain('Thung Lũng Hang Sóc');
    expect(formatFlooShareMessage({ level: 10, magicStars: 12 })).toContain('Cấp 10');

    const atomic = createAtomicGardenStorage({ scope: 'unit', persistent: false });
    atomic.transaction(() => {
      atomic.setItem('a', '1');
      atomic.setItem('b', '2');
    });
    expect(atomic.getItem('a')).toBe('1');
    expect(auditIos16SourceCompatibility('const x = 1 + 2;').compatible).toBe(true);
  });

  it('supports HPVN #burrow-ticket iframe sandbox RPC, Firebase asia-southeast1 Emulator client, and BigQuery ledger row projection', async () => {
    // 1. Kiểm tra parse vé phiên #burrow-ticket=<nonce> (và fallback #hpvn-ticket)
    expect(getHpvnTicketFromLocation({ hash: '#burrow-ticket=nonce_burrow_456' })).toBe(
      'nonce_burrow_456'
    );
    expect(getHpvnTicketFromLocation({ hash: '#hpvn-ticket=nonce_abc_123' })).toBe('nonce_abc_123');
    expect(getHpvnTicketFromLocation({ hash: '' })).toBeNull();

    // 2. Kiểm tra bảo vệ nguồn gốc cho Firebase Emulator fixtureToken
    expect(isLocalDevelopmentHost('127.0.0.1')).toBe(true);
    expect(isLocalDevelopmentHost('192.168.1.25')).toBe(true);
    expect(isLocalDevelopmentHost('hpvn-archive.net')).toBe(false);
    expect(() =>
      createEmulatorFixtureToken('harry', 'demo-hpvnn-burrow', { hostname: 'hpvn-archive.net' })
    ).toThrow(/localhost\/LAN/);
    expect(() =>
      createFirebaseEmulatorClient({ loc: { hostname: 'hpvn-archive.net' } })
    ).toThrow(/môi trường cục bộ/);

    // 3. Kiểm tra FirestoreBackendStore + BigQuery `burrow_ledger_rows/{txId}` + `burrow_save/{uid}`
    const memDocs = new Map<string, Record<string, unknown>>();
    const fakeFirestore: FirestoreDbLike = {
      collection: (col) => ({
        doc: (id) => ({
          get: async () => ({
            exists: memDocs.has(`${col}/${id}`),
            data: () => memDocs.get(`${col}/${id}`),
          }),
          set: async (d) => {
            memDocs.set(`${col}/${id}`, structuredClone(d));
          },
          delete: async () => {
            memDocs.delete(`${col}/${id}`);
          },
        }),
      }),
    };
    const fsStore = new FirestoreBackendStore(fakeFirestore);
    await fsStore.put('save:neville_uid', JSON.stringify({ version: 3, level: 9 }));
    expect(memDocs.has('burrow_save/neville_uid')).toBe(true);

    const nowMs = Date.parse('2026-11-11T14:00:00+07:00');
    const fbBackend = new BurrowAuthoritativeBackend({
      store: fsStore,
      now: () => nowMs,
    });
    const callables = createFirebaseGardenCallables(fbBackend);

    // 4. Kiểm tra End-to-End `#hpvn-ticket` Iframe Sandbox (`createHpvnEmbedClient` <-> `attachHpvnParentShellResponder`)
    const parentListeners: Array<(ev: MessageEvent) => void> = [];
    const childListeners: Array<(ev: MessageEvent) => void> = [];

    const fakeParentWin = {
      addEventListener: (_type: string, fn: EventListenerOrEventListenerObject) => {
        parentListeners.push(fn as (ev: MessageEvent) => void);
      },
      removeEventListener: (_type: string, fn: EventListenerOrEventListenerObject) => {
        const idx = parentListeners.indexOf(fn as (ev: MessageEvent) => void);
        if (idx >= 0) parentListeners.splice(idx, 1);
      },
      postMessage: (msg: unknown) => {
        for (const fn of [...parentListeners]) {
          fn({ data: msg, source: fakeChildWin as unknown as MessageEventSource } as MessageEvent);
        }
      },
    };

    const fakeChildWin = {
      parent: fakeParentWin,
      addEventListener: (_type: string, fn: EventListenerOrEventListenerObject) => {
        childListeners.push(fn as (ev: MessageEvent) => void);
      },
      removeEventListener: () => {},
      postMessage: (msg: unknown) => {
        for (const fn of [...childListeners]) {
          fn({ data: msg, source: fakeParentWin as unknown as MessageEventSource } as MessageEvent);
        }
      },
    };

    let dropNextBuyReply = true;
    const seenRequestIds: string[] = [];

    const detachParent = attachHpvnParentShellResponder({
      nonce: 'ticket_hpvn_99',
      win: fakeParentWin as unknown as Window,
      expectedSource: fakeChildWin as unknown as MessageEventSource,
      transport: async (callableName, data) => {
        if (callableName === 'buyBurrowSupplies') {
          seenRequestIds.push(String(data.requestId));
        }
        const res = await callables[callableName]({
          data,
          auth: { uid: 'luna_hpvn', token: { house: 'Ravenclaw' } },
        });
        if (callableName === 'buyBurrowSupplies' && dropNextBuyReply) {
          dropNextBuyReply = false;
          const netErr = new Error('Mất kết nối tạm thời với cổng HPVN') as AuthoritativeError;
          netErr.definitive = false;
          throw netErr;
        }
        return res;
      },
    });

    const embedClient = createHpvnEmbedClient('ticket_hpvn_99', fakeChildWin as unknown as Window);
    const firstSnap = await embedClient.read();
    expect(firstSnap.uid).toBe('luna_hpvn');
    expect(firstSnap.catalog?.length).toBeGreaterThan(0);

    // Giao dịch mua hạt lần 1 bị rớt phản hồi (`definitive: false`) -> giữ nguyên `requestId`
    await expect(embedClient.buy('seed_wheat', 2)).rejects.toThrow(/Mất kết nối/);
    expect(embedClient.hasPendingMutation).toBe(true);

    // Thử lại đúng giao dịch mua đó -> gửi lại cùng `requestId`, không bị trừ tiền 2 lần!
    const afterBuy = await embedClient.buy('seed_wheat', 2);
    expect(seenRequestIds).toHaveLength(2);
    expect(seenRequestIds[0]).toBe(seenRequestIds[1]);
    expect(afterBuy.wallet.spendable).toBe(firstSnap.wallet.spendable - 12);

    // Kiểm tra dòng BigQuery `galleons_ledger_rows/{txId}` của Ví Gringotts HPVN đã được ghi phẳng chuẩn snake_case!
    const bqRows = [...memDocs.entries()].filter(([k]) => k.startsWith('galleons_ledger_rows/'));
    expect(bqRows).toHaveLength(1);
    expect(bqRows[0][1]).toMatchObject({
      uid: 'luna_hpvn',
      direction: 'debit',
      amount: 12,
      from_bank: 12,
      from_pocket: 0,
      source_type: 'burrow-garden-store',
    });

    detachParent();

    // 5. Kiểm tra `createFirebaseEmulatorClient` gọi đường dẫn `/demo-hpvnn-burrow/asia-southeast1/getBurrowGarden`
    const emulatorEnv = {
      SAVE_KV: fsStore,
      ENVIRONMENT: 'development',
    };
    const seenEmuUrls: string[] = [];
    const fakeEmulatorFetch: typeof fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      seenEmuUrls.push(url);
      return handleAuthoritativeHttpRequest(new Request(url, init), emulatorEnv, () => nowMs);
    };

    const emuClient = createFirebaseEmulatorClient({
      projectId: 'demo-hpvnn-burrow',
      region: 'asia-southeast1',
      port: 5001,
      uid: 'cedric_emu',
      loc: { hostname: '127.0.0.1' },
      now: () => nowMs,
      fetchImpl: fakeEmulatorFetch,
    });

    const emuSnap = await emuClient.read();
    expect(emuSnap.uid).toBe('cedric_emu');
    expect(seenEmuUrls[0]).toBe(
      'http://127.0.0.1:5001/demo-hpvnn-burrow/asia-southeast1/getBurrowGarden'
    );
    const emuBought = await emuClient.buy('water_pack', 1);
    expect(emuBought.garden.supplies.water).toBeGreaterThan(emuSnap.garden.supplies.water);
    expect(seenEmuUrls[1]).toBe(
      'http://127.0.0.1:5001/demo-hpvnn-burrow/asia-southeast1/buyBurrowSupplies'
    );
  });

  it('implements Hagrid’s Garden 4 social pillars: HPVN identity & avatar normalization, Level 1 Honor Gardens, Postcard Floo invite, and smart Floo Portal queue', async () => {
    // 1. Chuẩn hóa URL avatar diễn đàn HPVN (Storage hpvnn-archive & /forum-images -> /media/...)
    expect(
      resolveHpvnAvatarSrc(
        'https://firebasestorage.googleapis.com/v0/b/hpvnn-archive.appspot.com/o/forum-images%2Favatars%2Fharry_99.webp?alt=media&token=abc',
        'https://hpvn.net'
      )
    ).toBe('https://hpvn.net/media/forum-images%2Favatars%2Fharry_99.webp?alt=media&token=abc');
    expect(resolveHpvnAvatarSrc('/forum-images/avatars/hermione.png', 'https://hpvn.net')).toBe(
      'https://hpvn.net/media/archive-media%2Fv1%2Fforum-images%2Favatars%2Fhermione.png?alt=media'
    );
    expect(resolveHpvnAvatarSrc('javascript:alert(1)')).toBe('');

    // 2. Sắp xếp hàng đợi Cổng Bay Floo thông minh (ưu tiên vườn chưa giúp đang cháy / có nhiều mẻ đang lớn)
    const nowMs = Date.parse('2026-11-11T10:00:00+07:00');
    const rawRows = [
      {
        uid: 'u_idle',
        username: 'Idle Witch',
        parkName: 'Vườn Tĩnh',
        house: 'Ravenclaw' as const,
        level: 14,
        growing: 0,
        helped: false,
        hostHelpsLeft: 10,
      },
      {
        uid: 'u_helped',
        username: 'Helped Wizard',
        parkName: 'Vườn Đã Chăm',
        house: 'Hufflepuff' as const,
        level: 25,
        growing: 5,
        helped: true,
        hostHelpsLeft: 8,
      },
      {
        uid: 'u_growing_2',
        username: 'Minh Anh',
        parkName: 'Đồi Táo',
        house: 'Hufflepuff' as const,
        level: 19,
        growing: 2,
        helped: false,
        hostHelpsLeft: 10,
      },
      {
        uid: 'u_fire',
        username: 'Hoàng Long',
        parkName: 'Lò Luyện Rồng',
        house: 'Gryffindor' as const,
        level: 31,
        growing: 1,
        helped: false,
        hostHelpsLeft: 10,
        fire: { mode: 'wildfire', since: nowMs - 60_000, until: nowMs + 600_000 },
      },
      {
        uid: 'u_growing_4',
        username: 'Khánh Linh',
        parkName: ' Vườn Trăng',
        house: 'Ravenclaw' as const,
        level: 26,
        growing: 4,
        helped: false,
        hostHelpsLeft: 9,
      },
    ];
    const ordered = flooVisitOrder(rawRows, nowMs);
    expect(ordered.map((r) => r.uid)).toEqual([
      'u_fire',
      'u_growing_4',
      'u_growing_2',
      'u_idle',
      'u_helped',
    ]);
    // Từ u_growing_4 bấm "Vườn tiếp" -> sang u_growing_2 (ưu tiên thung lũng còn có thể chăm giúp)
    expect(nextFlooVisit(ordered, 'u_growing_4', 1, nowMs)?.uid).toBe('u_growing_2');

    // 3. Vườn Mẫu Danh Dự Hogwarts (mở sẵn ngay từ Cấp 1, khóa thời tiết theo chủ vườn & không rác danh sách bạn)
    expect(FLOO_VISIT_UNLOCK_LEVEL).toBe(10);
    expect(HONOR_GARDENS.length).toBeGreaterThanOrEqual(5);

    const sim = new ParkSimulation(new MagicalAudio());
    expect(sim.state.level).toBe(1);
    sim.state.settings.weatherOverride = 'clear';
    sim.state.settings.timeOverride = 'day';
    const goldBeforeTour = sim.state.galleons;

    const enterTour = sim.enterHonorGardenTour('tour_luna');
    expect(enterTour.ok).toBe(true);
    expect(sim.isVisitingHonorTour).toBe(true);
    expect(sim.getActiveHonorGardenTour()?.id).toBe('tour_luna');
    // Khóa bầu không khí đêm sương huyền ảo theo Vườn Mẫu Luna nhưng không ghi đè vĩnh viễn cài đặt vườn nhà
    expect(sim.state.settings.weatherOverride).toBe('fog');
    expect(sim.state.settings.timeOverride).toBe('night');
    // Nhận quà cảm hứng đầu ngày +8G và danh sách bạn thực vẫn sạch 0 NPC
    expect(sim.state.galleons).toBe(goldBeforeTour + 8);
    expect(sim.ensureNeighborSocial().neighbors).toHaveLength(0);

    const cycleRes = sim.cycleHonorGardenTour(1);
    expect(cycleRes.ok).toBe(true);
    expect(sim.getActiveHonorGardenTour()?.id).not.toBe('tour_luna');

    sim.exitNeighborVisit();
    expect(sim.isVisitingNeighbor).toBe(false);
    expect(sim.state.settings.weatherOverride).toBe('clear');
    expect(sim.state.settings.timeOverride).toBe('day');

    // 4. Định danh thành viên HPVN tự động (`syncProfile` -> `visit({})`) & chăm giúp 1 chạm giới hạn 5 lượt/ngày
    const backend = new BurrowAuthoritativeBackend({
      store: new MemoryBackendKVStore(() => nowMs),
      now: () => nowMs,
    });

    const hostClient = createBurrowGardenClient((n, d) =>
      backend.handleCallable(n, d, {
        uid: 'khanh_linh_hpvn',
        username: 'Khánh Linh',
        avatarUrl: '/forum-images/avatars/linh.webp',
        house: 'Ravenclaw',
        role: 'member',
        authenticatedVia: 'hmac-jwt',
      })
    );
    await hostClient.read();
    await hostClient.syncProfile({
      playerName: 'Khánh Linh',
      parkName: 'Thung Lũng Đom Đóm',
      level: 22,
      house: 'Ravenclaw',
      scene: { weather: 'fireflies', atmosphere: 'night', event: 'harvest_feast' },
    });
    await hostClient.act({ action: 'plant', species: 'wheat', qty: 1 });

    const visitorClient = createBurrowGardenClient((n, d) =>
      backend.handleCallable(n, d, {
        uid: 'harry_visitor',
        username: 'Harry HPVN',
        house: 'Gryffindor',
        role: 'member',
        authenticatedVia: 'hmac-jwt',
      })
    );
    await visitorClient.read();
    const dir = await visitorClient.visit({});
    expect(dir.visitLevel).toBe(10);
    const linhRow = (dir.visits as Array<Record<string, unknown>>).find(
      (r) => r.uid === 'khanh_linh_hpvn'
    );
    expect(linhRow).toBeTruthy();
    expect(linhRow?.avatarUrl).toBe('/forum-images/avatars/linh.webp');
    expect(resolveHpvnAvatarSrc(String(linhRow?.avatarUrl), 'https://hpvn.net')).toContain(
      'https://hpvn.net/media/'
    );
    expect(linhRow?.hostHelpsLeft).toBe(10);
    expect(Number(linhRow?.growing)).toBeGreaterThanOrEqual(1);

    // Đồng bộ tự động thành viên HPVN từ Cổng Floo vào client (không cần mã kết bạn!)
    const syncedNeighbors = sim.syncFlooDirectoryMembers(
      dir.visits as Parameters<typeof sim.syncFlooDirectoryMembers>[0],
      'harry_visitor'
    );
    expect(syncedNeighbors).toHaveLength(1);
    expect(syncedNeighbors[0].remoteUserId).toBe('khanh_linh_hpvn');
    expect(syncedNeighbors[0].avatarUrl).toBe('/forum-images/avatars/linh.webp');

    const enterMember = sim.enterNeighborVisit(syncedNeighbors[0].id);
    expect(enterMember.ok).toBe(true);
    expect(sim.state.settings.weatherOverride).toBe('fireflies');

    const helpWhole = sim.helpVisitedFlooMemberWholeGarden({ serverHelpsLeft: 4 });
    expect(helpWhole.ok).toBe(true);
    expect(helpWhole.helpsLeft).toBe(4);

    // Đã chăm giúp vườn này hôm nay -> bấm lần 2 từ chối
    expect(sim.helpVisitedFlooMemberWholeGarden().ok).toBe(false);
    sim.exitNeighborVisit();

    // 5. Khoe Vườn & Rủ Bạn Trên Mạng Floo kèm ảnh Bưu Thiếp WebP + deep-link tourId
    const sentPayloads: Array<{ text: string; image?: string; tourId?: string }> = [];
    const bridge = createHpvnBridge({});
    const shareRes = await bridge.shareToFloo({
      parkName: 'Trang Trại Hang Sóc',
      playerName: 'Harry HPVN',
      level: 15,
      house: 'Gryffindor',
      magicStars: 42,
      buildingsCount: 18,
      tourId: 'harry_visitor',
      image: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
      sendToFloo: (text, ctx) => {
        sentPayloads.push({ text, image: ctx.image, tourId: ctx.tourId });
        return true;
      },
    });
    expect(shareRes.ok).toBe(true);
    expect(sentPayloads).toHaveLength(1);
    expect(sentPayloads[0].tourId).toBe('harry_visitor');
    expect(sentPayloads[0].image).toMatch(/^data:image\/webp/);
    expect(sentPayloads[0].text).toContain('Harry HPVN');

    const flooBonus1 = sim.recordFlooShareOrPostcard('shareFloo');
    expect(flooBonus1.rewarded).toBe(true);
    const flooBonus2 = sim.recordFlooShareOrPostcard('shareFloo');
    expect(flooBonus2.rewarded).toBe(false);
    bridge.destroy();
  });

  it('connects to HPVN shared Gringotts wallet on (default) DB while isolating 100% of Hang Sóc farm state on burrow-game DB without touching Hagrid Farm', async () => {
    const defaultDbDocs = new Map<string, Record<string, unknown>>();
    const burrowDbDocs = new Map<string, Record<string, unknown>>();

    // Trên DB `(default)` của `hpvnn-archive`: có Ví Gringotts thật của diễn đàn HPVN (kèm các trường riêng của forum)
    // VÀ có dữ liệu nông trại Hagrid Farm đang chạy song song
    const hagridUntouchedDocs: Record<string, Record<string, unknown>> = {
      'garden_states/harry_shared_uid': { uid: 'harry_shared_uid', level: 44, game: 'hagridfarm' },
      'garden_daily/harry_shared_uid_2026-11-11': { uid: 'harry_shared_uid', helpsGivenCount: 4 },
      'galleons_ledger/harry_shared_uid': { __rawJson: '[{"txId":"hg_1"}]' },
      'galleons_config/garden': { revision: 7, discountPercent: 15 },
      'garden_meta/visit_directory': { __rawJson: '[{"uid":"harry_shared_uid"}]' },
      'house_cup/2026-W46': { weekKey: '2026-W46', houses: { Gryffindor: 8888 } },
      'friend_directory/HS-HARRY-01': { userId: 'hagrid_other_owner' },
      'minigame_leaderboards/match3': { __rawJson: '[{"userId":"hagrid_champ"}]' },
    };
    for (const [docPath, payload] of Object.entries(hagridUntouchedDocs)) {
      defaultDbDocs.set(docPath, structuredClone(payload));
    }
    // Tài khoản ví Gringotts dùng chung trên diễn đàn HPVN (`galleons_accounts/{uid}`)
    defaultDbDocs.set('galleons_accounts/harry_shared_uid', {
      uid: 'harry_shared_uid',
      balance: 9999,
      bankBalance: 5000,
      vaultTier: 'gold',
      forumRank: 'Prefect',
    });

    const makeMockDb = (backing: Map<string, Record<string, unknown>>): FirestoreDbLike => ({
      collection: (col) => ({
        doc: (id) => ({
          get: async () => ({
            exists: backing.has(`${col}/${id}`),
            data: () =>
              backing.has(`${col}/${id}`) ? structuredClone(backing.get(`${col}/${id}`)) : undefined,
          }),
          set: async (d) => {
            backing.set(`${col}/${id}`, structuredClone(d));
          },
          delete: async () => {
            backing.delete(`${col}/${id}`);
          },
        }),
      }),
      runTransaction: async (fn) =>
        fn({
          get: async (ref) => ref.get(),
          set: (ref, d) => {
            void ref.set(d);
          },
          delete: (ref) => {
            void ref.delete();
          },
        }),
    });

    expect(resolveBurrowFirestoreDatabaseId(undefined)).toBe('burrow-game');
    expect(resolveHpvnWalletFirestoreDatabaseId(undefined)).toBeUndefined();

    const hpvnDefaultDb = makeMockDb(defaultDbDocs);
    const burrowGameDb = makeMockDb(burrowDbDocs);

    const nowMs = Date.parse('2026-11-11T15:30:00+07:00');
    const fsStore = new FirestoreBackendStore(burrowGameDb, {
      walletDb: hpvnDefaultDb,
    });
    const backend = new BurrowAuthoritativeBackend({
      store: fsStore,
      now: () => nowMs,
      initialGalleons: 0,
      initialBankGalleons: 0,
    });
    const callables = createFirebaseGardenCallables(backend);

    // 1. Không xuất bất kỳ Callable nào mang tên Hagrid; gọi nhầm trả 404 unknown-callable
    expect(Object.keys(callables).some((name) => /hagrid/i.test(name))).toBe(false);
    await expect(
      backend.handleCallable(
        'getHagridGarden',
        {},
        {
          uid: 'harry_shared_uid',
          house: 'Gryffindor',
          role: 'member',
          authenticatedVia: 'firebase-id-token',
        }
      )
    ).rejects.toMatchObject({ reason: 'unknown-callable', httpStatus: 404 });

    // 2. Mở game (`getBurrowGarden`): đọc trực tiếp số dư Ví Gringotts HPVN `9999 + 5000 = 14.999 G`
    const snap = await callables.getBurrowGarden({
      data: {},
      auth: { uid: 'harry_shared_uid', token: { house: 'Gryffindor' } },
    });
    expect(snap.uid).toBe('harry_shared_uid');
    expect((snap.wallet as { spendable: number }).spendable).toBe(14999);

    // 3. Mua vật tư cửa hàng (`buyBurrowSupplies`: -6 G) -> trừ từ két sắt `bankBalance` (5000 -> 4994) trên `hpvnDefaultDb`,
    //    giữ nguyên 100% trường mở rộng `vaultTier: 'gold'` & `forumRank: 'Prefect'` của diễn đàn HPVN!
    const afterStoreBuy = await callables.buyBurrowSupplies({
      data: {
        itemId: 'seed_wheat',
        quantity: 1,
        expectedTotal: 6,
        requestId: 'iso_buy_1',
        expectedRevision: 0,
      },
      auth: { uid: 'harry_shared_uid', token: { house: 'Gryffindor' } },
    });
    expect((afterStoreBuy.wallet as { spendable: number }).spendable).toBe(14993);
    expect(defaultDbDocs.get('galleons_accounts/harry_shared_uid')).toMatchObject({
      uid: 'harry_shared_uid',
      balance: 9999,
      bankBalance: 4994,
      spendable: 14993,
      vaultTier: 'gold',
      forumRank: 'Prefect',
    });

    // 4. Liên kết trực tiếp `ParkSimulation` <-> `OnlineBootstrap.bindSimulationGringottsWallet`:
    //    - Mua hạt lúa mì Ottery (`-220 G`) và bán 2 Bánh Táo Quế Bà Molly (`+32 G`) tự động quyết toán qua `settleBurrowWallet`!
    const sim = new ParkSimulation(new MagicalAudio());
    const client = createBurrowGardenClient((name, data) =>
      callables[name]({
        data,
        auth: { uid: 'harry_shared_uid', token: { house: 'Gryffindor' } },
      })
    );
    const bootstrap = new OnlineBootstrap();
    (bootstrap as unknown as { authoritativeClient: typeof client }).authoritativeClient = client;

    const bootSnap = await client.read();
    bootstrap.syncWalletBaseline(bootSnap.wallet.spendable);
    sim.state.galleons = bootSnap.wallet.spendable;

    const unbindWallet = bootstrap.bindSimulationGringottsWallet(sim, { debounceMs: 0 });
    expect(sim.state.galleons).toBe(14993);

    // Mua 1 hạt Lúa Mì Vàng Ottery (-220 G) -> trừ tiếp két sắt `bankBalance` (4994 -> 4774)
    const buySeedRes = sim.buyCropSeedWithGold('ottery_wheat', 1);
    expect(buySeedRes.ok).toBe(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(sim.state.galleons).toBe(14773);
    expect(defaultDbDocs.get('galleons_accounts/harry_shared_uid')).toMatchObject({
      balance: 9999,
      bankBalance: 4774,
      spendable: 14773,
      vaultTier: 'gold',
    });

    // Bán 2 Bánh Táo Quế Bà Molly (+32 G) -> cộng vào túi `balance` (9999 -> 10031), tổng `spendable = 14805`
    sim.ensureFarmBarn().goods.cinnamon_apple_pie = 2;
    const sellBarnRes = sim.sellFarmItemFromBarn('cinnamon_apple_pie', 2);
    expect(sellBarnRes.ok).toBe(true);
    await new Promise((r) => setTimeout(r, 20));
    expect(sim.state.galleons).toBe(14805);
    expect(defaultDbDocs.get('galleons_accounts/harry_shared_uid')).toMatchObject({
      balance: 10031,
      bankBalance: 4774,
      spendable: 14805,
    });
    unbindWallet();

    // Sổ cái kiểm toán BigQuery trên `hpvnDefaultDb` ghi nhận rõ `source_type` của Hang Sóc (`burrow-garden-*`)
    const ledgerRowKeys = [...defaultDbDocs.keys()].filter((k) =>
      k.startsWith('galleons_ledger_rows/')
    );
    expect(ledgerRowKeys.length).toBe(3);
    for (const lk of ledgerRowKeys) {
      const row = defaultDbDocs.get(lk);
      expect(String(row?.source_type)).toMatch(/^burrow-garden-/);
    }

    // 5. Đóng góp Cúp Nhà, Cloud Save & BXH đều nằm hoàn toàn trên `burrowGameDb` (`burrow_*`)
    await callables.contributeBurrowHouseCup({
      data: { points: 10, house: 'Gryffindor' },
      auth: { uid: 'harry_shared_uid', token: { house: 'Gryffindor' } },
    });

    const httpEnv = { SAVE_KV: fsStore, ENVIRONMENT: 'development' };
    const saveRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'harry_shared_uid' },
        body: JSON.stringify({
          version: 3,
          level: 12,
          parkName: 'Hang Sóc Độc Lập',
          neighborSocial: { playerFriendCode: 'HS-HARRY-01' },
        }),
      }),
      httpEnv,
      () => nowMs
    );
    expect(saveRes.status).toBe(200);

    const lbRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'harry_shared_uid' },
        body: JSON.stringify({
          gameId: 'match3',
          entry: {
            userId: 'harry_shared_uid',
            name: 'Harry Burrow',
            friendCode: 'HS-HARRY-01',
            house: 'Gryffindor',
            primaryValue: 88,
            ratingScore: 2400,
          },
        }),
      }),
      httpEnv,
      () => nowMs
    );
    expect(lbRes.status).toBe(200);

    expect(burrowDbDocs.size).toBeGreaterThanOrEqual(7);
    for (const path of burrowDbDocs.keys()) {
      expect(path.split('/')[0].startsWith('burrow_')).toBe(true);
    }

    // 6. Toàn bộ dữ liệu nông trại Hagrid Farm trên `hpvnDefaultDb` vẫn nguyên vẹn 100%, không hề bị đụng chạm!
    for (const [docPath, expectedPayload] of Object.entries(hagridUntouchedDocs)) {
      expect(defaultDbDocs.get(docPath)).toEqual(expectedPayload);
    }
    const unexpectedDefaultCols = [...defaultDbDocs.keys()].filter(
      (k) =>
        !(k in hagridUntouchedDocs) &&
        !k.startsWith('galleons_accounts/') &&
        !k.startsWith('galleons_ledger_rows/')
    );
    expect(unexpectedDefaultCols).toEqual([]);

    // 7. Cầu nối iframe `createHpvnHostBridge` phớt lờ hoàn toàn gói tin `hpvn-hagrid-garden` từ iframe Hagrid Farm
    const hostListeners: Array<(ev: MessageEvent) => void> = [];
    let burrowStateCount = 0;
    createHpvnHostBridge({
      allowAnyOrigin: true,
      win: {
        addEventListener: (_t: string, fn: EventListenerOrEventListenerObject) =>
          hostListeners.push(fn as (ev: MessageEvent) => void),
        removeEventListener: () => {},
      },
      onStateSync: () => {
        burrowStateCount += 1;
      },
    });
    for (const fn of hostListeners) {
      fn({
        data: { source: 'hpvn-hagrid-garden', type: 'hpvn:garden:state', payload: { level: 99 } },
      } as MessageEvent);
    }
    expect(burrowStateCount).toBe(0);
    for (const fn of hostListeners) {
      fn({
        data: { source: 'hpvn-burrow-garden', type: 'hpvn:burrow:state', payload: { level: 12 } },
      } as MessageEvent);
    }
    expect(burrowStateCount).toBe(1);
  });

  it('caps authoritative economic cycle at 6h (21,600,000ms), syncs ParkSimulation growing timers on /api/save for Floo friend help, and bounds settleWallet clientLevel', async () => {
    const nowMs = Date.parse('2026-11-12T10:00:00+07:00');
    expect(computeAuthoritativeEconomicDurationMs(3)).toBe(21_600_000);
    expect(computeAuthoritativeEconomicDurationMs(20)).toBe(21_600_000);

    const store = new MemoryBackendKVStore(() => nowMs);
    const backend = new BurrowAuthoritativeBackend({
      store,
      now: () => nowMs,
    });

    const hostState = await backend.getOrCreateState('host_real_uid', 'Hufflepuff');
    const hostDaily = await backend.getOrCreateDaily('host_real_uid');
    backend.reconcileClientSaveIntoState(
      {
        parkName: 'Vườn Bí Nhà Weasley',
        level: 14,
        xp: 450,
        match3: { stars: 48 },
        buildings: [
          {
            uid: 'plot_wheat_01',
            itemId: 'farmland_plot',
            cropId: 'ottery_wheat',
            cropPlantedAt: nowMs - 600_000,
            cropReadyAt: nowMs + 3_000_000,
          },
          {
            uid: 'bakery_01',
            itemId: 'molly_apple_bakery',
            workshopQueue: [
              {
                goodId: 'cinnamon_apple_pie',
                startedAt: nowMs - 300_000,
                endsAt: nowMs + 2_400_000,
              },
            ],
          },
        ],
      },
      hostState,
      hostDaily
    );
    expect(hostState.magicStars).toBe(48);
    expect(hostState.timers).toHaveLength(2);
    await store.put('burrow_states:host_real_uid', JSON.stringify(hostState));
    await backend.syncVisitDirectoryForState(hostState);

    // Bạn thật mở danh bạ Floo thấy đúng `growing: 2` và chăm giúp thành công (-15 phút + ghi nhận buildingUid)!
    const visitorId = {
      uid: 'visitor_real_uid',
      house: 'Gryffindor' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };
    const listRes = await backend.handleCallable('visitBurrowGarden', {}, visitorId);
    const hostRow = (listRes.visits as Array<{ uid: string; growing: number }>).find(
      (r) => r.uid === 'host_real_uid'
    );
    expect(hostRow?.growing).toBe(2);

    const helpRes = await backend.handleCallable(
      'visitBurrowGarden',
      { hostUid: 'host_real_uid', help: true, requireGrowing: true },
      visitorId
    );
    expect(helpRes.reward).toBeDefined();
    const helpers = await backend.getHelpersForHost('host_real_uid', hostDaily.dayKey);
    expect(helpers).toHaveLength(1);
    expect(helpers[0].buildingUid).toBe('plot_wheat_01');

    // Tài khoản Lv.1 giả mạo `clientLevel: 100` vẫn bị giới hạn bởi trần Lv.1 (`dailyCapGalleons = 2500G` thay vì `5000G`)
    const lv1Id = {
      uid: 'lv1_spoofer',
      house: 'Slytherin' as const,
      role: 'member' as const,
      authenticatedVia: 'hmac-jwt' as const,
    };
    await backend.handleCallable(
      'settleBurrowWallet',
      {
        direction: 'credit',
        amount: 1000,
        clientLevel: 100,
        requestId: 'settle_spoof_1',
      },
      lv1Id
    );
    await backend.handleCallable(
      'settleBurrowWallet',
      {
        direction: 'credit',
        amount: 1000,
        clientLevel: 100,
        requestId: 'settle_spoof_2',
      },
      lv1Id
    );
    await expect(
      backend.handleCallable(
        'settleBurrowWallet',
        {
          direction: 'credit',
          amount: 600,
          clientLevel: 100,
          requestId: 'settle_spoof_3',
        },
        lv1Id
      )
    ).rejects.toMatchObject({ reason: 'daily-cap' });
  });
});

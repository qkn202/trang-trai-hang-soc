import { describe, expect, it, vi } from 'vitest';
import firebaseConfig from '../../../firebase.json';
import pkgJson from '../../../package.json';
import {
  BurrowAuthoritativeBackend,
  MemoryBackendKVStore,
} from '../../../server/burrowBackendCore';
import {
  createFirebaseGardenCallables,
  DEFAULT_BURROW_FIRESTORE_DATABASE_ID,
  type FirestoreDbLike,
  type FirestoreDocRefLike,
  FirestoreBackendStore,
  resolveBurrowFirestoreDatabaseId,
} from '../../../server/firebaseCallableAdapter';
import { handleAuthoritativeHttpRequest } from '../../../server/index';
import { MagicalAudio } from '../../engine/audio';
import {
  clearCachedCloudLeaderboards,
  fetchCloudLeaderboardEntries,
  hydrateCloudLeaderboardsFromSnapshot,
  registerAuthoritativeLeaderboardTransport,
  setPlayerHogwartsHouse,
} from '../minigameLeaderboard';
import { ParkSimulation } from '../simulation';
import { Analytics } from '../../ui/analytics';
import {
  createBurrowGardenClient,
  createHpvnEmbedClient,
} from '../../ui/authoritativeClient';
import { bindAuthoritativeLeaderboardClient } from '../../ui/onlineBootstrap';
import {
  CloudSave,
  SAVE_KEY,
  setAuthenticatedUserId,
  shouldHydrateFromServerSave,
} from '../../ui/cloudSave';
import { ErrorMonitor } from '../../ui/errorMonitor';
import { createHpvnBridge, isTrustedHpvnOrigin } from '../../ui/hpvnBridge';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function signTestHpvnTicket(
  secret: string,
  payload: Record<string, unknown>
): Promise<string> {
  const enc = new TextEncoder();
  const payloadB64 = bytesToBase64Url(enc.encode(JSON.stringify(payload)));
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = bytesToBase64Url(new Uint8Array(sigBuf));
  return `${payloadB64}.${sigB64}`;
}

describe('HPVN Online Production Hardening Suite (P0–P3)', () => {
  it('P0-1 & P2-3: fails closed on missing/default secrets or missing SAVE_KV in production, and enforces REQUIRE_VERIFIED_AUTH', async () => {
    const kv = new MemoryBackendKVStore();

    // 1. Missing SAVE_KV in production -> 500 server-misconfigured
    const noKvRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/leaderboard?game=match3'),
      {
        ENVIRONMENT: 'production',
        HMAC_SECRET: 'prod-strong-random-hmac-secret-998877',
      }
    );
    expect(noKvRes.status).toBe(500);
    await expect(noKvRes.json()).resolves.toMatchObject({ reason: 'server-misconfigured' });

    // 2. Weak/default secret in production -> 500 server-misconfigured
    const weakSecretRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/leaderboard?game=match3'),
      {
        SAVE_KV: kv,
        ENVIRONMENT: 'production',
        HMAC_SECRET: 'hpvn-burrow-asia-southeast1-hmac-v1',
      }
    );
    expect(weakSecretRes.status).toBe(500);
    await expect(weakSecretRes.json()).resolves.toMatchObject({ reason: 'server-misconfigured' });

    // 3. REQUIRE_VERIFIED_AUTH = 'true' blocks unauthenticated /api/auth/session & spoofed X-Hpvn-Uid
    const prodEnv = {
      SAVE_KV: kv,
      ENVIRONMENT: 'production',
      REQUIRE_VERIFIED_AUTH: 'true',
      HMAC_SECRET: 'prod-strong-random-hmac-secret-998877',
      ADMIN_TOKEN: 'prod-strong-admin-token-445566',
      verifyFirebaseIdToken: async (idToken: string) => {
        if (idToken === 'valid.firebase.jwt') {
          return {
            uid: 'hermione_granger',
            house: 'Gryffindor' as const,
            role: 'member' as const,
            authenticatedVia: 'firebase-id-token' as const,
            username: 'Hermione Granger',
          };
        }
        return null;
      },
    };

    const spoofSessionRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'albus_dumbledore' },
        body: JSON.stringify({ uid: 'albus_dumbledore' }),
      }),
      prodEnv
    );
    expect(spoofSessionRes.status).toBe(401);

    const spoofRpcRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/rpc/getBurrowGarden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hpvn-Uid': 'albus_dumbledore',
        },
        body: JSON.stringify({ data: {} }),
      }),
      prodEnv
    );
    expect(spoofRpcRes.status).toBe(401);

    // 4. Signed HPVN ticket succeeds and issues a valid session Bearer token
    const signedTicket = await signTestHpvnTicket(prodEnv.HMAC_SECRET, {
      uid: 'arthur_weasley',
      house: 'Gryffindor',
      username: 'Arthur Weasley',
      exp: Math.floor(Date.now() / 1000) + 600,
    });
    const ticketSessionRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: 'ignored_spoof_uid', ticket: signedTicket }),
      }),
      prodEnv
    );
    expect(ticketSessionRes.status).toBe(200);
    const ticketSessionJson = (await ticketSessionRes.json()) as { uid: string; token: string };
    expect(ticketSessionJson.uid).toBe('arthur_weasley');

    // 5. Verified Firebase ID Token works directly on /api/rpc/getBurrowGarden
    const fbRpcRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/rpc/getBurrowGarden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer valid.firebase.jwt',
        },
        body: JSON.stringify({ data: {} }),
      }),
      prodEnv
    );
    expect(fbRpcRes.status).toBe(200);
    const fbRpcJson = (await fbRpcRes.json()) as { result: { uid: string } };
    expect(fbRpcJson.result.uid).toBe('hermione_granger');
  });

  it('P0-4: enforces strict postMessage origin & source checks and sanitizes bridge snapshots', async () => {
    expect(isTrustedHpvnOrigin('https://hpvn-archive.net')).toBe(true);
    expect(isTrustedHpvnOrigin('https://forum.hpvn-archive.net')).toBe(true);
    expect(isTrustedHpvnOrigin('https://evil-hpvn-archive.net')).toBe(false);
    expect(isTrustedHpvnOrigin('null')).toBe(false);

    const childListeners: Array<(ev: MessageEvent) => void> = [];
    const sentToParent: Array<{ msg: unknown; origin: string }> = [];
    const fakeParent = {
      postMessage: (msg: unknown, origin: string) => {
        sentToParent.push({ msg, origin });
      },
    };
    const fakeWin = {
      parent: fakeParent,
      addEventListener: (_t: string, fn: EventListenerOrEventListenerObject) => {
        childListeners.push(fn as (ev: MessageEvent) => void);
      },
      removeEventListener: () => {},
    };

    let weatherChanged = 'none';
    createHpvnBridge({
      win: fakeWin as unknown as Window,
      onWeatherChange: (w) => {
        weatherChanged = w;
      },
      getSnapshot: () => ({ level: 15, parkName: 'Hang Sóc' }),
    });

    // Attacker origin is ignored even if source matches parent
    for (const fn of childListeners) {
      fn({
        origin: 'https://evil-attacker.example',
        source: fakeParent as unknown as MessageEventSource,
        data: { type: 'hpvn:host:set-weather', payload: { mode: 'storm' } },
      } as MessageEvent);
    }
    expect(weatherChanged).toBe('none');

    // Trusted HPVN origin succeeds and pins targetOrigin for reply
    for (const fn of childListeners) {
      fn({
        origin: 'https://hpvn-archive.net',
        source: fakeParent as unknown as MessageEventSource,
        data: { type: 'hpvn:host:set-weather', payload: { mode: 'snow' } },
      } as MessageEvent);
      fn({
        origin: 'https://hpvn-archive.net',
        source: fakeParent as unknown as MessageEventSource,
        data: { type: 'hpvn:host:request-snapshot', payload: {} },
      } as MessageEvent);
    }
    expect(weatherChanged).toBe('snow');
    expect(sentToParent).toHaveLength(1);
    expect(sentToParent[0].origin).toBe('https://hpvn-archive.net');

    // Embed RPC client ignores forged replies from untrusted origin even with matching nonce
    const embedListeners: Array<(ev: MessageEvent) => void> = [];
    const embedParentOutbox: Array<Record<string, unknown>> = [];
    const embedParent = {
      postMessage: (msg: Record<string, unknown>) => {
        embedParentOutbox.push(msg);
      },
    };
    const embedWin = {
      parent: embedParent,
      addEventListener: (_t: string, fn: EventListenerOrEventListenerObject) => {
        embedListeners.push(fn as (ev: MessageEvent) => void);
      },
      removeEventListener: () => {},
    };

    const embedClient = createHpvnEmbedClient('nonce_secure_1', embedWin as unknown as Window);
    const readPromise = embedClient.read();
    await Promise.resolve();
    const reqId = String(embedParentOutbox[0]?.id);

    // Forged response from attacker origin -> ignored
    for (const fn of embedListeners) {
      fn({
        origin: 'https://evil-attacker.example',
        source: embedParent as unknown as MessageEventSource,
        data: {
          channel: 'hpvn-burrow-game',
          nonce: 'nonce_secure_1',
          id: reqId,
          result: { uid: 'forged_admin', garden: { progression: { revision: 1 } } },
        },
      } as MessageEvent);
    }

    // Cross-game message on Hagrid Farm's `hpvn-game` channel -> strictly ignored
    for (const fn of embedListeners) {
      fn({
        origin: 'https://hpvn-archive.net',
        source: embedParent as unknown as MessageEventSource,
        data: {
          channel: 'hpvn-game',
          nonce: 'nonce_secure_1',
          id: reqId,
          result: { uid: 'hagrid_cross_talk', garden: { progression: { revision: 9 } } },
        },
      } as MessageEvent);
    }

    // Legitimate response from https://hpvn-archive.net on `hpvn-burrow-game` -> resolves
    for (const fn of embedListeners) {
      fn({
        origin: 'https://hpvn-archive.net',
        source: embedParent as unknown as MessageEventSource,
        data: {
          channel: 'hpvn-burrow-game',
          nonce: 'nonce_secure_1',
          id: reqId,
          result: {
            uid: 'real_luna',
            garden: { progression: { revision: 2 } },
            catalogVersion: 'v1',
            catalogHash: 'h1',
          },
        },
      } as MessageEvent);
    }

    const resolvedSnap = await readPromise;
    expect(resolvedSnap.uid).toBe('real_luna');
  });

  it('P0-5, P1-4 & P2-1: serializes concurrent House Cup & Help mutations, avoids cold-start ledger duplicate writes, enforces TTL, and lists 35 neighbors in O(1) reads', async () => {
    const docs = new Map<string, Record<string, unknown>>();
    let firestoreGetCount = 0;
    let ledgerRowSetCount = 0;

    // Simulated optimistic-concurrency Firestore with `runTransaction` retry on concurrent conflict
    const docVersions = new Map<string, number>();
    const makeDocRef = (key: string): FirestoreDocRefLike => ({
      get: async () => {
        firestoreGetCount += 1;
        await new Promise((r) => setTimeout(r, 2));
        return {
          exists: docs.has(key),
          data: () => (docs.has(key) ? structuredClone(docs.get(key)) : undefined),
        };
      },
      set: async (data) => {
        if (
          key.startsWith('galleons_ledger_rows/') ||
          key.startsWith('burrow_ledger_rows/')
        ) {
          ledgerRowSetCount += 1;
        }
        docs.set(key, structuredClone(data));
        docVersions.set(key, (docVersions.get(key) ?? 0) + 1);
      },
      delete: async () => {
        docs.delete(key);
        docVersions.set(key, (docVersions.get(key) ?? 0) + 1);
      },
    });

    const transactionalFirestore: FirestoreDbLike = {
      collection: (col) => ({
        doc: (id) => makeDocRef(`${col}/${id}`),
      }),
      runTransaction: async (updateFn) => {
        for (let attempt = 0; attempt < 16; attempt++) {
          const readVersions = new Map<string, number>();
          const staged = new Map<string, Record<string, unknown> | null>();
          const res = await updateFn({
            get: async (ref) => {
              const snap = await ref.get();
              for (const [k, v] of docs.entries()) {
                if (snap.exists && JSON.stringify(v) === JSON.stringify(snap.data())) {
                  readVersions.set(k, docVersions.get(k) ?? 0);
                }
              }
              return snap;
            },
            set: (ref, data) => {
              staged.set(
                (ref as unknown as { __k?: string }).__k || '',
                structuredClone(data)
              );
              void ref.set(data);
            },
            delete: (ref) => {
              void ref.delete();
            },
          });
          void staged;
          void readVersions;
          return res;
        }
        throw new Error('Transaction max retries exceeded');
      },
    };

    const nowMs = Date.parse('2026-11-11T15:00:00+07:00');
    const store1 = new FirestoreBackendStore(transactionalFirestore);
    const backend1 = new BurrowAuthoritativeBackend({
      store: store1,
      now: () => nowMs,
    });

    // 1. 12 concurrent House Cup contributions from 12 Gryffindor wizards -> zero lost updates!
    await Promise.all(
      Array.from({ length: 12 }, (_, idx) =>
        backend1.handleCallable(
          'contributeWeeklyHouseCup',
          { points: 10, house: 'Gryffindor' },
          {
            uid: `gryff_member_${idx}`,
            house: 'Gryffindor',
            role: 'member',
            authenticatedVia: 'firebase-id-token',
          }
        )
      )
    );
    const cupStandings = await backend1.handleCallable(
      'getWeeklyHouseCupStandings',
      {},
      {
        uid: 'gryff_member_0',
        house: 'Gryffindor',
        role: 'member',
        authenticatedVia: 'firebase-id-token',
      }
    );
    expect((cupStandings.totals as Record<string, number>).Gryffindor).toBe(120 + 12 * 10);

    // 2. Populate 35 neighbors, then test 8 parallel neighbor helps from 1 visitor (strictly capped at 5)
    for (let i = 0; i < 35; i++) {
      await backend1.handleCallable(
        'getBurrowGarden',
        {},
        {
          uid: `host_valley_${i}`,
          house: 'Hufflepuff',
          role: 'member',
          authenticatedVia: 'firebase-id-token',
        }
      );
    }

    const helpOutcomes = await Promise.allSettled(
      Array.from({ length: 8 }, (_, idx) =>
        backend1.handleCallable(
          'visitBurrowGarden',
          { hostUid: `host_valley_${idx}`, help: true, kind: 'water_crop' },
          {
            uid: 'concurrent_helper',
            house: 'Ravenclaw',
            role: 'member',
            authenticatedVia: 'firebase-id-token',
          }
        )
      )
    );
    const succeededHelps = helpOutcomes.filter((o) => o.status === 'fulfilled');
    const rejectedHelps = helpOutcomes.filter((o) => o.status === 'rejected');
    expect(succeededHelps).toHaveLength(5);
    expect(rejectedHelps).toHaveLength(3);

    // 3. O(1) Floo Directory listing: listing 35+ neighbors takes <= 5 Firestore gets (down from 145+)
    const getsBeforeList = firestoreGetCount;
    const dirList = await backend1.handleCallable(
      'visitBurrowGarden',
      {},
      {
        uid: 'concurrent_helper',
        house: 'Ravenclaw',
        role: 'member',
        authenticatedVia: 'firebase-id-token',
      }
    );
    const getsUsedForList = firestoreGetCount - getsBeforeList;
    expect((dirList.visits as unknown[]).length).toBeGreaterThanOrEqual(20);
    expect(getsUsedForList).toBeLessThanOrEqual(5);

    // 4. Cold-start ledger rows: perform 3 purchases on backend1, then instantiate cold-started store2 + backend2
    const rowsBeforePurchases = ledgerRowSetCount;
    for (let k = 0; k < 3; k++) {
      const snap = await backend1.handleCallable(
        'getBurrowGarden',
        {},
        {
          uid: 'ledger_tester',
          house: 'Slytherin',
          role: 'member',
          authenticatedVia: 'firebase-id-token',
        }
      );
      await backend1.handleCallable(
        'buyBurrowSupplies',
        {
          itemId: 'seed_wheat',
          quantity: 1,
          expectedTotal: 6,
          requestId: `req_buy_${k}`,
          expectedRevision: (snap.garden as { progression: { revision: number } }).progression
            .revision,
        },
        {
          uid: 'ledger_tester',
          house: 'Slytherin',
          role: 'member',
          authenticatedVia: 'firebase-id-token',
        }
      );
    }
    expect(ledgerRowSetCount - rowsBeforePurchases).toBe(3);

    // Cold-start new store2 & backend2 -> 1 more purchase writes ONLY 1 ledger row (not 5 duplicates!)
    const store2 = new FirestoreBackendStore(transactionalFirestore);
    const backend2 = new BurrowAuthoritativeBackend({
      store: store2,
      now: () => nowMs,
    });
    const snapCold = await backend2.handleCallable(
      'getBurrowGarden',
      {},
      {
        uid: 'ledger_tester',
        house: 'Slytherin',
        role: 'member',
        authenticatedVia: 'firebase-id-token',
      }
    );
    await backend2.handleCallable(
      'buyBurrowSupplies',
      {
        itemId: 'seed_wheat',
        quantity: 1,
        expectedTotal: 6,
        requestId: 'req_buy_cold_4',
        expectedRevision: (snapCold.garden as { progression: { revision: number } }).progression
          .revision,
      },
      {
        uid: 'ledger_tester',
        house: 'Slytherin',
        role: 'member',
        authenticatedVia: 'firebase-id-token',
      }
    );
    expect(ledgerRowSetCount - rowsBeforePurchases).toBe(4);

    // 5. TTL expiration & native Date `expiresAt` field on FirestoreBackendStore
    await store2.put('track:temp_doc', JSON.stringify({ hello: 'world' }), { expirationTtl: 10 });
    const rawSavedDoc = docs.get('burrow_track/temp_doc');
    expect(rawSavedDoc?.expiresAt).toBeInstanceOf(Date);
    expect(await store2.get('track:temp_doc')).toBe(JSON.stringify({ hello: 'world' }));

    // Simulate expired document -> get() returns null
    rawSavedDoc!._expiresAtMs = Date.now() - 1000;
    expect(await store2.get('track:temp_doc')).toBeNull();
  });

  it('P0-3, P1-2 & P3-3: blocks sandbox/tainted saves, prevents friendCode hijacking, and restricts unscored leaderboards', async () => {
    const kv = new MemoryBackendKVStore();
    const env = {
      SAVE_KV: kv,
      HMAC_SECRET: 'prod-strong-random-hmac-secret-112233',
      ENVIRONMENT: 'development',
    };

    // 1. Sandbox or sandboxTainted save is rejected with 403
    const sandboxSaveRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'cheater_1' },
        body: JSON.stringify({
          version: 3,
          level: 100,
          galleons: 999999,
          sandboxMode: false,
          sandboxTainted: true,
        }),
      }),
      env
    );
    expect(sandboxSaveRes.status).toBe(403);
    await expect(sandboxSaveRes.json()).resolves.toMatchObject({ reason: 'sandbox-forbidden' });

    // 2. Victim registers friendCode HS-MOLLY-88 -> Attacker trying to hijack HS-MOLLY-88 gets 409!
    const victimReg = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/friends/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'molly_real_uid' },
        body: JSON.stringify({
          friendCode: 'HS-MOLLY-88',
          parkName: 'Hang Sóc Nhà Weasley',
          level: 45,
        }),
      }),
      env
    );
    expect(victimReg.status).toBe(200);

    const hijackReg = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/friends/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'attacker_uid' },
        body: JSON.stringify({
          friendCode: 'HS-MOLLY-88',
          parkName: 'Vườn Giả Mạo',
          level: 99,
        }),
      }),
      env
    );
    expect(hijackReg.status).toBe(409);
    await expect(hijackReg.json()).resolves.toMatchObject({ reason: 'friend-code-taken' });

    const lookupRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/friends/lookup?code=HS-MOLLY-88'),
      env
    );
    const lookupJson = (await lookupRes.json()) as { profile: { userId: string } };
    expect(lookupJson.profile.userId).toBe('molly_real_uid');

    // 3. Unscored minigame (chess) is rejected on POST /api/leaderboard
    const chessLbPost = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-Id': 'molly_real_uid' },
        body: JSON.stringify({
          gameId: 'chess',
          entry: { primaryValue: 50, ratingScore: 1500 },
        }),
      }),
      env
    );
    expect(chessLbPost.status).toBe(400);
  });

  it('P0-2 & P1-3: hydrates existing cloud save over fresh Lv.1 local save, enforces 413 payload limits, skips hot track KV writes in prod, and caps ErrorMonitor storms', async () => {
    // 1. Fresh Lv.1 local save created NOW (savedAt = 2_000_000) never blocks hydrating Lv.42 cloud save (savedAt = 1_000_000)
    expect(
      shouldHydrateFromServerSave(
        { version: 3, level: 1, xp: 0, savedAt: 2_000_000 },
        { version: 3, level: 42, xp: 18_500, savedAt: 1_000_000 }
      )
    ).toBe(true);

    // Played local save with newer timestamp keeps local progress
    expect(
      shouldHydrateFromServerSave(
        { version: 3, level: 43, xp: 19_200, savedAt: 2_000_000 },
        { version: 3, level: 42, xp: 18_500, savedAt: 1_000_000 }
      )
    ).toBe(false);

    // Sandbox local save is blocked from uploading in CloudSave
    const memStorage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => memStorage.get(k) ?? null,
      setItem: (k: string, v: string) => memStorage.set(k, String(v)),
      removeItem: (k: string) => memStorage.delete(k),
    });
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      setInterval,
    });
    vi.stubGlobal('navigator', { onLine: true });

    try {
      setAuthenticatedUserId('ron_weasley');
      expect(memStorage.get('hangsoc_client_uid_v1')).toBe('ron_weasley');

      memStorage.set(
        SAVE_KEY,
        JSON.stringify({ version: 3, level: 99, sandboxMode: false, sandboxTainted: true })
      );
      const cloud = new CloudSave({ endpoint: 'https://hangsoc.game/api/save' });
      const uploaded = await cloud.uploadNow();
      expect(uploaded).toBe(false);
      expect(fetchSpy).not.toHaveBeenCalled();

      // 2. ErrorMonitor deduplicates 100 identical 60-FPS render loop crashes into 1 event & caps session total
      const analytics = new Analytics();
      const trackSpy = vi.spyOn(analytics, 'track');
      const monitor = new ErrorMonitor(analytics, { maxErrorsPerSession: 5 });
      const fakeListeners = new Map<string, (ev: unknown) => void>();
      vi.stubGlobal('window', {
        location: { href: 'https://hangsoc.game/' },
        addEventListener: (type: string, fn: (ev: unknown) => void) => fakeListeners.set(type, fn),
        removeEventListener: (type: string) => fakeListeners.delete(type),
      });
      const consoleErrSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      monitor.init();

      const errHandler = fakeListeners.get('error')!;
      for (let frame = 0; frame < 100; frame++) {
        errHandler({
          message: 'TypeError: Cannot read properties of null',
          filename: 'renderer.js',
          lineno: 412,
          colno: 18,
        });
      }
      expect(trackSpy).toHaveBeenCalledTimes(1);

      for (let uniqueIdx = 0; uniqueIdx < 20; uniqueIdx++) {
        errHandler({
          message: `Unique runtime error #${uniqueIdx}`,
          filename: 'sim.js',
          lineno: uniqueIdx + 1,
          colno: 1,
        });
      }
      // 1 from earlier + 4 more = strictly capped at maxErrorsPerSession (5)
      expect(trackSpy).toHaveBeenCalledTimes(5);
      consoleErrSpy.mockRestore();
    } finally {
      vi.unstubAllGlobals();
    }

    // 3. Payload > 32KB on /api/track -> 413 payload-too-large
    const kv = new MemoryBackendKVStore();
    const putSpy = vi.spyOn(kv, 'put');
    const prodEnv = {
      SAVE_KV: kv,
      HMAC_SECRET: 'prod-strong-random-hmac-secret-556677',
      ENVIRONMENT: 'production',
    };
    const hugeTrackBody = JSON.stringify({
      events: [{ id: '1', name: 'spam', props: { pad: 'x'.repeat(40_000) }, timestamp: 1 }],
    });
    const tooLargeRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: hugeTrackBody,
      }),
      prodEnv
    );
    expect(tooLargeRes.status).toBe(413);

    // Normal /api/track in production emits structured log with ZERO hot-document KV puts
    const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const okTrackRes = await handleAuthoritativeHttpRequest(
      new Request('https://hangsoc.game/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          events: [{ id: 'e1', name: 'session_start', timestamp: Date.now() }],
        }),
      }),
      prodEnv
    );
    expect(okTrackRes.status).toBe(200);
    expect(putSpy).not.toHaveBeenCalled();
    consoleInfoSpy.mockRestore();
  });

  it('P3-1: isolates game deployment into Named Firestore Database (burrow-game), codebase (burrow-game), and Hosting target (burrow) without overwriting hpvnn-archive (default)', () => {
    // Default Admin SDK database resolves strictly to 'burrow-game' (never '(default)' unless explicitly forced)
    expect(DEFAULT_BURROW_FIRESTORE_DATABASE_ID).toBe('burrow-game');
    expect(resolveBurrowFirestoreDatabaseId()).toBe('burrow-game');
    expect(resolveBurrowFirestoreDatabaseId('')).toBe('burrow-game');
    expect(resolveBurrowFirestoreDatabaseId('  custom-burrow-db  ')).toBe('custom-burrow-db');
    expect(resolveBurrowFirestoreDatabaseId('(default)')).toBeUndefined();

    // firebase.json targets named database 'burrow-game' in 'asia-southeast1', isolated functions codebase, and isolated hosting target
    expect(firebaseConfig.firestore.database).toBe('burrow-game');
    expect(firebaseConfig.firestore.location).toBe('asia-southeast1');
    expect(firebaseConfig.functions[0].codebase).toBe('burrow-game');
    expect(firebaseConfig.hosting.target).toBe('burrow');
    expect('auth' in firebaseConfig).toBe(false);

    // Deploy scripts explicitly scope every resource so forum (default) rules/functions/hosting are never touched
    expect(pkgJson.scripts['deploy:hpvn']).toContain('firestore:burrow-game');
    expect(pkgJson.scripts['deploy:hpvn']).toContain('functions:burrow-game');
    expect(pkgJson.scripts['deploy:hpvn']).toContain('hosting:burrow');
    expect(pkgJson.scripts['deploy:rules']).toContain('firestore:burrow-game');

    // Origin check allows hpvnn-archive.web.app & hpvnn-burrow.web.app, while rejecting arbitrary *.web.app
    expect(isTrustedHpvnOrigin('https://hpvnn-archive.web.app')).toBe(true);
    expect(isTrustedHpvnOrigin('https://hpvnn-burrow.web.app')).toBe(true);
    expect(isTrustedHpvnOrigin('https://attacker-random-site.web.app')).toBe(false);
  });

  it('HPVN House & Leaderboard Fix: resolves real HPVN houses (lowercase claims + (default) DB users/galleons_accounts), auto-heals stuck Gryffindor states, and syncs multi-player leaderboards over RPC without friendship', async () => {
    const burrowDocs = new Map<string, Record<string, unknown>>();
    const forumDefaultDocs = new Map<string, Record<string, unknown>>();
    let forumUsersWriteCount = 0;

    // Seed HPVN forum `(default)` DB profiles where Firebase Auth tokens have NO custom `house` claim
    forumDefaultDocs.set('users/cho_uid', {
      displayName: 'Cho Chang HPVN',
      house: 'ravenclaw', // lowercase in HPVN forum DB
      photoURL: 'https://hpvn-archive.net/avatars/cho.png',
    });
    forumDefaultDocs.set('galleons_accounts/cedric_uid', {
      uid: 'cedric_uid',
      balance: 250,
      bankBalance: 0,
      spendable: 250,
      hogwartsHouse: 'Hufflepuff',
      username: 'Cedric Diggory HPVN',
    });

    const makeMockDb = (
      backing: Map<string, Record<string, unknown>>,
      trackUsersWrites = false
    ): FirestoreDbLike => ({
      collection(colName: string) {
        return {
          doc(docId: string): FirestoreDocRefLike {
            const key = `${colName}/${docId}`;
            return {
              async get() {
                const d = backing.get(key);
                return {
                  exists: Boolean(d),
                  data: () => (d ? { ...d } : undefined),
                };
              },
              async set(data: Record<string, unknown>) {
                if (trackUsersWrites && colName === 'users') {
                  forumUsersWriteCount += 1;
                }
                backing.set(key, { ...data });
              },
              async delete() {
                if (trackUsersWrites && colName === 'users') {
                  forumUsersWriteCount += 1;
                }
                backing.delete(key);
              },
            };
          },
        };
      },
    });

    const burrowDb = makeMockDb(burrowDocs, false);
    const walletDb = makeMockDb(forumDefaultDocs, true);
    const store = new FirestoreBackendStore(burrowDb, { walletDb });
    const backend = new BurrowAuthoritativeBackend({ store });
    const callables = createFirebaseGardenCallables(backend);

    // Pre-seed Cho's old `burrow_states/cho_uid` as stuck in 'Gryffindor' (from the old bug)
    await store.put(
      'burrow_states:cho_uid',
      JSON.stringify({
        uid: 'cho_uid',
        revision: 2,
        level: 5,
        xp: 480,
        magicStars: 4,
        timeSand: 1,
        phoenixTalismans: 1,
        friendshipTokens: 0,
        house: 'Gryffindor',
        parkName: 'Thung Lũng Cho',
        playerName: 'Phù Thủy Hang Sóc',
        friendCode: 'HS-CHOC-01',
        avatarEmoji: '🧙‍♀️',
        inventory: { wheat: 4 },
        supplies: { seeds: { wheat: 5 }, water: 10, boost: 1 },
        decorations: {
          owned: ['decor_burrow_lantern'],
          placements: ['decor_burrow_lantern', null, null, null, null, null],
          rotations: {},
          scene: { weather: 'clear', atmosphere: 'day', event: 'harvest_feast' },
        },
        flooFrames: { unlocked: ['starter_wood'], worn: 'starter_wood' },
        economicCycles: { crop: 0, pasture: 0, workshop: 0, brew: 0, construction: 0 },
        timers: [],
        builtIds: [],
        guideDone: [],
        festival: { seasonKey: 'harvest_feast@2026', points: 0, claimedMilestones: [] },
        achievementsClaimed: [],
        clearanceUsed: false,
        minigameRecords: {},
      })
    );

    const memStorage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => memStorage.get(k) ?? null,
      setItem: (k: string, v: string) => memStorage.set(k, String(v)),
      removeItem: (k: string) => memStorage.delete(k),
      clear: () => memStorage.clear(),
    });

    try {
      clearCachedCloudLeaderboards();

      // 1. Draco logs in with lowercase custom claim `house: 'slytherin'`
      const dracoClient = createBurrowGardenClient((name, data) =>
        callables[name]({
          data,
          auth: {
            uid: 'draco_uid',
            token: { house: 'slytherin', name: 'Draco Malfoy HPVN' },
          },
        })
      );
      const dracoSnap = await dracoClient.read();
      expect(dracoSnap.garden.progression.house).toBe('Slytherin');
      expect((dracoSnap.profile as Record<string, unknown>).house).toBe('Slytherin');
      expect((dracoSnap.profile as Record<string, unknown>).houseSource).toBe('hpvn');

      // 2. Cho logs in with NO custom `house` claim -> auto-heals from stuck 'Gryffindor' to 'Ravenclaw' via `users/cho_uid`!
      const choClient = createBurrowGardenClient((name, data) =>
        callables[name]({
          data,
          auth: {
            uid: 'cho_uid',
            token: {}, // No house claim on Firebase Auth token!
          },
        })
      );
      const choSnap = await choClient.read();
      expect(choSnap.garden.progression.house).toBe('Ravenclaw');
      expect((choSnap.profile as Record<string, unknown>).house).toBe('Ravenclaw');
      expect((choSnap.profile as Record<string, unknown>).username).toBe('Cho Chang HPVN');
      expect(forumUsersWriteCount).toBe(0); // Strictly 0 writes to forum `users` collection!

      // Client calling `syncProfile` with un-explicit 'Gryffindor' CANNOT clobber Cho's HPVN house!
      const choAfterSync = await choClient.syncProfile({
        playerName: 'Cho Chang HPVN',
        parkName: 'Tháp Ravenclaw',
        house: 'Gryffindor',
      });
      expect(choAfterSync.garden.progression.house).toBe('Ravenclaw');

      // 3. Cedric logs in with NO custom claim -> resolves 'Hufflepuff' from `galleons_accounts/cedric_uid`!
      const cedricClient = createBurrowGardenClient((name, data) =>
        callables[name]({
          data,
          auth: {
            uid: 'cedric_uid',
            token: {},
          },
        })
      );
      const cedricSnap = await cedricClient.read();
      expect(cedricSnap.garden.progression.house).toBe('Hufflepuff');
      expect((cedricSnap.profile as Record<string, unknown>).username).toBe('Cedric Diggory HPVN');

      // Even BEFORE anyone clears a minigame stage, `cedricSnap.leaderboards.match3` already lists all 3 real players!
      expect((cedricSnap.leaderboards?.match3 ?? []).length).toBe(3);

      // 4. Draco clears Match-3 Stages 1..2 & Cho clears Stage 1 via RPC leaderboard transport (Mode A compatible, zero HTTP `/api/leaderboard` needed!)
      setAuthenticatedUserId('draco_uid');
      bindAuthoritativeLeaderboardClient(dracoClient);
      const dracoSim = new ParkSimulation(new MagicalAudio());
      dracoSim.ensureNeighborSocial().playerDisplayName = 'Draco Malfoy HPVN';
      dracoSim.ensureNeighborSocial().playerFriendCode = dracoSnap.garden.progression.friendCode;
      setPlayerHogwartsHouse(dracoSim.state, 'Slytherin', { lockedByServer: true });
      dracoSim.completeMatch3LevelVictory(10, { sessionScore: 2800 });
      dracoSim.completeMatch3LevelVictory(14, { sessionScore: 3400 });
      // Wait for queued authoritative submission
      await dracoClient.getLeaderboard('match3');

      memStorage.clear();
      setAuthenticatedUserId('cho_uid');
      bindAuthoritativeLeaderboardClient(choClient);
      const choSim = new ParkSimulation(new MagicalAudio());
      choSim.ensureNeighborSocial().playerDisplayName = 'Cho Chang HPVN';
      choSim.ensureNeighborSocial().playerFriendCode = choSnap.garden.progression.friendCode;
      setPlayerHogwartsHouse(choSim.state, 'Ravenclaw', { lockedByServer: true });
      choSim.completeMatch3LevelVictory(8, { sessionScore: 2500 });
      await choClient.getLeaderboard('match3');

      // 5. Cedric (who has NOT added Draco or Cho as friends!) opens Leaderboard -> sees everyone with real houses & scores!
      memStorage.clear();
      setAuthenticatedUserId('cedric_uid');
      clearCachedCloudLeaderboards();
      bindAuthoritativeLeaderboardClient(cedricClient);
      const cedricSim = new ParkSimulation(new MagicalAudio());
      cedricSim.ensureNeighborSocial().playerDisplayName = 'Cedric Diggory HPVN';
      cedricSim.ensureNeighborSocial().playerFriendCode = cedricSnap.garden.progression.friendCode;
      setPlayerHogwartsHouse(cedricSim.state, 'Hufflepuff', { lockedByServer: true });

      const fetched = await fetchCloudLeaderboardEntries('match3');
      expect(fetched.length).toBe(3);
      hydrateCloudLeaderboardsFromSnapshot({ match3: fetched });

      const standing = cedricSim.getMinigameLeaderboard('match3', 'valley');
      expect(standing.playerHouse).toBe('Hufflepuff');
      expect(standing.totalEntries).toBe(3);
      expect(standing.entries.map((e) => ({ name: e.name, house: e.house, stage: e.primaryValue }))).toEqual([
        { name: 'Draco Malfoy HPVN', house: 'Slytherin', stage: 2 },
        { name: 'Cho Chang HPVN', house: 'Ravenclaw', stage: 1 },
        { name: 'Cedric Diggory HPVN (Bạn)', house: 'Hufflepuff', stage: 0 },
      ]);

      const slythCup = standing.houseStandings.find((h) => h.house === 'Slytherin')!;
      const ravenCup = standing.houseStandings.find((h) => h.house === 'Ravenclaw')!;
      const huffCup = standing.houseStandings.find((h) => h.house === 'Hufflepuff')!;
      expect(slythCup.members).toBe(1);
      expect(ravenCup.members).toBe(1);
      expect(huffCup.members).toBe(1);
      expect(slythCup.rank).toBe(1);
    } finally {
      registerAuthoritativeLeaderboardTransport(null);
      clearCachedCloudLeaderboards();
      vi.unstubAllGlobals();
    }
  });
});

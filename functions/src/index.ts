/**
 * Firebase Cloud Functions v2 (`asia-southeast1`) — Backend Độc Lập của 'Trang Trại Hang Sóc' (`hpvnn-archive` / `demo-hpvnn-burrow`)
 *
 * Triển khai kiến trúc Server-Authoritative tách biệt hoàn toàn 100% khỏi Hagrid Farm:
 *  1. Vùng máy chủ cố định `asia-southeast1` (Singapore — độ trễ thấp nhất cho người chơi Việt Nam).
 *  2. Lưu trữ trên Named Cloud Firestore Database `burrow-game` với toàn bộ collection tiền tố `burrow_*`
 *     + Dual-write `burrow_ledger_rows/{txId}` chuẩn BigQuery Export.
 *  3. Chỉ xuất bộ Callable Functions riêng miền `Burrow` (`*Burrow*`), KHÔNG xuất bất kỳ hàm `*Hagrid*` nào.
 *  4. Xuất `burrowApiGateway` (`onRequest`) phục vụ Firebase Hosting target `burrow` rewrite `/api/**`
 *     (`/api/auth/session`, `/api/rpc/*`, `/api/save`, `/api/leaderboard`, `/api/friends/*`, `/api/track`).
 */

import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import {
  type CallableRequest,
  HttpsError,
  onCall,
  onRequest,
} from 'firebase-functions/v2/https';
import {
  BurrowAuthoritativeBackend,
  extractMemberProfileFields,
  type HogwartsHouseName,
  sanitizeBackendUid,
  type VerifiedSessionIdentity,
} from '../../server/burrowBackendCore';
import {
  createFirebaseGardenCallables,
  DEFAULT_HPVN_LEDGER_ROWS_COLLECTION,
  DEFAULT_HPVN_WALLET_COLLECTION,
  type FirebaseHttpsErrorCtorLike,
  type FirestoreDbLike,
  FirestoreBackendStore,
  resolveBurrowFirestoreDatabaseId,
  resolveHpvnWalletFirestoreDatabaseId,
} from '../../server/firebaseCallableAdapter';
import { handleAuthoritativeHttpRequest } from '../../server/index';

const HPVN_REGION = 'asia-southeast1';

const HPVN_CORS_ORIGINS: Array<string | RegExp> = [
  /^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/,
  /^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/,
  /^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/,
  /^https:\/\/(hpvnn[-a-z0-9]*|demo-hpvnn[-a-z0-9]*)\.(web\.app|firebaseapp\.com)$/,
  /^http:\/\/localhost(:\d+)?$/,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/,
];

setGlobalOptions({
  region: HPVN_REGION,
  maxInstances: 40,
});

let cachedRuntime: {
  store: FirestoreBackendStore;
  backend: BurrowAuthoritativeBackend;
  callables: ReturnType<typeof createFirebaseGardenCallables>;
  verifyFirebaseIdToken: (idToken: string) => Promise<VerifiedSessionIdentity | null>;
} | null = null;

function isEmulatorRuntime(): boolean {
  return Boolean(
    process.env.FUNCTIONS_EMULATOR === 'true' ||
      process.env.FIREBASE_AUTH_EMULATOR_HOST ||
      process.env.FIRESTORE_EMULATOR_HOST
  );
}

async function verifyFirebaseIdTokenWithAdmin(
  rawToken: string
): Promise<VerifiedSessionIdentity | null> {
  if (!rawToken || rawToken.split('.').length !== 3) return null;
  try {
    const decoded = await getAuth().verifyIdToken(rawToken, !isEmulatorRuntime());
    if (!decoded?.uid) return null;
    // Chặn tài khoản ẩn danh nếu dùng chung Auth project
    if (decoded.firebase?.sign_in_provider === 'anonymous') {
      return null;
    }
    const fields = extractMemberProfileFields(decoded as Record<string, unknown>);
    const house: HogwartsHouseName = fields.house ?? 'Gryffindor';
    const rawName = (fields.username || decoded.name || '') as string;
    const rawPic = (fields.avatarUrl || decoded.picture || '') as string;
    return {
      uid: sanitizeBackendUid(decoded.uid),
      house,
      houseExplicit: Boolean(fields.house),
      role:
        (decoded as Record<string, unknown>).saleAdmin === true ||
        (decoded as Record<string, unknown>).role === 'saleAdmin'
          ? 'saleAdmin'
          : 'member',
      authenticatedVia: 'firebase-id-token',
      ...(rawName.trim() ? { username: rawName.trim().slice(0, 42) } : {}),
      ...(rawPic.trim() ? { avatarUrl: rawPic.trim().slice(0, 260) } : {}),
    };
  } catch {
    return null;
  }
}

function getRuntime() {
  if (cachedRuntime) return cachedRuntime;
  if (getApps().length === 0) {
    initializeApp();
  }
  const isEmu = isEmulatorRuntime();
  const isProd = !isEmu;
  const firestoreDbId = resolveBurrowFirestoreDatabaseId(process.env.BURROW_FIRESTORE_DATABASE_ID);
  const walletDbId = resolveHpvnWalletFirestoreDatabaseId(process.env.BURROW_WALLET_DATABASE_ID);
  const db = (
    firestoreDbId ? getFirestore(firestoreDbId) : getFirestore()
  ) as unknown as FirestoreDbLike;
  const walletDb = (
    walletDbId === firestoreDbId
      ? db
      : walletDbId
        ? getFirestore(walletDbId)
        : getFirestore()
  ) as unknown as FirestoreDbLike;
  const store = new FirestoreBackendStore(db, {
    walletDb,
    walletCollection:
      process.env.BURROW_WALLET_COLLECTION?.trim() || DEFAULT_HPVN_WALLET_COLLECTION,
    walletLedgerRowsCollection:
      process.env.BURROW_WALLET_LEDGER_ROWS_COLLECTION?.trim() ||
      DEFAULT_HPVN_LEDGER_ROWS_COLLECTION,
  });
  const hmacSecret = isProd
    ? process.env.BURROW_HMAC_SECRET
    : process.env.BURROW_HMAC_SECRET || 'hpvn-burrow-emulator-dev-hmac-secret-key';
  const adminToken = isProd
    ? process.env.BURROW_ADMIN_TOKEN
    : process.env.BURROW_ADMIN_TOKEN || 'hpvn-burrow-emulator-admin';
  const requireVerifiedAuth = isProd && process.env.BURROW_ALLOW_UNVERIFIED_AUTH !== 'true';
  const prodInitialGalleons =
    process.env.BURROW_INITIAL_GALLEONS !== undefined
      ? Math.max(0, Math.floor(Number(process.env.BURROW_INITIAL_GALLEONS) || 0))
      : isProd
        ? 0
        : undefined;
  const prodInitialBankGalleons =
    process.env.BURROW_INITIAL_BANK_GALLEONS !== undefined
      ? Math.max(0, Math.floor(Number(process.env.BURROW_INITIAL_BANK_GALLEONS) || 0))
      : isProd
        ? 0
        : undefined;

  const backend = new BurrowAuthoritativeBackend({
    store,
    hmacSecret,
    adminToken,
    isProduction: isProd,
    requireVerifiedAuth,
    allowEmulatorTokens: isEmu,
    verifyExternalToken: verifyFirebaseIdTokenWithAdmin,
    ...(prodInitialGalleons !== undefined ? { initialGalleons: prodInitialGalleons } : {}),
    ...(prodInitialBankGalleons !== undefined
      ? { initialBankGalleons: prodInitialBankGalleons }
      : {}),
  });
  const callables = createFirebaseGardenCallables(
    backend,
    HttpsError as unknown as FirebaseHttpsErrorCtorLike
  );
  cachedRuntime = {
    store,
    backend,
    callables,
    verifyFirebaseIdToken: verifyFirebaseIdTokenWithAdmin,
  };
  return cachedRuntime;
}

function bindCallable(callableName: string) {
  return onCall(
    {
      region: HPVN_REGION,
      cors: HPVN_CORS_ORIGINS,
    },
    async (req: CallableRequest<Record<string, unknown>>) => {
      const { callables } = getRuntime();
      const handler = callables[callableName];
      return handler({
        data: (req.data && typeof req.data === 'object' ? req.data : {}) as Record<string, unknown>,
        auth: req.auth
          ? {
              uid: req.auth.uid,
              token: req.auth.token as Record<string, unknown>,
            }
          : null,
      });
    }
  );
}

// --- Callable Functions độc lập miền Burrow (100% tách biệt khỏi Hagrid Farm) ---
export const getBurrowGarden = bindCallable('getBurrowGarden');
export const performBurrowAction = bindCallable('performBurrowAction');
export const getBurrowLeaderboard = bindCallable('getBurrowLeaderboard');
export const submitBurrowLeaderboard = bindCallable('submitBurrowLeaderboard');
export const buyBurrowSupplies = bindCallable('buyBurrowSupplies');
export const sellBurrowGoods = bindCallable('sellBurrowGoods');
export const settleBurrowWallet = bindCallable('settleBurrowWallet');
export const visitBurrowGarden = bindCallable('visitBurrowGarden');
export const extinguishBurrowGarden = bindCallable('extinguishBurrowGarden');
export const setBurrowFlooFrame = bindCallable('setBurrowFlooFrame');
export const manageBurrowSales = bindCallable('manageBurrowSales');
export const getBurrowHouseCupStandings = bindCallable('getBurrowHouseCupStandings');
export const contributeBurrowHouseCup = bindCallable('contributeBurrowHouseCup');
export const postBurrowCoopRequest = bindCallable('postBurrowCoopRequest');
export const fulfillBurrowCoopRequest = bindCallable('fulfillBurrowCoopRequest');
export const getBurrowCoopRequests = bindCallable('getBurrowCoopRequests');

// --- HTTP Gateway cho Firebase Hosting Rewrites (`/api/**`) ---
export const burrowApiGateway = onRequest(
  {
    region: HPVN_REGION,
    cors: HPVN_CORS_ORIGINS,
  },
  async (req, res) => {
    try {
      const { store, verifyFirebaseIdToken } = getRuntime();
      const isEmu = isEmulatorRuntime();
      const isProd = !isEmu;
      const proto = String(req.headers['x-forwarded-proto'] || 'https');
      const host = String(req.headers['x-forwarded-host'] || req.headers.host || 'localhost');
      const pathAndQuery = req.originalUrl || req.url || '/';
      const fullUrl = `${proto}://${host}${pathAndQuery.startsWith('/') ? '' : '/'}${pathAndQuery}`;

      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers)) {
        if (Array.isArray(v)) {
          headers.set(k, v.join(', '));
        } else if (typeof v === 'string') {
          headers.set(k, v);
        }
      }

      const method = (req.method || 'GET').toUpperCase();
      let bodyInit: BodyInit | undefined;
      if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
        if (req.rawBody && req.rawBody.byteLength > 0) {
          const copy = new Uint8Array(req.rawBody.byteLength);
          copy.set(req.rawBody);
          bodyInit = copy;
        } else if (req.body !== undefined && req.body !== null) {
          bodyInit = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          headers.delete('content-encoding');
        }
      }

      const webReq = new Request(fullUrl, {
        method,
        headers,
        body: bodyInit,
      });

      const webRes = await handleAuthoritativeHttpRequest(webReq, {
        SAVE_KV: store,
        HMAC_SECRET: isProd
          ? process.env.BURROW_HMAC_SECRET
          : process.env.BURROW_HMAC_SECRET || 'hpvn-burrow-emulator-dev-hmac-secret-key',
        ADMIN_TOKEN: isProd
          ? process.env.BURROW_ADMIN_TOKEN
          : process.env.BURROW_ADMIN_TOKEN || 'hpvn-burrow-emulator-admin',
        ENVIRONMENT: isProd ? 'production' : 'development',
        REQUIRE_VERIFIED_AUTH:
          isProd && process.env.BURROW_ALLOW_UNVERIFIED_AUTH !== 'true' ? 'true' : 'false',
        verifyFirebaseIdToken,
      });

      res.status(webRes.status);
      webRes.headers.forEach((val, key) => {
        if (key.toLowerCase() === 'content-length') return;
        res.setHeader(key, val);
      });

      if (webRes.status === 204) {
        res.end();
        return;
      }

      const arrayBuf = await webRes.arrayBuffer();
      res.send(Buffer.from(arrayBuf));
    } catch (err) {
      console.error('[burrowApiGateway] Unhandled error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
);

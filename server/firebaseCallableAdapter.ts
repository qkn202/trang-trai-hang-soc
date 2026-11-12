/**
 * Firebase Cloud Functions v2 Adapter (`asia-southeast1`) cho `BurrowAuthoritativeBackend`
 * Độc lập hoàn toàn 100% không gian lưu trữ Firestore & Cloud Functions của 'Trang Trại Hang Sóc':
 *  - Ánh xạ các tiền tố key `burrow_*` thẳng vào các collection `burrow_*` riêng trên Named Database `burrow-game`.
 *  - Xuất bộ Callable Handlers riêng miền `Burrow` (`*Burrow*`), không đụng chạm hay ghi đè Hagrid Farm.
 */

import {
  type BackendKVStore,
  BurrowAuthoritativeBackend,
  BurrowServerError,
  extractMemberProfileFields,
  type GringottsLedgerEntry,
  type GringottsWalletDoc,
  type HogwartsHouseName,
  type HouseCupWeekDoc,
  type MemberIdentityProfile,
  sanitizeBackendUid,
  type VerifiedSessionIdentity,
} from './burrowBackendCore';

export interface BigQueryGalleonsLedgerRow {
  tx_id: string;
  request_id: string;
  uid: string;
  direction: 'debit' | 'credit';
  amount: number;
  from_bank: number;
  from_pocket: number;
  balance_after: number;
  source_type: string;
  reason_code: string;
  created_at: number;
}

export function toBigQueryGalleonsLedgerRow(
  entry: GringottsLedgerEntry
): BigQueryGalleonsLedgerRow {
  return {
    tx_id: entry.txId,
    request_id: entry.requestId,
    uid: entry.uid,
    direction: entry.type,
    amount: entry.amount,
    from_bank: entry.fromBank,
    from_pocket: entry.fromPocket,
    balance_after: entry.balanceAfter,
    source_type: entry.sourceType,
    reason_code: entry.reasonCode,
    created_at: entry.createdAt,
  };
}

export interface FirestoreDocSnapshotLike {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

export interface FirestoreDocRefLike {
  get(): Promise<FirestoreDocSnapshotLike>;
  set(data: Record<string, unknown>): Promise<unknown>;
  delete(): Promise<unknown>;
}

export interface FirestoreCollectionRefLike {
  doc(docId: string): FirestoreDocRefLike;
}

export interface FirestoreTransactionLike {
  get(docRef: FirestoreDocRefLike): Promise<FirestoreDocSnapshotLike>;
  set(docRef: FirestoreDocRefLike, data: Record<string, unknown>): unknown;
  delete(docRef: FirestoreDocRefLike): unknown;
}

export interface FirestoreDbLike {
  collection(collectionName: string): FirestoreCollectionRefLike;
  runTransaction?<T>(updateFunction: (tx: FirestoreTransactionLike) => Promise<T>): Promise<T>;
}

/**
 * Định danh Named Firestore Database riêng mặc định cho game trên dự án dùng chung `hpvnn-archive`,
 * đảm bảo triển khai `firestore.rules`, `firestore.indexes.json` và toàn bộ dữ liệu nông trại
 * hoàn toàn tách biệt, KHÔNG bao giờ ghi đè hay đụng chạm database `(default)` của diễn đàn HPVN.
 */
export const DEFAULT_BURROW_FIRESTORE_DATABASE_ID = 'burrow-game';
export const DEFAULT_HPVN_WALLET_COLLECTION = 'galleons_accounts';
export const DEFAULT_HPVN_LEDGER_ROWS_COLLECTION = 'galleons_ledger_rows';

/**
 * Phân giải Database ID cho dữ liệu nông trại Hang Sóc (`burrow_*`).
 * Mặc định luôn trả về `'burrow-game'`; chỉ dùng `(default)` (`undefined`) khi cấu hình tường minh
 * `BURROW_FIRESTORE_DATABASE_ID=(default)`.
 */
export function resolveBurrowFirestoreDatabaseId(rawEnvDbId?: string | null): string | undefined {
  const trimmed = typeof rawEnvDbId === 'string' ? rawEnvDbId.trim() : '';
  if (!trimmed) {
    return DEFAULT_BURROW_FIRESTORE_DATABASE_ID;
  }
  if (trimmed === '(default)') {
    return undefined;
  }
  return trimmed;
}

/**
 * Phân giải Database ID cho Ví Galleon Gringotts dùng chung của diễn đàn HPVN (`galleons_accounts` & `galleons_ledger_rows`).
 * Mặc định luôn trả về `undefined` (tức database chính `(default)` của `hpvnn-archive`).
 */
export function resolveHpvnWalletFirestoreDatabaseId(rawEnvDbId?: string | null): string | undefined {
  const trimmed = typeof rawEnvDbId === 'string' ? rawEnvDbId.trim() : '';
  if (!trimmed || trimmed === '(default)') {
    return undefined;
  }
  return trimmed;
}

export interface FirestoreBackendStoreOptions {
  /**
   * Instance Firestore chứa Ví Galleon Gringotts của diễn đàn HPVN (`(default)` DB trên `hpvnn-archive`).
   * Nếu không truyền (như trong unit test đơn DB), mặc định dùng cùng `db`.
   */
  walletDb?: FirestoreDbLike;
  /**
   * Tên collection ví Galleon Gringotts của HPVN (mặc định `'galleons_accounts'`).
   */
  walletCollection?: string;
  /**
   * Tên collection sổ cái giao dịch bất biến chuẩn BigQuery của Gringotts (mặc định `'galleons_ledger_rows'`).
   */
  walletLedgerRowsCollection?: string;
  /**
   * Danh sách collection hồ sơ thành viên chỉ-đọc trên `walletDb` (`(default)` DB của `hpvnn-archive`)
   * dùng để tra cứu Nhà Hogwarts thực tế (`house`), `displayName` và `avatarUrl` khi Firebase Auth Token thiếu custom claim.
   */
  memberProfileCollections?: string[];
}

/**
 * Adapter lưu trữ tách đôi an toàn:
 *  1. Toàn bộ dữ liệu nông trại Hang Sóc nằm trên `db` (`burrow-game` Named DB) với tiền tố `burrow_*`:
 *     - `burrow_states/{uid}`, `burrow_public_layouts/{uid}`, `burrow_daily/{uid}_{YYYY-MM-DD}`
 *     - `burrow_ledger/{uid}`, `burrow_house_cup/{weekKey}`, `burrow_helpers/{hostUid}_{YYYY-MM-DD}`
 *     - `burrow_coop_requests/{hostUid}`, `burrow_friends/{friendCode}`, `burrow_leaderboards/{gameId}`
 *     - `burrow_config/sales`, `burrow_meta/visit_directory`, `burrow_save/{uid}`, `burrow_track/{id}`
 *  2. Riêng Ví Galleon Gringotts & dòng sổ cái BigQuery kết nối trực tiếp tới `walletDb` (`(default)` DB của HPVN):
 *     - `galleons_accounts/{uid}` (giữ nguyên mọi trường mở rộng của diễn đàn HPVN khi cập nhật số dư)
 *     - `galleons_ledger_rows/{txId}` (`source_type: 'burrow-garden-*'`)
 */
export class FirestoreBackendStore implements BackendKVStore {
  private readonly db: FirestoreDbLike;
  private readonly walletDb: FirestoreDbLike;
  private readonly walletCollection: string;
  private readonly walletLedgerRowsCollection: string;
  private readonly memberProfileCollections: string[];
  private readonly memberProfileCache = new Map<
    string,
    { profile: MemberIdentityProfile; expiresAt: number }
  >();
  private readonly writtenLedgerTxIds = new Set<string>();
  private readonly keyLockTails = new Map<string, Promise<void>>();

  constructor(db: FirestoreDbLike, options: FirestoreBackendStoreOptions = {}) {
    this.db = db;
    this.walletDb = options.walletDb ?? db;
    this.walletCollection =
      typeof options.walletCollection === 'string' && options.walletCollection.trim()
        ? options.walletCollection.trim()
        : DEFAULT_HPVN_WALLET_COLLECTION;
    this.walletLedgerRowsCollection =
      typeof options.walletLedgerRowsCollection === 'string' &&
      options.walletLedgerRowsCollection.trim()
        ? options.walletLedgerRowsCollection.trim()
        : DEFAULT_HPVN_LEDGER_ROWS_COLLECTION;
    const rawCollections =
      Array.isArray(options.memberProfileCollections) && options.memberProfileCollections.length > 0
        ? options.memberProfileCollections
        : ['users', this.walletCollection];
    this.memberProfileCollections = Array.from(
      new Set(
        rawCollections
          .map((c) => (typeof c === 'string' ? c.trim() : ''))
          .filter((c) => c.length > 0)
      )
    );
  }

  private resolveDocPath(rawKey: string): {
    targetDb: FirestoreDbLike;
    collection: string;
    docId: string;
    isWalletDoc: boolean;
  } {
    if (rawKey === 'burrow_sales_config') {
      return { targetDb: this.db, collection: 'burrow_config', docId: 'sales', isWalletDoc: false };
    }
    if (rawKey === 'burrow_visit_directory') {
      return {
        targetDb: this.db,
        collection: 'burrow_meta',
        docId: 'visit_directory',
        isWalletDoc: false,
      };
    }
    const colonIdx = rawKey.indexOf(':');
    if (colonIdx < 0) {
      return {
        targetDb: this.db,
        collection: 'burrow_kv',
        docId: rawKey.replace(/\//g, '_'),
        isWalletDoc: false,
      };
    }
    const prefix = rawKey.slice(0, colonIdx);
    const rest = rawKey.slice(colonIdx + 1).replace(/:/g, '_').replace(/\//g, '_');

    switch (prefix) {
      case 'burrow_states':
        return { targetDb: this.db, collection: 'burrow_states', docId: rest, isWalletDoc: false };
      case 'burrow_public_layout':
        return {
          targetDb: this.db,
          collection: 'burrow_public_layouts',
          docId: rest,
          isWalletDoc: false,
        };
      case 'burrow_daily':
        return { targetDb: this.db, collection: 'burrow_daily', docId: rest, isWalletDoc: false };
      case 'burrow_wallets':
        return {
          targetDb: this.walletDb,
          collection: this.walletCollection,
          docId: rest,
          isWalletDoc: true,
        };
      case 'burrow_ledger':
        return { targetDb: this.db, collection: 'burrow_ledger', docId: rest, isWalletDoc: false };
      case 'burrow_house_cup':
        return {
          targetDb: this.db,
          collection: 'burrow_house_cup',
          docId: rest,
          isWalletDoc: false,
        };
      case 'burrow_coop_req':
        return {
          targetDb: this.db,
          collection: 'burrow_coop_requests',
          docId: rest,
          isWalletDoc: false,
        };
      case 'burrow_helpers':
        return { targetDb: this.db, collection: 'burrow_helpers', docId: rest, isWalletDoc: false };
      case 'burrow_fire':
        return { targetDb: this.db, collection: 'burrow_fire', docId: rest, isWalletDoc: false };
      case 'burrow_friend':
      case 'friend':
        return { targetDb: this.db, collection: 'burrow_friends', docId: rest, isWalletDoc: false };
      case 'burrow_lb':
      case 'lb':
        return {
          targetDb: this.db,
          collection: 'burrow_leaderboards',
          docId: rest,
          isWalletDoc: false,
        };
      case 'burrow_save':
      case 'save':
        return { targetDb: this.db, collection: 'burrow_save', docId: rest, isWalletDoc: false };
      case 'burrow_track':
      case 'track':
        return { targetDb: this.db, collection: 'burrow_track', docId: rest, isWalletDoc: false };
      default:
        return {
          targetDb: this.db,
          collection: prefix.startsWith('burrow_') ? prefix : `burrow_${prefix}`,
          docId: rest,
          isWalletDoc: false,
        };
    }
  }

  private parseSnapshotData(data: Record<string, unknown> | undefined): string | null {
    if (!data) return null;
    if (
      typeof data._expiresAtMs === 'number' &&
      Number.isFinite(data._expiresAtMs) &&
      data._expiresAtMs <= Date.now()
    ) {
      return null;
    }
    if (typeof data.__rawJson === 'string') {
      return data.__rawJson;
    }
    if ('_expiresAtMs' in data || 'expiresAt' in data) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(data)) {
        if (k === '_expiresAtMs' || k === 'expiresAt') continue;
        clean[k] = v;
      }
      return JSON.stringify(clean);
    }
    return JSON.stringify(data);
  }

  private buildDocPayload(
    rawKey: string,
    collection: string,
    docId: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Record<string, unknown> {
    let docPayload: Record<string, unknown>;
    try {
      const parsedRaw = JSON.parse(value) as unknown;
      if (parsedRaw && typeof parsedRaw === 'object' && !Array.isArray(parsedRaw)) {
        docPayload = { ...(parsedRaw as Record<string, unknown>) };
      } else {
        docPayload = { __rawJson: value };
      }
    } catch {
      docPayload = { __rawJson: value };
    }

    // Gắn trường chủ sở hữu chuẩn Security Rules (`isDocUidOwner` / `isDocHostOwner`) cho các tài liệu bọc mảng
    if (collection === 'burrow_ledger') {
      docPayload.uid = docId;
    } else if (collection === 'burrow_helpers') {
      const parts = rawKey.split(':');
      if (parts.length >= 2 && parts[1]) {
        docPayload.hostUid = parts[1];
      }
    } else if (collection === 'burrow_coop_requests') {
      docPayload.hostUid = docId;
    }

    if (options?.expirationTtl && options.expirationTtl > 0) {
      const expiresAtMs = Date.now() + options.expirationTtl * 1000;
      docPayload._expiresAtMs = expiresAtMs;
      // Firestore Admin SDK chuyển `Date` sang `Timestamp` bản địa để chính sách Firestore TTL tự động dọn rác
      docPayload.expiresAt = new Date(expiresAtMs);
    }
    return docPayload;
  }

  private async withLocalKeysLock<T>(keys: ReadonlyArray<string>, fn: () => Promise<T>): Promise<T> {
    const sorted = Array.from(new Set(keys.filter(Boolean))).sort();
    const releases: Array<() => void> = [];
    for (const k of sorted) {
      const prev = this.keyLockTails.get(k) ?? Promise.resolve();
      let releaseCurrent!: () => void;
      const current = new Promise<void>((resolve) => {
        releaseCurrent = resolve;
      });
      const chained = prev.then(() => current);
      this.keyLockTails.set(k, chained);
      await prev;
      releases.push(() => {
        releaseCurrent();
        if (this.keyLockTails.get(k) === chained) {
          this.keyLockTails.delete(k);
        }
      });
    }
    try {
      return await fn();
    } finally {
      for (let i = releases.length - 1; i >= 0; i--) {
        releases[i]();
      }
    }
  }

  public async get(key: string): Promise<string | null> {
    const { targetDb, collection, docId } = this.resolveDocPath(key);
    const snap = await targetDb.collection(collection).doc(docId).get();
    if (!snap.exists) return null;
    return this.parseSnapshotData(snap.data());
  }

  public async put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void> {
    const { targetDb, collection, docId, isWalletDoc } = this.resolveDocPath(key);
    const docPayload = this.buildDocPayload(key, collection, docId, value, options);
    const ref = targetDb.collection(collection).doc(docId);
    if (isWalletDoc) {
      // Bảo toàn tuyệt đối mọi trường mở rộng trên tài liệu ví `galleons_accounts/{uid}` của diễn đàn HPVN
      if (typeof targetDb.runTransaction === 'function') {
        const runWalletTx = targetDb.runTransaction.bind(targetDb);
        await runWalletTx(async (fsTx) => {
          const existingSnap = await fsTx.get(ref);
          const merged = {
            ...(existingSnap.exists && existingSnap.data() ? existingSnap.data() : {}),
            ...docPayload,
          };
          fsTx.set(ref, merged);
        });
        return;
      }
      const existingSnap = await ref.get();
      const merged = {
        ...(existingSnap.exists && existingSnap.data() ? existingSnap.data() : {}),
        ...docPayload,
      };
      await ref.set(merged);
      return;
    }
    await ref.set(docPayload);
  }

  public async delete(key: string): Promise<void> {
    const { targetDb, collection, docId } = this.resolveDocPath(key);
    await targetDb.collection(collection).doc(docId).delete();
  }

  /**
   * Đọc – kiểm tra – cập nhật nguyên tử Ví Galleon Gringotts (`galleons_accounts/{uid}`) trên `walletDb`
   * bằng `runTransaction` độc lập, vừa chống chi tiêu đúp giữa diễn đàn HPVN & game, vừa giữ nguyên
   * mọi trường dữ liệu riêng của diễn đàn HPVN trên tài liệu ví.
   */
  public async mutateWallet(
    uid: string,
    mutator: (current: GringottsWalletDoc | null) => GringottsWalletDoc
  ): Promise<GringottsWalletDoc> {
    const cleanUid = uid.replace(/:/g, '_').replace(/\//g, '_');
    const ref = this.walletDb.collection(this.walletCollection).doc(cleanUid);

    const parseWalletDoc = (rawData: Record<string, unknown> | undefined): GringottsWalletDoc | null => {
      if (!rawData) return null;
      const sourceObj =
        typeof rawData.__rawJson === 'string'
          ? (JSON.parse(rawData.__rawJson) as Record<string, unknown>)
          : rawData;
      const balance = Math.max(0, Math.floor(Number(sourceObj.balance) || 0));
      const bankBalance = Math.max(0, Math.floor(Number(sourceObj.bankBalance) || 0));
      return {
        uid: cleanUid,
        balance,
        bankBalance,
        spendable: balance + bankBalance,
        frozen: Boolean(sourceObj.frozen),
        updatedAt: Math.floor(Number(sourceObj.updatedAt) || Date.now()),
      };
    };

    if (typeof this.walletDb.runTransaction === 'function') {
      const runWalletTx = this.walletDb.runTransaction.bind(this.walletDb);
      return runWalletTx(async (fsTx) => {
        const snap = await fsTx.get(ref);
        const rawData = snap.exists ? snap.data() : undefined;
        const current = parseWalletDoc(rawData);
        const updated = mutator(current);
        const merged: Record<string, unknown> = {
          ...(rawData ?? {}),
          uid: updated.uid || cleanUid,
          balance: updated.balance,
          bankBalance: updated.bankBalance,
          spendable: updated.spendable,
          frozen: updated.frozen,
          updatedAt: updated.updatedAt,
        };
        delete merged.__rawJson;
        fsTx.set(ref, merged);
        return updated;
      });
    }

    return this.withLocalKeysLock([`burrow_wallets:${cleanUid}`], async () => {
      const snap = await ref.get();
      const rawData = snap.exists ? snap.data() : undefined;
      const current = parseWalletDoc(rawData);
      const updated = mutator(current);
      const merged: Record<string, unknown> = {
        ...(rawData ?? {}),
        uid: updated.uid || cleanUid,
        balance: updated.balance,
        bankBalance: updated.bankBalance,
        spendable: updated.spendable,
        frozen: updated.frozen,
        updatedAt: updated.updatedAt,
      };
      delete merged.__rawJson;
      await ref.set(merged);
      return updated;
    });
  }

  /**
   * Chỉ ghi đúng các bút toán sổ cái vừa phát sinh trong giao dịch hiện tại
   * sang `galleons_ledger_rows/{txId}` trên `walletDb` chuẩn BigQuery Export của HPVN.
   */
  public async appendLedgerEntries(
    _uid: string,
    entries: ReadonlyArray<GringottsLedgerEntry>
  ): Promise<void> {
    for (const entry of entries) {
      if (!entry || typeof entry.txId !== 'string' || this.writtenLedgerTxIds.has(entry.txId)) {
        continue;
      }
      this.writtenLedgerTxIds.add(entry.txId);
      if (this.writtenLedgerTxIds.size > 4000) {
        const oldest = this.writtenLedgerTxIds.values().next().value;
        if (oldest) this.writtenLedgerTxIds.delete(oldest);
      }
      const row = toBigQueryGalleonsLedgerRow(entry);
      await this.walletDb
        .collection(this.walletLedgerRowsCollection)
        .doc(row.tx_id)
        .set(row as unknown as Record<string, unknown>);
    }
  }

  /**
   * Thực thi giao dịch nguyên tử đa tài liệu qua `db.runTransaction` của Firestore
   * (tự động tránh trộn `DocumentReference` khi `walletDb !== db`).
   */
  public async transact<T>(
    keys: string[],
    fn: (txStore: Pick<BackendKVStore, 'get' | 'put' | 'delete'>) => Promise<T>
  ): Promise<T> {
    const spansSeparateWalletDb =
      this.walletDb !== this.db && keys.some((k) => this.resolveDocPath(k).isWalletDoc);
    if (!spansSeparateWalletDb && typeof this.db.runTransaction === 'function') {
      const runTx = this.db.runTransaction.bind(this.db);
      return runTx(async (fsTx) => {
        const stagedWrites = new Map<
          string,
          { op: 'put'; value: string; options?: { expirationTtl?: number } } | { op: 'delete' }
        >();
        const result = await fn({
          get: async (key: string) => {
            const staged = stagedWrites.get(key);
            if (staged) {
              return staged.op === 'put' ? staged.value : null;
            }
            const { targetDb, collection, docId } = this.resolveDocPath(key);
            const snap = await fsTx.get(targetDb.collection(collection).doc(docId));
            if (!snap.exists) return null;
            return this.parseSnapshotData(snap.data());
          },
          put: async (key: string, value: string, options?: { expirationTtl?: number }) => {
            stagedWrites.set(key, { op: 'put', value, options });
          },
          delete: async (key: string) => {
            stagedWrites.set(key, { op: 'delete' });
          },
        });

        for (const [key, mutation] of stagedWrites.entries()) {
          const { targetDb, collection, docId } = this.resolveDocPath(key);
          const ref = targetDb.collection(collection).doc(docId);
          if (mutation.op === 'delete') {
            fsTx.delete(ref);
          } else {
            const payload = this.buildDocPayload(
              key,
              collection,
              docId,
              mutation.value,
              mutation.options
            );
            fsTx.set(ref, payload);
          }
        }
        return result;
      });
    }

    return this.withLocalKeysLock(keys, async () => {
      const stagedWrites = new Map<
        string,
        { op: 'put'; value: string; options?: { expirationTtl?: number } } | { op: 'delete' }
      >();
      const result = await fn({
        get: async (key: string) => {
          const staged = stagedWrites.get(key);
          if (staged) {
            return staged.op === 'put' ? staged.value : null;
          }
          return this.get(key);
        },
        put: async (key: string, value: string, options?: { expirationTtl?: number }) => {
          stagedWrites.set(key, { op: 'put', value, options });
        },
        delete: async (key: string) => {
          stagedWrites.set(key, { op: 'delete' });
        },
      });
      for (const [key, mutation] of stagedWrites.entries()) {
        if (mutation.op === 'delete') {
          await this.delete(key);
        } else {
          await this.put(key, mutation.value, mutation.options);
        }
      }
      return result;
    });
  }

  /**
   * Cộng điểm Cúp Nhà hàng tuần an toàn đồng thời bằng Firestore Transaction (`runTransaction`),
   * chống mất điểm khi nhiều thành viên nộp điểm cùng mili-giây.
   */
  public async incrementHouseCup(
    weekKey: string,
    house: HogwartsHouseName,
    delta: number,
    nowMs: number,
    rewardMin: number
  ): Promise<HouseCupWeekDoc> {
    const key = `burrow_house_cup:${weekKey}`;
    return this.transact([key], async (tx) => {
      const raw = await tx.get(key);
      let cup: HouseCupWeekDoc | null = null;
      if (raw) {
        try {
          cup = JSON.parse(raw) as HouseCupWeekDoc;
        } catch {
          cup = null;
        }
      }
      if (!cup || !cup.houses) {
        cup = {
          weekKey,
          houses: {
            Gryffindor: 120,
            Hufflepuff: 115,
            Ravenclaw: 118,
            Slytherin: 112,
          },
          rewardMin,
          updatedAt: nowMs,
        };
      }
      cup.houses[house] = Math.max(0, Math.floor(Number(cup.houses[house] || 0) + delta));
      cup.updatedAt = nowMs;
      tx.put(key, JSON.stringify(cup), { expirationTtl: 86_400 * 21 });
      return cup;
    });
  }

  /**
   * Đọc hồ sơ thành viên thực tế (chỉ-đọc 100%, KHÔNG bao giờ ghi) từ `walletDb` (`(default)` DB của diễn đàn HPVN)
   * để lấy đúng Nhà Hogwarts (`Hufflepuff`, `Ravenclaw`, `Slytherin`, `Gryffindor`), tên hiển thị và ảnh đại diện
   * ngay cả khi Firebase ID Token không gắn custom claim `house` hoặc viết thường.
   */
  public async resolveMemberIdentityProfile(uid: string): Promise<MemberIdentityProfile | null> {
    const cleanUid = sanitizeBackendUid(uid);
    const docId = cleanUid.replace(/:/g, '_').replace(/\//g, '_');
    const nowMs = Date.now();
    const cached = this.memberProfileCache.get(docId);
    if (cached && cached.expiresAt > nowMs) {
      return cached.profile;
    }

    let resolvedHouse: HogwartsHouseName | undefined;
    let resolvedUsername: string | undefined;
    let resolvedAvatarUrl: string | undefined;

    for (const colName of this.memberProfileCollections) {
      try {
        const snap = await this.walletDb.collection(colName).doc(docId).get();
        if (!snap.exists) continue;
        const fields = extractMemberProfileFields(snap.data());
        if (!resolvedHouse && fields.house) {
          resolvedHouse = fields.house;
        }
        if (!resolvedUsername && fields.username) {
          resolvedUsername = fields.username;
        }
        if (!resolvedAvatarUrl && fields.avatarUrl) {
          resolvedAvatarUrl = fields.avatarUrl;
        }
        if (resolvedHouse && resolvedUsername) {
          break;
        }
      } catch {
        // Bỏ qua collection không tồn tại hoặc không có quyền đọc
      }
    }

    if (!resolvedHouse && !resolvedUsername && !resolvedAvatarUrl) {
      return null;
    }

    const profile: MemberIdentityProfile = {
      ...(resolvedHouse ? { house: resolvedHouse } : {}),
      ...(resolvedUsername ? { username: resolvedUsername } : {}),
      ...(resolvedAvatarUrl ? { avatarUrl: resolvedAvatarUrl } : {}),
    };

    if (resolvedHouse) {
      this.memberProfileCache.set(docId, {
        profile,
        expiresAt: nowMs + 10 * 60_000,
      });
      if (this.memberProfileCache.size > 2000) {
        const oldestKey = this.memberProfileCache.keys().next().value;
        if (oldestKey) this.memberProfileCache.delete(oldestKey);
      }
    }

    return profile;
  }
}

export interface FirebaseCallableRequestLike {
  data: Record<string, unknown>;
  auth?: {
    uid: string;
    token?: Record<string, unknown> & {
      house?: string;
      saleAdmin?: boolean;
      role?: string;
      name?: string;
      username?: string;
      picture?: string;
      avatarUrl?: string;
    };
  } | null;
}

export interface FirebaseHttpsErrorCtorLike {
  new (
    code:
      | 'unauthenticated'
      | 'permission-denied'
      | 'not-found'
      | 'already-exists'
      | 'aborted'
      | 'resource-exhausted'
      | 'failed-precondition'
      | 'invalid-argument'
      | 'unavailable',
    message: string,
    details?: Record<string, unknown>
  ): Error;
}

function mapHttpStatusToFirebaseErrorCode(
  status: number,
  reason: string
):
  | 'unauthenticated'
  | 'permission-denied'
  | 'not-found'
  | 'aborted'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'unavailable' {
  if (status === 401) return 'unauthenticated';
  if (status === 403) return 'permission-denied';
  if (status === 404) return 'not-found';
  if (
    status === 409 ||
    reason === 'revision-conflict' ||
    reason === 'request-id-conflict' ||
    reason === 'friend-code-taken'
  ) {
    return 'aborted';
  }
  if (status === 429) return 'resource-exhausted';
  if (status === 503 || status === 500) return 'unavailable';
  return 'failed-precondition';
}

/**
 * Tạo bộ 8 hàm Callable chuẩn Firebase Cloud Functions v2 (`asia-southeast1`).
 */
export function createFirebaseGardenCallables(
  backend: BurrowAuthoritativeBackend,
  HttpsErrorCtor?: FirebaseHttpsErrorCtorLike
): Record<string, (req: FirebaseCallableRequestLike) => Promise<Record<string, unknown>>> {
  const wrap = (callableName: string) => {
    return async (req: FirebaseCallableRequestLike): Promise<Record<string, unknown>> => {
      if (!req.auth?.uid) {
        if (HttpsErrorCtor) {
          throw new HttpsErrorCtor('unauthenticated', 'Cần đăng nhập tài khoản để vào thung lũng.', {
            reason: 'unauthorized',
          });
        }
        throw new BurrowServerError('unauthorized', 'Cần đăng nhập tài khoản.', {}, 401);
      }

      const tokenFields = extractMemberProfileFields(req.auth.token);
      const house: HogwartsHouseName = tokenFields.house ?? 'Gryffindor';
      const tokenName = tokenFields.username;
      const tokenAvatar = tokenFields.avatarUrl;

      const identity: VerifiedSessionIdentity = {
        uid: sanitizeBackendUid(req.auth.uid),
        house,
        houseExplicit: Boolean(tokenFields.house),
        role:
          req.auth.token?.saleAdmin === true || req.auth.token?.role === 'saleAdmin'
            ? 'saleAdmin'
            : 'member',
        authenticatedVia: 'firebase-id-token',
        ...(typeof tokenName === 'string' && tokenName.trim()
          ? { username: tokenName.trim().slice(0, 42) }
          : {}),
        ...(typeof tokenAvatar === 'string' && tokenAvatar.trim()
          ? { avatarUrl: tokenAvatar.trim().slice(0, 260) }
          : {}),
      };

      try {
        return await backend.handleCallable(callableName, req.data ?? {}, identity);
      } catch (err) {
        if (err instanceof BurrowServerError && HttpsErrorCtor) {
          const code = mapHttpStatusToFirebaseErrorCode(err.httpStatus, err.reason);
          throw new HttpsErrorCtor(code, err.message, err.details);
        }
        throw err;
      }
    };
  };

  return {
    getBurrowGarden: wrap('getBurrowGarden'),
    performBurrowAction: wrap('performBurrowAction'),
    getBurrowLeaderboard: wrap('getBurrowLeaderboard'),
    submitBurrowLeaderboard: wrap('submitBurrowLeaderboard'),
    buyBurrowSupplies: wrap('buyBurrowSupplies'),
    sellBurrowGoods: wrap('sellBurrowGoods'),
    settleBurrowWallet: wrap('settleBurrowWallet'),
    visitBurrowGarden: wrap('visitBurrowGarden'),
    extinguishBurrowGarden: wrap('extinguishBurrowGarden'),
    setBurrowFlooFrame: wrap('setBurrowFlooFrame'),
    manageBurrowSales: wrap('manageBurrowSales'),
    getBurrowHouseCupStandings: wrap('getBurrowHouseCupStandings'),
    contributeBurrowHouseCup: wrap('contributeBurrowHouseCup'),
    postBurrowCoopRequest: wrap('postBurrowCoopRequest'),
    fulfillBurrowCoopRequest: wrap('fulfillBurrowCoopRequest'),
    getBurrowCoopRequests: wrap('getBurrowCoopRequests'),
  };
}

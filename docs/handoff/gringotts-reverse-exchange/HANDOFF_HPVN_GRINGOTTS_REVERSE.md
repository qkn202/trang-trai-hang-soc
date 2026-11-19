# Handoff HPVN Backend — Quầy Gringotts 2 Chiều: Đổi Ngược Sickle → Galleons (Cách 1)

Tài liệu này mô tả thay đổi phía máy chủ HPVN (`functions/games/trang-trai-hang-soc.js`) để mở chiều đổi ngược **`Sickle → Galleons`** trong **Quầy Gringotts** theo đúng **Cách 1** (bảo vệ tiền tệ hoàn toàn ở phía máy chủ, không dựa vào khóa DevTools).

- **Tỷ lệ mặc định theo yêu cầu:** **`1.000.000 Sickle → 100.000 Galleons`** (`reverseSicklePerGalleon = 10`, tức `10 Sickle = 1 Galleon`).
- **Tương thích ngược 100%:** Client (`src/hpvn/exchange.ts`) chỉ hiển thị mục đổi ngược khi `op: 'wallet'` trả về `reverseEnabled: true`. Trước khi deploy patch backend này, Quầy Gringotts vẫn giữ chế độ 1 chiều cũ bình thường.

---

## 1. Cấu hình ACP & Chặn Arbitrage (Mua đi bán lại ăn lời)

Bổ sung cấu hình trong tài liệu config Quầy Gringotts trên Firestore / ACP:

```json
{
  "enabled": true,
  "sicklePerGalleon": 1,
  "packs": [100, 500, 1000],

  "reverseEnabled": true,
  "reverseSicklePerGalleon": 10,
  "reversePacks": [1000000],
  "reverseMinLevel": 10,
  "reverseDailyCapGalleons": 100000,
  "reverseWeeklyCapGalleons": 300000,
  "maxSickleGainPerSave": 25000,
  "maxSickleGainPerDay": 150000
}
```

**Bắt buộc kiểm tra Spread chống ăn chênh lệch (Anti-Arbitrage):**
```js
// Nếu chiều mua vào 1 Galleon mua được X Sickle, thì chiều bán ra phải tốn NHIỀU HƠN X Sickle mới đổi được 1 Galleon!
// Ví dụ: mua 1 Galleon -> 1 Sickle (hoặc 2 Sickle), bán 10 Sickle -> 1 Galleon (an toàn: 10 > 1).
if (cfg.reverseSicklePerGalleon <= cfg.sicklePerGalleon) {
  throw new HttpsError('failed-precondition', 'Tỷ lệ đổi ngược phải lớn hơn tỷ lệ nạp vào.');
}
```

---

## 2. Trả dữ liệu mở rộng ở `op: 'wallet'`

Khi client gọi `request('farm', { op: 'wallet' })`, trả thêm các trường sau (cùng các trường cũ):

```json
{
  "enabled": true,
  "sicklePerGalleon": 1,
  "packs": [100, 500, 1000],
  "balance": 250000,

  "reverseEnabled": true,
  "reverseSicklePerGalleon": 10,
  "reversePacks": [1000000],
  "reverseMinLevel": 10,
  "reverseDailyCapGalleons": 100000,
  "reverseTodayGalleons": 0,
  "reverseWeeklyCapGalleons": 300000,
  "reverseWeekGalleons": 0,
  "reverseFlagged": false,
  "reverseBlockedReason": ""
}
```

---

## 3. Lớp bảo vệ số 1: Kiểm tra biến động Sickle bất thường ngay trong `op: 'save'`

Lưu một sub-object riêng **`audit`** trên doc server của thành viên (không nằm trong chuỗi JSON `save` của client) để giám sát mức tăng Sickle hợp lệ giữa các lần lưu:

```js
// Trong handler op === 'save' (sau khi parse nextSaveObj và đọc prevSaveObj từ Firestore):
const prevSickles = Math.max(0, Math.floor(Number(prevSaveObj?.galleons) || 0));
const nextSickles = Math.max(0, Math.floor(Number(nextSaveObj?.galleons) || 0));
const deltaSickles = nextSickles - prevSickles;

// Trừ đi lượng Sickle hợp pháp vừa nạp từ Quầy Gringotts / Cúp Đợt qua inbox (nếu có)
const legitimateInboxSickles = Math.max(0, Math.floor(Number(memberMeta?.pendingInboxSickles || 0)));
const organicGain = Math.max(0, deltaSickles - legitimateInboxSickles);

const todayKey = getVietnamDateKey(); // 'YYYY-MM-DD'
const todayGain =
  (memberMeta?.sickleAuditDayKey === todayKey ? Number(memberMeta.todayOrganicSickleGain || 0) : 0) +
  organicGain;

const suspiciousSingleSave = organicGain > (cfg.maxSickleGainPerSave || 25000);
const suspiciousDailyTotal = todayGain > (cfg.maxSickleGainPerDay || 150000);

if (suspiciousSingleSave || suspiciousDailyTotal) {
  // Gắn cờ khóa đổi ngược & ghi log cảnh báo cho Admin kiểm tra trong ACP
  memberMeta.reverseFlagged = true;
  memberMeta.reverseBlockedReason = 'Tài khoản đang tạm khóa đổi ngược để kiểm tra biến động Sickle bất thường.';
  await db.collection('gameAuditLogs').add({
    uid,
    kind: 'sickle_spike',
    prevSickles,
    nextSickles,
    organicGain,
    todayGain,
    createdAt: FieldValue.serverTimestamp(),
  });
}

memberMeta.sickleAuditDayKey = todayKey;
memberMeta.todayOrganicSickleGain = todayGain;
memberMeta.pendingInboxSickles = 0;
```

---

## 4. Lớp bảo vệ số 2: Giao dịch nguyên tử `op: 'galleons'` (Trừ Sickle trong Firestore + Cộng ví Galleons)

Client gọi `request('farm', { op: 'galleons', sickles, requestId })` sau khi đã `flushFarmSave()`. Server xử lý hoàn toàn trong **1 Firestore Transaction**:

```js
// Handler op === 'galleons'
const sickles = Math.floor(Number(data?.sickles) || 0);
const requestId = String(data?.requestId || '').trim();
if (!requestId || requestId.length > 80) {
  throw new HttpsError('invalid-argument', 'Thiếu mã giao dịch hợp lệ.');
}
if (!cfg.reverseEnabled || !Array.isArray(cfg.reversePacks) || !cfg.reversePacks.includes(sickles)) {
  throw new HttpsError('failed-precondition', 'Gói đổi Sickle → Galleons không hợp lệ hoặc đang đóng.');
}
if (cfg.reverseSicklePerGalleon <= cfg.sicklePerGalleon) {
  throw new HttpsError('failed-precondition', 'Cấu hình tỷ lệ đổi ngược chưa hợp lệ.');
}

const galleonsOut = Math.floor(sickles / cfg.reverseSicklePerGalleon); // 1.000.000 / 10 = 100.000 Galleons
if (galleonsOut <= 0) {
  throw new HttpsError('invalid-argument', 'Số lượng quy đổi không hợp lệ.');
}

const receiptRef = db.collection('farmExchangeReceipts').doc(`${uid}_rev_${requestId}`);
const todayKey = getVietnamDateKey();
const weekKey = getIsoWeekKey();

return await db.runTransaction(async (tx) => {
  // 1. Idempotency: nếu requestId đã xử lý trước đó (do rớt mạng retry), trả lại kết quả cũ, KHÔNG cộng đúp!
  const receiptSnap = await tx.get(receiptRef);
  if (receiptSnap.exists) {
    return receiptSnap.data().reply;
  }

  const farmSnap = await tx.get(farmDocRef);
  const userSnap = await tx.get(userDocRef);
  if (!farmSnap.exists || !userSnap.exists) {
    throw new HttpsError('failed-precondition', 'Chưa tìm thấy dữ liệu trang trại hoặc tài khoản HPVN.');
  }

  const farmData = farmSnap.data();
  const meta = farmData.reverseMeta || {};
  if (meta.reverseFlagged) {
    throw new HttpsError(
      'permission-denied',
      meta.reverseBlockedReason || 'Tài khoản đang tạm khóa đổi ngược do biến động Sickle bất thường.'
    );
  }

  const savedObj = JSON.parse(String(farmData.save || '{}'));
  const farmLevel = Math.max(1, Math.floor(Number(savedObj.level) || 1));
  if (farmLevel < (cfg.reverseMinLevel || 10)) {
    throw new HttpsError('failed-precondition', `Cần Điền Trang đạt Cấp ${cfg.reverseMinLevel || 10} trở lên.`);
  }

  // 2. Khóa trần cứng ngày & tuần trên server
  const todayUsed = meta.dayKey === todayKey ? Math.max(0, Math.floor(Number(meta.todayGalleons) || 0)) : 0;
  const weekUsed = meta.weekKey === weekKey ? Math.max(0, Math.floor(Number(meta.weekGalleons) || 0)) : 0;

  if (cfg.reverseDailyCapGalleons > 0 && todayUsed + galleonsOut > cfg.reverseDailyCapGalleons) {
    throw new HttpsError('resource-exhausted', `Đã đạt hạn mức đổi ngày (${todayUsed}/${cfg.reverseDailyCapGalleons} Galleons).`);
  }
  if (cfg.reverseWeeklyCapGalleons > 0 && weekUsed + galleonsOut > cfg.reverseWeeklyCapGalleons) {
    throw new HttpsError('resource-exhausted', `Đã đạt hạn mức đổi tuần (${weekUsed}/${cfg.reverseWeeklyCapGalleons} Galleons).`);
  }

  // 3. Kiểm tra & trừ trực tiếp Sickle trong bản save Firestore
  const savedSickles = Math.max(0, Math.floor(Number(savedObj.galleons) || 0));
  if (savedSickles < sickles) {
    throw new HttpsError('failed-precondition', `Không đủ ${sickles.toLocaleString('vi-VN')} Sickle trong trang trại.`);
  }
  const remainingSickles = savedSickles - sickles;
  savedObj.galleons = remainingSickles;

  const prevWalletBal = Math.max(0, Math.floor(Number(userSnap.data().galleons) || 0));
  const nextWalletBal = prevWalletBal + galleonsOut;

  const reply = {
    balance: nextWalletBal,
    galleons: galleonsOut,
    sicklesDeducted: sickles,
    remainingSickles,
    reverseTodayGalleons: todayUsed + galleonsOut,
    reverseDailyCapGalleons: cfg.reverseDailyCapGalleons,
    reverseWeekGalleons: weekUsed + galleonsOut,
    reverseWeeklyCapGalleons: cfg.reverseWeeklyCapGalleons,
  };

  tx.update(farmDocRef, {
    save: JSON.stringify(savedObj),
    reverseMeta: {
      ...meta,
      dayKey: todayKey,
      todayGalleons: todayUsed + galleonsOut,
      weekKey,
      weekGalleons: weekUsed + galleonsOut,
      lastReverseAt: FieldValue.serverTimestamp(),
    },
  });
  tx.update(userDocRef, { galleons: nextWalletBal });
  tx.set(receiptRef, { uid, requestId, sickles, galleonsOut, reply, createdAt: FieldValue.serverTimestamp() });

  return reply;
});
```

---

## 5. Khuyến nghị vận hành ACP
- Khi có cảnh báo `sickle_spike` trong `gameAuditLogs`, admin xem lại lịch sử rồi mới quyết định mở lại `reverseFlagged = false` hoặc giữ khóa.
- Bất cứ lúc nào muốn điều chỉnh tỷ lệ hoặc tạm đóng chiều đổi ngược mà không cần deploy lại game, admin chỉ cần sửa `reverseEnabled`, `reverseSicklePerGalleon`, `reversePacks`, `reverseDailyCapGalleons`, `reverseWeeklyCapGalleons` trong ACP.

# Hợp Đồng Backend HPVN 2 Chiều — Sạp Đầu Ngõ & Kiện Hàng Liên Minh

Tài liệu đặc tả 3 thao tác (`op`) mở rộng trên callable `trangTraiHangSoc` của cổng **HPVN** để bật giao dịch **2 chiều atomic** cho Sạp Đầu Ngõ (`roadsideStand`) và quỹ tuần chung của Kiện Hàng Tương Trợ (`coopSupplyCrate`).

> **Khả năng tương thích ngược (Zero-Breaking):** Client trong repo `congviengiaitri` đã hoàn thiện toàn bộ tầng gọi RPC (`src/hpvn/social.ts`), xử lý hòm thư (`src/hpvn/inbox.ts`), và tự động dự phòng mượt sang chế độ đồng bộ snapshot cục bộ nếu server HPVN chưa bật 3 `op` dưới đây.

---

## 1. `op: 'stand-buy'` — Mua Lô Hàng 2 Chiều Atomic Trên Sạp Đầu Ngõ

### Request (từ `src/hpvn/social.ts -> buyRoadsideStand`)
```json
{
  "op": "stand-buy",
  "hostUid": "uid_chu_vuon",
  "slotIndex": 0,
  "itemId": "cinnamon_apple_pie",
  "qty": 2,
  "totalSickle": 56,
  "requestId": "stand_1795400000000_a1b2c3"
}
```

### Xử lý phía server (Firestore `runTransaction`)
1. Chặn tự mua (`buyerUid === hostUid` → trả lỗi `code: 'SELF_BUY'`).
2. Kiểm tra idempotency theo `requestId` trong subcollection `standSales/{requestId}` (nếu đã xử lý → trả lại kết quả thành công cũ).
3. Đọc bản lưu (`save`) hoặc trạng thái khóa ô sạp `standLocks/{hostUid}_{slotIndex}` của `hostUid`:
   - Nếu ô `slotIndex` đã bán trong lần rao hiện tại (`listedAt`) → trả `code: 'ALREADY_SOLD'` hoặc `'SLOT_EMPTY'`.
4. Ghi khóa `standLocks/{hostUid}_{slotIndex} = { listedAt, buyerUid, buyerName, at }`.
5. Ghi 1 mục vào **Inbox của chủ vườn (`hostUid`)** với số thứ tự `seq` tăng dần:
   ```json
   {
     "seq": 104,
     "kind": "stand-sale",
     "uid": "uid_nguoi_mua",
     "name": "Tên Người Mua HPVN",
     "at": 1795400000000,
     "slotIndex": 0,
     "itemId": "cinnamon_apple_pie",
     "qty": 2,
     "sickle": 56
   }
   ```
6. Trả về cho người mua:
   ```json
   {
     "ok": true,
     "sickleCharged": 56,
     "itemId": "cinnamon_apple_pie",
     "qty": 2,
     "inboxSeq": 104
   }
   ```

### Cách client chủ vườn nhận tiền (`src/hpvn/inbox.ts -> applyFarmInbox`)
- Nếu ô sạp `slotIndex` trên vườn nhà vẫn đang rao (`!soldAt`), client đánh dấu ô đó **đã bán cho `name`** để chủ vườn bấm thu Sickle.
- Nếu ô sạp đã trống/đã thu trước đó, client cộng thẳng `sickle` vào ví `galleons` và ghi nhận `creditVerifiedInboxGrant` → **không bao giờ mất tiền hay cộng trùng**.

---

## 2. `op: 'coop-status'` — Đọc Tiến Độ Kiện Hàng Tuần Chung Toàn HPVN

### Request (`src/hpvn/social.ts -> fetchCoopCrate`)
```json
{
  "op": "coop-status",
  "weekKey": "2026-W47"
}
```

### Response
```json
{
  "weekKey": "2026-W47",
  "totalPoints": 340,
  "contributors": [
    { "uid": "u1", "displayName": "Hermione HPVN", "avatarEmoji": "📚", "points": 140 },
    { "uid": "u2", "displayName": "Luna HPVN", "avatarEmoji": "🌙", "points": 120 }
  ]
}
```

---

## 3. `op: 'coop-contribute'` — Ghi Nhận Đóng Góp Vào Quỹ Tuần Chung

### Request (`src/hpvn/social.ts -> contributeCoopCrate`)
```json
{
  "op": "coop-contribute",
  "weekKey": "2026-W47",
  "itemId": "ottery_wheat",
  "qty": 2,
  "points": 28,
  "requestId": "coop_1795400000000_x9y8z7"
}
```

### Xử lý phía server (Firestore `runTransaction`)
1. Chặn trùng lặp bằng `requestId` trong `coopWeeks/{weekKey}/ledger/{requestId}`.
2. Kẹp `points` trong ngưỡng hợp lệ (`1 .. 120` mỗi lượt, tối đa `12` lượt/ngày/thành viên).
3. Cộng dồn `totalPoints += points` và cập nhật `contributors[uid]` trên document `coopWeeks/{weekKey}`.
4. Trả về đúng cấu trúc giống `coop-status` (top 12 thành viên đóng góp tuần).

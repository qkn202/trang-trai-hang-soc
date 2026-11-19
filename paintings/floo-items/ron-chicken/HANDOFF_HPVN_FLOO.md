# Hướng Dẫn Bàn Giao (Handoff): Gắn Khung Bong Bóng Chibi Ron Ăn Đùi Gà Cho User ID `sun190` (Thời Hạn 7 Ngày) Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ tài nguyên đồ họa (`1x`/`2x` WebP + PNG dự phòng, dung lượng `7.2 KB – 24.4 KB`) và stylesheet chuẩn cấu trúc `.shout-message-row[data-store-frame="ron-chicken"]` của Mạng Floo để người quản trị repo **`hpvn-archive.net`** tích hợp cho tài khoản có **user ID / username: `sun190`** với **thời hạn sử dụng đúng `7 ngày` (`168 giờ`)**.

---

## 1. Thông số & danh mục file bàn giao (trong thư mục `ron-chicken/`)

- **Tài khoản nhận khung**: user ID / username **`sun190`** *(không mở bán trên Hẻm Xéo)*.
- **Thời hạn sử dụng**: **`7 ngày` (`168 giờ` = `604.800.000 ms`)** tính từ thời điểm kích hoạt *(hết 7 ngày tự động quay về bong bóng mặc định)*.
- **Mã khung (`data-store-frame`)**: **`"ron-chicken"`** *(nền Cam Đào Tóc Ron + không gắn góc trên + Chibi Ron ăn đùi gà viền sticker kem-nâu)*.

Toàn bộ gói sạch gồm **6 file** nằm gọn trong thư mục này:

| File | Kích thước pixel | Dung lượng | Công dụng |
|---|---|---|---|
| `ron-sticker.webp` | `120×120` (`1x`) | `7.2 KB` | Charm **Chibi Ron Ăn Đùi Gà Viền Sticker Kem-Nâu** gắn góc dưới `::after` (`58×58 px`). |
| `ron-sticker-2x.webp` | `240×240` (`2x`) | `16.2 KB` | Bản Retina `2x` sắc nét của **Chibi Ron Ăn Đùi Gà**. |
| `ron-sticker.png` | `120×120` (`1x`) | `24.4 KB` | Bản PNG dự phòng cho trình duyệt cũ. |
| `ron-chicken-floo.css` | — | `~3.5 KB` | Stylesheet hoàn chỉnh cho `data-store-frame="ron-chicken"` (nền Cam Đào + không gắn `::before` + Ron viền sticker kem-nâu `::after`). Đã xử lý đầy đủ `.is-self`, `.is-self-shared-direction`, `.is-prisoner-censored`, `.shout-image-album.is-stack`, Forced Colors Mode, link & trích dẫn. |
| `preview.html` | — | — | Trang xem trước độc lập (hiển thị mẫu tin nhắn của `sun190`) để kiểm tra trực tiếp trước khi deploy. |

---

## 2. Các bước tích hợp bên repo `hpvn-archive.net` (dành cho Dev nắm repo HPVN)

### Bước 1 — Tra `uid` của tài khoản có user ID / username `sun190`
Trong Firestore `(default)` của project `hpvnn-archive` (collection `usernames/sun190` hoặc `users` có `username == "sun190"` / `usernameLower == "sun190"` — tương tự như lúc tra `kimchi` và `Aries`), lấy mã Firebase Auth **`uid`** của tài khoản **`sun190`** (ký hiệu bên dưới là `<SUN190_UID>`).

### Bước 2 — Copy 3 file ảnh vào `public/`
Copy 3 file ảnh trong thư mục `ron-chicken/` vào thư mục `public` của repo Next.js `hpvn-archive.net` theo đúng đường dẫn:

```text
public/images/floo-items/ron-chicken/
  ├─ ron-sticker.webp
  ├─ ron-sticker-2x.webp
  └─ ron-sticker.png
```

*(Đường dẫn URL sau khi build sẽ khớp sẵn với `/images/floo-items/ron-chicken/...` trong `ron-chicken-floo.css`).*

### Bước 3 — Nhúng CSS khung bong bóng
Dán nội dung file `ron-chicken-floo.css` (hoặc `@import`) vào file CSS diện mạo Mạng Floo / Shoutbox (ngay cạnh các rule `"burrow-candy-amber"` của `kimchi` và `"ravenclaw-luna"` của `Aries`).

### Bước 4 — Gắn khung cho `sun190` kèm giới hạn thời hạn đúng `7 ngày`
Chọn **1 trong 2 phương án** dưới đây (đều tự động hết hạn sau đúng 7 ngày, không cần deploy lại để gỡ tay):

#### Phương án A — Gắn trực tiếp theo `uid` của `sun190` kèm mốc hết hạn `7 ngày` trong `decorateRow` *(Khuyên dùng — 5 dòng, không đụng Backend/Firestore/Hẻm Xéo)*
1. Thêm `"ron-chicken"` vào `Set` whitelist `storeFrame` (cùng chỗ với `"burrow-candy-amber"`, `"ravenclaw-luna"`).
2. Khai báo mốc hết hạn `SUN190_EXPIRES_AT_MS` = thời điểm deploy/kích hoạt **+ 7 ngày** (ví dụ nếu kích hoạt lúc `2026-11-19T15:00:00+07:00` thì hết hạn lúc `2026-11-26T15:00:00+07:00`):

```ts
const EXCLUSIVE_USER_FRAMES: Record<string, { frame: string; expiresAtMs?: number }> = {
  '<KIMCHI_UID>': { frame: 'burrow-candy-amber' }, // user: kimchi (vĩnh viễn)
  '<ARIES_UID>':  { frame: 'ravenclaw-luna' },      // user: Aries (vĩnh viễn)
  '<SUN190_UID>': {
    frame: 'ron-chicken',                           // user ID: sun190 (thời hạn 7 ngày)
    expiresAtMs: Date.parse('2026-11-26T23:59:59+07:00'), // Thay bằng đúng mốc (ngày kích hoạt + 7 ngày)
  },
};

function resolveExclusiveFrame(uid: string): string | undefined {
  const entry = EXCLUSIVE_USER_FRAMES[uid];
  if (!entry) return undefined;
  if (entry.expiresAtMs !== undefined && Date.now() >= entry.expiresAtMs) {
    return undefined; // Tự động hết hạn sau 7 ngày
  }
  return entry.frame;
}

// Bên trong decorateRow(uid, props):
decorateRow: (uid, props) => {
  if (!enabled || !uid || framesHidden) return props;
  const activeFrame =
    resolveStoreFrameKey(cache[uid]?.appearance) ??
    resolveExclusiveFrame(uid);
  return {
    ...props,
    ...(activeFrame ? { 'data-store-frame': activeFrame } : {}),
  };
}
```
> **Ưu điểm:**
> - Gom chung sạch đẹp với `kimchi` và `Aries` trong cùng 1 bảng `EXCLUSIVE_USER_FRAMES`.
> - Đúng thời điểm hết 7 ngày (`Date.now() >= entry.expiresAtMs`), khung tự động ngắt về mặc định mà không cần sửa code hay deploy lại.
> - Nếu trong 7 ngày đó `sun190` bật thử khung Hẻm Xéo khác thì khung đó vẫn ưu tiên hiển thị (`resolveStoreFrameKey(...) ?? ...`), tắt đi sẽ quay lại khung Ron ăn đùi gà cho tới khi hết hạn 7 ngày.

#### Phương án B — Cấp qua Lease `appearance-frame` có thời hạn `168 giờ (7 ngày)` trên Firestore *(Nếu muốn hiện đồng hồ đếm ngược trong menu “Biến hình” của riêng `sun190`)*
1. Thêm `"ron-chicken"` vào `Set` whitelist `storeFrame` ở cả frontend & backend (`getShoutAvatarProfiles` / `switchGringottsAppearance`).
2. Thêm mục cấu hình item diện mạo ẩn (không hiển thị trên kệ mua Hẻm Xéo `/gringotts/hem-xeo`, chỉ nằm trong danh mục tra cứu của menu **Biến hình**):
   - `id` / `canonicalPowerId`: `"ron-chicken"`
   - `vietnameseName`: `"Ron Ăn Đùi Gà (7 Ngày)"`
   - `ability`: `"chat-frame-lease"`
   - `parameters`: `{ durationHours: 168, frameKey: "ron-chicken" }`
   - `permanentOnPurchase`: `false`
3. Ghi lease `appearance-frame` cho duy nhất `<SUN190_UID>` (user `sun190`) trên Firestore `(default)` với `key: "ron-chicken"`, `permanent: false`, `expiresAt = Timestamp.fromMillis(Date.now() + 7 * 24 * 60 * 60 * 1000)` (`+7 ngày`) và tăng `appearanceRevision`.

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

Bạn có thể copy nguyên đoạn dưới đây gửi kèm thư mục `ron-chicken/`:

> Nhờ bạn gắn giúp mình thêm 1 khung bong bóng tin nhắn Mạng Floo thiết kế riêng (**Chibi Ron Ăn Đùi Gà: Nền Cam Đào & Viền Sticker Kem-Nâu — `ron-chicken`**) chỉ định riêng cho tài khoản có **user ID / username: `sun190`** với **thời hạn sử dụng đúng `7 ngày`** (không mở bán ở Hẻm Xéo, hết 7 ngày tự động tắt):
> 1. Copy 3 file ảnh (`ron-sticker.webp`, `ron-sticker-2x.webp`, `ron-sticker.png`) trong gói `ron-chicken/` vào `public/images/floo-items/ron-chicken/`.
> 2. Dán file `ron-chicken-floo.css` vào stylesheet `data-store-frame` của Shoutbox/Floo (ngay cạnh rule của `kimchi` và `Aries`).
> 3. Tra `uid` của tài khoản `sun190`, thêm `"ron-chicken"` vào `Set` whitelist frame và thêm `<SUN190_UID>` vào bảng `EXCLUSIVE_USER_FRAMES` kèm mốc `expiresAtMs` = **ngày kích hoạt + 7 ngày** để hết 7 ngày khung tự ngắt không cần gỡ tay (code mẫu có sẵn ở Mục 2 – Phương án A trong file `HANDOFF_HPVN_FLOO.md`, kèm `preview.html` để mở xem trước). Cảm ơn bạn nhiều!

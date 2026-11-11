# Hướng Dẫn Bàn Giao (Handoff): Gắn Khung Bong Bóng Vàng Hổ Phách & Kẹo Vàng Đơn Độc Quyền Cho Username `kimchi` Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ tài nguyên đồ họa (`1x`/`2x` WebP + PNG dự phòng, dung lượng `0.6 KB – 5.8 KB`) và stylesheet chuẩn cấu trúc `.shout-message-row[data-store-frame="burrow-candy-amber"]` của Mạng Floo để người quản trị repo **`hpvn-archive.net`** tích hợp và chỉ định độc quyền cho tài khoản có **username: `kimchi`**.

---

## 1. Thông số & danh mục file bàn giao (trong thư mục `burrow-candy/`)

- **Tài khoản nhận độc quyền**: username **`kimchi`** *(không mở bán trên Hẻm Xéo)*.
- **Mã khung (`data-store-frame`)**: **`"burrow-candy-amber"`** *(nền Vàng Hổ Phách Hoàng Kim + Kẹo Vàng Đơn)*.

Toàn bộ file cần dùng nằm gọn trong thư mục này:

| File | Kích thước pixel | Dung lượng | Công dụng |
|---|---|---|---|
| `candy-charm-gold.webp` | `56×56` (`1x`) | `2.1 KB` | **Kẹo Vàng Đơn** gắn góc ngoài bong bóng `::after` (`36×36 px`). |
| `candy-charm-gold-2x.webp` | `112×112` (`2x`) | `4.6 KB` | Bản Retina `2x` sắc nét của **Kẹo Vàng Đơn**. |
| `candy-charm-gold.png` | `56×56` (`1x`) | `5.8 KB` | Bản PNG dự phòng cho trình duyệt cũ. |
| `corner-tl.webp` / `corner-tl-2x.webp` / `corner-tl.png` | `22×22` (`1x`) / `44×44` (`2x`) | `0.6 KB – 1.3 KB` | Hoa văn góc xoáy vàng caramen bên trong bong bóng `::before` (`22×22 px`). |
| `burrow-candy-floo.css` | — | `~3.8 KB` | Stylesheet hoàn chỉnh cho `data-store-frame="burrow-candy-amber"` (nền Vàng Hổ Phách + Kẹo Vàng Đơn). Đã xử lý đầy đủ `.is-self`, `.is-self-shared-direction`, `.is-sonorus`, `.is-prisoner-censored`, `.shout-image-album.is-stack`, link & trích dẫn. |
| `preview.html` | — | — | Trang xem trước độc lập (hiển thị mẫu tin nhắn của `kimchi`) để kiểm tra trực tiếp trước khi deploy. |

---

## 2. Các bước tích hợp bên repo `hpvn-archive.net` (dành cho Dev nắm repo HPVN)

### Bước 1 — Tra `uid` của tài khoản `username: kimchi`
Trong Firestore `(default)` của project `hpvnn-archive` (collection `usernames/kimchi` hoặc `users` có `username == "kimchi"`), lấy mã Firebase Auth **`uid`** của tài khoản **`kimchi`** (ký hiệu bên dưới là `<KIMCHI_UID>`).

### Bước 2 — Copy 6 file ảnh vào `public/`
Copy 6 file ảnh trong thư mục `burrow-candy/` vào thư mục `public` của repo Next.js `hpvn-archive.net` theo đúng đường dẫn:

```text
public/images/floo-items/burrow-candy/
  ├─ candy-charm-gold.webp
  ├─ candy-charm-gold-2x.webp
  ├─ candy-charm-gold.png
  ├─ corner-tl.webp
  ├─ corner-tl-2x.webp
  └─ corner-tl.png
```

*(Đường dẫn URL sau khi build sẽ khớp sẵn với `/images/floo-items/burrow-candy/...` trong `burrow-candy-floo.css`).*

### Bước 3 — Nhúng CSS khung bong bóng
Dán nội dung file `burrow-candy-floo.css` (hoặc `@import`) vào file CSS diện mạo Mạng Floo / Shoutbox (nơi đang định nghĩa `.shout-message-row[data-store-frame=...]`, cùng chỗ với `erised-gold`, `howler-red`, `hagrid-cup-*`).

### Bước 4 — Chỉ định khung độc quyền cho duy nhất tài khoản `kimchi`
Tuỳ nhu cầu vận hành, chọn **1 trong 2 phương án** dưới đây:

#### Phương án A — Gắn trực tiếp theo `uid` của `kimchi` ở hàm `decorateRow` *(Nhanh nhất — 3 dòng, không đụng Backend/Firestore/Hẻm Xéo)*
Tại hook quản lý diện mạo Mạng Floo (nơi có hàm `decorateRow: (uid, props) => ...` đọc `appearance` để gán `"data-store-frame"`):

1. Thêm `"burrow-candy-amber"` vào `Set` whitelist `storeFrame` (cùng chỗ với `"erised-gold"`, `"howler-red"`, `"hagrid-cup-..."`).
2. Trong `decorateRow(uid, props)`, gán fallback `"burrow-candy-amber"` cho `KIMCHI_UID` (vẫn tôn trọng nút ẩn hiệu ứng `framesHidden` của người xem):

```ts
const KIMCHI_UID = '<KIMCHI_UID>'; // uid của tài khoản username: kimchi

// Bên trong decorateRow(uid, props):
decorateRow: (uid, props) => {
  if (!enabled || !uid || framesHidden) return props;
  const activeFrame =
    resolveStoreFrameKey(cache[uid]?.appearance) ??
    (uid === KIMCHI_UID ? 'burrow-candy-amber' : undefined);
  return {
    ...props,
    ...(activeFrame ? { 'data-store-frame': activeFrame } : {}),
  };
}
```
> **Ưu điểm:**
> - Không cần sửa Cloud Functions hay ghi DB; không xuất hiện trong Hẻm Xéo nên 0% khả năng người khác mua được.
> - Viết dạng `resolveStoreFrameKey(...) ?? (uid === KIMCHI_UID ? 'burrow-candy-amber' : undefined)` giúp khi `kimchi` bật tạm một vật phẩm Hẻm Xéo khác thì vật phẩm đó vẫn hiển thị bình thường, khi tắt đi sẽ tự động quay về khung Vàng Hổ Phách & Kẹo Vàng Đơn độc quyền.

#### Phương án B — Cấp như diện mạo `permanent: true` trong menu “Biến hình” của riêng `kimchi` *(Nếu muốn `kimchi` tự Bật / Tạm cất trong UI)*
1. Thêm `"burrow-candy-amber"` vào `Set` whitelist `storeFrame` ở cả frontend & backend (`getShoutAvatarProfiles` / `switchGringottsAppearance`).
2. Thêm mục cấu hình item diện mạo ẩn (không hiển thị trên kệ mua Hẻm Xéo `/gringotts/hem-xeo`, chỉ nằm trong danh mục tra cứu của menu **Biến hình** khi user đã sở hữu):
   - `id` / `canonicalPowerId`: `"burrow-candy-amber"`
   - `vietnameseName`: `"Kẹo Vàng Hổ Phách"`
   - `ability`: `"chat-frame-lease"`
   - `parameters`: `{ durationHours: 24, frameKey: "burrow-candy-amber" }`
   - `permanentOnPurchase`: `true`
3. Ghi quyền sở hữu vĩnh viễn (`permanentLookItemIds` / lease `appearance-frame` có `key: "burrow-candy-amber", permanent: true`) vào hồ sơ vật phẩm Gringotts/Floo của duy nhất `<KIMCHI_UID>` (username `kimchi`) trên Firestore `(default)` và tăng `appearanceRevision`.

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

Bạn có thể copy nguyên đoạn dưới đây gửi kèm thư mục `burrow-candy/`:

> Nhờ bạn gắn giúp mình 1 khung bong bóng tin nhắn Mạng Floo thiết kế riêng (**Vàng Hổ Phách & Kẹo Vàng Đơn — `burrow-candy-amber`**) chỉ định độc quyền cho duy nhất tài khoản có **username: `kimchi`** (không mở bán ở Hẻm Xéo):
> 1. Copy 6 file ảnh (`candy-charm-gold*` và `corner-tl*`) trong gói `burrow-candy/` vào `public/images/floo-items/burrow-candy/`.
> 2. Dán file `burrow-candy-floo.css` vào stylesheet `data-store-frame` của Shoutbox/Floo.
> 3. Tra `uid` của tài khoản `username: kimchi`, thêm `"burrow-candy-amber"` vào `Set` whitelist frame và gán riêng cho `uid` của `kimchi` trong `decorateRow` (chi tiết 3 dòng code có sẵn ở Mục 2 – Phương án A trong file `HANDOFF_HPVN_FLOO.md`, kèm `preview.html` để mở xem trước). Cảm ơn bạn nhiều!

# Hướng Dẫn Bàn Giao (Handoff): Gắn Khung Bong Bóng Đêm Sao Ravenclaw — Đại Bàng Khiên Ngọc & Couple Harry 💕 Luna Độc Quyền Cho User ID `Aries` Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ tài nguyên đồ họa (`1x`/`2x` WebP + PNG dự phòng, dung lượng `2.8 KB – 28 KB`) và stylesheet chuẩn cấu trúc `.shout-message-row[data-store-frame="ravenclaw-luna"]` của Mạng Floo để người quản trị repo **`hpvn-archive.net`** tích hợp và chỉ định độc quyền cho tài khoản có **user ID / username: `Aries`** *(cách thực hiện tương tự hệt như khi gắn khung cho user `kimchi` trước đó)*.

---

## 1. Thông số & danh mục file bàn giao (trong thư mục `ravenclaw-luna/`)

- **Tài khoản nhận độc quyền**: user ID / username **`Aries`** *(không mở bán trên Hẻm Xéo)*.
- **Mã khung (`data-store-frame`)**: **`"ravenclaw-luna"`** *(nền Đêm Sao Tháp Thiên Văn trơn không sọc + Đại Bàng Khiên Ngọc + Couple Chibi Harry Potter 💕 Luna Spectrespecs thả tim)*.

Toàn bộ file cần dùng nằm gọn trong thư mục này:

| File | Kích thước pixel | Dung lượng | Công dụng |
|---|---|---|---|
| `ravenclaw-eagle.webp` | `64×64` (`1x`) | `2.8 KB` | Huy hiệu **Đại Bàng Khiên Ngọc** Nhà Ravenclaw gắn góc trên `::before` (`32×32 px`). |
| `ravenclaw-eagle-2x.webp` | `128×128` (`2x`) | `6.9 KB` | Bản Retina `2x` sắc nét của **Đại Bàng Khiên Ngọc**. |
| `ravenclaw-eagle.png` | `64×64` (`1x`) | `7.6 KB` | Bản PNG dự phòng của **Đại Bàng Khiên Ngọc** cho trình duyệt cũ. |
| `luna-harry-duo.webp` | `120×104` (`1x`) | `8.5 KB` | **Couple Chibi Harry Potter 💕 Luna Spectrespecs** thả tim gắn góc dưới đối xứng `::after` (`62×54 px`). |
| `luna-harry-duo-2x.webp` | `240×208` (`2x`) | `21 KB` | Bản Retina `2x` sắc nét của **Couple Chibi Harry 💕 Luna**. |
| `luna-harry-duo.png` | `120×104` (`1x`) | `28 KB` | Bản PNG dự phòng của **Couple Chibi Harry 💕 Luna** cho trình duyệt cũ. |
| `ravenclaw-luna-floo.css` | — | `~5.3 KB` | Stylesheet hoàn chỉnh cho `data-store-frame="ravenclaw-luna"` (nền Đêm Sao + Đại Bàng Khiên Ngọc + Couple Harry 💕 Luna). Đã xử lý đầy đủ `.is-self` (giữ nguyên chiều mặt & vết sẹo Harry không bị lật gương), `.is-self-shared-direction`, `.is-sonorus`, `.is-prisoner-censored`, `.shout-image-album.is-stack`, Forced Colors Mode, link & trích dẫn. |
| `preview.html` | — | — | Trang xem trước độc lập (hiển thị mẫu tin nhắn của `Aries`) để kiểm tra trực tiếp trước khi deploy. |

---

## 2. Các bước tích hợp bên repo `hpvn-archive.net` (dành cho Dev nắm repo HPVN)

### Bước 1 — Tra `uid` của tài khoản có user ID / username `Aries`
Trong Firestore `(default)` của project `hpvnn-archive` (collection `usernames/aries` hoặc `users` có `username == "Aries"` / `usernameLower == "aries"` — tương tự như lúc tra `kimchi`), lấy mã Firebase Auth **`uid`** của tài khoản **`Aries`** (ký hiệu bên dưới là `<ARIES_UID>`).

### Bước 2 — Copy 6 file ảnh vào `public/`
Copy 6 file ảnh trong thư mục `ravenclaw-luna/` vào thư mục `public` của repo Next.js `hpvn-archive.net` theo đúng đường dẫn:

```text
public/images/floo-items/ravenclaw-luna/
  ├─ ravenclaw-eagle.webp
  ├─ ravenclaw-eagle-2x.webp
  ├─ ravenclaw-eagle.png
  ├─ luna-harry-duo.webp
  ├─ luna-harry-duo-2x.webp
  └─ luna-harry-duo.png
```

*(Đường dẫn URL sau khi build sẽ khớp sẵn với `/images/floo-items/ravenclaw-luna/...` trong `ravenclaw-luna-floo.css`).*

### Bước 3 — Nhúng CSS khung bong bóng
Dán nội dung file `ravenclaw-luna-floo.css` (hoặc `@import`) vào file CSS diện mạo Mạng Floo / Shoutbox (nơi đang định nghĩa `.shout-message-row[data-store-frame=...]`, ngay cạnh rule `"burrow-candy-amber"` của `kimchi`).

### Bước 4 — Chỉ định khung độc quyền cho duy nhất tài khoản `Aries`
Làm tương tự hệt như khi gắn khung cho `kimchi`, chọn **1 trong 2 phương án** dưới đây:

#### Phương án A — Gắn trực tiếp theo `uid` của `Aries` ở hàm `decorateRow` *(Khuyên dùng — giống hệt cách đã gắn cho `kimchi`, không đụng Backend/Firestore/Hẻm Xéo)*
Tại hook quản lý diện mạo Mạng Floo (nơi đang có `KIMCHI_UID` và hàm `decorateRow: (uid, props) => ...`):

1. Thêm `"ravenclaw-luna"` vào `Set` whitelist `storeFrame` (cùng chỗ với `"burrow-candy-amber"`, `"erised-gold"`, `"howler-red"`, `"hagrid-cup-..."`).
2. Thêm `<ARIES_UID>` vào bảng ánh xạ khung độc quyền trong `decorateRow(uid, props)` (vẫn tôn trọng nút ẩn hiệu ứng `framesHidden` của người xem):

```ts
const EXCLUSIVE_USER_FRAMES: Record<string, string> = {
  '<KIMCHI_UID>': 'burrow-candy-amber', // user: kimchi (đã gắn trước đó)
  '<ARIES_UID>': 'ravenclaw-luna',      // user ID: Aries
};

// Bên trong decorateRow(uid, props):
decorateRow: (uid, props) => {
  if (!enabled || !uid || framesHidden) return props;
  const activeFrame =
    resolveStoreFrameKey(cache[uid]?.appearance) ??
    EXCLUSIVE_USER_FRAMES[uid];
  return {
    ...props,
    ...(activeFrame ? { 'data-store-frame': activeFrame } : {}),
  };
}
```
> **Ưu điểm:**
> - Gom gọn chung với `KIMCHI_UID` trong 1 map `EXCLUSIVE_USER_FRAMES` cực sạch; không cần sửa Cloud Functions hay ghi DB và không xuất hiện trong Hẻm Xéo nên 0% khả năng người khác mua được.
> - Viết dạng `resolveStoreFrameKey(...) ?? EXCLUSIVE_USER_FRAMES[uid]` giúp khi `Aries` bật tạm một vật phẩm Hẻm Xéo khác thì vật phẩm đó vẫn hiển thị bình thường, khi tắt đi sẽ tự động quay về khung Đêm Sao Ravenclaw & Couple Harry 💕 Luna độc quyền.

#### Phương án B — Cấp như diện mạo `permanent: true` trong menu “Biến hình” của riêng `Aries` *(Nếu muốn `Aries` tự Bật / Tạm cất trong UI)*
1. Thêm `"ravenclaw-luna"` vào `Set` whitelist `storeFrame` ở cả frontend & backend (`getShoutAvatarProfiles` / `switchGringottsAppearance`).
2. Thêm mục cấu hình item diện mạo ẩn (không hiển thị trên kệ mua Hẻm Xéo `/gringotts/hem-xeo`, chỉ nằm trong danh mục tra cứu của menu **Biến hình** khi user đã sở hữu):
   - `id` / `canonicalPowerId`: `"ravenclaw-luna"`
   - `vietnameseName`: `"Đêm Sao Ravenclaw — Harry & Luna"`
   - `ability`: `"chat-frame-lease"`
   - `parameters`: `{ durationHours: 24, frameKey: "ravenclaw-luna" }`
   - `permanentOnPurchase`: `true`
3. Ghi quyền sở hữu vĩnh viễn (`permanentLookItemIds` / lease `appearance-frame` có `key: "ravenclaw-luna", permanent: true`) vào hồ sơ vật phẩm Gringotts/Floo của duy nhất `<ARIES_UID>` (user `Aries`) trên Firestore `(default)` và tăng `appearanceRevision`.

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

Bạn có thể copy nguyên đoạn dưới đây gửi kèm thư mục `ravenclaw-luna/`:

> Nhờ bạn gắn giúp mình thêm 1 khung bong bóng tin nhắn Mạng Floo thiết kế riêng (**Đêm Sao Ravenclaw: Đại Bàng Khiên Ngọc & Couple Harry 💕 Luna — `ravenclaw-luna`**) chỉ định độc quyền cho duy nhất tài khoản có **user ID / username: `Aries`** (không mở bán ở Hẻm Xéo, cách làm y hệt như đợt gắn khung `burrow-candy-amber` cho `kimchi`):
> 1. Copy 6 file ảnh (`ravenclaw-eagle*` và `luna-harry-duo*`) trong gói `ravenclaw-luna/` vào `public/images/floo-items/ravenclaw-luna/`.
> 2. Dán file `ravenclaw-luna-floo.css` vào stylesheet `data-store-frame` của Shoutbox/Floo (ngay cạnh rule của `kimchi`).
> 3. Tra `uid` của tài khoản `Aries`, thêm `"ravenclaw-luna"` vào `Set` whitelist frame và gán riêng cho `uid` của `Aries` trong `decorateRow` chung bảng với `kimchi` (code mẫu có sẵn ở Mục 2 – Phương án A trong file `HANDOFF_HPVN_FLOO.md`, kèm `preview.html` để mở xem trước). Cảm ơn bạn nhiều!

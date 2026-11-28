# Hướng Dẫn Bàn Giao (Handoff): Khung Chat Động Mạng Floo «Hào Quang Lửng Biển» (`hao-quang-lung-bien`) Cho ID `tomoyo2006`

Gói tài nguyên và stylesheet hoàn chỉnh cho khung bong bóng chat Mạng Floo (HPVNN) **đã chuẩn hoá 100% theo luật hiệu năng & kiến trúc `20-store-appearance.css` / `LEGENDARY_FRAMES` (iOS Safari 16+)** — gắn riêng cho tài khoản ID / username **`tomoyo2006`** (`gringotts-own-floo-frames.json`).

---

## 1. Thông tin khung (theo mẫu quy chuẩn Mạng Floo)

| Mục | Giá trị |
|---|---|
| Mã khung (key, chữ thường, gạch nối) | `hao-quang-lung-bien` |
| Tên hiển thị tiếng Việt | Hào Quang Lửng Biển |
| Câu chuyện / chủ đề Harry Potter | Cúp vàng Helga Hufflepuff & Bé Tôm Phù Thủy đội mũ nhà Hufflepuff thả bong bóng Bắn Cá giữa làn nước Hồ Đen sâu thẳm |
| Ai được dùng | Khung riêng của thành viên **`tomoyo2006`** (`gringotts-own-floo-frames.json`, không mở bán đại trà ở Hẻm Xéo) |
| Cấp | Huyền thoại (có lớp động cắm vào `LEGENDARY_FRAMES`) |
| Ảnh đính kèm | 2 tệp WebP phẳng `< 12 KB`: `hufflepuff-cup.webp` (**`8.11 KB`**) & `chibi-shrimp-wizard.webp` (**`9.01 KB`**) — đã bake sẵn ánh hào quang mềm, 0 PNG, 0 `image-set` |

---

## 2. Kiến trúc hiệu năng & điểm chuẩn Rule

- **Cắm trực tiếp vào DOM sẵn có của `LEGENDARY_FRAMES` (`ShoutMessageRow.ts`):** dùng đúng `.shout-lg-fx > .shout-lg-aura, .shout-lg-rim, .shout-lg-clip > (.shout-lg-b, .shout-lg-band, .shout-lg-a, .shout-lg-top)` và `.shout-lg-shine` — **không thêm thẻ DOM mới**.
- **Khớp chính xác class chuẩn Mạng Floo:** `.shout-message-bubble`, `.shout-message-author`, `.shout-message-meta-time`, `.shout-rich-text`, `.shout-quote-preview`, `.is-self:not(.is-self-shared-direction)`.
- **Thuần GPU (`opacity` & `transform`):** toàn bộ `9` `@keyframes` mang tiền tố `hpvn-lg-hqlb-*`, bọc trong `@media (prefers-reduced-motion: no-preference)`, chạy đúng **`2 forwards`** rồi dừng mượt ở khung tĩnh (`0%` GPU), không dùng `infinite`, `filter`, `backdrop-filter`, `mix-blend-mode`, `@property`, `!important` hay `<canvas>`.
- **Một khung, một viền & cắt gọn trong bong bóng:** viền vàng mật ong chuyển cam rực `3px` (`.shout-lg-rim` với `-webkit-mask` + `mask`), tia sáng mặt biển caustics (`.shout-lg-b`), Cúp Hufflepuff (`.shout-lg-band`), Tôm Phù Thủy (`.shout-lg-a`) và 2 đợt bong bóng Bắn Cá (`.shout-lg-top::before`/`::after`) đều cắt gọn trong `.shout-lg-clip` (`overflow: hidden`) với padding cố định.
- **Đối xứng `.is-self` & tương thích đầy đủ:** tự ẩn lớp động và không ghi đè ở `[data-offscreen]`, `.is-sonorus`, `.is-prisoner-censored`, `:has(.shout-image-album.is-stack)` và `[data-hide-frames="true"]`.

---

## 3. Cấu trúc tệp bàn giao

- Ảnh WebP phẳng (`< 12 KB` mỗi tệp):
  - `public/paintings/floo-items/hao-quang-lung-bien/hufflepuff-cup.webp` (**`8.11 KB`**)
  - `public/paintings/floo-items/hao-quang-lung-bien/chibi-shrimp-wizard.webp` (**`9.01 KB`**)
- Stylesheet & trang xem trước:
  - `docs/handoff/hao-quang-lung-bien/hao-quang-lung-bien-floo.css` (CSS cắm trực tiếp vào `client/app/styles/05-floo/20-store-appearance.css`)
  - `docs/handoff/hao-quang-lung-bien/preview.html` (trang xem trước độc lập)
  - `public/preview-hao-quang-lung-bien.html` (trang xem trước chạy trực tiếp trên Vite dev server)

---

## 4. Tích hợp sang repo `hpvn-archive.net` (gắn cho ID `tomoyo2006`)

> Lưu ý quy trình: thao tác trên **worktree riêng tách từ `codex/production`**, không push trực tiếp lên `codex/production`.

### Bước 1 — Copy 2 tệp WebP phẳng (`< 12 KB`)
Copy từ `public/paintings/floo-items/hao-quang-lung-bien/` vào:

```text
client/public/images/floo-items/hao-quang-lung-bien/
  ├─ hufflepuff-cup.webp
  └─ chibi-shrimp-wizard.webp
```

*(Khớp 100% với đường dẫn `/images/floo-items/hao-quang-lung-bien/*.webp` trong `hao-quang-lung-bien-floo.css` — chỉ tải khi có tin nhắn dùng khung này.)*

### Bước 2 — Thêm key `hao-quang-lung-bien` vào 3 vị trí cấu hình chuẩn
1. **`client/app/components/ShoutMessageRow.ts`:** thêm `'hao-quang-lung-bien'` vào tập `LEGENDARY_FRAMES`.
2. **`client/features/floo/model/itemAppearanceKeys.json`:** thêm `"hao-quang-lung-bien"` đúng thứ tự chữ cái.
3. **`functions/galleons/gringotts-own-floo-frames.json`:** tra Firebase Auth `uid` của tài khoản **`tomoyo2006`** trong Firestore (`usernames/tomoyo2006` hoặc `users` có `username == "tomoyo2006"` / `usernameLower == "tomoyo2006"`) rồi gán riêng khung `"hao-quang-lung-bien"` cho `<TOMOYO2006_UID>`.

### Bước 3 — Nhúng CSS vào `05-floo/`
Nhúng nội dung `docs/handoff/hao-quang-lung-bien/hao-quang-lung-bien-floo.css` vào `client/app/styles/05-floo/20-store-appearance.css` (nếu tệp vượt trần 1800 dòng thì tách thành tệp mới trong `05-floo/` và import cùng chỗ; lưu ý CSS thêm **0 `!important`** nên không vượt trần `1262/1262`).

---

## 5. Kiểm tra bắt buộc trước khi phát hành (Mục 6 Rule)

1. `node --test client/tests/flooLegendaryFrameMotion.test.mts client/tests/flooBubblePrototype.test.mts` — qua.
2. Test client Floo + `functions/test/shout-item-appearance-core.test.js` — qua (khớp danh sách key máy chủ).
3. `node .agents/skills/hpvnn-floo-architecture/scripts/check_architecture.mjs` — qua (`!important` không tăng, `cssHasSubject` qua).
4. Mở local cổng `3026` có `≥ 12` bong bóng `hao-quang-lung-bien`:
   - DevTools Performance (CPU 4×): cuộn mượt, sau ~9.6s hết 2 lượt thì **Paint flashing = 0**.
   - Bật Reduce Motion của hệ điều hành: đứng yên hoàn toàn, khung tĩnh vẫn sắc nét.
   - Cuộn ra khỏi màn hình rồi quay lại: `data-offscreen` hoạt động chuẩn, không giật vị trí đọc, không dài vùng cuộn.
   - Kiểm tra trên Safari Simulator iOS 16+ (cả tin mình `.is-self` lẫn tin người khác, nền sáng & tối).

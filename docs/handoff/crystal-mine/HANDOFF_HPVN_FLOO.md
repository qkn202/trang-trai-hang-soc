# Hướng Dẫn Bàn Giao (Handoff): Khung Chat Động Mạng Floo «Pha Lê Cầu Vồng» (`crystal-mine`) Cho ID `pangting`

Gói tài nguyên và stylesheet hoàn chỉnh cho khung bong bóng chat Mạng Floo (HPVNN) **đã chuẩn hoá 100% theo luật hiệu năng & kiến trúc `20-store-appearance.css` / `LEGENDARY_FRAMES` (iOS Safari 16+)** — gắn riêng cho tài khoản ID / username **`pangting`**.

---

## 1. Thông tin khung (theo mẫu quy chuẩn Mạng Floo)

| Mục | Giá trị |
|---|---|
| Mã khung (key, chữ thường, gạch nối) | `crystal-mine` |
| Tên hiển thị tiếng Việt | Pha Lê Cầu Vồng |
| Câu chuyện / chủ đề Harry Potter | Quả mìn pha lê bảy sắc tinh luyện từ Tinh Vân Nhung & phép biến hình ánh kim `777` |
| Ai được dùng | Khung riêng của thành viên `pangting` (`gringotts-own-floo-frames.json`, không mở bán đại trà ở Hẻm Xéo) |
| Cấp | Huyền thoại (có lớp động cắm vào `LEGENDARY_FRAMES`) |
| Ảnh đính kèm | `crystal-mine.webp` — 1 tệp WebP phẳng `128×128px`, **`8.56 KB`** (`< 12 KB`, đã bake sẵn bóng mềm & hào quang, 0 PNG, 0 `image-set`) |

---

## 2. Kiến trúc hiệu năng & điểm nâng cấp chuẩn Rule

- **Cắm trực tiếp vào DOM sẵn có của `LEGENDARY_FRAMES` (`ShoutMessageRow.ts`):** dùng đúng các lớp `.shout-lg-fx > .shout-lg-aura, .shout-lg-rim, .shout-lg-clip > (.shout-lg-b, .shout-lg-band, .shout-lg-a, .shout-lg-top)` và `.shout-lg-shine` — **không thêm thẻ DOM mới**.
- **Thuần GPU (`opacity` & `transform`):** loại bỏ hoàn toàn `@property`, `background-size` animation, `filter`, `<feGaussianBlur>`, `backdrop-filter`, `mix-blend-mode` và 7 lệnh `!important`.
- **Không chạy vô hạn (`0%` GPU sau 2 lượt):** toàn bộ 6 `@keyframes` đều mang tiền tố `hpvn-lg-cm-*`, bọc trong `@media (prefers-reduced-motion: no-preference)`, chạy đúng **`2 forwards`** (`2 × 6.2s`) rồi dừng gọn gàng ở tư thế trái mìn pha lê tĩnh sắc nét.
- **Một khung, một viền & cắt gọn trong bong bóng:** viền vàng champagne phay lụa mảnh `1.5px` (`.shout-lg-rim` dùng `-webkit-mask` + `mask`), mọi vòng sóng xung kích (`.shout-lg-b`), 10 mảnh đá quý cầu vồng (`.shout-lg-band`), trái mìn (`.shout-lg-a`) và số `777` chrome cầu vồng 3D (`.shout-lg-top`) nằm gọn trong `.shout-lg-clip` (`overflow: hidden`) với padding cố định (không nhảy bố cục, không làm dài vùng cuộn).
- **Đối xứng `.is-self` thông minh:** ở tin của chính chủ (`.is-self`), cụm trái mìn & vụ nổ chuyển đối xứng sang góc trái nhưng số **`777` vẫn giữ nguyên xuôi chiều đọc**.
- **Tương thích đầy đủ Mạng Floo:** tự ẩn `.shout-lg-fx` và dừng `.shout-lg-shine` khi có `[data-offscreen]`, `.is-sonorus`, `.is-prisoner-censored`, `:has(.shout-image-album.is-stack)` và `[data-hide-frames="true"]`.

---

## 3. Cấu trúc tệp bàn giao

- `public/paintings/floo-items/crystal-mine/crystal-mine.webp` (`128×128px`, **`8.56 KB`** — WebP phẳng duy nhất, `< 12 KB`)
- `docs/handoff/crystal-mine/crystal-mine-floo.css` (CSS cắm trực tiếp vào `client/app/styles/05-floo/20-store-appearance.css` hoặc tách tệp mới nếu vượt trần 1800 dòng)
- `docs/handoff/crystal-mine/preview.html` (trang xem trước độc lập)
- `public/preview-crystal-mine.html` (trang xem trước chạy trực tiếp trên Vite dev server)

---

## 4. Tích hợp sang repo `hpvn-archive.net` (gắn cho ID `pangting`)

> Lưu ý quy trình: thao tác trên **worktree riêng tách từ `codex/production`**, không push trực tiếp lên `codex/production`.

### Bước 1 — Copy 1 tệp WebP phẳng duy nhất (`< 12 KB`)
Copy `public/paintings/floo-items/crystal-mine/crystal-mine.webp` vào:

```text
client/public/images/floo-items/crystal-mine/crystal-mine.webp
```

*(Khớp 100% với `url("/images/floo-items/crystal-mine/crystal-mine.webp")` trong selector `[data-store-frame="crystal-mine"] .shout-lg-a` — chỉ tải khi có tin nhắn dùng khung này.)*

### Bước 2 — Thêm key `crystal-mine` vào 3 vị trí cấu hình chuẩn
1. **`client/app/components/ShoutMessageRow.ts`:** thêm `'crystal-mine'` vào tập `LEGENDARY_FRAMES`.
2. **`client/features/floo/model/itemAppearanceKeys.json`:** thêm `"crystal-mine"` đúng thứ tự chữ cái.
3. **`functions/galleons/gringotts-own-floo-frames.json`:** tra `uid` của tài khoản `pangting` trong Firestore rồi gán riêng khung `"crystal-mine"` cho `<PANGTING_UID>`.

### Bước 3 — Nhúng CSS vào `05-floo/`
Nhúng nội dung `docs/handoff/crystal-mine/crystal-mine-floo.css` vào `client/app/styles/05-floo/20-store-appearance.css` (nếu tệp chạm trần 1800 dòng thì tách thành tệp mới trong `05-floo/` và import cùng chỗ; lưu ý CSS này thêm **0 `!important`** nên không vượt trần `1262/1262`).

---

## 5. Kiểm tra bắt buộc trước khi phát hành (Mục 6 Rule)

1. `node --test client/tests/flooLegendaryFrameMotion.test.mts client/tests/flooBubblePrototype.test.mts` — qua.
2. Test client Floo + `functions/test/shout-item-appearance-core.test.js` — qua (khớp danh sách key máy chủ).
3. `node .agents/skills/hpvnn-floo-architecture/scripts/check_architecture.mjs` — qua (`!important` không tăng, `cssHasSubject` qua).
4. Mở local cổng `3026` có `≥ 12` bong bóng `crystal-mine`:
   - DevTools Performance (CPU 4×): cuộn mượt, sau ~12.4s hết 2 lượt thì **Paint flashing = 0**.
   - Bật Reduce Motion của hệ điều hành: đứng yên hoàn toàn, khung tĩnh vẫn sắc nét.
   - Cuộn ra khỏi màn hình rồi quay lại: `data-offscreen` hoạt động chuẩn, không giật vị trí đọc, không dài vùng cuộn.
   - Kiểm tra trên Safari Simulator iOS 16+ (cả tin mình `.is-self` lẫn tin người khác, nền sáng & tối).

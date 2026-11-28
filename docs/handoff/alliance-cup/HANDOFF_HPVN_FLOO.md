# Hướng Dẫn Bàn Giao (Handoff): Bộ 6 Khung Chat Động Mạng Floo «Cúp Liên Minh 2 Nhà»

Bộ **6 khung bong bóng chat Huyền Thoại riêng biệt** dành cho 6 cặp Liên Minh xoay vòng của Cúp Nhà Tuần (`HOUSE_CUP_ALLIANCE_ROTATION`), **thay thế hoàn toàn khung `alliance-cup` cũ** — đã chuẩn hoá 100% theo luật hiệu năng & kiến trúc `20-store-appearance.css` / `LEGENDARY_FRAMES` (iOS Safari 16+).

---

## 1. Bảng 6 mã khung & tài nguyên WebP phẳng (`< 12 KB` / tệp)

Mỗi cặp 2 Nhà thắng Cúp Tuần nhận đúng **1 khung riêng mang bản sắc 2 Nhà**, kèm **1 biểu tượng Cúp WebP phẳng `128×128px`** (chỉ tải lười khi có tin nhắn dùng đúng mã khung đó, **0 PNG**, **0 `image-set`**):

| # | Mã khung (`key`) | Tên hiển thị tiếng Việt | Cặp Liên Minh | Chủ đề Harry Potter | Ảnh WebP phẳng (`128×128`) | Dung lượng |
|---|---|---|---|---|---|---|
| 1 | `alliance-anh-duong` | **Cúp Liên Minh Ánh Dương** | Gryffindor + Hufflepuff | Cúp Mặt Trời cánh vàng & Hồng Ngọc Sư Tử — Lửng | `anh-duong.webp` | **10.91 KB** |
| 2 | `alliance-nguyet-anh` | **Cúp Liên Minh Nguyệt Ảnh** | Slytherin + Ravenclaw | Chén Bạc Trăng Khuya, Lục Bảo & Tinh Quang Lam | `nguyet-anh.webp` | **10.49 KB** |
| 3 | `alliance-lua-va-tri` | **Cúp Liên Minh Lửa & Trí** | Gryffindor + Ravenclaw | Ngọn Lửa Phượng Hoàng & Tinh Bàn Hoàng Kim | `lua-va-tri.webp` | **10.52 KB** |
| 4 | `alliance-ngoc-rung` | **Cúp Liên Minh Ngọc Rừng** | Slytherin + Hufflepuff | Chén Ngọc Lục Bảo Nguyệt Quế & Hổ Phách Mật Ong | `ngoc-rung.webp` | **10.67 KB** |
| 5 | `alliance-song-hung` | **Cúp Liên Minh Song Hùng** | Gryffindor + Slytherin | Cúp Song Dực Đỏ Thẫm – Lục Bảo & Vương Miện Hoàng Kim | `song-hung.webp` | **9.38 KB** |
| 6 | `alliance-tinh-tu` | **Cúp Liên Minh Tinh Tú** | Ravenclaw + Hufflepuff | Chén Thiên Văn Lam Đêm & Vòng Quỹ Đạo Sao Vàng | `tinh-tu.webp` | **10.14 KB** |

- **Ai được dùng:** Phần thưởng Cúp Nhà Liên Minh hằng tuần (`grantWeeklyFlooFrames` — cấp 7 ngày / 168 giờ cho thành viên đủ điều kiện của đúng cặp 2 Nhà thắng Cúp Tuần). Không mở bán đại trà ở Hẻm Xéo.
- **Cấp:** Huyền thoại (cắm trực tiếp vào tập `LEGENDARY_FRAMES`).

---

## 2. Kiến trúc hiệu năng & tuân thủ tuyệt đối luật Mạng Floo (iOS Safari 16+)

- **Cắm thẳng vào DOM sẵn có của `LEGENDARY_FRAMES` (`ShoutMessageRow.ts`):** dùng đúng cấu trúc `.shout-lg-fx > .shout-lg-aura, .shout-lg-rim, .shout-lg-clip > (.shout-lg-b, .shout-lg-band, .shout-lg-a, .shout-lg-top)` và `.shout-lg-shine` trên tên tác giả — **không thêm thẻ DOM mới**.
- **Thuần GPU (`opacity` & `transform`):** 9 `@keyframes` đều mang tiền tố `hpvn-lg-ac-*`, tuyệt đối chỉ animate `opacity` và `transform`.
- **Không `infinite` (`0%` GPU sau 2 lượt):** mọi chuyển động chạy đúng **`2 forwards`** (`~7–9s` tổng thời lượng) rồi dừng gọn ở trạng thái tĩnh sang trọng; toàn bộ nằm trong `@media (prefers-reduced-motion: no-preference)`.
- **Không `filter`, `backdrop-filter`, `mix-blend-mode`, `@property`, `!important`, `<canvas>`, PNG hay `image-set`:** hào quang ấm/lạnh quanh mỗi chiếc Cúp đã được bake sạch vào kênh alpha của tệp WebP phẳng; huy hiệu 2 Nhà góc trên-trái (`.shout-lg-band`) là SVG vector nhẹ không chứa `<filter>`.
- **Một khung, một viền & đối xứng `.is-self`:** viền chuyển sắc 2 Nhà `3px` dùng `-webkit-mask` + `mask`; toàn bộ hiệu ứng cắt gọn trong `.shout-lg-clip { overflow: hidden; }`; padding cố định từ khung đầu, lật đối xứng chuẩn cho `.is-self:not(.is-self-shared-direction)` và màn hình `<= 640px`.
- **Tôn trọng đầy đủ cơ chế Mạng Floo:** tự ẩn `.shout-lg-fx` và dừng `.shout-lg-shine` khi `[data-offscreen]`, `.is-sonorus`, `.is-prisoner-censored`, `:has(.shout-image-album.is-stack)` (subject mang class chuẩn `cssHasSubject`), `[data-hide-frames="true"]` và `@media (forced-colors: active)`.

---

## 3. Cấu trúc tệp bàn giao trong repo

- `public/paintings/floo-items/alliance-cup/` *(6 tệp WebP phẳng `< 12 KB`, đã xoá `cup-winged.webp`, `cup-winged-2x.webp` và PNG fallback cũ)*:
  - `anh-duong.webp` (`10.91 KB`)
  - `nguyet-anh.webp` (`10.49 KB`)
  - `lua-va-tri.webp` (`10.52 KB`)
  - `ngoc-rung.webp` (`10.67 KB`)
  - `song-hung.webp` (`9.38 KB`)
  - `tinh-tu.webp` (`10.14 KB`)
- `docs/handoff/alliance-cup/alliance-cup-floo.css` — stylesheet đầy đủ cho cả 6 khung (`0` `!important`).
- `docs/handoff/alliance-cup/preview.html` — trang xem trước tương tác cả 6 khung (`.is-other`, `.is-self`, quote, link, tin ngắn, Sáng/Tối, Replay, Reduce Motion, Mobile `<= 640px`).
- `src/hpvn/houseCup.ts` — đã thêm `HOUSE_CUP_ALLIANCE_FLOO_FRAMES` & hàm `getAllianceFlooFrameKey(houses)` để tự phân giải cặp 2 Nhà → đúng 1 trong 6 mã khung.
- `docs/handoff/house-cup-discipline-medals/HANDOFF_HPVN_HOUSE_CUP.md` (§8.1 & §8.2) — đã cập nhật bảng 6 mã khung và hàm `resolveAllianceFrameKey` trong `grantWeeklyFlooFrames`.

---

## 4. Tích hợp sang repo `hpvn-archive.net` (thay thế `alliance-cup` cũ)

> Lưu ý quy trình: thao tác trên **worktree riêng tách từ `codex/production`**, không push trực tiếp lên `codex/production`.

### Bước 1 — Thay thế ảnh trong `client/public/images/floo-items/alliance-cup/`
Xoá `cup-winged.webp` / `cup-winged-2x.webp` cũ (nếu có) và copy đúng **6 tệp WebP phẳng** vào:

```text
client/public/images/floo-items/alliance-cup/
├── anh-duong.webp
├── lua-va-tri.webp
├── ngoc-rung.webp
├── nguyet-anh.webp
├── song-hung.webp
└── tinh-tu.webp
```

### Bước 2 — Cập nhật danh sách mã khung (gỡ `alliance-cup`, thêm 6 mã mới)
1. **`client/app/components/ShoutMessageRow.ts` (`LEGENDARY_FRAMES`):** thay `'alliance-cup'` bằng 6 key:
   ```ts
   'alliance-anh-duong',
   'alliance-lua-va-tri',
   'alliance-ngoc-rung',
   'alliance-nguyet-anh',
   'alliance-song-hung',
   'alliance-tinh-tu',
   ```
2. **`client/features/floo/model/itemAppearanceKeys.json`:** thay `"alliance-cup"` bằng 6 key trên (giữ đúng thứ tự bảng chữ cái: `alliance-anh-duong`, `alliance-lua-va-tri`, `alliance-ngoc-rung`, `alliance-nguyet-anh`, `alliance-song-hung`, `alliance-tinh-tu`).
3. **Phía máy chủ (`functions/`):**
   - Gỡ CSS/key `alliance-cup` cũ khỏi `gringotts-appearance-slots.js` / bảng ánh xạ thưởng tuần và đăng ký đủ 6 key mới.
   - Cập nhật `grantWeeklyFlooFrames` theo §8.2 của `docs/handoff/house-cup-discipline-medals/HANDOFF_HPVN_HOUSE_CUP.md` để cấp đúng key theo `winningHouses` (kể cả tuần hoà 2 Liên Minh: cấp khung tương ứng đúng Nhà của từng thành viên).
   - *(Tuỳ chọn chuyển tiếp mượt trong 7 ngày đầu)*: nếu đang có user còn giữ `alliance-cup` từ tuần trước, ánh xạ fallback về `alliance-lua-va-tri` (hoặc đợi hết hạn 7 ngày rồi bỏ hẳn).

### Bước 3 — Nhúng CSS tách tệp trong `client/app/styles/05-floo/`
Do `20-store-appearance.css` đang ~1382 dòng (trần `1800` dòng/tệp), nên **tách riêng bộ 6 khung** thành tệp mới:

```text
client/app/styles/05-floo/21-alliance-cup-frames.css
```

- Copy nguyên nội dung `docs/handoff/alliance-cup/alliance-cup-floo.css` vào tệp trên (và gỡ khối CSS `alliance-cup` cũ trong `20-store-appearance.css` nếu đã dán trước đó).
- Import `21-alliance-cup-frames.css` ngay sau `20-store-appearance.css`.
- Số lượng `!important` tăng thêm: **`0`** (không vượt trần `1262/1262`).

---

## 5. Kiểm tra bắt buộc trước khi phát hành (Mục 6 Rule)

1. `node --test client/tests/flooLegendaryFrameMotion.test.mts client/tests/flooBubblePrototype.test.mts` — qua.
2. Test client Floo + `functions/test/shout-item-appearance-core.test.js` — qua (cả 6 key khớp client ↔ server).
3. `node .agents/skills/hpvnn-floo-architecture/scripts/check_architecture.mjs` — qua (`!important` giữ nguyên, `cssHasSubject` qua, không tệp nào vượt `1800` dòng).
4. Chạy local cổng `3026`, mở Mạng Floo có `≥ 12` bong bóng dùng xen kẽ cả 6 khung Liên Minh:
   - Chrome DevTools › Performance (CPU 4×): cuộn mượt, sau ~9s hết 2 lượt thì **Paint flashing = 0**.
   - Bật Reduce Motion của hệ điều hành: đứng yên hoàn toàn, 6 khung tĩnh vẫn rõ nét & sang trọng.
   - Cuộn ra khỏi màn hình rồi cuộn lại: `[data-offscreen]` hoạt động đúng, không giật vị trí đọc, không dài vùng cuộn.
   - Kiểm tra trên Safari Simulator iOS 16+ (cả `.is-self` lẫn tin người khác, màn hình `<= 640px`, nền sáng & tối).

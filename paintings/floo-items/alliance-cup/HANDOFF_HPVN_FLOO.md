# Hướng Dẫn Bàn Giao (Handoff): Khung Bong Bóng Liên Minh Nhà Thắng Cúp Tuần (`alliance-cup`) Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ tài nguyên đồ họa (`1x`/`2x` WebP + PNG dự phòng, dung lượng `7.4 KB – 22.5 KB`) và stylesheet chuẩn cấu trúc `.shout-message-row[data-store-frame="alliance-cup"]` của Mạng Floo để người quản trị repo **`hpvn-archive.net`** tích hợp làm phần thưởng danh hiệu **Liên Minh Nhà Thắng Cúp Tuần**.

---

## 1. Thông số thiết kế chốt & danh mục file bàn giao (trong thư mục `alliance-cup/`)

- **Mã khung (`data-store-frame`)**: **`"alliance-cup"`**
- **Thiết kế đã chốt (Mẫu F — Gấm Hoàng Gia 4 Sắc)**:
  - **Màu nền (`padding-box`)**: **Gấm Hoàng Gia 4 Sắc** — nền nhung dệt chéo chuyển sắc trầm sang trọng của đủ 4 Nhà Hogwarts (**Đỏ Gryffindor `#7f1d1d`** · **Vàng Hufflepuff `#78350f`** · **Lục Slytherin `#065f46`** · **Lam Ravenclaw `#1e3a8a`**) phủ gân gấm mảnh & ánh vàng nhẹ ngay dưới Cúp.
  - **Viền (`border-box` — `3px solid transparent !important`)**: **4 đoạn viền 4 màu Nhà tách rõ** (`#f87171` Đỏ · `#facc15` Vàng · `#34d399` Lục · `#60a5fa` Lam) chạy quanh bo góc tự nhiên, bọc khung ngoài tối `#211404` và lồng đường **chỉ vàng kim bên trong** (`inset`).
  - **Cúp Vô Địch (`::after`)**: **Đại Cúp Cánh Phượng (`cup-winged`)** kích thước `48×48 px` đặt **ngay chính giữa đường viền trên** (`top: -2px; left: 50%; transform: translate(-50%, -58%)`), kèm `margin-top: 22px` + `padding-top: 21px` + `min-width: 146px` để không bao giờ đè lên tên người gửi, giờ gửi hay dòng tin nhắn phía trên (kể cả khi nhắn 1 từ ngắn).
  - **Góc phụ (`::before`)**: Không gắn gì để Cúp Cánh Phượng ở giữa viền trên đối xứng hoàn hảo.
- **Đối tượng & thời hạn trao thưởng (CHỐT)**:
  - **Đối tượng nhận**: **Đúng danh sách `qualifiedUids`** — các thành viên thuộc **2 Nhà trong Liên Minh thắng Cúp Tuần** đã đạt điều kiện tuần đó (**`>= 5` ván** ở bất kỳ 1 mini-game nào trong chu kỳ, khớp 1-đối-1 với danh sách chia `200.000 Galleons` trong `docs/handoff/house-cup-discipline-medals/HANDOFF_HPVN_HOUSE_CUP.md`).
  - **Thời hạn sử dụng**: **Đúng 7 ngày (`168 giờ`) tính từ `17:00 Thứ Sáu` (UTC+7)** đến **`17:00 Thứ Sáu` tuần kế tiếp**.
  - **Cơ chế cấp**: Phát `chat-frame-lease` (`frameKey: "alliance-cup"`, `durationHours: 168`) ngay trong job tổng kết Cúp Tuần lúc `17:00 Thứ Sáu` để thành viên tự bật/tắt trong menu **Biến hình** (tự động hết hạn đúng `17:00 Thứ Sáu` tuần sau).

Toàn bộ gói sạch gồm **6 file** nằm gọn trong thư mục này:

| File | Kích thước pixel | Dung lượng | Công dụng |
|---|---|---|---|
| `cup-winged.webp` | `118×118` (`1x`) | `7.4 KB` | **Đại Cúp Vàng Cánh Phượng** gắn chính giữa viền trên `::after` (`48×48 px`). |
| `cup-winged-2x.webp` | `236×236` (`2x`) | `20.5 KB` | Bản Retina `2x` sắc nét của **Đại Cúp Vàng Cánh Phượng**. |
| `cup-winged.png` | `118×118` (`1x`) | `22.5 KB` | Bản PNG dự phòng cho trình duyệt cũ. |
| `alliance-cup-floo.css` | — | `~3.3 KB` | Stylesheet hoàn chỉnh cho `data-store-frame="alliance-cup"`. Đã xử lý đầy đủ `.is-self`, `.is-prisoner-censored`, `.shout-image-album.is-stack`, Forced Colors Mode, link & trích dẫn. |
| `preview.html` | — | — | Trang xem trước độc lập (hiển thị cả tin nhắn dài, trích dẫn `.is-self` và tin nhắn ngắn 1 từ) để kiểm tra trực tiếp trước khi deploy. |

---

## 2. Các bước tích hợp bên repo `hpvn-archive.net` (dành cho Dev nắm repo HPVN)

### Bước 1 — Copy 3 file ảnh vào `public/`
Copy 3 file ảnh trong thư mục `alliance-cup/` vào thư mục `public` của repo Next.js `hpvn-archive.net` theo đúng đường dẫn:

```text
public/images/floo-items/alliance-cup/
  ├─ cup-winged.webp
  ├─ cup-winged-2x.webp
  └─ cup-winged.png
```

*(Đường dẫn URL sau khi build sẽ khớp sẵn với `/images/floo-items/alliance-cup/...` trong `alliance-cup-floo.css`).*

### Bước 2 — Nhúng CSS khung bong bóng
Dán nội dung file `alliance-cup-floo.css` (hoặc `@import`) vào file CSS diện mạo Mạng Floo / Shoutbox (ngay cạnh các rule `"burrow-candy-amber"`, `"ravenclaw-luna"`, `"ron-chicken"`).

### Bước 3 — Cấp khung `"alliance-cup"` trong job chốt Cúp Tuần lúc `17:00 Thứ Sáu` (thời hạn `7 ngày = 168 giờ`)
1. Thêm `"alliance-cup"` vào `Set` whitelist `storeFrame` của Mạng Floo.
2. Khai báo item diện mạo thưởng (không bán ở Hẻm Xéo):
   - `id` / `canonicalPowerId`: `"alliance-cup"`
   - `vietnameseName`: `"Quán Quân Cúp Liên Minh Tuần"`
   - `ability`: `"chat-frame-lease"`
   - `parameters`: `{ durationHours: 168, frameKey: "alliance-cup" }`
   - `permanentOnPurchase`: `false`
3. Ngay sau bước chia `200.000 Galleons` cho `qualifiedUids` trong job chốt sổ **`17:00 Thứ Sáu` (UTC+7)** (xem chi tiết tại `docs/handoff/house-cup-discipline-medals/HANDOFF_HPVN_HOUSE_CUP.md` §8), cấp lease `7 ngày` tính từ đúng mốc `17:00 Thứ Sáu` cho **đúng danh sách `qualifiedUids`** (không cấp cho thành viên 2 Nhà thắng chưa đạt `>= 5` ván):

```ts
// Tính chuẩn mốc 17:00 Thứ Sáu (UTC+7) của kỳ chốt sổ -> hết hạn đúng 17:00 Thứ Sáu tuần kế tiếp (7 ngày = 168h)
const FRIDAY_17H_VN_MS = Date.parse(`${cycleKey}T17:00:00+07:00`);
const EXPIRES_AT_MS = FRIDAY_17H_VN_MS + 7 * 24 * 60 * 60 * 1000;

for (const uid of qualifiedUids) {
  await grantFlooFrameLease({
    uid,
    frameKey: 'alliance-cup',
    source: `house_cup_alliance_${cycleKey}`,
    grantedAtMs: FRIDAY_17H_VN_MS,
    expiresAtMs: EXPIRES_AT_MS,
    durationHours: 168,
  });
}
```

*(Ghi chú: Nếu học sinh đồng thời giữ Hạng 1 ở 1 hoặc nhiều mini-game khác trong cùng tuần, cấp song song cả `"alliance-cup"` và `"champ-*"` để học sinh tự chọn đeo khung mình thích trong menu **Biến hình**).*

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

Bạn có thể copy nguyên đoạn dưới đây gửi kèm thư mục `alliance-cup/`:

> Nhờ bạn tích hợp giúp mình khung bong bóng vinh danh **Liên Minh Nhà Thắng Cúp Tuần (`alliance-cup`)** trên Mạng Floo (thiết kế chốt Mẫu F: **Nền Gấm Hoàng Gia 4 Nhà + Viền 4 màu tách rõ lồng chỉ vàng kim** + **Đại Cúp Cánh Phượng đặt ngay chính giữa viền trên**):
> 1. Copy 3 file ảnh (`cup-winged.webp`, `cup-winged-2x.webp`, `cup-winged.png`) trong thư mục `alliance-cup/` vào `public/images/floo-items/alliance-cup/`.
> 2. Dán file `alliance-cup-floo.css` vào stylesheet `data-store-frame` của Shoutbox/Floo.
> 3. Whitelist `"alliance-cup"` và gắn bước trao lease **`7 ngày (168h)` tính từ `17:00 Thứ Sáu` (UTC+7)** cho **đúng danh sách `qualifiedUids`** (thành viên 2 Nhà thắng đạt điều kiện `>= 5` ván tuần đó) ngay trong job chốt Cúp Tuần (chi tiết & code mẫu có sẵn trong `HANDOFF_HPVN_FLOO.md` và `HANDOFF_HPVN_HOUSE_CUP.md` §8). Cảm ơn bạn nhiều!

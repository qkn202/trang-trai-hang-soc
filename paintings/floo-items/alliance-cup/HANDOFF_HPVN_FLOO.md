# Hướng Dẫn Bàn Giao (Handoff): Khung Bong Bóng Liên Minh Nhà Thắng Cúp Tuần (`alliance-cup`) Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ tài nguyên đồ họa (`1x`/`2x` WebP + PNG dự phòng, dung lượng `7.4 KB – 22.5 KB`) và stylesheet chuẩn cấu trúc `.shout-message-row[data-store-frame="alliance-cup"]` của Mạng Floo để người quản trị repo **`hpvn-archive.net`** tích hợp làm phần thưởng danh hiệu **Liên Minh Nhà Thắng Cúp Tuần**.

---

## 1. Thông số thiết kế chốt & danh mục file bàn giao (trong thư mục `alliance-cup/`)

- **Mã khung (`data-store-frame`)**: **`"alliance-cup"`**
- **Thiết kế đã chốt**:
  - **Màu nền**: **Tứ Viện Ngân Hà** — 4 góc bong bóng toả hào quang bảo ngọc của đủ 4 Nhà Hogwarts (**Đỏ Hồng Ngọc Gryffindor** × **Lam Ngọc Ravenclaw** × **Vàng Hổ Phách Hufflepuff** × **Lục Bảo Slytherin**) điểm sao tứ sắc trên nền đêm Đại Sảnh Đường, bọc viền đôi Vàng Vương Miện (`#facc15` / `#fde047`).
  - **Cúp Vô Địch (`::after`)**: **Đại Cúp Cánh Phượng (`cup-winged`)** kích thước `48×48 px` đặt **ngay chính giữa đường viền trên** (`top: 0; left: 50%; transform: translate(-50%, -58%)`), kèm `margin-top: 20px` + `padding-top: 21px` + `min-width: 144px` để không bao giờ đè lên tên người gửi, giờ gửi hay dòng tin nhắn phía trên (kể cả khi nhắn 1 từ ngắn).
  - **Góc phụ (`::before`)**: Không gắn gì để Cúp Cánh Phượng ở giữa viền trên đối xứng hoàn hảo.
- **Đối tượng & thời hạn nhận khung đề xuất**: Toàn bộ học sinh thuộc **2 Nhà trong Liên Minh Hạng 1 Cúp Tuần trước** (hoặc user đạt danh hiệu Quán Quân Cúp Tuần), hiệu lực trong **7 ngày của tuần kế tiếp** (tự động chuyển cho Liên Minh vô địch mới mỗi đầu tuần).

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

### Bước 3 — Cấp khung `"alliance-cup"` cho Liên Minh Nhà Thắng Cúp Tuần
1. Thêm `"alliance-cup"` vào `Set` whitelist `storeFrame`.
2. Chọn 1 trong 2 cách cấp quyền hiển thị:

#### Phương án A — Cấp tự động theo 2 Nhà đương kim vô địch Cúp Liên Minh Tuần trong `decorateRow` *(Khuyên dùng — tự xoay vòng hàng tuần không cần phát lease lẻ)*
Khi trang Floo đã có thông tin `reigningChampionHouses: Set<HouseId>` (2 Nhà thuộc Liên Minh thắng Cúp tuần liền trước) và `cache[uid]?.house`:

```ts
// Ưu tiên: khung cá nhân đang chọn ở Biến Hình -> khung riêng user -> khung Liên Minh Thắng Cúp Tuần
const activeFrame =
  resolveStoreFrameKey(cache[uid]?.appearance) ??
  resolveExclusiveFrame(uid) ??
  (cache[uid]?.house && reigningChampionHouses.has(cache[uid].house)
    ? 'alliance-cup'
    : undefined);
```

*(Hoặc nếu chỉ cấp cho Top thành viên đóng góp của Liên Minh thắng Cúp Tuần, thêm `uid` của họ vào danh sách thưởng tuần kèm `expiresAtMs` = Chủ Nhật `23:59:59+07:00` giống hệt cơ chế `sun190`!)*

#### Phương án B — Cấp qua Lease `appearance-frame` có thời hạn `168 giờ (7 ngày)` trong job tổng kết Cúp Tuần
- Khai báo item diện mạo ẩn (không bán ở Hẻm Xéo):
  - `id` / `canonicalPowerId`: `"alliance-cup"`
  - `vietnameseName`: `"Quán Quân Cúp Liên Minh Tuần"`
  - `ability`: `"chat-frame-lease"`
  - `parameters`: `{ durationHours: 168, frameKey: "alliance-cup" }`
  - `permanentOnPurchase`: `false`
- Trong cron/hàm chốt bảng xếp hạng Cúp Liên Minh mỗi cuối tuần, cấp lease `168 giờ` cho danh sách học sinh đạt giải để các bạn tự bật/tắt được trong menu **Biến hình**.

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

Bạn có thể copy nguyên đoạn dưới đây gửi kèm thư mục `alliance-cup/`:

> Nhờ bạn tích hợp giúp mình khung bong bóng vinh danh **Liên Minh Nhà Thắng Cúp Tuần (`alliance-cup`)** trên Mạng Floo (thiết kế chốt: **Nền Tứ Viện Ngân Hà 4 Nhà** + **Đại Cúp Cánh Phượng đặt ngay chính giữa viền trên**):
> 1. Copy 3 file ảnh (`cup-winged.webp`, `cup-winged-2x.webp`, `cup-winged.png`) trong thư mục `alliance-cup/` vào `public/images/floo-items/alliance-cup/`.
> 2. Dán file `alliance-cup-floo.css` vào stylesheet `data-store-frame` của Shoutbox/Floo.
> 3. Thêm `"alliance-cup"` vào `Set` whitelist frame và gắn cho Liên Minh Nhà vô địch Cúp Tuần (hoặc phát lease `168h = 7 ngày` khi tổng kết tuần — chi tiết cả 2 phương án có sẵn trong `HANDOFF_HPVN_FLOO.md` kèm `preview.html` để mở xem trước). Cảm ơn bạn nhiều!

# Hướng Dẫn Bàn Giao (Handoff): Gắn Khung Chat Mạng Floo «Pha Lê Cầu Vồng» (`crystal-mine`) Cho ID `pangting`

Gói tài nguyên và stylesheet hoàn chỉnh cho khung bong bóng chat Mạng Floo phong cách quý phái, huyền bí — **gắn trực tiếp cho tài khoản có ID / username: `pangting`** trên `hpvn-archive.net`:

- **Tài khoản nhận khung:** User ID / username **`pangting`** *(gắn riêng cho `pangting`, không mở bán đại trà trên Hẻm Xéo)*.
- **Mã khung (`data-store-frame`):** `"crystal-mine"` (bản chốt Mẫu số 2 «Tinh Vân Nhung» — phiên bản tinh giản thanh lịch).
- **Nền gương tinh vân tím khói nhung đứng yên (`padding-box`):** Giữ nguyên 100% bảng màu Mẫu số 2 — ~70% nền đen mực & đen tím nhung (`#0a090f → #1e1429`) pha ~30% mây tím mận nhung ấm (`#573763 → #704784 → #885e99`, không pha xanh lạnh); tách riêng lớp cung quỹ đạo tròn & chòm sao khắc mảnh (`preserveAspectRatio="xMidYMid slice"`) để vòng tròn luôn cân đối kể cả trên bong bóng ngắn — **đứng yên hoàn toàn, không sao 4 cánh lấp lánh**.
- **Viền mảnh trang sức & chỉ đôi champagne đứng yên (`border-box` + `box-shadow`):** Khung viền kim loại vàng champagne phay lụa mảnh `1.5px` (`#9b8259 / #f0e1c2 / #fff8ea`) kết hợp chỉ lồng champagne nội vi mảnh (`4.85px` inset), viền mảnh tối `1px` bao ngoài tách sắc nét trên cả nền tối lẫn nền sáng, ánh lụa champagne giữa mép trên/dưới và 2 hoa văn móc chỉ mảnh kèm viên thoi champagne cố định 2 góc đối xứng — thanh lịch, **không dày nặng hay diêm dúa**.
- **Biểu tượng Trái Mìn Pha Lê Cầu Vồng nổ tung hiện số `777` cầu vồng ánh kim (`::after` + `::before` — khung hiệu ứng `96×96px`, trái mìn `54×54px` ở tâm):** Duy nhất phần có chuyển động, chu kỳ `6.2s` 100% CSS thuần (`crystalMineDetonate` + `crystalMine777Reveal`) — trôi êm → rung nạp năng lượng → nén lực → **NỔ TUNG** chớp sáng lõi, giãn vòng sóng xung kích, bắn 10 mảnh pha lê đá quý cầu vồng và **bật hiện rõ số `777` màu cầu vồng ánh kim chrome nổi khối 3D** (~1.2s) → tan nhẹ rồi tái tụ hình trái mìn (tự tắt khi `prefers-reduced-motion: reduce`, 0 JS).

---

## 1. Cấu trúc tệp

- Ảnh WebP `1x`/`2x` (đã tối ưu alpha trên nền tối lẫn sáng):
  - `public/paintings/floo-items/crystal-mine/crystal-mine.webp` (`64×64px`, `2.3 KB`)
  - `public/paintings/floo-items/crystal-mine/crystal-mine-2x.webp` (`128×128px`, `5.8 KB`)
- Bản dự phòng PNG, stylesheet & trang xem trước trực quan:
  - `docs/handoff/crystal-mine/crystal-mine.png` (`64×64px`, `6.5 KB`)
  - `docs/handoff/crystal-mine/crystal-mine-floo.css`
  - `docs/handoff/crystal-mine/preview.html`

---

## 2. Tích hợp sang repo `hpvn-archive.net` (gắn cho ID `pangting`)

### Bước 1 — Tra `uid` của tài khoản `pangting`
Trong Firestore `(default)` của project `hpvnn-archive` (collection `usernames/pangting` hoặc `users` có `username == "pangting"` / `usernameLower == "pangting"`), lấy mã Firebase Auth **`uid`** của tài khoản **`pangting`** (ký hiệu bên dưới là `<PANGTING_UID>`).

### Bước 2 — Copy 3 file ảnh vào `public/`
Copy 3 file ảnh (`crystal-mine.webp`, `crystal-mine-2x.webp` từ `public/paintings/floo-items/crystal-mine/` và `crystal-mine.png` từ `docs/handoff/crystal-mine/`) vào:

```text
public/images/floo-items/crystal-mine/
  ├─ crystal-mine.webp
  ├─ crystal-mine-2x.webp
  └─ crystal-mine.png
```

*(Khớp 100% với đường dẫn `/images/floo-items/crystal-mine/*` trong `crystal-mine-floo.css`.)*

### Bước 3 — Nhúng CSS khung bong bóng
Nhúng nội dung `docs/handoff/crystal-mine/crystal-mine-floo.css` vào stylesheet khung bong bóng Mạng Floo / Shoutbox.

### Bước 4 — Whitelist & gắn trực tiếp khung `"crystal-mine"` cho ID `pangting`
1. Thêm `"crystal-mine"` vào `Set` whitelist `storeFrame` của phòng chat Floo.
2. Gắn khung **`"crystal-mine"`** cho tài khoản **`pangting`** theo một trong hai cách chuẩn của repo `hpvn-archive.net`:
   - **Cách A — Gắn trực tiếp theo `uid` trong `EXCLUSIVE_USER_FRAMES` (khuyên dùng, không cần đụng Hẻm Xéo):**
     ```ts
     const EXCLUSIVE_USER_FRAMES: Record<string, { frame: string; expiresAtMs?: number }> = {
       // ...các tài khoản khác (kimchi, Aries, ...)
       '<PANGTING_UID>': { frame: 'crystal-mine' }, // user ID: pangting
     };
     ```
   - **Cách B — Hoặc cập nhật thẳng vào hồ sơ Firestore của `pangting`:** đặt trường `appearance.storeFrame = "crystal-mine"` trên document `users/<PANGTING_UID>` (sau khi đã thêm `"crystal-mine"` vào whitelist `storeFrame`).

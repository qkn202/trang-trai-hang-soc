# Triển khai, Hướng dẫn Mobile Android/iOS & Báo cáo Kiểm thử Airplane Mode

Tài liệu bàn giao đi kèm bản **Hang Sóc Mini-games Offline** (`dist-offline/`), thực hiện đầy đủ theo [`OFFLINE_MINIGAME_HANDOFF.md`](OFFLINE_MINIGAME_HANDOFF.md).

---

## 1. Kiến trúc & Các lệnh Build / Kiểm thử

| Lệnh | Chức năng |
|---|---|
| `npm run dev:offline` | Chạy Vite dev server riêng cho bản offline tại `http://localhost:5174/` |
| `npm run test:offline` | Chạy bộ kiểm thử Vitest độc lập (`src/offline/__tests__/offlineApp.test.ts`) |
| `npm run build:offline` | Kiểm tra `tsc --noEmit` → đóng gói `dist-offline/` → chạy cổng kiểm định `tools/verify-offline-bundle.mjs` |
| `npm run preview:offline` | Xem trước bản sản xuất `dist-offline/` (mặc định `http://localhost:4173/`) |

### Đảm bảo cô lập 100% với bản Nông Trại chính
- **Entry độc lập:** `public/offline/index.html` → `src/offline/main.ts` (`src/main.ts` của game chính không bị chỉnh sửa).
- **Save độc lập:** Lưu vào khóa riêng `hangsoc-offline-minigames-v1` kết hợp **IndexedDB** (`hangsoc-offline-minigames-db` làm kho chính chống dọn cache trên iOS) + `localStorage` (đọc đồng bộ 0ms khi mở app). Tuyệt đối không đọc/ghi khóa `burrow_hogsmeade_777_v3`.
- **Zero Backend / Network:** `tools/verify-offline-bundle.mjs` và job CI `offline-minigames-pwa` trong `.github/workflows/ci.yml` tự động fail nếu xuất hiện `fetch(`, `sendBeacon`, `XMLHttpRequest`, `WebSocket`, `firebase`, `cloudfunctions`, `authoritative`, `onlineBootstrap`, `cloudSave` hoặc `/api/` trong app bundle.

---

## 2. Triển khai lên URL riêng (Static Hosting)

Bản build nằm trọn trong thư mục tĩnh `dist-offline/` với `base: './'`, tương thích đồng thời cho cả **subdomain riêng** lẫn **subpath `/offline/`**:

- **Khuyến nghị Subdomain riêng (cô lập hoàn toàn Origin, Cache & Storage):**
  `https://mini-game.hangsoc.vn/` (hoặc `https://<project>-offline.netlify.app/` / `https://<project>-offline.vercel.app/`)
- **Hoặc Subpath riêng:**
  `https://<your-domain>/offline/` (khi cần cố định base tuyệt đối có thể truyền `VITE_OFFLINE_BASE_PATH=/offline/ npm run build:offline`).

### Cấu hình sẵn theo nền tảng
1. **Netlify:** Tạo site mới trỏ vào repo, chọn file cấu hình [`netlify.offline.toml`](netlify.offline.toml) (`build.command = "npm run build:offline"`, `publish = "dist-offline"`). File `dist-offline/_headers` cũng đã được sinh sẵn.
2. **Vercel:** Tạo project riêng, dùng cấu hình [`vercel.offline.json`](vercel.offline.json) (`buildCommand: "npm run build:offline"`, `outputDirectory: "dist-offline"`).
3. **Firebase Hosting (Site riêng không kèm Cloud Functions):**
   ```bash
   npx -y firebase-tools@latest hosting:sites:create hangsoc-minigames-offline
   # Trỏ public: "dist-offline" cho target site này và deploy riêng hosting
   ```
4. **GitHub Actions Artifact / GitHub Pages:** Workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) tự động chạy `npm run test:offline` + `npm run build:offline` và xuất artifact `dist-offline` (đã kèm `.nojekyll`).

### Quy tắc Cache Headers đã cấu hình
- `/index.html`, `/offline.html`, `/manifest.webmanifest`, `/sw.js`: `Cache-Control: no-cache, max-age=0, must-revalidate`
- `/assets/*` (JS/CSS có mã băm): `Cache-Control: public, max-age=31536000, immutable`

---

## 3. Hướng dẫn cài đặt & chơi Offline trên Android / iOS

### Trên Android (Chrome / Edge / Samsung Internet)
1. Mở URL bản Mini-games Offline khi đang có mạng Wi-Fi / 4G (cần HTTPS).
2. Chờ 3–5 giây ở màn hình sảnh để biểu tượng **`⚡ OFFLINE • Sẵn sàng không cần mạng`** hiển thị (Service Worker đã precache toàn bộ 5 trò chơi, phông chữ tiếng Việt và tranh ghép).
3. Nhấn biểu tượng **⋮** ở góc trên bên phải Chrome → chọn **Thêm vào màn hình chính** (*Add to Home screen* / *Install app*) → xác nhận **Cài đặt**.
4. Bật **Chế độ Máy bay (Airplane Mode)**, chạm biểu tượng **Hang Sóc Games** ngoài màn hình chính để mở app ở chế độ toàn màn hình (`standalone`).

### Trên iPhone / iPad (Safari iOS 16.4+)
1. Mở URL bản Mini-games Offline bằng trình duyệt **Safari** khi có mạng.
2. Đợi trang tải xong hoàn toàn lần đầu (2–5 giây).
3. Nhấn nút **Chia sẻ (Share — biểu tượng ô vuông có mũi tên hướng lên)** ở thanh dưới cùng → cuộn chọn **Thêm vào MH chính** (*Add to Home Screen*) → nhấn **Thêm (Add)**.
4. Bật **Chế độ Máy bay (Airplane Mode)** và mở trực tiếp từ biểu tượng **Hang Sóc Games** trên màn hình chính.
5. **Lưu ý bảo toàn dữ liệu trên iOS:** Không xóa dữ liệu trang web (*Clear History and Website Data*) trong Cài đặt Safari để giữ nguyên màn đã mở và kỷ lục trên máy. App đã sử dụng đồng thời **IndexedDB + localStorage** để tăng độ bền lưu trữ.

---

## 4. Báo cáo Kiểm thử Offline / Airplane Mode & Mobile Viewports

### 4.1. Kiểm thử Đơn vị & Bundle Gate (`Vitest` + `verify-offline-bundle.mjs`)
- `npm run test:offline`: **8/8 bài kiểm thử đạt (100%)**:
  - Khởi động với `localStorage` rỗng, bảo toàn khóa save `burrow_hogsmeade_777_v3` của game chính.
  - Chơi Match-3, lưu phiên chơi dở + điểm cao, đóng và mở lại app giữ nguyên 100%.
  - Đặt lại tiến trình (`Reset Save`) đưa về mặc định an toàn.
  - Tự phục hồi khi JSON hỏng (`{corrupted_json...`) không gây trắng trang.
  - Chuyển liên tục qua cả 5 trò chơi không rò listener/state.
  - Tương tác bằng sự kiện cảm ứng (`PointerEvent` với `pointerType: 'touch'`).
  - Tự động lưu checkpoint khi `visibilitychange` (`hidden`) và `pagehide`.
  - Chạy toàn bộ 5 trò chơi khi `navigator.onLine = false` với spy chặn cứng `fetch()` và `navigator.sendBeacon()` (**0 lần gọi mạng**).
- `npm run build:offline`: **Đạt 100%**, đóng dấu `CACHE_VERSION = 'offline-v1-a41a53e2'` với **295 tệp precache** (toàn bộ JS/CSS chunks của cả 5 gói ngôn ngữ Anh/Hàn/Trung/Tây Ban Nha/Nhật, tranh ghép, kẹo phép và 113 sprite).

### 4.2. Kiểm thử Thực tế trên Trình duyệt Mobile Emulation (Android & iPhone Profiles + Offline Network)
Đã chạy kiểm thử thực tế trên `vite preview --outDir dist-offline` với chế độ ngắt mạng trình duyệt (`Offline / Airplane Mode`):

| Hạng mục kiểm tra | Thiết bị / Kích thước mô phỏng | Kết quả | Ghi nhận chi tiết |
|---|---|---|---|
| **iPhone SE (nhỏ gọn)** | `320 × 568` (Portrait) | **PASS** | `scrollWidth = 320px`, không tràn ngang, bàn phím Sudoku tự thu gọn 5 cột rõ nét. |
| **iPhone 13 / 14 tiêu chuẩn** | `375 × 812` (Portrait) | **PASS** | `scrollWidth = 360px`, 5 thẻ game chạm nhạy (`≥ 44px`), huy hiệu `⚡ OFFLINE` hiển thị chuẩn. |
| **Android / iPhone Pro Max** | `430 × 932` (Portrait) | **PASS** | `scrollWidth = 420px`, bố cục cân đối, chữ tiếng Việt có dấu sắc nét từ font `.woff2` nội bộ. |
| **Xoay ngang (Landscape)** | `812 × 375` (Landscape) | **PASS** | `scrollWidth = 800px`, không mất phiên đang chơi khi xoay dọc ↔ ngang. |
| **Service Worker Precache** | `offline-sw` (`./sw.js`) | **PASS** | Kích hoạt `activated`, tạo bộ nhớ đệm `hangsoc-offline-offline-v1-*` và phục vụ trang ngay khi ngắt mạng + Reload. |
| **5 Mini-game khi Offline** | Match-3, Jigsaw, Sudoku, Blocks, Seed Quiz | **PASS** | Cả 5 game mở tức thì khi Offline, chơi & lưu trạng thái `▶ Ván dở`, chuyển đổi đủ 5 ngôn ngữ (`EN/KO/ZH/ES/JA`) không cần mạng. |
| **Lưu trữ & Hộp thoại `<dialog>`** | `Kỷ lục trên máy` & `Đặt lại lưu` | **PASS** | Reload giữ nguyên Xu phép (`473`), XP (`10`), 4 phiên chơi dở và điểm Quiz (`120 đ`); hủy hộp thoại Reset không mất dữ liệu. |
| **Console & Network Audit** | DevTools Console / Network | **PASS** | `0` request tới `/api/`, `0` request ra ngoài origin, `0` lỗi runtime console. |

> **Khuyến nghị bước nghiệm thu thiết bị vật lý sau khi đẩy lên HTTPS:** Sau khi deploy thư mục `dist-offline/` lên domain HTTPS riêng (theo Mục 2), mở URL trên 1 máy Android Chrome thật và 1 máy iPhone Safari thật → thực hiện *Add to Home Screen* theo Mục 3 → bật *Airplane Mode* phần cứng để xác nhận lần cuối biểu tượng màn hình chính trên thiết bị thực.

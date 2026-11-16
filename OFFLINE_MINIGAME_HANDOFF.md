# Handoff: Tách bản Mini-game Offline thành Webapp độc lập

## 1. Mục tiêu

Tạo một webapp/PWA **độc lập hoàn toàn** dành cho mobile, chỉ chứa các mini-game của Hang Sóc:

- Bùa Gặt Honeydukes / Match-3
- Puzzle Arcade: Jigsaw, Sudoku, Blocks
- Seed Quiz / Language Quiz

Bản offline phải:

- Chạy được sau khi tải/cài lần đầu.
- Không cần Firebase, Cloud Functions, API, leaderboard, analytics, cloud save hoặc HPVN bridge.
- Hoạt động khi bật Airplane Mode.
- Lưu tiến trình, high score, màn đã mở và cài đặt bằng local storage/IndexedDB.
- Có thể cài như PWA trên Android Chrome và iOS Safari.
- Được build/deploy độc lập, không ảnh hưởng bản game nông trại chính.

Phạm vi **không** bao gồm:

- Nông trại 2.5D, xây dựng, hàng xóm, Floo, cloud save.
- Leaderboard online hoặc đồng bộ tài khoản.
- Backend/server/functions.
- Firebase Auth, Firestore, HPVN embed bridge.

---

## 2. Kiến trúc thư mục đề xuất

Không sửa entry chính `src/main.ts`. Tạo entry riêng:

```text
src/offline/
  main.ts                 # bootstrap app độc lập
  app.ts                  # state, router, screen lifecycle
  offlineStorage.ts       # localStorage/IndexedDB wrapper
  offlineTypes.ts         # state riêng cho offline app
  offlineCatalog.ts       # danh sách mini-game + metadata
  screens/
    gameSelect.ts         # màn hình chọn mini-game
    match3Screen.ts
    puzzleScreen.ts       # jigsaw/sudoku/blocks
    seedQuizScreen.ts
  styles.css

public/offline/
  index.html
  manifest.webmanifest
  sw.js
  icons/
```

Có thể đặt `src/offline/` trong cùng repository, nhưng output phải nằm trong thư mục riêng:

```text
dist-offline/
  index.html
  assets/
  sprites/
  paintings/
  fonts/
  manifest.webmanifest
  sw.js
  offline.html
```

Khuyến nghị deploy subdomain riêng:

```text
https://mini-game.hangsoc.example/
```

Hoặc hosting path riêng:

```text
https://game.example.com/offline/
```

Nếu dùng subdomain, bản offline có origin/localStorage riêng. Đây là chủ ý: bản offline không được làm hỏng save của bản chính.

---

## 3. Các module được phép tái sử dụng

Ưu tiên tái sử dụng logic thuần local, không tái sử dụng bootstrap của game chính.

### Có thể dùng lại

```text
src/sim/candyHogwartsEngine.ts
src/sim/jigsawEngine.ts
src/sim/puzzleArcadeEngine.ts
src/sim/languageQuizEngine.ts
src/sim/puzzleShared.ts
src/data/candyHogwartsLevels.ts
src/data/match3Levels.ts
src/data/languageQuizBank.ts
src/data/jigsawPaintings.ts
src/types/game.ts      # chỉ lấy type cần thiết
src/render/fx/minigameGpuFx.ts  # nếu không kéo theo world renderer
```

### Không được import từ offline entry

```text
src/main.ts
src/ui/onlineBootstrap.ts
src/ui/cloudSave.ts
src/ui/authoritativeClient.ts
src/ui/analytics.ts
src/ui/errorMonitor.ts
src/ui/hpvnBridge.ts
src/functions/*
server/*
src/sim/simulation.ts       # trừ khi một modal bắt buộc, xem mục 4
src/ui/hud.ts
src/ui/hudShell.ts
```

Hiện các modal gốc (`match3Modal.ts`, `puzzleArcadeModal.ts`, `seedQuizModal.ts`) còn tham chiếu một số loại/core như `ParkSimulation`, catalog và sprite loader. Không copy nguyên modal vào offline app một cách mù quáng. Tách phần UI/game loop cần thiết thành screen/controller offline; hoặc tạo adapter tối thiểu.

---

## 4. Quy tắc tách dependency

### 4.1. Không dùng `ParkSimulation` làm runtime chính

Tạo state riêng:

```ts
export interface OfflineMiniGameState {
  version: 1;
  coins: number;
  xp: number;
  match3: SavedMatch3Session | null;
  puzzleArcade: {
    jigsaw: Record<string, unknown>;
    sudoku: Record<string, unknown>;
    blocks: Record<string, unknown>;
  };
  seedQuiz: Record<string, unknown>;
  settings: {
    sound: boolean;
    haptics: boolean;
    language: 'vi' | 'en';
  };
  updatedAt: number;
}
```

Nếu engine hiện tại nhận `GameState`, tạo adapter object chỉ chứa field mà engine đọc. Không khởi tạo farm grid, villagers, cloud wallet hoặc neighbor state.

### 4.2. Save độc lập

Dùng key riêng, ví dụ:

```text
hangsoc-offline-minigames-v1
```

Không dùng:

```text
burrow_hogsmeade_777_v3
```

Save phải:

- Có schema version.
- Có migration function.
- Ghi atomic: serialize trước, chỉ set storage sau khi serialize thành công.
- Bắt lỗi quota/storage disabled.
- Có nút Reset local progress trong Settings.
- Không gọi `fetch`, `sendBeacon`, Firebase hoặc cloud API.

Nếu muốn chống mất save khi mobile browser dọn localStorage, dùng IndexedDB làm primary và localStorage làm fallback. Không cần encryption cho bản offline.

### 4.3. Progression offline

Điểm và phần thưởng chỉ ghi local:

```text
match3 score -> local high score
jigsaw clear -> local cleared paintings
sudoku/block win -> local stats
seed quiz -> local streak/xp
```

Không submit leaderboard. Không gọi `proofOfPlay` để gửi server.

---

## 5. Build Vite riêng

Có hai lựa chọn. Khuyến nghị lựa chọn A.

### Lựa chọn A — Vite config riêng

Tạo `vite.offline.config.ts`:

```ts
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  publicDir: 'public/offline',
  build: {
    outDir: 'dist-offline',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'public/offline/index.html'),
    },
  },
});
```

`public/offline/index.html` phải load entry offline:

```html
<script type="module" src="/src/offline/main.ts"></script>
```

Với `base: './'`, kiểm tra kỹ URL asset sau khi deploy subpath. Nếu deploy root subdomain có thể dùng `/`.

Thêm scripts:

```json
{
  "build:offline": "tsc --noEmit && vite build --config vite.offline.config.ts",
  "preview:offline": "vite preview --outDir dist-offline",
  "test:offline": "vitest run src/offline src/sim/__tests__/offline*"
}
```

### Lựa chọn B — Một Vite build nhiều entry

Chỉ dùng nếu đội build đã quen Rollup multi-page. Khi đó giữ output chung nhưng phải chắc main app không kéo `onlineBootstrap` vào offline chunk. Kiểm tra bundle bằng `vite build --mode offline` và xem `dist/assets` không có code backend.

Không trộn service worker của bản chính với bản offline.

---

## 6. PWA offline bắt buộc

Tạo `public/offline/manifest.webmanifest`:

```json
{
  "id": "/offline/",
  "name": "Hang Sóc Mini-games Offline",
  "short_name": "Hang Sóc Games",
  "lang": "vi",
  "display": "standalone",
  "orientation": "any",
  "start_url": "./",
  "scope": "./",
  "background_color": "#241912",
  "theme_color": "#241912",
  "categories": ["games", "puzzle"],
  "icons": [
    { "src": "./icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "./icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Service worker riêng phải:

1. Precache `index.html`, manifest, offline fallback.
2. Precache toàn bộ JS/CSS entry chunks sau build.
3. Precache hoặc cache-first toàn bộ asset mini-game: painting, sprite, font, audio.
4. Navigation: cache-first hoặc network-first với cached fallback.
5. Không bao giờ gọi API online.
6. Có cache version tăng mỗi release.
7. Xóa cache version cũ trong `activate`.
8. Có `skipWaiting()` + `clients.claim()` nhưng chỉ reload an toàn khi không có dialog game đang mở.

Không dùng strategy chỉ cache khi người chơi đã mở mini-game. Bản offline độc lập phải precache toàn bộ game để vừa cài xong có thể bật Airplane Mode ngay.

Nếu danh sách chunk có hash, tạo manifest chunk sau build bằng plugin Vite hoặc script Node đọc `dist-offline/assets`. Không hard-code hash.

---

## 7. UI/UX tối thiểu trên mobile

Màn hình đầu tiên phải render được ngay từ cache:

- Logo/tên bản offline.
- 5 nút mini-game lớn, chạm dễ trên màn hình 375px.
- Badge `OFFLINE` hoặc `Đang chơi ngoại tuyến`.
- Nút âm thanh/rung.
- Nút reset save.
- Nút `Về game chính` chỉ mở URL chính nếu có mạng; không được chặn app nếu offline.

Trong mỗi mini-game:

- Không phụ thuộc hover hoặc chuột phải.
- Hỗ trợ touch/pointer events.
- Không yêu cầu đăng nhập.
- Không hiện nút leaderboard online; thay bằng `Kỷ lục trên máy`.
- Không để Promise network chưa bắt lỗi làm unhandled rejection.
- Lưu progress sau các checkpoint quan trọng và khi `visibilitychange`/`pagehide`.
- Khi xoay màn hình, không reset session.

---

## 8. Tách online leaderboard khỏi mini-game

Trong bản offline:

- Không import `onlineBootstrap`.
- Không gọi `bindAuthoritativeLeaderboardClient`.
- Không gọi `syncAllPlayerCloudLeaderboards`.
- Không gọi `submitPlayerCloudLeaderboardEntry`.
- Không import `cloudSave`, `authoritativeClient`, `proofOfPlay` chỉ để chấm điểm.

Nếu reuse modal gốc bắt buộc, inject callback local:

```ts
const offlineServices = {
  submitScore: async () => undefined,
  fetchLeaderboard: async () => [],
  notify: (msg: string) => showLocalToast(msg),
};
```

Nhưng ưu tiên adapter compile-time để offline bundle không chứa code backend.

Kiểm tra bằng:

```bash
grep -R "fetch(\|sendBeacon\|firebase\|cloudfunctions\|authoritative\|onlineBootstrap" dist-offline
```

Kết quả hợp lệ: không có network code ngoài code cần thiết cho browser/runtime. Tốt nhất thêm script CI fail nếu pattern này xuất hiện.

---

## 9. Test bắt buộc

### Unit

- Mở app với `localStorage` rỗng.
- Chơi một ván Match-3 và reload → progress/high score giữ.
- Clear local save → state về mặc định.
- Save hỏng JSON → app tự tạo state mới, không trắng trang.
- Chuyển giữa 5 mini-game → không rò state.
- Touch input thay vì mouse input.
- Chuyển `visibilitychange` / pagehide → save được.
- `navigator.onLine = false` không làm bất kỳ màn nào throw.
- Không có request tới API.

### Build

```bash
npm run build:offline
npm run test:offline
```

Kiểm tra `dist-offline` chỉ chứa asset cần thiết.

### Browser preview

```bash
npm run preview:offline -- --host 0.0.0.0
```

Test:

1. Mở trang khi online.
2. DevTools → Application → Service Workers: `offline-sw` activated.
3. DevTools → Network → Offline.
4. Reload.
5. Vào từng mini-game.
6. Chơi ít nhất một round, reload từng màn.
7. Kiểm tra save và high score.
8. Mở Chrome Android thật.
9. Add to Home Screen.
10. Bật Airplane Mode.
11. Mở icon PWA, test landscape + portrait.
12. Test Safari iOS tương tự.

### Acceptance criteria

- Sau một lần cài/tải thành công, Airplane Mode vẫn mở được app.
- Tất cả 5 mini-game mở được khi offline.
- Không có console error nghiêm trọng.
- Không có request mạng trong offline mode.
- Save và high score tồn tại sau đóng/mở app.
- Không load Firebase/backend code trong offline bundle.
- App hoạt động ở viewport 320×568, 375×812 và 430×932.

---

## 10. Deploy riêng

### Static hosting

Deploy chỉ thư mục `dist-offline` lên một site riêng:

- Netlify: publish directory `dist-offline`.
- Vercel: project root hiện tại, build command `npm run build:offline`, output `dist-offline`.
- Firebase Hosting: tạo site riêng, `public: dist-offline`, không deploy Functions.
- GitHub Pages: copy `dist-offline` vào artifact riêng.

Cần HTTPS. Không dùng `file://` và không dùng HTTP IP LAN để kiểm tra Service Worker production.

### Cache headers

- `index.html`, manifest, `sw.js`: `Cache-Control: no-cache` hoặc revalidate nhanh.
- Hashed JS/CSS/images: `Cache-Control: public,max-age=31536000,immutable`.
- Không cache nhầm HTML cũ dưới URL hashed.

### Release

Mỗi release:

1. Tăng `CACHE_VERSION` trong offline SW hoặc sinh từ git SHA.
2. Build `dist-offline` sạch.
3. Chạy test offline.
4. Chạy smoke test online + Airplane Mode.
5. Deploy.
6. Mở app cũ để kiểm tra SW update.
7. Xác nhận không mất local save sau update.

---

## 11. Các rủi ro cần tránh

1. **Import nhầm `src/main.ts`**: kéo cả world renderer, online bootstrap và bundle lớn.
2. **Dùng chung localStorage key với game chính**: reset một app có thể làm hỏng app kia.
3. **Lazy import chưa được precache**: mất mạng trước khi mở mini-game sẽ không vào được.
4. **Service worker scope sai**: SW ở `/` có thể đụng cache game chính; dùng scope/subdomain riêng.
5. **Dynamic API call từ leaderboard**: mini-game vẫn chơi được nhưng console spam/rejection; bỏ hẳn online callback.
6. **Assume `navigator.onLine` luôn đúng**: đây chỉ là hint; gameplay không được phụ thuộc vào nó. Cache/local state mới là nguồn sự thật.
7. **iOS storage eviction**: hướng dẫn người dùng cài PWA và không xóa app/site data; cân nhắc IndexedDB.
8. **Assets case-sensitive**: build Linux/GitHub Pages sẽ fail nếu đường dẫn khác chữ hoa/thường.
9. **Base URL sai**: test cả root subdomain và path `/offline/`.
10. **Tải asset ngoài origin**: fonts, images, audio phải self-host để offline.

---

## 12. Deliverables của người thực hiện

- `src/offline/*`
- `public/offline/index.html`
- `public/offline/manifest.webmanifest`
- `public/offline/sw.js`
- `vite.offline.config.ts`
- `dist-offline` build thành công
- `npm run build:offline`
- `npm run test:offline`
- Unit tests cho save + offline startup
- CI job kiểm tra offline bundle không có backend/network imports
- URL deploy riêng
- Hướng dẫn mobile Android/iOS
- Báo cáo test Airplane Mode trên ít nhất một Android và một iPhone

## Definition of Done

Người dùng có thể mở URL bản mini-game khi có mạng, cài Add to Home Screen, bật Airplane Mode, mở lại từ icon và chơi Match-3/Jigsaw/Sudoku/Blocks/Seed Quiz; điểm và progress vẫn được lưu cục bộ; không cần tài khoản, API hoặc backend.

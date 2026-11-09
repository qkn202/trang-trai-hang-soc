# AGENTS.md — Trang Trại Hang Sóc & Thung Lũng Hogsmeade

Dành cho các agent/người làm việc trên repo này. **Đọc file này trước khi sửa code.**

---

## 0. Ranh giới công việc (quan trọng nhất)

Có **hai nhóm người làm việc song song** trên repo này:

| Nhóm | Phạm vi | Không được đụng |
|---|---|---|
| **Agent / developer** | Toàn bộ `src/`, `public/paintings/`, `tools/`, config, build | — |
| **Artist (người vẽ asset)** | **Chỉ** `public/sprites/*.png` | Mọi thứ trong `src/`, `tools/`, `dist/`, config |

### Nếu bạn là artist
- Đọc [`ASSETS.md`](ASSETS.md) — toàn bộ style guide **Canon Hang Sóc × Playrix Township 2.5D Cozy Farm** (cùng quy chuẩn Plinth-Free), bảng màu, quy tắc kích thước, danh mục **172 sprite**.
- Chỉ ghi đè file PNG trong `public/sprites/`, **giữ nguyên tên file**.
- Chạy `node tools/validate-sprites.mjs` trước khi bàn giao (`172/172` sprite hợp lệ).
- Xem trước hậu kỳ viền nâu tuỳ chọn bằng `python3 tools/preview-toon.py <file.png> out.png`.
- **Không sửa** `src/engine/spriteLoader.ts` (danh sách key), `src/data/catalog.ts`, hay bất kỳ file `.ts` nào.
- Nếu cần thêm sprite mới: báo lại để agent thêm key vào loader, không tự thêm.

### Nếu bạn là agent/dev
- Được sửa mọi thứ trong `src/`.
- **Không** sửa `public/sprites/*.png` (asset do artist lo) — trừ khi được yêu cầu rõ ràng.
- Không đổi tên file trong `public/sprites/`.
- Khi thêm sprite mới: thêm key vào `SPRITE_KEYS` (`src/engine/spriteLoader.ts`) **và** thêm vào `REQUIRED` trong `tools/validate-sprites.mjs` (cập nhật cả `ASSETS.md`).

---

## 1. Cấu trúc dự án

```
congviengiaitri/
├── index.html                 # Entry HTML, preload font tiếng Việt tự host (.woff2), CSP, PWA manifest & Service Worker
├── vite.config.ts             # Cấu hình build Vite, tách chunk engine/sim/match3/arcade & gói ngôn ngữ quiz-*.js
├── vitest.config.ts           # Cấu hình kiểm thử tự động Vitest
├── src/
│   ├── main.ts                # Bootstrap, input loop, camera, build/place/unveil/greet logic, URL debug
│   ├── styles/main.css        # Toàn bộ UI chrome, HUD 5 cụm neo Township, 5 sảnh khảo thí fullscreen, Học Viện Thần Chú & Đại Tiệc Mùa Gặt (tokens ở :root)
│   ├── engine/
│   │   ├── isometric.ts       # Toạ độ lưới ↔ pixel, phép chiếu isometric, xoay 90°
│   │   ├── renderer.ts        # Vẽ thung lũng sống động: cánh cối xay & guồng nước xoay, giàn giáo & băng khánh thành, dân làng đi dạo, ruộng 4 giai đoạn, mask12
│   │   ├── spriteLoader.ts    # Nạp + cache 172 sprite 100% Plinth-Free, ghép rào liền mạch mask12, mipmap 0.5x, 1-bit alpha hit-test
│   │   ├── groundBlend.ts     # Hoà chân tường công trình tự nhiên vào thảm cỏ nắng ấm (PLINTH_KEYS rỗng 0 mục)
│   │   ├── toon.ts            # Hậu kỳ tuỳ chọn Sunlit Storybook (mặc định tắt để giữ chất sơn 2.5D Playrix)
│   │   ├── waterOutlines.ts   # Tách viền bờ hồ: loop bờ nước + Catmull-Rom + lớp bọt/sand
│   │   ├── pathfinding.ts     # Tìm đường cho gia đình Weasley & gia tinh
│   │   ├── audio.ts           # Nhạc nền ADAPTIVE (5 MP3) & SFX vật lý giải mã từ sfx_atlas.mp3 + Web Audio
│   │   ├── bgmMood.ts         # Pure function pickBgmMood(timeOfDay, weather, festival) → 5 mood (BGM adaptive theo thời tiết)
│   │   ├── juiceFx.ts         # Hậu kỳ canvas: ScreenShake / Flash / Confetti / MicroFX (reduced-motion aware, không DOM)
│   │   └── __tests__/         # Unit tests cho isometric, pathfinding, renderer, juiceFx & pickBgmMood
│   ├── sim/
│   │   ├── simulation.ts      # Nguồn sự thật: Sao Phép Thuật, giờ xây & Lễ Cắt Băng Khánh Thành, Đại Tiệc Mùa Gặt 30 bậc, dân làng đi dạo, Kho Đỏ, Đơn Cú, xưởng, ruộng
│   │   ├── neighborSocial.ts  # Sổ Hàng Xóm, thăm thung lũng 72×72, trợ giúp vườn/Đơn Cú & Giải Cứu Khảo Thí 1 lần/ngày/bạn
│   │   ├── minigameLeaderboard.ts # Bảng xếp hạng riêng cho từng mini game (6 môn: Toàn Thung Lũng, Bạn Bè, Kỷ Lục Cá Nhân & đồng bộ Cloud KV)
│   │   ├── coaster.ts         # Đường ray & vị trí toa tàu phụ trợ
│   │   ├── match3Engine.ts    # Engine Gác Xép Bùa Gặt Honeydukes 777 màn (trái cây, chong chóng, hũ mứt, sáp ong lan & Đại Trùm Mốc)
│   │   ├── puzzleArcadeEngine.ts # Engine 4×777 màn + Đại Trùm Mốc + Gương Chiếu Hậu Pháp Thuật (Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy, Khảm Đá Cổ Ngữ)
│   │   ├── chessAi.worker.ts  # Dedicated Web Worker chạy tìm kiếm AI Cờ Phù Thủy không khoá luồng chính
│   │   ├── languageQuizEngine.ts # Engine Học Viện Thần Chú Đa Ngữ 5 bộ môn, Leitner 5-Box SRS & Web Speech TTS
│   │   ├── zooAndBackstage.ts # Hệ sinh thái đồng cỏ thú phép & che chắn hậu cần
│   │   └── __tests__/         # Unit & integration tests cho simulation, kinh tế sao, đường cong giờ xây, Đại Trùm Mốc, Web Worker cờ, Đại Tiệc 30 bậc, SRS & Leaderboard
│   ├── ui/
│   │   ├── hud.ts             # HUD Township 5 cụm neo, Lễ Cắt Băng Khánh Thành, Đại Tiệc Mùa Gặt 30 bậc, 60 Nhiệm Vụ 10 Chương, Bà Molly, Sổ Hàng Xóm, Túi Hạt, Kho Đỏ
│   │   ├── leaderboardModal.ts # Giao diện Top-Layer Bảng Xếp Hạng riêng cho cả 6 mini game (Bục Top 3, bảng responsive & Kỷ Lục 6 Môn)
│   │   ├── match3Modal.ts     # Giao diện fullscreen Gác Xép Bùa Gặt Honeydukes (777 màn, Đại Trùm Mốc, tia phép Bezier cong & hit-stop 35ms)
│   │   ├── puzzleArcadeModal.ts # Giao diện fullscreen Đại Sảnh Khảo Thí 4 môn (AI Worker, Đại Trùm Mốc, Gương Chiếu Hậu Pháp Thuật, tia Bezier)
│   │   ├── seedQuizModal.ts   # Giao diện Học Viện Thần Chú Đa Ngữ nhận hạt 0G, giảm giờ xây & Sổ Tay Cổ Ngữ (SRS Lexicon Codex)
│   │   ├── cloudSave.ts       # Cloud save (sync 60s, /api/save) + upload/download an toàn offline → backend Cloudflare Worker (server/)
│   │   ├── analytics.ts       # Telemetry sự kiện batch (lỗi, hiệu năng, win-rate) gửi /api/track
│   │   ├── errorMonitor.ts    # Bắt unhandled error → gộp analytics + banner thân thiện
│   │   ├── legalModal.ts      # Nút + hộp thoại Pháp lý (Quyền riêng tư, Điều khoản, Bản quyền & Tín nhiệm)
│   │   ├── onlineBootstrap.ts # Module side-effect: tự khởi chạy 4 dịch vụ online khi load index.html
│   │   ├── installPrompt.ts   # PWA install-prompt tuỳ biến (chặn trước beforeinstallprompt, nút cài thủ công)
│   │   ├── haptics.ts         # Haptic nhẹ qua navigator.vibrate (guarded — không crash Safari/desktop)
│   │   └── accessibility.ts   # A11y: live-region announce + mirror trạng thái nông trại cho screen reader
│   ├── data/                  # Nội dung tĩnh: catalog, zones, levels, quests (60 nhiệm vụ 10 chương + 30 bậc Đại Tiệc), match3Levels, chessTacticsPack, quizPacks/{en,ko,zh,es,ja}…
│   └── types/game.ts          # Toàn bộ type dùng chung (FarmCropId, FarmGoodId, PastureAnimalId, VillagerId, HarvestFeastState, LeitnerSRS…)
├── public/
│   ├── sprites/               # 172 sprite PNG 100% Plinth-Free — ARTIST SỞ HỮU
│   ├── paintings/             # 13 tranh nền JPG (5 sảnh fullscreen + 8 tranh phong cảnh) & 23 PNG quân cờ/bảo bối/ấn sáp (chess/, sudoku/, caro/)
│   ├── audio/                 # 5 nhạc nền MP3 adaptive + 1 sfx_atlas.mp3 vật lý (nước tưới, quân cờ đá, vỡ thùng gỗ, cắt băng)
│   ├── fonts/                 # Font .woff2 tự host đầy đủ dấu tiếng Việt & Latin (Be Vietnam Pro + Playfair Display)
│   ├── icons/                 # Biểu tượng PWA
│   └── sw.js / offline.html   # Service Worker v5 cache ngoại tuyến (kể cả font .woff2 & audio) + trang fallback offline
├── tools/
│   ├── validate-sprites.mjs   # Kiểm tra 172 sprite (artist + agent)
│   ├── preview-toon.py        # Xem trước hậu kỳ Sunlit Storybook toon
│   ├── make-bgm.py            # Sinh 5 bản nhạc nền MP3 (python3 + numpy)
│   └── make-sfx.py            # Sinh sfx_atlas.mp3 âm thanh vật lý chân thực (python3 + numpy)
├── server/
│   ├── index.ts               # Cloudflare Worker: /api/save (KV cloud-save) + /api/track (telemetry batch)
│   └── wrangler.toml          # Cấu hình deploy Cloudflare Worker (KV bucket)
├── netlify.toml / vercel.json # Config deploy front-end tĩnh (serve dist/ + SPA fallback)
├── Chơi Game.command          # Launcher macOS: double-click để chạy dev server (không cần Terminal)
├── ASSETS.md                  # Style guide & danh mục 172 sprite cho artist
├── README.md                  # Tổng quan dự án, tính năng & hướng dẫn chạy
└── AGENTS.md                  # File này
```

---

## 2. Kiến trúc

### Vòng lặp game
```
main.ts
  ├─ rAF loop
  │   ├─ sim.update(dt)          # ruộng 4 giai đoạn, hàng đợi xưởng, Đơn Hàng Cú, thời gian, thời tiết, dân làng
  │   ├─ renderer.render(...)    # vẽ thung lũng sông Ottery, ruộng cây trồng, công trình, bong bóng thu hoạch, thời tiết
  │   └─ hud.refreshX()          # cập nhật DOM HUD Township + đồng hồ đếm ngược lò bánh/ruộng (chỉ khi cần)
  └─ input: pointer / keyboard / pinch
```

### Luồng dữ liệu & Kinh tế lai (Hybrid Loop)
- **Sim là nguồn sự thật.** `src/sim/simulation.ts` giữ toàn bộ state:
  - Kinh tế xây dựng & khảo thí pháp thuật: `magicStars` (tổng kho `7.150 🌟` mở `10` vùng đất, với `36×30 = 1.080` ô trung tâm mở sẵn ngay Lv.1, cùng khởi công/nâng cấp `33` công trình), thời gian thi công riêng theo cấp (`6 phút → tối đa 3 ngày`, hiện đồng hồ đếm ngược trực tiếp trên bản đồ; khoá dùng `timeSand` bỏ qua trắng giờ xây ở chế độ thường — rút ngắn qua chiến thắng **Khảo Thí Pháp Thuật** hoặc **Học Viện Thần Chú Đa Ngữ** tới sàn tối thiểu `1 tiếng`), `featuredDiscipline` (*Pháp Thuật Đề Cử Cụ Dumbledore*), `phoenixTalismans` (`🔥` tối đa `12`, khoá tối đa `1` lần/lượt thử màn), `timeSand` (`⏳ Cát Xoay Thời Gian`), `match3` (*Gác Xép Bùa Gặt Honeydukes* `777` màn) và `puzzleArcade` (*Đại Sảnh Khảo Thí Pháp Thuật Hogwarts* `4 × 777` màn: `caro | sudoku | chess | blocks`).
  - Nông trại, học viện thần chú, hàng xóm & tân thủ: `farmBarn`, `workshopQueue` (`14` đặc sản), `readyFarmGoods`, `cropId`/`cropReadyAt` (`22` giống hạt & hoa cảnh, chín từ `45 giây → 3 ngày`, tưới 1 chạm *Aguamenti* giảm `25%` giờ chờ, thu hoạch mượt không rung màn hình), `pastureAnimalId`/`pastureReadyAt` (`8` thú chăn thả), 5 nhóm ô ghép liền rào `connectableGroup` (`farmland | pumpkin_patch | chicken_yard | flower_garden | animal_pasture`), `languageQuiz` (*Học Viện Thần Chú Đa Ngữ Hogwarts* 5 bộ môn `en|ko|zh|es|ja` với hộp lặp lại ngắt quãng `srsBoxes` Leitner 1–5), `neighborSocial` (thăm thung lũng hàng xóm `72×72`, tưới vườn, Đơn Cú & Giải Cứu Khảo Thí `1 lần/ngày/bạn`), và `tutorial` (luồng 6 bước cùng Bà Molly).
- **UI đọc từ sim**, không giữ state riêng (trừ vài state UI thuần như tab đang mở, bộ lọc câu hỏi hoặc đơn hàng cú đang chọn). Các gói ngữ liệu lớn trong `src/data/quizPacks/` được tải lười (`dynamic import`) qua `languageQuizBank.ts` để giữ bundle khởi động gọn nhẹ.
- **Renderer là hàm thuần** về mặt render: đọc sim + camera → vẽ. Không mutate state game.
- Lưu game: `sim.saveToStorage()` → localStorage (có migration an toàn cho save cũ).

### Sprite pipeline
```
public/sprites/<key>.png
   └─► spriteLoader.loadAll()
        ├─► toon.toonSprite()              ← tuỳ chọn (mặc định toonEnabled = false; luôn bỏ qua m3_*, ui_icon_*)
        ├─► groundBlend.applyGroundBlend() ← làm dịu rìa đáy công trình tiệp vào nền cỏ (luôn chạy, kể cả chế độ mặc định)
        ├─► rebuildMip()                   ← mipmap 0.5x chống nhấp nháy khi zoom xa (bỏ qua m3_*, ui_icon_*)
        └─► buildAlphaMask()               ← bitmask 1/4 độ phân giải để click chọn công trình chuẩn theo pixel
             └─► renderer.drawImage()      ← vẽ lên lưới isometric kèm bóng AO ấm & cỏ mọc chân tường
```

- Mặc định `toonEnabled = false` trong `SpriteRegistry` để giữ nguyên bề mặt sơn 2.5D giàu chi tiết chuẩn Playrix Township.
- `SpriteRegistry.get()` / `SpriteRegistry.getMip()` trả bản hiện hành (2.5D gốc hoặc đã toon nếu người chơi bật trong Settings) và luôn giữ nguyên ảnh gốc cho `m3_*`, `ui_icon_*`.
- `SpriteRegistry.getRaw()` luôn trả ảnh gốc chưa qua `toon.ts` (và chưa qua de-plinth).
- Bật/tắt toon runtime: Settings → *Phong cách đồ hoạ*, hoặc `sprites.setToonEnabled(true)`.
- **De-plinth là quy tắc render, không phải tuỳ chọn đồ hoạ**: `applyGroundBlend()` chạy ở cả hai chế độ (ASSETS.md §1 "Plinth-Free"). Sprite có đế cỏ bake-in sẽ được hoà sâu hơn (`PLINTH_DEPTH`) để xoá hẳn đế thớt.

---

## 3. Quy tắc bắt buộc

### Không đổi cấu trúc
- **Không đổi tên file**, **không di chuyển file**, **không đổi export** trong `src/` mà không cần thiết — nhiều nơi import theo đường dẫn.
- Không đổi hay xoá key hiện có trong `SPRITE_KEYS` (`src/engine/spriteLoader.ts`) — artist và validator dựa vào danh sách này.
- Không đổi tên sprite trong `public/sprites/`.

### Kiểu dữ liệu
- TypeScript strict. `npm run build` chạy `tsc` trước → **build phải sạch lỗi type**.
- Dùng `type` cho union, `interface` cho object. Kiểu dùng chung đặt ở `src/types/game.ts`.

### Code style
- 2 space, dấu nháy đơn, semicolon.
- Comment bằng tiếng Việt hoặc tiếng Anh — nhất quán trong từng file.
- Ưu tiên hàm thuần. Side effect (DOM, storage, audio) để ở tầng `ui/`/`sim/`.

### CSS
- **Mọi màu mới phải lấy từ token ở `:root`** (`src/styles/main.css`). Không hardcode hex mới rải rác.
- Giữ nguyên cấu trúc class hiện có — `hud.ts` dựng HTML bằng chuỗi, đổi tên class sẽ hỏng layout.
- Có breakpoint sẵn: `960px` / `740px` / `720px` / `560px` / `max-height: 520px` / `pointer: coarse`.

### Ngôn ngữ & Phông chữ
- Nội dung tiếng Việt. Tên gọi trong UI giữ nguyên tiếng Việt có dấu.
- Dùng `Playfair Display` cho tiêu đề modal, `Be Vietnam Pro` cho nội dung.
- **Không** dùng font không hỗ trợ tiếng Việt (ví dụ Baloo 2 chỉ có Latin — sẽ mất dấu).

---

## 4. Lệnh thường dùng

```bash
npm run dev          # dev server (Vite, port mặc định 5173)
npm test             # chạy toàn bộ unit & integration tests (Vitest)
npm run test:watch   # chạy Vitest chế độ theo dõi liên tục
npm run build        # tsc + vite build → dist/ (kèm kiểm tra tách chunk quiz-*.js)
npm run preview      # xem bản build sản xuất

node tools/validate-sprites.mjs                    # kiểm tra 172 sprite
python3 tools/preview-toon.py in.png out.png       # xem trước hậu kỳ toon tuỳ chọn
python3 tools/make-sfx.py                          # sinh lại sfx_atlas.mp3 âm thanh vật lý
```

### URL debug
Dev server hỗ trợ query param để kiểm tra nhanh:
```
?preview=100                       # xem trạng thái Thung Lũng Hang Sóc – Hogsmeade cấp 100 (đầy đủ vương miện 777)
?tutorial=reset                    # khởi động lại luồng Hướng Dẫn Tân Thủ 6 Bước cùng Bà Molly (hỗ trợ &tstep=0..5 hoặc ?tutorial=0)
?time=dawn|day|dusk|night          # ép thời gian trong ngày
?weather=clear|cloudy|rain|storm|snow|fog|fireflies   # ép thời tiết
?zoom=0.92&cx=16.2&cy=20.2         # vị trí & zoom camera
?rot=1|2|3                         # xoay góc nhìn 90/180/270°
?cutaway=1                         # chế độ nhìn xuyên nhà cao
?heatmap=cleanliness               # bản đồ nhiệt
?fireworks=1                       # bắn pháo hoa lễ hội
?dialog=feast                      # mở Đại Tiệc Mùa Gặt Hang Sóc (30 bậc phần thưởng thuần hành động)
?dialog=orders                     # mở Bảng Đơn Hàng Cú Đưa Thư
?dialog=seeds                      # mở Túi Hạt Giống Gieo Nhanh (22 hạt & hoa; hỗ trợ &sfilter=flowers|crops|all)
?dialog=pasture                    # mở Khay Chọn Thú Chăn Thả (Đồng Cỏ ghép liền rào)
?dialog=seedquiz&lang=en           # mở Học Viện Thần Chú Đa Ngữ Hogwarts (en|ko|zh|es|ja, hỗ trợ &sqtab=codex&crop=...&tier=...&qformat=...)
?dialog=bakery                     # mở khay Lò Bánh Bà Molly
?dialog=barn                       # mở Kho Nông Sản Đỏ Hang Sóc & Lò Rèn Bùa Phượng Hoàng
?dialog=match3&m3level=160         # mở Gác Xép Bùa Gặt Honeydukes ở màn chỉ định (1–777)
?dialog=caro|sudoku|chess|blocks   # mở trực tiếp môn khảo thí trong Đại Sảnh Khảo Thí Pháp Thuật Hogwarts (hoặc ?dialog=puzzle&pmode=...)
?dialog=leaderboard&lbgame=chess   # mở Bảng Xếp Hạng riêng từng mini game (lbgame=match3|caro|sudoku|chess|blocks|seedquiz, lbscope=valley|friends|personal)
?dialog=neighbors                  # mở Sổ Hàng Xóm & Hội Tương Trợ Thung Lũng
?visit=hagrid_valley               # sang thăm trực tiếp vườn hàng xóm (hagrid_valley, luna_valley, neville_valley, hermione_valley, twins_valley)
?dialog=album|finance|workshop|suitcase
```

---

## 5. Phím tắt (desktop)

| Phím | Chức năng |
|---|---|
| `W A S D` / mũi tên | Di chuyển camera |
| `Q` / `E` | Xoay góc nhìn 90° |
| `R` | Xoay hướng cửa công trình |
| `V` | Bật/tắt nhìn xuyên nhà cao |
| `G` | Kẹp gắp (gắp thành viên nhà Weasley / gia tinh) |
| `M` | Di dời công trình |
| `X` | Chế độ ủi (bulldozer) |
| `B` | Vali bảo tồn sinh vật |
| `N` | Sổ Hàng Xóm & Tương Trợ Thung Lũng |
| `J` | Gác Xép Bùa Gặt Honeydukes (`777` màn) |
| `K` | Đại Sảnh Khảo Thí Pháp Thuật Hogwarts (`4 × 777` màn: Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy, Khảm Đá Cổ Ngữ) |
| `L` | Bảng Xếp Hạng Riêng Từng Mini Game (`6` môn: Toàn Thung Lũng, Bạn Bè & Kỷ Lục Cá Nhân) |
| `P` | Chế độ chụp ảnh |

---

## 6. Khi nhận việc vẽ asset

1. Đọc [`ASSETS.md`](ASSETS.md) đầy đủ (đặc biệt quy tắc **Plinth-Free — không vẽ đế đất/bệ gỗ dưới chân công trình** và không chừa mảng trắng khép kín bên trong hàng rào/kẽ tay).
2. Vẽ theo style guide **Canon Hang Sóc × Playrix Township 2.5D** + bảng màu ấm đồng quê.
3. Xuất PNG RGBA, nền trong suốt, đúng kích thước theo nhóm.
4. `node tools/validate-sprites.mjs` phải không báo lỗi (`172/172` sprite hợp lệ).
5. Nén ≤ 300KB: `pngquant -f 4 --strip`.
6. Bàn giao: danh sách file đã đổi + ảnh preview trên nền cỏ xanh.

**Không cần** (và không được phép) chỉnh sửa file TypeScript nào.

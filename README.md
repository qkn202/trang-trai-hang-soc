# 🏡 Trang Trại Hang Sóc & Thung Lũng Hogsmeade

> **Cozy Wizarding Farm & Valley Builder × 5-Discipline 777-Stage Wizarding Trials** — Vượt **3.885 màn khảo thí pháp thuật** trên **Đại Sảnh Khảo Thí Pháp Thuật Hogwarts & Gác Xép Bùa Gặt Honeydukes** để tích luỹ **Sao Phép Thuật (`🌟`)** và rút ngắn thời gian thi công công trình, tự tay quy hoạch **Trang Trại Hang Sóc** từ đồng cỏ nguyên sơ bên dòng sông Ottery St Catchpole, niệm chú gieo **22 giống hạt & hoa cảnh** qua **Học Viện Thần Chú Đa Ngữ Hogwarts (5 bộ môn ngôn ngữ)**, chăn thả đồng cỏ, ghé thăm & giải cứu màn chơi cùng hàng xóm, đỏ lửa Lò Bánh Bà Molly và gửi Cú Đưa Thư giao hàng khắp thung lũng Hogsmeade.

Game mô phỏng nông trại xây dựng kết hợp khảo thí trí tuệ 2.5D isometric chạy trực tiếp trên **Canvas 2D**, không dùng framework UI nặng — viết bằng **TypeScript strict + Vite 6 + PWA Offline-First**. Lấy cảm hứng từ nguyên tác sách & phim *Harry Potter* (Hang Sóc 6 tầng vẹo vọ trên nền chuồng lợn đá, xe bay Ford Anglia trong nhà kho ông Arthur, vườn bí ngô – vườn hoa – sân đàn gà – đồng cỏ ghép rào gỗ mộc, Đại Sảnh Đường Cờ Phù Thủy) hoà quyện cùng vòng lặp **Gardenscapes × Playrix Township 2025–2026** có chiều sâu **200+ giờ chơi**.

---

## 🎮 Chơi thử & Kiểm thử

> ⚠️ **Không double-click `index.html` để chơi.** Đây là app Vite + TypeScript — mở trực tiếp sẽ trắng trang. Hãy dùng 1 trong 2 cách dưới.

**Cách 1 — macOS, không cần Terminal (nhanh nhất):**
Double-click file [`Chơi Game.command`](./Chơi Game.command) ở thư mục game → tự cài dependencies (lần đầu), khởi động server và mở trình duyệt đúng port.

**Cách 2 — bằng Terminal:**
```bash
npm install
npm run dev
```
Mở <http://localhost:5173> (mở bằng **URL**, không phải bằng file).

**Kiểm thử tự động & Bản build sản xuất:**
```bash
npm test                         # chạy bộ unit & integration tests (Vitest)
npm run build && npm run preview # kiểm tra kiểu TypeScript + đóng gói Vite (tách chunk lazy-load)
```

---

## ✨ Tính năng chính

| Hệ thống | Mô tả |
|---|---|
| **Vòng lặp Sao Phép Thuật (`🌟`) × Đại Điền Trang `72×72` (`5.184` ô), Thi Công Thực Tế & Lễ Cắt Băng Khánh Thành (`🎀`)** | Khởi đầu từ thung lũng cỏ xanh rộng mở **`36×30` (`1.080` ô mở sẵn ngay Level 1)** trên đại bản đồ isometric **`72×72` (`5.184` ô)**. Chinh phục 5 môn khảo thí để thu thập kho **7.150 `🌟` Sao Phép Thuật**, mở khoá trọn **10 vùng đất** và đặt mới / nâng cấp bậc II–III cho **33 công trình & xưởng phép thuật** (`0 Galleon` phí xây). Mỗi công trình có **thời gian thi công riêng tăng dần theo cấp (từ `6 phút` đến tối đa `3 ngày`)** kèm giàn giáo gỗ 2.5D, tia búa phép thuật & đồng hồ đếm ngược trực tiếp trên bản đồ; rút ngắn giờ xây bằng cách thắng **Khảo Thí Pháp Thuật** (`-30p ~ -75p`/màn) hoặc niệm đúng **Thần Chú Đa Ngữ** (`-10p ~ -25p`/câu) xuống **sàn tối thiểu `1 tiếng`**. Khi thi công xong, công trình thắt nơ **`🎀 Cắt Băng Khánh Thành!`** để người chơi tự tay chạm mở lễ khánh thành pháo giấy & nhận quà chúc mừng từ gia đình Weasley |
| **Đại Sảnh Khảo Thí Pháp Thuật Hogwarts 5 Môn × 777 Màn (`3.885` màn), Đại Trùm Mốc & Gương Chiếu Hậu Pháp Thuật** | Lộ trình `200+ giờ` với **Pháp Thuật Đề Cử Cụ Dumbledore**, **11 Màn Đại Trùm Mốc thủ công (`25..777`)**, **tia phép Bezier cong + micro hit-stop `35ms`** và **🪞 Gương Chiếu Hậu Pháp Thuật** (soi lại nước bước ngoặt trên bàn cờ sau ván):<br>• **Gác Xép Bùa Gặt Honeydukes (`777` màn):** 6 loại trái cây & mật ong 3D-toony, *Chong Chóng Sắc Màu*, *Hũ Mứt Nổ*, *Thùng Gỗ*, *Băng Giá*, *Tơ Nhện*, *Thư Cú* & biến thể **Sáp Ong Lan** (từ màn `160`)<br>• **Trận Pháp Ngũ Ấn Đạo Tặc 13×13 (`777` màn):** Đấu trí nhân vật Harry Potter trên *Bản Đồ Đạo Tặc*, luật cân bằng **Pro-Renju**, **Ấn Chì Cổ Ngữ `ᛉ`** (từ màn `90`), tia phép *Priori Incantatem* & *Gương Chiếu Hậu Pháp Thuật*<br>• **Ma Trận Cửu Bảo Bối 9×9 (`777` màn):** Khảo thí tại *Hầm Độc Dược & Cổ Ngữ* với 9 Bảo Bối Hogwarts, **Đường Chéo Vàng `✕`** (từ màn `120`) & **Ấn Chẵn/Lẻ `◇/◯`** (từ màn `240`), 100% độc nghiệm<br>• **Cờ Phù Thủy Đại Sảnh Đường 8×8 (`777` màn):** Luân phiên *Giải Thế Cờ McGonagall* (**260 thế cờ chiến thuật độc bản** `0%` trùng FEN) và *Đại Chiến 8×8* chạy trên **Dedicated Web Worker (`chessAi.worker.ts`)** mượt `60fps` kèm *Gương Chiếu Hậu Pháp Thuật*<br>• **Nối Hình Sinh Vật Huyền Bí — Pikachu Cổ Điển (`777` màn, `48–108` ô):** Nối cặp **24 loài sinh vật huyền bí** (*Niffler, Bằng Mã, Phượng Hoàng, Kỳ Lân, Vong Mã, Puffskein, Rồng, Cú Hedwig...*) theo đường gấp khúc tối đa **≤ 2 góc rẽ (3 đoạn thẳng)**, bàn cờ tĩnh cổ điển (`6×8 = 48 ô` → `9×12 = 108 ô`), không đếm ngược thời gian, tự động đảo miễn phí khi hết nước đi |
| **Bảng Xếp Hạng Riêng Cho Từng Mini Game (`6` Môn — Phím `L`, 100% Người Chơi Thật)** | Mỗi môn khảo thí & học tập (**Gác Xép Bùa Gặt Honeydukes**, **Ngũ Ấn Đạo Tặc**, **Ma Trận Cửu Bảo Bối**, **Cờ Phù Thủy**, **Nối Hình Sinh Vật Huyền Bí** & **Học Viện Thần Chú Đa Ngữ**) có **Bảng Xếp Hạng độc lập 100% người chơi thật** ngay trên thanh tiêu đề từng mini game, màn tổng kết chiến thắng (`🔼 Tăng +N bậc!`), Sổ Hàng Xóm & Hòm Quản Lý: hỗ trợ **3 chế độ xem** (`🌍 Toàn Thung Lũng`, `🤝 Bạn Bè & Hàng Xóm` kết nối qua Mã `HS-XXXX-XX`, và `📜 Kỷ Lục Cả 6 Môn`), Bục Vinh Quang Top 3 (`🥇 🥈 🥉`), 5 bậc danh hiệu (`Đồng → Huyền Thoại 777`) và đồng bộ Cloud KV `/api/leaderboard` trực tuyến |
| **60 Nhiệm Vụ Cốt Truyện 10 Chương & Đại Tiệc Mùa Gặt Hang Sóc (`30` Bậc)** | **60 nhiệm vụ biên niên sử** chia làm **10 Chương (`Lv.1 → Lv.100`)** dẫn dắt từ ngày dựng bếp Hang Sóc đến Đại Thung Lũng Phép Thuật, song hành cùng sự kiện **🥧 Đại Tiệc Mùa Gặt Hang Sóc (`30` bậc phần thưởng thuần hành động, `0%` lệ thuộc đồng hồ hệ thống)** tặng Vàng, XP, `⏳ Cát Xoay Thời Gian`, `🔥 Bùa Phượng Hoàng` & Hạt Hoa Hiếm |
| **Bùa Trợ Chiến Phượng Hoàng (`🔥`) xuyên hệ thống** | Tích trữ tối đa `12 🔥` (giới hạn `1` lần/lượt thử màn để giữ cân bằng chiến thuật), kiếm thuần tuý từ việc chăm nông trại & học tập (`8` câu Thần Chú đúng, Đơn Cú Đại Tiệc / mỗi `3` đơn cú, Đại Tiệc Mùa Gặt, hoặc Lò Rèn Kho Đỏ `1 Đặc sản + 180G`) để cộng lượt, soi nước thắng hoặc phá ấn khó trên cả 5 môn |
| **Học Viện Thần Chú Đa Ngữ Hogwarts & Sổ Tay Cổ Ngữ (Play-to-Learn 5 bộ môn)** | Nhận hạt giống & hạt hoa miễn phí `0G` (`1–2` hạt/câu) kiêm rút ngắn giờ xây công trình với **5 bộ môn thần chú ngôn ngữ** (*Chú Ngữ Anh, Cổ Ngữ Hàn, Phù Chú Hoa, Mật Ngữ TBN & Bí Thuật Nhật*) qua **3 cấp bậc khảo thí** (`🪄 Phù Thủy Tập Sự` → `🦉 Pháp Thần O.W.L.` → `👑 Bậc Thầy N.E.W.T.`), **6 thể thức phép thử**, giọng đọc Web Speech TTS, kho ngữ liệu mở rộng (`549` mục gốc / `1.500+` biến thể cấp `1 → 100`), hộp ôn tập **Leitner 5-Box SRS** và **📖 Sổ Tay Cổ Ngữ (SRS Lexicon Codex)** tra cứu trực tiếp & lọc theo từng Hộp 1–5 |
| **Thung Lũng Sống Động 2.5D: Cối Xay Gió Xoay, Xưởng Đỏ Lửa & Gia Đình Weasley Đi Dạo** | Toàn bộ `172/172` sprite chuẩn **Plinth-Free 100%**: cánh buồm *Cối Xay Gió Ottery* và guồng gỗ *Ao Hoa Súng* quay êm mượt, xưởng đang chế biến rực ánh lửa lò + hơi bánh thơm, đàn ong mật vàng bay quanh thùng ong, bướm lượn trên luống hoa nở, và **6 thành viên nhà Weasley & Hogsmeade** (*Bà Molly, Ông Arthur, Ron, Ginny, Bác Hagrid, Hermione*) thong thả đi dạo dọc đường lát & vườn cây (nhấp vào để vẫy chào nhận lộc nhỏ) |
| **5 Khu Đất/Vườn/Đồng Cỏ ghép rào liền mạch (`mask12`) & 22 Giống Hạt – Hoa Cảnh** | Bộ **5 công trình `2×2`** tự động xoá vách rào ngăn cách khi đặt sát nhau (`Thửa Đất Canh Tác`, `Ô Vườn Hoa Cảnh Hang Sóc`, `Đồng Cỏ Chăn Thả`, `Vườn Bí Ngô Hang Sóc`, `Sân Đàn Gà Mái Hang Sóc`): mở **Túi Hạt** kéo lướt tay gieo liên hoàn **22 giống nông sản & hoa cảnh 2.5D** qua 4 giai đoạn sinh trưởng (thời gian chín riêng từ `45 giây` đến tối đa `3 ngày`), hiện đồng hồ đếm ngược trực tiếp trên ruộng, **chạm 1 lần tưới phép *Aguamenti* giảm `25%` thời gian chờ**, thu hoạch êm mượt không rung màn hình, và thả **8 loài gia súc & thú phép** dạo bước trên Đồng Cỏ |
| **Hướng Dẫn Tân Thủ 6 Bước cùng Bà Molly & Sổ Hàng Xóm Tương Trợ Người Chơi Thật (`N`)** | Lần đầu vào thung lũng, **Bà Molly Weasley** (3 tư thế bán thân 2.5D) tận tình hướng dẫn 6 bước khởi nghiệp. Mở **Sổ Hàng Xóm & Hội Tương Trợ Thung Lũng (100% người chơi thật)** để kết bạn qua **Mã Thung Lũng `HS-XXXX-XX`** và sang thăm vườn `72×72` của bạn bè: tưới giúp vườn nhận **Huy Hiệu Cỏ Bốn Lá `🍀`** mở *Rương Tình Bạn*, nhặt *Quà Bí Ẩn*, đóng hộ kiện hàng **Đơn Cú**, để lại thiệp *Đèn Lồng Gia Tinh*, **Giải Cứu Khảo Thí Pháp Thuật (`1 lần/ngày/bạn`)** hoặc bấm **`🆘 Nhờ Bạn Qua Màn`** ngay khi kẹt màn khó |
| **Lò Bánh Bà Molly & 9 nhóm xưởng thủ công** | Hàng đợi lò gạch rực lửa thời gian thực (*Lò Bánh Bà Molly, Xưởng Ép Táo & Mật Ong, Khung Đan Áo Len Tự Động, Nhà Kho Ford Anglia Ông Arthur, Tiệm Kẹo Công Tước Mật, Quán Ba Cây Chổi, Cối Xay Gió, Chăn Trồng & Gia Súc, Nhà Kính Thảo Dược*) chế biến **14 đặc sản thủ công** & dùng `⏳ Cát Xoay Thời Gian` thúc chín mẻ bánh/mùa vụ |
| **Kho Nông Sản Đỏ & Bảng Đơn Hàng Cú** | Quản lý sức chứa nông sản/thành phẩm trong Kho Đỏ (kèm Lò Rèn Bùa Phượng Hoàng); nhận đơn từ Hermione, Luna, Hagrid, cụ Dumbledore, giáo sư Sprout, Lupin, McGonagall, Harry, Fred & George; giao bằng cú Hedwig/Errol/Pigwidgeon nhận Vàng, XP, `🔥` & *Phích Cắm Muggle* nâng cấp Kho (+20 ô/bậc) |
| **Đồng cỏ thú phép, Vali Bảo Tồn & Album Ếch Sô-cô-la** | Chăm sóc Bông Thoa Puffskein, gà mái Hang Sóc, cừu lông xù, bò sữa, Niffler, Bằng Mã Hippogriff, Vong Mã, Kỳ Lân, Phượng Hoàng trong đồng cỏ & Vali Bảo Tồn (ấp trứng, chải lông, lai biến thể, cử đi thám hiểm) và sưu tập **12 thẻ danh nhân Ếch Sô-cô-la** |
| **Ngày/đêm, 7 kiểu thời tiết & HUD 5 cụm neo** | Bình minh, nắng ấm, hoàng hôn, đêm đom đóm; nắng trong, mây trôi đổ bóng, mưa rào + cầu vồng kép, bão sấm, tuyết rơi, sương mù, pháo hoa lễ hội; HUD 5 cụm neo chuẩn Township hiển thị Cấp độ (`3.435` trận thắng → Lv.100), `🌟 Sao Phép Thuật`, `🔥 Bùa Phượng Hoàng`, Vàng & Kho Đỏ |

---

## 🕹️ Điều khiển

### Chuột / cảm ứng
| Thao tác | Kết quả |
|---|---|
| Kéo | Di chuyển camera |
| Cuộn / pinch 2 ngón | Phóng to – thu nhỏ |
| Chạm công trình / thửa ruộng / đồng cỏ | Mở bảng chi tiết xem tiến độ thi công, chọn hạt giống / hoa cảnh / thú chăn thả, tưới nước 1 chạm *Aguamenti* (`-25%` giờ chờ), xếp khay lò bánh hoặc nâng cấp sao (hit-test theo pixel alpha) |
| Quét chuột lên bong bóng | Thu hoạch bánh/áo len ra lò hoặc gặt nông sản, hoa cảnh & sản vật đồng cỏ êm mượt (không rung màn hình) |
| Kéo liên tục trên lưới | Gieo hạt liên hoàn, đặt ghép liền rào Thửa Đất / Vườn Hoa / Đồng Cỏ / Vườn Bí Ngô / Sân Đàn Gà, lát đường quê hoặc dựng hàng rào |

### Phím tắt (desktop)

| Phím | Chức năng |
|---|---|
| `W` `A` `S` `D` / mũi tên | Di chuyển camera |
| `Q` / `E` | Xoay góc nhìn 90° |
| `R` | Xoay hướng cửa công trình |
| `V` | Nhìn xuyên công trình cao |
| `G` | Kẹp gắp (gắp thành viên nhà Weasley / gia tinh) |
| `M` | Di dời công trình miễn phí |
| `X` | Chế độ dọn dẹp / ủi (xoá) |
| `B` | Vali bảo tồn sinh vật |
| `N` | Sổ Hàng Xóm & Hội Tương Trợ Thung Lũng |
| `J` | Gác Xép Bùa Gặt Honeydukes (`777` màn) |
| `K` | Đại Sảnh Khảo Thí Pháp Thuật Hogwarts (`4 × 777` màn: Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy, Nối Hình Sinh Vật Huyền Bí) |
| `L` | Bảng Xếp Hạng Riêng Từng Mini Game (`6` môn: Toàn Thung Lũng, Bạn Bè & Kỷ Lục Cá Nhân) |
| `H` | Thu gọn / Mở lại toàn bộ HUD Ingame (hoặc chạm/kéo nút tròn vàng `Thu HUD` trên màn hình) |
| `P` | Chế độ chụp ảnh |

---

## 🧩 Kiến trúc

```
congviengiaitri/
├── index.html                   Entry HTML, font tiếng Việt, CSP, đăng ký Service Worker PWA
├── vite.config.ts               Tách chunk manualChunks (engine / sim / modals) & gói ngôn ngữ quiz-*.js
├── vitest.config.ts             Cấu hình bộ kiểm thử tự động Vitest
├── src/
│   ├── main.ts                  Bootstrap · input loop · camera · đặt/xây công trình · URL debug
│   ├── styles/main.css          Toàn bộ UI chrome, HUD Township, 5 sảnh khảo thí fullscreen & Học Viện Thần Chú (tokens ở :root)
│   ├── engine/
│   │   ├── isometric.ts         Toạ độ lưới ↔ pixel, chiếu isometric, xoay 90°
│   │   ├── renderer.ts          Vẽ toàn cảnh (thung lũng sông Ottery, ruộng 4 giai đoạn, 5 nhóm ô ghép rào mask12, đồng hồ tiến độ xây/cây nổi, thời tiết)
│   │   ├── spriteLoader.ts      Nạp & cache 172 sprite 100% Plinth-Free + ghép rào liền mạch mask12 + mipmap 0.5x + alpha bitmask hit-test
│   │   ├── groundBlend.ts       Hoà chân tường công trình êm vào thảm cỏ nắng ấm (PLINTH_KEYS rỗng 0 mục)
│   │   ├── waterOutlines.ts     Tách bờ hồ: loop bờ nước, Catmull-Rom, lớp bọt & dải cát
│   │   ├── toon.ts              Hậu kỳ tuỳ chọn Sunlit Storybook (mặc định tắt để giữ chất 2.5D Playrix sắc nét)
│   │   ├── pathfinding.ts       Tìm đường cho gia đình Weasley & gia tinh
│   │   ├── audio.ts             Nhạc nền adaptive 5 MP3 & âm thanh vật lý giải mã từ sfx_atlas.mp3 + Web Audio
│   │   └── __tests__/           Unit tests cho phép chiếu isometric, pathfinding & renderer
│   ├── sim/
│   │   ├── simulation.ts        Nguồn sự thật duy nhất: Sao Phép Thuật, thi công & Lễ Cắt Băng Khánh Thành, Đại Tiệc Mùa Gặt 30 bậc, dân làng đi dạo, Kho Đỏ, Đơn Cú
│   │   ├── neighborSocial.ts    Hệ thống Sổ Hàng Xóm, thăm thung lũng 72×72, trợ giúp vườn/Đơn Cú & Giải Cứu Khảo Thí hàng ngày
│   │   ├── minigameLeaderboard.ts Bảng xếp hạng riêng cho từng mini game (6 môn: Toàn Thung Lũng, Bạn Bè, Kỷ Lục Cá Nhân & đồng bộ Cloud KV)
│   │   ├── match3Engine.ts      Engine Gác Xép Bùa Gặt Honeydukes 777 màn (trái cây, chong chóng, hũ mứt, sáp ong lan & Đại Trùm Mốc)
│   │   ├── puzzleArcadeEngine.ts Engine 4×777 màn + Đại Trùm Mốc + Gương Chiếu Hậu Pháp Thuật (Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy, Nối Hình Sinh Vật Huyền Bí)
│   │   ├── chessAi.worker.ts    Dedicated Web Worker tìm nước đi AI Cờ Phù Thủy không khoá luồng chính
│   │   ├── languageQuizEngine.ts Engine Học Viện Thần Chú Đa Ngữ 5 bộ môn, lặp lại ngắt quãng Leitner 5-Box SRS & Web Speech TTS
│   │   ├── coaster.ts           Đường ray & phương tiện phụ trợ
│   │   ├── zooAndBackstage.ts   Hệ sinh thái đồng cỏ thú phép & che chắn hậu cần
│   │   └── __tests__/           Kiểm thử mô phỏng kinh tế sao, đường cong giờ xây/rút ngắn, Đại Trùm Mốc, Web Worker cờ, Đại Tiệc 30 bậc, SRS & Leaderboard
│   ├── ui/
│   │   ├── hud.ts               HUD Township 5 cụm neo, Lễ Cắt Băng Khánh Thành, Đại Tiệc 30 bậc, 60 Nhiệm Vụ 10 Chương, Bà Molly, Sổ Hàng Xóm, Túi Hạt & Kho Đỏ
│   │   ├── leaderboardModal.ts  Giao diện Top-Layer Bảng Xếp Hạng riêng cho cả 6 mini game (Bục Top 3, bảng responsive & Kỷ Lục 6 Môn)
│   │   ├── match3Modal.ts       Giao diện fullscreen Gác Xép Bùa Gặt Honeydukes (Đại Trùm Mốc, tia Bezier cong, micro hit-stop 35ms)
│   │   ├── puzzleArcadeModal.ts Giao diện fullscreen Đại Sảnh Khảo Thí 4 môn (AI Worker, Đại Trùm Mốc, Gương Chiếu Hậu Pháp Thuật, tia Bezier)
│   │   ├── seedQuizModal.ts     Giao diện Học Viện Thần Chú Đa Ngữ nhận hạt giống 0G, giảm giờ xây & Sổ Tay Cổ Ngữ (SRS Lexicon Codex)
│   │   ├── cloudSave.ts         Cloud save (sync 60s, /api/save) + upload/download an toàn offline → Cloudflare Worker (server/)
│   │   ├── analytics.ts         Telemetry sự kiện batch (lỗi, hiệu năng, win-rate) gửi /api/track
│   │   ├── errorMonitor.ts      Bắt unhandled error → gộp analytics + banner thân thiện
│   │   ├── legalModal.ts        Nút + hộp thoại Pháp lý (Quyền riêng tư, Điều khoản, Bản quyền & Tín nhiệm)
│   │   ├── onlineBootstrap.ts   Module side-effect: tự khởi chạy 4 dịch vụ online khi load index.html
│   │   ├── installPrompt.ts     PWA install-prompt tuỳ biến (chặn trước beforeinstallprompt, nút cài thủ công)
│   │   ├── haptics.ts           Haptic nhẹ qua navigator.vibrate (guarded — không crash Safari/desktop)
│   │   └── accessibility.ts    A11y: live-region announce + mirror trạng thái nông trại cho screen reader
│   ├── data/
│   │   ├── catalog.ts           Danh mục công trình (giá 🌟 Sao & thời gian thi công), 22 giống hạt/hoa, 8 thú đồng cỏ & 14 đặc sản xưởng
│   │   ├── zones.ts / levels.ts 10 vùng đất thung lũng (mở sẵn 36×30 ngay Lv.1) & thang 100 cấp độ theo tổng màn thắng (3.435 trận)
│   │   ├── match3Levels.ts      Bộ sinh 777 màn Bùa Gặt Honeydukes tất định + 11 Màn Đại Trùm Mốc (25..777)
│   │   ├── chessTacticsPack.ts  230 thế cờ chiến thuật Harry Potter đã kiểm chứng bằng solver (cùng 30 thế cơ bản = 260 thế độc bản)
│   │   ├── languageQuizBank.ts  Điều phối tải lười (dynamic import), từ điển thuật ngữ Học Viện Thần Chú & bộ câu hỏi dự phòng tức thì
│   │   ├── quizPacks/           5 gói ngữ liệu tách chunk (en, ko, zh, es, ja — 549 mục gốc / 1.500+ biến thể câu hỏi)
│   │   └── quests.ts / cards.ts / suitcase.ts / synergiesAndSupply.ts / names.ts
│   └── types/game.ts            Toàn bộ kiểu dữ liệu dùng chung
└── public/
    ├── sprites/                 172 sprite PNG 2.5D — chuẩn Plinth-Free 100% (xem ASSETS.md)
    ├── paintings/               13 tranh nền JPG fullscreen + 23 PNG quân cờ Chibi / Bảo Bối / Ấn Sáp Đạo Tặc
    ├── audio/                   5 nhạc nền MP3 adaptive + 1 sfx_atlas.mp3 âm thanh vật lý
    ├── fonts/                   Font .woff2 tiếng Việt & Latin tự host ngoại tuyến (Be Vietnam Pro + Playfair Display)
    └── sw.js / offline.html     Service Worker v6 cache thông minh hỗ trợ chơi ngoại tuyến 100% (PWA)
├── server/
│   ├── index.ts                 Cloudflare Worker: /api/save + /api/leaderboard + /api/track (hỗ trợ nén Gzip 2 chiều)
│   └── wrangler.toml            Cấu hình deploy Cloudflare Worker (KV bucket)
├── netlify.toml / vercel.json   Config deploy front-end tĩnh + Cache-Control tối ưu
├── Chơi Game.command            Launcher macOS: double-click để chạy dev server (không cần Terminal)
└── tools/                       Bộ công cụ kiểm định sprite, nén ảnh RGBA/JPEG & sinh âm thanh
```

**Luồng dữ liệu:** `input → sim.update(dt) → renderer.render() → hud.refreshX()`.  
[`simulation.ts`](file:///Users/khang/congviengiaitri/src/sim/simulation.ts) là nguồn sự thật duy nhất; renderer và các modal UI chỉ đọc trạng thái từ đó.

---

## 🎨 Đồ hoạ

Game sử dụng định hướng mỹ thuật **"Canon Hang Sóc × Playrix Township 2025–2026 2.5D Cozy Farm"**:
- **Bám sát nguyên tác truyện & phim:** Nhà Hang Sóc 6 tầng vẹo vọ xây nối từ chuồng lợn đá với ống khói nghiêng & bảng `HANG SÓC`, nhà kho tôn ông Arthur thò mũi chiếc Ford Anglia xanh ngọc, lò nướng bánh táo ngoài trời của bà Molly, trạm cú Hedwig/Errol, 5 khu đất/vườn hoa/đồng cỏ/vườn bí ngô/sân đàn gà ghép rào gỗ mộc liền mạch và nhà kính Thảo Dược khung sắt ngọc lục bảo.
- **Công trình & Cây trồng Plinth-Free (không đế thớt):** Mọc trực tiếp từ thảm cỏ mượt và luống đất phù sa với bóng tiếp xúc AO ấm và hoà chân cỏ tự nhiên (`groundBlend.ts`).
- **Chất liệu 2.5D sơn ấm sắc nét:** Mặc định giữ nguyên độ nổi khối 2.5D giàu chi tiết (`toonEnabled = false` trong `spriteLoader.ts`); người chơi vẫn có thể bật chế độ viền mực nâu Storybook bất kỳ lúc nào tại **Cài đặt → Phong cách đồ hoạ**.

Nguồn ảnh, phông chữ & âm thanh:
- `public/sprites/` — **172 sprite PNG 100% Plinth-Free** (`21` công trình & khu đất/vườn/đồng cỏ ghép rào Trang Trại Hang Sóc – Hogsmeade, `4` đạo cụ động & khánh thành `prop_*`, `12` sprite dân làng đi dạo `villager_*`, `2` luống đất canh tác thống nhất, `8` chân dung Đơn Hàng Cú / Đạo Tặc / Bà Molly Hướng Dẫn & liềm vàng, `44` icon 3D HUD & `22` cây trồng – hoa 2.5D `ui_icon_crop_*`, `9` vật phẩm 3D-Toony Bùa Gặt `m3_farm_*`, cùng `72` sprite đồng cỏ bảo tồn sinh vật huyền bí, gia súc đồng cỏ, rừng cây 2.5D, thuyền Hồ Đen & icon thanh công cụ) — quy chuẩn chi tiết tại [`ASSETS.md`](ASSETS.md).
- `public/paintings/` — **13 tranh nền JPG** (`5` phông nền fullscreen cho Gác Xép Bùa Gặt Honeydukes, Nối Hình Sinh Vật Huyền Bí, Cờ Phù Thủy Đại Sảnh Đường, Ma Trận Cửu Bảo Bối, Trận Pháp Ngũ Ấn Đạo Tặc + `8` tranh phong cảnh thế giới phù thủy) và **23 tệp PNG bàn cờ** (`chess/` 12 quân cờ Chibi 2.5D, `sudoku/` 9 Bảo Bối Hogwarts, `caro/` 2 ấn sáp đối kháng).
- `public/audio/` — **5 nhạc nền MP3 adaptive** (*bgm_day / bgm_night / bgm_festival / bgm_rain / bgm_storm*) và **1 tệp `sfx_atlas.mp3`** âm thanh vật lý chân thực (giải mã vào `AudioBuffer` Web Audio).
- `public/fonts/` — **Bộ phông `.woff2` tự host ngoại tuyến** (`Be Vietnam Pro` + `Playfair Display` đầy đủ dấu tiếng Việt & Latin, không phụ thuộc mạng ngoài).

---

## 🛠 Công cụ kiểm tra & Gỡ lỗi

```bash
npm test                                       # chạy toàn bộ unit & integration tests (Vitest)
node tools/validate-sprites.mjs                # kiểm tra toàn bộ 172 sprite (kích thước, tỉ lệ, alpha, dung lượng)
python3 tools/compress-images.py               # nén tối ưu toàn bộ ảnh PNG RGBA & Progressive JPEG (giữ nguyên alpha 0)
python3 tools/preview-toon.py in.png out.png   # xem trước art khi bật bộ lọc viền nâu Storybook
python3 tools/make-bgm.py                      # sinh lại các bản nhạc nền MP3 (cần numpy)
python3 tools/make-sfx.py                      # sinh lại sfx_atlas.mp3 âm thanh vật lý (cần numpy)
```

### URL debug (dev server)

```
?preview=100                       # mở toàn cảnh Thung Lũng Hang Sóc – Hogsmeade cấp 100 (đầy đủ vương miện 777)
?tutorial=reset                    # khởi động lại luồng Hướng Dẫn Tân Thủ 6 Bước cùng Bà Molly (hỗ trợ &tstep=0..5 hoặc ?tutorial=0)
?time=dawn|day|dusk|night          # ép thời điểm trong ngày
?weather=clear|cloudy|rain|storm|snow|fog|fireflies   # ép hiệu ứng thời tiết
?zoom=0.92&cx=16.2&cy=20.2         # vị trí & độ phóng camera
?rot=1|2|3                         # xoay góc nhìn 90°/180°/270°
?cutaway=1                         # bật chế độ nhìn xuyên công trình cao
?heatmap=cleanliness               # bật bản đồ nhiệt vận hành
?fireworks=1                       # bắn pháo hoa lễ hội ngay khi mở
?dialog=feast                      # mở trực tiếp Đại Tiệc Mùa Gặt Hang Sóc (30 bậc phần thưởng)
?dialog=orders                     # mở trực tiếp Bảng Đơn Hàng Cú Đưa Thư
?dialog=seeds                      # mở trực tiếp Túi Hạt Giống Gieo Nhanh (22 hạt & hoa; hỗ trợ &sfilter=flowers|crops|all)
?dialog=pasture                    # mở trực tiếp Khay Chọn Thú Chăn Thả (Đồng Cỏ ghép liền rào)
?dialog=seedquiz&lang=en           # mở Học Viện Thần Chú Đa Ngữ Hogwarts (en|ko|zh|es|ja, kèm &sqtab=codex&crop=...&tier=...&qformat=...)
?dialog=bakery                     # mở trực tiếp khay Lò Bánh Bà Molly
?dialog=barn                       # mở trực tiếp Kho Nông Sản Đỏ & Lò Rèn Bùa Phượng Hoàng
?dialog=match3&m3level=160         # mở trực tiếp Gác Xép Bùa Gặt Honeydukes ở màn chỉ định (1–777)
?dialog=caro|sudoku|chess|blocks   # mở trực tiếp từng môn trong Đại Sảnh Khảo Thí Pháp Thuật Hogwarts (hoặc ?dialog=puzzle&pmode=...)
?dialog=leaderboard&lbgame=chess   # mở trực tiếp Bảng Xếp Hạng riêng từng mini game (lbgame=match3|caro|sudoku|chess|blocks|seedquiz)
?dialog=neighbors                  # mở trực tiếp Sổ Hàng Xóm & Kết Giao Người Chơi Thật (0 NPC)
?visit=<neighborId>                # ghé thăm trực tiếp thung lũng của người bạn đã kết giao
?dialog=workshop|suitcase|album|finance
```

---

## 🌐 Hướng dẫn xây dựng & triển khai Backend Chơi Online Nhiều Người

Mã nguồn hiện đã tách sẵn lớp giao tiếp mạng (`src/ui/cloudSave.ts`, `src/sim/minigameLeaderboard.ts`, `src/ui/analytics.ts`) và một Cloudflare Worker mẫu tại [`server/index.ts`](server/index.ts). Bạn có thể triển khai theo **2 giai đoạn** từ cơ bản đến Multiplayer thời gian thực:

### Giai đoạn 1 — Khởi chạy ngay Cloud Save & Bảng Xếp Hạng Online 6 Môn (Sẵn có trong `server/`)

Worker hiện có tại `server/index.ts` cung cấp sẵn 5 API:
- `GET / POST /api/save`: Đồng bộ file save người chơi định kỳ mỗi `60s` lên Cloudflare KV (`SAVE_KV`) kèm tự động ghi nhận Mã Thung Lũng vào danh bạ người chơi thật.
- `POST /api/friends/register` & `GET /api/friends/lookup?code=HS-XXXX-XX`: Đăng ký và tra cứu xác thực người chơi thật theo Mã Thung Lũng (chặn mã giả/NPC, đồng bộ cả bản đồ `72×72` của bạn bè để ghé thăm).
- `GET / POST /api/leaderboard`: Lưu và trả về Top 50 toàn cầu riêng cho từng môn trong 6 mini game (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `seedquiz`).
- `POST /api/track`: Nhận sự kiện hiệu năng và nhật ký lỗi theo lô.

**Các bước triển khai lên Cloudflare (miễn phí gói Workers Free):**

1. **Đăng nhập Wrangler & khởi tạo kho KV:**
   ```bash
   npx wrangler login
   npx wrangler kv namespace create SAVE_KV
   npx wrangler kv namespace create SAVE_KV --preview
   ```
2. **Điền mã KV vào [`server/wrangler.toml`](server/wrangler.toml):**
   Thay `PLACEHOLDER_SAVE_KV_ID` và `PLACEHOLDER_SAVE_KV_PREVIEW_ID` bằng `id` vừa nhận được từ bước 1.
3. **Chạy thử Backend tại máy local (2 cửa sổ Terminal):**
   ```bash
   # Terminal 1 — chạy Worker API ở cổng 8787
   npx wrangler dev server/index.ts --config server/wrangler.toml --port 8787

   # Terminal 2 — chạy Vite dev server (cấu hình thêm server.proxy['/api'] -> 'http://127.0.0.1:8787' trong vite.config.ts khi test local)
   npm run dev
   ```
4. **Deploy lên môi trường thật & kết nối với Frontend (`dist/`):**
   ```bash
   npm run build
   npx wrangler deploy --config server/wrangler.toml
   ```
   - **Cách khuyến nghị (cùng tên miền — không lo CORS/CSP):** Deploy thư mục `dist/` lên **Cloudflare Pages** và gắn route `*yourdomain.com/api/*` trỏ vào Worker `hang-soc-online-api`. Khi đó chính sách `connect-src 'self'` trong [`index.html`](index.html) hoạt động ngay mà không cần sửa đổi.
   - **Nếu đặt Frontend (GitHub Pages / Vercel / Netlify) khác tên miền với Worker:** Truyền URL đầy đủ `https://<ten-worker>.<subdomain>.workers.dev/api/...` vào `CloudSave` / `syncLeaderboardWithCloud` và bổ sung domain đó vào thẻ meta `Content-Security-Policy` (`connect-src 'self' https://*.workers.dev wss://*.workers.dev`) trong [`index.html`](index.html).

---

### Giai đoạn 2 — Nâng cấp lên Multiplayer Nhiều Người Chơi Thật (Thăm vườn thực, Co-op & Đấu 1v1)

Hiện tại, hệ thống hàng xóm trong [`src/sim/neighborSocial.ts`](src/sim/neighborSocial.ts) chạy theo mô hình **bất đồng bộ giả lập phía client** để game luôn chơi mượt cả khi ngoại tuyến. Để biến thành thế giới nhiều người chơi thật như *Township / Hay Day*, hãy nâng cấp theo 4 bước kiến trúc sau (dùng **Cloudflare D1 + Durable Objects** hoặc **Supabase Postgres + Realtime**):

#### Bước 1. Xác thực tài khoản thật & Chống gian lận (Auth & Anti-Cheat)
- **Thay định danh tự sinh bằng JWT:** Thay `X-User-Id` tự sinh trong [`src/ui/cloudSave.ts`](src/ui/cloudSave.ts) bằng đăng nhập OAuth (Google / Apple / GitHub / Email Magic Link) hoặc *Anonymous Auth* cho phép liên kết tài khoản sau. Client gửi kèm header `Authorization: Bearer <jwt>` trong mọi request `/api/*`.
- **Kiểm chứng phía Server (`server/index.ts`):**
  - Không cho client tự ghi đè điểm xếp hạng tuỳ ý: kiểm tra tốc độ tăng Cấp/Sao hợp lý giữa hai lần lưu, giới hạn tốc độ gửi (`Rate Limiting`), và xác thực nước đi/kết quả màn chơi theo seed cố định của [`src/data/match3Levels.ts`](src/data/match3Levels.ts) & [`src/sim/puzzleArcadeEngine.ts`](src/sim/puzzleArcadeEngine.ts).

#### Bước 2. Khởi tạo CSDL quan hệ (Schema SQL chuẩn cho Cloudflare D1 / PostgreSQL)
Thay vì chỉ dùng KV đơn lẻ, tạo 4 bảng cốt lõi để tra cứu Mã Thung Lũng, tải bản đồ bạn bè và xử lý hộp thư tương trợ không xung đột file save:

```sql
-- 1. Hồ sơ người chơi & Mã kết bạn độc nhất (HS-XXXX-XX)
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  friend_code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  park_name TEXT NOT NULL,
  house TEXT NOT NULL DEFAULT 'Gryffindor',
  avatar_emoji TEXT NOT NULL DEFAULT '🧙‍♂️',
  level INTEGER NOT NULL DEFAULT 1,
  updated_at INTEGER NOT NULL
);

-- 2. Bản chụp Thung Lũng công khai (chỉ lưu dữ liệu hiển thị 72x72 để bạn bè sang thăm nhanh)
CREATE TABLE valley_snapshots (
  player_id TEXT PRIMARY KEY REFERENCES players(id),
  buildings_json TEXT NOT NULL,
  tile_overrides_json TEXT NOT NULL,
  open_owl_crates_json TEXT NOT NULL,
  active_sos_json TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  saved_at INTEGER NOT NULL
);

-- 3. Quan hệ bạn bè hai chiều
CREATE TABLE friendships (
  player_id TEXT NOT NULL,
  friend_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (player_id, friend_id)
);

-- 4. Hộp thư hành động tương trợ bất đồng bộ (chống ghi đè trực tiếp vào save của chủ vườn)
CREATE TABLE coop_actions (
  id TEXT PRIMARY KEY,
  from_player_id TEXT NOT NULL REFERENCES players(id),
  to_player_id TEXT NOT NULL REFERENCES players(id),
  action_kind TEXT NOT NULL, -- 'water_crop' | 'tend_yard' | 'fill_owl_crate' | 'rescue_minigame' | 'lantern_note'
  target_ref TEXT NOT NULL,  -- buildingUid, orderId:slotIndex, hoặc kind:stage
  payload_json TEXT,
  action_date TEXT NOT NULL, -- YYYY-MM-DD để khoá chuẩn 1 lần/ngày/bạn ngay tại DB
  claimed_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_coop_inbox ON coop_actions(to_player_id, claimed_at);
CREATE UNIQUE INDEX idx_daily_rescue_guard
  ON coop_actions(from_player_id, to_player_id, action_date)
  WHERE action_kind = 'rescue_minigame';
```

#### Bước 3. Mở rộng API tương tác hàng xóm & Nối vào `src/sim/`
Mở rộng thêm các route trong `server/index.ts` và nối trực tiếp vào các hàm đã có sẵn trong codebase:

| API Endpoint mới | Chức năng trên Server | Hàm cần nối phía Client (`src/`) |
|---|---|---|
| `POST /api/friends/add` | Tìm `friend_code` (`HS-XXXX-XX`) trong bảng `players`, lưu vào `friendships` và trả hồ sơ bạn mới | `ParkSimulation.addFriendByCode()` trong [`simulation.ts`](src/sim/simulation.ts) |
| `GET /api/valley/:playerId` | Trả về `valley_snapshots` (`72×72` công trình, cây trồng, kiện Đơn Cú cần giúp & tín hiệu SOS) | `buildNeighborVisitState()` trong [`neighborSocial.ts`](src/sim/neighborSocial.ts) |
| `POST /api/coop/act` | Ghi nhận khách tưới hộ cây, đóng hộ Đơn Cú, để lại Đèn Lồng hoặc vượt hộ màn SOS (ép điều kiện `UNIQUE` 1 lần/ngày/bạn & trần 5 lượt cứu/ngày trên server) | `helpNeighborGarden()`, `fulfillNeighborOwlCrate()`, `completeNeighborMinigameRescue()` trong [`simulation.ts`](src/sim/simulation.ts) |
| `GET / POST /api/coop/inbox` | Chủ vườn tải danh sách hành động bạn bè đã giúp khi vắng nhà, cộng hiệu ứng giảm giờ/nhận quà và đánh dấu `claimed_at` | `tickNeighborSocialBackground()`, `claimHomeLanternMark()`, `claimPlayerMinigameSosRescue()` trong [`simulation.ts`](src/sim/simulation.ts) |

> **Nguyên tắc vàng tránh hỏng file save:** Khách sang thăm vườn **tuyệt đối không ghi đè trực tiếp vào JSON save của chủ vườn**. Mọi trợ giúp đều đẩy vào bảng `coop_actions` (Event Inbox); máy của chủ vườn sẽ kéo các sự kiện chưa nhận về áp dụng tuần tự vào `ParkSimulation` rồi lưu snapshot mới.

#### Bước 4. Hiện diện Thời gian thực & Thi đấu Mini Game Trực tiếp (WebSocket / Durable Objects)
Nếu muốn thấy bóng dáng bạn bè đi dạo trực tiếp trong thung lũng hoặc đấu trí 1v1:
1. Tạo một lớp **Cloudflare Durable Object** `ValleyRoom` (hoặc kênh **Supabase Realtime Presence & Broadcast**) ứng với mỗi `valleyId` / `matchRoomId`.
2. Mở kết nối `wss://<domain>/api/ws/valley/:valleyId`:
   - Đồng bộ toạ độ đi bộ `(gx, gy)` mỗi `150–200ms` và phát hoạt ảnh vẫy chào / tia nước *Aguamenti* tức thời lên `renderer.ts` thông qua danh sách thực thể khách tham quan tương tự `valleyVillagers`.
3. Với **Cờ Phù Thủy (`chess`)** và **Trận Pháp Ngũ Ấn Đạo Tặc (`caro`)**: mở phòng ghép trận `wss://<domain>/api/ws/duel/:mode` dùng chung bộ kiểm tra nước đi hợp lệ trong [`src/sim/puzzleArcadeEngine.ts`](src/sim/puzzleArcadeEngine.ts) trên cả server lẫn client để hai người chơi đấu trực tiếp tính điểm Elo lên [`minigameLeaderboard.ts`](src/sim/minigameLeaderboard.ts).

---

## 📚 Tài liệu liên quan

| File | Dành cho |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Agent & developer — ranh giới công việc, quy tắc bắt buộc, kiến trúc & lệnh kiểm tra |
| [`ASSETS.md`](ASSETS.md) | Artist — style guide Canon Hang Sóc × Playrix Township 2.5D & danh mục đầy đủ 172 sprite |

---

## 🧰 Công nghệ

TypeScript (strict) · Vite 6 (code-splitting + Web Worker) · Vitest · Canvas 2D · State thuần trong `sim/simulation.ts` · localStorage · Web Audio API (`AudioBuffer` SFX Atlas + Adaptive BGM) · Web Speech TTS · Self-hosted `.woff2` Fonts · Service Worker PWA Offline-First (`sw.js`)

Không dependency runtime nào ngoài `input-switch-polyfill`.

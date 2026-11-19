# Handoff HPVN Backend — Cúp 4 Nhà: Đua Huy Chương Từng Môn (Không Trần Cứng)

Tài liệu này mô tả thay đổi phía máy chủ HPVN (`functions/games/trang-trai-hang-soc-boards.js`) để chuyển Cúp 4 Nhà sang thể thức **Đua Huy Chương Từng Môn (Discipline Medal Bracket)** — tương thích 100% ngược với client `trang-trai-hang-soc` đã cập nhật tại `src/hpvn/houseCup.ts` & `src/ui/hudQuestsAndSettings.ts`.

---

## 1. Mục tiêu cân bằng

- **Không đặt trần cứng theo ngày (`memberDailyCap: 0`, `unlimited: true`)**: người chơi thích đua Cúp Nhà vẫn có thể cày điểm liên tục cho Nhà ở bất kỳ môn nào.
- **Chặn triệt để kịch bản 1–2 người cày duy nhất Bùa Gặt đè bẹp 3 Nhà còn lại**:
  - Mỗi bộ môn là **1 đấu trường tuần độc lập** cho 4 Nhà (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw` — có thể mở 4 môn hoặc đủ 6 môn ngay lập tức).
  - Trong từng môn, 4 Nhà xếp hạng theo **tổng điểm thô tuần không giới hạn** của môn đó rồi quy đổi sang điểm Cúp cố định:
    - **Hạng 1:** `+100 đ Cúp`
    - **Hạng 2:** `+75 đ Cúp`
    - **Hạng 3:** `+50 đ Cúp`
    - **Hạng 4:** `+25 đ Cúp`
    - **Chưa ghi điểm (`0`):** `+0 đ Cúp`
    - Đồng hạng (`rawPoints > 0`): cùng nhận điểm hạng cao hơn (kiểu Olympic — ví dụ 2 Nhà đồng Hạng 1 cùng nhận `100`, Nhà tiếp theo nhận `50`).
  - **Tổng điểm Cúp Tuần của Nhà** = tổng điểm Cúp quy đổi từ tất cả các môn. Dù 1 Nhà bỏ xa ở Bùa Gặt `50.000` vs `500`, Nhà đó cũng chỉ nhận tối đa `100 đ Cúp` ở riêng môn Bùa Gặt.
- **Giữ nguyên thưởng Cúp Đợt cá nhân (`memberBank` / `memberTier` / `perTier: 300`)**: mỗi màn thắng mới vẫn cộng `20 đ` vào `memberBank` cá nhân để máy chủ tự động trao quà Sickle, XP & Cát Thời Gian vào inbox.

---

## 2. Nguồn đếm màn thắng từ Save JSON (6 bộ môn)

Khi client gọi `op: 'save'` (`cup: 2`), trích xuất số màn đã vượt qua theo từng môn từ `save`:

```js
const CUP_DISCIPLINES = ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw'];
const MEDAL_POINTS = [100, 75, 50, 25];
const POINTS_PER_STAGE = 20;

function extractClearedByDiscipline(saveObj) {
  const m3 = saveObj?.match3 || {};
  const pa = saveObj?.puzzleArcade || {};
  // Lưu ý quan trọng: chỉ tính Dò Mìn (caro) & Bắn Cá (chess) khi save đã migrate (arcadeDisciplineRev >= 2)
  // để không tính nhầm tiến độ Caro/Cờ Phù Thủy cũ khi reset về Màn 1.
  const rev = Math.floor(Number(pa.arcadeDisciplineRev) || 0);
  return {
    match3: Math.max(0, Math.floor(Number(m3.maxClearedLevel) || 0)),
    caro: rev >= 2 ? Math.max(0, Math.floor(Number(pa.caroCleared) || 0)) : 0,
    sudoku: Math.max(0, Math.floor(Number(pa.sudokuCleared) || 0)),
    chess: rev >= 2 ? Math.max(0, Math.floor(Number(pa.chessCleared) || 0)) : 0,
    blocks: Math.max(0, Math.floor(Number(pa.blockCleared) || 0)),
    jigsaw: Math.max(0, Math.floor(Number(pa.jigsawCleared) || 0)),
  };
}
```

> **Anti-spike an toàn khi không đặt trần ngày:** Mỗi lần `op: 'save'`, vẫn giữ chặn delta bất thường mỗi request (ví dụ `Math.min(delta, 10)` màn/lần lưu cho 1 môn) và chỉ tính phần tăng dương (`Math.max(0, nextCleared - prevCleared)`) so với `lastClearedByDiscipline[disc]` đã lưu trên doc thành viên.

---

## 3. Lưu trữ theo Tuần & Công thức Quy đổi Huy Chương

Trên document tuần `weekDoc` (ví dụ `gameHouseCupWeeks/{weekKey}`):

```json
{
  "weekKey": "2026-W48",
  "disciplines": {
    "match3": { "Gryffindor": 420, "Slytherin": 540, "Ravenclaw": 1860, "Hufflepuff": 380 },
    "caro":   { "Gryffindor": 260, "Slytherin": 180, "Ravenclaw": 140,  "Hufflepuff": 220 },
    "sudoku": { "Gryffindor": 240, "Slytherin": 160, "Ravenclaw": 200,  "Hufflepuff": 300 },
    "chess":  { "Gryffindor": 320, "Slytherin": 280, "Ravenclaw": 180,  "Hufflepuff": 200 },
    "blocks": { "Gryffindor": 180, "Slytherin": 300, "Ravenclaw": 220,  "Hufflepuff": 260 },
    "jigsaw": { "Gryffindor": 220, "Slytherin": 140, "Ravenclaw": 160,  "Hufflepuff": 240 }
  }
}
```

Khi thành viên thuộc Nhà `house` thắng thêm `deltaStages` ở môn `disc`:
- Cộng `deltaPts = deltaStages * POINTS_PER_STAGE` vào:
  - `weekDoc.disciplines[disc][house]` (không trần ngày!)
  - `memberCup.todayPoints` (thống kê hôm nay của thành viên)
  - `memberCup.bank` (tích lũy nhận quà **Cúp Đợt** mỗi `300 đ`)

Hàm quy đổi sang `houses` (tổng điểm Cúp Tuần):

```js
const HOUSES = ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'];

function computeBracketHouses(disciplines, medalPoints = MEDAL_POINTS) {
  const houses = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  for (const disc of CUP_DISCIPLINES) {
    const rawMap = disciplines?.[disc];
    if (!rawMap) continue;
    const sorted = HOUSES
      .map((h) => ({ h, raw: Math.max(0, Math.floor(Number(rawMap[h]) || 0)) }))
      .sort((a, b) => b.raw - a.raw);

    let rank = 0;
    let prevRaw = -1;
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].raw <= 0) continue;
      if (sorted[i].raw !== prevRaw) {
        rank = i + 1;
        prevRaw = sorted[i].raw;
      }
      houses[sorted[i].h] += medalPoints[Math.min(3, rank - 1)] || 0;
    }
  }
  return houses;
}
```

---

## 4. Payload trả về cho Client (`op: 'cup'`, `op: 'load'`, `op: 'save'`)

Client (`src/hpvn/houseCup.ts`) tự động nhận diện chế độ Đua Huy Chương khi payload `cup` có `mode: 'medals'` và `disciplines`:

```json
{
  "weekKey": "2026-W48",
  "mode": "medals",
  "unlimited": true,
  "medalPoints": [100, 75, 50, 25],
  "houses": {
    "Gryffindor": 425,
    "Hufflepuff": 400,
    "Slytherin": 325,
    "Ravenclaw": 250
  },
  "disciplines": {
    "match3": { "Gryffindor": 420, "Slytherin": 540, "Ravenclaw": 1860, "Hufflepuff": 380 },
    "caro":   { "Gryffindor": 260, "Slytherin": 180, "Ravenclaw": 140,  "Hufflepuff": 220 },
    "sudoku": { "Gryffindor": 240, "Slytherin": 160, "Ravenclaw": 200,  "Hufflepuff": 300 },
    "chess":  { "Gryffindor": 320, "Slytherin": 280, "Ravenclaw": 180,  "Hufflepuff": 200 },
    "blocks": { "Gryffindor": 180, "Slytherin": 300, "Ravenclaw": 220,  "Hufflepuff": 260 },
    "jigsaw": { "Gryffindor": 220, "Slytherin": 140, "Ravenclaw": 160,  "Hufflepuff": 240 }
  },
  "house": "Gryffindor",
  "memberTodayPoints": 120,
  "memberDailyCap": 0,
  "memberBank": 120,
  "memberTier": 1,
  "perTier": 300
}
```

- Với `op: 'save'`: chỉ cần trả phần thành viên (`memberTodayPoints`, `memberDailyCap: 0`, `memberBank`, `memberTier`, `perTier`, `mode: 'medals'`, `unlimited: true`), hoặc trả kèm cả `houses` + `disciplines` để UI cập nhật tức thì.
- **Tương thích ngược 100%:** Trước khi triển khai patch backend này, client vẫn nhận payload cũ (`houses` + `memberDailyCap: 60`, không có `disciplines`) và hiển thị bình thường không lỗi.

---

## 5. Liên Minh 2 vs 2 Xoay Vòng Mỗi Tuần (4 Nhà → 2 Liên Minh)

Cứ mỗi tuần ISO mới (`weekKey`), 4 Nhà Hogwarts được ghép thành **2 Liên Minh (2 vs 2)** và **xoay vòng đổi cặp** qua 3 cặp duy nhất sao cho không có 2 tuần liên tiếp lặp lại cùng liên minh (và sau mỗi 3 tuần, mỗi Nhà sẽ bắt tay đủ với cả 3 Nhà còn lại):

```js
const ALLIANCE_ROTATION = [
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Ánh Dương', houses: ['Gryffindor', 'Hufflepuff'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Nguyệt Ảnh', houses: ['Slytherin', 'Ravenclaw'] },
  ],
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Lửa & Trí', houses: ['Gryffindor', 'Ravenclaw'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Ngọc Rừng', houses: ['Slytherin', 'Hufflepuff'] },
  ],
  [
    { id: 'alliance_a', nameVi: 'Liên Minh Song Hùng', houses: ['Gryffindor', 'Slytherin'] },
    { id: 'alliance_b', nameVi: 'Liên Minh Tinh Tú', houses: ['Ravenclaw', 'Hufflepuff'] },
  ],
];

function getIsoWeekSerial(weekKey) {
  const m = /^(\d{4})-W(\d{1,2})$/i.exec(String(weekKey || '').trim());
  if (!m) return 0;
  const year = Number(m[1]);
  const week = Number(m[2]);
  const jan4 = Date.UTC(year, 0, 4);
  const jan4Day = new Date(jan4).getUTCDay() || 7;
  const week1Monday = jan4 - (jan4Day - 1) * 86_400_000;
  const targetMonday = week1Monday + (week - 1) * 7 * 86_400_000;
  return Math.round((targetMonday - Date.UTC(1970, 0, 5)) / (7 * 86_400_000));
}

function getWeeklyAlliances(weekKey) {
  const idx = ((getIsoWeekSerial(weekKey) % 3) + 3) % 3;
  return ALLIANCE_ROTATION[idx];
}
```

- **Điểm mỗi Liên Minh** = tổng điểm Cúp Tuần của 2 Nhà trong Liên Minh (`houses[h0] + houses[h1]`). Cuối tuần, **cả 2 Nhà trong Liên Minh chiến thắng** cùng nhận phần thưởng vô địch Cúp Tuần!
- **Tùy chọn ghép cặp chủ động từ server:** Nếu backend muốn tự chỉ định cặp Liên Minh khác công thức xoay vòng mặc định (ví dụ ghép **Hạng 1 + Hạng 4** đấu **Hạng 2 + Hạng 3** dựa theo bảng xếp hạng tuần trước), chỉ cần trả thêm mảng `alliances` gồm 2 phần tử (`{ id, nameVi, houses: [houseA, houseB] }`) trong payload `cup` — client (`src/hpvn/houseCup.ts`) sẽ ưu tiên hiển thị đúng cặp server gửi xuống.

---

## 6. Tính Điểm Nhà Theo Thứ Hạng BXH Cá Nhân (Ngưỡng ≥ 5 Màn Là Có Điểm)

Để **mọi thành viên chỉ cần vượt qua từ 5 màn trở lên đều chắc chắn có điểm cho Nhà**, đồng thời **xếp thứ hạng cá nhân trên BXH càng cao điểm góp càng nhiều** (vẫn giữ động lực đua top không giới hạn, nhưng 2 người đứng #1 và #2 chỉ tối đa `100 + 80 = 180 đ` nên 1 tập thể đông thành viên đạt ≥ 5 màn vẫn đua vượt được!):

```js
const MIN_STAGES_FOR_HOUSE_POINTS = 5;
// Tối ưu cho quy mô 15–20 người chơi thường xuyên/tuần (6 nấc sắc nét, Hạng 11+ đạt >= 5 màn nhận +20 đ)
const RANK_POINT_TIERS = [
  { maxRank: 1, points: 100, labelVi: 'Hạng 1' },
  { maxRank: 2, points: 80, labelVi: 'Hạng 2' },
  { maxRank: 3, points: 65, labelVi: 'Hạng 3' },
  { maxRank: 5, points: 50, labelVi: 'Top 5' },
  { maxRank: 10, points: 35, labelVi: 'Top 10' },
  { maxRank: null, points: 20, labelVi: 'Hạng 11+' },
];

function computeRankHousePoints(rank, clearedStages) {
  if ((Number(clearedStages) || 0) < MIN_STAGES_FOR_HOUSE_POINTS || rank < 1) return 0;
  for (const tier of RANK_POINT_TIERS) {
    if (tier.maxRank === null || rank <= tier.maxRank) return tier.points;
  }
  return 20;
}

/**
 * Với mỗi bộ môn (đã sắp xếp danh sách người chơi theo điểm/số màn vượt trong tuần giảm dần):
 * - Mỗi người chơi có `clearedStages >= 5` đóng góp điểm theo bậc thứ hạng vào `disciplines[disc][house]`.
 * - Cuối cùng quy đổi bảng `disciplines` qua `computeBracketHouses` (hoặc cộng thẳng tổng điểm Nhà & 2 Liên Minh).
 */
function scoreDisciplineFromRankedPlayers(rankedEntries) {
  const byHouse = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  rankedEntries.forEach((entry, idx) => {
    const rank = idx + 1;
    const pts = computeRankHousePoints(rank, entry.clearedStages);
    if (pts > 0 && byHouse[entry.house] !== undefined) {
      byHouse[entry.house] += pts;
    }
  });
  return byHouse;
}
```

- Server có thể tuỳ chỉnh `minStagesForPoints` (mặc định `5`, có thể hạ riêng Sudoku xuống `3` nếu ít người chơi) và `rankTiers` trong payload `cup` trả về — client (`src/hpvn/houseCup.ts`, `src/ui/leaderboardModal.ts`, `src/ui/hudQuestsAndSettings.ts`) tự động đọc và hiển thị đúng thang điểm mới trên cả **Pop-up Cúp 4 Nhà**, **Tab Cúp Nhà** lẫn từng dòng trong **Bảng Xếp Hạng** (`+100 đ Nhà`, `+80 đ Nhà`, ..., `+20 đ Nhà`, hoặc `X/5 màn ghi điểm Nhà`).



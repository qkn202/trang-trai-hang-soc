# Handoff HPVN Backend — Cúp 4 Nhà: Tổng Điểm 7 Môn (6 Mini-Game + Môn #7 Derby Nông Trại) × Cân Bằng Quân Số Liên Minh (Phương Án F2)

> **Cập nhật chính thức (28/11/2026 — Phương án F2 + Môn #7 Derby Nông Trại + Bộ 6 Cúp Liên Minh):**
> - **Mục 11 (Phương án F2):** Thay thế bước nén huy chương `100/75/50/25` sang cộng tổng điểm đóng góp trực tiếp các bộ môn cho từng Nhà/Liên Minh và nhân **Hệ số Cân Bằng Quân Số khóa đầu tuần** theo trung bình trượt `3` tuần gần nhất, sàn `4` người/LM, trần `2.5×` *(giữ nguyên xoay vòng Liên Minh 3 cặp và xếp hạng Cách A `100/80/65/50/35/20`)*.
> - **Mục 12 (Môn #7: Derby Nông Trại — `derby` / `farmDerby`):** Mở rộng Cúp Nhà lên **7 đấu trường** bằng **Đua Nông Trại Derby** (client tự gửi `farmDerby: { weekKey, points, tasksCompleted }` trong `op: 'save'`; server kẹp chống gian lận `0..2500 đ/tuần`, `0..8` nhiệm vụ, ngưỡng `>= 2` nhiệm vụ/tuần, xếp hạng theo `computeDerbyDisciplineHouseTotals`).
> - **Mục 8 (Bộ 6 Cúp Liên Minh Mạng Floo):** **Bỏ hoàn toàn** khung/cúp `alliance-cup` cũ (không giữ fallback hay phát lại) và **thay thế hoàn toàn bằng bộ 6 Cúp Liên Minh riêng biệt** — chốt tuần `16:00 Thứ Sáu` giờ VN, Liên Minh Hạng 1 được trao đúng Cúp tương ứng cặp 2 Nhà của mình.
> - Client (`src/hpvn/houseCup.ts`, `src/hpvn/bridge.ts`, `src/sim/weeklyDerbyEngine.ts`, `src/ui/hudQuestsAndSettings.ts`) đã triển khai đầy đủ `mode: 'f2'` + Môn #7 `derby` và vẫn **tương thích ngược 100%** với payload 6 môn / `mode: 'medals'` / `legacy` cũ trong lúc server chưa deploy patch Mục 11–12.

Tài liệu này mô tả thay đổi phía máy chủ HPVN (`functions/games/trang-trai-hang-soc-boards.js`) cho Cúp 4 Nhà — tương thích 100% ngược với client `trang-trai-hang-soc` tại `src/hpvn/houseCup.ts`, `src/hpvn/bridge.ts` & `src/ui/hudQuestsAndSettings.ts`.

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

Khi thành viên thuộc Nhà `house` vượt mới từ `prevCleared` lên `nextCleared` ở môn `disc`:
- Tính `{ deltaStages, weightedScore } = computeWeeklyStageDeltaScore(prevCleared, nextCleared)` theo hệ số độ khó màn ở **Mục 6** (`Màn 1–15: 20 đ`, `16–40: 25 đ`, `41–80: 30 đ`, `81+: 35 đ/màn`):
  - Cộng `deltaStages` vào `memberCup.weeklyClearedByDiscipline[disc]` và `weightedScore` vào `memberCup.weeklyWeightedScoreByDiscipline[disc]` (reset về `0` mỗi tuần `weekKey` mới).
  - Cộng `weightedScore` vào `memberCup.todayPoints` (thống kê hôm nay) và `memberCup.bank` (tích lũy nhận quà **Cúp Đợt** mỗi `300 đ`).
  - Tổng hợp `weekDoc.disciplines[disc][house]` từ xếp hạng tuần theo `scoreDisciplineFromWeeklyPlayers` ở **Mục 6** (ngưỡng `>= 5` màn mới/tuần, bậc điểm `100 / 80 / 65 / 50 / 35 / 20`, không trần ngày!).

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

## 6. Tính Điểm Nhà Theo Thứ Hạng Tuần Có Hệ Số Độ Khó Màn (Cách A — Ngưỡng ≥ 5 Màn Mới/Tuần)

Áp dụng **Cách A** để vừa đảm bảo **mọi người đầu tuần bắt đầu từ `0`** (không ai ngồi yên từ tuần trước vẫn ăn điểm), vừa đảm bảo **người đang ở Màn 60 (màn khó) không bị thiệt so với người đang ở Màn 5 (màn dễ)**, đồng thời **chỉ cần vượt từ 5 màn mới trong tuần là chắc chắn ghi điểm cho Nhà**:

### 6.1. Hệ số điểm mỗi màn vượt mới trong tuần (`STAGE_SCORE_BANDS`)
| Khung Màn | Điểm tuần / màn | Ví dụ công bằng |
|---|---|---|
| **Màn 1–15** | **`20 đ / màn`** (`1,0×`) | Người ở Màn 5 vượt 7 màn (`5 → 12`) = **`140 đ tuần`** |
| **Màn 16–40** | **`25 đ / màn`** (`1,25×`) | Vượt qua ranh giới `14 → 17` = `20 + 25 + 25 = 70 đ` |
| **Màn 41–80** | **`30 đ / màn`** (`1,5×`) | Người ở Màn 60 vượt 5 màn (`60 → 65`) = **`150 đ tuần`** *(xếp trên người vượt 7 màn dễ!)* |
| **Màn 81+** | **`35 đ / màn`** (`1,75×`) | Người ở Màn 90 vượt 5 màn (`90 → 95`) = **`175 đ tuần`** |

### 6.2. Công thức đầy đủ phía server (`op: 'save'` & tổng hợp tuần)
```js
const MIN_STAGES_FOR_HOUSE_POINTS = 5;

const STAGE_SCORE_BANDS = [
  { maxStage: 15, pointsPerStage: 20, labelVi: 'Màn 1–15' },
  { maxStage: 40, pointsPerStage: 25, labelVi: 'Màn 16–40' },
  { maxStage: 80, pointsPerStage: 30, labelVi: 'Màn 41–80' },
  { maxStage: null, pointsPerStage: 35, labelVi: 'Màn 81+' },
];

// Tối ưu cho quy mô 15–20 người chơi thường xuyên/tuần (6 nấc sắc nét, Hạng 11+ đạt >= 5 màn nhận +20 đ)
const RANK_POINT_TIERS = [
  { maxRank: 1, points: 100, labelVi: 'Hạng 1' },
  { maxRank: 2, points: 80, labelVi: 'Hạng 2' },
  { maxRank: 3, points: 65, labelVi: 'Hạng 3' },
  { maxRank: 5, points: 50, labelVi: 'Top 5' },
  { maxRank: 10, points: 35, labelVi: 'Top 10' },
  { maxRank: null, points: 20, labelVi: 'Hạng 11+' },
];

function getStageDifficultyPoints(stageNumber, bands = STAGE_SCORE_BANDS) {
  const s = Math.floor(Number(stageNumber) || 0);
  if (s < 1) return 0;
  for (const band of bands) {
    if (band.maxStage === null || s <= band.maxStage) return band.pointsPerStage;
  }
  return 20;
}

/** Tính chính xác số màn vượt mới & tổng điểm tuần có trọng số độ khó giữa prevCleared -> nextCleared (chặn tối đa 10 màn/lần save). */
function computeWeeklyStageDeltaScore(prevCleared, nextCleared, maxDeltaPerSave = 10, bands = STAGE_SCORE_BANDS) {
  const prev = Math.max(0, Math.floor(Number(prevCleared) || 0));
  const next = Math.max(0, Math.floor(Number(nextCleared) || 0));
  if (next <= prev) return { deltaStages: 0, weightedScore: 0 };
  const deltaStages = Math.min(maxDeltaPerSave, next - prev);
  let weightedScore = 0;
  for (let s = prev + 1; s <= prev + deltaStages; s++) {
    weightedScore += getStageDifficultyPoints(s, bands);
  }
  return { deltaStages, weightedScore };
}

// Trong op === 'save' (reset về 0 mỗi tuần weekKey mới):
// for (const disc of CUP_DISCIPLINES) {
//   const { deltaStages, weightedScore } = computeWeeklyStageDeltaScore(prevCleared[disc], nextCleared[disc]);
//   if (deltaStages > 0) {
//     memberCup.weeklyClearedByDiscipline[disc] += deltaStages;
//     memberCup.weeklyWeightedScoreByDiscipline[disc] += weightedScore;
//     memberCup.todayPoints += weightedScore;
//     memberCup.bank += weightedScore; // thưởng Cúp Đợt mỗi 300 đ
//   }
// }

function computeRankHousePoints(rank, weeklyCleared) {
  if ((Number(weeklyCleared) || 0) < MIN_STAGES_FOR_HOUSE_POINTS || rank < 1) return 0;
  for (const tier of RANK_POINT_TIERS) {
    if (tier.maxRank === null || rank <= tier.maxRank) return tier.points;
  }
  return 20;
}

/**
 * Với mỗi bộ môn trong tuần `weekKey`:
 * 1. Lọc người chơi có `weeklyCleared >= 5` và sắp xếp theo `weeklyWeightedScore` giảm dần (hòa thì ưu tiên `weeklyCleared` cao hơn).
 * 2. Cộng điểm đóng góp theo thứ hạng (`100 / 80 / 65 / 50 / 35 / 20`) vào `disciplines[disc][house]`.
 * 3. Quy đổi bảng 6 môn `disciplines` qua `computeBracketHouses` (`100 / 75 / 50 / 25`) ra điểm Cúp Nhà & 2 Liên Minh.
 */
function scoreDisciplineFromWeeklyPlayers(entries) {
  const eligible = entries
    .filter((e) => (Number(e.weeklyCleared) || 0) >= MIN_STAGES_FOR_HOUSE_POINTS)
    .sort((a, b) => (b.weeklyWeightedScore - a.weeklyWeightedScore) || (b.weeklyCleared - a.weeklyCleared));

  const byHouse = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  let activeRank = 0;
  let prevScore = -1;
  eligible.forEach((entry, idx) => {
    const sc = Math.max(0, Math.floor(Number(entry.weeklyWeightedScore) || 0));
    if (sc !== prevScore) {
      activeRank = idx + 1;
      prevScore = sc;
    }
    const pts = computeRankHousePoints(activeRank, entry.weeklyCleared);
    if (pts > 0 && byHouse[entry.house] !== undefined) {
      byHouse[entry.house] += pts;
    }
  });
  return byHouse;
}
```

- Server có thể tuỳ chỉnh `minStagesForPoints` (mặc định `5`), `rankTiers`, và `stageScoreBands` trong payload `op: 'cup'` trả về — client (`src/hpvn/houseCup.ts`, `src/ui/leaderboardModal.ts`, `src/ui/hudQuestsAndSettings.ts`) tự động đọc và hiển thị đúng thang điểm + bảng khung độ khó màn trên **Pop-up Thể lệ Cúp 4 Nhà**, **Tab Cúp Nhà** và **Bảng Xếp Hạng**.

---

## 7. Thưởng 200.000 Galleons Cho Liên Minh Đứng #1 Cúp Nhà (Bắt Đầu 17:00 Thứ Sáu → Kết Thúc 16:00 Thứ Sáu Tuần Sau)

Bổ sung cơ chế phát thưởng **Galleons** tự động hàng tuần từ máy chủ HPVN vào thẳng ví thành viên (`users/{uid}.galleons`):

- **Lịch thi đấu & chốt sổ chuẩn (giờ Việt Nam, `Asia/Ho_Chi_Minh`, `UTC+7`):**
  - **Bắt đầu tính điểm tuần mới:** **`17:00 Thứ Sáu`** (mùa giải đầu tiên khai màn lúc **`17:00 Thứ Sáu 20/11/2026`**).
  - **Kết thúc tính điểm & Chốt thưởng:** **`16:00 Thứ Sáu tuần kế tiếp`** (cron **`0 16 * * 5`**, `timeZone: 'Asia/Ho_Chi_Minh'` — kỳ đầu tiên kết thúc lúc **`16:00 Thứ Sáu 27/11/2026`**).
  - **Khung nghỉ tổng kết (`16:00 → 17:00 Thứ Sáu`, 1 tiếng):** Đã chốt sổ tuần cũ, trao thưởng `200.000 Galleons` + khung Floo & đổi cặp Liên Minh mới; không cộng điểm sang tuần kế tiếp cho tới đúng **`17:00 Thứ Sáu`**.
- **Tổng quỹ thưởng:** **`200.000 Galleons`** (`ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS = 200_000`) **chia đều** cho toàn bộ thành viên đủ điều kiện thuộc **Liên Minh đứng Hạng 1 Cúp Nhà** (gồm cả 2 Nhà trong Liên Minh dẫn đầu):
  - `perMemberGalleons = Math.floor(200_000 / qualifiedUids.length)`
  - Ví dụ với 8–10 người chơi hợp lệ thuộc Liên Minh #1: mỗi người nhận **`20.000 – 25.000 Galleons`**.
- **Điều kiện nhận thưởng bắt buộc cho từng thành viên:** Phải **chơi ít nhất 5 ván của 1 mini game bất kỳ** trong chu kỳ tuần đó (`Math.max(...Object.values(weeklyPlaysByDiscipline)) >= 5` trên 6 môn `match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`). Không cộng dồn rải rác (ví dụ 2 ván Bùa Gặt + 3 ván Dò Mìn = chưa đạt; cần ít nhất 5 ván trong cùng 1 môn bất kỳ).

### 7.1. Mã chu kỳ 17:00 Thứ Sáu → 16:00 Thứ Sáu Tuần Sau (`cycleKey`)
Dùng `cycleKey` là **ngày Thứ Sáu kết thúc kỳ** theo giờ Việt Nam (`YYYY-MM-DD`, VD mùa khai màn `20/11 17:00 → 27/11 16:00` mang mã `'2026-11-27'`):

```js
const VN_UTC_OFFSET_MS = 7 * 3_600_000;
const DAY_MS = 86_400_000;
const ALLIANCE_PRIZE_POOL = 200_000;
const ALLIANCE_MIN_GAMES_ANY_MINIGAME = 5;
const FIRST_SEASON_START_MS = Date.UTC(2026, 10, 20, 10, 0, 0, 0); // 2026-11-20 17:00:00+07:00
const SEASON_DURATION_MS = 7 * DAY_MS - 1 * 3_600_000; // 6 ngày 23 giờ (Thứ Sáu 17:00 -> Thứ Sáu sau 16:00)

function formatVnDateKey(epochMs) {
  const vn = new Date(epochMs + VN_UTC_OFFSET_MS);
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`;
}

function getAllianceWeeklyScheduleState(nowMs = Date.now()) {
  if (nowMs < FIRST_SEASON_START_MS) {
    const startsAt = FIRST_SEASON_START_MS;
    const endsAt = startsAt + SEASON_DURATION_MS;
    return { phase: 'upcoming', startsAt, endsAt, cycleKey: formatVnDateKey(endsAt) };
  }
  const vnNowMs = nowMs + VN_UTC_OFFSET_MS;
  const d = new Date(vnNowMs);
  const daysSinceFri = (d.getUTCDay() - 5 + 7) % 7;
  let startVnMs = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysSinceFri, 17, 0, 0, 0);
  if (startVnMs > vnNowMs) startVnMs -= 7 * DAY_MS;
  const startsAt = startVnMs - VN_UTC_OFFSET_MS;
  const endsAt = startsAt + SEASON_DURATION_MS;
  if (nowMs < endsAt) {
    return { phase: 'active', startsAt, endsAt, cycleKey: formatVnDateKey(endsAt) };
  }
  const nextStartsAt = startsAt + 7 * DAY_MS;
  const nextEndsAt = nextStartsAt + SEASON_DURATION_MS;
  return { phase: 'break', startsAt: nextStartsAt, endsAt: nextEndsAt, cycleKey: formatVnDateKey(nextEndsAt) };
}
```

### 7.2. Ghi nhận số ván chơi & điểm tuần trong `op: 'save'`
Chỉ cộng điểm Cúp Nhà & số ván tuần khi `schedule.phase === 'active'` (tức nằm trong khung `17:00 Thứ Sáu → 16:00 Thứ Sáu tuần kế tiếp`, bỏ qua khung nghỉ `16:00–17:00 Thứ Sáu` và khoảng thời gian trước khi mùa đầu mở lúc `17:00 20/11`):

```js
function extractPlayedByDiscipline(saveObj) {
  const cleared = extractClearedByDiscipline(saveObj);
  const plays = saveObj?.minigamePlays || {};
  const rev = Math.floor(Number(saveObj?.puzzleArcade?.arcadeDisciplineRev) || 0);
  const readPlay = (disc) => {
    if ((disc === 'caro' || disc === 'chess') && rev < 2) return 0;
    return Math.max(cleared[disc], Math.max(0, Math.floor(Number(plays[disc]) || 0)));
  };
  return {
    match3: readPlay('match3'),
    caro: readPlay('caro'),
    sudoku: readPlay('sudoku'),
    chess: readPlay('chess'),
    blocks: readPlay('blocks'),
    jigsaw: readPlay('jigsaw'),
  };
}

// Trong op === 'save':
const sched = getAllianceWeeklyScheduleState(Date.now());
const nextPlayed = extractPlayedByDiscipline(nextSaveObj);
const prevPlayed = memberCup.lastPlayedByDiscipline || nextPlayed;
if (sched.phase === 'active') {
  const weeklyPlays = memberCup.rewardCycleKey === sched.cycleKey
    ? { ...(memberCup.weeklyPlaysByDiscipline || {}) }
    : { match3: 0, caro: 0, sudoku: 0, chess: 0, blocks: 0, jigsaw: 0 };

  for (const disc of CUP_DISCIPLINES) {
    const delta = Math.max(0, Math.min(10, (nextPlayed[disc] || 0) - (prevPlayed[disc] || 0)));
    weeklyPlays[disc] = (weeklyPlays[disc] || 0) + delta;
  }
  memberCup.rewardCycleKey = sched.cycleKey;
  memberCup.weeklyPlaysByDiscipline = weeklyPlays;
}
memberCup.lastPlayedByDiscipline = nextPlayed;
```

### 7.3. Scheduled Function kết thúc & phát thưởng mỗi 16:00 Thứ Sáu (`0 16 * * 5`, `Asia/Ho_Chi_Minh`)

```js
// Firebase Functions v2: onSchedule({ schedule: '0 16 * * 5', timeZone: 'Asia/Ho_Chi_Minh' }, ...)
async function payoutHouseCupAllianceWeekly() {
  const nowMs = Date.now();
  // Chạy từ kỳ chốt sổ đầu tiên (27/11/2026 16:00 ICT) trở đi; lùi 5 phút về 15:55 để lấy đúng cycleKey vừa kết thúc
  if (nowMs < FIRST_SEASON_START_MS + SEASON_DURATION_MS - 60_000) return;
  const { cycleKey } = getAllianceWeeklyScheduleState(nowMs - 5 * 60_000);
  const payoutRef = db.collection('houseCupAlliancePayouts').doc(cycleKey);

  // 1. Chống phát trùng (idempotent lock)
  const locked = await db.runTransaction(async (tx) => {
    const snap = await tx.get(payoutRef);
    if (snap.exists) return false;
    tx.set(payoutRef, { status: 'processing', cycleKey, startedAt: FieldValue.serverTimestamp() });
    return true;
  });
  if (!locked) return;

  // 2. Xác định Liên Minh đứng Hạng 1 Cúp Nhà tuần hiện tại
  const weekKey = getVietnamIsoWeekKey(nowMs - 5 * 60_000);
  const weekSnap = await db.collection('gameHouseCupWeeks').doc(weekKey).get();
  const disciplines = weekSnap.data()?.disciplines || {};
  const houses = computeBracketHouses(disciplines);
  const alliances = weekSnap.data()?.alliances || getWeeklyAlliances(weekKey);

  const rankedAlliances = alliances.map((a) => {
    const [h0, h1] = a.houses;
    const cupPts = (houses[h0] || 0) + (houses[h1] || 0);
    const rawPts = CUP_DISCIPLINES.reduce(
      (sum, d) => sum + (Number(disciplines[d]?.[h0]) || 0) + (Number(disciplines[d]?.[h1]) || 0),
      0
    );
    return { ...a, cupPts, rawPts };
  }).sort((x, y) => y.cupPts - x.cupPts || y.rawPts - x.rawPts);

  const isAbsoluteTie =
    rankedAlliances[0].cupPts === rankedAlliances[1].cupPts &&
    rankedAlliances[0].rawPts === rankedAlliances[1].rawPts;
  const winningHouses = isAbsoluteTie
    ? [...rankedAlliances[0].houses, ...rankedAlliances[1].houses]
    : [...rankedAlliances[0].houses];
  const winnerNameVi = isAbsoluteTie
    ? 'Đồng Hạng 1 (Cả 2 Liên Minh)'
    : rankedAlliances[0].nameVi;

  // 3. Lọc toàn bộ thành viên thuộc Liên Minh #1 có >= 5 ván ở bất kỳ 1 mini game nào trong chu kỳ
  const memberSnaps = await db
    .collection('farmMembers')
    .where('house', 'in', winningHouses)
    .where('cup.rewardCycleKey', '==', cycleKey)
    .get();

  const qualifiedUids = [];
  memberSnaps.forEach((doc) => {
    const plays = doc.data()?.cup?.weeklyPlaysByDiscipline || {};
    const bestPlays = Math.max(0, ...CUP_DISCIPLINES.map((d) => Number(plays[d]) || 0));
    if (bestPlays >= ALLIANCE_MIN_GAMES_ANY_MINIGAME) {
      qualifiedUids.push(doc.id);
    }
  });

  if (qualifiedUids.length === 0) {
    await payoutRef.set({
      status: 'skipped_no_qualified_members',
      cycleKey,
      weekKey,
      allianceNameVi: winnerNameVi,
      houses: winningHouses.slice(0, 2),
      poolAmount: ALLIANCE_PRIZE_POOL,
      qualifiedCount: 0,
      perMemberAmount: 0,
      paidAt: Date.now(),
    });
    return;
  }

  // 4. Chia đều 200.000 Galleons và cộng thẳng vào ví HPVN users/{uid}.galleons (theo lô 400 doc/batch)
  const perMemberAmount = Math.floor(ALLIANCE_PRIZE_POOL / qualifiedUids.length);
  for (let i = 0; i < qualifiedUids.length; i += 400) {
    const batch = db.batch();
    for (const uid of qualifiedUids.slice(i, i + 400)) {
      batch.update(db.collection('users').doc(uid), {
        galleons: FieldValue.increment(perMemberAmount),
      });
      batch.set(db.collection('gameAuditLogs').doc(), {
        uid,
        kind: 'house_cup_alliance_weekly_reward',
        cycleKey,
        weekKey,
        allianceNameVi: winnerNameVi,
        galleons: perMemberAmount,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  }

  await payoutRef.set({
    status: 'paid',
    cycleKey,
    weekKey,
    allianceNameVi: winnerNameVi,
    houses: rankedAlliances[0].houses,
    poolAmount: ALLIANCE_PRIZE_POOL,
    qualifiedCount: qualifiedUids.length,
    perMemberAmount,
    paidAt: Date.now(),
  });
}
```

### 7.4. Mở rộng payload `op: 'cup'` trả về cho Client
Thêm object `allianceReward` vào phản hồi `op: 'cup'` để **Pop-up Cúp 4 Nhà**, **Tab Cúp Nhà** và **Quầy Gringotts** hiển thị chính xác trạng thái `Bắt đầu 17:00 Thứ Sáu` (khi đang trước 17:00 hoặc khung nghỉ `16:00–17:00`) hoặc `Kết thúc 16:00 Thứ Sáu` (khi đang trong kỳ đua), cùng số ván (`X/5 ván`), ước tính Galleons/người và kết quả kỳ trước:

```json
{
  "allianceReward": {
    "enabled": true,
    "poolAmount": 200000,
    "minGamesAnyMinigame": 5,
    "startWeekdayVn": 5,
    "startHourVn": 17,
    "payoutWeekdayVn": 5,
    "payoutHourVn": 16,
    "cycleKey": "2026-11-27",
    "seasonStartsAt": 1795168800000,
    "nextPayoutAt": 1795770000000,
    "qualifiedCount": 8,
    "estimatedPerMember": 25000,
    "memberBestPlays": 5,
    "memberBestDiscipline": "match3",
    "memberQualified": true,
    "lastPayout": {
      "cycleKey": "2026-11-20-launch",
      "allianceNameVi": "Liên Minh Lửa & Trí",
      "houses": ["Ravenclaw", "Gryffindor"],
      "poolAmount": 200000,
      "qualifiedCount": 8,
      "perMemberAmount": 25000,
      "paidAt": 1795154400000
    }
  }
}
```

---

## 8. Trao Thưởng Khung Bong Bóng Mạng Floo Cùng Lúc Chốt Sổ 16:00 Thứ Sáu (Hạn 7 Ngày = 168 Giờ)

> [!IMPORTANT]
> **BẮT BUỘC — BỎ HOÀN TOÀN `alliance-cup` CŨ, THAY THẾ BẰNG BỘ 6 CÚP LIÊN MINH RIÊNG BIỆT:**
> - **BỎ HOÀN TOÀN khung/cúp `alliance-cup` cũ:** Gỡ triệt để key `'alliance-cup'` khỏi `LEGENDARY_FRAMES` (`ShoutMessageRow.ts`), `itemAppearanceKeys.json`, `gringotts-appearance-slots.js`, khối CSS trong `20-store-appearance.css` và **xoá sạch** ảnh `cup-winged.webp` / `cup-winged-2x.webp` / PNG fallback cũ. **Không giữ fallback, không ánh xạ ngược và không phát lại cúp `alliance-cup` cũ dưới bất kỳ hình thức nào.**
> - **THAY THẾ HOÀN TOÀN bằng bộ 6 Cúp Liên Minh riêng biệt:** `alliance-anh-duong`, `alliance-nguyet-anh`, `alliance-lua-va-tri`, `alliance-ngoc-rung`, `alliance-song-hung`, `alliance-tinh-tu`.
> - **Quy tắc trao thưởng chốt tuần (`16:00 Thứ Sáu` giờ VN / UTC+7):** Kết thúc tuần Cúp Nhà, **Liên Minh nào đạt Hạng 1 sẽ được trao đúng Cúp Liên Minh tương ứng với cặp 2 Nhà của Liên Minh đó** (ví dụ: `Gryffindor + Hufflepuff` đạt Hạng 1 → trao `alliance-anh-duong`; `Slytherin + Ravenclaw` đạt Hạng 1 → trao `alliance-nguyet-anh`; `Gryffindor + Ravenclaw` → `alliance-lua-va-tri`; `Slytherin + Hufflepuff` → `alliance-ngoc-rung`; `Gryffindor + Slytherin` → `alliance-song-hung`; `Ravenclaw + Hufflepuff` → `alliance-tinh-tu`).

Ngay trong cùng job chốt sổ Cúp Tuần lúc **`16:00 Thứ Sáu` (UTC+7 / giờ Việt Nam)** (`payoutHouseCupAllianceWeekly`), ngoài việc chia quỹ `200.000 Galleons`, server phát **khung bong bóng Mạng Floo** có thời hạn chuẩn **`7 ngày (168 giờ)`** tính từ đúng mốc chốt sổ **`16:00 Thứ Sáu`** (`cycleKey`) đến `16:00 Thứ Sáu` tuần kế tiếp, gồm **đúng 1 Cúp Liên Minh tương ứng cặp 2 Nhà Hạng 1 (trong bộ 6 Cúp Liên Minh mới)** và **6 khung Quán Quân Hạng 1 của 6 mini-game**:

### 8.1. Quy tắc trao thưởng chốt
1. **Bộ 6 Cúp Liên Minh Nhà Thắng Cúp Tuần *(bỏ hoàn toàn và thay thế triệt để `"alliance-cup"` cũ)*:**
   - **Tài nguyên & CSS chuẩn `LEGENDARY_FRAMES` / iOS Safari 16+**: `docs/handoff/alliance-cup/` và 6 tệp WebP phẳng `< 12 KB` trong `public/paintings/floo-items/alliance-cup/`.
   - **Quy tắc ánh xạ 1:1 khi chốt tuần `16:00 Thứ Sáu` giờ VN:** **Liên Minh nào đạt Hạng 1 sẽ được trao đúng Cúp Liên Minh tương ứng với cặp 2 Nhà của Liên Minh đó** (tuyệt đối không phát lại `"alliance-cup"` cũ):
     - `Gryffindor + Hufflepuff` (**Liên Minh Ánh Dương**) đạt Hạng 1 → trao `"alliance-anh-duong"`
     - `Slytherin + Ravenclaw` (**Liên Minh Nguyệt Ảnh**) đạt Hạng 1 → trao `"alliance-nguyet-anh"`
     - `Gryffindor + Ravenclaw` (**Liên Minh Lửa & Trí**) đạt Hạng 1 → trao `"alliance-lua-va-tri"`
     - `Slytherin + Hufflepuff` (**Liên Minh Ngọc Rừng**) đạt Hạng 1 → trao `"alliance-ngoc-rung"`
     - `Gryffindor + Slytherin` (**Liên Minh Song Hùng**) đạt Hạng 1 → trao `"alliance-song-hung"`
     - `Ravenclaw + Hufflepuff` (**Liên Minh Tinh Tú**) đạt Hạng 1 → trao `"alliance-tinh-tu"`
   - **Đối tượng nhận**: **Đúng danh sách `qualifiedUids`** ở §7.3 (các thành viên thuộc 2 Nhà trong Liên Minh đạt Hạng 1 đã đạt điều kiện **`>= 5` ván** ở bất kỳ 1 mini-game nào trong chu kỳ — không cấp cho thành viên 2 Nhà thắng chưa đạt `>= 5` ván). Nếu hòa tuyệt đối cả 2 Liên Minh, mỗi thành viên nhận đúng Cúp Liên Minh ứng với cặp 2 Nhà của Nhà mình.
   - **Thời hạn**: **`7 ngày (168 giờ)` tính từ `16:00 Thứ Sáu` (UTC+7)**.
   - **Bước dọn dẹp bắt buộc khi tích hợp vào `hpvn-archive.net`:** Gỡ triệt để key `'alliance-cup'` khỏi `LEGENDARY_FRAMES` (`ShoutMessageRow.ts`), `itemAppearanceKeys.json`, `gringotts-appearance-slots.js`, khối CSS trong `20-store-appearance.css`, và xoá sạch `cup-winged.webp` / `cup-winged-2x.webp` / PNG fallback cũ (**không giữ fallback hay phát lại cúp cũ**; xem chi tiết tại `docs/handoff/alliance-cup/HANDOFF_HPVN_FLOO.md`).
2. **6 Khung Quán Quân Hạng 1 Của 6 Mini-Game (`"champ-match3"`, `"champ-caro"`, `"champ-sudoku"`, `"champ-chess"`, `"champ-blocks"`, `"champ-jigsaw"`)**:
   - **Tài nguyên & CSS**: `public/paintings/floo-items/minigame-champions/`.
   - **Đối tượng nhận**: **Người giữ Hạng 1 cuối tuần** của từng bộ môn (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`) tại thời điểm chốt sổ **`16:00 Thứ Sáu` (UTC+7)**.
   - **Thời hạn**: **`7 ngày (168 giờ)` tính từ `16:00 Thứ Sáu` (UTC+7)** (giống hệt khung Liên Minh).
3. **Trường hợp đoạt nhiều khung trong cùng 1 tuần**:
   - Nếu 1 học sinh vừa thuộc `qualifiedUids` Liên Minh thắng vừa giữ Hạng 1 ở 1 hoặc nhiều mini-game, server cấp **đủ tất cả các lease khung tương ứng** trong menu **Biến hình** (`chat-frame-lease`) để học sinh tự chọn đeo khung mình thích.

### 8.2. Code mẫu cấp lease khung ngay sau bước chia Galleons (§7.3)

```js
const FLOO_FRAME_DURATION_HOURS = 168; // 7 ngày
const FLOO_FRAME_DURATION_MS = FLOO_FRAME_DURATION_HOURS * 60 * 60 * 1000;

// Thay thế hoàn toàn 'alliance-cup' cũ (tuyệt đối không fallback hay cấp lại 'alliance-cup')
const ALLIANCE_PAIR_TO_FRAME_KEY = {
  'Gryffindor+Hufflepuff': 'alliance-anh-duong',
  'Gryffindor+Ravenclaw': 'alliance-lua-va-tri',
  'Gryffindor+Slytherin': 'alliance-song-hung',
  'Hufflepuff+Ravenclaw': 'alliance-tinh-tu',
  'Hufflepuff+Slytherin': 'alliance-ngoc-rung',
  'Ravenclaw+Slytherin': 'alliance-nguyet-anh',
};

function resolveAllianceFrameKey(houses) {
  if (!Array.isArray(houses) || houses.length !== 2) return null;
  return ALLIANCE_PAIR_TO_FRAME_KEY[[...houses].sort().join('+')] || null;
}

/**
 * Gọi ngay trong payoutHouseCupAllianceWeekly() tại mốc chốt sổ 16:00 Thứ Sáu (UTC+7).
 * - cycleKey: 'YYYY-MM-DD' (Thứ Sáu chốt sổ, VD '2026-11-27')
 * - winningHouses: [houseA, houseB] của Liên Minh đạt Hạng 1 (hoặc cả 4 Nhà nếu hòa tuyệt đối)
 * - alliances: danh sách 2 Liên Minh tuần đó (để tra đúng Cúp Liên Minh nếu hòa tuyệt đối)
 * - qualifiedMembers: [{ uid, house }] — đúng danh sách thành viên thuộc Liên Minh Hạng 1 đạt >= 5 ván (§7.3)
 * - top1ByDiscipline: { match3?: uid, caro?: uid, sudoku?: uid, chess?: uid, blocks?: uid, jigsaw?: uid }
 */
async function grantWeeklyFlooFrames(db, { cycleKey, winningHouses, alliances, qualifiedMembers, top1ByDiscipline }) {
  const grantedAtMs = Date.parse(`${cycleKey}T16:00:00+07:00`) || Date.now();
  const expiresAtMs = grantedAtMs + FLOO_FRAME_DURATION_MS;
  const primaryAllianceFrame = resolveAllianceFrameKey(winningHouses.slice(0, 2));

  const grants = [];

  // 1. Trao đúng 1 trong 6 Cúp Liên Minh tương ứng cặp 2 Nhà đạt Hạng 1 (không phát 'alliance-cup' cũ)
  for (const m of qualifiedMembers) {
    const memberAlliance = Array.isArray(alliances)
      ? alliances.find((a) => Array.isArray(a.houses) && a.houses.includes(m.house))
      : null;
    const frameKey = memberAlliance
      ? resolveAllianceFrameKey(memberAlliance.houses)
      : primaryAllianceFrame;
    if (!frameKey) continue;
    grants.push({
      uid: m.uid,
      frameKey,
      leaseId: `house_cup_${frameKey}_${cycleKey}_${m.uid}`,
      reason: 'house_cup_alliance_weekly_frame',
    });
  }

  // 2. 6 Khung Top 1 cho người giữ Hạng 1 cuối tuần mỗi bộ môn
  for (const disc of CUP_DISCIPLINES) {
    const champUid = top1ByDiscipline?.[disc];
    if (!champUid) continue;
    grants.push({
      uid: champUid,
      frameKey: `champ-${disc}`,
      leaseId: `house_cup_top1_${disc}_${cycleKey}_${champUid}`,
      reason: `house_cup_top1_${disc}_weekly_frame`,
    });
  }

  // Ghi idempotent theo leaseId (theo lô 400 doc/batch) để cron chạy lại không cấp trùng
  for (let i = 0; i < grants.length; i += 400) {
    const batch = db.batch();
    for (const g of grants.slice(i, i + 400)) {
      // Thay bằng collection/helper cấp chat-frame-lease thực tế của repo hpvn-archive.net
      batch.set(
        db.collection('users').doc(g.uid).collection('flooFrameLeases').doc(g.leaseId),
        {
          frameKey: g.frameKey,
          cycleKey,
          reason: g.reason,
          grantedAtMs,
          expiresAtMs,
          durationHours: FLOO_FRAME_DURATION_HOURS,
        },
        { merge: true },
      );
    }
    await batch.commit();
  }
}
```

---

## 9. Chia Thưởng Liền Cho Liên Minh Hiện Tại (`Ravenclaw` + `Gryffindor`) — Chạy Ngay 1 Lần

Dùng để **chia thưởng ngay lập tức** quỹ **`200.000 Galleons`** cho **Liên Minh Lửa & Trí (`Ravenclaw` + `Gryffindor`)** đang đứng Hạng 1 hiện tại mà không cần chờ tới chu kỳ tuần sau:

- **2 Nhà nhận thưởng:** `['Ravenclaw', 'Gryffindor']` (**Liên Minh Lửa & Trí**).
- **Quỹ thưởng:** **`200.000 Galleons`** chia đều (`Math.floor(200_000 / qualifiedUids.length)`) cộng thẳng vào ví `users/{uid}.galleons`.
- **Điều kiện lọc từng thành viên (chạy ngay trước khi `weeklyPlaysByDiscipline` thu thập đủ cả tuần):**
  - Thuộc Nhà `Ravenclaw` hoặc `Gryffindor`.
  - Đã chơi ít nhất **`5` ván của 1 mini game bất kỳ** (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`), ưu tiên lấy từ `cup.weeklyPlaysByDiscipline`; nếu thành viên chưa lưu sau khi bật patch §7.2 thì tự fallback đọc từ `save` JSON hiện có (`extractPlayedByDiscipline(saveObj)`, tức `Math.max(minigamePlays[d], cleared[d]) >= 5`).
- **Tách bạch hoàn toàn với mùa mới khai màn 17:00 Thứ Sáu (`2026-11-20 17:00` → `2026-11-27 16:00`):**
  - Dùng khóa idempotent riêng `'2026-11-20-launch'` (`houseCupAlliancePayouts/2026-11-20-launch`) để phát ngay 1 lần cho Liên Minh `Ravenclaw + Gryffindor` hiện tại; kỳ đua tự động đầu tiên bắt đầu tính điểm lúc **`17:00 Thứ Sáu 20/11/2026`** và chốt thưởng lúc **`16:00 Thứ Sáu 27/11/2026`** (`cycleKey = '2026-11-27'`).
  - Luôn chạy với `DRY_RUN = true` trước để kiểm tra danh sách thành viên + số Galleons/người, sau đó đổi `DRY_RUN = false` để phát thưởng thật.

```js
/**
 * Script / admin callable chạy 1 lần: chia thưởng liền 200.000 Galleons cho Liên Minh hiện tại (Ravenclaw + Gryffindor).
 * Bước 1: chạy với { dryRun: true } để xem trước danh sách thành viên đủ điều kiện & mức chia/người.
 * Bước 2: chạy với { dryRun: false } để cộng thẳng vào users/{uid}.galleons (idempotent theo cycleKey).
 */
async function payoutCurrentRavGryAllianceNow(
  db,
  {
    cycleKey = '2026-11-20-launch', // khóa riêng cho đợt chia thưởng liền, không đụng kỳ đầu chốt lúc 16:00 ngày 27/11
    poolAmount = 200_000,
    minGames = 5,
    alsoGrantAllianceFrame = true,
    dryRun = true,
  } = {}
) {
  const TARGET_HOUSES = ['Ravenclaw', 'Gryffindor'];
  const ALLIANCE_NAME_VI = 'Liên Minh Lửa & Trí';
  const payoutRef = db.collection('houseCupAlliancePayouts').doc(cycleKey);

  // 1. Kiểm tra khóa chống phát trùng
  const existing = await payoutRef.get();
  if (existing.exists) {
    return { skipped: true, reason: 'already_paid', cycleKey, existing: existing.data() };
  }

  // 2. Lấy tất cả thành viên có farm thuộc Ravenclaw hoặc Gryffindor
  const memberSnaps = await db
    .collection('farmMembers')
    .where('house', 'in', TARGET_HOUSES)
    .get();

  const qualified = [];
  memberSnaps.forEach((doc) => {
    const data = doc.data() || {};
    const weeklyPlays = data?.cup?.weeklyPlaysByDiscipline;
    let playsMap = null;

    if (weeklyPlays && typeof weeklyPlays === 'object') {
      const hasWeeklyData = CUP_DISCIPLINES.some((d) => (Number(weeklyPlays[d]) || 0) > 0);
      if (hasWeeklyData) playsMap = weeklyPlays;
    }
    // Fallback cho các thành viên chơi trước khi patch §7.2 kịp deploy: đọc trực tiếp từ JSON save hiện có
    if (!playsMap && typeof data.save === 'string' && data.save.length > 0) {
      try {
        playsMap = extractPlayedByDiscipline(JSON.parse(data.save));
      } catch {
        playsMap = null;
      }
    }

    let bestDisc = null;
    let bestPlays = 0;
    if (playsMap) {
      for (const disc of CUP_DISCIPLINES) {
        const cnt = Math.max(0, Math.floor(Number(playsMap[disc]) || 0));
        if (cnt > bestPlays) {
          bestPlays = cnt;
          bestDisc = disc;
        }
      }
    }

    if (bestPlays >= minGames) {
      qualified.push({
        uid: doc.id,
        house: data.house,
        bestDisc,
        bestPlays,
      });
    }
  });

  const qualifiedUids = qualified.map((m) => m.uid);
  const perMemberAmount = qualifiedUids.length > 0 ? Math.floor(poolAmount / qualifiedUids.length) : 0;

  if (dryRun) {
    return {
      dryRun: true,
      cycleKey,
      allianceNameVi: ALLIANCE_NAME_VI,
      houses: TARGET_HOUSES,
      poolAmount,
      qualifiedCount: qualifiedUids.length,
      perMemberAmount,
      remainder: poolAmount - perMemberAmount * qualifiedUids.length,
      members: qualified,
    };
  }

  // 3. Khóa idempotent trước khi cộng tiền
  const locked = await db.runTransaction(async (tx) => {
    const snap = await tx.get(payoutRef);
    if (snap.exists) return false;
    tx.set(payoutRef, {
      status: 'processing',
      mode: 'immediate_manual_rav_gry',
      cycleKey,
      allianceNameVi: ALLIANCE_NAME_VI,
      houses: TARGET_HOUSES,
      startedAt: FieldValue.serverTimestamp(),
    });
    return true;
  });
  if (!locked) {
    return { skipped: true, reason: 'already_locked', cycleKey };
  }

  if (qualifiedUids.length === 0) {
    await payoutRef.set({
      status: 'skipped_no_qualified_members',
      mode: 'immediate_manual_rav_gry',
      cycleKey,
      allianceNameVi: ALLIANCE_NAME_VI,
      houses: TARGET_HOUSES,
      poolAmount,
      qualifiedCount: 0,
      perMemberAmount: 0,
      paidAt: Date.now(),
    });
    return { paid: false, cycleKey, qualifiedCount: 0, perMemberAmount: 0 };
  }

  // 4. Cộng thẳng Galleons cho từng thành viên đủ điều kiện (theo lô 400 doc/batch)
  for (let i = 0; i < qualifiedUids.length; i += 400) {
    const batch = db.batch();
    for (const uid of qualifiedUids.slice(i, i + 400)) {
      batch.update(db.collection('users').doc(uid), {
        galleons: FieldValue.increment(perMemberAmount),
      });
      batch.set(db.collection('gameAuditLogs').doc(), {
        uid,
        kind: 'house_cup_alliance_weekly_reward',
        mode: 'immediate_manual_rav_gry',
        cycleKey,
        allianceNameVi: ALLIANCE_NAME_VI,
        houses: TARGET_HOUSES,
        galleons: perMemberAmount,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
    await batch.commit();
  }

  // 5. (Tuỳ chọn) Cấp luôn khung Liên Minh tương ứng đúng cặp 2 Nhà (7 ngày = 168 giờ) cho danh sách qualifiedUids (§8.2)
  if (alsoGrantAllianceFrame) {
    await grantWeeklyFlooFrames(db, {
      cycleKey,
      winningHouses: TARGET_HOUSES, // tự phân giải ra 'alliance-lua-va-tri'
      qualifiedUids,
      top1ByDiscipline: {}, // truyền map top1ByDiscipline thực tế nếu muốn phát luôn 6 khung Top 1 môn
    });
  }

  // 6. Chốt biên lai để op:'cup' hiển thị ngay ở mục lastPayout & chặn cron hôm nay phát đúp
  const summary = {
    status: 'paid',
    mode: 'immediate_manual_rav_gry',
    cycleKey,
    allianceNameVi: ALLIANCE_NAME_VI,
    houses: TARGET_HOUSES,
    poolAmount,
    qualifiedCount: qualifiedUids.length,
    perMemberAmount,
    paidAt: Date.now(),
  };
  await payoutRef.set(summary);
  return { paid: true, ...summary, members: qualified };
}
```

---

## 9. Kiểm tra & đồng bộ đủ cả 6 game mini tính vào Cúp Nhà chung (Fix lỗi thiếu Dò Mìn `caro` & Bắn Cá `chess`)

### 9.1. Nguyên nhân gốc đã sửa phía Client
1. `src/sim/minigameLeaderboard.ts` trước đây vẫn giữ danh sách cũ chỉ 4 môn (`match3`, `sudoku`, `blocks`, `jigsaw`) từ trước khi thay Caro/Cờ Vua bằng **Dò Mìn Phép Thuật (`caro`)** & **Bắn Cá Hồ Đen (`chess`)**, thậm chí **tự xoá `minigameLeaderboard.records.caro` và `.chess` về `0`** trên mỗi lần nạp/lưu! Nay đã mở đủ cả **6 môn** (`['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw']`) cho BXH, Cúp Nhà và Proof-of-Play (vẫn giữ chốt an toàn chỉ đọc `caroCleared`/`chessCleared` khi `arcadeDisciplineRev >= 2`).
2. `src/sim/simulationTrials.ts` trước đây gọi `submitPlayerCloudLeaderboardEntry()` (`flushFarmSave()`) **trước** `sim.saveToStorage()`, khiến bản lưu chứa màn vừa thắng chưa kịp đưa vào hàng đợi và bị trễ 5 giây (và bỏ qua hẳn với `caro` / `chess`). Nay đã đảo chuẩn: luôn gọi `sim.saveToStorage()` xong mới `flushFarmSave()` ngay lập tức cho **cả 6 môn**.
3. `src/hpvn/houseCup.ts`: khi phản hồi `op: 'save'` chỉ trả số liệu thành viên (chưa kèm `houses`/`disciplines`), tự xóa cache 60 giây để lần mở Tab Cúp Nhà kế tiếp tải ngay bảng tổng 4 Nhà mới nhất.

### 9.2. Checklist bắt buộc kiểm tra trên máy chủ HPVN (`functions/games/trang-trai-hang-soc-boards.js`)
Nếu máy chủ HPVN vẫn còn danh sách 4 môn cũ từ bản ban đầu, **cần cập nhật cả `op: 'save'` (Cúp Nhà) lẫn `op: 'board'` (BXH) nhận đủ 6 mã bộ môn**:

| Mã môn | Tên hiển thị | Field số màn trong `save` JSON | Field kỷ lục trong `save` JSON | Lưu ý bắt buộc |
|---|---|---|---|---|
| `match3` | Bùa Gặt Honeydukes | `save.match3.maxClearedLevel` | `save.minigameLeaderboard.records.match3` | Trần `7777` |
| `caro` | Dò Mìn Phép Thuật | `save.puzzleArcade.caroCleared` | `save.minigameLeaderboard.records.caro` | Chỉ tính khi `save.puzzleArcade.arcadeDisciplineRev >= 2` |
| `sudoku` | Số Học Huyền Bí | `save.puzzleArcade.sudokuCleared` | `save.minigameLeaderboard.records.sudoku` | Trần `777` |
| `chess` | Bắn Cá Hồ Đen | `save.puzzleArcade.chessCleared` | `save.minigameLeaderboard.records.chess` | Chỉ tính khi `save.puzzleArcade.arcadeDisciplineRev >= 2` |
| `blocks` | Sinh Vật Huyền Bí | **`save.puzzleArcade.blockCleared`** | `save.minigameLeaderboard.records.blocks` | Chú ý tên field số ít **`blockCleared`** (không phải `blocksCleared`) |
| `jigsaw` | Tranh Ghép Phép Thuật | `save.puzzleArcade.jigsawCleared` | `save.minigameLeaderboard.records.jigsaw` | Trần `777` |

```js
// Đảm bảo danh sách whitelist cho CẢ op: 'board' và op: 'save' / op: 'cup' đều có đủ 6 môn:
const SCORED_BOARD_GAMES = ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw'];
```

### 9.3. Fix bắt buộc phía Máy chủ cho lỗi «Bắn Cá / Dò Mìn chơi qua màn nhưng không ghi nhận trên bảng điểm Nhà»

Có **3 lỗi thực tế trên `functions/games/trang-trai-hang-soc-boards.js`** khiến người chơi qua màn **Bắn Cá Hồ Đen (`chess`)** (và **Dò Mìn (`caro`)**) bị ghi `0 đ` trên bảng điểm Nhà — cần kiểm tra & vá đủ cả 3:

1. **Kẹt mốc cũ `lastClearedByDiscipline.chess` từ game Cờ Phù Thủy cũ (trước `arcadeDisciplineRev = 2`):**
   - Trước khi đổi **Cờ Phù Thủy (`chess`) → Bắn Cá Hồ Đen (`chess`)** và **Caro (`caro`) → Dò Mìn (`caro`)**, nhiều tài khoản đã có sẵn `memberCup.lastClearedByDiscipline.chess = N` (VD `N = 10` hoặc `30`) trên Firestore.
   - Khi client nâng lên `arcadeDisciplineRev = 2`, client đã reset `save.puzzleArcade.chessCleared = 0`, `chessStage = 1`.
   - Nếu máy chủ **không** kiểm tra `memberCup.arcadeDisciplineRev < 2` để reset `lastClearedByDiscipline.chess = 0` & `lastPlayedByDiscipline.chess = 0`, thì mọi màn Bắn Cá từ Màn `1 → N` đều bị tính `delta = Math.max(0, nextCleared - N) = 0` → **không cộng 1 điểm nào cho Nhà**!
2. **Nuốt màn đầu tiên khi khởi tạo môn mới (`?? nextCleared[disc]` thay vì `?? 0`):**
   - Với người chơi cũ chưa từng có key `chess` trong `memberCup.lastClearedByDiscipline`, tuyệt đối **không** khởi tạo `prev = memberCup.lastClearedByDiscipline?.chess ?? nextCleared.chess` (vì lần lưu thắng Màn 1 sẽ thành `1 - 1 = 0`). Phải khởi tạo bằng `0`!
3. **Danh sách `CUP_DISCIPLINES` thiếu `'chess'` hoặc đọc nhầm tên field (`fishingCleared` thay vì `chessCleared`):**
   - Trong Save JSON, Bắn Cá Hồ Đen vẫn dùng key lịch sử `save.puzzleArcade.chessCleared` (chỉ đọc khi `arcadeDisciplineRev >= 2`).

**Patch drop-in gọi ngay đầu `op: 'save'` (TRƯỚC vòng `for (const disc of CUP_DISCIPLINES)` tính delta ở §6.2 & §7.2):**

```js
const CURRENT_ARCADE_DISCIPLINE_REV = 2;

function reconcileMemberCupDisciplineRevision(memberCup, saveObj) {
  const saveRev = Math.floor(Number(saveObj?.puzzleArcade?.arcadeDisciplineRev) || 0);
  const memberRev = Math.floor(Number(memberCup.arcadeDisciplineRev) || 0);

  // Khi thành viên lần đầu lưu với save đã migrate sang Dò Mìn & Bắn Cá (rev >= 2):
  // reset mốc cũ của Caro / Cờ Phù Thủy về 0 để các màn Bắn Cá/Dò Mìn từ Màn 1 đều được cộng điểm!
  if (saveRev >= CURRENT_ARCADE_DISCIPLINE_REV && memberRev < CURRENT_ARCADE_DISCIPLINE_REV) {
    memberCup.lastClearedByDiscipline = {
      ...(memberCup.lastClearedByDiscipline || {}),
      caro: 0,
      chess: 0,
    };
    memberCup.lastPlayedByDiscipline = {
      ...(memberCup.lastPlayedByDiscipline || {}),
      caro: 0,
      chess: 0,
    };
    memberCup.arcadeDisciplineRev = CURRENT_ARCADE_DISCIPLINE_REV;
  }

  // Khởi tạo mốc = 0 cho mọi môn mới mở trong CUP_DISCIPLINES (không lấy nextCleared làm mốc ban đầu)
  memberCup.lastClearedByDiscipline = memberCup.lastClearedByDiscipline || {};
  memberCup.lastPlayedByDiscipline = memberCup.lastPlayedByDiscipline || {};
  for (const disc of CUP_DISCIPLINES) {
    if (memberCup.lastClearedByDiscipline[disc] === undefined) {
      memberCup.lastClearedByDiscipline[disc] = 0;
    }
    if (memberCup.lastPlayedByDiscipline[disc] === undefined) {
      memberCup.lastPlayedByDiscipline[disc] = 0;
    }
  }
}
```

> **Lưu ý kiểm tra nhanh trên Firestore:** Mở doc `farmMembers/{uid}` của tài khoản báo lỗi và kiểm tra 4 trường: (a) `cup.arcadeDisciplineRev` đã là `2` chưa, (b) `cup.lastClearedByDiscipline.chess` có đang lớn hơn `save.puzzleArcade.chessCleared` không, (c) `cup.weeklyClearedByDiscipline.chess` đã đạt ngưỡng **`>= 5` màn mới trong tuần** (luật Cách A §6.2) chưa, và (d) `gameHouseCupWeeks/{weekKey}.disciplines.chess` đã tồn tại key `'chess'` chưa.

---

## 10. Bảng Xếp Hạng Cá Nhân Từng Tuần (`op: 'board'`) Đồng Bộ 100% Với Cúp Nhà

Thay thế hoàn toàn BXH cá nhân tổng tích luỹ theo level (`bestStage` / `Màn 790`) sang **BXH cá nhân từng tuần** dùng chung đúng 1 nguồn dữ liệu **Cách A** & cùng chu kỳ tuần **`weekKey`** (`17:00 Thứ Sáu → 16:00 Thứ Sáu tuần kế tiếp`, ICT) với **Cúp 4 Nhà** và **6 Khung Quán Quân Top 1 (§8)**:

### 10.1. Thay đổi phía Client đã hoàn tất
- `src/hpvn/houseCup.ts`: đồng bộ mã tuần chuẩn `getActiveHouseCupWeekKey()` / `getHouseCupWeeklyCycle()` (cả chu kỳ Thứ Sáu 17:00 → Thứ Sáu kế tiếp 16:00 dùng chung 1 `weekKey` = tuần ISO của Thứ Sáu chốt sổ `endsAt`, ưu tiên `weekKey` từ server `op: 'cup'`).
- `src/sim/minigameLeaderboard.ts`:
  - Lưu & tự reset tiến độ tuần `records[game].weekly = { weekKey, stagesCleared, weightedScore, wins, bestStreak, bestSessionScore, updatedAt }` mỗi khi sang tuần mới (vẫn giữ nguyên `bestStage` tích luỹ để hiển thị ở tab **Kỷ Lục** và tương thích save cũ).
  - Xếp hạng cá nhân tuần theo **Điểm Tuần Cách A (`weeklyScore` / `ratingScore`) giảm dần**, hòa mới xét **Số Màn Vượt Mới Trong Tuần (`weeklyCleared` / `primaryValue`)**, tuyệt đối **không** xếp hạng theo level/màn tổng tích luỹ.
  - Tính `cupContributionPoints` (`+100 / +80 / +65 / +50 / +35 / +20 đ Nhà`, yêu cầu `>= 5` màn tuần) bằng đúng công thức đồng hạng Olympic của `rankAndScoreDisciplineFromWeeklyPlayers`.
  - Gọi `request('farm', { op: 'board', game, period: 'weekly', weekKey })` và tự động lọc bỏ dữ liệu tuần cũ (`entry.weekKey !== activeWeekKey`) hoặc phản hồi BXH tổng cũ (không có `period: 'weekly'`, `weekKey`, `weeklyScore`, `weeklyCleared`).
- `src/ui/leaderboardModal.ts`: hiển thị thanh `BXH Tuần <weekKey>` + đếm ngược chốt sổ `16:00 T6` đồng bộ `Cúp Nhà`, bục Top 3 & danh sách hiển thị `Điểm Tuần (đ)`, `X màn tuần` và `+Y đ Nhà` (hoặc `X/5 màn ghi điểm Nhà`).

### 10.2. Patch phía Máy chủ HPVN (`functions/games/trang-trai-hang-soc-boards.js` — `op: 'board'`)

Khi nhận `op: 'board'` với `{ game, period: 'weekly', weekKey }`:
1. Dùng đúng `activeWeekKey` của Cúp Nhà hiện tại (`getVietnamIsoWeekKey(sched.endsAt)` hoặc `weekKey` hiện hành của `gameHouseCupWeeks`).
2. Đọc tiến độ tuần của từng thành viên từ `memberCup` (nếu `memberCup.weekKey === activeWeekKey`) — **cùng đúng 2 trường `weeklyClearedByDiscipline[game]` & `weeklyWeightedScoreByDiscipline[game]` đã dùng để tính Cúp Nhà ở §6.2** (ai chưa vượt màn nào trong tuần này có điểm tuần `0`).
3. Sắp xếp giảm dần theo `weeklyScore` (`weeklyWeightedScore`), hòa thì `weeklyCleared`, hòa tiếp thì `weeklyWins`.
4. **Người đứng đầu (`entries[0]` có `weeklyCleared >= 1`) lúc `16:00 Thứ Sáu`** chính là `top1ByDiscipline[game]` nhận khung Quán Quân 7 ngày ở §8!

```js
// Trong handler op === 'board' (functions/games/trang-trai-hang-soc-boards.js):
async function handleWeeklyBoardOp(db, { game }) {
  if (!SCORED_BOARD_GAMES.includes(game)) {
    return { period: 'weekly', weekKey: '', entries: [] };
  }
  const sched = getAllianceWeeklyScheduleState(Date.now());
  const activeWeekKey = getVietnamIsoWeekKey(sched.endsAt);

  // Đọc danh sách thành viên có hoạt động trong tuần activeWeekKey (hoặc toàn bộ farmMembers đang có hồ sơ tuần này)
  const snaps = await db
    .collection('farmMembers')
    .where('cup.weekKey', '==', activeWeekKey)
    .get();

  const entries = [];
  snaps.forEach((doc) => {
    const data = doc.data() || {};
    if (data.sandboxTainted) return;
    const cup = data.cup || {};
    const weeklyCleared = Math.max(0, Math.floor(Number(cup.weeklyClearedByDiscipline?.[game]) || 0));
    const weeklyScore = Math.max(0, Math.floor(Number(cup.weeklyWeightedScoreByDiscipline?.[game]) || 0));
    const weeklyWins = Math.max(
      weeklyCleared,
      Math.floor(Number(cup.weeklyWinsByDiscipline?.[game] ?? cup.weeklyPlaysByDiscipline?.[game]) || 0)
    );
    if (weeklyCleared <= 0 && weeklyScore <= 0) return;

    const bestStage = Math.max(0, Math.floor(Number(cup.lastClearedByDiscipline?.[game]) || 0));
    const house = HOUSES.includes(data.house) ? data.house : 'Gryffindor';

    entries.push({
      userId: doc.id,
      name: data.displayName || data.parkName || 'Phù Thủy',
      parkName: data.parkName || 'Trang Trại Hang Sóc',
      friendCode: data.friendCode || '',
      avatarEmoji: '🧙',
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      house,
      weekKey: activeWeekKey,
      weeklyCleared,
      weeklyScore,
      weeklyWins,
      bestStage,
      // Đặt primaryValue & ratingScore bằng chính số liệu tuần để đồng nhất 100%
      primaryValue: weeklyCleared,
      ratingScore: weeklyScore,
      totalWins: weeklyWins,
      bestStreak: Math.max(0, Math.floor(Number(cup.weeklyBestStreakByDiscipline?.[game]) || 0)),
      detailLabelVi: `${weeklyCleared} màn tuần${bestStage > 0 ? ` • Màn ${bestStage}` : ''}`,
      updatedAt: Number(cup.updatedAtMs) || Date.now(),
    });
  });

  // Sắp xếp trùng khớp tuyệt đối với scoreDisciplineFromWeeklyPlayers (§6.2)
  entries.sort(
    (a, b) =>
      b.weeklyScore - a.weeklyScore ||
      b.weeklyCleared - a.weeklyCleared ||
      b.weeklyWins - a.weeklyWins ||
      a.updatedAt - b.updatedAt
  );

  return {
    period: 'weekly',
    weekKey: activeWeekKey,
    cycleKey: sched.cycleKey,
    entries: entries.slice(0, 100),
  };
}
```

### 10.3. Bảng «Xếp Hạng Tổng» Top 3 Mọi Thời Đại (`op: 'board'`, `period: 'all_time'`)

Tab **Bạn Bè** trong Bảng Xếp Hạng đã được đổi thành **Xếp Hạng Tổng** — xếp hạng **mọi thời đại** theo **tổng số màn chơi user đã vượt qua (`bestStage`)** (không giới hạn trong tuần `weekKey`), và **chỉ lấy đúng Top 3**.

Khi `op: 'board'` nhận `{ game, period: 'all_time', limit: 3 }`:

```js
async function handleAllTimeTop3BoardOp(db, { game, limit = 3 }) {
  if (!SCORED_BOARD_GAMES.includes(game)) {
    return { period: 'all_time', entries: [] };
  }
  const topLimit = Math.max(1, Math.min(3, Math.floor(Number(limit) || 3)));
  const snaps = await db.collection('farmMembers').get();

  const entries = [];
  snaps.forEach((doc) => {
    const data = doc.data() || {};
    if (data.sandboxTainted) return;
    const cup = data.cup || {};
    const rev = Math.floor(Number(cup.arcadeDisciplineRev) || 0);
    let bestStage = Math.max(0, Math.floor(Number(cup.lastClearedByDiscipline?.[game]) || 0));

    // Guard cho 2 môn đổi cơ chế (Dò Mìn caro & Bắn Cá chess): chỉ đọc màn khi arcadeDisciplineRev >= 2
    if ((game === 'caro' || game === 'chess') && rev < CURRENT_ARCADE_DISCIPLINE_REV) {
      bestStage = 0;
    }

    // Fallback đọc từ save JSON nếu lastClearedByDiscipline chưa được ghi
    if (bestStage <= 0 && typeof data.save === 'string' && data.save.length > 0) {
      try {
        const parsed = JSON.parse(data.save);
        bestStage = Math.max(0, Math.floor(Number(extractClearedByDiscipline(parsed)?.[game]) || 0));
      } catch {
        bestStage = 0;
      }
    }
    if (bestStage <= 0) return;

    const house = HOUSES.includes(data.house) ? data.house : 'Gryffindor';
    entries.push({
      userId: doc.id,
      name: data.displayName || data.parkName || 'Phù Thủy',
      parkName: data.parkName || 'Trang Trại Hang Sóc',
      friendCode: data.friendCode || '',
      avatarEmoji: '🧙',
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      house,
      bestStage,
      primaryValue: bestStage,
      ratingScore: bestStage,
      totalWins: bestStage,
      bestStreak: 0,
      detailLabelVi: `${bestStage} màn tích luỹ`,
      updatedAt: Number(cup.updatedAtMs || data.updatedAtMs) || Date.now(),
    });
  });

  entries.sort(
    (a, b) =>
      b.bestStage - a.bestStage ||
      b.totalWins - a.totalWins ||
      a.updatedAt - b.updatedAt
  );

  return {
    period: 'all_time',
    entries: entries.slice(0, topLimit),
  };
}
```

> **Điều phối trong `op === 'board'`:** Nếu `req.period === 'all_time'` gọi `handleAllTimeTop3BoardOp(db, req)`; ngược lại gọi `handleWeeklyBoardOp(db, req)`. Phía Client cũng tự tương thích ngược: nếu server chưa kịp triển khai nhánh `period: 'all_time'` (vẫn trả BXH tổng cũ hoặc BXH tuần có kèm `bestStage`), Client tự tách lấy `bestStage`, sắp xếp giảm dần và cắt đúng **Top 3**.

---

## 11. Phương Án F2 — Tổng Điểm Đóng Góp 6 Môn × Hệ Số Cân Bằng Quân Số Khóa Đầu Tuần (`mode: 'f2'`)

Để giải quyết triệt để tình trạng lệch quân số 2:1 giữa 2 Liên Minh trên quy mô cộng đồng thực tế **20–25 người/tuần** (vừa cân bằng 4 Nhà sai số `< 3.5%`, vừa **Phạt Newbie = `0%`**, mọi thành viên mới chơi `≥ 5` màn đều làm tổng điểm Liên Minh tăng ngay lập tức), máy chủ nâng cấp sang **`mode: 'f2'`**:

### 11.1. Quy tắc chốt (đã đồng bộ 1:1 với `src/hpvn/houseCup.ts`)
1. **Giữ nguyên Xoay vòng Liên Minh 3 cặp (`ALLIANCE_ROTATION` ở §5):** 4 Nhà tiếp tục xoay vòng đổi đồng đội đều nhau qua 3 tuần, không Nhà nào bị kẹt mãi một phe.
2. **Giữ nguyên xếp hạng cá nhân từng môn theo Cách A (§6):** Mỗi bộ môn trong 6 môn vẫn xếp hạng người chơi đạt `≥ 5` màn mới/tuần theo điểm độ khó (`20/25/30/35 đ/màn`) và cộng bậc điểm đóng góp `100 / 80 / 65 / 50 / 35 / 20` vào `weekDoc.disciplines[disc][house]`. *(Bản thân trần `100 đ/môn` đã chặn việc 1 người cày riêng 1 môn đè 5 môn còn lại.)*
3. **Bỏ nén nhị phân `100/75/50/25` — Tổng điểm mỗi Nhà = tổng điểm đóng góp trực tiếp 6 môn:**
   ```text
   houses[house] = Σ_{disc ∈ 6 môn} weekDoc.disciplines[disc][house]
   ```
4. **Hệ số Cân Bằng Quân Số khóa cứng ngay `17:00 Thứ Sáu` đầu tuần (`allianceBalance`):**
   - **Nguồn sĩ số (`houseActiveAvg`):** Trung bình trượt **`3` tuần gần nhất** (`ALLIANCE_ROSTER_WINDOW_WEEKS = 3`) số thành viên hoạt động của từng Nhà (tính những thành viên đã chơi `≥ 5` ván / đạt điều kiện tính điểm trong tuần đó; chỉ chia cho số tuần thực sự có dữ liệu `1..3`).
   - **Tuần đầu chưa có lịch sử (cold-start):** Nếu cả 2 Liên Minh đều có `activeAvg === 0`, cả 2 bên mặc định hệ số **`1.0×`**.
   - **Sàn sĩ số (`ALLIANCE_ROSTER_FLOOR = 4`):** `effectiveRoster = Math.max(4, activeAvg_h0 + activeAvg_h1)`.
   - **Trần hệ số (`ALLIANCE_MULTIPLIER_CAP = 2.5`):** Liên Minh đông hơn giữ hệ số `1.0`, Liên Minh ít người hơn nhận:
     ```text
     multiplier = round2(Math.min(2.5, effectiveRoster_đông / effectiveRoster_ít))
     ```
   - **Khóa cứng suốt tuần:** Tính đúng **1 lần duy nhất** khi khởi tạo document tuần `gameHouseCupWeeks/{weekKey}` (lúc `17:00` Thứ Sáu hoặc lần ghi đầu tiên của tuần đó) và lưu cố định trong `weekDoc.allianceBalance`. Nhờ khóa cố định, mọi thành viên mới tham gia giữa tuần chỉ có **cộng thêm điểm**, tuyệt đối không bao giờ làm giảm điểm Liên Minh.
5. **Điểm xếp hạng 2 Liên Minh (cả live `op: 'cup'` lẫn chốt thưởng `16:00` Thứ Sáu ở §7.3):**
   ```text
   rawPoints(alliance)    = houses[h0] + houses[h1]
   scaledPoints(alliance) = Math.round(rawPoints(alliance) * multiplier(alliance))
   ```
   Xếp hạng theo `scaledPoints` giảm dần → hòa xét số môn dẫn đầu `firstPlaceCount` → hòa tiếp xét `rawPoints`.

### 11.2. Code mẫu phía Máy chủ (`functions/games/trang-trai-hang-soc-boards.js`)

```js
const ALLIANCE_ROSTER_WINDOW_WEEKS = 3;
const ALLIANCE_ROSTER_FLOOR = 4;
const ALLIANCE_MULTIPLIER_CAP = 2.5;

function round2(v) {
  return Math.round(v * 100) / 100;
}

/** Tổng điểm F2 cho 4 Nhà: cộng trực tiếp điểm đóng góp từ 6 bộ môn (không nén 100/75/50/25). */
function computeF2HouseTotals(disciplines) {
  const houses = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  const firstPlaceCounts = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  for (const disc of CUP_DISCIPLINES) {
    const rawMap = disciplines?.[disc];
    if (!rawMap) continue;
    let maxVal = 0;
    for (const h of HOUSES) {
      const val = Math.max(0, Math.floor(Number(rawMap[h]) || 0));
      houses[h] += val;
      if (val > maxVal) maxVal = val;
    }
    if (maxVal > 0) {
      for (const h of HOUSES) {
        if (Math.max(0, Math.floor(Number(rawMap[h]) || 0)) === maxVal) {
          firstPlaceCounts[h] += 1;
        }
      }
    }
  }
  return { houses, firstPlaceCounts };
}

/**
 * Tính trung bình trượt 3 tuần gần nhất số thành viên hoạt động của từng Nhà
 * từ lịch sử `weekDoc.activeCountsByHouse` (được ghi khi chốt sổ 16:00 Thứ Sáu ở §7.3).
 */
async function computeHouseRollingActiveAvg(db, currentWeekKey, windowWeeks = ALLIANCE_ROSTER_WINDOW_WEEKS) {
  const snap = await db
    .collection('gameHouseCupWeeks')
    .orderBy('createdAt', 'desc')
    .limit(windowWeeks + 2)
    .get();

  const recentCounts = [];
  snap.forEach((doc) => {
    if (doc.id === currentWeekKey) return;
    const counts = doc.data()?.activeCountsByHouse;
    if (!counts || typeof counts !== 'object') return;
    const total = HOUSES.reduce((s, h) => s + Math.max(0, Number(counts[h]) || 0), 0);
    if (total > 0 && recentCounts.length < windowWeeks) {
      recentCounts.push(counts);
    }
  });

  const avg = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  if (recentCounts.length === 0) return avg;
  for (const h of HOUSES) {
    const sum = recentCounts.reduce((s, c) => s + Math.max(0, Number(c[h]) || 0), 0);
    avg[h] = round2(sum / recentCounts.length);
  }
  return avg;
}

/** Khóa cứng hệ số cân bằng quân số Liên Minh 1 lần duy nhất cho tuần `weekKey`. */
function buildLockedAllianceBalance(alliances, houseActiveAvg, lockedAt = Date.now()) {
  const [aSpec, bSpec] = alliances;
  const avgA = round2((houseActiveAvg[aSpec.houses[0]] || 0) + (houseActiveAvg[aSpec.houses[1]] || 0));
  const avgB = round2((houseActiveAvg[bSpec.houses[0]] || 0) + (houseActiveAvg[bSpec.houses[1]] || 0));
  const hasHistory = avgA > 0 || avgB > 0;
  const effA = hasHistory ? Math.max(ALLIANCE_ROSTER_FLOOR, avgA) : ALLIANCE_ROSTER_FLOOR;
  const effB = hasHistory ? Math.max(ALLIANCE_ROSTER_FLOOR, avgB) : ALLIANCE_ROSTER_FLOOR;

  let multA = 1;
  let multB = 1;
  if (hasHistory) {
    if (effA < effB) multA = round2(Math.min(ALLIANCE_MULTIPLIER_CAP, effB / effA));
    else if (effB < effA) multB = round2(Math.min(ALLIANCE_MULTIPLIER_CAP, effA / effB));
  }

  return {
    windowWeeks: ALLIANCE_ROSTER_WINDOW_WEEKS,
    rosterFloor: ALLIANCE_ROSTER_FLOOR,
    multiplierCap: ALLIANCE_MULTIPLIER_CAP,
    lockedAt,
    houseActiveAvg,
    byAlliance: {
      [aSpec.id]: { activeAvg: avgA, effectiveRoster: round2(effA), multiplier: multA },
      [bSpec.id]: { activeAvg: avgB, effectiveRoster: round2(effB), multiplier: multB },
    },
  };
}

/** Gắn điểm gốc & điểm sau nhân hệ số F2 vào `allianceBalance` để trả cho Client & chốt sổ §7.3. */
function computeF2RankedAlliances(disciplines, alliances, lockedBalance) {
  const { houses, firstPlaceCounts } = computeF2HouseTotals(disciplines);
  const byAlliance = {};
  const list = alliances.map((spec) => {
    const [h0, h1] = spec.houses;
    const rawPoints = (houses[h0] || 0) + (houses[h1] || 0);
    const entry = lockedBalance?.byAlliance?.[spec.id] || {
      activeAvg: 0,
      effectiveRoster: ALLIANCE_ROSTER_FLOOR,
      multiplier: 1,
    };
    const multiplier = Math.min(ALLIANCE_MULTIPLIER_CAP, Math.max(1, round2(Number(entry.multiplier) || 1)));
    const scaledPoints = Math.round(rawPoints * multiplier);
    byAlliance[spec.id] = {
      activeAvg: entry.activeAvg || 0,
      effectiveRoster: entry.effectiveRoster || ALLIANCE_ROSTER_FLOOR,
      multiplier,
      rawPoints,
      scaledPoints,
    };
    return {
      ...spec,
      rawPoints,
      multiplier,
      points: scaledPoints,
      firstPlaceCount: (firstPlaceCounts[h0] || 0) + (firstPlaceCounts[h1] || 0),
    };
  });

  list.sort(
    (a, b) =>
      b.points - a.points ||
      b.firstPlaceCount - a.firstPlaceCount ||
      b.rawPoints - a.rawPoints
  );

  return {
    houses,
    firstPlaceCounts,
    rankedAlliances: list,
    allianceBalance: {
      windowWeeks: lockedBalance?.windowWeeks || ALLIANCE_ROSTER_WINDOW_WEEKS,
      rosterFloor: lockedBalance?.rosterFloor || ALLIANCE_ROSTER_FLOOR,
      multiplierCap: lockedBalance?.multiplierCap || ALLIANCE_MULTIPLIER_CAP,
      lockedAt: lockedBalance?.lockedAt || Date.now(),
      houseActiveAvg: lockedBalance?.houseActiveAvg || { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 },
      byAlliance,
    },
  };
}
```

### 11.3. Điểm nối cần sửa trong `op: 'cup'` và `payoutHouseCupAllianceWeekly` (§7.3)
1. **Khi khởi tạo `gameHouseCupWeeks/{weekKey}` đầu tuần (nếu chưa có `weekDoc.allianceBalance`):**
   - Gọi `const avg = await computeHouseRollingActiveAvg(db, weekKey);`
   - Gọi `const lockedBalance = buildLockedAllianceBalance(alliances, avg);` và lưu cố định vào `weekDoc.allianceBalance` (cùng `createdAt: Date.now()`).
2. **Trong `op: 'cup'` (và `op: 'load'`):**
   - Gọi `const { houses, allianceBalance } = computeF2RankedAlliances(disciplines, alliances, weekDoc.allianceBalance);`
   - Trả về payload với **`mode: 'f2'`**, `unlimited: true`, `houses`, `disciplines`, `alliances`, `allianceBalance`, `allianceReward`.
3. **Trong job chốt sổ `16:00` Thứ Sáu (`payoutHouseCupAllianceWeekly` ở §7.3):**
   - Thay bước xếp hạng `rankedAlliances` cũ bằng `computeF2RankedAlliances(disciplines, alliances, weekDoc.allianceBalance).rankedAlliances` để xác định đúng Liên Minh thắng theo điểm F2 (`scaledPoints`).
   - Đồng thời ghi nhận tổng số thành viên hoạt động (`≥ 5` ván bất kỳ môn nào) của **cả 4 Nhà** trong tuần vừa kết thúc vào `weekDoc.activeCountsByHouse = { Gryffindor, Slytherin, Ravenclaw, Hufflepuff }` để làm đầu vào trung bình trượt 3 tuần cho tuần kế tiếp.

### 11.4. Ví dụ payload `op: 'cup'` chế độ F2
```json
{
  "weekKey": "2026-W48",
  "mode": "f2",
  "unlimited": true,
  "houses": {
    "Gryffindor": 640,
    "Slytherin": 560,
    "Ravenclaw": 495,
    "Hufflepuff": 335
  },
  "disciplines": {
    "match3": { "Gryffindor": 140, "Slytherin": 120, "Ravenclaw": 100, "Hufflepuff": 80 },
    "caro":   { "Gryffindor": 110, "Slytherin": 100, "Ravenclaw": 90,  "Hufflepuff": 60 },
    "sudoku": { "Gryffindor": 100, "Slytherin": 90,  "Ravenclaw": 80,  "Hufflepuff": 50 },
    "chess":  { "Gryffindor": 110, "Slytherin": 95,  "Ravenclaw": 85,  "Hufflepuff": 55 },
    "blocks": { "Gryffindor": 95,  "Slytherin": 85,  "Ravenclaw": 75,  "Hufflepuff": 45 },
    "jigsaw": { "Gryffindor": 85,  "Slytherin": 70,  "Ravenclaw": 65,  "Hufflepuff": 45 }
  },
  "allianceBalance": {
    "windowWeeks": 3,
    "rosterFloor": 4,
    "multiplierCap": 2.5,
    "lockedAt": 1795168800000,
    "houseActiveAvg": { "Gryffindor": 7, "Slytherin": 5, "Ravenclaw": 5, "Hufflepuff": 3 },
    "byAlliance": {
      "alliance_a": { "activeAvg": 12, "effectiveRoster": 12, "multiplier": 1,   "rawPoints": 1200, "scaledPoints": 1200 },
      "alliance_b": { "activeAvg": 8,  "effectiveRoster": 8,  "multiplier": 1.5, "rawPoints": 830,  "scaledPoints": 1245 }
    }
  }
}
```

---

## 12. Môn #7: Đua Nông Trại Derby (`derby` / `farmDerby`)

Mở rộng Cúp 4 Nhà từ 6 bộ môn mini-game sang **7 đấu trường song hành** (`HOUSE_CUP_ALL_DISCIPLINE_ORDER = ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'jigsaw', 'derby']`) để hoạt động làm nông nghiệp cốt lõi hằng ngày (thu hoạch ruộng, giao Đơn Cú, chế biến mẻ xưởng, đóng kiện Tàu Tốc Hành, đồng cỏ thú & combo nông trại) đóng góp trực tiếp vào Cúp Nhà cùng 6 mini-game.

Phía Client đã hoàn tất và phát hành khớp 100% tại:
- `src/sim/weeklyDerbyEngine.ts` (`MAX_WEEKLY_DERBY_TASKS = 7`, `MAX_WEEKLY_DERBY_BONUS_TASKS = 8`, `MAX_WEEKLY_DERBY_SCORE = 2500`, chu kỳ `weekKey` đồng bộ theo `getActiveHouseCupWeekKey()`).
- `src/hpvn/bridge.ts` (`extractFarmDerbySyncPayload(save)` tự trích xuất & kẹp biên trường `farmDerby` trong mỗi lần `op: 'save'`).
- `src/hpvn/houseCup.ts` (`HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS = 2500`, `HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS = 2`, `computeDerbyDisciplineHouseTotals(...)`, và `computeF2HouseTotals` / `computeDisciplineBracketTotals` tự duyệt đủ 7 môn `HOUSE_CUP_ALL_DISCIPLINE_ORDER`).

### 12.1. Field `farmDerby` Client tự gửi trong `op: 'save'`

Mỗi lần lưu nông trại (`flush()` trong `src/hpvn/bridge.ts`), khi save có trạng thái `weeklyDerby` hợp lệ, client tự đính kèm thêm trường **`farmDerby`** ở cấp cao nhất của payload `op: 'save'`:

```json
{
  "op": "save",
  "save": "<JSON string của nông trại>",
  "cup": 2,
  "farmDerby": {
    "weekKey": "2026-W48",
    "points": 845,
    "tasksCompleted": 3
  }
}
```

| Trường | Kiểu | Miền giá trị hợp lệ | Nguồn trên Client |
|---|---|---|---|
| `farmDerby.weekKey` | `string` | Trùng `activeWeekKey` (`YYYY-Www`, tối đa 32 ký tự) | `save.weeklyDerby.weekKey` (`getActiveHouseCupWeekKey()`) |
| `farmDerby.points` | `number` | Số nguyên `0..2500` | `save.weeklyDerby.points` (tổng điểm các nhiệm vụ Derby đã nộp trong tuần) |
| `farmDerby.tasksCompleted` | `number` | Số nguyên `0..8` | `save.weeklyDerby.tasksCompleted` (`7` nhiệm vụ chuẩn + tối đa `1` lượt thưởng) |

### 12.2. Hằng số & Kiểm duyệt Chống Gian Lận Phía Máy Chủ (`op: 'save'`)

Máy chủ **tuyệt đối không tin số liệu thô từ client** mà luôn xác thực và kẹp biên trên Firestore (`farmMembers/{uid}.cup.derby`):

- **`HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS = 2500`:** Kẹp cứng `points` vào đoạn `0..2500`.
- **`HOUSE_CUP_DERBY_MAX_WEEKLY_TASKS = 8`:** Kẹp cứng `tasksCompleted` vào đoạn `0..8` (`7` nhiệm vụ cơ bản + `1` nhiệm vụ thưởng).
- **`HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS = 2`:** Thành viên bắt buộc hoàn thành **`>= 2` nhiệm vụ Derby** (và có `points > 0`) trong đúng tuần `activeWeekKey` mới đủ điều kiện ghi điểm Nhà ở Môn #7.
- **Đơn điệu không giảm theo từng `weekKey`:** Trong cùng `activeWeekKey`, điểm & số nhiệm vụ lưu trên server chỉ tăng hoặc giữ nguyên (`nextPoints >= prevPoints`, `nextTasks >= prevTasks`); khi sang `activeWeekKey` mới tự reset về `0`.
- **Chặn nhảy cóc chống gian lận (anti-spike per save):** Điểm mỗi nhiệm vụ Derby trong `weeklyDerbyEngine.ts` dao động `140..320 đ`, nên kẹp mức tăng tối đa mỗi lần `op: 'save'` là **`HOUSE_CUP_DERBY_MAX_POINTS_DELTA_PER_SAVE = 640`** (tương đương tối đa 2 nhiệm vụ Hybrid cao nhất nộp liền nhau trong 1 cửa sổ debounce 5 giây) và **`HOUSE_CUP_DERBY_MAX_TASKS_DELTA_PER_SAVE = 2`** nhiệm vụ/lần lưu.
- **Khóa theo chu kỳ Cúp Nhà:** Chỉ nhận cập nhật khi `sched.phase === 'active'` (`17:00 Thứ Sáu → 16:00 Thứ Sáu tuần kế tiếp`, ICT) và `farmDerby.weekKey === activeWeekKey`. Bỏ qua các gói có `weekKey` khác `activeWeekKey` (tránh bơm điểm từ tuần cũ).

```js
const ALL_CUP_DISCIPLINES = [...CUP_DISCIPLINES, 'derby']; // 6 mini-game + Môn #7 Derby Nông Trại
const HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS = 2500;
const HOUSE_CUP_DERBY_MAX_WEEKLY_TASKS = 8; // 7 nhiệm vụ chuẩn + 1 lượt thưởng
const HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS = 2;
const HOUSE_CUP_DERBY_MAX_POINTS_DELTA_PER_SAVE = 640; // tối đa 2 nhiệm vụ 320đ/lần save
const HOUSE_CUP_DERBY_MAX_TASKS_DELTA_PER_SAVE = 2;

/**
 * Gọi trong op === 'save' khi sched.phase === 'active'.
 * Ưu tiên đọc req.farmDerby (hoặc fallback sang saveObj.weeklyDerby nếu cần).
 */
function applyFarmDerbySyncToMemberCup(memberCup, rawFarmDerby, activeWeekKey) {
  if (!rawFarmDerby || typeof rawFarmDerby !== 'object') return false;
  const incomingWeekKey = String(rawFarmDerby.weekKey || '').trim();
  if (!incomingWeekKey || incomingWeekKey !== activeWeekKey) return false;

  const incomingPoints = Math.max(
    0,
    Math.min(HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS, Math.floor(Number(rawFarmDerby.points) || 0))
  );
  const incomingTasks = Math.max(
    0,
    Math.min(HOUSE_CUP_DERBY_MAX_WEEKLY_TASKS, Math.floor(Number(rawFarmDerby.tasksCompleted) || 0))
  );

  const prev = memberCup.derby?.weekKey === activeWeekKey
    ? memberCup.derby
    : { weekKey: activeWeekKey, points: 0, tasksCompleted: 0 };

  // Đơn điệu không giảm trong cùng tuần + chặn anti-spike mỗi lần lưu
  const deltaPoints = Math.max(
    0,
    Math.min(HOUSE_CUP_DERBY_MAX_POINTS_DELTA_PER_SAVE, incomingPoints - (Number(prev.points) || 0))
  );
  const deltaTasks = Math.max(
    0,
    Math.min(HOUSE_CUP_DERBY_MAX_TASKS_DELTA_PER_SAVE, incomingTasks - (Number(prev.tasksCompleted) || 0))
  );

  const nextPoints = Math.min(HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS, (Number(prev.points) || 0) + deltaPoints);
  const nextTasks = Math.min(HOUSE_CUP_DERBY_MAX_WEEKLY_TASKS, (Number(prev.tasksCompleted) || 0) + deltaTasks);

  memberCup.derby = {
    weekKey: activeWeekKey,
    points: nextPoints,
    tasksCompleted: nextTasks,
    updatedAtMs: Date.now(),
  };
  return deltaPoints > 0 || deltaTasks > 0;
}
```

### 12.3. Công thức Xếp Hạng & Tính Điểm Nhà Môn #7 (`computeDerbyDisciplineHouseTotals`)

Tổng hợp **`weekDoc.disciplines.derby`** cho cả 4 Nhà bằng đúng thuật toán của `computeDerbyDisciplineHouseTotals` & `rankAndScoreDisciplineFromWeeklyPlayers` trong `src/hpvn/houseCup.ts` (dùng chung bậc điểm hạng **`100 / 80 / 65 / 50 / 35 / 20`** ở §6.2, đồng hạng kiểu Olympic):

```js
/**
 * Khớp 1:1 với computeDerbyDisciplineHouseTotals() trong src/hpvn/houseCup.ts.
 * - Chỉ tính thành viên thuộc 4 Nhà có weeklyDerbyTasks >= 2 và cappedScore > 0.
 * - Sắp xếp giảm dần theo cappedScore (0..2500), hòa xét weeklyDerbyTasks giảm dần.
 * - Đồng hạng Olympic trên cappedScore, cộng bậc hạng RANK_POINT_TIERS (100/80/65/50/35/20).
 */
function computeDerbyDisciplineHouseTotals(
  entries,
  minTasks = HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS,
  maxMemberScore = HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS,
  tiers = RANK_POINT_TIERS
) {
  const safeMinTasks = Math.max(1, Math.floor(Number(minTasks) || HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS));
  const safeMaxScore = Math.max(0, Math.floor(Number(maxMemberScore) || HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS));

  const eligible = entries
    .map((e) => ({
      house: e.house,
      weeklyDerbyTasks: Math.max(0, Math.floor(Number(e.weeklyDerbyTasks) || 0)),
      cappedScore: Math.min(safeMaxScore, Math.max(0, Math.floor(Number(e.weeklyDerbyScore) || 0))),
    }))
    .filter((e) => HOUSES.includes(e.house) && e.cappedScore > 0 && e.weeklyDerbyTasks >= safeMinTasks)
    .sort((a, b) => (b.cappedScore - a.cappedScore) || (b.weeklyDerbyTasks - a.weeklyDerbyTasks));

  const byHouse = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
  let activeRank = 0;
  let prevScore = -1;

  eligible.forEach((entry, idx) => {
    if (entry.cappedScore !== prevScore) {
      activeRank = idx + 1;
      prevScore = entry.cappedScore;
    }
    let pts = 20;
    for (const tier of tiers) {
      if (tier.maxRank === null || activeRank <= tier.maxRank) {
        pts = tier.points;
        break;
      }
    }
    if (pts > 0) byHouse[entry.house] += pts;
  });

  return byHouse;
}
```

- **Ghi vào `weekDoc.disciplines.derby`:** Sau khi tổng hợp từ toàn bộ thành viên có `cup.derby.weekKey === activeWeekKey` (bỏ qua tài khoản `sandboxTainted`), ghi trực tiếp `{ Gryffindor, Slytherin, Ravenclaw, Hufflepuff }` vào `weekDoc.disciplines.derby`.
- **Nối vào F2 (§11) & Chốt sổ 16:00 Thứ Sáu (§7.3):** Đổi vòng lặp trong `computeF2HouseTotals(disciplines)` (và `computeBracketHouses(disciplines)`) từ `CUP_DISCIPLINES` (6 môn) sang **`ALL_CUP_DISCIPLINES`** (`7` môn, gồm `'derby'`) để điểm Môn #7 cộng thẳng vào `houses` và `allianceBalance.byAlliance[*].rawPoints / scaledPoints`. *(Lưu ý: `SCORED_BOARD_GAMES` của BXH mini-game `op: 'board'` và 6 khung Quán Quân mini-game ở §8 vẫn giữ nguyên 6 mini-game; Derby đóng góp trực tiếp vào Cúp Nhà & Cúp Liên Minh.)*

### 12.4. Shape Phản Hồi `op: 'cup' | 'load' | 'save'` & Tương Thích Ngược 100%

Chỉ cần thêm trường `"derby"` vào trong object `disciplines` của payload `cup` (trả trong `op: 'cup'`, `op: 'load'` và tùy chọn trong `op: 'save'`):

```json
{
  "weekKey": "2026-W48",
  "mode": "f2",
  "unlimited": true,
  "houses": {
    "Gryffindor": 740,
    "Slytherin": 610,
    "Ravenclaw": 560,
    "Hufflepuff": 435
  },
  "disciplines": {
    "match3": { "Gryffindor": 140, "Slytherin": 120, "Ravenclaw": 100, "Hufflepuff": 80 },
    "caro":   { "Gryffindor": 110, "Slytherin": 100, "Ravenclaw": 90,  "Hufflepuff": 60 },
    "sudoku": { "Gryffindor": 100, "Slytherin": 90,  "Ravenclaw": 80,  "Hufflepuff": 50 },
    "chess":  { "Gryffindor": 110, "Slytherin": 95,  "Ravenclaw": 85,  "Hufflepuff": 55 },
    "blocks": { "Gryffindor": 95,  "Slytherin": 85,  "Ravenclaw": 75,  "Hufflepuff": 45 },
    "jigsaw": { "Gryffindor": 85,  "Slytherin": 70,  "Ravenclaw": 65,  "Hufflepuff": 45 },
    "derby":  { "Gryffindor": 100, "Slytherin": 50,  "Ravenclaw": 65,  "Hufflepuff": 100 }
  }
}
```

- **Tương thích ngược 100%:** Client hiện hành (`src/hpvn/houseCup.ts`) đã bật sẵn `'derby'` trong `VALID_DISCIPLINES` & `HOUSE_CUP_ALL_DISCIPLINE_ORDER`. Nếu backend **chưa** deploy Môn #7 và vẫn trả payload `disciplines` 6 môn cũ (không có key `"derby"`), client tự bỏ qua nhánh `"derby"` và vận hành bình thường không lỗi; ngay khi backend bắt đầu trả `"derby"`, UI Cúp 4 Nhà tự động hiển thị hàng **Môn #7: Derby Nông Trại** cùng tổng F2 mới.

### 12.5. Checklist Kiểm Chứng Backend (4 Mục Bắt Buộc)

1. **Xác thực `op: 'save'` + chống gian lận (`farmDerby`):** Gửi payload giả mạo `{ weekKey: activeWeekKey, points: 9999, tasksCompleted: 42 }` → server chỉ tăng tối đa `+640 đ` & `+2` nhiệm vụ mỗi lần lưu, không vượt trần `2500 đ` & `8` nhiệm vụ, giữ đơn điệu không giảm trong cùng `weekKey`, và bỏ qua gói có `weekKey !== activeWeekKey` hoặc gửi ngoài khung `sched.phase === 'active'`.
2. **Ngưỡng đủ điều kiện & đồng hạng Olympic (`computeDerbyDisciplineHouseTotals`):** Thành viên có `tasksCompleted = 1` (dù `points = 2500`) hoặc `points = 0` (dù `tasksCompleted = 3`) nhận **`0 đ Nhà`**; hai thành viên cùng đạt trần `2500 đ` (và `>= 2` nhiệm vụ) đồng Hạng 1 (`+100 đ` mỗi Nhà), người kế tiếp xếp Hạng 3 (`+65 đ`).
3. **Đồng bộ điểm tổng F2 & chốt thưởng `16:00 Thứ Sáu`:** Xác nhận `weekDoc.disciplines.derby` được trả về trong `op: 'cup'` / `op: 'load'` / `op: 'save'`, cộng đúng vào `houses` (tổng 7 môn), phản ánh vào `allianceBalance.byAlliance[*].rawPoints` & `scaledPoints`, và được dùng thống nhất trong `payoutHouseCupAllianceWeekly()` khi chọn Liên Minh Hạng 1.
4. **Tương thích ngược 6 môn & chuyển tuần mới:** Xác nhận payload `disciplines` chưa có `"derby"` vẫn không lỗi client/server; khi bước sang `activeWeekKey` tuần mới (`17:00 Thứ Sáu`), `memberCup.derby` reset sạch về `0` điểm / `0` nhiệm vụ và không mang điểm Derby tuần cũ sang tuần mới.



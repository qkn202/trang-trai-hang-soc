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

---

## 7. Thưởng 200.000 Galleons Cho Liên Minh Đứng #1 Cúp Nhà Mỗi 17:00 Thứ Sáu

Bổ sung cơ chế phát thưởng **Galleons** tự động hàng tuần từ máy chủ HPVN vào thẳng ví thành viên (`users/{uid}.galleons`):

- **Thời điểm chốt & trao thưởng:** **17:00 Thứ Sáu hàng tuần** theo giờ Việt Nam (`Asia/Ho_Chi_Minh`, `UTC+7` — cron `0 17 * * 5`).
- **Tổng quỹ thưởng:** **`200.000 Galleons`** (`ALLIANCE_WEEKLY_PRIZE_POOL_GALLEONS = 200_000`) **chia đều** cho toàn bộ thành viên đủ điều kiện thuộc **Liên Minh đứng Hạng 1 Cúp Nhà** (gồm cả 2 Nhà trong Liên Minh dẫn đầu):
  - `perMemberGalleons = Math.floor(200_000 / qualifiedUids.length)`
  - Ví dụ với 8–10 người chơi hợp lệ thuộc Liên Minh #1: mỗi người nhận **`20.000 – 25.000 Galleons`**.
- **Điều kiện nhận thưởng bắt buộc cho từng thành viên:** Phải **chơi ít nhất 5 ván của 1 mini game bất kỳ** trong chu kỳ tuần đó (`Math.max(...Object.values(weeklyPlaysByDiscipline)) >= 5` trên 6 môn `match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`). Không cộng dồn rải rác (ví dụ 2 ván Bùa Gặt + 3 ván Dò Mìn = chưa đạt; cần ít nhất 5 ván trong cùng 1 môn bất kỳ).

### 7.1. Mã chu kỳ Thứ Sáu 17:00 (`cycleKey`) — Giữ trọn lượt chơi cuối tuần
Để các ván chơi vào **tối Thứ Sáu, Thứ Bảy và Chủ Nhật** đều được tính vào kỳ chốt thưởng 17:00 Thứ Sáu kế tiếp (không bị "vùng chết cuối tuần"), dùng `cycleKey` là ngày Thứ Sáu sắp tới theo giờ Việt Nam (`YYYY-MM-DD`):

```js
const VN_UTC_OFFSET_MS = 7 * 3_600_000;
const DAY_MS = 86_400_000;
const ALLIANCE_PRIZE_POOL = 200_000;
const ALLIANCE_MIN_GAMES_ANY_MINIGAME = 5;

function getNextFridayPayoutTimeMs(nowMs = Date.now(), weekdayVn = 5, hourVn = 17) {
  const vnNowMs = nowMs + VN_UTC_OFFSET_MS;
  const d = new Date(vnNowMs);
  const daysAhead = (weekdayVn - d.getUTCDay() + 7) % 7;
  let candidateVn = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + daysAhead, hourVn, 0, 0, 0);
  if (candidateVn <= vnNowMs) candidateVn += 7 * DAY_MS;
  return candidateVn - VN_UTC_OFFSET_MS;
}

function getFridayPayoutCycleKey(nowMs = Date.now()) {
  const nextAt = getNextFridayPayoutTimeMs(nowMs, 5, 17);
  const vn = new Date(nextAt + VN_UTC_OFFSET_MS);
  return `${vn.getUTCFullYear()}-${String(vn.getUTCMonth() + 1).padStart(2, '0')}-${String(vn.getUTCDate()).padStart(2, '0')}`;
}
```

### 7.2. Ghi nhận số ván chơi hàng tuần trong `op: 'save'`
Client mới tự ghi bộ đếm tăng đơn điệu `saveObj.minigamePlays[disc]` sau mỗi ván thắng hoặc thua tự nhiên (không tính bấm thoát/chơi lại giữa chừng). Trong `op: 'save'`, server tính delta an toàn (tương thích cả client cũ qua `Math.max(plays, cleared)`):

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
const cycleKey = getFridayPayoutCycleKey(Date.now());
const nextPlayed = extractPlayedByDiscipline(nextSaveObj);
const prevPlayed = memberCup.lastPlayedByDiscipline || nextPlayed;
const weeklyPlays = memberCup.rewardCycleKey === cycleKey
  ? { ...(memberCup.weeklyPlaysByDiscipline || {}) }
  : { match3: 0, caro: 0, sudoku: 0, chess: 0, blocks: 0, jigsaw: 0 };

for (const disc of CUP_DISCIPLINES) {
  const delta = Math.max(0, Math.min(10, (nextPlayed[disc] || 0) - (prevPlayed[disc] || 0)));
  weeklyPlays[disc] = (weeklyPlays[disc] || 0) + delta;
}
memberCup.rewardCycleKey = cycleKey;
memberCup.weeklyPlaysByDiscipline = weeklyPlays;
memberCup.lastPlayedByDiscipline = nextPlayed;
```

### 7.3. Scheduled Function phát thưởng mỗi 17:00 Thứ Sáu (`0 17 * * 5`, `Asia/Ho_Chi_Minh`)

```js
// Firebase Functions v2: onSchedule({ schedule: '0 17 * * 5', timeZone: 'Asia/Ho_Chi_Minh' }, ...)
async function payoutHouseCupAllianceWeekly() {
  const nowMs = Date.now();
  // Ở thời điểm 17:00:xx Thứ Sáu, lùi 5 phút để lấy đúng cycleKey của Thứ Sáu hôm nay
  const cycleKey = getFridayPayoutCycleKey(nowMs - 5 * 60_000);
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
Thêm object `allianceReward` vào phản hồi `op: 'cup'` để **Pop-up Cúp 4 Nhà**, **Tab Cúp Nhà** và **Quầy Gringotts** hiển thị đếm ngược tới 17:00 Thứ Sáu, số ván của thành viên (`X/5 ván`), ước tính Galleons/người và kết quả kỳ trước:

```json
{
  "allianceReward": {
    "enabled": true,
    "poolAmount": 200000,
    "minGamesAnyMinigame": 5,
    "payoutWeekdayVn": 5,
    "payoutHourVn": 17,
    "cycleKey": "2026-11-20",
    "nextPayoutAt": 1795168800000,
    "qualifiedCount": 8,
    "estimatedPerMember": 25000,
    "memberBestPlays": 5,
    "memberBestDiscipline": "match3",
    "memberQualified": true,
    "lastPayout": {
      "cycleKey": "2026-11-13",
      "allianceNameVi": "Liên Minh Ánh Dương",
      "houses": ["Gryffindor", "Hufflepuff"],
      "poolAmount": 200000,
      "qualifiedCount": 8,
      "perMemberAmount": 25000,
      "paidAt": 1794564000000
    }
  }
}
```

---

## 8. Trao Thưởng Khung Bong Bóng Mạng Floo Cùng Lúc Chốt Sổ 17:00 Thứ Sáu (Hạn 7 Ngày = 168 Giờ)

Ngay trong cùng job chốt sổ Cúp Tuần lúc **`17:00 Thứ Sáu` (UTC+7 / giờ Việt Nam)** (`settleWeeklyAllianceReward`), ngoài việc chia quỹ `200.000 Galleons`, server phát thêm **7 khung bong bóng Mạng Floo** có thời hạn chuẩn **`7 ngày (168 giờ)`** tính từ đúng mốc `17:00 Thứ Sáu` (`cycleKey`) đến `17:00 Thứ Sáu` tuần kế tiếp:

### 8.1. Quy tắc trao thưởng chốt
1. **Khung Liên Minh Nhà Thắng Cúp Tuần (`"alliance-cup"`)**:
   - **Tài nguyên & CSS**: `public/paintings/floo-items/alliance-cup/` (Mẫu F — Gấm Hoàng Gia 4 Sắc + viền 4 màu lồng chỉ vàng kim + Đại Cúp Cánh Phượng đặt ngay giữa viền trên).
   - **Đối tượng nhận**: **Đúng danh sách `qualifiedUids`** ở §7.3 (các thành viên thuộc 2 Nhà trong Liên Minh thắng Cúp Tuần đã đạt điều kiện **`>= 5` ván** ở bất kỳ 1 mini-game nào trong chu kỳ — không cấp cho thành viên 2 Nhà thắng chưa đạt `>= 5` ván).
   - **Thời hạn**: **`7 ngày (168 giờ)` tính từ `17:00 Thứ Sáu` (UTC+7)**.
2. **6 Khung Quán Quân Hạng 1 Của 6 Mini-Game (`"champ-match3"`, `"champ-caro"`, `"champ-sudoku"`, `"champ-chess"`, `"champ-blocks"`, `"champ-jigsaw"`)**:
   - **Tài nguyên & CSS**: `public/paintings/floo-items/minigame-champions/`.
   - **Đối tượng nhận**: **Người giữ Hạng 1 cuối tuần** của từng bộ môn (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`) tại thời điểm chốt sổ **`17:00 Thứ Sáu` (UTC+7)**.
   - **Thời hạn**: **`7 ngày (168 giờ)` tính từ `17:00 Thứ Sáu` (UTC+7)** (giống hệt khung Liên Minh).
3. **Trường hợp đoạt nhiều khung trong cùng 1 tuần**:
   - Nếu 1 học sinh vừa thuộc `qualifiedUids` Liên Minh thắng vừa giữ Hạng 1 ở 1 hoặc nhiều mini-game, server cấp **đủ tất cả các lease khung tương ứng** trong menu **Biến hình** (`chat-frame-lease`) để học sinh tự chọn đeo khung mình thích.

### 8.2. Code mẫu cấp lease khung ngay sau bước chia Galleons (§7.3)

```js
const FLOO_FRAME_DURATION_HOURS = 168; // 7 ngày
const FLOO_FRAME_DURATION_MS = FLOO_FRAME_DURATION_HOURS * 60 * 60 * 1000;

/**
 * Gọi ngay trong settleWeeklyAllianceReward() tại mốc 17:00 Thứ Sáu (UTC+7).
 * - cycleKey: 'YYYY-MM-DD' (Thứ Sáu chốt sổ, VD '2026-11-20')
 * - qualifiedUids: đúng danh sách thành viên 2 Nhà thắng đạt >= 5 ván (§7.3)
 * - top1ByDiscipline: { match3?: uid, caro?: uid, sudoku?: uid, chess?: uid, blocks?: uid, jigsaw?: uid }
 *   (người giữ Hạng 1 cuối tuần của từng bộ môn tại thời điểm 17:00 Thứ Sáu)
 */
async function grantWeeklyFlooFrames(db, { cycleKey, qualifiedUids, top1ByDiscipline }) {
  const grantedAtMs = Date.parse(`${cycleKey}T17:00:00+07:00`);
  const expiresAtMs = grantedAtMs + FLOO_FRAME_DURATION_MS;

  const grants = [];

  // 1. Khung Liên Minh cho đúng danh sách qualifiedUids
  for (const uid of qualifiedUids) {
    grants.push({
      uid,
      frameKey: 'alliance-cup',
      leaseId: `house_cup_alliance_${cycleKey}_${uid}`,
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
- **Chống phát trùng với cron 17:00 Thứ Sáu hôm nay:**
  - Dùng đúng `cycleKey` của Thứ Sáu kỳ này (`'2026-11-20'`) cho doc khóa `houseCupAlliancePayouts/2026-11-20` → khi cron `0 17 * * 5` chạy lúc 17:00 cùng ngày sẽ thấy doc đã tồn tại và **tự bỏ qua không phát trùng**, sau đó tự động chạy tiếp kỳ mới vào **17:00 Thứ Sáu tuần kế tiếp (`2026-11-27`)**.
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
    cycleKey = getFridayPayoutCycleKey(Date.now()), // VD '2026-11-20' (trùng khóa cron hôm nay để không phát đúp)
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

  // 5. (Tuỳ chọn) Cấp luôn khung Liên Minh alliance-cup 7 ngày (168 giờ) cho đúng danh sách qualifiedUids (§8.2)
  if (alsoGrantAllianceFrame) {
    await grantWeeklyFlooFrames(db, {
      cycleKey,
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





# Handoff HPVN Backend — Bảo Mật Chống Gian Lận & Giám Sát Vận Hành (Production Hardening)

> **Phạm vi bàn giao (28/11/2026):** Tài liệu kỹ thuật hành động ngay cho đội backend HPVN (`functions/games/trang-trai-hang-soc-boards.js` & callable `trangTraiHangSoc`). Mọi trường dữ liệu phía client (`src/hpvn/bridge.ts`, `src/sim/proofOfPlay.ts`, `src/sim/economyIntegrity.ts`, `src/sim/bonusArcadeGames.ts`, `src/sim/weeklyDerbyEngine.ts`, `src/main.ts`) đã sẵn sàng và tương thích ngược 100%.

---

## 1. Xác Thực `ProofOfPlay` Phía Máy Chủ (`op: 'save'`)

Client đã tự động nén từng ván thắng của 6 môn xếp hạng (`match3`, `caro`, `sudoku`, `chess`, `blocks`, `jigsaw`) thành gói `ProofOfPlayEnvelope` (`< 1.2 KB/gói`, lưu trong RAM tối đa `16` gói, đính kèm tối đa **`8` gói/request** vào `proofOfPlays[]` trong payload `op: 'save'` tại `src/hpvn/bridge.ts:350-361`).

### 1.1. Cấu trúc payload `op: 'save'` hiện hành

```json
{
  "op": "save",
  "save": "<JSON string <= 1_000_000 bytes>",
  "cup": 2,
  "proofOfPlays": [
    {
      "v": 1,
      "gameId": "match3",
      "stage": 42,
      "seed": 3194821902,
      "nonce": "m8x4k2-9f1a0c",
      "startedAt": 1764300000000,
      "elapsedMs": 38420,
      "moveCount": 19,
      "stride": 1,
      "sessionScore": 14850,
      "chainHi": 2918471234,
      "chainLo": 812938471,
      "packedStepsHex": "0102003a..."
    }
  ],
  "farmDerby": {
    "weekKey": "2026-W48",
    "points": 620,
    "tasksCompleted": 3
  }
}
```

### 1.2. Quy trình xác thực trên server (Port nguyên bản từ `src/sim/proofOfPlay.ts`)

1. **Giới hạn lô & schema:** Chỉ đọc tối đa `8` phần tử đầu của `proofOfPlays` (`v === 1`, `gameId ∈ {'match3','caro','sudoku','chess','blocks','jigsaw'}`, `1 <= stage <= 7777`, `4 <= nonce.length <= 36`, `packedStepsHex` độ dài chia hết cho `8`, tối đa `128 * 8 = 1024` ký tự hex).
2. **Chống phát lại (`anti-replay`):** Lưu ring buffer `seenPopNonces` (tối đa `200` nonce gần nhất hoặc subcollection TTL `14` ngày theo `uid`). Nếu `nonce` đã tồn tại → từ chối với mã `replayed-nonce`, **không** cộng thêm tiến độ/điểm Cúp từ gói đó.
3. **Kiểm tra nhịp thao tác người thật & vật lý màn:**
   - Số nước tối thiểu `getMinMovesForStage(gameId)`: `match3: 1`, `caro: 1`, `sudoku: 3`, `chess: 2`, `blocks: 4`, `jigsaw: 4` (tối đa `200_000`).
   - Thời gian tối thiểu `getMinHumanElapsedMs(gameId, moveCount)`: từ `850 ms` (`match3`) đến `1800 ms` (`sudoku`), kẹp theo nhịp `120–160 ms/nước`.
   - Kiểm tra `packedStepsHex`: `stride === Math.max(1, Math.ceil(Math.min(moveCount, 4096) / 128))`, không có bước nào `dt16 === 0` (`bot-zero-cadence`), và `Math.abs(totalStepMs - elapsedMs) <= 2500` (khi `elapsedMs <= steps.length * 0xffff * 10`).
   - Trần điểm 1 ván `getMaxPlausibleSessionScore(gameId, stage)`:
     - `match3`: `320_000 + stage * 1_600`
     - `caro`: `85_000 + stage * 600`
     - `sudoku`: `45_000 + stage * 350`
     - `chess`: `260_000 + stage * 1_200`
     - `blocks`: `160_000 + stage * 900`
     - `jigsaw`: `220_000 + stage * 1_100`
4. **Tái tính chuỗi băm kép 64-bit (`chainHi`, `chainLo`):**
   - Header: `` `pop:v1|${gameId}|${stage}|${seed >>> 0}|${nonce}|${moveCount}|${stride}|${sessionScore}` ``
   - Khởi tạo `hi = fnv1a32(0x811c9dc5, header)`, `lo = fnv1a32(0x9e3779b9, "${nonce}:${seed >>> 0}:${stage}")`.
   - Lặp từng super-step `(i, code16, dt16)` qua hàm `mixDual32` và pha trộn avalanche cuối cùng với `(steps.length, sessionScore & 0xffff, (sessionScore >>> 16) & 0xffff)` (copy trực tiếp hàm `computeProofOfPlayChain` từ `src/sim/proofOfPlay.ts:116-144`).
   - Yêu cầu `recomputed.chainHi === (env.chainHi >>> 0) && recomputed.chainLo === (env.chainLo >>> 0)`.
5. **Đối chiếu với delta màn trong `save`:**
   - Khi `nextCleared[disc] > prevCleared[disc]`: ghi nhận số gói PoP hợp lệ của `disc` trong batch (`verifiedCount`).
   - Giai đoạn 1 (Audit): log cảnh báo khi `deltaStages > 0 && verifiedCount === 0` (tránh phạt nhầm client cũ còn cache).
   - Giai đoạn 2 (Enforce): chỉ tính điểm Cúp Nhà / BXH tuần cho tối đa `Math.min(deltaStages, Math.max(verifiedCount, 1))` hoặc bắt buộc `verifiedCount >= deltaStages` đối với các màn `>= 5` (sau khi 100% client đã cập nhật bản mới).

---

## 2. Kiểm Định Delta Kinh Tế Phía Máy Chủ (Anti-Spike Sanity Checks)

Sử dụng đúng mô hình snapshot đối xứng với `src/sim/economyIntegrity.ts` (`captureEconomyBaseline`, `computeEconomyStateSeal`, `verifyFarmEconomyDelta`) để so sánh bản lưu trước (`prevSave`) với bản lưu mới (`nextSave`) dựa trên `elapsedMs = Math.max(0, serverNowMs - prevSavedAtMs)`:

### 2.1. Ngưỡng trần theo thời gian trôi qua (`effectiveHours = clamp(elapsedMs / 3_600_000, 0.25, 168)`)

| Chỉ số | Công thức trần hợp lệ trên 1 chu kỳ lưu | Mã cờ bất thường | Hành động đề xuất |
|---|---|---|---|
| **Số dư Sickle (`galleons`)** | `next.galleons >= 0` và `deltaSickle <= 18_000 + next.level * 650 + allowInboxSickles + ceil(effectiveHours * (9_500 + next.level * 450))` | `NEGATIVE_BALANCE` / `SICKLE_SPIKE_EXCEEDED` | Audit log + chặn cộng BXH/Cúp; nếu vượt `3×` trần thì kẹp/rollback |
| **Cấp độ & XP (`level`, `xp`)** | `1 <= next.level <= 100`, `next.xp >= 0`, `deltaLevel <= max(8, ceil(effectiveHours * 6))` | `LEVEL_JUMP_EXCEEDED` | Audit log + kẹp `level`/`xp` về biên hợp lệ ở pha Enforce |
| **Phân Ủ Thảo Dược (`herbalCompost`)** | `deltaCompost <= 45 + ceil(effectiveHours * 36)` | `COMPOST_SPIKE_EXCEEDED` | Flag audit; kẹp trần khi lặp lại |
| **Cát Thời Gian (`timeSand`)** | `deltaSand <= 35 + allowInboxSand + ceil(effectiveHours * 20)` | `TIME_SAND_SPIKE_EXCEEDED` | Flag audit; cộng `allowInboxSand` từ thưởng Cúp Đợt |
| **Bùa Phượng Hoàng (`phoenixTalismans`)** | `0 <= next.phoenixTalismans <= 12` và `deltaTalismans <= 12` | `TALISMAN_CAP_EXCEEDED` | Kẹp cứng về `12` ngay trên server |
| **Tổng vật phẩm Kho Đỏ (`farmBarn.crops + goods`)** | `deltaBarnItems <= 320 + ceil(effectiveHours * 260)` | `BARN_INJECTION_EXCEEDED` | Flag audit; kiểm tra chéo giao dịch Sạp Đầu Ngõ |
| **Tiến độ màn 6 môn Cúp Nhà** | `0 <= nextCleared <= 7777`, `deltaStages <= 10` mỗi lần `op: 'save'` (hiện có trong `computeWeeklyStageProgressScore`) | `STAGE_SPIKE_CLAMPED` | Kẹp `min(delta, 10)` khi cộng điểm Cúp Nhà & BXH tuần |
| **Chế độ Sandbox (`sandboxMode`)** | **Bắt buộc `false` trên production HPVN** (client build đã dead-code eliminate `IS_SANDBOX_BUILD_ENABLED`) | `SANDBOX_FLAG_INJECTED` | Từ chối ghi nhận BXH/Cúp & ép `sandboxMode = false` |

> **Miễn trừ hợp lệ (`allowInboxSickles`, `allowInboxSand`):** Cộng dồn chính xác tổng `sickle` và `sand` mà server vừa phát qua `inbox` (`kind: 'sickles'` từ Gringotts, `kind: 'cup'` từ Cúp Đợt, `kind: 'stand-sale'` từ Sạp Đầu Ngõ) kể từ lần `op: 'save'` trước đó để tuyệt đối không báo nhầm cho người nạp/nhận thưởng hợp lệ.

### 2.2. Dấu niêm phong kinh tế (`es1:<hex8>-<hex8>`)

Server có thể gọi cùng hàm `computeEconomyStateSeal(snapshot)` để lưu vào trường audit `lastEconomySeal` trên doc nông trại (không lưu vào JSON của client), giúp truy vết nhanh chuỗi thay đổi bất thường theo từng `uid`.

---

## 3. Quy Tắc Kiểm Định `bonusArcade` & `farmDerby`

### 3.1. `farmDerby` (Môn #7 Cúp Nhà — đã gắn sẵn vào `op: 'save'`)

Client trích xuất `farmDerby: { weekKey, points, tasksCompleted }` qua `extractFarmDerbySyncPayload()` (`src/hpvn/bridge.ts:310-339`). Phía server cần áp dụng:

1. **Khớp tuần hiệu lực:** `farmDerby.weekKey` phải trùng đúng `activeWeekKey` của chu kỳ tuần hiện hành (`17:00 Thứ Sáu → 16:00 Thứ Sáu tuần sau`, giờ VN UTC+7). Nếu lệch tuần cũ → bỏ qua không ghi vào tuần mới.
2. **Kẹp biên cứng (khớp `src/hpvn/houseCup.ts` & `src/sim/weeklyDerbyEngine.ts`):**
   - `points`: số nguyên kẹp cứng `0..2500` (`HOUSE_CUP_DERBY_MAX_WEEKLY_MEMBER_POINTS`).
   - `tasksCompleted`: số nguyên kẹp cứng `0..8` (`MAX_WEEKLY_DERBY_BONUS_TASKS`).
3. **Chống bơm đột biến trong cùng tuần:**
   - Điểm mỗi nhiệm vụ Derby nằm trong khung `160..360` điểm; một lần `op: 'save'` không thể tăng quá `+750` điểm hoặc `+3` nhiệm vụ (nếu vượt, kẹp delta hoặc gắn cờ audit `DERBY_SPIKE`).
   - Điều kiện tối thiểu ghi điểm Nhà Môn #7: `tasksCompleted >= 2` và `points > 0` (`HOUSE_CUP_DERBY_MIN_TASKS_FOR_POINTS = 2`).
   - Luôn giữ tính đơn điệu trong cùng `weekKey` (`Math.max(prevPoints, clampedPoints)`), reset sạch về `0` khi sang `weekKey` mới.

### 3.2. `bonusArcade` (3 game Giải Trí Mới: `block_blast`, `suika`, `pvz`)

Hiện tại `bonusArcade` là nhóm **Giải Trí Mới** (không tính trực tiếp vào Cúp 4 Nhà, chỉ thưởng vòng lặp nông trại: `1–2` Sao, `24–64` Sickle, `18–42` XP, đặc sản riêng & tiến độ Derby `minigame_win`). Khi kiểm tra trường `save.bonusArcade` trên server (và sẵn sàng nếu sau này thăng hạng lên BXH có thưởng):

1. **Schema & kẹp biên mỗi game (`block_blast | suika | pvz`):**
   - `unlockedStage`: `1..9999`, mỗi lần `op: 'save'` tăng tối đa `+2` tầng so với `prev.unlockedStage` (hoặc `<= prev.unlockedStage + 6` nếu có nhiều ván trong 1 cửa sổ debounce 5s).
   - `bestScore`: đơn điệu không giảm, kẹp cứng `0..500_000` (`BONUS_ARCADE_MAX_SINGLE_RUN_SCORE`).
   - `bestCombo`: đơn điệu không giảm, kẹp cứng `0..999` (`BONUS_ARCADE_MAX_SINGLE_RUN_COMBO`).
   - `winsCount` & `clearedStages`: `0..99_999`, mỗi lần `op: 'save'` tăng hợp lý `<= 5`.
2. **Xác thực chữ ký ván chơi (`proofDigest` — định dạng `ba1:<hex8>-<hex8>`):**
   - `src/sim/bonusArcadeGames.ts` đã xuất sẵn hàm thuần `buildBonusArcadeRunProof(gameId, stage, score, combo, runId)` trả về `BonusArcadeVictoryOutcome.proofDigest`.
   - Khi cần mở BXH/thưởng riêng cho `bonusArcade`, server chỉ cần tái tính chính xác công thức FNV-1a 2 chiều dưới đây và khử trùng theo `${uid}:${gameId}:${runId}`:

```js
function fnv1a32Ascii(seed, text) {
  let h = seed >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i) & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

function buildBonusArcadeRunProof(gameId, stage, score, combo, runId = '') {
  const s = Math.max(1, Math.min(9999, Math.floor(Number(stage) || 1)));
  const sc = Math.max(0, Math.min(500_000, Math.floor(Number(score) || 0)));
  const cb = Math.max(0, Math.min(999, Math.floor(Number(combo) || 0)));
  const rid = String(runId || '').trim().slice(0, 120);
  const h1 = fnv1a32Ascii(0x811c9dc5, `ba:v1|${gameId}|${s}|${sc}|${cb}|${rid}`);
  const h2 = fnv1a32Ascii(0x9e3779b1, `${rid}|${cb}|${sc}|${s}|${gameId}|ba:v1`);
  return `ba1:${h1.toString(16).padStart(8, '0')}-${h2.toString(16).padStart(8, '0')}`;
}
```

---

## 4. Lược Đồ Telemetry Vận Hành (Production Observability)

Iframe game **tuyệt đối không gọi API ngoài và không ghi dữ liệu thiết bị** (luật HPVN core). Toàn bộ telemetry đi qua cầu nối `window.parent` sẵn có của cổng HPVN (`action: 'farm-diag'` hoặc trường tùy chọn gọn nhẹ trên `op: 'save'` khi shell bật thu thập).

### 4.1. Phễu Tân Thủ — FTUE Drop-Off Funnel (6 bước Bà Molly)

Trích xuất thụ động hoàn toàn miễn phí ngay trong `op: 'save'` từ `saveObj.tutorial` (không tốn thêm request):

| Bước | `tutorial.stepIndex` | `tutorial.stepId` | Ý nghĩa chuyển đổi |
|---|---|---|---|
| 0 | `0` | `harvest_wheat` | Vào vườn & gặt mẻ lúa đầu tiên |
| 1 | `1` | `sow_and_merge_plot` | Gieo hạt & ghép thửa ruộng liền rào |
| 2 | `2` | `pasture_harvest_and_stock` | Thu trứng & thả thú đồng cỏ |
| 3 | `3` | `seed_quiz_or_buy` | Mở Học Viện Thần Chú / mua hạt |
| 4 | `4` | `earn_magic_star` | Thắng 1 màn Khảo Thí nhận Sao |
| 5 | `5` | `build_and_owl_order` | Xây công trình hoặc giao Đơn Cú đầu tiên |
| Xong | `completedAt > 0` | `completed` | Tốt nghiệp FTUE (KPI mục tiêu `>= 65%` trong 24h) |
| Bỏ qua | `skipped === true` | `skipped` | Người chơi chủ động bỏ qua hướng dẫn |

### 4.2. Chỉ số Hiệu Năng Client (FPS P95, Boot Time & WebGL2 Fallback Rate)

Client (`src/main.ts`) đã tích hợp bộ đo in-RAM 0-GC `getHangSocRuntimeHealth()` (ring buffer `Float32Array(120)` cuối, `0` network call, `0` DOM overhead). Khi HPVN shell muốn thu thập mẫu định kỳ (ví dụ lấy mẫu `5%` phiên chơi khi `pagehide` hoặc lưu lần thứ 3), sử dụng schema chuẩn:

```json
{
  "schema": "hangsoc.runtime.v1",
  "sessionId": "<nonce_prefix_8>",
  "platform": "ios_safari | android_chrome | desktop",
  "rendererMode": "webgl2 | canvas",
  "webglContextLossCount": 0,
  "bootDurationMs": 840,
  "frameTimeP95Ms": 17.4,
  "avgFrameTimeMs": 16.6,
  "sampleCount": 120,
  "ftueStepId": "completed"
}
```

### 4.3. Tỷ Lệ Phiên Không Sập (Crash-Free Session Rate) & Ngưỡng Cảnh Báo (SLO)

Client đã tự động gửi sự kiện lỗi có rate-limit (`<= 5` sự kiện / `60s`, khử trùng theo chữ ký) qua `request('farm-diag', { kind, message, detail, ts })` (`src/hpvn/bridge.ts:255-272`) cho 3 loại: `error`, `unhandledrejection`, `webgl_lost`.

| Chỉ số SLO | Công thức tính theo ngày (UTC+7) | Ngưỡng Xanh | Cảnh báo (Pager/Slack) |
|---|---|---|---|
| **Crash-Free Session Rate** | `1 - (uniqueSessionsWith('error' \| 'unhandledrejection') / totalOpLoadSessions)` | `>= 99.5%` | `< 98.5%` |
| **WebGL2 Fallback Rate** | `sessions(rendererMode === 'canvas') / totalOpLoadSessions` | `< 8%` | `> 15%` |
| **WebGL Context Loss Rate** | `sessions(webglContextLossCount > 0) / webgl2Sessions` | `< 1.0%` | `> 3.0%` |
| **Desktop Frame-Time P95** | P95 `frameTimeP95Ms` (desktop) | `<= 20 ms` (`>= 50 FPS`) | `> 28 ms` |
| **Mobile Frame-Time P95** | P95 `frameTimeP95Ms` (mobile 30fps cap) | `<= 38 ms` | `> 50 ms` |
| **Startup Boot P95 (`bootDurationMs`)** | P95 thời gian từ bootstrap đến khung hình đầu tiên | `<= 2500 ms` | `> 4500 ms` |
| **Save Conflict / Error Rate** | `(error + too-big) / totalOpSaveCalls` | `< 0.5%` | `> 2.0%` |

---

## 5. Lộ Trình Triển Khai An Toàn (3 Pha)

1. **Pha 1 — Shadow Audit (Tuần 1):** Bật `verifyProofOfPlayEnvelope`, `verifyFarmEconomyDelta` và kiểm tra `farmDerby`/`bonusArcade` ở chế độ **chỉ ghi log** vào collection `gameSecurityAuditLogs` (TTL 30 ngày). Không chặn hay trừ điểm người chơi; rà soát tỷ lệ false positive (`< 0.1%`).
2. **Pha 2 — Soft Clamp (Tuần 2):** Bật kẹp biên tự động (`phoenixTalismans <= 12`, `farmDerby.points <= 2500`, `farmDerby.tasksCompleted <= 8`, `sandboxMode = false`, `deltaStages <= 10`, `bonusArcade.bestScore <= 500_000`) và trừ điểm Cúp Nhà đối với gói `ProofOfPlay` bị sửa chữ ký (`chain-digest-mismatch` hoặc `replayed-nonce`).
3. **Pha 3 — Full Enforcement & Dashboard (Tuần 3+):** Đẩy các chỉ số SLO (§4.3) và phễu FTUE (§4.1) lên bảng giám sát HPVN; bật cảnh báo tự động khi tỷ lệ Crash-Free tụt dưới `99%` hoặc xuất hiện mẫu gian lận kinh tế lặp lại theo `uid`.

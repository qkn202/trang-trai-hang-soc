# AAA Canvas 2D — Handoff cho người tiếp quản

> **Mục tiêu:** nâng game lên chuẩn cozy-production cao cấp bằng Canvas 2D, không đổi sang WebGL.
>
> **Ngôn ngữ dự án:** UI tiếng Việt. **Quy tắc code:** xem [AGENTS.md](AGENTS.md) trước khi sửa.

## 1. Trạng thái hiện tại

### Baseline đã xác nhận

- `tsc --noEmit`: phải xanh ở checkpoint hiện tại.
- Vitest: baseline gần nhất là **116/116 tests**.
- `npm run build`: đã xanh ở checkpoint P0.2.
- Sprite validator: **172/172** sprite hợp lệ.
- Preview full valley `?preview=100`: baseline đo được **144 FPS** trong browser preview.
- Engine hiện là Canvas 2D; không được tự ý đưa Pixi/Three/WebGL vào roadmap này.

### Các commit quan trọng

| Commit | Ý nghĩa |
|---|---|
| `b7f97e8` | P0.1: tách data/factory/migration khỏi `simulation.ts` sang `simulationData.ts`. |
| `7820017` | P0.2a: tách nhóm farm sang `simulationFarm.ts`. |
| `0368660` | P0.2b/c: tách economy + world; checkpoint xanh. |
| `2ca4c4d` | SeedQuiz: chuyển Học Viện Thần Chú Đa Ngữ sang 5 trò chơi Hình Ảnh 2.5D + Âm Thanh thân thiện trẻ em. |
| `b5799f2` | P0.2d–g: hoàn tất tách `simulation.ts` (`8842 → 1310` dòng) sang `simulationCreatures.ts`, `simulationTrials.ts`, `simulationQuests.ts`, `simulationSocial.ts`, `simulationVillagers.ts`, `simulationLifecycle.ts` (mọi file `< 1500` LOC). |
| `b5463c4` | P0.5: hoàn tất tách `puzzleArcadeEngine.ts` (`5719 → 8` dòng barrel) sang `puzzleShared.ts`, `blocksEngine.ts`, `sudokuEngine.ts`, `caroEngine.ts`, `chessPresets.ts`, `chessEngine.ts`, `onetEngine.ts` (mọi file `< 1500` LOC). |
| `dfcebd2` | P0.4: hoàn tất tách `renderer.ts` (`6313 → 1307` dòng) sang `rendererShared.ts`, `renderTerrain.ts`, `renderWater.ts`, `renderBuildings.ts`, `renderCropsAndTimers.ts`, `renderEntitiesAndWeather.ts` (mọi file `< 1500` LOC). |
| `a36a5b4` | P0.3: hoàn tất tách `hud.ts` (`7870 → 753` dòng) sang `hudShared.ts`, `hudShell.ts`, `hudHeaderAndDock.ts`, `hudInspector.ts`, `hudFarmAndWorkshop.ts`, `hudQuestsAndSettings.ts`, `hudSuitcase.ts`, `hudSocialAndTutorial.ts` (mọi file `< 1500` LOC). |
| `930a0db` | P1: Presentation ceiling Canvas 2D (`presentationCeiling.ts`: chu kỳ 4 mùa 60 ngày, `ParticlePoolManager` 320 slot 0-alloc, parallax 3 lớp, đèn cửa sổ động ban đêm, bề mặt ướt sau mưa, depth fog & LUT màu). |
| `49eaa46` | P2: Audio ceiling (`audioCeiling.ts`: 5-bus mixer, soft limiter chống clipping, modal ducking mượt 0.35s, 3-stem intensity & spatial stereo pan). |
| `e9a839b` | P3: Retention & narrative (`retentionAndNarrative.ts`: 52 thành tựu `ach_01..ach_52`, 3 save slots + autosave, import/export tương thích ngược, lịch trình NPC 4 buổi, hội thoại phân nhánh, 3 chương cutscene & vòng lặp Ngày 1–7). |
| `bc03732` | P4: Platform & accessibility (`platformAndA11y.ts`: Gamepad API + radial menu 8 hướng, 4 chế độ hỗ trợ sắc giác kèm ký hiệu/hoa văn, font scale 100/125/150%, tương phản cao, 4 thanh âm lượng & kiểm tra vùng chạm `>= 44px`). |

### Trạng thái Toàn Bộ Roadmap P0 → P5 (ĐÃ HOÀN TẤT 100%)

- Cả 4 god files (`simulation.ts`, `hud.ts`, `renderer.ts`, `puzzleArcadeEngine.ts`) và toàn bộ các module domain đều đạt **`< 1500` LOC/file**.
- Toàn bộ 6 giai đoạn **`P0` → `P1` → `P2` → `P3` → `P4` → `P5`** đã hoàn thiện kèm bộ kiểm thử tự động.
- `npx tsc --noEmit`: exit `0`.
- `npx vitest run`: **`135/135` tests xanh (`13/13` test files)**.
- `npm run build`: exit `0` (bundle tách chunk + nén gzip/brotli).
- `node tools/validate-sprites.mjs`: **`172/172` sprite hợp lệ**.

## 2. Quy tắc an toàn bắt buộc

1. Đọc [AGENTS.md](AGENTS.md) và [ASSETS.md](ASSETS.md) trước khi sửa.
2. Không sửa `public/sprites/*.png` nếu không có yêu cầu artist rõ ràng.
3. Không đổi tên sprite, key trong `SPRITE_KEYS`, export public hoặc đường dẫn import hiện có.
4. Không dùng `git checkout -- .`, `git reset --hard` hoặc xóa hàng loạt. Chỉ khôi phục file đã xác định là pilot của task hiện tại.
5. Không chạy hai agent cùng sửa một nhóm file.
6. Mỗi domain chỉ được merge sau khi `tsc`, test và build đều xanh.
7. Nếu test fail chỉ khi chạy full suite nhưng pass khi chạy riêng, chạy lại ít nhất 4 lần trước khi kết luận flaky.
8. Trước mỗi commit phải kiểm tra `git diff --stat` và `git status --short`.
9. Không commit `.claude/settings.local.json`, secret, token hoặc file môi trường local.
10. Những thay đổi artist trong `public/sprites/*.png` phải được giữ nguyên.

## 3. Lệnh xác minh chuẩn

Chạy từ root repository:

```bash
npx tsc --noEmit
npx vitest run
npm run build
node tools/validate-sprites.mjs
```

Preview browser chỉ dùng khi thay đổi có thể quan sát trên browser:

```bash
npm run dev
```

Các URL debug hữu ích:

- `?preview=100`
- `?time=dawn|day|dusk|night`
- `?weather=clear|rain|storm|snow|fog|fireflies`
- `?dialog=neighbors`
- `?dialog=leaderboard&lbgame=chess`
- `?dialog=match3&m3level=160`
- `?dialog=seedquiz&lang=en`

## 4. Chiến lược P0 — Foundation

### P0.1 — Đã hoàn tất

File chính: [simulationData.ts](src/sim/simulationData.ts).

Đã tách:

- constants và pricing helpers;
- state factories;
- owl order factory;
- tutorial/harvest-feast state;
- villager profiles;
- save migration/sanitize helpers.

Acceptance:

- import public vẫn hoạt động;
- `tsc` xanh;
- test xanh;
- không đổi hành vi runtime.

### P0.2 — Cách tách domain được chấp nhận

Các module domain dùng delegation:

```ts
import type { ParkSimulation } from './simulation';

export function farmHarvestCropPlot(
  sim: ParkSimulation,
  uid: string,
): { ok: boolean; msg: string } {
  // body logic đã được kiểm chứng, dùng sim.state/sim.grid...
}
```

Class giữ API cũ:

```ts
public harvestCropPlot(uid: string): { ok: boolean; msg: string } {
  return farmHarvestCropPlot(this, uid);
}
```

Nguyên tắc:

- `import type` để tránh vòng lặp runtime;
- giữ nguyên signature và thứ tự method;
- không đổi semantics chỉ để làm module ngắn hơn;
- private field chỉ được mở public nếu có lý do rõ ràng và ghi chú trong diff;
- ưu tiên adapter/service thuần thay vì biến mọi private state thành public;
- module mới nên dưới khoảng 1.500 dòng.

### Thứ tự P0.2 đề xuất

1. `simulationFarm.ts` — đã có checkpoint `7820017`.
2. `simulationEconomy.ts` và `simulationWorld.ts` — đã có checkpoint `0368660`.
3. `simulationCreatures.ts` — kiểm thử parser trên method có return type object và optional object parameter.
4. `simulationTrials.ts` — đặc biệt kiểm tra `completePuzzleArcadeVictory`, vì signature có object parameter và object return type nhiều dòng.
5. `simulationQuests.ts` — quests/workshop/owl/harvest feast.
6. `simulationSocial.ts` — neighbor social, tutorial, villagers, guests/staff.

**Không sử dụng script tự động tách nếu chưa có test fixture.** Script phải xử lý được:

- delegator một dòng;
- signature nhiều dòng;
- `sessionMetrics?: { ... }`;
- return type `: { ... }` nhiều dòng;
- default parameter;
- optional parameter `?`;
- object literal trong body;
- method gọi method cùng nhóm và method khác nhóm.

## 5. P0.3 — Tách HUD

Mục tiêu: giảm [hud.ts](src/ui/hud.ts) mà không đổi class HTML/CSS hiện có.

Chia theo trách nhiệm:

1. `hudShell.ts`: root, HUD mount, refresh loop.
2. `dialogRegistry.ts`: mở/đóng dialog, focus, escape/back.
3. `settingsDialog.ts`: settings, audio, save management.
4. `farmPanels.ts`: barn, seed, pasture, workshop.
5. `socialPanels.ts`: neighbors, leaderboard, cloud state.
6. `questPanels.ts`: quests, tutorial, harvest feast.
7. `toastSystem.ts`: toast, reward fly, level-up.

Bắt buộc:

- giữ nguyên IDs và class names được dựng bởi `hud.ts`;
- kiểm tra keyboard, touch và modal close;
- không hardcode màu mới ngoài token CSS;
- verify browser với desktop và mobile viewport.

## 6. P0.4 — Tách renderer

Chia [renderer.ts](src/engine/renderer.ts) thành:

1. `renderTerrain.ts` — grass, grid, zones.
2. `renderWater.ts` — lake outline, foam, shore.
3. `renderBuildings.ts` — buildings, crops, construction.
4. `renderEntities.ts` — villagers, creatures, staff.
5. `renderWeather.ts` — rain, snow, fog, fireflies.
6. `renderLighting.ts` — sun bloom, god-rays, vignette, night lights.
7. `renderHitTest.ts` — pixel alpha/hotspots.
8. `renderFrame.ts` — orchestration only.

Acceptance:

- renderer không mutate simulation state;
- `?preview=100` vẫn có canvas và không có console error;
- baseline desktop không tụt bất thường;
- mobile vẫn đạt mục tiêu 60 FPS trên thiết bị trung bình;
- reduced-motion bỏ particle/flash mạnh nhưng không làm mất gameplay feedback.

## 7. P0.5 — Tách puzzle engine

Chia [puzzleArcadeEngine.ts](src/sim/puzzleArcadeEngine.ts) thành:

- `puzzleBoard.ts` — board coordinates, selection, validation;
- `caroEngine.ts`;
- `sudokuEngine.ts`;
- `chessEngine.ts` + worker protocol;
- `blocksEngine.ts`;
- `puzzleRewards.ts`;
- `puzzleProgression.ts`.

Không đổi luật hiện tại khi chỉ refactor. Những thay đổi gameplay phải là commit riêng, có test riêng.

## 8. P1 — Presentation ceiling Canvas 2D

Chỉ bắt đầu sau khi P0 có checkpoint xanh.

### Hệ thống cần làm

- particle manager có pool và giới hạn ngân sách;
- harvest sparkle, water splash, leaves, snow, dust, lantern, fireflies;
- parallax 3 lớp: sky, distant valley/mist, foreground;
- dynamic night lights cho cửa sổ, torch và lantern;
- wet surface sau mưa;
- depth fog theo khoảng cách isometric;
- event bloom, color grading nhẹ, impact chromatic aberration có giới hạn;
- 4 mùa với palette/foliage/weather bias/crops.

### Acceptance

- day/night/rain/storm/snow có cảm nhận khác nhau rõ ràng;
- mobile không tạo hàng nghìn object particle mỗi frame;
- particle pooling, culling và delta-time clamp;
- reduced-motion và tab inactive được xử lý;
- screenshot và console log được lưu trong báo cáo phase.

## 9. P2 — Audio ceiling

Nâng audio hiện tại thành bus/layer rõ ràng:

- ambience;
- melody;
- intensity;
- weather;
- UI/SFX;
- modal ducking;
- win/harvest/build-complete fanfare;
- spatial cue nhẹ cho nước, thú và công trình.

Acceptance:

- không clipping;
- crossfade không click;
- modal ducking có restore đúng;
- reduced-motion không ảnh hưởng audio;
- có test cho mood transition và intensity transition.

## 10. P3 — Retention và narrative

### Achievement

- một registry thống nhất;
- 50+ achievement có ID ổn định;
- toast, badge codex, reward và migration.

### Save

- 3 named slots;
- autosave riêng;
- version migration;
- import/export giữ backward compatibility;
- conflict policy cho cloud save.

### NPC/story

- daily schedule;
- mood/context;
- dialogue branch;
- friendship state;
- 3 story chapters;
- Canvas cutscene nhẹ;
- quest log và day-1 → day-7 loop.

## 11. P4 — Platform và accessibility

- Gamepad API: camera, selection, radial menu, modal navigation.
- Keyboard-only: focus visible, escape/back, no trapped focus.
- Colorblind palettes: không chỉ dựa vào màu, phải có icon/pattern.
- Font scale: 100/125/150% không vỡ layout.
- High contrast.
- Master/music/SFX/voice volume riêng.
- Screen-reader live region và mô tả canvas.
- Touch hit target đủ lớn và không xung đột pinch/drag.

## 12. P5 — Production/ship

- i18n extraction, English trước rồi mở rộng.
- Cloud Worker deploy có schema/version/rate limit.
- Save conflict resolution.
- crash-free session, FPS, asset-load telemetry.
- offline recovery.
- production smoke test và rollback strategy.

## 13. Quy trình làm việc cho mỗi phase

1. Đọc AGENTS.md và file liên quan.
2. Chụp baseline: status, tsc, test, build.
3. Viết plan nhỏ, tối đa một domain writer tại một thời điểm.
4. Sửa code theo một commit logic.
5. Chạy tsc.
6. Chạy test file liên quan.
7. Chạy toàn bộ test ít nhất một lần; nếu flaky, chạy bốn lần.
8. Chạy build.
9. Nếu browser-observable, dùng preview workflow:
   - start server;
   - snapshot/console/network;
   - test interaction;
   - screenshot cuối.
10. Kiểm tra diff và file ngoài phạm vi.
11. Commit với message nêu rõ phase và acceptance.
12. Ghi kết quả vào handoff/change log.

## 14. Mẫu báo cáo bàn giao mỗi phase

```md
## Phase P?.? — <tên>

### Đã làm
- ...

### File chính
- [file](path/to/file.ts)

### Acceptance
- [x] tsc: exit 0
- [x] tests: N/N
- [x] build: exit 0
- [x] sprite validator: 172/172
- [ ] browser preview: chưa chạy / lý do

### Known issues
- ...

### Commit
- `<hash>` — `<message>`

### Next step
- ...
```

## 15. Việc đầu tiên của người tiếp quản

1. Đọc file này, [AGENTS.md](AGENTS.md), [ASSETS.md](ASSETS.md).
2. Chạy baseline commands ở mục 3.
3. Xác nhận HEAD và dirty files; không reset thay đổi ngoài phạm vi.
4. Chọn **một**: tiếp tục tách P0.2 hoặc dừng refactor để làm P1.
5. Nếu tiếp tục P0.2, viết test fixture cho parser trước khi tách creatures/trials.
6. Không merge creatures/trials chỉ với `tsc`; phải có test + build.
7. Chỉ bắt đầu P1 khi P0 có checkpoint commit xanh.

# Kế hoạch nâng UX xây dựng vườn và nuôi thú

## Context

Game đã có các mảnh nền tảng: kéo đặt vật phẩm trong `main.ts`, gieo hạt/ thả thú theo nét kéo, khay chọn thú trong `hudFarmAndWorkshop.ts`, cùng API mô phỏng đơn lẻ trong `simulationFarm.ts`. Tuy nhiên mỗi thao tác hiện vẫn gọi xử lý, lưu game và cập nhật UI riêng; người chơi chưa có một lớp batch action rõ ràng cho farm care, chưa có Animal Care Hub tổng hợp, và chế độ xây dựng chưa có transaction/undo-preview hoàn chỉnh. Mục tiêu là giảm thao tác lặp theo chuẩn Hay Day/Township nhưng giữ nguyên các quyết định chiến lược và không phá save cũ.

## Phạm vi đề xuất

### 1. Batch farm-care API

- Thêm các kiểu kết quả batch dùng chung trong `src/types/game.ts` hoặc module sim riêng.
- Thêm các phương thức `ParkSimulation`/helper trong `src/sim/simulationFarm.ts` cho:
  - `harvestCropPlots(uids)`;
  - `plantCropPlots(uids, cropId)`;
  - `waterCropPlots(uids)`;
  - `feedAnimalPastures(uids)`;
  - `harvestAnimalPastures(uids)`.
- Batch API phải validate toàn bộ trước khi commit phần có thể commit, gom XP/gold/yield/reward fly/toast, chỉ `saveToStorage()` và `onUiChange()` một lần.
- Không tự tiêu tài nguyên quý; trả về `processed`, `skipped`, `totalYield`, `totalGold`, `totalXp` và thông báo tiếng Việt.
- Giữ API đơn lẻ hiện tại để quest, NPC và code cũ không đổi.

### 2. Animal Care Hub

- Mở rộng khay thú trong `src/ui/hudFarmAndWorkshop.ts` thành panel tổng hợp số ô trống, thú đang đói/chưa cho ăn, sản vật sẵn sàng và các nút `Cho ăn tất cả`/`Thu hoạch tất cả`.
- Chỉ hiển thị nút khi có mục tiêu hợp lệ; nếu có thú chưa thả thì giữ luồng chọn loài hiện tại.
- Wire handler qua `GameHUD` trong `src/ui/hud.ts`, gọi batch API và render một toast/reward summary.
- Bảo đảm visitor mode, sandbox, kho đầy và hành động đã xử lý được phản ánh rõ.
- Không thay đổi HTML class hiện có ngoài các selector mới cần thiết; màu dùng token CSS trong `src/styles/main.css`.

### 3. Farm brush preview/cancel

- Tận dụng path tracking đã có trong `src/main.ts` cho seed/pasture brush.
- Thêm preview tập hợp ô, loại ô hợp lệ/không hợp lệ, không commit lặp từng pointermove.
- Khi pointerup, commit một batch operation; pointercancel/right-click/escape hủy preview.
- Gộp reward và giảm refresh/audio/toast theo batch.
- Giữ pinch-to-zoom và camera drag không bị nhận nhầm thành brush.

### 4. Build Mode transaction hooks

- Tạo transaction type/module nhỏ (không đổi schema save hiện tại) cho place/move/remove/rotate/group operations.
- Bắt các thao tác placement/move hiện có trong `src/main.ts` bằng một transaction cuối thao tác.
- Thêm preview validation rõ ràng cho footprint, vùng ảnh hưởng và lý do không hợp lệ; không đưa group move/copy-paste lớn vào lát cắt đầu nếu chưa có API an toàn.
- Thêm undo/redo tối thiểu cho placement/move trong phiên hiện tại, có giới hạn stack và không làm thay đổi migration save.
- Chỉ lưu một lần sau commit transaction; giữ rollback hiện tại làm đường cứu hộ.

## File chính

- `src/sim/simulationFarm.ts`
- `src/sim/simulation.ts`
- `src/types/game.ts`
- `src/ui/hudFarmAndWorkshop.ts`
- `src/ui/hud.ts`
- `src/main.ts`
- `src/styles/main.css`
- `src/sim/__tests__/simulation.test.ts` và test mới cho batch/transaction nếu cần

## Verification

- Chạy toàn bộ Vitest, `tsc --noEmit`/`npm run build` và sprite validator.
- Test unit: batch harvest/feed/water, visitor mode, kho đầy, invalid UID, save/UI callback chỉ gọi một lần, không trừ tài nguyên khi preview bị hủy.
- Preview desktop và mobile: mở khay thú, dùng Feed All/Collect All, kéo brush rồi hủy/commit, đặt và di chuyển công trình; kiểm tra snapshot, console và network không có lỗi.
- Kiểm tra save cũ load được và thao tác đơn lẻ hiện tại không đổi hành vi.

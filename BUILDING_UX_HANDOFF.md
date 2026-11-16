# Handoff: Tối ưu hệ thống xây dựng trên mobile

## 1. Mục tiêu

Đơn giản hóa phần xây dựng theo mô hình:

> **Township về công trình/progression + Gardenscapes về thao tác đặt + inspector đơn giản.**

Người chơi mới phải hiểu được flow này mà không cần đọc hướng dẫn:

```text
Mở Xây dựng
→ Chọn nhóm
→ Chọn công trình
→ Thấy preview xanh/đỏ
→ Chạm vị trí để đặt ngay
→ Đặt tiếp nếu là đường/hàng rào/trang trí lặp
→ Chạm công trình đã có để Di chuyển / Xoay / Xóa
→ Hoàn tác nếu cần
```

Mục tiêu chính là giảm từ flow hiện tại:

```text
Chọn item → chạm ô → hiện thanh xác nhận → chạm lần nữa
```

xuống còn:

```text
Chọn item → preview → chạm một lần để đặt
```

---

## 2. Phạm vi thay đổi

### File cần đọc trước

```text
src/main.ts
src/ui/hud.ts
src/ui/hudShell.ts
src/ui/hudHeaderAndDock.ts
src/ui/hudInspector.ts
src/sim/simulation.ts
src/sim/simulationWorld.ts
src/data/catalog.ts
```

### Các logic liên quan

- `hud.selectedCatalogItem`: item đang chọn.
- `hud.activeCategory`: nhóm xây dựng đang mở.
- `hud.pendingTouchTile`: ô đang chờ xác nhận trên mobile.
- `hud.moveModeActive`: đang di chuyển công trình.
- `hud.movingBuildingUid`: công trình đang được nhấc lên.
- `hud.bulldozerActive`: chế độ xóa.
- `hud.pincerActive`: gắp/điều phối nhân sự, không phải thao tác xây dựng thông thường.
- `resolveBuildingPlacementTile()`: snap item theo lưới.
- `findBestPreviewSpotNearCamera()`: tìm ô đặt tốt gần camera.
- `sim.canPlaceItem()`: kiểm tra vị trí.
- `sim.placeItem()`: đặt công trình.
- `sim.moveBuilding()`: di chuyển công trình.
- `sim.removeAtTile()`: xóa công trình/địa hình.
- `sim.beginBuildStroke()` / `sim.commitBuildStroke()`: undo/redo transaction.

Không thay đổi hệ thống kinh tế, unlock, giá tiền, build duration hoặc quy tắc collision nếu không cần cho UX.

---

## 3. Công việc bắt buộc

### Việc A — Đặt công trình một chạm

Trong `src/main.ts`:

1. Khi `hud.onSelectCatalogItem` được gọi:
   - Giữ `hoverTile` tại vị trí preview tốt nhất.
   - Camera có thể tự căn giữa nếu preview nằm ngoài vùng nhìn.
   - Không gán `pendingTouchTile` chỉ để bắt người chơi xác nhận lần hai.
   - Không mở thanh xác nhận cho placement mới.

2. Trong nhánh `hud.selectedCatalogItem` của `pointerup`:
   - Tính `targetTile = resolveBuildingPlacementTile(...)`.
   - Gọi `sim.canPlaceItem(...)`.
   - Nếu hợp lệ, gọi `sim.placeItem(...)` ngay trong lần chạm đầu.
   - Nếu không hợp lệ, hiện lý do rõ ràng và không thay đổi state.
   - Xóa `selectedCatalogItem` sau khi đặt item không lặp.
   - Giữ `selectedCatalogItem` sau khi đặt item lặp.

3. Không áp dụng one-tap placement cho drag brush hiện tại nếu làm hỏng việc kéo đường/hàng rào. Brush item phải tiếp tục hỗ trợ:
   - Mouse drag.
   - Touch drag.
   - Một lần undo cho toàn bộ stroke.

4. `pendingTouchTile` vẫn được phép tồn tại cho **Move**, vì move cần tránh đặt nhầm khi kéo công trình cũ.

### Việc B — Preview rõ ràng

Trong renderer/preview hiện tại:

- Ô hợp lệ: màu xanh hoặc highlight tích cực.
- Ô không hợp lệ: màu đỏ/cảnh báo.
- Preview phải dùng đúng footprint sau khi xoay.
- Preview phải snap theo cùng logic với `sim.canPlaceItem`.
- Không để preview hiển thị xanh nhưng lúc đặt lại bị từ chối do khác tọa độ.
- Khi xoay, cập nhật footprint và preview ngay.

Kiểm tra các loại:

- Công trình 1×1.
- Công trình 2×2 hoặc lớn hơn.
- Công trình xoay làm đổi chiều rộng/cao.
- Đường/hàng rào item lặp.
- Item bị khóa level.
- Item thiếu vàng hoặc thiếu sao.
- Vị trí ngoài vùng đã mở khóa.
- Vị trí có collision.

### Việc C — Đơn giản hóa thanh công cụ

Thanh công cụ xây dựng chính chỉ nên ưu tiên:

```text
✋ Dời
🧹 Xóa
🔄 Xoay
↶ Hoàn tác
↷ Làm lại
✓ Xong / đóng
```

Các công cụ không dành cho xây dựng thông thường không đưa lên thanh chính:

- Gắp nhân sự/Pincer.
- Công cụ debug.
- Tùy chọn nội bộ.

Pincer vẫn có thể giữ trong ngữ cảnh phù hợp:

- Inspector của nhân sự.
- Danh mục Phụ tá.

Không xóa logic Pincer khỏi simulation nếu phần khác còn dùng. Chỉ ẩn khỏi toolbar xây dựng chung và tránh tạo shortcut dễ gây nhầm cho người chơi mới.

### Việc D — Inspector công trình

Khi chạm một công trình đã đặt, inspector nên có các hành động trực tiếp:

```text
✋ Dời
🔄 Xoay
🧹 Xóa
```

Yêu cầu:

- Công trình bất biến/indestructible không được hiện Xóa/Dời.
- Dời phải dùng lại `moveBuilding()` và transaction undo/redo.
- Xóa phải dùng flow xác nhận hiện tại nếu công trình có hazard/sản vật/điều kiện đặc biệt.
- Xoay phải kiểm tra collision sau xoay; nếu không hợp lệ thì không xoay.
- Đóng inspector sau khi bắt đầu Move để người chơi tập trung vào bản đồ.
- Không thêm thêm một mode mới nếu inspector đã đủ cho thao tác trên một công trình.

Nếu Rotate hiện chỉ áp dụng cho item đang đặt, cần bổ sung rotate cho building đã chọn theo cách an toàn; không được sửa trực tiếp rotation mà bỏ qua `canPlaceItem`/grid rebuild.

### Việc E — Nhóm và danh mục

Giữ số nhóm chính ít:

```text
🏠 Nhà / công trình
🌾 Sản xuất
🛍️ Dịch vụ
🛣️ Đường
🌳 Trang trí
🎄 Bộ sưu tập event
```

Không đưa hàng chục filter lên màn hình mobile cùng lúc.

Đối với decor:

- Dùng một hàng chip cuộn ngang.
- Có `Tất cả` và nhóm đang dùng gần đây.
- Các bộ event như Yule có thể nằm trong filter phụ.
- Không làm drawer quá cao đến mức che bản đồ.

Mỗi catalog card cần hiển thị ngắn gọn:

```text
Tên
Giá vàng hoặc sao
Trạng thái khóa
Thời gian xây nếu có
```

---

## 4. Quy tắc UX mobile

- Nút chạm tối thiểu khoảng 44px.
- Không dùng hover để truyền tải thông tin bắt buộc.
- Không yêu cầu double tap.
- Không yêu cầu kéo chính xác pixel; dùng snap và vùng hit rộng.
- Pinch zoom phải không vô tình đặt công trình.
- Kéo camera không được đặt công trình.
- Chỉ commit khi pointerup được nhận diện là tap/stroke hợp lệ.
- Khi chạm nút HUD, không truyền event xuống canvas.
- Khi đổi category, reset item/tool state cũ.
- Khi đóng Build Mode, reset `selectedCatalogItem`, `pendingTouchTile`, `movingBuildingUid` và tool flags cần thiết.
- Toast phải nói rõ lỗi: thiếu vàng, chưa mở vùng, bị chắn, đang xây, hoặc item bị khóa.

---

## 5. State transition cần giữ nhất quán

Không được tạo các trạng thái kết hợp mâu thuẫn như:

```text
selectedCatalogItem && moveModeActive
selectedCatalogItem && bulldozerActive
moveModeActive && bulldozerActive
pincerActive && selectedCatalogItem
```

Nên có một helper duy nhất, ví dụ:

```ts
function clearBuildToolModes(hud: GameHUD): void {
  hud.selectedCatalogItem = null;
  hud.moveModeActive = false;
  hud.movingBuildingUid = null;
  hud.bulldozerActive = false;
  hud.pendingTouchTile = null;
}
```

Dùng helper khi:

- Đổi category.
- Mở tool khác.
- Đóng build dock.
- Click phải/hủy.
- Mở inspector.
- Vào thăm nhà người khác.

Nếu không thể refactor ngay, ít nhất phải kiểm tra các điểm reset hiện có trong `hudShell.ts` và `main.ts` để không tạo behavior regression.

---

## 6. Những thứ không được làm

- Không bỏ undo/redo transaction.
- Không đặt công trình bằng cách bỏ qua `sim.canPlaceItem()`.
- Không tự trừ tiền ở UI; simulation là nơi quyết định chi phí.
- Không tạo thêm bước confirm cho mỗi lần đặt trên mobile.
- Không thay placement bằng auto-place hoàn toàn; người chơi vẫn cần kiểm soát vị trí.
- Không xóa Pincer khỏi hệ thống staff nếu inspector Phụ tá còn dùng.
- Không sửa các thay đổi offline mini-game trong cùng commit nếu task chỉ là build UX.
- Không commit file sandbox/Yule ngoài phạm vi nếu đang làm một commit riêng cho building UX.

---

## 7. Test bắt buộc

### Unit/test logic

- `canPlaceItem` chặn vị trí sai.
- `placeItem` chỉ thay đổi state khi vị trí hợp lệ.
- Item không lặp tự bỏ chọn sau khi đặt.
- Item lặp vẫn giữ lựa chọn.
- Undo hoàn tác đúng một lần đặt.
- Redo khôi phục đúng một lần đặt.
- Move công trình không đổi giá tiền.
- Move công trình không thể xuyên/collision.
- Rotate công trình không thể tạo collision.
- Xóa công trình indestructible bị chặn.
- Xóa công trình có hazard vẫn mở confirm dialog.

### Manual mobile test

Viewport tối thiểu:

```text
320×568
375×812
390×844
430×932
```

Test flow:

1. Mở Build Mode.
2. Chọn công trình 1×1.
3. Chạm map một lần.
4. Xác nhận công trình xuất hiện ngay, không cần chạm lần hai.
5. Chọn item 2×2, xoay rồi đặt.
6. Chọn đường/hàng rào và kéo liên tục.
7. Chạm công trình cũ → Dời → đặt vị trí mới.
8. Chạm công trình cũ → Xoay.
9. Chạm công trình cũ → Xóa → xác nhận.
10. Bấm Undo/Redo.
11. Pinch zoom khi đang chọn item; không được tự đặt.
12. Kéo camera khi đang chọn item; không được đặt ngoài tap.
13. Đổi category giữa chừng; state cũ phải được reset.
14. Thử thiếu vàng, item khóa và ô bị chắn.

### Acceptance criteria

- Người chơi mobile đặt công trình mới bằng một lần chạm bản đồ.
- Không còn thanh xác nhận hai bước cho placement mới.
- Preview và vị trí thực tế khớp nhau.
- Item lặp đặt liên tục được.
- Move/Xóa/Undo/Redo không bị hỏng.
- Không có công cụ nâng cao làm rối toolbar chính.
- Không có console error hoặc unhandled rejection.
- Desktop vẫn giữ được click, drag brush và keyboard shortcut hợp lệ.

---

## 8. Kiểm tra trước khi bàn giao

Chạy:

```bash
npm run test
```

```bash
npm run build
```

Nếu repository còn thay đổi offline/sandbox/Yule chưa hoàn tất, cần:

- Không reset hoặc xóa các thay đổi đó.
- Tách commit building UX chỉ gồm file liên quan.
- Ghi rõ build/test nào bị ảnh hưởng bởi thay đổi ngoài phạm vi.

Kiểm tra diff:

```bash
git diff -- src/main.ts src/ui/hud.ts src/ui/hudShell.ts src/ui/hudHeaderAndDock.ts src/ui/hudInspector.ts src/sim
```

Kiểm tra không còn nút Pincer trong toolbar chính:

```bash
grep -RIn "btnPincerTool" src/ui
```

Nếu còn Pincer trong inspector Phụ tá thì đó là hợp lệ.

---

## 9. Deliverables

Người thực hiện cần bàn giao:

- Code UX placement một chạm.
- Preview xanh/đỏ và snap ổn định.
- Toolbar xây dựng gọn.
- Inspector có Dời/Xoay/Xóa phù hợp.
- Test hoặc báo cáo test mobile.
- Build thành công.
- Danh sách file đã đổi.
- Ghi chú rõ những phần chưa đổi, đặc biệt economy, progression và Pincer staff.

## Definition of Done

Một người chơi mới trên điện thoại có thể mở Build Mode, chọn một công trình, nhìn thấy vị trí preview và đặt công trình bằng một chạm; có thể chạm công trình đã xây để di chuyển, xoay hoặc xóa; có Undo/Redo; không bị buộc hiểu nhiều tool mode nâng cao.

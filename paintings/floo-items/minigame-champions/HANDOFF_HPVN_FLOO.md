# Hướng Dẫn Bàn Giao (Handoff): Bộ 6 Khung Bong Bóng Đương Kim Hạng 1 Của 6 Mini-Game Trên Mạng Floo (`hpvn-archive.net`)

Tài liệu này đóng gói trọn bộ **18 file ảnh nhẹ sắc nét** (`6 bộ môn × {1x WebP, 2x WebP, 1x PNG}`, dung lượng chỉ `6.3 KB – 27.6 KB` mỗi file) và stylesheet `minigame-champions-floo.css` khớp **1-đối-1** với 6 mã bộ môn (`HouseCupDisciplineId`), trong đó **mỗi môn mang đúng màu nền Bảo Ngọc Tươi riêng biệt và huy hiệu Quán Quân Hạng 1 (`54×54 px`) đặt ngay chính giữa viền trên**.

---

## 1. Thông số thiết kế chốt & bảng mã 6 khung (`data-store-frame`)

| Bộ môn (`HouseCupDisciplineId`) | Tên hiển thị | Mã `data-store-frame` | Màu nền Bảo Ngọc & Viền đặc trưng | Huy hiệu Hạng 1 ngay chính giữa viền trên (`::after`) | File ảnh (`1x` / `2x` / `PNG`) |
|---|---|---|---|---|---|
| `match3` | **Bùa Gặt Honeydukes** | `"champ-match3"` | **Hồng Kẹo Dâu Ngọt Ngào** (`#b81d62 → #5e0b30`), viền Hồng Kẹo & Vàng | Hũ kẹo pha lê Honeydukes chong chóng cầu vồng đội vương miện số `1` | `champ-match3.{webp,png}`, `champ-match3-2x.webp` |
| `caro` | **Dò Mìn Phép Thuật** | `"champ-caro"` | **Cam Đỏ Lửa Mìn & Đá Cổ** (`#a6360e → #3d1610`), viền Cam Lửa & Vàng | Khối đá cổ ngữ cắm cờ đỏ vàng, cầu lửa & khiên vàng số `1` | `champ-caro.{webp,png}`, `champ-caro-2x.webp` |
| `sudoku` | **Số Học Huyền Bí** | `"champ-sudoku"` | **Tím Thạch Anh Chiêm Tinh** (`#6b26d1 → #2e0f66`), viền Tím Pha Lê & Vàng | **Bánh xe Thần Số Học vàng** & ngôi sao pha lê tím khắc chữ số `1–9` (số `1` vàng lớn ở tâm) đội vương miện | `champ-sudoku.{webp,png}`, `champ-sudoku-2x.webp` |
| `chess` | **Bắn Cá Hồ Đen** | `"champ-chess"` | **Xanh Ngọc Lam Thủy Cung** (`#0b6c7a → #083347`), viền Ngọc Biển & Vàng | **Mỹ nhân ngư Hồ Đen (*Harry Potter*)** tóc xanh rong biển đội vương miện, cầm đinh ba vàng & ngọc trai số `1` | `champ-chess.{webp,png}`, `champ-chess-2x.webp` |
| `blocks` | **Sinh Vật Huyền Bí** | `"champ-blocks"` | **Xanh Lá Lục Bảo Rừng Phép** (`#11693e → #08331e`), viền Lục Bảo & Vàng | Chú Niffler chibi đội vương miện ôm đồng Galleon vàng số `1` | `champ-blocks.{webp,png}`, `champ-blocks-2x.webp` |
| `jigsaw` | **Tranh Ghép Phép Thuật** | `"champ-jigsaw"` | **Xanh Lam Sapphire Sao Trời** (`#1d49b8 → #10205c` ánh Hồng Ngọc), viền Lam Tinh Tú & Vàng | **Huy chương vàng ghép tranh** viền nguyệt quế đội vương miện, đúc nổi 4 mảnh ghép & số `1` vàng ở tâm | `champ-jigsaw.{webp,png}`, `champ-jigsaw-2x.webp` |

- **Vị trí huy hiệu (`::after`)**: `width: 54px; height: 54px; top: 0; left: 50%; transform: translate(-50%, -56%);`, đi kèm `margin-top: 24px` + `padding: 23px 22px 12px 22px` + `min-width: 148px` để không bao giờ che tên người gửi hay đè lên tin nhắn phía trên (kể cả khi nhắn 1 từ ngắn).
- **Góc phụ (`::before`)**: Không gắn gì để huy hiệu ở giữa viền trên đối xứng tuyệt đối.

---

## 2. Các bước tích hợp bên repo `hpvn-archive.net` (dành cho Dev nắm repo HPVN)

### Bước 1 — Copy 18 file ảnh vào `public/`
Copy toàn bộ 18 file ảnh (`*.webp`, `*-2x.webp`, `*.png`) trong thư mục `minigame-champions/` vào `public/images/floo-items/minigame-champions/` của repo `hpvn-archive.net`:

```text
public/images/floo-items/minigame-champions/
  ├─ champ-match3.webp / champ-match3-2x.webp / champ-match3.png
  ├─ champ-caro.webp   / champ-caro-2x.webp   / champ-caro.png
  ├─ champ-sudoku.webp / champ-sudoku-2x.webp / champ-sudoku.png
  ├─ champ-chess.webp  / champ-chess-2x.webp  / champ-chess.png
  ├─ champ-blocks.webp / champ-blocks-2x.webp / champ-blocks.png
  └─ champ-jigsaw.webp / champ-jigsaw-2x.webp / champ-jigsaw.png
```

### Bước 2 — Nhúng stylesheet khung bong bóng
Dán nội dung file `minigame-champions-floo.css` (hoặc `@import`) vào file CSS diện mạo Mạng Floo / Shoutbox (ngay cạnh `"alliance-cup"`).

### Bước 3 — Whitelist 6 mã khung & gắn cho Đương Kim Hạng 1 từng Mini-Game
1. Thêm 6 mã vào `Set` whitelist `storeFrame`:
   ```ts
   const MINIGAME_CHAMPION_FRAMES = [
     'champ-match3',
     'champ-caro',
     'champ-sudoku',
     'champ-chess',
     'champ-blocks',
     'champ-jigsaw',
   ] as const;
   ```
2. Ánh xạ `uid` đang giữ **Hạng 1** của mỗi bộ môn sang mã khung `champ-${discipline}` (hoặc phát lease `168 giờ = 7 ngày` khi tổng kết tuần):
   ```ts
   // Map uid -> mã khung Hạng 1 của bộ môn người đó đang dẫn đầu (top1ByDiscipline: Partial<Record<HouseCupDisciplineId, string>>)
   function resolveMinigameTop1Frame(
     uid: string | undefined,
     top1ByDiscipline: Partial<Record<'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'jigsaw', string>>,
   ): string | undefined {
     if (!uid) return undefined;
     for (const [disc, champUid] of Object.entries(top1ByDiscipline)) {
       if (champUid === uid) return `champ-${disc}`;
     }
     return undefined;
   }
   ```

---

## 3. Tin nhắn mẫu gửi nhanh cho Admin / Dev giữ repo `hpvn-archive.net`

> Nhờ bạn tích hợp giúp mình trọn bộ **6 Khung Bong Bóng Đương Kim Hạng 1 của 6 Mini-Game** (`champ-match3`, `champ-caro`, `champ-sudoku`, `champ-chess`, `champ-blocks`, `champ-jigsaw`) trên Mạng Floo:
> - Mỗi bộ môn có màu nền Bảo Ngọc riêng biệt và huy hiệu Hạng 1 (`54×54 px`) đặt ngay chính giữa viền trên (Số Học: Bánh xe Thần Số Học `1–9`; Bắn Cá: Mỹ nhân ngư Hồ Đen Harry Potter; Tranh Ghép: Huy chương vàng ghép tranh; Bùa Gặt: Hũ kẹo Honeydukes; Dò Mìn: Khối đá cổ ngữ cắm cờ; Sinh Vật: Niffler ôm Galleon số `1`).
> 1. Copy 18 file ảnh trong `minigame-champions/` vào `public/images/floo-items/minigame-champions/`.
> 2. Dán `minigame-champions-floo.css` vào stylesheet `data-store-frame` của Mạng Floo.
> 3. Whitelist 6 mã `champ-*` và gắn cho user đang giữ Hạng 1 của từng bộ môn (code mẫu có sẵn trong `HANDOFF_HPVN_FLOO.md` kèm `preview.html` để mở xem trước). Cảm ơn bạn nhiều!

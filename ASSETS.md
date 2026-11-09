# Asset Brief — Trang Trại Hang Sóc & Thung Lũng Hogsmeade

Hướng dẫn chuẩn mỹ thuật và danh mục đầy đủ **172 sprite** trong `public/sprites/` (do **Artist** sở hữu), cùng danh mục **13 tranh nền JPG & 23 PNG bàn cờ khảo thí pháp thuật** trong `public/paintings/` (do **Agent / Developer** quản lý). Toàn bộ `172/172` sprite đều đạt chuẩn **2.5D Plinth-Free 100%** (`PLINTH_KEYS` trong `groundBlend.ts` đã xoá rỗng `0` mục tồn đọng): bao gồm 21 công trình Hang Sóc – Hogsmeade (kèm 2 rotor cánh cối xay gió & guồng nước xoay động, giàn giáo công trường & nơ cắt băng khánh thành), 12 sprite đi dạo 2 tư thế (`idle`/`walk`) của 6 thành viên nhà Weasley & Hogsmeade, 8 chân dung nhân vật Đơn Cú / Đạo Tặc / Bà Molly Hướng Dẫn, bộ 22 bụi cây trồng – trái chín – khóm hoa 2.5D (`ui_icon_crop_*`), và bộ 5 khung đất/vườn/đồng cỏ ghép rào liền mạch (`mask12`).

---

## 1. Phong cách mục tiêu: "Canon Hang Sóc × Playrix Township 2025–2026 2.5D Cozy Farm"

Kết hợp mô tả nguyên tác sách & phim *Harry Potter* về **Trang Trại Hang Sóc (The Burrow)** tại Ottery St Catchpole với chất lượng hoàn thiện 2.5D sơn ấm, căng mọng, dễ đọc của *Playrix Township / Hay Day*:

| Yếu tố | Quy tắc bắt buộc |
|---|---|
| **Không đế thớt (Plinth-Free)** | **Tuyệt đối không vẽ bệ gỗ, thớt đá hay miếng cỏ hình thoi cứng dưới chân công trình / sinh vật.** Chân tường đá, rào gỗ hoặc bàn chân nhân vật kết thúc tự nhiên trên nền trong suốt — engine tự hoà chân cỏ (`groundBlend.ts`) và vẽ bóng tiếp xúc AO ấm. |
| **Lỗ hở trong suốt (Interior Cutouts)** | Các khe hở khép kín bên trong hàng rào gỗ, nan cối xay gió, quai giỏ hoặc giữa tay nhân vật **bắt buộc phải trong suốt (`alpha = 0`)**, không để sót mảng nền trắng/xám. |
| **Viền & Độ nổi khối 2.5D** | Viền nâu gỗ sồi / espresso ấm (`#4a2c16` / `#3a2113`), **không dùng đen tuyền `#000000`**. Bề mặt vật liệu (ngói đất nung, gỗ sồi, đá rêu, kính nhà kính, bánh nướng, trái cây) được tô khối 2.5D mượt giàu chiều sâu. |
| **Ánh sáng** | Nguồn nắng vàng mật ong cố định từ **trên-trước-trái**. Mặt nghiêng bên phải nhận bóng ấm dịu. |
| **Khuôn dáng (Silhouette)** | Tỉ lệ ấm cúng, duyên dáng; nhà Hang Sóc nghiêng vẹo đặc trưng chống bằng phép thuật, ống khói/mái ngói/tán cây táo rõ nét để nhìn toàn cảnh vẫn nhận ra ngay từng xưởng. |
| **Nền** | **Trong suốt 100% (PNG RGBA).** Không chừa quầng trắng (white halo) quanh rìa alpha; với vật phẩm Bùa Gặt Honeydukes (`m3_*`) không vẽ hào quang loang chạm sát biên `160×160`. |

### Bảng màu chủ đạo Thung Lũng Hang Sóc & Hogsmeade

```
Nâu mực / viền gỗ ấm        #4a2c16   #3a2113
Đá tường kem & vữa đồng quê #f7ead2   #e5d0ab
Gỗ sồi Hang Sóc & khung lò  #9e6835   #6e391c
Vàng mật ong & đồng thau    #f5b301   #c98a00

[Ngói đất nung Hang Sóc / Lò bánh]   Đỏ gạch ấm        #c84b3c   #943126
[Nhà kho ông Arthur & Xe Ford]       Xanh ngọc Anglia  #5ec4b6   #7b8c8e
[Nhà kính Thảo Dược Victoria]        Lục bảo khung sắt #2f7d6d   #1f5449
[Tiệm Kẹo Công Tước Hogsmeade]       Hồng kem & Bạc hà #e88da2   #5ec4a8
[Cỏ đồng nội & Vườn táo bà Molly]    Xanh lá nắng ấm   #68b045   #3b782c
```

---

## 2. Quy tắc kỹ thuật theo 7 nhóm Sprite

| Nhóm | Tiền tố / Phạm vi | Kích thước canvas | Quy tắc neo & xử lý runtime |
|---|---|---|---|
| **1. Công trình, Xưởng, Ruộng/Vườn ghép, Đạo cụ động & Rừng** | Công trình + `crop_*` + `env_*` + `prop_*` | ≤ `380×380` px (`0.55 ≤ w/h ≤ 2.0`) | Chân tường/luống đất chạm sát đáy canvas, **không bệ đế**. Riêng `crop_plot_*`, `burrow_pumpkin_gnomes`, `burrow_flower_garden`, `burrow_chicken_coop` và `burrow_animal_pasture` có kích thước chuẩn `372×223` (`2:1` isometric) để ghép rào liền mạch theo `mask12`. Rotor `prop_windmill_sails` & `prop_waterwheel_rotor` tâm xoay đặt chính giữa canvas vuông. |
| **2. Chân dung nhân vật (Đơn Hàng Cú, Trận Pháp Đạo Tặc & Hướng Dẫn Bà Molly)** | `staff_*`, `guest_ron_gnome`, `npc_molly_*` | `staff_*`: cao ≤ `200` px; `npc_molly_*`: `316×360` px | Ảnh chân dung trong Bảng Đơn Hàng Cú, Trận Pháp Ngũ Ấn Đạo Tặc và hộp thoại Hướng Dẫn Tân Thủ (miễn trừ `toon.ts`, `groundBlend` & mipmap). |
| **3. Dân làng nhà Weasley & Hogsmeade đi dạo trên bản đồ** | `villager_*` (`12` sprite: `idle` + `walk`) | Cao ≤ `220` px (`0.40 ≤ w/h ≤ 1.35`) | Góc nhìn 3/4 isometric, chân chạm sát đáy canvas trong suốt (Plinth-Free), đi dạo trên đường lát & vườn thung lũng kèm tương tác vẫy chào. |
| **4. Sinh vật huyền bí & Tư thế động** | `beast_*` | Cao ≤ `240` px (`0.55 ≤ w/h ≤ 1.5`) | Góc nhìn 3/4 isometric, chân chạm đáy, **không bệ xám**. |
| **5. Phương tiện mặt nước** | `vehicle_lake_boat` | Cao ≤ `250` px (`w/h ≤ 2.2`) | Không vẽ bóng mặt đất/mặt nước riêng (engine tự vẽ). |
| **6. Bùa Gặt Honeydukes & Đá Quý** | `m3_*` | **`160×160` px vuông bắt buộc** | Chừa ≥ 6px biên trong suốt tuyệt đối quanh rìa. Phong cách **3D-toony căng mọng**, miễn trừ `toon.ts` & mipmap. |
| **7. Icon 3D HUD, Nông Sản & Đặc Sản Xưởng** | `ui_icon_*` | **`160×160` px vuông bắt buộc** | Vật phẩm 3D nổi khối rõ nét ở cả 24px lẫn 52px, miễn trừ `toon.ts` & mipmap. |

**Quy tắc chung:**
- Xuất **PNG RGBA**, nền trong suốt, không alpha premultiply.
- Dung lượng mỗi file ≤ **300 KB** (khuyến nghị nén bằng `pngquant -f 4 --strip`).
- Tên file = chính xác `key` trong `src/engine/spriteLoader.ts` và `tools/validate-sprites.mjs`.

### Kiểm tra trước khi bàn giao

```bash
node tools/validate-sprites.mjs
python3 tools/preview-toon.py public/sprites/burrow_house_canon.png out.png
```

Script `validate-sprites.mjs` kiểm tra đủ **172 sprite**, kích thước, tỉ lệ khung hình, biên trong suốt của ô vuông (`m3_*`, `ui_icon_*`), cảnh báo mảng trắng sót bên trong và dung lượng file.

---

## 3. Chế độ hiển thị 2.5D gốc & Toon tuỳ chọn

- Mặc định `SpriteRegistry` đặt `toonEnabled = false` để giữ trọn chất liệu sơn 2.5D ấm áp chuẩn Playrix Township trên toàn bộ công trình, dân làng và cây trồng.
- Khi người chơi bật chế độ *Sunlit Storybook* trong **Cài đặt → Phong cách đồ hoạ**, `src/engine/toon.ts` áp mực nâu `#4a2c16` + cel-paint 6 bậc lên world sprite nhưng vẫn **luôn miễn trừ** toàn bộ `m3_*`, `ui_icon_*` và `npc_molly_*`.
- Các sprite Canon 2.5D trong `NO_OUTLINE_KEYS` của `toon.ts` (gồm công trình `burrow_*`/`hogsmeade_*`, thiên nhiên `env_*`, đạo cụ `prop_*` và dân làng `villager_*`) khi bật *Sunlit Storybook* chỉ nhận cel-paint mềm, không chồng thêm viền mực vì viền vẽ tay đã sắc nét.

---

## 4. Danh mục đầy đủ 172 Sprite

### 4.1 Công trình, xưởng thủ công, đồng cỏ & danh thắng Trang Trại Hang Sóc – Hogsmeade (21)

| Key | Nội dung & điểm nhận diện chuẩn Canon |
|---|---|
| `burrow_house_canon` | Ngôi nhà 6 tầng vẹo vọ Hang Sóc xây chồng từ chuồng lợn đá, nhiều ống khói nghiêng, bảng `HANG SÓC` & đôi ủng cao su |
| `arthur_ford_shed` | Nhà kho tôn ghép của ông Arthur với chiếc xe bay Ford Anglia xanh ngọc thò mũi giữa đồ nghề Muggle |
| `molly_apple_bakery` | Lò nướng bánh bằng gạch đỏ rực lửa ngoài trời, bàn gỗ bày bánh táo dưới tán cây của bà Molly |
| `burrow_owl_post` | Trạm thư cú mộc mạc với cú trắng Hedwig, cú xám già Errol và cú nhỏ Pigwidgeon bên giỏ thư |
| `burrow_self_knitting_loom` | Khung đan len phép thuật ngoài hiên nhà tự động đan áo len đỏ thẫm chữ `W` vàng |
| `burrow_cider_apiary` | Xưởng ép rượu táo gỗ sồi kèm dãy thùng ong mật vàng rực dưới nắng |
| `burrow_windmill_canon` | Cối xay gió đá cổ vùng đồi Ottery quay cánh buồm vải kem nghiền bột mì vàng |
| `burrow_reed_pond_mill` | Ao ếch hoa súng bờ sỏi tự nhiên, khóm cỏ lau sậy và guồng nước gỗ của ông Arthur |
| `burrow_apple_orchard` | Rặng cây táo đỏ trĩu quả vườn bà Molly kèm giỏ mây thu hoạch |
| `burrow_chicken_coop` | **Sân Đàn Gà Mái Hang Sóc** (`2×2` isometric `372×223`, ghép rào `mask12`): sân rào gỗ đôi thoáng đãng, ổ rơm trứng gà tươi & đàn gà mái nâu nhặt thóc |
| `burrow_puffskein_pasture` | Đồng cỏ rào gỗ nuôi đàn Bông Thoa Puffskein tròn xoe lông kem vàng mềm mượt |
| `burrow_greenhouse_canon` | Nhà kính Thảo Dược Học khung sắt rèn xanh ngọc lục bảo kiểu Victoria lấp lánh nắng |
| `hagrid_pumpkin_hut` | Chòi đá tròn mái ngói xám của bác Hagrid bên luống bí ngô khổng lồ |
| `hogsmeade_stone_bridge` | Cầu vòm đá cuội phủ rêu bắc qua dòng sông Ottery dẫn sang làng Hogsmeade |
| `burrow_honeydukes_canon` | Tiệm Kẹo Công Tước Mật tường hồng pastel – mái xanh bạc hà phủ kem tuyết ngọt ngào |
| `burrow_broomsticks_canon` | Quán Ba Cây Chổi khung gỗ Tudor ấm cúng, biển hiệu 3 cây chổi & thùng Bia Bơ |
| `hogsmeade_harvest_fountain` | Đài phun nước đá mùa gặt giữa quảng trường Hogsmeade điểm bí ngô & hoa cúc vàng |
| `burrow_feast_marquee` | Lều lụa trắng viền vàng kim rực sáng đèn lồng ấm cho đại tiệc mùa gặt thung lũng |
| `burrow_pumpkin_gnomes` | **Vườn Bí Ngô Hang Sóc** (`2×2` isometric `372×223`, ghép rào `mask12`): khung gỗ sồi trồng bí ngô vàng cam tròn mọng & bắp cải xanh mướt (tách riêng hoàn toàn khỏi đàn gà, không có quỷ lùn) |
| `burrow_flower_garden` | **Ô Vườn Hoa Cảnh Hang Sóc** (`2×2` isometric `372×223`, ghép rào `mask12`): khung gỗ sồi trồng hồng đỏ Anh Quốc, cúc họa mi trắng, tulip sắc màu, mẫu đơn hồng kem & chuông xanh rừng sương |
| `burrow_animal_pasture` | **Đồng Cỏ Chăn Thả Ghép Liền Mạch** (`2×2` isometric `372×223`, ghép rào `mask12`): rào gỗ sồi hai thanh thoáng đãng bao quanh thảm cỏ ba lá xanh nắng ấm & máng nước gỗ cho đàn thú đi dạo |

### 4.2 Thửa Đất Canh Tác thống nhất (`crop_*` — 2)

| Key | Nội dung |
|---|---|
| `crop_plot_tilled` | Khung gỗ sồi **Thửa Đất Canh Tác** duy nhất (`farmland_plot`, góc isometric `2:1`, `372×223`): đất phù sa nâu tơi xốp 4 luống dùng chung cho cả 22 loại hạt giống & hoa cảnh |
| `crop_plot_sprouts` | Giai đoạn mầm non xanh mướt mọc đều trên 4 luống đất của cùng khung gỗ **Thửa Đất Canh Tác** |

### 4.3 Chân dung nhân vật Đơn Hàng Cú, Trận Pháp Ngũ Ấn Đạo Tặc, NPC Hướng Dẫn Bà Molly & Liềm gặt (8)

| Key | Nội dung & vị trí sử dụng |
|---|---|
| `staff_molly_weasley` | Chân dung Bà Molly Weasley — khung đối thủ Trận Pháp Ngũ Ấn Đạo Tặc |
| `staff_arthur_weasley` | Chân dung Ông Arthur Weasley — khung đối thủ Trận Pháp Ngũ Ấn Đạo Tặc |
| `staff_hagrid_farm` | Chân dung Bác Rubeus Hagrid — Bảng Đơn Hàng Cú & khung đối thủ Trận Pháp Ngũ Ấn Đạo Tặc |
| `guest_ron_gnome` | Chân dung Ron Weasley — khung đối thủ Trận Pháp Ngũ Ấn Đạo Tặc |
| `npc_molly_welcome` | Chân dung bán thân 2.5D Bà Molly Weasley (`316×360`) bưng giỏ bánh táo & lúa mì tươi cười vẫy chào — Bước 1 & Bước 6 Hướng Dẫn Tân Thủ |
| `npc_molly_guide` | Chân dung bán thân 2.5D Bà Molly Weasley (`316×360`) cầm sổ tay thảo dược chỉ đũa phép ấm áp — Bước 2, 3 & 4 Hướng Dẫn Tân Thủ |
| `npc_molly_cheer` | Chân dung bán thân 2.5D Bà Molly Weasley (`316×360`) hào hứng nâng Ngôi Sao Phép Thuật toả sáng — Bước 5 Hướng Dẫn Tân Thủ |
| `ui_icon_golden_sickle` | Liềm vàng gặt lúa phép thuật (dùng trên bong bóng thu hoạch ruộng chín & nút gặt) |

### 4.4 Icon 3D HUD Township, đặc sản & 22 cây trồng – hoa cảnh 2.5D (`ui_icon_*` — 44: 22 icon lẻ + 22 `ui_icon_crop_*`)

| Key | Vị trí sử dụng |
|---|---|
| `ui_icon_owl_orders` | Cú trắng Hedwig ngậm thư niêm sáp đỏ — thẻ góc trái dưới *Đơn Hàng Cú* |
| `ui_icon_seed_sack` | Bao bố hạt giống đính lá xanh — thẻ góc trái dưới *Kho Hạt* |
| `ui_icon_hammer_wand` | Búa vàng bắt chéo đũa phép — thẻ góc phải dưới *Xây Dựng* |
| `ui_icon_world_map` | Bản đồ da dê thung lũng — thẻ góc phải dưới *Bản Đồ* |
| `ui_icon_watering_can` | Bình tưới đồng lơ lửng — biểu tượng nhắc tưới nước *Aguamenti* trên ruộng |
| `ui_icon_pie_ready` | Bánh Táo / Bánh Bí Ngô vàng giòn mới ra lò |
| `ui_icon_sweater_ready` | Áo Len Đan Tay chữ `W` đỏ thẫm của bà Molly |
| `ui_icon_flour_sack` | Bao Bột Mì Cối Đá mịn trắng |
| `ui_icon_egg_basket` | Giỏ Mây Trứng Gà & Sữa Ấm Hang Sóc |
| `ui_icon_honey_jar` | Hũ Mật Ong Hoa Dại óng ánh |
| `ui_icon_cider` | Bình Rượu Táo Ủ Gỗ Sồi |
| `ui_icon_butterbeer` | Cốc Bia Bơ Kem Bọt Làng Hogsmeade |
| `ui_icon_frog_choc` | Hộp Ếch Sô-cô-la & Kẹo Công Tước Mật |
| `ui_icon_herb_elixir` | Lọ Tinh Dầu Thảo Dược Nhà Kính |
| `ui_icon_mushroom_soup` | Thố Súp Kem Bắp Cải & Nấm Rừng Nóng Hổi |
| `ui_icon_muggle_plug` | Bộ Phích Cắm & Đồ Nghề Muggle Ông Arthur (vật liệu nâng cấp Kho Nông Sản) |
| `ui_icon_flower_seeds` | Bộ Túi Hạt Giống Hoa Cổ Điển buộc dây gai (Hồng Đỏ, Thủy Tiên, Chuông Xanh) |
| `ui_icon_rose_bouquet` | Bó Hoa Hồng Đỏ Anh Quốc & Cúc Họa Mi Trắng gói giấy nâu thắt nơ vàng |
| `ui_icon_tulip_bluebell` | Giỏ Mây Đan Hoa Tulip Sắc Màu, Mẫu Đơn Hồng Kem, Thủy Tiên & Chuông Xanh |
| `ui_icon_magic_blossom` | Cặp Hoa Ánh Trăng Bạc Lam & Hoa Lửa Phượng Hoàng rực sáng ban đêm |
| `ui_icon_pasture_bell` | Chuông Đồng Chăn Thả treo cọc rào gỗ sồi đính cỏ bốn lá may mắn |
| `ui_icon_milk_wool` | Bình Thủy Tinh Sữa Kem Tươi & Cuộn Lông Cừu Trắng thắt ruy-băng đỏ |
| `ui_icon_crop_*` *(22 sprite)* | Bộ 22 khóm hoa, bụi quả & nông sản 2.5D Plinth-Free (`ottery_wheat`, `honey_carrot`, `garden_pumpkin`, `golden_corn`, `crisp_cabbage`, `burrow_potato`, `ruby_strawberry`, `burrow_apple`, `ruby_tomato`, `dew_blueberry`, `baby_mandrake`, `glow_mushroom`, `meadow_daisy`, `english_rose`, `golden_daffodil`, `rainbow_tulip`, `dried_lavender`, `hedge_sunflower`, `forest_bluebell`, `blush_peony`, `moonlight_flower`, `phoenix_fireflower`) vẽ trực tiếp trên thửa ruộng và bong bóng thu hoạch |

### 4.5 Quân cờ 3D-Toony Gác Xép Bùa Gặt Honeydukes (`m3_farm_*` — 9)

| Key | Vai trò trên bàn cờ Bùa Gặt Honeydukes |
|---|---|
| `m3_farm_strawberry` | Trái Dâu Tây Đỏ mọng nước (màu Đỏ) |
| `m3_farm_blueberry` | Trái Việt Quất Xanh phủ sương (màu Xanh Lam) |
| `m3_farm_pear` | Trái Lê Xanh Vườn Ottery (màu Xanh Lá) |
| `m3_farm_pumpkin` | Trái Bí Ngô Vàng Cam tròn trịa (màu Vàng Cam) |
| `m3_farm_plum` | Trái Mận Tím Mọng (màu Tím) |
| `m3_farm_honey` | Hũ Mật Ong Gỗ Tràn Mật Vàng (màu Mật Ong) |
| `m3_farm_pinwheel` | Chong Chóng Sắc Màu 5 cánh — vật phẩm siêu cấp quét sạch 1 loại nông sản |
| `m3_farm_jam_bomb` | Hũ Mứt Dâu Nổ — vật phẩm nổ vùng 3×3 |
| `m3_farm_crate` | Thùng Gỗ Nông Sản — chướng ngại vật thu hoạch trên bàn cờ |

### 4.6 Khu bảo tồn sinh vật huyền bí, gia súc đồng cỏ, đạo cụ động, dân làng đi dạo & Đại Sảnh Khảo Thí (`88` sprite)

- **Đồng cỏ thú phép, bến thuyền hồ, trạm cú & cảnh sắc mùa màng (16):** `niffler_den`, `hippogriff_glade`, `phoenix_perch`, `dragon_lair`, `hagrid_bowtruckle`, `thestral_grove`, `unicorn_glade`, `creature_feeder_toy`, `black_lake_boats`, `owlery_elf_hut`, `eeylops_owl_emporium`, `butterbeer_cart`, `floo_fireplace_gate`, `whomping_willow`, `halloween_arch`, `snowy_pines`.
- **Cây cối & thiên nhiên rừng thung lũng 2.5D Plinth-Free (`env_*` — 7):** `env_tree_oak`, `env_tree_pine`, `env_pine_snow`, `env_tree_magic`, `env_bush_flowers`, `env_mossy_rock`, `env_flower_patch`.
- **Đạo cụ chuyển động cối xay / guồng nước, giàn giáo thi công & băng khánh thành (`prop_*` — 4):** `prop_windmill_sails`, `prop_waterwheel_rotor`, `prop_construction_site`, `prop_ribbon_unveil`.
- **Dân làng Gia Đình Weasley & Hogsmeade đi dạo trên bản đồ (`villager_*` — 12):** `villager_molly_idle`, `villager_molly_walk`, `villager_arthur_idle`, `villager_arthur_walk`, `villager_ron_idle`, `villager_ron_walk`, `villager_ginny_idle`, `villager_ginny_walk`, `villager_hagrid_idle`, `villager_hagrid_walk`, `villager_hermione_idle`, `villager_hermione_walk`.
- **Chân dung Giáo sư Trận Pháp Ngũ Ấn Đạo Tặc (1):** `staff_wizard`.
- **Sinh vật huyền bí & Gia súc đồng cỏ 2 tư thế + thuyền gỗ Hồ Đen (21):** `beast_hen`, `beast_hen_peck`, `beast_sheep`, `beast_sheep_graze`, `beast_cow`, `beast_cow_graze`, `beast_puffskein`, `beast_puffskein_bounce`, `beast_niffler`, `beast_niffler_play`, `beast_hippogriff`, `beast_hippogriff_bow`, `beast_phoenix`, `beast_phoenix_soar`, `beast_dragon`, `beast_dragon_roar`, `beast_unicorn`, `beast_unicorn_prance`, `beast_thestral`, `beast_thestral_wings`, `vehicle_lake_boat`.
- **Bộ vật phẩm khảo thí & trợ giúp Bùa Gặt bổ trợ (`m3_*` — 18):** `m3_gem_ruby`, `m3_gem_sapphire`, `m3_gem_emerald`, `m3_gem_topaz`, `m3_gem_amethyst`, `m3_gem_candy_pink`, `m3_sp_rocket_h`, `m3_sp_bomb`, `m3_sp_snitch`, `m3_piece_scroll`, `m3_icon_star`, `m3_icon_heart`, `m3_obs_box_1`, `m3_obs_box_2`, `m3_obs_ice`, `m3_boost_hammer`, `m3_boost_cannon`, `m3_boost_shuffle`.
- **Icon 3D thanh công cụ & danh mục Build Dock (`ui_icon_*` — 9):** `ui_icon_jigsaw`, `ui_icon_accio`, `ui_icon_suitcase`, `ui_icon_path`, `ui_icon_terrain`, `ui_icon_shop`, `ui_icon_creature`, `ui_icon_decor`, `ui_icon_staff`.

*(Tổng cộng: `21 + 2 + 8 + 44 + 9 + 88 = 172` sprite PNG hợp lệ — 100% Plinth-Free).*

### 4.7 Tranh nền & Minh hoạ Bàn Cờ trong `public/paintings/` (13 JPG + 23 PNG — do Agent/Developer quản lý)

> **Lưu ý phân quyền:** Thư mục `public/paintings/` nằm ngoài phạm vi `172` sprite của `validate-sprites.mjs` và do nhóm Agent/Developer phụ trách (xem `AGENTS.md` §0).

- **5 phông nền Fullscreen cho Đại Sảnh Khảo Thí Pháp Thuật Hogwarts & Gác Xép Bùa Gặt (`777` màn/môn):**
  - `burrow_attic_bg.jpg` — **Gác Xép Bùa Gặt Honeydukes** ngập nắng mật ong (`#match3Dialog`).
  - `burrow_parlor_bg.jpg` — Phòng khách lò sưởi ấm áp nhà Hang Sóc (môn *Khảm Đá Cổ Ngữ Runes 8×8*).
  - `great_hall_chess_bg.jpg` — Đại Sảnh Đường Hogwarts nến bay lung linh (môn *Cờ Phù Thủy Đại Sảnh Đường 8×8*).
  - `potions_runes_sudoku_bg.jpg` — Hầm Độc Dược & Cổ Ngữ ánh đèn đồng ấm (môn *Ma Trận Cửu Bảo Bối 9×9*).
  - `marauder_caro_bg.jpg` — Phòng Sinh Hoạt Chung Gryffindor & Bản Đồ Đạo Tặc (môn *Trận Pháp Ngũ Ấn Đạo Tặc 13×13*).
- **8 bức tranh phong cảnh thế giới phù thủy (`p1_hogwarts_express.jpg` … `p8_hogwarts_moon.jpg`):** Minh hoạ sưu tầm trong kho tư liệu thung lũng.
- **23 tệp PNG quân cờ & vật phẩm bàn cờ 2.5D nền trong suốt:**
  - `public/paintings/chess/` (`12` file: `wk.png`..`wp.png`, `bk.png`..`bp.png`) — Bộ quân Cờ Phù Thủy Harry Potter Chibi 2.5D cẩm thạch kem vàng & hắc diện thạch.
  - `public/paintings/sudoku/` (`9` file: `relic_1.png`..`relic_9.png`) — 9 Bảo Bối Hogwarts trên bàn *Ma Trận Cửu Bảo Bối 9×9*.
  - `public/paintings/caro/` (`2` file: `phoenix_seal.png`, `dark_mark_seal.png`) — Cặp ấn sáp đối kháng Hội Phượng Hoàng & Tử Thần Thực Tử trên bàn *Trận Pháp Ngũ Ấn Đạo Tặc 13×13*.

---

## 5. Giao tiếp tên file ↔ Engine

```
public/sprites/<key>.png
        │
        ├─► src/engine/spriteLoader.ts   ← SPRITE_KEYS (danh sách 172 key) & ghép rào liền mạch mask12
        │      ├─► engine/groundBlend.ts ← hoà chân công trình tự nhiên vào cỏ (PLINTH_KEYS rỗng 0 mục)
        │      ├─► engine/toon.ts        ← tuỳ chọn viền nâu Storybook (bỏ qua m3_*, ui_icon_*)
        │      ├─► mipmap 0.5x           ← vẽ nét mịn khi thu nhỏ toàn thung lũng
        │      └─► alpha bitmask 1/4     ← click chọn chính xác theo hình dáng công trình
        │
        ├─► src/data/catalog.ts          ← spriteKey, connectableGroup, iconKey nông sản & đặc sản xưởng
        ├─► src/ui/match3Modal.ts        ← gắn quân cờ m3_farm_* lên bàn cờ gỗ sồi 777 màn Bùa Gặt Honeydukes
        └─► src/ui/hud.ts                ← gắn icon 3D ui_icon_* lên HUD Township, Đơn Hàng Cú & Lò Bánh
```

**Thêm asset mới:** thêm key vào `SPRITE_KEYS` trong `src/engine/spriteLoader.ts` **và** `REQUIRED` trong `tools/validate-sprites.mjs`, đặt file PNG vào `public/sprites/`, rồi chạy `node tools/validate-sprites.mjs`.

---

## 6. Checklist bàn giao

1. PNG RGBA, nền trong suốt 100%, **không vẽ đế thớt dưới chân công trình/sinh vật**, không để sót mảng trắng khép kín bên trong.
2. Đúng tên file trong danh mục **172 sprite**.
3. Đúng kích thước & tỉ lệ canvas theo nhóm (`160×160` vuông cho toàn bộ `m3_*` và `ui_icon_*`; `316×360` cho `npc_molly_*`).
4. `node tools/validate-sprites.mjs` báo đủ `172` sprite, `0` lỗi, `0` cảnh báo.
5. Nén ≤ 300KB (`pngquant -f 4 --strip`).

---

## 7. Trạng thái đồng bộ Plinth-Free 2.5D

Toàn bộ `9` sprite thiên nhiên/bảo tồn cũ (`whomping_willow`, `unicorn_glade` và `7` sprite `env_*`) đã được vẽ lại hoàn toàn theo chuẩn **2.5D Playrix Township Plinth-Free**, đồng thời `burrow_windmill_canon` và `burrow_reed_pond_mill` đã tách riêng rotor quay động (`prop_windmill_sails`, `prop_waterwheel_rotor`). Danh sách vá tạm `PLINTH_KEYS` trong `src/engine/groundBlend.ts` hiện rỗng (`0` sprite).

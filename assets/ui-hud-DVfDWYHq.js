import{n as Nt,o as Zs,k as ct,p as Js,q as Yt,t as Pe,u as ea,v as ta,l as sa,w as ks,x as aa,a as na,y as ia,z as os,h as oa,H as ra,i as la,A as Be,B as rs,f as ca,C as da,D as Ms,E as Ls}from"./hpvn-platform-CEnEuXKU.js";import{M as ls,j as we,g as Y,G as ut,k as le,F as Se,P as qe,D as xt,as as Zt,A as xe,Z as Ze,m as Jt,i as je,a5 as pa,f as ge,B as ga,K as ht,a as oe,l as cs,J as ma,at as Ot,aq as ba,b as De,U as ua,ac as Ft,Y as ya,E as va,a0 as fa,a4 as As,V as ha,W as Sa,$ as St,a6 as $a,H as _e,S as wa,au as Ta,av as Ca,T as ds}from"./game-data-CIg-hYYZ.js";import{bj as ye,bk as yt,bl as nt,bm as xa,G as es,bn as ka,bo as ps,bp as Ma,b9 as La,ba as Aa,bq as Pa,br as Vt,bs as Ps,bg as qa,bh as Ea,bf as Ha,be as Ba,bb as Ia,bc as Da,bd as Ra,bt as Na,bu as Ie,F as gs,bv as Oa,b0 as Et,bw as Ht,bx as Ge,a$ as Fa,by as Va,au as ms,B as _t,bz as _a,bA as We,A as Te,x as Ga,bB as za,bC as $t,bD as Ua,ah as Ke,D as it,bE as dt,d as ja,bF as Bt,bG as bs,bH as Wa,a7 as Ka,ak as Qa,bI as Xa,bJ as Ya}from"./sim-foundation-BXeSnJtU.js";import{F as st,M as vt,a as Za,g as Ja,p as en,e as Ne,f as kt,j as tn,n as sn,V as an}from"./sim-data-CeinEo2G.js";import{b4 as ze,b5 as nn,V as on,b6 as rn,S as ln}from"./sim-world-CRiPi6jx.js";import{S as cn,e as dn,P as us,M as ys,C as pn,s as vs}from"./sim-core-Dnx7Ay1l.js";import{t as gn}from"./engine-C22MZnfG.js";function b(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const wt=["path","shop","creature","decor"];function mn(e){return e.isZooFence||e.id==="burrow_stone_rune_fence"||e.id==="halloween_arch"||e.id==="hogsmeade_stone_bridge"||e.id==="floo_fireplace_gate"?"fences":e.isBench||e.id==="floating_candles_post"||e.id==="patronus_ward_lantern"?"lights":e.isFarmlandPlot||e.connectableGroup||e.id==="burrow_apple_orchard"||e.id==="whomping_willow"||e.id==="burrow_oak_tree"||e.id==="burrow_pine_tree"||e.id==="burrow_magic_tree"?"nature":"landmarks"}const bn=new Set(["path_cobble","path_snow_brick","path_wood_pier","marble_bench","floating_candles_post","patronus_ward_lantern","burrow_stone_rune_fence"]);function Ae(e){return!!e.yuleCollection||e.id.startsWith("yule_")||e.id==="snowy_pines"}function qs(e){return e.spriteKey?`/trang-trai-hang-soc/sprites/${e.spriteKey}.webp`:bn.has(e.id)?`/trang-trai-hang-soc/paintings/catalog/${e.id}.webp`:null}function ie(e){e.selectedCatalogItem=null,e.moveModeActive=!1,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.onBuildStateReset?.()}const un=12;function ui(){return[]}function yi(e,t){return[t,...e.filter(s=>s!==t)].slice(0,un)}const ot=[{mode:"none",label:"Nhiệt"},{mode:"cleanliness",label:"Vệ Sinh"},{mode:"wonder",label:"Kỳ Diệu"},{mode:"biome",label:"Sinh Thái"}],yn=[".aaa-codex-scroll",".feast-tier-list",".nb-log-list"];function Je(e){if(!e)return{boxTop:0,parentTop:0,dialogTop:0,innerScrollTops:[]};const t=e.parentElement,i=e.closest("dialog"),s=[];for(const n of yn){const a=e.querySelector(n);a&&a.scrollTop>0&&s.push({selector:n,top:a.scrollTop})}return{boxTop:e.scrollTop,parentTop:t?t.scrollTop:0,dialogTop:i?i.scrollTop:0,innerScrollTops:s}}function et(e,t,i=!1){if(!e)return;const s=e.parentElement,n=e.closest("dialog");if(i){e.scrollTop=0,s&&(s.scrollTop=0),n&&(n.scrollTop=0);return}t.boxTop>0&&(e.scrollTop=t.boxTop),s&&t.parentTop>0&&(s.scrollTop=t.parentTop),n&&t.dialogTop>0&&(n.scrollTop=t.dialogTop);for(const a of t.innerScrollTops){const p=e.querySelector(a.selector);p&&(p.scrollTop=a.top)}}function vi(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
      <div id="hudFrameTop" class="hud-frame-top">
        <!-- KHU VƯỜN HAGRID × HANG SÓC COMPACT SINGLE-ROW TOP HUD -->
        <header class="ts-top-hud hg-top-hud">
          <!-- 1. TOP-LEFT: Level Ring + Unified Supplies Pill -->
          <div class="ts-hud-topleft hg-top-left">
            <button
              id="btnOpenRoadmap"
              type="button"
              class="hg-level-btn"
              aria-label="Hồ sơ cấp độ và lộ trình 100 cấp"
              title="Cấp Độ Điền Trang &amp; Lộ Trình 100 Cấp"
            >
              <span class="hg-level-ring" aria-hidden="true">
                <span id="lblLevelNum" data-fly-target="xp" class="hg-level-num">1</span>
              </span>
              <span class="sr-only-hud">
                <span id="lblTitle">Người Khai Hoang</span>
                <span id="barLevelTopFill"></span>
                <span id="xpBarShell"><span id="barXpFill"></span><span id="lblXpFraction">0/200</span></span>
              </span>
            </button>

            <div class="hg-supplies-pill" role="group" aria-label="Tài nguyên điền trang">
              <button
                id="chipHudSickle"
                data-fly-target="galleons"
                type="button"
                class="hg-res-item"
                aria-label="Sickle — Sổ Cái và Quầy Gringotts"
                title="Sổ Cái &amp; Quầy Gringotts"
              >
                <span class="hg-res-glyph hg-glyph-coin" aria-hidden="true">S</span>
                <span id="lblSickle" class="hg-res-val">1.450</span>
                <span id="btnPlusSickle" class="sr-only-hud">+</span>
              </button>

              <span
                id="btnHudSandChip"
                data-fly-target="sand"
                class="hg-res-item is-readonly"
                aria-label="Cát Thời Gian"
                title="Cát Thời Gian"
              >
                <span class="hg-res-glyph hg-glyph-gem" aria-hidden="true">◆</span>
                <span id="lblSand" class="hg-res-val">28</span>
                <span id="btnPlusSand" class="sr-only-hud">+</span>
              </span>

              <span
                id="btnHudMinigameHub"
                data-fly-target="stars"
                class="hg-res-item is-readonly"
                aria-label="Sao Phép Thuật"
                title="Sao Phép Thuật"
              >
                <img src="/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="hg-res-star-img" aria-hidden="true" />
                <strong id="lblHudHubStars" class="hg-res-val">3</strong>
                <span id="lblHudHubTrial" class="sr-only-hud"></span>
              </span>

              <button
                id="btnHudActiveBuilds"
                type="button"
                class="hg-res-item hg-res-build hidden"
                aria-label="Công trình đang xây dựng"
                title="Đang xây"
              >
                <span aria-hidden="true">🔨</span>
                <span id="lblActiveBuilds" class="hg-res-val">0</span>
              </button>
            </div>
          </div>

          <div id="tsParchmentBanner" class="sr-only-hud" aria-hidden="true">
            <span id="lblParkRibbonName">Hang Sóc</span>
          </div>

          <!-- 3. TOP-RIGHT: Hagrid's Farm Round Brass Buttons (Kho · Floo/Bạn Bè · Menu Vườn) -->
          <div class="ts-hud-topright hg-top-actions">
            <button
              id="chipHudBarn"
              type="button"
              class="hg-round-btn"
              aria-label="Mở Kho Nông Sản và Xưởng Chế Biến"
              title="Kho Nông Sản &amp; Xưởng Chế Biến Hang Sóc"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 42 42" class="hg-round-svg" aria-hidden="true">
                  <path d="M5 18 L21 6 L37 18 L34 18 L34 36 L8 36 L8 18 Z" fill="#d94632" stroke="#231f2e" stroke-width="2.6" stroke-linejoin="round"/>
                  <path d="M4 19 L21 6 L38 19" fill="none" stroke="#f7e6c4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="14" y="21" width="14" height="15" fill="#992315" stroke="#f7e6c4" stroke-width="1.8"/>
                  <path d="M14 21 L28 36 M28 21 L14 36" stroke="#f7e6c4" stroke-width="1.8"/>
                </svg>
              </span>
              <small id="lblStorageBarn" class="hg-round-count">42/60</small>
              <span id="btnOpenStorageBarn" class="sr-only-hud">Kho</span>
            </button>

            <button
              id="btnOpenNeighbors"
              data-fly-target="friendship"
              type="button"
              class="hg-round-btn"
              aria-label="Mạng Floo và Thăm Vườn Bạn Bè"
              title="Mạng Floo &amp; Thăm Vườn Bạn Bè (Phím N)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <img src="/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-round-img" aria-hidden="true" />
              </span>
              <span id="badgeNeighborCount" class="hg-round-badge hidden">1</span>
            </button>

            <button
              id="btnToggleManageMenu"
              type="button"
              class="hg-round-btn hg-menu-btn"
              aria-label="Menu khu vườn"
              aria-expanded="false"
              aria-controls="managePopoverMenu"
              title="Menu Khu Vườn (Bản Đồ, Lễ Hội, Cúp Nhà, Sổ Tay, Đổi Game &amp; Cài Đặt)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 36 36" class="hg-round-svg" aria-hidden="true">
                  <rect x="8.5" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="8.5" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                </svg>
              </span>
              <span id="badgeManageMenuDot" class="hg-round-badge hidden">!</span>
            </button>
          </div>
        </header>

        <!-- MENU KHU VƯỜN (PHONG CÁCH VƯỜN HAGRID — GỌN GÀNG, RÕ RÀNG, ĐẦY ĐỦ BẢN ĐỒ & ĐỔI GAME) -->
        <nav id="managePopoverMenu" class="hud-floating-popover hg-garden-menu hidden" aria-label="Menu khu vườn">
          <div class="hg-menu-head">
            <div class="hg-menu-brand">
              <span class="hg-menu-seal" aria-hidden="true">🌿</span>
              <div>
                <strong class="hg-menu-title">Menu Khu Vườn</strong>
                <small class="hg-menu-sub">Hang Sóc &amp; Hogsmeade</small>
              </div>
            </div>
            <button id="btnCloseManageMenu" type="button" class="hpvn-menu-close" aria-label="Đóng">✕</button>
          </div>

          <div class="manage-status-strip hg-menu-status">
            <span id="btnHudStarChip" class="stat-chip" title="Sao Phép Thuật"><img src="/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></span>
            <span id="btnHudHeartChip" class="stat-chip" title="Tim Bùa Gặt"><img src="/trang-trai-hang-soc/sprites/m3_icon_heart.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></span>
            <button id="btnHappySmiley" type="button" class="stat-chip stat-chip-btn" title="Sổ Cái">Vui <span id="lblWonder">4.5</span></button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">--:--</button>
          </div>

          <!-- Lưới điểm đến chuẩn Vườn Hagrid: Bản đồ, Thăm vườn, Hồ sơ/Cúp Nhà, Lễ hội, Sổ tay, Vali, Kho, Việc quê, Cài đặt -->
          <p class="hg-menu-group" id="hgMenuGroupPlaces">Điểm đến</p>
          <div class="hg-menu-grid" role="group" aria-labelledby="hgMenuGroupPlaces">
            <button id="btnOpenWorldMap" type="button" class="hg-menu-node" title="Đại Bản Đồ 10 Vùng Đất &amp; Lộ Trình 100 Cấp">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_world_map.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Bản Đồ</span>
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="hg-menu-node" title="Cổng Floo &amp; Thăm Vườn Bạn Bè (Phím N)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Thăm Vườn</span>
              <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenAlbum" type="button" class="hg-menu-node" title="Hồ Sơ, Cúp 4 Nhà &amp; Bảng Xếp Hạng">
              <span class="hg-menu-medal" aria-hidden="true">🏆</span>
              <span class="hg-menu-label">Hồ Sơ &amp; BXH</span>
              <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenHarvestFeast" type="button" class="hg-menu-node" title="Đại Tiệc Mùa Gặt Hang Sóc (30 Bậc)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Lễ Hội</span>
              <span id="badgeFeastCount" class="badge-dot hidden">1</span>
              <span id="badgeManageFeastCount" class="sr-only-hud hidden">0</span>
            </button>
            <button id="btnOpenMenuSeedQuiz" type="button" class="hg-menu-node" title="Sổ Tay Cổ Ngữ &amp; Học Viện Thần Chú Đa Ngữ">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_notebook.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Tay</span>
            </button>
            <button id="btnOpenSuitcase" type="button" class="hg-menu-node" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_icon_suitcase.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Vali Thú</span>
              <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="hg-menu-node" title="Kho Nông Sản, Xưởng Chế Biến &amp; Tàu Hàng">
              <span class="hg-menu-medal" aria-hidden="true">🏡</span>
              <span class="hg-menu-label">Kho Xưởng</span>
              <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenFinance" type="button" class="hg-menu-node" title="Sổ Cái Tài Chính &amp; Việc Quê">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_ledger.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Cái</span>
            </button>
            <button id="btnOpenSettings" type="button" class="hg-menu-node" title="Cài Đặt Âm Nhạc, Thời Tiết &amp; Lưu Game">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/trang-trai-hang-soc/sprites/ui_settings_gear.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Cài Đặt</span>
            </button>
          </div>

          <!-- HPVN 15/11: each group has a small name; seven games by their short tab names plus BXH, on the same 3-column grid -->
          <p class="hg-menu-group" id="hgMenuGroupGames">Trò chơi</p>
          <div class="hg-menu-games-pills" role="group" aria-labelledby="hgMenuGroupGames">
            <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — ${ls.toLocaleString("vi-VN")} Màn (Phím J)">
              Bùa Gặt <small id="lblMatch3Lv" class="sr-only-hud">1/${ls}</small>
            </button>
            <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Dò Mìn Phép Thuật — ${we.toLocaleString("vi-VN")} Màn (Phím K)">
              Dò Mìn <small id="lblArcadeTowerLv" class="sr-only-hud">0/${we*5}</small>
            </button>
            <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" aria-label="Số Học Huyền Bí" title="Số Học Huyền Bí — ${we.toLocaleString("vi-VN")} Màn">Số Học</button>
            <button type="button" data-switch-minigame="blocks" class="hg-game-pill" aria-label="Sinh Vật Huyền Bí" title="Sinh Vật Huyền Bí — ${we.toLocaleString("vi-VN")} Màn">Sinh Vật</button>
            <button type="button" data-switch-minigame="jigsaw" class="hg-game-pill" aria-label="Tranh Ghép Phép Thuật" title="Tranh Ghép Phép Thuật — ${we.toLocaleString("vi-VN")} Màn">Tranh Ghép</button>
            <button type="button" data-switch-minigame="chess" class="hg-game-pill" aria-label="Bắn Cá Hồ Đen" title="Bắn Cá Hồ Đen — ${we.toLocaleString("vi-VN")} Màn">Bắn Cá</button>
            <button type="button" data-switch-minigame="seedquiz" class="hg-game-pill" aria-label="Học Viện Thần Chú">Thần Chú</button>
          </div>

          <p class="hg-menu-group" id="hgMenuGroupTools">Công cụ</p>
          <div class="hg-menu-tools-row" role="group" aria-labelledby="hgMenuGroupTools">
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh &amp; vàng">Accio</button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" aria-pressed="false" title="Ghim bảng nhiệm vụ">Ghim NV</button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" aria-pressed="false" title="Hiện/ẩn Radar thu nhỏ">Radar</button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">Nhiệt</button>
            <button id="btnPhotoMode" type="button" class="brass-btn" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để chụp ảnh (Phím P)">Ảnh</button>
            <button id="btnMenuRotateCam" type="button" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">Bắc</button>
            <button id="btnMenuCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">Xuyên</button>
            <button id="btnMenuGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">Lưới</button>
            <button id="btnMenuLayoutEdit" type="button" aria-pressed="false" class="brass-btn" title="Chế độ quy hoạch toàn cảnh (Lưu/Hủy nháp &amp; 3 bản vẽ)">Quy hoạch</button>
            <button id="btnMenuStrollMode" type="button" aria-pressed="false" class="brass-btn" title="Chế độ đi dạo nhập vai trong thung lũng">Đi dạo</button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn" aria-pressed="false" title="Cuộn gọn thanh HUD quanh màn hình (Phím H)">Ẩn HUD</button>
            <!-- HPVN: the legal screen is gone, so no «Pháp Lý» button -->
            <button id="btnOpenZones" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Bản Đồ</button>
            <button id="btnToggleHudRollup" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true"><svg><path id="svgHudRollupChevron" d="M13.5 23 L18 18.5 L22.5 23"/></svg></button>
            <button id="btnManageOpenFeast" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Lễ Hội</button>
          </div>
        </nav>

        <!-- COZY PROGRESSIVE-DISCLOSURE POPOVER 2: LIVE WEATHER FORECAST & PARK SPEED -->
        <div id="weatherPopoverMenu" class="hud-floating-popover hidden" role="region" aria-label="Dự báo thời tiết và tốc độ công viên"></div>

        <!-- YULE EVENT BANNER -->
        <button id="yuleEventBanner" type="button" class="yule-event-banner hidden" aria-label="Mở nhiệm vụ Yule">
          <span class="yule-event-banner-icon">🎄</span>
          <span><strong id="yuleEventBannerTitle">Yule</strong><small id="yuleEventBannerTask"></small></span>
          <span id="yuleEventBannerProgress" class="yule-event-banner-progress"></span>
        </button>

        <!-- DRAGGABLE FLOATING BANNER -->
        <div id="floatingModeBanner" class="parchment-dark floating-action-banner hidden">
          <span
            id="floatingBannerGrip"
            class="drag-handle drag-grip hidden"
            tabindex="0"
            role="button"
            aria-label="Kéo hoặc nhấn phím mũi tên để di chuyển thanh điều khiển nổi"
            title="Kéo hoặc dùng phím mũi tên để di chuyển"
          >⠿</span>
          <span id="floatingBannerText" class="floating-banner-text"></span>
          <div class="floating-banner-btns">
            <button id="btnFloatingAutoPlace" type="button" class="brass-btn gold-cta hidden" style="padding:4px 10px;font-size:12px;">⚡ Đặt Ngay</button>
            <button id="btnFloatingSecondary" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingSwap" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingExit" type="button" class="brass-btn gold-cta" aria-label="Thoát" style="padding:4px 8px;font-size:12px;">✕</button>
          </div>
        </div>

        <div class="hud-side-row">
          <!-- LEFT QUEST TRACKER (Hidden by default in clean Township view; toggleable) -->
          <aside id="questTrackerPanel" class="parchment-panel quest-tracker hidden" aria-label="Nhiệm vụ đang làm">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div class="hs-section-title">🦉 Nhiệm Vụ</div>
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!e.questCollapsed}" style="padding:3px 9px;font-size:12px;">${e.questCollapsed?"+":"–"}</button>
            </div>
            <div id="questTrackerBody" class="${e.questCollapsed?"hidden":""}"></div>
          </aside>
        </div>
      </div>

      <!-- TOUCH PLACEMENT CONFIRM BAR (App Store Mobile/Tablet UX) -->
      <div id="touchConfirmBar" class="parchment-dark touch-confirm-bar hidden">
        <span id="lblTouchConfirm" style="font-size:13px;font-weight:700;color:#fde68a;"></span>
        <button id="btnTouchConfirmOk" type="button" class="brass-btn gold-cta" aria-label="Đặt">✓</button>
        <button id="btnTouchRotate" type="button" class="brass-btn" aria-label="Xoay">↻</button>
        <button id="btnTouchStash" type="button" class="brass-btn hidden" aria-label="Cất vào kho" title="Cất vào Kho Trang Trí (0 Sickle)">Cất</button>
        <button id="btnTouchCancel" type="button" class="brass-btn" aria-label="Hủy">✕</button>
      </div>

      <!-- INTERACTIVE ISOMETRIC MINIMAP (Tucked cleanly until requested) -->
      <div id="minimapWrap" class="parchment-dark minimap-wrap ts-minimap-docked hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="minimap-title">🧭 Radar</span>
          <button id="btnToggleMinimap" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng bản đồ thu nhỏ" aria-expanded="${!e.minimapCollapsed}" style="padding:2px 7px;font-size:12px;">${e.minimapCollapsed?"+":"–"}</button>
        </div>
        <canvas id="minimapCanvas" class="${e.minimapCollapsed?"hidden":""}" width="168" height="102" aria-label="Bản đồ thu nhỏ công viên"></canvas>
      </div>

      <!-- PHOTO MODE FLOATING BAR -->
      <div id="photoModeBar" class="parchment-dark photo-mode-bar hidden">
        <span style="font-size:13px;font-weight:700;color:#fde68a;">Chụp ảnh</span>
        <button id="btnSavePhotoPng" type="button" class="brass-btn gold-cta">🔥 Floo</button>
        <button id="btnSaveYulePostcard" type="button" class="brass-btn yule-postcard-btn" title="Gửi ảnh thiệp Giáng Sinh khung thông tuyết qua Mạng Floo">Khung Thiệp</button>
        <button id="btnExitPhoto" type="button" class="brass-btn" aria-label="Thoát chế độ chụp ảnh">✕</button>
      </div>

      <!-- BUILDER LAYOUT EDIT MODE FLOATING BAR -->
      <div id="layoutEditBar" class="parchment-dark photo-mode-bar hidden" role="toolbar" aria-label="Chế độ quy hoạch toàn cảnh">
        <span style="font-size:12px;font-weight:700;color:#fde68a;">🔨 Quy hoạch</span>
        <button type="button" data-edit-preset="layout_1" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 1</button>
        <button type="button" data-edit-preset="layout_2" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 2</button>
        <button type="button" data-edit-preset="layout_3" class="brass-btn" style="padding:4px 8px;font-size:12px;">Bản 3</button>
        <button id="btnEditSavePreset" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;" title="Lưu bố cục hiện tại vào ô bản vẽ đang chọn">Lưu bản</button>
        <button id="btnEditStashAll" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;">📦 Cất TT</button>
        <button id="btnEditRestoreAll" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;">🌸 Bày lại</button>
        <button id="btnEditCommit" type="button" class="brass-btn gold-cta" style="padding:4px 10px;font-size:12px;">✓ Lưu</button>
        <button id="btnEditCancel" type="button" class="brass-btn" style="padding:4px 8px;font-size:12px;" title="Hoàn nguyên về trước khi quy hoạch">✕ Hủy</button>
      </div>

      <!-- COMPACT RESTORE PILL WHEN HUD IS ROLLED UP -->
      <button
        id="btnHudRoundOrb"
        type="button"
        class="hud-round-orb-btn hidden"
        aria-pressed="false"
        aria-label="Hiện giao diện HUD"
      >
        <span id="lblHudRoundOrbTag" class="hud-round-orb-tag">Hiện HUD</span>
      </button>

      <!-- TOAST STACK -->
      <div id="toastStack" class="owl-toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>

      <!-- RIBBON UNVEIL WEASLEY CELEBRATION BANNER -->
      <div id="ribbonUnveilToastCard" class="ribbon-unveil-banner hidden" role="status" aria-live="polite"></div>

      <!-- FLY-TO-HUD WEB ANIMATIONS LAYER -->
      <div id="flyRewardLayer" class="fly-reward-layer" aria-hidden="true"></div>

      <!-- 4. BOTTOM-LEFT UNIFIED 4-CARD FARM & BUILD DOCK: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Xây Dựng -->
      <div id="tsCornerLeft" class="ts-corner-left hg-farm-dock" role="toolbar" aria-label="Nông trại và xây dựng">
        <button id="btnOpenQuests" type="button" class="ts-card-btn hg-dock-card" title="Đơn Hàng Cú &amp; Nhiệm Vụ Cốt Truyện" aria-label="Đơn Hàng Cú &amp; Nhiệm Vụ">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Đơn Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Hạt Giống &amp; Hoa Hang Sóc" aria-label="Kho Hạt Giống">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Kho Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Đồng Cỏ Chăn Thả" aria-label="Đồng Cỏ Chăn Thả">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_pasture_bell.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Chăn Thả</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Xây Dựng Bản Vẽ Công Trình" aria-label="Xây Dựng">
          <img src="/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Xây Dựng</span>
          <span id="badgeBuildReadyCount" class="ts-red-badge is-ready-green hidden">1</span>
        </button>
      </div>

      <!-- 5. BOTTOM-RIGHT HERO PLAY BUTTON: Mở lại ngay trò chơi cuối cùng vừa được chơi -->
      <div id="tsCornerRight" class="ts-corner-right hg-play-corner">
        <button
          id="btnCornerPlayPuzzle"
          type="button"
          class="ts-card-btn ts-card-lg ts-card-play-stage hg-hero-play-btn"
          aria-label="Chơi tiếp trò chơi vừa chơi"
          title="Chạm để quay lại ngay trò chơi cuối cùng vừa được chơi"
        >
          <span id="badgeCornerPlayBonus" class="hg-play-game-tag">Bùa Gặt</span>
          <span class="hg-play-emblem" aria-hidden="true">
            <img id="imgCornerPlayIcon" src="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp" alt="" class="ts-card-art hg-play-art" />
            <span class="hg-play-triangle">▶</span>
          </span>
          <span id="lblCornerPlayStage" class="ts-card-label hg-play-stage">Màn 1</span>
          <small id="lblCornerPlaySub" class="hg-play-sub">0/1 màn</small>
        </button>
      </div>

      <!-- FLOATING SEED BRUSH TRAY (Swipe-to-Plant across unified Thửa Đất Canh Tác) -->
      <section id="seedBrushTray" class="parchment-panel seed-brush-tray hidden" aria-label="Túi hạt giống gieo nhanh"></section>

      <!-- FLOATING PASTURE ANIMAL BRUSH TRAY (Swipe-to-Stock across unified Đồng Cỏ Chăn Thả) -->
      <section id="pastureBrushTray" class="parchment-panel seed-brush-tray pasture-brush-tray hidden" aria-label="Khay chọn thú chăn thả"></section>

      <!-- BOTTOM OBJECT INSPECTOR SHEET -->
      <aside id="inspectorPanel" class="parchment-panel inspector-panel hidden" aria-label="Chi tiết đối tượng"></aside>

      <!-- VISITOR READ-ONLY & CO-OP DOCK BAR -->
      <section id="visitorDockBar" class="parchment-panel visitor-dock-bar hidden" aria-label="Thanh tham quan và trợ giúp vườn bạn bè"></section>

      <!-- BOTTOM BUILD DOCK SHEET (Pops open cleanly above corner cards when "Xây Dựng" is active) -->
      <section id="bottomDockWrap" class="bottom-dock-wrap ts-build-sheet" aria-label="Thanh công cụ xây dựng">
        <div id="buildDrawerSwipeBar" class="build-drawer-swipe-bar hidden">
          <span id="buildDrawerCatLabel" class="build-drawer-cat-label">🏗️ Danh Mục Xây Dựng</span>
          <div class="build-drawer-scroll-ctrls">
            <span id="buildDrawerSwipeHint" class="build-drawer-swipe-hint" aria-hidden="true">↔ Vuốt ngang</span>
            <button id="btnDrawerScrollPrev" type="button" class="drawer-nav-pill" aria-label="Cuộn sang trái">‹</button>
            <button id="btnDrawerScrollNext" type="button" class="drawer-nav-pill" aria-label="Cuộn sang phải">›</button>
          </div>
        </div>
        <div id="decorCollectionFilterBar" class="decor-collection-filter-bar hidden" role="tablist" aria-label="Bộ sưu tập trang trí"></div>
        <div id="buildDrawer" class="parchment-panel build-drawer hidden"></div>

        <div id="secondaryMapToolsBar" class="parchment-dark secondary-map-tools-bar hidden" role="toolbar" focusgroup="toolbar wrap" aria-label="Công cụ xây dựng chính" aria-controls="gameCanvas">
          <div role="group" aria-label="Thao tác công trình" class="build-toolbar-group">
            <button id="btnMoveTool" type="button" aria-pressed="false" class="brass-btn" title="Di dời công trình (Phím M)">✋ Dời</button>
            <button id="btnBulldoze" type="button" aria-pressed="false" class="brass-btn" title="Xóa công trình hoặc đường (Phím X)">🧹 Xóa</button>
            <button id="btnRotate" type="button" class="brass-btn" title="Xoay công trình 90° (Phím R)">🔄 Xoay</button>
            <button id="btnToggleLayoutEdit" type="button" aria-pressed="false" class="brass-btn" title="Bật/tắt Chế Độ Quy Hoạch Nháp (có Lưu / Hoàn nguyên &amp; 3 Bản vẽ)">🔨 Quy hoạch</button>
          </div>
          <span role="separator" aria-orientation="vertical" class="build-toolbar-sep"></span>
          <div role="group" aria-label="Hoàn tác và đóng" class="build-toolbar-group">
            <button id="btnBuildUndo" type="button" aria-disabled="true" class="brass-btn" title="Hoàn tác xây dựng (Ctrl/Cmd+Z)">↶ Hoàn tác</button>
            <button id="btnBuildRedo" type="button" aria-disabled="true" class="brass-btn" title="Làm lại xây dựng (Ctrl/Cmd+Y)">↷ Làm lại</button>
            <button id="btnBuildDone" type="button" class="brass-btn gold-cta" title="Đóng chế độ xây dựng (Esc)">✓ Xong</button>
          </div>
        </div>

        <div class="parchment-dark bottom-bar" role="group" aria-label="Nhóm công trình xây dựng">
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_shop.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Công Trình</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_creature.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Sản Xuất</button>
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_path.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Đường</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_icon_decor.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Trang Trí</button>
          <button type="button" data-decor-event="christmas" aria-pressed="false" class="brass-btn"><img src="/trang-trai-hang-soc/sprites/ui_gift_box.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Giáng Sinh</button>
        </div>
      </section>

      <!-- TOWNSHIP SOFT SPOTLIGHT RING FOR ACTIVE TUTORIAL HUD TARGET (Must follow HUD targets in tree order for CSS Anchor Positioning) -->
      <div id="tutorialHudSpotlight" class="tutorial-hud-spotlight hidden" aria-hidden="true">
        <span id="tutorialHudSpotlightLabel" class="tutorial-hud-spotlight-pill">👇</span>
      </div>

      <!-- BÀ MOLLY WEASLEY 2.5D PERSISTENT TUTORIAL COACH POPOVER -->
      <div
        id="tutorialCoachCard"
        class="tutorial-coach-card"
        popover="manual"
        role="dialog"
        aria-labelledby="tutorialCoachTitle"
      ></div>

      <!-- DIALOG 1: OWL ORDER BOARD & STORY JOURNAL -->
      <dialog id="questDialog" closedby="any" aria-labelledby="questDialogTitle">
        <div class="parchment-panel modal-inner owl-orders-modal-inner">
          <div class="modal-header">
            <h2 id="questDialogTitle" class="modal-title">Đơn Cú &amp; Nhiệm Vụ</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="questDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 2: 100 LEVELS & 10 ZONES ROADMAP -->
      <dialog id="roadmapDialog" closedby="any" aria-labelledby="roadmapDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="roadmapDialogTitle" class="modal-title">Bản Đồ &amp; Lộ Trình</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="roadmapDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 3: FINANCE & MICRO-PRICING -->
      <dialog id="financeDialog" closedby="any" aria-labelledby="financeDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="financeDialogTitle" class="modal-title">Sổ Cái</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="financeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 4: UNIFIED PROFILE, HOUSE CUP & MINIGAME LEADERBOARDS -->
      <dialog id="albumDialog" closedby="any" aria-labelledby="albumDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="albumDialogTitle" class="modal-title">Hồ Sơ &amp; Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="albumDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 5: SETTINGS, BGM, SAVE & HEADMASTER PREVIEW -->
      <dialog id="settingsDialog" closedby="any" aria-labelledby="settingsDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="settingsDialogTitle" class="modal-title">Cài Đặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="settingsDialogContent"></div>
        </div>
      </dialog>

      <!-- HPVN: confirm before a demolition destroys a ready crop / animals / workshop job -->
      <dialog id="confirmDialog" closedby="any" aria-labelledby="confirmDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="confirmDialogTitle" class="modal-title">Xóa công trình?</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="confirmDialogText"></div>
          <div>
            <button id="btnConfirmKeep" type="button" class="brass-btn">Giữ lại</button>
            <button id="btnConfirmDelete" type="button" class="brass-btn gold-cta">Vẫn xóa</button>
          </div>
        </div>
      </dialog>

      <!-- DIALOG 6: OFFLINE WELCOME BACK -->
      <dialog id="offlineDialog" closedby="any" aria-labelledby="offlineDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="offlineDialogTitle" class="modal-title">Thu Hoạch Offline</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="offlineDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 7: FARMSTEAD STORAGE BARN, WORKSHOP, CARGO TRAIN & SYNERGIES -->
      <dialog id="workshopDialog" closedby="any" aria-labelledby="workshopDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="workshopDialogTitle" class="modal-title">Kho &amp; Xưởng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="workshopDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 8: MAGICAL CREATURE SANCTUARY SUITCASE -->
      <dialog id="suitcaseDialog" closedby="any" aria-labelledby="suitcaseDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="suitcaseDialogTitle" class="modal-title">Vali Thú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="suitcaseDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 9: ATTIC HARVEST MATCH-3 -->
      <dialog id="match3Dialog" closedby="any" aria-labelledby="match3DialogTitle">
        <div class="parchment-panel modal-inner m3-modal-inner">
          <div class="modal-header">
            <h2 id="match3DialogTitle" class="modal-title">Bùa Gặt Honeydukes</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title">Dò Mìn Phép Thuật</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">Học Viện Thần Chú</h2>
            <button id="btnSqHeaderSubView" type="button" class="brass-btn sq-header-subview-btn">Từ điển</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">Cổng Floo</h2>
            <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta nb-bxh-chip">BXH</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="neighborDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 13: HARVEST FEAST 30-TIER ACTION SEASON PASS -->
      <dialog id="harvestFeastDialog" closedby="any" aria-labelledby="harvestFeastDialogTitle">
        <div class="parchment-panel modal-inner feast-modal-inner">
          <div class="modal-header">
            <h2 id="harvestFeastDialogTitle" class="modal-title">Lễ Hội Mùa Gặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="harvestFeastDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 14: HOUSE CUP STARTUP INFO POPUP -->
      <dialog id="houseCupIntroDialog" closedby="any" aria-labelledby="houseCupIntroDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="houseCupIntroDialogTitle" class="modal-title">Cúp 4 Nhà Hogwarts</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="houseCupIntroDialogContent"></div>
        </div>
      </dialog>

    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function fi(e){const t=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(r=>{r.addEventListener("click",()=>{const y=r.dataset.switchMinigame;e.closeHudPopovers(),!y||y==="match3"?e.openMatch3Dialog():y==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(y)})});const i=()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog")?.showModal()};e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",t),e.root.querySelector("#chipHudSickle")?.addEventListener("click",i),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")});const s=r=>{r?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",r=>{r.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",r=>{r.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",s),e.root.querySelector("#chipHudBarn")?.addEventListener("click",s),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive)e.collapseBuildDock(),ie(e);else{const y=e.selectedCatalogItem,f=!!(y&&Ae(y)),$=y?.category;e.closeSeedTray(),e.closePastureTray(),ie(e),e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=f,e.activeCategory=f?"decor":$&&wt.includes($)?$:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers();const r=e.root.querySelector("#questTrackerPanel");r?.classList.toggle("hidden"),e.root.querySelector("#btnToggleQuestTrackerHud")?.setAttribute("aria-pressed",String(!!r&&!r.classList.contains("hidden")))}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const r=e.sim.getActiveConstructions(Date.now());if(r.length===0)return;e.activeBuildCycleIdx=(e.activeBuildCycleIdx+1)%r.length;const y=r[e.activeBuildCycleIdx],f=Y(y.itemId),$=y.gx+(f?.width??1)*.5,M=y.gy+(f?.height??1)*.5;ie(e),e.onFocusGridSmooth?e.onFocusGridSmooth($,M,Math.max(e.cam.zoom,.95)):ye(e.cam,$,M),e.inspectSelection={kind:"building",uid:y.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",r=>{r.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnHudRoundOrb")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#lblClock")?.addEventListener("click",r=>{r.stopPropagation(),e.toggleWeatherPopover()});const n=()=>{if(e.closeHudPopovers(),e.sim.isLayoutEditModeActive()){const r=e.sim.commitLayoutEditMode();ie(e),e.showToast(r.msg,"🔨")}else{const r=e.sim.enterLayoutEditMode();r.ok&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0),e.showToast(r.msg,r.ok?"🔨":"⚠️")}e.refreshAll()};e.root.querySelector("#btnToggleLayoutEdit")?.addEventListener("click",n),e.root.querySelector("#btnMenuLayoutEdit")?.addEventListener("click",n),e.root.querySelector("#btnMenuStrollMode")?.addEventListener("click",()=>{e.closeHudPopovers(),ie(e);const r=e.sim.toggleStrollMode();e.showToast(r.msg,"🧙"),e.refreshAll()}),e.root.querySelector("#btnEditCommit")?.addEventListener("click",()=>{const r=e.sim.commitLayoutEditMode();ie(e),e.showToast(r.msg,"🔨"),e.refreshAll()}),e.root.querySelector("#btnEditCancel")?.addEventListener("click",()=>{const r=e.sim.cancelLayoutEditMode();ie(e),e.showToast(r.msg,"↩"),e.refreshAll()}),e.root.querySelector("#btnEditStashAll")?.addEventListener("click",()=>{const r=e.sim.stashAllDecorItems();e.showToast(r.msg,r.ok?"📦":"⚠️"),e.refreshAll()}),e.root.querySelector("#btnEditRestoreAll")?.addEventListener("click",()=>{const r=e.sim.restoreAllStashedDecor();e.showToast(r.msg,r.ok?"🌸":"⚠️"),e.refreshAll()}),e.root.querySelectorAll("[data-edit-preset]").forEach(r=>{r.addEventListener("click",()=>{const y=r.dataset.editPreset;if(e.sim.activePresetSlot=y,e.sim.state.layoutPresets?.[y]){const f=e.sim.applyLayoutPreset(y);e.showToast(f.msg,f.ok?"🔨":"⚠️")}else{const f=e.sim.saveLayoutPreset(y);e.showToast(`Đã lưu "${f.label}" (${f.placements.length} công trình)!`,"🔨")}e.refreshAll()})}),e.root.querySelector("#btnEditSavePreset")?.addEventListener("click",()=>{const r=e.sim.activePresetSlot||"layout_1",y=e.sim.saveLayoutPreset(r);e.showToast(`Đã cập nhật "${y.label}" (${y.placements.length} công trình)!`,"🔨"),e.refreshAll()});const a=e.root.querySelector("#secondaryMapToolsBar");if(a&&typeof HTMLElement<"u"&&!("focusGroup"in HTMLElement.prototype)){const r=Array.from(a.querySelectorAll("button"));r.forEach((y,f)=>{y.tabIndex=f===0?0:-1}),a.addEventListener("focusin",({target:y})=>{y instanceof HTMLButtonElement&&r.includes(y)&&r.forEach(f=>{f.tabIndex=f===y?0:-1})}),a.addEventListener("keydown",y=>{if(r.length===0)return;const f=Math.max(0,r.findIndex(I=>I===document.activeElement)),$=typeof getComputedStyle=="function"&&getComputedStyle(a).direction==="rtl";let M=-1;y.key==="ArrowRight"?M=(f+($?-1:1)+r.length)%r.length:y.key==="ArrowLeft"?M=(f+($?1:-1)+r.length)%r.length:y.key==="Home"?M=0:y.key==="End"&&(M=r.length-1),M>=0&&(y.preventDefault(),r[M]?.focus())})}const p=r=>{const y=e.root.querySelector("#buildDrawer");if(!y)return;const f=Math.max(180,Math.round(y.clientWidth*.68))*r,$=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;y.scrollBy({left:f,behavior:$?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{p(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{p(1)});const o=(r,y)=>{r?.addEventListener("wheel",f=>{const $=y?r.querySelector(y):r;$&&$.scrollWidth>$.clientWidth+4&&Math.abs(f.deltaY)>Math.abs(f.deltaX)&&f.deltaY!==0&&($.scrollLeft+=f.deltaY,f.preventDefault())},{passive:!1})};o(e.root.querySelector("#buildDrawer")),o(e.root.querySelector("#decorCollectionFilterBar")),o(e.root.querySelector("#seedBrushTray"),".seed-tray-scroll"),o(e.root.querySelector("#pastureBrushTray"),".seed-tray-scroll"),window.addEventListener("pointerdown",r=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const y=r.target;if(!y)return;const f=e.root.querySelector("#managePopoverMenu"),$=e.root.querySelector("#weatherPopoverMenu"),M=e.root.querySelector("#btnToggleManageMenu"),I=e.root.querySelector("#lblClock");f?.contains(y)||$?.contains(y)||M?.contains(y)||I?.contains(y)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnCloseManageMenu")?.addEventListener("click",()=>e.closeHudPopovers()),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()}),e.root.querySelector("#yuleEventBanner")?.addEventListener("click",()=>{e.activeQuestTab="quests",e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const l=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",l),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",l);const d=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",d),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",d),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const r=e.root.querySelector("#ribbonUnveilToastCard");r&&r.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const v=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",v),e.root.querySelector("#btnOpenZones")?.addEventListener("click",v),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",v),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const r=ot.findIndex(M=>M.mode===e.sim.heatmapMode),y=ot[(r+1)%ot.length];e.sim.heatmapMode=y.mode;const f=e.root.querySelector("#btnCycleHeatmap"),$=y.mode!=="none";f.textContent=y.label,f.setAttribute("data-active",String($)),f.setAttribute("aria-pressed",String($)),$&&e.showToast(`Đã bật ${y.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",r=>{const y=r.currentTarget;y.disabled||(y.disabled=!0,Nt(e.gameCanvas,`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`).then(()=>e.showToast("Ảnh đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🔥")).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{y.disabled=!1}))}),e.root.querySelector("#btnSaveYulePostcard")?.addEventListener("click",r=>{const y=r.currentTarget;if(y.disabled)return;const f=e.gameCanvas,$=document.getElementById("gpuWorldCanvas"),M=document.createElement("canvas");M.width=Math.max(640,f.width),M.height=Math.max(360,f.height);const I=M.getContext("2d");if(!I)return;$&&$.style.display!=="none"&&$.width>0&&$.height>0&&I.drawImage($,0,0,M.width,M.height),I.drawImage(f,0,0,M.width,M.height);const N=Math.max(640,M.width),D=Math.max(360,M.height),g=document.createElement("canvas");g.width=N,g.height=D;const T=g.getContext("2d");if(!T)return;T.drawImage(M,0,0,N,D);const E=Math.max(18,Math.round(Math.min(N,D)*.032));T.save(),T.strokeStyle="#14532d",T.lineWidth=E*1.15,T.strokeRect(E*.5,E*.5,N-E,D-E),T.strokeStyle="#f59e0b",T.lineWidth=Math.max(3,E*.18),T.strokeRect(E*.92,E*.92,N-E*1.84,D-E*1.84);const c=["#ef4444","#fbbf24","#34d399","#38bdf8"],u=Math.max(44,Math.round(N/18));for(let L=E*2,V=0;L<=N-E*2;L+=u,V++){const m=c[V%c.length];T.fillStyle=m,T.beginPath(),T.arc(L,E*.92,Math.max(4,E*.24),0,Math.PI*2),T.fill()}const S=Math.min(N-E*4,Math.max(360,Math.round(N*.62))),w=Math.max(44,Math.round(D*.078)),R=Math.round((N-S)*.5),P=D-E*1.4-w;T.fillStyle="rgba(20, 42, 32, 0.9)",T.strokeStyle="#fbbf24",T.lineWidth=2.5,T.beginPath(),T.roundRect(R,P,S,w,14),T.fill(),T.stroke();const B=Math.max(15,Math.round(w*.42));T.font=`700 ${B}px "Be Vietnam Pro", system-ui, sans-serif`,T.fillStyle="#fef3c7",T.textAlign="center",T.textBaseline="middle",T.fillText(`🎄 Giáng Sinh An Lành • ${e.sim.state.parkName} (Cấp ${e.sim.state.level}) ✨`,N*.5,P+w*.52),T.restore(),y.disabled=!0,Nt(g,`Thiệp Giáng Sinh từ ${e.sim.state.parkName}, cấp ${e.sim.state.level}!`).then(()=>{e.sim.recordFlooShareOrPostcard?.("postcard"),e.showToast("Thiệp đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🎄")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{y.disabled=!1})}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",r=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const f=r.currentTarget;f.textContent=e.questCollapsed?"+":"–",f.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",r=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const y=r.currentTarget;y.textContent=e.minimapCollapsed?"+":"–",y.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingAutoPlace")?.addEventListener("click",()=>{e.onAutoPlaceSelected?.()}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{if(e.rideCamUid)yt(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${nt[e.cam.viewRot??0]}!`,"🧭");else if(e.sim.strollModeActive){const r=e.sim.castStrollCareWave();r.msg&&e.showToast(r.msg,"🪄"),e.refreshAll()}else e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?e.triggerRotateAction():e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.sim.strollModeActive&&!e.selectedCatalogItem){const r=e.sim.cycleStrollRobe();e.showToast(r.msg,"✨"),e.refreshAll();return}if(e.selectedCatalogItem){const r=e.selectedCatalogItem,y=Ae(r),f=r.category;ie(e),e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=y,e.activeCategory=y?"decor":wt.includes(f)?f:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive||e.moveModeActive||e.bulldozerActive||e.selectedCatalogItem?(ie(e),e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.strollModeActive?(e.sim.toggleStrollMode(!1),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnTouchStash")?.addEventListener("click",()=>{e.onTouchStashActiveBuilding?.()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{if(e.moveModeActive&&e.moveKeepActiveAfterDrop&&e.movingBuildingUid){e.movingBuildingUid=null,e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshAll();return}ie(e),e.onTouchCancelPlace?.(),e.refreshAll()});const h=r=>{const y=e.minimapCanvas.getBoundingClientRect(),f=(r.clientX-y.left)/y.width*e.minimapCanvas.width,$=(r.clientY-y.top)/y.height*e.minimapCanvas.height,M=e.minimapCanvas.width*.46/ut,I=e.minimapCanvas.height*.44/ut,N=(f-e.minimapCanvas.width*.5)/M,D=($-8)/I,g=(N+D)*.5,T=(D-N)*.5,{fgx:E,fgy:c}=xa(g,T,e.cam.viewRot??0),u=Math.max(0,Math.min(ut-1,E)),S=Math.max(0,Math.min(ut-1,c));e.rideCamUid=null,ye(e.cam,u,S)};let k=!1;e.minimapCanvas.addEventListener("pointerdown",r=>{k=!0,h(r)}),window.addEventListener("pointermove",r=>{k&&h(r)}),window.addEventListener("pointerup",()=>{k=!1}),e.root.querySelectorAll("[data-cat]").forEach(r=>{r.addEventListener("click",()=>{const y=r.dataset.cat;if(!wt.includes(y))return;const f=e.activeCategory===y&&!(y==="decor"&&e.christmasTabActive);ie(e),e.inspectSelection=null,e.christmasTabActive=!1,f?e.activeCategory=null:(e.activeCategory=y,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,y==="decor"&&!["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)&&(e.activeDecorFilter="all")),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelectorAll("[data-decor-event]").forEach(r=>{r.addEventListener("click",()=>{const y=e.activeCategory==="decor"&&e.christmasTabActive;ie(e),e.inspectSelection=null,y?(e.activeCategory=null,e.christmasTabActive=!1):(e.activeCategory="decor",e.christmasTabActive=!0,e.buildSheetOpen=!0,e.mapToolsExpanded=!0),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{const r=!e.moveModeActive;ie(e),r&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời liên hoàn: Chạm từng công trình để dời chỗ (0 Sickle)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{const r=!e.bulldozerActive;ie(e),r&&(e.bulldozerActive=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("🧹 Chế độ Xóa: Kéo lướt để xóa đường/rào hoặc chạm công trình cần dọn!","🧹")),e.refreshAll()}),e.root.querySelector("#btnBuildUndo")?.addEventListener("click",r=>{if(r.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể hoàn tác thao tác của bạn bè!","🏡");return}const f=e.sim.undoBuild();e.showToast(f?"↶ Đã hoàn tác thao tác xây dựng gần nhất.":"Không có thao tác nào để hoàn tác.","↶"),e.refreshAll()}),e.root.querySelector("#btnBuildRedo")?.addEventListener("click",r=>{if(r.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể làm lại thao tác của bạn bè!","🏡");return}const f=e.sim.redoBuild();e.showToast(f?"↷ Đã làm lại thao tác xây dựng.":"Không có thao tác nào để làm lại.","↷"),e.refreshAll()}),e.root.querySelector("#btnBuildDone")?.addEventListener("click",()=>{e.collapseBuildDock(),ie(e),e.refreshAll()}),e.root.querySelector("#btnMenuRotateCam")?.addEventListener("click",()=>{yt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${nt[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnMenuCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.closeHudPopovers(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnMenuGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.sim.saveToStorage(),e.closeHudPopovers(),e.refreshAll()}),window.addEventListener("keydown",r=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(r.target instanceof HTMLInputElement||r.target instanceof HTMLTextAreaElement||r.target instanceof HTMLSelectElement||r.target instanceof HTMLElement&&(r.target.isContentEditable||r.target.classList.contains("drag-handle")||r.target.closest('button, a, summary, [role="button"], [popover]')))){if(r.ctrlKey||r.metaKey||r.altKey){(r.ctrlKey||r.metaKey)&&(r.key==="z"||r.key==="Z")?(r.preventDefault(),r.shiftKey?e.sim.redoBuild():e.sim.undoBuild(),e.refreshAll()):(r.ctrlKey||r.metaKey)&&(r.key==="y"||r.key==="Y")&&(r.preventDefault(),e.sim.redoBuild(),e.refreshAll());return}if(r.key==="n"||r.key==="N")e.openNeighborDialog();else if(r.key==="r"||r.key==="R"){if(e.sim.isVisitingNeighbor)return;e.triggerRotateAction()}else if(r.key==="q"||r.key==="Q")yt(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${nt[e.cam.viewRot??0]}`,"🧭");else if(r.key==="e"||r.key==="E")yt(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${nt[e.cam.viewRot??0]}`,"🧭");else if(r.key==="v"||r.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(r.key==="m"||r.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}const y=!e.moveModeActive;ie(e),y&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("✋ Chạm chọn từng công trình để di dời liên hoàn (0 Sickle)!","✋")),e.refreshAll()}else if(r.key==="b"||r.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(r.key==="j"||r.key==="J")e.openMatch3Dialog();else if(r.key==="k"||r.key==="K")e.openPuzzleArcadeDialog();else if(r.key==="l"||r.key==="L")e.openLeaderboardDialog();else if(r.key==="h"||r.key==="H")e.toggleHudRollup();else if(r.key==="p"||r.key==="P")e.togglePhotoMode();else if(r.key==="x"||r.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}const y=!e.bulldozerActive;ie(e),y&&(e.bulldozerActive=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(r.key==="Escape"){if(e.sim.pendingBuildStroke&&e.sim.cancelBuildStroke(),e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,ie(e),e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else r.key===" "&&(e.rideCamUid=null,ye(e.cam,18,24.5),e.refreshFloatingBanner())}})}function hi(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive,typeof document<"u"&&(document.body.dataset.photoMode=e.photoModeActive?"true":"false");const i=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||i),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||i);const s=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,n=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||i||s||n),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!i),e.root.querySelector("#inspectorPanel")?.classList.toggle("hidden",e.photoModeActive||!e.inspectSelection),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),Is(e),Ds(e),At(e),e.renderTutorialCoach()}function vn(e){return e.photoModeActive?!1:!!e.inspectSelection||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function Si(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(pt(e),Oe(e),e.closeSeedTray(),e.closePastureTray()),At(e)}function At(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const i=vn(e),s=e.hudRolledUp&&!e.photoModeActive&&!i,n=e.sim.isVisitingNeighbor,a=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,p=!e.photoModeActive&&!n&&(e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen);t.classList.toggle("hud-building-focus",i),t.classList.toggle("hud-compact-rolled",s),t.classList.toggle("hud-sheet-or-tray-open",p),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n||a||p);const o=e.root.querySelector("#btnToggleHudRollup");o&&(o.setAttribute("aria-pressed",String(e.hudRolledUp)),o.dataset.active=String(e.hudRolledUp),o.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const l=e.root.querySelector("#svgHudRollupChevron");l&&l.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const d=e.root.querySelector("#btnManageToggleHudRollup");d&&(d.textContent=e.hudRolledUp?"Mở HUD":"Ẩn HUD",d.setAttribute("aria-pressed",String(e.hudRolledUp)));const v=e.root.querySelector("#btnHudRoundOrb");v&&(v.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||i),v.setAttribute("aria-pressed",String(e.hudRolledUp)),v.dataset.rolled=String(e.hudRolledUp));const h=e.root.querySelector("#lblHudRoundOrbTag");h&&(h.textContent="Hiện HUD");const k=e.root.querySelector("#svgRoundOrbChevron");k&&k.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),i&&(pt(e),Oe(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#decorCollectionFilterBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function pt(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const i=e.root.querySelector("#managePopoverMenu"),s=e.root.querySelector("#weatherPopoverMenu"),n=e.root.querySelector("#btnToggleManageMenu"),a=e.root.querySelector("#lblClock");i?.classList.add("hidden"),s?.classList.add("hidden"),n&&(n.setAttribute("aria-expanded","false"),n.setAttribute("data-active","false")),a&&a.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function Oe(e){e.buildSheetOpen=!1,e.activeCategory=null,e.christmasTabActive=!1,e.mapToolsExpanded=!1}function fn(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function hn(e){Oe(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.activeSeedCropId=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.activePastureAnimalId=null}function Es(e,t,i){if(!t||!i)return;const s=t.getBoundingClientRect(),n=getComputedStyle(document.documentElement),a=f=>parseFloat(n.getPropertyValue(f))||0,p=Math.max(8,a("--host-inset-top")),o=Math.max(8,a("--host-inset-right")),l=Math.max(8,a("--host-inset-left")),d=Math.max(8,a("--host-inset-bottom"),a("--hpvn-safe-bottom"),a("--hpvn-dock")),v=Math.min(window.innerWidth-l-o,Math.max(248,i.offsetWidth||336)),h=Math.min(i.offsetHeight||420,window.innerHeight-p-d),k=s.left<window.innerWidth*.5?s.left:s.right-v,r=Math.max(l,Math.min(k,window.innerWidth-v-o)),y=Math.max(p,Math.min(s.bottom+8,window.innerHeight-d-h));i.style.left=`${Math.round(r)}px`,i.style.top=`${Math.round(y)}px`}function $i(e,t){if(e.sim.isVisitingNeighbor){pt(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const i=typeof t=="boolean"?t:!e.manageMenuOpen;if(pt(e),!i)return;(fn(e)||e.inspectSelection)&&(hn(e),e.inspectSelection=null,e.refreshAll()),e.manageMenuOpen=!0;const s=e.root.querySelector("#managePopoverMenu"),n=e.root.querySelector("#btnToggleManageMenu");s&&n&&(s.classList.remove("hidden"),n.setAttribute("aria-expanded","true"),n.setAttribute("data-active","true"),Es(e,n,s)),e.renderTutorialCoach()}function wi(e,t){const i=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(pt(e),!i)return;e.weatherPopoverOpen=!0;const s=e.root.querySelector("#weatherPopoverMenu"),n=e.root.querySelector("#lblClock");s&&n&&(Hs(e),s.classList.remove("hidden"),n.setAttribute("aria-expanded","true"),Es(e,n,s)),e.renderTutorialCoach()}function Hs(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const i=Date.now(),s=e.sim.getCurrentWeather(i),n=e.sim.getWeatherForecast(4,i),a=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${a?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${s.icon} ${b(s.labelVi)}</div>
        <div class="weather-current-buff">✨ ${b(s.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${n.map((p,o)=>{const l=o===0?"Nay":`+${le(Math.max(1,p.startsInSec))}`;return`
              <div class="weather-slot-row ${o===0?"is-now":""}">
                <span>${p.icon} ${b(p.labelVi)}</span>
                <span class="weather-slot-meta">${b(l)}</span>
              </div>
            `}).join("")}
      </div>
    `}function fs(e,t,i=!0){const s=t.toLocaleString("vi-VN");e.textContent=window.matchMedia("(max-width: 599px)").matches?Zs(t):s,i&&(e.title=`${s} Sickle`,e.closest("button")?.setAttribute("aria-label",`${s} Sickle — Chạm để chơi kiếm thêm Sickle`))}function Sn(e,t){const i=e.root.querySelector("#lblSickle");if(!i)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),i.textContent="∞",e.displayedSickle=t;return}const s=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedSickle<0||s||Math.abs(t-e.displayedSickle)<=1){e.displayedSickle=t,fs(i,Math.round(t));return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const n=e.displayedSickle,a=performance.now(),p=420,o=l=>{const d=Math.min(1,(l-a)/p),v=1-Math.pow(1-d,3),h=Math.round(n+(t-n)*v);e.displayedSickle=h,fs(i,h,d>=1),d<1?e.galleonRollRaf=requestAnimationFrame(o):(e.displayedSickle=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(o)}function Ti(e,t,i,s,n){const a=e.root.querySelector(`[data-fly-target="${t}"]`),p=e.root.querySelector("#flyRewardLayer");if(!a||!p)return;const o=()=>{a.classList.remove("hud-chip-pulse"),a.offsetWidth,a.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){o(),e.sim.audio.playFlyTick(0);return}const l=a.getBoundingClientRect();if(l.width<=0&&l.height<=0)return;const d=l.left+l.width*.5,v=l.top+l.height*.5,h=typeof s=="number"&&Number.isFinite(s)?Math.max(24,Math.min(window.innerWidth-24,s)):window.innerWidth*.5,k=typeof n=="number"&&Number.isFinite(n)?Math.max(24,Math.min(window.innerHeight-24,n)):window.innerHeight*.54,r={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},y=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(i))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,i)))));for(let f=0;f<y;f++){const $=document.createElement("div");$.className="fly-reward-token",$.dataset.kind=t,$.textContent=r[t],p.appendChild($);const M=f/Math.max(1,y)*Math.PI*2+(Math.random()-.5)*.5,I=14+f%3*9,N=h+Math.cos(M)*I,D=k+Math.sin(M)*I*.7,g=(N+d)*.5+(f%2===0?-42:42),T=Math.min(D,v)-(48+f%3*18),E=560+f*48,c=f*52,u=$.animate([{transform:`translate3d(${N}px, ${D}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${N}px, ${D-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${g}px, ${T}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${d}px, ${v}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:E,delay:c,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});u.onfinish=()=>{$.remove(),o(),e.sim.audio.playFlyTick(f)}}}function Gt(e,t=""){const i=e.trim();return i.replace(/^(?:[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]|\s)+/u,"")||i}const $n=1200,He=[];let hs=0,It=0,Tt=null;function Me(e,t,i="🦉"){const s=Gt(t,i);if(s){if(Tt?.isConnected&&Tt.dataset.msg===s)return Bs(Tt);s!==He[He.length-1]&&(He.length>=3&&He.shift(),He.push(s),zt(e))}}let Ss=0;function Bs(e,t){window.clearTimeout(Ss),Ss=window.setTimeout(()=>{const i=t??e.parentElement;e.remove();const s=i;if(s&&!s.childElementCount&&typeof s.hidePopover=="function")try{s.matches(":popover-open")&&s.hidePopover()}catch{}},3500)}function wn(e){const t=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!t)return null;const i=Array.from(e.root.querySelectorAll("dialog[open]")),s=i.length>0?i[i.length-1]:null;return s?t.parentElement!==s&&(s.appendChild(t),s.addEventListener("close",()=>{const n=Array.from(e.root.querySelectorAll("dialog[open]")),a=n.length>0?n[n.length-1]:e.root;t.parentElement!==a&&a.appendChild(t)},{once:!0})):t.parentElement!==e.root&&e.root.appendChild(t),t}function zt(e){if(It)return;const t=wn(e);if(!t){He.length=0;return}const i=t.childElementCount?hs+$n-Date.now():0;if(i>0){It=window.setTimeout(()=>{It=0,zt(e)},i);return}const s=He.shift();if(!s)return;const n=document.createElement("div");n.className="parchment-dark owl-toast",n.dataset.msg=s,n.appendChild(document.createElement("span")).textContent=s,t.replaceChildren(n);const a=t;if(typeof a.showPopover=="function")try{t.hasAttribute("popover")||t.setAttribute("popover","manual"),t.matches(":popover-open")&&a.hidePopover?.(),a.showPopover()}catch{}Tt=n,hs=Date.now(),Bs(n,t),He.length&&zt(e)}function Ci(e,t){const i=Math.max(1,Math.round(t.awaySeconds/60)),s=e.root.querySelector("#offlineDialogContent");s.innerHTML=`
      <dl class="hs-rows">
        <div><dt>Vắng mặt</dt><dd>${i.toLocaleString("vi-VN")} phút</dd></div>
        <div><dt>Sickle</dt><dd>+${t.galleonsEarned.toLocaleString("vi-VN")} Sickle</dd></div>
        <div><dt>XP</dt><dd>+${t.xpEarned.toLocaleString("vi-VN")}</dd></div>
        <div><dt>Công trình xong</dt><dd>${t.buildingsFinished}</dd></div>
      </dl>
      <form method="dialog" class="hs-dlg-actions"><button type="submit" class="brass-btn gold-cta">Nhận</button></form>
    `,e.root.querySelector("#offlineDialog").showModal()}function Is(e){const t=e.root.querySelector("#floatingModeBanner"),i=e.root.querySelector("#floatingBannerText"),s=e.root.querySelector("#btnFloatingAutoPlace"),n=e.root.querySelector("#btnFloatingSecondary"),a=e.root.querySelector("#btnFloatingSwap"),p=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!i||!n||!a||!p)){if(s?.classList.add("hidden"),a.classList.add("hidden"),p.classList.add("gold-cta"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const o=e.sim.state.buildings.find(d=>d.uid===e.rideCamUid),l=o?Y(o.itemId):void 0;if(!o||!l)e.rideCamUid=null;else{t.classList.remove("hidden"),i.textContent=`🎥 ${l.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,n.textContent="🧭 90°",n.classList.remove("hidden"),p.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),i.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Chạm ô để thả`:"🤏 Điều phối nhân sự — Chạm ô để thả • Esc hủy",n.classList.add("hidden"),p.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const o=e.sim.state.buildings.find(d=>d.uid===e.movingBuildingUid),l=o?Y(o.itemId):void 0;i.textContent=`✋ ${l?.name??"Dời chỗ"}`,n.textContent=`🔄 ${e.rotation*90}°`,n.classList.remove("hidden"),p.textContent="✕"}else i.textContent="✋ Chọn công trình để dời",n.classList.add("hidden"),p.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),i.textContent="🧹 Phá dỡ",n.classList.add("hidden"),p.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const o=e.selectedCatalogItem,l=o.category!=="path"&&o.category!=="terrain"&&!o.isFarmlandPlot&&!o.connectableGroup&&!o.isZooFence,d=o.category!=="path"&&o.category!=="terrain"&&!o.isCoasterTrackPiece&&!o.isZooFence&&!o.elevationDelta,v=e.sim.getEffectiveItemStarCost(o),h=v>0?`🌟 ${v}`:o.cost===0?"0 Sickle":`${o.cost.toLocaleString("vi-VN")} Sickle`;t.classList.remove("hidden"),i.textContent=`🏗️ ${o.name} • ${h}`,d&&s&&(s.textContent="⚡ Đặt Ngay",s.classList.remove("hidden"),p.classList.remove("gold-cta")),l?(n.textContent=`🔄 ${e.rotation*90}°`,n.classList.remove("hidden")):n.classList.add("hidden"),a.textContent="📦 Đổi",a.classList.remove("hidden"),p.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const o=Se[e.activeSeedCropId],l=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),i.textContent=`🌱 ${o.emoji} ${o.name} (${l})`,n.textContent="🌱 Đổi",n.classList.remove("hidden"),p.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const o=qe[e.activePastureAnimalId];t.classList.remove("hidden"),i.textContent=`🐾 ${o.emoji} ${o.name} (${o.cost.toLocaleString("vi-VN")} Sickle)`,n.textContent="🐾 Đổi",n.classList.remove("hidden"),p.textContent="✕";return}if(e.sim.strollModeActive&&!e.sim.isVisitingNeighbor){t.classList.remove("hidden"),i.textContent="🧙 Đi dạo · Chạm đường hoặc WASD",n.textContent="🪄 Chăm quanh",n.classList.remove("hidden"),a.textContent="✨ Đổi áo",a.classList.remove("hidden"),p.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),i.textContent="👁️ Nhìn xuyên",n.classList.add("hidden"),p.textContent="✕";return}t.classList.add("hidden")}}function Ds(e){const t=e.root.querySelector("#touchConfirmBar"),i=e.root.querySelector("#lblTouchConfirm"),s=e.root.querySelector("#btnTouchRotate"),n=e.root.querySelector("#btnTouchStash");if(!t||!i)return;if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}const a=e.selectedCatalogItem??(e.moveModeActive&&e.movingBuildingUid?Y(e.sim.state.buildings.find(l=>l.uid===e.movingBuildingUid)?.itemId??"")??null:null),p=!!(a&&a.category!=="path"&&a.category!=="terrain"&&!a.isFarmlandPlot&&!a.connectableGroup&&!a.isZooFence),o=!!(e.moveModeActive&&e.movingBuildingUid&&e.sim.canStashBuilding(e.movingBuildingUid));s?.classList.toggle("hidden",!p),n?.classList.toggle("hidden",!o),t.classList.remove("hidden"),i.textContent=`📍 ${e.pendingTouchTile.label}`}function Tn(e){const t=e.root.querySelector("#yuleEventBanner"),i=e.root.querySelector("#yuleEventBannerTitle"),s=e.root.querySelector("#yuleEventBannerTask"),n=e.root.querySelector("#yuleEventBannerProgress");if(!t||!i||!s||!n)return;const a=e.sim.getYuleEventStatus();if(e.photoModeActive||e.sim.isVisitingNeighbor||!a.active||!a.dayDef){t.classList.add("hidden");return}const p=a.dayDef.main,o=e.sim.getYuleTaskProgress(p.id),l=e.sim.getYuleTaskTarget(p.id),d=a.claimedMainDays.includes(a.day);i.textContent=`🎄 Yule • Ngày ${a.day}/36`,s.textContent=d?"Đã nhận phần thưởng":p.titleVi,n.textContent=d?"✓":`${Math.min(o,l)}/${l}`,t.classList.remove("hidden")}function Cn(e){const t=e.sim.getYuleEventStatus();if(!t.active||!t.dayDef||e.photoModeActive||e.sim.isVisitingNeighbor){e.yuleReadySig="";return}const s=[t.dayDef.main,...t.dayDef.side].filter(a=>!(a===t.dayDef.main?t.claimedMainDays.includes(t.day):t.claimedSideTaskIds.includes(a.id))&&e.sim.getYuleTaskProgress(a.id)>=a.amount);if(s.length===0){e.yuleReadySig="";return}const n=s.map(a=>a.id).join("|");e.yuleReadySig!==n&&(e.yuleReadySig=n,e.showToast(`🎄 Yule: ${s.length} nhiệm vụ sẵn sàng — mở bảng Nhiệm Vụ để nhận!`,"🎄"))}function rt(e){const t=e.sim.isVisitingNeighbor;t&&(ie(e),e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),kn(e),Tn(e),Cn(e),Ln(e),Ut(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t);const i=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,s=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t||i||s),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),Is(e),Ds(e),At(e),e.renderTutorialCoach()}function xn(e){const t=new Date,i=String(t.getHours()).padStart(2,"0"),s=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const n=e.sim.getCurrentWeather(t.getTime()),a=e.root.querySelector("#lblClock");if(a){const r=`${i}:${s}|${e.sim.simSpeed}|${n.labelVi}`;if(a.dataset.clockSig!==r){a.dataset.clockSig=r;const y=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";a.innerHTML=`<span>${i}:${s}</span>${y}`,a.setAttribute("aria-label",`${i}:${s} · ${n.labelVi}`),a.title=n.labelVi}}e.weatherPopoverOpen&&Hs(e);const p=e.sim.getActiveFestival(t),o=typeof e.sim.isWinterMainMapActive=="function"&&e.sim.isWinterMainMapActive();if(typeof document<"u"){const r=e.sim.isYuleVisualThemeActive(t)||o?"true":"false";document.documentElement.dataset.yuleTheme!==r&&(document.documentElement.dataset.yuleTheme=r)}const l=e.root.querySelector("#lblFestival");l&&(p==="lunar_tet"?(l.classList.remove("hidden"),l.textContent="🏮 Tết Việt +15% 🪙"):p==="mid_autumn"?(l.classList.remove("hidden"),l.textContent="🥮 Trung Thu +Hoa"):p==="halloween"?(l.classList.remove("hidden"),l.textContent="🎃 +35% XP"):p==="christmas"?(l.classList.remove("hidden"),l.textContent="🎄 Giáng Sinh +25% 🪙"):p==="quidditch_cup"&&!o?(l.classList.remove("hidden"),l.textContent="🏆 Quidditch +Cúp"):o?(l.classList.remove("hidden"),l.textContent="🎄 Đồi Tuyết Giáng Sinh"):l.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const d=e.sim.state,v=e.root.querySelector("#lblPuzzleHearts");if(v&&d.match3)if(d.sandboxMode)v.textContent="∞";else if(d.match3.hearts>=xt)v.textContent=`${d.match3.hearts}/${xt}`;else{const r=Math.max(0,Math.ceil((d.match3.nextHeartAt-Date.now())/1e3)),y=Math.floor(r/60),f=String(r%60).padStart(2,"0");v.textContent=`${d.match3.hearts} (${y}:${f})`}const h=e.root.querySelector("#btnHudActiveBuilds"),k=e.root.querySelector("#lblActiveBuilds");if(h&&k){const r=e.sim.getActiveConstructions(Date.now());if(r.length===0)h.classList.add("hidden");else{h.classList.remove("hidden");const y=Math.max(1,Math.ceil((r[0].constructEndsAt-Date.now())/1e3));k.textContent=String(r.length),h.title=`Đang xây (${le(y)})`}}}function kn(e){const t=e.sim.state,i=e.sim.getRequiredLevelTrial(),s=Math.max(0,t.xp)%st,n=Math.max(6,Math.min(100,s/st*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+Zt(t.level),e.root.querySelector("#barXpFill").style.width=`${n}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const p=e.root.querySelector("#lblParkRibbonName");if(p){const G=e.sim.getActiveVisitingNeighbor();p.textContent=G?`🚂 Thăm: ${G.avatarEmoji} ${G.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const o=e.sim.getWinsProgressForCurrentLevel(),l=e.sim.getTotalTowerClearedStages(),d=t.level>=xe?100:Math.min(100,Math.max(8,Math.round(o.current/Math.max(1,o.required)*100))),v=e.root.querySelector("#btnOpenRoadmap");v&&(v.style.setProperty("--hg-lvl-pct",String(d)),v.title=t.level>=xe?`👑 Cấp Tối Đa ${xe} • Rương XP: ${s}/${st} • Tháp 6 Môn: ${l.cleared.toLocaleString("vi-VN")}/${l.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${o.current}/${o.required} màn • Rương XP: ${s}/${st}`);const h=e.root.querySelector("#barLevelTopFill");h&&(h.style.width=`${d}%`,h.parentElement&&(h.parentElement.title=t.level>=xe?`👑 Đã đạt Cấp Tối Đa ${xe} • Tháp 6 Môn: ${l.cleared.toLocaleString("vi-VN")}/${l.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${o.current}/${o.required} màn mới • Tháp 6 Môn: ${l.cleared.toLocaleString("vi-VN")}/${l.total.toLocaleString("vi-VN")} Màn`));const k=e.root.querySelector("#lblXpFraction");k&&(k.textContent=`🎁 ${s}/${st}`);const r=e.sim.ensureFarmBarn(),y=e.sim.getBarnTotalUsed(),f=e.root.querySelector("#lblStorageBarn");f&&(f.textContent=`${y}/${r.capacity}`),Sn(e,t.galleons);const $=t.sandboxMode?"∞":String(t.match3?.stars??0),M=e.root.querySelector("#lblPuzzleStars");M&&t.match3&&(M.textContent=$);const I=e.root.querySelector("#lblHudHubStars");I&&(I.textContent=$);const N=e.root.querySelector("#lblHudHubTrial");N&&(t.level>=xe||t.sandboxMode||e.sim.isHeadmasterPreview||!i?N.textContent=`🌟 ${l.cleared}/${l.total}`:N.textContent=`🔥 ${i.icon} ${o.current}/${o.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const D=e.sim.getDisciplineStageInfo("match3"),g=e.sim.getLastPlayedMinigame();let T="🍬 Bùa Gặt",E="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp",c=D.isMaxed?`👑 ${D.maxStage}`:`Màn ${D.currentStage}`;if(g==="caro"){const G=e.sim.getDisciplineStageInfo("caro");T="🧨 Dò Mìn",E="/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1",c=G.isMaxed?`👑 ${we}`:`Màn ${G.currentStage}`}else if(g==="sudoku"){const G=e.sim.getDisciplineStageInfo("sudoku");T="🔢 Số Học",E="/trang-trai-hang-soc/sprites/m3_piece_scroll.webp",c=G.isMaxed?`👑 ${we}`:`Màn ${G.currentStage}`}else if(g==="blocks"){const G=e.sim.getDisciplineStageInfo("blocks");T="🦄 Sinh Vật",E="/trang-trai-hang-soc/sprites/beast_niffler.webp",c=G.isMaxed?`👑 ${we}`:`Màn ${G.currentStage}`}else if(g==="chess"){const G=e.sim.getDisciplineStageInfo("chess");T="🎯 Bắn Cá",E="/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2",c=G.isMaxed?`👑 ${we}`:`Màn ${G.currentStage}`}else if(g==="jigsaw"){const G=e.sim.getDisciplineStageInfo("jigsaw");T="🧩 Tranh Ghép",E="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp",c=G.isMaxed?`👑 ${we}`:`Màn ${G.currentStage}`}else g==="seedquiz"&&(T="🪄 Thần Chú",E="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp",c="Ôn Tập");const u=e.root.querySelector("#imgCornerPlayIcon");u&&u.getAttribute("src")!==E&&u.setAttribute("src",E);const S=Gt(T),w=Gt(c.replace("👑","Màn"));let R=0;if(!t.sandboxMode&&g==="match3"&&t.level<xe){const G=t.match3?.stars??0,te=new Set(t.buildings.map(X=>X.itemId)),ue=new Set(t.unlockedZones);for(const X of Ze){if(ue.has(X.id)||t.level<X.unlockLevel)continue;const ee=Jt(X)-G;ee>=1&&ee<=25&&(R===0||ee<R)&&(R=ee)}for(const X of je){if(X.isThemeParkLegacy||te.has(X.id)||!e.sim.isCatalogItemUnlocked(X))continue;const ee=e.sim.getEffectiveItemStarCost(X),$e=ee-G;ee>0&&$e>=1&&$e<=25&&(R===0||$e<R)&&(R=$e)}}const P=t.level>=xe?`Cấp ${xe}`:R>0?`Cần +${R} Sao`:`${o.current}/${o.required} màn`,B=t.level>=xe?`Cấp ${xe}`:R>0?`Cần thêm ${R} Sao · Lên cấp ${t.level+1}: ${o.current}/${o.required} màn`:`Lên cấp ${t.level+1}: ${o.current}/${o.required} màn`,L=e.root.querySelector("#badgeCornerPlayBonus");L&&(L.textContent=S,L.classList.remove("hidden"));const V=e.root.querySelector("#lblCornerPlayStage");V&&(V.textContent=w);const m=e.root.querySelector("#lblCornerPlaySub");m&&(m.textContent=P);const C=e.root.querySelector("#btnCornerPlayPuzzle");if(C){const G=`Chơi tiếp ${S} — ${w} · ${B}`;C.title=G,C.setAttribute("aria-label",G)}e.root.querySelectorAll("[data-switch-minigame]").forEach(G=>{const te=G.dataset.switchMinigame===g;G.dataset.active=String(te),te?G.setAttribute("aria-current","true"):G.removeAttribute("aria-current")});const q=e.root.querySelector("#badgeBuildReadyCount");if(q){const G=new Set(t.buildings.map(X=>X.itemId)),te=t.sandboxMode?999:t.match3?.stars??0,ue=je.filter(X=>{if(X.isThemeParkLegacy)return!1;const ee=e.sim.getEffectiveItemStarCost(X);return ee<=0||!e.sim.isCatalogItemUnlocked(X)?!1:!G.has(X.id)&&te>=ee}).length;ue>0&&!e.sim.isHeadmasterPreview?(q.textContent=String(ue),q.classList.remove("hidden")):q.classList.add("hidden"),q.closest("button")?.setAttribute("aria-label",ue>0&&!e.sim.isHeadmasterPreview?`Xây Dựng · ${ue} bản vẽ đủ sao`:"Xây Dựng")}const F=e.root.querySelector("#lblMatch3Lv");F&&t.match3&&(F.textContent=D.isMaxed?`👑${D.maxStage}`:`${D.currentStage}/${D.maxStage}`);const A=e.root.querySelector("#lblArcadeTowerLv");if(A){const G=Math.max(0,l.cleared-D.clearedStages),te=we*5;A.textContent=G>=te?`👑${te}`:`${G}/${te}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const _=e.sim.getActiveStoryQuest(),K=e.sim.getReadyOwlOrdersCount(),U=(_?.completed?1:0)+t.owlQuests.filter(G=>G.completed&&!G.claimed).length+t.dailyQuests.filter(G=>G.completed&&!G.claimed).length,J=K+U,x=J>0?J:r.owlOrders.length,H=e.root.querySelector("#badgeQuestCount");x>0?(H.textContent=String(x),H.classList.toggle("is-ready-green",K>0),H.classList.remove("hidden")):H.classList.add("hidden"),H.closest("button")?.setAttribute("aria-label",J>0?`Đơn Hàng Cú & Nhiệm Vụ · ${J} xong`:x>0?`Đơn Hàng Cú & Nhiệm Vụ · ${x} đơn`:"Đơn Hàng Cú & Nhiệm Vụ");const z=e.sim.ensureMarketFairState().deals.filter(G=>!G.claimed&&(t.sandboxMode||e.sim.getFarmItemCount(G.inputItemId)>=G.inputQty)).length,j=t.supply.cargoCrates.filter(G=>e.sim.getCargoCrateStockInfo(G).canFulfill).length+z,W=e.root.querySelector("#badgeWorkshopCount");W&&(j>0?(W.textContent=String(j),W.classList.remove("hidden")):W.classList.add("hidden"));const Q=e.sim.getClaimableRetentionCount().total,re=e.root.querySelector("#badgeCardCount");re&&(Q>0?(re.textContent=String(Q),re.classList.remove("hidden")):re.classList.add("hidden")),e.refreshSuitcaseBadge();const ne=e.root.querySelector("#badgeSuitcaseCount"),de=ne&&!ne.classList.contains("hidden")?Math.max(0,Number.parseInt(ne.textContent||"0",10)||0):0,ve=e.sim.getClaimableHarvestFeastCount(),ce=e.root.querySelector("#badgeManageMenuDot");if(ce){const G=j+Q+ve+de;G>0?(ce.textContent=String(G),ce.classList.remove("hidden")):ce.classList.add("hidden")}Mn(e);const be=e.root.querySelector("#btnCycleHeatmap");if(be){const G=ot.find(ue=>ue.mode===e.sim.heatmapMode)??ot[0],te=e.sim.heatmapMode!=="none";be.textContent=G.label,be.dataset.active=String(te),be.setAttribute("aria-pressed",String(te))}xn(e)}function Mn(e){const t=e.sim.state,i=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,s=t.buildings.some(a=>!!Y(a.itemId)?.isCreatureHabitat),n=(t.match3?.hearts??xt)>=xt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",n),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",i&&!s),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const a=e.root.querySelector("#btnToggleMinimap");a&&(a.textContent="–",a.setAttribute("aria-expanded","true"))}}function Ln(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const i=e.sim.state,s=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const n=e.sim.getActiveStoryQuest(),a=i.owlQuests.slice(0,2);let p="";if(s&&!i.sandboxMode&&!e.sim.isHeadmasterPreview){const o=e.sim.getWinsProgressForCurrentLevel(),l=e.sim.getDisciplineStageInfo(s.kind);p+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:700;">
            <span>🔥 ${s.icon} ${b(s.shortVi)} (${l.currentStage}/${l.maxStage}) • ${o.current}/${o.required}</span>
            <button type="button" data-open-trial="${s.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(n){const o=Math.min(100,Math.round(n.progress/Math.max(1,n.targetAmount)*100)),l=e.sim.getStoryAutoActionPreview();p+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">${b(n.giverEmoji)} ${b(n.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${o}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(n.progress,n.targetAmount)}/${n.targetAmount}</span>
            ${n.completed?`<button type="button" data-claim="${b(n.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${n.rewardSickle} Sickle</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;" title="${b(l.longLabel)}">${b(l.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const o of a){const l=Math.min(100,Math.round(o.progress/Math.max(1,o.targetAmount)*100));p+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${b(o.giverEmoji)} ${b(o.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${l}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(o.progress,o.targetAmount)}/${o.targetAmount}</span>
            ${o.completed?`<button type="button" data-claim="${b(o.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${o.rewardSickle}🪙 +${o.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=p,t.querySelectorAll("[data-claim]").forEach(o=>{o.addEventListener("click",()=>{e.sim.claimQuest(o.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(o=>{o.addEventListener("click",()=>{e.openTrialMinigame(o.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(o=>{o.addEventListener("click",()=>{const l=e.sim.completeStoryStepWithStar();if(l.ok){typeof l.placedGx=="number"&&typeof l.placedGy=="number"&&ye(e.cam,l.placedGx,l.placedGy);return}Me(e,l.msg,l.reason==="missing_gold"?"🪙":l.reason==="locked_level"?"🔒":"🌟"),l.reason==="open_match3"&&e.openTrialMinigame()})})}function Ut(e){const t=(m,C)=>{m&&(m.setAttribute("data-active",String(C)),m.setAttribute("aria-pressed",String(C)))},i=e.activeCategory==="decor"&&!!e.christmasTabActive;e.root.querySelectorAll("[data-cat]").forEach(m=>{const C=m.dataset.cat,q=C===e.activeCategory&&!(C==="decor"&&i);t(m,q)}),e.root.querySelectorAll("[data-decor-event]").forEach(m=>{t(m,i)}),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const s=e.root.querySelector("#btnRotate");if(s){const m=(e.rotation??0)*90;s.textContent=m>0?`🔄 Xoay ${m}°`:"🔄 Xoay"}const n=e.root.querySelector("#btnMenuRotateCam");if(n){const m=e.cam.viewRot??0;n.textContent=nt[m]}t(e.root.querySelector("#btnMenuCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnMenuGrid"),e.sim.state.settings.showGrid);const a=e.sim.isLayoutEditModeActive();t(e.root.querySelector("#btnToggleLayoutEdit"),a),t(e.root.querySelector("#btnMenuLayoutEdit"),a),t(e.root.querySelector("#btnMenuStrollMode"),e.sim.strollModeActive);const p=e.root.querySelector("#layoutEditBar");p&&(p.classList.toggle("hidden",!a||e.photoModeActive||e.sim.isVisitingNeighbor),p.querySelectorAll("[data-edit-preset]").forEach(m=>{const C=m.dataset.editPreset,q=e.sim.activePresetSlot===C,F=!!e.sim.state.layoutPresets?.[C];m.classList.toggle("gold-cta",q),m.setAttribute("aria-pressed",String(q));const A=C==="layout_1"?1:C==="layout_2"?2:3;m.textContent=F?`Bản ${A} ✓`:`Bản ${A}`}));const o=e.root.querySelector("#btnBuildUndo"),l=e.root.querySelector("#btnBuildRedo"),d=e.sim.isVisitingNeighbor||(typeof e.sim.canUndoBuild=="function"?!e.sim.canUndoBuild():!0),v=e.sim.isVisitingNeighbor||(typeof e.sim.canRedoBuild=="function"?!e.sim.canRedoBuild():!0);o&&o.setAttribute("aria-disabled",String(d)),l&&l.setAttribute("aria-disabled",String(v));const h=e.root.querySelector("#btnAccioAll");h&&(h.disabled=e.sim.isVisitingNeighbor);const k=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,r=e.root.querySelector("#secondaryMapToolsBar");r&&r.classList.toggle("hidden",!k);const y=k||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",k),At(e),t(e.root.querySelector("#btnToggleBuildDock"),y);const $=e.root.querySelector("#buildDrawer"),M=e.root.querySelector("#buildDrawerSwipeBar"),I=e.root.querySelector("#decorCollectionFilterBar"),N=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!wt.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,$.classList.add("hidden"),M?.classList.add("hidden"),I?.classList.add("hidden"),N.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}$.classList.remove("hidden"),$.dataset&&($.dataset.christmasDrawer=String(i)),N.classList.add("hidden");const D=e.recentDecorIds??[],g=new Map(D.map((m,C)=>[m,C])),T=new Map;for(const m of e.sim.state.buildings)T.set(m.itemId,(T.get(m.itemId)??0)+1);let E=0;for(const m of Object.values(e.sim.state.tileOverrides))m?.zooFence&&E++;E>0&&T.set("burrow_stone_rune_fence",E);const c=je.reduce((m,C)=>C.category==="decor"&&!C.isThemeParkLegacy&&Ae(C)?m+ze(e.sim,C):m,0),u=je.reduce((m,C)=>C.category==="decor"&&!C.isThemeParkLegacy&&!Ae(C)?m+ze(e.sim,C):m,0);if(I)if(e.activeCategory==="decor"&&i){I.classList.remove("hidden");const m=D.filter(A=>{const _=Y(A);return!!(_&&Ae(_))}).length,C=je.filter(A=>A.category==="decor"&&!A.isThemeParkLegacy&&Ae(A)).length,q=e.activeChristmasFilter??"all",F=[{id:"all",label:`✨ Tất cả (${C})`},{id:"recent",label:m>0?`Gần đây (${m})`:"Gần đây"},{id:"stashed",label:c>0?`📦 Trong kho (${c})`:"📦 Trong kho"},{id:"vietnam_noel",label:"🏮 Noel Việt Nam"},{id:"yule_trees",label:"🌲 Cây tuyết"},{id:"yule_flowers",label:"🌺 Hoa đông"},{id:"modular",label:"❄️ Hàng rào"},{id:"landmarks",label:"🏰 Địa danh"},{id:"hogwarts_crests",label:"🦁 4 Nhà"},{id:"burrow",label:"Hang Sóc"},{id:"hogwarts",label:"🕯️ Dạ vũ"},{id:"hogsmeade",label:"🍺 Hogsmeade"},{id:"express",label:"🚂 Cú & Tàu"},{id:"creatures",label:"🦌 Sinh vật"},{id:"book_lore",label:"📖 Điển tích"}];I.innerHTML=F.map(A=>{const _=q===A.id;return`<button type="button" role="tab" aria-selected="${_}" data-decor-filter="${A.id}" class="decor-filter-chip ${_?"active is-active":""}">${A.label}</button>`}).join(""),I.querySelectorAll("[data-decor-filter]").forEach(A=>{A.addEventListener("click",()=>{e.activeChristmasFilter=A.dataset.decorFilter??"all",$.scrollLeft=0,Ut(e)})})}else if(e.activeCategory==="decor"){I.classList.remove("hidden");const m=D.filter(A=>{const _=Y(A);return!!(_&&_.category==="decor"&&_.id!=="farmland_plot"&&!Ae(_))}).length,q=["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)?e.activeDecorFilter:"all",F=[{id:"all",label:"✨ Tất cả"},{id:"recent",label:m>0?`Gần đây (${m})`:"Gần đây"},{id:"stashed",label:u>0?`📦 Trong kho (${u})`:"📦 Trong kho"},{id:"nature",label:"🌿 Cây & Hoa"},{id:"fences",label:"🚧 Rào & Cổng"},{id:"lights",label:"🕯️ Đèn & Ghế"},{id:"landmarks",label:"⛲ Tiểu cảnh"}];I.innerHTML=F.map(A=>{const _=q===A.id;return`<button type="button" role="tab" aria-selected="${_}" data-decor-filter="${A.id}" class="decor-filter-chip ${_?"active is-active":""}">${A.label}</button>`}).join(""),I.querySelectorAll("[data-decor-filter]").forEach(A=>{A.addEventListener("click",()=>{e.activeDecorFilter=A.dataset.decorFilter??"all",$.scrollLeft=0,Ut(e)})})}else I.classList.add("hidden");const S=e.activeCategory==="decor"&&(i?(e.activeChristmasFilter??"all")==="recent":e.activeDecorFilter==="recent"),w=e.activeCategory==="decor"&&(i?(e.activeChristmasFilter??"all")==="stashed":e.activeDecorFilter==="stashed"),R=["farmland_plot","burrow_animal_pasture","burrow_flower_garden","burrow_chicken_coop","burrow_pumpkin_gnomes","burrow_apple_orchard"],P=je.filter(m=>{if(m.category==="terrain"||m.isThemeParkLegacy)return!1;if(e.activeCategory==="creature")return m.category==="creature"||R.includes(m.id);if(m.category!==e.activeCategory)return!1;if(e.activeCategory==="decor"){const C=Ae(m);if(i){if(!C)return!1;const F=e.activeChristmasFilter??"all";return F==="recent"?g.has(m.id):F==="stashed"?ze(e.sim,m)>0:F==="all"?!0:m.id==="snowy_pines"?F==="yule_trees"||F==="hogsmeade":m.yuleCollection===F}if(C||m.id==="farmland_plot")return!1;const q=e.activeDecorFilter;return q==="recent"?g.has(m.id):q==="stashed"?ze(e.sim,m)>0:q==="nature"||q==="fences"||q==="lights"||q==="landmarks"?mn(m)===q:!0}return!0});S?P.sort((m,C)=>(g.get(m.id)??999)-(g.get(C.id)??999)):e.activeCategory==="creature"&&P.sort((m,C)=>{const q=R.indexOf(m.id),F=R.indexOf(C.id);return q!==-1||F!==-1?(q===-1?999:q)-(F===-1?999:F):m.unlockLevel-C.unlockLevel});const B=e.sim.state.sandboxMode,L=e.sim.state.match3?.stars??0,V=e.sim.state.galleons;if(P.length===0&&(S||w)){$.innerHTML=`
        <div class="catalog-empty-hint">
          ${w?"Kho Trang Trí hiện đang trống — bấm vào món trang trí ngoài sân rồi chọn <strong>Cất</strong> để lưu giữ nhé!":"Chưa có vật phẩm vừa đặt gần đây — hãy chọn một món trong <strong>✨ Tất cả</strong> nhé!"}
        </div>
      `,$s(e,$);return}$.innerHTML=P.map(m=>{const C=ze(e.sim,m),q=C===0&&!e.sim.isCatalogItemUnlocked(m),F=e.selectedCatalogItem?.id===m.id,A=m.elevationDelta?m.elevationDelta>0?"⛰️":"⛏️":m.isCoasterTrackPiece?"🛤️":m.isZooFence?"🚧":m.isBench?"🪑":m.category==="path"?"🛣️":m.category==="terrain"?"🌿":"🕯️",_=qs(m),K=_?`<img src="${_}" alt="${b(m.name)}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${A}</div>`,U=e.sim.getEffectiveItemStarCost(m),x=U>0&&!m.connectableGroup&&m.category!=="decor"&&e.sim.state.buildings.some(ce=>ce.itemId===m.id),H=C===0&&!B&&!q&&U>0&&L<U,O=C===0&&!B&&!q&&U===0&&V<m.cost,z=C===0&&(H&&!x||O),j=pa(m),W=j>0?` • ⏱️ ${ge(j)}`:"",Q=U>0?`🌟 ${U}`:`🪙 ${m.cost.toLocaleString("vi-VN")} Sickle`,re=C>0?`📦 Kho: ${C} • 0 Sickle`:q?`🔒 Cấp ${m.unlockLevel} • ${Q}${W}`:x?H?`✅ Đã xây • 🌟 ${L}/${U}`:`✅ Đã xây • 🌟 ${U}`:H?`🌟 ${L}/${U}${W}`:U>0?`🌟 ${U}${W}`:O?`🪙 ${V.toLocaleString("vi-VN")}/${m.cost.toLocaleString("vi-VN")} Sickle${W}`:`🪙 ${m.cost.toLocaleString("vi-VN")} Sickle${W}`,ne=i&&Ae(m),de=T.get(m.id)??0,ve=de>0&&(!x||de>1)?`<span class="catalog-card-placed-badge">Đã đặt ${de}</span>`:"";return`
          <button
            type="button"
            class="catalog-card ${ne?"yule-festive-card":""} ${q?"locked":""} ${z?"short-resource":""}"
            data-item-id="${m.id}"
            data-selected="${F}"
            aria-pressed="${F}"
            ${q||z?'aria-disabled="true"':""}
          >
            ${ve}
            ${ne?'<span class="yule-card-twinkle" aria-hidden="true">❄</span>':""}
            ${K}
            <div class="catalog-card-title">${b(m.name)}</div>
            <div class="catalog-card-sub ${z?"is-short":""}">${re}</div>
          </button>
        `}).join(""),$.querySelectorAll("[data-item-id]").forEach(m=>{m.addEventListener("click",()=>{const C=Y(m.dataset.itemId);if(!C)return;const q=e.sim.getEffectiveItemStarCost(C),F=e.sim.state.match3?.stars??0,A=ze(e.sim,C)>0;if(!A&&!e.sim.isCatalogItemUnlocked(C)){const U=e.sim.getWinsProgressForCurrentLevel();let J=Math.max(1,U.required-U.current);for(let H=e.sim.state.level+1;H<C.unlockLevel;H++)J+=ga(H);const x=q>0?` hoặc ${q} Sao (${F}/${q})`:"";Me(e,`Mở ở Cấp ${C.unlockLevel}${x} · cần thêm ${J.toLocaleString("vi-VN")} màn.`,"🔒");return}if(!A&&!e.sim.state.sandboxMode&&q>0&&F<q){const U=!C.connectableGroup&&C.category!=="decor"?e.sim.state.buildings.find(x=>x.itemId===C.id):void 0;if(U){ie(e),e.inspectSelection={kind:"building",uid:U.uid},ye(e.cam,U.gx+C.width*.5,U.gy+C.height*.5),e.onCameraJump?.(),Oe(e),rt(e),Me(e,`Đã chọn "${C.name}" · bấm "✋ Dời" để đổi vị trí.`,"✋");return}const J=q-F;Me(e,`Thiếu ${J} Sao (${F}/${q}).`,"🌟");return}if(!A&&!e.sim.state.sandboxMode&&q===0&&e.sim.state.galleons<C.cost){const U=C.cost-e.sim.state.galleons;Me(e,`🪙 Thiếu ${U.toLocaleString("vi-VN")} Sickle (hiện có ${e.sim.state.galleons.toLocaleString("vi-VN")}/${C.cost.toLocaleString("vi-VN")} Sickle) để dựng "${C.name}"!`,"🪙");return}ie(e),e.selectedCatalogItem=C,e.inspectSelection=null,Oe(e),rt(e),e.onSelectCatalogItem?.(C);const _=nn(C),K=typeof window<"u"&&!!window.matchMedia?.("(pointer: coarse)")?.matches;Me(e,_?`🏗️ Đã chọn "${C.name}" — Chạm hoặc kéo liên tục trên bản đồ để đặt!`:K?`🏗️ Đã chọn "${C.name}" — Kéo/chạm ô chỉnh vị trí rồi bấm ✓ Đặt (hoặc bấm ⚡ Đặt Ngay)!`:`🏗️ Đã chọn "${C.name}" — Chạm một lần vào ô xanh để đặt ngay (hoặc bấm ⚡ Đặt Ngay)!`,"🔨")})}),$s(e,$)}function An(e,t){const i=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Sickle về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],s=new Set(e.sim.state.unlockedZones),n=o=>`<option value="all" ${o==="all"?"selected":""}>🗺️ Toàn công viên</option>`+Ze.filter(l=>e.sim.state.sandboxMode||s.has(l.id)).map(l=>`<option value="${l.id}" ${o===l.id?"selected":""}>📍 ${l.name}</option>`).join(""),a=i.map(o=>{const l=e.sim.state.staffHired[o.key],d=l>=vt,v=o.baseCost*(1+l);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:18px;">${o.icon} <span style="font-size:12px;font-weight:700;">${l}/${vt}</span></div>
            <div style="font-size:13px;font-weight:700;">${o.name}</div>
            <button
              type="button"
              data-hire="${o.key}"
              class="brass-btn ${d?"":"gold-cta"}"
              ${d?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${d?`✓ ${vt}/${vt}`:`+ 🪙 ${v}`}
            </button>
            ${l>0?`<button type="button" data-dismiss="${o.key}" class="brass-btn" style="width:100%;margin-top:4px;padding:4px 8px;font-size:12px;">Cho nghỉ</button>`:""}
          </div>
        `}).join(""),p=e.sim.staff.map(o=>{const l=e.sim.state.staffPatrolZones?.[o.id]??o.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:700;color:#7c2d12;">🧙 <span class="hs-raw">${b(o.name)}</span></div>
            <select data-patrol-staff="${b(o.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${n(l)}
            </select>
            <button type="button" data-pick-staff="${b(o.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=a+p,t.querySelectorAll("[data-hire]").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.hire;e.sim.hireStaff(l)&&(Oe(e),rt(e),Me(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-dismiss]").forEach(o=>{o.addEventListener("click",()=>{const l=o.dataset.dismiss;e.sim.dismissStaff(l)&&(rt(e),An(e,t),Me(e,"Đã cho phụ tá tạm nghỉ ngơi!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(o=>{o.addEventListener("change",()=>{const l=o.dataset.patrolStaff;e.sim.setStaffPatrolZone(l,o.value),Me(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(o=>{o.addEventListener("click",()=>{const l=e.sim.staff.find(d=>d.id===o.dataset.pickStaff);l&&(ie(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:l.id,label:l.name},Oe(e),rt(e),Me(e,`Đang gắp ${l.name} — Chạm vào ô bất kỳ trên bản đồ để thả xuống!`,"🤏"))})})}const Pn={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏠 Nhà & Xưởng Chế Biến",creature:"🌾 Sản Xuất, Đồng Cỏ & Thú",decor:"🌳 Vườn Hoa & Trang Trí",staff:"🧙 Phụ Tá Điền Trang"};function $s(e,t){const i=e.root.querySelector("#buildDrawerSwipeBar"),s=e.root.querySelector("#buildDrawerCatLabel"),n=e.root.querySelector("#btnDrawerScrollPrev"),a=e.root.querySelector("#btnDrawerScrollNext"),p=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const o=Array.from(t.querySelectorAll(".catalog-card"));if(!i||o.length===0||!e.activeCategory){i?.classList.add("hidden");return}if(s){const y=e.activeCategory==="decor"&&e.christmasTabActive?"🎄 Giáng Sinh & Mùa Đông":Pn[e.activeCategory]??"🏗️ Danh Mục Xây Dựng",f=e.sim.state.sandboxMode?"∞":String(e.sim.state.match3?.stars??0),$=e.sim.state.sandboxMode?"∞":`${e.sim.state.galleons.toLocaleString("vi-VN")} Sickle`;s.textContent=`${y} (${o.length}) • 🌟 ${f} • 🪙 ${$}`}i.classList.remove("hidden");const l=t.querySelector('.catalog-card[data-selected="true"]');l&&typeof l.scrollIntoView=="function"&&l.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const d=o[0],v=o[o.length-1];let h=!0,k=o.length<=2;const r=()=>{const y=!h||!k||t.scrollWidth>t.clientWidth+6;n&&(n.disabled=h,n.classList.toggle("hidden",!y)),a&&(a.disabled=k,a.classList.toggle("hidden",!y)),p&&p.classList.toggle("hidden",!y),t.dataset.scrollStart=String(!h),t.dataset.scrollEnd=String(!k)};if(typeof IntersectionObserver<"u"){const y=new IntersectionObserver(f=>{for(const $ of f)$.target===d&&(h=$.intersectionRatio>=1),$.target===v&&(k=$.intersectionRatio>=1);r()},{root:t,threshold:1,rootMargin:"2px"});y.observe(d),v!==d&&y.observe(v),e.drawerEdgeObserver=y}r()}function xi(e){const t=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,i=e.root.querySelector("#secondaryMapToolsBar");i&&i.classList.toggle("hidden",!t)}function Z(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,delete t.dataset.inspSig,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const i=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`,s=i===e.lastInspectedKey;if(s||(e.lastInspectedKey=i),e.inspectorCollapsed=!1,t.classList.remove("inspector-collapsed"),e.inspectSelection.kind==="building"){const n=e.inspectSelection.uid,a=e.sim.state.buildings.find(x=>x.uid===n);if(!a){e.inspectSelection=null,delete t.dataset.inspSig,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const p=Y(a.itemId),o=Date.now(),l=o<a.constructEndsAt,d=Math.max(0,Math.ceil((a.constructEndsAt-o)/1e3)),v=e.sim.getBuildingProductionPerCycle(a,p),h=Za(p,a.stars),k=(e.sim.rideQueues.get(a.uid)??[]).length,r=e.sim.isBuildingConnected(a.uid),y=e.sim.activeSynergies.buildingGoldMult.get(a.uid)??1,f=p.category==="ride"&&!p.isCoasterTrackPiece,$=!!p.isCustomCoasterStation&&!l;let M="none",I="",N=0;if(p.isFarmlandPlot&&!l){const x=e.sim.getPlotEffectiveSoilTier(a),H=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),z=e.sim.getPlotSoilUpgradeCostInfo(a.uid)?.canAfford?1:0;if(a.cropId){const j=Se[a.cropId],W=a.cropReadyAt??o,Q=e.sim.state.cropMastery?.[j.id]??0,re=ht(0,!1,Q,j.growSec).growSec,ne=a.cropPlantedAt??W-re*1e3,de=Math.max(0,Math.ceil((W-o)/1e3)),ve=de<=0;N=ve?100:Math.max(6,Math.min(98,Math.round((o-ne)/Math.max(1e3,W-ne)*100))),I=`${ve?"Chín":le(de)}${a.cropRotatedBonus?" · ×2":""}`,M=`${j.id}:${ve?1:0}:${a.cropWateredBoost?1:0}:${a.cropRotatedBonus?1:0}:${x}:${a.cropCompostBoost?1:0}:${H}:${z}:${e.sim.state.morningDewPhials??0}`}else{const j=e.sim.state.plotSoilState?.[`${a.gx},${a.gy}`],W=Object.keys(Se).map(Q=>e.sim.getSeedCount(Q)).join(".");M=`empty:${e.seedFilterMode}:${e.activeSeedCropId??""}:${j?.lastFamily??""}:${a.harvestCycleCount??0}:${x}:${a.cropCompostBoost?1:0}:${H}:${z}:${W}`}}let D="none",g="",T=0;if(p.isAnimalPasturePlot&&!l)if(!a.pastureAnimalId)D="empty";else{const x=qe[a.pastureAnimalId],H=a.pastureReadyAt??o,O=a.pastureStockedAt??H-x.cycleSec*1e3,z=Math.max(0,Math.ceil((H-o)/1e3)),j=z<=0;T=j?100:Math.max(6,Math.min(98,Math.round((o-O)/Math.max(1e3,H-O)*100)));const W=x.goodId?oe(x.goodId):null,Q=a.pastureGourmetBoost?2:1,re=a.pastureGourmetBoost?1.5:1,ne=Math.round(x.sellValue*re),de=x.yieldQty*Q,ve=a.pastureGourmetBoost?2:1;g=j?`🧺 +${ne} Sickle${W?` +${de} ${W.name}`:""} +${ve} 🌿`:`⏱️ ${le(z)}${a.pastureGourmetBoost?" · 🌽 ×2":""}`;const ce=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),be=e.sim.getAvailableGourmetFeedCrop()??"none";D=`${a.pastureAnimalId}:${j?1:0}:${a.pastureFedBoost?1:0}:${a.pastureGourmetBoost?1:0}:${ce}:${be}:${e.sim.state.morningDewPhials??0}`}let E="none",c="";if(p.workshopGroupId&&!l){const x=e.sim.getWorkshopRecipesForBuilding(p),H=a.workshopQueue??[],O=a.readyFarmGoods??[],z=x.map(Q=>{const re=!e.sim.state.sandboxMode&&e.sim.state.level<Q.unlockLevel,ne=!re&&(e.sim.state.sandboxMode||Q.inputs.every(de=>e.sim.getFarmItemCount(de.itemId)>=de.qty));return`${Q.id}:${re?"L":ne?"Y":"N"}:${Q.inputs.map(de=>e.sim.state.sandboxMode?"X":e.sim.getFarmItemCount(de.itemId)).join(".")}`}).join(","),j=H[0],W=j?Math.max(0,Math.ceil((j.endsAt-o)/1e3)):0;c=j?le(W):"Trống",E=`${O.join(",")}|${H.map(Q=>Q.goodId).join(",")}|${z}`}let u="done",S=100,w="",R="";if(l){const x=Math.max(0,a.buildReducedSec??0),H=Math.max(1e3,p.buildDurationSec*1e3,a.constructEndsAt-(a.placedAt||o-1e3)+x*1e3);S=Math.max(1,Math.min(99,Math.floor((1-(a.constructEndsAt-o)/H)*100)));const O=e.sim.getBuildingMinFloorSec(a),z=Math.max(0,d-O),j=z<=0&&e.sim.getActiveConstructions(o).some(Q=>Q.uid!==a.uid&&Math.ceil((Q.constructEndsAt-o)/1e3)>e.sim.getBuildingMinFloorSec(Q)),W=z>0||j;w=`${le(d)}${x>0?` (−${ge(x)})`:""}`,R=`${S}%`,u=`1:${x}:${z>0?1:0}:${W?1:0}:${e.sim.state.morningDewPhials??0}`}let P="";if(!l&&!a.awaitingUnveil&&p.baseIncome>0&&p.cycleSec>0&&!p.isFarmlandPlot&&!p.isAnimalPasturePlot){const x=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,H=cs(a,p),O=Math.max(1,H*x),z=Math.max(0,(o-(a.lastTickAt||o))/1e3),j=Math.max(1,Math.ceil(O-z%O));P=le(j)}const B=p.isCreatureHabitat?e.sim.biomeCache.get(a.uid):void 0,L=p.isBackstage?e.sim.backstageCache.get(a.uid):void 0,V=[a.uid,a.itemId,a.stars,a.rotation,a.awaitingUnveil?1:0,r?1:0,y.toFixed(2),a.visitorsServed,k,a.storedSickle,v.galleons,v.xp,Math.round(a.durability),a.isBrokenDown?1:0,a.needsTreeRevival?1:0,a.lastPlantedCropId??"",(a.readyFruitCrops??[]).length,a.creatureBondLevel??1,a.creatureStage??"",Math.round(a.creatureHunger??90),B?.score??50,L?`${L.shieldCount}/${L.needed}`:"",e.sim.state.level,e.sim.state.sandboxMode?1:0,e.sim.isVisitingNeighbor?1:0,!l&&e.sim.canStashBuilding(a.uid)?1:0,e.sim.getActiveFestival(),u,M,D,E].join("#");if(!t.classList.contains("hidden")&&t.dataset.inspSig===V){const x=(H,O)=>{const z=t.querySelector(`[data-insp-live="${H}"]`);z&&z.textContent!==O&&(z.textContent=O)};if(I){x("crop-timer",I);const H=t.querySelector('[data-insp-live="crop-bar"]');H&&(H.style.width=`${N}%`)}if(g){x("pasture-timer",g);const H=t.querySelector('[data-insp-live="pasture-bar"]');H&&(H.style.width=`${T}%`)}if(E!=="none"&&x("ws-timer",c),l){x("build-timer",w),x("build-pct",R);const H=t.querySelector('[data-insp-live="build-bar"]');H&&(H.value=S)}P&&x("prod-cycle",P);return}t.dataset.inspSig=V;const m={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"};Ja(p),e.sim.getEffectivePrice(a,p),e.sim.getPriceValueVerdict(a,p);const C=p.isFarmlandPlot&&!l?(()=>{const x=e.sim.getPlotEffectiveSoilTier(a),H=ha(x),O=e.sim.getPlotSoilUpgradeCostInfo(a.uid),z=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),j=!a.cropCompostBoost&&(!!e.sim.state.sandboxMode||z>=1),W=`
                <div class="soil-tier-banner">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                    <strong>🌱 Bậc ${H.labelRom} · ${b(H.nameVi)}</strong>
                    <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 ×${e.sim.state.sandboxMode?"∞":z}</span>
                  </div>
                  <div class="hs-stat-pills">
                    <span class="hs-stat-pill" title="Sản lượng cộng thêm mỗi vụ">🌱 +${H.yieldBonus}</span>
                    <span class="hs-stat-pill" title="Hệ số thưởng Sickle và XP khi thu hoạch">🪙 ×${H.harvestGoldXpMult.toFixed(2)}</span>
                    ${H.rejuvenateOnRotate?'<span class="hs-stat-pill" title="Luân canh khác họ giúp hồi sức đất">🍀 Hồi đất</span>':""}
                    ${a.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Đã bón Phân Ủ Thảo Dược: cộng 2 nông sản vụ này">🌿 +2</span>':""}
                  </div>
                  <div class="soil-tier-actions">
                    ${O?.nextTier&&O.nextMeta?`<button type="button" class="brass-btn ${O.canAfford?"gold-cta":""}" data-insp-upgrade-soil="1" title="${O.unlockedByLevel?`Nâng cấp lên Đất Bậc ${O.nextMeta.labelRom}`:`Mở khoá Đất Bậc ${O.nextMeta.labelRom} tại Cấp ${O.nextMeta.unlockLevel}`}" ${O.unlockedByLevel?"":"disabled"}>${O.unlockedByLevel?e.sim.state.sandboxMode?`Bậc ${O.nextMeta.labelRom} · 0 Sickle`:`Nâng Bậc ${O.nextMeta.labelRom} · ${O.compostCost}🌿 · 🪙${O.effectiveSickleCost.toLocaleString("vi-VN")}`:`🔒 Bậc ${O.nextMeta.labelRom} (Cấp ${O.nextMeta.unlockLevel})`}</button>`:'<span class="hs-stat-pill is-active" title="Đất canh tác đã đạt cấp tối đa Bậc V">⭐ Bậc V</span>'}
                    ${a.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Thửa đất đã bón Phân Ủ vụ này">🌿 Đã bón</span>':`<button type="button" class="brass-btn" data-insp-compost-plot="1" title="Bón 1 Phân Ủ Thảo Dược: cộng 2 nông sản và xoá mỏi đất" ${j?"":"disabled"}>🌿 Bón đất (+2)</button>`}
                  </div>
                </div>
              `;if(!a.cropId){const ee=e.sim.state.plotSoilState?.[`${a.gx},${a.gy}`],$e=Math.max(a.harvestCycleCount??0,ee?.fatigueStep??0),Ve=Object.values(Se).sort((se,Ce)=>se.unlockLevel-Ce.unlockLevel||se.growSec-Ce.growSec).filter(se=>e.seedFilterMode==="flowers"?!!se.isFlowerCrop:e.seedFilterMode==="crops"?!se.isFlowerCrop:!0),gt=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map(se=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===se.id?"active":""}"
                        data-insp-seed-filter="${se.id}"
                        aria-pressed="${e.seedFilterMode===se.id}"
                      >${se.label}</button>
                    `).join(""),Pt=Ve.map(se=>{const Ce=!e.sim.state.sandboxMode&&e.sim.state.level<se.unlockLevel,bt=e.sim.getPlantableSeedCount(se.id),Ks=ma(se.id),Qs=!!(ee&&ee.lastFamily!==Ks),Xs=e.sim.state.cropMastery?.[se.id]??0,ns=ht($e,Qs,Xs,se.growSec),Ys=`${ge(ns.growSec)}${ns.isRotatedBonus?" · 🍀 ×2":""}`,is=e.activeSeedCropId===se.id;return`
                      <div class="seed-card-slot ${Ce?"locked":""} ${is?"selected":""} ${!Ce&&bt<=0?"out-of-seeds":""}">
                        <button
                          type="button"
                          class="seed-card seed-tray-card ${Ce?"locked":""} ${is?"selected":""} ${!Ce&&bt<=0?"out-of-seeds":""}"
                          data-plant-crop="${se.id}"
                          ${Ce?"disabled":""}
                        >
                          <span class="seed-card-seed-badge ${Ce?"is-locked":bt>0?"has-seed":"no-seed"}">
                            ${Ce?`Cấp ${se.unlockLevel}`:`×${bt}`}
                          </span>
                          <img src="${Ot(se.id)}" alt="${b(se.name)}" class="seed-card-img" />
                          <span class="seed-card-name">${b(se.name)}</span>
                          <span class="seed-card-meta">${Ys}</span>
                        </button>
                        ${Ce?"":`<button type="button" class="seed-card-add-btn" data-insp-buy-seed="${se.id}" aria-label="Mua 1 hạt ${b(se.name)} (${se.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${b(se.name)} (${se.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":se.seedCost.toLocaleString("vi-VN")}</button>`}
                      </div>
                    `}).join(""),Le={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"},qt=ee?.lastFamily?`<div class="hs-insp-note">Luân canh ×2 · Khác họ <strong>${Le[ee.lastFamily]??ee.lastFamily}</strong></div>`:"",tt=a.lastPlantedCropId??e.sim.ensureFarmBarn().lastPlantedCropId,mt=tt?Se[tt]:null;return`
                  <div class="ws-inspector-board">
                    ${W}
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>Chọn hạt</span>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${mt?`<button id="btnInspReplantLast" type="button" class="brass-btn gold-cta" title="Gieo lại ${b(mt.name)}">🌱 Gieo lại ${b(mt.name)}</button>`:""}
                        <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta">
                          Đố nhận hạt
                        </button>
                      </div>
                    </div>
                    ${qt}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${gt}</div>
                    <div class="seed-picker-grid">${Pt}</div>
                  </div>
                `}const Q=Se[a.cropId],re=a.cropReadyAt??o,ne=e.sim.state.cropMastery?.[Q.id]??0,de=ht(0,!1,ne,Q.growSec).growSec,ve=a.cropPlantedAt??re-de*1e3,ce=Math.max(0,Math.ceil((re-o)/1e3)),be=ce<=0,G=Sa(ne),te=Math.max(0,e.sim.state.morningDewPhials??0),ue=Q.yieldQty*(a.cropRotatedBonus?2:1)+H.yieldBonus+(a.cropRotatedBonus?H.extraRotateYield:0)+(a.cropCompostBoost?2:0),X=be?100:Math.max(6,Math.min(98,Math.round((o-ve)/Math.max(1e3,re-ve)*100)));return`
                <div class="ws-inspector-board">
                  ${W}
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="${Ot(Q.id)}" alt="${b(Q.name)}" style="width:40px;height:40px;object-fit:contain;" />
                    <div style="flex:1;min-width:0;">
                      <div class="hs-insp-name">${b(Q.name)} <span class="hs-insp-meta">· Bậc ${G.labelRom}</span></div>
                      <div class="hs-insp-stat" data-insp-live="crop-timer">
                        ${be?"Chín":le(ce)}${a.cropRotatedBonus?" · ×2":""}
                      </div>
                      <div class="hs-insp-meta">${ne} vụ</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="crop-bar" style="width:${X}%"></div>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${be?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                            Gặt +${ue}
                          </button>
                        `:a.cropWateredBoost?'<div class="hs-insp-meta" style="flex:1;text-align:center;padding:8px 4px;">Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              Tưới −30%
                            </button>
                          `}
                    ${!be&&(te>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            Sương Mai ×${te}
                          </button>`:""}
                  </div>
                </div>
              `})():"",q=p.workshopGroupId&&!l?(()=>{const x=e.sim.getWorkshopRecipesForBuilding(p),H=a.workshopQueue??[],O=a.readyFarmGoods??[],z=e.sim.getEffectiveWorkshopQueueCapacity(a),j=e.sim.getNextWorkshopExtraSlotCost(a),W=e.sim.getWorkshopMastery(p.workshopGroupId),Q=ba(a.stars)*W.speedMult,re=W.nextTarget?Math.min(100,Math.round(W.completedCount/W.nextTarget*100)):100,ne=`
                <div class="quest-card-mini" style="margin-bottom:8px;padding:7px 9px;font-size:12px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                    <strong>Thông Thạo Xưởng: <span class="hs-insp-stars-inline">${W.starsLabel}</span></strong>
                    <span style="font-weight:700;opacity:0.86;">${W.nextTarget?`${W.completedCount}/${W.nextTarget} mẻ`:`${W.completedCount} mẻ · Tối đa`}</span>
                  </div>
                  <div class="quest-bar" style="height:6px;margin:5px 0 4px;">
                    <div class="quest-bar-fill" style="width:${re}%"></div>
                  </div>
                  <div style="font-size:11px;opacity:0.84;">${b(W.perkSummaryVi)}</div>
                </div>
              `,de=O.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${O.slice(0,5).map(X=>{const ee=De[X];return`<img src="/trang-trai-hang-soc/sprites/${ee.iconKey}.webp" alt="${b(ee.name)}" title="${b(ee.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${O.length})
                      </button>
                    </div>
                  `:"",ve=x.map(X=>{const ee=De[X.goodId],$e=X.name??ee.name,Fe=X.name&&X.name!==ee.name?`title="Ra lò thành phẩm: ${b(ee.name)}"`:"",Ve=!e.sim.state.sandboxMode&&e.sim.state.level<X.unlockLevel,gt=!Ve&&(e.sim.state.sandboxMode||X.inputs.every(Le=>e.sim.getFarmItemCount(Le.itemId)>=Le.qty)),Pt=X.inputs.map(Le=>{const qt=oe(Le.itemId),tt=e.sim.getFarmItemCount(Le.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||tt>=Le.qty?"ok":"lack"}">${b(qt.name)} ${e.sim.state.sandboxMode?"∞":tt}/${Le.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${gt?"craftable":""} ${Ve?"locked":""}"
                      data-ws-enqueue="${X.id}"
                      ${Fe}
                      ${Ve?"disabled":""}
                    >
                      <div class="ws-recipe-name">${b($e)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${ee.iconKey}.webp" alt="${b($e)}" class="ws-recipe-img" />
                        ${gt?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${Ve?`🔒 Lv.${X.unlockLevel}`:Pt}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${ge(Math.max(5,Math.round(X.craftSec*Q)))}</div>
                    </button>
                  `}).join(""),ce=H[0],be=ce?Math.max(0,Math.ceil((ce.endsAt-o)/1e3)):0,G=ce?De[ce.goodId]:null,te=Array.from({length:Math.max(1,z-1)},(X,ee)=>{const $e=H[ee+1];if($e){const Fe=De[$e.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${b(Fe.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${Fe.iconKey}.webp" alt="${b(Fe.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return ee===H.length-(ce?1:0)?`
                    <div class="ws-slot-plus" title="Thêm vào khay">
                      <span>+</span>
                    </div>
                  `:`
                  <div class="ws-slot-card empty" title="Trống">
                    <span style="font-size:11px;font-weight:700;opacity:0.65;">Trống</span>
                  </div>
                `}).join(""),ue=j!==null&&!e.sim.isVisitingNeighbor?`
                    <button
                      id="btnInspExpandWsSlot"
                      type="button"
                      class="ws-slot-card empty"
                      title="Mở thêm +1 khay hàng đợi vĩnh viễn (${j} Sickle)"
                      style="cursor:pointer;border-style:dashed;padding:4px 6px;"
                    >
                      <span style="font-size:11px;font-weight:800;line-height:1.2;">+1 Khay<br/>🪙${e.sim.state.sandboxMode?0:j}</span>
                    </button>
                  `:"";return`
                <div class="ws-inspector-board">
                  ${ne}
                  ${de}
                  <div class="ws-recipe-grid">${ve}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${ce?"baking":""}">
                      <div class="ws-oven-arch">
                        ${G?`<img src="/trang-trai-hang-soc/sprites/${G.iconKey}.webp" alt="${b(G.name)}" class="ws-oven-good-img" />`:'<span style="font-size:18px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${ce?`<strong data-insp-live="ws-timer">${le(be)}</strong>`:'<strong data-insp-live="ws-timer">Trống</strong>'}
                      </div>
                      ${ce?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${te}${ue}</div>
                  </div>
                </div>
              `})():"",F=p.isAnimalPasturePlot&&!l?(()=>{if(!a.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>Chọn thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(qe).map(te=>{const ue=!e.sim.state.sandboxMode&&e.sim.state.level<te.unlockLevel;return`
                      <button
                        type="button"
                        class="seed-card ${ue?"locked":""}"
                        data-stock-animal="${te.id}"
                        ${ue?"disabled":""}
                      >
                        <span class="seed-card-seed-badge ${ue?"is-locked":"has-seed"}">
                          ${ue?`Cấp ${te.unlockLevel}`:`🪙${te.cost.toLocaleString("vi-VN")}`}
                        </span>
                        <img src="/trang-trai-hang-soc/sprites/${te.spritePair[0]}.webp" alt="${b(te.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${b(te.name)}</span>
                        <span class="seed-card-meta">${ge(te.cycleSec)} · +🪙${te.sellValue}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const x=qe[a.pastureAnimalId],H=a.pastureReadyAt??o,O=a.pastureStockedAt??H-x.cycleSec*1e3,z=Math.max(0,Math.ceil((H-o)/1e3)),j=z<=0,W=j?100:Math.max(6,Math.min(98,Math.round((o-O)/Math.max(1e3,H-O)*100))),Q=x.goodId?oe(x.goodId):null,re=e.sim.getAvailableGourmetFeedCrop(),ne=re?Se[re]:null,de=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),ve=a.pastureGourmetBoost?2:1,ce=Math.round(x.sellValue*(a.pastureGourmetBoost?1.5:1)),be=a.pastureGourmetBoost?2:1;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${x.spritePair[0]}.webp" alt="${b(x.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div class="hs-insp-title">${b(x.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;" data-insp-live="pasture-timer">
                        ${j?`🧺 +${ce} Sickle${Q?` +${x.yieldQty*ve} ${b(Q.name)}`:""} +${be} 🌿`:`⏱️ ${le(z)}${a.pastureGourmetBoost?" · 🌽 ×2":""}`}
                      </div>
                      <div class="hs-stat-pills">
                        <span class="hs-stat-pill" title="Thu hoạch nhận thêm Phân Ủ Thảo Dược">🌿 +${be} (Kho: ×${e.sim.state.sandboxMode?"∞":de})</span>
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="pasture-bar" style="width:${W}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${j?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${ce} Sickle · +${be}🌿)
                          </button>
                        `:`
                          ${a.pastureFedBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho thú ăn cỏ thường">🌾 Đã cho ăn</span>':`
                                <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;" title="Cho thú ăn cỏ giúp rút ngắn 35% thời gian chờ">
                                  🌾 Cho ăn (-35%)
                                </button>
                              `}
                          ${a.pastureGourmetBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho ăn khẩu phần thượng hạng: nhân đôi sản vật và nhận 2 Phân Ủ">🌿 Đã ăn (×2 · +2🌿)</span>':`<button id="btnInspFeedPastureGourmet" type="button" class="brass-btn ${ne||e.sim.state.sandboxMode?"gold-cta":""}" style="flex:1;" title="Cho ăn ${e.sim.state.sandboxMode?0:ua} nông sản để nhân đôi sản vật và nhận 2 Phân Ủ">${ne?ne.emoji:"🌽"} Thượng hạng (×2 · +2🌿)</button>`}
                        `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!j&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 -15p (×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"",A=`${p.isFarmlandPlot?"Ruộng":p.isAnimalPasturePlot?"Đồng cỏ":p.connectableGroup==="flower_garden"?"Vườn hoa":p.workshopGroupId?"Xưởng":`${a.visitorsServed} lượt`}${f?` · ${k}/${en}`:""}`;t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((p.workshopGroupId||p.isFarmlandPlot||p.isAnimalPasturePlot)&&!l)),e.syncHudFocusVisibility();const _=qs(p),K=s?t.scrollTop:0;t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-head-main">
            ${_?`<img src="${_}" alt="${b(p.name)}" class="inspector-thumb" />`:""}
            <div class="hs-insp-head-copy">
              <div class="hs-insp-title">${b(p.name)}</div>
              <div class="hs-insp-meta"><span class="hs-insp-stars-inline">${"★".repeat(a.stars)}${"☆".repeat(5-a.stars)}</span> · ${A}${r?"":' · <span class="hs-insp-warn">Chưa nối đường</span>'}${y>1?` · +${Math.round((y-1)*100)}%`:""}</div>
            </div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        ${C}
        ${F}
        ${q}
        ${p.id==="burrow_apple_orchard"&&!l?a.needsTreeRevival?`<div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                  <div style="font-weight:700;margin-bottom:6px;">🍎 Cây táo cần hồi sinh sau 3 vụ (bón 1 🌿 Phân Ủ hoặc nhờ bạn bè chăm giúp)</div>
                  <button id="btnInspReviveTree" type="button" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">🌿 Hồi sinh Vườn Táo (+2 🍎)</button>
                </div>`:`<div class="hs-insp-drop-meta">🍎 Mùa trái cây lâu năm: còn <strong>${Math.max(0,3-(a.orchardHarvestsUsed??0))}/3</strong> vụ trước khi cần hồi sinh</div>`:""}

        ${p.producesIngredient&&!l?`<div class="hs-insp-drop-meta">Rơi: <strong>${Ft[p.producesIngredient].name}</strong></div>`:""}

        ${l?(()=>{const x=Math.max(0,a.buildReducedSec??0),H=Math.max(1e3,p.buildDurationSec*1e3,a.constructEndsAt-(a.placedAt||o-1e3)+x*1e3),O=Math.max(1,Math.min(99,Math.floor((1-(a.constructEndsAt-o)/H)*100))),z=e.sim.getBuildingMinFloorSec(a),j=Math.max(0,d-z),W=j<=0&&e.sim.getActiveConstructions(o).some(ne=>ne.uid!==a.uid&&Math.ceil((ne.constructEndsAt-o)/1e3)>e.sim.getBuildingMinFloorSec(ne)),Q=j>0||W,re=p.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="hs-insp-build-wrap">
                    <div class="hs-insp-build-head">
                      <span>${p.isCreatureHabitat?"Đang ấp":"Đang xây"} · <strong data-insp-live="build-timer">${le(d)}${x>0?` (−${ge(x)})`:""}</strong></span>
                      <span data-insp-live="build-pct">${O}%</span>
                    </div>
                    <progress class="ts-build-progress" data-insp-live="build-bar" max="100" value="${O}" aria-label="${re}"></progress>
                    <div class="hs-insp-actions-row">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta hs-insp-speed-btn" ${Q?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">Khảo thí −30p</button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn hs-insp-speed-btn" ${Q?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">Thần chú −10p</button>
                      ${j>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">−15p ×${e.sim.state.morningDewPhials??0}</button>`:""}
                      ${e.sim.state.sandboxMode?'<button id="btnFinishNowSand" type="button" class="brass-btn" title="Hoàn tất ngay">Xong</button>':j>0&&(e.sim.state.timeSand??0)>0?`<button id="btnUseOneSand" type="button" class="brass-btn" title="Dùng 1 Cát Xoay Thời Gian rút ngắn 15 phút">⏳ −15p (×${e.sim.state.timeSand})</button>`:""}
                    </div>
                  </div>
                `})():a.awaitingUnveil?`
                <div class="hs-insp-actions-row">
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="flex:1;">Cắt băng khánh thành</button>
                </div>
              `:p.baseIncome>0?(()=>{const x=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,H=cs(a,p),O=p.isAnimalPasturePlot&&a.pastureAnimalId?qe[a.pastureAnimalId]:null,z=Math.max(1,H*x),j=Math.max(0,(o-(a.lastTickAt||o))/1e3),W=Math.max(1,Math.ceil(z-j%z));return`
                    <div class="hs-insp-prod-row">
                      <div class="hs-insp-prod-copy">
                        <strong id="lblBuildingProdVal">+${O?.sellValue??v.galleons}🪙 +${O?.xp??v.xp}⭐</strong> / ${ge(O?.cycleSec??H)}${p.cycleSec>0&&!p.isFarmlandPlot&&!p.isAnimalPasturePlot?` · <span data-insp-live="prod-cycle">${le(W)}</span>`:""} · Kho: <strong>${a.storedSickle}🪙</strong>
                      </div>
                      ${a.storedSickle>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta">Thu +${a.storedSickle} Sickle</button>`:""}
                    </div>
                  `})():""}

        ${f&&!l&&!p.isFlooPortal&&a.isBrokenDown?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
                  <span>Độ bền</span>
                  <span style="color:${a.isBrokenDown?"#dc2626":a.durability<50?"#b45309":"#15803d"};">${Math.round(a.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(a.durability)}" aria-label="Độ bền"></progress>
                ${a.isBrokenDown||a.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${a.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">Sửa (0 Sickle)</button>`:""}
              </div>
            `:""}

        

        ${p.isCustomCoasterStation&&a.coasterStats&&!l?`
              <div class="hs-insp-prod-row">
                <span class="hs-insp-prod-copy">Ray ${a.coasterStats.lengthMeters}m · Hứng khởi ${a.coasterStats.excitement}/10</span>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta">Tự lắp ray</button>
              </div>
            `:""}

        ${$?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Ride Cam</button>
            `:""}

        ${(p.isWorkshopBrewery||p.producesIngredient||p.isFireworksLauncher)&&!l?`
              <div class="hs-insp-actions-row" style="margin-bottom:6px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">Xưởng</button>
                ${p.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">Pháo hoa</button>':""}
              </div>
            `:""}

        ${p.isCreatureHabitat&&!l?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>${b(a.creatureNickname||p.creatureName||p.name)}</strong>
                  <span class="morph-pill ${a.creatureMorph==="radiant"?"radiant":a.creatureMorph==="mystic"?"mystic":""}">
                    ${ya[a.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>Lv.${a.creatureBondLevel??1}/${va} · ${m[a.creatureStage??"baby"]} · Môi trường ${B?.score??50}% · No ${Math.round(a.creatureHunger??90)}%</div>
                <div class="hs-insp-actions-row" style="margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">Cho ăn</button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1;">Vali</button>
                </div>
              </div>
            `:""}

        ${p.isBackstage&&L&&!l?`
              <div class="hs-insp-drop-meta" style="color:${L.isShielded?"#15803d":"#dc2626"};">
                Che chắn: ${L.shieldCount}/${L.needed} ${L.isShielded?"✓ (+25% Sickle)":""}
              </div>
            `:""}

        ${p.id==="burrow_honeydukes_canon"&&!l?`
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Vào Bùa Gặt Honeydukes</button>
            `:""}

        ${(p.id==="burrow_owl_post"||p.id==="eeylops_owl_emporium")&&!l?'<button id="btnInspOpenOwlOrders" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Bảng Đơn Hàng Cú</button>':""}
        ${p.id==="burrow_feast_marquee"&&!l?'<button id="btnInspOpenFeastMarquee" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Đại Tiệc Mùa Gặt</button>':""}
        ${p.id==="floo_fireplace_gate"&&!l?'<button id="btnInspOpenNeighbors" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Sổ Hàng Xóm &amp; Cổng Floo</button>':""}
        ${l?"":`<div class="hs-insp-actions-row">
                ${a.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn hs-insp-upg-btn">${p.workshopGroupId?`Nâng ${a.stars+1}★ (+1 khay, −8% giờ lò)`:`Nâng ${a.stars+1}★`} · 🌟${fa(a.stars)} + 🪙${h.toLocaleString("vi-VN")}</button>`:'<span class="hs-insp-max-stars">5★ Tối đa</span>'}
              </div>`}
        ${!a.isIndestructible&&!e.sim.isVisitingNeighbor?`<div class="inspector-build-actions ${!l&&e.sim.canStashBuilding(a.uid)?"has-stash":""}" role="group" aria-label="Thao tác công trình">
                <button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình miễn phí (0 Sickle)">Dời</button>
                <button id="btnRotateThis" type="button" class="brass-btn" title="Xoay hướng công trình 90°">Xoay</button>
                ${!l&&e.sim.canStashBuilding(a.uid)?'<button id="btnStashThis" type="button" class="brass-btn hs-insp-stash-btn" title="Cất vào Kho Trang Trí (đặt lại miễn phí 0 Sickle)">Cất</button>':""}
                <button id="btnDeleteThis" type="button" class="brass-btn inspector-delete-btn" title="Xóa công trình">Xóa</button>
              </div>`:""}
      `,K>0&&(t.scrollTop=K);const U=t.querySelector("#inpBuildingPrice");U&&(e.wireRangeProgressFallback(U),U.addEventListener("input",()=>{const x=Number(U.value);e.sim.setBuildingCustomPrice(a.uid,x);const H=e.sim.getEffectivePrice(a,p),O=t.querySelector("#lblBuildingPriceVal");O&&(O.textContent=`${H} Sickle`);const z=e.sim.getPriceValueVerdict(a,p),j=t.querySelector("#lblPriceVerdict");j&&(j.textContent=z.label,j.style.color=z.color);const W=e.sim.getBuildingProductionPerCycle(a,p),Q=t.querySelector("#lblBuildingProdVal");Q&&(Q.textContent=`+${W.galleons} 🪙 & +${W.xp} ⭐`)})),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Z(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(a.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=a.uid,e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=a.uid,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(a.uid,!0),Z(e)}),t.querySelector("#btnUseOneSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(a.uid,!1),Z(e),e.refreshHeader()}),t.querySelectorAll("[data-use-morning-dew]").forEach(x=>{x.addEventListener("click",()=>{const H=e.sim.useMorningDewPhial(a.uid);e.showToast(H.msg,H.ok?"🧪":"⏳"),Z(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(a.uid),Z(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const x=a.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",x)}),t.querySelector("#btnInspReplantLast")?.addEventListener("click",()=>{const x=e.sim.replantPlotLastCrop(a.uid);if(x.needSeedAcquire&&x.cropId){const H=a.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(x.cropId,H);return}e.showToast(x.msg,x.ok?"🌱":"🪙"),x.ok?(e.inspectSelection=null,e.refreshAll()):Z(e)}),t.querySelector("#btnInspReviveTree")?.addEventListener("click",()=>{const x=e.sim.reviveFruitTree(a.uid);e.showToast(x.msg,x.ok?"🍎":"🌿"),Z(e),e.refreshHeader()}),t.querySelectorAll("[data-plant-crop]").forEach(x=>{x.addEventListener("click",()=>{const H=x.dataset.plantCrop,O=e.sim.plantCropOnPlot(a.uid,H);if(O.needSeedAcquire){const z=a.uid;e.activeSeedCropId=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(H,z);return}if(e.showToast(O.msg,O.ok?"🌱":"🪙"),O.ok){const z=!!e.sim.state.sandboxMode||e.sim.getPlantableSeedCount(H)>0;e.activeSeedCropId=z?H:null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}Z(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-buy-seed]").forEach(x=>{x.addEventListener("click",H=>{H.stopPropagation();const O=x.dataset.inspBuySeed,z=e.sim.buyCropSeedWithGold(O,1);e.showToast(z.msg,z.ok?"🌱":"🪙"),z.ok&&(e.activeSeedCropId=O,Z(e),e.renderSeedTray(),e.refreshHeader(),e.refreshFloatingBanner())})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(x=>{x.addEventListener("click",()=>{const H=x.dataset.inspSeedFilter;(H==="all"||H==="flowers"||H==="crops")&&(e.seedFilterMode=H,Z(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(x=>{x.addEventListener("click",()=>{const H=x.dataset.stockAnimal,O=e.sim.stockAnimalOnPasture(a.uid,H);if(e.showToast(O.msg,O.ok?qe[H]?.emoji??"🐾":"🪙"),O.ok){e.activePastureAnimalId=null,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}Z(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const x=e.sim.feedAnimalPasture(a.uid);e.showToast(x.msg,x.ok?"🌾":"⏳"),Z(e)}),t.querySelector("#btnInspFeedPastureGourmet")?.addEventListener("click",()=>{const x=e.sim.feedAnimalPastureGourmet(a.uid);e.showToast(x.msg,x.ok?"🌽":"🧺"),Z(e),e.refreshHeader()}),t.querySelectorAll("[data-insp-upgrade-soil]").forEach(x=>{x.addEventListener("click",()=>{const H=e.sim.upgradePlotSoilTier(a.uid);e.showToast(H.msg,H.ok?"🌱":"🪙"),Z(e),e.refreshHeader()})}),t.querySelectorAll("[data-insp-compost-plot]").forEach(x=>{x.addEventListener("click",()=>{const H=e.sim.fertilizeCropPlotWithCompost(a.uid);e.showToast(H.msg,H.ok?"🌿":"🧺"),Z(e),e.refreshHeader()})}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const x=e.sim.harvestAnimalPasture(a.uid);e.showToast(x.msg,x.ok?"🧺":"⏳"),Z(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const x=e.sim.clearAnimalFromPasture(a.uid);e.showToast(x.msg,x.ok?"🐾":"⚠️"),Z(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const x=e.sim.waterCropPlot(a.uid);e.showToast(x.msg,x.ok?"💧":"⏳"),Z(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const x=e.sim.harvestCropPlot(a.uid);e.showToast(x.msg,x.ok?"🌾":"🏡"),Z(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(a.uid),Z(e)}),t.querySelectorAll("[data-ws-enqueue]").forEach(x=>{x.addEventListener("click",()=>{const H=x.dataset.wsEnqueue,O=e.sim.enqueueWorkshopRecipe(a.uid,H);e.showToast(O.msg,O.ok?"🔥":"🧺"),Z(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(a.uid),Z(e)}),t.querySelector("#btnInspExpandWsSlot")?.addEventListener("click",()=>{const x=e.sim.expandWorkshopQueueSlot(a.uid);x.ok||e.showToast(x.msg,"🪙"),Z(e),e.refreshHeader()}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(a.uid),Z(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(a.uid),Z(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=a.uid,e.inspectSelection=null,Z(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${p.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(a.uid),Z(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",a.uid)}),t.querySelector("#btnInspOpenHoneydukesMatch3")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openMatch3Dialog()}),t.querySelector("#btnInspOpenOwlOrders")?.addEventListener("click",()=>{e.inspectSelection=null,e.activeQuestTab="orders",e.refreshAll(),e.renderQuestDialog(),e.root.querySelector("#questDialog")?.showModal()}),t.querySelector("#btnInspOpenFeastMarquee")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openHarvestFeastDialog()}),t.querySelector("#btnInspOpenNeighbors")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openNeighborDialog("friends")}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const x=e.sim.upgradeBuildingStar(a.uid);e.showToast(x.msg,x.ok?"🌟":"🪙"),Z(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{ie(e),e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=a.uid,e.rotation=a.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.onStartMoveBuilding?.(a.uid),e.refreshAll(),e.showToast(`✋ Đang nhấc "${p.name}" — chạm ô đất mới trên bản đồ để đặt xuống!`,"✋")}),t.querySelector("#btnStashThis")?.addEventListener("click",()=>{const x=e.sim.stashBuilding(a.uid);x.ok&&(e.inspectSelection=null,e.refreshAll()),e.showToast(x.msg,x.ok?"📦":"⚠️")}),t.querySelector("#btnRotateThis")?.addEventListener("click",()=>{const x=e.sim.rotatePlacedBuilding(a.uid);if(!x.ok){e.showToast(x.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}e.rotation=x.newRotation??a.rotation,Z(e),e.refreshHeader(),e.refreshDock(),e.showToast(`🔄 Đã xoay "${p.name}" (${(x.newRotation??0)*90}°)`,"🔄")}),t.querySelector("#btnDeleteThis")?.addEventListener("click",()=>{const x=e.sim.getRemovalLossText(a.gx,a.gy);x?e.askConfirm(x).then(H=>{H&&J()}):J()});const J=()=>{e.sim.beginBuildStroke();let x=!1;try{x=e.sim.removeAtTile(a.gx,a.gy)}finally{e.sim.commitBuildStroke()}x&&(e.inspectSelection=null,e.refreshAll(),e.showToast(`🧹 Đã xóa "${p.name}" (có thể bấm ↶ Hoàn tác trong Xây Dựng nếu nhầm).`,"🧹"))};return}if(e.inspectSelection.kind==="staff"){delete t.dataset.inspSig;const n=e.inspectSelection.id,a=e.sim.staff.find(l=>l.id===n);if(!a){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const p=e.sim.state.staffPatrolZones?.[a.id]??a.patrolZoneId??"all",o=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-title">${b(a.name)}</div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        <div class="hs-insp-drop-meta">"${b(a.actionText)}"</div>

        <div class="hs-insp-actions-row">
          <select id="selInspPatrolZone" aria-label="Khu vực tuần tra" style="flex:1;min-height:40px;padding:6px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${p==="all"?"selected":""}>Toàn bộ</option>
            ${Ze.filter(l=>e.sim.state.sandboxMode||o.has(l.id)).map(l=>`<option value="${l.id}" ${p===l.id?"selected":""}>${l.name}</option>`).join("")}
          </select>
          <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta">Gắp</button>
        </div>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Z(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",l=>{const d=l.currentTarget.value;e.sim.setStaffPatrolZone(a.id,d),e.showToast(`Đã phân công ${a.name}.`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{ie(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:a.id,label:a.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){delete t.dataset.inspSig;const n=As(e.inspectSelection.zoneId),a=Jt(n),p=n.unlockCost>0?` · ${n.unlockCost.toLocaleString("vi-VN")} Sickle`:"",o=e.sim.state.level>=n.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div>
            <div class="hs-insp-title">${b(n.name)}</div>
            <div class="hs-insp-meta">Cấp ${n.unlockLevel} · 🌟 ${a}${p}</div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${o?"gold-cta":""}" style="width:100%;">Mở khu vực · 🌟 ${a}${p}</button>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,Z(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const l=e.sim.unlockZone(n.id);e.showToast(l.msg,l.ok?"✨":"🔒"),l.ok&&(e.inspectSelection=null,e.refreshAll())})}}function Rs(e,t){t&&(e.activeWorkshopTab=t),ae(e);const i=e.root.querySelector("#workshopDialog");i.open||i.showModal()}function qn(e,t,i){e.collapseBuildDock(),lt(e),ie(e),e.inspectSelection=null,e.pendingSowPlotUid=i??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function Qe(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function ki(e){e.seedTrayOpen?(Qe(e),e.refreshAll()):qn(e,e.activeSeedCropId??void 0)}function En(e,t,i){e.collapseBuildDock(),Qe(e),ie(e),e.inspectSelection=null,e.pendingStockPastureUid=i??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function lt(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function Mi(e){e.pastureTrayOpen?(lt(e),e.refreshAll()):En(e,e.activePastureAnimalId??void 0)}function Hn(e){const t=e.root.querySelector("#seedBrushTray"),i=e.root.querySelector("#btnOpenSeedSilo");if(i){const g=e.seedTrayOpen||!!e.activeSeedCropId;i.dataset.active=String(g),i.setAttribute("aria-pressed",String(g))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const s=e.sim.state.buildings.filter(g=>Y(g.itemId)?.isFarmlandPlot&&!g.cropId&&Date.now()>=g.constructEndsAt).length,n=e.sim.state.buildings.filter(g=>Y(g.itemId)?.isFarmlandPlot).length,a=e.activeSeedCropId?Se[e.activeSeedCropId]:null,o=Object.values(Se).sort((g,T)=>g.unlockLevel-T.unlockLevel||g.growSec-T.growSec).filter(g=>e.seedFilterMode==="flowers"?!!g.isFlowerCrop:e.seedFilterMode==="crops"?!g.isFlowerCrop:!0),l=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map(g=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===g.id?"active":""}"
            data-seed-filter="${g.id}"
            aria-pressed="${e.seedFilterMode===g.id}"
          >${g.label}</button>
        `).join(""),d=o.map(g=>{const T=!e.sim.state.sandboxMode&&e.sim.state.level<g.unlockLevel,E=e.activeSeedCropId===g.id,c=e.sim.getPlantableSeedCount(g.id),u=e.sim.state.cropMastery?.[g.id]??0,S=ht(0,!1,u,g.growSec).growSec,w=ge(S);return`
          <div class="seed-card-slot ${T?"locked":""} ${E?"selected":""} ${!T&&c<=0?"out-of-seeds":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${T?"locked":""} ${E?"selected":""} ${!T&&c<=0?"out-of-seeds":""}"
              data-seed-brush="${g.id}"
              aria-pressed="${E}"
              ${T?"disabled":""}
            >
              <span class="seed-card-seed-badge ${T?"is-locked":c>0?"has-seed":"no-seed"}">
                ${T?`Cấp ${g.unlockLevel}`:`×${c}`}
              </span>
              <img src="${Ot(g.id)}" alt="${b(g.name)}" class="seed-card-img" />
              <span class="seed-card-name">${b(g.name)}</span>
              <span class="seed-card-meta">${w}</span>
            </button>
            ${T?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${g.id}" aria-label="Mua 1 hạt ${b(g.name)} (${g.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${b(g.name)} (${g.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":g.seedCost.toLocaleString("vi-VN")}</button>`}
          </div>
        `}).join(""),v=t.querySelector(".seed-tray-scroll")?.scrollLeft??0;t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${a?`${b(a.name)} · ×${e.sim.getPlantableSeedCount(a.id)}`:"Hạt Giống & Hoa"}</span>
            <span class="seed-tray-sub">Trống ${s}/${n}</span>
          </div>
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Đố nhận hạt 0 Sickle">
            Đố nhận hạt
          </button>
          <button id="btnCloseSeedTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng túi hạt giống">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${l}</div>
          <div class="seed-tray-actions">
            ${e.pendingSowPlotUid&&e.sim.state.buildings.some(g=>g.uid===e.pendingSowPlotUid&&!g.isIndestructible)?'<button id="btnSeedTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời thửa đất này">Dời ô</button>':""}
            <button id="btnSeedTrayPlantAll" type="button" class="brass-btn" title="Gieo hạt giống đã chọn vào tất cả ô đất trống">Gieo tất cả</button>
            ${e.sim.ensureFarmBarn().lastPlantedCropId?'<button id="btnSeedTrayReplantLast" type="button" class="brass-btn" title="Gieo lại hạt giống vụ trước trên các ô đất trống">🌱 Gieo lại</button>':""}
            <button id="btnSeedTrayWaterAll" type="button" class="brass-btn" title="Tưới tất cả luống đang lớn chưa được tưới">Tưới tất cả</button>
            <button id="btnSeedTrayHarvestAll" type="button" class="brass-btn gold-cta" title="Gặt tất cả luống đã chín vàng">Gặt tất cả</button>
            <button id="btnSeedTrayBuyPlot" type="button" class="brass-btn" title="Đặt Thửa Đất (30 Sickle)">
              + Đất 🪙30
            </button>
            <button id="btnSeedTrayBuyFlowerGarden" type="button" class="brass-btn" title="Đặt Vườn Hoa (55 Sickle)">
              + Vườn 🪙55
            </button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll">${d}</div>
    `;const h=t.querySelector(".seed-tray-scroll");h&&v>0&&(h.scrollLeft=v);const k=Date.now(),r=e.sim.state.buildings.filter(g=>Y(g.itemId)?.isFarmlandPlot),y=r.map(g=>g.uid),f=r.filter(g=>g.cropId&&g.cropReadyAt&&k>=g.cropReadyAt),$=r.filter(g=>g.cropId&&g.cropReadyAt&&k<g.cropReadyAt&&!g.cropWateredBoost),M=r.filter(g=>!g.cropId&&Date.now()>=g.constructEndsAt),I=t.querySelector("#btnSeedTrayPlantAll"),N=t.querySelector("#btnSeedTrayWaterAll"),D=t.querySelector("#btnSeedTrayHarvestAll");if(I){const g=M.length;I.disabled=g===0,I.textContent=`Gieo tất cả${g?` (${g})`:""}`,I.addEventListener("click",()=>{const T=e.activeSeedCropId;if(!T){e.showToast("🌱 Chọn một hạt giống trước để Gieo Tất Cả!","🪄");return}const E=e.sim.batchPlantCropPlots(M.map(c=>c.uid),T);e.showToast(E.msg,E.ok?"🌱":"🪄"),e.activeSeedCropId=null,e.refreshAll()})}if(N){const g=$.length;N.disabled=g===0,N.textContent=`Tưới tất cả${g?` (${g})`:""}`,N.addEventListener("click",()=>{const T=e.sim.batchWaterCropPlots(y);e.showToast(T.msg,T.ok?"💧":"🌱"),e.refreshAll()})}if(D){const g=f.length;D.disabled=g===0,D.textContent=`Gặt tất cả${g?` (${g})`:""}`,D.addEventListener("click",()=>{const T=e.sim.batchHarvestCropPlots(y);e.showToast(T.msg,T.ok?"🌾":"🌱"),e.refreshAll()})}t.querySelector("#btnSeedTrayReplantLast")?.addEventListener("click",()=>{const g=e.sim.batchReplantLastCrops();e.showToast(g.msg,g.ok?"🌱":"🪙"),e.refreshAll()}),t.querySelectorAll("[data-seed-filter]").forEach(g=>{g.addEventListener("click",T=>{T.stopPropagation();const E=g.dataset.seedFilter;(E==="all"||E==="flowers"||E==="crops")&&(e.seedFilterMode=E,Hn(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(g=>{g.addEventListener("click",T=>{T.stopPropagation();const E=g.dataset.acquireSeed,c=e.sim.buyCropSeedWithGold(E,1);e.showToast(c.msg,c.ok?"🌱":"🪙"),c.ok&&(e.activeSeedCropId=E,e.refreshAll())})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const g=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),T=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(T,g)}),t.querySelectorAll("[data-seed-brush]").forEach(g=>{g.addEventListener("click",()=>{const T=g.dataset.seedBrush,E=Se[T],c=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(!e.sim.state.sandboxMode&&e.sim.getPlantableSeedCount(T)<=0){e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(T,c);return}if(e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,c){const u=e.sim.state.buildings.find(S=>S.uid===c);if(u&&Y(u.itemId)?.isFarmlandPlot&&!u.cropId){const S=e.sim.plantCropOnPlot(u.uid,T);if(S.needSeedAcquire){e.activeSeedCropId=null,e.refreshAll(),e.openSeedQuizDialog(T,u.uid);return}const w=!!e.sim.state.sandboxMode||e.sim.getPlantableSeedCount(T)>0;e.activeSeedCropId=S.ok&&w?T:null,e.showToast(S.msg,S.ok?"🌱":"🪙"),e.refreshAll();return}}e.activeSeedCropId=T,e.refreshAll(),e.showToast(`${E.name} · ${e.sim.getPlantableSeedCount(T)} giống (gieo 1 thu 2)`,E.emoji)})}),t.querySelector("#btnSeedTrayMovePlot")?.addEventListener("click",()=>{const g=e.pendingSowPlotUid,T=g?e.sim.state.buildings.find(c=>c.uid===g):void 0;if(!T||T.isIndestructible)return;const E=Y(T.itemId);Qe(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=T.uid,e.rotation=T.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${E?.name??"Thửa đất"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const g=Y("farmland_plot");g&&(Qe(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=g,e.refreshAll(),e.showToast("Thửa đất · 30 Sickle/ô","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const g=Y("burrow_flower_garden");g&&(Qe(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=g,e.refreshAll(),e.showToast("Vườn hoa · 55 Sickle/ô","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Rs(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{const g=e.activeSeedCropId;if(g&&(e.sim.state.sandboxMode||e.sim.getPlantableSeedCount(g)>0)){const T=e.pendingSowPlotUid;if(e.seedTrayOpen=!1,e.pendingSowPlotUid=null,T){const E=e.sim.state.buildings.find(c=>c.uid===T);if(E&&Y(E.itemId)?.isFarmlandPlot&&!E.cropId){const c=e.sim.plantCropOnPlot(E.uid,g),u=!!e.sim.state.sandboxMode||e.sim.getPlantableSeedCount(g)>0;e.activeSeedCropId=c.ok&&u?g:null,e.showToast(c.msg,c.ok?"🌱":"🪙")}}e.refreshAll();return}Qe(e),e.refreshAll()})}function Li(e){const t=e.root.querySelector("#pastureBrushTray"),i=e.root.querySelector("#btnOpenPastureTray");if(i){const r=e.pastureTrayOpen||!!e.activePastureAnimalId;i.dataset.active=String(r),i.setAttribute("aria-pressed",String(r))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const s=e.sim.state.buildings.filter(r=>Y(r.itemId)?.isAnimalPasturePlot&&!r.pastureAnimalId&&Date.now()>=r.constructEndsAt).length,n=e.sim.state.buildings.filter(r=>Y(r.itemId)?.isAnimalPasturePlot).length,a=e.activePastureAnimalId?qe[e.activePastureAnimalId]:null,p=Object.values(qe).map(r=>{const y=!e.sim.state.sandboxMode&&e.sim.state.level<r.unlockLevel,f=e.activePastureAnimalId===r.id;return`
          <div class="seed-card-slot pasture-card-slot ${y?"locked":""} ${f?"selected":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${y?"locked":""} ${f?"selected":""}"
              data-pasture-brush="${r.id}"
              aria-pressed="${f}"
              ${y?"disabled":""}
            >
              <span class="seed-card-seed-badge ${y?"is-locked":"has-seed"}">
                ${y?`Cấp ${r.unlockLevel}`:`🪙${r.cost.toLocaleString("vi-VN")}`}
              </span>
              <img src="/trang-trai-hang-soc/sprites/${r.spritePair[0]}.webp" alt="${b(r.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${b(r.name)}</span>
              <span class="seed-card-meta">${ge(r.cycleSec)} · +🪙${r.sellValue}</span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${a?b(a.name):"Chăn Thả"}</span>
            <span class="seed-tray-sub">Trống ${s}/${n}</span>
          </div>
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn" title="Đặt Đồng Cỏ (45 Sickle)">
            + Đồng cỏ 🪙45
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-tray-actions">
            ${e.pendingStockPastureUid&&e.sim.state.buildings.some(r=>r.uid===e.pendingStockPastureUid&&!r.isIndestructible)?'<button id="btnPastureTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời ô đồng cỏ này">Dời ô</button>':""}
            <button id="btnPastureFeedAll" type="button" class="brass-btn" title="Cho tất cả đàn thú đang lớn ăn">Cho ăn tất cả</button>
            <button id="btnPastureCollectAll" type="button" class="brass-btn gold-cta" title="Thu hoạch tất cả sản vật đã sẵn sàng">Thu hoạch tất cả</button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${p}</div>
    `;const o=e.sim.state.buildings.filter(r=>Y(r.itemId)?.isAnimalPasturePlot).map(r=>r.uid),l=t.querySelector("#btnPastureFeedAll"),d=t.querySelector("#btnPastureCollectAll"),v=Date.now(),h=e.sim.state.buildings.filter(r=>Y(r.itemId)?.isAnimalPasturePlot&&r.pastureAnimalId&&r.pastureReadyAt&&v<r.pastureReadyAt&&!r.pastureFedBoost).length,k=e.sim.state.buildings.filter(r=>Y(r.itemId)?.isAnimalPasturePlot&&r.pastureAnimalId&&r.pastureReadyAt&&v>=r.pastureReadyAt).length;l&&(l.disabled=h===0,l.textContent=`Cho ăn tất cả${h?` (${h})`:""}`,l.addEventListener("click",()=>{const r=e.sim.batchFeedAnimalPastures(o);e.showToast(r.msg,r.ok?"🌾":"✨"),e.refreshAll()})),d&&(d.disabled=k===0,d.textContent=`Thu hoạch tất cả${k?` (${k})`:""}`,d.addEventListener("click",()=>{const r=e.sim.batchHarvestAnimalPastures(o);e.showToast(r.msg,r.ok?"🐾":"✨"),e.refreshAll()})),t.querySelectorAll("[data-pasture-brush]").forEach(r=>{r.addEventListener("click",()=>{const y=r.dataset.pastureBrush,f=qe[y];if(!f)return;const $=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,$){const M=e.sim.state.buildings.find(I=>I.uid===$);if(M&&Y(M.itemId)?.isAnimalPasturePlot&&!M.pastureAnimalId){const I=e.sim.stockAnimalOnPasture(M.uid,y);e.activePastureAnimalId=null,e.showToast(I.msg,I.ok?f.emoji:"🪙"),e.refreshAll();return}}e.activePastureAnimalId=y,e.refreshAll(),e.showToast(`${f.name} · ${f.cost.toLocaleString("vi-VN")} Sickle/ô`,f.emoji)})}),t.querySelector("#btnPastureTrayMovePlot")?.addEventListener("click",()=>{const r=e.pendingStockPastureUid,y=r?e.sim.state.buildings.find($=>$.uid===r):void 0;if(!y||y.isIndestructible)return;const f=Y(y.itemId);lt(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=y.uid,e.rotation=y.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${f?.name??"Đồng cỏ"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const r=Y("burrow_animal_pasture");r&&(lt(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=r,e.refreshAll(),e.showToast("Đồng cỏ · 45 Sickle/ô","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Rs(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{lt(e),e.refreshAll()})}function Ai(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const i=e.sim.state,s=Date.now();if((i.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){ae(e);return}if(e.activeWorkshopTab==="cargo"){const a=i.supply.cargoCrates.map(p=>`${p.id}:${p.fulfilled?1:0}:${p.helpRequestedAt?1:0}:${p.helpedByNeighborName??""}`).join("|");if(t.dataset.cargoSig&&t.dataset.cargoSig!==a){ae(e);return}}if(e.activeWorkshopTab==="brew"){const a=t.querySelector("#btnWsQuickHerb");if(a){const l=Math.max(0,Math.ceil((2e4-(s-(i.supply.lastHerbPlotHarvestAt||0)))/1e3)),d=l===0||i.sandboxMode;a.classList.toggle("gold-cta",d),a.textContent=d?"🌿 Hái Thảo Dược":`🌱 (${ge(l)})`}const p=t.querySelector("[data-ws-brew-left]");if(p&&i.supply.activeBrew){const l=St.find(v=>v.id===i.supply.activeBrew?.goodId),d=Math.max(0,Math.ceil((i.supply.activeBrew.endsAt-s)/1e3));l&&(p.textContent=`🔥 ${l.emoji} ${l.name} (còn ${le(d)})`)}const o=t.querySelector("[data-ws-buff-banner]");if(o){const l=Math.max(0,Math.ceil(((i.supply.butterbeerBoostEndsAt||0)-s)/1e3)),d=Math.max(0,Math.ceil(((i.supply.felixBoostEndsAt||0)-s)/1e3));if(l<=0&&d<=0)o.classList.add("hidden");else{o.classList.remove("hidden");const v=[];l>0&&v.push(`🍻 +85% Sickle (${le(l)})`),d>0&&v.push(`🧪 +35%XP (${le(d)})`),o.textContent=`✨ ${v.join(" • ")}`}}}}const Dt=new WeakMap;let Re=5;function Bn(e,t){Dt.set(e,t),e.dataset.wsDelegated!=="1"&&(e.dataset.wsDelegated="1",e.addEventListener("change",i=>{const s=Dt.get(e);if(!s)return;const n=i.target;n&&n.id==="selStandItem"&&(s.selectedStandItemId=n.value,ae(s))}),e.addEventListener("click",i=>{const s=Dt.get(e);if(!s)return;const a=i.target?.closest("button");if(!a||a.disabled)return;const p=s.sim.state;if(a.dataset.pouchHint){s.showToast(a.dataset.pouchHint,a.dataset.pouchIcon||"✨");return}if(a.dataset.wsTab){s.activeWorkshopTab=a.dataset.wsTab,ae(s),e.querySelector(`[data-ws-tab="${s.activeWorkshopTab}"]`)?.scrollIntoView?.({block:"nearest",inline:"nearest",container:"nearest"});return}if(a.dataset.sellSpotlight){const o=a.dataset.sellSpotlight==="good"?"good":"crop",l=s.sim.sellMarketSpotlightLot(o);l.ok||s.showToast(l.msg,"🎪"),ae(s),s.refreshHeader();return}if(a.dataset.claimMarketDeal){const o=s.sim.fulfillMarketFairDeal(a.dataset.claimMarketDeal);o.ok||s.showToast(o.msg,"🎪"),ae(s),s.refreshHeader();return}if(a.id==="btnRerollMarketFair"){const o=s.sim.rerollMarketFairDeals();o.ok||s.showToast(o.msg,"🎪"),ae(s);return}if(a.id==="btnUpgradeFarmBarn"){const o=s.sim.upgradeFarmBarn();s.showToast(o.msg,o.ok?"🏡":"🔌"),ae(s),s.refreshHeader();return}if(a.id==="btnCraftPhoenixTalisman"){const o=s.sim.craftPhoenixTalismanFromBarn();s.showToast(o.msg,o.ok?"🔥":"🧺"),ae(s),s.refreshHeader();return}if(a.dataset.sellFarmItem){const o=s.sim.sellFarmItemFromBarn(a.dataset.sellFarmItem,1);o.ok||s.showToast(o.msg,"🧺"),ae(s),s.refreshHeader();return}if(a.id==="btnWsQuickHerb"){const o=s.sim.quickHarvestHerbs();s.showToast(o.msg,o.ok?"🌿":"⏳"),ae(s);return}if(a.id==="btnWsSpeedBrew"){s.sim.speedUpBrewing()&&ae(s);return}if(a.dataset.brewGood){const o=s.sim.startBrewing(a.dataset.brewGood);s.showToast(o.msg,o.ok?"🧪":"⚠️"),ae(s);return}if(a.dataset.useGood){const o=a.dataset.useGood,l=s.sim.useCraftedGood(o);l.ok?o==="dragon_firework"?s.root.querySelector("#workshopDialog")?.close():ae(s):s.showToast(l.msg,"⚠️");return}if(a.dataset.fulfillCrate){const o=s.sim.fulfillCargoCrate(a.dataset.fulfillCrate);s.showToast(o.msg,o.ok?"📦":"⚠️"),ae(s),s.refreshHeader();return}if(a.dataset.helpCargoCrate){const o=s.sim.requestCargoCrateHelp(a.dataset.helpCargoCrate);s.showToast(o.msg,o.ok?"🤝":"🚂"),ae(s),s.refreshHeader();return}if(a.dataset.gotoBrew!==void 0){s.activeWorkshopTab="brew",ae(s);return}if(a.dataset.jumpCargoItem){const o=a.dataset.jumpCargoItem;s.root.querySelector("#workshopDialog")?.close(),s.jumpToMissingFarmItem(o);return}if(a.dataset.activateHelper){const o=a.dataset.activateHelper,l=s.sim.activateFarmHelper(o);s.showToast(l.msg,l.ok?"🧙":"🪙"),ae(s),s.refreshHeader();return}if(a.dataset.standTier){s.selectedStandPriceTier=a.dataset.standTier,ae(s);return}if(a.dataset.standQtyCap){const o=Number(a.dataset.standQtyCap);(o===1||o===3||o===5||o===10)&&(Re=o,ae(s));return}if(a.dataset.standList){const o=Number(a.dataset.standList),l=s.sim.getFarmItemCount(s.selectedStandItemId),d=Math.max(1,Math.min(Re,p.sandboxMode?Re:l)),v=s.sim.listOnRoadsideStand(o,s.selectedStandItemId,d,s.selectedStandPriceTier);s.showToast(v.msg,v.ok?"🧺":"⚠️"),ae(s),s.refreshHeader();return}if(a.dataset.standAdvertise){const o=Number(a.dataset.standAdvertise),l=s.sim.advertiseRoadsideStandSlot(o);s.showToast(l.msg,l.ok?"📰":"⏳"),ae(s);return}if(a.dataset.standClaim){const o=Number(a.dataset.standClaim),l=s.sim.claimRoadsideStandSlot(o);s.showToast(l.msg,l.ok?"🪙":"🧺"),ae(s),s.refreshHeader();return}if(a.dataset.visitorAccept){const o=s.sim.acceptFarmVisitorOffer(a.dataset.visitorAccept);o.ok||s.showToast(o.msg,"🧺"),ae(s),s.refreshHeader();return}if(a.dataset.visitorDismiss){const o=s.sim.dismissFarmVisitorOffer(a.dataset.visitorDismiss);o.ok||s.showToast(o.msg,"🦉"),ae(s);return}if(a.dataset.newspaperBuy){const o=s.sim.buyNewspaperClassifiedAd(a.dataset.newspaperBuy);o.ok||s.showToast(o.msg,"🪙"),ae(s),s.refreshHeader();return}if(a.id==="btnNewspaperRefreshEarly"){const o=s.sim.refreshDailyProphetNewspaperEarly();o.ok||s.showToast(o.msg,"⏳"),ae(s),s.refreshHeader()}}))}function In(e,t){if(t.activeWorkshopTab!=="barn"||e.dataset.activeWsTab!=="barn"||!e.querySelector('[data-barn-root="1"]'))return!1;const i=t.sim.state,s=Date.now(),n=t.sim.ensureFarmBarn(),a=t.sim.getBarnTotalUsed(),p=t.sim.ensureMarketFairState(),o=Math.max(0,Math.floor(i.herbalCompost??0)),l=Math.max(0,3-p.spotlightLotsSold),d=p.deals.filter(C=>!C.claimed&&(i.sandboxMode||t.sim.getFarmItemCount(C.inputItemId)>=C.inputQty)).length,v=l>0&&(i.sandboxMode||t.sim.getFarmItemCount(p.spotlightCropId)>=2||t.sim.getFarmItemCount(p.spotlightGoodId)>=1),h=d+(v?1:0),k=t.sim.ensureRoadsideStand(),r=k.slots.filter(C=>!!(C.itemId&&C.soldAt)).length,y=k.slots.filter(C=>!!C.itemId).length,f=i.supply.cargoCrates.filter(C=>C.fulfilled).length,$=t.sim.activeSynergies.activeIds.size,M=(C,q)=>{const F=e.querySelector(C);F&&F.textContent!==q&&(F.textContent=q)};M("#wsTabBarn .nb-tab-badge",`${a}/${n.capacity}`),M("#wsTabStand .nb-tab-badge",r>0?`${r} xong`:`${y}/${k.slots.length}`),M("#wsTabMarket .nb-tab-badge",h>0?`${h} sẵn`:`${l}/3`),M("#wsTabCargo .nb-tab-badge",`${f}/3`),M("#wsTabSynergy .nb-tab-badge",`${$}/12`);const I=t.sim.getHayDayWheatingProgress();M("[data-wheating-meter]",`✨ Lộc Mùa Vàng: ${I.current}/${I.threshold} vụ → rơi 🔌/🌿/🧪/⏳ (đã nhặt ${I.totalDrops})`);const N=Math.min(100,Math.round(a/Math.max(1,n.capacity)*100)),D=t.sim.getBarnUpgradeCostInfo(),g=i.sandboxMode?"+20 Ô (Miễn phí)":D.hasPlug?`+20 Ô (1 🔌 + ${D.baseGoldCost} Sickle)`:`+20 Ô (${D.effectiveGoldCost} Sickle)`,T=D.hasPlug?`🔌 ×${D.plugsInBarn}`:`🔌 ×0 (bù +${D.plugShortageBuyout} Sickle)`;M("[data-barn-cap-label]",`🏡 Kho Đỏ (${a}/${n.capacity})`),M("[data-barn-sub-meta]",`🦉 ${n.ordersDelivered} · ${T}`);const E=e.querySelector("[data-barn-cap-bar]");E&&(E.style.width=`${N}%`);const c=e.querySelector("#btnUpgradeFarmBarn");c&&(c.disabled=!D.canAfford,c.textContent=g,c.style.opacity=D.canAfford?"":"0.55",c.style.cursor=D.canAfford?"":"not-allowed");const u=t.sim.getPhoenixTalismanCount(),S=t.sim.getPhoenixTalismanDailyStatus(),w=t.sim.getCraftablePhoenixBarnGood(),R=w?oe(w):null,P=i.sandboxMode||u<Ne&&!!w&&i.galleons>=kt,B={dew:i.sandboxMode?"∞":`×${Math.max(0,Math.floor(i.morningDewPhials??0))}`,compost:i.sandboxMode?"∞":`×${o}`,sand:i.sandboxMode?"∞":`×${Math.max(0,Math.floor(i.timeSand??0))}`,plug:i.sandboxMode?"∞":`×${D.plugsInBarn}`,talisman:i.sandboxMode?"∞":`${u}/${Ne}`,tokens:`×${Math.max(0,Math.floor(t.sim.ensureNeighborSocial().friendshipTokens??0))}`};for(const[C,q]of Object.entries(B))M(`[data-pouch-id="${C}"] [data-pouch-qty]`,q);const L=e.querySelector("[data-helper-status]");L&&(n.farmHelperEndsAt&&n.farmHelperEndsAt>s?L.innerHTML=`<span style="color:#15803d;">Đang trực (${ge(Math.ceil((n.farmHelperEndsAt-s)/1e3))})</span>`:L.textContent="Tự động tưới luống mới & gom thành phẩm xưởng vào Kho Đỏ");const V=e.querySelector('[data-activate-helper="free_daily"]');V&&n.farmHelperFreeDayKey===es()&&V.remove(),M("[data-talisman-title]",`🔥 Bùa Phượng Hoàng (${i.sandboxMode?"∞":`${u}/${Ne}`})`),M("[data-talisman-sub]",`Hôm nay: ${S.usedCount}/${S.maxDaily} môn`);const m=e.querySelector("#btnCraftPhoenixTalisman");return m&&(m.disabled=!P,m.textContent=`🔥 Rèn +1 (${R?`1 ${R.name}`:"1 Đặc sản"} + ${kt} Sickle)`),e.querySelectorAll("[data-barn-card]").forEach(C=>{const q=C.dataset.barnCard,F=t.sim.getFarmItemCount(q),A=F>0||i.sandboxMode;C.classList.toggle("in-stock",F>0),C.classList.toggle("empty",F<=0);const _=C.querySelector("[data-barn-qty]"),K=`×${i.sandboxMode?"∞":F}`;_&&_.textContent!==K&&(_.textContent=K,C.classList.remove("is-patched-pop"),C.offsetWidth,C.classList.add("is-patched-pop"));const U=C.querySelector("[data-sell-farm-item]");U&&(U.disabled=!A,U.classList.toggle("gold-cta",A))}),!0}function ae(e){const t=e.root.querySelector("#workshopDialogContent");if(!t||(Bn(t,e),In(t,e)))return;const i=t.dataset.activeWsTab??"",s=Je(t),n=e.sim.state,a=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const p=e.sim.activeSynergies.activeIds.size,o=n.supply.cargoCrates.filter(g=>g.fulfilled).length,l=e.sim.ensureFarmBarn(),d=e.sim.getBarnTotalUsed(),v=e.sim.ensureMarketFairState(),h=Math.max(0,Math.floor(n.herbalCompost??0)),k=Math.max(0,3-v.spotlightLotsSold),r=v.deals.filter(g=>!g.claimed&&(n.sandboxMode||e.sim.getFarmItemCount(g.inputItemId)>=g.inputQty)).length,y=k>0&&(n.sandboxMode||e.sim.getFarmItemCount(v.spotlightCropId)>=2||e.sim.getFarmItemCount(v.spotlightGoodId)>=1),f=r+(y?1:0),$=e.sim.ensureRoadsideStand(),M=$.slots.filter(g=>!!(g.itemId&&g.soldAt)).length,I=$.slots.filter(g=>!!g.itemId).length,N=`
      <div class="workshop-tabs" role="tablist" aria-label="Kho, Sạp Ngõ, Chợ Phiên &amp; Xưởng">
        <button type="button" role="tab" id="wsTabBarn" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-selected="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          <span class="nb-tab-ico">🏡</span> Kho <span class="nb-tab-badge">${d}/${l.capacity}</span>
        </button>
        <button type="button" role="tab" id="wsTabStand" data-ws-tab="stand" data-active="${e.activeWorkshopTab==="stand"}" aria-selected="${e.activeWorkshopTab==="stand"}" class="brass-btn">
          <span class="nb-tab-ico">🧺</span> <span class="hs-long">Sạp Ngõ</span><span class="hs-short">Sạp</span> <span class="nb-tab-badge">${M>0?`${M} xong`:`${I}/${$.slots.length}`}</span>
        </button>
        <button type="button" role="tab" id="wsTabMarket" data-ws-tab="market" data-active="${e.activeWorkshopTab==="market"}" aria-selected="${e.activeWorkshopTab==="market"}" class="brass-btn">
          <span class="nb-tab-ico">🎪</span> <span class="hs-long">Chợ Phiên</span><span class="hs-short">Chợ</span> <span class="nb-tab-badge">${f>0?`${f} sẵn`:`${k}/3`}</span>
        </button>
        <button type="button" role="tab" id="wsTabCargo" data-ws-tab="cargo" data-active="${e.activeWorkshopTab==="cargo"}" aria-selected="${e.activeWorkshopTab==="cargo"}" class="brass-btn">
          <span class="nb-tab-ico">🚂</span> Tàu <span class="nb-tab-badge">${o}/3</span>
        </button>
        <button type="button" role="tab" id="wsTabBrew" data-ws-tab="brew" data-active="${e.activeWorkshopTab==="brew"}" aria-selected="${e.activeWorkshopTab==="brew"}" class="brass-btn">
          <span class="nb-tab-ico">🧪</span> <span class="hs-long">Vạc Phép</span><span class="hs-short">Vạc</span>
        </button>
        <button type="button" role="tab" id="wsTabSynergy" data-ws-tab="synergy" data-active="${e.activeWorkshopTab==="synergy"}" aria-selected="${e.activeWorkshopTab==="synergy"}" class="brass-btn">
          <span class="nb-tab-ico">🌟</span> Combo <span class="nb-tab-badge">${p}/12</span>
        </button>
      </div>
    `;let D="";if(e.activeWorkshopTab==="barn"){const g=Math.min(100,Math.round(d/Math.max(1,l.capacity)*100)),T=e.sim.getBarnUpgradeCostInfo(),E=n.sandboxMode?"+20 Ô (Miễn phí)":T.hasPlug?`+20 Ô (1 🔌 + ${T.baseGoldCost} Sickle)`:`+20 Ô (${T.effectiveGoldCost} Sickle)`,c=T.hasPlug?`🔌 ×${T.plugsInBarn}`:`🔌 ×0 (bù +${T.plugShortageBuyout} Sickle)`,u=oe(v.spotlightCropId),S=oe(v.spotlightGoodId),w=A=>A.map(_=>{const K=oe(_),U=e.sim.getFarmItemCount(_),J=e.sim.isItemMarketSpotlight(_);return`
              <div class="barn-stock-card ${U>0?"in-stock":"empty"}" data-barn-card="${_}">
                <img src="${K.iconSrc}" alt="${b(K.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${b(K.name)} ${J?'<span class="owl-spotlight-tag">🎪 Tiêu điểm</span>':""}</div>
                <div class="barn-stock-qty"><strong data-barn-qty>×${n.sandboxMode?"∞":U}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${U>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${_}"
                  ${U<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:12px;"
                >
                  🪙 +${K.sellValue} Sickle
                </button>
              </div>
            `}).join(""),R=e.sim.getPhoenixTalismanCount(),P=e.sim.getPhoenixTalismanDailyStatus(),B=e.sim.getCraftablePhoenixBarnGood(),L=B?oe(B):null,V=n.sandboxMode||R<Ne&&!!B&&n.galleons>=kt,m=Math.max(0,Math.floor(n.morningDewPhials??0)),C=Math.max(0,Math.floor(n.timeSand??0)),q=Math.max(0,Math.floor(e.sim.ensureNeighborSocial().friendshipTokens??0)),F=[{id:"dew",icon:"🧪",label:"Sương Mai",qty:n.sandboxMode?"∞":`×${m}`,hint:"🧪 Bình Sương Mai rút ngắn 15 phút giờ chờ xây dựng, ruộng & đồng cỏ — kiếm từ Hộp Mười Vụ, Hộp Quà Đồi Sương, Quà Dân Làng, Mốc Lễ Hội & Bách Khoa!"},{id:"compost",icon:"🌿",label:"Phân Ủ",qty:n.sandboxMode?"∞":`×${h}`,hint:"🌿 Phân Ủ Thảo Dược tăng +2 sản lượng thu hoạch & phục hồi đất/cây táo — kiếm từ Sạp Tiêu Điểm, Đơn Cú Tiêu Điểm, Hộp Mười Vụ & Kiện Hàng Chung!"},{id:"sand",icon:"⏳",label:"Cát",qty:n.sandboxMode?"∞":`×${C}`,hint:"⏳ Cát Xoay Thời Gian rút ngắn giờ chờ chế biến tại xưởng — kiếm từ Đại Tiệc, Chợ Phiên, Thành Tựu & Kiện Hàng Chung!"},{id:"plug",icon:"🔌",label:"Phích Cắm",qty:n.sandboxMode?"∞":`×${T.plugsInBarn}`,hint:"🔌 Phích Cắm Muggle mở rộng sức chứa Kho Đỏ — kiếm từ Đơn Cú, Kỷ Vật Ông Arthur & Thương Vụ Chợ Phiên!"},{id:"talisman",icon:"🔥",label:"Bùa",qty:n.sandboxMode?"∞":`${R}/${Ne}`,hint:"🔥 Bùa Phượng Hoàng vượt nhanh 1 màn khảo thí — rèn ngay tại Kho Đỏ, nhận từ Đơn Cú, Rương Tình Bạn & Điểm Danh 7 Ngày!"},{id:"tokens",icon:"🍀",label:"Tình Bạn",qty:`×${q}`,hint:"🍀 Huy Hiệu Tình Bạn (gom 10 cái mở Rương Tình Bạn) — kiếm từ Thăm Bạn Cổng Floo, Thả Tim, Kiện Hàng Chung & Bưu Thiếp!"}];D=`
        <div class="barn-header-card" data-barn-root="1">
          <div class="barn-head-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="barn-head-text">
              <div class="hs-card-title" data-barn-cap-label>🏡 Kho Đỏ (${d}/${l.capacity})</div>
              <div data-barn-sub-meta style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${l.ordersDelivered} · ${c}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${T.canAfford?"":"disabled"}
              style="padding:7px 14px;font-size:13px;${T.canAfford?"":"opacity:0.55;cursor:not-allowed;"}"
            >
              ${E}
            </button>
          </div>
          <div class="quest-bar" style="height:8px;margin-top:8px;">
            <div class="quest-bar-fill" data-barn-cap-bar style="width:${g}%"></div>
          </div>
          ${(()=>{const A=e.sim.getHayDayWheatingProgress();return`<div data-wheating-meter style="margin-top:6px;font-size:12px;font-weight:700;color:var(--brand-strong);">✨ Lộc Mùa Vàng: ${A.current}/${A.threshold} vụ → rơi 🔌/🌿/🧪/⏳ (đã nhặt ${A.totalDrops})</div>`})()}
        </div>

        <div class="hs-utility-pouch" role="group" aria-label="Túi Vật Tư Phép Thuật — bấm từng món xem cách kiếm">
          <div class="hs-utility-pouch-head">
            <span>✨ Túi Vật Tư Phép Thuật</span>
            <span class="hs-utility-pouch-sub">Chạm từng món xem cách kiếm</span>
          </div>
          <div class="hs-utility-pouch-grid">
            ${F.map(A=>`
                <button
                  type="button"
                  class="hs-pouch-chip"
                  data-pouch-id="${A.id}"
                  data-pouch-hint="${b(A.hint)}"
                  data-pouch-icon="${A.icon}"
                  title="${b(A.hint)}"
                >
                  <span class="hs-pouch-ico" aria-hidden="true">${A.icon}</span>
                  <span class="hs-pouch-name">${A.label}</span>
                  <strong class="hs-pouch-qty" data-pouch-qty>${A.qty}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;white-space:normal;overflow-wrap:break-word;">
            🎪 <strong>Tiêu Điểm Hôm Nay:</strong> ${u.emoji} ${b(u.name)} &amp; ${S.emoji} ${b(S.name)}
          </div>
          <button type="button" class="brass-btn gold-cta" data-ws-tab="market" style="padding:5px 10px;font-size:12px;">
            🎪 Vào Chợ Phiên (+60%)
          </button>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;">
            <div>🧙 <strong>Phụ Tá Gia Tinh Bà Molly:</strong> <span data-helper-status>${l.farmHelperEndsAt&&l.farmHelperEndsAt>a?`<span style="color:#15803d;">Đang trực (${ge(Math.ceil((l.farmHelperEndsAt-a)/1e3))})</span>`:"Tự động tưới luống mới &amp; gom thành phẩm xưởng vào Kho Đỏ"}</span></div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${l.farmHelperFreeDayKey!==es()?'<button type="button" class="brass-btn gold-cta" data-activate-helper="free_daily" style="padding:5px 10px;font-size:12px;">🎁 30p Miễn phí</button>':""}
            <button type="button" class="brass-btn" data-activate-helper="feast_points" style="padding:5px 10px;font-size:12px;">🍁 2h (20 điểm)</button>
            <button type="button" class="brass-btn" data-activate-helper="sickle" style="padding:5px 10px;font-size:12px;">🪙 2h (120 Sickle)</button>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <h3 class="barn-talisman-forge-title" data-talisman-title>
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${R}/${Ne}`})
            </h3>
            <div class="barn-talisman-forge-sub" data-talisman-sub style="margin-top:2px;">
              Hôm nay: ${P.usedCount}/${P.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${V?"":"disabled"}
            style="padding:8px 12px;font-size:12px;"
          >
            🔥 Rèn +1 (${L?`1 ${b(L.name)}`:"1 Đặc sản"} + ${kt} Sickle)
          </button>
        </div>

        <h3 class="hs-section-title" style="margin:12px 0 6px;">Nông sản (${Object.keys(Se).length})</h3>
        <div class="barn-stock-grid">
          ${w(Object.keys(Se))}
        </div>

        <h3 class="hs-section-title" style="margin:14px 0 6px;">Đặc sản (${Object.keys(De).length})</h3>
        <div class="barn-stock-grid">
          ${w(Object.keys(De))}
        </div>
      `}else if(e.activeWorkshopTab==="stand"){const T=[...Object.keys(Se),...Object.keys(De)].filter(L=>n.sandboxMode||e.sim.getFarmItemCount(L)>0);T.length>0&&!T.includes(e.selectedStandItemId)&&(e.selectedStandItemId=T[0]);const E=oe(e.selectedStandItemId),c=e.sim.getFarmItemCount(e.selectedStandItemId),u=ka(e.selectedStandItemId,e.selectedStandPriceTier),S=Math.max(1,Math.min(Re,n.sandboxMode?Re:c)),w=$.lastAdPublishedAt&&a-$.lastAdPublishedAt<ps?Math.ceil((ps-(a-$.lastAdPublishedAt))/1e3):0,R=e.sim.getFarmVisitors(a),P=e.sim.getDailyProphetNewspaper(a),B=Math.max(0,Math.ceil((P.nextRefreshAt-a)/1e3));D=`
        <div class="quest-card-mini">
          <div class="hs-card-title">🧺 Sạp Hàng Đầu Ngõ Hang Sóc (${$.slots.length} Ô · Tối đa ×10/ô)</div>
          <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 8px;">
            Bày nông sản dư lấy Sickle — bấm <strong>📰 Đăng báo</strong> miễn phí mỗi 3 phút để khách mua nhanh gấp 3 lần!
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="selStandItem" aria-label="Chọn nông sản bày sạp" style="flex:1;min-width:160px;min-height:38px;padding:4px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:var(--ink);font-weight:700;">
              ${(T.length>0?T:["ottery_wheat"]).map(L=>{const V=oe(L),m=e.sim.getFarmItemCount(L);return`<option value="${L}" ${L===e.selectedStandItemId?"selected":""}>${b(V.name)} (×${n.sandboxMode?"∞":m})</option>`}).join("")}
            </select>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${[1,3,5,10].map(L=>`<button type="button" data-stand-qty-cap="${L}" aria-pressed="${Re===L}" class="brass-btn ${Re===L?"gold-cta":""}" style="padding:4px 8px;font-size:12px;">×${L}</button>`).join("")}
            </div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              ${[["bargain","Giá hời (nhanh)"],["fair","Chuẩn (+15%)"],["premium","Cao (+35%)"]].map(([L,V])=>`<button type="button" data-stand-tier="${L}" data-active="${e.selectedStandPriceTier===L}" aria-pressed="${e.selectedStandPriceTier===L}" class="brass-btn ${e.selectedStandPriceTier===L?"gold-cta":""}" style="padding:4px 8px;font-size:12px;">${V}</button>`).join("")}
            </div>
          </div>
          <div style="font-size:12px;font-weight:700;margin-top:6px;">
            Lô bày: <strong>${S} × ${b(E.name)}</strong> → <strong>+${u*S} Sickle</strong>${w>0?` · 📰 Đăng báo tiếp sau ${ge(w)}`:" · 📰 Sẵn sàng Đăng báo ×3 miễn phí"}
          </div>
        </div>

        <div class="market-deal-grid" style="margin-top:8px;">
          ${$.slots.map(L=>{if(!L.itemId){const A=n.sandboxMode||c>=1;return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">Ô Sạp #${L.slotIndex+1} · Trống</div>
                    <div style="font-size:12px;color:var(--ink-soft);margin:4px 0;">Sẵn sàng bày ${S} ${b(E.name)}</div>
                    <button type="button" data-stand-list="${L.slotIndex}" ${A?"":"disabled"} class="brass-btn ${A?"gold-cta":""}" style="width:100%;">
                      🧺 Bày bán (+${u*S} Sickle)
                    </button>
                  </div>
                `}const V=oe(L.itemId),m=L.qty*L.unitPrice;if(L.soldAt)return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">${L.buyerEmoji??"🍺"} ${b(L.buyerName??"Khách lữ hành")} đã mua!</div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${V.iconSrc}" alt="${b(V.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">${L.qty} × ${b(V.name)}</div>
                    </div>
                    <button type="button" data-stand-claim="${L.slotIndex}" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">
                      🪙 Thu +${m} Sickle
                    </button>
                  </div>
                `;const C=Ma(L.unitPrice,V.sellValue,!!L.advertised),q=Math.max(1,Math.ceil((L.listedAt+C-a)/1e3)),F=!L.advertised&&(n.sandboxMode||w<=0);return`
                <div class="market-deal-card">
                  <div class="hs-card-title">Ô Sạp #${L.slotIndex+1} · ${L.advertised?"📰 Đang lên báo ×3":"Đang rao"}</div>
                  <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                    <img src="${V.iconSrc}" alt="${b(V.name)}" style="width:32px;height:32px;object-fit:contain;" />
                    <div>
                      <div style="font-size:13px;font-weight:700;">${L.qty} × ${b(V.name)}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">Giá ${m} Sickle · khách ghé ~${ge(q)}</div>
                    </div>
                  </div>
                  ${L.advertised?'<div style="font-size:12px;font-weight:700;color:#15803d;">✓ Đã đăng lên Nhật Báo (tốc độ ×3)</div>':`<button type="button" data-stand-advertise="${L.slotIndex}" ${F?"":"disabled"} class="brass-btn ${F?"gold-cta":""}" style="width:100%;font-size:12px;padding:5px 8px;">
                          ${w>0&&!n.sandboxMode?`📰 Chờ ${ge(w)}`:"📰 Đăng báo (×3 tốc độ)"}
                        </button>`}
                </div>
              `}).join("")}
        </div>

        <h3 class="hs-section-title" style="margin:14px 0 6px;">🦉 Khách Dạo Cổng Hang Sóc (Mua giá cao +18% đến +32%)</h3>
        <div class="market-deal-grid">
          ${R.map(L=>{if(L.arrivesAt&&L.arrivesAt>a){const q=Math.max(1,Math.ceil((L.arrivesAt-a)/1e3));return`
                  <div class="market-deal-card" style="opacity:0.78;">
                    <div class="hs-card-title">🦉 Đang đón vị khách mới...</div>
                    <div style="font-size:12px;color:var(--ink-soft);margin-top:4px;">Sẽ ghé cổng Hang Sóc sau ${le(q)}</div>
                  </div>
                `}const V=oe(L.itemId),m=e.sim.getFarmItemCount(L.itemId),C=n.sandboxMode||m>=L.qty;return`
                <div class="market-deal-card">
                  <div class="hs-card-title">${L.visitorEmoji} ${b(L.visitorName)}</div>
                  <div style="font-size:12px;color:var(--ink-soft);margin:2px 0 6px;">"${b(L.quoteVi)}"</div>
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="${V.iconSrc}" alt="${b(V.name)}" style="width:32px;height:32px;object-fit:contain;" />
                    <div style="font-size:13px;font-weight:700;">
                      Mua ${L.qty} ${b(V.name)} <span style="opacity:0.8;">(Kho: ${n.sandboxMode?"∞":m})</span>
                    </div>
                  </div>
                  <div style="display:flex;gap:6px;">
                    <button type="button" data-visitor-accept="${b(L.id)}" ${C?"":"disabled"} class="owl-green-send-btn" style="flex:1;padding:6px 8px;font-size:12px;${C?"":"opacity:0.55;"}">
                      ✓ Bán +🪙${L.offerSickle} · +⭐${L.offerXp}
                    </button>
                    <button type="button" data-visitor-dismiss="${b(L.id)}" class="brass-btn" style="padding:6px 10px;font-size:12px;" title="Hẹn dịp khác (đổi khách mới sau 90 giây)">
                      ✕
                    </button>
                  </div>
                </div>
              `}).join("")}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:14px 0 6px;">
          <h3 class="hs-section-title" style="margin:0;">📰 Nhật Báo Tiên Tri — Số #${P.editionId} (đổi sau ${ge(B)})</h3>
          <button id="btnNewspaperRefreshEarly" type="button" class="brass-btn" style="padding:4px 10px;font-size:12px;" title="Gọi Cú giao số báo mới sớm (1 Cát)">
            ⏳ Số mới (1 Cát)
          </button>
        </div>
        <div class="market-deal-grid">
          ${P.ads.map(L=>{const V=L.kind==="farm_item"&&L.itemId?`${L.qty} × ${oe(L.itemId).name}`:L.kind==="muggle_plug"?`${L.qty} × 🔌 Bộ Phích Cắm Muggle`:L.kind==="compost"?`${L.qty} × 🌿 Phân Ủ Thảo Dược`:`${L.qty} × 🧪 Bình Sương Mai`,m=L.kind==="farm_item"&&L.itemId?`<img src="${oe(L.itemId).iconSrc}" alt="${b(V)}" style="width:32px;height:32px;object-fit:contain;" />`:`<span style="font-size:24px;line-height:1;">${L.kind==="muggle_plug"?"🔌":L.kind==="compost"?"🌿":"🧪"}</span>`,C=!L.sold&&(n.sandboxMode||n.galleons>=L.priceSickle);return`
                <div class="market-deal-card ${L.sold?"claimed":""}" style="${L.isRareDeal?"border-color:#d97706;":""}">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                    <div class="hs-card-title">${L.sellerEmoji} ${b(L.sellerName)}</div>
                    ${L.isRareDeal?'<span class="owl-spotlight-tag">✨ Hàng hiếm</span>':""}
                  </div>
                  <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                    ${m}
                    <div style="font-size:13px;font-weight:700;">${b(V)}</div>
                  </div>
                  <button type="button" data-newspaper-buy="${b(L.id)}" ${C?"":"disabled"} class="brass-btn ${C?"gold-cta":""}" style="width:100%;padding:5px 8px;font-size:12px;">
                    ${L.sold?"✓ Đã mua":`🪙 Mua (${L.priceSickle} Sickle)`}
                  </button>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="market"){const g=oe(v.spotlightCropId),T=oe(v.spotlightGoodId),E=e.sim.getFarmItemCount(v.spotlightCropId),c=e.sim.getFarmItemCount(v.spotlightGoodId),u=Math.max(16,Math.round(g.sellValue*2*1.6)+12),S=Math.max(16,Math.round(T.sellValue*1*1.6)+12),w=k>0&&(n.sandboxMode||E>=2),R=k>0&&(n.sandboxMode||c>=1),P=Math.max(0,1-v.rerollsUsed);D=`
        <div class="market-spotlight-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div>
              <div class="hs-card-title">Sạp Tiêu Điểm (${k}/3 lô hôm nay)</div>
              <div class="hs-stat-pills">
                <span class="hs-stat-pill" title="Thu mua giá cao cộng thêm 60% Sickle mỗi lô sỉ">🪙 +60% Sickle</span>
                <span class="hs-stat-pill" title="Tặng thêm 1 Phân Ủ Thảo Dược mỗi lô">🌿 +1</span>
                <span class="hs-stat-pill" title="Tặng 12 điểm Đại Tiệc Mùa Gặt mỗi lô">🍁 +12</span>
                <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 Kho: ×${n.sandboxMode?"∞":h}</span>
                <span class="hs-stat-pill is-active" title="Đơn Hàng Cú có món Tiêu Điểm hôm nay thưởng thêm 1 Phân Ủ, 8 XP và 6 điểm Đại Tiệc">🦉 +1🌿 · +8⭐</span>
              </div>
            </div>
          </div>

          <div class="market-deal-grid">
            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${g.iconSrc}" alt="${b(g.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">2 × ${b(g.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${n.sandboxMode?"∞":E}/2</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${w?"gold-cta":""}" data-sell-spotlight="crop" title="Bán 2 nông sản Tiêu Điểm lấy ${u} Sickle và 1 Phân Ủ" ${w?"":"disabled"} style="width:100%;">
                🪙 +${u} · +1 🌿
              </button>
            </div>

            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${T.iconSrc}" alt="${b(T.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">1 × ${b(T.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${n.sandboxMode?"∞":c}/1</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${R?"gold-cta":""}" data-sell-spotlight="good" title="Bán 1 đặc sản Tiêu Điểm lấy ${S} Sickle và 1 Phân Ủ" ${R?"":"disabled"} style="width:100%;">
                🪙 +${S} · +1 🌿
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:10px 0 8px;">
          <h3 class="hs-section-title" style="margin:0;">3 Thương Vụ Thương Lái Hogsmeade</h3>
          <button id="btnRerollMarketFair" type="button" class="brass-btn" ${P<=0&&!n.sandboxMode?"disabled":""}>
            🔄 Đổi Sạp (${n.sandboxMode?"∞":`${P}/1`})
          </button>
        </div>

        <div class="market-deal-grid">
          ${v.deals.map(B=>{const L=oe(B.inputItemId),V=e.sim.getFarmItemCount(B.inputItemId),m=!B.claimed&&(n.sandboxMode||V>=B.inputQty),C=[{label:`🪙 +${B.rewardSickle}`,tip:`Thưởng ${B.rewardSickle} Sickle`},{label:`⭐ +${B.rewardXp}`,tip:`Thưởng ${B.rewardXp} XP`}];if(B.rewardCompost&&C.push({label:`🌿 +${B.rewardCompost}`,tip:`Thưởng ${B.rewardCompost} Phân Ủ Thảo Dược`}),B.rewardSeedCropId&&B.rewardSeedQty){const q=Se[B.rewardSeedCropId];C.push({label:`🌱 +${B.rewardSeedQty} ${b(q.name)}`,tip:`Tặng ${B.rewardSeedQty} hạt ${b(q.name)}`})}return B.rewardMorningDew&&C.push({label:`💧 +${B.rewardMorningDew}`,tip:`Thưởng ${B.rewardMorningDew} Bình Sương Mai`}),B.rewardMugglePlug&&C.push({label:`🔌 +${B.rewardMugglePlug}`,tip:`Thưởng ${B.rewardMugglePlug} Phích Cắm`}),B.rewardTimeSand&&C.push({label:`⏳ +${B.rewardTimeSand}`,tip:`Thưởng ${B.rewardTimeSand} Cát Xoay Thời Gian`}),`
                <div class="market-deal-card ${B.claimed?"claimed":""}">
                  <div>
                    <div class="hs-card-title" style="margin-bottom:6px;">${B.merchantEmoji} ${b(B.merchantName)}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <img src="${L.iconSrc}" alt="${b(L.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">
                        ${b(L.name)} (${n.sandboxMode?"∞":V}/${B.inputQty})
                      </div>
                    </div>
                    <div class="hs-stat-pills">
                      ${C.map(q=>`<span class="hs-stat-pill" title="${q.tip}">${q.label}</span>`).join("")}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="brass-btn ${m?"gold-cta":""}"
                    data-claim-market-deal="${b(B.id)}"
                    title="${B.claimed?"Đã giao dịch thương vụ này hôm nay":`Đổi ${B.inputQty} ${b(L.name)} lấy thương vụ`}"
                    ${B.claimed||!m?"disabled":""}
                    style="width:100%;"
                  >
                    ${B.claimed?"✓ Đã chốt":"🪙 Chốt đơn"}
                  </button>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const g=Math.max(0,Math.ceil((2e4-(a-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),T=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-a)/1e3)),E=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-a)/1e3)),c=n.supply.activeBrew,u=c?St.find(m=>m.id===c.goodId):void 0,S=c?Math.max(0,Math.ceil((c.endsAt-a)/1e3)):0,w=Math.max(0,n.supply.brewCompletedCount??0),R=w+1,P=n.buildings.some(m=>Y(m.itemId)?.isWorkshopBrewery&&a>=m.constructEndsAt),B=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),L=w===0?"Mẻ #1 (1h)":w===1?"Mẻ #2 (2h)":w===2?"Mẻ #3 (4h)":`Mẻ #${R} (6h)`,V=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];D=`
        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div class="hs-card-title">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${g===0||n.sandboxMode?"gold-cta":""}">
            ${g>0&&!n.sandboxMode?`🌱 (${ge(g)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="font-size:12px;line-height:1.45;">
          <div style="font-size:13px;font-weight:700;color:var(--brand-strong);">
            🔥 Nhiệt Vạc · ${L}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Chu kỳ 1h → 2h → 4h → 6h.${P?" ✓ −45% Xưởng.":" Dựng Xưởng −45%."}${B?" ✓ −22% Combo.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${V.map(m=>{const C=Ft[m],q=n.supply.ingredients[m]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
                    <span>${C.emoji} ${C.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":q}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${T>0||E>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="font-size:12px;font-weight:700;color:#15803d;">
                ✨ ${T>0?`🍻 +85% Sickle (${le(T)}) `:""}${E>0?`• 🧪 +35% XP (${le(E)})`:""}
              </div>
            `:""}

        ${c&&u?`
              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13px;font-weight:700;color:#6b21a8;">
                    🔥 ${u.emoji} ${b(u.name)} (${le(S)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${St.map(m=>{const C=n.supply.goods[m.id]??0,q=e.sim.getBrewDurationSec(m),F=ge(q),A=Object.entries(m.inputs).map(([_,K])=>{const U=Ft[_],J=n.supply.ingredients[_]??0;return`<span style="color:${n.sandboxMode||J>=(K??0)?"#15803d":"#dc2626"};font-weight:700;">${U.emoji} ${J}/${K}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="hs-card-title">${m.emoji} ${m.name}</span>
                    <span style="font-size:12px;font-weight:700;color:#7c2d12;">×${n.sandboxMode?"∞":C}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${A}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${m.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${F})
                  </button>
                  <button type="button" data-use-good="${m.id}" class="brass-btn" style="flex:1;">
                    ${m.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const g=Math.max(1,Math.round((240+n.level*40)/5)),T=Math.round(160+n.level*25),E=n.supply.cargoCrates.some(c=>!!(c.helpRequestedAt||c.helpedByNeighborName));D=`
        <div class="quest-card-mini">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="hs-card-title">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:700;">+${g.toLocaleString("vi-VN")} Sickle · +${T} ⭐ · +2 ⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((c,u)=>{const S=e.sim.getCargoCrateStockInfo(c),w=oe(S.barnItemId),R=St.find(P=>P.id===c.goodId);return`
                <div class="crate-card ${c.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#92400e;">
                      <span>#${u+1}</span>
                      <span>${c.fulfilled?"✓":`${n.sandboxMode?"∞":S.haveBarn}/${c.qtyRequired}`}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${w.iconSrc}" alt="${b(w.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div>
                        <div class="hs-card-title">${b(w.name)} ×${c.qtyRequired}</div>
                        ${S.allowBrewEquiv&&R&&S.haveBrew>0?`<div style="font-size:11px;opacity:0.8;">+ ${S.haveBrew} mẻ ${b(R.name)} (Vạc Phép)</div>`:""}
                      </div>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${c.rewardSickle} Sickle · +${c.rewardXp} ⭐ · +${c.rewardTimeSand} ⏳
                    </div>
                  </div>
                  ${c.fulfilled?`<div style="font-size:12px;font-weight:700;color:#15803d;text-align:center;padding:6px 0;">${c.helpedByNeighborName?`✓ ${b(c.helpedByNeighborEmoji??"🤝")} ${b(c.helpedByNeighborName)} đóng hộ`:"✓ Đã chất"}</div>`:S.canFulfill?`<button type="button" data-fulfill-crate="${b(c.id)}" class="brass-btn gold-cta" style="width:100%;">📦 Chất hàng</button>`:`<div style="display:flex;flex-direction:column;gap:6px;">
                            <button type="button" data-jump-cargo-item="${b(S.barnItemId)}" class="brass-btn gold-cta" style="width:100%;">→ Tìm / Sản xuất</button>
                            ${c.helpRequestedAt?'<div style="font-size:12px;font-weight:700;color:var(--brand-strong);text-align:center;padding:4px 0;">🦉 Đang gọi...</div>':`<button type="button" data-help-cargo-crate="${b(c.id)}" class="brass-btn" style="width:100%;" title="Nhờ hàng xóm đóng hộ kiện hàng này (tối đa 1 kiện mỗi chuyến tàu)" ${E?"disabled":""}>🦉 Nhờ đóng hộ (1/tàu)</button>`}
                            ${S.allowBrewEquiv?'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu ở Vạc Phép</button>':""}
                          </div>`}
                </div>
              `}).join("")}
        </div>
      `}else D=`
        <div class="grid-2col">
          ${$a.map(g=>{const T=e.sim.activeSynergies.activeIds.has(g.id),E=g.requiredItems.map(c=>Y(c)?.name??c).join(" + ");return`
              <div class="quest-card-mini" style="border-color:${T?"#d97706":"rgba(176, 125, 67, 0.45)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span class="hs-card-title">${g.emoji} ${b(g.name)}</span>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;color:${T?"#15803d":"#78350f"};">
                    ${T?"✓":`≤${g.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">${E}</div>
                <div style="font-size:12px;font-weight:700;color:#15803d;">
                  +${g.goldBonusPct}% Sickle · +${g.xpBonusPct}% XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=N+D,t.dataset.activeWsTab=e.activeWorkshopTab,et(t,s,!!(i&&i!==e.activeWorkshopTab)),t.dataset.cargoSig=n.supply.cargoCrates.map(g=>`${g.id}:${g.fulfilled?1:0}:${g.helpRequestedAt?1:0}:${g.helpedByNeighborName??""}`).join("|")}const ws="/trang-trai-hang-soc/sprites/",at=new WeakMap;function me(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ns(e){switch(e){case"harvest_crop":return"🌾";case"owl_order":return"🦉";case"workshop_batch":return"🥧";case"visitor_sale":return"🪙";case"cargo_crate":return"📦";case"pasture_harvest":return"🐾";case"minigame_win":return"🏆";case"molly_supply":return"🧺"}}function Dn(e){switch(e){case"harvest_crop":return{ctaLabel:"→ Ra ruộng",hintVi:"Gợi ý: Thu hoạch các thửa ruộng chín ngoài thung lũng để cộng tiến độ ngay."};case"owl_order":return{ctaLabel:"→ Mở Đơn Cú",hintVi:"Gợi ý: Chuyển sang tab Đơn Cú ngay bên trên để gửi đơn giao hàng."};case"workshop_batch":return{ctaLabel:"→ Ra xưởng",hintVi:"Gợi ý: Thu hoạch mẻ bánh hoặc đặc sản đã chín tại các xưởng chế biến."};case"visitor_sale":return{ctaLabel:"→ Đón khách",hintVi:"Gợi ý: Chạm Khách Ghé Cổng đứng gần Quầy Ven Đường để bán nhanh."};case"cargo_crate":return{ctaLabel:"→ Mở Tàu Hàng",hintVi:"Gợi ý: Mở kho Tàu Tốc Hành để đóng kiện tiếp tế nhận điểm."};case"pasture_harvest":return{ctaLabel:"→ Ra đồng cỏ",hintVi:"Gợi ý: Thu hoạch trứng, sữa, lông tại Đồng Cỏ Thú ngoài trang trại."};case"minigame_win":return{ctaLabel:"→ Chơi Mini Game",hintVi:"Gợi ý: Thắng bất kỳ màn Bùa Gặt hoặc Đại Sảnh Khảo Thí để ghi tiến độ."};case"molly_supply":return{ctaLabel:"→ Vào ván dùng Gói",hintVi:"Gợi ý: Dùng Gói Tiếp Tế Bà Molly trong lúc chơi Mini Game."}}}function Rn(e){return!!(e.completedAt||e.objectives.length>0&&e.objectives.every(t=>t.progress>=t.target))}function Nn(e){const t=[];return e.rewardSickle>0&&t.push(`<span class="hs-derby-rew-chip is-sickle">🪙 +${e.rewardSickle.toLocaleString("vi-VN")}</span>`),e.rewardPlug&&e.rewardPlug>0&&t.push(`<span class="hs-derby-rew-chip">🔌 +${e.rewardPlug}</span>`),e.rewardCompost&&e.rewardCompost>0&&t.push(`<span class="hs-derby-rew-chip">🌿 +${e.rewardCompost}</span>`),e.rewardDew&&e.rewardDew>0&&t.push(`<span class="hs-derby-rew-chip">🧪 +${e.rewardDew} Sương</span>`),e.rewardSand&&e.rewardSand>0&&t.push(`<span class="hs-derby-rew-chip">⏳ +${e.rewardSand}</span>`),e.rewardTalisman&&e.rewardTalisman>0&&t.push(`<span class="hs-derby-rew-chip is-fire">🔥 +${e.rewardTalisman} Bùa</span>`),e.rewardStars&&e.rewardStars>0&&t.push(`<span class="hs-derby-rew-chip is-star">🌟 +${e.rewardStars}</span>`),t.join("")}function On(e,t,i){const s=new Set(t),n=Ie[Ie.length-1]?.pointsRequired??2e3,a=Math.min(100,Math.round(e/Math.max(1,n)*100)),p=Ie.filter(h=>s.has(h.tier)).length,o=Ie.filter(h=>!s.has(h.tier)&&(i||e>=h.pointsRequired)).length,l=Ie.map(h=>{const k=s.has(h.tier),r=i||e>=h.pointsRequired,y=k?"is-claimed":r?"is-ready":"is-locked",f=h.pointsRequired>=1e3?`${(h.pointsRequired/1e3).toFixed(1).replace(/\.0$/,"")}k`:String(h.pointsRequired);return`
      <div class="hs-derby-track-node ${y}">
        <span class="hs-derby-track-dot" aria-hidden="true">${k?"✓":h.tier}</span>
        <span class="hs-derby-track-pts">${f}</span>
      </div>
    `}).join(""),d=Ie.map(h=>{const k=s.has(h.tier),r=i||e>=h.pointsRequired,y=!k&&r,f=k?"is-claimed":y?"is-ready":"is-locked",$=h.tier===5?" is-grand":"",M=Math.max(0,h.pointsRequired-e),I=k?'<span class="hs-derby-ms-status is-claimed">✓ Đã nhận</span>':y?`<button type="button" class="hs-derby-btn hs-derby-btn-green hs-derby-ms-claim" data-derby-claim-milestone="${h.tier}">🎁 Nhận</button>`:`<span class="hs-derby-ms-status is-locked">🔒 Còn ${M.toLocaleString("vi-VN")} đ</span>`;return`
      <article class="hs-derby-ms-card ${f}${$}">
        <div class="hs-derby-ms-top">
          <div class="hs-derby-ms-head">
            <span class="hs-derby-ms-tier">Mốc ${h.tier}</span>
            <strong class="hs-derby-ms-title">${me(h.labelVi)}</strong>
          </div>
          <span class="hs-derby-ms-pts">🏆 ${h.pointsRequired.toLocaleString("vi-VN")} đ</span>
        </div>
        <div class="hs-derby-ms-body">
          <div class="hs-derby-ms-rewards">${Nn(h)}</div>
          <div class="hs-derby-ms-cta">${I}</div>
        </div>
      </article>
    `}).join("");return`
    <section class="hs-derby-section hs-derby-milestones" aria-label="5 Rương Mốc Derby">
      <div class="hs-derby-sec-head">
        <h3 class="hs-derby-sec-title">🎁 5 Rương Mốc Derby</h3>
        ${o>0?`<span class="hs-derby-sec-pill is-ready">🎁 ${o} rương chờ mở</span>`:`<span class="hs-derby-sec-pill">${p}/${Ie.length} đã nhận</span>`}
      </div>
      <div class="hs-derby-track-wrap">
        <div class="hs-derby-track-bar" role="progressbar" aria-label="Tiến độ Rương Mốc Derby" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${Math.min(e,n)}">
          <div class="hs-derby-track-fill" style="width:${a}%"></div>
        </div>
        <div class="hs-derby-track-nodes">${l}</div>
      </div>
      <div class="hs-derby-ms-grid">${d}</div>
    </section>
  `}function Fn(e,t,i,s,n){if(!e){const h=i>=s,k=h?n?`Bạn đã hoàn thành toàn bộ ${s}/${s} nhiệm vụ Derby tuần này — thành tích tuyệt vời cho Nhà!`:`Bạn đã hoàn thành đủ ${Vt}/${Vt} nhiệm vụ tuần này! Có thể mở thêm nhiệm vụ #8 bằng ${Ps} ⏳ Cát ở đầu trang.`:"Chọn 1 nhiệm vụ từ bảng 8 việc bên dưới để bắt đầu ghi điểm Derby cho Nhà!";return`
      <section class="hs-derby-section hs-derby-active-sec" aria-label="Nhiệm Vụ Đang Làm">
        <div class="hs-derby-sec-head">
          <h3 class="hs-derby-sec-title">⭐ Nhiệm Vụ Đang Làm</h3>
          <span class="hs-derby-sec-pill">${h?"✓ Đủ định mức":"Trống"}</span>
        </div>
        <div class="hs-derby-active-empty${h?" is-capped":""}">
          <span class="hs-derby-empty-ico" aria-hidden="true">${h?"🏆":"🌾"}</span>
          <p class="hs-derby-empty-text">${me(k)}</p>
        </div>
      </section>
    `}const a=Rn(e),p=Math.max(0,Math.ceil((e.expiresAt-t)/1e3)),o=e.objectives.find(h=>h.progress<h.target)??e.objectives[0],l=o?Dn(o.eventKind):null,d=e.objectives.map(h=>{const k=h.progress>=h.target,r=Math.min(100,Math.round(h.progress/Math.max(1,h.target)*100)),y=Ns(h.eventKind);return`
        <div class="hs-derby-obj-row${k?" is-done":""}">
          <div class="hs-derby-obj-top">
            <span class="hs-derby-obj-label">${y} ${me(h.labelVi)}</span>
            <span class="hs-derby-obj-count">${k?"✓ ":""}${Math.min(h.progress,h.target)}/${h.target}</span>
          </div>
          <div class="hs-derby-obj-bar" aria-hidden="true">
            <div class="hs-derby-obj-fill${k?" is-done":""}" style="width:${r}%"></div>
          </div>
        </div>
      `}).join(""),v=a?`
      <div class="hs-derby-active-actions is-ready">
        <button type="button" id="btnDerbyCompleteActive" class="hs-derby-btn hs-derby-btn-green hs-derby-submit-cta">
          🏆 Nộp +${e.points.toLocaleString("vi-VN")} đ Derby
        </button>
      </div>
    `:`
      ${l?`<div class="hs-derby-jump-hint">${me(l.hintVi)}</div>`:""}
      <div class="hs-derby-active-actions">
        ${o&&l?`<button type="button" class="hs-derby-btn hs-derby-btn-gold" data-derby-jump="${me(o.eventKind)}">${me(l.ctaLabel)}</button>`:""}
        <button type="button" id="btnDerbyAbandonActive" class="hs-derby-btn hs-derby-btn-danger">
          ✕ Hủy nhiệm vụ
        </button>
      </div>
    `;return`
    <section class="hs-derby-section hs-derby-active-sec" aria-label="Nhiệm Vụ Đang Làm">
      <div class="hs-derby-sec-head">
        <h3 class="hs-derby-sec-title">⭐ Nhiệm Vụ Đang Làm</h3>
        <span class="hs-derby-sec-pill${a?" is-ready":""}">
          ${a?"✓ Sẵn sàng nộp":`⏳ <span data-derby-countdown-end="${e.expiresAt}">${le(p)}</span>`}
        </span>
      </div>
      <div class="hs-derby-active-card${a?" is-ready":""}${e.isHybridCombo?" is-hybrid":""}">
        <div class="hs-derby-active-head">
          <div class="hs-derby-active-title-wrap">
            <strong class="hs-derby-active-title">${me(e.emoji)} ${me(e.titleVi)}</strong>
            ${e.isHybridCombo?'<span class="hs-derby-hybrid-pill">🔥 Giao Thoa (Nông Trại + Mini Game)</span>':""}
          </div>
          <span class="hs-derby-pts-pill">🏆 +${e.points} đ</span>
        </div>
        <div class="hs-derby-obj-list">${d}</div>
        ${v}
      </div>
    </section>
  `}function Vn(e,t,i,s){if(!!(e.trashedUntilAt&&e.trashedUntilAt>t)){const l=Math.max(1,Math.ceil((e.trashedUntilAt-t)/1e3));return`
      <article class="hs-derby-task-card is-trashed" data-derby-slot="${e.slotIndex}">
        <div class="hs-derby-card-top">
          <span class="hs-derby-slot-tag">Ô #${e.slotIndex+1}</span>
          <span class="hs-derby-dur-pill">⏳ <span data-derby-countdown-end="${e.trashedUntilAt}" data-derby-countdown-trash="1">${le(l)}</span></span>
        </div>
        <div class="hs-derby-trashed-body">
          <strong class="hs-derby-trashed-title">Đang gọi nhiệm vụ mới…</strong>
          <p class="hs-derby-trashed-sub">Tự động hồi miễn phí sau thời gian chờ 15 phút.</p>
        </div>
        <div class="hs-derby-card-actions is-single">
          <button type="button" class="hs-derby-btn hs-derby-btn-gold" data-derby-restore="${me(e.id)}">
            ⏳ Gọi việc mới (${Na} Cát)
          </button>
        </div>
      </article>
    `}const a=i||s,p=i?"Hãy hoàn thành hoặc hủy nhiệm vụ đang làm trước":s?"Bạn đã hoàn thành hết định mức nhiệm vụ tuần này":`Nhận nhiệm vụ ${e.titleVi}`,o=e.objectives.map(l=>`
        <li class="hs-derby-card-obj">
          <span class="hs-derby-card-obj-name">${Ns(l.eventKind)} ${me(l.labelVi)}</span>
          <strong class="hs-derby-card-obj-qty">×${l.target}</strong>
        </li>
      `).join("");return`
    <article class="hs-derby-task-card${e.isHybridCombo?" is-hybrid":""}" data-derby-slot="${e.slotIndex}">
      <div class="hs-derby-card-top">
        <div class="hs-derby-card-badges">
          ${e.isHybridCombo?'<span class="hs-derby-hybrid-pill">🔥 Liên Môn · Điểm cao</span>':`<span class="hs-derby-slot-tag">Ô #${e.slotIndex+1}</span>`}
        </div>
        <div class="hs-derby-card-metrics">
          <span class="hs-derby-pts-pill">🏆 +${e.points} đ</span>
          <span class="hs-derby-dur-pill">⏳ ${ge(e.durationSec)}</span>
        </div>
      </div>
      <div class="hs-derby-card-title">${me(e.emoji)} ${me(e.titleVi)}</div>
      <ul class="hs-derby-card-objs">${o}</ul>
      <div class="hs-derby-card-actions">
        <button
          type="button"
          class="hs-derby-btn ${a?"hs-derby-btn-muted":"hs-derby-btn-gold"}"
          data-derby-accept="${me(e.id)}"
          ${a?"disabled":""}
          title="${me(p)}"
        >
          ✓ Nhận việc
        </button>
        <button
          type="button"
          class="hs-derby-btn hs-derby-btn-trash"
          data-derby-trash="${me(e.id)}"
          title="Xé nhiệm vụ miễn phí — việc mới hồi sau 15 phút"
        >
          🧹 Xé (15p)
        </button>
      </div>
    </article>
  `}function _n(e,t=Date.now()){const i=La(e.sim,t),s=Aa(e.sim,t),n=e.sim.getPlayerHouse(),p=ct()?.house===null,o=p?`${ws}ui_trophy_cup.webp`:`${ws}crest-${n.toLowerCase()}.webp`,l=Math.min(100,Math.round(s.points/Math.max(1,Pa)*100)),d=s.tasksCompleted>=Vt&&!s.bonusSlotUnlocked,v=!!i.activeTask,h=s.tasksCompleted>=s.maxTasks,k=!!e.sim.state.sandboxMode,r=i.boardTasks.map(y=>Vn(y,t,v,h)).join("");return`
    <div class="hs-derby-panel" data-derby-week="${me(s.weekKey)}">
      <header class="hs-derby-hero" data-house="${p?"":me(n)}">
        <div class="hs-derby-hero-top">
          <img
            class="hs-derby-crest"
            src="${o}"
            alt="${p?"Cúp Derby":`Huy hiệu Nhà ${me(n)}`}"
            width="44"
            height="44"
          />
          <div class="hs-derby-hero-copy">
            <h2 class="hs-derby-hero-title">🏆 Derby Nông Trại 4 Nhà · Tuần ${me(s.weekKey)}</h2>
            <div class="hs-derby-hero-note">
              Môn #7 đồng hành Cúp 4 Nhà (Thứ Sáu 17:00 → 16:00)
            </div>
          </div>
        </div>

        <div class="hs-derby-hero-stats">
          <div class="hs-derby-stat-box">
            <div class="hs-derby-stat-row">
              <span class="hs-derby-stat-label">Điểm Derby tuần${p?"":` · Nhà ${me(n)}`}</span>
              <strong class="hs-derby-stat-val">${s.points.toLocaleString("vi-VN")} / ${s.maxPoints.toLocaleString("vi-VN")} đ</strong>
            </div>
            <div class="hs-derby-score-bar" role="progressbar" aria-label="Điểm Derby tuần" aria-valuemin="0" aria-valuemax="${s.maxPoints}" aria-valuenow="${s.points}">
              <div class="hs-derby-score-fill" style="width:${l}%"></div>
            </div>
          </div>
          <div class="hs-derby-quota-pill">
            <span class="hs-derby-quota-k">Nhiệm vụ</span>
            <strong class="hs-derby-quota-v">${s.tasksCompleted}/${s.maxTasks}</strong>
          </div>
        </div>

        ${s.tasksCompleted<2?'<div class="hs-derby-qualify-note">Hoàn thành tối thiểu 2 nhiệm vụ trong tuần để ghi điểm Nhà cho Môn #7.</div>':'<div class="hs-derby-qualify-note is-ok">✓ Đã đạt điều kiện ghi điểm Nhà cho Môn #7 tuần này!</div>'}

        <div class="hs-derby-hero-actions">
          <button type="button" id="btnDerbyOpenHouseCup" class="hs-derby-btn hs-derby-btn-paper">
            🏆 Bảng Cúp 4 Nhà
          </button>
          ${d?`<button type="button" id="btnDerbyUnlockBonus" class="hs-derby-btn hs-derby-btn-gold">⏳ Mở thêm nhiệm vụ #8 (${Ps} Cát)</button>`:""}
        </div>
      </header>

      ${On(s.points,i.claimedMilestones,k)}

      ${Fn(i.activeTask,t,s.tasksCompleted,s.maxTasks,s.bonusSlotUnlocked)}

      <section class="hs-derby-section hs-derby-board-sec" aria-label="Bảng 8 Nhiệm Vụ Tuần">
        <div class="hs-derby-sec-head">
          <h3 class="hs-derby-sec-title">📰 Bảng 8 Nhiệm Vụ Tuần</h3>
          <span class="hs-derby-sec-pill">🔥 2 việc Liên Môn</span>
        </div>
        <div class="hs-derby-board-grid">
          ${r}
        </div>
      </section>
    </div>
  `}function Gn(e,t,i){const s=e.root.querySelector("#questDialog");switch(t){case"owl_order":e.activeQuestTab="orders",i();return;case"cargo_crate":s?.close(),e.openWorkshopDialog("cargo");return;case"minigame_win":case"molly_supply":s?.close(),e.openLastPlayedMinigame();return;case"harvest_crop":s?.close(),e.showToast("🌾 Chạm các thửa ruộng chín ngoài thung lũng để thu hoạch!","🌾");return;case"pasture_harvest":s?.close(),e.showToast("🐾 Chạm Đồng Cỏ Thú đã sẵn sàng trên bản đồ để thu hoạch!","🐾");return;case"workshop_batch":s?.close(),e.showToast("🥧 Chạm các Xưởng Chế Biến trên bản đồ để thu hoạch mẻ bánh!","🥧");return;case"visitor_sale":s?.close(),e.showToast("🪙 Chạm Khách Ghé Cổng gần Quầy Ven Đường để bán hàng!","🪙");return}}function zn(e,t){if(typeof window>"u"||typeof window.setInterval!="function")return;const i=at.get(e);if(i&&(window.clearInterval(i),at.delete(e)),!(e.querySelector("[data-derby-countdown-end]")!==null))return;const n=window.setInterval(()=>{const a=e.closest("dialog");if(!e.isConnected||!e.querySelector(".hs-derby-panel")||a&&!a.open){window.clearInterval(n),at.delete(e);return}const p=Date.now();let o=!1;e.querySelectorAll("[data-derby-countdown-end]").forEach(l=>{const d=Number(l.dataset.derbyCountdownEnd);if(!Number.isFinite(d))return;const v=Math.max(0,Math.ceil((d-p)/1e3));l.textContent=le(v),v<=0&&(o=!0)}),o&&(window.clearInterval(n),at.delete(e),t())},1e3);at.set(e,n)}function Un(e,t,i){e.querySelector("#btnDerbyOpenHouseCup")?.addEventListener("click",()=>{t.root.querySelector("#questDialog")?.close(),t.openHouseCupIntroDialog()}),e.querySelector("#btnDerbyUnlockBonus")?.addEventListener("click",()=>{const s=qa(t.sim);s.ok||t.showToast(s.msg,"⏳"),t.refreshHeader(),i()}),e.querySelectorAll("[data-derby-claim-milestone]").forEach(s=>{s.addEventListener("click",()=>{const n=Number(s.dataset.derbyClaimMilestone);if(n!==1&&n!==2&&n!==3&&n!==4&&n!==5)return;const a=Ea(t.sim,n);a.ok||t.showToast(a.msg,"🎁"),t.refreshHeader(),i()})}),e.querySelector("#btnDerbyCompleteActive")?.addEventListener("click",()=>{const s=Ha(t.sim);s.ok||t.showToast(s.msg,"🏆"),t.refreshHeader(),i()}),e.querySelector("#btnDerbyAbandonActive")?.addEventListener("click",()=>{const s=Ba(t.sim);s.ok||t.showToast(s.msg,"✕"),i()}),e.querySelectorAll("[data-derby-jump]").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.derbyJump;n&&Gn(t,n,i)})}),e.querySelectorAll("[data-derby-accept]").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.derbyAccept??"";if(!n)return;const a=Ia(t.sim,n);a.ok||t.showToast(a.msg,"🏆"),i()})}),e.querySelectorAll("[data-derby-trash]").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.derbyTrash??"";if(!n)return;const a=Da(t.sim,n);a.ok||t.showToast(a.msg,"🧹"),i()})}),e.querySelectorAll("[data-derby-restore]").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.derbyRestore??"";if(!n)return;const a=Ra(t.sim,n);a.ok||t.showToast(a.msg,"⏳"),t.refreshHeader(),i()})}),zn(e,i)}function Pi(e){e.closeHudPopovers(),jn(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function qi(e){const t=e.sim.getClaimableHarvestFeastCount(),i=e.root.querySelector("#badgeFeastCount");i&&(t>0?(i.textContent=String(t),i.classList.remove("hidden")):i.classList.add("hidden"));const s=e.root.querySelector("#badgeManageFeastCount");s&&(t>0?(s.textContent=String(t),s.classList.remove("hidden")):s.classList.add("hidden"))}function Ei(e,t){const i=e.root.querySelector("#ribbonUnveilToastCard");i&&(i.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${b(t.speakerEmoji)} ${b(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${b(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">${t.bonusSickle>0?`+${t.bonusSickle.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁`:"Thưởng khánh thành chỉ nhận một lần cho mỗi loại công trình"}</div>
        </div>
      </div>
    `,i.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{i.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function jn(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const i=Je(t),s=e.sim.ensureHarvestFeast(),n=new Set(s.claimedTiers),a=_e[_e.length-1]?.pointsRequired??3e3,p=Math.min(100,Math.round(s.points/Math.max(1,a)*100)),o=e.sim.getClaimableHarvestFeastCount(),l=_e.every(k=>n.has(k.tier)),d=_e.find(k=>s.points<k.pointsRequired),v=d??_e.find(k=>!n.has(k.tier)),h=_e.map(k=>{const r=n.has(k.tier),f=s.points>=k.pointsRequired&&!r,$=tn(k),M=k.tier%5===0;return`
        <article class="feast-tier-card ${r?"is-claimed":f?"is-claimable":"is-locked"} ${M?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${k.tier}</span>
            <span class="feast-tier-pts">🍁 ${k.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${b(k.icon)} ${b(k.titleVi)}</span>
              ${M?'<span class="feast-grand-pill">Mốc lớn</span>':""}
            </div>
            <div class="feast-tier-reward">${b($)}</div>
          </div>
          <div class="feast-tier-cta">
            ${r?'<span class="feast-claimed-pill">✓</span>':f?`<button type="button" data-claim-feast-tier="${k.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">Còn ${(k.pointsRequired-s.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${s.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${s.points.toLocaleString("vi-VN")} / ${a.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${l?"🎉 30/30!":d?`Kế tiếp: #${d.tier} (🍁 ${d.pointsRequired.toLocaleString("vi-VN")})`:v?`Sẵn sàng nhận thưởng #${v.tier}!`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${o>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${o})</button>`:""}
            ${l?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${s.seasonCycle+1}</button>`:""}
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${p}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      ${(()=>{const k=e.sim.getActiveSeasonalFestivalDef()??cn.lunar_tet,r=dn(e.sim.state),y=sn(),f=r.lastLiXiClaimDayKey===y,$=e.sim.getActiveFestival()===k.festival,M=[["lunar_tet","🏮 Tết Việt"],["mid_autumn","🥮 Trung Thu"],["halloween","🎃 Halloween"],["christmas","🎄 Giáng Sinh"]].map(([N,D])=>{const g=k.festival===N;return`<button type="button" data-feast-switch-fest="${N}" class="brass-btn ${g?"gold-cta":""}" style="font-size:12px;padding:3px 8px;">${D}</button>`}).join(""),I=k.tasks.map(N=>{const D=r.claimedTaskIds.includes(N.id),g=e.sim.getSeasonalFestivalTaskProgress(N.id),T=!D&&(e.sim.state.sandboxMode||g>=N.target);return`
              <div class="quest-card-mini" style="margin-top:6px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${k.icon} ${b(N.titleVi)} (${Math.min(g,N.target)}/${N.target})</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${b(N.descVi)} · +${N.rewardSickle} Sickle${N.rewardStars?` · +${N.rewardStars} 🌟`:""}</div>
                  </div>
                  ${D?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-seasonal-task="${N.id}" ${T?"":"disabled"} class="brass-btn ${T?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận</button>`}
                </div>
              </div>
            `}).join("");return`
          <section class="quest-card-mini" style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div>
                <div style="font-size:13px;font-weight:700;">${b(k.kickerVi)}</div>
                <div style="font-size:12px;color:var(--ink-soft);">${b(k.buffSummaryVi)}</div>
              </div>
              ${k.hasDailyLiXi&&$?`<button id="btnClaimTetLiXi" type="button" ${f?"disabled":""} class="brass-btn ${f?"":"gold-cta"}" style="font-size:12px;padding:4px 10px;">${f?"✓ Đã nhận Lộc Xuân":"🏮 Nhận Lộc Xuân (+68 Sickle)"}</button>`:""}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px;">${M}</div>
            ${I}
          </section>
        `})()}

      <div class="feast-tier-list" role="list">
        ${h}
      </div>
    `,et(t,i),t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const k=e.sim.claimAllHarvestFeastTiers();e.showToast(k.msg,k.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const k=e.sim.startNextHarvestFeastCycle();e.showToast(k.msg,k.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(k=>{k.addEventListener("click",()=>{const r=Number(k.dataset.claimFeastTier);if(!Number.isFinite(r))return;const y=e.sim.claimHarvestFeastTier(r);e.showToast(y.msg,y.ok?"🎁":"🍁"),e.refreshAll()})}),t.querySelectorAll("[data-feast-switch-fest]").forEach(k=>{k.addEventListener("click",()=>{const r=k.dataset.feastSwitchFest;e.sim.state.settings.activeFestival=r,e.sim.saveToStorage(),e.refreshAll()})}),t.querySelectorAll("[data-claim-seasonal-task]").forEach(k=>{k.addEventListener("click",()=>{const r=k.dataset.claimSeasonalTask??"";if(!r)return;const y=e.sim.claimSeasonalFestivalTask(r);e.showToast(y.msg,y.ok?"🏮":"⏳"),e.refreshAll()})}),t.querySelector("#btnClaimTetLiXi")?.addEventListener("click",()=>{const k=e.sim.claimDailyTetLiXi();e.showToast(k.msg,k.ok?"🏮":"⏳"),e.refreshAll()})}function Hi(e){const t=e.root.querySelector("#financeDialogContent"),i=e.sim.state.finance,s=i.gateRevenue+i.ticketRevenue+i.shopRevenue+i.harvestRevenue,n=i.staffWagesPaid+i.constructionSpent,a=s-n,p=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:16px;">
        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#15803d;">📈 Thu</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú</span><strong>+${i.harvestRevenue.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm</span><strong>+${(i.shopRevenue+i.ticketRevenue+i.gateRevenue).toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#15803d;"><span>Tổng thu</span><strong>+${s.toLocaleString("vi-VN")} Sickle</strong></div>
          </div>
        </div>

        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#9a3412;">📉 Chi</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây &amp; Nâng sao</span><strong>-${i.constructionSpent.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${p}/ca)</span><strong>-${i.staffWagesPaid.toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${a>=0?"#15803d":"#b45309"};">
              <span>Ròng</span><strong>${a>=0?"+":""}${a.toLocaleString("vi-VN")} Sickle</strong>
            </div>
          </div>
        </div>
      </div>
      <div id="hpvnExchange"></div>
    `,Js(t.querySelector("#hpvnExchange"),e)}function Os(e){const t=ct();return ea().then(i=>{const s=e.root.querySelector("#albumDialog");i!==t&&s?.open&&e.activeAlbumTab==="cup"&&ke(e);const n=e.root.querySelector("#houseCupIntroDialog");return i!==t&&n?.open&&zs(e),i})}const Fs={match3:{nameVi:"Bùa Gặt",spriteIcon:"/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp"},caro:{nameVi:"Dò Mìn",spriteIcon:"/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1"},sudoku:{nameVi:"Số Học",spriteIcon:"/trang-trai-hang-soc/sprites/m3_piece_scroll.webp"},chess:{nameVi:"Bắn Cá",spriteIcon:"/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2"},blocks:{nameVi:"Sinh Vật",spriteIcon:"/trang-trai-hang-soc/sprites/beast_niffler.webp"},jigsaw:{nameVi:"Tranh Ghép",spriteIcon:"/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp"},derby:{nameVi:"Derby Nông Trại",spriteIcon:"/trang-trai-hang-soc/sprites/ui_icon_crop_ottery_wheat.webp"}};function jt(e,t){if(t==="match3")e.openMatch3Dialog();else if(t==="derby"){e.activeQuestTab="derby",fe(e);const i=e.root.querySelector("#questDialog");i&&!i.open&&i.showModal()}else e.openPuzzleArcadeDialog(t)}function Wn(e,t,i,s=!1){const n=Yt();if(n.length===0)return"";const a=oa();return`
    <div class="hs-cup-disciplines">
      <div class="hs-cup-disc-title-row">
        <span class="hs-cup-kicker">Đấu trường từng môn (chạm để đua ngay)</span>
      </div>
      <div class="hs-cup-disc-grid">${n.map(o=>{const l=Fs[o.id],d=o.id==="derby",v=d?ra:a,h=d?"việc tuần":"màn tuần",k=d?"việc":"màn",r=o.byHouse[e],y=Math.max(0,Math.floor(i?.[o.id]??0)),f=!t&&o.leaderHouse!==null&&r?.rank===1&&r.rawPoints>0,$=o.leaderHouse?`<span class="hs-cup-disc-lead" data-house="${o.leaderHouse}">
            <img class="hs-cup-disc-crest" src="/trang-trai-hang-soc/sprites/crest-${o.leaderHouse.toLowerCase()}.webp" alt="" width="16" height="16">
            <span>${o.leaderHouse}</span>
            <strong>${o.leaderRawPoints.toLocaleString("vi-VN")}</strong>
          </span>`:'<span class="hs-cup-disc-lead is-empty">Chưa có đội dẫn đầu</span>';let M="Chưa phân Nhà";return!t&&r&&(r.rawPoints<=0?y>0&&y<v?M=s?`Bạn: ${y}/${v} ${h} · +0 đ`:`Bạn: ${y}/${v} ${h} · +0 Cúp`:y>=v?M=`Nhà bạn: 0 đ · Bạn ${y} ${h}`:M=s?"Nhà bạn: 0 đ":"Nhà bạn: 0 đ (+0 Cúp)":r.rank===1?s?M=y>0&&y<v?`Hạng 1 · ${r.rawPoints.toLocaleString("vi-VN")} đ · Bạn ${y}/${v} ${k}`:`Hạng 1 · ${r.rawPoints.toLocaleString("vi-VN")} đ`:M=y>0&&y<v?`Hạng 1 · +${r.cupPoints} đ · Bạn ${y}/${v} ${k}`:`Hạng 1 · +${r.cupPoints} đ Cúp`:M=s?`Hạng ${r.rank} (${r.rawPoints.toLocaleString("vi-VN")} đ) · Kém ${r.gapToFirst.toLocaleString("vi-VN")}`:`Hạng ${r.rank} (+${r.cupPoints} đ) · Kém ${r.gapToFirst.toLocaleString("vi-VN")}`),`
        <button type="button" class="hs-cup-disc-card${f?" is-leading":""}" data-cup-play="${o.id}">
          <span class="hs-cup-disc-head">
            <img class="hs-cup-disc-ico" src="${l.spriteIcon}" alt="" width="22" height="22">
            <strong class="hs-cup-disc-name">${l.nameVi}</strong>
            <span class="hs-cup-disc-cta">Đua</span>
          </span>
          ${$}
          <span class="hs-cup-disc-me">${M}</span>
        </button>`}).join("")}</div>
    </div>`}function Vs(e,t,i){typeof e.querySelectorAll=="function"&&e.querySelectorAll("[data-cup-play]").forEach(s=>{s.addEventListener("click",()=>{const n=s.dataset.cupPlay;!n||!(n in Fs)||(i.root.querySelector(t)?.close(),jt(i,n))})})}function Kn(e,t,i){const[s,n]=ks(t?null:e),a=s.isPlayerAlliance?s:n.isPlayerAlliance?n:null,p=ia(),o=p?.windowWeeks??3,l=os(p?.multiplierCap??2.5),d=(k,r)=>{const[y,f]=k.houses,$=k.balanceMultiplier>1.005,M=$?os(k.balanceMultiplier):"",I=$?`<span class="hs-cup-ally-mult" title="Hệ số cân bằng quân số khóa đầu tuần (TB ${o} tuần, tối đa ${l}×)">×${M} cân quân số</span>`:"",N=i&&$&&k.rawPoints>0?` · Gốc ${k.rawPoints.toLocaleString("vi-VN")} đ`:"";return`
      <div class="hs-cup-ally-side${k.isPlayerAlliance?" is-mine":""}" data-slot="${r}">
        <div class="hs-cup-ally-head">
          <span class="hs-cup-ally-crests">
            <img src="/trang-trai-hang-soc/sprites/crest-${y.toLowerCase()}.webp" alt="${y}" width="22" height="22">
            <img src="/trang-trai-hang-soc/sprites/crest-${f.toLowerCase()}.webp" alt="${f}" width="22" height="22">
          </span>
          <strong class="hs-cup-ally-pts">${i?`${k.points.toLocaleString("vi-VN")} đ`:"…"}</strong>
        </div>
        <div class="hs-cup-ally-name">${b(k.nameVi)}${k.isPlayerAlliance?'<span class="hs-cup-ally-badge">Liên minh bạn</span>':""}${I}</div>
        <div class="hs-cup-ally-houses">${y} + ${f}${N}</div>
      </div>`},v=Math.max(12,Math.min(88,s.sharePercent)),h=a?.allyHouse?`<div class="hs-cup-ally-foot">Đồng minh tuần này: Nhà ${a.allyHouse}</div>`:"";return`
    <div class="hs-cup-alliances">
      <div class="hs-cup-ally-title-row">
        <span class="hs-cup-kicker">Liên Minh Tuần Này (2 vs 2)</span>
      </div>
      <div class="hs-cup-ally-vs">
        ${d(s,"a")}
        <span class="hs-cup-ally-divider" aria-hidden="true">VS</span>
        ${d(n,"b")}
      </div>
      <div class="hs-cup-tugbar" aria-hidden="true">
        <i class="is-a" style="width:${v}%"></i>
        <i class="is-b" style="width:${100-v}%"></i>
      </div>
      ${h}
    </div>`}function _s(e,t){const i={},s=na();if(e){const n=["match3","caro","sudoku","chess","blocks","jigsaw"];for(const a of n){const p=e[a]?.weekly;p&&p.weekKey===s&&p.stagesCleared>0&&(i[a]=Math.floor(p.stagesCleared))}}return t&&t.weekKey===s&&t.tasksCompleted>0&&(i.derby=Math.floor(t.tasksCompleted)),i}function Gs(e,t,i,s){const n=Yt(),a=t?.mode==="f2",p=a||t?.mode==="medals"||n.length>0,o=p?ta():null,l=["Gryffindor","Slytherin","Ravenclaw","Hufflepuff"].map(g=>({house:g,pts:sa(g),firsts:o?.[g]??0})).sort((g,T)=>T.pts-g.pts||T.firsts-g.firsts),d=Math.max(1,l[0].pts),v=t?.house===null,h=g=>`${g.toLocaleString("vi-VN")} đ`,k=l.map(g=>{const T=!v&&g.house===e,E=p&&g.firsts>0?`<span class="hs-cup-medals">${g.firsts} nhất môn</span>`:"",c=`${g.house}${T?'<span class="hs-cup-you">Nhà bạn</span>':""}${E}`,u=`<img class="hs-cup-crest" src="/trang-trai-hang-soc/sprites/crest-${g.house.toLowerCase()}.webp" alt="" width="32" height="32">`,S=Math.round(g.pts/d*100);return`
        <li class="hs-cup-row" data-house="${g.house}" data-mine="${T}">
          ${u}
          <span class="hs-cup-name">${c}</span>
          <span class="hs-cup-pts">${t?h(g.pts):"…"}</span>
          <span class="hs-cup-bar"><i style="width:${S}%"></i></span>
        </li>`}).join(""),r=t?.perTier??300,y=Math.min(r,t?.memberBank??0),f=Kn(e,v,t),[$,M]=ks(v?null:e),I=$.isPlayerAlliance?$:M.isPlayerAlliance?M:null,N=aa({cup:t,leadingAlliance:$,playerAlliance:I,noHouse:v,localPlays:i}),D=p?Wn(e,v,s,a):"";return{alliancesHtml:f,prizeBannerHtml:N,listHtml:k,disciplinesHtml:D,isMedalMode:p,noHouse:v,perTier:r,bank:y}}function Qn(e){e.hasShownHouseCupIntro=!0,e.closeHudPopovers(),zs(e);const t=e.root.querySelector("#houseCupIntroDialog");t&&!t.open&&t.showModal()}function zs(e){const t=e.root.querySelector("#houseCupIntroDialogContent");if(!t)return;const i=e.sim.getPlayerHouse(),s=ct();Os(e).catch(()=>{});const{alliancesHtml:n,prizeBannerHtml:a,listHtml:p,disciplinesHtml:o,isMedalMode:l,noHouse:d,perTier:v,bank:h}=Gs(i,s,e.sim.state.minigamePlays,_s(e.sim.state.minigameLeaderboard?.records,e.sim.state.weeklyDerby)),k=s?.memberTier??1,r=s?.memberDailyCap??0,y=s?.memberTodayPoints??0,f=Yt(),$=f.some(D=>D.id==="derby"),M=d?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${i.toLowerCase()}.webp`,I=l&&(s?.unlimited||r===0)?`Hôm nay: ${y.toLocaleString("vi-VN")} đ`:`Hôm nay: ${y.toLocaleString("vi-VN")}${r>0?`/${r.toLocaleString("vi-VN")}`:""} đ`,N=d?"Chưa phân Nhà":s?`${I} · Cúp Đợt ${k}: ${h.toLocaleString("vi-VN")}/${v.toLocaleString("vi-VN")} đ`:"Đang tải…";t.innerHTML=`
    <div class="hs-cup hs-cup-intro">
      <div class="hs-cup-intro-hero" data-house="${d?"":b(i)}">
        <img class="hs-cup-intro-crest" src="${M}" alt="" width="40" height="40" />
        <div class="hs-cup-intro-copy">
          <span class="hs-cup-kicker">${s?.weekKey?`Mùa giải Tuần ${b(s.weekKey)}`:"Cúp 4 Nhà"}</span>
          <strong class="hs-cup-intro-title">${d?"Chưa phân Nhà trên HPVN":`Nhà ${b(i)}`}</strong>
          <span class="hs-cup-intro-sub">${N}</span>
        </div>
      </div>

      ${n}
      ${a}
      <ol class="hs-cup-list hs-cup-intro-standings">${p}</ol>
      ${o}

      <div class="hs-dlg-actions">
        <button id="btnCupIntroPlay" type="button" class="brass-btn">Thi đấu ngay</button>
        ${$?"":'<button type="button" data-cup-play="derby" class="brass-btn">🏆 Derby</button>'}
        <button id="btnCupIntroClose" type="button" class="brass-btn gold-cta">Vào trang trại</button>
      </div>
    </div>
  `,t.querySelector("#btnCupIntroClose")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close()}),t.querySelector("#btnCupIntroPlay")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close();const D=e.sim.getLastPlayedMinigame();if(l){const g=new Set(f.map(T=>T.id));if(D!=="seedquiz"&&g.has(D)){jt(e,D);return}if(!d&&f.length>0){const T=f.filter(E=>(E.byHouse[i]?.rank??4)>1).sort((E,c)=>(E.byHouse[i]?.gapToFirst??0)-(c.byHouse[i]?.gapToFirst??0));if(T.length>0){jt(e,T[0].id);return}}}D==="caro"||D==="sudoku"||D==="chess"||D==="blocks"||D==="jigsaw"?e.openPuzzleArcadeDialog(D):e.openMatch3Dialog()}),Vs(t,"#houseCupIntroDialog",e)}function ke(e){const t=e.root.querySelector("#albumDialogContent"),i=t.dataset.activeAlbumTabSig??"",s=`${e.activeAlbumTab}:${e.activeProfileSubTab}`,n=Je(t),a=e.sim.homeStateWhileVisiting??e.sim.state;e.sim.checkAndToastAchievements();const p=gs(a),o=Oa(a),l=Et.filter(f=>{const $=p.achievements[f.id];return!!($?.unlockedAt&&!$?.claimedAt)}).length,d=e.sim.getUnlockedLoginDayMax(a),v=Ht.filter(f=>f.day<=d&&!p.claimedLoginDays.includes(f.day)).length,h=l+v,k=(f,$,M=0)=>`<button type="button" role="tab" data-atab="${f}" aria-selected="${e.activeAlbumTab===f}" class="hs-tab">${$}${M>0?`<span class="hs-tab-badge">${M}</span>`:""}</button>`,r=`
      <div class="hs-tabs" role="tablist" aria-label="Hồ Sơ, Cúp &amp; Xếp Hạng">
        ${k("profile","Hồ sơ",h)}${k("cup","Cúp Nhà")}${k("leaderboard","Xếp hạng")}
      </div>
    `;let y="";if(e.activeAlbumTab==="cup"){const f=e.sim.getPlayerHouse(),$=ct();Os(e).catch(()=>{});const{alliancesHtml:M,prizeBannerHtml:I,listHtml:N,disciplinesHtml:D,noHouse:g,perTier:T,bank:E}=Gs(f,$,a.minigamePlays,_s(a.minigameLeaderboard?.records,a.weeklyDerby)),c=w=>`${w.toLocaleString("vi-VN")} đ`,u=(w,R,P,B,L="",V=!1)=>`
        <li class="hs-cup-row"${L?` data-house="${L}" data-mine="${V}"`:""}>
          <span></span>
          <span class="hs-cup-name">${R}</span>
          <span class="hs-cup-pts">${P}</span>
          ${B===null?"":`<span class="hs-cup-bar"><i style="width:${B}%"></i></span>`}
        </li>`,S=$?g?u("","Chưa phân Nhà trên HPVN","0 đ",null):u("","Hôm nay",c($.memberTodayPoints),null)+u("",`Đợt ${$.memberTier}`,`${E} / ${c(T)}`,Math.round(E/T*100)):"";y=`
        <div class="hs-cup">
          <div class="hs-cup-kicker hs-cup-kicker-row">
            <span>${$?.weekKey?`Tuần ${$.weekKey}`:"Đang tải…"}</span>
          </div>
          ${M}
          ${I}
          <ol class="hs-cup-list">${N}</ol>
          ${D}
          ${S?`<ul class="hs-cup-me">${S}</ul>`:""}
        </div>
      `}else if(e.activeAlbumTab==="leaderboard")y='<div id="leaderboardTabMount"></div>';else{const f=e.sim.getPlayerHouse(),M=ct()?.house===null,I=M?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${f.toLowerCase()}.webp`,N=M?"Chưa phân Nhà":f,D=(c,u,S=0)=>`<button type="button" role="tab" data-psub="${c}" aria-selected="${e.activeProfileSubTab===c}" class="lb-scope-pill ${e.activeProfileSubTab===c?"active":""}">${u}${S>0?`<span class="hs-tab-badge">${S}</span>`:""}</button>`;let g="";if(e.activeProfileSubTab==="achievements"){const c=Date.now(),u={farm:Ge(a,"farm",c),building:Ge(a,"building",c),puzzle:Ge(a,"puzzle",c),language:Ge(a,"language",c),social:Ge(a,"social",c),collection:Ge(a,"collection",c)},S=[["all","Tất cả"],["farm","Mùa vụ"],["building","Kiến trúc"],["puzzle","Khảo thí"],["language","Đa ngữ"],["social","Xã hội"],["collection","Sưu tầm"]],w=e.activeAchievementFilterCat??"all",R=Et.filter(P=>w==="all"||P.category===w).slice().sort((P,B)=>{const L=V=>p.achievements[V]?.unlockedAt&&!p.achievements[V]?.claimedAt?1:0;return L(B.id)-L(P.id)});g=`
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
              <h3 class="hs-section-title" style="margin:0;">52 Thành tựu</h3>
              <span style="font-size:12px;font-weight:700;color:var(--ink-gold);">${o.unlocked}/${o.total} (${o.completionPct}%)</span>
              ${l>0?`<button id="btnClaimAllAchievements" type="button" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận tất cả (${l})</button>`:""}
            </div>
            <progress max="${o.total}" value="${o.unlocked}" style="width:100%;margin-bottom:8px;"></progress>
            <div class="lb-scope-pills" role="group" aria-label="Lọc thành tựu theo nhóm">
              ${S.map(([P,B])=>`<button type="button" data-ach-cat="${P}" aria-pressed="${w===P}" class="lb-scope-pill ${w===P?"active":""}">${B}</button>`).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${R.map(P=>{const B=p.achievements[P.id],L=!!B?.unlockedAt,V=!!B?.claimedAt,m=Math.min(P.target,Math.max(0,u[P.category]??0)),C=m.toLocaleString("vi-VN"),q=P.target.toLocaleString("vi-VN");return`
                <div class="aaa-ach-card" data-ach-card="${P.id}" data-unlocked="${L}">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                    <div style="min-width:0;flex:1;">
                      <div class="hs-card-title">${P.titleVi}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">${P.descVi} · <strong>+${P.rewardSickle} Sickle, +${P.rewardStars} 🌟</strong></div>
                      ${L?"":`<progress max="${P.target}" value="${m}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                    </div>
                  </div>
                  <div data-ach-cta style="flex-shrink:0;text-align:right;">
                    ${V?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':L?`<button type="button" data-claim-ach="${P.id}" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">${C}/${q}</span>`}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="friendship"){const c=e.sim.getRealTimePeriod(),u=es();g=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Phim cốt truyện</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">
              ${Fa.map(S=>{const w=a.level>=S.unlockLevel||e.sim.isHeadmasterPreview;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${S.titleVi}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">Cấp ${S.unlockLevel}</div>
                    <button type="button" data-play-cutscene="${S.id}" ${w?"":"disabled"} class="brass-btn ${w?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${w?"Xem":`Cấp ${S.unlockLevel}`}
                    </button>
                  </div>
                `}).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${an.map(S=>{const w=Va(S.id,c),R=p.npcFriendship[S.id]??{villagerId:S.id,level:1,xp:0},P=R.level*60,B=R.lastTalkedDayKey===u,L=R.lastGiftedDayKey===u,V=on[S.id],m=!!R.claimedMilestones?.includes(5),C=!m&&(R.level>=5||a.sandboxMode);return`
                <div class="aaa-slot-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong class="hs-card-title">${S.nameVi}</strong>
                      <span style="font-size:12px;color:var(--ink-soft);"> · ${S.titleVi}</span>
                    </div>
                    <span style="font-size:12px;font-weight:700;color:var(--berry);">Cấp ${R.level}/10 (${R.xp}/${P})</span>
                  </div>
                  <div style="font-size:12px;color:var(--ink-soft);">${w.activityVi}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    <button type="button" data-npc-talk="${S.id}" data-choice="0" ${B?"disabled":""} class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${B?"✓ Đã trò chuyện":"Trò chuyện (+35 XP)"}
                    </button>
                    ${B?"":`<button type="button" data-npc-talk="${S.id}" data-choice="1" class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">Gợi chuyện (+25 XP)</button>`}
                    ${m?`<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);align-self:center;">✓ ${b(V.keepsakeNameVi)}</span>`:`<button type="button" data-npc-keepsake="${S.id}" ${C?"":"disabled"} class="brass-btn ${C?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;" title="${b(V.keepsakeBonusVi)}">🎁 Kỷ vật Lv.5</button>`}
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;">
                    ${L&&!a.sandboxMode?'<span style="font-size:11px;font-weight:700;color:var(--farm-green-text);">✓ Hôm nay đã tặng quà thân thiết</span>':V.favoriteGifts.map(q=>{const F=oe(q),A=e.sim.getFarmItemCount(q),_=a.sandboxMode||A>=1;return`<button type="button" data-npc-gift="${S.id}" data-gift-item="${q}" ${_?"":"disabled"} class="brass-btn ${_?"gold-cta":""}" style="min-height:34px;font-size:11px;padding:2px 8px;">💝 Tặng ${b(F.name)} (${a.sandboxMode?"∞":A})</button>`}).join("")}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="almanac"){const c=e.sim.evaluateCollectionAlmanac(),u=c.chapters.map(w=>{const R=Math.min(100,Math.round(w.discoveredCount/Math.max(1,w.totalCount)*100)),P=w.sampleEntries.map(B=>`<span class="owl-rew-pill ${B.unlocked?"xp":""}" style="opacity:${B.unlocked?"1":"0.45"};font-size:11px;">${B.icon} ${b(B.nameVi)}</span>`).join("");return`
              <div class="quest-card-mini" style="margin-bottom:8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${w.icon} ${b(w.titleVi)}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${b(w.subtitleVi)} · ${b(w.rewardLabelVi)}</div>
                  </div>
                  ${w.claimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-almanac="${w.id}" ${w.canClaim?"":"disabled"} class="brass-btn ${w.canClaim?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận chương</button>`}
                </div>
                <div class="quest-bar" style="margin:6px 0;"><div class="quest-bar-fill" style="width:${R}%"></div></div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">${P}</div>
              </div>
            `}).join("");g=`
          <div class="quest-card-mini" style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div>
                <div style="font-size:13px;font-weight:700;">🏆 Đại Học Giả Bách Khoa Hang Sóc</div>
                <div style="font-size:12px;color:var(--ink-soft);">Hoàn thành cả 4 Chương Bách Khoa · Thưởng +190 Sickle &amp; +2 🌟</div>
              </div>
              ${c.grandTrophyClaimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Danh hiệu vĩnh viễn</span>':`<button type="button" data-claim-almanac="grand_trophy" ${c.allChaptersClaimed||a.sandboxMode?"":"disabled"} class="brass-btn ${c.allChaptersClaimed||a.sandboxMode?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🏆 Nhận Đại Cúp</button>`}
            </div>
          </div>
        `+u}else g=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Điểm danh 7 ngày</h3>
            <div class="aaa-slot-grid">
              ${Ht.map(c=>{const u=p.claimedLoginDays.includes(c.day),S=!u&&c.day<=d;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${c.titleVi}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">
                      +${c.galleons} Sickle · +${c.magicStars} 🌟${c.phoenixTalismans>0?` · +${c.phoenixTalismans} Bùa`:""}
                    </div>
                    ${u?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-login="${c.day}" ${S?"":"disabled"} class="brass-btn ${S?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                            ${S?"Nhận":"Chờ mở"}
                          </button>`}
                  </div>
                `}).join("")}
            </div>
          </div>
        `;const T=a.settings.strollRobeId??"burrow_classic",E=rn.map(c=>{const u=ln[c],S=c===T;return`
          <button
            type="button"
            class="hs-robe-pill ${S?"is-active":""}"
            data-stroll-robe="${c}"
            aria-pressed="${S}"
          >
            <span class="hs-robe-swatch" style="background:${u.scarfPrimary};border-color:${u.scarfAccent};" aria-hidden="true"></span>
            <span>${b(u.labelVi)}</span>
          </button>
        `}).join("");y=`
        <div class="hs-profile-card" data-house="${b(f)}">
          <img class="hs-profile-crest" src="${I}" alt="" width="36" height="36" />
          <div class="hs-profile-info">
            <div class="hs-profile-head">
              <strong class="hs-profile-name">${b(a.parkName)}</strong>
              <span class="hs-profile-house">${b(N)}</span>
            </div>
            <div class="hs-profile-meta">Cấp ${a.level} · ${b(Zt(a.level))} · 🌟 ${(a.match3?.stars??0).toLocaleString("vi-VN")} · Thành tựu ${o.unlocked}/${o.total}</div>
          </div>
        </div>
        <div class="hs-robe-bar" role="group" aria-label="Trang phục đi dạo Hang Sóc">
          <span class="hs-robe-bar-label">✨ Áo đi dạo:</span>
          <div class="hs-robe-pills">${E}</div>
        </div>
        <div class="lb-scope-pills hs-profile-subtabs" role="tablist" aria-label="Chi tiết hồ sơ">
          ${D("login7","Điểm danh",v)}${D("achievements","Thành tựu",l)}${D("friendship","Dân làng")}${D("almanac","Bách khoa",e.sim.evaluateCollectionAlmanac().claimableCount)}
        </div>
        ${g}
      `}if(t.innerHTML=r+y,t.dataset.activeAlbumTabSig=s,et(t,n,!!(i&&i!==s)),e.activeAlbumTab==="leaderboard"){const f=t.querySelector("#leaderboardTabMount");e.leaderboardModal?e.leaderboardModal.render(f):(f&&(f.innerHTML='<p class="hs-lb-note">Đang tải…</p>'),e.getLeaderboardModal().then($=>{$.configure(e.sim.getLastPlayedMinigame()),e.activeAlbumTab==="leaderboard"&&($.render(),$.syncCloud())},()=>{}))}t.querySelector("#btnOpenCupIntroFromTab")?.addEventListener("click",()=>{e.root.querySelector("#albumDialog")?.close(),Qn(e)}),Vs(t,"#albumDialog",e),t.querySelectorAll("[data-atab]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.atab;e.activeAlbumTab=$,ke(e),$==="leaderboard"&&e.leaderboardModal&&e.leaderboardModal.syncCloud()})}),t.querySelectorAll("[data-psub]").forEach(f=>{f.addEventListener("click",()=>{e.activeProfileSubTab=f.dataset.psub,ke(e)})}),t.querySelectorAll("[data-stroll-robe]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.strollRobe,M=e.sim.setStrollRobe($);e.showToast(M.msg,"✨"),t.querySelectorAll("[data-stroll-robe]").forEach(I=>{const N=I.dataset.strollRobe===M.robe.id;I.classList.toggle("is-active",N),I.setAttribute("aria-pressed",String(N))})})}),t.querySelector("#btnClaimAllAchievements")?.addEventListener("click",()=>{const f=e.sim.claimAllAchievements();e.showToast(f.msg,f.ok?"🎖️":"⚠️"),ke(e)}),t.querySelectorAll("[data-ach-cat]").forEach(f=>{f.addEventListener("click",()=>{e.activeAchievementFilterCat=f.dataset.achCat||"all",ke(e)})}),t.querySelectorAll("[data-claim-ach]").forEach(f=>{f.addEventListener("click",()=>{const $=String(f.dataset.claimAch),M=e.sim.claimAchievement($);if(e.showToast(M.msg,M.ok?"🎖️":"⚠️"),!M.ok)return;const I=t.querySelector(`[data-ach-card="${$}"]`),N=I?.querySelector("[data-ach-cta]");if(I&&N){N.innerHTML='<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>',I.classList.remove("is-patched-pop"),I.offsetWidth,I.classList.add("is-patched-pop");const D=e.sim.homeStateWhileVisiting??e.sim.state,g=gs(D),T=Et.filter(R=>{const P=g.achievements[R.id];return!!(P?.unlockedAt&&!P?.claimedAt)}).length,E=t.querySelector("#btnClaimAllAchievements");E&&(T>0?E.textContent=`Nhận tất cả (${T})`:E.remove());const c=t.querySelector('[data-psub="achievements"] .hs-tab-badge');c&&(T>0?c.textContent=String(T):c.remove());const u=e.sim.getUnlockedLoginDayMax(D),S=Ht.filter(R=>R.day<=u&&!g.claimedLoginDays.includes(R.day)).length,w=t.querySelector('[data-atab="profile"] .hs-tab-badge');w&&(T+S>0?w.textContent=String(T+S):w.remove()),e.refreshHeader();return}ke(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(f=>{f.addEventListener("click",()=>{e.playStoryCutscene(String(f.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.npcTalk,M=Number(f.dataset.choice)===1?1:0,I=e.sim.talkWithVillagerChoice($,M);e.showToast(I.msg,I.ok?"💝":"☕"),ke(e)})}),t.querySelectorAll("[data-npc-gift]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.npcGift,M=f.dataset.giftItem,I=e.sim.giftItemToVillager($,M);e.showToast(I.msg,I.ok?"💝":"🧺"),ke(e),e.refreshHeader()})}),t.querySelectorAll("[data-npc-keepsake]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.npcKeepsake,M=e.sim.claimVillagerKeepsake($);e.showToast(M.msg,M.ok?"🎁":"🔒"),ke(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-almanac]").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.claimAlmanac,M=e.sim.claimAlmanacChapterReward($);e.showToast(M.msg,M.ok?"📚":"🔒"),ke(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-login]").forEach(f=>{f.addEventListener("click",()=>{const $=e.sim.claimLoginDayReward(Number(f.dataset.claimLogin));e.showToast($.msg,$.ok?"📅":"🔒"),ke(e)})})}function fe(e){const t=e.root.querySelector("#questDialogContent");if(!t)return;const i=e.sim.ensureFarmBarn(),s=e.sim.getActiveStoryQuest(),n=e.sim.getStoryAutoActionPreview(),a=e.sim.getReadyOwlOrdersCount(),p=(s?.completed?1:0)+e.sim.state.owlQuests.filter(c=>c.completed&&!c.claimed).length+e.sim.state.dailyQuests.filter(c=>c.completed&&!c.claimed).length,o=e.sim.getWeeklyDerbySummary(),l=o.claimableMilestonesCount+(o.activeTaskReady?1:0);if(!e.selectedOwlOrderId||!i.owlOrders.some(c=>c.id===e.selectedOwlOrderId)){const c=i.owlOrders.find(u=>e.sim.canFulfillFarmOwlOrder(u));e.selectedOwlOrderId=(c??i.owlOrders[0])?.id??null}const d=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú, Nhiệm Vụ &amp; Derby" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          Đơn Cú <span class="nb-tab-badge">${a}/${i.owlOrders.length}</span>
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          Nhiệm Vụ ${p>0?`<span class="nb-tab-badge">${p}</span>`:""}
        </button>
        <button type="button" data-qtab="derby" data-active="${e.activeQuestTab==="derby"}" aria-pressed="${e.activeQuestTab==="derby"}" class="brass-btn">
          🏆 Derby ${l>0?`<span class="nb-tab-badge">${l}</span>`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="derby"){const c=t.dataset?.activeQuestTab,u=typeof t.scrollTop=="number"?t.scrollTop:0;t.innerHTML=d+_n(e),t.dataset&&(t.dataset.activeQuestTab="derby"),typeof t.scrollTop=="number"&&(t.scrollTop=c==="derby"?u:0),t.querySelectorAll("[data-qtab]").forEach(S=>{S.addEventListener("click",()=>{e.activeQuestTab=S.dataset.qtab,fe(e)})}),Un(t,e,()=>fe(e));return}if(t.dataset&&(t.dataset.activeQuestTab=e.activeQuestTab),e.activeQuestTab==="orders"){const c=Date.now();e.sim.tickTrashedOwlOrders(c);const u=i.owlOrders.find(m=>m.id===e.selectedOwlOrderId)??i.owlOrders[0],S=!!(u?.trashedUntilAt&&u.trashedUntilAt>c),w=u?e.sim.canFulfillFarmOwlOrder(u):!1,R=(i.deliveryStreak??0)%3,P=i.owlOrders.map(m=>{const C=u?.id===m.id,q=!!(m.trashedUntilAt&&m.trashedUntilAt>c),F=!q&&e.sim.canFulfillFarmOwlOrder(m),A=q?Math.max(1,Math.ceil((m.trashedUntilAt-c)/1e3)):0,_=m.portraitSprite&&/^[a-z0-9_]+$/i.test(m.portraitSprite)?m.portraitSprite:null,K=_?`<img src="/trang-trai-hang-soc/sprites/${_}.webp" alt="${b(m.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${b(Pe(m.portraitEmoji,m.senderName))}</span>`,U=q?`<span style="font-size:11px;font-weight:700;opacity:0.78;">⏳ ${ge(A)}</span>`:m.requirements.slice(0,3).map(x=>{const H=oe(x.itemId);return`<img src="${H.iconSrc}" alt="${b(H.name)}" title="${x.qty} ${b(H.name)}" class="owl-note-mini-item" />`}).join(""),J=e.sim.getOwlOrderSpotlightBonus(m);return`
            <button
              type="button"
              class="owl-pin-note ${C?"selected":""} ${F?"ready":""}"
              style="${q?"opacity:0.68;":""}"
              data-select-owl="${b(m.id)}"
            >
              <div class="owl-note-avatar-box">${K}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${q?"Đang gọi đơn mới":b(m.senderName)}</div>
                <div class="owl-note-mini-row">${U}</div>
                ${!q&&m.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
                ${!q&&J.hasSpotlight?'<span class="owl-spotlight-tag">🎪 +1🌿</span>':""}
              </div>
              ${F?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),B=m=>{if(!m)return"";const C=Date.now();if(!!(m.trashedUntilAt&&m.trashedUntilAt>C)){const A=Math.max(1,Math.ceil((m.trashedUntilAt-C)/1e3));return`
            <div class="owl-detail-sheet">
              <div class="owl-detail-head">
                <div>
                  <div class="owl-detail-title">Ô Đơn Đang Làm Mới</div>
                  <div class="owl-detail-sub">🦉 Cú đưa thư đang mang đơn mới tới sau ${le(A)}</div>
                </div>
              </div>
              <div class="quest-card-mini" style="margin:12px 0;font-size:13px;line-height:1.45;">
                Đã xé đơn khó không giới hạn lượt! Chờ 5 phút để tự động nhận đơn mới miễn phí, hoặc gọi Cú bay gấp bằng 1 ⏳ Cát Thời Gian.
              </div>
              <button type="button" id="btnRestoreTrashedOwlOrder" class="brass-btn gold-cta" style="width:100%;padding:8px 12px;">
                ⏳ Gọi đơn mới ngay (1 Cát)
              </button>
            </div>
          `}const F=e.sim.getOwlOrderSpotlightBonus(m);return`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${b(m.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${b(m.owlName)} · 🔥 Chuỗi ${R}/3 (+20% 🪙 &amp; +1🌿)</div>
              </div>
              <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end;">
                <button type="button" id="btnTrashOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:12px;" title="Xé đơn miễn phí không giới hạn lượt (nhận đơn mới sau 5 phút)">
                  🧹 Xé (5p)
                </button>
                <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:12px;" ${e.sim.getOwlRerollsLeft()>0?`title="Đổi đơn tức thì (còn ${e.sim.getOwlRerollsLeft()} lượt hôm nay)"`:'disabled title="Hết lượt đổi tức thì hôm nay — vẫn có thể Xé đơn (5p) miễn phí!"'}>
                  ${e.sim.getOwlRerollsLeft()>0?`🔄 Đổi (${e.sim.getOwlRerollsLeft()})`:"Hết đổi ngay"}
                </button>
              </div>
            </div>

            <div class="owl-req-list">
              ${m.requirements.map((A,_)=>{const K=oe(A.itemId),U=e.sim.getFarmItemCount(A.itemId),J=e.sim.ensureNeighborSocial(),x=Math.max(0,_t-J.dailyOwlHelpRequestedCount),H=e.sim.getOwlRequirementHelpState(m.id,_),O=!!H?.fulfilledAt,z=e.sim.state.sandboxMode||O||U>=A.qty,j=O?`<span class="owl-help-tag done">✓ ${b(H?.helperEmoji??"🦉")}</span>`:H?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':z?'<span class="owl-req-status">✓</span>':`<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                            <button type="button" class="brass-btn owl-ask-help-btn" data-jump-owl-item="${b(A.itemId)}" title="Dẫn tới ruộng hoặc xưởng sản xuất món này">→ Tìm</button>
                            <button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${_}" ${x<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${x})</button>
                          </div>`;return`
                    <div class="owl-req-row ${z?"ok":"lack"}">
                      <img src="${K.iconSrc}" alt="${b(K.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${b(K.name)}</div>
                        <div class="owl-req-count">${O?"✓":`${e.sim.state.sandboxMode?"∞":U}/${A.qty}`}</div>
                      </div>
                      ${j}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${m.rewardSickle}</span>
                <span class="owl-rew-pill xp">⭐ +${m.rewardXp+(F?.bonusXp??0)}</span>
                ${F?.hasSpotlight?`<span class="owl-rew-pill plug">🎪 +${F.bonusCompost}🌿</span>`:""}
                ${m.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${m.rewardMugglePlug}</span>`:""}
                ${(m.isFeastMarquee||(i.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<Ne?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `},L=(m,C)=>{m.querySelector("#btnTrashOwlOrder")?.addEventListener("click",()=>{if(C){const q=e.sim.trashFarmOwlOrder(C.id);e.showToast(q.msg,q.ok?"🧹":"⚠️"),fe(e)}}),m.querySelector("#btnRestoreTrashedOwlOrder")?.addEventListener("click",()=>{if(C){const q=e.sim.instantRestoreTrashedOwlOrder(C.id);e.showToast(q.msg,q.ok?"🦉":"⏳"),fe(e),e.refreshHeader()}}),m.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{C&&(e.sim.refreshFarmOwlOrder(C.id),e.selectedOwlOrderId=null,fe(e))}),m.querySelectorAll("[data-ask-owl-help]").forEach(q=>{q.addEventListener("click",()=>{if(!C)return;const F=Number(q.dataset.askOwlHelp);if(!Number.isFinite(F))return;const A=e.sim.requestPlayerOwlCrateHelp(C.id,F);A.ok||e.showToast(A.msg,"⚠️"),fe(e)})}),m.querySelectorAll("[data-jump-owl-item]").forEach(q=>{q.addEventListener("click",()=>{const F=q.dataset.jumpOwlItem;e.root.querySelector("#questDialog")?.close(),e.jumpToMissingFarmItem(F)})})},V=B(u);t.innerHTML=`
        ${d}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${P}</div>
            ${V}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${w?"ready":"not-ready"}"
            >
              ${S?"⏳ Gọi đơn (1 Cát)":w?"Giao hàng":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(m=>{m.addEventListener("click",()=>{e.activeQuestTab=m.dataset.qtab,fe(e)})}),t.querySelectorAll("[data-select-owl]").forEach(m=>{m.addEventListener("click",()=>{const C=m.dataset.selectOwl??null;if(!C||C===e.selectedOwlOrderId)return;e.selectedOwlOrderId=C;const F=e.sim.ensureFarmBarn().owlOrders.find(K=>K.id===C),A=t.querySelector(".owl-detail-sheet"),_=t.querySelector("#btnSendOwlOrder");if(F&&A&&_){t.querySelectorAll("[data-select-owl]").forEach(x=>{x.classList.toggle("selected",x.dataset.selectOwl===C)}),A.outerHTML=B(F);const K=t.querySelector(".owl-detail-sheet");K&&L(K,F);const U=!!(F.trashedUntilAt&&F.trashedUntilAt>Date.now()),J=!U&&e.sim.canFulfillFarmOwlOrder(F);_.classList.toggle("ready",J),_.classList.toggle("not-ready",!J),_.textContent=U?"⏳ Gọi đơn (1 Cát)":J?"Giao hàng":"Mở Kho";return}fe(e)})}),L(t,u),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{const m=e.sim.ensureFarmBarn(),C=m.owlOrders.find(F=>F.id===e.selectedOwlOrderId)??m.owlOrders[0];if(!C)return;if(C.trashedUntilAt&&C.trashedUntilAt>Date.now()){const F=e.sim.instantRestoreTrashedOwlOrder(C.id);e.showToast(F.msg,F.ok?"🦉":"⏳"),fe(e),e.refreshHeader();return}if(!e.sim.canFulfillFarmOwlOrder(C)){const F=e.sim.fulfillFarmOwlOrder(C.id);e.showToast(F.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const q=e.sim.fulfillFarmOwlOrder(C.id);q.ok&&(gn(),e.showToast(q.msg,"🦉")),e.selectedOwlOrderId=null,fe(e)});return}const v=(c,u,S=!1)=>{const w=Math.min(100,Math.round(c.progress/Math.max(1,c.targetAmount)*100));return`
        <div class="quest-card-mini" style="color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span class="hs-card-title" style="color:var(--ink);">${b(c.giverEmoji)} ${b(c.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${b(u)}</span>
          </div>
          ${S&&c.dialogue?`<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.35;">${b(c.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${w}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:var(--ink);">
            <span>${Math.min(c.progress,c.targetAmount)}/${c.targetAmount}</span>
            <span>🪙${c.rewardSickle} · ⭐${c.rewardXp} ${c.rewardTimeSand>0?`· ⏳${c.rewardTimeSand}`:""}</span>
          </div>
          ${c.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':c.completed?`<button type="button" data-modal-claim="${b(c.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:S?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${b(n.shortLabel)}</button>`:""}
        </div>
      `},h=e.sim.getRequiredLevelTrial(),k=e.sim.getWinsProgressForCurrentLevel(),r=c=>{const u=e.sim.getDisciplineStageInfo(c);return u.isMaxed?`👑${u.maxStage}`:`${u.currentStage}/${u.maxStage}`},y=h&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div class="hs-card-title">
              🔥 Đề Cử (${k.current}/${k.required}): ${h.icon} ${b(h.shortVi)} (${r(h.kind)})
            </div>
            <button type="button" data-modal-open-trial="${h.kind}" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">▶️ Chơi</button>
          </div>
        </div>
      `:"",f=s?`Ch.${s.chapter??1} · ${e.sim.state.storyQuestIndex+1}/${wa.length}`:"",$=e.sim.getYuleEventStatus(),M=$.dayDef?.main,I=$.day>0&&$.claimedMainDays.includes($.day),N=M?ms(e.sim.state,M):0,D=!!(M&&N>=M.amount),g=M?Math.min(100,Math.round(N/Math.max(1,M.amount)*100)):0,T=$.dayDef?.side.map(c=>{const u=$.claimedSideTaskIds.includes(c.id),S=ms(e.sim.state,c),w=S>=c.amount;return`<div class="quest-card-mini" style="padding:9px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><span style="font-size:12px;font-weight:700;">${b(c.titleVi)} <span style="color:var(--ink-soft);">(${Math.min(S,c.amount)}/${c.amount} • +${c.rewardSickles.toLocaleString("vi-VN")} 🪙)</span></span>${u?'<span style="color:#15803d;font-weight:800;">✓</span>':`<button type="button" class="brass-btn ${w?"gold-cta":""}" data-yule-side="${b(c.id)}" style="padding:4px 8px;font-size:11px;${w?"":"opacity:0.62;"}">Nhận</button>`}</div>`}).join("")??"",E=$.active&&M?`<div class="quest-card-mini" style="padding:12px;border:1px solid #d97706;background:linear-gradient(135deg,rgba(254,243,199,.9),rgba(219,234,254,.8));"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>🎄 Yule • Ngày ${$.day}/36</strong><span style="font-size:11px;color:var(--ink-soft);">${b($.dayDef?.titleVi??"")}</span></div><div style="font-size:13px;font-weight:800;margin-top:7px;">${b(M.titleVi)}</div><div class="quest-bar"><div class="quest-bar-fill" style="width:${g}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:3px;">${Math.min(N,M.amount)}/${M.amount}</div>${I?'<div style="margin-top:7px;color:#15803d;font-weight:800;">✓ Đã nhận phần thưởng ngày</div>':`<button type="button" data-yule-main="${$.day}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;${D?"":"opacity:0.65;"}">🎁 Nhận phần thưởng ngày</button>`}<div style="margin-top:9px;font-size:12px;font-weight:800;">Nhiệm vụ phụ (mỗi nhiệm vụ tối đa 5.000 Sickle)</div>${T}</div>`:"";t.innerHTML=`
      ${E}
      ${d}
      ${y}
      <h3 class="hs-section-title">📖 Cốt Truyện</h3>
      ${s?v(s,f,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 class="hs-section-title" style="margin-top:14px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(c=>v(c,"Xoay vòng")).join("")}
      </div>

      <h3 class="hs-section-title" style="margin-top:14px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(c=>v(c,`⏳ ${le(_a())}`)).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(c=>{c.addEventListener("click",()=>{e.activeQuestTab=c.dataset.qtab,fe(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(u)})}),t.querySelector("[data-yule-main]")?.addEventListener("click",()=>{const c=Number(t.querySelector("[data-yule-main]")?.dataset.yuleMain),u=e.sim.claimYuleMainDay(c);e.showToast(u.msg,u.ok?"🎄":"⚠️"),fe(e)}),t.querySelectorAll("[data-yule-side]").forEach(c=>{c.addEventListener("click",()=>{const u=e.sim.claimYuleSideTask(c.dataset.yuleSide);e.showToast(u.msg,u.ok?"🪙":"⚠️"),fe(e)})}),t.querySelectorAll("[data-modal-claim]").forEach(c=>{c.addEventListener("click",()=>{e.sim.claimQuest(c.dataset.modalClaim),fe(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const c=e.sim.completeStoryStepWithStar();c.ok?(typeof c.placedGx=="number"&&typeof c.placedGy=="number"&&ye(e.cam,c.placedGx,c.placedGy),fe(e)):(e.showToast(c.msg,c.reason==="missing_gold"?"🪙":c.reason==="locked_level"?"🔒":"🌟"),c.reason==="open_match3"&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}let Ue="zones";function Ts(e){const t=e.root.querySelector("#roadmapDialogContent"),i=t.dataset.activeRmTab??"",s=Je(t),n=new Set(e.sim.state.unlockedZones),a=e.sim.getRequiredLevelTrial(),p=Ze.filter(v=>n.has(v.id)||e.sim.state.sandboxMode).length,o=`
      <div class="hs-tabs" role="tablist" aria-label="Bản Đồ &amp; Lộ Trình">
        <button type="button" role="tab" data-rmtab="zones" aria-selected="${Ue==="zones"}" class="hs-tab">Vùng đất <span class="hs-tab-badge">${p}/${Ze.length}</span></button>
        <button type="button" role="tab" data-rmtab="milestones" aria-selected="${Ue==="milestones"}" class="hs-tab">Cột mốc <span class="hs-tab-badge">Lv.${e.sim.state.level}</span></button>
      </div>
    `,l=a&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const v=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div class="hs-card-title">
                🔥 Đề Cử Lv.${e.sim.state.level} (${v.current}/${v.required}): ${a.icon} ${b(a.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">
                ▶️ Chơi
              </button>
            </div>`})():"";let d="";if(Ue==="zones"){const v=Ze.map(h=>{const k=n.has(h.id)||e.sim.state.sandboxMode,r=!k&&e.sim.state.level>=h.unlockLevel,y=Jt(h);return`
          <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
            <div class="hs-card-title">${k?"✅":"🌫️"} ${h.name}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
              <span>Lv.${h.unlockLevel} · ${y>0?`🌟 ${y}`:"✓"}</span>
              <div style="display:flex;gap:5px;">
                <button type="button" data-cam-zone="${h.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
                ${r?`<button type="button" data-unlock-zone="${h.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
              </div>
            </div>
          </div>
        `}).join("");d=`${l}<div class="grid-2col">${v}</div>`}else d=`
        <div class="hs-card-list">
          ${Ca.filter(h=>h.unlockedItemIds.length>0||h.unlockedZoneId||h.milestoneNote||h.level%10===0).map(h=>{const k=e.sim.state.level>=h.level,r=h.unlockedItemIds.map(y=>Y(y)?.name).filter(Boolean).join(", ");return`
                <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${k?"1":"0.78"};">
                  <div>
                    <span style="font-weight:700;font-size:13px;">${k?"🌟":"🔒"} Lv.${h.level}</span>
                    ${r?`<span style="font-size:12px;margin-left:6px;">${r}</span>`:""}
                  </div>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${h.rewardSickle}</span>
                </div>
              `}).join("")}
        </div>
      `;t.innerHTML=o+d,t.dataset.activeRmTab=Ue,et(t,s,!!(i&&i!==Ue)),t.querySelectorAll("[data-rmtab]").forEach(v=>{v.addEventListener("click",()=>{Ue=v.dataset.rmtab==="milestones"?"milestones":"zones",Ts(e)})}),t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(v=>{v.addEventListener("click",()=>{const h=As(v.dataset.camZone);ye(e.cam,(h.x1+h.x2)*.5,(h.y1+h.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(v=>{v.addEventListener("click",()=>{const h=e.sim.unlockZone(v.dataset.unlockZone);e.showToast(h.msg,h.ok?"✨":"🔒"),Ts(e)})})}function Ee(e,t,i,s,n=i.length,a=i.length){const p=i.map(([o,l])=>`<button type="button" data-${t}="${o}" data-active="${o===s}" aria-pressed="${o===s}">${l}</button>`).join("");return`<div class="hs-set-row"><span class="hs-set-k">${e}</span><div class="hs-seg" role="group" aria-label="${e}" style="--hs-seg-cols:${n};--hs-seg-wide:${a}">${p}</div></div>`}function he(e){const t=e.root.querySelector("#settingsDialogContent"),i=Je(t),s=e.sim.state,n=e.sprites?e.sprites.isToonEnabled():!0,a=e.getEffectiveA11ySettings(),p=typeof window<"u"&&!1,o=[{key:"master",label:"Tổng"},{key:"music",label:"Nhạc nền"},{key:"sfx",label:"Hiệu ứng"},{key:"voice",label:"Giọng đọc"}],l=Object.values(s.stashedDecorInventory??{}).reduce((d,v)=>d+v,0);t.innerHTML=`
      <div class="quest-card-mini">
        <h3 class="hs-section-title">Âm thanh</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label class="switch-row">
            <span>Nhạc nền</span>
            <input id="swBgm" type="checkbox" switch ${s.settings.bgmEnabled?"checked":""} />
          </label>
          <label class="switch-row">
            <span>Hiệu ứng</span>
            <input id="swSfx" type="checkbox" switch ${s.settings.soundEnabled?"checked":""} />
          </label>
          ${o.map(d=>{const v=Math.round((a.volumes[d.key]??.85)*100);return`
                <label class="aaa-slider-row" style="font-size:12px;font-weight:700;">
                  <span>${d.label}</span>
                  <input type="range" min="0" max="100" value="${v}" data-vol-bus="${d.key}" />
                  <span data-vol-val="${d.key}">${v}%</span>
                </label>
              `}).join("")}
        </div>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Hiển thị &amp; Trợ năng</h3>
        ${Ee("Kiểu vẽ","toon",[["on","Viền nâu"],["off","2.5D"]],n?"on":"off")}
        ${Ee("Đồ hoạ","renderer-mode",[["webgl2","WebGL2"],["canvas","Cổ điển"]],s.settings.rendererMode??"webgl2")}
        ${Ee("Giáng Sinh","yule-theme-mode",[["auto","Tự động"],["on","Luôn bật"],["off","Tắt"]],s.settings.yuleThemeMode??"auto")}
        ${Ee("Chế độ màu","cb-mode",[["none","Mặc định"],["protanopia","Đỏ-Lục"],["deuteranopia","Lục-Đỏ"],["tritanopia","Xanh-Vàng"]],a.colorblindMode,2,4)}
        ${Ee("Cỡ chữ","font-scale",[["100","100%"],["125","125%"],["150","150%"]],String(a.fontScale))}
        <label class="switch-row">
          <span>Tương phản cao</span>
          <input id="swHighContrast" type="checkbox" switch ${a.highContrast?"checked":""} />
        </label>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Bầu trời &amp; Nhịp độ</h3>
        ${Ee("Giờ","time",[["realtime","Tự động"],["dawn","Bình minh"],["day","Ngày"],["dusk","Chiều"],["night","Đêm"]],s.settings.timeOverride,3)}
        ${Ee("Lễ hội","fest",[["auto","Tự động"],["lunar_tet","Tết Việt"],["mid_autumn","Trung Thu"],["halloween","Halloween"],["christmas","Giáng Sinh"],["quidditch_cup","Quidditch"]],s.settings.activeFestival,3,6)}
        ${Ee("Thời tiết","weather",[["auto","Tự động"],["clear","Nắng"],["cloudy","Mây"],["rain","Mưa"],["storm","Giông"],["snow","Tuyết"],["fog","Sương"]],s.settings.weatherOverride,4,7)}
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Điền trang &amp; Cẩm nang</h3>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((d,v)=>{const h=s.layoutPresets?.[d];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:700;">${h?b(h.label):`Bản vẽ #${v+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${h?`${h.placements.length} công trình`:"Trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${d}" class="brass-btn" style="flex:1;padding:4px 6px;font-size:12px;">Lưu</button>
                    <button type="button" data-load-layout="${d}" ${h?"":"disabled"} class="brass-btn ${h?"gold-cta":""}" style="flex:1;padding:4px 6px;font-size:12px;">Dùng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn" style="font-size:12px;">Cất trang trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn ${l>0?"gold-cta":""}" ${l>0?"":"disabled"} style="font-size:12px;">
            Bày lại (${l})
          </button>
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta" style="font-size:12px;">
            Hướng dẫn
          </button>
          <button id="btnResetPark" type="button" class="brass-btn" style="font-size:12px;border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            Chơi lại
          </button>
        </div>
        <div style="font-size:12px;color:var(--ink-soft);">Đã tự lưu trên HPVN.</div>
        ${p?`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                <label class="switch-row" style="width:100%;">
                  <span>Sandbox (Dev)</span>
                  <input id="swSandbox" type="checkbox" switch ${s.sandboxMode?"checked":""} />
                </label>
                <button id="btnPreview100" type="button" class="brass-btn" style="font-size:12px;">${e.sim.isHeadmasterPreview?"Về Save":"Xem Lv.100"}</button>
                <button id="btnTestFireworks" type="button" class="brass-btn" style="font-size:12px;">Pháo hoa</button>
                <button id="btnTestEscape" type="button" class="brass-btn" style="font-size:12px;">Thả Niffler</button>
              </div>`:""}
      </div>
    `,et(t,i),"switch"in HTMLInputElement.prototype||Ta(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",d=>{s.settings.bgmEnabled=d.currentTarget.checked,e.sim.audio.bgmEnabled=s.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",d=>{s.settings.soundEnabled=d.currentTarget.checked,e.sim.audio.enabled=s.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",d=>{s.settings.cutawayMode=d.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",d=>{s.settings.showGrid=d.currentTarget.checked,e.sim.saveToStorage(),e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",d=>{typeof window<"u"}),t.querySelectorAll("[data-time]").forEach(d=>{d.addEventListener("click",()=>{s.settings.timeOverride=d.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),he(e)})}),t.querySelectorAll("[data-fest]").forEach(d=>{d.addEventListener("click",()=>{s.settings.activeFestival=d.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),he(e)})}),t.querySelectorAll("[data-weather]").forEach(d=>{d.addEventListener("click",()=>{s.settings.weatherOverride=d.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),he(e)})}),t.querySelectorAll("[data-toon]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.toon==="on";e.sim.state.settings.toonEnabled=v,e.sim.saveToStorage(),he(e),(e.sprites?e.sprites.setToonEnabledAsync(v):Promise.resolve()).then(()=>{e.sim.state.settings.toonEnabled===v&&(typeof window<"u"&&window.dispatchEvent(new CustomEvent("hangsoc:toon-changed")),e.refreshAll())})})}),t.querySelectorAll("[data-renderer-mode]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.rendererMode;(v==="webgl2"||v==="canvas")&&(s.settings.rendererMode=v,e.sim.saveToStorage(),e.refreshAll(),he(e))})}),t.querySelectorAll("[data-yule-theme-mode]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.yuleThemeMode;(v==="auto"||v==="on"||v==="off")&&(s.settings.yuleThemeMode=v,typeof document<"u"&&(document.documentElement.dataset.yuleTheme=e.sim.isYuleVisualThemeActive()||e.sim.isWinterMainMapActive()?"true":"false"),e.sim.saveToStorage(),e.refreshAll(),he(e))})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),he(e)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),ye(e.cam,18,24.5),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(d=>{d.addEventListener("input",()=>{const v=d.dataset.volBus,h=Math.max(0,Math.min(1,Number(d.value)/100)),k=e.getEffectiveA11ySettings();k.volumes[v]=h,s.a11ySettings=k;const r=t.querySelector(`[data-vol-val="${v}"]`);r&&(r.textContent=`${Math.round(h*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(d=>{d.addEventListener("click",()=>{const v=e.getEffectiveA11ySettings();v.colorblindMode=d.dataset.cbMode,s.a11ySettings=v,e.applyStoredA11ySettings(),e.sim.saveToStorage(),he(e)})}),t.querySelectorAll("[data-font-scale]").forEach(d=>{d.addEventListener("click",()=>{const v=e.getEffectiveA11ySettings();v.fontScale=Number(d.dataset.fontScale),s.a11ySettings=v,e.applyStoredA11ySettings(),e.sim.saveToStorage(),he(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",d=>{const v=e.getEffectiveA11ySettings();v.highContrast=d.currentTarget.checked,s.a11ySettings=v,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.saveLayout,h=e.sim.saveLayoutPreset(v);e.showToast(`📐 Đã lưu "${h.label}" (${h.placements.length} công trình)!`,"📐"),he(e)})}),t.querySelectorAll("[data-load-layout]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.loadLayout,h=e.sim.applyLayoutPreset(v);e.showToast(h.msg,h.ok?"📐":"⚠️"),e.refreshAll(),he(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const d=e.sim.stashAllDecorItems();e.showToast(d.msg,d.ok?"📦":"⚠️"),e.refreshAll(),he(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const d=e.sim.restoreAllStashedDecor();e.showToast(d.msg,d.ok?"🌸":"⚠️"),e.refreshAll(),he(e)}),t.querySelectorAll("[data-save-slot]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.saveSlot,h=e.sim.saveNamedProfileSlot(v);e.showToast(`💾 Đã ghi ${h.label} (Cấp ${h.level})!`,"💾"),he(e)})}),t.querySelectorAll("[data-load-slot]").forEach(d=>{d.addEventListener("click",()=>{const v=d.dataset.loadSlot,h=e.sim.loadNamedProfileSlot(v);h.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(h.msg,h.ok?"📂":"⚠️")})})}async function Xn(e){return!1}const Us=()=>la?.uid??"hpvn-local",Yn=e=>{},Zn=e=>!1,Ct={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},Cs={clear:"Nắng ấm",cloudy:"Mây nhẹ",rain:"Mưa phùn",storm:"Giông phép",snow:"Tuyết rơi",fog:"Sương mù",fireflies:"Đom đóm",dawn:"Bình minh",day:"Ngày",dusk:"Chiều",night:"Đêm"},Wt={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function ts(e){return e.sim.getPlayerHouse()}function Xe(e,t,i=""){const s=Ya(e),n=(t||"🧙").trim().slice(0,2);return s?`<span class="floo-avatar-shell ${i}"><img src="${b(s)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${b(n)}</span></span>`:`<span class="floo-avatar-shell ${i}"><span class="floo-avatar-fallback">${b(n)}</span></span>`}function js(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Kt(e){const t=e.sim.ensureNeighborSocial(),i=ts(e),s=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:s,level:e.sim.state.level,house:i,keeperTitle:Zt(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day",theme:t.postcardTheme||"classic_burrow"}}function ss(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),ie(e),e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function Jn(e,t){if(!t||typeof t!="object")return;const i=t,s=e.sim.ensureNeighborSocial();let n=!1;typeof i.uid=="string"&&i.uid.trim()&&Yn(i.uid);const a=typeof i.garden?.progression?.friendCode=="string"&&i.garden.progression.friendCode.trim()||(i.profile&&typeof i.profile=="object"&&typeof i.profile.friendCode=="string"?String(i.profile.friendCode).trim():"");if(a&&s.playerFriendCode!==a&&(s.playerFriendCode=a,n=!0),i.wallet&&typeof i.wallet.spendable=="number"&&Number.isFinite(i.wallet.spendable)){const l=e.sim.homeStateWhileVisiting??e.sim.state,d=Math.max(0,Math.floor(i.wallet.spendable));if(!l.sandboxMode&&!l.sandboxTainted&&!e.sim.isHeadmasterPreview){const v=!!i.receipt,h=Zn();(v||h||d>=l.galleons)&&l.galleons!==d&&(d>l.galleons&&(e.sim.pendingInboxSickles+=d-l.galleons),l.galleons=d,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=d),n=!0)}}const p=i.profile&&typeof i.profile=="object"?i.profile:null;if(p){const l=typeof p.username=="string"?p.username.trim():"";l&&l!=="Phù Thủy Hang Sóc"&&l!=="Trang Trại Hang Sóc"&&!s.playerDisplayName&&(s.playerDisplayName=l,n=!0);const d=typeof p.avatarUrl=="string"?p.avatarUrl.trim():"";d&&s.playerAvatarUrl!==d&&(s.playerAvatarUrl=d,n=!0)}const o=i.daily&&typeof i.daily=="object"?i.daily:null;if(o&&typeof o.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Te,Math.floor(o.helpsLeft)));const l=Math.max(0,Te-e.flooHelpsLeft);l>(s.dailyGardenHelpsCount??0)&&(s.dailyGardenHelpsCount=l,n=!0)}if(Array.isArray(i.helpers)&&i.helpers.length>0){e.flooHelpersToday=i.helpers.map(d=>({uid:String(d.uid||""),name:String(d.name||"Bạn HPVN"),avatarEmoji:d.avatarEmoji,avatarUrl:d.avatarUrl,at:Number(d.at||0)}));const l=Ua(e.flooHelpersToday,s.lastSeenHelperAt??0);l&&l.textVi&&l.seenAt>(s.lastSeenHelperAt??0)&&(s.lastSeenHelperAt=l.seenAt,n=!0,e.showToast(l.textVi,"🤝"))}n&&(e.sim.saveToStorage(),e.refreshAll())}async function Mt(e,t=!1){if(e.flooLoading)return;const i=Date.now();if(!t&&e.flooLastLoadedAt>0&&i-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const s=e.sim.ensureNeighborSocial(),n=ts(e),a=s.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const p=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;p||Xn(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!p&&await Be.authoritativeClient.syncProfile({playerName:a,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:s.playerAvatarUrl||"",avatarEmoji:Wt[n],house:n,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(v=>Jn(e,v)).catch(()=>{});const o=await Be.authoritativeClient.visit({});if(typeof o.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Te,Math.floor(o.helpsLeft)));const v=Math.max(0,Te-e.flooHelpsLeft);v>(s.dailyGardenHelpsCount??0)&&(s.dailyGardenHelpsCount=v)}const l=Array.isArray(o.visits)?o.visits:[],d=$t(l,Date.now());e.flooDirectoryRows=d,e.flooQueueRows.length===0&&(e.flooQueueRows=d),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(d,Us())}catch{}finally{e.flooLoading=!1;const p=e.root.querySelector("#neighborDialog"),o=document.activeElement?.id??"";p?.open&&o!=="inpFlooDisplayName"&&pe(e),e.renderVisitorDockBar()}}let Rt=!1;function Qt(e){if(Rt)return;Rt=!0;const t=e.root.querySelectorAll("#btnPostcardShareFloo, #btnFlooQuickInvite, #btnHonorShareFloo");t.forEach(s=>s.disabled=!0);const i=Kt(e);Ms().then(()=>Nt(Ls(e.gameCanvas,i),`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`)).then(()=>{const s=e.sim.recordFlooShareOrPostcard("shareFloo");e.showToast(s.msg,"🔥")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{Rt=!1,t.forEach(s=>s.disabled=!1),e.refreshAll(),e.root.querySelector("#neighborDialog")?.open&&pe(e)})}function ei(e,t,i){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),i&&(e.focusedNeighborId=i),(e.sim.state.level>=We||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&Mt(e),pe(e);const n=e.root.querySelector("#neighborDialog");n&&!n.open&&n.showModal(),i&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${i}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function ti(e,t){e.closeHudPopovers();const i=e.root.querySelector("#neighborDialog");i?.open&&i.close(),t.kind==="match3"?e.getMatch3Modal().then(s=>s.openRescue(t)):e.getPuzzleArcadeModal().then(s=>s.openRescue(t))}function as(e,t){ss(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const s=e.sim.enterHonorGardenTour(t);s.ok&&typeof s.focusGx=="number"&&typeof s.focusGy=="number"?(e.onCameraJump?.(),ye(e.cam,s.focusGx,s.focusGy)):s.ok||e.showToast(s.msg,"⚠️"),e.refreshAll()}function Ye(e,t,i){const s=String(t||"").trim();if(!s)return;if(s.startsWith("tour_")){as(e,s);return}i&&i.length>0?e.flooQueueRows=[...i]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),ss(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const a=s.startsWith("player_")?s:`player_${s}`,p=s.startsWith("player_")?s.slice(7):s;(async()=>{try{const l=await Be.authoritativeClient.visit({hostUid:p});typeof l.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Te,Math.floor(l.helpsLeft))));const d=l.visit&&typeof l.visit=="object"?l.visit:null;if(d){const v=d.progression&&typeof d.progression=="object"?d.progression:void 0,h=Date.now(),k=Array.isArray(v?.timers)?v.timers.filter(M=>Number(M.readyAt||0)>h).length:0,r=d.decorations&&typeof d.decorations=="object"?d.decorations:void 0,y={uid:String(d.uid||p),friendCode:typeof d.friendCode=="string"?d.friendCode:void 0,username:String(d.username||"Thành Viên HPVN"),parkName:String(d.parkName||"Thung Lũng Phép Thuật"),house:d.house||"Gryffindor",avatarEmoji:typeof d.avatarEmoji=="string"?d.avatarEmoji:void 0,avatarUrl:typeof d.avatarUrl=="string"?d.avatarUrl:void 0,level:Math.max(1,Number(d.level||1)),growing:k,helped:!!d.helped,hostHelpsLeft:typeof d.hostHelpsLeft=="number"?d.hostHelpsLeft:10,fire:d.fire&&typeof d.fire=="object"?d.fire:null,scene:r?.scene},f=e.sim.syncFlooDirectoryMembers([y],Us()),$=d.rawClientSave&&typeof d.rawClientSave=="object"?d.rawClientSave:null;if(f[0]&&$){if(Array.isArray($.buildings)&&$.buildings.length>0){const D=$.buildings.filter(g=>g&&typeof g.itemId=="string"&&!!Y(g.itemId));D.length>0&&(f[0].valleyBuildings=D)}$.tileOverrides&&typeof $.tileOverrides=="object"&&(f[0].valleyTileOverrides=$.tileOverrides),Array.isArray($.unlockedZones)&&$.unlockedZones.length>0&&(f[0].valleyUnlockedZones=$.unlockedZones);const M=$.roadsideStand&&typeof $.roadsideStand=="object"?Ga($.roadsideStand):void 0,I=$.neighborSocial&&typeof $.neighborSocial=="object"?$.neighborSocial:null,N=I?.coopSupplyCrate&&typeof I.coopSupplyCrate=="object"?I.coopSupplyCrate:null;za(f[0],{roadsideStand:M,coopWeekKey:typeof N?.weekKey=="string"?N.weekKey:void 0,coopPoints:typeof N?.contributedPoints=="number"?N.contributedPoints:void 0})}}}catch{}const o=e.sim.enterNeighborVisit(a);o.ok&&typeof o.focusGx=="number"&&typeof o.focusGy=="number"?(e.onCameraJump?.(),ye(e.cam,o.focusGx,o.focusGy)):o.ok||e.showToast(o.msg,"⚠️"),e.refreshAll()})()}function si(e,t){if(t.startsWith("tour_")){as(e,t);return}ss(e);const i=e.root.querySelector("#neighborDialog");i?.open&&i.close();const s=e.sim.enterNeighborVisit(t);s.ok&&typeof s.focusGx=="number"&&typeof s.focusGy=="number"?(e.onCameraJump?.(),ye(e.cam,s.focusGx,s.focusGy)):s.ok||e.showToast(s.msg,"⚠️"),e.refreshAll()}function Xt(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),ye(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const i=new URLSearchParams(window.location.search);if(i.has("visit")||i.has("tour")){i.delete("visit"),i.delete("tour");const s=i.toString();window.history.replaceState(null,"",`${window.location.pathname}${s?`?${s}`:""}${window.location.hash}`)}}e.refreshAll()}function Bi(e){const t=e.sim.ensureNeighborSocial(),i=t.playerOwlHelpRequests.filter(d=>!!d.fulfilledAt).length,s=t.playerMinigameSos?.rescuedAt??0,n=!!t.playerMinigameSos?.claimed,a=`${t.lastSocialResetKey}|${t.friendshipTokens}|${i}|${s}|${n}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(a===e.lastSocialLiveSig)return;e.lastSocialLiveSig=a,ai(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const o=e.root.querySelector("#neighborDialog"),l=document.activeElement?.id??"";o?.open&&l!=="inpFlooDisplayName"&&pe(e)}function ai(e){const t=e.sim.ensureNeighborSocial(),i=Math.floor(t.friendshipTokens/Ke),s=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,n=t.homeLanternMarks.length,a=i+s+n,o=Math.max(0,it-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(h=>h.minigameSos&&!h.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(h.id)).length:0,l=e.sim.state.level>=We&&(t.dailyGardenHelpsCount??0)<Te?e.flooDirectoryRows.filter(h=>dt(h)).length:0,d=e.root.querySelector("#badgeNeighborCount");if(d){const h=a>0?a:o>0?o:l;h>0?(d.textContent=String(h),d.classList.toggle("is-ready-green",a>0),d.classList.remove("hidden")):d.classList.add("hidden")}const v=e.root.querySelector("#badgeManageNeighborCount");v&&(a>0?(v.textContent=String(a),v.classList.remove("hidden")):v.classList.add("hidden"))}function Ii(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const i=e.sim.getActiveHonorGardenTour();if(i){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${b(Pe(i.avatarEmoji,i.titleVi))}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${b(i.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${i.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span><span class="hs-raw">${b(i.ownerName)}</span> · ${b(Ct[i.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const c=e.sim.cycleHonorGardenTour(-1);c.ok&&typeof c.focusGx=="number"&&typeof c.focusGy=="number"&&(e.onCameraJump?.(),ye(e.cam,c.focusGx,c.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const c=e.sim.cycleHonorGardenTour(1);c.ok&&typeof c.focusGx=="number"&&typeof c.focusGy=="number"&&(e.onCameraJump?.(),ye(e.cam,c.focusGx,c.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{Qt(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Xt(e)});return}const s=e.sim.getActiveVisitingNeighbor();if(!s){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.ensureNeighborSocial(),a=Date.now(),p=Math.min(Te,Math.max(n.dailyGardenHelpsCount??0,s.helpedViaFlooToday?1:s.helpedMarksToday.length)),o=Math.max(0,Te-p),l=!!(s.helpedViaFlooToday||s.helpedMarksToday.length>0),d=(s.hostHelpsLeft??10)<=0,v=!!(s.fireUntilMs&&s.fireUntilMs>a),h=!l&&o>0&&!d,k=n.dailyLikedNeighborIds.includes(s.id),r=n.dailyMysteryClaimedIds.includes(s.id),y=s.owlHelpCrates.filter(c=>!c.fulfilledByPlayerToday).length,f=e.sim.canRescueNeighborMinigame(s.id).ok,$=y+(f?1:0),M=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,I=s.remoteUserId||s.id.replace(/^player_/,""),N=M.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${M.slice(0,12).map(c=>{const u=c.uid===I,S=dt(c,a),w=!!(c.fire&&c.fire.until>a);return`
                <button
                  type="button"
                  class="floo-strip-dot ${u?"is-current":""} ${S?"is-helpable":""} ${w?"is-fire":""}"
                  data-floo-jump="${b(c.uid)}"
                  title="${b(c.username)} (Lv.${c.level})"
                >
                  ${Xe(c.avatarUrl,Pe(c.avatarEmoji,c.username),"floo-strip-avatar")}
                  ${w?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",D=l?"✓ Đã giúp (-15p)":o<=0?"Hết lượt (5/5)":d?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${N}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${Xe(s.avatarUrl,Pe(s.avatarEmoji,s.name),"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong class="hs-raw">${b(s.name)}</strong>
            <span class="visitor-lv-tag">Lv.${s.level}</span>
            ${v?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${o}/${Te}</strong> lượt</span>
            <span>•</span>
            <span>Rương Tình Bạn <strong>${n.friendshipTokens}/${Ke}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${M.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${h?"gold-cta":""}" ${h?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${D}
        </button>
        ${v?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${k?"disabled":""} title="Thả tim khen vườn">
          ${k?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${r?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${r?"✓ Quà":"🎁 Quà"}
        </button>
        <button id="btnVisitorLeaveGift" type="button" class="brass-btn" ${(n.dailyMysterySentIds??[]).includes(s.id)?"disabled":""} title="Giấu Rương Quà Bất Ngờ tặng chủ vườn (+2 🍀)">
          ${(n.dailyMysterySentIds??[]).includes(s.id)?"✓ Đã tặng":"🎁 Giấu quà"}
        </button>
        ${(()=>{const c=!!(e.sim.homeStateWhileVisiting??e.sim.state).roadsideStand?.dailyFriendBoughtIds?.includes(s.id),u=e.sim.getNeighborRoadsideOffer(s),S=oe(u.itemId),w=u.isRealFriendListing?`Sạp thật của ${s.name}: ${u.qty} ${S.name} (${u.totalSickle} Sickle)`:`Mua ${u.qty} ${S.name} ưu đãi từ Sạp Đầu Ngõ (${u.totalSickle} Sickle)`;return`<button id="btnVisitorBuyStand" type="button" class="brass-btn ${!c&&u.isRealFriendListing?"gold-cta":""}" ${c?"disabled":""} title="${b(w)}">
          ${c?"✓ Sạp":u.isRealFriendListing?`🧺 Sạp (${u.qty})`:"🧺 Sạp"}
        </button>`})()}
        ${$>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${$})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,js(t),t.querySelectorAll("[data-floo-jump]").forEach(c=>{c.addEventListener("click",()=>{const u=c.dataset.flooJump;u&&u!==I&&Ye(e,u,M)})});const g=`${s.id}:help`;t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{if(t.dataset.flooBusy===g)return;t.dataset.flooBusy=g;const c=t.querySelector("#btnVisitorFlooHelp");c&&(c.disabled=!0);try{let u;if(s.remoteUserId)try{const R=ja(n.selectedPresetNoteId),P=await Be.authoritativeClient.visit({hostUid:s.remoteUserId,help:!0,kind:"water_crop",noteText:R.textVi});typeof P.helpsLeft=="number"&&(u=P.helpsLeft,e.flooHelpsLeft=P.helpsLeft)}catch(R){const P=rs(R);e.showToast(`${P.icon} ${P.text}`,P.icon),Mt(e,!0),e.refreshAll();return}if(e.sim.getActiveVisitingNeighbor()?.id!==s.id){const R=P=>P.map(B=>B.uid===I?{...B,helped:!0}:B);e.flooDirectoryRows=R(e.flooDirectoryRows),e.flooQueueRows=R(e.flooQueueRows),e.refreshAll();return}const S=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:u});if(!S.ok){e.showToast(S.msg,"🤝"),e.refreshAll();return}const w=R=>R.map(P=>P.uid===I?{...P,helped:!0}:P);if(e.flooDirectoryRows=w(e.flooDirectoryRows),e.flooQueueRows=w(e.flooQueueRows),e.refreshAll(),S.helpsLeft>0&&e.flooQueueRows.length>1){const R=Bt(e.flooQueueRows,I,1);R&&R.uid!==I&&dt(R)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===s.id&&Ye(e,R.uid,e.flooQueueRows)},1600))}}finally{t.dataset.flooBusy===g&&delete t.dataset.flooBusy}});const T=`${s.id}:fire`;t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{if(t.dataset.flooBusy===T)return;t.dataset.flooBusy=T;const c=t.querySelector("#btnVisitorExtinguish");c&&(c.disabled=!0);try{let u=0;if(s.remoteUserId){const w=await Be.authoritativeClient.fireOut({hostUid:s.remoteUserId});u=Math.max(0,Math.floor(Number(w?.price||0)))}if(u>0){const w=e.sim.homeStateWhileVisiting??e.sim.state;w.galleons=Math.max(0,w.galleons-u),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=w.galleons)}s.fireUntilMs=0;const S=w=>w.map(R=>R.uid===I?{...R,fire:null}:R);e.flooDirectoryRows=S(e.flooDirectoryRows),e.flooQueueRows=S(e.flooQueueRows),e.showToast(u>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${s.name} (-${u} Sickle)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${s.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(u){const S=rs(u);e.showToast(`${S.icon} ${S.text}`,S.icon),c&&(c.disabled=!1)}finally{t.dataset.flooBusy===T&&delete t.dataset.flooBusy}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const c=e.sim.likeVisitedNeighborFarm();c.ok||e.showToast(c.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{r||(e.rideCamUid=null,e.onCameraJump?.(),ye(e.cam,s.mysteryGiftGx+.5,s.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{ei(e,"friends",s.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const c=Bt(M,I,-1);c&&c.uid!==I&&Ye(e,c.uid,M)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(M.length>1){const u=Bt(M,I,1);if(u&&u.uid!==I){Ye(e,u.uid,M);return}}const c=e.sim.cycleNextNeighborVisit();c.ok&&typeof c.focusGx=="number"&&typeof c.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),ye(e.cam,c.focusGx,c.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Xt(e)});const E=`${s.id}:stand`;t.querySelector("#btnVisitorBuyStand")?.addEventListener("click",()=>{if(t.dataset.flooBusy===E)return;const c=t.querySelector("#btnVisitorBuyStand"),u=e.sim.getNeighborRoadsideOffer(s);if(s.remoteUserId&&u.isRealFriendListing&&typeof u.slotIndex=="number"){const w=e.sim.homeStateWhileVisiting??e.sim.state;if(!w.sandboxMode&&w.galleons<u.totalSickle){e.showToast(`Cần ${u.totalSickle.toLocaleString("vi-VN")} Sickle để mua Quầy Ven Đường này!`,"🧺");return}const R=e.sim.getBarnTotalUsed(),P=w.farmBarn?.capacity??60;if(R+u.qty>P){e.showToast(`Kho Đỏ cần còn trống ít nhất ${u.qty} ô trước khi mua!`,"🧺");return}const B=u.slotIndex;t.dataset.flooBusy=E,c&&(c.disabled=!0);const L=`stand_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;Be.authoritativeClient.buyRoadsideStand({hostUid:s.remoteUserId,slotIndex:B,itemId:u.itemId,qty:u.qty,totalSickle:u.totalSickle,requestId:L}).then(V=>{if(V.status==="refused"){bs(s,B,"Bạn HPVN"),e.showToast(`🧺 ${V.msg}`,"🧺"),e.refreshAll();return}if(V.status!=="ok"){e.showToast("🧺 Không thể kết nối máy chủ HPVN để xác thực giao dịch Quầy Ven Đường!","🧺"),e.refreshAll();return}if(e.sim.getActiveVisitingNeighbor()?.id!==s.id){bs(s,B,"Bạn HPVN"),e.refreshAll();return}const m=e.sim.buyVisitedNeighborRoadsideOffer({atomicServerVerified:!0,expectedSlotIndex:B});m.ok?ca():e.showToast(m.msg,"🧺"),e.refreshAll()}).finally(()=>{t.dataset.flooBusy===E&&delete t.dataset.flooBusy});return}const S=e.sim.buyVisitedNeighborRoadsideOffer();S.ok||e.showToast(S.msg,"🧺"),e.refreshAll()}),t.querySelector("#btnVisitorLeaveGift")?.addEventListener("click",()=>{const c=e.sim.leaveMysteryGiftForNeighbor();c.ok||e.showToast(c.msg,"🎁"),e.refreshAll()})}function pe(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const i=t.dataset.activeNbTab??"",s=Je(t),n=e.sim.ensureNeighborSocial(),a=e.sim.getActiveVisitingNeighbor(),p=e.sim.getActiveHonorGardenTour(),o=Date.now(),l=ts(e),d=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",v=Math.min(Te,Math.max(0,n.dailyGardenHelpsCount??0)),h=Math.max(0,Te-v),k=Math.max(0,it-n.dailyRescuesGivenIds.length),r=Math.max(0,it-n.dailyRescuesReceivedCount),y=Math.max(0,_t-n.dailyOwlHelpRequestedCount),f=n.friendshipTokens>=Ke,$=Math.min(100,Math.round(n.friendshipTokens/Ke*100)),M=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,I=e.sim.state.level>=We||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,N=`
    <div class="workshop-tabs nb-tabs" role="group" aria-label="Cổng Floo">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        <span class="hs-long">Cổng Floo</span><span class="hs-short">Floo</span>
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        Bưu Thiếp ${n.dailyFlooShareClaimed?"":'<span class="nb-tab-badge" aria-label="có quà">!</span>'}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        <span class="hs-long">Rương &amp; SOS</span><span class="hs-short">Rương</span> ${f||M?.rescuedAt?'<span class="nb-tab-badge" aria-label="có quà">!</span>':""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        Lưu Bút ${n.activityLog.length?`<span class="nb-tab-badge">${n.activityLog.length}</span>`:""}
      </button>
    </div>
  `;let D="";if(e.activeNeighborTab==="friends"){const u=[];(n.homeVisitorGifts?.length??0)>0&&u.push(`
        <div class="nb-alert-banner ready">
          <span>🎁 <strong>${n.homeVisitorGifts.length} Rương Quà Bạn Bè</strong> tại sân</span>
          <button id="btnNbClaimVisitorGift" type="button" class="brass-btn gold-cta nb-mini-cta">Mở quà</button>
        </div>
      `),n.homeLanternMarks.length>0&&u.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 <strong>${n.homeLanternMarks.length} Đèn Lồng</strong> tại vườn</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận +${n.homeLanternMarks.length} 🍀</button>
        </div>
      `);const S=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${Xe(n.playerAvatarUrl,Wt[l],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <strong class="hs-card-title hs-raw">${b(d)}</strong>
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${Ct[l]}</span>
              <span class="floo-verified-tag">HPVN</span>
            </div>
          </div>
        </div>
      </section>
    `;let w="";if(I){const P=$t(e.flooDirectoryRows,o),B=P.filter(A=>dt(A,o)).length,L=[...e.flooHelpersToday,...n.homeLanternMarks.map(A=>({uid:A.helperId,name:A.helperName,avatarEmoji:A.helperEmoji,avatarUrl:A.helperAvatarUrl,at:A.createdAt}))],V=Array.from(new Map(L.map(A=>[A.uid||A.name,A])).values()),m=V.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${V.slice(0,6).map(A=>Xe(A.avatarUrl,Pe(A.avatarEmoji,A.name),"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                <strong>${b(Wa(V))}</strong> đã giúp · −${V.length*15} phút
              </div>
            </div>
          `:"",C=P.length>0?`
            <div class="floo-portal-grid" role="list">
              ${P.map(A=>{const _=!!(A.fire&&A.fire.until>o),K=dt(A,o),U=a?.remoteUserId===A.uid||a?.id===`player_${A.uid}`,J=_?"🔥 Đang cháy":A.helped?"✓ Đã giúp":A.growing>0?`🌱 ${A.growing} mẻ`:"🌿 Yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${_?"is-fire":""} ${K?"is-helpable":""} ${A.helped?"is-helped":""} ${U?"is-visiting":""}"
                      data-floo-portal="${b(A.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${Xe(A.avatarUrl,Pe(A.avatarEmoji,A.username),"floo-portal-avatar")}
                        ${_?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${A.level}</span>
                      </div>
                      <strong class="floo-portal-name hs-raw">${b(A.username)}</strong>
                      <span class="floo-portal-park">${b((A.house?Wt[A.house]:"")||"🪄")} ${b(A.parkName||"")}</span>
                      <span class="floo-portal-status">${J}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"Đang kết nối Cổng Floo…":"Chưa có vườn trực tuyến."}
            </div>
          `,q=n.neighbors.filter(A=>A.owlHelpCrates.some(_=>!_.fulfilledByPlayerToday)||!!(A.minigameSos&&!A.minigameSos.rescuedToday)),F=q.length>0?`
            <section class="floo-coop-board">
              <h3 class="nb-section-title">Tương trợ</h3>
              <div class="nb-friends-list">
                ${q.slice(0,6).map(A=>{const _=e.sim.canRescueNeighborMinigame(A.id),K=A.minigameSos,U=K?Ka(K.kind):null,J=!!(K&&(K.rescuedToday||n.dailyRescuesGivenIds.includes(A.id))),x=A.owlHelpCrates.filter(O=>!O.fulfilledByPlayerToday).map(O=>{const z=oe(O.itemId),j=e.sim.getFarmItemCount(O.itemId),W=e.sim.state.sandboxMode||j>=O.qty;return`
                          <div class="nb-crate-item">
                            <img src="${z.iconSrc}" alt="${b(z.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${O.qty} ${b(z.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":j}/${O.qty})</span></div>
                              <div class="nb-crate-rew">+${O.rewardTokens} 🍀 · +${O.rewardSickle} Sickle</div>
                            </div>
                            <button type="button" class="brass-btn ${W?"gold-cta":""} nb-mini-cta" data-nb-crate="${b(A.id)}|${b(O.id)}" ${W?"":"disabled"}>Đóng giúp</button>
                          </div>
                        `}).join(""),H=K&&U&&!J?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">${U.icon} ${b(U.nameVi)} · <strong>Màn ${K.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${b(A.id)}" ${_.ok?"":"disabled"}>Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===A.id?"focused":""}" data-neighbor-card="${b(A.id)}">
                        <div class="nb-card-head">
                          ${Xe(A.avatarUrl,Pe(A.avatarEmoji,A.name),"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name hs-raw">${b(A.name)}</strong>
                              <span class="nb-badge-pill">Lv.${A.level}</span>
                              <span class="nb-badge-pill house">${Ct[A.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${b(A.id)}">Bay tới</button>
                        </div>
                        ${x?`<div class="nb-coop-section"><div class="nb-crate-list">${x}</div></div>`:""}
                        ${H}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";w=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng</h3>
              <div class="floo-hearth-sub">
                Giúp vườn: ${h}/${Te} · ${B} vườn chờ (−15p)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" aria-label="Làm mới" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"…":"Làm mới"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${P.length===0?"disabled":""}>
                Bay Floo
              </button>
            </div>
          </div>
          ${m}
        </section>
        ${C}
        ${F}
      `}else{const P=Math.min(100,Math.round(e.sim.state.level/We*100));w=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng · Mở Cấp ${We}</h3>
              <div class="floo-hearth-sub">
                Cấp ${e.sim.state.level}/${We} · Tự kết nối vườn thành viên HPVN
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${P}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const R=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Vườn mẫu</h3>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận hôm nay":"+8 Sickle · +15 XP/ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${Qa.map(P=>{const B=p?.id===P.id;return`
              <article class="honor-garden-card ${B?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${b(Pe(P.avatarEmoji,P.ownerName))}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${b(P.titleVi)}</strong>
                    <span class="honor-garden-owner"><span class="hs-raw">${b(P.ownerName)}</span> · Lv.${P.level} · ${Ct[P.house]}</span>
                  </div>
                </div>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">${b(Cs[P.weather]??P.weather)} · ${b(Cs[P.atmosphere]??P.atmosphere)}</span>
                  ${B?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${b(P.id)}">Tham quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;D=`
      ${u.join("")}
      ${S}
      ${I?`${w}${R}`:`${R}${w}`}
    `}else if(e.activeNeighborTab==="postcard"){const u=Kt(e),S=da(u),w=n.postcardTheme||"classic_burrow",R=Object.keys(us).map(P=>{const B=us[P],L=P===w;return`<button type="button" data-postcard-theme="${P}" data-active="${L}" aria-pressed="${L}" class="brass-btn ${L?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">${B.badgeVi} · ${b(B.labelVi)}</button>`}).join("");D=`
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Bưu thiếp</h3>
          <span class="honor-daily-pill">
            ${n.dailyFlooShareClaimed?"✓ Đã nhận hôm nay":"+10 Sickle · +1 🍀"}
          </span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;" role="group" aria-label="Chủ đề khung bưu thiếp">
          ${R}
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${b(S)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            Chia sẻ lên Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const u=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(S=>{const w=oe(S.itemId);return`
                <div class="nb-crate-item ${S.fulfilledAt?"done":""}">
                  <img src="${w.iconSrc}" alt="${b(w.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${S.qty} ${b(w.name)}</div>
                    <div class="nb-crate-rew">${S.fulfilledAt?`✓ ${b(S.helperEmoji??"🦉")} <span class="hs-raw">${b(S.helperName??"Bạn HPVN")}</span>`:"Đang chờ bạn giúp"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có đơn nhờ giúp.</div>';D=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <h3 class="nb-section-title">Rương Tình Bạn (${n.friendshipTokens}/${Ke})</h3>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${$}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug"><img class="hs-ico" src="/trang-trai-hang-soc/sprites/beast_phoenix.webp" alt="" aria-hidden="true" draggable="false"> +1 Bùa</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150 Sickle</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${n.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${f?"":"disabled"}>
              Mở rương (🍀 ${Ke})
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          ${(()=>{const S=e.sim.ensureCoopSupplyCrate(),w=e.sim.getNeighborhoodCoopSummary(),R=Math.min(100,Math.round(w.totalPoints/500*100)),B=["ottery_wheat","honey_carrot","garden_pumpkin","burrow_apple","cinnamon_apple_pie","farm_egg_wool"].map(m=>{const C=e.sim.getFarmItemCount(m),q=(e.sim.state.sandboxMode||C>=2)&&(e.sim.state.sandboxMode||S.playerContributedToday<ys),F=oe(m);return`<button type="button" data-coop-contrib="${m}" ${q?"":"disabled"} class="brass-btn ${q?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">Góp 2 ${b(F.name)} (${e.sim.state.sandboxMode?"∞":C})</button>`}).join(""),L=pn.map(m=>{const C=S.claimedMilestones.includes(m.step),q=!C&&(e.sim.state.sandboxMode||w.totalPoints>=m.target);return`<button type="button" data-coop-milestone="${m.step}" ${q?"":"disabled"} class="brass-btn ${q?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">${C?`✓ Mốc ${m.step}`:`🎁 Mốc ${m.step} (${m.target}đ)`}</button>`}).join(""),V=w.syncedContributors.length>0?`<div class="hs-coop-roster">
                    <span class="hs-coop-roster-label">${w.isServerAuthoritative?`✨ Quỹ Liên Minh HPVN (+${w.syncedFriendPoints}đ):`:`🔥 Bạn Floo tuần này (+${w.syncedFriendPoints}đ):`}</span>
                    ${w.syncedContributors.slice(0,6).map(m=>`<span class="hs-coop-chip">${b(Pe(m.avatarEmoji||"🦉",m.displayName))} <span class="hs-raw">${b(m.displayName)}</span> +${m.points}đ</span>`).join("")}
                  </div>`:'<div class="hs-coop-roster is-empty">Ghé thăm vườn bạn qua Cổng Floo để cộng dồn điểm Kiện Hàng tuần này cùng xóm!</div>';return`
              <h3 class="nb-section-title">Kiện Hàng Tương Trợ Chung (${w.totalPoints}/500)</h3>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${R}%"></div>
              </div>
              <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 6px;">
                Đã góp hôm nay: ${S.playerContributedToday}/${ys} lượt · Vườn nhà ${w.localPoints}đ${w.syncedFriendPoints>0?` + Bạn Floo ${w.syncedFriendPoints}đ`:""}
              </div>
              ${V}
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${L}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">${B}</div>
            `})()}
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">SOS &amp; Đơn Cú</h3>
          <div class="floo-sos-wrap">
            ${M?`
                  <div class="nb-alert-banner ${M.rescuedAt?"ready":""}">
                    <span>${M.rescuedAt?`<strong>${b(M.rescuerEmoji??"🦉")} ${b(M.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${M.stage}</strong>`:`Đang gọi cứu <strong>Màn ${M.stage}</strong>`}</span>
                    ${M.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">Cứu hộ: ${k}/${it} · Nhận cứu: ${r}/${it}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">Đơn Cú nhờ bạn (${y}/${_t})</div>
            <div class="nb-crate-list">${u}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">Lời nhắn thăm vườn</h3>
          <div class="nb-preset-notes">
            ${Xa.map(S=>{const w=S.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${S.id}" data-active="${w}" aria-pressed="${w}" class="brass-btn nb-note-btn">
                  ${S.emoji} ${b(S.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else D=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(S=>{const w=new Date(S.timestamp),R=String(w.getHours()).padStart(2,"0"),P=String(w.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${b(S.icon)}</span>
                  <span class="nb-log-msg">${b(S.textVi)}</span>
                  <span class="nb-log-time">${R}:${P}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Chưa có lưu bút.</div>'}</div>`;t.innerHTML=`
    ${N}
    ${D}
  `,t.dataset.activeNbTab=e.activeNeighborTab,et(t,s,!!(i&&i!==e.activeNeighborTab)),js(t);const g=t.querySelector("#flooPostcardCanvas");if(g){const u=Kt(e);Ms().then(()=>Ls(e.gameCanvas,u,g))}if(t.querySelectorAll("[data-nbtab]").forEach(u=>{u.addEventListener("click",()=>{e.activeNeighborTab=u.dataset.nbtab,pe(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",pe(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{Qt(e),pe(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{Qt(e),pe(e)}),t.querySelectorAll("[data-postcard-theme]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.postcardTheme;e.sim.setPostcardFrameTheme(S),pe(e)})}),t.querySelector("#btnNbClaimVisitorGift")?.addEventListener("click",()=>{const u=e.sim.claimHomeVisitorMysteryGift();u.ok||e.showToast(u.msg,"🎁"),e.refreshAll(),pe(e)}),e.activeNeighborTab==="chest"){const u=e.sim.ensureCoopSupplyCrate().weekKey,S=Number(t.dataset.coopSyncedAt??0);Date.now()-S>3e4&&(t.dataset.coopSyncedAt=String(Date.now()),Be.authoritativeClient.fetchCoopCrate({weekKey:u}).then(w=>{if(w.status!=="ok")return;vs({weekKey:w.weekKey,totalPoints:w.totalPoints,contributors:w.contributors,syncedAt:Date.now()}),e.root.querySelector("#neighborDialog")?.open&&e.activeNeighborTab==="chest"&&pe(e)}))}t.querySelectorAll("[data-coop-contrib]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.coopContrib,w=e.sim.contributeToCoopSupplyCrate(S,2);if(e.showToast(w.msg,w.ok?"📦":"🧺"),w.ok&&w.addedPoints>0){const R=e.sim.ensureCoopSupplyCrate().weekKey,P=`coop_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;Be.authoritativeClient.contributeCoopCrate({weekKey:R,itemId:S,qty:2,points:w.addedPoints,requestId:P}).then(B=>{if(B.status!=="ok")return;vs({weekKey:B.weekKey,totalPoints:B.totalPoints,contributors:B.contributors,syncedAt:Date.now()}),e.root.querySelector("#neighborDialog")?.open&&e.activeNeighborTab==="chest"&&pe(e)})}e.refreshAll(),pe(e)})}),t.querySelectorAll("[data-coop-milestone]").forEach(u=>{u.addEventListener("click",()=>{const S=Number(u.dataset.coopMilestone),w=e.sim.claimCoopCrateMilestone(S);e.showToast(w.msg,w.ok?"🎁":"📦"),e.refreshAll(),pe(e)})}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",u=>{u.preventDefault();const w=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);w&&(n.playerDisplayName=w,e.sim.saveToStorage(),Mt(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${w}"!`,"🔥"),pe(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{Mt(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const u=$t(e.flooDirectoryRows,Date.now());u.length>0&&Ye(e,u[0].uid,u)}),t.querySelectorAll("[data-floo-portal]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.flooPortal;if(!S)return;const w=$t(e.flooDirectoryRows,Date.now());Ye(e,S,w)})}),t.querySelectorAll("[data-honor-tour]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.honorTour;S&&as(e,S)})});const E=()=>{const u=e.sim.openFriendshipChest();u.ok||e.showToast(u.msg,"🍀"),e.refreshAll(),pe(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",E),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",E);const c=e.root.querySelector("#btnNbOpenFriendsLeaderboard");c&&(c.onclick=()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"overall")}),t.querySelectorAll("#btnNbClaimMySos").forEach(u=>{u.addEventListener("click",()=>{const S=e.sim.claimPlayerMinigameSosRescue();S.ok||e.showToast(S.msg,"⚠️"),e.refreshAll(),pe(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const u=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const S of u)e.sim.claimHomeLanternMark(S.id);e.refreshAll(),pe(e)}),t.querySelectorAll("[data-nb-visit]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.nbVisit;S&&si(e,S)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Xt(e)}),t.querySelectorAll("[data-nb-crate]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.nbCrate??"",[w,R]=S.split("|");if(!w||!R)return;const P=e.sim.fulfillNeighborOwlCrate(w,R);P.ok||e.showToast(P.msg,"🧺"),e.refreshAll(),pe(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.nbRescue;if(!S)return;const w=e.sim.canRescueNeighborMinigame(S);if(!w.ok||!w.neighbor||!w.sos){e.showToast(w.reason??"Không thể giải cứu màn này lúc này!","🦉");return}ti(e,{neighborId:w.neighbor.id,neighborName:w.neighbor.name,neighborEmoji:w.neighbor.avatarEmoji,kind:w.sos.kind,stage:w.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach(u=>{u.addEventListener("click",()=>{const S=u.dataset.nbNote;S&&(e.sim.setNeighborPresetNote(S),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),pe(e))})})}function ft(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const s=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:e.tutorialMinimized?0:.95;ye(e.cam,t.gx+t.bw*.5+s,t.gy+t.bh*.5+s),e.onCameraJump?.()}function ni(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const i=Date.now();return e.sim.state.buildings.some(n=>Y(n.itemId)?.isAnimalPasturePlot&&n.pastureAnimalId&&n.pastureReadyAt&&i>=n.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0 Sickle"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const i=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(i)return{el:i,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function xs(e){const t=e.root.querySelector("#tutorialHudSpotlight"),i=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(d=>d.removeAttribute("data-tutorial-anchor")),!t)return;const s=!!document.querySelector("dialog[open]");if(e.photoModeActive||s||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:n,label:a}=ni(e);if(!n||n.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const p=n.getBoundingClientRect();if(p.width<8||p.height<8){t.classList.add("hidden");return}const o=!!n.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");o||n.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!o);const l=6;t.style.setProperty("--spot-left",`${Math.round(p.left-l)}px`),t.style.setProperty("--spot-top",`${Math.round(p.top-l)}px`),t.style.setProperty("--spot-w",`${Math.round(p.width+l*2)}px`),t.style.setProperty("--spot-h",`${Math.round(p.height+l*2)}px`),t.classList.toggle("pill-below",p.top<110),i&&(i.textContent=a||"👇 Bấm"),t.classList.remove("hidden")}function Ws(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function ii(e,t){if(Ws())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function oi(e,t){if(Ws())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function Lt(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const i=!!document.querySelector("dialog[open]"),s=e.manageMenuOpen||e.weatherPopoverOpen,n=e.sim.getCurrentTutorialStep();if(e.photoModeActive||i||s||!n){ii(e,t),xs(e);return}e.sim.state.tutorial&&typeof e.sim.state.tutorial.minimized=="boolean"&&(e.tutorialMinimized=e.sim.state.tutorial.minimized);const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",a),t.classList.toggle("is-minimized",e.tutorialMinimized);const p=e.sim.getReadyOwlOrdersCount(),o=`${n.index}:${n.id}:${e.tutorialMinimized?1:0}:${a?1:0}:${p}`;if(e.lastRenderedTutorialSig!==o){e.lastRenderedTutorialSig=o;const d=ds.map(v=>`<span class="tutorial-step-dot ${v.index<n.index?"done":v.index===n.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${n.pose}.webp" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${b(n.title)}</h2>
            </div>
            <button id="btnTutorialExpand" type="button" data-tutorial-focus class="brass-btn gold-cta">Mở</button>
            <button
              id="btnTutorialSkipMini"
              type="button"
              popovertarget="tutorialCoachCard"
              popovertargetaction="hide"
              class="brass-btn tutorial-skip-btn"
              aria-label="Bỏ qua hướng dẫn"
            >✕</button>
          </div>
        `;else{const v=n.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">5 Môn</button>':n.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${p>0?"Xây":"Đơn Cú"}</button>`:"",h=n.id==="build_and_owl_order"?p>0?"Giao đơn":"Xây dựng":n.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <img src="/trang-trai-hang-soc/sprites/${n.pose}.webp" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${ds.length}"
              aria-valuenow="${n.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${d}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">${b(n.speakerName)}</div>
              <div class="tutorial-top-controls">
                <button
                  id="btnTutorialMinimize"
                  type="button"
                  class="tutorial-ghost-btn"
                  aria-label="Thu gọn bảng hướng dẫn"
                >▾</button>
                <button
                  id="btnTutorialSkip"
                  type="button"
                  popovertarget="tutorialCoachCard"
                  popovertargetaction="hide"
                  class="tutorial-ghost-btn tutorial-skip-btn"
                  aria-label="Bỏ qua hướng dẫn"
                >✕</button>
              </div>
            </div>
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${b(n.title)}</h2>
            <div class="tutorial-hint-strip">${b(n.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">Thưởng: ${b(n.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${v}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${b(h)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),Lt(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),Lt(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{ri(e,n.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{n.id==="earn_magic_star"?e.openPuzzleArcadeDialog():n.id==="build_and_owl_order"&&(p>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}oi(e,t);const l=`${n.index}:${n.id}`;e.lastFocusedTutorialStepKey!==l&&(e.lastFocusedTutorialStepKey=l,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),xs(e)}function ri(e,t){if(t==="harvest_wheat"){const i=e.sim.getTutorialWorldTarget();if(i)e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),ft(e),e.sim.onBuildingTactile?.(i.uid),Lt(e),e.showToast("Chạm vào ô Lúa Mì chín vàng để gặt!","🌾");else{const s=Y("farmland_plot");s&&(e.selectedCatalogItem=s,e.refreshAll())}return}if(t==="sow_and_merge_plot"){ft(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){const i=Date.now();if(e.sim.state.buildings.some(n=>Y(n.itemId)?.isAnimalPasturePlot&&n.pastureAnimalId&&n.pastureReadyAt&&i>=n.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3){const n=e.sim.getTutorialWorldTarget();e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),ft(e),n&&e.sim.onBuildingTactile?.(n.uid),Lt(e),e.showToast("Chạm vào ô Đồng Cỏ có trứng để thu hoạch!","🥚")}else ft(e),e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}export{Ut as $,Oe as A,fn as B,hn as C,Es as D,$i as E,wi as F,Hs as G,Sn as H,Ti as I,fi as J,Me as K,Ci as L,Is as M,qn as N,Qe as O,ki as P,En as Q,lt as R,Mi as S,Hn as T,Li as U,Ds as V,rt as W,xn as X,kn as Y,Mn as Z,Ln as _,Cn as a,An as a0,xi as a1,Z as a2,Hi as a3,Qn as a4,zs as a5,ke as a6,fe as a7,Ts as a8,Ai as a9,ae as aa,he as ab,Bi as ac,ai as ad,Ii as ae,pe as af,ft as ag,ni as ah,xs as ai,ii as aj,oi as ak,Lt as al,ri as am,js as an,Xe as ao,hi as b,ie as c,ei as d,b as e,qi as f,Ei as g,Tn as h,jn as i,ti as j,si as k,ui as l,as as m,Ye as n,Mt as o,yi as p,Pi as q,Jn as r,vi as s,Xt as t,vn as u,Si as v,At as w,Rs as x,wn as y,pt as z};

import{l as Lt,m as Fs,n as Vs,o as Ft,p as Me,q as _s,t as Gs,k as zs,u as gs,v as Us,g as ut,i as js,w as qe,x as Yt,f as Ws,y as Ks,z as ms,A as bs}from"./hpvn-platform-B1Lovr2y.js";import{g as Y,G as ot,h as me,F as he,P as Le,A as vt,as as Vt,y as we,n as Ie,Z as je,j as _t,f as Fe,a4 as Qs,J as ve,z as Xs,I as ct,a as ce,i as Zt,E as Ys,at as At,ap as Zs,aq as Js,b as Ee,R as ea,ab as Pt,X as ta,B as sa,$ as aa,a3 as us,U as na,V as oa,_ as dt,a5 as ia,H as De,S as la,au as ra,av as ca,T as Jt}from"./game-data-D8DCwVFZ.js";import{aP as be,aQ as it,aR as Xe,aS as da,F as vs,aT as pa,aU as ga,D as es,aV as ma,aH as wt,aW as Tt,aX as Re,aG as ba,aY as ua,am as ts,A as qt,aZ as va,a_ as Ve,z as Se,x as ya,a$ as fa,b0 as pt,b1 as ha,a9 as _e,B as Ye,b2 as tt,d as Sa,b3 as Ct,b4 as $a,b5 as wa,a0 as Ta,ac as Ca,b6 as xa,b7 as ka}from"./sim-foundation-D_to9JYB.js";import{F as Qe,M as lt,a as Ma,g as La,p as Aa,e as He,f as yt,j as Pa,n as ys,V as qa}from"./sim-data-sJORUPPs.js";import{b3 as Oe,b4 as Ea,V as Ha,b5 as Ba,S as Ia}from"./sim-world-CxyDAPsX.js";import{S as Da,e as Ra,P as ss,M as as,C as Oa,s as ns}from"./sim-core-CKftJd6j.js";import{t as Na}from"./engine-DcAvTM9L.js";function m(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const gt=["path","shop","creature","decor"];function Fa(e){return e.isZooFence||e.id==="burrow_stone_rune_fence"||e.id==="halloween_arch"||e.id==="hogsmeade_stone_bridge"||e.id==="floo_fireplace_gate"?"fences":e.isBench||e.id==="floating_candles_post"||e.id==="patronus_ward_lantern"?"lights":e.isFarmlandPlot||e.connectableGroup||e.id==="burrow_apple_orchard"||e.id==="whomping_willow"||e.id==="burrow_oak_tree"||e.id==="burrow_pine_tree"||e.id==="burrow_magic_tree"?"nature":"landmarks"}const Va=new Set(["path_cobble","path_snow_brick","path_wood_pier","marble_bench","floating_candles_post","patronus_ward_lantern","burrow_stone_rune_fence"]);function ke(e){return!!e.yuleCollection||e.id.startsWith("yule_")||e.id==="snowy_pines"}function fs(e){return e.spriteKey?`/trang-trai-hang-soc/sprites/${e.spriteKey}.webp`:Va.has(e.id)?`/trang-trai-hang-soc/paintings/catalog/${e.id}.webp`:null}function ne(e){e.selectedCatalogItem=null,e.moveModeActive=!1,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=null,e.bulldozerActive=!1,e.pincerActive=!1,e.pincerPicked=null,e.pendingTouchTile=null,e.onBuildStateReset?.()}const _a=12;function Hn(){return[]}function Bn(e,t){return[t,...e.filter(a=>a!==t)].slice(0,_a)}const Ze=[{mode:"none",label:"Nhiệt"},{mode:"cleanliness",label:"Vệ Sinh"},{mode:"wonder",label:"Kỳ Diệu"},{mode:"biome",label:"Sinh Thái"}],Ga=[".aaa-codex-scroll",".feast-tier-list",".nb-log-list"];function We(e){if(!e)return{boxTop:0,parentTop:0,dialogTop:0,innerScrollTops:[]};const t=e.parentElement,o=e.closest("dialog"),a=[];for(const n of Ga){const s=e.querySelector(n);s&&s.scrollTop>0&&a.push({selector:n,top:s.scrollTop})}return{boxTop:e.scrollTop,parentTop:t?t.scrollTop:0,dialogTop:o?o.scrollTop:0,innerScrollTops:a}}function Ke(e,t,o=!1){if(!e)return;const a=e.parentElement,n=e.closest("dialog");if(o){e.scrollTop=0,a&&(a.scrollTop=0),n&&(n.scrollTop=0);return}t.boxTop>0&&(e.scrollTop=t.boxTop),a&&t.parentTop>0&&(a.scrollTop=t.parentTop),n&&t.dialogTop>0&&(n.scrollTop=t.dialogTop);for(const s of t.innerScrollTops){const g=e.querySelector(s.selector);g&&(g.scrollTop=s.top)}}function In(e){const t=document.createElement("div");t.className="hud-shell-root",t.innerHTML=`
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
            <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 7.777 Màn (Phím J)">
              Bùa Gặt <small id="lblMatch3Lv" class="sr-only-hud">1/7777</small>
            </button>
            <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Dò Mìn Phép Thuật (Phím K)">
              Dò Mìn <small id="lblArcadeTowerLv" class="sr-only-hud">0/3885</small>
            </button>
            <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" aria-label="Số Học Huyền Bí">Số Học</button>
            <button type="button" data-switch-minigame="blocks" class="hg-game-pill" aria-label="Sinh Vật Huyền Bí">Sinh Vật</button>
            <button type="button" data-switch-minigame="jigsaw" class="hg-game-pill" aria-label="Tranh Ghép Phép Thuật">Tranh Ghép</button>
            <button type="button" data-switch-minigame="chess" class="hg-game-pill" aria-label="Bắn Cá Hồ Đen">Bắn Cá</button>
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

    `,e.root.appendChild(t),e.minimapCanvas=e.root.querySelector("#minimapCanvas")}function Dn(e){const t=()=>{e.openLastPlayedMinigame()};e.root.querySelectorAll("[data-switch-minigame]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.switchMinigame;e.closeHudPopovers(),!u||u==="match3"?e.openMatch3Dialog():u==="seedquiz"?e.openSeedQuizDialog():e.openPuzzleArcadeDialog(u)})});const o=()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog")?.showModal()};e.root.querySelector("#btnCornerPlayPuzzle")?.addEventListener("click",t),e.root.querySelector("#chipHudSickle")?.addEventListener("click",o),e.root.querySelector("#xpBarShell")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog")?.showModal()}),e.root.querySelector("#btnOpenMenuSeedQuiz")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSeedQuizDialog(void 0,null,void 0,void 0,void 0,"codex")});const a=l=>{l?.stopPropagation(),e.closeHudPopovers(),e.openWorkshopDialog("barn")};e.root.querySelector("#btnOpenSeedSilo")?.addEventListener("click",l=>{l.stopPropagation(),e.closeHudPopovers(),e.toggleSeedTray()}),e.root.querySelector("#btnOpenPastureTray")?.addEventListener("click",l=>{l.stopPropagation(),e.closeHudPopovers(),e.togglePastureTray()}),e.root.querySelector("#btnOpenStorageBarn")?.addEventListener("click",a),e.root.querySelector("#chipHudBarn")?.addEventListener("click",a),e.root.querySelector("#btnHappySmiley")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnToggleBuildDock")?.addEventListener("click",()=>{if(e.closeHudPopovers(),e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive)e.collapseBuildDock(),ne(e);else{const u=e.selectedCatalogItem,b=!!(u&&ke(u)),w=u?.category;e.closeSeedTray(),e.closePastureTray(),ne(e),e.inspectSelection=null,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=b,e.activeCategory=b?"decor":w&&gt.includes(w)?w:"shop"}e.refreshAll()}),e.root.querySelector("#btnToggleMinimapHud")?.addEventListener("click",()=>{e.closeHudPopovers(),e.minimapHudVisible=!e.minimapHudVisible,e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.minimapHudVisible&&(e.minimapCollapsed=!1,e.minimapCanvas.classList.remove("hidden")),e.refreshDock()}),e.root.querySelector("#btnToggleQuestTrackerHud")?.addEventListener("click",()=>{e.closeHudPopovers();const l=e.root.querySelector("#questTrackerPanel");l?.classList.toggle("hidden"),e.root.querySelector("#btnToggleQuestTrackerHud")?.setAttribute("aria-pressed",String(!!l&&!l.classList.contains("hidden")))}),e.root.querySelector("#btnHudActiveBuilds")?.addEventListener("click",()=>{e.closeHudPopovers();const l=e.sim.getActiveConstructions(Date.now());if(l.length===0)return;e.activeBuildCycleIdx=(e.activeBuildCycleIdx+1)%l.length;const u=l[e.activeBuildCycleIdx],b=Y(u.itemId),w=u.gx+(b?.width??1)*.5,k=u.gy+(b?.height??1)*.5;ne(e),e.onFocusGridSmooth?e.onFocusGridSmooth(w,k,Math.max(e.cam.zoom,.95)):be(e.cam,w,k),e.inspectSelection={kind:"building",uid:u.uid},e.renderInspector()}),e.root.querySelector("#btnToggleManageMenu")?.addEventListener("click",l=>{l.stopPropagation(),e.toggleManagePopover()}),e.root.querySelector("#btnToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnManageToggleHudRollup")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#btnHudRoundOrb")?.addEventListener("click",()=>{e.toggleHudRollup()}),e.root.querySelector("#lblClock")?.addEventListener("click",l=>{l.stopPropagation(),e.toggleWeatherPopover()});const n=()=>{if(e.closeHudPopovers(),e.sim.isLayoutEditModeActive()){const l=e.sim.commitLayoutEditMode();ne(e),e.showToast(l.msg,"🔨")}else{const l=e.sim.enterLayoutEditMode();l.ok&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0),e.showToast(l.msg,l.ok?"🔨":"⚠️")}e.refreshAll()};e.root.querySelector("#btnToggleLayoutEdit")?.addEventListener("click",n),e.root.querySelector("#btnMenuLayoutEdit")?.addEventListener("click",n),e.root.querySelector("#btnMenuStrollMode")?.addEventListener("click",()=>{e.closeHudPopovers(),ne(e);const l=e.sim.toggleStrollMode();e.showToast(l.msg,"🧙"),e.refreshAll()}),e.root.querySelector("#btnEditCommit")?.addEventListener("click",()=>{const l=e.sim.commitLayoutEditMode();ne(e),e.showToast(l.msg,"🔨"),e.refreshAll()}),e.root.querySelector("#btnEditCancel")?.addEventListener("click",()=>{const l=e.sim.cancelLayoutEditMode();ne(e),e.showToast(l.msg,"↩"),e.refreshAll()}),e.root.querySelector("#btnEditStashAll")?.addEventListener("click",()=>{const l=e.sim.stashAllDecorItems();e.showToast(l.msg,l.ok?"📦":"⚠️"),e.refreshAll()}),e.root.querySelector("#btnEditRestoreAll")?.addEventListener("click",()=>{const l=e.sim.restoreAllStashedDecor();e.showToast(l.msg,l.ok?"🌸":"⚠️"),e.refreshAll()}),e.root.querySelectorAll("[data-edit-preset]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.editPreset;if(e.sim.activePresetSlot=u,e.sim.state.layoutPresets?.[u]){const b=e.sim.applyLayoutPreset(u);e.showToast(b.msg,b.ok?"🔨":"⚠️")}else{const b=e.sim.saveLayoutPreset(u);e.showToast(`Đã lưu "${b.label}" (${b.placements.length} công trình)!`,"🔨")}e.refreshAll()})}),e.root.querySelector("#btnEditSavePreset")?.addEventListener("click",()=>{const l=e.sim.activePresetSlot||"layout_1",u=e.sim.saveLayoutPreset(l);e.showToast(`Đã cập nhật "${u.label}" (${u.placements.length} công trình)!`,"🔨"),e.refreshAll()});const s=e.root.querySelector("#secondaryMapToolsBar");if(s&&typeof HTMLElement<"u"&&!("focusGroup"in HTMLElement.prototype)){const l=Array.from(s.querySelectorAll("button"));l.forEach((u,b)=>{u.tabIndex=b===0?0:-1}),s.addEventListener("focusin",({target:u})=>{u instanceof HTMLButtonElement&&l.includes(u)&&l.forEach(b=>{b.tabIndex=b===u?0:-1})}),s.addEventListener("keydown",u=>{if(l.length===0)return;const b=Math.max(0,l.findIndex(I=>I===document.activeElement)),w=typeof getComputedStyle=="function"&&getComputedStyle(s).direction==="rtl";let k=-1;u.key==="ArrowRight"?k=(b+(w?-1:1)+l.length)%l.length:u.key==="ArrowLeft"?k=(b+(w?1:-1)+l.length)%l.length:u.key==="Home"?k=0:u.key==="End"&&(k=l.length-1),k>=0&&(u.preventDefault(),l[k]?.focus())})}const g=l=>{const u=e.root.querySelector("#buildDrawer");if(!u)return;const b=Math.max(180,Math.round(u.clientWidth*.68))*l,w=typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;u.scrollBy({left:b,behavior:w?"auto":"smooth"})};e.root.querySelector("#btnDrawerScrollPrev")?.addEventListener("click",()=>{g(-1)}),e.root.querySelector("#btnDrawerScrollNext")?.addEventListener("click",()=>{g(1)});const i=(l,u)=>{l?.addEventListener("wheel",b=>{const w=u?l.querySelector(u):l;w&&w.scrollWidth>w.clientWidth+4&&Math.abs(b.deltaY)>Math.abs(b.deltaX)&&b.deltaY!==0&&(w.scrollLeft+=b.deltaY,b.preventDefault())},{passive:!1})};i(e.root.querySelector("#buildDrawer")),i(e.root.querySelector("#decorCollectionFilterBar")),i(e.root.querySelector("#seedBrushTray"),".seed-tray-scroll"),i(e.root.querySelector("#pastureBrushTray"),".seed-tray-scroll"),window.addEventListener("pointerdown",l=>{if(!e.manageMenuOpen&&!e.weatherPopoverOpen)return;const u=l.target;if(!u)return;const b=e.root.querySelector("#managePopoverMenu"),w=e.root.querySelector("#weatherPopoverMenu"),k=e.root.querySelector("#btnToggleManageMenu"),I=e.root.querySelector("#lblClock");b?.contains(u)||w?.contains(u)||k?.contains(u)||I?.contains(u)||e.closeHudPopovers()}),window.addEventListener("resize",()=>{e.manageMenuOpen?e.positionFloatingPopover(e.root.querySelector("#btnToggleManageMenu"),e.root.querySelector("#managePopoverMenu")):e.weatherPopoverOpen&&e.positionFloatingPopover(e.root.querySelector("#lblClock"),e.root.querySelector("#weatherPopoverMenu"))}),e.root.querySelector("#btnCloseManageMenu")?.addEventListener("click",()=>e.closeHudPopovers()),e.root.querySelector("#btnAccioAll")?.addEventListener("click",()=>{e.closeHudPopovers(),e.sim.castAccioHarvestAll()}),e.root.querySelector("#btnOpenWorkshop")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openWorkshopDialog()}),e.root.querySelector("#btnOpenSuitcase")?.addEventListener("click",()=>{e.closeHudPopovers(),e.openSuitcaseDialog()}),e.root.querySelector("#btnOpenQuests")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()}),e.root.querySelector("#yuleEventBanner")?.addEventListener("click",()=>{e.activeQuestTab="quests",e.closeHudPopovers(),e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()});const r=()=>{e.openNeighborDialog()};e.root.querySelector("#btnOpenNeighbors")?.addEventListener("click",r),e.root.querySelector("#btnManageOpenNeighbors")?.addEventListener("click",r);const p=()=>{e.openHarvestFeastDialog()};e.root.querySelector("#btnOpenHarvestFeast")?.addEventListener("click",p),e.root.querySelector("#btnManageOpenFeast")?.addEventListener("click",p),e.root.querySelector("#ribbonUnveilToastCard")?.addEventListener("click",()=>{const l=e.root.querySelector("#ribbonUnveilToastCard");l&&l.classList.add("hidden"),e.ribbonBannerTimer&&(window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=0)});const y=()=>{e.closeHudPopovers(),e.renderRoadmapDialog(),e.root.querySelector("#roadmapDialog").showModal()};e.root.querySelector("#btnOpenRoadmap")?.addEventListener("click",y),e.root.querySelector("#btnOpenZones")?.addEventListener("click",y),e.root.querySelector("#btnOpenWorldMap")?.addEventListener("click",y),e.root.querySelector("#btnOpenFinance")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderFinanceDialog(),e.root.querySelector("#financeDialog").showModal()}),e.root.querySelector("#btnOpenAlbum")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderAlbumDialog(),e.root.querySelector("#albumDialog").showModal()}),e.root.querySelector("#btnCycleHeatmap")?.addEventListener("click",()=>{const l=Ze.findIndex(k=>k.mode===e.sim.heatmapMode),u=Ze[(l+1)%Ze.length];e.sim.heatmapMode=u.mode;const b=e.root.querySelector("#btnCycleHeatmap"),w=u.mode!=="none";b.textContent=u.label,b.setAttribute("data-active",String(w)),b.setAttribute("aria-pressed",String(w)),w&&e.showToast(`Đã bật ${u.label}!`,"🌡️")}),e.root.querySelector("#btnPhotoMode")?.addEventListener("click",()=>{e.closeHudPopovers(),e.togglePhotoMode(!0)}),e.root.querySelector("#btnExitPhoto")?.addEventListener("click",()=>{e.togglePhotoMode(!1)}),e.root.querySelector("#btnSavePhotoPng")?.addEventListener("click",l=>{const u=l.currentTarget;u.disabled||(u.disabled=!0,Lt(e.gameCanvas,`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`).then(()=>e.showToast("Ảnh đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🔥")).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{u.disabled=!1}))}),e.root.querySelector("#btnSaveYulePostcard")?.addEventListener("click",l=>{const u=l.currentTarget;if(u.disabled)return;const b=e.gameCanvas,w=document.getElementById("gpuWorldCanvas"),k=document.createElement("canvas");k.width=Math.max(640,b.width),k.height=Math.max(360,b.height);const I=k.getContext("2d");if(!I)return;w&&w.style.display!=="none"&&w.width>0&&w.height>0&&I.drawImage(w,0,0,k.width,k.height),I.drawImage(b,0,0,k.width,k.height);const E=Math.max(640,k.width),R=Math.max(360,k.height),d=document.createElement("canvas");d.width=E,d.height=R;const c=d.getContext("2d");if(!c)return;c.drawImage(k,0,0,E,R);const T=Math.max(18,Math.round(Math.min(E,R)*.032));c.save(),c.strokeStyle="#14532d",c.lineWidth=T*1.15,c.strokeRect(T*.5,T*.5,E-T,R-T),c.strokeStyle="#f59e0b",c.lineWidth=Math.max(3,T*.18),c.strokeRect(T*.92,T*.92,E-T*1.84,R-T*1.84);const S=["#ef4444","#fbbf24","#34d399","#38bdf8"],$=Math.max(44,Math.round(E/18));for(let O=T*2,V=0;O<=E-T*2;O+=$,V++){const v=S[V%S.length];c.fillStyle=v,c.beginPath(),c.arc(O,T*.92,Math.max(4,T*.24),0,Math.PI*2),c.fill()}const f=Math.min(E-T*4,Math.max(360,Math.round(E*.62))),h=Math.max(44,Math.round(R*.078)),M=Math.round((E-f)*.5),A=R-T*1.4-h;c.fillStyle="rgba(20, 42, 32, 0.9)",c.strokeStyle="#fbbf24",c.lineWidth=2.5,c.beginPath(),c.roundRect(M,A,f,h,14),c.fill(),c.stroke();const H=Math.max(15,Math.round(h*.42));c.font=`700 ${H}px "Be Vietnam Pro", system-ui, sans-serif`,c.fillStyle="#fef3c7",c.textAlign="center",c.textBaseline="middle",c.fillText(`🎄 Giáng Sinh An Lành • ${e.sim.state.parkName} (Cấp ${e.sim.state.level}) ✨`,E*.5,A+h*.52),c.restore(),u.disabled=!0,Lt(d,`Thiệp Giáng Sinh từ ${e.sim.state.parkName}, cấp ${e.sim.state.level}!`).then(()=>{e.sim.recordFlooShareOrPostcard?.("postcard"),e.showToast("Thiệp đã nằm trong khung Floo, bấm gửi khi bạn muốn.","🎄")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{u.disabled=!1})}),e.root.querySelector("#btnOpenSettings")?.addEventListener("click",()=>{e.closeHudPopovers(),e.renderSettingsDialog(),e.root.querySelector("#settingsDialog").showModal()}),e.root.querySelector("#btnToggleQuestCollapse")?.addEventListener("click",l=>{e.questCollapsed=!e.questCollapsed,e.root.querySelector("#questTrackerBody").classList.toggle("hidden",e.questCollapsed);const b=l.currentTarget;b.textContent=e.questCollapsed?"+":"–",b.setAttribute("aria-expanded",String(!e.questCollapsed))}),e.root.querySelector("#btnToggleMinimap")?.addEventListener("click",l=>{e.minimapCollapsed=!e.minimapCollapsed,e.minimapCanvas.classList.toggle("hidden",e.minimapCollapsed);const u=l.currentTarget;u.textContent=e.minimapCollapsed?"+":"–",u.setAttribute("aria-expanded",String(!e.minimapCollapsed))}),e.root.querySelector("#btnFloatingAutoPlace")?.addEventListener("click",()=>{e.onAutoPlaceSelected?.()}),e.root.querySelector("#btnFloatingSecondary")?.addEventListener("click",()=>{if(e.rideCamUid)it(e.cam,1),e.refreshDock(),e.showToast(`Đã xoay góc nhìn bản đồ sang ${Xe[e.cam.viewRot??0]}!`,"🧭");else if(e.sim.strollModeActive){const l=e.sim.castStrollCareWave();l.msg&&e.showToast(l.msg,"🪄"),e.refreshAll()}else e.moveModeActive&&e.movingBuildingUid||e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory?e.triggerRotateAction():e.activeSeedCropId&&!e.seedTrayOpen?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&!e.pastureTrayOpen&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingSwap")?.addEventListener("click",()=>{if(e.sim.strollModeActive&&!e.selectedCatalogItem){const l=e.sim.cycleStrollRobe();e.showToast(l.msg,"✨"),e.refreshAll();return}if(e.selectedCatalogItem){const l=e.selectedCatalogItem,u=ke(l),b=l.category;ne(e),e.buildSheetOpen=!0,e.mapToolsExpanded=!0,e.christmasTabActive=u,e.activeCategory=u?"decor":gt.includes(b)?b:"shop",e.refreshAll()}else e.activeSeedCropId?e.openSeedTray(e.activeSeedCropId):e.activePastureAnimalId&&e.openPastureTray(e.activePastureAnimalId)}),e.root.querySelector("#btnFloatingExit")?.addEventListener("click",()=>{e.rideCamUid?(e.rideCamUid=null,e.refreshFloatingBanner()):e.pincerActive||e.moveModeActive||e.bulldozerActive||e.selectedCatalogItem?(ne(e),e.refreshAll()):e.activeSeedCropId||e.seedTrayOpen?(e.closeSeedTray(),e.refreshAll()):e.activePastureAnimalId||e.pastureTrayOpen?(e.closePastureTray(),e.refreshAll()):e.sim.strollModeActive?(e.sim.toggleStrollMode(!1),e.refreshAll()):e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1,e.sim.saveToStorage(),e.refreshAll())}),e.root.querySelector("#btnTouchConfirmOk")?.addEventListener("click",()=>{e.onTouchConfirmPlace?.()}),e.root.querySelector("#btnTouchRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnTouchStash")?.addEventListener("click",()=>{e.onTouchStashActiveBuilding?.()}),e.root.querySelector("#btnTouchCancel")?.addEventListener("click",()=>{if(e.moveModeActive&&e.moveKeepActiveAfterDrop&&e.movingBuildingUid){e.movingBuildingUid=null,e.pendingTouchTile=null,e.onTouchCancelPlace?.(),e.refreshAll();return}ne(e),e.onTouchCancelPlace?.(),e.refreshAll()});const C=l=>{const u=e.minimapCanvas.getBoundingClientRect(),b=(l.clientX-u.left)/u.width*e.minimapCanvas.width,w=(l.clientY-u.top)/u.height*e.minimapCanvas.height,k=e.minimapCanvas.width*.46/ot,I=e.minimapCanvas.height*.44/ot,E=(b-e.minimapCanvas.width*.5)/k,R=(w-8)/I,d=(E+R)*.5,c=(R-E)*.5,{fgx:T,fgy:S}=da(d,c,e.cam.viewRot??0),$=Math.max(0,Math.min(ot-1,T)),f=Math.max(0,Math.min(ot-1,S));e.rideCamUid=null,be(e.cam,$,f)};let L=!1;e.minimapCanvas.addEventListener("pointerdown",l=>{L=!0,C(l)}),window.addEventListener("pointermove",l=>{L&&C(l)}),window.addEventListener("pointerup",()=>{L=!1}),e.root.querySelectorAll("[data-cat]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.cat;if(!gt.includes(u))return;const b=e.activeCategory===u&&!(u==="decor"&&e.christmasTabActive);ne(e),e.inspectSelection=null,e.christmasTabActive=!1,b?e.activeCategory=null:(e.activeCategory=u,e.buildSheetOpen=!0,e.mapToolsExpanded=!0,u==="decor"&&!["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)&&(e.activeDecorFilter="all")),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelectorAll("[data-decor-event]").forEach(l=>{l.addEventListener("click",()=>{const u=e.activeCategory==="decor"&&e.christmasTabActive;ne(e),e.inspectSelection=null,u?(e.activeCategory=null,e.christmasTabActive=!1):(e.activeCategory="decor",e.christmasTabActive=!0,e.buildSheetOpen=!0,e.mapToolsExpanded=!0),e.refreshDock(),e.refreshFloatingBanner(),e.refreshTouchConfirmBar()})}),e.root.querySelector("#btnMoveTool")?.addEventListener("click",()=>{const l=!e.moveModeActive;ne(e),l&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("Chế độ Di Dời liên hoàn: Chạm từng công trình để dời chỗ (0 Sickle)!","✋")),e.refreshAll()}),e.root.querySelector("#btnRotate")?.addEventListener("click",()=>{e.triggerRotateAction()}),e.root.querySelector("#btnBulldoze")?.addEventListener("click",()=>{const l=!e.bulldozerActive;ne(e),l&&(e.bulldozerActive=!0,e.inspectSelection=null,e.collapseBuildDock(),e.showToast("🧹 Chế độ Xóa: Kéo lướt để xóa đường/rào hoặc chạm công trình cần dọn!","🧹")),e.refreshAll()}),e.root.querySelector("#btnBuildUndo")?.addEventListener("click",l=>{if(l.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể hoàn tác thao tác của bạn bè!","🏡");return}const b=e.sim.undoBuild();e.showToast(b?"↶ Đã hoàn tác thao tác xây dựng gần nhất.":"Không có thao tác nào để hoàn tác.","↶"),e.refreshAll()}),e.root.querySelector("#btnBuildRedo")?.addEventListener("click",l=>{if(l.currentTarget?.getAttribute("aria-disabled")==="true")return;if(e.sim.isVisitingNeighbor){e.showToast("Chế độ Khách Tham Quan — không thể làm lại thao tác của bạn bè!","🏡");return}const b=e.sim.redoBuild();e.showToast(b?"↷ Đã làm lại thao tác xây dựng.":"Không có thao tác nào để làm lại.","↷"),e.refreshAll()}),e.root.querySelector("#btnBuildDone")?.addEventListener("click",()=>{e.collapseBuildDock(),ne(e),e.refreshAll()}),e.root.querySelector("#btnMenuRotateCam")?.addEventListener("click",()=>{it(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn bản đồ: ${Xe[e.cam.viewRot??0]} (Phím Q/E)`,"🧭")}),e.root.querySelector("#btnMenuCutaway")?.addEventListener("click",()=>{e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.closeHudPopovers(),e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường khuất phía sau!":"Đã tắt chế độ Nhìn Xuyên Nhà Cao","👁️")}),e.root.querySelector("#btnMenuGrid")?.addEventListener("click",()=>{e.sim.state.settings.showGrid=!e.sim.state.settings.showGrid,e.sim.saveToStorage(),e.closeHudPopovers(),e.refreshAll()}),window.addEventListener("keydown",l=>{if(!(e.root.querySelector("dialog[open]")||document.querySelector("dialog[open]"))&&!(l.target instanceof HTMLInputElement||l.target instanceof HTMLTextAreaElement||l.target instanceof HTMLSelectElement||l.target instanceof HTMLElement&&(l.target.isContentEditable||l.target.classList.contains("drag-handle")||l.target.closest('button, a, summary, [role="button"], [popover]')))){if(l.ctrlKey||l.metaKey||l.altKey){(l.ctrlKey||l.metaKey)&&(l.key==="z"||l.key==="Z")?(l.preventDefault(),l.shiftKey?e.sim.redoBuild():e.sim.undoBuild(),e.refreshAll()):(l.ctrlKey||l.metaKey)&&(l.key==="y"||l.key==="Y")&&(l.preventDefault(),e.sim.redoBuild(),e.refreshAll());return}if(l.key==="n"||l.key==="N")e.openNeighborDialog();else if(l.key==="r"||l.key==="R"){if(e.sim.isVisitingNeighbor)return;e.triggerRotateAction()}else if(l.key==="q"||l.key==="Q")it(e.cam,-1),e.refreshDock(),e.showToast(`Góc nhìn: ${Xe[e.cam.viewRot??0]}`,"🧭");else if(l.key==="e"||l.key==="E")it(e.cam,1),e.refreshDock(),e.showToast(`Góc nhìn: ${Xe[e.cam.viewRot??0]}`,"🧭");else if(l.key==="v"||l.key==="V")e.sim.state.settings.cutawayMode=!e.sim.state.settings.cutawayMode,e.refreshAll(),e.showToast(e.sim.state.settings.cutawayMode?"Bật Nhìn Xuyên Nhà Cao (V)":"Tắt Nhìn Xuyên Nhà Cao","👁️");else if(l.key==="m"||l.key==="M"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!","🏡");return}const u=!e.moveModeActive;ne(e),u&&(e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock(),e.showToast("✋ Chạm chọn từng công trình để di dời liên hoàn (0 Sickle)!","✋")),e.refreshAll()}else if(l.key==="b"||l.key==="B"){if(e.sim.isVisitingNeighbor||e.sim.isHeadmasterPreview){e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!","🧳");return}e.openSuitcaseDialog()}else if(l.key==="j"||l.key==="J")e.openMatch3Dialog();else if(l.key==="k"||l.key==="K")e.openPuzzleArcadeDialog();else if(l.key==="l"||l.key==="L")e.openLeaderboardDialog();else if(l.key==="h"||l.key==="H")e.toggleHudRollup();else if(l.key==="p"||l.key==="P")e.togglePhotoMode();else if(l.key==="x"||l.key==="X"){if(e.sim.isVisitingNeighbor){e.showToast("Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!","🏡");return}const u=!e.bulldozerActive;ne(e),u&&(e.bulldozerActive=!0,e.inspectSelection=null,e.closeSeedTray(),e.collapseBuildDock()),e.refreshAll()}else if(l.key==="Escape"){if(e.sim.pendingBuildStroke&&e.sim.cancelBuildStroke(),e.manageMenuOpen||e.weatherPopoverOpen){e.closeHudPopovers();return}if(e.photoModeActive){e.togglePhotoMode(!1);return}if(e.sim.isVisitingNeighbor){e.exitVisitFromHud();return}e.rideCamUid=null,ne(e),e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.inspectSelection=null,e.sim.state.settings.cutawayMode&&(e.sim.state.settings.cutawayMode=!1),e.refreshAll()}else l.key===" "&&(e.rideCamUid=null,be(e.cam,18,24.5),e.refreshFloatingBanner())}})}function Rn(e,t){e.photoModeActive=typeof t=="boolean"?t:!e.photoModeActive,typeof document<"u"&&(document.body.dataset.photoMode=e.photoModeActive?"true":"false");const o=e.sim.isVisitingNeighbor;e.root.querySelector("#hudFrameTop").classList.toggle("hidden",e.photoModeActive),e.root.querySelector("#bottomDockWrap").classList.toggle("hidden",e.photoModeActive||o),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||o);const a=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,n=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||o||a||n),e.root.querySelector("#visitorDockBar")?.classList.toggle("hidden",e.photoModeActive||!o),e.root.querySelector("#inspectorPanel")?.classList.toggle("hidden",e.photoModeActive||!e.inspectSelection),e.root.querySelector("#minimapWrap").classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible),e.root.querySelector("#btnToggleMinimapHud")?.setAttribute("aria-pressed",String(e.minimapHudVisible)),e.root.querySelector("#photoModeBar").classList.toggle("hidden",!e.photoModeActive),ws(e),Ts(e),St(e),e.renderTutorialCoach()}function za(e){return e.photoModeActive?!1:!!e.inspectSelection||e.seedTrayOpen&&!!e.pendingSowPlotUid||e.pastureTrayOpen&&!!e.pendingStockPastureUid}function On(e,t){e.hudRolledUp=t!==void 0?t:!e.hudRolledUp,e.hudRolledUp&&(st(e),Be(e),e.closeSeedTray(),e.closePastureTray()),St(e)}function St(e){const t=e.root.querySelector(".hud-shell-root");if(!t)return;const o=za(e),a=e.hudRolledUp&&!e.photoModeActive&&!o,n=e.sim.isVisitingNeighbor,s=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,g=!e.photoModeActive&&!n&&(e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen);t.classList.toggle("hud-building-focus",o),t.classList.toggle("hud-compact-rolled",a),t.classList.toggle("hud-sheet-or-tray-open",g),e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||n||s||g);const i=e.root.querySelector("#btnToggleHudRollup");i&&(i.setAttribute("aria-pressed",String(e.hudRolledUp)),i.dataset.active=String(e.hudRolledUp),i.title=e.hudRolledUp?"Mở rộng lại các thanh HUD quanh màn hình (Phím H)":"Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)");const r=e.root.querySelector("#svgHudRollupChevron");r&&r.setAttribute("d",e.hudRolledUp?"M13.5 19.5 L18 24 L22.5 19.5":"M13.5 23 L18 18.5 L22.5 23");const p=e.root.querySelector("#btnManageToggleHudRollup");p&&(p.textContent=e.hudRolledUp?"Mở HUD":"Ẩn HUD",p.setAttribute("aria-pressed",String(e.hudRolledUp)));const y=e.root.querySelector("#btnHudRoundOrb");y&&(y.classList.toggle("hidden",!e.hudRolledUp||e.photoModeActive||o),y.setAttribute("aria-pressed",String(e.hudRolledUp)),y.dataset.rolled=String(e.hudRolledUp));const C=e.root.querySelector("#lblHudRoundOrbTag");C&&(C.textContent="Hiện HUD");const L=e.root.querySelector("#svgRoundOrbChevron");L&&L.setAttribute("d",e.hudRolledUp?"M16 19.8 L20 23.8 L24 19.8":"M16 23.2 L20 19.2 L24 23.2"),o&&(st(e),Be(e),e.root.querySelector("#bottomDockWrap")?.classList.remove("ts-dock-open"),e.root.querySelector("#buildDrawer")?.classList.add("hidden"),e.root.querySelector("#buildDrawerSwipeBar")?.classList.add("hidden"),e.root.querySelector("#decorCollectionFilterBar")?.classList.add("hidden"),e.root.querySelector("#secondaryMapToolsBar")?.classList.add("hidden"))}function st(e){const t=e.manageMenuOpen||e.weatherPopoverOpen;e.manageMenuOpen=!1,e.weatherPopoverOpen=!1;const o=e.root.querySelector("#managePopoverMenu"),a=e.root.querySelector("#weatherPopoverMenu"),n=e.root.querySelector("#btnToggleManageMenu"),s=e.root.querySelector("#lblClock");o?.classList.add("hidden"),a?.classList.add("hidden"),n&&(n.setAttribute("aria-expanded","false"),n.setAttribute("data-active","false")),s&&s.setAttribute("aria-expanded","false"),t&&e.renderTutorialCoach()}function Be(e){e.buildSheetOpen=!1,e.activeCategory=null,e.christmasTabActive=!1,e.mapToolsExpanded=!1}function Ua(e){return e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen}function ja(e){Be(e),e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.activeSeedCropId=null,e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.activePastureAnimalId=null}function hs(e,t,o){if(!t||!o)return;const a=t.getBoundingClientRect(),n=getComputedStyle(document.documentElement),s=b=>parseFloat(n.getPropertyValue(b))||0,g=Math.max(8,s("--host-inset-top")),i=Math.max(8,s("--host-inset-right")),r=Math.max(8,s("--host-inset-left")),p=Math.max(8,s("--host-inset-bottom"),s("--hpvn-safe-bottom"),s("--hpvn-dock")),y=Math.min(window.innerWidth-r-i,Math.max(248,o.offsetWidth||336)),C=Math.min(o.offsetHeight||420,window.innerHeight-g-p),L=a.left<window.innerWidth*.5?a.left:a.right-y,l=Math.max(r,Math.min(L,window.innerWidth-y-i)),u=Math.max(g,Math.min(a.bottom+8,window.innerHeight-p-C));o.style.left=`${Math.round(l)}px`,o.style.top=`${Math.round(u)}px`}function Nn(e,t){if(e.sim.isVisitingNeighbor){st(e),e.showToast("🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!","🦉");return}const o=typeof t=="boolean"?t:!e.manageMenuOpen;if(st(e),!o)return;(Ua(e)||e.inspectSelection)&&(ja(e),e.inspectSelection=null,e.refreshAll()),e.manageMenuOpen=!0;const a=e.root.querySelector("#managePopoverMenu"),n=e.root.querySelector("#btnToggleManageMenu");a&&n&&(a.classList.remove("hidden"),n.setAttribute("aria-expanded","true"),n.setAttribute("data-active","true"),hs(e,n,a)),e.renderTutorialCoach()}function Fn(e,t){const o=typeof t=="boolean"?t:!e.weatherPopoverOpen;if(st(e),!o)return;e.weatherPopoverOpen=!0;const a=e.root.querySelector("#weatherPopoverMenu"),n=e.root.querySelector("#lblClock");a&&n&&(Ss(e),a.classList.remove("hidden"),n.setAttribute("aria-expanded","true"),hs(e,n,a)),e.renderTutorialCoach()}function Ss(e){const t=e.root.querySelector("#weatherPopoverMenu");if(!t)return;const o=Date.now(),a=e.sim.getCurrentWeather(o),n=e.sim.getWeatherForecast(4,o),s=e.sim.state.settings.weatherOverride==="auto";t.innerHTML=`
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${s?"Tự động":"Khóa"}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${a.icon} ${m(a.labelVi)}</div>
        <div class="weather-current-buff">✨ ${m(a.buffVi)}</div>
      </div>
      
      <div class="weather-forecast-list">
        ${n.map((g,i)=>{const r=i===0?"Nay":`+${me(Math.max(1,g.startsInSec))}`;return`
              <div class="weather-slot-row ${i===0?"is-now":""}">
                <span>${g.icon} ${m(g.labelVi)}</span>
                <span class="weather-slot-meta">${m(r)}</span>
              </div>
            `}).join("")}
      </div>
    `}function os(e,t,o=!0){const a=t.toLocaleString("vi-VN");e.textContent=window.matchMedia("(max-width: 599px)").matches?Fs(t):a,o&&(e.title=`${a} Sickle`,e.closest("button")?.setAttribute("aria-label",`${a} Sickle — Chạm để chơi kiếm thêm Sickle`))}function Wa(e,t){const o=e.root.querySelector("#lblSickle");if(!o)return;if(e.sim.state.sandboxMode){e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0),o.textContent="∞",e.displayedSickle=t;return}const a=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(e.displayedSickle<0||a||Math.abs(t-e.displayedSickle)<=1){e.displayedSickle=t,os(o,Math.round(t));return}e.galleonRollRaf&&(cancelAnimationFrame(e.galleonRollRaf),e.galleonRollRaf=0);const n=e.displayedSickle,s=performance.now(),g=420,i=r=>{const p=Math.min(1,(r-s)/g),y=1-Math.pow(1-p,3),C=Math.round(n+(t-n)*y);e.displayedSickle=C,os(o,C,p>=1),p<1?e.galleonRollRaf=requestAnimationFrame(i):(e.displayedSickle=t,e.galleonRollRaf=0)};e.galleonRollRaf=requestAnimationFrame(i)}function Vn(e,t,o,a,n){const s=e.root.querySelector(`[data-fly-target="${t}"]`),g=e.root.querySelector("#flyRewardLayer");if(!s||!g)return;const i=()=>{s.classList.remove("hud-chip-pulse"),s.offsetWidth,s.classList.add("hud-chip-pulse")};if(window.matchMedia("(prefers-reduced-motion: reduce)").matches||e.photoModeActive){i(),e.sim.audio.playFlyTick(0);return}const r=s.getBoundingClientRect();if(r.width<=0&&r.height<=0)return;const p=r.left+r.width*.5,y=r.top+r.height*.5,C=typeof a=="number"&&Number.isFinite(a)?Math.max(24,Math.min(window.innerWidth-24,a)):window.innerWidth*.5,L=typeof n=="number"&&Number.isFinite(n)?Math.max(24,Math.min(window.innerHeight-24,n)):window.innerHeight*.54,l={galleons:"🪙",stars:"🌟",sand:"⏳",xp:"✨"},u=t==="stars"||t==="sand"?Math.min(5,Math.max(1,Math.round(o))):Math.min(7,Math.max(2,Math.ceil(Math.log2(Math.max(2,o)))));for(let b=0;b<u;b++){const w=document.createElement("div");w.className="fly-reward-token",w.dataset.kind=t,w.textContent=l[t],g.appendChild(w);const k=b/Math.max(1,u)*Math.PI*2+(Math.random()-.5)*.5,I=14+b%3*9,E=C+Math.cos(k)*I,R=L+Math.sin(k)*I*.7,d=(E+p)*.5+(b%2===0?-42:42),c=Math.min(R,y)-(48+b%3*18),T=560+b*48,S=b*52,$=w.animate([{transform:`translate3d(${E}px, ${R}px, 0) scale(0.55)`,opacity:.25,offset:0},{transform:`translate3d(${E}px, ${R-12}px, 0) scale(1.14)`,opacity:1,offset:.18},{transform:`translate3d(${d}px, ${c}px, 0) scale(1.04)`,opacity:1,offset:.58},{transform:`translate3d(${p}px, ${y}px, 0) scale(0.68)`,opacity:.92,offset:1}],{duration:T,delay:S,easing:"cubic-bezier(0.22, 0.88, 0.36, 1)",fill:"forwards"});$.onfinish=()=>{w.remove(),i(),e.sim.audio.playFlyTick(b)}}}function Et(e,t=""){const o=e.trim();return o.replace(/^(?:[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]|\s)+/u,"")||o}const Ka=1200,Pe=[];let is=0,xt=0,mt=null;function xe(e,t,o="🦉"){const a=Et(t,o);if(a){if(mt?.isConnected&&mt.dataset.msg===a)return $s(mt);a!==Pe[Pe.length-1]&&(Pe.length>=3&&Pe.shift(),Pe.push(a),Ht(e))}}let ls=0;function $s(e,t){window.clearTimeout(ls),ls=window.setTimeout(()=>{const o=t??e.parentElement;e.remove();const a=o;if(a&&!a.childElementCount&&typeof a.hidePopover=="function")try{a.matches(":popover-open")&&a.hidePopover()}catch{}},3500)}function Qa(e){const t=e.root.querySelector("#toastStack")??(typeof document<"u"?document.getElementById("toastStack"):null);if(!t)return null;const o=Array.from(e.root.querySelectorAll("dialog[open]")),a=o.length>0?o[o.length-1]:null;return a?t.parentElement!==a&&(a.appendChild(t),a.addEventListener("close",()=>{const n=Array.from(e.root.querySelectorAll("dialog[open]")),s=n.length>0?n[n.length-1]:e.root;t.parentElement!==s&&s.appendChild(t)},{once:!0})):t.parentElement!==e.root&&e.root.appendChild(t),t}function Ht(e){if(xt)return;const t=Qa(e);if(!t){Pe.length=0;return}const o=t.childElementCount?is+Ka-Date.now():0;if(o>0){xt=window.setTimeout(()=>{xt=0,Ht(e)},o);return}const a=Pe.shift();if(!a)return;const n=document.createElement("div");n.className="parchment-dark owl-toast",n.dataset.msg=a,n.appendChild(document.createElement("span")).textContent=a,t.replaceChildren(n);const s=t;if(typeof s.showPopover=="function")try{t.hasAttribute("popover")||t.setAttribute("popover","manual"),t.matches(":popover-open")&&s.hidePopover?.(),s.showPopover()}catch{}mt=n,is=Date.now(),$s(n,t),Pe.length&&Ht(e)}function _n(e,t){const o=Math.max(1,Math.round(t.awaySeconds/60)),a=e.root.querySelector("#offlineDialogContent");a.innerHTML=`
      <dl class="hs-rows">
        <div><dt>Vắng mặt</dt><dd>${o.toLocaleString("vi-VN")} phút</dd></div>
        <div><dt>Sickle</dt><dd>+${t.galleonsEarned.toLocaleString("vi-VN")} Sickle</dd></div>
        <div><dt>XP</dt><dd>+${t.xpEarned.toLocaleString("vi-VN")}</dd></div>
        <div><dt>Công trình xong</dt><dd>${t.buildingsFinished}</dd></div>
      </dl>
      <form method="dialog" class="hs-dlg-actions"><button type="submit" class="brass-btn gold-cta">Nhận</button></form>
    `,e.root.querySelector("#offlineDialog").showModal()}function ws(e){const t=e.root.querySelector("#floatingModeBanner"),o=e.root.querySelector("#floatingBannerText"),a=e.root.querySelector("#btnFloatingAutoPlace"),n=e.root.querySelector("#btnFloatingSecondary"),s=e.root.querySelector("#btnFloatingSwap"),g=e.root.querySelector("#btnFloatingExit");if(e.root.classList.toggle("is-pincer-mode",e.pincerActive&&!e.photoModeActive),!(!t||!o||!n||!s||!g)){if(a?.classList.add("hidden"),s.classList.add("hidden"),g.classList.add("gold-cta"),e.photoModeActive){t.classList.add("hidden");return}if(e.rideCamUid){const i=e.sim.state.buildings.find(p=>p.uid===e.rideCamUid),r=i?Y(i.itemId):void 0;if(!i||!r)e.rideCamUid=null;else{t.classList.remove("hidden"),o.textContent=`🎥 ${r.name}${e.rideCamSpeedText?` • ${e.rideCamSpeedText}`:""}`,n.textContent="🧭 90°",n.classList.remove("hidden"),g.textContent="✕";return}}if(e.pincerActive){t.classList.remove("hidden"),o.textContent=e.pincerPicked?`🤏 Đang gắp ${e.pincerPicked.label} — Chạm ô để thả`:"🤏 Điều phối nhân sự — Chạm ô để thả • Esc hủy",n.classList.add("hidden"),g.textContent="✕";return}if(e.moveModeActive){if(t.classList.remove("hidden"),e.movingBuildingUid){const i=e.sim.state.buildings.find(p=>p.uid===e.movingBuildingUid),r=i?Y(i.itemId):void 0;o.textContent=`✋ ${r?.name??"Dời chỗ"}`,n.textContent=`🔄 ${e.rotation*90}°`,n.classList.remove("hidden"),g.textContent="✕"}else o.textContent="✋ Chọn công trình để dời",n.classList.add("hidden"),g.textContent="✕";return}if(e.bulldozerActive){t.classList.remove("hidden"),o.textContent="🧹 Phá dỡ",n.classList.add("hidden"),g.textContent="✕";return}if(e.selectedCatalogItem&&!e.buildSheetOpen&&!e.activeCategory){const i=e.selectedCatalogItem,r=i.category!=="path"&&i.category!=="terrain"&&!i.isFarmlandPlot&&!i.connectableGroup&&!i.isZooFence,p=i.category!=="path"&&i.category!=="terrain"&&!i.isCoasterTrackPiece&&!i.isZooFence&&!i.elevationDelta,y=e.sim.getEffectiveItemStarCost(i),C=y>0?`🌟 ${y}`:i.cost===0?"0 Sickle":`${i.cost.toLocaleString("vi-VN")} Sickle`;t.classList.remove("hidden"),o.textContent=`🏗️ ${i.name} • ${C}`,p&&a&&(a.textContent="⚡ Đặt Ngay",a.classList.remove("hidden"),g.classList.remove("gold-cta")),r?(n.textContent=`🔄 ${e.rotation*90}°`,n.classList.remove("hidden")):n.classList.add("hidden"),s.textContent="📦 Đổi",s.classList.remove("hidden"),g.textContent="✕";return}if(e.activeSeedCropId&&!e.seedTrayOpen){const i=he[e.activeSeedCropId],r=e.sim.getSeedCount(e.activeSeedCropId);t.classList.remove("hidden"),o.textContent=`🌱 ${i.emoji} ${i.name} (${r})`,n.textContent="🌱 Đổi",n.classList.remove("hidden"),g.textContent="✕";return}if(e.activePastureAnimalId&&!e.pastureTrayOpen){const i=Le[e.activePastureAnimalId];t.classList.remove("hidden"),o.textContent=`🐾 ${i.emoji} ${i.name} (${i.cost.toLocaleString("vi-VN")} Sickle)`,n.textContent="🐾 Đổi",n.classList.remove("hidden"),g.textContent="✕";return}if(e.sim.strollModeActive&&!e.sim.isVisitingNeighbor){t.classList.remove("hidden"),o.textContent="🧙 Đi dạo · Chạm đường hoặc WASD",n.textContent="🪄 Chăm quanh",n.classList.remove("hidden"),s.textContent="✨ Đổi áo",s.classList.remove("hidden"),g.textContent="✕";return}if(e.sim.state.settings.cutawayMode){t.classList.remove("hidden"),o.textContent="👁️ Nhìn xuyên",n.classList.add("hidden"),g.textContent="✕";return}t.classList.add("hidden")}}function Ts(e){const t=e.root.querySelector("#touchConfirmBar"),o=e.root.querySelector("#lblTouchConfirm"),a=e.root.querySelector("#btnTouchRotate"),n=e.root.querySelector("#btnTouchStash");if(!t||!o)return;if(e.photoModeActive||!e.pendingTouchTile){t.classList.add("hidden");return}const s=e.selectedCatalogItem??(e.moveModeActive&&e.movingBuildingUid?Y(e.sim.state.buildings.find(r=>r.uid===e.movingBuildingUid)?.itemId??"")??null:null),g=!!(s&&s.category!=="path"&&s.category!=="terrain"&&!s.isFarmlandPlot&&!s.connectableGroup&&!s.isZooFence),i=!!(e.moveModeActive&&e.movingBuildingUid&&e.sim.canStashBuilding(e.movingBuildingUid));a?.classList.toggle("hidden",!g),n?.classList.toggle("hidden",!i),t.classList.remove("hidden"),o.textContent=`📍 ${e.pendingTouchTile.label}`}function Xa(e){const t=e.root.querySelector("#yuleEventBanner"),o=e.root.querySelector("#yuleEventBannerTitle"),a=e.root.querySelector("#yuleEventBannerTask"),n=e.root.querySelector("#yuleEventBannerProgress");if(!t||!o||!a||!n)return;const s=e.sim.getYuleEventStatus();if(e.photoModeActive||e.sim.isVisitingNeighbor||!s.active||!s.dayDef){t.classList.add("hidden");return}const g=s.dayDef.main,i=e.sim.getYuleTaskProgress(g.id),r=e.sim.getYuleTaskTarget(g.id),p=s.claimedMainDays.includes(s.day);o.textContent=`🎄 Yule • Ngày ${s.day}/36`,a.textContent=p?"Đã nhận phần thưởng":g.titleVi,n.textContent=p?"✓":`${Math.min(i,r)}/${r}`,t.classList.remove("hidden")}function Ya(e){const t=e.sim.getYuleEventStatus();if(!t.active||!t.dayDef||e.photoModeActive||e.sim.isVisitingNeighbor){e.yuleReadySig="";return}const a=[t.dayDef.main,...t.dayDef.side].filter(s=>!(s===t.dayDef.main?t.claimedMainDays.includes(t.day):t.claimedSideTaskIds.includes(s.id))&&e.sim.getYuleTaskProgress(s.id)>=s.amount);if(a.length===0){e.yuleReadySig="";return}const n=a.map(s=>s.id).join("|");e.yuleReadySig!==n&&(e.yuleReadySig=n,e.showToast(`🎄 Yule: ${a.length} nhiệm vụ sẵn sàng — mở bảng Nhiệm Vụ để nhận!`,"🎄"))}function Je(e){const t=e.sim.isVisitingNeighbor;t&&(ne(e),e.inspectSelection=null,e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null),Ja(e),Xa(e),Ya(e),tn(e),Bt(e),e.renderSeedTray(),e.renderPastureTray(),e.renderVisitorDockBar(),e.root.querySelector("#bottomDockWrap")?.classList.toggle("hidden",e.photoModeActive||t),e.root.querySelector("#tsCornerLeft")?.classList.toggle("hidden",e.photoModeActive||t);const o=!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive,a=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded||e.seedTrayOpen||e.pastureTrayOpen;e.root.querySelector("#tsCornerRight")?.classList.toggle("hidden",e.photoModeActive||t||o||a),e.root.querySelector("#btnOpenSeedSilo")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenPastureTray")?.classList.toggle("hidden",t),e.root.querySelector("#btnOpenHarvestFeast")?.classList.toggle("hidden",t),e.refreshHarvestFeastBadges(),e.root.querySelector("#harvestFeastDialog")?.open&&e.renderHarvestFeastDialog(),document.activeElement?.id!=="inpBuildingPrice"&&e.renderInspector(),ws(e),Ts(e),St(e),e.renderTutorialCoach()}function Za(e){const t=new Date,o=String(t.getHours()).padStart(2,"0"),a=String(t.getMinutes()).padStart(2,"0");e.sim.getRealTimePeriod(t);const n=e.sim.getCurrentWeather(t.getTime()),s=e.root.querySelector("#lblClock");if(s){const l=e.sim.simSpeed===2?' <span class="speed-mini-tag">2×</span>':"";s.innerHTML=`<span>${o}:${a}</span>${l}`,s.setAttribute("aria-label",`${o}:${a} · ${n.labelVi}`),s.title=n.labelVi}e.weatherPopoverOpen&&Ss(e);const g=e.sim.getActiveFestival(t),i=typeof e.sim.isWinterMainMapActive=="function"&&e.sim.isWinterMainMapActive();if(typeof document<"u"){const l=e.sim.isYuleVisualThemeActive(t)||i?"true":"false";document.documentElement.dataset.yuleTheme!==l&&(document.documentElement.dataset.yuleTheme=l)}const r=e.root.querySelector("#lblFestival");r&&(g==="lunar_tet"?(r.classList.remove("hidden"),r.textContent="🏮 Tết Việt +15% 🪙"):g==="mid_autumn"?(r.classList.remove("hidden"),r.textContent="🥮 Trung Thu +Hoa"):g==="halloween"?(r.classList.remove("hidden"),r.textContent="🎃 +35% XP"):g==="christmas"?(r.classList.remove("hidden"),r.textContent="🎄 Giáng Sinh +25% 🪙"):g==="quidditch_cup"&&!i?(r.classList.remove("hidden"),r.textContent="🏆 Quidditch +Cúp"):i?(r.classList.remove("hidden"),r.textContent="🎄 Đồi Tuyết Giáng Sinh"):r.classList.add("hidden")),e.sim.tickMatch3Hearts(Date.now());const p=e.sim.state,y=e.root.querySelector("#lblPuzzleHearts");if(y&&p.match3)if(p.sandboxMode)y.textContent="∞";else if(p.match3.hearts>=vt)y.textContent=`${p.match3.hearts}/${vt}`;else{const l=Math.max(0,Math.ceil((p.match3.nextHeartAt-Date.now())/1e3)),u=Math.floor(l/60),b=String(l%60).padStart(2,"0");y.textContent=`${p.match3.hearts} (${u}:${b})`}const C=e.root.querySelector("#btnHudActiveBuilds"),L=e.root.querySelector("#lblActiveBuilds");if(C&&L){const l=e.sim.getActiveConstructions(Date.now());if(l.length===0)C.classList.add("hidden");else{C.classList.remove("hidden");const u=Math.max(1,Math.ceil((l[0].constructEndsAt-Date.now())/1e3));L.textContent=String(l.length),C.title=`Đang xây (${me(u)})`}}}function Ja(e){const t=e.sim.state,o=e.sim.getRequiredLevelTrial(),a=Math.max(0,t.xp)%Qe,n=Math.max(6,Math.min(100,a/Qe*100));e.root.querySelector("#lblLevelNum").textContent=String(t.level),e.root.querySelector("#lblTitle").textContent=(e.sim.isHeadmasterPreview?"🔮 [Xem Thử] ":"")+Vt(t.level),e.root.querySelector("#barXpFill").style.width=`${n}%`,e.root.querySelector("#xpBarShell")?.classList.remove("trial-waiting");const g=e.root.querySelector("#lblParkRibbonName");if(g){const F=e.sim.getActiveVisitingNeighbor();g.textContent=F?`🚂 Thăm: ${F.avatarEmoji} ${F.parkName}`:t.parkName||"Trang Trại Hang Sóc"}e.refreshNeighborBadges();const i=e.sim.getWinsProgressForCurrentLevel(),r=e.sim.getTotalTowerClearedStages(),p=t.level>=we?100:Math.min(100,Math.max(8,Math.round(i.current/Math.max(1,i.required)*100))),y=e.root.querySelector("#btnOpenRoadmap");y&&(y.style.setProperty("--hg-lvl-pct",String(p)),y.title=t.level>=we?`👑 Cấp Tối Đa ${we} • Rương XP: ${a}/${Qe} • Tháp 6 Môn: ${r.cleared.toLocaleString("vi-VN")}/${r.total.toLocaleString("vi-VN")} Màn`:`Cấp ${t.level} → ${t.level+1}: Đã thắng ${i.current}/${i.required} màn • Rương XP: ${a}/${Qe}`);const C=e.root.querySelector("#barLevelTopFill");C&&(C.style.width=`${p}%`,C.parentElement&&(C.parentElement.title=t.level>=we?`👑 Đã đạt Cấp Tối Đa ${we} • Tháp 6 Môn: ${r.cleared.toLocaleString("vi-VN")}/${r.total.toLocaleString("vi-VN")} Màn`:`Cấp Giải Đố ${t.level} → ${t.level+1}: Đã thắng ${i.current}/${i.required} màn mới • Tháp 6 Môn: ${r.cleared.toLocaleString("vi-VN")}/${r.total.toLocaleString("vi-VN")} Màn`));const L=e.root.querySelector("#lblXpFraction");L&&(L.textContent=`🎁 ${a}/${Qe}`);const l=e.sim.ensureFarmBarn(),u=e.sim.getBarnTotalUsed(),b=e.root.querySelector("#lblStorageBarn");b&&(b.textContent=`${u}/${l.capacity}`),Wa(e,t.galleons);const w=t.sandboxMode?"∞":String(t.match3?.stars??0),k=e.root.querySelector("#lblPuzzleStars");k&&t.match3&&(k.textContent=w);const I=e.root.querySelector("#lblHudHubStars");I&&(I.textContent=w);const E=e.root.querySelector("#lblHudHubTrial");E&&(t.level>=we||t.sandboxMode||e.sim.isHeadmasterPreview||!o?E.textContent=`🌟 ${r.cleared}/${r.total}`:E.textContent=`🔥 ${o.icon} ${i.current}/${i.required}`),e.root.querySelector("#btnHudMinigameHub")?.classList.remove("trial-urgent");const R=e.sim.getDisciplineStageInfo("match3"),d=e.sim.getLastPlayedMinigame();let c="🍬 Bùa Gặt",T="/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp",S=R.isMaxed?`👑 ${R.maxStage}`:`Màn ${R.currentStage}`;if(d==="caro"){const F=e.sim.getDisciplineStageInfo("caro");c="🧨 Dò Mìn",T="/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1",S=F.isMaxed?`👑 ${Ie}`:`Màn ${F.currentStage}`}else if(d==="sudoku"){const F=e.sim.getDisciplineStageInfo("sudoku");c="🔢 Số Học",T="/trang-trai-hang-soc/sprites/m3_piece_scroll.webp",S=F.isMaxed?`👑 ${Ie}`:`Màn ${F.currentStage}`}else if(d==="blocks"){const F=e.sim.getDisciplineStageInfo("blocks");c="🦄 Sinh Vật",T="/trang-trai-hang-soc/sprites/beast_niffler.webp",S=F.isMaxed?`👑 ${Ie}`:`Màn ${F.currentStage}`}else if(d==="chess"){const F=e.sim.getDisciplineStageInfo("chess");c="🎯 Bắn Cá",T="/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2",S=F.isMaxed?`👑 ${Ie}`:`Màn ${F.currentStage}`}else if(d==="jigsaw"){const F=e.sim.getDisciplineStageInfo("jigsaw");c="🧩 Tranh Ghép",T="/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp",S=F.isMaxed?`👑 ${Ie}`:`Màn ${F.currentStage}`}else d==="seedquiz"&&(c="🪄 Thần Chú",T="/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp",S="Ôn Tập");const $=e.root.querySelector("#imgCornerPlayIcon");$&&$.getAttribute("src")!==T&&$.setAttribute("src",T);const f=Et(c),h=Et(S.replace("👑","Màn"));let M=0;if(!t.sandboxMode&&d==="match3"&&t.level<we){const F=t.match3?.stars??0,X=new Set(t.buildings.map(le=>le.itemId)),de=new Set(t.unlockedZones);for(const le of je){if(de.has(le.id)||t.level<le.unlockLevel)continue;const ge=_t(le)-F;ge>=1&&ge<=25&&(M===0||ge<M)&&(M=ge)}for(const le of Fe){if(le.isThemeParkLegacy||X.has(le.id)||!e.sim.isCatalogItemUnlocked(le))continue;const ge=e.sim.getEffectiveItemStarCost(le),ye=ge-F;ge>0&&ye>=1&&ye<=25&&(M===0||ye<M)&&(M=ye)}}const A=t.level>=we?`Cấp ${we}`:M>0?`Cần +${M} Sao`:`${i.current}/${i.required} màn`,H=t.level>=we?`Cấp ${we}`:M>0?`Cần thêm ${M} Sao · Lên cấp ${t.level+1}: ${i.current}/${i.required} màn`:`Lên cấp ${t.level+1}: ${i.current}/${i.required} màn`,O=e.root.querySelector("#badgeCornerPlayBonus");O&&(O.textContent=f,O.classList.remove("hidden"));const V=e.root.querySelector("#lblCornerPlayStage");V&&(V.textContent=h);const v=e.root.querySelector("#lblCornerPlaySub");v&&(v.textContent=A);const q=e.root.querySelector("#btnCornerPlayPuzzle");if(q){const F=`Chơi tiếp ${f} — ${h} · ${H}`;q.title=F,q.setAttribute("aria-label",F)}e.root.querySelectorAll("[data-switch-minigame]").forEach(F=>{const X=F.dataset.switchMinigame===d;F.dataset.active=String(X),X?F.setAttribute("aria-current","true"):F.removeAttribute("aria-current")});const D=e.root.querySelector("#badgeBuildReadyCount");if(D){const F=new Set(t.buildings.map(le=>le.itemId)),X=t.sandboxMode?999:t.match3?.stars??0,de=Fe.filter(le=>{if(le.isThemeParkLegacy)return!1;const ge=e.sim.getEffectiveItemStarCost(le);return ge<=0||!e.sim.isCatalogItemUnlocked(le)?!1:!F.has(le.id)&&X>=ge}).length;de>0&&!e.sim.isHeadmasterPreview?(D.textContent=String(de),D.classList.remove("hidden")):D.classList.add("hidden"),D.closest("button")?.setAttribute("aria-label",de>0&&!e.sim.isHeadmasterPreview?`Xây Dựng · ${de} bản vẽ đủ sao`:"Xây Dựng")}const _=e.root.querySelector("#lblMatch3Lv");_&&t.match3&&(_.textContent=R.isMaxed?`👑${R.maxStage}`:`${R.currentStage}/${R.maxStage}`);const P=e.root.querySelector("#lblArcadeTowerLv");if(P){const F=Math.max(0,r.cleared-R.clearedStages),X=Ie*5;P.textContent=F>=X?`👑${X}`:`${F}/${X}`}e.root.querySelector("#lblSand").textContent=t.sandboxMode?"∞":String(t.timeSand),e.root.querySelector("#lblWonder").textContent=e.sim.getParkWonderScore().toFixed(1);const z=e.sim.getActiveStoryQuest(),Q=e.sim.getReadyOwlOrdersCount(),j=(z?.completed?1:0)+t.owlQuests.filter(F=>F.completed&&!F.claimed).length+t.dailyQuests.filter(F=>F.completed&&!F.claimed).length,ie=Q+j,x=ie>0?ie:l.owlOrders.length,B=e.root.querySelector("#badgeQuestCount");x>0?(B.textContent=String(x),B.classList.toggle("is-ready-green",Q>0),B.classList.remove("hidden")):B.classList.add("hidden"),B.closest("button")?.setAttribute("aria-label",ie>0?`Đơn Hàng Cú & Nhiệm Vụ · ${ie} xong`:x>0?`Đơn Hàng Cú & Nhiệm Vụ · ${x} đơn`:"Đơn Hàng Cú & Nhiệm Vụ");const G=e.sim.ensureMarketFairState().deals.filter(F=>!F.claimed&&(t.sandboxMode||e.sim.getFarmItemCount(F.inputItemId)>=F.inputQty)).length,U=t.supply.cargoCrates.filter(F=>e.sim.getCargoCrateStockInfo(F).canFulfill).length+G,W=e.root.querySelector("#badgeWorkshopCount");W&&(U>0?(W.textContent=String(U),W.classList.remove("hidden")):W.classList.add("hidden"));const K=e.sim.getClaimableRetentionCount().total,Z=e.root.querySelector("#badgeCardCount");Z&&(K>0?(Z.textContent=String(K),Z.classList.remove("hidden")):Z.classList.add("hidden")),e.refreshSuitcaseBadge();const se=e.root.querySelector("#badgeSuitcaseCount"),oe=se&&!se.classList.contains("hidden")?Math.max(0,Number.parseInt(se.textContent||"0",10)||0):0,ue=e.sim.getClaimableHarvestFeastCount(),ee=e.root.querySelector("#badgeManageMenuDot");if(ee){const F=U+K+ue+oe;F>0?(ee.textContent=String(F),ee.classList.remove("hidden")):ee.classList.add("hidden")}en(e);const ae=e.root.querySelector("#btnCycleHeatmap");if(ae){const F=Ze.find(de=>de.mode===e.sim.heatmapMode)??Ze[0],X=e.sim.heatmapMode!=="none";ae.textContent=F.label,ae.dataset.active=String(X),ae.setAttribute("aria-pressed",String(X))}Za(e)}function en(e){const t=e.sim.state,o=t.level<3&&!t.sandboxMode&&!e.sim.isHeadmasterPreview,a=t.buildings.some(s=>!!Y(s.itemId)?.isCreatureHabitat),n=(t.match3?.hearts??vt)>=vt&&!t.sandboxMode;if(e.sim.getActiveConstructions(Date.now()).length>0,e.root.querySelector("#btnHudHeartChip")?.classList.toggle("hidden",n),e.root.querySelector("#btnOpenPuzzleArcade")?.classList.remove("hidden"),e.root.querySelector("#btnOpenSuitcase")?.classList.toggle("hidden",o&&!a),e.sim.isHeadmasterPreview&&e.minimapCollapsed){e.minimapCollapsed=!1,e.minimapHudVisible=!0,e.minimapCanvas?.classList.remove("hidden");const s=e.root.querySelector("#btnToggleMinimap");s&&(s.textContent="–",s.setAttribute("aria-expanded","true"))}}function tn(e){const t=e.root.querySelector("#questTrackerBody");if(!t)return;const o=e.sim.state,a=e.sim.getRequiredLevelTrial();e.sim.isCurrentLevelTrialPassed(),e.sim.isWaitingOnLevelTrial();const n=e.sim.getActiveStoryQuest(),s=o.owlQuests.slice(0,2);let g="";if(a&&!o.sandboxMode&&!e.sim.isHeadmasterPreview){const i=e.sim.getWinsProgressForCurrentLevel(),r=e.sim.getDisciplineStageInfo(a.kind);g+=`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:700;">
            <span>🔥 ${a.icon} ${m(a.shortVi)} (${r.currentStage}/${r.maxStage}) • ${i.current}/${i.required}</span>
            <button type="button" data-open-trial="${a.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `}if(n){const i=Math.min(100,Math.round(n.progress/Math.max(1,n.targetAmount)*100)),r=e.sim.getStoryAutoActionPreview();g+=`
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">${m(n.giverEmoji)} ${m(n.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${i}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(n.progress,n.targetAmount)}/${n.targetAmount}</span>
            ${n.completed?`<button type="button" data-claim="${m(n.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${n.rewardSickle} Sickle</button>`:`<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;" title="${m(r.longLabel)}">${m(r.shortLabel)}</button>`}
          </div>
        </div>
      `}for(const i of s){const r=Math.min(100,Math.round(i.progress/Math.max(1,i.targetAmount)*100));g+=`
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${m(i.giverEmoji)} ${m(i.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${r}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(i.progress,i.targetAmount)}/${i.targetAmount}</span>
            ${i.completed?`<button type="button" data-claim="${m(i.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`:`<span>+${i.rewardSickle}🪙 +${i.rewardXp}⭐</span>`}
          </div>
        </div>
      `}t.innerHTML=g,t.querySelectorAll("[data-claim]").forEach(i=>{i.addEventListener("click",()=>{e.sim.claimQuest(i.dataset.claim)})}),t.querySelectorAll("[data-open-trial]").forEach(i=>{i.addEventListener("click",()=>{e.openTrialMinigame(i.dataset.openTrial)})}),t.querySelectorAll("[data-star-story]").forEach(i=>{i.addEventListener("click",()=>{const r=e.sim.completeStoryStepWithStar();if(r.ok){typeof r.placedGx=="number"&&typeof r.placedGy=="number"&&be(e.cam,r.placedGx,r.placedGy);return}xe(e,r.msg,r.reason==="missing_gold"?"🪙":r.reason==="locked_level"?"🔒":"🌟"),r.reason==="open_match3"&&e.openTrialMinigame()})})}function Bt(e){const t=(v,q)=>{v&&(v.setAttribute("data-active",String(q)),v.setAttribute("aria-pressed",String(q)))},o=e.activeCategory==="decor"&&!!e.christmasTabActive;e.root.querySelectorAll("[data-cat]").forEach(v=>{const q=v.dataset.cat,D=q===e.activeCategory&&!(q==="decor"&&o);t(v,D)}),e.root.querySelectorAll("[data-decor-event]").forEach(v=>{t(v,o)}),t(e.root.querySelector("#btnMoveTool"),e.moveModeActive),t(e.root.querySelector("#btnBulldoze"),e.bulldozerActive);const a=e.root.querySelector("#btnRotate");if(a){const v=(e.rotation??0)*90;a.textContent=v>0?`🔄 Xoay ${v}°`:"🔄 Xoay"}const n=e.root.querySelector("#btnMenuRotateCam");if(n){const v=e.cam.viewRot??0;n.textContent=Xe[v]}t(e.root.querySelector("#btnMenuCutaway"),!!e.sim.state.settings.cutawayMode),t(e.root.querySelector("#btnMenuGrid"),e.sim.state.settings.showGrid);const s=e.sim.isLayoutEditModeActive();t(e.root.querySelector("#btnToggleLayoutEdit"),s),t(e.root.querySelector("#btnMenuLayoutEdit"),s),t(e.root.querySelector("#btnMenuStrollMode"),e.sim.strollModeActive);const g=e.root.querySelector("#layoutEditBar");g&&(g.classList.toggle("hidden",!s||e.photoModeActive||e.sim.isVisitingNeighbor),g.querySelectorAll("[data-edit-preset]").forEach(v=>{const q=v.dataset.editPreset,D=e.sim.activePresetSlot===q,_=!!e.sim.state.layoutPresets?.[q];v.classList.toggle("gold-cta",D),v.setAttribute("aria-pressed",String(D));const P=q==="layout_1"?1:q==="layout_2"?2:3;v.textContent=_?`Bản ${P} ✓`:`Bản ${P}`}));const i=e.root.querySelector("#btnBuildUndo"),r=e.root.querySelector("#btnBuildRedo"),p=e.sim.isVisitingNeighbor||(typeof e.sim.canUndoBuild=="function"?!e.sim.canUndoBuild():!0),y=e.sim.isVisitingNeighbor||(typeof e.sim.canRedoBuild=="function"?!e.sim.canRedoBuild():!0);i&&i.setAttribute("aria-disabled",String(p)),r&&r.setAttribute("aria-disabled",String(y));const C=e.root.querySelector("#btnAccioAll");C&&(C.disabled=e.sim.isVisitingNeighbor);const L=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,l=e.root.querySelector("#secondaryMapToolsBar");l&&l.classList.toggle("hidden",!L);const u=L||!!e.selectedCatalogItem||e.moveModeActive||e.bulldozerActive||e.pincerActive;e.root.querySelector("#bottomDockWrap")?.classList.toggle("ts-dock-open",L),St(e),t(e.root.querySelector("#btnToggleBuildDock"),u);const w=e.root.querySelector("#buildDrawer"),k=e.root.querySelector("#buildDrawerSwipeBar"),I=e.root.querySelector("#decorCollectionFilterBar"),E=e.root.querySelector("#minimapWrap");if(!e.activeCategory||!gt.includes(e.activeCategory)){e.activeCategory=null,e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null,w.classList.add("hidden"),k?.classList.add("hidden"),I?.classList.add("hidden"),E.classList.toggle("hidden",e.photoModeActive||!e.minimapHudVisible);return}w.classList.remove("hidden"),w.dataset&&(w.dataset.christmasDrawer=String(o)),E.classList.add("hidden");const R=e.recentDecorIds??[],d=new Map(R.map((v,q)=>[v,q])),c=new Map;for(const v of e.sim.state.buildings)c.set(v.itemId,(c.get(v.itemId)??0)+1);let T=0;for(const v of Object.values(e.sim.state.tileOverrides))v?.zooFence&&T++;T>0&&c.set("burrow_stone_rune_fence",T);const S=Fe.reduce((v,q)=>q.category==="decor"&&!q.isThemeParkLegacy&&ke(q)?v+Oe(e.sim,q):v,0),$=Fe.reduce((v,q)=>q.category==="decor"&&!q.isThemeParkLegacy&&!ke(q)?v+Oe(e.sim,q):v,0);if(I)if(e.activeCategory==="decor"&&o){I.classList.remove("hidden");const v=R.filter(P=>{const z=Y(P);return!!(z&&ke(z))}).length,q=Fe.filter(P=>P.category==="decor"&&!P.isThemeParkLegacy&&ke(P)).length,D=e.activeChristmasFilter??"all",_=[{id:"all",label:`✨ Tất cả (${q})`},{id:"recent",label:v>0?`Gần đây (${v})`:"Gần đây"},{id:"stashed",label:S>0?`📦 Trong kho (${S})`:"📦 Trong kho"},{id:"vietnam_noel",label:"🏮 Noel Việt Nam"},{id:"yule_trees",label:"🌲 Cây tuyết"},{id:"yule_flowers",label:"🌺 Hoa đông"},{id:"modular",label:"❄️ Hàng rào"},{id:"landmarks",label:"🏰 Địa danh"},{id:"hogwarts_crests",label:"🦁 4 Nhà"},{id:"burrow",label:"Hang Sóc"},{id:"hogwarts",label:"🕯️ Dạ vũ"},{id:"hogsmeade",label:"🍺 Hogsmeade"},{id:"express",label:"🚂 Cú & Tàu"},{id:"creatures",label:"🦌 Sinh vật"},{id:"book_lore",label:"📖 Điển tích"}];I.innerHTML=_.map(P=>{const z=D===P.id;return`<button type="button" role="tab" aria-selected="${z}" data-decor-filter="${P.id}" class="decor-filter-chip ${z?"active is-active":""}">${P.label}</button>`}).join(""),I.querySelectorAll("[data-decor-filter]").forEach(P=>{P.addEventListener("click",()=>{e.activeChristmasFilter=P.dataset.decorFilter??"all",w.scrollLeft=0,Bt(e)})})}else if(e.activeCategory==="decor"){I.classList.remove("hidden");const v=R.filter(P=>{const z=Y(P);return!!(z&&z.category==="decor"&&z.id!=="farmland_plot"&&!ke(z))}).length,D=["all","recent","stashed","nature","fences","lights","landmarks"].includes(e.activeDecorFilter)?e.activeDecorFilter:"all",_=[{id:"all",label:"✨ Tất cả"},{id:"recent",label:v>0?`Gần đây (${v})`:"Gần đây"},{id:"stashed",label:$>0?`📦 Trong kho (${$})`:"📦 Trong kho"},{id:"nature",label:"🌿 Cây & Hoa"},{id:"fences",label:"🚧 Rào & Cổng"},{id:"lights",label:"🕯️ Đèn & Ghế"},{id:"landmarks",label:"⛲ Tiểu cảnh"}];I.innerHTML=_.map(P=>{const z=D===P.id;return`<button type="button" role="tab" aria-selected="${z}" data-decor-filter="${P.id}" class="decor-filter-chip ${z?"active is-active":""}">${P.label}</button>`}).join(""),I.querySelectorAll("[data-decor-filter]").forEach(P=>{P.addEventListener("click",()=>{e.activeDecorFilter=P.dataset.decorFilter??"all",w.scrollLeft=0,Bt(e)})})}else I.classList.add("hidden");const f=e.activeCategory==="decor"&&(o?(e.activeChristmasFilter??"all")==="recent":e.activeDecorFilter==="recent"),h=e.activeCategory==="decor"&&(o?(e.activeChristmasFilter??"all")==="stashed":e.activeDecorFilter==="stashed"),M=["farmland_plot","burrow_animal_pasture","burrow_flower_garden","burrow_chicken_coop","burrow_pumpkin_gnomes","burrow_apple_orchard"],A=Fe.filter(v=>{if(v.category==="terrain"||v.isThemeParkLegacy)return!1;if(e.activeCategory==="creature")return v.category==="creature"||M.includes(v.id);if(v.category!==e.activeCategory)return!1;if(e.activeCategory==="decor"){const q=ke(v);if(o){if(!q)return!1;const _=e.activeChristmasFilter??"all";return _==="recent"?d.has(v.id):_==="stashed"?Oe(e.sim,v)>0:_==="all"?!0:v.id==="snowy_pines"?_==="yule_trees"||_==="hogsmeade":v.yuleCollection===_}if(q||v.id==="farmland_plot")return!1;const D=e.activeDecorFilter;return D==="recent"?d.has(v.id):D==="stashed"?Oe(e.sim,v)>0:D==="nature"||D==="fences"||D==="lights"||D==="landmarks"?Fa(v)===D:!0}return!0});f?A.sort((v,q)=>(d.get(v.id)??999)-(d.get(q.id)??999)):e.activeCategory==="creature"&&A.sort((v,q)=>{const D=M.indexOf(v.id),_=M.indexOf(q.id);return D!==-1||_!==-1?(D===-1?999:D)-(_===-1?999:_):v.unlockLevel-q.unlockLevel});const H=e.sim.state.sandboxMode,O=e.sim.state.match3?.stars??0,V=e.sim.state.galleons;if(A.length===0&&(f||h)){w.innerHTML=`
        <div class="catalog-empty-hint">
          ${h?"Kho Trang Trí hiện đang trống — bấm vào món trang trí ngoài sân rồi chọn <strong>Cất</strong> để lưu giữ nhé!":"Chưa có vật phẩm vừa đặt gần đây — hãy chọn một món trong <strong>✨ Tất cả</strong> nhé!"}
        </div>
      `,rs(e,w);return}w.innerHTML=A.map(v=>{const q=Oe(e.sim,v),D=q===0&&!e.sim.isCatalogItemUnlocked(v),_=e.selectedCatalogItem?.id===v.id,P=v.elevationDelta?v.elevationDelta>0?"⛰️":"⛏️":v.isCoasterTrackPiece?"🛤️":v.isZooFence?"🚧":v.isBench?"🪑":v.category==="path"?"🛣️":v.category==="terrain"?"🌿":"🕯️",z=fs(v),Q=z?`<img src="${z}" alt="${m(v.name)}" class="catalog-card-img" />`:`<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${P}</div>`,j=e.sim.getEffectiveItemStarCost(v),x=j>0&&!v.connectableGroup&&v.category!=="decor"&&e.sim.state.buildings.some(ee=>ee.itemId===v.id),B=q===0&&!H&&!D&&j>0&&O<j,N=q===0&&!H&&!D&&j===0&&V<v.cost,G=q===0&&(B&&!x||N),U=Qs(v),W=U>0?` • ⏱️ ${ve(U)}`:"",K=j>0?`🌟 ${j}`:`🪙 ${v.cost.toLocaleString("vi-VN")} Sickle`,Z=q>0?`📦 Kho: ${q} • 0 Sickle`:D?`🔒 Cấp ${v.unlockLevel} • ${K}${W}`:x?B?`✅ Đã xây • 🌟 ${O}/${j}`:`✅ Đã xây • 🌟 ${j}`:B?`🌟 ${O}/${j}${W}`:j>0?`🌟 ${j}${W}`:N?`🪙 ${V.toLocaleString("vi-VN")}/${v.cost.toLocaleString("vi-VN")} Sickle${W}`:`🪙 ${v.cost.toLocaleString("vi-VN")} Sickle${W}`,se=o&&ke(v),oe=c.get(v.id)??0,ue=oe>0&&(!x||oe>1)?`<span class="catalog-card-placed-badge">Đã đặt ${oe}</span>`:"";return`
          <button
            type="button"
            class="catalog-card ${se?"yule-festive-card":""} ${D?"locked":""} ${G?"short-resource":""}"
            data-item-id="${v.id}"
            data-selected="${_}"
            aria-pressed="${_}"
            ${D||G?'aria-disabled="true"':""}
          >
            ${ue}
            ${se?'<span class="yule-card-twinkle" aria-hidden="true">❄</span>':""}
            ${Q}
            <div class="catalog-card-title">${m(v.name)}</div>
            <div class="catalog-card-sub ${G?"is-short":""}">${Z}</div>
          </button>
        `}).join(""),w.querySelectorAll("[data-item-id]").forEach(v=>{v.addEventListener("click",()=>{const q=Y(v.dataset.itemId);if(!q)return;const D=e.sim.getEffectiveItemStarCost(q),_=e.sim.state.match3?.stars??0,P=Oe(e.sim,q)>0;if(!P&&!e.sim.isCatalogItemUnlocked(q)){const j=e.sim.getWinsProgressForCurrentLevel();let ie=Math.max(1,j.required-j.current);for(let B=e.sim.state.level+1;B<q.unlockLevel;B++)ie+=Xs(B);const x=D>0?` hoặc ${D} Sao (${_}/${D})`:"";xe(e,`Mở ở Cấp ${q.unlockLevel}${x} · cần thêm ${ie.toLocaleString("vi-VN")} màn.`,"🔒");return}if(!P&&!e.sim.state.sandboxMode&&D>0&&_<D){const j=!q.connectableGroup&&q.category!=="decor"?e.sim.state.buildings.find(x=>x.itemId===q.id):void 0;if(j){ne(e),e.inspectSelection={kind:"building",uid:j.uid},be(e.cam,j.gx+q.width*.5,j.gy+q.height*.5),e.onCameraJump?.(),Be(e),Je(e),xe(e,`Đã chọn "${q.name}" · bấm "✋ Dời" để đổi vị trí.`,"✋");return}const ie=D-_;xe(e,`Thiếu ${ie} Sao (${_}/${D}).`,"🌟");return}if(!P&&!e.sim.state.sandboxMode&&D===0&&e.sim.state.galleons<q.cost){const j=q.cost-e.sim.state.galleons;xe(e,`🪙 Thiếu ${j.toLocaleString("vi-VN")} Sickle (hiện có ${e.sim.state.galleons.toLocaleString("vi-VN")}/${q.cost.toLocaleString("vi-VN")} Sickle) để dựng "${q.name}"!`,"🪙");return}ne(e),e.selectedCatalogItem=q,e.inspectSelection=null,Be(e),Je(e),e.onSelectCatalogItem?.(q);const z=Ea(q),Q=typeof window<"u"&&!!window.matchMedia?.("(pointer: coarse)")?.matches;xe(e,z?`🏗️ Đã chọn "${q.name}" — Chạm hoặc kéo liên tục trên bản đồ để đặt!`:Q?`🏗️ Đã chọn "${q.name}" — Kéo/chạm ô chỉnh vị trí rồi bấm ✓ Đặt (hoặc bấm ⚡ Đặt Ngay)!`:`🏗️ Đã chọn "${q.name}" — Chạm một lần vào ô xanh để đặt ngay (hoặc bấm ⚡ Đặt Ngay)!`,"🔨")})}),rs(e,w)}function sn(e,t){const o=[{key:"caretaker",icon:"🧹",name:"Lao Công Phép Thuật",desc:"Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.",baseCost:90},{key:"artificer",icon:"🔧",name:"Phù Thủy Bảo Trì",desc:"Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.",baseCost:140},{key:"magizoologist",icon:"🥩",name:"Nhà Sinh Vật Học",desc:"Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.",baseCost:220},{key:"auror",icon:"⚡",name:"Thần Sáng Bảo An",desc:"Đuổi bắt thú sổng chuồng và thu hồi vàng Sickle về két.",baseCost:320},{key:"house_elf",icon:"🧦",name:"Gia Tinh Tình Nguyện",desc:"Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!",baseCost:480}],a=new Set(e.sim.state.unlockedZones),n=i=>`<option value="all" ${i==="all"?"selected":""}>🗺️ Toàn công viên</option>`+je.filter(r=>e.sim.state.sandboxMode||a.has(r.id)).map(r=>`<option value="${r.id}" ${i===r.id?"selected":""}>📍 ${r.name}</option>`).join(""),s=o.map(i=>{const r=e.sim.state.staffHired[i.key],p=r>=lt,y=i.baseCost*(1+r);return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:18px;">${i.icon} <span style="font-size:12px;font-weight:700;">${r}/${lt}</span></div>
            <div style="font-size:13px;font-weight:700;">${i.name}</div>
            <button
              type="button"
              data-hire="${i.key}"
              class="brass-btn ${p?"":"gold-cta"}"
              ${p?"disabled":""}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${p?`✓ ${lt}/${lt}`:`+ 🪙 ${y}`}
            </button>
            ${r>0?`<button type="button" data-dismiss="${i.key}" class="brass-btn" style="width:100%;margin-top:4px;padding:4px 8px;font-size:12px;">Cho nghỉ</button>`:""}
          </div>
        `}).join(""),g=e.sim.staff.map(i=>{const r=e.sim.state.staffPatrolZones?.[i.id]??i.patrolZoneId??"all";return`
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:700;color:#7c2d12;">🧙 <span class="hs-raw">${m(i.name)}</span></div>
            <select data-patrol-staff="${m(i.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${n(r)}
            </select>
            <button type="button" data-pick-staff="${m(i.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `}).join("");t.innerHTML=s+g,t.querySelectorAll("[data-hire]").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.hire;e.sim.hireStaff(r)&&(Be(e),Je(e),xe(e,"Đã đón nhân sự mới gia nhập công viên!","🧙"))})}),t.querySelectorAll("[data-dismiss]").forEach(i=>{i.addEventListener("click",()=>{const r=i.dataset.dismiss;e.sim.dismissStaff(r)&&(Je(e),sn(e,t),xe(e,"Đã cho phụ tá tạm nghỉ ngơi!","🧙"))})}),t.querySelectorAll("[data-patrol-staff]").forEach(i=>{i.addEventListener("change",()=>{const r=i.dataset.patrolStaff;e.sim.setStaffPatrolZone(r,i.value),xe(e,"Đã cập nhật khu vực tuần tra cho nhân sự!","📍")})}),t.querySelectorAll("[data-pick-staff]").forEach(i=>{i.addEventListener("click",()=>{const r=e.sim.staff.find(p=>p.id===i.dataset.pickStaff);r&&(ne(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:r.id,label:r.name},Be(e),Je(e),xe(e,`Đang gắp ${r.name} — Chạm vào ô bất kỳ trên bản đồ để thả xuống!`,"🤏"))})})}const an={path:"🛣️ Đường Đá & Lối Dạo",shop:"🏠 Nhà & Xưởng Chế Biến",creature:"🌾 Sản Xuất, Đồng Cỏ & Thú",decor:"🌳 Vườn Hoa & Trang Trí",staff:"🧙 Phụ Tá Điền Trang"};function rs(e,t){const o=e.root.querySelector("#buildDrawerSwipeBar"),a=e.root.querySelector("#buildDrawerCatLabel"),n=e.root.querySelector("#btnDrawerScrollPrev"),s=e.root.querySelector("#btnDrawerScrollNext"),g=e.root.querySelector("#buildDrawerSwipeHint");e.drawerEdgeObserver?.disconnect(),e.drawerEdgeObserver=null;const i=Array.from(t.querySelectorAll(".catalog-card"));if(!o||i.length===0||!e.activeCategory){o?.classList.add("hidden");return}if(a){const u=e.activeCategory==="decor"&&e.christmasTabActive?"🎄 Giáng Sinh & Mùa Đông":an[e.activeCategory]??"🏗️ Danh Mục Xây Dựng",b=e.sim.state.sandboxMode?"∞":String(e.sim.state.match3?.stars??0),w=e.sim.state.sandboxMode?"∞":`${e.sim.state.galleons.toLocaleString("vi-VN")} Sickle`;a.textContent=`${u} (${i.length}) • 🌟 ${b} • 🪙 ${w}`}o.classList.remove("hidden");const r=t.querySelector('.catalog-card[data-selected="true"]');r&&typeof r.scrollIntoView=="function"&&r.scrollIntoView({block:"nearest",inline:"nearest",container:"nearest"});const p=i[0],y=i[i.length-1];let C=!0,L=i.length<=2;const l=()=>{const u=!C||!L||t.scrollWidth>t.clientWidth+6;n&&(n.disabled=C,n.classList.toggle("hidden",!u)),s&&(s.disabled=L,s.classList.toggle("hidden",!u)),g&&g.classList.toggle("hidden",!u),t.dataset.scrollStart=String(!C),t.dataset.scrollEnd=String(!L)};if(typeof IntersectionObserver<"u"){const u=new IntersectionObserver(b=>{for(const w of b)w.target===p&&(C=w.intersectionRatio>=1),w.target===y&&(L=w.intersectionRatio>=1);l()},{root:t,threshold:1,rootMargin:"2px"});u.observe(p),y!==p&&u.observe(y),e.drawerEdgeObserver=u}l()}function Gn(e){const t=e.buildSheetOpen||!!e.activeCategory||e.mapToolsExpanded,o=e.root.querySelector("#secondaryMapToolsBar");o&&o.classList.toggle("hidden",!t)}function J(e){e.syncContextualMapToolsBar();const t=e.root.querySelector("#inspectorPanel");if(!e.inspectSelection){e.lastInspectedKey="",e.inspectorCollapsed=!1,delete t.dataset.inspSig,t.classList.add("hidden"),t.classList.remove("inspector-collapsed"),e.syncHudFocusVisibility();return}const o=e.inspectSelection.kind==="building"?`b:${e.inspectSelection.uid}`:e.inspectSelection.kind==="staff"?`s:${e.inspectSelection.id}`:`z:${e.inspectSelection.zoneId}`,a=o===e.lastInspectedKey;if(a||(e.lastInspectedKey=o),e.inspectorCollapsed=!1,t.classList.remove("inspector-collapsed"),e.inspectSelection.kind==="building"){const n=e.inspectSelection.uid,s=e.sim.state.buildings.find(x=>x.uid===n);if(!s){e.inspectSelection=null,delete t.dataset.inspSig,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const g=Y(s.itemId),i=Date.now(),r=i<s.constructEndsAt,p=Math.max(0,Math.ceil((s.constructEndsAt-i)/1e3)),y=e.sim.getBuildingProductionPerCycle(s,g),C=Ma(g,s.stars),L=(e.sim.rideQueues.get(s.uid)??[]).length,l=e.sim.isBuildingConnected(s.uid),u=e.sim.activeSynergies.buildingGoldMult.get(s.uid)??1,b=g.category==="ride"&&!g.isCoasterTrackPiece,w=!!g.isCustomCoasterStation&&!r;let k="none",I="",E=0;if(g.isFarmlandPlot&&!r){const x=e.sim.getPlotEffectiveSoilTier(s),B=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),G=e.sim.getPlotSoilUpgradeCostInfo(s.uid)?.canAfford?1:0;if(s.cropId){const U=he[s.cropId],W=s.cropReadyAt??i,K=e.sim.state.cropMastery?.[U.id]??0,Z=ct(0,!1,K,U.growSec).growSec,se=s.cropPlantedAt??W-Z*1e3,oe=Math.max(0,Math.ceil((W-i)/1e3)),ue=oe<=0;E=ue?100:Math.max(6,Math.min(98,Math.round((i-se)/Math.max(1e3,W-se)*100))),I=`${ue?"Chín":me(oe)}${s.cropRotatedBonus?" · ×2":""}`,k=`${U.id}:${ue?1:0}:${s.cropWateredBoost?1:0}:${s.cropRotatedBonus?1:0}:${x}:${s.cropCompostBoost?1:0}:${B}:${G}:${e.sim.state.morningDewPhials??0}`}else{const U=e.sim.state.plotSoilState?.[`${s.gx},${s.gy}`],W=Object.keys(he).map(K=>e.sim.getSeedCount(K)).join(".");k=`empty:${e.seedFilterMode}:${e.activeSeedCropId??""}:${U?.lastFamily??""}:${s.harvestCycleCount??0}:${x}:${s.cropCompostBoost?1:0}:${B}:${G}:${W}`}}let R="none",d="",c=0;if(g.isAnimalPasturePlot&&!r)if(!s.pastureAnimalId)R="empty";else{const x=Le[s.pastureAnimalId],B=s.pastureReadyAt??i,N=s.pastureStockedAt??B-x.cycleSec*1e3,G=Math.max(0,Math.ceil((B-i)/1e3)),U=G<=0;c=U?100:Math.max(6,Math.min(98,Math.round((i-N)/Math.max(1e3,B-N)*100)));const W=x.goodId?ce(x.goodId):null,K=s.pastureGourmetBoost?2:1,Z=s.pastureGourmetBoost?1.5:1,se=Math.round(x.sellValue*Z),oe=x.yieldQty*K,ue=s.pastureGourmetBoost?2:1;d=U?`🧺 +${se} Sickle${W?` +${oe} ${W.name}`:""} +${ue} 🌿`:`⏱️ ${me(G)}${s.pastureGourmetBoost?" · 🌽 ×2":""}`;const ee=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),ae=e.sim.getAvailableGourmetFeedCrop()??"none";R=`${s.pastureAnimalId}:${U?1:0}:${s.pastureFedBoost?1:0}:${s.pastureGourmetBoost?1:0}:${ee}:${ae}:${e.sim.state.morningDewPhials??0}`}let T="none",S="";if(g.workshopGroupId&&!r){const x=e.sim.getWorkshopRecipesForBuilding(g),B=s.workshopQueue??[],N=s.readyFarmGoods??[],G=x.map(K=>{const Z=!e.sim.state.sandboxMode&&e.sim.state.level<K.unlockLevel,se=!Z&&(e.sim.state.sandboxMode||K.inputs.every(oe=>e.sim.getFarmItemCount(oe.itemId)>=oe.qty));return`${K.id}:${Z?"L":se?"Y":"N"}:${K.inputs.map(oe=>e.sim.state.sandboxMode?"X":e.sim.getFarmItemCount(oe.itemId)).join(".")}`}).join(","),U=B[0],W=U?Math.max(0,Math.ceil((U.endsAt-i)/1e3)):0;S=U?me(W):"Trống",T=`${N.join(",")}|${B.map(K=>K.goodId).join(",")}|${G}`}let $="done",f=100,h="",M="";if(r){const x=Math.max(0,s.buildReducedSec??0),B=Math.max(1e3,g.buildDurationSec*1e3,s.constructEndsAt-(s.placedAt||i-1e3)+x*1e3);f=Math.max(1,Math.min(99,Math.floor((1-(s.constructEndsAt-i)/B)*100)));const N=e.sim.getBuildingMinFloorSec(s),G=Math.max(0,p-N),U=G<=0&&e.sim.getActiveConstructions(i).some(K=>K.uid!==s.uid&&Math.ceil((K.constructEndsAt-i)/1e3)>e.sim.getBuildingMinFloorSec(K)),W=G>0||U;h=`${me(p)}${x>0?` (−${ve(x)})`:""}`,M=`${f}%`,$=`1:${x}:${G>0?1:0}:${W?1:0}:${e.sim.state.morningDewPhials??0}`}let A="";if(!r&&!s.awaitingUnveil&&g.baseIncome>0&&g.cycleSec>0&&!g.isFarmlandPlot&&!g.isAnimalPasturePlot){const x=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,B=Zt(s,g),N=Math.max(1,B*x),G=Math.max(0,(i-(s.lastTickAt||i))/1e3),U=Math.max(1,Math.ceil(N-G%N));A=me(U)}const H=g.isCreatureHabitat?e.sim.biomeCache.get(s.uid):void 0,O=g.isBackstage?e.sim.backstageCache.get(s.uid):void 0,V=[s.uid,s.itemId,s.stars,s.rotation,s.awaitingUnveil?1:0,l?1:0,u.toFixed(2),s.visitorsServed,L,s.storedSickle,y.galleons,y.xp,Math.round(s.durability),s.isBrokenDown?1:0,s.needsTreeRevival?1:0,s.lastPlantedCropId??"",(s.readyFruitCrops??[]).length,s.creatureBondLevel??1,s.creatureStage??"",Math.round(s.creatureHunger??90),H?.score??50,O?`${O.shieldCount}/${O.needed}`:"",e.sim.state.level,e.sim.state.sandboxMode?1:0,e.sim.isVisitingNeighbor?1:0,!r&&e.sim.canStashBuilding(s.uid)?1:0,e.sim.getActiveFestival(),$,k,R,T].join("#");if(!t.classList.contains("hidden")&&t.dataset.inspSig===V){const x=(B,N)=>{const G=t.querySelector(`[data-insp-live="${B}"]`);G&&G.textContent!==N&&(G.textContent=N)};if(I){x("crop-timer",I);const B=t.querySelector('[data-insp-live="crop-bar"]');B&&(B.style.width=`${E}%`)}if(d){x("pasture-timer",d);const B=t.querySelector('[data-insp-live="pasture-bar"]');B&&(B.style.width=`${c}%`)}if(T!=="none"&&x("ws-timer",S),r){x("build-timer",h),x("build-pct",M);const B=t.querySelector('[data-insp-live="build-bar"]');B&&(B.value=f)}A&&x("prod-cycle",A);return}t.dataset.inspSig=V;const v={egg:"🥚 Trứng",baby:"🐣 Non",adult:"🦄 Trưởng thành",legendary:"🌟 Huyền thoại"};La(g),e.sim.getEffectivePrice(s,g),e.sim.getPriceValueVerdict(s,g);const q=g.isFarmlandPlot&&!r?(()=>{const x=e.sim.getPlotEffectiveSoilTier(s),B=na(x),N=e.sim.getPlotSoilUpgradeCostInfo(s.uid),G=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),U=!s.cropCompostBoost&&(!!e.sim.state.sandboxMode||G>=1),W=`
                <div class="soil-tier-banner">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
                    <strong>🌱 Bậc ${B.labelRom} · ${m(B.nameVi)}</strong>
                    <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 ×${e.sim.state.sandboxMode?"∞":G}</span>
                  </div>
                  <div class="hs-stat-pills">
                    <span class="hs-stat-pill" title="Sản lượng cộng thêm mỗi vụ">🌱 +${B.yieldBonus}</span>
                    <span class="hs-stat-pill" title="Hệ số thưởng Sickle và XP khi thu hoạch">🪙 ×${B.harvestGoldXpMult.toFixed(2)}</span>
                    ${B.rejuvenateOnRotate?'<span class="hs-stat-pill" title="Luân canh khác họ giúp hồi sức đất">🍀 Hồi đất</span>':""}
                    ${s.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Đã bón Phân Ủ Thảo Dược: cộng 2 nông sản vụ này">🌿 +2</span>':""}
                  </div>
                  <div class="soil-tier-actions">
                    ${N?.nextTier&&N.nextMeta?`<button type="button" class="brass-btn ${N.canAfford?"gold-cta":""}" data-insp-upgrade-soil="1" title="${N.unlockedByLevel?`Nâng cấp lên Đất Bậc ${N.nextMeta.labelRom}`:`Mở khoá Đất Bậc ${N.nextMeta.labelRom} tại Cấp ${N.nextMeta.unlockLevel}`}" ${N.unlockedByLevel?"":"disabled"}>${N.unlockedByLevel?e.sim.state.sandboxMode?`Bậc ${N.nextMeta.labelRom} · 0 Sickle`:`Nâng Bậc ${N.nextMeta.labelRom} · ${N.compostCost}🌿 · 🪙${N.effectiveSickleCost.toLocaleString("vi-VN")}`:`🔒 Bậc ${N.nextMeta.labelRom} (Cấp ${N.nextMeta.unlockLevel})`}</button>`:'<span class="hs-stat-pill is-active" title="Đất canh tác đã đạt cấp tối đa Bậc V">⭐ Bậc V</span>'}
                    ${s.cropCompostBoost?'<span class="hs-stat-pill is-active" title="Thửa đất đã bón Phân Ủ vụ này">🌿 Đã bón</span>':`<button type="button" class="brass-btn" data-insp-compost-plot="1" title="Bón 1 Phân Ủ Thảo Dược: cộng 2 nông sản và xoá mỏi đất" ${U?"":"disabled"}>🌿 Bón đất (+2)</button>`}
                  </div>
                </div>
              `;if(!s.cropId){const ge=e.sim.state.plotSoilState?.[`${s.gx},${s.gy}`],ye=Math.max(s.harvestCycleCount??0,ge?.fatigueStep??0),at=Object.values(he).sort((te,$e)=>te.unlockLevel-$e.unlockLevel||te.growSec-$e.growSec).filter(te=>e.seedFilterMode==="flowers"?!!te.isFlowerCrop:e.seedFilterMode==="crops"?!te.isFlowerCrop:!0),Wt=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map(te=>`
                      <button
                        type="button"
                        class="seed-filter-pill ${e.seedFilterMode===te.id?"active":""}"
                        data-insp-seed-filter="${te.id}"
                        aria-pressed="${e.seedFilterMode===te.id}"
                      >${te.label}</button>
                    `).join(""),Hs=at.map(te=>{const $e=!e.sim.state.sandboxMode&&e.sim.state.level<te.unlockLevel,nt=e.sim.getSeedCount(te.id),Ds=Ys(te.id),Rs=!!(ge&&ge.lastFamily!==Ds),Os=e.sim.state.cropMastery?.[te.id]??0,Qt=ct(ye,Rs,Os,te.growSec),Ns=`${ve(Qt.growSec)}${Qt.isRotatedBonus?" · 🍀 ×2":""}`,Xt=e.activeSeedCropId===te.id;return`
                      <div class="seed-card-slot ${$e?"locked":""} ${Xt?"selected":""} ${!$e&&nt<=0?"out-of-seeds":""}">
                        <button
                          type="button"
                          class="seed-card seed-tray-card ${$e?"locked":""} ${Xt?"selected":""} ${!$e&&nt<=0?"out-of-seeds":""}"
                          data-plant-crop="${te.id}"
                          ${$e?"disabled":""}
                        >
                          <span class="seed-card-seed-badge ${$e?"is-locked":nt>0?"has-seed":"no-seed"}">
                            ${$e?`Cấp ${te.unlockLevel}`:`×${nt}`}
                          </span>
                          <img src="${At(te.id)}" alt="${m(te.name)}" class="seed-card-img" />
                          <span class="seed-card-name">${m(te.name)}</span>
                          <span class="seed-card-meta">${Ns}</span>
                        </button>
                        ${$e?"":`<button type="button" class="seed-card-add-btn" data-insp-buy-seed="${te.id}" aria-label="Mua 1 hạt ${m(te.name)} (${te.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${m(te.name)} (${te.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":te.seedCost.toLocaleString("vi-VN")}</button>`}
                      </div>
                    `}).join(""),Bs={grain:"Lúa mạch/Ngũ cốc",produce:"Rau củ quả",flower:"Hoa cảnh",magical:"Thảo dược phép"},Is=ge?.lastFamily?`<div class="hs-insp-note">Luân canh ×2 · Khác họ <strong>${Bs[ge.lastFamily]??ge.lastFamily}</strong></div>`:"",Kt=s.lastPlantedCropId??e.sim.ensureFarmBarn().lastPlantedCropId,$t=Kt?he[Kt]:null;return`
                  <div class="ws-inspector-board">
                    ${W}
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>Chọn hạt</span>
                      <div style="display:flex;gap:6px;flex-wrap:wrap;">
                        ${$t?`<button id="btnInspReplantLast" type="button" class="brass-btn gold-cta" title="Gieo lại ${m($t.name)}">🌱 Gieo lại ${m($t.name)}</button>`:""}
                        <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta">
                          Đố nhận hạt
                        </button>
                      </div>
                    </div>
                    ${Is}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${Wt}</div>
                    <div class="seed-picker-grid">${Hs}</div>
                  </div>
                `}const K=he[s.cropId],Z=s.cropReadyAt??i,se=e.sim.state.cropMastery?.[K.id]??0,oe=ct(0,!1,se,K.growSec).growSec,ue=s.cropPlantedAt??Z-oe*1e3,ee=Math.max(0,Math.ceil((Z-i)/1e3)),ae=ee<=0,F=oa(se),X=Math.max(0,e.sim.state.morningDewPhials??0),de=K.yieldQty*(s.cropRotatedBonus?2:1)+B.yieldBonus+(s.cropRotatedBonus?B.extraRotateYield:0)+(s.cropCompostBoost?2:0),le=ae?100:Math.max(6,Math.min(98,Math.round((i-ue)/Math.max(1e3,Z-ue)*100)));return`
                <div class="ws-inspector-board">
                  ${W}
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="${At(K.id)}" alt="${m(K.name)}" style="width:40px;height:40px;object-fit:contain;" />
                    <div style="flex:1;min-width:0;">
                      <div class="hs-insp-name">${m(K.name)} <span class="hs-insp-meta">· Bậc ${F.labelRom}</span></div>
                      <div class="hs-insp-stat" data-insp-live="crop-timer">
                        ${ae?"Chín":me(ee)}${s.cropRotatedBonus?" · ×2":""}
                      </div>
                      <div class="hs-insp-meta">${se} vụ</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="crop-bar" style="width:${le}%"></div>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${ae?`
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;">
                            <img src="/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                            Gặt +${de}
                          </button>
                        `:s.cropWateredBoost?'<div class="hs-insp-meta" style="flex:1;text-align:center;padding:8px 4px;">Đã tưới</div>':`
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              Tưới −30%
                            </button>
                          `}
                    ${!ae&&(X>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            Sương Mai ×${X}
                          </button>`:""}
                  </div>
                </div>
              `})():"",D=g.workshopGroupId&&!r?(()=>{const x=e.sim.getWorkshopRecipesForBuilding(g),B=s.workshopQueue??[],N=s.readyFarmGoods??[],G=Zs(s.stars),U=Js(s.stars),W=N.length>0?`
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${N.slice(0,5).map(ee=>{const ae=Ee[ee];return`<img src="/trang-trai-hang-soc/sprites/${ae.iconKey}.webp" alt="${m(ae.name)}" title="${m(ae.name)}" class="ws-ready-good-img" />`}).join("")}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${N.length})
                      </button>
                    </div>
                  `:"",K=x.map(ee=>{const ae=Ee[ee.goodId],F=ee.name??ae.name,X=ee.name&&ee.name!==ae.name?`title="Ra lò thành phẩm: ${m(ae.name)}"`:"",de=!e.sim.state.sandboxMode&&e.sim.state.level<ee.unlockLevel,le=!de&&(e.sim.state.sandboxMode||ee.inputs.every(ye=>e.sim.getFarmItemCount(ye.itemId)>=ye.qty)),ge=ee.inputs.map(ye=>{const jt=ce(ye.itemId),at=e.sim.getFarmItemCount(ye.itemId);return`<span class="ws-ing-chip ${e.sim.state.sandboxMode||at>=ye.qty?"ok":"lack"}">${m(jt.name)} ${e.sim.state.sandboxMode?"∞":at}/${ye.qty}</span>`}).join(" ");return`
                    <button
                      type="button"
                      class="ws-recipe-card ${le?"craftable":""} ${de?"locked":""}"
                      data-ws-enqueue="${ee.id}"
                      ${X}
                      ${de?"disabled":""}
                    >
                      <div class="ws-recipe-name">${m(F)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/trang-trai-hang-soc/sprites/${ae.iconKey}.webp" alt="${m(F)}" class="ws-recipe-img" />
                        ${le?'<span class="ws-check-dot">✓</span>':""}
                      </div>
                      <div class="ws-recipe-ings">
                        ${de?`🔒 Lv.${ee.unlockLevel}`:ge}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${ve(Math.max(5,Math.round(ee.craftSec*U)))}</div>
                    </button>
                  `}).join(""),Z=B[0],se=Z?Math.max(0,Math.ceil((Z.endsAt-i)/1e3)):0,oe=Z?Ee[Z.goodId]:null,ue=Array.from({length:Math.max(1,G-1)},(ee,ae)=>{const F=B[ae+1];if(F){const X=Ee[F.goodId];return`
                    <div class="ws-slot-card filled" title="Đang chờ: ${m(X.name)}">
                      <img src="/trang-trai-hang-soc/sprites/${X.iconKey}.webp" alt="${m(X.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `}return ae===B.length-(Z?1:0)?`
                    <div class="ws-slot-plus" title="Thêm vào khay">
                      <span>+</span>
                    </div>
                  `:`
                  <div class="ws-slot-card empty" title="Trống">
                    <span style="font-size:11px;font-weight:700;opacity:0.65;">Trống</span>
                  </div>
                `}).join("");return`
                <div class="ws-inspector-board">
                  ${W}
                  <div class="ws-recipe-grid">${K}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${Z?"baking":""}">
                      <div class="ws-oven-arch">
                        ${oe?`<img src="/trang-trai-hang-soc/sprites/${oe.iconKey}.webp" alt="${m(oe.name)}" class="ws-oven-good-img" />`:'<span style="font-size:18px;">🪵</span>'}
                      </div>
                      <div class="ws-oven-caption">
                        ${Z?`<strong data-insp-live="ws-timer">${me(se)}</strong>`:'<strong data-insp-live="ws-timer">Trống</strong>'}
                      </div>
                      ${Z?'<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>':""}
                    </div>
                    <div class="ws-queue-slots">${ue}</div>
                  </div>
                </div>
              `})():"",_=g.isAnimalPasturePlot&&!r?(()=>{if(!s.pastureAnimalId)return`
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>Chọn thú</span>
                    </div>
                    <div class="seed-picker-grid">${Object.values(Le).map(X=>{const de=!e.sim.state.sandboxMode&&e.sim.state.level<X.unlockLevel;return`
                      <button
                        type="button"
                        class="seed-card ${de?"locked":""}"
                        data-stock-animal="${X.id}"
                        ${de?"disabled":""}
                      >
                        <span class="seed-card-seed-badge ${de?"is-locked":"has-seed"}">
                          ${de?`Cấp ${X.unlockLevel}`:`🪙${X.cost.toLocaleString("vi-VN")}`}
                        </span>
                        <img src="/trang-trai-hang-soc/sprites/${X.spritePair[0]}.webp" alt="${m(X.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${m(X.name)}</span>
                        <span class="seed-card-meta">${ve(X.cycleSec)} · +🪙${X.sellValue}</span>
                      </button>
                    `}).join("")}</div>
                  </div>
                `;const x=Le[s.pastureAnimalId],B=s.pastureReadyAt??i,N=s.pastureStockedAt??B-x.cycleSec*1e3,G=Math.max(0,Math.ceil((B-i)/1e3)),U=G<=0,W=U?100:Math.max(6,Math.min(98,Math.round((i-N)/Math.max(1e3,B-N)*100))),K=x.goodId?ce(x.goodId):null,Z=e.sim.getAvailableGourmetFeedCrop(),se=Z?he[Z]:null,oe=Math.max(0,Math.floor(e.sim.state.herbalCompost??0)),ue=s.pastureGourmetBoost?2:1,ee=Math.round(x.sellValue*(s.pastureGourmetBoost?1.5:1)),ae=s.pastureGourmetBoost?2:1;return`
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/trang-trai-hang-soc/sprites/${x.spritePair[0]}.webp" alt="${m(x.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div class="hs-insp-title">${m(x.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;" data-insp-live="pasture-timer">
                        ${U?`🧺 +${ee} Sickle${K?` +${x.yieldQty*ue} ${m(K.name)}`:""} +${ae} 🌿`:`⏱️ ${me(G)}${s.pastureGourmetBoost?" · 🌽 ×2":""}`}
                      </div>
                      <div class="hs-stat-pills">
                        <span class="hs-stat-pill" title="Thu hoạch nhận thêm Phân Ủ Thảo Dược">🌿 +${ae} (Kho: ×${e.sim.state.sandboxMode?"∞":oe})</span>
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="pasture-bar" style="width:${W}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${U?`
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${ee} Sickle · +${ae}🌿)
                          </button>
                        `:`
                          ${s.pastureFedBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho thú ăn cỏ thường">🌾 Đã cho ăn</span>':`
                                <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;" title="Cho thú ăn cỏ giúp rút ngắn 35% thời gian chờ">
                                  🌾 Cho ăn (-35%)
                                </button>
                              `}
                          ${s.pastureGourmetBoost?'<span class="hs-stat-pill is-active" style="flex:1;justify-content:center;" title="Đã cho ăn khẩu phần thượng hạng: nhân đôi sản vật và nhận 2 Phân Ủ">🌿 Đã ăn (×2 · +2🌿)</span>':`<button id="btnInspFeedPastureGourmet" type="button" class="brass-btn ${se||e.sim.state.sandboxMode?"gold-cta":""}" style="flex:1;" title="Cho ăn ${e.sim.state.sandboxMode?0:ea} nông sản để nhân đôi sản vật và nhận 2 Phân Ủ">${se?se.emoji:"🌽"} Thượng hạng (×2 · +2🌿)</button>`}
                        `}
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${!U&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 -15p (×${e.sim.state.morningDewPhials??0})
                          </button>`:""}
                  </div>
                </div>
              `})():"",P=`${g.isFarmlandPlot?"Ruộng":g.isAnimalPasturePlot?"Đồng cỏ":g.connectableGroup==="flower_garden"?"Vườn hoa":g.workshopGroupId?"Xưởng":`${s.visitorsServed} lượt`}${b?` · ${L}/${Aa}`:""}`;t.classList.remove("hidden"),t.classList.toggle("inspector-wide-ws",!!((g.workshopGroupId||g.isFarmlandPlot||g.isAnimalPasturePlot)&&!r)),e.syncHudFocusVisibility();const z=fs(g),Q=a?t.scrollTop:0;t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-head-main">
            ${z?`<img src="${z}" alt="${m(g.name)}" class="inspector-thumb" />`:""}
            <div class="hs-insp-head-copy">
              <div class="hs-insp-title">${m(g.name)}</div>
              <div class="hs-insp-meta"><span class="hs-insp-stars-inline">${"★".repeat(s.stars)}${"☆".repeat(5-s.stars)}</span> · ${P}${l?"":' · <span class="hs-insp-warn">Chưa nối đường</span>'}${u>1?` · +${Math.round((u-1)*100)}%`:""}</div>
            </div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        ${q}
        ${_}
        ${D}
        ${g.id==="burrow_apple_orchard"&&!r?s.needsTreeRevival?`<div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                  <div style="font-weight:700;margin-bottom:6px;">🍎 Cây táo cần hồi sinh sau 3 vụ (bón 1 🌿 Phân Ủ hoặc nhờ bạn bè chăm giúp)</div>
                  <button id="btnInspReviveTree" type="button" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">🌿 Hồi sinh Vườn Táo (+2 🍎)</button>
                </div>`:`<div class="hs-insp-drop-meta">🍎 Mùa trái cây lâu năm: còn <strong>${Math.max(0,3-(s.orchardHarvestsUsed??0))}/3</strong> vụ trước khi cần hồi sinh</div>`:""}

        ${g.producesIngredient&&!r?`<div class="hs-insp-drop-meta">Rơi: <strong>${Pt[g.producesIngredient].name}</strong></div>`:""}

        ${r?(()=>{const x=Math.max(0,s.buildReducedSec??0),B=Math.max(1e3,g.buildDurationSec*1e3,s.constructEndsAt-(s.placedAt||i-1e3)+x*1e3),N=Math.max(1,Math.min(99,Math.floor((1-(s.constructEndsAt-i)/B)*100))),G=e.sim.getBuildingMinFloorSec(s),U=Math.max(0,p-G),W=U<=0&&e.sim.getActiveConstructions(i).some(se=>se.uid!==s.uid&&Math.ceil((se.constructEndsAt-i)/1e3)>e.sim.getBuildingMinFloorSec(se)),K=U>0||W,Z=g.isCreatureHabitat?"Tiến độ ấp trứng":"Tiến độ xây dựng";return`
                  <div class="hs-insp-build-wrap">
                    <div class="hs-insp-build-head">
                      <span>${g.isCreatureHabitat?"Đang ấp":"Đang xây"} · <strong data-insp-live="build-timer">${me(p)}${x>0?` (−${ve(x)})`:""}</strong></span>
                      <span data-insp-live="build-pct">${N}%</span>
                    </div>
                    <progress class="ts-build-progress" data-insp-live="build-bar" max="100" value="${N}" aria-label="${Z}"></progress>
                    <div class="hs-insp-actions-row">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta hs-insp-speed-btn" ${K?"":"disabled"} title="Thắng 1 màn trừ 30–75p giờ xây">Khảo thí −30p</button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn hs-insp-speed-btn" ${K?"":"disabled"} title="Đố ngoại ngữ trừ 10–25p giờ xây">Thần chú −10p</button>
                      ${U>0&&((e.sim.state.morningDewPhials??0)>0||e.sim.state.sandboxMode)?`<button type="button" class="brass-btn" data-use-morning-dew="1" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">−15p ×${e.sim.state.morningDewPhials??0}</button>`:""}
                      ${e.sim.state.sandboxMode?'<button id="btnFinishNowSand" type="button" class="brass-btn" title="Hoàn tất ngay">Xong</button>':""}
                      ${s.isIndestructible?"":'<button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình">Dời</button>'}
                    </div>
                  </div>
                `})():s.awaitingUnveil?`
                <div class="hs-insp-actions-row">
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="flex:1;">Cắt băng khánh thành</button>
                </div>
              `:g.baseIncome>0?(()=>{const x=e.sim.getActiveFestival()==="quidditch_cup"?.85:1,B=Zt(s,g),N=g.isAnimalPasturePlot&&s.pastureAnimalId?Le[s.pastureAnimalId]:null,G=Math.max(1,B*x),U=Math.max(0,(i-(s.lastTickAt||i))/1e3),W=Math.max(1,Math.ceil(G-U%G));return`
                    <div class="hs-insp-prod-row">
                      <div class="hs-insp-prod-copy">
                        <strong id="lblBuildingProdVal">+${N?.sellValue??y.galleons}🪙 +${N?.xp??y.xp}⭐</strong> / ${ve(N?.cycleSec??B)}${g.cycleSec>0&&!g.isFarmlandPlot&&!g.isAnimalPasturePlot?` · <span data-insp-live="prod-cycle">${me(W)}</span>`:""} · Kho: <strong>${s.storedSickle}🪙</strong>
                      </div>
                      ${s.storedSickle>0?`<button id="btnCollectSingle" type="button" class="brass-btn gold-cta">Thu +${s.storedSickle} Sickle</button>`:""}
                    </div>
                  `})():""}

        ${b&&!r&&!g.isFlooPortal&&s.isBrokenDown?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
                  <span>Độ bền</span>
                  <span style="color:${s.isBrokenDown?"#dc2626":s.durability<50?"#b45309":"#15803d"};">${Math.round(s.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(s.durability)}" aria-label="Độ bền"></progress>
                ${s.isBrokenDown||s.durability<98?`<button id="btnRepairRide" type="button" class="brass-btn ${s.isBrokenDown?"gold-cta":""}" style="width:100%;margin-top:6px;">Sửa (0 Sickle)</button>`:""}
              </div>
            `:""}

        

        ${g.isCustomCoasterStation&&s.coasterStats&&!r?`
              <div class="hs-insp-prod-row">
                <span class="hs-insp-prod-copy">Ray ${s.coasterStats.lengthMeters}m · Hứng khởi ${s.coasterStats.excitement}/10</span>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta">Tự lắp ray</button>
              </div>
            `:""}

        ${w?`
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Ride Cam</button>
            `:""}

        ${(g.isWorkshopBrewery||g.producesIngredient||g.isFireworksLauncher)&&!r?`
              <div class="hs-insp-actions-row" style="margin-bottom:6px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">Xưởng</button>
                ${g.isFireworksLauncher?'<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">Pháo hoa</button>':""}
              </div>
            `:""}

        ${g.isCreatureHabitat&&!r?`
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>${m(s.creatureNickname||g.creatureName||g.name)}</strong>
                  <span class="morph-pill ${s.creatureMorph==="radiant"?"radiant":s.creatureMorph==="mystic"?"mystic":""}">
                    ${ta[s.creatureMorph??"normal"].badge}
                  </span>
                </div>
                <div>Lv.${s.creatureBondLevel??1}/${sa} · ${v[s.creatureStage??"baby"]} · Môi trường ${H?.score??50}% · No ${Math.round(s.creatureHunger??90)}%</div>
                <div class="hs-insp-actions-row" style="margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">Cho ăn</button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1;">Vali</button>
                </div>
              </div>
            `:""}

        ${g.isBackstage&&O&&!r?`
              <div class="hs-insp-drop-meta" style="color:${O.isShielded?"#15803d":"#dc2626"};">
                Che chắn: ${O.shieldCount}/${O.needed} ${O.isShielded?"✓ (+25% Sickle)":""}
              </div>
            `:""}

        ${g.id==="burrow_honeydukes_canon"&&!r?`
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Vào Bùa Gặt Honeydukes</button>
            `:""}

        ${(g.id==="burrow_owl_post"||g.id==="eeylops_owl_emporium")&&!r?'<button id="btnInspOpenOwlOrders" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Bảng Đơn Hàng Cú</button>':""}
        ${g.id==="burrow_feast_marquee"&&!r?'<button id="btnInspOpenFeastMarquee" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Đại Tiệc Mùa Gặt</button>':""}
        ${g.id==="floo_fireplace_gate"&&!r?'<button id="btnInspOpenNeighbors" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Sổ Hàng Xóm &amp; Cổng Floo</button>':""}
        ${r?"":`<div class="hs-insp-actions-row">
                ${s.stars<5?`<button id="btnUpgStar" type="button" class="brass-btn hs-insp-upg-btn">${g.workshopGroupId?`Nâng ${s.stars+1}★ (+1 khay, −8% giờ lò)`:`Nâng ${s.stars+1}★`} · 🌟${aa(s.stars)} + 🪙${C.toLocaleString("vi-VN")}</button>`:'<span class="hs-insp-max-stars">5★ Tối đa</span>'}
              </div>`}
        ${!s.isIndestructible&&!e.sim.isVisitingNeighbor?`<div class="inspector-build-actions ${!r&&e.sim.canStashBuilding(s.uid)?"has-stash":""}" role="group" aria-label="Thao tác công trình">
                <button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình miễn phí (0 Sickle)">Dời</button>
                <button id="btnRotateThis" type="button" class="brass-btn" title="Xoay hướng công trình 90°">Xoay</button>
                ${!r&&e.sim.canStashBuilding(s.uid)?'<button id="btnStashThis" type="button" class="brass-btn hs-insp-stash-btn" title="Cất vào Kho Trang Trí (đặt lại miễn phí 0 Sickle)">Cất</button>':""}
                <button id="btnDeleteThis" type="button" class="brass-btn inspector-delete-btn" title="Xóa công trình">Xóa</button>
              </div>`:""}
      `,Q>0&&(t.scrollTop=Q);const j=t.querySelector("#inpBuildingPrice");j&&(e.wireRangeProgressFallback(j),j.addEventListener("input",()=>{const x=Number(j.value);e.sim.setBuildingCustomPrice(s.uid,x);const B=e.sim.getEffectivePrice(s,g),N=t.querySelector("#lblBuildingPriceVal");N&&(N.textContent=`${B} Sickle`);const G=e.sim.getPriceValueVerdict(s,g),U=t.querySelector("#lblPriceVerdict");U&&(U.textContent=G.label,U.style.color=G.color);const W=e.sim.getBuildingProductionPerCycle(s,g),K=t.querySelector("#lblBuildingProdVal");K&&(K.textContent=`+${W.galleons} 🪙 & +${W.xp} ⭐`)})),t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,J(e)}),t.querySelector("#btnInspUnveilBuilding")?.addEventListener("click",()=>{e.sim.unveilBuilding(s.uid),e.inspectSelection=null,e.refreshAll()}),t.querySelector("#btnInspPlayMinigameSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=s.uid,e.inspectSelection=null,e.refreshAll(),e.openTrialMinigame()}),t.querySelector("#btnInspQuizSpeed")?.addEventListener("click",()=>{e.sim.preferredSpeedupBuildingUid=s.uid,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat")}),t.querySelector("#btnFinishNowSand")?.addEventListener("click",()=>{e.sim.speedUpWithTimeSand(s.uid,!0),J(e)}),t.querySelectorAll("[data-use-morning-dew]").forEach(x=>{x.addEventListener("click",()=>{const B=e.sim.useMorningDewPhial(s.uid);e.showToast(B.msg,B.ok?"🧪":"⏳"),J(e),e.refreshHeader()})}),t.querySelector("#btnCollectSingle")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),J(e)}),t.querySelector("#btnInspOpenSeedQuiz")?.addEventListener("click",()=>{const x=s.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(e.activeSeedCropId??"ottery_wheat",x)}),t.querySelector("#btnInspReplantLast")?.addEventListener("click",()=>{const x=e.sim.replantPlotLastCrop(s.uid);if(x.needSeedAcquire&&x.cropId){const B=s.uid;e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(x.cropId,B);return}e.showToast(x.msg,x.ok?"🌱":"🪙"),x.ok?(e.inspectSelection=null,e.refreshAll()):J(e)}),t.querySelector("#btnInspReviveTree")?.addEventListener("click",()=>{const x=e.sim.reviveFruitTree(s.uid);e.showToast(x.msg,x.ok?"🍎":"🌿"),J(e),e.refreshHeader()}),t.querySelectorAll("[data-plant-crop]").forEach(x=>{x.addEventListener("click",()=>{const B=x.dataset.plantCrop,N=e.sim.plantCropOnPlot(s.uid,B);if(N.needSeedAcquire){const G=s.uid;e.activeSeedCropId=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(B,G);return}if(e.showToast(N.msg,N.ok?"🌱":"🪙"),N.ok){const G=!!e.sim.state.sandboxMode||e.sim.getSeedCount(B)>0;e.activeSeedCropId=G?B:null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}J(e),e.renderSeedTray(),e.refreshFloatingBanner()})}),t.querySelectorAll("[data-insp-buy-seed]").forEach(x=>{x.addEventListener("click",B=>{B.stopPropagation();const N=x.dataset.inspBuySeed,G=e.sim.buyCropSeedWithGold(N,1);e.showToast(G.msg,G.ok?"🌱":"🪙"),G.ok&&(e.activeSeedCropId=N,J(e),e.renderSeedTray(),e.refreshHeader(),e.refreshFloatingBanner())})}),t.querySelectorAll("[data-insp-seed-filter]").forEach(x=>{x.addEventListener("click",()=>{const B=x.dataset.inspSeedFilter;(B==="all"||B==="flowers"||B==="crops")&&(e.seedFilterMode=B,J(e))})}),t.querySelectorAll("[data-stock-animal]").forEach(x=>{x.addEventListener("click",()=>{const B=x.dataset.stockAnimal,N=e.sim.stockAnimalOnPasture(s.uid,B);if(e.showToast(N.msg,N.ok?Le[B]?.emoji??"🐾":"🪙"),N.ok){e.activePastureAnimalId=null,e.pastureTrayOpen=!1,e.inspectSelection=null,e.refreshAll();return}J(e)})}),t.querySelector("#btnInspFeedPasture")?.addEventListener("click",()=>{const x=e.sim.feedAnimalPasture(s.uid);e.showToast(x.msg,x.ok?"🌾":"⏳"),J(e)}),t.querySelector("#btnInspFeedPastureGourmet")?.addEventListener("click",()=>{const x=e.sim.feedAnimalPastureGourmet(s.uid);e.showToast(x.msg,x.ok?"🌽":"🧺"),J(e),e.refreshHeader()}),t.querySelectorAll("[data-insp-upgrade-soil]").forEach(x=>{x.addEventListener("click",()=>{const B=e.sim.upgradePlotSoilTier(s.uid);e.showToast(B.msg,B.ok?"🌱":"🪙"),J(e),e.refreshHeader()})}),t.querySelectorAll("[data-insp-compost-plot]").forEach(x=>{x.addEventListener("click",()=>{const B=e.sim.fertilizeCropPlotWithCompost(s.uid);e.showToast(B.msg,B.ok?"🌿":"🧺"),J(e),e.refreshHeader()})}),t.querySelector("#btnInspHarvestPasture")?.addEventListener("click",()=>{const x=e.sim.harvestAnimalPasture(s.uid);e.showToast(x.msg,x.ok?"🧺":"⏳"),J(e)}),t.querySelector("#btnInspClearPasture")?.addEventListener("click",()=>{const x=e.sim.clearAnimalFromPasture(s.uid);e.showToast(x.msg,x.ok?"🐾":"⚠️"),J(e)}),t.querySelector("#btnInspWaterCrop")?.addEventListener("click",()=>{const x=e.sim.waterCropPlot(s.uid);e.showToast(x.msg,x.ok?"💧":"⏳"),J(e)}),t.querySelector("#btnInspHarvestCrop")?.addEventListener("click",()=>{const x=e.sim.harvestCropPlot(s.uid);e.showToast(x.msg,x.ok?"🌾":"🏡"),J(e)}),t.querySelector("#btnInspCollectGoods")?.addEventListener("click",()=>{e.sim.harvestBuildingBubble(s.uid),J(e)}),t.querySelectorAll("[data-ws-enqueue]").forEach(x=>{x.addEventListener("click",()=>{const B=x.dataset.wsEnqueue,N=e.sim.enqueueWorkshopRecipe(s.uid,B);e.showToast(N.msg,N.ok?"🔥":"🧺"),J(e)})}),t.querySelector("#btnInspSpeedSlot")?.addEventListener("click",()=>{e.sim.speedUpWorkshopSlot(s.uid),J(e)}),t.querySelector("#btnRepairRide")?.addEventListener("click",()=>{e.sim.repairBuilding(s.uid),J(e)}),t.querySelector("#btnAutoLoopCoaster")?.addEventListener("click",()=>{e.sim.autoBuildCoasterForStation(s.uid),J(e)}),t.querySelector("#btnEnterRideCam")?.addEventListener("click",()=>{e.rideCamUid=s.uid,e.inspectSelection=null,J(e),e.refreshFloatingBanner(),e.showToast(`🎥 Đang ngồi thử trên "${g.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`,"🎢")}),t.querySelector("#btnInspOpenWorkshop")?.addEventListener("click",()=>{e.openWorkshopDialog("brew")}),t.querySelector("#btnInspFireworks")?.addEventListener("click",()=>{e.sim.launchFireworksShow(10),e.showToast("🎆 Rồng Lửa bay vút lên bầu trời đêm!","🎆")}),t.querySelector("#btnFeedBeast")?.addEventListener("click",()=>{e.sim.feedCreature(s.uid),J(e)}),t.querySelector("#btnInspOpenSuitcase")?.addEventListener("click",()=>{e.openSuitcaseDialog("care",s.uid)}),t.querySelector("#btnInspOpenHoneydukesMatch3")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openMatch3Dialog()}),t.querySelector("#btnInspOpenOwlOrders")?.addEventListener("click",()=>{e.inspectSelection=null,e.activeQuestTab="orders",e.refreshAll(),e.renderQuestDialog(),e.root.querySelector("#questDialog")?.showModal()}),t.querySelector("#btnInspOpenFeastMarquee")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openHarvestFeastDialog()}),t.querySelector("#btnInspOpenNeighbors")?.addEventListener("click",()=>{e.inspectSelection=null,e.refreshAll(),e.openNeighborDialog("friends")}),t.querySelector("#btnUpgStar")?.addEventListener("click",()=>{const x=e.sim.upgradeBuildingStar(s.uid);e.showToast(x.msg,x.ok?"🌟":"🪙"),J(e)}),t.querySelector("#btnMoveThis")?.addEventListener("click",()=>{ne(e),e.moveModeActive=!0,e.moveKeepActiveAfterDrop=!1,e.movingBuildingUid=s.uid,e.rotation=s.rotation,e.inspectSelection=null,e.collapseBuildDock(),e.onStartMoveBuilding?.(s.uid),e.refreshAll(),e.showToast(`✋ Đang nhấc "${g.name}" — chạm ô đất mới trên bản đồ để đặt xuống!`,"✋")}),t.querySelector("#btnStashThis")?.addEventListener("click",()=>{const x=e.sim.stashBuilding(s.uid);x.ok&&(e.inspectSelection=null,e.refreshAll()),e.showToast(x.msg,x.ok?"📦":"⚠️")}),t.querySelector("#btnRotateThis")?.addEventListener("click",()=>{const x=e.sim.rotatePlacedBuilding(s.uid);if(!x.ok){e.showToast(x.reason??"Không thể xoay công trình tại vị trí này!","⚠️");return}e.rotation=x.newRotation??s.rotation,J(e),e.refreshHeader(),e.refreshDock(),e.showToast(`🔄 Đã xoay "${g.name}" (${(x.newRotation??0)*90}°)`,"🔄")}),t.querySelector("#btnDeleteThis")?.addEventListener("click",()=>{const x=e.sim.getRemovalLossText(s.gx,s.gy);x?e.askConfirm(x).then(B=>{B&&ie()}):ie()});const ie=()=>{e.sim.beginBuildStroke();let x=!1;try{x=e.sim.removeAtTile(s.gx,s.gy)}finally{e.sim.commitBuildStroke()}x&&(e.inspectSelection=null,e.refreshAll(),e.showToast(`🧹 Đã xóa "${g.name}" (có thể bấm ↶ Hoàn tác trong Xây Dựng nếu nhầm).`,"🧹"))};return}if(e.inspectSelection.kind==="staff"){delete t.dataset.inspSig;const n=e.inspectSelection.id,s=e.sim.staff.find(r=>r.id===n);if(!s){e.inspectSelection=null,t.classList.add("hidden"),e.syncHudFocusVisibility();return}const g=e.sim.state.staffPatrolZones?.[s.id]??s.patrolZoneId??"all",i=new Set(e.sim.state.unlockedZones);t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div class="hs-insp-title">${m(s.name)}</div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        <div class="hs-insp-drop-meta">"${m(s.actionText)}"</div>

        <div class="hs-insp-actions-row">
          <select id="selInspPatrolZone" aria-label="Khu vực tuần tra" style="flex:1;min-height:40px;padding:6px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${g==="all"?"selected":""}>Toàn bộ</option>
            ${je.filter(r=>e.sim.state.sandboxMode||i.has(r.id)).map(r=>`<option value="${r.id}" ${g===r.id?"selected":""}>${r.name}</option>`).join("")}
          </select>
          <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta">Gắp</button>
        </div>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,J(e)}),t.querySelector("#selInspPatrolZone")?.addEventListener("change",r=>{const p=r.currentTarget.value;e.sim.setStaffPatrolZone(s.id,p),e.showToast(`Đã phân công ${s.name}.`,"📍")}),t.querySelector("#btnPickInspStaff")?.addEventListener("click",()=>{ne(e),e.pincerActive=!0,e.pincerPicked={kind:"staff",id:s.id,label:s.name},e.inspectSelection=null,e.refreshAll()});return}if(e.inspectSelection.kind==="zone"){delete t.dataset.inspSig;const n=us(e.inspectSelection.zoneId),s=_t(n),g=n.unlockCost>0?` · ${n.unlockCost.toLocaleString("vi-VN")} Sickle`:"",i=e.sim.state.level>=n.unlockLevel||e.sim.state.sandboxMode;t.classList.remove("hidden"),t.classList.remove("inspector-wide-ws"),e.syncHudFocusVisibility(),t.innerHTML=`
        <div class="inspector-header-bar">
          <div>
            <div class="hs-insp-title">${m(n.name)}</div>
            <div class="hs-insp-meta">Cấp ${n.unlockLevel} · 🌟 ${s}${g}</div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${i?"gold-cta":""}" style="width:100%;">Mở khu vực · 🌟 ${s}${g}</button>
      `,t.querySelector("#btnCloseInsp")?.addEventListener("click",()=>{e.inspectSelection=null,J(e)}),t.querySelector("#btnConfirmUnlockZone")?.addEventListener("click",()=>{const r=e.sim.unlockZone(n.id);e.showToast(r.msg,r.ok?"✨":"🔒"),r.ok&&(e.inspectSelection=null,e.refreshAll())})}}function Cs(e,t){t&&(e.activeWorkshopTab=t),re(e);const o=e.root.querySelector("#workshopDialog");o.open||o.showModal()}function nn(e,t,o){e.collapseBuildDock(),et(e),ne(e),e.inspectSelection=null,e.pendingSowPlotUid=o??null,e.seedTrayOpen=!0,t&&(e.activeSeedCropId=t),e.refreshAll()}function Ge(e){e.seedTrayOpen=!1,e.activeSeedCropId=null,e.pendingSowPlotUid=null}function zn(e){e.seedTrayOpen?(Ge(e),e.refreshAll()):nn(e,e.activeSeedCropId??void 0)}function on(e,t,o){e.collapseBuildDock(),Ge(e),ne(e),e.inspectSelection=null,e.pendingStockPastureUid=o??null,e.pastureTrayOpen=!0,t&&(e.activePastureAnimalId=t),e.refreshAll()}function et(e){e.pastureTrayOpen=!1,e.activePastureAnimalId=null,e.pendingStockPastureUid=null}function Un(e){e.pastureTrayOpen?(et(e),e.refreshAll()):on(e,e.activePastureAnimalId??void 0)}function ln(e){const t=e.root.querySelector("#seedBrushTray"),o=e.root.querySelector("#btnOpenSeedSilo");if(o){const d=e.seedTrayOpen||!!e.activeSeedCropId;o.dataset.active=String(d),o.setAttribute("aria-pressed",String(d))}if(!t)return;if(e.photoModeActive||!e.seedTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(d=>Y(d.itemId)?.isFarmlandPlot&&!d.cropId&&Date.now()>=d.constructEndsAt).length,n=e.sim.state.buildings.filter(d=>Y(d.itemId)?.isFarmlandPlot).length,s=e.activeSeedCropId?he[e.activeSeedCropId]:null,i=Object.values(he).sort((d,c)=>d.unlockLevel-c.unlockLevel||d.growSec-c.growSec).filter(d=>e.seedFilterMode==="flowers"?!!d.isFlowerCrop:e.seedFilterMode==="crops"?!d.isFlowerCrop:!0),r=[{id:"all",label:"Tất cả"},{id:"flowers",label:"Hoa"},{id:"crops",label:"Cây"}].map(d=>`
          <button
            type="button"
            class="seed-filter-pill ${e.seedFilterMode===d.id?"active":""}"
            data-seed-filter="${d.id}"
            aria-pressed="${e.seedFilterMode===d.id}"
          >${d.label}</button>
        `).join(""),p=i.map(d=>{const c=!e.sim.state.sandboxMode&&e.sim.state.level<d.unlockLevel,T=e.activeSeedCropId===d.id,S=e.sim.getSeedCount(d.id),$=e.sim.state.cropMastery?.[d.id]??0,f=ct(0,!1,$,d.growSec).growSec,h=ve(f);return`
          <div class="seed-card-slot ${c?"locked":""} ${T?"selected":""} ${!c&&S<=0?"out-of-seeds":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${c?"locked":""} ${T?"selected":""} ${!c&&S<=0?"out-of-seeds":""}"
              data-seed-brush="${d.id}"
              aria-pressed="${T}"
              ${c?"disabled":""}
            >
              <span class="seed-card-seed-badge ${c?"is-locked":S>0?"has-seed":"no-seed"}">
                ${c?`Cấp ${d.unlockLevel}`:`×${S}`}
              </span>
              <img src="${At(d.id)}" alt="${m(d.name)}" class="seed-card-img" />
              <span class="seed-card-name">${m(d.name)}</span>
              <span class="seed-card-meta">${h}</span>
            </button>
            ${c?"":`<button type="button" class="seed-card-add-btn" data-acquire-seed="${d.id}" aria-label="Mua 1 hạt ${m(d.name)} (${d.seedCost.toLocaleString("vi-VN")} Sickle)" title="Mua 1 hạt ${m(d.name)} (${d.seedCost.toLocaleString("vi-VN")} Sickle)">+ 🪙${e.sim.state.sandboxMode?"0":d.seedCost.toLocaleString("vi-VN")}</button>`}
          </div>
        `}).join(""),y=t.querySelector(".seed-tray-scroll")?.scrollLeft??0;t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${s?`${m(s.name)} · ×${e.sim.getSeedCount(s.id)}`:"Hạt Giống & Hoa"}</span>
            <span class="seed-tray-sub">Trống ${a}/${n}</span>
          </div>
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Đố nhận hạt 0 Sickle">
            Đố nhận hạt
          </button>
          <button id="btnCloseSeedTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng túi hạt giống">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${r}</div>
          <div class="seed-tray-actions">
            ${e.pendingSowPlotUid&&e.sim.state.buildings.some(d=>d.uid===e.pendingSowPlotUid&&!d.isIndestructible)?'<button id="btnSeedTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời thửa đất này">Dời ô</button>':""}
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
      <div class="seed-tray-scroll">${p}</div>
    `;const C=t.querySelector(".seed-tray-scroll");C&&y>0&&(C.scrollLeft=y);const L=Date.now(),l=e.sim.state.buildings.filter(d=>Y(d.itemId)?.isFarmlandPlot),u=l.map(d=>d.uid),b=l.filter(d=>d.cropId&&d.cropReadyAt&&L>=d.cropReadyAt),w=l.filter(d=>d.cropId&&d.cropReadyAt&&L<d.cropReadyAt&&!d.cropWateredBoost),k=l.filter(d=>!d.cropId&&Date.now()>=d.constructEndsAt),I=t.querySelector("#btnSeedTrayPlantAll"),E=t.querySelector("#btnSeedTrayWaterAll"),R=t.querySelector("#btnSeedTrayHarvestAll");if(I){const d=k.length;I.disabled=d===0,I.textContent=`Gieo tất cả${d?` (${d})`:""}`,I.addEventListener("click",()=>{const c=e.activeSeedCropId;if(!c){e.showToast("🌱 Chọn một hạt giống trước để Gieo Tất Cả!","🪄");return}const T=e.sim.batchPlantCropPlots(k.map(S=>S.uid),c);e.showToast(T.msg,T.ok?"🌱":"🪄"),e.activeSeedCropId=null,e.refreshAll()})}if(E){const d=w.length;E.disabled=d===0,E.textContent=`Tưới tất cả${d?` (${d})`:""}`,E.addEventListener("click",()=>{const c=e.sim.batchWaterCropPlots(u);e.showToast(c.msg,c.ok?"💧":"🌱"),e.refreshAll()})}if(R){const d=b.length;R.disabled=d===0,R.textContent=`Gặt tất cả${d?` (${d})`:""}`,R.addEventListener("click",()=>{const c=e.sim.batchHarvestCropPlots(u);e.showToast(c.msg,c.ok?"🌾":"🌱"),e.refreshAll()})}t.querySelector("#btnSeedTrayReplantLast")?.addEventListener("click",()=>{const d=e.sim.batchReplantLastCrops();e.showToast(d.msg,d.ok?"🌱":"🪙"),e.refreshAll()}),t.querySelectorAll("[data-seed-filter]").forEach(d=>{d.addEventListener("click",c=>{c.stopPropagation();const T=d.dataset.seedFilter;(T==="all"||T==="flowers"||T==="crops")&&(e.seedFilterMode=T,ln(e))})}),t.querySelectorAll("[data-acquire-seed]").forEach(d=>{d.addEventListener("click",c=>{c.stopPropagation();const T=d.dataset.acquireSeed,S=e.sim.buyCropSeedWithGold(T,1);e.showToast(S.msg,S.ok?"🌱":"🪙"),S.ok&&(e.activeSeedCropId=T,e.refreshAll())})}),t.querySelector("#btnSeedTrayOpenQuiz")?.addEventListener("click",()=>{const d=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null),c=e.activeSeedCropId??"ottery_wheat";e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(c,d)}),t.querySelectorAll("[data-seed-brush]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.seedBrush,T=he[c],S=e.pendingSowPlotUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(!e.sim.state.sandboxMode&&e.sim.getSeedCount(c)<=0){e.activeSeedCropId=null,e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,e.refreshAll(),e.openSeedQuizDialog(c,S);return}if(e.pendingSowPlotUid=null,e.seedTrayOpen=!1,e.inspectSelection=null,S){const $=e.sim.state.buildings.find(f=>f.uid===S);if($&&Y($.itemId)?.isFarmlandPlot&&!$.cropId){const f=e.sim.plantCropOnPlot($.uid,c);if(f.needSeedAcquire){e.activeSeedCropId=null,e.refreshAll(),e.openSeedQuizDialog(c,$.uid);return}const h=!!e.sim.state.sandboxMode||e.sim.getSeedCount(c)>0;e.activeSeedCropId=f.ok&&h?c:null,e.showToast(f.msg,f.ok?"🌱":"🪙"),e.refreshAll();return}}e.activeSeedCropId=c,e.refreshAll(),e.showToast(`${T.name} · ${e.sim.getSeedCount(c)} hạt`,T.emoji)})}),t.querySelector("#btnSeedTrayMovePlot")?.addEventListener("click",()=>{const d=e.pendingSowPlotUid,c=d?e.sim.state.buildings.find(S=>S.uid===d):void 0;if(!c||c.isIndestructible)return;const T=Y(c.itemId);Ge(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=c.uid,e.rotation=c.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${T?.name??"Thửa đất"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnSeedTrayBuyPlot")?.addEventListener("click",()=>{const d=Y("farmland_plot");d&&(Ge(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=d,e.refreshAll(),e.showToast("Thửa đất · 30 Sickle/ô","🌱"))}),t.querySelector("#btnSeedTrayBuyFlowerGarden")?.addEventListener("click",()=>{const d=Y("burrow_flower_garden");d&&(Ge(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=d,e.refreshAll(),e.showToast("Vườn hoa · 55 Sickle/ô","🌸"))}),t.querySelector("#btnSeedTrayOpenBarn")?.addEventListener("click",()=>{e.seedTrayOpen=!1,e.pendingSowPlotUid=null,e.refreshAll(),Cs(e,"barn")}),t.querySelector("#btnCloseSeedTray")?.addEventListener("click",()=>{const d=e.activeSeedCropId;if(d&&(e.sim.state.sandboxMode||e.sim.getSeedCount(d)>0)){const c=e.pendingSowPlotUid;if(e.seedTrayOpen=!1,e.pendingSowPlotUid=null,c){const T=e.sim.state.buildings.find(S=>S.uid===c);if(T&&Y(T.itemId)?.isFarmlandPlot&&!T.cropId){const S=e.sim.plantCropOnPlot(T.uid,d),$=!!e.sim.state.sandboxMode||e.sim.getSeedCount(d)>0;e.activeSeedCropId=S.ok&&$?d:null,e.showToast(S.msg,S.ok?"🌱":"🪙")}}e.refreshAll();return}Ge(e),e.refreshAll()})}function jn(e){const t=e.root.querySelector("#pastureBrushTray"),o=e.root.querySelector("#btnOpenPastureTray");if(o){const l=e.pastureTrayOpen||!!e.activePastureAnimalId;o.dataset.active=String(l),o.setAttribute("aria-pressed",String(l))}if(!t)return;if(e.photoModeActive||!e.pastureTrayOpen){t.classList.add("hidden"),e.syncHudFocusVisibility();return}t.classList.remove("hidden"),e.syncHudFocusVisibility();const a=e.sim.state.buildings.filter(l=>Y(l.itemId)?.isAnimalPasturePlot&&!l.pastureAnimalId&&Date.now()>=l.constructEndsAt).length,n=e.sim.state.buildings.filter(l=>Y(l.itemId)?.isAnimalPasturePlot).length,s=e.activePastureAnimalId?Le[e.activePastureAnimalId]:null,g=Object.values(Le).map(l=>{const u=!e.sim.state.sandboxMode&&e.sim.state.level<l.unlockLevel,b=e.activePastureAnimalId===l.id;return`
          <div class="seed-card-slot pasture-card-slot ${u?"locked":""} ${b?"selected":""}">
            <button
              type="button"
              class="seed-card seed-tray-card ${u?"locked":""} ${b?"selected":""}"
              data-pasture-brush="${l.id}"
              aria-pressed="${b}"
              ${u?"disabled":""}
            >
              <span class="seed-card-seed-badge ${u?"is-locked":"has-seed"}">
                ${u?`Cấp ${l.unlockLevel}`:`🪙${l.cost.toLocaleString("vi-VN")}`}
              </span>
              <img src="/trang-trai-hang-soc/sprites/${l.spritePair[0]}.webp" alt="${m(l.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${m(l.name)}</span>
              <span class="seed-card-meta">${ve(l.cycleSec)} · +🪙${l.sellValue}</span>
            </button>
          </div>
        `}).join("");t.innerHTML=`
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${s?m(s.name):"Chăn Thả"}</span>
            <span class="seed-tray-sub">Trống ${a}/${n}</span>
          </div>
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn" title="Đặt Đồng Cỏ (45 Sickle)">
            + Đồng cỏ 🪙45
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-tray-actions">
            ${e.pendingStockPastureUid&&e.sim.state.buildings.some(l=>l.uid===e.pendingStockPastureUid&&!l.isIndestructible)?'<button id="btnPastureTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời ô đồng cỏ này">Dời ô</button>':""}
            <button id="btnPastureFeedAll" type="button" class="brass-btn" title="Cho tất cả đàn thú đang lớn ăn">Cho ăn tất cả</button>
            <button id="btnPastureCollectAll" type="button" class="brass-btn gold-cta" title="Thu hoạch tất cả sản vật đã sẵn sàng">Thu hoạch tất cả</button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${g}</div>
    `;const i=e.sim.state.buildings.filter(l=>Y(l.itemId)?.isAnimalPasturePlot).map(l=>l.uid),r=t.querySelector("#btnPastureFeedAll"),p=t.querySelector("#btnPastureCollectAll"),y=Date.now(),C=e.sim.state.buildings.filter(l=>Y(l.itemId)?.isAnimalPasturePlot&&l.pastureAnimalId&&l.pastureReadyAt&&y<l.pastureReadyAt&&!l.pastureFedBoost).length,L=e.sim.state.buildings.filter(l=>Y(l.itemId)?.isAnimalPasturePlot&&l.pastureAnimalId&&l.pastureReadyAt&&y>=l.pastureReadyAt).length;r&&(r.disabled=C===0,r.textContent=`Cho ăn tất cả${C?` (${C})`:""}`,r.addEventListener("click",()=>{const l=e.sim.batchFeedAnimalPastures(i);e.showToast(l.msg,l.ok?"🌾":"✨"),e.refreshAll()})),p&&(p.disabled=L===0,p.textContent=`Thu hoạch tất cả${L?` (${L})`:""}`,p.addEventListener("click",()=>{const l=e.sim.batchHarvestAnimalPastures(i);e.showToast(l.msg,l.ok?"🐾":"✨"),e.refreshAll()})),t.querySelectorAll("[data-pasture-brush]").forEach(l=>{l.addEventListener("click",()=>{const u=l.dataset.pastureBrush,b=Le[u];if(!b)return;const w=e.pendingStockPastureUid??(e.inspectSelection?.kind==="building"?e.inspectSelection.uid:null);if(e.pendingStockPastureUid=null,e.pastureTrayOpen=!1,e.inspectSelection=null,w){const k=e.sim.state.buildings.find(I=>I.uid===w);if(k&&Y(k.itemId)?.isAnimalPasturePlot&&!k.pastureAnimalId){const I=e.sim.stockAnimalOnPasture(k.uid,u);e.activePastureAnimalId=null,e.showToast(I.msg,I.ok?b.emoji:"🪙"),e.refreshAll();return}}e.activePastureAnimalId=u,e.refreshAll(),e.showToast(`${b.name} · ${b.cost.toLocaleString("vi-VN")} Sickle/ô`,b.emoji)})}),t.querySelector("#btnPastureTrayMovePlot")?.addEventListener("click",()=>{const l=e.pendingStockPastureUid,u=l?e.sim.state.buildings.find(w=>w.uid===l):void 0;if(!u||u.isIndestructible)return;const b=Y(u.itemId);et(e),e.collapseBuildDock(),e.inspectSelection=null,e.moveModeActive=!0,e.movingBuildingUid=u.uid,e.rotation=u.rotation,e.pendingTouchTile=null,e.refreshAll(),e.showToast(`Đang nhấc "${b?.name??"Đồng cỏ"}" — Nhấp vào ô đất mới để đặt xuống!`,"✋")}),t.querySelector("#btnPastureTrayBuyPlot")?.addEventListener("click",()=>{const l=Y("burrow_animal_pasture");l&&(et(e),e.collapseBuildDock(),e.inspectSelection=null,e.selectedCatalogItem=l,e.refreshAll(),e.showToast("Đồng cỏ · 45 Sickle/ô","🐾"))}),t.querySelector("#btnPastureTrayOpenBarn")?.addEventListener("click",()=>{e.pastureTrayOpen=!1,e.pendingStockPastureUid=null,e.refreshAll(),Cs(e,"barn")}),t.querySelector("#btnClosePastureTray")?.addEventListener("click",()=>{et(e),e.refreshAll()})}function Wn(e){const t=e.root.querySelector("#workshopDialogContent");if(!t)return;const o=e.sim.state,a=Date.now();if((o.supply.activeBrew?.goodId??null)!==e.lastWsBrewId){re(e);return}if(e.activeWorkshopTab==="cargo"){const s=o.supply.cargoCrates.map(g=>`${g.id}:${g.fulfilled?1:0}:${g.helpRequestedAt?1:0}:${g.helpedByNeighborName??""}`).join("|");if(t.dataset.cargoSig&&t.dataset.cargoSig!==s){re(e);return}}if(e.activeWorkshopTab==="brew"){const s=t.querySelector("#btnWsQuickHerb");if(s){const r=Math.max(0,Math.ceil((2e4-(a-(o.supply.lastHerbPlotHarvestAt||0)))/1e3)),p=r===0||o.sandboxMode;s.classList.toggle("gold-cta",p),s.textContent=p?"🌿 Hái Thảo Dược":`🌱 (${ve(r)})`}const g=t.querySelector("[data-ws-brew-left]");if(g&&o.supply.activeBrew){const r=dt.find(y=>y.id===o.supply.activeBrew?.goodId),p=Math.max(0,Math.ceil((o.supply.activeBrew.endsAt-a)/1e3));r&&(g.textContent=`🔥 ${r.emoji} ${r.name} (còn ${me(p)})`)}const i=t.querySelector("[data-ws-buff-banner]");if(i){const r=Math.max(0,Math.ceil(((o.supply.butterbeerBoostEndsAt||0)-a)/1e3)),p=Math.max(0,Math.ceil(((o.supply.felixBoostEndsAt||0)-a)/1e3));if(r<=0&&p<=0)i.classList.add("hidden");else{i.classList.remove("hidden");const y=[];r>0&&y.push(`🍻 +85% Sickle (${me(r)})`),p>0&&y.push(`🧪 +35%XP (${me(p)})`),i.textContent=`✨ ${y.join(" • ")}`}}}}const kt=new WeakMap;function rn(e,t){kt.set(e,t),e.dataset.wsDelegated!=="1"&&(e.dataset.wsDelegated="1",e.addEventListener("change",o=>{const a=kt.get(e);if(!a)return;const n=o.target;n&&n.id==="selStandItem"&&(a.selectedStandItemId=n.value,re(a))}),e.addEventListener("click",o=>{const a=kt.get(e);if(!a)return;const s=o.target?.closest("button");if(!s||s.disabled)return;const g=a.sim.state;if(s.dataset.pouchHint){a.showToast(s.dataset.pouchHint,s.dataset.pouchIcon||"✨");return}if(s.dataset.wsTab){a.activeWorkshopTab=s.dataset.wsTab,re(a),e.querySelector(`[data-ws-tab="${a.activeWorkshopTab}"]`)?.scrollIntoView?.({block:"nearest",inline:"nearest",container:"nearest"});return}if(s.dataset.sellSpotlight){const i=s.dataset.sellSpotlight==="good"?"good":"crop",r=a.sim.sellMarketSpotlightLot(i);r.ok||a.showToast(r.msg,"🎪"),re(a),a.refreshHeader();return}if(s.dataset.claimMarketDeal){const i=a.sim.fulfillMarketFairDeal(s.dataset.claimMarketDeal);i.ok||a.showToast(i.msg,"🎪"),re(a),a.refreshHeader();return}if(s.id==="btnRerollMarketFair"){const i=a.sim.rerollMarketFairDeals();i.ok||a.showToast(i.msg,"🎪"),re(a);return}if(s.id==="btnUpgradeFarmBarn"){const i=a.sim.upgradeFarmBarn();a.showToast(i.msg,i.ok?"🏡":"🔌"),re(a),a.refreshHeader();return}if(s.id==="btnCraftPhoenixTalisman"){const i=a.sim.craftPhoenixTalismanFromBarn();a.showToast(i.msg,i.ok?"🔥":"🧺"),re(a),a.refreshHeader();return}if(s.dataset.sellFarmItem){const i=a.sim.sellFarmItemFromBarn(s.dataset.sellFarmItem,1);i.ok||a.showToast(i.msg,"🧺"),re(a),a.refreshHeader();return}if(s.id==="btnWsQuickHerb"){const i=a.sim.quickHarvestHerbs();a.showToast(i.msg,i.ok?"🌿":"⏳"),re(a);return}if(s.id==="btnWsSpeedBrew"){a.sim.speedUpBrewing()&&re(a);return}if(s.dataset.brewGood){const i=a.sim.startBrewing(s.dataset.brewGood);a.showToast(i.msg,i.ok?"🧪":"⚠️"),re(a);return}if(s.dataset.useGood){const i=s.dataset.useGood,r=a.sim.useCraftedGood(i);r.ok?i==="dragon_firework"?a.root.querySelector("#workshopDialog")?.close():re(a):a.showToast(r.msg,"⚠️");return}if(s.dataset.fulfillCrate){const i=a.sim.fulfillCargoCrate(s.dataset.fulfillCrate);a.showToast(i.msg,i.ok?"📦":"⚠️"),re(a),a.refreshHeader();return}if(s.dataset.helpCargoCrate){const i=a.sim.requestCargoCrateHelp(s.dataset.helpCargoCrate);a.showToast(i.msg,i.ok?"🤝":"🚂"),re(a),a.refreshHeader();return}if(s.dataset.gotoBrew!==void 0){a.activeWorkshopTab="brew",re(a);return}if(s.dataset.jumpCargoItem){const i=s.dataset.jumpCargoItem;a.root.querySelector("#workshopDialog")?.close(),a.jumpToMissingFarmItem(i);return}if(s.dataset.activateHelper){const i=s.dataset.activateHelper,r=a.sim.activateFarmHelper(i);a.showToast(r.msg,r.ok?"🧙":"🪙"),re(a),a.refreshHeader();return}if(s.dataset.standTier){a.selectedStandPriceTier=s.dataset.standTier,re(a);return}if(s.dataset.standList){const i=Number(s.dataset.standList),r=a.sim.getFarmItemCount(a.selectedStandItemId),p=Math.max(1,Math.min(3,g.sandboxMode?2:r)),y=a.sim.listOnRoadsideStand(i,a.selectedStandItemId,p,a.selectedStandPriceTier);a.showToast(y.msg,y.ok?"🧺":"⚠️"),re(a),a.refreshHeader();return}if(s.dataset.standClaim){const i=Number(s.dataset.standClaim),r=a.sim.claimRoadsideStandSlot(i);a.showToast(r.msg,r.ok?"🪙":"🧺"),re(a),a.refreshHeader()}}))}function cn(e,t){if(t.activeWorkshopTab!=="barn"||e.dataset.activeWsTab!=="barn"||!e.querySelector('[data-barn-root="1"]'))return!1;const o=t.sim.state,a=Date.now(),n=t.sim.ensureFarmBarn(),s=t.sim.getBarnTotalUsed(),g=t.sim.ensureMarketFairState(),i=Math.max(0,Math.floor(o.herbalCompost??0)),r=Math.max(0,3-g.spotlightLotsSold),p=g.deals.filter(v=>!v.claimed&&(o.sandboxMode||t.sim.getFarmItemCount(v.inputItemId)>=v.inputQty)).length,y=r>0&&(o.sandboxMode||t.sim.getFarmItemCount(g.spotlightCropId)>=2||t.sim.getFarmItemCount(g.spotlightGoodId)>=1),C=p+(y?1:0),L=t.sim.ensureRoadsideStand(),l=L.slots.filter(v=>!!(v.itemId&&v.soldAt)).length,u=L.slots.filter(v=>!!v.itemId).length,b=o.supply.cargoCrates.filter(v=>v.fulfilled).length,w=t.sim.activeSynergies.activeIds.size,k=(v,q)=>{const D=e.querySelector(v);D&&D.textContent!==q&&(D.textContent=q)};k("#wsTabBarn .nb-tab-badge",`${s}/${n.capacity}`),k("#wsTabStand .nb-tab-badge",l>0?`${l} xong`:`${u}/6`),k("#wsTabMarket .nb-tab-badge",C>0?`${C} sẵn`:`${r}/3`),k("#wsTabCargo .nb-tab-badge",`${b}/3`),k("#wsTabSynergy .nb-tab-badge",`${w}/12`);const I=Math.min(100,Math.round(s/Math.max(1,n.capacity)*100)),E=t.sim.getBarnUpgradeCostInfo(),R=o.sandboxMode?"+20 Ô (Miễn phí)":E.hasPlug?`+20 Ô (1 🔌 + ${E.baseGoldCost} Sickle)`:`+20 Ô (${E.effectiveGoldCost} Sickle)`,d=E.hasPlug?`🔌 ×${E.plugsInBarn}`:`🔌 ×0 (bù +${E.plugShortageBuyout} Sickle)`;k("[data-barn-cap-label]",`🏡 Kho Đỏ (${s}/${n.capacity})`),k("[data-barn-sub-meta]",`🦉 ${n.ordersDelivered} · ${d}`);const c=e.querySelector("[data-barn-cap-bar]");c&&(c.style.width=`${I}%`);const T=e.querySelector("#btnUpgradeFarmBarn");T&&(T.disabled=!E.canAfford,T.textContent=R,T.style.opacity=E.canAfford?"":"0.55",T.style.cursor=E.canAfford?"":"not-allowed");const S=t.sim.getPhoenixTalismanCount(),$=t.sim.getPhoenixTalismanDailyStatus(),f=t.sim.getCraftablePhoenixBarnGood(),h=f?ce(f):null,M=o.sandboxMode||S<He&&!!f&&o.galleons>=yt,A={dew:o.sandboxMode?"∞":`×${Math.max(0,Math.floor(o.morningDewPhials??0))}`,compost:o.sandboxMode?"∞":`×${i}`,sand:o.sandboxMode?"∞":`×${Math.max(0,Math.floor(o.timeSand??0))}`,plug:o.sandboxMode?"∞":`×${E.plugsInBarn}`,talisman:o.sandboxMode?"∞":`${S}/${He}`,tokens:`×${Math.max(0,Math.floor(t.sim.ensureNeighborSocial().friendshipTokens??0))}`};for(const[v,q]of Object.entries(A))k(`[data-pouch-id="${v}"] [data-pouch-qty]`,q);const H=e.querySelector("[data-helper-status]");H&&(n.farmHelperEndsAt&&n.farmHelperEndsAt>a?H.innerHTML=`<span style="color:#15803d;">Đang trực (${ve(Math.ceil((n.farmHelperEndsAt-a)/1e3))})</span>`:H.textContent="Tự động tưới luống mới & gom thành phẩm xưởng vào Kho Đỏ");const O=e.querySelector('[data-activate-helper="free_daily"]');O&&n.farmHelperFreeDayKey===vs()&&O.remove(),k("[data-talisman-title]",`🔥 Bùa Phượng Hoàng (${o.sandboxMode?"∞":`${S}/${He}`})`),k("[data-talisman-sub]",`Hôm nay: ${$.usedCount}/${$.maxDaily} môn`);const V=e.querySelector("#btnCraftPhoenixTalisman");return V&&(V.disabled=!M,V.textContent=`🔥 Rèn +1 (${h?`1 ${h.name}`:"1 Đặc sản"} + ${yt} Sickle)`),e.querySelectorAll("[data-barn-card]").forEach(v=>{const q=v.dataset.barnCard,D=t.sim.getFarmItemCount(q),_=D>0||o.sandboxMode;v.classList.toggle("in-stock",D>0),v.classList.toggle("empty",D<=0);const P=v.querySelector("[data-barn-qty]"),z=`×${o.sandboxMode?"∞":D}`;P&&P.textContent!==z&&(P.textContent=z,v.classList.remove("is-patched-pop"),v.offsetWidth,v.classList.add("is-patched-pop"));const Q=v.querySelector("[data-sell-farm-item]");Q&&(Q.disabled=!_,Q.classList.toggle("gold-cta",_))}),!0}function re(e){const t=e.root.querySelector("#workshopDialogContent");if(!t||(rn(t,e),cn(t,e)))return;const o=t.dataset.activeWsTab??"",a=We(t),n=e.sim.state,s=Date.now();e.lastWsBrewId=n.supply.activeBrew?.goodId??null;const g=e.sim.activeSynergies.activeIds.size,i=n.supply.cargoCrates.filter(d=>d.fulfilled).length,r=e.sim.ensureFarmBarn(),p=e.sim.getBarnTotalUsed(),y=e.sim.ensureMarketFairState(),C=Math.max(0,Math.floor(n.herbalCompost??0)),L=Math.max(0,3-y.spotlightLotsSold),l=y.deals.filter(d=>!d.claimed&&(n.sandboxMode||e.sim.getFarmItemCount(d.inputItemId)>=d.inputQty)).length,u=L>0&&(n.sandboxMode||e.sim.getFarmItemCount(y.spotlightCropId)>=2||e.sim.getFarmItemCount(y.spotlightGoodId)>=1),b=l+(u?1:0),w=e.sim.ensureRoadsideStand(),k=w.slots.filter(d=>!!(d.itemId&&d.soldAt)).length,I=w.slots.filter(d=>!!d.itemId).length,E=`
      <div class="workshop-tabs" role="tablist" aria-label="Kho, Sạp Ngõ, Chợ Phiên &amp; Xưởng">
        <button type="button" role="tab" id="wsTabBarn" data-ws-tab="barn" data-active="${e.activeWorkshopTab==="barn"}" aria-selected="${e.activeWorkshopTab==="barn"}" class="brass-btn">
          <span class="nb-tab-ico">🏡</span> Kho <span class="nb-tab-badge">${p}/${r.capacity}</span>
        </button>
        <button type="button" role="tab" id="wsTabStand" data-ws-tab="stand" data-active="${e.activeWorkshopTab==="stand"}" aria-selected="${e.activeWorkshopTab==="stand"}" class="brass-btn">
          <span class="nb-tab-ico">🧺</span> <span class="hs-long">Sạp Ngõ</span><span class="hs-short">Sạp</span> <span class="nb-tab-badge">${k>0?`${k} xong`:`${I}/6`}</span>
        </button>
        <button type="button" role="tab" id="wsTabMarket" data-ws-tab="market" data-active="${e.activeWorkshopTab==="market"}" aria-selected="${e.activeWorkshopTab==="market"}" class="brass-btn">
          <span class="nb-tab-ico">🎪</span> <span class="hs-long">Chợ Phiên</span><span class="hs-short">Chợ</span> <span class="nb-tab-badge">${b>0?`${b} sẵn`:`${L}/3`}</span>
        </button>
        <button type="button" role="tab" id="wsTabCargo" data-ws-tab="cargo" data-active="${e.activeWorkshopTab==="cargo"}" aria-selected="${e.activeWorkshopTab==="cargo"}" class="brass-btn">
          <span class="nb-tab-ico">🚂</span> Tàu <span class="nb-tab-badge">${i}/3</span>
        </button>
        <button type="button" role="tab" id="wsTabBrew" data-ws-tab="brew" data-active="${e.activeWorkshopTab==="brew"}" aria-selected="${e.activeWorkshopTab==="brew"}" class="brass-btn">
          <span class="nb-tab-ico">🧪</span> <span class="hs-long">Vạc Phép</span><span class="hs-short">Vạc</span>
        </button>
        <button type="button" role="tab" id="wsTabSynergy" data-ws-tab="synergy" data-active="${e.activeWorkshopTab==="synergy"}" aria-selected="${e.activeWorkshopTab==="synergy"}" class="brass-btn">
          <span class="nb-tab-ico">🌟</span> Combo <span class="nb-tab-badge">${g}/12</span>
        </button>
      </div>
    `;let R="";if(e.activeWorkshopTab==="barn"){const d=Math.min(100,Math.round(p/Math.max(1,r.capacity)*100)),c=e.sim.getBarnUpgradeCostInfo(),T=n.sandboxMode?"+20 Ô (Miễn phí)":c.hasPlug?`+20 Ô (1 🔌 + ${c.baseGoldCost} Sickle)`:`+20 Ô (${c.effectiveGoldCost} Sickle)`,S=c.hasPlug?`🔌 ×${c.plugsInBarn}`:`🔌 ×0 (bù +${c.plugShortageBuyout} Sickle)`,$=ce(y.spotlightCropId),f=ce(y.spotlightGoodId),h=P=>P.map(z=>{const Q=ce(z),j=e.sim.getFarmItemCount(z),ie=e.sim.isItemMarketSpotlight(z);return`
              <div class="barn-stock-card ${j>0?"in-stock":"empty"}" data-barn-card="${z}">
                <img src="${Q.iconSrc}" alt="${m(Q.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${m(Q.name)} ${ie?'<span class="owl-spotlight-tag">🎪 Tiêu điểm</span>':""}</div>
                <div class="barn-stock-qty"><strong data-barn-qty>×${n.sandboxMode?"∞":j}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${j>0||n.sandboxMode?"gold-cta":""}"
                  data-sell-farm-item="${z}"
                  ${j<=0&&!n.sandboxMode?"disabled":""}
                  style="width:100%;padding:4px 8px;font-size:12px;"
                >
                  🪙 +${Q.sellValue} Sickle
                </button>
              </div>
            `}).join(""),M=e.sim.getPhoenixTalismanCount(),A=e.sim.getPhoenixTalismanDailyStatus(),H=e.sim.getCraftablePhoenixBarnGood(),O=H?ce(H):null,V=n.sandboxMode||M<He&&!!H&&n.galleons>=yt,v=Math.max(0,Math.floor(n.morningDewPhials??0)),q=Math.max(0,Math.floor(n.timeSand??0)),D=Math.max(0,Math.floor(e.sim.ensureNeighborSocial().friendshipTokens??0)),_=[{id:"dew",icon:"🧪",label:"Sương Mai",qty:n.sandboxMode?"∞":`×${v}`,hint:"🧪 Bình Sương Mai giữ chuỗi & thu 2× mùa vụ — kiếm từ Hộp Mười Vụ, Hộp Quà Đồi Sương, Quà Dân Làng, Mốc Lễ Hội & Bách Khoa!"},{id:"compost",icon:"🌿",label:"Phân Ủ",qty:n.sandboxMode?"∞":`×${C}`,hint:"🌿 Phân Ủ Thảo Dược giảm 50% thời gian chín ruộng — kiếm từ Sạp Tiêu Điểm, Đơn Cú Tiêu Điểm, Hộp Mười Vụ & Kiện Hàng Chung!"},{id:"sand",icon:"⏳",label:"Cát",qty:n.sandboxMode?"∞":`×${q}`,hint:"⏳ Cát Xoay Thời Gian rút ngắn giờ chờ xưởng & xây dựng — kiếm từ Đại Tiệc, Chợ Phiên, Thành Tựu & Kiện Hàng Chung!"},{id:"plug",icon:"🔌",label:"Phích Cắm",qty:n.sandboxMode?"∞":`×${c.plugsInBarn}`,hint:"🔌 Phích Cắm Muggle mở rộng sức chứa Kho Đỏ — kiếm từ Đơn Cú, Kỷ Vật Ông Arthur & Thương Vụ Chợ Phiên!"},{id:"talisman",icon:"🔥",label:"Bùa",qty:n.sandboxMode?"∞":`${M}/${He}`,hint:"🔥 Bùa Phượng Hoàng vượt nhanh 1 màn khảo thí — rèn ngay tại Kho Đỏ, nhận từ Đơn Cú, Rương Tình Bạn & Điểm Danh 7 Ngày!"},{id:"tokens",icon:"🍀",label:"Tình Bạn",qty:`×${D}`,hint:"🍀 Huy Hiệu Tình Bạn (gom 10 cái mở Rương Tình Bạn) — kiếm từ Thăm Bạn Cổng Floo, Thả Tim, Kiện Hàng Chung & Bưu Thiếp!"}];R=`
        <div class="barn-header-card" data-barn-root="1">
          <div class="barn-head-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="barn-head-text">
              <div class="hs-card-title" data-barn-cap-label>🏡 Kho Đỏ (${p}/${r.capacity})</div>
              <div data-barn-sub-meta style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${r.ordersDelivered} · ${S}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${c.canAfford?"":"disabled"}
              style="padding:7px 14px;font-size:13px;${c.canAfford?"":"opacity:0.55;cursor:not-allowed;"}"
            >
              ${T}
            </button>
          </div>
          <div class="quest-bar" style="height:8px;margin-top:8px;">
            <div class="quest-bar-fill" data-barn-cap-bar style="width:${d}%"></div>
          </div>
        </div>

        <div class="hs-utility-pouch" role="group" aria-label="Túi Vật Tư Phép Thuật — bấm từng món xem cách kiếm">
          <div class="hs-utility-pouch-head">
            <span>✨ Túi Vật Tư Phép Thuật</span>
            <span class="hs-utility-pouch-sub">Chạm từng món xem cách kiếm</span>
          </div>
          <div class="hs-utility-pouch-grid">
            ${_.map(P=>`
                <button
                  type="button"
                  class="hs-pouch-chip"
                  data-pouch-id="${P.id}"
                  data-pouch-hint="${m(P.hint)}"
                  data-pouch-icon="${P.icon}"
                  title="${m(P.hint)}"
                >
                  <span class="hs-pouch-ico" aria-hidden="true">${P.icon}</span>
                  <span class="hs-pouch-name">${P.label}</span>
                  <strong class="hs-pouch-qty" data-pouch-qty>${P.qty}</strong>
                </button>`).join("")}
          </div>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;white-space:normal;overflow-wrap:break-word;">
            🎪 <strong>Tiêu Điểm Hôm Nay:</strong> ${$.emoji} ${m($.name)} &amp; ${f.emoji} ${m(f.name)}
          </div>
          <button type="button" class="brass-btn gold-cta" data-ws-tab="market" style="padding:5px 10px;font-size:12px;">
            🎪 Vào Chợ Phiên (+60%)
          </button>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;">
            <div>🧙 <strong>Phụ Tá Gia Tinh Bà Molly:</strong> <span data-helper-status>${r.farmHelperEndsAt&&r.farmHelperEndsAt>s?`<span style="color:#15803d;">Đang trực (${ve(Math.ceil((r.farmHelperEndsAt-s)/1e3))})</span>`:"Tự động tưới luống mới &amp; gom thành phẩm xưởng vào Kho Đỏ"}</span></div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${r.farmHelperFreeDayKey!==vs()?'<button type="button" class="brass-btn gold-cta" data-activate-helper="free_daily" style="padding:5px 10px;font-size:12px;">🎁 30p Miễn phí</button>':""}
            <button type="button" class="brass-btn" data-activate-helper="feast_points" style="padding:5px 10px;font-size:12px;">🍁 2h (20 điểm)</button>
            <button type="button" class="brass-btn" data-activate-helper="sickle" style="padding:5px 10px;font-size:12px;">🪙 2h (120 Sickle)</button>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <h3 class="barn-talisman-forge-title" data-talisman-title>
              🔥 Bùa Phượng Hoàng (${n.sandboxMode?"∞":`${M}/${He}`})
            </h3>
            <div class="barn-talisman-forge-sub" data-talisman-sub style="margin-top:2px;">
              Hôm nay: ${A.usedCount}/${A.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${V?"":"disabled"}
            style="padding:8px 12px;font-size:12px;"
          >
            🔥 Rèn +1 (${O?`1 ${m(O.name)}`:"1 Đặc sản"} + ${yt} Sickle)
          </button>
        </div>

        <h3 class="hs-section-title" style="margin:12px 0 6px;">Nông sản (${Object.keys(he).length})</h3>
        <div class="barn-stock-grid">
          ${h(Object.keys(he))}
        </div>

        <h3 class="hs-section-title" style="margin:14px 0 6px;">Đặc sản (${Object.keys(Ee).length})</h3>
        <div class="barn-stock-grid">
          ${h(Object.keys(Ee))}
        </div>
      `}else if(e.activeWorkshopTab==="stand"){const c=[...Object.keys(he),...Object.keys(Ee)].filter(h=>n.sandboxMode||e.sim.getFarmItemCount(h)>0);c.length>0&&!c.includes(e.selectedStandItemId)&&(e.selectedStandItemId=c[0]);const T=ce(e.selectedStandItemId),S=e.sim.getFarmItemCount(e.selectedStandItemId),$=pa(e.selectedStandItemId,e.selectedStandPriceTier),f=Math.max(1,Math.min(3,n.sandboxMode?2:S));R=`
        <div class="quest-card-mini">
          <div class="hs-card-title">🧺 Sạp Hàng Đầu Ngõ Hang Sóc (6 Ô)</div>
          <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 8px;">
            Bày nông sản hoặc đặc sản dư trong Kho để khách lữ hành Hogsmeade và hàng xóm ghé mua lấy Sickle!
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="selStandItem" aria-label="Chọn nông sản bày sạp" style="flex:1;min-width:160px;min-height:38px;padding:4px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:var(--ink);font-weight:700;">
              ${(c.length>0?c:["ottery_wheat"]).map(h=>{const M=ce(h),A=e.sim.getFarmItemCount(h);return`<option value="${h}" ${h===e.selectedStandItemId?"selected":""}>${m(M.name)} (×${n.sandboxMode?"∞":A})</option>`}).join("")}
            </select>
            <div style="display:flex;gap:4px;">
              ${[["bargain","Giá hời (nhanh)"],["fair","Chuẩn (+15%)"],["premium","Cao (+35%)"]].map(([h,M])=>`<button type="button" data-stand-tier="${h}" data-active="${e.selectedStandPriceTier===h}" aria-pressed="${e.selectedStandPriceTier===h}" class="brass-btn ${e.selectedStandPriceTier===h?"gold-cta":""}" style="padding:4px 8px;font-size:12px;">${M}</button>`).join("")}
            </div>
          </div>
          <div style="font-size:12px;font-weight:700;margin-top:6px;">
            Lô mẫu: <strong>${f} × ${m(T.name)}</strong> → <strong>+${$*f} Sickle</strong>
          </div>
        </div>

        <div class="market-deal-grid" style="margin-top:8px;">
          ${w.slots.map(h=>{if(!h.itemId){const V=n.sandboxMode||S>=1;return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">Ô Sạp #${h.slotIndex+1} · Trống</div>
                    <div style="font-size:12px;color:var(--ink-soft);margin:4px 0;">Sẵn sàng bày ${f} ${m(T.name)}</div>
                    <button type="button" data-stand-list="${h.slotIndex}" ${V?"":"disabled"} class="brass-btn ${V?"gold-cta":""}" style="width:100%;">
                      🧺 Bày bán (+${$*f} Sickle)
                    </button>
                  </div>
                `}const M=ce(h.itemId),A=h.qty*h.unitPrice;if(h.soldAt)return`
                  <div class="market-deal-card">
                    <div class="hs-card-title">${h.buyerEmoji??"🍺"} ${m(h.buyerName??"Khách lữ hành")} đã mua!</div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${M.iconSrc}" alt="${m(M.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">${h.qty} × ${m(M.name)}</div>
                    </div>
                    <button type="button" data-stand-claim="${h.slotIndex}" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">
                      🪙 Thu +${A} Sickle
                    </button>
                  </div>
                `;const H=ga(h.unitPrice,M.sellValue),O=Math.max(1,Math.ceil((h.listedAt+H-s)/1e3));return`
                <div class="market-deal-card">
                  <div class="hs-card-title">Ô Sạp #${h.slotIndex+1} · Đang rao</div>
                  <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                    <img src="${M.iconSrc}" alt="${m(M.name)}" style="width:32px;height:32px;object-fit:contain;" />
                    <div>
                      <div style="font-size:13px;font-weight:700;">${h.qty} × ${m(M.name)}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">Giá ${A} Sickle · khách ghé ~${ve(O)}</div>
                    </div>
                  </div>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="market"){const d=ce(y.spotlightCropId),c=ce(y.spotlightGoodId),T=e.sim.getFarmItemCount(y.spotlightCropId),S=e.sim.getFarmItemCount(y.spotlightGoodId),$=Math.max(16,Math.round(d.sellValue*2*1.6)+12),f=Math.max(16,Math.round(c.sellValue*1*1.6)+12),h=L>0&&(n.sandboxMode||T>=2),M=L>0&&(n.sandboxMode||S>=1),A=Math.max(0,1-y.rerollsUsed);R=`
        <div class="market-spotlight-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div>
              <div class="hs-card-title">Sạp Tiêu Điểm (${L}/3 lô hôm nay)</div>
              <div class="hs-stat-pills">
                <span class="hs-stat-pill" title="Thu mua giá cao cộng thêm 60% Sickle mỗi lô sỉ">🪙 +60% Sickle</span>
                <span class="hs-stat-pill" title="Tặng thêm 1 Phân Ủ Thảo Dược mỗi lô">🌿 +1</span>
                <span class="hs-stat-pill" title="Tặng 12 điểm Đại Tiệc Mùa Gặt mỗi lô">🍁 +12</span>
                <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 Kho: ×${n.sandboxMode?"∞":C}</span>
                <span class="hs-stat-pill is-active" title="Đơn Hàng Cú có món Tiêu Điểm hôm nay thưởng thêm 1 Phân Ủ, 8 XP và 6 điểm Đại Tiệc">🦉 +1🌿 · +8⭐</span>
              </div>
            </div>
          </div>

          <div class="market-deal-grid">
            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${d.iconSrc}" alt="${m(d.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">2 × ${m(d.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${n.sandboxMode?"∞":T}/2</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${h?"gold-cta":""}" data-sell-spotlight="crop" title="Bán 2 nông sản Tiêu Điểm lấy ${$} Sickle và 1 Phân Ủ" ${h?"":"disabled"} style="width:100%;">
                🪙 +${$} · +1 🌿
              </button>
            </div>

            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${c.iconSrc}" alt="${m(c.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">1 × ${m(c.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${n.sandboxMode?"∞":S}/1</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${M?"gold-cta":""}" data-sell-spotlight="good" title="Bán 1 đặc sản Tiêu Điểm lấy ${f} Sickle và 1 Phân Ủ" ${M?"":"disabled"} style="width:100%;">
                🪙 +${f} · +1 🌿
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:10px 0 8px;">
          <h3 class="hs-section-title" style="margin:0;">3 Thương Vụ Thương Lái Hogsmeade</h3>
          <button id="btnRerollMarketFair" type="button" class="brass-btn" ${A<=0&&!n.sandboxMode?"disabled":""}>
            🔄 Đổi Sạp (${n.sandboxMode?"∞":`${A}/1`})
          </button>
        </div>

        <div class="market-deal-grid">
          ${y.deals.map(H=>{const O=ce(H.inputItemId),V=e.sim.getFarmItemCount(H.inputItemId),v=!H.claimed&&(n.sandboxMode||V>=H.inputQty),q=[{label:`🪙 +${H.rewardSickle}`,tip:`Thưởng ${H.rewardSickle} Sickle`},{label:`⭐ +${H.rewardXp}`,tip:`Thưởng ${H.rewardXp} XP`}];if(H.rewardCompost&&q.push({label:`🌿 +${H.rewardCompost}`,tip:`Thưởng ${H.rewardCompost} Phân Ủ Thảo Dược`}),H.rewardSeedCropId&&H.rewardSeedQty){const D=he[H.rewardSeedCropId];q.push({label:`🌱 +${H.rewardSeedQty} ${m(D.name)}`,tip:`Tặng ${H.rewardSeedQty} hạt ${m(D.name)}`})}return H.rewardMorningDew&&q.push({label:`💧 +${H.rewardMorningDew}`,tip:`Thưởng ${H.rewardMorningDew} Bình Sương Mai`}),H.rewardMugglePlug&&q.push({label:`🔌 +${H.rewardMugglePlug}`,tip:`Thưởng ${H.rewardMugglePlug} Phích Cắm`}),H.rewardTimeSand&&q.push({label:`⏳ +${H.rewardTimeSand}`,tip:`Thưởng ${H.rewardTimeSand} Cát Xoay Thời Gian`}),`
                <div class="market-deal-card ${H.claimed?"claimed":""}">
                  <div>
                    <div class="hs-card-title" style="margin-bottom:6px;">${H.merchantEmoji} ${m(H.merchantName)}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <img src="${O.iconSrc}" alt="${m(O.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">
                        ${m(O.name)} (${n.sandboxMode?"∞":V}/${H.inputQty})
                      </div>
                    </div>
                    <div class="hs-stat-pills">
                      ${q.map(D=>`<span class="hs-stat-pill" title="${D.tip}">${D.label}</span>`).join("")}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="brass-btn ${v?"gold-cta":""}"
                    data-claim-market-deal="${m(H.id)}"
                    title="${H.claimed?"Đã giao dịch thương vụ này hôm nay":`Đổi ${H.inputQty} ${m(O.name)} lấy thương vụ`}"
                    ${H.claimed||!v?"disabled":""}
                    style="width:100%;"
                  >
                    ${H.claimed?"✓ Đã chốt":"🪙 Chốt đơn"}
                  </button>
                </div>
              `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="brew"){const d=Math.max(0,Math.ceil((2e4-(s-(n.supply.lastHerbPlotHarvestAt||0)))/1e3)),c=Math.max(0,Math.ceil(((n.supply.butterbeerBoostEndsAt||0)-s)/1e3)),T=Math.max(0,Math.ceil(((n.supply.felixBoostEndsAt||0)-s)/1e3)),S=n.supply.activeBrew,$=S?dt.find(v=>v.id===S.goodId):void 0,f=S?Math.max(0,Math.ceil((S.endsAt-s)/1e3)):0,h=Math.max(0,n.supply.brewCompletedCount??0),M=h+1,A=n.buildings.some(v=>Y(v.itemId)?.isWorkshopBrewery&&s>=v.constructEndsAt),H=e.sim.activeSynergies.activeIds.has("combo_herb_brewery"),O=h===0?"Mẻ #1 (1h)":h===1?"Mẻ #2 (2h)":h===2?"Mẻ #3 (4h)":`Mẻ #${M} (6h)`,V=["mandrake_leaf","sweet_pumpkin","starlight_dust","magic_cacao"];R=`
        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div class="hs-card-title">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${d===0||n.sandboxMode?"gold-cta":""}">
            ${d>0&&!n.sandboxMode?`🌱 (${ve(d)})`:"🌿 Hái Thảo Dược"}
          </button>
        </div>

        <div class="quest-card-mini" style="font-size:12px;line-height:1.45;">
          <div style="font-size:13px;font-weight:700;color:var(--brand-strong);">
            🔥 Nhiệt Vạc · ${O}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Chu kỳ 1h → 2h → 4h → 6h.${A?" ✓ −45% Xưởng.":" Dựng Xưởng −45%."}${H?" ✓ −22% Combo.":""}
          </div>
        </div>

        <div class="ingredient-bar">
          ${V.map(v=>{const q=Pt[v],D=n.supply.ingredients[v]??0;return`
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
                    <span>${q.emoji} ${q.name}</span>
                    <span style="color:#b45309;">×${n.sandboxMode?"∞":D}</span>
                  </div>
                </div>
              `}).join("")}
        </div>

        ${c>0||T>0?`
              <div data-ws-buff-banner="1" class="quest-card-mini" style="font-size:12px;font-weight:700;color:#15803d;">
                ✨ ${c>0?`🍻 +85% Sickle (${me(c)}) `:""}${T>0?`• 🧪 +35% XP (${me(T)})`:""}
              </div>
            `:""}

        ${S&&$?`
              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13px;font-weight:700;color:#6b21a8;">
                    🔥 ${$.emoji} ${m($.name)} (${me(f)})
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `:""}

        <div class="grid-2col">
          ${dt.map(v=>{const q=n.supply.goods[v.id]??0,D=e.sim.getBrewDurationSec(v),_=ve(D),P=Object.entries(v.inputs).map(([z,Q])=>{const j=Pt[z],ie=n.supply.ingredients[z]??0;return`<span style="color:${n.sandboxMode||ie>=(Q??0)?"#15803d":"#dc2626"};font-weight:700;">${j.emoji} ${ie}/${Q}</span>`}).join(" • ");return`
              <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="hs-card-title">${v.emoji} ${v.name}</span>
                    <span style="font-size:12px;font-weight:700;color:#7c2d12;">×${n.sandboxMode?"∞":q}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${P}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${v.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${_})
                  </button>
                  <button type="button" data-use-good="${v.id}" class="brass-btn" style="flex:1;">
                    ${v.directUseLabel}
                  </button>
                </div>
              </div>
            `}).join("")}
        </div>
      `}else if(e.activeWorkshopTab==="cargo"){const d=Math.max(1,Math.round((240+n.level*40)/5)),c=Math.round(160+n.level*25),T=n.supply.cargoCrates.some(S=>!!(S.helpRequestedAt||S.helpedByNeighborName));R=`
        <div class="quest-card-mini">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="hs-card-title">
              🚂 Tàu #${n.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:700;">+${d.toLocaleString("vi-VN")} Sickle · +${c} ⭐ · +2 ⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${n.supply.cargoCrates.map((S,$)=>{const f=e.sim.getCargoCrateStockInfo(S),h=ce(f.barnItemId),M=dt.find(A=>A.id===S.goodId);return`
                <div class="crate-card ${S.fulfilled?"done":""}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#92400e;">
                      <span>#${$+1}</span>
                      <span>${S.fulfilled?"✓":`${n.sandboxMode?"∞":f.haveBarn}/${S.qtyRequired}`}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${h.iconSrc}" alt="${m(h.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div>
                        <div class="hs-card-title">${m(h.name)} ×${S.qtyRequired}</div>
                        ${f.allowBrewEquiv&&M&&f.haveBrew>0?`<div style="font-size:11px;opacity:0.8;">+ ${f.haveBrew} mẻ ${m(M.name)} (Vạc Phép)</div>`:""}
                      </div>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${S.rewardSickle} Sickle · +${S.rewardXp} ⭐ · +${S.rewardTimeSand} ⏳
                    </div>
                  </div>
                  ${S.fulfilled?`<div style="font-size:12px;font-weight:700;color:#15803d;text-align:center;padding:6px 0;">${S.helpedByNeighborName?`✓ ${m(S.helpedByNeighborEmoji??"🤝")} ${m(S.helpedByNeighborName)} đóng hộ`:"✓ Đã chất"}</div>`:f.canFulfill?`<button type="button" data-fulfill-crate="${m(S.id)}" class="brass-btn gold-cta" style="width:100%;">📦 Chất hàng</button>`:`<div style="display:flex;flex-direction:column;gap:6px;">
                            <button type="button" data-jump-cargo-item="${m(f.barnItemId)}" class="brass-btn gold-cta" style="width:100%;">→ Tìm / Sản xuất</button>
                            ${S.helpRequestedAt?'<div style="font-size:12px;font-weight:700;color:var(--brand-strong);text-align:center;padding:4px 0;">🦉 Đang gọi...</div>':`<button type="button" data-help-cargo-crate="${m(S.id)}" class="brass-btn" style="width:100%;" title="Nhờ hàng xóm đóng hộ kiện hàng này (tối đa 1 kiện mỗi chuyến tàu)" ${T?"disabled":""}>🦉 Nhờ đóng hộ (1/tàu)</button>`}
                            ${f.allowBrewEquiv?'<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu ở Vạc Phép</button>':""}
                          </div>`}
                </div>
              `}).join("")}
        </div>
      `}else R=`
        <div class="grid-2col">
          ${ia.map(d=>{const c=e.sim.activeSynergies.activeIds.has(d.id),T=d.requiredItems.map(S=>Y(S)?.name??S).join(" + ");return`
              <div class="quest-card-mini" style="border-color:${c?"#d97706":"rgba(176, 125, 67, 0.45)"};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span class="hs-card-title">${d.emoji} ${m(d.name)}</span>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;color:${c?"#15803d":"#78350f"};">
                    ${c?"✓":`≤${d.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">${T}</div>
                <div style="font-size:12px;font-weight:700;color:#15803d;">
                  +${d.goldBonusPct}% Sickle · +${d.xpBonusPct}% XP
                </div>
              </div>
            `}).join("")}
        </div>
      `;t.innerHTML=E+R,t.dataset.activeWsTab=e.activeWorkshopTab,Ke(t,a,!!(o&&o!==e.activeWorkshopTab)),t.dataset.cargoSig=n.supply.cargoCrates.map(d=>`${d.id}:${d.fulfilled?1:0}:${d.helpRequestedAt?1:0}:${d.helpedByNeighborName??""}`).join("|")}function Kn(e){e.closeHudPopovers(),dn(e);const t=e.root.querySelector("#harvestFeastDialog");t&&!t.open&&t.showModal()}function Qn(e){const t=e.sim.getClaimableHarvestFeastCount(),o=e.root.querySelector("#badgeFeastCount");o&&(t>0?(o.textContent=String(t),o.classList.remove("hidden")):o.classList.add("hidden"));const a=e.root.querySelector("#badgeManageFeastCount");a&&(t>0?(a.textContent=String(t),a.classList.remove("hidden")):a.classList.add("hidden"))}function Xn(e,t){const o=e.root.querySelector("#ribbonUnveilToastCard");o&&(o.innerHTML=`
      <div class="ribbon-unveil-banner-inner">
        <img src="/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${m(t.speakerEmoji)} ${m(t.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${m(t.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">${t.bonusSickle>0?`+${t.bonusSickle.toLocaleString("vi-VN")} 🪙 • +${t.bonusXp.toLocaleString("vi-VN")} ⭐ • +${t.feastPoints} 🍁`:"Thưởng khánh thành chỉ nhận một lần cho mỗi loại công trình"}</div>
        </div>
      </div>
    `,o.classList.remove("hidden"),e.ribbonBannerTimer&&window.clearTimeout(e.ribbonBannerTimer),e.ribbonBannerTimer=window.setTimeout(()=>{o.classList.add("hidden"),e.ribbonBannerTimer=0},5200))}function dn(e){const t=e.root.querySelector("#harvestFeastDialogContent");if(!t)return;const o=We(t),a=e.sim.ensureHarvestFeast(),n=new Set(a.claimedTiers),s=De[De.length-1]?.pointsRequired??3e3,g=Math.min(100,Math.round(a.points/Math.max(1,s)*100)),i=e.sim.getClaimableHarvestFeastCount(),r=De.every(L=>n.has(L.tier)),p=De.find(L=>a.points<L.pointsRequired),y=p??De.find(L=>!n.has(L.tier)),C=De.map(L=>{const l=n.has(L.tier),b=a.points>=L.pointsRequired&&!l,w=Pa(L),k=L.tier%5===0;return`
        <article class="feast-tier-card ${l?"is-claimed":b?"is-claimable":"is-locked"} ${k?"is-grand":""}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${L.tier}</span>
            <span class="feast-tier-pts">🍁 ${L.pointsRequired.toLocaleString("vi-VN")}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${m(L.icon)} ${m(L.titleVi)}</span>
              ${k?'<span class="feast-grand-pill">Mốc lớn</span>':""}
            </div>
            <div class="feast-tier-reward">${m(w)}</div>
          </div>
          <div class="feast-tier-cta">
            ${l?'<span class="feast-claimed-pill">✓</span>':b?`<button type="button" data-claim-feast-tier="${L.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`:`<span class="feast-need-pill">Còn ${(L.pointsRequired-a.points).toLocaleString("vi-VN")} 🍁</span>`}
          </div>
        </article>
      `}).join("");t.innerHTML=`
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${a.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${a.points.toLocaleString("vi-VN")} / ${s.toLocaleString("vi-VN")}</div>
            <div class="feast-hero-sub">
              ${r?"🎉 30/30!":p?`Kế tiếp: #${p.tier} (🍁 ${p.pointsRequired.toLocaleString("vi-VN")})`:y?`Sẵn sàng nhận thưởng #${y.tier}!`:""}
            </div>
          </div>
          <div class="feast-hero-actions">
            ${i>0?`<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${i})</button>`:""}
            ${r?`<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${a.seasonCycle+1}</button>`:""}
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${g}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      ${(()=>{const L=e.sim.getActiveSeasonalFestivalDef()??Da.lunar_tet,l=Ra(e.sim.state),u=ys(),b=l.lastLiXiClaimDayKey===u,w=e.sim.getActiveFestival()===L.festival,k=[["lunar_tet","🏮 Tết Việt"],["mid_autumn","🥮 Trung Thu"],["halloween","🎃 Halloween"],["christmas","🎄 Giáng Sinh"]].map(([E,R])=>{const d=L.festival===E;return`<button type="button" data-feast-switch-fest="${E}" class="brass-btn ${d?"gold-cta":""}" style="font-size:12px;padding:3px 8px;">${R}</button>`}).join(""),I=L.tasks.map(E=>{const R=l.claimedTaskIds.includes(E.id),d=e.sim.getSeasonalFestivalTaskProgress(E.id),c=!R&&(e.sim.state.sandboxMode||d>=E.target);return`
              <div class="quest-card-mini" style="margin-top:6px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${L.icon} ${m(E.titleVi)} (${Math.min(d,E.target)}/${E.target})</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${m(E.descVi)} · +${E.rewardSickle} Sickle${E.rewardStars?` · +${E.rewardStars} 🌟`:""}</div>
                  </div>
                  ${R?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-seasonal-task="${E.id}" ${c?"":"disabled"} class="brass-btn ${c?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận</button>`}
                </div>
              </div>
            `}).join("");return`
          <section class="quest-card-mini" style="margin-bottom:12px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div>
                <div style="font-size:13px;font-weight:700;">${m(L.kickerVi)}</div>
                <div style="font-size:12px;color:var(--ink-soft);">${m(L.buffSummaryVi)}</div>
              </div>
              ${L.hasDailyLiXi&&w?`<button id="btnClaimTetLiXi" type="button" ${b?"disabled":""} class="brass-btn ${b?"":"gold-cta"}" style="font-size:12px;padding:4px 10px;">${b?"✓ Đã nhận Lộc Xuân":"🏮 Nhận Lộc Xuân (+68 Sickle)"}</button>`:""}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px;">${k}</div>
            ${I}
          </section>
        `})()}

      <div class="feast-tier-list" role="list">
        ${C}
      </div>
    `,Ke(t,o),t.querySelector("#btnFeastClaimAll")?.addEventListener("click",()=>{const L=e.sim.claimAllHarvestFeastTiers();e.showToast(L.msg,L.ok?"🍁":"⏳"),e.refreshAll()}),t.querySelector("#btnFeastNextSeason")?.addEventListener("click",()=>{const L=e.sim.startNextHarvestFeastCycle();e.showToast(L.msg,L.ok?"✨":"🍁"),e.refreshAll()}),t.querySelectorAll("[data-claim-feast-tier]").forEach(L=>{L.addEventListener("click",()=>{const l=Number(L.dataset.claimFeastTier);if(!Number.isFinite(l))return;const u=e.sim.claimHarvestFeastTier(l);e.showToast(u.msg,u.ok?"🎁":"🍁"),e.refreshAll()})}),t.querySelectorAll("[data-feast-switch-fest]").forEach(L=>{L.addEventListener("click",()=>{const l=L.dataset.feastSwitchFest;e.sim.state.settings.activeFestival=l,e.sim.saveToStorage(),e.refreshAll()})}),t.querySelectorAll("[data-claim-seasonal-task]").forEach(L=>{L.addEventListener("click",()=>{const l=L.dataset.claimSeasonalTask??"";if(!l)return;const u=e.sim.claimSeasonalFestivalTask(l);e.showToast(u.msg,u.ok?"🏮":"⏳"),e.refreshAll()})}),t.querySelector("#btnClaimTetLiXi")?.addEventListener("click",()=>{const L=e.sim.claimDailyTetLiXi();e.showToast(L.msg,L.ok?"🏮":"⏳"),e.refreshAll()})}function Yn(e){const t=e.root.querySelector("#financeDialogContent"),o=e.sim.state.finance,a=o.gateRevenue+o.ticketRevenue+o.shopRevenue+o.harvestRevenue,n=o.staffWagesPaid+o.constructionSpent,s=a-n,g=e.sim.getHourlyStaffWage();t.innerHTML=`
      <div class="grid-2col" style="margin-bottom:16px;">
        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#15803d;">📈 Thu</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú</span><strong>+${o.harvestRevenue.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm</span><strong>+${(o.shopRevenue+o.ticketRevenue+o.gateRevenue).toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#15803d;"><span>Tổng thu</span><strong>+${a.toLocaleString("vi-VN")} Sickle</strong></div>
          </div>
        </div>

        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#9a3412;">📉 Chi</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây &amp; Nâng sao</span><strong>-${o.constructionSpent.toLocaleString("vi-VN")} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${g}/ca)</span><strong>-${o.staffWagesPaid.toLocaleString("vi-VN")} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${s>=0?"#15803d":"#b45309"};">
              <span>Ròng</span><strong>${s>=0?"+":""}${s.toLocaleString("vi-VN")} Sickle</strong>
            </div>
          </div>
        </div>
      </div>
      <div id="hpvnExchange"></div>
    `,Vs(t.querySelector("#hpvnExchange"),e)}function xs(e){const t=ut();return _s().then(o=>{const a=e.root.querySelector("#albumDialog");o!==t&&a?.open&&e.activeAlbumTab==="cup"&&Te(e);const n=e.root.querySelector("#houseCupIntroDialog");return o!==t&&n?.open&&As(e),o})}const ks={match3:{nameVi:"Bùa Gặt",spriteIcon:"/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp"},caro:{nameVi:"Dò Mìn",spriteIcon:"/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1"},sudoku:{nameVi:"Số Học",spriteIcon:"/trang-trai-hang-soc/sprites/m3_piece_scroll.webp"},chess:{nameVi:"Bắn Cá",spriteIcon:"/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2"},blocks:{nameVi:"Sinh Vật",spriteIcon:"/trang-trai-hang-soc/sprites/beast_niffler.webp"},jigsaw:{nameVi:"Tranh Ghép",spriteIcon:"/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp"}};function It(e,t){t==="match3"?e.openMatch3Dialog():e.openPuzzleArcadeDialog(t)}function pn(e,t){const o=Ft();return o.length===0?"":`
    <div class="hs-cup-disciplines">
      <div class="hs-cup-disc-title-row">
        <span class="hs-cup-kicker">Đấu trường từng môn (chạm để đua ngay)</span>
      </div>
      <div class="hs-cup-disc-grid">${o.map(n=>{const s=ks[n.id],g=n.byHouse[e],i=!t&&n.leaderHouse!==null&&g?.rank===1&&g.rawPoints>0,r=n.leaderHouse?`<span class="hs-cup-disc-lead" data-house="${n.leaderHouse}">
            <img class="hs-cup-disc-crest" src="/trang-trai-hang-soc/sprites/crest-${n.leaderHouse.toLowerCase()}.webp" alt="" width="16" height="16">
            <span>${n.leaderHouse}</span>
            <strong>${n.leaderRawPoints.toLocaleString("vi-VN")}</strong>
          </span>`:'<span class="hs-cup-disc-lead is-empty">Chưa có đội dẫn đầu</span>';let p="Chưa phân Nhà";return!t&&g&&(g.rawPoints<=0?p="Nhà bạn: 0 đ (+0 Cúp)":g.rank===1?p=`Hạng 1 · +${g.cupPoints} đ Cúp`:p=`Hạng ${g.rank} (+${g.cupPoints} đ) · Kém ${g.gapToFirst.toLocaleString("vi-VN")}`),`
        <button type="button" class="hs-cup-disc-card${i?" is-leading":""}" data-cup-play="${n.id}">
          <span class="hs-cup-disc-head">
            <img class="hs-cup-disc-ico" src="${s.spriteIcon}" alt="" width="22" height="22">
            <strong class="hs-cup-disc-name">${s.nameVi}</strong>
            <span class="hs-cup-disc-cta">Đua</span>
          </span>
          ${r}
          <span class="hs-cup-disc-me">${p}</span>
        </button>`}).join("")}</div>
    </div>`}function Ms(e,t,o){typeof e.querySelectorAll=="function"&&e.querySelectorAll("[data-cup-play]").forEach(a=>{a.addEventListener("click",()=>{const n=a.dataset.cupPlay;!n||!(n in ks)||(o.root.querySelector(t)?.close(),It(o,n))})})}function gn(e,t,o){const[a,n]=gs(t?null:e),s=a.isPlayerAlliance?a:n.isPlayerAlliance?n:null,g=(p,y)=>{const[C,L]=p.houses;return`
      <div class="hs-cup-ally-side${p.isPlayerAlliance?" is-mine":""}" data-slot="${y}">
        <div class="hs-cup-ally-head">
          <span class="hs-cup-ally-crests">
            <img src="/trang-trai-hang-soc/sprites/crest-${C.toLowerCase()}.webp" alt="${C}" width="22" height="22">
            <img src="/trang-trai-hang-soc/sprites/crest-${L.toLowerCase()}.webp" alt="${L}" width="22" height="22">
          </span>
          <strong class="hs-cup-ally-pts">${o?`${p.points.toLocaleString("vi-VN")} đ`:"…"}</strong>
        </div>
        <div class="hs-cup-ally-name">${m(p.nameVi)}${p.isPlayerAlliance?'<span class="hs-cup-ally-badge">Liên minh bạn</span>':""}</div>
        <div class="hs-cup-ally-houses">${C} + ${L}</div>
      </div>`},i=Math.max(12,Math.min(88,a.sharePercent)),r=s?.allyHouse?`<div class="hs-cup-ally-foot">Đồng minh tuần này: Nhà ${s.allyHouse}</div>`:"";return`
    <div class="hs-cup-alliances">
      <div class="hs-cup-ally-title-row">
        <span class="hs-cup-kicker">Liên Minh Tuần Này (2 vs 2)</span>
      </div>
      <div class="hs-cup-ally-vs">
        ${g(a,"a")}
        <span class="hs-cup-ally-divider" aria-hidden="true">VS</span>
        ${g(n,"b")}
      </div>
      <div class="hs-cup-tugbar" aria-hidden="true">
        <i class="is-a" style="width:${i}%"></i>
        <i class="is-b" style="width:${100-i}%"></i>
      </div>
      ${r}
    </div>`}function Ls(e,t,o){const a=Ft(),n=t?.mode==="medals"||a.length>0,s=n?Gs():null,g=["Gryffindor","Slytherin","Ravenclaw","Hufflepuff"].map(E=>({house:E,pts:zs(E),firsts:s?.[E]??0})).sort((E,R)=>R.pts-E.pts||R.firsts-E.firsts),i=Math.max(1,g[0].pts),r=t?.house===null,p=E=>`${E.toLocaleString("vi-VN")} đ`,y=g.map(E=>{const R=!r&&E.house===e,d=n&&E.firsts>0?`<span class="hs-cup-medals">${E.firsts} nhất môn</span>`:"",c=`${E.house}${R?'<span class="hs-cup-you">Nhà bạn</span>':""}${d}`,T=`<img class="hs-cup-crest" src="/trang-trai-hang-soc/sprites/crest-${E.house.toLowerCase()}.webp" alt="" width="32" height="32">`,S=Math.round(E.pts/i*100);return`
        <li class="hs-cup-row" data-house="${E.house}" data-mine="${R}">
          ${T}
          <span class="hs-cup-name">${c}</span>
          <span class="hs-cup-pts">${t?p(E.pts):"…"}</span>
          <span class="hs-cup-bar"><i style="width:${S}%"></i></span>
        </li>`}).join(""),C=t?.perTier??300,L=Math.min(C,t?.memberBank??0),l=gn(e,r,t),[u,b]=gs(r?null:e),w=u.isPlayerAlliance?u:b.isPlayerAlliance?b:null,k=Us({cup:t,leadingAlliance:u,playerAlliance:w,noHouse:r,localPlays:o}),I=n?pn(e,r):"";return{alliancesHtml:l,prizeBannerHtml:k,listHtml:y,disciplinesHtml:I,isMedalMode:n,noHouse:r,perTier:C,bank:L}}function mn(e){e.hasShownHouseCupIntro=!0,e.closeHudPopovers(),As(e);const t=e.root.querySelector("#houseCupIntroDialog");t&&!t.open&&t.showModal()}function As(e){const t=e.root.querySelector("#houseCupIntroDialogContent");if(!t)return;const o=e.sim.getPlayerHouse(),a=ut();xs(e).catch(()=>{});const{alliancesHtml:n,prizeBannerHtml:s,listHtml:g,disciplinesHtml:i,isMedalMode:r,noHouse:p,perTier:y,bank:C}=Ls(o,a,e.sim.state.minigamePlays),L=a?.memberTier??1,l=a?.memberDailyCap??0,u=a?.memberTodayPoints??0,b=Ft(),w=p?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${o.toLowerCase()}.webp`,k=r&&(a?.unlimited||l===0)?`Hôm nay: ${u.toLocaleString("vi-VN")} đ`:`Hôm nay: ${u.toLocaleString("vi-VN")}${l>0?`/${l.toLocaleString("vi-VN")}`:""} đ`,I=p?"Chưa phân Nhà":a?`${k} · Cúp Đợt ${L}: ${C.toLocaleString("vi-VN")}/${y.toLocaleString("vi-VN")} đ`:"Đang tải…";t.innerHTML=`
    <div class="hs-cup hs-cup-intro">
      <div class="hs-cup-intro-hero" data-house="${p?"":m(o)}">
        <img class="hs-cup-intro-crest" src="${w}" alt="" width="40" height="40" />
        <div class="hs-cup-intro-copy">
          <span class="hs-cup-kicker">${a?.weekKey?`Mùa giải Tuần ${m(a.weekKey)}`:"Cúp 4 Nhà"}</span>
          <strong class="hs-cup-intro-title">${p?"Chưa phân Nhà trên HPVN":`Nhà ${m(o)}`}</strong>
          <span class="hs-cup-intro-sub">${I}</span>
        </div>
      </div>

      ${n}
      ${s}
      <ol class="hs-cup-list hs-cup-intro-standings">${g}</ol>
      ${i}

      <div class="hs-dlg-actions">
        <button id="btnCupIntroPlay" type="button" class="brass-btn">Thi đấu ngay</button>
        <button id="btnCupIntroClose" type="button" class="brass-btn gold-cta">Vào trang trại</button>
      </div>
    </div>
  `,t.querySelector("#btnCupIntroClose")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close()}),t.querySelector("#btnCupIntroPlay")?.addEventListener("click",()=>{e.root.querySelector("#houseCupIntroDialog")?.close();const E=e.sim.getLastPlayedMinigame();if(r){const R=new Set(b.map(d=>d.id));if(E!=="seedquiz"&&R.has(E)){It(e,E);return}if(!p&&b.length>0){const d=b.filter(c=>(c.byHouse[o]?.rank??4)>1).sort((c,T)=>(c.byHouse[o]?.gapToFirst??0)-(T.byHouse[o]?.gapToFirst??0));if(d.length>0){It(e,d[0].id);return}}}E==="caro"||E==="sudoku"||E==="chess"||E==="blocks"||E==="jigsaw"?e.openPuzzleArcadeDialog(E):e.openMatch3Dialog()}),Ms(t,"#houseCupIntroDialog",e)}function Te(e){const t=e.root.querySelector("#albumDialogContent"),o=t.dataset.activeAlbumTabSig??"",a=`${e.activeAlbumTab}:${e.activeProfileSubTab}`,n=We(t),s=e.sim.homeStateWhileVisiting??e.sim.state;e.sim.checkAndToastAchievements();const g=es(s),i=ma(s),r=wt.filter(b=>{const w=g.achievements[b.id];return!!(w?.unlockedAt&&!w?.claimedAt)}).length,p=e.sim.getUnlockedLoginDayMax(s),y=Tt.filter(b=>b.day<=p&&!g.claimedLoginDays.includes(b.day)).length,C=r+y,L=(b,w,k=0)=>`<button type="button" role="tab" data-atab="${b}" aria-selected="${e.activeAlbumTab===b}" class="hs-tab">${w}${k>0?`<span class="hs-tab-badge">${k}</span>`:""}</button>`,l=`
      <div class="hs-tabs" role="tablist" aria-label="Hồ Sơ, Cúp &amp; Xếp Hạng">
        ${L("profile","Hồ sơ",C)}${L("cup","Cúp Nhà")}${L("leaderboard","Xếp hạng")}
      </div>
    `;let u="";if(e.activeAlbumTab==="cup"){const b=e.sim.getPlayerHouse(),w=ut();xs(e).catch(()=>{});const{alliancesHtml:k,prizeBannerHtml:I,listHtml:E,disciplinesHtml:R,noHouse:d,perTier:c,bank:T}=Ls(b,w,s.minigamePlays),S=h=>`${h.toLocaleString("vi-VN")} đ`,$=(h,M,A,H,O="",V=!1)=>`
        <li class="hs-cup-row"${O?` data-house="${O}" data-mine="${V}"`:""}>
          <span></span>
          <span class="hs-cup-name">${M}</span>
          <span class="hs-cup-pts">${A}</span>
          ${H===null?"":`<span class="hs-cup-bar"><i style="width:${H}%"></i></span>`}
        </li>`,f=w?d?$("","Chưa phân Nhà trên HPVN","0 đ",null):$("","Hôm nay",S(w.memberTodayPoints),null)+$("",`Đợt ${w.memberTier}`,`${T} / ${S(c)}`,Math.round(T/c*100)):"";u=`
        <div class="hs-cup">
          <div class="hs-cup-kicker hs-cup-kicker-row">
            <span>${w?.weekKey?`Tuần ${w.weekKey}`:"Đang tải…"}</span>
          </div>
          ${k}
          ${I}
          <ol class="hs-cup-list">${E}</ol>
          ${R}
          ${f?`<ul class="hs-cup-me">${f}</ul>`:""}
        </div>
      `}else if(e.activeAlbumTab==="leaderboard")u='<div id="leaderboardTabMount"></div>';else{const b=e.sim.getPlayerHouse(),k=ut()?.house===null,I=k?"/trang-trai-hang-soc/sprites/ui_trophy_cup.webp":`/trang-trai-hang-soc/sprites/crest-${b.toLowerCase()}.webp`,E=k?"Chưa phân Nhà":b,R=(S,$,f=0)=>`<button type="button" role="tab" data-psub="${S}" aria-selected="${e.activeProfileSubTab===S}" class="lb-scope-pill ${e.activeProfileSubTab===S?"active":""}">${$}${f>0?`<span class="hs-tab-badge">${f}</span>`:""}</button>`;let d="";if(e.activeProfileSubTab==="achievements"){const S=Date.now(),$={farm:Re(s,"farm",S),building:Re(s,"building",S),puzzle:Re(s,"puzzle",S),language:Re(s,"language",S),social:Re(s,"social",S),collection:Re(s,"collection",S)},f=[["all","Tất cả"],["farm","Mùa vụ"],["building","Kiến trúc"],["puzzle","Khảo thí"],["language","Đa ngữ"],["social","Xã hội"],["collection","Sưu tầm"]],h=e.activeAchievementFilterCat??"all",M=wt.filter(A=>h==="all"||A.category===h).slice().sort((A,H)=>{const O=V=>g.achievements[V]?.unlockedAt&&!g.achievements[V]?.claimedAt?1:0;return O(H.id)-O(A.id)});d=`
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
              <h3 class="hs-section-title" style="margin:0;">52 Thành tựu</h3>
              <span style="font-size:12px;font-weight:700;color:var(--ink-gold);">${i.unlocked}/${i.total} (${i.completionPct}%)</span>
              ${r>0?`<button id="btnClaimAllAchievements" type="button" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận tất cả (${r})</button>`:""}
            </div>
            <progress max="${i.total}" value="${i.unlocked}" style="width:100%;margin-bottom:8px;"></progress>
            <div class="lb-scope-pills" role="group" aria-label="Lọc thành tựu theo nhóm">
              ${f.map(([A,H])=>`<button type="button" data-ach-cat="${A}" aria-pressed="${h===A}" class="lb-scope-pill ${h===A?"active":""}">${H}</button>`).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${M.map(A=>{const H=g.achievements[A.id],O=!!H?.unlockedAt,V=!!H?.claimedAt,v=Math.min(A.target,Math.max(0,$[A.category]??0)),q=v.toLocaleString("vi-VN"),D=A.target.toLocaleString("vi-VN");return`
                <div class="aaa-ach-card" data-ach-card="${A.id}" data-unlocked="${O}">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                    <div style="min-width:0;flex:1;">
                      <div class="hs-card-title">${A.titleVi}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">${A.descVi} · <strong>+${A.rewardSickle} Sickle, +${A.rewardStars} 🌟</strong></div>
                      ${O?"":`<progress max="${A.target}" value="${v}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`}
                    </div>
                  </div>
                  <div data-ach-cta style="flex-shrink:0;text-align:right;">
                    ${V?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':O?`<button type="button" data-claim-ach="${A.id}" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận</button>`:`<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">${q}/${D}</span>`}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="friendship"){const S=e.sim.getRealTimePeriod(),$=ys();d=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Phim cốt truyện</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">
              ${ba.map(f=>{const h=s.level>=f.unlockLevel||e.sim.isHeadmasterPreview;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${f.titleVi}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">Cấp ${f.unlockLevel}</div>
                    <button type="button" data-play-cutscene="${f.id}" ${h?"":"disabled"} class="brass-btn ${h?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${h?"Xem":`Cấp ${f.unlockLevel}`}
                    </button>
                  </div>
                `}).join("")}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${qa.map(f=>{const h=ua(f.id,S),M=g.npcFriendship[f.id]??{villagerId:f.id,level:1,xp:0},A=M.level*60,H=M.lastTalkedDayKey===$,O=M.lastGiftedDayKey===$,V=Ha[f.id],v=!!M.claimedMilestones?.includes(5),q=!v&&(M.level>=5||s.sandboxMode);return`
                <div class="aaa-slot-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong class="hs-card-title">${f.nameVi}</strong>
                      <span style="font-size:12px;color:var(--ink-soft);"> · ${f.titleVi}</span>
                    </div>
                    <span style="font-size:12px;font-weight:700;color:var(--berry);">Cấp ${M.level}/10 (${M.xp}/${A})</span>
                  </div>
                  <div style="font-size:12px;color:var(--ink-soft);">${h.activityVi}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    <button type="button" data-npc-talk="${f.id}" data-choice="0" ${H?"disabled":""} class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${H?"✓ Đã trò chuyện":"Trò chuyện (+35 XP)"}
                    </button>
                    ${H?"":`<button type="button" data-npc-talk="${f.id}" data-choice="1" class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">Gợi chuyện (+25 XP)</button>`}
                    ${v?`<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);align-self:center;">✓ ${m(V.keepsakeNameVi)}</span>`:`<button type="button" data-npc-keepsake="${f.id}" ${q?"":"disabled"} class="brass-btn ${q?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;" title="${m(V.keepsakeBonusVi)}">🎁 Kỷ vật Lv.5</button>`}
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:6px;">
                    ${O&&!s.sandboxMode?'<span style="font-size:11px;font-weight:700;color:var(--farm-green-text);">✓ Hôm nay đã tặng quà thân thiết</span>':V.favoriteGifts.map(D=>{const _=ce(D),P=e.sim.getFarmItemCount(D),z=s.sandboxMode||P>=1;return`<button type="button" data-npc-gift="${f.id}" data-gift-item="${D}" ${z?"":"disabled"} class="brass-btn ${z?"gold-cta":""}" style="min-height:34px;font-size:11px;padding:2px 8px;">💝 Tặng ${m(_.name)} (${s.sandboxMode?"∞":P})</button>`}).join("")}
                  </div>
                </div>
              `}).join("")}
          </div>
        `}else if(e.activeProfileSubTab==="almanac"){const S=e.sim.evaluateCollectionAlmanac(),$=S.chapters.map(h=>{const M=Math.min(100,Math.round(h.discoveredCount/Math.max(1,h.totalCount)*100)),A=h.sampleEntries.map(H=>`<span class="owl-rew-pill ${H.unlocked?"xp":""}" style="opacity:${H.unlocked?"1":"0.45"};font-size:11px;">${H.icon} ${m(H.nameVi)}</span>`).join("");return`
              <div class="quest-card-mini" style="margin-bottom:8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div>
                    <div style="font-size:13px;font-weight:700;">${h.icon} ${m(h.titleVi)}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">${m(h.subtitleVi)} · ${m(h.rewardLabelVi)}</div>
                  </div>
                  ${h.claimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-almanac="${h.id}" ${h.canClaim?"":"disabled"} class="brass-btn ${h.canClaim?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🎁 Nhận chương</button>`}
                </div>
                <div class="quest-bar" style="margin:6px 0;"><div class="quest-bar-fill" style="width:${M}%"></div></div>
                <div style="display:flex;flex-wrap:wrap;gap:4px;">${A}</div>
              </div>
            `}).join("");d=`
          <div class="quest-card-mini" style="margin-bottom:8px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div>
                <div style="font-size:13px;font-weight:700;">🏆 Đại Học Giả Bách Khoa Hang Sóc</div>
                <div style="font-size:12px;color:var(--ink-soft);">Hoàn thành cả 4 Chương Bách Khoa · Thưởng +190 Sickle &amp; +2 🌟</div>
              </div>
              ${S.grandTrophyClaimed?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Danh hiệu vĩnh viễn</span>':`<button type="button" data-claim-almanac="grand_trophy" ${S.allChaptersClaimed||s.sandboxMode?"":"disabled"} class="brass-btn ${S.allChaptersClaimed||s.sandboxMode?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">🏆 Nhận Đại Cúp</button>`}
            </div>
          </div>
        `+$}else d=`
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Điểm danh 7 ngày</h3>
            <div class="aaa-slot-grid">
              ${Tt.map(S=>{const $=g.claimedLoginDays.includes(S.day),f=!$&&S.day<=p;return`
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${S.titleVi}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">
                      +${S.galleons} Sickle · +${S.magicStars} 🌟${S.phoenixTalismans>0?` · +${S.phoenixTalismans} Bùa`:""}
                    </div>
                    ${$?'<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>':`<button type="button" data-claim-login="${S.day}" ${f?"":"disabled"} class="brass-btn ${f?"gold-cta":""}" style="min-height:40px;font-size:12px;padding:0 10px;">
                            ${f?"Nhận":"Chờ mở"}
                          </button>`}
                  </div>
                `}).join("")}
            </div>
          </div>
        `;const c=s.settings.strollRobeId??"burrow_classic",T=Ba.map(S=>{const $=Ia[S],f=S===c;return`
          <button
            type="button"
            class="hs-robe-pill ${f?"is-active":""}"
            data-stroll-robe="${S}"
            aria-pressed="${f}"
          >
            <span class="hs-robe-swatch" style="background:${$.scarfPrimary};border-color:${$.scarfAccent};" aria-hidden="true"></span>
            <span>${m($.labelVi)}</span>
          </button>
        `}).join("");u=`
        <div class="hs-profile-card" data-house="${m(b)}">
          <img class="hs-profile-crest" src="${I}" alt="" width="36" height="36" />
          <div class="hs-profile-info">
            <div class="hs-profile-head">
              <strong class="hs-profile-name">${m(s.parkName)}</strong>
              <span class="hs-profile-house">${m(E)}</span>
            </div>
            <div class="hs-profile-meta">Cấp ${s.level} · ${m(Vt(s.level))} · 🌟 ${(s.match3?.stars??0).toLocaleString("vi-VN")} · Thành tựu ${i.unlocked}/${i.total}</div>
          </div>
        </div>
        <div class="hs-robe-bar" role="group" aria-label="Trang phục đi dạo Hang Sóc">
          <span class="hs-robe-bar-label">✨ Áo đi dạo:</span>
          <div class="hs-robe-pills">${T}</div>
        </div>
        <div class="lb-scope-pills hs-profile-subtabs" role="tablist" aria-label="Chi tiết hồ sơ">
          ${R("login7","Điểm danh",y)}${R("achievements","Thành tựu",r)}${R("friendship","Dân làng")}${R("almanac","Bách khoa",e.sim.evaluateCollectionAlmanac().claimableCount)}
        </div>
        ${d}
      `}if(t.innerHTML=l+u,t.dataset.activeAlbumTabSig=a,Ke(t,n,!!(o&&o!==a)),e.activeAlbumTab==="leaderboard"){const b=t.querySelector("#leaderboardTabMount");e.leaderboardModal?e.leaderboardModal.render(b):(b&&(b.innerHTML='<p class="hs-lb-note">Đang tải…</p>'),e.getLeaderboardModal().then(w=>{w.configure(e.sim.getLastPlayedMinigame()),e.activeAlbumTab==="leaderboard"&&(w.render(),w.syncCloud())},()=>{}))}t.querySelector("#btnOpenCupIntroFromTab")?.addEventListener("click",()=>{e.root.querySelector("#albumDialog")?.close(),mn(e)}),Ms(t,"#albumDialog",e),t.querySelectorAll("[data-atab]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.atab;e.activeAlbumTab=w,Te(e),w==="leaderboard"&&e.leaderboardModal&&e.leaderboardModal.syncCloud()})}),t.querySelectorAll("[data-psub]").forEach(b=>{b.addEventListener("click",()=>{e.activeProfileSubTab=b.dataset.psub,Te(e)})}),t.querySelectorAll("[data-stroll-robe]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.strollRobe,k=e.sim.setStrollRobe(w);e.showToast(k.msg,"✨"),t.querySelectorAll("[data-stroll-robe]").forEach(I=>{const E=I.dataset.strollRobe===k.robe.id;I.classList.toggle("is-active",E),I.setAttribute("aria-pressed",String(E))})})}),t.querySelector("#btnClaimAllAchievements")?.addEventListener("click",()=>{const b=e.sim.claimAllAchievements();e.showToast(b.msg,b.ok?"🎖️":"⚠️"),Te(e)}),t.querySelectorAll("[data-ach-cat]").forEach(b=>{b.addEventListener("click",()=>{e.activeAchievementFilterCat=b.dataset.achCat||"all",Te(e)})}),t.querySelectorAll("[data-claim-ach]").forEach(b=>{b.addEventListener("click",()=>{const w=String(b.dataset.claimAch),k=e.sim.claimAchievement(w);if(e.showToast(k.msg,k.ok?"🎖️":"⚠️"),!k.ok)return;const I=t.querySelector(`[data-ach-card="${w}"]`),E=I?.querySelector("[data-ach-cta]");if(I&&E){E.innerHTML='<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>',I.classList.remove("is-patched-pop"),I.offsetWidth,I.classList.add("is-patched-pop");const R=e.sim.homeStateWhileVisiting??e.sim.state,d=es(R),c=wt.filter(M=>{const A=d.achievements[M.id];return!!(A?.unlockedAt&&!A?.claimedAt)}).length,T=t.querySelector("#btnClaimAllAchievements");T&&(c>0?T.textContent=`Nhận tất cả (${c})`:T.remove());const S=t.querySelector('[data-psub="achievements"] .hs-tab-badge');S&&(c>0?S.textContent=String(c):S.remove());const $=e.sim.getUnlockedLoginDayMax(R),f=Tt.filter(M=>M.day<=$&&!d.claimedLoginDays.includes(M.day)).length,h=t.querySelector('[data-atab="profile"] .hs-tab-badge');h&&(c+f>0?h.textContent=String(c+f):h.remove()),e.refreshHeader();return}Te(e)})}),t.querySelectorAll("[data-play-cutscene]").forEach(b=>{b.addEventListener("click",()=>{e.playStoryCutscene(String(b.dataset.playCutscene))})}),t.querySelectorAll("[data-npc-talk]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.npcTalk,k=Number(b.dataset.choice)===1?1:0,I=e.sim.talkWithVillagerChoice(w,k);e.showToast(I.msg,I.ok?"💝":"☕"),Te(e)})}),t.querySelectorAll("[data-npc-gift]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.npcGift,k=b.dataset.giftItem,I=e.sim.giftItemToVillager(w,k);e.showToast(I.msg,I.ok?"💝":"🧺"),Te(e),e.refreshHeader()})}),t.querySelectorAll("[data-npc-keepsake]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.npcKeepsake,k=e.sim.claimVillagerKeepsake(w);e.showToast(k.msg,k.ok?"🎁":"🔒"),Te(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-almanac]").forEach(b=>{b.addEventListener("click",()=>{const w=b.dataset.claimAlmanac,k=e.sim.claimAlmanacChapterReward(w);e.showToast(k.msg,k.ok?"📚":"🔒"),Te(e),e.refreshHeader()})}),t.querySelectorAll("[data-claim-login]").forEach(b=>{b.addEventListener("click",()=>{const w=e.sim.claimLoginDayReward(Number(b.dataset.claimLogin));e.showToast(w.msg,w.ok?"📅":"🔒"),Te(e)})})}function Ce(e){const t=e.root.querySelector("#questDialogContent"),o=e.sim.ensureFarmBarn(),a=e.sim.getActiveStoryQuest(),n=e.sim.getStoryAutoActionPreview(),s=e.sim.getReadyOwlOrdersCount(),g=(a?.completed?1:0)+e.sim.state.owlQuests.filter(c=>c.completed&&!c.claimed).length+e.sim.state.dailyQuests.filter(c=>c.completed&&!c.claimed).length;if(!e.selectedOwlOrderId||!o.owlOrders.some(c=>c.id===e.selectedOwlOrderId)){const c=o.owlOrders.find(T=>e.sim.canFulfillFarmOwlOrder(T));e.selectedOwlOrderId=(c??o.owlOrders[0])?.id??null}const i=`
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${e.activeQuestTab==="orders"}" aria-pressed="${e.activeQuestTab==="orders"}" class="brass-btn">
          Đơn Cú <span class="nb-tab-badge">${s}/${o.owlOrders.length}</span>
        </button>
        <button type="button" data-qtab="quests" data-active="${e.activeQuestTab==="quests"}" aria-pressed="${e.activeQuestTab==="quests"}" class="brass-btn">
          Nhiệm Vụ ${g>0?`<span class="nb-tab-badge">${g}</span>`:""}
        </button>
      </div>
    `;if(e.activeQuestTab==="orders"){const c=o.owlOrders.find(M=>M.id===e.selectedOwlOrderId)??o.owlOrders[0],T=c?e.sim.canFulfillFarmOwlOrder(c):!1,S=o.owlOrders.map(M=>{const A=c?.id===M.id,H=e.sim.canFulfillFarmOwlOrder(M),O=M.portraitSprite&&/^[a-z0-9_]+$/i.test(M.portraitSprite)?M.portraitSprite:null,V=O?`<img src="/trang-trai-hang-soc/sprites/${O}.webp" alt="${m(M.senderName)}" class="owl-note-portrait" />`:`<span class="owl-note-emoji">${m(Me(M.portraitEmoji,M.senderName))}</span>`,v=M.requirements.slice(0,3).map(D=>{const _=ce(D.itemId);return`<img src="${_.iconSrc}" alt="${m(_.name)}" title="${D.qty} ${m(_.name)}" class="owl-note-mini-item" />`}).join(""),q=e.sim.getOwlOrderSpotlightBonus(M);return`
            <button
              type="button"
              class="owl-pin-note ${A?"selected":""} ${H?"ready":""}"
              data-select-owl="${m(M.id)}"
            >
              <div class="owl-note-avatar-box">${V}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${m(M.senderName)}</div>
                <div class="owl-note-mini-row">${v}</div>
                ${M.isFeastMarquee?'<span class="owl-feast-tag">🎪 Tiệc</span>':""}
                ${q.hasSpotlight?'<span class="owl-spotlight-tag">🎪 +1🌿</span>':""}
              </div>
              ${H?'<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>':""}
            </button>
          `}).join(""),$=M=>{if(!M)return"";const A=e.sim.getOwlOrderSpotlightBonus(M);return`
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${m(M.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${m(M.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:12px;" ${e.sim.getOwlRerollsLeft()>0?`title="Đổi đơn (còn ${e.sim.getOwlRerollsLeft()} lượt hôm nay)"`:'disabled title="Hết lượt đổi hôm nay"'}>
                ${e.sim.getOwlRerollsLeft()>0?`🔄 Đổi (${e.sim.getOwlRerollsLeft()})`:"Hết lượt đổi"}
              </button>
            </div>

            <div class="owl-req-list">
              ${M.requirements.map((H,O)=>{const V=ce(H.itemId),v=e.sim.getFarmItemCount(H.itemId),q=e.sim.ensureNeighborSocial(),D=Math.max(0,qt-q.dailyOwlHelpRequestedCount),_=e.sim.getOwlRequirementHelpState(M.id,O),P=!!_?.fulfilledAt,z=e.sim.state.sandboxMode||P||v>=H.qty,Q=P?`<span class="owl-help-tag done">✓ ${m(_?.helperEmoji??"🦉")}</span>`:_?'<span class="owl-help-tag waiting">🦉 Đang gọi...</span>':z?'<span class="owl-req-status">✓</span>':`<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">
                            <button type="button" class="brass-btn owl-ask-help-btn" data-jump-owl-item="${m(H.itemId)}" title="Dẫn tới ruộng hoặc xưởng sản xuất món này">→ Tìm</button>
                            <button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${O}" ${D<=0?"disabled":""} title="Nhờ bạn">🤝 Nhờ (${D})</button>
                          </div>`;return`
                    <div class="owl-req-row ${z?"ok":"lack"}">
                      <img src="${V.iconSrc}" alt="${m(V.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${m(V.name)}</div>
                        <div class="owl-req-count">${P?"✓":`${e.sim.state.sandboxMode?"∞":v}/${H.qty}`}</div>
                      </div>
                      ${Q}
                    </div>
                  `}).join("")}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${M.rewardSickle}</span>
                <span class="owl-rew-pill xp">⭐ +${M.rewardXp+(A?.bonusXp??0)}</span>
                ${A?.hasSpotlight?`<span class="owl-rew-pill plug">🎪 +${A.bonusCompost}🌿</span>`:""}
                ${M.rewardMugglePlug?`<span class="owl-rew-pill plug">🔌 +${M.rewardMugglePlug}</span>`:""}
                ${(M.isFeastMarquee||(o.ordersDelivered+1)%3===0)&&e.sim.getPhoenixTalismanCount()<He?'<span class="owl-rew-pill plug">🔥 +1</span>':""}
              </div>
            </div>
          </div>
        `},f=(M,A)=>{M.querySelector("#btnRefreshOwlOrder")?.addEventListener("click",()=>{A&&(e.sim.refreshFarmOwlOrder(A.id),e.selectedOwlOrderId=null,Ce(e))}),M.querySelectorAll("[data-ask-owl-help]").forEach(H=>{H.addEventListener("click",()=>{if(!A)return;const O=Number(H.dataset.askOwlHelp);if(!Number.isFinite(O))return;const V=e.sim.requestPlayerOwlCrateHelp(A.id,O);V.ok||e.showToast(V.msg,"⚠️"),Ce(e)})}),M.querySelectorAll("[data-jump-owl-item]").forEach(H=>{H.addEventListener("click",()=>{const O=H.dataset.jumpOwlItem;e.root.querySelector("#questDialog")?.close(),e.jumpToMissingFarmItem(O)})})},h=$(c);t.innerHTML=`
        ${i}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${S}</div>
            ${h}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${T?"ready":"not-ready"}"
            >
              ${T?"Giao hàng":"Mở Kho"}
            </button>
          </div>
        </div>
      `,t.querySelectorAll("[data-qtab]").forEach(M=>{M.addEventListener("click",()=>{e.activeQuestTab=M.dataset.qtab,Ce(e)})}),t.querySelectorAll("[data-select-owl]").forEach(M=>{M.addEventListener("click",()=>{const A=M.dataset.selectOwl??null;if(!A||A===e.selectedOwlOrderId)return;e.selectedOwlOrderId=A;const O=e.sim.ensureFarmBarn().owlOrders.find(q=>q.id===A),V=t.querySelector(".owl-detail-sheet"),v=t.querySelector("#btnSendOwlOrder");if(O&&V&&v){t.querySelectorAll("[data-select-owl]").forEach(_=>{_.classList.toggle("selected",_.dataset.selectOwl===A)}),V.outerHTML=$(O);const q=t.querySelector(".owl-detail-sheet");q&&f(q,O);const D=e.sim.canFulfillFarmOwlOrder(O);v.classList.toggle("ready",D),v.classList.toggle("not-ready",!D),v.textContent=D?"Giao hàng":"Mở Kho";return}Ce(e)})}),f(t,c),t.querySelector("#btnSendOwlOrder")?.addEventListener("click",()=>{const M=e.sim.ensureFarmBarn(),A=M.owlOrders.find(O=>O.id===e.selectedOwlOrderId)??M.owlOrders[0];if(!A)return;if(!e.sim.canFulfillFarmOwlOrder(A)){const O=e.sim.fulfillFarmOwlOrder(A.id);e.showToast(O.msg,"🧺"),e.root.querySelector("#questDialog").close(),e.openWorkshopDialog("barn");return}const H=e.sim.fulfillFarmOwlOrder(A.id);H.ok&&(Na(),e.showToast(H.msg,"🦉")),e.selectedOwlOrderId=null,Ce(e)});return}const r=(c,T,S=!1)=>{const $=Math.min(100,Math.round(c.progress/Math.max(1,c.targetAmount)*100));return`
        <div class="quest-card-mini" style="color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span class="hs-card-title" style="color:var(--ink);">${m(c.giverEmoji)} ${m(c.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${m(T)}</span>
          </div>
          ${S&&c.dialogue?`<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.35;">${m(c.dialogue)}</div>`:""}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${$}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:var(--ink);">
            <span>${Math.min(c.progress,c.targetAmount)}/${c.targetAmount}</span>
            <span>🪙${c.rewardSickle} · ⭐${c.rewardXp} ${c.rewardTimeSand>0?`· ⏳${c.rewardTimeSand}`:""}</span>
          </div>
          ${c.claimed?'<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>':c.completed?`<button type="button" data-modal-claim="${m(c.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`:S?`<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${m(n.shortLabel)}</button>`:""}
        </div>
      `},p=e.sim.getRequiredLevelTrial(),y=e.sim.getWinsProgressForCurrentLevel(),C=c=>{const T=e.sim.getDisciplineStageInfo(c);return T.isMaxed?`👑${T.maxStage}`:`${T.currentStage}/${T.maxStage}`},L=p&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?`
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div class="hs-card-title">
              🔥 Đề Cử (${y.current}/${y.required}): ${p.icon} ${m(p.shortVi)} (${C(p.kind)})
            </div>
            <button type="button" data-modal-open-trial="${p.kind}" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">▶️ Chơi</button>
          </div>
        </div>
      `:"",l=a?`Ch.${a.chapter??1} · ${e.sim.state.storyQuestIndex+1}/${la.length}`:"",u=e.sim.getYuleEventStatus(),b=u.dayDef?.main,w=u.day>0&&u.claimedMainDays.includes(u.day),k=b?ts(e.sim.state,b):0,I=!!(b&&k>=b.amount),E=b?Math.min(100,Math.round(k/Math.max(1,b.amount)*100)):0,R=u.dayDef?.side.map(c=>{const T=u.claimedSideTaskIds.includes(c.id),S=ts(e.sim.state,c),$=S>=c.amount;return`<div class="quest-card-mini" style="padding:9px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><span style="font-size:12px;font-weight:700;">${m(c.titleVi)} <span style="color:var(--ink-soft);">(${Math.min(S,c.amount)}/${c.amount} • +${c.rewardSickles.toLocaleString("vi-VN")} 🪙)</span></span>${T?'<span style="color:#15803d;font-weight:800;">✓</span>':`<button type="button" class="brass-btn ${$?"gold-cta":""}" data-yule-side="${m(c.id)}" style="padding:4px 8px;font-size:11px;${$?"":"opacity:0.62;"}">Nhận</button>`}</div>`}).join("")??"",d=u.active&&b?`<div class="quest-card-mini" style="padding:12px;border:1px solid #d97706;background:linear-gradient(135deg,rgba(254,243,199,.9),rgba(219,234,254,.8));"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>🎄 Yule • Ngày ${u.day}/36</strong><span style="font-size:11px;color:var(--ink-soft);">${m(u.dayDef?.titleVi??"")}</span></div><div style="font-size:13px;font-weight:800;margin-top:7px;">${m(b.titleVi)}</div><div class="quest-bar"><div class="quest-bar-fill" style="width:${E}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:3px;">${Math.min(k,b.amount)}/${b.amount}</div>${w?'<div style="margin-top:7px;color:#15803d;font-weight:800;">✓ Đã nhận phần thưởng ngày</div>':`<button type="button" data-yule-main="${u.day}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;${I?"":"opacity:0.65;"}">🎁 Nhận phần thưởng ngày</button>`}<div style="margin-top:9px;font-size:12px;font-weight:800;">Nhiệm vụ phụ (mỗi nhiệm vụ tối đa 5.000 Sickle)</div>${R}</div>`:"";t.innerHTML=`
      ${d}
      ${i}
      ${L}
      <h3 class="hs-section-title">📖 Cốt Truyện</h3>
      ${a?r(a,l,!0):'<div class="quest-card-mini">🎉 Đã hoàn thành!</div>'}

      <h3 class="hs-section-title" style="margin-top:14px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${e.sim.state.owlQuests.map(c=>r(c,"Xoay vòng")).join("")}
      </div>

      <h3 class="hs-section-title" style="margin-top:14px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${e.sim.state.dailyQuests.map(c=>r(c,`⏳ ${me(va())}`)).join("")}
      </div>
    `,t.querySelectorAll("[data-qtab]").forEach(c=>{c.addEventListener("click",()=>{e.activeQuestTab=c.dataset.qtab,Ce(e)})}),t.querySelectorAll("[data-modal-open-trial]").forEach(c=>{c.addEventListener("click",()=>{const T=c.dataset.modalOpenTrial;e.root.querySelector("#questDialog")?.close(),e.openTrialMinigame(T)})}),t.querySelector("[data-yule-main]")?.addEventListener("click",()=>{const c=Number(t.querySelector("[data-yule-main]")?.dataset.yuleMain),T=e.sim.claimYuleMainDay(c);e.showToast(T.msg,T.ok?"🎄":"⚠️"),Ce(e)}),t.querySelectorAll("[data-yule-side]").forEach(c=>{c.addEventListener("click",()=>{const T=e.sim.claimYuleSideTask(c.dataset.yuleSide);e.showToast(T.msg,T.ok?"🪙":"⚠️"),Ce(e)})}),t.querySelectorAll("[data-modal-claim]").forEach(c=>{c.addEventListener("click",()=>{e.sim.claimQuest(c.dataset.modalClaim),Ce(e)})}),t.querySelector("#btnModalStarStory")?.addEventListener("click",()=>{const c=e.sim.completeStoryStepWithStar();c.ok?(typeof c.placedGx=="number"&&typeof c.placedGy=="number"&&be(e.cam,c.placedGx,c.placedGy),Ce(e)):(e.showToast(c.msg,c.reason==="missing_gold"?"🪙":c.reason==="locked_level"?"🔒":"🌟"),c.reason==="open_match3"&&(e.root.querySelector("#questDialog").close(),e.openTrialMinigame()))})}let Ne="zones";function cs(e){const t=e.root.querySelector("#roadmapDialogContent"),o=t.dataset.activeRmTab??"",a=We(t),n=new Set(e.sim.state.unlockedZones),s=e.sim.getRequiredLevelTrial(),g=je.filter(y=>n.has(y.id)||e.sim.state.sandboxMode).length,i=`
      <div class="hs-tabs" role="tablist" aria-label="Bản Đồ &amp; Lộ Trình">
        <button type="button" role="tab" data-rmtab="zones" aria-selected="${Ne==="zones"}" class="hs-tab">Vùng đất <span class="hs-tab-badge">${g}/${je.length}</span></button>
        <button type="button" role="tab" data-rmtab="milestones" aria-selected="${Ne==="milestones"}" class="hs-tab">Cột mốc <span class="hs-tab-badge">Lv.${e.sim.state.level}</span></button>
      </div>
    `,r=s&&!e.sim.state.sandboxMode&&!e.sim.isHeadmasterPreview?(()=>{const y=e.sim.getWinsProgressForCurrentLevel();return`<div class="quest-card-mini trial-quest-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div class="hs-card-title">
                🔥 Đề Cử Lv.${e.sim.state.level} (${y.current}/${y.required}): ${s.icon} ${m(s.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">
                ▶️ Chơi
              </button>
            </div>`})():"";let p="";if(Ne==="zones"){const y=je.map(C=>{const L=n.has(C.id)||e.sim.state.sandboxMode,l=!L&&e.sim.state.level>=C.unlockLevel,u=_t(C);return`
          <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
            <div class="hs-card-title">${L?"✅":"🌫️"} ${C.name}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
              <span>Lv.${C.unlockLevel} · ${u>0?`🌟 ${u}`:"✓"}</span>
              <div style="display:flex;gap:5px;">
                <button type="button" data-cam-zone="${C.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
                ${l?`<button type="button" data-unlock-zone="${C.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`:""}
              </div>
            </div>
          </div>
        `}).join("");p=`${r}<div class="grid-2col">${y}</div>`}else p=`
        <div class="hs-card-list">
          ${ca.filter(C=>C.unlockedItemIds.length>0||C.unlockedZoneId||C.milestoneNote||C.level%10===0).map(C=>{const L=e.sim.state.level>=C.level,l=C.unlockedItemIds.map(u=>Y(u)?.name).filter(Boolean).join(", ");return`
                <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${L?"1":"0.78"};">
                  <div>
                    <span style="font-weight:700;font-size:13px;">${L?"🌟":"🔒"} Lv.${C.level}</span>
                    ${l?`<span style="font-size:12px;margin-left:6px;">${l}</span>`:""}
                  </div>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${C.rewardSickle}</span>
                </div>
              `}).join("")}
        </div>
      `;t.innerHTML=i+p,t.dataset.activeRmTab=Ne,Ke(t,a,!!(o&&o!==Ne)),t.querySelectorAll("[data-rmtab]").forEach(y=>{y.addEventListener("click",()=>{Ne=y.dataset.rmtab==="milestones"?"milestones":"zones",cs(e)})}),t.querySelector("#btnRoadmapPlayTrial")?.addEventListener("click",()=>{e.root.querySelector("#roadmapDialog")?.close(),e.openTrialMinigame()}),t.querySelectorAll("[data-cam-zone]").forEach(y=>{y.addEventListener("click",()=>{const C=us(y.dataset.camZone);be(e.cam,(C.x1+C.x2)*.5,(C.y1+C.y2)*.5),e.root.querySelector("#roadmapDialog").close()})}),t.querySelectorAll("[data-unlock-zone]").forEach(y=>{y.addEventListener("click",()=>{const C=e.sim.unlockZone(y.dataset.unlockZone);e.showToast(C.msg,C.ok?"✨":"🔒"),cs(e)})})}function Ae(e,t,o,a,n=o.length,s=o.length){const g=o.map(([i,r])=>`<button type="button" data-${t}="${i}" data-active="${i===a}" aria-pressed="${i===a}">${r}</button>`).join("");return`<div class="hs-set-row"><span class="hs-set-k">${e}</span><div class="hs-seg" role="group" aria-label="${e}" style="--hs-seg-cols:${n};--hs-seg-wide:${s}">${g}</div></div>`}function fe(e){const t=e.root.querySelector("#settingsDialogContent"),o=We(t),a=e.sim.state,n=e.sprites?e.sprites.isToonEnabled():!0,s=e.getEffectiveA11ySettings(),g=typeof window<"u"&&!1,i=[{key:"master",label:"Tổng"},{key:"music",label:"Nhạc nền"},{key:"sfx",label:"Hiệu ứng"},{key:"voice",label:"Giọng đọc"}],r=Object.values(a.stashedDecorInventory??{}).reduce((p,y)=>p+y,0);t.innerHTML=`
      <div class="quest-card-mini">
        <h3 class="hs-section-title">Âm thanh</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label class="switch-row">
            <span>Nhạc nền</span>
            <input id="swBgm" type="checkbox" switch ${a.settings.bgmEnabled?"checked":""} />
          </label>
          <label class="switch-row">
            <span>Hiệu ứng</span>
            <input id="swSfx" type="checkbox" switch ${a.settings.soundEnabled?"checked":""} />
          </label>
          ${i.map(p=>{const y=Math.round((s.volumes[p.key]??.85)*100);return`
                <label class="aaa-slider-row" style="font-size:12px;font-weight:700;">
                  <span>${p.label}</span>
                  <input type="range" min="0" max="100" value="${y}" data-vol-bus="${p.key}" />
                  <span data-vol-val="${p.key}">${y}%</span>
                </label>
              `}).join("")}
        </div>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Hiển thị &amp; Trợ năng</h3>
        ${Ae("Kiểu vẽ","toon",[["on","Viền nâu"],["off","2.5D"]],n?"on":"off")}
        ${Ae("Đồ hoạ","renderer-mode",[["webgl2","WebGL2"],["canvas","Cổ điển"]],a.settings.rendererMode??"webgl2")}
        ${Ae("Giáng Sinh","yule-theme-mode",[["auto","Tự động"],["on","Luôn bật"],["off","Tắt"]],a.settings.yuleThemeMode??"auto")}
        ${Ae("Chế độ màu","cb-mode",[["none","Mặc định"],["protanopia","Đỏ-Lục"],["deuteranopia","Lục-Đỏ"],["tritanopia","Xanh-Vàng"]],s.colorblindMode,2,4)}
        ${Ae("Cỡ chữ","font-scale",[["100","100%"],["125","125%"],["150","150%"]],String(s.fontScale))}
        <label class="switch-row">
          <span>Tương phản cao</span>
          <input id="swHighContrast" type="checkbox" switch ${s.highContrast?"checked":""} />
        </label>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Bầu trời &amp; Nhịp độ</h3>
        ${Ae("Giờ","time",[["realtime","Tự động"],["dawn","Bình minh"],["day","Ngày"],["dusk","Chiều"],["night","Đêm"]],a.settings.timeOverride,3)}
        ${Ae("Lễ hội","fest",[["auto","Tự động"],["lunar_tet","Tết Việt"],["mid_autumn","Trung Thu"],["halloween","Halloween"],["christmas","Giáng Sinh"],["quidditch_cup","Quidditch"]],a.settings.activeFestival,3,6)}
        ${Ae("Thời tiết","weather",[["auto","Tự động"],["clear","Nắng"],["cloudy","Mây"],["rain","Mưa"],["storm","Giông"],["snow","Tuyết"],["fog","Sương"]],a.settings.weatherOverride,4,7)}
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Điền trang &amp; Cẩm nang</h3>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${["layout_1","layout_2","layout_3"].map((p,y)=>{const C=a.layoutPresets?.[p];return`
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:700;">${C?m(C.label):`Bản vẽ #${y+1}`}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${C?`${C.placements.length} công trình`:"Trống"}</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${p}" class="brass-btn" style="flex:1;padding:4px 6px;font-size:12px;">Lưu</button>
                    <button type="button" data-load-layout="${p}" ${C?"":"disabled"} class="brass-btn ${C?"gold-cta":""}" style="flex:1;padding:4px 6px;font-size:12px;">Dùng</button>
                  </div>
                </div>
              `}).join("")}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn" style="font-size:12px;">Cất trang trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn ${r>0?"gold-cta":""}" ${r>0?"":"disabled"} style="font-size:12px;">
            Bày lại (${r})
          </button>
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta" style="font-size:12px;">
            Hướng dẫn
          </button>
          <button id="btnResetPark" type="button" class="brass-btn" style="font-size:12px;border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            Chơi lại
          </button>
        </div>
        <div style="font-size:12px;color:var(--ink-soft);">Đã tự lưu trên HPVN.</div>
        ${g?`<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                <label class="switch-row" style="width:100%;">
                  <span>Sandbox (Dev)</span>
                  <input id="swSandbox" type="checkbox" switch ${a.sandboxMode?"checked":""} />
                </label>
                <button id="btnPreview100" type="button" class="brass-btn" style="font-size:12px;">${e.sim.isHeadmasterPreview?"Về Save":"Xem Lv.100"}</button>
                <button id="btnTestFireworks" type="button" class="brass-btn" style="font-size:12px;">Pháo hoa</button>
                <button id="btnTestEscape" type="button" class="brass-btn" style="font-size:12px;">Thả Niffler</button>
              </div>`:""}
      </div>
    `,Ke(t,o),"switch"in HTMLInputElement.prototype||ra(()=>import("./vendor-B68GU3Ns.js"),[]).catch(()=>{}),t.querySelector("#swBgm")?.addEventListener("change",p=>{a.settings.bgmEnabled=p.currentTarget.checked,e.sim.audio.bgmEnabled=a.settings.bgmEnabled,e.sim.saveToStorage()}),t.querySelector("#swSfx")?.addEventListener("change",p=>{a.settings.soundEnabled=p.currentTarget.checked,e.sim.audio.enabled=a.settings.soundEnabled,e.sim.saveToStorage()}),t.querySelector("#swCutaway")?.addEventListener("change",p=>{a.settings.cutawayMode=p.currentTarget.checked,e.refreshAll()}),t.querySelector("#swGrid")?.addEventListener("change",p=>{a.settings.showGrid=p.currentTarget.checked,e.sim.saveToStorage(),e.refreshAll()}),t.querySelector("#swSandbox")?.addEventListener("change",p=>{typeof window<"u"}),t.querySelectorAll("[data-time]").forEach(p=>{p.addEventListener("click",()=>{a.settings.timeOverride=p.dataset.time,e.sim.saveToStorage(),e.refreshHeader(),fe(e)})}),t.querySelectorAll("[data-fest]").forEach(p=>{p.addEventListener("click",()=>{a.settings.activeFestival=p.dataset.fest,e.sim.saveToStorage(),e.refreshHeader(),fe(e)})}),t.querySelectorAll("[data-weather]").forEach(p=>{p.addEventListener("click",()=>{a.settings.weatherOverride=p.dataset.weather,e.sim.saveToStorage(),e.refreshHeader(),fe(e)})}),t.querySelectorAll("[data-toon]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.toon==="on";e.sim.state.settings.toonEnabled=y,e.sim.saveToStorage(),fe(e),(e.sprites?e.sprites.setToonEnabledAsync(y):Promise.resolve()).then(()=>{e.sim.state.settings.toonEnabled===y&&(typeof window<"u"&&window.dispatchEvent(new CustomEvent("hangsoc:toon-changed")),e.refreshAll())})})}),t.querySelectorAll("[data-renderer-mode]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.rendererMode;(y==="webgl2"||y==="canvas")&&(a.settings.rendererMode=y,e.sim.saveToStorage(),e.refreshAll(),fe(e))})}),t.querySelectorAll("[data-yule-theme-mode]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.yuleThemeMode;(y==="auto"||y==="on"||y==="off")&&(a.settings.yuleThemeMode=y,typeof document<"u"&&(document.documentElement.dataset.yuleTheme=e.sim.isYuleVisualThemeActive()||e.sim.isWinterMainMapActive()?"true":"false"),e.sim.saveToStorage(),e.refreshAll(),fe(e))})}),t.querySelector("#btnReplayTutorial")?.addEventListener("click",()=>{e.root.querySelector("#settingsDialog").close(),e.tutorialMinimized=!1,e.lastFocusedTutorialStepKey="",e.sim.restartTutorial(),e.panCameraToTutorialTarget(),e.refreshAll()}),t.querySelector("#btnPreview100")?.addEventListener("click",()=>{e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.toggleHeadmasterPreview(100),e.refreshAll(),fe(e)}),t.querySelector("#btnResetPark")?.addEventListener("click",()=>{window.confirm("Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?")&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.sim.resetNewGame(),be(e.cam,18,24.5),e.root.querySelector("#settingsDialog").close(),e.showToast("Chào mừng trở lại Trang Trại Hang Sóc bình yên!","🏡"))}),t.querySelectorAll("[data-vol-bus]").forEach(p=>{p.addEventListener("input",()=>{const y=p.dataset.volBus,C=Math.max(0,Math.min(1,Number(p.value)/100)),L=e.getEffectiveA11ySettings();L.volumes[y]=C,a.a11ySettings=L;const l=t.querySelector(`[data-vol-val="${y}"]`);l&&(l.textContent=`${Math.round(C*100)}%`),e.applyStoredA11ySettings(),e.sim.saveToStorage()})}),t.querySelectorAll("[data-cb-mode]").forEach(p=>{p.addEventListener("click",()=>{const y=e.getEffectiveA11ySettings();y.colorblindMode=p.dataset.cbMode,a.a11ySettings=y,e.applyStoredA11ySettings(),e.sim.saveToStorage(),fe(e)})}),t.querySelectorAll("[data-font-scale]").forEach(p=>{p.addEventListener("click",()=>{const y=e.getEffectiveA11ySettings();y.fontScale=Number(p.dataset.fontScale),a.a11ySettings=y,e.applyStoredA11ySettings(),e.sim.saveToStorage(),fe(e)})}),t.querySelector("#swHighContrast")?.addEventListener("change",p=>{const y=e.getEffectiveA11ySettings();y.highContrast=p.currentTarget.checked,a.a11ySettings=y,e.applyStoredA11ySettings(),e.sim.saveToStorage()}),t.querySelectorAll("[data-save-layout]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.saveLayout,C=e.sim.saveLayoutPreset(y);e.showToast(`📐 Đã lưu "${C.label}" (${C.placements.length} công trình)!`,"📐"),fe(e)})}),t.querySelectorAll("[data-load-layout]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.loadLayout,C=e.sim.applyLayoutPreset(y);e.showToast(C.msg,C.ok?"📐":"⚠️"),e.refreshAll(),fe(e)})}),t.querySelector("#btnStashDecor")?.addEventListener("click",()=>{const p=e.sim.stashAllDecorItems();e.showToast(p.msg,p.ok?"📦":"⚠️"),e.refreshAll(),fe(e)}),t.querySelector("#btnRestoreDecor")?.addEventListener("click",()=>{const p=e.sim.restoreAllStashedDecor();e.showToast(p.msg,p.ok?"🌸":"⚠️"),e.refreshAll(),fe(e)}),t.querySelectorAll("[data-save-slot]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.saveSlot,C=e.sim.saveNamedProfileSlot(y);e.showToast(`💾 Đã ghi ${C.label} (Cấp ${C.level})!`,"💾"),fe(e)})}),t.querySelectorAll("[data-load-slot]").forEach(p=>{p.addEventListener("click",()=>{const y=p.dataset.loadSlot,C=e.sim.loadNamedProfileSlot(y);C.ok&&(e.match3Modal?.resetSession(),e.puzzleArcadeModal?.resetSession(),e.applyStoredA11ySettings(),e.refreshAll(),e.root.querySelector("#settingsDialog").close()),e.showToast(C.msg,C.ok?"📂":"⚠️")})})}async function bn(e){return!1}const Ps=()=>js?.uid??"hpvn-local",un=e=>{},vn=e=>!1,bt={Gryffindor:"🦁 Gryffindor",Ravenclaw:"🦅 Ravenclaw",Hufflepuff:"🦡 Hufflepuff",Slytherin:"🐍 Slytherin"},ds={clear:"Nắng ấm",cloudy:"Mây nhẹ",rain:"Mưa phùn",storm:"Giông phép",snow:"Tuyết rơi",fog:"Sương mù",fireflies:"Đom đóm",dawn:"Bình minh",day:"Ngày",dusk:"Chiều",night:"Đêm"},Dt={Gryffindor:"🦁",Ravenclaw:"🦅",Hufflepuff:"🦡",Slytherin:"🐍"};function Gt(e){return e.sim.getPlayerHouse()}function ze(e,t,o=""){const a=ka(e),n=(t||"🧙").trim().slice(0,2);return a?`<span class="floo-avatar-shell ${o}"><img src="${m(a)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${m(n)}</span></span>`:`<span class="floo-avatar-shell ${o}"><span class="floo-avatar-fallback">${m(n)}</span></span>`}function qs(e){e.querySelectorAll("img.floo-avatar-img").forEach(t=>{t.addEventListener("error",()=>{t.classList.add("hidden"),t.nextElementSibling?.classList.remove("hidden")},{once:!0})})}function Rt(e){const t=e.sim.ensureNeighborSocial(),o=Gt(e),a=t.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";return{parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",playerName:a,level:e.sim.state.level,house:o,keeperTitle:Vt(e.sim.state.level),magicStars:e.sim.state.match3?.stars??0,buildingsCount:e.sim.state.buildings.length,unlockedZonesCount:e.sim.state.unlockedZones.length,weatherMode:e.sim.state.settings.weatherOverride||"clear",atmosphereMode:e.sim.state.settings.timeOverride||"day",theme:t.postcardTheme||"classic_burrow"}}function zt(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0),ne(e),e.inspectSelection=null,e.rideCamUid=null,e.closeSeedTray(),e.closePastureTray(),e.collapseBuildDock(),e.closeHudPopovers()}function yn(e,t){if(!t||typeof t!="object")return;const o=t,a=e.sim.ensureNeighborSocial();let n=!1;typeof o.uid=="string"&&o.uid.trim()&&un(o.uid);const s=typeof o.garden?.progression?.friendCode=="string"&&o.garden.progression.friendCode.trim()||(o.profile&&typeof o.profile=="object"&&typeof o.profile.friendCode=="string"?String(o.profile.friendCode).trim():"");if(s&&a.playerFriendCode!==s&&(a.playerFriendCode=s,n=!0),o.wallet&&typeof o.wallet.spendable=="number"&&Number.isFinite(o.wallet.spendable)){const r=e.sim.homeStateWhileVisiting??e.sim.state,p=Math.max(0,Math.floor(o.wallet.spendable));if(!r.sandboxMode&&!r.sandboxTainted&&!e.sim.isHeadmasterPreview){const y=!!o.receipt,C=vn();(y||C||p>=r.galleons)&&r.galleons!==p&&(p>r.galleons&&(e.sim.pendingInboxSickles+=p-r.galleons),r.galleons=p,e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=p),n=!0)}}const g=o.profile&&typeof o.profile=="object"?o.profile:null;if(g){const r=typeof g.username=="string"?g.username.trim():"";r&&r!=="Phù Thủy Hang Sóc"&&r!=="Trang Trại Hang Sóc"&&!a.playerDisplayName&&(a.playerDisplayName=r,n=!0);const p=typeof g.avatarUrl=="string"?g.avatarUrl.trim():"";p&&a.playerAvatarUrl!==p&&(a.playerAvatarUrl=p,n=!0)}const i=o.daily&&typeof o.daily=="object"?o.daily:null;if(i&&typeof i.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Se,Math.floor(i.helpsLeft)));const r=Math.max(0,Se-e.flooHelpsLeft);r>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=r,n=!0)}if(Array.isArray(o.helpers)&&o.helpers.length>0){e.flooHelpersToday=o.helpers.map(p=>({uid:String(p.uid||""),name:String(p.name||"Bạn HPVN"),avatarEmoji:p.avatarEmoji,avatarUrl:p.avatarUrl,at:Number(p.at||0)}));const r=ha(e.flooHelpersToday,a.lastSeenHelperAt??0);r&&r.textVi&&r.seenAt>(a.lastSeenHelperAt??0)&&(a.lastSeenHelperAt=r.seenAt,n=!0,e.showToast(r.textVi,"🤝"))}n&&(e.sim.saveToStorage(),e.refreshAll())}async function ft(e,t=!1){if(e.flooLoading)return;const o=Date.now();if(!t&&e.flooLastLoadedAt>0&&o-e.flooLastLoadedAt<8e3)return;e.flooLoading=!0;const a=e.sim.ensureNeighborSocial(),n=Gt(e),s=a.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc";try{const g=!!e.sim.state.sandboxMode||!!e.sim.state.sandboxTainted||!!e.sim.isHeadmasterPreview;g||bn(e.sim.state).catch(()=>{}),!e.sim.isVisitingNeighbor&&!g&&await qe.authoritativeClient.syncProfile({playerName:s,parkName:e.sim.state.parkName||"Trang Trại Hang Sóc",avatarUrl:a.playerAvatarUrl||"",avatarEmoji:Dt[n],house:n,level:e.sim.state.level,scene:{weather:e.sim.state.settings.weatherOverride==="auto"?"clear":e.sim.state.settings.weatherOverride,atmosphere:e.sim.state.settings.timeOverride==="realtime"?"day":e.sim.state.settings.timeOverride,event:"harvest_feast"}}).then(y=>yn(e,y)).catch(()=>{});const i=await qe.authoritativeClient.visit({});if(typeof i.helpsLeft=="number"){e.flooHelpsLeft=Math.max(0,Math.min(Se,Math.floor(i.helpsLeft)));const y=Math.max(0,Se-e.flooHelpsLeft);y>(a.dailyGardenHelpsCount??0)&&(a.dailyGardenHelpsCount=y)}const r=Array.isArray(i.visits)?i.visits:[],p=pt(r,Date.now());e.flooDirectoryRows=p,e.flooQueueRows.length===0&&(e.flooQueueRows=p),e.flooLastLoadedAt=Date.now(),e.sim.syncFlooDirectoryMembers(p,Ps())}catch{}finally{e.flooLoading=!1;const g=e.root.querySelector("#neighborDialog"),i=document.activeElement?.id??"";g?.open&&i!=="inpFlooDisplayName"&&pe(e),e.renderVisitorDockBar()}}let Mt=!1;function Ot(e){if(Mt)return;Mt=!0;const t=e.root.querySelectorAll("#btnPostcardShareFloo, #btnFlooQuickInvite, #btnHonorShareFloo");t.forEach(a=>a.disabled=!0);const o=Rt(e);ms().then(()=>Lt(bs(e.gameCanvas,o),`Trang trại Hang Sóc của mình, cấp ${e.sim.state.level}!`)).then(()=>{const a=e.sim.recordFlooShareOrPostcard("shareFloo");e.showToast(a.msg,"🔥")}).catch(()=>e.showToast("Chưa mở được Mạng Floo, thử lại nhé.","⚠️")).finally(()=>{Mt=!1,t.forEach(a=>a.disabled=!1),e.refreshAll(),e.root.querySelector("#neighborDialog")?.open&&pe(e)})}function fn(e,t,o){e.closeHudPopovers(),t&&(e.activeNeighborTab=t),o&&(e.focusedNeighborId=o),(e.sim.state.level>=Ve||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview)&&ft(e),pe(e);const n=e.root.querySelector("#neighborDialog");n&&!n.open&&n.showModal(),o&&requestAnimationFrame(()=>{e.root.querySelector(`[data-neighbor-card="${o}"]`)?.scrollIntoView({block:"nearest",behavior:"smooth"})})}function hn(e,t){e.closeHudPopovers();const o=e.root.querySelector("#neighborDialog");o?.open&&o.close(),t.kind==="match3"?e.getMatch3Modal().then(a=>a.openRescue(t)):e.getPuzzleArcadeModal().then(a=>a.openRescue(t))}function Ut(e,t){zt(e);const o=e.root.querySelector("#neighborDialog");o?.open&&o.close();const a=e.sim.enterHonorGardenTour(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),be(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function Ue(e,t,o){const a=String(t||"").trim();if(!a)return;if(a.startsWith("tour_")){Ut(e,a);return}o&&o.length>0?e.flooQueueRows=[...o]:e.flooQueueRows.length===0&&e.flooDirectoryRows.length>0&&(e.flooQueueRows=[...e.flooDirectoryRows]),zt(e);const n=e.root.querySelector("#neighborDialog");n?.open&&n.close();const s=a.startsWith("player_")?a:`player_${a}`,g=a.startsWith("player_")?a.slice(7):a;(async()=>{try{const r=await qe.authoritativeClient.visit({hostUid:g});typeof r.helpsLeft=="number"&&(e.flooHelpsLeft=Math.max(0,Math.min(Se,Math.floor(r.helpsLeft))));const p=r.visit&&typeof r.visit=="object"?r.visit:null;if(p){const y=p.progression&&typeof p.progression=="object"?p.progression:void 0,C=Date.now(),L=Array.isArray(y?.timers)?y.timers.filter(k=>Number(k.readyAt||0)>C).length:0,l=p.decorations&&typeof p.decorations=="object"?p.decorations:void 0,u={uid:String(p.uid||g),friendCode:typeof p.friendCode=="string"?p.friendCode:void 0,username:String(p.username||"Thành Viên HPVN"),parkName:String(p.parkName||"Thung Lũng Phép Thuật"),house:p.house||"Gryffindor",avatarEmoji:typeof p.avatarEmoji=="string"?p.avatarEmoji:void 0,avatarUrl:typeof p.avatarUrl=="string"?p.avatarUrl:void 0,level:Math.max(1,Number(p.level||1)),growing:L,helped:!!p.helped,hostHelpsLeft:typeof p.hostHelpsLeft=="number"?p.hostHelpsLeft:10,fire:p.fire&&typeof p.fire=="object"?p.fire:null,scene:l?.scene},b=e.sim.syncFlooDirectoryMembers([u],Ps()),w=p.rawClientSave&&typeof p.rawClientSave=="object"?p.rawClientSave:null;if(b[0]&&w){if(Array.isArray(w.buildings)&&w.buildings.length>0){const R=w.buildings.filter(d=>d&&typeof d.itemId=="string"&&!!Y(d.itemId));R.length>0&&(b[0].valleyBuildings=R)}w.tileOverrides&&typeof w.tileOverrides=="object"&&(b[0].valleyTileOverrides=w.tileOverrides),Array.isArray(w.unlockedZones)&&w.unlockedZones.length>0&&(b[0].valleyUnlockedZones=w.unlockedZones);const k=w.roadsideStand&&typeof w.roadsideStand=="object"?ya(w.roadsideStand):void 0,I=w.neighborSocial&&typeof w.neighborSocial=="object"?w.neighborSocial:null,E=I?.coopSupplyCrate&&typeof I.coopSupplyCrate=="object"?I.coopSupplyCrate:null;fa(b[0],{roadsideStand:k,coopWeekKey:typeof E?.weekKey=="string"?E.weekKey:void 0,coopPoints:typeof E?.contributedPoints=="number"?E.contributedPoints:void 0})}}}catch{}const i=e.sim.enterNeighborVisit(s);i.ok&&typeof i.focusGx=="number"&&typeof i.focusGy=="number"?(e.onCameraJump?.(),be(e.cam,i.focusGx,i.focusGy)):i.ok||e.showToast(i.msg,"⚠️"),e.refreshAll()})()}function Sn(e,t){if(t.startsWith("tour_")){Ut(e,t);return}zt(e);const o=e.root.querySelector("#neighborDialog");o?.open&&o.close();const a=e.sim.enterNeighborVisit(t);a.ok&&typeof a.focusGx=="number"&&typeof a.focusGy=="number"?(e.onCameraJump?.(),be(e.cam,a.focusGx,a.focusGy)):a.ok||e.showToast(a.msg,"⚠️"),e.refreshAll()}function Nt(e){e.flooAutoAdvanceTimer&&(window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=0);const t=e.sim.exitNeighborVisit(!1);if(t.ok&&(e.inspectSelection=null,e.rideCamUid=null,e.onCameraJump?.(),be(e.cam,t.focusGx,t.focusGy),typeof window<"u"&&window.location?.search)){const o=new URLSearchParams(window.location.search);if(o.has("visit")||o.has("tour")){o.delete("visit"),o.delete("tour");const a=o.toString();window.history.replaceState(null,"",`${window.location.pathname}${a?`?${a}`:""}${window.location.hash}`)}}e.refreshAll()}function Zn(e){const t=e.sim.ensureNeighborSocial(),o=t.playerOwlHelpRequests.filter(p=>!!p.fulfilledAt).length,a=t.playerMinigameSos?.rescuedAt??0,n=!!t.playerMinigameSos?.claimed,s=`${t.lastSocialResetKey}|${t.friendshipTokens}|${o}|${a}|${n}|${t.homeLanternMarks.length}|${t.dailyRescuesGivenIds.length}|${t.dailyGardenHelpsCount??0}`;if(s===e.lastSocialLiveSig)return;e.lastSocialLiveSig=s,$n(e),e.root.querySelector("#questDialog")?.open&&e.activeQuestTab==="orders"&&e.renderQuestDialog();const i=e.root.querySelector("#neighborDialog"),r=document.activeElement?.id??"";i?.open&&r!=="inpFlooDisplayName"&&pe(e)}function $n(e){const t=e.sim.ensureNeighborSocial(),o=Math.floor(t.friendshipTokens/_e),a=t.playerMinigameSos&&!t.playerMinigameSos.claimed&&t.playerMinigameSos.rescuedAt?1:0,n=t.homeLanternMarks.length,s=o+a+n,i=Math.max(0,Ye-t.dailyRescuesGivenIds.length)>0?t.neighbors.filter(C=>C.minigameSos&&!C.minigameSos.rescuedToday&&!t.dailyRescuesGivenIds.includes(C.id)).length:0,r=e.sim.state.level>=Ve&&(t.dailyGardenHelpsCount??0)<Se?e.flooDirectoryRows.filter(C=>tt(C)).length:0,p=e.root.querySelector("#badgeNeighborCount");if(p){const C=s>0?s:i>0?i:r;C>0?(p.textContent=String(C),p.classList.toggle("is-ready-green",s>0),p.classList.remove("hidden")):p.classList.add("hidden")}const y=e.root.querySelector("#badgeManageNeighborCount");y&&(s>0?(y.textContent=String(s),y.classList.remove("hidden")):y.classList.add("hidden"))}function Jn(e){const t=e.root.querySelector("#visitorDockBar");if(!t)return;if(e.photoModeActive){t.classList.add("hidden"),t.innerHTML="";return}const o=e.sim.getActiveHonorGardenTour();if(o){t.classList.remove("hidden"),t.innerHTML=`
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${m(Me(o.avatarEmoji,o.titleVi))}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${m(o.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${o.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span><span class="hs-raw">${m(o.ownerName)}</span> · ${m(bt[o.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `,t.querySelector("#btnHonorPrev")?.addEventListener("click",()=>{const d=e.sim.cycleHonorGardenTour(-1);d.ok&&typeof d.focusGx=="number"&&typeof d.focusGy=="number"&&(e.onCameraJump?.(),be(e.cam,d.focusGx,d.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorNext")?.addEventListener("click",()=>{const d=e.sim.cycleHonorGardenTour(1);d.ok&&typeof d.focusGx=="number"&&typeof d.focusGy=="number"&&(e.onCameraJump?.(),be(e.cam,d.focusGx,d.focusGy)),e.refreshAll()}),t.querySelector("#btnHonorShareFloo")?.addEventListener("click",()=>{Ot(e)}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Nt(e)});return}const a=e.sim.getActiveVisitingNeighbor();if(!a){t.classList.add("hidden"),t.innerHTML="";return}const n=e.sim.ensureNeighborSocial(),s=Date.now(),g=Math.min(Se,Math.max(n.dailyGardenHelpsCount??0,a.helpedViaFlooToday?1:a.helpedMarksToday.length)),i=Math.max(0,Se-g),r=!!(a.helpedViaFlooToday||a.helpedMarksToday.length>0),p=(a.hostHelpsLeft??10)<=0,y=!!(a.fireUntilMs&&a.fireUntilMs>s),C=!r&&i>0&&!p,L=n.dailyLikedNeighborIds.includes(a.id),l=n.dailyMysteryClaimedIds.includes(a.id),u=a.owlHelpCrates.filter(d=>!d.fulfilledByPlayerToday).length,b=e.sim.canRescueNeighborMinigame(a.id).ok,w=u+(b?1:0),k=e.flooQueueRows.length>0?e.flooQueueRows:e.flooDirectoryRows,I=a.remoteUserId||a.id.replace(/^player_/,""),E=k.length>1?`
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${k.slice(0,12).map(d=>{const c=d.uid===I,T=tt(d,s),S=!!(d.fire&&d.fire.until>s);return`
                <button
                  type="button"
                  class="floo-strip-dot ${c?"is-current":""} ${T?"is-helpable":""} ${S?"is-fire":""}"
                  data-floo-jump="${m(d.uid)}"
                  title="${m(d.username)} (Lv.${d.level})"
                >
                  ${ze(d.avatarUrl,Me(d.avatarEmoji,d.username),"floo-strip-avatar")}
                  ${S?'<span class="floo-mini-fire" aria-hidden="true">🔥</span>':""}
                </button>
              `}).join("")}
        </div>
      `:"",R=r?"✓ Đã giúp (-15p)":i<=0?"Hết lượt (5/5)":p?"Đủ lượt nhận":"🔥 Chăm giúp (-15p)";t.classList.remove("hidden"),t.innerHTML=`
    ${E}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${ze(a.avatarUrl,Me(a.avatarEmoji,a.name),"visitor-avatar-pill")}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong class="hs-raw">${m(a.name)}</strong>
            <span class="visitor-lv-tag">Lv.${a.level}</span>
            ${y?'<span class="floo-fire-tag">🔥 Đang cháy</span>':""}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${i}/${Se}</strong> lượt</span>
            <span>•</span>
            <span>Rương Tình Bạn <strong>${n.friendshipTokens}/${_e}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${k.length>1?'<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>':""}
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${C?"gold-cta":""}" ${C?"":"disabled"} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${R}
        </button>
        ${y?'<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>':""}
        <button id="btnVisitorLike" type="button" class="brass-btn" ${L?"disabled":""} title="Thả tim khen vườn">
          ${L?"✓ Tim":"❤️ +1🍀"}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${l?"disabled":""} title="Tìm Giỏ Quà Bí Ẩn">
          ${l?"✓ Quà":"🎁 Quà"}
        </button>
        <button id="btnVisitorLeaveGift" type="button" class="brass-btn" ${(n.dailyMysterySentIds??[]).includes(a.id)?"disabled":""} title="Giấu Rương Quà Bất Ngờ tặng chủ vườn (+2 🍀)">
          ${(n.dailyMysterySentIds??[]).includes(a.id)?"✓ Đã tặng":"🎁 Giấu quà"}
        </button>
        ${(()=>{const d=!!(e.sim.homeStateWhileVisiting??e.sim.state).roadsideStand?.dailyFriendBoughtIds?.includes(a.id),c=e.sim.getNeighborRoadsideOffer(a),T=ce(c.itemId),S=c.isRealFriendListing?`Sạp thật của ${a.name}: ${c.qty} ${T.name} (${c.totalSickle} Sickle)`:`Mua ${c.qty} ${T.name} ưu đãi từ Sạp Đầu Ngõ (${c.totalSickle} Sickle)`;return`<button id="btnVisitorBuyStand" type="button" class="brass-btn ${!d&&c.isRealFriendListing?"gold-cta":""}" ${d?"disabled":""} title="${m(S)}">
          ${d?"✓ Sạp":c.isRealFriendListing?`🧺 Sạp (${c.qty})`:"🧺 Sạp"}
        </button>`})()}
        ${w>0?`<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${w})</button>`:""}
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `,qs(t),t.querySelectorAll("[data-floo-jump]").forEach(d=>{d.addEventListener("click",()=>{const c=d.dataset.flooJump;c&&c!==I&&Ue(e,c,k)})}),t.querySelector("#btnVisitorFlooHelp")?.addEventListener("click",async()=>{const d=t.querySelector("#btnVisitorFlooHelp");d&&(d.disabled=!0);let c;if(a.remoteUserId)try{const $=Sa(n.selectedPresetNoteId),f=await qe.authoritativeClient.visit({hostUid:a.remoteUserId,help:!0,kind:"water_crop",noteText:$.textVi});typeof f.helpsLeft=="number"&&(c=f.helpsLeft,e.flooHelpsLeft=f.helpsLeft)}catch($){const f=Yt($);e.showToast(`${f.icon} ${f.text}`,f.icon),ft(e,!0),e.refreshAll();return}const T=e.sim.helpVisitedFlooMemberWholeGarden({serverHelpsLeft:c});if(!T.ok){e.showToast(T.msg,"🤝"),e.refreshAll();return}const S=$=>$.map(f=>f.uid===I?{...f,helped:!0}:f);if(e.flooDirectoryRows=S(e.flooDirectoryRows),e.flooQueueRows=S(e.flooQueueRows),e.refreshAll(),T.helpsLeft>0&&e.flooQueueRows.length>1){const $=Ct(e.flooQueueRows,I,1);$&&$.uid!==I&&tt($)&&(e.flooAutoAdvanceTimer&&window.clearTimeout(e.flooAutoAdvanceTimer),e.flooAutoAdvanceTimer=window.setTimeout(()=>{e.flooAutoAdvanceTimer=0,e.sim.getActiveVisitingNeighbor()?.id===a.id&&Ue(e,$.uid,e.flooQueueRows)},1600))}}),t.querySelector("#btnVisitorExtinguish")?.addEventListener("click",async()=>{const d=t.querySelector("#btnVisitorExtinguish");d&&(d.disabled=!0);try{let c=0;if(a.remoteUserId){const S=await qe.authoritativeClient.fireOut({hostUid:a.remoteUserId});c=Math.max(0,Math.floor(Number(S?.price||0)))}if(c>0){const S=e.sim.homeStateWhileVisiting??e.sim.state;S.galleons=Math.max(0,S.galleons-c),e.sim.homeStateWhileVisiting&&(e.sim.state.galleons=S.galleons)}a.fireUntilMs=0;const T=S=>S.map($=>$.uid===I?{...$,fire:null}:$);e.flooDirectoryRows=T(e.flooDirectoryRows),e.flooQueueRows=T(e.flooQueueRows),e.showToast(c>0?`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name} (-${c} Sickle)!`:`🧯 Đã dập tắt đám cháy giúp thung lũng ${a.name}!`,"🧯"),e.sim.saveToStorage(),e.refreshAll()}catch(c){const T=Yt(c);e.showToast(`${T.icon} ${T.text}`,T.icon),d&&(d.disabled=!1)}}),t.querySelector("#btnVisitorLike")?.addEventListener("click",()=>{const d=e.sim.likeVisitedNeighborFarm();d.ok||e.showToast(d.msg,"❤️"),e.refreshAll()}),t.querySelector("#btnVisitorLocateGift")?.addEventListener("click",()=>{l||(e.rideCamUid=null,e.onCameraJump?.(),be(e.cam,a.mysteryGiftGx+.5,a.mysteryGiftGy+.5),e.showToast("🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!","🎁"))}),t.querySelector("#btnVisitorCoopBook")?.addEventListener("click",()=>{fn(e,"friends",a.id)}),t.querySelector("#btnVisitorPrevFriend")?.addEventListener("click",()=>{const d=Ct(k,I,-1);d&&d.uid!==I&&Ue(e,d.uid,k)}),t.querySelector("#btnVisitorNextFriend")?.addEventListener("click",()=>{if(k.length>1){const c=Ct(k,I,1);if(c&&c.uid!==I){Ue(e,c.uid,k);return}}const d=e.sim.cycleNextNeighborVisit();d.ok&&typeof d.focusGx=="number"&&typeof d.focusGy=="number"&&(e.rideCamUid=null,e.onCameraJump?.(),be(e.cam,d.focusGx,d.focusGy)),e.refreshAll()}),t.querySelector("#btnVisitorReturnHome")?.addEventListener("click",()=>{Nt(e)}),t.querySelector("#btnVisitorBuyStand")?.addEventListener("click",()=>{const d=t.querySelector("#btnVisitorBuyStand"),c=e.sim.getNeighborRoadsideOffer(a);if(a.remoteUserId&&c.isRealFriendListing&&typeof c.slotIndex=="number"){const S=c.slotIndex;d&&(d.disabled=!0);const $=`stand_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;qe.authoritativeClient.buyRoadsideStand({hostUid:a.remoteUserId,slotIndex:S,itemId:c.itemId,qty:c.qty,totalSickle:c.totalSickle,requestId:$}).then(f=>{if(f.status==="refused"){$a(a,S,"Bạn HPVN"),e.showToast(`🧺 ${f.msg}`,"🧺"),e.refreshAll();return}const h=e.sim.buyVisitedNeighborRoadsideOffer({atomicServerVerified:f.status==="ok",expectedSlotIndex:S});h.ok?f.status==="ok"&&Ws():e.showToast(h.msg,"🧺"),e.refreshAll()});return}const T=e.sim.buyVisitedNeighborRoadsideOffer();T.ok||e.showToast(T.msg,"🧺"),e.refreshAll()}),t.querySelector("#btnVisitorLeaveGift")?.addEventListener("click",()=>{const d=e.sim.leaveMysteryGiftForNeighbor();d.ok||e.showToast(d.msg,"🎁"),e.refreshAll()})}function pe(e){const t=e.root.querySelector("#neighborDialogContent");if(!t)return;const o=t.dataset.activeNbTab??"",a=We(t),n=e.sim.ensureNeighborSocial(),s=e.sim.getActiveVisitingNeighbor(),g=e.sim.getActiveHonorGardenTour(),i=Date.now(),r=Gt(e),p=n.playerDisplayName?.trim()||e.sim.state.parkName?.trim()||"Phù Thủy Hang Sóc",y=Math.min(Se,Math.max(0,n.dailyGardenHelpsCount??0)),C=Math.max(0,Se-y),L=Math.max(0,Ye-n.dailyRescuesGivenIds.length),l=Math.max(0,Ye-n.dailyRescuesReceivedCount),u=Math.max(0,qt-n.dailyOwlHelpRequestedCount),b=n.friendshipTokens>=_e,w=Math.min(100,Math.round(n.friendshipTokens/_e*100)),k=n.playerMinigameSos&&!n.playerMinigameSos.claimed?n.playerMinigameSos:null,I=e.sim.state.level>=Ve||e.sim.state.sandboxMode||e.sim.isHeadmasterPreview,E=`
    <div class="workshop-tabs nb-tabs" role="group" aria-label="Cổng Floo">
      <button type="button" data-nbtab="friends" data-active="${e.activeNeighborTab==="friends"}" aria-pressed="${e.activeNeighborTab==="friends"}" class="brass-btn">
        <span class="hs-long">Cổng Floo</span><span class="hs-short">Floo</span>
      </button>
      <button type="button" data-nbtab="postcard" data-active="${e.activeNeighborTab==="postcard"}" aria-pressed="${e.activeNeighborTab==="postcard"}" class="brass-btn">
        Bưu Thiếp ${n.dailyFlooShareClaimed?"":'<span class="nb-tab-badge" aria-label="có quà">!</span>'}
      </button>
      <button type="button" data-nbtab="chest" data-active="${e.activeNeighborTab==="chest"}" aria-pressed="${e.activeNeighborTab==="chest"}" class="brass-btn">
        <span class="hs-long">Rương &amp; SOS</span><span class="hs-short">Rương</span> ${b||k?.rescuedAt?'<span class="nb-tab-badge" aria-label="có quà">!</span>':""}
      </button>
      <button type="button" data-nbtab="log" data-active="${e.activeNeighborTab==="log"}" aria-pressed="${e.activeNeighborTab==="log"}" class="brass-btn">
        Lưu Bút ${n.activityLog.length?`<span class="nb-tab-badge">${n.activityLog.length}</span>`:""}
      </button>
    </div>
  `;let R="";if(e.activeNeighborTab==="friends"){const $=[];(n.homeVisitorGifts?.length??0)>0&&$.push(`
        <div class="nb-alert-banner ready">
          <span>🎁 <strong>${n.homeVisitorGifts.length} Rương Quà Bạn Bè</strong> tại sân</span>
          <button id="btnNbClaimVisitorGift" type="button" class="brass-btn gold-cta nb-mini-cta">Mở quà</button>
        </div>
      `),n.homeLanternMarks.length>0&&$.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 <strong>${n.homeLanternMarks.length} Đèn Lồng</strong> tại vườn</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận +${n.homeLanternMarks.length} 🍀</button>
        </div>
      `);const f=`
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${ze(n.playerAvatarUrl,Dt[r],"floo-identity-avatar")}
          <div class="floo-identity-fields">
            <strong class="hs-card-title hs-raw">${m(p)}</strong>
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${e.sim.state.level}</span>
              <span class="nb-badge-pill house">${bt[r]}</span>
              <span class="floo-verified-tag">HPVN</span>
            </div>
          </div>
        </div>
      </section>
    `;let h="";if(I){const A=pt(e.flooDirectoryRows,i),H=A.filter(P=>tt(P,i)).length,O=[...e.flooHelpersToday,...n.homeLanternMarks.map(P=>({uid:P.helperId,name:P.helperName,avatarEmoji:P.helperEmoji,avatarUrl:P.helperAvatarUrl,at:P.createdAt}))],V=Array.from(new Map(O.map(P=>[P.uid||P.name,P])).values()),v=V.length>0?`
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${V.slice(0,6).map(P=>ze(P.avatarUrl,Me(P.avatarEmoji,P.name),"floo-helper-chip")).join("")}
              </div>
              <div class="floo-helpers-text">
                <strong>${m(wa(V))}</strong> đã giúp · −${V.length*15} phút
              </div>
            </div>
          `:"",q=A.length>0?`
            <div class="floo-portal-grid" role="list">
              ${A.map(P=>{const z=!!(P.fire&&P.fire.until>i),Q=tt(P,i),j=s?.remoteUserId===P.uid||s?.id===`player_${P.uid}`,ie=z?"🔥 Đang cháy":P.helped?"✓ Đã giúp":P.growing>0?`🌱 ${P.growing} mẻ`:"🌿 Yên bình";return`
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${z?"is-fire":""} ${Q?"is-helpable":""} ${P.helped?"is-helped":""} ${j?"is-visiting":""}"
                      data-floo-portal="${m(P.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${ze(P.avatarUrl,Me(P.avatarEmoji,P.username),"floo-portal-avatar")}
                        ${z?'<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>':""}
                        <span class="floo-portal-lv">Lv.${P.level}</span>
                      </div>
                      <strong class="floo-portal-name hs-raw">${m(P.username)}</strong>
                      <span class="floo-portal-park">${m((P.house?Dt[P.house]:"")||"🪄")} ${m(P.parkName||"")}</span>
                      <span class="floo-portal-status">${ie}</span>
                    </button>
                  `}).join("")}
            </div>
          `:`
            <div class="nb-panel-card">
              ${e.flooLoading?"Đang kết nối Cổng Floo…":"Chưa có vườn trực tuyến."}
            </div>
          `,D=n.neighbors.filter(P=>P.owlHelpCrates.some(z=>!z.fulfilledByPlayerToday)||!!(P.minigameSos&&!P.minigameSos.rescuedToday)),_=D.length>0?`
            <section class="floo-coop-board">
              <h3 class="nb-section-title">Tương trợ</h3>
              <div class="nb-friends-list">
                ${D.slice(0,6).map(P=>{const z=e.sim.canRescueNeighborMinigame(P.id),Q=P.minigameSos,j=Q?Ta(Q.kind):null,ie=!!(Q&&(Q.rescuedToday||n.dailyRescuesGivenIds.includes(P.id))),x=P.owlHelpCrates.filter(N=>!N.fulfilledByPlayerToday).map(N=>{const G=ce(N.itemId),U=e.sim.getFarmItemCount(N.itemId),W=e.sim.state.sandboxMode||U>=N.qty;return`
                          <div class="nb-crate-item">
                            <img src="${G.iconSrc}" alt="${m(G.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${N.qty} ${m(G.name)} <span class="nb-crate-stock">(${e.sim.state.sandboxMode?"∞":U}/${N.qty})</span></div>
                              <div class="nb-crate-rew">+${N.rewardTokens} 🍀 · +${N.rewardSickle} Sickle</div>
                            </div>
                            <button type="button" class="brass-btn ${W?"gold-cta":""} nb-mini-cta" data-nb-crate="${m(P.id)}|${m(N.id)}" ${W?"":"disabled"}>Đóng giúp</button>
                          </div>
                        `}).join(""),B=Q&&j&&!ie?`
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">${j.icon} ${m(j.nameVi)} · <strong>Màn ${Q.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${m(P.id)}" ${z.ok?"":"disabled"}>Cứu hộ</button>
                            </div>
                          </div>
                        `:"";return`
                      <article class="nb-friend-card ${e.focusedNeighborId===P.id?"focused":""}" data-neighbor-card="${m(P.id)}">
                        <div class="nb-card-head">
                          ${ze(P.avatarUrl,Me(P.avatarEmoji,P.name),"nb-avatar-circle")}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name hs-raw">${m(P.name)}</strong>
                              <span class="nb-badge-pill">Lv.${P.level}</span>
                              <span class="nb-badge-pill house">${bt[P.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${m(P.id)}">Bay tới</button>
                        </div>
                        ${x?`<div class="nb-coop-section"><div class="nb-crate-list">${x}</div></div>`:""}
                        ${B}
                      </article>
                    `}).join("")}
              </div>
            </section>
          `:"";h=`
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng</h3>
              <div class="floo-hearth-sub">
                Giúp vườn: ${C}/${Se} · ${H} vườn chờ (−15p)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" aria-label="Làm mới" ${e.flooLoading?"disabled":""}>
                ${e.flooLoading?"…":"Làm mới"}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${A.length===0?"disabled":""}>
                Bay Floo
              </button>
            </div>
          </div>
          ${v}
        </section>
        ${q}
        ${_}
      `}else{const A=Math.min(100,Math.round(e.sim.state.level/Ve*100));h=`
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <h3 class="floo-hearth-title">Cổng Floo Cộng Đồng · Mở Cấp ${Ve}</h3>
              <div class="floo-hearth-sub">
                Cấp ${e.sim.state.level}/${Ve} · Tự kết nối vườn thành viên HPVN
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${A}%"></div>
              </div>
            </div>
          </div>
        </section>
      `}const M=`
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Vườn mẫu</h3>
          <span class="honor-daily-pill">
            ${n.dailyHonorTourClaimed?"✓ Đã nhận hôm nay":"+8 Sickle · +15 XP/ngày"}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${Ca.map(A=>{const H=g?.id===A.id;return`
              <article class="honor-garden-card ${H?"visiting":""}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${m(Me(A.avatarEmoji,A.ownerName))}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${m(A.titleVi)}</strong>
                    <span class="honor-garden-owner"><span class="hs-raw">${m(A.ownerName)}</span> · Lv.${A.level} · ${bt[A.house]}</span>
                  </div>
                </div>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">${m(ds[A.weather]??A.weather)} · ${m(ds[A.atmosphere]??A.atmosphere)}</span>
                  ${H?'<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">Về vườn</button>':`<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${m(A.id)}">Tham quan</button>`}
                </div>
              </article>
            `}).join("")}
        </div>
      </section>
    `;R=`
      ${$.join("")}
      ${f}
      ${I?`${h}${M}`:`${M}${h}`}
    `}else if(e.activeNeighborTab==="postcard"){const $=Rt(e),f=Ks($),h=n.postcardTheme||"classic_burrow",M=Object.keys(ss).map(A=>{const H=ss[A],O=A===h;return`<button type="button" data-postcard-theme="${A}" data-active="${O}" aria-pressed="${O}" class="brass-btn ${O?"gold-cta":""}" style="font-size:12px;padding:4px 10px;">${H.badgeVi} · ${m(H.labelVi)}</button>`}).join("");R=`
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <h3 class="nb-section-title">Bưu thiếp</h3>
          <span class="honor-daily-pill">
            ${n.dailyFlooShareClaimed?"✓ Đã nhận hôm nay":"+10 Sickle · +1 🍀"}
          </span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;" role="group" aria-label="Chủ đề khung bưu thiếp">
          ${M}
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${m(f)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            Chia sẻ lên Floo
          </button>
        </div>
      </section>
    `}else if(e.activeNeighborTab==="chest"){const $=n.playerOwlHelpRequests.length>0?n.playerOwlHelpRequests.map(f=>{const h=ce(f.itemId);return`
                <div class="nb-crate-item ${f.fulfilledAt?"done":""}">
                  <img src="${h.iconSrc}" alt="${m(h.name)}" class="nb-crate-icon" />
                  <div class="nb-crate-info">
                    <div class="nb-crate-title">${f.qty} ${m(h.name)}</div>
                    <div class="nb-crate-rew">${f.fulfilledAt?`✓ ${m(f.helperEmoji??"🦉")} <span class="hs-raw">${m(f.helperName??"Bạn HPVN")}</span>`:"Đang chờ bạn giúp"}</div>
                  </div>
                </div>
              `}).join(""):'<div class="floo-muted-note">Chưa có đơn nhờ giúp.</div>';R=`
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <h3 class="nb-section-title">Rương Tình Bạn (${n.friendshipTokens}/${_e})</h3>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${w}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug"><img class="hs-ico" src="/trang-trai-hang-soc/sprites/beast_phoenix.webp" alt="" aria-hidden="true" draggable="false"> +1 Bùa</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150 Sickle</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${n.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${b?"":"disabled"}>
              Mở rương (🍀 ${_e})
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          ${(()=>{const f=e.sim.ensureCoopSupplyCrate(),h=e.sim.getNeighborhoodCoopSummary(),M=Math.min(100,Math.round(h.totalPoints/500*100)),H=["ottery_wheat","honey_carrot","garden_pumpkin","burrow_apple","cinnamon_apple_pie","farm_egg_wool"].map(v=>{const q=e.sim.getFarmItemCount(v),D=(e.sim.state.sandboxMode||q>=2)&&(e.sim.state.sandboxMode||f.playerContributedToday<as),_=ce(v);return`<button type="button" data-coop-contrib="${v}" ${D?"":"disabled"} class="brass-btn ${D?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">Góp 2 ${m(_.name)} (${e.sim.state.sandboxMode?"∞":q})</button>`}).join(""),O=Oa.map(v=>{const q=f.claimedMilestones.includes(v.step),D=!q&&(e.sim.state.sandboxMode||h.totalPoints>=v.target);return`<button type="button" data-coop-milestone="${v.step}" ${D?"":"disabled"} class="brass-btn ${D?"gold-cta":""}" style="font-size:12px;padding:4px 8px;">${q?`✓ Mốc ${v.step}`:`🎁 Mốc ${v.step} (${v.target}đ)`}</button>`}).join(""),V=h.syncedContributors.length>0?`<div class="hs-coop-roster">
                    <span class="hs-coop-roster-label">${h.isServerAuthoritative?`✨ Quỹ Liên Minh HPVN (+${h.syncedFriendPoints}đ):`:`🔥 Bạn Floo tuần này (+${h.syncedFriendPoints}đ):`}</span>
                    ${h.syncedContributors.slice(0,6).map(v=>`<span class="hs-coop-chip">${m(Me(v.avatarEmoji||"🦉",v.displayName))} <span class="hs-raw">${m(v.displayName)}</span> +${v.points}đ</span>`).join("")}
                  </div>`:'<div class="hs-coop-roster is-empty">Ghé thăm vườn bạn qua Cổng Floo để cộng dồn điểm Kiện Hàng tuần này cùng xóm!</div>';return`
              <h3 class="nb-section-title">Kiện Hàng Tương Trợ Chung (${h.totalPoints}/500)</h3>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${M}%"></div>
              </div>
              <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 6px;">
                Đã góp hôm nay: ${f.playerContributedToday}/${as} lượt · Vườn nhà ${h.localPoints}đ${h.syncedFriendPoints>0?` + Bạn Floo ${h.syncedFriendPoints}đ`:""}
              </div>
              ${V}
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${O}</div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">${H}</div>
            `})()}
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">SOS &amp; Đơn Cú</h3>
          <div class="floo-sos-wrap">
            ${k?`
                  <div class="nb-alert-banner ${k.rescuedAt?"ready":""}">
                    <span>${k.rescuedAt?`<strong>${m(k.rescuerEmoji??"🦉")} ${m(k.rescuerName??"Bạn HPVN")}</strong> đã cứu <strong>Màn ${k.stage}</strong>`:`Đang gọi cứu <strong>Màn ${k.stage}</strong>`}</span>
                    ${k.rescuedAt?'<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">Nhận</button>':""}
                  </div>
                `:`<div class="floo-muted-note">Cứu hộ: ${L}/${Ye} · Nhận cứu: ${l}/${Ye}</div>`}
          </div>
          <div>
            <div class="floo-sub-heading">Đơn Cú nhờ bạn (${u}/${qt})</div>
            <div class="nb-crate-list">${$}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <h3 class="nb-section-title">Lời nhắn thăm vườn</h3>
          <div class="nb-preset-notes">
            ${xa.map(f=>{const h=f.id===n.selectedPresetNoteId;return`
                <button type="button" data-nb-note="${f.id}" data-active="${h}" aria-pressed="${h}" class="brass-btn nb-note-btn">
                  ${f.emoji} ${m(f.shortVi)}
                </button>
              `}).join("")}
          </div>
        </section>
      </div>
    `}else R=`<div class="nb-log-list">${n.activityLog.length>0?n.activityLog.map(f=>{const h=new Date(f.timestamp),M=String(h.getHours()).padStart(2,"0"),A=String(h.getMinutes()).padStart(2,"0");return`
                <div class="nb-log-row">
                  <span class="nb-log-icon" aria-hidden="true">${m(f.icon)}</span>
                  <span class="nb-log-msg">${m(f.textVi)}</span>
                  <span class="nb-log-time">${M}:${A}</span>
                </div>
              `}).join(""):'<div class="nb-panel-card">Chưa có lưu bút.</div>'}</div>`;t.innerHTML=`
    ${E}
    ${R}
  `,t.dataset.activeNbTab=e.activeNeighborTab,Ke(t,a,!!(o&&o!==e.activeNeighborTab)),qs(t);const d=t.querySelector("#flooPostcardCanvas");if(d){const $=Rt(e);ms().then(()=>bs(e.gameCanvas,$,d))}if(t.querySelectorAll("[data-nbtab]").forEach($=>{$.addEventListener("click",()=>{e.activeNeighborTab=$.dataset.nbtab,pe(e)})}),t.querySelector("#btnFlooOpenPostcardTab")?.addEventListener("click",()=>{e.activeNeighborTab="postcard",pe(e)}),t.querySelector("#btnFlooQuickInvite")?.addEventListener("click",()=>{Ot(e),pe(e)}),t.querySelector("#btnPostcardShareFloo")?.addEventListener("click",()=>{Ot(e),pe(e)}),t.querySelectorAll("[data-postcard-theme]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.postcardTheme;e.sim.setPostcardFrameTheme(f),pe(e)})}),t.querySelector("#btnNbClaimVisitorGift")?.addEventListener("click",()=>{const $=e.sim.claimHomeVisitorMysteryGift();$.ok||e.showToast($.msg,"🎁"),e.refreshAll(),pe(e)}),e.activeNeighborTab==="chest"){const $=e.sim.ensureCoopSupplyCrate().weekKey,f=Number(t.dataset.coopSyncedAt??0);Date.now()-f>3e4&&(t.dataset.coopSyncedAt=String(Date.now()),qe.authoritativeClient.fetchCoopCrate({weekKey:$}).then(h=>{if(h.status!=="ok")return;ns({weekKey:h.weekKey,totalPoints:h.totalPoints,contributors:h.contributors,syncedAt:Date.now()}),e.root.querySelector("#neighborDialog")?.open&&e.activeNeighborTab==="chest"&&pe(e)}))}t.querySelectorAll("[data-coop-contrib]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.coopContrib,h=e.sim.contributeToCoopSupplyCrate(f,2);if(e.showToast(h.msg,h.ok?"📦":"🧺"),h.ok&&h.addedPoints>0){const M=e.sim.ensureCoopSupplyCrate().weekKey,A=`coop_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;qe.authoritativeClient.contributeCoopCrate({weekKey:M,itemId:f,qty:2,points:h.addedPoints,requestId:A}).then(H=>{if(H.status!=="ok")return;ns({weekKey:H.weekKey,totalPoints:H.totalPoints,contributors:H.contributors,syncedAt:Date.now()}),e.root.querySelector("#neighborDialog")?.open&&e.activeNeighborTab==="chest"&&pe(e)})}e.refreshAll(),pe(e)})}),t.querySelectorAll("[data-coop-milestone]").forEach($=>{$.addEventListener("click",()=>{const f=Number($.dataset.coopMilestone),h=e.sim.claimCoopCrateMilestone(f);e.showToast(h.msg,h.ok?"🎁":"📦"),e.refreshAll(),pe(e)})}),t.querySelector("#frmFlooIdentityName")?.addEventListener("submit",$=>{$.preventDefault();const h=(t.querySelector("#inpFlooDisplayName")?.value??"").trim().slice(0,32);h&&(n.playerDisplayName=h,e.sim.saveToStorage(),ft(e,!0),e.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${h}"!`,"🔥"),pe(e))}),t.querySelector("#btnFlooRefreshDir")?.addEventListener("click",()=>{ft(e,!0)}),t.querySelector("#btnFlooQuickJump")?.addEventListener("click",()=>{const $=pt(e.flooDirectoryRows,Date.now());$.length>0&&Ue(e,$[0].uid,$)}),t.querySelectorAll("[data-floo-portal]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.flooPortal;if(!f)return;const h=pt(e.flooDirectoryRows,Date.now());Ue(e,f,h)})}),t.querySelectorAll("[data-honor-tour]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.honorTour;f&&Ut(e,f)})});const T=()=>{const $=e.sim.openFriendshipChest();$.ok||e.showToast($.msg,"🍀"),e.refreshAll(),pe(e)};t.querySelector("#btnNbQuickOpenChest")?.addEventListener("click",T),t.querySelector("#btnNbOpenFriendshipChest")?.addEventListener("click",T);const S=e.root.querySelector("#btnNbOpenFriendsLeaderboard");S&&(S.onclick=()=>{e.sim.audio.playClick(),e.openLeaderboardDialog(void 0,"friends")}),t.querySelectorAll("#btnNbClaimMySos").forEach($=>{$.addEventListener("click",()=>{const f=e.sim.claimPlayerMinigameSosRescue();f.ok||e.showToast(f.msg,"⚠️"),e.refreshAll(),pe(e)})}),t.querySelector("#btnNbClaimAllLanterns")?.addEventListener("click",()=>{const $=[...e.sim.ensureNeighborSocial().homeLanternMarks];for(const f of $)e.sim.claimHomeLanternMark(f.id);e.refreshAll(),pe(e)}),t.querySelectorAll("[data-nb-visit]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.nbVisit;f&&Sn(e,f)})}),t.querySelector("#btnNbExitCurrentVisit")?.addEventListener("click",()=>{e.root.querySelector("#neighborDialog")?.close(),Nt(e)}),t.querySelectorAll("[data-nb-crate]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.nbCrate??"",[h,M]=f.split("|");if(!h||!M)return;const A=e.sim.fulfillNeighborOwlCrate(h,M);A.ok||e.showToast(A.msg,"🧺"),e.refreshAll(),pe(e)})}),t.querySelectorAll("[data-nb-rescue]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.nbRescue;if(!f)return;const h=e.sim.canRescueNeighborMinigame(f);if(!h.ok||!h.neighbor||!h.sos){e.showToast(h.reason??"Không thể giải cứu màn này lúc này!","🦉");return}hn(e,{neighborId:h.neighbor.id,neighborName:h.neighbor.name,neighborEmoji:h.neighbor.avatarEmoji,kind:h.sos.kind,stage:h.sos.stage})})}),t.querySelectorAll("[data-nb-note]").forEach($=>{$.addEventListener("click",()=>{const f=$.dataset.nbNote;f&&(e.sim.setNeighborPresetNote(f),e.showToast("Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!","🏮"),pe(e))})})}function rt(e){const t=e.sim.getTutorialWorldTarget();if(!t)return;e.cam.zoom<.85&&(e.cam.zoom=.98);const a=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory?-.35:e.tutorialMinimized?0:.95;be(e.cam,t.gx+t.bw*.5+a,t.gy+t.bh*.5+a),e.onCameraJump?.()}function wn(e){const t=e.sim.getCurrentTutorialStep();if(!t)return{el:null,label:""};if(t.id==="harvest_wheat")return!e.sim.getTutorialWorldTarget()?{el:e.root.querySelector("#btnOpenSeedSilo"),label:"👇 Đặt ruộng"}:{el:null,label:""};if(t.id==="sow_and_merge_plot")return e.activeSeedCropId?{el:null,label:""}:e.seedTrayOpen?{el:e.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])')??e.root.querySelector("[data-seed-brush]:not([disabled])"),label:"🌸 Chọn Hoa"}:{el:e.root.querySelector("#btnOpenSeedSilo"),label:"🌱 Kho Hạt"};if(t.id==="pasture_harvest_and_stock"){const o=Date.now();return e.sim.state.buildings.some(n=>Y(n.itemId)?.isAnimalPasturePlot&&n.pastureAnimalId&&n.pastureReadyAt&&o>=n.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3?{el:null,label:""}:e.activePastureAnimalId?{el:null,label:""}:e.pastureTrayOpen?{el:e.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])')??e.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])'),label:"🐾 Chọn thú"}:{el:e.root.querySelector("#btnOpenPastureTray"),label:"🐾 Chăn Thả"}}if(t.id==="seed_quiz_or_buy")return e.seedTrayOpen?{el:e.root.querySelector("#btnSeedTrayOpenQuiz"),label:"🪄 Nhận 0 Sickle"}:{el:e.root.querySelector("#btnTutorialPrimaryCta"),label:"🪄 Thần Chú"};if(t.id==="earn_magic_star")return{el:e.root.querySelector("#btnCornerPlayPuzzle"),label:"🍓 Chơi!"};if(t.id==="build_and_owl_order"){if(e.selectedCatalogItem)return{el:null,label:""};if(e.buildSheetOpen||e.activeCategory){const o=e.root.querySelector('[data-item-id="burrow_house_canon"]')??e.root.querySelector('[data-item-id="molly_apple_bakery"]');if(o)return{el:o,label:"✨ Chọn dựng!"}}return e.sim.getReadyOwlOrdersCount()>0?{el:e.root.querySelector("#btnOpenQuests"),label:"🦉 Giao Đơn!"}:{el:e.root.querySelector("#btnToggleBuildDock"),label:"🔨 Xây Dựng"}}return{el:null,label:""}}function ps(e){const t=e.root.querySelector("#tutorialHudSpotlight"),o=e.root.querySelector("#tutorialHudSpotlightLabel");if(e.root.querySelectorAll('[data-tutorial-anchor="true"]').forEach(p=>p.removeAttribute("data-tutorial-anchor")),!t)return;const a=!!document.querySelector("dialog[open]");if(e.photoModeActive||a||!e.sim.isTutorialActive()){t.classList.add("hidden");return}const{el:n,label:s}=wn(e);if(!n||n.id==="btnTutorialPrimaryCta"){t.classList.add("hidden");return}const g=n.getBoundingClientRect();if(g.width<8||g.height<8){t.classList.add("hidden");return}const i=!!n.closest("#seedBrushTray, #pastureBrushTray, #visitorDockBar");i||n.setAttribute("data-tutorial-anchor","true"),t.classList.toggle("use-css-anchor",!i);const r=6;t.style.setProperty("--spot-left",`${Math.round(g.left-r)}px`),t.style.setProperty("--spot-top",`${Math.round(g.top-r)}px`),t.style.setProperty("--spot-w",`${Math.round(g.width+r*2)}px`),t.style.setProperty("--spot-h",`${Math.round(g.height+r*2)}px`),t.classList.toggle("pill-below",g.top<110),o&&(o.textContent=s||"👇 Bấm"),t.classList.remove("hidden")}function Es(){return typeof HTMLElement<"u"&&Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")&&typeof HTMLElement.prototype.showPopover=="function"}function Tn(e,t){if(Es())try{t.matches(":popover-open")&&t.hidePopover()}catch{}t.classList.remove("is-legacy-open")}function Cn(e,t){if(Es())try{t.matches(":popover-open")||t.showPopover();return}catch{}t.classList.add("is-legacy-open")}function ht(e){const t=e.root.querySelector("#tutorialCoachCard");if(!t)return;const o=!!document.querySelector("dialog[open]"),a=e.manageMenuOpen||e.weatherPopoverOpen,n=e.sim.getCurrentTutorialStep();if(e.photoModeActive||o||a||!n){Tn(e,t),ps(e);return}e.sim.state.tutorial&&typeof e.sim.state.tutorial.minimized=="boolean"&&(e.tutorialMinimized=e.sim.state.tutorial.minimized);const s=e.seedTrayOpen||e.pastureTrayOpen||e.buildSheetOpen||!!e.activeCategory||!!e.selectedCatalogItem;t.classList.toggle("docked-top",s),t.classList.toggle("is-minimized",e.tutorialMinimized);const g=e.sim.getReadyOwlOrdersCount(),i=`${n.index}:${n.id}:${e.tutorialMinimized?1:0}:${s?1:0}:${g}`;if(e.lastRenderedTutorialSig!==i){e.lastRenderedTutorialSig=i;const p=Jt.map(y=>`<span class="tutorial-step-dot ${y.index<n.index?"done":y.index===n.index?"current":"upcoming"}" aria-hidden="true"></span>`).join("");if(e.tutorialMinimized)t.innerHTML=`
          <div class="tutorial-mini-bar">
            <img src="/trang-trai-hang-soc/sprites/${n.pose}.webp" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${m(n.title)}</h2>
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
        `;else{const y=n.id==="earn_magic_star"?'<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">4 Môn</button>':n.id==="build_and_owl_order"?`<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${g>0?"Xây":"Đơn Cú"}</button>`:"",C=n.id==="build_and_owl_order"?g>0?"Giao đơn":"Xây dựng":n.ctaLabel;t.innerHTML=`
          <div class="tutorial-portrait-col">
            <img src="/trang-trai-hang-soc/sprites/${n.pose}.webp" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${Jt.length}"
              aria-valuenow="${n.index+1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${p}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">${m(n.speakerName)}</div>
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
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${m(n.title)}</h2>
            <div class="tutorial-hint-strip">${m(n.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">Thưởng: ${m(n.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${y}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${m(C)}</button>
              </div>
            </div>
          </div>
        `}t.querySelector("#btnTutorialExpand")?.addEventListener("click",()=>{e.tutorialMinimized=!1,e.sim.ensureTutorialState().minimized=!1,e.sim.saveToStorage(),ht(e)}),t.querySelector("#btnTutorialMinimize")?.addEventListener("click",()=>{e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),ht(e)}),t.querySelector("#btnTutorialSkip")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialSkipMini")?.addEventListener("click",()=>{e.sim.skipTutorial()}),t.querySelector("#btnTutorialPrimaryCta")?.addEventListener("click",()=>{xn(e,n.id)}),t.querySelector("#btnTutorialSecondaryCta")?.addEventListener("click",()=>{n.id==="earn_magic_star"?e.openPuzzleArcadeDialog():n.id==="build_and_owl_order"&&(g>0?(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()):(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()))})}Cn(e,t);const r=`${n.index}:${n.id}`;e.lastFocusedTutorialStepKey!==r&&(e.lastFocusedTutorialStepKey=r,requestAnimationFrame(()=>{t.querySelector("[data-tutorial-focus]")?.focus({preventScroll:!0})})),ps(e)}function xn(e,t){if(t==="harvest_wheat"){const o=e.sim.getTutorialWorldTarget();if(o)e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),rt(e),e.sim.onBuildingTactile?.(o.uid),ht(e),e.showToast("Chạm vào ô Lúa Mì chín vàng để gặt!","🌾");else{const a=Y("farmland_plot");a&&(e.selectedCatalogItem=a,e.refreshAll())}return}if(t==="sow_and_merge_plot"){rt(e),e.seedFilterMode="flowers",e.openSeedTray("english_rose");return}if(t==="pasture_harvest_and_stock"){const o=Date.now();if(e.sim.state.buildings.some(n=>Y(n.itemId)?.isAnimalPasturePlot&&n.pastureAnimalId&&n.pastureReadyAt&&o>=n.pastureReadyAt)&&!e.sim.state.tutorial?.pastureHarvestedInStep3){const n=e.sim.getTutorialWorldTarget();e.tutorialMinimized=!0,e.sim.ensureTutorialState().minimized=!0,e.sim.saveToStorage(),e.cam.zoom=Math.max(e.cam.zoom,1.1),rt(e),n&&e.sim.onBuildingTactile?.(n.uid),ht(e),e.showToast("Chạm vào ô Đồng Cỏ có trứng để thu hoạch!","🥚")}else rt(e),e.openPastureTray("ottery_sheep");return}if(t==="seed_quiz_or_buy"){e.openSeedQuizDialog("meadow_daisy",null);return}if(t==="earn_magic_star"){e.openMatch3Dialog();return}t==="build_and_owl_order"&&(e.sim.getReadyOwlOrdersCount()>0?(e.activeQuestTab="orders",e.renderQuestDialog(),e.root.querySelector("#questDialog").showModal()):(e.closeSeedTray(),e.closePastureTray(),e.buildSheetOpen=!0,e.activeCategory="shop",e.refreshAll()))}export{Bt as $,Be as A,Ua as B,ja as C,hs as D,Nn as E,Fn as F,Ss as G,Wa as H,Vn as I,Dn as J,xe as K,_n as L,ws as M,nn as N,Ge as O,zn as P,on as Q,et as R,Un as S,ln as T,jn as U,Ts as V,Je as W,Za as X,Ja as Y,en as Z,tn as _,Ya as a,sn as a0,Gn as a1,J as a2,Yn as a3,mn as a4,As as a5,Te as a6,Ce as a7,cs as a8,Wn as a9,re as aa,fe as ab,Zn as ac,$n as ad,Jn as ae,pe as af,rt as ag,wn as ah,ps as ai,Tn as aj,Cn as ak,ht as al,xn as am,qs as an,ze as ao,Rn as b,ne as c,fn as d,m as e,Qn as f,Xn as g,Xa as h,dn as i,hn as j,Sn as k,Hn as l,Ut as m,Ue as n,ft as o,Bn as p,Kn as q,yn as r,In as s,Nt as t,za as u,On as v,St as w,Cs as x,Qa as y,st as z};

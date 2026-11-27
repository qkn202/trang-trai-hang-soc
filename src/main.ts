import './styles/fonts.css';
import './styles/main.css';
import './styles/puzzleArcade.css';
import './styles/hudAndMatch3.css';
import './styles/minigameHalls.css';
import { getCatalogItem } from './data/catalog';
import { getLevelInfo } from './data/levels';
import { MAX_MATCH3_STAGE, MAX_MINIGAME_STAGE } from './data/match3Levels';
import { TUTORIAL_STEPS } from './data/quests';
import { GRID_SIZE } from './data/zones';
import { MagicalAudio } from './engine/audio';
import { CameraDirector } from './engine/cameraDirector';
import {
  Camera,
  centerCameraOnGrid,
  ELEV_PX,
  gridToScreen,
  rotateCamera90,
  screenToGrid,
  worldIso,
} from './engine/isometric';
import { IsometricRenderer, isTouchOrIOSDevice } from './engine/renderer';
import { SpriteRegistry } from './engine/spriteLoader';
import { sampleCoasterTrainPositions } from './sim/coaster';
import { isDragPaintableCatalogItem, isRepeatableCatalogItem, setFarmStore, ParkSimulation } from './sim/simulation';
import { worldGetStashedDecorCount } from './sim/simulationWorld';
import {
  CatalogItem,
  FarmCropId,
  HeatmapMode,
  LeaderboardGameId,
  LeaderboardScope,
  PuzzleArcadeMode,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
  TimeOverride,
  ValleyVillagerId,
  WeatherOverride,
  ZoneId,
} from './types/game';
import { accessibility, announce } from './ui/accessibility';
import { haptic } from './ui/haptics';
import { GameHUD } from './ui/hud';
import {
  GamepadController,
  RADIAL_QUICK_SLICES,
  RadialQuickActionId,
} from './ui/platformAndA11y';
import { ProductionTelemetryCollector } from './ui/productionShip';
import { flushFarmSave, identity, isStandaloneLocal, loadFarm, placeShellNav, queueFarmSave, setInboxListener, setSaveStatusListener } from './hpvn/bridge';
import { applyFarmInbox } from './hpvn/inbox';
import { installCanvasEmojiFilter, installEmojiFilter } from './hpvn/emoji';
import { installTabCentering } from './hpvn/toolIcons';
import { CrossLayerFlyingCollectibles } from './render/fx/flyingCollectibles';

const isDragPaintableItem = isDragPaintableCatalogItem;

// HPVN: brush items (paths & 1x1 fences) stay armed between strokes; non-brush buildings confirm/disarm cleanly
const isBrushItem = (item: CatalogItem): boolean => isDragPaintableItem(item);

async function bootstrap(): Promise<void> {
  const app = document.getElementById('app')!;
  installEmojiFilter(); // HPVN: no emoji on screen (owner 14/11)
  installTabCentering(); // HPVN: a re-rendered tab row keeps its current tab in view
  // HPVN: on a touch screen a field focused in a dialog moves to the top of the dialog's scroller, above the keyboard
  // (phone landscape: the dialog fills the height and iOS does not shrink dvh for the keyboard)
  document.addEventListener('focusin', (e) => {
    const field = e.target as HTMLElement;
    const box = field.closest?.('input:not([type=checkbox], [type=radio], [type=range]), textarea') ? field.closest<HTMLElement>("dialog [id$='DialogContent']") : null;
    if (box && matchMedia('(pointer: coarse)').matches) box.scrollTop += field.getBoundingClientRect().top - box.getBoundingClientRect().top - 8;
  });
  installCanvasEmojiFilter();
  // Thu dọn hộp hướng dẫn "mở file sai cách" (index.html) nếu game kịp mount sau khi nó hiện ra
  const fileOpenHelp = document.getElementById('hangsoc-file-open-help');
  if (fileOpenHelp) fileOpenHelp.remove();
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.setAttribute('aria-label', 'Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade');
  app.appendChild(canvas);

  // HPVN: the farm lives on the HPVN server; without it nothing starts (a fresh farm must never overwrite a saved one).
  if (!identity) throw Object.assign(new Error('Hãy mở Trang Trại Hang Sóc từ Phòng Sinh Hoạt Chung trên HPVN.'), { hpvn: true });
  const farmJson = await loadFarm();
  if (!isStandaloneLocal) {
    setFarmStore({ read: () => farmJson, write: queueFarmSave });
  }

  const audio = new MagicalAudio();
  const sprites = new SpriteRegistry();
  await sprites.loadAll();

  const sim = new ParkSimulation(audio);
  if (typeof sim.state.settings.toonEnabled === 'boolean') sprites.setToonEnabled(sim.state.settings.toonEnabled); // HPVN: «Viền nâu» survives a reload
  // HPVN: the in-game house is the member's HPVN house (hidden Sorting Hat, no changes); 'none' keeps upstream behaviour
  const hpvnHouse = ({ gryffindor: 'Gryffindor', slytherin: 'Slytherin', ravenclaw: 'Ravenclaw', hufflepuff: 'Hufflepuff' } as const)[
    String(identity.house).toLowerCase() as 'gryffindor'
  ];
  if (hpvnHouse) sim.lockPlayerHouse(hpvnHouse);
  const cam: Camera = { x: 0, y: 0, zoom: 0.82, viewRot: 0 };
  centerCameraOnGrid(cam, 18.0, 24.5);

  const renderer = new IsometricRenderer(canvas, sprites);
  sprites.onBatchLoaded(() => {
    renderer.groundCacheKey = '';
  });
  const hud = new GameHUD(app, sim, cam, canvas, sprites);
  const hudTopLeft = app.querySelector('.ts-hud-topleft');
  if (hudTopLeft && !isStandaloneLocal) placeShellNav(hudTopLeft);

  accessibility.init(sim);
  setSaveStatusListener((status) => {
    if (status === 'replaced') showStop('Bạn đang chơi Trang Trại Hang Sóc ở nơi khác', 'Trang trại này không lưu nữa. Tải lại để chơi tiếp ở đây.');
    else if (status === 'too-big') hud.showToast('Trang trại quá lớn để lưu lên HPVN, hãy dọn bớt đồ trang trí.', '⚠️');
    else if (status === 'error') hud.showToast('Chưa lưu được lên HPVN, sẽ thử lại.', '⚠️');
  });
  // HPVN: helps other members gave this farm (server inbox), applied once to the home farm and saved
  setInboxListener((entries) => {
    const galleonsBeforeInbox = sim.state.galleons;
    const applied = applyFarmInbox(sim.homeStateWhileVisiting ?? sim.state, entries, Date.now(), sim.state);
    if (!applied.length) return;
    const bought = applied.reduce((sum, entry) => sum + (entry.kind === 'sickles' ? entry.sickle ?? 0 : 0), 0);
    if (bought) hud.showToast(`Gringotts đã chuyển ${bought.toLocaleString('vi-VN')} Sickle vào trang trại!`, '🏦');
    const cups = applied.filter((entry) => entry.kind === 'cup');
    const cupSickles = cups.reduce((s, e) => s + (Number.isSafeInteger(e.sickle) && e.sickle! > 0 ? e.sickle! : 0), 0);
    const cupSand = cups.reduce((s, e) => s + (Number.isSafeInteger(e.sand) && e.sand! > 0 && Number.isSafeInteger(e.sickle) && e.sickle! > 0 ? e.sand! : 0), 0);
    const standSales = applied.filter((entry) => entry.kind === 'stand-sale');
    const totalCreditedSickles = Math.max(bought + cupSickles, sim.state.galleons - galleonsBeforeInbox);
    sim.creditVerifiedInboxGrant(totalCreditedSickles, cupSand);
    if (standSales.length) {
      const standEarned = standSales.reduce((s, e) => s + (Number.isSafeInteger(e.sickle) && e.sickle! > 0 ? e.sickle! : 0), 0);
      const firstBuyer = standSales[0].name || 'Bạn HPVN';
      hud.showToast(
        standSales.length > 1
          ? `🧺 ${firstBuyer} và ${standSales.length - 1} bạn vừa mua hàng ở Sạp Đầu Ngõ (+${standEarned.toLocaleString('vi-VN')} Sickle)!`
          : `🧺 ${firstBuyer} vừa mua hàng tại Sạp Đầu Ngõ của bạn (+${standEarned.toLocaleString('vi-VN')} Sickle)!`,
        '🧺'
      );
    }
    const helps = applied.filter((entry) => entry.kind === 'help');
    for (const entry of helps) hud.flooHelpersToday.push({ uid: entry.uid ?? '', name: entry.name ?? '', avatarUrl: entry.avatarUrl, at: entry.at });
    if (helps.length) hud.showToast(`${helps[0].name}${helps.length > 1 ? ` +${helps.length - 1} bạn` : ''} chăm giúp · cây chín sớm 15 phút`, '🤝');
    for (const entry of applied) if (entry.kind === 'fire-out') hud.showToast(`${entry.name} đã dập lửa giúp trang trại!`, '🧯');
    // several Cúp Đợt rewards at once read as one toast: «Cúp Đợt 3, 4, 5 · +900 Sickle · +60 XP · +3 Cát»
    for (const entry of cups) if (Number.isSafeInteger(entry.xp) && entry.xp! > 0) sim.addXp(entry.xp!);
    if (cups.length) {
      // the same checks as the wallet (applyFarmInbox) and sim.addXp above: only what was credited is counted
      const ok = (v: number | undefined) => Number.isSafeInteger(v) && v! > 0;
      const sum = (key: 'sickle' | 'xp' | 'sand') => cups
        .reduce((total, entry) => total + (ok(entry[key]) && (key !== 'sand' || ok(entry.sickle)) ? entry[key]! : 0), 0);
      // only real tier numbers, and no «+0 …» part
      const tiers = [...new Set(cups.map((entry) => entry.tier).filter((t): t is number => ok(t)))].sort((a, b) => a - b).join(', ');
      const parts = [['sickle', 'Sickle'], ['xp', 'XP'], ['sand', 'Cát']] as const;
      const gains = parts.map(([key, unit]) => [sum(key), unit] as const).filter(([n]) => n > 0).map(([n, unit]) => `+${n.toLocaleString('vi-VN')} ${unit}`);
      hud.showToast([tiers ? `Cúp Đợt ${tiers}` : 'Cúp Đợt', ...gains].join(' · '), '🏆');
    }
    sim.saveToStorage();
    if (bought || cups.length || standSales.length) void flushFarmSave(); // a bought pack, cup reward or stand sale reaches the server at once
    hud.refreshAll();
  });

  // URL preview parameters for instant visual verification or sharing
  // HPVN: preview/debug switches (?preview=100, ?time=, …) only in the Vite dev server;
  // the renderer comes only from the saved setting (rendererMode, default webgl2, Canvas2D fallback)
  const params = new URLSearchParams(import.meta.env.DEV ? window.location.search : '');

  let gpuWorldRenderer: import('./render/webgl2/webgl2WorldRenderer').WebGL2WorldRenderer | null = null;
  let directGpuCanvas: HTMLCanvasElement | null = null;
  let directGpuSettings: import('./render/core/renderDevice').GpuMockSettings | null = null;
  let gpuInitFailed = false;
  const gpuPointerClient = { x: 0, y: 0, moved: false };
  const ptrWorldScratch = { wx: 0, wy: 0, active: false };
  const bindGpuPointerTracking = () => {
    window.addEventListener(
      'pointermove',
      (ev) => {
        gpuPointerClient.x = ev.clientX;
        gpuPointerClient.y = ev.clientY;
        gpuPointerClient.moved = true;
      },
      { passive: true }
    );
  };

  try {
    const { WebGL2WorldRenderer } = await import('./render/webgl2/webgl2WorldRenderer');
    const gpuCanvas = document.createElement('canvas');
    gpuCanvas.id = 'gpuWorldCanvas';
    gpuCanvas.setAttribute('aria-hidden', 'true');
    gpuCanvas.style.cssText =
      'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:0;display:block;';
    canvas.insertAdjacentElement('beforebegin', gpuCanvas);
    gpuWorldRenderer = new WebGL2WorldRenderer(gpuCanvas, sprites);
    directGpuCanvas = gpuCanvas;
    directGpuSettings = {
      mode: (sim.state.settings.rendererMode ?? 'webgl2') === 'canvas' ? 'canvas' : 'webgl2',
      splitRatio: 0.5,
      qualityTier: isTouchOrIOSDevice() ? 'medium' : 'high',
      lumosWandEnabled: false,
      windStrength: 1.15,
      bloomIntensity: 0.72,
      normalStrength: 1.12,
    };
    if (directGpuSettings.mode === 'webgl2') {
      canvas.style.position = 'relative';
      canvas.style.zIndex = '1';
      canvas.style.background = 'transparent';
    } else {
      gpuCanvas.style.display = 'none';
    }
    bindGpuPointerTracking();
    window.addEventListener('hangsoc:toon-changed', () => {
      renderer.groundCacheKey = '';
      gpuWorldRenderer?.invalidateSpriteAtlas();
    });
  } catch (err) {
    console.warn('[WebGL2 Engine] Thiết bị không hỗ trợ WebGL2, tự động fallback về Canvas2D:', err);
    directGpuCanvas?.remove();
    directGpuCanvas = null;
    gpuWorldRenderer = null;
    directGpuSettings = null;
    gpuInitFailed = true;
    sim.state.settings.rendererMode = 'canvas';
  }
  const hasExplicitCamParam = Boolean(
    params.get('preview') === '100' ||
      params.get('visit') ||
      params.get('tour') ||
      params.get('zoom') ||
      params.get('cx') ||
      params.get('cy') ||
      params.get('ridecam') === '1'
  );
  let introGlide: {
    startMs: number;
    durationMs: number;
    fromX: number;
    fromY: number;
    fromZoom: number;
    toX: number;
    toY: number;
    toZoom: number;
  } | null = null;
  const camDirector = new CameraDirector();
  hud.onCameraJump = () => {
    introGlide = null;
    camDirector.cancel();
  };
  hud.onFocusGridSmooth = (gx, gy, targetZoom) => {
    introGlide = null;
    hud.rideCamUid = null;
    camDirector.panToGrid(cam, gx, gy, {
      targetZoom,
      durationMs: 480,
      reducedMotion: renderer.reducedMotion,
    });
  };
  if (!hasExplicitCamParam && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    const targetX = cam.x;
    const targetY = cam.y;
    const targetZoom = cam.zoom;
    centerCameraOnGrid(cam, 17.5, 24.0);
    cam.zoom = 0.76;
    introGlide = {
      startMs: performance.now(),
      durationMs: 1450,
      fromX: cam.x,
      fromY: cam.y,
      fromZoom: cam.zoom,
      toX: targetX,
      toY: targetY,
      toZoom: targetZoom,
    };
  }
  const isDevHostAllowed =
    Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) ||
    import.meta.env.DEV;

  if (params.get('preview') === '100' && isDevHostAllowed) {
    sim.toggleHeadmasterPreview(100);
    if (!params.get('tutorial') && sim.isTutorialActive()) {
      sim.skipTutorial();
    }
    const z = Number(params.get('zoom') || 0.62);
    cam.zoom = Number.isFinite(z) && z >= 0.32 && z <= 2.15 ? z : 0.62;
    const rawCx = Number(params.get('cx'));
    const rawCy = Number(params.get('cy'));
    const cx = Number.isFinite(rawCx) && params.get('cx') ? rawCx : 24.5;
    const cy = Number.isFinite(rawCy) && params.get('cy') ? rawCy : 23.0;
    centerCameraOnGrid(cam, cx, cy);
  }
  const tutorialParam = params.get('tutorial');
  if (tutorialParam === '1' || tutorialParam === 'reset') {
    sim.restartTutorial();
    hud.tutorialMinimized = false;
  } else if (tutorialParam === '0' || tutorialParam === 'off') {
    if (sim.isTutorialActive()) {
      sim.skipTutorial();
    }
  }
  const tstepParam = params.get('tstep');
  if (tstepParam !== null && isDevHostAllowed) {
    const idx = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, Number(tstepParam) || 0));
    const tut = sim.ensureTutorialState();
    tut.active = true;
    delete tut.completedAt;
    tut.skipped = false;
    tut.stepIndex = idx;
    tut.stepId = TUTORIAL_STEPS[idx].id;
    tut.pastureHarvestedInStep3 = false;
    tut.minimized = false;
    hud.tutorialMinimized = false;
  }
  const rotParam = Number(params.get('rot') || 0);
  if (rotParam >= 1 && rotParam <= 3) {
    for (let i = 0; i < rotParam; i++) {
      rotateCamera90(cam, 1);
    }
  }
  if (params.get('cutaway') === '1') {
    sim.state.settings.cutawayMode = true;
  }
  const timeParam = params.get('time');
  if (timeParam === 'night' || timeParam === 'day' || timeParam === 'dusk' || timeParam === 'dawn') {
    sim.state.settings.timeOverride = timeParam;
  }
  const weatherParam = params.get('weather');
  if (
    weatherParam === 'auto' ||
    weatherParam === 'clear' ||
    weatherParam === 'cloudy' ||
    weatherParam === 'rain' ||
    weatherParam === 'storm' ||
    weatherParam === 'snow' ||
    weatherParam === 'fog' ||
    weatherParam === 'fireflies'
  ) {
    sim.state.settings.weatherOverride = weatherParam as WeatherOverride;
  }
  if (params.get('zoom') && params.get('preview') !== '100') {
    const z = Number(params.get('zoom'));
    if (Number.isFinite(z) && z >= 0.32 && z <= 2.15) cam.zoom = z;
  }
  if ((params.get('cx') || params.get('cy')) && params.get('preview') !== '100') {
    const rawCx = Number(params.get('cx'));
    const rawCy = Number(params.get('cy'));
    const cx = Number.isFinite(rawCx) && params.get('cx') ? rawCx : 18.0;
    const cy = Number.isFinite(rawCy) && params.get('cy') ? rawCy : 24.5;
    centerCameraOnGrid(cam, cx, cy);
  }
  const hm = params.get('heatmap') as HeatmapMode | null;
  if (hm) {
    sim.heatmapMode = hm;
  }
  if (params.get('fireworks') === '1') {
    sim.launchFireworksShow(12);
  }
  if (params.get('ridecam') === '1') {
    const coasterB = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isCustomCoasterStation);
    if (coasterB) {
      hud.rideCamUid = coasterB.uid;
    }
  }
  const dlgParam = params.get('dialog');
  if (dlgParam === 'album') {
    const aTab = params.get('tab');
    if (aTab === 'profile' || aTab === 'cup' || aTab === 'leaderboard') {
      hud.activeAlbumTab = aTab;
    }
    const pSub = params.get('psub');
    if (pSub === 'login7' || pSub === 'achievements' || pSub === 'friendship') {
      hud.activeProfileSubTab = pSub;
    }
    (document.getElementById('btnOpenAlbum') as HTMLButtonElement | null)?.click();
  } else if (dlgParam === 'finance') {
    (document.getElementById('btnOpenFinance') as HTMLButtonElement | null)?.click();
  } else if (dlgParam === 'orders' || dlgParam === 'quests' || dlgParam === 'yule') {
    if (dlgParam === 'yule') {
      hud.activeQuestTab = 'quests';
      hud.renderQuestDialog();
      (document.getElementById('questDialog') as HTMLDialogElement | null)?.showModal();
    } else {
      (document.getElementById('btnOpenQuests') as HTMLButtonElement | null)?.click();
    }
  } else if (dlgParam === 'barn') {
    hud.openWorkshopDialog('barn');
  } else if (dlgParam === 'market') {
    hud.openWorkshopDialog('market');
  } else if (dlgParam === 'seeds') {
    const sFilter = params.get('sfilter');
    if (sFilter === 'flowers' || sFilter === 'crops' || sFilter === 'all') {
      hud.seedFilterMode = sFilter;
    }
    hud.openSeedTray();
  } else if (dlgParam === 'pasture') {
    hud.openPastureTray();
  } else if (dlgParam === 'seedquiz') {
    const cropParam = (params.get('crop') as FarmCropId | null) ?? undefined;
    const langParam = (params.get('lang') as QuizLanguageId | null) ?? undefined;
    const tierParam = (params.get('tier') as QuizProficiencyTier | null) ?? undefined;
    const qfmtParam = (params.get('qformat') as 'all' | QuizFormatKind | null) ?? undefined;
    const sqTabParam = params.get('sqtab');
    const subViewParam =
      sqTabParam === 'codex' || sqTabParam === 'practice' ? sqTabParam : undefined;
    hud.openSeedQuizDialog(cropParam, null, langParam, tierParam, qfmtParam, subViewParam);
  } else if (dlgParam === 'bakery') {
    const bakeryB = sim.state.buildings.find((b) => b.itemId === 'molly_apple_bakery');
    if (bakeryB) {
      hud.inspectSelection = { kind: 'building', uid: bakeryB.uid };
    }
    hud.openWorkshopDialog('brew');
  } else if (dlgParam === 'workshop') {
    const tabParam =
      (params.get('tab') as 'barn' | 'market' | 'brew' | 'cargo' | 'synergy' | null) ?? 'barn';
    hud.openWorkshopDialog(tabParam);
  } else if (dlgParam === 'suitcase') {
    const tabParam = (params.get('tab') as 'care' | 'morph' | 'expedition' | null) ?? 'care';
    hud.openSuitcaseDialog(tabParam);
  } else if (dlgParam === 'match3') {
    const m3LvParam = Number(params.get('m3level') || 0);
    const maxAllowedM3 = isDevHostAllowed
      ? MAX_MATCH3_STAGE
      : Math.min(MAX_MATCH3_STAGE, (sim.state.match3.maxClearedLevel ?? 0) + 1);
    const safeM3Lv =
      Number.isFinite(m3LvParam) && m3LvParam >= 1 ? Math.min(maxAllowedM3, Math.floor(m3LvParam)) : undefined;
    const allowDevJump = Boolean(
      isDevHostAllowed && safeM3Lv && safeM3Lv > (sim.state.match3.maxClearedLevel ?? 0) + 1
    );
    hud.openMatch3Dialog(safeM3Lv, allowDevJump);
  } else if (
    dlgParam === 'puzzle' ||
    dlgParam === 'caro' ||
    dlgParam === 'mines' ||
    dlgParam === 'minesweeper' ||
    dlgParam === 'domin' ||
    dlgParam === 'sudoku' ||
    dlgParam === 'chess' ||
    dlgParam === 'fishing' ||
    dlgParam === 'fish' ||
    dlgParam === 'banca' ||
    dlgParam === 'blocks' ||
    dlgParam === 'jigsaw' ||
    dlgParam === 'pikachu' ||
    dlgParam === 'onet'
  ) {
    const rawPmode = dlgParam === 'puzzle' ? params.get('pmode') : dlgParam;
    const pmode =
      rawPmode === 'pikachu' || rawPmode === 'onet'
        ? 'blocks'
        : rawPmode === 'mines' || rawPmode === 'minesweeper' || rawPmode === 'domin'
          ? 'caro'
          : rawPmode === 'fishing' || rawPmode === 'fish' || rawPmode === 'banca'
            ? 'chess'
            : rawPmode;
    const validMode: PuzzleArcadeMode | undefined =
      pmode === 'caro' ||
      pmode === 'sudoku' ||
      pmode === 'chess' ||
      pmode === 'blocks' ||
      pmode === 'jigsaw'
        ? pmode
        : undefined;
    const pStageParam = Number(params.get('pstage') || 0);
    const clearedForMode = validMode ? sim.getDisciplineStageInfo(validMode).clearedStages : 0;
    const maxAllowedPa = isDevHostAllowed
      ? MAX_MINIGAME_STAGE
      : Math.min(MAX_MINIGAME_STAGE, clearedForMode + 1);
    const safePStage =
      validMode && Number.isFinite(pStageParam) && pStageParam >= 1
        ? Math.min(maxAllowedPa, Math.floor(pStageParam))
        : undefined;
    const allowPaDevJump = Boolean(
      isDevHostAllowed && validMode && safePStage && safePStage > clearedForMode + 1
    );
    hud.openPuzzleArcadeDialog(validMode, safePStage, allowPaDevJump);
  } else if (dlgParam === 'neighbors' || dlgParam === 'friends') {
    hud.openNeighborDialog();
  } else if (dlgParam === 'feast') {
    hud.openHarvestFeastDialog();
  } else if (dlgParam === 'cupinfo') {
    hud.openHouseCupIntroDialog();
  } else if (dlgParam === 'leaderboard') {
    const rawGame = params.get('lbgame');
    const mappedGame =
      rawGame === 'pikachu' || rawGame === 'onet'
        ? 'blocks'
        : rawGame === '2048' || rawGame === '9x9'
          ? 'sudoku'
          : rawGame === 'ghep-tranh'
            ? 'jigsaw'
            : rawGame === 'mines' || rawGame === 'domin' || rawGame === 'minesweeper'
              ? 'caro'
              : rawGame === 'fish' || rawGame === 'fishing' || rawGame === 'banca'
                ? 'chess'
                : rawGame;
    const validGame: LeaderboardGameId | undefined =
      mappedGame === 'match3' ||
      mappedGame === 'caro' ||
      mappedGame === 'sudoku' ||
      mappedGame === 'chess' ||
      mappedGame === 'blocks' ||
      mappedGame === 'jigsaw' ||
      mappedGame === 'seedquiz'
        ? mappedGame
        : undefined;
    const rawScope = params.get('lbscope');
    const validScope: LeaderboardScope | undefined =
      rawScope === 'valley' || rawScope === 'overall' || rawScope === 'friends' || rawScope === 'personal'
        ? rawScope
        : rawScope === 'total' || rawScope === 'all_time'
          ? 'overall'
          : undefined;
    hud.openLeaderboardDialog(validGame, validScope);
  } else if (!params.get('tour') && !params.get('visit') && !sim.isHeadmasterPreview) {
    try {
      // HPVN: the marker rides in the farm save
      const parsedResume = sim.state.activeMinigameResume;
      if (parsedResume) {
        const ageMs = Date.now() - Number(parsedResume.savedAt || 0);
        const pa = sim.state.puzzleArcade;
        if (ageMs >= 0 && ageMs <= 12 * 3600 * 1000) {
          if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'sudoku' &&
            pa.sudokuSession?.stage === pa.sudokuStage &&
            pa.sudokuSession.status !== 'lost'
          ) {
            hud.openPuzzleArcadeDialog('sudoku');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'caro' &&
            pa.minesSession?.stage === pa.caroStage &&
            pa.minesSession.status !== 'lost'
          ) {
            hud.openPuzzleArcadeDialog('caro');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'chess' &&
            pa.fishingSession?.stage === pa.chessStage &&
            pa.fishingSession.status !== 'lost'
          ) {
            hud.openPuzzleArcadeDialog('chess');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'blocks' &&
            pa.onetSession?.stage === pa.blockStage &&
            pa.onetSession.status !== 'lost'
          ) {
            hud.openPuzzleArcadeDialog('blocks');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'jigsaw' &&
            pa.jigsawSession?.stage === pa.jigsawStage &&
            pa.jigsawSession.status !== 'lost'
          ) {
            hud.openPuzzleArcadeDialog('jigsaw');
          } else if (
            parsedResume.dialog === 'match3' &&
            sim.state.match3.activeSession?.levelId === sim.state.match3.currentLevel
          ) {
            hud.openMatch3Dialog();
          } else {
            delete sim.state.activeMinigameResume;
            sim.saveToStorage();
          }
        } else {
          delete sim.state.activeMinigameResume;
          sim.saveToStorage();
        }
      }
    } catch {
      // Ignore a malformed marker
    }
  }
  const LEGACY_SHOWCASE_TOUR_MAP: Record<string, string> = {
    hagrid_valley: 'tour_hagrid',
    luna_valley: 'tour_luna',
    neville_valley: 'tour_sprout',
    hermione_valley: 'tour_molly',
    twins_valley: 'tour_twins',
  };
  const routeGardenTourOrVisit = (rawTarget: string): void => {
    const trimmed = String(rawTarget || '').trim();
    if (!trimmed) {
      hud.exitVisitFromHud();
      return;
    }
    const mappedTour =
      LEGACY_SHOWCASE_TOUR_MAP[trimmed] || (trimmed.startsWith('tour_') ? trimmed : '');
    if (mappedTour) {
      hud.enterHonorTourFromHud(mappedTour);
    } else if (
      trimmed.startsWith('player_') ||
      sim.ensureNeighborSocial().neighbors.some((n) => n.id === trimmed)
    ) {
      hud.enterVisitFromHud(trimmed);
    } else {
      hud.enterFlooMemberVisitFromHud(trimmed);
    }
  };

  const tourOrVisitParam = params.get('tour') || params.get('visit');
  if (tourOrVisitParam) {
    routeGardenTourOrVisit(tourOrVisitParam);
  }

  // Strip one-shot action/modal query params after consuming them so pressing F5 or returning
  // from a visit does not re-open stale dialogs or re-trigger tutorial resets.
  const TRANSIENT_BOOT_PARAMS = [
    'dialog',
    'm3level',
    'pmode',
    'pstage',
    'lbgame',
    'lbscope',
    'sqtab',
    'crop',
    'lang',
    'tier',
    'qformat',
    'sfilter',
    'tab',
    'fireworks',
    'tutorial',
    'tstep',
  ];
  if (TRANSIENT_BOOT_PARAMS.some((k) => params.has(k))) {
    const cleanedParams = new URLSearchParams(params);
    for (const k of TRANSIENT_BOOT_PARAMS) {
      cleanedParams.delete(k);
    }
    const nextQuery = cleanedParams.toString();
    const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }
  if (sim.isTutorialActive() && !hasExplicitCamParam) {
    hud.panCameraToTutorialTarget();
  }
  hud.refreshAll();

  window.addEventListener('hpvn:toast', (ev) => {
    const detail = (ev as CustomEvent<{ text?: string }>).detail;
    if (detail?.text) {
      hud.showToast(String(detail.text), '🔥');
    }
  });
  window.addEventListener('hpvn:tour-garden', (ev) => {
    const detail = (ev as CustomEvent<{ tourId?: string | null }>).detail;
    routeGardenTourOrVisit(String(detail?.tourId ?? ''));
  });
  window.addEventListener('hpvn:atmosphere', (ev) => {
    if (sim.isVisitingNeighbor) return;
    const rawMode = (ev as CustomEvent<{ mode?: string }>).detail?.mode;
    const mode = rawMode === 'auto' ? 'realtime' : rawMode;
    if (
      mode === 'realtime' ||
      mode === 'dawn' ||
      mode === 'day' ||
      mode === 'dusk' ||
      mode === 'night'
    ) {
      sim.state.settings.timeOverride = mode as TimeOverride;
      sim.saveToStorage();
      hud.refreshAll();
    }
  });
  window.addEventListener('hpvn:weather', (ev) => {
    if (sim.isVisitingNeighbor) return;
    const mode = (ev as CustomEvent<{ mode?: string }>).detail?.mode;
    if (
      mode === 'auto' ||
      mode === 'clear' ||
      mode === 'cloudy' ||
      mode === 'rain' ||
      mode === 'storm' ||
      mode === 'snow' ||
      mode === 'fog' ||
      mode === 'fireflies'
    ) {
      sim.state.settings.weatherOverride = mode as WeatherOverride;
      sim.saveToStorage();
      hud.refreshAll();
    }
  });

  let cachedFullscreenModalOpen = false;
  let cachedAnyDialogOpen = false;
  let pendingUiRefreshAfterFullscreen = false;

  sim.onTutorialStepChanged = () => {
    hud.tutorialMinimized = Boolean(sim.state.tutorial?.minimized);
    hud.panCameraToTutorialTarget();
  };
  sim.onUiChange = () => {
    if (cachedFullscreenModalOpen) {
      pendingUiRefreshAfterFullscreen = true;
      return;
    }
    hud.refreshAll();
    accessibility.refresh();
  };
  sim.onToast = (msg, icon) => {
    hud.showToast(msg, icon);
    if (msg.includes('Đạt Cấp') || msg.includes('lên cấp') || msg.includes('Lên Cấp')) {
      haptic('levelup');
    } else {
      haptic('light');
    }
    announce(msg);
  };
  sim.onBuildingTactile = (uid) => renderer.triggerSquash(uid);
  sim.onBuildingCompleted = (uid) => {
    renderer.triggerCompletionPop(uid);
    renderer.triggerSquash(uid);
  };
  sim.onRibbonUnveiled = (info) => {
    if (!document.querySelector('dialog[open]')) {
      introGlide = null;
      hud.rideCamUid = null;
      camDirector.panToGrid(cam, info.gx, info.gy, {
        targetZoom: Math.max(cam.zoom, 0.96),
        durationMs: 460,
        reducedMotion: renderer.reducedMotion,
      });
    }
    const pt = gridToScreen(info.gx, info.gy, cam, canvas.clientWidth, canvas.clientHeight, 36);
    renderer.triggerRibbonUnveilPop(info.uid, pt.sx, pt.sy);
    hud.showRibbonUnveilBanner(info);
    haptic('levelup');
  };
  sim.onZoneUnlocked = (_zoneId, cx, cy) => {
    if (!document.querySelector('dialog[open]')) {
      introGlide = null;
      hud.rideCamUid = null;
      camDirector.panToGrid(cam, cx, cy, {
        targetZoom: Math.min(cam.zoom, 0.86),
        durationMs: 620,
        reducedMotion: renderer.reducedMotion,
      });
    }
  };
  const flyingCollectibles = new CrossLayerFlyingCollectibles(hud.root, {
    onArrival: (_kind, idx) => {
      audio.playFlyTick(idx);
      if (idx === 0) haptic('light');
    },
  });

  sim.onRewardFly = (kind, amount, gx, gy) => {
    if (typeof gx === 'number' && typeof gy === 'number') {
      const pt = gridToScreen(gx, gy, cam, canvas.clientWidth, canvas.clientHeight, 32);
      const launched = flyingCollectibles.spawnBurstToHud(kind, amount, pt.sx, pt.sy);
      if (!launched) {
        hud.spawnFlyReward(kind, amount, pt.sx, pt.sy);
      }
    } else {
      const launched = flyingCollectibles.spawnBurstToHud(
        kind,
        amount,
        canvas.clientWidth * 0.5,
        canvas.clientHeight * 0.52
      );
      if (!launched) {
        hud.spawnFlyReward(kind, amount);
      }
    }
  };
  sim.onLevelUp = (lv) => {
    haptic('levelup');
    const info = getLevelInfo(lv);
    const unlockedNames = info.unlockedItemIds
      .map((id) => getCatalogItem(id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(', ');
    const unlockTag = unlockedNames
      ? ` · Mở: ${unlockedNames}`
      : info.milestoneNote
        ? ` · ${info.milestoneNote}`
        : '';
    hud.showToast(`Cấp Giải Đố ${lv} · +${info.rewardSickle} Sickle${unlockTag}`, '🌟');
    hud.refreshAll();
  };

  const offlineReport = sim.processOfflineProgress();
  if (offlineReport) {
    hud.showOfflineModal(offlineReport);
  }

  if (
    !dlgParam &&
    !tourOrVisitParam &&
    !params.get('tutorial') &&
    !sim.isVisitingNeighbor &&
    !sim.isHeadmasterPreview &&
    !sim.state.activeMinigameResume &&
    !hud.hasShownHouseCupIntro
  ) {
    const openStartupDlg = app.querySelector('dialog[open]') as HTMLDialogElement | null;
    if (!openStartupDlg) {
      hud.openHouseCupIntroDialog();
    } else {
      openStartupDlg.addEventListener(
        'close',
        () => {
          if (!hud.hasShownHouseCupIntro && !sim.isVisitingNeighbor && !app.querySelector('dialog[open]')) {
            hud.openHouseCupIntroDialog();
          }
        },
        { once: true }
      );
    }
  }

  const notifyHpvnVisitHelpIfRealPlayer = (buildingUid: string): void => {
    const visitingNb = sim.getActiveVisitingNeighbor();
    if (!visitingNb?.remoteUserId) return;
    const latestMark = visitingNb.helpedMarksToday[visitingNb.helpedMarksToday.length - 1];
    window.dispatchEvent(
      new CustomEvent('hpvn:visit-help', {
        detail: {
          hostUid: visitingNb.remoteUserId,
          buildingUid,
          kind: latestMark?.kind || 'water_crop',
          noteText: latestMark?.noteText || 'Chúc vườn phép thuật bội thu!',
          helperName: sim.state.parkName || 'Hàng Xóm Hang Sóc',
          helperEmoji: '🧙‍♂️',
        },
      })
    );
  };

  let hoverTile: { gx: number; gy: number } | null = null;
  let isPointerDown = false;
  let isDraggingCam = false;
  let isPaintingTiles = false;
  let isErasingBrush = false;
  let canStartEraseBrush = false;
  let eraseStartGx = 0;
  let eraseStartGy = 0;
  let pressedOnPendingGhost = false;
  let isDraggingTouchGhost = false;
  let longPressJustActivated = false;
  let isSowingSeeds = false;
  let isStockingPastures = false;
  let lastSeedWarnAt = 0;
  let lastPastureWarnAt = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let camStartX = 0;
  let camStartY = 0;

  const LONG_PRESS_MOVE_MS = 430;
  let longPressMove: {
    uid: string;
    startMs: number;
    sx: number;
    sy: number;
    pointerType: string;
    timer: number;
  } | null = null;

  const cancelLongPressMove = () => {
    if (longPressMove) {
      window.clearTimeout(longPressMove.timer);
      longPressMove = null;
    }
  };

  const formatTouchConfirmLabelForItem = (item: CatalogItem): string => {
    const stashed = worldGetStashedDecorCount(sim, item);
    if (stashed > 0) return `${item.name} • Kho (0 Sickle)`;
    if (sim.state.sandboxMode) return `${item.name} • 0 Sickle`;
    const stars = sim.getEffectiveItemStarCost(item);
    if (stars > 0) return `${item.name} • ${stars} Sao`;
    return `${item.name} • ${item.cost.toLocaleString('vi-VN')} Sickle`;
  };

  const canStillAffordAnotherPlacement = (item: CatalogItem): boolean => {
    if (sim.state.sandboxMode) return true;
    if (worldGetStashedDecorCount(sim, item) > 0) return true;
    const stars = sim.getEffectiveItemStarCost(item);
    if (stars > 0) return (sim.state.match3?.stars ?? 0) >= stars;
    return sim.state.galleons >= item.cost;
  };

  const trySowPlotAt = (gx: number, gy: number, sx: number, sy: number): boolean => {
    const seedCropId = hud.activeSeedCropId;
    if (!seedCropId) return false;
    const nowMs = Date.now();
    const isEligiblePlot = (candUid: string | null | undefined) => {
      if (!candUid) return null;
      const cand = sim.state.buildings.find((x) => x.uid === candUid);
      if (!cand || cand.cropId || nowMs < cand.constructEndsAt) return null;
      return getCatalogItem(cand.itemId)?.isFarmlandPlot ? cand : null;
    };
    let b = isEligiblePlot(sim.grid[gy]?.[gx]?.buildingUid);
    if (!b) {
      let bestDist = Infinity;
      for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
        const hs = renderer.hotspots[i];
        if (hs.kind !== 'building') continue;
        const dist = Math.hypot(sx - hs.sx, sy - hs.sy);
        if (dist <= Math.max(hs.radius * 1.35, 36) && dist < bestDist) {
          const cand = isEligiblePlot(hs.id);
          if (cand) {
            bestDist = dist;
            b = cand;
          }
        }
      }
    }
    if (!b) return false;

    const res = sim.plantCropOnPlot(b.uid, seedCropId);
    if (!res.ok) {
      if (res.needSeedAcquire) {
        isSowingSeeds = false;
        isPointerDown = false;
        hud.activeSeedCropId = null;
        hud.seedTrayOpen = false;
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openSeedQuizDialog(seedCropId, b.uid);
        return false;
      }
      const nowMs = Date.now();
      if (nowMs - lastSeedWarnAt > 1200) {
        lastSeedWarnAt = nowMs;
        hud.showToast(res.msg, '🪙');
      }
      return false;
    }
    if (!sim.state.sandboxMode && sim.getSeedCount(seedCropId) <= 0) {
      hud.activeSeedCropId = null;
    }
    if (hud.seedTrayOpen) {
      hud.seedTrayOpen = false;
      hud.renderSeedTray();
      hud.refreshFloatingBanner();
    } else if (!hud.activeSeedCropId) {
      hud.renderSeedTray();
      hud.refreshFloatingBanner();
    }
    return true;
  };

  const tryStockPastureAt = (gx: number, gy: number, sx: number, sy: number): boolean => {
    const animalId = hud.activePastureAnimalId;
    if (!animalId) return false;
    const nowMs = Date.now();
    const isEligiblePasture = (candUid: string | null | undefined) => {
      if (!candUid) return null;
      const cand = sim.state.buildings.find((x) => x.uid === candUid);
      if (!cand || cand.pastureAnimalId || nowMs < cand.constructEndsAt) return null;
      return getCatalogItem(cand.itemId)?.isAnimalPasturePlot ? cand : null;
    };
    let b = isEligiblePasture(sim.grid[gy]?.[gx]?.buildingUid);
    if (!b) {
      let bestDist = Infinity;
      for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
        const hs = renderer.hotspots[i];
        if (hs.kind !== 'building') continue;
        const dist = Math.hypot(sx - hs.sx, sy - hs.sy);
        if (dist <= Math.max(hs.radius * 1.35, 36) && dist < bestDist) {
          const cand = isEligiblePasture(hs.id);
          if (cand) {
            bestDist = dist;
            b = cand;
          }
        }
      }
    }
    if (!b) return false;

    const res = sim.stockAnimalOnPasture(b.uid, animalId);
    if (!res.ok) {
      const nowMs = Date.now();
      if (nowMs - lastPastureWarnAt > 1200) {
        lastPastureWarnAt = nowMs;
        hud.showToast(res.msg, '🪙');
      }
      return false;
    }
    if (hud.pastureTrayOpen) {
      hud.pastureTrayOpen = false;
      hud.renderPastureTray();
      hud.refreshFloatingBanner();
    }
    return true;
  };

  type CareSweepMode = 'harvest_crop' | 'water_crop' | 'harvest_pasture' | 'feed_pasture';
  let pendingCareSweep: {
    mode: CareSweepMode;
    initialUid: string;
    initialSx: number;
    initialSy: number;
    active: boolean;
    sweptUids: Set<string>;
  } | null = null;

  const detectCareablePlotAt = (
    gx: number,
    gy: number,
    sx: number,
    sy: number,
    modeFilter?: CareSweepMode
  ): { uid: string; mode: CareSweepMode } | null => {
    if (sim.isVisitingNeighbor) return null;
    const nowMs = Date.now();
    const candidateUids: string[] = [];
    const tileUid = sim.grid[gy]?.[gx]?.buildingUid;
    if (tileUid) candidateUids.push(tileUid);
    for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
      const hs = renderer.hotspots[i];
      if (
        (hs.kind === 'water_crop' || hs.kind === 'feed_pasture' || hs.kind === 'building') &&
        Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius
      ) {
        if (!candidateUids.includes(hs.id)) {
          candidateUids.push(hs.id);
        }
      }
    }
    for (const uid of candidateUids) {
      const b = sim.state.buildings.find((x) => x.uid === uid);
      if (!b || nowMs < b.constructEndsAt || b.awaitingUnveil) continue;
      const it = getCatalogItem(b.itemId);
      if (!it) continue;
      if (it.isFarmlandPlot && b.cropId && b.cropReadyAt) {
        const mode: CareSweepMode | null =
          nowMs >= b.cropReadyAt
            ? 'harvest_crop'
            : !b.cropWateredBoost
              ? 'water_crop'
              : null;
        if (mode && (!modeFilter || mode === modeFilter)) {
          return { uid, mode };
        }
      }
      if (it.isAnimalPasturePlot && b.pastureAnimalId && b.pastureReadyAt) {
        const mode: CareSweepMode | null =
          nowMs >= b.pastureReadyAt
            ? 'harvest_pasture'
            : !b.pastureFedBoost
              ? 'feed_pasture'
              : null;
        if (mode && (!modeFilter || mode === modeFilter)) {
          return { uid, mode };
        }
      }
    }
    return null;
  };

  const applyCareSweepPlot = (uid: string, mode: CareSweepMode, sx: number, sy: number): boolean => {
    let ok = false;
    if (mode === 'harvest_crop') {
      ok = sim.harvestCropPlot(uid).ok;
    } else if (mode === 'water_crop') {
      ok = sim.waterCropPlot(uid).ok;
    } else if (mode === 'harvest_pasture') {
      ok = sim.harvestAnimalPasture(uid).ok;
    } else if (mode === 'feed_pasture') {
      ok = sim.feedAnimalPasture(uid).ok;
    }
    if (ok) {
      renderer.triggerSquash(uid);
      renderer.notifyJuice('harvest', sx, sy);
      haptic('light');
    }
    return ok;
  };

  const finishCareSweep = (): boolean => {
    const sweep = pendingCareSweep;
    pendingCareSweep = null;
    if (!sweep || !sweep.active) {
      sim.batchOperationActive = false;
      return false;
    }
    sim.batchOperationActive = false;
    if (sweep.sweptUids.size > 0) {
      sim.checkAndToastAchievements();
      sim.saveToStorage();
      sim.onUiChange?.();
      hud.inspectSelection = null;
      hud.refreshAll();
    }
    return sweep.sweptUids.size > 0;
  };

  const finishBuildStroke = () => {
    sim.commitBuildStroke();
  };

  const runSingleBuildStroke = <T>(fn: () => T): T => {
    sim.beginBuildStroke();
    try {
      return fn();
    } finally {
      sim.commitBuildStroke();
    }
  };

  // V3 Multi-Touch Pinch-to-Zoom tracking + deferred touch brush guard (P1-4)
  const activePointers = new Map<number, { x: number; y: number }>();
  let prevPinchDist = 0;
  let wasPinching = false;
  let pendingTouchPaint: {
    timer: number;
    item: CatalogItem;
    gx: number;
    gy: number;
    rot: 0 | 1 | 2 | 3;
  } | null = null;

  const cancelPendingTouchPaint = () => {
    if (pendingTouchPaint) {
      window.clearTimeout(pendingTouchPaint.timer);
      pendingTouchPaint = null;
    }
  };

  const SNAP_NEIGHBOR_OFFSETS: ReadonlyArray<[number, number]> = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  const resolveBuildingPlacementTile = (
    item: CatalogItem,
    cursorGx: number,
    cursorGy: number,
    rot: 0 | 1 | 2 | 3,
    ignoreBuildingUid?: string
  ): { gx: number; gy: number } => {
    if (isDragPaintableItem(item)) {
      return { gx: cursorGx, gy: cursorGy };
    }
    const { bw, bh } = sim.getBuildingFootprint(item, rot);
    const baseGx = Math.max(0, Math.min(GRID_SIZE - bw, cursorGx - Math.floor((bw - 1) / 2)));
    const baseGy = Math.max(0, Math.min(GRID_SIZE - bh, cursorGy - Math.floor((bh - 1) / 2)));
    if (sim.canPlaceItem(item, baseGx, baseGy, rot, ignoreBuildingUid).ok) {
      return { gx: baseGx, gy: baseGy };
    }
    for (const [dx, dy] of SNAP_NEIGHBOR_OFFSETS) {
      const nx = baseGx + dx;
      const ny = baseGy + dy;
      if (nx < 0 || ny < 0 || nx + bw > GRID_SIZE || ny + bh > GRID_SIZE) continue;
      if (sim.canPlaceItem(item, nx, ny, rot, ignoreBuildingUid).ok) {
        return { gx: nx, gy: ny };
      }
    }
    return { gx: baseGx, gy: baseGy };
  };

  const findBestPreviewSpotNearCamera = (
    item: CatalogItem,
    rot: 0 | 1 | 2 | 3
  ): { gx: number; gy: number } | null => {
    const rect = canvas.getBoundingClientRect();
    const viewW = rect.width || window.innerWidth || 1280;
    const viewH = rect.height || window.innerHeight || 720;
    const focus = screenToGrid(viewW * 0.5, viewH * 0.5, cam, viewW, viewH, sim.grid);
    const { bw, bh } = sim.getBuildingFootprint(item, rot);
    const centerGx = Math.max(0, Math.min(GRID_SIZE - bw, focus.gx - Math.floor((bw - 1) / 2)));
    const centerGy = Math.max(0, Math.min(GRID_SIZE - bh, focus.gy - Math.floor((bh - 1) / 2)));

    let bestNear: { gx: number; gy: number; score: number } | null = null;
    for (let dy = -9; dy <= 9; dy++) {
      for (let dx = -9; dx <= 9; dx++) {
        const gx = centerGx + dx;
        const gy = centerGy + dy;
        if (gx < 0 || gy < 0 || gx + bw > GRID_SIZE || gy + bh > GRID_SIZE) continue;
        if (!sim.canPlaceItem(item, gx, gy, rot).ok) continue;
        let roadBonus = 0;
        for (let ry = -1; ry <= bh && roadBonus === 0; ry++) {
          for (let rx = -1; rx <= bw; rx++) {
            const isCorner = (rx === -1 || rx === bw) && (ry === -1 || ry === bh);
            const isInside = rx >= 0 && rx < bw && ry >= 0 && ry < bh;
            if (isCorner || isInside) continue;
            if (sim.connectedPathTiles.has(`${gx + rx},${gy + ry}`)) {
              roadBonus = 8;
              break;
            }
          }
        }
        const score = roadBonus - Math.hypot(dx, dy);
        if (!bestNear || score > bestNear.score) {
          bestNear = { gx, gy, score };
        }
      }
    }
    if (bestNear) {
      return { gx: bestNear.gx, gy: bestNear.gy };
    }
    const smart = sim.findSmartSpotForStoryBuilding(item, rot);
    if (smart && sim.canPlaceItem(item, smart.gx, smart.gy, rot).ok) {
      return smart;
    }
    for (let gy = 0; gy <= GRID_SIZE - bh; gy++) {
      for (let gx = 0; gx <= GRID_SIZE - bw; gx++) {
        if (sim.canPlaceItem(item, gx, gy, rot).ok) {
          return { gx, gy };
        }
      }
    }
    return null;
  };

  hud.onBuildStateReset = () => {
    cancelPendingTouchPaint();
    hoverTile = null;
  };

  hud.onStartMoveBuilding = (uid) => {
    const mb = sim.state.buildings.find((x) => x.uid === uid);
    if (mb) {
      hoverTile = { gx: mb.gx, gy: mb.gy };
    }
  };

  hud.onRotateActivePlacement = () => {
    if (hud.moveModeActive && hud.movingBuildingUid) {
      const mb = sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
      const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
      if (mb && mIt) {
        const anchor = hud.pendingTouchTile ?? hoverTile ?? { gx: mb.gx, gy: mb.gy };
        const next = resolveBuildingPlacementTile(
          mIt,
          anchor.gx,
          anchor.gy,
          hud.rotation,
          hud.movingBuildingUid
        );
        hoverTile = next;
        if (hud.pendingTouchTile) {
          hud.pendingTouchTile = {
            gx: next.gx,
            gy: next.gy,
            label: hud.pendingTouchTile.label,
          };
        }
      }
      return;
    }
    if (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) {
      const anchor = hud.pendingTouchTile ?? hoverTile;
      if (anchor) {
        hoverTile = resolveBuildingPlacementTile(
          hud.selectedCatalogItem,
          anchor.gx,
          anchor.gy,
          hud.rotation
        );
      } else {
        hoverTile = findBestPreviewSpotNearCamera(hud.selectedCatalogItem, hud.rotation);
      }
      if (hud.pendingTouchTile && hoverTile) {
        hud.pendingTouchTile = {
          gx: hoverTile.gx,
          gy: hoverTile.gy,
          label: hud.pendingTouchTile.label,
        };
        hud.refreshTouchConfirmBar();
      }
    }
  };

  hud.onSelectCatalogItem = (item) => {
    hud.pendingTouchTile = null;
    hud.refreshTouchConfirmBar();
    const rect = canvas.getBoundingClientRect();
    const viewW = rect.width || window.innerWidth || 1280;
    const viewH = rect.height || window.innerHeight || 720;
    if (isDragPaintableItem(item)) {
      const focus = screenToGrid(viewW * 0.5, viewH * 0.5, cam, viewW, viewH, sim.grid);
      hoverTile = { gx: focus.gx, gy: focus.gy };
      return;
    }
    const spot = findBestPreviewSpotNearCamera(item, hud.rotation);
    if (!spot) {
      const focus = screenToGrid(viewW * 0.5, viewH * 0.5, cam, viewW, viewH, sim.grid);
      hoverTile = resolveBuildingPlacementTile(item, focus.gx, focus.gy, hud.rotation);
    } else {
      hoverTile = { gx: spot.gx, gy: spot.gy };
      const { bw, bh } = sim.getBuildingFootprint(item, hud.rotation);
      const elev = sim.grid[spot.gy]?.[spot.gx]?.elevation ?? 0;
      const scr = gridToScreen(
        spot.gx + bw * 0.5,
        spot.gy + bh * 0.5,
        cam,
        viewW,
        viewH,
        elev * ELEV_PX
      );
      if (
        scr.sx < viewW * 0.18 ||
        scr.sx > viewW * 0.82 ||
        scr.sy < viewH * 0.2 ||
        scr.sy > viewH * 0.76
      ) {
        introGlide = null;
        camDirector.cancel();
        centerCameraOnGrid(cam, spot.gx + bw * 0.5, spot.gy + bh * 0.5);
      }
    }
    if (hoverTile && window.matchMedia?.('(pointer: coarse)')?.matches) {
      hud.pendingTouchTile = {
        gx: hoverTile.gx,
        gy: hoverTile.gy,
        label: formatTouchConfirmLabelForItem(item),
      };
      hud.refreshTouchConfirmBar();
    }
  };

  hud.onAutoPlaceSelected = () => {
    const placedItem = hud.selectedCatalogItem;
    if (!placedItem) return;
    const rot = hud.rotation;
    let target: { gx: number; gy: number } | null = null;
    if (hoverTile && sim.canPlaceItem(placedItem, hoverTile.gx, hoverTile.gy, rot).ok) {
      target = { gx: hoverTile.gx, gy: hoverTile.gy };
    } else {
      target = findBestPreviewSpotNearCamera(placedItem, rot);
    }

    if (!target) {
      const probe = sim.canPlaceItem(placedItem, 18, 24, rot);
      const { bw, bh } = sim.getBuildingFootprint(placedItem, rot);
      hud.showToast(
        probe.reason && !probe.reason.includes('Ô đất')
          ? probe.reason
          : `Chưa tìm thấy khoảng đất trống ${bw}×${bh} ô trong vùng đã mở khóa!`,
        '⚠️'
      );
      return;
    }

    const check = sim.canPlaceItem(placedItem, target.gx, target.gy, rot);
    if (!check.ok) {
      hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
      return;
    }
    const placedOk = runSingleBuildStroke(() =>
      sim.placeItem(placedItem, target!.gx, target!.gy, rot)
    );
    if (!placedOk) return;
    hud.recordRecentDecorItem(placedItem.id);
    const { bw, bh } = sim.getBuildingFootprint(placedItem, rot);
    introGlide = null;
    camDirector.cancel();
    centerCameraOnGrid(cam, target.gx + bw * 0.5, target.gy + bh * 0.5);
    hud.pendingTouchTile = null;
    if (!isRepeatableCatalogItem(placedItem)) {
      hud.selectedCatalogItem = null;
      hoverTile = null;
    } else {
      hoverTile = findBestPreviewSpotNearCamera(placedItem, rot);
    }
    hud.refreshAll();
    hud.showToast(`🔨 Đã khởi công "${placedItem.name}" thành công!`, '✨');
  };

  // Touch Confirm Bar handles both Move relocation and Touch Ghost Placement
  hud.onTouchConfirmPlace = () => {
    if (!hud.pendingTouchTile) return;
    const { gx, gy } = hud.pendingTouchTile;

    if (hud.moveModeActive && hud.movingBuildingUid) {
      const movingUid = hud.movingBuildingUid;
      const mb = sim.state.buildings.find((x) => x.uid === movingUid);
      const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
      const res = runSingleBuildStroke(() =>
        sim.moveBuilding(movingUid, gx, gy, hud.rotation)
      );
      if (!res.ok) {
        hud.showToast(res.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      if (hud.moveKeepActiveAfterDrop) {
        hud.movingBuildingUid = null;
        hud.pendingTouchTile = null;
        hoverTile = null;
      } else {
        hud.clearBuildToolModes();
        hoverTile = null;
      }
      hud.refreshAll();
      hud.showToast(`✋ Đã dời "${mIt?.name ?? 'công trình'}" sang vị trí mới!`, '✨');
      return;
    }

    if (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) {
      const placedItem = hud.selectedCatalogItem;
      const check = sim.canPlaceItem(placedItem, gx, gy, hud.rotation);
      if (!check.ok) {
        hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      const placedOk = runSingleBuildStroke(() =>
        sim.placeItem(placedItem, gx, gy, hud.rotation)
      );
      if (!placedOk) return;
      hud.recordRecentDecorItem(placedItem.id);
      if (isRepeatableCatalogItem(placedItem) && canStillAffordAnotherPlacement(placedItem)) {
        const nextSpot = findBestPreviewSpotNearCamera(placedItem, hud.rotation);
        if (nextSpot) {
          hoverTile = nextSpot;
          hud.pendingTouchTile = {
            gx: nextSpot.gx,
            gy: nextSpot.gy,
            label: formatTouchConfirmLabelForItem(placedItem),
          };
        } else {
          hud.selectedCatalogItem = null;
          hud.pendingTouchTile = null;
          hoverTile = null;
        }
      } else {
        hud.selectedCatalogItem = null;
        hud.pendingTouchTile = null;
        hoverTile = null;
        hud.showToast(`🔨 Đã khởi công "${placedItem.name}" thành công!`, '✨');
      }
      hud.refreshAll();
      return;
    }

    hud.pendingTouchTile = null;
    hud.refreshTouchConfirmBar();
  };

  hud.onTouchStashActiveBuilding = () => {
    if (!(hud.moveModeActive && hud.movingBuildingUid)) return;
    const res = sim.stashBuilding(hud.movingBuildingUid);
    if (res.ok) {
      if (hud.moveKeepActiveAfterDrop) {
        hud.movingBuildingUid = null;
        hud.pendingTouchTile = null;
        hoverTile = null;
      } else {
        hud.clearBuildToolModes();
        hoverTile = null;
      }
      hud.refreshAll();
    }
    hud.showToast(res.msg, res.ok ? '📦' : '⚠️');
  };

  hud.onTouchCancelPlace = () => {
    hoverTile = null;
  };

  const keysPressed = new Set<string>();
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]')) {
      keysPressed.clear();
      return;
    }
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement ||
      (e.target instanceof HTMLElement && e.target.classList.contains('drag-handle'))
    ) {
      return;
    }
    keysPressed.add(e.key.toLowerCase());
  });
  window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.key.toLowerCase());
  });
  window.addEventListener('blur', () => {
    keysPressed.clear();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      keysPressed.clear();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    const rect = canvas.getBoundingClientRect();

    // Handle 2-finger Pinch-to-Zoom!
    if (activePointers.size >= 2) {
      camDirector.cancel();
      cancelPendingTouchPaint();
      cancelLongPressMove();
      isPaintingTiles = false;
      isErasingBrush = false;
      canStartEraseBrush = false;
      pressedOnPendingGhost = false;
      isDraggingTouchGhost = false;
      wasPinching = true;
      const pts = Array.from(activePointers.values());
      const curDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const midX = (pts[0].x + pts[1].x) * 0.5 - rect.left;
      const midY = (pts[0].y + pts[1].y) * 0.5 - rect.top;
      if (prevPinchDist > 8 && curDist > 8) {
        const beforeWx = (midX - rect.width * 0.5) / cam.zoom + cam.x;
        const beforeWy = (midY - rect.height * 0.5) / cam.zoom + cam.y;
        const ratio = curDist / prevPinchDist;
        cam.zoom = Math.max(0.32, Math.min(2.15, cam.zoom * ratio));
        cam.x = beforeWx - (midX - rect.width * 0.5) / cam.zoom;
        cam.y = beforeWy - (midY - rect.height * 0.5) / cam.zoom;
      }
      prevPinchDist = curDist;
      return;
    }

    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    // 1. Cozy Hover-Sweep Bubble Harvesting!
    if (!sim.isVisitingNeighbor && !isDraggingCam && !hud.movingBuildingUid && !hud.pincerActive) {
      for (const hs of renderer.hotspots) {
        if (hs.kind === 'bubble' && Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius) {
          sim.harvestBuildingBubble(hs.id);
        }
      }
    }

    const gPos = screenToGrid(sx, sy, cam, rect.width, rect.height, sim.grid);
    if (!hud.pendingTouchTile) {
      if (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) {
        hoverTile = resolveBuildingPlacementTile(
          hud.selectedCatalogItem,
          gPos.gx,
          gPos.gy,
          hud.rotation
        );
      } else if (hud.moveModeActive && hud.movingBuildingUid) {
        const mb = sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        hoverTile = mIt
          ? resolveBuildingPlacementTile(mIt, gPos.gx, gPos.gy, hud.rotation, hud.movingBuildingUid)
          : { gx: gPos.gx, gy: gPos.gy };
      } else {
        hoverTile = { gx: gPos.gx, gy: gPos.gy };
      }
    }

    if (!isPointerDown) return;

    const moveDistFromStart = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
    if (longPressMove && moveDistFromStart > 8) {
      cancelLongPressMove();
    }

    if (pressedOnPendingGhost && !isDraggingTouchGhost && moveDistFromStart > 6) {
      isDraggingTouchGhost = true;
    }

    if (isDraggingTouchGhost && activePointers.size === 1) {
      if (hud.moveModeActive && hud.movingBuildingUid) {
        const mb = sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        const nextTile = mIt
          ? resolveBuildingPlacementTile(mIt, gPos.gx, gPos.gy, hud.rotation, hud.movingBuildingUid)
          : { gx: gPos.gx, gy: gPos.gy };
        hoverTile = nextTile;
        if (hud.pendingTouchTile) {
          hud.pendingTouchTile = {
            gx: nextTile.gx,
            gy: nextTile.gy,
            label: hud.pendingTouchTile.label,
          };
          hud.refreshTouchConfirmBar();
        }
        return;
      }
      if (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) {
        const nextTile = resolveBuildingPlacementTile(
          hud.selectedCatalogItem,
          gPos.gx,
          gPos.gy,
          hud.rotation
        );
        hoverTile = nextTile;
        if (hud.pendingTouchTile) {
          hud.pendingTouchTile = {
            gx: nextTile.gx,
            gy: nextTile.gy,
            label: hud.pendingTouchTile.label,
          };
          hud.refreshTouchConfirmBar();
        }
        return;
      }
    }

    if (canStartEraseBrush && hud.bulldozerActive && activePointers.size === 1 && !wasPinching) {
      if (!isErasingBrush && moveDistFromStart > 7) {
        isErasingBrush = true;
        sim.eraseBrushAtTile(eraseStartGx, eraseStartGy);
      }
      if (isErasingBrush) {
        sim.eraseBrushAtTile(gPos.gx, gPos.gy);
        return;
      }
    }

    if (
      pendingTouchPaint &&
      activePointers.size === 1 &&
      moveDistFromStart > 8
    ) {
      const first = pendingTouchPaint;
      cancelPendingTouchPaint();
      isPaintingTiles = true;
      if (sim.placeItem(first.item, first.gx, first.gy, first.rot)) {
        hud.recordRecentDecorItem(first.item.id);
      }
    }

    if (isPaintingTiles && hud.selectedCatalogItem) {
      if (sim.placeItem(hud.selectedCatalogItem, gPos.gx, gPos.gy, hud.rotation)) {
        hud.recordRecentDecorItem(hud.selectedCatalogItem.id);
      }
      return;
    }

    if (isSowingSeeds && hud.activeSeedCropId) {
      trySowPlotAt(gPos.gx, gPos.gy, sx, sy);
      return;
    }

    if (isStockingPastures && hud.activePastureAnimalId) {
      tryStockPastureAt(gPos.gx, gPos.gy, sx, sy);
      return;
    }

    if (pendingCareSweep && activePointers.size === 1 && !wasPinching) {
      const moveDist = Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY);
      if (!pendingCareSweep.active && moveDist > 7) {
        pendingCareSweep.active = true;
        sim.batchOperationActive = true;
        if (
          applyCareSweepPlot(
            pendingCareSweep.initialUid,
            pendingCareSweep.mode,
            pendingCareSweep.initialSx,
            pendingCareSweep.initialSy
          )
        ) {
          pendingCareSweep.sweptUids.add(pendingCareSweep.initialUid);
        }
      }
      if (pendingCareSweep.active) {
        const hit = detectCareablePlotAt(gPos.gx, gPos.gy, sx, sy, pendingCareSweep.mode);
        if (hit && !pendingCareSweep.sweptUids.has(hit.uid)) {
          if (applyCareSweepPlot(hit.uid, hit.mode, sx, sy)) {
            pendingCareSweep.sweptUids.add(hit.uid);
          }
        }
        return;
      }
    }

    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;
    const dragThresholdPx =
      (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) ||
      (hud.moveModeActive && Boolean(hud.movingBuildingUid))
        ? 14
        : 5;
    if (Math.hypot(dx, dy) > dragThresholdPx) {
      isDraggingCam = true;
      hud.rideCamUid = null;
    }
    if (isDraggingCam) {
      introGlide = null;
      camDirector.cancel();
      cam.x = camStartX - dx / cam.zoom;
      cam.y = camStartY - dy / cam.zoom;
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size >= 2) {
      cancelPendingTouchPaint();
      cancelLongPressMove();
      finishCareSweep();
      const pts = Array.from(activePointers.values());
      prevPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      wasPinching = true;
      isPaintingTiles = false;
      isErasingBrush = false;
      canStartEraseBrush = false;
      pressedOnPendingGhost = false;
      isDraggingTouchGhost = false;
      return;
    }

    // Build Mode transaction: mở 1 undo-stroke cho toàn bộ thao tác kéo/chuột hiện tại
    // (build, move, remove, brush care). Idempotent + no-op trong visitor mode.
    sim.beginBuildStroke();

    if (e.button !== 0 && e.button !== 2) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const gPos = screenToGrid(sx, sy, cam, rect.width, rect.height, sim.grid);
    if (!hud.pendingTouchTile) {
      if (hud.selectedCatalogItem && !isDragPaintableItem(hud.selectedCatalogItem)) {
        hoverTile = resolveBuildingPlacementTile(
          hud.selectedCatalogItem,
          gPos.gx,
          gPos.gy,
          hud.rotation
        );
      } else if (hud.moveModeActive && hud.movingBuildingUid) {
        const mb = sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        hoverTile = mIt
          ? resolveBuildingPlacementTile(mIt, gPos.gx, gPos.gy, hud.rotation, hud.movingBuildingUid)
          : { gx: gPos.gx, gy: gPos.gy };
      } else {
        hoverTile = { gx: gPos.gx, gy: gPos.gy };
      }
    }

    isPointerDown = true;
    isDraggingCam = false;
    isErasingBrush = false;
    canStartEraseBrush = false;
    pressedOnPendingGhost = false;
    isDraggingTouchGhost = false;
    longPressJustActivated = false;
    cancelLongPressMove();
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    camStartX = cam.x;
    camStartY = cam.y;

    // Allow grabbing and sliding an active pending ghost footprint directly on touch!
    if (e.button === 0 && hud.pendingTouchTile && !hud.hasOpenFloatingTray()) {
      const ghostItem =
        hud.selectedCatalogItem ??
        (hud.moveModeActive && hud.movingBuildingUid
          ? getCatalogItem(
              sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid)?.itemId ?? ''
            ) ?? null
          : null);
      if (ghostItem && !isDragPaintableItem(ghostItem)) {
        const { bw, bh } = sim.getBuildingFootprint(ghostItem, hud.rotation);
        const pt = hud.pendingTouchTile;
        if (
          gPos.gx >= pt.gx - 1 &&
          gPos.gx <= pt.gx + bw &&
          gPos.gy >= pt.gy - 1 &&
          gPos.gy <= pt.gy + bh
        ) {
          pressedOnPendingGhost = true;
        }
      }
    }

    const item = hud.selectedCatalogItem;
    if (e.button === 0 && hud.bulldozerActive && !hud.hasOpenFloatingTray()) {
      isPaintingTiles = false;
      isSowingSeeds = false;
      isStockingPastures = false;
      canStartEraseBrush = true;
      eraseStartGx = gPos.gx;
      eraseStartGy = gPos.gy;
    } else if (e.button === 0 && item && isDragPaintableItem(item) && !hud.hasOpenFloatingTray()) {
      if (e.pointerType === 'touch') {
        cancelPendingTouchPaint();
        isPaintingTiles = false;
        const rotSnap = hud.rotation;
        pendingTouchPaint = {
          item,
          gx: gPos.gx,
          gy: gPos.gy,
          rot: rotSnap,
          timer: window.setTimeout(() => {
            pendingTouchPaint = null;
            if (activePointers.size === 1 && !wasPinching && isPointerDown) {
              isPaintingTiles = true;
              if (sim.placeItem(item, gPos.gx, gPos.gy, rotSnap)) {
                hud.recordRecentDecorItem(item.id);
              }
            }
          }, 75),
        };
      } else {
        isPaintingTiles = true;
        if (sim.placeItem(item, gPos.gx, gPos.gy, hud.rotation)) {
          hud.recordRecentDecorItem(item.id);
        }
      }
      isSowingSeeds = false;
      isStockingPastures = false;
    } else if (
      e.button === 0 &&
      hud.activeSeedCropId &&
      !hud.selectedCatalogItem &&
      !hud.moveModeActive &&
      !hud.bulldozerActive &&
      !hud.pincerActive &&
      trySowPlotAt(gPos.gx, gPos.gy, sx, sy)
    ) {
      isPaintingTiles = false;
      isSowingSeeds = true;
      isStockingPastures = false;
    } else if (
      e.button === 0 &&
      hud.activePastureAnimalId &&
      !hud.selectedCatalogItem &&
      !hud.moveModeActive &&
      !hud.bulldozerActive &&
      !hud.pincerActive &&
      tryStockPastureAt(gPos.gx, gPos.gy, sx, sy)
    ) {
      isPaintingTiles = false;
      isSowingSeeds = false;
      isStockingPastures = true;
    } else {
      isPaintingTiles = false;
      isSowingSeeds = false;
      isStockingPastures = false;
      if (
        e.button === 0 &&
        !sim.isVisitingNeighbor &&
        !hud.selectedCatalogItem &&
        !hud.activeSeedCropId &&
        !hud.activePastureAnimalId &&
        !hud.moveModeActive &&
        !hud.bulldozerActive &&
        !hud.pincerActive &&
        !hud.hasOpenFloatingTray()
      ) {
        const careTarget = detectCareablePlotAt(gPos.gx, gPos.gy, sx, sy);
        pendingCareSweep = careTarget
          ? {
              mode: careTarget.mode,
              initialUid: careTarget.uid,
              initialSx: sx,
              initialSy: sy,
              active: false,
              sweptUids: new Set<string>(),
            }
          : null;

        // Long-Press (~430ms) on any movable placed building lifts it into Move Mode directly!
        if (!hud.photoModeActive) {
          const hitPriorityBubble = renderer.hotspots.some(
            (hs) =>
              (hs.kind === 'owl_post' ||
                hs.kind === 'visitor_gift' ||
                hs.kind === 'neighbor_help' ||
                hs.kind === 'home_lantern' ||
                hs.kind === 'unveil_building' ||
                hs.kind === 'bubble') &&
              Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius
          );
          if (!hitPriorityBubble) {
            let holdUid = sim.grid[gPos.gy]?.[gPos.gx]?.buildingUid ?? null;
            if (!holdUid) {
              let bestDist = Infinity;
              for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
                const hs = renderer.hotspots[i];
                if (hs.kind !== 'building') continue;
                const d = Math.hypot(sx - hs.sx, sy - hs.sy);
                if (d <= hs.radius && d < bestDist) {
                  bestDist = d;
                  holdUid = hs.id;
                }
              }
            }
            const holdB = holdUid ? sim.state.buildings.find((x) => x.uid === holdUid) : null;
            if (holdB && !holdB.isIndestructible) {
              const pType = e.pointerType;
              longPressMove = {
                uid: holdB.uid,
                startMs: performance.now(),
                sx,
                sy,
                pointerType: pType,
                timer: window.setTimeout(() => {
                  const activeHold = longPressMove;
                  longPressMove = null;
                  if (!activeHold || !isPointerDown || wasPinching || activePointers.size > 1) {
                    return;
                  }
                  const curB = sim.state.buildings.find((x) => x.uid === activeHold.uid);
                  if (!curB || curB.isIndestructible || sim.isVisitingNeighbor) return;
                  pendingCareSweep = null;
                  sim.batchOperationActive = false;
                  const curIt = getCatalogItem(curB.itemId);
                  hud.clearBuildToolModes();
                  hud.inspectSelection = null;
                  hud.moveModeActive = true;
                  hud.moveKeepActiveAfterDrop = false;
                  hud.movingBuildingUid = curB.uid;
                  hud.rotation = curB.rotation;
                  hoverTile = { gx: curB.gx, gy: curB.gy };
                  if (activeHold.pointerType === 'touch') {
                    hud.pendingTouchTile = {
                      gx: curB.gx,
                      gy: curB.gy,
                      label: curIt?.name ?? 'Dời công trình',
                    };
                    pressedOnPendingGhost = true;
                    isDraggingTouchGhost = true;
                  }
                  longPressJustActivated = true;
                  renderer.triggerSquash(curB.uid);
                  sim.audio.playClick();
                  haptic('light');
                  hud.refreshAll();
                  hud.showToast(
                    `✋ Đã nhấc "${curIt?.name ?? 'công trình'}" — kéo tới ô mới để đặt!`,
                    '✋'
                  );
                }, LONG_PRESS_MOVE_MS),
              };
            }
          }
        }
      } else {
        pendingCareSweep = null;
      }
    }
  });

  const clearPointer = (pointerId: number) => {
    activePointers.delete(pointerId);
    if (activePointers.size < 2) {
      prevPinchDist = 0;
    }
  };

  window.addEventListener('pointercancel', (e) => {
    cancelPendingTouchPaint();
    cancelLongPressMove();
    finishCareSweep();
    sim.cancelBuildStroke();
    clearPointer(e.pointerId);
    isPointerDown = false;
    isDraggingCam = false;
    isPaintingTiles = false;
    isErasingBrush = false;
    canStartEraseBrush = false;
    pressedOnPendingGhost = false;
    isDraggingTouchGhost = false;
    longPressJustActivated = false;
    isSowingSeeds = false;
    isStockingPastures = false;
    wasPinching = false;
  });

  window.addEventListener('pointerup', (e) => {
    clearPointer(e.pointerId);
    cancelLongPressMove();
    if (wasPinching) {
      cancelPendingTouchPaint();
      finishCareSweep();
      finishBuildStroke();
      if (activePointers.size === 0) {
        wasPinching = false;
        isPointerDown = false;
        isDraggingCam = false;
        isErasingBrush = false;
        canStartEraseBrush = false;
        pressedOnPendingGhost = false;
        isDraggingTouchGhost = false;
        longPressJustActivated = false;
        isSowingSeeds = false;
        isStockingPastures = false;
      }
      return;
    }

    if (!isPointerDown) return;
    const wasCareSweeping = finishCareSweep();
    const wasErasingBrush = isErasingBrush;
    const wasDraggingGhost = isDraggingTouchGhost;
    const wasLongPressLift = longPressJustActivated;
    let flushedTouchPaint = false;
    if (pendingTouchPaint && !isDraggingCam && e.target === canvas) {
      const first = pendingTouchPaint;
      cancelPendingTouchPaint();
      const check = sim.canPlaceItem(first.item, first.gx, first.gy, first.rot);
      if (!check.ok) {
        finishBuildStroke();
        isPointerDown = false;
        isDraggingCam = false;
        isPaintingTiles = false;
        isErasingBrush = false;
        canStartEraseBrush = false;
        pressedOnPendingGhost = false;
        isDraggingTouchGhost = false;
        longPressJustActivated = false;
        isSowingSeeds = false;
        isStockingPastures = false;
        hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      if (sim.placeItem(first.item, first.gx, first.gy, first.rot)) {
        hud.recordRecentDecorItem(first.item.id);
      }
      flushedTouchPaint = true;
    } else {
      cancelPendingTouchPaint();
    }
    // Commit stroke build SAU khi flush touch paint (placeItem có thể tạo mutation mới).
    finishBuildStroke();

    const wasDragging = isDraggingCam;
    const wasPainting =
      isPaintingTiles ||
      flushedTouchPaint ||
      wasErasingBrush ||
      isSowingSeeds ||
      isStockingPastures ||
      wasCareSweeping;
    const paintedBuild = isPaintingTiles || flushedTouchPaint;
    isPointerDown = false;
    isDraggingCam = false;
    isPaintingTiles = false;
    isErasingBrush = false;
    canStartEraseBrush = false;
    pressedOnPendingGhost = false;
    isDraggingTouchGhost = false;
    longPressJustActivated = false;
    isSowingSeeds = false;
    isStockingPastures = false;

    if (wasErasingBrush) {
      hud.refreshDock();
      return;
    }
    if (wasLongPressLift || wasDraggingGhost) {
      hud.refreshTouchConfirmBar();
      hud.refreshFloatingBanner();
      return;
    }

    if (paintedBuild && hud.selectedCatalogItem && !isBrushItem(hud.selectedCatalogItem)) {
      hud.selectedCatalogItem = null; // HPVN: a stray tap must not buy another one
      hud.refreshAll();
    }

    if (wasDragging || wasPainting) return;

    // Right click cancels active build / move / pincer / bulldoze / seed brush / inspector cleanly
    if (e.button === 2) {
      hud.clearBuildToolModes();
      hud.closeSeedTray();
      hud.closePastureTray();
      hud.collapseBuildDock();
      hud.closeHudPopovers();
      hud.inspectSelection = null;
      hud.refreshAll();
      return;
    }

    if (e.target !== canvas) return;
    const prevPendingSowPlotUid = hud.pendingSowPlotUid;
    const prevPendingStockPastureUid = hud.pendingStockPastureUid;
    const prevActiveSeedCropId = hud.activeSeedCropId;
    const prevActivePastureAnimalId = hud.activePastureAnimalId;
    hud.closeHudPopovers();
    if (hud.hasOpenFloatingTray()) {
      hud.hideOpenFloatingTrays();
      if (
        hud.selectedCatalogItem ||
        hud.moveModeActive ||
        hud.bulldozerActive ||
        hud.pincerActive
      ) {
        hud.refreshAll();
        return;
      }
      if (
        prevActiveSeedCropId &&
        (sim.state.sandboxMode || sim.getSeedCount(prevActiveSeedCropId) > 0)
      ) {
        hud.activeSeedCropId = prevActiveSeedCropId;
      }
      if (prevActivePastureAnimalId) {
        hud.activePastureAnimalId = prevActivePastureAnimalId;
      }
      hud.renderSeedTray();
      hud.renderPastureTray();
      hud.refreshFloatingBanner();
    }
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const gPos = screenToGrid(sx, sy, cam, rect.width, rect.height, sim.grid);
    const isTouch = e.pointerType === 'touch';

    // 0. Pincer Dispatch Mode (dispatch staff directly to clicked tile!)
    if (hud.pincerActive) {
      const target =
        hud.pincerPicked ??
        (sim.staff[0]
          ? { kind: 'staff' as const, id: sim.staff[0].id, label: sim.staff[0].name }
          : null);
      if (target) {
        sim.dropPickedEntity(target.kind, target.id, gPos.gx, gPos.gy);
      }
      hud.clearBuildToolModes();
      hud.refreshAll();
      return;
    }

    // 1. Bulldozer / Scourgify mode
    if (hud.bulldozerActive) {
      let bGx = gPos.gx;
      let bGy = gPos.gy;
      const directCell = sim.grid[bGy]?.[bGx];
      if (!directCell?.buildingUid && (!directCell || directCell.path === 'none')) {
        for (const hs of renderer.hotspots) {
          if (hs.kind === 'building' && Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius) {
            const hb = sim.state.buildings.find((x) => x.uid === hs.id);
            if (hb) {
              bGx = hb.gx;
              bGy = hb.gy;
            }
            break;
          }
        }
      }
      // HPVN: ask first when the demolition would destroy a ready crop / ready animals / a workshop job
      const loss = sim.getRemovalLossText(bGx, bGy);
      if (loss) {
        void hud.askConfirm(loss).then((ok) => {
          if (!ok) return;
          runSingleBuildStroke(() => sim.removeAtTile(bGx, bGy));
          hud.refreshDock();
        });
        return;
      }
      runSingleBuildStroke(() => sim.removeAtTile(bGx, bGy));
      hud.refreshDock();
      return;
    }

    // 2. Move Building Mode (Pick up -> Relocate for 0 Sickle!)
    if (hud.moveModeActive) {
      if (hud.movingBuildingUid) {
        const movingUid = hud.movingBuildingUid;
        const mb = sim.state.buildings.find((x) => x.uid === movingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        const moveTarget = mIt
          ? resolveBuildingPlacementTile(mIt, gPos.gx, gPos.gy, hud.rotation, movingUid)
          : { gx: gPos.gx, gy: gPos.gy };
        const { bw: mBw, bh: mBh } = mIt
          ? sim.getBuildingFootprint(mIt, hud.rotation)
          : { bw: 1, bh: 1 };
        const tappedInsidePendingMove =
          Boolean(hud.pendingTouchTile) &&
          gPos.gx >= hud.pendingTouchTile!.gx &&
          gPos.gx < hud.pendingTouchTile!.gx + mBw &&
          gPos.gy >= hud.pendingTouchTile!.gy &&
          gPos.gy < hud.pendingTouchTile!.gy + mBh;
        if (
          isTouch &&
          !tappedInsidePendingMove &&
          (!hud.pendingTouchTile ||
            hud.pendingTouchTile.gx !== moveTarget.gx ||
            hud.pendingTouchTile.gy !== moveTarget.gy)
        ) {
          hoverTile = moveTarget;
          hud.pendingTouchTile = {
            gx: moveTarget.gx,
            gy: moveTarget.gy,
            label: mIt?.name ?? 'Dời công trình',
          };
          hud.refreshTouchConfirmBar();
          return;
        }
        const finalMoveGx = tappedInsidePendingMove ? hud.pendingTouchTile!.gx : moveTarget.gx;
        const finalMoveGy = tappedInsidePendingMove ? hud.pendingTouchTile!.gy : moveTarget.gy;
        const res = runSingleBuildStroke(() =>
          sim.moveBuilding(movingUid, finalMoveGx, finalMoveGy, hud.rotation)
        );
        if (!res.ok) {
          hud.showToast(res.reason ?? 'Không thể đặt tại ô này!', '⚠️');
          return;
        }
        if (hud.moveKeepActiveAfterDrop) {
          hud.movingBuildingUid = null;
          hud.pendingTouchTile = null;
          hoverTile = null;
        } else {
          hud.clearBuildToolModes();
          hoverTile = null;
        }
        hud.refreshAll();
        hud.showToast(`✋ Đã dời "${mIt?.name ?? 'công trình'}" sang vị trí mới!`, '✨');
        return;
      }

      // Pick up building at clicked hotspot or tile
      const cellB = sim.grid[gPos.gy]?.[gPos.gx]?.buildingUid;
      let pickUid = cellB ?? null;
      if (!pickUid) {
        for (const hs of renderer.hotspots) {
          if (hs.kind === 'building' && Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius) {
            pickUid = hs.id;
            break;
          }
        }
      }
      if (pickUid) {
        const b = sim.state.buildings.find((x) => x.uid === pickUid);
        if (b?.isIndestructible) {
          hud.showToast('Nhà Hang Sóc 6 Tầng là tổ ấm cố định của gia đình Weasley!', '🏠');
          return;
        }
        if (b) {
          hud.movingBuildingUid = b.uid;
          hud.rotation = b.rotation;
          hoverTile = { gx: b.gx, gy: b.gy };
          const it = getCatalogItem(b.itemId);
          if (isTouch) {
            hud.pendingTouchTile = {
              gx: b.gx,
              gy: b.gy,
              label: it?.name ?? 'Dời công trình',
            };
          }
          hud.refreshTouchConfirmBar();
          hud.refreshFloatingBanner();
          hud.showToast(
            `✋ Đang nhấc "${it?.name ?? 'công trình'}" — chạm ô mới để đặt xuống!`,
            '✋'
          );
          return;
        }
      }
    }

    // 3. Building Placement Mode (Touch Ghost Confirm on touch; One-Tap on desktop)
    if (hud.selectedCatalogItem) {
      const placedItem = hud.selectedCatalogItem;
      const targetTile = resolveBuildingPlacementTile(placedItem, gPos.gx, gPos.gy, hud.rotation);
      if (isTouch && !isDragPaintableItem(placedItem)) {
        const { bw: pBw, bh: pBh } = sim.getBuildingFootprint(placedItem, hud.rotation);
        const tappedInsidePendingPlace =
          Boolean(hud.pendingTouchTile) &&
          gPos.gx >= hud.pendingTouchTile!.gx &&
          gPos.gx < hud.pendingTouchTile!.gx + pBw &&
          gPos.gy >= hud.pendingTouchTile!.gy &&
          gPos.gy < hud.pendingTouchTile!.gy + pBh;
        if (
          !tappedInsidePendingPlace &&
          (!hud.pendingTouchTile ||
            hud.pendingTouchTile.gx !== targetTile.gx ||
            hud.pendingTouchTile.gy !== targetTile.gy)
        ) {
          hoverTile = targetTile;
          hud.pendingTouchTile = {
            gx: targetTile.gx,
            gy: targetTile.gy,
            label: formatTouchConfirmLabelForItem(placedItem),
          };
          hud.refreshTouchConfirmBar();
          return;
        }
        hud.onTouchConfirmPlace?.();
        return;
      }
      hoverTile = targetTile;
      const check = sim.canPlaceItem(placedItem, targetTile.gx, targetTile.gy, hud.rotation);
      if (!check.ok) {
        hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      const placedOk = runSingleBuildStroke(() =>
        sim.placeItem(placedItem, targetTile.gx, targetTile.gy, hud.rotation)
      );
      if (!placedOk) return;
      hud.recordRecentDecorItem(placedItem.id);
      hud.pendingTouchTile = null;
      if (!isRepeatableCatalogItem(placedItem)) {
        hud.selectedCatalogItem = null;
        hoverTile = null;
        hud.showToast(`🔨 Đã khởi công "${placedItem.name}" thành công!`, '✨');
      }
      hud.refreshAll();
      return;
    }

    // 4. Normal click: check screen hotspots in priority order (front-to-back + pixel alpha hitmask)
    for (const kind of [
      'owl_post',
      'field_micro_event',
      'roaming_pet',
      'home_visitor_gift',
      'visitor_gift',
      'neighbor_help',
      'home_lantern',
      'unveil_building',
      'bubble',
      'water_crop',
      'feed_pasture',
      'escaped',
      'zone_plaque',
      'villager',
      'building',
      'building_cutaway',
    ] as const) {
      let best: (typeof renderer.hotspots)[number] | null = null;
      let bestDist = Infinity;
      for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
        const hs = renderer.hotspots[i];
        if (hs.kind !== kind) continue;
        const d = Math.hypot(sx - hs.sx, sy - hs.sy);

        if (
          hs.spriteKey &&
          typeof hs.boxLeft === 'number' &&
          typeof hs.boxTop === 'number' &&
          typeof hs.boxW === 'number' &&
          typeof hs.boxH === 'number' &&
          hs.boxW > 2 &&
          hs.boxH > 2
        ) {
          const inBox =
            sx >= hs.boxLeft &&
            sx <= hs.boxLeft + hs.boxW &&
            sy >= hs.boxTop &&
            sy <= hs.boxTop + hs.boxH;
          const u = (sx - hs.boxLeft) / hs.boxW;
          const v = (sy - hs.boxTop) / hs.boxH;
          const alphaHit = inBox && sprites.hitTestAlpha(hs.spriteKey, u, v, Boolean(hs.flipX));
          const padFallback =
            (hs.kind === 'building' || hs.kind === 'building_cutaway') && d <= hs.radius * 0.5;
          if (!alphaHit && !padFallback) continue;
          if (best === null || d < bestDist * 0.82) {
            best = hs;
            bestDist = d;
            if (alphaHit) break; // Front-most opaque pixel hit wins immediately!
          }
        } else if (d <= hs.radius && d < bestDist) {
          bestDist = d;
          best = hs;
        }
      }
      if (best) {
        if (best.kind === 'owl_post') {
          const pos = renderer.collectOwlPostParcel();
          if (pos) {
            sim.claimOwlPostDelivery(pos.gx, pos.gy);
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'field_micro_event') {
          const res = sim.claimFieldMicroEvent();
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'roaming_pet') {
          const res = sim.petRoamingCompanion();
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '🐾');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'home_visitor_gift') {
          const res = sim.claimHomeVisitorMysteryGift(best.id);
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '🎁');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'visitor_gift') {
          const res = sim.claimVisitedNeighborMysteryGift();
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '🎁');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'neighbor_help') {
          renderer.triggerSquash(best.id);
          const res = sim.helpVisitedNeighborBuilding(best.id);
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
            notifyHpvnVisitHelpIfRealPlayer(best.id);
          } else {
            hud.showToast(res.msg, '💧');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'home_lantern') {
          const markRef = sim.ensureNeighborSocial().homeLanternMarks.find((m) => m.id === best.id);
          if (markRef) renderer.triggerSquash(markRef.buildingUid);
          const res = sim.claimHomeLanternMark(best.id);
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '🏮');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'unveil_building') {
          sim.unveilBuilding(best.id);
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'bubble') {
          sim.harvestBuildingBubble(best.id);
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'water_crop') {
          renderer.triggerSquash(best.id);
          const res = sim.waterCropPlot(best.id);
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '💧');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'feed_pasture') {
          renderer.triggerSquash(best.id);
          const res = sim.feedAnimalPasture(best.id);
          if (res.ok) {
            renderer.notifyJuice('harvest', best.sx, best.sy);
          } else {
            hud.showToast(res.msg, '🌾');
          }
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'escaped') {
          sim.catchEscapedCreature(best.id);
          hud.inspectSelection = null;
          hud.refreshAll();
          return;
        }
        if (best.kind === 'zone_plaque') {
          hud.clearBuildToolModes();
          hud.closeSeedTray();
          hud.inspectSelection = { kind: 'zone', zoneId: best.id as ZoneId };
          hud.refreshAll();
          return;
        }
        if (best.kind === 'villager') {
          sim.greetVillager(best.id as ValleyVillagerId);
          hud.refreshAll();
          return;
        }
        if (best.kind === 'building' || best.kind === 'building_cutaway') {
          const b = sim.state.buildings.find((x) => x.uid === best.id);
          if (b) {
            if (!sim.isVisitingNeighbor && b.awaitingUnveil) {
              sim.unveilBuilding(b.uid);
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            }
            const bItemEarly = getCatalogItem(b.itemId);
            const isRipeCropHarvest = Boolean(
              !sim.isVisitingNeighbor &&
                bItemEarly?.isFarmlandPlot &&
                b.cropId &&
                b.cropReadyAt &&
                Date.now() >= b.cropReadyAt
            );
            const isRipePastureHarvest = Boolean(
              !sim.isVisitingNeighbor &&
                bItemEarly?.isAnimalPasturePlot &&
                b.pastureAnimalId &&
                b.pastureReadyAt &&
                Date.now() >= b.pastureReadyAt
            );
            if (!isRipeCropHarvest && !isRipePastureHarvest) {
              renderer.triggerSquash(best.id);
            }
            if (sim.isVisitingNeighbor) {
              const helpSt = sim.getVisitedBuildingHelpStatus(b);
              if (helpSt.canHelp) {
                const res = sim.helpVisitedNeighborBuilding(b.uid);
                if (res.ok) {
                  renderer.notifyJuice('harvest', best.sx, best.sy);
                  notifyHpvnVisitHelpIfRealPlayer(b.uid);
                } else {
                  hud.showToast(res.msg, '💧');
                }
              } else if (helpSt.existingMark) {
                hud.showToast(
                  `🏮 Đã treo đèn lồng chúc phúc: “${helpSt.existingMark.noteText}”`,
                  '🏮'
                );
              } else {
                const bItem = getCatalogItem(b.itemId);
                const nb = sim.getActiveVisitingNeighbor();
                hud.showToast(
                  `🏡 Đang ngắm "${bItem?.name ?? 'Công trình'}" (${b.stars}★) tại vườn ${nb?.name ?? 'bạn bè'}!`,
                  nb?.avatarEmoji ?? '🏡'
                );
              }
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            }
            const homeMark = sim
              .ensureNeighborSocial()
              .homeLanternMarks.find((m) => m.buildingUid === b.uid);
            if (homeMark) {
              const res = sim.claimHomeLanternMark(homeMark.id);
              if (res.ok) {
                renderer.notifyJuice('harvest', best.sx, best.sy);
                hud.inspectSelection = null;
                hud.refreshAll();
                return;
              }
            }
            const bItem = getCatalogItem(b.itemId);
            if (bItem?.isFarmlandPlot && b.cropId && b.cropReadyAt && Date.now() >= b.cropReadyAt) {
              sim.harvestCropPlot(b.uid);
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            } else if (
              bItem?.isFarmlandPlot &&
              b.cropId &&
              b.cropReadyAt &&
              Date.now() < b.cropReadyAt &&
              !b.cropWateredBoost
            ) {
              const waterRes = sim.waterCropPlot(b.uid);
              if (waterRes.ok) {
                renderer.notifyJuice('harvest', best.sx, best.sy);
              }
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            } else if (bItem?.isFarmlandPlot && !b.cropId && Date.now() >= b.constructEndsAt) {
              if (hud.activeSeedCropId) {
                const activeCrop = hud.activeSeedCropId;
                const sowRes = sim.plantCropOnPlot(b.uid, activeCrop);
                if (sowRes.needSeedAcquire) {
                  hud.activeSeedCropId = null;
                  hud.inspectSelection = null;
                  hud.refreshAll();
                  hud.openSeedQuizDialog(activeCrop, b.uid);
                  return;
                }
                if (!sim.state.sandboxMode && sim.getSeedCount(activeCrop) <= 0) {
                  hud.activeSeedCropId = null;
                }
                hud.showToast(sowRes.msg, sowRes.ok ? '🌱' : '🪙');
                hud.inspectSelection = null;
                hud.refreshAll();
              } else if (prevPendingSowPlotUid === b.uid) {
                hud.inspectSelection = { kind: 'building', uid: b.uid };
                hud.refreshAll();
              } else {
                hud.openSeedTray(undefined, b.uid);
              }
              return;
            } else if (
              bItem?.isAnimalPasturePlot &&
              b.pastureAnimalId &&
              b.pastureReadyAt &&
              Date.now() >= b.pastureReadyAt
            ) {
              sim.harvestAnimalPasture(b.uid);
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            } else if (
              bItem?.isAnimalPasturePlot &&
              b.pastureAnimalId &&
              b.pastureReadyAt &&
              Date.now() < b.pastureReadyAt &&
              !b.pastureFedBoost
            ) {
              const feedRes = sim.feedAnimalPasture(b.uid);
              if (feedRes.ok) {
                renderer.notifyJuice('harvest', best.sx, best.sy);
              }
              hud.inspectSelection = null;
              hud.refreshAll();
              return;
            } else if (
              bItem?.isAnimalPasturePlot &&
              !b.pastureAnimalId &&
              Date.now() >= b.constructEndsAt
            ) {
              if (hud.activePastureAnimalId) {
                const stockRes = sim.stockAnimalOnPasture(b.uid, hud.activePastureAnimalId);
                hud.showToast(stockRes.msg, stockRes.ok ? '🐾' : '🪙');
                hud.inspectSelection = null;
                hud.refreshAll();
              } else if (prevPendingStockPastureUid === b.uid) {
                hud.inspectSelection = { kind: 'building', uid: b.uid };
                hud.refreshAll();
              } else {
                hud.openPastureTray(undefined, b.uid);
              }
              return;
            } else if (b.storedSickle > 0 || (b.readyFarmGoods && b.readyFarmGoods.length > 0)) {
              sim.harvestBuildingBubble(b.uid);
            }
          }
          hud.clearBuildToolModes();
          hud.closeSeedTray();
          hud.closePastureTray();
          hud.inspectSelection = { kind: 'building', uid: best.id };
          const cRect = canvas.getBoundingClientRect();
          if (best.sy > cRect.height - 190) {
            cam.y += (best.sy - (cRect.height - 210)) / cam.zoom;
          }
          hud.refreshAll();
          return;
        }
      }
    }

    const clickedTile = sim.grid[gPos.gy]?.[gPos.gx];
    if (
      !sim.isVisitingNeighbor &&
      clickedTile &&
      !sim.state.unlockedZones.includes(clickedTile.zoneId)
    ) {
      hud.clearBuildToolModes();
      hud.closeSeedTray();
      hud.closePastureTray();
      hud.inspectSelection = { kind: 'zone', zoneId: clickedTile.zoneId };
      hud.refreshAll();
      return;
    }

    if (sim.strollModeActive && !sim.isVisitingNeighbor) {
      sim.setStrollDestination(gPos.fgx ?? gPos.gx, gPos.fgy ?? gPos.gy);
      hud.inspectSelection = null;
      hud.refreshAll();
      return;
    }

    hud.inspectSelection = null;
    hud.refreshAll();
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      introGlide = null;
      camDirector.cancel();
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;

      const beforeWx = (sx - rect.width * 0.5) / cam.zoom + cam.x;
      const beforeWy = (sy - rect.height * 0.5) / cam.zoom + cam.y;

      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      cam.zoom = Math.max(0.32, Math.min(2.15, cam.zoom * factor));

      cam.x = beforeWx - (sx - rect.width * 0.5) / cam.zoom;
      cam.y = beforeWy - (sy - rect.height * 0.5) / cam.zoom;
    },
    { passive: false }
  );

  let lastTime = performance.now();
  let minimapFrame = 0;
  // HPVN: phones draw at most 30 frames a second (battery and heat); a 2 ms slack keeps a 60 Hz screen on every other frame
  const minFrameMs = window.matchMedia?.('(pointer: coarse)').matches ? 1000 / 30 - 2 : 0;
  const gamepad = new GamepadController();
  const telemetry = new ProductionTelemetryCollector();

  // Mount lightweight 8-slice Gamepad Radial Quick Menu overlay (hidden until LB held)
  const radialEl = document.createElement('div');
  radialEl.id = 'gamepadRadialMenu';
  radialEl.className = 'aaa-gamepad-radial';
  radialEl.hidden = true;
  radialEl.innerHTML = `
    <div class="aaa-gamepad-wheel">
      ${RADIAL_QUICK_SLICES.map((s) => {
        const angle = (s.index * Math.PI * 2) / 8;
        const leftPct = 50 + Math.cos(angle) * 37;
        const topPct = 50 + Math.sin(angle) * 37;
        return `<div class="aaa-gamepad-slice" data-radial-idx="${s.index}" style="left:${leftPct.toFixed(1)}%;top:${topPct.toFixed(1)}%;">${s.icon}<br/>${s.labelVi}</div>`;
      }).join('')}
    </div>
  `;
  app.appendChild(radialEl);
  let lastRadialAction: RadialQuickActionId | null = null;
  let wasRadialOpen = false;

  const triggerRadialQuickAction = (action: RadialQuickActionId): void => {
    switch (action) {
      case 'seeds':
        hud.openSeedTray();
        break;
      case 'barn':
        hud.openWorkshopDialog('barn');
        break;
      case 'orders': {
        hud.activeQuestTab = 'orders';
        hud.renderQuestDialog();
        (hud.root.querySelector('#questDialog') as HTMLDialogElement | null)?.showModal();
        break;
      }
      case 'match3':
        hud.openMatch3Dialog();
        break;
      case 'arcade':
        hud.openPuzzleArcadeDialog();
        break;
      case 'seedquiz':
        hud.openSeedQuizDialog();
        break;
      case 'neighbors':
        hud.openNeighborDialog('friends');
        break;
      case 'feast':
        hud.openHarvestFeastDialog();
        break;
    }
  };

  const isTouchDevice = isTouchOrIOSDevice();
  const match3DlgEl = hud.root.querySelector('#match3Dialog') as HTMLDialogElement | null;
  const puzzleArcadeDlgEl = hud.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
  const seedQuizDlgEl = hud.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
  const allModalDialogs = Array.from(hud.root.querySelectorAll<HTMLDialogElement>('dialog'));
  const syncOpenDialogFlags = (): void => {
    const prevFullscreen = cachedFullscreenModalOpen;
    cachedFullscreenModalOpen = Boolean(
      match3DlgEl?.open || puzzleArcadeDlgEl?.open || seedQuizDlgEl?.open
    );
    cachedAnyDialogOpen =
      cachedFullscreenModalOpen || allModalDialogs.some((d) => d.open);
    if (prevFullscreen && !cachedFullscreenModalOpen && pendingUiRefreshAfterFullscreen) {
      pendingUiRefreshAfterFullscreen = false;
      hud.refreshAll();
      accessibility.refresh();
    }
  };
  syncOpenDialogFlags();
  if (typeof MutationObserver !== 'undefined') {
    const dlgObserver = new MutationObserver(() => {
      syncOpenDialogFlags();
    });
    for (const d of allModalDialogs) {
      dlgObserver.observe(d, { attributes: true, attributeFilter: ['open'] });
    }
  }
  hud.root.addEventListener('close', syncOpenDialogFlags, true);

  let mainRafId = 0;
  let lastWorldRenderMs = 0;
  let fullscreenBgSimAccumSec = 0;
  let soundscapeAccumSec = 0.25;
  const minimapWrapEl = hud.root.querySelector('#minimapWrap') as HTMLElement | null;

  function frame(now: number): void {
    mainRafId = 0;
    if (document.hidden) {
      lastTime = now;
      return;
    }
    if (now - lastTime < minFrameMs) {
      requestAnimationFrame(frame);
      return;
    }
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    if (!cachedAnyDialogOpen && dt > 0.002 && dt < 0.5) {
      telemetry.recordFrameFps(1 / dt);
      if (minimapFrame % 90 === 0 && minimapFrame > 0) {
        const health = telemetry.getHealthReport();
        if (isTouchDevice) {
          renderer.adaptiveDprCap =
            health.p5LowFps < 46 ? 1.15 : health.p5LowFps < 54 ? 1.35 : 1.5;
        } else {
          renderer.adaptiveDprCap =
            health.p5LowFps < 46 ? 1.25 : health.p5LowFps < 54 ? 1.5 : 2;
        }
      }
    }

    // Poll Gamepad API (camera pan + 8-slice radial menu + modal cancel)
    const gp = gamepad.poll();
    if (gp.connected) {
      if (gp.panDx !== 0 || gp.panDy !== 0) {
        introGlide = null;
        camDirector.cancel();
        hud.rideCamUid = null;
        const gpSpeed = (380 / cam.zoom) * Math.min(0.05, dt);
        cam.x += gp.panDx * gpSpeed;
        cam.y += gp.panDy * gpSpeed;
      }
      if (gp.radialOpen) {
        radialEl.hidden = false;
        wasRadialOpen = true;
        if (gp.radialActionId) {
          lastRadialAction = gp.radialActionId;
        }
        radialEl.querySelectorAll<HTMLElement>('[data-radial-idx]').forEach((el) => {
          el.dataset.selected = String(Number(el.dataset.radialIdx) === gp.radialSliceIndex);
        });
        if (gp.confirmJustPressed && lastRadialAction) {
          radialEl.hidden = true;
          wasRadialOpen = false;
          triggerRadialQuickAction(lastRadialAction);
          lastRadialAction = null;
        }
      } else if (wasRadialOpen) {
        radialEl.hidden = true;
        wasRadialOpen = false;
        if (lastRadialAction) {
          triggerRadialQuickAction(lastRadialAction);
          lastRadialAction = null;
        }
      }
      if (gp.cancelJustPressed) {
        const openDlgs = allModalDialogs.filter((d) => d.open);
        if (openDlgs.length > 0) {
          openDlgs[openDlgs.length - 1]?.close();
        } else if (hud.hasOpenFloatingTray()) {
          hud.hideOpenFloatingTrays();
        }
      }
    }

    if (
      keysPressed.has('w') ||
      keysPressed.has('arrowup') ||
      keysPressed.has('s') ||
      keysPressed.has('arrowdown') ||
      keysPressed.has('a') ||
      keysPressed.has('arrowleft') ||
      keysPressed.has('d') ||
      keysPressed.has('arrowright')
    ) {
      introGlide = null;
      camDirector.cancel();
    }
    if (introGlide) {
      const gt = Math.min(1, Math.max(0, (now - introGlide.startMs) / introGlide.durationMs));
      const ease = 1 - Math.pow(1 - gt, 3);
      cam.x = introGlide.fromX + (introGlide.toX - introGlide.fromX) * ease;
      cam.y = introGlide.fromY + (introGlide.toY - introGlide.fromY) * ease;
      cam.zoom = introGlide.fromZoom + (introGlide.toZoom - introGlide.fromZoom) * ease;
      if (gt >= 1) {
        introGlide = null;
      }
    } else if (!hud.rideCamUid) {
      camDirector.update(cam, dt);
    }

    const panSpeed = (340 / cam.zoom) * Math.min(0.05, dt);
    if (keysPressed.size > 0 && cachedAnyDialogOpen) {
      keysPressed.clear();
    }
    if (sim.strollModeActive && sim.playerStrollAvatar && !sim.isVisitingNeighbor) {
      let kDx = 0;
      let kDy = 0;
      if (keysPressed.has('w') || keysPressed.has('arrowup')) kDy -= 1;
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) kDy += 1;
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) kDx -= 1;
      if (keysPressed.has('d') || keysPressed.has('arrowright')) kDx += 1;
      if (kDx !== 0 || kDy !== 0) {
        const avScreen = gridToScreen(
          sim.playerStrollAvatar.gx,
          sim.playerStrollAvatar.gy,
          cam,
          window.innerWidth,
          window.innerHeight
        );
        const tgtGrid = screenToGrid(
          avScreen.sx + kDx * 54 * cam.zoom,
          avScreen.sy + kDy * 54 * cam.zoom,
          cam,
          window.innerWidth,
          window.innerHeight
        );
        sim.setStrollDestination(tgtGrid.fgx, tgtGrid.fgy);
      }
      const avWorld = worldIso(sim.playerStrollAvatar.gx, sim.playerStrollAvatar.gy, cam.viewRot ?? 0);
      cam.x += (avWorld.wx - cam.x) * Math.min(1, dt * 6.5);
      cam.y += (avWorld.wy - 14 - cam.y) * Math.min(1, dt * 6.5);
    } else {
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        hud.rideCamUid = null;
        cam.y -= panSpeed;
      }
      if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        hud.rideCamUid = null;
        cam.y += panSpeed;
      }
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        hud.rideCamUid = null;
        cam.x -= panSpeed;
      }
      if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        hud.rideCamUid = null;
        cam.x += panSpeed;
      }
    }

    let runSoundscapeNow = true;
    let soundscapeDt = Math.min(0.1, dt);
    if (cachedFullscreenModalOpen) {
      fullscreenBgSimAccumSec += dt;
      if (fullscreenBgSimAccumSec >= 1.0) {
        const bgDt = Math.min(2.5, fullscreenBgSimAccumSec);
        fullscreenBgSimAccumSec = 0;
        sim.update(bgDt);
        soundscapeDt = Math.min(0.1, bgDt);
      } else {
        runSoundscapeNow = false;
      }
    } else if (fullscreenBgSimAccumSec > 0) {
      const catchupDt = Math.min(2.5, dt + fullscreenBgSimAccumSec);
      fullscreenBgSimAccumSec = 0;
      sim.update(catchupDt);
    } else {
      sim.update(dt);
    }

    // V3 Ride Cam Lock-On (Smoothly tracks lead coaster car or Gringotts minecart!)
    if (hud.rideCamUid && !cachedFullscreenModalOpen) {
      const rideB = sim.state.buildings.find((x) => x.uid === hud.rideCamUid);
      const circuit = sim.coasterCircuits.get(hud.rideCamUid);
      if (circuit && circuit.waypoints.length >= 3) {
        const cars = sampleCoasterTrainPositions(
          circuit.waypoints,
          circuit.isClosed,
          Date.now() / 1000,
          3
        );
        if (cars.length > 0) {
          const lead = cars[0];
          const wPos = worldIso(lead.gx + 0.5, lead.gy + 0.5, cam.viewRot ?? 0);
          const targetX = wPos.wx;
          const targetY = wPos.wy - (lead.elev * ELEV_PX + 10);
          cam.x += (targetX - cam.x) * Math.min(1, dt * 10);
          cam.y += (targetY - cam.y) * Math.min(1, dt * 10);
          cam.zoom += (1.38 - cam.zoom) * Math.min(1, dt * 5);
          hud.rideCamSpeedText = `${lead.speedKmh} km/h (${lead.onChainLift ? '⛓️ Xích kéo lên đồi' : '🔥 Đang đổ đèo!'})`;
          if (minimapFrame % 8 === 0) hud.refreshFloatingBanner();
        }
      } else if (rideB) {
        const t = Date.now() / 1000;
        const orbitGx = rideB.gx + 2 + Math.cos(t * 2.1) * 1.4;
        const orbitGy = rideB.gy + 2 + Math.sin(t * 2.1) * 1.4;
        const wPos = worldIso(orbitGx, orbitGy, cam.viewRot ?? 0);
        cam.x += (wPos.wx - cam.x) * Math.min(1, dt * 8);
        cam.y += (wPos.wy - 22 - cam.y) * Math.min(1, dt * 8);
        cam.zoom += (1.35 - cam.zoom) * Math.min(1, dt * 5);
        hud.rideCamSpeedText = '58 km/h (🎢 Hầm vàng Gringotts)';
        if (minimapFrame % 12 === 0) hud.refreshFloatingBanner();
      } else {
        hud.rideCamUid = null;
        hud.refreshFloatingBanner();
      }
    }

    // Symphonic Celesta BGM & Spatial Weather Soundscape (throttled to 4 Hz to avoid 60fps 121-tile + building scans)
    if (runSoundscapeNow) {
      soundscapeAccumSec += soundscapeDt;
    }
    if (runSoundscapeNow && soundscapeAccumSec >= 0.25) {
      const effectiveSoundDt = Math.min(0.35, soundscapeAccumSec);
      soundscapeAccumSec = 0;
      const period = sim.getRealTimePeriod();
      const curWeather = sim.getCurrentWeather();
      const rot = cam.viewRot ?? 0;
      const stationWorld = worldIso(3, 17, rot);
      const nearStation = Math.hypot(cam.x - stationWorld.wx, cam.y - stationWorld.wy) < 420;
      const focusGrid = screenToGrid(
        window.innerWidth * 0.5,
        window.innerHeight * 0.5,
        cam,
        window.innerWidth,
        window.innerHeight
      );
      const cgx = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(focusGrid.fgx)));
      const cgy = Math.max(0, Math.min(GRID_SIZE - 1, Math.round(focusGrid.fgy)));
      let waterDistPx = Number.POSITIVE_INFINITY;
      for (let dy = -5; dy <= 5; dy++) {
        const row = sim.grid[cgy + dy];
        if (!row) continue;
        for (let dx = -5; dx <= 5; dx++) {
          const cell = row[cgx + dx];
          if (!cell || cell.terrain !== 'water') continue;
          const wIso = worldIso(cgx + dx + 0.5, cgy + dy + 0.5, rot);
          const d = Math.hypot(cam.x - wIso.wx, cam.y - wIso.wy);
          if (d < waterDistPx) waterDistPx = d;
        }
      }
      let activeWorkshopDistPx = Number.POSITIVE_INFINITY;
      let pastureDistPx = Number.POSITIVE_INFINITY;
      let orchardDistPx = Number.POSITIVE_INFINITY;
      let festiveDistPx = Number.POSITIVE_INFINITY;
      const nowSoundMs = Date.now();
      const hasSupplyBrew = Boolean(
        sim.state.supply.activeBrew && sim.state.supply.activeBrew.endsAt > nowSoundMs
      );
      for (let i = 0; i < sim.state.buildings.length; i++) {
        const b = sim.state.buildings[i];
        if (nowSoundMs < b.constructEndsAt) continue;
        const bItem = getCatalogItem(b.itemId);
        if (!bItem) continue;
        const isActiveWs =
          Boolean(b.workshopQueue && b.workshopQueue.length > 0 && b.workshopQueue[0].endsAt > nowSoundMs) ||
          Boolean(bItem.isWorkshopBrewery && hasSupplyBrew);
        const isStockedPasture = Boolean(bItem.isAnimalPasturePlot && b.pastureAnimalId);
        const isOrchardGarden =
          bItem.id === 'burrow_apple_orchard' ||
          bItem.id === 'burrow_flower_garden' ||
          Boolean(bItem.isFarmlandPlot && b.cropId);
        const isFestiveDecor =
          bItem.id.startsWith('yule_') ||
          bItem.id === 'halloween_arch' ||
          bItem.id === 'burrow_feast_marquee';
        if (!isActiveWs && !isStockedPasture && !isOrchardGarden && !isFestiveDecor) continue;
        const bIso = worldIso(b.gx + 0.5, b.gy + 0.5, rot);
        const dist = Math.hypot(cam.x - bIso.wx, cam.y - bIso.wy);
        if (isActiveWs && dist < activeWorkshopDistPx) activeWorkshopDistPx = dist;
        if (isStockedPasture && dist < pastureDistPx) pastureDistPx = dist;
        if (isOrchardGarden && dist < orchardDistPx) orchardDistPx = dist;
        if (isFestiveDecor && dist < festiveDistPx) festiveDistPx = dist;
      }
      audio.updateSoundscape(
        effectiveSoundDt,
        period === 'night' || period === 'dusk',
        cam.zoom,
        nearStation,
        curWeather.kind,
        sim.getActiveFestival() !== 'none',
        period,
        { waterDistPx, activeWorkshopDistPx, pastureDistPx, orchardDistPx, festiveDistPx }
      );
    }

    // Pause background world canvas completely behind fullscreen minigame halls,
    // and throttle to ~12fps behind smaller modal dialogs so UI & minigames stay silky-smooth.
    const shouldRenderWorld =
      !cachedFullscreenModalOpen && (!cachedAnyDialogOpen || now - lastWorldRenderMs >= 80);

    if (shouldRenderWorld) {
      lastWorldRenderMs = now;
      const effectiveHoverTile = hud.pendingTouchTile
        ? { gx: hud.pendingTouchTile.gx, gy: hud.pendingTouchTile.gy }
        : hoverTile;

      renderer.activeSeedBrushCropId = hud.activeSeedCropId;
      renderer.activePastureBrushAnimalId = hud.activePastureAnimalId;

      if (directGpuSettings) {
        const wantWebgl2 =
          !gpuInitFailed &&
          Boolean(gpuWorldRenderer && !gpuWorldRenderer.gpuDevice.contextLost) &&
          (sim.state.settings.rendererMode ?? 'webgl2') !== 'canvas';
        const nextMode = wantWebgl2 ? 'webgl2' : 'canvas';
        if (directGpuSettings.mode !== nextMode) {
          directGpuSettings.mode = nextMode;
          if (directGpuCanvas) {
            directGpuCanvas.style.display = wantWebgl2 ? 'block' : 'none';
          }
          if (wantWebgl2) {
            canvas.style.position = 'relative';
            canvas.style.zIndex = '1';
            canvas.style.background = 'transparent';
          } else {
            canvas.style.position = '';
            canvas.style.zIndex = '';
            canvas.style.background = '';
          }
        }
      }

      const activeGpuSettings = directGpuSettings;
      const gpuMode =
        gpuWorldRenderer && !gpuWorldRenderer.gpuDevice.contextLost
          ? (activeGpuSettings?.mode ?? 'canvas')
          : 'canvas';
      const selectedBuildingUid =
        hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null;
      if (gpuMode !== 'webgl2') {
        renderer.render(
          sim,
          cam,
          effectiveHoverTile,
          hud.selectedCatalogItem,
          hud.rotation,
          hud.bulldozerActive,
          selectedBuildingUid,
          hud.movingBuildingUid,
          hud.pincerPicked?.label ?? null
        );
      }

      if (gpuWorldRenderer && activeGpuSettings && !gpuWorldRenderer.gpuDevice.contextLost) {
        if (gpuMode !== 'canvas') {
          if (gpuPointerClient.moved && !cachedAnyDialogOpen) {
            const viewW = Math.max(1, window.innerWidth);
            const viewH = Math.max(1, window.innerHeight);
            const invZoom = 1 / Math.max(0.15, cam.zoom);
            ptrWorldScratch.wx = (gpuPointerClient.x - viewW * 0.5) * invZoom + cam.x;
            ptrWorldScratch.wy = (gpuPointerClient.y - viewH * 0.5) * invZoom + cam.y;
            ptrWorldScratch.active = true;
          } else {
            ptrWorldScratch.active = false;
          }
          gpuWorldRenderer.renderFrame(
            sim,
            cam,
            activeGpuSettings,
            ptrWorldScratch,
            Date.now(),
            {
              hoverTile: effectiveHoverTile,
              selectedCatalogItem: hud.selectedCatalogItem,
              rotation: hud.rotation,
              bulldozerActive: hud.bulldozerActive,
              selectedBuildingUid,
              movingBuildingUid: hud.movingBuildingUid,
              hotspotsOut: gpuMode === 'webgl2' ? renderer.hotspots : undefined,
              skipReadyBubbleSprites: gpuMode === 'webgl2',
            }
          );
          if (gpuMode === 'webgl2') {
            renderer.renderWorldUiOverlays(
              sim,
              cam,
              selectedBuildingUid,
              hud.movingBuildingUid,
              Boolean(hud.movingBuildingUid || hud.selectedCatalogItem || hud.bulldozerActive),
              true,
              effectiveHoverTile,
              hud.selectedCatalogItem,
              hud.rotation,
              hud.bulldozerActive,
              hud.pincerPicked?.label ?? null
            );
          }
        }
      }

      if (longPressMove) {
        const heldMs = now - longPressMove.startMs;
        if (heldMs >= 95) {
          const prog = Math.max(0, Math.min(1, (heldMs - 95) / (LONG_PRESS_MOVE_MS - 95)));
          const overlayCtx = renderer.ctx;
          const dpr = window.devicePixelRatio || 1;
          overlayCtx.save();
          overlayCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          overlayCtx.beginPath();
          overlayCtx.arc(longPressMove.sx, longPressMove.sy - 18, 17, 0, Math.PI * 2);
          overlayCtx.strokeStyle = 'rgba(36, 23, 19, 0.52)';
          overlayCtx.lineWidth = 5;
          overlayCtx.stroke();
          overlayCtx.beginPath();
          overlayCtx.arc(
            longPressMove.sx,
            longPressMove.sy - 18,
            17,
            -Math.PI * 0.5,
            -Math.PI * 0.5 + Math.PI * 2 * prog
          );
          overlayCtx.strokeStyle = '#fde047';
          overlayCtx.lineCap = 'round';
          overlayCtx.lineWidth = 3.5;
          overlayCtx.stroke();
          overlayCtx.restore();
        }
      }

      minimapFrame++;
      if (
        !cachedAnyDialogOpen &&
        minimapFrame % 6 === 0 &&
        !hud.photoModeActive &&
        !hud.minimapCollapsed &&
        minimapWrapEl &&
        !minimapWrapEl.classList.contains('hidden') &&
        !hud.minimapCanvas.classList.contains('hidden')
      ) {
        renderer.renderMinimap(hud.minimapCanvas, sim, cam);
      }
    }

    mainRafId = requestAnimationFrame(frame);
  }

  mainRafId = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (mainRafId) {
        cancelAnimationFrame(mainRafId);
        mainRafId = 0;
      }
      // phones rarely fire beforeunload: save as the page hides
      sim.saveToStorage();
      void flushFarmSave();
      audio.pause();
    } else {
      lastTime = performance.now();
      audio.resume();
      if (!mainRafId) {
        mainRafId = requestAnimationFrame(frame);
      }
    }
  });

  const saveNow = () => { sim.saveToStorage(); void flushFarmSave(); };
  window.addEventListener('pagehide', saveNow);
  window.addEventListener('beforeunload', saveNow);

}

function showStop(title: string, text: string): void {
  const box = document.createElement('div');
  box.className = 'hpvn-stop';
  box.innerHTML = '<div><h2></h2><p></p><button type="button">Tải lại</button></div>';
  box.querySelector('h2')!.textContent = title;
  box.querySelector('p')!.textContent = text;
  box.querySelector('button')!.addEventListener('click', () => window.location.reload());
  document.body.appendChild(box);
}

bootstrap().catch((err) => {
  console.error('Lỗi khởi động Trang Trại Hang Sóc:', err);
  if ((err as { hpvn?: boolean })?.hpvn) showStop('Cần mở game từ HPVN', (err as Error).message);
  else showStop('Chưa tải được trang trại', 'Máy chủ HPVN chưa trả lời. Kiểm tra mạng rồi tải lại.');
});

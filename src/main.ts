import './styles/main.css';
import { getCatalogItem } from './data/catalog';
import { getLevelInfo } from './data/levels';
import { TUTORIAL_STEPS } from './data/quests';
import { MagicalAudio } from './engine/audio';
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
import {
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  ParkSimulation,
} from './sim/simulation';
import {
  ACTIVE_MINIGAME_RESUME_KEY,
  ActiveMinigameResumeRecord,
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
import { SAVE_KEY } from './ui/cloudSave';
import { haptic } from './ui/haptics';
import { GameHUD } from './ui/hud';
import { installPrompt } from './ui/installPrompt';
import onlineServices from './ui/onlineBootstrap';
import {
  GamepadController,
  RADIAL_QUICK_SLICES,
  RadialQuickActionId,
} from './ui/platformAndA11y';
import {
  createRollbackSaveBackup,
  ProductionTelemetryCollector,
} from './ui/productionShip';

function isDragPaintableItem(item: CatalogItem): boolean {
  return (
    item.category === 'path' ||
    item.category === 'terrain' ||
    Boolean(item.isCoasterTrackPiece) ||
    Boolean(item.isZooFence) ||
    Boolean(item.isFarmlandPlot) ||
    Boolean(item.connectableGroup)
  );
}

function isRepeatableCatalogItem(item: CatalogItem): boolean {
  return isDragPaintableItem(item) || item.category === 'decor';
}

async function bootstrap(): Promise<void> {
  const app = document.getElementById('app')!;
  // Thu dọn hộp hướng dẫn "mở file sai cách" (index.html) nếu game kịp mount sau khi nó hiện ra
  const fileOpenHelp = document.getElementById('hangsoc-file-open-help');
  if (fileOpenHelp) fileOpenHelp.remove();
  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.setAttribute('aria-label', 'Bản đồ 2.5D Trang Trại Hang Sóc & Thung Lũng Hogsmeade');
  app.appendChild(canvas);

  const audio = new MagicalAudio();
  const sprites = new SpriteRegistry();
  await sprites.loadAll();

  const sim = new ParkSimulation(audio);
  const cam: Camera = { x: 0, y: 0, zoom: 0.82, viewRot: 0 };
  centerCameraOnGrid(cam, 18.0, 24.5);

  const renderer = new IsometricRenderer(canvas, sprites);
  const hud = new GameHUD(app, sim, cam, canvas, sprites);

  // Initialize PWA install prompt & accessibility system
  installPrompt.init();
  accessibility.init(sim);

  // URL preview parameters for instant visual verification or sharing
  const params = new URLSearchParams(window.location.search);
  const isSandboxAllowed = IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed();
  const hasExplicitCamParam = Boolean(
    (isSandboxAllowed && params.get('preview') === '100') ||
      params.get('visit') ||
      params.get('tour') ||
      (isSandboxAllowed && (params.get('zoom') || params.get('cx') || params.get('cy'))) ||
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
  hud.onCameraJump = () => {
    introGlide = null;
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

  if (IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed() && params.get('preview') === '100') {
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
  if (IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()) {
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
    if (tstepParam !== null) {
      const idx = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, Number(tstepParam) || 0));
      const tut = sim.ensureTutorialState();
      tut.active = true;
      delete tut.completedAt;
      tut.skipped = false;
      tut.stepIndex = idx;
      tut.stepId = TUTORIAL_STEPS[idx].id;
      tut.pastureHarvestedInStep3 = false;
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
  }
  if (params.get('ridecam') === '1') {
    const coasterB = sim.state.buildings.find((b) => getCatalogItem(b.itemId)?.isCustomCoasterStation);
    if (coasterB) {
      hud.rideCamUid = coasterB.uid;
    }
  }
  const dlgParam = params.get('dialog');
  if (dlgParam === 'album') {
    (document.getElementById('btnOpenAlbum') as HTMLButtonElement | null)?.click();
  } else if (dlgParam === 'finance') {
    (document.getElementById('btnOpenFinance') as HTMLButtonElement | null)?.click();
  } else if (dlgParam === 'orders' || dlgParam === 'quests') {
    (document.getElementById('btnOpenQuests') as HTMLButtonElement | null)?.click();
  } else if (dlgParam === 'barn') {
    hud.openWorkshopDialog('barn');
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
      (params.get('tab') as 'barn' | 'brew' | 'cargo' | 'synergy' | null) ?? 'barn';
    hud.openWorkshopDialog(tabParam);
  } else if (dlgParam === 'suitcase') {
    const tabParam = (params.get('tab') as 'care' | 'morph' | 'expedition' | null) ?? 'care';
    hud.openSuitcaseDialog(tabParam);
  } else if (dlgParam === 'match3') {
    const m3LvParam = Number(params.get('m3level') || 0);
    const maxAllowedM3 = isSandboxAllowed
      ? 777
      : Math.min(777, (sim.state.match3.maxClearedLevel ?? 0) + 1);
    const safeM3Lv =
      isSandboxAllowed && Number.isFinite(m3LvParam) && m3LvParam >= 1
        ? Math.min(maxAllowedM3, Math.floor(m3LvParam))
        : undefined;
    const allowDevJump = Boolean(
      isSandboxAllowed && safeM3Lv && safeM3Lv > (sim.state.match3.maxClearedLevel ?? 0) + 1
    );
    hud.openMatch3Dialog(safeM3Lv, allowDevJump);
  } else if (
    dlgParam === 'puzzle' ||
    dlgParam === 'caro' ||
    dlgParam === 'sudoku' ||
    dlgParam === 'chess' ||
    dlgParam === 'blocks' ||
    dlgParam === 'jigsaw' ||
    dlgParam === 'pikachu' ||
    dlgParam === 'onet'
  ) {
    const rawPmode = dlgParam === 'puzzle' ? params.get('pmode') : dlgParam;
    const pmode = rawPmode === 'pikachu' || rawPmode === 'onet' ? 'blocks' : rawPmode;
    const validMode: PuzzleArcadeMode | undefined =
      pmode === 'caro' ||
      pmode === 'sudoku' ||
      pmode === 'chess' ||
      pmode === 'blocks' ||
      pmode === 'jigsaw'
        ? pmode
        : undefined;
    hud.openPuzzleArcadeDialog(validMode);
  } else if (dlgParam === 'neighbors' || dlgParam === 'friends') {
    hud.openNeighborDialog();
  } else if (dlgParam === 'feast') {
    hud.openHarvestFeastDialog();
  } else if (dlgParam === 'leaderboard') {
    const rawGame = params.get('lbgame');
    const validGame: LeaderboardGameId | undefined =
      rawGame === 'match3' ||
      rawGame === 'caro' ||
      rawGame === 'sudoku' ||
      rawGame === 'chess' ||
      rawGame === 'blocks' ||
      rawGame === 'jigsaw' ||
      rawGame === 'seedquiz'
        ? rawGame
        : undefined;
    const rawScope = params.get('lbscope');
    const validScope: LeaderboardScope | undefined =
      rawScope === 'valley' || rawScope === 'friends' || rawScope === 'personal'
        ? rawScope
        : undefined;
    hud.openLeaderboardDialog(validGame, validScope);
  } else if (!params.get('tour') && !params.get('visit') && !sim.isHeadmasterPreview) {
    try {
      const rawResume = localStorage.getItem(ACTIVE_MINIGAME_RESUME_KEY);
      if (rawResume) {
        const parsedResume = JSON.parse(rawResume) as Partial<ActiveMinigameResumeRecord>;
        const ageMs = Date.now() - Number(parsedResume.savedAt || 0);
        const pa = sim.state.puzzleArcade;
        if (ageMs >= 0 && ageMs <= 12 * 3600 * 1000) {
          if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'sudoku' &&
            pa.sudokuSession?.stage === pa.sudokuStage
          ) {
            hud.openPuzzleArcadeDialog('sudoku');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'caro' &&
            pa.caroSession?.stage === pa.caroStage
          ) {
            hud.openPuzzleArcadeDialog('caro');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'chess' &&
            pa.chessSession?.stage === pa.chessStage
          ) {
            hud.openPuzzleArcadeDialog('chess');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'blocks' &&
            pa.onetSession?.stage === pa.blockStage
          ) {
            hud.openPuzzleArcadeDialog('blocks');
          } else if (
            parsedResume.dialog === 'puzzleArcade' &&
            parsedResume.mode === 'jigsaw' &&
            pa.jigsawSession?.stage === pa.jigsawStage
          ) {
            hud.openPuzzleArcadeDialog('jigsaw');
          } else if (
            parsedResume.dialog === 'match3' &&
            sim.state.match3.activeSession?.levelId === sim.state.match3.currentLevel
          ) {
            hud.openMatch3Dialog();
          } else {
            localStorage.removeItem(ACTIVE_MINIGAME_RESUME_KEY);
          }
        } else {
          localStorage.removeItem(ACTIVE_MINIGAME_RESUME_KEY);
        }
      }
    } catch {
      // Ignore malformed storage entries
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
  onlineServices.bindSimulationGringottsWallet(sim, {
    onSnapshot: (snap) => hud.applyAuthoritativeSnapshot(snap),
    onToast: (msg, icon) => hud.showToast(msg, icon ?? '🏦'),
  });
  if (onlineServices.authoritativeClient.snapshot) {
    hud.applyAuthoritativeSnapshot(onlineServices.authoritativeClient.snapshot);
  }
  hud.refreshAll();

  window.addEventListener('hpvn:authoritative-snapshot', (ev) => {
    hud.applyAuthoritativeSnapshot((ev as CustomEvent).detail);
  });
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
  window.addEventListener('gamesave:updated', (ev) => {
    if (sim.isHeadmasterPreview || sim.isVisitingNeighbor) return;
    const detail = (ev as CustomEvent<{ saveJson?: string }>).detail;
    const rawSave =
      (typeof detail?.saveJson === 'string' && detail.saveJson) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem(SAVE_KEY) : null);
    if (!rawSave) return;
    if (!isSandboxRuntimeAllowed()) {
      try {
        const probe = JSON.parse(rawSave) as {
          sandboxMode?: boolean;
          sandboxTainted?: boolean;
          isHeadmasterPreview?: boolean;
        };
        if (
          probe &&
          (probe.sandboxMode === true ||
            probe.sandboxTainted === true ||
            probe.isHeadmasterPreview === true)
        ) {
          return;
        }
      } catch {
        return;
      }
    }
    createRollbackSaveBackup(sim.state);
    if (sim.importSaveJson(rawSave)) {
      if (onlineServices.authoritativeClient.snapshot) {
        hud.applyAuthoritativeSnapshot(onlineServices.authoritativeClient.snapshot);
      }
      hud.match3Modal?.resetSession();
      hud.puzzleArcadeModal?.resetSession();
      hud.refreshAll();
      accessibility.refresh();
      hud.showToast('☁️ Đã đồng bộ thung lũng từ máy chủ HPVN!', '☁️');
    }
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

  sim.onTutorialStepChanged = () => {
    hud.panCameraToTutorialTarget();
  };
  sim.onUiChange = () => {
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
    const pt = gridToScreen(info.gx, info.gy, cam, canvas.clientWidth, canvas.clientHeight, 36);
    renderer.triggerRibbonUnveilPop(info.uid, pt.sx, pt.sy);
    hud.showRibbonUnveilBanner(info);
    haptic('levelup');
  };
  sim.onRewardFly = (kind, amount, gx, gy) => {
    if (typeof gx === 'number' && typeof gy === 'number') {
      const pt = gridToScreen(gx, gy, cam, canvas.clientWidth, canvas.clientHeight, 32);
      hud.spawnFlyReward(kind, amount, pt.sx, pt.sy);
    } else {
      hud.spawnFlyReward(kind, amount);
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
      ? ` — Mở bản vẽ mới: ${unlockedNames}!`
      : info.milestoneNote
        ? ` — ${info.milestoneNote}`
        : '';
    hud.showToast(`🎉 Đạt Cấp Giải Đố ${lv}! (+${info.rewardGalleons}🪙)${unlockTag}`, '🌟');
    hud.refreshAll();
  };

  const offlineReport = sim.processOfflineProgress();
  if (offlineReport) {
    hud.showOfflineModal(offlineReport);
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
  let isSowingSeeds = false;
  let isStockingPastures = false;
  let lastSeedWarnAt = 0;
  let lastPastureWarnAt = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let camStartX = 0;
  let camStartY = 0;

  const trySowPlotAt = (gx: number, gy: number, sx: number, sy: number): boolean => {
    const seedCropId = hud.activeSeedCropId;
    if (!seedCropId) return false;
    let uid = sim.grid[gy]?.[gx]?.buildingUid ?? null;
    if (!uid) {
      for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
        const hs = renderer.hotspots[i];
        if (hs.kind === 'building' && Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius) {
          uid = hs.id;
          break;
        }
      }
    }
    if (!uid) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || b.cropId || Date.now() < b.constructEndsAt) return false;
    const it = getCatalogItem(b.itemId);
    if (!it?.isFarmlandPlot) return false;

    const res = sim.plantCropOnPlot(b.uid, seedCropId);
    if (!res.ok) {
      if (res.needSeedAcquire) {
        isSowingSeeds = false;
        isPointerDown = false;
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
    if (hud.seedTrayOpen) {
      hud.seedTrayOpen = false;
      hud.renderSeedTray();
      hud.refreshFloatingBanner();
    }
    return true;
  };

  const tryStockPastureAt = (gx: number, gy: number, sx: number, sy: number): boolean => {
    const animalId = hud.activePastureAnimalId;
    if (!animalId) return false;
    let uid = sim.grid[gy]?.[gx]?.buildingUid ?? null;
    if (!uid) {
      for (let i = renderer.hotspots.length - 1; i >= 0; i--) {
        const hs = renderer.hotspots[i];
        if (hs.kind === 'building' && Math.hypot(sx - hs.sx, sy - hs.sy) <= hs.radius) {
          uid = hs.id;
          break;
        }
      }
    }
    if (!uid) return false;
    const b = sim.state.buildings.find((x) => x.uid === uid);
    if (!b || b.pastureAnimalId || Date.now() < b.constructEndsAt) return false;
    const it = getCatalogItem(b.itemId);
    if (!it?.isAnimalPasturePlot) return false;

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

  // Wire Touch Placement Confirm Bar callbacks
  hud.onTouchConfirmPlace = () => {
    if (!hud.pendingTouchTile) return;
    const { gx, gy } = hud.pendingTouchTile;
    if (hud.moveModeActive && hud.movingBuildingUid) {
      const res = sim.moveBuilding(hud.movingBuildingUid, gx, gy, hud.rotation);
      if (!res.ok) {
        hud.showToast(res.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      hud.movingBuildingUid = null;
      hud.moveModeActive = false;
      hud.pendingTouchTile = null;
      hud.refreshAll();
      return;
    }
    if (hud.selectedCatalogItem) {
      const placedItem = hud.selectedCatalogItem;
      const check = sim.canPlaceItem(placedItem, gx, gy, hud.rotation);
      if (!check.ok) {
        hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      sim.placeItem(placedItem, gx, gy, hud.rotation);
      hud.pendingTouchTile = null;
      if (!isRepeatableCatalogItem(placedItem)) {
        hud.selectedCatalogItem = null;
      }
      hud.refreshAll();
    }
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
      cancelPendingTouchPaint();
      isPaintingTiles = false;
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
      hoverTile = { gx: gPos.gx, gy: gPos.gy };
    }

    if (!isPointerDown) return;

    if (
      pendingTouchPaint &&
      activePointers.size === 1 &&
      Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 8
    ) {
      const first = pendingTouchPaint;
      cancelPendingTouchPaint();
      isPaintingTiles = true;
      sim.placeItem(first.item, first.gx, first.gy, first.rot);
    }

    if (isPaintingTiles && hud.selectedCatalogItem) {
      sim.placeItem(hud.selectedCatalogItem, gPos.gx, gPos.gy, hud.rotation);
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

    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;
    if (Math.hypot(dx, dy) > 5) {
      isDraggingCam = true;
      hud.rideCamUid = null;
    }
    if (isDraggingCam) {
      introGlide = null;
      cam.x = camStartX - dx / cam.zoom;
      cam.y = camStartY - dy / cam.zoom;
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.size >= 2) {
      cancelPendingTouchPaint();
      const pts = Array.from(activePointers.values());
      prevPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      wasPinching = true;
      isPaintingTiles = false;
      return;
    }

    if (e.button !== 0 && e.button !== 2) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const gPos = screenToGrid(sx, sy, cam, rect.width, rect.height, sim.grid);
    if (!hud.pendingTouchTile) {
      hoverTile = { gx: gPos.gx, gy: gPos.gy };
    }

    isPointerDown = true;
    isDraggingCam = false;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    camStartX = cam.x;
    camStartY = cam.y;

    const item = hud.selectedCatalogItem;
    if (e.button === 0 && item && isDragPaintableItem(item) && !hud.hasOpenFloatingTray()) {
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
              sim.placeItem(item, gPos.gx, gPos.gy, rotSnap);
            }
          }, 75),
        };
      } else {
        isPaintingTiles = true;
        sim.placeItem(item, gPos.gx, gPos.gy, hud.rotation);
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
    clearPointer(e.pointerId);
    isPointerDown = false;
    isDraggingCam = false;
    isPaintingTiles = false;
    isSowingSeeds = false;
    isStockingPastures = false;
    wasPinching = false;
  });

  window.addEventListener('pointerup', (e) => {
    clearPointer(e.pointerId);
    if (wasPinching) {
      cancelPendingTouchPaint();
      if (activePointers.size === 0) {
        wasPinching = false;
        isPointerDown = false;
        isDraggingCam = false;
        isSowingSeeds = false;
        isStockingPastures = false;
      }
      return;
    }

    if (!isPointerDown) return;
    let flushedTouchPaint = false;
    if (pendingTouchPaint && !isDraggingCam && e.target === canvas) {
      const first = pendingTouchPaint;
      cancelPendingTouchPaint();
      sim.placeItem(first.item, first.gx, first.gy, first.rot);
      flushedTouchPaint = true;
    } else {
      cancelPendingTouchPaint();
    }

    const wasDragging = isDraggingCam;
    const wasPainting = isPaintingTiles || flushedTouchPaint || isSowingSeeds || isStockingPastures;
    isPointerDown = false;
    isDraggingCam = false;
    isPaintingTiles = false;
    isSowingSeeds = false;
    isStockingPastures = false;

    if (wasDragging || wasPainting) return;

    // Right click cancels active build / move / pincer / bulldoze / seed brush / inspector cleanly
    if (e.button === 2) {
      hud.selectedCatalogItem = null;
      hud.bulldozerActive = false;
      hud.moveModeActive = false;
      hud.movingBuildingUid = null;
      hud.pincerActive = false;
      hud.pincerPicked = null;
      hud.closeSeedTray();
      hud.closePastureTray();
      hud.collapseBuildDock();
      hud.closeHudPopovers();
      hud.pendingTouchTile = null;
      hud.inspectSelection = null;
      hud.refreshAll();
      return;
    }

    if (e.target !== canvas) return;
    const prevPendingSowPlotUid = hud.pendingSowPlotUid;
    const prevPendingStockPastureUid = hud.pendingStockPastureUid;
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
      hud.pincerPicked = null;
      hud.pincerActive = false;
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
      sim.removeAtTile(bGx, bGy);
      return;
    }

    // 2. Move Building Mode (Pick up -> Relocate for 0G!)
    if (hud.moveModeActive) {
      if (hud.movingBuildingUid) {
        if (
          isTouch &&
          (!hud.pendingTouchTile ||
            hud.pendingTouchTile.gx !== gPos.gx ||
            hud.pendingTouchTile.gy !== gPos.gy)
        ) {
          const mb = sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
          const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
          hoverTile = { gx: gPos.gx, gy: gPos.gy };
          hud.pendingTouchTile = {
            gx: gPos.gx,
            gy: gPos.gy,
            label: mIt?.name ?? 'Dời công trình',
          };
          hud.refreshTouchConfirmBar();
          return;
        }
        const res = sim.moveBuilding(hud.movingBuildingUid, gPos.gx, gPos.gy, hud.rotation);
        if (!res.ok) {
          hud.showToast(res.reason ?? 'Không thể đặt tại ô này!', '⚠️');
          return;
        }
        hud.movingBuildingUid = null;
        hud.moveModeActive = false;
        hud.pendingTouchTile = null;
        hud.refreshAll();
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
          hud.refreshFloatingBanner();
          const it = getCatalogItem(b.itemId);
          hud.showToast(`Đã nhấc "${it?.name ?? 'công trình'}" — Nhấp ô mới để hạ xuống (Phím R xoay)!`, '✋');
          return;
        }
      }
    }

    // 3. Active building placement mode
    if (hud.selectedCatalogItem) {
      const placedItem = hud.selectedCatalogItem;
      if (
        isTouch &&
        !isDragPaintableItem(placedItem) &&
        (!hud.pendingTouchTile ||
          hud.pendingTouchTile.gx !== gPos.gx ||
          hud.pendingTouchTile.gy !== gPos.gy)
      ) {
        hoverTile = { gx: gPos.gx, gy: gPos.gy };
        hud.pendingTouchTile = {
          gx: gPos.gx,
          gy: gPos.gy,
          label: placedItem.name,
        };
        hud.refreshTouchConfirmBar();
        return;
      }
      const check = sim.canPlaceItem(placedItem, gPos.gx, gPos.gy, hud.rotation);
      if (!check.ok) {
        hud.showToast(check.reason ?? 'Không thể đặt tại ô này!', '⚠️');
        return;
      }
      sim.placeItem(placedItem, gPos.gx, gPos.gy, hud.rotation);
      hud.pendingTouchTile = null;
      if (!isRepeatableCatalogItem(placedItem)) {
        hud.selectedCatalogItem = null;
      }
      hud.refreshAll();
      return;
    }

    // 4. Normal click: check screen hotspots in priority order (front-to-back + pixel alpha hitmask)
    for (const kind of [
      'owl_post',
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
          const padFallback = hs.kind === 'building' && d <= hs.radius * 0.5;
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
        if (best.kind === 'building') {
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
            if (b.itemId === 'burrow_honeydukes_canon') {
              hud.closeSeedTray();
              hud.inspectSelection = null;
              hud.refreshAll();
              hud.openMatch3Dialog();
              return;
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
                const sowRes = sim.plantCropOnPlot(b.uid, hud.activeSeedCropId);
                if (sowRes.needSeedAcquire) {
                  hud.inspectSelection = null;
                  hud.refreshAll();
                  hud.openSeedQuizDialog(hud.activeSeedCropId, b.uid);
                  return;
                }
                hud.showToast(sowRes.msg, sowRes.ok ? '🌱' : '🪙');
                hud.inspectSelection = null;
                hud.refreshAll();
              } else if (prevPendingSowPlotUid === b.uid) {
                hud.inspectSelection = null;
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
                hud.inspectSelection = null;
                hud.refreshAll();
              } else {
                hud.openPastureTray(undefined, b.uid);
              }
              return;
            } else if (b.storedGalleons > 0 || (b.readyFarmGoods && b.readyFarmGoods.length > 0)) {
              sim.harvestBuildingBubble(b.uid);
            }
          }
          hud.closeSeedTray();
          hud.closePastureTray();
          hud.inspectSelection = { kind: 'building', uid: best.id };
          hud.refreshAll();
          return;
        }
      }
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
  const gamepad = new GamepadController();
  const telemetry = new ProductionTelemetryCollector();
  createRollbackSaveBackup(sim.state);

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
  let cachedFullscreenModalOpen = false;
  let cachedAnyDialogOpen = false;
  const syncOpenDialogFlags = (): void => {
    cachedFullscreenModalOpen = Boolean(
      match3DlgEl?.open || puzzleArcadeDlgEl?.open || seedQuizDlgEl?.open
    );
    cachedAnyDialogOpen =
      cachedFullscreenModalOpen || allModalDialogs.some((d) => d.open);
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

  function frame(now: number): void {
    mainRafId = 0;
    if (document.hidden) {
      lastTime = now;
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
    }

    const panSpeed = (340 / cam.zoom) * Math.min(0.05, dt);
    if (keysPressed.size > 0 && cachedAnyDialogOpen) {
      keysPressed.clear();
    }
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

    sim.update(dt);

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

    // Symphonic Celesta BGM & Spatial Weather Soundscape
    const period = sim.getRealTimePeriod();
    const curWeather = sim.getCurrentWeather();
    const stationWorld = worldIso(3, 17, cam.viewRot ?? 0);
    const nearStation = Math.hypot(cam.x - stationWorld.wx, cam.y - stationWorld.wy) < 420;
    audio.updateSoundscape(
      Math.min(0.1, dt),
      period === 'night' || period === 'dusk',
      cam.zoom,
      nearStation,
      curWeather.kind,
      sim.getActiveFestival() !== 'none'
    );

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
      renderer.render(
        sim,
        cam,
        effectiveHoverTile,
        hud.selectedCatalogItem,
        hud.rotation,
        hud.bulldozerActive,
        hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null,
        hud.movingBuildingUid,
        hud.pincerPicked?.label ?? null
      );

      minimapFrame++;
      if (!cachedAnyDialogOpen && minimapFrame % 6 === 0 && !hud.photoModeActive) {
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
      sim.saveToStorage();
      audio.pause();
    } else {
      lastTime = performance.now();
      audio.resume();
      if (!mainRafId) {
        mainRafId = requestAnimationFrame(frame);
      }
    }
  });

  window.addEventListener('pagehide', () => {
    sim.saveToStorage();
  });

  window.addEventListener('beforeunload', () => {
    sim.saveToStorage();
  });

  window.addEventListener('hangsoc:before-sw-reload', () => {
    sim.saveToStorage();
  });

  // --- External Online-Prod & HPVN Host Shell Event Bus Bridge ---
  let lastHpvnStateSyncAt = 0;
  let lastHpvnSig = '';
  const previousUiChange = sim.onUiChange;
  sim.onUiChange = () => {
    previousUiChange?.();
    window.dispatchEvent(
      new CustomEvent('game:tick', {
        detail: {
          level: sim.state.level,
          galleons: sim.state.galleons,
        },
      })
    );
    const nowMs = Date.now();
    const sig = `${sim.state.level}|${sim.state.match3.stars}|${sim.state.unlockedZones.length}|${sim.state.buildings.length}|${sim.state.settings.weatherOverride}|${sim.state.settings.timeOverride}`;
    if (sig !== lastHpvnSig && nowMs - lastHpvnStateSyncAt >= 1200) {
      lastHpvnSig = sig;
      lastHpvnStateSyncAt = nowMs;
      window.dispatchEvent(
        new CustomEvent('hpvn:sync-state', {
          detail: {
            parkName: sim.state.parkName,
            level: sim.state.level,
            magicStars: sim.state.match3.stars,
            galleons: sim.state.galleons,
            unlockedZonesCount: sim.state.unlockedZones.length,
            buildingsCount: sim.state.buildings.length,
            weatherMode: sim.state.settings.weatherOverride,
            atmosphereMode:
              sim.state.settings.timeOverride === 'realtime'
                ? 'auto'
                : sim.state.settings.timeOverride,
          },
        })
      );
    }
  };

  window.addEventListener('hpvn:event', (ev: Event) => {
    if (sim.isVisitingNeighbor) return;
    const mode = String((ev as CustomEvent<{ mode?: string }>).detail?.mode || 'auto');
    if (
      mode === 'auto' ||
      mode === 'none' ||
      mode === 'halloween' ||
      mode === 'christmas' ||
      mode === 'quidditch_cup'
    ) {
      sim.state.settings.activeFestival = mode;
      sim.saveToStorage();
      hud.refreshAll();
    }
  });

  window.addEventListener('hpvn:mute', (ev: Event) => {
    const muted = Boolean((ev as CustomEvent<{ muted?: boolean }>).detail?.muted);
    sim.state.settings.soundEnabled = !muted;
    sim.state.settings.bgmEnabled = !muted;
    audio.enabled = !muted;
    audio.bgmEnabled = !muted;
    if (muted) {
      audio.pause();
    } else {
      audio.resume();
    }
    sim.saveToStorage();
    hud.refreshAll();
  });

  window.addEventListener('gamesave:helpers', (ev: Event) => {
    const detail = (
      ev as CustomEvent<{
        helpers?: Array<{
          id: string;
          uid: string;
          name: string;
          avatarEmoji?: string;
          kind?: 'water_crop' | 'tend_yard' | 'stoke_workshop';
          buildingUid?: string;
          noteText?: string;
          at: number;
        }>;
        summaryVi?: string;
      }>
    ).detail;
    if (!detail) return;
    const targetState = sim.homeStateWhileVisiting ?? sim.state;
    const social =
      targetState === sim.state
        ? sim.ensureNeighborSocial()
        : (targetState.neighborSocial ??= sim.ensureNeighborSocial());
    const seen = new Set(social.homeLanternMarks.map((m) => m.id));
    const fallbackUid = targetState.buildings[0]?.uid || 'burrow_main_gate';
    const nowMs = Date.now();
    const speedupMs = 15 * 60 * 1000;
    const minConstructFloorMs = 60 * 60 * 1000;
    let added = 0;
    for (const h of detail.helpers ?? []) {
      if (!h?.id || seen.has(h.id) || social.homeLanternMarks.length >= 5) continue;
      seen.add(h.id);
      const preferredTarget = h.buildingUid
        ? targetState.buildings.find((b) => b.uid === h.buildingUid)
        : undefined;
      const activeTimerBuilding =
        (preferredTarget &&
        ((preferredTarget.cropReadyAt ?? 0) > nowMs ||
          (preferredTarget.pastureReadyAt ?? 0) > nowMs ||
          (preferredTarget.workshopQueue?.[0]?.endsAt ?? 0) > nowMs ||
          (preferredTarget.constructEndsAt ?? 0) > nowMs)
          ? preferredTarget
          : undefined) ??
        targetState.buildings.find(
          (b) =>
            (b.cropReadyAt ?? 0) > nowMs ||
            (b.pastureReadyAt ?? 0) > nowMs ||
            (b.workshopQueue?.[0]?.endsAt ?? 0) > nowMs ||
            (b.constructEndsAt ?? 0) > nowMs
        );

      if (activeTimerBuilding) {
        if ((activeTimerBuilding.cropReadyAt ?? 0) > nowMs) {
          activeTimerBuilding.cropReadyAt = Math.max(
            nowMs,
            (activeTimerBuilding.cropReadyAt ?? nowMs) - speedupMs
          );
          activeTimerBuilding.cropWateredBoost = true;
        } else if ((activeTimerBuilding.pastureReadyAt ?? 0) > nowMs) {
          activeTimerBuilding.pastureReadyAt = Math.max(
            nowMs,
            (activeTimerBuilding.pastureReadyAt ?? nowMs) - speedupMs
          );
        } else if ((activeTimerBuilding.workshopQueue?.[0]?.endsAt ?? 0) > nowMs) {
          for (const slot of activeTimerBuilding.workshopQueue ?? []) {
            slot.startedAt -= speedupMs;
            slot.endsAt = Math.max(nowMs, slot.endsAt - speedupMs);
          }
        } else if ((activeTimerBuilding.constructEndsAt ?? 0) > nowMs + minConstructFloorMs) {
          activeTimerBuilding.constructEndsAt = Math.max(
            nowMs + minConstructFloorMs,
            (activeTimerBuilding.constructEndsAt ?? nowMs) - speedupMs
          );
        }
      }

      social.homeLanternMarks.push({
        id: h.id,
        buildingUid: activeTimerBuilding?.uid || h.buildingUid || fallbackUid,
        helperId: h.uid,
        helperName: h.name || 'Hàng Xóm Hang Sóc',
        helperEmoji: h.avatarEmoji || '🧙‍♂️',
        kind: h.kind || 'water_crop',
        noteVi: h.noteText || 'Đã sang chăm giúp thung lũng của bạn!',
        createdAt: h.at || nowMs,
      });
      added++;
    }
    if (added > 0) {
      sim.saveToStorage();
      hud.refreshAll();
      if (detail.summaryVi) {
        hud.showToast(detail.summaryVi, '🏮');
      }
    }
  });

  window.addEventListener('gamesave:server-meta', (ev) => {
    const detail = (
      ev as CustomEvent<{
        dayKey?: string;
        dailyGardenHelpsCount?: number;
      }>
    ).detail;
    if (!detail) return;
    const targetState = sim.homeStateWhileVisiting ?? sim.state;
    const social =
      targetState === sim.state
        ? sim.ensureNeighborSocial()
        : (targetState.neighborSocial ??= sim.ensureNeighborSocial());
    if (typeof detail.dayKey === 'string' && detail.dayKey) {
      social.lastSocialResetKey = detail.dayKey;
    }
    if (
      typeof detail.dailyGardenHelpsCount === 'number' &&
      detail.dailyGardenHelpsCount > (social.dailyGardenHelpsCount ?? 0)
    ) {
      social.dailyGardenHelpsCount = detail.dailyGardenHelpsCount;
    }
  });
}

bootstrap().catch((err) => {
  console.error('Lỗi khởi động Trang Trại Hang Sóc:', err);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;background:#241912;color:#fff6dc;font-family:'Be Vietnam Pro',sans-serif;text-align:center;gap:12px;">
        <h2 style="margin:0;font-family:'Playfair Display',serif;color:#fde047;">Đang làm mới dữ liệu Thung Lũng Hang Sóc…</h2>
        <p style="margin:0;max-width:460px;line-height:1.5;opacity:0.9;">Bộ nhớ đệm trình duyệt vừa được cập nhật phiên bản mới. Hãy nhấn nút bên dưới để tải lại trang.</p>
        <button id="btnRecoverReload" style="padding:10px 20px;border-radius:999px;border:2px solid #f5b301;background:#b45309;color:#fff6dc;font-weight:700;cursor:pointer;">Tải lại ngay</button>
      </div>
    `;
    document.getElementById('btnRecoverReload')?.addEventListener('click', async () => {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations().catch(() => []);
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys().catch(() => []);
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      window.location.reload();
    });
  }
});

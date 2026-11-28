import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  // HPVN Game Zone: served under /game/trang-trai-hang-soc/ (play page = /play)
  base: '/game/trang-trai-hang-soc/',
  optimizeDeps: {
    exclude: ['input-switch-polyfill'],
  },
  plugins: [
    {
      name: 'redirect-root-to-base',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url?.startsWith('/?')) {
            const qIndex = req.url.indexOf('?');
            const search = qIndex >= 0 ? req.url.slice(qIndex) : '';
            res.statusCode = 302;
            res.setHeader('Location', `/game/trang-trai-hang-soc/${search}`);
            res.end();
            return;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url?.startsWith('/?')) {
            const qIndex = req.url.indexOf('?');
            const search = qIndex >= 0 ? req.url.slice(qIndex) : '';
            res.statusCode = 302;
            res.setHeader('Location', `/game/trang-trai-hang-soc/${search}`);
            res.end();
            return;
          }
          next();
        });
      },
    },
    {
      name: 'inline-input-switch-polyfill-css',
      transform(code, id) {
        if (!id.includes('input-switch-polyfill') || !id.endsWith('.js')) return null;
        const cssPath = path.resolve(path.dirname(id.split('?')[0]), 'input-switch-polyfill.css');
        if (!fs.existsSync(cssPath)) return null;
        const cssText = fs.readFileSync(cssPath, 'utf8');
        return code.replace(
          /fetch\(import\.meta\.resolve\(['"]\.\/input-switch-polyfill\.css['"]\)\)\s*\.then\(\(r\)\s*=>\s*r\.text\(\)\)/,
          `Promise.resolve(${JSON.stringify(cssText)})`
        );
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cache-Control': 'no-cache, max-age=0, must-revalidate',
    },
  },
  build: {
    target: ['es2020', 'safari16'],
    cssTarget: 'safari16',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('pixi.js') ||
              id.includes('@pixi/') ||
              id.includes('/earcut/') ||
              id.includes('/eventemitter3/') ||
              id.includes('/ismobilejs/') ||
              id.includes('/@xmldom/')
            ) {
              return 'vendor-pixi';
            }
            return 'vendor';
          }
          if (id.includes('/src/data/quizPacks/')) {
            if (id.includes('/packHelper')) return 'quiz-shared';
            const m = id.match(/\/quizPacks\/([a-z]{2})(?:Expanded)?\./);
            if (m) return `quiz-${m[1]}`;
          }
          if (
            id.includes('/src/sim/puzzleArcadeEngine') ||
            id.includes('/src/sim/blocksEngine') ||
            id.includes('/src/sim/sudokuEngine') ||
            id.includes('/src/sim/caroEngine') ||
            id.includes('/src/sim/chessPresets') ||
            id.includes('/src/sim/chessEngine') ||
            id.includes('/src/sim/minesweeperEngine') ||
            id.includes('/src/sim/fishShooterEngine') ||
            id.includes('/src/sim/onetEngine') ||
            id.includes('/src/sim/jigsawEngine') ||
            id.includes('/src/sim/jigsawPaintingComposer') ||
            id.includes('/src/data/chessTacticsPack') ||
            id.includes('/src/sim/match3Engine') ||
            id.includes('/src/sim/candyHogwartsEngine') ||
            id.includes('/src/engine/candyHogwartsRenderer') ||
            id.includes('/src/data/candyHogwartsLevels') ||
            id.includes('/src/ui/match3Modal') ||
            id.includes('/src/ui/puzzleArcadeModal')
          ) {
            return;
          }
          if (id.includes('/src/hpvn/') && !id.includes('/src/hpvn/levelBar')) {
            return 'hpvn-platform';
          }
          if (
            id.includes('/src/ui/hudFarmAndWorkshop') ||
            id.includes('/src/ui/hudQuestsAndSettings') ||
            id.includes('/src/ui/hudSocialAndTutorial') ||
            id.includes('/src/ui/hudInspect') ||
            id.includes('/src/ui/hudHeaderAndDock') ||
            id.includes('/src/ui/hudShell') ||
            id.includes('/src/ui/hudShared')
          ) {
            return 'ui-hud';
          }
          if (id.includes('/src/data/')) {
            return 'game-data';
          }
          if (
            id.includes('/src/engine/audio') ||
            id.includes('/src/engine/bgmMood') ||
            id.includes('/src/engine/pathfinding') ||
            id.includes('/src/engine/isometric') ||
            id.includes('/src/sim/neighborSocial') ||
            id.includes('/src/sim/minigameLeaderboard') ||
            id.includes('/src/sim/proofOfPlay') ||
            id.includes('/src/sim/puzzleShared') ||
            id.includes('/src/sim/retentionAndNarrative') ||
            id.includes('/src/sim/roadsideStandAndEvents') ||
            id.includes('/src/sim/languageQuizEngine') ||
            id.includes('/src/sim/coaster') ||
            id.includes('/src/sim/zooAndBackstage') ||
            id.includes('/src/sim/economyIntegrity') ||
            id.includes('/src/sim/yuleEvent') ||
            id.includes('/src/sim/buildTransactions') ||
            id.includes('/src/sim/minigameSynergy') ||
            id.includes('/src/sim/hayDayFarming') ||
            id.includes('/src/sim/weeklyDerbyEngine') ||
            id.includes('/src/sim/bonusArcadeGames')
          ) {
            return 'sim-foundation';
          }
          if (id.includes('/src/sim/simulationData')) {
            return 'sim-data';
          }
          if (
            id.includes('/src/sim/simulationFarm') ||
            id.includes('/src/sim/simulationEconomy') ||
            id.includes('/src/sim/simulationWorld') ||
            id.includes('/src/sim/simulationCreatures') ||
            id.includes('/src/sim/simulationVillagers') ||
            id.includes('/src/sim/villagerGiftsPetAndStroll')
          ) {
            return 'sim-world';
          }
          if (id.includes('/src/sim/')) {
            return 'sim-core';
          }
          if (id.includes('/src/engine/')) {
            return 'engine';
          }
        },
      },
    },
  },
});

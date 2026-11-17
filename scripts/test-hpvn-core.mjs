// HPVN core invariants for Trang Trại Hang Sóc (run by `npm run test:hpvn` before every sync build).
// If one fails after an upstream update, fix the patch; do not relax the test.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const files = (dir) => readdirSync(dir).flatMap((name) => {
  const full = path.join(dir, name);
  return statSync(full).isDirectory() ? files(full) : [full];
});
const src = files(path.join(root, 'src')).filter((f) => /\.(ts|css)$/.test(f) && !f.includes('__tests__'));
const source = src.map((f) => readFileSync(f, 'utf8')).join('\n');
// short failures: the first offending line, never the whole bundle
const none = (text, re, what) => {
  const line = text.split('\n').find((l) => re.test(l));
  assert.equal(line, undefined, `${what}: ${line?.trim().slice(0, 160)}`);
};

// 1. HPVN owns the network and the device: no outside host, no own backend, telemetry, service worker or storage.
none(source, /https?:\/\/(?!www\.w3\.org)/, 'no outside URL');
none(source, /\/api\/|sendBeacon|serviceWorker|caches\.|sessionStorage|indexedDB/, 'own backend, telemetry, service worker or storage');
// the farm's save/load lives in simulationLifecycle.ts (upstream split simulation.ts, 11/2026)
// nothing on the device (owner 13/11): the one touch is bridge.ts removing the old F5 draft once
none(source.replace(read('src/sim/simulationLifecycle.ts'), ''), /localStorage(?!\.removeItem\(`hpvn-farm-draft:)/, 'only the unit-test default store may touch localStorage');
// house points are the server's: the page keeps no counter, no milestone tier, no cached standings
none(source, /housePoints\b|houseCupMilestoneTier|weeklyHouseCupServerStandings/, 'no local house points');
// the Cúp tab fetches on every render: only a new reply may re-render it, or the cached answer loops forever (13/11 freeze)
assert.match(read('src/ui/hudQuestsAndSettings.ts'), /const before = houseCup\(\);\s+return fetchHouseCup\(\)\.then\(\(cup\) => \{[\s\S]{0,160}if \(cup !== before && /, 'Cúp tab re-renders only on a new reply');
none(source, /btnSyncServerHouseCup/, 'no manual cup sync button (the tab fetches on open)');
none(read('src/sim/simulationLifecycle.ts').replace(/let farmStore: FarmStore = \{[\s\S]*?\n\};/, ''), /localStorage/, 'only the unit-test default store may touch localStorage');
none(read('index.html'), /https?:\/\/|serviceWorker|manifest/, 'no outside font/script host, no PWA');
// HPVN's «G» is Galleons: the farm's coin is Sickle everywhere, never «G» or «Vàng»
none(source, /(\d|\}) ?G(?![\p{L}\p{N}_])|🪙 Vàng|>G<\/(text|span)>/u, 'coin named Sickle');
assert.match(read('vite.config.ts'), /base: '\/game\/trang-trai-hang-soc\/'/);
// one plain face, as on HPVN (owner 13/11): no serif headings, no Playfair/Georgia
none(source, /Playfair|Georgia|Times New Roman|(?<!sans-)\bserif\b/, 'Be Vietnam Pro only, no serif');

// 2. Identity is the HPVN handoff, checked against parent, origin and nonce.
const bridge = read('src/hpvn/bridge.ts');
assert.match(bridge, /window\.parent !== window && parent && data/);
assert.match(bridge, /event\.origin !== parent/);
assert.match(bridge, /data\.nonce === params\.get\('hpvn-ticket'\)/);
assert.doesNotMatch(bridge, /location\.origin/, 'the frame may sit on another origin (GAME_ORIGIN)');

// 3. The farm is the server's: loaded before the simulation exists (a new farm never overwrites a saved one),
//    saved through the bridge, flushed when the page hides; debug switches only in the dev server.
const main = read('src/main.ts');
assert.ok(main.indexOf('setFarmStore({ read: () => farmJson, write: queueFarmSave })') < main.indexOf('new ParkSimulation('));
assert.match(main, /if \(!identity\) throw/);
assert.match(main, /addEventListener\('pagehide', saveNow\)/);
assert.match(main, /new URLSearchParams\(import\.meta\.env\.DEV \? window\.location\.search : ''\)/);
assert.match(read('src/sim/simulationLifecycle.ts'), /const raw = farmStore\.read\(\);[\s\S]*farmStore\.write\(JSON\.stringify\(persistedState\)\)/);
assert.match(bridge, /MAX_SAVE_BYTES = 1_000_000/);
none(source, /\.importSaveJson\(|\.download = /, 'the frame cannot download; nothing imports a file save');

// 4. Assets under the base path, WebP ≤ 150 KB.
none(source, /(?<![\w/.-])\/(sprites|paintings|audio|fonts|icons)\//, 'asset paths carry /game/trang-trai-hang-soc/');
none(source, /\/(sprites|paintings)\/[^'"`)\s]*\.(png|jpe?g)/, 'images are WebP');
for (const f of files(path.join(root, 'public'))) {
  assert.doesNotMatch(f, /\.(png|jpe?g|gif)$/i, `${f}: images are WebP`);
  if (f.endsWith('.webp')) assert.ok(statSync(f).size <= 150 * 1024, `${f} ≤ 150 KB`);
}

// 5. Wording: Lý Lan's translation, and the farm's coins are not HPVN Galleons.
none(source, /Puffskein|[Tt]ất [Ll]en/, '/Puffskein|[Tt]ất [Ll]en/');
// the one place HPVN Galleons appear: the one-way Gringotts counter, which names only a pack and a request id
none(source.replace(read('src/hpvn/exchange.ts'), ''), /Galleon/, 'Galleons only in src/hpvn/exchange.ts');
assert.match(read('src/hpvn/exchange.ts'), /request<[^>]+>\('farm', \{ op: 'sickles', \.\.\.pendingExchange \}\)/);
// 6. One paper shell (UI đợt 4): every <dialog> in hudShell.ts is in the shell list, or one of the full-frame screens.
//    An upstream dialog missing here would open unstyled: add its ID to the đợt 4 block.
{
  const css = read('src/styles/main.css');
  const shell = css.match(/^:is\((#questDialog[^)]*)\) \{$/m)?.[1].split(', ').map((id) => id.slice(1)) ?? [];
  const full = ['match3Dialog', 'puzzleArcadeDialog', 'seedQuizDialog']; // minigames: their own full-frame screens
  const dialogs = [...read('src/ui/hudShell.ts').matchAll(/<dialog id="(\w+)"/g)].map((m) => m[1]).filter((id) => !full.includes(id));
  assert.deepEqual([...shell].sort(), [...dialogs].sort(), 'dialogs in hudShell.ts = the đợt 4 shell list (main.css)');
  for (const m of css.matchAll(/:is\((#questDialog, #roadmapDialog[^)]*)\)/g)) assert.equal(m[1], shell.map((id) => `#${id}`).join(', '), 'every copy of the shell list is the same');
}

// 7. UI typography & dialog lifecycle guardrails (đợt 6):
//    - No inline font-weight: 900 or fractional .5px inline font-size in UI modules
//    - UA strong/b bolder escalation normalized to var(--hs-weight-label)
//    - Minigame <dialog> close listeners guard `if (dlg.open) return;` against queued macrotasks
{
  const uiFiles = [...files(path.join(root, 'src/ui')), ...files(path.join(root, 'src/hpvn'))]
    .filter((f) => f.endsWith('.ts'))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');
  none(uiFiles, /font-weight\s*:\s*900/, 'no inline font-weight: 900 in UI/HPVN modules');
  none(uiFiles, /font-size\s*:\s*\d+\.5px/, 'no inline fractional .5px font-size in UI/HPVN modules');
  assert.match(read('src/styles/main.css'), /strong,\s*b\s*\{\s*font-weight:\s*var\(--hs-weight-label\);/, 'strong/b weight normalized');
  for (const mgFile of ['src/ui/puzzleArcadeModal.ts', 'src/ui/match3Modal.ts', 'src/ui/seedQuizModal.ts']) {
    assert.match(read(mgFile), /addEventListener\('close',\s*\(\)\s*=>\s*\{\s*if\s*\(dlg\.open\)\s*return;/, `${mgFile} guards async close event`);
  }
}
console.log('Trang Trại Hang Sóc HPVN core: ok');

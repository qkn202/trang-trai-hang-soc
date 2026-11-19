import { applyHouseCup } from './houseCup';

// HPVN Game Zone bridge: the member comes from the parent's identity handoff (never a typed name) and the farm
// is kept by the HPVN server through the parent page (this frame never touches Firebase or another host).
// Outside HPVN (no handoff) the game does not start.
export interface HpvnIdentity { uid: string; displayName: string; house: string; nonce: string; issuedAt: number }

// The page that frames this game: HPVN, on this host or on GAME_ORIGIN, whose CSP lets only the site frame it.
const parent = (() => { try { return new URL(document.referrer).origin; } catch { return ''; } })();

const LOCAL_STANDALONE_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
const VALID_STANDALONE_HOUSES = new Set(['gryffindor', 'slytherin', 'ravenclaw', 'hufflepuff', 'none']);

export let isStandaloneLocal = false;

function isLocalStandaloneAllowed(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof location === 'undefined') {
    return false;
  }
  if (import.meta.env.MODE === 'test') return false;
  return Boolean(import.meta.env.DEV) || LOCAL_STANDALONE_HOSTS.has(String(location.hostname || '').toLowerCase());
}

function readIdentity(): HpvnIdentity | null {
  try {
    const params = new URLSearchParams(location.hash.slice(1));
    const data = JSON.parse(params.get('hpvn-handoff') || 'null');
    if (window.parent !== window && parent && data
      && typeof data.uid === 'string' && typeof data.nonce === 'string' && data.nonce === params.get('hpvn-ticket')
      && Math.abs(Date.now() - data.issuedAt) < 10 * 60 * 1000) return data;
  } catch { /* standalone */ }
  if (isLocalStandaloneAllowed()) {
    isStandaloneLocal = true;
    let house = 'gryffindor';
    let displayName = 'Phù Thủy Local';
    try {
      const sp = new URLSearchParams(location.search);
      const rawHouse = String(sp.get('house') || '').trim().toLowerCase();
      if (VALID_STANDALONE_HOUSES.has(rawHouse)) house = rawHouse;
      const rawName = String(sp.get('name') || '').trim();
      if (rawName) displayName = rawName;
    } catch { /* fallback defaults */ }
    return {
      uid: 'local-dev-wizard',
      displayName,
      house,
      nonce: 'local-dev-nonce',
      issuedAt: Date.now(),
    };
  }
  return null;
}

export const identity = readIdentity();
const pending = new Map<string, { resolve: (value: any) => void; reject: (error: Error & { code?: string }) => void; timer: number }>();
const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

if (identity && !isStandaloneLocal) {
  // Khu Vườn Hagrid webapp rule: GameEmbedShell already clears status-bar & side insets, while iOS standalone
  // web apps also pass env(safe-area-inset-*) into the iframe. Zeroing --host-inset-* prevents double insets.
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    document.documentElement.style.setProperty(`--host-inset-${side}`, '0px');
  }
  addEventListener('message', (event) => {
    const d = event.data;
    if (!identity || event.source !== window.parent || event.origin !== parent || d?.channel !== 'hpvn-game' || d.nonce !== identity.nonce) return;
    const wait = pending.get(d.id);
    if (!wait) return;
    clearTimeout(wait.timer); pending.delete(d.id);
    if (d.error) wait.reject(Object.assign(new Error(d.error), { code: d.code })); else wait.resolve(d.result);
  });
}

function buildLocalCupStub() {
  const houseMap: Record<string, string> = {
    gryffindor: 'Gryffindor',
    slytherin: 'Slytherin',
    ravenclaw: 'Ravenclaw',
    hufflepuff: 'Hufflepuff',
  };
  const house = houseMap[String(identity?.house || '').toLowerCase()] ?? null;
  return {
    weekKey: 'Local',
    houses: { Gryffindor: 320, Ravenclaw: 310, Hufflepuff: 300, Slytherin: 290 },
    house,
    memberTodayPoints: 0,
    memberDailyCap: 60,
    memberBank: 0,
    memberTier: 1,
    perTier: 300,
  };
}

export function request<T = unknown>(action: string, data: object = {}): Promise<T> {
  if (!identity) return Promise.reject(new Error('Cần mở game từ HPVN.'));
  if (isStandaloneLocal) {
    if (action === 'nav') return Promise.resolve({ dock: 0, inset: 0 } as T);
    if (action === 'farm-share') return Promise.resolve({} as T);
    if (action === 'farm') {
      switch ((data as { op?: string }).op) {
        case 'load':
          return Promise.resolve({ save: null, inbox: [], cup: buildLocalCupStub() } as T);
        case 'save':
          return Promise.resolve({ inbox: [] } as T);
        case 'cup':
          return Promise.resolve(buildLocalCupStub() as T);
        case 'wallet':
          return Promise.resolve({ enabled: false } as T);
        case 'board':
          return Promise.resolve({ entries: [] } as T);
        default:
          return Promise.reject(new Error('Tính năng trực tuyến này cần mở trên cổng HPVN.'));
      }
    }
    return Promise.reject(new Error('Tính năng trực tuyến này cần mở trên cổng HPVN.'));
  }
  const id = newId();
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => { pending.delete(id); reject(new Error('Kết nối HPVN hết thời gian chờ.')); }, 30000);
    pending.set(id, { resolve, reject, timer });
    window.parent.postMessage({ ...data, channel: 'hpvn-game', nonce: identity.nonce, id, action }, parent);
  });
}

// ---- Farm save: the server keeps one save per member; this page's nonce is its session (one device at a time).
// Nothing is kept on the device (no draft, no points): an unsent change lives only in this page until it is saved.
// `cup: 2` tells the server this page takes house points and «Cúp Đợt» rewards from it (src/hpvn/houseCup.ts).
type Status = 'saved' | 'error' | 'replaced' | 'too-big';
export const MAX_SAVE_BYTES = 1_000_000; // ponytail: one Firestore doc (1 MiB, same cap in the trangTraiHangSoc callable); split buildings into their own docs if farms outgrow it
let latest: string | null = null;
let sent: string | null = null;
let timer = 0;
let stopped = false;
let flight: Promise<void> = Promise.resolve();
export let onSaveStatus: (status: Status) => void = () => {};
export const setSaveStatusListener = (fn: (status: Status) => void) => { onSaveStatus = fn; };

// Helps from other members (src/hpvn/inbox.ts) ride in the load and save replies; held until the farm is running.
let onInbox: ((entries: unknown[]) => void) | null = null;
let heldInbox: unknown[] = [];
/** Hands inbox entries to the farm (held until it runs); src/hpvn/exchange.ts passes its reply here too. */
export const deliverInbox = (entries: unknown) => {
  if (!Array.isArray(entries) || entries.length === 0) return;
  if (onInbox) onInbox(entries); else heldInbox.push(...entries);
};
export function setInboxListener(fn: (entries: unknown[]) => void) {
  onInbox = fn;
  const held = heldInbox; heldInbox = [];
  if (held.length) fn(held);
}

/** The member's farm JSON, or null for a new farm. Claims the farm for this page. */
export async function loadFarm(): Promise<string | null> {
  const result = await request<{ save?: string | null; inbox?: unknown[]; cup?: unknown }>('farm', { op: 'load' });
  sent = typeof result?.save === 'string' ? result.save : null;
  try { localStorage.removeItem(`hpvn-farm-draft:${identity?.uid}`); } catch { /* blocked */ } // the 12/11 draft's leftover; drop this line after 01/2027
  applyHouseCup(result?.cup);
  deliverInbox(result?.inbox);
  return sent;
}

function flush(): Promise<void> {
  clearTimeout(timer); timer = 0;
  if (stopped || latest === null || latest === sent) return flight;
  const save = latest;
  if (new TextEncoder().encode(save).length > MAX_SAVE_BYTES) { onSaveStatus('too-big'); return flight; }
  flight = flight.then(() => request<{ inbox?: unknown[]; cup?: unknown }>('farm', { op: 'save', save, cup: 2 })).then((result) => {
    sent = save;
    onSaveStatus('saved'); applyHouseCup(result?.cup); deliverInbox(result?.inbox);
  }, (error: Error & { code?: string }) => {
    if (/nơi khác|thiết bị khác/.test(error.message)) { stopped = true; onSaveStatus('replaced'); } else onSaveStatus('error');
  });
  return flight;
}

/** Called by every save of the simulation; the server gets at most one write every 5 s, and at once when the page hides. */
// ponytail: 5 s debounce = ≤ 12 writes/min a member; batch only the changed buildings if Firestore cost grows
export function queueFarmSave(json: string) {
  latest = json;
  if (!timer) timer = window.setTimeout(() => { void flush(); }, 5_000);
}
export const flushFarmSave = flush;

/** «Khoe lên Mạng Floo»: a ≤ 1080 px picture of the farm prefills Floo (the member presses send). */
export async function shareFarmPhoto(source: HTMLCanvasElement, text: string): Promise<void> {
  const scale = Math.min(1, 1080 / source.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  const ctx = canvas.getContext('2d')!;
  // WebGL2 renderer: the ground is on #gpuWorldCanvas under #gameCanvas (both fill the viewport)
  const gpu = source.id === 'gameCanvas' ? (document.getElementById('gpuWorldCanvas') as HTMLCanvasElement | null) : null;
  if (gpu && gpu.style.display !== 'none' && gpu.width > 0 && gpu.height > 0) ctx.drawImage(gpu, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  const encode = (type: string) => new Promise<Blob | null>((done) => canvas.toBlob(done, type, 0.85));
  let image = await encode('image/webp');
  if (!image || image.type !== 'image/webp') image = await encode('image/jpeg'); // iOS Safari has no WebP encoder
  await request('farm-share', { text, image });
}

/** The HPVN shell's ☰ goes under the farm's top-left HUD and hides while a dialog is open; `overlay` (a dialog, a
 *  minigame or a HUD menu is up) tucks the shell's Floo chat-head into its edge so it covers nothing. The reply carries
 *  the height of the shell's phone dock (`--hpvn-dock`) and the home-bar inset over this frame (`--hpvn-safe-bottom`,
 *  which `env()` reads as 0 inside a frame); the stylesheet keeps every bottom control above both. */
export function placeShellNav(hud: Element) {
  let sent = '';
  let navFrame = 0;
  const px = (n: unknown) => { const v = Math.round(Number(n) || 0); return v > 0 ? v : 0; };
  const isVisible = (el: Element | null): el is HTMLElement => {
    if (!el || el.classList.contains('hidden') || (el as HTMLElement).hidden) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 4 && r.height > 4;
  };
  const send = (force = false) => {
    navFrame = 0;
    const hudRoot = document.getElementById('hudRoot');
    const rolledUp = Boolean(
      hudRoot?.classList.contains('hud-building-focus')
      || hudRoot?.classList.contains('hud-compact-rolled')
      || isVisible(document.getElementById('btnHudRoundOrb')),
    );
    const leftItems = ['#btnOpenRoadmap', '.hg-supplies-pill', '#questTrackerPanel', '#visitorBanner']
      .map((sel) => document.querySelector(sel))
      .filter(isVisible);
    const leftBottom = leftItems.length
      ? Math.max(...leftItems.map((el) => el.getBoundingClientRect().bottom))
      : hud.getBoundingClientRect().bottom;
    const top = rolledUp ? 8 : Math.max(8, Math.round(leftBottom + 8));
    let popoverOpen = false;
    try {
      const tut = document.querySelector('#tutorialCoachCard:popover-open');
      popoverOpen = isVisible(tut);
    } catch { /* unsupported */ }
    const covered = popoverOpen || Array.from(document.querySelectorAll(
      'dialog[open], .hud-floating-popover, #seedBrushTray, #pastureBrushTray, #inspectorPanel, #bottomDockWrap.ts-dock-open, #touchConfirmBar, #floatingModeBanner, #photoModeBar',
    )).some(isVisible);
    const key = `${top}|${covered}`;
    if (key === sent && !force) return;
    sent = key;
    request<{ dock?: number; inset?: number }>('nav', { top, hidden: covered, overlay: covered }).then((result) => {
      const dock = px(result?.dock);
      const root = document.documentElement.style;
      root.setProperty('--hpvn-dock', dock ? `${dock + 6}px` : '0px');
      root.setProperty('--hpvn-safe-bottom', `${Math.min(px(result?.inset), 60)}px`);
    }, () => {});
  };
  const soon = () => { if (!navFrame) navFrame = requestAnimationFrame(() => send()); };
  const onMutation = (records: MutationRecord[]) => {
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      if (rec.type === 'attributes') {
        soon();
        return;
      }
      if (rec.type === 'childList') {
        for (let j = 0; j < rec.addedNodes.length; j++) {
          if (rec.addedNodes[j].nodeType === 1) {
            soon();
            return;
          }
        }
        for (let j = 0; j < rec.removedNodes.length; j++) {
          if (rec.removedNodes[j].nodeType === 1) {
            soon();
            return;
          }
        }
      }
    }
  };
  new ResizeObserver(soon).observe(hud);
  addEventListener('resize', () => send(true)); // the dock comes and goes with the shell's width
  new MutationObserver(onMutation).observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['open', 'class', 'hidden'],
  });
  document.addEventListener('toggle', soon, true);
  send(true);
}

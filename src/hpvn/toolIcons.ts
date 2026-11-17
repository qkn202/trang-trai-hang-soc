// HPVN phones (owner 13/11): the tool row under the board is one line of even tiles, icon over label.
// Labels are written as "🔄 Ván Mới"; liftToolIcon puts the leading emoji's sprite (or text glyph) in its own span so CSS
// can stack it; an emoji with neither is dropped and the tile shows its label alone (no emoji, owner 14/11).
// The occasional actions (Bùa, Bánh Táo, Ván Mới, Cứu) fold into a «… Thêm» popover menu (portrait and phone landscape); the real buttons
// are moved, not copied, so every handler and live label update keeps working.
import { iconImg, spriteOf, stripEmoji } from './emoji';

// Without the lift or the menu the row still works, just wider, so a missed call never breaks the game.
const LEAD = /^\s*(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)\s*/u;
const MENU_ITEMS = [
  '#btnPaPhoenixTalisman, #btnM3PhoenixTalisman',
  '.aaa-snack-btn',
  '#btnPaRestart, #btnM3RestartStage',
  '#btnPaAskFriendSos, #btnM3AskFriendSos',
];

export function liftToolIcon(btn: Element | null | undefined): void {
  const doc = btn?.ownerDocument;
  if (!btn || !doc?.createTreeWalker || btn.querySelector('.pa-ico')) return;
  const walker = doc.createTreeWalker(btn, 4 /* NodeFilter.SHOW_TEXT */);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.nodeValue ?? '';
    if (!text.trim()) continue;
    const m = LEAD.exec(text);
    if (!m) return;
    node.nodeValue = text.slice(m[0].length);
    const key = spriteOf(m[1]);
    const glyph = stripEmoji(m[1]);
    if (!key && !glyph) return;
    const ico = doc.createElement('span');
    ico.className = 'pa-ico';
    if (key) ico.append(iconImg(doc, key));
    else ico.textContent = glyph;
    node.parentNode?.insertBefore(ico, node);
    return;
  }
}

function foldToolMenu(bar: HTMLElement): void {
  const doc = bar.ownerDocument;
  const win = doc.defaultView;
  const dialog = bar.closest('dialog') as HTMLElement | null;
  const layout = dialog?.dataset?.mgLayout;
  if (!win || !dialog?.id || !layout) return;
  // portrait (phones & 58vw desktop Floo split-pane) and short phone landscape (≤ 450px tall) fold secondary tools into «… Thêm»
  const shouldFold = layout === 'portrait' || Boolean(win.matchMedia?.('(max-height: 450px) and (orientation: landscape)').matches);
  if (!shouldFold || !('popover' in win.HTMLElement.prototype)) return;
  if (bar.querySelector('.pa-more-menu')) return;
  const items = MENU_ITEMS.map((sel) => bar.querySelector(sel)).filter((el): el is Element => !!el);
  if (!items.length) return;

  const menu = doc.createElement('div') as HTMLElement & { hidePopover(): void };
  menu.className = 'pa-more-menu';
  menu.id = `${dialog.id}MoreMenu`;
  menu.setAttribute('popover', 'auto');
  menu.append(...items);
  const more = doc.createElement('button');
  more.type = 'button';
  more.className = 'pa-tool-btn pa-more-btn';
  more.setAttribute('popovertarget', menu.id);
  more.setAttribute('aria-label', 'Thêm');
  more.innerHTML = '<span class="pa-ico">…</span><span class="pa-more-lbl">Thêm</span>'; // HPVN: «⋯» is not in Be Vietnam Pro; Tiệm Kẹo landscape hides the label (main.css 5b)
  // open just above the row, right-aligned (no anchor positioning on older iOS)
  menu.addEventListener('beforetoggle', (e) => {
    if ((e as Event & { newState?: string }).newState !== 'open') return;
    menu.style.bottom = `${Math.round(win.innerHeight - bar.getBoundingClientRect().top + 6)}px`;
  });
  menu.addEventListener('click', (e) => {
    if ((e.target as Element | null)?.closest('button')) menu.hidePopover();
  });
  bar.append(more, menu);
}

export function liftToolIcons(scope: ParentNode | null | undefined): void {
  scope?.querySelectorAll?.('.pa-controls-bar button').forEach(liftToolIcon);
  scope?.querySelectorAll?.<HTMLElement>('.pa-controls-bar').forEach(foldToolMenu);
}

// every tab group is one segmented row that scrolls sideways where it is short of room (đợt 3b): a row rebuilt by a render,
// or shown again by a dialog opening, starts at scrollLeft 0, so its current tab is centred again
const TAB_ROWS = '.pa-mode-tabs, .workshop-tabs, .lb-game-tabs, .lb-scope-pills, .hs-tabs, .sq-lang-tabs, .sq-view-switch, .pa-submode-switch';
export function centerActiveTabs(scope: ParentNode): void {
  const rows = scope instanceof HTMLElement && scope.matches(TAB_ROWS) ? [scope] : scope.querySelectorAll<HTMLElement>(TAB_ROWS);
  rows.forEach((row) => {
    if (row.scrollWidth <= row.clientWidth + 1) return;
    const on = row.querySelector<HTMLElement>(':scope > :is(.active, [aria-selected="true"], [data-active="true"], [aria-pressed="true"])');
    if (on) row.scrollLeft += on.getBoundingClientRect().left - row.getBoundingClientRect().left - (row.clientWidth - on.offsetWidth) / 2;
  });
}
// only the rows just added and the dialog just opened: a row the player is dragging sideways elsewhere stays where it is
export function installTabCentering(root: HTMLElement = document.body): void {
  const due = new Set<Element>();
  const holdsRow = (n: Node): n is Element => n.nodeType === 1 && ((n as Element).matches(TAB_ROWS) || !!(n as Element).querySelector(TAB_ROWS));
  const run = (): void => { const scopes = [...due]; due.clear(); scopes.forEach((s) => { if (s.isConnected) centerActiveTabs(s); }); };
  new MutationObserver((records) => {
    const idle = due.size === 0;
    for (const r of records) {
      if (r.type === 'attributes') { if ((r.target as Element).hasAttribute('open')) due.add(r.target as Element); }
      else r.addedNodes.forEach((n) => { if (holdsRow(n)) due.add(n); });
    }
    if (idle && due.size) requestAnimationFrame(run);
  }).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['open'] });
  // a new tab opens at its top: the dialog's content scroller (its row is sticky, so the row itself never moves)
  root.addEventListener('click', (e) => {
    const box = (e.target as Element | null)?.closest?.(`:is(${TAB_ROWS}) > *`)?.closest<HTMLElement>('[id$="DialogContent"]');
    if (box) requestAnimationFrame(() => { box.scrollTop = 0; });
  }, true);
}

/** A count from 10.000 as «12,9k» / «1,2tr» / «1,2tỷ» (one decimal, cut down, never rounded up): the Sickle balance in the
 * garden HUD on phones; Sickle, stars and rank in the minigame figures pill. */
export function compactSickle(n: number): string {
  if (n < 10000) return n.toLocaleString('vi-VN');
  const [div, unit] = n < 1e6 ? [1e3, 'k'] : n < 1e9 ? [1e6, 'tr'] : [1e9, 'tỷ'];
  return `${(Math.floor((n / div) * 10) / 10).toLocaleString('vi-VN')}${unit}`;
}

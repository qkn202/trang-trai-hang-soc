// HPVN (owner 15/11 «thiết kế lại, tránh AI slop»): one level bar for every minigame (Bùa Gặt and the five arcade boards).
// Left: the stage («Màn 4/777», bold) over one line of title / difficulty. Right: the figures as cells, icon + number, ruled
// apart (no «•» chain); a cell turns --hs-bad when its number is in danger (.pa-err-inline, toggled by the live counters).
// A loss is the bar's own state, not one more box: red rim, the message takes the sub line and the rescue action the figures'
// place; the bar keeps its height in every state, so the board never jumps (main.css «level bar»).

const SPRITES = '/game/trang-trai-hang-soc/sprites/';

export const lvIcon = (sprite: string): string => `<img class="hs-ico" src="${SPRITES}${sprite}.webp" alt="" aria-hidden="true">`;
/** the ✕ of «Lỗi» (emoji.ts GLYPH draws it in the text colour) */
export const LV_MISTAKE = '<span class="hs-x" aria-hidden="true"></span>';

/** One figure: a spoken name, an icon (or none) and the value (keep the live counter's id on it). */
export const lvStat = (label: string, valueHtml: string, icon = ''): string =>
  `<span class="hs-lv-stat"><span class="sr-only">${label}</span>${icon}${valueHtml}</span>`;

// a message that wraps keeps its last two words together (owner: no lone word on the last line; three would not fit the
// 80px landscape dock: «còn 1.234 mảnh»)
const keepEnding = (text: string): string => text.replace(/ (\S+)$/, '\u00a0$1');

export function levelBarHtml(o: { stage: string; sub: string; stats: string; alert?: string; action?: string }): string {
  if (o.alert) o = { ...o, alert: keepEnding(o.alert) };
  return `
    <div class="pa-stage-banner hs-lv${o.alert ? ' is-alert' : ''}"${o.alert ? ' role="status"' : ''}>
      <div class="hs-lv-meta"><div class="hs-lv-stage">${o.stage}</div><div class="hs-lv-sub">${o.alert ?? o.sub}</div></div>
      <div class="hs-lv-stats">${o.alert && o.action ? o.action : o.stats}</div>
    </div>`;
}

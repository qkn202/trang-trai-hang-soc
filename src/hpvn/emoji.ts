// HPVN (owner 14/11 «bỏ hết mấy cái emoji đi, cái nào thật sự cần thì kêu codex nó tạo, ko thì bỏ»): no emoji in the farm.
// Upstream writes emoji into thousands of strings, so they are filtered where they reach the screen, not edited at the source:
//  - DOM: one MutationObserver turns an emoji that has a game sprite into <img class="hs-ico"> and drops the rest;
//  - canvas: fillText / strokeText / measureText drop them too and draw the sprite in the gap where there is one.
// Kept: glyphs that read as text (✓ ✕ ★ ♥ · arrows, chess pieces, © ® ™ …); only the colour emoji go. Be Vietnam Pro has
// only © ® ™ of those, so in HTML the rest become a CSS-drawn mark (GLYPH below); canvas keeps the system font's glyph.
// Data (moodBubble === '☔', fallbackEmoji, opponentEmoji …) is untouched, so every comparison in the game still holds.

const SPRITES = '/game/trang-trai-hang-soc/sprites/';
export const SPRITE: Record<string, string> = {
  '🌟': 'm3_icon_star', '⭐': 'm3_icon_star', '🪙': 'ui_icon_golden_sickle', '🦉': 'ui_icon_owl_orders', '✉': 'ui_icon_owl_orders',
  '🌱': 'ui_icon_seed_sack', '🐾': 'ui_icon_creature', '🪄': 'ui_icon_hammer_wand', '🔨': 'ui_icon_hammer_wand',
  '❤': 'm3_icon_heart', '💝': 'm3_icon_heart', '💚': 'm3_icon_heart', '💔': 'm3_icon_heart', '💖': 'm3_icon_heart',
  '🐍': 'crest-slytherin', '🦁': 'crest-gryffindor', '🦅': 'crest-ravenclaw', '🦡': 'crest-hufflepuff',
  '🏡': 'burrow_house_canon', '🧩': 'ui_icon_jigsaw', '📦': 'm3_farm_crate', '🥧': 'ui_icon_pie_ready', '🥮': 'ui_icon_pie_ready',
  '🔌': 'ui_icon_muggle_plug', '🍬': 'm3_gem_candy_pink', '🍭': 'm3_gem_candy_pink', '🗺': 'ui_icon_world_map', '🧙': 'staff_wizard',
  '🦄': 'beast_unicorn', '🐉': 'beast_dragon', '🐲': 'beast_dragon', '🐑': 'beast_sheep', '🐔': 'beast_hen', '🐄': 'beast_cow',
  '💧': 'ui_icon_watering_can', '🥚': 'ui_icon_egg_basket', '📜': 'm3_piece_scroll', '🔀': 'm3_boost_shuffle',
  '🍺': 'ui_icon_butterbeer', '🍻': 'ui_icon_butterbeer', '🎾': 'creature_feeder_toy', '🏗': 'prop_construction_site',
  '🍯': 'ui_icon_honey_jar', '🧳': 'ui_icon_suitcase', '🎒': 'ui_icon_suitcase', '💎': 'm3_gem_sapphire', '🧶': 'ui_icon_sweater_ready',
  '🔔': 'ui_icon_pasture_bell', '🛤': 'ui_icon_path', '🛣': 'ui_icon_path', '🥛': 'ui_icon_milk_wool', '💐': 'ui_icon_rose_bouquet',
  '🍲': 'ui_icon_mushroom_soup', '🍾': 'ui_icon_cider', '🍐': 'm3_farm_pear', '🍑': 'm3_farm_plum',
  // crops (catalog iconKey)
  '🌾': 'ui_icon_crop_ottery_wheat', '🎃': 'ui_icon_crop_garden_pumpkin', '🌸': 'ui_icon_crop_blush_peony',
  '🌙': 'ui_icon_crop_moonlight_flower', '🌼': 'ui_icon_crop_meadow_daisy', '🌹': 'ui_icon_crop_english_rose',
  '🌻': 'ui_icon_crop_hedge_sunflower', '🍓': 'ui_icon_crop_ruby_strawberry', '🍎': 'ui_icon_crop_burrow_apple',
  '🍄': 'ui_icon_crop_glow_mushroom', '🫐': 'ui_icon_crop_dew_blueberry', '💜': 'ui_icon_crop_dried_lavender',
  '🌺': 'ui_icon_crop_phoenix_fireflower', '🌷': 'ui_icon_crop_rainbow_tulip', '💛': 'ui_icon_crop_golden_daffodil',
  '🥕': 'ui_icon_crop_honey_carrot', '🥬': 'ui_icon_crop_crisp_cabbage', '🥔': 'ui_icon_crop_burrow_potato',
  '🌽': 'ui_icon_crop_golden_corn', '🪴': 'ui_icon_crop_baby_mandrake', '🍅': 'ui_icon_crop_ruby_tomato',
  // drawn for HPVN by Codex (14/11)
  '🍀': 'res_clover_luck', '🎁': 'ui_gift_box', '🔒': 'ui_lock', '🌿': 'res_herb', '🏆': 'ui_trophy_cup', '🏮': 'ui_lantern',
  '🪨': 'res_stone', '🪵': 'res_wood', '🧱': 'res_brick', '🧯': 'item_extinguisher',
  '⏳': 'res_time_sand', '⌛': 'res_time_sand', '🍁': 'res_festival_leaf',
  // Yule crops (catalog iconKey, upstream fbe6866)
  '🍒': 'ui_icon_crop_yule_holly_sprig', '🤍': 'ui_icon_crop_yule_paperwhite',
  // Dual-Theme Christmas crops, dishes & companions
  '🟣': 'ui_icon_crop_yule_sugarplum_bush', '🫚': 'ui_icon_crop_yule_ginger_anise',
  '🌰': 'ui_icon_crop_yule_ember_chestnut', '🍊': 'ui_icon_crop_vn_noel_golden_kumquat',
  '🍠': 'ui_icon_crop_vn_winter_sweet_potato', '🍰': 'ui_icon_yule_log_cake',
  '🍮': 'ui_icon_yule_flaming_pudding', '🍗': 'ui_icon_yule_roast_turkey',
  '🥖': 'ui_icon_vn_banh_mi_soymilk', '🥣': 'ui_icon_vn_che_troi_nuoc',
  '🐈': 'beast_vn_tabby_cat', '🐃': 'beast_vn_brocade_calf',
};
// pictographic code points that are plain text glyphs here (the rest of the keep list is not pictographic at all)
export const KEEP = new Set([...'♥♦♟♂♀↔↕↖↗↘↙↩↪⬆⬇⬅➡▶◀©®™']);
// an emoji with its variation selector, keycap, skin tone, ZWJ parts and flag tags; or a stray one of those marks
const TAIL = '[\\uFE0F\\u20E3\\u{E0020}-\\u{E007F}]';
const TOKEN = `(?:\\p{Extended_Pictographic}|\\p{Regional_Indicator})(?:${TAIL}|\\p{Emoji_Modifier}|\\u200D\\p{Extended_Pictographic})*|(?:${TAIL}|\\u200D)+`;
const HAS = new RegExp(TOKEN, 'u');
const EACH = new RegExp(`(${TOKEN})( ?)`, 'gu');

const baseOf = (tok: string): string => String.fromCodePoint(tok.codePointAt(0) ?? 0);
export const spriteOf = (tok: string): string | undefined => SPRITE[baseOf(tok)];

/** The text with its emoji gone; `sprite` (when given) supplies what stands in for an emoji that has a sprite. */
export function stripEmoji(text: string, sprite?: (key: string) => string): string {
  if (!HAS.test(text)) return text;
  let droppedTo = -1; // where the last dropped emoji ended
  return text.replace(EACH, (m: string, tok: string, sp: string, at: number) => {
    const base = baseOf(tok);
    if (KEEP.has(base)) return base + sp;
    const key = sprite && SPRITE[base];
    if (key) return sprite(key) + sp;
    // a dropped emoji takes its following space only where it started a word («🔥 Ván» → «Ván», «a 🔥 b» → «a b»);
    // wedged against a word («Ván🔥 Mới», a keycap «1️⃣ Mục») the space stays
    const eat = at === 0 || at === droppedTo || /\s/.test(text[at - 1]);
    droppedTo = at + m.length;
    return eat ? '' : sp;
  });
}

/** Whether anything is left to show once the emoji are filtered (a sprite counts). */
export const showsAfterStrip = (text: string): boolean => stripEmoji(text, () => 'x').trim() !== '';

/** An avatar or portrait emoji with no game sprite (🦊 🦢 🧔 🎆 📚) is stripped and left an empty disc: the name's first letter
 * or digit stands in (a whole code point, never half a surrogate). */
export const avatarGlyph = (emoji: string | undefined, name: string): string =>
  emoji && showsAfterStrip(emoji) ? emoji : ([...name.trim()].find((c) => /[\p{L}\p{N}]/u.test(c)) ?? '?').toUpperCase();

export function iconImg(doc: Document, key: string): HTMLImageElement {
  const img = doc.createElement('img');
  img.className = 'hs-ico';
  img.src = `${SPRITES}${key}.webp`;
  img.alt = '';
  img.draggable = false;
  img.setAttribute('aria-hidden', 'true');
  return img;
}

export const iconHtml = (key: string): string =>
  `<img class="hs-ico" src="${SPRITES}${key}.webp" alt="" aria-hidden="true" draggable="false">`;

// ---- DOM ----
const MARK = '';
// user-written text keeps what the player typed: inputs, and every member name the farm prints (wrapped in .hs-raw where
// it is built). A name inside a toast or a `title` is still filtered: those strings are composed upstream, name and all.
const RAW = 'script, style, textarea, input, [contenteditable], .hs-raw';
const ATTRS = ['title', 'aria-label', 'placeholder', 'alt'];
const HTML_NS = 'http://www.w3.org/1999/xhtml';

// Glyphs Be Vietnam Pro lacks (iOS showed «?» for ✕, Chăn Thả's close): in HTML each becomes a CSS-drawn mark in the text's
// colour (main.css .hs-x, .hs-check, .hs-g-*); '' drops it (♟ as a label decoration; the chess board is canvas).
const TRI = 'hs-g hs-g-tri', ARROW = 'hs-g hs-g-arrow';
export const GLYPH: Record<string, string> = {
  '✕': 'hs-x', '✓': 'hs-check',
  '▶': TRI, '◀': `${TRI} hs-r180`, '▲': `${TRI} hs-r270`, '▴': `${TRI} hs-r270 hs-g-sm`, '▾': `${TRI} hs-r90 hs-g-sm`,
  '★': 'hs-g hs-g-star', '☆': 'hs-g hs-g-star-o', '♥': 'hs-g hs-g-heart', '◆': 'hs-g hs-g-diamond', '♦': 'hs-g hs-g-diamond',
  '⠿': 'hs-g hs-g-grip', '∞': 'hs-g hs-g-inf', '≤': 'hs-g hs-g-le', '≥': 'hs-g hs-g-le hs-flip',
  '→': ARROW, '➡': ARROW, '⬅': `${ARROW} hs-r180`, '⬆': `${ARROW} hs-r270`, '⬇': `${ARROW} hs-r90`,
  '↗': `${ARROW} hs-r315`, '↘': `${ARROW} hs-r45`, '↙': `${ARROW} hs-r135`, '↖': `${ARROW} hs-r225`, '↔': 'hs-g hs-g-arrow2',
  '↺': 'hs-g hs-g-undo', '↩': 'hs-g hs-g-undo', '↻': 'hs-g hs-g-undo hs-flip', '♟': '',
  '↶': 'hs-g hs-g-undo', '↷': 'hs-g hs-g-undo hs-flip',
};
// a mark that carries meaning is read out by name (★★★☆☆ a rank, «≤3 ô» a limit, ∞ alone a count); arrows, ▶, ⠿, ◆ and ✕
// (its button has its own name) are decoration
const SAY: Record<string, string> = { '✓': 'xong', '★': 'sao', '☆': 'sao trống', '♥': 'tim', '∞': 'vô hạn', '≤': 'tối đa', '≥': 'tối thiểu' };
const MARK_AT = new RegExp(`[${Object.keys(GLYPH).join('')}]`);

function fixText(node: Text): void {
  const parent = node.parentElement;
  if (!parent || !(HAS.test(node.data) || MARK_AT.test(node.data)) || parent.closest(RAW)) return;
  const keys: string[] = [];
  const inline = parent.namespaceURI === HTML_NS && !parent.closest('option, select');
  const at = inline ? node.data.search(MARK_AT) : -1;
  if (at >= 0) {
    const rest = node.splitText(at);
    const ch = rest.data[0];
    const cls = GLYPH[ch];
    rest.data = rest.data.slice(1);
    if (cls) {
      const mark = node.ownerDocument.createElement('span');
      mark.className = cls;
      const say = SAY[ch];
      if (say) { mark.setAttribute('role', 'img'); mark.setAttribute('aria-label', say); } else mark.setAttribute('aria-hidden', 'true');
      rest.before(mark);
    }
    fixText(rest);
  }
  if (!HAS.test(node.data)) return;
  const text = stripEmoji(node.data, inline ? (key) => (keys.push(key), MARK) : undefined);
  if (!keys.length) {
    node.data = text;
    return;
  }
  const bits = text.split(MARK);
  node.data = bits[0];
  const frag = node.ownerDocument.createDocumentFragment();
  keys.forEach((key, i) => {
    frag.append(iconImg(node.ownerDocument, key));
    if (bits[i + 1]) frag.append(bits[i + 1]);
  });
  node.after(frag);
}

function fixAttrs(el: Element): void {
  for (const name of ATTRS) {
    const v = el.getAttribute(name);
    if (v && HAS.test(v)) el.setAttribute(name, stripEmoji(v).trim());
  }
}

function scan(node: Node): void {
  if (node.nodeType === 3) return fixText(node as Text);
  if (node.nodeType !== 1) return;
  const walker = node.ownerDocument!.createTreeWalker(node, 5 /* SHOW_ELEMENT | SHOW_TEXT */);
  for (let n: Node | null = node; n; n = walker.nextNode()) {
    if (n.nodeType === 3) fixText(n as Text);
    else if ((n as Element).attributes.length) fixAttrs(n as Element);
  }
}

/** Filter the page now and every later change. Runs inside the observer callback (already one batch per task), not a
 *  later frame, so an emoji is never painted even for one frame; its own edits are taken back out, so it never loops. */
export function installEmojiFilter(root: HTMLElement = document.body): void {
  scan(root);
  const observer = new MutationObserver((records) => {
    for (const r of records) {
      if (r.type === 'childList') r.addedNodes.forEach(scan);
      else if (r.type === 'characterData') fixText(r.target as Text);
      else fixAttrs(r.target as Element);
    }
    observer.takeRecords();
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
}

// ---- canvas ----
const EM = ' '; // an em space holds the sprite's place, so widths and alignment come from the text itself
const canvasImgs = new Map<string, HTMLImageElement>();
function canvasImg(key: string): HTMLImageElement | null {
  let img = canvasImgs.get(key);
  if (!img) {
    img = new Image();
    img.src = `${SPRITES}${key}.webp`;
    canvasImgs.set(key, img);
  }
  return img.complete && img.naturalWidth ? img : null;
}

/** Resolves once these sprites are decoded, so a canvas drawn after it (the Floo postcard) has every icon on its first draw. */
export const canvasSpritesReady = (keys: readonly string[]): Promise<unknown> =>
  Promise.all(keys.map((key) => (canvasImg(key), canvasImgs.get(key)!.decode().catch(() => undefined))));

let rawFill: CanvasRenderingContext2D['fillText'] | undefined;
let rawMeasure: CanvasRenderingContext2D['measureText'] | undefined;
/** Unfiltered text for what a member typed (names on the postcard): left exactly as written. */
export const fillTextRaw = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void =>
  (rawFill ?? ctx.fillText).call(ctx, text, x, y);
/** ✓ as a stroked path in the fill colour, centred on (x, y): canvas text has no CSS mark and Be Vietnam Pro lacks ✓. */
export function fillCheck(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = Math.max(1.5, size * 0.2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size * 0.42, y);
  ctx.lineTo(x - size * 0.12, y + size * 0.3);
  ctx.lineTo(x + size * 0.42, y - size * 0.32);
  ctx.stroke();
  ctx.restore();
}
export const measureTextRaw = (ctx: CanvasRenderingContext2D, text: string): number =>
  (rawMeasure ?? ctx.measureText).call(ctx, text).width;

/** fillText / strokeText / measureText without emoji, for every canvas of the page (board, minigames, postcard). */
export function installCanvasEmojiFilter(): void {
  const proto = globalThis.CanvasRenderingContext2D?.prototype;
  if (!proto) return;
  const { fillText, strokeText, measureText } = proto;
  rawFill = fillText;
  rawMeasure = measureText;
  // load every sprite once the page is idle: a sprite first met on a canvas would otherwise miss that frame
  globalThis.setTimeout?.(() => new Set(Object.values(SPRITE)).forEach(canvasImg), 1500);
  proto.measureText = function (text: string) {
    return measureText.call(this, stripEmoji(String(text), () => EM));
  };
  proto.strokeText = function (text: string, x: number, y: number, maxWidth?: number) {
    const t = stripEmoji(String(text), () => EM);
    return maxWidth === undefined ? strokeText.call(this, t, x, y) : strokeText.call(this, t, x, y, maxWidth);
  };
  proto.fillText = function (text: string, x: number, y: number, maxWidth?: number) {
    const keys: string[] = [];
    const t = stripEmoji(String(text), (key) => (keys.push(key), EM));
    if (maxWidth === undefined) fillText.call(this, t, x, y);
    else fillText.call(this, t, x, y, maxWidth);
    if (!keys.length) return;
    // ponytail: with maxWidth the browser squeezes the text but the sprites keep their measured spots, so on a squeezed
    // line they drift right by up to (width − maxWidth); scale the offsets by maxWidth / width if that ever shows
    const px = Number(/(\d+(?:\.\d+)?)px/.exec(this.font)?.[1] ?? 12);
    const align = this.textAlign;
    const w = measureText.call(this, t).width;
    let left = x - (align === 'center' ? w / 2 : align === 'right' || align === 'end' ? w : 0);
    const base = this.textBaseline;
    const top = y - (base === 'middle' ? px / 2 : base === 'top' || base === 'hanging' ? 0 : base === 'bottom' || base === 'ideographic' ? px : px * 0.8);
    let from = 0;
    for (const key of keys) {
      const at = t.indexOf(EM, from);
      left += measureText.call(this, t.slice(from, at)).width;
      const img = canvasImg(key);
      if (img) this.drawImage(img, left, top, px, px);
      left += measureText.call(this, EM).width;
      from = at + 1;
    }
  };
}

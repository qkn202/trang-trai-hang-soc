// HPVN đợt E: no emoji on screen (src/hpvn/emoji.ts)
import { describe, expect, it } from 'vitest';
import { GLYPH, KEEP, SPRITE, showsAfterStrip, spriteOf, stripEmoji } from '../../hpvn/emoji';

// emoji reviewed and dropped (14/11): no sprite, not text. A re-pin that brings a new emoji fails below until it is
// sorted into SPRITE (worth a sprite), KEEP (reads as text) or this list.
const DROPPED = new Set([...'⏰⏱⏹☀☄☔☕♻♾⚔⚖⚙⚠⚡⛅⛈⛏⛓⛩⛰⛲✅✋✏✨❄❌🃏🆘🌅🌇🌈🌉🌊🌌🌍🌐🌑🌡🌦🌧🌩🌪🌫🌲🌳🍖🍫🎀🎄🎆🎉🎓🎖🎚🎟🎢🎥🎨🎩🎪🎬🎭🎯🎲🎵🎶🎼🏅🏔🏚🏛🏠🏦🏭🏯🏰🏷🐀🐕🐢🐣🐴🐸🐺👁👆👇👏👑👥👻💀💠💡💰💾📂📅📈📉📊📋📌📍📐📓📖📘📚📰📸📿🔄🔊🔍🔑🔓🔗🔠🔢🔥🔧🔮🔲🔵🕒🕯🕰🕷🖼🗝🗡🗣🗿🚂🚗🚙🚣🚧🚨🛠🛡🟡🟢🤏🤝🥇🥈🥉🥩🦇🦊🦌🦢🧨🧌🧔🧚🧜🧟🧦🧪🧬🧭🧹🧺🪑🪓🪞🪟🪮🪶🫧']);

describe('HPVN emoji filter', () => {
  it('drops colour emoji with one space, keeps text glyphs, marks sprites', () => {
    expect(stripEmoji('🔥 Ván Mới')).toBe('Ván Mới');
    expect(stripEmoji('a 🔥 b ⚠️')).toBe('a b ');
    expect(stripEmoji('🧙‍♂️ Harry · ✓ ★ ♥️ ↩ ♟')).toBe('Harry · ✓ ★ ♥ ↩ ♟');
    expect(stripEmoji('+1 🍀 · 🪙 120', (k) => `[${k}]`)).toBe('+1 [res_clover_luck] · [ui_icon_golden_sickle] 120');
    expect(spriteOf('🗺️')).toBe('ui_icon_world_map');
    expect(showsAfterStrip('🎉')).toBe(false);
    expect(showsAfterStrip('🥧')).toBe(true);
  });

  it('keeps the space an emoji was wedged against, and drops keycap and flag-tag leftovers', () => {
    expect(stripEmoji('Ván🔥 Mới')).toBe('Ván Mới');
    expect(stripEmoji('1️⃣ Mục')).toBe('1 Mục');
    expect(stripEmoji('🔥🌟 X')).toBe('X');
    expect(stripEmoji('\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F} Anh')).toBe('Anh');
    expect(stripEmoji('Harry™ © ® ▶️')).toBe('Harry™ © ® ▶');
  });

  it('every emoji in the source is a sprite, a kept glyph or a reviewed drop', () => {
    const sources = import.meta.glob<string>(['../../**/*.{ts,css}', '!**/__tests__/**'], { query: '?raw', import: 'default', eager: true });
    expect(Object.keys(sources).length).toBeGreaterThan(50);
    const unknown = new Set<string>();
    for (const text of Object.values(sources)) {
      for (const [c] of text.matchAll(/\p{Extended_Pictographic}/gu)) {
        if (!SPRITE[c] && !KEEP.has(c) && !DROPPED.has(c)) unknown.add(c);
      }
    }
    expect([...unknown]).toEqual([]);
  });

  // review 5b: a glyph that is not pictographic (←, ▼, ✔, ⋯ …) slips past the check above and shows in a fallback font.
  // Every U+2190–U+2BFF character outside comments must be in Be Vietnam Pro (fonts.css unicode-range: ↑ ↓ − ∕), have a
  // CSS mark (GLYPH), be sorted above, or be drawn only on canvas (chess pieces, the colour-blind ✦ pattern).
  it('every arrow / symbol glyph outside the font has a CSS mark or is reviewed', () => {
    const sources = import.meta.glob<string>(['../../**/*.{ts,css}', '!**/__tests__/**'], { query: '?raw', import: 'default', eager: true });
    const IN_FONT = new Set([...'↑↓−∕']);
    const CANVAS = new Set([...'♔♕♖♗♘♙♚♛♜♝♞✦♪♫']); // ♪♫: the music notes over a building (renderBuildings, canvas only)
    const unknown = new Set<string>();
    for (const text of Object.values(sources)) {
      const code = text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
      for (const [c] of code.matchAll(/[\u2190-\u2BFF]/gu)) {
        if (!(c in GLYPH) && !IN_FONT.has(c) && !CANVAS.has(c) && !SPRITE[c] && !KEEP.has(c) && !DROPPED.has(c)) unknown.add(c);
      }
    }
    expect([...unknown]).toEqual([]);
  });
});

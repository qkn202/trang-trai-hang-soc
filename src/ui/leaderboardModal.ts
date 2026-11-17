import { avatarGlyph } from '../hpvn/emoji';
import { buildAvatarBadgeHtml, wireAvatarImgFallbacks } from './hudSocialAndTutorial';
import {
  ALL_LEADERBOARD_GAMES,
  fetchCloudLeaderboardEntries,
  isScoredLeaderboardGame,
  LEADERBOARD_GAME_META,
  LeaderboardRowEntry,
  normalizeScoredLeaderboardGame,
  submitPlayerCloudLeaderboardEntry,
} from '../sim/minigameLeaderboard';
import { ParkSimulation } from '../sim/simulation';
import { LeaderboardGameId, LeaderboardScope } from '../types/game';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// the member's HPVN profile picture when there is one (as on the Floo list; a broken link falls back); otherwise every row
// carries the same wizard (the server sends 🧙 for all, the player is 🧙‍♂️): those show the name's initial on a disc of the
// house colour (main.css «BXH»); a real portrait or another chosen avatar stays
const SHARED_AVATARS = new Set(['', '🧙', '🧙‍♂️', '🧙‍♀️', '🌐']);
function avatarHtml(e: LeaderboardRowEntry): string {
  if (e.portraitSprite) return `<img class="hs-lb-av" src="/game/trang-trai-hang-soc/sprites/${escapeHtml(e.portraitSprite)}.webp" alt="">`;
  const glyph = avatarGlyph(SHARED_AVATARS.has(e.avatarEmoji) ? '' : e.avatarEmoji, e.name);
  return buildAvatarBadgeHtml(e.avatarUrl, glyph, 'hs-lb-av');
}
const houseHtml = (e: LeaderboardRowEntry): string => `<span class="hs-lb-house">${escapeHtml(e.house)}</span>`;
// the player's board name is «<vườn> (Bạn)»: the suffix becomes a tag that a long garden name cannot cut
const nameHtml = (e: LeaderboardRowEntry): string =>
  `<span class="hs-lb-line"><span class="hs-lb-name hs-raw">${escapeHtml(e.isPlayer ? e.name.replace(/\s*\(Bạn\)$/, '') : e.name)}</span>${
    e.isPlayer ? '<span class="hs-lb-tag">Bạn</span>' : e.isFriend ? '<span class="hs-lb-tag">Bạn bè</span>' : ''
  }</span>`;
// a row that leaves the board for a garden: one button over the row, with a chevron at its right edge (main.css «BXH»)
const visitHtml = (e: LeaderboardRowEntry): string =>
  !e.isPlayer && e.neighborId
    ? `<button type="button" class="hs-lb-hit" data-lb-visit="${escapeHtml(e.neighborId)}" aria-label="Thăm vườn ${escapeHtml(e.name)}"></button>`
    : '';

// a real podium: three blocks side by side as steps (#2 · #1 highest · #3), the rank cut into each block face with the points
// under it; the avatar stands on its block in a metal ring (#1 larger, with its house crest), the name between them
function podiumHtml(e: LeaderboardRowEntry, place: 1 | 2 | 3): string {
  const crest = place === 1
    ? `<img class="hs-lb-crest" src="/game/trang-trai-hang-soc/sprites/crest-${escapeHtml(e.house.toLowerCase())}.webp" alt="${escapeHtml(e.house)}">`
    : '';
  return `
    <li class="hs-lb-pod place-${place}${e.isPlayer ? ' is-me' : ''}" data-house="${escapeHtml(e.house)}">
      <span class="hs-lb-pod-av">${avatarHtml(e)}${crest}</span>
      ${nameHtml(e)}
      <span class="hs-lb-block"><span class="hs-lb-place" role="img" aria-label="Hạng ${place}">${place}</span><span class="hs-lb-pts">${escapeHtml(e.ratingDisplayVi)}</span><span class="hs-lb-pod-lv">${escapeHtml(e.primaryDisplayVi.replace(/\/777$/, ''))}</span></span>
      ${visitHtml(e)}
    </li>`;
}

// the sub line: the house gives way, the stage («Màn 708», out of 777 everywhere) and your league stay whole; the points column
// holds the points only, so a long garden name keeps its room beside the «Bạn» tag
function rowHtml(e: LeaderboardRowEntry): string {
  const league = e.isPlayer ? `<span class="hs-lb-lv">· ${escapeHtml(e.league.labelVi)}</span>` : '';
  return `
    <li class="hs-lb-row${e.isPlayer ? ' is-me' : ''}" data-house="${escapeHtml(e.house)}">
      <span class="hs-lb-rank">${e.rank.toLocaleString('vi-VN')}</span>
      ${avatarHtml(e)}
      <span class="hs-lb-who">${nameHtml(e)}<span class="hs-lb-sub">${houseHtml(e)}<span class="hs-lb-lv">· ${escapeHtml(e.primaryDisplayVi.replace(/\/777$/, ''))}</span>${league}</span></span>
      <span class="hs-lb-pts">${escapeHtml(e.ratingDisplayVi)}</span>
      ${visitHtml(e)}
    </li>`;
}

export class LeaderboardModalController {
  public activeGameId: LeaderboardGameId = 'match3';
  public activeScope: LeaderboardScope = 'valley';
  public onJumpToGame?: (gameId: LeaderboardGameId) => void;
  public onVisitNeighbor?: (neighborId: string) => void;
  public onOpenNeighborBook?: () => void;

  private readonly root: HTMLElement;
  private readonly sim: ParkSimulation;

  constructor(root: HTMLElement, sim: ParkSimulation) {
    this.root = root;
    this.sim = sim;
  }

  public configure(gameId?: LeaderboardGameId, scope?: LeaderboardScope): void {
    if (gameId) {
      this.activeGameId = isScoredLeaderboardGame(gameId)
        ? gameId
        : ALL_LEADERBOARD_GAMES.includes(this.activeGameId) ? this.activeGameId : normalizeScoredLeaderboardGame(gameId);
    } else if (!ALL_LEADERBOARD_GAMES.includes(this.activeGameId)) {
      this.activeGameId = 'match3';
    }
    if (scope === 'valley' || scope === 'friends' || scope === 'personal') {
      this.activeScope = scope;
    }
  }

  public syncCloud(): void {
    const dlg = this.root.querySelector('#albumDialog') as HTMLDialogElement | null;
    void submitPlayerCloudLeaderboardEntry(this.sim.state, this.activeGameId)
      .catch(() => {})
      .then(() => Promise.all(ALL_LEADERBOARD_GAMES.map((gid) => fetchCloudLeaderboardEntries(gid))))
      .then(() => {
        if (dlg?.open && this.root.querySelector('#leaderboardTabMount')) {
          this.render();
        }
      });
  }

  public open(gameId?: LeaderboardGameId, scope?: LeaderboardScope): void {
    this.configure(gameId, scope);
    const dlg = this.root.querySelector('#albumDialog') as HTMLDialogElement | null;
    this.render();
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    this.syncCloud();
  }

  public close(): void {
    const dlg = this.root.querySelector('#albumDialog') as HTMLDialogElement | null;
    if (dlg?.open) dlg.close();
  }

  public render(mountEl?: HTMLElement | null): void {
    const container =
      mountEl ?? (this.root.querySelector('#leaderboardTabMount') as HTMLElement | null);
    if (!container) return;

    // HPVN (owner 15/11 «làm lại UI full trang này»): game tabs · scope + play · podium of three · one list of rows.
    // The game is named by its tab; no banner, no house cards (the Cúp tab holds the week), no explaining notes.
    const gameTabsHtml = ALL_LEADERBOARD_GAMES.map((gid) => {
      const m = LEADERBOARD_GAME_META[gid];
      const isAct = gid === this.activeGameId;
      return `<button type="button" role="tab" aria-selected="${isAct}" data-lb-game="${gid}" class="lb-game-tab ${isAct ? 'active' : ''}" title="${escapeHtml(m.titleVi)}"><span class="lb-tab-copy"><strong>${escapeHtml(m.tabVi)}</strong></span></button>`;
    }).join('');

    const scope = (id: LeaderboardScope, label: string) =>
      `<button type="button" role="tab" aria-selected="${this.activeScope === id}" data-lb-scope="${id}" class="lb-scope-pill ${this.activeScope === id ? 'active' : ''}">${label}</button>`;
    const meta = LEADERBOARD_GAME_META[this.activeGameId];
    const toolbarHtml = `
      <div class="hs-lb-bar">
        <div class="lb-scope-pills" role="tablist" aria-label="Phạm vi bảng xếp hạng">${scope('valley', 'Thung Lũng')}${scope('friends', 'Bạn Bè')}${scope('personal', 'Kỷ Lục')}</div>
        <button id="btnLbPlayActiveGame" type="button" class="brass-btn gold-cta hs-lb-play" aria-label="Chơi ${escapeHtml(meta.shortVi)}">Chơi</button>
      </div>`;

    container.innerHTML = `
      <div class="lb-shell">
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">${gameTabsHtml}</div>
        ${toolbarHtml}
        ${this.activeScope === 'personal' ? this.renderRecordsHtml() : this.renderStandingHtml(this.activeScope)}
      </div>
    `;
    wireAvatarImgFallbacks(container);

    this.bindEvents(container);
  }

  private renderStandingHtml(scope: 'valley' | 'friends'): string {
    const { entries } = this.sim.getMinigameLeaderboard(this.activeGameId, scope, 'all');
    // under three people a podium is a lone block: the board stays a plain list. Bạn Bè ends on one row: the count + «Thêm bạn»
    const friends = entries.filter((e) => !e.isPlayer).length;
    const foot = scope === 'friends'
      ? `<div class="hs-lb-foot"><span class="hs-lb-foot-n">${friends ? `${friends.toLocaleString('vi-VN')} bạn` : 'Chưa có bạn'}</span><button id="btnLbOpenFriendsBook" type="button" class="brass-btn hs-lb-add">Thêm bạn</button></div>`
      : '';
    if (!entries.length) return foot || `<p class="hs-lb-note">Chưa có học viên.</p>`;
    if (entries.length < 3) return `<ol class="hs-lb-list">${entries.map((e) => rowHtml(e)).join('')}</ol>${foot}`;
    const top = ([1, 2, 3] as const).map((place) => podiumHtml(entries[place - 1], place)).join('');
    const rest = entries.slice(3).map((e) => rowHtml(e)).join('');
    return `<ol class="hs-lb-podium" aria-label="Top 3">${top}</ol>${rest ? `<ol class="hs-lb-list" start="4">${rest}</ol>` : ''}${foot}`;
  }

  private renderRecordsHtml(): string {
    const rows = this.sim.getAllPersonalLeaderboardSummaries().map((s) => `
      <li class="hs-lb-row is-game">
        <img class="hs-lb-av" src="${s.meta.spriteIcon}" alt="">
        <span class="hs-lb-who"><span class="hs-lb-line"><span class="hs-lb-name">${escapeHtml(s.meta.tabVi)}</span></span><span class="hs-lb-sub">${escapeHtml(s.primaryDisplayVi)} · Hạng ${s.valleyRank}/${s.valleyTotal}</span></span>
        <span class="hs-lb-pts">${escapeHtml(s.ratingDisplayVi)}</span>
        <button type="button" class="hs-lb-hit" data-lb-jump-play="${s.gameId}" aria-label="Chơi ${escapeHtml(s.meta.shortVi)}"></button>
      </li>`).join('');
    return `<ol class="hs-lb-list is-records">${rows}</ol>`;
  }

  private bindEvents(container: HTMLElement): void {
    container.querySelectorAll<HTMLButtonElement>('[data-lb-game]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.lbGame as LeaderboardGameId | undefined;
        if (!gid || !ALL_LEADERBOARD_GAMES.includes(gid)) return;
        this.sim.audio.playClick();
        this.activeGameId = gid;
        if (this.activeScope === 'personal') {
          this.activeScope = 'valley';
        }
        this.render();
        void submitPlayerCloudLeaderboardEntry(this.sim.state, gid)
          .catch(() => {})
          .then(() => fetchCloudLeaderboardEntries(gid))
          .then((cloud) => {
            if (cloud.length > 0 && this.activeGameId === gid) {
              this.render();
            }
          });
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-lb-scope]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sc = btn.dataset.lbScope as LeaderboardScope | undefined;
        if (!sc) return;
        this.sim.audio.playClick();
        this.activeScope = sc;
        this.render();
      });
    });

    container.querySelector('#btnLbPlayActiveGame')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      const target = this.activeGameId;
      this.close();
      this.onJumpToGame?.(target);
    });

    container.querySelector('#btnLbOpenFriendsBook')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.close();
      this.onOpenNeighborBook?.();
    });

    container.querySelectorAll<HTMLButtonElement>('[data-lb-jump-play]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.lbJumpPlay as LeaderboardGameId | undefined;
        if (!gid) return;
        this.sim.audio.playClick();
        this.close();
        this.onJumpToGame?.(gid);
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-lb-visit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.lbVisit;
        if (!nid) return;
        this.sim.audio.playClick();
        this.close();
        this.onVisitNeighbor?.(nid);
      });
    });
  }
}

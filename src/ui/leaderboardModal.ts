import {
  ALL_HOGWARTS_HOUSES,
  ALL_LEADERBOARD_GAMES,
  fetchCloudLeaderboardEntries,
  HOGWARTS_HOUSE_META,
  HouseCupStanding,
  isScoredLeaderboardGame,
  LEADERBOARD_GAME_META,
  LeaderboardRowEntry,
  normalizeScoredLeaderboardGame,
  submitPlayerCloudLeaderboardEntry,
  syncAllPlayerCloudLeaderboards,
} from '../sim/minigameLeaderboard';
import { ParkSimulation } from '../sim/simulation';
import { HouseName, LeaderboardGameId, LeaderboardScope } from '../types/game';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getHouseBadgeVi(house: HouseName): { emoji: string; label: string; cls: string } {
  const m = HOGWARTS_HOUSE_META[house] ?? HOGWARTS_HOUSE_META.Gryffindor;
  return {
    emoji: m.mascotEmoji,
    label: m.house,
    cls: `house-${m.cssSlug}`,
  };
}

function formatRankMedal(rank: number): string {
  if (rank === 1) return '🥇 #1';
  if (rank === 2) return '🥈 #2';
  if (rank === 3) return '🥉 #3';
  return `#${rank}`;
}

export class LeaderboardModalController {
  public activeGameId: LeaderboardGameId = 'match3';
  public activeScope: LeaderboardScope = 'valley';
  public activeHouseFilter: 'all' | HouseName = 'all';
  private redirectedFromUnscored: LeaderboardGameId | null = null;
  public onJumpToGame?: (gameId: LeaderboardGameId) => void;
  public onVisitNeighbor?: (neighborId: string) => void;
  public onOpenNeighborBook?: () => void;

  private readonly root: HTMLElement;
  private readonly sim: ParkSimulation;
  private closeBound = false;
  private sortingHatSpinning = false;

  constructor(root: HTMLElement, sim: ParkSimulation) {
    this.root = root;
    this.sim = sim;
    this.ensureDialogMounted();
  }

  private ensureDialogMounted(): HTMLDialogElement {
    let dlg = this.root.querySelector('#leaderboardDialog') as HTMLDialogElement | null;
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.id = 'leaderboardDialog';
      dlg.setAttribute('closedby', 'any');
      dlg.setAttribute('aria-labelledby', 'leaderboardDialogTitle');
      dlg.innerHTML = `
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      `;
      this.root.appendChild(dlg);
    }

    if (!this.closeBound) {
      this.closeBound = true;
      dlg.addEventListener('close', () => {
        dlg!.returnValue = '';
      });

      // Fallback light-dismiss for browsers without native dialog.closedBy support
      if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
        dlg.addEventListener('click', (event) => {
          if (event.target !== dlg) return;
          const rect = dlg!.getBoundingClientRect();
          const inside =
            rect.top <= event.clientY &&
            event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX &&
            event.clientX <= rect.left + rect.width;
          if (!inside) dlg!.close();
        });
      }
    }

    return dlg;
  }

  public open(
    gameId?: LeaderboardGameId,
    scope?: LeaderboardScope,
    houseFilter?: 'all' | HouseName
  ): void {
    if (gameId) {
      if (isScoredLeaderboardGame(gameId)) {
        this.redirectedFromUnscored = null;
        this.activeGameId = gameId;
      } else {
        this.redirectedFromUnscored = gameId;
        this.activeGameId = ALL_LEADERBOARD_GAMES.includes(this.activeGameId)
          ? this.activeGameId
          : normalizeScoredLeaderboardGame(gameId);
      }
    } else {
      this.redirectedFromUnscored = null;
      if (!ALL_LEADERBOARD_GAMES.includes(this.activeGameId)) {
        this.activeGameId = 'match3';
      }
    }
    if (scope === 'valley' || scope === 'friends' || scope === 'personal') {
      this.activeScope = scope;
    }
    if (
      houseFilter === 'all' ||
      (houseFilter && ALL_HOGWARTS_HOUSES.includes(houseFilter))
    ) {
      this.activeHouseFilter = houseFilter;
    }

    const dlg = this.ensureDialogMounted();
    this.render();
    if (!dlg.open) {
      dlg.showModal();
    }

    void syncAllPlayerCloudLeaderboards(this.sim.state)
      .catch(() => {})
      .then(() =>
        Promise.all(ALL_LEADERBOARD_GAMES.map((gid) => fetchCloudLeaderboardEntries(gid)))
      )
      .then(() => {
        if (dlg.open) {
          this.render();
        }
      });
  }

  public close(): void {
    const dlg = this.root.querySelector('#leaderboardDialog') as HTMLDialogElement | null;
    if (dlg?.open) dlg.close();
  }

  private renderHouseCupSectionHtml(
    houseStandings: ReadonlyArray<HouseCupStanding>,
    playerHouse: HouseName
  ): string {
    const playerHouseMeta = HOGWARTS_HOUSE_META[playerHouse] ?? HOGWARTS_HOUSE_META.Gryffindor;

    const houseCardsHtml = houseStandings
      .map((item) => {
        const h = item.meta;
        const isFiltered = this.activeHouseFilter === item.house;
        const rankCrown =
          item.rank === 1 ? '🥇 #1' : item.rank === 2 ? '🥈 #2' : item.rank === 3 ? '🥉 #3' : `#${item.rank}`;
        return `
          <button
            type="button"
            class="house-cup-card house-card-${h.cssSlug} ${item.isPlayerHouse ? 'is-player-house' : ''} ${isFiltered ? 'is-filtered-house' : ''}"
            data-lb-house-card="${item.house}"
            aria-pressed="${isFiltered}"
            title="${escapeHtml(h.vnTitle)} (${escapeHtml(h.gemNameVi)})"
          >
            <div class="house-cup-top">
              <span class="house-cup-crest" aria-hidden="true">${h.emblemSvg}</span>
              <div class="house-cup-meta">
                <div class="house-cup-name-row">
                  <strong>${rankCrown} ${escapeHtml(h.house)}</strong>
                  ${item.isPlayerHouse ? `<span class="house-you-pill">Bạn</span>` : ''}
                </div>
                <div class="house-cup-vn-title">${h.gemEmoji} ${escapeHtml(h.gemShortVi)} • 👥 ${item.members}</div>
              </div>
              <span class="house-cup-hourglass-icon" aria-hidden="true" title="Đồng hồ cát ${escapeHtml(h.gemNameVi)}">${h.hourglassSvg}</span>
            </div>
            <div class="house-cup-points-row">
              <span class="house-cup-points">${item.points.toLocaleString('vi-VN')} đ</span>
              <span class="house-cup-patronus" title="${escapeHtml(h.patronusNameVi)}">${h.patronusEmoji}</span>
            </div>
            <div class="hourglass-bar" role="progressbar" aria-valuenow="${item.fillPercent}" aria-valuemin="0" aria-valuemax="100" aria-label="Mực đá quý ${escapeHtml(h.gemShortVi)} của nhà ${escapeHtml(h.house)}">
              <div class="hourglass-bar-fill" style="width:${item.fillPercent}%"></div>
            </div>
          </button>
        `;
      })
      .join('');

    const houseSelectorBtnsHtml = ALL_HOGWARTS_HOUSES.map((hName) => {
      const hm = HOGWARTS_HOUSE_META[hName];
      const isMyHouse = hName === playerHouse;
      return `
        <button
          type="button"
          class="lb-my-house-btn house-pill-${hm.cssSlug} ${isMyHouse ? 'active' : ''}"
          data-lb-pick-house="${hName}"
          aria-pressed="${isMyHouse}"
          title="${escapeHtml(hm.vnTitle)} (${escapeHtml(hm.traitsVi)})"
        >
          ${hm.mascotEmoji} ${escapeHtml(hm.house)}
        </button>
      `;
    }).join('');

    const filterPillsHtml = [
      `
        <button
          type="button"
          class="filter-pill ${this.activeHouseFilter === 'all' ? 'active' : ''}"
          data-lb-house-filter="all"
          aria-pressed="${this.activeHouseFilter === 'all'}"
        >
          🏰 Tất Cả
        </button>
      `,
      ...ALL_HOGWARTS_HOUSES.map((hName) => {
        const hm = HOGWARTS_HOUSE_META[hName];
        const isAct = this.activeHouseFilter === hName;
        const count = houseStandings.find((s) => s.house === hName)?.members ?? 0;
        return `
          <button
            type="button"
            class="filter-pill filter-pill-${hm.cssSlug} ${isAct ? 'active' : ''}"
            data-lb-house-filter="${hName}"
            aria-pressed="${isAct}"
          >
            ${hm.mascotEmoji} ${escapeHtml(hm.house)} <span class="filter-pill-count">(${count})</span>
          </button>
        `;
      }),
    ].join('');

    return `
      <section class="house-cup-section" aria-label="Cúp 4 Nhà Hogwarts">
        <div class="house-cup-header-bar">
          <div class="house-cup-heading-copy">
            <h3 class="house-cup-heading">🏆 Cúp 4 Nhà Hogwarts</h3>
            <p class="house-cup-quote">🍬 Bùa Gặt Honeydukes • 🔢 Số Học Huyền Bí • 🦄 Sinh Vật Huyền Bí</p>
          </div>
          <div class="lb-sorting-hat-box">
            <div class="lb-sorting-hat-label">
              <span>${this.sim.state.minigameLeaderboard?.playerHouseLockedByServer ? '🏰' : '🎩'} <strong>${playerHouseMeta.mascotEmoji} ${escapeHtml(playerHouseMeta.house)}</strong></span>
              ${
                this.sim.state.minigameLeaderboard?.playerHouseLockedByServer
                  ? `<span class="house-you-pill" title="Tự động đồng bộ theo tài khoản diễn đàn HPVN">Tài khoản HPVN</span>`
                  : `<button
                id="btnLbSortingHat"
                type="button"
                class="brass-btn lb-hat-roll-btn ${this.sortingHatSpinning ? 'is-spinning' : ''}"
                title="Đội Chiếc Nón Phân Loại"
              >
                🎩 Phân Loại
              </button>`
              }
            </div>
            ${
              this.sim.state.minigameLeaderboard?.playerHouseLockedByServer
                ? ''
                : `<div class="lb-my-house-pills" role="group" aria-label="Chọn Nhà Hogwarts của bạn">
              ${houseSelectorBtnsHtml}
            </div>`
            }
          </div>
        </div>

        <div class="hourglass-grid" id="house-cup-grid">
          ${houseCardsHtml}
        </div>

        <div class="lb-controls">
          <div class="lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc bảng xếp hạng theo Nhà Hogwarts">
            ${filterPillsHtml}
          </div>
        </div>
      </section>
    `;
  }

  public render(): void {
    const container = this.root.querySelector('#leaderboardDialogContent') as HTMLElement | null;
    if (!container) return;

    const activeMeta = LEADERBOARD_GAME_META[this.activeGameId];
    const titleEl = this.root.querySelector('#leaderboardDialogTitle') as HTMLElement | null;
    if (titleEl) {
      titleEl.innerHTML = `🏆 Bảng Xếp Hạng • ${escapeHtml(activeMeta.shortVi)}`;
    }

    // 1. 3 Scored Mini-Game Discipline Tabs with live rank pill
    const gameTabsHtml = ALL_LEADERBOARD_GAMES.map((gid) => {
      const m = LEADERBOARD_GAME_META[gid];
      const rank = this.sim.getPlayerMinigameRank(gid, 'valley');
      const isAct = gid === this.activeGameId;
      return `
        <button
          type="button"
          role="tab"
          aria-selected="${isAct}"
          data-lb-game="${gid}"
          class="lb-game-tab ${isAct ? 'active' : ''}"
          title="${escapeHtml(m.titleVi)} — #${rank}"
        >
          <img src="${m.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${escapeHtml(m.shortVi)}</strong>
            <span class="lb-tab-rank-pill">${rank <= 3 ? '👑 ' : ''}#${rank}</span>
          </span>
        </button>
      `;
    }).join('');

    // 2. Scope Switcher (Valley / Friends / Personal) + Jump CTA
    const scopeTabsHtml = `
      <div class="lb-toolbar-row">
        <div class="lb-scope-pills" role="tablist" aria-label="Phạm vi bảng xếp hạng">
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope === 'valley'}"
            data-lb-scope="valley"
            class="lb-scope-pill ${this.activeScope === 'valley' ? 'active' : ''}"
          >
            🌍 Thung Lũng
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope === 'friends'}"
            data-lb-scope="friends"
            class="lb-scope-pill ${this.activeScope === 'friends' ? 'active' : ''}"
          >
            🤝 Bạn Bè
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope === 'personal'}"
            data-lb-scope="personal"
            class="lb-scope-pill ${this.activeScope === 'personal' ? 'active' : ''}"
          >
            📜 Kỷ Lục
          </button>
        </div>

        <div class="lb-toolbar-actions">
          ${
            this.activeScope === 'friends'
              ? `<button id="btnLbOpenFriendsBook" type="button" class="brass-btn lb-action-btn" title="Kết bạn qua Mã Điền Trang">
                  🦉 Thêm Bạn
                </button>`
              : ''
          }
          <button id="btnLbPlayActiveGame" type="button" class="brass-btn gold-cta lb-action-btn">
            ▶️ ${escapeHtml(activeMeta.shortVi)}
          </button>
        </div>
      </div>
    `;

    const bodyContentHtml =
      this.activeScope === 'personal'
        ? this.renderPersonalThreeGamesTableHtml()
        : this.renderStandingViewHtml(this.activeScope);

    const unscoredNoticeHtml = this.redirectedFromUnscored
      ? `<div class="lb-unscored-note" role="note">
          📌 <strong>${escapeHtml(LEADERBOARD_GAME_META[this.redirectedFromUnscored]?.shortVi ?? '')}</strong> là môn rèn luyện tự do không xếp hạng — dưới đây là Bảng Xếp Hạng <strong>3 môn tính điểm</strong> (Bùa Gặt • Số Học • Sinh Vật).
        </div>`
      : '';

    container.innerHTML = `
      <div class="lb-shell">
        ${unscoredNoticeHtml}
        <div class="lb-game-tabs" role="tablist" aria-label="Chọn bảng xếp hạng từng mini game">
          ${gameTabsHtml}
        </div>
        ${scopeTabsHtml}
        ${bodyContentHtml}
      </div>
    `;

    this.bindEvents(container);
  }

  private renderPodiumCardHtml(entry: LeaderboardRowEntry | undefined, place: 1 | 2 | 3): string {
    if (!entry) return '';
    const crownEmoji = place === 1 ? '🥇' : place === 2 ? '🥈' : '🥉';
    const houseMeta = getHouseBadgeVi(entry.house);
    const avatarHtml = entry.portraitSprite
      ? `<img src="/sprites/${escapeHtml(entry.portraitSprite)}.png" alt="" class="lb-podium-avatar-img" />`
      : `<span class="lb-podium-avatar-emoji" aria-hidden="true">${escapeHtml(entry.avatarEmoji)}</span>`;

    return `
      <div class="lb-podium-card place-${place} ${entry.isPlayer ? 'is-player' : ''}">
        <div class="lb-podium-medal">${crownEmoji} #${place}</div>
        <div class="lb-podium-avatar-wrap">${avatarHtml}</div>
        <div class="lb-podium-name">${escapeHtml(entry.name)}</div>
        <div class="lb-podium-house ${houseMeta.cls}">${houseMeta.emoji} ${houseMeta.label}</div>
        <div class="lb-podium-primary">${escapeHtml(entry.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${escapeHtml(entry.ratingDisplayVi)}</div>
      </div>
    `;
  }

  private renderStandingViewHtml(scope: 'valley' | 'friends'): string {
    const standing = this.sim.getMinigameLeaderboard(
      this.activeGameId,
      scope,
      this.activeHouseFilter
    );
    const {
      meta,
      entries,
      playerEntry,
      playerRank,
      totalEntries,
      nextRivalAbove,
      houseStandings,
      playerHouse,
    } = standing;

    const chaseBannerText = nextRivalAbove
      ? `🎯 Đuổi <strong>#${nextRivalAbove.rank} ${escapeHtml(nextRivalAbove.name)}</strong> (${escapeHtml(nextRivalAbove.primaryDisplayVi)})`
      : `👑 Đang dẫn đầu <strong>#1</strong> (${escapeHtml(meta.shortVi)})`;

    const houseCupHtml = this.renderHouseCupSectionHtml(houseStandings, playerHouse);

    const podiumHtml =
      entries.length > 0
        ? `
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(entries[1], 2)}
        ${this.renderPodiumCardHtml(entries[0], 1)}
        ${this.renderPodiumCardHtml(entries[2], 3)}
      </div>
    `
        : '';

    const rowsHtml =
      entries.length > 0
        ? entries
            .map((row) => {
              const houseMeta = getHouseBadgeVi(row.house);
              const rankText = formatRankMedal(row.rank);
              const roleTag = row.isPlayer
                ? `<span class="lb-role-tag you">Bạn</span>`
                : row.isCloudPlayer
                  ? `<span class="lb-role-tag cloud">🌐</span>`
                  : row.isFriend
                    ? `<span class="lb-role-tag friend">🤝</span>`
                    : '';
              const visitBtn =
                !row.isPlayer && row.neighborId
                  ? `<button type="button" class="lb-mini-visit-btn" data-lb-visit="${escapeHtml(row.neighborId)}" title="Thăm ${escapeHtml(row.name)}">🏡</button>`
                  : '';

              return `
          <tr class="lb-row ${row.isPlayer ? 'is-player' : ''} ${row.rank <= 3 ? `top-${row.rank}` : ''}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <span class="lb-rank-chip rank-${Math.min(4, row.rank)}">${rankText}</span>
                <span class="lb-avatar-badge" aria-hidden="true">${escapeHtml(row.avatarEmoji)}</span>
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${escapeHtml(row.name)}</strong>
                    ${roleTag}
                  </div>
                  <div class="lb-contender-sub">
                    <span class="${houseMeta.cls}">${houseMeta.emoji} ${houseMeta.label}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <span class="lb-league-pill tier-${row.league.tierId}">${row.league.icon} ${escapeHtml(row.league.labelVi)}</span>
            </td>
            <td class="lb-cell-primary">
              <strong>${escapeHtml(row.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${escapeHtml(row.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${escapeHtml(row.detailDisplayVi)}</span>
                ${visitBtn}
              </div>
            </td>
          </tr>
        `;
            })
            .join('')
        : `
          <tr class="lb-row lb-empty-house-row">
            <td colspan="5" class="lb-empty-house-cell">
              Chưa có học viên.
            </td>
          </tr>
        `;

    return `
      <div class="lb-cup-banner">
        <img src="${meta.spriteIcon}" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">${escapeHtml(meta.shortVi)}</div>
          <div class="lb-cup-chase">${chaseBannerText}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng</span>
          <strong class="lb-player-rank-num">#${playerRank}<span>/${totalEntries}</span></strong>
          <span class="lb-league-pill tier-${playerEntry.league.tierId}">${playerEntry.league.icon} ${escapeHtml(playerEntry.league.labelVi)}</span>
        </div>
      </div>

      ${houseCupHtml}

      ${podiumHtml}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Bậc'; --label-3: '${escapeHtml(meta.primaryColVi)}'; --label-4: '${escapeHtml(meta.secondaryColVi)}'; --label-5: 'Chi Tiết';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            ${escapeHtml(meta.shortVi)} (${entries.length}/${totalEntries})
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bậc</th>
              <th scope="col">${escapeHtml(meta.primaryColVi)}</th>
              <th scope="col">${escapeHtml(meta.secondaryColVi)}</th>
              <th scope="col">Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderPersonalThreeGamesTableHtml(): string {
    const summaries = this.sim.getAllPersonalLeaderboardSummaries();
    const rowsHtml = summaries
      .map(
        (s) => `
          <tr class="lb-row ${s.gameId === this.activeGameId ? 'is-player' : ''}">
            <th scope="row" class="lb-cell-contender">
              <div class="lb-contender-wrap">
                <img src="${s.meta.spriteIcon}" alt="" class="lb-tab-sprite" />
                <div class="lb-contender-meta">
                  <div class="lb-contender-name-line">
                    <strong>${escapeHtml(s.meta.shortVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${s.league.tierId}">${s.league.icon} ${escapeHtml(s.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${s.valleyRank}/${s.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 #${s.friendsRank}/${s.friendsTotal}</div>
            </td>
            <td class="lb-cell-primary">
              <strong>${escapeHtml(s.primaryDisplayVi)}</strong>
            </td>
            <td class="lb-cell-rating">
              <strong>${escapeHtml(s.ratingDisplayVi)}</strong>
            </td>
            <td class="lb-cell-detail">
              <div class="lb-detail-flex">
                <span>${escapeHtml(s.detailDisplayVi)}</span>
                <button type="button" class="brass-btn gold-cta lb-mini-play-btn" data-lb-jump-play="${s.gameId}">
                  ▶️ Chơi
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join('');

    return `
      <div class="lb-cup-banner">
        <img src="/sprites/m3_icon_star.png" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">📜 Kỷ Lục 3 Môn Tính Điểm</div>
          <div class="lb-cup-sub">🍬 Bùa Gặt Honeydukes • 🔢 Số Học Huyền Bí • 🦄 Sinh Vật Huyền Bí</div>
        </div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="lbPersonalTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Hạng'; --label-3: 'Đỉnh'; --label-4: 'Điểm'; --label-5: 'Chơi';"
        >
          <caption id="lbPersonalTableCaption" class="lb-table-caption">
            Kỷ lục cá nhân 3 môn tính điểm
          </caption>
          <thead>
            <tr>
              <th scope="col">Môn</th>
              <th scope="col">Hạng</th>
              <th scope="col">Đỉnh</th>
              <th scope="col">Điểm</th>
              <th scope="col">Chơi</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
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
          .then(() => {
            if (this.activeGameId === gid) {
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

    container.querySelectorAll<HTMLButtonElement>('[data-lb-house-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.lbHouseFilter;
        if (!raw) return;
        this.sim.audio.playClick();
        if (raw === 'all') {
          this.activeHouseFilter = 'all';
        } else if (ALL_HOGWARTS_HOUSES.includes(raw as HouseName)) {
          this.activeHouseFilter = raw as HouseName;
        }
        this.render();
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-lb-house-card]').forEach((card) => {
      card.addEventListener('click', () => {
        const raw = card.dataset.lbHouseCard as HouseName | undefined;
        if (!raw || !ALL_HOGWARTS_HOUSES.includes(raw)) return;
        this.sim.audio.playClick();
        this.activeHouseFilter = this.activeHouseFilter === raw ? 'all' : raw;
        this.render();
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-lb-pick-house]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.lbPickHouse as HouseName | undefined;
        if (!raw || !ALL_HOGWARTS_HOUSES.includes(raw)) return;
        this.sim.setPlayerHouse(raw, this.activeGameId);
        if (this.activeHouseFilter !== 'all') {
          this.activeHouseFilter = raw;
        }
        this.render();
      });
    });

    container.querySelector('#btnLbSortingHat')?.addEventListener('click', () => {
      if (this.sortingHatSpinning) return;
      this.sortingHatSpinning = true;
      const chosen = this.sim.rollPlayerSortingHat(this.activeGameId);
      if (this.activeHouseFilter !== 'all') {
        this.activeHouseFilter = chosen;
      }
      this.render();
      window.setTimeout(() => {
        this.sortingHatSpinning = false;
        this.render();
      }, 420);
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

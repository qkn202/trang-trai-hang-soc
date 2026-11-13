import {
  ALL_HOGWARTS_HOUSES,
  ALL_LEADERBOARD_GAMES,
  exportMinigameLeaderboardCSV,
  fetchCloudLeaderboardEntries,
  getCachedCloudLeaderboardEntries,
  HOGWARTS_HOUSE_META,
  HouseCupStanding,
  isScoredLeaderboardGame,
  LEADERBOARD_GAME_META,
  LeaderboardRowEntry,
  MAX_PUZZLE_TOWER_STAGE,
  normalizeScoredLeaderboardGame,
  submitPlayerCloudLeaderboardEntry,
  syncAllPlayerCloudLeaderboards,
  toggleLeaderboardSeededRivals,
  updatePlayerWizardProfile,
} from '../sim/minigameLeaderboard';
import {
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  ParkSimulation,
} from '../sim/simulation';
import { HouseName, LeaderboardGameId, LeaderboardScope } from '../types/game';

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCandyRankBadge(rank: number): string {
  if (rank === 1) return '🥇 1';
  if (rank === 2) return '🥈 2';
  if (rank === 3) return '🥉 3';
  return `#${rank}`;
}

function stripTrailingPlayerSuffix(name: string): string {
  return name.replace(/\s*\(Bạn\)\s*$/u, '').trim() || name;
}

const DIALOG_CARD_INNER_HTML = `
  <div class="parchment-panel modal-inner lb-modal-inner cc-lb-card">
    <div class="modal-header cc-lb-header">
      <div class="cc-lb-title-stack">
        <span class="cc-lb-ribbon-sub">ĐẠI SẢNH ĐƯỜNG HANG SÓC • 3 MÔN TRANH CÚP</span>
        <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng &amp; Cúp 4 Nhà</h2>
      </div>
      <form method="dialog" class="cc-lb-close-form">
        <button type="submit" class="brass-btn" aria-label="Đóng bảng xếp hạng" autofocus>✕</button>
      </form>
    </div>
    <div id="leaderboardLiveAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
    <div id="leaderboardDialogToast" class="cc-lb-toast" hidden></div>
    <div id="leaderboardDialogContent"></div>
  </div>
`;

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
  private profileDrawerOpen = false;
  private profileDraftName: string | null = null;
  private profileDraftHouse: HouseName | null = null;
  private sortingHatAnnouncement = '';
  private toastTimer: number | null = null;
  private liveTimer: number | null = null;

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
      dlg.className = 'cc-lb-dialog';
      dlg.setAttribute('closedby', 'any');
      dlg.setAttribute('aria-labelledby', 'leaderboardDialogTitle');
      dlg.innerHTML = DIALOG_CARD_INNER_HTML;
      this.root.appendChild(dlg);
    } else if (!dlg.querySelector('.cc-lb-card')) {
      dlg.classList.add('cc-lb-dialog');
      dlg.setAttribute('closedby', 'any');
      dlg.setAttribute('aria-labelledby', 'leaderboardDialogTitle');
      dlg.innerHTML = DIALOG_CARD_INNER_HTML;
    }

    if (!this.closeBound) {
      this.closeBound = true;
      dlg.addEventListener('close', () => {
        dlg!.returnValue = '';
      });

      // Fallback light-dismiss where native dialog.closedBy is missing (Safari / older WebKit)
      if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
        const isOutside = (ev: PointerEvent, dialogEl: HTMLDialogElement): boolean => {
          const r = dialogEl.getBoundingClientRect();
          return (
            ev.clientX < r.left ||
            ev.clientX > r.right ||
            ev.clientY < r.top ||
            ev.clientY > r.bottom
          );
        };
        let pressedOutside = false;
        dlg.addEventListener('pointerdown', (ev) => {
          pressedOutside = isOutside(ev, dlg!);
        });
        dlg.addEventListener('pointerup', (ev) => {
          if (pressedOutside && isOutside(ev, dlg!)) {
            dlg!.close();
          }
          pressedOutside = false;
        });
      }
    }

    return dlg;
  }

  private showInDialogToast(message: string): void {
    const toastEl = this.root.querySelector('#leaderboardDialogToast') as HTMLElement | null;
    const liveEl = this.root.querySelector('#leaderboardLiveAnnouncer') as HTMLElement | null;
    if (toastEl) {
      toastEl.textContent = message;
      toastEl.hidden = false;
      if (this.toastTimer !== null) {
        window.clearTimeout(this.toastTimer);
      }
      this.toastTimer = window.setTimeout(() => {
        toastEl.hidden = true;
        this.toastTimer = null;
      }, 2800);
    }
    if (liveEl) {
      if (this.liveTimer !== null) {
        window.clearTimeout(this.liveTimer);
      }
      liveEl.textContent = '';
      this.liveTimer = window.setTimeout(() => {
        liveEl.textContent = message;
        this.liveTimer = null;
      }, 50);
    }
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

    this.profileDraftName = null;
    this.profileDraftHouse = null;
    this.sortingHatAnnouncement = '';

    const dlg = this.ensureDialogMounted();
    this.render();
    if (!dlg.open) {
      dlg.showModal();
    }

    this.scrollSelectedGameTabIntoView();

    void syncAllPlayerCloudLeaderboards(this.sim.state)
      .catch(() => {})
      .then(() =>
        Promise.all(ALL_LEADERBOARD_GAMES.map((gid) => fetchCloudLeaderboardEntries(gid)))
      )
      .then(() => {
        if (dlg.open && !this.profileDrawerOpen) {
          this.render();
        }
      });
  }

  public close(): void {
    const dlg = this.root.querySelector('#leaderboardDialog') as HTMLDialogElement | null;
    if (dlg?.open) dlg.close();
  }

  private scrollSelectedGameTabIntoView(focusSelected = false): void {
    const selectedTab = this.root.querySelector<HTMLButtonElement>(
      '.cc-lb-game-tabs [role="tab"][aria-selected="true"]'
    );
    if (!selectedTab) return;
    if (focusSelected) {
      selectedTab.focus();
    }
    if (typeof selectedTab.scrollIntoView === 'function') {
      try {
        selectedTab.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          container: 'nearest',
        } as ScrollIntoViewOptions);
      } catch {
        selectedTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }

  private getCurrentWizardDisplayName(): string {
    return (
      this.sim.state.neighborSocial?.playerDisplayName?.trim() ||
      this.sim.state.parkName?.trim() ||
      'Phù Thủy Hang Sóc'
    );
  }

  private renderHouseCupGridHtml(houseStandings: ReadonlyArray<HouseCupStanding>): string {
    const cardsHtml = houseStandings
      .map((item) => {
        const h = item.meta;
        const isFiltered = this.activeHouseFilter === item.house;
        return `
          <button
            type="button"
            class="cc-house-cup-card cc-house-${h.cssSlug} ${item.isPlayerHouse ? 'is-player-house' : ''} ${isFiltered ? 'is-filtered-house' : ''}"
            data-lb-house-card="${item.house}"
            aria-pressed="${isFiltered}"
          >
            <div class="cc-house-cup-top">
              <span class="cc-house-cup-crest" aria-hidden="true">${h.emblemSvg}</span>
              <div class="cc-house-cup-meta">
                <div class="cc-house-cup-name-row">
                  <strong>#${item.rank} ${escapeHtml(h.house)}</strong>
                  ${item.isPlayerHouse ? `<span class="cc-house-you-pill">Bạn</span>` : ''}
                </div>
                <div class="cc-house-cup-stats">${item.members} thành viên • ${item.totalStars.toLocaleString('vi-VN')} ★</div>
              </div>
              <span class="cc-house-cup-hourglass" aria-hidden="true">${h.hourglassSvg}</span>
            </div>
            <div class="cc-house-cup-points">${item.points.toLocaleString('vi-VN')} đ</div>
            <div
              class="cc-hourglass-bar"
              role="progressbar"
              aria-valuenow="${item.fillPercent}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Điểm Cúp Nhà ${escapeHtml(h.house)}"
            >
              <div class="cc-hourglass-bar-fill" style="width:${item.fillPercent}%"></div>
            </div>
          </button>
        `;
      })
      .join('');

    return `
      <div class="cc-hourglass-grid" id="house-cup-grid">
        ${cardsHtml}
      </div>
    `;
  }

  private renderProfileDrawerHtml(playerHouse: HouseName): string {
    if (!this.profileDrawerOpen) return '';

    const lockedByServer = Boolean(
      this.sim.state.minigameLeaderboard?.playerHouseLockedByServer &&
        this.sim.state.minigameLeaderboard?.playerHouse
    );
    const activeHouse = lockedByServer
      ? playerHouse
      : this.profileDraftHouse ?? playerHouse;
    const draftName = this.profileDraftName ?? this.getCurrentWizardDisplayName();
    const houseMeta = HOGWARTS_HOUSE_META[activeHouse] ?? HOGWARTS_HOUSE_META.Gryffindor;

    const houseOptionsHtml = ALL_HOGWARTS_HOUSES.map((hName) => {
      const hm = HOGWARTS_HOUSE_META[hName];
      const isSelected = hName === activeHouse;
      return `
        <label class="cc-house-option ${isSelected ? 'selected' : ''}" data-cc-house-opt="${hName}">
          <input
            type="radio"
            name="ccWizardHouse"
            value="${hName}"
            ${isSelected ? 'checked' : ''}
            ${lockedByServer ? 'disabled' : ''}
          />
          <span class="cc-house-option-crest" aria-hidden="true">${hm.emblemSvg}</span>
          <span class="cc-house-option-info">
            <strong>${escapeHtml(hm.house)} (${escapeHtml(hm.vnTitle)})</strong>
            <small>${hm.patronusEmoji} ${escapeHtml(hm.patronusNameVi)} • ${escapeHtml(hm.traitsVi)}</small>
          </span>
        </label>
      `;
    }).join('');

    const quoteText =
      this.sortingHatAnnouncement ||
      `${houseMeta.patronusEmoji} ${houseMeta.house}: ${houseMeta.quoteVi}`;

    return `
      <form id="ccLbProfileForm" class="cc-profile-drawer">
        <div class="cc-profile-header">
          <h3 class="cc-profile-heading">🎩 Hồ Sơ Phù Thủy &amp; Lễ Phân Loại Nhà</h3>
          ${
            lockedByServer
              ? `<span class="cc-server-house-badge">🏰 Đồng bộ tài khoản HPVN: ${houseMeta.mascotEmoji} ${escapeHtml(playerHouse)}</span>`
              : ''
          }
        </div>

        <div class="cc-field-group">
          <label for="ccWizardNameInput">Tên Phù Thủy hiển thị trên Bảng Xếp Hạng (Tối đa 26 ký tự)</label>
          <div class="cc-input-with-action">
            <input
              id="ccWizardNameInput"
              name="wizardName"
              type="text"
              maxlength="26"
              autocomplete="nickname"
              placeholder="Ví dụ: Minh Khôi Potter..."
              value="${escapeHtml(draftName)}"
              required
            />
            ${
              lockedByServer
                ? ''
                : `<button
                    id="btnLbRandomHat"
                    type="button"
                    class="cc-pill-btn cc-btn-yellow ${this.sortingHatSpinning ? 'is-spinning' : ''}"
                    ${this.sortingHatSpinning ? 'disabled' : ''}
                  >
                    🎩 Nón Phân Loại
                  </button>`
            }
          </div>
        </div>

        <fieldset class="cc-houses-fieldset">
          <legend>${
            lockedByServer
              ? 'Nhà Hogwarts (Tự động khoá theo tài khoản diễn đàn HPVN)'
              : 'Chọn 1 trong 4 Nhà Hogwarts'
          }</legend>
          <div class="cc-houses-grid" id="ccHousesSelectorGrid">
            ${houseOptionsHtml}
          </div>
        </fieldset>

        <p id="ccSortingHatQuote" class="cc-dialog-lead">${escapeHtml(quoteText)}</p>

        <div class="cc-profile-actions">
          <button type="submit" class="cc-pill-btn cc-btn-pink cc-btn-save-profile">
            💾 Cập Nhật Hồ Sơ
          </button>
          <button type="button" id="btnLbCloseProfileDrawer" class="cc-pill-btn cc-btn-slate">
            Thu gọn
          </button>
        </div>
      </form>
    `;
  }

  private renderControlsBarHtml(includeSeededRivals: boolean): string {
    const activeMeta = LEADERBOARD_GAME_META[this.activeGameId];
    const scopePillsHtml = `
      <div class="cc-lb-scope-pills" role="group" aria-label="Phạm vi bảng xếp hạng">
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope === 'valley' ? 'active' : ''}"
          data-lb-scope="valley"
          aria-pressed="${this.activeScope === 'valley'}"
        >
          🌍 Toàn Trường
        </button>
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope === 'friends' ? 'active' : ''}"
          data-lb-scope="friends"
          aria-pressed="${this.activeScope === 'friends'}"
        >
          🤝 Bạn Bè
        </button>
        <button
          type="button"
          class="cc-filter-pill ${this.activeScope === 'personal' ? 'active' : ''}"
          data-lb-scope="personal"
          aria-pressed="${this.activeScope === 'personal'}"
        >
          📜 Kỷ Lục 3 Môn
        </button>
      </div>
    `;

    const houseFilterPillsHtml =
      this.activeScope === 'personal'
        ? ''
        : `
      <div class="cc-lb-filter-pills" id="lb-house-filters" role="group" aria-label="Lọc theo Nhà Hogwarts">
        <button
          type="button"
          class="cc-filter-pill ${this.activeHouseFilter === 'all' ? 'active' : ''}"
          data-lb-house-filter="all"
          aria-pressed="${this.activeHouseFilter === 'all'}"
        >
          Tất Cả
        </button>
        ${ALL_HOGWARTS_HOUSES.map((hName) => {
          const hm = HOGWARTS_HOUSE_META[hName];
          const isAct = this.activeHouseFilter === hName;
          return `
            <button
              type="button"
              class="cc-filter-pill ${isAct ? 'active' : ''}"
              data-lb-house-filter="${hName}"
              aria-pressed="${isAct}"
            >
              ${hm.mascotEmoji} ${escapeHtml(hm.house)}
            </button>
          `;
        }).join('')}
      </div>
    `;

    return `
      <div class="cc-lb-controls">
        <div class="cc-lb-filters-stack">
          ${scopePillsHtml}
          ${houseFilterPillsHtml}
        </div>

        <div class="cc-lb-tools">
          ${
            IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed() && this.activeScope === 'valley'
              ? `<button
                  id="btnLbToggleNpc"
                  type="button"
                  class="cc-pill-btn cc-btn-blue"
                  aria-pressed="${includeSeededRivals}"
                >
                  👥 Học viên mẫu: ${includeSeededRivals ? 'Bật' : 'Tắt'}
                </button>`
              : ''
          }
          <button
            id="btnLbToggleProfile"
            type="button"
            class="cc-pill-btn cc-btn-purple"
            aria-expanded="${this.profileDrawerOpen}"
          >
            🎩 Hồ Sơ &amp; Nhà
          </button>
          <button
            id="btnLbOpenFriendsBook"
            type="button"
            class="cc-pill-btn cc-btn-green"
          >
            🦉 Kết Bạn
          </button>
          ${
            this.activeScope !== 'personal'
              ? `<button
                  id="btnLbExportCsv"
                  type="button"
                  class="cc-pill-btn cc-btn-yellow"
                >
                  📥 Xuất CSV
                </button>`
              : ''
          }
          <button
            id="btnLbPlayActiveGame"
            type="button"
            class="cc-pill-btn cc-btn-pink"
          >
            ▶️ ${escapeHtml(activeMeta.shortVi)}
          </button>
        </div>
      </div>
    `;
  }

  public render(): void {
    const container = this.root.querySelector('#leaderboardDialogContent') as HTMLElement | null;
    if (!container) return;

    const activeMeta = LEADERBOARD_GAME_META[this.activeGameId];
    const titleEl = this.root.querySelector('#leaderboardDialogTitle') as HTMLElement | null;
    if (titleEl) {
      titleEl.textContent = `🏆 Bảng Xếp Hạng & Cúp 4 Nhà • ${activeMeta.shortVi}`;
    }

    const gameTabsHtml = ALL_LEADERBOARD_GAMES.map((gid) => {
      const m = LEADERBOARD_GAME_META[gid];
      const rank = this.sim.getPlayerMinigameRank(gid, 'valley');
      const isAct = gid === this.activeGameId;
      return `
        <button
          id="ccLbTab-${gid}"
          type="button"
          role="tab"
          aria-selected="${isAct}"
          tabindex="${isAct ? '0' : '-1'}"
          data-lb-game="${gid}"
          class="cc-lb-game-tab"
        >
          <img src="${m.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
          <span class="cc-lb-tab-label">${escapeHtml(m.shortVi)}</span>
          <span class="cc-lb-tab-rank">${rank <= 3 ? '👑 ' : ''}#${rank}</span>
        </button>
      `;
    }).join('');

    const unscoredNoticeHtml = this.redirectedFromUnscored
      ? `<div class="cc-lb-unscored-note" role="note">
          📌 <strong>${escapeHtml(LEADERBOARD_GAME_META[this.redirectedFromUnscored]?.shortVi ?? '')}</strong> là môn rèn luyện tự do không tính điểm — dưới đây là Cúp 4 Nhà &amp; Bảng Xếp Hạng của <strong>3 môn tranh cúp</strong> (Bùa Gặt • Số Học • Sinh Vật).
        </div>`
      : '';

    const panelBodyHtml =
      this.activeScope === 'personal'
        ? this.renderPersonalThreeGamesViewHtml()
        : this.renderStandingViewHtml(this.activeScope);

    container.innerHTML = `
      <div class="cc-lb-shell">
        ${unscoredNoticeHtml}
        <div class="cc-lb-game-tabs" role="tablist" aria-label="Chọn bộ môn tranh cúp">
          ${gameTabsHtml}
        </div>
        <div id="ccLbTabPanel" role="tabpanel" aria-labelledby="ccLbTab-${this.activeGameId}">
          <div class="cc-lb-panel-body">
            ${panelBodyHtml}
          </div>
        </div>
      </div>
    `;

    this.bindEvents(container);
  }

  private renderStandingRowHtml(row: LeaderboardRowEntry): string {
    const rankBadge = formatCandyRankBadge(row.rank);
    const hm = HOGWARTS_HOUSE_META[row.house] ?? HOGWARTS_HOUSE_META.Gryffindor;
    const cleanName = row.isPlayer ? stripTrailingPlayerSuffix(row.name) : row.name;

    const statusTagHtml = row.isPlayer
      ? `<span class="cc-lb-you-tag"> (Bạn)</span>`
      : row.isSeededRival
        ? `<span class="cc-lb-npc-tag"> • Mẫu</span>`
        : row.isCloudPlayer
          ? `<span class="cc-lb-cloud-tag"> • Online</span>`
          : row.isFriend
            ? `<span class="cc-lb-friend-tag"> • Bạn</span>`
            : '';

    const visitBtnHtml =
      !row.isPlayer && row.neighborId
        ? `<button
            type="button"
            class="cc-lb-visit-btn"
            data-lb-visit="${escapeHtml(row.neighborId)}"
            aria-label="Thăm điền trang của ${escapeHtml(cleanName)}"
          >🏡 Thăm</button>`
        : '';

    const stageLabel =
      row.primaryValue >= MAX_PUZZLE_TOWER_STAGE
        ? '👑 777/777'
        : `Màn ${Math.max(0, row.primaryValue)}`;

    return `
      <tr class="${row.isPlayer ? 'me-row' : ''}">
        <td class="cc-lb-rank-cell"><strong>${escapeHtml(rankBadge)}</strong></td>
        <th scope="row" class="cc-lb-name-cell">
          <div class="cc-lb-name-wrap">
            <span class="cc-lb-mobile-rank" aria-hidden="true">${escapeHtml(rankBadge)}</span>
            <span class="cc-lb-avatar" aria-hidden="true">${escapeHtml(row.avatarEmoji)}</span>
            <span class="cc-lb-wiz-name">${escapeHtml(cleanName)}</span>
            ${statusTagHtml}
            ${visitBtnHtml}
          </div>
        </th>
        <td class="cc-lb-house-cell cc-house-ink-${hm.cssSlug}">
          <strong>${hm.mascotEmoji} ${escapeHtml(hm.house)}</strong>
        </td>
        <td>${escapeHtml(stageLabel)}</td>
        <td>
          <span class="cc-star-glyph" aria-hidden="true">★</span> ${row.stars.toLocaleString('vi-VN')}
        </td>
        <td>
          <strong class="cc-lb-score-val">${row.ratingScore.toLocaleString('vi-VN')}</strong>
        </td>
      </tr>
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
      includeSeededRivals,
    } = standing;

    const chaseBannerHtml = nextRivalAbove
      ? `🎯 Đang đuổi <strong>#${nextRivalAbove.rank} ${escapeHtml(stripTrailingPlayerSuffix(nextRivalAbove.name))}</strong> (${escapeHtml(nextRivalAbove.primaryDisplayVi)} • ${nextRivalAbove.ratingScore.toLocaleString('vi-VN')} đ)`
      : `👑 Đang dẫn đầu <strong>#1</strong> môn ${escapeHtml(meta.shortVi)}!`;

    const rowsHtml =
      entries.length > 0
        ? entries.map((r) => this.renderStandingRowHtml(r)).join('')
        : `
          <tr>
            <td colspan="6" class="cc-lb-empty-cell">
              Chưa có phù thủy nào thuộc Nhà này trên bảng xếp hạng. Hãy vượt ải ghi điểm ngay!
            </td>
          </tr>
        `;

    return `
      ${this.renderHouseCupGridHtml(houseStandings)}
      ${this.renderProfileDrawerHtml(playerHouse)}
      ${this.renderControlsBarHtml(includeSeededRivals)}

      <div class="cc-lb-status-strip">
        <div class="cc-lb-status-me">
          <img src="${meta.spriteIcon}" alt="" class="cc-lb-status-icon" />
          <span>Hạng của bạn: <strong>#${playerRank}/${totalEntries}</strong></span>
          <span class="cc-league-pill tier-${playerEntry.league.tierId}">
            ${playerEntry.league.icon} ${escapeHtml(playerEntry.league.labelVi)}
          </span>
          <span class="cc-lb-me-stars"><span class="cc-star-glyph" aria-hidden="true">★</span> ${playerEntry.stars.toLocaleString('vi-VN')}</span>
        </div>
        <div class="cc-lb-status-chase">${chaseBannerHtml}</div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="ccLbTableCaption" class="cc-lb-table-wrap">
        <table
          class="cc-lb-table"
          style="--label-3: 'Nhà'; --label-4: 'Tiến độ'; --label-5: 'Sao'; --label-6: 'Tổng điểm';"
        >
          <caption id="ccLbTableCaption" class="cc-lb-caption">
            ${escapeHtml(meta.cupTitleVi)} — Hiển thị ${entries.length}/${totalEntries} phù thủy
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Phù Thủy</th>
              <th scope="col">Nhà</th>
              <th scope="col">Màn</th>
              <th scope="col">Sao</th>
              <th scope="col">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody id="lb-tbody">
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderPersonalThreeGamesViewHtml(): string {
    const valleyStanding = this.sim.getMinigameLeaderboard(this.activeGameId, 'valley', 'all');
    const summaries = this.sim.getAllPersonalLeaderboardSummaries();

    const rowsHtml = summaries
      .map((s) => {
        const isCurrentGame = s.gameId === this.activeGameId;
        const rankBadge = formatCandyRankBadge(s.valleyRank);
        const stageLabel =
          s.primaryValue >= MAX_PUZZLE_TOWER_STAGE
            ? '👑 777/777'
            : `Màn ${Math.max(0, s.primaryValue)}/777`;

        return `
          <tr class="${isCurrentGame ? 'me-row' : ''}">
            <td class="cc-lb-rank-cell"><strong>${escapeHtml(rankBadge)}</strong></td>
            <th scope="row" class="cc-lb-name-cell">
              <div class="cc-lb-name-wrap">
                <span class="cc-lb-mobile-rank" aria-hidden="true">${escapeHtml(rankBadge)}</span>
                <img src="${s.meta.spriteIcon}" alt="" class="cc-lb-tab-sprite" />
                <span class="cc-lb-wiz-name">${escapeHtml(s.meta.shortVi)}</span>
                <button
                  type="button"
                  class="cc-lb-visit-btn"
                  data-lb-jump-play="${s.gameId}"
                  aria-label="Chơi ngay ${escapeHtml(s.meta.shortVi)}"
                >▶️ Chơi</button>
              </div>
            </th>
            <td>
              <span class="cc-league-pill tier-${s.league.tierId}">${s.league.icon} ${escapeHtml(s.league.labelVi)}</span>
            </td>
            <td>${escapeHtml(stageLabel)}</td>
            <td><span class="cc-star-glyph" aria-hidden="true">★</span> ${s.stars.toLocaleString('vi-VN')}</td>
            <td><strong class="cc-lb-score-val">${s.ratingScore.toLocaleString('vi-VN')}</strong></td>
          </tr>
        `;
      })
      .join('');

    return `
      ${this.renderHouseCupGridHtml(valleyStanding.houseStandings)}
      ${this.renderProfileDrawerHtml(valleyStanding.playerHouse)}
      ${this.renderControlsBarHtml(valleyStanding.includeSeededRivals)}

      <div tabindex="0" role="region" aria-labelledby="ccLbPersonalCaption" class="cc-lb-table-wrap">
        <table
          class="cc-lb-table"
          style="--label-3: 'Danh hiệu'; --label-4: 'Tiến độ'; --label-5: 'Sao'; --label-6: 'Tổng điểm';"
        >
          <caption id="ccLbPersonalCaption" class="cc-lb-caption">
            Kỷ lục cá nhân trên 3 bộ môn tranh Cúp 4 Nhà Hogwarts
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng</th>
              <th scope="col">Bộ Môn</th>
              <th scope="col">Danh Hiệu</th>
              <th scope="col">Màn</th>
              <th scope="col">Sao</th>
              <th scope="col">Tổng Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  private selectGameDiscipline(gid: LeaderboardGameId, focusTab = false): void {
    if (!ALL_LEADERBOARD_GAMES.includes(gid)) return;
    this.sim.audio.playClick();
    this.activeGameId = gid;
    if (this.activeScope === 'personal') {
      this.activeScope = 'valley';
    }
    this.render();
    this.scrollSelectedGameTabIntoView(focusTab);
    void submitPlayerCloudLeaderboardEntry(this.sim.state, gid)
      .catch(() => {})
      .then(() => fetchCloudLeaderboardEntries(gid))
      .then(() => {
        if (this.activeGameId === gid && !this.profileDrawerOpen) {
          this.render();
        }
      });
  }

  private bindEvents(container: HTMLElement): void {
    const tabButtons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('[data-lb-game]')
    );
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.lbGame as LeaderboardGameId | undefined;
        if (gid) this.selectGameDiscipline(gid, false);
      });

      btn.addEventListener('keydown', (ev) => {
        if (tabButtons.length === 0) return;
        let nextIdx = -1;
        if (ev.key === 'ArrowRight') {
          nextIdx = (idx + 1) % tabButtons.length;
        } else if (ev.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
        } else if (ev.key === 'Home') {
          nextIdx = 0;
        } else if (ev.key === 'End') {
          nextIdx = tabButtons.length - 1;
        }
        if (nextIdx >= 0) {
          ev.preventDefault();
          const targetGid = tabButtons[nextIdx]?.dataset.lbGame as LeaderboardGameId | undefined;
          if (targetGid) {
            this.selectGameDiscipline(targetGid, true);
          }
        }
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
        if (this.activeScope === 'personal') {
          this.activeScope = 'valley';
        }
        this.activeHouseFilter = this.activeHouseFilter === raw ? 'all' : raw;
        this.render();
      });
    });

    if (IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()) {
      container.querySelector('#btnLbToggleNpc')?.addEventListener('click', () => {
        if (!isSandboxRuntimeAllowed()) return;
        this.sim.audio.playClick();
        const enabled = toggleLeaderboardSeededRivals(this.sim.state);
        this.sim.saveToStorage();
        this.render();
        this.showInDialogToast(
          enabled
            ? '👥 Đã bật 8 học viên mẫu Hogwarts trên Bảng Xếp Hạng!'
            : '👥 Đã tắt học viên mẫu — chỉ hiển thị người chơi thật!'
        );
      });
    }

    container.querySelector('#btnLbToggleProfile')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.profileDrawerOpen = !this.profileDrawerOpen;
      if (this.profileDrawerOpen) {
        this.profileDraftName = this.getCurrentWizardDisplayName();
        this.profileDraftHouse = this.sim.getPlayerHouse();
      }
      this.render();
      if (this.profileDrawerOpen) {
        container.querySelector<HTMLInputElement>('#ccWizardNameInput')?.focus();
      }
    });

    container.querySelector('#btnLbCloseProfileDrawer')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.profileDrawerOpen = false;
      this.render();
    });

    const nameInput = container.querySelector<HTMLInputElement>('#ccWizardNameInput');
    nameInput?.addEventListener('input', () => {
      this.profileDraftName = nameInput.value;
    });

    container
      .querySelectorAll<HTMLInputElement>('input[name="ccWizardHouse"]')
      .forEach((radio) => {
        radio.addEventListener('change', () => {
          const picked = radio.value as HouseName;
          if (!ALL_HOGWARTS_HOUSES.includes(picked)) return;
          this.sim.audio.playClick();
          this.profileDraftHouse = picked;
          const hm = HOGWARTS_HOUSE_META[picked];
          this.sortingHatAnnouncement = `${hm.patronusEmoji} ${hm.house}: ${hm.quoteVi}`;
          container.querySelectorAll<HTMLElement>('.cc-house-option').forEach((opt) => {
            opt.classList.toggle('selected', opt.dataset.ccHouseOpt === picked);
          });
          const quoteEl = container.querySelector('#ccSortingHatQuote');
          if (quoteEl) quoteEl.textContent = this.sortingHatAnnouncement;
        });
      });

    container.querySelector('#btnLbRandomHat')?.addEventListener('click', () => {
      if (this.sortingHatSpinning) return;
      this.sortingHatSpinning = true;
      if (nameInput) {
        this.profileDraftName = nameInput.value;
      }
      const chosenFinal = this.sim.rollPlayerSortingHat(this.activeGameId);
      let step = 0;
      const totalSteps = 7;
      const spinTick = (): void => {
        step += 1;
        if (step < totalSteps) {
          const preview =
            ALL_HOGWARTS_HOUSES[Math.floor(Math.random() * ALL_HOGWARTS_HOUSES.length)] ??
            chosenFinal;
          this.profileDraftHouse = preview;
          container.querySelectorAll<HTMLElement>('.cc-house-option').forEach((opt) => {
            opt.classList.toggle('selected', opt.dataset.ccHouseOpt === preview);
          });
          window.setTimeout(spinTick, 65);
          return;
        }
        this.sortingHatSpinning = false;
        this.profileDraftHouse = chosenFinal;
        const chosenMeta = HOGWARTS_HOUSE_META[chosenFinal];
        this.sortingHatAnnouncement = `🎩 NÓN PHÂN LOẠI CHỌN: “${chosenMeta.house.toUpperCase()}!” — ${chosenMeta.quoteVi}`;
        if (this.activeHouseFilter !== 'all') {
          this.activeHouseFilter = chosenFinal;
        }
        this.render();
        this.showInDialogToast(
          `🎩 Nón Phân Loại đã chọn Nhà ${chosenMeta.house} cho bạn!`
        );
      };
      spinTick();
    });

    container
      .querySelector<HTMLFormElement>('#ccLbProfileForm')
      ?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const rawName = nameInput?.value ?? this.getCurrentWizardDisplayName();
        const desiredHouse = this.profileDraftHouse ?? this.sim.getPlayerHouse();
        this.sim.ensureNeighborSocial();
        const saved = updatePlayerWizardProfile(this.sim.state, rawName, desiredHouse);
        if (!saved.houseLockedByServer) {
          this.sim.setPlayerHouse(saved.house, this.activeGameId);
        } else {
          this.sim.saveToStorage();
          this.sim.onUiChange?.();
          void submitPlayerCloudLeaderboardEntry(this.sim.state, this.activeGameId);
        }
        this.profileDrawerOpen = false;
        this.profileDraftName = saved.name;
        this.profileDraftHouse = saved.house;
        this.render();
        this.showInDialogToast(
          `✨ Đã lưu hồ sơ Phù Thủy ${saved.name} (${saved.house})!`
        );
      });

    container.querySelector('#btnLbExportCsv')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      const exportScope = this.activeScope === 'friends' ? 'friends' : 'valley';
      const csv = exportMinigameLeaderboardCSV(
        this.sim.state,
        this.activeGameId,
        exportScope,
        this.activeHouseFilter,
        getCachedCloudLeaderboardEntries(this.activeGameId)
      );
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `bxh-${this.activeGameId}-hpvn-${dateStr}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.showInDialogToast('📥 Đã xuất file CSV Bảng Xếp Hạng!');
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

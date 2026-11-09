import {
  ALL_LEADERBOARD_GAMES,
  fetchCloudLeaderboardEntries,
  LEADERBOARD_GAME_META,
  LeaderboardRowEntry,
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
  switch (house) {
    case 'Gryffindor':
      return { emoji: '🦁', label: 'Gryffindor', cls: 'house-gryffindor' };
    case 'Ravenclaw':
      return { emoji: '🦅', label: 'Ravenclaw', cls: 'house-ravenclaw' };
    case 'Hufflepuff':
      return { emoji: '🦡', label: 'Hufflepuff', cls: 'house-hufflepuff' };
    case 'Slytherin':
      return { emoji: '🐍', label: 'Slytherin', cls: 'house-slytherin' };
  }
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
  public onJumpToGame?: (gameId: LeaderboardGameId) => void;
  public onVisitNeighbor?: (neighborId: string) => void;
  public onOpenNeighborBook?: () => void;

  private readonly root: HTMLElement;
  private readonly sim: ParkSimulation;
  private closeBound = false;

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
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Vàng Xếp Hạng 6 Môn Khảo Thí &amp; Thần Chú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" autofocus>✕ Đóng</button></form>
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

  public open(gameId?: LeaderboardGameId, scope?: LeaderboardScope): void {
    if (gameId && ALL_LEADERBOARD_GAMES.includes(gameId)) {
      this.activeGameId = gameId;
    }
    if (scope === 'valley' || scope === 'friends' || scope === 'personal') {
      this.activeScope = scope;
    }

    const dlg = this.ensureDialogMounted();
    this.render();
    if (!dlg.open) {
      dlg.showModal();
    }

    const targetGame = this.activeGameId;
    void fetchCloudLeaderboardEntries(targetGame).then((cloudList) => {
      if (dlg.open && cloudList.length > 0 && this.activeGameId === targetGame) {
        this.render();
      }
    });
  }

  public close(): void {
    const dlg = this.root.querySelector('#leaderboardDialog') as HTMLDialogElement | null;
    if (dlg?.open) dlg.close();
  }

  public render(): void {
    const container = this.root.querySelector('#leaderboardDialogContent') as HTMLElement | null;
    if (!container) return;

    const activeMeta = LEADERBOARD_GAME_META[this.activeGameId];
    const titleEl = this.root.querySelector('#leaderboardDialogTitle') as HTMLElement | null;
    if (titleEl) {
      titleEl.innerHTML = `🏆 Bảng Xếp Hạng • ${escapeHtml(activeMeta.titleVi)}`;
    }

    // 1. 6 Mini-Game Discipline Tabs with live rank pill
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
          title="${escapeHtml(m.titleVi)} — Hạng hiện tại: #${rank}"
        >
          <img src="${m.spriteIcon}" alt="" class="lb-tab-sprite" />
          <span class="lb-tab-copy">
            <strong>${escapeHtml(m.shortVi)}</strong>
            <span class="lb-tab-rank-pill">${rank <= 3 ? '👑 ' : ''}Hạng #${rank}</span>
          </span>
        </button>
      `;
    }).join('');

    // 2. Scope Switcher (Valley / Friends / Personal 6-Game Codex) + Jump CTA
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
            🌍 Toàn Thung Lũng
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope === 'friends'}"
            data-lb-scope="friends"
            class="lb-scope-pill ${this.activeScope === 'friends' ? 'active' : ''}"
          >
            🤝 Bạn Bè &amp; Hàng Xóm
          </button>
          <button
            type="button"
            role="tab"
            aria-selected="${this.activeScope === 'personal'}"
            data-lb-scope="personal"
            class="lb-scope-pill ${this.activeScope === 'personal' ? 'active' : ''}"
          >
            📜 Kỷ Lục Cả 6 Môn
          </button>
        </div>

        <div class="lb-toolbar-actions">
          ${
            this.activeScope === 'friends'
              ? `<button id="btnLbOpenFriendsBook" type="button" class="brass-btn lb-action-btn" title="Mở Sổ Hàng Xóm để kết bạn thêm qua Mã Điền Trang HS-XXXX-XX">
                  🦉 Thêm Bạn Mã HS
                </button>`
              : ''
          }
          <button id="btnLbPlayActiveGame" type="button" class="brass-btn gold-cta lb-action-btn">
            ▶️ Đấu ${escapeHtml(activeMeta.shortVi)}
          </button>
        </div>
      </div>
    `;

    const bodyContentHtml =
      this.activeScope === 'personal'
        ? this.renderPersonalSixGamesTableHtml()
        : this.renderStandingViewHtml(this.activeScope);

    container.innerHTML = `
      <div class="lb-shell">
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
        <div class="lb-podium-medal">${crownEmoji} Hạng ${place}</div>
        <div class="lb-podium-avatar-wrap">${avatarHtml}</div>
        <div class="lb-podium-name">${escapeHtml(entry.name)}</div>
        <div class="lb-podium-house ${houseMeta.cls}">${houseMeta.emoji} ${houseMeta.label}</div>
        <div class="lb-podium-primary">${escapeHtml(entry.primaryDisplayVi)}</div>
        <div class="lb-podium-score">${escapeHtml(entry.ratingDisplayVi)}</div>
      </div>
    `;
  }

  private renderStandingViewHtml(scope: 'valley' | 'friends'): string {
    const standing = this.sim.getMinigameLeaderboard(this.activeGameId, scope);
    const { meta, entries, playerEntry, playerRank, totalEntries, nextRivalAbove } = standing;

    const chaseBannerText = nextRivalAbove
      ? `🎯 Đang bám sát <strong>#${nextRivalAbove.rank} ${escapeHtml(nextRivalAbove.name)}</strong> (${escapeHtml(nextRivalAbove.primaryDisplayVi)} • ${escapeHtml(nextRivalAbove.ratingDisplayVi)}) — Thắng thêm để vượt hạng!`
      : `👑 Tuyệt đỉnh! Bạn đang giữ <strong>Ngôi Quán Quân #1</strong> bảng ${scope === 'friends' ? 'Bạn Bè & Hàng Xóm' : 'Toàn Thung Lũng'} bộ môn <strong>${escapeHtml(meta.shortVi)}</strong>!`;

    const podiumHtml = `
      <div class="lb-podium-grid" aria-label="Top 3 dẫn đầu">
        ${this.renderPodiumCardHtml(entries[1], 2)}
        ${this.renderPodiumCardHtml(entries[0], 1)}
        ${this.renderPodiumCardHtml(entries[2], 3)}
      </div>
    `;

    const rowsHtml = entries
      .map((row) => {
        const houseMeta = getHouseBadgeVi(row.house);
        const rankText = formatRankMedal(row.rank);
        const roleTag = row.isPlayer
          ? `<span class="lb-role-tag you">Bạn</span>`
          : row.isCloudPlayer
            ? `<span class="lb-role-tag cloud">🌐 Online</span>`
            : row.isFriend
              ? `<span class="lb-role-tag friend">🤝 Hàng xóm</span>`
              : '';
        const visitBtn =
          !row.isPlayer && row.neighborId
            ? `<button type="button" class="lb-mini-visit-btn" data-lb-visit="${escapeHtml(row.neighborId)}" title="Sang thăm điền trang của ${escapeHtml(row.name)}">🏡 Thăm</button>`
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
                    <span>• ${escapeHtml(row.parkName)}</span>
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
      .join('');

    return `
      <div class="lb-cup-banner">
        <img src="${meta.spriteIcon}" alt="" class="lb-cup-icon" />
        <div class="lb-cup-copy">
          <div class="lb-cup-title">${escapeHtml(meta.cupTitleVi)}</div>
          <div class="lb-cup-sub">${escapeHtml(meta.subtitleVi)}</div>
          <div class="lb-cup-chase">${chaseBannerText}</div>
        </div>
        <div class="lb-player-rank-box">
          <span class="lb-player-rank-lbl">Hạng Của Bạn</span>
          <strong class="lb-player-rank-num">#${playerRank}<span>/${totalEntries}</span></strong>
          <span class="lb-league-pill tier-${playerEntry.league.tierId}">${playerEntry.league.icon} ${escapeHtml(playerEntry.league.labelVi)}</span>
        </div>
      </div>

      ${podiumHtml}

      <div tabindex="0" role="region" aria-labelledby="lbTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Danh Hiệu'; --label-3: '${escapeHtml(meta.primaryColVi)}'; --label-4: '${escapeHtml(meta.secondaryColVi)}'; --label-5: '${escapeHtml(meta.detailColVi)}';"
        >
          <caption id="lbTableCaption" class="lb-table-caption">
            Bảng xếp hạng ${scope === 'friends' ? 'Hàng Xóm & Bạn Bè' : 'Toàn Thung Lũng'} — ${escapeHtml(meta.titleVi)} (${totalEntries} phù thủy)
          </caption>
          <thead>
            <tr>
              <th scope="col">Hạng &amp; Phù Thủy</th>
              <th scope="col">Danh Hiệu</th>
              <th scope="col">${escapeHtml(meta.primaryColVi)}</th>
              <th scope="col">${escapeHtml(meta.secondaryColVi)}</th>
              <th scope="col">${escapeHtml(meta.detailColVi)}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderPersonalSixGamesTableHtml(): string {
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
                    <strong>${escapeHtml(s.meta.titleVi)}</strong>
                  </div>
                  <div class="lb-contender-sub">
                    <span class="lb-league-pill tier-${s.league.tierId}">${s.league.icon} ${escapeHtml(s.league.labelVi)}</span>
                  </div>
                </div>
              </div>
            </th>
            <td class="lb-cell-league">
              <strong>🌍 #${s.valleyRank}/${s.valleyTotal}</strong>
              <div class="lb-sub-stat">🤝 Bạn bè: #${s.friendsRank}/${s.friendsTotal}</div>
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
                  ▶️ Vào Đấu
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
          <div class="lb-cup-title">📜 Hồ Sơ Kỷ Lục Cá Nhân Toàn Bộ 6 Mini Game</div>
          <div class="lb-cup-sub">Tổng hợp thứ hạng Toàn Thung Lũng, thứ hạng Bạn Bè và kỷ lục hiệu suất của bạn ở cả 6 bộ môn khảo thí &amp; thần chú Hogwarts.</div>
        </div>
      </div>

      <div tabindex="0" role="region" aria-labelledby="lbPersonalTableCaption" class="lb-table-wrapper">
        <table
          class="lb-table"
          style="--label-2: 'Thứ Hạng'; --label-3: 'Mốc Đỉnh'; --label-4: 'Điểm Phép'; --label-5: 'Thành Tích &amp; Chơi';"
        >
          <caption id="lbPersonalTableCaption" class="lb-table-caption">
            Bảng tổng hợp kỷ lục cá nhân trên 6 bộ môn mini game tại Trang Trại Hang Sóc
          </caption>
          <thead>
            <tr>
              <th scope="col">Bộ Môn Khảo Thí &amp; Thần Chú</th>
              <th scope="col">Thứ Hạng</th>
              <th scope="col">Mốc Đỉnh</th>
              <th scope="col">Điểm Phép</th>
              <th scope="col">Thành Tích &amp; Hành Động</th>
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
        void fetchCloudLeaderboardEntries(gid).then((cloud) => {
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

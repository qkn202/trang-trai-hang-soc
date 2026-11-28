import { formatDurationCompactVi, formatDurationCountdownVi } from '../data/catalog';
import { houseCup } from '../hpvn/houseCup';
import {
  DERBY_BONUS_SLOT_SAND_COST,
  DERBY_INSTANT_RESTORE_SAND_COST,
  DERBY_MILESTONES,
  MAX_WEEKLY_DERBY_SCORE,
  MAX_WEEKLY_DERBY_TASKS,
  abandonWeeklyDerbyActiveTask,
  acceptWeeklyDerbyTask,
  claimWeeklyDerbyMilestone,
  completeWeeklyDerbyActiveTask,
  ensureWeeklyDerbyState,
  getWeeklyDerbySummary,
  instantRestoreWeeklyDerbySlot,
  trashWeeklyDerbyBoardTask,
  unlockBonusWeeklyDerbySlot,
  type DerbyMilestoneDef,
} from '../sim/weeklyDerbyEngine';
import type {
  WeeklyDerbyActiveTask,
  WeeklyDerbyEventKind,
  WeeklyDerbyTask,
} from '../types/game';
import type { GameHUD } from './hud';

const SPRITE_BASE = '/game/trang-trai-hang-soc/sprites/';

const liveTimerByBox = new WeakMap<HTMLElement, number>();

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getObjectiveIcon(eventKind: WeeklyDerbyEventKind): string {
  switch (eventKind) {
    case 'harvest_crop':
      return '🌾';
    case 'owl_order':
      return '🦉';
    case 'workshop_batch':
      return '🥧';
    case 'visitor_sale':
      return '🪙';
    case 'cargo_crate':
      return '📦';
    case 'pasture_harvest':
      return '🐾';
    case 'minigame_win':
      return '🏆';
    case 'molly_supply':
      return '🧺';
  }
}

function getQuickJumpMeta(eventKind: WeeklyDerbyEventKind): {
  ctaLabel: string;
  hintVi: string;
} {
  switch (eventKind) {
    case 'harvest_crop':
      return {
        ctaLabel: '→ Ra ruộng',
        hintVi: 'Gợi ý: Thu hoạch các thửa ruộng chín ngoài thung lũng để cộng tiến độ ngay.',
      };
    case 'owl_order':
      return {
        ctaLabel: '→ Mở Đơn Cú',
        hintVi: 'Gợi ý: Chuyển sang tab Đơn Cú ngay bên trên để gửi đơn giao hàng.',
      };
    case 'workshop_batch':
      return {
        ctaLabel: '→ Ra xưởng',
        hintVi: 'Gợi ý: Thu hoạch mẻ bánh hoặc đặc sản đã chín tại các xưởng chế biến.',
      };
    case 'visitor_sale':
      return {
        ctaLabel: '→ Đón khách',
        hintVi: 'Gợi ý: Chạm Khách Ghé Cổng đứng gần Quầy Ven Đường để bán nhanh.',
      };
    case 'cargo_crate':
      return {
        ctaLabel: '→ Mở Tàu Hàng',
        hintVi: 'Gợi ý: Mở kho Tàu Tốc Hành để đóng kiện tiếp tế nhận điểm.',
      };
    case 'pasture_harvest':
      return {
        ctaLabel: '→ Ra đồng cỏ',
        hintVi: 'Gợi ý: Thu hoạch trứng, sữa, lông tại Đồng Cỏ Thú ngoài trang trại.',
      };
    case 'minigame_win':
      return {
        ctaLabel: '→ Chơi Mini Game',
        hintVi: 'Gợi ý: Thắng bất kỳ màn Bùa Gặt hoặc Đại Sảnh Khảo Thí để ghi tiến độ.',
      };
    case 'molly_supply':
      return {
        ctaLabel: '→ Vào ván dùng Gói',
        hintVi: 'Gợi ý: Dùng Gói Tiếp Tế Bà Molly trong lúc chơi Mini Game.',
      };
  }
}

function isActiveTaskReady(task: WeeklyDerbyActiveTask): boolean {
  return Boolean(
    task.completedAt ||
      (task.objectives.length > 0 && task.objectives.every((o) => o.progress >= o.target))
  );
}

function renderMilestoneRewardsHtml(m: DerbyMilestoneDef): string {
  const chips: string[] = [];
  if (m.rewardSickle > 0) {
    chips.push(
      `<span class="hs-derby-rew-chip is-sickle">🪙 +${m.rewardSickle.toLocaleString('vi-VN')}</span>`
    );
  }
  if (m.rewardPlug && m.rewardPlug > 0) {
    chips.push(`<span class="hs-derby-rew-chip">🔌 +${m.rewardPlug}</span>`);
  }
  if (m.rewardCompost && m.rewardCompost > 0) {
    chips.push(`<span class="hs-derby-rew-chip">🌿 +${m.rewardCompost}</span>`);
  }
  if (m.rewardDew && m.rewardDew > 0) {
    chips.push(`<span class="hs-derby-rew-chip">🧪 +${m.rewardDew} Sương</span>`);
  }
  if (m.rewardSand && m.rewardSand > 0) {
    chips.push(`<span class="hs-derby-rew-chip">⏳ +${m.rewardSand}</span>`);
  }
  if (m.rewardTalisman && m.rewardTalisman > 0) {
    chips.push(`<span class="hs-derby-rew-chip is-fire">🔥 +${m.rewardTalisman} Bùa</span>`);
  }
  if (m.rewardStars && m.rewardStars > 0) {
    chips.push(`<span class="hs-derby-rew-chip is-star">🌟 +${m.rewardStars}</span>`);
  }
  return chips.join('');
}

function renderMilestonesSectionHtml(
  points: number,
  claimedMilestones: readonly number[],
  sandboxMode: boolean
): string {
  const claimedSet = new Set(claimedMilestones);
  const topMilestonePts = DERBY_MILESTONES[DERBY_MILESTONES.length - 1]?.pointsRequired ?? 2000;
  const trackPct = Math.min(100, Math.round((points / Math.max(1, topMilestonePts)) * 100));
  const claimedCount = DERBY_MILESTONES.filter((m) => claimedSet.has(m.tier)).length;
  const readyCount = DERBY_MILESTONES.filter(
    (m) => !claimedSet.has(m.tier) && (sandboxMode || points >= m.pointsRequired)
  ).length;

  const trackNodesHtml = DERBY_MILESTONES.map((m) => {
    const isClaimed = claimedSet.has(m.tier);
    const isUnlocked = sandboxMode || points >= m.pointsRequired;
    const nodeCls = isClaimed ? 'is-claimed' : isUnlocked ? 'is-ready' : 'is-locked';
    const shortPts =
      m.pointsRequired >= 1000
        ? `${(m.pointsRequired / 1000).toFixed(1).replace(/\.0$/, '')}k`
        : String(m.pointsRequired);
    return `
      <div class="hs-derby-track-node ${nodeCls}">
        <span class="hs-derby-track-dot" aria-hidden="true">${isClaimed ? '✓' : m.tier}</span>
        <span class="hs-derby-track-pts">${shortPts}</span>
      </div>
    `;
  }).join('');

  const cardsHtml = DERBY_MILESTONES.map((m) => {
    const isClaimed = claimedSet.has(m.tier);
    const isUnlocked = sandboxMode || points >= m.pointsRequired;
    const isReady = !isClaimed && isUnlocked;
    const stateCls = isClaimed ? 'is-claimed' : isReady ? 'is-ready' : 'is-locked';
    const grandCls = m.tier === 5 ? ' is-grand' : '';
    const needPts = Math.max(0, m.pointsRequired - points);

    const ctaHtml = isClaimed
      ? `<span class="hs-derby-ms-status is-claimed">✓ Đã nhận</span>`
      : isReady
        ? `<button type="button" class="hs-derby-btn hs-derby-btn-green hs-derby-ms-claim" data-derby-claim-milestone="${m.tier}">🎁 Nhận</button>`
        : `<span class="hs-derby-ms-status is-locked">🔒 Còn ${needPts.toLocaleString('vi-VN')} đ</span>`;

    return `
      <article class="hs-derby-ms-card ${stateCls}${grandCls}">
        <div class="hs-derby-ms-top">
          <div class="hs-derby-ms-head">
            <span class="hs-derby-ms-tier">Mốc ${m.tier}</span>
            <strong class="hs-derby-ms-title">${escapeHtml(m.labelVi)}</strong>
          </div>
          <span class="hs-derby-ms-pts">🏆 ${m.pointsRequired.toLocaleString('vi-VN')} đ</span>
        </div>
        <div class="hs-derby-ms-body">
          <div class="hs-derby-ms-rewards">${renderMilestoneRewardsHtml(m)}</div>
          <div class="hs-derby-ms-cta">${ctaHtml}</div>
        </div>
      </article>
    `;
  }).join('');

  const rightPill =
    readyCount > 0
      ? `<span class="hs-derby-sec-pill is-ready">🎁 ${readyCount} rương chờ mở</span>`
      : `<span class="hs-derby-sec-pill">${claimedCount}/${DERBY_MILESTONES.length} đã nhận</span>`;

  return `
    <section class="hs-derby-section hs-derby-milestones" aria-label="5 Rương Mốc Derby">
      <div class="hs-derby-sec-head">
        <h3 class="hs-derby-sec-title">🎁 5 Rương Mốc Derby</h3>
        ${rightPill}
      </div>
      <div class="hs-derby-track-wrap">
        <div class="hs-derby-track-bar" role="progressbar" aria-label="Tiến độ Rương Mốc Derby" aria-valuemin="0" aria-valuemax="${topMilestonePts}" aria-valuenow="${Math.min(points, topMilestonePts)}">
          <div class="hs-derby-track-fill" style="width:${trackPct}%"></div>
        </div>
        <div class="hs-derby-track-nodes">${trackNodesHtml}</div>
      </div>
      <div class="hs-derby-ms-grid">${cardsHtml}</div>
    </section>
  `;
}

function renderActiveTaskSectionHtml(
  activeTask: WeeklyDerbyActiveTask | null,
  nowMs: number,
  tasksCompleted: number,
  maxTasks: number,
  bonusSlotUnlocked: boolean
): string {
  if (!activeTask) {
    const capReached = tasksCompleted >= maxTasks;
    const emptySub = capReached
      ? bonusSlotUnlocked
        ? `Bạn đã hoàn thành toàn bộ ${maxTasks}/${maxTasks} nhiệm vụ Derby tuần này — thành tích tuyệt vời cho Nhà!`
        : `Bạn đã hoàn thành đủ ${MAX_WEEKLY_DERBY_TASKS}/${MAX_WEEKLY_DERBY_TASKS} nhiệm vụ tuần này! Có thể mở thêm nhiệm vụ #8 bằng ${DERBY_BONUS_SLOT_SAND_COST} ⏳ Cát ở đầu trang.`
      : 'Chọn 1 nhiệm vụ từ bảng 8 việc bên dưới để bắt đầu ghi điểm Derby cho Nhà!';
    return `
      <section class="hs-derby-section hs-derby-active-sec" aria-label="Nhiệm Vụ Đang Làm">
        <div class="hs-derby-sec-head">
          <h3 class="hs-derby-sec-title">⭐ Nhiệm Vụ Đang Làm</h3>
          <span class="hs-derby-sec-pill">${capReached ? '✓ Đủ định mức' : 'Trống'}</span>
        </div>
        <div class="hs-derby-active-empty${capReached ? ' is-capped' : ''}">
          <span class="hs-derby-empty-ico" aria-hidden="true">${capReached ? '🏆' : '🌾'}</span>
          <p class="hs-derby-empty-text">${escapeHtml(emptySub)}</p>
        </div>
      </section>
    `;
  }

  const ready = isActiveTaskReady(activeTask);
  const remainSec = Math.max(0, Math.ceil((activeTask.expiresAt - nowMs) / 1000));
  const firstPendingObj =
    activeTask.objectives.find((o) => o.progress < o.target) ?? activeTask.objectives[0];
  const jumpMeta = firstPendingObj ? getQuickJumpMeta(firstPendingObj.eventKind) : null;

  const objectivesHtml = activeTask.objectives
    .map((obj) => {
      const done = obj.progress >= obj.target;
      const pct = Math.min(100, Math.round((obj.progress / Math.max(1, obj.target)) * 100));
      const icon = getObjectiveIcon(obj.eventKind);
      return `
        <div class="hs-derby-obj-row${done ? ' is-done' : ''}">
          <div class="hs-derby-obj-top">
            <span class="hs-derby-obj-label">${icon} ${escapeHtml(obj.labelVi)}</span>
            <span class="hs-derby-obj-count">${done ? '✓ ' : ''}${Math.min(obj.progress, obj.target)}/${obj.target}</span>
          </div>
          <div class="hs-derby-obj-bar" aria-hidden="true">
            <div class="hs-derby-obj-fill${done ? ' is-done' : ''}" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    })
    .join('');

  const footerHtml = ready
    ? `
      <div class="hs-derby-active-actions is-ready">
        <button type="button" id="btnDerbyCompleteActive" class="hs-derby-btn hs-derby-btn-green hs-derby-submit-cta">
          🏆 Nộp +${activeTask.points.toLocaleString('vi-VN')} đ Derby
        </button>
      </div>
    `
    : `
      ${jumpMeta ? `<div class="hs-derby-jump-hint">${escapeHtml(jumpMeta.hintVi)}</div>` : ''}
      <div class="hs-derby-active-actions">
        ${
          firstPendingObj && jumpMeta
            ? `<button type="button" class="hs-derby-btn hs-derby-btn-gold" data-derby-jump="${escapeHtml(firstPendingObj.eventKind)}">${escapeHtml(jumpMeta.ctaLabel)}</button>`
            : ''
        }
        <button type="button" id="btnDerbyAbandonActive" class="hs-derby-btn hs-derby-btn-danger">
          ✕ Hủy nhiệm vụ
        </button>
      </div>
    `;

  return `
    <section class="hs-derby-section hs-derby-active-sec" aria-label="Nhiệm Vụ Đang Làm">
      <div class="hs-derby-sec-head">
        <h3 class="hs-derby-sec-title">⭐ Nhiệm Vụ Đang Làm</h3>
        <span class="hs-derby-sec-pill${ready ? ' is-ready' : ''}">
          ${
            ready
              ? '✓ Sẵn sàng nộp'
              : `⏳ <span data-derby-countdown-end="${activeTask.expiresAt}">${formatDurationCountdownVi(remainSec)}</span>`
          }
        </span>
      </div>
      <div class="hs-derby-active-card${ready ? ' is-ready' : ''}${activeTask.isHybridCombo ? ' is-hybrid' : ''}">
        <div class="hs-derby-active-head">
          <div class="hs-derby-active-title-wrap">
            <strong class="hs-derby-active-title">${escapeHtml(activeTask.emoji)} ${escapeHtml(activeTask.titleVi)}</strong>
            ${
              activeTask.isHybridCombo
                ? `<span class="hs-derby-hybrid-pill">🔥 Giao Thoa (Nông Trại + Mini Game)</span>`
                : ''
            }
          </div>
          <span class="hs-derby-pts-pill">🏆 +${activeTask.points} đ</span>
        </div>
        <div class="hs-derby-obj-list">${objectivesHtml}</div>
        ${footerHtml}
      </div>
    </section>
  `;
}

function renderBoardTaskCardHtml(
  task: WeeklyDerbyTask,
  nowMs: number,
  hasActiveTask: boolean,
  reachedWeeklyCap: boolean
): string {
  const isTrashed = Boolean(task.trashedUntilAt && task.trashedUntilAt > nowMs);
  if (isTrashed) {
    const trashLeftSec = Math.max(1, Math.ceil((task.trashedUntilAt! - nowMs) / 1000));
    return `
      <article class="hs-derby-task-card is-trashed" data-derby-slot="${task.slotIndex}">
        <div class="hs-derby-card-top">
          <span class="hs-derby-slot-tag">Ô #${task.slotIndex + 1}</span>
          <span class="hs-derby-dur-pill">⏳ <span data-derby-countdown-end="${task.trashedUntilAt}" data-derby-countdown-trash="1">${formatDurationCountdownVi(trashLeftSec)}</span></span>
        </div>
        <div class="hs-derby-trashed-body">
          <strong class="hs-derby-trashed-title">Đang gọi nhiệm vụ mới…</strong>
          <p class="hs-derby-trashed-sub">Tự động hồi miễn phí sau thời gian chờ 15 phút.</p>
        </div>
        <div class="hs-derby-card-actions is-single">
          <button type="button" class="hs-derby-btn hs-derby-btn-gold" data-derby-restore="${escapeHtml(task.id)}">
            ⏳ Gọi việc mới (${DERBY_INSTANT_RESTORE_SAND_COST} Cát)
          </button>
        </div>
      </article>
    `;
  }

  const acceptDisabled = hasActiveTask || reachedWeeklyCap;
  const acceptTitle = hasActiveTask
    ? 'Hãy hoàn thành hoặc hủy nhiệm vụ đang làm trước'
    : reachedWeeklyCap
      ? 'Bạn đã hoàn thành hết định mức nhiệm vụ tuần này'
      : `Nhận nhiệm vụ ${task.titleVi}`;

  const objsHtml = task.objectives
    .map(
      (obj) => `
        <li class="hs-derby-card-obj">
          <span class="hs-derby-card-obj-name">${getObjectiveIcon(obj.eventKind)} ${escapeHtml(obj.labelVi)}</span>
          <strong class="hs-derby-card-obj-qty">×${obj.target}</strong>
        </li>
      `
    )
    .join('');

  return `
    <article class="hs-derby-task-card${task.isHybridCombo ? ' is-hybrid' : ''}" data-derby-slot="${task.slotIndex}">
      <div class="hs-derby-card-top">
        <div class="hs-derby-card-badges">
          ${
            task.isHybridCombo
              ? `<span class="hs-derby-hybrid-pill">🔥 Liên Môn · Điểm cao</span>`
              : `<span class="hs-derby-slot-tag">Ô #${task.slotIndex + 1}</span>`
          }
        </div>
        <div class="hs-derby-card-metrics">
          <span class="hs-derby-pts-pill">🏆 +${task.points} đ</span>
          <span class="hs-derby-dur-pill">⏳ ${formatDurationCompactVi(task.durationSec)}</span>
        </div>
      </div>
      <div class="hs-derby-card-title">${escapeHtml(task.emoji)} ${escapeHtml(task.titleVi)}</div>
      <ul class="hs-derby-card-objs">${objsHtml}</ul>
      <div class="hs-derby-card-actions">
        <button
          type="button"
          class="hs-derby-btn ${acceptDisabled ? 'hs-derby-btn-muted' : 'hs-derby-btn-gold'}"
          data-derby-accept="${escapeHtml(task.id)}"
          ${acceptDisabled ? 'disabled' : ''}
          title="${escapeHtml(acceptTitle)}"
        >
          ✓ Nhận việc
        </button>
        <button
          type="button"
          class="hs-derby-btn hs-derby-btn-trash"
          data-derby-trash="${escapeHtml(task.id)}"
          title="Xé nhiệm vụ miễn phí — việc mới hồi sau 15 phút"
        >
          🧹 Xé (15p)
        </button>
      </div>
    </article>
  `;
}

export function renderWeeklyDerbyTabHtml(hud: GameHUD, nowMs = Date.now()): string {
  const derby = ensureWeeklyDerbyState(hud.sim, nowMs);
  const summary = getWeeklyDerbySummary(hud.sim, nowMs);
  const playerHouse = hud.sim.getPlayerHouse();
  const cup = houseCup();
  const noHouse = cup?.house === null;
  const crestSrc = noHouse
    ? `${SPRITE_BASE}ui_trophy_cup.webp`
    : `${SPRITE_BASE}crest-${playerHouse.toLowerCase()}.webp`;
  const scorePct = Math.min(
    100,
    Math.round((summary.points / Math.max(1, MAX_WEEKLY_DERBY_SCORE)) * 100)
  );
  const showBonusUnlock =
    summary.tasksCompleted >= MAX_WEEKLY_DERBY_TASKS && !summary.bonusSlotUnlocked;
  const hasActiveTask = Boolean(derby.activeTask);
  const reachedWeeklyCap = summary.tasksCompleted >= summary.maxTasks;
  const sandboxMode = Boolean(hud.sim.state.sandboxMode);

  const boardHtml = derby.boardTasks
    .map((task) => renderBoardTaskCardHtml(task, nowMs, hasActiveTask, reachedWeeklyCap))
    .join('');

  return `
    <div class="hs-derby-panel" data-derby-week="${escapeHtml(summary.weekKey)}">
      <header class="hs-derby-hero" data-house="${noHouse ? '' : escapeHtml(playerHouse)}">
        <div class="hs-derby-hero-top">
          <img
            class="hs-derby-crest"
            src="${crestSrc}"
            alt="${noHouse ? 'Cúp Derby' : `Huy hiệu Nhà ${escapeHtml(playerHouse)}`}"
            width="44"
            height="44"
          />
          <div class="hs-derby-hero-copy">
            <h2 class="hs-derby-hero-title">🏆 Derby Nông Trại 4 Nhà · Tuần ${escapeHtml(summary.weekKey)}</h2>
            <div class="hs-derby-hero-note">
              Môn #7 đồng hành Cúp 4 Nhà (Thứ Sáu 17:00 → 16:00)
            </div>
          </div>
        </div>

        <div class="hs-derby-hero-stats">
          <div class="hs-derby-stat-box">
            <div class="hs-derby-stat-row">
              <span class="hs-derby-stat-label">Điểm Derby tuần${noHouse ? '' : ` · Nhà ${escapeHtml(playerHouse)}`}</span>
              <strong class="hs-derby-stat-val">${summary.points.toLocaleString('vi-VN')} / ${summary.maxPoints.toLocaleString('vi-VN')} đ</strong>
            </div>
            <div class="hs-derby-score-bar" role="progressbar" aria-label="Điểm Derby tuần" aria-valuemin="0" aria-valuemax="${summary.maxPoints}" aria-valuenow="${summary.points}">
              <div class="hs-derby-score-fill" style="width:${scorePct}%"></div>
            </div>
          </div>
          <div class="hs-derby-quota-pill">
            <span class="hs-derby-quota-k">Nhiệm vụ</span>
            <strong class="hs-derby-quota-v">${summary.tasksCompleted}/${summary.maxTasks}</strong>
          </div>
        </div>

        ${
          summary.tasksCompleted < 2
            ? `<div class="hs-derby-qualify-note">Hoàn thành tối thiểu 2 nhiệm vụ trong tuần để ghi điểm Nhà cho Môn #7.</div>`
            : `<div class="hs-derby-qualify-note is-ok">✓ Đã đạt điều kiện ghi điểm Nhà cho Môn #7 tuần này!</div>`
        }

        <div class="hs-derby-hero-actions">
          <button type="button" id="btnDerbyOpenHouseCup" class="hs-derby-btn hs-derby-btn-paper">
            🏆 Bảng Cúp 4 Nhà
          </button>
          ${
            showBonusUnlock
              ? `<button type="button" id="btnDerbyUnlockBonus" class="hs-derby-btn hs-derby-btn-gold">⏳ Mở thêm nhiệm vụ #8 (${DERBY_BONUS_SLOT_SAND_COST} Cát)</button>`
              : ''
          }
        </div>
      </header>

      ${renderMilestonesSectionHtml(summary.points, derby.claimedMilestones, sandboxMode)}

      ${renderActiveTaskSectionHtml(
        derby.activeTask,
        nowMs,
        summary.tasksCompleted,
        summary.maxTasks,
        summary.bonusSlotUnlocked
      )}

      <section class="hs-derby-section hs-derby-board-sec" aria-label="Bảng 8 Nhiệm Vụ Tuần">
        <div class="hs-derby-sec-head">
          <h3 class="hs-derby-sec-title">📰 Bảng 8 Nhiệm Vụ Tuần</h3>
          <span class="hs-derby-sec-pill">🔥 2 việc Liên Môn</span>
        </div>
        <div class="hs-derby-board-grid">
          ${boardHtml}
        </div>
      </section>
    </div>
  `;
}

function handleDerbyQuickJump(hud: GameHUD, eventKind: WeeklyDerbyEventKind, rerender: () => void): void {
  const dlg = hud.root.querySelector('#questDialog') as HTMLDialogElement | null;
  switch (eventKind) {
    case 'owl_order':
      hud.activeQuestTab = 'orders';
      rerender();
      return;
    case 'cargo_crate':
      dlg?.close();
      hud.openWorkshopDialog('cargo');
      return;
    case 'minigame_win':
    case 'molly_supply':
      dlg?.close();
      hud.openLastPlayedMinigame();
      return;
    case 'harvest_crop':
      dlg?.close();
      hud.showToast('🌾 Chạm các thửa ruộng chín ngoài thung lũng để thu hoạch!', '🌾');
      return;
    case 'pasture_harvest':
      dlg?.close();
      hud.showToast('🐾 Chạm Đồng Cỏ Thú đã sẵn sàng trên bản đồ để thu hoạch!', '🐾');
      return;
    case 'workshop_batch':
      dlg?.close();
      hud.showToast('🥧 Chạm các Xưởng Chế Biến trên bản đồ để thu hoạch mẻ bánh!', '🥧');
      return;
    case 'visitor_sale':
      dlg?.close();
      hud.showToast('🪙 Chạm Khách Ghé Cổng gần Quầy Ven Đường để bán hàng!', '🪙');
      return;
  }
}

function syncDerbyLiveCountdowns(box: HTMLElement, rerender: () => void): void {
  if (typeof window === 'undefined' || typeof window.setInterval !== 'function') return;
  const prevTimer = liveTimerByBox.get(box);
  if (prevTimer) {
    window.clearInterval(prevTimer);
    liveTimerByBox.delete(box);
  }

  const hasTimers = box.querySelector('[data-derby-countdown-end]') !== null;
  if (!hasTimers) return;

  const timerId = window.setInterval(() => {
    const dlg = box.closest('dialog') as HTMLDialogElement | null;
    if (!box.isConnected || !box.querySelector('.hs-derby-panel') || (dlg && !dlg.open)) {
      window.clearInterval(timerId);
      liveTimerByBox.delete(box);
      return;
    }
    const now = Date.now();
    let needsRefresh = false;
    box.querySelectorAll<HTMLElement>('[data-derby-countdown-end]').forEach((el) => {
      const endMs = Number(el.dataset.derbyCountdownEnd);
      if (!Number.isFinite(endMs)) return;
      const leftSec = Math.max(0, Math.ceil((endMs - now) / 1000));
      el.textContent = formatDurationCountdownVi(leftSec);
      if (leftSec <= 0) {
        needsRefresh = true;
      }
    });
    if (needsRefresh) {
      window.clearInterval(timerId);
      liveTimerByBox.delete(box);
      rerender();
    }
  }, 1000);

  liveTimerByBox.set(box, timerId);
}

export function bindWeeklyDerbyTabEvents(
  box: HTMLElement,
  hud: GameHUD,
  rerender: () => void
): void {
  box.querySelector<HTMLButtonElement>('#btnDerbyOpenHouseCup')?.addEventListener('click', () => {
    (hud.root.querySelector('#questDialog') as HTMLDialogElement | null)?.close();
    hud.openHouseCupIntroDialog();
  });

  box.querySelector<HTMLButtonElement>('#btnDerbyUnlockBonus')?.addEventListener('click', () => {
    const res = unlockBonusWeeklyDerbySlot(hud.sim);
    if (!res.ok) hud.showToast(res.msg, '⏳');
    hud.refreshHeader();
    rerender();
  });

  box.querySelectorAll<HTMLButtonElement>('[data-derby-claim-milestone]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierNum = Number(btn.dataset.derbyClaimMilestone);
      if (tierNum !== 1 && tierNum !== 2 && tierNum !== 3 && tierNum !== 4 && tierNum !== 5) {
        return;
      }
      const res = claimWeeklyDerbyMilestone(hud.sim, tierNum);
      if (!res.ok) hud.showToast(res.msg, '🎁');
      hud.refreshHeader();
      rerender();
    });
  });

  box.querySelector<HTMLButtonElement>('#btnDerbyCompleteActive')?.addEventListener('click', () => {
    const res = completeWeeklyDerbyActiveTask(hud.sim);
    if (!res.ok) hud.showToast(res.msg, '🏆');
    hud.refreshHeader();
    rerender();
  });

  box.querySelector<HTMLButtonElement>('#btnDerbyAbandonActive')?.addEventListener('click', () => {
    const res = abandonWeeklyDerbyActiveTask(hud.sim);
    if (!res.ok) hud.showToast(res.msg, '✕');
    rerender();
  });

  box.querySelectorAll<HTMLButtonElement>('[data-derby-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.dataset.derbyJump as WeeklyDerbyEventKind | undefined;
      if (!kind) return;
      handleDerbyQuickJump(hud, kind, rerender);
    });
  });

  box.querySelectorAll<HTMLButtonElement>('[data-derby-accept]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.derbyAccept ?? '';
      if (!taskId) return;
      const res = acceptWeeklyDerbyTask(hud.sim, taskId);
      if (!res.ok) hud.showToast(res.msg, '🏆');
      rerender();
    });
  });

  box.querySelectorAll<HTMLButtonElement>('[data-derby-trash]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.derbyTrash ?? '';
      if (!taskId) return;
      const res = trashWeeklyDerbyBoardTask(hud.sim, taskId);
      if (!res.ok) hud.showToast(res.msg, '🧹');
      rerender();
    });
  });

  box.querySelectorAll<HTMLButtonElement>('[data-derby-restore]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.derbyRestore ?? '';
      if (!taskId) return;
      const res = instantRestoreWeeklyDerbySlot(hud.sim, taskId);
      if (!res.ok) hud.showToast(res.msg, '⏳');
      hud.refreshHeader();
      rerender();
    });
  });

  syncDerbyLiveCountdowns(box, rerender);
}

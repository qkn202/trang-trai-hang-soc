/**
 * Accessibility Module for Trang Trại Hang Sóc:
 * 1. Polite live-region announcer for toasts, rewards, and milestone notifications.
 * 2. Semantic DOM status mirror of key farm stats for assistive technologies (screen readers).
 */

import type { ParkSimulation } from '../sim/simulation';

let currentSim: ParkSimulation | null = null;
let statusRegionEl: HTMLDivElement | null = null;
let announcerEl: HTMLDivElement | null = null;
let statusInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Announces a message to assistive technology via a polite ARIA live-region.
 */
export function announce(msg: string): void {
  if (!announcerEl && typeof document !== 'undefined') {
    announcerEl = document.getElementById('a11y-announcer') as HTMLDivElement | null;
  }
  if (!announcerEl || !msg) return;

  // Clear first and apply on the next animation frame to ensure screen readers register identical repeat strings
  announcerEl.textContent = '';
  requestAnimationFrame(() => {
    if (announcerEl) {
      announcerEl.textContent = msg;
    }
  });
}

function getBakeryStatus(sim: ParkSimulation): string {
  const bakery = sim.state.buildings.find((b) => b.itemId === 'molly_apple_bakery');
  if (!bakery) {
    return 'Chưa xây dựng';
  }
  const now = Date.now();
  if (bakery.constructEndsAt > now) {
    const remainSec = Math.max(0, Math.ceil((bakery.constructEndsAt - now) / 1000));
    return `Đang xây dựng (còn ${remainSec} giây)`;
  }
  if (bakery.workshopQueue && bakery.workshopQueue.length > 0) {
    const remainSec = Math.max(0, Math.ceil((bakery.workshopQueue[0].endsAt - now) / 1000));
    const queueLen = bakery.workshopQueue.length;
    return `Đang nướng bánh (mẻ hiện tại còn ${remainSec} giây, tổng ${queueLen} mẻ trong hàng đợi)`;
  }
  if (bakery.readyFarmGoods && bakery.readyFarmGoods.length > 0) {
    return `Đã chín ${bakery.readyFarmGoods.length} mẻ bánh nóng (sẵn sàng thu hoạch)`;
  }
  return 'Đang rảnh (0 giây)';
}

/**
 * Re-renders the semantic DOM mirror of farm status.
 */
export function refreshFarmStatus(sim?: ParkSimulation): void {
  const activeSim = sim ?? currentSim;
  if (!activeSim) return;

  if (!statusRegionEl && typeof document !== 'undefined') {
    statusRegionEl = document.getElementById('a11y-farm-status') as HTMLDivElement | null;
  }
  if (!statusRegionEl) return;

  const st = activeSim.state;
  const level = st.level;
  const galleons = st.galleons.toLocaleString('vi-VN');
  const stars = st.sandboxMode ? 'Vô hạn' : String(st.match3?.stars ?? 0);
  const sand = st.timeSand;

  const owlOrders = st.farmBarn?.owlOrders ?? [];
  const readyOrders = owlOrders.filter((o) => activeSim.canFulfillFarmOwlOrder(o)).length;
  const owlOrdersText = `${owlOrders.length} đơn hàng (${readyOrders} đơn đủ nông sản sẵn sàng giao)`;

  const bakeryText = getBakeryStatus(activeSim);

  statusRegionEl.innerHTML = `
    <h2>Trạng Thái Trang Trại Hang Sóc</h2>
    <table>
      <caption>Bảng thống kê thời gian thực</caption>
      <thead>
        <tr><th scope="col">Chỉ số</th><th scope="col">Giá trị</th></tr>
      </thead>
      <tbody>
        <tr><th scope="row">Cấp độ trang trại</th><td>Cấp ${level}</td></tr>
        <tr><th scope="row">Vàng Galleon</th><td>${galleons} Galleons</td></tr>
        <tr><th scope="row">Sao Phép Thuật (🌟)</th><td>${stars}</td></tr>
        <tr><th scope="row">Cát Xoay Thời Gian (⏳)</th><td>${sand}</td></tr>
        <tr><th scope="row">Đơn Hàng Cú Đưa Thư</th><td>${owlOrdersText}</td></tr>
        <tr><th scope="row">Lò Bánh Bà Molly</th><td>${bakeryText}</td></tr>
      </tbody>
    </table>
  `.trim();
}

/**
 * Initializes the live announcer and farm status DOM mirror.
 */
export function initAccessibility(sim: ParkSimulation): void {
  currentSim = sim;
  if (typeof document === 'undefined') return;

  // 1. Create or bind polite announcer
  if (!announcerEl) {
    announcerEl = document.getElementById('a11y-announcer') as HTMLDivElement | null;
    if (!announcerEl) {
      announcerEl = document.createElement('div');
      announcerEl.id = 'a11y-announcer';
      announcerEl.className = 'visually-hidden';
      announcerEl.setAttribute('aria-live', 'polite');
      announcerEl.setAttribute('aria-atomic', 'true');
      document.body.appendChild(announcerEl);
    }
  }

  // 2. Create or bind semantic farm status DOM mirror
  if (!statusRegionEl) {
    statusRegionEl = document.getElementById('a11y-farm-status') as HTMLDivElement | null;
    if (!statusRegionEl) {
      statusRegionEl = document.createElement('div');
      statusRegionEl.id = 'a11y-farm-status';
      statusRegionEl.className = 'visually-hidden';
      statusRegionEl.setAttribute('role', 'region');
      statusRegionEl.setAttribute('aria-label', 'Trạng thái trang trại');
      document.body.appendChild(statusRegionEl);
    }
  }

  // Initial render
  refreshFarmStatus(sim);

  // Refresh every 5 seconds
  if (statusInterval) {
    clearInterval(statusInterval);
  }
  statusInterval = setInterval(() => {
    refreshFarmStatus();
  }, 5000);
}

export const accessibility = {
  init: initAccessibility,
  announce,
  refresh: () => refreshFarmStatus(),
};

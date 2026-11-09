import { describe, expect, it, vi } from 'vitest';
import {
  ConfettiFX,
  FlashFX,
  JuiceFX,
  MicroFX,
  ScreenShake,
} from '../juiceFx';

describe('JuiceFX Module - ScreenShake, Confetti, Flash & MicroFX', () => {
  it('ScreenShake: khởi tạo với intensity = 0 và offset = (0, 0)', () => {
    const shake = new ScreenShake(0.9, false);
    expect(shake.intensity).toBe(0);
    expect(shake.offset).toEqual({ x: 0, y: 0 });
  });

  it('ScreenShake: add(10) tăng intensity và tick() suy giảm theo decay 0.9/frame', () => {
    const shake = new ScreenShake(0.9, false);
    shake.add(10);
    expect(shake.intensity).toBe(10);

    const offset1 = shake.tick(1 / 60);
    // Sau 1 frame 60fps, intensity giảm theo decay = 0.9 (10 * 0.9 = 9.0)
    expect(shake.intensity).toBeCloseTo(9.0, 1);
    expect(offset1.x !== 0 || offset1.y !== 0).toBe(true);

    // Chạy thêm 50 frame (~1s) -> intensity suy giảm về 0
    for (let i = 0; i < 50; i++) {
      shake.tick(1 / 60);
    }
    expect(shake.intensity).toBe(0);
    expect(shake.offset).toEqual({ x: 0, y: 0 });
  });

  it('ScreenShake: tôn reducedMotion - không rung và luôn trả về (0, 0)', () => {
    const shake = new ScreenShake(0.9, true);
    shake.add(15);
    expect(shake.intensity).toBe(0);

    const offset = shake.tick(1 / 60);
    expect(offset).toEqual({ x: 0, y: 0 });
  });

  it('ConfettiFX: khởi tạo preallocated pool đúng 100 hạt không cấp phát thêm', () => {
    const confetti = new ConfettiFX(100, false);
    expect(confetti.pool.length).toBe(100);
    expect(confetti.getActiveCount()).toBe(0);
  });

  it('ConfettiFX: emit(x, y, 20) kích hoạt đúng 20 hạt từ pool và tái sử dụng', () => {
    const confetti = new ConfettiFX(100, false);
    const activated = confetti.emit(200, 300, 20);
    expect(activated).toBe(20);
    expect(confetti.getActiveCount()).toBe(20);

    // Sau khi tick vượt maxLife (~2.5s), các hạt tự tắt trả về pool
    for (let i = 0; i < 150; i++) {
      confetti.tick(1 / 60);
    }
    expect(confetti.getActiveCount()).toBe(0);
    expect(confetti.pool.length).toBe(100); // Pool giữ nguyên 100, không bị co giãn
  });

  it('ConfettiFX: tôn reducedMotion - không emit hạt nào khi bật reducedMotion', () => {
    const confetti = new ConfettiFX(100, true);
    const count = confetti.emit(100, 100, 30);
    expect(count).toBe(0);
    expect(confetti.getActiveCount()).toBe(0);
  });

  it('FlashFX: trigger(color, alpha) và fade-out giảm dần về 0', () => {
    const flash = new FlashFX();
    flash.trigger('#fde047', 0.4, 200); // 200ms
    expect(flash.alpha).toBe(0.4);
    expect(flash.color).toBe('#fde047');

    flash.tick(0.1); // trôi qua 100ms
    expect(flash.alpha).toBeLessThan(0.4);
    expect(flash.alpha).toBeGreaterThan(0);

    flash.tick(0.15); // tổng cộng 250ms > 200ms
    expect(flash.alpha).toBe(0);
  });

  it('MicroFX: pulseScale(t) nhún nảy overshoot và trở về 1.0 ở t=0 hoặc t=1', () => {
    expect(MicroFX.pulseScale(0)).toBe(1);
    expect(MicroFX.pulseScale(1)).toBe(1);
    // Đỉnh nhún nằm ở khoảng t = 0.2
    const peak = MicroFX.pulseScale(0.2);
    expect(peak).toBeGreaterThan(1.1);
  });

  it('JuiceFX: lớp tổng thể tích hợp addShake, addFlash, emitConfetti và applyTo', () => {
    const juice = new JuiceFX({ reducedMotion: false });
    expect(juice.isReducedMotion()).toBe(false);

    juice.addShake(8);
    juice.addFlash('#ffffff', 0.5, 300);
    juice.emitConfetti(150, 150, 15, ['⭐', '🌾']);

    juice.tick(1 / 60);
    expect(juice.getShakeOffset()).toBeDefined();

    // Mock CanvasRenderingContext2D để kiểm tra applyTo không ném ngoại lệ
    const mockCtx = {
      canvas: { width: 800, height: 600 },
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      beginPath: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
    } as unknown as CanvasRenderingContext2D;

    juice.applyTo(mockCtx);
    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();

    // Chuyển sang reducedMotion
    juice.setReducedMotion(true);
    expect(juice.isReducedMotion()).toBe(true);
    expect(juice.screenShake.reducedMotion).toBe(true);
    expect(juice.confetti.reducedMotion).toBe(true);
  });
});

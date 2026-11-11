/**
 * ErrorMonitor — Giám sát lỗi runtime (uncaught errors + unhandled promise rejections)
 * Chuyển tiếp về Analytics (track('error', {msg, stack, url})) và ghi log ra console.
 */

import type { Analytics } from './analytics';

export interface ErrorEventPayload {
  msg: string;
  stack?: string;
  url?: string;
  line?: number;
  col?: number;
  type?: string;
}

export class ErrorMonitor {
  public readonly analytics: Analytics;
  public readonly maxErrorsPerSession: number;
  private isListening = false;
  private readonly seenSignatures = new Set<string>();
  private errorCountThisSession = 0;

  constructor(analytics: Analytics, options: { maxErrorsPerSession?: number } = {}) {
    this.analytics = analytics;
    this.maxErrorsPerSession = Math.max(1, options.maxErrorsPerSession ?? 10);
  }

  private recordDeduplicatedError(payload: ErrorEventPayload): void {
    if (this.errorCountThisSession >= this.maxErrorsPerSession) return;
    const sig = `${payload.type || 'err'}|${payload.msg.slice(0, 160)}|${payload.line ?? 0}|${payload.col ?? 0}`;
    if (this.seenSignatures.has(sig)) return;
    this.seenSignatures.add(sig);
    this.errorCountThisSession += 1;
    try {
      this.analytics.track('error', payload as unknown as Record<string, unknown>);
    } catch {
      // Bỏ qua lỗi gửi track
    }
  }

  private handleError = (event: ErrorEvent): void => {
    const msg = event.message || (event.error ? String(event.error) : 'Uncaught runtime error');
    const stack = event.error && typeof event.error === 'object' && 'stack' in event.error
      ? String(event.error.stack)
      : '';
    const url = event.filename || (typeof window !== 'undefined' ? window.location.href : '');

    const payload: ErrorEventPayload = {
      msg,
      stack,
      url,
      line: event.lineno,
      col: event.colno,
      type: 'uncaught_error',
    };

    this.recordDeduplicatedError(payload);

    console.error('[ErrorMonitor] Uncaught error detected:', event.message, event.error);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;
    const isError = reason instanceof Error;
    const msg = isError ? reason.message : (reason ? String(reason) : 'Unhandled promise rejection');
    const stack = isError ? (reason.stack || '') : '';
    const url = typeof window !== 'undefined' ? window.location.href : '';

    const payload: ErrorEventPayload = {
      msg,
      stack,
      url,
      type: 'unhandledrejection',
    };

    this.recordDeduplicatedError(payload);

    console.error('[ErrorMonitor] Unhandled Promise rejection detected:', reason);
  };

  public init(): void {
    if (this.isListening || typeof window === 'undefined') return;
    this.isListening = true;

    window.addEventListener('error', this.handleError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public destroy(): void {
    if (!this.isListening || typeof window === 'undefined') return;
    this.isListening = false;

    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }
}

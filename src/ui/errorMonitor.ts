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

const SENSITIVE_PARAM_RE = /^(?:burrow-ticket|hpvn-ticket|ticket|token|id_token|idtoken|access_token|auth|secret|key)$/i;

export function sanitizeTelemetryText(raw: string): string {
  if (!raw) return '';
  return raw.replace(
    /((?:#|[?&])(?:burrow-ticket|hpvn-ticket|ticket|token|id_token|idtoken|access_token)=)[^&#\s'")]+/gi,
    '$1[REDACTED]'
  );
}

export function sanitizeTelemetryUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const hashStripped = rawUrl.split('#')[0] ?? '';
  try {
    const base =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : 'https://hangsoc.local';
    const parsed = new URL(hashStripped, base);
    parsed.hash = '';
    for (const k of Array.from(parsed.searchParams.keys())) {
      if (SENSITIVE_PARAM_RE.test(k)) {
        parsed.searchParams.delete(k);
      }
    }
    if (/^https?:\/\//i.test(hashStripped)) {
      return parsed.toString();
    }
    const qs = parsed.searchParams.toString();
    return `${parsed.pathname}${qs ? `?${qs}` : ''}`;
  } catch {
    return sanitizeTelemetryText(hashStripped);
  }
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
    const cleanPayload: ErrorEventPayload = {
      ...payload,
      msg: sanitizeTelemetryText(payload.msg),
      ...(payload.stack ? { stack: sanitizeTelemetryText(payload.stack) } : {}),
      ...(payload.url ? { url: sanitizeTelemetryUrl(payload.url) } : {}),
    };
    const sig = `${cleanPayload.type || 'err'}|${cleanPayload.msg.slice(0, 160)}|${cleanPayload.line ?? 0}|${cleanPayload.col ?? 0}`;
    if (this.seenSignatures.has(sig)) return;
    this.seenSignatures.add(sig);
    this.errorCountThisSession += 1;
    try {
      this.analytics.track('error', cleanPayload as unknown as Record<string, unknown>);
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

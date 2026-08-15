import { describe, expect, it } from 'vitest';
import { assertShareLinkActive, createShareToken, hashShareToken } from './delivery';

describe('share link security', () => {
  it('generates high-entropy URL-safe tokens and stores only a deterministic hash', () => {
    const token = createShareToken();
    expect(token).toHaveLength(43);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(hashShareToken(token)).toHaveLength(64);
    expect(hashShareToken(token)).toBe(hashShareToken(token));
    expect(hashShareToken(token)).not.toBe(token);
  });

  it('rejects revoked links', () => {
    expect(() => assertShareLinkActive({ isActive: false, expiresAt: null, maxDownloads: null, downloadCount: 0 })).toThrowError('Link này không còn hoạt động.');
  });

  it('rejects expired links', () => {
    expect(() => assertShareLinkActive({ isActive: true, expiresAt: new Date(Date.now() - 1), maxDownloads: null, downloadCount: 0 })).toThrowError('Link này đã hết hạn.');
  });

  it('rejects exhausted download limits', () => {
    expect(() => assertShareLinkActive({ isActive: true, expiresAt: null, maxDownloads: 1, downloadCount: 1 })).toThrowError('Link đã đạt giới hạn tải xuống.');
  });

  it('allows an active unlimited link', () => {
    expect(() => assertShareLinkActive({ isActive: true, expiresAt: null, maxDownloads: null, downloadCount: 100 })).not.toThrow();
  });
});

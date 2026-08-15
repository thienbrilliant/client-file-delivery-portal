import { describe, expect, it } from 'vitest';
import { createSecureToken, hashToken, safeTokenMatch } from './tokens';

describe('secure tokens', () => {
  it('creates high-entropy URL-safe tokens', () => {
    const first = createSecureToken();
    const second = createSecureToken();
    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThanOrEqual(40);
    expect(first).not.toMatch(/[+/=]/);
  });

  it('matches only the original token hash', () => {
    const token = createSecureToken();
    const hash = hashToken(token);
    expect(safeTokenMatch(token, hash)).toBe(true);
    expect(safeTokenMatch(`${token}x`, hash)).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { createSecureToken, hashToken, safeTokenMatch } from '@/lib/security/tokens';
describe('secure share tokens', () => {
  it('creates high-entropy URL-safe tokens', () => { const token = createSecureToken(); expect(token.length).toBeGreaterThanOrEqual(40); expect(token).toMatch(/^[A-Za-z0-9_-]+$/); });
  it('stores and compares token hashes without raw token reuse', () => { const token = createSecureToken(); const hash = hashToken(token); expect(hash).not.toContain(token); expect(safeTokenMatch(token, hash)).toBe(true); expect(safeTokenMatch(`${token}-invalid`, hash)).toBe(false); });
});

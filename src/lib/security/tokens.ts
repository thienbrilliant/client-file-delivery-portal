import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
export function createSecureToken(byteLength = 32): string { return randomBytes(byteLength).toString('base64url'); }
export function hashToken(token: string): string { return createHash('sha256').update(token).digest('hex'); }
export function safeTokenMatch(token: string, expectedHash: string): boolean { const received = Buffer.from(hashToken(token), 'hex'); const expected = Buffer.from(expectedHash, 'hex'); return received.length === expected.length && timingSafeEqual(received, expected); }

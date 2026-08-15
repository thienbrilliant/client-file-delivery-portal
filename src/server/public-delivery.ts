import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'delivery_access';
const TTL_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!value) throw new Error('AUTH_SECRET is required for public delivery access cookies.');
  return value;
}

export function createDeliveryAccessCookieValue(linkId: string) {
  const payload = `${linkId}.${Math.floor(Date.now() / 1000) + TTL_SECONDS}`;
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyDeliveryAccessCookie(value: string | undefined, linkId: string) {
  if (!value) return false;
  const [cookieLinkId, expiry, signature] = value.split('.');
  if (!cookieLinkId || !expiry || !signature || cookieLinkId !== linkId || Number(expiry) < Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac('sha256', secret()).update(`${cookieLinkId}.${expiry}`).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const DELIVERY_ACCESS_COOKIE = COOKIE_NAME;
export const DELIVERY_ACCESS_TTL = TTL_SECONDS;

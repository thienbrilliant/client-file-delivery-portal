import { NextResponse } from 'next/server';
import { createStorageProvider } from '@/lib/storage';

export async function GET() {
  try {
    await createStorageProvider().exists('__system__/healthcheck');
    return NextResponse.json({ status: 'ok', checks: { storage: 'ok' } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'error', checks: { storage: 'error' } }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok', checks: { process: 'ok' }, timestamp: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } });
}

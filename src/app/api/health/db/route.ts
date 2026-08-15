import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'ok', checks: { database: 'ok' } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'error', checks: { database: 'error' } }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}

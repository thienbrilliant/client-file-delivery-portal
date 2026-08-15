import Link from 'next/link';
import { Package, Plus } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';
import { Button } from '@/components/ui/button';

export default async function DeliveriesPage() {
  await requireAdmin();
  const deliveries = await prisma.delivery.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      project
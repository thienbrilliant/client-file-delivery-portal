import Link from 'next/link';
import { Files, FolderOpen } from 'lucide-react';
import { prisma } from '@/lib/db/prisma';
import { requireAdmin } from '@/server/require-auth';

function formatBytes(bytes: bigint) {
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
  return `${(value / 1024 ** 3).toFixed(1)} GB`;
}

export default async function FilesPage() {
  await requireAdmin();
  const files = await prisma.file.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 100,
    include: { project: { select: { id: true, name: true } }, folder: { select: { id: true, name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-[var(--muted)]">Tài nguyên dự án</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">File</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">Xem nhanh các tệp đã tải lên trong toàn bộ dự án.</p>
      </div>
      <section className="surface rounded-[10px]">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-semibold">Tất cả file</h2>
          <span className="text-sm text-[var(--muted)]">{files.length} file</span>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {files.map((file) => (
            <Link key={file.id} href={`/du-an/${file.project.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-muted)]">
              <Files className="h-5 w-5 shrink-0 text-[var(--muted)]" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{file.originalName}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-[var(--muted)]"><FolderOpen className="h-3 w-3" />{file.project.name}{file.folder ? ` · ${file.folder.name}` : ''}</p>
              </div>
              <div className="shrink-0 text-right text-xs text-[var(--muted)]">
                <p>{file.mimeType || 'Không rõ loại'}</p>
                <p className="mt-1">{formatBytes(file.size)}</p>
              </div>
            </Link>
          ))}
          {files.length === 0 && <p className="px-5 py-12 text-center text-sm text-[var(--muted)]">Chưa có file nào.</p>}
        </div>
      </section>
    </div>
  );
}

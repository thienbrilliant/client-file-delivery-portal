import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { getShareLinkForToken } from '@/server/delivery';
import { verifyDeliveryAccessCookie, DELIVERY_ACCESS_COOKIE } from '@/server/public-delivery';
import { PasswordGate } from './PasswordGate';

function formatBytes(value: bigint) { const n = Number(value); if (!Number.isFinite(n)) return '—'; if (n < 1024) return `${n} B`; if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`; if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`; return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`; }

export default async function DeliveryPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let link;
  try { link = await getShareLinkForToken(token); } catch { notFound(); }
  if (!link) notFound();
  if (link.passwordHash) {
    const cookie = (await cookies()).get(DELIVERY_ACCESS_COOKIE)?.value;
    if (!verifyDeliveryAccessCookie(cookie, link.id)) return <PasswordGate token={token} />;
  }
  return <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-[var(--foreground)] sm:px-8"><div className="mx-auto max-w-3xl"><header className="border-b border-[var(--border)] pb-7"><p className="text-sm font-semibold tracking-wide text-[var(--muted)]">CLIENT FILE DELIVERY</p><h1 className="mt-4 text-3xl font-semibold tracking-tight">{link.delivery.title}</h1>{link.delivery.description && <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{link.delivery.description}</p>}<div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]"><span>{link.delivery.files.length} file</span>{link.expiresAt && <span>Hết hạn {link.expiresAt.toLocaleDateString('vi-VN')}</span>}{link.maxDownloads !== null && <span>Còn {Math.max(0, link.maxDownloads - link.downloadCount)} lượt tải</span>}</div></header><section className="py-7" aria-label="Danh sách file"><div className="divide-y divide-[var(--border)] rounded-[10px] border border-[var(--border)] bg-[var(--surface)]">{link.delivery.files.map(({ file }) => <div key={file.id} className="flex items-center gap-4 px-4 py-4 sm:px-5"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.originalName}</p><p className="mt-1 text-xs text-[var(--muted)]">{file.mimeType || 'File'} · {formatBytes(file.size)}</p></div><a className="focus-ring inline-flex h-9 items-center rounded-[8px] border border-[var(--border)] px-3 text-sm font-medium hover:bg-[var(--surface-muted)]" href={`/api/public/deliveries/${encodeURIComponent(token)}/files/${encodeURIComponent(file.id)}`}>Tải xuống</a></div>)}</div></section><footer className="border-t border-[var(--border)] pt-5 text-xs text-[var(--muted)]">Nếu bạn gặp vấn đề khi tải file, vui lòng liên hệ người gửi để nhận hỗ trợ.</footer></div></main>;
}

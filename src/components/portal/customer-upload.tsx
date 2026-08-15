'use client';

import { useState } from 'react';
import { CheckCircle2, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CustomerUpload({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const onSubmit = async () => {
    if (!files.length || busy) return;
    setBusy(true); setMessage(null);
    const form = new FormData(); files.forEach((file) => form.append('files', file));
    try {
      const response = await fetch(`/api/projects/${projectId}/customer-upload`, { method: 'POST', body: form });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? 'Không thể gửi file.');
      setFiles([]); setMessage('Đã gửi thành công. Đội ngũ của chúng tôi sẽ kiểm tra file sớm nhất có thể.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Không thể gửi file.'); }
    finally { setBusy(false); }
  };
  return <div className="surface rounded-[10px] p-5"><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)] text-[var(--primary)]"><UploadCloud className="h-4 w-4" /></div><div><h2 className="text-sm font-semibold">Gửi tài liệu</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">Bạn có thể gửi file cho đội ngũ của chúng tôi.</p></div></div><label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[var(--border)] px-5 py-7 text-center transition-colors hover:bg-[var(--surface-muted)]"><UploadCloud className="h-6 w-6 text-[var(--muted)]" /><span className="mt-2 text-sm font-medium">Chọn file</span><span className="mt-1 text-xs text-[var(--muted)]">Có thể chọn nhiều file</span><input className="sr-only" type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /></label>{files.length ? <p className="mt-3 truncate text-xs text-[var(--muted)]">{files.map((file) => file.name).join(', ')}</p> : null}<div className="mt-4 flex items-center justify-between gap-3">{message ? <p className="flex items-center gap-2 text-xs text-[var(--muted)]"><CheckCircle2 className="h-4 w-4 text-[var(--success)]" />{message}</p> : <span /> }<Button onClick={onSubmit} disabled={!files.length || busy}>{busy ? 'Đang gửi…' : 'Gửi file'}</Button></div></div>;
}

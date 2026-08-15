'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CustomerAccountActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function run(action: string) {
    const labels: Record<string, string> = { suspend: 'Tạm khóa tài khoản này?', disable: 'Vô hiệu hóa tài khoản này?', delete: 'Vô hiệu hóa và đánh dấu tài khoản này để xóa?', 'revoke-sessions': 'Đăng xuất khỏi tất cả thiết bị?' };
    if (labels[action] && !window.confirm(labels[action])) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/customers/${id}/account`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
      if (!response.ok) { const body = await response.json(); window.alert(body.error?.message ?? 'Không thể thực hiện thao tác.'); return; }
      router.refresh();
    } finally { setBusy(false); }
  }
  return <div className="flex flex-wrap gap-2">
    {status === 'SUSPENDED' && <button disabled={busy} onClick={() => run('reactivate')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Kích hoạt lại</button>}
    {status === 'ACTIVE' && <button disabled={busy} onClick={() => run('suspend')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Tạm khóa</button>}
    {(status === 'ACTIVE' || status === 'SUSPENDED' || status === 'INVITED') && <button disabled={busy} onClick={() => run('revoke-sessions')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Đăng xuất tất cả</button>}
    {status !== 'DISABLED' && <button disabled={busy} onClick={() => run('disable')} className="rounded-[9px] border border-red-200 px-3 py-2 text-sm font-medium text-red-700">Vô hiệu hóa</button>}
  </div>;
}

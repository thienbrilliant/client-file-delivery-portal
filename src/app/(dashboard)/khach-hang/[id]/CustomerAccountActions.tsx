'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CustomerAccountActions({ id, status, email, deletedAt }: { id: string; status: string; email: string; deletedAt: string | null }) {
  const router = useRouter(); const [busy, setBusy] = useState(false);
  async function request(path: string, body?: unknown) { setBusy(true); try { const response = await fetch(path, { method: 'POST', headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined }); const json = await response.json(); if (!response.ok) { window.alert(json.error?.message ?? 'Không thể thực hiện thao tác.'); return null; } router.refresh(); return json.data; } finally { setBusy(false); } }
  async function run(action: string) { const labels: Record<string, string> = { suspend: 'Tạm khóa tài khoản này?', disable: 'Vô hiệu hóa tài khoản này?', 'revoke-sessions': 'Đăng xuất khỏi tất cả thiết bị?', reactivate: 'Kích hoạt lại tài khoản này?' }; if (labels[action] && !window.confirm(labels[action])) return; await request(`/api/customers/${id}/account`, { action }); }
  async function invite() { const data = await request(`/api/customers/${id}/invitation`); if (data?.activationUrl) { await navigator.clipboard.writeText(data.activationUrl); window.alert('Đã tạo lời mời mới và sao chép link kích hoạt.'); } }
  async function reset() { if (!window.confirm('Gửi yêu cầu đặt lại mật khẩu cho khách hàng này?')) return; await request(`/api/customers/${id}/password-reset`); }
  async function remove() { if (!window.confirm(`Tài khoản ${email} sẽ bị vô hiệu hóa và dữ liệu sẽ được giữ lại. Tiếp tục?`)) return; const typed = window.prompt(`Nhập email ${email} để xác nhận:`); if (typed?.trim().toLowerCase() !== email.toLowerCase()) return; await request(`/api/customers/${id}/account`, { action: 'delete' }); }
  return <div className="flex flex-wrap gap-2">
    {status === 'INVITED' && <button disabled={busy} onClick={invite} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Gửi lại lời mời</button>}
    {status !== 'INVITED' && status !== 'DISABLED' && <button disabled={busy} onClick={reset} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Yêu cầu đặt lại mật khẩu</button>}
    {(status === 'SUSPENDED' || (status === 'DISABLED' && !deletedAt)) && <button disabled={busy} onClick={() => run('reactivate')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Kích hoạt lại</button>}
    {status === 'ACTIVE' && <button disabled={busy} onClick={() => run('suspend')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Tạm khóa</button>}
    {(status === 'ACTIVE' || status === 'SUSPENDED' || status === 'INVITED') && <button disabled={busy} onClick={() => run('revoke-sessions')} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium">Đăng xuất tất cả</button>}
    {status !== 'DISABLED' && <button disabled={busy} onClick={() => run('disable')} className="rounded-[9px] border border-red-200 px-3 py-2 text-sm font-medium text-red-700">Vô hiệu hóa</button>}
    {status !== 'DISABLED' && <button disabled={busy} onClick={remove} className="rounded-[9px] border border-red-300 px-3 py-2 text-sm font-medium text-red-700">Xóa tài khoản</button>}
  </div>;
}

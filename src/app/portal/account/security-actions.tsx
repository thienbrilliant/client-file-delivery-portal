'use client';

import { useState } from 'react';

export function SecurityActions() {
  const [busy, setBusy] = useState(false);
  async function revoke() {
    if (!window.confirm('Đăng xuất khỏi tất cả thiết bị? Thiết bị hiện tại cũng sẽ cần đăng nhập lại.')) return;
    setBusy(true);
    try { await fetch('/api/portal/account/security', { method: 'POST' }); window.location.href = '/dang-nhap'; } finally { setBusy(false); }
  }
  return <button disabled={busy} onClick={revoke} className="rounded-[9px] border border-[var(--border)] px-3 py-2 text-sm font-medium disabled:opacity-50">{busy ? 'Đang thu hồi…' : 'Đăng xuất tất cả thiết bị'}</button>;
}

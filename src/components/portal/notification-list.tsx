'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Item = { id: string; title: string; message: string; href: string | null; isRead: boolean; createdAt: string };

export function NotificationList({ initialItems, initialUnread }: { initialItems: Item[]; initialUnread: number }) {
  const [items, setItems] = useState(initialItems);
  const [unread, setUnread] = useState(initialUnread);
  const mark = async (id?: string) => { await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(id ? { id } : { all: true }) }); if (id) { setItems((current) => current.map((item) => item.id === id ? { ...item, isRead: true } : item)); setUnread((value) => Math.max(0, value - 1)); } else { setItems((current) => current.map((item) => ({ ...item, isRead: true }))); setUnread(0); } };
  return <div className="space-y-4"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">Thông báo</h1><p className="mt-1 text-sm text-[var(--muted)]">{unread ? `${unread} thông báo chưa đọc` : 'Bạn đã xem hết thông báo.'}</p></div>{unread ? <Button variant="ghost" onClick={() => mark()}>Đánh dấu tất cả đã đọc</Button> : null}</div>{items.length ? <div className="surface divide-y divide-[var(--border)] rounded-[10px]">{items.map((item) => <div key={item.id} className={`flex gap-3 px-5 py-4 ${item.isRead ? '' : 'bg-[var(--surface-muted)]/45'}`}><div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--surface-muted)] text-[var(--primary)]"><Bell className="h-4 w-4" /></div><div className="min-w-0 flex-1"><div className="flex items-start gap-2"><div className="min-w-0 flex-1">{item.href ? <Link href={item.href} onClick={() => !item.isRead && mark(item.id)} className="text-sm font-medium hover:text-[var(--primary)]">{item.title}</Link> : <p className="text-sm font-medium">{item.title}</p>}<p className="mt-1 text-sm leading-5 text-[var(--muted)]">{item.message}</p><p className="mt-2 text-[11px] text-[var(--muted)]">{formatTime(item.createdAt)}</p></div>{!item.isRead ? <button onClick={() => mark(item.id)} className="focus-ring shrink-0 rounded-[7px] p-1.5 text-[var(--muted)] hover:bg-[var(--surface)]" aria-label="Đánh dấu đã đọc"><Check className="h-4 w-4" /></button> : null}</div></div></div>)}</div> : <div className="surface rounded-[10px] px-5 py-14 text-center"><Bell className="mx-auto h-8 w-8 text-[var(--muted)]" /><h2 className="mt-3 text-sm font-semibold">Chưa có thông báo</h2><p className="mt-1 text-sm text-[var(--muted)]">Các cập nhật liên quan đến dự án và bàn giao sẽ xuất hiện ở đây.</p></div>}</div>;
}
function formatTime(value: string) { const date = new Date(value); const minutes = Math.floor((Date.now() - date.getTime()) / 60000); if (minutes < 1) return 'Vừa xong'; if (minutes < 60) return `${minutes} phút trước`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} giờ trước`; return date.toLocaleDateString('vi-VN'); }

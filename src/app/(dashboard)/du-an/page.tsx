'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionPage } from '@/components/layout/section-page';

type Project = { id:string; name:string; status:string; customerId:string; customer:{name:string|null;email:string}; _count:{files:number;folders:number} };
type Customer = { id:string; name:string|null; email:string };

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ customerId:'', name:'', description:'' });

  const load = useCallback(async () => {
    const response = await fetch(`/api/projects?q=${encodeURIComponent(q)}`);
    const json = await response.json();
    setItems(json.data?.items ?? []);
  }, [q]);

  useEffect(() => {
    void load();
    void fetch('/api/customers').then((response) => response.json()).then((json) => setCustomers(json.data?.items ?? []));
    // Data fetching is the external synchronization this effect is responsible for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [load]);

  return <SectionPage title="Dự án" description="Theo dõi tiến độ, trạng thái và các tệp thuộc từng dự án." icon={FolderKanban}>
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="relative w-full sm:max-w-sm"><Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted)]" /><Input className="pl-9" placeholder="Tìm dự án..." value={q} onChange={(event) => setQ(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && void load()} /></div>
        <Button onClick={() => document.getElementById('project-form')?.scrollIntoView({behavior:'smooth'})}><Plus className="h-4 w-4" />Tạo dự án</Button>
      </div>
      <div className="overflow-x-auto rounded-[8px] border border-[var(--border)]"><table className="w-full min-w-[760px] text-sm"><thead className="bg-[var(--surface-muted)] text-left text-[var(--muted)]"><tr><th className="px-4 py-3">Tên dự án</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">File</th><th className="px-4 py-3">Thư mục</th></tr></thead><tbody>{items.length===0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-[var(--muted)]">Chưa có dự án.</td></tr> : items.map((project) => <tr key={project.id} className="border-t border-[var(--border)]"><td className="px-4 py-3 font-medium"><Link className="hover:underline" href={`/du-an/${project.id}`}>{project.name}</Link></td><td className="px-4 py-3">{project.customer.name||project.customer.email}</td><td className="px-4 py-3">{project.status}</td><td className="px-4 py-3">{project._count.files}</td><td className="px-4 py-3">{project._count.folders}</td></tr>)}</tbody></table></div>
      <div id="project-form" className="rounded-[8px] border border-[var(--border)] p-5"><h2 className="font-semibold">Tạo dự án</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Input placeholder="Tên dự án" value={form.name} onChange={(event) => setForm({...form,name:event.target.value})} /><select className="h-9 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm" value={form.customerId} onChange={(event) => setForm({...form,customerId:event.target.value})}><option value="">Chọn khách hàng</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name||customer.email}</option>)}</select><Input className="sm:col-span-2" placeholder="Mô tả" value={form.description} onChange={(event) => setForm({...form,description:event.target.value})} /></div><div className="mt-3 flex justify-end"><Button onClick={async()=>{const response=await fetch('/api/projects',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});if(response.ok){setForm({customerId:'',name:'',description:''});await load();}}}>Tạo dự án</Button></div></div>
    </div>
  </SectionPage>;
}

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, File, Folder, FolderPlus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Project={id:string;name:string;description:string|null;status:string;customer:{name:string|null;email:string}};
type FolderItem={id:string;name:string;_count:{files:number;children:number}};
type FileItem={id:string;originalName:string;mimeType:string;size:string|number;updatedAt:string};

export default function ProjectDetail({params}:{params:Promise<{id:string}>}) {
  const input=useRef<HTMLInputElement>(null);
  const [project,setProject]=useState<Project|null>(null);
  const [folders,setFolders]=useState<FolderItem[]>([]);
  const [files,setFiles]=useState<FileItem[]>([]);
  const [folderId,setFolderId]=useState<string|null>(null);
  const [q,setQ]=useState('');
  const [busy,setBusy]=useState(false);
  const [id,setId]=useState<string|null>(null);

  useEffect(() => {
    let active = true;
    void params.then((value) => { if (active) setId(value.id); });
    return () => { active = false; };
  }, [params]);

  const load = useCallback(async () => {
    if (!id) return;
    const [projectResponse, folderResponse, fileResponse] = await Promise.all([
      fetch(`/api/projects?id=${id}`),
      fetch(`/api/folders?projectId=${id}${folderId ? `&parentId=${folderId}` : ''}`),
      fetch(`/api/files?projectId=${id}${folderId ? `&folderId=${folderId}` : ''}&q=${encodeURIComponent(q)}`),
    ]);
    const projectJson=await projectResponse.json();
    const folderJson=await folderResponse.json();
    const fileJson=await fileResponse.json();
    setProject(projectJson.data);
    setFolders(folderJson.data??[]);
    setFiles(fileJson.data?.items??[]);
  }, [folderId, id, q]);

  useEffect(() => { void load(); }, [load]);

  if(!project) return <div className="p-8 text-sm text-[var(--muted)]">Đang tải dự án...</div>;

  const upload=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    if(!e.target.files?.length)return;
    setBusy(true);
    const fd=new FormData();
    fd.append('projectId',id ?? '');
    if(folderId)fd.append('folderId',folderId);
    for(const file of Array.from(e.target.files))fd.append('files',file);
    const response=await fetch('/api/files',{method:'POST',body:fd});
    setBusy(false);
    e.target.value='';
    if(response.ok)await load();
  };

  return <div className="space-y-6">
    <div><Link href="/du-an" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="h-4 w-4"/>Dự án</Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1><p className="mt-1 text-sm text-[var(--muted)]">{project.customer.name||project.customer.email} · {project.status}</p></div>
        <div className="flex gap-2"><input ref={input} type="file" multiple hidden onChange={upload}/><Button disabled={busy} onClick={()=>input.current?.click()}><Upload className="h-4 w-4"/>{busy?'Đang tải...':'Tải file lên'}</Button><Button variant="secondary" onClick={async()=>{const n=prompt('Tên thư mục');if(!n)return;const response=await fetch('/api/folders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({projectId:id,parentId:folderId,name:n})});if(response.ok)await load()}}><FolderPlus className="h-4 w-4"/>Thư mục mới</Button></div>
      </div>
    </div>
    <div className="surface rounded-[10px] p-5"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm text-[var(--muted)]">{project.name} / {folderId?'Thư mục hiện tại':'Gốc'}</div><div className="w-full sm:max-w-xs"><Input placeholder="Tìm file..." value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&void load()}/></div></div>
      <div className="mt-5 space-y-1">{folderId&&<button onClick={()=>setFolderId(null)} className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]"><Folder className="h-4 w-4"/>Quay lại</button>}{folders.map(f=><button key={f.id} onClick={()=>setFolderId(f.id)} className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-sm hover:bg-[var(--surface-muted)]"><Folder className="h-4 w-4"/><span className="font-medium">{f.name}</span><span className="ml-auto text-xs text-[var(--muted)]">{f._count.files} file</span></button>)}{files.map(f=><div key={f.id} className="flex items-center gap-3 rounded-[8px] px-3 py-2 text-sm hover:bg-[var(--surface-muted)]"><File className="h-4 w-4 text-[var(--muted)]"/><span className="min-w-0 flex-1 truncate">{f.originalName}</span><span className="hidden text-xs text-[var(--muted)] sm:block">{(Number(f.size)/1024/1024).toFixed(1)} MB</span><a className="p-2 text-[var(--muted)] hover:text-[var(--foreground)]" href={`/api/files/${f.id}`} aria-label={`Tải xuống ${f.originalName}`}><Download className="h-4 w-4"/></a><button aria-label={`Xóa ${f.originalName}`} className="p-2 text-[var(--muted)] hover:text-[var(--destructive)]" onClick={async()=>{if(confirm(`Xóa ${f.originalName}?`)){const response=await fetch(`/api/files/${f.id}`,{method:'DELETE'});if(response.ok)await load()}}}><Trash2 className="h-4 w-4"/></button></div>)}{!folders.length&&!files.length&&<div className="py-14 text-center"><p className="font-medium">Chưa có file nào</p><p className="mt-1 text-sm text-[var(--muted)]">Tải file đầu tiên lên để bắt đầu quản lý tài liệu.</p></div>}</div>
    </div>
  </div>;
}

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowRight, Check, FileCheck2, FolderKanban, Link2, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react';
import { auth } from '../../auth';
import { siteConfig } from '@/config/site';

const features = [
  { icon: UploadCloud, title: 'Gửi file gọn gàng', text: 'Upload, sắp xếp và theo dõi file theo từng dự án thay vì lục tung inbox.' },
  { icon: Link2, title: 'Bàn giao bằng một link', text: 'Tạo không gian chia sẻ rõ ràng, có hạn dùng và kiểm soát truy cập.' },
  { icon: ShieldCheck, title: 'Bảo mật ngay từ đầu', text: 'Đăng nhập an toàn, phân quyền khách hàng và nhật ký hoạt động minh bạch.' },
  { icon: FileCheck2, title: 'Biết file đang ở đâu', text: 'Theo dõi trạng thái dự án, lượt tải và những thay đổi quan trọng.' },
];

const steps = [
  ['01', 'Tạo khách hàng & dự án', 'Thiết lập workspace trong vài phút.'],
  ['02', 'Upload và chuẩn bị bàn giao', 'Gom file, mô tả và cấu trúc nội dung rõ ràng.'],
  ['03', 'Gửi link cho khách hàng', 'Khách hàng đăng nhập hoặc mở link để nhận file.'],
];

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') redirect('/tong-quan');
  if (session?.user?.role === 'CUSTOMER') redirect('/portal');

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--background)]">
      <section className="relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(159,201,187,.28),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(231,220,195,.35),transparent_30%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-lg shadow-emerald-950/10"><FolderKanban className="h-4 w-4" /></span><span>{siteConfig.name}</span></Link>
          <div className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex"><a href="#tinh-nang" className="hover:text-[var(--foreground)]">Tính năng</a><a href="#quy-trinh" className="hover:text-[var(--foreground)]">Quy trình</a><a href="#bat-dau" className="hover:text-[var(--foreground)]">Bắt đầu</a></div>
          <div className="flex items-center gap-2"><Link href="/dang-nhap" className="rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/70">Đăng nhập</Link><Link href="/dang-ky" className="hidden rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white shadow-sm sm:inline-flex">Dùng thử miễn phí</Link></div>
        </nav>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:pb-28 lg:pt-16">
          <div><div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/75 px-3 py-1.5 text-xs font-medium text-[var(--primary)] shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5" /> File delivery, nhưng đỡ đau đầu hơn</div><h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-.045em] text-[var(--foreground)] sm:text-6xl lg:text-[72px] lg:leading-[1.02]">Bàn giao file <span className="text-[var(--primary)]">đẹp, nhanh, có kiểm soát.</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">Một workspace dành cho team dịch vụ sáng tạo: quản lý khách hàng, dự án, file và bàn giao trong cùng một nơi.</p><div id="bat-dau" className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/dang-ky" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-950/15 transition-transform hover:-translate-y-0.5">Tạo tài khoản miễn phí <ArrowRight className="h-4 w-4" /></Link><Link href="/dang-nhap" className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-white/70 px-5 py-3.5 text-sm font-semibold hover:bg-white">Tôi đã có tài khoản</Link></div><div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--muted)]"><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> Không cần thẻ</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> Workspace riêng</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[var(--success)]" /> Google sign-in</span></div></div>
          <div className="relative lg:pl-4"><div className="absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(circle,rgba(47,93,80,.16),transparent_62%)] blur-2xl" /><div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/70 p-2 shadow-[0_28px_80px_rgba(35,55,45,.16)] backdrop-blur"><img src="/portal-preview.svg" alt="Minh họa workspace quản lý file và bàn giao" className="block w-full rounded-[22px]" /></div><div className="absolute -bottom-5 -left-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:-left-8"><p className="text-[11px] text-[var(--muted)]">Trạng thái bàn giao</p><p className="mt-1 flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full bg-[var(--success)]" /> Sẵn sàng cho khách</p></div></div>
        </div>
      </section>
      <section id="tinh-nang" className="border-y border-[var(--border)] bg-white/55 py-20 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">Một nơi cho toàn bộ flow</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Ít tab hơn. Ít thất lạc hơn.</h2><p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-base">Thiết kế để thao tác hằng ngày nhanh: nhìn là hiểu, bấm là tới đúng chỗ, và luôn biết điều gì cần làm tiếp.</p></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="group rounded-2xl border border-[var(--border)] bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-sm font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></article>)}</div></div></section>
      <section id="quy-trinh" className="py-20 sm:py-24"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">Quy trình</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Từ file lộn xộn đến bàn giao chuyên nghiệp.</h2></div><div className="space-y-3">{steps.map(([number, title, text]) => <div key={number} className="flex gap-5 rounded-2xl border border-[var(--border)] bg-white p-5"><span className="font-mono text-xs text-[var(--primary)]">{number}</span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{text}</p></div></div>)}</div></div></div></section>
      <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8"><div className="relative overflow-hidden rounded-[28px] bg-[var(--foreground)] px-6 py-12 text-white sm:px-12"><div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl" /><div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-200">Sẵn sàng chưa?</p><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Đưa workflow bàn giao của bạn ra khỏi mớ tab.</h2></div><Link href="/dang-ky" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[var(--foreground)] hover:bg-emerald-50">Bắt đầu ngay <ArrowRight className="h-4 w-4" /></Link></div></div></section>
      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-5 pb-8 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>Lưu trữ · Bàn giao · Khách hàng</span></footer>
    </main>
  );
}

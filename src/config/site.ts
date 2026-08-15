export const siteConfig = { name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Client File Delivery Portal', description: 'Nơi lưu trữ và bàn giao file chuyên nghiệp cho khách hàng.' };
export const navigation = [
  { label: 'Tổng quan', href: '/', icon: 'LayoutDashboard' }, { label: 'Khách hàng', href: '/khach-hang', icon: 'Users' }, { label: 'Dự án', href: '/du-an', icon: 'FolderKanban' }, { label: 'File', href: '/file', icon: 'Files' }, { label: 'Bàn giao', href: '/ban-giao', icon: 'PackageCheck' }, { label: 'Link chia sẻ', href: '/link-chia-se', icon: 'Link2' }, { label: 'Hoạt động', href: '/hoat-dong', icon: 'Activity' }, { label: 'Thông báo', href: '/thong-bao', icon: 'Bell' }, { label: 'Cài đặt', href: '/cai-dat', icon: 'Settings' },
] as const;

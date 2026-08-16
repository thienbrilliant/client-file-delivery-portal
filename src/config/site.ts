export const siteConfig = { name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Client File Portal', description: 'Quản lý khách hàng, dự án, file và bàn giao trong một workspace rõ ràng.' };

export const navigation = [
  { label: 'Tổng quan', href: '/tong-quan', icon: 'LayoutDashboard' },
  { label: 'Khách hàng', href: '/khach-hang', icon: 'Users' },
  { label: 'Dự án', href: '/du-an', icon: 'FolderKanban' },
  { label: 'File', href: '/file', icon: 'Files' },
  { label: 'Bàn giao', href: '/ban-giao', icon: 'PackageCheck' },
  { label: 'Link chia sẻ', href: '/link-chia-se', icon: 'Link2' },
  { label: 'Thông báo', href: '/thong-bao', icon: 'Bell' },
] as const;

export const workspaceSecondaryNavigation = [
  { label: 'Hoạt động', href: '/hoat-dong', icon: 'Activity' },
  { label: 'Cài đặt', href: '/cai-dat', icon: 'Settings' },
] as const;

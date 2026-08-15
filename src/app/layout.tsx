import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/layout/theme-provider';
export const metadata: Metadata = { title: siteConfig.name, description: siteConfig.description };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi" suppressHydrationWarning><body><ThemeProvider>{children}</ThemeProvider></body></html>; }

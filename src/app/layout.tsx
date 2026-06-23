import type { Metadata } from 'next';
import './globals.css';
import { SupabaseProvider } from '@/supabase';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'GH Planner - برنامه‌ریز هوشمند جی‌اچ',
  description: 'مدیریت وظایف روزانه با هوش مصنوعی GH',
  manifest: '/manifest.json',
  themeColor: '#a855f7',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#a855f7" />
      </head>
      <body className="font-body antialiased selection:bg-primary selection:text-primary-foreground">
        <SupabaseProvider>
          {children}
          <Toaster />
        </SupabaseProvider>
      </body>
    </html>
  );
}

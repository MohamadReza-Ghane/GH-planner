import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GH Planner',
  description: 'برنامه‌ریز هوشمند GH',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

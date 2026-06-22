import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GH Planner',
  description: 'برنامه‌ریز هوشمند GH',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

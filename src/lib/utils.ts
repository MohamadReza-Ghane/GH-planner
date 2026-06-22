import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPersianDate(dateKey: string) {
  try {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return dateKey;
  }
}

export function getTodayKey() {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getTehranNow() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tehran' }));
}

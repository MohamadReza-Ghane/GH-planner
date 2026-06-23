
'use client';

import { useState, useEffect } from 'react';

export type Language = 'fa' | 'en';
export type ThemeMode = 'dark' | 'light';
export type CalendarSystem = 'jalali' | 'gregorian' | 'islamic' | 'hebrew';
export type ThemeColor = 'default' | 'cyberpunk' | 'ocean' | 'forest' | 'sunset' | 'lava' | 'emerald' | 'galaxy' | 'gold' | 'coffee' | 'cherry' | 'slate' | 'tokyo' | 'dracula' | 'nord' | 'aurora' | 'rose' | 'mint' | 'midnight' | 'neon' | 'minimal';

export function useSettings() {
  const [lang, setLang] = useState<Language>('fa');
  const [mode, setMode] = useState<ThemeMode>('dark');
  const [calendarSystem, setCalendarSystem] = useState<CalendarSystem>('jalali');
  const [themeColor, setThemeColor] = useState<ThemeColor>('default');

  useEffect(() => {
    const savedLang = localStorage.getItem('gh-lang') as Language;
    const savedMode = localStorage.getItem('gh-mode') as ThemeMode;
    const savedCal = localStorage.getItem('gh-calendar') as CalendarSystem;
    const savedTheme = localStorage.getItem('gh-theme-color') as ThemeColor;

    if (savedLang) updateLang(savedLang);
    if (savedMode) updateMode(savedMode);
    if (savedCal) setCalendarSystem(savedCal);
    if (savedTheme) updateThemeColor(savedTheme);
  }, []);

  const updateLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('gh-lang', newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const updateMode = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('gh-mode', newMode);
    if (newMode === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  const updateCalendar = (sys: CalendarSystem) => {
    setCalendarSystem(sys);
    localStorage.setItem('gh-calendar', sys);
  };

  const updateThemeColor = (color: ThemeColor) => {
    setThemeColor(color);
    localStorage.setItem('gh-theme-color', color);
    
    // Remove all theme classes
    const classes = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
    classes.forEach(c => document.body.classList.remove(c));
    
    if (color !== 'default') {
      document.body.classList.add(`theme-${color}`);
    }
  };

  return { lang, mode, calendarSystem, themeColor, updateLang, updateMode, updateCalendar, updateThemeColor };
}

export const translations = {
  fa: {
    // Existing translations...
    settings: 'تنظیمات پیشرفته GH',
    appearance: 'ظاهر و تم‌ها',
    calendar: 'سیستم گاه‌شماری',
    language: 'زبان رابط کاربری',
    themes: '۲۰ تم حرفه‌ای',
    logout: 'خروج از حساب'
  },
  en: {
    // Existing translations...
    settings: 'GH Advanced Settings',
    appearance: 'Appearance & Themes',
    calendar: 'Calendar System',
    language: 'Language',
    themes: '20 Premium Themes',
    logout: 'Logout'
  }
};

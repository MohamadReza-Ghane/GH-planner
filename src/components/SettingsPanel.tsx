
"use client";
import { useUser } from '@/supabase';
import { supabase } from '@/lib/supabase';

import React from 'react';
import { 
  Languages, 
  ShieldCheck,
  LogOut, 
  Palette,
  Monitor,
  Calendar as CalendarIcon,
  Check,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings, type ThemeColor, type CalendarSystem } from '@/hooks/use-settings';


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { lang, mode, calendarSystem, themeColor, updateLang, updateMode, updateCalendar, updateThemeColor } = useSettings();
  const { user } = useUser();
  
  const handleLogout = () => {
    if (auth) supabase.auth.signOut();
  };

  const themes: { id: ThemeColor; color: string; label: string }[] = [
    { id: 'default', color: '#a78bfa', label: 'Default' },
    { id: 'cyberpunk', color: '#ff00ff', label: 'Cyber' },
    { id: 'ocean', color: '#3b82f6', label: 'Ocean' },
    { id: 'forest', color: '#22c55e', label: 'Forest' },
    { id: 'sunset', color: '#f97316', label: 'Sunset' },
    { id: 'lava', color: '#ef4444', label: 'Lava' },
    { id: 'emerald', color: '#10b981', label: 'Emerald' },
    { id: 'galaxy', color: '#8b5cf6', label: 'Galaxy' },
    { id: 'gold', color: '#eab308', label: 'Gold' },
    { id: 'coffee', color: '#8b4513', label: 'Coffee' },
    { id: 'tokyo', color: '#bb9af7', label: 'Tokyo' },
    { id: 'dracula', color: '#ff79c6', label: 'Dracula' },
    { id: 'nord', color: '#88c0d0', label: 'Nord' },
    { id: 'aurora', color: '#50fa7b', label: 'Aurora' },
    { id: 'rose', color: '#f472b6', label: 'Rose' },
    { id: 'mint', color: '#2dd4bf', label: 'Mint' },
    { id: 'midnight', color: '#6366f1', label: 'Midnight' },
    { id: 'neon', color: '#00ff00', label: 'Neon' },
    { id: 'slate', color: '#64748b', label: 'Slate' },
    { id: 'minimal', color: '#ffffff', label: 'Minimal' },
  ];

  const calendars: { id: CalendarSystem; label: string }[] = [
    { id: 'jalali', label: 'شمسی (Jalali)' },
    { id: 'gregorian', label: 'میلادی (Gregorian)' },
    { id: 'islamic', label: 'قمری (Islamic)' },
    { id: 'hebrew', label: 'عبری (Hebrew)' },
  ];

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500 font-body" dir="rtl">
      {/* Profile Header */}
      <div className="glass p-6 rounded-[32px] border-primary/20 bg-primary/5 relative overflow-hidden group">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full" />
        <div className="flex items-center gap-6 relative z-10 flex-row-reverse">
          <Avatar className="w-20 h-20 border-2 border-primary/30 rounded-3xl shadow-2xl">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="bg-primary/20 text-primary text-2xl font-black">
              {user?.email?.charAt(0).toUpperCase() || 'GH'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-right">
            <h3 className="font-black text-xl text-foreground mb-1">{user?.displayName || 'رئیس GH'}</h3>
            <Badge className="bg-primary/20 text-primary border-none text-[9px] font-black uppercase">عضویت ویژه GH ULTRA</Badge>
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80 px-2 flex items-center gap-2 justify-end">
          ۲۰ تم رنگی فوق‌پیشرفته
          <Palette className="w-3.5 h-3.5" />
        </h4>
        <div className="glass p-4 rounded-[32px] grid grid-cols-5 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => updateThemeColor(t.id)}
              className={cn(
                "w-full aspect-square rounded-2xl flex items-center justify-center transition-all hover:scale-110 relative",
                themeColor === t.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
              )}
              style={{ backgroundColor: t.color }}
              title={t.label}
            >
              {themeColor === t.id && <Check className="w-4 h-4 text-white drop-shadow-lg" />}
            </button>
          ))}
        </div>
      </section>

      {/* Calendar Systems */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80 px-2 flex items-center gap-2 justify-end">
          سیستم گاه‌شماری فعال
          <CalendarIcon className="w-3.5 h-3.5" />
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {calendars.map((cal) => (
            <button
              key={cal.id}
              onClick={() => updateCalendar(cal.id)}
              className={cn(
                "glass p-4 rounded-2xl text-[11px] font-black transition-all text-center border-white/5",
                calendarSystem === cal.id ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:bg-white/5"
              )}
            >
              {cal.label}
            </button>
          ))}
        </div>
      </section>

      {/* Other Settings */}
      <section className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-primary opacity-80 px-2 flex items-center gap-2 justify-end">
          تنظیمات عمومی
          <Monitor className="w-3.5 h-3.5" />
        </h4>
        <div className="glass rounded-[32px] overflow-hidden divide-y divide-white/5">
           <SettingItem 
              icon={Languages} 
              label="زبان رابط کاربری" 
              sub="فارسی / English" 
              action={
                <div className="flex bg-black/40 p-1 rounded-xl">
                  <button onClick={() => updateLang('fa')} className={cn("px-3 py-1 rounded-lg text-[10px] font-black", lang === 'fa' ? "bg-primary" : "text-muted-foreground")}>FA</button>
                  <button onClick={() => updateLang('en')} className={cn("px-3 py-1 rounded-lg text-[10px] font-black", lang === 'en' ? "bg-primary" : "text-muted-foreground")}>EN</button>
                </div>
              }
           />
           <SettingItem 
              icon={ShieldCheck} 
              label="امنیت ابری GH" 
              sub="همگام‌سازی خودکار داده‌ها" 
              action={<Badge className="bg-emerald-500/20 text-emerald-500">فعال</Badge>}
           />
        </div>
      </section>

      <Button 
        variant="destructive" 
        className="w-full h-16 rounded-[24px] font-black gap-3 shadow-2xl shadow-destructive/20 bg-gradient-to-br from-red-600 to-red-500 border-none"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5" />
        خروج از حساب کاربری
      </Button>

      <div className="p-10 text-center opacity-40">
        <p className="text-[9px] font-black tracking-[0.4em] uppercase">Powered by GH Intelligence OS</p>
        <p className="text-[8px] font-black tracking-[0.2em] uppercase mt-2">Version 6.0.0 ULTRA CUSTOM</p>
      </div>
    </div>
  );
}

function SettingItem({ icon: Icon, label, sub, action }: any) {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-all cursor-pointer group">
      <div className="flex-1 text-right mr-4">
        <h3 className="font-black text-sm group-hover:text-primary transition-colors">{label}</h3>
        <p className="text-[9px] text-muted-foreground font-bold mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-4 flex-row-reverse">
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors border border-white/5">
          <Icon className="w-5 h-5" />
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}

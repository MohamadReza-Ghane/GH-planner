"use client";

import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Trash2, 
  Zap, 
  Moon, 
  AlarmClock,
  Plus,
  CalendarCheck
} from 'lucide-react';
import { getMsUntilTehranMidnight, getTehranNow } from '@/lib/tehran-time';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Reminder = {
  id: string;
  label: string;
  time: string;
  emoji: string;
  active: boolean;
};

/**
 * کامپوننت ساعت عقربه‌ای هوشمند
 */
function AnalogClock({ time }: { time: Date }) {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // محاسبات زاویه عقربه‌ها
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="relative w-36 h-36 rounded-full border-2 border-primary/20 bg-black/40 flex items-center justify-center shadow-2xl backdrop-blur-xl group overflow-hidden">
      {/* افکت نوری داخلی */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-50" />
      
      {/* عقربه ساعت */}
      <div 
        className="absolute w-1.5 h-10 bg-primary/90 rounded-full origin-bottom bottom-1/2 transition-transform duration-1000 ease-out"
        style={{ transform: `rotate(${hourDeg}deg)` }}
      />
      {/* عقربه دقیقه */}
      <div 
        className="absolute w-1 h-14 bg-secondary/80 rounded-full origin-bottom bottom-1/2 transition-transform duration-700 ease-out"
        style={{ transform: `rotate(${minuteDeg}deg)` }}
      />
      {/* عقربه ثانیه */}
      <div 
        className="absolute w-0.5 h-16 bg-destructive rounded-full origin-bottom bottom-1/2 transition-transform duration-100 ease-linear"
        style={{ transform: `rotate(${secondDeg}deg)` }}
      />
      
      {/* نقطه مرکزی */}
      <div className="absolute w-2.5 h-2.5 rounded-full bg-white z-20 shadow-lg" />
      
      {/* نشانگرهای ساعت */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className={cn(
            "absolute w-0.5 h-2 rounded-full",
            i % 3 === 0 ? "bg-primary/60 h-3" : "bg-white/10"
          )}
          style={{ 
            transform: `rotate(${i * 30}deg) translateY(-60px)` 
          }}
        />
      ))}
    </div>
  );
}

export function SchedulerPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', label: 'شروع روز و قهوه', time: '08:30', emoji: '☕', active: true },
    { id: '2', label: 'جلسه بازبینی روزانه', time: '14:00', emoji: '📅', active: false },
    { id: '3', label: 'ورزش و تندرستی', time: '18:00', emoji: '🏃', active: true },
  ]);
  
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [timeParts, setTimeParts] = useState({ hours: '00', minutes: '00', seconds: '00' });
  const [tehranNow, setTehranNow] = useState<Date>(getTehranNow());

  useEffect(() => {
    const updateTimer = () => {
      const now = getTehranNow();
      setTehranNow(now);
      
      const ms = getMsUntilTehranMidnight();
      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);
      
      setTimeParts({
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const addReminder = () => {
    if (!newLabel) return;
    setReminders(prev => [...prev, {
      id: Math.random().toString(),
      label: newLabel,
      time: newTime,
      emoji: '🔔',
      active: true
    }]);
    setNewLabel('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-body">
      <div className="glass-card p-6 flex flex-col items-center text-center space-y-6 relative overflow-hidden border-white/10 bg-card/40">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        
        {/* ساعت عقربه‌ای */}
        <AnalogClock time={tehranNow} />
        
        <div className="w-full space-y-2">
          <h2 className="text-[11px] text-muted-foreground font-bold tracking-wider uppercase opacity-80">زمان باقی‌مانده از ماموریت امروز</h2>
          
          {/* نمایش ساعت دیجیتال */}
          <div className="flex items-center justify-center gap-3 text-foreground font-black tabular-nums" dir="ltr">
            <div className="flex flex-col items-center">
              <div className="bg-black/40 border border-white/5 rounded-2xl px-3 py-2 text-3xl shadow-xl min-w-[3.5rem] drop-shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                {timeParts.hours}
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 font-bold">HOURS</span>
            </div>
            <span className="text-2xl text-primary animate-pulse mb-4">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-black/40 border border-white/5 rounded-2xl px-3 py-2 text-3xl shadow-xl min-w-[3.5rem] drop-shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                {timeParts.minutes}
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 font-bold">MINS</span>
            </div>
            <span className="text-2xl text-primary animate-pulse mb-4">:</span>
            <div className="flex flex-col items-center">
              <div className="bg-primary/20 border border-primary/30 rounded-2xl px-3 py-2 text-3xl shadow-2xl min-w-[3.5rem] text-primary drop-shadow-[0_0_20px_rgba(167,139,250,0.4)]">
                {timeParts.seconds}
              </div>
              <span className="text-[9px] text-primary mt-1 font-black">SECS</span>
            </div>
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/10 font-bold px-4 py-2 rounded-full backdrop-blur-md">
          <CalendarCheck className="w-3.5 h-3.5 ml-1.5 text-primary" />
          ذخیره‌سازی هوشمند در نیمه‌شب
        </Badge>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-lg flex items-center gap-2 text-foreground tracking-tight">
            <AlarmClock className="w-5 h-5 text-primary" />
            یادآورهای روزانه
          </h3>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {reminders.length} زنگ ساعت
          </span>
        </div>

        <div className="space-y-4">
          {reminders.map(rem => (
            <div 
              key={rem.id} 
              className={cn(
                "glass-card p-4 flex items-center gap-4 transition-all duration-300 border-white/5 relative overflow-hidden",
                rem.active 
                  ? "bg-primary/[0.04] border-primary/20 scale-[1.01] shadow-[0_8px_32px_rgba(167,139,250,0.08)]" 
                  : "opacity-60 grayscale-[0.3]"
              )}
            >
              <div className="flex-1 min-w-0 text-right">
                <p className={cn(
                  "font-bold text-sm truncate leading-tight",
                  rem.active ? "text-foreground" : "text-muted-foreground"
                )}>{rem.label}</p>
                <span className="text-[11px] font-black opacity-60 block mt-1.5 text-primary" dir="ltr">{rem.time}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* دکمه فعال‌سازی با استایل بلوک‌های ساعت */}
                <button
                  onClick={() => toggleReminder(rem.id)}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border",
                    rem.active 
                      ? "bg-primary/20 border-primary/40 text-primary shadow-2xl drop-shadow-[0_0_10px_rgba(167,139,250,0.4)]" 
                      : "bg-black/40 border-white/5 text-muted-foreground shadow-xl"
                  )}
                >
                  {rem.active ? (
                    <Zap className="w-4 h-4 fill-current animate-pulse mb-0.5" />
                  ) : (
                    <Moon className="w-4 h-4 mb-0.5" />
                  )}
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-tighter",
                    rem.active ? "text-primary" : "text-muted-foreground/50"
                  )}>
                    {rem.active ? 'On' : 'Off'}
                  </span>
                </button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteReminder(rem.id)} 
                  className="h-10 w-10 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-4 space-y-4 border-white/10 bg-white/[0.02]">
          <div className="flex gap-3">
            <Input 
              placeholder="عنوان یادآور جدید..." 
              className="bg-black/20 border-white/10 text-foreground h-11 rounded-xl focus:ring-primary text-sm font-body text-right"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
            />
            <Input 
              type="time" 
              className="w-24 bg-black/20 border-white/10 text-foreground h-11 rounded-xl focus:ring-primary text-sm font-bold text-center"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
            />
            <Button 
              size="icon" 
              onClick={addReminder} 
              className="shrink-0 h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 shadow-md"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

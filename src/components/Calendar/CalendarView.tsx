
"use client";

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { SchedulerPanel } from '@/components/SchedulerPanel';
import { Clock, Zap, Calendar as CalendarIcon, Globe, Flame, Star, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/use-settings';
import { useProgress } from '@/hooks/use-progress';
import { useUser } from '@/supabase';
import { useTasks } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';

export function CalendarView({ tasks }: any) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { calendarSystem } = useSettings();
  const { user } = useUser();
  
  const { history } = useProgress(user?.uid || null, tasks);

  const getLocale = () => {
    switch (calendarSystem) {
      case 'jalali': return 'fa-IR-u-ca-persian';
      case 'islamic': return 'ar-SA-u-ca-islamic-uma';
      case 'hebrew': return 'he-IL-u-ca-hebrew';
      default: return 'en-US';
    }
  };

  const formatHeaderDate = (d: Date | undefined) => {
    if (!d) return '';
    return new Intl.DateTimeFormat(getLocale(), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(d);
  };

  const dayStatusMap = useMemo(() => {
    const map: Record<string, 'excellent' | 'good' | 'poor' | 'none'> = {};
    if (!history) return map;
    history.forEach(day => {
      if (day.pct >= 85) map[day.dateKey] = 'excellent';
      else if (day.pct >= 50) map[day.dateKey] = 'good';
      else if (day.pct > 0) map[day.dateKey] = 'poor';
    });
    return map;
  }, [history]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-right pb-32" dir="rtl">
      <header className="flex items-center justify-between flex-row-reverse">
        <div className="text-right">
          <h1 className="text-2xl font-black tracking-tighter uppercase">خط <span className="text-primary">زمانی GH</span></h1>
          <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] mt-1">آنالیز عملکرد روزانه • تایم بلاکینگ</p>
        </div>
        
        <Badge className="glass text-primary border-none px-4 py-2 rounded-2xl flex items-center gap-2">
           <Globe className="w-3 h-3" />
           <span className="text-[10px] font-black uppercase">{calendarSystem} system</span>
        </Badge>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-[40px] border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="flex items-center justify-between mb-6 flex-row-reverse">
               <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-black">{formatHeaderDate(selectedDate)}</span>
               </div>
               <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_orange]" title="Excellent" />
                 <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" title="Good" />
                 <div className="w-2 h-2 rounded-full bg-muted" title="No Activity" />
               </div>
            </div>

            <CalendarUI
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border-none flex justify-center"
              locale={getLocale()}
              components={{
                Day: ({ date, displayMonth, ...dayProps }: any) => {
                  // رفع خطای getFullYear با بررسی وجود date
                  if (!date) return null;
                  
                  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  const status = dayStatusMap[dateKey];
                  
                  return (
                    <div className="relative flex flex-col items-center">
                      <button {...dayProps} className={cn(dayProps.className, "relative")}>
                        {date.getDate()}
                      </button>
                      {status === 'excellent' && <Flame className="w-2.5 h-2.5 text-orange-500 absolute -bottom-1" />}
                      {status === 'good' && <Zap className="w-2.5 h-2.5 text-primary absolute -bottom-1" />}
                      {status === 'poor' && <AlertCircle className="w-2.5 h-2.5 text-muted-foreground absolute -bottom-1" />}
                    </div>
                  );
                }
              }}
            />
          </div>
          
          <div className="glass p-6 rounded-[32px] space-y-4 border-white/5 bg-white/[0.02]">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2 justify-end">
              خلاصه وضعیت عملکرد
              <Star className="w-4 h-4" />
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-[10px] font-black">عالی</p>
                <p className="text-xs font-bold">{Object.values(dayStatusMap).filter(v => v === 'excellent').length} روز</p>
              </div>
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Zap className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-[10px] font-black">خوب</p>
                <p className="text-xs font-bold">{Object.values(dayStatusMap).filter(v => v === 'good').length} روز</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                <Clock className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                <p className="text-[10px] font-black">سایر</p>
                <p className="text-xs font-bold">{Object.values(dayStatusMap).filter(v => v === 'poor').length} روز</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SchedulerPanel />
        </div>
      </div>
    </div>
  );
}


"use client";

import React from 'react';
import { 
  Zap, 
  Flame, 
  Brain, 
  Timer, 
  Sparkles,
  Target,
  Crown,
  Activity,
  Heart,
  TrendingUp,
  Award,
  Clock,
  ShieldCheck,
  Telescope,
  ArrowRight
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function DashboardHub({ stats, tasks, trackerData }: any) {
  const { xp, level, productivityScore, focusScore, lifeScore = 85 } = stats;
  
  // شبیه‌سازی آینده توسط موتور هوشمند
  const simulation = {
    outcome: "در صورت تداوم، تا ۴۵ روز دیگر مأموریت استراتژیک شما به اتمام می‌رسد.",
    probability: 92,
    status: "بهینه‌شده"
  };

  const topMissions = tasks.filter((t: any) => !t.completed).slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20" dir="rtl">
      {/* OS Header */}
      <header className="flex items-center justify-between">
        <div className="text-right">
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            هسته مرکزی <span className="text-primary">GH BRAIN</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground tracking-[0.3em] mt-2 flex items-center gap-2 justify-end">
            <Sparkles className="w-3 h-3 text-primary" />
            سیستم پیش‌بین فعال • نسخه ۶.۰ REVOLUTION
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
             <span className="text-[9px] font-black text-muted-foreground uppercase">امتیاز توازن زندگی</span>
             <span className="text-lg font-black text-emerald-400">{lifeScore}٪</span>
           </div>
           <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-primary/20 shadow-xl shadow-primary/10">
             <Target className="w-6 h-6 text-primary" />
           </div>
        </div>
      </header>

      {/* Daily Briefing vs Strategic Missions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Daily Schedule Preview */}
        <div className="glass p-6 rounded-[40px] border-primary/20 bg-primary/5 space-y-6 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
          
          <div className="flex items-start justify-between relative z-10 flex-row-reverse">
            <Badge className="bg-primary/20 text-primary border-none px-3 py-1 text-[10px] font-black uppercase flex items-center gap-2">
              <Clock className="w-3 h-3" />
              برنامه زمانی امروز
            </Badge>
            <h2 className="text-lg font-black tracking-tight text-right">Briefing</h2>
          </div>

          <div className="space-y-3 relative z-10">
             <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 flex-row-reverse">
                <span className="text-[10px] font-black">۰۹:۳۰</span>
                <span className="text-xs font-bold">شروع کار عمیق</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             </div>
             <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 opacity-60 flex-row-reverse">
                <span className="text-[10px] font-black">۱۲:۰۰</span>
                <span className="text-xs font-bold">تایم استراحت</span>
                <div className="w-2 h-2 rounded-full bg-muted" />
             </div>
          </div>
          
          <button className="w-full py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase hover:bg-primary/20 transition-all flex items-center justify-center gap-2 relative z-10">
            مشاهده کل زمان‌بندی <ArrowRight className="w-3 h-3 rotate-180" />
          </button>
        </div>

        {/* Strategic Missions Preview */}
        <div className="glass p-6 rounded-[40px] border-secondary/20 bg-secondary/5 space-y-6 relative overflow-hidden group">
           <div className="flex items-start justify-between relative z-10 flex-row-reverse">
            <Badge className="bg-secondary/20 text-secondary border-none px-3 py-1 text-[10px] font-black uppercase flex items-center gap-2">
              <Target className="w-3 h-3" />
              مأموریت‌های فعال
            </Badge>
            <h2 className="text-lg font-black tracking-tight text-right">Missions</h2>
          </div>

          <div className="space-y-3 relative z-10">
             {topMissions.map((mission: any) => (
                <div key={mission.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 flex-row-reverse">
                   <div className="flex items-center gap-2">
                      {[...Array(mission.stars)].map((_, i) => (
                         <Flame key={i} className="w-3 h-3 text-orange-400 fill-orange-400" />
                      ))}
                   </div>
                   <span className="text-xs font-bold truncate max-w-[120px]">{mission.name}</span>
                </div>
             ))}
             {topMissions.length === 0 && (
                <p className="text-center text-[10px] text-muted-foreground py-4">مأموریت فعالی ثبت نشده است</p>
             )}
          </div>

          <button className="w-full py-2 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 relative z-10">
            مدیریت اهداف استراتژیک <ArrowRight className="w-3 h-3 rotate-180" />
          </button>
        </div>
      </div>

      {/* Gamification Progress */}
      <div className="widget-grid">
        <div className="glass p-6 rounded-[32px] md:col-span-2 relative overflow-hidden group">
          <div className="flex items-center gap-6 flex-row-reverse">
            <div className="relative">
              <div className="w-20 h-20 rounded-[24px] premium-gradient flex items-center justify-center shadow-2xl shadow-primary/40 rotate-3 group-hover:rotate-0 transition-transform">
                <span className="text-3xl font-black text-white">{level}</span>
              </div>
              <Crown className="w-6 h-6 text-orange-400 absolute -top-2 -right-2 drop-shadow-lg" />
            </div>
            <div className="flex-1 space-y-3 text-right">
              <div className="flex items-center justify-between flex-row-reverse">
                <h2 className="text-xs font-black tracking-widest text-foreground/80 uppercase">مسیر افسانه‌ای GH</h2>
                <span className="text-[10px] font-black text-primary">LVL {level} ← {level+1}</span>
              </div>
              <Progress value={(xp % 1000) / 10} className="h-2.5 bg-white/5" />
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground flex-row-reverse">
                <span>{xp % 1000} / ۱۰۰۰ XP</span>
                <div className="flex items-center gap-1 text-orange-500">
                  <span>۱۲ روز تداوم (Streak)</span>
                  <Flame className="w-3 h-3 fill-orange-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <WidgetCard icon={Brain} label="تمرکز عصبی" value={`${focusScore}%`} color="text-secondary" />
        <WidgetCard icon={Timer} label="کار عمیق" value="۵.۴ ساعت" color="text-primary" />
        <WidgetCard icon={Activity} label="پویایی" value="۸۸٪" color="text-blue-400" />
        <WidgetCard icon={TrendingUp} label="رشد هفتگی" value="+۱۲٪" color="text-emerald-400" />
      </div>

      {/* AI Life Simulation Widget */}
      <div className="glass p-6 rounded-[40px] border-primary/20 bg-primary/5 space-y-6 relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-[120px] rounded-full" />
        
        <div className="flex items-start justify-between relative z-10 flex-row-reverse">
          <Badge className="bg-primary/20 text-primary border-none px-3 py-1 text-[10px] font-black uppercase flex items-center gap-2">
            <Telescope className="w-3 h-3" />
            شبیه‌ساز آینده
          </Badge>
          <div className="space-y-1 text-right">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 justify-end">
               <span className="text-primary">GH</span> Life Simulator
               <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h2>
            <p className="text-xs font-bold text-muted-foreground">تحلیل الگوهای تکرارشونده شما در ۳۰ روز اخیر</p>
          </div>
        </div>

        <div className="bg-black/20 p-5 rounded-[32px] border border-white/5 relative z-10">
           <p className="text-sm font-bold text-foreground/90 leading-relaxed text-right">
             "{simulation.outcome}"
           </p>
           <div className="flex items-center justify-between mt-4 flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-[10px] font-black text-muted-foreground uppercase">احتمال موفقیت:</span>
                <span className="text-sm font-black text-emerald-400">{simulation.probability}%</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-black border-emerald-500/30 text-emerald-500">بدون ریسک</Badge>
           </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="glass p-4 rounded-[24px] space-y-3 flex flex-col items-center text-center group hover:scale-105 transition-all border-white/5">
      <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", color, "bg-white/5")}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-1">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-lg font-black">{value}</p>
      </div>
    </div>
  );
}

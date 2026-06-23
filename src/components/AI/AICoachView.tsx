
"use client";

import React, { useState } from 'react';
import { AIChat } from '@/components/AIChat';
import { Sparkles, Brain, Zap, Activity, Telescope, ShieldCheck, History, Milestone, Video, Eye, Mic2, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function AICoachView({ tasks, stats, trackerData }: any) {
  const [mode, setMode] = useState<'chat' | 'simulate' | 'decision'>('chat');

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32 text-right" dir="rtl">
      {/* Premium AI Header */}
      <div className="glass p-6 rounded-[32px] border-primary/20 bg-primary/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 flex-row-reverse">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full" />
        <div className="flex items-center gap-4 relative z-10 flex-row-reverse">
          <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center shadow-2xl shadow-primary/40 animate-pulse">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black tracking-tight uppercase">GH <span className="text-primary">Life Strategist</span></h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Neural Link: ACTIVE • V6.0</p>
          </div>
        </div>
        
        <div className="flex gap-2 relative z-10 flex-row-reverse">
           <Badge className="bg-primary/20 text-primary border-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl">
             <Activity className="w-3 h-3" />
             <span className="text-[10px] font-black uppercase">تحلیل آنی</span>
           </Badge>
           <Badge className="bg-emerald-400/20 text-emerald-500 border-none flex items-center gap-1.5 px-3 py-1.5 rounded-xl">
             <ShieldCheck className="w-3 h-3" />
             <span className="text-[10px] font-black uppercase">محافظت از هدف</span>
           </Badge>
        </div>
      </div>

      {/* Strategist Modes */}
      <Tabs defaultValue="chat" className="w-full" onValueChange={(v: any) => setMode(v)}>
        <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-6 rounded-2xl h-14 p-1">
          <TabsTrigger value="chat" className="rounded-xl font-black flex items-center gap-2 text-xs">
            <Zap className="w-3.5 h-3.5" />
            گفتگو
          </TabsTrigger>
          <TabsTrigger value="simulate" className="rounded-xl font-black flex items-center gap-2 text-xs">
            <Telescope className="w-3.5 h-3.5" />
            شبیه‌سازی
          </TabsTrigger>
          <TabsTrigger value="decision" className="rounded-xl font-black flex items-center gap-2 text-xs">
            <Milestone className="w-3.5 h-3.5" />
            دستیار تصمیم
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-0">
          <AIChat tasks={tasks} history={trackerData} lang="fa" />
        </TabsContent>
        
        <TabsContent value="simulate" className="mt-0">
          <div className="glass p-8 rounded-[40px] border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Telescope className="w-10 h-10 text-primary animate-float" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black uppercase">موتور شبیه‌ساز زندگی GH</h3>
                <p className="text-sm text-muted-foreground font-bold leading-relaxed max-w-md">
                  من با تحلیل ۱۰۰۰ پارامتر از تاریخچه شما، نتایج تصمیمات فعلی‌تان را در ۱ ماه، ۶ ماه و ۱ سال آینده پیش‌بینی می‌کنم.
                </p>
             </div>
             <AIChat tasks={tasks} history={trackerData} lang="fa" mode="simulate" />
          </div>
        </TabsContent>

        <TabsContent value="decision" className="mt-0">
           <div className="glass p-8 rounded-[40px] border-primary/10 bg-black/20 space-y-6">
              <div className="flex items-center gap-4 flex-row-reverse">
                 <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary">
                    <Milestone className="w-6 h-6" />
                 </div>
                 <div className="text-right">
                    <h4 className="text-lg font-black">دستیار تصمیم‌گیری استراتژیک</h4>
                    <p className="text-xs text-muted-foreground font-bold">بر اساس داده‌های موفقیت قبلی شما، بهترین گزینه را پیشنهاد می‌دهم.</p>
                 </div>
              </div>
              <AIChat tasks={tasks} history={trackerData} lang="fa" mode="decision" />
           </div>
        </TabsContent>
      </Tabs>
      
      {/* Roadmap & Future Tech Section */}
      <div className="space-y-4">
         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-2 justify-end px-2">
            آزمایشگاه آینده GH Intelligence
            <Rocket className="w-3 h-3" />
         </h3>
         
         <div className="grid gap-3">
            {/* Time Machine Card */}
            <div className="glass p-5 rounded-[28px] border-white/5 bg-white/[0.02] flex items-center justify-between flex-row-reverse group cursor-pointer hover:bg-white/5 transition-all">
               <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                     <History className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="text-right">
                     <h4 className="text-sm font-black text-foreground">ماشین زمان GH</h4>
                     <p className="text-[10px] font-bold text-muted-foreground">مقایسه عملکرد امروز با بهترین روز ماه گذشته</p>
                  </div>
               </div>
               <Badge className="bg-white/5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">Coming Soon</Badge>
            </div>

            {/* Veo Cinematic Card */}
            <div className="glass p-5 rounded-[28px] border-white/5 bg-white/[0.02] flex items-center justify-between flex-row-reverse group cursor-pointer hover:bg-white/5 transition-all">
               <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-orange-500/10 transition-colors">
                     <Video className="w-5 h-5 text-muted-foreground group-hover:text-orange-500" />
                  </div>
                  <div className="text-right">
                     <h4 className="text-sm font-black text-foreground">سینمای موفقیت (Veo)</h4>
                     <p className="text-[10px] font-bold text-muted-foreground">تولید ویدیوی هوشمند از مسیر رسیدن به اهداف شما</p>
                  </div>
               </div>
               <Badge className="bg-orange-500/10 text-[9px] font-black uppercase tracking-wider text-orange-500">Coming Soon</Badge>
            </div>

            {/* AI Vision Card */}
            <div className="glass p-5 rounded-[28px] border-white/5 bg-white/[0.02] flex items-center justify-between flex-row-reverse group cursor-pointer hover:bg-white/5 transition-all">
               <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                     <Eye className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500" />
                  </div>
                  <div className="text-right">
                     <h4 className="text-sm font-black text-foreground">بینایی استراتژیک (AI Vision)</h4>
                     <p className="text-[10px] font-bold text-muted-foreground">استخراج مأموریت‌ها از تصاویر و یادداشت‌های فیزیکی</p>
                  </div>
               </div>
               <Badge className="bg-emerald-500/10 text-[9px] font-black uppercase tracking-wider text-emerald-500">Coming Soon</Badge>
            </div>

            {/* Voice Command Card */}
            <div className="glass p-5 rounded-[28px] border-white/5 bg-white/[0.02] flex items-center justify-between flex-row-reverse group cursor-pointer hover:bg-white/5 transition-all">
               <div className="flex items-center gap-4 flex-row-reverse">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                     <Mic2 className="w-5 h-5 text-muted-foreground group-hover:text-blue-500" />
                  </div>
                  <div className="text-right">
                     <h4 className="text-sm font-black text-foreground">فرمانده صوتی (Voice)</h4>
                     <p className="text-[10px] font-bold text-muted-foreground">مدیریت کل سیستم با دستورات صوتی پیشرفته</p>
                  </div>
               </div>
               <Badge className="bg-blue-500/10 text-[9px] font-black uppercase tracking-wider text-blue-500">Coming Soon</Badge>
            </div>
         </div>
      </div>
    </div>
  );
}


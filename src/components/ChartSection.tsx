"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TrendingUp, Award, CalendarDays, Grid3X3, Zap } from 'lucide-react';
import type { DailyProgress } from '@/hooks/use-progress';
import { cn } from '@/lib/utils';

export function ChartSection({ history }: { history: DailyProgress[] }) {
  // Sort history ascending for charts
  const chartData = [...history].reverse().map(d => ({
    name: d.dateKey.split('-').slice(1).join('/'),
    pct: d.pct,
    score: d.doneWeight
  }));

  // Activity Heatmap Data (Last 90 days grid)
  const heatmapData = history.slice(0, 90).reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a2e] border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-xs text-white/40 mb-1">{label}</p>
          <p className="text-sm font-bold text-primary">{payload[0].value}% پیشرفت</p>
        </div>
      );
    }
    return null;
  };

  const getHeatmapColor = (pct: number) => {
    if (pct === 0) return 'bg-white/5';
    if (pct < 30) return 'bg-primary/20';
    if (pct < 70) return 'bg-primary/50';
    if (pct < 100) return 'bg-primary/80';
    return 'bg-primary shadow-[0_0_8px_rgba(167,139,250,0.6)]';
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col items-center text-center space-y-1">
          <Award className="w-6 h-6 text-primary mb-1" />
          <span className="text-2xl font-black">{chartData.length}</span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">روز ثبت شده</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center text-center space-y-1">
          <TrendingUp className="w-6 h-6 text-secondary mb-1" />
          <span className="text-2xl font-black">
            {chartData.length > 0 ? Math.round(chartData.reduce((s, d) => s + d.pct, 0) / chartData.length) : 0}%
          </span>
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">میانگین کل</span>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
            <Grid3X3 className="w-3.5 h-3.5 text-primary" />
            GH ACTIVITY GRID
          </h4>
          <span className="text-[9px] text-muted-foreground font-black">۹۰ روز اخیر</span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {[...Array(90)].map((_, i) => {
            const day = heatmapData[i];
            const pct = day ? day.pct : 0;
            return (
              <div 
                key={i}
                className={cn(
                  "w-3.5 h-3.5 rounded-sm transition-all duration-500",
                  getHeatmapColor(pct)
                )}
                title={day ? `${day.dateKey}: ${day.pct}%` : 'No data'}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-white/5">
           <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
              <span className="text-[8px] font-black text-muted-foreground uppercase">Less</span>
           </div>
           <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-primary/20" />
              <div className="w-2.5 h-2.5 rounded-sm bg-primary/50" />
              <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
              <span className="text-[8px] font-black text-muted-foreground uppercase">More</span>
           </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-6 rounded-xl p-1">
            <TabsTrigger value="weekly" className="rounded-lg text-xs font-black">هفتگی</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-lg text-xs font-black">ماهانه</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="h-[250px] w-full mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.slice(-7)}>
                <defs>
                  <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="pct" stroke="#a78bfa" fillOpacity={1} fill="url(#colorPct)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[250px] w-full mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-30)}>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pct" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>

      <div className="glass-card p-5 flex items-start gap-4 border-primary/20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl -z-10" />
        <div className="p-3 rounded-2xl bg-primary/20 text-primary">
          <Zap className="w-6 h-6 fill-primary" />
        </div>
        <div className="flex-1 space-y-1 text-right">
          <h4 className="text-sm font-black text-foreground">تحلیل استراتژیک AI</h4>
          <p className="text-xs text-muted-foreground leading-relaxed font-bold">
            روند شما در ۷ روز گذشته صعودی بوده است. برای رسیدن به سطح بعدی (LVL {Math.floor(heatmapData.reduce((s,d)=>s+d.doneWeight*10,0)/500)+2})، تمرکز خود را بر وظایف ۳ ستاره در صبح‌ها حفظ کنید.
          </p>
        </div>
      </div>
    </div>
  );
}

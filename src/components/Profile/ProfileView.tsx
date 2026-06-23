
"use client";

import React from 'react';
import { SettingsPanel } from '@/components/SettingsPanel';
import { ChartSection } from '@/components/ChartSection';
import { UserCircle, BarChart3, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function ProfileView({ stats, xpProgress }: any) {
  // شبیه‌سازی تاریخچه برای نمودارها
  const history = [
    { dateKey: '2024-03-20', pct: 85, doneWeight: 20, totalWeight: 24, checkedIds: [] },
    { dateKey: '2024-03-21', pct: 70, doneWeight: 15, totalWeight: 24, checkedIds: [] },
    { dateKey: '2024-03-22', pct: 95, doneWeight: 22, totalWeight: 24, checkedIds: [] },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-2xl font-black tracking-tighter uppercase">USER <span className="text-primary">PROFILE</span></h1>
        <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] mt-1">PERSONAL STATS • PREFERENCES</p>
      </header>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-8 rounded-2xl h-14 p-1">
          <TabsTrigger value="stats" className="rounded-xl font-black flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            ANALYTICS
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl font-black flex items-center gap-2">
            <Settings className="w-4 h-4" />
            SETTINGS
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <ChartSection history={history} />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

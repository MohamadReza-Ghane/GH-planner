
"use client";

import React from 'react';
import { 
  Home, 
  Calendar, 
  LayoutGrid, 
  FileText, 
  Activity, 
  UserCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'home' | 'calendar' | 'planner' | 'notes' | 'tracker' | 'profile';

export function BottomNav({ activeTab, onTabChange }: { activeTab: any, onTabChange: (tab: any) => void }) {
  const items = [
    { id: 'home', icon: Home, label: 'پیشخوان' },
    { id: 'calendar', icon: Calendar, label: 'زمان' },
    { id: 'planner', icon: LayoutGrid, label: 'برنامه' },
    { id: 'tracker', icon: Activity, label: 'پایش' },
    { id: 'notes', icon: FileText, label: 'یادداشت' },
    { id: 'profile', icon: UserCircle, label: 'پروفایل' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl h-16 glass rounded-[32px] flex items-center justify-around px-2 z-40 shadow-2xl border-white/5" dir="rtl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center w-12 h-full transition-all relative group",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-2 rounded-2xl transition-all duration-500",
              isActive ? "bg-primary/10 -translate-y-1" : "group-hover:bg-white/5"
            )}>
              <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
            </div>
            <span className={cn(
              "text-[9px] font-black tracking-widest mt-1 transition-opacity",
              isActive ? "opacity-100" : "opacity-0"
            )}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}

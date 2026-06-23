"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/supabase';
import { usePlannerAI } from '@/hooks/use-planner-ai';
import { AuthScreen } from '@/components/AuthScreen';
import { BottomNav } from '@/components/Navigation/BottomNav';
import { DashboardHub } from '@/components/Dashboard/DashboardHub';
import { PlannerView } from '@/components/Planner/PlannerView';
import { CalendarView } from '@/components/Calendar/CalendarView';
import { NotesHub } from '@/components/Notes/NotesHub';
import { AICoachView } from '@/components/AI/AICoachView';
import { ProfileView } from '@/components/Profile/ProfileView';
import { TrackerView } from '@/components/Tracker/TrackerView';
import { Sparkles } from 'lucide-react';

type Tab = 'home' | 'calendar' | 'planner' | 'notes' | 'ai' | 'profile' | 'tracker';

export default function PlannerAI() {
  const { user, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isClient, setIsClient] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  const { tasks, stats, trackerData, xpProgress } = usePlannerAI(user?.id || (guestMode ? 'guest' : null));

  useEffect(() => {
    setIsClient(true);
    const savedGuest = localStorage.getItem('pai-guest') === 'true';
    if (savedGuest) setGuestMode(true);
  }, []);

  if (authLoading || !isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-[32px] bg-primary/10 border-2 border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
            <span className="text-5xl font-black text-primary tracking-tighter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">GH</span>
          </div>
          <div className="absolute inset-0 border-2 border-primary/20 rounded-[32px] animate-ping opacity-20" />
          <div className="absolute -inset-6 border border-primary/10 rounded-[40px] animate-pulse" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] font-black tracking-[0.6em] text-primary/80 uppercase">Strategic OS Loading</p>
          <div className="w-40 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-primary w-1/2 animate-[loading_1.5s_ease-in-out_infinite] shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          </div>
        </div>
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>
    );
  }

  if (!user && !guestMode) {
    return <AuthScreen onGuestMode={() => {
      setGuestMode(true);
      localStorage.setItem('pai-guest', 'true');
    }} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-body overflow-x-hidden">
      <main className="pb-32 pt-8 px-4 max-w-5xl mx-auto animate-in fade-in duration-1000">
        {activeTab === 'home' && <DashboardHub stats={stats} tasks={tasks} trackerData={trackerData} />}
        {activeTab === 'planner' && <PlannerView tasks={tasks} onNavigateToCalendar={() => setActiveTab('calendar')} />}
        {activeTab === 'calendar' && <CalendarView tasks={tasks} />}
        {activeTab === 'notes' && <NotesHub />}
        {activeTab === 'tracker' && <TrackerView trackerData={trackerData} />}
        {activeTab === 'ai' && <AICoachView tasks={tasks} stats={stats} trackerData={trackerData} />}
        {activeTab === 'profile' && <ProfileView stats={stats} xpProgress={xpProgress} />}
      </main>

      {activeTab !== 'ai' && (
        <button
          onClick={() => setActiveTab('ai')}
          className="fixed bottom-28 right-6 w-14 h-14 rounded-full premium-gradient shadow-2xl shadow-primary/40 flex items-center justify-center text-white z-50 hover:scale-110 active:scale-90 transition-all animate-float"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

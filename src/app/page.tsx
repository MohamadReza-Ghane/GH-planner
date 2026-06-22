'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { useTasks } from '@/hooks/use-tasks';
import { useProgress } from '@/hooks/use-progress';
import { AuthScreen } from '@/components/AuthScreen';
import { ProgressRing } from '@/components/ProgressRing';
import { TaskList } from '@/components/TaskList';
import { HalfStarPicker } from '@/components/HalfStarPicker';
import { SchedulerPanel } from '@/components/SchedulerPanel';
import { ChartSection } from '@/components/ChartSection';
import { NotepadPanel } from '@/components/NotepadPanel';
import { SettingsPanel } from '@/components/SettingsPanel';
import { AIChat } from '@/components/AIChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ClipboardList, CalendarRange, BarChart3, Plus, LogOut, Loader2,
  CalendarDays, Sparkles, Settings, Flame, Zap, Trophy, PartyPopper,
  FileText, Cloud, CloudUpload, Bot
} from 'lucide-react';
import { formatPersianDate, getTodayKey } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Tab = 'planner' | 'timing' | 'analytics' | 'notes' | 'ai' | 'settings';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('planner');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskStars, setNewTaskStars] = useState(1);
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const l = localStorage.getItem('gh-lang') as 'fa' | 'en' || 'fa';
    setLang(l);
  }, []);

  const { tasks, loading: tasksLoading, addTask, updateTask, deleteTask } = useTasks(user?.uid || null);
  const { checkedIds, toggleTask, isSaving, history, streak } = useProgress(user?.uid || null, tasks);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    await addTask(newTaskName, newTaskStars);
    setNewTaskName(''); setNewTaskStars(1);
  };

  if (!mounted || authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (!user) return <AuthScreen />;

  const totalW = tasks.reduce((s, t) => s + t.stars, 0);
  const doneW = tasks.filter(t => checkedIds.includes(t.id)).reduce((s, t) => s + t.stars, 0);
  const pct = totalW > 0 ? Math.round((doneW / totalW) * 100) : 0;
  const isCompleted = pct === 100 && tasks.length > 0;
  const dateKey = getTodayKey();

  const navItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'planner', icon: <ClipboardList />, label: lang === 'fa' ? 'برنامه' : 'Planner' },
    { id: 'timing', icon: <CalendarRange />, label: lang === 'fa' ? 'زمان' : 'Timing' },
    { id: 'notes', icon: <FileText />, label: lang === 'fa' ? 'یادداشت' : 'Notes' },
    { id: 'ai', icon: <Bot />, label: 'AI' },
    { id: 'analytics', icon: <BarChart3 />, label: lang === 'fa' ? 'آمار' : 'Stats' },
    { id: 'settings', icon: <Settings />, label: lang === 'fa' ? 'تنظیمات' : 'Settings' },
  ];

  return (
    <div className="min-h-screen pb-28 max-w-[480px] mx-auto px-4 pt-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none uppercase">
              GH <span className="text-primary">Planner</span>
            </h1>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1 font-bold">
              {isSaving
                ? <span className="flex items-center gap-1 text-primary animate-pulse"><CloudUpload className="w-3 h-3" />ذخیره...</span>
                : <span className="flex items-center gap-1 text-green-500/70"><Cloud className="w-3 h-3" />ذخیره شد</span>
              }
              <span className="opacity-20">|</span>
              <CalendarDays className="w-3 h-3" />
              <span>{lang === 'fa' ? formatPersianDate(dateKey) : new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span className="text-xs font-black">{streak}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => { const { auth } = getFirebase(); signOut(auth); }}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="animate-up">
        {activeTab === 'planner' && (
          <div className="space-y-5">
            {/* Completed celebration */}
            {isCompleted ? (
              <div className="glass p-6 border border-primary/30 bg-primary/10 text-center space-y-3">
                <div className="flex justify-center gap-2 text-primary">
                  <PartyPopper className="w-8 h-8 animate-bounce" />
                  <Trophy className="w-8 h-8 animate-pulse" />
                  <PartyPopper className="w-8 h-8 animate-bounce" />
                </div>
                <h3 className="text-xl font-black">ماموریت امروز انجام شد!</h3>
                <p className="text-sm text-foreground/70">شما امروز ۱۰۰٪ وظایفتان را انجام دادید 🎉</p>
              </div>
            ) : (
              <div className="glass p-4 flex items-center gap-3 bg-secondary/5 border border-secondary/10">
                <div className="p-2 rounded-xl bg-secondary/20 text-secondary">
                  <Zap className="w-5 h-5 fill-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-secondary font-black uppercase tracking-wider mb-0.5">GH INSIGHT</p>
                  <p className="text-xs font-bold text-foreground/80">
                    {pct < 30 ? 'امروز را با کارهای ساده‌تر شروع کن!' : pct >= 70 ? 'عالی پیش می‌روی! ادامه بده 💪' : 'تمرکز روی وظایف پراهمیت‌تر را فراموش نکن.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center py-2">
              <ProgressRing progress={pct} />
            </div>

            {/* Add task */}
            <form onSubmit={handleAddTask} className="glass p-5 space-y-4">
              <Input
                placeholder={lang === 'fa' ? 'عنوان کار جدید...' : 'New task name...'}
                value={newTaskName} onChange={e => setNewTaskName(e.target.value)}
                className="h-12 text-base font-bold bg-background/30"
              />
              <div className="flex items-center justify-between">
                <HalfStarPicker value={newTaskStars} onChange={setNewTaskStars} />
                <Button type="submit" size="icon" className="w-12 h-12 rounded-2xl">
                  <Plus className="w-6 h-6" />
                </Button>
              </div>
            </form>

            {/* Task list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="font-black flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  {lang === 'fa' ? 'لیست وظایف' : 'Tasks'}
                </h2>
                <span className="text-[10px] text-muted-foreground font-black bg-white/5 px-3 py-1 rounded-full">
                  {tasks.length} {lang === 'fa' ? 'مورد' : 'items'}
                </span>
              </div>
              {tasksLoading
                ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                : <TaskList tasks={tasks} checkedIds={checkedIds} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />
              }
            </div>
          </div>
        )}

        {activeTab === 'timing' && <SchedulerPanel />}
        {activeTab === 'analytics' && <ChartSection history={history} />}
        {activeTab === 'notes' && <NotepadPanel />}
        {activeTab === 'ai' && <AIChat tasks={tasks} lang={lang} />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[448px] h-16 glass flex items-center justify-around px-1 z-50 bg-card/80 shadow-2xl">
        {navItems.map(({ id, icon, label }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              className={cn('flex flex-col items-center justify-center w-14 h-full transition-all duration-200 relative',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground')}>
              <div className={cn('transition-transform duration-300', active ? '-translate-y-1 scale-110' : '')}>
                {icon}
              </div>
              <span className="text-[8px] mt-1 font-black uppercase">{label}</span>
              {active && <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(167,139,250,0.8)]" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

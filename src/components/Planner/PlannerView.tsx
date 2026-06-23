
"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Target, 
  CalendarDays, 
  Pencil, 
  CheckCircle2, 
  Trash2,
  Calendar as CalendarIcon,
  X,
  Zap,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/supabase';
import { useDailyPlanner } from '@/hooks/use-daily-planner';
import { useGoals } from '@/hooks/use-goals';
import { getTehranDateKey, formatPersianDate } from '@/lib/tehran-time';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ViewMode = 'today' | 'planning';

export function PlannerView({ onNavigateToCalendar }: any) {
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [planningDate, setPlanningDate] = useState<Date>(new Date());
  
  // Handle Guest Mode UID
  const [guestMode, setGuestMode] = useState(false);
  useEffect(() => {
    setGuestMode(localStorage.getItem('pai-guest') === 'true');
  }, []);

  const uid = user?.uid || (guestMode ? 'guest' : null);

  // امروز
  const todayKey = getTehranDateKey();
  const todayPlanner = useDailyPlanner(uid, todayKey);
  
  // تاریخ برنامه‌ریزی
  const selectedPlanningKey = getTehranDateKey(planningDate);
  const planningPlanner = useDailyPlanner(uid, selectedPlanningKey);
  
  const { goals, addGoal, deleteGoal } = useGoals(uid);

  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [weight, setWeight] = useState('1');
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const handleAddTask = () => {
    if (newTask.trim()) {
      planningPlanner.addTask(newTask, priority, parseFloat(weight) || 1);
      setNewTask('');
      setWeight('1');
    }
  };

  const renderTodayView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="glass p-6 rounded-[32px] space-y-4 border-white/5 bg-primary/5">
        <div className="flex items-center justify-between flex-row-reverse">
          <div className="text-right">
            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">وضعیت مأموریت‌های امروز</h3>
            <p className="text-sm font-bold text-foreground mt-1">{formatPersianDate(todayKey)}</p>
          </div>
          <Badge className="bg-primary/20 text-primary border-none px-3 py-1.5 rounded-xl font-black">
            {todayPlanner.progress}٪ تکمیل
          </Badge>
        </div>
        <Progress value={todayPlanner.progress} className="h-2.5 bg-white/5" />
      </div>

      <div className="space-y-3">
        {todayPlanner.tasks.length === 0 ? (
          <div className="text-center py-12 glass rounded-[32px] border-dashed border-white/10">
            <p className="text-xs font-bold text-muted-foreground">برنامه‌ای برای امروز ثبت نشده است.</p>
            <Button 
              variant="link" 
              className="text-primary text-xs font-black mt-2"
              onClick={() => setViewMode('planning')}
            >
              همین حالا برنامه‌ریزی کنید
            </Button>
          </div>
        ) : (
          todayPlanner.tasks.map((task) => (
            <div key={task.id} className={cn(
              "glass p-5 rounded-[24px] flex items-center justify-between transition-all flex-row-reverse group",
              task.completed ? "opacity-40 bg-white/[0.02]" : "border-white/5 bg-white/[0.03]"
            )}>
              <div className="flex items-center gap-3 flex-row-reverse text-right">
                <div>
                   <span className={cn("text-sm font-bold block", task.completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary">ضریب: {task.weight || 1}</Badge>
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-black border-none px-2",
                      task.priority === 'high' ? "bg-red-500/10 text-red-500" : task.priority === 'medium' ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                    )}>
                      {task.priority === 'high' ? 'فوری' : task.priority === 'medium' ? 'متوسط' : 'عادی'}
                    </Badge>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => todayPlanner.toggleTask(task.id, !task.completed)}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all border shadow-lg shrink-0",
                  task.completed 
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/50"
                )}
              >
                <CheckCircle2 className="w-6 h-6" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderPlanningMode = () => (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between flex-row-reverse">
        <h2 className="text-xl font-black text-primary">Plan Ahead</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setViewMode('today')}
          className="rounded-xl hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Date Picker Section */}
      <div className="glass p-5 rounded-[28px] border-primary/20 bg-primary/5 flex items-center justify-between flex-row-reverse">
        <div className="text-right">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">انتخاب تاریخ هدف</p>
          <p className="text-sm font-bold mt-1 text-primary">{formatPersianDate(selectedPlanningKey)}</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="rounded-xl gap-2 border-white/10 bg-white/5 h-11 px-4">
              <CalendarIcon className="w-4 h-4" />
              تغییر تاریخ
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-none bg-card shadow-2xl" align="end">
            <Calendar
              mode="single"
              selected={planningDate}
              onSelect={(date) => date && setPlanningDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Advanced Add Task UI */}
      <div className="glass p-6 rounded-[32px] space-y-4 bg-white/[0.03] border-white/5 shadow-xl">
        <h3 className="text-xs font-black text-primary flex items-center gap-2 justify-end uppercase tracking-widest">
           افزودن مأموریت جدید
           <Zap className="w-4 h-4" />
        </h3>
        <div className="space-y-3">
          <Input 
            placeholder="عنوان مأموریت..."
            className="bg-white/5 border-white/10 h-12 rounded-xl font-bold text-right focus:ring-primary"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-muted-foreground text-right mr-1">اولویت</p>
              <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                <SelectTrigger className="bg-white/5 border-white/10 h-11 rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="low">عادی (Low)</SelectItem>
                  <SelectItem value="medium">متوسط (Medium)</SelectItem>
                  <SelectItem value="high">فوری (High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-black text-muted-foreground text-right mr-1">ضریب اهمیت (۱-۱۰)</p>
              <Input 
                type="number" 
                min="1" 
                max="10" 
                className="bg-white/5 border-white/10 h-11 rounded-xl text-center font-bold"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddTask} 
            disabled={!newTask.trim()}
            className="w-full h-12 rounded-xl font-black bg-primary shadow-lg shadow-primary/20 gap-2"
          >
            <Plus className="w-4 h-4" />
            افزودن به برنامه
          </Button>
        </div>
      </div>

      {/* Editable List */}
      <div className="space-y-3">
        {planningPlanner.tasks.map((task) => (
          <div key={task.id} className="glass p-4 rounded-3xl flex items-center justify-between flex-row-reverse border-white/5 bg-white/[0.02]">
            <div className="text-right">
              <span className="text-sm font-bold block">{task.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-primary/10 text-[9px] font-black text-primary">
                  ضریب: {task.weight || 1}
                </Badge>
                <Badge variant="secondary" className="bg-white/5 text-[9px] font-black uppercase">
                  {task.priority || 'medium'}
                </Badge>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => planningPlanner.deleteTask(task.id)} 
              className="text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {planningPlanner.tasks.length === 0 && (
          <p className="text-center py-8 text-[10px] font-bold text-muted-foreground opacity-40">لیست این تاریخ خالی است.</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-right pb-32" dir="rtl">
      <header className="flex items-center justify-between flex-row-reverse">
        <div className="text-right">
          <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">مرکز فرماندهی <span className="text-primary">GH</span></h1>
          <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] mt-2">مدیریت مأموریت‌ها و اهداف استراتژیک</p>
        </div>
        <Button 
          variant={viewMode === 'planning' ? 'default' : 'ghost'}
          size="icon" 
          onClick={() => setViewMode(viewMode === 'today' ? 'planning' : 'today')}
          className={cn(
            "w-12 h-12 rounded-2xl transition-all shadow-xl",
            viewMode === 'planning' ? "bg-primary text-white" : "glass text-primary border-primary/20"
          )}
        >
          <Pencil className="w-5 h-5" />
        </Button>
      </header>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 mb-8 rounded-2xl h-14 p-1">
          <TabsTrigger value="daily" className="rounded-xl font-black flex items-center gap-2 text-xs">
            <CalendarDays className="w-4 h-4" />
            برنامه روزانه
          </TabsTrigger>
          <TabsTrigger value="goals" className="rounded-xl font-black flex items-center gap-2 text-xs">
            <Target className="w-4 h-4" />
            اهداف بلندمدت
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          {viewMode === 'today' ? renderTodayView() : renderPlanningMode()}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
           <div className="glass p-6 rounded-[32px] space-y-4 bg-primary/5 border-primary/20 shadow-xl">
             <h3 className="text-xs font-black text-primary flex items-center gap-2 justify-end uppercase tracking-widest">
               تعریف مأموریت استراتژیک جدید
               <Target className="w-4 h-4" />
             </h3>
             <div className="space-y-3">
                <Input 
                  placeholder="عنوان هدف (مثلاً: رتبه ۱ کنکور)"
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-right font-bold"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                <Button 
                  onClick={() => {
                    if (newGoalTitle.trim()) {
                      addGoal({ title: newGoalTitle, description: '', targetDate: '', priority: 'high', progress: 0 });
                      setNewGoalTitle('');
                    }
                  }}
                  className="w-full h-12 rounded-xl bg-primary font-black shadow-lg shadow-primary/20"
                >
                  ثبت مأموریت استراتژیک
                </Button>
             </div>
           </div>

           <div className="grid gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="glass p-6 rounded-[32px] border-white/5 space-y-4 bg-white/[0.03] group hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center justify-between flex-row-reverse">
                    <div className="text-right">
                      <h4 className="font-black text-lg group-hover:text-primary transition-colors">{goal.title}</h4>
                      <p className="text-[9px] font-black text-muted-foreground uppercase mt-0.5 tracking-tighter">Mission Active • V1.0</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteGoal(goal.id)} className="text-destructive/20 hover:text-destructive rounded-xl">
                       <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground flex-row-reverse">
                       <span>میزان پیشرفت کلی</span>
                       <span className="text-primary">{goal.progress}٪</span>
                    </div>
                    <Progress value={goal.progress} className="h-2.5 bg-white/5" />
                  </div>
                </div>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

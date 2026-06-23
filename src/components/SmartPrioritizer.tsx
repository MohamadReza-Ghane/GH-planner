"use client";

import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowDownWideNarrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { smartTaskPrioritization } from '@/ai/flows/smart-task-prioritization';
import type { Task } from '@/hooks/use-tasks';
import type { DailyProgress } from '@/hooks/use-progress';

type SmartPrioritizerProps = {
  tasks: Task[];
  history: DailyProgress[];
  onReorder: (prioritizedIds: string[]) => void;
};

export function SmartPrioritizer({ tasks, history, onReorder }: SmartPrioritizerProps) {
  const [loading, setLoading] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);

  const prioritize = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    try {
      const summary = history.length > 0 
        ? `کاربر در روزهای گذشته میانگین ${Math.round(history.reduce((a,b)=>a+b.pct,0)/history.length)}٪ پیشرفت داشته است.`
        : "اطلاعات قبلی موجود نیست.";

      const result = await smartTaskPrioritization({
        currentTasks: tasks.map(t => ({ id: t.id, name: t.name, stars: t.stars })),
        historicalPerformanceSummary: summary,
        previousDayProgress: history[0] ? {
          donePct: history[0].pct,
          totalWeight: history[0].totalWeight,
          doneWeight: history[0].doneWeight
        } : undefined
      });

      const orderedIds = result.prioritizedTasks
        .sort((a, b) => b.priorityScore - a.priorityScore)
        .map(t => t.id);
      
      onReorder(orderedIds);
      setReasoning(result.reasoning);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-4 border-primary/20 bg-primary/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-foreground">اولویت‌بندی هوشمند</h3>
            <p className="text-[10px] text-muted-foreground">بر اساس ستاره‌ها و سوابق شما</p>
          </div>
        </div>
        <Button 
          onClick={prioritize} 
          disabled={loading || tasks.length < 2}
          className="rounded-xl shadow-lg h-10 px-5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'بهینه‌سازی'}
        </Button>
      </div>

      {reasoning && (
        <div className="bg-background/40 rounded-xl p-4 text-[11px] leading-relaxed text-foreground/80 border border-border">
          <p className="font-bold mb-1 flex items-center gap-2 text-primary">
            <ArrowDownWideNarrow className="w-3 h-3" />
            چرا این ترتیب؟
          </p>
          {reasoning}
        </div>
      )}
    </div>
  );
}
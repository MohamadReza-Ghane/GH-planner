"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2, Sparkles, Telescope, Milestone, CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Task } from '@/hooks/use-tasks';
import type { DailyProgress } from '@/hooks/use-progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from '@/supabase';
import { supabase } from '@/lib/supabase';
import { useGoals } from '@/hooks/use-goals';

type Message = {
  role: 'user' | 'ai';
  text: string;
  suggestedTasks?: Array<{dateKey: string, title: string, priority: string}>;
  simulation?: any;
};

type AIChatProps = {
  tasks: Task[];
  history: DailyProgress[];
  lang: 'fa' | 'en';
  mode?: 'chat' | 'simulate' | 'decision';
};

export function AIChat({ tasks, history, lang, mode = 'chat' }: AIChatProps) {
  const { user } = useUser();
  const { goals } = useGoals(user?.id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const welcomeMsg = mode === 'simulate'
    ? 'من آماده‌ام تا آینده شما را شبیه‌سازی کنم. چه تغییری مد نظر دارید؟'
    : mode === 'decision'
    ? 'بین چه گزینه‌هایی شک دارید؟ من با تحلیل داده‌هایتان بهترین را انتخاب می‌کنم.'
    : 'سلام! من GH هستم — مربی استراتژیک شما. 🧠\nتاریخچه پیشرفت شما را تحلیل کردم. چطور می‌توانم کمک کنم؟';

  useEffect(() => {
    setMessages([{ role: 'ai', text: welcomeMsg }]);
  }, [lang, mode]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApplyPlan = async (suggestedTasks: any[]) => {
    if (!user) return;
    for (const task of suggestedTasks) {
      await supabase.from('daily_plans').insert({
        user_id: user.id,
        date_key: task.dateKey,
        title: task.title,
        priority: task.priority || 'medium',
        completed: false,
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const summary = history.length > 0
        ? `میانگین پیشرفت ۳۰ روز گذشته: ${Math.round(history.reduce((a,b)=>a+b.pct,0)/history.length)}٪`
        : 'سابقه قبلی موجود نیست.';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          contextTasks: tasks.map(t => ({ name: t.name, stars: t.stars })),
          activeGoals: goals.map(g => ({ title: g.title, progress: g.progress })),
          language: lang,
          historicalSummary: summary,
          mode,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.response || 'خطایی رخ داد.',
        suggestedTasks: data.suggestedTasks,
        simulation: data.simulation,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'متأسفانه مشکلی پیش آمد. دوباره تلاش کنید.' }]);
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'simulate' ? 'شبیه‌ساز آینده GH' : mode === 'decision' ? 'دستیار تصمیم GH' : 'مربی هوشمند GH';

  return (
    <div className="flex flex-col h-full min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between px-2 mb-3">
        <h2 className="font-black text-lg flex items-center gap-2">
          {mode === 'simulate' ? <Telescope className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-primary" />}
          {title}
        </h2>
        <Button variant="ghost" size="sm" onClick={() => setMessages([{ role: 'ai', text: welcomeMsg }])}
          className="text-[11px] text-muted hover:text-white bg-white/5 rounded-lg h-7">
          <Trash2 className="w-3.5 h-3.5 ml-1" /> پاک کردن
        </Button>
      </div>

      <div className="flex-1 glass p-4 overflow-hidden flex flex-col mb-4 bg-black/20 border-white/5 rounded-[32px]">
        <ScrollArea className="flex-1 pr-1">
          <div className="space-y-4 pb-4">
            {messages.map((m, i) => {
              const isAi = m.role === 'ai';
              return (
                <div key={i} className={`flex w-full ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex max-w-[85%] gap-2 ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                      isAi ? 'bg-primary/20 text-primary border-primary/10' : 'bg-white/10 text-white/60 border-white/10'
                    }`}>
                      {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div dir="auto" className={`p-3.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words text-right shadow-sm ${
                        isAi ? 'bg-white/5 text-white/95 rounded-tr-none border border-white/5' : 'bg-primary text-primary-foreground rounded-tl-none font-black'
                      }`}>{m.text}</div>
                      {isAi && m.suggestedTasks && m.suggestedTasks.length > 0 && (
                        <Button onClick={() => handleApplyPlan(m.suggestedTasks!)}
                          className="w-full h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-black gap-2">
                          <CalendarPlus className="w-3.5 h-3.5" /> اعمال برنامه در تقویم
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center animate-pulse border border-primary/10">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/5 p-3.5 rounded-2xl rounded-tr-none flex items-center border border-white/5">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      <form onSubmit={handleSend} className="relative">
        <Input placeholder={mode === 'simulate' ? 'مثلاً: اگر هر روز ۶ ساعت مطالعه کنم چه می‌شود؟' : 'چطور می‌توانم کمک کنم؟'}
          className="bg-white/5 border-white/10 h-14 pr-4 pl-14 rounded-2xl text-sm font-bold"
          value={input} onChange={e => setInput(e.target.value)} disabled={loading} dir="auto" />
        <Button type="submit" disabled={loading || !input.trim()}
          className="absolute left-2 top-2 w-10 h-10 rounded-xl bg-primary" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Task } from '@/hooks/use-tasks';

type Message = { role: 'user' | 'ai'; text: string };

export function AIChat({ tasks, lang }: { tasks: Task[]; lang: 'fa' | 'en' }) {
  const welcome = lang === 'fa'
    ? 'سلام! من دستیار GH Planner هستم 🤖\nچطور می‌توانم در مدیریت کارهایت کمک کنم؟'
    : 'Hi! I\'m your GH Planner assistant. How can I help you manage your tasks today?';

  const [messages, setMessages] = useState<Message[]>([{ role: 'ai', text: welcome }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, tasks: tasks.map(t => ({ name: t.name, stars: t.stars })), language: lang }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.response || 'خطایی رخ داد.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'خطا در ارتباط با سرور.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="font-bold flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          {lang === 'fa' ? 'دستیار هوشمند' : 'AI Assistant'}
        </h2>
        <Button variant="ghost" size="sm" className="text-xs h-8 gap-1"
          onClick={() => setMessages([{ role: 'ai', text: welcome }])}>
          <Trash2 className="w-3.5 h-3.5" />
          {lang === 'fa' ? 'پاک کردن' : 'Clear'}
        </Button>
      </div>

      <div className="flex-1 glass p-4 overflow-y-auto mb-3 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            {m.role === 'ai' && (
              <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className={cn(
              'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap',
              m.role === 'ai'
                ? 'bg-white/5 border border-white/8 rounded-tr-none text-foreground'
                : 'bg-primary text-primary-foreground rounded-tl-none font-medium'
            )} dir="auto">{m.text}</div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/20 flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-tr-none">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="relative">
        <Input
          placeholder={lang === 'fa' ? 'سوال یا درخواست خود را بنویسید...' : 'Ask anything...'}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          disabled={loading} dir="auto"
          className="h-14 pr-4 pl-14 rounded-2xl bg-white/5 border-white/10"
        />
        <Button size="icon" className="absolute left-2 top-2 w-10 h-10 rounded-xl"
          onClick={handleSend} disabled={loading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

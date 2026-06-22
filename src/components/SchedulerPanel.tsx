'use client';
import { useState, useEffect } from 'react';
import { Plus, Trash2, AlarmClock, Timer, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { getTehranNow } from '@/lib/utils';
import { cn } from '@/lib/utils';

type Reminder = { id: string; label: string; time: string; emoji: string };

function AnalogClock({ time }: { time: Date }) {
  const s = time.getSeconds(), m = time.getMinutes(), h = time.getHours();
  return (
    <div className="relative w-36 h-36 rounded-full border-2 border-primary/20 bg-black/30 flex items-center justify-center shadow-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full" />
      {/* Hour marks */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
          <div className={cn('absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full', i % 3 === 0 ? 'w-1.5 h-1.5 bg-primary/60' : 'w-0.5 h-0.5 bg-white/20')} />
        </div>
      ))}
      {/* Hour hand */}
      <div className="absolute w-1.5 h-10 bg-primary/90 rounded-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${((h % 12) * 30 + m * 0.5)}deg)`, transformOrigin: 'bottom center' }} />
      {/* Minute hand */}
      <div className="absolute w-1 h-14 bg-secondary/80 rounded-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${m * 6 + s * 0.1}deg)`, transformOrigin: 'bottom center' }} />
      {/* Second hand */}
      <div className="absolute w-0.5 h-16 bg-red-400 rounded-full origin-bottom bottom-1/2 left-1/2 -translate-x-1/2"
        style={{ transform: `translateX(-50%) rotate(${s * 6}deg)`, transformOrigin: 'bottom center' }} />
      <div className="w-2.5 h-2.5 rounded-full bg-primary z-10" />
    </div>
  );
}

const EMOJIS = ['⏰', '💊', '🏋️', '📚', '🍽️', '💧', '🧘', '🌙'];

export function SchedulerPanel() {
  const [now, setNow] = useState(getTehranNow());
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', label: 'صبحانه', time: '08:00', emoji: '🍽️' },
    { id: '2', label: 'ورزش', time: '07:00', emoji: '🏋️' },
  ]);
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newEmoji, setNewEmoji] = useState('⏰');

  useEffect(() => {
    const t = setInterval(() => setNow(getTehranNow()), 1000);
    return () => clearInterval(t);
  }, []);

  const addReminder = () => {
    if (!newLabel.trim()) return;
    setReminders(prev => [...prev, { id: Date.now().toString(), label: newLabel, time: newTime, emoji: newEmoji }]);
    setNewLabel('');
  };

  // Time until Tehran midnight
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hLeft = Math.floor(diff / 3600000);
  const mLeft = Math.floor((diff % 3600000) / 60000);

  return (
    <div className="space-y-6 pb-16 animate-up">
      {/* Clock */}
      <div className="glass p-6 text-center space-y-4">
        <AnalogClock time={now} />
        <div className="text-3xl font-black tracking-widest text-primary" dir="ltr">
          {String(now.getHours()).padStart(2,'0')}:{String(now.getMinutes()).padStart(2,'0')}:{String(now.getSeconds()).padStart(2,'0')}
        </div>
        <p className="text-xs text-muted-foreground">ساعت تهران</p>
      </div>

      {/* Time until midnight */}
      <div className="glass p-4 flex items-center gap-3">
        <Moon className="w-5 h-5 text-secondary shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">زمان باقی‌مانده تا پایان روز</p>
          <p className="font-bold text-foreground" dir="ltr">{hLeft}h {mLeft}m</p>
        </div>
      </div>

      {/* Reminders */}
      <div className="space-y-3">
        <h3 className="font-bold flex items-center gap-2 px-1">
          <AlarmClock className="w-4 h-4 text-primary" />
          یادآورها
        </h3>
        {reminders.map(r => (
          <div key={r.id} className="glass p-3 flex items-center gap-3">
            <span className="text-xl">{r.emoji}</span>
            <span className="flex-1 text-sm font-medium">{r.label}</span>
            <span className="text-sm font-bold text-primary" dir="ltr">{r.time}</span>
            <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive hover:bg-destructive/10"
              onClick={() => setReminders(prev => prev.filter(x => x.id !== r.id))}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}

        {/* Add reminder */}
        <div className="glass p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setNewEmoji(e)}
                className={cn('text-xl w-9 h-9 rounded-lg transition-all', newEmoji === e ? 'bg-primary/20 scale-110' : 'hover:bg-white/5')}>
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="عنوان یادآور..." value={newLabel} onChange={e => setNewLabel(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addReminder()} className="flex-1" />
            <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-background/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" dir="ltr" />
          </div>
          <Button className="w-full gap-2" onClick={addReminder}>
            <Plus className="w-4 h-4" /> افزودن یادآور
          </Button>
        </div>
      </div>
    </div>
  );
}

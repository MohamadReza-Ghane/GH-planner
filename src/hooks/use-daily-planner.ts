'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type DailyTask = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  weight?: number;
  date_key: string;
};

export function useDailyPlanner(uid: string | null, dateKey: string) {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!uid) { setTasks([]); setLoading(false); return; }
    supabase.from('daily_plans').select('*').eq('user_id', uid).eq('date_key', dateKey)
      .then(({ data }) => {
        const t = data || [];
        setTasks(t);
        const done = t.filter(x => x.completed).length;
        setProgress(t.length > 0 ? Math.round((done / t.length) * 100) : 0);
        setLoading(false);
      });
  }, [uid, dateKey]);

  const addTask = async (title: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!uid) return;
    const { data } = await supabase.from('daily_plans').insert({
      user_id: uid, date_key: dateKey, title, priority, completed: false, weight: 1,
    }).select().single();
    if (data) setTasks(prev => [...prev, data]);
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const completed = !task.completed;
    await supabase.from('daily_plans').update({ completed }).eq('id', id);
    const updated = tasks.map(t => t.id === id ? { ...t, completed } : t);
    setTasks(updated);
    const done = updated.filter(x => x.completed).length;
    setProgress(updated.length > 0 ? Math.round((done / updated.length) * 100) : 0);
  };

  const deleteTask = async (id: string) => {
    await supabase.from('daily_plans').delete().eq('id', id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, progress, addTask, toggleTask, deleteTask };
}

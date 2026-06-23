'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Task = {
  id: string;
  name: string;
  stars: number;
  order: number;
  created_at: string;
};

export function useTasks(uid: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!uid) { setTasks([]); setLoading(false); return; }
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('order', { ascending: true });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [uid]);

  const addTask = async (name: string, stars: number) => {
    if (!uid) return;
    const order = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0;
    const { data } = await supabase.from('tasks').insert({ user_id: uid, name, stars, order }).select().single();
    if (data) setTasks(prev => [...prev, data]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!uid) return;
    await supabase.from('tasks').update(updates).eq('id', id).eq('user_id', uid);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = async (id: string) => {
    if (!uid) return;
    await supabase.from('tasks').delete().eq('id', id).eq('user_id', uid);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}

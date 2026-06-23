'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target_date: string;
  created_at: string;
};

export function useGoals(uid: string | null) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setGoals([]); setLoading(false); return; }
    supabase.from('goals').select('*').eq('user_id', uid).order('created_at', { ascending: false })
      .then(({ data }) => { setGoals(data || []); setLoading(false); });
  }, [uid]);

  const addGoal = async (title: string, description: string, target_date: string) => {
    if (!uid) return;
    const { data } = await supabase.from('goals').insert({ user_id: uid, title, description, target_date, progress: 0 }).select().single();
    if (data) setGoals(prev => [data, ...prev]);
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    if (!uid) return;
    await supabase.from('goals').update(updates).eq('id', id).eq('user_id', uid);
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = async (id: string) => {
    if (!uid) return;
    await supabase.from('goals').delete().eq('id', id).eq('user_id', uid);
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  return { goals, loading, addGoal, updateGoal, deleteGoal };
}

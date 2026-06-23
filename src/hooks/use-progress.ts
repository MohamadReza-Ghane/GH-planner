'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getTehranDateKey } from '@/lib/tehran-time';
import type { Task } from './use-tasks';

export type DailyProgress = {
  dateKey: string;
  pct: number;
  doneWeight: number;
  totalWeight: number;
  checkedIds: string[];
};

export function useProgress(uid: string | null, tasks: Task[]) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<DailyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const dateKey = getTehranDateKey();

  useEffect(() => {
    if (!uid) return;
    supabase.from('progress').select('*').eq('user_id', uid).eq('date_key', dateKey).single()
      .then(({ data }) => { if (data) setCheckedIds(data.checked_ids || []); });

    supabase.from('progress').select('*').eq('user_id', uid).order('date_key', { ascending: false })
      .then(({ data }) => {
        const hist: DailyProgress[] = (data || []).map(d => ({
          dateKey: d.date_key, pct: d.pct || 0,
          doneWeight: d.done_weight || 0, totalWeight: d.total_weight || 0,
          checkedIds: d.checked_ids || [],
        }));
        setHistory(hist);
        let s = 0;
        for (const h of hist) {
          if (h.dateKey > dateKey) continue;
          if (h.pct === 100) s++;
          else if (h.dateKey < dateKey) break;
        }
        setStreak(s);
      });
  }, [uid, dateKey]);

  const toggleTask = useCallback(async (id: string) => {
    if (!uid) return;
    setIsSaving(true);
    const newChecked = checkedIds.includes(id)
      ? checkedIds.filter(c => c !== id)
      : [...checkedIds, id];
    setCheckedIds(newChecked);
    const doneWeight = tasks.filter(t => newChecked.includes(t.id)).reduce((s, t) => s + t.stars, 0);
    const totalWeight = tasks.reduce((s, t) => s + t.stars, 0);
    const pct = totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : 0;
    await supabase.from('progress').upsert({
      user_id: uid, date_key: dateKey,
      checked_ids: newChecked, pct, done_weight: doneWeight, total_weight: totalWeight,
    });
    setIsSaving(false);
  }, [uid, checkedIds, tasks, dateKey]);

  return { checkedIds, toggleTask, isSaving, history, streak, dateKey };
}

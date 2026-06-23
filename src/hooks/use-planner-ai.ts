'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useTasks } from './use-tasks';

export function usePlannerAI(uid: string | null) {
  const { tasks } = useTasks(uid);
  const [trackerData, setTrackerData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    xp: 0, level: 1, productivityScore: 0,
    focusScore: 0, lifeScore: 0, streak: 0, achievements: 0
  });
  const [xpProgress, setXpProgress] = useState(0);

  useEffect(() => {
    if (!uid || uid === 'guest') return;
    supabase.from('tracker').select('*').eq('user_id', uid)
      .order('date_key', { ascending: false }).limit(30)
      .then(({ data }) => setTrackerData(data || []));

    supabase.from('user_stats').select('*').eq('user_id', uid).single()
      .then(({ data }) => {
        if (data) {
          setStats(data);
          setXpProgress((data.xp % 1000) / 10);
        }
      });
  }, [uid]);

  return { tasks, stats, trackerData, xpProgress };
}

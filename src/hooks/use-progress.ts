'use client';
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';
import { getTodayKey } from '@/lib/utils';
import type { Task } from './use-tasks';

export type DailyProgress = {
  dateKey: string;
  pct: number;
  doneWeight: number;
  totalWeight: number;
};

export function useProgress(uid: string | null, tasks: Task[]) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<DailyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const dateKey = getTodayKey();

  // Load today's progress
  useEffect(() => {
    if (!uid) return;
    const { db } = getFirebase();
    getDoc(doc(db, `users/${uid}/progress`, dateKey)).then((snap) => {
      if (snap.exists()) setCheckedIds(snap.data().checkedIds || []);
    });
  }, [uid, dateKey]);

  // Load history
  useEffect(() => {
    if (!uid) return;
    const { db } = getFirebase();
    getDocs(query(collection(db, `users/${uid}/progress`), orderBy('__name__', 'desc'))).then((snap) => {
      const hist: DailyProgress[] = snap.docs.map(d => ({
        dateKey: d.id,
        pct: d.data().pct || 0,
        doneWeight: d.data().doneWeight || 0,
        totalWeight: d.data().totalWeight || 0,
      }));
      setHistory(hist);
      // streak
      let s = 0;
      const today = getTodayKey();
      for (const h of hist) {
        if (h.dateKey > today) continue;
        if (h.pct === 100) s++;
        else if (h.dateKey < today) break;
      }
      setStreak(s);
    });
  }, [uid]);

  const toggleTask = useCallback(async (id: string) => {
    if (!uid) return;
    const { db } = getFirebase();
    setIsSaving(true);
    const newChecked = checkedIds.includes(id)
      ? checkedIds.filter(c => c !== id)
      : [...checkedIds, id];
    setCheckedIds(newChecked);
    const doneWeight = tasks.filter(t => newChecked.includes(t.id)).reduce((s, t) => s + t.stars, 0);
    const totalWeight = tasks.reduce((s, t) => s + t.stars, 0);
    const pct = totalWeight > 0 ? Math.round((doneWeight / totalWeight) * 100) : 0;
    await setDoc(doc(db, `users/${uid}/progress`, dateKey), { checkedIds: newChecked, pct, doneWeight, totalWeight, dateKey });
    setIsSaving(false);
  }, [uid, checkedIds, tasks, dateKey]);

  return { checkedIds, toggleTask, isSaving, history, streak, dateKey };
}

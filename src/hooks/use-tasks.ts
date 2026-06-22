'use client';
import { useState, useEffect } from 'react';
import {
  collection, query, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, Timestamp
} from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';

export type Task = {
  id: string;
  name: string;
  stars: number;
  order: number;
  createdAt: any;
};

export function useTasks(uid: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setTasks([]); setLoading(false); return; }
    const { db } = getFirebase();
    const q = query(collection(db, `users/${uid}/tasks`), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() } as Task)));
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  const addTask = async (name: string, stars: number) => {
    if (!uid) return;
    const { db } = getFirebase();
    const order = tasks.length > 0 ? Math.max(...tasks.map(t => t.order)) + 1 : 0;
    await addDoc(collection(db, `users/${uid}/tasks`), { name, stars, order, createdAt: Timestamp.now() });
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!uid) return;
    const { db } = getFirebase();
    await updateDoc(doc(db, `users/${uid}/tasks`, id), updates);
  };

  const deleteTask = async (id: string) => {
    if (!uid) return;
    const { db } = getFirebase();
    await deleteDoc(doc(db, `users/${uid}/tasks`, id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask };
}

'use client';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { getFirebase } from '@/lib/firebase';

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: any;
};

export function useNotes(uid: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setNotes([]); setLoading(false); return; }
    const { db } = getFirebase();
    const q = query(collection(db, `users/${uid}/notes`), orderBy('updatedAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() } as Note)));
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  const addNote = async (title: string, content: string) => {
    if (!uid) return;
    const { db } = getFirebase();
    await addDoc(collection(db, `users/${uid}/notes`), { title, content, updatedAt: Timestamp.now() });
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!uid) return;
    const { db } = getFirebase();
    await updateDoc(doc(db, `users/${uid}/notes`, id), { ...updates, updatedAt: Timestamp.now() });
  };

  const deleteNote = async (id: string) => {
    if (!uid) return;
    const { db } = getFirebase();
    await deleteDoc(doc(db, `users/${uid}/notes`, id));
  };

  return { notes, loading, addNote, updateNote, deleteNote };
}

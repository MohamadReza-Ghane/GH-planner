'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Note = {
  id: string;
  title: string;
  content: string;
  updated_at: string;
};

export function useNotes(uid: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    if (!uid) { setNotes([]); setLoading(false); return; }
    const { data } = await supabase
      .from('notes').select('*').eq('user_id', uid)
      .order('updated_at', { ascending: false });
    setNotes(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); }, [uid]);

  const addNote = async (title: string, content: string) => {
    if (!uid) return;
    const { data } = await supabase.from('notes').insert({ user_id: uid, title, content }).select().single();
    if (data) setNotes(prev => [data, ...prev]);
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!uid) return;
    const updated = { ...updates, updated_at: new Date().toISOString() };
    await supabase.from('notes').update(updated).eq('id', id).eq('user_id', uid);
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updated } : n));
  };

  const deleteNote = async (id: string) => {
    if (!uid) return;
    await supabase.from('notes').delete().eq('id', id).eq('user_id', uid);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return { notes, loading, addNote, updateNote, deleteNote };
}

'use client';
import { useState } from 'react';
import { Plus, Trash2, Save, StickyNote, Search, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useNotes, type Note } from '@/hooks/use-notes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function NotepadPanel() {
  const { user } = useAuth();
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (note: Note) => {
    setSelected(note); setTitle(note.title); setContent(note.content);
  };

  const handleNew = async () => {
    await addNote('یادداشت جدید', '');
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    await updateNote(selected.id, { title, content });
    setSaving(false);
    setSelected(null);
  };

  if (selected) return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-up">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => setSelected(null)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Input value={title} onChange={e => setTitle(e.target.value)} className="flex-1 font-bold" placeholder="عنوان..." />
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          ذخیره
        </Button>
      </div>
      <Textarea
        value={content} onChange={e => setContent(e.target.value)}
        className="flex-1 text-sm leading-relaxed"
        placeholder="متن یادداشت خود را اینجا بنویسید..." dir="auto"
      />
    </div>
  );

  return (
    <div className="space-y-4 pb-16 animate-up">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input placeholder="جستجو در یادداشت‌ها..." value={search} onChange={e => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Button size="icon" onClick={handleNew} className="w-11 h-11 rounded-xl shrink-0">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <StickyNote className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">یادداشتی یافت نشد</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(note => (
            <div key={note.id} className="glass p-4 flex items-start gap-3 cursor-pointer hover:bg-white/8 transition-all"
              onClick={() => handleSelect(note)}>
              <StickyNote className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{note.title || 'بدون عنوان'}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{note.content || 'خالی...'}</p>
              </div>
              <Button size="icon" variant="ghost" className="w-7 h-7 text-destructive hover:bg-destructive/10 shrink-0"
                onClick={e => { e.stopPropagation(); deleteNote(note.id); if (selected?.id === note.id) setSelected(null); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

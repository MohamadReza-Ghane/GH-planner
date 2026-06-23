"use client";

import React, { useState } from 'react';
import { 
  StickyNote, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  Save, 
  FileText,
  Search,
  Clock,
  LayoutGrid,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotes, type Note } from '@/hooks/use-notes';
import { useUser } from '@/supabase';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function NotepadPanel() {
  const { user } = useUser();
  
  const { notes, loading, addNote, updateNote, deleteNote } = useNotes(user?.uid || null);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
    setSaveStatus('idle');
  };

  const handleCreateNew = () => {
    const defaultTitle = "";
    addNote(defaultTitle, "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (selectedNote) {
      setSaveStatus('saving');
      updateNote(selectedNote.id, { title: editTitle, content: editContent });
      setTimeout(() => {
        setSaveStatus('saved');
        setIsEditing(false);
        setTimeout(() => setSaveStatus('idle'), 2000);
      }, 500);
    }
  };

  if (selectedNote) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)] animate-in slide-in-from-left-4 duration-300">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedNote(null)} className="gap-2 rounded-xl text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
            بازگشت
          </Button>
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && <span className="text-[10px] text-primary animate-pulse font-black">در حال ذخیره...</span>}
            {saveStatus === 'saved' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {isEditing && saveStatus === 'idle' && (
              <Button size="sm" onClick={handleSave} className="gap-2 rounded-xl bg-primary shadow-lg shadow-primary/20">
                <Save className="w-4 h-4" />
                ذخیره
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                deleteNote(selectedNote.id);
                setSelectedNote(null);
              }} 
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="glass-card p-6 flex-1 flex flex-col space-y-6 overflow-hidden border-white/5 bg-white/[0.02] shadow-2xl">
          <Input 
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              setIsEditing(true);
            }}
            placeholder="بدون عنوان"
            className="border-none bg-transparent text-2xl font-black p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/30"
          />
          <Textarea 
            value={editContent}
            onChange={(e) => {
              setEditContent(e.target.value);
              setIsEditing(true);
            }}
            placeholder="شروع به نوشتن کنید..."
            className="border-none bg-transparent flex-1 resize-none p-0 focus-visible:ring-0 text-foreground/80 leading-loose text-md font-medium"
          />
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
             <span className="text-[10px] text-muted-foreground font-bold">
               {editContent.length} کاراکتر
             </span>
             <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
               <Clock className="w-3 h-3" />
               ویرایش شده
             </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl flex items-center gap-3 text-foreground">
          <StickyNote className="w-6 h-6 text-primary" />
          یادداشت‌ها
        </h2>
        <Button onClick={handleCreateNew} size="sm" className="gap-2 rounded-xl shadow-xl shadow-primary/20 h-10 px-4 bg-primary text-primary-foreground font-black">
          <Plus className="w-4 h-4" />
          یادداشت جدید
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-3.5 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="جستجو در محتوا..."
          className="bg-white/5 border-white/10 pr-11 h-12 rounded-2xl focus:ring-primary shadow-inner font-bold"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="grid gap-4 pb-12">
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground font-bold animate-pulse">در حال بارگذاری...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40 space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                <FileText className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-sm font-black">هنوز یادداشتی ندارید</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <div 
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className="glass-card p-5 cursor-pointer hover:bg-white/[0.08] transition-all border-white/5 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all" />
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-foreground group-hover:text-primary transition-colors truncate pr-2 flex-1">
                    {note.title || "بدون عنوان"}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground shrink-0 font-black bg-white/5 px-2 py-1 rounded-full">
                    <Clock className="w-2.5 h-2.5" />
                    {note.updatedAt?.toDate() ? note.updatedAt.toDate().toLocaleDateString('fa-IR', { hour: '2-digit', minute: '2-digit' }) : '...'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                  {note.content || "محتوایی برای نمایش وجود ندارد..."}
                </p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity">
                   <Badge variant="secondary" className="bg-primary/10 text-[8px] text-primary border-none">SMART SYNC</Badge>
                   <Badge variant="secondary" className="bg-white/5 text-[8px] text-muted-foreground border-none">DORAN FONT</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
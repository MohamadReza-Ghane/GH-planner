
"use client";

import React from 'react';
import { NotepadPanel } from '@/components/NotepadPanel';
import { StickyNote, Search, Sparkles } from 'lucide-react';

export function NotesHub({ notes }: any) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">BRAIN <span className="text-primary">DUMP</span></h1>
          <p className="text-[10px] font-black text-muted-foreground tracking-[0.2em] mt-1">KNOWLEDGE BASE • AI POWERED</p>
        </div>
      </header>
      
      <NotepadPanel />
    </div>
  );
}

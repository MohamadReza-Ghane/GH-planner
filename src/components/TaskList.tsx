"use client";

import React, { useState } from 'react';
import { Check, Trash2, Edit2, Star, StarHalf } from 'lucide-react';
import type { Task } from '@/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TaskListProps = {
  tasks: Task[];
  checkedIds: string[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, checkedIds, onToggle, onUpdate, onDelete }: TaskListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditName(task.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, { name: editName });
    }
    setEditingId(null);
  };

  const renderStars = (value: number) => {
    return (
      <div className="flex -space-x-1">
        {[1, 2, 3, 4, 5].map(s => {
          if (value >= s) return <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />;
          if (value === s - 0.5) return <StarHalf key={s} className="w-3.5 h-3.5 fill-primary text-primary" />;
          return <Star key={s} className="w-3.5 h-3.5 text-muted-foreground/30" />;
        })}
      </div>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm space-y-4">
        <p>هنوز وظیفه‌ای اضافه نکردید...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isChecked = checkedIds.includes(task.id);
        const isEditing = editingId === task.id;

        return (
          <div
            key={task.id}
            className={`glass-card p-4 transition-all duration-300 flex items-center gap-4 group ${isChecked ? 'opacity-50 grayscale-[0.2]' : ''}`}
          >
            <div
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                isChecked ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'border-muted hover:border-primary/50'
              }`}
              onClick={() => onToggle(task.id)}
            >
              {isChecked && <Check className="w-4 h-4 text-primary-foreground stroke-[3]" />}
            </div>

            <div className="flex-1 flex flex-col gap-1 min-w-0">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    className="h-8 bg-background border-border text-sm focus:ring-primary"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                  <Button size="sm" onClick={() => saveEdit(task.id)} className="h-8 px-3">ذخیره</Button>
                </div>
              ) : (
                <>
                  <p 
                    className={`text-sm font-semibold truncate cursor-pointer transition-all ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    onDoubleClick={() => startEditing(task)}
                  >
                    {task.name}
                  </p>
                  {renderStars(task.stars)}
                </>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground" onClick={() => startEditing(task)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(task.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
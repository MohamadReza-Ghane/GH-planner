'use client';
import { useState } from 'react';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import type { Task } from '@/hooks/use-tasks';

type Props = {
  tasks: Task[];
  checkedIds: string[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
};

export function TaskList({ tasks, checkedIds, onToggle, onUpdate, onDelete }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (tasks.length === 0)
    return <div className="text-center py-12 text-muted-foreground text-sm">هنوز وظیفه‌ای اضافه نکردید...</div>;

  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const done = checkedIds.includes(task.id);
        const isEditing = editId === task.id;
        return (
          <div key={task.id} className={cn(
            'glass p-4 flex items-center gap-3 transition-all duration-300',
            done && 'opacity-60'
          )}>
            {/* Checkbox */}
            <button
              onClick={() => onToggle(task.id)}
              className={cn(
                'w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all',
                done ? 'bg-primary border-primary' : 'border-border hover:border-primary'
              )}
            >
              {done && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </button>

            {/* Name */}
            {isEditing ? (
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { onUpdate(task.id, { name: editName }); setEditId(null); }
                  if (e.key === 'Escape') setEditId(null);
                }}
                className="flex-1 h-8 text-sm"
                autoFocus
              />
            ) : (
              <span className={cn('flex-1 text-sm font-medium', done && 'line-through text-muted-foreground')}>
                {task.name}
              </span>
            )}

            {/* Stars */}
            <div className="flex gap-0.5" dir="ltr">
              {Array.from({ length: Math.ceil(task.stars) }, (_, i) => (
                <svg key={i} viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={i + 1 <= task.stars ? '#a78bfa' : 'rgba(255,255,255,0.15)'}
                    strokeWidth="0"
                  />
                </svg>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <Button size="icon" className="w-7 h-7 rounded-lg" onClick={() => { onUpdate(task.id, { name: editName }); setEditId(null); }}>
                    <Check className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg" onClick={() => setEditId(null)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100"
                    onClick={() => { setEditId(task.id); setEditName(task.name); }}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="w-7 h-7 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(task.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

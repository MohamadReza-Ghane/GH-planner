'use client';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[80px] w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
export { Textarea };

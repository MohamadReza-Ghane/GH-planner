
import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export function HalfStarPicker({ value, onChange }: { value: number, onChange: (val: number) => void }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1 items-center bg-white/5 p-2 rounded-full border border-white/10">
      {stars.map((s) => {
        const isFull = value >= s;
        const isHalf = value === s - 0.5;
        
        return (
          <div key={s} className="relative cursor-pointer group flex items-center justify-center">
            {/* Left half clickable area */}
            <div 
              className="absolute left-0 top-0 w-1/2 h-full z-10" 
              onClick={() => onChange(s - 0.5)}
            />
            {/* Right half clickable area */}
            <div 
              className="absolute right-0 top-0 w-1/2 h-full z-10" 
              onClick={() => onChange(s)}
            />
            
            {isFull ? (
              <Star className="w-5 h-5 fill-primary text-primary" />
            ) : isHalf ? (
              <div className="relative">
                <Star className="w-5 h-5 text-white/20" />
                <StarHalf className="w-5 h-5 fill-primary text-primary absolute inset-0" />
              </div>
            ) : (
              <Star className="w-5 h-5 text-white/20" />
            )}
          </div>
        );
      })}
      <span className="text-xs font-bold text-primary mr-2 min-w-[2ch]">{value}</span>
    </div>
  );
}

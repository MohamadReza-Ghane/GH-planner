'use client';

const MAX = 5;

export function HalfStarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1 select-none" dir="ltr">
      {Array.from({ length: MAX }, (_, i) => {
        const full = i + 1;
        const half = i + 0.5;
        const isFull = value >= full;
        const isHalf = !isFull && value >= half;
        return (
          <div key={i} className="relative w-7 h-7">
            {/* Left half (0.5) */}
            <button
              className="absolute inset-0 w-1/2 z-10"
              onClick={() => onChange(half)}
              aria-label={`${half} ستاره`}
            />
            {/* Right half (full) */}
            <button
              className="absolute inset-0 left-1/2 w-1/2 z-10"
              onClick={() => onChange(full)}
              aria-label={`${full} ستاره`}
            />
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <defs>
                <linearGradient id={`star-${i}`}>
                  <stop offset="50%" stopColor={isHalf || isFull ? '#a78bfa' : 'transparent'} />
                  <stop offset="50%" stopColor={isFull ? '#a78bfa' : 'transparent'} />
                </linearGradient>
              </defs>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={isFull ? '#a78bfa' : isHalf ? 'url(#star-' + i + ')' : 'rgba(255,255,255,0.1)'}
                stroke="#a78bfa"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        );
      })}
      <span className="mr-2 text-sm font-bold text-primary">{value}★</span>
    </div>
  );
}

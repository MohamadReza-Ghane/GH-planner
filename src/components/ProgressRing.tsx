'use client';

export function ProgressRing({ progress }: { progress: number }) {
  const r = 56;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;

  const color = progress === 100 ? '#a78bfa' : progress >= 70 ? '#60a5fa' : progress >= 30 ? '#a78bfa' : '#6d28d9';

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="160" height="160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-4xl font-black text-foreground">{progress}<span className="text-xl text-primary">٪</span></div>
        <div className="text-[10px] text-muted-foreground font-bold mt-0.5">پیشرفت امروز</div>
      </div>
      {progress === 100 && (
        <div className="absolute inset-0 rounded-full pulse-ring" />
      )}
    </div>
  );
}

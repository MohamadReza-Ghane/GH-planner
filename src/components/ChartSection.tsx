'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Award, TrendingUp } from 'lucide-react';
import type { DailyProgress } from '@/hooks/use-progress';

export function ChartSection({ history }: { history: DailyProgress[] }) {
  const data = [...history].reverse().slice(-14).map(d => ({
    name: d.dateKey.split('-').slice(1).join('/'),
    pct: d.pct,
    score: d.doneWeight,
  }));

  const avg = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length) : 0;

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#12101e] border border-white/10 p-3 rounded-xl text-xs">
        <p className="text-white/40 mb-1">{label}</p>
        <p className="font-bold text-primary">{payload[0].value}٪</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-16 animate-up">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4 text-center space-y-1">
          <Award className="w-6 h-6 text-primary mx-auto" />
          <div className="text-2xl font-black">{data.length}</div>
          <div className="text-[10px] text-muted-foreground">روز ثبت شده</div>
        </div>
        <div className="glass p-4 text-center space-y-1">
          <TrendingUp className="w-6 h-6 text-secondary mx-auto" />
          <div className="text-2xl font-black">{avg}٪</div>
          <div className="text-[10px] text-muted-foreground">میانگین کل</div>
        </div>
      </div>

      {/* Area chart */}
      <div className="glass p-4">
        <h3 className="text-sm font-bold mb-4">روند پیشرفت ۱۴ روز اخیر</h3>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="pct" stroke="#a78bfa" fill="url(#grad)" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            هنوز داده‌ای ثبت نشده
          </div>
        )}
      </div>

      {/* Bar chart */}
      {data.length > 0 && (
        <div className="glass p-4">
          <h3 className="text-sm font-bold mb-4">امتیاز روزانه</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="score" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

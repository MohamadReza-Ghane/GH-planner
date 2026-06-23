"use client";

import React, { useState } from 'react';
import { Activity, Moon, BookOpen, Droplets, Zap, Smile, Save, Loader2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/supabase';
import { supabase } from '@/lib/supabase';
import { getTehranDateKey } from '@/lib/tehran-time';
import { cn } from '@/lib/utils';

export function TrackerView({ trackerData }: any) {
  const { user } = useUser();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    sleepHours: 7, energyLevel: 7, stressLevel: 3,
    studyHours: 4, waterGlasses: 6, moodScore: 7,
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const dateKey = getTehranDateKey();
    await supabase.from('tracker').upsert({
      user_id: user.id, date_key: dateKey, ...data,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const metrics = [
    { key: 'sleepHours', label: 'ساعت خواب', icon: Moon, max: 12, unit: 'h', color: 'text-blue-400' },
    { key: 'energyLevel', label: 'سطح انرژی', icon: Zap, max: 10, unit: '/10', color: 'text-yellow-400' },
    { key: 'stressLevel', label: 'سطح استرس', icon: Activity, max: 10, unit: '/10', color: 'text-red-400' },
    { key: 'studyHours', label: 'ساعت مطالعه', icon: BookOpen, max: 12, unit: 'h', color: 'text-green-400' },
    { key: 'waterGlasses', label: 'آب (لیوان)', icon: Droplets, max: 12, unit: '', color: 'text-cyan-400' },
    { key: 'moodScore', label: 'حال عمومی', icon: Smile, max: 10, unit: '/10', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32" dir="rtl">
      <div className="glass p-6 rounded-[32px] border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black">ردیاب روزانه</h2>
            <p className="text-xs text-muted-foreground">وضعیت امروز را ثبت کن</p>
          </div>
        </div>

        <div className="space-y-6">
          {metrics.map(({ key, label, icon: Icon, max, unit, color }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", color)} />
                  <span className="text-sm font-bold">{label}</span>
                </div>
                <Badge variant="outline" className={cn("font-black text-xs", color)}>
                  {(data as any)[key]}{unit}
                </Badge>
              </div>
              <Slider
                value={[(data as any)[key]]}
                onValueChange={([v]) => setData(prev => ({ ...prev, [key]: v }))}
                max={max} min={0} step={0.5}
                className="w-full"
              />
            </div>
          ))}
        </div>

        <Button onClick={handleSave} disabled={saving || !user} className="w-full mt-6 h-12 rounded-2xl gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? '✅ ذخیره شد!' : 'ذخیره وضعیت امروز'}
        </Button>
      </div>

      {trackerData && trackerData.length > 0 && (
        <div className="glass p-6 rounded-[32px] border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-black">تاریخچه اخیر</h3>
          </div>
          <div className="space-y-2">
            {trackerData.slice(0, 7).map((d: any) => (
              <div key={d.date_key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-xs text-muted-foreground font-bold">{d.date_key}</span>
                <div className="flex gap-3 text-xs">
                  <span className="text-blue-400">😴 {d.sleepHours}h</span>
                  <span className="text-yellow-400">⚡ {d.energyLevel}/10</span>
                  <span className="text-green-400">📚 {d.studyHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

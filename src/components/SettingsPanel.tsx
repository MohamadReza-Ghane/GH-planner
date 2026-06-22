'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import { LogOut, Globe, Moon, Sun, Info, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SettingsPanel() {
  const { user } = useAuth();
  const [lang, setLangState] = useState<'fa' | 'en'>('fa');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const l = localStorage.getItem('gh-lang') as 'fa' | 'en' || 'fa';
    const t = localStorage.getItem('gh-theme') as 'dark' | 'light' || 'dark';
    setLangState(l); setThemeState(t);
  }, []);

  const setLang = (l: 'fa' | 'en') => {
    setLangState(l);
    localStorage.setItem('gh-lang', l);
    document.documentElement.dir = l === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('gh-theme', t);
    document.documentElement.classList.toggle('light', t === 'light');
  };

  const handleLogout = async () => {
    const { auth } = getFirebase();
    await signOut(auth);
  };

  return (
    <div className="space-y-4 pb-16 animate-up">
      {/* Profile */}
      <div className="glass p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center">
          {user?.photoURL
            ? <img src={user.photoURL} className="w-12 h-12 rounded-2xl" alt="" />
            : <User className="w-6 h-6 text-primary" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">{user?.displayName || 'کاربر'}</p>
          <p className="text-xs text-muted-foreground truncate" dir="ltr">{user?.email}</p>
        </div>
      </div>

      {/* Language */}
      <div className="glass p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Globe className="w-4 h-4 text-primary" /> زبان برنامه
        </div>
        <div className="flex gap-2">
          {(['fa', 'en'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold transition-all',
                lang === l ? 'bg-primary text-primary-foreground' : 'bg-white/5 hover:bg-white/10')}>
              {l === 'fa' ? 'فارسی' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="glass p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
          پوسته ظاهری
        </div>
        <div className="flex gap-2">
          {(['dark', 'light'] as const).map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className={cn('flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2',
                theme === t ? 'bg-primary text-primary-foreground' : 'bg-white/5 hover:bg-white/10')}>
              {t === 'dark' ? <><Moon className="w-3.5 h-3.5" /> تیره</> : <><Sun className="w-3.5 h-3.5" /> روشن</>}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-bold mb-3">
          <Info className="w-4 h-4 text-primary" /> درباره برنامه
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>نسخه</span><span dir="ltr">1.0.0</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>توسعه‌دهنده</span><span>GH Team</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>هوش مصنوعی</span><span>Groq — LLaMA 3.3</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <Button variant="destructive" className="w-full gap-2 h-12" onClick={handleLogout}>
        <LogOut className="w-4 h-4" /> خروج از حساب
      </Button>
    </div>
  );
}

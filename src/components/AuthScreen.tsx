'use client';
import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirebase } from '@/lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sparkles, Loader2, Mail, Lock, Chrome, AlertCircle } from 'lucide-react';

export function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const { auth } = getFirebase();
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e: any) {
      setError('خطا در ورود با گوگل. دامنه را در Firebase مجاز کنید.');
    } finally { setLoading(false); }
  };

  const handleEmail = async () => {
    if (!email || !password) { setError('ایمیل و رمز عبور را وارد کنید.'); return; }
    setLoading(true); setError('');
    try {
      const { auth } = getFirebase();
      if (mode === 'login') await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      const msgs: Record<string, string> = {
        'auth/wrong-password': 'رمز عبور اشتباه است.',
        'auth/user-not-found': 'این ایمیل ثبت نشده.',
        'auth/email-already-in-use': 'این ایمیل قبلاً ثبت شده.',
        'auth/weak-password': 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
      };
      setError(msgs[e.code] || 'خطایی رخ داد. دوباره تلاش کنید.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            GH <span className="text-primary">Planner</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">برنامه‌ریز هوشمند روزانه</p>
        </div>

        <div className="glass p-6 space-y-4">
          {/* Google */}
          <Button variant="outline" className="w-full gap-2 h-12" onClick={handleGoogle} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
            ورود با گوگل
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">یا</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email" placeholder="ایمیل" value={email}
                onChange={e => setEmail(e.target.value)}
                className="pr-10" dir="ltr"
              />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="password" placeholder="رمز عبور" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                className="pr-10" dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <Button className="w-full h-12" onClick={handleEmail} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}
          </Button>

          <button
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
          </button>
        </div>
      </div>
    </div>
  );
}

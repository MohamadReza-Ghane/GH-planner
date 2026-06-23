"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Loader2, Mail, Lock, AlertCircle, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AuthScreen({ onGuestMode }: { onGuestMode: () => void }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);

  const handleGoogle = async () => {
    setIsLoggingIn(true); setError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } catch {
      setError('خطا در ورود با گوگل');
    } finally { setIsLoggingIn(false); }
  };

  const handleEmail = async () => {
    if (!email || !password) { setError('ایمیل و رمز عبور را وارد کنید'); return; }
    setIsLoggingIn(true); setError(null);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      const msgs: Record<string, string> = {
        'Invalid login credentials': 'ایمیل یا رمز عبور اشتباه است',
        'User already registered': 'این ایمیل قبلاً ثبت شده',
        'Password should be at least 6 characters': 'رمز عبور باید حداقل ۶ کاراکتر باشد',
      };
      setError(msgs[e.message] || 'خطایی رخ داد. دوباره تلاش کنید.');
    } finally { setIsLoggingIn(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-[28px] bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <span className="text-4xl font-black text-primary">GH</span>
          </div>
          <div>
            <h1 className="text-2xl font-black">GH Planner</h1>
            <p className="text-sm text-muted-foreground">سیستم عامل زندگی هوشمند</p>
          </div>
        </div>

        <div className="glass p-6 space-y-4 rounded-2xl border border-white/10">
          <Button variant="outline" className="w-full gap-2 h-12" onClick={handleGoogle} disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Chrome className="w-4 h-4" />}
            ورود با گوگل
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">یا</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="ایمیل" value={email}
                onChange={e => setEmail(e.target.value)} className="pr-10" dir="ltr" />
            </div>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="رمز عبور" value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                className="pr-10" dir="ltr" />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button className="w-full h-12" onClick={handleEmail} disabled={isLoggingIn}>
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : (mode === 'login' ? 'ورود' : 'ثبت‌نام')}
          </Button>

          <button className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
          </button>

          <div className="border-t border-border pt-3">
            <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={onGuestMode}>
              <Zap className="w-4 h-4" />
              ورود به عنوان مهمان
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error('useSupabase must be used within SupabaseProvider');
  return ctx;
};

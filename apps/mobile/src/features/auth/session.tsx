import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ensureSession, supabase } from '@/lib/supabase';

type SessionState = {
  userId: string | null;
  /** false, пока идёт первая попытка получить сессию. */
  isReady: boolean;
};

const SessionContext = createContext<SessionState>({ userId: null, isReady: false });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    ensureSession()
      .then((id) => {
        if (!cancelled) {
          setUserId(id);
        }
      })
      .finally(() => {
        // Экран открывается и без сессии: бесплатные гайды приедут из кеша,
        // а держать человека на заглушке из-за отсутствия сети незачем.
        if (!cancelled) {
          setIsReady(true);
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<SessionState>(() => ({ userId, isReady }), [userId, isReady]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  return useContext(SessionContext);
}

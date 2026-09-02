import { useEffect } from 'react';
import { create } from 'zustand';
import { supabase } from '@/api/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';
import { fetchProfile } from '@/api/reports';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  refreshProfile: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  setSession: (session) =>
    set({ session, user: session?.user ?? null, isLoading: false }),
  setProfile: (profile) => set({ profile }),
  refreshProfile: async () => {
    const userId = get().user?.id;
    if (!userId) return;
    const profile = await fetchProfile(userId);
    set({ profile });
  },
}));

export function useAuthListener() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      useAuthStore.getState().setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => useAuthStore.getState().setProfile(p));
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => useAuthStore.getState().setProfile(p));
      } else {
        useAuthStore.getState().setProfile(null);
      }
    });

    return () => subscription.subscription.unsubscribe();
  }, []);
}

export function useAuth() {
  const { session, user, profile, isLoading, refreshProfile } = useAuthStore();
  return {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!session,
    refreshProfile,
  };
}

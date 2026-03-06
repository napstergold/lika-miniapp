import { create } from 'zustand';
import type { Profile, Stars, Settings } from '../types';

interface AppState {
  // User data
  telegramId: number | null;
  profile: Profile | null;
  stars: Stars | null;
  settings: Settings | null;

  // UI state
  currentTab: 'profile' | 'stars' | 'settings' | 'games' | 'saved';
  isLoading: boolean;

  // Actions
  setTelegramId: (id: number) => void;
  setProfile: (profile: Profile) => void;
  setStars: (stars: Stars) => void;
  setSettings: (settings: Settings) => void;
  setCurrentTab: (tab: AppState['currentTab']) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  telegramId: null,
  profile: null,
  stars: null,
  settings: null,
  currentTab: 'profile',
  isLoading: false,

  // Actions
  setTelegramId: (id) => set({ telegramId: id }),
  setProfile: (profile) => set({ profile }),
  setStars: (stars) => set({ stars }),
  setSettings: (settings) => set({ settings }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

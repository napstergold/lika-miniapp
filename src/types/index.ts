// User and profile types
export interface User {
  name: string;
  telegram_id: number;
  avatar: string | null;
}

export interface Streak {
  current: number;
  max: number;
}

export interface Stats {
  messages: number;
  intimacy: number;
  days_with_lika: number;
}

export interface CalendarDay {
  date: string; // ISO date
  has_activity: boolean;
  message_count: number;
}

export interface Profile {
  user: User;
  streak: Streak;
  stats: Stats;
  calendar: CalendarDay[];
}

// Stars and gamification
export interface Stars {
  stars: number;
  daily: {
    claimed: boolean;
    amount: number;
  };
  referrals: {
    count: number;
    bonus_per_referral: number;
    code: string;
  };
}

// Settings
export interface Settings {
  language: 'en' | 'ru';
  relationship_goal: 'friend' | 'romantic' | 'flirty' | 'mentor' | 'casual';
  companion_style: 'flirty' | 'warm' | 'intellectual' | 'mix';
  tier: 'free' | 'pro';
  daily_checkins_enabled: boolean;
  birthday: string | null;
}

// Games
export interface Game {
  id: string;
  name_en: string;
  name_ru: string;
  emoji: string;
  description_en: string;
  description_ru: string;
}

// Saved content
export interface SavedContent {
  id: number;
  content_type: 'photo' | 'story' | 'moment';
  content: string;
  created_at: string;
}

// API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

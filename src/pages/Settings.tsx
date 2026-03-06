import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  Users,
  Smile,
  Cake,
  Bell,
  Globe,
  ChevronRight,
  Crown,
} from 'lucide-react';
import { apiClient } from '../api/client';
import { useStore } from '../stores/useStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import type { Settings as SettingsType } from '../types';

export function Settings() {
  const telegramId = useStore((state) => state.telegramId);
  const setSettings = useStore((state) => state.setSettings);
  const settings = useStore((state) => state.settings);
  const { hapticFeedback } = useTelegramWebApp();
  const queryClient = useQueryClient();

  const lang = settings?.language || 'en';

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings', telegramId],
    queryFn: () => apiClient.getSettings(telegramId!),
    enabled: !!telegramId,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<Omit<SettingsType, 'tier' | 'birthday'>>) =>
      apiClient.updateSettings(telegramId!, updates),
    onSuccess: () => {
      hapticFeedback('success');
      queryClient.invalidateQueries({ queryKey: ['settings', telegramId] });
    },
  });

  if (isLoading || !settingsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  const goalLabels = {
    friend: lang === 'ru' ? 'Друг' : 'Friend',
    romantic: lang === 'ru' ? 'Романтика' : 'Romantic',
    flirty: lang === 'ru' ? 'Флирт' : 'Flirty',
    mentor: lang === 'ru' ? 'Наставник' : 'Mentor',
    casual: lang === 'ru' ? 'Просто общение' : 'Casual',
  };

  const styleLabels = {
    flirty: lang === 'ru' ? 'Игривая' : 'Playful',
    warm: lang === 'ru' ? 'Тёплая' : 'Warm',
    intellectual: lang === 'ru' ? 'Интеллектуальная' : 'Intellectual',
    mix: lang === 'ru' ? 'Смешанная' : 'Mix',
  };

  const settingsItems = [
    {
      icon: Crown,
      iconColor: 'text-yellow-500',
      label: lang === 'ru' ? 'Подписка' : 'Subscription',
      value: settingsData.tier === 'pro' ? (lang === 'ru' ? 'Pro ✨' : 'Pro ✨') : 'Free',
      onClick: () => {
        hapticFeedback('light');
        alert(lang === 'ru' ? 'Скоро! Pro подписка откроет больше функций 🚀' : 'Coming soon! Pro subscription unlocks more features 🚀');
      },
    },
    {
      icon: Users,
      iconColor: 'text-blue-500',
      label: lang === 'ru' ? 'Пригласить друзей' : 'Invite Friends',
      value: '',
      onClick: () => {
        hapticFeedback('light');
        const referralLink = `https://t.me/heylika_bot?start=ref_${telegramId}`;
        const text = lang === 'ru' 
          ? `Попробуй Lika — AI-подругу в Telegram! 💛\n${referralLink}`
          : `Try Lika — AI companion in Telegram! 💛\n${referralLink}`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    {
      icon: Heart,
      iconColor: 'text-red-500',
      label: lang === 'ru' ? 'Чего ты ищешь' : 'What You Are Looking For',
      value: goalLabels[settingsData.relationship_goal],
      onClick: () => {
        hapticFeedback('light');
        alert(lang === 'ru' ? 'Используй команду /settings в боте для изменения' : 'Use /settings command in bot to change');
      },
    },
    {
      icon: Smile,
      iconColor: 'text-purple-500',
      label: lang === 'ru' ? 'Личность' : 'Personality',
      value: styleLabels[settingsData.companion_style],
      onClick: () => {
        hapticFeedback('light');
        alert(lang === 'ru' ? 'Используй команду /settings в боте для изменения' : 'Use /settings command in bot to change');
      },
    },
    {
      icon: Cake,
      iconColor: 'text-pink-500',
      label: lang === 'ru' ? 'День рождения' : 'Birthday',
      value: settingsData.birthday || (lang === 'ru' ? 'Не указано' : 'Not set'),
      onClick: () => {
        hapticFeedback('light');
        alert(lang === 'ru' ? 'Используй команду /settings в боте для изменения' : 'Use /settings command in bot to change');
      },
    },
    {
      icon: Bell,
      iconColor: 'text-orange-500',
      label: lang === 'ru' ? 'Уведомления' : 'Notifications',
      value: settingsData.daily_checkins_enabled
        ? lang === 'ru'
          ? 'Включены'
          : 'Enabled'
        : lang === 'ru'
        ? 'Выключены'
        : 'Disabled',
      onClick: () => {
        const newValue = !settingsData.daily_checkins_enabled;
        updateMutation.mutate({ daily_checkins_enabled: newValue });
      },
    },
    {
      icon: Globe,
      iconColor: 'text-green-500',
      label: lang === 'ru' ? 'Язык' : 'Language',
      value: settingsData.language === 'ru' ? 'Русский 🇷🇺' : 'English 🇬🇧',
      onClick: () => {
        const newLang = settingsData.language === 'ru' ? 'en' : 'ru';
        updateMutation.mutate({ language: newLang });
        setSettings({ ...settingsData, language: newLang });
      },
    },
  ];

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {lang === 'ru' ? 'Настройки' : 'Settings'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {lang === 'ru' ? 'Персонализируй Lika под себя' : 'Customize Lika for you'}
        </p>
      </div>

      {/* Settings List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => {
                hapticFeedback('light');
                item.onClick();
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <Icon size={24} className={item.iconColor} />
                <span className="font-medium dark:text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.value}</span>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
        Lika Mini App v1.0.0
        <br />
        Made with 💛 by @heylika_bot
      </div>
    </div>
  );
}

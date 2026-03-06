import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, MessageCircle, Heart, Calendar } from 'lucide-react';
import { apiClient } from '../api/client';
import { useStore } from '../stores/useStore';
import { StreakCalendar } from '../components/StreakCalendar';

export function Profile() {
  const telegramId = useStore((state) => state.telegramId);
  const setProfile = useStore((state) => state.setProfile);
  const settings = useStore((state) => state.settings);

  const lang = settings?.language || 'en';

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', telegramId],
    queryFn: () => apiClient.getProfile(telegramId!),
    enabled: !!telegramId,
  });

  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }
  }, [profile, setProfile]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  const { user, streak, stats, calendar } = profile;

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-white dark:border-gray-800 shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name[0].toUpperCase()}
          </div>
        )}
        <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame size={32} />
          <span className="text-4xl font-bold">{streak.current}</span>
        </div>
        <p className="text-sm opacity-90">
          {lang === 'ru' ? `дней подряд` : `day streak`}
        </p>
        {streak.max > streak.current && (
          <p className="text-xs opacity-75 mt-1">
            {lang === 'ru' ? `Максимум: ${streak.max}` : `Max: ${streak.max}`}
          </p>
        )}
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {lang === 'ru' ? 'Последние 30 дней' : 'Last 30 Days'}
        </h2>
        <StreakCalendar calendar={calendar} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={20} className="text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru' ? 'Сообщений' : 'Messages'}
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{stats.messages}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Heart size={20} className="text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru' ? 'Близость' : 'Intimacy'}
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{stats.intimacy}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru' ? 'Макс серия' : 'Max Streak'}
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{streak.max}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru' ? 'Дней вместе' : 'Days Together'}
            </span>
          </div>
          <p className="text-2xl font-bold dark:text-white">{stats.days_with_lika}</p>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Gift, Users } from 'lucide-react';
import { apiClient } from '../api/client';
import { useStore } from '../stores/useStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export function Stars() {
  const telegramId = useStore((state) => state.telegramId);
  const setStars = useStore((state) => state.setStars);
  const settings = useStore((state) => state.settings);
  const { hapticFeedback, showAlert } = useTelegramWebApp();
  const queryClient = useQueryClient();

  const lang = settings?.language || 'en';

  const { data: starsData, isLoading } = useQuery({
    queryKey: ['stars', telegramId],
    queryFn: () => apiClient.getStars(telegramId!),
    enabled: !!telegramId,
  });

  const claimMutation = useMutation({
    mutationFn: () => apiClient.claimDailyStars(telegramId!),
    onSuccess: () => {
      hapticFeedback('success');
      queryClient.invalidateQueries({ queryKey: ['stars', telegramId] });
      showAlert(lang === 'ru' ? '✨ Получено 10 звёзд!' : '✨ Claimed 10 stars!');
    },
    onError: (error: Error) => {
      hapticFeedback('error');
      showAlert(error.message);
    },
  });

  useEffect(() => {
    if (starsData) {
      setStars(starsData);
    }
  }, [starsData, setStars]);

  if (isLoading || !starsData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  const { stars, daily, referrals } = starsData;

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {lang === 'ru' ? 'Звёзды' : 'Stars'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {lang === 'ru'
            ? 'Зарабатывай звёзды и обменивай на призы'
            : 'Earn stars and exchange for rewards'}
        </p>
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 text-white text-center shadow-xl">
        <Star size={48} className="mx-auto mb-3" fill="white" />
        <div className="text-6xl font-bold mb-2">{stars}</div>
        <p className="text-sm opacity-90">{lang === 'ru' ? 'Всего звёзд' : 'Total Stars'}</p>
      </div>

      {/* Daily Claim */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg dark:text-white">
              {lang === 'ru' ? 'Ежедневные звёзды' : 'Daily Stars'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru' ? 'Получай 10 звёзд каждый день' : 'Get 10 stars every day'}
            </p>
          </div>
          <Gift size={32} className="text-blue-500" />
        </div>

        <button
          onClick={() => claimMutation.mutate()}
          disabled={daily.claimed || claimMutation.isPending}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            daily.claimed
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
          }`}
        >
          {daily.claimed
            ? lang === 'ru'
              ? '✓ Получено сегодня'
              : '✓ Claimed Today'
            : lang === 'ru'
            ? `Получить ${daily.amount} звёзд`
            : `Claim ${daily.amount} Stars`}
        </button>
      </div>

      {/* Referrals */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg dark:text-white">
              {lang === 'ru' ? 'Приглашай друзей' : 'Invite Friends'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lang === 'ru'
                ? `+${referrals.bonus_per_referral} звёзд за друга`
                : `+${referrals.bonus_per_referral} stars per friend`}
            </p>
          </div>
          <Users size={32} className="text-purple-500" />
        </div>

        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <span className="text-gray-700 dark:text-gray-300">
            {lang === 'ru' ? 'Приглашено друзей' : 'Friends Invited'}
          </span>
          <span className="text-xl font-bold dark:text-white">{referrals.count}</span>
        </div>

        <button className="w-full mt-4 py-3 rounded-xl font-semibold bg-purple-600 text-white hover:bg-purple-700 active:scale-95 transition-all">
          {lang === 'ru' ? 'Пригласить друга' : 'Invite a Friend'}
        </button>
      </div>

      {/* Exchange (placeholder) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg dark:text-white mb-4">
          {lang === 'ru' ? 'Обмен звёзд' : 'Exchange Stars'}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <span className="text-gray-700 dark:text-gray-300">
              {lang === 'ru' ? '1 месяц Pro' : '1 Month Pro'}
            </span>
            <span className="font-bold text-blue-600">100 ⭐</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl opacity-50">
            <span className="text-gray-700 dark:text-gray-300">
              {lang === 'ru' ? 'Специальный контент' : 'Special Content'}
            </span>
            <span className="font-bold text-purple-600">50 ⭐</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {lang === 'ru' ? 'Скоро больше наград!' : 'More rewards coming soon!'}
        </p>
      </div>
    </div>
  );
}

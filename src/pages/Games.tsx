import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useStore } from '../stores/useStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

export function Games() {
  const settings = useStore((state) => state.settings);
  const { hapticFeedback, showAlert } = useTelegramWebApp();

  const lang = settings?.language || 'en';

  const { data: games, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: () => apiClient.getGames(),
  });

  const handleGameClick = (_gameId: string) => {
    hapticFeedback('light');
    // Open chat with pre-filled /game command
    const webApp = (window as any).Telegram?.WebApp;
    if (webApp) {
      webApp.openTelegramLink('https://t.me/heylika_bot?text=/game');
    } else {
      showAlert(
        lang === 'ru'
          ? 'Игра откроется в чате с Lika! Используй /game'
          : 'Game will open in Lika chat! Use /game'
      );
    }
  };

  if (isLoading || !games) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {lang === 'ru' ? 'Игры' : 'Games'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {lang === 'ru' ? 'Играй с Lika!' : 'Play with Lika!'}
        </p>
      </div>

      {/* Games Grid */}
      <div className="space-y-3">
        {games.map((game) => {
          const name = lang === 'ru' ? game.name_ru : game.name_en;
          const description = lang === 'ru' ? game.description_ru : game.description_en;

          return (
            <button
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className="w-full bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center gap-4"
            >
              <div className="text-4xl">{game.emoji}</div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg dark:text-white">{name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
          {lang === 'ru'
            ? '💡 Игры доступны в чате с Lika. Используй команду /game'
            : '💡 Games are available in Lika chat. Use /game command'}
        </p>
      </div>
    </div>
  );
}

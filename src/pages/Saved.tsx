import { useQuery } from '@tanstack/react-query';
import { Image, FileText, Sparkles } from 'lucide-react';
import { apiClient } from '../api/client';
import { useStore } from '../stores/useStore';

export function Saved() {
  const telegramId = useStore((state) => state.telegramId);
  const settings = useStore((state) => state.settings);

  const lang = settings?.language || 'en';

  const { data: savedData, isLoading } = useQuery({
    queryKey: ['saved', telegramId],
    queryFn: () => apiClient.getSavedContent(telegramId!),
    enabled: !!telegramId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">{lang === 'ru' ? 'Загрузка...' : 'Loading...'}</div>
      </div>
    );
  }

  const content = savedData?.content || [];

  if (content.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <Sparkles size={64} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {lang === 'ru' ? 'Пока пусто' : 'Nothing Saved Yet'}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {lang === 'ru'
            ? 'Сохранённые фотографии и истории появятся здесь'
            : 'Saved photos and stories will appear here'}
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold dark:text-white mb-2">
          {lang === 'ru' ? 'Сохранённое' : 'Saved'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {lang === 'ru'
            ? `${content.length} элементов`
            : `${content.length} items`}
        </p>
      </div>

      {/* Content Grid */}
      <div className="space-y-3">
        {content.map((item) => {
          const Icon = item.content_type === 'photo' ? Image : item.content_type === 'story' ? FileText : Sparkles;
          const date = new Date(item.created_at).toLocaleDateString(
            lang === 'ru' ? 'ru-RU' : 'en-US',
            { month: 'short', day: 'numeric' }
          );

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex items-start gap-4"
            >
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <Icon size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {item.content}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

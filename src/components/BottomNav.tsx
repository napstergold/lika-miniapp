import { User, Star, Settings, Gamepad2, Bookmark } from 'lucide-react';
import { useStore } from '../stores/useStore';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

const tabs = [
  { id: 'profile', icon: User, label_en: 'Profile', label_ru: 'Профиль' },
  { id: 'stars', icon: Star, label_en: 'Stars', label_ru: 'Звёзды' },
  { id: 'settings', icon: Settings, label_en: 'Settings', label_ru: 'Настройки' },
  { id: 'games', icon: Gamepad2, label_en: 'Games', label_ru: 'Игры' },
  { id: 'saved', icon: Bookmark, label_en: 'Saved', label_ru: 'Сохранено' },
] as const;

export function BottomNav() {
  const currentTab = useStore((state) => state.currentTab);
  const setCurrentTab = useStore((state) => state.setCurrentTab);
  const settings = useStore((state) => state.settings);
  const { hapticFeedback } = useTelegramWebApp();

  const lang = settings?.language || 'en';

  const handleTabClick = (tabId: typeof currentTab) => {
    if (tabId !== currentTab) {
      hapticFeedback('light');
      setCurrentTab(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          const label = lang === 'ru' ? tab.label_ru : tab.label_en;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as typeof currentTab)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

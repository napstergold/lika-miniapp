import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { useStore } from './stores/useStore';
import { BottomNav } from './components/BottomNav';
import { Profile } from './pages/Profile';
import { Stars } from './pages/Stars';
import { Settings } from './pages/Settings';
import { Games } from './pages/Games';
import { Saved } from './pages/Saved';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { user, isReady } = useTelegramWebApp();
  const currentTab = useStore((state) => state.currentTab);
  const setTelegramId = useStore((state) => state.setTelegramId);
  const setSettings = useStore((state) => state.setSettings);

  useEffect(() => {
    if (user) {
      setTelegramId(user.id);
      
      // Set initial language from Telegram
      const lang = user.language_code === 'ru' ? 'ru' : 'en';
      setSettings({ language: lang } as any);
    } else if (isReady) {
      // Development fallback: use a test user
      console.warn('Telegram user not found, using fallback for testing');
      // Try to get user from URL params (for testing)
      const urlParams = new URLSearchParams(window.location.search);
      const testId = urlParams.get('user_id') || '36078867'; // Default to Bogdan
      setTelegramId(Number(testId));
      setSettings({ language: 'en' } as any);
    }
  }, [user, isReady, setTelegramId, setSettings]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="h-screen overflow-y-auto">
        {currentTab === 'profile' && <Profile />}
        {currentTab === 'stars' && <Stars />}
        {currentTab === 'settings' && <Settings />}
        {currentTab === 'games' && <Games />}
        {currentTab === 'saved' && <Saved />}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

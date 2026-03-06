import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function useTelegramWebApp() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    WebApp.ready();
    WebApp.expand();

    console.log('Telegram WebApp initialized:', {
      platform: WebApp.platform,
      version: WebApp.version,
      initDataUnsafe: WebApp.initDataUnsafe,
      user: WebApp.initDataUnsafe.user,
    });

    // Get user data
    const initDataUnsafe = WebApp.initDataUnsafe;
    if (initDataUnsafe.user) {
      setUser(initDataUnsafe.user as TelegramUser);
      console.log('User set:', initDataUnsafe.user);
    } else {
      console.warn('No user data from Telegram WebApp');
    }

    // Set theme
    if (WebApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    setIsReady(true);

    // Cleanup
    return () => {
      // Nothing to cleanup for now
    };
  }, []);

  const openLink = (url: string) => {
    WebApp.openLink(url);
  };

  const close = () => {
    WebApp.close();
  };

  const showAlert = (message: string) => {
    WebApp.showAlert(message);
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    WebApp.showConfirm(message, callback);
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light') => {
    if (type === 'success' || type === 'error' || type === 'warning') {
      WebApp.HapticFeedback.notificationOccurred(type);
    } else {
      WebApp.HapticFeedback.impactOccurred(type === 'light' ? 'light' : type === 'medium' ? 'medium' : 'heavy');
    }
  };

  return {
    user,
    isReady,
    webApp: WebApp,
    openLink,
    close,
    showAlert,
    showConfirm,
    hapticFeedback,
    themeParams: WebApp.themeParams,
    colorScheme: WebApp.colorScheme,
  };
}

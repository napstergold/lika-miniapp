import type { Profile, Stars, Settings, Game, SavedContent } from '../types';

// API base URL - will use env variable in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Profile endpoints
  async getProfile(telegramId: number): Promise<Profile> {
    return this.request<Profile>(`/api/profile/${telegramId}`);
  }

  // Stars endpoints
  async getStars(telegramId: number): Promise<Stars> {
    return this.request<Stars>(`/api/stars/${telegramId}`);
  }

  async claimDailyStars(telegramId: number): Promise<{ success: boolean; stars: number }> {
    return this.request(`/api/stars/claim-daily`, {
      method: 'POST',
      body: JSON.stringify({ telegram_id: telegramId }),
    });
  }

  // Settings endpoints
  async getSettings(telegramId: number): Promise<Settings> {
    return this.request<Settings>(`/api/settings/${telegramId}`);
  }

  async updateSettings(
    telegramId: number,
    settings: Partial<Omit<Settings, 'tier' | 'birthday'>>
  ): Promise<{ success: boolean }> {
    return this.request(`/api/settings/${telegramId}`, {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Games endpoints
  async getGames(): Promise<Game[]> {
    return this.request<Game[]>('/api/games');
  }

  // Saved content endpoints
  async getSavedContent(
    telegramId: number,
    contentType?: 'photo' | 'story' | 'moment'
  ): Promise<{ content: SavedContent[] }> {
    const query = contentType ? `?content_type=${contentType}` : '';
    return this.request<{ content: SavedContent[] }>(`/api/saved/${telegramId}${query}`);
  }

  async saveContent(
    telegramId: number,
    contentType: 'photo' | 'story' | 'moment',
    content: string
  ): Promise<{ success: boolean; id: number }> {
    return this.request('/api/saved', {
      method: 'POST',
      body: JSON.stringify({
        telegram_id: telegramId,
        content_type: contentType,
        content,
      }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

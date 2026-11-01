export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'th' | 'en' | 'zh';

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  hours: number;
  compressor?: boolean;
  baseWatts?: number;
  outsideTemp?: number;
  tempMultiplier?: number;
  tempReason?: string;
  category?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'guest';
  savedCount?: number;
}

export interface AIModelSuggestion {
  name: string;
  watt: number;
  hours: number;
  compressor?: boolean;
  category?: string;
}

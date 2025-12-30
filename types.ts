
export interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  healthScore: number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  data: NutritionData;
  image: string | null;
}

export interface UserStats {
  streak: number;
  freezeCount: number;
  lastActivityTimestamp: number;
  celebratedBadgeNames: string[];
  streakHistory: Record<string, 'streak' | 'freeze' | 'broken'>;
  xp: number;
  level: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalScans: number;
}

export interface User {
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  friends: string[];
  pendingRequests: string[];
  sentRequests: string[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export type AuthMode = 'login' | 'signup' | 'username-setup' | 'verify-email';

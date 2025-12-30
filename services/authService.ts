
import { User, UserStats } from '../types.ts';

const USERS_KEY = 'calippo_db_users';
const CURRENT_USER_KEY = 'calippo_current_user';

const getDB = (): Record<string, User> => JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
const saveDB = (db: Record<string, User>) => localStorage.setItem(USERS_KEY, JSON.stringify(db));

export const authService = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(CURRENT_USER_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string, pass: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    const db = getDB();
    const user = Object.values(db).find(u => u.email === email);
    if (!user) throw new Error('User not found.');
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, pass: string): Promise<User> => {
    const db = getDB();
    if (Object.values(db).some(u => u.email === email)) throw new Error('Email already exists.');
    
    const newUser: User = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      username: '', // Must be set in next step
      createdAt: Date.now(),
      friends: [],
      pendingRequests: [],
      sentRequests: []
    };
    
    db[newUser.uid] = newUser;
    saveDB(db);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  checkUsername: async (username: string): Promise<boolean> => {
    const db = getDB();
    return !Object.values(db).some(u => u.username === username.toLowerCase());
  },

  updateUsername: async (uid: string, username: string): Promise<User> => {
    const db = getDB();
    const user = db[uid];
    if (!user) throw new Error('User not found');
    user.username = username.toLowerCase();
    db[uid] = user;
    saveDB(db);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

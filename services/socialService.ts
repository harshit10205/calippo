
import { User } from '../types.ts';

const USERS_KEY = 'calippo_db_users';
const REQS_KEY = 'calippo_db_requests';

interface FriendRequest {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

const getDB = (): Record<string, User> => JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
const saveDB = (db: Record<string, User>) => localStorage.setItem(USERS_KEY, JSON.stringify(db));

export const socialService = {
  searchUsers: async (query: string): Promise<User[]> => {
    if (!query) return [];
    const db = getDB();
    return Object.values(db).filter(u => 
      u.username.includes(query.toLowerCase()) || 
      (u.displayName && u.displayName.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5);
  },

  sendRequest: async (fromUid: string, toUid: string) => {
    const db = getDB();
    const from = db[fromUid];
    const to = db[toUid];
    if (!from || !to) return;

    if (!from.sentRequests.includes(toUid)) {
      from.sentRequests.push(toUid);
      to.pendingRequests.push(fromUid);
      saveDB(db);
    }
  },

  handleRequest: async (reqUid: string, myUid: string, action: 'accept' | 'reject') => {
    const db = getDB();
    const me = db[myUid];
    const requester = db[reqUid];
    if (!me || !requester) return;

    me.pendingRequests = me.pendingRequests.filter(id => id !== reqUid);
    requester.sentRequests = requester.sentRequests.filter(id => id !== myUid);

    if (action === 'accept') {
      if (!me.friends.includes(reqUid)) me.friends.push(reqUid);
      if (!requester.friends.includes(myUid)) requester.friends.push(myUid);
    }

    saveDB(db);
  },

  getFriends: async (uids: string[]): Promise<User[]> => {
    const db = getDB();
    return uids.map(id => db[id]).filter(Boolean);
  }
};

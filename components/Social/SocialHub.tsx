
import React, { useState, useEffect } from 'react';
import { User } from '../../types.ts';
import { socialService } from '../../services/socialService.ts';

interface SocialHubProps {
  currentUser: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({ currentUser, onClose, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'requests'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSocialData();
  }, [currentUser]);

  const loadSocialData = async () => {
    setLoading(true);
    const [friends, pending] = await Promise.all([
      socialService.getFriends(currentUser.friends),
      socialService.getFriends(currentUser.pendingRequests)
    ]);
    setFriendsList(friends);
    setPendingUsers(pending);
    setLoading(false);
  };

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    const results = await socialService.searchUsers(val);
    setSearchResults(results.filter(u => u.uid !== currentUser.uid));
  };

  const sendFriendRequest = async (toUid: string) => {
    await socialService.sendRequest(currentUser.uid, toUid);
    // Optimistic update local for visual feedback
    const updatedUser = { ...currentUser, sentRequests: [...currentUser.sentRequests, toUid] };
    onUpdateUser(updatedUser);
  };

  const handleRequest = async (requesterUid: string, action: 'accept' | 'reject') => {
    await socialService.handleRequest(requesterUid, currentUser.uid, action);
    // Reload local data
    const friends = [...currentUser.friends];
    if (action === 'accept') friends.push(requesterUid);
    const updatedUser = { 
      ...currentUser, 
      pendingRequests: currentUser.pendingRequests.filter(id => id !== requesterUid),
      friends
    };
    onUpdateUser(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-[160] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl mx-auto bg-white dark:bg-gray-950 rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 overflow-hidden h-[85vh] flex flex-col">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>

        <div className="flex justify-between items-center mb-8 pt-4">
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">Social Hub</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400">
             <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-2xl">
          {(['friends', 'search', 'requests'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab 
                ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {tab === 'requests' && currentUser.pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white border-2 border-white dark:border-gray-950">
                  {currentUser.pendingRequests.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="relative">
                <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by username..."
                  className="w-full bg-gray-50 dark:bg-gray-900 p-5 pl-14 rounded-3xl outline-none focus:ring-2 ring-green-500/20 dark:text-white"
                />
              </div>
              <div className="space-y-3">
                {searchResults.map(user => (
                  <UserRow 
                    key={user.uid} 
                    user={user} 
                    action={
                      currentUser.friends.includes(user.uid) ? 'friend' :
                      currentUser.sentRequests.includes(user.uid) ? 'sent' :
                      'add'
                    }
                    onAction={() => sendFriendRequest(user.uid)}
                  />
                ))}
                {searchQuery && searchResults.length === 0 && (
                  <p className="text-center py-8 text-gray-400 text-sm">No ninjas found with that name.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-3">
              {friendsList.length > 0 ? friendsList.map(user => (
                <UserRow key={user.uid} user={user} action="friend" />
              )) : (
                <div className="text-center py-20 space-y-4">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto text-gray-300">
                     <i className="fas fa-user-friends text-3xl"></i>
                   </div>
                   <p className="text-gray-400 text-sm">You haven't added any fitness buddies yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-3">
              {pendingUsers.length > 0 ? pendingUsers.map(user => (
                <UserRow 
                  key={user.uid} 
                  user={user} 
                  action="request" 
                  onAction={(action) => handleRequest(user.uid, action as 'accept' | 'reject')}
                />
              )) : (
                <p className="text-center py-20 text-gray-400 text-sm">No incoming requests.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserRow: React.FC<{ 
  user: User, 
  action: 'add' | 'sent' | 'friend' | 'request',
  onAction?: (action: string) => void 
}> = ({ user, action, onAction }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-3xl flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-2 duration-300 border border-transparent hover:border-green-100 dark:hover:border-green-900/40 transition-all">
       <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xl shadow-lg shadow-green-200 dark:shadow-none">
          {user.photoURL ? <img src={user.photoURL} className="w-full h-full object-cover" /> : <i className="fas fa-user-ninja"></i>}
       </div>
       <div className="flex-1 min-w-0">
          <h4 className="font-black text-gray-900 dark:text-white truncate">@{user.username}</h4>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Ninja since {new Date(user.createdAt).getFullYear()}</p>
       </div>
       
       {action === 'add' && (
         <button onClick={() => onAction?.('add')} className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-green-100 dark:shadow-none active:scale-90 transition-transform">
            <i className="fas fa-plus"></i>
         </button>
       )}
       {action === 'sent' && (
         <div className="text-xs font-black text-gray-400 uppercase tracking-widest pr-2">Sent</div>
       )}
       {action === 'friend' && (
         <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
            <i className="fas fa-check"></i>
         </div>
       )}
       {action === 'request' && (
         <div className="flex space-x-2">
           <button onClick={() => onAction?.('accept')} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 dark:shadow-none">Accept</button>
           <button onClick={() => onAction?.('reject')} className="bg-gray-200 dark:bg-gray-800 text-gray-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">Ignore</button>
         </div>
       )}
    </div>
  );
};

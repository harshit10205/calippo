
import React from 'react';

type Tab = 'home' | 'progress' | 'friends' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab, icon: string, label: string }[] = [
    { id: 'home', icon: 'fa-house-chimney', label: 'Home' },
    { id: 'progress', icon: 'fa-chart-simple', label: 'Stats' },
    { id: 'friends', icon: 'fa-user-group', label: 'Friends' },
    { id: 'profile', icon: 'fa-user-ninja', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-t border-gray-100 dark:border-gray-800 px-6 py-4 z-[100] pb-8 md:pb-4">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center space-y-1 relative group"
            >
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isActive ? 'bg-green-50 dark:bg-green-900/20 text-green-600 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}
              `}>
                <i className={`fas ${tab.icon} text-xl`}></i>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-2 w-4 h-1 bg-green-600 rounded-full animate-in zoom-in duration-300"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

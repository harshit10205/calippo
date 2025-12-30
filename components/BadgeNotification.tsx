
import React, { useEffect } from 'react';
import { Achievement, TIER_CONFIG } from '../constants.ts';

interface BadgeNotificationProps {
  badge: Achievement;
  onClose: () => void;
}

export const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badge, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-3rem)] max-w-sm animate-in slide-in-from-top-12 duration-500">
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-4 shadow-2xl border border-green-100 dark:border-green-900/30 flex items-center space-x-4">
        {/* Badge Icon Mini */}
        <div className={`w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl bg-gradient-to-br ${badge.color} shadow-lg shadow-green-100 dark:shadow-none`}>
          <i className={`fas ${badge.icon}`}></i>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
              Achievement Unlocked!
            </span>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
          <h4 className="text-lg font-black text-gray-900 dark:text-white truncate">
            {badge.name}
          </h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase">
            {TIER_CONFIG[badge.tier].label} • +{badge.xp} XP
          </p>
        </div>
      </div>
    </div>
  );
};

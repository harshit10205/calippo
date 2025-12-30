
import React, { useState, useEffect } from 'react';

interface StreakIconProps {
  days: number;
  isFrozen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const StreakIcon: React.FC<StreakIconProps> = ({ days, isFrozen, size = 'sm', onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Trigger flip animation when days increase
    if (days > 0) {
      setIsFlipped(true);
      const timer = setTimeout(() => setIsFlipped(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [days]);

  const getTierData = (d: number) => {
    if (d >= 365) return { color: 'from-purple-600 via-yellow-500 to-purple-900', label: 'Mythic', effects: 'shadow-[0_0_30px_rgba(147,51,234,0.6)]' };
    if (d >= 180) return { color: 'from-cyan-300 to-blue-500', label: 'Diamond', effects: 'shadow-[0_0_25px_rgba(34,211,238,0.5)] ring-4 ring-cyan-400/20' };
    if (d >= 90) return { color: 'from-blue-400 via-yellow-200 to-blue-600', label: 'Ultra', effects: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]' };
    if (d >= 30) return { color: 'from-yellow-300 via-yellow-500 to-yellow-600', label: 'Gold', effects: 'shadow-[0_0_15px_rgba(234,179,8,0.4)]' };
    if (d >= 7) return { color: 'from-orange-500 to-red-600', label: 'Pro', effects: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]' };
    return { color: 'from-yellow-400 to-orange-500', label: 'Rookie', effects: '' };
  };

  const tier = getTierData(days);
  const sizeClass = size === 'lg' ? 'w-32 h-32' : size === 'md' ? 'w-20 h-20' : 'w-10 h-10';
  const iconSize = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-sm';

  return (
    <div 
      className={`relative cursor-pointer group coin-flip ${sizeClass} ${isFlipped ? 'flipped' : ''}`}
      onClick={onClick}
    >
      <div className="coin-inner w-full h-full">
        {/* Front */}
        <div className={`coin-front bg-gradient-to-br ${tier.color} border-2 border-white/20 shadow-xl overflow-hidden`}>
           <div className={`fire-aura absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-t from-white to-transparent`}></div>
           <i className={`fas fa-fire text-white ${iconSize} relative z-10 drop-shadow-md`}></i>
           {days >= 180 && <div className="absolute inset-0 sweep-reflection"></div>}
        </div>

        {/* Back (Flip reveal) */}
        <div className={`coin-back bg-white dark:bg-gray-800 border-2 border-green-500 shadow-xl`}>
          <div className="flex flex-col items-center">
            <span className={`font-black text-green-600 ${size === 'lg' ? 'text-4xl' : 'text-xs'}`}>{days}</span>
            {size !== 'sm' && <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Days</span>}
          </div>
        </div>
      </div>

      {/* Freeze Layer */}
      {isFrozen && (
        <div className="absolute inset-[-4px] z-20 pointer-events-none overflow-hidden rounded-full animate-frost">
          <div className="w-full h-full bg-blue-400/30 backdrop-blur-[6px] ice-frost border-2 border-blue-200/50 flex items-center justify-center">
             <i className="fas fa-snowflake text-white/80 text-xl animate-pulse"></i>
          </div>
        </div>
      )}

      {/* Tier Aura for Higher Streaks */}
      {days >= 30 && (
         <div className={`absolute inset-[-8px] -z-10 rounded-full blur-xl opacity-30 animate-pulse bg-gradient-to-tr ${tier.color}`}></div>
      )}
    </div>
  );
};

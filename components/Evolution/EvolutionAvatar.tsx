
import React from 'react';
import { EVOLUTION_LEVELS, AnimalLevel } from '../../constants/evolutionLevels.ts';

interface EvolutionAvatarProps {
  level: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const EvolutionAvatar: React.FC<EvolutionAvatarProps> = ({ level, size = 'md', showLabel = false }) => {
  const data = EVOLUTION_LEVELS[level - 1] || EVOLUTION_LEVELS[0];
  
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-20 h-20 text-3xl',
    lg: 'w-32 h-32 text-5xl',
    xl: 'w-48 h-48 text-7xl'
  };

  const getTierStyles = (type: AnimalLevel['type']) => {
    switch(type) {
      case 'mythic': return 'from-purple-600 via-red-500 to-black shadow-[0_0_40px_rgba(147,51,234,0.6)] animate-pulse border-purple-400 fire-aura';
      case 'legendary': return 'from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(34,211,238,0.5)] border-cyan-200 sweep-reflection';
      case 'apex': return 'from-yellow-400 to-orange-600 shadow-xl border-yellow-200';
      case 'strong': return 'from-green-500 to-green-700 shadow-lg border-green-300';
      default: return 'from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 border-gray-100';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`
        relative flex items-center justify-center rounded-[2.5rem] bg-gradient-to-br border-4 transition-all duration-500
        ${sizeClasses[size]}
        ${getTierStyles(data.type)}
      `}>
        <i className={`fas ${data.icon} text-white drop-shadow-lg ${data.level > 150 ? 'animate-bounce-slow' : ''}`}></i>
        
        {/* Tier Specific Overlays */}
        {data.type === 'mythic' && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest animate-bounce">
            Mythic
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="mt-4 text-center">
          <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Lv. {data.level}</p>
          <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{data.animal}</h4>
        </div>
      )}
    </div>
  );
};

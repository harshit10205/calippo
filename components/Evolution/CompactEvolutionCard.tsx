
import React from 'react';
import { UserStats } from '../../types.ts';
import { EVOLUTION_LEVELS } from '../../constants/evolutionLevels.ts';
import { EvolutionAvatar } from './EvolutionAvatar.tsx';

interface CompactEvolutionCardProps {
  stats: UserStats;
  onClick: () => void;
}

export const CompactEvolutionCard: React.FC<CompactEvolutionCardProps> = ({ stats, onClick }) => {
  const currentLevelData = EVOLUTION_LEVELS[stats.level - 1];
  const nextLevelData = EVOLUTION_LEVELS[stats.level];
  
  const progress = nextLevelData 
    ? Math.min((stats.totalProtein / nextLevelData.reqProtein) * 100, 100) 
    : 100;

  const proteinNeeded = nextLevelData 
    ? Math.max(0, nextLevelData.reqProtein - Math.floor(stats.totalProtein))
    : 0;

  return (
    <button 
      onClick={onClick}
      className="w-[92%] mx-auto bg-white dark:bg-gray-900 h-[140px] rounded-[2rem] shadow-xl shadow-green-100 dark:shadow-none border border-gray-100 dark:border-gray-800 flex items-center p-6 space-x-6 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 text-left"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-500/5 to-transparent pointer-events-none"></div>
      
      {/* Avatar with Glow */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full group-hover:bg-green-500/30 transition-all"></div>
        <EvolutionAvatar level={stats.level} size="md" />
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-2">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Strength Rank</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
              LV. {stats.level} — {currentLevelData?.animal}
            </h3>
          </div>
          {nextLevelData && (
            <div className="text-right">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Next Form</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">→ {nextLevelData.animal}</p>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
              {nextLevelData ? `Need +${proteinNeeded}g Protein to evolve` : 'Max Evolution Reached!'}
            </p>
            <span className="text-[9px] font-black text-green-600 uppercase">View Tree <i className="fas fa-chevron-right ml-1"></i></span>
          </div>
        </div>
      </div>
    </button>
  );
};

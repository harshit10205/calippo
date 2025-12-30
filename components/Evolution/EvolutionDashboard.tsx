
import React from 'react';
import { UserStats } from '../../types.ts';
import { EVOLUTION_LEVELS } from '../../constants/evolutionLevels.ts';
import { EvolutionAvatar } from './EvolutionAvatar.tsx';

interface EvolutionDashboardProps {
  stats: UserStats;
}

export const EvolutionDashboard: React.FC<EvolutionDashboardProps> = ({ stats }) => {
  const currentLevelData = EVOLUTION_LEVELS[stats.level - 1];
  const nextLevelData = EVOLUTION_LEVELS[stats.level];
  
  const progress = nextLevelData 
    ? Math.min((stats.totalProtein / nextLevelData.reqProtein) * 100, 100) 
    : 100;

  return (
    <div className="w-full max-w-md mx-auto relative animate-entrance">
      {/* Level Badge Floating */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 bg-green-600 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-green-200 dark:shadow-none border-2 border-white dark:border-gray-800">
        Lv. {stats.level} — {currentLevelData?.animal}
      </div>

      <div className="bg-white dark:bg-gray-900 p-10 rounded-[3.5rem] shadow-2xl shadow-green-100 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center space-y-8 relative overflow-hidden group">
        {/* Glow behind avatar */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-green-500/10 blur-[60px] rounded-full group-hover:bg-green-500/20 transition-all duration-700"></div>

        <div className="relative z-10">
          <EvolutionAvatar level={stats.level} size="lg" />
        </div>
        
        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
              {currentLevelData?.animal}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Evolution</p>
          </div>

          <div className="space-y-3 px-4">
            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
              <span>{Math.floor(stats.totalProtein)}g Protein</span>
              <span className="text-green-600 dark:text-green-400">Next Form</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-4 rounded-full overflow-hidden p-1 border border-gray-50 dark:border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full transition-all duration-1000 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Sparkle at the end of progress */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-sm opacity-50 animate-pulse"></div>
              </div>
            </div>
            {nextLevelData && (
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 italic">
                Feed your inner beast <span className="text-green-600">+{Math.max(0, nextLevelData.reqProtein - Math.floor(stats.totalProtein))}g</span> protein to evolve.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

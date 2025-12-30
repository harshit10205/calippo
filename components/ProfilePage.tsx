
import React, { useState, useMemo } from 'react';
import { UserStats } from '../types.ts';
import { BADGES, TIER_CONFIG, Achievement } from '../constants.ts';
import { EvolutionAvatar } from './Evolution/EvolutionAvatar.tsx';
import { EVOLUTION_LEVELS } from '../constants/evolutionLevels.ts';

interface ProfilePageProps {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  historyCount: number;
  onClearHistory: () => void;
  onClose: () => void;
  stats: UserStats;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  dailyGoal, 
  setDailyGoal, 
  isDarkMode, 
  toggleDarkMode, 
  historyCount,
  onClearHistory,
  onClose,
  stats
}) => {
  const [view, setView] = useState<'profile' | 'achievements'>('profile');
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);
  const [activeTier, setActiveTier] = useState<Achievement['tier'] | 'All'>('All');

  const totalXP = useMemo(() => {
    return BADGES.reduce((acc, badge) => {
      return historyCount >= badge.count ? acc + badge.xp : acc;
    }, 0) + (stats.xp || 0);
  }, [historyCount, stats.xp]);

  const filteredBadges = useMemo(() => {
    if (activeTier === 'All') return BADGES;
    return BADGES.filter(b => b.tier === activeTier);
  }, [activeTier]);

  if (view === 'achievements') {
    // ... rest of the achievements view (kept similar to previous version)
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 bg-white/90 dark:bg-gray-950/90 py-4 z-40 backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <button onClick={() => setView('profile')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-green-600 transition-colors">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Badge Collection</h3>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {(['All', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Mythic'] as const).map(t => (
              <button key={t} onClick={() => setActiveTier(t)} className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${activeTier === t ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {filteredBadges.map((badge, idx) => (
             <button key={idx} onClick={() => setSelectedBadge(badge)} className={`p-4 rounded-[2rem] border transition-all ${historyCount >= badge.count ? 'bg-white dark:bg-gray-900 border-green-100' : 'opacity-30 grayscale'}`}>
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl bg-gradient-to-br ${badge.color}`}>
                  <i className={`fas ${badge.icon}`}></i>
                </div>
                <p className="text-[10px] font-black mt-2 truncate text-gray-900 dark:text-white uppercase">{badge.name}</p>
             </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
      <div className="flex justify-between items-center px-4">
        <div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white">Fitness Identity</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your strength evolution hub</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Evolution Profile Card */}
      <div className="mx-4 bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
           <EvolutionAvatar level={stats.level} size="lg" />
           <div>
              <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                The {EVOLUTION_LEVELS[stats.level - 1]?.animal}
              </h4>
              <div className="flex items-center justify-center space-x-2 mt-2">
                 <span className="bg-green-600 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest">Strength Lv. {stats.level}</span>
                 <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">{totalXP} Total XP</span>
              </div>
           </div>
        </div>

        {/* Nutritional Muscle Breakdown */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl text-center border border-transparent hover:border-green-100 transition-all">
              <div className="text-xl font-black text-gray-900 dark:text-white">{Math.floor(stats.totalProtein / 1000)}k</div>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Protein (g)</div>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl text-center border border-transparent hover:border-green-100 transition-all">
              <div className="text-xl font-black text-gray-900 dark:text-white">{Math.floor(stats.totalCarbs / 1000)}k</div>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Carbs (g)</div>
           </div>
           <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl text-center border border-transparent hover:border-green-100 transition-all">
              <div className="text-xl font-black text-gray-900 dark:text-white">{Math.floor(stats.totalFats / 1000)}k</div>
              <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fats (g)</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <section className="space-y-4">
          <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Daily Target</h5>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm">
            <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)} className="w-24 bg-transparent text-2xl font-black text-green-600 outline-none" />
            <span className="text-[10px] font-black text-gray-400 uppercase">kcal</span>
          </div>
        </section>

        <section className="space-y-4">
          <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Badges</h5>
          <button onClick={() => setView('achievements')} className="w-full bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 flex items-center justify-between shadow-sm group text-left">
            <span className="font-black text-[10px] uppercase text-gray-400 tracking-widest">View Gallery</span>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </button>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.3em]">Calippo • Beast Mode Activated</p>
      </div>
    </div>
  );
};

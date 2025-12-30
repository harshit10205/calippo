
import React, { useState } from 'react';
import { UserStats } from '../../types.ts';
import { EVOLUTION_LEVELS, AnimalLevel } from '../../constants/evolutionLevels.ts';
import { EvolutionAvatar } from './EvolutionAvatar.tsx';

interface EvolutionTreePageProps {
  stats: UserStats;
  onClose: () => void;
}

export const EvolutionTreePage: React.FC<EvolutionTreePageProps> = ({ stats, onClose }) => {
  const currentLevelData = EVOLUTION_LEVELS[stats.level - 1];
  const nextLevelData = EVOLUTION_LEVELS[stats.level];
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalLevel | null>(null);

  const canEvolve = nextLevelData && 
    stats.totalProtein >= nextLevelData.reqProtein && 
    stats.totalScans >= nextLevelData.reqScans;

  return (
    <div className="fixed inset-0 z-[200] bg-[#F6FFF6] dark:bg-gray-950 flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">Evolution Tree</h2>
        </div>
        <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100 dark:shadow-none">
          {stats.level} / 200
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-32">
        {/* Featured Current Animal */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[3rem] shadow-2xl shadow-green-100 dark:shadow-none border border-gray-100 dark:border-gray-800 text-center space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-400"></div>
          
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full scale-125"></div>
             <EvolutionAvatar level={stats.level} size="lg" />
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{currentLevelData?.animal}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Form Mastery</p>
          </div>

          {nextLevelData && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Next Unlock</span>
                  <span className="text-green-600">Requirement</span>
               </div>
               <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                        <i className={`fas ${nextLevelData.icon}`}></i>
                     </div>
                     <span className="font-bold text-gray-900 dark:text-white">{nextLevelData.animal}</span>
                  </div>
                  <span className="text-xs font-black text-gray-900 dark:text-white">{nextLevelData.reqProtein}g Protein</span>
               </div>
               <button 
                disabled={!canEvolve}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
                  canEvolve 
                  ? 'bg-green-600 text-white shadow-green-200 active:scale-95' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none'
                }`}
               >
                 {canEvolve ? 'Evolve Now ✨' : 'Requirements Not Met'}
               </button>
            </div>
          )}
        </div>

        {/* All Animals Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Library of Forms</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {EVOLUTION_LEVELS.map((animal) => {
              const isUnlocked = stats.level >= animal.level;
              const isLocked = !isUnlocked;
              
              return (
                <button 
                  key={animal.level}
                  onClick={() => setSelectedAnimal(animal)}
                  className={`
                    relative aspect-[3/4] p-3 rounded-3xl flex flex-col items-center justify-between transition-all duration-300 border
                    ${isUnlocked 
                      ? 'bg-white dark:bg-gray-900 border-green-100 dark:border-green-900/30 shadow-sm' 
                      : 'bg-gray-50 dark:bg-gray-900 border-transparent opacity-60 grayscale'}
                    ${stats.level === animal.level ? 'ring-2 ring-green-600 ring-offset-2 dark:ring-offset-gray-950' : ''}
                  `}
                >
                  <span className="text-[8px] font-black text-gray-400 uppercase">LV. {animal.level}</span>
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl bg-gradient-to-br
                    ${isUnlocked ? 'from-green-500 to-green-700' : 'from-gray-300 to-gray-400'}
                  `}>
                    <i className={`fas ${isLocked ? 'fa-lock' : animal.icon}`}></i>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-black leading-tight ${isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                      {animal.animal}
                    </p>
                    {isUnlocked && <i className="fas fa-check-circle text-green-500 text-[8px] mt-1"></i>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Info Popover */}
      {selectedAnimal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedAnimal(null)}></div>
           <div className="relative bg-white dark:bg-gray-900 w-full max-w-sm p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 space-y-6 text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-4xl mx-auto shadow-xl">
                 <i className={`fas ${selectedAnimal.icon}`}></i>
              </div>
              <div>
                 <h4 className="text-2xl font-black text-gray-900 dark:text-white italic">{selectedAnimal.animal}</h4>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Strength Form Level {selectedAnimal.level}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs font-bold text-gray-600 dark:text-gray-400">
                 {selectedAnimal.description}
              </div>
              <button 
                onClick={() => setSelectedAnimal(null)}
                className="w-full py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl uppercase tracking-widest text-xs"
              >
                Close Details
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

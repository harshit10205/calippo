
import React, { useEffect, useState } from 'react';
import { EVOLUTION_LEVELS } from '../../constants/evolutionLevels.ts';
import { EvolutionAvatar } from './EvolutionAvatar.tsx';

interface LevelUpOverlayProps {
  level: number;
  onClose: () => void;
}

export const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({ level, onClose }) => {
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'done'>('intro');
  const data = EVOLUTION_LEVELS[level - 1];

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('reveal'), 800);
    const timer2 = setTimeout(() => setPhase('done'), 2500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500"></div>
      
      <div className="relative z-10 text-center space-y-12 p-8">
        <div className={`transition-all duration-1000 ${phase === 'intro' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
           <h2 className="text-6xl font-black text-white uppercase tracking-tighter italic">Evolution!</h2>
           <p className="text-green-400 font-black uppercase tracking-[0.3em] mt-2">Strength Level {level}</p>
        </div>

        <div className="relative">
          {/* Burst Effect */}
          {phase === 'reveal' && (
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 bg-green-500 rounded-full blur-[100px] animate-ping opacity-50"></div>
               <div className="w-96 h-96 bg-white rounded-full blur-[150px] animate-pulse opacity-20"></div>
            </div>
          )}
          
          <div className={`transition-all duration-700 transform ${phase === 'intro' ? 'scale-50 rotate-180 blur-xl' : 'scale-110 rotate-0 blur-0'}`}>
             <EvolutionAvatar level={level} size="xl" />
          </div>
        </div>

        <div className={`space-y-4 transition-all delay-300 duration-500 ${phase !== 'reveal' && phase !== 'done' ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="bg-white/10 border border-white/20 p-6 rounded-[2.5rem] backdrop-blur-md inline-block">
             <h3 className="text-3xl font-black text-white">The {data.animal}</h3>
             <p className="text-white/60 text-sm mt-2 max-w-xs mx-auto">Your nutrition discipline has forced your body to adapt. You are now officially {data.animal}-tier strength.</p>
          </div>
          
          <div className="pt-8">
            <button 
              onClick={onClose}
              className="px-12 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-200 active:scale-95 transition-all uppercase tracking-widest shadow-2xl"
            >
              Enter The Arena
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

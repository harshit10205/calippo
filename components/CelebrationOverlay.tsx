
import React, { useEffect } from 'react';
import { Achievement, TIER_CONFIG } from '../constants.ts';

interface CelebrationOverlayProps {
  badge: Achievement;
  onClose: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ badge, onClose }) => {
  useEffect(() => {
    // Sound synthesis
    const playUnlockSound = () => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;
        // Ascending triumph sound
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.5); // C6
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        osc.start(now);
        osc.stop(now + 0.8);
      } catch (e) {
        console.warn("Audio context blocked or unavailable", e);
      }
    };

    playUnlockSound();
    
    // Auto close after 5 seconds if not closed manually
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute; width: 10px; height: 10px; background: #22c55e;
          animation: confetti-fall 4s linear infinite;
        }
      `}} />
      
      {/* Confetti particles */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{ 
            left: `${Math.random() * 100}vw`, 
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#22c55e', '#ffffff', '#fbbf24', '#3b82f6', '#ec4899'][i % 5]
          }} 
        />
      ))}

      <div className="absolute inset-0 bg-green-600/90 backdrop-blur-xl animate-in fade-in duration-500"></div>
      
      <div className="relative text-center space-y-8 p-6 animate-in zoom-in-50 duration-700">
        <div className="space-y-2">
          <h2 className="text-white text-5xl font-black uppercase tracking-tighter drop-shadow-lg">Achievement Unlocked!</h2>
          <p className="text-white/80 font-bold uppercase tracking-widest text-sm">You earned a new milestone</p>
        </div>

        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-white blur-3xl opacity-30 animate-pulse"></div>
          <div className={`w-48 h-48 md:w-64 md:h-64 rounded-[3rem] md:rounded-[4rem] bg-gradient-to-br ${badge.color} shadow-2xl flex items-center justify-center text-white text-7xl md:text-9xl border-8 border-white animate-bounce-slow`}>
            <i className={`fas ${badge.icon}`}></i>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm mx-auto space-y-4">
          <div className="space-y-1">
            <h3 className="text-3xl font-black text-gray-900">{badge.name}</h3>
            <span className={`text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest ${TIER_CONFIG[badge.tier].bg}`}>
              {badge.tier} Tier • +{badge.xp} XP
            </span>
          </div>
          <p className="text-gray-500 font-bold leading-tight">{badge.requirement}</p>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all active:scale-95 shadow-lg shadow-green-200 uppercase tracking-widest"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};


import React from 'react';

interface GuestSignInProps {
  onSignIn: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const GuestSignIn: React.FC<GuestSignInProps> = ({ onSignIn, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <button 
          onClick={toggleDarkMode}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
        </button>
      </div>

      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 mb-4 transition-colors">
            <i className="fas fa-leaf text-5xl"></i>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 dark:text-white">
            Calippo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            Scan your meals, track your macros, achieve your fitness goals.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSignIn}
            className="w-full py-5 px-6 bg-green-600 hover:bg-green-700 text-white font-black rounded-[2rem] shadow-lg shadow-green-100 dark:shadow-none transition-all active:scale-[0.98] text-lg uppercase tracking-widest"
          >
            Get Started
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100 dark:border-gray-800"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-gray-950 px-3 text-gray-400 dark:text-gray-500 font-black tracking-[0.3em]">Platform Features</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-900">
              <div className="text-green-600 dark:text-green-400 mb-2"><i className="fas fa-camera text-xl"></i></div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">AI Vision</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-900">
              <div className="text-green-600 dark:text-green-400 mb-2"><i className="fas fa-fire text-xl"></i></div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Streaks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-[2rem] transition-colors border border-transparent hover:border-green-100 dark:hover:border-green-900">
              <div className="text-green-600 dark:text-green-400 mb-2"><i className="fas fa-history text-xl"></i></div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest">Logging</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms</span>
        </p>
      </div>
    </div>
  );
};

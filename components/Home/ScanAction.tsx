
import React from 'react';

interface ScanActionProps {
  onScan: () => void;
  onUpload: () => void;
}

export const ScanAction: React.FC<ScanActionProps> = ({ onScan, onUpload }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-lg mx-auto animate-entrance" style={{ animationDelay: '0.2s' }}>
      <button 
        onClick={onScan}
        className="group bg-green-600 p-8 rounded-[3rem] text-white flex flex-col items-center justify-center space-y-4 shadow-2xl shadow-green-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform animate-pulse-soft">
          <i className="fas fa-camera text-2xl"></i>
        </div>
        <div className="text-center">
          <p className="font-black text-lg tracking-tight">Scan Meal</p>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">AI Vision</p>
        </div>
      </button>

      <button 
        onClick={onUpload}
        className="group bg-white dark:bg-gray-900 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
      >
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-full flex items-center justify-center group-hover:text-green-600 transition-colors">
          <i className="fas fa-image text-2xl"></i>
        </div>
        <div className="text-center">
          <p className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Gallery</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload</p>
        </div>
      </button>
    </div>
  );
};


import React from 'react';

interface MacroSummaryProps {
  protein: number;
  carbs: number;
  fats: number;
  dailyGoal: number; // For simplicity, we use calories to determine "goal reached" glow
  totalCalories: number;
}

export const MacroSummary: React.FC<MacroSummaryProps> = ({ protein, carbs, fats, dailyGoal, totalCalories }) => {
  const goalReached = totalCalories >= dailyGoal * 0.8; // Glow if 80% reached

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mx-auto animate-entrance" style={{ animationDelay: '0.1s' }}>
      <MacroCard 
        label="Protein" 
        value={Math.floor(protein)} 
        unit="g" 
        icon="fa-egg" 
        color="text-green-600"
        bgColor="bg-green-50"
        reached={goalReached}
      />
      <MacroCard 
        label="Carbs" 
        value={Math.floor(carbs)} 
        unit="g" 
        icon="fa-bowl-rice" 
        color="text-orange-600"
        bgColor="bg-orange-50"
        reached={goalReached}
      />
      <MacroCard 
        label="Fats" 
        value={Math.floor(fats)} 
        unit="g" 
        icon="fa-cheese" 
        color="text-yellow-600"
        bgColor="bg-yellow-50"
        reached={goalReached}
      />
    </div>
  );
};

const MacroCard: React.FC<{ label: string, value: number, unit: string, icon: string, color: string, bgColor: string, reached: boolean }> = ({ label, value, unit, icon, color, bgColor, reached }) => (
  <div className={`
    p-5 rounded-[2.5rem] text-center space-y-2 border transition-all duration-500
    ${reached ? 'border-green-400 bg-white dark:bg-gray-900 shadow-xl shadow-green-100 dark:shadow-none ring-4 ring-green-500/5' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm'}
  `}>
    <div className={`w-10 h-10 ${bgColor} dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto ${color}`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <div className="space-y-0.5">
      <div className="text-xl font-black text-gray-900 dark:text-white leading-none">{value}{unit}</div>
      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

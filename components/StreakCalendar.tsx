
import React, { useState } from 'react';
import { UserStats, HistoryItem } from '../types.ts';

interface StreakCalendarProps {
  stats: UserStats;
  history: HistoryItem[];
  onClose: () => void;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ stats, history, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [longPressData, setLongPressData] = useState<HistoryItem | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthYear = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));

  const handleDatePress = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayHistory = history.find(h => {
        const d = new Date(h.timestamp);
        return d.toISOString().split('T')[0] === dateStr;
    });
    if (dayHistory) setLongPressData(dayHistory);
  };

  const getStatusIcon = (dateStr: string) => {
    const status = stats.streakHistory[dateStr];
    if (status === 'streak') return <i className="fas fa-fire text-orange-500 text-xs"></i>;
    if (status === 'freeze') return <i className="fas fa-snowflake text-blue-400 text-xs"></i>;
    if (status === 'broken') return <i className="fas fa-times text-red-400 text-xs"></i>;
    return null;
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col justify-end">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl mx-auto bg-white dark:bg-gray-950 rounded-t-[3rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>

        <div className="flex justify-between items-center mb-8 pt-4">
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">Streak History</h3>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{monthYear}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={prevMonth} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button onClick={nextMonth} className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-green-600 transition-colors">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-3 gap-3 mb-8">
           <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-3xl border border-orange-100 dark:border-orange-800/50 text-center">
             <div className="text-2xl font-black text-orange-600">{stats.streak}</div>
             <div className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">Current 🔥</div>
           </div>
           <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-3xl border border-blue-100 dark:border-blue-800/50 text-center">
             <div className="text-2xl font-black text-blue-600">{stats.freezeCount}</div>
             <div className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Tokens ❄</div>
           </div>
           <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-3xl border border-green-100 dark:border-green-800/50 text-center">
             <div className="text-2xl font-black text-green-600">{stats.streak > 365 ? 'Legend' : 'Pro'}</div>
             <div className="text-[10px] font-black text-green-400 uppercase tracking-tighter">Tier 🔱</div>
           </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase mb-2">{d}</div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            
            return (
              <button 
                key={day}
                onContextMenu={(e) => { e.preventDefault(); handleDatePress(day); }}
                onClick={() => handleDatePress(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all active:scale-90 ${
                  isToday ? 'border-2 border-green-500 ring-4 ring-green-500/10' : 'bg-gray-50 dark:bg-gray-900 border border-transparent'
                }`}
              >
                <span className={`text-xs font-black ${isToday ? 'text-green-600' : 'text-gray-400'}`}>{day}</span>
                <div className="mt-1">{getStatusIcon(dateStr)}</div>
              </button>
            );
          })}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-green-600 text-white font-black rounded-[2rem] shadow-xl shadow-green-200 dark:shadow-none uppercase tracking-widest active:scale-95 transition-all"
        >
          Close Log
        </button>

        {/* Daily Summary Popover */}
        {longPressData && (
          <div className="absolute inset-x-8 bottom-32 bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-2xl border-2 border-green-500/20 animate-in zoom-in-95 duration-200 flex items-center space-x-6">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden">
                {longPressData.image && <img src={longPressData.image} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
               <h4 className="font-black text-gray-900 dark:text-white">{longPressData.data.foodName}</h4>
               <p className="text-xs text-green-600 font-bold">{longPressData.data.calories} kcal logged</p>
            </div>
            <button onClick={() => setLongPressData(null)} className="text-gray-300 hover:text-gray-500">
               <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

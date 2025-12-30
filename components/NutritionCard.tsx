
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { NutritionData } from '../types.ts';

interface NutritionCardProps {
  data: NutritionData;
  image: string | null;
  onReset: () => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({ data, image, onReset }) => {
  const chartData = [
    { name: 'Protein', value: data.protein, color: '#16a34a' },
    { name: 'Carbs', value: data.carbs, color: '#4ade80' },
    { name: 'Fats', value: data.fat, color: '#eab308' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-50 dark:border-gray-800 transition-all duration-500 ease-out hover:scale-[1.015] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] cursor-default">
      {image && (
        <div className="relative h-64 md:h-72 w-full overflow-hidden">
          <img 
            src={image} 
            alt={data.foodName} 
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight">{data.foodName}</h2>
              <p className="text-green-400 font-bold flex items-center">
                <i className="fas fa-bolt mr-2 text-sm"></i>
                {data.calories} kcal
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl text-white text-sm font-bold border border-white/20">
              <i className="fas fa-heartbeat mr-2 text-green-400"></i>
              {data.healthScore}%
            </div>
          </div>
        </div>
      )}

      <div className="p-8 space-y-8">
        {/* Macro Summary Grid */}
        <div className="grid grid-cols-3 gap-4">
          <MacroBox label="Protein" value={`${data.protein}g`} color="bg-green-600" />
          <MacroBox label="Carbs" value={`${data.carbs}g`} color="bg-green-400" />
          <MacroBox label="Fats" value={`${data.fat}g`} color="bg-yellow-500" />
        </div>

        {/* Macro Distribution Chart */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Macro Distribution</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          <div className="h-48 w-full bg-gray-50 dark:bg-gray-800/30 rounded-3xl p-4 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter mb-1">
                            {payload[0].payload.name}
                          </p>
                          <p className="text-lg font-black text-gray-900 dark:text-white">
                            {payload[0].value}g
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 8, 8]} 
                  barSize={40}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Nutrition Insights</span>
            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-0 text-3xl text-green-100 dark:text-green-900/30 font-serif">"</div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic pl-2 text-lg">
              {data.description}
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full py-5 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 rounded-[1.5rem] hover:bg-green-100 dark:hover:bg-green-900/40 transition-all active:scale-[0.98]"
        >
          Scan Another Item
        </button>
      </div>
    </div>
  );
};

const MacroBox: React.FC<{ label: string, value: string, color: string }> = ({ label, value, color }) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl flex flex-col items-center text-center transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 shadow-none hover:shadow-sm">
    <div className={`w-2.5 h-2.5 rounded-full ${color} mb-3 shadow-sm`}></div>
    <div className="text-xl font-black text-gray-900 dark:text-white">{value}</div>
    <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">{label}</div>
  </div>
);

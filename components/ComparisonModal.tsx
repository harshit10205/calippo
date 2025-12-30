
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from 'recharts';
import { HistoryItem } from '../types.ts';

interface ComparisonModalProps {
  items: HistoryItem[];
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ items, onClose }) => {
  const chartData = [
    { name: 'Protein (g)' },
    { name: 'Carbs (g)' },
    { name: 'Fat (g)' }
  ];

  // Transform data for Recharts grouped bar chart
  const formattedChartData = [
    {
      metric: 'Protein',
      ...items.reduce((acc, item) => ({ ...acc, [item.data.foodName]: item.data.protein }), {})
    },
    {
      metric: 'Carbs',
      ...items.reduce((acc, item) => ({ ...acc, [item.data.foodName]: item.data.carbs }), {})
    },
    {
      metric: 'Fat',
      ...items.reduce((acc, item) => ({ ...acc, [item.data.foodName]: item.data.fat }), {})
    }
  ];

  const colors = ['#16a34a', '#4ade80', '#eab308', '#2563eb'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-5xl bg-white dark:bg-gray-950 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Compare Scans</h2>
            <p className="text-gray-500 dark:text-gray-400">Nutritional delta analysis</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-12">
          {/* Table Comparison */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Metric</th>
                  {items.map((item, idx) => (
                    <th key={item.id} className="py-4 px-4 min-w-[140px]">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{item.data.foodName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                <ComparisonRow label="Calories" unit="kcal" values={items.map(i => i.data.calories)} />
                <ComparisonRow label="Protein" unit="g" values={items.map(i => i.data.protein)} color="text-green-600 dark:text-green-400" />
                <ComparisonRow label="Carbs" unit="g" values={items.map(i => i.data.carbs)} />
                <ComparisonRow label="Fats" unit="g" values={items.map(i => i.data.fat)} />
                <ComparisonRow label="Health Score" unit="%" values={items.map(i => i.data.healthScore)} />
              </tbody>
            </table>
          </div>

          {/* Visualization Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Macro Weighting</span>
              <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800"></div>
            </div>
            
            <div className="h-80 w-full bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] p-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedChartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                  <XAxis 
                    dataKey="metric" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      background: '#1f2937',
                      color: '#fff'
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {items.map((item, idx) => (
                    <Bar 
                      key={item.id} 
                      dataKey={item.data.foodName} 
                      fill={colors[idx % colors.length]} 
                      radius={[6, 6, 0, 0]} 
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{ label: string, unit: string, values: number[], color?: string }> = ({ label, unit, values, color }) => {
  const maxValue = Math.max(...values);
  return (
    <tr>
      <td className="py-5 text-sm font-bold text-gray-400 dark:text-gray-500">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-5 px-4">
          <span className={`text-lg font-black ${v === maxValue ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'} ${color || ''}`}>
            {v}{unit}
          </span>
          {v === maxValue && values.length > 1 && (
            <div className="text-[10px] font-black text-green-500 uppercase mt-1">Highest</div>
          )}
        </td>
      ))}
    </tr>
  );
};

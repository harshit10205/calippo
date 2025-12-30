
import React, { useState } from 'react';
import { HistoryItem } from '../types.ts';
import { ComparisonModal } from './ComparisonModal.tsx';

interface HistoryLogProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ 
  history, 
  onSelectItem, 
  onDeleteItem, 
  onClearHistory,
  onClose 
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleItemClick = (item: HistoryItem) => {
    if (isCompareMode) {
      toggleSelect(item.id);
    } else {
      onSelectItem(item);
    }
  };

  const selectedItems = history.filter(item => selectedIds.has(item.id));

  return (
    <div className="relative pb-32 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your History</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Past {history.length} scans</p>
        </div>
        <div className="flex space-x-2">
          {history.length > 1 && (
             <button 
              onClick={() => {
                setIsCompareMode(!isCompareMode);
                if (isCompareMode) setSelectedIds(new Set());
              }}
              className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${
                isCompareMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }`}
            >
              {isCompareMode ? 'Cancel' : 'Compare'}
            </button>
          )}
          {history.length > 0 && !isCompareMode && (
            <button 
              onClick={onClearHistory}
              className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest px-3 py-2 bg-red-50 dark:bg-red-900/10 rounded-xl transition-colors"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 dark:text-gray-600">
            <i className="fas fa-history text-2xl"></i>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No scans yet. Start by scanning your first meal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {[...history].reverse().map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <div 
                key={item.id}
                className={`group relative bg-white dark:bg-gray-900 p-4 rounded-3xl border transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center space-x-4 ${
                  isSelected 
                    ? 'border-green-600 ring-2 ring-green-600 ring-opacity-20' 
                    : 'border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-900'
                }`}
                onClick={() => handleItemClick(item)}
              >
                {isCompareMode && (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-green-600 border-green-600 text-white' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    {isSelected && <i className="fas fa-check text-[10px]"></i>}
                  </div>
                )}
                
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.data.foodName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <i className="fas fa-utensils"></i>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate pr-2">{item.data.foodName}</h4>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase whitespace-nowrap">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 mt-1 flex-wrap gap-y-1">
                    <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                      {item.data.calories} kcal
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      P: {item.data.protein}g · C: {item.data.carbs}g · F: {item.data.fat}g
                    </span>
                    <span className="text-[10px] font-black text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                      Score: {item.data.healthScore}
                    </span>
                  </div>
                </div>

                {!isCompareMode && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <i className="fas fa-trash-alt text-sm"></i>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Action Bar */}
      {isCompareMode && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-[2rem] p-3 border border-gray-100 dark:border-gray-800 flex items-center space-x-6 px-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Selected</span>
              <span className="text-lg font-black text-gray-900 dark:text-white">{selectedIds.size} Items</span>
            </div>
            <button 
              disabled={selectedIds.size < 2}
              onClick={() => setShowComparisonModal(true)}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:grayscale text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-green-200 dark:shadow-none active:scale-95"
            >
              Analyze & Compare
            </button>
          </div>
        </div>
      )}

      {showComparisonModal && (
        <ComparisonModal 
          items={selectedItems} 
          onClose={() => setShowComparisonModal(false)} 
        />
      )}
    </div>
  );
};

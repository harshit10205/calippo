
import React, { useState, useRef, useEffect } from 'react';
import { AuthContainer } from './components/Auth/AuthContainer.tsx';
import { SocialHub } from './components/Social/SocialHub.tsx';
import { NutritionCard } from './components/NutritionCard.tsx';
import { CameraView } from './components/CameraView.tsx';
import { HistoryLog } from './components/HistoryLog.tsx';
import { ProfilePage } from './components/ProfilePage.tsx';
import { BadgeNotification } from './components/BadgeNotification.tsx';
import { StreakIcon } from './components/StreakIcon.tsx';
import { StreakCalendar } from './components/StreakCalendar.tsx';
import { LevelUpOverlay } from './components/Evolution/LevelUpOverlay.tsx';
import { EvolutionAvatar } from './components/Evolution/EvolutionAvatar.tsx';
import { CompactEvolutionCard } from './components/Evolution/CompactEvolutionCard.tsx';
import { EvolutionTreePage } from './components/Evolution/EvolutionTreePage.tsx';
import { MacroSummary } from './components/Home/MacroSummary.tsx';
import { ScanAction } from './components/Home/ScanAction.tsx';
import { BottomNav } from './components/Navigation/BottomNav.tsx';
import { analyzeFoodImage } from './services/geminiService.ts';
import { authService } from './services/authService.ts';
import { AppStatus, NutritionData, HistoryItem, UserStats, User } from './types.ts';
import { BADGES, Achievement } from './constants.ts';
import { EVOLUTION_LEVELS } from './constants/evolutionLevels.ts';

type ActiveTab = 'home' | 'progress' | 'friends' | 'profile';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [showCamera, setShowCamera] = useState(false);
  const [showStreakCalendar, setShowStreakCalendar] = useState(false);
  const [showEvolutionTree, setShowEvolutionTree] = useState(false);
  const [pendingLevelUp, setPendingLevelUp] = useState<number | null>(null);
  const [celebratingBadge, setCelebratingBadge] = useState<Achievement | null>(null);
  
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('calippo_daily_goal');
    return saved ? parseInt(saved, 10) : 2400;
  });
  
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('calippo_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('calippo_stats');
    return saved ? JSON.parse(saved) : { 
      streak: 0, 
      freezeCount: 2, 
      lastActivityTimestamp: 0, 
      celebratedBadgeNames: [],
      streakHistory: {},
      xp: 0,
      level: 1,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalScans: 0
    };
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('calippo_history', JSON.stringify(history));
    const newUnlocks = BADGES.filter(badge => 
      history.length >= badge.count && 
      !stats.celebratedBadgeNames.includes(badge.name)
    );

    if (newUnlocks.length > 0) {
      const firstNew = newUnlocks[0];
      setCelebratingBadge(firstNew);
      setStats(prev => ({
        ...prev,
        celebratedBadgeNames: [...prev.celebratedBadgeNames, firstNew.name],
        xp: prev.xp + firstNew.xp
      }));
    }
  }, [history.length]);

  useEffect(() => {
    localStorage.setItem('calippo_stats', JSON.stringify(stats));
    
    // Auto detection of level up requirements met
    // (Actual level up happens through EvolutionTreePage or processImage)
    const nextLevelData = EVOLUTION_LEVELS[stats.level];
    if (nextLevelData && stats.totalProtein >= nextLevelData.reqProtein && stats.totalScans >= nextLevelData.reqScans && !pendingLevelUp) {
       // We only prompt it when they perform a scan or view the tree
    }
  }, [stats]);

  const toggleDarkMode = () => {
    setIsTransitioning(true);
    setIsDarkMode(!isDarkMode);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const processImage = async (data: string) => {
    try {
      setStatus(AppStatus.SCANNING);
      setError(null);
      setShowCamera(false);
      
      let base64 = '';
      let displayImage = '';
      if (data.startsWith('data:image')) {
        displayImage = data;
        setPreviewImage(data);
        base64 = data.split(',')[1];
      } else {
        base64 = data;
        displayImage = `data:image/jpeg;base64,${base64}`;
        setPreviewImage(displayImage);
      }

      const nutritionResult = await analyzeFoodImage(base64);
      setNutrition(nutritionResult);
      setStatus(AppStatus.RESULT);
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        data: nutritionResult,
        image: displayImage
      };
      setHistory(prev => [...prev, newItem]);
      
      setStats(prev => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const updatedHistory = { ...prev.streakHistory };
        updatedHistory[todayStr] = 'streak';
        
        const newTotalProtein = prev.totalProtein + (nutritionResult.protein || 0);
        const newTotalScans = prev.totalScans + 1;
        const nextLevelData = EVOLUTION_LEVELS[prev.level];
        let newLevel = prev.level;

        if (nextLevelData && newTotalProtein >= nextLevelData.reqProtein && newTotalScans >= nextLevelData.reqScans) {
           newLevel += 1;
           setPendingLevelUp(newLevel);
        }

        return { 
          ...prev, 
          streak: prev.streak + 1, 
          lastActivityTimestamp: now.getTime(), 
          streakHistory: updatedHistory,
          totalProtein: newTotalProtein,
          totalCarbs: prev.totalCarbs + (nutritionResult.carbs || 0),
          totalFats: prev.totalFats + (nutritionResult.fat || 0),
          totalScans: newTotalScans,
          xp: prev.xp + 25,
          level: newLevel
        };
      });

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  const resetScanner = () => {
    setNutrition(null);
    setPreviewImage(null);
    setStatus(AppStatus.IDLE);
    setError(null);
    setActiveTab('home');
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!currentUser) {
    return <AuthContainer onAuthenticated={setCurrentUser} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  // Calculate daily totals from history (today only)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayHistory = history.filter(item => new Date(item.timestamp).toISOString().split('T')[0] === todayStr);
  const dailyTotals = todayHistory.reduce((acc, item) => ({
    protein: acc.protein + item.data.protein,
    carbs: acc.carbs + item.data.carbs,
    fats: acc.fats + item.data.fat,
    calories: acc.calories + item.data.calories
  }), { protein: 0, carbs: 0, fats: 0, calories: 0 });

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 ${isTransitioning ? 'theme-transitioning' : ''}`}>
      {showCamera && <CameraView onCapture={processImage} onClose={() => setShowCamera(false)} />}
      {celebratingBadge && <BadgeNotification badge={celebratingBadge} onClose={() => setCelebratingBadge(null)} />}
      {showStreakCalendar && <StreakCalendar stats={stats} history={history} onClose={() => setShowStreakCalendar(false)} />}
      {showEvolutionTree && <EvolutionTreePage stats={stats} onClose={() => setShowEvolutionTree(false)} />}
      {pendingLevelUp && <LevelUpOverlay level={pendingLevelUp} onClose={() => setPendingLevelUp(null)} />}

      {/* Header with Streak */}
      <header className="sticky top-0 z-50 bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl px-6 py-4 flex justify-between items-center animate-entrance">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={resetScanner}>
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-green-200 dark:shadow-none">
            <i className="fas fa-leaf text-lg"></i>
          </div>
          <span className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white">Calippo</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setShowStreakCalendar(true)}
            className="group flex items-center space-x-3 bg-white dark:bg-gray-900 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm cursor-pointer hover:border-orange-200 transition-all"
          >
            <div className="relative">
              <i className={`fas fa-fire text-xl ${stats.streak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-300'}`}></i>
              {stats.streak === 0 && (
                <div className="absolute inset-0 ice-frost opacity-50 animate-frost"></div>
              )}
            </div>
            <span className="font-black text-lg text-gray-900 dark:text-white">{stats.streak}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-6 overflow-x-hidden">
        {status === AppStatus.SCANNING && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-entrance">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-800 border-t-green-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-brain text-green-600 text-3xl animate-pulse"></i></div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">Analyzing Your Meal</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Connecting to AI Neural Network</p>
            </div>
          </div>
        )}

        {status === AppStatus.RESULT && nutrition && (
          <div className="animate-entrance">
            <NutritionCard data={nutrition} image={previewImage} onReset={resetScanner} />
          </div>
        )}

        {status === AppStatus.ERROR && (
           <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-10 rounded-[3rem] text-center space-y-6 max-w-md mx-auto animate-entrance">
             <div className="w-20 h-20 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-full flex items-center justify-center mx-auto">
               <i className="fas fa-triangle-exclamation text-3xl"></i>
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white">Analysis Blocked</h3>
               <p className="text-gray-600 dark:text-gray-400 font-medium">{error}</p>
             </div>
             <button onClick={resetScanner} className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-3xl transition-all shadow-xl">Try Again</button>
           </div>
        )}

        {status === AppStatus.IDLE && (
          <div className="space-y-10">
            {activeTab === 'home' && (
              <div className="space-y-8">
                {/* Pokémon-Style Compact Card */}
                <CompactEvolutionCard 
                  stats={stats} 
                  onClick={() => setShowEvolutionTree(true)} 
                />
                
                <MacroSummary 
                  protein={dailyTotals.protein} 
                  carbs={dailyTotals.carbs} 
                  fats={dailyTotals.fats} 
                  dailyGoal={dailyGoal}
                  totalCalories={dailyTotals.calories}
                />
                <ScanAction onScan={() => setShowCamera(true)} onUpload={handleFileUpload} />
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => processImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>
            )}

            {activeTab === 'progress' && (
              <HistoryLog 
                history={history} 
                onSelectItem={(item) => { setNutrition(item.data); setPreviewImage(item.image); setStatus(AppStatus.RESULT); }} 
                onDeleteItem={(id) => setHistory(prev => prev.filter(i => i.id !== id))}
                onClearHistory={() => setHistory([])}
                onClose={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'friends' && (
              <SocialHub currentUser={currentUser} onUpdateUser={setCurrentUser} onClose={() => setActiveTab('home')} />
            )}

            {activeTab === 'profile' && (
              <ProfilePage 
                dailyGoal={dailyGoal}
                setDailyGoal={setDailyGoal}
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                historyCount={history.length}
                onClearHistory={() => setHistory([])}
                onClose={() => setActiveTab('home')}
                stats={stats}
              />
            )}
          </div>
        )}
      </main>

      {/* Modern Bottom Nav */}
      {status === AppStatus.IDLE && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

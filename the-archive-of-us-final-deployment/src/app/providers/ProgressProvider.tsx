import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ProgressState {
  unlockedEnvs: string[];
  completedChapters: string[];
  collectedFragments: string[];
  achievements: string[];
  gamesCompleted: Record<string, number>;
}

const DEFAULT_STATE: ProgressState = {
  unlockedEnvs: ['entrance', 'archive', 'gallery', 'letters', 'garden', 'arcade', 'observatory'],
  completedChapters: [], collectedFragments: [], achievements: [], gamesCompleted: {}
};

const ProgressContext = createContext<any>(null);

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const [progress, setProgress] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('archive_progress_final');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });
  
  const [toast, setToast] = useState<{title: string, desc: string} | null>(null);

  useEffect(() => { localStorage.setItem('archive_progress_final', JSON.stringify(progress)); }, [progress]);

  const showToast = (title: string, desc: string) => {
    setToast({ title, desc });
    setTimeout(() => setToast(null), 4000);
  };

  const collectFragment = (fragmentId: string) => {
    if (!progress.collectedFragments.includes(fragmentId)) {
      setProgress(p => ({ ...p, collectedFragments: [...p.collectedFragments, fragmentId] }));
      showToast("Secret Fragment Found", "A memory has been added to your journal.");
      if (progress.collectedFragments.length + 1 >= 3 && !progress.achievements.includes('secret-finder')) {
        unlockAchievement('secret-finder', 'Master of Secrets');
      }
    }
  };

  const unlockAchievement = (id: string, title: string) => {
    if (!progress.achievements.includes(id)) {
      setProgress(p => ({ ...p, achievements: [...p.achievements, id] }));
      showToast("Achievement Unlocked", title);
    }
  };

  const completeGame = (gameId: string, score: number) => {
    setProgress(p => ({ ...p, gamesCompleted: { ...p.gamesCompleted, [gameId]: score } }));
    if (gameId === 'quiz' && score === 3) unlockAchievement('perfect-score', 'Flawless Memory');
  };

  const completeChapter = (id: string) => {
    setProgress(p => {
      if (p.completedChapters.includes(id)) return p;
      return { ...p, completedChapters: [...p.completedChapters, id] };
    });
  };

  const isChapterCompleted = (id: string) => progress.completedChapters.includes(id);

  const getOverallProgress = () => {
    const totalChapters = 38; 
    return Math.min(100, Math.round((progress.completedChapters.length / totalChapters) * 100));
  };

  const getEnding = () => {
    if (progress.collectedFragments.length >= 3 && progress.achievements.length >= 2) return 'E - The Complete Archive';
    if (progress.collectedFragments.length >= 3) return 'D - The Secret Ending';
    if (progress.gamesCompleted['quiz']) return 'B - The Memory Ending';
    return 'A - The Birthday Ending';
  };

  return (
    <ProgressContext.Provider value={{ progress, collectFragment, unlockAchievement, completeGame, getEnding, completeChapter, isChapterCompleted, getOverallProgress }}>
      {children}
      {toast && (
        <div className="fixed top-8 right-8 z-50 bg-espresso/90 backdrop-blur-md border border-gold/40 p-5 rounded-sm shadow-2xl text-ivory font-sans animate-fade-in">
          <h4 className="text-gold uppercase tracking-[0.2em] text-[9px] mb-1 font-semibold">{toast.title}</h4>
          <p className="font-editorial text-lg italic">{toast.desc}</p>
        </div>
      )}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);

import { useState } from 'react';
import { useProfiles } from './hooks/useProfiles';
import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { ProfileEditor } from './components/ProfileEditor';
import { Settings, Timer as TimerIcon, Github } from 'lucide-react';
import { clsx } from 'clsx';
import { DEFAULT_PROFILE } from './types';

function App() {
  const {
    profiles,
    activeProfile,
    setActiveProfileId,
    addProfile,
    updateProfile,
    deleteProfile
  } = useProfiles();

  const timer = useTimer(activeProfile);
  const [view, setView] = useState<'timer' | 'editor'>('timer');

  const handleAddProfile = () => {
    const newProfile = {
      ...DEFAULT_PROFILE,
      id: crypto.randomUUID(),
      name: `New Profile ${profiles.length + 1}`,
    };
    addProfile(newProfile);
    setView('editor');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-gray-900/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
            B
          </div>
          <h1 className="font-bold text-xl tracking-tight">Better Tabata</h1>
        </div>

        <a
          href="https://github.com/alvinly/better_tabata"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <Github size={20} />
        </a>
      </header>

      <main className="container mx-auto px-4 pt-20 pb-24 min-h-screen flex flex-col md:flex-row gap-8 items-center justify-center">

        {/* Timer View */}
        <div className={clsx(
          "w-full max-w-md transition-all duration-500",
          view === 'editor' && "hidden md:block md:opacity-50 md:scale-95"
        )}>
          <TimerDisplay
            status={timer.status}
            timeLeft={timer.timeLeft}
            currentSet={timer.currentSet}
            totalSets={timer.totalSets}
            isRunning={timer.isRunning}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            onSkip={timer.skip}
          />
        </div>

        {/* Editor View */}
        <div className={clsx(
          "w-full max-w-md transition-all duration-500",
          view === 'timer' && "hidden md:block"
        )}>
          <ProfileEditor
            profile={activeProfile}
            profiles={profiles}
            onUpdate={updateProfile}
            onDelete={deleteProfile}
            onSelect={setActiveProfileId}
            onAdd={handleAddProfile}
          />
        </div>

      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-2 md:hidden flex justify-around z-20">
        <button
          onClick={() => setView('timer')}
          className={clsx(
            "flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors",
            view === 'timer' ? "text-blue-400 bg-blue-400/10" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <TimerIcon size={24} />
          <span className="text-xs font-medium">Timer</span>
        </button>
        <button
          onClick={() => setView('editor')}
          className={clsx(
            "flex flex-col items-center gap-1 p-2 rounded-xl w-full transition-colors",
            view === 'editor' ? "text-blue-400 bg-blue-400/10" : "text-gray-500 hover:text-gray-300"
          )}
        >
          <Settings size={24} />
          <span className="text-xs font-medium">Config</span>
        </button>
      </nav>
    </div>
  );
}

export default App;

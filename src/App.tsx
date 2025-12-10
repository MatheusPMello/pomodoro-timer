import { useState, useEffect } from 'react';
import './App.css';
import { formatTime } from './utils/timeHelpers';
import { type TimerSettings } from './types';

// Components
import Timer from './components/Timer';
import ModeSelector from './components/ModeSelector';
import SettingsModal from './components/SettingsModal';
import Feedback from './components/Feedback';

// Hooks
import { useAudio } from './hooks/useAudio';
import { usePomodoro } from './hooks/usePomodoro';

const DEFAULT_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

function App() {
  // 1. Setup Audio
  const { audioRef, alertSound, playAlert, primeAudio } = useAudio();

  // 2. Setup Settings State (App still owns this, as it's global config)
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  // 3. Setup Pomodoro Logic (Injecting settings and the sound player)
  const {
    actualTime,
    isRunning,
    actualMode,
    sessionCount,
    toggleTimer,
    resetTimer,
    changeMode,
    updateTimeFromSettings
  } = usePomodoro(timerSettings, playAlert); // <--- Pass playAlert here!

  // --- Handlers ---

  const handleStartStop = () => {
    primeAudio(); // Fix browser autoplay
    toggleTimer();
  };

  const handleSaveSettings = (newSettingsInMinutes: TimerSettings) => {
    const newSettingsInSeconds = {
      work: newSettingsInMinutes.work * 60,
      shortBreak: newSettingsInMinutes.shortBreak * 60,
      longBreak: newSettingsInMinutes.longBreak * 60,
    };
    setTimerSettings(newSettingsInSeconds);
    updateTimeFromSettings(newSettingsInSeconds);
    setShowSettings(false);
  };

  // Browser Tab Title Effect
  useEffect(() => {
    const timeString = formatTime(actualTime);
    const modeLabels = { work: "Work", shortBreak: "Short Break", longBreak: "Long Break" };
    
    document.title = isRunning 
      ? `${timeString} - ${modeLabels[actualMode]}` 
      : "MelloFocus";
  }, [actualTime, actualMode, isRunning]);

  // --- Render ---

  return (
    <div className="page-layout">
      
      <header className="page-header">
        <div className="header-content">
          <h2>MelloFocus</h2>
          <button 
             className="settings-button" 
             onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      <main className="page-content">
        <div className={`pomodoro-container ${actualMode}`}>
          <p style={{ textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
            Session: {sessionCount} / 4
          </p>
          
          <ModeSelector 
            actualMode={actualMode} 
            handleModeChange={changeMode} 
          />
          
          <Timer
            actualTime={actualTime}
            isRunning={isRunning}
            handleStartStop={handleStartStop}
            handleReset={resetTimer}
          />
        </div>
      </main>

      <SettingsModal 
        show={showSettings} 
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentSettings={timerSettings}
      />

      <footer className="page-footer">
        <p>
          A portfolio project by <a href="https://github.com/MatheusPMello/pomodoro-timer" target="_blank" rel="noopener noreferrer">MatheusPMello</a>
        </p>
        <Feedback />
      </footer>

      {/* The Audio Element is managed by our hook now */}
      <audio ref={audioRef} src={alertSound} preload='auto'>
        <track kind="captions" srcLang="en" src=""/>
      </audio>

    </div>
  );
}

export default App;
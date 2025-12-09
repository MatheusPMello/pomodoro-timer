import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import alertSound from './assets/alert.mp3';
import { formatTime } from './utils/timeHelpers';
import type {
  Mode,
  TimerSettings,
  SettingsModalProps,
  ModeSelectorProps,
  TimerProps,
  FeedbackFormElement
} from './types';

// Import Components
import Timer from './components/Timer';
import ModeSelector from './components/ModeSelector';
import SettingsModal from './components/SettingsModal';
import Feedback from './components/Feedback';

// --- Constants & Types ---

const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

// --- Main App Component ---

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerEndTime = useRef<number | null>(null);

  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    work: DEFAULT_SETTINGS.work * 60,
    shortBreak: DEFAULT_SETTINGS.shortBreak * 60,
    longBreak: DEFAULT_SETTINGS.longBreak * 60
  });

  const [showSettings, setShowSettings] = useState(false);
  const [actualTime, setActualTime] = useState(timerSettings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<Mode>("work");
  const [sessionCount, setSessionCount] = useState(0);

  const handleSaveSettings = (newSettingsInMinutes: TimerSettings) => {
    const newSettingsInSeconds = {
      work: newSettingsInMinutes.work * 60,
      shortBreak: newSettingsInMinutes.shortBreak * 60,
      longBreak: newSettingsInMinutes.longBreak * 60,
    };

    setTimerSettings(newSettingsInSeconds);
    setActualTime(newSettingsInSeconds[actualMode]);
    setShowSettings(false);
    setIsRunning(false);
  };

const handleTimerEnd = useCallback(() => {
    setIsRunning(false);
    
    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }

    if (actualMode === "work") {
      setSessionCount((prevCount) => {
        const newSessionCount = prevCount + 1;

        if (newSessionCount % 4 === 0) {
          setActualMode("longBreak");
          setActualTime(timerSettings.longBreak);
        } else {
          setActualMode("shortBreak");
          setActualTime(timerSettings.shortBreak);
        }

        return newSessionCount;
      });
    } else {
      setActualMode("work");
      setActualTime(timerSettings.work);
    }
  }, [actualMode, timerSettings]);

  const handleModeChange = (newMode: Mode) => {
    setActualMode(newMode);
    setActualTime(timerSettings[newMode]);
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setActualTime(timerSettings[actualMode]);
    setSessionCount(0);
  };

  const handleStartStop = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
      });
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning){
      if (timerEndTime.current === null){
        timerEndTime.current = Date.now() + actualTime * 1000;
      }

      interval = setInterval(() =>{
        const now = Date.now();
        const secondsLeft = Math.ceil((timerEndTime.current! - now) / 1000);
        
        if (secondsLeft <= 0){
          setActualTime(0);
          handleTimerEnd();
          timerEndTime.current = null;
        } else {
          setActualTime(secondsLeft);
        }
      }, 100);
    } else {
      timerEndTime.current = null;
    }

    return () => clearInterval(interval);
}, [isRunning, actualTime, handleTimerEnd]);

  useEffect(() => {
    const timeString = formatTime(actualTime);
    const modeLabels: Record<Mode, string> = {
      work: "Work",
      shortBreak: "Short Break",
      longBreak: "Long Break"
    };

    document.title = isRunning 
      ? `${timeString} - ${modeLabels[actualMode]}` 
      : "Pomodoro Timer";
      
  }, [actualTime, actualMode, isRunning]);

  return (
    <div className="page-layout">
      
      <header className="page-header">
        <div className="header-content">
          <h2>Pomodoro Timer</h2>
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
            handleModeChange={handleModeChange} 
          />
          
          <Timer
            actualTime={actualTime}
            isRunning={isRunning}
            handleStartStop={handleStartStop}
            handleReset={handleReset}
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

      <audio ref={audioRef} src={alertSound} preload='auto'/>

    </div>
  );
}

export default App;

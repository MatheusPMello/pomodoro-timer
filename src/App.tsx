import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- Constants & Types ---

const DEFAULT_SETTINGS = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

type Mode = "work" | "shortBreak" | "longBreak";

interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

// --- Helper Functions ---

/**
 * Formats a given time in seconds into a MM:SS string.
 */
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// --- Sub-Components ---

interface SettingsModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (settings: TimerSettings) => void;
  currentSettings: TimerSettings; // In seconds
}

const SettingsModal: React.FC<SettingsModalProps> = ({ show, onClose, onSave, currentSettings }) => {
  // Initialize state converting seconds -> minutes for display
  const [formData, setFormData] = useState<TimerSettings>({
    work: currentSettings.work / 60,
    shortBreak: currentSettings.shortBreak / 60,
    longBreak: currentSettings.longBreak / 60
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  if (!show) return null;

  return (
    <div className="feedback-modal">
      <div className="settings-content">
        <h3>Timer Settings</h3>
        
        <div className="settings-group">
          <label htmlFor="work">Work (minutes)</label>
          <input 
            id="work"
            type="number" 
            name="work"
            value={formData.work}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="settings-group">
          <label htmlFor="shortBreak">Short Break (minutes)</label>
          <input 
            id="shortBreak"
            type="number" 
            name="shortBreak"
            value={formData.shortBreak}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="settings-group">
          <label htmlFor="longBreak">Long Break (minutes)</label>
          <input 
            id="longBreak"
            type="number" 
            name="longBreak"
            value={formData.longBreak}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="action-buttons" style={{ marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button className="action-button reset-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="action-button start-button" 
            onClick={() => onSave(formData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface ModeSelectorProps {
  actualMode: Mode;
  handleModeChange: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ actualMode, handleModeChange }) => (
  <div className="mode-tabs">
    <button
      className={`mode-button ${actualMode === 'work' ? 'active' : ''}`}
      onClick={() => handleModeChange("work")}>
      Work
    </button>
    <button
      className={`mode-button ${actualMode === 'shortBreak' ? 'active' : ''}`}
      onClick={() => handleModeChange("shortBreak")}>
      Short Break
    </button>
    <button
      className={`mode-button ${actualMode === 'longBreak' ? 'active' : ''}`}
      onClick={() => handleModeChange("longBreak")}>
      Long Break
    </button>
  </div>
);

interface TimerProps {
  actualTime: number;
  isRunning: boolean;
  handleStartStop: () => void;
  handleReset: () => void;
}

const Timer: React.FC<TimerProps> = ({ actualTime, isRunning, handleStartStop, handleReset }) => (
  <div>
    <div className="timer">
      {formatTime(actualTime)}
    </div>
    <div className="action-buttons">
      <button
        className="action-button start-button"
        onClick={handleStartStop}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        className="action-button reset-button"
        onClick={handleReset}>
        Reset
      </button>
    </div>
  </div>
);

// Type for the form elements to avoid 'any'
interface FeedbackFormElements extends HTMLFormControlsCollection {
  message: HTMLTextAreaElement;
}
interface FeedbackFormElement extends HTMLFormElement {
  readonly elements: FeedbackFormElements;
}

const Feedback: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent<FeedbackFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
    })
      .then(() => {
        alert("Feedback sent successfully!");
        setShowFeedback(false); 
      })
      .catch((error) => {
        alert("Error sending feedback: " + error.message);
      });
  };

  return (
    <>
      <button className="feedback-button" onClick={() => setShowFeedback(true)}>
        Submit Feedback
      </button>
      
      {showFeedback && (
        <div className="feedback-modal">
          <form 
            name="feedback-form" 
            method="post" 
            data-netlify="true" 
            onSubmit={handleFeedbackSubmit}
          >
            <input type="hidden" name="form-name" value="feedback-form" />
            
            <h3>Share Your Feedback</h3>
            <textarea name="message" required placeholder="Tell us what you think..."></textarea>

            <div className="action-buttons" style={{ marginTop: 0, justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                className="action-button reset-button" 
                onClick={() => setShowFeedback(false)}
              >
                Cancel
              </button>
              <button type="submit" className="action-button start-button">
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

// --- Main App Component ---

function App() {
  const audioRef = useRef<HTMLAudioElement>(new Audio('/alert.mp3'));

  // Timer configuration state (in seconds)
  const [timerSettings, setTimerSettings] = useState<TimerSettings>({
    work: DEFAULT_SETTINGS.work * 60,
    shortBreak: DEFAULT_SETTINGS.shortBreak * 60,
    longBreak: DEFAULT_SETTINGS.longBreak * 60
  });

  const [showSettings, setShowSettings] = useState(false);
  
  // Timer execution state
  const [actualTime, setActualTime] = useState(timerSettings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<Mode>("work");
  const [sessionCount, setSessionCount] = useState(0);

  // --- Handlers ---

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

  const handleTimerEnd = () => {
    setIsRunning(false);
    audioRef.current.play().catch(e => console.warn("Audio autoplay blocked:", e));

    if (actualMode === "work") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % 4 === 0) {
        setActualMode("longBreak");
        setActualTime(timerSettings.longBreak);
      } else {
        setActualMode("shortBreak");
        setActualTime(timerSettings.shortBreak);
      }
    } else {
      setActualMode("work");
      setActualTime(timerSettings.work);
    }
  };

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

  // --- Effects ---

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setActualTime((prevTime) => {
          if (prevTime <= 1) {
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, actualMode, timerSettings]); // added timerSettings dependency for safety

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
            handleStartStop={() => setIsRunning(!isRunning)}
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

    </div>
  );
}

export default App;
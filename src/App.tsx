/* src/App.tsx */

import { useState, useEffect } from 'react';
import './App.css';
import { Row, Col } from 'react-bootstrap';

// NOTE: Ensure 'alert.mp3' is in your /public folder. 
// If it is in /public, we don't need to import it.
const alertAudio = new Audio('/alert.mp3');

// --- App Settings & Types ---

/**
 * Represents the possible timer modes.
 */
type Mode = "work" | "shortBreak" | "longBreak";

// --- Helper Functions ---

/**
 * Formats a given time in seconds into a MM:SS string.
 */
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

// --- Child Components ---

const SettingsModal = ({ show, onClose, onSave, currentSettings }: any) => {
  // Initialize local state with current settings (converted to minutes)
  const [formData, setFormData] = useState({
    work: currentSettings.work / 60,
    shortBreak: currentSettings.shortBreak / 60,
    longBreak: currentSettings.longBreak / 60
  });

  // Update local state when inputs change
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
      <div className="settings-content" style={{ background: 'white', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%' }}>
        <h3 style={{marginBottom: '1rem', color: '#4a5568'}}>Timer Settings</h3>
        
        <div className="settings-group">
          <label>Work (minutes)</label>
          <input 
            type="number" 
            name="work"
            value={formData.work}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="settings-group">
          <label>Short Break (minutes)</label>
          <input 
            type="number" 
            name="shortBreak"
            value={formData.shortBreak}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="settings-group">
          <label>Long Break (minutes)</label>
          <input 
            type="number" 
            name="longBreak"
            value={formData.longBreak}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="feedback-controls" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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

const ModeSelector = ({ actualMode, handleModeChange }: ModeSelectorProps) => (
  <Row className="justify-content-center">
    <Col className="mode-tabs">
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
    </Col>
  </Row>
);

interface TimerProps {
  actualTime: number;
  buttonText: string;
  handleStartStop: () => void;
  handleReset: () => void;
}

const Timer = ({ actualTime, buttonText, handleStartStop, handleReset }: TimerProps) => (
  <div>
    <Row className="justify-content-center">
      <Col className="timer">
        {formatTime(actualTime)}
      </Col>
    </Row>
    <Row className="justify-content-center action-buttons">
      <button
        className="action-button start-button"
        onClick={handleStartStop}>
        {buttonText}
      </button>
      <button
        className="action-button reset-button"
        onClick={handleReset}>
        Reset
      </button>
    </Row>
  </div>
);

const Feedback = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
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
      <button className="feedback-button" onClick={() => setShowFeedback(true)}>Feedback</button>
      {showFeedback && (
        <div className="feedback-modal">
          <form name="feedback-form" method="post" data-netlify="true" onSubmit={handleFeedbackSubmit}>
            <input type="hidden" name="form-name" value="feedback-form" />
            
            <h3>Share Your Feedback</h3>
            <textarea name="message" required></textarea>

            <div className="feedback-controls">
              <button type="button" className="action-button reset-button" onClick={() => setShowFeedback(false)}>
                Cancel
              </button>
              <button type="submit" className="action-button start-button">Send</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

// --- Main App Component ---

function App() {
  // 1. NEW STATE: The "Database" for our time rules
  const [timerSettings, setTimerSettings] = useState({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  });

  // 2. NEW STATE: To show/hide the settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Existing State
  const [actualTime, setActualTime] = useState(timerSettings.work);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<Mode>("work");
  const [sessionCount, setSessionCount] = useState(0);

  // --- HANDLER: Save Settings ---
  const handleSaveSettings = (newSettingsInMinutes: { work: number; shortBreak: number; longBreak: number }) => {
    // Convert minutes to seconds
    const newSettingsInSeconds = {
      work: newSettingsInMinutes.work * 60,
      shortBreak: newSettingsInMinutes.shortBreak * 60,
      longBreak: newSettingsInMinutes.longBreak * 60,
    };

    // Update the State
    setTimerSettings(newSettingsInSeconds);
    
    // Immediate update if timer is stopped
    if (!isRunning) {
      setActualTime(newSettingsInSeconds[actualMode]);
    }
    
    // Close the modal
    setShowSettings(false);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

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
  }, [isRunning, actualMode]); // Added actualMode dependency

  useEffect(() => {
    const timeString = formatTime(actualTime);

    let modeText = "Work";
    if (actualMode === "shortBreak"){
      modeText = "Short Break";
    } else if (actualMode === "longBreak") {
      modeText = "Long Break";
    }

    if (isRunning){
      document.title = `${timeString} - ${modeText}`;
    } else {
      document.title = "Pomodoro Timer";
    }
  }, [actualTime, actualMode, isRunning]);

  const handleTimerEnd = () => {
    setIsRunning(false);
    alertAudio.play().catch(e => console.error("Audio play failed:", e));

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

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

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
          <p style={{ textAlign: 'center', color: '#718096' }}>Session: {sessionCount} / 4</p>
          
          <ModeSelector 
            actualMode={actualMode} 
            handleModeChange={handleModeChange} 
          />
          
          <Timer
            actualTime={actualTime}
            // Removed isRunning prop here because Timer doesn't accept it
            buttonText={isRunning ? "Pause" : "Start"}
            handleStartStop={handleStartStop}
            handleReset={handleReset}
          />
        </div>
      </main>

      {/* RENDER THE SETTINGS MODAL */}
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
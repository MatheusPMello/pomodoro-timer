/* src/App.tsx */

import { useState, useEffect } from 'react';
import './App.css';
import { Row, Col } from 'react-bootstrap';

// --- App Settings & Types ---

/**
 * Represents the possible timer modes.
 * @typedef {('work'|'shortBreak'|'longBreak')} Mode
 */
type Mode = "work" | "shortBreak" | "longBreak";

/**
 * A mapping of timer modes to their duration in seconds.
 * @type {Object.<Mode, number>}
 */
const POMODORO_TIMES: { [key in Mode]: number } = {
  work: 25 * 60,       // 25 minutes
  shortBreak: 5 * 60,  // 5 minutes
  longBreak: 15 * 60,  // 15 minutes
};

/**
 * Audio element to be played when a timer session ends.
 * @type {HTMLAudioElement}
 */
const alertAudio = new Audio('/alert.mp3');

// --- Helper Functions ---

/**
 * Formats a given time in seconds into a MM:SS string.
 * @param {number} timeInSeconds - The time in seconds to format.
 * @returns {string} The formatted time string (e.g., "25:00").
 */
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

// --- Child Components ---

/**
 * Props for the ModeSelector component.
 * @interface
 */
interface ModeSelectorProps {
  /** The current active timer mode. */
  actualMode: Mode;
  /** Function to handle mode changes. */
  handleModeChange: (mode: Mode) => void;
}

/**
 * A component that renders buttons to switch between timer modes.
 * @param {ModeSelectorProps} props - The props for the component.
 * @returns {JSX.Element}
 */
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

/**
 * Props for the Timer component.
 * @interface
 */
interface TimerProps {
  /** The current time in seconds to display. */
  actualTime: number;
  /** The text to display on the start/stop button. */
  buttonText: string;
  /** Function to handle starting or stopping the timer. */
  handleStartStop: () => void;
  /** Function to handle resetting the timer. */
  handleReset: () => void;
}

/**
 * A component that displays the timer and action buttons.
 * @param {TimerProps} props - The props for the component.
 * @returns {JSX.Element}
 */
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

// --- Main App Component ---

/**
 * The main application component for the Pomodoro Timer.
 * It manages the timer state, mode, and user interactions.
 * @returns {JSX.Element}
 */
/**
/**
 * A component that renders the feedback button and modal.
 * @returns {JSX.Element}
 */
const Feedback = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  /**
   * Handles the submission of the feedback form to Netlify.
   * It uses URLSearchParams to correctly encode the form data.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submit event.
   */
  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevent the default browser reload
    e.preventDefault();

    // 2. Get the form data from the event
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 3. POST the data to Netlify
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    })
      .then(() => {
        // Success!
        alert("Feedback sent successfully!");
        setShowFeedback(false); // Close the modal
      })
      .catch((error) => {
        // Error
        alert("Error sending feedback: " + error.message);
      });
  };

  return (
    <>
      <button className="feedback-button" onClick={() => setShowFeedback(true)}>Feedback</button>
      {showFeedback && (
        <div className="feedback-modal">
          {/* This form is now correctly configured. */}
          <form name="feedback-form" method="post" data-netlify="true" onSubmit={handleFeedbackSubmit}>
            {/* The hidden input's 'value' matches the form's 'name' */}
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

/**
 * The main application component for the Pomodoro Timer.
 * It manages the timer state, mode, and user interactions.
 * @returns {JSX.Element}
 */
function App() {
  /** State for the current time in seconds. */
  const [actualTime, setActualTime] = useState(POMODORO_TIMES.work);
  /** State to track if the timer is running. */
  const [isRunning, setIsRunning] = useState(false);
  /** State for the current timer mode. */
  const [actualMode, setActualMode] = useState<Mode>("work");
  /** State to count completed work sessions. */
  const [sessionCount, setSessionCount] = useState(0);

  /**
   * Effect to handle the timer countdown.
   * Sets up an interval when `isRunning` is true and clears it on cleanup.
   */
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
  }, [isRunning, actualMode]);

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

  /**
   * Handles the logic when the timer reaches zero.
   * It stops the timer, plays an alert, and switches to the next mode.
   */
  const handleTimerEnd = () => {
    setIsRunning(false);
    alertAudio.play().catch(e => console.error("Audio play failed:", e));

    if (actualMode === "work") {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      if (newSessionCount % 4 === 0) {
        setActualMode("longBreak");
        setActualTime(POMODORO_TIMES.longBreak);
      } else {
        setActualMode("shortBreak");
        setActualTime(POMODORO_TIMES.shortBreak);
      }
    } else {
      setActualMode("work");
      setActualTime(POMODORO_TIMES.work);
    }
  };

  /**
   * Changes the timer mode and resets the timer.
   * @param {Mode} newMode - The new mode to switch to.
   */
  const handleModeChange = (newMode: Mode) => {
    setActualMode(newMode);
    setActualTime(POMODORO_TIMES[newMode]);
    setIsRunning(false);
  };

  /**
   * Resets the timer to the current mode's starting time and stops it.
   * Also resets the session count.
   */
  const handleReset = () => {
    setIsRunning(false);
    setActualTime(POMODORO_TIMES[actualMode]);
    setSessionCount(0);
  };

  /**
   * Toggles the timer between running and paused states.
   */
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="page-layout">
      
      <header className="page-header">
        <div className="header-content">
          <h2>Pomodoro Timer</h2>
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
            buttonText={isRunning ? "Pause" : "Start"}
            handleStartStop={handleStartStop}
            handleReset={handleReset}
          />
        </div>
      </main>

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
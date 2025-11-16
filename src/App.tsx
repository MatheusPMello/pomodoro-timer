import { useState, useEffect } from 'react';
import './App.css';
import { Row, Col } from 'react-bootstrap';

/**
 * Represents the possible modes for the Pomodoro timer.
 */
type Mode = "work" | "shortBreak" | "longBreak";

/**
 * Defines the duration in seconds for each Pomodoro mode.
 */
const POMODORO_TIMES = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

/**
 * Formats a time value in seconds into a `mm:ss` string.
 * @param {number} timeInSeconds - The time in seconds to format.
 * @returns {string} The formatted time string.
 */
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

/**
 * Props for the ModeSelector component.
 * @interface
 */
interface ModeSelectorProps {
  actualMode: Mode;
  handleModeChange: (mode: Mode) => void;
}

/**
 * Renders the mode selection buttons.
 * @param {ModeSelectorProps} props - The component props.
 * @returns {JSX.Element} The rendered mode selector.
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
  actualTime: number;
  isRunning: boolean;
  handleStartStop: () => void;
  handleReset: () => void;
}

/**
 * Renders the timer display and action buttons.
 * @param {TimerProps} props - The component props.
 * @returns {JSX.Element} The rendered timer.
 */
const Timer = ({ actualTime, isRunning, handleStartStop, handleReset }: TimerProps) => (
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
        {isRunning ? "Pause" : "Start"}
      </button>
      <button
        className="action-button reset-button"
        onClick={handleReset}>
        Reset
      </button>
    </Row>
  </div>
);

/**
 * The main application component for the Pomodoro timer.
 * @returns {JSX.Element} The rendered application component.
 */
function App() {
  const [actualTime, setActualTime] = useState(POMODORO_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [actualMode, setActualMode] = useState<Mode>("work");
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && actualTime > 0) {
      interval = setInterval(() => {
        setActualTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (actualTime === 0) {
      handleTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isRunning, actualTime]);

  /**
   * Handles the logic when the timer reaches zero.
   */
  const handleTimerEnd = () => {
    setIsRunning(false);
    const audio = new Audio('/src/assets/alert.mp3');
    audio.play();

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
   * @param {Mode} newMode - The new mode to set.
   */
  const handleModeChange = (newMode: Mode) => {
    setActualMode(newMode);
    setActualTime(POMODORO_TIMES[newMode]);
    setIsRunning(false);
  };

  /**
   * Resets the timer to the current mode's default time and stops it.
   */
  const handleReset = () => {
    setIsRunning(false);
    setActualTime(POMODORO_TIMES[actualMode]);
  };

  /**
   * Toggles the timer between running and paused states.
   */
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className={`pomodoro-container ${actualMode}`}>
      <p >Session: {sessionCount} / 4</p>
      <ModeSelector actualMode={actualMode} handleModeChange={handleModeChange} />
      <Timer
        actualTime={actualTime}
        isRunning={isRunning}
        handleStartStop={handleStartStop}
        handleReset={handleReset}
      />
    </div>
  );
}

export default App;
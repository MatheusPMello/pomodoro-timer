import React from 'react';
import { type TimerProps } from '../types';
import { formatTime } from '../utils/timeHelpers';

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

export default Timer;
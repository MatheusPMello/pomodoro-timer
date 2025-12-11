import React from 'react';
import { type TimerProps } from '../types';
import { formatTime } from '../utils/timeHelpers';

import styles from './Timer.module.css';

const Timer: React.FC<TimerProps> = ({ actualTime, isRunning, handleStartStop, handleReset }) => (
  <div>
    <div className={styles.timer}>
      {formatTime(actualTime)}
    </div>
    <div className={styles.actionButtons}>
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
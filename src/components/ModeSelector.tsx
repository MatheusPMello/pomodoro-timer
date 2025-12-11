import React from 'react';
import { type ModeSelectorProps } from '../types';
import styles from './ModeSelector.module.css';

const ModeSelector: React.FC<ModeSelectorProps> = ({ actualMode, handleModeChange }) => (
  <div className={styles.modeTabs}>
    <button
      className={`${styles.modeButton} ${actualMode === 'work' ? styles.active : ''}`}
      onClick={() => handleModeChange("work")}>
      Work
    </button>
    <button
      className={`${styles.modeButton} ${actualMode === 'shortBreak' ? styles.active : ''}`}
      onClick={() => handleModeChange("shortBreak")}>
      Short Break
    </button>
    <button
      className={`${styles.modeButton} ${actualMode === 'longBreak' ? styles.active : ''}`}
      onClick={() => handleModeChange("longBreak")}>
      Long Break
    </button>
  </div>
);

export default ModeSelector;
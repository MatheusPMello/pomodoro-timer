import React from 'react';
import { type ModeSelectorProps } from '../types';

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

export default ModeSelector;
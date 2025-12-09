// src/utils/timeHelpers.ts

/**
 * Formats a given time in seconds into a MM:SS string.
 * @param {number} timeInSeconds - The time in seconds to format.
 * @returns {string} The formatted time string (e.g., "25:00").
 */
export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};
import { useRef } from 'react';
import alertSound from '../assets/alert.mp3';

export const useAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  /**
   * Plays the alert sound from the start
   */
  const playAlert = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  };

  /**
   * "Primes" the audio (play/pause instantly) to unlock browser autoplay restrictions.
   * Call this on a user click event (like Start).
   */
  const primeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Expected error if file not loaded, we just need the user gesture
      });
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { 
    audioRef, 
    alertSound, 
    playAlert, 
    primeAudio 
  };
};
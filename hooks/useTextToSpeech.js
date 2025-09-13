import { useState, useEffect, useCallback, useRef } from 'react';
import ttsService from '../services/textToSpeechService';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);
  const [settings, setSettings] = useState({
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    voice: null,
  });
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const currentSpeechRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Initialize TTS service and load voices
  useEffect(() => {
    const initializeTTS = async () => {
      try {
        // Wait a bit for voices to load
        setTimeout(() => {
          const voices = ttsService.getAvailableVoices();
          setAvailableVoices(voices);
          
          const currentSettings = ttsService.getSettings();
          setSettings(currentSettings);
        }, 100);
      } catch (err) {
        setError('Failed to initialize text-to-speech');
        console.error('TTS initialization error:', err);
      }
    };

    initializeTTS();
  }, []);

  // Update TTS service settings when local settings change
  useEffect(() => {
    ttsService.updateSettings(settings);
  }, [settings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startProgressTracking = useCallback(() => {
    setProgress(0);
    progressIntervalRef.current = setInterval(() => {
      if (ttsService.isSpeaking() && !ttsService.isPaused()) {
        setProgress(prev => Math.min(prev + 1, 95)); // Don't go to 100% until actually finished
      }
    }, 100);
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(100);
    setTimeout(() => setProgress(0), 500); // Reset after a brief delay
  }, []);

  const speak = useCallback(async (text) => {
    if (!text || !text.trim()) {
      setError('No text provided to speak');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setCurrentText(text);

      const speechOptions = {
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          setIsLoading(false);
          startProgressTracking();
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsPaused(false);
          stopProgressTracking();
        },
        onError: (error) => {
          setError(`Speech error: ${error.message || error.error || 'Unknown error'}`);
          setIsPlaying(false);
          setIsPaused(false);
          setIsLoading(false);
          stopProgressTracking();
        },
        onPause: () => {
          setIsPaused(true);
        },
        onResume: () => {
          setIsPaused(false);
        },
      };

      // Use chunked speaking for long text
      if (text.length > 200) {
        currentSpeechRef.current = ttsService.speakLongText(text, speechOptions);
      } else {
        currentSpeechRef.current = ttsService.speak(text, speechOptions);
      }

      await currentSpeechRef.current;
    } catch (err) {
      setError(`Failed to speak text: ${err.message}`);
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
      stopProgressTracking();
    }
  }, [startProgressTracking, stopProgressTracking]);

  const pause = useCallback(() => {
    try {
      const success = ttsService.pause();
      if (success) {
        setIsPaused(true);
      }
      return success;
    } catch (err) {
      setError(`Failed to pause speech: ${err.message}`);
      return false;
    }
  }, []);

  const resume = useCallback(() => {
    try {
      const success = ttsService.resume();
      if (success) {
        setIsPaused(false);
      }
      return success;
    } catch (err) {
      setError(`Failed to resume speech: ${err.message}`);
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    try {
      const success = ttsService.stop();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentText('');
      stopProgressTracking();
      
      if (currentSpeechRef.current) {
        currentSpeechRef.current = null;
      }
      
      return success;
    } catch (err) {
      setError(`Failed to stop speech: ${err.message}`);
      return false;
    }
  }, [stopProgressTracking]);

  const togglePlayPause = useCallback(() => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPaused) {
      resume();
    } else if (currentText) {
      speak(currentText);
    }
  }, [isPlaying, isPaused, currentText, pause, resume, speak]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const updateVoice = useCallback((voice) => {
    updateSettings({ voice });
  }, [updateSettings]);

  const updateRate = useCallback((rate) => {
    updateSettings({ rate: Math.max(0.1, Math.min(10, rate)) });
  }, [updateSettings]);

  const updatePitch = useCallback((pitch) => {
    updateSettings({ pitch: Math.max(0, Math.min(2, pitch)) });
  }, [updateSettings]);

  const updateVolume = useCallback((volume) => {
    updateSettings({ volume: Math.max(0, Math.min(1, volume)) });
  }, [updateSettings]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isSupported = ttsService.isSupported();

  return {
    // State
    isPlaying,
    isPaused,
    isLoading,
    currentText,
    availableVoices,
    settings,
    error,
    progress,
    isSupported,
    
    // Actions
    speak,
    pause,
    resume,
    stop,
    togglePlayPause,
    
    // Settings
    updateSettings,
    updateVoice,
    updateRate,
    updatePitch,
    updateVolume,
    
    // Utilities
    clearError,
  };
};

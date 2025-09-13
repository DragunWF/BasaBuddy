import { useState, useRef } from 'react';
import * as Speech from 'expo-speech';

const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const textChunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const isSpeakingRef = useRef(false);

  // Split text into manageable chunks to avoid synthesis cutoffs
  const splitTextIntoChunks = (text, maxLength = 200) => {
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks.filter(chunk => chunk.length > 0);
  };

  const speakChunk = (chunkIndex) => {
    if (chunkIndex >= textChunksRef.current.length) {
      // Finished speaking all chunks
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      return;
    }

    const chunk = textChunksRef.current[chunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    
    // Configure the utterance for Tassie's cute voice
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current;
    }
    
    // Make it sound cute and friendly
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.2; // Higher pitch for cuteness
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setError(null);
    };

    utterance.onend = () => {
      currentChunkIndexRef.current++;
      const newProgress = ((currentChunkIndexRef.current) / textChunksRef.current.length) * 100;
      setProgress(newProgress);
      
      // Continue to next chunk
      setTimeout(() => speakChunk(currentChunkIndexRef.current), 100);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setError('Sorry, I had trouble speaking that part!');
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const speak = (text) => {
    if (!text || !text.trim()) {
      setError('No text to read!');
      return;
    }

    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      return;
    }

    stop(); // Stop any current speech
    
    setIsLoading(true);
    setCurrentText(text);
    setProgress(0);
    setError(null);
    
    // Split text into chunks
    textChunksRef.current = splitTextIntoChunks(text);
    currentChunkIndexRef.current = 0;
    
    setIsLoading(false);
    speakChunk(0);
  };

  const pause = () => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    currentChunkIndexRef.current = 0;
    textChunksRef.current = [];
    utteranceRef.current = null;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      resume();
    } else if (currentText) {
      speak(currentText);
    }
  };

  // Get the selected voice info for display
  const getVoiceInfo = () => {
    return selectedVoiceRef.current ? {
      name: selectedVoiceRef.current.name,
      lang: selectedVoiceRef.current.lang
    } : null;
  };

  return {
    speak,
    pause,
    resume,
    stop,
    togglePlayPause,
    isPlaying,
    isPaused,
    progress,
    error,
    isLoading,
    currentText,
    isSupported: 'speechSynthesis' in window,
    voiceInfo: getVoiceInfo()
  };
};

export default useTextToSpeech;

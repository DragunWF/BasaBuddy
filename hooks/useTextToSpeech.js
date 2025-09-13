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

  const speakChunk = async (chunkIndex) => {
    if (chunkIndex >= textChunksRef.current.length) {
      // Finished speaking all chunks
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      isSpeakingRef.current = false;
      return;
    }

    const chunk = textChunksRef.current[chunkIndex];
    
    try {
      // Configure speech options for Tassie's cute voice
      const speechOptions = {
        rate: 0.8, // Slightly slower for clarity
        pitch: 1.3, // Higher pitch for cuteness
        volume: 0.9,
        language: 'en-US',
        onStart: () => {
          setIsPlaying(true);
          setIsPaused(false);
          setError(null);
        },
        onDone: () => {
          currentChunkIndexRef.current++;
          const newProgress = ((currentChunkIndexRef.current) / textChunksRef.current.length) * 100;
          setProgress(newProgress);
          
          // Continue to next chunk if still speaking
          if (isSpeakingRef.current) {
            setTimeout(() => speakChunk(currentChunkIndexRef.current), 300);
          }
        },
        onError: (error) => {
          console.error('Speech synthesis error:', error);
          setError('Sorry, I had trouble speaking that part!');
          setIsPlaying(false);
          setIsPaused(false);
          isSpeakingRef.current = false;
        }
      };

      await Speech.speak(chunk, speechOptions);
    } catch (error) {
      console.error('Speech error:', error);
      setError('Sorry, speech is not available right now!');
      setIsPlaying(false);
      setIsPaused(false);
      isSpeakingRef.current = false;
    }
  };

  const speak = async (text) => {
    if (!text || !text.trim()) {
      setError('No text to read!');
      return;
    }

    // Check if speech is available
    const isAvailable = await Speech.isSpeakingAsync();
    if (isAvailable) {
      await Speech.stop();
    }
    
    setIsLoading(true);
    setCurrentText(text);
    setProgress(0);
    setError(null);
    isSpeakingRef.current = true;
    
    // Split text into chunks
    textChunksRef.current = splitTextIntoChunks(text);
    currentChunkIndexRef.current = 0;
    
    setIsLoading(false);
    await speakChunk(0);
  };

  const pause = async () => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        // Expo Speech doesn't have pause/resume, so we stop and track position
        await Speech.stop();
        setIsPaused(true);
        setIsPlaying(false);
        isSpeakingRef.current = false;
      }
    } catch (error) {
      console.error('Pause error:', error);
    }
  };

  const resume = async () => {
    if (isPaused && textChunksRef.current.length > 0) {
      setIsPaused(false);
      isSpeakingRef.current = true;
      await speakChunk(currentChunkIndexRef.current);
    }
  };

  const stop = async () => {
    try {
      await Speech.stop();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
      currentChunkIndexRef.current = 0;
      textChunksRef.current = [];
      isSpeakingRef.current = false;
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      await pause();
    } else if (isPaused) {
      await resume();
    } else if (currentText) {
      await speak(currentText);
    }
  };

  // Get voice info for display
  const getVoiceInfo = () => {
    return {
      name: "Tassie's Voice",
      lang: "en-US"
    };
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
    isSupported: true, // Expo Speech is always supported
    voiceInfo: getVoiceInfo()
  };
};

export default useTextToSpeech;

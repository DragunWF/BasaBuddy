/**
 * Text-to-Speech Service
 * Provides cross-platform TTS functionality using Web Speech API for web
 * and platform-specific solutions for native platforms
 */

import { Platform } from 'react-native';
import * as Speech from 'expo-speech';

class TextToSpeechService {
  constructor() {
    this.synthesis = null;
    this.utterance = null;
    this.isInitialized = false;
    this.availableVoices = [];
    this.currentSettings = {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      voice: null,
    };
    this.isSpeaking = false;
    this.isPaused = false;
    
    this.initialize();
  }

  async initialize() {
    if (Platform.OS === 'web') {
      // Web Speech API for web platform
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
        this.isInitialized = true;
        
        // Load voices
        this.loadVoices();
        
        // Handle voices loaded event (some browsers load voices asynchronously)
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = () => {
            this.loadVoices();
          };
        }
      } else {
        console.warn('Speech synthesis not supported in this browser');
      }
    } else {
      // For React Native, use Expo Speech
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        this.availableVoices = voices.map(voice => ({
          name: voice.name,
          lang: voice.language,
          identifier: voice.identifier,
        }));
        this.isInitialized = true;
        
        // Set default voice
        if (this.availableVoices.length > 0) {
          const englishVoice = this.availableVoices.find(voice => 
            voice.lang.startsWith('en')
          );
          this.currentSettings.voice = englishVoice || this.availableVoices[0];
        }
      } catch (error) {
        console.warn('Failed to initialize Expo Speech:', error);
      }
    }
  }

  loadVoices() {
    if (this.synthesis) {
      this.availableVoices = this.synthesis.getVoices();
      
      // Set default voice to first English voice if available
      if (!this.currentSettings.voice && this.availableVoices.length > 0) {
        const englishVoice = this.availableVoices.find(voice => 
          voice.lang.startsWith('en')
        );
        this.currentSettings.voice = englishVoice || this.availableVoices[0];
      }
    }
  }

  getAvailableVoices() {
    return this.availableVoices;
  }

  updateSettings(newSettings) {
    this.currentSettings = {
      ...this.currentSettings,
      ...newSettings,
    };
  }

  getSettings() {
    return { ...this.currentSettings };
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('TTS not initialized or not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      const settings = { ...this.currentSettings, ...options };

      if (Platform.OS === 'web') {
        if (!this.synthesis) {
          reject(new Error('Web Speech API not available'));
          return;
        }

        // Create new utterance
        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Apply settings
        this.utterance.rate = settings.rate;
        this.utterance.pitch = settings.pitch;
        this.utterance.volume = settings.volume;
        
        if (settings.voice) {
          this.utterance.voice = settings.voice;
        }

        // Set up event listeners
        this.utterance.onstart = () => {
          this.isSpeaking = true;
          this.isPaused = false;
          if (options.onStart) options.onStart();
        };

        this.utterance.onend = () => {
          this.isSpeaking = false;
          this.isPaused = false;
          if (options.onEnd) options.onEnd();
          resolve();
        };

        this.utterance.onerror = (event) => {
          this.isSpeaking = false;
          this.isPaused = false;
          if (options.onError) options.onError(event);
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        this.utterance.onpause = () => {
          this.isPaused = true;
          if (options.onPause) options.onPause();
        };

        this.utterance.onresume = () => {
          this.isPaused = false;
          if (options.onResume) options.onResume();
        };

        // Start speaking
        this.synthesis.speak(this.utterance);
      } else {
        // Use Expo Speech for React Native
        const speechOptions = {
          rate: settings.rate,
          pitch: settings.pitch,
          volume: settings.volume,
          voice: settings.voice?.identifier,
          onStart: () => {
            this.isSpeaking = true;
            this.isPaused = false;
            if (options.onStart) options.onStart();
          },
          onDone: () => {
            this.isSpeaking = false;
            this.isPaused = false;
            if (options.onEnd) options.onEnd();
            resolve();
          },
          onStopped: () => {
            this.isSpeaking = false;
            this.isPaused = false;
            if (options.onEnd) options.onEnd();
            resolve();
          },
          onError: (error) => {
            this.isSpeaking = false;
            this.isPaused = false;
            if (options.onError) options.onError(error);
            reject(new Error(`Speech synthesis error: ${error}`));
          },
        };

        Speech.speak(text, speechOptions);
      }
    });
  }

  pause() {
    if (Platform.OS === 'web') {
      if (this.synthesis && this.synthesis.speaking && !this.synthesis.paused) {
        this.synthesis.pause();
        this.isPaused = true;
        return true;
      }
    } else {
      // Expo Speech doesn't support pause/resume, so we stop instead
      Speech.stop();
      this.isSpeaking = false;
      this.isPaused = false;
    }
    return false;
  }

  resume() {
    if (Platform.OS === 'web') {
      if (this.synthesis && this.synthesis.paused) {
        this.synthesis.resume();
        this.isPaused = false;
        return true;
      }
    }
    // Expo Speech doesn't support resume
    return false;
  }

  stop() {
    if (Platform.OS === 'web') {
      if (this.synthesis) {
        this.synthesis.cancel();
        this.isSpeaking = false;
        this.isPaused = false;
        return true;
      }
    } else {
      Speech.stop();
      this.isSpeaking = false;
      this.isPaused = false;
      return true;
    }
    return false;
  }

  isSpeaking() {
    if (Platform.OS === 'web') {
      return this.synthesis ? this.synthesis.speaking : false;
    }
    return this.isSpeaking;
  }

  isPaused() {
    if (Platform.OS === 'web') {
      return this.synthesis ? this.synthesis.paused : false;
    }
    return this.isPaused;
  }

  isSupported() {
    return this.isInitialized;
  }

  // Utility method to chunk long text for better performance
  chunkText(text, maxLength = 200) {
    if (text.length <= maxLength) {
      return [text];
    }

    const chunks = [];
    const sentences = text.split(/[.!?]+/);
    let currentChunk = '';

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      const sentenceWithPunctuation = trimmedSentence + '.';
      
      if (currentChunk.length + sentenceWithPunctuation.length <= maxLength) {
        currentChunk += (currentChunk ? ' ' : '') + sentenceWithPunctuation;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
        }
        currentChunk = sentenceWithPunctuation;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.length > 0 ? chunks : [text];
  }

  // Method to speak long text with chunking
  async speakLongText(text, options = {}) {
    const chunks = this.chunkText(text);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      try {
        await this.speak(chunk, {
          ...options,
          onStart: i === 0 ? options.onStart : undefined,
          onEnd: i === chunks.length - 1 ? options.onEnd : undefined,
        });
      } catch (error) {
        if (options.onError) {
          options.onError(error);
        }
        throw error;
      }
    }
  }
}

// Create singleton instance
const ttsService = new TextToSpeechService();

export default ttsService;

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TTSControls = ({ 
  isPlaying, 
  isPaused, 
  isLoading, 
  progress, 
  onPlay, 
  onPause, 
  onStop, 
  onTogglePlayPause,
  disabled = false 
}) => {
  const getPlayButtonIcon = () => {
    if (isLoading) return null;
    if (isPlaying) return 'pause';
    return 'play';
  };

  const getPlayButtonColor = () => {
    if (disabled) return '#ccc';
    return '#FE9F1F';
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      {/* Progress Bar */}
      {progress > 0 && (
        <View className="mb-4">
          <View className="bg-gray-200 rounded-full h-2">
            <View 
              className="bg-[#FE9F1F] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500 mt-1 text-center">
            {Math.round(progress)}% complete
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      <View className="flex-row items-center justify-center space-x-4">
        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={() => onTogglePlayPause && onTogglePlayPause()}
          disabled={disabled || isLoading}
          className={`w-16 h-16 rounded-full items-center justify-center ${
            disabled ? 'bg-gray-200' : 'bg-[#FE9F1F]'
          }`}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons 
              name={getPlayButtonIcon()} 
              size={28} 
              color={disabled ? '#999' : 'white'} 
            />
          )}
        </TouchableOpacity>

        {/* Stop Button */}
        <TouchableOpacity
          onPress={() => onStop && onStop()}
          disabled={disabled || (!isPlaying && !isPaused)}
          className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
            disabled || (!isPlaying && !isPaused)
              ? 'border-gray-300 bg-gray-100' 
              : 'border-[#FE9F1F] bg-white'
          }`}
          activeOpacity={0.8}
        >
          <Ionicons 
            name="stop" 
            size={20} 
            color={
              disabled || (!isPlaying && !isPaused) 
                ? '#ccc' 
                : '#FE9F1F'
            } 
          />
        </TouchableOpacity>
      </View>

      {/* Status Text */}
      <View className="mt-3 items-center">
        {isLoading && (
          <Text className="text-sm text-gray-600">
            Preparing to read...
          </Text>
        )}
        {isPlaying && (
          <Text className="text-sm text-[#FE9F1F] font-medium">
            🎵 Tassie is reading...
          </Text>
        )}
        {isPaused && (
          <Text className="text-sm text-gray-600">
            Paused - tap play to continue
          </Text>
        )}
        {!isPlaying && !isPaused && !isLoading && progress === 0 && (
          <Text className="text-sm text-gray-500">
            Ready to read
          </Text>
        )}
        {progress === 100 && !isPlaying && (
          <Text className="text-sm text-green-600 font-medium">
            ✅ Finished reading!
          </Text>
        )}
      </View>
    </View>
  );
};

export default TTSControls;

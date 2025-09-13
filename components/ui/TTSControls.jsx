import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Slider } from '@react-native-community/slider';
import { mainColors } from '../../constants/colors';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';

const TTSControls = ({ 
  text, 
  style, 
  showProgress = true, 
  showSettings = true,
  compact = false 
}) => {
  const {
    isPlaying,
    isPaused,
    isLoading,
    settings,
    availableVoices,
    error,
    progress,
    isSupported,
    speak,
    pause,
    resume,
    stop,
    togglePlayPause,
    updateRate,
    updatePitch,
    updateVolume,
    updateVoice,
    clearError,
  } = useTextToSpeech();

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!isSupported) {
    return (
      <View style={[{ opacity: 0.5 }, style]}>
        <TouchableOpacity 
          className="flex-row items-center justify-center p-2 bg-gray-200 rounded-full"
          disabled
        >
          <Ionicons name="volume-mute" size={20} color={mainColors.gray} />
          {!compact && (
            <Text className="ml-2 text-gray-500 text-sm">TTS not supported</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  const handlePlayPress = () => {
    clearError();
    if (!isPlaying && !isPaused) {
      speak(text);
    } else {
      togglePlayPause();
    }
  };

  const handleStopPress = () => {
    stop();
  };

  const getPlayButtonIcon = () => {
    if (isLoading) return null;
    if (isPlaying && !isPaused) return 'pause';
    return 'play';
  };

  const renderCompactControls = () => (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      <TouchableOpacity
        onPress={handlePlayPress}
        className="p-2 bg-white rounded-full shadow-sm border border-gray-200"
        disabled={isLoading || !text?.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={mainColors.primary500} />
        ) : (
          <Ionicons 
            name={getPlayButtonIcon()} 
            size={20} 
            color={!text?.trim() ? mainColors.gray : mainColors.primary500} 
          />
        )}
      </TouchableOpacity>

      {(isPlaying || isPaused) && (
        <TouchableOpacity
          onPress={handleStopPress}
          className="ml-2 p-2 bg-white rounded-full shadow-sm border border-gray-200"
        >
          <Ionicons name="stop" size={20} color={mainColors.primary500} />
        </TouchableOpacity>
      )}

      {showSettings && (
        <TouchableOpacity
          onPress={() => setShowSettingsModal(true)}
          className="ml-2 p-2 bg-white rounded-full shadow-sm border border-gray-200"
        >
          <Ionicons name="settings" size={18} color={mainColors.gray} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFullControls = () => (
    <View style={[{ padding: 12, backgroundColor: 'white', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }, style]}>
      {/* Main Controls */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handlePlayPress}
            className="p-3 bg-[#FE9F1F] rounded-full mr-3"
            disabled={isLoading || !text?.trim()}
            style={{ opacity: (!text?.trim() || isLoading) ? 0.5 : 1 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name={getPlayButtonIcon()} size={24} color="white" />
            )}
          </TouchableOpacity>

          {(isPlaying || isPaused) && (
            <TouchableOpacity
              onPress={handleStopPress}
              className="p-3 bg-gray-500 rounded-full mr-3"
            >
              <Ionicons name="stop" size={24} color="white" />
            </TouchableOpacity>
          )}

          <View>
            <Text className="font-semibold text-gray-800">
              {isLoading ? 'Loading...' : 
               isPlaying && !isPaused ? 'Playing' :
               isPaused ? 'Paused' : 'Ready to play'}
            </Text>
            {text && (
              <Text className="text-sm text-gray-500" numberOfLines={1}>
                {text.length > 50 ? `${text.substring(0, 50)}...` : text}
              </Text>
            )}
          </View>
        </View>

        {showSettings && (
          <TouchableOpacity
            onPress={() => setShowSettingsModal(true)}
            className="p-2"
          >
            <Ionicons name="settings" size={24} color={mainColors.gray} />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar */}
      {showProgress && (isPlaying || isPaused) && (
        <View className="mb-2">
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#FE9F1F] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View className="mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <>
      {compact ? renderCompactControls() : renderFullControls()}

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettingsModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-4">
          <View className="bg-white rounded-xl w-full max-w-sm max-h-96">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-center">Voice Settings</Text>
            </View>

            <ScrollView className="p-4">
              {/* Voice Selection */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-3">Voice</Text>
                <ScrollView className="max-h-32 border border-gray-200 rounded-lg">
                  {availableVoices.map((voice, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => updateVoice(voice)}
                      className={`p-3 border-b border-gray-100 ${
                        settings.voice?.name === voice.name ? 'bg-orange-50' : ''
                      }`}
                    >
                      <Text className={`text-sm ${
                        settings.voice?.name === voice.name ? 'text-[#FE9F1F] font-semibold' : 'text-gray-700'
                      }`}>
                        {voice.name} ({voice.lang})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Rate Control */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-2">
                  Speed: {settings.rate.toFixed(1)}x
                </Text>
                <Slider
                  style={{ height: 40 }}
                  minimumValue={0.5}
                  maximumValue={2.0}
                  step={0.1}
                  value={settings.rate}
                  onValueChange={updateRate}
                  minimumTrackTintColor={mainColors.primary500}
                  maximumTrackTintColor={mainColors.gray}
                  thumbStyle={{ backgroundColor: mainColors.primary500 }}
                />
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500">0.5x</Text>
                  <Text className="text-xs text-gray-500">2.0x</Text>
                </View>
              </View>

              {/* Pitch Control */}
              <View className="mb-6">
                <Text className="text-base font-semibold mb-2">
                  Pitch: {settings.pitch.toFixed(1)}
                </Text>
                <Slider
                  style={{ height: 40 }}
                  minimumValue={0.5}
                  maximumValue={2.0}
                  step={0.1}
                  value={settings.pitch}
                  onValueChange={updatePitch}
                  minimumTrackTintColor={mainColors.primary500}
                  maximumTrackTintColor={mainColors.gray}
                  thumbStyle={{ backgroundColor: mainColors.primary500 }}
                />
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500">Low</Text>
                  <Text className="text-xs text-gray-500">High</Text>
                </View>
              </View>

              {/* Volume Control */}
              <View className="mb-4">
                <Text className="text-base font-semibold mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </Text>
                <Slider
                  style={{ height: 40 }}
                  minimumValue={0.0}
                  maximumValue={1.0}
                  step={0.1}
                  value={settings.volume}
                  onValueChange={updateVolume}
                  minimumTrackTintColor={mainColors.primary500}
                  maximumTrackTintColor={mainColors.gray}
                  thumbStyle={{ backgroundColor: mainColors.primary500 }}
                />
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500">0%</Text>
                  <Text className="text-xs text-gray-500">100%</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              className="p-4 border-t border-gray-200"
              onPress={() => setShowSettingsModal(false)}
            >
              <Text className="text-center text-[#FE9F1F] font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TTSControls;

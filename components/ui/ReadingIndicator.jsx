import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReadingIndicator = ({ isReading, voiceInfo }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReading) {
      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Start bounce animation for the sound waves
      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      pulseAnimation.start();
      bounceAnimation.start();

      return () => {
        pulseAnimation.stop();
        bounceAnimation.stop();
      };
    } else {
      // Reset animations
      pulseAnim.setValue(1);
      bounceAnim.setValue(0);
    }
  }, [isReading, pulseAnim, bounceAnim]);

  if (!isReading) {
    return null;
  }

  return (
    <View className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 m-4 shadow-sm border border-orange-200">
      <View className="flex-row items-center justify-center">
        {/* Tassie Avatar with Pulse Animation */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
          className="mr-4"
        >
          <View className="w-12 h-12 bg-[#FE9F1F] rounded-full items-center justify-center">
            <Text className="text-white font-bold text-lg">🐒</Text>
          </View>
        </Animated.View>

        {/* Reading Text and Sound Waves */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-[#FE9F1F] font-bold text-lg">
              Tassie is reading for you!
            </Text>
            
            {/* Animated Sound Waves */}
            <View className="flex-row ml-3 space-x-1">
              {[0, 1, 2].map((index) => (
                <Animated.View
                  key={index}
                  style={{
                    transform: [{
                      scaleY: bounceAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1.5],
                      })
                    }],
                  }}
                  className="w-1 h-4 bg-[#FE9F1F] rounded-full"
                />
              ))}
            </View>
          </View>
          
          {voiceInfo && (
            <Text className="text-sm text-gray-600">
              Using {voiceInfo.name} voice
            </Text>
          )}
        </View>

        {/* Speaker Icon */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          <Ionicons name="volume-high" size={24} color="#FE9F1F" />
        </Animated.View>
      </View>
    </View>
  );
};

export default ReadingIndicator;

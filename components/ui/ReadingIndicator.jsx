import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReadingIndicator = ({ isVisible, progress = 0, style }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isVisible) {
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start pulsing animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      return () => {
        pulseAnimation.stop();
      };
    } else {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, fadeAnim, pulseAnim]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 1000,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <View className="bg-[#FE9F1F] px-3 py-2 rounded-full shadow-lg flex-row items-center">
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons name="volume-high" size={16} color="white" />
        </Animated.View>
        <Text className="text-white text-sm font-medium ml-2">Now Reading</Text>
        {progress > 0 && (
          <View className="ml-2 w-8 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <View 
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

ReadingIndicator.displayName = 'ReadingIndicator';

export default ReadingIndicator;

import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";

import Button from "../components/ui/Button";
import { mainColors } from "../constants/colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const descriptionContent = [
  {
    title: "Your Basa Buddy",
    description:
      "Meet Tassie, your reading pet who keeps you company and helps you build the habit of reading.",
    imageSource: require("../assets/onboarding/first.png"),
    gradient: ["#667eea", "#764ba2"],
  },
  {
    title: "Read to Keep Tassie Happy",
    description:
      "Tassie sleeps when you read. But skip a day and she gets sad. Keep her happy with just 5 minutes a day.",
    imageSource: require("../assets/onboarding/second.png"),
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    title: "Build Your Reading Streak",
    description:
      "Track your progress, grow your streak, and unlock cute rewards as you read every day.",
    imageSource: require("../assets/onboarding/third.png"),
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    title: "Chat with Tassie",
    description:
      "Tassie reacts to what you read! Talk to her and get fun, book-inspired replies.",
    imageSource: require("../assets/onboarding/fourth.png"),
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    title: "Tassie Never Forgets",
    description:
      "Your pet remembers your journey. Whether you pause or push on, Tassie stays with you.",
    imageSource: require("../assets/onboarding/fifth.png"),
    gradient: ["#fa709a", "#fee140"],
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [contentIndex, setContentIndex] = useState(0);

  // Animation values
  const fadeAnim = new Animated.Value(1);
  const slideAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(1);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Initialize progress bar on first load
    progressAnim.setValue((contentIndex + 1) / descriptionContent.length);
  }, []);

  useEffect(() => {
    // Animate progress bar from current position to new position
    if (contentIndex > 0) {
      Animated.timing(progressAnim, {
        toValue: (contentIndex + 1) / descriptionContent.length,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [contentIndex]);

  const nextHandler = () => {
    if (contentIndex + 1 < descriptionContent.length) {
      // Animate transition
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -50,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setContentIndex((current) => current + 1);
    } else {
      navigation.navigate("ProfileSetup");
    }
  };

  const currentContent = descriptionContent[contentIndex];

  return (
    <View style={styles.rootContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background Gradient Overlay */}
      <View
        style={[
          styles.gradientOverlay,
          {
            backgroundColor: currentContent.gradient[0] + "20",
          },
        ]}
      />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {contentIndex + 1} of {descriptionContent.length}
        </Text>
      </View>

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {descriptionContent.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  contentIndex >= index
                    ? mainColors.primary500
                    : "rgba(156, 163, 175, 0.4)",
                transform: [
                  {
                    scale: contentIndex === index ? 1.3 : 1,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Image Container */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            style={styles.image}
            source={currentContent.imageSource}
            resizeMode="contain"
          />
          {/* Decorative elements */}
          <View style={[styles.decorativeCircle, styles.circle1]} />
          <View style={[styles.decorativeCircle, styles.circle2]} />
        </View>
      </Animated.View>

      {/* Content Card */}
      <Animated.View
        style={[
          styles.contentCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.cardContent}>
          <Text style={styles.title}>{currentContent.title}</Text>
          <Text style={styles.description}>{currentContent.description}</Text>

          <View style={styles.buttonContainer}>
            <Button
              style={[
                styles.nextButton,
                { alignItems: "center", justifyContent: "center" },
              ]}
              textStyle={[
                styles.buttonText,
                { textAlign: "center", width: "100%" },
              ]}
              onPress={nextHandler}
            >
              {contentIndex === descriptionContent.length - 1
                ? "Get Started"
                : "Next"}
            </Button>

            {contentIndex < descriptionContent.length - 1 && (
              <Text
                style={styles.skipText}
                onPress={() => navigation.navigate("ProfileSetup")}
              >
                Skip
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  progressContainer: {
    marginTop: StatusBar.currentHeight + 20,
    marginHorizontal: 30,
    marginBottom: 20,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: mainColors.primary500,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "100%",
    maxHeight: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 20,
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
    opacity: 0.1,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: mainColors.primary500,
    top: 20,
    left: 20,
  },
  circle2: {
    width: 60,
    height: 60,
    backgroundColor: "#f59e0b",
    bottom: 40,
    right: 30,
  },
  contentCard: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  },
  cardContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  nextButton: {
    width: "100%",
    paddingVertical: 5,
    borderRadius: 25,
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  skipText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});

export default OnboardingScreen;

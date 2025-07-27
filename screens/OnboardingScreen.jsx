import { useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";

import Button from "../components/ui/Button";
import { mainColors } from "../constants/colors";

const descriptionContent = [
  {
    title: "Your Basa Buddy",
    description:
      "Meet Tassie, your reading pet who keeps you company and helps you build the habit of reading.",
    imageSource: require("../assets/onboarding/first.png"),
  },
  {
    title: "Read to Keep Tassie Happy",
    description:
      "Tassie sleeps when you read. But skip a day and she gets sad. Keep her happy with just 5 minutes a day.",
    imageSource: require("../assets/onboarding/second.png"),
  },
  {
    title: "Build Your Reading Streak",
    description:
      "Track your progress, grow your streak, and unlock cute rewards as you read every day.",
    imageSource: require("../assets/onboarding/third.png"),
  },
  {
    title: "Chat with Tassie",
    description:
      "Tassie reacts to what you read! Talk to her and get fun, book-inspired replies.",
    imageSource: require("../assets/onboarding/first.png"),
  },
  {
    title: "Tassie Never Forgets",
    description:
      "Your pet remembers your journey. Whether you pause or push on, Tassie stays with you.",
    imageSource: require("../assets/onboarding/first.png"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [contentIndex, setContentIndex] = useState(0);
  const [contentTitle, setContentTitle] = useState(
    descriptionContent[contentIndex].title
  );
  const [contentImageSource, setContentImageSource] = useState(
    descriptionContent[contentIndex].imageSource
  );
  const [contentDescription, setContentDescription] = useState(
    descriptionContent[contentIndex].description
  );

  const nextHandler = () => {
    if (contentIndex + 1 < descriptionContent.length) {
      setContentIndex((current) => current + 1);
      setContentTitle(descriptionContent[contentIndex + 1].title);
      setContentDescription(descriptionContent[contentIndex + 1].description);
      setContentImageSource(descriptionContent[contentIndex + 1].imageSource);
    } else {
      navigation.navigate("ProfileSetup");
    }
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.progressBarList}>
        {descriptionContent.map((item, index) => {
          return (
            <View
              style={[
                styles.progressBar,
                contentIndex === index
                  ? styles.progressBarActive
                  : styles.progressBarInactive,
              ]}
              key={index}
            ></View>
          );
        })}
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={contentImageSource}
          resizeMode="stretch"
        />
      </View>
      <View style={styles.descriptionCard}>
        <View style={styles.descriptionContent}>
          <Text style={styles.title}>{contentTitle}</Text>
          <Text style={styles.descriptionText}>{contentDescription}</Text>
          <Button style={styles.nextButton} onPress={nextHandler}>
            Next
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  progressBarList: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 10,
    marginHorizontal: 45,
  },
  progressBar: {
    width: "15%",
    height: 10,
    borderRadius: 15,
  },
  progressBarActive: {
    backgroundColor: mainColors.primary500,
  },
  progressBarInactive: {
    backgroundColor: "lightgray",
  },
  imageContainer: {
    flex: 2,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: 450,
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionCard: {
    flex: 1,
    backgroundColor: "lightgray",
    marginTop: 50,
  },
  descriptionContent: {
    margin: 15,
  },
  descriptionText: {
    textAlign: "justify",
  },
  nextButton: {
    marginTop: 20,
  },
});

export default OnboardingScreen;

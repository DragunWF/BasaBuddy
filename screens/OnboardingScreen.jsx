import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import Button from "../components/ui/Button";
import { mainColors } from "../constants/colors";

// Dummy descriptions for now
const descriptionContent = [
  {
    title: "BasaBuddy",
    description:
      "A comprehensive reading companion app that helps users track their reading progress, discover new books, and connect with fellow book lovers through personalized recommendations and social features.",
  },
  {
    title: "BasaBuddy",
    description:
      "An intelligent language learning platform that uses AI-powered conversations and interactive exercises to help users master Filipino and other languages through immersive, real-world scenarios.",
  },
  {
    title: "BasaBuddy",
    description:
      "A digital literacy tool designed for students and educators, featuring interactive reading materials, comprehension quizzes, and progress tracking to enhance reading skills across all grade levels.",
  },
];

function OnboardingScreen() {
  const [contentIndex, setContentIndex] = useState(0);
  const [contentTitle, setContentTitle] = useState(
    descriptionContent[contentIndex].title
  );
  const [contentDescription, setContentDescription] = useState(
    descriptionContent[contentIndex].description
  );

  function nextHandler() {
    if (contentIndex + 1 < descriptionContent.length) {
      setContentIndex((current) => current + 1);
      setContentTitle(descriptionContent[contentIndex + 1].title);
      setContentDescription(descriptionContent[contentIndex + 1].description);
    }
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.progressBarList}>
        <View
          style={[
            styles.progressBar,
            contentIndex === 0
              ? styles.progressBarActive
              : styles.progressBarInactive,
          ]}
        ></View>
        <View
          style={[
            styles.progressBar,
            contentIndex === 1
              ? styles.progressBarActive
              : styles.progressBarInactive,
          ]}
        ></View>
        <View
          style={[
            styles.progressBar,
            contentIndex === 2
              ? styles.progressBarActive
              : styles.progressBarInactive,
          ]}
        ></View>
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
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  progressBarList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 10,
    marginHorizontal: 45,
  },
  progressBar: {
    width: 85,
    height: 10,
    borderRadius: 15,
  },
  progressBarActive: {
    backgroundColor: mainColors.primary500,
  },
  progressBarInactive: {
    backgroundColor: "lightgray",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionCard: {
    flex: 1,
    backgroundColor: "lightgray",
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

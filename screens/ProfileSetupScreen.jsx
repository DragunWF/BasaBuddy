import { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import Toast from "react-native-toast-message";

import Button from "../components/ui/Button";
import CustomTextInput from "../components/ui/CustomTextInput";
import CustomDropdown from "../components/ui/CustomDropdown";
import Profile from "../models/profile";
import { createProfile } from "../helpers/storage/database";

// Note: Set this to true if you're testing for a faster profile setup
const isPrefilled = true;

const ProfileSetupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState(isPrefilled ? "Jack" : "");
  const [lastName, setLastName] = useState(isPrefilled ? "Sparrow" : "");
  const [favoriteGenre, setFavoriteGenre] = useState(
    isPrefilled ? "Fantasy" : ""
  );
  const [preferredReadingTime, setPreferredReadingTime] = useState(
    isPrefilled ? "Morning" : ""
  );
  const [readingSpeed, setReadingSpeed] = useState(isPrefilled ? "Normal" : "");

  const readingTimeOptions = ["Morning", "Afternoon", "Evening", "Late Night"];
  const readingSpeedOptions = ["Slow", "Normal", "Fast"];

  const firstNameInputHandler = (enteredFirstName) => {
    setFirstName(enteredFirstName);
  };

  const lastNameInputHandler = (enteredLastName) => {
    setLastName(enteredLastName);
  };

  const favoriteGenreInputHandler = (enteredFavoriteGenre) => {
    setFavoriteGenre(enteredFavoriteGenre);
  };

  const onSelectPreferredReadingTimeHandler = (selectedReadingTime) => {
    setPreferredReadingTime(selectedReadingTime);
  };

  const onSelectReadingSpeedHandler = (selectedReadingSpeed) => {
    setReadingSpeed(selectedReadingSpeed);
  };

  const finishSetupHandler = async () => {
    if (!firstName) {
      showToastValidationEmptyMessage("First Name");
    } else if (!lastName) {
      showToastValidationEmptyMessage("Last Name");
    } else if (!favoriteGenre) {
      showToastValidationEmptyMessage("Favorite Genre");
    } else if (!preferredReadingTime) {
      showToastValidationEmptyMessage("Preferred Reading Time");
    } else if (!readingSpeed) {
      showToastValidationEmptyMessage("Reading Speed");
    } else {
      await createProfile(
        new Profile(
          firstName,
          lastName,
          favoriteGenre,
          preferredReadingTime,
          readingSpeed
        )
      );
      Toast.show({
        type: "success",
        text1: "Finished Profile Setup!",
        text2: "Your profile has been successfully set up!",
      });
      navigation.replace("HomeNavigator");
    }
  };

  const showToastValidationEmptyMessage = (inputFieldName) => {
    Toast.show({
      type: "info",
      text1: `Empty ${inputFieldName} Field!`,
      text2: `Please enter your ${inputFieldName}.`,
    });
  };

  return (
    <View style={styles.rootContainer}>
      <ScrollView alwaysBounceVertical={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile Setup</Text>
        </View>
        <View style={styles.textInputList}>
          <CustomTextInput
            style={styles.textInput}
            onChangeText={firstNameInputHandler}
            value={firstName}
            label="First Name"
            placeholder="Your first name"
          />
          <CustomTextInput
            style={styles.textInput}
            onChangeText={lastNameInputHandler}
            value={lastName}
            label="Last Name"
            placeholder="Your last name"
          />
          <CustomTextInput
            style={styles.textInput}
            onChangeText={favoriteGenreInputHandler}
            value={favoriteGenre}
            label="Favorite Genre"
            placeholder="Your favorite genre for books"
          />
          <CustomDropdown
            label="Preferred Reading Time"
            selectedValue={preferredReadingTime}
            data={readingTimeOptions}
            onSelect={onSelectPreferredReadingTimeHandler}
          />
          <CustomDropdown
            label="Reading Speed"
            selectedValue={readingSpeed}
            data={readingSpeedOptions}
            onSelect={onSelectReadingSpeedHandler}
          />
        </View>
        <Button onPress={finishSetupHandler} style={styles.finishButton}>
          Finish Setup
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    marginTop: 18,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "left",
  },
  textInputList: {
    flex: 1,
  },
  textInput: {
    minWidth: "80%",
  },
  finishButton: {
    minWidth: "75%",
    marginTop: 22,
  },
});

export default ProfileSetupScreen;

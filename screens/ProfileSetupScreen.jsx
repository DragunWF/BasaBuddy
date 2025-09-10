import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";

import CustomDropdown from "../components/ui/CustomDropdown";
import CustomTextInput from "../components/ui/CustomTextInput";
import Profile from "../models/profile";
import { createProfile } from "../helpers/storage/profileStorage";
import {
  AGE_GROUPS,
  READING_SPEEDS,
  READING_TIMES,
} from "../constants/profileSetupInfo";

function ProfileSetupScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [preferredReadingTime, setPreferredReadingTime] = useState("");
  const [readingSpeed, setReadingSpeed] = useState("");

  const handleSetup = async () => {
    if (
      !firstName ||
      !lastName ||
      !ageGroup ||
      !preferredReadingTime ||
      !readingSpeed
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all fields to continue",
      });
      return;
    }

    const profile = new Profile(
      firstName,
      lastName,
      ageGroup,
      preferredReadingTime,
      readingSpeed
    );

    const result = await createProfile(profile);

    if (result.success) {
      Toast.show({
        type: "success",
        text1: "Profile Created",
        text2: "Let's set up your reading goals!",
      });
      navigation.replace("ReadingGoals");
    } else {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Could not create profile. Please try again.",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6">
      <Text className="text-3xl font-bold mt-8 mb-6">Profile Setup</Text>

      <CustomTextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />

      <CustomTextInput
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />

      <CustomDropdown
        label="Age Group"
        data={AGE_GROUPS}
        selectedValue={ageGroup}
        onSelect={setAgeGroup}
      />

      <CustomDropdown
        label="Preferred Reading Time"
        data={READING_TIMES}
        selectedValue={preferredReadingTime}
        onSelect={setPreferredReadingTime}
      />

      <CustomDropdown
        label="Reading Speed"
        data={READING_SPEEDS}
        selectedValue={readingSpeed}
        onSelect={setReadingSpeed}
      />

      <View className="mt-8 mb-6">
        <TouchableOpacity
          className={`py-4 rounded-lg ${
            !firstName ||
            !lastName ||
            !ageGroup ||
            !preferredReadingTime ||
            !readingSpeed
              ? "bg-gray-300"
              : "bg-orange-400"
          }`}
          onPress={handleSetup}
          disabled={
            !firstName ||
            !lastName ||
            !ageGroup ||
            !preferredReadingTime ||
            !readingSpeed
          }
        >
          <Text className="text-white text-center text-lg font-medium">
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default ProfileSetupScreen;

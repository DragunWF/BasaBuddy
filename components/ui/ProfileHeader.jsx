import React, { useCallback, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { fetchProfile } from "../../helpers/storage/profileStorage";

const ProfileHeader = ({ onProfilePress }) => {
  const [profileImageUri, setProfileImageUri] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function loadProfile() {
        try {
          const profile = await fetchProfile();
          setProfileImageUri(profile?.getProfileImage() || null);
        } catch (error) {
          console.log("Error loading profile in header: ", error);
          Toast.show({
            type: "error",
            text1: "Error loading profile picture",
          });
        }
      }

      loadProfile();
    }, [])
  );

  return (
    <View className="flex-row justify-between items-center px-4 py-3">
      <View className="h-12 w-12 justify-center items-center">
        <Image
          source={require("../../assets/logo.png")}
          className="h-15 w-15"
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        onPress={onProfilePress}
        className="h-12 w-12 rounded-full bg-gray-200 justify-center items-center overflow-hidden"
      >
        {profileImageUri ? (
          <Image
            source={{ uri: profileImageUri }}
            className="h-12 w-12"
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="person" size={24} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileHeader;

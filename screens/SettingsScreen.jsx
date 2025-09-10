import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import SettingsHeader from "../components/Settings/SettingsHeader";
import SettingsSection from "../components/Settings/SettingsSection";
import SettingsItem from "../components/Settings/SettingsItem";
import NameEditModal from "../components/Settings/NameEditModal";
import AgeGroupSheet from "../components/Settings/AgeGroupSheet";
import ResetProfileModal from "../components/Settings/ResetProfileModal";
import ReadingSpeedSheet from "../components/Settings/ReadingSpeedSheet";
import ReadingTimeSheet from "../components/Settings/ReadingTimeSheet";
import DailyGoalModal from "../components/Settings/DailyGoalModal";

import {
  fetchProfile,
  updateProfile,
  resetProfile,
} from "../helpers/storage/profileStorage";
import { getDailyGoal, setDailyGoal } from "../helpers/storage/timerStorage";
import { resetStorage } from "../helpers/storage/storageCore";

const SettingsScreen = ({ navigation }) => {
  // Profile state loaded from storage
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    ageGroup: "",
    preferredReadingTime: "",
    readingSpeed: "",
    dailyGoal: 30,
  });

  const [preferences, setPreferences] = useState({
    notifications: false,
  });

  // Modal visibility states
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [ageGroupSheetVisible, setAgeGroupSheetVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [speedSheetVisible, setSpeedSheetVisible] = useState(false);
  const [timeSheetVisible, setTimeSheetVisible] = useState(false);
  const [dailyGoalModalVisible, setDailyGoalModalVisible] = useState(false);

  // Load profile data when component mounts
  useEffect(() => {
    loadProfileData();
  }, []);

  /**
   * Load profile data from storage and populate state
   */
  const loadProfileData = async () => {
    try {
      const profileData = await fetchProfile();
      const dailyGoalMinutes = await getDailyGoal();

      if (profileData) {
        setProfile({
          firstName: profileData.getFirstName() || "",
          lastName: profileData.getLastName() || "",
          ageGroup: profileData.getAgeGroup() || "",
          preferredReadingTime: profileData.getPreferredReadingTime() || "",
          readingSpeed: profileData.getReadingSpeed() || "",
          dailyGoal: profileData.getDailyGoal() || dailyGoalMinutes || 30,
        });
      }
    } catch (error) {
      console.error("Error loading profile data:", error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  /**
   * Handle saving name changes to profile
   * @param {string} firstName - Updated first name
   * @param {string} lastName - Updated last name
   */
  const handleNameSave = async (firstName, lastName) => {
    try {
      const updatedProfile = {
        ...profile,
        firstName,
        lastName,
      };

      const result = await updateProfile(1, updatedProfile);
      if (result.success) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  /**
   * Handle age group selection
   * @param {string} ageGroup - Selected age group
   */
  const handleAgeGroupSelect = async (ageGroup) => {
    try {
      const updatedProfile = {
        ...profile,
        ageGroup,
      };

      const result = await updateProfile(1, updatedProfile);
      if (result.success) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving age group:", error);
    }
  };

  /**
   * Handle notification toggle (purely for UI, no backend functionality)
   * @param {boolean} value - Toggle value
   */
  const handleNotificationToggle = (value) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: value,
    }));
  };

  /**
   * Handle reading speed selection
   * @param {string} speed - Selected reading speed
   */
  const handleReadingSpeedSelect = async (speed) => {
    try {
      const updatedProfile = {
        ...profile,
        readingSpeed: speed,
      };

      const result = await updateProfile(1, updatedProfile);
      if (result.success) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving reading speed:", error);
    }
  };

  /**
   * Handle reading time preference selection
   * @param {string} time - Selected reading time
   */
  const handleReadingTimeSelect = async (time) => {
    try {
      const updatedProfile = {
        ...profile,
        preferredReadingTime: time,
      };

      const result = await updateProfile(1, updatedProfile);
      if (result.success) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving reading time:", error);
    }
  };

  /**
   * Handle daily goal setting
   * @param {number} goal - Daily reading goal in minutes
   */
  const handleDailyGoalSave = async (goal) => {
    try {
      const updatedProfile = {
        ...profile,
        dailyGoal: goal,
      };

      // Update both profile storage and timer storage
      const profileResult = await updateProfile(1, updatedProfile);
      const timerResult = await setDailyGoal(goal);

      if (profileResult.success && timerResult) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error("Error saving daily goal:", error);
    }
  };

  /**
   * Handle profile reset - clears all user data and navigates to onboarding
   */
  const handleResetProfile = async () => {
    try {
      const result = await resetProfile();
      if (result.success) {
        // Navigate back to intro/onboarding flow
        navigation.reset({
          index: 0,
          routes: [{ name: "Intro" }],
        });
      }
    } catch (error) {
      console.error("Error resetting profile:", error);
    }
  };

  const handleImportProfile = () => {
    // TODO: Implement profile import functionality
    console.log("Import profile functionality to be implemented");
  };

  const handleExportProfile = () => {
    // TODO: Implement profile export functionality
    console.log("Export profile functionality to be implemented");
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <GestureHandlerRootView className="flex-1">
      <BottomSheetModalProvider>
        <SafeAreaView className="flex-1 bg-gray-50">
          <SettingsHeader onBackPress={handleBackPress} />

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="pt-6">
              {/* Profile Section */}
              <SettingsSection title="Profile">
                <SettingsItem
                  icon="user"
                  label="Full Name"
                  value={fullName || "Not set"}
                  onPress={() => setNameModalVisible(true)}
                />

                <SettingsItem
                  icon="users"
                  label="Age Group"
                  value={profile.ageGroup || "Not set"}
                  onPress={() => setAgeGroupSheetVisible(true)}
                  isLast
                />
              </SettingsSection>

              {/* Preferences Section */}
              <SettingsSection title="Preferences">
                <SettingsItem
                  icon="bell"
                  label="Notifications"
                  isToggle
                  toggleValue={preferences.notifications}
                  onToggle={handleNotificationToggle}
                />
                <SettingsItem
                  icon="zap"
                  label="Reading Speed"
                  value={profile.readingSpeed || "Not set"}
                  onPress={() => setSpeedSheetVisible(true)}
                />
                <SettingsItem
                  icon="clock"
                  label="Preferred Reading Time"
                  value={profile.preferredReadingTime || "Not set"}
                  onPress={() => setTimeSheetVisible(true)}
                />
                <SettingsItem
                  icon="target"
                  label="Daily Reading Goal"
                  value={
                    profile.dailyGoal
                      ? `${profile.dailyGoal} minutes`
                      : "Not set"
                  }
                  onPress={() => setDailyGoalModalVisible(true)}
                  isLast
                />
              </SettingsSection>

              {/* Data Management Section */}
              <SettingsSection title="Data Management">
                <SettingsItem
                  icon="download"
                  label="Import Profile Data"
                  onPress={handleImportProfile}
                  showArrow={false}
                />
                <SettingsItem
                  icon="upload"
                  label="Export Profile Data"
                  onPress={handleExportProfile}
                  showArrow={false}
                />
                <SettingsItem
                  icon="refresh-cw"
                  label="Reset Profile"
                  onPress={() => setResetModalVisible(true)}
                  showArrow={false}
                  textColor="text-red-500"
                  isLast
                />
              </SettingsSection>
            </View>
          </ScrollView>

          {/* Modals and Bottom Sheets */}
          <NameEditModal
            visible={nameModalVisible}
            onClose={() => setNameModalVisible(false)}
            currentFirstName={profile.firstName}
            currentLastName={profile.lastName}
            onSave={handleNameSave}
          />

          <AgeGroupSheet
            visible={ageGroupSheetVisible}
            onClose={() => setAgeGroupSheetVisible(false)}
            selectedAgeGroup={profile.ageGroup}
            onSelectAgeGroup={handleAgeGroupSelect}
          />

          <ResetProfileModal
            visible={resetModalVisible}
            onClose={() => setResetModalVisible(false)}
            onReset={handleResetProfile}
          />

          <ReadingSpeedSheet
            visible={speedSheetVisible}
            onClose={() => setSpeedSheetVisible(false)}
            selectedSpeed={profile.readingSpeed}
            onSelectSpeed={handleReadingSpeedSelect}
          />

          <ReadingTimeSheet
            visible={timeSheetVisible}
            onClose={() => setTimeSheetVisible(false)}
            selectedTime={profile.preferredReadingTime}
            onSelectTime={handleReadingTimeSelect}
          />

          <DailyGoalModal
            visible={dailyGoalModalVisible}
            onClose={() => setDailyGoalModalVisible(false)}
            currentGoal={profile.dailyGoal}
            onSave={handleDailyGoalSave}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default SettingsScreen;

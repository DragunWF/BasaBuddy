import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import SettingsHeader from '../components/Settings/SettingsHeader';
import SettingsSection from '../components/Settings/SettingsSection';
import SettingsItem from '../components/Settings/SettingsItem';
import NameEditModal from '../components/Settings/NameEditModal';
import BirthdayPickerModal from '../components/Settings/BirthdayPickerModal';
import ResetProfileModal from '../components/Settings/ResetProfileModal';
import ReadingSpeedSheet from '../components/Settings/ReadingSpeedSheet';
import ReadingTimeSheet from '../components/Settings/ReadingTimeSheet';

const SettingsScreen = ({ navigation }) => {
  // Mock state for demonstration
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    birthday: '2025-01-01',
  });

  const [preferences, setPreferences] = useState({
    notifications: false,
    readingSpeed: 'Normal',
    readingTime: 'Afternoon',
  });

  // Modal visibility states
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [birthdayModalVisible, setBirthdayModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [speedSheetVisible, setSpeedSheetVisible] = useState(false);
  const [timeSheetVisible, setTimeSheetVisible] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleNameSave = (firstName, lastName) => {
    setProfile(prev => ({
      ...prev,
      firstName,
      lastName,
    }));
  };

  const handleBirthdaySave = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setProfile(prev => ({
      ...prev,
      birthday: formattedDate,
    }));
  };

  const handleNotificationToggle = (value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: value,
    }));
  };

  const handleReadingSpeedSelect = (speed) => {
    setPreferences(prev => ({
      ...prev,
      readingSpeed: speed,
    }));
  };

  const handleReadingTimeSelect = (time) => {
    setPreferences(prev => ({
      ...prev,
      readingTime: time,
    }));
  };

  const handleResetProfile = () => {
    setProfile({
      firstName: '',
      lastName: '',

      birthday: new Date().toISOString().split('T')[0],
    });
    setPreferences({
      notifications: false,
      readingSpeed: 'Normal',
      readingTime: 'Morning',
    });
    Alert.alert('Profile Reset', 'Your profile has been reset successfully.');
  };

  const handleImportProfile = () => {
    Alert.alert('Import Profile', 'Import functionality would be implemented here.');
  };

  const handleExportProfile = () => {
    Alert.alert('Export Profile', 'Export functionality would be implemented here.');
  };

  const formatBirthday = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
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
                  label="Full Name"
                  value={fullName || 'Not set'}
                  onPress={() => setNameModalVisible(true)}
                />
               
                <SettingsItem
                  label="Birthday"
                  value={formatBirthday(profile.birthday)}
                  onPress={() => setBirthdayModalVisible(true)}
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
                  value={preferences.readingSpeed}
                  onPress={() => setSpeedSheetVisible(true)}
                />
                <SettingsItem
                  icon="clock"
                  label="Reading Time"
                  value={preferences.readingTime}
                  onPress={() => setTimeSheetVisible(true)}
                  isLast
                />
              </SettingsSection>

              {/* About Section */}
              <SettingsSection title="About">
                <SettingsItem
                  icon="download"
                  label="Import Profile Data as JSON"
                  onPress={handleImportProfile}
                  showArrow={false}
                />
                <SettingsItem
                  icon="upload"
                  label="Export Profile Data as JSON"
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

          <BirthdayPickerModal
            visible={birthdayModalVisible}
            onClose={() => setBirthdayModalVisible(false)}
            currentDate={profile.birthday}
            onSave={handleBirthdaySave}
          />

          <ResetProfileModal
            visible={resetModalVisible}
            onClose={() => setResetModalVisible(false)}
            onReset={handleResetProfile}
          />

          <ReadingSpeedSheet
            visible={speedSheetVisible}
            onClose={() => setSpeedSheetVisible(false)}
            selectedSpeed={preferences.readingSpeed}
            onSelectSpeed={handleReadingSpeedSelect}
          />

          <ReadingTimeSheet
            visible={timeSheetVisible}
            onClose={() => setTimeSheetVisible(false)}
            selectedTime={preferences.readingTime}
            onSelectTime={handleReadingTimeSelect}
          />
        </SafeAreaView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default SettingsScreen;

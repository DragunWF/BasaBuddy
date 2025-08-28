import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeBottomTabNavigator from "./HomeBottomTabNavigator";
import BookDetailsScreen from "../../screens/BookDetailsScreen";
import ReadingScreen from "../../screens/ReadingScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import CollectionDetailsScreen from "../../screens/CollectionDetailsScreen";
import IntroStackNavigator from "./IntroStackNavigator";

const Stack = createStackNavigator();

function AppNavigator() {
  // Here we could add logic to determine if user has completed intro
  // For now, we'll assume they have and go straight to main app
  const initialRouteName = "MainApp"; // Change to 'Intro' if you want to start with intro screens

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      {/* Intro screens */}
      <Stack.Screen name="Intro" component={IntroStackNavigator} />

      {/* Main App with Bottom Tabs */}
      <Stack.Screen name="MainApp" component={HomeBottomTabNavigator} />

      {/* Screens that should appear on top of the tab navigator */}
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />

      <Stack.Screen name="Reading" component={ReadingScreen} />

      <Stack.Screen name="Profile" component={ProfileScreen} />

      <Stack.Screen name="CollectionDetails" component={CollectionDetailsScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;

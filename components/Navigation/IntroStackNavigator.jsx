import { createStackNavigator } from "@react-navigation/stack";

import OnboardingScreen from "../../screens/OnboardingScreen";
import ProfileSetupScreen from "../../screens/ProfileSetupScreen";
import ReadingGoalsScreen from "../../screens/ReadingGoalsScreen";
import HomeBottomTabNavigator from "./HomeBottomTabNavigator";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createStackNavigator();

function IntroStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ title: "Welcome to BasaBuddy!" }}
      />
      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetupScreen}
        options={{
          title: "Setup your Profile",
        }}
      />
      <Stack.Screen
        name="ReadingGoals"
        component={ReadingGoalsScreen}
        options={{
          title: "Reading Goals",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="HomeNavigator"
        component={HomeBottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default IntroStackNavigator;

import { createStackNavigator } from "@react-navigation/stack";

import OnboardingScreen from "../../screens/OnboardingScreen";
import ProfileSetupScreen from "../../screens/ProfileSetupScreen";
import HomeBottomTabNavigator from "./HomeBottomTabNavigator";

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
        name="HomeNavigator"
        component={HomeBottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default IntroStackNavigator;

import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../../screens/ChatScreen";
import HomeScreen from "../../screens/HomeScreen";
import OnboardingScreen from "../../screens/OnboardingScreen";
import ProfileSetupScreen from "../../screens/ProfileSetupScreen";

const Stack = createStackNavigator();

function StackNavigator() {
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
        name="Chat"
        component={ChatScreen}
        options={{ title: "Chat with Tassie" }}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

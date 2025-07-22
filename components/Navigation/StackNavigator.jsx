import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../../screens/ChatScreen";
import HomeScreen from "../../screens/HomeScreen";
import OnboardingScreen from "../../screens/OnboardingScreen";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

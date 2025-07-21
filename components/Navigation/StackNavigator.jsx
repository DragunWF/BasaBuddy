import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../../screens/ChatScreen";
import HomeScreen from "../../screens/HomeScreen";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

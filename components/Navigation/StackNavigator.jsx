import { createStackNavigator } from "@react-navigation/stack";

import ChatScreen from "../../screens/ChatScreen";

const Stack = createStackNavigator();

function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;

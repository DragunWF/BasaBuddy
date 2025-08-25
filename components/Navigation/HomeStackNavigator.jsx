import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../../screens/HomeScreen";
import ReadingScreen from "../../screens/ReadingScreen";
import BookDetailsScreen from "../../screens/BookDetailsScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
      <Stack.Screen name="Reading" component={ReadingScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default HomeStackNavigator;

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons, MaterialIcons, Fontisto } from "@expo/vector-icons";

import HomeScreen from "../../screens/HomeScreen";
import ChatScreen from "../../screens/ChatScreen";
import ExploreScreen from "../../screens/ExploreScreen";
import LibraryScreen from "../../screens/LibraryScreen";
import SessionScreen from "../../screens/SessionScreen";
import { mainColors } from "../../constants/colors";

const BottomTab = createBottomTabNavigator();

function HomeBottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: mainColors.primary500,
        tabBarInactiveTintColor: mainColors.black,
        headerShown: false,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="home" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <MaterialIcons name="explore" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="library" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Session"
        component={SessionScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <MaterialIcons name="timer" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: "Chat with Tassie",
          headerTitleAlign: "center",
          headerShown: true,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "#f5f3f2",
            opacity: 0.85,
          },
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="chat" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Session"
        component={SessionScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Fontisto name="stopwatch" color={color} size={size} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

export default HomeBottomTabNavigator;

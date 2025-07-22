import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";

import HomeScreen from "../../screens/HomeScreen";
import ChatScreen from "../../screens/ChatScreen";
import ExploreScreen from "../../screens/ExploreScreen";
import LibraryScreen from "../../screens/LibraryScreen";

const BottomTab = createBottomTabNavigator();

function HomeBottomTabNavigator() {
  return (
    <BottomTab.Navigator>
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
          headerTitle: "Explore new books!",
          tabBarIcon: ({ color, size }) => {
            return <MaterialIcons name="explore" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          headerTitle: "Your Library",
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="library" color={color} size={size} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerTitle: "Chat with Tassie",
          tabBarIcon: ({ color, size }) => {
            return <Entypo name="chat" color={color} size={size} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}

export default HomeBottomTabNavigator;

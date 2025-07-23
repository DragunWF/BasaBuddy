import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import IntroStackNavigator from "./IntroStackNavigator";

import ChatContextProvider from "../../store/ChatContext";

function NavigationWrapper() {
  return (
    <ChatContextProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default NavigationWrapper;

import { NavigationContainer } from "@react-navigation/native";
import IntroStackNavigator from "./IntroStackNavigator";

import ChatContextProvider from "../../store/ChatContext";

function NavigationWrapper() {
  return (
    <ChatContextProvider>
      <NavigationContainer>
        <IntroStackNavigator />
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default NavigationWrapper;

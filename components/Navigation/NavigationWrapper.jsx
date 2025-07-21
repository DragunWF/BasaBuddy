import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./StackNavigator";

import ChatContextProvider from "../../store/ChatContext";

function NavigationWrapper() {
  return (
    <ChatContextProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default NavigationWrapper;

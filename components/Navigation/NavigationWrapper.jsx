import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";
import IntroStackNavigator from "./IntroStackNavigator";

import ChatContextProvider from "../../store/ChatContext";
import { hasProfile } from "../../helpers/tools/database";
import HomeBottomTabNavigator from "./HomeBottomTabNavigator";

const NavigationWrapper = () => {
  const [isProfileExist, setIsProfileExist] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setIsProfileExist(await hasProfile());
    }

    fetchProfile();
  }, []);

  return (
    <ChatContextProvider>
      <NavigationContainer>
        {isProfileExist ? <HomeBottomTabNavigator /> : <IntroStackNavigator />}
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default NavigationWrapper;

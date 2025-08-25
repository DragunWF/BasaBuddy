import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import IntroStackNavigator from "./IntroStackNavigator";

import ChatContextProvider from "../../store/ChatContext";
import { hasProfile } from "../../helpers/storage/profileStorage";
import HomeBottomTabNavigator from "./HomeBottomTabNavigator";
import AppNavigator from "./AppNavigator";

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
        {isProfileExist ? <AppNavigator /> : <IntroStackNavigator />}
      </NavigationContainer>
    </ChatContextProvider>
  );
};

export default NavigationWrapper;

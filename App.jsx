import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

import NavigationWrapper from "./components/Navigation/NavigationWrapper";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationWrapper />
      <Toast />
    </>
  );
}

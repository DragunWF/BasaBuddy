import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";

import { init, resetStorage } from "./helpers/storage/storageCore";
import NavigationWrapper from "./components/Navigation/NavigationWrapper";
import "./components/globals.css";

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await resetStorage();
        setDbInitialized(true);
      } catch (err) {
        console.error(
          "An error occurred while trying to initialize the database: ",
          err
        );
      }
    }

    if (!dbInitialized) {
      initializeDatabase();
    }
  }, []);

  if (!dbInitialized) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationWrapper />
      <Toast />
    </>
  );
}

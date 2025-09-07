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
        /*
          The method resetStorage() is primarily used for development and testing.
          It is not recommended to use this method in production as it will delete all data.
          Instead, use the init() method for production or for testing data persistence between sessions.
        */
        await init();
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

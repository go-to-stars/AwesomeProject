import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import AppNavigator from "./src/routes/AppNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Bold": require("./src/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./src/fonts/Roboto-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

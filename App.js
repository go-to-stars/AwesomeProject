import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { persistor, store } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

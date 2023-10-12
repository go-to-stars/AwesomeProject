// import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  KeyboardAvoidingView,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import RegistrationScreen from "./src/Screens/RegistrationScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import { useFonts } from "expo-font";
// import { Linking } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Bold": require("./src/fonts/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./src/fonts/Roboto-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <RegistrationScreen />
      {/* <LoginScreen /> */}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  containerKAV: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

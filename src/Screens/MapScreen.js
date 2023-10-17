import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,  
  Dimensions,
  
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MapScreen() {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../img/map_Ukraine.png")}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const screenSize = Dimensions.get("screen");
const widthInput = screenSize.width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 32,
    borderRadius: 8,
  },
  photo: {
    width: widthInput,
    height: "100%",
    borderRadius: 8,
    position: "relative",
  },
});

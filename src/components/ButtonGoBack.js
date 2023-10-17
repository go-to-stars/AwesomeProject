import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/AntDesign";

export default function ButtonGoBack() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}
    >
      <Icon name="arrowleft" size={24} style={styles.iconButtonGoBack} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButtonGoBack: {
    color: "#212121CC",
    paddingLeft: 16,
  },
});

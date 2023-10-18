import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ButtonLogOut () { 
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
      <Icon name="logout" size={24} style={styles.iconButtonLogOut} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButtonLogOut: {
    color: "#BDBDBD",
    paddingRight: 10,
  },
});
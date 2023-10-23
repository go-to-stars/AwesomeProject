import { useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { logOut } from "../redux/auth/authOperations";
import { selectIsLoggedIn } from "../redux/auth/authSelectors";

export default function ButtonLogOut() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const onLogOut = async () => {
    dispatch(logOut());
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  }, [isLoggedIn]);

  return (
    <TouchableOpacity onPress={onLogOut}>
      <Icon name="logout" size={24} style={styles.iconButtonLogOut} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButtonLogOut: {
    color: "#BDBDBD",
    paddingRight: 10,
  },
});

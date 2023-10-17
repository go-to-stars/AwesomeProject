import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity, 
  Animated, 
  Image, 
} from "react-native";

const userName = "Natali Romanova";
const email = "email@example.com";

export default function PostsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image
          source={require("../img/Natali_Romanova.jpg")}
          style={styles.avatar}
        ></Image>
        <View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 23,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 16,
  },
  userName: {
    fontFamily: "Roboto-Bold",
    color: "#212121",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "700",
  },
  userEmail: {
    fontFamily: "Roboto-Regular",
    color: "rgba(33, 33, 33, 0.80)",
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "400",
  },
});

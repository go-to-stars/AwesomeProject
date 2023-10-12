import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";

export default function LoginScreen() {
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const [textEmail, setTextEmail] = useState("");
  const [textPassword, setTextPassword] = useState("");
  const [isVisiblePassword, setVisiblePassword] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);

  // const onRegistration = () => {
  //   Alert.alert("Credentials", `${textEmail} + ${textPassword}`);
  // };
  const onRegistration = () => {    
    setTextEmail("");
    setTextPassword("");
    console.log("Credentials", `${textEmail} + ${textPassword}`);
  };

  const handleFocus = (input) => {
    if (input === "email") {
      setEmailFocused(true);
      setPasswordFocused(false);
    } else if (input === "password") {
      setEmailFocused(false);
      setPasswordFocused(true);
    }
  };

  const handleBlur = () => {
    setEmailFocused(false);
    setPasswordFocused(false);
  };

  const onChangeTextEmail = (e) => {
    setTextEmail(e);
  };

  const onChangeTextPassword = (e) => {
    setTextPassword(e);
  };

  useEffect(() => {
    const listenerShow = Keyboard.addListener("keyboardDidShow", () => {
      setShift(true);
    });
    const listenerHide = Keyboard.addListener("keyboardDidHide", () => {
      setShift(false);
    });

    return () => {
      listenerShow.remove();
      listenerHide.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(position, {
      toValue: shift ? 32 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [shift]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ImageBackground
          source={require("../img/photo_bg.png")}
          style={styles.bg}
          resizeMode="cover"
        />
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
        >
          <Animated.View
            style={[styles.formWrapper, { paddingBottom: position }]}
          >
            <Text style={styles.title}>Увійти</Text>
            <View style={styles.inputsContainer}>
              <TextInput
                placeholder="Адреса електронної пошти"
                style={
                  isEmailFocused ? styles.inputEmailFocused : styles.inputEmail
                }
                autoComplete="email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={textEmail}
                onChangeText={onChangeTextEmail}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Пароль"
                  style={
                    isPasswordFocused
                      ? styles.inputPasswordFocused
                      : styles.inputPassword
                  }
                  autoComplete="password"
                  autoCapitalize="none"
                  value={textPassword}
                  secureTextEntry={!isVisiblePassword}
                  onChangeText={onChangeTextPassword}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                />
                <TouchableOpacity
                  onPress={() => setVisiblePassword(!isVisiblePassword)}
                >
                  <Text style={styles.buttonViewPassword}>
                    {isVisiblePassword ? "Приховати" : "Показати"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.noKeyboardField}>
              <TouchableOpacity
                style={styles.buttonRegistration}
                onPress={() => {
                  onRegistration();
                }}
              >
                <Text style={styles.buttonText}>Увійти</Text>
              </TouchableOpacity>
              <View style={styles.textLinkBox}>
                <Text style={styles.textLink}>Немає акаунту?</Text>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.textLinkUnderline}>Зареєструватися</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const screenSize = Dimensions.get("screen");
const widthInput = screenSize.width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenSize.width,
  },
  bg: {
    top: 0,
    left: 0,
    position: "absolute",
    height: screenSize.height,
    width: screenSize.width,
    alignItems: "center",
  },
  scrollViewContainer: {
    minHeight: screenSize.height,
    justifyContent: "flex-end",
  },
  formWrapper: {
    width: screenSize.width,
    marginTop: 279,
    paddingHorizontal: 16,
    // paddingBottom: 23,
    paddingBottom: 112,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
  },
  title: {
    marginBottom: 33,
    marginTop: 32,
    fontFamily: "Roboto-Bold",
    fontSize: 30,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
    color: "#212121",
  },
  inputEmail: {
    width: widthInput,
    height: 50,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    marginBottom: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    backgroundColor: "#F6F6F6",
    color: "#212121",
    // placeholderTextColor: "#BDBDBD",
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
  },
  inputEmailFocused: {
    width: widthInput,
    height: 50,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    marginBottom: 16,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    backgroundColor: "#FFF",
    color: "#212121",
    // placeholderTextColor: "#BDBDBD",
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 5,
  },
  passwordContainer: {
    marginBottom: 43,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  inputPassword: {
    width: widthInput,
    height: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    backgroundColor: "#F6F6F6",
    color: "#212121",
    // placeholderTextColor: "#BDBDBD",
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
  },
  inputPasswordFocused: {
    width: widthInput,
    height: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    backgroundColor: "#FFF",
    color: "#212121",
    // placeholderTextColor: "#BDBDBD",
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 5,
  },
  buttonViewPassword: {
    position: "absolute",
    top: -11,
    right: 16,
    paddingHorizontal: 0,
    paddingVertical: 2,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontWeight: "400",
    color: "#1B4371",
  },
  noKeyboardField: {
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
  },
  buttonRegistration: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: widthInput,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
  },
  textLinkBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    marginBottom: 123,
  },
  textLink: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    textDecorationLine: "none",
    textDecorationColor: "#1B4371",
    color: "#1B4371",
  },
  textLinkUnderline: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    textDecorationLine: "underline",
    textDecorationColor: "#1B4371",
    color: "#1B4371",
  },
});

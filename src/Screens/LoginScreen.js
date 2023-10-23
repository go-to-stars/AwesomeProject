import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,  
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../redux/auth/authOperations";
// import { userVerification } from "../firebase";
import {
  selectUser,
  selectIsLoggedIn,
  selectIsLoading,
} from "../redux/auth/authSelectors";
// import { onAuthStateChanged } from "firebase/auth";

const initialState = {
  email: "",
  password: "",
  photoURL: "",
};

const initialErrorMsg = {
  photo: "",
  password: "",
};

const emailRegex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

export default function LoginScreen() {
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0)); 
  const [isVisiblePassword, setVisiblePassword] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const navigation = useNavigation();
  const [state, setState] = useState(initialState);
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(initialErrorMsg); 
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);

  const onLogin = () => {
    
    const isvalidEmail = validateForm();
    if (isvalidEmail) {
      const logInData = {
        email: state.email,
        password: state.password,
      };
      dispatch(logIn(logInData));
      clearForm();      
    } 
  };

  useEffect(() => {
    if (      
      isLoggedIn
    ) {      
      navigation.reset({
        index: 0,
        routes: [{ name: "BottomNavigator" }],
      });
    }
  }, [isLoggedIn]);

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
    setState((prevValues) => ({
      ...prevValues,
      email: e,
    }));
  };

  const onChangeTextPassword = (e) => {
    setState((prevValues) => ({
      ...prevValues,
      password: e,
    }));
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

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!state.email) {
      errors.email = "Електронна пошта обов'язкова";
    } else if (!isValidEmail(state.email) || state.email.length < 5) {
      errors.email = "Введіть дійсну електронну пошту";
    } else {
      const emailVeryfy = state.email;      
      // const userExists = userVerification(emailVeryfy);
      const userExists = false;
      if (userExists) {
        errors.email = "Користувач з такою електронною адресою вже існує!";
      }
    }

    if (!state.password) {
      errors.password = "Пароль обов'язковий";
    } else if (state.password.length < 7) {
      errors.password = "Довжина паролю повинна бути не менше 7 символів!";
    }

    setErrorMsg(errors);

    return Object.keys(errors).length === 0;
  };

  const clearForm = () => {
    setState(initialState);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              {errorMsg.email && !isEmailFocused && (
                <Text style={styles.errorMsg}>{errorMsg.email}</Text>
              )}
              <TextInput
                placeholder="Адреса електронної пошти"
                style={isEmailFocused ? styles.inputFocused : styles.input}
                autoComplete="email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={state.email}
                onChangeText={onChangeTextEmail}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
              />
              {errorMsg.password && !isPasswordFocused && (
                <Text style={styles.errorMsg}>{errorMsg.password}</Text>
              )}
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
                  value={state.password}
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
                  onLogin();
                }}
              >
                <Text style={styles.buttonText}>Увійти</Text>
              </TouchableOpacity>
              <View style={styles.textLinkBox}>
                <Text style={styles.textLink}>Немає акаунту?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Registration")}
                >
                  <Text style={styles.textLinkUnderline}>Зареєструватися</Text>
                </TouchableOpacity>
              </View>
            </View>
            {isLoading && <ActivityIndicator size="small" color={"#FF6C00"} />}
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const screenSize = Dimensions.get("screen");
const widthInput = screenSize.width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenSize.width,
    height: 780,
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
  input: {
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
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
  },
  inputFocused: {
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
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 5,
  },
  inputLogin: {
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
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 5,
  },
  inputLoginFocused: {
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
    borderWidth: 1,
    borderColor: "#FF6C00",
    borderRadius: 5,
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
  spinner: {
    marginBottom: 15,
    color: "#FF6C00",
  },
});

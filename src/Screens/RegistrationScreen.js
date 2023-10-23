import { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/auth/authOperations";
import { userVerification } from "../firebase";
import {
  selectUser,
  selectIsLoggedIn,
  selectIsLoading,
  selectError,
} from "../redux/auth/authSelectors";

const initialState = {
  displayName: "",
  email: "",
  password: "",
  photoURL: "",
};

const initialErrorMsg = {
  photo: "",
  displayName: "",
  password: "",
};

const emailRegex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;

export default function RegistrationScreen() {
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const [state, setState] = useState(initialState);
  const [image, setImage] = useState("");
  const [isVisiblePassword, setVisiblePassword] = useState(false);
  const [isLoginFocused, setLoginFocused] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState(initialErrorMsg);  
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectError);

  const addPhotoUser = async () => {
    Alert.alert(
      "Виберіть фото",
      " ",
      [
        { text: "Закрити", callingCode: true, style: "cancel" },
        { text: "Галерея", onPress: () => selectImageGalery() },
        { text: "Камера", onPress: () => selectImageCamera() },
      ],
      { cancelable: true, style: "border-radius = 10px" }
    );
  };

  const addPhotoUrl = (url) => {
    setState((prevValues) => ({
      ...prevValues,
      photoURL: url,
    }));
  };

  const selectImageGalery = async () => {
    const options = {
      mediaType: "photo",
    };
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (result.canceled) {
      Alert.alert("Вибір фотографії скасовано", "", [], { cancelable: true });
    } else if (result.error) {
      Alert.alert("Помилка вибору фото", "", [], { cancelable: true });
    } else if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      addPhotoUrl(result.assets[0].uri);
    }
  };

  const selectImageCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      includeBase64: false,
      maxHeight: 120,
      maxWidth: 120,
    });
    if (result.canceled) {
      Alert.alert("Користувач відмінив використання камери", "", [], {
        cancelable: true,
      });
    } else if (result.error) {
      Alert.alert("Помилка камери", "", [], {
        cancelable: true,
      });
    } else if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      addPhotoUrl(result.assets[0].uri);
    }
  };

  const onRegistration = async () => {
    const isvalidEmail = validateForm();

    if (isvalidEmail) {
      const registrationData = {
        displayName: state.displayName,
        email: state.email,
        password: state.password,
        photoURL: state.photoURL,
      };
      dispatch(register(registrationData));
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

  const deletePhotoUser = () => {
    setImage("");
  };

  const handleFocus = (input) => {
    if (input === "username") {
      setLoginFocused(true);
      setEmailFocused(false);
      setPasswordFocused(false);
    } else if (input === "email") {
      setLoginFocused(false);
      setEmailFocused(true);
      setPasswordFocused(false);
    } else if (input === "password") {
      setLoginFocused(false);
      setEmailFocused(false);
      setPasswordFocused(true);
    }
  };

  const handleBlur = () => {
    setLoginFocused(false);
    setEmailFocused(false);
    setPasswordFocused(false);
  };

  const onChangeTextLogin = (e) => {
    setState((prevValues) => ({
      ...prevValues,
      displayName: e,
    }));
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

  const isValidEmail = (email) => {
    return emailRegex.test(email);
  };

  const validateForm = async () => {
    const errors = {};

    if (!state.displayName) {
      errors.displayName = "Логін обов'язковий";
    }

    if (!state.email) {
      errors.email = "Електронна пошта обов'язкова";
    } else if (!isValidEmail(state.email) || state.email.length < 5) {
      errors.email = "Введіть дійсну електронну пошту";
    } else {
      const emailVeryfy = state.email;

      // const userExists = await userVerification(emailVeryfy);
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
            <View style={styles.photoContainer}>
              {image ? (
                <View style={styles.withPhotoUser}>
                  <Image
                    source={
                      image ? { uri: image } : require("../img/Ellipse.jpg")
                    }
                    style={styles.photoUser}
                  ></Image>
                  <TouchableOpacity
                    onPress={() => {
                      deletePhotoUser();
                    }}
                  >
                    <Icon
                      name="closecircleo"
                      size={25}
                      style={styles.iconDelPhotoUser}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.withoutPhotoUser}>
                  <TouchableOpacity
                    onPress={() => {
                      addPhotoUser();
                    }}
                  >
                    <Icon
                      name="pluscircleo"
                      size={25}
                      style={styles.iconAddPhotoUser}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {errorMsg.photo && (
                <Text style={styles.errorMsgPhoto}>{errorMsg.photo}</Text>
              )}
            </View>
            <Text style={styles.title}>Реєстрація</Text>
            <View style={styles.inputsContainer}>
              {errorMsg.name && !isLoginFocused && (
                <Text style={styles.errorMsg}>{errorMsg.displayName}</Text>
              )}
              <TextInput
                placeholder="Логін"
                style={isLoginFocused ? styles.inputFocused : styles.input}
                autoComplete="username"
                value={state.displayName}
                onChangeText={onChangeTextLogin}
                onFocus={() => handleFocus("username")}
                onBlur={() => handleBlur("username")}
              />
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
            {isError && (
              <Text style={styles.errorMsg}>{"Помилка реєстрації!"}</Text>
            )}
            <View style={styles.noKeyboardField}>
              <TouchableOpacity
                style={styles.buttonRegistration}
                onPress={() => {
                  onRegistration();
                }}
              >
                <Text style={styles.buttonText}>Зареєструватися</Text>
              </TouchableOpacity>
              <View style={styles.textLinkBox}>
                <Text style={styles.textLink}>Вже є акаунт?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.textLinkUnderline}>Увійти</Text>
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
    marginTop: 263,
    paddingHorizontal: 16,
    paddingBottom: 23,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
  },
  photoContainer: {
    alignItems: "center",
    width: 120,
    height: 120,
    top: -60,
    borderRadius: 20,

    zIndex: 2,
  },
  withPhotoUser: {
    width: 120,
    height: 120,
    borderRadius: 20,

    backgroundColor: "#BDBDBD",
  },
  photoUser: {
    width: 120,
    height: 120,
    borderRadius: 20,
    overflow: "hidden",
  },
  iconDelPhotoUser: {
    left: 107,
    top: -39,
    color: "#BDBDBD",
  },
  withoutPhotoUser: {
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
  },
  iconAddPhotoUser: {
    position: "relative",
    left: 107,
    top: 81,
    color: "#FF6C00",
  },
  errorMsgPhoto: {
    alignSelf: "center",
    top: -50,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    color: "#FF6C00",
  },
  title: {
    marginBottom: 33,
    marginTop: -28,
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
    // placeholderTextColor: "#BDBDBD",
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
    // placeholderTextColor: "#BDBDBD",
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
    // placeholderTextColor: "#BDBDBD",
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
    // placeholderTextColor: "#BDBDBD",
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
    // height: 50,
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
    marginBottom: 12,
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
  errorMsg: {
    color: "#FF6C00",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
  },
  spinner: {
    marginBottom: 15,
    color: "#FF6C00",
  },
});

import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import * as Location from "expo-location";
import { selectIsLoading } from "../redux/posts/postsSelectors";
import { createPost } from "../redux/posts/postsOperations";

const initialPublicationState = {
  name: "",
  location: { latitude: "", longitude: "" },
  geolocation: {
    country: "",
    region: "",
    city: "",
  },
  imageURL: "",
};

export default function CreatePostsScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [state, setState] = useState(initialPublicationState);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [isCameraActive, setIsCameraActive] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);  

  const updateButtonPublish = () => {
    const isPhoto = !!state.imageURL;
    const isName = !!state.name;
    const isLocation = !!state.location;
    const hasErrors = Object.keys(errorMsg).length > 0;
    setIsButtonActive(      
      isPhoto && isName && isLocation && !hasErrors
    );
  };

  useEffect(() => {
    updateButtonPublish();
  }, [state]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
    setIsCameraActive(true);    
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("У доступі до місцезнаходження відмовлено");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      let geoLocation = await Location.reverseGeocodeAsync(location.coords);

      setState((prevValues) => ({
        ...prevValues,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        geolocation: {
          country: geoLocation[0].country,
          region: geoLocation[0].region,
          city: geoLocation[0].city,
        },
      }));
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const takePhoto = async () => {
    if (isCameraActive && cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      await MediaLibrary.createAssetAsync(uri);
      setState((prevState) => ({ ...prevState, imageURL: uri }));
      getCurrentLocation();
    }
    setIsCameraActive(false);
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
      toValue: shift ? 16 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [shift]);

  const validateForm = () => {
    const errors = {};

    if (!state.imageURL) {
      errors.photo = "Фото обов'язкове";
    }
    if (!state.name) {
      errors.name = "Назва обов'язкова";
    }
    if (!state.location) {
      errors.location = "Місцезнаходження обов'язкове";
    }
    setErrorMsg(errors);

    return Object.keys(errors).length === 0;
  };

  const clearForm = () => {
    setState(initialPublicationState);
  };

  const createUserPost = () => {
    const isvalidData = validateForm();    
    if (isvalidData) {
      const newPublication = {
        name: state.name,
        location: state.location,
        geolocation: state.geolocation,
        imageURL: state.imageURL,
      };      
      dispatch(createPost(newPublication));      
      navigation.navigate("Posts");
    }    
  };


  const onChangeText = (e) => {    
    setState((prevValues) => ({
      ...prevValues,
      name: e,
    }));    
  };

  const onChangeLocation = (e) => {
    setState((prevValues) => ({
      ...prevValues,
      geolocation: { country: e },
    }));
  }; 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
        >
          <Animated.View style={[{ paddingBottom: position }]}>
            <View style={styles.photoContainer}>
              {state.imageURL ? (
                <View>
                  <Image
                    source={{ uri: state.imageURL }}
                    style={styles.photo}
                  />
                  <View style={styles.photoIconBox}>
                    <TouchableOpacity onPress={takePhoto}>
                      <View style={styles.transparentPhotoIcon}>
                        <IconFontAwesome
                          name="camera"
                          size={24}
                          style={styles.iconWithPhoto}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.text}>Редагувати фото</Text>
                </View>
              ) : (
                <View>
                  <View style={styles.withoutPhotoContainer}>
                    <Camera
                      style={styles.camera}
                      type={type}
                      ref={setCameraRef}
                    >
                      <View style={styles.photoIconBox}>
                        <TouchableOpacity onPress={takePhoto}>
                          <View style={styles.whitePhotoIcon}>
                            <IconFontAwesome
                              name="camera"
                              size={24}
                              style={styles.iconWithoutPhoto}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </Camera>
                  </View>

                  <Text style={styles.text}>Завантажте фото</Text>
                </View>
              )}
            </View>
            <TextInput
              placeholder="Назва..."
              value={state.name}
              style={styles.input}
              placeholderTextColor="#BDBDBD"
              onChangeText={onChangeText}
            />
            <View style={styles.locationContainer}>
              <IconAntDesign
                name="enviromento"
                size={24}
                style={styles.iconLocation}
              />
              <TextInput
                placeholder="Місцевість..."
                value={state.geolocation.country}
                style={styles.locationInput}
                placeholderTextColor="#BDBDBD"
                onChangeText={onChangeLocation}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, !isButtonActive && styles.inactiveButton]}
              onPress={() => {
                createUserPost();
                clearForm();
              }}
              disabled={!isButtonActive}
            >
              <Text
                style={[
                  styles.buttonText,
                  !isButtonActive && styles.inactiveButtonText,
                ]}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                clearForm();
              }}
              style={[
                styles.iconDeleteContainer,
                state.imageURL ||
                state.name.length > 0 ||
                state.location.length > 0
                  ? styles.iconDeleteContainerActive
                  : styles.iconDeleteContainerInactive,
              ]}
              disabled={
                !state.imageURL &&
                state.name.length < 1 &&
                Object.keys(state.location).length < 1
              }
            >
              <IconFeather
                name="trash-2"
                size={24}
                style={[
                  state.imageURL ||
                  state.name.length > 0 ||
                  Object.keys(state.location) > 0
                    ? styles.iconDeleteActive
                    : styles.iconDeleteInactive,
                ]}
              />
            </TouchableOpacity>
            {isLoading && <ActivityIndicator size="small" color="#FF6C00" />}
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const screenSize = Dimensions.get("screen");
const widthPhotoContainer = screenSize.width - 32;
const leftPositionFoto = screenSize.width / 2 - 46;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenSize.width,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 0,
    justifyContent: "space-between",
  },
  scrollViewContainer: {
    minHeight: screenSize.height,
    justifyContent: "flex-end",
  },
  photoContainer: {
    display: "block",
    width: widthPhotoContainer,
    height: 267,
    marginBottom: 32,
    alignItems: "center",
    overflow: "hidden",
  },
  withPhotoContainer: {
    height: 240,
    overflow: "hidden",
    borderRadius: 8,
  },
  withoutPhotoContainer: {
    width: widthPhotoContainer,
    height: 240,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#F6F6F6",
  },
  photo: {
    width: widthPhotoContainer,
    height: 240,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  photoIconBox: {
    position: "absolute",
    top: 90,
    left: leftPositionFoto,
    zIndex: 2,
  },
  transparentPhotoIcon: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  whitePhotoIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  iconWithPhoto: {
    color: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWithoutPhoto: {
    color: "#BDBDBD",
  },
  text: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    alignSelf: "flex-start",
    marginTop: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingVertical: 16,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    height: 50,
  },
  locationContainer: {
    width: widthPhotoContainer,
    height: 50,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  iconLocation: {
    color: "#BDBDBD",
  },
  locationInput: {
    flex: 1,
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    paddingTop: 16,
    paddingBottom: 15,
    marginLeft: 4,
  },
  button: {
    display: "flex",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 24,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
  inactiveButton: {
    backgroundColor: "#F6F6F6",
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
  },
  inactiveButtonText: {
    color: "#BDBDBD",
  },
  iconDeleteContainer: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
    marginBottom: 34,
  },
  iconDeleteContainerActive: {
    backgroundColor: "#FF6C00",
  },
  iconDeleteContainerInactive: {
    backgroundColor: "#F6F6F6",
  },
  iconDeleteActive: {
    color: "#FFFFFF",
  },
  iconDeleteInactive: {
    color: "#BDBDBD",
  },
  // - - - - - - - - - -
  camera: { flex: 1 },
  photoView: {
    flex: 1,
    display: "flex",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  flipContainer: {
    flex: 0.1,
    position: "absolute",
    bottom: 8,
    right: 15,
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
  buttonCamera: {
    display: "flex",
    justifyContent: "center",
    height: 40,
    width: 72,
    marginBottom: 10,
    paddingHorizontal: 18,
    paddingVertical: 0,
    borderRadius: 72,
    backgroundColor: "#FF6C00",
  },

  takePhotoOut: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 34,
    width: 34,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 34,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: "white",
    height: 24,
    width: 24,
    backgroundColor: "white",
    borderRadius: 24,
  },
});

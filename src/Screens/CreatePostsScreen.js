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
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import IconFeather from "react-native-vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";

const initialPublicationState = {
  name: "",
  location: "",
  imageURL: "",
};

export default function CreatePostsScreen() {
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [state, setState] = useState(initialPublicationState);  
  const [isButtonActive, setIsButtonActive] = useState(false);
  const updateButtonPublish = () => {
    const isPhoto = !!state.imageURL;
    const isName = !!state.name;
    const isLocation = !!state.location;
    setIsButtonActive(isPhoto && isName && isLocation);
  };

  const addPhoto = async () => {
    const options = {
      mediaType: "photo",
    };

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (result.assets && result.assets.length > 0) {
      setState((prevState) => ({
        ...prevState,
        imageURL: result.assets[0].uri,
      }));
    }
  };

  const clearForm = () => {
    setState(initialPublicationState);
  };

  const createPost = () => {
    navigation.navigate("Posts");
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
      toValue: shift ? 64 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [shift]);

  useEffect(() => {
    updateButtonPublish();
  }, [state]);

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
                  <ImageBackground
                    source={{ uri: state.imageURL }}
                    style={styles.photo}
                  />
                  <View style={styles.photoIconBox}>
                    <TouchableOpacity onPress={addPhoto}>
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
                    <View style={styles.photoIconBox}>
                      <TouchableOpacity onPress={addPhoto}>
                        <View style={styles.whitePhotoIcon}>
                          <IconFontAwesome
                            name="camera"
                            size={24}
                            style={styles.iconWithoutPhoto}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
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
              onChangeText={(text) => {
                setState((prevState) => ({ ...prevState, name: text }));
              }}
            />
            <View style={styles.locationContainer}>
              <IconAntDesign
                name="enviromento"
                size={24}
                style={styles.iconLocation}
              />
              <TextInput
                placeholder="Місцевість..."
                value={state.location}
                style={styles.locationInput}
                placeholderTextColor="#BDBDBD"
                onChangeText={(text) => {
                  setState((prevState) => ({
                    ...prevState,
                    location: text,
                  }));
                }}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, !isButtonActive && styles.inactiveButton]}
              onPress={() => {
                createPost();
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
                state.location.length < 1
              }
            >
              <IconFeather
                name="trash-2"
                size={24}
                style={[
                  state.imageURL ||
                  state.name.length > 0 ||
                  state.location.length > 0
                    ? styles.iconDeleteActive
                    : styles.iconDeleteInactive,
                ]}
              />
            </TouchableOpacity>
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
});

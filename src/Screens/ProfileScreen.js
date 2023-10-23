import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconFeather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import ButtonLogOut from "../components/ButtonLogOut";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto, deletePhoto } from "../redux/auth/authOperations";
import { addLike, getMyPosts } from "../redux/posts/postsOperations";
import { pageRefresh } from "../helpers/index";
import { selectUser } from "../redux/auth/authSelectors";
import { selectMyPosts } from "../redux/posts/postsSelectors";

export default function ProfileScreen() {
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const myPosts = useSelector(selectMyPosts);
  const [image, setImage] = useState(user.photoURL);

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  const fetchMyPosts = async () => {
    setUpdate(true);
    try {
      dispatch(getMyPosts());
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setUpdate(false);
  };

  const addNewLike = async (id, likes) => {
    const value = (likes += 1);
    dispatch(addLike({ id, value }));

    pageRefresh(id, () => {
      dispatch(getMyPosts());
    });
  };

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
      dispatch(addPhoto(result.assets[0].uri));
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
      dispatch(addPhoto(result.assets[0].uri));
    }
  };

  const deletePhotoUser = () => {
    if (user && user.photoURL) {
      dispatch(deletePhoto(user.photoURL));
      setImage("");
    }
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
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/photo_bg.png")}
        style={styles.bg}
        resizeMode="cover"
      />
      <View style={styles.profileContainer}>
        <View style={styles.photoContainer}>
          {image ? (
            <View style={styles.withPhotoUser}>
              <ImageBackground
                source={image ? { uri: image } : require("../img/Ellipse.jpg")}
                style={styles.photoUser}
              ></ImageBackground>
              <TouchableOpacity
                onPress={() => {
                  deletePhotoUser();
                }}
              >
                <IconAntDesign
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
                <IconAntDesign
                  name="pluscircleo"
                  size={25}
                  style={styles.iconAddPhotoUser}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.containerLogOut}>
          <ButtonLogOut />
        </View>
        <Text style={styles.nameUser}>{user.displayName}</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
          overScrollMode={"auto"}
          refreshControl={
            <RefreshControl refreshing={update} onRefresh={fetchMyPosts} />
          }
        >
          {myPosts.map((post) => {
            return (
              <View style={styles.publicationContainer} key={post.id}>
                <Image
                  source={{ uri: post.imageURL }}
                  style={styles.publicationPhoto}
                />
                <Text style={styles.publicationName}>{post.name}</Text>
                <View style={styles.publicationDataContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Comments", {
                        idPost: post.id,
                        imageURL: post.imageURL,
                      });
                    }}
                    style={styles.publicationCommentContainer}
                  >
                    <IconIonicons
                      name="chatbubble"
                      size={24}
                      style={styles.icon}
                    />
                    <Text style={styles.counts}>{post.comments.length}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addNewLike(post.id, post.likes)}
                    style={styles.publicationLikeContainer}
                  >
                    <IconFeather
                      name="thumbs-up"
                      size={24}
                      style={styles.iconLikeMainlyRED}
                    />
                    <Text style={[styles.counts, styles.countLike]}>
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      style={styles.publicationLocationContainer}
                      onPress={() => {
                        navigation.navigate("Map", {
                          imgLocation: post.location,
                        });
                      }}
                    >
                      <IconAntDesign
                        name="enviromento"
                        size={24}
                        style={styles.iconLocation}
                      />
                      <Text style={styles.locationText}>
                        {post.geolocation.country}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const screenSize = Dimensions.get("screen");
const widthPhotoContainer = screenSize.width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  bg: {
    top: 0,
    left: 0,
    position: "absolute",
    height: screenSize.height,
    width: screenSize.width,
    alignItems: "center",
  },
  photoContainer: {
    alignItems: "center",
    width: 120,
    height: 120,
    top: -60,
    borderRadius: 20,
    marginLeft: 100,
    zIndex: 0,
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
  profileContainer: {
    flex: 1,
    justifyContent: "flex-start",
    position: "relative",
    marginTop: 147,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  containerLogOut: {
    alignSelf: "flex-end",
    top: -102,
  },
  nameUser: {
    color: "#212121",
    textAlign: "center",
    fontFamily: "Roboto-Bold",
    fontSize: 30,
    fontStyle: "normal",
    fontWeight: "500",
    letterSpacing: 0.3,
    marginBottom: 33,
    marginTop: -52,
  },
  publicationPhoto: {
    flex: 1,
    width: widthPhotoContainer,
    height: 240,
    marginBottom: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  publicationContainer: {
    // display: "flex",
    // flexWrap: "wrap",
    width: "100%",
    marginBottom: 32,
  },
  publicationName: {
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "500",
    marginBottom: 10,
  },
  publicationDataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 35,
  },
  publicationCommentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    alignItems: "center",
  },
  counts: {
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
  },
  iconLikeGray: {
    color: "#BDBDBD",
  },
  iconLikeMainlyRED: {
    color: "#FF6C00",
  },
  countLike: {
    color: "#BDBDBD",
  },
  publicationLikeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    alignItems: "center",
    marginRight: "auto",
  },
  icon: {
    color: "#FF6C00",
  },
  publicationLocationContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    flexShrink: 1,
    alignItems: "center",
  },
  iconLocation: {
    color: "#BDBDBD",
  },
  locationText: {
    color: "#212121",
    textAlign: "right",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    textDecorationLine: "underline",
    flexShrink: 1,
  },
});

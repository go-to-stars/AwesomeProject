import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconFeather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import ButtonLogOut from "../components/ButtonLogOut";

const defaultDataArrayPosts = [
  {
    id: 1,
    publicationPhoto: require("../img/Forest.jpg"),
    publicationName: "Ліс",
    publicationCommentCount: 8,
    publicationLikeCount: 153,
    publicationLocation: "Ukraine",
  },
  {
    id: 2,
    publicationPhoto: require("../img/Sunset.jpg"),
    publicationName: "Захід на Чорному морі",
    publicationCommentCount: 3,
    publicationLikeCount: 200,
    publicationLocation: "Ukraine",
  },
  {
    id: 3,
    publicationPhoto: require("../img/Old_Home.jpg"),
    publicationName: "Старий будиночок у Венеції",
    publicationCommentCount: 50,
    publicationLikeCount: 200,
    publicationLocation: "Italy",
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState("");
  const [dataArrayPosts, setDataArrayPosts] = useState(defaultDataArrayPosts);

  const addLike = async (id, likes) => {
    const post = dataArrayPosts.find((item) => {
      return item.id === id;
    });
    const number = dataArrayPosts.findIndex((item) => {
      return item.id === id;
    });

    const newPost = { ...post, publicationLikeCount: likes + 1 };

    const oldDataArrayPosts = dataArrayPosts;
    const delPost = oldDataArrayPosts.splice(number, 1, newPost);

    setDataArrayPosts([...oldDataArrayPosts]);
  };

  const addPhotoUser = async () => {
    const options = {
      mediaType: "photo",
    };

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const deletePhotoUser = () => {
    setImage("");
  };

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
                source={{ uri: image }}
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
        <Text style={styles.nameUser}>Natali Romanova</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
          overScrollMode={"auto"}
        >
          {dataArrayPosts.map((post) => {
            return (
              <View style={styles.publicationContainer} key={post.id}>
                <Image
                  source={post.publicationPhoto}
                  style={styles.publicationPhoto}
                />
                <Text style={styles.publicationName}>
                  {post.publicationName}
                </Text>
                <View style={styles.publicationDataContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Comments", { idPost: post.id });
                    }}
                    style={styles.publicationCommentContainer}
                  >
                    <IconIonicons
                      name="chatbubble"
                      size={24}
                      style={styles.icon}
                    />
                    <Text style={styles.counts}>
                      {post.publicationCommentCount}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => addLike(post.id, post.publicationLikeCount)}
                    style={styles.publicationLikeContainer}
                  >
                    <IconFeather
                      name="thumbs-up"
                      size={24}
                      style={styles.iconLikeGray}
                    />
                    <Text style={[styles.counts, styles.countLike]}>
                      {post.publicationLikeCount}
                    </Text>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity
                      style={styles.publicationLocationContainer}
                      onPress={() => {
                        navigation.navigate("Map");
                      }}
                    >
                      <IconAntDesign
                        name="enviromento"
                        size={24}
                        style={styles.iconLocation}
                      />
                      <Text style={styles.locationText}>
                        {post.publicationLocation}
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

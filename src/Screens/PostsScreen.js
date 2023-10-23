import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,  
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Dimensions,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import IconIonicons from "react-native-vector-icons/Ionicons";
import IconFeather from "react-native-vector-icons/Feather";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { addLike, getAllPosts } from "../redux/posts/postsOperations";
import { auth } from "../redux/config";
import { pageRefresh } from "../helpers";
import { selectUser } from "../redux/auth/authSelectors";
import { selectAllPosts } from "../redux/posts/postsSelectors";

export default function PostsScreen() {
  const [update, setUpdate] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);  
  const allPosts = useSelector(selectAllPosts);

  const fetchAllPosts = async () => {
    setUpdate(true);
    try {
      dispatch(getAllPosts());
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setUpdate(false);
  };

  useEffect(() => {
    dispatch(getAllPosts());    
  }, [dispatch]);

  const addNewLike = async (id, likes) => {    
    const value = (likes += 1);
    dispatch(addLike({ id, value }));

    pageRefresh(id, () => {
      dispatch(getAllPosts());
    });
  };  

  return (
    <View style={styles.container}>     
      <View style={styles.userContainer}>
        {user && user.photoURL ? (
          <Image
            source={
              user.photoURL
                ? { uri: user.photoURL }
                : require("../img/Ellipse.jpg")
            }
            style={styles.avatar}
          ></Image>
        ) : (
          <View style={styles.withoutAvatar}></View>
        )}
        {user && (
          <View>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        overScrollMode={"auto"}
        refreshControl={
          <RefreshControl refreshing={update} onRefresh={fetchAllPosts} />
        }
      >
        {allPosts.map((post) => {
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
                {/* <TouchableOpacity
                  onPress={() => addNewLike(post.id, post.likes)}
                  style={styles.publicationLikeContainer}
                >
                  <IconFeather
                    name="thumbs-up"
                    size={24}
                    style={styles.iconLikeGray}
                  />
                  <Text style={[styles.counts, styles.countLike]}>
                    {post.likes}
                  </Text>
                </TouchableOpacity> */}
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
                      {post.geolocation.city}
                      {"  "}
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
  );
}

const screenSize = Dimensions.get("screen");
const widthPhotoContainer = screenSize.width - 32;

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
  withoutAvatar: {
    backgroundColor: "#F6F6F6",
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
  email: {
    fontFamily: "Roboto-Regular",
    color: "rgba(33, 33, 33, 0.80)",
    fontSize: 11,
    fontStyle: "normal",
    fontWeight: "400",
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
    // justifyContent: "flex-start",
    alignСontent: "space-between",
    gap: 35,
  },
  publicationCommentContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 6,
    alignItems: "center",
    marginRight: "auto",
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
    // alignItems: "center",
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

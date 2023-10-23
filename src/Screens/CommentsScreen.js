import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import IconIonicons from "react-native-vector-icons/Ionicons";
import { addComment, getComment } from "../redux/posts/postsOperations";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../redux/config";
import { RefreshControl } from "react-native";
import { pageRefresh } from "../helpers";
import { selectComments } from "../redux/posts/postsSelectors";

export default function CommentsScreen() {
  const navigation = useNavigation();
  const [newComment, setNewComment] = useState("");  
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));
  const [update, setUpdate] = useState(false);  
  const comments = useSelector(selectComments);
  const dispatch = useDispatch();
  const reversedComments = [...comments].reverse();
  const {
    params: { idPost, imageURL },
  } = useRoute();

  useEffect(() => {
    dispatch(getComment(idPost));
  }, [dispatch]);

  const fetchComments = async () => {
    setUpdate(true);
    try {
      dispatch(getComment(idPost));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
    setUpdate(false);
  };

  const formatDate = (date) => {
    const formattedDateString = new Date(date).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTimeString = new Date(date).toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const [day, month, year] = formattedDateString.split(" ");

    return `${day} ${month}, ${year} | ${formattedTimeString}`;
  };

  const addCommentText = async () => {
    if (newComment) {
      const currentDate = new Date().toISOString();
      const formattedDate = formatDate(currentDate);     
      const id = idPost;
      dispatch(addComment({ newComment, id, formattedDate }));
      setNewComment("");

      pageRefresh(id, () => {
        dispatch(getComment(id));
      });
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

  const setComment = (e) => {
    setNewComment(e);
  };

  const uid = auth.currentUser.uid;  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
          overScrollMode={"auto"}
          refreshControl={
            <RefreshControl refreshing={update} onRefresh={fetchComments} />
          }
        >
          <Animated.View
            style={[styles.formWrapper, { paddingBottom: position }]}
          >
            <View style={styles.photoContainer}>
              <ImageBackground
                source={{ uri: imageURL }}
                style={styles.photo}
              />
            </View>
            {reversedComments.map((comment) => {
              return (
                <View
                  style={
                    comment.userId !== uid
                      ? styles.commentsContainerCommentator
                      : styles.commentsContainerUser
                  }
                  key={comment.id}
                >
                  <Image
                    source={
                      comment.userURL
                        ? { uri: comment.userURL }
                        : require("../img/Ellipse.jpg")
                    }
                    style={styles.commentatorPhoto}
                  />
                  <View
                    style={
                      comment.userId !== uid
                        ? styles.commentContainerCommentator
                        : styles.commentContainerUser
                    }
                  >
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text
                      style={
                        comment.userId !== uid
                          ? styles.commentDate
                          : styles.commentUserDate
                      }
                    >
                      {comment.dataTime}
                    </Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Коментувати..."
                placeholderTextColor="#BDBDBD"
                value={newComment}
                onChangeText={setComment}
              />
              <TouchableOpacity onPress={addCommentText}>
                <IconIonicons
                  name="arrow-up-circle"
                  size={34}
                  style={styles.iconButton}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const screenSize = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },

  scrollViewContainer: {
    minHeight: screenSize.height,
    justifyContent: "flex-start",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 32,
    borderRadius: 8,
  },
  photo: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    position: "relative",
  },
  commentsContainerCommentator: {
    flex: 1,
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  commentsContainerUser: {
    flex: 1,
    flexDirection: "row-reverse",
    gap: 16,
    marginBottom: 24,
  },
  commentatorPhoto: {
    width: 28,
    height: 28,
    borderRadius: 28,
  },
  commentContainerCommentator: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    width: "100%",
    padding: 16,
    gap: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  commentContainerUser: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    width: "100%",
    padding: 16,
    gap: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  commentText: {
    width: "100%",
    color: "#212121",
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 18,
  },
  commentDate: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "400",
    textAlign: "right",
  },
  commentUserDate: {
    color: "#BDBDBD",
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "400",
    textAlign: "left",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#F6F6F6",
    padding: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 100,
  },
  commentInput: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 7,
    paddingLeft: 8,
  },
  iconButton: {
    color: "#FF6C00",
  },
});

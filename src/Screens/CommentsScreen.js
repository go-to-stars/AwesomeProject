import { useState, useEffect, useRef } from "react";
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

const defaultDataArrayComents = [
  {
    id: 1,
    owner: "commentator",
    photoUrl: require("../img/Ellipse.jpg"),
    commentText:
      "Really love your most recent photo. I've been trying to capture the same thing for a few months and would love some tips!",
    commentDate: "09 червня, 2020 | 08:40",
  },
  {
    id: 2,
    owner: "user",
    photoUrl: require("../img/Ellipse_User.jpg"),
    commentText:
      "A fast 50mm like f1.8 would help with the bokeh. I've been using primes as they tend to get a bit sharper images.",
    commentDate: "09 червня, 2020 | 09:14",
  },
  {
    id: 3,
    owner: "commentator",
    photoUrl: require("../img/Ellipse.jpg"),
    commentText: "Thank you! That was very helpful!",
    commentDate: "09 червня, 2020 | 09:20",
  },
];

export default function CommentsScreen() {
  const navigation = useNavigation();
  const [newComment, setNewComment] = useState("");
  const [dataArrayPosts, setDataArrayPosts] = useState(defaultDataArrayPosts);
  const [dataArrayComents, setDataArrayComents] = useState(
    defaultDataArrayComents
  );
  const [shift, setShift] = useState(false);
  const [position] = useState(new Animated.Value(0));

  const {
    params: { idPost },
  } = useRoute();

  const number = dataArrayPosts.findIndex((item) => {
    return item.id === idPost;
  });

  const imageURL = defaultDataArrayPosts[number].publicationPhoto;

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

  const addComment = () => {
    if (newComment) {
      const currentDate = new Date().toISOString();
      const formattedDate = formatDate(currentDate);
      const id = dataArrayComents[dataArrayComents.length - 1].id;
      const comment = {
        id: id + 1,
        owner: "user",
        photoUrl: require("../img/Ellipse_User.jpg"),
        commentText: newComment,
        commentDate: formattedDate,
      };
      const arrayComents = dataArrayComents;
      arrayComents.push(comment);
      setDataArrayComents([...arrayComents]);
      setNewComment("");
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          bounces={false}
          overScrollMode={"auto"}
        >
          <Animated.View
            style={[styles.formWrapper, { paddingBottom: position }]}
          >
            <View style={styles.photoContainer}>
              <ImageBackground source={imageURL} style={styles.photo} />
            </View>
            {dataArrayComents.map((comment) => {
              return (
                <View
                  style={
                    comment.owner === "commentator"
                      ? styles.commentsContainerCommentator
                      : styles.commentsContainerUser
                  }
                  key={comment.id}
                >
                  <Image
                    source={comment.photoUrl}
                    style={styles.commentatorPhoto}
                  />
                  <View
                    style={
                      comment.owner === "commentator"
                        ? styles.commentContainerCommentator
                        : styles.commentContainerUser
                    }
                  >
                    <Text style={styles.commentText}>
                      {comment.commentText}
                    </Text>
                    <Text
                      style={
                        comment.owner === "commentator"
                          ? styles.commentDate
                          : styles.commentUserDate
                      }
                    >
                      {comment.commentDate}
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
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={addComment}>
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
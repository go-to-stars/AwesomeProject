import { ref } from "firebase/storage";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { createAsyncThunk } from "@reduxjs/toolkit";
import "react-native-get-random-values";
import { auth, db, storage } from "../config";
import { convertUriToBlob } from "../../middlewares";
import { uploadPhotoToStorage } from "../../firebase";

// = = = = = = = = = = = = = = = CREATE POST = = = = = = = = = = = = = = =
export const createPost = createAsyncThunk(
  "posts/create",
  async ({ name, location, geolocation, imageURL }, { rejectWithValue }) => {
    let postImageURL = "";
    let storageRef = null;   
    try {
      if (imageURL) {
        const blob = await convertUriToBlob(imageURL);
        const uniquePreffix = `${Date.now()}_${Math.round(
          Math.random() * 1e9
        )}`;
        const format = imageURL.split(".").pop();
        storageRef = ref(storage, `posts/${uniquePreffix}.${format}`);
        postImageURL = await uploadPhotoToStorage(storageRef, blob);
      }

      if (postImageURL === "error") {
        return rejectWithValue("error");
      }
     
      const docRef = await addDoc(collection(db, "posts"), {
        uid: auth.currentUser.uid,
        name,
        location,
        geolocation,
        imageURL: postImageURL,
        comments: [],
        likes: 0,
      });
      
      await updateDoc(docRef, {
        id: docRef.id,
      });
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = GET MY POSTS = = = = = = = = = = = = = = =
export const getMyPosts = createAsyncThunk(
  "myPosts/get",
  async (_, { rejectWithValue }) => {
    try {
      const { uid } = auth.currentUser;
      const myPosts = [];
      const q = query(collection(db, "posts"), where("uid", "==", uid));
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        myPosts.push(doc.data());
      });

      return myPosts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = GET ALL POSTS = = = = = = = = = = = = = = =
export const getAllPosts = createAsyncThunk(
  "allPosts/get",
  async (_, { rejectWithValue }) => {
    try {
      const allPosts = [];
      const snapshot = await getDocs(collection(db, "posts"));
      snapshot.forEach((doc) => {
        allPosts.push(doc.data());
      });
      
      return allPosts;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = ADD LIKE = = = = = = = = = = = = = = =
export const addLike = createAsyncThunk(
  "post/addLike",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const { uid } = auth.currentUser;
      const collectionRef = collection(db, "posts");
      const docRef = doc(collectionRef, id);
      await updateDoc(docRef, {
        likes: value,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = ADD COMMENT = = = = = = = = = = = = = = =
export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ newComment, id, formattedDate }, { rejectWithValue }) => {
    try {
      const collectionRef = collection(db, "posts");
      const docRef = doc(collectionRef, id);
      await updateDoc(docRef, {
        comments: arrayUnion({
          id: `${Date.now()}_${Math.round(Math.random() * 1e9)}`,
          text: newComment,
          userId: auth.currentUser.uid,
          userURL: auth.currentUser.photoURL,
          dataTime: formattedDate,
        }),
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = GET COMMENT = = = = = = = = = = = = = = =
export const getComment = createAsyncThunk(
  "post/getComment",
  async (id, { rejectWithValue }) => {
    try {
      let comments;
      const q = query(collection(db, "posts"), where("id", "==", id));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        comments = doc.data().comments;
      });

      return comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

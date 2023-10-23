import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { auth, db, storage } from "../config";
import { convertUriToBlob } from "../../middlewares";
import {
  updateUserPhotoInFirestore,
  uploadPhotoToStorage,
} from "../../firebase";
import { HttpError } from "../../helpers";

// = = = = = = = = = = = = = = = REGISTER = = = = = = = = = = = = = = =
export const register = createAsyncThunk(
  "auth/register",
  async ({ displayName, email, password, photoURL }, { rejectWithValue }) => {
    let userPhotoURL = "";
    let storageRef = null;

    try {
      if (photoURL) {
        const blob = await convertUriToBlob(photoURL);

        const uniquePreffix = `${Date.now()}_${Math.round(
          Math.random() * 1e9
        )}`;

        const format = photoURL.split(".").pop();

        storageRef = ref(storage, `avatar/${uniquePreffix}.${format}`);

        userPhotoURL = await uploadPhotoToStorage(storageRef, blob);
      }

      if (userPhotoURL === "error") {
        return rejectWithValue("error");
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName,
        photoURL: userPhotoURL,
      });

      const docRef = await addDoc(collection(db, "users"), {
        id: user.uid,
        displayName,
        email,
        photoURL: userPhotoURL,
      });

      console.log("Користувач успішно доданий до Firestore з ID: ", docRef.id);
      return { displayName, email, photoURL };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = UPDATE USER INFORMATION = = = = = = = = = = = = = = =
export const authStateChanged = (onChange = () => {}) => {
  onAuthStateChanged(auth, (user) => {
    onChange(user);
  });
};

// = = = = = = = = = = = = = = = LOGIN = = = = = = = = = = = = = = =
export const logIn = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);

      if (!user) {
        return rejectWithValue((error.message = "Email or password is wrong"));
      }

      const displayName = user._tokenResponse.displayName;
      const photoURL = user._tokenResponse.profilePicture;

      return { displayName, email, photoURL };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = LOGOUT = = = = = = = = = = = = = = =
export const logOut = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = REFRESH = = = = = = = = = = = = = = =
export const refresh = createAsyncThunk(
  "auth/updateProfile",
  async (update) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateProfile(user, update);
        return user;
      } catch (error) {
        throw error;
      }
    }
  }
);

// = = = = = = = = = = = = = = = ADDPHOTO = = = = = = = = = = = = = = =
export const addPhoto = createAsyncThunk(
  "auth/addPhoto",
  async (photoURL, { rejectWithValue }) => {
    try {
      const blob = await convertUriToBlob(photoURL);
      const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      const format = photoURL.split(".").pop();
      const storageRef = ref(storage, `avatar/${uniquePreffix}.${format}`);
      const newUserPhotoURL = await uploadPhotoToStorage(storageRef, blob);

      if (newUserPhotoURL === "error") {
        return rejectWithValue("error");
      }
      const user = auth.currentUser;

      updateUserPhotoInFirestore("users", "email", user.email, {
        photoURL: newUserPhotoURL,
      });

      await updateProfile(user, { photoURL: newUserPhotoURL });

      return newUserPhotoURL;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// = = = = = = = = = = = = = = = DELETEPHOTO = = = = = = = = = = = = = = =
export const deletePhoto = createAsyncThunk(
  "auth/deletePhoto",
  async (_, { rejectWithValue }) => {
    try {
      // Видалення фото з Firebase Storage
      const user = auth.currentUser;
      updateUserPhotoInFirestore("users", "email", user.email, {
        photoURL: "",
      });

      const desertRef = ref(storage, user.photoURL);
      await deleteObject(desertRef);

      // Оновлення фотоURL користувача в Firebase Auth
      await updateProfile(auth.currentUser, {
        photoURL: "",
      });
    } catch (error) {
      console.error("Помилка при видаленні фото:", error);
      return rejectWithValue(error.message);
    }
  }
);

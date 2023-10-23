import { createSlice } from "@reduxjs/toolkit";
import {
  register,
  logIn,
  logOut,
  refresh,
  addPhoto,
  deletePhoto,
  updateUser,
} from "./authOperations";

const initialState = {
  user: { displayName: null, email: null, password: null, photoURL: "" },
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,  
}; // значення стану за замовчуванням

// const isPending = (state) => {
//   state.isLoading = true;
// }; // функція isPending, змінює значення стейту isLoading на true

// const isRejected = (state, action) => {
//   state.isLoading = false;
//   state.error = action.payload;
//   state.isLoggedIn = false;
// }; // функція isRejected, змінює значення стейтів isLoading та isLoggedIn на false та записує в стейт текст повідомлення об'єкта помилки



const authSlice = createSlice({
  name: "auth",
  initialState,    
  // extraReducers: {
  //   [register.pending]: isPending, 
  //   [register.fulfilled](state, action) {
  //     state.user = action.payload;
  //     state.isLoggedIn = true;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [register.rejected]: isRejected, 
  //   [logIn.pending]: isPending, 
  //   [logIn.fulfilled](state, action) {
  //     state.user = action.payload.user;
  //     state.isLoggedIn = true;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [logIn.rejected]: isRejected, 
  //   [logOut.pending]: isPending, 
  //   [logOut.fulfilled](state) {
  //     state.user = { name: null, email: null, password: null, photoURL: "" };
  //     state.isLoggedIn = false;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [logOut.rejected]: isRejected, 
  //   [refresh.pending]: isPending, 
  //   [refresh.fulfilled](state, action) {
  //     state.user = action.payload;
  //     state.isLoggedIn = true;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [refresh.rejected]: isRejected, 
  //   [addPhoto.pending]: isPending, 
  //   [addPhoto.fulfilled](state, action) {
  //     state.user.photoURL = action.payload;
  //     state.isLoggedIn = true;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [addPhoto.rejected]: isRejected, 
  //   [deletePhoto.pending]: isPending, 
  //   [deletePhoto.fulfilled](state, action) {
  //     state.user.photoURL = "";
  //     state.isLoggedIn = true;
  //     state.isLoading = false;
  //     state.error = null;
  //   }, 
  //   [deletePhoto.rejected]: isRejected, 
  // },
  extraReducers: (builder) => {
    builder

      // = = = = = = = = = = = = = = = REGISTER = = = = = = = = = = = = = = =
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorRegister = null;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorRegister = action.error.message;
      })

      // = = = = = = = = = = = = = = = LOGIN = = = = = = = = = = = = = = =
      .addCase(logIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorLogin = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {        
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload;        
        state.error = null;
        state.errorRegister = null;
        state.errorDeleteAvatar = null;
        state.errorAddAvatar = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorLogin = action.error.message;
      })

      // = = = = = = = = = = = = = = = LOGOUT = = = = = = = = = = = = = = =
      .addCase(logOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorLogOut = null;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = {
          displayName: null,
          email: null,
          photoURL: "",
          password: null,
        };
        state.error = null;
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorLogOut = action.payload;
      })

      // = = = = = = = = = = = = = = = REFRESH = = = = = = = = = = = = = = =
      .addCase(refresh.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorRefresh = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorRefresh = action.error.message;
      })

      // = = = = = = = = = = = = = = = ADDPHOTO = = = = = = = = = = = = = = =
      .addCase(addPhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorAddPhotoUser = null;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorAddPhotoUser = null;
        state.error = null;
        state.user.photoURL = action.payload;
      })
      .addCase(addPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorAddPhotoUser = action.payload;
      })

      // = = = = = = = = = = = = = = = DELETEPHOTO = = = = = = = = = = = = = = =
      .addCase(deletePhoto.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.errorDeletePhotoUser = null;
      })
      .addCase(deletePhoto.fulfilled, (state) => {
        state.isLoading = false;
        state.errorDeletePhotoUser = null;
        state.user.photoURL = "";
        state.error = null;
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.errorDeletePhotoUser = action.payload;
      });
  },
});

export const authReducer = authSlice.reducer; // експорт редюсера функції authSlice

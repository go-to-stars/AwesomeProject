import { createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  getMyPosts,
  getAllPosts,
  addLike,
  addComment,
  getComment,
} from "./postsOperations";

const postInitialState = {
  comments: [],
  geolocation: { country: "", region: "", city: "" },
  id: null,
  imageURL: "",
  likes: null,
  location: { latitude: "", longitude: "" },
  name: "",
  uid: "",
  myPosts: [],
  allPosts: [],
  isLoading: false,
  error: null,
};

// const isPending = (state) => {
//   state.isLoading = true;
// }; // функція isPending, змінює значення стейту isLoading на true

// const isRejected = (state, action) => {
//   state.isLoading = false;
//   state.error = action.payload;
// }; // функція isRejected, змінює значення стейтів isLoading та isLoggedIn на false та записує в стейт текст повідомлення об'єкта помилки

const postSlice = createSlice({
  name: "posts",
  initialState: postInitialState,
  // extraReducers: {
  //   [createPost.pending]: isPending,
  //   [createPost.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.error = null;
  //   },
  //   [createPost.rejected]: isRejected,
  //   [getMyPosts.pending]: isPending,
  //   [getMyPosts.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.myPosts = action.payload;
  //     state.error = null;
  //   },
  //   [getMyPosts.rejected]: isRejected,
  //   [getAllPosts.pending]: isPending,
  //   [getAllPosts.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.myPosts = action.payload;
  //     state.error = null;
  //   },
  //   [getAllPosts.rejected]: isRejected,
  //   [addLike.pending]: isPending,
  //   [addLike.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.error = null;
  //   },
  //   [addLike.rejected]: isRejected,
  //   [addComment.pending]: isPending,
  //   [addComment.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.error = null;
  //   },
  //   [addComment.rejected]: isRejected,
  //   [getComment.pending]: isPending,
  //   [getComment.fulfilled](state, action) {
  //     state.isLoading = false;
  //     state.comments = action.payload;
  //     state.error = null;
  //   },
  //   [getComment.rejected]: isRejected,
  // },
  extraReducers: (builder) => {
    builder

      // = = = = = = = = = = = = = = = CREATE POST = = = = = = = = = = = = = = =
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // = = = = = = = = = = = = = = = GET MY POSTS = = = = = = = = = = = = = = =
      .addCase(getMyPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyPosts.fulfilled, (state, action) => {
        state.myPosts = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMyPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // = = = = = = = = = = = = = = = GET ALL POSTS = = = = = = = = = = = = = = =
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.allPosts = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // = = = = = = = = = = = = = = = ADD LIKE = = = = = = = = = = = = = = =
      .addCase(addLike.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addLike.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addLike.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // = = = = = = = = = = = = = = = ADD COMMENT = = = = = = = = = = = = = = =
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // = = = = = = = = = = = = = = = GET COMMENT = = = = = = = = = = = = = = =
      .addCase(getComment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getComment.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getComment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const postsReducer = postSlice.reducer;

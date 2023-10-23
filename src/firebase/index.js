// export { default as uploadToStorage } from "./uploadToStorage";
// export { default as updateUserPhotoInFirestore } from "./updateUserPhoto";
// export { default as userVerification } from "./userVerification";

const uploadPhotoToStorage = require("./uploadPhotoToStorage.js");
const updateUserPhotoInFirestore = require("./updateUserPhotoInFirestore");
const userVerification = require("./userVerification.js");

module.exports = {
  uploadPhotoToStorage,
  updateUserPhotoInFirestore,
  userVerification,
};

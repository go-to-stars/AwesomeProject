import {
  getDownloadURL,
  uploadBytes,  
} from "firebase/storage";


const uploadPhotoToStorage = async (storageRef, photoFile) => {
  try {
    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadTask = await uploadBytes(storageRef, photoFile, metadata); 
    const url = await getDownloadURL(storageRef);
    
    return url;
  } catch (error) {
    throw error;
  }
};

module.exports = uploadPhotoToStorage;

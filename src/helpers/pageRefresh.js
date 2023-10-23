import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../redux/config";

const pageRefresh = async (id, callback) => {
  try {
    const q = query(collection(db, "posts"), where("id", "==", id));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          callback();
          unsubscribe();
        }
      });
    });
  } catch (error) {
    return error.message;
  }
};

module.exports = pageRefresh;
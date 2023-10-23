import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../redux/config";

const userVerification = async (email) => {;
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

module.exports = userVerification;

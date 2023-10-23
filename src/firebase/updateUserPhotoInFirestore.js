import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../redux/config";

// export default async function updateUserPhotoInFirestore(
 const updateUserPhotoInFirestore = async (
    collectionName,
    fieldToSearch,
    valueToSearch,
    newData
  ) => {
    try {
      // Спочатку знаходимо документ за певною умовою
      const q = query(
        collection(db, collectionName),
        where(fieldToSearch, "==", valueToSearch)
      );
      const snapshot = await getDocs(q);

      // Перебираємо результати запиту
      snapshot.forEach((document) => {
        const documentId = document.id; // Отримуємо ID документа

        // Оновлюємо документ з отриманим ID і новими даними
        const docRef = doc(db, collectionName, documentId);
        updateDoc(docRef, newData);
      });
    } catch (error) {
      console.error(error);
    }
}
  
module.exports = updateUserPhotoInFirestore;

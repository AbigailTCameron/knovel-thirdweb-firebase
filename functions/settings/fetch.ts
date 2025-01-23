import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import initializeFirebaseClient from "@/lib/initFirebase";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const { db } = initializeFirebaseClient();

export const uploadProfilePicture = async (filePath: string, file: File, userId: string, oldFilePath: string) => {
  try {
      const storageRef = getStorage();

      // Step 1: Delete the existing file if it exists
      if(oldFilePath){
          const oldFileRef = ref(storageRef, `profilePictures/${oldFilePath}`);
          await deleteObject(oldFileRef);
      }

      // Upload the file to Firebase Storage
      const fileRef = ref(storageRef, `profilePictures/${filePath}`);
      await uploadBytes(fileRef, file);

      // Step 2: Get the file's download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Step 3: Update the user's Firestore profile with the new avatar URL
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { profilePicture: downloadURL, profilePicturePath: filePath });

      console.log("Profile picture uploaded and profile updated successfully.");
      return downloadURL;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading profile image:", error.message);
    } else {
      console.error("Error uploading profile image:", String(error));
    }
  }
}

export const saveSettingsProfile = async (userId: string, name: string, username: string, setUsernameTaken: Function) => {
  try{
      // Normalize the username: remove trailing spaces and convert to lowercase
      const normalizedUsername = username.trim().toLowerCase();
      
      // Step 1: Check if the username is already taken
      const usersCollection = collection(db, "users");
      const usernameQuery = query(usersCollection, where("username", "==", normalizedUsername));
      const querySnapshot = await getDocs(usernameQuery);

       // Check if the username exists and does not belong to the current user
      if (!querySnapshot.empty) {
        const existingUser = querySnapshot.docs.find((doc) => doc.id !== userId);
        if (existingUser) {
          setUsernameTaken(true);
          return; 
        }
      }

      // Step 3: Update the user's Firestore profile with the new avatar URL
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { name: name, username: normalizedUsername });
    
      return;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error saving settings:", error.message);
    } else {
      console.error("Error saving settings:", String(error));
    }
  }
}
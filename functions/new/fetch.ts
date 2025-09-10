import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import initializeFirebaseClient from "@/lib/initFirebase";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const { db } = initializeFirebaseClient();


export const checkUsername = async (username: string) => {
  try{
      // Normalize the username: remove trailing spaces and convert to lowercase
      const normalizedUsername = username.trim().toLowerCase();

      // Step 1: Check if the username is already taken
      const usersCollection = collection(db, "users");
      const usernameQuery = query(usersCollection, where("username", "==", normalizedUsername));
      const querySnapshot = await getDocs(usernameQuery);

      return !querySnapshot.empty; 

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error saving settings:", error.message);
    } else {
      console.error("Error saving settings:", String(error));
    }
  }
}


export const newUpload = async (filePath: string, file: File, userId: string, name: string, username: string, bio: string, selectedGenres: string[]) => {
  try {
      // Normalize the username: remove trailing spaces and convert to lowercase
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedName = name.trim().toLowerCase();

      const storageRef = getStorage();

      // Upload the file to Firebase Storage
      const fileRef = ref(storageRef, `profilePictures/${filePath}`);
      await uploadBytes(fileRef, file);

      // Step 2: Get the file's download URL
      const downloadURL = await getDownloadURL(fileRef);

      // Step 3: Update the user's Firestore profile with the new avatar URL
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {name: normalizedName, username: normalizedUsername, bio: bio, profilePicture: downloadURL, profilePicturePath: filePath, genres: selectedGenres });

      // console.log("Profile picture uploaded and profile updated successfully.");
      // return downloadURL;

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading profile image:", error.message);
    } else {
      console.error("Error uploading profile image:", String(error));
    }
  }
}


export const updateGenres = async(userId: string, selectedGenres: string[]) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { genres: selectedGenres });
    console.log("Genres updated successfully!");

  }catch(err){
    console.error("Error trying to save the genres", err); 
  }
}


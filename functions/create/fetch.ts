import initializeFirebaseClient from "@/lib/initFirebase";
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const { db } = initializeFirebaseClient();

export const handleSubmitDraft = async (userId: string, name: string, title: string, titleContent: string, content: string) => {
  try{
      // const {downloadURL, filePath} = await uploadDraftImageToFirebase(file, userId, filename);
      
      // Step 1: Create draft data
      const draftData = {
        authorId: userId,
        author: name,
        title: title,
        book_image: '',
        bookPath: '',
        synopsis: '',
        created_at: serverTimestamp(),
        genres: [],
        draft_chapters: [
          {
            title: titleContent,
            content: content,
            completed: false,
            createdAt: new Date(),
          },
        ],
      };

      // Step 2: Generate a Firestore auto ID
      const draftsCollection = collection(db, "drafts", userId, "userDrafts");
      const draftRef = doc(draftsCollection); // Generate a unique draft ID
      const draftId = draftRef.id;

      // Step 3: Save draft data to Firestore
      await setDoc(draftRef, draftData);

      // Step 4: Update the user's profile with the draft ID
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User profile not found.');
        return;
      }

      const userData = userSnap.data();
  
      await updateDoc(userRef, {
        drafts: arrayUnion(draftId), // Add the new draft ID to the user's drafts array
      });

      return draftId;
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error creating draft:", error.message);
    } else {
      console.error("Error creating draft:", String(error));
    }
  }
}


export async function uploadDraftImageToFirebase(file: File | null, userId: string, filename: string) {
  try {
    if(file){
      const storage = getStorage();
      const filePath = `drafts/${userId}/${filename}`;

      // Upload the file to Firebase Storage
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      return { downloadURL, filePath };
    }else {
      return {};
    }
  
  } catch (error) {
    console.error('Error uploading image:', error);
    return {};
  }
}
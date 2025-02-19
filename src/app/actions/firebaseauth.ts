'use client'

import initializeFirebaseClient from "@/lib/initFirebase";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const {auth, db} = initializeFirebaseClient();

export const firebaseAuthClient = (token: string, router: any) => {
  signInWithCustomToken(auth, token)
  .then((userCredential) => {

    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid!);
    getDoc(userRef).then((doc) => {
       if(!doc.exists()){
        setDoc(userRef, {
          createdAt: serverTimestamp(), 
          profilePicture: "", 
          name: "", 
          followers:[], 
          following:[], 
          genres:[],
          username: "", 
          bookmark:[], 
          published:[], 
          drafts:[]}, 
          {merge: true}
        );
       }
    }) 

    
    router.push('/explore');
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage); 
  });
}


export const firebaseLogout = async(router: any) => {
  await signOut(auth).then(() => {
    router.push('/'); 
  })
}



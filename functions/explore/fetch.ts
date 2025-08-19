import initializeFirebaseClient from "@/lib/initFirebase";
import {
  deleteDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where
} from "firebase/firestore";
import { Account, smartWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb/chains";
import { client, personalAccount } from "@/lib/client";
import { Notification } from "../..";
import { getContract, sendTransaction } from "thirdweb";
import { balanceOf, claimTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount } from "thirdweb/react";

const { db } = initializeFirebaseClient();

export const getUserProfile = async (userId: string, setProfileUrl: Function) => {

    // Fetch user document from Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      setProfileUrl(userData.profilePicture || null);
      return userData;
    } else {
      console.log("User document not found.");
      return null;
    }
}

export const fetchBooks = async (setBooks: Function) => {
  try {
      const booksCollection = collection(db, "books");


    // Query: get the 20 newest by created_at
    const booksQuery = query(
      booksCollection,
      orderBy("created_at", "desc"),
      limit(20)
    );

      const querySnapshot = await getDocs(booksQuery);

      // Map data to usable format
      const books = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Set books and last document
      setBooks(books); // Append new books
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }

}

export const fetchTopRated = async (setBooks: Function) => {
  try{
    const booksCollection = collection(db, "books");

    // Create the query
    const booksQuery = query(booksCollection, orderBy("rating", "desc"), limit(20));

    const querySnapshot = await getDocs(booksQuery);

    // Map data to usable format
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Set books and last document
    setBooks(books); // Append new books

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

export const fetchBooksByGenre = async(genre: string, setBooks: Function) => {
  try {
    const booksCollection = collection(db, "books");

    const booksQuery = query(booksCollection, where("genres", "array-contains", genre));

    const querySnapshot = await getDocs(booksQuery);

    // Map the query results into an array of books
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBooks(books);

  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

export const fetchSearchResults = async(queryText: string, setResults: Function) => {
  try {
    const booksCollection = collection(db, "books");

    // Create a query for matching titles (case-sensitive)
    const booksQuery = query(
        booksCollection, or(
            where("search_keywords", "array-contains", queryText.toLowerCase()),
            where("genres", "array-contains", queryText.toLowerCase()),
        )
    );
  
    const querySnapshot = await getDocs(booksQuery);

    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setResults(results);
  }catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching books:", error.message);
    } else {
      console.error("Error fetching books:", String(error));
    }
  }
}

export const fetchNotifications = async (userId: string, setNotifications: Function) => {
  try {
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("recipientId", "==", userId),
      orderBy("createdAt", "desc")
    );    
    
    const querySnapshot = await getDocs(q);

    const notifs = await Promise.all(
      querySnapshot.docs.map(async (docSnapshot) => {
        const notifData = docSnapshot.data();
        const commenterId = notifData.commenterId;
        const bookId = notifData.bookId;

        // Fetch commenter profile
        let commenterProfile = "";
        if (commenterId) {
          const userRef = doc(db, "users", commenterId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            commenterProfile = userSnap.data().profilePicture || "";
          }
        }

        // Fetch book
        let bookImage = "";
        if (bookId) {
          const bookRef = doc(db, "books", bookId);
          const bookSnap = await getDoc(bookRef);
          if (bookSnap.exists()) {
            bookImage = bookSnap.data().book_image || "";
          }
        }

        return {
          id: docSnapshot.id,
          ...notifData,
          commenterProfile, 
          bookImage
        };
      }))

      setNotifications(notifs);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, "notifications", notificationId);

    const docSnapshot = await getDoc(notificationRef);
    
    if (!docSnapshot.exists()) {
      console.error('Notification does not exist');
      return;
    }

    await updateDoc(notificationRef, {
      isRead: true,
    });
  } catch (err) {
    console.error("Error marking notification as read:", err);
  }
};

export const deleteNotif = async (commentId: string) => {
  try {
        // Step 1: Delete the comment document
        const notificationRef = doc(db, "notifications", commentId);
        await deleteDoc(notificationRef);
    
        return { success: true };

  } catch (err) {
    console.error("Error deleting notification:", err);
    return { success: false };

  }
}


const smartContractConfig = async(account: Account) => {
  // Configure the smart wallet
  const wallet = smartWallet({
    chain: defineChain(123420001114),
    sponsorGas: true,
  });

  // Connect the smart wallet
  const smartAccount = await wallet.connect({
    client,
    personalAccount: account,
  });

  // connect to your contract
  const contract = getContract({
    client,
    chain: defineChain(123420001114),
    address: "0x9c327f77070124C072eC3f2456DD42838fECDE33",
  });

  return {contract, smartAccount}
}

export const mintNft = async (userId: string, setClaimed: Function, account: Account) => {

  try {
      const {contract, smartAccount} = await smartContractConfig(account); 

      const transaction = claimTo({
        contract: contract,
        to: userId,
        tokenId: BigInt(0),
        quantity: BigInt(1),
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account: smartAccount,
      });
      //console.log(`Transaction successful with hash: ${transactionHash}`);

      return { success: true };
  }catch(err: any){
    console.error(err);
    if (err.message && err.message.includes('DropClaimExceedLimit')) {
      setClaimed(true);
      return { success: false, error: 'You have already claimed this NFT.' };
    }
    return { success: false, error: 'An unexpected error occurred during minting.' };
  }

}


export const fetchUserNftBalance = async (userId: string, setUserBalance: Function) => {
  if (userId) {
    try {
      // connect to your contract
      const contract = getContract({
        client,
        chain: defineChain(123420001114),
        address: "0x9c327f77070124C072eC3f2456DD42838fECDE33",
      });

      const balance = await balanceOf({
        contract,
        owner: userId,
        tokenId: BigInt(0), // Replace 0 with your actual tokenId
      });

      setUserBalance(Number(balance));
      //console.log("The balance is", Number(balance));
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  }
};
import { Timestamp } from "firebase-admin/firestore";

export const formatDate = (timestamp: Timestamp) => {

  if(timestamp){
    const date = timestamp.toDate();
      // Format the date as desired (e.g., 'MM/DD/YYYY, HH:mm:ss')
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
};

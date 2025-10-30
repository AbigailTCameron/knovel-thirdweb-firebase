"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initializeFirebaseClient;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
// Create Client-Side Instance of Firebase
function initializeFirebaseClient() {
    const firebaseApp = (0, app_1.initializeApp)({
        apiKey: process.env.NEXT_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_APP_ID,
    });
    const db = (0, firestore_1.getFirestore)(firebaseApp);
    const auth = (0, auth_1.getAuth)(firebaseApp);
    return {
        db,
        auth,
    };
}

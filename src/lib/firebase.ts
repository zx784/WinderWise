
// This is a server-side file, but its exports are used by client components.
// It initializes Firebase and exports auth and firestore instances.

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Add this line to check the loaded configuration
console.log('Firebase Config being used:', firebaseConfig);

let configErrorMessage = "";
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_api_key_here") {
  configErrorMessage += "** Your Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or using a placeholder.\n";
}
if (!firebaseConfig.authDomain || typeof firebaseConfig.authDomain !== 'string' || firebaseConfig.authDomain.includes("your-project-id") || firebaseConfig.authDomain.trim() === "") {
  configErrorMessage += "** Your Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) might be incorrect, missing, or using a placeholder.\n";
}
if (!firebaseConfig.projectId || typeof firebaseConfig.projectId !== 'string' || firebaseConfig.projectId.includes("your-project-id") || firebaseConfig.projectId.trim() === "") {
  configErrorMessage += "** Your Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) might be incorrect, missing, or using a placeholder.\n";
}

if (configErrorMessage) {
  console.error(
    "******************************************************************************************\n" +
    "** FIREBASE CONFIGURATION ERROR(S) DETECTED                                             **\n" +
    configErrorMessage +
    "** Please ensure your .env file is correctly set up with your actual Firebase project   **\n" +
    "** credentials. Also, verify that the Email/Password sign-in method is ENABLED in     **\n" +
    "** your Firebase project's Authentication settings in the Firebase Console.             **\n" +
    "** Example .env values (replace placeholders with your actual values):                   **\n" +
    "** NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyYOUR_ACTUAL_KEY                                  **\n" +
    "** NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com                    **\n" +
    "** NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id                                     **\n" +
    "** ...and other Firebase configuration values.                                           **\n" +
    "******************************************************************************************"
  );
}


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

export { app, auth, db };

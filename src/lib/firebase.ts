
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

// Check if the API key is a placeholder or missing, and log a prominent error.
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_api_key_here") {
  console.error(
    "******************************************************************************************\n" +
    "** FIREBASE CONFIGURATION ERROR                                                          **\n" +
    "** Your Firebase API Key appears to be missing or is using a placeholder value.         **\n" +
    "** Please ensure your .env file is correctly set up with your actual Firebase project   **\n" +
    "** credentials. For example:                                                             **\n" +
    "** NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyYOUR ACTUALKEY...\n" +
    "** NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com\n" +
    "** ...and other Firebase configuration values.                                           **\n" +
    "******************************************************************************************"
  );
  // Note: Firebase will also throw its own error, which will likely halt execution.
  // This console log aims to make the cause clearer in the development console.
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

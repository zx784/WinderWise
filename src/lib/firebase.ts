
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

// Detailed configuration check
let configErrorMessage = "";
console.log("--- Firebase Configuration Check ---");

if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_api_key_here" || firebaseConfig.apiKey === "YOUR_ACTUAL_API_KEY_HERE") {
  configErrorMessage += "** Your Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing, uses a placeholder, or is incorrect.\n";
  console.error("NEXT_PUBLIC_FIREBASE_API_KEY: STATUS - MISSING or PLACEHOLDER");
} else {
  console.log("NEXT_PUBLIC_FIREBASE_API_KEY: STATUS - Loaded (length:", firebaseConfig.apiKey.length, ")");
}

if (!firebaseConfig.authDomain || typeof firebaseConfig.authDomain !== 'string' || firebaseConfig.authDomain.includes("your-project-id") || firebaseConfig.authDomain.trim() === "" || firebaseConfig.authDomain === "YOUR_ACTUAL_AUTH_DOMAIN_HERE") {
  configErrorMessage += "** Your Firebase Auth Domain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) might be incorrect, missing, or using a placeholder.\n";
  console.error("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: STATUS - MISSING or PLACEHOLDER");
} else {
  console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: STATUS - Loaded (value:", firebaseConfig.authDomain, ")");
}

if (!firebaseConfig.projectId || typeof firebaseConfig.projectId !== 'string' || firebaseConfig.projectId.includes("your-project-id") || firebaseConfig.projectId.trim() === "" || firebaseConfig.projectId === "YOUR_ACTUAL_PROJECT_ID_HERE") {
  configErrorMessage += "** Your Firebase Project ID (NEXT_PUBLIC_FIREBASE_PROJECT_ID) might be incorrect, missing, or using a placeholder.\n";
  console.error("NEXT_PUBLIC_FIREBASE_PROJECT_ID: STATUS - MISSING or PLACEHOLDER");
} else {
  console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID: STATUS - Loaded (value:", firebaseConfig.projectId, ")");
}

// You can add similar checks for other variables like storageBucket, messagingSenderId, appId if they are critical for your app's startup.

if (configErrorMessage) {
  console.error(
    "******************************************************************************************\n" +
    "** FIREBASE CONFIGURATION ERROR(S) DETECTED                                             **\n" +
    configErrorMessage +
    "** Please ensure your .env file (located in the root of your project) is correctly    **\n" +
    "** set up with your actual Firebase project credentials. Values should be enclosed    **\n" +
    "** in quotes, e.g., NEXT_PUBLIC_FIREBASE_API_KEY=\"AIzaSy...\".                         **\n" +
    "** Also, verify that the Email/Password sign-in method is ENABLED in your Firebase    **\n" +
    "** project's Authentication settings in the Firebase Console.                          **\n" +
    "******************************************************************************************"
  );
} else {
  console.log("--- Firebase Configuration Check: All checked variables appear to be loaded. ---");
}


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase App initialized successfully.");
  } catch (e: any) {
    console.error("!!! Firebase initialization FAILED:", e.message, "(Code:", e.code, ")");
    // @ts-ignore
    app = undefined; // Ensure app is undefined if init fails
  }
} else {
  app = getApp();
  console.log("Existing Firebase App instance retrieved.");
}

// @ts-ignore
const auth: Auth = app ? getAuth(app) : undefined;
// @ts-ignore
const db: Firestore = app ? getFirestore(app) : undefined;

if (!auth) {
    console.error("!!! Firebase Auth could not be initialized. Authentication will not work. !!!");
}
if (!db) {
    console.error("!!! Firebase Firestore could not be initialized. Firestore operations will not work. !!!");
}


export { app, auth, db };

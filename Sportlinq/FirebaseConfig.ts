// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm6OS-wOmkdF3mngTMqf4Gs1yk4qUIors",
  authDomain: "sportlinq-a536d.firebaseapp.com",
  projectId: "sportlinq-a536d",
  storageBucket: "sportlinq-a536d.appspot.com",
  messagingSenderId: "471065541032",
  appId: "1:471065541032:web:0994a0e68011f6205e859d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
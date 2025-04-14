// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-599cd.firebaseapp.com",
  projectId: "mern-estate-599cd",
  storageBucket: "mern-estate-599cd.appspot.com",
  messagingSenderId: "464831118345",
  appId: "1:464831118345:web:1c76bfc7ce90a3bfd0ccd8"
};

// Initialize Firebase 
export const app = initializeApp(firebaseConfig);
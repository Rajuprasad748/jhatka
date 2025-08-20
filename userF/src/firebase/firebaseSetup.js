// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2lFpJeD_6BemXHqzo2mXSS3VLkS3KvxI",
  authDomain: "dummy-bc06c.firebaseapp.com",
  projectId: "dummy-bc06c",
  storageBucket: "dummy-bc06c.firebasestorage.app",
  messagingSenderId: "991364758808",
  appId: "1:991364758808:web:08b54b5eb711f4729cf26d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDD82xLouvIBJT7GHx6vsldc2biM7_TLMI",
  authDomain: "readrealm-db47b.firebaseapp.com",
  projectId: "readrealm-db47b",
  storageBucket: "readrealm-db47b.appspot.com",
  messagingSenderId: "950193445035",
  appId: "1:950193445035:web:24151d40c1a0b8dce33fee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
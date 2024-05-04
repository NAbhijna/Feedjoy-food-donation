// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "process.env.REACT_APP_FIREBASE_API_KEY",
  authDomain: "feedjoy-reactjs.firebaseapp.com",
  projectId: "feedjoy-reactjs",
  storageBucket: "feedjoy-reactjs.appspot.com",
  messagingSenderId: "345058610004",
  appId: "1:345058610004:web:fea399ebdbea76544dd6c1"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCexP39zeUxGiHzS7uBUOW92URPNOOxZCk",
  authDomain: "interviewai-54078.firebaseapp.com",
  projectId: "interviewai-54078",
  storageBucket: "interviewai-54078.firebasestorage.app",
  messagingSenderId: "243619747077",
  appId: "1:243619747077:web:943863c7b6d5c582d8936c",
  measurementId: "G-J61YBCVS4N"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

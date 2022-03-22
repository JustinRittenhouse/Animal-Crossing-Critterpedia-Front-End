// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZ80GEjz1c4VCkCN_8nraKKk4NEoVjkxk",
  authDomain: "critterpedia-72642.firebaseapp.com",
  projectId: "critterpedia-72642",
  storageBucket: "critterpedia-72642.appspot.com",
  messagingSenderId: "354826499717",
  appId: "1:354826499717:web:f2e9dad5cb3f228bcd5bec"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
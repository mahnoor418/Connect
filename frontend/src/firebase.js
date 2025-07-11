// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXAPqmag-KKA_wP78BNCoF45mqYITa5Z8",
  authDomain: "connectify-ef7d0.firebaseapp.com",
  projectId: "connectify-ef7d0",
  storageBucket: "connectify-ef7d0.appspot.com", // corrected `.app` to `.appspot.com`
  messagingSenderId: "869070662304",
  appId: "1:869070662304:web:157b5d562518ef993177c5",
  measurementId: "G-VCXRMBFQBL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Firebase Auth and Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };

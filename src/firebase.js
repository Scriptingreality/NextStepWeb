import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7K_wWp7C-YvosqksA4oykPb0Slr06J1E",
  authDomain: "careeradvsor.firebaseapp.com",
  projectId: "careeradvsor",
  storageBucket: "careeradvsor.firebasestorage.app",
  messagingSenderId: "1008998821490",
  appId: "1:1008998821490:web:63982d177a88b0e3589ceb",
  measurementId: "G-LKXTBE210R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
                                                                                       



// Initialize Firebase


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLUND9t5IIot8TA4T-ByDPb-lXpUR7xsI",
  authDomain: "lightpath-tools.firebaseapp.com",
  projectId: "lightpath-tools",
  storageBucket: "lightpath-tools.firebasestorage.app",
  messagingSenderId: "653730538340",
  appId: "1:653730538340:web:5b9b62fb1f1dc59c941071",
  measurementId: "G-47TBJ4GLNF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
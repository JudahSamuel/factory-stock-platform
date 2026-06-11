import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "factory-stock-platform.firebaseapp.com",
  projectId: "factory-stock-platform",
  storageBucket: "factory-stock-platform.firebasestorage.app",
  messagingSenderId: "712215666983",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
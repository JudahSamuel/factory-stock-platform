import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAn4moChOwOVAb-auEOq07FKVtcv7d0-SA",
  authDomain: "factory-stock-platform.firebaseapp.com",
  projectId: "factory-stock-platform",
  storageBucket: "factory-stock-platform.firebasestorage.app",
  messagingSenderId: "712215666983",
  appId: "1:712215666983:web:9455eb9651254f1f8cc902"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
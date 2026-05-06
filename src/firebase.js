import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqZtlrdqELKRfzoLqNjGO8gLaSGNNe4HI",
  authDomain: "test-77b07.firebaseapp.com",
  projectId: "test-77b07",
  storageBucket: "test-77b07.firebasestorage.app",
  databaseURL: "https://test-77b07-default-rtdb.firebaseio.com/",
  messagingSenderId: "509051511661",
  appId: "1:509051511661:web:733e8c910f7ba4ac73b064"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const rtdb = getDatabase(app);
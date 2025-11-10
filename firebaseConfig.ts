// firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwllQBkW9mmSfFQf7dFL-EDVBHwbu_PXw",
  authDomain: "crystiq-visuals.firebaseapp.com",
  projectId: "crystiq-visuals",
  storageBucket: "crystiq-visuals.firebasestorage.app",
  messagingSenderId: "203405209535",
  appId: "1:203405209535:web:ed3a632d007c1c7f18fb0a",
  measurementId: "G-XYB5TQRBMQ"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);

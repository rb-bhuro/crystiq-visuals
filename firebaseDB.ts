// firebaseDB.ts

import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Save new update (admin adds data)
export async function saveUpdate(data: any) {
  await addDoc(collection(db, "updates"), data);
  console.log("✅ Update saved to Firestore");
}

// Load all updates (to show on other devices)
export async function getAllUpdates() {
  const snapshot = await getDocs(collection(db, "updates"));
  return snapshot.docs.map((doc) => doc.data());
}

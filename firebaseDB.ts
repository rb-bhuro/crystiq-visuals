// firebaseDB.ts
import { initializeApp } from "https://aistudiocdn.com/firebase@12.5.0/app";
import { 
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, writeBatch 
} from "https://aistudiocdn.com/firebase@12.5.0/firestore";


// --- DESIGN OPERATIONS ---
export async function addDesignToDB(data: any) {
  await addDoc(collection(db, "designs"), data);
}

export async function getAllDesigns() {
  const snapshot = await getDocs(collection(db, "designs"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deleteDesignFromDB(id: string) {
  await deleteDoc(doc(db, "designs", id));
}

// --- CATEGORY OPERATIONS ---
export async function addCategoryToDB(data: any) {
  await addDoc(collection(db, "categories"), data);
}

export async function getAllCategories() {
  const snapshot = await getDocs(collection(db, "categories"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function deleteCategoryFromDB(id: string) {
  await deleteDoc(doc(db, "categories", id));
}

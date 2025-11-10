import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { firebaseConfig } from "./firebaseConfig";

// Firebase via CDN (for Google AI Studio projects)
import { initializeApp } from "https://aistudiocdn.com/firebase@12.5.0/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  writeBatch,
} from "https://aistudiocdn.com/firebase@12.5.0/firestore";

console.log("✅ Firebase DataContext loading...");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DataContext = createContext<any>(null);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    console.log("✅ DataContext mounted, connecting to Firestore...");

    const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
      setCategories(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubDes = onSnapshot(collection(db, "designs"), (snap) => {
      setDesigns(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const auth = sessionStorage.getItem("isAuthenticated");
    setIsAuthenticated(auth === "true");

    return () => {
      unsubCats();
      unsubDes();
    };
  }, []);

  const addDesign = async (d: any) => await addDoc(collection(db, "designs"), d);
  const updateDesign = async (d: any) => await updateDoc(doc(db, "designs", d.id), { ...d });
  const deleteDesign = async (id: string) => await deleteDoc(doc(db, "designs", id));
  const addCategory = async (c: any) => await addDoc(collection(db, "categories"), c);
  const updateCategory = async (c: any) => await updateDoc(doc(db, "categories", c.id), { ...c });
  const deleteCategory = async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, "categories", id));
    const designsQuery = query(collection(db, "designs"), where("categoryId", "==", id));
    const designsSnap = await getDocs(designsQuery);
    designsSnap.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  };

  const login = (password: string) => {
    if (password === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuthenticated");
  };

  const value = {
    designs,
    categories,
    isAuthenticated,
    addDesign,
    updateDesign,
    deleteDesign,
    addCategory,
    updateCategory,
    deleteCategory,
    login,
    logout,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

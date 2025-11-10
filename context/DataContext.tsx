import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Design, Category } from "../types";
import { getInitialDesigns, getInitialCategories } from "../services/initialData";
import { ADMIN_PASSWORD } from "../constants";
import { firebaseConfig } from "../firebaseConfig";

// Firebase imports via CDN (for AI Studio / no-build runtime)
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DataContext = createContext<any>(null);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 🔹 Initialize Firestore listeners
  useEffect(() => {
    console.log("✅ DataContext mounted, connecting to Firestore...");

    const unsubscribeCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      setCategories(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category)));
    });

    const unsubscribeDesigns = onSnapshot(collection(db, "designs"), (snapshot) => {
      setDesigns(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Design)));
    });

    const storedAuth = sessionStorage.getItem("isAuthenticated");
    setIsAuthenticated(storedAuth === "true");

    return () => {
      unsubscribeCategories();
      unsubscribeDesigns();
    };
  }, []);

  // 🔹 Auth logic
  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
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

  // 🔹 Firestore CRUD
  const addDesign = async (design: Omit<Design, "id">) => await addDoc(collection(db, "designs"), design);
  const updateDesign = async (d: Design) => await updateDoc(doc(db, "designs", d.id), { ...d });
  const deleteDesign = async (id: string) => await deleteDoc(doc(db, "designs", id));
  const addCategory = async (cat: Omit<Category, "id">) => await addDoc(collection(db, "categories"), cat);
  const updateCategory = async (c: Category) => await updateDoc(doc(db, "categories", c.id), { ...c });
  const deleteCategory = async (id: string) => {
    const batch = writeBatch(db);
    batch.delete(doc(db, "categories", id));
    const designsQuery = query(collection(db, "designs"), where("categoryId", "==", id));
    const designsSnapshot = await getDocs(designsQuery);
    designsSnapshot.forEach((d) => batch.delete(d.ref));
    await batch.commit();
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

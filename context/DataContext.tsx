import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "https://aistudiocdn.com/firebase@12.5.0/app";
import { 
  getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, onSnapshot, query, where, writeBatch 
} from "https://aistudiocdn.com/firebase@12.5.0/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCwllQBkW9mmSfFQf7dFL-EDVBHwbu_PXw",
  authDomain: "crystiq-visuals.firebaseapp.com",
  projectId: "crystiq-visuals",
  storageBucket: "crystiq-visuals.firebasestorage.app",
  messagingSenderId: "203405209535",
  appId: "1:203405209535:web:ed3a632d007c1c7f18fb0a",
  measurementId: "G-XYB5TQRBMQ"
};

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const loadUpdates = async () => {
        const snapshot = await getDocs(collection(db, "updates"));
        const data = snapshot.docs.map((doc) => doc.data());
        console.log("✅ Loaded from Firestore:", data);
        setUpdates(data);
      };
      console.log("✅ DataContext mounted");


      loadUpdates();
    } catch (err: any) {
      console.error("🔥 Firebase init error:", err);
      setError(err.message);
    }
  }, []);

  const addUpdate = async (newData: any) => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      await addDoc(collection(db, "updates"), newData);
      setUpdates((prev) => [...prev, newData]);
    } catch (err) {
      console.error("❌ Add update failed:", err);
    }
  };

  return (
    <DataContext.Provider value={{ updates, addUpdate, error }}>
      {error ? (
        <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>
          Firebase Error: {error}
        </div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

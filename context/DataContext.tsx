import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Design, Category } from '../types';
import { getInitialDesigns, getInitialCategories } from '../services/initialData';
import { ADMIN_PASSWORD } from '../constants';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const categoriesCollection = collection(db, 'categories');
const designsCollection = collection(db, 'designs');


interface DataContextType {
  designs: Design[];
  categories: Category[];
  isAuthenticated: boolean;
  addDesign: (design: Omit<Design, 'id'>) => Promise<void>;
  updateDesign: (design: Design) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  login: (password: string) => boolean;
  logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Seed initial data if database is empty
  const seedDatabase = async () => {
    const categoriesSnapshot = await getDocs(categoriesCollection);
    if (categoriesSnapshot.empty) {
      console.log("Seeding database with initial data...");
      const initialCategories = getInitialCategories();
      const initialDesigns = getInitialDesigns();
      const batch = writeBatch(db);

      initialCategories.forEach(category => {
        const docRef = doc(categoriesCollection, category.id);
        batch.set(docRef, category);
      });

      initialDesigns.forEach(design => {
        const docRef = doc(designsCollection, design.id);
        batch.set(docRef, design);
      });
      
      await batch.commit();
      console.log("Database seeded successfully.");
    }
  };


  useEffect(() => {
    let unsubscribeCategories: () => void;
    let unsubscribeDesigns: () => void;

    const initializeAndListen = async () => {
      try {
        if (firebaseConfig.apiKey === "YOUR_API_KEY") {
            console.warn("Firebase is not configured. Please update firebaseConfig.ts with your project credentials.");
            alert("Firebase is not configured. The application will not connect to a database. Please update firebaseConfig.ts.");
            return;
        }

        await seedDatabase();

        unsubscribeCategories = onSnapshot(categoriesCollection, (snapshot) => {
          const cats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Category));
          setCategories(cats);
        });

        unsubscribeDesigns = onSnapshot(designsCollection, (snapshot) => {
          const des = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Design));
          setDesigns(des);
        });

      } catch (error) {
        console.error("Firebase connection error:", error);
        alert("Failed to connect to the database. This can happen if:\n1. Your Firebase config values are incorrect in 'firebaseConfig.ts'.\n2. You haven't enabled Firestore in your Firebase project.\n3. Your Firestore security rules are blocking access.\n\nPlease check the console for more details.");
      }
    };

    initializeAndListen();

    const storedAuth = sessionStorage.getItem('isAuthenticated');
    setIsAuthenticated(storedAuth === 'true');

    return () => {
      if (unsubscribeCategories) unsubscribeCategories();
      if (unsubscribeDesigns) unsubscribeDesigns();
    };
  }, []);
  
  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  const addDesign = async (design: Omit<Design, 'id'>) => {
    await addDoc(designsCollection, design);
  };

  const updateDesign = async (updatedDesign: Design) => {
    const designDoc = doc(db, 'designs', updatedDesign.id);
    await updateDoc(designDoc, { ...updatedDesign });
  };

  const deleteDesign = async (id: string) => {
    const designDoc = doc(db, 'designs', id);
    await deleteDoc(designDoc);
  };
  
  const addCategory = async (category: Omit<Category, 'id'>) => {
    await addDoc(categoriesCollection, category);
  };

  const updateCategory = async (updatedCategory: Category) => {
    const categoryDoc = doc(db, 'categories', updatedCategory.id);
    await updateDoc(categoryDoc, { ...updatedCategory });
  };

  const deleteCategory = async (id: string) => {
    const batch = writeBatch(db);
    
    // Delete the category itself
    const categoryDoc = doc(db, 'categories', id);
    batch.delete(categoryDoc);

    // Find and delete all designs in that category
    const designsQuery = query(designsCollection, where('categoryId', '==', id));
    const designsSnapshot = await getDocs(designsQuery);
    designsSnapshot.forEach(designDoc => {
        batch.delete(designDoc.ref);
    });

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
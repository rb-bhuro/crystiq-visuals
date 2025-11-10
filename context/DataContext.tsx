
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Design, Category } from '../types';
import { getInitialDesigns, getInitialCategories } from '../services/initialData';
import { ADMIN_PASSWORD } from '../constants';

interface DataContextType {
  designs: Design[];
  categories: Category[];
  isAuthenticated: boolean;
  addDesign: (design: Omit<Design, 'id'>) => void;
  updateDesign: (design: Design) => void;
  deleteDesign: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
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

// FIX: Explicitly type DataProvider as a React Functional Component to resolve prop type inference issues.
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedDesigns = localStorage.getItem('designs');
      const storedCategories = localStorage.getItem('categories');
      const storedAuth = sessionStorage.getItem('isAuthenticated');

      setDesigns(storedDesigns ? JSON.parse(storedDesigns) : getInitialDesigns());
      setCategories(storedCategories ? JSON.parse(storedCategories) : getInitialCategories());
      setIsAuthenticated(storedAuth === 'true');
    } catch (error) {
        console.error("Failed to initialize from storage:", error);
        setDesigns(getInitialDesigns());
        setCategories(getInitialCategories());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('designs', JSON.stringify(designs));
  }, [designs]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
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

  const addDesign = (design: Omit<Design, 'id'>) => {
    setDesigns(prev => [...prev, { ...design, id: new Date().toISOString() }]);
  };

  const updateDesign = (updatedDesign: Design) => {
    setDesigns(prev => prev.map(d => d.id === updatedDesign.id ? updatedDesign : d));
  };

  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
  };
  
  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: new Date().toISOString() }]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setDesigns(prev => prev.filter(d => d.categoryId !== id));
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

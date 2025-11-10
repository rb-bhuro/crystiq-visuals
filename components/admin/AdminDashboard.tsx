
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Category, Design } from '../../types';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { designs, categories, addDesign, updateDesign, deleteDesign, addCategory, updateCategory, deleteCategory, logout } = useData();
  const navigate = useNavigate();

  // State for forms
  const [designForm, setDesignForm] = useState<Omit<Design, 'id'>>({ title: '', imageUrl: '', categoryId: '', isFeatured: false });
  const [categoryForm, setCategoryForm] = useState<Omit<Category, 'id'>>({ name: '' });
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designForm.title || !designForm.imageUrl || !designForm.categoryId) return;
    if (editingDesign) {
        updateDesign({ ...editingDesign, ...designForm });
        setEditingDesign(null);
    } else {
        addDesign(designForm);
    }
    setDesignForm({ title: '', imageUrl: '', categoryId: '', isFeatured: false });
  };
  
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!categoryForm.name) return;
    if(editingCategory) {
        updateCategory({ ...editingCategory, ...categoryForm });
        setEditingCategory(null);
    } else {
        addCategory(categoryForm);
    }
    setCategoryForm({ name: '' });
  };
  
  const startEditDesign = (design: Design) => {
    setEditingDesign(design);
    setDesignForm(design);
  };
  
  const startEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm(category);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-cyan-400">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-400">Logout</button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-5xl font-bold text-cyan-400">{designs.length}</p>
            <p className="text-xl text-gray-300">Total Designs</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-5xl font-bold text-cyan-400">{categories.length}</p>
            <p className="text-xl text-gray-300">Total Categories</p>
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
        <form onSubmit={handleCategorySubmit} className="flex gap-4 mb-4">
            <input type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="Category Name" className="flex-grow p-2 bg-gray-700 rounded"/>
            <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-4 rounded">{editingCategory ? 'Update' : 'Add'}</button>
        </form>
        <ul className="space-y-2">
            {categories.map(cat => (
                <li key={cat.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                    <span>{cat.name}</span>
                    <div className="space-x-2">
                        <button onClick={() => startEditCategory(cat)} className="text-yellow-400">Edit</button>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500">Delete</button>
                    </div>
                </li>
            ))}
        </ul>
      </div>

      {/* Design Management */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Manage Designs</h2>
        <form onSubmit={handleDesignSubmit} className="space-y-4 mb-4">
            <input type="text" value={designForm.title} onChange={e => setDesignForm({...designForm, title: e.target.value})} placeholder="Design Title" className="w-full p-2 bg-gray-700 rounded"/>
            <input type="text" value={designForm.imageUrl} onChange={e => setDesignForm({...designForm, imageUrl: e.target.value})} placeholder="Image URL" className="w-full p-2 bg-gray-700 rounded"/>
            <select value={designForm.categoryId} onChange={e => setDesignForm({...designForm, categoryId: e.target.value})} className="w-full p-2 bg-gray-700 rounded">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            <label className="flex items-center gap-2"><input type="checkbox" checked={designForm.isFeatured} onChange={e => setDesignForm({...designForm, isFeatured: e.target.checked})} /> Featured</label>
            <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-4 rounded">{editingDesign ? 'Update Design' : 'Add Design'}</button>
        </form>
        <div className="max-h-96 overflow-y-auto">
            <ul className="space-y-2">
                {designs.map(design => (
                    <li key={design.id} className="flex justify-between items-center p-2 bg-gray-700 rounded">
                        <span>{design.title}</span>
                        <div className="space-x-2">
                            <button onClick={() => startEditDesign(design)} className="text-yellow-400">Edit</button>
                            <button onClick={() => deleteDesign(design.id)} className="text-red-500">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import AdminDashboard from '../admin/AdminDashboard';
import { motion } from 'framer-motion';

const AdminLogin: React.FC<{ onLogin: (password: string) => boolean }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError('Incorrect password.');
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">Admin Access</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          <button type="submit" className="w-full mt-6 bg-cyan-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-cyan-400 transition-colors">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};


const AdminPage: React.FC = () => {
  const { isAuthenticated, login } = useData();

  return (
    <div>
      {isAuthenticated ? <AdminDashboard /> : <AdminLogin onLogin={login} />}
    </div>
  );
};

export default AdminPage;

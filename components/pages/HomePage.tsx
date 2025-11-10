
import React from 'react';
import { BRAND_NAME } from '../../constants';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          {BRAND_NAME}
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-gray-300">
          Crafting Visual Identities That Resonate.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to="/gallery"
            className="mt-8 inline-block bg-cyan-500 text-white font-bold py-3 px-8 rounded-full text-lg uppercase tracking-wider transition-transform duration-300 transform hover:bg-cyan-400"
          >
            Explore Gallery
          </NavLink>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;

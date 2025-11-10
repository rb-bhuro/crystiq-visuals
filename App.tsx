
import React, { useState } from 'react';
import { HashRouter, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import HomePage from './components/pages/HomePage';
import GalleryPage from './components/pages/GalleryPage';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import AdminPage from './components/pages/AdminPage';
import { BRAND_NAME, NAV_LINKS } from './constants';
import { AnimatePresence, motion } from 'framer-motion';

console.log("✅ DataContext mounted");


const MenuIcon: React.FC = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);

const CloseIcon: React.FC = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black bg-opacity-50 backdrop-blur-md p-4 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-cyan-400 tracking-widest uppercase" onClick={() => setIsMenuOpen(false)}>
          {BRAND_NAME}
        </NavLink>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-lg font-semibold transition-colors duration-300 ${
                  isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 focus:outline-none" aria-label="Toggle menu">
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden mt-4"
            >
                <div className="flex flex-col items-center space-y-4">
                    {NAV_LINKS.map((link) => (
                        <NavLink
                          key={link.path}
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)} // Close menu on navigation
                          className={({ isActive }) =>
                            `text-lg font-semibold py-2 transition-colors duration-300 w-full text-center rounded-md ${
                              isActive ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`
                          }
                        >
                          {link.name}
                        </NavLink>
                    ))}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


// FIX: Explicitly type PageWrapper as a React Functional Component to resolve prop type inference issues.
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="pt-24" // Increased padding top for the fixed navbar
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><GalleryPage /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminPage /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-900 font-sans">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <AnimatedRoutes />
          </main>
        </div>
      </HashRouter>
    </DataProvider>
  );
};

export default App;

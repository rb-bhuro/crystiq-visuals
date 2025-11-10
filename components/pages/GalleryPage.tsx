
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Design } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

// FIX: Explicitly type ScreenshotBlocker as a React Functional Component to resolve prop type inference issues.
const ScreenshotBlocker: React.FC<{ children: React.ReactNode, isBlocking: boolean }> = ({ children, isBlocking }) => {
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isBlocking && (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) || (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) || (e.ctrlKey && (e.key === 's' || e.key === 'S')))) {
                e.preventDefault();
            }
        };
        if (isBlocking) {
            document.body.classList.add('no-screenshot');
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.classList.remove('no-screenshot');
        }

        return () => {
            document.body.classList.remove('no-screenshot');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isBlocking]);

    return <>{children}</>;
};


// FIX: Explicitly type DesignCard as a React Functional Component to allow for React-specific props like `key`.
const DesignCard: React.FC<{ design: Design; onPreview: (design: Design) => void }> = ({ design, onPreview }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative group overflow-hidden rounded-lg shadow-lg bg-gray-800 cursor-pointer"
            onClick={() => onPreview(design)}
        >
            <img src={design.imageUrl} alt={design.title} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-bold text-lg">{design.title}</h3>
            </div>
            {design.isFeatured && (
                <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">
                    FEATURED
                </div>
            )}
        </motion.div>
    );
};

const PreviewModal: React.FC<{ design: Design | null; onClose: () => void }> = ({ design, onClose }) => {
    if (!design) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl w-full max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="aspect-w-16 aspect-h-9">
                    <img src={design.imageUrl} alt={design.title} className="w-full h-full object-contain" />
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </motion.div>
        </motion.div>
    );
};

const GalleryPage: React.FC = () => {
    const { designs, categories } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [previewDesign, setPreviewDesign] = useState<Design | null>(null);

    const filteredDesigns = useMemo(() => {
        return designs
            .filter(design => {
                const matchesCategory = selectedCategory === 'all' || design.categoryId === selectedCategory;
                const matchesSearch = design.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCategory && matchesSearch;
            })
            .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }, [designs, searchTerm, selectedCategory]);

    const handlePreview = (design: Design) => {
        setPreviewDesign(design);
    };
    
    const closePreview = () => {
        setPreviewDesign(null);
    };

    return (
        <ScreenshotBlocker isBlocking={!!previewDesign}>
            <div className="space-y-8">
                <div className="p-4 bg-gray-800 rounded-lg flex flex-col md:flex-row gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search designs..."
                        className="w-full md:w-1/3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="w-full md:w-1/3 p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-cyan-500' : 'bg-gray-700'}`}>Grid</button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-cyan-500' : 'bg-gray-700'}`}>List</button>
                    </div>
                </div>

                <motion.div
                    layout
                    className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'space-y-4'}
                >
                    <AnimatePresence>
                        {filteredDesigns.map(design => (
                            <DesignCard key={design.id} design={design} onPreview={handlePreview} />
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                {filteredDesigns.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-400">No designs found. Try adjusting your filters.</p>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {previewDesign && <PreviewModal design={previewDesign} onClose={closePreview} />}
            </AnimatePresence>
        </ScreenshotBlocker>
    );
};

export default GalleryPage;

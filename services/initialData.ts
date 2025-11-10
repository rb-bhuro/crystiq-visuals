
import { Design, Category } from '../types';

const CATEGORIES: Category[] = [
    { id: '1', name: 'Logos' },
    { id: '2', name: 'Banners' },
    { id: '3', name: 'Overlays' },
    { id: '4', name: 'Mascots' },
];

const DESIGNS: Design[] = [];
const designTitles = [
    "Neon Predator", "Cosmic Dragon", "Cyber Ronin", "Glitch Phoenix", "Arctic Wolf",
    "Solar Flare", "Abyssal Serpent", "Quantum Fox", "Celestial Knight", "Inferno Lion",
    "Shadow Panther", "Frost Giant", "Vortex Griffin", "Rogue AI", "Crystal Golem",
    "Galactic Samurai", "Tech Ninja", "Chrono Guardian", "Void Walker", "Storm Bringer"
];

let designCounter = 1;
CATEGORIES.forEach(category => {
    for (let i = 0; i < 5; i++) {
        DESIGNS.push({
            id: `${designCounter}`,
            title: `${designTitles[designCounter % designTitles.length]} - ${category.name}`,
            imageUrl: `https://picsum.photos/seed/${designCounter}/600/400`,
            categoryId: category.id,
            isFeatured: designCounter % 5 === 0, // Feature every 5th design
        });
        designCounter++;
    }
});


export const getInitialCategories = (): Category[] => CATEGORIES;
export const getInitialDesigns = (): Design[] => DESIGNS;

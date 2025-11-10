
import React from 'react';
import { BRAND_NAME, CREDITS } from '../../constants';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">About {BRAND_NAME}</h1>
      <p className="text-xl text-gray-300 mb-12">
        We specialize in creating jaw-dropping graphics that elevate brands and captivate audiences. From sleek logos to dynamic motion graphics, we are the architects of visual excellence.
      </p>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Our Team</h2>
        <p className="text-gray-400">
          Our team is a collective of passionate designers, illustrators, and animators dedicated to pushing the boundaries of creativity. We live and breathe design, ensuring every project is a masterpiece.
        </p>
      </div>
      
      <div className="text-gray-500">
        <p>Developer: <span className="font-semibold text-gray-400">{CREDITS.developer}</span></p>
        <p>Made by: <span className="font-semibold text-gray-400">{CREDITS.company}</span></p>
      </div>
    </div>
  );
};

export default AboutPage;

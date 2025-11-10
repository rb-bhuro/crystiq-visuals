
import React from 'react';
import { SOCIAL_LINKS, CONTACT_DETAILS, DiscordIcon, InstagramIcon, WhatsappIcon } from '../../constants';

const ContactPage: React.FC = () => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you shortly.");
    };

    return (
        <div className="max-w-4xl mx-auto py-16">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Get In Touch</h1>
                <p className="text-xl text-gray-300">We'd love to hear from you. Let's create something amazing together.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-cyan-400 mb-6">Contact Information</h2>
                    <div className="space-y-4 text-lg">
                        <p><strong>Phone:</strong> {CONTACT_DETAILS.phone}</p>
                        <p><strong>Email:</strong> {CONTACT_DETAILS.email}</p>
                    </div>
                    <div className="mt-8 flex space-x-6">
                        <a href={SOCIAL_LINKS.discord} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><DiscordIcon /></a>
                        <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><InstagramIcon /></a>
                        <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors"><WhatsappIcon /></a>
                    </div>
                </div>

                <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-cyan-400 mb-6">Send a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Your Email" required className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <textarea placeholder="Your Message" required rows={5} className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
                        <button type="submit" className="w-full bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider transition-transform duration-300 transform hover:bg-cyan-400">
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

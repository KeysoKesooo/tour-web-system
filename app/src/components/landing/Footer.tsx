import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer id="contact" className="bg-slate-900 border-t border-slate-800 py-10">
            <div className="container mx-auto px-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Aethel Travel Co. | Premium Global Touring.</p>
                <p className="mt-2 text-sm">
                    Address: 123 Luxury Lane, World City | Email: support@aethel.com | Phone: (555) 123-4567
                </p>
            </div>
        </footer>
    );
};

export default Footer;
import React from 'react';
import { Plane } from '../../constants/ui_data';

const CTASection: React.FC = () => {
    return (
        <section id="cta" className="py-20 bg-teal-600">
            <div className="container mx-auto px-6 text-center text-white max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Ready to Start Your Adventure?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Get personalized recommendations tailored to your luxury travel preferences in minutes.
                </p>
                <a href="#bookpage" className="inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-teal-600 bg-white rounded-lg shadow-2xl hover:bg-gray-100 transition duration-300 transform hover:scale-[1.05]">
                    Request a Custom Quote
                    <Plane className="w-6 h-6 ml-3" />
                </a>
            </div>
        </section>
    );
};

export default CTASection;
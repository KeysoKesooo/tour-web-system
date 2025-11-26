import React from 'react';
import { valueProps } from '../../lib/types_and_data';

const FeatureSection: React.FC = () => {
    return (
        <section id="valueprops" className="py-24 bg-slate-900">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-4 text-white">Why Choose Aethel?</h2>
                <p className="text-lg text-gray-400 text-center mb-16">
                    Our commitment to excellence ensures every journey exceeds expectations.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {valueProps.map((prop, index) => (
                        <div
                            key={index}
                            className="p-8 bg-slate-800 rounded-xl border border-slate-700 shadow-xl text-center transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl hover:shadow-teal-500/30"
                        >
                            <prop.icon className={`w-12 h-12 mx-auto mb-4 ${prop.color} transition-transform duration-300 hover:rotate-3`} />
                            <h3 className="text-2xl font-bold mb-3 text-white">{prop.title}</h3>
                            <p className="text-gray-400">{prop.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
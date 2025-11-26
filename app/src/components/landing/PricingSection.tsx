"use client";

import React, { useState, useEffect } from 'react';
import { destinations, ArrowRight, ArrowLeft, CheckCircle, Destination } from '../../lib/types_and_data';

const PricingSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDestination: Destination = destinations[selectedIndex];
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Logic to navigate destinations
  const nextDestination = () => {
    setSelectedIndex(prev => (prev + 1) % destinations.length);
  };
  const prevDestination = () => {
    setSelectedIndex(prev => (prev - 1 + destinations.length) % destinations.length);
  };

  // Handle arrow key navigation to cycle through countries
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextDestination();
      } else if (e.key === 'ArrowLeft') {
        prevDestination();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handleBooking = () => {
    setIsSubmitted(true);
    // Placeholder for actual booking logic
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <section id="bookpage" className={`py-20 md:py-32 transition-colors duration-500 ${selectedDestination.themeColor}`}>
      <div className="container mx-auto px-6 max-w-4xl text-white">
        <h2 className="text-5xl font-extrabold text-center mb-16">
          Where Will Your Next Journey Begin?
        </h2>

        {/* Selected Destination Card and Booking Details */}
        <div className="p-8 md:p-12 bg-black/30 backdrop-blur-md rounded-2xl shadow-2xl relative">
            <h3 className="text-5xl md:text-6xl font-extrabold mb-4 transition-all duration-300 transform scale-100 text-center">
                {selectedDestination.icon} {selectedDestination.name}
            </h3>
            <p className="text-xl md:text-2xl text-white/90 italic mb-6 text-center">
                "{selectedDestination.tagline}"
            </p>

            <div className="text-center text-2xl font-extrabold mt-8 mb-6">
              Starting Price from: 
              <span className="text-white text-5xl font-mono ml-3">
                ${selectedDestination.price.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleBooking}
              className="w-full max-w-sm mx-auto py-4 bg-white text-gray-800 font-bold rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 flex items-center justify-center relative overflow-hidden text-xl"
              disabled={isSubmitted}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-2 animate-pulse" />
                  Trip to {selectedDestination.name} Reserved!
                </>
              ) : (
                <>
                  View Available Tours
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </button>
          
          {/* Keyboard Hint */}
          <div className="text-sm text-white/70 mt-8 text-center">
            Use <span className="font-mono px-1 py-0.5 rounded bg-black/50">{'<'}</span> and <span className="font-mono px-1 py-0.5 rounded bg-black/50">{'>'}</span> keys to cycle destinations.
          </div>
        </div>
        
        {/* Visual Navigation Arrows */}
        <div className="flex justify-between mt-8">
            <button
                onClick={prevDestination}
                className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group"
            >
                <ArrowLeft className="w-8 h-8 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Previous Destination</span>
            </button>
            <button
                onClick={nextDestination}
                className="flex items-center text-white/80 hover:text-white transition-colors duration-300 group"
            >
                <span className="hidden sm:inline">Next Destination</span>
                <ArrowRight className="w-8 h-8 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
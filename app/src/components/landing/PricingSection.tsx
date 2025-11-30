"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { destinations, ArrowRight, ArrowLeft } from '@/constants/ui_data';
import { Destination } from '@/types/Ui';

const PricingSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDestination: Destination = destinations[selectedIndex];
  
  // Navigation functions... (remain the same)

  // Slug generation
  const destinationSlug = selectedDestination.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id="bookpage" className={`py-20 md:py-32 transition-colors duration-500 ${selectedDestination.themeColor}`}>
      {/* ... Content remains the same ... */}
        <div className="text-center text-2xl font-extrabold mt-8 mb-6">
          Starting Price from: 
          <span className="text-white text-5xl font-mono ml-3">
            ${selectedDestination.price.toLocaleString()}
          </span>
        </div>

        {/* NEW: Use Next.js Link for navigation */}
        <Link
          href={`/trips/${destinationSlug}`}
          className="w-full max-w-sm mx-auto py-4 bg-white text-gray-800 font-bold rounded-lg shadow-xl hover:bg-gray-100 transition duration-300 flex items-center justify-center text-xl"
        >
            View Available Tours to {selectedDestination.name}
            <ArrowRight className="w-6 h-6 ml-2" />
        </Link>
      {/* ... rest of the section ... */}
    </section>
  );
};

export default PricingSection;
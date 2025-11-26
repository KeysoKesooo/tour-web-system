"use client";

import React, { useState, useEffect, useRef } from 'react';

// The component now manages its own visibility state based on scroll direction
const Navbar: React.FC = () => {
  const navItems = ['Home', 'Book-Page', 'Value-Props', 'Reviews', 'Contact'];
  const [isVisible, setIsVisible] = useState(true);
  const prevScrollY = useRef(0);

  // Scroll detection logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > prevScrollY.current;
      const isScrollingPastTop = currentScrollY > 100; // Only start hiding after scrolling 100px

      if (isScrollingPastTop) {
        // Scrolling down past the top section and currently visible -> Hide
        if (isScrollingDown && isVisible) {
          setIsVisible(false);
        } 
        // Scrolling up and currently hidden -> Show
        else if (!isScrollingDown && !isVisible) {
          setIsVisible(true);
        }
      } else {
        // Always show the navbar when close to the top of the page
        if (!isVisible) {
          setIsVisible(true);
        }
      }

      // Update the previous scroll position
      prevScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]); // Depend on isVisible to re-run effect when state changes

  // Utility function to clean up section IDs for display
  const cleanItemName = (item: string) => item.replace('-', ' ').replace('home', 'Top');

  return (
    // Uses 'transform -translate-y-full' when hidden and 'translate-y-0' when visible
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out py-4 border-b border-slate-700/50 
        bg-slate-900/95 shadow-2xl shadow-teal-500/10 
        ${isVisible 
          ? 'transform translate-y-0' // Visible
          : 'transform -translate-y-full' // Hidden (moves up off the screen)
        }`}
    >
        {/* Content wrapper with fixed max-width for the "not full-width" appearance */}
        <div className="container mx-auto px-6 flex justify-between items-center max-w-6xl">
            {/* Logo/Brand */}
            <a href="#home" className="text-3xl sm:text-4xl font-black text-white tracking-widest transition duration-300 hover:text-teal-400">
                Aethel
            </a>
            
            {/* Navigation Links (Hidden on small screens) */}
            <nav className="hidden lg:flex space-x-10 text-base font-semibold">
                {navItems.map((item) => (
                    <a 
                        key={item} 
                        href={`#${item.toLowerCase().replace('-', '')}`} 
                        className="text-gray-300 hover:text-teal-400 transition duration-300 relative group uppercase tracking-wider"
                    >
                        {cleanItemName(item)}
                        {/* Underline hover effect */}
                        <span className="absolute bottom-[-5px] left-0 w-full h-0.5 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                    </a>
                ))}
            </nav>

            {/* CTA Button */}
            <a 
                href="#bookpage" 
                className="hidden md:inline-flex px-5 py-2 text-sm font-bold text-teal-400 border border-teal-400 rounded-full 
                           hover:bg-teal-400 hover:text-slate-900 transition duration-300 transform hover:scale-105 shadow-md"
            >
                Book Now
            </a>
        </div>
    </header>
  );
};

export default Navbar;
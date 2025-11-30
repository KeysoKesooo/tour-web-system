"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight } from '../../constants/ui_data';

const HeroSection: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simple Parallax for Hero Background
  const bgTranslateY = scrollPosition * 0.1;

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image/Overlay (Parallax Effect) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: "url('https://placehold.co/1920x1080/0f172a/ffffff?text=Premium+Touring+Background')",
          opacity: 0.2,
          transform: `scale(1.1) translateY(${bgTranslateY}px)`,
        }}
      ></div>
      <div className="absolute inset-0 bg-slate-900/70"></div>

      <div className="container mx-auto px-6 z-10 text-center">
        {/* Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-extrabold leading-tight tracking-tighter opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s', animationFillMode: 'forwards', animationDuration: '1s' }}>
            Curated Journeys. <span className="text-teal-400">Exceptional Worlds.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto opacity-0 animate-fadeInUp" style={{ animationDelay: '0.7s', animationFillMode: 'forwards', animationDuration: '1s' }}>
            Discover handcrafted itineraries designed for the discerning traveler. Start exploring the world with unparalleled ease.
          </p>
          <a href="#bookpage" className="inline-flex items-center justify-center px-8 py-3 mt-4 text-lg font-semibold text-white bg-teal-600 rounded-lg shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-[1.05] opacity-0 animate-fadeInUp" style={{ animationDelay: '1.0s', animationFillMode: 'forwards', animationDuration: '1s' }}>
              Book Your Dream Trip
              <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
       {/* Global CSS for fade-in animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation-name: fadeInUp;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
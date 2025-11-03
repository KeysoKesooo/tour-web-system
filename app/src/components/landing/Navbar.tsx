'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsOpen(!isOpen);

  // Hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Enable smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  const links = [
    { name: 'Home', href: '#' },
    { name: 'Book', href: '#book' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#cta' },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center"
    >
      <div
        className="w-full max-w-6xl mx-4 mt-4 px-6 py-3 rounded-2xl shadow-lg 
        bg-white/30 backdrop-blur-xl border border-white/20 
        transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Tourify Logo"
              className="h-10 md:h-12 select-none"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 ml-auto">
            {links.map((link, i) => (
              <motion.a
                key={i}
                href={link.href}
                whileHover={{ scale: 1.05, color: '#2F855A' }}
                className="font-semibold text-gray-800 transition-colors hover:text-green-700"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={toggleMenu}
              className="focus:outline-none text-2xl text-gray-800"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-start gap-3 mt-4 md:hidden"
          >
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="font-semibold text-green-900 hover:text-green-primary transition"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

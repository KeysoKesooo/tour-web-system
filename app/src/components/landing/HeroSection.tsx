// components/HeroSection.tsx
'use client';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-green-100 text-green-900 px-6 md:px-20">
      <motion.h1
        viewport={{ once: true, amount: 0.3 }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-6xl font-bold text-center mb-4"
      >
        Discover Your Next Adventure
      </motion.h1>
      <motion.p
        viewport={{ once: true, amount: 0.3 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="text-lg md:text-xl text-center max-w-2xl mb-8"
      >
        Book unique experiences and tours around the world with ease.
      </motion.p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-green-800 transition"
      >
        Explore Tours
      </motion.button>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white py-16 px-6 md:px-20 mt-[-1px]">
      {/* Background blur layer for depth */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-6"
      >
        <p className="text-lg font-medium">
          &copy; {new Date().getFullYear()} Tourify. All rights reserved.
        </p>

        <div className="flex justify-center space-x-8">
          <a
            href="#"
            className="text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Instagram
          </a>
        </div>

        <p className="text-sm text-white/80 mt-4">
          Designed with ❤️ by Tourify Team
        </p>
      </motion.div>

      {/* Decorative wave separator (matches CTA top) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-20 text-white/20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M985.66,83.29c-74.09,10.82-148.73,20.37-223.82,24.14C630.55,112.9,498.07,106.54,376.22,91.48,252.27,76.09,131.07,51.75,0,27.35V120H1200V0C1113.36,28.08,1048.64,72.47,985.66,83.29Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </footer>
  );
}

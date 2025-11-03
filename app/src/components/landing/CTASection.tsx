'use client';
import { motion } from 'framer-motion';

export default function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24 px-6 md:px-16 bg-gradient-to-br from-green-600 via-green-500 to-green-400 text-white text-center rounded-t-3xl">
      {/* Background overlay for depth */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md"
        >
          Ready for Your Next Adventure?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed text-green-50"
        >
          Discover breathtaking destinations and create memories that last a lifetime.
          Book your tour today and embark on your journey!
        </motion.p>

        <motion.a
          href="#book"
          whileHover={{ scale: 1.07, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="inline-block bg-white text-green-700 font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-green-50 hover:shadow-xl transition-all"
        >
          Book Now
        </motion.a>
      </div>

      {/* Decorative waves (optional aesthetic touch) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
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
    </section>
  );
}

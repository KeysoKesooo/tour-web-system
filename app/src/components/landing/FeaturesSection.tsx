"use client";
import { motion } from "framer-motion";

const places = [
  { title: "Paris", image: "/images/paris.jpg" },
  { title: "Bali", image: "/images/bali.jpg" },
  { title: "Tokyo", image: "/images/tokyo.jpg" },
  { title: "New York", image: "/images/nyc.jpg" },
  { title: "Rome", image: "/images/rome.jpg" },
  { title: "Sydney", image: "/images/sydney.jpg" },
];

export default function InfiniteCarousel() {
  // Duplicate the array so it looks continuous
  const repeatedPlaces = [...places, ...places];

  return (
    <section className="py-20 bg-cream-white text-green-900 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12">Top Destinations</h2>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }} // move left by 50%
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {repeatedPlaces.map((place, i) => (
            <div
              key={i}
              className="flex-none w-72 bg-green-50 rounded-2xl shadow-lg flex flex-col"
            >
              <div className="h-60 w-full overflow-hidden rounded-t-2xl flex-shrink-0">
                <img
                  src={place.image}
                  alt={place.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <h3 className="text-2xl font-semibold mb-2">{place.title}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

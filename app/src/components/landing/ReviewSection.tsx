'use client';
import { motion } from 'framer-motion';

const reviews = [
  { name: "John Doe", comment: "Amazing tours! Highly recommend." },
  { name: "Jane Smith", comment: "Professional guides and smooth booking." },
  { name: "Alex Johnson", comment: "Best experience ever!" },
];

export default function ReviewSection() {
  return (
    <section className="py-20 bg-cream-white text-green-900 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center mb-12">What Our Clients Say</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-green-light p-6 rounded-2xl shadow-lg hover:shadow-2xl transition"
          >
            <p className="mb-4 text-gray-700">"{review.comment}"</p>
            <h4 className="font-semibold">{review.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

'use client';
import { motion } from 'framer-motion';

const plans = [
  { title: "Basic", price: "$99", features: ["1 Tour", "Email Support", "Basic Guide"] },
  { title: "Standard", price: "$199", features: ["3 Tours", "24/7 Support", "Premium Guide"] },
  { title: "Premium", price: "$299", features: ["All Tours", "Personal Guide", "VIP Support"] },
];

export default function PriceSection() {
  return (
    <section className="py-20 bg-green-light text-green-900 px-6 md:px-20">
      <h2 className="text-4xl font-bold text-center mb-12">Pricing Plans</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="bg-cream-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
          >
            <h3 className="text-2xl font-semibold mb-4">{plan.title}</h3>
            <p className="text-3xl font-bold mb-6">{plan.price}</p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-700">{feature}</li>
              ))}
            </ul>
            <button className="bg-green-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition">
              Choose Plan
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

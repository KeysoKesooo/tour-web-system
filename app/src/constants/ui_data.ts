// src/constants/ui_data.ts

import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Plane,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { Review, ValueProp, Destination } from "@/types/Ui"; // Import types from central types file

// --- Global Data Arrays ---

export const reviewsData: Review[] = [
  {
    id: 1,
    name: "Alex P.",
    location: "Paris, France",
    rating: 5,
    comment:
      "The curated itinerary was flawless. Every detail was handled perfectly, making our anniversary trip unforgettable. Truly a premium experience.",
  },
  {
    id: 2,
    name: "Maria S.",
    location: "Kyoto, Japan",
    rating: 5,
    comment:
      "Booking was seamless! The pricing breakdown was transparent, and the local guide was exceptional. Highly recommend for luxury travel.",
  },
  {
    id: 3,
    name: "John & Jane D.",
    location: "Santorini, Greece",
    rating: 4,
    comment:
      "Excellent value for the price. The accommodation was stunning, though we had a small hiccup with a transfer, which was quickly resolved by support.",
  },
  {
    id: 4,
    name: "David H.",
    location: "Cape Town, SA",
    rating: 5,
    comment:
      "The best travel app I've used. The animations and UI are gorgeous, and the tour options were far superior to competitors.",
  },
];

export const valueProps: ValueProp[] = [
  {
    icon: TrendingUp,
    title: "Curated Itineraries",
    description:
      "Handcrafted journeys designed by expert luxury travel agents to maximize your experience.",
    color: "text-teal-400",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Price Match",
    description:
      "Find a lower price? We'll match it and give you an upgrade. Travel with absolute confidence.",
    color: "text-indigo-400",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Our platform uses real-time API integrations for lightning-fast confirmation and itinerary generation.",
    color: "text-rose-400",
  },
];

export const destinations: Destination[] = [
  {
    id: 1,
    name: "Palenke",
    themeColor: "bg-red-800",
    tagline: "A seamless blend of ancient temples and neon-lit futures.",
    price: 4200,
    icon: "🇯🇵",
  },
  {
    id: 2,
    name: "Kanto",
    themeColor: "bg-green-800",
    tagline: "Discover lush rice paddies and dynamic street food culture.",
    price: 2800,
    icon: "🇻🇳",
  },
  {
    id: 3,
    name: "Taiwan",
    themeColor: "bg-blue-800",
    tagline:
      "Explore the mountainous heart and vibrant night markets of the island.",
    price: 3500,
    icon: "🇹🇼",
  },
  {
    id: 4,
    name: "Italy",
    themeColor: "bg-orange-800",
    tagline:
      "Savor art, history, and culinary excellence across iconic regions.",
    price: 4800,
    icon: "🇮🇹",
  },
];

export const travelImages: string[] = [
  "https://placehold.co/400x300/1e293b/ffffff?text=Mountain+View",
  "https://placehold.co/400x300/0f172a/ffffff?text=Beach+Resort",
  "https://placehold.co/400x300/1e293b/ffffff?text=City+Lights",
  "https://placehold.co/400x300/0f172a/ffffff?text=Historical+Site",
];

// Exporting necessary icons for component use
export {
  Plane,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
};

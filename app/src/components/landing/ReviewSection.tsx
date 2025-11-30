"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, reviewsData, travelImages } from '../../constants/ui_data';
import { Review } from '@/types/Ui';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 transition-all duration-300 ${i < rating ? 'fill-amber-400' : 'fill-transparent stroke-current'}`} />
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ review: Review, index: number }> = ({ review, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (reviewRef.current) {
      observer.observe(reviewRef.current);
    }

    return () => {
      if (reviewRef.current) {
        observer.unobserve(reviewRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={reviewRef}
      className={`p-6 bg-slate-700/50 rounded-xl border border-slate-700 transition-all duration-500 transform shadow-lg relative z-10 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ease-out`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <StarRating rating={review.rating} />
      <p className="mt-4 mb-6 text-gray-300 italic text-base leading-relaxed">
        "{review.comment}"
      </p>
      <div className="border-t border-slate-600 pt-4">
        <p className="font-semibold text-teal-400">{review.name}</p>
        <p className="text-sm text-gray-400">{review.location}</p>
      </div>
    </div>
  );
};

const MovingPictureBackground: React.FC = () => {
  // Duplicate images for continuous scroll
  const images = useMemo(() => [...travelImages, ...travelImages], []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div className="image-strip h-full w-[200%] flex">
        {images.map((url, index) => (
          <div key={index} className="flex-shrink-0 h-full w-[12.5%] p-2">
            <img 
              src={url} 
              alt={`Travel scenic view ${index}`} 
              className="w-full h-full object-cover rounded-lg shadow-xl"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { 
                (e.target as HTMLImageElement).onerror = null; 
                (e.target as HTMLImageElement).src = "https://placehold.co/400x300/1e293b/ffffff?text=Image+Load+Error"; 
              }}
            />
          </div>
        ))}
      </div>
       {/* Global CSS for moving background animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%); 
          }
        }
        .image-strip {
          animation: scroll 45s linear infinite;
        }
        .image-strip img {
            min-width: 100%;
        }
      `}</style>
    </div>
  );
}


// --- Main Review Section Component ---

const ReviewSection: React.FC = () => {
    return (
      <section id="reviews" className="py-24 bg-slate-800 relative overflow-hidden">
        <MovingPictureBackground />
        
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-4 text-white">
            Traveler Testimonials
          </h2>
          <p className="text-lg text-gray-400 text-center mb-16">
            Hear from our community of delighted adventurers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reviewsData.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
};

export default ReviewSection;
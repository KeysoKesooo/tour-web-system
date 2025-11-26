// app/page.tsx
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection'; // Renamed from FeaturesSection
import DestinationSection from '@/components/landing/PricingSection'; // Replaces PricingSection/PriceSection
import ReviewSection from '@/components/landing/ReviewSection';
import CTASection from '@/components/landing/CTASection'; // Renamed from CtaSection
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    // Updated background and text color to match the dark theme of the components
    <main className="bg-slate-900 text-white scroll-smooth min-h-screen">
      <Navbar/>
      
      {/* Section IDs are aligned with the anchors in the Navbar and CTA */}
      
      {/* Hero Section */}
      <section id="home"><HeroSection /></section>
      
      {/* Destination Selection / Booking Section (formerly Pricing) */}
      <section id="book-page"><DestinationSection /></section>
      
      {/* Feature / Value Proposition Section */}
      <section id="value-props"><FeatureSection /></section>
      
      {/* Review Section */}
      <section id="reviews"><ReviewSection /></section>
      
      {/* Call to Action Section */}
      <section id="cta"><CTASection /></section>
      
      {/* Footer / Contact Section */}
      <Footer />
    </main>
  );
}
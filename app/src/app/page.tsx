// app/page.tsx
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection'; 
import DestinationSection from '@/components/landing/PricingSection'; 
import ReviewSection from '@/components/landing/ReviewSection';
import CTASection from '@/components/landing/CTASection'; 
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (

    <main className="bg-slate-900 text-white scroll-smooth min-h-screen">
      <Navbar/>
      
      {/* Hero Section */}
      <section id="home"><HeroSection /></section>
      
      {/* Destination / Pricing Section */}
      <section id="book-page"><DestinationSection /></section>
      
      {/* Feature Section */}
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
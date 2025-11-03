// app/page.tsx
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PriceSection from '@/components/landing/PricingSection';
import ReviewSection from '@/components/landing/ReviewSection';
import CtaSection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <main className="bg-cream-white text-gray-900 scroll-smooth">
      <Navbar />
      <section id="home"><HeroSection /></section>
      <section id="features"><FeaturesSection /></section>
      <section id="pricing"><PriceSection /></section>
      <section id="reviews"><ReviewSection /></section>
      <section id="cta"><CtaSection /></section>
      <Footer />
    </main>
  );
}

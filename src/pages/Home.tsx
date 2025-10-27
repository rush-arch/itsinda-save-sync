import HeroSection from '@/components/home/HeroSection';
import GroupFinder from '@/components/home/GroupFinder';
import LiteracyCorner from '@/components/home/LiteracyCorner';
import NewsSection from '@/components/home/NewsSection';
import TestimonialsCarousel from '@/components/home/TestimonialsCarousel';
import FAQSection from '@/components/home/FAQSection';
import TrustBadges from '@/components/home/TrustBadges';
import RotatingTips from '@/components/home/RotatingTips';
import EventsCalendar from '@/components/home/EventsCalendar';
import SocialProof from '@/components/home/SocialProof';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import HeaderControls from '@/components/HeaderControls';

const Home = () => {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Itsinda</h1>
          <HeaderControls />
        </div>
      </header>
      
      <main className="pt-16">
        <HeroSection />
        <RotatingTips />
        <GroupFinder />
        <LiteracyCorner />
        <NewsSection />
        <TestimonialsCarousel />
        <FAQSection />
        <TrustBadges />
        <EventsCalendar />
        <SocialProof />
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Home;

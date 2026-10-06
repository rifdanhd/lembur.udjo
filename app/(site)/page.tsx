import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingCarousel from "@/components/TrendingCarousel";
import QuotesSection from "@/components/QuotesSection";
import AboutSection from "@/components/AboutSection";
import HeritageBadges from "@/components/HeritageBadges";
import KaulinanSection from "@/components/KaulinanSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import MasterplanSection from "@/components/MasterplanSection";
import SiteplanSection from "@/components/SiteplanSection";
import GallerySection from "@/components/GallerySection";
import FaqSection from "@/components/FaqSection";
import MapSection from "@/components/MapSection";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrendingCarousel />
      <QuotesSection />
      <AboutSection />
      <HeritageBadges />

      <MasterplanSection />
      <SiteplanSection />
      <FacilitiesSection />
      <GallerySection />
      <KaulinanSection />
      <FaqSection />
      <MapSection />
      <Footer />
      <WhatsAppPopup />
    </main>
  );
}

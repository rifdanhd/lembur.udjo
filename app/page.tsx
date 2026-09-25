import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuotesSection from "@/components/QuotesSection";
import AboutSection from "@/components/AboutSection";
import HeritageBadges from "@/components/HeritageBadges";
// import CompanyProfileSection from "@/components/CompanyProfileSection";
import ShowsSection from "@/components/ShowsSection";
import HeritageSection from "@/components/HeritageSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import MasterplanSection from "@/components/MasterplanSection";
import SiteplanSection from "@/components/SiteplanSection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import MapSection from "@/components/MapSection";
import TrendingCarousel from "@/components/TrendingCarousel";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
        <HeroSection />
          <TrendingCarousel />
        <QuotesSection />
        <AboutSection />
        <HeritageBadges />
        {/* <CompanyProfileSection /> */}
        {/* <ShowsSection /> */}
        <HeritageSection />
        <FacilitiesSection />
        <MasterplanSection />
        <SiteplanSection />
        <GallerySection />
      
        {/* <ScheduleSection /> */}
        <MapSection />
        <Footer />
        <WhatsAppPopup />
      </main>
  );
}

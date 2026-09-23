import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
// import CompanyProfileSection from "@/components/CompanyProfileSection";
import ShowsSection from "@/components/ShowsSection";
import HeritageSection from "@/components/HeritageSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import MasterplanSection from "@/components/MasterplanSection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import MapSection from "@/components/MapSection";
import TrendingCarousel from "@/components/TrendingCarousel";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      <Navbar />
        <HeroSection />
        <AboutSection />
        {/* <CompanyProfileSection /> */}
        {/* <ShowsSection /> */}
        <HeritageSection />
        <FacilitiesSection />
        <MasterplanSection />
        <GallerySection />
        <TrendingCarousel />
        {/* <ScheduleSection /> */}
        <MapSection />
        <Footer />
        <WhatsAppPopup />
      </main>
  );
}

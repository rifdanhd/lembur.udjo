import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ShowsSection from "@/components/ShowsSection";
import HeritageSection from "@/components/HeritageSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GallerySection from "@/components/GallerySection";
import ScheduleSection from "@/components/ScheduleSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ShowsSection />
      <HeritageSection />
      <FacilitiesSection />
      <GallerySection />
      <ScheduleSection />
      <ContactSection />
      <Footer />
    </main>
  );
}

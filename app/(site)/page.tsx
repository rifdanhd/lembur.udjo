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
import { connection } from "next/server";
import { DEFAULT_WEBSITE_IMAGES, sectionImages } from "@/lib/website/content";
import { getWebsiteImages } from "@/lib/website/images";

export default async function Home() {
  await connection();
  let images = DEFAULT_WEBSITE_IMAGES;
  try {
    images = await getWebsiteImages();
  } catch (error) {
    console.error("Gambar beranda belum berhasil dimuat; menggunakan konten bawaan", error);
  }
  return (
    <main className="min-h-screen bg-cream overflow-x-hidden">
      <Navbar />
      <HeroSection items={sectionImages(images, "banner")} />
      <TrendingCarousel />
      <QuotesSection />
      <AboutSection />
      <HeritageBadges />

      <MasterplanSection />
      <SiteplanSection />
      <FacilitiesSection items={sectionImages(images, "fasilitas")} />
      <GallerySection items={sectionImages(images, "galeri")} />
      <KaulinanSection />
      <FaqSection />
      <MapSection />
      <Footer />
      <WhatsAppPopup />
    </main>
  );
}

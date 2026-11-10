import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AngklungJourneySection from "@/components/AngklungJourneySection";
import ExploreExperiencesSection from "@/components/ExploreExperiencesSection";
import ExploreLupSection from "@/components/ExploreLupSection";
import MasterplanSection from "@/components/MasterplanSection";
import SiteplanSection from "@/components/SiteplanSection";
import GalleryStoriesSection from "@/components/GalleryStoriesSection";
import PlanYourVisitSection from "@/components/PlanYourVisitSection";
import FaqSection from "@/components/FaqSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import WhatsAppPopup from "@/components/WhatsAppPopup";
import SmoothScroll from "@/components/immersive/SmoothScroll";
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
    <SmoothScroll>
      <main className="min-h-screen overflow-x-hidden bg-background text-forest">
        <Navbar />
        <HeroSection items={sectionImages(images, "banner")} />
        <AngklungJourneySection />
        <ExploreExperiencesSection />
        <ExploreLupSection images={sectionImages(images, "fasilitas")} />
        <MasterplanSection items={sectionImages(images, "masterplan")} />
        <SiteplanSection />
        <GalleryStoriesSection
          images={sectionImages(images, "galeri")}
          stories={sectionImages(images, "trending")}
        />
        <PlanYourVisitSection />
        <FaqSection />
        <MapSection />
        <Footer />
        <WhatsAppPopup />
      </main>
    </SmoothScroll>
  );
}

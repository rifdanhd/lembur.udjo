import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InnovationSection from "@/components/InnovationSection";

export const metadata: Metadata = {
  title: "Inovasi Digital — Lembur Udjo Parahyangan",
  description:
    "Pindai QR untuk mendengar suara asli Abah Udjo, arsip musik tradisi, dan cerita di balik rekaman yang dilestarikan Lembur Udjo Parahyangan.",
};

export default function InovasiPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <div className="pt-16 sm:pt-20">
        <InnovationSection />
      </div>
      <Footer />
    </main>
  );
}

import type { Metadata } from "next";
import { Scene } from "@/components/SketchbookScene";

export const metadata: Metadata = {
  title: "Meng To — Singapore Sketchbook",
  description:
    "A tactile personal portfolio built as a Singapore sketchbook: nine illustrated plates, curled page turns, and a draggable magnifying glass.",
};

export default function SketchbookPage() {
  return (
    <main className="min-h-screen bg-[#ece7dc]">
      <Scene />
    </main>
  );
}

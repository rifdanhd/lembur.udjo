import localFont from "next/font/local";
import styles from "./PortalTheme.module.css";
import { PortalHeader } from "./PortalChrome";
import { PortalFooter } from "./PortalShared";
import { currentVisitor } from "@/lib/ticketing/visitor-server";
const condensed = localFont({
  src: [
    { path: "./fonts/BarlowCondensed-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/BarlowCondensed-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-ticket-condensed",
  display: "swap",
});

export async function PortalFrame({ children }: { children: React.ReactNode }) {
  const visitor = await currentVisitor();
  return <div className={`${styles.portal} ${condensed.variable} flex min-h-svh flex-col`}><a href="#portal-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Lewati ke isi halaman</a><PortalHeader visitor={visitor} /><main id="portal-content" className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8 sm:py-12">{children}</main><PortalFooter /></div>;
}

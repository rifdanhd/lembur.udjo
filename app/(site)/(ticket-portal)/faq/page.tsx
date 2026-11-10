import Link from "next/link";
import { PortalTitle } from "@/components/ticketing/PortalShared";
import { faqItems } from "@/lib/ticketing/portal-data";
export const metadata = { title: "Pertanyaan Umum" };
export default function FaqPage() { return <><PortalTitle title="Pertanyaan yang sering diajukan" description="Informasi sederhana untuk mengenal portal tiket dan merencanakan kunjungan." /><div className="max-w-3xl space-y-3">{faqItems.map((item,index) => <details key={item.question} className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-6" open={index===0}><summary className="cursor-pointer text-sm font-semibold leading-7">{item.question}</summary><p className="mt-4 text-sm leading-7 text-stone-600">{item.answer}</p></details>)}</div><Link href="/bantuan" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold underline">Masih membutuhkan bantuan? Hubungi tim kami.</Link></>; }

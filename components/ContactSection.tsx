"use client";

import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleSendToWhatsApp = () => {
    const text = `Halo Lembur Udjo Parahyangan,%0A%0ANama: ${encodeURIComponent(formData.name)}%0ATelepon: ${encodeURIComponent(formData.phone)}%0APesan: ${encodeURIComponent(formData.message || "-")}`;
    window.open(`https://wa.me/6281219279765?text=${text}`, "_blank");
  };

  return (
    <div className="bg-white">
      {/* InJourney section-landing-cta (Banner Box CTA) */}
      <section className="relative py-10 sm:py-12 overflow-hidden bg-forest text-white">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src="/placeholders/hero.jpg" alt="Background CTA" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-xl text-center md:text-left">
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase block mb-1">
                Layanan Informasi &amp; Reservasi
              </span>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white leading-tight">
                Butuh bantuan? Kami siap membantu.
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Konsultasikan jadwal kunjungan keluarga, rombongan sekolah, gathering instansi, atau program workshop budaya bersama tim kami.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap gap-3 justify-center">
              <a
                href="https://wa.me/6281219279765?text=Halo%20Lembur%20Udjo,%20saya%20ingin%20tanya%20informasi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                <span>Chat via WhatsApp</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section id="kontak" className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold tracking-widest text-amber-700 uppercase bg-amber-100/60 px-3 py-1 rounded-full inline-block mb-2.5">
              Hubungi Kami
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-bold text-forest tracking-tight">
              Kontak &amp; Lokasi
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2.5 leading-relaxed">
              Kami terbuka untuk kunjungan wisata, edukasi budaya, pementasan seni, dan kemitraan pelestarian tradisi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Info Cards & Maps */}
            <div className="lg:col-span-6 space-y-4">
              {/* Address */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-[#fcfaf6] shadow-xs">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-10 h-10 rounded-xl bg-forest text-amber-400 flex items-center justify-center text-base shrink-0">📍</div>
                  <h4 className="font-cinzel font-bold text-forest text-sm">Alamat Kawasan</h4>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 pl-[52px] leading-relaxed">
                  Kawasan Bale Pare, Kota Baru Parahyangan<br />
                  Padalarang, Kabupaten Bandung Barat, Jawa Barat
                </p>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6281219279765"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:shadow-md bg-[#fcfaf6] transition-all block group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center text-base shrink-0">💬</div>
                  <div>
                    <h4 className="font-cinzel font-bold text-forest text-sm group-hover:text-emerald-700 transition-colors">WhatsApp Customer Support</h4>
                    <p className="text-xs sm:text-sm text-stone-600 font-medium">+62 812-1927-9765 (Resmi)</p>
                  </div>
                </div>
              </a>

              {/* Phone & Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200 bg-[#fcfaf6]">
                  <div className="text-lg mb-1">📞</div>
                  <h4 className="font-cinzel font-bold text-forest text-xs mb-0.5">Telepon</h4>
                  <p className="text-xs text-stone-600">(022) 7279765</p>
                </div>
                <div className="p-4 rounded-2xl border border-stone-200 bg-[#fcfaf6]">
                  <div className="text-lg mb-1">✉️</div>
                  <h4 className="font-cinzel font-bold text-forest text-xs mb-0.5">Email</h4>
                  <p className="text-xs text-stone-600 break-all">corsec.lemburudjo@gmail.com</p>
                </div>
              </div>

              {/* Google Maps */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs aspect-[16/9]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8976897862817!2d107.52055237504894!3d-6.8481429931343905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e61b07f8e0c7%3A0x86bbc1e85e2a2e3!2sLembur%20Udjo%20Parahyangan!5e0!3m2!1sid!2sid!4v1695000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi Lembur Udjo Parahyangan"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-6">
              <div className="bg-[#fcfaf6] rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-forest mb-1">Kirim Pesan</h3>
                <p className="text-xs text-stone-500 mb-6">Tim kami akan menghubungi Anda sesegera mungkin.</p>

                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h4 className="font-cinzel font-bold text-forest text-base mb-1">Pesan Terkirim!</h4>
                    <p className="text-sm text-stone-600 mb-4">Tim kami akan segera menghubungi Anda.</p>
                    <button
                      onClick={handleSendToWhatsApp}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      <span>Kirim via WhatsApp juga</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="contact-name">
                        Nama Lengkap *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Masukkan nama Anda"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="contact-phone">
                        Nomor WhatsApp *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08xxxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5" htmlFor="contact-message">
                        Pesan / Keperluan
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Jelaskan keperluan Anda, misal: kunjungan wisata grup, reservasi pertunjukan, program sekolah..."
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 px-6 rounded-full bg-forest hover:bg-forest-light active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all min-h-[44px]"
                      >
                        Kirim Pesan
                      </button>
                      <button
                        type="button"
                        onClick={handleSendToWhatsApp}
                        className="flex-1 py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#128C7E] active:scale-95 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all min-h-[44px] flex items-center justify-center gap-2"
                      >
                        <span>Via WhatsApp</span>
                        <span>&rarr;</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

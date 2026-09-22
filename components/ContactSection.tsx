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
    <section id="kontak" className="py-16 sm:py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest text-amber-700 uppercase">Hubungi Kami</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight mt-3">Kontak & Kunjungan</h2>
          <p className="text-stone-600 text-base mt-4">Kami terbuka untuk kunjungan, kerja sama, dan informasi lebih lanjut.</p>
        </div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
           <div className="lg:col-span-6 space-y-6">
             <div className="grid grid-cols-1 gap-4">
               <div className="p-4 rounded-lg border border-stone-200">
                 <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 text-emerald-700">📍</div>
                 <h4 className="font-serif font-bold text-forest text-sm mb-1">Alamat</h4>
                 <p className="text-sm text-stone-500">Kawasan Bale Pare,<br/>Kota Baru Parahyangan<br/>Padalarang, Kabupaten Bandung Barat</p>
               </div>
               <a href="https://wa.me/6281219279765" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg border border-stone-200 hover:border-emerald-400 hover:bg-stone-50 transition-colors block">
                 <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 text-emerald-700">💬</div>
                 <h4 className="font-serif font-bold text-forest text-sm mb-1">WhatsApp</h4>
                 <p className="text-sm text-stone-500">+62 812-1927-9765</p>
               </a>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <a href="tel:+6222727765" className="p-4 rounded-lg border border-stone-200 hover:border-emerald-400 hover:bg-stone-50 transition-colors block">
                   <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 text-emerald-700">📞</div>
                   <h4 className="font-serif font-bold text-forest text-sm mb-1">Telepon</h4>
                   <p className="text-sm text-stone-500">(022) 7279765</p>
                 </a>
                 <div className="p-4 rounded-lg border border-stone-200">
                   <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center mb-2 text-emerald-700">✉️</div>
                   <h4 className="font-serif font-bold text-forest text-sm mb-1">Email</h4>
                   <p className="text-sm text-stone-500">corsec.lemburudjo@gmail.com</p>
                 </div>
               </div>
             </div>
             <div className="rounded-lg overflow-hidden border border-stone-200">
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.771960207212!2d107.65345997576575!3d-6.90232479309696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7b95ecfa34d%3A0xb35a0f5a706ec2b9!2sSaung%20Angklung%20Udjo!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" width="100%" height={200} style={{ border: 0 }} allowFullScreen loading="lazy" />
               <div className="p-3 bg-stone-50 flex items-center justify-between border-t border-stone-200">
                 <span className="text-sm text-stone-500">📍 Kota Baru Parahyangan, Padalarang</span>
                 <a href="https://maps.google.com/?q=Saung+Angklung+Udjo+Bandung" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-forest hover:bg-stone-900 text-white text-xs transition-colors">Petunjuk Arah</a>
               </div>
             </div>
           </div>

          <div className="lg:col-span-6">
            <div className="p-5 sm:p-7 rounded-lg border border-stone-200">
              <h3 className="font-serif text-xl font-bold text-forest mb-1">Kirim Pesan</h3>
              <p className="text-sm text-stone-500 mb-6">Kami akan segera merespons pesan Anda.</p>
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto">✓</div>
                  <h4 className="font-serif text-xl font-bold text-forest">Terima Kasih!</h4>
                  <p className="text-sm text-stone-500 max-w-sm mx-auto">Klik tombol di bawah untuk langsung menghubungi kami via WhatsApp.</p>
                  <button onClick={handleSendToWhatsApp} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm">Kirim via WhatsApp</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-amber-700 mb-1.5">Nama *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nama Anda" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:border-amber-500 text-stone-800 placeholder-stone-400 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-amber-700 mb-1.5">Nomor HP *</label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="08123456789" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:border-amber-500 text-stone-800 placeholder-stone-400 text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-amber-700 mb-1.5">Pesan *</label>
                    <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Tulis pesan Anda..." className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:border-amber-500 text-stone-800 placeholder-stone-400 text-sm outline-none" />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm">Kirim Pesan</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

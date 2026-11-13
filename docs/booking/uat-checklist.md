# Checklist UAT — belum dilaksanakan

Tidak ada tanda tangan, responden, wawancara, atau persetujuan yang dibuat oleh agen. Checklist ini harus diisi oleh penguji/perwakilan PT Angklung Udjo Heritage pada lingkungan yang disetujui.

Penguji: __________  Tanggal/WIB: __________  URL/commit/build: __________
Perangkat/browser: __________  Mode: **Midtrans Sandbox**

- [ ] Konfirmasi nama kategori/program, foto LUP, harga per sesi, kebijakan, jadwal dan kuota merupakan data yang telah disetujui.
- [ ] Admin dapat mengubah kategori, program, sesi dan harga tanpa bantuan pengembang.
- [ ] Tanggal pertama yang dipilih memang tersedia; tanggal habis/nonaktif/past tidak dapat dipesan.
- [ ] Navigasi panah, sentuhan, kalender dan keyboard nyaman pada desktop/tablet/ponsel fisik.
- [ ] Harga dan kuota diperbarui saat tanggal berubah; sesi dan jumlah tepat sampai checkout.
- [ ] Daftar/login email, logout dan pembatasan ownership bekerja.
- [ ] Google login/logout berfungsi setelah client credentials dan authorized redirect URIs dikonfigurasi.
- [ ] Akun lokal tidak digabung otomatis dengan akun Google berdasarkan kecocokan email.
- [ ] Email reset diterima; tautan berlaku 30 menit, sekali pakai; sesi lama dicabut.
- [ ] Transaksi Snap Sandbox dapat dimulai pada reservasi yang tersimpan.
- [ ] Pembayaran berhasil, pending, gagal, expire dan replay webhook menghasilkan status/kuota yang benar.
- [ ] Browser finish tanpa pembayaran terverifikasi tidak menerbitkan tiket.
- [ ] Late settlement masuk PAYMENT_REVIEW, tanpa overbooking.
- [ ] E-ticket PDF berisi identitas, referensi, kategori/program, tanggal/sesi, status dan QR yang dapat dibaca perangkat penguji.
- [ ] Petugas aktif dapat check-in pada tanggal kunjungan WIB.
- [ ] Pemindaian kamera fisik diuji; entri manual dapat digunakan bila kamera tidak tersedia.
- [ ] Scan kedua ditolak; pembatalan/refund menonaktifkan tiket issued.
- [ ] STAFF tidak dapat mengelola katalog/petugas atau membaca laporan admin.
- [ ] ADMIN dapat memantau reservasi, nominal yang jelas bertanda simulasi, dan status Midtrans.
- [ ] Kedua domain memiliki HTTPS valid; webhook POST langsung pada domain baru terbukti bekerja.
- [ ] Redirect GET/HEAD lama diaktifkan hanya setelah target diverifikasi; POST lama tetap langsung.
- [ ] Backup, migrasi additive pada salinan data, build, restart dan runtime deployment diverifikasi terpisah.

Temuan dan bukti: __________
Keputusan UAT: [ ] diterima [ ] diterima dengan catatan [ ] perlu perbaikan
Persetujuan penguji yang sebenarnya: __________

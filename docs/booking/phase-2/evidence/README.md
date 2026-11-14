# Provenance evidence — 14 November 2026

- `real-midtrans-delivery.json`: run nyata Snap Sandbox → BNI simulator → notifikasi HTTPS asli → verifikasi signature + GET status → DB PAID → dua tiket → check-in atomik. Memuat timestamp dan HTTP callback/retry/replay tanpa signature/Server Key. Harga dan pelanggan merupakan fixture disposable.
- `real-snap-start.png`, `real-snap-pending.png`, `real-simulator-result.png`, `real-reservation-pending.png`, `real-paid-booking.png`, `real-paid-tickets.pdf`: keluaran run Sandbox nyata. PDF diunduh sebelum check-in; status cetak adalah snapshot ISSUED, validitas terbaru tetap dicek server. QR ini hanya fixture database yang sudah dimatikan, bukan tiket kunjungan sah.
- `real-failure.png`: jejak percobaan awal yang gagal menemukan pilihan BNI; bukan screenshot keberhasilan. Runner kemudian diperbaiki dan run 15/15 selesai. Tidak menghapus kegagalan historis dari klaim QA.
- `browser-run.log` / [browser-results.json](../../evidence/browser-results.json): 32 kasus UI/API menggunakan provider terkontrol, bukan pembayaran asli.
- `integration-run.log`: 50 tes pada PostgreSQL disposable, provider status terkontrol. Hasil terstruktur di `docs/booking/evidence/integration-results.json`.
- `migration-copy.json`: backup/restore populated synthetic legacy copy dan additive migration. Bukan clone produksi.
- `dependency-audit-before.json` / `dependency-audit-after.json`: snapshot audit registry; setelah fix tetap ada moderate/low. `dependency-compatibility.log`: tiga tes transitive API yang benar-benar dipakai.
- `domain-probes.json`: pemeriksaan publik read-only; bukan bukti konfigurasi VPS diubah.
- `google-authorization-probe.json`: authorization page dengan client yang dikonfigurasi; bukan login/consent/callback sukses. Secret tidak disertakan.
- `hero-regression.log`, `lint.log`, `build.log`: pemeriksaan source/build; tidak membuktikan service produksi telah menjalankan commit ini.

Run nyata memakai tunnel HTTPS yang hanya meneruskan POST ke path webhook acak. Tunnel dan cluster PostgreSQL milik runner dihentikan sesudah tes. Log diagnostik mentah dan kredensial tetap di luar Git. Tidak mengubah notification URL dashboard global; hanya override notification per transaksi Sandbox terisolasi.

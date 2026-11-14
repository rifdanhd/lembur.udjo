# Migrasi dan rollback — hasil 14 November 2026

Tidak ada akses tulis/migrasi pada shared atau production database. Migrasi baru `20261114050000_booking_email_outbox` hanya CREATE TABLE/INDEX pada schema ticketing, FK restrict ke Order, unique eventKey, CHECK kind/state/attempts. Tidak menghapus atau mengubah kolom/tabel lama. Prisma tetap 6.19.0, URL migrasi harus direct/unpooled dan menunjuk database aplikasi yang sama dengan Payload.

## Pengujian yang dijalankan

`scripts/test-booking-migration-copy.mjs` membuat cluster PostgreSQL lokal baru dan:

1. Menerapkan enam migrasi lama saja pada database fixture historis.
2. Mengisi akun/sesi, customer, PAID order, snapshot item/harga, SETTLED payment, dua tiket (USED/ISSUED), satu check-in dan kuota sold=2.
3. Membuat backup custom dengan pg_dump; membaca archive listing; **benar-benar restore** ke database lokal kedua.
4. Menjalankan migrasi pending EmailDelivery pada hasil restore.
5. Membandingkan relasi, status, harga, kuota, jumlah tiket/check-in dan sesi sebelum/sesudah. Semua identik; tabel outbox baru kosong.
6. Menguji pelanggaran FK dan kuota; keduanya ditolak. Mengulang migrate deploy; idempotent.

Tiga pemeriksaan PASS. Bukti dan checksum backup: [migration-copy.json](evidence/migration-copy.json). Ini salinan **fixture sintetis yang berisi data historis**, bukan clone data produksi. Restore data produksi dan karakteristik volume/index produksi belum diuji; jangan menyebutnya telah diverifikasi.

## Prosedur sebelum deployment yang memerlukan approval

- Owner menyetujui akses/backup dan migrasi database bersama. Konfirmasi identitas app/direct URL tanpa menampilkan password.
- Ambil backup konsisten menggunakan koneksi direct; simpan di storage privat dengan checksum dan akses terbatas. Uji restore pada salinan terisolasi yang disetujui sebelum menyentuh produksi.
- Tinjau `prisma migrate status`, semua pending SQL dan dependensi data. Jangan memakai reset, db push, atau migrate dev pada database CMS bersama.
- Setelah approval, deploy migrasi additive dengan `npm run db:migrate`, lalu kode/build yang disetujui. Migrasi harus mendahului kode yang menulis antrean.
- Rollback aplikasi: kembali ke commit/build lama, biarkan tabel/kolom additive tetap ada; kode lama mengabaikan antrean. Jangan DROP EmailDelivery/kolom baru atau mencoba membalik status pembayaran. Tahan worker email saat investigasi.
- Bila perlu pemulihan database, hentikan write melalui prosedur operasional yang disetujui, restore backup ke **database baru**, validasi relasi dan transaksi sesudah backup, lalu rencanakan switching dengan owner. Jangan restore menimpa database live secara otomatis.

Expiry/paid/check-in diuji terpisah: 10 buyer berebut 5 kuota, expiry bersamaan, webhook replay bersamaan, QR scan bersamaan; masing-masing mencegah overbooking/double issuance/double check-in. Pengujian Sandbox nyata juga mengamati cancel/expire melepaskan hold tanpa tiket baru.

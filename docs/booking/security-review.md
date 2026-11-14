> **Catatan historis:** hasil di bawah berasal dari iterasi sebelumnya, bukan eksekusi terbaru. Gunakan [verifikasi 14 November 2026](phase-2-completion-2026-11-14.md). Laporan Phase 2 lama memakai webhook/provider terkontrol; itu bukan bukti payment end-to-end nyata. Run nyata terbaru, status domain/OAuth, dan advisory berada pada laporan baru.

# Pemeriksaan keamanan dependency

Audit npm aktual setelah patch: 0 critical, 7 high, 13 moderate, 6 low.

Perbaikan yang diterapkan: Next.js dan eslint-config-next dipin pada 16.4.6; DOMPurify 3.4.17 dan Undici 7.30.2 melalui override terarah. Pembaruan kompatibel lainnya mengikuti package-lock. Tidak menjalankan audit fix --force.

| Paket berseverity high yang tersisa | Jalur dan batas |
| --- | --- |
| @lexical/headless | Rantai richtext Payload / happy-dom. Registry menyarankan perubahan major/downgrade; memerlukan review dan uji CMS terpisah, bukan bukti bahwa booking telah dieksploitasi. |
| @payloadcms/richtext-lexical | Rantai richtext Payload / happy-dom. Registry menyarankan perubahan major/downgrade; memerlukan review dan uji CMS terpisah, bukan bukti bahwa booking telah dieksploitasi. |
| @prisma/config | Tooling Prisma 6; saran npm memerlukan migrasi besar ke Prisma 7. Tidak diterapkan secara buta pada DB CMS bersama. |
| deepmerge-ts | Tooling Prisma 6; saran npm memerlukan migrasi besar ke Prisma 7. Tidak diterapkan secara buta pada DB CMS bersama. |
| effect | Tooling Prisma 6; saran npm memerlukan migrasi besar ke Prisma 7. Tidak diterapkan secara buta pada DB CMS bersama. |
| happy-dom | Rantai richtext Payload / happy-dom. Registry menyarankan perubahan major/downgrade; memerlukan review dan uji CMS terpisah, bukan bukti bahwa booking telah dieksploitasi. |
| prisma | Tooling Prisma 6; saran npm memerlukan migrasi besar ke Prisma 7. Tidak diterapkan secara buta pada DB CMS bersama. |

Keberadaan advisory bukan bukti eksploitasi pada aplikasi ini, tetapi tidak boleh disembunyikan. Status security produksi belum dinyatakan selesai. Jangan menyebut aplikasi bebas kerentanan hanya karena temuan critical menjadi nol. Selengkapnya: [hasil mentah npm](evidence/dependency-audit.json).

Kontrol aplikasi yang diuji: ownership akun/tiket, same-origin mutation, verifikasi signature dan status gateway, nominal, replay, kuota atomik, single-use reset/check-in, revokasi sesi dan role staff/admin. Google OAuth nyata, delivery email, kamera fisik dan HTTPS cutover tetap memerlukan verifikasi eksternal.

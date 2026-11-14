# Tujuh advisory high — investigasi dan hasil perbaikan

Audit registry setelah perbaikan: **0 critical / 0 high**, 13 moderate / 7 low. Exit npm audit tetap nonzero karena temuan moderate/low; ini bukan klaim bebas kerentanan. Bukti mentah: [before](evidence/dependency-audit-before.json), [after](evidence/dependency-audit-after.json).

| Affected package | Installed sebelum → sesudah | Identifier / severity | Pemakaian aktual dan fix | Compatibility / verifikasi |
| --- | --- | --- | --- | --- |
| @lexical/headless | 0.50.0 → 0.50.0 | GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8 (high; aggregate pada wrapper) | Lexical headless/Payload menggunakan Window/DOM untuk konversi HTML server-side; jalur DOM ada dan tidak dinyatakan kebal eksploitasi. Patch transitive happy-dom 21.0.4; Payload/Lexical tetap pada versi lama. | Major dependency ini ditinjau secara terarah: Node >=20 sama dengan kebutuhan sebelumnya, Window/DOMParser/happyDOM.close tetap tersedia. Konversi HTML Lexical aktual dan regresi hero/media PASS. |
| @payloadcms/richtext-lexical | 3.90.2 → 3.90.2 | GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8 (high; aggregate pada wrapper) | Lexical headless/Payload menggunakan Window/DOM untuk konversi HTML server-side; jalur DOM ada dan tidak dinyatakan kebal eksploitasi. Patch transitive happy-dom 21.0.4; Payload/Lexical tetap pada versi lama. | Major dependency ini ditinjau secara terarah: Node >=20 sama dengan kebutuhan sebelumnya, Window/DOMParser/happyDOM.close tetap tersedia. Konversi HTML Lexical aktual dan regresi hero/media PASS. |
| @prisma/config | 6.19.0 → 6.19.0 | GHSA-ggr8-5vv4-36mx, GHSA-38f7-945m-qr2g (high; aggregate pada wrapper) | CLI config Prisma 6 memakai deepmerge dan Effect Schema/Either. Tidak ada Effect RPC/fibers dari request booking. Patch transitive deepmerge-ts 8.0.0 dan Effect 3.20.0; Prisma tetap 6.19.0. | deepmerge 8 membatasi ekspor type yang tidak dipakai loader Prisma; fungsi merge yang dipakai tetap kompatibel. Uji nested merge/cycle, Effect, generate, migrate/restore dan suite integrasi PASS. |
| deepmerge-ts | 7.1.5 → 8.0.0 | GHSA-ggr8-5vv4-36mx (high; paket langsung) | CLI config Prisma 6 memakai deepmerge dan Effect Schema/Either. Tidak ada Effect RPC/fibers dari request booking. Patch transitive deepmerge-ts 8.0.0 dan Effect 3.20.0; Prisma tetap 6.19.0. | deepmerge 8 membatasi ekspor type yang tidak dipakai loader Prisma; fungsi merge yang dipakai tetap kompatibel. Uji nested merge/cycle, Effect, generate, migrate/restore dan suite integrasi PASS. |
| effect | 3.18.4 → 3.20.0 | GHSA-38f7-945m-qr2g (high; paket langsung) | CLI config Prisma 6 memakai deepmerge dan Effect Schema/Either. Tidak ada Effect RPC/fibers dari request booking. Patch transitive deepmerge-ts 8.0.0 dan Effect 3.20.0; Prisma tetap 6.19.0. | deepmerge 8 membatasi ekspor type yang tidak dipakai loader Prisma; fungsi merge yang dipakai tetap kompatibel. Uji nested merge/cycle, Effect, generate, migrate/restore dan suite integrasi PASS. |
| happy-dom | 20.14.6 → 21.0.4 | GHSA-834v-8h66-3h79, GHSA-c8p4-j97h-3vg8 (high; paket langsung) | Lexical headless/Payload menggunakan Window/DOM untuk konversi HTML server-side; jalur DOM ada dan tidak dinyatakan kebal eksploitasi. Patch transitive happy-dom 21.0.4; Payload/Lexical tetap pada versi lama. | Major dependency ini ditinjau secara terarah: Node >=20 sama dengan kebutuhan sebelumnya, Window/DOMParser/happyDOM.close tetap tersedia. Konversi HTML Lexical aktual dan regresi hero/media PASS. |
| prisma | 6.19.0 → 6.19.0 | GHSA-ggr8-5vv4-36mx, GHSA-38f7-945m-qr2g (high; aggregate pada wrapper) | CLI config Prisma 6 memakai deepmerge dan Effect Schema/Either. Tidak ada Effect RPC/fibers dari request booking. Patch transitive deepmerge-ts 8.0.0 dan Effect 3.20.0; Prisma tetap 6.19.0. | deepmerge 8 membatasi ekspor type yang tidak dipakai loader Prisma; fungsi merge yang dipakai tetap kompatibel. Uji nested merge/cycle, Effect, generate, migrate/restore dan suite integrasi PASS. |

## Perubahan terbatas

- Overrides yang ditambahkan: `effect=3.20.0`, `deepmerge-ts=8.0.0`, `happy-dom=21.0.4`.
- Dua transitive dependency memiliki perubahan major yang ditinjau secara spesifik, bukan unrestricted major upgrade. Tidak menjalankan audit fix --force, tidak menaikkan Prisma/Payload major, dan tidak mengubah data shared DB.
- Tes kompatibilitas: [dependency-compatibility.log](evidence/dependency-compatibility.log). Full integration, browser, hero/media dan production build diverifikasi terpisah di laporan utama.
- Dukungan Node minimum dilihat dari metadata paket; pengujian aktual menggunakan runtime lokal yang tercatat dalam log/lingkungan tes. Runtime VPS masih harus diperiksa owner saat deployment.

## Advisory sumber primer

- [GHSA-ggr8-5vv4-36mx](https://github.com/advisories/GHSA-ggr8-5vv4-36mx)
- [GHSA-38f7-945m-qr2g](https://github.com/advisories/GHSA-38f7-945m-qr2g)
- [GHSA-834v-8h66-3h79](https://github.com/advisories/GHSA-834v-8h66-3h79)
- [GHSA-c8p4-j97h-3vg8](https://github.com/advisories/GHSA-c8p4-j97h-3vg8)

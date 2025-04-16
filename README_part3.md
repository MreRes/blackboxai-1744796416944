## Deteksi Bahasa Alami (NLP)

- Chatbot kini mendukung deteksi jenis transaksi (pemasukan atau pengeluaran) menggunakan kata kunci dalam pesan nonformal.
- Kata kunci untuk pemasukan dan pengeluaran dapat diedit di file `src/routes/whatsappRoutes.js` pada bagian atas fungsi `parseFinancialMessage`.
- Jika tidak ada kata kunci yang cocok, chatbot akan mencoba mendeteksi perintah formal seperti "pemasukan" atau "pengeluaran".

## Dashboard Admin

Dashboard admin menyediakan:
- Ringkasan pemasukan bulanan
- Ringkasan pengeluaran bulanan
- Kalkulasi tabungan bersih
- Daftar transaksi terbaru
- Pembaruan otomatis setiap 5 menit

## Penanganan Error

Aplikasi menangani error dengan baik untuk:
- Format pesan yang tidak valid
- Kegagalan API
- Masalah autentikasi
- Kesalahan pemrosesan data

## Keamanan

- Semua endpoint API dilindungi
- Data sensitif disimpan dengan aman di variabel lingkungan
- Google Sheets API menggunakan autentikasi service account
- Pesan WhatsApp diverifikasi menggunakan signature Twilio

## Pengembangan

Untuk berkontribusi:

1. Fork repository
2. Buat branch fitur
3. Lakukan perubahan
4. Buat pull request

## Lisensi

Lisensi ISC

## Dukungan

Untuk dukungan, silakan buka issue di repository.

# WhatsApp Financial Planner

Aplikasi chatbot WhatsApp untuk perencanaan keuangan yang membantu pengguna melacak pemasukan dan pengeluaran, terintegrasi dengan Google Sheets untuk penyimpanan data dan Gemini AI untuk saran keuangan.

## Fitur

- Melacak pemasukan dan pengeluaran melalui pesan WhatsApp
- Melihat ringkasan keuangan bulanan
- Mendapatkan saran keuangan berbasis AI
- Dashboard admin berbasis web untuk overview keuangan
- Integrasi Google Sheets untuk penyimpanan data

## Prasyarat

- Node.js (v14 atau lebih tinggi)
- Akun Google Cloud Platform dengan API Sheets diaktifkan
- Service Account Google dengan akses ke Google Sheets
- Akun Twilio dengan akses WhatsApp API
- Kunci API Google AI Gemini

## Instruksi Setup

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Konfigurasi variabel lingkungan:
   - Salin `.env.example` ke `.env`
   - Isi kredensial berikut:

   ```env
   # Konfigurasi Google Sheets API
   GOOGLE_SPREADSHEET_ID=           # ID Google Spreadsheet Anda
   GOOGLE_SERVICE_ACCOUNT_EMAIL=    # Email Service Account
   GOOGLE_PRIVATE_KEY=              # Private Key Service Account

   # Konfigurasi Gemini AI
   AI_GEMINI_API_KEY=               # Kunci API Gemini AI Anda

   # Konfigurasi WhatsApp (Twilio)
   TWILIO_ACCOUNT_SID=              # SID Akun Twilio
   TWILIO_AUTH_TOKEN=               # Token Auth Twilio
   TWILIO_PHONE_NUMBER=             # Nomor WhatsApp Twilio

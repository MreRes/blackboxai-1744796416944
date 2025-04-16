4. Setup Google Sheets:
   - Buat Google Spreadsheet baru
   - Bagikan dengan email service account Anda
   - Salin ID spreadsheet dari URL
   - Spreadsheet harus memiliki kolom:
     - Timestamp
     - Sender
     - Type (income/expense)
     - Amount
     - Description

5. Jalankan server:
   ```bash
   npm run dev    # Mode development dengan hot reload
   npm start      # Mode produksi
   ```

6. Akses dashboard admin di:
   ```
   http://localhost:8000/admin
   ```

## Perintah WhatsApp

- Catat pemasukan: `pemasukan [jumlah] [keterangan]`
  ```
  Contoh: pemasukan 1000000 gaji
  ```

- Catat pengeluaran: `pengeluaran [jumlah] [keterangan]`
  ```
  Contoh: pengeluaran 50000 belanja
  ```

- Lihat saldo: `saldo` atau `ringkasan`
  ```
  Menampilkan ringkasan pemasukan, pengeluaran, dan tabungan bulanan
  ```

- Dapatkan saran keuangan: `saran [pertanyaan]`
  ```
  Contoh: saran bagaimana cara menabung lebih baik

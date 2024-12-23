# Sistem Informasi Geografis Embung Institut Teknologi Sumatera (SIERA)
Website ini dirancang untuk memberikan informasi yang lengkap mengenai embung yang ada di Institut teknologi Sumatera (ITERA). Pada website ini, tersedia peta interaktif yang mudah digunakan untuk membantu mahasiswa, terutama yang belum familiar dengan apa itu embung.

## Features Website SIERA

- Peta Interaktif✨
- Pemantauan Kondisi
- Eksplorasi Data 

## Tech
Aplikasi ini dibangun dengan menggunakan :

- [Flask] - Flask adalah frmaework web ringan berbasis python yang dirancang untuk membangun aplikasi web dengan cepat dan sederhana.
- [HTML] - Hypertext Markup Language, yaitu bahasa markup standar untuk membuat dan menyusun halaman dan aplikasi web.
- [CSS] - Cascading style yang berguna untuk menyederhanakan proses pembuatan website dengan mengatur elemen yang tertulis di bahasa markup.
- [Bootstrap] - Bootstrap merupakan sebuah library atay kumpulan dari berbagai fungsi yang terdapat di framework CSS dan dibuat secara khusus di bagian pengembangan pada front-end website.
- [PgAdmin4] - PgAdmin4 merupakan alat manajemen basis data berbasis web yang digunakan untuk mengelola database PostgreSQL yang fungsinya adalah untuk mendukung penyimpanan dan pengelolaan data spasial melalui ektensi PostGIS.



## 📁 Struktur Folder Membuat Website SIERA
### Root Directory
- 'app.py' : Backend API utama.
- 'requirements.txt' : Berisi daftar dependencies yang dibutuhkan selama membuat website .

### templates/
- 'index.html' : Halaman utama website.
- 'map.html' : halaman untuk menampilkan peta interaktif.

### static/
- **css/** : Berisi file CSS yang berfungi untuk gaya antarmuka.
- **data/** : Berisi file **GeoJSON** (jika tidak menggunakan data API).
- **images/** : Berisi aset gambar.
- **img/** : Berisi aset gambar khusus untuk halaman pada 'index.html'.
- **js/** : Berisi file JavaScript untuk interaktivitas, termasuk 'mapping.js'.

### node_modules/
- Berisi library **Bootstrap** dan dependesinya.

### File Tambahan 
- 'package,json' : Metadata untuk [Node.js](https://nodejs.org/) dan dependensinya.
- 'package-lock.json' : Lockfile untuk memastikan konsistensi dependesi.

## 🚀 Cara Instalasi dan Menjalankan
Ikuti langkah-langkah berikut untuk mengatur dan menjalankan proyek ini.

### 1️⃣ Clone Repository
```sh
git clone <url-repo-github>
cd <nama-folder-proyek>
```
### 2️⃣ Install Dependencies Python
Pastikan telah mengistall python 3.x kemudian jalankan:
```sh
pip install -r requirements.txt
pip install Flask psycopg2
```
### 3️⃣ Buat Folder Berikut
Pastikan struktur folder seperti berikut :
templates/
  ├── index.html
  └── map.html
static/
  ├── css/
  ├── data/
  ├── images/
  ├── img/
  └── js/
      └── mapping.js
node_modules/

### 4️⃣ Jalankan Aplikasi
Jalankan perintah berikut unutk menjalankan server Flask :
```sh
python app.py
```
Akses aplikasi di browser melalui :
```sh
http://127.0.0.1:5000
```

## 🔧 Fitur Utama
- **Peta Interaktif** : terdapat peta interaktif menggunakan data GeoJSON atau API
- **Antarmuka Dinamis** : Antarmuka atau interface yang dikustomisasi dengan CSS dan Bootstrap
- **Backend API** : Mendukung pengolahan data melalui Flask

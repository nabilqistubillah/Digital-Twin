# DOKUMEN ANALISIS DAN RENCANA KERJA PENGEMBANGAN APLIKASI WEB
## SISTEM DIGITAL TWIN TAMBAK GARAM BERBASIS INTEGRASI SYSTEM DYNAMICS DAN LSTM

---

**Identitas Proyek:**
- **Judul Sistem:** Pengembangan Model *Digital Twin* Menggunakan Integrasi *System Dynamics* dan LSTM untuk Prediksi Produktivitas Tambak Garam Berbasis Klimatologis
- **Studi Kasus Geografis:** Sentra Tambak Garam Rakyat Kabupaten Pamekasan, Madura (Kecamatan Galis, Pademawu, Tlanakan)
- **Target Platform:** *Web Application* (*Responsive Desktop / Command-Center Optimized*)
- **Domain:** *Agritech / Maritime Decision Support System / Climate-Resilient Digital Twin*

---

## BAGIAN I: ANALISIS MENDALAM DOKUMEN RISET & BLUEPRINT SISTEM

Berdasarkan telaah komprehensif terhadap dokumen **Laporan Riset Mendalam** dan **Blueprint Web Digital Twin**, dilakukan dekonstruksi lintas disiplin yang memadukan teori hidroklimatologi, matematika sistem, kecerdasan buatan, dan rekayasa perangkat lunak modern.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (WEB DASHBOARD)                        │
│          React.js / Next.js  │ Leaflet.js (GIS) │ Plotly.js / Recharts │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTP REST / JSON
┌───────────────────────────────────▼────────────────────────────────────┐
│                       BACKEND (FASTAPI / PYTHON)                       │
│ ┌───────────────────────┐ ┌──────────────────────┐ ┌─────────────────┐ │
│ │ Data Ingestion Engine │ │   LSTM AI Forecast   │ │   PySD Runner   │ │
│ │  (BMKG / NASA API)    │ │ (TensorFlow / Keras) │ │  (.mdl Vensim)  │ │
│ └───────────────────────┘ └──────────────────────┘ └─────────────────┘ │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ ORM (SQLAlchemy)
┌───────────────────────────────────▼────────────────────────────────────┐
│                     DATABASE STORAGE (POSTGRESQL)                      │
│        TimescaleDB (Deret Waktu Cuaca) │ Master Data │ Log Skenario    │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Dekonstruksi Landasan Teoretis & Domain Fisika-Kimia

1. **Karakteristik Alami Tambak Garam Terbuka (*Open-air Solar Evaporation*):**
   - Proses evaporasi air laut (*brine*) membutuhkan rentang waktu 22 hingga 30 hari panas berkesinambungan untuk menaikkan salinitas dari air laut mentah ($3.0^\circ - 3.5^\circ \text{Baumé}$) menuju ambang kristalisasi jenuh ($25.0^\circ - 29.0^\circ \text{Baumé}$).
   - **Kerentanan Eksistensial:** Hujan tak terduga (*sporadic rainfall* / kemarau basah) menimbulkan *brine density crash* (pengenceran instan) dan melarutkan kristal NaCl yang telah terbentuk di meja kristalisasi (*crystallizer*).

2. **Formulasi Termodinamika FAO-56 Penman-Monteith:**
   - Menjadi jembatan fisik matematis untuk menghitung laju evaporasi harian ($ET_0$, mm/hari):
     $$ET_0 = \frac{0.408 \Delta (R_n - G) + \gamma \frac{900}{T+273} u_2 (e_s - e_a)}{\Delta + \gamma (1 + 0.34 u_2)}$$
   - Parameter input: Radiasi matahari bersih ($R_n$), suhu udara rata-rata ($T$), kecepatan angin ketinggian 2 meter ($u_2$), tekanan uap jenuh ($e_s$), tekanan uap aktual ($e_a$), kemiringan kurva tekanan uap ($\Delta$), dan konstanta psikrometrik ($\gamma$).

3. **Paradigma *Tri-Komponen Digital Twin*:**
   - **Predictive Engine (LSTM):** Menangkap dinamika non-linear iklim mikro harian (presipitasi, temperatur, kelembapan) hingga horison waktu 14 hari ke depan ($t+1 \dots t+14$).
   - **Virtual Twin Core (System Dynamics via PySD):** Mensimulasikan interaksi stok dan laju aliran fisik fluida:
     $$\text{Stock}_{\text{Garam}}(t) = \text{Stock}(t_0) + \int_{t_0}^t \left( \text{Rate}_{\text{Evaporasi}}(s) - \text{Rate}_{\text{Kerusakan}}(s) - \text{Rate}_{\text{Panen}}(s) \right) ds$$
   - **Scenario-Driven GIS Canvas:** Antarmuka visual poligon spasial yang dinamis merefleksikan indeks risiko kerugian dan memfasilitasi intervensi parameter mitigasi (*what-if simulation*).

---

### 2. Sintesis Kesenjangan Riset (*Research Gap*) & Pernyataan Kebaruan (*Novelty*)

| Pilar Kesenjangan | Kondisi Literatur Eksisting | Solusi & Inovasi yang Diimplementasikan |
| :--- | :--- | :--- |
| **Integration Gap** | Riset SD terdahulu menggunakan angka acak/distribusi statis tahunan; riset LSTM berhenti pada skor metrik tanpa implikasi fisis tambak. | Menghubungkan luaran peramalan LSTM secara *real-time* ke variabel aliran *outflow/inflow* pada PySD melalui formulasi termodinamika Penman-Monteith. |
| **Domain Gap** | Mayoritas *Digital Twin* pertanian berfokus pada ruang tertutup (*smart greenhouse*, *indoor aquaculture*) dengan aktuator fisik otomatis. | Membangun kembaran digital untuk ekosistem bentang alam terbuka berskala luas (*open-field macro-system*) yang sepenuhnya terekspos turbulensi cuaca. |
| **Functionality Gap**| Dasbor IoT perkebunan umumnya bertindak pasif sebagai cermin telemetri (*passive telemetry mirroring*). | Membangun modul *Interactive Scenario Playground* bivalen, di mana manipulasi slider pengguna secara dinamis memicu rekalkulasi persamaan diferensial. |

---

### 3. Evaluasi Spesifikasi Arsitektur & Teknologi

1. **Frontend (*Client Side*):**
   - **Framework:** Next.js / React.js dengan TypeScript (keandalan tipe data untuk kalkulasi array runtun waktu).
   - **Peta Spasial:** Leaflet.js (`react-leaflet`) untuk rendering poligon tambak Pamekasan berbasis format GeoJSON dengan penataan warna tematik dinamis (Hijau $<2\text{ mm}$, Kuning $2-10\text{ mm}$, Merah $>10\text{ mm}$).
   - **Visualisasi Grafik:** Plotly.js / Recharts untuk komparasi multi-kurva dinamis (Kurva *Baseline* vs Kurva *Skenario Terproteksi*).
   - **Komponen UI:** Tailwind CSS dan shadcn/ui untuk tata letak *Command Center* yang responsif dan interaktif.

2. **Backend (*Server & Compute Engine*):**
   - **Framework:** FastAPI (Python 3.10+). Eksekusi asinkron, performa tinggi, dan mampu memuat pustaka *scientific* (TensorFlow, PySD, NumPy, Pandas) dalam memori kerja yang sama.
   - **AI Forecasting Engine:** TensorFlow/Keras untuk inferensi model LSTM (`model_lstm_climate.h5`).
   - **Dynamic Simulation Engine:** Pustaka `PySD` yang mengompilasi model System Dynamics berekstensi `.mdl` (arsitektur Vensim).
   - **Task Automation:** `APScheduler` untuk jadwal reguler penarikan data iklim BMKG/NASA POWER.

3. **Basis Data (*Storage Engine*):**
   - **PostgreSQL 15+ & TimescaleDB:** Kombinasi tabel relasional standar untuk data master lahan/pengguna dan tabel deret waktu teroptimasi untuk rekaman iklim mikro serta log simulasi skenario.

---

## BAGIAN II: RENCANA KERJA PENGEMBANGAN APLIKASI WEB (WORK PLAN)

Pengembangan sistem direncanakan menggunakan metodologi **Agile Scrum** dengan durasi total **12 Minggu (6 Sprint)**.

---

### 1. Work Breakdown Structure (WBS) Rinci

#### Fase 1: Persiapan Lingkungan, Desain Skema Basis Data, & Baseline Model (Minggu 1–2 / Sprint 1)
- **Tugas 1.1:** Inisialisasi arsitektur repositori monorepo/polyrepo (Frontend Next.js TypeScript, Backend FastAPI).
- **Tugas 1.2:** Deployment basis data PostgreSQL dengan instalasi ekstensi TimescaleDB.
- **Tugas 1.3:** Eksekusi skrip DDL migrasi skema tabel:
  - `salt_production_zones` (properti luasan kristalisasi, kapasitas tampung, geometri GeoJSON).
  - `climate_timeseries` (parameter hujan, suhu, kelembapan, status anomali).
  - `simulation_runs` & `simulation_timeseries_results` (rekam jejak eksperimen).
- **Tugas 1.4:** Digitalisasi spasial dan penyusunan poligon GeoJSON sentra tambak Pamekasan (Galis, Pademawu, Tlanakan).
- **Tugas 1.5:** Pemodelan awal struktur *Stock and Flow* Vensim (`salt_twin_model.mdl`) mencakup relasi diferensial air baku, brine, evaporasi, kerusakan presipitasi, dan panen.

#### Fase 2: Pipeline Data Cuaca & Mesin Peramalan LSTM (Minggu 3–4 / Sprint 2)
- **Tugas 2.1:** Pembuatan modul *ingestion* data iklim historis (BMKG API dan NASA POWER Open API) dengan *scheduler* asinkron.
- **Tugas 2.2:** Preprocessing data time-series (normalisasi Min-Max, penanganan nilai hilang, pembuatan jendela *lookback* 30 hari).
- **Tugas 2.3:** Pelatihan arsitektur jaringan saraf Stacked-LSTM / BiLSTM multivariabel untuk target horison prediksi $t+1 \dots t+14$ hari.
- **Tugas 2.4:** Evaluasi performa model menggunakan metrik RMSE, MAE, dan $R^2$ score; ekspor bobot model terkompilasi (`model_lstm_climate.h5`).
- **Tugas 2.5:** Integrasi formulasi FAO-56 Penman-Monteith untuk mengonversi hasil inferensi temperatur, radiasi, dan kelembapan menjadi laju $ET_0$.

#### Fase 3: Integrasi PySD dan Pengembangan Layanan API FastAPI (Minggu 5–6 / Sprint 3)
- **Tugas 3.1:** Validasi fungsionalitas pustaka `PySD` dalam memuat dan mengeksekusi model Vensim di lingkungan Python tanpa *memory leak*.
- **Tugas 3.2:** Pembuatan modul *Dynamic Parameter Injector* untuk menyuntikkan vektor deret waktu $ET_0$ dan curah hujan hasil peramalan LSTM ke dalam model System Dynamics.
- **Tugas 3.3:** Pengembangan antarmuka REST API berbasis FastAPI:
  - `GET /api/farms/spatial`: Mengirimkan GeoJSON sentra tambak beserta status risiko terkini.
  - `GET /api/weather/forecast`: Menyajikan data ramalan cuaca mikro 14 hari ke depan.
  - `POST /api/simulate`: Endpoint simulasi dinamis dengan payload variabel skenario (`geomembrane_ratio`, `rainfall_stress_multiplier`).
  - `GET /api/twin/overview`: Mengembalikan rekapitulasi metrik KPI eksekutif daerah.
- **Tugas 3.4:** Penyusunan dokumentasi interaktif API melalui OpenAPI / Swagger UI (`/docs`).

#### Fase 4: Pengembangan Antarmuka Web GIS & Dasbor Eksekutif (Minggu 7–8 / Sprint 4)
- **Tugas 4.1:** Perancangan antarmuka *Single-Page Command Center* menggunakan Tailwind CSS dan shadcn/ui.
- **Tugas 4.2:** Integrasi komponen peta Leaflet.js (`react-leaflet`) dengan lapisan poligon GeoJSON sentra tambak Pamekasan.
- **Tugas 4.3:** Implementasi logika *Dynamic Risk Styling* pada peta:
  - Hijau: Kondisi aman ($\hat{R} < 2\text{ mm}$).
  - Kuning: Siaga waspada ($\hat{R} \in [2, 10]\text{ mm}$).
  - Merah: Bahaya kerusakan kristal ($\hat{R} > 10\text{ mm}$).
- **Tugas 4.4:** Pembuatan modal dialog dan *tooltip* interaktif saat poligon petak diklik (informasi kapasitas brine, luas meja kristalisasi, estimasi tonase).
- **Tugas 4.5:** Pembuatan widget ringkasan cuaca dan penghitung otomatis *Dry Spell Window* (jendela hari kering berturut-turut).

#### Fase 5: Scenario Playground & Visualisasi Komparasi Multi-Kurva (Minggu 9–10 / Sprint 5)
- **Tugas 5.1:** Pembangunan modul kontrol intervensi *Scenario Playground*:
  - Slider Rasio Geomembran ($0\% - 100\%$).
  - Slider Uji Stres Anomali Presipitasi ($+10\%, +25\%, +50\%$).
  - Tombol aksi re-simulasi instan dengan status indikator pemrosesan.
- **Tugas 5.2:** Integrasi visualisasi grafik dinamis Plotly.js / Recharts untuk menampilkan multi-kurva komparatif:
  - Kurva *Do Nothing / Baseline* (proyeksi kerugian tanpa intervensi).
  - Kurva *Adaptive Scenario* (proyeksi penyelamatan produksi garam).
- **Tugas 5.3:** Sinkronisasi pembaruan kartu KPI eksekutif (Total Estimasi Panen, Tonase Terselamatkan, Estimasi Nilai Ekonomi Terlindungi).
- **Tugas 5.4:** Optimasi penanganan *state* klien (menggunakan Zustand / TanStack Query) untuk menjamin latensi respons di bawah 1.5 detik per simulasi.

#### Fase 6: Pengujian Sistem, Validasi Skenario, & Deployment (Minggu 11–12 / Sprint 6)
- **Tugas 6.1:** Pengujian fungsional unit dan integrasi (*Unit Testing & Integration Testing* dengan PyTest dan Jest).
- **Tugas 6.2:** Uji validasi skenario cuaca ekstrem bersama pakar tambak garam / dinas perikanan (*expert judgment evaluation*).
- **Tugas 6.3:** Uji beban dan latensi komputasi simulasi diferensial (*stress testing* API).
- **Tugas 6.4:** *Containerization* menggunakan Docker dan Docker Compose (layanan Frontend, FastAPI Backend, dan PostgreSQL).
- **Tugas 6.5:** Deployment ke server staging/cloud, konfigurasi Nginx reverse proxy, dan penyusunan panduan operasional pengguna (*User Manual*).

---

### 2. Matriks Alokasi Peran & Tanggung Jawab Tim

| Peran Tim | Anggota / PIC | Ruang Lingkup Tanggung Jawab Utama | Target *Deliverables* |
| :--- | :--- | :--- | :--- |
| **Project Lead & System Architect** | Mahasiswa / Peneliti Utama | Tata kelola proyek, perancangan arsitektur terintegrasi, harmonisasi teori riset dengan implementasi teknis. | Dokumen Spesifikasi Kebutuhan, Blueprint Sistem, Laporan Akhir. |
| **AI & Simulation Engineer** | Peneliti / Data Engineer | Pengembangan model LSTM, formulasi FAO-56 Penman-Monteith, perancangan model Vensim, dan integrasi PySD. | Model `model_lstm_climate.h5`, file model `salt_twin_model.mdl`, modul PySD bridge. |
| **Backend & Database Engineer** | Backend Developer | Perancangan skema PostgreSQL/TimescaleDB, automasi pipeline cuaca, dan implementasi REST API FastAPI. | Skema DDL DB teruji, API endpoints `/api/simulate`, `/api/farms/spatial`, dll. |
| **Frontend & GIS Engineer** | Full-Stack / UI Developer | Pembangunan antarmuka Next.js/React, integrasi peta poligon Leaflet, grafik Plotly, dan modul *Scenario Playground*. | Antarmuka web responsif, komponen peta interaktif, dasbor komparasi multi-kurva. |
| **Domain Expert & QA Tester** | Pembimbing / Analis Kelautan | Validasi kewajaran parameter fisis evaporasi, pengujian skenario ekstrem, dan verifikasi kelaikan sistem. | Laporan Uji Akurasi, Berita Acara UAT (*User Acceptance Testing*). |

---

### 3. Matriks Kriteria Keberhasilan & Rencana Pengujian

1. **Pengujian Model Peramalan LSTM:**
   - **Metrik Target:** RMSE presipitasi $\le 6.5$, $R^2 \ge 0.80$ pada data pengujian.
   - **Toleransi:** Mampu mendeteksi pola anomali hujan lebat ($\ge 20\text{ mm}$) dengan *false negative* minimal pada jendela $t+3$ hari.

2. **Pengujian Komputasi PySD:**
   - **Integritas Neraca Massa:** Total volume air baku + brine + kristal terkonversi harus seimbang dengan volume evaporasi dan kerusakan presipitasi.
   - **Latensi Komputasi:** Waktu eksekusi iterasi simulasi System Dynamics 14 hari melalui PySD $\le 800\text{ ms}$.

3. **Pengujian Antarmuka Pengguna (Web UX/UI):**
   - Poligon sentra tambak Pamekasan terender sempurna dengan pewarnaan tematik otomatis sesuai batas ambang curah hujan.
   - Pergeseran slider geomembran langsung memperbarui kurva komparasi stok pada grafik secara instan ($<1.5$ detik total siklus API).

---

### 4. Analisis Manajemen Risiko & Strategi Mitigasi

| Identifikasi Risiko | Tingkat Dampak | Probabilitas | Rencana Mitigasi Teknis |
| :--- | :---: | :---: | :--- |
| **Keterlambatan/Ketidakstabilan API Cuaca Eksternal** | Tinggi | Sedang | Mengimplementasikan mekanisme *caching* di TimescaleDB dan skema *fallback* otomatis menggunakan interpolasi data historis NASA POWER jika API BMKG mengalami *timeout*. |
| **Inkompatibilitas Fitur Vensim pada Engine PySD** | Tinggi | Rendah | Menggunakan fungsi matematika dasar Vensim PLE yang didukung penuh oleh parser PySD; menghindari fungsi terkompilasi khusus (*custom DLL*). |
| **Kompleksitas Komputasi Rendering Poligon GIS** | Sedang | Rendah | Melakukan penyederhanaan geometri GeoJSON (*polygon simplification* menggunakan algoritma Ramer-Douglas-Peucker) sebelum dikirimkan ke Leaflet frontend. |
| **Deviasi Estimasi Produksi Riil di Lapangan** | Tinggi | Sedang | Menyediakan parameter koefisien kalibrasi lokal pada tabel master yang dapat disesuaikan oleh analis dinas perikanan sesuai kondisi tanah setempat. |

---

## BAGIAN III: KESIMPULAN & LANGKAH TINDAK LANJUT

Pengembangan sistem aplikasi web **Digital Twin Tambak Garam Pamekasan** ini menjembatani jurang pemisah antara riset ilmiah komputasi tingkat tinggi dengan kebutuhan praktis pengambilan keputusan di sektor maritim nasional. Dengan integrasi mulus antara model runtun waktu LSTM, kalkulasi termodinamika Penman-Monteith, simulasi diferensial PySD, dan antarmuka *Scenario Playground*, sistem ini siap menjadi tolok ukur implementasi *Smart Maritime Agritech* yang tangguh menghadapi anomali perubahan iklim global.


# ACTIONABLE DEVELOPMENT PLAN & TASK BREAKDOWN
## PENGEMBANGAN APLIKASI WEB DIGITAL TWIN TAMBAK GARAM PAMEKASAN
### (Deep Learning LSTM × System Dynamics PySD × Interactive GIS Web)

---

## 1. ARSITEKTUR STRUKTUR DIREKTORI PROYEK (MONOREPO)

Proyek ini menggunakan struktur direktori monorepo yang memisahkan lapisan komputasi analitik (*Python Backend*) dan antarmuka pengguna (*TypeScript Frontend*), dengan folder *data* dan *docs* terpusat:

```text
digital-twin/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/
│   │   │   │   ├── farms.py          # GET /api/farms/spatial
│   │   │   │   ├── weather.py        # GET /api/weather/forecast
│   │   │   │   ├── simulation.py     # POST /api/simulate
│   │   │   │   └── overview.py       # GET /api/twin/overview
│   │   │   └── api_router.py
│   │   ├── core/
│   │   │   ├── config.py             # Environment variables & settings
│   │   │   └── database.py           # SQLAlchemy / TimescaleDB engine
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── farm.py
│   │   │   ├── climate.py
│   │   │   └── simulation.py
│   │   ├── schemas/                  # Pydantic schemas (Request/Response)
│   │   │   ├── farm_schema.py
│   │   │   ├── climate_schema.py
│   │   │   └── simulation_schema.py
│   │   ├── services/
│   │   │   ├── ingestion_service.py  # BMKG / NASA API scraper & scheduler
│   │   │   ├── lstm_service.py       # Inference TensorFlow/Keras LSTM
│   │   │   ├── penman_monteith.py    # Formulasi FAO-56 Penman-Monteith
│   │   │   └── pysd_service.py       # PySD execution & parameter injector
│   │   └── main.py                   # FastAPI Application Entrypoint
│   ├── models_ml/
│   │   ├── weights/
│   │   │   └── model_lstm_climate.h5 # Trained LSTM weights
│   │   └── scalers/
│   │       └── minmax_scaler.pkl     # Normalization parameters
│   ├── simulation_models/
│   │   └── salt_twin_model.mdl       # Vensim System Dynamics Stock & Flow
│   ├── tests/
│   │   ├── test_pysd.py
│   │   ├── test_lstm.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── geojson/
│   │       └── pamekasan_salt_zones.geojson # Poligon spasial Galis, Pademawu, dll.
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   ├── HeaderCommandBar.tsx
│   │   │   │   ├── ExecutiveKpiCards.tsx
│   │   │   │   └── ClimateSummaryWidget.tsx
│   │   │   ├── map/
│   │   │   │   ├── SaltZoneMap.tsx         # Leaflet Polygon Renderer
│   │   │   │   └── ZoneDetailModal.tsx
│   │   │   ├── playground/
│   │   │   │   ├── ScenarioControls.tsx    # Sliders & Action Button
│   │   │   │   └── StressTestToggle.tsx
│   │   │   └── charts/
│   │   │       ├── StockFlowComparativeChart.tsx # Multi-Curve Plotly/Recharts
│   │   │       └── EvaporationLossChart.tsx
│   │   ├── hooks/
│   │   │   ├── useSaltFarms.ts
│   │   │   ├── useWeatherForecast.ts
│   │   │   └── useSimulation.ts
│   │   ├── services/
│   │   │   └── api.ts                      # Axios / Fetch client
│   │   ├── types/
│   │   │   ├── farm.d.ts
│   │   │   ├── climate.d.ts
│   │   │   └── simulation.d.ts
│   │   ├── pages/ atau app/
│   │   │   └── page.tsx                    # Main Command Center Dashboard
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── data/
│   ├── raw_climate/                        # Data historis BMKG / NASA (CSV)
│   ├── shapefiles/                         # Batas sentra tambak Pamekasan
│   └── seed_data.sql                       # Data awal master lahan tambak
│
├── docs/
│   ├── Blueprint_Web_Digital_Twin.md
│   ├── Rencana_Kerja_Pengembangan.md
│   └── API_Specification.md
│
├── .gitignore
└── README.md
```

---

## 2. ROADMAP SPRINT & TIKET TUGAS (TASK BACKLOG)

Rencana pengembangan dibagi menjadi 6 Sprint dengan sistem penomoran tiket tugas `TASK-xxx`.

---

### SPRINT 1: PONDASI SISTEM, BASIS DATA, & DIGITALISASI SPASIAL (MINGGU 1–2)
*Tujuan Sprint: Repositori terkonfigurasi, basis data siap dengan data awal sentra tambak Pamekasan, poligon GeoJSON terverifikasi, dan struktur dasar aplikasi berjalan.*

#### [TASK-001] Inisialisasi Repositori Git & Struktur Folder Monorepo
- **Prioritas:** P0 (Kritis) | **Estimasi:** 0.5 Hari
- **Deskripsi:** Membuat inisialisasi Git, file `.gitignore` yang memfilter `__pycache__`, `.env`, `node_modules`, virtual environment `venv/`, dan membentuk struktur folder `backend/`, `frontend/`, `data/`, `docs/`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Repositori Git terinisialisasi bersih.
  - [ ] File `.gitignore` lengkap untuk ekosistem Python dan Node.js.
  - [ ] Struktur folder monorepo tercipta sesuai arsitektur.

#### [TASK-002] Setup Database PostgreSQL / TimescaleDB & Eksekusi DDL
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:** Menyiapkan instance PostgreSQL lokal / cloud (misal Supabase/Neon/Docker jika terpasang), mengaktifkan ekstensi `TimescaleDB` (atau standard PostgreSQL dengan indexing date), dan mengeksekusi DDL 4 tabel: `salt_production_zones`, `climate_timeseries`, `simulation_runs`, dan `simulation_timeseries_results`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] 4 tabel berhasil dibuat dengan *primary key*, *foreign keys*, dan *indexes*.
  - [ ] Skrip migrasi/DDL tersimpan di `data/seed_data.sql`.

#### [TASK-003] Digitalisasi Poligon Spasial GeoJSON Sentra Tambak Pamekasan
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Menyusun file `pamekasan_salt_zones.geojson` yang mencakup 3 sentra utama: Kecamatan Galis (Desa Lembung, Konang), Kecamatan Pademawu (Desa Bunder, Majungan), dan Kecamatan Tlanakan. Setiap poligon memiliki properti: `zone_id`, `zone_name`, `total_area_ha`, `crystallization_area_ha`, `brine_storage_capacity_m3`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] File GeoJSON valid (dapat dipreview via geojson.io tanpa error format).
  - [ ] Data master berhasil diimpor (*seed*) ke tabel `salt_production_zones`.

#### [TASK-004] Scaffolding Proyek FastAPI (Backend) & Next.js/Vite (Frontend)
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:**
  - Backend: Setup Python virtualenv (`venv`), instalasi FastAPI, Uvicorn, SQLAlchemy, Pydantic, python-dotenv. Buat endpoint uji `GET /api/health`.
  - Frontend: Setup Next.js (atau Vite + React) dengan TypeScript, instalasi Tailwind CSS.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Server FastAPI berjalan di `http://localhost:8000` dengan Swagger docs di `/docs`.
  - [ ] Frontend berjalan di `http://localhost:3000` atau `http://localhost:5173`.
  - [ ] Konfigurasi CORS pada FastAPI mengizinkan komunikasi dengan port frontend.

---

### SPRINT 2: DATA INGESTION, TRAINING MODEL LSTM & FAO-56 PENMAN-MONTEITH (MINGGU 3–4)
*Tujuan Sprint: Pipeline data cuaca otomatis, inferensi model LSTM 14 hari, dan konversi ke laju evaporasi $ET_0$.*

#### [TASK-005] Pipeline Pengambilan Data Iklim (BMKG / NASA POWER API)
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Mengembangkan modul `ingestion_service.py` untuk mengunduh data cuaca harian (suhu, curah hujan, kelembapan, radiasi, kecepatan angin) untuk koordinat Pamekasan ($7.16^\circ \text{S}, 113.48^\circ \text{E}$). Menyimpan ke tabel `climate_timeseries`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Skrip mampu mengambil data secara otomatis tanpa error koneksi.
  - [ ] Mekanisme pencegahan data duplikat berdasarkan `(record_date, data_source)`.

#### [TASK-006] Preprocessing, Pelatihan, & Ekspor Model LSTM Iklim Mikro
- **Prioritas:** P0 (Kritis) | **Estimasi:** 2 Hari
- **Deskripsi:** Memproses data runtun waktu dengan *lookback window* 30 hari. Melatih arsitektur LSTM (Stacked/Bidirectional) untuk memprediksi 3 parameter cuaca harian untuk horizon 14 hari ke depan ($t+1 \dots t+14$). Menyimpan bobot `model_lstm_climate.h5` dan *scaler* `minmax_scaler.pkl`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Evaluasi performa model: RMSE curah hujan $\le 6.5\text{ mm}$, $R^2 \ge 0.75$.
  - [ ] Model dapat dimuat (*loaded*) secara asinkron di modul `lstm_service.py`.

#### [TASK-007] Implementasi Modul Termodinamika FAO-56 Penman-Monteith
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:** Membangun modul fungsi Python `penman_monteith.py` yang menerima input vektor prediksi suhu ($T$), kelembapan ($RH$), radiasi ($R_n$), kecepatan angin ($u_2$), dan mengembalikan nilai laju evapotranspirasi fisik harian ($ET_0$ dalam mm/hari).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Unit test dengan data sintetis FAO terverifikasi akurat (selisih $\le 2\%$).
  - [ ] Fungsi menghasilkan luaran skalar yang siap disuntikkan ke persamaan aliran PySD.

#### [TASK-008] Endpoint Prediksi Cuaca & Deteksi Anomali
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Membangun endpoint `GET /api/weather/forecast?days=14` yang mengembalikan array JSON berisi tanggal, prediksi hujan, suhu, kelembapan, $ET_0$, dan penanda `is_anomaly` jika curah hujan $>10\text{ mm}$.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Endpoint merespons dalam waktu $<500\text{ ms}$.
  - [ ] Skema respon sesuai spesifikasi Pydantic `WeatherForecastResponse`.

---

### SPRINT 3: VENSIM MODELING, INTEGRASI PySD, & REST API SIMULASI (MINGGU 5–6)
*Tujuan Sprint: Model System Dynamics tambak garam berjalan dalam memori Python via PySD dan mampu menerima skenario intervensi secara instan.*

#### [TASK-009] Desain Model Stock and Flow System Dynamics Tambak Garam (.mdl)
- **Prioritas:** P0 (Kritis) | **Estimasi:** 2 Hari
- **Deskripsi:** Membangun file model `salt_twin_model.mdl` di Vensim (atau ekuivalen teks persamaan diferensial):
  - State Stocks: `Stock_AirBaku`, `Stock_Brine`, `Stock_Garam_Kristal`.
  - Rate Flows: `Rate_Evaporasi`, `Rate_Kerusakan_Hujan`, `Rate_Panen`.
  - Parameters: `Luas_Lahan`, `Ratio_Geomembran` ($0.0 - 1.0$), `Rainfall_Input`, `ET0_Input`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Model lolos uji *Model Check* dan *Units Check* di Vensim.
  - [ ] Menghasilkan grafik logis: saat hujan tinggi dan geomembran 0%, stok garam kristal anjlok; saat geomembran diaktifkan, kerusakan termitigasi.

#### [TASK-010] Pembangunan Modul Komputasi PySD & Parameter Injector
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Mengembangkan modul `pysd_service.py` yang menggunakan pustaka `pysd.read_vensim('salt_twin_model.mdl')`. Menjalankan fungsi `.run()` dengan melewatkan `params` dinamis (vektor cuaca LSTM harian dan rasio intervensi slider).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Simulasi 14 hari selesai dalam waktu $<800\text{ ms}$.
  - [ ] Tidak terjadi kebocoran memori (*memory leak*) pada pemanggilan berulang kali.

#### [TASK-011] Implementasi Endpoint Eksekusi Simulasi `POST /api/simulate`
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:** Membuat endpoint API yang menerima payload JSON: `{ "zone_id": 1, "geomembrane_ratio": 0.45, "rainfall_stress_multiplier": 1.25, "simulation_days": 14 }`. Endpoint mengeksekusi dua skenario sekaligus: *Baseline* (tanpa intervensi) vs *Adaptive* (dengan slider), lalu mengembalikan kedua kurva deret waktu serta menyimpan riwayat ke `simulation_runs`.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Respons mengembalikan struktur komparatif lengkap (hari 1–14, stok brine, kehilangan garam, garam terselamatkan).
  - [ ] Status kode HTTP 200 OK dengan format JSON tervalidasi.

#### [TASK-012] Endpoint Spasial & Overview Dasbor
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 0.5 Hari
- **Deskripsi:** Membuat endpoint `GET /api/farms/spatial` (menggabungkan GeoJSON dengan status risiko cuaca hari ini) dan `GET /api/twin/overview` (rekapitulasi total luas, estimasi produksi, dan peringatan dini).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Poligon menyertakan properti status risiko (`risk_level: "LOW" | "MEDIUM" | "HIGH"`).

---

### SPRINT 4: FRONTEND GIS DIGITAL TWIN & TATA LETAK COMMAND CENTER (MINGGU 7–8)
*Tujuan Sprint: Antarmuka peta interaktif Leaflet berfungsi, menampilkan batas petak sentra garam Pamekasan dengan pewarnaan tematik dinamis.*

#### [TASK-013] Pembangunan Layout Command Center & Header Sync Bar
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Mengembangkan kerangka antarmuka *Single-Page Command Center* di Next.js: Header Bar (status koneksi API, status sinkronisasi model kembaran digital), Panel Kiri (kontrol skenario), Panel Kanan Atas (Peta Spasial GIS), Panel Kanan Bawah (Grafik & KPI).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Tampilan bersih, kontras tinggi (*command-center aesthetic*), responsif pada resolusi desktop $\ge 1280\text{px}$.

#### [TASK-014] Integrasi Peta Leaflet.js dengan Poligon GeoJSON Sentra Garam
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Mengintegrasikan `react-leaflet` pada komponen `SaltZoneMap.tsx`. Memuat GeoJSON dari `/api/farms/spatial` dan memusatkan tampilan (*center zoom*) ke Kabupaten Pamekasan ($7.16^\circ \text{S}, 113.48^\circ \text{E}$).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Poligon sentra Galis, Pademawu, dan Tlanakan terender presisi di atas peta basemap CartoDB/OpenStreetMap.
  - [ ] Peta responsif dan dapat di-zoom serta dipanning tanpa lag.

#### [TASK-015] Pewarnaan Tematik Risiko Dinamis (*Dynamic Risk Styling*)
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:** Mengimplementasikan fungsi styling poligon berdasarkan prediksi curah hujan hari ini/esok dari API:
  - Hijau (`#22c55e`): $\hat{R} < 2\text{ mm}$ (kondisi terik ideal untuk kristalisasi).
  - Kuning (`#eab308`): $\hat{R} \in [2, 10]\text{ mm}$ (waspada pengenceran air tua).
  - Merah (`#ef4444`): $\hat{R} > 10\text{ mm}$ (zona kritis kerusakan kristal garam).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Poligon otomatis berganti warna saat data cuaca berubah.
  - [ ] Tersedia legenda risiko yang jelas di sudut peta.

#### [TASK-016] Modal Dialog & Tooltip Interaktif Petak Tambak
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 0.5 Hari
- **Deskripsi:** Menambahkan *event listener click* pada poligon petak tambak untuk membuka dialog rincian: nama sentra, luas areal meja kristalisasi, kapasitas brine, dan tingkat risiko terkini.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Mengklik poligon membuka kartu detail tanpa memuat ulang halaman.

---

### SPRINT 5: SCENARIO PLAYGROUND & MULTI-CURVE COMPARATIVE CHARTS (MINGGU 9–10)
*Tujuan Sprint: Pengguna dapat menggeser slider intervensi geomembran dan melihat secara instan perbandingan proyeksi keselamatan stok garam pada grafik multi-kurva.*

#### [TASK-017] Pembuatan Komponen Kontrol Intervensi *Scenario Playground*
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1 Hari
- **Deskripsi:** Membangun komponen UI slider dan tombol di panel kiri:
  - Slider 1: Adopsi Geomembran / Penutup Tambak ($0\% - 100\%$, step $5\%$).
  - Slider 2: Stres Anomali Presipitasi ($1.0\times, 1.25\times, 1.5\times$).
  - Tombol Aksi: *"Simulasikan Ulang Digital Twin"* dengan animasi indikator loading.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Input slider mulus dengan nilai persentase yang tertera jelas.
  - [ ] State tersinkronisasi menggunakan Zustand atau React Hook state.

#### [TASK-018] Visualisasi Grafik Dinamis Multi-Kurva Komparatif (Plotly / Recharts)
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Mengembangkan komponen `StockFlowComparativeChart.tsx`. Merender dua garis kurva deret waktu 14 hari:
  - Garis Merah Putus-putus (*Baseline / Do Nothing*): Penurunan stok akibat terpapar hujan terbuka.
  - Garis Hijau Solid (*Adaptive Scenario*): Stok garam yang terlindungi berkat persentase geomembran yang dipilih pengguna.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Grafik interaktif dengan *hover tooltip* yang menampilkan tanggal, tonase baseline, dan tonase adaptif.
  - [ ] Terdapat visualisasi area arsiran (*fill area*) yang menonjolkan "Garam yang Terselamatkan (Ton)".

#### [TASK-019] Integrasi Kartu Ringkasan KPI Eksekutif Dinamis
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 0.5 Hari
- **Deskripsi:** Membangun kartu metrik KPI di bawah grafik:
  - KPI 1: Estimasi Total Produksi Panen (Ton).
  - KPI 2: Stok Garam Terselamatkan (+Tonase & persentase proteksi).
  - KPI 3: Estimasi Nilai Ekonomi Terlindungi (Rp).
  - KPI 4: *Dry Spell Window* (Jumlah hari panas berturut-turut).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Angka KPI terhitung dan teranimasi secara reaktif segera setelah respons API `/api/simulate` diterima.

#### [TASK-020] Optimasi Penanganan State & Latensi Respons End-to-End
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Menerapkan TanStack Query (*React Query*) untuk caching request, *debouncing* pada slider jika diinginkan re-simulasi otomatis, dan memastikan seluruh alur klik-hingga-render kurva baru selesai dalam $<1.5$ detik.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Tidak terjadi lag antarmuka saat pengguna menggeser slider berulang kali.
  - [ ] Penanganan status *error* atau jaringan *offline* tertata ramah pengguna.

---

### SPRINT 6: PENGUJIAN INTEGRASI, VALIDASI MODEL, & DOKUMENTASI (MINGGU 11–12)
*Tujuan Sprint: Sistem teruji secara menyeluruh, siap dipresentasikan/digunakan, dan terdokumentasi rapi.*

#### [TASK-021] Pengujian Unit & Integrasi Sistem (PyTest & Frontend Tests)
- **Prioritas:** P0 (Kritis) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Menulis tes otomatis pada backend (`pytest tests/`) untuk memvalidasi:
  - Perhitungan formula Penman-Monteith.
  - Validitas format output PySD.
  - Validitas respon status code dan skema JSON seluruh endpoint FastAPI.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Seluruh unit test backend lolos 100% (*zero failure*).

#### [TASK-022] Uji Validasi Skenario Ekstrem (*Extreme Condition Testing*)
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Menjalankan eksperimen simulasi dengan berbagai kondisi batas:
  - Kasus 1: Musim kemarau ekstrem (curah hujan $0\text{ mm}$ selama 14 hari) $\rightarrow$ produksi garam harus maksimal.
  - Kasus 2: Hujan badai ekstrem (curah hujan $>50\text{ mm}$ berturut-turut) tanpa terpal $\rightarrow$ stok garam kristal harus mendekati nol.
  - Kasus 3: Hujan badai ekstrem dengan proteksi geomembran $100\%$ $\rightarrow$ stok garam harus tetap aman.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Perilaku model System Dynamics stabil dan secara saintifik rasional di seluruh skenario batas.

#### [TASK-023] Konfigurasi Deployment & Skrip Menjalankan Aplikasi
- **Prioritas:** P1 (Tinggi) | **Estimasi:** 1 Hari
- **Deskripsi:** Menyusun file konfigurasi produksi: file `.env.production`, skrip PowerShell / Bash untuk menjalankan backend dan frontend secara bersamaan (`run_dev.ps1` atau `docker-compose.yml` opsional).
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Aplikasi dapat dijalankan dengan mudah oleh pengguna lain hanya dengan satu atau dua perintah terstandar.

#### [TASK-024] Penyusunan Laporan Proyek & Panduan Pengguna (*User Guide*)
- **Prioritas:** P2 (Sedang) | **Estimasi:** 1.5 Hari
- **Deskripsi:** Melengkapi dokumentasi akhir: panduan instalasi, cara membaca visualisasi GIS, cara mengeksekusi simulasi *What-If*, serta laporan ringkas hasil pengujian.
- **Kriteria Keberhasilan (Acceptance Criteria):**
  - [ ] Dokumen `README.md` dan `User_Manual.md` lengkap dengan screenshot dan instruksi langkah demi langkah.

---

## 3. CHECKLIST LANGKAH MEMULAI PENGEMBANGAN HARI INI (SPRINT 1 KICKOFF)

Untuk langsung memulai tahap implementasi sekarang, berikut adalah langkah konkret yang siap dieksekusi secara berurutan:

### Panduan Eksekusi Terminal Langkah Demi Langkah:

#### Langkah 1: Pembuatan Folder & Git Init
```powershell
# Di folder root: d:\Subject Kuliah\semester7\Mobile Lanjutan\digital-twin
mkdir backend, frontend, data, docs
git init
```

#### Langkah 2: Setup Backend Python Virtual Environment
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instalasi paket fondasi utama
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-dotenv requests pandas numpy
pip freeze > requirements.txt
```

#### Langkah 3: Setup Frontend React / Next.js
```powershell
cd ..\frontend
# Inisialisasi proyek Next.js / Vite React TypeScript
npm create vite@latest . -- --template react-ts
npm install
npm install lucide-react clsx tailwindcss leaflet react-leaflet recharts axios
```

#### Langkah 4: Penyusunan File Data Spasial & Skema Basis Data
- Letakkan file GeoJSON batas Pamekasan di `frontend/public/geojson/pamekasan_salt_zones.geojson`.
- Eksekusi DDL tabel yang telah dirancang di dokumen `Blueprint` ke database PostgreSQL.


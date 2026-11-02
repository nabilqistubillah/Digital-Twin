# SALT-TWIN PAMEKASAN
## Digital Twin Tambak Garam Rakyat Berbasis Integrasi System Dynamics dan LSTM

Artefak perangkat lunak berbasis web yang memadukan **Kembaran Digital (Digital Twin)**, peramalan kecerdasan buatan (**Deep Learning - LSTM**), formulasi termodinamika evaporasi (**FAO-56 Penman-Monteith**), dan pemodelan diferensial stok & aliran (**System Dynamics via PySD**) untuk memitigasi risiko gagal panen tambak garam rakyat di pesisir Kabupaten Pamekasan, Madura.

---

## 🌟 Fitur Utama Sistem

1. **Kanvas GIS Digital Twin Interaktif (Leaflet.js):**
   - Pemetaan batas sentra tambak garam (Galis, Pademawu, Tlanakan) dalam poligon GeoJSON.
   - Pewarnaan risiko dinamis (*thematic risk styling*): Hijau (<2mm), Kuning (2-10mm), Merah (>10mm).
   - Tooltip dan badge informasi detail petak tambak (kapasitas brine, luas meja kristal, jumlah petani).

2. **Scenario Playground (What-If Analysis):**
   - Slider interaktif adopsi geomembran penutup anti-hujan ($0\% - 100\%$).
   - Slider pengali stres hujan anomali ($0.5\times - 2.0\times$).
   - Tombol eksekusi re-simulasi seketika yang memicu rekalkulasi persamaan diferensial.

3. **Multi-Curve Comparative Stock Chart (Recharts):**
   - Menampilkan komparasi kurva deret waktu 14 hari antara **Baseline (Do Nothing)** vs **Skenario Mitigasi Terpal**.
   - Menyorot secara visual volume garam yang berhasil diselamatkan dari ancaman pelarutan air hujan.

4. **Executive KPI Cards & Weather Strip:**
   - Kartu metrik: Total Proyeksi Panen, Garam Terselamatkan (Ton), Nilai Ekonomi Terlindungi (Rp), dan Jendela Hari Terik (*Dry Spell Window*).
   - Strip peramalan iklim mikro 14 hari dengan estimasi laju evaporasi $ET_0$ (mm/hari).

---

## 🏗️ Struktur Monorepo

```text
digital-twin/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints (/farms/spatial, /weather/forecast, /simulate, /twin/overview)
│   │   ├── core/         # Config & Database Session (SQLite/PostgreSQL)
│   │   ├── models/       # SQLAlchemy ORM Models
│   │   ├── schemas/      # Pydantic Schemas
│   │   ├── services/     # Penman-Monteith, PySD Engine, LSTM Service
│   │   └── main.py       # FastAPI Entrypoint
│   ├── tests/            # PyTest Test Suite (100% Passed)
│   ├── venv/             # Python Virtual Environment
│   └── requirements.txt
│
├── frontend/
│   ├── public/geojson/   # GeoJSON Sentra Tambak Garam Pamekasan
│   ├── src/
│   │   ├── components/   # HeaderBar, ExecutiveKpiCards, ScenarioPlayground, InteractiveMap, ComparativeChart
│   │   ├── types/        # TypeScript Interfaces
│   │   ├── App.tsx       # Main Command Center Layout
│   │   └── main.tsx
│   ├── package.json
│   └── dist/             # Production Build
│
├── data/
│   ├── pamekasan_salt_zones.geojson
│   └── seed_data.sql     # Skema DDL 4 Tabel & Data Awal
│
├── run_dev.ps1           # Skrip Satu Klik Menjalankan Backend + Frontend
└── README.md
```

---

## 🚀 Panduan Menjalankan Sistem

### Opsi 1: Menjalankan dengan Skrip PowerShell (Satu Klik)
Di terminal root proyek:
```powershell
.\run_dev.ps1
```

### Opsi 2: Menjalankan Secara Manual

#### 1. Menjalankan Backend (FastAPI):
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Akses dokumentasi Swagger API di: [http://localhost:8000/docs](http://localhost:8000/docs)

#### 2. Menjalankan Frontend (React + Vite):
Buka terminal baru:
```powershell
cd frontend
npm run dev
```
Akses aplikasi web di: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Menjalankan Pengujian Backend (PyTest)
```powershell
$env:PYTHONPATH="backend"
.\backend\venv\Scripts\pytest.exe backend\tests\test_simulation.py -v
```
Output:
- `test_penman_monteith_calculation` ✅ PASSED
- `test_lstm_forecast_generator` ✅ PASSED
- `test_system_dynamics_simulation` ✅ PASSED


# ==============================================================================
# Script Menjalankan Sistem SALT-TWIN PAMEKASAN (Backend & Frontend)
# ==============================================================================

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   SALT-TWIN PAMEKASAN: DIGITAL TWIN TAMBAK GARAM   " -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Menjalankan Backend FastAPI di jendela baru
Write-Host "[1/2] Menjalankan Backend FastAPI (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# Beri jeda 2 detik
Start-Sleep -Seconds 2

# 2. Menjalankan Frontend Vite di jendela baru
Write-Host "[2/2] Menjalankan Frontend React/Vite (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "Layanan Berhasil Diluncurkan:" -ForegroundColor Green
Write-Host " - Frontend Web Dashboard : http://localhost:3000" -ForegroundColor Cyan
Write-Host " - Backend Swagger API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan


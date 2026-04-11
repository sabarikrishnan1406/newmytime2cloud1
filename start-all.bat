@echo off
echo Starting MyTime2Cloud Services...

echo [1/6] Starting API Server (port 8000)...
start "API-Server" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan serve --host=0.0.0.0 --port=8000"

echo [2/6] Starting Camera Proxy (port 8501)...
start "Camera-Proxy" cmd /k "cd /d D:\newmytime2cloud\camera-proxy && node server.js"

echo [3/6] Starting Frontend (port 3001)...
start "Frontend" cmd /k "cd /d D:\newmytime2cloud\frontend-new && npm run dev"

echo [4/6] Starting Camera Service (port 8500)...
start "Camera-Service" cmd /k "cd /d D:\newmytime2cloud\camera-service && python main.py"

echo [5/6] Starting Queue Worker...
start "Queue-Worker" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan queue:work --tries=3 --timeout=60"

echo [6/7] Starting Scheduler...
start "Scheduler" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan schedule:work"

echo [7/7] Starting PDF Service (port 3002)...
start "PDF-Service" cmd /k "cd /d D:\newmytime2cloud\pdf-service && node index.js"

echo.
echo All services started!
echo   API:      http://localhost:8000
echo   Frontend: http://localhost:3001
echo   Camera:   http://localhost:8500
echo   Proxy:    ws://localhost:8501
echo   PDF:      http://localhost:3002
echo   Queue:    Processing emails/notifications
echo   Scheduler: Running scheduled tasks

@echo off
echo Starting MyTime2Cloud Services...

echo [1/3] Starting Camera Proxy (port 8501)...
start /B cmd /c "cd /d D:\newmytime2cloud\camera-proxy && node server.js"

echo [2/3] Starting Frontend (port 3001)...
start /B cmd /c "cd /d D:\newmytime2cloud\frontend-new && npm run dev"

echo [3/4] Starting Camera Service (face detection, port 8500)...
start /B cmd /c "cd /d D:\newmytime2cloud\camera-service && python main.py"

echo [4/4] Starting Queue Worker (for emails/notifications)...
start /B cmd /c "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan queue:work --tries=3 --timeout=60"

echo.
echo All services started!
echo   Frontend: http://localhost:3001
echo   Camera:   ws://localhost:8501
echo   Queue:    Processing emails/notifications
echo.
pause

@echo off
echo Starting MyTime2Cloud Services...

echo [1/2] Starting Camera Proxy (port 8501)...
start /B cmd /c "cd /d D:\newmytime2cloud\camera-proxy && node server.js"

echo [2/2] Starting Frontend (port 3001)...
start /B cmd /c "cd /d D:\newmytime2cloud\frontend-new && npm run dev"

echo.
echo All services started!
echo   Frontend: http://localhost:3001
echo   Camera:   ws://localhost:8501
echo.
pause

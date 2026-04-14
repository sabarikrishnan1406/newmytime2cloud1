@echo off
echo Starting MyTime2Cloud Services...

echo [1/9] Starting API Server (port 8000)...
start "API-Server" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan serve --host=0.0.0.0 --port=8000"

echo [2/9] Starting Camera Proxy (port 8501)...
start "Camera-Proxy" cmd /k "cd /d D:\newmytime2cloud\camera-proxy && node server.js"

echo [3/9] Starting Frontend (port 3001)...
start "Frontend" cmd /k "cd /d D:\newmytime2cloud\frontend-new && npm run dev"

echo [4/9] Starting Camera Service (port 8500)...
start "Camera-Service" cmd /k "cd /d D:\newmytime2cloud\camera-service && python main.py"

echo [5/9] Starting Queue Worker...
start "Queue-Worker" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan queue:work --tries=3 --timeout=60"

echo [6/9] Starting Scheduler...
start "Scheduler" cmd /k "cd /d D:\newmytime2cloud\backend && D:\php\php.exe artisan schedule:work"

echo [7/9] Starting PDF Service (port 3002)...
start "PDF-Service" cmd /k "cd /d D:\newmytime2cloud\pdf-service && node index.js"

echo [8/9] Starting MQTT Broker (ports 1883 + 8083)...
start "MQTT-Broker" cmd /k "cd /d D:\newmytime2cloud\loglistner_mqtt && node mqtt-broker.js"

echo [9/9] Starting OXSAI Log Listener...
start "OXSAI-Listener" cmd /k "cd /d D:\newmytime2cloud\loglistner_mqtt && node log-listener-batch.js"

echo.
echo All services started!
echo   API:         http://localhost:8000
echo   Frontend:    http://localhost:3001
echo   Camera:      http://localhost:8500
echo   Proxy:       ws://localhost:8501
echo   PDF:         http://localhost:3002
echo   MQTT TCP:    localhost:1883
echo   MQTT WS:     ws://localhost:8083
echo   OXSAI:       WebSocket listener to cloud SDK
echo   Queue:       Processing emails/notifications
echo   Scheduler:   Running scheduled tasks

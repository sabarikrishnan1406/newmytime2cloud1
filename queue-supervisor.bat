@echo off
title Queue-Worker-Supervisor
:loop
echo [%date% %time%] Starting queue worker...
cd /d D:\newmytime2cloud\backend
D:\php\php.exe artisan queue:work --tries=3 --timeout=60 --sleep=3
echo [%date% %time%] Worker stopped. Restarting in 5 seconds...
timeout /t 5 /nobreak >nul
goto loop

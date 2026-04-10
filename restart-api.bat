@echo off
echo Starting API Server on 0.0.0.0:8000...
cd /d D:\newmytime2cloud\backend
D:\php\php.exe artisan serve --host=0.0.0.0 --port=8000

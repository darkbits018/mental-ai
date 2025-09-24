@echo off
echo Starting Mental AI Development Environment...

echo.
echo Starting Flask Backend in background...
cd /d "W:\Mental AI\Mental-AI-Backend"
start /b python app.py

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Development Server...
cd /d "W:\Mental AI\Mental-AI-Frontend"
echo.
echo ========================================
echo  SERVICES RUNNING:
echo  - Backend: Flask (running in background)
echo  - Frontend: npm run dev (this window)
echo ========================================
echo.
echo TO STOP ALL SERVICES:
echo 1. Press Ctrl+C in this window
echo 2. When prompted, type 'Y' and press Enter
echo 3. Close this window to stop backend too
echo.
echo Starting frontend now...
echo.
npm run dev

echo.
echo Frontend stopped. Stopping backend...
taskkill /f /im python.exe >nul 2>&1
echo All services stopped.

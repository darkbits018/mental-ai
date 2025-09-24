@echo off
echo Stopping Mental AI Development Services...

echo.
echo Stopping Python processes (Flask Backend)...
taskkill /f /im python.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Flask Backend stopped
) else (
    echo - No Flask Backend processes found
)

echo.
echo Stopping Node.js processes (Frontend)...
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend stopped
) else (
    echo - No Frontend processes found
)

echo.
echo All development services stopped.
echo.
pause

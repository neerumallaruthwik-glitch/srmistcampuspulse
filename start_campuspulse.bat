@echo off
title CampusPulse - Two-Sided Smart Event Hub
echo ======================================================================
echo           Welcome to CampusPulse Platform Launcher
echo   "Discover Better. Organize Smarter. Connect Campus."
echo ======================================================================

set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not found. Please ensure Node.js is installed.
    pause
    exit /b 1
)

echo.
echo Starting CampusPulse Backend (Port 5000) and Frontend (Port 5173)...
echo.
npm start

pause

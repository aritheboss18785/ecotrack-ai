@echo off
title EcoTrack AI - Quick Start

echo 🌱 EcoTrack AI - Quick Start
echo ==============================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available!
    echo Please make sure npm is installed with Node.js
    pause
    exit /b 1
)

echo ✅ npm is available
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

echo.
echo 🚀 Starting EcoTrack AI...
echo Your browser should open automatically.
echo If not, open: http://localhost:5173
echo.
echo Press Ctrl+C to stop the application
echo ==============================

REM Start the development server
npm run dev

pause
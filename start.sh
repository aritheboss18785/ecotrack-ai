#!/bin/bash

# EcoTrack AI - Quick Start Script
# This script helps users run the app without using terminal commands

echo "🌱 EcoTrack AI - Quick Start"
echo "=============================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    echo "After installation, run this script again."
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    echo "Please make sure npm is installed with Node.js"
    read -p "Press Enter to exit..."
    exit 1
fi

echo "✅ npm is available"
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        read -p "Press Enter to exit..."
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting EcoTrack AI..."
echo "Your browser should open automatically."
echo "If not, open: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the application"
echo "=============================="

# Start the development server
npm run dev
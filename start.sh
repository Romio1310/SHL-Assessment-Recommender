#!/bin/bash

# SHL Assessment Recommendation Engine Starter Script

echo "Starting SHL Assessment Recommendation Engine..."

# Check Python version
python3 --version >/dev/null 2>&1 || { echo "Error: Python 3 is required but not installed."; exit 1; }

# Kill any existing processes on port 8080 (cross-platform approach)
echo "Checking for processes on port 8080..."
if command -v lsof >/dev/null 2>&1; then
    # macOS/Linux
    PID=$(lsof -ti:8080)
    if [ ! -z "$PID" ]; then
        echo "Killing process $PID using port 8080"
        kill -9 $PID
    fi
elif command -v netstat >/dev/null 2>&1; then
    # Windows
    PID=$(netstat -ano | grep 8080 | awk '{print $5}')
    if [ ! -z "$PID" ]; then
        echo "Killing process $PID using port 8080"
        taskkill /F /PID $PID
    fi
else
    echo "Warning: Unable to check for processes on port 8080. Please make sure the port is free."
fi

# Clear Python cache files
echo "Clearing Python cache files..."
find . -name "__pycache__" -type d -exec rm -rf {} +
find . -name "*.pyc" -delete
find . -name "*.pyo" -delete

# Set environment variables - changing to development mode for better error reporting
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Check if virtual environment exists, if not create it
VENV_DIR="venv"
if [ ! -d "$VENV_DIR" ]; then
    echo "Setting up virtual environment..."
    python3 -m venv $VENV_DIR || { echo "Error: Failed to create virtual environment."; exit 1; }
    
    # Source the activation script based on platform
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source $VENV_DIR/bin/activate
    elif [ -f "$VENV_DIR/Scripts/activate" ]; then
        source $VENV_DIR/Scripts/activate
    else
        echo "Error: Could not find activation script for virtual environment."
        exit 1
    fi
    
    echo "Installing dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt || { echo "Error: Failed to install Python dependencies"; exit 1; }
else
    # Source the activation script based on platform
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source $VENV_DIR/bin/activate
    elif [ -f "$VENV_DIR/Scripts/activate" ]; then
        source $VENV_DIR/Scripts/activate
    else
        echo "Error: Could not find activation script for virtual environment."
        exit 1
    fi
fi

# Update dependencies
echo "Updating Python dependencies..."
pip install -r requirements.txt || { echo "Error: Failed to install Python dependencies"; exit 1; }

# Check if npm is installed
if command -v npm &> /dev/null; then
    echo "Installing NPM dependencies..."
    npm install || { echo "Error: Failed to install NPM dependencies"; }
    
    echo "Building Tailwind CSS..."
    npm run build || { echo "Error: Failed to build Tailwind CSS"; }
else
    echo "Warning: npm is not installed. Skipping Tailwind CSS build."
    echo "To use the enhanced UI, please install Node.js and npm, then run:"
    echo "npm install && npm run build"
fi

# Make sure the data directory exists
mkdir -p data

# Run the application with consistent port/host between app.py and this script
echo "Starting the server on port 8080..."
python app.py

echo "Server shutting down..."
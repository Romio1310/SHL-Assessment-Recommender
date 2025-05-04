#!/bin/bash

# SHL Assessment Recommendation Engine Starter Script (Minimal Version)

echo "Starting SHL Assessment Recommendation Engine (Minimal Version)..."

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

# Set environment variables - changing to development mode for better error reporting
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Check if virtual environment exists, if not create it
VENV_DIR="venv_minimal"
if [ ! -d "$VENV_DIR" ]; then
    echo "Setting up minimal virtual environment..."
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
    
    echo "Installing essential dependencies..."
    pip install --upgrade pip
    pip install flask==2.3.3 werkzeug==2.3.7 jinja2==3.1.2 blinker==1.9.0 click==8.1.8 itsdangerous==2.2.0 markupsafe==3.0.2 || { 
        echo "Error: Failed to install minimal Python dependencies"; 
        exit 1; 
    }
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

# Make sure the data directory exists
mkdir -p data

# Run the application with consistent port/host
echo "Starting the server on port 8080..."
python app.py

echo "Server shutting down..."
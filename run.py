#!/usr/bin/env python3
"""
Simple standalone script to run the SHL Assessment Recommender
without having to deal with environment setup issues.
"""
import os
import sys
from datetime import datetime
from app import create_app

if __name__ == "__main__":
    # Clear terminal for better visibility
    os.system('clear' if os.name == 'posix' else 'cls')
    
    # Print banner
    print("\033[1;36m")  # Cyan, bold
    print("╔═══════════════════════════════════════════════════╗")
    print("║   SHL Assessment Recommender - Starting Server    ║")
    print("╚═══════════════════════════════════════════════════╝")
    print("\033[0m")  # Reset color
    
    print(f"\033[1;37m🚀 Starting application at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\033[0m")
    print("\033[0;33m⚠️  Press CTRL+C to stop the server\033[0m")
    print("\033[0;32m✅ Server will be available at: \033[1;32mhttp://127.0.0.1:8080\033[0m")
    print("\n")
    
    # Create and run the app
    app = create_app()
    app.run(host='127.0.0.1', port=8080, debug=True)
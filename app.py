from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Enable debug mode for development
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    # Changed port from 5000 to 8080 to avoid conflict with macOS AirPlay
    app.run(debug=debug_mode, host='0.0.0.0', port=8080, use_debugger=False if debug_mode else None)
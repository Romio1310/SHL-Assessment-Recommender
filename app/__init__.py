from flask import Flask
import traceback  # Added for better error logging

def create_app():
    """Create and configure the Flask application."""
    try:
        app = Flask(__name__, template_folder='../templates', static_folder='../static')
        
        # Configure the app
        app.config['SECRET_KEY'] = 'dev-key-for-sessions'  # Added for session support
        app.config['JSON_SORT_KEYS'] = False  # Preserve JSON order in responses
        
        # Register routes with the app
        from app import routes
        app.register_blueprint(routes.bp)
        
        return app
    except Exception as e:
        print(f"Error initializing app: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")  # Print detailed traceback
        # Create minimal app if there's an error
        app = Flask(__name__, template_folder='../templates', static_folder='../static')
        
        @app.route('/')
        def home():
            return "SHL Assessment Recommendation Engine is starting up. Please ensure all dependencies are installed."
        
        return app
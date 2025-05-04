from flask import Blueprint, render_template, request, jsonify, abort, current_app
from app.recommendation_engine import RecommendationEngine
import datetime  # Add datetime import for timestamp
import traceback  # For better error reporting

bp = Blueprint('main', __name__)
recommendation_engine = RecommendationEngine()

# Load data immediately when blueprint is defined
recommendation_engine.load_data()

@bp.route('/')
def index():
    """Render the main page with the recommendation form."""
    try:
        # Get lists for dropdowns
        job_roles = recommendation_engine.get_job_roles()
        industries = recommendation_engine.get_industries()
        experience_levels = recommendation_engine.get_experience_levels()
        skills = recommendation_engine.get_skills()
        
        return render_template(
            'index.html',
            job_roles=job_roles,
            industries=industries,
            experience_levels=experience_levels,
            skills=skills,
            now=datetime.datetime.now()  # Add current date for all templates
        )
    except Exception as e:
        return render_template('error.html', 
                               error_title="Data Loading Error",
                               error_message=f"Unable to load recommendation data: {str(e)}",
                               now=datetime.datetime.now())

@bp.route('/recommend', methods=['POST'])
def recommend():
    """Process form submission and return recommendations."""
    try:
        # Debug output to help diagnose issues
        print("==== FORM SUBMISSION RECEIVED ====")
        print(f"Form data: {request.form}")
        
        data = request.form
        job_role = data.get('job_role', '')
        
        # Fix for skills selection - use getlist to handle multiple selections
        skills = data.getlist('skills')
        
        experience_level = data.get('experience_level', '')
        industry = data.get('industry', '')
        
        print(f"Parsed data: job_role={job_role}, skills={skills}, level={experience_level}, industry={industry}")
        
        # Validate inputs
        if not job_role or not skills or not experience_level or not industry:
            missing = []
            if not job_role: missing.append("Job Role")
            if not skills: missing.append("Skills")
            if not experience_level: missing.append("Experience Level")
            if not industry: missing.append("Industry")
            
            error_msg = f"Please fill in all required fields: {', '.join(missing)}"
            print(f"Validation error: {error_msg}")
            
            return render_template('error.html',
                                  error_title="Missing Information",
                                  error_message=error_msg,
                                  now=datetime.datetime.now())
        
        # Get recommendations
        print("Getting recommendations...")
        recommendations = recommendation_engine.get_recommendations(
            job_role=job_role,
            skills=skills,
            experience_level=experience_level,
            industry=industry
        )
        
        print(f"Found {len(recommendations)} recommendations")
        
        # Create response
        return render_template(
            'recommendations.html',
            recommendations=recommendations,
            user_inputs={
                'job_role': job_role,
                'skills': skills,
                'experience_level': experience_level,
                'industry': industry
            },
            now=datetime.datetime.now()  # Add current date for the template
        )
    except Exception as e:
        print("ERROR in recommend route:")
        traceback.print_exc()
        return render_template('error.html',
                              error_title="Recommendation Error",
                              error_message=f"Unable to generate recommendations: {str(e)}",
                              now=datetime.datetime.now())

@bp.route('/api/recommend', methods=['POST'])
def api_recommend():
    """API endpoint for recommendations."""
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        job_role = data.get('job_role', '')
        skills = data.get('skills', [])
        experience_level = data.get('experience_level', '')
        industry = data.get('industry', '')
        
        # Validate required fields
        if not job_role or not skills or not experience_level or not industry:
            return jsonify({'error': 'Missing required fields'}), 400
        
        recommendations = recommendation_engine.get_recommendations(
            job_role=job_role,
            skills=skills,
            experience_level=experience_level,
            industry=industry
        )
        
        return jsonify({
            'recommendations': [r.to_dict() for r in recommendations],
            'user_inputs': {
                'job_role': job_role,
                'skills': skills,
                'experience_level': experience_level,
                'industry': industry
            },
            'generated_at': datetime.datetime.now().strftime('%B %d, %Y')
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@bp.app_errorhandler(404)
def page_not_found(e):
    return render_template('error.html', 
                          error_title="Page Not Found",
                          error_message="The page you requested could not be found.",
                          now=datetime.datetime.now()), 404

@bp.app_errorhandler(500)
def internal_server_error(e):
    return render_template('error.html',
                          error_title="Server Error",
                          error_message="An internal server error occurred.",
                          now=datetime.datetime.now()), 500
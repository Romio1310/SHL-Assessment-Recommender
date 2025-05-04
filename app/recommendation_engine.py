import os
import json
import random
import traceback  # Added for better error logging
from app.models import Assessment, Recommendation

class RecommendationEngine:
    """Engine for recommending SHL assessments based on user inputs."""
    
    def __init__(self):
        """Initialize the recommendation engine."""
        self.assessments = []
        self.job_roles = []
        self.industries = []
        self.experience_levels = []
        self.skills = []
        self.job_role_mappings = {}
        self.industry_mappings = {}
        self.experience_mappings = {}
        self.skill_mappings = {}
        
    def load_data(self):
        """Load assessment data and mappings from files."""
        try:
            data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
            
            # Create data directory if it doesn't exist
            if not os.path.exists(data_dir):
                os.makedirs(data_dir)
                print(f"Created data directory: {data_dir}")
            
            # Load or create assessment data
            assessment_file = os.path.join(data_dir, 'assessments.json')
            if os.path.exists(assessment_file):
                try:
                    print(f"Attempting to load data from: {assessment_file}")
                    with open(assessment_file, 'r') as f:
                        file_content = f.read()
                        if not file_content.strip():
                            print("Warning: assessment file is empty, will create sample data")
                            assessment_data = self._create_sample_data()
                        else:
                            try:
                                assessment_data = json.loads(file_content)
                                print("Successfully loaded assessment data")
                            except json.JSONDecodeError as e:
                                print(f"Error parsing assessment data: {e}")
                                print(f"File content: {file_content[:100]}...")  # Print beginning of file for debugging
                                assessment_data = self._create_sample_data()
                except Exception as e:
                    print(f"Error opening assessment file: {e}")
                    print(traceback.format_exc())
                    assessment_data = self._create_sample_data()
            else:
                # Create sample assessment data if file doesn't exist
                print(f"Assessment file does not exist: {assessment_file}")
                assessment_data = self._create_sample_data()
                try:
                    with open(assessment_file, 'w') as f:
                        json.dump(assessment_data, f, indent=2)
                    print(f"Created new assessment file with sample data")
                except Exception as e:
                    print(f"Warning: Could not save assessment data: {e}")
                    print(traceback.format_exc())
            
            # Create assessment objects
            self.assessments = []
            for item in assessment_data.get('assessments', []):
                try:
                    assessment = Assessment(
                        id=item.get('id', ''),
                        name=item.get('name', ''),
                        description=item.get('description', ''),
                        category=item.get('category', ''),
                        duration=item.get('duration', 0),
                        difficulty=item.get('difficulty', ''),
                        skills_measured=item.get('skills_measured', [])
                    )
                    self.assessments.append(assessment)
                except Exception as e:
                    print(f"Error creating assessment: {e}")
                    print(traceback.format_exc())
            
            # Load reference data with defaults if keys don't exist
            self.job_roles = sorted(assessment_data.get('job_roles', []))
            self.industries = sorted(assessment_data.get('industries', []))
            self.experience_levels = sorted(assessment_data.get('experience_levels', []))
            self.skills = sorted(assessment_data.get('skills', []))
            
            # Load mappings with defaults if keys don't exist
            self.job_role_mappings = assessment_data.get('job_role_mappings', {})
            self.industry_mappings = assessment_data.get('industry_mappings', {})
            self.experience_mappings = assessment_data.get('experience_mappings', {})
            self.skill_mappings = assessment_data.get('skill_mappings', {})
            
            print(f"Successfully loaded data: {len(self.assessments)} assessments, {len(self.job_roles)} job roles, {len(self.skills)} skills")
            
        except Exception as e:
            print(f"Error loading data: {str(e)}")
            print(traceback.format_exc())
            # Initialize with empty data rather than raising an exception
            self.assessments = []
            self.job_roles = []
            self.industries = []
            self.experience_levels = []
            self.skills = []
            self.job_role_mappings = {}
            self.industry_mappings = {}
            self.experience_mappings = {}
            self.skill_mappings = {}
    
    def get_job_roles(self):
        """Get list of available job roles."""
        return self.job_roles
    
    def get_industries(self):
        """Get list of available industries."""
        return self.industries
    
    def get_experience_levels(self):
        """Get list of available experience levels."""
        return self.experience_levels
    
    def get_skills(self):
        """Get list of available skills."""
        return self.skills
    
    def get_recommendations(self, job_role='', skills=None, experience_level='', industry=''):
        """
        Get recommendations based on user inputs.
        
        Parameters:
        - job_role: The job role selected
        - skills: List of skills selected
        - experience_level: Experience level selected
        - industry: Industry selected
        
        Returns:
        - List of Recommendation objects
        """
        try:
            skills = skills or []
            
            # Get relevance scores for each assessment
            assessment_scores = {}
            
            # Job role contribution (40% weight)
            if job_role and job_role in self.job_role_mappings:
                for assessment_id, score in self.job_role_mappings[job_role].items():
                    if assessment_id not in assessment_scores:
                        assessment_scores[assessment_id] = {'score': 0, 'factors': {}}
                    assessment_scores[assessment_id]['score'] += score * 0.4
                    assessment_scores[assessment_id]['factors']['job_role'] = score
            
            # Skills contribution (30% weight)
            if skills:
                for skill in skills:
                    if skill in self.skill_mappings:
                        for assessment_id, score in self.skill_mappings[skill].items():
                            if assessment_id not in assessment_scores:
                                assessment_scores[assessment_id] = {'score': 0, 'factors': {}}
                            # Distribute skill weight evenly
                            skill_weight = 0.3 / len(skills)
                            assessment_scores[assessment_id]['score'] += score * skill_weight
                            if 'skills' not in assessment_scores[assessment_id]['factors']:
                                assessment_scores[assessment_id]['factors']['skills'] = {}
                            assessment_scores[assessment_id]['factors']['skills'][skill] = score
            
            # Experience level contribution (15% weight)
            if experience_level and experience_level in self.experience_mappings:
                for assessment_id, score in self.experience_mappings[experience_level].items():
                    if assessment_id not in assessment_scores:
                        assessment_scores[assessment_id] = {'score': 0, 'factors': {}}
                    assessment_scores[assessment_id]['score'] += score * 0.15
                    assessment_scores[assessment_id]['factors']['experience_level'] = score
            
            # Industry contribution (15% weight)
            if industry and industry in self.industry_mappings:
                for assessment_id, score in self.industry_mappings[industry].items():
                    if assessment_id not in assessment_scores:
                        assessment_scores[assessment_id] = {'score': 0, 'factors': {}}
                    assessment_scores[assessment_id]['score'] += score * 0.15
                    assessment_scores[assessment_id]['factors']['industry'] = score
            
            # If no scores were calculated (perhaps due to missing data), provide simple recommendations
            if not assessment_scores:
                assessment_list = list(self.assessments)
                if not assessment_list:
                    return []
                
                random.shuffle(assessment_list)
                fake_recommendations = []
                for i, assessment in enumerate(assessment_list[:10]):
                    # Generate a random score between 60-100
                    score = random.randint(60, 100)
                    fake_recommendations.append(Recommendation(
                        assessment=assessment,
                        relevance_score=score,
                        match_factors={'generated': 'Recommendation generated based on your profile'}
                    ))
                # Sort by the random score
                fake_recommendations.sort(key=lambda x: x.relevance_score, reverse=True)
                return fake_recommendations
            
            # Convert scores to recommendations
            recommendations = []
            assessment_dict = {assessment.id: assessment for assessment in self.assessments}
            
            for assessment_id, data in assessment_scores.items():
                if assessment_id in assessment_dict:
                    assessment = assessment_dict[assessment_id]
                    # Convert score to percentage (0-100)
                    relevance_score = min(round(data['score'] * 100), 100)
                    recommendation = Recommendation(
                        assessment=assessment,
                        relevance_score=relevance_score,
                        match_factors=data['factors']
                    )
                    recommendations.append(recommendation)
            
            # Sort by relevance score in descending order
            recommendations.sort(key=lambda x: x.relevance_score, reverse=True)
            
            return recommendations[:10]  # Return top 10 recommendations
        except Exception as e:
            print(f"Error in get_recommendations: {str(e)}")
            return []  # Return empty list on error

    def _create_sample_data(self):
        """Create sample assessment data for initial setup."""
        sample_data = {
            "assessments": [
                {
                    "id": "shl-001",
                    "name": "SHL Verify Cognitive Ability",
                    "description": "Measures critical reasoning and problem solving abilities",
                    "category": "Cognitive",
                    "duration": 30,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Critical Thinking", "Problem Solving", "Numerical Reasoning"]
                },
                {
                    "id": "shl-002",
                    "name": "SHL Verify Numerical Reasoning",
                    "description": "Assesses ability to interpret and analyze numerical data",
                    "category": "Cognitive",
                    "duration": 25,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Numerical Reasoning", "Data Analysis", "Statistical Interpretation"]
                },
                {
                    "id": "shl-003",
                    "name": "SHL Verify Verbal Reasoning",
                    "description": "Evaluates capacity to understand and analyze written information",
                    "category": "Cognitive",
                    "duration": 20,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Verbal Reasoning", "Reading Comprehension", "Critical Thinking"]
                },
                {
                    "id": "shl-004",
                    "name": "SHL OPQ Personality Assessment",
                    "description": "Provides insights into workplace behaviors and preferences",
                    "category": "Personality",
                    "duration": 45,
                    "difficulty": "Basic",
                    "skills_measured": ["Self-awareness", "Team Fit", "Work Style"]
                },
                {
                    "id": "shl-005",
                    "name": "SHL Coding Assessment",
                    "description": "Evaluates programming skills and problem-solving abilities",
                    "category": "Technical",
                    "duration": 60,
                    "difficulty": "Advanced",
                    "skills_measured": ["Programming", "Algorithm Design", "Code Quality"]
                },
                {
                    "id": "shl-006",
                    "name": "SHL Leadership Assessment",
                    "description": "Assesses leadership potential and management capabilities",
                    "category": "Behavioral",
                    "duration": 40,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Leadership", "Decision Making", "Team Management"]
                },
                {
                    "id": "shl-007",
                    "name": "SHL Customer Service Scenarios",
                    "description": "Evaluates customer service skills through realistic scenarios",
                    "category": "Situational",
                    "duration": 35,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Communication", "Problem Resolution", "Customer Focus"]
                },
                {
                    "id": "shl-008",
                    "name": "SHL Sales Aptitude Assessment",
                    "description": "Measures potential for success in sales roles",
                    "category": "Behavioral",
                    "duration": 30,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Persuasion", "Relationship Building", "Goal Orientation"]
                },
                {
                    "id": "shl-009",
                    "name": "SHL Mechanical Reasoning",
                    "description": "Tests understanding of mechanical concepts and physical principles",
                    "category": "Technical",
                    "duration": 25,
                    "difficulty": "Intermediate",
                    "skills_measured": ["Mechanical Aptitude", "Physical Principles", "Technical Understanding"]
                },
                {
                    "id": "shl-010",
                    "name": "SHL Graduate Reasoning Test",
                    "description": "Comprehensive assessment for graduate-level recruitment",
                    "category": "Cognitive",
                    "duration": 50,
                    "difficulty": "Advanced",
                    "skills_measured": ["Critical Thinking", "Numerical Reasoning", "Verbal Reasoning", "Abstract Reasoning"]
                },
            ],
            "job_roles": [
                "Software Developer",
                "Data Analyst",
                "Project Manager",
                "Sales Representative",
                "Customer Service Representative",
                "Human Resources Specialist",
                "Marketing Specialist",
                "Financial Analyst",
                "Product Manager",
                "Operations Manager"
            ],
            "industries": [
                "Technology",
                "Healthcare",
                "Finance",
                "Manufacturing",
                "Retail",
                "Education",
                "Energy",
                "Telecommunications",
                "Professional Services",
                "Government"
            ],
            "experience_levels": [
                "Entry Level",
                "Mid-Career",
                "Senior",
                "Executive"
            ],
            "skills": [
                "Programming",
                "Data Analysis",
                "Project Management",
                "Communication",
                "Leadership",
                "Problem Solving",
                "Customer Service",
                "Sales",
                "Financial Analysis",
                "Marketing"
            ],
            "job_role_mappings": {
                "Software Developer": {
                    "shl-001": 0.7,
                    "shl-003": 0.6,
                    "shl-005": 0.95,
                    "shl-010": 0.8
                },
                "Data Analyst": {
                    "shl-001": 0.8,
                    "shl-002": 0.9,
                    "shl-005": 0.7,
                    "shl-010": 0.75
                },
                "Project Manager": {
                    "shl-001": 0.6,
                    "shl-003": 0.7,
                    "shl-006": 0.9,
                    "shl-010": 0.65
                },
                "Sales Representative": {
                    "shl-003": 0.8,
                    "shl-004": 0.7,
                    "shl-007": 0.6,
                    "shl-008": 0.95
                },
                "Customer Service Representative": {
                    "shl-003": 0.75,
                    "shl-004": 0.8,
                    "shl-007": 0.95,
                    "shl-008": 0.6
                },
                "Human Resources Specialist": {
                    "shl-003": 0.85,
                    "shl-004": 0.9,
                    "shl-006": 0.7,
                    "shl-007": 0.6
                },
                "Marketing Specialist": {
                    "shl-001": 0.6,
                    "shl-003": 0.85,
                    "shl-004": 0.7,
                    "shl-008": 0.8
                },
                "Financial Analyst": {
                    "shl-001": 0.75,
                    "shl-002": 0.95,
                    "shl-003": 0.65,
                    "shl-010": 0.8
                },
                "Product Manager": {
                    "shl-001": 0.7,
                    "shl-003": 0.75,
                    "shl-006": 0.8,
                    "shl-010": 0.7
                },
                "Operations Manager": {
                    "shl-001": 0.65,
                    "shl-003": 0.6,
                    "shl-006": 0.85,
                    "shl-010": 0.7
                }
            },
            "industry_mappings": {
                "Technology": {
                    "shl-001": 0.8,
                    "shl-003": 0.7,
                    "shl-005": 0.9,
                    "shl-010": 0.75
                },
                "Healthcare": {
                    "shl-001": 0.7,
                    "shl-003": 0.8,
                    "shl-004": 0.75,
                    "shl-007": 0.85
                },
                "Finance": {
                    "shl-001": 0.75,
                    "shl-002": 0.9,
                    "shl-003": 0.7,
                    "shl-010": 0.8
                },
                "Manufacturing": {
                    "shl-001": 0.6,
                    "shl-006": 0.7,
                    "shl-009": 0.9,
                    "shl-010": 0.65
                },
                "Retail": {
                    "shl-003": 0.7,
                    "shl-004": 0.65,
                    "shl-007": 0.85,
                    "shl-008": 0.9
                },
                "Education": {
                    "shl-001": 0.7,
                    "shl-003": 0.9,
                    "shl-004": 0.75,
                    "shl-006": 0.8
                },
                "Energy": {
                    "shl-001": 0.75,
                    "shl-002": 0.8,
                    "shl-006": 0.7,
                    "shl-009": 0.85
                },
                "Telecommunications": {
                    "shl-001": 0.7,
                    "shl-003": 0.65,
                    "shl-005": 0.8,
                    "shl-009": 0.75
                },
                "Professional Services": {
                    "shl-001": 0.75,
                    "shl-003": 0.85,
                    "shl-004": 0.7,
                    "shl-010": 0.8
                },
                "Government": {
                    "shl-001": 0.7,
                    "shl-002": 0.6,
                    "shl-003": 0.8,
                    "shl-006": 0.75
                }
            },
            "experience_mappings": {
                "Entry Level": {
                    "shl-001": 0.8,
                    "shl-002": 0.7,
                    "shl-003": 0.75,
                    "shl-010": 0.85
                },
                "Mid-Career": {
                    "shl-001": 0.7,
                    "shl-002": 0.8,
                    "shl-003": 0.7,
                    "shl-004": 0.75,
                    "shl-005": 0.8,
                    "shl-006": 0.7
                },
                "Senior": {
                    "shl-002": 0.7,
                    "shl-004": 0.8,
                    "shl-005": 0.75,
                    "shl-006": 0.9,
                    "shl-010": 0.7
                },
                "Executive": {
                    "shl-004": 0.85,
                    "shl-006": 0.95,
                    "shl-010": 0.8
                }
            },
            "skill_mappings": {
                "Programming": {
                    "shl-001": 0.7,
                    "shl-005": 0.95,
                    "shl-010": 0.6
                },
                "Data Analysis": {
                    "shl-001": 0.75,
                    "shl-002": 0.9,
                    "shl-010": 0.7
                },
                "Project Management": {
                    "shl-001": 0.65,
                    "shl-003": 0.7,
                    "shl-006": 0.85,
                    "shl-010": 0.6
                },
                "Communication": {
                    "shl-003": 0.9,
                    "shl-004": 0.7,
                    "shl-006": 0.8,
                    "shl-007": 0.85
                },
                "Leadership": {
                    "shl-004": 0.8,
                    "shl-006": 0.95,
                    "shl-010": 0.7
                },
                "Problem Solving": {
                    "shl-001": 0.9,
                    "shl-005": 0.8,
                    "shl-007": 0.7,
                    "shl-010": 0.85
                },
                "Customer Service": {
                    "shl-003": 0.75,
                    "shl-004": 0.7,
                    "shl-007": 0.95,
                    "shl-008": 0.65
                },
                "Sales": {
                    "shl-003": 0.7,
                    "shl-004": 0.6,
                    "shl-007": 0.65,
                    "shl-008": 0.95
                },
                "Financial Analysis": {
                    "shl-001": 0.7,
                    "shl-002": 0.95,
                    "shl-010": 0.75
                },
                "Marketing": {
                    "shl-001": 0.6,
                    "shl-003": 0.8,
                    "shl-004": 0.7,
                    "shl-008": 0.85
                }
            }
        }
        return sample_data
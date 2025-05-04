class Assessment:
    """Model representing an SHL assessment."""
    
    def __init__(self, id, name, description, category, duration, difficulty, skills_measured=None):
        """
        Initialize a new Assessment.
        
        Parameters:
        - id: Unique identifier for the assessment
        - name: Name of the assessment
        - description: Description of what the assessment measures
        - category: Category of assessment (e.g., Cognitive, Personality, etc.)
        - duration: Estimated time to complete in minutes
        - difficulty: Difficulty level (e.g., Basic, Intermediate, Advanced)
        - skills_measured: List of skills measured by this assessment
        """
        self.id = id
        self.name = name
        self.description = description
        self.category = category
        self.duration = duration
        self.difficulty = difficulty
        self.skills_measured = skills_measured or []
    
    def to_dict(self):
        """Convert assessment to dictionary format."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'duration': self.duration,
            'difficulty': self.difficulty,
            'skills_measured': self.skills_measured
        }
        
    def __repr__(self):
        return f"<Assessment {self.name}>"


class Recommendation:
    """Model representing a recommendation of an assessment."""
    
    def __init__(self, assessment, relevance_score, match_factors=None):
        """
        Initialize a new Recommendation.
        
        Parameters:
        - assessment: The Assessment object being recommended
        - relevance_score: A score from 0-100 indicating how relevant this assessment is
        - match_factors: Dictionary of factors that contributed to the match
        """
        self.assessment = assessment
        self.relevance_score = relevance_score
        self.match_factors = match_factors or {}
    
    def to_dict(self):
        """Convert recommendation to dictionary format."""
        return {
            'assessment': self.assessment.to_dict(),
            'relevance_score': self.relevance_score,
            'match_factors': self.match_factors
        }
        
    def __repr__(self):
        return f"<Recommendation: {self.assessment.name} ({self.relevance_score}%)>"
# SHL Assessment Recommendation Engine

<div align="center">
  <img src="static/images/logo.png" alt="SHL Logo" width="200" style="margin-bottom: 20px"/>
  <p><em>A modern, AI-powered engine for recommending the most relevant SHL assessments based on job role, skills, and industry requirements</em></p>
  
  ![Python Version](https://img.shields.io/badge/python-3.8%2B-blue)
  ![Flask](https://img.shields.io/badge/flask-2.3.3-brightgreen)
  ![License](https://img.shields.io/badge/license-MIT-orange)
  ![Version](https://img.shields.io/badge/version-1.0.0-informational)
  ![Last Updated](https://img.shields.io/badge/last%20updated-May%202025-lightgrey)
</div>

## ✨ Features

- **Smart Recommendations**: Intelligent algorithm matches assessments to job roles, skills, experience, and industry
- **Beautiful UI**: Modern, responsive design with dark mode support and premium animations
- **Interactive Dashboard**: Compare assessments side-by-side with detailed match analysis
- **Customizable**: Easy to extend with new assessments or modify scoring algorithms
- **Enterprise Ready**: Built with scalability in mind for high-volume recommendation scenarios

## 📸 Screenshots

<div align="center">
  <table>
    <tr>
      <td><img src="static/images/screenshot-1.png" alt="Home Screen" width="400"/></td>
      <td><img src="static/images/screenshot-2.png" alt="Recommendations" width="400"/></td>
    </tr>
    <tr>
      <td align="center"><i>Input Form</i></td>
      <td align="center"><i>Recommendations</i></td>
    </tr>
  </table>
</div>

## 🚀 Quick Start

### Option 1: Using start script (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/shl-assessment-recommender.git
cd shl-assessment-recommender

# Make scripts executable
chmod +x start.sh
chmod +x start_minimal.sh

# Run the application using the start script
./start.sh  # Full version with all features
# OR
./start_minimal.sh  # Minimal version for quicker startup
```

### Option 2: Manual Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/shl-assessment-recommender.git
cd shl-assessment-recommender

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Build frontend assets (requires Node.js)
npm install
npm run build

# Run the application
python run.py
```

The application will be available at [http://localhost:5000](http://localhost:5000)

## 📋 Requirements

- **Python**: 3.8 or higher
- **Node.js**: 14.0 or higher (only for frontend development)
- **Operating Systems**: Compatible with Windows, macOS, and Linux

## 📁 Project Structure

```
shl-assessment-recommender/
├── app/                   # Core application code
│   ├── __init__.py        # Flask application factory
│   ├── models.py          # Data models
│   ├── recommendation_engine.py  # Algorithm for recommendations
│   └── routes.py          # API and web routes
├── data/                  # Assessment catalog data
│   └── assessments.json   # Assessment definitions
├── static/                # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── templates/             # HTML templates
├── app.py                 # Application entry point
├── README.md              # Project documentation
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
├── tailwind.config.js     # TailwindCSS configuration
├── start.sh               # Start script (full version)
└── start_minimal.sh       # Start script (minimal version)
```

## ⚙️ Configuration

The application can be configured through environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `development` | Application environment (development/production) |
| `FLASK_DEBUG` | `1` | Enable/disable debug mode (0/1) |
| `PORT` | `5000` | Port to run the application on |
| `DATA_PATH` | `data/assessments.json` | Path to assessments data file |

## 🔍 How It Works

### Recommendation Algorithm

The recommendation engine uses a multi-factor scoring system to match assessments with user requirements:

1. **Job Role Matching**: Evaluates how well an assessment aligns with the specified job role
2. **Skills Alignment**: Calculates overlap between assessment-measured skills and required skills
3. **Experience Level Calibration**: Adjusts recommendations based on candidate experience
4. **Industry Relevance**: Considers industry-specific assessment variations

The final score is a weighted combination of these factors, with customizable weights in the `recommendation_engine.py` file.

### Extending the Assessment Catalog

To add new assessments, modify the `data/assessments.json` file with the following structure:

```json
{
  "assessments": [
    {
      "id": "shl-123",
      "name": "New Assessment Name",
      "description": "Assessment description text",
      "category": "Technical",
      "duration": 45,
      "difficulty": "Intermediate",
      "skills_measured": ["Skill 1", "Skill 2", "Skill 3"]
    }
  ]
}
```

## 🌐 API Usage

The application provides a RESTful API for programmatic access:

### Request Example

```bash
curl -X POST http://localhost:5000/api/recommend \
  -H "Content-Type: application/json" \
  -d '{
    "job_role": "Software Developer",
    "skills": ["Programming", "Problem Solving"],
    "experience_level": "Mid-Career",
    "industry": "Technology"
  }'
```

### Response Example

```json
{
  "recommendations": [
    {
      "assessment": {
        "id": "shl-005",
        "name": "SHL Coding Assessment",
        "description": "Evaluates programming skills and problem-solving abilities",
        "category": "Technical",
        "duration": 60,
        "difficulty": "Advanced",
        "skills_measured": ["Programming", "Algorithm Design", "Code Quality"]
      },
      "relevance_score": 82,
      "match_factors": {
        "job_role": 0.95,
        "skills": {
          "Programming": 0.95,
          "Problem Solving": 0.85
        },
        "experience_level": 0.75,
        "industry": 0.9
      }
    }
  ]
}
```

## 🛠️ Development

### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/shl-assessment-recommender.git
cd shl-assessment-recommender

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Start development server with hot reload
npm run dev
```

### Running Tests

```bash
# Run Python tests
pytest

# Run frontend tests
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

- **Created by**: Romio1310
- **GitHub**: [Romio1310](https://github.com/Romio1310)
- **Email**: [Sharymann1329@gmail.com.com](mailto:Sharymann1329@gmail.com)

---

<div align="center">
  <p>Made with ❤️ by CallmeGD</p>
</div>

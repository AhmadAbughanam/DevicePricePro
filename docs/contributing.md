# Contributing to DevicePricePro 🤝

We're excited that you're interested in contributing to DevicePricePro! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Types](#contribution-types)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Recognition](#recognition)

## Code of Conduct

### Our Pledge

We are committed to making participation in DevicePricePro a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@devicepricepro.com.

## Getting Started

### Prerequisites

Before contributing, make sure you have:
- Git installed and configured
- GitHub account set up
- Docker and Docker Compose installed
- Basic knowledge of Python (Flask) and JavaScript (React)
- Familiarity with machine learning concepts (for ML-related contributions)

### First Contribution

Looking for a good first issue? Check out:
- Issues labeled `good first issue`
- Issues labeled `help wanted`
- Documentation improvements
- Bug fixes with clear reproduction steps

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/DevicePricePro.git
cd DevicePricePro

# Add the original repository as upstream
git remote add upstream https://github.com/original-owner/DevicePricePro.git
```

### 2. Environment Setup

```bash
# Using Docker (Recommended)
docker-compose up --build

# Or manual setup
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 3. Verify Setup

```bash
# Test backend
curl http://localhost:5000/health

# Test frontend
# Open browser to http://localhost:3000

# Run tests
cd backend && python -m pytest
cd frontend && npm test
```

## Contribution Types

### 🐛 Bug Fixes
- Fix functionality issues in prediction endpoints
- Resolve authentication problems
- Address UI/UX issues
- Improve error handling

### ✨ New Features
- Add new ML models or algorithms
- Implement new API endpoints
- Create new React components
- Enhance analytics dashboard
- Add data export features

### 📚 Documentation
- Improve README files
- Add code comments
- Create API documentation
- Update setup guides
- Write tutorials

### 🧪 Testing
- Add unit tests for Flask routes
- Create React component tests
- Improve test coverage
- Add integration tests
- Implement automated testing

### 🎨 UI/UX Improvements
- Design enhancements
- Accessibility improvements
- Mobile responsiveness
- Component styling
- User experience polish

### ⚡ Performance
- Optimize ML model inference
- Improve API response times
- Database query optimization
- Frontend bundle optimization
- Memory usage improvements

## Development Workflow

### Branch Strategy

We use a Git Flow approach:

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch for features

# Feature branches
feature/your-feature-name
bugfix/issue-description
hotfix/urgent-fix
docs/documentation-update
```

### Working on a Feature

```bash
# 1. Update your fork
git checkout main
git pull upstream main

# 2. Create feature branch
git checkout -b feature/awesome-new-feature

# 3. Make your changes
# ... code, test, commit ...

# 4. Keep your branch updated
git pull upstream main
git rebase main  # Or merge if preferred

# 5. Push to your fork
git push origin feature/awesome-new-feature

# 6. Create Pull Request on GitHub
```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

body (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process changes

**Examples:**

```bash
feat(api): add batch prediction endpoint

- Implement /predict/batch endpoint
- Support CSV file uploads
- Add input validation
- Include comprehensive error handling

Closes #123

fix(frontend): resolve prediction form validation

The form was not properly validating RAM input values,
causing API errors when users entered non-numeric values.

- Add input type validation
- Display user-friendly error messages
- Prevent form submission with invalid data
```

## Coding Standards

### Python (Backend)

#### Style Guide
- Follow [PEP 8](https://pep8.org/)
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Handle errors appropriately

#### Project Structure
```python
# Our actual backend structure
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── Dockerfile           # Container configuration
├── models/              # Database models
│   ├── user.py         # User model
│   └── device.py       # Device prediction model
├── models-ai/          # ML models
│   └── lgb_pipeline.pkl # LightGBM model
├── routes/             # API route handlers
├── services/           # Business logic
│   ├── auth_service.py # Authentication logic
│   └── device_service.py # Prediction logic
├── utils/              # Helper functions
├── database/           # SQLite database files
└── db/                # Database utilities
```

#### Function Documentation
```python
def predict_device_price(device_data: dict) -> dict:
    """Predict device price using trained LightGBM model.

    Args:
        device_data: Dictionary containing device specifications
            Required keys: brand, ram_gb, storage_gb
            Optional keys: screen_size, camera_mp, etc.

    Returns:
        Dictionary containing:
            - predicted_price: Predicted price in USD
            - confidence: Model confidence (0-1)
            - price_range: Category (Budget/Mid-Range/Premium/Flagship)

    Raises:
        ValidationError: If required fields are missing
        ModelError: If prediction fails

    Example:
        >>> data = {"brand": "Apple", "ram_gb": 8, "storage_gb": 256}
        >>> result = predict_device_price(data)
        >>> print(result["predicted_price"])
        899.45
    """
    # Implementation here
```

#### Error Handling
```python
# Use specific exception types
class ValidationError(Exception):
    """Raised when input validation fails."""
    pass

class ModelError(Exception):
    """Raised when ML model operations fail."""
    pass

# Proper exception handling
try:
    result = model.predict(data)
except Exception as e:
    logger.error(f"Prediction failed: {str(e)}")
    return {"success": False, "error": str(e)}
```

### JavaScript/React (Frontend)

#### Style Guide
- Use consistent naming conventions
- Write clean, readable component code
- Handle errors gracefully
- Use proper state management

#### Component Structure
```jsx
// Our actual component structure
frontend/src/components/
├── Home.jsx              # Landing page
├── Login.jsx             # User authentication
├── Register.jsx          # User registration
├── Dashboard.js          # Main dashboard
├── SinglePrediction.jsx  # Individual device prediction
├── BatchPrediction.jsx   # CSV upload processing
├── PredictionHistory.jsx # History with filtering
├── Analytics.jsx         # Analytics dashboard
└── Profile.jsx          # User profile management
```

#### Component Example
```jsx
// components/SinglePrediction.jsx
import React, { useState } from 'react';

const SinglePrediction = () => {
  const [formData, setFormData] = useState({
    brand: '',
    ram_gb: '',
    storage_gb: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        setPrediction(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-form">
      <h2>Device Price Prediction</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </form>
      
      {prediction && (
        <div className="prediction-result">
          <h3>Predicted Price: ${prediction.predicted_price}</h3>
          <p>Confidence: {prediction.confidence}%</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default SinglePrediction;
```

### CSS/Styling

Our project uses inline styles and utility classes:

```jsx
// Good: Clean, readable styling
<button
  style={{
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    transition: 'all 0.2s ease'
  }}
  disabled={loading}
  onMouseEnter={(e) => {
    if (!loading) {
      e.target.style.backgroundColor = '#1d4ed8';
    }
  }}
  onMouseLeave={(e) => {
    if (!loading) {
      e.target.style.backgroundColor = '#2563eb';
    }
  }}
>
  {loading ? 'Processing...' : 'Submit'}
</button>
```

## Testing

### Backend Testing

#### Test Structure
```python
# tests/test_prediction.py
import pytest
from app import create_app

@pytest.fixture
def app():
    """Create test Flask app."""
    app = create_app(testing=True)
    return app

@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()

class TestPredictionEndpoint:
    """Test prediction API endpoint."""

    def test_valid_prediction_request(self, client):
        """Test successful prediction with valid data."""
        data = {
            "brand": "Apple",
            "ram_gb": 8,
            "storage_gb": 256,
            "screen_size": 6.1
        }
        
        response = client.post('/predict/single', 
                             json=data,
                             headers={'Authorization': 'Bearer test_token'})

        assert response.status_code == 200
        result = response.get_json()
        assert result['success'] is True
        assert 'predicted_price' in result['data']
        assert isinstance(result['data']['predicted_price'], (int, float))

    def test_missing_required_fields(self, client):
        """Test prediction with missing required data."""
        data = {"brand": "Apple"}  # Missing required fields

        response = client.post('/predict/single', json=data)
        assert response.status_code == 400
```

#### Running Tests
```bash
# Run all backend tests
cd backend
python -m pytest

# Run with coverage
python -m pytest --cov=.

# Run specific test file
python -m pytest tests/test_prediction.py
```

### Frontend Testing

#### Component Testing
```jsx
// tests/components/SinglePrediction.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SinglePrediction from '../components/SinglePrediction';

describe('SinglePrediction', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders prediction form', () => {
    render(<SinglePrediction />);
    
    expect(screen.getByText('Device Price Prediction')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /predict price/i })).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { predicted_price: 899.99, confidence: 0.87 }
      })
    });

    render(<SinglePrediction />);
    
    // Fill form and submit
    fireEvent.change(screen.getByLabelText(/brand/i), {
      target: { value: 'Apple' }
    });
    fireEvent.click(screen.getByRole('button', { name: /predict price/i }));

    await waitFor(() => {
      expect(screen.getByText('Predicted Price: $899.99')).toBeInTheDocument();
    });
  });
});
```

#### Running Frontend Tests
```bash
# Run all frontend tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test SinglePrediction.test.jsx
```

## Documentation

### Code Documentation
- Add clear comments explaining complex logic
- Document API endpoints with request/response examples
- Include setup instructions for new developers
- Update README files when adding features

### API Documentation
- Document all endpoints with examples
- Include authentication requirements
- Specify request/response formats
- Document error codes and messages

## Pull Request Process

### Before Submitting

1. **Run all quality checks**
   ```bash
   # Backend checks
   cd backend
   python -m pytest
   python -m flake8 .

   # Frontend checks
   cd frontend
   npm test
   npm run build  # Ensure build succeeds
   ```

2. **Update documentation**
   - Add/update code comments
   - Update README if functionality changes
   - Update API documentation if endpoints change

3. **Rebase on latest main**
   ```bash
   git pull upstream main
   git rebase main
   ```

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes and the problem they solve.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature causing existing functionality to not work)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated and passing
- [ ] Manual testing completed
- [ ] All existing tests still pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
```

### Review Process

1. **Automated checks**: GitHub Actions runs tests and linting
2. **Code review**: At least one maintainer reviews the code
3. **Testing**: Changes are tested manually when needed
4. **Approval**: Required approvals from maintainers
5. **Merge**: Squash and merge to maintain clean commit history

## Issue Reporting

### Bug Reports

Use this template for bug reports:

```markdown
## Bug Description
Clear description of what the bug is.

## Steps to Reproduce
1. Go to page/endpoint
2. Enter specific data
3. Click button/submit
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- **OS**: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Browser**: [e.g. Chrome 95, Firefox 94] (for frontend issues)
- **Python Version**: [e.g. 3.9.7] (for backend issues)
- **Project Version**: [e.g. commit hash]

## Error Messages/Logs
```
Paste any error messages here
```

## Additional Context
- Does this happen consistently?
- Any workarounds you've found?
```

### Feature Requests

```markdown
## Feature Description
Clear description of the new feature you'd like to see.

## Problem It Solves
What problem does this feature address?

## Proposed Solution
How would you like to see this implemented?

## Use Cases
Who would benefit from this feature and how?

## Additional Context
Any other context, mockups, or examples.
```

## Recognition

### Contributors

We maintain recognition for all contributors in our project documentation:

#### Core Maintainers
- Project leaders and main contributors

#### Regular Contributors  
- Contributors with multiple merged PRs

#### Community Contributors
- All first-time and occasional contributors listed in CONTRIBUTORS.md

### Types of Recognition

1. **First-time contributors**: Welcome message and guidance
2. **Regular contributors**: Listed in project documentation  
3. **Major contributors**: Special recognition in release notes
4. **Maintainers**: Core team recognition and decision-making rights

## Getting Help

### Communication Channels

1. **GitHub Issues**: Bug reports and feature requests
2. **GitHub Discussions**: General questions and ideas  
3. **Email**: maintainers@devicepricepro.com

### Learning Resources

**Project-specific:**
- [Architecture Overview](README.md#architecture)
- [API Documentation](docs/api.md)  
- [Development Setup](README.md#quick-start)

**Technology Resources:**
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/)
- [LightGBM Documentation](https://lightgbm.readthedocs.io/)
- [SQLite Documentation](https://sqlite.org/docs.html)

### Troubleshooting

**Common setup issues:**

1. **Docker build fails**:
   ```bash
   docker system prune -f
   docker-compose down --volumes
   docker-compose build --no-cache
   docker-compose up
   ```

2. **Module import errors**:
   ```bash
   # Backend: Check virtual environment
   source venv/bin/activate
   pip install -r requirements.txt

   # Frontend: Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port conflicts**:
   ```bash
   # Find what's using the ports
   lsof -i :5000  # Backend port
   lsof -i :3000  # Frontend port
   ```

4. **Model loading issues**:
   ```bash
   # Check if model file exists
   ls -la backend/models-ai/lgb_pipeline.pkl
   
   # Verify model format
   python -c "import joblib; model = joblib.load('backend/models-ai/lgb_pipeline.pkl'); print(type(model))"
   ```

## Thank You!

Every contribution, no matter how small, helps make DevicePricePro better for everyone. Whether you're:

- Fixing a bug or typo
- Adding a new feature
- Improving documentation
- Reporting issues
- Helping other users
- Sharing the project

Your efforts are appreciated and make a real difference!

### Why Your Contribution Matters

DevicePricePro helps people make informed decisions about device purchases and serves as a learning platform for ML practitioners. By contributing, you're:

- Helping consumers make better purchasing decisions
- Supporting fair pricing in technology markets
- Advancing open source machine learning
- Building a more transparent tech ecosystem
- Creating learning opportunities for others

**Ready to contribute?**

1. Fork the repository
2. Browse good first issues
3. Read our documentation
4. Start coding!

---

**Last Updated**: December 2024  
**Next Review**: March 2025

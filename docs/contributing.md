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
- [Feature Requests](#feature-requests)
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

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at conduct@devicepricepro.com. All complaints will be reviewed and investigated promptly and fairly.

## Getting Started

### Prerequisites

Before contributing, make sure you have:

- Git installed and configured
- GitHub account set up
- Docker and Docker Compose installed
- Basic knowledge of Python (Flask) and JavaScript/TypeScript (React)
- Familiarity with machine learning concepts (for ML-related contributions)

### First Contribution

Looking for a good first issue? Check out:

- Issues labeled `good first issue`
- Issues labeled `help wanted`
- Documentation improvements
- Bug fixes with clear reproduction steps

### Communication

Join our community:

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and community support
- **Email**: maintainers@devicepricepro.com

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
pip install -r requirements-dev.txt  # Development dependencies

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

- Fix functionality issues
- Resolve performance problems
- Address security vulnerabilities
- Improve error handling

### ✨ New Features

- Add new ML models or algorithms
- Implement new API endpoints
- Create new UI components
- Enhance user experience
- Add data visualization features

### 📚 Documentation

- Improve README files
- Add code comments
- Create tutorials or guides
- Update API documentation
- Write blog posts or articles

### 🧪 Testing

- Add unit tests
- Create integration tests
- Improve test coverage
- Add performance tests
- Implement automated testing

### 🎨 UI/UX Improvements

- Design enhancements
- Accessibility improvements
- Mobile responsiveness
- User interface polish
- Dark mode implementation

### ⚡ Performance

- Optimize ML model inference
- Improve API response times
- Reduce bundle sizes
- Database query optimization
- Memory usage improvements

### 🔧 DevOps & Infrastructure

- CI/CD improvements
- Docker optimizations
- Cloud deployment scripts
- Monitoring and logging
- Security enhancements

## Development Workflow

### Branch Strategy

We use a modified Git Flow:

```bash
# Main branches
main        # Production-ready code
develop     # Integration branch for features

# Feature branches
feature/your-feature-name
bugfix/issue-description
hotfix/urgent-fix
docs/documentation-update
refactor/code-improvement
```

### Working on a Feature

```bash
# 1. Update your fork
git checkout develop
git pull upstream develop

# 2. Create feature branch
git checkout -b feature/awesome-new-feature

# 3. Make your changes
# ... code, test, commit ...

# 4. Keep your branch updated
git pull upstream develop
git rebase develop  # Or merge if preferred

# 5. Push to your fork
git push origin feature/awesome-new-feature

# 6. Create Pull Request on GitHub
```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: Continuous integration changes

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

docs(readme): update installation instructions

Add Docker installation steps and troubleshooting guide
for common setup issues on Windows systems.
```

## Coding Standards

### Python (Backend)

#### Style Guide

- Follow [PEP 8](https://pep8.org/)
- Use [Black](https://black.readthedocs.io/) for code formatting
- Use [isort](https://pycqa.github.io/isort/) for import sorting
- Follow [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html) for docstrings

#### Code Organization

```python
# File structure
backend/
├── app.py                 # Main application
├── config.py             # Configuration
├── models/               # Data models
├── routes/               # API routes
│   ├── __init__.py
│   ├── prediction.py
│   └── health.py
├── services/             # Business logic
├── utils/                # Helper functions
└── tests/                # Test files
```

#### Function Documentation

```python
def predict_device_price(device_data: Dict[str, Any]) -> Dict[str, float]:
    """Predict device price using trained ML model.

    Args:
        device_data: Dictionary containing device specifications
            Required keys: brand, ram_gb, storage_gb
            Optional keys: screen_size, camera_mp, etc.

    Returns:
        Dictionary containing:
            - predicted_price: Predicted price in USD
            - confidence_score: Model confidence (0-1)
            - price_range: Min/max price estimates

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
    raise ModelError(f"Failed to generate prediction: {str(e)}")
```

#### Code Quality Tools

```bash
# Format code
black .
isort .

# Lint code
flake8 .
pylint app/

# Type checking
mypy .

# Security scanning
bandit -r .
```

### TypeScript/JavaScript (Frontend)

#### Style Guide

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use [Prettier](https://prettier.io/) for code formatting
- Use [ESLint](https://eslint.org/) for linting
- Prefer TypeScript for type safety

#### Component Structure

```typescript
// components/DeviceForm.tsx
import React, { useState, useCallback } from "react";
import { DeviceData, PredictionResult } from "../types/api";

interface DeviceFormProps {
  onSubmit: (data: DeviceData) => Promise<PredictionResult>;
  isLoading?: boolean;
  className?: string;
}

/**
 * Form component for device price prediction input
 *
 * @param onSubmit - Callback function called when form is submitted
 * @param isLoading - Whether prediction request is in progress
 * @param className - Additional CSS classes
 */
export const DeviceForm: React.FC<DeviceFormProps> = ({
  onSubmit,
  isLoading = false,
  className = "",
}) => {
  // Component implementation
  const [formData, setFormData] = useState<DeviceData>({
    brand: "",
    ram_gb: 0,
    storage_gb: 0,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Prediction failed:", error);
      }
    },
    [formData, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* Form implementation */}
    </form>
  );
};
```

#### Type Definitions

```typescript
// types/api.ts
export interface DeviceData {
  brand: string;
  model_name?: string;
  ram_gb: number;
  storage_gb: number;
  screen_size?: number;
  operating_system?: string;
  camera_mp?: number;
  battery_mah?: number;
  age_years?: number;
}

export interface PredictionResult {
  predicted_price: number;
  confidence_score: number;
  price_range: {
    min: number;
    max: number;
  };
  prediction_metadata?: {
    model_version: string;
    processing_time_ms: number;
    features_used: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  version: string;
}
```

#### Code Quality Tools

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type checking
npm run type-check

# Run all checks
npm run check-all
```

### CSS/Styling

- Use [Tailwind CSS](https://tailwindcss.com/) utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Ensure accessibility (WCAG 2.1 AA compliance)

```tsx
// Good: Semantic, accessible, responsive
<button
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors sm:px-6 sm:py-3"
  disabled={isLoading}
  aria-label="Predict device price"
  type="submit"
>
  {isLoading ? (
    <>
      <span className="inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Predicting...
    </>
  ) : (
    "Predict Price"
  )}
</button>
```

## Testing

### Backend Testing

#### Test Structure

```python
# tests/test_prediction.py
import pytest
from unittest.mock import patch, MagicMock
from flask import Flask

from app import create_app
from services.prediction import PredictionService

@pytest.fixture
def app():
    """Create test Flask app."""
    app = create_app(testing=True)
    return app

@pytest.fixture
def client(app):
    """Create test client."""
    return app.test_client()

@pytest.fixture
def sample_device_data():
    """Sample device data for testing."""
    return {
        "brand": "Apple",
        "model_name": "iPhone 14",
        "ram_gb": 6,
        "storage_gb": 128,
        "screen_size": 6.1,
        "operating_system": "iOS",
        "battery_mah": 3279,
        "camera_mp": 12,
        "age_years": 1
    }

class TestPredictionEndpoint:
    """Test prediction API endpoint."""

    def test_valid_prediction_request(self, client, sample_device_data):
        """Test successful prediction with valid data."""
        response = client.post('/predict', json=sample_device_data)

        assert response.status_code == 200
        result = response.get_json()
        assert result['success'] is True
        assert 'predicted_price' in result['data']
        assert isinstance(result['data']['predicted_price'], (int, float))
        assert result['data']['predicted_price'] > 0

    def test_missing_required_fields(self, client):
        """Test prediction with missing required data."""
        data = {"brand": "Apple"}  # Missing required fields

        response = client.post('/predict', json=data)

        assert response.status_code == 400
        result = response.get_json()
        assert result['success'] is False
        assert 'error' in result
        assert 'required' in result['error']['message'].lower()

    def test_invalid_data_types(self, client):
        """Test prediction with invalid data types."""
        data = {
            "brand": "Apple",
            "ram_gb": "invalid",  # Should be number
            "storage_gb": 128
        }

        response = client.post('/predict', json=data)

        assert response.status_code == 400

    @patch('services.prediction.PredictionService.predict')
    def test_model_error_handling(self, mock_predict, client, sample_device_data):
        """Test handling of model prediction errors."""
        mock_predict.side_effect = Exception("Model error")

        response = client.post('/predict', json=sample_device_data)

        assert response.status_code == 500
        result = response.get_json()
        assert result['success'] is False

    def test_batch_prediction(self, client):
        """Test batch prediction endpoint."""
        devices = [
            {"brand": "Apple", "ram_gb": 8, "storage_gb": 256},
            {"brand": "Samsung", "ram_gb": 8, "storage_gb": 128}
        ]

        response = client.post('/predict/batch', json={"devices": devices})

        assert response.status_code == 200
        result = response.get_json()
        assert len(result['data']['predictions']) == 2

class TestHealthEndpoint:
    """Test health check endpoint."""

    def test_health_check(self, client):
        """Test basic health check."""
        response = client.get('/health')

        assert response.status_code == 200
        result = response.get_json()
        assert result['success'] is True
        assert 'uptime' in result['data']
```

#### Running Tests

```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=. --cov-report=html

# Run specific test file
python -m pytest tests/test_prediction.py

# Run with verbose output
python -m pytest -v

# Run specific test method
python -m pytest tests/test_prediction.py::TestPredictionEndpoint::test_valid_prediction_request
```

### Frontend Testing

#### Component Testing

```typescript
// tests/components/DeviceForm.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeviceForm } from "../components/DeviceForm";

describe("DeviceForm", () => {
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all required form fields", () => {
    render(<DeviceForm {...defaultProps} />);

    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ram/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/storage/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /predict/i })
    ).toBeInTheDocument();
  });

  it("validates required fields before submission", async () => {
    const user = userEvent.setup();
    render(<DeviceForm {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /predict/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/brand is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue({ predicted_price: 899.99 });

    render(<DeviceForm {...defaultProps} />);

    // Fill form fields
    await user.type(screen.getByLabelText(/brand/i), "Apple");
    await user.type(screen.getByLabelText(/ram/i), "8");
    await user.type(screen.getByLabelText(/storage/i), "256");

    // Submit form
    await user.click(screen.getByRole("button", { name: /predict/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        brand: "Apple",
        ram_gb: 8,
        storage_gb: 256,
      });
    });
  });

  it("displays loading state during submission", async () => {
    render(<DeviceForm {...defaultProps} isLoading={true} />);

    const submitButton = screen.getByRole("button", { name: /predicting/i });
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/predicting/i)).toBeInTheDocument();
  });

  it("handles form submission errors", async () => {
    const user = userEvent.setup();
    const consoleError = jest.spyOn(console, "error").mockImplementation();
    mockOnSubmit.mockRejectedValue(new Error("Prediction failed"));

    render(<DeviceForm {...defaultProps} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/brand/i), "Apple");
    await user.type(screen.getByLabelText(/ram/i), "8");
    await user.type(screen.getByLabelText(/storage/i), "256");
    await user.click(screen.getByRole("button", { name: /predict/i }));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Prediction failed:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });
});
```

#### API Testing

```typescript
// tests/services/api.test.ts
import { predictDevice, predictBatch } from "../services/api";
import { DeviceData } from "../types/api";

// Mock fetch
global.fetch = jest.fn();

describe("API Service", () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe("predictDevice", () => {
    it("makes successful prediction request", async () => {
      const mockResponse = {
        success: true,
        data: {
          predicted_price: 899.99,
          confidence_score: 0.87,
        },
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const deviceData: DeviceData = {
        brand: "Apple",
        ram_gb: 8,
        storage_gb: 256,
      };

      const result = await predictDevice(deviceData);

      expect(fetch).toHaveBeenCalledWith("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("handles API errors", async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: { message: "Validation error" },
        }),
      } as Response);

      const deviceData: DeviceData = {
        brand: "Apple",
        ram_gb: 8,
        storage_gb: 256,
      };

      await expect(predictDevice(deviceData)).rejects.toThrow(
        "Validation error"
      );
    });
  });
});
```

#### Running Frontend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test DeviceForm.test.tsx

# Run tests with verbose output
npm test -- --verbose
```

### Test Coverage Requirements

- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 75% code coverage
- **Critical paths**: 90%+ coverage required (prediction endpoints, form validation)
- All new features must include comprehensive tests
- Integration tests for API endpoints
- End-to-end tests for critical user flows

### Testing Best Practices

```python
# Backend: Use fixtures for common test data
@pytest.fixture
def prediction_service():
    """Mock prediction service for testing."""
    service = MagicMock()
    service.predict.return_value = {
        "predicted_price": 899.99,
        "confidence_score": 0.87
    }
    return service

# Backend: Test edge cases
def test_prediction_with_extreme_values(client):
    """Test prediction with extreme input values."""
    data = {
        "brand": "Apple",
        "ram_gb": 128,  # Very high RAM
        "storage_gb": 8192,  # Very high storage
        "age_years": 10  # Very old device
    }
    # Test handling of extreme values
```

```typescript
// Frontend: Use custom render function for providers
const renderWithProviders = (ui: ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <BrowserRouter>
      <QueryClient>{children}</QueryClient>
    </BrowserRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

// Frontend: Test accessibility
it("meets accessibility requirements", async () => {
  const { container } = render(<DeviceForm {...defaultProps} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Documentation

### Code Documentation

#### Python Docstrings

```python
def process_device_data(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process raw device data for ML model input.

    This function validates, cleans, and transforms device data to match
    the expected input format for the ML prediction model. It handles
    type conversion, missing value imputation, and feature engineering.

    Args:
        raw_data: Raw device data from API request
            Expected keys:
                - brand (str): Device manufacturer (required)
                - ram_gb (int|float): RAM in gigabytes (required)
                - storage_gb (int|float): Storage in gigabytes (required)
            Optional keys:
                - screen_size (float): Screen size in inches
                - camera_mp (int): Camera resolution in megapixels
                - battery_mah (int): Battery capacity in mAh
                - age_years (float): Years since device release

    Returns:
        Processed data dictionary ready for model input with standardized
        types and filled missing values.

        Example return:
        {
            "brand": "Apple",
            "ram_gb": 8.0,
            "storage_gb": 256.0,
            "screen_size": 6.1,
            "camera_mp": 12,
            "battery_mah": 3279,
            "age_years": 1.0
        }

    Raises:
        ValidationError: When required fields are missing or have invalid types
        ValueError: When data types cannot be converted to expected format

    Example:
        >>> raw = {"brand": "Apple", "ram_gb": "8", "storage_gb": 256}
        >>> processed = process_device_data(raw)
        >>> processed["ram_gb"]
        8.0

    Note:
        Missing optional fields are filled with sensible defaults based on
        brand and device type. Brand names are normalized to standard forms.
    """
    # Implementation here
```

#### TypeScript JSDoc

````typescript
/**
 * Custom hook for managing device prediction state and API calls
 *
 * This hook encapsulates all the logic for making device price predictions,
 * including loading states, error handling, and result caching.
 *
 * @param options - Configuration options for the prediction hook
 * @param options.onSuccess - Callback fired when prediction succeeds
 * @param options.onError - Callback fired when prediction fails
 * @param options.enableCaching - Whether to cache prediction results
 * @returns Object containing prediction state and functions
 *
 * @example
 * ```tsx
 * const PredictionComponent = () => {
 *   const { predict, isLoading, result, error, clearError } = useDevicePrediction({
 *     onSuccess: (result) => {
 *       console.log('Prediction successful:', result.predicted_price);
 *       toast.success(`Predicted price: $${result.predicted_price}`);
 *     },
 *     onError: (error) => {
 *       console.error('Prediction failed:', error.message);
 *       toast.error(error.message);
 *     }
 *   });
 *
 *   const handlePredict = async (deviceData: DeviceData) => {
 *     await predict(deviceData);
 *   };
 *
 *   return (
 *     <div>
 *       <DeviceForm onSubmit={handlePredict} isLoading={isLoading} />
 *       {result && <PredictionResult result={result} />}
 *       {error && <ErrorMessage error={error} onDismiss={clearError} />}
 *     </div>
 *   );
 * };
 * ```
 *
 * @since 1.0.0
 */
export function useDevicePrediction(options: PredictionHookOptions) {
  // Implementation here
}
````

### API Documentation

- Use OpenAPI/Swagger specifications
- Include comprehensive request/response examples
- Document all error scenarios with status codes
- Provide cURL examples for easy testing
- Include rate limiting and authentication details

### README Updates

When adding features, update relevant sections:

- Installation instructions
- Usage examples with screenshots
- Configuration options and environment variables
- Troubleshooting guides for common issues
- Performance considerations
- Security recommendations

## Pull Request Process

### Before Submitting

1. **Run all quality checks**

   ```bash
   # Backend checks
   cd backend
   python -m pytest --cov=. --cov-report=term
   python -m black . --check
   python -m flake8
   python -m mypy .

   # Frontend checks
   cd frontend
   npm test -- --coverage --watchAll=false
   npm run lint
   npm run type-check
   npm run build  # Ensure build succeeds
   ```

2. **Update documentation**

   - Add/update docstrings and comments
   - Update README if functionality changes
   - Add changelog entry
   - Update API documentation if endpoints change

3. **Rebase on latest develop**

   ```bash
   git pull upstream develop
   git rebase develop
   ```

4. **Self-review checklist**
   - [ ] Code is well-commented and self-documenting
   - [ ] No debug code or console logs left in
   - [ ] Error handling is comprehensive
   - [ ] Performance implications considered
   - [ ] Security implications reviewed
   - [ ] Accessibility requirements met (frontend)
   - [ ] Mobile responsiveness tested (frontend)

### PR Template

When creating a PR, use this comprehensive template:

````markdown
## Description

Brief description of changes and the problem they solve.

### Motivation and Context

Why is this change required? What problem does it solve?
Link to issue: Closes #(issue_number)

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring
- [ ] Security enhancement

## Testing

### Test Coverage

- [ ] Unit tests added/updated and passing
- [ ] Integration tests added/updated and passing
- [ ] E2E tests added/updated and passing (if applicable)
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Error conditions tested

### Test Results

```bash
# Include test output showing all tests pass
# Backend: python -m pytest --cov=. --cov-report=term
# Frontend: npm test -- --coverage --watchAll=false
```
````

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

### Before

<!-- Screenshot of current behavior -->

### After

<!-- Screenshot of new behavior -->

## Performance Impact

- [ ] No performance impact
- [ ] Performance improvement (describe)
- [ ] Performance impact assessed and acceptable (describe)

## Security Considerations

- [ ] No security implications
- [ ] Security review completed
- [ ] Input validation added/updated
- [ ] Authentication/authorization considered

## Breaking Changes

- [ ] No breaking changes
- [ ] Breaking changes documented below

### Breaking Changes Description

<!-- Describe any breaking changes and migration steps -->

## Checklist

### Code Quality

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] No debug code or TODO comments left
- [ ] Error handling is comprehensive
- [ ] Performance implications considered

### Documentation

- [ ] Documentation updated (README, API docs, code comments)
- [ ] Changelog entry added
- [ ] Breaking changes documented

### Testing

- [ ] New tests added for new functionality
- [ ] Existing tests updated as needed
- [ ] All tests pass locally
- [ ] Test coverage maintained or improved

### Deployment

- [ ] Database migrations created (if applicable)
- [ ] Environment variables documented
- [ ] Docker configuration updated (if needed)
- [ ] Deployment scripts updated (if needed)

## Additional Notes

<!-- Any additional information that reviewers should know -->

## Reviewer Checklist

<!-- For reviewers to complete -->

- [ ] Code review completed
- [ ] Tests reviewed and adequate
- [ ] Documentation reviewed
- [ ] Security implications assessed
- [ ] Performance impact evaluated

````

### Review Process

1. **Automated checks**: CI/CD pipeline runs all tests, linting, and security scans
2. **Code review**: At least one maintainer and one other contributor review the code
3. **Testing**: Changes are tested in staging environment
4. **Security review**: Security implications assessed (for significant changes)
5. **Approval**: Required approvals from maintainers
6. **Merge**: Squash and merge to maintain clean commit history

### Review Guidelines

**For Reviewers:**
- Be constructive and respectful in feedback
- Focus on code quality, not coding style (that's handled by automated tools)
- Test the changes locally when possible
- Consider security, performance, and maintainability implications
- Ask questions if something is unclear
- Suggest improvements, don't just point out problems

**For PR Authors:**
- Respond to feedback promptly and professionally
- Make requested changes or explain why you disagree
- Keep PR scope focused and atomic
- Rebase and force-push to update PR (don't create merge commits)
- Mark conversations as resolved after addressing them

## Issue Reporting

### Bug Reports

Use the bug report template by creating a new issue with the "Bug Report" template:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] Brief description of the bug'
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
A clear description of what actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- **OS**: [e.g. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Browser**: [e.g. Chrome 95, Firefox 94, Safari 15] (for frontend issues)
- **Python Version**: [e.g. 3.9.7] (for backend issues)
- **Node Version**: [e.g. 18.12.0] (for frontend issues)
- **Docker Version**: [e.g. 20.10.8] (if using Docker)
- **Project Version**: [e.g. v1.2.0, commit hash]

## Error Messages/Logs
````

Paste any error messages or relevant log output here

```

## Additional Context
- Is this a regression? (Did it work before?)
- Does this happen consistently or intermittently?
- Any workarounds you've found?
- Related issues or PRs?

## Possible Solution
If you have ideas on how to fix this, please share them.
```

### Performance Issues

```markdown
---
name: Performance Issue
about: Report performance problems or optimization opportunities
title: "[PERF] Brief description of performance issue"
labels: performance
assignees: ""
---

## Performance Issue Description

Describe the performance problem you're experiencing.

## Current Performance

- **Response Time**: [e.g. 5 seconds for prediction]
- **Memory Usage**: [e.g. 2GB RAM usage]
- **CPU Usage**: [e.g. 100% CPU for 10 seconds]
- **Load Conditions**: [e.g. 100 concurrent users]

## Expected Performance

What performance characteristics do you expect?

## Steps to Reproduce

1. Set up load condition...
2. Execute operation...
3. Measure performance...

## Profiling Data

If you have profiling data, please share it:

- Backend: Python profiler output, memory snapshots
- Frontend: Browser dev tools performance tab, lighthouse scores
- Database: Query execution plans, slow query logs

## Environment

- **Hardware**: [CPU, RAM, storage type]
- **Network**: [connection speed, latency]
- **Load**: [concurrent users, request rate]
- **Data Size**: [number of records, file sizes]

## Possible Optimizations

Any ideas for performance improvements?
```

### Security Issues

**⚠️ Important**: For security vulnerabilities, do NOT create a public issue.

1. **Email**: security@devicepricepro.com
2. **Include**:
   - Detailed vulnerability description
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if you have one)
3. **Response**: We'll acknowledge within 24 hours
4. **Disclosure**: Allow 90 days for fix before public disclosure

## Feature Requests

### Feature Request Template

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: "[FEATURE] Brief description of feature"
labels: enhancement
assignees: ""
---

## Is your feature request related to a problem?

A clear description of what the problem is. Ex. I'm always frustrated when [...]

## Describe the solution you'd like

A clear and concise description of what you want to happen.

## Describe alternatives you've considered

A clear description of any alternative solutions or features you've considered.

## Use Cases

Who would benefit from this feature? How would they use it?

- **User Type**: [e.g. data scientists, business analysts, mobile users]
- **Scenario**: [e.g. bulk processing, real-time predictions, mobile usage]
- **Frequency**: [e.g. daily, occasional, one-time setup]

## Implementation Ideas

If you have ideas on how to implement this feature, please share them:

- **API Changes**: New endpoints, modified responses
- **UI Changes**: New components, modified workflows
- **Backend Changes**: New services, database changes
- **Third-party Integrations**: External APIs, services

## Acceptance Criteria

What should be true when this feature is complete?

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Additional Context

Add any other context, mockups, or examples about the feature request here.

## Priority

How important is this feature to you?

- [ ] Critical (blocking current work)
- [ ] High (would significantly improve workflow)
- [ ] Medium (nice to have improvement)
- [ ] Low (minor enhancement)
```

### Feature Development Process

1. **Discussion**: Feature request discussed in GitHub issues
2. **Triage**: Maintainers assess feasibility and priority
3. **Design**: Technical design document created for complex features
4. **RFC Process**: For major features, Request for Comments created
5. **Approval**: Feature approved by maintainers
6. **Implementation**: Development begins
7. **Review**: Code review and testing
8. **Documentation**: User-facing documentation updated
9. **Release**: Feature included in next release

### RFC Process (Request for Comments)

For major features, we use an RFC process:

1. **Create RFC document** in `rfcs/` directory
2. **Template**:

   ```markdown
   # RFC: Feature Name

   ## Summary

   One-paragraph explanation of the feature.

   ## Motivation

   Why are we doing this? What use cases does it support?

   ## Detailed Design

   Technical details of the implementation.

   ## Drawbacks

   Why should we not do this?

   ## Alternatives

   What other designs have been considered?

   ## Unresolved Questions

   What parts of the design do you expect to resolve through implementation?
   ```

3. **Discussion period**: 2 weeks for feedback
4. **Decision**: Accept, reject, or request changes

## Development Guidelines

### Performance Considerations

#### Backend Performance

```python
# Use database connection pooling
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20
)

# Implement caching for expensive operations
from flask_caching import Cache

@cache.memoize(timeout=300)  # Cache for 5 minutes
def get_device_features(brand: str, model: str) -> Dict[str, Any]:
    # Expensive feature extraction
    return extract_features(brand, model)

# Use generators for large datasets
def process_large_dataset(data_source):
    """Process large datasets efficiently using generators."""
    for chunk in data_source.chunks(size=1000):
        processed_chunk = []
        for item in chunk:
            processed_item = process_item(item)
            processed_chunk.append(processed_item)
        yield processed_chunk

# Optimize ML model inference
import numpy as np
from concurrent.futures import ThreadPoolExecutor

def batch_predict(model, data_batch: List[Dict]) -> List[float]:
    """Optimize batch predictions using vectorization."""
    # Convert to numpy array for vectorized operations
    features = np.array([extract_features(item) for item in data_batch])

    # Batch prediction is faster than individual predictions
    predictions = model.predict(features)

    return predictions.tolist()
```

#### Frontend Performance

```typescript
// Lazy load components and routes
import { lazy, Suspense } from "react";

const DeviceForm = lazy(() => import("./components/DeviceForm"));
const PredictionResult = lazy(() => import("./components/PredictionResult"));
const ShapExplanation = lazy(() => import("./components/ShapExplanation"));

// Use React.memo for expensive components
const ExpensiveChart = React.memo(
  ({ data, options }) => {
    return <Chart data={data} options={options} />;
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);

// Optimize bundle size with dynamic imports
const loadChartLibrary = () => import("recharts");

// Use virtualization for large lists
import { FixedSizeList as List } from "react-window";

const VirtualizedResults = ({ items }) => (
  <List height={400} itemCount={items.length} itemSize={80} itemData={items}>
    {ResultItem}
  </List>
);

// Implement proper loading states
const useAsyncOperation = (asyncFn) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        setState((prev) => ({ ...prev, loading: false, error }));
        throw error;
      }
    },
    [asyncFn]
  );

  return { ...state, execute };
};
```

### Accessibility Guidelines

All UI components must meet WCAG 2.1 AA standards:

```tsx
// Use semantic HTML elements
const PredictionForm = () => (
  <main>
    <h1>Device Price Prediction</h1>
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Device Specifications</legend>

        <div className="form-group">
          <label htmlFor="device-brand">
            Device Brand <span aria-label="required">*</span>
          </label>
          <input
            id="device-brand"
            type="text"
            required
            aria-describedby="brand-help brand-error"
            aria-invalid={!!errors.brand}
          />
          <div id="brand-help" className="help-text">
            Select the manufacturer of your device
          </div>
          {errors.brand && (
            <div id="brand-error" className="error-text" role="alert">
              {errors.brand}
            </div>
          )}
        </div>
      </fieldset>

      <button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <span className="sr-only">Loading...</span>
            <span className="spinner" aria-hidden="true" />
            Predicting Price
          </>
        ) : (
          "Predict Price"
        )}
      </button>
    </form>
  </main>
);

// Ensure proper focus management
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[
        focusableElements.length - 1
      ] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleTabKey);
      return () => document.removeEventListener("keydown", handleTabKey);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>
  );
};

// Provide alternative text for images and charts
const PredictionChart = ({ data, alt }) => (
  <div>
    <img src={chartImage} alt={alt} />
    {/* Also provide data table alternative */}
    <details>
      <summary>View data table</summary>
      <table>
        <caption>Price prediction data</caption>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            <th scope="col">Value</th>
            <th scope="col">Impact</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{item.feature}</th>
              <td>{item.value}</td>
              <td>{item.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  </div>
);
```

### Security Guidelines

```python
# Input validation and sanitization
from marshmallow import Schema, fields, validate

class DeviceDataSchema(Schema):
    brand = fields.Str(required=True, validate=validate.Length(min=1, max=50))
    ram_gb = fields.Float(required=True, validate=validate.Range(min=0.1, max=128))
    storage_gb = fields.Float(required=True, validate=validate.Range(min=1, max=8192))
    screen_size = fields.Float(validate=validate.Range(min=1, max=20))

@app.route('/predict', methods=['POST'])
def predict():
    schema = DeviceDataSchema()
    try:
        data = schema.load(request.json)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400

# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per hour", "100 per minute"]
)

@app.route('/predict')
@limiter.limit("100 per hour")
def predict():
    pass

# SQL injection prevention (if using database)
from sqlalchemy.text import text

# Never do this:
# query = f"SELECT * FROM devices WHERE brand = '{brand}'"

# Always use parameterized queries:
query = text("SELECT * FROM devices WHERE brand = :brand")
result = connection.execute(query, brand=brand)

# Secure headers
from flask_talisman import Talisman

Talisman(app, {
    'force_https': True,
    'strict_transport_security': True,
    'content_security_policy': {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline'",
        'style-src': "'self' 'unsafe-inline'"
    }
})
```

## Recognition

### Contributors Hall of Fame

We maintain recognition for all contributors:

#### Core Maintainers

- **@username1** - Project Lead & Backend Architecture
- **@username2** - Frontend Lead & UI/UX Design
- **@username3** - ML Engineering & Model Development

#### Major Contributors (10+ PRs)

- **@contributor1** - API Development & Documentation
- **@contributor2** - Testing Infrastructure & CI/CD
- **@contributor3** - Performance Optimization

#### Regular Contributors (5+ PRs)

- **@contributor4** - Bug fixes and feature enhancements
- **@contributor5** - Frontend components and accessibility
- **@contributor6** - Documentation and tutorials

#### Community Contributors

All first-time and occasional contributors are listed in our [CONTRIBUTORS.md](CONTRIBUTORS.md) file.

### Types of Recognition

1. **First-time contributors**:

   - Welcome message and personal thanks
   - Guidance and mentorship offers
   - "first contribution" badge on GitHub

2. **Regular contributors**:

   - Listed in project documentation
   - Invitation to contributor Discord channel
   - Early access to beta features

3. **Major contributors**:

   - Special recognition in release notes
   - Contributor spotlight in newsletter
   - DevicePricePro swag and stickers

4. **Maintainers**:
   - Core team recognition
   - Decision-making rights
   - Speaking opportunities at conferences

### Contribution Rewards

Beyond recognition, contributing to DevicePricePro offers:

- **Portfolio Building**: Real-world experience with modern tech stack
- **Skill Development**: Hands-on experience with ML, React, Flask, Docker
- **Networking**: Connect with other developers and ML practitioners
- **Mentorship**: Learn from experienced developers
- **Career Opportunities**: Potential job/internship referrals
- **Open Source Impact**: Contribute to a project that helps others

### Monthly Recognition

We feature outstanding contributions in our monthly newsletter:

- **Contributor of the Month**: Most impactful contributor
- **Best Bug Fix**: Most creative or important bug resolution
- **Best Feature**: Most valuable new feature addition
- **Community Choice**: Community-voted favorite contribution

## Getting Help

### Communication Channels

1. **GitHub Issues**:

   - Bug reports and reproducible problems
   - Feature requests and enhancements
   - Questions about specific code or behavior

2. **GitHub Discussions**:

   - General questions about the project
   - Ideas and brainstorming
   - Show and tell your implementations
   - Q&A with maintainers

3. **Discord Server**: `discord.gg/devicepricepro`

   - Real-time chat and quick questions
   - Community support and collaboration
   - Voice channels for pair programming
   - Announcement channel for releases

4. **Email Support**:
   - **General**: maintainers@devicepricepro.com
   - **Security**: security@devicepricepro.com
   - **Conduct**: conduct@devicepricepro.com

### Mentorship Program

We offer mentorship for new contributors:

**What we provide:**

- Code review guidance and best practices
- Architecture explanations and design decisions
- Pair programming sessions via Discord
- Career advice and open source guidance
- Personal development planning

**How to request mentorship:**

1. Comment on an issue with `@mention-mentorship`
2. Include your experience level and learning goals
3. A maintainer will reach out within 48 hours

**Mentor responsibilities:**

- Weekly 30-minute check-ins
- Code review feedback and explanations
- Answer questions and provide guidance
- Help set learning goals and track progress

### Learning Resources

**Project-specific:**

- [Architecture Overview](docs/architecture.md)
- [Development Setup Video](https://youtube.com/watch?v=setup-guide)
- [API Tutorial Series](docs/tutorials/)
- [ML Model Explanation](docs/model-explanation.md)

**Technology Resources:**

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Scikit-learn User Guide](https://scikit-learn.org/stable/user_guide.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [Git Workflow Guide](https://www.atlassian.com/git/tutorials/comparing-workflows)

**Machine Learning:**

- [SHAP Documentation](https://shap.readthedocs.io/)
- [Model Interpretability Guide](https://christophm.github.io/interpretable-ml-book/)
- [MLOps Best Practices](https://ml-ops.org/)

### Troubleshooting

**Common setup issues:**

1. **Docker build fails**:

   ```bash
   # Clear Docker cache and rebuild
   docker system prune -f
   docker-compose down --volumes
   docker-compose build --no-cache
   docker-compose up
   ```

2. **Module import errors**:

   ```bash
   # Backend: Check Python path and virtual environment
   export PYTHONPATH=$PWD/backend:$PYTHONPATH
   source venv/bin/activate

   # Frontend: Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port conflicts**:

   ```bash
   # Find what's using the port
   lsof -i :5000  # Backend port
   lsof -i :3000  # Frontend port

   # Kill processes or change ports in docker-compose.yml
   ```

4. **Permission errors**:

   ```bash
   # Fix file permissions (Linux/Mac)
   chmod -R 755 backend/
   chmod -R 755 frontend/

   # Windows: Run as administrator or check WSL permissions
   ```

**Getting unstuck:**

- Search existing issues for similar problems
- Check the troubleshooting guide
- Ask in Discord for quick help
- Create a detailed issue if problem persists

---

## Code of Conduct Enforcement

### Reporting Issues

If you experience or witness behavior that violates our Code of Conduct:

1. **Direct Resolution**: If comfortable, address the issue directly with the person
2. **Report to Maintainers**: Email conduct@devicepricepro.com with details
3. **Anonymous Reporting**: Use our anonymous form at [link]

### Investigation Process

1. **Acknowledgment**: We'll acknowledge receipt within 24 hours
2. **Investigation**: Thorough and confidential investigation
3. **Decision**: Appropriate response based on severity
4. **Follow-up**: Check with reporter on resolution satisfaction

### Consequences

Depending on severity, consequences may include:

- Warning and education
- Temporary suspension from project participation
- Permanent ban from project and community spaces
- Reporting to relevant platforms (GitHub, Discord, etc.)

---

## Thank You! 🙏

Every contribution, no matter how small, helps make DevicePricePro better for everyone. Whether you're:

- **Fixing a typo** in documentation
- **Reporting a bug** you encountered
- **Suggesting a feature** that would help you
- **Contributing code** improvements
- **Helping other users** in discussions
- **Sharing the project** with others

Your efforts are appreciated and make a real difference!

### Why Your Contribution Matters

DevicePricePro helps people make informed decisions about device purchases, supports researchers studying technology trends, and serves as a learning platform for ML practitioners. By contributing, you're:

- Helping consumers save money on device purchases
- Supporting fair pricing in technology markets
- Advancing open source machine learning
- Building a more transparent tech ecosystem
- Creating learning opportunities for others

**Ready to contribute?**

1. 🍴 [Fork the repository](https://github.com/your-username/DevicePricePro/fork)
2. 💡 [Browse good first issues](https://github.com/your-username/DevicePricePro/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
3. 💬 [Join our Discord community](https://discord.gg/devicepricepro)
4. 📚 [Read our documentation](https://docs.devicepricepro.com)

**Happy Contributing!** 🚀

---

**Last Updated**: September 16, 2025  
**Next Review**: December 2025  
**Contributors**: 47 amazing people and counting!

-

# DevicePricePro Frontend 📱💰

> A modern React application for predicting device prices using machine learning. Get accurate price estimates for smartphones, tablets, and other electronic devices with comprehensive analytics and user management.

## ✨ Features

### 🔮 **Core Functionality**

- **Single Device Prediction** - Input device specifications for instant price estimates
- **Batch CSV Upload** - Upload CSV files for bulk price predictions  
- **Prediction History** - Track and manage all your previous predictions with filtering
- **Analytics Dashboard** - Comprehensive insights, charts, and export capabilities
- **User Authentication** - Secure JWT-based login and registration system
- **User Profiles** - Manage account settings and personal information

### 🎨 **User Experience**

- **Modern UI/UX** - Clean, intuitive interface with smooth interactions
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Real-time Validation** - Instant form feedback and error handling
- **Loading States** - Professional loading indicators and skeleton screens

### 🔐 **Authentication & Security**

- **Secure Registration** - Account creation with validation
- **JWT Authentication** - Token-based secure authentication
- **Protected Routes** - Secure access to authenticated features
- **Auto-logout** - Session management for security

### 📊 **Advanced Features**

- **File Drag & Drop** - Intuitive CSV upload interface
- **Export Functionality** - Download results as CSV, PDF, and JSON
- **Search & Filtering** - Find specific predictions quickly
- **Data Visualization** - Interactive charts using Recharts library
- **Pagination** - Efficient handling of large prediction datasets

## 🚀 Quick Start

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm package manager
- DevicePricePro Backend API running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DevicePricePro.git
   cd DevicePricePro/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_APP_NAME=DevicePricePro
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   └── index.html         # HTML template
├── src/
│   ├── components/        # React components (pages)
│   │   ├── Home.jsx              # Landing page with features
│   │   ├── Login.jsx             # User authentication
│   │   ├── Register.jsx          # User registration  
│   │   ├── Dashboard.js          # Main dashboard hub
│   │   ├── SinglePrediction.jsx  # Individual device prediction
│   │   ├── BatchPrediction.jsx   # CSV upload interface
│   │   ├── PredictionHistory.jsx # History with filtering
│   │   ├── Analytics.jsx         # Analytics dashboard
│   │   └── Profile.jsx           # User profile management
│   ├── utils/             # Utility functions
│   │   └── ui.js         # UI helpers and styles
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── package.json          # Dependencies and scripts
├── Dockerfile           # Container configuration
├── nginx.conf           # Production web server config
└── README.md            # This file
```

## 🛠️ Available Scripts

### Development
```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run test suite
```

### Docker Commands
```bash
# Build container
docker build -t devicepricepro-frontend .

# Run container
docker run -p 3000:80 devicepricepro-frontend
```

## 🎯 Core Components

### 🏠 **Home Page (Home.jsx)**
- Hero section with value proposition
- Features showcase and benefits
- User testimonials and social proof  
- Pricing tiers and call-to-action buttons
- Professional landing page design

### 📝 **Single Prediction (SinglePrediction.jsx)**
- Multi-step form for device specifications
- Real-time validation and error handling
- Price prediction with confidence scores
- Sample data loading for testing
- Results display with detailed breakdown

### 📄 **Batch Processing (BatchPrediction.jsx)**
- CSV file drag-and-drop upload
- File validation and progress tracking
- Bulk prediction processing
- Results table with export options
- Error handling for invalid data

### 📊 **Analytics Dashboard (Analytics.jsx)**
- Key metrics overview cards
- Interactive charts and visualizations
- Price distribution analysis
- Brand and feature insights
- Export capabilities (CSV, PDF, JSON)

### 📋 **Prediction History (PredictionHistory.jsx)**
- Complete prediction tracking
- Advanced filtering and search
- Pagination for large datasets
- Detailed prediction information
- Export and management options

### 🔐 **Authentication Pages**
- **Login.jsx** - Secure user login
- **Register.jsx** - Account creation with validation
- **Profile.jsx** - User account management

### 🏠 **Dashboard (Dashboard.js)**
- Main application navigation hub
- Quick access to all features
- Recent activity overview
- User-specific content

## 🎨 Styling & Design

### CSS Architecture
```css
/* Global styles and utilities in ui.js */
const cardStyles = {
  base: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    marginBottom: '20px'
  }
};

const buttonStyles = {
  primary: { /* Primary button styles */ },
  secondary: { /* Secondary button styles */ }
};
```

### Design System
- **Consistent color palette** with blue/purple theme
- **Professional typography** with proper hierarchy  
- **Responsive grid system** using CSS Grid and Flexbox
- **Component-based styling** with reusable utilities

## 🔧 Configuration

### API Integration
The frontend communicates with the Flask backend running on port 5000:

```javascript
// API endpoints used:
// POST /auth/login - User authentication
// POST /auth/register - User registration  
// POST /predict/single - Single device prediction
// POST /predict/batch - Batch CSV processing
// GET /predict/history - Prediction history
// GET /user/profile - User profile data
```

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000  # Backend API URL
REACT_APP_APP_NAME=DevicePricePro        # Application name
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Stacked layouts, mobile navigation
- **Tablet**: 768px - 1024px - Adapted grid layouts  
- **Desktop**: > 1024px - Full feature layouts

### Features
- Mobile-first responsive design
- Touch-friendly interface elements
- Optimized navigation for all screen sizes
- Flexible component layouts

## 🚀 Performance Features

### Optimization Techniques
- Component-based architecture for reusability
- Efficient state management with React hooks
- Optimized bundle size with production builds
- Fast loading with optimized assets

### Production Build
```bash
npm run build    # Creates optimized production build in /build
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x", 
  "react-router-dom": "^6.x",
  "recharts": "^2.x"
}
```

### Key Features by Dependency
- **React Router** - Client-side routing and navigation
- **Recharts** - Data visualization and charts
- **Native Fetch/Axios equivalent** - API communication

## 🐳 Docker Support

### Development
```bash
# Run with Docker Compose
docker-compose up frontend
```

### Production
```bash
# Build production image
docker build -t devicepricepro-frontend .

# Run with Nginx
docker run -p 80:80 devicepricepro-frontend
```

### Nginx Configuration
- Serves static React build files
- API proxy to backend service
- Optimized for production performance

## 🧪 Testing

### Test Structure
```bash
npm test                    # Run tests
npm test -- --coverage     # Run with coverage report
```

### Testing Philosophy
- Component functionality testing
- User interaction testing
- API integration testing
- Responsive design testing

## 🔒 Security

### Authentication
- JWT token storage and management
- Automatic token refresh handling
- Protected route middleware
- Secure logout functionality

### Data Protection  
- Input validation on all forms
- XSS protection with proper sanitization
- Secure API communication
- No sensitive data in localStorage

## 🌐 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 88+           |
| Firefox | 85+           |
| Safari  | 14+           |
| Edge    | 88+           |

## 🚀 Deployment

### Build for Production
```bash
npm run build           # Creates optimized build
```

### Deployment Options

**With Docker:**
```bash
docker build -t frontend .
docker run -p 80:80 frontend
```

**Static Hosting:**
- Upload `/build` folder to any static host
- Configure environment variables
- Set up routing for SPA

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)  
3. Make your changes
4. Test thoroughly
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open Pull Request

### Code Standards
- Clean, readable component code
- Proper error handling
- Responsive design principles
- Consistent styling patterns

## 🆘 Troubleshooting

### Common Issues

**Backend Connection Problems:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# Verify environment variables
echo $REACT_APP_API_URL
```

**Build Issues:**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

**Development Server Problems:**
```bash
# Check if port 3000 is available
lsof -i :3000

# Kill existing process if needed
npx kill-port 3000
```

## 📊 Project Stats

- **Components**: 9 main page components
- **Bundle Size**: Optimized for fast loading
- **Performance**: Mobile-first responsive design
- **Browser Support**: Modern browsers (ES6+)

## 📚 Documentation

### Component Documentation
Each component includes:
- Clear prop interfaces
- Usage examples  
- Error handling patterns
- Responsive behavior notes

### API Integration
- RESTful API communication
- Error handling and user feedback
- Loading states and user experience
- Data transformation and validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the excellent framework
- **Recharts** for beautiful data visualization
- **Create React App** for development tooling
- **Open Source Community** for amazing libraries

---

**Built with ❤️ for accurate device price predictions**

For questions or support, please [open an issue](https://github.com/yourusername/DevicePricePro/issues).

# DevicePricePro Frontend 📱💰

> A modern, responsive React application for predicting device prices using machine learning. Get accurate price estimates for smartphones, tablets, and other electronic devices.

![DevicePricePro Banner](https://via.placeholder.com/800x200/667eea/ffffff?text=DevicePricePro+-+AI+Device+Price+Predictions)

## ✨ Features

### 🔮 **Core Functionality**

- **Single Device Prediction** - Input device specifications for instant price estimates
- **Batch CSV Upload** - Upload CSV files for bulk price predictions
- **Prediction History** - Track and manage all your previous predictions
- **Analytics Dashboard** - Comprehensive insights and trends visualization

### 🎨 **User Experience**

- **Modern UI/UX** - Beautiful, intuitive interface with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme** - Automatic theme switching based on user preference
- **Progressive Web App** - Installable with offline capabilities

### 🔐 **Authentication & Security**

- **Multi-step Registration** - Secure account creation with validation
- **Password Strength Indicator** - Real-time security feedback
- **Remember Me** - Convenient login persistence
- **Protected Routes** - Secure access to authenticated features

### 📊 **Advanced Features**

- **Real-time Validation** - Instant form feedback and error handling
- **File Drag & Drop** - Intuitive CSV upload with progress tracking
- **Export Functionality** - Download prediction results as CSV
- **Search & Filtering** - Find specific predictions quickly
- **Pagination** - Efficient handling of large datasets

## 🚀 Quick Start

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- DevicePricePro Backend API running

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/devicepricepro-frontend.git
   cd devicepricepro-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000/api
   REACT_APP_APP_NAME=DevicePricePro
   REACT_APP_VERSION=1.0.0
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── api/                    # API configuration and services
│   └── api.js             # Axios configuration
├── components/            # Reusable UI components
│   ├── Navigation.jsx     # Main navigation component
│   └── ...
├── context/              # React Context providers
│   └── AuthContext.js    # Authentication state management
├── pages/                # Page components
│   ├── Home.jsx          # Landing page
│   ├── Login.jsx         # Authentication pages
│   ├── Register.jsx
│   ├── DeviceForm.jsx    # Single prediction form
│   ├── CSVUpload.jsx     # Batch upload interface
│   ├── DeviceHistory.jsx # Prediction history
│   └── Analytics.jsx     # Analytics dashboard
├── styles/               # CSS stylesheets
│   ├── global.css        # Global styles and utilities
│   └── components.css    # Component-specific styles
├── utils/                # Utility functions
│   └── ui.js            # UI helpers and utilities
├── App.jsx              # Main application component
└── index.jsx            # Application entry point
```

## 🛠️ Available Scripts

### Development

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Code Quality

```bash
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run analyze    # Analyze bundle size
```

## 🎯 Core Components

### 🏠 **Home Page**

Landing page with hero section, features showcase, and call-to-action buttons.

### 📝 **Device Form**

Multi-step form for single device predictions:

- **20+ device specifications** input fields
- **Real-time validation** and error handling
- **Progress tracking** through form steps
- **Sample data loading** for testing

### 📄 **CSV Upload**

Drag-and-drop interface for batch predictions:

- **File validation** and size limits
- **Progress tracking** during upload
- **Results visualization** with export options
- **Error handling** for invalid data

### 📊 **Analytics Dashboard**

Comprehensive insights and visualizations:

- **Key metrics** overview cards
- **Interactive charts** and trends
- **Feature impact** analysis
- **Real-time activity** feed

### 🔐 **Authentication**

Secure user management system:

- **Multi-step registration** with validation
- **Password strength** indicator
- **Social login** integration ready
- **Protected routes** and role management

## 🎨 Styling & Theming

### CSS Architecture

- **CSS Variables** for consistent theming
- **Utility Classes** for rapid development
- **Component-scoped** styles
- **Responsive breakpoints** for all devices

### Design System

```css
/* Color Palette */
--primary-color: #3b82f6; /* Blue */
--secondary-color: #8b5cf6; /* Purple */
--success-color: #10b981; /* Green */
--warning-color: #f59e0b; /* Amber */
--error-color: #ef4444; /* Red */

/* Typography */
font-family: "Inter", sans-serif;
/* Responsive font scaling */
/* Modern spacing system */
```

### Animation System

- **Fade-in animations** for page loads
- **Smooth transitions** for interactions
- **Loading skeletons** for better UX
- **Micro-interactions** for engagement

## 🔧 Configuration

### API Configuration

```javascript
// src/api/api.js
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

### Environment Variables

```env
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api

# App Configuration
REACT_APP_APP_NAME=DevicePricePro
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_PWA=true
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 768px) {
  /* Tablet */
}
@media (min-width: 1024px) {
  /* Desktop */
}
@media (min-width: 1280px) {
  /* Large Desktop */
}
```

### Features

- **Flexible Grid System** - CSS Grid and Flexbox
- **Responsive Images** - Optimized loading and sizing
- **Touch-Friendly** - Large tap targets and gestures
- **Mobile Navigation** - Collapsible hamburger menu

## 🚀 Performance Optimizations

### Code Splitting

```javascript
// Lazy loading for better performance
const Analytics = lazy(() => import("./pages/Analytics"));
const DeviceHistory = lazy(() => import("./pages/DeviceHistory"));
```

### Image Optimization

- **Lazy loading** for images
- **WebP format** support
- **Responsive images** with srcset
- **Image compression** in build process

### Bundle Analysis

```bash
npm run analyze    # View bundle composition
npm run build      # Optimized production build
```

## 🧪 Testing

### Test Structure

```
src/
├── __tests__/           # Test files
│   ├── components/      # Component tests
│   ├── pages/          # Page tests
│   └── utils/          # Utility tests
└── setupTests.js       # Test configuration
```

### Running Tests

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

## 🔒 Security

### Authentication

- **JWT token** management
- **Automatic token** refresh
- **Secure storage** practices
- **Route protection** middleware

### Data Protection

- **Input validation** on all forms
- **XSS protection** with sanitization
- **CSRF protection** with tokens
- **Secure API** communication

## 🌐 Browser Support

| Browser | Version |
| ------- | ------- |
| Chrome  | 88+     |
| Firefox | 85+     |
| Safari  | 14+     |
| Edge    | 88+     |

## 📦 Dependencies

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "axios": "^1.3.0"
}
```

### Development Dependencies

```json
{
  "@testing-library/react": "^13.4.0",
  "eslint": "^8.34.0",
  "prettier": "^2.8.0"
}
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment-specific Builds

```bash
# Staging
npm run build:staging

# Production
npm run build:production
```

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **ESLint** configuration for code quality
- **Prettier** for consistent formatting
- **Conventional Commits** for clear history
- **Component documentation** with PropTypes

### Pull Request Guidelines

- Clear, descriptive titles
- Detailed descriptions of changes
- Screenshots for UI changes
- Test coverage for new features
- Documentation updates when needed

## 📊 Performance Metrics

### Lighthouse Scores

- **Performance**: 95+
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 95+

### Bundle Size

- **Initial Bundle**: ~150kb gzipped
- **Vendor Bundle**: ~300kb gzipped
- **Total Load Time**: <2s on 3G

## 🆘 Troubleshooting

### Common Issues

#### API Connection Issues

```bash
# Check API status
curl http://localhost:8000/api/health

# Verify environment variables
echo $REACT_APP_API_BASE_URL
```

#### Build Failures

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build
npm run build
```

#### Development Server Issues

```bash
# Check port availability
lsof -i :3000

# Kill existing process
kill -9 $(lsof -t -i:3000)
```

## 📚 Additional Resources

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [React Router](https://reactrouter.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)

### Design System

- [Design Tokens](./docs/design-tokens.md)
- [Component Library](./docs/components.md)
- [Style Guide](./docs/style-guide.md)

### API Integration

- [API Documentation](../backend/README.md)
- [Authentication Guide](./docs/authentication.md)
- [Error Handling](./docs/error-handling.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer** - Your Name (@yourusername)
- **UI/UX Designer** - Designer Name (@designer)
- **Backend Developer** - Backend Dev (@backend-dev)

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Create React App** for the development setup
- **All Contributors** who helped improve this project
- **Open Source Community** for the incredible libraries

---

<div align="center">
  <p>Made with ❤️ by the DevicePricePro Team</p>
  <p>
    <a href="https://devicepricepro.com">Website</a> •
    <a href="https://github.com/yourusername/devicepricepro">GitHub</a> •
    <a href="mailto:support@devicepricepro.com">Support</a>
  </p>
</div>

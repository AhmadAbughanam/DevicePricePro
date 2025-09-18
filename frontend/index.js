import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './src/styles/global';
import './src/styles/components.css';

// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Error boundary for production
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Application Error:', error, errorInfo);
      // Here you could send to error tracking service like Sentry
      // Sentry.captureException(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Page
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32 text-red-600">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring function
function sendToAnalytics(metric) {
  // In production, send metrics to your analytics service
  if (process.env.NODE_ENV === 'production') {
    console.log('Performance metric:', metric);
    // Example: analytics.track('web-vitals', metric);
  }
}

// Measure Core Web Vitals
function measurePerformance() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

// Service worker registration for PWA capabilities
function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

// Initialize the application
function initializeApp() {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('Root element not found');
    return;
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  // Initialize performance monitoring
  measurePerformance();

  // Register service worker
  registerServiceWorker();

  // Development only: Hot module replacement
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./App', () => {
      const NextApp = require('./App').default;
      root.render(
        <React.StrictMode>
          <ErrorBoundary>
            <NextApp />
          </ErrorBoundary>
        </React.StrictMode>
      );
    });
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    // Sentry.captureException(event.error);
  }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
    // Sentry.captureException(event.reason);
  }
});

// Connectivity monitoring
function handleOnlineStatus() {
  const status = navigator.onLine ? 'online' : 'offline';
  console.log('Connection status:', status);
  
  // You could dispatch a global event or update a global state
  window.dispatchEvent(new CustomEvent('connectionchange', { 
    detail: { status } 
  }));
}

window.addEventListener('online', handleOnlineStatus);
window.addEventListener('offline', handleOnlineStatus);

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Cleanup function for development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('beforeunload', () => {
    // Cleanup any ongoing processes
    console.log('App is being unloaded');
  });
}
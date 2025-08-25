// Security Configuration
export const SECURITY_CONFIG = {
  // Environment checks
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  apiVersion: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Security settings
  enableConsoleLog: process.env.NODE_ENV === 'development',
  enableDebugMode: process.env.NODE_ENV === 'development',
  
  // Feature flags
  features: {
    enableAdvancedFeatures: process.env.REACT_APP_ENV === 'production',
    enableDebugTools: process.env.NODE_ENV === 'development',
  }
};

// Security utilities
export const SecurityUtils = {
  // Sanitize user input
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '');
  },
  
  // Validate environment
  validateEnvironment: () => {
    if (SECURITY_CONFIG.isProduction) {
      // Disable console in production
      if (!SECURITY_CONFIG.enableConsoleLog) {
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
      }
    }
  },
  
  // Check for development tools
  detectDevTools: () => {
    if (SECURITY_CONFIG.isProduction) {
      const devtools = {
        open: false,
        orientation: null
      };
      
      setInterval(() => {
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          if (!devtools.open) {
            devtools.open = true;
            // Optionally redirect or show warning
            console.warn('Developer tools detected');
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    }
  }
};

// Initialize security
SecurityUtils.validateEnvironment();
SecurityUtils.detectDevTools();

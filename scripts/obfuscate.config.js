// JavaScript Obfuscation Configuration
// This file contains settings for code obfuscation and minification

const obfuscationConfig = {
  // Basic obfuscation settings
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false, // Set to true for production
  debugProtectionInterval: false,
  disableConsoleOutput: false, // Set to true for production
  
  // Identifier names generator
  identifierNamesGenerator: 'hexadecimal',
  
  // String encryption
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  
  // Transform object keys
  transformObjectKeys: true,
  
  // Unicode escape sequence
  unicodeEscapeSequence: false,
  
  // Advanced settings
  selfDefending: true,
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
  sourceMapMode: 'separate',
  
  // Performance settings
  target: 'browser',
  
  // Exclude certain files from obfuscation
  exclude: [
    'enhanced-ui.js', // Keep UI enhancements readable for debugging
    'tetris-game.js'   // Keep game logic readable for maintenance
  ],
  
  // Custom options for different environments
  development: {
    compact: false,
    debugProtection: false,
    disableConsoleOutput: false,
    sourceMap: true
  },
  
  production: {
    compact: true,
    debugProtection: true,
    disableConsoleOutput: true,
    sourceMap: false
  }
};

// Export configuration for build tools
if (typeof module !== 'undefined' && module.exports) {
  module.exports = obfuscationConfig;
}

// Browser compatibility check
if (typeof window !== 'undefined') {
  // Add browser-specific optimizations
  window.obfuscationConfig = obfuscationConfig;
  
  // Performance monitoring
  if (window.performance && window.performance.mark) {
    window.performance.mark('obfuscation-config-loaded');
  }
}

// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Code integrity verification
const integrityHashes = {
  'styles.css': 'sha384-...',
  'enhanced-styles.css': 'sha384-...',
  'final-polish.css': 'sha384-...',
  'modern-dark-theme.css': 'sha384-...'
};

// Performance optimization settings
const performanceConfig = {
  // Lazy loading
  lazyLoadImages: true,
  lazyLoadThreshold: '50px',
  
  // Resource hints
  preloadCriticalResources: [
    'styles.css',
    'enhanced-styles.css'
  ],
  
  // Compression
  enableGzip: true,
  enableBrotli: true,
  
  // Caching
  cacheStrategy: {
    static: '1y',
    dynamic: '1h',
    api: '5m'
  }
};

// Development tools
const devTools = {
  enableSourceMaps: process?.env?.NODE_ENV === 'development',
  enableHotReload: process?.env?.NODE_ENV === 'development',
  enableDebugMode: process?.env?.NODE_ENV === 'development'
};

// Export all configurations
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    obfuscationConfig,
    securityHeaders,
    integrityHashes,
    performanceConfig,
    devTools
  };
}
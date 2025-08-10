// Main JavaScript Entry Point
import { initializeUI } from './modules/ui.js';
import { initializeAnalytics } from './modules/analytics.js';
import { initializeSecurity } from './modules/security.js';
import { initializeTetris } from './modules/tetris.js';

// Performance monitoring
const performanceStart = performance.now();

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Application initializing...');
    
    // Initialize core modules
    initializeUI();
    
    // Initialize analytics
    initializeAnalytics();
    
    // Initialize Tetris game
    initializeTetris();
    
    // Initialize security features
    initializeSecurity();
    
    // Basic security validation
    console.log('🔒 Security validation completed');
    
    // Performance logging
    const performanceEnd = performance.now();
    console.log(`⚡ Application loaded in ${(performanceEnd - performanceStart).toFixed(2)}ms`);
    
    console.log('✅ Application ready!');
});
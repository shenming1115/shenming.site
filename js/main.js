// Main JavaScript - Initialize all modules
import { initializeUI } from './modules/ui.js';
import { initializeAnalytics } from './modules/analytics.js';
import { initializeTetris } from './modules/tetris.js';
import { initializeSecurity } from './modules/security.js';

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Shen Ming Portfolio - Initializing...');
    
    // Initialize all modules
    initializeUI();
    initializeAnalytics();
    initializeTetris();
    initializeSecurity();
    
    console.log('✅ All modules initialized successfully!');
    
    // Add page load animation
    document.body.classList.add('loaded');
    
    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('app-initialized');
    }
});
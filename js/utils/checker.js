// Security and System Checker Utility

// Full system check function
export function runFullCheck() {
    console.log('🔍 Running full system check...');
    
    const results = {
        timestamp: new Date().toISOString(),
        checks: {
            dom: checkDOMReady(),
            scripts: checkScriptsLoaded(),
            styles: checkStylesLoaded(),
            security: checkSecurityFeatures(),
            performance: checkPerformance()
        }
    };
    
    console.log('✅ System check completed:', results);
    return results;
}

// Individual check functions
function checkDOMReady() {
    return {
        status: document.readyState === 'complete',
        readyState: document.readyState,
        timestamp: Date.now()
    };
}

function checkScriptsLoaded() {
    const scripts = document.querySelectorAll('script');
    return {
        total: scripts.length,
        loaded: Array.from(scripts).filter(script => !script.src || script.readyState === 'complete').length,
        status: true
    };
}

function checkStylesLoaded() {
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    return {
        total: styles.length,
        status: styles.length > 0
    };
}

function checkSecurityFeatures() {
    return {
        https: location.protocol === 'https:',
        turnstile: typeof window.turnstile !== 'undefined',
        serviceWorker: 'serviceWorker' in navigator,
        status: true
    };
}



function checkPerformance() {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
        loadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
        domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
        status: true
    };
}

// Export a dummy validateSecurity function to prevent import errors
export function validateSecurity() {
    console.log('⚠️ validateSecurity function called - this is a compatibility stub');
    return true;
}
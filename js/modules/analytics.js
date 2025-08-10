// Analytics Module - Handle analytics and tracking

export function initializeAnalytics() {
    console.log('📊 Analytics module initialized');
    
    // Google Analytics initialization
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'Shen Ming Portfolio',
            page_location: window.location.href
        });
    }
    
    // Track page views
    trackPageView();
    
    // Track user interactions
    setupEventTracking();
}

function trackPageView() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
    
    console.log('📈 Page view tracked:', window.location.pathname);
}

function setupEventTracking() {
    // Track navigation clicks
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', (e) => {
            const linkText = e.target.textContent;
            trackEvent('navigation', 'click', linkText);
        });
    });
    
    // Track button clicks
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = e.target.textContent || e.target.id || 'unknown';
            trackEvent('button', 'click', buttonText);
        });
    });
    
    // Track social link clicks
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const platform = e.target.closest('.social-link').className.split(' ').pop();
            trackEvent('social', 'click', platform);
        });
    });
}

function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: 1
        });
    }
    
    console.log(`📊 Event tracked: ${category} - ${action} - ${label}`);
}

// Export tracking function for use in other modules
export { trackEvent };
// Google Analytics 4 Setup for shenming.site
// Replace 'GA_MEASUREMENT_ID' with your actual Google Analytics 4 Measurement ID

// Google Analytics 4 Configuration
const GA4_CONFIG = {
  // Replace with your actual GA4 Measurement ID (format: G-XXXXXXXXXX)
  measurementId: 'G-XXXXXXXXXX', // TODO: Replace with actual ID
  
  // Enhanced measurement settings
  config: {
    // Track page views automatically
    send_page_view: true,
    
    // Enhanced ecommerce (not needed for portfolio, but good to have)
    enhanced_ecommerce: false,
    
    // Custom parameters
    custom_map: {
      'custom_parameter_1': 'page_section'
    },
    
    // Cookie settings
    cookie_expires: 63072000, // 2 years in seconds
    cookie_update: true,
    cookie_flags: 'SameSite=None;Secure'
  }
};

// Initialize Google Analytics 4
function initializeGA4() {
  // Create script tag for gtag
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_CONFIG.measurementId}`;
  document.head.appendChild(gtagScript);
  
  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  
  // Configure gtag
  gtag('js', new Date());
  gtag('config', GA4_CONFIG.measurementId, GA4_CONFIG.config);
  
  // Make gtag globally available
  window.gtag = gtag;
  
  console.log('Google Analytics 4 initialized for shenming.site');
}

// Custom event tracking functions
const Analytics = {
  // Track page navigation
  trackPageView: (pageName) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href
      });
    }
  },
  
  // Track button clicks
  trackButtonClick: (buttonName, section) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'click', {
        event_category: 'engagement',
        event_label: buttonName,
        page_section: section
      });
    }
  },
  
  // Track game interactions
  trackGameEvent: (action, gameName, score = null) => {
    if (typeof gtag !== 'undefined') {
      const eventData = {
        event_category: 'game',
        event_label: gameName,
        custom_parameter_1: action
      };
      
      if (score !== null) {
        eventData.value = score;
      }
      
      gtag('event', action, eventData);
    }
  },
  
  // Track contact form interactions
  trackContactEvent: (action, method) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'contact',
        event_label: method
      });
    }
  },
  
  // Track scroll depth
  trackScrollDepth: (percentage) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'scroll', {
        event_category: 'engagement',
        event_label: `${percentage}%`,
        value: percentage
      });
    }
  }
};

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if measurement ID is set
  if (GA4_CONFIG.measurementId !== 'G-XXXXXXXXXX') {
    initializeGA4();
    
    // Track initial page view
    Analytics.trackPageView(document.title);
    
    // Set up automatic scroll tracking
    let scrollTracked = {25: false, 50: false, 75: false, 100: false};
    
    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      Object.keys(scrollTracked).forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked[threshold]) {
          scrollTracked[threshold] = true;
          Analytics.trackScrollDepth(threshold);
        }
      });
    });
    
    // Track navigation clicks
    document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', function() {
        Analytics.trackButtonClick(this.textContent, 'navigation');
      });
    });
    
    // Track social media clicks
    document.querySelectorAll('.social-link, .social-icon').forEach(link => {
      link.addEventListener('click', function() {
        const platform = this.href.includes('whatsapp') ? 'WhatsApp' : 
                        this.href.includes('instagram') ? 'Instagram' :
                        this.href.includes('linkedin') ? 'LinkedIn' : 'Unknown';
        Analytics.trackContactEvent('social_click', platform);
      });
    });
    
  } else {
    console.log('Google Analytics not initialized - please set your Measurement ID');
  }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Analytics, GA4_CONFIG };
}

// Make Analytics available globally
window.Analytics = Analytics;
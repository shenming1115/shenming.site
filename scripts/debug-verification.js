// Debug Verification Script
console.log('🔍 Debug Verification Script Loading...');

// Test if refreshTurnstile function exists
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Checking verification functions...');
    
    // Check if refreshTurnstile exists
    if (typeof window.refreshTurnstile === 'function') {
        console.log('✅ refreshTurnstile function found');
    } else {
        console.log('❌ refreshTurnstile function NOT found - creating backup');
        
        // Create backup refreshTurnstile function
        window.refreshTurnstile = function() {
            console.log('🔄 Backup refreshTurnstile called');
            
            // Show visual feedback
            const result = document.getElementById('verificationResult');
            if (result) {
                result.innerHTML = '<span style="color: #3498DB;">🔄 Refreshing verification (backup method)...</span>';
            }
            
            // Reset button state
            const verifyBtn = document.getElementById('verifyBtn');
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.style.opacity = '0.5';
                verifyBtn.innerHTML = '<span>🛡️</span> Verify I\'m Human';
            }
            
            // Simulate refresh
            setTimeout(() => {
                if (result) {
                    result.innerHTML = '<span style="color: #27AE60;">✅ Verification refreshed! You can now verify.</span>';
                }
                
                // Enable verify button for testing
                if (verifyBtn) {
                    verifyBtn.disabled = false;
                    verifyBtn.style.opacity = '1';
                    verifyBtn.innerHTML = '<span>✓</span> Verify & Continue';
                }
            }, 2000);
        };
        
        console.log('✅ Backup refreshTurnstile function created');
    }
    
    // Test the button click
    const refreshBtn = document.getElementById('refreshTurnstile');
    if (refreshBtn) {
        console.log('✅ Refresh button found');
        
        // Add additional click handler for debugging
        refreshBtn.addEventListener('click', function(e) {
            console.log('🔄 Refresh button clicked!');
            e.preventDefault();
            
            // Call the function directly
            if (window.refreshTurnstile) {
                window.refreshTurnstile();
            } else {
                console.log('❌ refreshTurnstile function still not available');
            }
        });
    } else {
        console.log('❌ Refresh button NOT found');
    }
    
    // Add a test button for debugging
    const testBtn = document.createElement('button');
    testBtn.textContent = '🧪 Test Refresh';
    testBtn.style.cssText = `
        position: fixed;
        top: 60px;
        right: 20px;
        z-index: 99999;
        padding: 10px 15px;
        background: #9B59B6;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    
    testBtn.addEventListener('click', function() {
        console.log('🧪 Test button clicked');
        if (window.refreshTurnstile) {
            window.refreshTurnstile();
        } else {
            console.log('❌ refreshTurnstile not available');
            alert('refreshTurnstile function not found!');
        }
    });
    
    document.body.appendChild(testBtn);
    
    console.log('🔍 Debug verification setup complete');
});

// Global function check
setTimeout(() => {
    console.log('🔍 Global function check:');
    console.log('- refreshTurnstile:', typeof window.refreshTurnstile);
    console.log('- onTurnstileSuccess:', typeof window.onTurnstileSuccess);
    console.log('- turnstile API:', typeof window.turnstile);
}, 3000);
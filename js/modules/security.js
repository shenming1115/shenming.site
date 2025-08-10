// Security Module - Handle verification and security features

export function initializeSecurity() {
    console.log('🛡️ Security module initialized');
    
    // Initialize Cloudflare Turnstile
    setupTurnstile();
    
    // Initialize time and IP display
    updateSecurityInfo();
    
    // Setup verification form handlers
    setupVerificationHandlers();
    
    // Setup security monitoring
    setupSecurityMonitoring();
}

function setupTurnstile() {
    // Initialize Turnstile widget
    const turnstileContainer = document.getElementById('turnstile-container');
    if (turnstileContainer && window.turnstile) {
        try {
            window.turnstile.render('#turnstile-container', {
                sitekey: '1x00000000000000000000AA', // Test site key - always passes
                callback: function(token) {
                    console.log('✅ Turnstile verification completed');
                    handleTurnstileSuccess(token);
                },
                'error-callback': function() {
                    console.error('❌ Turnstile verification failed');
                    handleTurnstileError();
                }
            });
            console.log('🔒 Turnstile initialized');
        } catch (error) {
            console.error('❌ Turnstile initialization failed:', error);
            // Fallback: hide turnstile and show manual verification
            turnstileContainer.style.display = 'none';
        }
    } else {
        console.log('ℹ️ Turnstile not available, using fallback verification');
    }
    
    // Turnstile success callback
    window.onTurnstileSuccess = function(token) {
        console.log('✅ Turnstile verification successful');
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.style.opacity = '1';
            verifyBtn.innerHTML = '<span>✓</span> Verify & Continue';
        }
        
        // Show success feedback
        showVerificationResult('success', '✅ Verification successful! You can now continue.');
    };
    
    // Turnstile error callback
    window.onTurnstileError = function(error) {
        console.error('❌ Turnstile verification failed:', error);
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.disabled = true;
            verifyBtn.style.opacity = '0.5';
        }
        
        showVerificationResult('error', '❌ Verification failed. Please try again.');
    };
    
    // Turnstile expired callback
    window.onTurnstileExpired = function() {
        console.warn('⏰ Turnstile verification expired');
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.disabled = true;
            verifyBtn.style.opacity = '0.5';
            verifyBtn.innerHTML = '<span>🛡️</span> Verify I\'m Human';
        }
        
        showVerificationResult('warning', '⏰ Verification expired. Please verify again.');
    };
}

function handleTurnstileSuccess(token) {
    console.log('✅ Turnstile verification completed with token:', token);
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.style.opacity = '1';
        verifyBtn.innerHTML = '<span>✓</span> Verify & Continue';
    }
    showVerificationResult('success', '✅ Verification successful! You can now continue.');
}

function handleTurnstileError() {
    console.error('❌ Turnstile verification failed');
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.style.opacity = '0.5';
    }
    showVerificationResult('error', '❌ Verification failed. Please try again.');
}

function updateSecurityInfo() {
    // Update Malaysia time
    updateMalaysiaTime();
    
    // Update IP information
    updateIPInfo();
    
    // Update security level
    updateSecurityLevel();
    
    // Set up periodic updates
    setInterval(updateMalaysiaTime, 1000);
}

function updateMalaysiaTime() {
    const now = new Date();
    const malaysiaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"}));
    const timeString = malaysiaTime.toLocaleString('en-MY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    const timeElements = [
        document.getElementById('preVerifyDatetime'),
        document.getElementById('mainDatetime'),
        document.getElementById('contentDatetime')
    ];
    
    timeElements.forEach(element => {
        if (element) {
            element.textContent = timeString;
        }
    });
}

function updateIPInfo() {
    // Get IP information
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipElements = [
                document.getElementById('ipInfo'),
                document.getElementById('mainIP'),
                document.getElementById('contentIP')
            ];
            
            ipElements.forEach(element => {
                if (element) {
                    element.textContent = data.ip;
                }
            });
        })
        .catch(error => {
            console.warn('Could not fetch IP:', error);
            const ipElements = [
                document.getElementById('ipInfo'),
                document.getElementById('mainIP'),
                document.getElementById('contentIP')
            ];
            
            ipElements.forEach(element => {
                if (element) {
                    element.textContent = 'Hidden for privacy';
                }
            });
        });
}

function updateSecurityLevel() {
    const riskElement = document.getElementById('riskLevel');
    if (riskElement) {
        // Simulate security analysis
        setTimeout(() => {
            riskElement.textContent = 'Low Risk - Secure Connection';
            riskElement.style.color = '#27AE60';
        }, 2000);
    }
}

function setupVerificationHandlers() {
    // Handle verification form submission
    const captchaForm = document.getElementById('captchaForm');
    if (captchaForm) {
        captchaForm.addEventListener('submit', handleVerificationSubmit);
    }
    
    // Handle refresh button
    const refreshBtn = document.getElementById('refreshTurnstile');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefreshVerification);
    }
}

function handleVerificationSubmit(e) {
    e.preventDefault();
    
    console.log('🔐 Processing verification...');
    
    // Simulate verification process
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.innerHTML = '<span>⏳</span> Verifying...';
        verifyBtn.disabled = true;
    }
    
    // Simulate successful verification after delay
    setTimeout(() => {
        hideVerificationMask();
    }, 2000);
}

function handleRefreshVerification() {
    console.log('🔄 Refreshing verification...');
    
    // Reset verify button
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.style.opacity = '0.5';
        verifyBtn.innerHTML = '<span>🛡️</span> Verify I\'m Human';
    }
    
    // Show refresh feedback
    showVerificationResult('info', '🔄 Verification refreshed. Please complete the challenge again.');
}

function showVerificationResult(type, message) {
    const resultElement = document.getElementById('verificationResult');
    if (resultElement) {
        const colors = {
            success: '#27AE60',
            error: '#E74C3C',
            warning: '#F39C12',
            info: '#3498DB'
        };
        
        resultElement.innerHTML = `<span style="color: ${colors[type]}">${message}</span>`;
        resultElement.style.display = 'block';
    }
}

function hideVerificationMask() {
    const mask = document.getElementById('preVerifyMask');
    if (mask) {
        mask.style.opacity = '0';
        mask.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            mask.style.display = 'none';
            document.body.classList.add('after-verify-bg');
            console.log('✅ Verification completed - Access granted');
        }, 1200);
    }
}

function setupSecurityMonitoring() {
    // Monitor for suspicious activity
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastClickTime < 100) {
            clickCount++;
            if (clickCount > 10) {
                console.warn('⚠️ Suspicious rapid clicking detected');
                clickCount = 0;
            }
        } else {
            clickCount = 0;
        }
        lastClickTime = now;
    });
    
    // Monitor console access
    let devtools = false;
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools) {
                console.log('🔍 Developer tools detected - Welcome developer!');
                devtools = true;
            }
        } else {
            devtools = false;
        }
    }, 1000);
}

// Export utility functions
export { showVerificationResult, hideVerificationMask };
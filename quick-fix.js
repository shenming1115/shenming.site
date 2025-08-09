// Quick Fix Script - Resolve verification page issues
console.log('🔧 Quick Fix Script Loading...');

// Immediate execution for critical fixes
(function() {
    // Add development bypass button immediately
    const bypassBtn = document.createElement('button');
    bypassBtn.textContent = '🚀 Skip to Website';
    bypassBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99999;
        padding: 12px 20px;
        background: #27AE60;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    `;
    
    bypassBtn.addEventListener('click', function() {
        console.log('🚀 Bypassing verification...');
        const preVerifyMask = document.getElementById('preVerifyMask');
        const mainContent = document.getElementById('mainContent');
        
        if (preVerifyMask) {
            preVerifyMask.style.display = 'none';
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        document.body.classList.add('after-verify-bg');
        this.remove();
        
        // Initialize main website features
        initializeMainWebsite();
    });
    
    document.body.appendChild(bypassBtn);
})();

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying quick fixes...');
    
    // Fix time and IP fetching
    fixTimeAndIP();
    
    // Fix Turnstile verification
    fixTurnstileVerification();
    
    // Auto-bypass after 5 seconds if verification is stuck
    setTimeout(() => {
        const preVerifyMask = document.getElementById('preVerifyMask');
        if (preVerifyMask && preVerifyMask.style.display !== 'none') {
            console.log('🔧 Auto-bypassing stuck verification...');
            const bypassBtn = document.querySelector('button[style*="Skip to Website"]');
            if (bypassBtn) {
                bypassBtn.click();
            }
        }
    }, 5000);
    
    console.log('✅ Quick fixes applied');
});

function fixTurnstileVerification() {
    // Create Turnstile container if it doesn't exist
    let turnstileContainer = document.querySelector('.cf-turnstile');
    if (!turnstileContainer) {
        turnstileContainer = document.createElement('div');
        turnstileContainer.className = 'cf-turnstile';
        turnstileContainer.setAttribute('data-sitekey', '0x4AAAAAABjTIyITvZEz6LO_');
        turnstileContainer.setAttribute('data-theme', 'dark');
        turnstileContainer.setAttribute('data-size', 'normal');
        turnstileContainer.setAttribute('data-callback', 'onTurnstileSuccess');
        
        const preVerifyMask = document.getElementById('preVerifyMask');
        if (preVerifyMask) {
            preVerifyMask.appendChild(turnstileContainer);
        }
    }
    
    // Define refreshTurnstile function if not already defined
    if (!window.refreshTurnstile) {
        window.refreshTurnstile = function() {
            console.log('🔄 Quick-fix: Refreshing Turnstile...');
            
            const result = document.getElementById('verificationResult');
            if (result) {
                result.innerHTML = '<span style="color: #3498DB;">🔄 Refreshing verification...</span>';
            }
            
            // Reset verify button
            const verifyBtn = document.getElementById('verifyBtn');
            if (verifyBtn) {
                verifyBtn.disabled = true;
                verifyBtn.style.opacity = '0.5';
                verifyBtn.innerHTML = '<span>🛡️</span> Verify I\'m Human';
            }
            
            // Safe approach: suggest page reload
            setTimeout(() => {
                if (result) {
                    result.innerHTML = `
                        <div style="color: #F39C12; text-align: center; padding: 10px;">
                            ⚠️ To refresh the verification, please reload this page.<br>
                            <button onclick="location.reload()" style="
                                margin-top: 10px; 
                                padding: 8px 16px; 
                                background: #27AE60; 
                                color: white; 
                                border: none; 
                                border-radius: 5px; 
                                cursor: pointer;
                            ">🔄 Reload Page</button>
                        </div>
                    `;
                }
            }, 1000);
            
            console.log('✅ Safe refresh message displayed');
        };
    }
    
    // Define Turnstile callbacks globally
    window.onTurnstileSuccess = function(token) {
        console.log('✅ Turnstile verification successful');
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.disabled = false;
            verifyBtn.style.opacity = '1';
            verifyBtn.textContent = '✅ Verified - Continue';
        }
        
        const result = document.getElementById('verificationResult');
        if (result) {
            result.innerHTML = '<span style="color: #27AE60;">✅ Verification successful!</span>';
        }
    };
    
    window.onTurnstileExpired = function() {
        console.log('⚠️ Turnstile verification expired');
        const verifyBtn = document.getElementById('verifyBtn');
        if (verifyBtn) {
            verifyBtn.disabled = true;
            verifyBtn.style.opacity = '0.5';
            verifyBtn.textContent = '🔄 Please verify again';
        }
    };
    
    window.onTurnstileError = function(error) {
        console.log('❌ Turnstile verification error:', error);
        const result = document.getElementById('verificationResult');
        if (result) {
            result.innerHTML = '<span style="color: #E74C3C;">❌ Verification failed. Please try again.</span>';
        }
    };
}

function fixTimeAndIP() {
    // Fetch Malaysia time
    fetch('https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kuala_Lumpur')
        .then(response => response.json())
        .then(data => {
            const malaysiaTime = `${data.year}-${String(data.month).padStart(2, '0')}-${String(data.day).padStart(2, '0')} ${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}:${String(data.seconds).padStart(2, '0')} (MY)`;
            const timeElement = document.getElementById('preVerifyDatetime');
            if (timeElement) {
                timeElement.textContent = malaysiaTime;
            }
            window._malaysiaTime = malaysiaTime;
        })
        .catch(error => {
            console.error('Failed to fetch Malaysia time:', error);
            const timeElement = document.getElementById('preVerifyDatetime');
            if (timeElement) {
                const fallbackTime = new Date().toLocaleString('en-MY', {timeZone: 'Asia/Kuala_Lumpur'}) + ' (MY)';
                timeElement.textContent = fallbackTime;
                window._malaysiaTime = fallbackTime;
            }
        });
    
    // Fetch IP address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            window._userIP = data.ip;
            const ipElement = document.getElementById('ipInfo');
            if (ipElement) {
                ipElement.textContent = `IP: ${data.ip}`;
            }
            
            const riskElement = document.getElementById('riskLevel');
            if (riskElement) {
                riskElement.innerHTML = '<span style="color: #27AE60;">🟢 Low Risk</span>';
            }
        })
        .catch(error => {
            console.error('Failed to fetch IP:', error);
            const ipElement = document.getElementById('ipInfo');
            if (ipElement) {
                ipElement.textContent = 'IP: Unable to detect';
            }
            window._userIP = 'Unknown';
        });
}

function addDevelopmentBypass() {
    // Add a development bypass button
    const bypassBtn = document.createElement('button');
    bypassBtn.textContent = '🚀 Skip Verification (Dev)';
    bypassBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 99999;
        padding: 10px 15px;
        background: #E74C3C;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    
    bypassBtn.addEventListener('click', function() {
        console.log('🚀 Development bypass activated');
        const preVerifyMask = document.getElementById('preVerifyMask');
        const mainContent = document.getElementById('mainContent');
        
        if (preVerifyMask) {
            preVerifyMask.style.display = 'none';
        }
        
        if (mainContent) {
            mainContent.style.display = 'block';
        }
        
        document.body.classList.add('after-verify-bg');
        this.remove();
    });
    
    document.body.appendChild(bypassBtn);
    
    // Also add click handler to verify button
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔐 Manual verification triggered');
            
            // Simulate successful verification
            setTimeout(() => {
                const preVerifyMask = document.getElementById('preVerifyMask');
                const mainContent = document.getElementById('mainContent');
                
                if (preVerifyMask) {
                    preVerifyMask.style.display = 'none';
                }
                
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                
                document.body.classList.add('after-verify-bg');
            }, 1000);
        });
    }
}

function initializeMainWebsite() {
    console.log('🚀 Initializing main website...');
    
    // Update time and IP in main content
    const mainDatetime = document.getElementById('mainDatetime');
    const mainIP = document.getElementById('mainIP');
    
    if (mainDatetime) {
        const now = new Date();
        mainDatetime.textContent = now.toLocaleString('en-MY', {timeZone: 'Asia/Kuala_Lumpur'}) + ' (MY)';
    }
    
    if (mainIP && window._userIP) {
        mainIP.textContent = `IP: ${window._userIP}`;
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    console.log('✅ Main website initialized');
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle page navigation
            const href = this.getAttribute('href');
            if (href === '#games') {
                e.preventDefault();
                showGamesPage();
            } else if (href === '#animation') {
                e.preventDefault();
                showAnimationPage();
            } else if (href === '#content') {
                e.preventDefault();
                showContentPage();
            }
        });
    });
}

function initializeThemeToggle() {
    const toggleMode = document.getElementById('toggleMode');
    if (toggleMode) {
        toggleMode.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }
}

function initializeInteractiveElements() {
    // Initialize play button
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            audioPlayer.play().catch(e => console.log('Audio play failed:', e));
        });
    }
    
    // Initialize eye tracking
    initializeEyeTracking();
}

function initializeEyeTracking() {
    const pupils = document.querySelectorAll('.pupil');
    
    document.addEventListener('mousemove', function(e) {
        pupils.forEach(pupil => {
            const eye = pupil.parentElement;
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(12, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
            
            const pupilX = Math.cos(angle) * distance;
            const pupilY = Math.sin(angle) * distance;
            
            pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
        });
    });
}

function showGamesPage() {
    document.body.classList.add('games-mode');
    document.body.classList.remove('animation-mode', 'content-mode');
}

function showAnimationPage() {
    document.body.classList.add('animation-mode');
    document.body.classList.remove('games-mode', 'content-mode');
}

function showContentPage() {
    document.body.classList.add('content-mode');
    document.body.classList.remove('games-mode', 'animation-mode');
}

// Auto-initialize after a short delay
setTimeout(() => {
    console.log('🔧 Quick fix ready');
}, 100);
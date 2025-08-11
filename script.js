// Main Website Script - 主要网站脚本
console.log('🚀 Main script loading...');

// 全局变量
let isVerified = false;
let verificationComplete = false;

// 验证成功回调函数
window.onTurnstileSuccess = function(token) {
    console.log('✅ Turnstile verification successful');
    
    // 启用验证按钮
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = false;
        verifyBtn.style.opacity = '1';
        verifyBtn.innerHTML = '<span>✓</span> Verification Complete - Continue';
    }
    
    // 显示成功消息
    const result = document.getElementById('verificationResult');
    if (result) {
        result.innerHTML = `
            <div style="color: #27AE60; text-align: center; padding: 15px; background: rgba(39,174,96,0.1); border-radius: 8px;">
                <p style="margin: 0 0 10px 0;">✅ Verification successful!</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Click "Verification Complete - Continue" to proceed</p>
            </div>
        `;
    }
    
    isVerified = true;
};

// 验证过期回调
window.onTurnstileExpired = function() {
    console.log('⚠️ Turnstile verification expired');
    const verifyBtn = document.getElementById('verifyBtn');
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.style.opacity = '0.5';
        verifyBtn.innerHTML = '<span>🛡️</span> Verify I\'m Human';
    }
    isVerified = false;
};

// 验证错误回调
window.onTurnstileError = function(error) {
    console.log('❌ Turnstile verification error:', error);
    const result = document.getElementById('verificationResult');
    if (result) {
        result.innerHTML = `
            <div style="color: #E74C3C; text-align: center; padding: 15px; background: rgba(231,76,60,0.1); border-radius: 8px;">
                <p style="margin: 0 0 10px 0;">❌ Verification failed</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">Please try again or refresh the page</p>
            </div>
        `;
    }
    isVerified = false;
};

// 验证完成后的跳转动画
function proceedToMainSite() {
    console.log('🎯 Starting transition to main site...');
    
    const preVerifyMask = document.getElementById('preVerifyMask');
    const mainContent = document.getElementById('mainContent');
    
    if (!preVerifyMask || !mainContent) {
        console.error('❌ Required elements not found');
        return;
    }
    
    // 显示过渡动画
    preVerifyMask.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
    preVerifyMask.style.opacity = '0';
    preVerifyMask.style.transform = 'scale(0.95)';
    
    // 1.5秒后隐藏验证页面并显示主内容
    setTimeout(() => {
        preVerifyMask.style.display = 'none';
        mainContent.style.display = 'block';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        // 主内容淡入动画
        setTimeout(() => {
            mainContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            mainContent.style.opacity = '1';
            mainContent.style.transform = 'translateY(0)';
            
            console.log('✅ Transition to main site complete');
            verificationComplete = true;
            
            // 初始化主网站功能
            initializeMainSite();
        }, 100);
    }, 1500);
}

// 初始化主网站功能
function initializeMainSite() {
    console.log('🏠 Initializing main site features...');
    
    // 更新时间显示
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // 获取IP信息
    updateIPInfo();
    
    // 初始化导航
    initializeNavigation();
    
    // 初始化交互功能
    initializeInteractions();
    
    console.log('✅ Main site initialization complete');
}

// 更新时间显示
function updateDateTime() {
    const now = new Date();
    const malaysiaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kuala_Lumpur"}));
    const timeString = malaysiaTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    
    // 更新所有时间显示元素
    const timeElements = ['preVerifyDatetime', 'mainDatetime', 'contentDatetime'];
    timeElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = timeString;
        }
    });
}

// 更新IP信息
async function updateIPInfo() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        
        // 更新所有IP显示元素
        const ipElements = ['ipInfo', 'mainIP', 'contentIP'];
        ipElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = ip;
            }
        });
        
        // 更新风险级别（简单的模拟）
        const riskElement = document.getElementById('riskLevel');
        if (riskElement) {
            riskElement.textContent = 'Low Risk';
            riskElement.style.color = '#27AE60';
        }
        
    } catch (error) {
        console.log('⚠️ Could not fetch IP info:', error);
        const ipElements = ['ipInfo', 'mainIP', 'contentIP'];
        ipElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Unable to detect';
            }
        });
    }
}

// 初始化导航功能
function initializeNavigation() {
    console.log('🧭 Initializing navigation...');
    
    // Games页面导航
    const gamesNav = document.getElementById('gamesNav');
    if (gamesNav) {
        gamesNav.addEventListener('click', function(e) {
            e.preventDefault();
            showGamesPage();
        });
    }
    
    // Animation页面导航
    const animationNav = document.getElementById('animationNav');
    if (animationNav) {
        animationNav.addEventListener('click', function(e) {
            e.preventDefault();
            showAnimationPage();
        });
    }
    
    // Content页面导航
    const contentNav = document.getElementById('contentNav');
    if (contentNav) {
        contentNav.addEventListener('click', function(e) {
            e.preventDefault();
            showContentPage();
        });
    }
    
    // 返回Home按钮
    const backButtons = document.querySelectorAll('#backHomeBtn, #backHomeBtnAnim, #backHomeBtnGames');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showHomePage();
        });
    });
}

// 显示Games页面
function showGamesPage() {
    console.log('🎮 Showing games page...');
    hideAllPages();
    const gamesPage = document.getElementById('gamesPage');
    if (gamesPage) {
        gamesPage.style.display = 'flex';
        document.body.classList.add('games-mode');
    }
}

// 显示Animation页面
function showAnimationPage() {
    console.log('✨ Showing animation page...');
    hideAllPages();
    const animationPage = document.getElementById('animationPage');
    if (animationPage) {
        animationPage.style.display = 'block';
        document.body.classList.add('animation-mode');
        // 初始化星空动画
        if (typeof initStarryNight === 'function') {
            initStarryNight();
        }
    }
}

// 显示Content页面
function showContentPage() {
    console.log('📄 Showing content page...');
    hideAllPages();
    const contentPage = document.getElementById('contentPage');
    if (contentPage) {
        contentPage.style.display = 'block';
        document.body.classList.add('content-mode');
    }
}

// 显示Home页面
function showHomePage() {
    console.log('🏠 Showing home page...');
    hideAllPages();
    const homePage = document.querySelector('.home-page');
    const sections = document.querySelectorAll('.section');
    
    if (homePage) {
        homePage.style.display = 'block';
    }
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    document.body.classList.remove('games-mode', 'animation-mode', 'content-mode');
}

// 隐藏所有页面
function hideAllPages() {
    const pages = ['#gamesPage', '#animationPage', '#contentPage'];
    pages.forEach(pageId => {
        const page = document.querySelector(pageId);
        if (page) {
            page.style.display = 'none';
        }
    });
    
    const homePage = document.querySelector('.home-page');
    const sections = document.querySelectorAll('.section');
    
    if (homePage) {
        homePage.style.display = 'none';
    }
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// 初始化交互功能
function initializeInteractions() {
    console.log('🎯 Initializing interactions...');
    
    // 播放按钮
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    
    if (playButton && audioPlayer) {
        playButton.addEventListener('click', function() {
            audioPlayer.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        });
    }
    
    // 主题切换
    const toggleMode = document.getElementById('toggleMode');
    if (toggleMode) {
        toggleMode.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded, initializing...');
    
    // 立即开始更新时间和IP
    updateDateTime();
    updateIPInfo();
    
    // 设置表单提交处理
    const captchaForm = document.getElementById('captchaForm');
    if (captchaForm) {
        captchaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (isVerified) {
                console.log('✅ Verification confirmed, proceeding to main site...');
                proceedToMainSite();
            } else {
                console.log('⚠️ Verification not complete');
                const result = document.getElementById('verificationResult');
                if (result) {
                    result.innerHTML = `
                        <div style="color: #F39C12; text-align: center; padding: 15px; background: rgba(243,156,18,0.1); border-radius: 8px;">
                            <p style="margin: 0;">⚠️ Please complete the verification first</p>
                        </div>
                    `;
                }
            }
        });
    }
    
    console.log('✅ Script initialization complete');
});
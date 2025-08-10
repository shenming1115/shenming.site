// 紧急修复脚本 - 解决home页面空白问题
console.log('🚨 Emergency Fix Script Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying emergency fixes...');
    
    // 1. 强制显示主要内容
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        console.log('✅ Main content forced visible');
    }
    
    // 2. 强制显示home页面
    const homePage = document.querySelector('.home-page');
    if (homePage) {
        homePage.style.display = 'block';
        homePage.style.visibility = 'visible';
        homePage.style.opacity = '1';
        console.log('✅ Home page forced visible');
    }
    
    // 3. 隐藏安全验证遮罩
    const securityOverlay = document.getElementById('preVerifyMask');
    if (securityOverlay) {
        securityOverlay.style.display = 'none';
        console.log('✅ Security overlay hidden');
    }
    
    // 4. 确保导航栏可见
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.display = 'flex';
        navbar.style.visibility = 'visible';
        navbar.style.opacity = '1';
        console.log('✅ Navbar forced visible');
    }
    
    // 5. 确保hero section可见
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.display = 'flex';
        heroSection.style.visibility = 'visible';
        heroSection.style.opacity = '1';
        console.log('✅ Hero section forced visible');
    }
    
    // 6. 修复图片显示
    const characterImage = document.querySelector('.character-wrapper img');
    if (characterImage) {
        characterImage.style.display = 'block';
        characterImage.style.width = '300px';
        characterImage.style.height = '200px';
        characterImage.style.objectFit = 'cover';
        characterImage.style.borderRadius = '12px';
        console.log('✅ Character image fixed');
    }
    
    // 7. 移除可能的隐藏类
    document.body.classList.remove('loading', 'hidden', 'security-check');
    document.body.classList.add('loaded');
    
    // 8. 强制移除所有可能导致空白的样式
    const allElements = document.querySelectorAll('*[style*="display: none"], *[style*="visibility: hidden"], *[style*="opacity: 0"]');
    allElements.forEach(el => {
        if (!el.classList.contains('games-page') && !el.classList.contains('animation-page') && el.id !== 'preVerifyMask') {
            el.style.display = '';
            el.style.visibility = '';
            el.style.opacity = '';
        }
    });
    
    // 9. 添加基本样式确保内容可见
    const emergencyStyles = document.createElement('style');
    emergencyStyles.innerHTML = `
        /* 紧急修复样式 */
        #mainContent {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .home-page {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .hero-section {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            min-height: 100vh;
            align-items: center;
            justify-content: space-between;
            padding: 2rem;
            gap: 2rem;
        }
        
        .navbar {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
        
        .character-wrapper img {
            display: block !important;
            width: 300px !important;
            height: 200px !important;
            object-fit: cover !important;
            border-radius: 12px !important;
        }
        
        /* 隐藏安全验证 */
        #preVerifyMask {
            display: none !important;
        }
        
        /* 确保games和animation页面默认隐藏 */
        .games-page,
        .animation-page {
            display: none !important;
        }
        
        /* 当处于games模式时显示games页面 */
        body.games-mode .games-page {
            display: flex !important;
        }
        
        body.games-mode .home-page,
        body.games-mode .section {
            display: none !important;
        }
    `;
    document.head.appendChild(emergencyStyles);
    
    // 10. 添加简单的导航功能
    const gamesLink = document.querySelector('a[href="#games"]');
    if (gamesLink) {
        gamesLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎮 Games link clicked');
            
            // 隐藏home内容
            document.querySelectorAll('.home-page, .section').forEach(el => {
                el.style.display = 'none';
            });
            
            // 显示games页面
            const gamesPage = document.querySelector('.games-page');
            if (gamesPage) {
                gamesPage.style.display = 'flex';
                document.body.classList.add('games-mode');
            }
        });
    }
    
    // 11. 添加返回home功能
    const homeLinks = document.querySelectorAll('a[href="#home"], .back-btn');
    homeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏠 Back to home');
            
            // 显示home内容
            document.querySelectorAll('.home-page, .section').forEach(el => {
                el.style.display = 'block';
            });
            
            // 隐藏其他页面
            document.querySelectorAll('.games-page, .animation-page').forEach(el => {
                el.style.display = 'none';
            });
            
            document.body.classList.remove('games-mode', 'animation-mode');
        });
    });
    
    // 12. 添加状态指示器
    const statusDiv = document.createElement('div');
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27AE60;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 99999;
        font-size: 14px;
        font-weight: bold;
    `;
    statusDiv.textContent = '✅ 紧急修复已应用';
    document.body.appendChild(statusDiv);
    
    // 5秒后移除状态指示器
    setTimeout(() => {
        statusDiv.remove();
    }, 5000);
    
    console.log('✅ Emergency fixes applied successfully!');
    console.log('📊 Page should now be visible with working navigation');
});
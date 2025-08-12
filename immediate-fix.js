// 立即修复脚本 - 确保网站基本功能正常
console.log('🚨 Immediate fix script loading...');

// 立即隐藏验证页面，显示主内容
function forceShowMainContent() {
    console.log('🔧 Forcing main content to show...');
    
    // 隐藏验证页面
    const preVerifyMask = document.getElementById('preVerifyMask');
    if (preVerifyMask) {
        preVerifyMask.style.display = 'none';
        console.log('✅ Verification mask hidden');
    }
    
    // 显示主内容
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.visibility = 'visible';
        mainContent.style.opacity = '1';
        console.log('✅ Main content shown');
    }
    
    // 显示home页面
    const homePage = document.querySelector('.home-page');
    if (homePage) {
        homePage.style.display = 'block';
        homePage.style.visibility = 'visible';
        homePage.style.opacity = '1';
        console.log('✅ Home page shown');
    }
    
    // 显示所有sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    console.log('✅ All sections shown');
}

// 设置导航功能
function setupNavigation() {
    console.log('🧭 Setting up navigation...');
    
    // Games导航
    const gamesNav = document.querySelector('a[href="#games"]');
    if (gamesNav) {
        gamesNav.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎮 Games clicked');
            
            // 隐藏其他内容
            hideAllContent();
            
            // 显示games页面
            const gamesPage = document.getElementById('gamesPage');
            if (gamesPage) {
                gamesPage.style.display = 'flex';
                gamesPage.style.visibility = 'visible';
                gamesPage.style.opacity = '1';
                document.body.classList.add('games-mode');
                console.log('✅ Games page shown');
                
                // 初始化Tetris游戏
                setTimeout(() => {
                    if (typeof TetrisGame !== 'undefined') {
                        try {
                            // 如果已有实例，先清理
                            if (window.tetrisGameInstance) {
                                window.tetrisGameInstance = null;
                            }
                            window.tetrisGameInstance = new TetrisGame();
                            console.log('✅ Tetris game initialized');
                        } catch (error) {
                            console.error('❌ Tetris initialization failed:', error);
                            // 尝试重新加载tetris-game.js
                            const script = document.createElement('script');
                            script.src = 'tetris-game.js';
                            script.onload = () => {
                                try {
                                    window.tetrisGameInstance = new TetrisGame();
                                    console.log('✅ Tetris game initialized after reload');
                                } catch (e) {
                                    console.error('❌ Tetris still failed after reload:', e);
                                }
                            };
                            document.head.appendChild(script);
                        }
                    } else {
                        console.error('❌ TetrisGame class not found, trying to load script...');
                        // 尝试加载tetris-game.js
                        const script = document.createElement('script');
                        script.src = 'tetris-game.js';
                        script.onload = () => {
                            setTimeout(() => {
                                try {
                                    window.tetrisGameInstance = new TetrisGame();
                                    console.log('✅ Tetris game initialized after script load');
                                } catch (e) {
                                    console.error('❌ Tetris failed after script load:', e);
                                }
                            }, 100);
                        };
                        document.head.appendChild(script);
                    }
                 }, 500);
            }
        });
        console.log('✅ Games navigation set up');
    }
    
    // Animation导航
    const animationNav = document.querySelector('a[href="#animation"]');
    if (animationNav) {
        animationNav.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('✨ Animation clicked');
            
            // 隐藏其他内容
            hideAllContent();
            
            // 显示animation页面
            const animationPage = document.getElementById('animationPage');
            if (animationPage) {
                animationPage.style.display = 'block';
                animationPage.style.visibility = 'visible';
                animationPage.style.opacity = '1';
                document.body.classList.add('animation-mode');
                console.log('✅ Animation page shown');
            }
        });
        console.log('✅ Animation navigation set up');
    }
    
    // Content导航
    const contentNav = document.querySelector('a[href="#content"]');
    if (contentNav) {
        contentNav.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('📄 Content clicked');
            
            // 隐藏其他内容
            hideAllContent();
            
            // 显示content页面
            const contentPage = document.getElementById('contentPage');
            if (contentPage) {
                contentPage.style.display = 'block';
                contentPage.style.visibility = 'visible';
                contentPage.style.opacity = '1';
                document.body.classList.add('content-mode');
                console.log('✅ Content page shown');
            }
        });
        console.log('✅ Content navigation set up');
    }
    
    // Home导航
    const homeNav = document.querySelector('a[href="#home"]');
    if (homeNav) {
        homeNav.addEventListener('click', function(e) {
            e.preventDefault();
            showHomePage();
        });
    }
    
    // 返回按钮
    const backButtons = document.querySelectorAll('.back-btn, #backHomeBtn, #backHomeBtnAnim, #backHomeBtnGames');
    backButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showHomePage();
        });
    });
    
    console.log('✅ All navigation set up');
}

// 隐藏所有内容
function hideAllContent() {
    // 隐藏home和sections
    const homePage = document.querySelector('.home-page');
    const sections = document.querySelectorAll('.section');
    
    if (homePage) {
        homePage.style.display = 'none';
    }
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // 隐藏其他页面
    const pages = ['#gamesPage', '#animationPage', '#contentPage'];
    pages.forEach(pageId => {
        const page = document.querySelector(pageId);
        if (page) {
            page.style.display = 'none';
        }
    });
    
    // 清除body classes
    document.body.classList.remove('games-mode', 'animation-mode', 'content-mode');
}

// 显示home页面
function showHomePage() {
    console.log('🏠 Showing home page');
    
    hideAllContent();
    
    // 显示home内容
    const homePage = document.querySelector('.home-page');
    const sections = document.querySelectorAll('.section');
    
    if (homePage) {
        homePage.style.display = 'block';
        homePage.style.visibility = 'visible';
        homePage.style.opacity = '1';
    }
    
    sections.forEach(section => {
        section.style.display = 'block';
        section.style.visibility = 'visible';
        section.style.opacity = '1';
    });
    
    console.log('✅ Home page shown');
}

// 立即执行修复
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM loaded, applying immediate fixes...');
        setTimeout(() => {
            forceShowMainContent();
            setupNavigation();
        }, 100);
    });
} else {
    console.log('📄 DOM already loaded, applying immediate fixes...');
    setTimeout(() => {
        forceShowMainContent();
        setupNavigation();
    }, 100);
}

// 作为备用，3秒后强制显示内容
setTimeout(() => {
    console.log('⏰ Backup timer: forcing content display...');
    forceShowMainContent();
    setupNavigation();
}, 3000);

console.log('✅ Immediate fix script loaded');
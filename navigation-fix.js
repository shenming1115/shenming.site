// Navigation Fix Script - Ensure games page works correctly
console.log('🔧 Navigation Fix Script Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Setting up navigation fixes...');
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('.navbar a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === '#games') {
            console.log('🎮 Found games navigation link');
            // Add click handler for games
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🎮 Games link clicked - showing games page');
                
                // Hide all other pages
                const homePages = document.querySelectorAll('.home-page, .section, .animation-page, .content-page');
                homePages.forEach(page => {
                    page.style.display = 'none';
                });
                
                // Show games page
                const gamesPage = document.querySelector('.games-page');
                if (gamesPage) {
                    gamesPage.style.display = 'flex';
                    console.log('✅ Games page displayed');
                    
                    // Initialize Tetris game if not already done
                    if (typeof TetrisGame !== 'undefined' && !window.tetrisGameInstance) {
                        try {
                            window.tetrisGameInstance = new TetrisGame();
                            console.log('✅ Tetris game initialized');
                        } catch (error) {
                            console.error('❌ Failed to initialize Tetris game:', error);
                        }
                    }
                } else {
                    console.error('❌ Games page not found');
                }
                
                // Update active nav state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Add body class for styling
                document.body.classList.add('games-mode');
                document.body.classList.remove('animation-mode', 'content-mode');
            });
        } else if (href === '#home' || href === '#') {
            // Home navigation
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🏠 Home link clicked');
                
                // Show home content
                const homePages = document.querySelectorAll('.home-page, .section');
                homePages.forEach(page => {
                    page.style.display = 'block';
                });
                
                // Hide games page
                const gamesPage = document.querySelector('.games-page');
                if (gamesPage) {
                    gamesPage.style.display = 'none';
                }
                
                // Update active nav state
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Remove body classes
                document.body.classList.remove('games-mode', 'animation-mode', 'content-mode');
            });
        }
    });
    
    // Add a direct test button
    const testBtn = document.createElement('button');
    testBtn.textContent = '🎮 Test Games Page';
    testBtn.style.cssText = `
        position: fixed;
        top: 140px;
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
        console.log('🧪 Direct games test clicked');
        
        // Force show games page
        const gamesPage = document.querySelector('.games-page');
        if (gamesPage) {
            // Hide everything else
            document.querySelectorAll('.home-page, .section, .animation-page, .content-page').forEach(el => {
                el.style.display = 'none';
            });
            
            // Show games page
            gamesPage.style.display = 'flex';
            document.body.classList.add('games-mode');
            console.log('✅ Games page force-displayed');
            
            // Try to initialize Tetris
            if (typeof TetrisGame !== 'undefined') {
                if (!window.tetrisGameInstance) {
                    try {
                        window.tetrisGameInstance = new TetrisGame();
                        console.log('✅ Tetris game initialized via test button');
                    } catch (error) {
                        console.error('❌ Tetris initialization failed:', error);
                    }
                }
            } else {
                console.log('⚠️ TetrisGame class not found');
            }
        } else {
            console.error('❌ Games page element not found');
        }
    });
    
    document.body.appendChild(testBtn);
    console.log('✅ Navigation fixes applied');
});
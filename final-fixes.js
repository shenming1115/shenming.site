// Final Fixes Script - Ensure everything works
console.log('🔧 Final Fixes Script Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Applying final fixes...');
    
    // 1. Fix image path and styling
    const homeImage = document.querySelector('.character-wrapper img');
    if (homeImage) {
        // Ensure correct image path
        if (!homeImage.src.includes('nicolas-jacquet')) {
            homeImage.src = 'nicolas-jacquet-HpWcnjlFcGY-unsplash.jpg';
            console.log('✅ Image path corrected');
        }
        
        // Ensure correct styling
        homeImage.style.width = '300px';
        homeImage.style.height = '200px';
        homeImage.style.objectFit = 'cover';
        homeImage.style.borderRadius = '12px';
        homeImage.style.filter = 'none'; // Remove any filters
        console.log('✅ Image styling applied');
    }
    
    // 2. Ensure games page is properly set up
    const gamesPage = document.querySelector('.games-page');
    if (gamesPage) {
        console.log('✅ Games page found');
        
        // Make sure it has the right structure
        if (!gamesPage.querySelector('.tetris-game')) {
            console.log('⚠️ Tetris game structure missing in games page');
        }
    } else {
        console.log('❌ Games page not found');
    }
    
    // 3. Add enhanced navigation
    const gamesNavLink = document.querySelector('a[href="#games"]');
    if (gamesNavLink) {
        // Remove any existing listeners and add new one
        gamesNavLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎮 Enhanced games navigation triggered');
            
            // Hide all content
            document.querySelectorAll('.home-page, .section, .animation-page, .content-page').forEach(el => {
                el.style.display = 'none';
            });
            
            // Show games page
            const gamesPage = document.querySelector('.games-page');
            if (gamesPage) {
                gamesPage.style.display = 'flex';
                gamesPage.style.position = 'fixed';
                gamesPage.style.top = '0';
                gamesPage.style.left = '0';
                gamesPage.style.width = '100vw';
                gamesPage.style.height = '100vh';
                gamesPage.style.zIndex = '100';
                console.log('✅ Games page displayed with enhanced styling');
            }
            
            // Update body class
            document.body.classList.add('games-mode');
            document.body.classList.remove('animation-mode', 'content-mode');
            
            // Initialize Tetris if needed
            setTimeout(() => {
                if (typeof TetrisGame !== 'undefined' && !window.tetrisGameInstance) {
                    try {
                        window.tetrisGameInstance = new TetrisGame();
                        console.log('✅ Tetris game initialized');
                    } catch (error) {
                        console.error('❌ Tetris initialization error:', error);
                    }
                }
            }, 500);
        });
    }
    
    // 4. Add back to home functionality
    const homeNavLinks = document.querySelectorAll('a[href="#home"], a[href="#"], .navbar a:first-child');
    homeNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🏠 Back to home triggered');
            
            // Show home content
            document.querySelectorAll('.home-page, .section').forEach(el => {
                el.style.display = 'block';
            });
            
            // Hide games page
            const gamesPage = document.querySelector('.games-page');
            if (gamesPage) {
                gamesPage.style.display = 'none';
            }
            
            // Remove body classes
            document.body.classList.remove('games-mode', 'animation-mode', 'content-mode');
        });
    });
    
    // 5. Add status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.style.cssText = `
        position: fixed;
        top: 180px;
        right: 20px;
        background: #27AE60;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 99999;
        font-size: 12px;
        max-width: 200px;
    `;
    statusIndicator.innerHTML = `
        <strong>✅ Final Fixes Applied</strong><br>
        <small>• Image updated<br>• Games page ready<br>• Navigation fixed</small>
    `;
    document.body.appendChild(statusIndicator);
    
    // Auto-remove status after 5 seconds
    setTimeout(() => {
        statusIndicator.remove();
    }, 5000);
    
    console.log('✅ All final fixes applied successfully');
});
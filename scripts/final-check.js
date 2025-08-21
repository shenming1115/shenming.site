// Final Check Script - Verify all requirements are met
console.log('🔍 Running final check...');

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('📋 Final Check Results:');
        
        // 1. Check Games interface shows Tetris (not starry sky)
        const gamesPage = document.getElementById('gamesPage');
        const tetrisCanvas = document.getElementById('tetrisCanvas');
        const starryCanvas = document.getElementById('starryNightCanvas');
        
        console.log('1. Games Interface Check:');
        if (gamesPage && tetrisCanvas) {
            console.log('   ✅ Games page exists with Tetris canvas');
        } else {
            console.log('   ❌ Games page or Tetris canvas missing');
        }
        
        // Check if games page shows tetris content
        const gameHeader = document.querySelector('.game-header h1');
        if (gameHeader && gameHeader.textContent.includes('Tetris')) {
            console.log('   ✅ Games page shows Tetris content');
        } else {
            console.log('   ❌ Games page does not show Tetris content');
        }
        
        // 2. Check home page image
        const homeImage = document.querySelector('.character-wrapper img');
        console.log('2. Home Page Image Check:');
        if (homeImage) {
            const imageSrc = homeImage.src;
            if (imageSrc.includes('nicolas-jacquet')) {
                console.log('   ✅ New image (nicolas-jacquet) is being used');
            } else {
                console.log('   ❌ Still using old image:', imageSrc);
            }
            
            // Check image styling
            const imageStyle = homeImage.style;
            if (imageStyle.width && imageStyle.height && imageStyle.objectFit) {
                console.log('   ✅ Image has proper rectangular styling');
            } else {
                console.log('   ❌ Image styling needs adjustment');
            }
        } else {
            console.log('   ❌ Home page image not found');
        }
        
        // 3. Check Tetris game functionality
        console.log('3. Tetris Game Functionality Check:');
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const scoreElement = document.getElementById('score');
        
        if (startBtn && pauseBtn && resetBtn && scoreElement) {
            console.log('   ✅ All Tetris game controls present');
        } else {
            console.log('   ❌ Some Tetris game controls missing');
        }
        
        // Check if TetrisGame class exists
        if (typeof TetrisGame !== 'undefined' || window.TetrisGame) {
            console.log('   ✅ TetrisGame class available');
        } else {
            console.log('   ❌ TetrisGame class not found');
        }
        
        // Test navigation to games page
        const gamesNavLink = document.querySelector('a[href="#games"]');
        if (gamesNavLink) {
            console.log('   ✅ Games navigation link exists');
            
            // Test click (but don't actually navigate)
            console.log('   🧪 Testing games navigation...');
        } else {
            console.log('   ❌ Games navigation link missing');
        }
        
        // Summary
        console.log('📊 Final Check Summary:');
        console.log('   - Games page should show Tetris (not stars)');
        console.log('   - Home page should show new rectangular image');
        console.log('   - Tetris game should be playable with controls');
        
        // Create visual indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #27AE60;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 99999;
            font-size: 14px;
            max-width: 250px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        indicator.innerHTML = `
            <strong>🔍 Final Check Complete</strong><br>
            <small>Check console for detailed results</small><br>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 10px;
                padding: 5px 10px;
                background: white;
                color: #27AE60;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Close</button>
        `;
        document.body.appendChild(indicator);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (indicator.parentElement) {
                indicator.remove();
            }
        }, 10000);
        
    }, 2000);
});

// Add test buttons for manual verification
setTimeout(() => {
    const testContainer = document.createElement('div');
    testContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 99999;
        font-size: 12px;
    `;
    testContainer.innerHTML = `
        <strong>🧪 Manual Tests</strong><br>
        <button onclick="testGamesPage()" style="margin: 5px; padding: 5px 10px; background: #3498DB; color: white; border: none; border-radius: 4px; cursor: pointer;">Test Games</button>
        <button onclick="testImageChange()" style="margin: 5px; padding: 5px 10px; background: #9B59B6; color: white; border: none; border-radius: 4px; cursor: pointer;">Check Image</button>
        <button onclick="this.parentElement.remove()" style="margin: 5px; padding: 5px 10px; background: #E74C3C; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
    `;
    document.body.appendChild(testContainer);
    
    // Test functions
    window.testGamesPage = function() {
        const gamesLink = document.querySelector('a[href="#games"]');
        if (gamesLink) {
            gamesLink.click();
            console.log('🎮 Clicked games link - check if Tetris appears');
        }
    };
    
    window.testImageChange = function() {
        const img = document.querySelector('.character-wrapper img');
        if (img) {
            console.log('🖼️ Current image:', img.src);
            console.log('🖼️ Image style:', img.style.cssText);
        }
    };
}, 3000);
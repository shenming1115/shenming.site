// Tetris Module - Handle Tetris game functionality

export function initializeTetris() {
    console.log('🎮 Tetris module initialized');
    
    // Initialize game when games page is accessed
    setupGameNavigation();
    
    // Initialize game components
    setupGameComponents();
}

function setupGameNavigation() {
    // Handle games page navigation
    const gamesLink = document.querySelector('a[href="#games"]');
    if (gamesLink) {
        gamesLink.addEventListener('click', (e) => {
            e.preventDefault();
            showGamesPage();
        });
    }
    
    // Handle back to home buttons
    const backBtns = document.querySelectorAll('#backHomeBtnGames, #backHomeBtnAnim');
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideGamesPage();
            hideAnimationPage();
        });
    });
}

function setupGameComponents() {
    // Game state
    let gameState = {
        board: [],
        currentPiece: null,
        nextPiece: null,
        score: 0,
        lines: 0,
        level: 1,
        isPlaying: false,
        isPaused: false,
        gameLoop: null
    };
    
    // Tetris pieces
    const pieces = {
        I: {
            shape: [[1,1,1,1]],
            color: '#00FFFF'
        },
        O: {
            shape: [[1,1],[1,1]],
            color: '#FFFF00'
        },
        T: {
            shape: [[0,1,0],[1,1,1]],
            color: '#800080'
        },
        S: {
            shape: [[0,1,1],[1,1,0]],
            color: '#00FF00'
        },
        Z: {
            shape: [[1,1,0],[0,1,1]],
            color: '#FF0000'
        },
        J: {
            shape: [[1,0,0],[1,1,1]],
            color: '#0000FF'
        },
        L: {
            shape: [[0,0,1],[1,1,1]],
            color: '#FFA500'
        }
    };
    
    // Initialize game board
    function initBoard() {
        gameState.board = Array(20).fill().map(() => Array(10).fill(0));
    }
    
    // Generate random piece
    function generatePiece() {
        const pieceTypes = Object.keys(pieces);
        const randomType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        return {
            type: randomType,
            shape: pieces[randomType].shape,
            color: pieces[randomType].color,
            x: Math.floor(10 / 2) - Math.floor(pieces[randomType].shape[0].length / 2),
            y: 0
        };
    }
    
    // Setup game controls
    function setupControls() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        const playAgainBtn = document.getElementById('playAgainBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', togglePause);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetGame);
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                hideGameOver();
                startGame();
            });
        }
        
        // Keyboard controls
        document.addEventListener('keydown', handleKeyPress);
    }
    
    function handleKeyPress(e) {
        if (!gameState.isPlaying || gameState.isPaused) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                movePiece(0, 1);
                break;
            case 'ArrowUp':
                rotatePiece();
                break;
            case ' ':
                hardDrop();
                break;
        }
        e.preventDefault();
    }
    
    function startGame() {
        console.log('🎮 Starting Tetris game...');
        
        initBoard();
        gameState.currentPiece = generatePiece();
        gameState.nextPiece = generatePiece();
        gameState.score = 0;
        gameState.lines = 0;
        gameState.level = 1;
        gameState.isPlaying = true;
        gameState.isPaused = false;
        
        updateDisplay();
        hideGameOver();
        
        // Start game loop
        gameState.gameLoop = setInterval(gameStep, 1000 - (gameState.level - 1) * 100);
        
        // Update button states
        updateButtonStates();
    }
    
    function togglePause() {
        if (!gameState.isPlaying) return;
        
        gameState.isPaused = !gameState.isPaused;
        
        if (gameState.isPaused) {
            clearInterval(gameState.gameLoop);
            console.log('⏸️ Game paused');
        } else {
            gameState.gameLoop = setInterval(gameStep, 1000 - (gameState.level - 1) * 100);
            console.log('▶️ Game resumed');
        }
        
        updateButtonStates();
    }
    
    function resetGame() {
        console.log('🔄 Resetting game...');
        
        clearInterval(gameState.gameLoop);
        gameState.isPlaying = false;
        gameState.isPaused = false;
        
        initBoard();
        gameState.score = 0;
        gameState.lines = 0;
        gameState.level = 1;
        
        updateDisplay();
        hideGameOver();
        updateButtonStates();
    }
    
    function gameStep() {
        if (!movePiece(0, 1)) {
            // Piece can't move down, place it
            placePiece();
            clearLines();
            
            // Generate next piece
            gameState.currentPiece = gameState.nextPiece;
            gameState.nextPiece = generatePiece();
            
            // Check game over
            if (checkCollision(gameState.currentPiece, 0, 0)) {
                gameOver();
                return;
            }
        }
        
        updateDisplay();
    }
    
    function movePiece(dx, dy) {
        if (checkCollision(gameState.currentPiece, dx, dy)) {
            return false;
        }
        
        gameState.currentPiece.x += dx;
        gameState.currentPiece.y += dy;
        return true;
    }
    
    function rotatePiece() {
        const rotated = {
            ...gameState.currentPiece,
            shape: rotateMatrix(gameState.currentPiece.shape)
        };
        
        if (!checkCollision(rotated, 0, 0)) {
            gameState.currentPiece.shape = rotated.shape;
        }
    }
    
    function hardDrop() {
        while (movePiece(0, 1)) {
            gameState.score += 2;
        }
    }
    
    function checkCollision(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= 10 || boardY >= 20) {
                        return true;
                    }
                    
                    if (boardY >= 0 && gameState.board[boardY][boardX]) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    function placePiece() {
        const piece = gameState.currentPiece;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = piece.x + x;
                    const boardY = piece.y + y;
                    
                    if (boardY >= 0) {
                        gameState.board[boardY][boardX] = piece.color;
                    }
                }
            }
        }
    }
    
    function clearLines() {
        let linesCleared = 0;
        
        for (let y = gameState.board.length - 1; y >= 0; y--) {
            if (gameState.board[y].every(cell => cell !== 0)) {
                gameState.board.splice(y, 1);
                gameState.board.unshift(Array(10).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            gameState.lines += linesCleared;
            gameState.score += linesCleared * 100 * gameState.level;
            gameState.level = Math.floor(gameState.lines / 10) + 1;
            
            // Update game speed
            clearInterval(gameState.gameLoop);
            gameState.gameLoop = setInterval(gameStep, 1000 - (gameState.level - 1) * 100);
        }
    }
    
    function rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                rotated[x][rows - 1 - y] = matrix[y][x];
            }
        }
        
        return rotated;
    }
    
    function updateDisplay() {
        // Update score display
        const scoreElement = document.getElementById('score');
        const linesElement = document.getElementById('lines');
        const levelElement = document.getElementById('level');
        
        if (scoreElement) scoreElement.textContent = gameState.score;
        if (linesElement) linesElement.textContent = gameState.lines;
        if (levelElement) levelElement.textContent = gameState.level;
        
        // Update canvas (simplified - would need actual canvas rendering)
        drawGame();
    }
    
    function drawGame() {
        const canvas = document.getElementById('tetrisCanvas');
        const nextCanvas = document.getElementById('nextCanvas');
        
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            
            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw board
            const cellSize = 30;
            for (let y = 0; y < gameState.board.length; y++) {
                for (let x = 0; x < gameState.board[y].length; x++) {
                    if (gameState.board[y][x]) {
                        ctx.fillStyle = gameState.board[y][x];
                        ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
                    }
                }
            }
            
            // Draw current piece
            if (gameState.currentPiece) {
                ctx.fillStyle = gameState.currentPiece.color;
                for (let y = 0; y < gameState.currentPiece.shape.length; y++) {
                    for (let x = 0; x < gameState.currentPiece.shape[y].length; x++) {
                        if (gameState.currentPiece.shape[y][x]) {
                            const drawX = (gameState.currentPiece.x + x) * cellSize;
                            const drawY = (gameState.currentPiece.y + y) * cellSize;
                            ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
                        }
                    }
                }
            }
        }
        
        // Draw next piece
        if (nextCanvas && nextCanvas.getContext && gameState.nextPiece) {
            const ctx = nextCanvas.getContext('2d');
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
            
            ctx.fillStyle = gameState.nextPiece.color;
            const cellSize = 20;
            for (let y = 0; y < gameState.nextPiece.shape.length; y++) {
                for (let x = 0; x < gameState.nextPiece.shape[y].length; x++) {
                    if (gameState.nextPiece.shape[y][x]) {
                        ctx.fillRect(x * cellSize + 20, y * cellSize + 20, cellSize - 1, cellSize - 1);
                    }
                }
            }
        }
    }
    
    function gameOver() {
        console.log('💀 Game Over!');
        
        clearInterval(gameState.gameLoop);
        gameState.isPlaying = false;
        gameState.isPaused = false;
        
        // Update final score
        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = gameState.score;
        }
        
        // Show game over screen
        showGameOver();
        updateButtonStates();
    }
    
    function showGameOver() {
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'flex';
        }
    }
    
    function hideGameOver() {
        const gameOverElement = document.getElementById('gameOver');
        if (gameOverElement) {
            gameOverElement.style.display = 'none';
        }
    }
    
    function updateButtonStates() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const resetBtn = document.getElementById('resetBtn');
        
        if (startBtn) {
            startBtn.disabled = gameState.isPlaying;
            startBtn.textContent = gameState.isPlaying ? 'Playing...' : 'Start Game';
        }
        
        if (pauseBtn) {
            pauseBtn.disabled = !gameState.isPlaying;
            pauseBtn.textContent = gameState.isPaused ? 'Resume' : 'Pause';
        }
        
        if (resetBtn) {
            resetBtn.disabled = false;
        }
    }
    
    // Initialize controls
    setupControls();
    
    // Initialize display
    initBoard();
    updateDisplay();
    updateButtonStates();
}

function showGamesPage() {
    const gamesPage = document.getElementById('gamesPage');
    const mainContent = document.querySelector('.main-content');
    
    if (gamesPage && mainContent) {
        mainContent.style.display = 'none';
        gamesPage.style.display = 'block';
        document.body.classList.add('games-mode');
        console.log('🎮 Games page shown');
    }
}

function hideGamesPage() {
    const gamesPage = document.getElementById('gamesPage');
    const mainContent = document.querySelector('.main-content');
    
    if (gamesPage && mainContent) {
        gamesPage.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.classList.remove('games-mode');
        console.log('🏠 Returned to home page');
    }
}

function hideAnimationPage() {
    const animationPage = document.getElementById('animationPage');
    const mainContent = document.querySelector('.main-content');
    
    if (animationPage && mainContent) {
        animationPage.style.display = 'none';
        mainContent.style.display = 'block';
        document.body.classList.remove('animation-mode');
        console.log('🏠 Returned from animation page');
    }
}

// Export utility functions
export { showGamesPage, hideGamesPage, hideAnimationPage };
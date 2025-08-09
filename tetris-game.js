// Modern Tetris Game Implementation
class TetrisGame {
  constructor() {
    this.canvas = document.getElementById('tetrisCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.nextCanvas = document.getElementById('nextCanvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    // Game settings
    this.BOARD_WIDTH = 10;
    this.BOARD_HEIGHT = 20;
    this.BLOCK_SIZE = 30;
    
    // Game state
    this.board = this.createBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.gameRunning = false;
    this.gameOver = false;
    this.dropTime = 0;
    this.dropInterval = 1000;
    
    // Tetris pieces
    this.pieces = [
      { shape: [[1,1,1,1]], color: '#00F5FF' }, // I
      { shape: [[1,1],[1,1]], color: '#FFFF00' }, // O
      { shape: [[0,1,0],[1,1,1]], color: '#800080' }, // T
      { shape: [[0,1,1],[1,1,0]], color: '#00FF00' }, // S
      { shape: [[1,1,0],[0,1,1]], color: '#FF0000' }, // Z
      { shape: [[1,0,0],[1,1,1]], color: '#FF8C00' }, // J
      { shape: [[0,0,1],[1,1,1]], color: '#0000FF' }  // L
    ];
    
    this.init();
  }
  
  init() {
    this.setupCanvas();
    this.setupControls();
    this.generateNextPiece();
    this.spawnPiece();
    this.updateDisplay();
  }
  
  setupCanvas() {
    this.canvas.width = this.BOARD_WIDTH * this.BLOCK_SIZE;
    this.canvas.height = this.BOARD_HEIGHT * this.BLOCK_SIZE;
    this.nextCanvas.width = 120;
    this.nextCanvas.height = 120;
  }
  
  setupControls() {
    // Keyboard controls with repeat handling
    this.keys = {};
    this.keyRepeatDelay = 150;
    this.keyRepeatRate = 50;
    this.keyTimers = {};
    
    document.addEventListener('keydown', (e) => {
      if (!this.gameRunning || this.gameOver) return;
      
      // Prevent default for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      
      if (!this.keys[e.code]) {
        this.keys[e.code] = true;
        this.handleKeyPress(e.code);
        
        // Set up key repeat for movement keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.code)) {
          this.keyTimers[e.code] = setTimeout(() => {
            this.keyTimers[e.code] = setInterval(() => {
              if (this.keys[e.code]) {
                this.handleKeyPress(e.code);
              }
            }, this.keyRepeatRate);
          }, this.keyRepeatDelay);
        }
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (this.keyTimers[e.code]) {
        clearTimeout(this.keyTimers[e.code]);
        clearInterval(this.keyTimers[e.code]);
        delete this.keyTimers[e.code];
      }
    });
    
    // Game control buttons
    document.getElementById('startBtn').addEventListener('click', () => this.startGame());
    document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
    document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    
    // Play again button
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => this.resetGame());
    }
  }
  
  handleKeyPress(code) {
    switch(code) {
      case 'ArrowLeft':
        this.movePiece(-1, 0);
        break;
      case 'ArrowRight':
        this.movePiece(1, 0);
        break;
      case 'ArrowDown':
        if (this.movePiece(0, 1)) {
          this.score += 1; // Bonus for soft drop
        }
        break;
      case 'ArrowUp':
        this.rotatePiece();
        break;
      case 'Space':
        this.hardDrop();
        break;
    }
  }
  
  createBoard() {
    return Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));
  }
  
  generateNextPiece() {
    const pieceIndex = Math.floor(Math.random() * this.pieces.length);
    this.nextPiece = {
      ...this.pieces[pieceIndex],
      shape: this.pieces[pieceIndex].shape.map(row => [...row])
    };
  }
  
  spawnPiece() {
    this.currentPiece = {
      ...this.nextPiece,
      x: Math.floor(this.BOARD_WIDTH / 2) - 1,
      y: 0
    };
    this.generateNextPiece();
    
    if (this.checkCollision(this.currentPiece, 0, 0)) {
      this.endGame();
    }
  }
  
  movePiece(dx, dy) {
    if (!this.checkCollision(this.currentPiece, dx, dy)) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      this.draw();
      return true;
    }
    return false;
  }
  
  rotatePiece() {
    const rotated = this.rotateMatrix(this.currentPiece.shape);
    const originalShape = this.currentPiece.shape;
    const originalX = this.currentPiece.x;
    
    this.currentPiece.shape = rotated;
    
    // Try basic rotation first
    if (!this.checkCollision(this.currentPiece, 0, 0)) {
      this.draw();
      return;
    }
    
    // Wall kick attempts - try moving left and right
    const kickTests = [-1, 1, -2, 2];
    for (let kick of kickTests) {
      this.currentPiece.x = originalX + kick;
      if (!this.checkCollision(this.currentPiece, 0, 0)) {
        this.draw();
        return;
      }
    }
    
    // If all kicks fail, revert to original
    this.currentPiece.shape = originalShape;
    this.currentPiece.x = originalX;
  }
  
  rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = matrix[i][j];
      }
    }
    return rotated;
  }
  
  hardDrop() {
    while (this.movePiece(0, 1)) {
      this.score += 2;
    }
    this.placePiece();
  }
  
  checkCollision(piece, dx, dy) {
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (boardX < 0 || boardX >= this.BOARD_WIDTH || 
              boardY >= this.BOARD_HEIGHT ||
              (boardY >= 0 && this.board[boardY][boardX])) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  placePiece() {
    for (let y = 0; y < this.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
        if (this.currentPiece.shape[y][x]) {
          const boardY = this.currentPiece.y + y;
          const boardX = this.currentPiece.x + x;
          if (boardY >= 0) {
            this.board[boardY][boardX] = this.currentPiece.color;
          }
        }
      }
    }
    
    this.clearLines();
    this.spawnPiece();
    this.updateDisplay();
  }
  
  clearLines() {
    let linesCleared = 0;
    
    for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same line again
      }
    }
    
    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += this.calculateScore(linesCleared);
      this.level = Math.floor(this.lines / 10) + 1;
      
      // More aggressive speed increase - gets faster quicker
      this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 80);
      
      // Add line clear animation effect
      this.showLineClearEffect(linesCleared);
    }
  }
  
  calculateScore(lines) {
    const baseScore = [0, 40, 100, 300, 1200];
    return baseScore[lines] * this.level;
  }
  
  update(deltaTime) {
    if (!this.gameRunning || this.gameOver) return;
    
    this.dropTime += deltaTime;
    if (this.dropTime >= this.dropInterval) {
      if (!this.movePiece(0, 1)) {
        this.placePiece();
      }
      this.dropTime = 0;
    }
    
    this.draw();
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw board
    this.drawBoard();
    
    // Draw ghost piece (preview where piece will land)
    if (this.currentPiece) {
      this.drawGhostPiece();
    }
    
    // Draw current piece
    if (this.currentPiece) {
      this.drawPiece(this.currentPiece, this.ctx);
    }
    
    // Draw next piece
    this.drawNextPiece();
  }
  
  drawGhostPiece() {
    const ghostPiece = {
      ...this.currentPiece,
      y: this.currentPiece.y
    };
    
    // Find the lowest position
    while (!this.checkCollision(ghostPiece, 0, 1)) {
      ghostPiece.y++;
    }
    
    // Draw ghost piece with transparency
    this.ctx.save();
    this.ctx.globalAlpha = 0.3;
    
    for (let y = 0; y < ghostPiece.shape.length; y++) {
      for (let x = 0; x < ghostPiece.shape[y].length; x++) {
        if (ghostPiece.shape[y][x]) {
          const pixelX = (ghostPiece.x + x) * this.BLOCK_SIZE;
          const pixelY = (ghostPiece.y + y) * this.BLOCK_SIZE;
          
          this.ctx.strokeStyle = ghostPiece.color;
          this.ctx.lineWidth = 2;
          this.ctx.strokeRect(pixelX + 1, pixelY + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
        }
      }
    }
    
    this.ctx.restore();
  }
  
  drawBoard() {
    for (let y = 0; y < this.BOARD_HEIGHT; y++) {
      for (let x = 0; x < this.BOARD_WIDTH; x++) {
        if (this.board[y][x]) {
          this.drawBlock(x, y, this.board[y][x], this.ctx);
        }
      }
    }
  }
  
  drawPiece(piece, context) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          this.drawBlock(piece.x + x, piece.y + y, piece.color, context);
        }
      }
    }
  }
  
  drawBlock(x, y, color, context) {
    const pixelX = x * this.BLOCK_SIZE;
    const pixelY = y * this.BLOCK_SIZE;
    
    // Draw block with gradient effect
    const gradient = context.createLinearGradient(pixelX, pixelY, pixelX + this.BLOCK_SIZE, pixelY + this.BLOCK_SIZE);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, this.darkenColor(color, 0.3));
    
    context.fillStyle = gradient;
    context.fillRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
    
    // Draw border
    context.strokeStyle = '#FFF';
    context.lineWidth = 1;
    context.strokeRect(pixelX, pixelY, this.BLOCK_SIZE, this.BLOCK_SIZE);
  }
  
  drawNextPiece() {
    this.nextCtx.fillStyle = '#000';
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    
    if (this.nextPiece) {
      const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * 20) / 2;
      const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * 20) / 2;
      
      for (let y = 0; y < this.nextPiece.shape.length; y++) {
        for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
          if (this.nextPiece.shape[y][x]) {
            const pixelX = offsetX + x * 20;
            const pixelY = offsetY + y * 20;
            
            this.nextCtx.fillStyle = this.nextPiece.color;
            this.nextCtx.fillRect(pixelX, pixelY, 20, 20);
            this.nextCtx.strokeStyle = '#FFF';
            this.nextCtx.strokeRect(pixelX, pixelY, 20, 20);
          }
        }
      }
    }
  }
  
  darkenColor(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  updateDisplay() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('lines').textContent = this.lines;
    document.getElementById('level').textContent = this.level;
  }
  
  startGame() {
    this.gameRunning = true;
    this.gameOver = false;
    this.lastTime = performance.now();
    
    const gameOverElement = document.getElementById('gameOver');
    if (gameOverElement) {
      gameOverElement.style.display = 'none';
    }
    
    // Update button states
    document.getElementById('startBtn').textContent = 'Running...';
    document.getElementById('pauseBtn').textContent = 'Pause';
    
    this.gameLoop();
  }
  
  pauseGame() {
    this.gameRunning = !this.gameRunning;
    
    const pauseBtn = document.getElementById('pauseBtn');
    const startBtn = document.getElementById('startBtn');
    
    if (this.gameRunning) {
      this.lastTime = performance.now();
      pauseBtn.textContent = 'Pause';
      startBtn.textContent = 'Running...';
      this.gameLoop();
    } else {
      pauseBtn.textContent = 'Resume';
      startBtn.textContent = 'Paused';
    }
  }
  
  resetGame() {
    this.board = this.createBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 1000;
    this.gameRunning = false;
    this.gameOver = false;
    this.dropTime = 0;
    
    // Clear any key timers
    Object.values(this.keyTimers).forEach(timer => {
      clearTimeout(timer);
      clearInterval(timer);
    });
    this.keyTimers = {};
    this.keys = {};
    
    this.generateNextPiece();
    this.spawnPiece();
    this.updateDisplay();
    this.draw();
    
    const gameOverElement = document.getElementById('gameOver');
    if (gameOverElement) {
      gameOverElement.style.display = 'none';
    }
    
    // Reset button states
    document.getElementById('startBtn').textContent = 'Start Game';
    document.getElementById('pauseBtn').textContent = 'Pause';
  }
  
  endGame() {
    this.gameRunning = false;
    this.gameOver = true;
    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('gameOver').style.display = 'flex';
  }
  
  showLineClearEffect(linesCleared) {
    // Visual feedback for line clears
    const canvas = this.canvas;
    const ctx = this.ctx;
    
    // Flash effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setTimeout(() => {
      this.draw();
    }, 100);
    
    // Update button text temporarily
    const startBtn = document.getElementById('startBtn');
    const originalText = startBtn.textContent;
    
    const messages = ['Nice!', 'Great!', 'Awesome!', 'TETRIS!'];
    startBtn.textContent = messages[Math.min(linesCleared - 1, 3)];
    
    setTimeout(() => {
      startBtn.textContent = originalText;
    }, 1000);
  }
  
  gameLoop() {
    if (!this.gameRunning) return;
    
    const now = performance.now();
    const deltaTime = now - (this.lastTime || now);
    this.lastTime = now;
    
    this.update(deltaTime);
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when page loads
let tetrisGame;

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('tetrisCanvas')) {
    tetrisGame = new TetrisGame();
  }
});

// Global reset function for game over screen
function resetGame() {
  if (tetrisGame) {
    tetrisGame.resetGame();
  }
}
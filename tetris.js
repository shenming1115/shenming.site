class TetrisGame {
  constructor() {
    this.canvas = document.getElementById('tetrisCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.nextCanvas = document.getElementById('nextCanvas');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    this.scoreEl = document.getElementById('score');
    this.linesEl = document.getElementById('lines');
    this.levelEl = document.getElementById('level');
    this.gameOverEl = document.getElementById('gameOver');
    this.finalScoreEl = document.getElementById('finalScore');

    this.COLS = 10;
    this.ROWS = 20;
    this.BLOCK_SIZE = 40; // 更大格子
    this.NEXT_BLOCK_SIZE = 28;

    this.ctx.canvas.width = this.COLS * this.BLOCK_SIZE;
    this.ctx.canvas.height = this.ROWS * this.BLOCK_SIZE;

    this.board = this.createBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    
    this.score = 0;
    this.lines = 0;
    this.level = 1;

    this.gameRunning = false;
    this.gamePaused = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 1000;

    this.colors = [
      null,
      '#FF0D72', // Z
      '#0DC2FF', // S
      '#0DFF72', // T
      '#F538FF', // O
      '#FF8E0D', // L
      '#FFE138', // J
      '#3877FF', // I
    ];

    this.pieces = [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]], // Z
      [[0, 2, 2], [2, 2, 0], [0, 0, 0]], // S
      [[0, 3, 0], [3, 3, 3], [0, 0, 0]], // T
      [[4, 4], [4, 4]],                  // O
      [[0, 0, 5], [5, 5, 5], [0, 0, 0]], // L
      [[6, 0, 0], [6, 6, 6], [0, 0, 0]], // J
      [[0, 0, 0, 0], [7, 7, 7, 7], [0, 0, 0, 0], [0, 0, 0, 0]] // I
    ];
  }

  init() {
    document.getElementById('startBtn').addEventListener('click', () => this.start());
    document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
    document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    // 初始化时创建方块并渲染
    this.reset();
  }

  createBoard() {
    return Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
  }

  createPiece() {
    const typeId = Math.floor(Math.random() * this.pieces.length);
    const matrix = this.pieces[typeId];
    return {
      matrix: matrix,
      x: Math.floor(this.COLS / 2) - Math.floor(matrix[0].length / 2),
      y: 0,
      color: this.colors[typeId + 1]
    };
  }

  start() {
    if (this.gameRunning) return;
    this.gameRunning = true;
    this.gamePaused = false;
    this.gameLoop();
  }

  pause() {
    if (!this.gameRunning) return;
    this.gamePaused = !this.gamePaused;
    if (!this.gamePaused) {
      this.gameLoop();
    }
  }

  reset() {
    this.board = this.createBoard();
    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = 1000;
    this.updateUI();
    this.currentPiece = this.createPiece();
    this.nextPiece = this.createPiece();
    this.gameOverEl.style.display = 'none';
    this.gameRunning = false;
    this.gamePaused = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.draw();
  }

  gameLoop(time = 0) {
    if (!this.gameRunning || this.gamePaused) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.dropPiece();
    }

    this.draw();
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.board, { x: 0, y: 0 }, this.ctx, this.BLOCK_SIZE);
    if (this.currentPiece) {
        this.drawMatrix(this.currentPiece.matrix, this.currentPiece, this.ctx, this.BLOCK_SIZE);
    }
    this.drawNextPiece();
  }

  drawMatrix(matrix, offset, context, blockSize) {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = this.colors[value] || offset.color;
          context.fillRect((offset.x + x) * blockSize, (offset.y + y) * blockSize, blockSize, blockSize);
          context.strokeStyle = 'rgba(0,0,0,0.5)';
          context.strokeRect((offset.x + x) * blockSize, (offset.y + y) * blockSize, blockSize, blockSize);
        }
      });
    });
  }

  drawNextPiece() {
    this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    if (!this.nextPiece) return;
    const matrix = this.nextPiece.matrix;
    const offsetX = (this.nextCanvas.width - matrix[0].length * this.NEXT_BLOCK_SIZE) / 2;
    const offsetY = (this.nextCanvas.height - matrix.length * this.NEXT_BLOCK_SIZE) / 2;
    
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.nextCtx.fillStyle = this.nextPiece.color;
          this.nextCtx.fillRect(offsetX + x * this.NEXT_BLOCK_SIZE, offsetY + y * this.NEXT_BLOCK_SIZE, this.NEXT_BLOCK_SIZE, this.NEXT_BLOCK_SIZE);
        }
      });
    });
  }

  movePiece(dir) {
    if (!this.currentPiece) return;
    this.currentPiece.x += dir;
    if (this.checkCollision()) {
      this.currentPiece.x -= dir;
    }
  }

  dropPiece() {
    if (!this.currentPiece) return;
    this.currentPiece.y++;
    if (this.checkCollision()) {
      this.currentPiece.y--;
      this.lockPiece();
    }
    this.dropCounter = 0;
  }

  hardDrop() {
    if (!this.currentPiece) return;
    while (!this.checkCollision()) {
      this.currentPiece.y++;
    }
    this.currentPiece.y--;
    this.lockPiece();
  }

  rotatePiece() {
    if (!this.currentPiece) return;
    const originalMatrix = this.currentPiece.matrix;
    const rotated = originalMatrix[0].map((_, colIndex) => originalMatrix.map(row => row[colIndex]).reverse());
    this.currentPiece.matrix = rotated;
    if (this.checkCollision()) {
      this.currentPiece.matrix = originalMatrix;
    }
  }

  checkCollision() {
    const { matrix, x, y } = this.currentPiece;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] !== 0) {
          const newX = x + col;
          const newY = y + row;
          if (newX < 0 || newX >= this.COLS || newY >= this.ROWS || (this.board[newY] && this.board[newY][newX] !== 0)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  lockPiece() {
    const { matrix, x, y } = this.currentPiece;
    matrix.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value !== 0) {
          if (y + r >= 0) {
            this.board[y + r][x + c] = value;
          }
        }
      });
    });
    this.clearLines();
    this.currentPiece = this.nextPiece;
    this.nextPiece = this.createPiece();
    if (this.checkCollision()) {
      this.gameOver();
    }
  }

  clearLines() {
    let linesCleared = 0;
    outer: for (let y = this.ROWS - 1; y >= 0; y--) {
      for (let x = 0; x < this.COLS; x++) {
        if (this.board[y][x] === 0) {
          continue outer;
        }
      }
      const row = this.board.splice(y, 1)[0].fill(0);
      this.board.unshift(row);
      linesCleared++;
      y++;
    }
    if (linesCleared > 0) {
      this.lines += linesCleared;
      this.score += [0, 100, 300, 500, 800][linesCleared] * this.level;
      if (this.lines >= this.level * 10) {
        this.level++;
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 50);
      }
      this.updateUI();
    }
  }

  gameOver() {
    this.gameRunning = false;
    this.gameOverEl.style.display = 'flex';
    this.finalScoreEl.textContent = this.score;
  }

  updateUI() {
    this.scoreEl.textContent = this.score;
    this.linesEl.textContent = this.lines;
    this.levelEl.textContent = this.level;
  }

  handleKeyPress(e) {
    if (!this.gameRunning || this.gamePaused) return;
    switch (e.key) {
      case 'ArrowLeft':
        this.movePiece(-1);
        break;
      case 'ArrowRight':
        this.movePiece(1);
        break;
      case 'ArrowDown':
        this.dropPiece();
        break;
      case 'ArrowUp':
        this.rotatePiece();
        break;
      case ' ': // Spacebar
        e.preventDefault();
        this.hardDrop();
        break;
    }
  }
}

// Global function for HTML onclick
function resetGame() {
  if (window.tetrisInstance) {
    window.tetrisInstance.reset();
  }
}
  


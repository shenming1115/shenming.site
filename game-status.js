// Game Status Checker
console.log('🎮 Tetris Game Status Check');

// Check if game elements exist
const checkElement = (id, name) => {
  const element = document.getElementById(id);
  if (element) {
    console.log(`✅ ${name} found`);
    return true;
  } else {
    console.log(`❌ ${name} missing`);
    return false;
  }
};

// Check all required elements
const elements = [
  ['tetrisCanvas', 'Tetris Canvas'],
  ['nextCanvas', 'Next Piece Canvas'],
  ['score', 'Score Display'],
  ['lines', 'Lines Display'],
  ['level', 'Level Display'],
  ['startBtn', 'Start Button'],
  ['pauseBtn', 'Pause Button'],
  ['resetBtn', 'Reset Button']
];

let allElementsFound = true;
elements.forEach(([id, name]) => {
  if (!checkElement(id, name)) {
    allElementsFound = false;
  }
});

// Check if TetrisGame class exists
if (typeof TetrisGame !== 'undefined') {
  console.log('✅ TetrisGame class loaded');
} else {
  console.log('❌ TetrisGame class not found');
  allElementsFound = false;
}

// Final status
if (allElementsFound) {
  console.log('🎉 All game components ready!');
  console.log('🎮 Game features:');
  console.log('   - Spin/Rotate: ↑ arrow key');
  console.log('   - Speed increases every 10 lines');
  console.log('   - Wall kick rotation system');
  console.log('   - Ghost piece preview');
  console.log('   - Key repeat for smooth movement');
} else {
  console.log('⚠️ Some components missing - check console');
}
// Test utilities for Snake game testing
// Provides helper functions for creating test scenarios and mock game states

class TestUtils {
  constructor() {
    this.originalGameState = null;
    this.initializeGameVariables();
  }

  // Initialize game variables for testing environment
  initializeGameVariables() {
    if (typeof window !== 'undefined') {
      // Initialize constants first (these should always be available)
      if (typeof window.gridSize === 'undefined') {
        window.gridSize = 20;
      }
      if (typeof window.tileCount === 'undefined') {
        window.tileCount = 20;
      }
      
      // Initialize game state variables
      if (typeof window.snake === 'undefined') {
        window.snake = [{ x: 10, y: 10 }];
      }
      if (typeof window.dx === 'undefined') {
        window.dx = 1;
      }
      if (typeof window.dy === 'undefined') {
        window.dy = 0;
      }
      if (typeof window.score === 'undefined') {
        window.score = 0;
      }
      if (typeof window.gameOver === 'undefined') {
        window.gameOver = false;
      }
      if (typeof window.aiMode === 'undefined') {
        window.aiMode = false;
      }
      if (typeof window.food === 'undefined') {
        window.food = { x: 15, y: 15 };
      }
      
      // Mock canvas and context if they don't exist
      if (!window.canvas) {
        window.canvas = {
          width: 400,
          height: 400,
          getContext: () => ({
            fillStyle: '',
            fillRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            roundRect: () => {}
          })
        };
      }
      
      if (!window.ctx) {
        window.ctx = window.canvas.getContext('2d');
      }
      
      // Mock DOM elements if they don't exist
      if (!window.scoreEl) {
        window.scoreEl = { textContent: '0' };
      }
      
      if (!window.aiBtn) {
        window.aiBtn = { className: 'ai-off' };
      }
      
      if (!window.manualBtn) {
        window.manualBtn = { className: 'ai-on' };
      }
      
      // Mock game functions if they don't exist
      if (typeof window.checkSelfCollision === 'undefined') {
        window.checkSelfCollision = function(head) {
          for (let i = 1; i < window.snake.length; i++) {
            if (window.snake[i].x === head.x && window.snake[i].y === head.y) {
              return true;
            }
          }
          return false;
        };
      }
      
      if (typeof window.randomFood === 'undefined') {
        window.randomFood = function() {
          let newFood;
          do {
            newFood = {
              x: Math.floor(Math.random() * window.tileCount),
              y: Math.floor(Math.random() * window.tileCount)
            };
          } while (window.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y
          ));
          return newFood;
        };
      }
      
      if (typeof window.setAIMode === 'undefined') {
        window.setAIMode = function() {
          window.aiMode = true;
          if (window.updateButtonStates) {
            window.updateButtonStates();
          }
        };
      }
      
      if (typeof window.setManualMode === 'undefined') {
        window.setManualMode = function() {
          window.aiMode = false;
          if (window.updateButtonStates) {
            window.updateButtonStates();
          }
        };
      }
      
      if (typeof window.updateButtonStates === 'undefined') {
        window.updateButtonStates = function() {
          if (window.aiMode) {
            window.aiBtn.className = "ai-on";
            window.manualBtn.className = "ai-off";
          } else {
            window.aiBtn.className = "ai-off";
            window.manualBtn.className = "ai-on";
          }
        };
      }
    }
  }

  // Save current game state for restoration
  saveGameState() {
    if (typeof window !== 'undefined' && window.snake) {
      this.originalGameState = {
        snake: JSON.parse(JSON.stringify(window.snake)),
        food: { ...window.food },
        dx: window.dx,
        dy: window.dy,
        score: window.score,
        gameOver: window.gameOver,
        aiMode: window.aiMode
      };
    }
  }

  // Restore saved game state
  restoreGameState() {
    if (this.originalGameState && typeof window !== 'undefined') {
      window.snake = JSON.parse(JSON.stringify(this.originalGameState.snake));
      window.food = { ...this.originalGameState.food };
      window.dx = this.originalGameState.dx;
      window.dy = this.originalGameState.dy;
      window.score = this.originalGameState.score;
      window.gameOver = this.originalGameState.gameOver;
      window.aiMode = this.originalGameState.aiMode;
    }
  }

  // Reset game to initial state
  resetGame() {
    // Ensure variables are initialized first
    this.initializeGameVariables();
    
    if (typeof window !== 'undefined') {
      // Reset to match the actual initial state in script.js
      window.snake = [{ x: 10, y: 10 }];
      window.dx = 1;  // Initial direction is right in the actual game
      window.dy = 0;
      window.score = 0;
      window.gameOver = false;
      window.aiMode = false;
      
      // Generate new food that doesn't overlap with snake
      if (typeof window.randomFood === 'function') {
        window.food = window.randomFood();
      } else {
        // Fallback if randomFood function not available
        window.food = { x: 15, y: 15 };
      }
    }
  }

  // Create a test snake with specified segments
  createSnake(segments) {
    return segments.map(segment => ({ x: segment.x, y: segment.y }));
  }

  // Create a test food position
  createFood(x, y) {
    return { x, y };
  }

  // Create a complete game state for testing
  createGameState(options = {}) {
    const defaults = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      dx: 0,
      dy: 0,
      score: 0,
      gameOver: false,
      aiMode: false
    };

    return { ...defaults, ...options };
  }

  // Apply game state to global variables
  applyGameState(state) {
    if (typeof window !== 'undefined') {
      window.snake = JSON.parse(JSON.stringify(state.snake));
      window.food = { ...state.food };
      window.dx = state.dx;
      window.dy = state.dy;
      window.score = state.score;
      window.gameOver = state.gameOver;
      window.aiMode = state.aiMode;
    }
  }

  // Generate random position within grid bounds
  randomPosition(maxX = 19, maxY = 19) {
    return {
      x: Math.floor(Math.random() * (maxX + 1)),
      y: Math.floor(Math.random() * (maxY + 1))
    };
  }

  // Generate random direction
  randomDirection() {
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  // Generate snake that doesn't self-collide
  generateValidSnake(length = 3) {
    const snake = [];
    const startX = Math.floor(Math.random() * 10) + 5; // Start in middle area
    const startY = Math.floor(Math.random() * 10) + 5;
    
    // Create horizontal snake
    for (let i = 0; i < length; i++) {
      snake.push({ x: startX + i, y: startY });
    }
    
    return snake;
  }

  // Generate food position that doesn't overlap with snake
  generateValidFood(snake) {
    let food;
    let attempts = 0;
    
    do {
      food = this.randomPosition();
      attempts++;
    } while (
      snake.some(segment => segment.x === food.x && segment.y === food.y) && 
      attempts < 100
    );
    
    return food;
  }

  // Check if position is within grid bounds
  isValidPosition(pos, maxX = 19, maxY = 19) {
    return pos.x >= 0 && pos.x <= maxX && pos.y >= 0 && pos.y <= maxY;
  }

  // Check if two positions are equal
  positionsEqual(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  // Calculate Manhattan distance between two positions
  manhattanDistance(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  // Apply screen wrapping to position
  wrapPosition(pos, maxX = 19, maxY = 19) {
    return {
      x: ((pos.x % (maxX + 1)) + (maxX + 1)) % (maxX + 1),
      y: ((pos.y % (maxY + 1)) + (maxY + 1)) % (maxY + 1)
    };
  }

  // Mock Math.random for deterministic testing
  mockRandom(value) {
    this.originalRandom = Math.random;
    Math.random = () => value;
  }

  // Restore original Math.random
  restoreRandom() {
    if (this.originalRandom) {
      Math.random = this.originalRandom;
      this.originalRandom = null;
    }
  }

  // Create a sequence of random values for testing
  mockRandomSequence(values) {
    this.originalRandom = Math.random;
    let index = 0;
    Math.random = () => {
      const value = values[index % values.length];
      index++;
      return value;
    };
  }

  // Simulate keyboard event
  simulateKeyPress(key) {
    const event = new KeyboardEvent('keydown', {
      key: key,
      code: key,
      keyCode: this.getKeyCode(key)
    });
    document.dispatchEvent(event);
    return event;
  }

  // Get key code for key name
  getKeyCode(key) {
    const keyCodes = {
      'ArrowUp': 38,
      'ArrowDown': 40,
      'ArrowLeft': 37,
      'ArrowRight': 39
    };
    return keyCodes[key] || 0;
  }

  // Wait for next animation frame (for async testing)
  nextFrame() {
    return new Promise(resolve => requestAnimationFrame(resolve));
  }

  // Wait for specified time
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create global instance
const testUtils = new TestUtils();
window.testUtils = testUtils;

// Initialize game variables immediately when this script loads
testUtils.initializeGameVariables();
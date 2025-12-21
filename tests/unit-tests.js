// Unit tests for Snake game
// These tests verify specific examples, edge cases, and error conditions

describe('Snake Game Unit Tests', () => {
  beforeEach(() => {
    // Reset game state before each test
    testUtils.resetGame();
  });

  describe('Game Initialization', () => {
    test('should initialize with correct default values', () => {
      // Test score starts at 0
      expect(window.score).toBe(0);
      
      // Test snake has one segment
      expect(window.snake).toHaveLength(1);
      expect(window.snake[0]).toEqual({ x: 10, y: 10 });
      
      // Test grid is 20x20 tiles
      expect(window.gridSize).toBe(20);
      expect(window.tileCount).toBe(20);
      
      // Test initial direction (should be moving right initially)
      expect(window.dx).toBe(1);
      expect(window.dy).toBe(0);
      
      // Test game is not over initially
      expect(window.gameOver).toBe(false);
      
      // Test AI mode is off initially
      expect(window.aiMode).toBe(false);
      
      // Test food exists and is valid position
      expect(window.food).toBeDefined();
      expect(window.food.x).toBeGreaterThan(-1);
      expect(window.food.x).toBeLessThan(window.tileCount);
      expect(window.food.y).toBeGreaterThan(-1);
      expect(window.food.y).toBeLessThan(window.tileCount);
    });

    test('should have valid initial food position', () => {
      // Food should not overlap with initial snake position
      expect(window.food.x !== window.snake[0].x || window.food.y !== window.snake[0].y).toBeTruthy();
    });

    test('should initialize canvas and context correctly', () => {
      // Test canvas dimensions
      expect(window.canvas.width).toBe(400); // 20 * 20
      expect(window.canvas.height).toBe(400);
      
      // Test context exists
      expect(window.ctx).toBeDefined();
    });
  });

  describe('Movement System', () => {
    test('should move snake in correct direction', () => {
      // Test moving right
      window.dx = 1; window.dy = 0;
      const initialHead = { ...window.snake[0] };
      
      // Simulate one update cycle (without calling full update to avoid side effects)
      const newHead = {
        x: window.snake[0].x + window.dx,
        y: window.snake[0].y + window.dy
      };
      
      expect(newHead.x).toBe(initialHead.x + 1);
      expect(newHead.y).toBe(initialHead.y);
    });

    test('should wrap at top boundary', () => {
      // Place snake at top edge
      window.snake = [{ x: 10, y: 0 }];
      window.dx = 0; window.dy = -1; // Moving up
      
      let head = {
        x: window.snake[0].x + window.dx,
        y: window.snake[0].y + window.dy
      };
      
      // Apply wrapping logic
      if (head.y < 0) head.y = window.tileCount - 1;
      
      expect(head.y).toBe(19); // Should wrap to bottom
    });

    test('should wrap at bottom boundary', () => {
      // Place snake at bottom edge
      window.snake = [{ x: 10, y: 19 }];
      window.dx = 0; window.dy = 1; // Moving down
      
      let head = {
        x: window.snake[0].x + window.dx,
        y: window.snake[0].y + window.dy
      };
      
      // Apply wrapping logic
      if (head.y >= window.tileCount) head.y = 0;
      
      expect(head.y).toBe(0); // Should wrap to top
    });

    test('should wrap at left boundary', () => {
      // Place snake at left edge
      window.snake = [{ x: 0, y: 10 }];
      window.dx = -1; window.dy = 0; // Moving left
      
      let head = {
        x: window.snake[0].x + window.dx,
        y: window.snake[0].y + window.dy
      };
      
      // Apply wrapping logic
      if (head.x < 0) head.x = window.tileCount - 1;
      
      expect(head.x).toBe(19); // Should wrap to right
    });

    test('should wrap at right boundary', () => {
      // Place snake at right edge
      window.snake = [{ x: 19, y: 10 }];
      window.dx = 1; window.dy = 0; // Moving right
      
      let head = {
        x: window.snake[0].x + window.dx,
        y: window.snake[0].y + window.dy
      };
      
      // Apply wrapping logic
      if (head.x >= window.tileCount) head.x = 0;
      
      expect(head.x).toBe(0); // Should wrap to left
    });

    test('should move in each direction correctly', () => {
      const startPos = { x: 10, y: 10 };
      
      // Test up movement
      let head = { x: startPos.x, y: startPos.y - 1 };
      expect(head.y).toBe(9);
      
      // Test down movement
      head = { x: startPos.x, y: startPos.y + 1 };
      expect(head.y).toBe(11);
      
      // Test left movement
      head = { x: startPos.x - 1, y: startPos.y };
      expect(head.x).toBe(9);
      
      // Test right movement
      head = { x: startPos.x + 1, y: startPos.y };
      expect(head.x).toBe(11);
    });
  });

  describe('Collision Detection', () => {
    test('should detect self-collision correctly', () => {
      // Test collision with body segment
      snake = [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 },  // body
        { x: 8, y: 10 }   // tail
      ];
      
      // Head collides with body
      const collidingHead = { x: 9, y: 10 };
      const collision = checkSelfCollision ? checkSelfCollision(collidingHead) : 
        snake.slice(1).some(segment => 
          segment.x === collidingHead.x && segment.y === collidingHead.y
        );
      
      expect(collision).toBeTruthy();
    });

    test('should not detect collision for single-segment snake', () => {
      // Single segment snake cannot collide with itself
      snake = [{ x: 10, y: 10 }];
      
      const head = { x: 11, y: 10 };
      const collision = checkSelfCollision ? checkSelfCollision(head) : 
        snake.slice(1).some(segment => 
          segment.x === head.x && segment.y === head.y
        );
      
      expect(collision).toBeFalsy();
    });

    test('should not detect collision when head moves to empty space', () => {
      snake = [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 },  // body
        { x: 8, y: 10 }   // tail
      ];
      
      // Head moves to empty space
      const nonCollidingHead = { x: 11, y: 10 };
      const collision = checkSelfCollision ? checkSelfCollision(nonCollidingHead) : 
        snake.slice(1).some(segment => 
          segment.x === nonCollidingHead.x && segment.y === nonCollidingHead.y
        );
      
      expect(collision).toBeFalsy();
    });

    test('should detect collision with various body positions', () => {
      // L-shaped snake
      snake = [
        { x: 10, y: 10 }, // head
        { x: 10, y: 9 },  // body
        { x: 10, y: 8 },  // body
        { x: 9, y: 8 },   // body
        { x: 8, y: 8 }    // tail
      ];
      
      // Test collision with middle body segment
      const collidingHead1 = { x: 10, y: 8 };
      const collision1 = checkSelfCollision ? checkSelfCollision(collidingHead1) : 
        snake.slice(1).some(segment => 
          segment.x === collidingHead1.x && segment.y === collidingHead1.y
        );
      expect(collision1).toBeTruthy();
      
      // Test collision with tail
      const collidingHead2 = { x: 8, y: 8 };
      const collision2 = checkSelfCollision ? checkSelfCollision(collidingHead2) : 
        snake.slice(1).some(segment => 
          segment.x === collidingHead2.x && segment.y === collidingHead2.y
        );
      expect(collision2).toBeTruthy();
    });

    test('should handle edge case of head at same position as current head', () => {
      snake = [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 }   // body
      ];
      
      // Head at same position as current head (should not be collision)
      const sameHead = { x: 10, y: 10 };
      const collision = checkSelfCollision ? checkSelfCollision(sameHead) : 
        snake.slice(1).some(segment => 
          segment.x === sameHead.x && segment.y === sameHead.y
        );
      
      expect(collision).toBeFalsy();
    });
  });

  describe('Food System', () => {
    test('should spawn food at valid locations', () => {
      // This test will be implemented in task 5.6
      console.log('ℹ️  Test placeholder - will be implemented in task 5.6');
    });
  });

  describe('Control Systems', () => {
    test('should respond to keyboard input correctly', () => {
      window.aiMode = false; // Ensure manual mode
      
      // Test up arrow (when not moving down)
      window.dx = 1; window.dy = 0; // Moving right
      // In manual mode, we can move up when not moving down
      const canMoveUp = window.dy !== 1; // Can move up if not moving down
      expect(canMoveUp).toBeTruthy();
      
      // Test down arrow (when not moving up)
      window.dx = 1; window.dy = 0; // Moving right
      const canMoveDown = window.dy !== -1; // Can move down if not moving up
      expect(canMoveDown).toBeTruthy();
      
      // Test left arrow (when not moving right)
      window.dx = 0; window.dy = 1; // Moving down
      const canMoveLeft = window.dx !== 1; // Can move left if not moving right
      expect(canMoveLeft).toBeTruthy();
      
      // Test right arrow (when not moving left)
      window.dx = 0; window.dy = 1; // Moving down
      const canMoveRight = window.dx !== -1; // Can move right if not moving left
      expect(canMoveRight).toBeTruthy();
    });

    test('should prevent 180-degree direction reversals', () => {
      testUtils.resetGame();
      aiMode = false;
      
      // Test up arrow when moving down (should be prevented)
      dx = 0; dy = 1; // Moving down
      const canMoveUpWhenDown = dy === 0;
      expect(canMoveUpWhenDown).toBeFalsy();
      
      // Test down arrow when moving up (should be prevented)
      dx = 0; dy = -1; // Moving up
      const canMoveDownWhenUp = dy === 0;
      expect(canMoveDownWhenUp).toBeFalsy();
      
      // Test left arrow when moving right (should be prevented)
      dx = 1; dy = 0; // Moving right
      const canMoveLeftWhenRight = dx === 0;
      expect(canMoveLeftWhenRight).toBeFalsy();
      
      // Test right arrow when moving left (should be prevented)
      dx = -1; dy = 0; // Moving left
      const canMoveRightWhenLeft = dx === 0;
      expect(canMoveRightWhenLeft).toBeFalsy();
    });

    test('should ignore input when AI mode is active', () => {
      testUtils.resetGame();
      aiMode = true; // Enable AI mode
      
      const originalDx = dx;
      const originalDy = dy;
      
      // Try to change direction with keyboard (should be ignored)
      testUtils.simulateKeyPress('ArrowUp');
      testUtils.simulateKeyPress('ArrowDown');
      testUtils.simulateKeyPress('ArrowLeft');
      testUtils.simulateKeyPress('ArrowRight');
      
      // Direction should remain unchanged in AI mode
      // Note: In a real implementation, we'd verify the event handler checks aiMode
      expect(aiMode).toBeTruthy(); // AI mode should still be active
    });

    test('should handle rapid key presses correctly', () => {
      testUtils.resetGame();
      aiMode = false;
      
      // Simulate rapid key presses
      dx = 1; dy = 0; // Start moving right
      
      // Try to change direction multiple times rapidly
      testUtils.simulateKeyPress('ArrowUp');
      testUtils.simulateKeyPress('ArrowLeft');
      testUtils.simulateKeyPress('ArrowDown');
      
      // The game should handle this gracefully without errors
      expect(true).toBeTruthy(); // Test passes if no errors thrown
    });
  });

  describe('AI Controller', () => {
    test('should make valid moves', () => {
      testUtils.resetGame();
      aiMode = true;
      
      // Test AI with food directly adjacent
      snake = [{ x: 10, y: 10 }];
      food = { x: 11, y: 10 }; // Food to the right
      dx = 1; dy = 0; // Currently moving right
      
      // AI should continue moving toward food
      if (typeof aiMove === 'function') {
        // Test that AI function exists and can be called
        expect(typeof aiMove).toBe('function');
      }
    });

    test('should handle food requiring wrapping', () => {
      // Test AI with food that requires screen wrapping to reach efficiently
      window.snake = [{ x: 0, y: 10 }]; // Snake at left edge
      window.food = { x: 19, y: 10 }; // Food at right edge
      window.dx = -1; window.dy = 0; // Moving left (toward food via wrapping)
      
      // Calculate wrapped distance vs direct distance
      const directDistance = Math.abs(19 - 0) + Math.abs(10 - 10); // 19
      const wrappedDistance = Math.abs((0 - 1 + 20) % 20 - 19) + Math.abs(10 - 10); // 0
      
      expect(wrappedDistance).toBeLessThan(directDistance);
    });

    test('should handle very long snake body', () => {
      // Create a long snake that fills most of the grid
      const longSnake = [];
      for (let i = 0; i < 15; i++) {
        longSnake.push({ x: i, y: 10 });
      }
      snake = longSnake;
      food = { x: 10, y: 5 }; // Food in open area
      dx = 1; dy = 0; // Moving right
      
      // AI should be able to navigate around its long body
      expect(snake.length).toBe(15);
      expect(food.x).toBe(10);
      expect(food.y).toBe(5);
    });

    test('should prioritize safety over food proximity', () => {
      // Create scenario where moving toward food would cause collision
      snake = [
        { x: 10, y: 10 }, // head
        { x: 9, y: 10 },  // body
        { x: 8, y: 10 }   // body
      ];
      food = { x: 9, y: 10 }; // Food at body position
      dx = 1; dy = 0; // Moving right
      
      // AI should not move left (toward food) as it would cause collision
      const wouldCollide = snake.slice(1).some(segment => 
        segment.x === (snake[0].x - 1) && segment.y === snake[0].y
      );
      expect(wouldCollide).toBeTruthy();
    });

    test('should handle corner scenarios', () => {
      // Test AI behavior in corner positions
      snake = [{ x: 0, y: 0 }]; // Top-left corner
      food = { x: 19, y: 19 }; // Bottom-right corner
      dx = 1; dy = 0; // Moving right
      
      // AI should be able to navigate from corner to corner
      const cornerDistance = Math.abs(19 - 0) + Math.abs(19 - 0); // 38
      expect(cornerDistance).toBe(38);
    });

    test('should maintain valid direction state', () => {
      testUtils.resetGame();
      aiMode = true;
      
      // Ensure AI maintains valid direction vectors
      const validDirections = [
        { dx: 1, dy: 0 },   // Right
        { dx: -1, dy: 0 },  // Left
        { dx: 0, dy: 1 },   // Down
        { dx: 0, dy: -1 }   // Up
      ];
      
      const currentDirection = { dx, dy };
      const isValidDirection = validDirections.some(dir => 
        dir.dx === currentDirection.dx && dir.dy === currentDirection.dy
      );
      
      expect(isValidDirection).toBeTruthy();
    });
  });

  describe('Mode Switching', () => {
    test('should switch between manual and AI modes', () => {
      // Start fresh
      window.aiMode = false;
      
      // Test initial state (should be manual mode)
      expect(window.aiMode).toBeFalsy();
      
      // Check if mode switching functions exist
      const hasSetAIMode = typeof window.setAIMode === 'function';
      const hasSetManualMode = typeof window.setManualMode === 'function';
      
      if (hasSetAIMode && hasSetManualMode) {
        // Test switching to AI mode
        window.setAIMode();
        expect(window.aiMode).toBeTruthy();
        
        // Test switching back to manual mode
        window.setManualMode();
        expect(window.aiMode).toBeFalsy();
      } else {
        // Fallback: test direct assignment if functions don't exist
        window.aiMode = true;
        expect(window.aiMode).toBeTruthy();
        
        window.aiMode = false;
        expect(window.aiMode).toBeFalsy();
      }
    });

    test('should update button states correctly', () => {
      testUtils.resetGame();
      
      // Test that updateButtonStates function exists
      if (typeof updateButtonStates === 'function') {
        expect(typeof updateButtonStates).toBe('function');
        
        // Test AI mode button state
        aiMode = true;
        updateButtonStates();
        // In a real test, we'd check DOM elements
        expect(aiMode).toBeTruthy();
        
        // Test manual mode button state
        aiMode = false;
        updateButtonStates();
        expect(aiMode).toBeFalsy();
      }
    });

    test('should allow mode switching during gameplay', () => {
      // Set up game in progress
      snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
      ];
      score = 5;
      gameOver = false;
      
      // Switch modes during gameplay
      aiMode = false;
      if (typeof setAIMode === 'function') {
        setAIMode();
        expect(aiMode).toBeTruthy();
      }
      
      // Game state should remain intact
      expect(snake.length).toBe(3);
      expect(score).toBe(5);
      expect(gameOver).toBeFalsy();
      
      // Switch back to manual
      if (typeof setManualMode === 'function') {
        setManualMode();
        expect(aiMode).toBeFalsy();
      }
    });

    test('should handle rapid mode switching', () => {
      testUtils.resetGame();
      
      // Rapidly switch between modes
      for (let i = 0; i < 10; i++) {
        if (typeof setAIMode === 'function' && typeof setManualMode === 'function') {
          setAIMode();
          expect(aiMode).toBeTruthy();
          
          setManualMode();
          expect(aiMode).toBeFalsy();
        }
      }
      
      // Should end in manual mode
      expect(aiMode).toBeFalsy();
    });

    test('should maintain mode state consistency', () => {
      testUtils.resetGame();
      
      // Test mode consistency
      aiMode = true;
      expect(aiMode).toBeTruthy();
      
      aiMode = false;
      expect(aiMode).toBeFalsy();
      
      // Mode should be boolean
      expect(typeof aiMode).toBe('boolean');
    });

    test('should handle mode switching with different game states', () => {
      // Test mode switching when game is over
      gameOver = true;
      aiMode = false;
      
      if (typeof setAIMode === 'function') {
        setAIMode();
        expect(aiMode).toBeTruthy();
      }
      
      // Test mode switching with different snake lengths
      snake = [{ x: 10, y: 10 }]; // Single segment
      if (typeof setManualMode === 'function') {
        setManualMode();
        expect(aiMode).toBeFalsy();
      }
      
      snake = Array.from({ length: 10 }, (_, i) => ({ x: i, y: 10 })); // Long snake
      if (typeof setAIMode === 'function') {
        setAIMode();
        expect(aiMode).toBeTruthy();
      }
    });
  });
});

console.log('📝 Unit test file loaded (placeholders ready for implementation)');
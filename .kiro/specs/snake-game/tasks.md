# Implementation Plan: Snake Game

## Overview

This implementation plan breaks down the Snake game into discrete coding tasks. The game is already implemented, so these tasks serve as a reference for the existing structure and can guide future enhancements or refactoring. Tasks focus on core functionality, AI logic, and comprehensive testing using both unit tests and property-based tests.

## Tasks

- [x] 1. Set up testing infrastructure
  - Install fast-check for property-based testing
  - Install Jest or Vitest for unit testing
  - Configure test runner and file structure
  - Create test utilities for game state generation
  - _Requirements: All testable requirements_

- [x] 2. Implement core game state and initialization
  - [x] 2.1 Create game state variables and constants
    - Define snake array, food object, direction vectors
    - Set grid size and tile count constants
    - Initialize score and game flags
    - _Requirements: 1.5, 6.1_

  - [x]* 2.2 Write unit test for initial game state
    - Test score starts at 0
    - Test snake has one segment
    - Test grid is 20x20 tiles
    - _Requirements: 1.5, 6.1_

- [x] 3. Implement movement and screen wrapping
  - [x] 3.1 Create game loop update function
    - Implement continuous movement logic
    - Calculate new head position based on direction
    - Apply screen wrapping with modulo arithmetic
    - _Requirements: 1.1, 1.4_

  - [x]* 3.2 Write property test for screen wrapping
    - **Property 3: Screen wrapping boundary behavior**
    - **Validates: Requirements 1.4**

  - [x]* 3.3 Write unit tests for movement edge cases
    - Test wrapping at each boundary (top, bottom, left, right)
    - Test movement in each direction
    - _Requirements: 1.1, 1.4_

- [x] 4. Implement collision detection
  - [x] 4.1 Create self-collision detection function
    - Implement checkSelfCollision() to compare head with body
    - Integrate collision check into game loop
    - Set gameOver flag on collision
    - _Requirements: 1.3, 8.1, 8.2_

  - [x]* 4.2 Write property test for collision detection
    - **Property 2: Self-collision triggers game over**
    - **Validates: Requirements 1.3, 8.1**

  - [x]* 4.3 Write property test for game over state
    - **Property 4: Game over halts state updates**
    - **Validates: Requirements 8.2**

  - [x]* 4.4 Write unit tests for collision edge cases
    - Test single-segment snake (no collision possible)
    - Test collision with various body positions
    - _Requirements: 1.3_

- [x] 5. Implement food system
  - [x] 5.1 Create food spawning logic
    - Implement randomFood() with collision avoidance
    - Implement checkCollisionAt() helper function
    - Ensure food never spawns on snake body
    - _Requirements: 2.1, 2.2_

  - [x] 5.2 Implement food consumption detection
    - Check head position against food position
    - Grow snake by one segment on consumption
    - Spawn new food after consumption
    - Increment score on consumption
    - _Requirements: 1.2, 2.3, 6.2_

  - [x]* 5.3 Write property test for food spawning
    - **Property 5: Food spawns at empty locations**
    - **Validates: Requirements 2.2**

  - [x]* 5.4 Write property test for consumption detection
    - **Property 6: Food consumption detection**
    - **Validates: Requirements 2.3**

  - [x]* 5.5 Write property test for snake growth
    - **Property 1: Snake growth on food consumption**
    - **Validates: Requirements 1.2**

  - [x]* 5.6 Write property test for score increment
    - **Property 12: Score increments on consumption**
    - **Validates: Requirements 6.2**

- [x] 6. Checkpoint - Ensure core game mechanics work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement manual control system
  - [x] 7.1 Create keyboard event listener
    - Listen for arrow key events
    - Update direction variables based on input
    - Prevent 180-degree direction reversals
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x]* 7.2 Write property test for direction reversal prevention
    - **Property 7: Direction changes prevent 180-degree reversals**
    - **Validates: Requirements 3.5, 4.5**

  - [x]* 7.3 Write unit tests for individual arrow keys
    - Test up arrow changes direction to up (when not moving down)
    - Test down arrow changes direction to down (when not moving up)
    - Test left arrow changes direction to left (when not moving right)
    - Test right arrow changes direction to right (when not moving left)
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 8. Implement AI controller
  - [x] 8.1 Create AI move calculation function
    - Generate all possible moves (up, down, left, right)
    - Filter out 180-degree reversals
    - Calculate Manhattan distance to food for each move
    - Check safety (no collision) for each move
    - Sort by safety first, then proximity to food
    - Select best move and update direction
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [x]* 8.2 Write property test for AI food prioritization
    - **Property 9: AI prioritizes proximity to food**
    - **Validates: Requirements 4.2**

  - [x]* 8.3 Write property test for AI collision avoidance
    - **Property 10: AI avoids immediate collisions**
    - **Validates: Requirements 4.3**

  - [x]* 8.4 Write property test for AI trapped scenarios
    - **Property 11: AI makes valid moves when trapped**
    - **Validates: Requirements 4.4**

  - [x]* 8.5 Write unit tests for AI edge cases
    - Test AI with food directly adjacent
    - Test AI with food requiring wrapping
    - Test AI with very long snake body
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 9. Implement mode switching system
  - [x] 9.1 Create mode control functions
    - Implement setAIMode() and setManualMode()
    - Update aiMode flag
    - Implement updateButtonStates() for visual feedback
    - _Requirements: 5.1, 5.2, 5.4_

  - [x] 9.2 Integrate mode check into controllers
    - Make manual controller check aiMode before processing input
    - Make game loop call aiMove() when aiMode is true
    - _Requirements: 5.3_

  - [x]* 9.3 Write property test for input isolation
    - **Property 8: Manual mode ignores input when AI active**
    - **Validates: Requirements 5.3**

  - [x]* 9.4 Write unit tests for mode switching
    - Test AI button activates AI mode
    - Test manual button activates manual mode
    - Test mode can switch during gameplay
    - _Requirements: 5.1, 5.2, 5.5_

- [x] 10. Checkpoint - Ensure all control systems work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement rendering system
  - [x] 11.1 Create main draw function
    - Clear canvas with black background
    - Render snake segments with different colors for head/body
    - Render food as berry with leaf
    - _Requirements: 7.1, 7.2_

  - [x] 11.2 Create game over overlay
    - Implement drawGameOver() function
    - Display "GAME OVER" message
    - Display restart instructions
    - _Requirements: 8.3, 8.4, 8.5_

  - [x] 11.3 Integrate rendering into game loop
    - Call draw() after each state update
    - Call drawGameOver() when gameOver is true
    - _Requirements: 7.1, 8.3_

- [x] 12. Implement score display
  - [x] 12.1 Create score UI update logic
    - Update score element text content on consumption
    - Ensure score displays continuously during gameplay
    - _Requirements: 6.3_

- [x] 13. Final integration and polish
  - [x] 13.1 Wire all components together
    - Ensure game loop calls all necessary functions
    - Verify mode switching works seamlessly
    - Test complete gameplay flow (manual and AI)
    - _Requirements: All requirements_

  - [x]* 13.2 Run full test suite
    - Execute all unit tests
    - Execute all property-based tests
    - Verify 100% property coverage
    - _Requirements: All testable requirements_

- [x] 14. Final checkpoint - Complete validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- The game is already implemented, so these tasks serve as documentation and testing guidance
- Focus on getting comprehensive test coverage to validate the existing implementation

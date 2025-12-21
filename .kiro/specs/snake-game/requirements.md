# Requirements Document

## Introduction

This document specifies the requirements for a browser-based Snake game with both manual and AI-controlled gameplay modes. The game features classic Snake mechanics with screen wrapping, collision detection, and an intelligent AI opponent that can play autonomously.

## Glossary

- **Snake**: The player-controlled entity composed of connected segments that grows when consuming food
- **Food**: A collectible item (berry) that appears randomly on the game grid
- **Game_Grid**: A 20x20 tile-based playing field where the game takes place
- **AI_Controller**: The autonomous system that calculates optimal moves for the snake
- **Manual_Controller**: The keyboard-based input system for human players
- **Screen_Wrap**: The behavior where the snake reappears on the opposite side when crossing a boundary

## Requirements

### Requirement 1: Core Game Mechanics

**User Story:** As a player, I want to control a snake that moves continuously and grows when eating food, so that I can play the classic Snake game.

#### Acceptance Criteria

1. THE Snake SHALL move continuously in the current direction at a fixed interval
2. WHEN the snake consumes food, THE Snake SHALL grow by one segment
3. WHEN the snake's head collides with its own body, THE Game SHALL end
4. WHEN the snake crosses a screen boundary, THE Snake SHALL wrap to the opposite side
5. THE Game_Grid SHALL be 20x20 tiles in size

### Requirement 2: Food System

**User Story:** As a player, I want food to appear randomly on the grid, so that I have objectives to pursue during gameplay.

#### Acceptance Criteria

1. WHEN food is consumed, THE Game SHALL spawn new food at a random empty location
2. THE Game SHALL prevent food from spawning on the snake's body
3. WHEN the snake's head occupies the same position as food, THE Game SHALL register consumption
4. THE Food SHALL be visually distinct from the snake

### Requirement 3: Manual Control

**User Story:** As a player, I want to control the snake using arrow keys, so that I can play the game manually.

#### Acceptance Criteria

1. WHEN the up arrow key is pressed and the snake is not moving down, THE Manual_Controller SHALL change direction to up
2. WHEN the down arrow key is pressed and the snake is not moving up, THE Manual_Controller SHALL change direction to down
3. WHEN the left arrow key is pressed and the snake is not moving right, THE Manual_Controller SHALL change direction to left
4. WHEN the right arrow key is pressed and the snake is not moving left, THE Manual_Controller SHALL change direction to right
5. THE Manual_Controller SHALL prevent 180-degree direction reversals

### Requirement 4: AI Mode

**User Story:** As a user, I want to watch an AI play the game autonomously, so that I can observe optimal gameplay strategies.

#### Acceptance Criteria

1. WHEN AI mode is active, THE AI_Controller SHALL calculate the next move before each update
2. THE AI_Controller SHALL prioritize moves that bring the snake closer to food
3. THE AI_Controller SHALL avoid moves that would cause immediate collision with the snake's body
4. WHEN no safe move toward food exists, THE AI_Controller SHALL choose any valid move to survive
5. THE AI_Controller SHALL prevent 180-degree direction reversals

### Requirement 5: Mode Switching

**User Story:** As a user, I want to switch between manual and AI control modes, so that I can choose how to play the game.

#### Acceptance Criteria

1. WHEN the AI mode button is clicked, THE Game SHALL activate AI control
2. WHEN the manual mode button is clicked, THE Game SHALL activate manual control
3. WHEN AI mode is active, THE Game SHALL ignore keyboard input
4. THE Game SHALL provide visual feedback indicating the current active mode
5. THE Game SHALL allow mode switching at any time during gameplay

### Requirement 6: Score Tracking

**User Story:** As a player, I want to see my current score, so that I can track my progress.

#### Acceptance Criteria

1. WHEN the game starts, THE Game SHALL initialize the score to zero
2. WHEN food is consumed, THE Game SHALL increment the score by one
3. THE Game SHALL display the current score continuously during gameplay

### Requirement 7: Visual Presentation

**User Story:** As a player, I want a retro-styled visual presentation, so that I can enjoy a nostalgic gaming experience.

#### Acceptance Criteria

1. THE Game SHALL render the snake with a distinct head and body segments
2. THE Game SHALL render food as a berry with a leaf decoration
3. THE Game SHALL use a dark background with bright contrasting colors
4. THE Game SHALL display rounded corners on snake segments
5. THE Game SHALL use a monospace font for text elements

### Requirement 8: Game Over State

**User Story:** As a player, I want clear feedback when the game ends, so that I know the game has concluded.

#### Acceptance Criteria

1. WHEN the snake collides with itself, THE Game SHALL enter a game over state
2. WHEN in game over state, THE Game SHALL stop all movement
3. WHEN in game over state, THE Game SHALL display a "GAME OVER" message
4. WHEN in game over state, THE Game SHALL display instructions to restart
5. THE Game SHALL overlay the game over message on the game grid

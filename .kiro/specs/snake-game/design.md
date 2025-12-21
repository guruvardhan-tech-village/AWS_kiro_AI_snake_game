# Design Document: Snake Game

## Overview

The Snake game is a browser-based implementation of the classic arcade game, built using HTML5 Canvas and vanilla JavaScript. The system features a tile-based grid where a snake moves continuously, consuming food to grow while avoiding self-collision. The design supports both manual keyboard control and an autonomous AI mode with intelligent pathfinding and collision avoidance.

The architecture follows a game loop pattern with separation between rendering, game state management, and control systems (manual vs AI). The AI uses a greedy algorithm with safety checks, prioritizing moves that minimize Manhattan distance to food while avoiding body collisions.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│           Browser (HTML/CSS)            │
│  ┌───────────────────────────────────┐  │
│  │      Canvas Rendering Layer       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Game Engine (JavaScript)        │
│  ┌─────────────────────────────────┐   │
│  │       Game Loop (update)        │   │
│  │  - State Management             │   │
│  │  - Collision Detection          │   │
│  │  - Food Spawning                │   │
│  └─────────────────────────────────┘   │
│           ↕              ↕              │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Manual     │  │      AI      │   │
│  │  Controller  │  │  Controller  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Game Loop**: Executes at fixed intervals (200ms), orchestrating all game logic
2. **Controller Selection**: Routes control to either Manual or AI controller based on mode
3. **Movement Calculation**: Determines next head position with screen wrapping
4. **Collision Detection**: Checks for self-collision and food consumption
5. **State Update**: Modifies snake array and score
6. **Rendering**: Draws updated game state to canvas

## Components and Interfaces

### Game State

The core game state is maintained through module-level variables:

```javascript
{
  snake: Array<{x: number, y: number}>,  // Snake segments, head at index 0
  food: {x: number, y: number},          // Current food position
  dx: number,                             // Horizontal velocity (-1, 0, 1)
  dy: number,                             // Vertical velocity (-1, 0, 1)
  score: number,                          // Current score
  gameOver: boolean,                      // Game state flag
  aiMode: boolean                         // Control mode flag
}
```

### Manual Controller

**Interface:**
- Input: Keyboard events (ArrowUp, ArrowDown, ArrowLeft, ArrowRight)
- Output: Updates `dx` and `dy` direction variables

**Behavior:**
- Listens for keydown events
- Validates move doesn't reverse direction (180-degree turn prevention)
- Only processes input when `aiMode === false`

### AI Controller

**Interface:**
```javascript
function aiMove(): void
```

**Algorithm:**
1. Generate all possible moves (up, down, left, right)
2. Filter out 180-degree reversals
3. For each valid move:
   - Calculate wrapped destination coordinates
   - Compute Manhattan distance to food
   - Check safety (no body collision at destination)
4. Sort moves by: safety first, then proximity to food
5. Select best move and update `dx`, `dy`

**Collision Avoidance:**
```javascript
function checkCollisionAt(x: number, y: number): boolean
```
Returns true if position overlaps any snake segment.

### Food System

**Spawning:**
```javascript
function randomFood(): {x: number, y: number}
```
- Generates random grid coordinates
- Retries if position overlaps snake body
- Returns valid empty position

**Consumption Detection:**
- Compares head position with food position
- Triggers on exact coordinate match

### Collision Detection

**Self-Collision:**
```javascript
function checkSelfCollision(head: {x: number, y: number}): boolean
```
- Iterates through snake body (excluding head)
- Returns true if head matches any body segment position

**Screen Wrapping:**
- Applied before collision check
- Modulo arithmetic wraps coordinates to grid bounds

### Rendering System

**Main Draw Function:**
```javascript
function draw(): void
```
- Clears canvas with black background
- Renders snake segments (head in bright green, body in darker green)
- Renders food as berry with leaf decoration

**Snake Rendering:**
```javascript
function drawSnakePart(x: number, y: number, color: string): void
```
- Draws rounded rectangle at grid position
- Uses different colors for head vs body

**Food Rendering:**
```javascript
function drawBerry(x: number, y: number): void
```
- Draws red circle for berry body
- Draws small green circle for leaf

**Game Over Overlay:**
```javascript
function drawGameOver(): void
```
- Semi-transparent black overlay
- Centered "GAME OVER" text
- Restart instructions

### Mode Control

**Mode Switching:**
```javascript
function setAIMode(): void
function setManualMode(): void
```
- Updates `aiMode` flag
- Calls `updateButtonStates()` for visual feedback

**Button State Management:**
```javascript
function updateButtonStates(): void
```
- Applies CSS classes based on active mode
- Highlights active button, dims inactive button

## Data Models

### Position

```javascript
type Position = {
  x: number,  // Grid column (0 to tileCount-1)
  y: number   // Grid row (0 to tileCount-1)
}
```

### Snake

```javascript
type Snake = Array<Position>
```
- Index 0: Head
- Index 1+: Body segments
- Length increases when food consumed

### Direction Vector

```javascript
type Direction = {
  dx: number,  // -1 (left), 0 (none), 1 (right)
  dy: number   // -1 (up), 0 (none), 1 (down)
}
```

### AI Move Candidate

```javascript
type MoveCandidate = {
  dx: number,
  dy: number,
  priority: number,  // Negative Manhattan distance to food
  safe: boolean      // True if no collision at destination
}
```

### Game Constants

```javascript
const gridSize = 20;           // Pixels per tile
const tileCount = 20;          // Grid dimensions
const updateInterval = 200;    // Milliseconds per frame
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Core Game Mechanics Properties

**Property 1: Snake growth on food consumption**
*For any* snake state and food position, when the snake's head position equals the food position, the snake's length should increase by exactly one segment after the update cycle.
**Validates: Requirements 1.2**

**Property 2: Self-collision triggers game over**
*For any* snake configuration where the head position matches any body segment position, the game should enter the game over state.
**Validates: Requirements 1.3, 8.1**

**Property 3: Screen wrapping boundary behavior**
*For any* snake head position at a grid boundary (x=0, x=tileCount-1, y=0, y=tileCount-1), moving beyond the boundary should result in the head appearing at the opposite boundary.
**Validates: Requirements 1.4**

**Property 4: Game over halts state updates**
*For any* game state where gameOver is true, calling update() should not modify the snake array, food position, or score.
**Validates: Requirements 8.2**

### Food System Properties

**Property 5: Food spawns at empty locations**
*For any* snake configuration, generating new food should produce a position that does not overlap with any snake segment.
**Validates: Requirements 2.2**

**Property 6: Food consumption detection**
*For any* snake head position and food position, consumption should be registered if and only if the positions are exactly equal.
**Validates: Requirements 2.3**

### Control System Properties

**Property 7: Direction changes prevent 180-degree reversals**
*For any* current direction (dx, dy) and requested new direction (newDx, newDy), the direction change should be rejected if newDx === -dx AND newDy === -dy.
**Validates: Requirements 3.5, 4.5**

**Property 8: Manual mode ignores input when AI active**
*For any* keyboard input event when aiMode is true, the direction variables (dx, dy) should remain unchanged.
**Validates: Requirements 5.3**

### AI Controller Properties

**Property 9: AI prioritizes proximity to food**
*For any* game state with multiple safe moves available, the AI should select the move that minimizes Manhattan distance to the food position.
**Validates: Requirements 4.2**

**Property 10: AI avoids immediate collisions**
*For any* game state where at least one safe move exists (no body collision), the AI should never select a move that would cause the head to collide with the body.
**Validates: Requirements 4.3**

**Property 11: AI makes valid moves when trapped**
*For any* game state where all moves toward food result in collision, the AI should still select a valid move (one that doesn't reverse direction).
**Validates: Requirements 4.4**

### Score System Properties

**Property 12: Score increments on consumption**
*For any* score value and food consumption event, the score should increase by exactly one.
**Validates: Requirements 6.2**

## Error Handling

### Invalid State Prevention

**Grid Boundary Validation:**
- All position calculations use modulo arithmetic to ensure coordinates remain within [0, tileCount-1]
- Screen wrapping prevents out-of-bounds positions

**Collision Detection:**
- Self-collision check runs before state update
- Game over flag prevents further state modifications
- No recovery mechanism—game must be restarted

**Food Spawning:**
- Retry loop ensures food never spawns on snake body
- Theoretical infinite loop if grid is full (not possible with 20x20 grid and snake growth rate)

### Input Validation

**Direction Changes:**
- 180-degree reversal prevention in both manual and AI controllers
- Invalid key presses are ignored (no error thrown)

**Mode Switching:**
- Mode can be changed at any time without validation
- No state corruption from mid-game mode changes

### Edge Cases

**Single-Segment Snake:**
- Initial state has one segment
- No body collision possible
- All four directions are valid

**Maximum Snake Length:**
- Theoretical maximum: 400 segments (20x20 grid)
- Game becomes unplayable before reaching maximum
- No explicit handling needed

**AI Trapped State:**
- AI may select unsafe move if all moves lead to collision
- Game will end on next update cycle
- This is acceptable behavior (inevitable loss)

## Testing Strategy

### Dual Testing Approach

This feature will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs
- Both approaches are complementary and necessary for complete validation

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tag format: `Feature: snake-game, Property N: [property description]`

**Test Categories:**

1. **Game Mechanics Properties** (Properties 1-4)
   - Generate random snake configurations
   - Generate random food positions
   - Verify growth, collision, wrapping, and game over behavior

2. **Food System Properties** (Properties 5-6)
   - Generate random snake bodies of varying lengths
   - Verify food spawning constraints
   - Verify consumption detection accuracy

3. **Control Properties** (Properties 7-8)
   - Generate random direction states
   - Generate random input events
   - Verify reversal prevention and mode isolation

4. **AI Properties** (Properties 9-11)
   - Generate random game states with varying food distances
   - Generate trapped scenarios (limited safe moves)
   - Verify AI decision-making algorithm

5. **Score Properties** (Property 12)
   - Generate random consumption sequences
   - Verify score increments correctly

### Unit Testing

**Framework:** Jest or Vitest

**Test Categories:**

1. **Initialization Tests**
   - Verify initial game state (score=0, snake length=1, grid size=20x20)
   - Verify initial direction and mode settings

2. **Specific Input Tests**
   - Test each arrow key individually (Requirements 3.1-3.4)
   - Test mode button clicks (Requirements 5.1-5.2)

3. **Edge Cases**
   - Single-segment snake behavior
   - Food spawning with nearly-full grid
   - AI behavior with no safe moves

4. **Integration Tests**
   - Complete game loop cycle
   - Mode switching during active gameplay
   - Multiple food consumptions in sequence

### Test Isolation

**State Management:**
- Reset game state before each test
- Use fresh snake and food positions
- Clear event listeners between tests

**Mocking Strategy:**
- Mock `Math.random()` for deterministic food spawning
- Mock `setInterval` for controlled game loop testing
- Mock canvas context for rendering tests (if needed)

### Coverage Goals

- **Line Coverage:** >90% for game logic
- **Branch Coverage:** >85% for conditional logic
- **Property Coverage:** 100% of defined correctness properties
- **Requirement Coverage:** All testable acceptance criteria

### Continuous Validation

- Run unit tests on every code change
- Run property tests before commits
- Verify no regressions in existing functionality
- Maintain test suite as code evolves

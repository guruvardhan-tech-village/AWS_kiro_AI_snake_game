# Snake Game Testing Infrastructure

This document explains how to use the testing infrastructure set up for the Snake game project.

## Overview

The testing infrastructure provides:
- **Unit Testing**: Jest/Vitest-like API for specific test cases
- **Property-Based Testing**: fast-check-like API for universal properties
- **Test Utilities**: Game state generators and helper functions
- **Browser-Based Execution**: No Node.js required

## Running Tests

1. Open `test.html` in a web browser
2. Click "Run All Tests" to execute the complete test suite
3. Use specific buttons to run only unit tests or property tests
4. View results in the test output panel

## Writing Unit Tests

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    testUtils.resetGame();
  });

  test('should do something specific', () => {
    // Arrange
    const gameState = testUtils.createGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 }
    });
    testUtils.applyGameState(gameState);

    // Act
    // Call the function being tested

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

## Writing Property Tests

```javascript
test('Property N: Description', () => {
  const property = fc.property(
    fc.gameState(), // Generator
    (gameState) => {
      // Test the property
      return someCondition === true;
    }
  );

  fc.assert(property, 100); // 100 iterations
});
```

## Available Generators

### Basic Generators
- `fc.integer(min, max)` - Random integers
- `fc.boolean()` - Random booleans
- `fc.constantFrom(...values)` - Pick from values
- `fc.array(generator, minLen, maxLen)` - Random arrays

### Game-Specific Generators
- `fc.position()` - Random grid positions
- `fc.direction()` - Random movement directions
- `fc.snake(minLen, maxLen)` - Random snake configurations
- `fc.gameState()` - Complete random game states

## Test Utilities

### Game State Management
```javascript
testUtils.saveGameState();     // Save current state
testUtils.restoreGameState();  // Restore saved state
testUtils.resetGame();         // Reset to initial state
testUtils.applyGameState(state); // Apply specific state
```

### Test Data Creation
```javascript
testUtils.createSnake(segments);     // Create test snake
testUtils.createFood(x, y);          // Create test food
testUtils.createGameState(options);  // Create test game state
```

### Helper Functions
```javascript
testUtils.randomPosition();          // Random position
testUtils.randomDirection();         // Random direction
testUtils.manhattanDistance(p1, p2); // Distance calculation
testUtils.wrapPosition(pos);         // Apply screen wrapping
```

### Input Simulation
```javascript
testUtils.simulateKeyPress('ArrowUp'); // Simulate keyboard input
testUtils.mockRandom(0.5);            // Mock Math.random
testUtils.mockRandomSequence([0.1, 0.5, 0.9]); // Mock sequence
```

## Test Configuration

Test settings are defined in `tests/test-config.js`:

```javascript
TEST_CONFIG = {
  propertyTesting: {
    iterations: 100,  // Property test iterations
    timeout: 5000     // Test timeout
  },
  game: {
    gridSize: 20,     // Game grid size
    tileCount: 20     // Tile count
  }
}
```

## File Structure

```
├── test.html              # Test runner (open in browser)
├── test-framework.js      # Unit testing framework
├── property-testing.js    # Property-based testing framework
├── test-utils.js         # Game-specific test utilities
├── tests/
│   ├── unit-tests.js     # Unit test implementations
│   ├── property-tests.js # Property test implementations
│   ├── test-config.js    # Test configuration
│   └── README.md         # Test directory documentation
└── TESTING.md            # This file
```

## Property Test Tags

Each property test must include a tag comment:

```javascript
test('Property 1: Snake growth on food consumption', () => {
  // **Feature: snake-game, Property 1: Snake growth on food consumption**
  // **Validates: Requirements 1.2**
  
  const property = fc.property(/* ... */);
  fc.assert(property, 100);
});
```

## Best Practices

1. **Reset State**: Always reset game state in `beforeEach`
2. **Use Generators**: Prefer property tests for universal properties
3. **Test Edge Cases**: Use unit tests for specific edge cases
4. **Tag Tests**: Include proper tags for property tests
5. **Validate Requirements**: Each test should validate specific requirements
6. **Minimal Mocking**: Avoid mocking unless necessary
7. **Clear Assertions**: Use descriptive assertion messages

## Troubleshooting

### Tests Not Running
- Ensure `test.html` is opened in a modern browser
- Check browser console for JavaScript errors
- Verify all test files are properly loaded

### Property Tests Failing
- Check the counterexample in the error message
- Verify generators produce valid inputs
- Ensure property logic is correct

### Unit Tests Failing
- Verify game state is properly reset
- Check that expected values match actual behavior
- Ensure test setup matches the scenario being tested

## Next Steps

1. Implement actual test cases in `tests/unit-tests.js`
2. Implement property tests in `tests/property-tests.js`
3. Add more game-specific generators as needed
4. Expand test utilities for complex scenarios
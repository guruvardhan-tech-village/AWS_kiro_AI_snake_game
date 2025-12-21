# Snake Game Tests

This directory contains all test files for the Snake game project.

## Structure

- `unit-tests.js` - Unit tests for specific functionality and edge cases
- `property-tests.js` - Property-based tests for universal correctness properties
- `test-config.js` - Test configuration and setup

## Running Tests

Open `test.html` in a browser to run the test suite.

## Test Types

### Unit Tests
- Test specific examples and edge cases
- Verify individual functions work correctly
- Test error conditions and boundary values

### Property-Based Tests
- Test universal properties across many random inputs
- Verify correctness properties from the design document
- Run 100+ iterations per property

## Test Utilities

The `testUtils` global provides helpers for:
- Creating test game states
- Generating random positions and directions
- Mocking game functions
- Simulating user input

## Property Testing

The `fc` global provides generators for:
- Random positions and directions
- Random snake configurations
- Random game states
- Custom game-specific data types
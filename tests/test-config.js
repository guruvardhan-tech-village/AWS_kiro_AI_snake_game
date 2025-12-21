// Test configuration for Snake game
// Defines test settings and constants

const TEST_CONFIG = {
  // Property-based testing configuration
  propertyTesting: {
    iterations: 100,  // Minimum iterations per property test
    timeout: 5000,    // Test timeout in milliseconds
    shrinking: true   // Enable input shrinking on failure
  },

  // Unit testing configuration
  unitTesting: {
    timeout: 1000,    // Test timeout in milliseconds
    retries: 0        // Number of retries on failure
  },

  // Game-specific test constants
  game: {
    gridSize: 20,     // Grid size constant
    tileCount: 20,    // Tile count constant
    maxSnakeLength: 50, // Maximum snake length for testing
    testIterations: {
      quick: 10,      // Quick test iterations
      normal: 100,    // Normal test iterations
      thorough: 1000  // Thorough test iterations
    }
  },

  // Test data generation settings
  generators: {
    maxPosition: 19,  // Maximum position value (0-19)
    maxSnakeLength: 10, // Maximum snake length for generators
    maxScore: 1000,   // Maximum score for generators
    randomSeed: null  // Random seed (null for random)
  },

  // Test output configuration
  output: {
    verbose: true,    // Enable verbose output
    showPassing: true, // Show passing tests
    showTiming: true,  // Show test timing
    colorOutput: true  // Enable colored output (if supported)
  }
};

// Export configuration
if (typeof window !== 'undefined') {
  window.TEST_CONFIG = TEST_CONFIG;
}

console.log('⚙️  Test configuration loaded');
// Property-based testing framework (fast-check alternative for browser)
// Provides generators and property testing functionality

class PropertyTesting {
  constructor() {
    this.defaultIterations = 100;
  }

  // Basic generators
  integer(min = -1000, max = 1000) {
    return {
      generate: () => Math.floor(Math.random() * (max - min + 1)) + min
    };
  }

  nat(max = 1000) {
    return this.integer(0, max);
  }

  boolean() {
    return {
      generate: () => Math.random() < 0.5
    };
  }

  constantFrom(...values) {
    return {
      generate: () => values[Math.floor(Math.random() * values.length)]
    };
  }

  array(elementGen, minLength = 0, maxLength = 10) {
    return {
      generate: () => {
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const result = [];
        for (let i = 0; i < length; i++) {
          result.push(elementGen.generate());
        }
        return result;
      }
    };
  }

  record(generators) {
    return {
      generate: () => {
        const result = {};
        for (const [key, gen] of Object.entries(generators)) {
          result[key] = gen.generate();
        }
        return result;
      }
    };
  }

  tuple(...generators) {
    return {
      generate: () => generators.map(gen => gen.generate())
    };
  }

  // Property testing function
  property(generators, predicate) {
    return {
      generators,
      predicate,
      check: (iterations = this.defaultIterations) => {
        for (let i = 0; i < iterations; i++) {
          let inputs;
          try {
            if (Array.isArray(generators)) {
              // Handle array of generators
              inputs = generators.map(gen => gen.generate());
            } else {
              // Handle single generator
              inputs = [generators.generate()];
            }
            
            const result = predicate(...inputs);
            if (result === false) {
              return {
                success: false,
                counterExample: inputs,
                iteration: i
              };
            }
          } catch (error) {
            return {
              success: false,
              counterExample: inputs || [],
              iteration: i,
              error: error.message
            };
          }
        }
        return { success: true, iterations };
      }
    };
  }

  // Assert property holds
  assert(property, iterations = this.defaultIterations) {
    const result = property.check(iterations);
    if (!result.success) {
      const errorMsg = result.error 
        ? `Property failed with error: ${result.error}`
        : `Property failed with counterexample: ${JSON.stringify(result.counterExample)}`;
      throw new Error(`${errorMsg} (iteration ${result.iteration})`);
    }
    return result;
  }

  // Custom generators for Snake game
  position(maxX = 19, maxY = 19) {
    return this.record({
      x: this.integer(0, maxX),
      y: this.integer(0, maxY)
    });
  }

  direction() {
    return this.constantFrom(
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    );
  }

  snake(minLength = 1, maxLength = 10) {
    return {
      generate: () => {
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const snake = [];
        
        // Generate head position
        const head = this.position().generate();
        snake.push(head);
        
        // Generate body segments (ensuring they don't overlap)
        const usedPositions = new Set([`${head.x},${head.y}`]);
        
        for (let i = 1; i < length; i++) {
          let attempts = 0;
          let segment;
          do {
            segment = this.position().generate();
            attempts++;
          } while (usedPositions.has(`${segment.x},${segment.y}`) && attempts < 100);
          
          if (attempts < 100) {
            snake.push(segment);
            usedPositions.add(`${segment.x},${segment.y}`);
          }
        }
        
        return snake;
      }
    };
  }

  gameState() {
    return {
      generate: () => {
        const snake = this.snake(1, 5).generate();
        const direction = this.direction().generate();
        
        // Generate food position that doesn't overlap with snake
        let food;
        let attempts = 0;
        do {
          food = this.position().generate();
          attempts++;
        } while (
          snake.some(segment => segment.x === food.x && segment.y === food.y) && 
          attempts < 100
        );
        
        return {
          snake,
          food,
          dx: direction.dx,
          dy: direction.dy,
          score: this.nat(100).generate(),
          gameOver: this.boolean().generate(),
          aiMode: this.boolean().generate()
        };
      }
    };
  }
}

// Create global instance
const fc = new PropertyTesting();
window.fc = fc;
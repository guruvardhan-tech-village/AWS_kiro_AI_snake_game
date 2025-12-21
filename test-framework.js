// Simple testing framework for browser-based testing
// Mimics Jest/Vitest functionality without Node.js dependencies

class TestFramework {
  constructor() {
    this.tests = [];
    this.describes = [];
    this.currentDescribe = null;
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      failures: []
    };
  }

  describe(description, fn) {
    const previousDescribe = this.currentDescribe;
    this.currentDescribe = description;
    this.describes.push(description);
    fn();
    this.currentDescribe = previousDescribe;
  }

  test(description, fn) {
    const fullDescription = this.currentDescribe 
      ? `${this.currentDescribe} - ${description}` 
      : description;
    
    this.tests.push({
      description: fullDescription,
      fn: fn
    });
  }

  it(description, fn) {
    this.test(description, fn);
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) {
          throw new Error(`Expected ${actual} to be ${expected}`);
        }
      },
      toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
        }
      },
      toBeTruthy: () => {
        if (!actual) {
          throw new Error(`Expected ${actual} to be truthy`);
        }
      },
      toBeFalsy: () => {
        if (actual) {
          throw new Error(`Expected ${actual} to be falsy`);
        }
      },
      toBeGreaterThan: (expected) => {
        if (actual <= expected) {
          throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
      },
      toContain: (expected) => {
        if (!actual.includes(expected)) {
          throw new Error(`Expected ${actual} to contain ${expected}`);
        }
      },
      toHaveLength: (expected) => {
        if (actual.length !== expected) {
          throw new Error(`Expected ${actual} to have length ${expected}, got ${actual.length}`);
        }
      },
      toBeDefined: () => {
        if (actual === undefined || actual === null) {
          throw new Error(`Expected ${actual} to be defined`);
        }
      },
      toBeUndefined: () => {
        if (actual !== undefined) {
          throw new Error(`Expected ${actual} to be undefined`);
        }
      },
      toBeLessThan: (expected) => {
        if (actual >= expected) {
          throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
      },
      toBeGreaterThanOrEqual: (expected) => {
        if (actual < expected) {
          throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
        }
      },
      toBeLessThanOrEqual: (expected) => {
        if (actual > expected) {
          throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
        }
      }
    };
  }

  async runTests() {
    console.log('🧪 Running tests...\n');
    this.results = { passed: 0, failed: 0, total: 0, failures: [] };

    for (const test of this.tests) {
      this.results.total++;
      try {
        // Run beforeEach if it exists
        if (this.beforeEachFn) {
          await this.beforeEachFn();
        }
        
        await test.fn();
        this.results.passed++;
        console.log(`✅ ${test.description}`);
      } catch (error) {
        this.results.failed++;
        this.results.failures.push({
          description: test.description,
          error: error.message
        });
        console.log(`❌ ${test.description}`);
        console.log(`   Error: ${error.message}`);
      }
      
      // Run afterEach if it exists
      if (this.afterEachFn) {
        try {
          await this.afterEachFn();
        } catch (error) {
          console.log(`   Warning: afterEach failed: ${error.message}`);
        }
      }
    }

    this.printSummary();
    return this.results;
  }

  printSummary() {
    console.log('\n📊 Test Summary:');
    console.log(`Total: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed tests:');
      this.results.failures.forEach(failure => {
        console.log(`  - ${failure.description}: ${failure.error}`);
      });
    }
  }

  beforeEach(fn) {
    this.beforeEachFn = fn;
  }

  afterEach(fn) {
    this.afterEachFn = fn;
  }
}

// Create global test framework instance
const testFramework = new TestFramework();

// Export global functions
window.describe = testFramework.describe.bind(testFramework);
window.test = testFramework.test.bind(testFramework);
window.it = testFramework.it.bind(testFramework);
window.expect = testFramework.expect.bind(testFramework);
window.beforeEach = testFramework.beforeEach.bind(testFramework);
window.afterEach = testFramework.afterEach.bind(testFramework);
window.runTests = testFramework.runTests.bind(testFramework);
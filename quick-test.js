// Quick test to debug the issues
console.log('=== QUICK TEST DEBUG ===');

// Mock DOM environment
global.window = global;
global.document = {
    getElementById: (id) => ({
        width: 400,
        height: 400,
        getContext: () => ({
            fillStyle: '',
            fillRect: () => {},
            beginPath: () => {},
            arc: () => {},
            fill: () => {},
            roundRect: () => {}
        }),
        className: '',
        textContent: '0'
    }),
    addEventListener: () => {}
};

// Load test framework
eval(require('fs').readFileSync('test-framework.js', 'utf8'));
eval(require('fs').readFileSync('property-testing.js', 'utf8'));
eval(require('fs').readFileSync('test-utils.js', 'utf8'));

// Initialize game variables
testUtils.initializeGameVariables();

console.log('aiMode initial:', window.aiMode);
console.log('setAIMode function:', typeof window.setAIMode);
console.log('setManualMode function:', typeof window.setManualMode);

// Test mode switching
window.aiMode = false;
console.log('Set aiMode to false:', window.aiMode);

if (typeof window.setAIMode === 'function') {
    window.setAIMode();
    console.log('After setAIMode():', window.aiMode);
    
    if (typeof window.setManualMode === 'function') {
        window.setManualMode();
        console.log('After setManualMode():', window.aiMode);
    }
}

// Test a simple property test
console.log('\n=== TESTING PROPERTY TEST ===');
try {
    const property = fc.property(
        [fc.position(), fc.direction()],
        (startPos, direction) => {
            return startPos.x >= 0 && startPos.x < 20;
        }
    );
    
    const result = fc.assert(property, 10);
    console.log('Property test result:', result);
} catch (error) {
    console.log('Property test error:', error.message);
}
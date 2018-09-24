const fs = require('fs');
const path = require('path');

describe('main.wasm Tests', () => {
  let wasmInstance;

  beforeAll(async () => {
    const wasmPath = path.resolve(__dirname, '..', 'main.wasm');
    const buffer = fs.readFileSync(wasmPath);
    const results = await WebAssembly.instantiate(buffer, {
      env: {
        memoryBase: 0,
        tableBase: 0,
        memory: new WebAssembly.Memory({ initial: 1024 }),
        table: new WebAssembly.Table({ initial: 16, element: 'anyfunc' }),
        abort: console.log
      }
    });
    wasmInstance = results.instance.exports;
  });

  describe('the _addTwoNumbers function', () => {
    test('returns 300 when 100 and 200 are passed in', () => {
      const result = wasmInstance._addTwoNumbers(100, 200);
      expect(result).toEqual(300);
    });

    test('returns -20 when -10 and -10 are passed in', () => {
      const result = wasmInstance._addTwoNumbers(-10, -10);
      expect(result).toEqual(-20);
    });
  });

  describe('the _divideTwoNumbers function', () => {
    test.each([
      [10, 100, 10],
      [-2, -10, 5],
    ])('returns %f when %f and %f are passed in', (expected, a, b) => {
      const result = wasmInstance._divideTwoNumbers(a, b);
      expect(result).toEqual(expected);
    });

    test('returns ~3.77 when 20.75 and 5.5 are passed in', () => {
      const result = wasmInstance._divideTwoNumbers(20.75, 5.5);
      expect(result).toBeCloseTo(3.77, 2);
    });
  });

  describe('the _findFactorial function', () => {
    test.each([
      [120, 5],
      [362880, 9.2],
    ])('returns %p when %p is passed in', (expected, input) => {
      const result = wasmInstance._findFactorial(input);
      expect(result).toEqual(expected);
    });
  });
});

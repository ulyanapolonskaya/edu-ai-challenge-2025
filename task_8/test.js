/**
 * Comprehensive Test Suite for Robust Validation Library
 * Tests all validator types with valid and invalid data scenarios
 */

// Import the validation library
const { Schema } = require('./schema.js');

/**
 * Test runner utility
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  run() {
    console.log('🧪 Running Validation Library Tests...\n');

    for (const { description, testFn } of this.tests) {
      try {
        testFn();
        console.log(`✅ ${description}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${description}`);
        console.log(`   Error: ${error.message}\n`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results:`);
    console.log(`   Passed: ${this.passed}`);
    console.log(`   Failed: ${this.failed}`);
    console.log(`   Total: ${this.tests.length}`);

    if (this.failed === 0) {
      console.log('🎉 All tests passed!');
    } else {
      console.log('⚠️  Some tests failed!');
    }
  }
}

/**
 * Assertion utility
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertDeepEquals(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      message ||
        `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
    );
  }
}

// Initialize test runner
const runner = new TestRunner();

// String Validator Tests
runner.test('String validator accepts valid strings', () => {
  const validator = Schema.string();
  const result = validator.validate('hello world');
  assert(result.success, 'Should accept valid string');
  assertEquals(result.data, 'hello world', 'Should return the string value');
});

runner.test('String validator rejects non-strings', () => {
  const validator = Schema.string();
  const result = validator.validate(123);
  assert(!result.success, 'Should reject non-string values');
  assert(
    result.error.message.includes('Expected string'),
    'Should have appropriate error message'
  );
});

runner.test('String validator enforces minimum length', () => {
  const validator = Schema.string().minLength(5);
  const validResult = validator.validate('hello');
  const invalidResult = validator.validate('hi');

  assert(validResult.success, 'Should accept string meeting minimum length');
  assert(!invalidResult.success, 'Should reject string below minimum length');
});

runner.test('String validator enforces maximum length', () => {
  const validator = Schema.string().maxLength(5);
  const validResult = validator.validate('hello');
  const invalidResult = validator.validate('hello world');

  assert(validResult.success, 'Should accept string within maximum length');
  assert(
    !invalidResult.success,
    'Should reject string exceeding maximum length'
  );
});

runner.test('String validator enforces pattern matching', () => {
  const validator = Schema.string().pattern(/^[a-z]+$/);
  const validResult = validator.validate('hello');
  const invalidResult = validator.validate('Hello123');

  assert(validResult.success, 'Should accept string matching pattern');
  assert(!invalidResult.success, 'Should reject string not matching pattern');
});

runner.test('String validator handles optional values', () => {
  const validator = Schema.string().optional();
  const validResult = validator.validate(undefined);
  const invalidResult = validator.validate(123);

  assert(validResult.success, 'Should accept undefined for optional string');
  assert(!invalidResult.success, 'Should reject non-string even when optional');
});

runner.test('String validator uses custom error messages', () => {
  const validator = Schema.string().withMessage('Custom error message');
  const result = validator.validate(123);

  assert(!result.success, 'Should fail validation');
  assertEquals(
    result.error.message,
    'Custom error message',
    'Should use custom error message'
  );
});

// Number Validator Tests
runner.test('Number validator accepts valid numbers', () => {
  const validator = Schema.number();
  const result = validator.validate(42);
  assert(result.success, 'Should accept valid number');
  assertEquals(result.data, 42, 'Should return the number value');
});

runner.test('Number validator rejects non-numbers', () => {
  const validator = Schema.number();
  const result = validator.validate('not a number');
  assert(!result.success, 'Should reject non-number values');
});

runner.test('Number validator enforces minimum value', () => {
  const validator = Schema.number().min(10);
  const validResult = validator.validate(15);
  const invalidResult = validator.validate(5);

  assert(validResult.success, 'Should accept number above minimum');
  assert(!invalidResult.success, 'Should reject number below minimum');
});

runner.test('Number validator enforces maximum value', () => {
  const validator = Schema.number().max(100);
  const validResult = validator.validate(50);
  const invalidResult = validator.validate(150);

  assert(validResult.success, 'Should accept number below maximum');
  assert(!invalidResult.success, 'Should reject number above maximum');
});

runner.test('Number validator enforces integer constraint', () => {
  const validator = Schema.number().integer();
  const validResult = validator.validate(42);
  const invalidResult = validator.validate(42.5);

  assert(validResult.success, 'Should accept integer');
  assert(!invalidResult.success, 'Should reject decimal when integer required');
});

// Boolean Validator Tests
runner.test('Boolean validator accepts valid booleans', () => {
  const validator = Schema.boolean();
  const trueResult = validator.validate(true);
  const falseResult = validator.validate(false);

  assert(trueResult.success, 'Should accept true');
  assert(falseResult.success, 'Should accept false');
  assertEquals(trueResult.data, true, 'Should return true value');
  assertEquals(falseResult.data, false, 'Should return false value');
});

runner.test('Boolean validator rejects non-booleans', () => {
  const validator = Schema.boolean();
  const result = validator.validate('true');
  assert(!result.success, 'Should reject string representation of boolean');
});

// Date Validator Tests
runner.test('Date validator accepts valid dates', () => {
  const validator = Schema.date();
  const date = new Date('2023-01-01');
  const result = validator.validate(date);

  assert(result.success, 'Should accept valid Date object');
  assertEquals(
    result.data.getTime(),
    date.getTime(),
    'Should return the date value'
  );
});

runner.test('Date validator accepts valid date strings', () => {
  const validator = Schema.date();
  const result = validator.validate('2023-01-01');

  assert(result.success, 'Should accept valid date string');
  assert(result.data instanceof Date, 'Should convert to Date object');
});

runner.test('Date validator rejects invalid dates', () => {
  const validator = Schema.date();
  const result = validator.validate('invalid date');
  assert(!result.success, 'Should reject invalid date string');
});

runner.test('Date validator enforces minimum date', () => {
  const minDate = new Date('2023-01-01');
  const validator = Schema.date().min(minDate);
  const validResult = validator.validate(new Date('2023-06-01'));
  const invalidResult = validator.validate(new Date('2022-01-01'));

  assert(validResult.success, 'Should accept date after minimum');
  assert(!invalidResult.success, 'Should reject date before minimum');
});

// Array Validator Tests
runner.test('Array validator accepts valid arrays', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate(['hello', 'world']);

  assert(result.success, 'Should accept valid array');
  assertDeepEquals(
    result.data,
    ['hello', 'world'],
    'Should return the array value'
  );
});

runner.test('Array validator rejects non-arrays', () => {
  const validator = Schema.array(Schema.string());
  const result = validator.validate('not an array');
  assert(!result.success, 'Should reject non-array values');
});

runner.test('Array validator validates array items', () => {
  const validator = Schema.array(Schema.string());
  const validResult = validator.validate(['hello', 'world']);
  const invalidResult = validator.validate(['hello', 123]);

  assert(validResult.success, 'Should accept array with valid items');
  assert(!invalidResult.success, 'Should reject array with invalid items');
});

runner.test('Array validator enforces minimum length', () => {
  const validator = Schema.array(Schema.string()).minLength(2);
  const validResult = validator.validate(['a', 'b']);
  const invalidResult = validator.validate(['a']);

  assert(validResult.success, 'Should accept array meeting minimum length');
  assert(!invalidResult.success, 'Should reject array below minimum length');
});

runner.test('Array validator enforces maximum length', () => {
  const validator = Schema.array(Schema.string()).maxLength(2);
  const validResult = validator.validate(['a', 'b']);
  const invalidResult = validator.validate(['a', 'b', 'c']);

  assert(validResult.success, 'Should accept array within maximum length');
  assert(
    !invalidResult.success,
    'Should reject array exceeding maximum length'
  );
});

// Object Validator Tests
runner.test('Object validator accepts valid objects', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number(),
  });

  const result = validator.validate({
    name: 'John',
    age: 30,
  });

  assert(result.success, 'Should accept valid object');
  assertDeepEquals(
    result.data,
    { name: 'John', age: 30 },
    'Should return the object value'
  );
});

runner.test('Object validator rejects non-objects', () => {
  const validator = Schema.object({
    name: Schema.string(),
  });

  const result = validator.validate('not an object');
  assert(!result.success, 'Should reject non-object values');
});

runner.test('Object validator validates object properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number(),
  });

  const validResult = validator.validate({
    name: 'John',
    age: 30,
  });

  const invalidResult = validator.validate({
    name: 'John',
    age: 'thirty',
  });

  assert(validResult.success, 'Should accept object with valid properties');
  assert(
    !invalidResult.success,
    'Should reject object with invalid properties'
  );
});

runner.test('Object validator handles optional properties', () => {
  const validator = Schema.object({
    name: Schema.string(),
    age: Schema.number().optional(),
  });

  const result = validator.validate({
    name: 'John',
  });

  assert(result.success, 'Should accept object with missing optional property');
});

// Complex Schema Tests
runner.test('Complex nested schema validation', () => {
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/),
  });

  const userSchema = Schema.object({
    id: Schema.string(),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
  });

  const validUser = {
    id: '12345',
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    tags: ['developer', 'designer'],
    address: {
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
    },
  };

  const result = userSchema.validate(validUser);
  assert(result.success, 'Should validate complex nested schema');
});

runner.test('Complex schema validation failure', () => {
  const userSchema = Schema.object({
    name: Schema.string().minLength(2),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  });

  const invalidUser = {
    name: 'J', // Too short
    email: 'invalid-email',
  };

  const result = userSchema.validate(invalidUser);
  assert(!result.success, 'Should fail validation for invalid nested data');
  assert(result.error.path.length > 0, 'Should provide error path information');
});

// Edge Cases
runner.test('Handles null and undefined values correctly', () => {
  const requiredValidator = Schema.string();
  const optionalValidator = Schema.string().optional();

  const nullResult = requiredValidator.validate(null);
  const undefinedResult = requiredValidator.validate(undefined);
  const optionalNullResult = optionalValidator.validate(null);
  const optionalUndefinedResult = optionalValidator.validate(undefined);

  assert(!nullResult.success, 'Required validator should reject null');
  assert(
    !undefinedResult.success,
    'Required validator should reject undefined'
  );
  assert(optionalNullResult.success, 'Optional validator should accept null');
  assert(
    optionalUndefinedResult.success,
    'Optional validator should accept undefined'
  );
});

runner.test('Error messages include path information', () => {
  const schema = Schema.object({
    user: Schema.object({
      name: Schema.string(),
    }),
  });

  const result = schema.validate({
    user: {
      name: 123,
    },
  });

  assert(!result.success, 'Should fail validation');
  assertEquals(
    result.error.path,
    'user.name',
    'Should include full path to error'
  );
});

runner.test('Array validation includes index in error path', () => {
  const schema = Schema.array(Schema.string());
  const result = schema.validate(['valid', 123, 'valid']);

  assert(!result.success, 'Should fail validation');
  assertEquals(
    result.error.path,
    '[1]',
    'Should include array index in error path'
  );
});

// Performance Tests
runner.test('Performance test with large dataset', () => {
  const schema = Schema.array(
    Schema.object({
      id: Schema.number(),
      name: Schema.string(),
      active: Schema.boolean(),
    })
  );

  const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    active: i % 2 === 0,
  }));

  const startTime = Date.now();
  const result = schema.validate(largeDataset);
  const endTime = Date.now();

  assert(result.success, 'Should validate large dataset');
  assert(
    endTime - startTime < 1000,
    'Should complete validation in reasonable time'
  );
});

// Run all tests
runner.run();

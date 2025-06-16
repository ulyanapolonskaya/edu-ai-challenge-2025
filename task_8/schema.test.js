/**
 * Comprehensive test suite for the validation library
 * Tests all validator types with valid and invalid data scenarios
 */

const { Schema, ValidationResult, Validator } = require('./schema.js');

describe('ValidationResult', () => {
  test('should create successful validation result', () => {
    const result = new ValidationResult(true, [], 'test value');
    expect(result.isValid()).toBe(true);
    expect(result.getErrors()).toEqual([]);
    expect(result.getValue()).toBe('test value');
  });

  test('should create failed validation result', () => {
    const result = new ValidationResult(false, ['Error message'], null);
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toEqual(['Error message']);
    expect(result.getValue()).toBe(null);
  });
});

describe('StringValidator', () => {
  test('should validate valid strings', () => {
    const validator = Schema.string();
    const result = validator.validate('hello world');
    expect(result.isValid()).toBe(true);
    expect(result.getValue()).toBe('hello world');
  });

  test('should reject non-string values', () => {
    const validator = Schema.string();
    const result = validator.validate(123);
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be a string');
  });

  test('should validate minimum length', () => {
    const validator = Schema.string().minLength(5);
    expect(validator.validate('hello').isValid()).toBe(true);

    const shortResult = validator.validate('hi');
    expect(shortResult.isValid()).toBe(false);
    expect(shortResult.getErrors()).toContain(
      'String must be at least 5 characters long'
    );
  });

  test('should validate pattern', () => {
    const validator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(validator.validate('test@example.com').isValid()).toBe(true);

    const invalidResult = validator.validate('invalid-email');
    expect(invalidResult.isValid()).toBe(false);
    expect(invalidResult.getErrors()).toContain(
      'String does not match the required pattern'
    );
  });

  test('should handle optional strings', () => {
    const validator = Schema.string().optional();
    expect(validator.validate(null).isValid()).toBe(true);
    expect(validator.validate(undefined).isValid()).toBe(true);
  });
});

describe('NumberValidator', () => {
  test('should validate valid numbers', () => {
    const validator = Schema.number();
    expect(validator.validate(42).isValid()).toBe(true);
    expect(validator.validate(-3.14).isValid()).toBe(true);
  });

  test('should reject non-number values', () => {
    const validator = Schema.number();
    const result = validator.validate('123');
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be a number');
  });

  test('should validate minimum value', () => {
    const validator = Schema.number().min(10);
    expect(validator.validate(15).isValid()).toBe(true);

    const result = validator.validate(5);
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be at least 10');
  });

  test('should validate integers only', () => {
    const validator = Schema.number().integer();
    expect(validator.validate(5).isValid()).toBe(true);

    const result = validator.validate(3.14);
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be an integer');
  });
});

describe('BooleanValidator', () => {
  test('should validate boolean values', () => {
    const validator = Schema.boolean();
    expect(validator.validate(true).isValid()).toBe(true);
    expect(validator.validate(false).isValid()).toBe(true);
  });

  test('should reject non-boolean values', () => {
    const validator = Schema.boolean();
    const result = validator.validate('true');
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be a boolean');
  });
});

describe('ArrayValidator', () => {
  test('should validate arrays with valid items', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate(['hello', 'world']);
    expect(result.isValid()).toBe(true);
    expect(result.getValue()).toEqual(['hello', 'world']);
  });

  test('should reject non-arrays', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate('not array');
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be an array');
  });

  test('should validate array items', () => {
    const validator = Schema.array(Schema.string());
    const result = validator.validate(['a', 123, 'c']);
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain(
      'Item at index 1: Value must be a string'
    );
  });
});

describe('ObjectValidator', () => {
  test('should validate valid objects', () => {
    const validator = Schema.object({
      name: Schema.string(),
      age: Schema.number(),
    });

    const result = validator.validate({ name: 'John', age: 30 });
    expect(result.isValid()).toBe(true);
    expect(result.getValue()).toEqual({ name: 'John', age: 30 });
  });

  test('should reject non-objects', () => {
    const validator = Schema.object({ name: Schema.string() });
    const result = validator.validate('not object');
    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain('Value must be an object');
  });

  test('should validate object properties', () => {
    const validator = Schema.object({
      name: Schema.string().minLength(2),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    });

    const result = validator.validate({
      name: 'J',
      email: 'invalid-email',
    });

    expect(result.isValid()).toBe(false);
    expect(result.getErrors()).toContain(
      "Property 'name': String must be at least 2 characters long"
    );
    expect(result.getErrors()).toContain(
      "Property 'email': String does not match the required pattern"
    );
  });
});

describe('Complex Schema Integration', () => {
  test('should validate user schema from example', () => {
    const userSchema = Schema.object({
      id: Schema.string(),
      name: Schema.string().minLength(2).maxLength(50),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      age: Schema.number().optional(),
      isActive: Schema.boolean(),
      tags: Schema.array(Schema.string()),
      address: Schema.object({
        street: Schema.string(),
        city: Schema.string(),
        postalCode: Schema.string().pattern(/^\d{5}$/),
        country: Schema.string(),
      }).optional(),
    });

    const userData = {
      id: '12345',
      name: 'John Doe',
      email: 'john@example.com',
      isActive: true,
      tags: ['developer', 'designer'],
      address: {
        street: '123 Main St',
        city: 'Anytown',
        postalCode: '12345',
        country: 'USA',
      },
    };

    const result = userSchema.validate(userData);
    expect(result.isValid()).toBe(true);
  });
});

describe('DateValidator', () => {
  const validator = Schema.date();

  test('should validate valid dates', () => {
    const testCases = [
      new Date(),
      '2023-01-01',
      '2023-12-31T23:59:59Z',
      1640995200000, // Unix timestamp
    ];

    testCases.forEach((value) => {
      const result = validator.validate(value);
      expect(result.isValid()).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Date);
    });
  });

  test('should reject invalid dates', () => {
    const testCases = ['invalid-date', 'not-a-date', 'xyz', ''];
    testCases.forEach((value) => {
      const result = validator.validate(value);
      expect(result.isValid()).toBe(false);
      expect(result.getErrors()).toContain('Value must be a valid date');
    });
  });

  test('should validate date ranges', () => {
    const minDate = new Date('2023-01-01');
    const maxDate = new Date('2023-12-31');
    const validator = Schema.date().min(minDate).max(maxDate);

    expect(validator.validate('2023-06-15').isValid()).toBe(true);
    expect(validator.validate('2022-12-31').isValid()).toBe(false);
    expect(validator.validate('2024-01-01').isValid()).toBe(false);
  });
});

describe('Edge Cases and Error Handling', () => {
  test('should handle circular references gracefully', () => {
    const obj = { name: 'test' };
    obj.self = obj; // circular reference

    const validator = Schema.object({
      name: Schema.string(),
      self: Schema.object({}).optional(),
    });

    // Should not throw an error, but may not validate the circular part correctly
    expect(() => validator.validate(obj)).not.toThrow();
  });

  test('should handle very large arrays', () => {
    const largeArray = Array(1000).fill('test');
    const validator = Schema.array(Schema.string());

    const result = validator.validate(largeArray);
    expect(result.isValid()).toBe(true);
  });

  test('should handle deeply nested objects', () => {
    const deepObject = {
      level1: {
        level2: {
          level3: {
            value: 'deep',
          },
        },
      },
    };

    const validator = Schema.object({
      level1: Schema.object({
        level2: Schema.object({
          level3: Schema.object({
            value: Schema.string(),
          }),
        }),
      }),
    });

    const result = validator.validate(deepObject);
    expect(result.isValid()).toBe(true);
  });
});

describe('Performance Tests', () => {
  test('should validate large datasets efficiently', () => {
    const schema = Schema.object({
      id: Schema.number(),
      name: Schema.string().minLength(1).maxLength(100),
      email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    });

    const largeDataset = Array(100)
      .fill()
      .map((_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
      }));

    const start = Date.now();
    largeDataset.forEach((item) => {
      const result = schema.validate(item);
      expect(result.isValid()).toBe(true);
    });
    const end = Date.now();

    // Should complete within reasonable time (less than 1 second for 100 items)
    expect(end - start).toBeLessThan(1000);
  });
});

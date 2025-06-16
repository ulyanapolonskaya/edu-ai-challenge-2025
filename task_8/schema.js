/**
 * Robust Validation Library for JavaScript
 * Provides type-safe validation for primitive and complex data structures
 */

/**
 * Base validator class that all validators extend
 */
class Validator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
  }

  /**
   * Mark this validator as optional
   * @returns {Validator} The validator instance for chaining
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Set a custom error message for this validator
   * @param {string} message - Custom error message
   * @returns {Validator} The validator instance for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Validate a value against this validator
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  validate(value) {
    throw new Error('validate method must be implemented by subclasses');
  }

  /**
   * Create a validation error result
   * @param {string} message - Error message
   * @param {string} path - Path to the invalid field
   * @returns {ValidationResult} Error result
   */
  createError(message, path = '') {
    return {
      success: false,
      error: {
        message: this.customMessage || message,
        path: path,
        value: undefined,
      },
    };
  }

  /**
   * Create a successful validation result
   * @param {any} value - Validated value
   * @returns {ValidationResult} Success result
   */
  createSuccess(value) {
    return {
      success: true,
      data: value,
    };
  }
}

/**
 * String validator with chainable validation methods
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternValue = null;
  }

  /**
   * Set minimum length requirement
   * @param {number} length - Minimum length
   * @returns {StringValidator} The validator instance for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Set maximum length requirement
   * @param {number} length - Maximum length
   * @returns {StringValidator} The validator instance for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Set pattern requirement
   * @param {RegExp} pattern - Regular expression pattern
   * @returns {StringValidator} The validator instance for chaining
   */
  pattern(pattern) {
    this.patternValue = pattern;
    return this;
  }

  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('String is required', path);
    }

    // Check if value is a string
    if (typeof value !== 'string') {
      return this.createError('Expected string, got ' + typeof value, path);
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this.createError(
        `String must be at least ${this.minLengthValue} characters long`,
        path
      );
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this.createError(
        `String must be at most ${this.maxLengthValue} characters long`,
        path
      );
    }

    // Check pattern
    if (this.patternValue !== null && !this.patternValue.test(value)) {
      return this.createError('String does not match required pattern', path);
    }

    return this.createSuccess(value);
  }
}

/**
 * Number validator with chainable validation methods
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
  }

  /**
   * Set minimum value requirement
   * @param {number} value - Minimum value
   * @returns {NumberValidator} The validator instance for chaining
   */
  min(value) {
    this.minValue = value;
    return this;
  }

  /**
   * Set maximum value requirement
   * @param {number} value - Maximum value
   * @returns {NumberValidator} The validator instance for chaining
   */
  max(value) {
    this.maxValue = value;
    return this;
  }

  /**
   * Require integer values only
   * @returns {NumberValidator} The validator instance for chaining
   */
  integer() {
    this.integerOnly = true;
    return this;
  }

  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Number is required', path);
    }

    // Check if value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      return this.createError('Expected number, got ' + typeof value, path);
    }

    // Check if integer is required
    if (this.integerOnly && !Number.isInteger(value)) {
      return this.createError('Expected integer, got decimal', path);
    }

    // Check minimum value
    if (this.minValue !== null && value < this.minValue) {
      return this.createError(`Number must be at least ${this.minValue}`, path);
    }

    // Check maximum value
    if (this.maxValue !== null && value > this.maxValue) {
      return this.createError(`Number must be at most ${this.maxValue}`, path);
    }

    return this.createSuccess(value);
  }
}

/**
 * Boolean validator
 */
class BooleanValidator extends Validator {
  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Boolean is required', path);
    }

    // Check if value is a boolean
    if (typeof value !== 'boolean') {
      return this.createError('Expected boolean, got ' + typeof value, path);
    }

    return this.createSuccess(value);
  }
}

/**
 * Date validator
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Set minimum date requirement
   * @param {Date} date - Minimum date
   * @returns {DateValidator} The validator instance for chaining
   */
  min(date) {
    this.minDate = date;
    return this;
  }

  /**
   * Set maximum date requirement
   * @param {Date} date - Maximum date
   * @returns {DateValidator} The validator instance for chaining
   */
  max(date) {
    this.maxDate = date;
    return this;
  }

  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Date is required', path);
    }

    // Convert to Date if it's a string
    let dateValue = value;
    if (typeof value === 'string') {
      dateValue = new Date(value);
    }

    // Check if value is a valid date
    if (!(dateValue instanceof Date) || isNaN(dateValue.getTime())) {
      return this.createError('Expected valid date', path);
    }

    // Check minimum date
    if (this.minDate !== null && dateValue < this.minDate) {
      return this.createError(
        `Date must be after ${this.minDate.toISOString()}`,
        path
      );
    }

    // Check maximum date
    if (this.maxDate !== null && dateValue > this.maxDate) {
      return this.createError(
        `Date must be before ${this.maxDate.toISOString()}`,
        path
      );
    }

    return this.createSuccess(dateValue);
  }
}

/**
 * Array validator for validating arrays of specific types
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Set minimum array length requirement
   * @param {number} length - Minimum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Set maximum array length requirement
   * @param {number} length - Maximum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Array is required', path);
    }

    // Check if value is an array
    if (!Array.isArray(value)) {
      return this.createError('Expected array, got ' + typeof value, path);
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      return this.createError(
        `Array must have at least ${this.minLengthValue} items`,
        path
      );
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      return this.createError(
        `Array must have at most ${this.maxLengthValue} items`,
        path
      );
    }

    // Validate each item in the array
    const validatedItems = [];
    for (let i = 0; i < value.length; i++) {
      const itemPath = path ? `${path}[${i}]` : `[${i}]`;
      const result = this.itemValidator.validate(value[i], itemPath);

      if (!result.success) {
        return result;
      }

      validatedItems.push(result.data);
    }

    return this.createSuccess(validatedItems);
  }
}

/**
 * Object validator for validating objects with specific schemas
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
  }

  validate(value, path = '') {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Object is required', path);
    }

    // Check if value is an object
    if (typeof value !== 'object' || Array.isArray(value)) {
      return this.createError(
        'Expected object, got ' +
          (Array.isArray(value) ? 'array' : typeof value),
        path
      );
    }

    const validatedObject = {};
    const errors = [];

    // Validate each field in the schema
    for (const [key, validator] of Object.entries(this.schema)) {
      const fieldPath = path ? `${path}.${key}` : key;
      const result = validator.validate(value[key], fieldPath);

      if (!result.success) {
        errors.push(result.error);
      } else {
        validatedObject[key] = result.data;
      }
    }

    // Return first error if any validation failed
    if (errors.length > 0) {
      return {
        success: false,
        error: errors[0], // Return the first error for simplicity
      };
    }

    return this.createSuccess(validatedObject);
  }
}

// Schema Builder
class Schema {
  /**
   * Create a string validator
   * @returns {StringValidator} String validator instance
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Create a number validator
   * @returns {NumberValidator} Number validator instance
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Create a boolean validator
   * @returns {BooleanValidator} Boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Create a date validator
   * @returns {DateValidator} Date validator instance
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Create an object validator
   * @param {Object} schema - Schema definition object
   * @returns {ObjectValidator} Object validator instance
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Create an array validator
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} Array validator instance
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

// Export for Node.js modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Schema,
    Validator,
    StringValidator,
    NumberValidator,
    BooleanValidator,
    DateValidator,
    ArrayValidator,
    ObjectValidator,
  };
}

// Example usage and testing
if (typeof require === 'undefined' || require.main === module) {
  // Define a complex schema
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string()
      .pattern(/^\d{5}$/)
      .withMessage('Postal code must be 5 digits'),
    country: Schema.string(),
  });

  const userSchema = Schema.object({
    id: Schema.string().withMessage('ID must be a string'),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional(),
  });

  // Test data
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

  // Validate data
  const result = userSchema.validate(userData);

  if (result.success) {
    console.log('✅ Validation successful!');
    console.log('Validated data:', JSON.stringify(result.data, null, 2));
  } else {
    console.log('❌ Validation failed!');
    console.log('Error:', result.error.message);
    console.log('Path:', result.error.path);
  }
}

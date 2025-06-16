/**
 * Robust Validation Library for JavaScript
 * Provides type-safe validation for primitive and complex data types
 *
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Validation result interface
 */
class ValidationResult {
  constructor(success, errors = [], value = null) {
    this.success = success;
    this.errors = errors;
    this.value = value;
  }

  /**
   * Checks if validation was successful
   * @returns {boolean} True if validation passed
   */
  isValid() {
    return this.success;
  }

  /**
   * Gets all validation errors
   * @returns {string[]} Array of error messages
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Gets the validated value
   * @returns {any} The validated value
   */
  getValue() {
    return this.value;
  }
}

/**
 * Base validator class
 * All specific validators extend from this class
 */
class Validator {
  constructor() {
    this.isOptional = false;
    this.customMessage = null;
  }

  /**
   * Makes the field optional
   * @returns {Validator} The validator instance for chaining
   */
  optional() {
    this.isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message
   * @param {string} message - Custom error message
   * @returns {Validator} The validator instance for chaining
   */
  withMessage(message) {
    this.customMessage = message;
    return this;
  }

  /**
   * Validates the input value
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  validate(value) {
    // Handle optional values
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return new ValidationResult(true, [], value);
      } else {
        return new ValidationResult(
          false,
          [this.customMessage || 'Value is required'],
          value
        );
      }
    }

    return this._validate(value);
  }

  /**
   * Internal validation method to be implemented by subclasses
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    throw new Error('_validate method must be implemented by subclasses');
  }
}

/**
 * String validator class
 * Validates string values with various constraints
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this.minLengthValue = null;
    this.maxLengthValue = null;
    this.patternValue = null;
  }

  /**
   * Sets minimum length constraint
   * @param {number} length - Minimum length
   * @returns {StringValidator} The validator instance for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum length constraint
   * @param {number} length - Maximum length
   * @returns {StringValidator} The validator instance for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Sets pattern constraint
   * @param {RegExp} pattern - Regular expression pattern
   * @returns {StringValidator} The validator instance for chaining
   */
  pattern(pattern) {
    this.patternValue = pattern;
    return this;
  }

  /**
   * Internal validation for string values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    const errors = [];

    // Check if value is a string
    if (typeof value !== 'string') {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be a string'],
        value
      );
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(
        `String must be at least ${this.minLengthValue} characters long`
      );
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(
        `String must be at most ${this.maxLengthValue} characters long`
      );
    }

    // Check pattern
    if (this.patternValue && !this.patternValue.test(value)) {
      errors.push(
        this.customMessage || 'String does not match the required pattern'
      );
    }

    return new ValidationResult(errors.length === 0, errors, value);
  }
}

/**
 * Number validator class
 * Validates numeric values with various constraints
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
  }

  /**
   * Sets minimum value constraint
   * @param {number} min - Minimum value
   * @returns {NumberValidator} The validator instance for chaining
   */
  min(min) {
    this.minValue = min;
    return this;
  }

  /**
   * Sets maximum value constraint
   * @param {number} max - Maximum value
   * @returns {NumberValidator} The validator instance for chaining
   */
  max(max) {
    this.maxValue = max;
    return this;
  }

  /**
   * Restricts validation to integers only
   * @returns {NumberValidator} The validator instance for chaining
   */
  integer() {
    this.integerOnly = true;
    return this;
  }

  /**
   * Internal validation for numeric values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    const errors = [];

    // Check if value is a number
    if (typeof value !== 'number' || isNaN(value)) {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be a number'],
        value
      );
    }

    // Check if integer is required
    if (this.integerOnly && !Number.isInteger(value)) {
      errors.push('Value must be an integer');
    }

    // Check minimum value
    if (this.minValue !== null && value < this.minValue) {
      errors.push(`Value must be at least ${this.minValue}`);
    }

    // Check maximum value
    if (this.maxValue !== null && value > this.maxValue) {
      errors.push(`Value must be at most ${this.maxValue}`);
    }

    return new ValidationResult(errors.length === 0, errors, value);
  }
}

/**
 * Boolean validator class
 * Validates boolean values
 */
class BooleanValidator extends Validator {
  /**
   * Internal validation for boolean values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    if (typeof value !== 'boolean') {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be a boolean'],
        value
      );
    }

    return new ValidationResult(true, [], value);
  }
}

/**
 * Date validator class
 * Validates date values
 */
class DateValidator extends Validator {
  constructor() {
    super();
    this.minDate = null;
    this.maxDate = null;
  }

  /**
   * Sets minimum date constraint
   * @param {Date} date - Minimum date
   * @returns {DateValidator} The validator instance for chaining
   */
  min(date) {
    this.minDate = date;
    return this;
  }

  /**
   * Sets maximum date constraint
   * @param {Date} date - Maximum date
   * @returns {DateValidator} The validator instance for chaining
   */
  max(date) {
    this.maxDate = date;
    return this;
  }

  /**
   * Internal validation for date values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    const errors = [];

    // Check if value is a valid date
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be a valid date'],
        value
      );
    }

    // Check minimum date
    if (this.minDate && date < this.minDate) {
      errors.push(`Date must be after ${this.minDate.toISOString()}`);
    }

    // Check maximum date
    if (this.maxDate && date > this.maxDate) {
      errors.push(`Date must be before ${this.maxDate.toISOString()}`);
    }

    return new ValidationResult(errors.length === 0, errors, date);
  }
}

/**
 * Array validator class
 * Validates array values and their items
 */
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this.itemValidator = itemValidator;
    this.minLengthValue = null;
    this.maxLengthValue = null;
  }

  /**
   * Sets minimum length constraint
   * @param {number} length - Minimum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  minLength(length) {
    this.minLengthValue = length;
    return this;
  }

  /**
   * Sets maximum length constraint
   * @param {number} length - Maximum length
   * @returns {ArrayValidator} The validator instance for chaining
   */
  maxLength(length) {
    this.maxLengthValue = length;
    return this;
  }

  /**
   * Internal validation for array values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    const errors = [];

    // Check if value is an array
    if (!Array.isArray(value)) {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be an array'],
        value
      );
    }

    // Check minimum length
    if (this.minLengthValue !== null && value.length < this.minLengthValue) {
      errors.push(`Array must have at least ${this.minLengthValue} items`);
    }

    // Check maximum length
    if (this.maxLengthValue !== null && value.length > this.maxLengthValue) {
      errors.push(`Array must have at most ${this.maxLengthValue} items`);
    }

    // Validate each item in the array
    const validatedItems = [];
    for (let i = 0; i < value.length; i++) {
      const itemResult = this.itemValidator.validate(value[i]);
      if (!itemResult.isValid()) {
        errors.push(`Item at index ${i}: ${itemResult.getErrors().join(', ')}`);
      } else {
        validatedItems.push(itemResult.getValue());
      }
    }

    return new ValidationResult(errors.length === 0, errors, validatedItems);
  }
}

/**
 * Object validator class
 * Validates object values and their properties
 */
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this.schema = schema;
  }

  /**
   * Internal validation for object values
   * @param {any} value - Value to validate
   * @returns {ValidationResult} Validation result
   */
  _validate(value) {
    const errors = [];

    // Check if value is an object
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return new ValidationResult(
        false,
        [this.customMessage || 'Value must be an object'],
        value
      );
    }

    const validatedObject = {};

    // Validate each property in the schema
    for (const [key, validator] of Object.entries(this.schema)) {
      const propertyResult = validator.validate(value[key]);
      if (!propertyResult.isValid()) {
        errors.push(
          `Property '${key}': ${propertyResult.getErrors().join(', ')}`
        );
      } else {
        validatedObject[key] = propertyResult.getValue();
      }
    }

    return new ValidationResult(errors.length === 0, errors, validatedObject);
  }
}

/**
 * Schema Builder - Main entry point for creating validators
 * Provides static methods to create various types of validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} String validator instance
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Creates a number validator
   * @returns {NumberValidator} Number validator instance
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} Boolean validator instance
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Creates a date validator
   * @returns {DateValidator} Date validator instance
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Creates an object validator with the provided schema
   * @param {Object} schema - Object schema defining property validators
   * @returns {ObjectValidator} Object validator instance
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Creates an array validator with the provided item validator
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} Array validator instance
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

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

// Validate data
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

// Display validation results
console.log('Validation Result:');
console.log('Is Valid:', result.isValid());
if (!result.isValid()) {
  console.log('Errors:', result.getErrors());
} else {
  console.log('Validated Data:', JSON.stringify(result.getValue(), null, 2));
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Schema, ValidationResult, Validator };
}

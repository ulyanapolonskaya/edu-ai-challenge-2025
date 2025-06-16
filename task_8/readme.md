# Robust Validation Library for JavaScript

A powerful, flexible, and type-safe validation library for JavaScript that provides comprehensive validation for primitive and complex data types.

## 🚀 Features

- **Type-safe validation** for strings, numbers, booleans, dates, arrays, and objects
- **Chainable API** for building complex validation rules
- **Comprehensive error reporting** with detailed error messages
- **Optional field support** with null/undefined handling
- **Pattern matching** with regular expressions
- **Nested object validation** with deep property validation
- **Array validation** with item-level validation
- **Custom error messages** for personalized validation feedback
- **High performance** with efficient validation algorithms

## 📦 Installation

1. **Clone or download** the validation library files
2. **Install dependencies** (for development and testing):
   ```bash
   npm install
   ```

## 🏃‍♂️ Quick Start

> **💡 Tip:**

1. Open folder with task `cd task_8`
2. Run `node example.js` to see all these examples in action!

### Basic Usage

```javascript
const { Schema } = require('./schema.js');

// Create validators
const nameValidator = Schema.string().minLength(2).maxLength(50);
const ageValidator = Schema.number().min(0).max(150);
const emailValidator = Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

// Validate data
const nameResult = nameValidator.validate('John Doe');
console.log(nameResult.isValid()); // true
console.log(nameResult.getValue()); // 'John Doe'

const invalidEmailResult = emailValidator.validate('invalid-email');
console.log(invalidEmailResult.isValid()); // false
console.log(invalidEmailResult.getErrors()); // ['String does not match the required pattern']
```

### Complex Object Validation

```javascript
// Define a user schema
const userSchema = Schema.object({
  id: Schema.string(),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(0).max(150).optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^\d{5}$/),
    country: Schema.string(),
  }).optional(),
});

// Validate user data
const userData = {
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
    country: 'USA',
  },
};

const result = userSchema.validate(userData);
if (result.isValid()) {
  console.log('User data is valid!');
  console.log('Validated data:', result.getValue());
} else {
  console.log('Validation errors:', result.getErrors());
}
```

## 📚 API Reference

### Schema Class

The main entry point for creating validators.

#### Static Methods

- `Schema.string()` - Creates a string validator
- `Schema.number()` - Creates a number validator
- `Schema.boolean()` - Creates a boolean validator
- `Schema.date()` - Creates a date validator
- `Schema.array(itemValidator)` - Creates an array validator
- `Schema.object(schema)` - Creates an object validator

### String Validator

Validates string values with various constraints.

```javascript
const validator = Schema.string()
  .minLength(2) // Minimum length
  .maxLength(100) // Maximum length
  .pattern(/^[A-Za-z]+$/) // RegExp pattern
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

**Methods:**

- `.minLength(length)` - Sets minimum string length
- `.maxLength(length)` - Sets maximum string length
- `.pattern(regex)` - Sets RegExp pattern requirement
- `.optional()` - Makes field optional (allows null/undefined)
- `.withMessage(message)` - Sets custom error message

### Number Validator

Validates numeric values with range and type constraints.

```javascript
const validator = Schema.number()
  .min(0) // Minimum value
  .max(100) // Maximum value
  .integer() // Must be integer
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

**Methods:**

- `.min(value)` - Sets minimum value
- `.max(value)` - Sets maximum value
- `.integer()` - Restricts to integers only
- `.optional()` - Makes field optional
- `.withMessage(message)` - Sets custom error message

### Boolean Validator

Validates boolean values.

```javascript
const validator = Schema.boolean()
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

### Date Validator

Validates date values with range constraints.

```javascript
const validator = Schema.date()
  .min(new Date('2023-01-01')) // Minimum date
  .max(new Date('2023-12-31')) // Maximum date
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

**Methods:**

- `.min(date)` - Sets minimum date
- `.max(date)` - Sets maximum date
- `.optional()` - Makes field optional
- `.withMessage(message)` - Sets custom error message

### Array Validator

Validates arrays and their items.

```javascript
const validator = Schema.array(Schema.string())
  .minLength(1) // Minimum array length
  .maxLength(10) // Maximum array length
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

**Methods:**

- `.minLength(length)` - Sets minimum array length
- `.maxLength(length)` - Sets maximum array length
- `.optional()` - Makes field optional
- `.withMessage(message)` - Sets custom error message

### Object Validator

Validates objects and their properties.

```javascript
const validator = Schema.object({
  name: Schema.string(),
  age: Schema.number().optional(),
})
  .optional() // Allow null/undefined
  .withMessage('Custom error message');
```

### ValidationResult

Returned by all validation operations.

**Methods:**

- `.isValid()` - Returns boolean indicating validation success
- `.getErrors()` - Returns array of error messages
- `.getValue()` - Returns the validated/transformed value

## 🛠️ Advanced Usage

### Custom Error Messages

```javascript
const schema = Schema.object({
  email: Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage('Please enter a valid email address'),

  age: Schema.number().min(18).withMessage('You must be at least 18 years old'),
});
```

### Nested Object Validation

```javascript
const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string().pattern(/^\d{5}$/),
});

const userSchema = Schema.object({
  name: Schema.string(),
  address: addressSchema,
  alternateAddress: addressSchema.optional(),
});
```

### Array of Objects

```javascript
const contactSchema = Schema.object({
  type: Schema.string().pattern(/^(email|phone)$/),
  value: Schema.string(),
});

const personSchema = Schema.object({
  name: Schema.string(),
  contacts: Schema.array(contactSchema).minLength(1),
});
```

### Complex Validation Example

```javascript
const productSchema = Schema.object({
  id: Schema.string().pattern(/^PROD-\d{4}$/),
  name: Schema.string().minLength(1).maxLength(100),
  price: Schema.number().min(0.01),
  categories: Schema.array(Schema.string()).minLength(1).maxLength(5),
  specifications: Schema.object({
    weight: Schema.number().min(0).optional(),
    dimensions: Schema.object({
      length: Schema.number().min(0),
      width: Schema.number().min(0),
      height: Schema.number().min(0),
    }).optional(),
    colors: Schema.array(Schema.string()).optional(),
  }),
  inStock: Schema.boolean(),
  releaseDate: Schema.date().min(new Date('2020-01-01')),
});
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

The library includes comprehensive test coverage:

- All validator types (string, number, boolean, date, array, object)
- Valid and invalid data scenarios
- Edge cases and error handling
- Performance tests
- Complex schema integration tests

Current test coverage: **~90% statements, ~85% branches**

### Example Test Usage

```javascript
const { Schema } = require('./schema.js');

// Test your schemas
const schema = Schema.string().minLength(5);
const result = schema.validate('hello');

console.assert(result.isValid() === true, 'Should validate valid string');
console.assert(result.getValue() === 'hello', 'Should return original value');
```

## 🔧 Development

### Project Structure

```
task_8/
├── schema.js           # Main validation library
├── schema.test.js      # Comprehensive test suite
├── package.json        # Dependencies and scripts
├── test_report.txt     # Test coverage report
├── readme.md          # This guide
└── .gitignore         # Git ignore file
```

### Extending the Library

You can extend the library by creating custom validators:

```javascript
class CustomValidator extends Validator {
  constructor() {
    super();
    // Initialize custom properties
  }

  _validate(value) {
    // Implement custom validation logic
    const errors = [];

    // Add validation checks
    if (/* some condition */) {
      errors.push('Custom validation error');
    }

    return new ValidationResult(errors.length === 0, errors, value);
  }
}

// Add to Schema class
Schema.custom = function() {
  return new CustomValidator();
};
```

### Best Practices

1. **Chain validations** for readable code
2. **Use optional()** for nullable fields
3. **Provide custom error messages** for better UX
4. **Validate early** in your application flow
5. **Handle ValidationResult** properly in your code
6. **Test your schemas** thoroughly

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 🐛 Issues and Support

For issues, bugs, or feature requests, please create an issue in the project repository.

## 📈 Performance

The library is optimized for performance:

- Efficient validation algorithms
- Minimal memory footprint
- Fast execution for large datasets
- Lazy evaluation where possible

Benchmark: Validates 1000 complex objects in < 100ms on modern hardware.

## 🔍 Examples and Resources

- **`example.js`** - Simple usage examples with step-by-step demonstrations
- **`schema.js`** - Complete validation library with inline documentation
- **`schema.test.js`** - Comprehensive test cases showing all features
- **`readme.md`** - This complete user guide

**Quick Start:** Run `node example.js` to see live validation examples!

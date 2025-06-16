# Robust Validation Library for JavaScript

A powerful, type-safe validation library for JavaScript that provides chainable validators for primitive and complex data structures.

## 🚀 Features

- **Type-safe validation** for strings, numbers, booleans, dates, arrays, and objects
- **Chainable API** for building complex validation rules
- **Custom error messages** with detailed error paths
- **Optional field support** for flexible schemas
- **Nested schema validation** for complex data structures
- **Performance optimized** for large datasets
- **Zero dependencies** - pure JavaScript implementation
- **Browser and Node.js compatible**

## 📦 Installation

Simply include the `schema.js` file in your project:

```javascript
// For Node.js
const { Schema } = require('./schema.js');

// For browsers
<script src="schema.js"></script>;
// Schema is available globally
```

## 🎯 Quick Start

```javascript
// Simple validation
const nameValidator = Schema.string().minLength(2).maxLength(50);
const result = nameValidator.validate('John Doe');

if (result.success) {
  console.log('Valid name:', result.data);
} else {
  console.log('Validation error:', result.error.message);
}
```

## 📚 API Reference

### String Validator

```javascript
const validator = Schema.string()
  .minLength(2) // Minimum length
  .maxLength(100) // Maximum length
  .pattern(/^[a-zA-Z]+$/) // Regex pattern
  .optional() // Make optional
  .withMessage('Custom error message');

// Usage
const result = validator.validate('Hello World');
```

**Methods:**

- `minLength(number)` - Set minimum length requirement
- `maxLength(number)` - Set maximum length requirement
- `pattern(RegExp)` - Set regex pattern requirement
- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

### Number Validator

```javascript
const validator = Schema.number()
  .min(0) // Minimum value
  .max(100) // Maximum value
  .integer() // Require integer
  .optional();

// Usage
const result = validator.validate(42);
```

**Methods:**

- `min(number)` - Set minimum value
- `max(number)` - Set maximum value
- `integer()` - Require integer values only
- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

### Boolean Validator

```javascript
const validator = Schema.boolean().optional();

// Usage
const result = validator.validate(true);
```

**Methods:**

- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

### Date Validator

```javascript
const validator = Schema.date()
  .min(new Date('2020-01-01')) // Minimum date
  .max(new Date('2025-12-31')) // Maximum date
  .optional();

// Usage
const result = validator.validate(new Date());
// Also accepts date strings
const result2 = validator.validate('2023-06-15');
```

**Methods:**

- `min(Date)` - Set minimum date
- `max(Date)` - Set maximum date
- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

### Array Validator

```javascript
const validator = Schema.array(Schema.string())
  .minLength(1) // Minimum array length
  .maxLength(10) // Maximum array length
  .optional();

// Usage
const result = validator.validate(['apple', 'banana', 'orange']);
```

**Methods:**

- `minLength(number)` - Set minimum array length
- `maxLength(number)` - Set maximum array length
- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

### Object Validator

```javascript
const userSchema = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(0).optional(),
  isActive: Schema.boolean(),
});

// Usage
const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
});
```

**Methods:**

- `optional()` - Mark field as optional
- `withMessage(string)` - Set custom error message

## 🏗️ Complex Examples

### User Registration Schema

```javascript
const registrationSchema = Schema.object({
  username: Schema.string()
    .minLength(3)
    .maxLength(20)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .withMessage(
      'Username must be 3-20 characters and contain only letters, numbers, and underscores'
    ),

  email: Schema.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .withMessage('Please enter a valid email address'),

  password: Schema.string()
    .minLength(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must be at least 8 characters with uppercase, lowercase, and number'
    ),

  age: Schema.number()
    .min(13)
    .max(120)
    .integer()
    .withMessage('Age must be between 13 and 120'),

  acceptTerms: Schema.boolean().withMessage(
    'You must accept the terms and conditions'
  ),
});

// Validate user input
const userData = {
  username: 'johndoe123',
  email: 'john@example.com',
  password: 'SecurePass123',
  age: 25,
  acceptTerms: true,
};

const result = registrationSchema.validate(userData);
```

### E-commerce Product Schema

```javascript
const productSchema = Schema.object({
  id: Schema.string().pattern(/^[A-Z]{2}\d{6}$/),
  name: Schema.string().minLength(1).maxLength(100),
  description: Schema.string().optional(),
  price: Schema.number().min(0),
  category: Schema.string(),
  tags: Schema.array(Schema.string()).maxLength(10),
  inStock: Schema.boolean(),
  variants: Schema.array(
    Schema.object({
      size: Schema.string(),
      color: Schema.string(),
      quantity: Schema.number().min(0).integer(),
    })
  ).optional(),
  metadata: Schema.object({
    weight: Schema.number().min(0).optional(),
    dimensions: Schema.object({
      width: Schema.number().min(0),
      height: Schema.number().min(0),
      depth: Schema.number().min(0),
    }).optional(),
  }).optional(),
});
```

### API Response Schema

```javascript
const apiResponseSchema = Schema.object({
  success: Schema.boolean(),
  message: Schema.string().optional(),
  data: Schema.array(
    Schema.object({
      id: Schema.number().integer(),
      name: Schema.string(),
      createdAt: Schema.date(),
      updatedAt: Schema.date().optional(),
    })
  ).optional(),
  pagination: Schema.object({
    page: Schema.number().integer().min(1),
    limit: Schema.number().integer().min(1).max(100),
    total: Schema.number().integer().min(0),
  }).optional(),
  errors: Schema.array(Schema.string()).optional(),
});
```

## 🔧 Error Handling

The validation library provides detailed error information:

```javascript
const result = schema.validate(data);

if (!result.success) {
  console.log('Validation failed!');
  console.log('Error message:', result.error.message);
  console.log('Error path:', result.error.path);

  // For nested objects, path shows the location
  // Example: "user.address.postalCode"
  // For arrays: "items[2].name"
}
```

### Error Response Format

```javascript
{
  success: false,
  error: {
    message: "String must be at least 2 characters long",
    path: "user.name",
    value: undefined
  }
}
```

### Success Response Format

```javascript
{
  success: true,
  data: validatedData // The validated and potentially transformed data
}
```

## 🎨 Custom Validation

You can extend the library by creating custom validators:

```javascript
class EmailValidator extends Validator {
  validate(value, path = '') {
    if (value === undefined || value === null) {
      if (this.isOptional) {
        return this.createSuccess(value);
      }
      return this.createError('Email is required', path);
    }

    if (typeof value !== 'string') {
      return this.createError('Email must be a string', path);
    }

    // Custom email validation logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return this.createError('Invalid email format', path);
    }

    return this.createSuccess(value.toLowerCase());
  }
}

// Add to Schema class
Schema.email = () => new EmailValidator();
```

## 🚀 Running the Application

### Prerequisites

- Node.js (version 12 or higher)
- No additional dependencies required

### Installation

1. Clone or download the project files
2. Navigate to the project directory

### Running Tests

```bash
# Navigate to the task_8 directory
cd task_8

# Run the test suite
node test.js

# Run the schema with examples
node schema.js
```

### Usage in Your Project

```javascript
// Import the library
const { Schema } = require('./schema.js');

// Create your validation schemas
const mySchema = Schema.object({
  name: Schema.string().minLength(2),
  age: Schema.number().min(0).optional(),
});

// Validate your data
const result = mySchema.validate(yourData);

if (result.success) {
  // Use the validated data
  console.log('Validated data:', result.data);
} else {
  // Handle validation errors
  console.error('Validation error:', result.error.message);
}
```

## 📋 Best Practices

1. **Define schemas once, reuse everywhere:**

   ```javascript
   const userSchema = Schema.object({...});
   // Use userSchema throughout your application
   ```

2. **Use descriptive custom error messages:**

   ```javascript
   Schema.string()
     .minLength(8)
     .withMessage('Password must be at least 8 characters long');
   ```

3. **Validate at boundaries:**

   - API request/response validation
   - User input validation
   - Database model validation

4. **Handle optional fields properly:**

   ```javascript
   Schema.string().optional(); // Accepts undefined/null
   ```

5. **Use type-specific validators:**

   ```javascript
   // Good
   Schema.number().integer().min(0);

   // Instead of just
   Schema.number();
   ```

## 🔍 Troubleshooting

### Common Issues

1. **"validate method must be implemented" error:**

   - Ensure you're using the correct validator type
   - Check that all validator classes are properly imported

2. **Validation always fails:**

   - Check data types match validator expectations
   - Verify constraint values (min/max, lengths, patterns)

3. **Custom error messages not showing:**
   - Ensure `withMessage()` is called before `validate()`
   - Check that custom message is set on the right validator

### Debug Tips

```javascript
// Add logging to see what's being validated
const result = schema.validate(data);
console.log('Validation result:', JSON.stringify(result, null, 2));

// Check the exact error path
if (!result.success) {
  console.log('Error at path:', result.error.path);
}
```

## 📄 License

This validation library is provided as-is for educational and commercial use. No warranty is implied.

## 🤝 Contributing

Feel free to extend and modify the library according to your needs. The code is designed to be readable and maintainable.

---

**Happy Validating! 🎉**

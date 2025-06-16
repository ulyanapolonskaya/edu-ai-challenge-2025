/**
 * Simple Usage Examples for the Validation Library
 * This file demonstrates how to use the validation library in real-world scenarios
 */

const { Schema } = require('./schema.js');

console.log('🚀 Validation Library - Simple Usage Examples\n');

// =============================================================================
// Example 1: Basic String Validation
// =============================================================================
console.log('📝 Example 1: Basic String Validation');
console.log('=====================================');

const nameValidator = Schema.string().minLength(2).maxLength(50);

// Valid name
const validName = nameValidator.validate('John Doe');
console.log(
  '✅ Valid name:',
  validName.isValid(),
  '- Value:',
  validName.getValue()
);

// Invalid name (too short)
const invalidName = nameValidator.validate('J');
console.log(
  '❌ Invalid name:',
  invalidName.isValid(),
  '- Errors:',
  invalidName.getErrors()
);

console.log();

// =============================================================================
// Example 2: Email Validation with Custom Message
// =============================================================================
console.log('📧 Example 2: Email Validation');
console.log('===============================');

const emailValidator = Schema.string()
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .withMessage('Please enter a valid email address');

// Valid email
const validEmail = emailValidator.validate('user@example.com');
console.log('✅ Valid email:', validEmail.isValid());

// Invalid email
const invalidEmail = emailValidator.validate('not-an-email');
console.log(
  '❌ Invalid email:',
  invalidEmail.isValid(),
  '- Error:',
  invalidEmail.getErrors()[0]
);

console.log();

// =============================================================================
// Example 3: Number Validation with Range
// =============================================================================
console.log('🔢 Example 3: Age Validation');
console.log('=============================');

const ageValidator = Schema.number().min(0).max(120).integer();

// Valid age
const validAge = ageValidator.validate(25);
console.log(
  '✅ Valid age:',
  validAge.isValid(),
  '- Value:',
  validAge.getValue()
);

// Invalid age (negative)
const invalidAge = ageValidator.validate(-5);
console.log(
  '❌ Invalid age:',
  invalidAge.isValid(),
  '- Errors:',
  invalidAge.getErrors()
);

console.log();

// =============================================================================
// Example 4: Array Validation
// =============================================================================
console.log('📋 Example 4: Tags Array Validation');
console.log('====================================');

const tagsValidator = Schema.array(Schema.string()).minLength(1).maxLength(5);

// Valid tags
const validTags = tagsValidator.validate([
  'javascript',
  'nodejs',
  'validation',
]);
console.log(
  '✅ Valid tags:',
  validTags.isValid(),
  '- Count:',
  validTags.getValue().length
);

// Invalid tags (empty array)
const invalidTags = tagsValidator.validate([]);
console.log(
  '❌ Invalid tags:',
  invalidTags.isValid(),
  '- Error:',
  invalidTags.getErrors()[0]
);

console.log();

// =============================================================================
// Example 5: Object Validation - User Profile
// =============================================================================
console.log('👤 Example 5: User Profile Validation');
console.log('======================================');

const userProfileSchema = Schema.object({
  username: Schema.string().minLength(3).maxLength(20),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().min(13).max(120).optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()).maxLength(5),
});

// Valid user profile
const validUser = {
  username: 'johndoe123',
  email: 'john@example.com',
  age: 25,
  isActive: true,
  tags: ['developer', 'javascript'],
};

const userResult = userProfileSchema.validate(validUser);
console.log('✅ Valid user profile:', userResult.isValid());
if (userResult.isValid()) {
  console.log('   User data:', JSON.stringify(userResult.getValue(), null, 2));
}

// Invalid user profile
const invalidUser = {
  username: 'jo', // too short
  email: 'invalid-email', // invalid format
  age: -5, // negative age
  isActive: 'yes', // not boolean
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6'], // too many tags
};

const invalidUserResult = userProfileSchema.validate(invalidUser);
console.log('\n❌ Invalid user profile:', invalidUserResult.isValid());
console.log('   Errors:');
invalidUserResult.getErrors().forEach((error) => console.log('   -', error));

console.log();

// =============================================================================
// Example 6: Nested Object Validation - Address
// =============================================================================
console.log('🏠 Example 6: Nested Object Validation');
console.log('=======================================');

const addressSchema = Schema.object({
  street: Schema.string().minLength(1),
  city: Schema.string().minLength(1),
  postalCode: Schema.string().pattern(/^\d{5}$/),
  country: Schema.string().minLength(2),
});

const userWithAddressSchema = Schema.object({
  name: Schema.string().minLength(2),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  address: addressSchema,
  billingAddress: addressSchema.optional(),
});

// Valid user with address
const userWithAddress = {
  name: 'Alice Smith',
  email: 'alice@example.com',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    postalCode: '12345',
    country: 'USA',
  },
};

const addressResult = userWithAddressSchema.validate(userWithAddress);
console.log('✅ Valid user with address:', addressResult.isValid());

// Invalid address (bad postal code)
const userWithBadAddress = {
  name: 'Bob Johnson',
  email: 'bob@example.com',
  address: {
    street: '456 Oak Ave',
    city: 'Springfield',
    postalCode: '1234', // invalid - should be 5 digits
    country: 'USA',
  },
};

const badAddressResult = userWithAddressSchema.validate(userWithBadAddress);
console.log('❌ Invalid address:', badAddressResult.isValid());
console.log('   Error:', badAddressResult.getErrors()[0]);

console.log();

// =============================================================================
// Example 7: Optional Fields
// =============================================================================
console.log('❓ Example 7: Optional Fields');
console.log('=============================');

const profileSchema = Schema.object({
  name: Schema.string().minLength(1), // required
  bio: Schema.string().maxLength(500).optional(), // optional
  website: Schema.string()
    .pattern(/^https?:\/\/.+/)
    .optional(), // optional with pattern
});

// Profile without optional fields
const minimalProfile = { name: 'John' };
const minimalResult = profileSchema.validate(minimalProfile);
console.log(
  '✅ Minimal profile (no optional fields):',
  minimalResult.isValid()
);

// Profile with optional fields
const fullProfile = {
  name: 'Jane',
  bio: 'Software developer passionate about clean code',
  website: 'https://jane-dev.com',
};
const fullResult = profileSchema.validate(fullProfile);
console.log('✅ Full profile (with optional fields):', fullResult.isValid());

console.log();

// =============================================================================
// Example 8: Error Handling Best Practices
// =============================================================================
console.log('🛠️  Example 8: Error Handling Best Practices');
console.log('=============================================');

function validateAndProcess(data, schema, description) {
  console.log(`\n🔍 Validating ${description}...`);

  const result = schema.validate(data);

  if (result.isValid()) {
    console.log('✅ Validation passed!');
    console.log(
      '📋 Processing data:',
      JSON.stringify(result.getValue(), null, 2)
    );
    return result.getValue();
  } else {
    console.log('❌ Validation failed!');
    console.log('📋 Errors found:');
    result.getErrors().forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
    return null;
  }
}

// Test the error handling function
const testSchema = Schema.object({
  id: Schema.number().min(1),
  name: Schema.string().minLength(2),
  status: Schema.string().pattern(/^(active|inactive)$/),
});

// Valid data
validateAndProcess(
  { id: 1, name: 'Test Item', status: 'active' },
  testSchema,
  'valid item'
);

// Invalid data
validateAndProcess(
  { id: -1, name: 'T', status: 'unknown' },
  testSchema,
  'invalid item'
);

console.log(
  '\n🎉 Examples completed! Check the readme.md for more detailed documentation.'
);

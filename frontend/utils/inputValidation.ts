// SQL Injection Prevention 
export const escapeSQLInput = (input: string): string => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove common SQL injection patterns
  return input
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/\\/g, "\\\\")  // Escape backslashes
    .replace(/\u0000/g, "\\0")  // Remove null bytes
    .replace(/"/g, '""')  // Escape double quotes
    .replace(/;/g, '')  // Remove semicolons
    .replace(/--/g, '')  // Remove double-dashes
    .replace(/\/\*/g, '')  // Remove opening comments
    .replace(/\*\//g, '')  // Remove closing comments
    .replace(/xp_/gi, '')  // Remove potential stored procedure calls
    .replace(/exec\s+/gi, '')  // Remove potential execute statements
    .replace(/UNION\s+ALL\s+SELECT/gi, '')  // Remove UNION-based injections
    .replace(/SELECT\s+.*\s+FROM/gi, '')  // Remove SELECT-based injections
    .trim();  // Trim whitespace
};

// Enhanced sanitizeInput function
export const sanitizeInput = (input: string): string => {
  // Remove any HTML tags and apply SQL injection prevention
  return escapeSQLInput(input.replace(/<[^>]*>?/gm, '').trim());
};

// Enhanced sanitizeEmail function
export const sanitizeEmail = (email: string): string => {
  // Lower case, trim whitespace, and apply SQL injection prevention
  return escapeSQLInput(email.toLowerCase().trim());
};

// Enhanced sanitizePhone function
export const sanitizePhone = (phone: string): string => {
  // Remove any non-digit characters and apply SQL injection prevention
  return escapeSQLInput(phone.replace(/\D/g, ''));
};

// Regular expressions for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const nameRegex = /^[a-zA-Z\s'-]+$/;
const phoneRegex = /^\+?[0-9]{10,14}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,50}$/;
const postalCodeRegex = /^[0-9]{5}(?:-[0-9]{4})?$/;

// Validation functions
export const isValidEmail = (email: string): boolean => emailRegex.test(email);
export const isValidName = (name: string): boolean => nameRegex.test(name);
export const isValidPhone = (phone: string): boolean => phoneRegex.test(phone);
export const isValidPassword = (password: string): boolean => passwordRegex.test(password);
export const isValidPostalCode = (postalCode: string): boolean => postalCodeRegex.test(postalCode);

// Validation error messages
export const getValidationErrorMessage = (field: string): string => {
  switch (field) {
    case 'email':
      return 'Please enter a valid email address.';
    case 'name':
    case 'lastName':
      return 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only).';
    case 'phone':
      return 'Please enter a valid phone number.';
    case 'password':
      return 'Password must be 8-50 characters long and include at least one letter, one number, and one special character.';
    case 'postalCode':
      return 'Please enter a valid postal code.';
    default:
      return 'Invalid input.';
  }
};
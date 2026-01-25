// ================================
// VARIABLES IN JAVASCRIPT
// ================================

// Difference between var, let, and const

// var:
// - Old way of declaring variables
// - Can be re-declared and updated
// - Has function scope
var name = "Rahul";
var name = "Amit"; // allowed

// let:
// - Modern way of declaring variables
// - Cannot be re-declared, but can be updated
// - Has block scope
let age = 20;
age = 21; // allowed

// const:
// - Used for constant values
// - Cannot be re-declared or updated
const country = "India";

// ================================
// DATA TYPES
// ================================

// Primitive Data Types
let numberValue = 10;           // Number
let stringValue = "Hello";     // String
let booleanValue = true;       // Boolean
let undefinedValue;            // Undefined
let nullValue = null;          // Null
let symbolValue = Symbol("id");// Symbol

// Non-Primitive Data Types
let objectValue = { name: "John", age: 25 }; // Object
let arrayValue = [1, 2, 3, 4];               // Array
let functionValue = function() {
  return "I am a function";
};

// ================================
// CHECK TYPE USING typeof
// ================================

console.log(typeof numberValue);     // number
console.log(typeof stringValue);     // string
console.log(typeof booleanValue);    // boolean
console.log(typeof undefinedValue);  // undefined
console.log(typeof nullValue);       // object (JavaScript bug)
console.log(typeof objectValue);     // object
console.log(typeof arrayValue);      // object
console.log(typeof functionValue);   // function

// ================================
// DIFFERENCE BETWEEN null AND undefined
// ================================

// undefined:
// - Variable is declared but value is not assigned
let x;
console.log(x); // undefined

// null:
// - Value is intentionally set to empty
let y = null;
console.log(y); // null
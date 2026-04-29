let a = 10
let balance = new Number(10000000000)
console.log(balance,typeof(balance))

console.log(balance.toString())
console.log(balance.toFixed(2)) //when Precision value is too long.
console.log(balance.toString().length)
console.log(balance.toLocaleString())
console.log(balance.toLocaleString('en-In'))

//maths
console.log(Math)
console.log(Math.abs(-0),Math.abs(-4)) 
console.log(Math.round(4.6))
console.log(Math.ceil(4.6))// top 
console.log(Math.floor(4.6)) // lowest
console.log(Math.min(36,43,29))
console.log(Math.max(39,59,70))

//Activity Math.random
console.log(Math.random())//Returns a pseudorandom number between 0 and 1.
console.log(Math.random().toExponential())//Returns a string containing a number represented in exponential notation.
console.log(Math.random().toFixed(3))//Returns a string representing a number in fixed-point notation.

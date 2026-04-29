// 1.Diff Arrow fun and simple
console.log("Activity 1:")
document.writeln("<h3>Activity 1:</h3>")
function greet(name) {
    console.log(name)
    document.writeln(`${name}<br>`)
}
greet("Atharv !!")

const greet1 = (name) => {
    console.log(name)
    document.writeln(`${name}`)
}
greet1("DKTE !!")

// 2.What is use of this in arrow and simple
console.log("Activity 2:")
document.writeln("<h3>Activity 2:</h3>")
class Student {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    greet() {
        console.log(`Hi i am ${this.name} !!`)//direct use of this
        document.writeln(`Hi i am ${this.name} !!<br>`)
    }
    showMyAge() {
        const showAge = () => {
            console.log(`I am ${this.age} year's old.`)//uses this of showMyAge
            document.writeln(`I am ${this.age} year's old.<br>`)
        }
        showAge()
    }
}
let stud1 = new Student("Atharv", 20)
stud1.greet()
stud1.showMyAge()
document.writeln("<br>")

let stud2 = new Student("ABC", 18)
stud2.greet()
stud2.showMyAge()
document.writeln("<br>")

console.log("Arrow Function Uses Lexical Scope:" + Student.prototype.showMyAge)
document.writeln(`Arrow Function Uses Lexical Scope:${typeof(Student.prototype.showMyAge)}`)

// 3.why we not use this key in arrow
//becoz arrow function uses the this from the its parent laxical scope
console.log("Activity 3:")
document.writeln("<h3>Activity 3:</h3>")
class car {
    constructor(car) {
        this.car = car
    }

    getCarName = () => {
        console.log(`${this.car}`)
        document.writeln(`<h4>${this.car}</h4>`)
    }
    
}
const car1 = new car("Mercedes")
const car2 = new car("BMW")
console.log("Arrow Function:" + car.prototype.getCarName)//not exist
document.writeln(`Arrow Function:${car.prototype.getCarName}`)

// Write code for arrow fun with 3 examples
console.log("Activity 4:")
document.writeln("<h3>Activity 4:</h3>")
const getName = (name) => {
    console.log(`Hello ${name}`)
    document.writeln(`Hello ${name}<br>`)
}
getName("LESP !!")

const getArray = (arr1) => {
    console.log(arr1)
    document.writeln(`Array:${arr1}`)
}
getArray([1, 2, 4, 5, 6, 7, 8])

const addTwo = (n1, n2) => {
    console.log(`${n1} + ${n2} = ${n1 + n2}`)
    document.writeln(`<br>Addition of ${n1} + ${n2} = ${n1+n2}`)
}
addTwo(5, 5)

// write code for Switch case in js
console.log("Activity 5:")
document.writeln("<h3>Activity 5:</h3>")
let day = 1
switch (day) {
    case 0:
        console.log("Sunday")
        document.writeln("Sunday")
        break
    case 1:
        console.log("Monday")
        document.writeln("Monday")
        break
    case 2:
        console.log("Tuesday")
        document.writeln("Tuesday")
        break
    case 3:
        console.log("Wednesday")
        document.writeln("Wednesday")
        break
    case 4:
        console.log("Thursday")
        document.writeln("Thursday")
        break
    case 5:
        console.log("Friday")
        document.writeln("Friday")
        break
    case 6:
        console.log("Saturday")
        document.writeln("Saturday")
        break

    default:
        console.log("Invalid Choice")
        document.writeln("Invalid Choice")

}
// How use truthty and falsey value with examples
console.log("Activity 6:")
document.writeln("<h3>Activity 6:</h3>")
let arrayOfTruthyFalsy = [false, 0, "", null, undefined, NaN, true, "0", [], {}, " ", -1]
arrayOfTruthyFalsy.forEach(val => {
    console.log(val,"is",Boolean(val) ? "Truthy Value." : "Falsy Value.")
    document.writeln(`<b>${val}</b> is ${Boolean(val)? "Truthy Value." : "Falsy Value."}<br>`)
})

// ternary in js
console.log("Activity 7:")
document.writeln("<h3>Activity 7:</h3>")
let age = 17
console.log(`Person is ${age > 18 ? "Eligible for Voting." : "Not Eligible for voting."}`)
document.writeln(`Person with ${age} age is ${age > 18 ? "Eligible for Voting." : "Not Eligible for voting."}`)

// Write a code for how to use loops in array for all
console.log("Activity 8:")
document.writeln("<h3>Activity 8:</h3>")
let array = [12, 3, 46, 74, 23, 86, 24]
console.log("Array using for loop:")
document.writeln("Array using for loop:")

for (let i = 0; i < array.length; i++) {
    console.log(array[i])
    document.writeln(`${array[i]}`)
}
document.writeln("<br>")

console.log("Array using While loop:")
document.writeln("Array using While loop:")

let start = 0
while (start !== array.length) {
    console.log(array[start])
    document.writeln(`${array[start]}`)
    start++
}
document.writeln("<br>")

console.log("Array using Do While loop:")
document.writeln("Array using Do While loop:")
let end = array.length - 1
do {
    console.log(array[end])
    document.writeln(`${array[end]}`)
    end--
} while (end != -1)
document.writeln("<br>")

console.log("Array using for in loop:")
document.writeln("Array using for in loop:")
for (let idx in array) {
    console.log(array[idx])
    document.writeln(`${array[idx]}`)
}
document.writeln("<br>")

console.log("Array using for of loop:")
document.writeln("Array using for of loop:")
for (let ele of array) {
    console.log(ele)
    document.writeln(`${ele}`)
}
document.writeln("<br>")

console.log("Array using forEach loop:")
document.writeln("Array using forEach loop:")
array.forEach(e => {
    console.log(e)
    document.writeln(`${e}`)
})

// diff btn for of and for in with example
console.log("Activity 9:")
document.writeln("<h3>Activity 9:</h3>")
// for in loop works on index and for of directly iterate over element in array.
let newArray = [10, 20, 30, 40, 50]
console.log("For in VS For of.")
document.writeln("For in VS For of.")
document.writeln("<br>")

console.log("For in gives Index to traverse:")
document.writeln("<br>For in gives Index to traverse:<br>")

for (let index in newArray) {
    console.log(`Element ${newArray[index]} at ${index} index.`) //gives index here 
    document.writeln(`Element ${newArray[index]} at ${index} index.<br>`)
}
document.writeln("<br>")

console.log("For of gives element to traverse:")
document.writeln("For of gives element to traverse:<br>")
for (let element of newArray) {
    console.log(`Element:${element}`)//direct element is accisible 
    document.writeln(`Element:${element}<br>`)
}

// Write how to use filter and map example 3 in js
console.log("Activity 10:Write code how to use filter and map 3 examples in Java Script.")
document.writeln("<h3>Activity 10:Write code how to use filter and map 3 examples in Java Script.</h3>")

let numberArray = [21, 53, 23, 85, 90, 22, 20, 34]
let newNumberArray1 = numberArray.map(ele => ele * ele)
console.log(`Squared Array:${newNumberArray1}`)
document.writeln(`Squared Array:${newNumberArray1}`)

console.log("Even numbers from Array:")
document.writeln("<br>Even numbers from Array:")
numberArray.filter(ele => ele % 2 == 0).forEach(ele => { 
    console.log(ele)
    document.writeln(`${ele}`)
})
document.writeln("<br>")

console.log("Prices After applying 18% GST:")
document.writeln("<br>Prices After applying 18% GST:<br>")
let prices = [530, 220, 102, 1290, 229, 782, 900]
let finalPrices = prices.filter(ele => ele > 500).map(ele => ele + ele * 0.18).forEach(e => {
    console.log(`${e.toFixed(2)} Rs/.`)
    document.writeln(`${e.toFixed(2)} Rs/.<br>`)
})
document.writeln("<br>")

console.log("Odd Numbers to Even Numbers:")
document.writeln("Odd Numbers to Even Numbers:<br>")
let evenOddArray = [31, 73, 79, 65, 80, 89, 47, 78]
let evenArray = evenOddArray.filter(ele => ele % 2 !== 0).map(ele => ele + 1).forEach(e => {
    console.log(e)
    document.writeln(`${e}<br>`)
})

//1.Object Literals
let myObj = {name:"Atharv",age:"20",location:"Sangli",emailId:"atharv@gmail.com",isLogin:true,lastLoginDay:["Mon","Tues","Wed"]}
console.log(myObj)//Two types of object 1.object literals-singleton not created 2.Constructor-it creates single ton object. it means it self object. 3.Singleton
// console.log(typeof(myObj))//string  - wrap var in subscript []

// symbol example
const mySymbol = Symbol("My Key 1")
const myObj2 = {mySymbol:""}
// console.log(typeof myObj2)
// console.log(typeof myObj2.mySymbol)

myObj.emailId = "sp@gmail.com"
console.log(myObj.emailId)

// Object.freeze(myObj)//Prevents the modification of existing property attributes and values, and prevents the addition of new properties.
myObj.age=30
console.log(myObj.age)

myObj.greeting = function (){
    console.log("Hello Js User !!")
}

console.log(myObj.greeting())
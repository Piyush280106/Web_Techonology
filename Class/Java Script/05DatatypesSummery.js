//symobl - example
const anotherId = Symbol("123")
console.log(anotherId)
console.log(typeof (anotherId))

const id = 123
console.log(id === anotherId)

//JS is dynamic typed language.

//array
const cars = ["Merc", "Porche", "Land Rover", "Audi"]
const num = [1, 2, 3, 4, 5]

console.log(cars)
console.log(num)

//objects
const obj = {
    fname: "Atharv",
    age: 20
}
console.log(obj.fname)

//functions
function display() {
    console.log("Hello From Function !!")
}
display()

const myfunc = function() {
    console.log("Other Function !!")
}   
myfunc()

//memory 
// 1.Stack - used for primitive datatypes. 
// 2.Heap - non-primitive datatypes.

//Ex
let myNewYtChannel = "AAN"
let newYtChannel = myNewYtChannel
console.log(myNewYtChannel,newYtChannel)

newYtChannel = "Atharv"
console.log(myNewYtChannel,newYtChannel) //primitive datatypes are used for stack memory when we assign one variable to another copy is made so changing one cannot affect the another.

let user1 = {
    fname:"Atharv",
    age:20,
    id:7 
}

let user2 = user1
user2.id = 25
console.log(user1.id,user2.id) // non primitive datatypes and objects are stored in heap memory when we assign one object to another variable refernce is copied not the value if we change one both will change.
//array
let myArr = [0,1,2,3,4,5]
console.log(`My Array values ${myArr}`)

console.log(`Type of ${typeof(myArr)}`)

const arr = new Array(0,1,2,3)
console.log(arr[1])

//array methods
arr.push(5) // add value at last in array
console.log(arr) 

arr.pop() // delete last value from array
console.log(arr)

arr.unshift(9) // it shift all elements and added at first position
console.log(arr)

arr.shift()
console.log(arr) // removes first element

console.log(arr.includes(1)) //it checks if element present in an array

console.log(arr.indexOf(2))  //Returns the index of the first occurrence of a value in an array, or -1 if it is not present.

//Activity1:splice and slice use in array
let fruits = ["Apple","Mango","Banana","Orange"]
console.log(fruits.splice(1,2)) //Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements. and Omitting this argument will remove all elements from the start paramater location to end of the array.

let cars = ["Tata","Mahindra","MG","Toyota","Nissan"]
console.log(cars.slice(0,3)) //Returns a copy of a section of an array. For both start and end.

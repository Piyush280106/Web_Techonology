const superHeros = ["Spidarman","Ironman","Batman","Thor"]
const heros = ["Antman","Captain America"]

superHeros.push(heros)
console.log(superHeros)

console.log(superHeros[4])
console.log(superHeros[4][1])

const newArray = superHeros.concat("BMW","MERC") //Concatination of array
console.log(newArray)

const anotherArray = [1,2,3,[4,5,6],7,[6,7,[4,5]]]
console.log(anotherArray)

const anotherArray1 = anotherArray.flat(Infinity) //breaking subarray into single array * how deep a nested array should be flatend default value is 1 infinity-flattend all levels no matters how deep 
console.log(anotherArray1) // flat doesnot change original array it returns new array. useful when nested data.

const anotherArray2 = anotherArray.flat(1)
console.log(anotherArray2)

//data scripting using this method
console.log(Array.isArray("Atharv")) //check given value is array or not
console.log(Array.isArray(anotherArray))

console.log(Array.from("Atharv")) //converts an itetable object like string,set,map into array.

console.log(Array.from({name:"Atharv"}))
console.log(Object.keys({name:"Atharv"}))
console.log(Object.values({name:"Atharv"}))
console.log(Object.entries({name:"Atharv"}))

let score1 = 100
let score2 = 200
let score3 = 300
console.log(Array.of(score1,score2,score3)) //create new array from new values no matters how many.

//Array.of() converts value
let b = Array.of("A","B","C")
console.log(b)
//Array.from() converts itratable
let b1 = "Atharv"
console.log(Array.from(b1))

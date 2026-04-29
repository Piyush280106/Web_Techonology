let str1 = "Atharv"
console.log(str1)
console.log(typeof(str1))

//string interpolation
console.log(`Hello My Name is ${str1} !!`)

let fname = "Rob"
console.log(`${fname}`)

const newName = new String("Atharv")

console.log(newName.length)
console.log(newName.toUpperCase())
console.log(newName.toLowerCase())
console.log(newName.charAt(2))
console.log(newName.indexOf('a'))

//Activity2:Try string functions 
let msg = "Hello World"
console.log(msg.at(0)) //Returns value at index
console.log(msg.charAt(3))//Returns the character at the specified index.
console.log(msg.concat(" Good Day !!"))//Returns a string that contains the concatenation of two or more strings.
console.log(msg.startsWith("Hel"))//Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object
console.log(msg.endsWith("rld"))//Returns true if the sequence of elements of searchString converted to a String is the same as the corresponding elements of this object.
console.log(msg.replace("World","Atharv"))//Replaces text in a string, using a regular expression or search string.
console.log(msg.search("Ath"))//Finds the first substring match in a regular expression search.

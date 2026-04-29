//DOM - Document Object Module is bridge btn js and HTML
// when browser load an HTML page it converts HTML into an Object that object structure is called DOM. JS uses DOM to read,change,Delete HTML Elements

//DOM Tags

// let header = document.getElementById("title")
// header.innerHTML = "<h1></h1>"

// Activity 2:querySelector,querySelectorAll info and study
console.log(document.querySelector('h2')) //-> Returns one value
let nodeList = document.querySelectorAll('h2')
console.log(nodeList) //-> Give node list of elements 
nodeList.forEach(e => console.log(e)) //printing values from list.

// Activity when and how to use 
// document.getElementById("title").id
// document.getElementById("title").class it is invalid in js.
// document.getElementById("title").className
// document.getElementById("title").setAttribute
// document.getElementById("title").getAttribute

// Working
console.log(`Id for Element = ${document.getElementById("title").id }`) //returns the id for element.
console.log(`Class name for Element = ${document.getElementById("title").className}`) //returns the name of class for element.
document.getElementById("title").setAttribute("newId","New Header Id") //setting new attribute to element.
console.log(document.getElementById("title").getAttribute("newId")) //getting attribute by name.

// Actitivity 3:Create one simple project with javascript and dom.

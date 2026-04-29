let myDate = new Date()
console.log(myDate)
console.log(typeof(myDate))
console.log(myDate.toString())
console.log(myDate.toISOString)
console.log(myDate.toLocaleDateString())
console.log(myDate.toDateString())
console.log(myDate.getDate())
console.log(myDate.getDay())
console.log(myDate.getFullYear())
console.log(myDate.getUTCDate())
console.log(myDate.getTime())

let myTimeStamp = Date.now()
console.log(myTimeStamp)
console.log(myTimeStamp/1000)


//Activity - how to get proper time
let currTime = new Date()
console.log(currTime.toLocaleTimeString()) 
// synchronous js
// code execute line by line.
// each task wait for previous task to finish. locking in the nature. js is syncrouns and single threaded.

console.log("Start")
add = (a,b) => { return a+b }
let result = add(5,5)
console.log("Result:" + result)
console.log("End")

//Asynchoronous in JS => Some tasks take time like API calls , file read , database data retrival and timer. JS does not wait it moves to next line non blocking behaviour.
//Used -> Fetching Data from Server. Reading file. SetTimeout. API's Calls.

console.log("Start")
setTimeout(() => {console.log("Inside Timeout")},2000) // is a aync it waits 2 Seconds meanwhile js print end print inside timeout.
console.log("End")

// Activity Gauess the output game.
// blocking and non bloacking 2 examples.
// real time where use this in which examples.
// api fetch activity fetch()

//
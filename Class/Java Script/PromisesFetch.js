// Promise -> is an object that represent future results of an async operation.
// means i promise to give reslult later.

// promises has three states 1.Pending 2.Resolved/Fulfilled (Success) 3.Reject.

// let myPromise = new Promise((resolve,reject) => { let success = true; success?resolve("Data Fetched"):reject("Data not available")})

// myPromise.then(res => console.log(res)).catch(err => console.log(err))

// //home activity why promises is better than callbacks.

// let myTimePromise = new Promise((resolve,reject) => setTimeout(() => { console.log("Async task completed."); resolve()},3000))
// myTimePromise.then(() => console.log("Promise Consumed !!") )

// let myNewPromise3 = new Promise((res,rej) => setTimeout(() => { res({"username":"Atharv","id":"24UAM310"},2000)}))
// myNewPromise3.then(user => console.log("User Data:" + user))


// fetch method
// is a bulit in JS method used to make HTTP request return promises.

// fetch(url) it return promises 
// fetch("https://jsonplaceholder.typicode.com/users/2")
// .then(data => { return data.json() })
// .then(data => console.log(data))
// .catch(error => console.log(error))

// what is prmoise in js.,staus , diff callback vs promises what is fetch in js ? what it returns ? why do we use response.json() ? diff btn then and catch and async and await ? what is promise chain ?
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// home activity

// home activity 2 -> Create 4 promises example 1.var if true show obj 2.asyanc keyword promises and 2 simple examples
// home activity ->

//1.if variable is true show object.

let data = true
const getObject = new Promise((res,rej) => { data?res({"name":"Atharv","age":20}):rej("Data not available.")})
getObject.then(obj => console.log(obj)).catch(error => console.log(error));

//2.async keyword
const dataReceived = () => {
    return new Promise(res => setTimeout(() => res("Data is Received Successfully !!"),2000))
}

const getData = async() => {
    const response = await dataReceived()
    console.log(response)
}

getData()

//any 2 examples.

const showNumbers = new Promise(res => setTimeout(() => res("Pizza "),2000))
showNumbers.then(e => console.log(e + "Order Delivered !!"))

password=32123
const checkLogin = new Promise((res,rej) => password==32123?res({"Username":"Atharv","token":"kuehdewugfgiewggfew7iyry37yyrudgukgduigghe7ry73ggfi7g77g3"}):rej("User not found !!"))
checkLogin.then(user => console.log(user)).catch(err => console.log(err))

//how to use fetch in async and await
// fetch user display names in html list, fetch posts show only first 5 records , create fake prmoise resolve aftrt 3 sec reject 3 sec
//Code is in file -> userNames.html
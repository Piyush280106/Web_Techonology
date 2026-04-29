//Singleton Object
const user = new Object()
console.log(user)
const user1 = {} //non singleton object
user1.id = 1234
user1.name = "Atharv"
user1.isLogin = true
console.log(user1)

//object inside the object
const regularUser = {email:"abc@gmail.com",username:{fullname:{fname:"Atharv",sname:"Niprul"}}}//object inside obj
console.log(regularUser);
console.log(regularUser.username.fullname);

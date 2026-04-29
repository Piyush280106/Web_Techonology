// const a = 3 
// a = 7 //error not allowed to reassign to const variable.
// console.log(a)

let b = 100;
b = 50; // value is changed
var c = 200;
c = 100; //value is changed
console.log("Value of b declared as let:" + b);
document.writeln("<h3>Value of b declared as let:" + b + "</h3>");
console.log("Value of c declared as var:" + c);
document.writeln("<h3>Value of c declared as var:" + c + "</h3><br>");

// var x = 10;
// var y = 20;
{
  var x = 100;
  var y = 200;
  console.log(x, y);
}
console.log(x, y);


// activity 1
// display student info let studentName, Number studenRoll, String studentEmail

console.log("Activity 1:")
document.writeln("<h2>Activity 1:</h2>")
let studentName = "Atharv";
let studenRoll = "24UAM310";
let studentEmail = "atharvniprul74@gmail.com";

console.log("Name = ", studentName);
console.log("Roll Number = ", studenRoll);
console.log("Email Address = ", studentEmail);

document.writeln("<h3>" + "Name = " + studentName + "</h3>");
document.writeln("<h3>" + "Roll Number = " + studenRoll + "</h3>");
document.writeln("<h3>" + "Email Address = " + studentEmail + "</h3>");

// activity 2
//check is number is even or odd
console.log("Activity 2:")
document.writeln("<br><h2>Activity 2:</h2>")
let num = 17;
if (num % 2 == 0) {
    console.log("Even number.");
    document.writeln("<h3>" + `${num} is even number.` + "</h3>")
}
else {
    console.log("Odd number.");
    document.writeln("<h3>" + `${num} is odd number.` + "</h3>")
}


// activity 3
// check student pass or fail
console.log("Activity 3:")
document.writeln("<br><h2>Activity 3:</h2>")
let oop = 98;
let dbms = 91;
let dsa = 85;
let grade = (oop + dbms + dsa) / 3;
console.log(grade.toPrecision(4)+ "%");
document.writeln("<h3>" + `Marks = ${grade.toPrecision(4)}%` + "</h3>")
if (grade >= 40) {
    console.log("Pass");
    document.writeln("<h3>Grade:Pass</h3>")
}
else {
    console.log("Fail");
    document.writeln("<h3>Grade:Fail</h3>")
}

// activity 4
// print display number 1 - 10
console.log("Activity 4:")
document.writeln("<br><h2>Activity 4:</h2>")
for (let i = 1; i <= 20; i++) {
    document.writeln("<h3>" + i + "</h3>");
    console.log(i);
}

// activity 5
console.log("Activity 5:")
document.writeln("<br><h2>Activity 5:</h2>")
let num1 = 10;
num2 = num1;
num1 = 2001;
console.log(num1, num2);
document.writeln("<h3>"+`${num1}`+","+`${num2}`+"</h3>")
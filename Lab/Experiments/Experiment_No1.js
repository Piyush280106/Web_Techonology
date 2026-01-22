// Activity 1: Variable Declaration Constant
document.write("<h3>Activity 01 Constant</h3>");
const accountId = 1001;
//accountId = 2001;
document.write("Account id="+accountId+"<br><br>");


// ACTIVITY 2: DIFFERENCE between let AND var
document.write("<h3>Activity 02 Let and Var</h3>");

let a = 10;
var b = 20;
{
    let a = 100;
    var b = 200;
    document.write("Inside Of Block<br>");
    document.write("a="+a+"<br>");
    document.write("b="+b+"<br>");
}
document.write("Outside of Block<br>");
document.write("a="+a+"<br>");
document.write("b="+b+"<br><br>");


// ACTIVITY 3: Data Types and type
document.write("<h3>Activity 03 Datatype and Type</h3>");

let id=92;
let acc_Name="Piyush";
let IsActive=true;
let begint=BigInt(1234563734846866442857);
//let undefined;
let value=null;
let symbol=Symbol(id);

document.write("Id="+id+"<br>");
document.write("Name="+acc_Name+"<br>");
document.write("Status="+IsActive+"<br>");
document.write("BigInt="+begint+"<br>");
document.write("Undefined="+undefined+"<br>");
document.write("Null="+value+"<br>");
document.write(symbol.toString()+"<br><br>");

document.write("Type="+typeof(id) +"<br>");
document.write("Type="+typeof(IsActive) +"<br>");
document.write("Type="+typeof(acc_Name) +"<br>");
document.write("Type="+typeof(begint) +"<br>");
document.write("Type="+typeof(undefined) +"<br>");
document.write("Type="+typeof(value) +"<br>");
document.write("Type="+typeof(symbol) +"<br><br>");


// ACTIVITY 4: STUDENT INFORMATION
document.write("<h3>Activity 04 Student Info</h3>");

let Roll_no = 92;
let Student_Name = "Piyush";
let mail = "pvpatil@gmal.com";
let isPass = true;
let mob_no = 7249084308;

document.write("Roll No: " + Roll_no + "<br>");
document.write("Name: " + Student_Name + "<br>");
document.write("Email: " + mail + "<br>");
document.write("Pass: " + isPass + "<br>");
document.write("Mobile No: " + mob_no + "<br><br>");


// ACTIVITY 5: ODD OR EVEN USING IF-ELSE
document.write("<h3>Activity 05 Even Odd</h3>");

let no = 105;
if (no % 2 == 0) {
    document.write(no + "is Even<br><br>");
} else {
    document.write(no + "is Odd<br><br>");
}


// ACTIVITY 6: STUDENT PASS OR FAIL
document.write("<h3>Activity 06 Pass Fail</h3>");

let marks = 90;
if (marks > 40) {
    document.write("Pass<br><br>");
} else {
    document.write("Fail<br><br>");
}


// ACTIVITY 7: PRINT NUMBERS USING LOOP
document.write("<h3>Activity 07 (10 to 20)</h3>");

for (let i = 10; i <= 20; i++) {
    document.write(i + "<br>");
}
document.write("<br>");


// ACTIVITY 8: Variable assignment
document.write("<h3>Activity 08</h3>");

let x = 100;
y = x;
document.write(x + " " + y + "<br>");
x = 500;
document.write(x + " " + y + "<br>");

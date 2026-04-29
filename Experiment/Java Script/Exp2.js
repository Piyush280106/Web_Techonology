// 1. create one array, function and object
console.log("Activity 1");
document.writeln("<h2>Activity 1:Create one array, function and object.</h2>")

let cars = ["Mercedes", "Porche", "Tata", "MG"];
console.log(cars);
document.writeln(`Cars:${cars}<br>`)

function greet(name) {
    console.log(`Hello ${name} !! How are youu !`);
    document.writeln(`Hello ${name} !! How are youu ! <br>`)
}
greet("Atharv");

let student = {
    name: "Atharv",
    age: 20,
    branch: "CSE AI/ML",
    CGPA: 8.9
};
console.log(student);
document.writeln(`Student = ${student}`)

// 2. Reverse number
console.log("Activity 2");
document.writeln("<h2>Activity 2:Reverse a Number.</h2>")

let number = 1234;
let reverse = 0;
let tempNum = number;

while (tempNum > 0) {
    let digit = tempNum % 10;
    reverse = reverse * 10 + digit;
    tempNum = Math.floor(tempNum / 10);
}
console.log(`Reversed Number = ${reverse}`);
document.writeln(`Reversed Number = ${reverse}<br>`)

// 3. Palindrome number
console.log("Activity 3");
document.writeln("<h2>Activity 3:Palindrome number.</h2>")

let num = 121;
let temp = num;
let rev = 0;

while (temp > 0) {
    let dig = temp % 10;
    rev = rev * 10 + dig;
    temp = Math.floor(temp / 10);
}
console.log(`${num} is ${num === rev ? "Palindrome number." : "Not Palindrome number."}`);
document.writeln(`${num} is ${num === rev ? "Palindrome number." : "Not Palindrome number."}<br>`)

// 4. Fibonacci series
console.log("Activity 4");
document.writeln("<h2>Activity 4:Fibonacci Series.</h2>")

let fibo_num = 5;
let fib = [0, 1];

for (let i = 2; i < fibo_num; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
}
console.log(`Fibonacci Series for ${fibo_num} = ${fib}`);
document.writeln(`Fibonacci Series for ${fibo_num} = ${fib}<br>`)

// 5. Find largest element in array
console.log("Activity 5");
document.writeln("<h2>Activity 5:Largest element in array.</h2>")

let array = [20, 46, 93, 95, 49, 60];
let max = array[0];

for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
        max = array[i];
    }
}
console.log(`Largest Element in Array: ${max}`);
document.writeln(`Largest Element in Array: ${max}<br>`)

// 6. Remove duplicate elements in array
console.log("Activity 6");
document.writeln("<h2>Activity 6:Remove duplicate elements in array.</h2>")

let originalArray = [10, 20, 20, 30, 40, 50, 50];
let newArray = [];

originalArray.forEach(element => {
    if (!newArray.includes(element)) {
        newArray.push(element);
    }
});
console.log(`Original Array: ${originalArray}`);
document.writeln(`Original Array: ${originalArray}<br>`)
console.log(`Array After Removing Duplicates: ${newArray}`);
document.writeln(`Array After Removing Duplicates: ${newArray}<br>`)

// 7. Find missing number in array
console.log("Activity 7");
document.writeln("<h2>Activity 7:Find missing number in array.</h2>")

const arr = [1, 2, 4, 5, 6];
const n = arr.length + 1;
const sumOfN = (n * (n + 1)) / 2;

let count = 0;
for (let i = 0; i < arr.length; i++) {
    count += arr[i];
}
console.log(`Missing Number = ${sumOfN - count}`);
document.writeln(`Missing Number = ${sumOfN - count}<br>`)

// 8. Reverse a string
console.log("Activity 8");
document.writeln("<h2>Activity 8:Reverse a string.</h2>")

let name1 = "Atharv";
let reversedName1 = "";

for (let i = name1.length - 1; i >= 0; i--) {
    reversedName1 += name1.charAt(i);
}
console.log(`Reversed String = ${reversedName1}`);
document.writeln(`Reversed String = ${reversedName1}<br>`)


//9.Count vowels in string 
console.log("Activity 9")
document.writeln("<h2>Activity 9:Count vowels in string.</h2>")

let vowelCount = 0
for (let i = 0; i < name1.length; i++) {
    if ("aeiouAEIOU".includes(name1.charAt(i))) {
        vowelCount++
    }
}
console.log(`Name = ${name1}`)
console.log(`Vowel's Count = ${vowelCount}`)
document.writeln(`Name = ${name1}<br>`)
document.writeln(`Vowel's Count = ${vowelCount}<br>`)

//10.check plaindrome in string
console.log("Activity 10")
document.writeln("<h2>Activity 10:Check plaindrome in string.</h2>")

let originalString = "nitin";
let reversedString = "";

for (let i = originalString.length - 1; i >= 0; i--) {
    reversedString += originalString.charAt(i);
}
console.log(`${originalString} is ${originalString === reversedString ? "Palindrome String." : "not a palindrome String."}`);
document.writeln(`${originalString} is ${originalString === reversedString ? "Palindrome String." : "not a palindrome String."}<br>`)


//11.check prime number
console.log("Activity 11")
document.writeln("<h2>Activity 11: Check Prime Number.</h2>")

let checkNum = 8
let isPrime = true

if (checkNum <= 1) {
    isPrime = false
}

for (let i = 2; i <= Math.sqrt(checkNum); i++) {
    if (checkNum % i === 0) {
        isPrime = false
        break
    }
}

if (isPrime) {
    console.log(`${checkNum} is Prime.`)
    document.writeln(`${checkNum} is Prime.<br>`)
} else {
    console.log(`${checkNum} is not Prime.`)
    document.writeln(`${checkNum} is not Prime.<br>`)
}

//12.factorial number
console.log("Activity 12")
document.writeln("<h2>Activity 12: Factorial using Recursion.</h2>")

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1
    }
    return n * factorial(n - 1)
}

let factNum = 5
let result = factorial(factNum)

console.log(`Factorial of ${factNum} is ${result}`)
document.writeln(`Factorial of ${factNum} is ${result}<br>`)

//13.function related
console.log("Activity 13")
document.writeln("<h2>Activity 13: Sum of Digits.</h2>")

function sumOfDigits(num2) {
    let sumOfDigit = 0
    while (num2 > 0) {
        sumOfDigit += num2 % 10
        num2 = Math.floor(num2 / 10)
    }
    return sumOfDigit
}

let digitAddNum = 123
let sumOfDigitsRes = sumOfDigits(digitAddNum)

console.log(`Sum of digits for ${digitAddNum} is ${sumOfDigitsRes}.`)
document.writeln(`Sum of digits for ${digitAddNum} is ${sumOfDigitsRes}.<br>`)

//14.function to find sum of array
console.log("Activity 14")
document.writeln("<h2>Activity 14: Sum of Array Elements.</h2>")

function sumOfArray(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
    return sum
}

let numbers = [10, 20, 30, 40]
let sumOfArrayRes = sumOfArray(numbers)

console.log(`Array = ${numbers}`)
console.log(`Sum of array elements is ${sumOfArrayRes}`)
document.writeln(`Array = ${numbers}<br>`)
document.writeln(`Sum of array elements is ${sumOfArrayRes}<br>`)


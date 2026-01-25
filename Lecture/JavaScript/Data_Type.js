//Memory Two types of memory STACK and  HEAP
/* Stack Used for premitive data types 
   heap  used for non premitive datatypes
*/


//Stack
let myyoutubename="PVP";
let newyoutubechannel=myyoutubename;
newyoutubechannel="Piyush"
console.log(myyoutubename);
console.log(newyoutubechannel);
/*Premitive datatypes stored in stack when we assign one variable to another a copy
 is made so changing one doesnot affect another variable*/


 //HEAP
 let myobj={
    fname:"Piyush",
    age:20,
    id:92
 }

 let obj2=myobj
 obj2.id=100;
 console.log(myobj.id);
 console.log(obj2.id);
 /*Objects are stored in heap memory when we assign one object to another variable
 reference  is copied not the value so when we change on one object both vairables 
 are changed
  */

 

 




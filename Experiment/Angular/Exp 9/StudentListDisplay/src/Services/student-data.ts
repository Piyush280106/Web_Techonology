import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentData {
  studentList:any[] = [
    {name:"Piyush",age:20,course:"CSE"},
    {name:"Vaibhav",age:23,course:"CSE AI/ML"},
    {name:"Abhishek",age:19,course:"TT"},
    {name:"Mane",age:25,course:"AI DS"}
  ]
  getStudentList()
  {
    return this.studentList
  }
  addStudent(student:any)
  {
    this.studentList.push(student)
  }
}

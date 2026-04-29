import { ReturnStatement } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studnts = [
    {name:"Atharv",age:20,course:"CSE"},
    {name:"Soham",age:23,course:"IT"},
    {name:"Shravani",age:25,course:"CSE AI/ML"}
  ]
  getStudents()
  {
    return this.studnts
  }
  addStudent(stud:any)
  {
    this.studnts.push(stud)
  }
}

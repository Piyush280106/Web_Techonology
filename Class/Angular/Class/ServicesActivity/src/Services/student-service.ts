import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  studentList:any[] = [
  { id: 1, name: 'Atharv', age: 20, courseId: 101 },
  { id: 2, name: 'Shravani', age: 21, courseId: 102 },
  { id: 3, name: 'Rahul', age: 22, courseId: null }, // ✅ no course
  { id: 4, name: 'Arya', age: 20, courseId: 103 },
  { id: 5, name: 'Om', age: 23, courseId: null } // ✅ no course
  ]

  getStudents = () => {
    return this.studentList
  }

  addStudent = (studData:any) => {
    this.studentList.push(studData)
  }
}

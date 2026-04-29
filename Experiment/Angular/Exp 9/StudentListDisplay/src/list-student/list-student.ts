import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentData } from '../Services/student-data';

@Component({
  selector: 'app-list-student',
  imports: [CommonModule, FormsModule],
  templateUrl: './list-student.html',
  styleUrl: './list-student.css',
})

export class ListStudent {
  studentList:any[] = []
  newStudent = {name:"", age:"", course:""}
  constructor(private stud:StudentData)
  {
    this.studentList = stud.getStudentList()
  }
  addNewStudent() {
    if (this.newStudent.name && this.newStudent.age && this.newStudent.course) {
      this.stud.addStudent({...this.newStudent})
      this.newStudent = {name:"", age:"", course:""}
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../Services/student-service';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  name:string = ""
  age:number = 0
  course:string = ""
  studentList:any[] = []

  constructor(private studentService:StudentService)
  {
    
  }

  addStudent = () => {
    const studentData = {
      name:this.name,
      age:this.age,
      course:this.course
    }
    
    this.studentService.addStudent(studentData)

    this.name=""
    this.age=0
    this.course=""
  }
}

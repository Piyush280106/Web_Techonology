import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../Services/student-service';

@Component({
  selector: 'app-list-student',
  imports: [CommonModule],
  templateUrl: './list-student.html',
  styleUrl: './list-student.css',
})
export class ListStudent {
  cars: string[] = ["BMW","Merecedes","Opel"]
  studentList:any[] = [] 

  constructor(private studentService:StudentService)
  {

  }
  ngOnInit()
    {
      this.studentList = this.studentService.getStudents()
    }
}

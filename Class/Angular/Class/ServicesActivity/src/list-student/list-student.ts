import { Component } from '@angular/core';
import { StudentService } from '../Services/student-service';
import { CourseService } from '../Services/Courses/course-service';

@Component({
  selector: 'app-list-student',
  templateUrl: './list-student.html',
  styleUrls: ['./list-student.css'],
})
export class ListStudent {

  studList: any[] = [];
  courses: any[] = [];

  constructor(
    private studService: StudentService,
    private courseInfo: CourseService
  ) {}

  ngOnInit() {
    this.studList = this.studService.getStudents();
    this.courses = this.courseInfo.getCourses();
  }

  getCourseName(id: number) {
    const course = this.courses.find(c => c.id === id);
    return course ? course.courseName : 'N/A';
  }
}
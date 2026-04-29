import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  courses:any[] = [
    { id: 101, courseName: 'Artificial Intelligence' },
  { id: 102, courseName: 'Machine Learning' },
  { id: 103, courseName: 'Data Science' }
  ]

  getCourses()
  {
    return this.courses
  }
}

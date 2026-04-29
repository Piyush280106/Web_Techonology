import { Component } from '@angular/core';

@Component({
  selector: 'app-add-student',
  imports: [],
  templateUrl: './add-student.html',
  styleUrl: './add-student.css',
})
export class AddStudent {
  name: string = ""
  age: number = 0
  course: string = ""

  students: any[] = []

  addStudent(event: any) {
    event.preventDefault()

    const form = event.target;

    const name = form.name.value;
    const age = form.age.value;
    const course = form.course.value;

    if (!name || !age || !course) {
      alert("Fill All Fields ...")
      return
    }
    const newStudent = ({
      name: name,
      age: age,
      course: course
    })

    let students = JSON.parse(localStorage.getItem("students") || '[]')
    students.push(newStudent)

    localStorage.setItem("students", JSON.stringify(students))

    console.log("Saved Students", students)
    alert("Student Added Successfylly .... ")
    form.reset()
  }
}

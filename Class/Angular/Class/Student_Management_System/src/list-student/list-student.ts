import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-student',
  imports: [CommonModule],
  templateUrl: './list-student.html',
  styleUrl: './list-student.css',
})
export class ListStudent {
//   students = [
//   { "name": "Atharv", "age": 21, "course": "AI & ML" },
//   { "name": "Shravani", "age": 21, "course": "CSE" },
//   { "name": "Arya", "age": 20, "course": "IT" },
//   { "name": "Saklen", "age": 22, "course": "AI & DS" },
//   { "name": "Kaushal", "age": 22, "course": "CSE" },
//   { "name": "Rohit", "age": 21, "course": "Mechanical" },
//   { "name": "Priya", "age": 20, "course": "IT" },
//   { "name": "Neha", "age": 21, "course": "ECE" },
//   { "name": "Amit", "age": 22, "course": "Civil" },
//   { "name": "Pooja", "age": 20, "course": "AI & ML" },
//   { "name": "Rahul", "age": 23, "course": "CSE" },
//   { "name": "Sneha", "age": 21, "course": "IT" }
// ]
 students = JSON.parse(localStorage.getItem("students")||"[]")
}

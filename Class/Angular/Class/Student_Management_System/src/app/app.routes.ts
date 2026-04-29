import { Routes } from '@angular/router';
import { Home } from '../home/home';
import { ListStudent } from '../list-student/list-student';
import {AddStudent} from '../add-student/add-student'

export const routes: Routes = [
    { path: "", component: Home },
    { path: "listStudents", component: ListStudent },
    { path: "addStudent", component:AddStudent}
];

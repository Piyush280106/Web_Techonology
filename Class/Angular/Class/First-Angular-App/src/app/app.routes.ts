import { Routes } from '@angular/router';
import { Home } from './../home/home';
import { AddStudent } from '../add-student/add-student';
import { ListStudent } from '../list-student/list-student';

export const routes: Routes = [
    {path:"home",component:Home},
    {path:"add-student",component:AddStudent},
    {path:"list-student",component:ListStudent}
];

import { Routes } from '@angular/router';
import { ListStudent } from '../list-student/list-student';
import { Home } from '../home/home';

export const routes: Routes = [
    {path:"",component:Home},
    // {path:"/add-student",component:Add}
    {path:"list-student",component:ListStudent}
];

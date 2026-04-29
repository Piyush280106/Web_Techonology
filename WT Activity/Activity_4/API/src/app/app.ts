import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
 selector:'app-root',
 standalone:true,
 imports:[CommonModule],
 templateUrl:'./app.html',
 styleUrl:'./app.css'
})
export class AppComponent implements OnInit{

users:any[]=[];
loading=true;

constructor(private http:HttpClient){}

ngOnInit(){
this.http.get<any[]>(
'https://jsonplaceholder.typicode.com/users'
).subscribe({
next:(data)=>{
this.users=data;
this.loading=false;
},
error:(err)=>{
console.log(err);
this.loading=false;
}
});

}

}
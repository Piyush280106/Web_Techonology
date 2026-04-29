import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; //needed for ngif for

@Component({
  selector: 'app-home', //name of component
  imports: [FormsModule,CommonModule], // for this component if any //needed to use ngModal
  templateUrl: './home.html', // html path
  styleUrl: './home.css', // css path
})

export class Home {

  showStudent:boolean = false

  fname:String = "Atharv"
  age:Number = 20
  course:String = "CSE"

  changeName = () => {
    this.course = "CSE AI/ML"
  }

  showUI = () => {
    this.showStudent = !this.showStudent
  }
}

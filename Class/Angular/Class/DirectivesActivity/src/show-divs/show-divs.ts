import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-divs',
  imports: [FormsModule],
  templateUrl: './show-divs.html',
  styleUrl: './show-divs.css',
})
export class ShowDivs {
  show:boolean = true
  bgColor:string = "yellow"
  firstInput:string = ''
  secondInput:string = ''
  selectedField:string = ''
}

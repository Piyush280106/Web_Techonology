import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShowDivs } from '../show-divs/show-divs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ShowDivs],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DirectivesActivity');
}

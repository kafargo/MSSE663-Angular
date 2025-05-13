import { Component } from '@angular/core';
import { ShapeselectorComponent } from './shapeselector/shapeselector.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ShapeselectorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor() {
    console.log('HomeComponent initialized');
  }
}
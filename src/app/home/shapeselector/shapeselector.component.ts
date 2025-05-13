import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleComponent } from './circle/circle.component';
import { SquareComponent } from './square/square.component';
import { TriangleComponent } from './triangle/triangle.component';

@Component({
  selector: 'app-shapeselector',
  standalone: true,
  imports: [CommonModule, CircleComponent, SquareComponent, TriangleComponent],
  templateUrl: './shapeselector.component.html',
  styleUrl: './shapeselector.component.scss'
})
export class ShapeselectorComponent {
  selectedShape: string | null = null;

  selectShape(shape: string): void {
    this.selectedShape = shape;
  }

  back(): void {
    this.selectedShape = null;
  }
}

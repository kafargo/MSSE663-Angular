import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TriangleService } from '../../../services/triangle.service';
import { Triangle } from '../../../models/triangle.model';

interface PracticeTriangle extends Triangle {
  perimeter?: number;
  area?: number;
  type?: string;
  userPerimeter?: number;
  userArea?: number;
  userType?: string;
  isPerimeterCorrect?: boolean | null;
  isAreaCorrect?: boolean | null;
  isTypeCorrect?: boolean | null;
  [key: string]: any; // Allow dynamic property access
}

@Component({
  selector: 'app-triangle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './triangle.component.html',
  styleUrl: './triangle.component.scss'
})
export class TriangleComponent implements OnInit {
  triangles: Triangle[] = [];
  practiceTriangles: PracticeTriangle[] = [];
  loading = false;
  error: string | null = null;
  triangleTypes = ['Equilateral', 'Isosceles', 'Scalene'];

  constructor(private triangleService: TriangleService) {}

  ngOnInit(): void {
    this.fetchTriangles();
  }

  fetchTriangles(): void {
    this.loading = true;
    this.error = null;
    
    this.triangleService.getTriangles().subscribe({
      next: (response) => {
        this.triangles = response.data;
        this.loading = false;
        this.selectRandomTriangles();
      },
      error: (err) => {
        console.error('Error fetching triangles:', err);
        this.error = 'Failed to load triangles. Please try again later.';
        this.loading = false;
      }
    });
  }

  selectRandomTriangles(): void {
    if (this.triangles.length < 4) {
      return;
    }

    // Create a copy of the triangles array
    const trianglesCopy = [...this.triangles];
    
    // Shuffle the array
    for (let i = trianglesCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [trianglesCopy[i], trianglesCopy[j]] = [trianglesCopy[j], trianglesCopy[i]];
    }
    
    // Take the first 4 triangles and calculate their properties
    this.practiceTriangles = trianglesCopy.slice(0, 4).map(triangle => {
      const practiceTriangle: PracticeTriangle = { ...triangle };
      
      // Pre-calculate correct answers
      practiceTriangle.perimeter = this.calculatePerimeter(triangle);
      practiceTriangle.area = this.calculateArea(triangle);
      practiceTriangle.type = this.determineTriangleType(triangle);

      // Initialize user answers as null
      practiceTriangle.isPerimeterCorrect = null;
      practiceTriangle.isAreaCorrect = null;
      practiceTriangle.isTypeCorrect = null;
      
      return practiceTriangle;
    });
  }

  calculatePerimeter(triangle: Triangle): number {
    return triangle.sideA + triangle.sideB + triangle.sideC;
  }

  calculateArea(triangle: Triangle): number {
    // Using Heron's formula to calculate the area
    const s = this.calculatePerimeter(triangle) / 2;
    return Number(Math.sqrt(s * (s - triangle.sideA) * (s - triangle.sideB) * (s - triangle.sideC)).toFixed(2));
  }

  determineTriangleType(triangle: Triangle): string {
    const { sideA, sideB, sideC } = triangle;
    
    if (sideA === sideB && sideB === sideC) {
      return 'Equilateral';
    } else if (sideA === sideB || sideB === sideC || sideA === sideC) {
      return 'Isosceles';
    } else {
      return 'Scalene';
    }
  }

  checkAnswer(triangle: PracticeTriangle, property: 'perimeter' | 'area' | 'type'): void {
    const userAnswer = triangle[`user${property.charAt(0).toUpperCase() + property.slice(1)}`];
    const correctAnswer = triangle[property];
    
    // For perimeter and area, we'll allow a small margin of error (0.1)
    if (property === 'perimeter' || property === 'area') {
      const userValueNum = Number(userAnswer);
      const correctValueNum = Number(correctAnswer);
      triangle[`is${property.charAt(0).toUpperCase() + property.slice(1)}Correct`] = 
        !isNaN(userValueNum) && Math.abs(userValueNum - correctValueNum) < 0.1;
    } else {
      // For triangle type, exact match is required
      triangle[`is${property.charAt(0).toUpperCase() + property.slice(1)}Correct`] = 
        userAnswer === correctAnswer;
    }
  }

  getNewPracticeSet(): void {
    this.selectRandomTriangles();
  }
}

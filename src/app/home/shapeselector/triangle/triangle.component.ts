import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TriangleService } from '../../../services/triangle.service';
import { Triangle } from '../../../models/triangle.model';
import { TriangleProblem, TriangleFormData } from '../../../models/triangle-problem.model';
import { TriangleProblemComponent } from './triangle-problem/triangle-problem.component';

@Component({
  selector: 'app-triangle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TriangleProblemComponent],
  templateUrl: './triangle.component.html',
  styleUrl: './triangle.component.scss'
})
export class TriangleComponent implements OnInit, OnDestroy {
  @ViewChildren(TriangleProblemComponent) triangleProblemComponents!: QueryList<TriangleProblemComponent>;
  
  triangles: Triangle[] = [];
  practiceTriangles: TriangleProblem[] = [];
  formDataByIndex: (TriangleFormData | null)[] = [];
  loading = false;
  error: string | null = null;
  triangleTypes = ['Equilateral', 'Isosceles', 'Scalene'];
  hasAnySubmitted = false;
  showCelebration = false;
  celebrationTimer: any = null;

  constructor(private triangleService: TriangleService) {}

  ngOnInit(): void {
    this.fetchTriangles();
  }

  ngOnDestroy(): void {
    // Clean up the celebration timer if it's still running
    if (this.celebrationTimer) {
      clearTimeout(this.celebrationTimer);
      this.celebrationTimer = null;
    }
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
    this.practiceTriangles = trianglesCopy.slice(0, 6).map(triangle => {
      const practiceTriangle = { 
        ...triangle,
        // Pre-calculate correct answers
        perimeter: this.calculatePerimeter(triangle),
        area: this.calculateArea(triangle),
        type: this.determineTriangleType(triangle),
        
        // Set submission status to false
        submitted: false,
        
        // Initialize feedback as null
        isPerimeterCorrect: null,
        isAreaCorrect: null,
        isTypeCorrect: null
      };
      
      return practiceTriangle;
    });
    
    // Reset form data array to match the number of practice triangles
    this.formDataByIndex = new Array(this.practiceTriangles.length).fill(null);
    this.hasAnySubmitted = false;
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

  // handleSubmitAnswer method replaced by submitAllAnswers

  checkAnswer(problem: TriangleProblem, formData: TriangleFormData): void {
    // For perimeter and area, we'll allow a small margin of error (0.1)
    if (formData.perimeter !== null) {
      const userPerimeter = Number(formData.perimeter);
      problem.isPerimeterCorrect = !isNaN(userPerimeter) && 
                                   Math.abs(userPerimeter - problem.perimeter) < 0.1;
    }
    
    if (formData.area !== null) {
      const userArea = Number(formData.area);
      problem.isAreaCorrect = !isNaN(userArea) && 
                             Math.abs(userArea - problem.area) < 0.1;
    }
    
    // For triangle type, exact match is required
    if (formData.type !== null) {
      problem.isTypeCorrect = formData.type === problem.type;
    }
  }

  handleFormDataChange(event: {problem: TriangleProblem, formData: TriangleFormData}, index: number): void {
    // Update the stored form data for this triangle
    this.formDataByIndex[index] = event.formData;
  }
  
  submitAllAnswers(): void {
    if (!this.triangleProblemComponents) {
      return;
    }
    
    // First validate all forms
    let allValid = true;
    this.triangleProblemComponents.forEach(component => {
      if (!component.validateForm()) {
        allValid = false;
      }
    });
    
    if (!allValid) {
      return;
    }
    
    // Submit all answers
    this.practiceTriangles.forEach((problem, index) => {
      const formData = this.formDataByIndex[index];
      if (formData) {
        // Mark as submitted
        problem.submitted = true;
        
        // Check answers
        this.checkAnswer(problem, formData);
      }
    });
    
    this.hasAnySubmitted = true;
    
    // Check if all answers are correct and show celebration if they are
    if (this.areAllAnswersCorrect()) {
      this.showCelebration = true;
      
      // Hide celebration after 5 seconds
      if (this.celebrationTimer) {
        clearTimeout(this.celebrationTimer);
      }
      
      this.celebrationTimer = setTimeout(() => {
        this.showCelebration = false;
      }, 5000);
    } else {
      this.showCelebration = false;
    }
  }

  getNewPracticeSet(): void {
    // Clear any existing celebration
    this.showCelebration = false;
    if (this.celebrationTimer) {
      clearTimeout(this.celebrationTimer);
      this.celebrationTimer = null;
    }
    this.selectRandomTriangles();
  }
  
  /**
   * Check if all submitted answers are correct
   */
  areAllAnswersCorrect(): boolean {
    if (!this.hasAnySubmitted || this.practiceTriangles.length === 0) {
      return false;
    }
    
    for (const problem of this.practiceTriangles) {
      if (!problem.submitted || 
          problem.isPerimeterCorrect !== true || 
          problem.isAreaCorrect !== true || 
          problem.isTypeCorrect !== true) {
        return false;
      }
    }
    
    return true;
  }

  showAnswers(): void {
    if (!this.triangleProblemComponents || this.practiceTriangles.length === 0) {
      return;
    }
    
    // Fill each form with the correct answers
    this.triangleProblemComponents.forEach((component, index) => {
      if (component.triangleForm && this.practiceTriangles[index]) {
        const problem = this.practiceTriangles[index];
        
        // Set the form values to the correct answers
        component.triangleForm.triangleForm.setValue({
          perimeter: problem.perimeter,
          area: problem.area,
          type: problem.type
        });
        
        // Update the stored form data
        this.formDataByIndex[index] = {
          perimeter: problem.perimeter,
          area: problem.area,
          type: problem.type
        };
        
        // Trigger the form data change event to update the parent component
        component.onFormDataChange({
          problem: problem, 
          formData: {
            perimeter: problem.perimeter,
            area: problem.area,
            type: problem.type
          }
        });
      }
    });
  }
}

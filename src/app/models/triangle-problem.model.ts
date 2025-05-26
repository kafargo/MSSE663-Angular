import { Triangle } from './triangle.model';

export interface TriangleProblem extends Triangle {
  // Computed correct answers
  perimeter: number;
  area: number;
  type: string;
  
  // Form submission status
  submitted: boolean;
  
  // Results after submission
  isPerimeterCorrect: boolean | null;
  isAreaCorrect: boolean | null;
  isTypeCorrect: boolean | null;
}

export interface TriangleFormData {
  perimeter: number | null;
  area: number | null;
  type: string | null;
}

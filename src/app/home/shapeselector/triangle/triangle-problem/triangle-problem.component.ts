import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriangleFormComponent } from '../triangle-form/triangle-form.component';
import { TriangleVisualizationComponent } from '../triangle-visualization/triangle-visualization.component';
import { TriangleProblem, TriangleFormData } from '../../../../models/triangle-problem.model';

@Component({
  selector: 'app-triangle-problem',
  standalone: true,
  imports: [CommonModule, TriangleFormComponent, TriangleVisualizationComponent],
  templateUrl: './triangle-problem.component.html',
  styleUrl: './triangle-problem.component.scss'
})
export class TriangleProblemComponent implements OnInit {
  @Input() problem!: TriangleProblem;
  @Input() triangleTypes: string[] = [];
  @Output() submitAnswer = new EventEmitter<{problem: TriangleProblem, formData: TriangleFormData}>();
  
  ngOnInit(): void {
    // Initialize any problem-specific data here if needed
  }
  
  onFormSubmit(event: {problem: TriangleProblem, formData: TriangleFormData}): void {
    this.submitAnswer.emit(event);
  }
}

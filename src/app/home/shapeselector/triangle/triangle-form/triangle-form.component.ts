import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TriangleProblem, TriangleFormData } from '../../../../models/triangle-problem.model';

@Component({
  selector: 'app-triangle-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './triangle-form.component.html',
  styleUrl: './triangle-form.component.scss'
})
export class TriangleFormComponent implements OnInit {
  @Input() problem!: TriangleProblem;
  @Input() triangleTypes: string[] = [];
  @Output() formSubmit = new EventEmitter<{problem: TriangleProblem, formData: TriangleFormData}>();
  
  triangleForm!: FormGroup;
  uniqueId: string = 'form-' + Math.random().toString(36).substring(2, 9);
  
  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    // Initialize the form with Validators
    this.triangleForm = this.fb.group({
      perimeter: [null, [Validators.required, Validators.min(0)]],
      area: [null, [Validators.required, Validators.min(0)]],
      type: [null, Validators.required]
    });
    
    // Reset form if we get a new problem
    if (this.problem.submitted === false) {
      this.triangleForm.reset();
    }
  }
  
  onSubmit(): void {
    if (this.triangleForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.triangleForm.controls).forEach(key => {
        const control = this.triangleForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    // Emit the form data for evaluation
    const formData: TriangleFormData = this.triangleForm.value;
    this.formSubmit.emit({problem: this.problem, formData});
  }
  
  // Helper methods for template
  get perimeterControl() { return this.triangleForm.get('perimeter'); }
  get areaControl() { return this.triangleForm.get('area'); }
  get typeControl() { return this.triangleForm.get('type'); }
}

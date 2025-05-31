import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TriangleProblemComponent } from './triangle-problem.component';
import { TriangleProblem, TriangleFormData } from '../../../../models/triangle-problem.model';

describe('TriangleProblemComponent', () => {
  let component: TriangleProblemComponent;
  let fixture: ComponentFixture<TriangleProblemComponent>;
  let mockProblem: TriangleProblem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriangleProblemComponent],
      schemas: [NO_ERRORS_SCHEMA] // To handle child components without full setup
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriangleProblemComponent);
    component = fixture.componentInstance;

    // Create mock triangle problem
    mockProblem = {
      _id: 'test-id',
      sideA: 3,
      sideB: 4,
      sideC: 5,
      perimeter: 12,
      area: 6,
      type: 'Scalene',
      submitted: false,
      isPerimeterCorrect: null,
      isAreaCorrect: null,
      isTypeCorrect: null,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.problem = mockProblem;
    component.triangleTypes = ['Equilateral', 'Isosceles', 'Scalene'];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required inputs', () => {
    expect(component.problem).toBeDefined();
    expect(component.triangleTypes).toBeDefined();
    expect(component.triangleTypes.length).toBe(3);
  });

  it('should emit formDataChange when onFormDataChange is called', () => {
    spyOn(component.formDataChange, 'emit');
    
    const mockFormData: TriangleFormData = {
      perimeter: 12,
      area: 6,
      type: 'Scalene'
    };

    const event = { problem: mockProblem, formData: mockFormData };
    component.onFormDataChange(event);

    expect(component.formDataChange.emit).toHaveBeenCalledWith(event);
    expect(component.currentFormData).toEqual(mockFormData);
  });

  it('should initialize without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should handle problem with different triangle properties', () => {
    const newProblem: TriangleProblem = {
      _id: 'test-id-2',
      sideA: 5,
      sideB: 5,
      sideC: 5,
      perimeter: 15,
      area: 10.8,
      type: 'Equilateral',
      submitted: true,
      isPerimeterCorrect: true,
      isAreaCorrect: false,
      isTypeCorrect: true,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.problem = newProblem;
    fixture.detectChanges();

    expect(component.problem.type).toBe('Equilateral');
    expect(component.problem.submitted).toBe(true);
    expect(component.problem.isPerimeterCorrect).toBe(true);
  });

  it('should handle validateForm method', () => {
    // Mock the triangleForm component
    component.triangleForm = jasmine.createSpyObj('TriangleFormComponent', ['validateForm']);
    (component.triangleForm as any).validateForm.and.returnValue(true);
    
    const result = component.validateForm();
    
    expect(result).toBe(true);
    expect(component.triangleForm.validateForm).toHaveBeenCalled();
  });
  
  it('should return false for validateForm when form is not available', () => {
    component.triangleForm = undefined as any;
    
    const result = component.validateForm();
    
    expect(result).toBe(false);
  });
  
  it('should return current form data', () => {
    const mockFormData: TriangleFormData = {
      perimeter: 12,
      area: 6,
      type: 'Scalene'
    };
    
    component.currentFormData = mockFormData;
    
    expect(component.getFormData()).toEqual(mockFormData);
  });
});

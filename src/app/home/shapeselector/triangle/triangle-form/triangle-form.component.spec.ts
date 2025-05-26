import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TriangleFormComponent } from './triangle-form.component';
import { TriangleProblem, TriangleFormData } from '../../../../models/triangle-problem.model';

describe('TriangleFormComponent', () => {
  let component: TriangleFormComponent;
  let fixture: ComponentFixture<TriangleFormComponent>;
  let mockProblem: TriangleProblem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriangleFormComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriangleFormComponent);
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

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    
    expect(component.triangleForm).toBeDefined();
    expect(component.triangleForm.get('perimeter')).toBeDefined();
    expect(component.triangleForm.get('area')).toBeDefined();
    expect(component.triangleForm.get('type')).toBeDefined();
  });

  it('should have required validators on form controls', () => {
    component.ngOnInit();
    
    const perimeterControl = component.triangleForm.get('perimeter');
    const areaControl = component.triangleForm.get('area');
    const typeControl = component.triangleForm.get('type');

    expect(perimeterControl?.hasError('required')).toBe(true);
    expect(areaControl?.hasError('required')).toBe(true);
    expect(typeControl?.hasError('required')).toBe(true);
  });

  it('should validate minimum values for perimeter and area', () => {
    component.ngOnInit();
    
    const perimeterControl = component.triangleForm.get('perimeter');
    const areaControl = component.triangleForm.get('area');

    perimeterControl?.setValue(-1);
    areaControl?.setValue(-1);

    expect(perimeterControl?.hasError('min')).toBe(true);
    expect(areaControl?.hasError('min')).toBe(true);
  });

  it('should accept valid form values', () => {
    component.ngOnInit();
    
    component.triangleForm.patchValue({
      perimeter: 12,
      area: 6,
      type: 'Scalene'
    });

    expect(component.triangleForm.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    component.ngOnInit();
    
    // Form is invalid by default (empty values)
    component.onSubmit();
    
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should emit formSubmit when form is valid and submitted', () => {
    spyOn(component.formSubmit, 'emit');
    component.ngOnInit();
    
    const formData = {
      perimeter: 12,
      area: 6,
      type: 'Scalene'
    };
    
    component.triangleForm.patchValue(formData);
    component.onSubmit();
    
    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      problem: mockProblem,
      formData: formData
    });
  });

  it('should mark all controls as touched when form is invalid on submit', () => {
    component.ngOnInit();
    
    // Mock the markAsTouched method
    const perimeterControl = component.triangleForm.get('perimeter');
    const areaControl = component.triangleForm.get('area');
    const typeControl = component.triangleForm.get('type');
    
    spyOn(perimeterControl!, 'markAsTouched');
    spyOn(areaControl!, 'markAsTouched');
    spyOn(typeControl!, 'markAsTouched');
    
    component.onSubmit();
    
    expect(perimeterControl!.markAsTouched).toHaveBeenCalled();
    expect(areaControl!.markAsTouched).toHaveBeenCalled();
    expect(typeControl!.markAsTouched).toHaveBeenCalled();
  });

  it('should generate unique ID', () => {
    const id1 = component.uniqueId;
    const component2 = new TriangleFormComponent(TestBed.inject(FormBuilder));
    const id2 = component2.uniqueId;
    
    expect(id1).not.toBe(id2);
    expect(id1).toContain('form-');
    expect(id2).toContain('form-');
  });

  it('should reset form when problem is not submitted', () => {
    component.ngOnInit();
    
    component.triangleForm.patchValue({
      perimeter: 12,
      area: 6,
      type: 'Scalene'
    });
    
    // Change problem to not submitted
    mockProblem.submitted = false;
    component.problem = mockProblem;
    component.ngOnInit();
    
    expect(component.triangleForm.get('perimeter')?.value).toBeNull();
    expect(component.triangleForm.get('area')?.value).toBeNull();
    expect(component.triangleForm.get('type')?.value).toBeNull();
  });
});

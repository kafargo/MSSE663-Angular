import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriangleComponent } from './triangle.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TriangleService } from '../../../services/triangle.service';

describe('TriangleComponent', () => {
  let component: TriangleComponent;
  let fixture: ComponentFixture<TriangleComponent>;
  let triangleServiceSpy: jasmine.SpyObj<TriangleService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TriangleService', ['getTriangles']);
    
    await TestBed.configureTestingModule({
      imports: [TriangleComponent, HttpClientTestingModule],
      providers: [{ provide: TriangleService, useValue: spy }],
      schemas: [NO_ERRORS_SCHEMA] // To handle image loading without errors
    })
    .compileComponents();

    triangleServiceSpy = TestBed.inject(TriangleService) as jasmine.SpyObj<TriangleService>;
    triangleServiceSpy.getTriangles.and.returnValue(of({
      success: true,
      count: 2,
      data: [
        {
          _id: '1',
          sideA: 3,
          sideB: 4,
          sideC: 5,
          __v: 0,
          createdAt: '2025-05-21T01:02:18.157Z',
          updatedAt: '2025-05-21T01:02:18.157Z'
        },
        {
          _id: '2',
          sideA: 5,
          sideB: 5,
          sideC: 5,
          __v: 0,
          createdAt: '2025-05-21T01:02:18.157Z',
          updatedAt: '2025-05-21T01:02:18.157Z'
        }
      ]
    }));

    fixture = TestBed.createComponent(TriangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display triangle heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toBe('Triangle');
  });

  it('should display triangle image', () => {
    const img = fixture.debugElement.query(By.css('.shape-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('triangle.svg');
    expect(img.nativeElement.alt).toBe('Triangle');
  });

  it('should display triangle information', () => {
    const infoSection = fixture.debugElement.query(By.css('.shape-info'));
    expect(infoSection).toBeTruthy();
    
    // Check for formula content
    const content = infoSection.nativeElement.textContent;
    expect(content).toContain('Area = (1/2) × base × height');
    expect(content).toContain('Perimeter = sum of all three sides');
    expect(content).toContain('Sum of interior angles = 180°');
  });

  it('should handle form data change correctly', () => {
    const mockFormData = { perimeter: 12, area: 6, type: 'Scalene' };
    
    // Setup a mock practice triangle
    component.practiceTriangles = [{
      _id: '1',
      sideA: 3, sideB: 4, sideC: 5,
      perimeter: 12, area: 6, type: 'Scalene',
      submitted: false,
      isPerimeterCorrect: null, isAreaCorrect: null, isTypeCorrect: null,
      __v: 0, createdAt: '', updatedAt: ''
    }];
    
    component.formDataByIndex = [null];
    
    const mockEvent = { 
      problem: component.practiceTriangles[0], 
      formData: mockFormData 
    };
    
    component.handleFormDataChange(mockEvent, 0);
    
    expect(component.formDataByIndex[0]).toEqual(mockFormData);
  });
  
  it('should submit all answers correctly when forms are valid', () => {
    // Setup multiple triangles with form data
    component.practiceTriangles = [
      {
        _id: '1',
        sideA: 3, sideB: 4, sideC: 5,
        perimeter: 12, area: 6, type: 'Scalene',
        submitted: false,
        isPerimeterCorrect: null, isAreaCorrect: null, isTypeCorrect: null,
        __v: 0, createdAt: '', updatedAt: ''
      },
      {
        _id: '2',
        sideA: 5, sideB: 5, sideC: 5,
        perimeter: 15, area: 10.8, type: 'Equilateral',
        submitted: false,
        isPerimeterCorrect: null, isAreaCorrect: null, isTypeCorrect: null,
        __v: 0, createdAt: '', updatedAt: ''
      }
    ];
    
    component.formDataByIndex = [
      { perimeter: 12, area: 6, type: 'Scalene' },
      { perimeter: 15, area: 10.8, type: 'Equilateral' }
    ];
    
    // Mock the triangleProblemComponents QueryList
    const mockComponents = [
      { validateForm: () => true },
      { validateForm: () => true }
    ];
    
    component.triangleProblemComponents = {
      forEach: (callbackFn: (value: any, index: number) => void) => {
        mockComponents.forEach((comp, i) => callbackFn(comp, i));
      }
    } as any;
    
    component.submitAllAnswers();
    
    expect(component.practiceTriangles[0].submitted).toBe(true);
    expect(component.practiceTriangles[1].submitted).toBe(true);
    expect(component.hasAnySubmitted).toBe(true);
    
    // Check that perimeter is correct for first triangle
    expect(component.practiceTriangles[0].isPerimeterCorrect).toBe(true);
  });
  
  it('should not submit if any form is invalid', () => {
    // Setup with one invalid form
    const mockComponents = [
      { validateForm: () => true },
      { validateForm: () => false }
    ];
    
    component.triangleProblemComponents = {
      forEach: (callbackFn: (value: any, index: number) => void) => {
        mockComponents.forEach((comp, i) => callbackFn(comp, i));
      }
    } as any;
    
    component.submitAllAnswers();
    
    expect(component.hasAnySubmitted).toBe(false);
  });
  
  it('should show practice controls when triangles are loaded', () => {
    // Setup practice triangles
    component.practiceTriangles = [{
      _id: '1',
      sideA: 3, sideB: 4, sideC: 5,
      perimeter: 12, area: 6, type: 'Scalene',
      submitted: false,
      isPerimeterCorrect: null, isAreaCorrect: null, isTypeCorrect: null,
      __v: 0, createdAt: '', updatedAt: ''
    }];
    component.loading = false;
    component.error = null;
    
    fixture.detectChanges();
    
    const practiceControls = fixture.debugElement.query(By.css('.practice-controls'));
    expect(practiceControls).toBeTruthy();
  });
});

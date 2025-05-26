import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChanges } from '@angular/core';
import { TriangleVisualizationComponent } from './triangle-visualization.component';
import { Triangle } from '../../../../models/triangle.model';
import { TriangleProblem } from '../../../../models/triangle-problem.model';

describe('TriangleVisualizationComponent', () => {
  let component: TriangleVisualizationComponent;
  let fixture: ComponentFixture<TriangleVisualizationComponent>;
  let mockTriangle: Triangle;
  let mockTriangleProblem: TriangleProblem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriangleVisualizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriangleVisualizationComponent);
    component = fixture.componentInstance;

    // Create mock triangle
    mockTriangle = {
      _id: 'test-id',
      sideA: 3,
      sideB: 4,
      sideC: 5,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    // Create mock triangle problem
    mockTriangleProblem = {
      ...mockTriangle,
      perimeter: 12,
      area: 6,
      type: 'Scalene',
      submitted: false,
      isPerimeterCorrect: null,
      isAreaCorrect: null,
      isTypeCorrect: null
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default canvas dimensions', () => {
    expect(component.canvasWidth).toBe(250);
    expect(component.canvasHeight).toBe(250);
  });

  it('should initialize points array', () => {
    expect(component.points).toBeDefined();
    expect(Array.isArray(component.points)).toBe(true);
  });

  it('should call drawTriangle on ngOnChanges when triangle changes', () => {
    spyOn(component, 'drawTriangle');
    
    const changes: SimpleChanges = {
      triangle: {
        currentValue: mockTriangle,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    };

    component.triangle = mockTriangle;
    component.ngOnChanges(changes);

    expect(component.drawTriangle).toHaveBeenCalled();
  });

  it('should not call drawTriangle on ngOnChanges when triangle is not provided', () => {
    spyOn(component, 'drawTriangle');
    
    const changes: SimpleChanges = {
      otherProperty: {
        currentValue: 'value',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    };

    component.ngOnChanges(changes);

    expect(component.drawTriangle).not.toHaveBeenCalled();
  });

  it('should call drawTriangle on ngAfterViewInit when triangle is set', () => {
    spyOn(component, 'drawTriangle');
    component.triangle = mockTriangle;
    
    component.ngAfterViewInit();

    expect(component.drawTriangle).toHaveBeenCalled();
  });

  it('should not call drawTriangle on ngAfterViewInit when triangle is not set', () => {
    spyOn(component, 'drawTriangle');
    
    component.ngAfterViewInit();

    expect(component.drawTriangle).not.toHaveBeenCalled();
  });

  it('should accept Triangle input', () => {
    component.triangle = mockTriangle;
    
    expect(component.triangle.sideA).toBe(3);
    expect(component.triangle.sideB).toBe(4);
    expect(component.triangle.sideC).toBe(5);
  });

  it('should accept TriangleProblem input', () => {
    component.triangle = mockTriangleProblem;
    
    expect(component.triangle.sideA).toBe(3);
    expect(component.triangle.sideB).toBe(4);
    expect(component.triangle.sideC).toBe(5);
    expect((component.triangle as TriangleProblem).perimeter).toBe(12);
  });

  it('should handle drawTriangle without canvas element', () => {
    component.triangle = mockTriangle;
    
    // Canvas is not available in test environment
    expect(() => component.drawTriangle()).not.toThrow();
  });

  it('should validate triangle inequality theorem in drawTriangle', () => {
    // Create an invalid triangle where sum of two sides equals third side
    const invalidTriangle: Triangle = {
      _id: 'invalid-id',
      sideA: 1,
      sideB: 2,
      sideC: 5, // 1 + 2 < 5, violates triangle inequality
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.triangle = invalidTriangle;
    
    // Should not throw error even with invalid triangle
    expect(() => component.drawTriangle()).not.toThrow();
  });

  it('should handle different triangle types', () => {
    // Equilateral triangle
    const equilateralTriangle: Triangle = {
      _id: 'equilateral-id',
      sideA: 5,
      sideB: 5,
      sideC: 5,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.triangle = equilateralTriangle;
    expect(() => component.drawTriangle()).not.toThrow();

    // Isosceles triangle
    const isoscelesTriangle: Triangle = {
      _id: 'isosceles-id',
      sideA: 5,
      sideB: 5,
      sideC: 3,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.triangle = isoscelesTriangle;
    expect(() => component.drawTriangle()).not.toThrow();
  });

  it('should handle very small triangles', () => {
    const smallTriangle: Triangle = {
      _id: 'small-id',
      sideA: 0.1,
      sideB: 0.1,
      sideC: 0.1,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.triangle = smallTriangle;
    expect(() => component.drawTriangle()).not.toThrow();
  });

  it('should handle very large triangles', () => {
    const largeTriangle: Triangle = {
      _id: 'large-id',
      sideA: 1000,
      sideB: 1000,
      sideC: 1000,
      __v: 0,
      createdAt: '2025-05-21T01:02:18.157Z',
      updatedAt: '2025-05-21T01:02:18.157Z'
    };

    component.triangle = largeTriangle;
    expect(() => component.drawTriangle()).not.toThrow();
  });
});

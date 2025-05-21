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
});

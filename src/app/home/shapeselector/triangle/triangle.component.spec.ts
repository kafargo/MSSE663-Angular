import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TriangleComponent } from './triangle.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TriangleComponent', () => {
  let component: TriangleComponent;
  let fixture: ComponentFixture<TriangleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriangleComponent],
      schemas: [NO_ERRORS_SCHEMA] // To handle image loading without errors
    })
    .compileComponents();

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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SquareComponent } from './square.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SquareComponent', () => {
  let component: SquareComponent;
  let fixture: ComponentFixture<SquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquareComponent],
      schemas: [NO_ERRORS_SCHEMA] // To handle image loading without errors
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display square heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toBe('Square');
  });

  it('should display square image', () => {
    const img = fixture.debugElement.query(By.css('.shape-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('square.svg');
    expect(img.nativeElement.alt).toBe('Square');
  });

  it('should display square information', () => {
    const infoSection = fixture.debugElement.query(By.css('.shape-info'));
    expect(infoSection).toBeTruthy();
    
    // Check for formula content
    const content = infoSection.nativeElement.textContent;
    expect(content).toContain('Area = s²');
    expect(content).toContain('Perimeter = 4s');
  });
});

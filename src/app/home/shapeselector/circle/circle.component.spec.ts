import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircleComponent } from './circle.component';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CircleComponent', () => {
  let component: CircleComponent;
  let fixture: ComponentFixture<CircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircleComponent],
      schemas: [NO_ERRORS_SCHEMA] // To handle image loading without errors
    })
    .compileComponents();

    fixture = TestBed.createComponent(CircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display circle heading', () => {
    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toBe('Circle');
  });

  it('should display circle image', () => {
    const img = fixture.debugElement.query(By.css('.shape-image'));
    expect(img).toBeTruthy();
    expect(img.nativeElement.src).toContain('circle.svg');
    expect(img.nativeElement.alt).toBe('Circle');
  });

  it('should display circle information', () => {
    const infoSection = fixture.debugElement.query(By.css('.shape-info'));
    expect(infoSection).toBeTruthy();
    
    // Check for formula content
    const content = infoSection.nativeElement.textContent;
    expect(content).toContain('Area = πr²');
    expect(content).toContain('Circumference = 2πr');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShapeselectorComponent } from './shapeselector.component';
import { CircleComponent } from './circle/circle.component';
import { SquareComponent } from './square/square.component';
import { TriangleComponent } from './triangle/triangle.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

describe('ShapeselectorComponent', () => {
  let component: ShapeselectorComponent;
  let fixture: ComponentFixture<ShapeselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeselectorComponent, CircleComponent, SquareComponent, TriangleComponent],
      schemas: [NO_ERRORS_SCHEMA] // To handle SVG elements without errors
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially show shape buttons and no selected shape', () => {
    expect(component.selectedShape).toBeNull();
    const shapeButtons = fixture.debugElement.queryAll(By.css('.shape-button'));
    expect(shapeButtons.length).toBe(3); // Circle, Square, Triangle buttons

    const shapeComponents = fixture.debugElement.queryAll(By.css('app-circle, app-square, app-triangle'));
    expect(shapeComponents.length).toBe(0); // No shape components displayed initially
  });

  it('should display circle component when circle is selected', () => {
    // Click the circle button
    const circleButton = fixture.debugElement.queryAll(By.css('.shape-button'))[0];
    circleButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // Verify circle is selected
    expect(component.selectedShape).toBe('circle');
    
    // Verify circle component is displayed
    const circleComponent = fixture.debugElement.query(By.css('app-circle'));
    expect(circleComponent).toBeTruthy();

    // Verify back button is displayed
    const backButton = fixture.debugElement.query(By.css('.back-button'));
    expect(backButton).toBeTruthy();
  });

  it('should return to shape selector when back button is clicked', () => {
    // First select a shape
    component.selectShape('square');
    fixture.detectChanges();
    
    // Verify square is selected
    expect(component.selectedShape).toBe('square');
    
    // Click back button
    const backButton = fixture.debugElement.query(By.css('.back-button'));
    backButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    // Verify we're back to selection
    expect(component.selectedShape).toBeNull();
    
    // Verify shape buttons are visible again
    const shapeButtons = fixture.debugElement.queryAll(By.css('.shape-button'));
    expect(shapeButtons.length).toBe(3);
  });
});

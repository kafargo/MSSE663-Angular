import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ShapeselectorComponent } from './shapeselector/shapeselector.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let shapeSelectorEl: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, ShapeselectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    // Find the ShapeselectorComponent
    shapeSelectorEl = fixture.debugElement.query(By.directive(ShapeselectorComponent));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include ShapeselectorComponent', () => {
    expect(shapeSelectorEl).toBeTruthy();
  });

  it('should display geometry practice heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-title')?.textContent).toContain('Let\'s Practice Basic Geometry!');
  });
});
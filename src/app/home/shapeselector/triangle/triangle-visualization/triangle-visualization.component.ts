import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Triangle } from '../../../../models/triangle.model';
import { TriangleProblem } from '../../../../models/triangle-problem.model';

@Component({
  selector: 'app-triangle-visualization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './triangle-visualization.component.html',
  styleUrl: './triangle-visualization.component.scss'
})
export class TriangleVisualizationComponent implements OnChanges, AfterViewInit {
  @Input() triangle!: Triangle | TriangleProblem;
  @ViewChild('triangleCanvas', { static: false }) triangleCanvas!: ElementRef<HTMLCanvasElement>;
  
  // Canvas properties
  canvasWidth = 250;
  canvasHeight = 250;
  
  // Triangle coordinates
  points: { x: number, y: number }[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['triangle'] && this.triangle) {
      this.drawTriangle();
    }
  }
  
  ngAfterViewInit(): void {
    // Draw initial triangle once the view is initialized
    if (this.triangle) {
      this.drawTriangle();
    }
  }
  
  drawTriangle() {
    if (!this.triangleCanvas) return;
    
    const canvas = this.triangleCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { sideA, sideB, sideC } = this.triangle;
    
    // Check if the triangle is valid (Triangle Inequality Theorem)
    if (sideA + sideB <= sideC || sideA + sideC <= sideB || sideB + sideC <= sideA) {
      // Draw a message if the triangle is invalid
      ctx.font = '14px Arial';
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid triangle dimensions!', canvas.width / 2, canvas.height / 2);
      return;
    }
  
    // Determine the maximum side length
    const maxSide = Math.max(sideA, sideB, sideC);
  
    // Calculate the scaling factor to fit the triangle within the canvas
    const padding = 40; // Add some padding around the triangle
    const scale = (Math.min(canvas.width, canvas.height) - 2 * padding) / maxSide;
    
    // Position the first vertex at the origin (0,0)
    const p1 = { x: 0, y: 0 };
    
    // Position the second vertex at (sideA, 0)
    const p2 = { x: sideA * scale, y: 0 };
    
    // Use the Law of Cosines to find the angle between sideA and sideC
    // cos(C) = (a² + b² - c²) / (2ab)
    const cosAngle = (Math.pow(sideA, 2) + Math.pow(sideC, 2) - Math.pow(sideB, 2)) / (2 * sideA * sideC);
    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp to handle floating point errors
    
    // Calculate the third vertex using trigonometry
    const p3 = {
      x: sideC * scale * Math.cos(angle),
      y: sideC * scale * Math.sin(angle)
    };
    
    // Find the centroid of the triangle for centering
    const centroidX = (p1.x + p2.x + p3.x) / 3;
    const centroidY = (p1.y + p2.y + p3.y) / 3;
    
    // Calculate the offset to center the triangle
    const offsetX = canvas.width / 2 - centroidX;
    const offsetY = canvas.height / 2 - centroidY;
    
    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(p1.x + offsetX, p1.y + offsetY);
    ctx.lineTo(p2.x + offsetX, p2.y + offsetY);
    ctx.lineTo(p3.x + offsetX, p3.y + offsetY);
    ctx.closePath();
    
    // Style the triangle
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Fill with a semi-transparent blue
    ctx.fillStyle = 'rgba(39, 101, 167, 0.5)';
    ctx.fill();
    
    // Label the sides of the triangle
    this.labelSide(ctx, p1, p2, sideA, offsetX, offsetY);
    this.labelSide(ctx, p2, p3, sideB, offsetX, offsetY);
    this.labelSide(ctx, p3, p1, sideC, offsetX, offsetY);
  }
  
  // Helper method to label the sides of the triangle
  private labelSide(
    ctx: CanvasRenderingContext2D, 
    p1: {x: number, y: number}, 
    p2: {x: number, y: number},
    length: number,
    offsetX: number,
    offsetY: number
  ) {
    const midX = (p1.x + p2.x) / 2 + offsetX;
    const midY = (p1.y + p2.y) / 2 + offsetY;
    
    // Add a small offset to position the text outside the line
    const dx = p2.y - p1.y;
    const dy = p1.x - p2.x;
    const mag = Math.sqrt(dx * dx + dy * dy);
    const normX = dx / mag * 15;
    const normY = dy / mag * 15;
    
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(length.toString(), midX + normX, midY + normY);
  }
}

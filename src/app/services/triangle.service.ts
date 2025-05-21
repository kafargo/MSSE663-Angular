import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TrianglesResponse } from '../models/triangle.model';

@Injectable({
  providedIn: 'root'
})
export class TriangleService {
  private apiUrl = 'https://msse663-express-backend-production.up.railway.app/api/triangles';

  constructor(private http: HttpClient) {}

  getTriangles(): Observable<TrianglesResponse> {
    return this.http.get<TrianglesResponse>(this.apiUrl);
  }
}

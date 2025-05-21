export interface Triangle {
  _id: string;
  sideA: number;
  sideB: number;
  sideC: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TrianglesResponse {
  success: boolean;
  count: number;
  data: Triangle[];
}

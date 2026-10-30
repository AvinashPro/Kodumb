import { Geometry } from "./Geometry.js";

export class QuadGeometry extends Geometry {
  constructor() {
    super({
      vertices: new Float32Array([
        -0.5, 0.5, 0.0,
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0
      ]),
      indices: new Uint16Array([
        0, 1, 2,
        0, 2, 3
      ]),
      normals: new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ])
    });
  }
}
export class CubeGeometry extends Geometry {
  constructor() {
    super({
      vertices: new Float32Array([
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5
      ]),
      indices: new Uint16Array([
        0, 1, 2, 0, 2, 3, // back
        4, 5, 6, 4, 6, 7, // front
        0, 4, 7, 0, 7, 3, // top
        1, 5, 6, 1, 6, 2, // bottom
        0, 1, 5, 0, 5, 4, // left 
        2, 6, 7, 2, 7, 3 // right
      ]),
      normals: new Float32Array([
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
      ])
    });
  }
}
export class Geometry {
  constructor({ vertices, indices, normals = null}) {
    this.vertices = vertices;
    this.indices = indices;
    this.normals = normals;
    this.version = 0;
  }
  
  get vertexCount() { return this.vertices.length / 3; }
  get indexCount() { return this.indices.length; }
  
  markDirty() { this.version++; }
  
}
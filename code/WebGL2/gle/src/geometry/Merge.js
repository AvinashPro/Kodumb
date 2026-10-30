import { Geometry } from "./Geometry.js"

export function mergeGeometries(geometries) {
  const vCount = geometries.reduce((o, c) => o + c.vertices.length, 0);
  const iCount = geometries.reduce((o, c) => o + c.indices.length, 0);
  const nCount = geometries.reduce((o, c) => o + c.normals.length, 0);
  
  const vertices = new Float32Array(vCount);
  const indices = new Float32Array(iCount);
  const normals = new Float32Array(nCount);
  
  let vOff = 0, iOff = 0, nOff = 0;
  for(const g of geometries) {
    vertices.set(g.vertices, vOff);
    normals.set(g.normals, nOff);
    const vCount = vOff / 3;
    for(let i = 0; i < g.indices.length; i++) indices[i + iOff] = g.indices[i] + vCount;
    vOff += g.vertices.length;
    iOff += g.indices.length;
    nOff += g.normals.length;
  }
  
  return new Geometry({ vertices, indices, normals });
  
}
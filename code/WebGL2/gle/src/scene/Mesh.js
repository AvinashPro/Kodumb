import { Transform } from "./Transform.js";

export class Mesh {
  constructor(geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.transform = new Transform();
    this.visible = true;
    this.onUpdate = null;
  }
  
  update(dt) { this.onUpdate?.(this, dt); }
}
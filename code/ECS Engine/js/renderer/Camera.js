import Vector from "../utils/Vector.js"

export default class Camera {
  constructor(x = 0, y = 0, zoom = 1, target = null, lerpFactor = 0.05) {
    this.pos = new Vector(x, y);
    this.zoom = zoom;
    this.target = target;
    this.lerpFactor = lerpFactor;
  }
  
  follow(target) {
    this.target = target;
  }
  
  update(dt) {
    const pos = this.target.get("Position").pos;
    this.pos.x += (pos.x - this.pos.x) * this.lerpFactor;
    this.pos.y += (pos.y - this.pos.y) * this.lerpFactor;
  }
  
}
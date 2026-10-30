import { mat4 } from "../math/Mat4.js";

export class Transform {
  position = { x: 0, y: 0, z: 0 };
  rotation = { x: 0, y: 0, z: 0 };
  scale = { x: 1, y: 1, z: 1 };
  
  _matrix = new mat4();
  _dirty = true;
  
  setPosition(x, y, z) {
    this.position = { x, y, z };
    this._dirty = true;
    return this;
  }
  setScale(x, y, z) {
    this.scale = { x, y, z };
    this._dirty = true;
    return this;
  }
  
  setRotationX(angle) {
    this.rotation.x = angle;
    this._dirty = true;
    return this;
  }
  setRotationY(angle) {
    this.rotation.y = angle;
    this._dirty = true;
    return this;
  }
  setRotationZ(angle) {
    this.rotation.z = angle;
    this._dirty = true;
    return this;
  }
  
  get matrix() {
    if(this._dirty) this.recompute();
    return this._matrix;
  }
  
  recompute() {
    const { position: p, rotation: r, scale: s } = this;
    const scaleM = mat4.scaling(s.x, s.y, s.z);
    const rotXM = mat4.rotationX(r.x);
    const rotYM = mat4.rotationY(r.y);
    const rotZM = mat4.rotationZ(r.z);
    const transM = mat4.translation(p.x, p.y, p.z);
    mat4.multiply(rotXM, scaleM, this._matrix);
    mat4.multiply(rotYM, this._matrix, this._matrix);
    mat4.multiply(rotZM, this._matrix, this._matrix);
    mat4.multiply(transM, this._matrix, this._matrix);
    this._dirty = false;
  }
  
}
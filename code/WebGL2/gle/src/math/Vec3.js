export class vec3 {
  static count = 0;
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    vec3.count++;
  }
  add(v, d = this) {
    d.x = this.x + v.x;
    d.y = this.y + v.y;
    d.z = this.z + v.z;
    return d;
  }
  sub(v, d = this) {
    d.x = this.x - v.x;
    d.y = this.y - v.y;
    d.z = this.z - v.z;
    return d;
  }
  scale(k) {
    this.x *= k;
    this.y *= k;
    this.z *= k;
    return this;
  }
  clone() {
    return new vec3(this.x, this.y, this.z);
  }
  static from(v) {
    return new vec3(v.x, v.y, v.z);
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v, d = new vec3()) {
    const vx = v.x, x = this.x,
          vy = v.y, y = this.y;
    d.x = y * v.z - vy * this.z;
    d.y = - x * v.z + vx * this.z;
    d.z = x * vy - vx * y;
    return d;
  }
  rotateX(angle, d = this) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const { y, z } = this;
    d.y = y * cos - z * sin;
    d.z = y * sin + z * cos;
    return d;
  }
  rotateY(angle, d = this) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const { x, z } = this;
    d.x = x * cos + z * sin;
    d.z = - x * sin + z * cos;
    return d;
  }
  rotateZ(angle, d = this) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const { x, y } = this;
    d.x = x * cos - y * sin;
    d.y = x * sin + y * cos;
    return d;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  normalize() {
    const len = this.length();
    if(len !== 0) return this.scale(1 / len);
    return this.set(0, 0, 0);
  }
  lerp(v, t = 0.05) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    this.z += (v.z - this.z) * t;
    return this;
  }
}

export class VectorPool {
  constructor(size = 20) {
    this.size = size;
    this.pool = [];
    for(let i = 0; i < size; i++) {
      this.pool.push(new vec3());
    }
  }
  
  get(vec = null) {
    if(this.size === 0) return vec ? vec3.from(vec) : new vec3();
    const v = this.pool[--this.size];
    return vec ? v.copy(vec) : v;
  }
  
  release() {
    for(let i = 0; i < arguments.length; i++) {
      this.pool[this.size++] = arguments[i];
    }
  }
}
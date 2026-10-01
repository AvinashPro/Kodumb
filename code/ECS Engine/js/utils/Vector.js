export default class Vector {
  
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }
  
  add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  
  addScaled(v, k) {
    this.x += v.x * k;
    this.y += v.y * k;
    return this;
  }
  
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  
  mult(k) {
    this.x *= k;
    this.y *= k;
    return this;
  }
  
}
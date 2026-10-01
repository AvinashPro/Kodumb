class Mat4 {
  
  static IDENTITY = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ]);
  
  constructor(data = new Float32Array(16)) {
    this.data = data;
  }
  
  static identity(m = new Mat4()) {
    m.data.set(Mat4.IDENTITY);
    return m;
  }
  
  static scaling(sx, sy, sz = 1, m = new Mat4()) {
    const d = m.data;
    d[0] = sx; d[1] = 0; d[2] = 0; d[3] = 0;
    d[4] = 0; d[5] = sy; d[6] = 0; d[7] = 0;
    d[8] = 0; d[9] = 0; d[10] = sz; d[11] = 0;
    d[12] = 0; d[13] = 0; d[14] = 0; d[15] = 1;
    return m;
  }
  
  static translation(tx, ty, tz = 0, m = new Mat4()) {
    const d = m.data;
    d[0] = 1; d[1] = 0; d[2] = 0; d[3] = 0;
    d[4] = 0; d[5] = 1; d[6] = 0; d[7] = 0;
    d[8] = 0; d[9] = 0; d[10] = 1; d[11] = 0;
    d[12] = tx; d[13] = ty; d[14] = tz; d[15] = 1;
    return m;
  }
  
  static rotationZ(angle, m = new Mat4()) {
    const d = m.data;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    d[0] = c; d[1] = s; d[2] = 0; d[3] = 0;
    d[4] = -s; d[5] = c; d[6] = 0; d[7] = 0;
    d[8] = 0; d[9] = 0; d[10] = 1; d[11] = 0;
    d[12] = 0; d[13] = 0; d[14] = 0; d[15] = 1;
    return m;
  }
  static rotationX(angle, m = new Mat4()) {
    const d = m.data;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    d[0] = 1; d[1] = 0; d[2] = 0; d[3] = 0;
    d[4] = 0; d[5] = c; d[6] = s; d[7] = 0;
    d[8] = 0; d[9] = -s; d[10] = c; d[11] = 0;
    d[12] = 0; d[13] = 0; d[14] = 0; d[15] = 1;
    return m;
  }
  static rotationY(angle, m = new Mat4()) {
    const d = m.data;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    d[0] = c; d[1] = 0; d[2] = -s; d[3] = 0;
    d[4] = 0; d[5] = 1; d[6] = 0; d[7] = 0;
    d[8] = s; d[9] = 0; d[10] = c; d[11] = 0;
    d[12] = 0; d[13] = 0; d[14] = 0; d[15] = 1;
    return m;
  }
  

  translate(tx, ty, tz = 0) {
    const d = this.data;
    for(let row = 0; row < 4; row++) {
      const i = row * 4;
      const w = d[i + 3];
      d[i + 0] += tx * w;
      d[i + 1] += ty * w;
      d[i + 2] += tz * w;
    }
    return this;
  }
  
  scale(sx, sy, sz = 1) {
    const d = this.data;
    for(let row = 0; row < 4; row++) {
      const i = row * 4;
      d[i + 0] *= sx;
      d[i + 1] *= sy;
      d[i + 2] *= sz;
    }
    return this;
  }
  
  rotateX(angle) {
    const d = this.data;
    const d1 = d[1], d5 = d[5], d9 = d[9], d13 = d[13];
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    d[1] = cos * d1 - sin * d[2];
    d[5] = cos * d5 - sin * d[6];
    d[9] = cos * d9 - sin * d[10];
    d[13] = cos * d13 - sin * d[14];
    d[2] = - sin * d1 + cos * d[2];
    d[6] = - sin * d5 + cos * d[6];
    d[10] = - sin * d9 + cos * d[10];
    d[14] = - sin * d13 + cos * d[14];
    return this;
  }
  rotateY(angle) {
    const d = this.data;
    const d0 = d[0], d4 = d[4], d8 = d[8], d12 = d[12];
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    d[0] = cos * d0 + sin * d[2];
    d[4] = cos * d4 + sin * d[6];
    d[8] = cos * d8 + sin * d[10];
    d[12] = cos * d12 + sin * d[14];
    d[2] = - sin * d0 + cos * d[2];
    d[6] = - sin * d4 + cos * d[6];
    d[10] = - sin * d8 + cos * d[10];
    d[14] = - sin * d12 + cos * d[14];
    return this;
  }
  rotateZ(angle) {
    const d = this.data;
    const d0 = d[0], d4 = d[4], d8 = d[8], d12 = d[12];
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    d[0] = cos * d0 - sin * d[1];
    d[4] = cos * d4 - sin * d[5];
    d[8] = cos * d8 - sin * d[9];
    d[12] = cos * d12 - sin * d[13];
    d[1] = sin * d0 + cos * d[1];
    d[5] = sin * d4 + cos * d[5];
    d[9] = sin * d8 + cos * d[9];
    d[13] = sin * d12 + cos * d[13];
    return this;
  }
  
  static multiply(a, b, m = new Mat4()) {
    const m1 = a.data;
    const m2 = b.data;
    const aliased = (m.data === m1 || m.data === m2);
    const r = (aliased ? new Float32Array(16) : m.data);
    
    for(let row = 0; row < 4; row++) {
      const i = row * 4;
      const b0 = m2[i], b1 = m2[i+1], b2 = m2[i+2], b3 = m2[i+3];
      r[i] = m1[0] * b0 + m1[4] * b1 + m1[8] * b2 + m1[12] * b3;
      r[i+1] = m1[1] * b0 + m1[5] * b1 + m1[9] * b2 + m1[13] * b3;
      r[i+2] = m1[2] * b0 + m1[6] * b1 + m1[10] * b2 + m1[14] * b3;
      r[i+3] = m1[3] * b0 + m1[7] * b1 + m1[11] * b2 + m1[15] * b3;
    }
    if(aliased) m.data.set(r);
    return m;
  }
  
  static orthographic(l, r, t, b, n, f, m = Mat4.identity()) {
    const d = m.data;
    d[0] = 2 / (r - l); d[1] = 0; d[2] = 0; d[3] = 0;
    d[4] = 0; d[5] = 2 / (t - b); d[6] = 0; d[7] = 0;
    d[8] = 0; d[9] = 0; d[10] = -2 / (f - n); d[11] = 0;
    d[12] = - (r + l) / (r - l);
    d[13] = - (t + b) / (t - b);
    d[14] = -(f + n) / (f - n);
    d[15] = 1;
    return m;
  }
  
  static perspective(fovy, aspect, near, far, m = new Mat4()) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    const d = m.data;
    
    d[0] = f / aspect; d[1] = 0; d[2] = 0; d[3] = 0;
    d[4] = 0; d[5] = f; d[6] = 0; d[7] = 0;
    d[8] = 0; d[9] = 0; d[10] = (near + far) * nf; d[11] = -1;
    d[12] = 0; d[13] = 0; d[14] = (2 * near * far) * nf; d[15] = 0;
    return m;
  }
  
  print() {
    const d = this.data;
    console.log(`\n${d[0]}  ${d[4]}  ${d[8]}  ${d[12]}\n${d[1]}  ${d[5]}  ${d[9]}  ${d[13]}\n${d[2]}  ${d[6]}  ${d[10]}  ${d[14]}\n${d[3]}  ${d[7]}  ${d[11]}  ${d[15]}\n`);
  }
  
}
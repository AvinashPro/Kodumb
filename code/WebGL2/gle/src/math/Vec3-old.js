const vec3 = (() => {
  
  create = (x = 0, y = 0, z = 0) => {
    const c = [];
    c[0] = x; c[1] = y; c[2] = z;
    return c;
  };
  
  add = (out, v1, v2) => {
    out[0] = v1[0] + v2[0];
    out[1] = v1[1] + v2[1];
    out[2] = v1[2] + v2[2];
    return out;
  };
  sub = (out, v1, v2) => {
    out[0] = v1[0] - v2[0];
    out[1] = v1[1] - v2[1];
    out[2] = v1[2] - v2[2];
    return out;
  };
  cross = (out, v1, v2) => {
    const v10 = v1[0], v20 = v2[0],
          v11 = v1[1], v21 = v2[1];
    out[0] = v11 * v2[2] - v21 * v1[2];
    out[1] = - v10 * v2[2] + v20 * v1[2];
    out[2] = v10 * v21 - v20 * v11;
    return out;
  };
  normalize = (v, out = v) => {
    let len = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    if(!len) return out;
    len = 1 / len;
    out[0] = v[0] * len;
    out[1] = v[1] * len;
    out[2] = v[2] * len;
    return out;
  }
  
  
  
  return {
    create, add, sub, cross, normalize
  };
})();

const a = vec3.create(1,2,3);
const b = vec3.create(5,6,3);
const d = vec3.create();
vec3.add(d, a, b)
vec3.normalize(d, b)
console.log(a, b, d);

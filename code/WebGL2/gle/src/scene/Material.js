export class Material {
  constructor(program, { uniforms = {}, depthTest = true } = {}) {
    this.program = program;
    this.uniforms = uniforms;
    this._dirtyUniforms = {};
    for(const [name, values] of Object.entries(uniforms)) {
      this._dirtyUniforms[name] = true;
    }
    this.depthTest = depthTest;
  }
  
  setUniform(name, value) {
    this.uniforms[name] = value;
    this._dirtyUniforms[name] = true;
  }
  
  apply(gl) {
    gl.useProgram(this.program.handle);
    this.depthTest ? gl.enable(gl.DEPTH_TEST) : gl.disable(gl.DEPTH_TEST);
    for(const [name, value] of Object.entries(this.uniforms)) {
      if(!this._dirtyUniforms[name]) continue;
      const loc = this.program.uniform(name);
      if(loc !== null) {
        this.applyUniform(gl, loc, value);
        this._dirtyUniforms[name] = false;
      }
    }
  }
  
  applyUniform(gl, loc, v) {
    if(v instanceof Float32Array) {
      if(v.length === 16) gl.uniformMatrix4fv(loc, false, v);
      else if(v.length === 4) gl.uniform4fv(loc, v);
      else if(v.length === 3) gl.uniform3fv(loc, v);
    } else if(typeof v === "number") gl.uniform1f(loc, v);
  }
  
}
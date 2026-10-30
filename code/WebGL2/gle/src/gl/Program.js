import { compileProgram } from "./Compile.js"

export class Program {
  constructor(gl, vs_src, fs_src, uniformBlocks = {}) {
    this.gl = gl;
    this.handle = compileProgram(gl, vs_src, fs_src);
    this.uniforms = new Map();
    for(const [name, binding] of Object.entries(uniformBlocks)) {
      const idx = gl.getUniformBlockIndex(this.handle, name);
      gl.uniformBlockBinding(this.handle, idx, binding);
    }
  }
  
  
  uniform(name) {
    if(!this.uniforms.has(name)) this.uniforms.set(name, this.gl.getUniformLocation(this.handle, name));
    return this.uniforms.get(name);
  }
    
  destroy() {
    this.gl.deleteProgram(this.handle);
  }
  
  
}
export class Renderer {
  constructor(canvas, { dprScaling = false } = {}) {
    this.canvas = canvas;
    const gl = canvas.getContext("webgl2");
    if(!gl) throw new Error("WebGL2 not supported!");
    this.gl = gl;
    this.dprScaling = dprScaling;
    this.dirty = true;
    this.observer = new ResizeObserver(() => { this.dirty = true; });
    this.observer.observe(canvas);
    
    this.geometryCache = new WeakMap();
  }
  
  get dpr() {
    return this.dprScaling ? (window.devicePixelRatio || 1) : 1;
  }
  
  applySize() {
    const { gl, canvas } = this;
    canvas.width = Math.floor(canvas.clientWidth * this.dpr);
    canvas.height = Math.floor(canvas.clientHeight * this.dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.dirty = false;
  }
  
  render(scene) {
    if(this.dirty) this.applySize();
    const { gl } = this;
    gl.clearColor(0, 0.05, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(const mesh of scene.meshes) this.draw(mesh);
  }
  
  
  destroy() {
    this.observer.disconnect();
  }
  
  getGpuGeometry(g) {
    let entry = this.geometryCache.get(g);
    if(!entry || entry.version !== g.version) {
      if(entry) {
        this.gl.deleteVertexArray(entry.vao);
        this.gl.deleteBuffer(entry.ebo);
        this.gl.deleteBuffer(entry.vbo);
      }
      entry = this.uploadGeometry(g);
      this.geometryCache.set(g, entry);
    }
    return entry;
  }
  
  uploadGeometry(g) {
    const { gl } = this;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, g.vertices, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    
    const ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.indices, gl.STATIC_DRAW);
    
    gl.bindVertexArray(null);
    return { vao, vbo, ebo, version: g.version };
  }
  
  draw(mesh) {
    if(!mesh.visible) return;
    mesh.material.setUniform("u_model", mesh.transform.matrix.data);
    mesh.material.apply(this.gl);
    const { vao } = this.getGpuGeometry(mesh.geometry);
    this.gl.bindVertexArray(vao);
    this.gl.drawElements(this.gl.TRIANGLES, mesh.geometry.indexCount, this.gl.UNSIGNED_SHORT, 0);
  }
  
}
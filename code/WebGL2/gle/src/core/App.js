import { Renderer } from "../render/Renderer.js"
import { Scene } from "../scene/Scene.js"
import { InputManager } from "../utils/InputManager.js"
import { Assets } from "../utils/Assets.js"
import { Camera } from "../render/Camera.js";

export class App {
  _raf;
  _last = 0;
  
  constructor(canvas) {
    this.renderer = new Renderer(canvas, { dprScaling: true });
    this.scene = new Scene();
    this.camera = new Camera();
    this.input = new InputManager(canvas);
    this.assets = new Assets();
    this._running = false;
  }
  
  async start(...manifest) {
    if(this._running) return;
    await this.assets.load(...manifest);
    this._raf = requestAnimationFrame(this.tick);
    this._running = true;
  }
  
  stop() {
    cancelAnimationFrame(this._raf);
    this._running = false;
    this._raf = null;
  }
  
  tick = (t) => {
    this._raf = requestAnimationFrame(this.tick);
    const dt = Math.min((t - this._last) * 0.001, 0.1);
    this._last = t;
    this.input.update();
    
    this.camera.move.y = 0;
    if(this.input.isPressed("Y+")) this.camera.move.y += this.camera.speed * dt;
    if(this.input.isPressed("Y-")) this.camera.move.y -= this.camera.speed * dt;
    this.camera.update(dt);
    if(this.ubo) {
      const gl = this.renderer.gl;
      gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
      gl.bufferSubData(gl.UNIFORM_BUFFER, 64, this.camera.viewMatrix.data);
    }
    
    this.scene.update(dt);
    this.renderer.render(this.scene);
  }
  
}
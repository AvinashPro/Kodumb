export class Time {
  t0 = 0;
  t1 = 0;
  t;
  dt;
  fps;
  frames = 0;
  fpsElm = document.querySelector("#fpsElm");
  constructor() { }
  update(t) {
    this.t = t;
    this.dt = (this.t - this.t0) * 0.001;
    this.t0 = this.t;
    
    this.t1 += this.dt;
    this.frames++;
    if(this.t1 >= 1) {
      this.t1 = 0;
      this.fps = this.frames;
      this.fpsElm.textContent = this.fps;
      this.frames = 0;
    }
    
  }
  
}
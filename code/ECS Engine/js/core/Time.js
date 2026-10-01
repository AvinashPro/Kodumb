export default class Time {
  constructor() {
    this.dt = 0;
    this.elapsed = 0;
    this.then = 0;
    this.now = 0;
    this.fps = 30;
    this.frameCount = 0;
    this.frameThen = 0;
  }
  update() {
    this.now = performance.now();
    this.dt = (this.now - this.then) / 1000;
    this.elapsed += this.dt;
    this.then = this.now;
    
    this.frameCount++;
    if(this.now - this.frameThen >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.frameThen = this.now;
    }
    //this.fps = 1 / this.dt;
  }
}
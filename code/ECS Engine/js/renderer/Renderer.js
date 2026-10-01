export default class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.camera = null;
    this.dpr = window.devicePixelRatio;
  }
  
  setCamera(camera) {
    this.camera = camera;
  }
  
  clear() {
    if(this.camera) this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

  }
  
  applyCamera() {
    const cam = this.camera;
    if(!cam) return;
    
    const cx = this.canvas.clientWidth / 2;
    const cy = this.canvas.clientHeight / 2;
    const dpr = window.devicePixelRatio || 1
    this.ctx.setTransform(
      dpr * cam.zoom,
      0,
      0,
      dpr * cam.zoom,
      Math.round(dpr * (cx - cam.pos.x * cam.zoom)),
      Math.round(dpr * (cy - cam.pos.y * cam.zoom))
    );
  }
  
  fill(color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  img(img, x, y, w, h) {
    this.ctx.drawImage(img, x, y, w, h);
  }
  
  rect(x, y, w, h, color = "#fff") {
    let [screenX, screenY, screenW, screenH] = [x, y, w, h];
    /*if(this.camera) {
      screenX = (x - this.camera.pos.x + 360 - this.canvas.clientWidth / 2) * this.camera.zoom;
      screenY = (y - this.camera.pos.y + this.canvas.clientHeight / 2) * this.camera.zoom;
      screenW = w * this.camera.zoom;
      screenH = h * this.camera.zoom;
    }*/
    
    this.ctx.fillStyle = color;
    this.ctx.fillRect(screenX, screenY, screenW, screenH);
  }
  
  slope(x1, y1, x2, y2, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }
  
  image(img, x, y) {
    this.ctx.drawImage(img, x, y);
  }
  
  image2(img, sx, sy, sw, sh, x, y, w, h, fillCol = null) {
    if(fillCol) this.fill(fillCol);
    this.ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
  
  resetTransform() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  
  zoomTransition(transition) {
    this.ctx.scale(this.dpr * transition.ZOOM, this.dpr * transition.ZOOM);
  }
  
  fadeTransition(transition) {
//console.log(transition.OPACITY)
    this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - transition.OPACITY})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
}
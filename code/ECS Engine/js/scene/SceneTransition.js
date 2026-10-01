export default class SceneTransition {
  constructor({name, dur = 2000, initialZoom = null, finalZoom = null, initialOpacity = null, finalOpacity = null, callback = null, callbackDelay = 0, remove = false}) {
    this.type = name;
    this.time = 0;
    this.dur = dur;
    
    this.ZOOM = initialZoom;
    this.initialZoom = initialZoom;
    this.finalZoom = finalZoom;
    this.OPACITY = initialOpacity;
    this.initialOpacity = initialOpacity;
    this.finalOpacity = finalOpacity;
    
    this.callback = callback;
    this.callbackDelay = callbackDelay * 1000;
    this.removeOnCompletion = remove;
    //this.sceneManager = sceneManager;
   /* this.from = null;
    this.to = null;
    this.dur = null;
    this.time = null;*/
  }
  
  update(dt) {
    if(this.time >= this.dur) {
      this.time = this.dur;
      this.finished = true;
      if(this.callback) {
        setTimeout(this.callback, this.callbackDelay);
      }
    }
    this.time += dt;
    this.progress = this.time / this.dur;
    this[this.type]();
  }
  
  zoom() {
    this.ZOOM += (this.finalZoom - this.ZOOM) * 0.05;
  }
  
  /*
  fadeOut() {
    this.OPACITY = 1 - this.time / this.dur;
  }*/
  
  fade() {
    this.OPACITY = (this.finalOpacity - this.initialOpacity) * this.progress + this.initialOpacity;
  }
  /*
  renderzoom(ctx, cx, cy) {
    //ctx.save();
    const dpr = 2;
    console.log(cx,cy)
    ctx.setTransform(dpr * this.ZOOM, 0, 0, dpr * this.ZOOM, dpr * (0 - 50 * this.ZOOM), dpr * (0 - 50 * this.ZOOM))
  }*/
  /*
  transition(type, from, to, dur) {
    this[type](from, to);
  }*/
  /*
  update
  
  fadeOut(from, to) {
    tgis
  }*/
  
}
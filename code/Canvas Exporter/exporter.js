/*
@params { HTMLCanvasElement canvas, Function update, Function render }
update(dt)
render(ctx)
*/
export class CanvasExporter {
  constructor(canvas, update, render, params = {}) {
    if(!("showDirectoryPicker" in window)) throw new Error("Directory Picker is not supported! Try different browser.");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.config = {
      fps: params.fps || 60,
      duration: params.duration ?? 10
    };
    
    this.simulation = { 
      update,
      render,
      dt: 1 / this.config.fps,
      totalFrames: this.config.fps * this.config.duration,
      skipFrames: params.skipFrames || 0
    };
    
    this._dirHandle = null;
    this._running = false;
    
    this.t0 = 0;
    this.t1 = 0;
  }
  
  
  async chooseFolder() {
    if(this._dirHandle) {
      try {
        const perm = await this._dirHandle.queryPermission({ mode: "readwrite" });
        if(perm === "granted") return this._dirHandle;
        const req = await this._dirHandle.requestPermission({ mode: "readwrite" });
        if(req === "granted") return this._dirHandle;
      } catch (e) { }
    }
    this._dirHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    return this._dirHandle;
  }
  
  removeFolder() {
    this._dirHandle = null;
  }
  
  get isRunning() {
    return this._running;
  }
  
  stop() {
    this._running = false;
  }
  
  updateConfig() {
    this.config.fps = parseInt(this.fpsElm.value);
    this.config.duration = Number(this.durationElm.value);
    this.simulation.totalFrames = this.config.fps * this.config.duration;
    this.simulation.skipFrames = parseInt(this.skipFramesElm.value);
    
    const f = parseInt(this.scalefElm.value) || 1;
    /*const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * dpr * f;
    this.canvas.height = this.canvas.clientHeight * dpr * f;*/
    this.canvas.width *= f;
    this.canvas.height *= f;
    this.scaleCanvasElm.innerHTML = `${this.canvas.width}&times;${this.canvas.height}`;
  }
  
  async export() {
    if(this._running) throw new Error("An export is already in progress.");
    
    await this.chooseFolder();
    this._running = true;
    this.updateConfig();
    this.totalFramesElm.textContent = this.simulation.totalFrames - this.simulation.skipFrames;
    this.simulation.framesToRender = this.simulation.totalFrames - this.simulation.skipFrames;
    
    for(let i = 0; i < this.simulation.skipFrames; i++) {
      this.simulation.update(this.simulation.dt);
    }
    
    const digits = this.simulation.totalFrames.toString().length;
    this.t0 = performance.now();
    try {
      for(let i = this.simulation.skipFrames; i < this.simulation.totalFrames; i++) {
        if(!this._running) return;
        this.simulation.update(this.simulation.dt);
        this.simulation.render(this.ctx);
      
        const blob = await new Promise((res) => this.canvas.toBlob(res, "image/png", undefined));
        if(!blob) throw new Error("Error creating image from canvas!");
      
        const filename = `frame_${(i+1).toString().padStart(digits, "0")}.png`;
        const fileHandle = await this._dirHandle.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        this.t1 = performance.now();
        if(i == this.simulation.skipFrames) this.logElm.style.display = "block";
        this.updateInfoLog(i+1);
      }
    
    } finally {
      this.stop();
      this.exportCompletedElm.style.display = "block";
    }
    
  }
  
  embedCSS() {
    if(this.cssEmbedded) return;
    const style = document.createElement("style");
    style.innerHTML = `
    .exporter {
  position: absolute;
  top: 20px;
  right: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  background: rgba(3,14,20,0.4);
  width: 200px;
  padding: 20px;
}
.exporter * {
  font-family: Sans-Serif;
}
.exporter button {
  padding: 10px;
  user-select: none;
  font-weight: 700;
  border-radius: 10px;
  transition: ease 0.2s;
  opacity: 0.6;
  border: 1px solid rgb(79,155,241);
  background: none;
  color: rgb(79,155,241);
}
.exporter .exporter-start {
  width: 100px;
}
.exporter .exporter-stop {
  
  width: 60px;
}
.exporter button:hover {
  background: none!important;
  border-color: rgb(79,155,241)!important;
  color: rgb(79,155,241)!important;
}
.exporter .exporter-title {
  color: rgb(167,208,255);
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 600;
}
.exporter button.active {
  opacity: 1;
  background: rgb(79,161,255);
  user-select: none;
  color: rgb(0,32,114);
  border-color: transparent;
}
.exporter .exporter-flex {
  display: flex;
  gap: 10px;
}
.exporter .exporter-input-div div {
  flex: 1 1 50px;       
  max-width: 100px;
}
.exporter .exporter-input-div {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}
.exporter label {
  color: rgb(131,189,255);
  font-size: 12px;
}
.exporter input {
  padding: 15px;
  width: 100%;
  height: 30px;
  outline: none;
  background: rgb(8,26,47);
  border-radius: 5px;
  color: rgb(83,152,234);
  border: none;
}
.exporter input::placeholder {
  color: rgb(123,183,255);
}
.exporter .export-canvas-resolution {
  color: rgb(154,199,255);
}
.export-log {
  display: none;
  color: rgb(172,211,255);
  font-size: 12px;
  margin-top: 10px;
}
.exporter-exported-frames {
  color: rgb(106,176,255);
  font-weight: 700;
}
.exporter-total-frames {
  color: rgb(83,164,255);
  font-weight: 700;
}
.exporter-eta {
  color: rgb(255,255,255);
  font-size: 16px;
}
.export-completed {
  display: none;
  color: rgb(196,254,255);
  font-size: 14px;
  font-weight: 800;
}

    `;
    
    document.head.append(style);
    this.cssEmbedded = true;
  }
  
  init(selector) {
    this.embedCSS();
    this.elm = document.querySelector(selector);
    const { elm } = this;
    elm.innerHTML = `
    <div class="exporter-title">FRAME EXPORTER</div>
    <div class="exporter-flex">
      <button class="exporter-start active">Export</button>
      <button class="exporter-stop">Stop</button>
    </div>
    <div class="exporter-input-div">
      <div>
        <label for="exporter-fps">FPS</label>
        <input type="text" class="exporter-fps" name="exporter-fps" value="60" placeholder="fps">
      </div>
      <div>
        <label for="exporter-duration">Duration (s)</label>
        <input type="text" class="exporter-duration" name="exporter-duration" value="10" placeholder="duration">
      </div>
      <div>
        <label for="exporter-scalef">Scale Canvas<p class="export-canvas-resolution">1280&times;720</p></label>
        <input type="text" class="exporter-scalef" name="exporter-scalef" value="1" placeholder="Scale">
      </div>
      <div>
        <label for="exporter-skip-frames">Skip Frames<p style="opacity:0;">_</p></label>
        <input type="text" class="exporter-skip-frames" name="exporter-skip-frames" value="0" placeholder="Skip frames">
      </div>
    </div>
    <div class="export-log">
      <p><span class="exporter-exported-frames">720</span> / <span class="exporter-total-frames">1050</span> rendered!</p>
      <p>ETA <span class="exporter-eta">2.3 h</span> (<span class="exporter-progress">70</span>%)</p>
      <p>Current Frame <span class="exporter-current-frame">720</span></p>
      <p class="export-completed">Export successfully completed!</p>
    </div>
    `;
    elm.classList.add("exporter");
    
    
    const startBtn = elm.querySelector(".exporter-start");
    const stopBtn = elm.querySelector(".exporter-stop");

    startBtn.addEventListener("click", () => {
      if(this._running) return;
      this.export();
      stopBtn.classList.add("active");
      startBtn.classList.remove("active");
    })
    stopBtn.addEventListener("click", () => {
      if(!this._running) return;
      this.stop();
      stopBtn.classList.remove("active");
      startBtn.classList.add("active");
    })
    
    this.totalFramesElm = elm.querySelector(".exporter-total-frames");
    this.exportedFramesElm = elm.querySelector(".exporter-exported-frames");
    this.skipFramesElm = elm.querySelector(".exporter-skip-frames");
    this.durationElm = elm.querySelector(".exporter-duration");
    this.fpsElm = elm.querySelector(".exporter-fps");
    this.scaleCanvasElm = elm.querySelector(".export-canvas-resolution");
    this.scalefElm = elm.querySelector(".exporter-scalef");
    this.currentFrameElm = elm.querySelector(".exporter-current-frame");
    this.etaElm = elm.querySelector(".exporter-eta");
    this.exportCompletedElm = elm.querySelector(".export-completed");
    this.progressElm = elm.querySelector(".exporter-progress");
    this.logElm = elm.querySelector(".export-log");
  }
  
  updateInfoLog(frameNumber) {
    const frameRendered = frameNumber - this.simulation.skipFrames;
    this.exportedFramesElm.textContent = frameRendered;
    this.currentFrameElm.textContent = frameNumber;
    this.etaElm.textContent = this._formatTime((this.t1 - this.t0) * 0.001 / (frameRendered) * (this.simulation.totalFrames - frameNumber));
    this.progressElm.textContent = (frameRendered / this.simulation.framesToRender * 100).toFixed(1);
  }
  
  _formatTime(s) {
    if(s < 60) return `${s.toFixed(1)} sec`;
    const m = s / 60;
    if(m < 60) return `${m.toFixed(1)} min`;
    const h = m / 60;
    if(h < 24) return `${h.toFixed(1)} hrs`;
    return `${h/24} days`;
  }
  
}
export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.bindings = new Map();
    this.inputs = new Map();
    this.pressedQueue = new Set();
    this.releasedQueue = new Set();
    this.pointer = { screenX: 0, screenY: 0, canvasX: 0, canvasY: 0 };
    
    this._initEventListeners();
  }
  
  bind(action, ...codes) {
    if(!this.bindings.has(action)) this
    .bindings.set(action, new Set());
    const codesSet = this.bindings.get(action);
    for(let i = 0; i < codes.length; i++) {
      codesSet.add(codes[i]);
    }
  }
  unbind(action, ...codes) {
    if(!this.bindings.has(action)) return;
    for(let i = 0; i < codes.length; i++) {
      this.bindings.get(action).delete(codes[i]);
    }
  }
  
  _initEventListeners() {
    window.addEventListener("keydown", e => {
      if(e.repeat) return;
      this.handleInputStart(e.code);
    })
    window.addEventListener("keyup", e => {
      this.handleInputEnd(e.code);
    })
    this.canvas.addEventListener("pointerdown", e => {
      this.handleInputStart(`Pointer-${e.button}`);
    })
    
    this.canvas.addEventListener("pointermove", e => {
      this.updatePointerCoordinates(e);
    })
    this.canvas.addEventListener("pointerup", e => {
      this.handleInputEnd(`Pointer-${e.button}`);
    })
    this.canvas.addEventListener("contextmenu", e => e.preventDefault());
  }
  
  handleInputStart(code) {
    if(this.inputs.has(code) && this.inputs.get(code)?.down) return;
    this.pressedQueue.add(code);
  }
  
  handleInputEnd(code) {
    this.releasedQueue.add(code);
  }
  
  updatePointerCoordinates(e) {
    this.pointer.screenX = e.clientX;
    this.pointer.screenY = e.clientY;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    this.pointer.canvasX = (e.clientX - rect.left) * scaleX;
    this.pointer.canvasY = (e.clientY - rect.top) * scaleY;
  }
  
  update() {
    
    for(const state of this.inputs.values()) {
      state.released = false;
      state.down = false;
    }
    
    for(const code of this.pressedQueue) {
      let state = this.inputs.get(code);
      if(!state) {
        state = { pressed: false, down: false, released: false };
        this.inputs.set(code, state);
      }
      state.pressed = true;
      state.down = true;
    }
    this.pressedQueue.clear();
    
    for(const code of this.releasedQueue) {
      const state = this.inputs.get(code);
      if(state) {
        state.pressed = false;
        state.released = true;
      }
    }
    this.releasedQueue.clear();
    
  }
  
  
  isDown(action) {
    const codes = this.bindings.get(action);
    if(!codes) return false;
    for(const code of codes) {
      if(this.inputs.get(code)?.down) return true;
    }
    return false;
  }
  
  isPressed(action) {
    const codes = this.bindings.get(action);
    if(!codes) return false;
    for(const code of codes) {
      if(this.inputs.get(code)?.pressed) return true;
    }
    return false;
  }
  
  isReleased(action) {
    const codes = this.bindings.get(action);
    if(!codes) return false;
    for(const code of codes) {
      if(this.inputs.get(code)?.released) return true;
    }
    return false;
  }
  
}
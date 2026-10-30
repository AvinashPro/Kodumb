export class Joystick {
  constructor(selector, rF, rB, rA = null) {
    this.elm = document.body.querySelector(selector);
    this._x = 0;
    this._y = 0;
    this.rF = rF;
    this.rB = rB;
    this.rBInv = 1 / rB;
    this.rA = rA ?? rB;
    this._positionX = 0;
    this._positionY = 0;
    this._rA_Rect = null;
    this.init();
  }
  init() {
    const rA_elm = document.createElement("div");
    const rB_elm = document.createElement("div");
    const rF_elm = document.createElement("div");
    rA_elm.classList.add("joystick-rA");
    rB_elm.classList.add("joystick-rB");
    rF_elm.classList.add("joystick-rF");
    this.elm.appendChild(rA_elm);
    this.elm.appendChild(rB_elm);
    this.elm.appendChild(rF_elm);
    
    rF_elm.style.width = `${2*this.rF}px`;
    rF_elm.style.height = `${2*this.rF}px`;
    rB_elm.style.width = `${2*this.rB}px`;
    rB_elm.style.height = `${2*this.rB}px`;
    rA_elm.style.width = `${2*this.rA}px`;
    rA_elm.style.height = `${2*this.rA}px`;
    this.elm.style.width = `${2*this.rA}px`;
    this.elm.style.height = `${2*this.rA}px`;
    
    this._rA_Rect = rA_elm.getBoundingClientRect();
    window.addEventListener("resize", () => {
      this._rA_Rect = rA_elm.getBoundingClientRect();
    })
    
    rA_elm.addEventListener("pointerdown", e => {
      let dx = (e.clientX - this._rA_Rect.left) - this.rA;
      let dy = (e.clientY - this._rA_Rect.top) - this.rA;
      this.active = true;
      const distSq = dx * dx + dy * dy;
      if(distSq > this.rB * this.rB) {
        const r = this.rB / Math.sqrt(distSq);
        dx *= r;
        dy *= r;
      }
      rF_elm.style.transform = `translate(${dx}px, ${dy}px)`;
      this._positionX = dx;
      this._positionY = dy;
    })
    rA_elm.addEventListener("pointermove", e => {
      let dx = (e.clientX - this._rA_Rect.left) - this.rA;
      let dy = (e.clientY - this._rA_Rect.top) - this.rA;
      this.active = true;
      const distSq = dx * dx + dy * dy;
      if(distSq > this.rA * this.rA) {
        this.active = false;
        rF_elm.style.transform = "translate(0, 0)";
        this._positionX = 0;
        this._positionY = 0;
        return;
      }
      if(distSq > this.rB * this.rB) {
        const r = this.rB / Math.sqrt(distSq);
        dx *= r;
        dy *= r;
      }
      rF_elm.style.transform = `translate(${dx}px, ${dy}px)`;
      this._positionX = dx;
      this._positionY = dy;
    })
    
    rA_elm.addEventListener("pointerup", () => {
      this.active = false;
      rF_elm.style.transform = "translate(0, 0)";
      this._positionX = 0;
      this._positionY = 0;
    })
  }
  
  get x() {
    this._x = this._positionX * this.rBInv;
    return this._x;
  }
  
  get y() {
    this._y = this._positionY * this.rBInv;
    return this._y;
  }
  
}
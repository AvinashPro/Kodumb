let __id = 0;

export default class Joystick {
  constructor({radius = {inner: 20, outer: 40}, color = {inner: "rgba(255,255,255,0.1)", outer: "rgba(255,255,255,0.05)"}, pos = {left: 70, top: 600}, parent = document.body}) {
    
    __id++;
    
    this.id = __id;
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    
    this.base = null;
    this.front = null;
    this.parent = parent;
  }
  
  init() {
    this.base = document.createElement("div");
    this.front =document.createElement("div");
  
    
    this.base.classList.add("joystick-base");
    this.front.classList.add("joystick-front");
    
    this.base.style.width = this.base.style.height = this.radius.outer*2+"px";
    this.front.style.width = this.front.style.height = this.radius.inner*2+"px";
    
    this.base.style.background = this.color.outer;
    this.front.style.background = this.color.inner;
    
    this.base.style.left = (this.pos.left - this.radius.outer)+"px";
    this.base.style.top = (this.pos.top - this.radius.outer)+"px";
    
    
    /*Object.assign(this.base.style, {
      width: this.radius.base+"px",
      height: this.radius.base+"px",
      background: this.color.base,
      left: this.pos.left+"px",
      bottom: this.pos.bottom+"px"
    })*/
    
    this.base.appendChild(this.front);
    this.parent.appendChild(this.base);
    
    this.start();
  }
  
  start() {
    this.base.addEventListener("touchstart", e => {
      let [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
      
      let dx = x - this.pos.left;
      let dy = y - this.pos.top;
      this.front.style.transform = `translate(${dx}px, ${dy}px)`
      //console.log(x,y)
      //this.front.style.left = (x - this.pos.left + this.radius.inner)+"px";
      //this.front.style.top = (y - this.pos.top + this.radius.inner)+"px";
    })
    this.base.addEventListener("touchmove", e => {
      let [x, y] = [e.touches[0].clientX, e.touches[0].clientY];
      
      let dx = x - this.pos.left;
      let dy = y - this.pos.top;
      
      let dis = Math.hypot(dx, dy);
      if(dis > this.radius.outer) {
        dx = dx / dis * this.radius.outer;
        dy = dy / dis * this.radius.outer;
      }
      
      //this.front.style.left = (this.radius.inner + dx) + "px";
      //this.front.style.top = (this.radius.inner + dy) + "px";
      this.front.style.transform = `translate(${dx}px, ${dy}px)`
      
      //console.log(x,y);
     // this.front.style.left = (x - this.pos.left + this.radius.inner)+"px";
     // this.front.style.top = (y - this.pos.top + this.radius.inner)+"px";
      
    })
    
    this.base.addEventListener("touchend", e => {
      this.end();
    })
    this.base.addEventListener("touchcancel", e => {
      this.end();
    })
  }
  
  end() {
    let dx = this.radius.outer - this.radius.inner * 2;
    this.front.style.transform = `translate(${dx}px, ${dx}px)`
   // this.front.style.left = (this.radius.outer - this.radius.inner) + "px";
   // this.front.style.top = (this.radius.outer - this.radius.inner) + "px";
    
  }
  
}
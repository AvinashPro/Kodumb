import System from "../ecs/System.js"

export default class InputSystem extends System {
  constructor() {
    super();
  }
  
  init(world) {
    this.query = world.createQuery("Input");
    const entities = this.query.entities;
    //console.log(entities.size)
    for(const e of entities) {
      const input = e.get("Input");
      const states = input.states;
      
      
      for(const [state, data] of Object.entries(states)) {
        
        const elmID= data.id;
        const keys = data.keys;
        
        if(elmID) {
          document.getElementById(elmID).addEventListener("touchstart", () => {
            data.isDown = true;
          })
          document.getElementById(elmID).addEventListener("touchend", () => {
            data.isDown = false;
          })
        }
        
        if(keys.length === 0) continue;
        window.addEventListener("keydown", e => {
          if(keys.contain(e.keyCode)) {
            data.isDown = true;
          }
        })
        window.addEventListener("keyup", e => {
          if(keys.contain(e.keyCode)) {
            data.isDown = false;
          }
        })
        
        
        
      }
    }
    
  }
  
  
  
  
  update() {
    for(const e of this.query.entities) {
      const input = e.get("Input");
      const body = e.get("Body");
      const pos = e.get("Position").pos;
      const anim = e.get("Animate");
      
      if(input.isDown("jump")) {
        //anim.currentState = "jump";
        if(body.grounded) {
          let factor;
          body.gravityScale > 0 ? factor = 1 : factor = -1;
          body.vel.y = - body.jumpForce * factor;
        }
        body.grounded = false;
      }
      
      if(input.isDown("left")) {
        body.vel.x = - 100;
      } else if(input.isDown("right")) {
        body.vel.x = 100;
        anim.currentState = "run";
      }
      if(input.isDown("up")) {
        body.vel.y = - 100;
      } else if(input.isDown("down")) {
        body.vel.y = 100;
      }
      
    }
  }
  
  handleInput() {
    
  }
  
}
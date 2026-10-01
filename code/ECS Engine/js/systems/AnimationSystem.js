import System from "../ecs/System.js"

export default class AnimationSystem extends System {
  constructor() {
    super();
  }
  
  init(world) {
    this.query = world.createQuery("Animate");
    this.entities = this.query.entities;
  }
  
  update(world, dt) {
    const entities = this.entities;
    //document.querySelector("#dev2").textContent = this.query.entities.size;
    for(const e of entities) {
      const animate = e.get("Animate");
      const spritesheet = e.get("Sprite").spritesheet;
      
      //if(animate.states.size == 0) continue;
      let cont = false;
      for(let key in animate.states) {
        if(Object.hasOwn(animate.states, key)) {
          cont = true;
        }
      }
      if(!cont) continue;
      
      
      const currentState = animate.currentState;
      animate.elapsedTime += dt * 1000;
      if(animate.elapsedTime > animate.time) {
        animate.currentFrame = animate.states[currentState][animate.currentFrameIdx];
        animate.currentFrameIdx++;
        if(animate.currentFrameIdx === animate.states[currentState].length) {
          animate.currentFrameIdx = 0;
        }
        animate.elapsedTime = 0;
      //document.querySelector("#dev2").textContent = animate.currentFrame;
      }
      
      
    }
    
  }
}
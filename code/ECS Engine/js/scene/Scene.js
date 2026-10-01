import World from "../ecs/World.js"


export default class Scene {
  
  constructor() {
    //this.entities = [];
    this.world = new World(this);
  }
  
  update(dt) {
    this.world.update(dt);
  }
  /*
  add(entity) {
    this.entities.push(entity);
  }*/
  /*
  update(dt) {
    this.entities.forEach(entity => {
      entity.update(dt);
    })
  }*/
  
}
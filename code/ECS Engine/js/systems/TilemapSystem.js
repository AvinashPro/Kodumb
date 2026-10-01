import System from "../ecs/System.js"

export default class TilemapSystem extends System {
  constructor() {
    super();
  }
  
  init(world) {
    this.query = world.createQuery("Tilemap");
  }
  
  
  
}
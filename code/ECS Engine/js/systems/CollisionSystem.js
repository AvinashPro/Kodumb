import System from "../ecs/System.js"
import AABB from "../physics/AABB.js"
import ResolveKinematicStaticCollision from "../physics/ResolveKinematicStaticCollision.js"

export default class CollisionSystem extends System {
  
  constructor(grid) {
    super();
    this.grid = grid;
  }
  
  init(world) {
    this.query = world.createQuery("Position", "Collider");
  }
  
  update(world, dt) {
    
    this.grid.clear();
    const entities = this.query.entities;
    for(const entity of entities) {
      const pos = entity.get("Position").pos;
      this.grid.insert(entity, pos.x, pos.y);
    }
    
    for(const entity of entities) {
      const pos1 = entity.get("Position").pos;
      const col1 = entity.get("Collider");
      
      const nearby = this.grid.query(pos1.x, pos1.y);
      
      for(const e of nearby) {
        if(entity.id >= e.id) continue;
        
        const pos2 = e.get("Position").pos;
        const col2 = e.get("Collider");
        
        if(this.checkCollision(pos1, col1, pos2, col2)) {
          this.handleCollision(entity, e);
        }
        
      }
      
    }
    
    /*const entities = world.entities;
    
    for(let i = 0; i < entities.length; i++) {
      for(let j = i + 1; j < entities.length; j++) {
        
        const a = entities[i];
        const b = entities[j];
        
        if(AABB(
          {x: a.pos.x, y: a.pos.y, w: a.w, h: a.h},
          {x: b.pos.x, y: b.pos.y, w: b.w, h: b.h}
        )) {
          console.log("Collision Happened! Resolve it!")
        }
        
      }
    }
    */
  }
  
  checkCollision(pos1, col1, pos2, col2) {
    return AABB(pos1, col1, pos2, col2);
  }
  
  handleCollision(e1, e2) {
    const t1 = e1.get("Body").type;
    const t2 = e2.get("Body").type;
    
    if(t1 + t2 === "KinematicStatic" || t1 + t2 === "StaticKinematic") {
      ResolveKinematicStaticCollision(e1, e2);
    }
    //if(t1 == "Kinematic" &&)
    
  }
  
}
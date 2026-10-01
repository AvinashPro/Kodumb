import System from "../ecs/System.js"
import AABB from "../physics/AABB.js"
import ResolveKinematicStaticCollision from "../physics/ResolveKinematicStaticCollision.js"
//import Position from "../components/Position.js"
//import Velocity from "../components/Velocity.js"

export default class PhysicsSystem extends System {
  constructor(grid) {
    super();
    this.grid = grid;
  }
  
  init(world) {
    this.query = world.createQuery("Position", "Body");
    this.collisionQuery = world.createQuery("Position", "Collider");
  }
  
  update(world, dt) {
    const entities = this.query.entities;
    for(const entity of entities) {
      let pos = entity.get("Position").pos;
      let body = entity.get("Body");
      if(body.type === "Static") continue;
      
      pos.oldX = pos.x;
      body.vel.x += body.acceleration.x;
      body.vel.x *= (1 - body.friction);
      pos.x += body.vel.x * dt;
      
    }
    
    this.doCollision(0);
    if(world.tilemap) {
      this.handleTilemapCollision(world, 0);
    }
    
    for(const entity of entities) {
      let pos = entity.get("Position").pos;
      let body = entity.get("Body");
      if(body.type === "Static") continue;
      
      pos.oldY = pos.y;
      body.vel.y += body.acceleration.y * dt;
      //body.vel.y *= (1 - body.friction);
      body.vel.y += body.gravityScale * 8000 * dt;
      pos.y += body.vel.y * dt;
      
    }
    
    this.doCollision(1);
    if(world.tilemap) {
      this.handleTilemapCollision(world, 1);
    }
      
      /*pos.y += body.vel.y * dt;
      this.doCollision(1);
      if(world.tilemap) {
        this.handleTilemapCollision(world, 1);
      }*/
      //pos.y += body.gravityScale * 100 * dt;
     // pos.x += vel.x * dt;
     // pos.y += vel.y * dt;
      
    
    
    
  }
  
  updateGrid() {
    
    this.grid.clear();
    const entities = this.collisionQuery.entities;
    for(const entity of entities) {
      this.grid.insert(entity);
    }
    
  }
  
  doCollision(axis) {
    this.updateGrid();
    const entities = this.collisionQuery.entities;
    
    for(const e1 of entities) {
      const p1 = e1.get("Position").pos;
      const c1 = e1.get("Collider");
      const t1 = e1.get("Body").type;
      const nearbyEntities = this.grid.query(p1.x, p1.y);
      for(const e2 of nearbyEntities) {
        const t2 = e2.get("Body").type;
        if(e1.id >= e2.id || (t1 === "Static" && t2 === "Static")) continue;
        const p2 = e2.get("Position").pos;
        const c2 = e2.get("Collider");
        
        
        if(this.checkCollision(p1, c1, p2, c2)) {
          this.handleCollision(e1, e2, axis);
        }
        
      }
    }
    
  }

  
  checkCollision(pos1, col1, pos2, col2) {
    return AABB(pos1.x, pos1.y, col1.w, col1.h, pos2.x, pos2.y, col2.w, col2.h);
  }
  
  handleCollision(e1, e2, axis) {
    this.resolve(e1, e2, axis);
  }
  
  resolve(e1, e2, axis) {
    const t1 = e1.get("Body").type;
    const t2 = e2.get("Body").type;
    
    if(t1+t2 === "KinematicStatic" || t1+t2 === "StaticKinematic") {
      ResolveKinematicStaticCollision(e1, e2, axis);
    }
    
  }
  
  handleTilemapCollision(world, axis) {
    const tilemap = world.tilemap;
    const entities = tilemap.entities;
    
    
    for(const e of entities) {
      const p = e.get("Position").pos;
      const collider = e.get("Collider");
      const body = e.get("Body");
      const vel = body.vel;
      const w = collider.w;
      const h = collider.h;
      const s = tilemap.tileSize;
      const minX = Math.floor(p.x / s);
      const minY = Math.floor(p.y / s);
      const maxX = Math.floor((p.x + w) / s);
      const maxY = Math.ceil((p.y + h) / s);
      
      const layers = tilemap.tileData;
      const layer = layers[layers.length - 1];
      const collidableTiles = tilemap.collidableTiles;
      //e.get("Sprite").color = "rgba(255,255,255,0.7)"
      for(let r = minY; r <= maxY; r++) {
        for(let c = minX; c <= maxX; c++) {
          //let rval = layer[r];
          //if(!rval) continue;
          let val = layer[r * tilemap.columns + c];
          
          if(!collidableTiles.includes(val)) continue;
          
          let x = c * s;
          let y = r * s;
          if(AABB(x, y, s, s, p.x, p.y, w, h)) {
            //e.get("Sprite").color = "rgba(255,255,255,0.4)"
            this.TilemapCollisionResolve(e, p, body, vel, w, h, axis, x, y, s);
          }
          
        }
      }
      
      
    }
    
    
  }
  
  TilemapCollisionResolve(e, pos, body, vel, w, h, axis, x, y, s) {
    if(axis) {
      let dy = pos.y - pos.oldY;
      if(dy > 0) {
        pos.y = y - h;
        vel.y = 0;
        body.grounded = true;
      } else if(dy < 0) {
        pos.y = y + s;
        vel.y = 10;
      }
    } else {
      let dx = pos.x - pos.oldX;
      if(dx > 0) {
        pos.x = x - w;
        vel.x = 0;
      } else if(dx < 0) {
        pos.x = x + s;
        vel.x = 0;
      }
    }
  }
  
  
}
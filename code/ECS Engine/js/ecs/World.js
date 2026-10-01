import Query from "../ecs/Query.js"

export default class World {
  
  constructor(scene) {
    this.scene = scene;
    this.id = null; // SCENE_ID
    this.entities = [];
    this.systems = [];
    this.components = new Map();
    this.queries = [];
  }
  
  addEntity(entity) {
    this.entities.push(entity);
    for(const query of this.queries) {
      //console.log(query.entities.size,entity)
      if(query.matches(entity)) {
        query.entities.add(entity);
      }
    }
  }
  
  addComponent(entity, component) {
    const name = component.constructor.name;
    
    if(!this.components.has(name)) {
      this.components.set(name, new Set());
    }
    // this.components has no use right now (it was replaced by more effective this.queries)
    this.components.get(name).add(entity);
    entity.add(component);
    
    for(const query of this.queries) {
      if(query.matches(entity)) {
        query.entities.add(entity);
      }
    }
    
  }
  
  addSystem(system) {
    this.systems.push(system);
    if(system.init) {
      system.init(this);
    }
  }
  
  addTilemap(tilemap) {
    this.tilemap = tilemap;
  }
  
  update(dt) {
    this.systems.forEach(system => {
      system.update(this, dt);
    })
  }
  
  
  /*query(...components) {
    const sets = components.map(c => this.components.get(c));*/
    
    /*if(sets.some(set => !set)) {
      return [];
    }*/
    /*
    let smallest = sets.reduce((a, b) => a.size < b.size ? a : b);
    
    const result = [];
    for(const entity of smallest) {
      let match = true;
      for(const set of sets) {
        if(!set.has(entity)) {
          match = false;
          break;
        }
      }
      if(match) result.push(entity);
    }
    
    return result; */
    
    /*if(!sets.length) return [];
    
    return [...sets.reduce((a,b)=>
      new Set([...a].filter(x=>b.has(x)))
    )]*/
  //}
  
  createQuery(...components) {
    const query = new Query(components);
    this.queries.push(query);
    
    for(const e of this.entities) {
      if(query.matches(e)) {
        query.entities.add(e);
      }
    }
    
    return query;
    
  }
  
}
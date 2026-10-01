let ENTITY_ID = 0;

export default class Entity {
  constructor() {
    this.id = ENTITY_ID++;
    this.components = new Map();
  }
  
  add(component) {
    this.components.set(component.constructor.name, component);
  }
  
  get(name) {
    return this.components.get(name);
  }
  
  has(name) {
    return this.components.has(name);
  }
  
}
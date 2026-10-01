export default class Query {
  constructor(components) {
    this.entities = new Set();
    this.components = components;
  }
  matches(entity) {
    return this.components.every(c => entity.has(c));
  }
}
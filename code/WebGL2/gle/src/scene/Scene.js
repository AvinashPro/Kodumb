export class Scene {
  meshes = [];
  
  add(mesh) {
    this.meshes.push(mesh);
    return mesh;
  }
  
  // TODO: Put removal in a queue so that meshes to be removed gets removed at thw start of the next frame rather than between a mid frame
  remove(mesh) {
    const idx = this.meshes.indexOf(mesh);
    if(i >= 0) this.meshes.splice(idx, 1);
  }
  
  update(dt) {
    for(const m of this.meshes) m.update(dt);
  }
  
}
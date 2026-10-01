export default class SceneManager {
  constructor(scene) {
    this.sceneStack = [];
    //this.SCENE_ID = 0;
  }
  
  push(...scenes) {
    for(const scene of scenes) {
      //scene.world.id = this.SCENE_ID++;
      this.sceneStack.push(scene);
    }
    //this.sceneStack.push(scene);
  }
  
  update(dt) {
      //console.log(this.sceneStack.length)
    if(!this.sceneStack) return;
    
    this.sceneStack[0].world.id = 0;
    
    for(let i = this.sceneStack.length - 1; i >= 0; i--) {
      const scene = this.sceneStack[i];
      if(scene.blocksUpdate) {
        scene.update(dt);
        break;
      }
      scene.update(dt);
      
      
      let transition = scene.transition;
      if(transition) {
        if(transition.finished) {
          if(transition.removeOnCompletion) this.sceneStack.splice(i, 1);
          transition = null;
          continue;
        }
        transition.update(dt);
        //scene.world.updateTransition();
        //scene.scene.transition.type();
      }
    }
  }
  
  
  
}
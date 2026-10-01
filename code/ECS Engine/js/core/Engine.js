import Time from "./Time.js"
import AssetLoader from "../utils/AssetLoader.js"
//import World from "../ecs/World.js"

export default class Engine {
  
  constructor(sceneManager, systems = []) {
    this.sceneManager = sceneManager;
    this.systems = systems;
    this.running = false;
    
    this.time = new Time();
    /*this.now = 0;
    this.then = 0;*/
    
    //this.world = new World();
    
  }
  
  start() {
    this.running = true;
    requestAnimationFrame(this.loop.bind(this));
  }
  
  loop() {
    if (!this.running) return;
    
    
    this.time.update();
    let dt = this.time.dt;
    
    this.sceneManager.update(dt);
    /*
    this.systems.forEach(system => {
      system.update(this.scene, dt);
    })*/
    
    
    requestAnimationFrame(this.loop.bind(this));
    
    
    document.getElementById("dev").textContent = `FPS ${this.time.fps}`
    /*if((this.time.elapsed - Math.floor(this.time.elapsed)) > 0.95) {
      document.getElementById("dev").innerHTML = `Fps ${Math.floor(1/dt)}`;
    }*/
    
  }
  
  stop() {
    this.running = false;
  }
  
  load(assetData, callback) {
    const assets = new AssetLoader(assetData);
    assets.load(this, callback);
    return assets;
  }
  
}
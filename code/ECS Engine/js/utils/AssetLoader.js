export default class AssetLoader {
  
  constructor(data = {}) {
    
    this.data = data;
    this.assets = new Map();
    
    this.itemsLoaded = 0;
    this.itemsToLoad = Object.keys(data).length;
    
    this.sizeLoaded = 0;
    this.sizeToLoad = 0;
    
    this.progress = 0;
  }
  
  load(engine, callback) {
   
    if(this.itemsToLoad == 0) {
      this.progress = 100;
      return;
    }
    
    for(const [name, props] of Object.entries(this.data)) {
      if(!props.size) break;
      this.sizeToLoad += props.size;
    }
    
    
    for(const [name, props] of Object.entries(this.data)) {
      this[`load${props.type}`](props.url).then(value => {
        
        this.assets.set(name, value);
        
        this.itemsLoaded += 1;
        
        if(this.sizeToLoad !== 0) {
          this.sizeLoaded += props.size;
          this.progress = this.sizeLoaded / this.sizeToLoad * 100;
        } else {
          this.progress = this.itemsLoaded / this.itemsToLoad * 100;
        }
        
        
        
        if(this.progress === 100) {
          engine.assets = this;
          callback();
        }
        
      })
    }
    
    
  }
  
  
  loadImg(url) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      }
      img.onerror = () => {
        reject();
      }
    })
  }
  
  loadAud(url) {
    
  }
  
  loadJSON(url) {
    return new Promise((resolve, reject) => {
      let request = fetch(url);
      request.then(response => {
        resolve(response.json());
      }).catch(() => {
        reject();
      })
      
    })
  }
  
  get(name) {
    return this.assets.get(name);
  }
  
}